-- =====================================================================
-- Helper Academy — v26: one shared dictionary of words; sets only link to words
--
--   words        the dictionary: one row per word sense (meaning, syllables, clip, audio, emoji, groups…)
--   set_entries  a set's list: which word, which unit, which position (+ optional set-specific meaning/example)
--   set_items    a VIEW with the old shape (words joined to entries), so every page keeps working
--   save_set_items(set, rows, deleted)  the set editor's save: links words, updates the dictionary
--                when the editor may (word owner or admin), otherwise keeps the change for that set only
--
-- Run AFTER supabase_v25_word_boxes.sql. Runs in one transaction; safe to run more than once.
-- =====================================================================
begin;

-- safety copy of the words table exactly as it was (hidden from the site: RLS on, no policies)
do $$ begin
  if exists (select 1 from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relname = 'set_items' and c.relkind = 'r')
     and not exists (select 1 from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relname = '_backup_set_items_v26') then
    create table public._backup_set_items_v26 as select * from public.set_items;
    alter table public._backup_set_items_v26 enable row level security;
  end if;
end $$;

-- 0. views that depend on the old table
drop view if exists public.unit_word_coverage;
drop view if exists public.word_coverage;
do $$ begin   -- (the view only exists when re-running)
  if exists (select 1 from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relname = 'set_items' and c.relkind = 'v') then
    drop view public.set_items;
  end if;
end $$;

-- 1. the dictionary
create table if not exists public.words (
  id            uuid primary key default gen_random_uuid(),
  lang          text not null default 'en',
  headword      text not null check (length(trim(headword)) between 1 and 500),
  sense         text not null default '' check (length(sense) <= 120),
  meaning       text not null default '' check (length(meaning) <= 1500),
  example       text not null default '' check (length(example) <= 600),
  translation   text not null default '' check (length(translation) <= 300),
  syllables     text not null default '' check (length(syllables) <= 200),
  pronunciation text not null default '' check (length(pronunciation) <= 120),
  sound_hint    text not null default '' check (length(sound_hint) <= 300),
  image_url     text not null default '',
  anim_url      text not null default '',
  audio_url     text not null default '',
  video_url     text not null default '',
  emoji         text not null default '' check (length(emoji) <= 16),
  tags          text[] not null default '{}' check (cardinality(tags) <= 16),
  owner_id      uuid references public.profiles(id) on delete set null default auth.uid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create unique index if not exists words_unique_sense on public.words (lang, lower(headword), sense);
create index if not exists words_tags_idx on public.words using gin (tags);
alter table public.words enable row level security;
drop policy if exists "anyone reads the dictionary" on public.words;
create policy "anyone reads the dictionary" on public.words for select to anon, authenticated using (true);
drop policy if exists "word owner or admin edits" on public.words;
create policy "word owner or admin edits" on public.words for update to authenticated
  using (owner_id = auth.uid() or public.is_admin()) with check (owner_id = auth.uid() or public.is_admin());
grant select on public.words to anon, authenticated;
grant update on public.words to authenticated;

-- 2. the old table becomes the links table
do $$ begin
  if exists (select 1 from pg_class c join pg_namespace n on n.oid = c.relnamespace
             where n.nspname = 'public' and c.relname = 'set_items' and c.relkind = 'r') then
    alter table public.set_items rename to set_entries;
  end if;
end $$;
alter table public.set_entries add column if not exists word_id uuid references public.words(id) on delete restrict;
create index if not exists set_entries_word_idx on public.set_entries (word_id);
alter table public.set_entries
  alter column term drop not null, alter column term drop default,
  alter column meaning drop not null, alter column meaning drop default,
  alter column example drop not null, alter column example drop default,
  alter column translation drop not null, alter column translation drop default,
  alter column syllables drop not null, alter column syllables drop default,
  alter column image_url drop not null, alter column image_url drop default,
  alter column anim_url drop not null, alter column anim_url drop default,
  alter column audio_url drop not null, alter column audio_url drop default,
  alter column pronunciation drop not null, alter column pronunciation drop default,
  alter column sound_hint drop not null, alter column sound_hint drop default,
  alter column video_url drop not null, alter column video_url drop default,
  alter column emoji drop not null, alter column emoji drop default,
  alter column tags drop not null, alter column tags drop default;

-- 2b. the old shape, as a view (pages keep reading "set_items")
create view public.set_items with (security_invoker = on) as
select e.id, e.set_id, e.position, e.kind, e.unit, e.also_units,
       coalesce(e.term, w.headword) as term,
       coalesce(e.meaning, w.meaning, '') as meaning,
       coalesce(e.example, w.example, '') as example,
       coalesce(e.translation, w.translation, '') as translation,
       coalesce(e.syllables, w.syllables, '') as syllables,
       coalesce(e.image_url, w.image_url, '') as image_url,
       coalesce(e.anim_url, w.anim_url, '') as anim_url,
       coalesce(e.audio_url, w.audio_url, '') as audio_url,
       e.choices, e.answer, e.created_at,
       coalesce(e.pronunciation, w.pronunciation, '') as pronunciation,
       coalesce(e.sound_hint, w.sound_hint, '') as sound_hint,
       coalesce(e.video_url, w.video_url, '') as video_url,
       coalesce(e.emoji, w.emoji, '') as emoji,
       coalesce(e.tags, w.tags, '{}') as tags,
       e.word_id, coalesce(w.sense, '') as sense,
       (e.word_id is not null and e.meaning is not null) as set_meaning
from public.set_entries e left join public.words w on w.id = e.word_id;
grant select on public.set_items to anon, authenticated;

-- (pause the old table's triggers while content moves; counts and song coverage don't change)
alter table public.set_entries disable trigger user;

-- 3. move word content into the dictionary (merging the same word across sets)
with src as (
  select distinct on (coalesce(s.language, 'en'), lower(trim(e.term))) e.*, coalesce(s.language, 'en') as lang
  from public.set_entries e join public.study_sets s on s.id = e.set_id
  where e.kind = 'term' and e.word_id is null and e.term is not null
  order by coalesce(s.language, 'en'), lower(trim(e.term)),
           (coalesce(e.video_url, '') <> '') desc,      -- a word with a clip wins
           (e.set_id = '00000000-0000-4000-8000-00000000fee1') desc,                    -- then the Feelings wording (written for children)
           e.position
)
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, sound_hint,
                          image_url, anim_url, audio_url, video_url, emoji, tags, owner_id)
