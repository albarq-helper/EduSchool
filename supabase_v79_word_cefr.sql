-- v79: the parent's "Word levels" button adds a CEFR tag (A1–C2) to dictionary words.
-- Only adds "CEFR: X" to words that have no CEFR tag yet; nothing else in the word changes.
create or replace function public.set_word_cefr(p jsonb) returns int
language plpgsql security definer set search_path = public as $$
declare n int := 0; r record;
begin
  if not exists (select 1 from profiles where id = auth.uid() and role = 'teacher') and not public.is_admin() then
    raise exception 'Only the parent account can tag word levels';
  end if;
  for r in select (e->>'id')::uuid as id, upper(e->>'level') as lv from jsonb_array_elements(p) e loop
    if r.lv in ('A1','A2','B1','B2','C1','C2') then
      update words set tags = coalesce(tags,'{}') || array['CEFR: '||r.lv]
       where id = r.id and not exists (select 1 from unnest(coalesce(tags,'{}')) t where t like 'CEFR: %');
      if found then n := n + 1; end if;
    end if;
  end loop;
  return n;
end $$;
revoke all on function public.set_word_cefr(jsonb) from public, anon;
grant execute on function public.set_word_cefr(jsonb) to authenticated;
select 'set_word_cefr' as fn, count(*) filter (where exists (select 1 from unnest(tags) t where t like 'CEFR: %')) as tagged, count(*) as words from public.words where lang='en';
