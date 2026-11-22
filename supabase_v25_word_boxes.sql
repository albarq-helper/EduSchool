-- =====================================================================
-- Helper Academy — v25: Word boxes for the Story builder + a "Linking words" box
-- Run AFTER supabase_v24_feeling_scales.sql (safe to run more than once).
--
-- study_sets.story_box marks sets that appear as extra Word boxes in the Story builder:
--   'words' = vocabulary words (added as words), 'link' = linking words (added as the student's own words).
-- =====================================================================
alter table public.study_sets add column if not exists story_box text;
alter table public.study_sets drop constraint if exists study_sets_story_box_check;
alter table public.study_sets add constraint study_sets_story_box_check check (story_box is null or story_box in ('words','link'));

insert into public.study_sets (id, owner_id, author_name, institution_id, subject_id, level_code, title, description,
                               language, translation_lang, units, visibility, story_box)
select '00000000-0000-4000-8000-00000000c0de', p.id, 'Ab', null, 1, 'any', 'Linking Words',
  'Words that join ideas and move a story along: time and order, adding ideas, contrast, cause and effect, examples, and endings.',
  'en', 'ar', '[{"u": 1, "name": "Time & order"},{"u": 2, "name": "Adding ideas"},{"u": 3, "name": "Contrast"},{"u": 4, "name": "Cause & effect"},{"u": 5, "name": "Examples"},{"u": 6, "name": "Endings"}]'::jsonb, 'public', 'link'
from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com'
on conflict (id) do update set title = excluded.title, description = excluded.description, units = excluded.units, story_box = excluded.story_box;

insert into public.set_items (id, set_id, position, kind, unit, also_units, term, meaning, example, translation,
                              syllables, image_url, anim_url, audio_url, pronunciation, sound_hint, emoji, tags)
values
  ('00000000-0000-4000-8000-00000c0d0001', '00000000-0000-4000-8000-00000000c0de', 1, 'term', 1, '{}', 'Once upon a time', 'A way to start a story about long ago.', '[Once upon a time], a little fox lived in a forest.', 'في قديم الزمان', 'once upon a time', '', '', '', '', '', '🏰', array['Time & order']::text[]),
  ('00000000-0000-4000-8000-00000c0d0002', '00000000-0000-4000-8000-00000000c0de', 2, 'term', 1, '{}', 'One day', 'Used to start the main part of a story.', '[One day], the fox found a shiny key.', 'في يوم من الأيام', 'one day', '', '', '', '', '', '📅', array['Time & order']::text[]),
  ('00000000-0000-4000-8000-00000c0d0003', '00000000-0000-4000-8000-00000000c0de', 3, 'term', 1, '{}', 'First', 'Before anything else.', '[First], she packed her bag.', 'أولاً', 'first', '', '', '', '', '', '1️⃣', array['Time & order']::text[]),
  ('00000000-0000-4000-8000-00000c0d0004', '00000000-0000-4000-8000-00000000c0de', 4, 'term', 1, '{}', 'Next', 'Straight after that.', '[Next], they walked to the river.', 'بعد ذلك / التالي', 'next', '', '', '', '', '', '➡️', array['Time & order']::text[]),
  ('00000000-0000-4000-8000-00000c0d0005', '00000000-0000-4000-8000-00000000c0de', 5, 'term', 1, '{}', 'Then', 'After that.', 'He ate his lunch, [then] he played outside.', 'ثم', 'then', '', '', '', '', '', '⏭️', array['Time & order']::text[]),
  ('00000000-0000-4000-8000-00000c0d0006', '00000000-0000-4000-8000-00000000c0de', 6, 'term', 1, '{}', 'After that', 'When the last thing was finished.', '[After that], we went home.', 'بعد ذلك', 'after that', '', '', '', '', '', '⏩', array['Time & order']::text[]),
  ('00000000-0000-4000-8000-00000c0d0007', '00000000-0000-4000-8000-00000000c0de', 7, 'term', 1, '{}', 'Later', 'At a time after now or after then.', '[Later], the sky turned dark.', 'لاحقاً', 'later', '', '', '', '', '', '🕒', array['Time & order']::text[]),
  ('00000000-0000-4000-8000-00000c0d0008', '00000000-0000-4000-8000-00000000c0de', 8, 'term', 1, '{}', 'Meanwhile', 'At the same time, somewhere else.', '[Meanwhile], the cat was hiding under the bed.', 'في هذه الأثناء', 'meanwhile', '', '', '', '', '', '🔀', array['Time & order']::text[]),
  ('00000000-0000-4000-8000-00000c0d0009', '00000000-0000-4000-8000-00000000c0de', 9, 'term', 1, '{}', 'Suddenly', 'Very quickly and by surprise.', '[Suddenly], the lights went out!', 'فجأة', 'suddenly', '', '', '', '', '', '⚡', array['Time & order']::text[]),
  ('00000000-0000-4000-8000-00000c0d0010', '00000000-0000-4000-8000-00000000c0de', 10, 'term', 1, '{}', 'As soon as', 'At the moment that something happens.', '[As soon as] the bell rang, we ran outside.', 'بمجرد أن', 'as soon as', '', '', '', '', '', '⏱️', array['Time & order']::text[]),
  ('00000000-0000-4000-8000-00000c0d0011', '00000000-0000-4000-8000-00000000c0de', 11, 'term', 1, '{}', 'Before', 'Earlier than something else.', 'Wash your hands [before] you eat.', 'قبل', 'before', '', '', '', '', '', '⏮️', array['Time & order']::text[]),
  ('00000000-0000-4000-8000-00000c0d0012', '00000000-0000-4000-8000-00000000c0de', 12, 'term', 1, '{}', 'While', 'During the time that.', '[While] I was reading, it started to rain.', 'بينما', 'while', '', '', '', '', '', '⏳', array['Time & order']::text[]),
  ('00000000-0000-4000-8000-00000c0d0013', '00000000-0000-4000-8000-00000000c0de', 13, 'term', 1, '{}', 'When', 'At the time that.', '[When] the sun rose, the birds began to sing.', 'عندما', 'when', '', '', '', '', '', '🕰️', array['Time & order']::text[]),
  ('00000000-0000-4000-8000-00000c0d0014', '00000000-0000-4000-8000-00000000c0de', 14, 'term', 1, '{}', 'Eventually', 'In the end, after a long time.', '[Eventually], they found the way home.', 'في النهاية / أخيراً', 'eventually', '', '', '', '', '', '🛤️', array['Time & order']::text[]),
  ('00000000-0000-4000-8000-00000c0d0015', '00000000-0000-4000-8000-00000000c0de', 15, 'term', 2, '{}', 'And', 'Joins two ideas together.', 'I like apples [and] bananas.', 'و', 'and', '', '', '', '', '', '➕', array['Adding ideas']::text[]),
  ('00000000-0000-4000-8000-00000c0d0016', '00000000-0000-4000-8000-00000000c0de', 16, 'term', 2, '{}', 'Also', 'In addition; as well.', 'She can sing. She can [also] dance.', 'أيضاً', 'also', '', '', '', '', '', '➕', array['Adding ideas']::text[]),
  ('00000000-0000-4000-8000-00000c0d0017', '00000000-0000-4000-8000-00000000c0de', 17, 'term', 2, '{}', 'Too', 'As well (usually at the end of a sentence).', 'I want to come [too].', 'كذلك / أيضاً', 'too', '', '', '', '', '', '🙋', array['Adding ideas']::text[]),
  ('00000000-0000-4000-8000-00000c0d0018', '00000000-0000-4000-8000-00000000c0de', 18, 'term', 2, '{}', 'As well as', 'And also.', 'He brought crayons [as well as] paper.', 'بالإضافة إلى', 'as well as', '', '', '', '', '', '🤝', array['Adding ideas']::text[]),
  ('00000000-0000-4000-8000-00000c0d0019', '00000000-0000-4000-8000-00000000c0de', 19, 'term', 2, '{}', 'In addition', 'Adding one more idea.', '[In addition], we planted three trees.', 'بالإضافة إلى ذلك', 'in addition', '', '', '', '', '', '📎', array['Adding ideas']::text[]),
  ('00000000-0000-4000-8000-00000c0d0020', '00000000-0000-4000-8000-00000000c0de', 20, 'term', 2, '{}', 'Besides', 'As well as; also.', '[Besides] football, he loves swimming.', 'إلى جانب', 'besides', '', '', '', '', '', '🧩', array['Adding ideas']::text[]),
  ('00000000-0000-4000-8000-00000c0d0021', '00000000-0000-4000-8000-00000000c0de', 21, 'term', 3, '{}', 'But', 'Shows something different or surprising.', 'I wanted to play, [but] it was raining.', 'لكن', 'but', '', '', '', '', '', '✋', array['Contrast']::text[]),
  ('00000000-0000-4000-8000-00000c0d0022', '00000000-0000-4000-8000-00000000c0de', 22, 'term', 3, '{}', 'However', 'But (often at the start of a sentence).', 'The test was hard. [However], she passed.', 'ومع ذلك', 'however', '', '', '', '', '', '🔄', array['Contrast']::text[]),
  ('00000000-0000-4000-8000-00000c0d0023', '00000000-0000-4000-8000-00000000c0de', 23, 'term', 3, '{}', 'Although', 'Even if something is true.', '[Although] it was cold, we went to the beach.', 'على الرغم من أن', 'although', '', '', '', '', '', '⚖️', array['Contrast']::text[]),
  ('00000000-0000-4000-8000-00000c0d0024', '00000000-0000-4000-8000-00000000c0de', 24, 'term', 3, '{}', 'Even though', 'Although; despite the fact that.', 'He smiled [even though] he was tired.', 'مع أن', 'even though', '', '', '', '', '', '🌧️', array['Contrast']::text[]),
  ('00000000-0000-4000-8000-00000c0d0025', '00000000-0000-4000-8000-00000000c0de', 25, 'term', 3, '{}', 'Instead', 'In place of something else.', 'We had soup [instead] of pizza.', 'بدلاً من ذلك', 'instead', '', '', '', '', '', '🔁', array['Contrast']::text[]),
  ('00000000-0000-4000-8000-00000c0d0026', '00000000-0000-4000-8000-00000000c0de', 26, 'term', 3, '{}', 'On the other hand', 'Shows another side of an idea.', 'Cats are quiet. [On the other hand], dogs love to play.', 'من ناحية أخرى', 'on the other hand', '', '', '', '', '', '🤲', array['Contrast']::text[]),
  ('00000000-0000-4000-8000-00000c0d0027', '00000000-0000-4000-8000-00000000c0de', 27, 'term', 3, '{}', 'Yet', 'But; still.', 'The puzzle was hard, [yet] she kept trying.', 'ومع ذلك / لكن', 'yet', '', '', '', '', '', '🌱', array['Contrast']::text[]),
  ('00000000-0000-4000-8000-00000c0d0028', '00000000-0000-4000-8000-00000000c0de', 28, 'term', 4, '{}', 'Because', 'Gives the reason for something.', 'I wore a coat [because] it was cold.', 'لأن', 'because', '', '', '', '', '', '💡', array['Cause & effect']::text[]),
  ('00000000-0000-4000-8000-00000c0d0029', '00000000-0000-4000-8000-00000000c0de', 29, 'term', 4, '{}', 'So', 'Shows what happens as a result.', 'It was raining, [so] we stayed inside.', 'لذلك', 'so', '', '', '', '', '', '👉', array['Cause & effect']::text[]),
  ('00000000-0000-4000-8000-00000c0d0030', '00000000-0000-4000-8000-00000000c0de', 30, 'term', 4, '{}', 'Therefore', 'For that reason.', 'He practised every day. [Therefore], he won.', 'لذلك / وبالتالي', 'therefore', '', '', '', '', '', '🧮', array['Cause & effect']::text[]),
  ('00000000-0000-4000-8000-00000c0d0031', '00000000-0000-4000-8000-00000000c0de', 31, 'term', 4, '{}', 'As a result', 'Because of what happened.', 'She forgot her map. [As a result], she got lost.', 'نتيجة لذلك', 'as a result', '', '', '', '', '', '🎯', array['Cause & effect']::text[]),
  ('00000000-0000-4000-8000-00000c0d0032', '00000000-0000-4000-8000-00000000c0de', 32, 'term', 4, '{}', 'Since', 'Because.', '[Since] it was late, we went to bed.', 'بما أن', 'since', '', '', '', '', '', '🧷', array['Cause & effect']::text[]),
  ('00000000-0000-4000-8000-00000c0d0033', '00000000-0000-4000-8000-00000000c0de', 33, 'term', 4, '{}', 'That''s why', 'This is the reason.', 'I love painting. [That''s why] I joined the art club.', 'لهذا السبب', 'that''s why', '', '', '', '', '', '❗', array['Cause & effect']::text[]),
  ('00000000-0000-4000-8000-00000c0d0034', '00000000-0000-4000-8000-00000000c0de', 34, 'term', 5, '{}', 'For example', 'Introduces an example.', 'Some animals are nocturnal, [for example] owls.', 'على سبيل المثال', 'for example', '', '', '', '', '', '🔍', array['Examples']::text[]),
  ('00000000-0000-4000-8000-00000c0d0035', '00000000-0000-4000-8000-00000000c0de', 35, 'term', 5, '{}', 'Such as', 'Like; for example.', 'I enjoy fruits [such as] mangoes and grapes.', 'مثل', 'such as', '', '', '', '', '', '📋', array['Examples']::text[]),
  ('00000000-0000-4000-8000-00000c0d0036', '00000000-0000-4000-8000-00000000c0de', 36, 'term', 5, '{}', 'For instance', 'For example.', 'Many birds can talk, [for instance] parrots.', 'على سبيل المثال', 'for instance', '', '', '', '', '', '🦜', array['Examples']::text[]),
  ('00000000-0000-4000-8000-00000c0d0037', '00000000-0000-4000-8000-00000000c0de', 37, 'term', 6, '{}', 'Finally', 'Last of all.', '[Finally], we reached the top of the mountain.', 'أخيراً', 'finally', '', '', '', '', '', '🏁', array['Endings']::text[]),
  ('00000000-0000-4000-8000-00000c0d0038', '00000000-0000-4000-8000-00000000c0de', 38, 'term', 6, '{}', 'In the end', 'At the very end of the story.', '[In the end], everyone became friends.', 'في النهاية', 'in the end', '', '', '', '', '', '🎬', array['Endings']::text[]),
  ('00000000-0000-4000-8000-00000c0d0039', '00000000-0000-4000-8000-00000000c0de', 39, 'term', 6, '{}', 'At last', 'Finally, after waiting a long time.', '[At last], the rain stopped.', 'أخيراً', 'at last', '', '', '', '', '', '🎉', array['Endings']::text[]),
  ('00000000-0000-4000-8000-00000c0d0040', '00000000-0000-4000-8000-00000000c0de', 40, 'term', 6, '{}', 'From that day on', 'Starting from that day and always after.', '[From that day on], the fox never felt alone.', 'منذ ذلك اليوم', 'from that day on', '', '', '', '', '', '🌅', array['Endings']::text[]),
  ('00000000-0000-4000-8000-00000c0d0041', '00000000-0000-4000-8000-00000000c0de', 41, 'term', 6, '{}', 'Happily ever after', 'Happy for the rest of their lives (a fairy-tale ending).', 'And they all lived [happily ever after].', 'بسعادة إلى الأبد', 'happily ever after', '', '', '', '', '', '🌈', array['Endings']::text[])
on conflict (id) do update set position = excluded.position, unit = excluded.unit, term = excluded.term, meaning = excluded.meaning,
  example = excluded.example, translation = excluded.translation, syllables = excluded.syllables, emoji = excluded.emoji, tags = excluded.tags;

update public.study_sets s set term_count = (select count(*) from public.set_items i where i.set_id = s.id and i.kind = 'term')
where s.id = '00000000-0000-4000-8000-00000000c0de';

-- Feelings is a word box too
update public.study_sets set story_box = 'words' where id = '00000000-0000-4000-8000-00000000fee1';

select title, story_box, term_count, visibility from public.study_sets where story_box is not null order by title;
