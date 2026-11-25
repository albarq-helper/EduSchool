-- =====================================================================
-- Helper Academy — v67: ≠ fixes and 8 meters from the difference groups. Built by tools/words/build_v67.py. Safe to re-run. Run AFTER v66.
-- =====================================================================
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Care (looking after)', '', 'Looking after someone''s needs: food, clothes, health, safety.', '', 'الرعاية', '', '', '🍲', '', '', array['≠ Care ≠ Upbringing']::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')
where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = lower('Care (looking after)'));
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('diff-word:' || w.id)::uuid, '00000000-0000-4000-8000-00000000d1ff', 500, 'term', 3, '{}', w.id from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Care (looking after)') order by (sense = '') desc limit 1)
and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000d1ff' and e.word_id = w.id) on conflict (id) do nothing;
update public.words set tags = array_remove(tags, '≠ Care ≠ Upbringing') where '≠ Care ≠ Upbringing' = any(tags);
update public.words set tags = (select array(select distinct x from unnest(tags || array['≠ Care ≠ Upbringing']) x order by x)) where id = (select id from public.words where lang = 'en' and lower(headword) = lower('Care (looking after)') order by (sense = '') desc limit 1);
update public.words set tags = (select array(select distinct x from unnest(tags || array['≠ Care ≠ Upbringing']) x order by x)) where id = (select id from public.words where lang = 'en' and lower(headword) = lower('Upbringing') order by (sense = '') desc limit 1);
delete from public.word_difference_parts where diff_key = 'care-upbringing' and word_id = (select id from public.words where lang = 'en' and lower(headword) = lower('Care') order by (sense = '') desc limit 1);
insert into public.word_difference_parts (diff_key, word_id, explain, explain_ar, position) select 'care-upbringing', (select id from public.words where lang = 'en' and lower(headword) = lower('Care (looking after)') order by (sense = '') desc limit 1), 'Looking after someone''s needs: food, clothes, health, safety.', 'الرعاية', 0
on conflict (diff_key, word_id) do update set explain = excluded.explain, explain_ar = excluded.explain_ar, position = excluded.position;
update public.word_differences set title = 'Care (looking after) ≠ Upbringing' where key = 'care-upbringing';
update public.words set tags = array_remove(tags, '≠ Care ≠ Upbringing') where '≠ Care ≠ Upbringing' = any(tags);
update public.words set tags = (select array(select distinct x from unnest(tags || array['≠ Care (looking after) ≠ Upbringing']) x order by x)) where id = (select id from public.words where lang = 'en' and lower(headword) = lower('Care (looking after)') order by (sense = '') desc limit 1);
update public.words set tags = (select array(select distinct x from unnest(tags || array['≠ Care (looking after) ≠ Upbringing']) x order by x)) where id = (select id from public.words where lang = 'en' and lower(headword) = lower('Upbringing') order by (sense = '') desc limit 1);
delete from public.set_entries where set_id = '00000000-0000-4000-8000-00000000d1ff' and word_id = (select id from public.words where lang = 'en' and lower(headword) = lower('Care') order by (sense = '') desc limit 1);
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Affectionate behaviour', '', 'Warm, kind actions towards someone: love shown in what you do, even on days the feeling is weak.', '', 'المودّة', '', '', '🤗', '', '', array[]::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')
where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = lower('Affectionate behaviour'));
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('diff-word:' || w.id)::uuid, '00000000-0000-4000-8000-00000000d1ff', 500, 'term', 1, '{}', w.id from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Affectionate behaviour') order by (sense = '') desc limit 1)
and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000d1ff' and e.word_id = w.id) on conflict (id) do nothing;
update public.words set tags = array_remove(tags, '≠ Love ≠ Affection') where '≠ Love ≠ Affection' = any(tags);
delete from public.word_difference_parts where diff_key = 'love-affection' and word_id = (select id from public.words where lang = 'en' and lower(headword) = lower('Affection') order by (sense = '') desc limit 1);
insert into public.word_difference_parts (diff_key, word_id, explain, explain_ar, position) select 'love-affection', (select id from public.words where lang = 'en' and lower(headword) = lower('Affectionate behaviour') order by (sense = '') desc limit 1), 'Warm, kind actions towards someone: love shown in what you do.', 'المودّة', 1
on conflict (diff_key, word_id) do update set explain = excluded.explain, explain_ar = excluded.explain_ar, position = excluded.position;
update public.word_differences set title = 'Love ≠ Affectionate behaviour', summary = 'Love is a feeling; affectionate behaviour (مودّة) is what you do: kind, warm actions. Good people stay kind even when the feeling fades.' where key = 'love-affection';
update public.words set tags = (select array(select distinct x from unnest(tags || array['≠ Love ≠ Affectionate behaviour']) x order by x)) where id = (select id from public.words where lang = 'en' and lower(headword) = lower('Love') order by (sense = '') desc limit 1);
update public.words set tags = (select array(select distinct x from unnest(tags || array['≠ Love ≠ Affectionate behaviour']) x order by x)) where id = (select id from public.words where lang = 'en' and lower(headword) = lower('Affectionate behaviour') order by (sense = '') desc limit 1);
delete from public.set_entries where set_id = '00000000-0000-4000-8000-00000000d1ff' and word_id = (select id from public.words where lang = 'en' and lower(headword) = lower('Affection') order by (sense = '') desc limit 1);
update public.words set tags = array_remove(tags, '≠ A low mood ≠ Depression ≠ A complaining habit') where '≠ A low mood ≠ Depression ≠ A complaining habit' = any(tags);
delete from public.word_difference_parts where diff_key = 'mood-depression-complaining' and word_id = (select id from public.words where lang = 'en' and lower(headword) = lower('Complainer') order by (sense = '') desc limit 1);
update public.word_differences set title = 'Low mood ≠ Depression', summary = 'A low mood passes in hours or days; depression is a medical condition (low mood and lost interest most days for at least two weeks) that doctors can help with.', summary_ar = 'هناك فرق بين حالة مزاجية عابرة وبين الاكتئاب، فالاكتئاب حالة طبية تستمر أسابيع ويساعد فيها الأطباء.' where key = 'mood-depression-complaining';
update public.words set tags = (select array(select distinct x from unnest(tags || array['≠ Low mood ≠ Depression']) x order by x)) where id = (select id from public.words where lang = 'en' and lower(headword) = lower('Low mood') order by (sense = '') desc limit 1);
update public.words set tags = (select array(select distinct x from unnest(tags || array['≠ Low mood ≠ Depression']) x order by x)) where id = (select id from public.words where lang = 'en' and lower(headword) = lower('Depression') order by (sense = '') desc limit 1);
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Hardship', '', 'A really difficult time in life, like illness, losing a job or losing someone.', '', 'ظروف صعبة', '', '', '⛈️', '', '', array[]::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')
where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = lower('Hardship'));
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('diff-word:' || w.id)::uuid, '00000000-0000-4000-8000-00000000d1ff', 500, 'term', 1, '{}', w.id from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Hardship') order by (sense = '') desc limit 1)
and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000d1ff' and e.word_id = w.id) on conflict (id) do nothing;
insert into public.word_differences (key, title, unit, min_age, summary, summary_ar, example, note, position) values ('hardship-complaining', 'Hardship ≠ Complaining habit', 1, 10,
 'Someone going through hardship is reacting to real trouble; a complainer complains about everything, whatever happens. The little complainer grows into a big one: first about waking up early and homework, later about bills and children.',
 'هناك فرق بين شخص يمر بظروف صعبة وبين شخص دومًا متحلطم؛ المتحلطم الصغير يصبح متحلطمًا كبيرًا ثم عجوزًا: أول الأمر على الصحيان المبكر والواجبات، ثم على المصاريف وهموم الأولاد.',
 'Losing a pet is hardship; moaning about every meal is a complaining habit.', null, 37)
