-- =====================================================================
-- Helper Academy — v86: 🌱 root origin lives IN the dictionary (no separate look-alike tables)
--
--   words.root_key               the root family an English dictionary word belongs to ('caput' for decapitate)
--   word_translations.root_key   the same root, on the foreign word ('caput' for décapiter)  → one root links words across languages
--   word_translations.root_en    the English word the foreign word looks like (décapiter → decapitate)
--   word_translations.root_sim   0-100, ALWAYS computed by the database from term and root_en (kept for pointing and grouping, never shown)
--   word_translations.root_kind  'cognate' (same meaning) or 'false_friend' (looks alike, means something else), root_note says why
--   word_family (view)           every member of a root family in every language: English words and foreign words side by side
--   set_word_roots(p)            parent saves a batch: [{word_id, lang, root, en, kind, note}]
--
--   Synonyms (behead = decapitate: same meaning) stay in the existing word groups; roots are a different link (same origin).
--   The v85 tables (word_cognates, cognate_groups) are migrated into these columns and removed. Safe to re-run. Run AFTER v85/v85b.
-- =====================================================================

-- the one similarity formula (from v85; kept)
create or replace function public.cognate_norm(t text) returns text language sql immutable as $$
  select regexp_replace(translate(lower(coalesce(t, '')), 'áàâäãåāéèêëēíìîïīóòôöõōúùûüūçñýÿœæß', 'aaaaaaaeeeeeiiiiiooooouuuuucnyyoas'), '[^a-z]', '', 'g') $$;
create or replace function public.cognate_distance(a text, b text) returns int language plpgsql immutable as $$
declare la int := length(a); lb int := length(b); prev int[]; cur int[]; i int; j int; cost int;
begin
  if la = 0 then return lb; end if; if lb = 0 then return la; end if;
  prev := array(select generate_series(0, lb));
  for i in 1..la loop
    cur := array[i];
    for j in 1..lb loop
      cost := case when substr(a, i, 1) = substr(b, j, 1) then 0 else 1 end;
      cur[j + 1] := least(prev[j + 1] + 1, cur[j] + 1, prev[j] + cost);
    end loop;
    prev := cur;
  end loop;
  return prev[lb + 1];
end $$;
create or replace function public.cognate_similarity(a text, b text) returns int language sql immutable as $$
  select case when length(cognate_norm(a)) = 0 or length(cognate_norm(b)) = 0 then 0
    else greatest(0, round(100.0 * (1 - cognate_distance(cognate_norm(a), cognate_norm(b))::numeric / greatest(length(cognate_norm(a)), length(cognate_norm(b)))))::int) end $$;

-- 1) the columns --------------------------------------------------------------------------------------------------
alter table public.words add column if not exists root_key text;
alter table public.word_translations
  add column if not exists root_key text,
  add column if not exists root_en text,
  add column if not exists root_sim int check (root_sim between 0 and 100),
  add column if not exists root_kind text not null default 'cognate' check (root_kind in ('cognate', 'false_friend')),
  add column if not exists root_note text not null default '';
create index if not exists words_root on public.words (root_key) where root_key is not null;
create index if not exists word_translations_root on public.word_translations (root_key) where root_key is not null;

create or replace function public.word_translations_root_sim() returns trigger language plpgsql as $$
begin
  new.root_sim := case when coalesce(btrim(new.root_en), '') = '' then null else cognate_similarity(new.term, new.root_en) end;
  return new;
end $$;
drop trigger if exists word_translations_root_sim on public.word_translations;
create trigger word_translations_root_sim before insert or update of term, root_en on public.word_translations
  for each row execute function public.word_translations_root_sim();

-- 2) bring over what v85 saved, then retire its tables -------------------------------------------------------------
do $$
begin
  if to_regclass('public.word_cognates') is not null then
    update public.word_translations t
       set root_key = c.key, root_en = c.en_word, root_kind = c.kind, root_note = c.note
      from (select distinct on (x.word_id, x.lang) x.word_id, x.lang, g.key, x.en_word, x.kind, x.note
              from public.word_cognates x left join public.cognate_groups g on g.id = x.group_id
             order by x.word_id, x.lang, x.similarity desc) c
     where t.word_id = c.word_id and t.lang = c.lang;
  end if;
end $$;
update public.words w set root_key = t.root_key
  from public.word_translations t
 where t.root_key is not null and t.root_kind = 'cognate' and coalesce(t.root_en, '') <> ''
   and w.lang = 'en' and lower(w.headword) = lower(t.root_en) and w.root_key is null;
drop view if exists public.cognate_family;
drop function if exists public.set_cognates(jsonb, text);
drop table if exists public.word_cognates;
drop table if exists public.cognate_groups;

-- 3) one view: everybody who shares a root -------------------------------------------------------------------------
create or replace view public.word_family with (security_invoker = true) as
  select root_key, 'en'::text as lang, headword as term, id as word_id from public.words where root_key is not null
  union all
  select root_key, lang, term, word_id from public.word_translations where root_key is not null and root_kind = 'cognate';

-- 4) the parent saves a batch: [{word_id, lang, root, en, kind, note}] ----------------------------------------------
create or replace function public.set_word_roots(p jsonb) returns int
language plpgsql security definer set search_path = public as $$
declare r jsonb; n int := 0;
begin
  if not (is_admin() or exists (select 1 from profiles where id = auth.uid() and role = 'teacher')) then raise exception 'parents only'; end if;
  if jsonb_array_length(p) > 400 then raise exception 'at most 400 per call'; end if;
  for r in select * from jsonb_array_elements(p) loop
    update word_translations
       set root_key = nullif(lower(btrim(r->>'root')), ''), root_en = nullif(btrim(r->>'en'), ''),
           root_kind = coalesce(nullif(r->>'kind', ''), 'cognate'), root_note = coalesce(r->>'note', '')
     where word_id = (r->>'word_id')::uuid and lang = r->>'lang';
    if found then
      n := n + 1;
      if coalesce(r->>'kind', 'cognate') = 'cognate' and coalesce(r->>'en', '') <> '' and coalesce(r->>'root', '') <> '' then
        update words set root_key = lower(btrim(r->>'root')) where lang = 'en' and lower(headword) = lower(r->>'en') and root_key is null;
      end if;
    end if;
  end loop;
  return n;
end $$;
revoke all on function public.set_word_roots(jsonb) from public;
grant execute on function public.set_word_roots(jsonb) to authenticated;
