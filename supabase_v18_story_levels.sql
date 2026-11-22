-- =====================================================================
-- Helper Academy — v18: Story builder levels (1-10), the child's own sentences, and feedback
-- Run AFTER supabase_v17_stories.sql (safe to run more than once).
-- sentences: {"s1": "sentence for scene 1"} (scene levels) or {"1|Rover": "sentence using Rover"} (word levels)
-- status adds 'returned' = sent back to the child with feedback to fix
-- =====================================================================
alter table public.stories add column if not exists level int not null default 3;
alter table public.stories drop constraint if exists stories_level_check;
alter table public.stories add constraint stories_level_check check (level between 1 and 10);
alter table public.stories add column if not exists sentences jsonb not null default '{}'::jsonb;
alter table public.stories drop constraint if exists stories_sentences_check;
alter table public.stories add constraint stories_sentences_check check (jsonb_typeof(sentences) = 'object' and length(sentences::text) <= 30000);
alter table public.stories add column if not exists feedback text not null default '';
alter table public.stories drop constraint if exists stories_feedback_check;
alter table public.stories add constraint stories_feedback_check check (length(feedback) <= 10000);
alter table public.stories drop constraint if exists stories_status_check;
alter table public.stories add constraint stories_status_check check (status in ('draft','sent','returned','written','filmed'));

select column_name, data_type from information_schema.columns where table_schema = 'public' and table_name = 'stories' order by ordinal_position;
