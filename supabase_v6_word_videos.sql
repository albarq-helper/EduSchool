-- =====================================================================
-- Helper Academy — v6: a short animated video clip per word
-- Run AFTER supabase_v5_songs.sql (safe to run more than once).
-- =====================================================================
alter table public.set_items add column if not exists video_url text not null default ''
  check (video_url = '' or video_url ~ '^(https://|assets/)');

-- Copies keep the clips too.
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
  insert into set_items (set_id, position, kind, unit, also_units, term, meaning, example, translation, syllables, image_url, anim_url, audio_url, choices, answer, pronunciation, sound_hint, video_url)
  select nid, position, kind, unit, also_units, term, meaning, example, translation, syllables, image_url, anim_url, audio_url, choices, answer, pronunciation, sound_hint, video_url
  from set_items where set_id = p_set;
  for t in select * from set_texts where set_id = p_set loop
    insert into set_texts (set_id, unit, title, body, position) values (nid, t.unit, t.title, t.body, t.position) returning id into ntid;
    insert into set_songs (set_id, text_id, unit, title, media_url, lines, position)
    select nid, ntid, unit, title, media_url, lines, position from set_songs where set_id = p_set and text_id = t.id;
  end loop;
  insert into set_songs (set_id, text_id, unit, title, media_url, lines, position)
  select nid, null, unit, title, media_url, lines, position from set_songs where set_id = p_set and text_id is null;
  return nid;
end $$;
