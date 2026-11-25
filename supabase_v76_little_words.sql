-- =====================================================================
-- Helper Academy — v76: 🔗 Little words: in, on, at, by, to · a, an, the
--   A new "Little Words" set (Linking-words box in the Story builder) with 8 little words; 16 travel & place nouns in Word Partners
--   (unit 5 "Travel & places"); every phrase grouped by its rule with 🧭 tags, exceptions and US/UK differences marked with ⚠️ / 🇺🇸 tags,
--   and linked to the noun's dictionary word. American English first. Built by tools/words/build_v76.py. Safe to re-run. Run AFTER v75.
-- =====================================================================
insert into public.study_sets (id, owner_id, author_name, institution_id, subject_id, level_code, title, description, language, translation_lang, units, visibility, story_box)
select '00000000-0000-4000-8000-00000000c1a7', (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com'), 'Ab', null, 1, 'any', 'Little Words: in, on, at, by, to · a, an, the',
  'The small words that are hardest for learners: how you travel (by car, on foot), where you are (at home, in the kitchen), when (at 7, on Monday, in July), where you go (go to school, go home) and a / an / the.',
  'en', 'ar', '[{"u": 1, "name": "🚗 How you travel"},{"u": 2, "name": "📍 Where you are"},{"u": 3, "name": "⏰ When"},{"u": 4, "name": "➡️ Where you go"},{"u": 5, "name": "🔤 A, an, the"}]'::jsonb, 'public', 'link'
on conflict (id) do update set title = excluded.title, description = excluded.description, units = excluded.units, story_box = excluded.story_box;
update public.study_sets set units = units || '[{"u": 5, "name": "🚗 Travel & places"}]'::jsonb
  where id = '00000000-0000-4000-8000-00000000c011' and not units @> '[{"u": 5}]'::jsonb;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'By', '', 'Shows HOW you travel (by car, by bus: no a or the), and also next to (by the door) or not later than (by Friday).', 'We go to school [by] bus.', 'بـ / بواسطة (وسيلة النقل)، بجانب، قبل موعد', 'by', '', '🚗', '', '', array['Little words']::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com') where not exists (select 1 from public.words w where w.lang = 'en' and w.headword = 'By' and w.sense = '');
update public.words set meaning = 'Shows HOW you travel (by car, by bus: no a or the), and also next to (by the door) or not later than (by Friday).', translation = 'بـ / بواسطة (وسيلة النقل)، بجانب، قبل موعد', tags = (select array(select distinct x from unnest(tags || array['Little words']::text[]) x order by x)) where id = (select id from public.words where lang = 'en' and headword = 'By' and sense = '' limit 1);
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id) select md5('little:' || w.id)::uuid, '00000000-0000-4000-8000-00000000c1a7', 1, 'term', 1, '{}', w.id
from public.words w where w.id = (select id from public.words where lang = 'en' and headword = 'By' and sense = '' limit 1) on conflict (id) do update set unit = excluded.unit, also_units = excluded.also_units, position = excluded.position;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'On', '', 'On top of a surface (on the table); on big vehicles you can walk in (on the bus); with days and dates (on Monday). Walking is on foot.', 'The book is [on] the table.', 'على؛ في (مع الأيام)', 'on', '', '🔛', '', '', array['Little words']::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com') where not exists (select 1 from public.words w where w.lang = 'en' and w.headword = 'On' and w.sense = '');
update public.words set meaning = 'On top of a surface (on the table); on big vehicles you can walk in (on the bus); with days and dates (on Monday). Walking is on foot.', translation = 'على؛ في (مع الأيام)', tags = (select array(select distinct x from unnest(tags || array['Little words']::text[]) x order by x)) where id = (select id from public.words where lang = 'en' and headword = 'On' and sense = '' limit 1);
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id) select md5('little:' || w.id)::uuid, '00000000-0000-4000-8000-00000000c1a7', 2, 'term', 2, '{1,3}', w.id
from public.words w where w.id = (select id from public.words where lang = 'en' and headword = 'On' and sense = '' limit 1) on conflict (id) do update set unit = excluded.unit, also_units = excluded.also_units, position = excluded.position;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'In', '', 'Inside a space (in the box, in the kitchen); in small vehicles you sit in (in a car); with months, years and parts of the day (in July, in the morning).', 'The cat is [in] the box.', 'في / داخل', 'in', '', '📥', '', '', array['Little words']::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com') where not exists (select 1 from public.words w where w.lang = 'en' and w.headword = 'In' and w.sense = '');
update public.words set meaning = 'Inside a space (in the box, in the kitchen); in small vehicles you sit in (in a car); with months, years and parts of the day (in July, in the morning).', translation = 'في / داخل', tags = (select array(select distinct x from unnest(tags || array['Little words']::text[]) x order by x)) where id = (select id from public.words where lang = 'en' and headword = 'In' and sense = '' limit 1);
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id) select md5('little:' || w.id)::uuid, '00000000-0000-4000-8000-00000000c1a7', 3, 'term', 2, '{1,3}', w.id
from public.words w where w.id = (select id from public.words where lang = 'en' and headword = 'In' and sense = '' limit 1) on conflict (id) do update set unit = excluded.unit, also_units = excluded.also_units, position = excluded.position;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'At', '', 'At a point or a place where something happens (at the door, at school, at home); with clock times (at 7 o''clock, at night).', 'I''ll meet you [at] the bus stop.', 'عند / في (لنقطة أو مكان أو ساعة محددة)', 'at', '', '📍', '', '', array['Little words']::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com') where not exists (select 1 from public.words w where w.lang = 'en' and w.headword = 'At' and w.sense = '');
update public.words set meaning = 'At a point or a place where something happens (at the door, at school, at home); with clock times (at 7 o''clock, at night).', translation = 'عند / في (لنقطة أو مكان أو ساعة محددة)', tags = (select array(select distinct x from unnest(tags || array['Little words']::text[]) x order by x)) where id = (select id from public.words where lang = 'en' and headword = 'At' and sense = '' limit 1);
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id) select md5('little:' || w.id)::uuid, '00000000-0000-4000-8000-00000000c1a7', 4, 'term', 2, '{3}', w.id
from public.words w where w.id = (select id from public.words where lang = 'en' and headword = 'At' and sense = '' limit 1) on conflict (id) do update set unit = excluded.unit, also_units = excluded.also_units, position = excluded.position;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'To', '', 'Shows where you are going (go to school, go to bed). But we say go home, with no to.', 'We walk [to] the park.', 'إلى', 'to', '', '➡️', '', '', array['Little words']::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com') where not exists (select 1 from public.words w where w.lang = 'en' and w.headword = 'To' and w.sense = '');
update public.words set meaning = 'Shows where you are going (go to school, go to bed). But we say go home, with no to.', translation = 'إلى', tags = (select array(select distinct x from unnest(tags || array['Little words']::text[]) x order by x)) where id = (select id from public.words where lang = 'en' and headword = 'To' and sense = '' limit 1);
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id) select md5('little:' || w.id)::uuid, '00000000-0000-4000-8000-00000000c1a7', 5, 'term', 4, '{}', w.id
from public.words w where w.id = (select id from public.words where lang = 'en' and headword = 'To' and sense = '' limit 1) on conflict (id) do update set unit = excluded.unit, also_units = excluded.also_units, position = excluded.position;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'A', '', 'Used before a singular thing when it is one of many, or the first time you mention it. Use A before a consonant SOUND: a car, a university.', 'I saw [a] dog in the park.', 'أداة نكرة (واحد من كثير)', 'a', '', '🅰️', '', '', array['Little words']::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com') where not exists (select 1 from public.words w where w.lang = 'en' and w.headword = 'A' and w.sense = '');
update public.words set meaning = 'Used before a singular thing when it is one of many, or the first time you mention it. Use A before a consonant SOUND: a car, a university.', translation = 'أداة نكرة (واحد من كثير)', tags = (select array(select distinct x from unnest(tags || array['Little words']::text[]) x order by x)) where id = (select id from public.words where lang = 'en' and headword = 'A' and sense = '' limit 1);
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id) select md5('little:' || w.id)::uuid, '00000000-0000-4000-8000-00000000c1a7', 6, 'term', 5, '{}', w.id
from public.words w where w.id = (select id from public.words where lang = 'en' and headword = 'A' and sense = '' limit 1) on conflict (id) do update set unit = excluded.unit, also_units = excluded.also_units, position = excluded.position;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'An', '', 'Like A, but before a vowel SOUND: an apple, an idea, an hour (the h is silent).', 'She ate [an] apple.', 'أداة نكرة قبل صوت متحرك', 'an', '', '🅰️', '', '', array['Little words']::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com') where not exists (select 1 from public.words w where w.lang = 'en' and w.headword = 'An' and w.sense = '');
update public.words set meaning = 'Like A, but before a vowel SOUND: an apple, an idea, an hour (the h is silent).', translation = 'أداة نكرة قبل صوت متحرك', tags = (select array(select distinct x from unnest(tags || array['Little words']::text[]) x order by x)) where id = (select id from public.words where lang = 'en' and headword = 'An' and sense = '' limit 1);
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id) select md5('little:' || w.id)::uuid, '00000000-0000-4000-8000-00000000c1a7', 7, 'term', 5, '{}', w.id
from public.words w where w.id = (select id from public.words where lang = 'en' and headword = 'An' and sense = '' limit 1) on conflict (id) do update set unit = excluded.unit, also_units = excluded.also_units, position = excluded.position;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'The', '', 'Used when we both know which one (the door of this room), when there is only one (the sun), or for places in town (the park). No article in fixed phrases: at home, by car, go to bed.', 'Please close [the] door.', 'ال (أداة التعريف)', 'the', '', '👉', '', '', array['Little words']::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com') where not exists (select 1 from public.words w where w.lang = 'en' and w.headword = 'The' and w.sense = '');
update public.words set meaning = 'Used when we both know which one (the door of this room), when there is only one (the sun), or for places in town (the park). No article in fixed phrases: at home, by car, go to bed.', translation = 'ال (أداة التعريف)', tags = (select array(select distinct x from unnest(tags || array['Little words']::text[]) x order by x)) where id = (select id from public.words where lang = 'en' and headword = 'The' and sense = '' limit 1);
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id) select md5('little:' || w.id)::uuid, '00000000-0000-4000-8000-00000000c1a7', 8, 'term', 5, '{}', w.id
from public.words w where w.id = (select id from public.words where lang = 'en' and headword = 'The' and sense = '' limit 1) on conflict (id) do update set unit = excluded.unit, also_units = excluded.also_units, position = excluded.position;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Car', '', 'A vehicle with four wheels and an engine, for a few people.', 'Dad drives the [car] to work.', 'سيارة', 'car', '', '🚗', '', '', array['Naming: things & places','Places & travel']::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com') where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = lower('Car') and w.sense = '');
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id) select md5('travel:' || w.id)::uuid, '00000000-0000-4000-8000-00000000c011', 500, 'term', 5, '{}', w.id
from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Car') and sense = '' limit 1)
  and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000c011' and e.word_id = w.id) on conflict (id) do nothing;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Bus', '', 'A big vehicle that carries many passengers along a route.', 'We take the [bus] to school.', 'حافلة', 'bus', '', '🚌', '', '', array['Naming: things & places','Places & travel']::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com') where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = lower('Bus') and w.sense = '');
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id) select md5('travel:' || w.id)::uuid, '00000000-0000-4000-8000-00000000c011', 501, 'term', 5, '{}', w.id
from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Bus') and sense = '' limit 1)
  and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000c011' and e.word_id = w.id) on conflict (id) do nothing;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Train', '', 'A long vehicle that runs on rails.', 'The [train] was full this morning.', 'قطار', 'train', '', '🚆', '', '', array['Naming: things & places','Places & travel']::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com') where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = lower('Train') and w.sense = '');
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id) select md5('travel:' || w.id)::uuid, '00000000-0000-4000-8000-00000000c011', 502, 'term', 5, '{}', w.id
from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Train') and sense = '' limit 1)
  and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000c011' and e.word_id = w.id) on conflict (id) do nothing;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Airplane', '', 'A vehicle with wings that flies (also called a plane).', 'We flew to Jeddah by [airplane].', 'طائرة', 'air-plane', '', '✈️', '', '', array['Naming: things & places','Places & travel']::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com') where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = lower('Airplane') and w.sense = '');
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id) select md5('travel:' || w.id)::uuid, '00000000-0000-4000-8000-00000000c011', 503, 'term', 5, '{}', w.id
from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Airplane') and sense = '' limit 1)
  and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000c011' and e.word_id = w.id) on conflict (id) do nothing;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Bike', '', 'A bicycle: two wheels that you push with your feet.', 'She rides her [bike] in the park.', 'دراجة', 'bike', '', '🚲', '', '', array['Naming: things & places','Places & travel']::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com') where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = lower('Bike') and w.sense = '');
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id) select md5('travel:' || w.id)::uuid, '00000000-0000-4000-8000-00000000c011', 504, 'term', 5, '{}', w.id
from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Bike') and sense = '' limit 1)
  and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000c011' and e.word_id = w.id) on conflict (id) do nothing;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Taxi', '', 'A car with a driver that you pay to take you somewhere.', 'We took a [taxi] to the airport.', 'سيارة أجرة', 'tax-i', '', '🚕', '', '', array['Naming: things & places','Places & travel']::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com') where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = lower('Taxi') and w.sense = '');
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id) select md5('travel:' || w.id)::uuid, '00000000-0000-4000-8000-00000000c011', 505, 'term', 5, '{}', w.id
from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Taxi') and sense = '' limit 1)
  and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000c011' and e.word_id = w.id) on conflict (id) do nothing;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Foot', '', 'The part of your leg you stand on. On foot means walking.', 'We went to the shop on [foot].', 'قدم (سيرًا على الأقدام)', 'foot', '', '🦶', '', '', array['Naming: things & places','Places & travel']::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com') where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = lower('Foot') and w.sense = '');
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id) select md5('travel:' || w.id)::uuid, '00000000-0000-4000-8000-00000000c011', 506, 'term', 5, '{}', w.id
from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Foot') and sense = '' limit 1)
  and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000c011' and e.word_id = w.id) on conflict (id) do nothing;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Home', '', 'The place where you live. We say at home and go home (no the, no to).', 'I stayed at [home] all day.', 'البيت / المنزل', 'home', '', '🏠', '', '', array['Naming: things & places','Places & travel']::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com') where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = lower('Home') and w.sense = '');
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id) select md5('travel:' || w.id)::uuid, '00000000-0000-4000-8000-00000000c011', 507, 'term', 5, '{}', w.id
from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Home') and sense = '' limit 1)
  and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000c011' and e.word_id = w.id) on conflict (id) do nothing;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'School', '', 'The place where children learn. At school, go to school (no the).', 'We have art at [school] today.', 'مدرسة', 'school', '', '🏫', '', '', array['Naming: things & places','Places & travel']::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com') where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = lower('School') and w.sense = '');
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id) select md5('travel:' || w.id)::uuid, '00000000-0000-4000-8000-00000000c011', 508, 'term', 5, '{}', w.id
from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('School') and sense = '' limit 1)
  and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000c011' and e.word_id = w.id) on conflict (id) do nothing;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Work', '', 'The place where you do your job, or the job itself. At work, go to work (no the).', 'Mom is at [work] until five.', 'العمل', 'work', '', '💼', '', '', array['Naming: things & places','Places & travel']::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com') where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = lower('Work') and w.sense = '');
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id) select md5('travel:' || w.id)::uuid, '00000000-0000-4000-8000-00000000c011', 509, 'term', 5, '{}', w.id
from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Work') and sense = '' limit 1)
  and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000c011' and e.word_id = w.id) on conflict (id) do nothing;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Office', '', 'A room or building where people work at desks.', 'Dad works in an [office].', 'مكتب', 'of-fice', '', '🏢', '', '', array['Naming: things & places','Places & travel']::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com') where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = lower('Office') and w.sense = '');
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id) select md5('travel:' || w.id)::uuid, '00000000-0000-4000-8000-00000000c011', 510, 'term', 5, '{}', w.id
from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Office') and sense = '' limit 1)
  and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000c011' and e.word_id = w.id) on conflict (id) do nothing;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Hospital', '', 'A place where sick or hurt people are cared for. In American English: in the hospital; in British English: in hospital.', 'Grandpa is in the [hospital] for a few days.', 'مستشفى', 'hos-pi-tal', '', '🏥', '', '', array['Naming: things & places','Places & travel']::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com') where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = lower('Hospital') and w.sense = '');
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id) select md5('travel:' || w.id)::uuid, '00000000-0000-4000-8000-00000000c011', 511, 'term', 5, '{}', w.id
from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Hospital') and sense = '' limit 1)
  and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000c011' and e.word_id = w.id) on conflict (id) do nothing;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Bed', '', 'A piece of furniture you sleep on. In bed, go to bed (no the).', 'It''s late: time for [bed].', 'سرير', 'bed', '', '🛏️', '', '', array['Naming: things & places','Places & travel']::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com') where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = lower('Bed') and w.sense = '');
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id) select md5('travel:' || w.id)::uuid, '00000000-0000-4000-8000-00000000c011', 512, 'term', 5, '{}', w.id
from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Bed') and sense = '' limit 1)
  and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000c011' and e.word_id = w.id) on conflict (id) do nothing;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Kitchen', '', 'The room where food is cooked.', 'Mom is in the [kitchen].', 'مطبخ', 'kitch-en', '', '🍳', '', '', array['Naming: things & places','Places & travel']::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com') where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = lower('Kitchen') and w.sense = '');
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id) select md5('travel:' || w.id)::uuid, '00000000-0000-4000-8000-00000000c011', 513, 'term', 5, '{}', w.id
from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Kitchen') and sense = '' limit 1)
  and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000c011' and e.word_id = w.id) on conflict (id) do nothing;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Morning', '', 'The early part of the day, before noon. In the morning.', 'I read in the [morning].', 'صباح', 'morn-ing', '', '🌅', '', '', array['Naming: things & places','Places & travel']::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com') where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = lower('Morning') and w.sense = '');
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id) select md5('travel:' || w.id)::uuid, '00000000-0000-4000-8000-00000000c011', 514, 'term', 5, '{}', w.id
from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Morning') and sense = '' limit 1)
  and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000c011' and e.word_id = w.id) on conflict (id) do nothing;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Weekend', '', 'Saturday and Sunday (or Friday and Saturday in Saudi Arabia). American: on the weekend; British: at the weekend.', 'We visit Grandma on the [weekend].', 'عطلة نهاية الأسبوع', 'week-end', '', '🗓️', '', '', array['Naming: things & places','Places & travel']::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com') where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = lower('Weekend') and w.sense = '');
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id) select md5('travel:' || w.id)::uuid, '00000000-0000-4000-8000-00000000c011', 515, 'term', 5, '{}', w.id
from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Weekend') and sense = '' limit 1)
  and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000c011' and e.word_id = w.id) on conflict (id) do nothing;
