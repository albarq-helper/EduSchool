-- =====================================================================
-- Helper Academy — v22: word groups (tags) — word type, theme, and opposites (⇄ group: side)
-- Run AFTER supabase_v21_studio.sql (safe to run more than once).
--
-- Tag kinds (the site recognises them by name):
--   word type : Action · Describing · Naming: people · Naming: things & places
--   theme     : Feelings & moods, Homes & buildings, Animals, Plants, nature & weather, ... (any other text)
--   opposites : '⇄ <group>: <side>'   e.g. '⇄ Tired vs. full of energy: tired'
--
-- Handy queries (Grade 5 set):
--   -- every group with its words
--   select tag, string_agg(term, ', ' order by position) as words, count(*)
--   from set_items, unnest(tags) as tag where set_id = '00000000-0000-4000-8000-000000000005'
--   group by tag order by count(*) desc;
--   -- the feelings words in Unit 3
--   select term from set_items where set_id = '00000000-0000-4000-8000-000000000005'
--     and unit = 3 and 'Feelings & moods' = any(tags);
-- =====================================================================
alter table public.set_items add column if not exists tags text[] not null default '{}';
alter table public.set_items drop constraint if exists set_items_tags_check;
alter table public.set_items add constraint set_items_tags_check check (cardinality(tags) <= 12);
create index if not exists set_items_tags_idx on public.set_items using gin (tags);

-- Copies keep the tags too.
create or replace function public.copy_set(p_set uuid)
returns uuid language plpgsql security definer set search_path = public as $$
declare s study_sets%rowtype; nid uuid; inst uuid; t record; ntid uuid;
begin
  if not exists (select 1 from profiles where id = auth.uid() and role = 'teacher') then raise exception 'Only teachers can copy sets'; end if;
  if not can_view_set(p_set) then raise exception 'Set not found'; end if;
  select * into s from study_sets where id = p_set;
  select institution_id into inst from profiles where id = auth.uid();
  insert into study_sets (owner_id, institution_id, subject_id, level_code, curriculum_id, title, description, language, translation_lang, units, visibility)
  values (auth.uid(), inst, s.subject_id, s.level_code, s.curriculum_id, left('Copy of ' || s.title, 120), s.description, s.language, s.translation_lang, s.units, 'private')
  returning id into nid;
  insert into set_items (set_id, position, kind, unit, also_units, term, meaning, example, translation, syllables, image_url, anim_url, audio_url, choices, answer, pronunciation, sound_hint, video_url, emoji, tags)
  select nid, position, kind, unit, also_units, term, meaning, example, translation, syllables, image_url, anim_url, audio_url, choices, answer, pronunciation, sound_hint, video_url, emoji, tags
  from set_items where set_id = p_set;
  for t in select * from set_texts where set_id = p_set loop
    insert into set_texts (set_id, unit, title, body, position) values (nid, t.unit, t.title, t.body, t.position) returning id into ntid;
    insert into set_songs (set_id, text_id, unit, also_units, kind, title, media_url, lines, position)
    select nid, ntid, unit, also_units, kind, title, media_url, lines, position from set_songs where set_id = p_set and text_id = t.id;
  end loop;
  insert into set_songs (set_id, text_id, unit, also_units, kind, title, media_url, lines, position)
  select nid, null, unit, also_units, kind, title, media_url, lines, position from set_songs where set_id = p_set and text_id is null;
  return nid;
end $$;

