-- =====================================================================
-- Helper Academy — v46: four quotes about speaking up (Quotes & Sayings, 🦁 Courage)
--   with meaning, Arabic, and who said it (checked sources in the note; the Churchill line is a later paraphrase)
-- Safe to re-run. Run AFTER v45.
-- =====================================================================
create temp table nq(k int, h text, m text, t text, who text, work text, role text, status text, src text, note text, tags text[]);
insert into nq values
 (2001, 'In the end, we will remember not the words of our enemies, but the silence of our friends.',
  'When friends stay quiet while we are treated badly, it hurts more than anything an enemy says.',
  'في النهاية، لن نتذكّر كلمات أعدائنا، بل صمت أصدقائنا.',
  'Martin Luther King Jr.', 'The Trumpet of Conscience (1967)', 'attributed', 'unchecked', 'https://wist.info/?p=2291',
  'Widely quoted as King; the exact original wording is not firmly documented.',
  array['Saying','≈ Brave','⇄ Brave vs. scared: brave','⇄ Friend vs. enemy: friend']),
 (2002, 'The world will not be destroyed by those who do evil, but by those who watch them without doing anything.',
  'Bad things grow when the people who see them do nothing to stop them.',
  'لن يُدمَّر العالم على يد من يفعلون الشر، بل على يد من يشاهدونهم دون أن يفعلوا شيئاً.',
  'Albert Einstein', 'tribute to Pablo Casals (1953), popular wording', 'attributed', 'disputed', 'https://quoteinvestigator.com/2022/06/01/peril/',
  'A popular rewording of Einstein''s 1953 words: "the world is in greater peril from those who tolerate or encourage evil than from those who actually commit it."',
  array['Saying','≈ Brave','⇄ Brave vs. scared: brave']),
 (2003, 'If you are neutral in situations of injustice, you have chosen the side of the oppressor.',
  'If you see someone treated unfairly and do nothing, you are helping the one who is unfair.',
  'إذا كنت محايداً في مواقف الظلم، فقد اخترت صف الظالم.',
  'Desmond Tutu', 'as quoted in Unexpected News (1984)', 'said', 'verified', 'https://en.wikiquote.org/wiki/Desmond_Tutu',
  'Quoted by Robert McAfee Brown, Unexpected News: Reading the Bible with Third World Eyes (1984), p. 19.',
  array['Saying','≈ Brave','⇄ Brave vs. scared: brave','⇄ Honest vs. lying: honest']),
 (2004, 'You were given the choice between war and dishonour. You chose dishonour, and you will have war.',
  'Choosing the easy, shameful way to avoid a fight does not stop the fight from coming.',
  'خُيّرتم بين الحرب والعار، فاخترتم العار، وستنالون الحرب.',
  'Winston Churchill', 'about the Munich Agreement (1938), later wording', 'attributed', 'disputed', 'https://richardlangworth.com/war-shame',
  'Churchill''s real words (letter to Lloyd George, 13 August 1938): "we shall have to choose in the next few weeks between war and shame". The famous version is a later paraphrase.',
  array['Saying','≈ Brave','⇄ Brave vs. scared: brave','⇄ Proud vs. ashamed: proud']);

insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', h, '', m, '', t, '', '', '💬', '', who || ' · ' || work, tags,
       (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')
from nq on conflict (lang, lower(headword), sense) do nothing;
update public.words w set meaning = nq.m, translation = nq.t, author = nq.who || ' · ' || nq.work,
       tags = (select array(select distinct x from unnest(w.tags || nq.tags) x order by x))
  from nq where w.lang = 'en' and w.sense = '' and lower(w.headword) = lower(nq.h);

insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select ('00000000-0000-4000-8000-' || lpad(to_hex(nq.k), 8, '0') || '9007')::uuid, '00000000-0000-4000-8000-000000009007', nq.k, 'term', 2, '{}', w.id
from nq join public.words w on w.lang = 'en' and w.sense = '' and lower(w.headword) = lower(nq.h)
on conflict (id) do nothing;

-- who said it
insert into public.people (name, kind) select distinct who, 'person' from nq on conflict do nothing;
update public.people set born = '1929', died = '1968', nationality = 'United States', known_for = 'Civil rights leader', emoji = '✊' where name = 'Martin Luther King Jr.' and born = '';
update public.people set born = '1879', died = '1955', nationality = 'Germany / United States', known_for = 'Physicist: the theory of relativity', emoji = '🧠' where name = 'Albert Einstein' and born = '';
update public.people set born = '1931', died = '2021', nationality = 'South Africa', known_for = 'Archbishop; fought apartheid; Nobel Peace Prize 1984', emoji = '🕊️' where name = 'Desmond Tutu' and born = '';
update public.people set born = '1874', died = '1965', nationality = 'United Kingdom', known_for = 'Prime Minister in the Second World War', emoji = '🎩' where name = 'Winston Churchill' and born = '';
delete from public.quote_people l using nq, public.words w where w.lang = 'en' and lower(w.headword) = lower(nq.h) and l.word_id = w.id;
insert into public.quote_people (word_id, person_id, role, status, work, source_url, note, checked_at)
select w.id, p.id, nq.role, nq.status, nq.work, nq.src, nq.note, case when nq.status = 'unchecked' then null else now() end
from nq join public.words w on w.lang = 'en' and w.sense = '' and lower(w.headword) = lower(nq.h)
        join public.people p on lower(btrim(p.name)) = lower(nq.who)
on conflict do nothing;
drop table nq;

select (select count(*) from public.set_entries where set_id = '00000000-0000-4000-8000-000000009007') as quotes,
       (select count(*) from public.set_entries where set_id = '00000000-0000-4000-8000-000000009007' and position between 2001 and 2004) as new_quotes,
       (select count(*) from public.quote_people l join public.words w on w.id = l.word_id where w.headword like 'If you are neutral%') as tutu_linked;
