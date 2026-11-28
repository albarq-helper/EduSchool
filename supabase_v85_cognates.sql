-- =====================================================================
-- Helper Academy — v85: 🧩 look-alike words across languages (cognates)
--
--   cognate_groups   one row per FAMILY: a shared root that many languages inherited
--                    (humid- → English humid / humidity, French humide, Spanish húmedo, Italian umido …)
--   word_cognates    one row per (English study word, language, look-alike):
--                      term        the foreign word the student is taught (French "humide")
--                      en_word     the English word it looks like ("humid"), which may be a different word from the study word
--                      group_id    the family it belongs to (all look-alikes of one root are bound together)
--                      kind        'cognate' (same meaning) or 'false_friend' (looks alike, means something else)
--                      similarity  0-100, ALWAYS computed by cognate_similarity(): the same formula for every language
--   cognate_similarity(a, b)     100 × (1 − edit distance ÷ longer word), accents and case ignored
--   set_cognates(p jsonb)        parent saves a batch; similarity is calculated by the database, never typed in
--   cognate_family               a view: every member of a family, with its language and similarity
--
--   Nothing is translated here. A new language (Spanish, Italian …) only needs rows in word_translations + word_cognates.
--   Safe to re-run. Run AFTER v84.
-- =====================================================================

-- 1) the one similarity formula ---------------------------------------------------------------------------------
create or replace function public.cognate_norm(t text) returns text
language sql immutable as $$
  select regexp_replace(
           translate(lower(coalesce(t, '')),
             'áàâäãåāéèêëēíìîïīóòôöõōúùûüūçñýÿœæß',
             'aaaaaaaeeeeeiiiiiooooouuuuucnyyoas'),
           '[^a-z]', '', 'g')
$$;

create or replace function public.cognate_distance(a text, b text) returns int
language plpgsql immutable as $$
declare
  la int := length(a); lb int := length(b);
  prev int[]; cur int[]; i int; j int; cost int;
begin
  if la = 0 then return lb; end if;
  if lb = 0 then return la; end if;
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

create or replace function public.cognate_similarity(a text, b text) returns int
language sql immutable as $$
  select case
    when length(cognate_norm(a)) = 0 or length(cognate_norm(b)) = 0 then 0
    else greatest(0, round(100.0 * (1 - cognate_distance(cognate_norm(a), cognate_norm(b))::numeric
                                      / greatest(length(cognate_norm(a)), length(cognate_norm(b)))))::int)
  end
$$;

-- 2) families + look-alikes -------------------------------------------------------------------------------------
create table if not exists public.cognate_groups (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,                 -- the shared root, e.g. 'humid'
  note text not null default '',            -- optional: where the root comes from (Latin humidus = wet)
  created_at timestamptz not null default now()
);

create table if not exists public.word_cognates (
  id uuid primary key default gen_random_uuid(),
  word_id uuid not null references public.words(id) on delete cascade,
  lang text not null references public.languages(code) on update cascade,
  term text not null,
  en_word text not null,
  en_word_id uuid references public.words(id) on delete set null,
  group_id uuid references public.cognate_groups(id) on delete set null,
  kind text not null default 'cognate' check (kind in ('cognate', 'false_friend')),
  similarity int not null default 0 check (similarity between 0 and 100),
  note text not null default '',
  status text not null default 'draft' check (status in ('draft', 'reviewed')),
  source text not null default 'ai',
  created_at timestamptz not null default now(),
  unique (word_id, lang, en_word)
);
create index if not exists word_cognates_word on public.word_cognates (word_id);
create index if not exists word_cognates_group on public.word_cognates (group_id);

-- the similarity can never be typed in: the database always works it out the same way
create or replace function public.word_cognates_sim() returns trigger
language plpgsql as $$
begin
  new.similarity := cognate_similarity(new.term, new.en_word);
  return new;
end $$;
drop trigger if exists word_cognates_sim on public.word_cognates;
create trigger word_cognates_sim before insert or update of term, en_word on public.word_cognates
  for each row execute function public.word_cognates_sim();

-- 3) who can see / change ---------------------------------------------------------------------------------------
alter table public.cognate_groups enable row level security;
alter table public.word_cognates enable row level security;
drop policy if exists cognate_groups_read on public.cognate_groups;
create policy cognate_groups_read on public.cognate_groups for select to authenticated using (true);
drop policy if exists word_cognates_read on public.word_cognates;
create policy word_cognates_read on public.word_cognates for select to authenticated using (true);
-- writes only through set_cognates below (security definer)

-- 4) the parent saves a batch: [{word_id, lang, en_word, group, kind, note, term?}] --------------------------------
create or replace function public.set_cognates(p jsonb, p_source text default 'ai') returns int
language plpgsql security definer set search_path = public as $$
declare r jsonb; n int := 0; g uuid; t text; ew uuid;
begin
  if not (is_admin() or exists (select 1 from profiles where id = auth.uid() and role = 'teacher')) then
    raise exception 'parents only';
  end if;
  if jsonb_array_length(p) > 400 then raise exception 'at most 400 per call'; end if;
  for r in select * from jsonb_array_elements(p) loop
    g := null;
    if coalesce(r->>'group', '') <> '' then
      insert into cognate_groups (key, note) values (lower(r->>'group'), coalesce(r->>'group_note', ''))
        on conflict (key) do update set note = case when excluded.note <> '' then excluded.note else cognate_groups.note end
        returning id into g;
    end if;
    t := coalesce(nullif(r->>'term', ''),
                  (select term from word_translations where word_id = (r->>'word_id')::uuid and lang = r->>'lang'));
    if t is null then continue; end if;
    select id into ew from words where lang = 'en' and lower(headword) = lower(r->>'en_word') order by sense limit 1;
    insert into word_cognates (word_id, lang, term, en_word, en_word_id, group_id, kind, note, source)
      values ((r->>'word_id')::uuid, r->>'lang', t, r->>'en_word', ew, g,
              coalesce(nullif(r->>'kind', ''), 'cognate'), coalesce(r->>'note', ''), p_source)
      on conflict (word_id, lang, en_word) do update
        set term = excluded.term, en_word_id = excluded.en_word_id, group_id = excluded.group_id,
            kind = excluded.kind, note = excluded.note
        where word_cognates.status <> 'reviewed';
    n := n + 1;
  end loop;
  return n;
end $$;
revoke all on function public.set_cognates(jsonb, text) from public;
grant execute on function public.set_cognates(jsonb, text) to authenticated;

-- 5) the family view --------------------------------------------------------------------------------------------
create or replace view public.cognate_family with (security_invoker = true) as
  select g.id as group_id, g.key as root, g.note as root_note,
         c.lang, c.term, c.en_word, c.kind, c.similarity, c.word_id
  from public.cognate_groups g join public.word_cognates c on c.group_id = g.id;