on conflict (key) do update set title = excluded.title, summary = excluded.summary, summary_ar = excluded.summary_ar, example = excluded.example;
insert into public.word_difference_parts (diff_key, word_id, explain, explain_ar, position) select 'hardship-complaining', (select id from public.words where lang = 'en' and lower(headword) = lower('Hardship') order by (sense = '') desc limit 1), 'A really difficult time caused by real trouble.', 'ظروف صعبة', 0
on conflict (diff_key, word_id) do update set explain = excluded.explain, explain_ar = excluded.explain_ar;
update public.words set tags = (select array(select distinct x from unnest(tags || array['≠ Hardship ≠ Complaining habit']) x order by x)) where id = (select id from public.words where lang = 'en' and lower(headword) = lower('Hardship') order by (sense = '') desc limit 1);
insert into public.word_difference_parts (diff_key, word_id, explain, explain_ar, position) select 'hardship-complaining', (select id from public.words where lang = 'en' and lower(headword) = lower('Complainer') order by (sense = '') desc limit 1), 'Someone who always complains, whatever happens.', 'المتحلطم', 1
on conflict (diff_key, word_id) do update set explain = excluded.explain, explain_ar = excluded.explain_ar;
update public.words set tags = (select array(select distinct x from unnest(tags || array['≠ Hardship ≠ Complaining habit']) x order by x)) where id = (select id from public.words where lang = 'en' and lower(headword) = lower('Complainer') order by (sense = '') desc limit 1);
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('diff-word:' || w.id)::uuid, '00000000-0000-4000-8000-00000000d1ff', 500, 'term', 2, '{}', w.id from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Pardon') order by (sense = '') desc limit 1)
and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000d1ff' and e.word_id = w.id) on conflict (id) do nothing;
update public.words set tags = (select array(select distinct x from unnest(tags || array['📶 Pardon → Absolve: 1']) x order by x)) where id = (select id from public.words where lang = 'en' and lower(headword) = lower('Pardon') order by (sense = '') desc limit 1);
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('diff-word:' || w.id)::uuid, '00000000-0000-4000-8000-00000000d1ff', 500, 'term', 2, '{}', w.id from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Forgive') order by (sense = '') desc limit 1)
and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000d1ff' and e.word_id = w.id) on conflict (id) do nothing;
update public.words set tags = (select array(select distinct x from unnest(tags || array['📶 Pardon → Absolve: 2']) x order by x)) where id = (select id from public.words where lang = 'en' and lower(headword) = lower('Forgive') order by (sense = '') desc limit 1);
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('diff-word:' || w.id)::uuid, '00000000-0000-4000-8000-00000000d1ff', 500, 'term', 2, '{}', w.id from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Overlook') order by (sense = '') desc limit 1)
and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000d1ff' and e.word_id = w.id) on conflict (id) do nothing;
update public.words set tags = (select array(select distinct x from unnest(tags || array['📶 Pardon → Absolve: 3']) x order by x)) where id = (select id from public.words where lang = 'en' and lower(headword) = lower('Overlook') order by (sense = '') desc limit 1);
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('diff-word:' || w.id)::uuid, '00000000-0000-4000-8000-00000000d1ff', 500, 'term', 2, '{}', w.id from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Absolve') order by (sense = '') desc limit 1)
and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000d1ff' and e.word_id = w.id) on conflict (id) do nothing;
update public.words set tags = (select array(select distinct x from unnest(tags || array['📶 Pardon → Absolve: 4']) x order by x)) where id = (select id from public.words where lang = 'en' and lower(headword) = lower('Absolve') order by (sense = '') desc limit 1);
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Gullible', '', 'Believes and trusts people too easily, so they can be tricked.', '', 'ساذج، سريع التصديق', '', '', '🐑', '', '', array[]::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')
where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = lower('Gullible'));
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('diff-word:' || w.id)::uuid, '00000000-0000-4000-8000-00000000d1ff', 500, 'term', 2, '{}', w.id from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Gullible') order by (sense = '') desc limit 1)
and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000d1ff' and e.word_id = w.id) on conflict (id) do nothing;
update public.words set tags = (select array(select distinct x from unnest(tags || array['📶 Gullible ⇄ Distrustful: -2']) x order by x)) where id = (select id from public.words where lang = 'en' and lower(headword) = lower('Gullible') order by (sense = '') desc limit 1);
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Cautious', '', 'Careful: waits and sees before trusting or acting.', '', 'حذِر', '', '', '🛑', '', '', array[]::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')
where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = lower('Cautious'));
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('diff-word:' || w.id)::uuid, '00000000-0000-4000-8000-00000000d1ff', 500, 'term', 2, '{}', w.id from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Cautious') order by (sense = '') desc limit 1)
and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000d1ff' and e.word_id = w.id) on conflict (id) do nothing;
update public.words set tags = (select array(select distinct x from unnest(tags || array['📶 Gullible ⇄ Distrustful: 0']) x order by x)) where id = (select id from public.words where lang = 'en' and lower(headword) = lower('Cautious') order by (sense = '') desc limit 1);
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Suspicious', '', 'Thinks someone may be doing something wrong, often without proof.', '', 'مرتاب، شكّاك', '', '', '🕵️', '', '', array[]::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')
where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = lower('Suspicious'));
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('diff-word:' || w.id)::uuid, '00000000-0000-4000-8000-00000000d1ff', 500, 'term', 2, '{}', w.id from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Suspicious') order by (sense = '') desc limit 1)
and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000d1ff' and e.word_id = w.id) on conflict (id) do nothing;
update public.words set tags = (select array(select distinct x from unnest(tags || array['📶 Gullible ⇄ Distrustful: +2']) x order by x)) where id = (select id from public.words where lang = 'en' and lower(headword) = lower('Suspicious') order by (sense = '') desc limit 1);
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Distrustful', '', 'Doesn''t trust anyone, even people who have done nothing wrong.', '', 'عديم الثقة بالآخرين', '', '', '🔒', '', '', array[]::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')
where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = lower('Distrustful'));
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('diff-word:' || w.id)::uuid, '00000000-0000-4000-8000-00000000d1ff', 500, 'term', 2, '{}', w.id from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Distrustful') order by (sense = '') desc limit 1)
and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000d1ff' and e.word_id = w.id) on conflict (id) do nothing;
update public.words set tags = (select array(select distinct x from unnest(tags || array['📶 Gullible ⇄ Distrustful: +3']) x order by x)) where id = (select id from public.words where lang = 'en' and lower(headword) = lower('Distrustful') order by (sense = '') desc limit 1);
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Passive', '', 'Lets others decide and push them around; doesn''t speak up.', '', 'سلبي، خانع', '', '', '🫥', '', '', array[]::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')
where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = lower('Passive'));
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('diff-word:' || w.id)::uuid, '00000000-0000-4000-8000-00000000d1ff', 500, 'term', 3, '{}', w.id from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Passive') order by (sense = '') desc limit 1)
and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000d1ff' and e.word_id = w.id) on conflict (id) do nothing;
update public.words set tags = (select array(select distinct x from unnest(tags || array['📶 Passive ⇄ Rude: -2']) x order by x)) where id = (select id from public.words where lang = 'en' and lower(headword) = lower('Passive') order by (sense = '') desc limit 1);
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('diff-word:' || w.id)::uuid, '00000000-0000-4000-8000-00000000d1ff', 500, 'term', 2, '{}', w.id from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Firm') order by (sense = '') desc limit 1)
and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000d1ff' and e.word_id = w.id) on conflict (id) do nothing;
update public.words set tags = (select array(select distinct x from unnest(tags || array['📶 Passive ⇄ Rude: 0']) x order by x)) where id = (select id from public.words where lang = 'en' and lower(headword) = lower('Firm') order by (sense = '') desc limit 1);
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('diff-word:' || w.id)::uuid, '00000000-0000-4000-8000-00000000d1ff', 500, 'term', 2, '{}', w.id from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Rude') order by (sense = '') desc limit 1)
and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000d1ff' and e.word_id = w.id) on conflict (id) do nothing;
update public.words set tags = (select array(select distinct x from unnest(tags || array['📶 Passive ⇄ Rude: +2']) x order by x)) where id = (select id from public.words where lang = 'en' and lower(headword) = lower('Rude') order by (sense = '') desc limit 1);
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Resisting', '', 'Fighting against what has already happened instead of dealing with it.', '', 'مقاومة الواقع (عدم القبول)', '', '', '🏊', '', '', array[]::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')
where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = lower('Resisting'));
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('diff-word:' || w.id)::uuid, '00000000-0000-4000-8000-00000000d1ff', 500, 'term', 1, '{}', w.id from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Resisting') order by (sense = '') desc limit 1)
and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000d1ff' and e.word_id = w.id) on conflict (id) do nothing;
update public.words set tags = (select array(select distinct x from unnest(tags || array['📶 Resisting ⇄ Indifferent: -2']) x order by x)) where id = (select id from public.words where lang = 'en' and lower(headword) = lower('Resisting') order by (sense = '') desc limit 1);
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('diff-word:' || w.id)::uuid, '00000000-0000-4000-8000-00000000d1ff', 500, 'term', 2, '{}', w.id from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Acceptance') order by (sense = '') desc limit 1)
and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000d1ff' and e.word_id = w.id) on conflict (id) do nothing;
update public.words set tags = (select array(select distinct x from unnest(tags || array['📶 Resisting ⇄ Indifferent: 0']) x order by x)) where id = (select id from public.words where lang = 'en' and lower(headword) = lower('Acceptance') order by (sense = '') desc limit 1);
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('diff-word:' || w.id)::uuid, '00000000-0000-4000-8000-00000000d1ff', 500, 'term', 2, '{}', w.id from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Indifference') order by (sense = '') desc limit 1)
and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000d1ff' and e.word_id = w.id) on conflict (id) do nothing;
update public.words set tags = (select array(select distinct x from unnest(tags || array['📶 Resisting ⇄ Indifferent: +2']) x order by x)) where id = (select id from public.words where lang = 'en' and lower(headword) = lower('Indifference') order by (sense = '') desc limit 1);
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Hands-off', '', 'Leaving people completely alone, without any guidance.', '', 'ترك الحبل على الغارب', '', '', '🙌', '', '', array[]::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')
where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = lower('Hands-off'));
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('diff-word:' || w.id)::uuid, '00000000-0000-4000-8000-00000000d1ff', 500, 'term', 3, '{}', w.id from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Hands-off') order by (sense = '') desc limit 1)
and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000d1ff' and e.word_id = w.id) on conflict (id) do nothing;
update public.words set tags = (select array(select distinct x from unnest(tags || array['📶 Hands-off ⇄ Controlling: -2']) x order by x)) where id = (select id from public.words where lang = 'en' and lower(headword) = lower('Hands-off') order by (sense = '') desc limit 1);
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('diff-word:' || w.id)::uuid, '00000000-0000-4000-8000-00000000d1ff', 500, 'term', 2, '{}', w.id from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Leadership') order by (sense = '') desc limit 1)
and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000d1ff' and e.word_id = w.id) on conflict (id) do nothing;
update public.words set tags = (select array(select distinct x from unnest(tags || array['📶 Hands-off ⇄ Controlling: 0']) x order by x)) where id = (select id from public.words where lang = 'en' and lower(headword) = lower('Leadership') order by (sense = '') desc limit 1);
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('diff-word:' || w.id)::uuid, '00000000-0000-4000-8000-00000000d1ff', 500, 'term', 2, '{}', w.id from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Control') order by (sense = '') desc limit 1)
and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000d1ff' and e.word_id = w.id) on conflict (id) do nothing;
update public.words set tags = (select array(select distinct x from unnest(tags || array['📶 Hands-off ⇄ Controlling: +2']) x order by x)) where id = (select id from public.words where lang = 'en' and lower(headword) = lower('Control') order by (sense = '') desc limit 1);
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('diff-word:' || w.id)::uuid, '00000000-0000-4000-8000-00000000d1ff', 500, 'term', 2, '{}', w.id from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Low mood') order by (sense = '') desc limit 1)
and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000d1ff' and e.word_id = w.id) on conflict (id) do nothing;
update public.words set tags = (select array(select distinct x from unnest(tags || array['📶 Low mood → Depression: 1']) x order by x)) where id = (select id from public.words where lang = 'en' and lower(headword) = lower('Low mood') order by (sense = '') desc limit 1);
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Sad', '', 'Feeling unhappy.', '', 'حزين', '', '', '😢', '', '', array[]::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')
where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = lower('Sad'));
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('diff-word:' || w.id)::uuid, '00000000-0000-4000-8000-00000000d1ff', 500, 'term', 1, '{}', w.id from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Sad') order by (sense = '') desc limit 1)
and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000d1ff' and e.word_id = w.id) on conflict (id) do nothing;
update public.words set tags = (select array(select distinct x from unnest(tags || array['📶 Low mood → Depression: 2']) x order by x)) where id = (select id from public.words where lang = 'en' and lower(headword) = lower('Sad') order by (sense = '') desc limit 1);
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('diff-word:' || w.id)::uuid, '00000000-0000-4000-8000-00000000d1ff', 500, 'term', 2, '{}', w.id from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Depression') order by (sense = '') desc limit 1)
and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000d1ff' and e.word_id = w.id) on conflict (id) do nothing;
update public.words set tags = (select array(select distinct x from unnest(tags || array['📶 Low mood → Depression: 4']) x order by x)) where id = (select id from public.words where lang = 'en' and lower(headword) = lower('Depression') order by (sense = '') desc limit 1);
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('diff-word:' || w.id)::uuid, '00000000-0000-4000-8000-00000000d1ff', 500, 'term', 2, '{}', w.id from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Knowledge') order by (sense = '') desc limit 1)
and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000d1ff' and e.word_id = w.id) on conflict (id) do nothing;
update public.words set tags = (select array(select distinct x from unnest(tags || array['📶 Knowledge → Wisdom: 1']) x order by x)) where id = (select id from public.words where lang = 'en' and lower(headword) = lower('Knowledge') order by (sense = '') desc limit 1);
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('diff-word:' || w.id)::uuid, '00000000-0000-4000-8000-00000000d1ff', 500, 'term', 2, '{}', w.id from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Awareness') order by (sense = '') desc limit 1)
and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000d1ff' and e.word_id = w.id) on conflict (id) do nothing;
update public.words set tags = (select array(select distinct x from unnest(tags || array['📶 Knowledge → Wisdom: 2']) x order by x)) where id = (select id from public.words where lang = 'en' and lower(headword) = lower('Awareness') order by (sense = '') desc limit 1);
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('diff-word:' || w.id)::uuid, '00000000-0000-4000-8000-00000000d1ff', 500, 'term', 2, '{}', w.id from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Wisdom') order by (sense = '') desc limit 1)
and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000d1ff' and e.word_id = w.id) on conflict (id) do nothing;
update public.words set tags = (select array(select distinct x from unnest(tags || array['📶 Knowledge → Wisdom: 3']) x order by x)) where id = (select id from public.words where lang = 'en' and lower(headword) = lower('Wisdom') order by (sense = '') desc limit 1);
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', 'Doubtful', '', 'Not sure whether something is true.', '', 'متشكّك، غير متأكد', '', '', '🤔', '', '', array[]::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')
where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = lower('Doubtful'));
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('diff-word:' || w.id)::uuid, '00000000-0000-4000-8000-00000000d1ff', 500, 'term', 2, '{}', w.id from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Doubtful') order by (sense = '') desc limit 1)
and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000d1ff' and e.word_id = w.id) on conflict (id) do nothing;
update public.words set tags = (select array(select distinct x from unnest(tags || array['📶 Doubtful → Convinced: 1']) x order by x)) where id = (select id from public.words where lang = 'en' and lower(headword) = lower('Doubtful') order by (sense = '') desc limit 1);
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('diff-word:' || w.id)::uuid, '00000000-0000-4000-8000-00000000d1ff', 500, 'term', 2, '{}', w.id from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Believe') order by (sense = '') desc limit 1)
and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000d1ff' and e.word_id = w.id) on conflict (id) do nothing;
update public.words set tags = (select array(select distinct x from unnest(tags || array['📶 Doubtful → Convinced: 2']) x order by x)) where id = (select id from public.words where lang = 'en' and lower(headword) = lower('Believe') order by (sense = '') desc limit 1);
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('diff-word:' || w.id)::uuid, '00000000-0000-4000-8000-00000000d1ff', 500, 'term', 2, '{}', w.id from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower('Convinced') order by (sense = '') desc limit 1)
and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000d1ff' and e.word_id = w.id) on conflict (id) do nothing;
update public.words set tags = (select array(select distinct x from unnest(tags || array['📶 Doubtful → Convinced: 3']) x order by x)) where id = (select id from public.words where lang = 'en' and lower(headword) = lower('Convinced') order by (sense = '') desc limit 1);
select (select count(*) from public.word_differences) as differences, (select count(*) from public.words where exists (select 1 from unnest(tags) t where t like any (array['📶 Pardon → Absolve:%','📶 Gullible ⇄ Distrustful:%','📶 Passive ⇄ Rude:%','📶 Resisting ⇄ Indifferent:%','📶 Hands-off ⇄ Controlling:%','📶 Low mood → Depression:%','📶 Knowledge → Wisdom:%','📶 Doubtful → Convinced:%']))) as meter_words, (select count(*) from public.set_entries where set_id = '00000000-0000-4000-8000-00000000d1ff') as set_words;
