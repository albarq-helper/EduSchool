-- =====================================================================
-- Helper Academy — v50: two more sayings shared as Sartre's (disputed): freedom; the three stages of life
--   with meaning, Arabic, and who said it (checked sources in the note; the Churchill line is a later paraphrase)
-- Safe to re-run. Run AFTER v49.
-- =====================================================================
create temp table nq(k int, h text, m text, t text, who text, work text, role text, status text, src text, note text, tags text[], u int);
insert into nq values
 (2008, 'The greatest freedom is not to be noticed.',
  'When you don''t need everyone''s attention, you can live and think the way you choose.',
  'أقصى درجات الحرية ألّا تكون لافتاً للنظر.',
  'Jean-Paul Sartre', '', 'attributed', 'disputed', 'https://www.goodreads.com/user_quotes/26672451',
  'Shared in Arabic as Sartre''s, as part of a longer, ironic passage about a ruler whom nobody can question (it uses Egyptian dialect, so it is probably not a translation of Sartre). Not found in his books.',
  array['Saying'], 9),
 (2009, 'Life has three stages: believing you will change the world, believing you will not change the world, and being sure that the world has changed you.',
  'When we are young we dream big; later we see how hard it is; in the end we notice how much life has shaped us.',
  'إنّ الحياة ثلاث مراحل: اعتقادك أنك سوف تغيّر الدنيا، وإيمانك بأنك لن تغيّر الدنيا، وتأكّدك من أن الدنيا قد غيّرتك.',
  'Jean-Paul Sartre', '', 'attributed', 'disputed', '',
  'Shared in Arabic as Sartre''s; not found in his books or in English or French quote collections.',
  array['Saying'], 18);

insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', h, '', m, '', t, '', '', '💬', '', who || case when work <> '' then ' · ' || work else '' end, tags,
       (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')
from nq on conflict (lang, lower(headword), sense) do nothing;
update public.words w set meaning = nq.m, translation = nq.t, author = nq.who || case when nq.work <> '' then ' · ' || nq.work else '' end,
       tags = (select array(select distinct x from unnest(w.tags || nq.tags) x order by x))
  from nq where w.lang = 'en' and w.sense = '' and lower(w.headword) = lower(nq.h);

insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select ('00000000-0000-4000-8000-' || lpad(to_hex(nq.k), 8, '0') || '9007')::uuid, '00000000-0000-4000-8000-000000009007', nq.k, 'term', nq.u, '{}', w.id
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
       (select count(*) from public.set_entries where set_id = '00000000-0000-4000-8000-000000009007' and position in (2008, 2009)) as new_quotes,
       (select count(*) from public.quote_people l join public.words w on w.id = l.word_id where w.headword in ('The greatest freedom is not to be noticed.') or w.headword like 'Life has three stages%') as sartre_linked;
