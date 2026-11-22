-- =====================================================================
-- Helper Academy — v19: parent account (a teacher account with a "Family" class),
-- parent access to the student's stories, and an AI usage log (for daily limits).
-- Run AFTER supabase_v18_story_levels.sql (safe to run more than once).
-- =====================================================================

-- Family class: parent albarq2000@hotmail.com, student Reem (reem.farhat@hotmail.com)
insert into public.classes (id, name, teacher_id)
select '00000000-0000-4000-8000-0000000fa001', 'Family', p.id
from public.profiles p join auth.users u on u.id = p.id
where u.email = 'albarq2000@hotmail.com' and p.role = 'teacher'
on conflict (id) do nothing;
insert into public.class_members (class_id, student_id)
select '00000000-0000-4000-8000-0000000fa001', u.id from auth.users u where u.email = 'reem.farhat@hotmail.com'
on conflict do nothing;

-- Parents/teachers can read and update the stories of students in their classes
drop policy if exists "teacher reads student stories" on public.stories;
create policy "teacher reads student stories" on public.stories for select to authenticated using (public.teaches(owner_id));
drop policy if exists "teacher updates student stories" on public.stories;
create policy "teacher updates student stories" on public.stories for update to authenticated
  using (public.teaches(owner_id)) with check (public.teaches(owner_id));

-- AI / paid-service usage log. Only the server (Edge Functions, service role) writes it.
create table if not exists public.ai_usage (
  id          bigserial primary key,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  service     text not null check (service in ('openai','fal','elevenlabs')),
  task        text not null default '',
  story_id    uuid references public.stories(id) on delete set null,
  tokens_in   int not null default 0,
  tokens_out  int not null default 0,
  ok          boolean not null default true,
  created_at  timestamptz not null default now()
);
create index if not exists ai_usage_user_day on public.ai_usage (user_id, created_at desc);
alter table public.ai_usage enable row level security;
drop policy if exists "own ai usage read" on public.ai_usage;
create policy "own ai usage read" on public.ai_usage for select to authenticated using (user_id = auth.uid());
grant select on public.ai_usage to authenticated;

select c.name as class, t.full_name as parent, s.full_name as student
from public.classes c join public.profiles t on t.id = c.teacher_id
join public.class_members m on m.class_id = c.id join public.profiles s on s.id = m.student_id
where c.id = '00000000-0000-4000-8000-0000000fa001';
