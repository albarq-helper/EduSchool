-- =====================================================================
-- Helper Academy — v63: 🎯 accurate meanings
--   * words.sense_kind (main / everyday exaggeration / figurative) and words.main_word_id: the everyday use points to its main meaning
--   * 5 new main senses: Fantastic, Brilliant, Impact, Petrified, Devastated (+ Starving from v62); origin notes for Awful and Exhausted
--   * 10 corrected meanings; every word video checked: words.media_check / media_note / media_prompt
-- Built by tools/words/build_v63.py
-- =====================================================================
alter table public.words add column if not exists sense_kind text check (sense_kind in ('main','exaggeration','figurative')),
  add column if not exists main_word_id uuid references public.words(id) on delete set null,
  add column if not exists media_check text check (media_check in ('ok','partial','wrong')),
  add column if not exists media_note text, add column if not exists media_prompt text;

insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id, sense_kind, media_prompt)
values ('en', 'Fantastic (like a fantasy)', '', 'Strange and imaginary, like something from a dream or a fairy tale. This is the main, older meaning.', 'The book is full of [fantastic] creatures, like dragons and talking trees.', 'خيالي: غريب وكأنه من الأحلام أو الحكايات.', '', '', '🐉', '', '', array['Describing','Words & books']::text[],
  (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com'), 'main', 'A child opens a storybook and imaginary things float out of the pages: a small friendly dragon, a talking tree, a floating castle; the child stares in wonder. 3D animated children''s-film style, warm autumn light, soft colours, 5 seconds, no text on screen.')
on conflict (lang, lower(headword), sense) do update set meaning = excluded.meaning, example = excluded.example, translation = excluded.translation, tags = excluded.tags, sense_kind = 'main', media_prompt = excluded.media_prompt;
update public.words set sense_kind = 'exaggeration', meaning = 'Very, very good: an everyday exaggeration. It comes from the main meaning (strange and imaginary, like a fantasy): "so good it''s almost unreal".', main_word_id = (select id from public.words where lang = 'en' and headword = 'Fantastic (like a fantasy)' and sense = '') where id = '910070bf-1291-42d0-9da2-3e5e22302a0a';
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('main-sense:' || 'Fantastic (like a fantasy)' || ':' || e.set_id)::uuid, e.set_id, e.position, 'term', e.unit, '{}', w.id
from public.set_entries e, public.words w where e.word_id = '910070bf-1291-42d0-9da2-3e5e22302a0a' and w.lang = 'en' and w.headword = 'Fantastic (like a fantasy)' and w.sense = ''
on conflict (id) do nothing;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id, sense_kind, media_prompt)
values ('en', 'Brilliant (very bright)', '', 'Shining very brightly. This is the main, older meaning.', 'The [brilliant] sunshine sparkled on the sea.', 'ساطع، لامع جدًّا.', '', '', '☀️', '', '', array['Describing','Light & sound']::text[],
  (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com'), 'main', 'Sunlight bursts through clouds and sparkles brilliantly on the sea and on a glass jar on a windowsill; light rays shine and glitter. 3D animated children''s-film style, warm autumn light, soft colours, 5 seconds, no text on screen.')
on conflict (lang, lower(headword), sense) do update set meaning = excluded.meaning, example = excluded.example, translation = excluded.translation, tags = excluded.tags, sense_kind = 'main', media_prompt = excluded.media_prompt;
update public.words set sense_kind = 'figurative', meaning = 'Very clever. It comes from the main meaning (shining very brightly): a mind that shines. People also say "Brilliant!" to mean "very good".', main_word_id = (select id from public.words where lang = 'en' and headword = 'Brilliant (very bright)' and sense = '') where id = '6187c6ea-848a-4a5a-8f26-f74e4dbee86c';
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('main-sense:' || 'Brilliant (very bright)' || ':' || e.set_id)::uuid, e.set_id, e.position, 'term', e.unit, '{}', w.id
from public.set_entries e, public.words w where e.word_id = '6187c6ea-848a-4a5a-8f26-f74e4dbee86c' and w.lang = 'en' and w.headword = 'Brilliant (very bright)' and w.sense = ''
on conflict (id) do nothing;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id, sense_kind, media_prompt)
values ('en', 'Impact (hit)', '', 'The moment or force of one thing hitting another. This is the main meaning.', 'The [impact] of the ball cracked the window.', 'اصطدام؛ قوة ارتطام شيء بشيء.', '', '', '💥', '', '', array['Naming: things & places','Science']::text[],
  (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com'), 'main', null)
on conflict (lang, lower(headword), sense) do update set meaning = excluded.meaning, example = excluded.example, translation = excluded.translation, tags = excluded.tags, sense_kind = 'main', media_prompt = excluded.media_prompt;
update public.words set sense_kind = 'figurative', meaning = 'A strong effect or influence on a person or a group. It comes from the main meaning (one thing hitting another): an idea or event that "hits" people and changes them.', main_word_id = (select id from public.words where lang = 'en' and headword = 'Impact (hit)' and sense = '') where id = 'd1a92e9e-897c-4d24-9e0e-c7731f783385';
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('main-sense:' || 'Impact (hit)' || ':' || e.set_id)::uuid, e.set_id, e.position, 'term', e.unit, '{}', w.id
from public.set_entries e, public.words w where e.word_id = 'd1a92e9e-897c-4d24-9e0e-c7731f783385' and w.lang = 'en' and w.headword = 'Impact (hit)' and w.sense = ''
on conflict (id) do nothing;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id, sense_kind, media_prompt)
values ('en', 'Petrified (turned to stone)', '', 'Turned into stone over a very long time. This is the main meaning.', 'In the museum we touched a [petrified] tree trunk millions of years old.', 'متحجّر: تحوّل إلى حجر.', '', '', '🪨', '', '', array['Describing','Science','Plants, nature & weather']::text[],
  (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com'), 'main', 'Time-lapse of an old wooden log slowly turning into stone, its rings changing into grey and red crystal; a child in a museum touches it in wonder. 3D animated children''s-film style, warm autumn light, soft colours, 5 seconds, no text on screen.')
on conflict (lang, lower(headword), sense) do update set meaning = excluded.meaning, example = excluded.example, translation = excluded.translation, tags = excluded.tags, sense_kind = 'main', media_prompt = excluded.media_prompt;
update public.words set sense_kind = 'figurative', meaning = 'So scared that you cannot move. It comes from the main meaning (turned into stone): frozen like a statue with fear.', main_word_id = (select id from public.words where lang = 'en' and headword = 'Petrified (turned to stone)' and sense = '') where id = '0f0df582-6a64-4efd-9f87-edd3b26ef723';
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('main-sense:' || 'Petrified (turned to stone)' || ':' || e.set_id)::uuid, e.set_id, e.position, 'term', e.unit, '{}', w.id
from public.set_entries e, public.words w where e.word_id = '0f0df582-6a64-4efd-9f87-edd3b26ef723' and w.lang = 'en' and w.headword = 'Petrified (turned to stone)' and w.sense = ''
on conflict (id) do nothing;
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id, sense_kind, media_prompt)
values ('en', 'Devastated (destroyed)', '', 'Badly damaged or completely destroyed. This is the main meaning.', 'After the storm, the village was [devastated], and neighbours came to help rebuild.', 'مدمَّر، خرِب تمامًا.', '', '', '🌪️', '', '', array['Describing','Danger & safety']::text[],
  (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com'), 'main', 'A small village after a storm with fallen trees and broken roofs, then neighbours arriving with tools and smiles to rebuild together; gentle, hopeful, nobody hurt. 3D animated children''s-film style, warm autumn light, soft colours, 5 seconds, no text on screen.')
on conflict (lang, lower(headword), sense) do update set meaning = excluded.meaning, example = excluded.example, translation = excluded.translation, tags = excluded.tags, sense_kind = 'main', media_prompt = excluded.media_prompt;
update public.words set sense_kind = 'figurative', meaning = 'Extremely sad and shocked. It comes from the main meaning (completely destroyed): feeling as if everything inside you has been knocked down.', main_word_id = (select id from public.words where lang = 'en' and headword = 'Devastated (destroyed)' and sense = '') where id = '2fbf159d-e25a-41b8-9cc4-ff373e85ecfa';
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('main-sense:' || 'Devastated (destroyed)' || ':' || e.set_id)::uuid, e.set_id, e.position, 'term', e.unit, '{}', w.id
from public.set_entries e, public.words w where e.word_id = '2fbf159d-e25a-41b8-9cc4-ff373e85ecfa' and w.lang = 'en' and w.headword = 'Devastated (destroyed)' and w.sense = ''
on conflict (id) do nothing;
update public.words set sense_kind = 'main', media_prompt = 'A village family in a dry, dusty landscape during a drought, sharing one small loaf of bread at a simple wooden table; neighbours arrive with a basket of food. Dignified faces, hope rather than misery, no distressing images. 3D animated children''s-film style, warm light, 5 seconds, no text on screen.'
  where lang = 'en' and headword = 'Starving (no food)' and sense = '';
update public.words set sense_kind = 'exaggeration', main_word_id = (select id from public.words where lang = 'en' and headword = 'Starving (no food)' and sense = '') where id = 'da9d20fa-20b2-45e2-ac4b-29fb2f3ba0b2';
update public.words set meaning = 'Very bad or unpleasant. Long ago it meant "full of awe" (so great it makes you afraid); over time it came to mean just "very bad".' where id = '6322cd0c-cd8a-4387-89b6-f038d22f23a7';
update public.words set meaning = 'Extremely tired, with no energy left. It comes from "exhausted" = completely used up (the water supply was exhausted).' where id = '73cad1dd-a172-4771-ba19-694390bafe40';
update public.words set meaning = 'Not safe or steady; likely to fall, break or go wrong.' where id = 'e9b2972c-dea2-4304-ba5f-f76d6e845e73';
update public.words set meaning = 'Bending the body forward and down.' where id = '2fb28a9e-2a6f-477b-9301-0ee91737d1a5';
update public.words set meaning = 'Someone who wanders or travels from place to place.' where id = '3f3b1412-e995-4fac-984d-68bc332266f3';
update public.words set meaning = 'Slightly wet; damp.' where id = '98d2828d-4727-4034-b574-1ac2389f7bc1';
update public.words set meaning = 'A scientist who studies insects.' where id = '25c3ed41-81ac-428a-b6c5-da99b3f8f9c9';
update public.words set meaning = 'Very fierce, violent and frightening.' where id = '8116681a-46af-46a6-940a-7a491b980854';
update public.words set meaning = 'Worried and a little scared about something that is going to happen.' where id = '479b89f1-ee0d-428b-9df1-feb80783dc6f';
update public.words set meaning = 'Lying down, resting or crouching (an old, story-book use; today "couched" usually means "put into words", as in "couched in polite words").' where id = '34730c87-aa9c-4565-b109-898db83d7058';
update public.words set meaning = 'Looks at something closely and carefully, often because it is hard to see. ("Peers" as a noun means people of the same age.)' where id = '59f3e425-c8ee-4c64-a0e9-f0ff793fe19b';
update public.words set meaning = 'A line of light that shines from something bright. (A beam is also a long, strong piece of wood or metal, and to beam means to smile widely.)' where id = '2ae4d258-7864-4585-bd81-9324d8e976d2';
update public.words set video_url = coalesce((select video_url from public.words where id = 'd1a92e9e-897c-4d24-9e0e-c7731f783385'), '') where lang = 'en' and headword = 'Impact (hit)' and sense = '' and coalesce(video_url, '') = '';
update public.words set media_check = 'ok', media_note = null where coalesce(video_url, '') <> '';
update public.words set media_check = 'partial', media_note = 'Shows a row of blocks getting shorter, not a word getting shorter.', media_prompt = coalesce('A long word "Department" written in chalk on a board; a friendly eraser rubs out letters until it becomes "Dept."; a child points and smiles. 3D animated children''s-film style, warm autumn light, soft colours, 5 seconds, no text on screen.', media_prompt) where split_part(video_url, '?', 1) = 'assets/videos/abbreviation.mp4';
update public.words set media_check = 'partial', media_note = 'A pill bug looks at its reflection in a water drop; the idea of "how something looks" is not clear.', media_prompt = coalesce('A child tries on a pirate hat and an eye patch in front of a mirror; the reflection shows the new look, the child laughs at how different they appear. 3D animated children''s-film style, warm autumn light, soft colours, 5 seconds, no text on screen.', media_prompt) where split_part(video_url, '?', 1) = 'assets/videos/appearance.mp4';
update public.words set media_check = 'partial', media_note = 'Fish swimming under the water''s surface; it does not clearly show one thing under another.', media_prompt = coalesce('A kitten hides beneath a wooden table covered with a long tablecloth; a child lifts the cloth and finds it underneath. 3D animated children''s-film style, warm autumn light, soft colours, 5 seconds, no text on screen.', media_prompt) where split_part(video_url, '?', 1) = 'assets/videos/beneath.mp4';
update public.words set media_check = 'partial', media_note = 'Ants build a stick tower; it is not clear that one piece is extremely important.', media_prompt = coalesce('A boy builds a tall block tower; when one bottom block is pulled out, the whole tower wobbles and falls: that block was crucial. 3D animated children''s-film style, warm autumn light, soft colours, 5 seconds, no text on screen.', media_prompt) where split_part(video_url, '?', 1) = 'assets/videos/crucial.mp4';
update public.words set media_check = 'wrong', media_note = 'A child with a crown drinks tea among sparkles; it shows neither "very good" nor "like a fantasy".', media_prompt = coalesce('A child opens a birthday present, gasps, then jumps with joy and shouts happily; friends cheer around them. 3D animated children''s-film style, warm autumn light, soft colours, 5 seconds, no text on screen.', media_prompt) where split_part(video_url, '?', 1) = 'assets/videos/fantastic.mp4';
update public.words set media_check = 'wrong', media_note = 'The tiger smiles and looks cute and friendly, the opposite of ferocious.', media_prompt = coalesce('A tiger in a jungle crouches, bares its teeth and gives a loud, frightening roar; birds fly away in fright (not gory). 3D animated children''s-film style, warm autumn light, soft colours, 5 seconds, no text on screen.', media_prompt) where split_part(video_url, '?', 1) = 'assets/videos/ferocious.mp4';
update public.words set media_check = 'partial', media_note = 'An old man walks past a pot; the quick look is hard to see.', media_prompt = coalesce('A girl walking past a bakery window glances quickly at the cakes for one second, then keeps walking, smiling. 3D animated children''s-film style, warm autumn light, soft colours, 5 seconds, no text on screen.', media_prompt) where split_part(video_url, '?', 1) = 'assets/videos/glance.mp4';
update public.words set media_check = 'partial', media_note = 'It isn''t clear who is insisting: the dad offers a drink and the boy refuses.', media_prompt = coalesce('A mum holds out a coat and keeps pointing at the snowy window, shaking her head firmly at every "no", until the child sighs and puts the coat on. 3D animated children''s-film style, warm autumn light, soft colours, 5 seconds, no text on screen.', media_prompt) where split_part(video_url, '?', 1) = 'assets/videos/insisted.mp4';
update public.words set media_check = 'wrong', media_note = 'Shows a small animal rolling up next to a snail shell; no name or nickname appears.', media_prompt = coalesce('Classmates call a tall boy named Thomas "Tree" and a fast girl "Rocket"; small name tags above their heads change from the real names to the nicknames while they all laugh kindly. 3D animated children''s-film style, warm autumn light, soft colours, 5 seconds, no text on screen.', media_prompt) where split_part(video_url, '?', 1) = 'assets/videos/nicknamed.mp4';
update public.words set media_check = 'partial', media_note = 'A glowing leaf falls into a child''s hands; what it stands for is not clear.', media_prompt = coalesce('A white dove flies over children from different countries holding hands; the dove glows and the word-free idea is "peace". 3D animated children''s-film style, warm autumn light, soft colours, 5 seconds, no text on screen.', media_prompt) where split_part(video_url, '?', 1) = 'assets/videos/symbolized.mp4';
update public.words set media_check = 'partial', media_note = 'Green terraced hills; it shows a landscape, not one area marked as part of a bigger place.', media_prompt = coalesce('A map of a country; one area lights up and the camera zooms into it: mountains, villages and its own colour, showing one region of the country. 3D animated children''s-film style, warm autumn light, soft colours, 5 seconds, no text on screen.', media_prompt) where split_part(video_url, '?', 1) = 'assets/videos/region.mp4';
update public.words set media_check = 'ok', media_note = 'A drop hits the water (the main meaning: a hit) and the ripples spread (the effect). Good for both senses.', media_prompt = coalesce(null, media_prompt) where split_part(video_url, '?', 1) = 'assets/videos/impact.mp4';
update public.words set media_check = 'ok', media_note = 'Shows the everyday meaning (very hungry). The main meaning has its own word: Starving (no food).', media_prompt = coalesce(null, media_prompt) where split_part(video_url, '?', 1) = 'assets/videos/starving.mp4';

-- the lists read words through set_items: add the new fields at the end
create or replace view public.set_items with (security_invoker = on) as
select e.id, e.set_id, e.position, e.kind, e.unit, e.also_units,
       coalesce(e.term, w.headword) as term, coalesce(e.meaning, w.meaning, '') as meaning, coalesce(e.example, w.example, '') as example,
       coalesce(e.translation, w.translation, '') as translation, coalesce(e.syllables, w.syllables, '') as syllables,
       coalesce(e.image_url, w.image_url, '') as image_url, coalesce(e.anim_url, w.anim_url, '') as anim_url, coalesce(e.audio_url, w.audio_url, '') as audio_url,
       e.choices, e.answer, e.created_at, coalesce(e.pronunciation, w.pronunciation, '') as pronunciation, coalesce(e.sound_hint, w.sound_hint, '') as sound_hint,
       coalesce(e.video_url, w.video_url, '') as video_url, coalesce(e.emoji, w.emoji, '') as emoji, coalesce(e.tags, w.tags, '{}') as tags,
       e.word_id, coalesce(w.sense, '') as sense, (e.word_id is not null and e.meaning is not null) as set_meaning,
       coalesce(e.literal, w.literal, '') as literal, coalesce(e.literal_tr, w.literal_tr, '') as literal_tr, coalesce(e.equivalent, w.equivalent, '') as equivalent,
       coalesce(e.author, w.author, '') as author, coalesce(e.film, w.film, '') as film, coalesce(e.min_age, w.min_age, 0) as min_age,
       coalesce(w.sense_kind, '') as sense_kind, coalesce(m.headword, '') as main_term, coalesce(w.media_check, '') as media_check,
       coalesce(w.media_note, '') as media_note, coalesce(w.media_prompt, '') as media_prompt,
       coalesce((select string_agg(x.headword, '|') from public.words x where x.main_word_id = w.id), '') as other_senses
from public.set_entries e left join public.words w on w.id = e.word_id left join public.words m on m.id = w.main_word_id
where coalesce(e.min_age, w.min_age, 0) <= public.viewer_age();
grant select on public.set_items to anon, authenticated;

select (select count(*) from public.words where sense_kind = 'main') as main_senses, (select count(*) from public.words where main_word_id is not null) as linked,
       (select count(*) filter (where media_check = 'ok') from public.words) as videos_ok, (select count(*) filter (where media_check = 'partial') from public.words) as partial,
       (select count(*) filter (where media_check = 'wrong') from public.words) as wrong;
