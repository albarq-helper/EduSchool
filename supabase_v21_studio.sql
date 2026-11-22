-- =====================================================================
-- Helper Academy — v21: Director's Studio (shots per scene, the movie bucket) + a demo story from Reem
-- Run AFTER supabase_v20_video_plan.sql (safe to run more than once).
-- =====================================================================
alter table public.stories add column if not exists film_style text not null default '';
alter table public.stories drop constraint if exists stories_film_style_check;
alter table public.stories add constraint stories_film_style_check check (length(film_style) <= 2000);

-- One row per take of a scene. The newest finished take of each scene goes into the movie.
create table if not exists public.story_shots (
  id           uuid primary key default gen_random_uuid(),
  story_id     uuid not null references public.stories(id) on delete cascade,
  scene        int  not null check (scene between 1 and 50),
  prompt       text not null check (length(prompt) between 5 and 4000),
  status       text not null default 'queued' check (status in ('queued','shooting','ready','failed')),
  request_id   text not null default '',
  status_url   text not null default '',
  response_url text not null default '',
  video_url    text not null default '',
  error        text not null default '',
  created_by   uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists story_shots_story on public.story_shots (story_id, scene, created_at desc);
alter table public.story_shots enable row level security;
create or replace function public.can_see_story(p_story uuid) returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from stories s where s.id = p_story and (s.owner_id = auth.uid() or public.teaches(s.owner_id)));
$$;
create or replace function public.can_direct_story(p_story uuid) returns boolean language sql stable security definer set search_path = public as $$
  select public.is_teacher() and exists (select 1 from stories s where s.id = p_story and (s.owner_id = auth.uid() or public.teaches(s.owner_id)));
$$;
drop policy if exists "see shots of visible stories" on public.story_shots;
create policy "see shots of visible stories" on public.story_shots for select to authenticated using (public.can_see_story(story_id));
drop policy if exists "director adds shots" on public.story_shots;
create policy "director adds shots" on public.story_shots for insert to authenticated with check (created_by = auth.uid() and public.can_direct_story(story_id));
drop policy if exists "director updates shots" on public.story_shots;
create policy "director updates shots" on public.story_shots for update to authenticated using (public.can_direct_story(story_id)) with check (public.can_direct_story(story_id));
drop policy if exists "director deletes shots" on public.story_shots;
create policy "director deletes shots" on public.story_shots for delete to authenticated using (public.can_direct_story(story_id));
grant select, insert, update, delete on public.story_shots to authenticated;

-- Public bucket for finished movie clips (fal's own links can expire, so clips are copied here)
do $$
begin
  if exists (select 1 from pg_namespace where nspname = 'storage') then
    insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    values ('movies', 'movies', true, 52428800, array['video/mp4','video/webm','audio/mpeg','image/jpeg','image/png'])
    on conflict (id) do nothing;
    execute 'drop policy if exists "directors upload movie clips" on storage.objects';
    execute $p$create policy "directors upload movie clips" on storage.objects for insert to authenticated
      with check (bucket_id = 'movies' and public.is_teacher())$p$;
  end if;
end $$;

-- Demo: a story Reem has planned and sent to her parent (level 3: words + her own linking words)
insert into public.stories (id, owner_id, set_id, title, level, status, blocks)
select '00000000-0000-4000-8000-00000000d5e1', u.id, '00000000-0000-4000-8000-000000000005',
  'Rover and the Secret Writer', 3, 'sent',
  '[{"k":"t","t":"One day,"},{"k":"w","w":"Rover"},{"k":"t","t":"went to visit a new"},{"k":"w","w":"Region"},
    {"k":"s"},{"k":"t","t":"There he found a cottage with a roof of"},{"k":"w","w":"Thatch"},{"k":"t","t":"and a sleepy dog in its"},{"k":"w","w":"Kennel"},{"k":"t","t":"while a little mouse was"},{"k":"w","w":"Scampering"},
    {"k":"s"},{"k":"t","t":"Inside lived an old"},{"k":"w","w":"Bookkeeper"},{"k":"t","t":"who now lived on his"},{"k":"w","w":"Pension"},{"k":"t","t":"because"},
    {"k":"t","t":"every night he wrote books under a"},{"k":"w","w":"Pseudonym"},
    {"k":"s"},{"k":"t","t":"Suddenly,"},{"k":"t","t":"an"},{"k":"w","w":"Exotic"},{"k":"t","t":"visitor knocked at the door!"},{"k":"t","t":"In the end,"},{"k":"t","t":"they all became friends."}]'::jsonb
from auth.users u where u.email = 'reem.farhat@hotmail.com'
on conflict (id) do nothing;

select s.title, p.full_name as by, s.status, s.level, jsonb_array_length(s.blocks) as steps from public.stories s join public.profiles p on p.id = s.owner_id order by s.updated_at desc;
