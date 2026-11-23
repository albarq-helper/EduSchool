-- =====================================================================
-- Helper Academy — v38: characters in the Story builder
--   stories.characters: up to 12 characters, each {id, name, age, look, role, emoji}.
--   Sayings in the story can be given to one of them (or to the narrator / a voice-over).
-- Safe to re-run. Run AFTER v37.
-- =====================================================================
alter table public.stories add column if not exists characters jsonb not null default '[]'::jsonb;
alter table public.stories drop constraint if exists stories_characters_check;
alter table public.stories add constraint stories_characters_check
  check (jsonb_typeof(characters) = 'array' and jsonb_array_length(characters) <= 12 and length(characters::text) <= 8000);
select count(*) as stories, count(*) filter (where characters <> '[]'::jsonb) as with_characters from public.stories;
