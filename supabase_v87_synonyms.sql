-- =====================================================================
-- Helper Academy — v87: synonyms live in the dictionary (same meaning, English)
--
--   words.synonym_key        words with the SAME key mean the same thing (behead, decapitate → 'behead'); one column, no extra table
--   link_synonyms(head, syns)   internal: puts a word and its synonyms into one group; a synonym that is not in the dictionary yet is ADDED
--                               (tag 'added-synonym', empty meaning, to be filled later); groups that overlap are merged
--   set_synonyms(p)          parent saves a batch: [{word: 'Behead', synonyms: ['decapitate']}]
--   word_synonyms (view)     for every word, the other words of its group
--
--   Roots (décapiter ≈ decapitate, same ORIGIN) are a different link and stay in root_key. Safe to re-run. Run AFTER v86.
-- =====================================================================
alter table public.words add column if not exists synonym_key text;
create index if not exists words_synonym_key on public.words (synonym_key) where synonym_key is not null;

create or replace function public.link_synonyms(p_head text, p_syns text[]) returns int
language plpgsql security definer set search_path = public as $$
declare ids uuid[] := '{}'; k text; keys text[] := '{}'; w text; i uuid; n int := 0; key text;
begin
  select id, synonym_key into i, k from words where lang = 'en' and lower(headword) = lower(btrim(p_head)) order by sense limit 1;
  if i is null then return 0; end if;
  ids := ids || i; if k is not null then keys := keys || k; end if;
  foreach w in array p_syns loop
    w := btrim(w); continue when w = '';
    i := null; k := null;
    select id, synonym_key into i, k from words where lang = 'en' and lower(headword) = lower(w) order by sense limit 1;
    if i is null then
      insert into words (lang, headword, tags) values ('en', upper(left(w, 1)) || substr(w, 2), array['added-synonym'])
        on conflict do nothing returning id into i;
      if i is null then select id, synonym_key into i, k from words where lang = 'en' and lower(headword) = lower(w) order by sense limit 1; end if;
    end if;
    if i is not null then ids := ids || i; if k is not null then keys := keys || k; end if; n := n + 1; end if;
  end loop;
  key := coalesce((select min(x) from unnest(keys) x), lower(btrim(p_head)));
  update words set synonym_key = key where id = any(ids) or (synonym_key is not null and synonym_key = any(keys));
  return n;
end $$;
revoke all on function public.link_synonyms(text, text[]) from public;

create or replace function public.set_synonyms(p jsonb) returns int
language plpgsql security definer set search_path = public as $$
declare r jsonb; n int := 0;
begin
  if not (is_admin() or exists (select 1 from profiles where id = auth.uid() and role = 'teacher')) then raise exception 'parents only'; end if;
  if jsonb_array_length(p) > 300 then raise exception 'at most 300 per call'; end if;
  for r in select * from jsonb_array_elements(p) loop
    n := n + link_synonyms(r->>'word', array(select jsonb_array_elements_text(r->'synonyms')));
  end loop;
  return n;
end $$;
revoke all on function public.set_synonyms(jsonb) from public;
grant execute on function public.set_synonyms(jsonb) to authenticated;

create or replace view public.word_synonyms with (security_invoker = true) as
  select a.id as word_id, b.id as synonym_id, b.headword as synonym
  from public.words a join public.words b on b.synonym_key = a.synonym_key and b.id <> a.id
  where a.synonym_key is not null and a.lang = 'en' and b.lang = 'en';
