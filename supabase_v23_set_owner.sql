-- =====================================================================
-- Helper Academy — v23: the parent account owns the Grade 5 set and "English for Ab",
-- so it can edit them (including word groups) in the set editor. Visibility does not change:
-- the Grade 5 set stays public, so the student sees it exactly as before.
-- Run AFTER supabase_v22_word_groups.sql (safe to run more than once).
-- =====================================================================
update public.study_sets s set owner_id = p.id
from public.profiles p join auth.users u on u.id = p.id
where u.email = 'albarq2000@hotmail.com'
  and s.id in ('00000000-0000-4000-8000-000000000005', '00000000-0000-4000-8000-0000000000ab');

select s.title, p.full_name as owner, s.visibility from public.study_sets s left join public.profiles p on p.id = s.owner_id
where s.id in ('00000000-0000-4000-8000-000000000005', '00000000-0000-4000-8000-0000000000ab');
