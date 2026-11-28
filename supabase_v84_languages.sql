-- =====================================================================
-- Helper Academy — v84: 🌍 every language on the same level as English
--
--   languages              one row per language: name, direction (ltr/rtl), the browser-voice code, whether it has a pronunciation line (pinyin…)
--   word_translations      one row per (word, language): the word, meaning, example, romanization, recorded voice, who made it, reviewed or draft
--   content_translations   the same idea for every other text (word-difference cards, conditions, grammar rules, traits, signs…)
--   set_languages          which languages a dictionary (study set) is translated into
--   student_languages      each student's own choice: which languages to show and hear, in which order (+ profiles.home_lang)
--   language_coverage      a view: how many words are translated, per language
--   RPCs                   set_word_translations (parent saves a batch), set_content_translations, set_my_languages (student / parent)
--
--   The Arabic you already have is MIGRATED into these tables (words.translation, summary_ar, explain_ar, core_ar, others_pain_ar, rule_ar);
--   the old columns stay as they are, so nothing on the site breaks while pages move to the new tables.
--   No translation is created here: other languages are filled later by the parent's own click. Safe to re-run. Run AFTER v83.
-- =====================================================================

-- 1) the languages -----------------------------------------------------------------------------------------------
create table if not exists public.languages (
  code text primary key check (code ~ '^[a-z]{2,3}$'),
  name_en text not null,
  native_name text not null,
  dir text not null default 'ltr' check (dir in ('ltr', 'rtl')),
  tts_lang text not null,                                  -- the code for the browser voice (BCP-47)
  has_romanization boolean not null default false,         -- show a pronunciation line (pinyin, romaji, transliteration)
  flag text not null default '',
  enabled boolean not null default false,                  -- offered to students
  position int not null default 100
);
alter table public.languages enable row level security;
drop policy if exists "anyone signed in reads languages" on public.languages;
create policy "anyone signed in reads languages" on public.languages for select to authenticated using (true);
-- only an admin changes this list
drop policy if exists "admin edits languages" on public.languages;
create policy "admin edits languages" on public.languages for all to authenticated using (public.is_admin()) with check (public.is_admin());

insert into public.languages (code, name_en, native_name, dir, tts_lang, has_romanization, flag, enabled, position) values
 ('en', 'English',    'English',          'ltr', 'en-US', false, '🇬🇧', true,   0),
 ('ar', 'Arabic',     'العربية',          'rtl', 'ar-SA', false, '🇸🇦', true,  10),
 ('fr', 'French',     'Français',         'ltr', 'fr-FR', false, '🇫🇷', true,  20),
 ('es', 'Spanish',    'Español',          'ltr', 'es-ES', false, '🇪🇸', true,  30),
 ('zh', 'Chinese',    '中文 (简体)',       'ltr', 'zh-CN', true,  '🇨🇳', true,  40),
 ('tr', 'Turkish',    'Türkçe',           'ltr', 'tr-TR', false, '🇹🇷', false, 50),
 ('ur', 'Urdu',       'اردو',             'rtl', 'ur-PK', false, '🇵🇰', false, 60),
 ('fa', 'Persian',    'فارسی',            'rtl', 'fa-IR', false, '🇮🇷', false, 70),
 ('hi', 'Hindi',      'हिन्दी',            'ltr', 'hi-IN', true,  '🇮🇳', false, 80),
 ('bn', 'Bengali',    'বাংলা',            'ltr', 'bn-BD', true,  '🇧🇩', false, 90),
 ('de', 'German',     'Deutsch',          'ltr', 'de-DE', false, '🇩🇪', false, 100),
 ('it', 'Italian',    'Italiano',         'ltr', 'it-IT', false, '🇮🇹', false, 110),
 ('pt', 'Portuguese', 'Português',        'ltr', 'pt-BR', false, '🇧🇷', false, 120),
 ('ru', 'Russian',    'Русский',          'ltr', 'ru-RU', true,  '🇷🇺', false, 130),
 ('ja', 'Japanese',   '日本語',            'ltr', 'ja-JP', true,  '🇯🇵', false, 140),
 ('ko', 'Korean',     '한국어',            'ltr', 'ko-KR', true,  '🇰🇷', false, 150),
 ('id', 'Indonesian', 'Bahasa Indonesia', 'ltr', 'id-ID', false, '🇮🇩', false, 160),
 ('ms', 'Malay',      'Bahasa Melayu',    'ltr', 'ms-MY', false, '🇲🇾', false, 170),
 ('tl', 'Filipino',   'Filipino',         'ltr', 'fil-PH', false, '🇵🇭', false, 180),
 ('sw', 'Swahili',    'Kiswahili',        'ltr', 'sw-KE', false, '🇰🇪', false, 190),
 ('la', 'Latin',      'Latina',           'ltr', 'la',    false, '🏛️', false, 200)
