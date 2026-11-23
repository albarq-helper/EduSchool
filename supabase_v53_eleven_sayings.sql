-- =====================================================================
-- Helper Academy — v53: 11 sayings: Zola, Lincoln (disputed), Ali ibn Abi Talib, Zuhayr, Antara, Arabic and English proverbs
--   with meaning, Arabic, and who said it (checked sources in the note; the Churchill line is a later paraphrase)
-- Safe to re-run. Run AFTER v52.
-- =====================================================================
create temp table nq(k int, h text, m text, t text, who text, work text, role text, status text, src text, note text, tags text[], u int);
insert into nq values
 (2012, 'If you shut up truth and bury it under the ground, it will grow and spring up.', 'The truth can be hidden for a while, but it always comes out in the end.', 'إن أخرست الحقيقة ودفنتها تحت الأرض فسوف تنمو وتنبت.', 'Émile Zola', 'J''accuse (1898)', 'said', 'unchecked', 'https://www.gutenberg.org/ebooks/76045', 'From his open letter J''accuse (1898) about the Dreyfus affair: "Quand on enferme la vérité sous terre, elle s''y amasse…". The Arabic is a short version.', array['Saying','≈ Honest','⇄ Honest vs. lying: honest'], 8),
 (2013, 'You can fool all the people some of the time, and some of the people all the time, but you cannot fool all the people all the time.', 'Lies may work for a while or with a few people, but sooner or later the truth is found out.', 'يمكن أن تخدع كل الناس بعض الوقت، وبعض الناس كل الوقت، لكنك لن تستطيع خداع كل الناس كل الوقت.', 'Abraham Lincoln', '', 'attributed', 'disputed', 'https://quoteinvestigator.com/2013/12/11/cannot-fool/', 'No record of Lincoln saying it; first credited to him in 1885, twenty years after his death. A similar idea appears in a French book by Jacques Abbadie (1684).', array['Saying','≈ Honest','⇄ Honest vs. lying: honest'], 8),
 (2014, 'People do not fall into tragedy because of their faults, but because of their virtues.', 'Sometimes our good qualities, like trusting or giving too much, lead us into trouble, so be good and also wise.', 'لا يتورّط الناس في المأساة بسبب عيوبهم، وإنما بسبب فضائلهم.', 'Unknown', '', 'said', 'unchecked', '', 'Shared in Arabic without a name.', array['Saying','≈ Learning','⇄ Wise vs. ignorant: wise'], 18),
 (2015, 'Sometimes a fool wants to help you, and harms you instead.', 'Good intentions are not enough; help from someone who doesn''t think can cause harm, so choose your friends wisely.', 'ربما أراد الأحمق نفعك فضرّك.', 'Ali ibn Abi Talib', 'Nahj al-Balagha', 'attributed', 'unchecked', '', 'Close to his advice in Nahj al-Balagha: "إياك ومصادقة الأحمق فإنه يريد أن ينفعك فيضرك" (beware of befriending a fool, for he wants to help you and harms you).', array['Saying','≈ Friend','⇄ Wise vs. ignorant: wise'], 6),
 (2016, 'Give a fool enough rope and he will hang himself.', 'If you let a foolish person carry on, their own mistakes will catch up with them.', 'أعطِ الأحمق حبلاً وسيشنق نفسه.', 'English proverb', '', 'proverb', 'verified', '', 'An old English proverb (17th century). The image is harsh, so it is 13+.', array['Saying','⇄ Wise vs. ignorant: wise'], 18),
 (2017, 'Whoever does favours for those who do not deserve them, his praise turns into blame, and he regrets it.', 'Be kind, but think about who you trust; some people repay kindness badly.', 'ومن يجعل المعروف في غير أهله يكن حمده ذمّاً عليه ويندم.', 'Zuhayr ibn Abi Sulma', 'Mu''allaqa', 'said', 'verified', '', 'A line from his Mu''allaqa, one of the famous pre-Islamic hanging poems.', array['Saying','≈ Kindness','⇄ Wise vs. ignorant: wise'], 1),
 (2018, 'Whoever guards his honour with good deeds keeps it safe, and whoever does not avoid insults will be insulted.', 'Kind deeds protect your good name; careless words and actions bring insults back to you.', 'ومن يجعل المعروف من دون عرضه يفِرْه، ومن لا يتّقِ الشتم يُشتَم.', 'Zuhayr ibn Abi Sulma', 'Mu''allaqa', 'said', 'verified', '', 'A line from his Mu''allaqa.', array['Saying','≈ Humble','⇄ Polite vs. rude: polite'], 17),
 (2019, 'Whoever spends without counting is ruined without knowing it.', 'Plan and count your money; careless spending leads to trouble you don''t see coming.', 'من أنفق ولم يحسب هلك ولم يدرِ.', 'Arabic proverb', '', 'proverb', 'unchecked', '', '', array['Saying','≈ Learning','⇄ Wise vs. ignorant: wise'], 18),
 (2020, 'Whoever has a blessing and is not thankful for it leaves it without noticing.', 'Be thankful for what you have; people who never say thank you often lose good things without realising.', 'من كان في نعمة ولم يشكر، خرج منها ولم يشعر.', 'Arabic proverb', '', 'proverb', 'unchecked', '', '', array['Saying','≈ Grateful','⇄ Grateful vs. ungrateful: grateful'], 13),
 (2021, 'Whoever does favours for the wrong people will meet what the man who sheltered Umm Amer met.', 'Some people repay kindness with harm; be kind, but be careful whom you help.', 'ومن يصنع المعروف في غير أهله يلاقِ الذي لاقى مُجيرُ أمِّ عامرِ.', 'Arabic proverb', '', 'proverb', 'unchecked', '', 'An old Arabic verse. Umm Amer is the hyena: in the story a man sheltered a hungry hyena, and it attacked him while he slept.', array['Saying','≈ Kindness','⇄ Wise vs. ignorant: wise'], 1),
 (2022, 'Those whom high rank lifts do not carry hatred, and no one whose nature is anger reaches greatness.', 'Great people don''t hold grudges, and people who are always angry never reach the top.', 'لا يحمل الحقدَ من تعلو به الرُّتَبُ، ولا ينال العُلا من طبعُه الغضبُ.', 'Antara ibn Shaddad', '', 'attributed', 'unchecked', '', 'Widely quoted as a verse by Antara, the pre-Islamic poet and knight.', array['Saying','≈ Calm','⇄ Calm vs. angry: calm','⇄ Kind vs. unkind: kind'], 15);

insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', h, '', m, '', t, '', '', '💬', '', case when who = 'Unknown' then '' else who || case when work <> '' then ' · ' || work else '' end end, tags,
       (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')
from nq on conflict (lang, lower(headword), sense) do nothing;
update public.words w set meaning = nq.m, translation = nq.t, author = case when nq.who = 'Unknown' then '' else nq.who || case when nq.work <> '' then ' · ' || nq.work else '' end end,
       tags = (select array(select distinct x from unnest(w.tags || nq.tags) x order by x))
  from nq where w.lang = 'en' and w.sense = '' and lower(w.headword) = lower(nq.h);

insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select ('00000000-0000-4000-8000-' || lpad(to_hex(nq.k), 8, '0') || '9007')::uuid, '00000000-0000-4000-8000-000000009007', nq.k, 'term', nq.u, '{}', w.id
from nq join public.words w on w.lang = 'en' and w.sense = '' and lower(w.headword) = lower(nq.h)
on conflict (id) do nothing;

-- who said it
insert into public.people (name, kind) select distinct who, case when who = 'Unknown' then 'unknown' when who ilike '%proverb%' then 'proverb' else 'person' end from nq on conflict do nothing;
update public.people set born = '1840', died = '1902', nationality = 'France', known_for = 'Novelist; wrote J''accuse (1898) in the Dreyfus affair', emoji = '✒️' where name = 'Émile Zola' and born = '';
update public.people set born = '1809', died = '1865', nationality = 'United States', known_for = '16th President; ended slavery in the US', emoji = '🎩' where name = 'Abraham Lincoln' and born = '';
update public.people set born = 'about 600', died = '661', nationality = 'Arabia', known_for = 'Fourth caliph; his sayings are collected in Nahj al-Balagha', emoji = '📜' where name = 'Ali ibn Abi Talib' and born = '';
update public.people set born = 'about 520', died = 'about 609', nationality = 'Arabia', known_for = 'Pre-Islamic poet, author of a Mu''allaqa', emoji = '📜' where name = 'Zuhayr ibn Abi Sulma' and born = '';
update public.people set born = '6th century', died = '', nationality = 'Arabia', known_for = 'Pre-Islamic poet and knight', emoji = '⚔️' where name = 'Antara ibn Shaddad' and born = '';
delete from public.quote_people l using nq, public.words w where w.lang = 'en' and lower(w.headword) = lower(nq.h) and l.word_id = w.id;
insert into public.quote_people (word_id, person_id, role, status, work, source_url, note, checked_at)
select w.id, p.id, nq.role, nq.status, nq.work, nq.src, nq.note, case when nq.status = 'unchecked' then null else now() end
from nq join public.words w on w.lang = 'en' and w.sense = '' and lower(w.headword) = lower(nq.h)
        join public.people p on lower(btrim(p.name)) = lower(nq.who)
on conflict do nothing;
update public.set_entries e set min_age = 13 from public.words w where e.word_id = w.id and e.set_id = '00000000-0000-4000-8000-000000009007' and w.headword = 'Give a fool enough rope and he will hang himself.';
drop table nq;

select (select count(*) from public.set_entries where set_id = '00000000-0000-4000-8000-000000009007') as quotes,
       (select count(*) from public.set_entries where set_id = '00000000-0000-4000-8000-000000009007' and position between 2012 and 2022) as new_quotes,
       (select count(*) from public.quote_people l join public.words w on w.id = l.word_id where w.headword like 'Give a fool%' or w.headword like 'Those whom high rank%') as linked;
