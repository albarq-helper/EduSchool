-- =====================================================================
-- Helper Academy — v44: which picture views a student can use (v44b adds the thermometer)
--   * profiles.view_prefs: {"meters": ["arc","dial","bar"], "meterDefault": "auto"|"arc"|"dial"|"bar", "words": ["wheel","venn"]}
--     (empty = everything on, the meter look chosen by age)
--   * set_student_view_prefs(student, prefs): the student's teacher or parent sets them
-- Safe to re-run. Run AFTER v43.
-- =====================================================================
alter table public.profiles add column if not exists view_prefs jsonb not null default '{}'::jsonb;
alter table public.profiles drop constraint if exists profiles_view_prefs_check;
alter table public.profiles add constraint profiles_view_prefs_check check (jsonb_typeof(view_prefs) = 'object' and length(view_prefs::text) <= 500);

create or replace function public.set_student_view_prefs(p_student uuid, p_prefs jsonb) returns void language plpgsql security definer set search_path = public as $$
declare v jsonb;
begin
  if not (p_student = auth.uid() or public.teaches(p_student) or exists (select 1 from profiles where id = auth.uid() and is_admin)) then
    raise exception 'Only this student''s teacher or parent can change the views.'; end if;
  if jsonb_typeof(p_prefs) <> 'object' then raise exception 'Bad settings.'; end if;
  -- keep only the known settings and values
  v := jsonb_build_object(
    'meters', coalesce((select jsonb_agg(x) from jsonb_array_elements_text(coalesce(p_prefs->'meters', '[]')) x where x in ('arc','dial','thermo','bar')), '[]'::jsonb),
    'meterDefault', case when p_prefs->>'meterDefault' in ('auto','arc','dial','thermo','bar') then p_prefs->>'meterDefault' else 'auto' end,
    'words', coalesce((select jsonb_agg(x) from jsonb_array_elements_text(coalesce(p_prefs->'words', '[]')) x where x in ('wheel','venn')), '[]'::jsonb));
  if jsonb_array_length(v->'meters') = 0 then v := jsonb_set(v, '{meters}', '["arc","dial","thermo","bar"]'); end if;
  update profiles set view_prefs = v where id = p_student;
end $$;
grant execute on function public.set_student_view_prefs(uuid, jsonb) to authenticated;

select count(*) as profiles, count(*) filter (where view_prefs <> '{}'::jsonb) as with_view_prefs from public.profiles;
