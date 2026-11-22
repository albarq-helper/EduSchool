-- =====================================================================
-- Helper Academy — v17: Story builder (a child's story plan, the finished story, and its movie)
-- Run AFTER supabase_v16_word_coverage.sql (safe to run more than once).
-- blocks: [{"k":"w","w":"Rover"} | {"k":"t","t":"one sunny day"} | {"k":"s"} (new scene)]
-- status: draft -> sent (to parent) -> written (story pasted) -> filmed (movie added)
-- =====================================================================
create table if not exists public.stories (
  id         uuid primary key default gen_random_uuid(),
  owner_id   uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  set_id     uuid references public.study_sets(id) on delete set null,
  title      text not null default 'My story' check (length(trim(title)) between 1 and 120),
  blocks     jsonb not null default '[]'::jsonb check (jsonb_typeof(blocks) = 'array' and jsonb_array_length(blocks) <= 200),
  status     text not null default 'draft' check (status in ('draft','sent','written','filmed')),
  story_text text not null default '' check (length(story_text) <= 20000),
  video_url  text not null default '' check (video_url = '' or video_url ~ '^(https://|assets/)'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists stories_owner_idx on public.stories (owner_id, updated_at desc);

create or replace function public.touch_story() returns trigger language plpgsql as $$
begin new.updated_at := now(); new.owner_id := old.owner_id; return new; end $$;
drop trigger if exists stories_touch on public.stories;
create trigger stories_touch before update on public.stories for each row execute function public.touch_story();

alter table public.stories enable row level security;
drop policy if exists "own stories read" on public.stories;
create policy "own stories read" on public.stories for select to authenticated using (owner_id = auth.uid());
drop policy if exists "own stories add" on public.stories;
create policy "own stories add" on public.stories for insert to authenticated with check (owner_id = auth.uid());
drop policy if exists "own stories edit" on public.stories;
create policy "own stories edit" on public.stories for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
drop policy if exists "own stories delete" on public.stories;
create policy "own stories delete" on public.stories for delete to authenticated using (owner_id = auth.uid());
grant select, insert, update, delete on public.stories to authenticated;

select count(*) as stories from public.stories;
