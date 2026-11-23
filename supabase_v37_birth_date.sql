-- =====================================================================
-- Helper Academy — v37: a student's full birth date, for an exact age
--   * profiles.birth_date (the age turns over on the birthday itself); birth_year is kept in step
--   * viewer_age() uses the birth date when there is one
--   * set_student_birth_date(student, date): the student's teacher or parent sets it
--   * Reem: born 13 February 2016
-- Safe to re-run. Run AFTER v36.
-- =====================================================================
alter table public.profiles add column if not exists birth_date date check (birth_date between date '1900-01-01' and current_date);

create or replace function public.viewer_age() returns int language sql stable security definer set search_path = public as $$
  select case when auth.uid() is null then 0
              when exists (select 1 from profiles where id = auth.uid() and (role = 'teacher' or is_admin)) then 200
              else coalesce((select case when birth_date is not null then extract(year from age(current_date, birth_date))::int
                                         else extract(year from now())::int - birth_year end
                             from profiles where id = auth.uid()), 0) end
$$;

create or replace function public.set_student_birth_date(p_student uuid, p_date date) returns void language plpgsql security definer set search_path = public as $$
begin
  if p_date is not null and (p_date < date '1900-01-01' or p_date > current_date) then raise exception 'Please enter a real birth date.'; end if;
  if not (p_student = auth.uid() or public.teaches(p_student) or exists (select 1 from profiles where id = auth.uid() and is_admin)) then
    raise exception 'Only this student''s teacher or parent can set the birth date.'; end if;
  update profiles set birth_date = p_date, birth_year = extract(year from p_date)::int where id = p_student;
end $$;
grant execute on function public.set_student_birth_date(uuid, date) to authenticated;

-- Reem
update public.profiles set birth_date = date '2016-02-13', birth_year = 2016 where id = 'b31d1b74-2127-4df3-bdea-2e141188fdc2';

-- check: Reem's age as the site sees it
select p.full_name, p.birth_date, extract(year from age(current_date, p.birth_date))::int as age_today
from public.profiles p where p.id = 'b31d1b74-2127-4df3-bdea-2e141188fdc2';
