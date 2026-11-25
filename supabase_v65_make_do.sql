-- =====================================================================
-- Helper Academy — v65: 🧭 Make or do?
--   Rule: DO = activities, jobs and chores (do the dishes, do your homework); MAKE = create or produce something new
--   (make a cake, make a decision, make a noise). Exception: make your bed. Partners are grouped by the rule with tags
--   "🧭 <group>"; exceptions also carry "⚠️ …". Partner nouns link to their dictionary words when they exist.
-- Built by tools/words/build_v65.py. Safe to re-run.
-- =====================================================================
alter table public.word_partners add column if not exists tags text[] not null default '{}';
insert into public.word_partners (word_id, kind, phrase, partner, position, tags, partner_word_id)
select v.w, v.k, v.ph, v.pa, v.pos, v.tg, (select x.id from public.words x where x.lang = 'en' and lower(x.headword) = lower(v.noun) and x.sense = '' limit 1)
from (values
('2adc0e7e-269f-498d-b1d9-0e46e47857d1'::uuid, 'noun', 'do the dishes', 'the dishes', 1, array['🧭 Do: jobs & chores at home']::text[], 'dishes'),
('2adc0e7e-269f-498d-b1d9-0e46e47857d1'::uuid, 'noun', 'do the laundry', 'the laundry', 2, array['🧭 Do: jobs & chores at home']::text[], 'laundry'),
('2adc0e7e-269f-498d-b1d9-0e46e47857d1'::uuid, 'noun', 'do the housework', 'the housework', 3, array['🧭 Do: jobs & chores at home']::text[], 'housework'),
('2adc0e7e-269f-498d-b1d9-0e46e47857d1'::uuid, 'noun', 'do the shopping', 'the shopping', 4, array['🧭 Do: jobs & chores at home']::text[], 'shopping'),
('2adc0e7e-269f-498d-b1d9-0e46e47857d1'::uuid, 'noun', 'do the cleaning', 'the cleaning', 5, array['🧭 Do: jobs & chores at home']::text[], 'cleaning'),
('2adc0e7e-269f-498d-b1d9-0e46e47857d1'::uuid, 'noun', 'do the ironing', 'the ironing', 6, array['🧭 Do: jobs & chores at home']::text[], 'ironing'),
('2adc0e7e-269f-498d-b1d9-0e46e47857d1'::uuid, 'noun', 'do the cooking', 'the cooking', 7, array['🧭 Do: jobs & chores at home']::text[], 'cooking'),
('2adc0e7e-269f-498d-b1d9-0e46e47857d1'::uuid, 'noun', 'do your homework', 'your homework', 8, array['🧭 Do: school & work']::text[], 'homework'),
('2adc0e7e-269f-498d-b1d9-0e46e47857d1'::uuid, 'noun', 'do a project', 'a project', 9, array['🧭 Do: school & work']::text[], 'project'),
('2adc0e7e-269f-498d-b1d9-0e46e47857d1'::uuid, 'noun', 'do research', 'research', 10, array['🧭 Do: school & work']::text[], 'research'),
('2adc0e7e-269f-498d-b1d9-0e46e47857d1'::uuid, 'noun', 'do your job', 'your job', 11, array['🧭 Do: school & work']::text[], 'job'),
('2adc0e7e-269f-498d-b1d9-0e46e47857d1'::uuid, 'noun', 'do business', 'business', 12, array['🧭 Do: school & work']::text[], 'business'),
('2adc0e7e-269f-498d-b1d9-0e46e47857d1'::uuid, 'noun', 'do a course', 'a course', 13, array['🧭 Do: school & work']::text[], 'course'),
('2adc0e7e-269f-498d-b1d9-0e46e47857d1'::uuid, 'noun', 'do your best', 'your best', 14, array['🧭 Do: helping, harm & effort']::text[], 'best'),
('2adc0e7e-269f-498d-b1d9-0e46e47857d1'::uuid, 'noun', 'do a favour', 'a favour', 15, array['🧭 Do: helping, harm & effort']::text[], 'favour'),
('2adc0e7e-269f-498d-b1d9-0e46e47857d1'::uuid, 'noun', 'do good', 'good', 16, array['🧭 Do: helping, harm & effort']::text[], 'good'),
('2adc0e7e-269f-498d-b1d9-0e46e47857d1'::uuid, 'noun', 'do harm', 'harm', 17, array['🧭 Do: helping, harm & effort']::text[], 'harm'),
('2adc0e7e-269f-498d-b1d9-0e46e47857d1'::uuid, 'noun', 'do damage', 'damage', 18, array['🧭 Do: helping, harm & effort']::text[], 'damage'),
('2adc0e7e-269f-498d-b1d9-0e46e47857d1'::uuid, 'noun', 'do the right thing', 'the right thing', 19, array['🧭 Do: helping, harm & effort']::text[], 'right thing'),
('2adc0e7e-269f-498d-b1d9-0e46e47857d1'::uuid, 'noun', 'do exercise', 'exercise', 20, array['🧭 Do: body & sport']::text[], 'exercise'),
('2adc0e7e-269f-498d-b1d9-0e46e47857d1'::uuid, 'noun', 'do yoga', 'yoga', 21, array['🧭 Do: body & sport']::text[], 'yoga'),
('2adc0e7e-269f-498d-b1d9-0e46e47857d1'::uuid, 'noun', 'do your hair', 'your hair', 22, array['🧭 Do: body & sport']::text[], 'hair'),
('2adc0e7e-269f-498d-b1d9-0e46e47857d1'::uuid, 'noun', 'do your nails', 'your nails', 23, array['🧭 Do: body & sport']::text[], 'nails'),
('2adc0e7e-269f-498d-b1d9-0e46e47857d1'::uuid, 'noun', 'do something', 'something', 24, array['🧭 Do: something, nothing, anything']::text[], 'something'),
('2adc0e7e-269f-498d-b1d9-0e46e47857d1'::uuid, 'noun', 'do nothing', 'nothing', 25, array['🧭 Do: something, nothing, anything']::text[], 'nothing'),
('2adc0e7e-269f-498d-b1d9-0e46e47857d1'::uuid, 'noun', 'do anything', 'anything', 26, array['🧭 Do: something, nothing, anything']::text[], 'anything'),
('2adc0e7e-269f-498d-b1d9-0e46e47857d1'::uuid, 'noun', 'do everything', 'everything', 27, array['🧭 Do: something, nothing, anything']::text[], 'everything'),
('ce45e590-e2ad-481f-b740-c1a6fa05f45b'::uuid, 'noun', 'make a cake', 'a cake', 1, array['🧭 Make: something new (create, build, cook)']::text[], 'cake'),
('ce45e590-e2ad-481f-b740-c1a6fa05f45b'::uuid, 'noun', 'make dinner', 'dinner', 2, array['🧭 Make: something new (create, build, cook)','⚠️ Careful: make dinner, but do the cooking']::text[], 'dinner'),
('ce45e590-e2ad-481f-b740-c1a6fa05f45b'::uuid, 'noun', 'make a sandwich', 'a sandwich', 3, array['🧭 Make: something new (create, build, cook)']::text[], 'sandwich'),
('ce45e590-e2ad-481f-b740-c1a6fa05f45b'::uuid, 'noun', 'make tea', 'tea', 4, array['🧭 Make: something new (create, build, cook)']::text[], 'tea'),
('ce45e590-e2ad-481f-b740-c1a6fa05f45b'::uuid, 'noun', 'make a model', 'a model', 5, array['🧭 Make: something new (create, build, cook)']::text[], 'model'),
('ce45e590-e2ad-481f-b740-c1a6fa05f45b'::uuid, 'noun', 'make a list', 'a list', 6, array['🧭 Make: something new (create, build, cook)']::text[], 'list'),
('ce45e590-e2ad-481f-b740-c1a6fa05f45b'::uuid, 'noun', 'make a plan', 'a plan', 7, array['🧭 Make: something new (create, build, cook)']::text[], 'plan'),
('ce45e590-e2ad-481f-b740-c1a6fa05f45b'::uuid, 'noun', 'make a film', 'a film', 8, array['🧭 Make: something new (create, build, cook)']::text[], 'film'),
('ce45e590-e2ad-481f-b740-c1a6fa05f45b'::uuid, 'noun', 'make a noise', 'a noise', 9, array['🧭 Make: sounds & words']::text[], 'noise'),
('ce45e590-e2ad-481f-b740-c1a6fa05f45b'::uuid, 'noun', 'make a speech', 'a speech', 10, array['🧭 Make: sounds & words']::text[], 'speech'),
('ce45e590-e2ad-481f-b740-c1a6fa05f45b'::uuid, 'noun', 'make a phone call', 'a phone call', 11, array['🧭 Make: sounds & words']::text[], 'phone call'),
('ce45e590-e2ad-481f-b740-c1a6fa05f45b'::uuid, 'noun', 'make a joke', 'a joke', 12, array['🧭 Make: sounds & words']::text[], 'joke'),
('ce45e590-e2ad-481f-b740-c1a6fa05f45b'::uuid, 'noun', 'make a comment', 'a comment', 13, array['🧭 Make: sounds & words']::text[], 'comment'),
('ce45e590-e2ad-481f-b740-c1a6fa05f45b'::uuid, 'noun', 'make a complaint', 'a complaint', 14, array['🧭 Make: sounds & words']::text[], 'complaint'),
('ce45e590-e2ad-481f-b740-c1a6fa05f45b'::uuid, 'noun', 'make an excuse', 'an excuse', 15, array['🧭 Make: sounds & words']::text[], 'excuse'),
('ce45e590-e2ad-481f-b740-c1a6fa05f45b'::uuid, 'noun', 'make a suggestion', 'a suggestion', 16, array['🧭 Make: sounds & words']::text[], 'suggestion'),
('ce45e590-e2ad-481f-b740-c1a6fa05f45b'::uuid, 'noun', 'make a promise', 'a promise', 17, array['🧭 Make: sounds & words']::text[], 'promise'),
('ce45e590-e2ad-481f-b740-c1a6fa05f45b'::uuid, 'noun', 'make a decision', 'a decision', 18, array['🧭 Make: choices & changes']::text[], 'decision'),
('ce45e590-e2ad-481f-b740-c1a6fa05f45b'::uuid, 'noun', 'make a choice', 'a choice', 19, array['🧭 Make: choices & changes']::text[], 'choice'),
('ce45e590-e2ad-481f-b740-c1a6fa05f45b'::uuid, 'noun', 'make a change', 'a change', 20, array['🧭 Make: choices & changes']::text[], 'change'),
('ce45e590-e2ad-481f-b740-c1a6fa05f45b'::uuid, 'noun', 'make a difference', 'a difference', 21, array['🧭 Make: choices & changes']::text[], 'difference'),
('ce45e590-e2ad-481f-b740-c1a6fa05f45b'::uuid, 'noun', 'make progress', 'progress', 22, array['🧭 Make: choices & changes']::text[], 'progress'),
('ce45e590-e2ad-481f-b740-c1a6fa05f45b'::uuid, 'noun', 'make an effort', 'an effort', 23, array['🧭 Make: choices & changes']::text[], 'effort'),
('ce45e590-e2ad-481f-b740-c1a6fa05f45b'::uuid, 'noun', 'make sure', 'sure', 24, array['🧭 Make: choices & changes']::text[], 'sure'),
('ce45e590-e2ad-481f-b740-c1a6fa05f45b'::uuid, 'noun', 'make a mistake', 'a mistake', 25, array['🧭 Make: results & feelings']::text[], 'mistake'),
('ce45e590-e2ad-481f-b740-c1a6fa05f45b'::uuid, 'noun', 'make a mess', 'a mess', 26, array['🧭 Make: results & feelings']::text[], 'mess'),
('ce45e590-e2ad-481f-b740-c1a6fa05f45b'::uuid, 'noun', 'make money', 'money', 27, array['🧭 Make: results & feelings']::text[], 'money'),
('ce45e590-e2ad-481f-b740-c1a6fa05f45b'::uuid, 'noun', 'make friends', 'friends', 28, array['🧭 Make: results & feelings']::text[], 'friends'),
('ce45e590-e2ad-481f-b740-c1a6fa05f45b'::uuid, 'noun', 'make peace', 'peace', 29, array['🧭 Make: results & feelings']::text[], 'peace'),
('ce45e590-e2ad-481f-b740-c1a6fa05f45b'::uuid, 'noun', 'make someone laugh', 'someone laugh', 30, array['🧭 Make: results & feelings']::text[], 'laugh'),
('ce45e590-e2ad-481f-b740-c1a6fa05f45b'::uuid, 'noun', 'make someone happy', 'someone happy', 31, array['🧭 Make: results & feelings']::text[], 'happy'),
('ce45e590-e2ad-481f-b740-c1a6fa05f45b'::uuid, 'noun', 'make your bed', 'your bed', 32, array['🧭 Make: the exception (a home chore, but MAKE)','⚠️ Exception']::text[], 'bed')
) as v(w, k, ph, pa, pos, tg, noun)
where exists (select 1 from public.words y where y.id = v.w)
on conflict (word_id, lower(phrase)) do update set kind = excluded.kind, partner = excluded.partner, position = excluded.position, tags = excluded.tags,
  partner_word_id = coalesce(excluded.partner_word_id, word_partners.partner_word_id);
update public.words set meaning = 'To carry out an action, a job or a chore (do the dishes, do your homework). Rule: DO for activities and jobs; MAKE when something new is created.' where id = '2adc0e7e-269f-498d-b1d9-0e46e47857d1';
update public.words set meaning = 'To create or produce something that wasn''t there before (make a cake, make a decision, make a noise). Rule: MAKE when something new comes out; DO for activities and jobs. Exception: make your bed.' where id = 'ce45e590-e2ad-481f-b740-c1a6fa05f45b';
select (select count(*) from public.word_partners where word_id = '2adc0e7e-269f-498d-b1d9-0e46e47857d1') as do_partners, (select count(*) from public.word_partners where word_id = 'ce45e590-e2ad-481f-b740-c1a6fa05f45b') as make_partners,
       (select count(*) from public.word_partners where word_id in ('2adc0e7e-269f-498d-b1d9-0e46e47857d1', 'ce45e590-e2ad-481f-b740-c1a6fa05f45b') and partner_word_id is not null) as linked_to_words;
