-- =====================================================================
-- Helper Academy — v74: 💬 al-Mutanabbi on putting things in their place (from «لكل امرئ من دهره ما تعودا», praising Sayf al-Dawla, Eid al-Adha 342 AH)
--   * generosity where the sword belongs is as harmful as the sword where generosity belongs
--   * honour the noble and you win him; honour the mean and he rebels
--   linked to the wisdom sayings (v73) as advice. Run AFTER v73. Safe to re-run.
-- =====================================================================
create temp table nq(k int, h text, m text, t text, who text, work text, role text, status text, src text, note text, tags text[], u int);
insert into nq values
 (2039, 'Putting generosity where the sword belongs harms greatness, just as putting the sword where generosity belongs.',
  'Kindness at the wrong moment can do as much harm as harshness at the wrong moment. Some moments need gentleness, some need firmness: wisdom is knowing which is which.',
  'وَوَضعُ النَّدى في مَوضِعِ السَّيفِ بِالعُلا ... مُضِرٌّ كَوَضعِ السَّيفِ في مَوضِعِ النَّدى',
  'Al-Mutanabbi', 'poem «لكل امرئ من دهره ما تعودا»', 'said', 'verified', '',
  'From al-Mutanabbi''s poem praising Sayf al-Dawla and congratulating him on Eid al-Adha (342 AH), «لكل امرئ من دهره ما تعودا». «الندى» means generosity, kindness and gentleness. A famous example of the idea that wisdom is putting things in their right place.',
  array['Saying','≈ Wise','⇄ Wise vs. ignorant: wise'], 18),
 (2040, 'If you honour a noble person, you win him; if you honour a mean person, he rebels.',
  'Good people answer kindness with loyalty. Mean people may take your kindness as weakness and push further, so with them kindness needs limits.',
  'إِذا أَنتَ أَكرَمتَ الكَريمَ مَلَكتَهُ ... وَإِن أَنتَ أَكرَمتَ اللَئيمَ تَمَرَّدا',
  'Al-Mutanabbi', 'poem «لكل امرئ من دهره ما تعودا»', 'said', 'verified', '',
  'The verse just before «ووضع الندى في موضع السيف…» in the same poem; one of al-Mutanabbi''s best-known proverbs.',
  array['Saying','≈ Wise','⇄ Kind vs. unkind: kind'], 6);

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
insert into public.people (name, kind) values ('Al-Mutanabbi', 'person') on conflict do nothing;
delete from public.quote_people l using nq, public.words w where w.lang = 'en' and lower(w.headword) = lower(nq.h) and l.word_id = w.id;
insert into public.quote_people (word_id, person_id, role, status, work, source_url, note, checked_at)
select w.id, p.id, nq.role, nq.status, nq.work, nq.src, nq.note, now()
from nq join public.words w on w.lang = 'en' and w.sense = '' and lower(w.headword) = lower(nq.h)
        join public.people p on lower(btrim(p.name)) = lower(nq.who)
on conflict do nothing;
-- the v73 note now names the verse
update public.quote_people l set note = replace(l.note, 'The same idea is in al-Mutanabbi''s verse on putting generosity where the sword belongs, and the sword where generosity belongs.',
  'The same idea is in al-Mutanabbi''s verse «ووضع الندى في موضع السيف بالعلا مضر كوضع السيف في موضع الندى» (see that saying).')
  from public.words w where l.word_id = w.id and w.headword like 'Wisdom is not in harshness or in softness%';
insert into public.advice (target_type, target_key, word_id, position)
select v.t, v.k, w.id, v.p from (values
 ('trait','assertive',2039,1), ('trait','boundaries',2039,1), ('sign','rigid_rules',2039,1), ('sign','people_pleasing',2039,4),
 ('trait','boundaries',2040,2), ('trait','empathy',2040,0), ('sign','people_pleasing',2040,5), ('condition','parasitism',2040,3), ('sign','takes_never_gives',2040,1)
) as v(t, k, n, p) join nq on nq.k = v.n join public.words w on w.lang = 'en' and w.sense = '' and lower(w.headword) = lower(nq.h)
on conflict (target_type, target_key, word_id) do update set position = excluded.position;
drop table nq;
select (select count(*) from public.set_entries where set_id = '00000000-0000-4000-8000-000000009007' and position in (2039, 2040)) as new_quotes,
       (select count(*) from public.advice a join public.set_entries e on e.word_id = a.word_id where e.position in (2039, 2040) and e.set_id = '00000000-0000-4000-8000-000000009007') as advice;
