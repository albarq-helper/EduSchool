-- =====================================================================
-- Helper Academy — v72: 💬 sayings on wisdom, loyalty and pain
--   * the better of two bad choices (credited to Amr ibn al-As; also to Umar ibn al-Khattab)
--   * "sometimes" sayings: in the family / in power / in relationships
--   * loyalty behind the back (attributed to Ali ibn Abi Talib, in Ibn Abd al-Barr's Bahjat al-Majalis) and the anecdote on forbearance and meanness
--   * pain: Gabor Maté on trauma; "pain that doesn't turn into awareness"; Imad Rashad Othman: pain that doesn't become a story becomes an identity
--   linked as advice to signs, conditions, roots and traits. Run AFTER v71. Safe to re-run.
-- =====================================================================
create temp table nq(k int, h text, m text, t text, who text, work text, role text, status text, src text, note text, tags text[], u int);
insert into nq values
 (2028, 'A wise person is not the one who can tell good from bad, but the one who can tell the better of two bad choices.',
  'Telling good from bad is easy. Real wisdom is when every choice has a cost and you pick the smaller harm. It never means choosing something wrong when a good choice exists.',
  'ليس العاقلُ مَن عرف الخيرَ من الشرّ، ولكنّ العاقلَ مَن عرف خيرَ الشرَّين.', 'Amr ibn al-As', 'in Ibn Abi al-Dunya, al-Ishraf fi Manazil al-Ashraf', 'attributed', 'unchecked', '',
  'Usually credited to Amr ibn al-As (d. 664), famous among the Arabs for his shrewdness. Al-Aqqad, in ''Abqariyyat ''Umar, credits the same words to Umar ibn al-Khattab. Often quoted as «ليس الفطن…».',
  array['Saying','⇄ Wise vs. ignorant: wise'], 18),
 (2029, 'Sometimes, in the family, it is better to be happy than to be right.',
  'In small arguments at home, peace and love matter more than winning. It doesn''t apply to safety or real wrongs: those still need to be said, kindly.',
  'أحيانًا، في الأسرة: أن تكون سعيدًا خيرٌ من أن تكون صوابًا.', 'Unknown', '', 'proverb', 'unchecked', '',
  'A popular modern saying. The word "sometimes" matters: it is about small, everyday arguments.', array['Saying','⇄ Calm vs. angry: calm'], 7),
 (2030, 'Sometimes, in power, it is better to be held in awe than to be loved.',
  'A leader needs people''s respect more than their liking. Good awe comes from fairness, strength and keeping your word, not from fear. The best leaders are respected and liked.',
  'أحيانًا، في السلطة: أن تكون مَهيبًا خيرٌ من أن تكون محبوبًا.', 'Unknown', '', 'proverb', 'unchecked', '',
  'Close to Machiavelli (The Prince, ch. 17), who said that if a ruler cannot be both, it is safer to be feared than loved, but warned him never to be hated. «مهيب» is softer than "feared": respected and held in awe.', array['Saying'], 17),
 (2031, 'Sometimes, in relationships, it is better to be sad with the right people than happy with the wrong people.',
  'The right people stay with you in hard times. The wrong people can make you feel good for a while (with flattery or too much too soon) and hurt you later.',
  'أحيانًا، في العلاقات: أن تكون حزينًا مع الأشخاص الصحيحين خيرٌ من أن تكون سعيدًا مع الأشخاص الخطأ.', 'Unknown', '', 'proverb', 'unchecked', '',
  'A popular modern saying.', array['Saying','⇄ Friend vs. enemy: friend'], 6),
 (2032, 'A friend is not a true friend until he protects his friend when he is absent, and after he dies. Loyalty is shown behind someone''s back, not to their face. Your friend is not the one you love, but the one you trust.',
  'A real friend defends you when you are not there to hear it. Kind words to your face are easy; loyalty is what people say about you when you are away.',
  'لا يكونُ الصديقُ صديقًا حتى يحفظَ صديقَه في غيبتِه وبعد وفاتِه. إنّما الوفاءُ في الظَّهرِ لا في الوجه، وإنّ صديقَك ليس مَن أحببتَه وإنّما مَن أمِنتَه.',
  'Ali ibn Abi Talib', 'in Ibn Abd al-Barr, Bahjat al-Majalis', 'attributed', 'unchecked', '',
  'Quoted from Bahjat al-Majalis wa-Uns al-Majalis by Ibn Abd al-Barr (978–1071), as given in Adham Sharqawi''s "Rasa''il min Ali ibn Abi Talib" (no. 13, «الوفاء في الظهر لا في الوجه»). Not checked against the original edition.',
  array['Saying','≈ Friend','⇄ Friend vs. enemy: friend'], 6),
 (2033, 'A friend said to his friend: "Someone wronged me and I stayed silent. Then he wronged you, and I treated you like myself and stayed silent." His friend said: "They are not the same. Accepting a wrong done to you is forbearance; accepting a wrong done to your friend is meanness."',
  'You may forgive what is done to you. But staying silent when your friend is wronged is not kindness: it leaves them alone.',
  'قال صديقٌ لصديقه: أساءَ إليَّ فلانٌ فسكتُّ عنه، ثمّ أساءَ إليك فساويتُك بنفسي وسكتُّ عنه! فقال له: ليسوا سواءً؛ قبولُك الإساءةَ في نفسك حِلمٌ، وقبولُك الإساءةَ في صاحبك لُؤمٌ!',
  'Ibn Abd al-Barr', 'Bahjat al-Majalis', 'popularized', 'unchecked', '',
  'An anecdote with unnamed speakers, given right after the saying on loyalty in the same chapter of Adham Sharqawi''s "Rasa''il min Ali ibn Abi Talib", from Bahjat al-Majalis.',
  array['Saying','⇄ Brave vs. scared: brave','≈ Friend'], 6),
 (2034, 'Trauma is not what happens to you; trauma is what happens inside you as a result of what happens to you.',
  'Trauma is not the bad event itself but the wound it leaves inside. That is why the same event hurts people differently, and why the inside part can heal.',
  'الصدمةُ ليست ما يحدث لك، بل ما يحدث في داخلك نتيجةً لما حدث لك.', 'Gabor Maté', 'The Wounded Healer, talk, Victoria BC, May 2018', 'said', 'unchecked', '',
  'Gabor Maté repeats this idea often in his talks and books on trauma.', array['Saying'], 16),
 (2035, 'Pain that does not turn into awareness repeats itself in different forms.',
  'If we don''t understand our pain, we may live it again or pass it on: hurt people can hurt people. Understanding it breaks the circle.',
  'الألمُ الذي لا يتحوّل إلى وعي، يُعيد إنتاجَ نفسِه بأشكالٍ مختلفة.', 'Unknown', '', 'proverb', 'unchecked', '',
  'Shared widely in Arabic without a named author.', array['Saying','⇄ Wise vs. ignorant: wise'], 16),
 (2036, 'Pain that does not turn into a story turns into an identity.',
  'When we can tell our pain as a story (what happened, how it felt, what we learned), it becomes something that happened to us. Left untold, it can become who we think we are: "I''m the one nobody loves."',
  'الألمُ الذي لم يتحوّل إلى سرديّة، يتحوّل إلى هويّة.', 'Imad Rashad Othman', 'Abi alladhi akrah (My Father Whom I Hate)', 'said', 'verified', '',
  'From the Egyptian psychiatrist''s book «أبي الذي أكره»: recovery passes through living again a stuck pain that was never taken into the story of the self. Often quoted as «الألم الذي لا يتحول إلى سردية…».',
  array['Saying'], 16);

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

insert into public.people (name, kind) select distinct who, case when who = 'Unknown' then 'unknown' else 'person' end from nq on conflict do nothing;
insert into public.people (name, kind) values ('Umar ibn al-Khattab', 'person') on conflict do nothing;
update public.people set born = 'about 573', died = '664', nationality = 'Arabia / Egypt', known_for = 'Companion of the Prophet, conqueror and governor of Egypt, famous for his shrewdness', emoji = '🧠' where name = 'Amr ibn al-As' and coalesce(born, '') = '';
update public.people set born = '584', died = '644', nationality = 'Arabia', known_for = 'Second caliph, known as al-Faruq for his sense of justice', emoji = '⚖️' where name = 'Umar ibn al-Khattab' and coalesce(born, '') = '';
update public.people set born = '978', died = '1071', nationality = 'Al-Andalus', known_for = 'Scholar of Cordoba; author of Bahjat al-Majalis, a collection of sayings and stories', emoji = '📖' where name = 'Ibn Abd al-Barr' and coalesce(born, '') = '';
update public.people set born = '1944', nationality = 'Hungary / Canada', known_for = 'Physician and author on trauma, addiction and stress', emoji = '🩺' where name = 'Gabor Maté' and coalesce(born, '') = '';
update public.people set nationality = 'Egypt', known_for = 'Psychiatrist and author on recovery and family wounds (My Father Whom I Hate, The Executioner Under My Skin)', emoji = '🩹' where name = 'Imad Rashad Othman' and coalesce(known_for, '') = '';
delete from public.quote_people l using nq, public.words w where w.lang = 'en' and lower(w.headword) = lower(nq.h) and l.word_id = w.id;
insert into public.quote_people (word_id, person_id, role, status, work, source_url, note, checked_at)
select w.id, p.id, nq.role, nq.status, nq.work, nq.src, nq.note, case when nq.status = 'unchecked' then null else now() end
from nq join public.words w on w.lang = 'en' and w.sense = '' and lower(w.headword) = lower(nq.h)
        join public.people p on lower(btrim(p.name)) = lower(nq.who)
on conflict do nothing;
insert into public.quote_people (word_id, person_id, role, status, work, source_url, note, checked_at)
select w.id, p.id, 'attributed', 'unchecked', 'in al-Aqqad, ''Abqariyyat ''Umar', '', 'Al-Aqqad gives these words as Umar''s; other sources give them to Amr ibn al-As.', null
from public.words w, public.people p where w.lang = 'en' and w.sense = '' and w.headword like 'A wise person is not the one who can tell good from bad%' and p.name = 'Umar ibn al-Khattab'
on conflict do nothing;

-- 📜 as advice
insert into public.advice (target_type, target_key, word_id, position)
select v.t, v.k, w.id, v.p from (values
 ('sign','black_white_thinking',2028,0), ('trait','decisions',2028,0),
 ('sign','competes_always',2029,0), ('sign','rigid_rules',2029,1), ('condition','zero_sum_competition',2029,3), ('condition','ocpd',2029,0),
 ('condition','antagonistic_attachment',2031,0), ('condition','love_bombing',2031,0), ('condition','toxic',2031,0), ('sign','people_pleasing',2031,3), ('sign','too_much_too_soon',2031,0),
 ('condition','character_assassination',2032,1), ('condition','silent_assassination',2032,1), ('sign','gossip',2032,0), ('sign','spreads_rumours',2032,0), ('sign','concerned_gossip',2032,0),
 ('condition','subjugation',2033,0), ('condition','bullying',2033,0), ('condition','social_exclusion',2033,0), ('sign','late_reply',2033,1),
 ('root','trauma',2034,0), ('condition','ptsd',2034,0),
 ('root','copied_models',2035,0), ('root','trauma',2035,1), ('condition','vulnerable_narcissism',2035,0), ('condition','toxic',2035,1),
 ('sign','victim_mindset',2036,0), ('root','trauma',2036,2), ('condition','ptsd',2036,1), ('condition','low_self_esteem',2036,0)
) as v(t, k, n, p) join nq on nq.k = v.n join public.words w on w.lang = 'en' and w.sense = '' and lower(w.headword) = lower(nq.h)
on conflict (target_type, target_key, word_id) do update set position = excluded.position;

-- 💔 the word Pain points to the pain sayings
update public.words set meaning = 'A feeling that hurts, in the body or in the heart. People with different personalities feel their own pain differently, and treat the pain they cause others differently too (see 💔 Pain in Characters). Pain that is understood and told as a story can heal; pain that is hidden can repeat itself.'
  where lang = 'en' and lower(headword) = 'pain' and sense = '';
drop table nq;
select (select count(*) from public.set_entries where set_id = '00000000-0000-4000-8000-000000009007' and position between 2028 and 2036) as new_quotes,
       (select count(*) from public.quote_people l join public.set_entries e on e.word_id = l.word_id where e.position between 2028 and 2036 and e.set_id = '00000000-0000-4000-8000-000000009007') as links,
       (select count(*) from public.advice a join public.set_entries e on e.word_id = a.word_id where e.position between 2028 and 2036 and e.set_id = '00000000-0000-4000-8000-000000009007') as advice;
