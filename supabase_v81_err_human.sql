-- =====================================================================
-- Helper Academy — v81: 💬 «من يخطئ فهو إنسان، ومن يصرّ على الخطأ فهو شيطان» — to err is human, to persist in error is devilish
--   * the Arabic saying (the popular form of the Latin «Errare humanum est, perseverare autem diabolicum»: often credited to Seneca but not in his works;
--     close in St Augustine, Sermon 164) and its oldest verified source, Cicero, Philippics 12.5. Linked as advice. Run AFTER v80. Safe to re-run.
-- =====================================================================
create temp table nq(k int, h text, m text, t text, who text, work text, role text, status text, src text, note text, tags text[], u int);
insert into nq values
 (2041, 'To make a mistake is human; to insist on the mistake is the devil''s work.',
  'Everyone makes mistakes; that is normal and part of learning. What turns a mistake into something bad is refusing to admit it and doing it again and again. Say sorry, fix it, and learn: that is the human way.',
  'من يخطئ فهو إنسان، ومن يصرّ على الخطأ فهو شيطان.', 'Unknown', '', 'proverb', 'unchecked', 'https://en.wiktionary.org/wiki/errare_humanum_est',
  'A well-known Arabic saying, the same as the Latin «Errare humanum est, perseverare autem diabolicum» (to err is human, to persist [in error] is diabolical). It is often credited to Seneca, but it is not found in his works. A close form is in St Augustine (Sermon 164): «Humanum fuit errare, diabolicum est per animositatem in errore manere». The oldest verified idea is Cicero''s (next saying).',
  array['Saying','≈ Mistake','⇄ Stubborn vs. open-minded: open-minded','⇄ Proud vs. humble: humble'], 18),
 (2042, 'Anyone can make a mistake, but only a fool keeps on making it.',
  'Making a mistake does not make you foolish: everybody does it. Staying in the mistake after you know it is wrong is what is foolish. Notice it, change course, and you are wiser than before.',
  'كلُّ إنسانٍ يُخطئ، ولا يُصرُّ على خطئه إلا الأحمق.', 'Cicero', 'Philippics 12.5', 'said', 'verified', 'https://wist.info/cicero-marcus-tullius/553/',
  'Marcus Tullius Cicero (106–43 BC), Roman orator and statesman, Philippics 12, ch. 2, sec. 5 (43 BC): «Cuiusvis hominis est errare, nullius nisi insipientis in errore perseverare» (Any man can err; only a fool persists in error). The later saying «to err is human, to persist is diabolical» grew from this idea.',
  array['Saying','≈ Mistake','⇄ Wise vs. ignorant: wise'], 18);

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
update public.people set born = '106 BC', died = '43 BC', nationality = 'Rome', known_for = 'Roman orator, statesman and philosopher', emoji = '🏛️' where name = 'Cicero' and coalesce(born, '') = '';
delete from public.quote_people l using nq, public.words w where w.lang = 'en' and lower(w.headword) = lower(nq.h) and l.word_id = w.id;
insert into public.quote_people (word_id, person_id, role, status, work, source_url, note, checked_at)
select w.id, p.id, nq.role, nq.status, nq.work, nq.src, nq.note, case when nq.status = 'unchecked' then null else now() end
from nq join public.words w on w.lang = 'en' and w.sense = '' and lower(w.headword) = lower(nq.h)
        join public.people p on lower(btrim(p.name)) = lower(nq.who)
on conflict do nothing;
insert into public.advice (target_type, target_key, word_id, position)
select v.t, v.k, w.id, v.p from (values
 ('sign','no_remorse',2041,0), ('sign','denies_reality',2041,1), ('sign','turns_tables',2041,1), ('sign','perfectionism',2041,1), ('trait','responsibility',2041,0), ('trait','self_honesty',2041,0), ('trait','conscience',2041,1),
 ('trait','mindset',2042,1), ('trait','responsibility',2042,1), ('sign','blames_own_flaws',2042,1)
) as v(t, k, n, p) join nq on nq.k = v.n join public.words w on w.lang = 'en' and w.sense = '' and lower(w.headword) = lower(nq.h)
on conflict (target_type, target_key, word_id) do update set position = excluded.position;
drop table nq;
select (select count(*) from public.set_entries where set_id = '00000000-0000-4000-8000-000000009007' and position in (2041, 2042)) as new_quotes,
       (select count(*) from public.advice a join public.set_entries e on e.word_id = a.word_id where e.position in (2041, 2042) and e.set_id = '00000000-0000-4000-8000-000000009007') as advice;
