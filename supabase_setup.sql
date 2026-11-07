-- =====================================================================
-- Grade 5 Vocabulary — Supabase database setup
-- Run once in Supabase: SQL Editor → New query → paste → Run.
-- Teachers create classes and share a join code; students join with it.
-- Row Level Security: a student sees only their own data; a teacher sees
-- the data of students in the teacher's own classes.
-- =====================================================================

-- ---------- Tables ----------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null default '',
  role        text not null default 'student' check (role in ('student','teacher')),
  created_at  timestamptz not null default now()
);

create table if not exists public.classes (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (length(name) between 1 and 80),
  teacher_id  uuid not null references public.profiles(id) on delete cascade,
  join_code   text not null unique default upper(substr(md5(gen_random_uuid()::text), 1, 6)),
  created_at  timestamptz not null default now()
);

create table if not exists public.class_members (
  class_id    uuid not null references public.classes(id) on delete cascade,
  student_id  uuid not null references public.profiles(id) on delete cascade,
  joined_at   timestamptz not null default now(),
  primary key (class_id, student_id)
);

create table if not exists public.attempts (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  activity    text not null check (activity in
                ('exam','picture-match','definition-match','unscramble',
                 'spell-look-cover','spell-missing-letters','spell-syllables','spell-test')),
  detail      text not null default '',       -- e.g. question type or level
  units       int[] not null default '{}',     -- units chosen for this attempt
  word_list   text not null default '',        -- e.g. 'Practice list: Reem first exam'
  score       int  not null check (score >= 0),
  total       int  not null check (total > 0 and score <= total),
  created_at  timestamptz not null default now()
);
create index if not exists attempts_student_idx on public.attempts (student_id, created_at desc);

create table if not exists public.attempt_answers (
  attempt_id  uuid not null references public.attempts(id) on delete cascade,
  position    int  not null,
  word        text not null,
  unit        int  not null,
  given       text not null default '',
  correct     boolean not null,
  primary key (attempt_id, position)
);
create index if not exists answers_word_idx on public.attempt_answers (word);

create table if not exists public.practice_lists (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references public.profiles(id) on delete cascade,
  created_by  uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  name        text not null check (length(name) between 1 and 100),
  words       text[] not null check (cardinality(words) between 1 and 300),
  score       int,
  total       int,
  created_at  timestamptz not null default now()
);
create index if not exists lists_student_idx on public.practice_lists (student_id, created_at desc);

-- ---------- Helper functions (security definer, fixed search_path) ----------
create or replace function public.is_teacher()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'teacher');
$$;

create or replace function public.teaches(p_student uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from class_members m join classes c on c.id = m.class_id
    where m.student_id = p_student and c.teacher_id = auth.uid());
$$;

create or replace function public.in_class(p_class uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from class_members where class_id = p_class and student_id = auth.uid());
$$;

-- Students join a class with its code (they cannot read the classes table directly first).
create or replace function public.join_class(p_code text)
returns table (class_id uuid, class_name text)
language plpgsql security definer set search_path = public as $$
declare c classes%rowtype;
begin
  if auth.uid() is null then raise exception 'Not signed in'; end if;
  select * into c from classes where join_code = upper(trim(p_code));
  if not found then raise exception 'No class has that code'; end if;
  insert into class_members (class_id, student_id) values (c.id, auth.uid()) on conflict do nothing;
  return query select c.id, c.name;
end $$;

-- Create a profile row automatically when someone signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, full_name, role)
  values (new.id,
          coalesce(new.raw_user_meta_data->>'full_name', ''),
          case when new.raw_user_meta_data->>'role' = 'teacher' then 'teacher' else 'student' end)
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Users may change their own name, but never their own role.
create or replace function public.protect_role()
returns trigger language plpgsql as $$
begin
  if new.role is distinct from old.role and current_user not in ('postgres','service_role','supabase_admin') then
    raise exception 'Role cannot be changed from the website';
  end if;
  return new;
