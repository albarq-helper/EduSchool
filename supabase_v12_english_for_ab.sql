-- =====================================================================
-- Helper Academy — v12: "English for Ab", a private personal word set (separate from Grade 5)
-- Owned by the site's account; private, so it shows under My sets only. Safe to run more than once.
-- =====================================================================
insert into public.study_sets (id, owner_id, author_name, institution_id, subject_id, level_code, title, description,
                               language, translation_lang, units, visibility)
values ('00000000-0000-4000-8000-0000000000ab', 'b31d1b74-2127-4df3-bdea-2e141188fdc2', 'Ab', null, 1, 'any',
        'English for Ab', 'My own English words: meaning, syllables, how to say it, and examples.',
        'en', 'ar', '[{"u": 1, "name": "My words"}]'::jsonb, 'private')
on conflict (id) do update set title = excluded.title, description = excluded.description, units = excluded.units;

insert into public.set_items (id, set_id, position, kind, unit, also_units, term, meaning, example, translation,
                              syllables, image_url, anim_url, audio_url, pronunciation, sound_hint, emoji)
values ('00000000-0000-4000-8000-0000000ab001', '00000000-0000-4000-8000-0000000000ab', 1, 'term', 1, '{}', 'Feisty',
        'Lively, brave and full of spirit; ready to stand up for yourself or argue.',
        'The [feisty] little dog barked at the big truck as if it owned the street.',
        'مُفعم بالحيوية والجرأة؛ مُشاكس', 'feis-ty', '', '', 'assets/audio/feisty.mp3',
        'FYE-stee', 'FYE ≈ pie | stee ≈ tea', '🌶️')
on conflict (id) do update set meaning = excluded.meaning, example = excluded.example, translation = excluded.translation,
  syllables = excluded.syllables, audio_url = excluded.audio_url, pronunciation = excluded.pronunciation,
  sound_hint = excluded.sound_hint, emoji = excluded.emoji;

update public.study_sets s set term_count = (select count(*) from public.set_items i where i.set_id = s.id and i.kind = 'term')
where s.id = '00000000-0000-4000-8000-0000000000ab';
