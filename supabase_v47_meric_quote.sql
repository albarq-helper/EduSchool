-- =====================================================================
-- Helper Academy — v47: Cemil Meriç's saying about neutrality and injustice (Quotes & Sayings, 🦁 Courage)
--   with meaning, Arabic, and who said it (checked sources in the note; the Churchill line is a later paraphrase)
-- Safe to re-run. Run AFTER v46.
-- =====================================================================
create temp table nq(k int, h text, m text, t text, who text, work text, role text, status text, src text, note text, tags text[]);
insert into nq values
 (2005, 'Where there is injustice, being neutral is dishonourable.',
  'If someone is being treated unfairly, staying "on nobody''s side" is not fair or honourable.',
  'الحياد في المكان الذي يقع فيه الظلم يعني انعدام الشرف.',
  'Cemil Meriç', '', 'attributed', 'unchecked', '',
  'Turkish: "Zulmün olduğu yerde tarafsızlık şerefsizliktir." Widely attributed to Cemil Meriç (Turkish writer and thinker, 1916–1987); not yet found in his books.',
  array['Saying','≈ Brave','⇄ Brave vs. scared: brave','⇄ Proud vs. ashamed: proud','⇄ Honest vs. lying: honest']);

insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', h, '', m, '', t, '', '', '💬', '', who || case when work <> '' then ' · ' || work else '' end, tags,
       (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')
from nq on conflict (lang, lower(headword), sense) do nothing;
update public.words w set meaning = nq.m, translation = nq.t, author = nq.who || case when nq.work <> '' then ' · ' || nq.work else '' end,
       tags = (select array(select distinct x from unnest(w.tags || nq.tags) x order by x))
  from nq where w.lang = 'en' and w.sense = '' and lower(w.headword) = lower(nq.h);

insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select ('00000000-0000-4000-8000-' || lpad(to_hex(nq.k), 8, '0') || '9007')::uuid, '00000000-0000-4000-8000-000000009007', nq.k, 'term', 2, '{}', w.id
from nq join public.words w on w.lang = 'en' and w.sense = '' and lower(w.headword) = lower(nq.h)
on conflict (id) do nothing;

-- who said it
insert into public.people (name, kind) select distinct who, 'person' from nq on conflict do nothing;
update public.people set born = '1916', died = '1987', nationality = 'Turkey', known_for = 'Writer, thinker and translator', emoji = '📖' where name = 'Cemil Meriç' and born = '';
delete from public.quote_people l using nq, public.words w where w.lang = 'en' and lower(w.headword) = lower(nq.h) and l.word_id = w.id;
insert into public.quote_people (word_id, person_id, role, status, work, source_url, note, checked_at)
select w.id, p.id, nq.role, nq.status, nq.work, nq.src, nq.note, case when nq.status = 'unchecked' then null else now() end
from nq join public.words w on w.lang = 'en' and w.sense = '' and lower(w.headword) = lower(nq.h)
        join public.people p on lower(btrim(p.name)) = lower(nq.who)
on conflict do nothing;
drop table nq;

select (select count(*) from public.set_entries where set_id = '00000000-0000-4000-8000-000000009007') as quotes,
       (select count(*) from public.set_entries where set_id = '00000000-0000-4000-8000-000000009007' and position = 2005) as new_quote,
       (select count(*) from public.quote_people l join public.words w on w.id = l.word_id where w.headword like 'Where there is injustice%') as meric_linked;
