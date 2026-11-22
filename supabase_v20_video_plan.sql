-- =====================================================================
-- Helper Academy — v20: keep the AI's "VIDEO SCENE" lines with each story (used to make the movie)
-- Run AFTER supabase_v19_parent.sql (safe to run more than once).
-- =====================================================================
alter table public.stories add column if not exists video_plan text not null default '';
alter table public.stories drop constraint if exists stories_video_plan_check;
alter table public.stories add constraint stories_video_plan_check check (length(video_plan) <= 10000);
select count(*) as stories, count(*) filter (where video_plan <> '') as with_plan from public.stories;