select src.lang, trim(src.term), '', coalesce(src.meaning, ''), coalesce(src.example, ''), coalesce(src.translation, ''),
       coalesce(src.syllables, ''), coalesce(src.pronunciation, ''), coalesce(src.sound_hint, ''),
       coalesce(src.image_url, ''), coalesce(src.anim_url, ''), coalesce(src.audio_url, ''), coalesce(src.video_url, ''),
       coalesce(nullif(src.emoji, ''), (select e2.emoji from public.set_entries e2 where e2.kind = 'term' and lower(trim(e2.term)) = lower(trim(src.term)) and coalesce(e2.emoji, '') <> '' limit 1), ''),
       array(select distinct t from public.set_entries e2, unnest(coalesce(e2.tags, '{}')) t where e2.kind = 'term' and lower(trim(e2.term)) = lower(trim(src.term))),
       (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')
from src
on conflict (lang, lower(headword), sense) do nothing;

update public.set_entries e set word_id = w.id
from public.study_sets s, public.words w
where s.id = e.set_id and e.kind = 'term' and e.word_id is null and e.term is not null
  and w.lang = coalesce(s.language, 'en') and lower(w.headword) = lower(trim(e.term)) and w.sense = '';

-- each link keeps only a set-specific meaning / example (where it differs); everything else comes from the dictionary
update public.set_entries e set
  meaning = case when coalesce(e.meaning, '') <> '' and e.meaning is distinct from w.meaning then e.meaning end,
  example = case when coalesce(e.example, '') <> '' and e.example is distinct from w.example then e.example end,
  term = null,
  translation = null,
  syllables = null,
  image_url = null,
  anim_url = null,
  audio_url = null,
  pronunciation = null,
  sound_hint = null,
  video_url = null,
  emoji = null,
  tags = null
from public.words w
where w.id = e.word_id and e.term is not null;



alter table public.set_entries enable trigger user;

-- 5. copying a set copies only the links
create or replace function public.copy_set(p_set uuid)
returns uuid language plpgsql security definer set search_path = public as $$
declare s study_sets%rowtype; nid uuid; inst uuid; t record; ntid uuid;
begin
  if not exists (select 1 from profiles where id = auth.uid() and role = 'teacher') then raise exception 'Only teachers can copy sets'; end if;
  if not can_view_set(p_set) then raise exception 'Set not found'; end if;
  select * into s from study_sets where id = p_set;
  select institution_id into inst from profiles where id = auth.uid();
  insert into study_sets (owner_id, institution_id, subject_id, level_code, curriculum_id, title, description, language, translation_lang, units, visibility)
  values (auth.uid(), inst, s.subject_id, s.level_code, s.curriculum_id, left('Copy of ' || s.title, 120), s.description, s.language, s.translation_lang, s.units, 'private')
  returning id into nid;
  insert into set_entries (set_id, position, kind, unit, also_units, word_id, term, meaning, example, translation, syllables, image_url, anim_url, audio_url, choices, answer, pronunciation, sound_hint, video_url, emoji, tags)
  select nid, position, kind, unit, also_units, word_id, term, meaning, example, translation, syllables, image_url, anim_url, audio_url, choices, answer, pronunciation, sound_hint, video_url, emoji, tags
  from set_entries where set_id = p_set;
  for t in select * from set_texts where set_id = p_set loop
    insert into set_texts (set_id, unit, title, body, position) values (nid, t.unit, t.title, t.body, t.position) returning id into ntid;
    insert into set_songs (set_id, text_id, unit, also_units, kind, title, media_url, lines, position)
    select nid, ntid, unit, also_units, kind, title, media_url, lines, position from set_songs where set_id = p_set and text_id = t.id;
  end loop;
  insert into set_songs (set_id, text_id, unit, also_units, kind, title, media_url, lines, position)
  select nid, null, unit, also_units, kind, title, media_url, lines, position from set_songs where set_id = p_set and text_id is null;
  return nid;
end $$;

-- word-count trigger: counts links
create or replace function public.set_items_count() returns trigger language plpgsql security definer set search_path = public as $$
declare sid uuid := coalesce(new.set_id, old.set_id);
begin
  update study_sets set
    term_count     = (select count(*) from set_entries where set_id = sid and kind = 'term'),
    question_count = (select count(*) from set_entries where set_id = sid and kind <> 'term'),
    cover_url      = coalesce((select coalesce(nullif(image_url, ''), anim_url) from set_items
                               where set_id = sid and (image_url <> '' or anim_url <> '') order by position limit 1), '')
  where id = sid;
  if tg_op = 'UPDATE' and new.set_id <> old.set_id then
    update study_sets set
      term_count     = (select count(*) from set_entries where set_id = old.set_id and kind = 'term'),
      question_count = (select count(*) from set_entries where set_id = old.set_id and kind <> 'term')
    where id = old.set_id;
  end if;
  return null;
end $$;

-- song coverage refreshes when a dictionary word's spelling changes
create or replace function public.trg_word_words() returns trigger language plpgsql security definer set search_path = public as $$
declare s record;
begin
  for s in select distinct so.id from set_songs so join set_entries e on e.set_id = so.set_id where e.word_id = new.id loop
    perform refresh_song_words(s.id);
  end loop;
  return null;
end $$;
drop trigger if exists word_words_upd on public.words;
create trigger word_words_upd after update of headword on public.words for each row
  when (old.headword is distinct from new.headword) execute function public.trg_word_words();

-- 6. coverage views (now on the dictionary-backed view)
create or replace view public.word_coverage with (security_invoker = on) as
select i.set_id, i.id as item_id, i.term, i.unit, i.also_units, i.position,
  count(s.id) filter (where s.kind = 'song')::int   as songs,
  count(s.id) filter (where s.kind = 'dialog')::int as dialogs,
  coalesce(bool_or((array[s.unit] || s.also_units) && (array[i.unit] || i.also_units)), false) as in_own_unit,
  coalesce(jsonb_agg(jsonb_build_object('song_id', s.id, 'title', s.title, 'kind', s.kind, 'unit', s.unit,
      'also_units', s.also_units, 'mentions', w.mentions, 't', w.first_t) order by s.unit, s.position)
    filter (where s.id is not null), '[]'::jsonb) as sources,
  case when count(s.id) > 0 then 'showing' else 'missing' end as status
from public.set_items i
left join public.set_song_words w on w.item_id = i.id
left join public.set_songs s on s.id = w.song_id
group by i.set_id, i.id, i.term, i.unit, i.also_units, i.position;
create or replace view public.unit_word_coverage with (security_invoker = on) as
select c.set_id, u.unit, count(*)::int as words,
  count(*) filter (where c.status = 'showing')::int as showing,
  count(*) filter (where c.status = 'missing')::int as missing,
  string_agg(c.term, ', ' order by c.position) filter (where c.status = 'missing') as missing_words
from public.word_coverage c cross join lateral unnest(array[c.unit] || c.also_units) as u(unit)
group by c.set_id, u.unit;
grant select on public.word_coverage, public.unit_word_coverage to authenticated;

-- 7. the set editor's save
create or replace function public.save_set_items(p_set uuid, p_rows jsonb, p_delete uuid[] default '{}')
returns int language plpgsql security definer set search_path = public as $$
declare
  r jsonb; L text; e set_entries%rowtype; has_e boolean; w words%rowtype; can_edit boolean;
  f text; nv text; cur text; tv text[]; tcur text[]; n int := 0; fresh boolean;
  fields constant text[] := array['meaning','example','translation','syllables','pronunciation','sound_hint',
                                  'image_url','anim_url','audio_url','video_url','emoji'];
begin
  if not (owns_set(p_set) or is_admin()) then raise exception 'Only the owner can edit this set'; end if;
  select coalesce(language, 'en') into L from study_sets where id = p_set;
  delete from set_entries where set_id = p_set and id = any(coalesce(p_delete, '{}'));
  for r in select * from jsonb_array_elements(coalesce(p_rows, '[]'::jsonb)) loop
    select * into e from set_entries where id = (r->>'id')::uuid; has_e := found;
    if has_e and e.set_id <> p_set then raise exception 'An item belongs to another set'; end if;
    if coalesce(r->>'kind', 'term') <> 'term' then   -- questions stay in the set
      insert into set_entries (id, set_id, position, kind, unit, also_units, word_id, term, meaning, example, translation, syllables,
                               image_url, anim_url, audio_url, choices, answer, pronunciation, sound_hint, video_url, emoji, tags)
      values ((r->>'id')::uuid, p_set, coalesce((r->>'position')::int, 0), r->>'kind', coalesce((r->>'unit')::int, 1),
              coalesce(array(select jsonb_array_elements_text(r->'also_units'))::int[], '{}'), null,
              coalesce(r->>'term', ''), coalesce(r->>'meaning', ''), coalesce(r->>'example', ''), coalesce(r->>'translation', ''), coalesce(r->>'syllables', ''),
              coalesce(r->>'image_url', ''), coalesce(r->>'anim_url', ''), coalesce(r->>'audio_url', ''), coalesce(r->'choices', '[]'::jsonb),
              (r->>'answer')::int, coalesce(r->>'pronunciation', ''), coalesce(r->>'sound_hint', ''), coalesce(r->>'video_url', ''), coalesce(r->>'emoji', ''), '{}')
      on conflict (id) do update set position = excluded.position, kind = excluded.kind, unit = excluded.unit, also_units = excluded.also_units,
        word_id = null, term = excluded.term, meaning = excluded.meaning, image_url = excluded.image_url, audio_url = excluded.audio_url,
        choices = excluded.choices, answer = excluded.answer;
      n := n + 1; continue;
    end if;
    if length(trim(coalesce(r->>'term', ''))) = 0 then continue; end if;
    -- find the dictionary word (or create it)
    select * into w from words where lang = L and lower(headword) = lower(trim(r->>'term')) and sense = coalesce(r->>'sense', '');
    if not found then
      insert into words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, sound_hint,
                         image_url, anim_url, audio_url, video_url, emoji, tags, owner_id)
      values (L, trim(r->>'term'), coalesce(r->>'sense', ''), coalesce(r->>'meaning', ''), coalesce(r->>'example', ''), coalesce(r->>'translation', ''),
              coalesce(r->>'syllables', ''), coalesce(r->>'pronunciation', ''), coalesce(r->>'sound_hint', ''),
              coalesce(r->>'image_url', ''), coalesce(r->>'anim_url', ''), coalesce(r->>'audio_url', ''), coalesce(r->>'video_url', ''),
              coalesce(r->>'emoji', ''), coalesce(array(select jsonb_array_elements_text(r->'tags')), '{}'), auth.uid())
      returning * into w;
    end if;
    can_edit := w.owner_id is null or w.owner_id = auth.uid() or is_admin();
    -- the link
    fresh := not has_e or e.word_id is distinct from w.id;   -- newly linked: empty boxes mean "use the dictionary"
    if fresh then
      insert into set_entries (id, set_id, position, kind, unit, also_units, word_id)
      values ((r->>'id')::uuid, p_set, coalesce((r->>'position')::int, 0), 'term', coalesce((r->>'unit')::int, 1),
              coalesce(array(select jsonb_array_elements_text(r->'also_units'))::int[], '{}'), w.id)
      on conflict (id) do update set word_id = excluded.word_id, position = excluded.position, unit = excluded.unit, also_units = excluded.also_units,
        term = null,
        meaning = null,
        example = null,
        translation = null,
        syllables = null,
        image_url = null,
        anim_url = null,
        audio_url = null,
        pronunciation = null,
        sound_hint = null,
        video_url = null,
        emoji = null,
        tags = null;
    else
      update set_entries set position = coalesce((r->>'position')::int, 0), unit = coalesce((r->>'unit')::int, 1),
        also_units = coalesce(array(select jsonb_array_elements_text(r->'also_units'))::int[], '{}') where id = e.id;
    end if;
    select * into e from set_entries where id = (r->>'id')::uuid;
    -- each field: a set-specific value wins; otherwise change the dictionary (if allowed) or keep it for this set only
    foreach f in array fields loop
      nv := coalesce(r->>f, '');
      if fresh and nv = '' then continue; end if;
      execute format('select ($1).%I', f) using e into cur;
      if cur is not null then
        if cur is distinct from nv then execute format('update set_entries set %I = $1 where id = $2', f) using nv, e.id; end if;
      else
        execute format('select ($1).%I', f) using w into cur;
        if cur is distinct from nv then
          if can_edit then execute format('update words set %I = $1, updated_at = now() where id = $2', f) using nv, w.id;
          else execute format('update set_entries set %I = $1 where id = $2', f) using nv, e.id; end if;
        end if;
      end if;
    end loop;
    tv := coalesce(array(select jsonb_array_elements_text(r->'tags')), '{}');
    if fresh and cardinality(tv) = 0 then null;
    elsif e.tags is not null then
      if e.tags is distinct from tv then update set_entries set tags = tv where id = e.id; end if;
    elsif w.tags is distinct from tv then
      if can_edit then update words set tags = tv, updated_at = now() where id = w.id; else update set_entries set tags = tv where id = e.id; end if;
    end if;
    n := n + 1;
  end loop;
  return n;
end $$;
revoke all on function public.save_set_items(uuid, jsonb, uuid[]) from public, anon;
grant execute on function public.save_set_items(uuid, jsonb, uuid[]) to authenticated;

-- song coverage, recomputed once on the new structure
select count(*) from (select public.refresh_song_words(id) from public.set_songs) x;

commit;

select (select count(*) from public.words) as dictionary_words,
       (select count(*) from public.set_entries) as set_links,
       (select count(*) from public.set_items) as view_rows,
       (select count(*) from public.set_entries where kind = 'term' and word_id is null) as unlinked,
       (select count(*) from public.set_entries where meaning is not null and word_id is not null) as set_specific_meanings;