-- Grade 5 words
update public.set_items i set tags = v.tags
from (values
  ('Lethargic', array['Describing', 'Feelings & moods', 'Health & body', '⇄ Tired vs. full of energy: tired']::text[]),
  ('Ailing', array['Describing', 'Health & body', '⇄ Tired vs. full of energy: tired']::text[]),
  ('Glance', array['Action', 'Looking & seeing']::text[]),
  ('Unpalatable', array['Describing', 'Food & drink', '⇄ Nice vs. nasty: nasty']::text[]),
  ('Insisted', array['Action', 'Saying & thinking']::text[]),
  ('Behead', array['Action', 'Danger & safety']::text[]),
  ('Aroma', array['Naming: things & places', 'Food & drink', '⇄ Nice vs. nasty: nice']::text[]),
  ('Fantastic', array['Describing', 'Good & great', '⇄ Exciting vs. dull: exciting']::text[]),
  ('Exhilaration', array['Naming: things & places', 'Feelings & moods', '⇄ Tired vs. full of energy: full of energy', '⇄ Happy vs. upset: happy']::text[]),
  ('Beverage', array['Naming: things & places', 'Food & drink']::text[]),
  ('Impact', array['Naming: things & places', 'Important & famous']::text[]),
  ('Tonic', array['Naming: things & places', 'Health & body', 'Food & drink', '⇄ Tired vs. full of energy: full of energy', '⇄ Danger vs. help: help']::text[]),
  ('Distant', array['Describing', 'Size, amount & distance', 'Places & travel']::text[]),
  ('Concord', array['Naming: things & places', 'Getting along', '⇄ Kind vs. unkind: kind']::text[]),
  ('Addicting', array['Describing', 'Health & body']::text[]),
  ('Region', array['Naming: things & places', 'Places & travel']::text[]),
  ('Exotic', array['Describing', 'Places & travel', '⇄ Common vs. rare: rare']::text[]),
  ('Blend', array['Naming: things & places', 'Food & drink']::text[]),
  ('Traditional', array['Describing', 'Time & change', '⇄ Common vs. rare: common']::text[]),
  ('Reside', array['Action', 'Homes & buildings', 'Places & travel']::text[]),
  ('Life-threatening', array['Describing', 'Danger & safety', '⇄ Danger vs. help: danger']::text[]),
  ('Crucial', array['Describing', 'Important & famous']::text[]),
  ('Nicknamed', array['Action', 'Words & books']::text[]),
  ('Moist', array['Describing', 'Plants, nature & weather']::text[]),
  ('Species', array['Naming: things & places', 'Science', 'Animals']::text[]),
  ('Appearance', array['Naming: things & places', 'Looking & seeing']::text[]),
  ('Allergic', array['Describing', 'Health & body']::text[]),
  ('Organism', array['Naming: things & places', 'Science', 'Animals']::text[]),
  ('Ecological', array['Describing', 'Science', 'Plants, nature & weather']::text[]),
  ('Molting', array['Action', 'Science', 'Animals']::text[]),
  ('Entomologist', array['Naming: people', 'Science', 'Animals']::text[]),
  ('Crustacean', array['Naming: things & places', 'Animals', 'Science']::text[]),
  ('Nocturnal', array['Describing', 'Animals']::text[]),
  ('Bookkeeper', array['Naming: people', 'Money & work']::text[]),
  ('Monotonous', array['Describing', '⇄ Exciting vs. dull: dull']::text[]),
  ('Published', array['Action', 'Words & books']::text[]),
  ('Pseudonym', array['Naming: things & places', 'Words & books']::text[]),
  ('Pension', array['Naming: things & places', 'Money & work']::text[]),
  ('Rejuvenated', array['Describing', 'Feelings & moods', 'Health & body', '⇄ Tired vs. full of energy: full of energy']::text[]),
  ('Casements', array['Naming: things & places', 'Homes & buildings']::text[]),
  ('Thatch', array['Naming: things & places', 'Homes & buildings']::text[]),
  ('Couched', array['Action', 'Ways of moving']::text[]),
  ('Kennel', array['Naming: things & places', 'Homes & buildings', 'Animals']::text[]),
  ('Shadowy', array['Describing', 'Light & sound', '⇄ Light vs. dark: dark']::text[]),
  ('Harvest', array['Naming: things & places', 'Plants, nature & weather', 'Food & drink']::text[]),
  ('Scampering', array['Action', 'Ways of moving', 'Animals']::text[]),
  ('Gleam', array['Naming: things & places', 'Light & sound', '⇄ Light vs. dark: light']::text[]),
  ('Reeds', array['Naming: things & places', 'Plants, nature & weather']::text[]),
  ('Shoon', array['Naming: things & places', 'Words & books']::text[]),
  ('Peers', array['Action', 'Looking & seeing']::text[]),
  ('Cote', array['Naming: things & places', 'Homes & buildings', 'Animals']::text[]),
  ('Flowing', array['Action', 'Ways of moving', 'Plants, nature & weather']::text[]),
  ('Withdrew', array['Action', 'Ways of moving']::text[]),
  ('Peep', array['Action', 'Looking & seeing']::text[]),
  ('Beam', array['Naming: things & places', 'Light & sound', '⇄ Light vs. dark: light']::text[]),
  ('Beneath', array['Describing', 'Size, amount & distance']::text[]),
  ('Relentlessly', array['Describing', 'How things are done']::text[]),
  ('Starving', array['Describing', 'Food & drink', 'Health & body']::text[]),
  ('Nervous', array['Describing', 'Feelings & moods', '⇄ Happy vs. upset: upset', '⇄ Brave vs. scared: scared']::text[]),
  ('Ferocious', array['Describing', 'Animals', 'Danger & safety', '⇄ Brave vs. scared: brave']::text[]),
  ('Deliberately', array['Describing', 'How things are done']::text[]),
  ('Brilliant', array['Describing', 'Good & great', 'Character']::text[]),
  ('Rustled', array['Action', 'Light & sound', 'Plants, nature & weather', '⇄ Loud vs. quiet: quiet']::text[]),
  ('Sigh', array['Naming: things & places', 'Light & sound', 'Feelings & moods', '⇄ Loud vs. quiet: quiet']::text[]),
  ('Swayed', array['Action', 'Ways of moving']::text[]),
  ('Precarious', array['Describing', 'Danger & safety', '⇄ Danger vs. help: danger']::text[]),
  ('Faraway', array['Describing', 'Size, amount & distance', 'Places & travel']::text[]),
  ('Observed', array['Action', 'Looking & seeing']::text[]),
  ('Separated', array['Action', 'Ways of moving']::text[]),
  ('Symbolized', array['Action', 'Saying & thinking']::text[]),
  ('Stooping', array['Action', 'Ways of moving']::text[]),
  ('Boughs', array['Naming: things & places', 'Plants, nature & weather']::text[]),
  ('Fern', array['Naming: things & places', 'Plants, nature & weather']::text[]),
  ('Moss', array['Naming: things & places', 'Plants, nature & weather']::text[]),
  ('Rover', array['Naming: people', 'Places & travel']::text[]),
  ('Wren', array['Naming: things & places', 'Animals', '⇄ Big vs. small: small']::text[]),
  ('Affluent', array['Describing', 'Money & work']::text[]),
  ('Majority', array['Naming: things & places', 'Size, amount & distance', '⇄ Common vs. rare: common']::text[]),
  ('Simultaneously', array['Describing', 'How things are done', 'Time & change']::text[]),
  ('Renowned', array['Describing', 'Important & famous']::text[]),
  ('Deteriorating', array['Action', 'Time & change']::text[]),
  ('Rifle', array['Naming: things & places', 'Danger & safety']::text[]),
  ('Admire', array['Action', 'Getting along', '⇄ Kind vs. unkind: kind']::text[]),
  ('Gigantic', array['Describing', 'Size, amount & distance', '⇄ Big vs. small: big']::text[]),
  ('Pretended', array['Action', 'Saying & thinking']::text[]),
  ('Windowsill', array['Naming: things & places', 'Homes & buildings']::text[]),
  ('Gust', array['Naming: things & places', 'Plants, nature & weather']::text[]),
  ('Fellow', array['Naming: people', 'Getting along']::text[]),
  ('Unique', array['Describing', '⇄ Common vs. rare: rare']::text[]),
  ('Stomped', array['Action', 'Ways of moving', 'Light & sound', '⇄ Loud vs. quiet: loud']::text[]),
  ('Clashing', array['Action', 'Getting along', '⇄ Kind vs. unkind: unkind']::text[]),
  ('Appreciate', array['Action', 'Getting along', '⇄ Kind vs. unkind: kind']::text[]),
  ('Pace', array['Naming: things & places', 'Ways of moving']::text[]),
  ('Apologize', array['Action', 'Getting along', 'Saying & thinking', '⇄ Kind vs. unkind: kind']::text[]),
  ('Lark', array['Naming: things & places', 'Animals', '⇄ Big vs. small: small']::text[]),
  ('Futile', array['Describing', 'How things are done']::text[]),
  ('Dozed', array['Action', 'Health & body', '⇄ Tired vs. full of energy: tired']::text[]),
  ('Spunky', array['Describing', 'Character', '⇄ Brave vs. scared: brave', '⇄ Tired vs. full of energy: full of energy']::text[]),
  ('Company', array['Naming: people', 'Getting along']::text[]),
  ('Whipped', array['Action', 'Danger & safety']::text[]),
  ('Depressed', array['Describing', 'Feelings & moods', '⇄ Happy vs. upset: upset']::text[]),
  ('Torture', array['Action', 'Danger & safety', '⇄ Kind vs. unkind: unkind']::text[]),
  ('Devout', array['Describing', 'Character']::text[]),
  ('Stable', array['Naming: things & places', 'Homes & buildings', 'Animals']::text[]),
  ('Empathy', array['Naming: things & places', 'Feelings & moods', 'Getting along', '⇄ Kind vs. unkind: kind']::text[]),
  ('Dependent', array['Describing', 'Character']::text[]),
  ('Horrific', array['Describing', 'Danger & safety', 'Feelings & moods', '⇄ Danger vs. help: danger', '⇄ Brave vs. scared: scared']::text[]),
  ('Inspired', array['Describing', 'Feelings & moods', '⇄ Happy vs. upset: happy']::text[]),
  ('Regarded', array['Action', 'Saying & thinking']::text[]),
  ('Consistently', array['Describing', 'How things are done']::text[]),
  ('Bestowed', array['Action', 'Government & law', 'Important & famous']::text[]),
  ('Colloquial', array['Describing', 'Words & books']::text[]),
  ('Weathered', array['Describing', 'Plants, nature & weather', 'Time & change']::text[]),
  ('Precinct', array['Naming: things & places', 'Government & law', 'Places & travel']::text[]),
  ('Ratified', array['Action', 'Government & law']::text[]),
  ('Chieftainship', array['Naming: things & places', 'Government & law']::text[]),
  ('Insolence', array['Naming: things & places', 'Getting along', 'Character', '⇄ Kind vs. unkind: unkind']::text[]),
  ('Pique', array['Naming: things & places', 'Feelings & moods', '⇄ Happy vs. upset: upset']::text[]),
  ('Insubordination', array['Naming: things & places', 'Government & law', 'Getting along', '⇄ Kind vs. unkind: unkind']::text[]),
  ('Commemorate', array['Action', 'Important & famous', 'Government & law']::text[]),
  ('Senator', array['Naming: people', 'Government & law']::text[]),
  ('Landfill', array['Naming: things & places', 'Science', 'Plants, nature & weather']::text[]),
  ('Decompose', array['Action', 'Science', 'Time & change']::text[]),
  ('Estimate', array['Action', 'Saying & thinking']::text[]),
  ('Toss', array['Action', 'Ways of moving']::text[]),
  ('Beast', array['Naming: things & places', 'Animals']::text[]),
  ('Significant', array['Describing', 'Important & famous']::text[]),
  ('Well-known', array['Describing', 'Important & famous', '⇄ Common vs. rare: common']::text[]),
  ('Classics', array['Naming: things & places', 'Words & books', 'Important & famous']::text[]),
  ('Delighted', array['Describing', 'Feelings & moods', '⇄ Happy vs. upset: happy']::text[]),
  ('Relocated', array['Action', 'Places & travel', 'Homes & buildings']::text[]),
  ('Unfinished', array['Describing', 'Time & change']::text[]),
  ('Frustrated', array['Describing', 'Feelings & moods', '⇄ Happy vs. upset: upset']::text[]),
  ('Exhaustion', array['Naming: things & places', 'Health & body', 'Feelings & moods', '⇄ Tired vs. full of energy: tired']::text[]),
  ('Familiar', array['Describing', '⇄ Common vs. rare: common']::text[]),
  ('Annoy', array['Action', 'Feelings & moods', 'Getting along', '⇄ Happy vs. upset: upset']::text[]),
  ('Heroic', array['Describing', 'Character', '⇄ Brave vs. scared: brave']::text[]),
  ('Smart', array['Describing', 'Character', 'Good & great']::text[]),
  ('Filthy', array['Describing', '⇄ Nice vs. nasty: nasty']::text[]),
  ('Connect', array['Action', 'Getting along']::text[]),
  ('Assist', array['Action', 'Getting along', '⇄ Danger vs. help: help']::text[]),
  ('Serene', array['Describing', 'Feelings & moods', '⇄ Loud vs. quiet: quiet']::text[]),
  ('Create', array['Action']::text[]),
  ('Fabulous', array['Describing', 'Good & great', '⇄ Exciting vs. dull: exciting']::text[]),
  ('Rescue', array['Action', 'Danger & safety', '⇄ Danger vs. help: help']::text[]),
  ('Hazardous', array['Describing', 'Danger & safety', '⇄ Danger vs. help: danger']::text[]),
  ('Launch', array['Action', 'Ways of moving']::text[]),
  ('Watch', array['Action', 'Looking & seeing']::text[]),
  ('Error', array['Naming: things & places']::text[]),
  ('Selfish', array['Describing', 'Character', '⇄ Kind vs. unkind: unkind']::text[]),
  ('Fortunate', array['Describing', 'Good & great']::text[]),
  ('Obvious', array['Describing', 'Looking & seeing']::text[]),
  ('Enormous', array['Describing', 'Size, amount & distance', '⇄ Big vs. small: big']::text[]),
  ('Silent', array['Describing', 'Light & sound', '⇄ Loud vs. quiet: quiet']::text[]),
  ('Narrow', array['Describing', 'Size, amount & distance', '⇄ Big vs. small: small']::text[]),
  ('Elegant', array['Describing', 'Good & great', 'Looking & seeing', '⇄ Nice vs. nasty: nice']::text[]),
  ('Permit', array['Action', 'Getting along']::text[]),
  ('Unusual', array['Describing', '⇄ Common vs. rare: rare']::text[]),
  ('Purchase', array['Action', 'Money & work']::text[]),
  ('Intriguing', array['Describing', '⇄ Exciting vs. dull: exciting']::text[]),
  ('Crave', array['Action', 'Food & drink', 'Feelings & moods']::text[]),
  ('Curiosity', array['Naming: things & places', 'Feelings & moods']::text[]),
  ('Concoction', array['Naming: things & places', 'Food & drink']::text[]),
  ('Apparently', array['Describing', 'How things are done']::text[]),
  ('Department (Dept.)', array['Naming: things & places', 'Money & work']::text[]),
  ('Abbreviation', array['Naming: things & places', 'Words & books']::text[])
) as v(term, tags)
where i.set_id = '00000000-0000-4000-8000-000000000005' and i.term = v.term;

-- English for Ab
update public.set_items set tags = array['Describing','Character']::text[]
where set_id = '00000000-0000-4000-8000-0000000000ab' and term = 'Feisty';

select count(*) filter (where cardinality(tags) > 0) as tagged, count(*) as words
from public.set_items where set_id = '00000000-0000-4000-8000-000000000005';
