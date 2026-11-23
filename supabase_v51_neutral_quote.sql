-- =====================================================================
-- Helper Academy — v51: "Don't be neutral in the face of injustice" (author unknown) (Quotes & Sayings, 🦁 Courage)
--   with meaning, Arabic, and who said it (checked sources in the note; the Churchill line is a later paraphrase)
-- Safe to re-run. Run AFTER v50.
-- =====================================================================
create temp table nq(k int, h text, m text, t text, who text, work text, role text, status text, src text, note text, tags text[], u int);
insert into nq values
 (2010, 'Don''t be neutral in the face of injustice. Then, being neutral is not wisdom but fear. You may not stand with the oppressor, but your silence leaves the oppressed alone.',
  'If someone is treated unfairly and you stay quiet, the person being hurt feels alone, even if you are not helping the bully.',
  'لا تكن محايداً أمام الظلم... فالحياد حينها ليس حكمة بل خوف؛ قد لا تقف مع الظالم، لكن صمتك يترك المظلوم وحده.',
  'Unknown', '', 'said', 'unchecked', '',
  'Shared in Arabic without a name.',
  array['Saying','≈ Brave','⇄ Brave vs. scared: brave','⇄ Friend vs. enemy: friend'], 2);

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
insert into public.people (name, kind) select distinct who, case when who = 'Unknown' then 'unknown' else 'person' end from nq on conflict do nothing;
delete from public.quote_people l using nq, public.words w where w.lang = 'en' and lower(w.headword) = lower(nq.h) and l.word_id = w.id;
insert into public.quote_people (word_id, person_id, role, status, work, source_url, note, checked_at)
select w.id, p.id, nq.role, nq.status, nq.work, nq.src, nq.note, case when nq.status = 'unchecked' then null else now() end
from nq join public.words w on w.lang = 'en' and w.sense = '' and lower(w.headword) = lower(nq.h)
        join public.people p on lower(btrim(p.name)) = lower(nq.who)
on conflict do nothing;
drop table nq;

select (select count(*) from public.set_entries where set_id = '00000000-0000-4000-8000-000000009007') as quotes,
       (select count(*) from public.set_entries where set_id = '00000000-0000-4000-8000-000000009007' and position = 2010) as new_quote,
       (select count(*) from public.quote_people l join public.words w on w.id = l.word_id where w.headword like 'Don''t be neutral%') as linked;
