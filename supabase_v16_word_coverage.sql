-- =====================================================================
-- Helper Academy — v16: which words appear in each song / dialog (filled in automatically)
-- Run AFTER supabase_v15_dialogs.sql (safe to run more than once).
--
-- set_song_words lists ONLY the words that are there (song/dialog + word + how many times + first time).
-- It is refreshed automatically whenever lyrics/transcripts or words change.
-- Missing words come from a query (the word_coverage view below).
--
-- Handy queries (Grade 5 set):
--   -- every word with its status
--   select unit, term, status, songs, dialogs from word_coverage
--   where set_id = '00000000-0000-4000-8000-000000000005' order by unit, position;
--   -- what is missing in Unit 4
--   select term from word_coverage where set_id = '00000000-0000-4000-8000-000000000005'
--     and (unit = 4 or 4 = any(also_units)) and status = 'missing' order by position;
--   -- totals per unit
--   select * from unit_word_coverage where set_id = '00000000-0000-4000-8000-000000000005' order by unit;
-- =====================================================================

-- How a term is found in text: the word itself, or its base with common endings
-- (insist -> insisted, molt -> molting, reside -> resides, species, harvester ...).
create or replace function public.term_pattern(p_term text)
returns text language plpgsql immutable as $$
declare t text; b text;
  esc constant text := '([.*+?^${}()|\[\]\\])';
begin
  t := lower(trim(regexp_replace(p_term, '\s*\(.*\)\s*', '', 'g')));
  b := regexp_replace(t, '(ing|ies|ied|ed|es|ly|s|e|y)$', '');
  if length(b) < 4 then b := t; end if;
  return '(^|[^a-z])(' || regexp_replace(t, esc, '\\\1', 'g') || '|' || regexp_replace(b, esc, '\\\1', 'g')
      || '(e|s|es|d|ed|ing|y|ies|ied|ly|er|ers)?)($|[^a-z])';
end $$;

create table if not exists public.set_song_words (
  song_id  uuid not null references public.set_songs(id) on delete cascade,
  item_id  uuid not null references public.set_items(id) on delete cascade,
  set_id   uuid not null references public.study_sets(id) on delete cascade,
  mentions int  not null default 1,
  first_t  numeric,
  primary key (song_id, item_id)
);
create index if not exists set_song_words_item_idx on public.set_song_words (item_id);
create index if not exists set_song_words_set_idx on public.set_song_words (set_id);
alter table public.set_song_words enable row level security;
drop policy if exists "read song words of visible sets" on public.set_song_words;
create policy "read song words of visible sets" on public.set_song_words for select to authenticated using (public.can_view_set(set_id));
-- no insert/update/delete policies: only the functions below write it

create or replace function public.refresh_song_words(p_song uuid)
returns int language plpgsql security definer set search_path = public as $$
declare n int;
begin
  delete from set_song_words where song_id = p_song;
  insert into set_song_words (song_id, item_id, set_id, mentions, first_t)
  select s.id, i.id, s.set_id,
         sum(regexp_count(lower(e->>'l'), term_pattern(i.term)))::int,
         min(nullif(e->>'t', '')::numeric)
  from set_songs s
  join set_items i on i.set_id = s.set_id
  cross join lateral jsonb_array_elements(s.lines) e
  where s.id = p_song and lower(coalesce(e->>'l', '')) ~ term_pattern(i.term)
  group by s.id, i.id, s.set_id;
  get diagnostics n = row_count;
  return n;
end $$;

create or replace function public.refresh_set_words(p_set uuid)
returns int language plpgsql security definer set search_path = public as $$
declare s record; n int := 0;
begin
  if auth.uid() is not null and not owns_set(p_set) then raise exception 'Only the owner can refresh this set'; end if;
  for s in select id from set_songs where set_id = p_set loop n := n + refresh_song_words(s.id); end loop;
  return n;
end $$;
revoke all on function public.refresh_song_words(uuid) from public, anon, authenticated;
grant execute on function public.refresh_set_words(uuid) to authenticated;

-- keep it up to date automatically
create or replace function public.trg_song_words() returns trigger language plpgsql security definer set search_path = public as $$
begin perform refresh_song_words(new.id); return null; end $$;
drop trigger if exists song_words_refresh on public.set_songs;
create trigger song_words_refresh after insert or update of lines on public.set_songs
  for each row execute function public.trg_song_words();

create or replace function public.trg_item_words() returns trigger language plpgsql security definer set search_path = public as $$
declare s record;
begin
  for s in select distinct so.id from set_songs so where so.set_id in (select distinct set_id from changed) loop
    perform refresh_song_words(s.id);
  end loop;
  return null;
end $$;
drop trigger if exists item_words_ins on public.set_items;
drop trigger if exists item_words_upd on public.set_items;
create trigger item_words_ins after insert on public.set_items referencing new table as changed
  for each statement execute function public.trg_item_words();
create or replace function public.trg_item_words_row() returns trigger language plpgsql security definer set search_path = public as $$
declare s record;
begin
  for s in select id from set_songs where set_id = new.set_id loop perform refresh_song_words(s.id); end loop;
  return null;
end $$;
create trigger item_words_upd after update of term on public.set_items
  for each row when (old.term is distinct from new.term) execute function public.trg_item_words_row();

-- every word, with where it shows up (or 'missing')
create or replace view public.word_coverage with (security_invoker = on) as
select i.set_id, i.id as item_id, i.term, i.unit, i.also_units, i.position,
  count(s.id) filter (where s.kind = 'song')::int   as songs,
  count(s.id) filter (where s.kind = 'dialog')::int as dialogs,
  coalesce(bool_or((array[s.unit] || s.also_units) && (array[i.unit] || i.also_units)), false) as in_own_unit,
  coalesce(jsonb_agg(jsonb_build_object('song_id', s.id, 'title', s.title, 'kind', s.kind, 'unit', s.unit,
      'also_units', s.also_units, 'mentions', w.mentions, 't', w.first_t) order by s.unit, s.position)
    filter (where s.id is not null), '[]'::jsonb) as sources,
  case when count(s.id) > 0 then 'showing' else 'missing' end as status
from set_items i
left join set_song_words w on w.item_id = i.id
left join set_songs s on s.id = w.song_id
group by i.set_id, i.id, i.term, i.unit, i.also_units, i.position;

-- totals per unit (a word counts for its own unit and any extra units)
create or replace view public.unit_word_coverage with (security_invoker = on) as
select c.set_id, u.unit,
  count(*)::int as words,
  count(*) filter (where c.status = 'showing')::int as showing,
  count(*) filter (where c.status = 'missing')::int as missing,
  string_agg(c.term, ', ' order by c.position) filter (where c.status = 'missing') as missing_words
from word_coverage c
cross join lateral unnest(array[c.unit] || c.also_units) as u(unit)
group by c.set_id, u.unit;

grant select on public.word_coverage, public.unit_word_coverage to authenticated;

-- fill it now for every song and dialog
select count(*) as links from (select public.refresh_song_words(id) from public.set_songs) x;
select unit, words, showing, missing, missing_words from public.unit_word_coverage
where set_id = '00000000-0000-4000-8000-000000000005' order by unit;
