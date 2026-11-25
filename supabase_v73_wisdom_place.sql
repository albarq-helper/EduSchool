-- =====================================================================
-- Helper Academy — v73: 💬 wisdom is not harshness or softness, but putting things in their right place
--   * the modern saying (no named author found) and the classic definition it rests on (Ibn al-Qayyim, Madarij al-Salikin; al-Harawi)
--   linked as advice to rigid rules, black-and-white thinking, OCPD and the Decisions / Assertive traits. Run AFTER v72. Safe to re-run.
-- =====================================================================
create temp table nq(k int, h text, m text, t text, who text, work text, role text, status text, src text, note text, tags text[], u int);
insert into nq values
 (2037, 'Wisdom is not in harshness or in softness; wisdom is putting things in their right place.',
  'Being firm is not always right, and being gentle is not always right. A wise person chooses what fits the moment: gentle where gentleness helps, firm where firmness is needed. Think of a meter: the wise point is not always the middle, it is the right point for this situation.',
  'ليست الحكمةُ في شدّةٍ أو لِين، إنّما الحكمةُ أن تضعَ الأمورَ في نِصابها.', 'Unknown', '', 'proverb', 'unchecked', '',
  'No named author found for this wording. It sums up the classic Arabic definition of wisdom: «وضع الشيء في موضعه» (al-Harawi), and Ibn al-Qayyim''s «فعل ما ينبغي، على الوجه الذي ينبغي، في الوقت الذي ينبغي». The same idea is in al-Mutanabbi''s verse on putting generosity where the sword belongs, and the sword where generosity belongs.',
  array['Saying','≈ Wise','⇄ Wise vs. ignorant: wise','⇄ Calm vs. angry: calm'], 18),
 (2038, 'Wisdom is doing what should be done, in the way it should be done, at the time it should be done.',
  'Wisdom has three parts: the right thing, the right way and the right time. A good idea said in the wrong way, or at the wrong time, can still go wrong.',
  'الحكمةُ: فعلُ ما ينبغي، على الوجهِ الذي ينبغي، في الوقتِ الذي ينبغي.', 'Ibn al-Qayyim', 'Madarij al-Salikin', 'said', 'verified', '',
  'Ibn al-Qayyim (1292–1350) in Madarij al-Salikin. He divides wisdom into knowing (seeing how causes lead to results) and doing (putting each thing in its place), and gives it three pillars: knowledge, forbearance and patience; its enemies are ignorance, recklessness and haste. Earlier, Abu Isma''il al-Harawi called wisdom «إحكام وضع الشيء في موضعه».',
  array['Saying','≈ Wise','⇄ Wise vs. ignorant: wise'], 18);

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
update public.people set born = '1292', died = '1350', nationality = 'Damascus (Syria)', known_for = 'Scholar; author of Madarij al-Salikin and Zad al-Ma''ad', emoji = '📚' where name = 'Ibn al-Qayyim' and coalesce(born, '') = '';
delete from public.quote_people l using nq, public.words w where w.lang = 'en' and lower(w.headword) = lower(nq.h) and l.word_id = w.id;
insert into public.quote_people (word_id, person_id, role, status, work, source_url, note, checked_at)
select w.id, p.id, nq.role, nq.status, nq.work, nq.src, nq.note, case when nq.status = 'unchecked' then null else now() end
from nq join public.words w on w.lang = 'en' and w.sense = '' and lower(w.headword) = lower(nq.h)
        join public.people p on lower(btrim(p.name)) = lower(nq.who)
on conflict do nothing;
insert into public.advice (target_type, target_key, word_id, position)
select v.t, v.k, w.id, v.p from (values
 ('sign','rigid_rules',2037,0), ('sign','black_white_thinking',2037,1), ('condition','ocpd',2037,1), ('trait','decisions',2037,1), ('trait','assertive',2037,0), ('trait','boundaries',2037,0),
 ('trait','decisions',2038,2), ('sign','impulsive',2038,0), ('sign','reckless',2038,0)
) as v(t, k, n, p) join nq on nq.k = v.n join public.words w on w.lang = 'en' and w.sense = '' and lower(w.headword) = lower(nq.h)
on conflict (target_type, target_key, word_id) do update set position = excluded.position;
drop table nq;
select (select count(*) from public.set_entries where set_id = '00000000-0000-4000-8000-000000009007' and position in (2037, 2038)) as new_quotes,
       (select count(*) from public.advice a join public.set_entries e on e.word_id = a.word_id where e.position in (2037, 2038) and e.set_id = '00000000-0000-4000-8000-000000009007') as advice;