on conflict (code) do update set name_en = excluded.name_en, native_name = excluded.native_name, dir = excluded.dir, tts_lang = excluded.tts_lang,
  has_romanization = excluded.has_romanization, flag = excluded.flag, position = excluded.position;   -- "enabled" is the parent's choice: never reset

-- the language of a dictionary and of its words is now a real, checked language
alter table public.words drop constraint if exists words_lang_fkey;
alter table public.words add constraint words_lang_fkey foreign key (lang) references public.languages(code);
alter table public.study_sets drop constraint if exists study_sets_language_fkey;
alter table public.study_sets add constraint study_sets_language_fkey foreign key (language) references public.languages(code);
alter table public.study_sets drop constraint if exists study_sets_translation_lang_fkey;
alter table public.study_sets add constraint study_sets_translation_lang_fkey foreign key (translation_lang) references public.languages(code);

-- 2) one translation row per word and language ------------------------------------------------------------------------
create table if not exists public.word_translations (
  word_id uuid not null references public.words(id) on delete cascade,
  lang text not null references public.languages(code),
  term text not null default '' check (length(term) <= 300),            -- the word (or phrase) in this language
  meaning text not null default '' check (length(meaning) <= 600),      -- optional: the meaning, in this language
  example text not null default '' check (length(example) <= 600),      -- optional: the example sentence, in this language
  romanization text not null default '' check (length(romanization) <= 300),   -- pinyin / transliteration (only for languages that have it)
  audio_url text not null default '',                                   -- a recorded voice; empty = the browser voice reads it
  source text not null default 'manual' check (source in ('manual', 'ai', 'import')),
  status text not null default 'draft' check (status in ('draft', 'reviewed')),
  updated_at timestamptz not null default now(),
  primary key (word_id, lang),
  check (lang <> 'en')                                                  -- English is the word itself
);
create index if not exists word_translations_lang_idx on public.word_translations (lang);
alter table public.word_translations enable row level security;
drop policy if exists "read translations of words I can read" on public.word_translations;
create policy "read translations of words I can read" on public.word_translations for select to authenticated
  using (exists (select 1 from public.words w where w.id = word_id));       -- follows the dictionary's own age rule
-- no insert / update / delete policy: changes go only through set_word_translations (below)

-- 3) every other text ----------------------------------------------------------------------------------------------
create table if not exists public.content_translations (
  kind text not null check (kind in ('difference', 'difference_part', 'condition', 'grammar_point', 'trait', 'sign', 'character')),
  ref text not null,                       -- the row's key; for difference_part: '<diff_key>|<word_id>'
  field text not null,                     -- summary, explain, core, others_pain, rule, name, about …
  lang text not null references public.languages(code),
  text text not null default '' check (length(text) <= 2000),
  source text not null default 'manual' check (source in ('manual', 'ai', 'import')),
  status text not null default 'draft' check (status in ('draft', 'reviewed')),
  updated_at timestamptz not null default now(),
  primary key (kind, ref, field, lang),
  check (lang <> 'en')
);
create index if not exists content_translations_lang_idx on public.content_translations (lang, kind);
alter table public.content_translations enable row level security;
drop policy if exists "anyone signed in reads content translations" on public.content_translations;
create policy "anyone signed in reads content translations" on public.content_translations for select to authenticated using (true);