end $$;
drop trigger if exists profiles_protect_role on public.profiles;
create trigger profiles_protect_role before update on public.profiles
  for each row execute function public.protect_role();

-- ---------- Row Level Security ----------
alter table public.profiles        enable row level security;
alter table public.classes         enable row level security;
alter table public.class_members   enable row level security;
alter table public.attempts        enable row level security;
alter table public.attempt_answers enable row level security;
alter table public.practice_lists  enable row level security;

-- profiles
drop policy if exists "read own or my students" on public.profiles;
create policy "read own or my students" on public.profiles for select to authenticated
  using (id = auth.uid() or public.teaches(id));
drop policy if exists "update own" on public.profiles;
create policy "update own" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- classes
drop policy if exists "teacher reads own classes, students read joined" on public.classes;
create policy "teacher reads own classes, students read joined" on public.classes for select to authenticated
  using (teacher_id = auth.uid() or public.in_class(id));
drop policy if exists "teacher creates classes" on public.classes;
create policy "teacher creates classes" on public.classes for insert to authenticated
  with check (teacher_id = auth.uid() and public.is_teacher());
drop policy if exists "teacher edits own classes" on public.classes;
create policy "teacher edits own classes" on public.classes for update to authenticated
  using (teacher_id = auth.uid()) with check (teacher_id = auth.uid());
drop policy if exists "teacher deletes own classes" on public.classes;
create policy "teacher deletes own classes" on public.classes for delete to authenticated
  using (teacher_id = auth.uid());

-- class_members (joining goes through join_class())
drop policy if exists "see own membership or my class" on public.class_members;
create policy "see own membership or my class" on public.class_members for select to authenticated
  using (student_id = auth.uid() or exists (select 1 from public.classes c where c.id = class_id and c.teacher_id = auth.uid()));
drop policy if exists "teacher removes, student leaves" on public.class_members;
create policy "teacher removes, student leaves" on public.class_members for delete to authenticated
  using (student_id = auth.uid() or exists (select 1 from public.classes c where c.id = class_id and c.teacher_id = auth.uid()));

-- attempts
drop policy if exists "student adds own attempts" on public.attempts;
create policy "student adds own attempts" on public.attempts for insert to authenticated
  with check (student_id = auth.uid());
drop policy if exists "read own or my students' attempts" on public.attempts;
create policy "read own or my students' attempts" on public.attempts for select to authenticated
  using (student_id = auth.uid() or public.teaches(student_id));

-- attempt_answers
drop policy if exists "student adds answers to own attempts" on public.attempt_answers;
create policy "student adds answers to own attempts" on public.attempt_answers for insert to authenticated
  with check (exists (select 1 from public.attempts a where a.id = attempt_id and a.student_id = auth.uid()));
drop policy if exists "read answers of visible attempts" on public.attempt_answers;
create policy "read answers of visible attempts" on public.attempt_answers for select to authenticated
  using (exists (select 1 from public.attempts a where a.id = attempt_id and (a.student_id = auth.uid() or public.teaches(a.student_id))));

-- practice_lists
drop policy if exists "read own lists or my students' lists" on public.practice_lists;
create policy "read own lists or my students' lists" on public.practice_lists for select to authenticated
  using (student_id = auth.uid() or public.teaches(student_id));
drop policy if exists "create list for self or my student" on public.practice_lists;
create policy "create list for self or my student" on public.practice_lists for insert to authenticated
  with check (created_by = auth.uid() and (student_id = auth.uid() or public.teaches(student_id)));
drop policy if exists "delete lists I made or own" on public.practice_lists;
create policy "delete lists I made or own" on public.practice_lists for delete to authenticated
  using (created_by = auth.uid() or student_id = auth.uid());

-- ---------- Privileges ----------
revoke all on all tables in schema public from anon;
grant select, insert, update, delete on all tables in schema public to authenticated;
revoke execute on function public.join_class(text) from public, anon;
grant execute on function public.join_class(text) to authenticated;
