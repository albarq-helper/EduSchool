-- =====================================================================
-- Helper Academy — v102: 📚 More Words: 17 extra words (prairie … waist), in their own set, NOT in Grade 5
-- Built by tools/words/build_v102_more_words.py. Safe to re-run.
-- =====================================================================
insert into public.study_sets (id, owner_id, author_name, institution_id, subject_id, level_code, title, description, language, translation_lang, units, visibility)
select '00000000-0000-4000-8000-00000000c2e1', (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com'), 'Ab', null, 1, 'any', 'More Words', 'Extra words with their Arabic meaning: prairie, noble, wadi, thobe, harpoon and more.', 'en', 'ar', '[{"u": 1, "name": "📚 Extra words"}]'::jsonb, 'public'
on conflict (id) do update set title = excluded.title, description = excluded.description, units = excluded.units;

insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Prairie', '', 'A large, flat area of grassland with very few trees, found in North America.', 'Wild bison once roamed the wide [prairie].', 'البراري', 'prai-rie', 'PRAIR-ee', '🌾', '', '', array['Naming: things & places','Plants, nature & weather']::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')
where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = 'prairie' and w.sense = '');
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('more:' || w.id)::uuid, '00000000-0000-4000-8000-00000000c2e1', 1, 'term', 1, '{}', w.id from public.words w where w.lang = 'en' and lower(w.headword) = 'prairie' and w.sense = '' limit 1
on conflict (id) do update set position = excluded.position;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Noble', '', 'Good, honest and brave; or from a very important family.', 'The [noble] knight helped every family in the village.', 'نبيل', 'no-ble', 'NOH-bul', '👑', '', '', array['Describing']::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')
where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = 'noble' and w.sense = '');
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('more:' || w.id)::uuid, '00000000-0000-4000-8000-00000000c2e1', 2, 'term', 1, '{}', w.id from public.words w where w.lang = 'en' and lower(w.headword) = 'noble' and w.sense = '' limit 1
on conflict (id) do update set position = excluded.position;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Offer', '', 'To give or provide something, or to say you are ready to do something for someone.', 'The shop will [offer] a free juice to every child.', 'يوفّر', 'of-fer', 'AW-fer', '🎁', '', '', array['Action']::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')
where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = 'offer' and w.sense = '');
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('more:' || w.id)::uuid, '00000000-0000-4000-8000-00000000c2e1', 3, 'term', 1, '{}', w.id from public.words w where w.lang = 'en' and lower(w.headword) = 'offer' and w.sense = '' limit 1
on conflict (id) do update set position = excluded.position;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Thobe', '', 'A long, loose garment that men wear in Arabian countries.', 'My father wore a white [thobe] on Eid.', 'ثوب', 'thobe', 'THOHB', '👕', '', '', array['Naming: things & places']::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')
where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = 'thobe' and w.sense = '');
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('more:' || w.id)::uuid, '00000000-0000-4000-8000-00000000c2e1', 4, 'term', 1, '{}', w.id from public.words w where w.lang = 'en' and lower(w.headword) = 'thobe' and w.sense = '' limit 1
on conflict (id) do update set position = excluded.position;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Cuff', '', 'The end of a sleeve, around the wrist.', 'He folded back the [cuff] of his sleeve.', 'كف', 'cuff', 'KUF', '👔', '', '', array['Naming: things & places']::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')
where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = 'cuff' and w.sense = '');
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('more:' || w.id)::uuid, '00000000-0000-4000-8000-00000000c2e1', 5, 'term', 1, '{}', w.id from public.words w where w.lang = 'en' and lower(w.headword) = 'cuff' and w.sense = '' limit 1
on conflict (id) do update set position = excluded.position;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Wadi', '', 'A dry river valley in the desert that fills with water after heavy rain.', 'After the storm, water rushed through the [wadi].', 'وادي', 'wa-di', 'WAH-dee', '🏜️', '', '', array['Naming: things & places','Plants, nature & weather']::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')
where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = 'wadi' and w.sense = '');
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('more:' || w.id)::uuid, '00000000-0000-4000-8000-00000000c2e1', 6, 'term', 1, '{}', w.id from public.words w where w.lang = 'en' and lower(w.headword) = 'wadi' and w.sense = '' limit 1
on conflict (id) do update set position = excluded.position;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Coffin', '', 'A long box in which a dead person is buried.', 'The [coffin] was carried slowly to the cemetery.', 'كفن', 'cof-fin', 'KAW-fin', '⚰️', '', '', array['Naming: things & places']::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')
where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = 'coffin' and w.sense = '');
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('more:' || w.id)::uuid, '00000000-0000-4000-8000-00000000c2e1', 7, 'term', 1, '{}', w.id from public.words w where w.lang = 'en' and lower(w.headword) = 'coffin' and w.sense = '' limit 1
on conflict (id) do update set position = excluded.position;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Earth', '', 'The planet we live on; also the soil or ground.', 'The astronauts looked back at [Earth] from space.', 'أرض', 'earth', 'URTH', '🌍', '', '', array['Naming: things & places','Plants, nature & weather']::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')
where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = 'earth' and w.sense = '');
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('more:' || w.id)::uuid, '00000000-0000-4000-8000-00000000c2e1', 8, 'term', 1, '{}', w.id from public.words w where w.lang = 'en' and lower(w.headword) = 'earth' and w.sense = '' limit 1
on conflict (id) do update set position = excluded.position;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Syrup', '', 'A thick, sweet liquid, like the kind you pour on pancakes.', 'She poured maple [syrup] over the pancakes.', 'شراب', 'syr-up', 'SIR-up', '🍯', '', '', array['Naming: things & places','Food & drink']::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')
where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = 'syrup' and w.sense = '');
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('more:' || w.id)::uuid, '00000000-0000-4000-8000-00000000c2e1', 9, 'term', 1, '{}', w.id from public.words w where w.lang = 'en' and lower(w.headword) = 'syrup' and w.sense = '' limit 1
on conflict (id) do update set position = excluded.position;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Mummy', '', 'A dead body wrapped in cloth and kept for thousands of years, especially in ancient Egypt.', 'We saw a real [mummy] at the museum.', 'مومياء', 'mum-my', 'MUM-ee', '🏺', '', '', array['Naming: things & places']::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')
where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = 'mummy' and w.sense = '');
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('more:' || w.id)::uuid, '00000000-0000-4000-8000-00000000c2e1', 10, 'term', 1, '{}', w.id from public.words w where w.lang = 'en' and lower(w.headword) = 'mummy' and w.sense = '' limit 1
on conflict (id) do update set position = excluded.position;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Misery', '', 'A feeling of great sadness or suffering.', 'The cold, rainy week was pure [misery].', 'مزري', 'mis-er-y', 'MIZ-uh-ree', '😭', '', '', array['Naming: things & places','Feelings & moods']::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')
where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = 'misery' and w.sense = '');
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('more:' || w.id)::uuid, '00000000-0000-4000-8000-00000000c2e1', 11, 'term', 1, '{}', w.id from public.words w where w.lang = 'en' and lower(w.headword) = 'misery' and w.sense = '' limit 1
on conflict (id) do update set position = excluded.position;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Would', '', 'Used for wishes, polite questions and things that might happen.', '[Would] you like some tea?', 'يودّ', 'would', 'WUUD', '💭', '', '', array['Action']::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')
where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = 'would' and w.sense = '');
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('more:' || w.id)::uuid, '00000000-0000-4000-8000-00000000c2e1', 12, 'term', 1, '{}', w.id from public.words w where w.lang = 'en' and lower(w.headword) = 'would' and w.sense = '' limit 1
on conflict (id) do update set position = excluded.position;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Tail', '', 'The part that sticks out at the back of an animal''s body.', 'The dog wagged its [tail] happily.', 'ذيل', 'tail', 'TAYL', '🐕', '', '', array['Naming: things & places','Animals']::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')
where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = 'tail' and w.sense = '');
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('more:' || w.id)::uuid, '00000000-0000-4000-8000-00000000c2e1', 13, 'term', 1, '{}', w.id from public.words w where w.lang = 'en' and lower(w.headword) = 'tail' and w.sense = '' limit 1
on conflict (id) do update set position = excluded.position;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Body', '', 'All the physical parts of a person or an animal.', 'Exercise keeps your [body] strong.', 'بدن', 'bod-y', 'BAW-dee', '🧍', '', '', array['Naming: things & places','Health & body']::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')
where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = 'body' and w.sense = '');
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('more:' || w.id)::uuid, '00000000-0000-4000-8000-00000000c2e1', 14, 'term', 1, '{}', w.id from public.words w where w.lang = 'en' and lower(w.headword) = 'body' and w.sense = '' limit 1
on conflict (id) do update set position = excluded.position;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Harpoon', '', 'A long spear tied to a rope, used for hunting whales and big fish.', 'The sailor threw the [harpoon] at the whale.', 'حربة', 'har-poon', 'har-POON', '🔱', '', '', array['Naming: things & places']::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')
where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = 'harpoon' and w.sense = '');
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('more:' || w.id)::uuid, '00000000-0000-4000-8000-00000000c2e1', 15, 'term', 1, '{}', w.id from public.words w where w.lang = 'en' and lower(w.headword) = 'harpoon' and w.sense = '' limit 1
on conflict (id) do update set position = excluded.position;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Nagging', '', 'Complaining or telling someone to do something again and again, in an annoying way.', 'His little sister''s [nagging] made him stop playing.', 'نكدي', 'nag-ging', 'NAG-ing', '😩', '', '', array['Describing']::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')
where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = 'nagging' and w.sense = '');
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('more:' || w.id)::uuid, '00000000-0000-4000-8000-00000000c2e1', 16, 'term', 1, '{}', w.id from public.words w where w.lang = 'en' and lower(w.headword) = 'nagging' and w.sense = '' limit 1
on conflict (id) do update set position = excluded.position;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Waist', '', 'The narrow part of your body between your ribs and your hips.', 'He tied the belt around his [waist].', 'وسط', 'waist', 'WAYST', '📏', '', '', array['Naming: things & places','Health & body']::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')
where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = 'waist' and w.sense = '');
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('more:' || w.id)::uuid, '00000000-0000-4000-8000-00000000c2e1', 17, 'term', 1, '{}', w.id from public.words w where w.lang = 'en' and lower(w.headword) = 'waist' and w.sense = '' limit 1
on conflict (id) do update set position = excluded.position;
select count(*) as in_more_words from public.set_entries where set_id = '00000000-0000-4000-8000-00000000c2e1';
