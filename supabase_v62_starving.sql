-- =====================================================================
-- Helper Academy — v62: 🍞 Starving, main meaning first
--   The main meaning is serious: suffering (even dying) because there is no food for a long time (poverty, war, drought).
--   "I'm starving!" after football is an everyday exaggeration borrowed from that meaning.
--   (Old English steorfan meant "to die"; the hunger meaning came later, and the joke "very hungry" after that.)
-- =====================================================================
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
values ('en', 'Starving (no food)', '',
  'Suffering, or even dying, because there has not been enough food for a long time, often because of poverty, war or drought. This is the main meaning.',
  'During the long drought, many families were [starving], so the village shared what it had.',
  'يتضوّر جوعًا: يعاني (وقد يموت) لأنه لم يجد طعامًا كافيًا لمدة طويلة، بسبب الفقر أو الحرب أو الجفاف.',
  'starv-ing', 'STAR-ving', '🍞', '', '',
  array['Describing','Health & body','Food & drink','Money & work','≈ Starving'],
  (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com'))
on conflict (lang, lower(headword), sense) do update set meaning = excluded.meaning, example = excluded.example, translation = excluded.translation, tags = excluded.tags;

-- the everyday one says where it comes from
update public.words set
  meaning = 'Very, very hungry: an everyday exaggeration. People borrow it from the main meaning (suffering because there is no food) to say "I''m almost that hungry", even though it isn''t really true.',
  tags = (select array(select distinct x from unnest(tags || array['≈ Starving']) x order by x))
where id = 'da9d20fa-20b2-45e2-ac4b-29fb2f3ba0b2';

-- next to the everyday Starving in Grade 5 (unit 4) and in Feelings (unit 7)
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('starving-main:' || e.set_id)::uuid, e.set_id, e.position, 'term', e.unit, '{}', w.id
from public.set_entries e, public.words w
where e.word_id = 'da9d20fa-20b2-45e2-ac4b-29fb2f3ba0b2' and w.lang = 'en' and w.headword = 'Starving (no food)' and w.sense = ''
on conflict (id) do nothing;

select w.headword, w.tags, (select count(*) from public.set_entries e where e.word_id = w.id) as in_sets
from public.words w where w.lang = 'en' and w.headword in ('Starving', 'Starving (no food)') order by w.headword;
