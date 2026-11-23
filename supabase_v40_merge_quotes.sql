-- =====================================================================
-- Helper Academy — v40: Famous Sayings merged into Life Quotes → one set "Quotes & Sayings"
--   * the 35 famous sayings move into set ...9007 as unit 7 "Famous Sayings" (2 were already in it)
--   * the old Famous Sayings set (...5a1d) is removed (nothing was assigned to it, no attempts or stories)
--   * quote_review() keeps working (it reads the merged set)
-- Safe to re-run. Run AFTER v39.
-- =====================================================================
update public.study_sets
   set title = 'Quotes & Sayings',
       description = 'Famous sayings and short life lessons, many with the narrator''s voice. Tap to hear each one.',
       units = (select jsonb_agg(u) from (
                  select u from jsonb_array_elements(units) u where (u->>'u')::int <> 7
                  union all select '{"u":7,"name":"Famous Sayings"}'::jsonb) x)
 where id = '00000000-0000-4000-8000-000000009007';

-- sayings already in the merged set: drop the old link
delete from public.set_entries f
 where f.set_id = '00000000-0000-4000-8000-000000005a1d'
   and exists (select 1 from public.set_entries l where l.set_id = '00000000-0000-4000-8000-000000009007' and l.word_id = f.word_id);

-- the rest move over, keeping their order, after the life quotes
update public.set_entries f
   set set_id = '00000000-0000-4000-8000-000000009007', unit = 7, also_units = '{}',
       position = 1000 + f.position
 where f.set_id = '00000000-0000-4000-8000-000000005a1d';

delete from public.study_sets where id = '00000000-0000-4000-8000-000000005a1d';

-- check
select (select title from public.study_sets where id = '00000000-0000-4000-8000-000000009007') as set_title,
       (select count(*) from public.set_entries where set_id = '00000000-0000-4000-8000-000000009007') as quotes,
       (select count(*) from public.set_entries where set_id = '00000000-0000-4000-8000-000000009007' and unit = 7) as famous,
       (select count(*) from public.study_sets where id = '00000000-0000-4000-8000-000000005a1d') as old_set_left;