-- 🧭 partners, grouped by the rule
delete from public.word_partners p using public.words w where p.word_id = w.id and w.lang = 'en' and w.sense = '' and w.headword in ('By','On','In','At','To','A','An','The');
insert into public.word_partners (word_id, kind, phrase, partner, position, tags, partner_word_id)
select (select id from public.words where lang = 'en' and headword = v.h and sense = '' limit 1), v.k, v.ph, v.pa, v.pos, v.tg,
       (select x.id from public.words x where x.lang = 'en' and lower(x.headword) = lower(v.noun) and x.sense = '' limit 1)
from (values
('By', 'noun', 'by car', 'car', 1, array['🧭 🚗 How you travel: BY + vehicle, no a or the']::text[], 'car'),
('By', 'noun', 'by bus', 'bus', 2, array['🧭 🚗 How you travel: BY + vehicle, no a or the']::text[], 'bus'),
('By', 'noun', 'by train', 'train', 3, array['🧭 🚗 How you travel: BY + vehicle, no a or the']::text[], 'train'),
('By', 'noun', 'by plane', 'plane', 4, array['🧭 🚗 How you travel: BY + vehicle, no a or the']::text[], 'Airplane'),
('By', 'noun', 'by taxi', 'taxi', 5, array['🧭 🚗 How you travel: BY + vehicle, no a or the']::text[], 'taxi'),
('By', 'noun', 'by bike', 'bike', 6, array['🧭 🚗 How you travel: BY + vehicle, no a or the']::text[], 'bike'),
('By', 'noun', 'by boat', 'boat', 7, array['🧭 🚗 How you travel: BY + vehicle, no a or the']::text[], 'boat'),
('By', 'noun', 'by subway', 'subway', 8, array['🧭 🚗 How you travel: BY + vehicle, no a or the']::text[], 'subway'),
('By', 'noun', 'by the door', 'the door', 9, array['🧭 📍 By = next to']::text[], 'door'),
('By', 'noun', 'by the window', 'the window', 10, array['🧭 📍 By = next to']::text[], 'window'),
('By', 'noun', 'by the sea', 'the sea', 11, array['🧭 📍 By = next to']::text[], 'sea'),
('By', 'noun', 'by 5 o''clock', '5 o''clock', 12, array['🧭 ⏰ By = not later than']::text[], 'o''clock'),
('By', 'noun', 'by Friday', 'Friday', 13, array['🧭 ⏰ By = not later than']::text[], 'Friday'),
('By', 'noun', 'by tomorrow', 'tomorrow', 14, array['🧭 ⏰ By = not later than']::text[], 'tomorrow'),
('On', 'noun', 'on the bus', 'the bus', 1, array['🧭 🚗 Travel: ON big vehicles you can stand or walk in, and bikes','Compare: by bus (how you travel) / on the bus (inside this bus)']::text[], 'bus'),
('On', 'noun', 'on the train', 'the train', 2, array['🧭 🚗 Travel: ON big vehicles you can stand or walk in, and bikes']::text[], 'train'),
('On', 'noun', 'on a plane', 'a plane', 3, array['🧭 🚗 Travel: ON big vehicles you can stand or walk in, and bikes']::text[], 'Airplane'),
('On', 'noun', 'on a ship', 'a ship', 4, array['🧭 🚗 Travel: ON big vehicles you can stand or walk in, and bikes']::text[], 'ship'),
('On', 'noun', 'on a bike', 'a bike', 5, array['🧭 🚗 Travel: ON big vehicles you can stand or walk in, and bikes']::text[], 'bike'),
('On', 'noun', 'on a horse', 'a horse', 6, array['🧭 🚗 Travel: ON big vehicles you can stand or walk in, and bikes']::text[], 'horse'),
('On', 'noun', 'on foot', 'foot', 7, array['🧭 🚗 The exception: walking is ON foot','⚠️ Exception: walking is on foot, not by foot']::text[], 'foot'),
('On', 'noun', 'on the table', 'the table', 8, array['🧭 📍 Place: ON a surface']::text[], 'table'),
('On', 'noun', 'on the wall', 'the wall', 9, array['🧭 📍 Place: ON a surface']::text[], 'wall'),
('On', 'noun', 'on the floor', 'the floor', 10, array['🧭 📍 Place: ON a surface']::text[], 'floor'),
('On', 'noun', 'on the page', 'the page', 11, array['🧭 📍 Place: ON a surface']::text[], 'page'),
('On', 'noun', 'on the screen', 'the screen', 12, array['🧭 📍 Place: ON a surface']::text[], 'screen'),
('On', 'noun', 'on TV', 'TV', 13, array['🧭 📺 Fixed phrases with ON']::text[], 'TV'),
('On', 'noun', 'on the phone', 'the phone', 14, array['🧭 📺 Fixed phrases with ON']::text[], 'phone'),
('On', 'noun', 'on the internet', 'the internet', 15, array['🧭 📺 Fixed phrases with ON']::text[], 'internet'),
('On', 'noun', 'on the radio', 'the radio', 16, array['🧭 📺 Fixed phrases with ON']::text[], 'radio'),
('On', 'noun', 'on Monday', 'Monday', 17, array['🧭 ⏰ Time: ON days and dates']::text[], 'Monday'),
('On', 'noun', 'on my birthday', 'my birthday', 18, array['🧭 ⏰ Time: ON days and dates']::text[], 'birthday'),
('On', 'noun', 'on May 5th', 'May 5th', 19, array['🧭 ⏰ Time: ON days and dates']::text[], '5th'),
('On', 'noun', 'on the weekend', 'the weekend', 20, array['🧭 ⏰ Time: ON days and dates','🇺🇸 American; British English says at the weekend']::text[], 'weekend'),
('On', 'noun', 'on Eid', 'Eid', 21, array['🧭 ⏰ Time: ON days and dates']::text[], 'Eid'),
('In', 'noun', 'in a car', 'a car', 1, array['🧭 🚗 Travel: IN small vehicles you sit in','Compare: by car (how you travel) / in a car (inside one car)']::text[], 'car'),
('In', 'noun', 'in a taxi', 'a taxi', 2, array['🧭 🚗 Travel: IN small vehicles you sit in']::text[], 'taxi'),
('In', 'noun', 'in my dad''s car', 'my dad''s car', 3, array['🧭 🚗 Travel: IN small vehicles you sit in']::text[], 'car'),
('In', 'noun', 'in the box', 'the box', 4, array['🧭 📍 Place: IN = inside a space or an area']::text[], 'box'),
('In', 'noun', 'in the kitchen', 'the kitchen', 5, array['🧭 📍 Place: IN = inside a space or an area']::text[], 'kitchen'),
('In', 'noun', 'in my room', 'my room', 6, array['🧭 📍 Place: IN = inside a space or an area']::text[], 'room'),
('In', 'noun', 'in the garden', 'the garden', 7, array['🧭 📍 Place: IN = inside a space or an area']::text[], 'garden'),
('In', 'noun', 'in the city', 'the city', 8, array['🧭 📍 Place: IN = inside a space or an area']::text[], 'city'),
('In', 'noun', 'in Saudi Arabia', 'Saudi Arabia', 9, array['🧭 📍 Place: IN = inside a space or an area']::text[], 'Arabia'),
('In', 'noun', 'in bed', 'bed', 10, array['🧭 📍 Fixed: IN with no the']::text[], 'bed'),
('In', 'noun', 'in class', 'class', 11, array['🧭 📍 Fixed: IN with no the']::text[], 'class'),
('In', 'noun', 'in school', 'school', 12, array['🧭 📍 Fixed: IN with no the','🇺🇸 American: still a student (in school); British: at school']::text[], 'school'),
('In', 'noun', 'in the hospital', 'the hospital', 13, array['🧭 🏥 In the hospital (as a patient)','🇺🇸 American; British English says in hospital']::text[], 'hospital'),
('In', 'noun', 'in the morning', 'the morning', 14, array['🧭 ⏰ Time: IN months, years, seasons and parts of the day']::text[], 'morning'),
('In', 'noun', 'in the afternoon', 'the afternoon', 15, array['🧭 ⏰ Time: IN months, years, seasons and parts of the day']::text[], 'afternoon'),
('In', 'noun', 'in the evening', 'the evening', 16, array['🧭 ⏰ Time: IN months, years, seasons and parts of the day']::text[], 'evening'),
('In', 'noun', 'in July', 'July', 17, array['🧭 ⏰ Time: IN months, years, seasons and parts of the day']::text[], 'July'),
('In', 'noun', 'in 2026', '2026', 18, array['🧭 ⏰ Time: IN months, years, seasons and parts of the day']::text[], '2026'),
('In', 'noun', 'in summer', 'summer', 19, array['🧭 ⏰ Time: IN months, years, seasons and parts of the day']::text[], 'summer'),
('At', 'noun', 'at the door', 'the door', 1, array['🧭 📍 Place: AT a point, or where something happens']::text[], 'door'),
('At', 'noun', 'at the bus stop', 'the bus stop', 2, array['🧭 📍 Place: AT a point, or where something happens']::text[], 'stop'),
('At', 'noun', 'at the station', 'the station', 3, array['🧭 📍 Place: AT a point, or where something happens']::text[], 'station'),
('At', 'noun', 'at the airport', 'the airport', 4, array['🧭 📍 Place: AT a point, or where something happens']::text[], 'airport'),
('At', 'noun', 'at the office', 'the office', 5, array['🧭 📍 Place: AT a point, or where something happens']::text[], 'office'),
('At', 'noun', 'at the doctor''s', 'the doctor''s', 6, array['🧭 📍 Place: AT a point, or where something happens']::text[], 'doctor'),
('At', 'noun', 'at the party', 'the party', 7, array['🧭 📍 Place: AT a point, or where something happens']::text[], 'party'),
('At', 'noun', 'at home', 'home', 8, array['🧭 📍 Fixed: AT with no the']::text[], 'home'),
('At', 'noun', 'at school', 'school', 9, array['🧭 📍 Fixed: AT with no the']::text[], 'school'),
('At', 'noun', 'at work', 'work', 10, array['🧭 📍 Fixed: AT with no the']::text[], 'work'),
('At', 'noun', 'at the hospital', 'the hospital', 11, array['🧭 🏥 At the hospital (visiting or working there)']::text[], 'hospital'),
('At', 'noun', 'at 7 o''clock', '7 o''clock', 12, array['🧭 ⏰ Time: AT clock times and short moments']::text[], 'o''clock'),
('At', 'noun', 'at noon', 'noon', 13, array['🧭 ⏰ Time: AT clock times and short moments']::text[], 'noon'),
('At', 'noun', 'at lunchtime', 'lunchtime', 14, array['🧭 ⏰ Time: AT clock times and short moments']::text[], 'lunchtime'),
('At', 'noun', 'at sunset', 'sunset', 15, array['🧭 ⏰ Time: AT clock times and short moments']::text[], 'sunset'),
('At', 'noun', 'at the moment', 'the moment', 16, array['🧭 ⏰ Time: AT clock times and short moments']::text[], 'moment'),
('At', 'noun', 'at night', 'night', 17, array['🧭 ⏰ The exception: AT night (but IN the morning)','⚠️ Exception: at night, but in the morning']::text[], 'night'),
('To', 'noun', 'go to school', 'go to school', 1, array['🧭 ➡️ Going somewhere: TO + the place']::text[], 'school'),
('To', 'noun', 'go to work', 'go to work', 2, array['🧭 ➡️ Going somewhere: TO + the place']::text[], 'work'),
('To', 'noun', 'go to bed', 'go to bed', 3, array['🧭 ➡️ Going somewhere: TO + the place']::text[], 'bed'),
('To', 'noun', 'go to the park', 'go to the park', 4, array['🧭 ➡️ Going somewhere: TO + the place']::text[], 'park'),
('To', 'noun', 'go to the hospital', 'go to the hospital', 5, array['🧭 ➡️ Going somewhere: TO + the place']::text[], 'hospital'),
('To', 'noun', 'go to the office', 'go to the office', 6, array['🧭 ➡️ Going somewhere: TO + the place']::text[], 'office'),
('To', 'noun', 'go home', 'go home', 7, array['🧭 ⚠️ The exception: go home (no TO)','⚠️ Exception: no to']::text[], 'home'),
('To', 'noun', 'come home', 'come home', 8, array['🧭 ⚠️ The exception: go home (no TO)','⚠️ Exception: no to']::text[], 'home'),
('To', 'noun', 'get home', 'get home', 9, array['🧭 ⚠️ The exception: go home (no TO)','⚠️ Exception: no to']::text[], 'home'),
('A', 'noun', 'a car', 'car', 1, array['🧭 🔤 A before a consonant SOUND']::text[], 'car'),
('A', 'noun', 'a bus', 'bus', 2, array['🧭 🔤 A before a consonant SOUND']::text[], 'bus'),
('A', 'noun', 'a dog', 'dog', 3, array['🧭 🔤 A before a consonant SOUND']::text[], 'dog'),
('A', 'noun', 'a book', 'book', 4, array['🧭 🔤 A before a consonant SOUND']::text[], 'book'),
('A', 'noun', 'a pen', 'pen', 5, array['🧭 🔤 A before a consonant SOUND']::text[], 'pen'),
('A', 'noun', 'a university', 'university', 6, array['🧭 👂 It''s the sound, not the letter: A + ''you'' sound','⚠️ Careful: ''yoo'' sound, so A']::text[], 'university'),
('A', 'noun', 'a uniform', 'uniform', 7, array['🧭 👂 It''s the sound, not the letter: A + ''you'' sound','⚠️ Careful: ''yoo'' sound, so A']::text[], 'uniform'),
('A', 'noun', 'a unicorn', 'unicorn', 8, array['🧭 👂 It''s the sound, not the letter: A + ''you'' sound','⚠️ Careful: ''yoo'' sound, so A']::text[], 'unicorn'),
('A', 'noun', 'a one-way street', 'one-way street', 9, array['🧭 👂 It''s the sound, not the letter: A + ''you'' sound','⚠️ Careful: ''won'' sound, so A']::text[], 'street'),
('An', 'noun', 'an apple', 'apple', 1, array['🧭 🔤 AN before a vowel SOUND (a, e, i, o, u)']::text[], 'apple'),
('An', 'noun', 'an egg', 'egg', 2, array['🧭 🔤 AN before a vowel SOUND (a, e, i, o, u)']::text[], 'egg'),
('An', 'noun', 'an idea', 'idea', 3, array['🧭 🔤 AN before a vowel SOUND (a, e, i, o, u)']::text[], 'idea'),
('An', 'noun', 'an orange', 'orange', 4, array['🧭 🔤 AN before a vowel SOUND (a, e, i, o, u)']::text[], 'orange'),
('An', 'noun', 'an umbrella', 'umbrella', 5, array['🧭 🔤 AN before a vowel SOUND (a, e, i, o, u)']::text[], 'umbrella'),
('An', 'noun', 'an elephant', 'elephant', 6, array['🧭 🔤 AN before a vowel SOUND (a, e, i, o, u)']::text[], 'elephant'),
('An', 'noun', 'an hour', 'hour', 7, array['🧭 👂 It''s the sound, not the letter: silent h','⚠️ Careful: silent h, so AN']::text[], 'hour'),
('An', 'noun', 'an honest friend', 'honest friend', 8, array['🧭 👂 It''s the sound, not the letter: silent h','⚠️ Careful: silent h, so AN']::text[], 'friend'),
('The', 'noun', 'the door', 'door', 1, array['🧭 👉 THE = the one we both know']::text[], 'door'),
('The', 'noun', 'the teacher', 'teacher', 2, array['🧭 👉 THE = the one we both know']::text[], 'teacher'),
('The', 'noun', 'the book I gave you', 'book I gave you', 3, array['🧭 👉 THE = the one we both know']::text[], 'you'),
('The', 'noun', 'the sun', 'sun', 4, array['🧭 🌍 THE = there is only one']::text[], 'sun'),
('The', 'noun', 'the moon', 'moon', 5, array['🧭 🌍 THE = there is only one']::text[], 'moon'),
('The', 'noun', 'the sky', 'sky', 6, array['🧭 🌍 THE = there is only one']::text[], 'sky'),
('The', 'noun', 'the world', 'world', 7, array['🧭 🌍 THE = there is only one']::text[], 'world'),
('The', 'noun', 'the internet', 'internet', 8, array['🧭 🌍 THE = there is only one']::text[], 'internet'),
('The', 'noun', 'the park', 'park', 9, array['🧭 🏙️ THE with places in town']::text[], 'park'),
('The', 'noun', 'the zoo', 'zoo', 10, array['🧭 🏙️ THE with places in town']::text[], 'zoo'),
('The', 'noun', 'the hospital', 'hospital', 11, array['🧭 🏙️ THE with places in town']::text[], 'hospital'),
('The', 'noun', 'the bus stop', 'bus stop', 12, array['🧭 🏙️ THE with places in town']::text[], 'stop'),
('The', 'noun', 'the beach', 'beach', 13, array['🧭 🏙️ THE with places in town']::text[], 'beach'),
('The', 'noun', 'at home', 'at home', 14, array['🧭 🚫 No article in these fixed phrases']::text[], ''),
('The', 'noun', 'by car', 'by car', 15, array['🧭 🚫 No article in these fixed phrases']::text[], ''),
('The', 'noun', 'in bed', 'in bed', 16, array['🧭 🚫 No article in these fixed phrases']::text[], ''),
('The', 'noun', 'go to school', 'go to school', 17, array['🧭 🚫 No article in these fixed phrases']::text[], ''),
('The', 'noun', 'play football', 'play football', 18, array['🧭 🚫 No article in these fixed phrases']::text[], ''),
('The', 'noun', 'have breakfast', 'have breakfast', 19, array['🧭 🚫 No article in these fixed phrases']::text[], '')
) as v(h, k, ph, pa, pos, tg, noun)
on conflict (word_id, lower(phrase)) do update set kind = excluded.kind, partner = excluded.partner, position = excluded.position, tags = excluded.tags, partner_word_id = excluded.partner_word_id;
select (select count(*) from public.set_entries where set_id = '00000000-0000-4000-8000-00000000c1a7') as little_words,
       (select count(*) from public.set_entries where set_id = '00000000-0000-4000-8000-00000000c011' and unit = 5) as travel_nouns,
       (select count(*) from public.word_partners p join public.words w on w.id = p.word_id where w.headword in ('By','On','In','At','To','A','An','The') and w.sense = '') as partners,
       (select count(*) from public.word_partners p join public.words w on w.id = p.word_id where w.headword in ('By','On','In','At','To','A','An','The') and w.sense = '' and p.partner_word_id is not null) as linked;