-- 4) which languages a dictionary is translated into ---------------------------------------------------------------------------------
create table if not exists public.set_languages (
  set_id uuid not null references public.study_sets(id) on delete cascade,
  lang text not null references public.languages(code),
  position int not null default 0,
  primary key (set_id, lang),
  check (lang <> 'en')
);
alter table public.set_languages enable row level security;
drop policy if exists "read set languages" on public.set_languages;
create policy "read set languages" on public.set_languages for select to authenticated using (true);
drop policy if exists "owner edits set languages" on public.set_languages;
create policy "owner edits set languages" on public.set_languages for all to authenticated
  using (exists (select 1 from public.study_sets s where s.id = set_id and (s.owner_id = auth.uid() or public.is_admin())))
  with check (exists (select 1 from public.study_sets s where s.id = set_id and (s.owner_id = auth.uid() or public.is_admin())));
insert into public.set_languages (set_id, lang, position)
select id, translation_lang, 0 from public.study_sets where translation_lang is not null and translation_lang <> 'en' on conflict do nothing;

-- 5) each student's own choice ------------------------------------------------------------------------------------------------
alter table public.profiles add column if not exists home_lang text not null default 'ar';
alter table public.profiles drop constraint if exists profiles_home_lang_fkey;
alter table public.profiles add constraint profiles_home_lang_fkey foreign key (home_lang) references public.languages(code);

create table if not exists public.student_languages (
  student_id uuid not null references public.profiles(id) on delete cascade,
  lang text not null references public.languages(code),
  show boolean not null default true,        -- show this language under each word
  hear boolean not null default true,        -- offer the 🔊 in this language
  position int not null default 0,           -- the order the languages are shown in
  primary key (student_id, lang),
  check (lang <> 'en')
);
alter table public.student_languages enable row level security;
drop policy if exists "read my languages" on public.student_languages;
create policy "read my languages" on public.student_languages for select to authenticated using (student_id = auth.uid() or public.teaches(student_id) or public.is_admin());
-- changes go only through set_my_languages (below)

-- everyone who sees Arabic today keeps seeing it: Arabic is each existing profile's first language
insert into public.student_languages (student_id, lang, show, hear, position) select id, 'ar', true, true, 0 from public.profiles on conflict do nothing;

-- 6) migrate the Arabic that already exists (the old columns stay) ------------------------------------------------------------------------
insert into public.word_translations (word_id, lang, term, source, status)
select id, 'ar', left(translation, 300), 'import', 'reviewed' from public.words where lang = 'en' and coalesce(btrim(translation), '') <> ''
on conflict (word_id, lang) do nothing;
insert into public.content_translations (kind, ref, field, lang, text, source, status)
select 'difference', key, 'summary', 'ar', left(summary_ar, 2000), 'import', 'reviewed' from public.word_differences where coalesce(btrim(summary_ar), '') <> '' on conflict do nothing;
insert into public.content_translations (kind, ref, field, lang, text, source, status)
select 'difference_part', diff_key || '|' || word_id::text, 'explain', 'ar', left(explain_ar, 2000), 'import', 'reviewed' from public.word_difference_parts where coalesce(btrim(explain_ar), '') <> '' on conflict do nothing;
insert into public.content_translations (kind, ref, field, lang, text, source, status)
select 'condition', key, 'core', 'ar', left(core_ar, 2000), 'import', 'reviewed' from public.conditions where coalesce(btrim(core_ar), '') <> '' on conflict do nothing;
insert into public.content_translations (kind, ref, field, lang, text, source, status)
select 'condition', key, 'others_pain', 'ar', left(others_pain_ar, 2000), 'import', 'reviewed' from public.conditions where coalesce(btrim(others_pain_ar), '') <> '' on conflict do nothing;
insert into public.content_translations (kind, ref, field, lang, text, source, status)
select 'grammar_point', key, 'rule', 'ar', left(rule_ar, 2000), 'import', 'reviewed' from public.grammar_points where coalesce(btrim(rule_ar), '') <> '' on conflict do nothing;

