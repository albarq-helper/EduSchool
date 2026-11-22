-- =====================================================================
-- Helper Academy — v27: a "Full → Hungry" Feeling meter (Full … Peckish … Hungry … Ravenous, Famished … Starving)
-- New words go into the shared dictionary; Grade 5's "Starving" gets its place (+5) on the scale;
-- the Feelings box links all six as a new group (unit 7). Run AFTER supabase_v26_dictionary.sql (safe to re-run).
-- =====================================================================
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, tags, owner_id)
select 'en', v.headword, '', v.meaning, v.example, v.translation, v.syllables, v.pronunciation, v.emoji, v.tags,
       (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')
from (values
  ('Full',     'Having eaten enough; not hungry at all.', 'After the big lunch I felt [full].', 'شبعان', 'full', 'FUUL', '🍽️',
     array['Describing','Health & body','Food & drink','📶 Full → Hungry: 0']::text[]),
  ('Peckish',  'A little bit hungry.', 'I feel [peckish], so I will have an apple.', 'جائع قليلاً', 'peck-ish', 'PEK-ish', '🍎',
     array['Describing','Health & body','Food & drink','📶 Full → Hungry: +1']::text[]),
  ('Hungry',   'Wanting or needing food.', 'I was [hungry] after football practice.', 'جائع', 'hun-gry', 'HUNG-gree', '😋',
     array['Describing','Health & body','Food & drink','📶 Full → Hungry: +3']::text[]),
  ('Ravenous', 'Extremely hungry; ready to eat a lot.', 'After the long walk we were [ravenous].', 'جائع جداً / نَهِم', 'rav-en-ous', 'RAV-uh-nus', '🍔',
     array['Describing','Health & body','Food & drink','📶 Full → Hungry: +4']::text[]),
  ('Famished', 'Very, very hungry.', 'I am [famished]! What is for dinner?', 'يتضوّر جوعاً', 'fam-ished', 'FAM-isht', '🍝',
     array['Describing','Health & body','Food & drink','📶 Full → Hungry: +4']::text[])
) as v(headword, meaning, example, translation, syllables, pronunciation, emoji, tags)
on conflict (lang, lower(headword), sense) do update set tags = (select array(select distinct unnest(public.words.tags || excluded.tags)));

-- Grade 5's Starving: the top of the scale
update public.words set tags = array(select distinct unnest(tags || array['📶 Full → Hungry: +5']::text[])), updated_at = now()
where lang = 'en' and lower(headword) = 'starving' and sense = '';

-- Feelings box: a new group "Full → Hungry" (unit 7) linking the six dictionary words
update public.study_sets set units = units || '[{"u": 7, "name": "Full → Hungry"}]'::jsonb
where id = '00000000-0000-4000-8000-00000000fee1' and not units @> '[{"u": 7}]'::jsonb;

insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select ('00000000-0000-4000-8000-00000fee01' || lpad(k::text, 2, '0'))::uuid, '00000000-0000-4000-8000-00000000fee1', 71 + k, 'term', 7, '{}', w.id
from (values (1,'full'),(2,'peckish'),(3,'hungry'),(4,'ravenous'),(5,'famished'),(6,'starving')) as x(k, hw)
join public.words w on w.lang = 'en' and lower(w.headword) = x.hw and w.sense = ''
on conflict (id) do nothing;

select i.term, i.unit, s.title, (select t from unnest(i.tags) t where t like '📶%') as meter
from public.set_items i join public.study_sets s on s.id = i.set_id
where lower(i.term) in ('full','peckish','hungry','ravenous','famished','starving') order by s.title, i.position;
