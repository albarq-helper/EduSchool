-- v80: 🧩 real word parts + 💡 memory tricks on dictionary words
-- word_parts: the real pieces ("be + stow"); origin_note: what they meant and how that became the meaning;
-- memory_trick: a fun hook to remember it, clearly separate from the real history ('-' = this word doesn't need one)
alter table public.words add column if not exists word_parts text not null default '' check (length(word_parts) <= 120);
alter table public.words add column if not exists origin_note text not null default '' check (length(origin_note) <= 600);
alter table public.words add column if not exists memory_trick text not null default '' check (length(memory_trick) <= 400);

-- the parent's button saves tricks through this (only these three fields change)
create or replace function public.set_word_tricks(p jsonb) returns int
language plpgsql security definer set search_path = public as $$
declare n int := 0; r record;
begin
  if not exists (select 1 from profiles where id = auth.uid() and role = 'teacher') and not public.is_admin() then
    raise exception 'Only the parent account can save memory tricks';
  end if;
  for r in select (e->>'id')::uuid as id, left(coalesce(e->>'parts',''),120) as parts, left(coalesce(e->>'origin',''),600) as origin, left(coalesce(e->>'trick',''),400) as trick from jsonb_array_elements(p) e loop
    update words set word_parts = r.parts, origin_note = r.origin, memory_trick = case when r.trick = '' then '-' else r.trick end where id = r.id;
    if found then n := n + 1; end if;
  end loop;
  return n;
end $$;
revoke all on function public.set_word_tricks(jsonb) from public, anon;
grant execute on function public.set_word_tricks(jsonb) to authenticated;

-- the first one, from Ab's question
update public.words set word_parts = 'be + stow',
  origin_note = 'be- is an old prefix meaning "to put upon" (like befriend, belittle). stow means "to put in a place" (from Old English stōw, a place; you still stow a bag under a seat). So to bestow first meant "to place something on someone", which became "to give an honour or gift".',
  memory_trick = 'It looks like best + owed: the king gives the medal to the best person, the one he owed thanks to. (Just a trick: the real parts are be + stow.)'
where lang = 'en' and lower(headword) in ('bestowed','bestow');

select count(*) filter (where memory_trick <> '') as with_trick, count(*) as words from public.words where lang = 'en';