-- 7) how complete is each language? ------------------------------------------------------------------------------------------------
create or replace view public.language_coverage with (security_invoker = true) as
select l.code, l.name_en, l.native_name, l.enabled, l.position,
       (select count(*) from public.words w where w.lang = 'en') as words_total,
       (select count(*) from public.word_translations t where t.lang = l.code and t.term <> '') as words_translated,
       (select count(*) from public.word_translations t where t.lang = l.code and t.term <> '' and t.status = 'reviewed') as words_reviewed
from public.languages l where l.code <> 'en';
grant select on public.language_coverage to authenticated;

-- 8) the parent saves a batch of translations -----------------------------------------------------------------------------------------------
-- p = [{id, term, meaning, example, romanization, status}], one language per call. Arabic also keeps words.translation in step (the old pages read it).
create or replace function public.set_word_translations(p_lang text, p jsonb, p_source text default 'ai') returns int
language plpgsql security definer set search_path = public as $$
declare n int := 0; r record;
begin
  if not exists (select 1 from profiles where id = auth.uid() and role = 'teacher') and not public.is_admin() then
    raise exception 'Only the parent account can save translations'; end if;
  if p_lang = 'en' or not exists (select 1 from languages where code = p_lang) then raise exception 'Unknown language %', p_lang; end if;
  if p_source not in ('manual', 'ai') then p_source := 'manual'; end if;
  if jsonb_typeof(p) <> 'array' or jsonb_array_length(p) > 200 then raise exception 'Send at most 200 words at a time'; end if;
  for r in select (e->>'id')::uuid as id, left(btrim(coalesce(e->>'term', '')), 300) as term, left(btrim(coalesce(e->>'meaning', '')), 600) as meaning,
                  left(btrim(coalesce(e->>'example', '')), 600) as example, left(btrim(coalesce(e->>'romanization', '')), 300) as rom,
                  case when e->>'status' = 'reviewed' then 'reviewed' else 'draft' end as status
           from jsonb_array_elements(p) e loop
    continue when r.term = '' or not exists (select 1 from words w where w.id = r.id);
    -- an AI batch never overwrites a translation the parent has already reviewed
    insert into word_translations (word_id, lang, term, meaning, example, romanization, source, status, updated_at)
    values (r.id, p_lang, r.term, r.meaning, r.example, r.rom, p_source, r.status, now())
    on conflict (word_id, lang) do update set term = excluded.term, meaning = excluded.meaning, example = excluded.example, romanization = excluded.romanization,
      source = excluded.source, status = excluded.status, updated_at = now()
      where not (p_source = 'ai' and word_translations.status = 'reviewed');
    if found then n := n + 1; if p_lang = 'ar' then update words set translation = r.term where id = r.id; end if; end if;
  end loop;
  return n;
end $$;
revoke all on function public.set_word_translations(text, jsonb, text) from public, anon;
grant execute on function public.set_word_translations(text, jsonb, text) to authenticated;

