-- =====================================================================
-- Helper Academy — v49: awareness and evil (attributed to Sartre, disputed) (Quotes & Sayings, 📚 Learning)
--   with meaning, Arabic, and who said it (checked sources in the note; the Churchill line is a later paraphrase)
-- Safe to re-run. Run AFTER v48.
-- =====================================================================
create temp table nq(k int, h text, m text, t text, who text, work text, role text, status text, src text, note text, tags text[]);
insert into nq values
 (2007, 'The most aware and understanding people cannot be evil, because evil needs stupidity and narrow thinking.',
  'When you truly understand people and what your actions do to them, it becomes very hard to choose to hurt anyone.',
  'إنَّ النّاس الأكثر وعياً وإدراكاً لا يُمكن أن يكونوا أشراراً، لأنَّ الشَّر يتطلّب غباءً ومحدوديةً في التفكير.',
  'Jean-Paul Sartre', '', 'attributed', 'disputed', '',
  'Shared in Arabic as Sartre''s, but not found in his books or in English or French quote collections; probably a later saying given his name.',
  array['Saying','≈ Learning','⇄ Wise vs. ignorant: wise','⇄ Kind vs. unkind: kind']);

insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', h, '', m, '', t, '', '', '💬', '', who || case when work <> '' then ' · ' || work else '' end, tags,
       (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')
from nq on conflict (lang, lower(headword), sense) do nothing;
update public.words w set meaning = nq.m, translation = nq.t, author = nq.who || case when nq.work <> '' then ' · ' || nq.work else '' end,
       tags = (select array(select distinct x from unnest(w.tags || nq.tags) x order by x))
  from nq where w.lang = 'en' and w.sense = '' and lower(w.headword) = lower(nq.h);

insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select ('00000000-0000-4000-8000-' || lpad(to_hex(nq.k), 8, '0') || '9007')::uuid, '00000000-0000-4000-8000-000000009007', nq.k, 'term', 5, '{}', w.id
from nq join public.words w on w.lang = 'en' and w.sense = '' and lower(w.headword) = lower(nq.h)
on conflict (id) do nothing;

-- who said it
insert into public.people (name, kind) select distinct who, 'person' from nq on conflict do nothing;
update public.people set born = '1905', died = '1980', nationality = 'France', known_for = 'Philosopher and writer (existentialism)', emoji = '🤔' where name = 'Jean-Paul Sartre' and born = '';
delete from public.quote_people l using nq, public.words w where w.lang = 'en' and lower(w.headword) = lower(nq.h) and l.word_id = w.id;
insert into public.quote_people (word_id, person_id, role, status, work, source_url, note, checked_at)
select w.id, p.id, nq.role, nq.status, nq.work, nq.src, nq.note, case when nq.status = 'unchecked' then null else now() end
from nq join public.words w on w.lang = 'en' and w.sense = '' and lower(w.headword) = lower(nq.h)
        join public.people p on lower(btrim(p.name)) = lower(nq.who)
on conflict do nothing;
drop table nq;

select (select count(*) from public.set_entries where set_id = '00000000-0000-4000-8000-000000009007') as quotes,
       (select count(*) from public.set_entries where set_id = '00000000-0000-4000-8000-000000009007' and position = 2007) as new_quote,
       (select count(*) from public.quote_people l join public.words w on w.id = l.word_id where w.headword like 'The most aware%') as sartre_linked;