-- the parent saves translations of the other texts: p = [{kind, ref, field, text, status}]
create or replace function public.set_content_translations(p_lang text, p jsonb, p_source text default 'ai') returns int
language plpgsql security definer set search_path = public as $$
declare n int := 0; r record;
begin
  if not exists (select 1 from profiles where id = auth.uid() and role = 'teacher') and not public.is_admin() then
    raise exception 'Only the parent account can save translations'; end if;
  if p_lang = 'en' or not exists (select 1 from languages where code = p_lang) then raise exception 'Unknown language %', p_lang; end if;
  if p_source not in ('manual', 'ai') then p_source := 'manual'; end if;
  if jsonb_typeof(p) <> 'array' or jsonb_array_length(p) > 300 then raise exception 'Send at most 300 texts at a time'; end if;
  for r in select e->>'kind' as kind, left(coalesce(e->>'ref', ''), 200) as ref, left(coalesce(e->>'field', ''), 40) as field, left(btrim(coalesce(e->>'text', '')), 2000) as text,
                  case when e->>'status' = 'reviewed' then 'reviewed' else 'draft' end as status from jsonb_array_elements(p) e loop
    continue when r.text = '' or r.ref = '' or r.field = '' or r.kind not in ('difference', 'difference_part', 'condition', 'grammar_point', 'trait', 'sign', 'character');
    insert into content_translations (kind, ref, field, lang, text, source, status, updated_at) values (r.kind, r.ref, r.field, p_lang, r.text, p_source, r.status, now())
    on conflict (kind, ref, field, lang) do update set text = excluded.text, source = excluded.source, status = excluded.status, updated_at = now()
      where not (p_source = 'ai' and content_translations.status = 'reviewed');
    if found then n := n + 1; end if;
  end loop;
  return n;
end $$;
revoke all on function public.set_content_translations(text, jsonb, text) from public, anon;
grant execute on function public.set_content_translations(text, jsonb, text) to authenticated;

-- 9) the student (or the parent / teacher for them) chooses which languages to show and hear ----------------------------------------------------------------
-- p = [{lang, show, hear}] in the order wanted; only enabled languages are kept. p_home = the student's own language (optional).
create or replace function public.set_my_languages(p_student uuid, p jsonb, p_home text default null) returns int
language plpgsql security definer set search_path = public as $$
declare n int := 0; r record;
begin
  if not (p_student = auth.uid() or public.teaches(p_student) or public.is_admin()) then
    raise exception 'Only this student, their teacher or their parent can change the languages.'; end if;
  if jsonb_typeof(p) <> 'array' or jsonb_array_length(p) > 30 then raise exception 'Bad settings.'; end if;
  delete from student_languages where student_id = p_student;
  for r in select e->>'lang' as lang, coalesce((e->>'show')::boolean, true) as show, coalesce((e->>'hear')::boolean, true) as hear, ord::int as pos
           from jsonb_array_elements(p) with ordinality as t(e, ord) loop
    continue when r.lang = 'en' or not exists (select 1 from languages where code = r.lang and enabled);
    insert into student_languages (student_id, lang, show, hear, position) values (p_student, r.lang, r.show, r.hear, r.pos) on conflict (student_id, lang) do nothing;
    n := n + 1;
  end loop;
  if p_home is not null and exists (select 1 from languages where code = p_home and enabled) then update profiles set home_lang = p_home where id = p_student; end if;
  return n;
end $$;
revoke all on function public.set_my_languages(uuid, jsonb, text) from public, anon;
grant execute on function public.set_my_languages(uuid, jsonb, text) to authenticated;

-- 10) the parent chooses which languages are offered at all
create or replace function public.set_language_enabled(p_lang text, p_on boolean) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from profiles where id = auth.uid() and role = 'teacher') and not public.is_admin() then
    raise exception 'Only the parent account can change the languages'; end if;
  if p_lang = 'en' then raise exception 'English is always on'; end if;
  update languages set enabled = p_on where code = p_lang;
end $$;
revoke all on function public.set_language_enabled(text, boolean) from public, anon;
grant execute on function public.set_language_enabled(text, boolean) to authenticated;

select (select count(*) from public.languages) as languages,
       (select count(*) from public.languages where enabled) as enabled,
       (select count(*) from public.word_translations where lang = 'ar') as arabic_words,
       (select count(*) from public.content_translations) as arabic_other_texts,
       (select count(*) from public.student_languages) as student_rows,
       (select count(*) from public.set_languages) as set_rows;
