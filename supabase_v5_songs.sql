-- =====================================================================
-- Helper Academy — v5: songs and texts
-- Run AFTER supabase_v4_pronunciation.sql (safe to run more than once).
-- A unit can have several texts (a poem, a script, a reading passage)
-- and several songs. A song has a video or audio file and its lyrics as
-- timed lines, and can belong to a text (two songs for one text, say).
-- =====================================================================

create table if not exists public.set_texts (
  id         uuid primary key default gen_random_uuid(),
  set_id     uuid not null references public.study_sets(id) on delete cascade,
  unit       int  not null default 1 check (unit between 0 and 999),
  title      text not null check (length(trim(title)) between 2 and 150),
  body       text not null default '' check (length(body) <= 20000),
  position   int  not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists set_texts_set_idx on public.set_texts (set_id, unit, position);

create table if not exists public.set_songs (
  id         uuid primary key default gen_random_uuid(),
  set_id     uuid not null references public.study_sets(id) on delete cascade,
  text_id    uuid references public.set_texts(id) on delete set null,
  unit       int  not null default 1 check (unit between 0 and 999),
  title      text not null check (length(trim(title)) between 2 and 150),
  media_url  text not null default '' check (media_url = '' or media_url ~ '^(https://|assets/)'),
  -- lyrics: [{"t": start seconds or null, "e": end seconds or null, "l": "the line"}]
  lines      jsonb not null default '[]'::jsonb check (jsonb_typeof(lines) = 'array' and jsonb_array_length(lines) <= 500),
  position   int  not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists set_songs_set_idx on public.set_songs (set_id, unit, position);

alter table public.set_texts enable row level security;
alter table public.set_songs enable row level security;

drop policy if exists "read texts of visible sets" on public.set_texts;
create policy "read texts of visible sets" on public.set_texts for select to authenticated using (public.can_view_set(set_id));
drop policy if exists "owner adds texts" on public.set_texts;
create policy "owner adds texts" on public.set_texts for insert to authenticated with check (public.owns_set(set_id));
drop policy if exists "owner edits texts" on public.set_texts;
create policy "owner edits texts" on public.set_texts for update to authenticated using (public.owns_set(set_id)) with check (public.owns_set(set_id));
drop policy if exists "owner deletes texts" on public.set_texts;
create policy "owner deletes texts" on public.set_texts for delete to authenticated using (public.owns_set(set_id));

drop policy if exists "read songs of visible sets" on public.set_songs;
create policy "read songs of visible sets" on public.set_songs for select to authenticated using (public.can_view_set(set_id));
drop policy if exists "owner adds songs" on public.set_songs;
create policy "owner adds songs" on public.set_songs for insert to authenticated with check (public.owns_set(set_id));
drop policy if exists "owner edits songs" on public.set_songs;
create policy "owner edits songs" on public.set_songs for update to authenticated using (public.owns_set(set_id)) with check (public.owns_set(set_id));
drop policy if exists "owner deletes songs" on public.set_songs;
create policy "owner deletes songs" on public.set_songs for delete to authenticated using (public.owns_set(set_id));

revoke all on public.set_texts, public.set_songs from anon;
grant select, insert, update, delete on public.set_texts, public.set_songs to authenticated;

-- Results from the "fill in the words" activity on songs and texts.
alter table public.attempts drop constraint if exists attempts_activity_check;
alter table public.attempts add constraint attempts_activity_check check (activity in
  ('exam','picture-match','definition-match','unscramble','spell-look-cover','spell-missing-letters',
   'spell-syllables','spell-test','quiz','song-fill'));

-- Teachers can now upload song videos (up to 50 MB) as well as pictures and audio.
do $$
begin
  if exists (select 1 from pg_namespace where nspname = 'storage') then
    update storage.buckets set file_size_limit = 52428800,
      allowed_mime_types = array['image/png','image/jpeg','image/gif','image/webp',
        'audio/mpeg','audio/mp4','audio/x-m4a','audio/wav','audio/ogg','audio/webm',
        'video/mp4','video/webm','video/quicktime']
    where id = 'media';
  end if;
end $$;

-- Copies keep pronunciation help, texts and songs.
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
  insert into set_items (set_id, position, kind, unit, also_units, term, meaning, example, translation, syllables, image_url, anim_url, audio_url, choices, answer, pronunciation, sound_hint)
  select nid, position, kind, unit, also_units, term, meaning, example, translation, syllables, image_url, anim_url, audio_url, choices, answer, pronunciation, sound_hint
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

-- ---------- Grade 5 set, Unit 5: "The Changing Seasons Vocabulary Jam!" and its two songs ----------
insert into public.set_texts (id, set_id, unit, title, body, position)
values ('00000000-0000-4000-8000-0000000005a1', '00000000-0000-4000-8000-000000000005', 5, 'The Changing Seasons Vocabulary Jam!', 'Characters / Singers:
* Kid 1 (The Energetic Speller)
* Kid 2 (The Sound & Meaning Guide)
* Chorus / Everyone

Part 1: Rustled & Sigh
(Kid 1 - whispering mysteriously):
Shh... listen close! What''s that sound in the trees?
(Kid 2 - making a soft swishing sound, swaying hands):
Swish-swish... swish-swish...
That''s Rustled! R-U-S-T-L-E-D!
(Kid 1):
What does it mean? Tell me, please!
(Kid 2):
It means making a soft swishing sound! Like dry leaves blowing around!
(Kid 1 - breathing out heavily, shoulders dropping in relief):
Hhhhhh... phew! That is a Sigh! S-I-G-H!
(Kid 2):
An audible sound made when exhaling in relief!

Part 2: Swayed & Precarious
(Chorus - moving side to side like trees in the wind):
Sway... sway... left and right!
Swayed! S-W-A-Y-E-D!
Moved from side to side with all its might!
(Kid 1 - wobbling on one foot, looking nervous):
Uh oh, uh oh! I''m standing up high! This is Precarious! Oh my, oh my!
Let''s spell it out: P-R-E-C-A-R-I-O-U-S!
(Kid 2 - looking worried):
Dangerous or hazardous! Like a leaf on a twig—oh, it''s perilous!

Part 3: Faraway & Observed
(Kid 1 - putting hand over eyes, looking into the distance):
Way, way, way out across the sea...
Faraway! F-A-R-A-W-A-Y!
(Kid 2):
Very far away; distant, you see!
(Kid 1 - holding up an imaginary magnifying glass, squinting):
Peek-a-boo! I see you!
Observed! O-B-S-E-R-V-E-D!
(Kid 2):
Saw or noticed by watching carefully!

Part 4: Separated & Symbolized
(Kid 1 - jumping apart with jazz hands):
One on this side, one on that! Separated! Just like that!
S-E-P-A-R-A-T-E-D!
(Kid 2):
Divided into parts or moved apart, agreed!
(Kid 1 - holding out a peace sign or a golden leaf):
And finally... what does this golden color prize?
Symbolized! S-Y-M-B-O-L-I-Z-E-D!
(Chorus - cheering):
S-Y-M-B-O-L-I-Z-E-D!
Stood for or represented an idea, feeling, or quality!', 1)
on conflict (id) do nothing;
insert into public.set_songs (id, set_id, text_id, unit, title, media_url, lines, position)
values ('00000000-0000-4000-8000-0000000005b1', '00000000-0000-4000-8000-000000000005', '00000000-0000-4000-8000-0000000005a1', 5, 'Swish and Sway', 'assets/songs/swish-and-sway.mp4', '[{"t": 12.0, "e": 14.57, "l": "Shh... listen close! What''s that sound in the trees?"}, {"t": 14.57, "e": 17.14, "l": "Swish-swish... swish-swish..."}, {"t": 17.14, "e": 22.29, "l": "That''s Rustled! R-U-S-T-L-E-D!"}, {"t": 22.29, "e": 27.43, "l": "What does it mean? Tell me, please!"}, {"t": 27.43, "e": 32.57, "l": "It means making a soft swishing sound! Like dry leaves blowing around!"}, {"t": 32.57, "e": 37.71, "l": "Hhhhhh... phew! That is a Sigh! S-I-G-H!"}, {"t": 37.71, "e": 42.86, "l": "An audible sound made when exhaling in relief!"}, {"t": 42.86, "e": 48.0, "l": "Sway... sway... left and right!"}, {"t": 48.0, "e": 52.0, "l": "Swayed! S-W-A-Y-E-D!"}, {"t": 52.0, "e": 56.0, "l": "Moved from side to side with all its might!"}, {"t": 56.0, "e": 60.0, "l": "Uh oh, uh oh! I''m standing up high! This is Precarious! Oh my, oh my!"}, {"t": 60.0, "e": 72.0, "l": "Let''s spell it out: P-R-E-C-A-R-I-O-U-S!"}, {"t": 72.0, "e": 84.0, "l": "Dangerous or hazardous! Like a leaf on a twig—oh, it''s perilous!"}, {"t": 84.0, "e": 96.0, "l": "Way, way, way out across the sea..."}, {"t": 96.0, "e": 100.0, "l": "Faraway! F-A-R-A-W-A-Y!"}, {"t": 100.0, "e": 104.0, "l": "Very far away; distant, you see!"}, {"t": 104.0, "e": 108.0, "l": "Peek-a-boo! I see you!"}, {"t": 108.0, "e": 120.0, "l": "Observed! O-B-S-E-R-V-E-D!"}, {"t": 120.0, "e": 132.0, "l": "Saw or noticed by watching carefully!"}, {"t": 132.0, "e": 144.0, "l": "One on this side, one on that! Separated! Just like that!"}, {"t": 144.0, "e": 148.8, "l": "S-E-P-A-R-A-T-E-D!"}, {"t": 148.8, "e": 153.6, "l": "Divided into parts or moved apart, agreed!"}, {"t": 153.6, "e": 158.4, "l": "And finally... what does this golden color prize?"}, {"t": 158.4, "e": 163.2, "l": "Symbolized! S-Y-M-B-O-L-I-Z-E-D!"}, {"t": 163.2, "e": 168.0, "l": "S-Y-M-B-O-L-I-Z-E-D!"}, {"t": 168.0, "e": 172.0, "l": "Stood for or represented an idea, feeling, or quality!"}, {"t": 172.0, "e": 180.0, "l": "Spell it! Say it! Know what it means!"}]'::jsonb, 1)
on conflict (id) do nothing;
insert into public.set_songs (id, set_id, text_id, unit, title, media_url, lines, position)
values ('00000000-0000-4000-8000-0000000005b2', '00000000-0000-4000-8000-000000000005', '00000000-0000-4000-8000-0000000005a1', 5, 'Spell It Out Loud', 'assets/songs/spell-it-out-loud.mp4', '[{"t": 0.0, "e": 1.2, "l": "Welcome class to the vocabulary beat"}, {"t": 1.2, "e": 2.4, "l": "Get ready to repeat"}, {"t": 2.4, "e": 4.8, "l": "Let''s spell it out and make it stick"}, {"t": 4.8, "e": 7.2, "l": "Learning these words is a clever trick"}, {"t": 7.2, "e": 9.6, "l": "Spell rustled with me R U S T L E D"}, {"t": 9.6, "e": 12.0, "l": "R U S T L E D that''s how it''s done you see"}, {"t": 12.0, "e": 14.4, "l": "The wind blew the trees and they made a soft sound"}, {"t": 14.4, "e": 16.8, "l": "The dry yellow leaves fell right down to the ground"}, {"t": 16.8, "e": 19.2, "l": "Spell sigh with a breath S I G H my friend"}, {"t": 19.2, "e": 21.6, "l": "S I G H a feeling when things start to end"}, {"t": 21.6, "e": 24.0, "l": "The test is all over she let out a sigh"}, {"t": 24.0, "e": 26.4, "l": "A sound of relief as the clouds drifted by"}, {"t": 26.4, "e": 28.8, "l": "Rustled is a soft sound"}, {"t": 28.8, "e": 31.2, "l": "Sigh is a breath we find"}, {"t": 31.2, "e": 33.6, "l": "Swayed means to move side to side"}, {"t": 33.6, "e": 36.0, "l": "Keep these great words on your mind"}, {"t": 36.0, "e": 38.4, "l": "We are building up our brain"}, {"t": 38.4, "e": 40.8, "l": "Learning words is not in vain"}, {"t": 40.8, "e": 43.2, "l": "Speak them loud and speak them proud"}, {"t": 43.2, "e": 45.6, "l": "Sing them to the whole big crowd"}, {"t": 45.6, "e": 48.0, "l": "Precarious is tricky let''s spell it out loud"}, {"t": 48.0, "e": 50.4, "l": "P R E C A R I O U S we make ourselves proud"}, {"t": 50.4, "e": 52.8, "l": "It''s dangerous and risky a difficult spot"}, {"t": 52.8, "e": 55.2, "l": "Like a leaf on a branch that could easily drop"}, {"t": 55.2, "e": 57.6, "l": "Now faraway places are F A R A W A Y"}, {"t": 57.6, "e": 60.0, "l": "A long distance off where we might want to play"}, {"t": 60.0, "e": 62.4, "l": "The leaf dreamed of places across the blue sea"}, {"t": 62.4, "e": 64.8, "l": "A faraway land where it wanted to be"}, {"t": 64.8, "e": 67.2, "l": "Precarious means risky and bold"}, {"t": 67.2, "e": 69.6, "l": "Faraway is a story untold"}, {"t": 69.6, "e": 72.0, "l": "Observed means to look very close"}, {"t": 72.0, "e": 74.4, "l": "That is the word we will use the most"}, {"t": 74.4, "e": 76.8, "l": "We are building up our brain"}, {"t": 76.8, "e": 79.2, "l": "Learning words is not in vain"}, {"t": 79.2, "e": 81.6, "l": "Speak them loud and speak them proud"}, {"t": 81.6, "e": 84.0, "l": "Sing them to the whole big crowd"}, {"t": 84.0, "e": 86.4, "l": "Observed means to watch let us spell it today"}, {"t": 86.4, "e": 88.8, "l": "O B S E R V E D let us see what you say"}, {"t": 88.8, "e": 91.2, "l": "She noticed the changes so carefully clear"}, {"t": 91.2, "e": 93.6, "l": "As winter was slowly and steadily near"}, {"t": 93.6, "e": 96.0, "l": "Now separated is hard S E P A R A T E D"}, {"t": 96.0, "e": 98.4, "l": "The parts moved apart that was what we just read"}, {"t": 98.4, "e": 100.8, "l": "The leaf and the twig are no longer a pair"}, {"t": 100.8, "e": 103.2, "l": "They separated and flew in the air"}, {"t": 103.2, "e": 105.6, "l": "(Take a breath and listen close)"}, {"t": 105.6, "e": 109.2, "l": "The last big word is capitalized"}, {"t": 109.2, "e": 112.8, "l": "S Y M B O L I Z E D is how it''s written"}, {"t": 112.8, "e": 116.4, "l": "It stood for a feeling or idea so fitting"}, {"t": 116.4, "e": 120.0, "l": "Like the golden leaf showed joy and peace"}, {"t": 120.0, "e": 123.6, "l": "A symbol that made all the worries cease"}, {"t": 123.6, "e": 127.2, "l": "(Now let''s bring it back for the biggest sound)"}, {"t": 127.2, "e": 130.8, "l": "Put your feet on the ground and get ready to bound"}, {"t": 130.8, "e": 134.4, "l": "Separated means moved apart"}, {"t": 134.4, "e": 136.8, "l": "Symbolized came straight from the heart"}, {"t": 136.8, "e": 139.2, "l": "We know the words and we know what they mean"}, {"t": 139.2, "e": 141.6, "l": "We are the smartest class you have ever seen"}, {"t": 141.6, "e": 144.0, "l": "We are building up our brain"}, {"t": 144.0, "e": 146.4, "l": "Learning words is not in vain"}, {"t": 146.4, "e": 148.8, "l": "Speak them loud and speak them proud"}, {"t": 148.8, "e": 151.2, "l": "Sing them to the whole big crowd"}, {"t": 151.2, "e": 153.6, "l": "Great job today everybody"}, {"t": 153.6, "e": 158.45, "l": "You spelled them all right and with style"}, {"t": 158.45, "e": 163.3, "l": "Keep practicing and keep reading"}, {"t": 163.3, "e": 173.0, "l": "You have made your teacher smile"}]'::jsonb, 2)
on conflict (id) do nothing;

-- ---------- Grade 5 set, Unit 5: "The Changing Seasons Syllable Jam!" and its song ----------
insert into public.set_texts (id, set_id, unit, title, body, position)
values ('00000000-0000-4000-8000-0000000005a2', '00000000-0000-4000-8000-000000000005', 5, 'The Changing Seasons Syllable Jam!', 'Breaking long words into syllables, instead of spelling letter by letter, is a huge memory hack. When you clap and spell **chunk by chunk**, you never miss the middle vowels (like the "a" in *Sep-a-rat-ed* or the "i" in *Pre-car-i-ous*) and you know how many beats each word has.

### Quick Syllable Guide for Memory
| Word | Syllables | Beats | Memory trick |
| --- | --- | --- | --- |
| Rustled | Rus • tled | 2 | **Rus** (like *us*) + **tled** (the silent *t* hides at the start of *tled*!) |
| Sigh | Sigh | 1 | Just 1 big breath! Silent *g-h* at the end. |
| Swayed | Swayed | 1 | 1 smooth glide! Don''t make *ed* a second beat: it sounds like *swayd*. |
| Precarious | Pre • car • i • ous | 4 | **Pre** (like *be*) + **car** (sounds like *care*) + **i** + **ous**. |
| Faraway | Far • a • way | 3 | Two easy words (**Far** + **way**) holding hands with **a** in the middle! |
| Observed | Ob • served | 2 | **Ob** + **served** (just 2 beats, *served* is one single sound). |
| Separated | Sep • a • rat • ed | 4 | There is **"a rat"** hiding right in the middle: **Sep - a - rat - ed**! |
| Symbolized | Sym • bol • ized | 3 | **Sym** (starts with *Y*, not *I*!) + **bol** + **ized**. |

Characters / Singers:
* Kid 1 (The Syllable Clapper)
* Kid 2 (The Sound & Meaning Guide)
* Chorus / Everyone

Part 1: Rustled & Sigh
(Kid 1 - whispering mysteriously):
Shh... listen close! What''s that sound in the trees?
(Kid 2 - making a soft swishing sound, swaying hands):
*Swish-swish... swish-swish...*
That''s **Rustled!** Two beats, clap it with me!
**Rus** (R-U-S) ... **tled** (T-L-E-D)!
Two syllables: **Rus • tled**!
(Kid 1):
What does it mean? Tell me, please!
(Kid 2):
Making a soft swishing sound, like dry leaves blowing around!
(Kid 1 - breathing out heavily, shoulders dropping in relief):
*Hhhhhh... phew!* That is a **Sigh!**
Just one big syllable, don''t let it fly!
**Sigh** (S-I-G-H): one beat!
(Kid 2):
An audible sound made when exhaling in relief!

Part 2: Swayed & Precarious
(Chorus - moving smoothly from side to side like trees in the wind):
*Sway... sway... left and right!*
**Swayed!** One smooth syllable, hold on tight!
**Swayed** (S-W-A-Y-E-D): one beat!
Moved from side to side with all its might!
(Kid 1 - wobbling on one foot, looking nervous):
Uh oh, uh oh! I''m standing up high! This is **Precarious!** Oh my, oh my!
Four big syllables, take it slow, chunk by chunk:
**Pre** (P-R-E) ... **car** (C-A-R) ... **i** (I) ... **ous** (O-U-S)!
Four syllables: **Pre • car • i • ous**!
(Kid 2 - looking worried):
Dangerous or hazardous! Like a leaf on a twig—oh, it''s perilous!

Part 3: Faraway & Observed
(Kid 1 - putting hand over eyes, looking into the distance):
Way, way, way out across the sea...
**Faraway!** Three syllables, easy as can be!
**Far** (F-A-R) ... **a** (A) ... **way** (W-A-Y)!
Three syllables: **Far • a • way**!
(Kid 2):
Very far away; distant, you see!
(Kid 1 - holding up an imaginary magnifying glass, squinting):
*Peek-a-boo! I see you!*
**Observed!** Two syllables, sharp and clear!
**Ob** (O-B) ... **served** (S-E-R-V-E-D)!
Two syllables: **Ob • served**!
(Kid 2):
Saw or noticed by watching carefully!

Part 4: Separated & Symbolized
(Kid 1 - jumping apart with jazz hands):
One on this side, one on that! **Separated!** Just like that!
Four syllables, spot *"a rat"* in the middle so you never forget:
**Sep** (S-E-P) ... **a** (A) ... **rat** (R-A-T) ... **ed** (E-D)!
Four syllables: **Sep • a • rat • ed**!
(Kid 2):
Divided into parts or moved apart, agreed!
(Kid 1 - holding out a peace sign or a golden leaf):
And finally... what does this golden color prize?
**Symbolized!** Three syllables, watch that tricky **Y**!
**Sym** (S-Y-M) ... **bol** (B-O-L) ... **ized** (I-Z-E-D)!
Three syllables: **Sym • bol • ized**!
(Chorus - cheering):
**Sym • bol • ized**!
Stood for or represented an idea, feeling, or quality!

### Outro
(Everyone - clapping and chanting slowly to the beat):
*Clap the chunks! Count the beats! Know what it means!*
Mastering Unit 5: The Changing Seasons scenes!', 2)
on conflict (id) do nothing;
insert into public.set_songs (id, set_id, text_id, unit, title, media_url, lines, position)
values ('00000000-0000-4000-8000-0000000005b3', '00000000-0000-4000-8000-000000000005', '00000000-0000-4000-8000-0000000005a2', 5, 'Across the Blue Sea', 'assets/songs/across-the-blue-sea.mp4', '[{"t": 0.0, "e": 6.0, "l": "Let''s clap it out! Every beat, every word! Ready? Let''s go!"}, {"t": 6.0, "e": 12.0, "l": "Shh... listen close! What''s that sound?"}, {"t": 12.0, "e": 16.5, "l": "It''s the leaves! *Swish-swish... swish-swish...*"}, {"t": 16.5, "e": 21.0, "l": "That''s Rustled! Two beats, clap them out:"}, {"t": 21.0, "e": 25.5, "l": "Rus-tled! R-U-S... T-L-E-D!"}, {"t": 25.5, "e": 30.0, "l": "It means a soft swishing sound!"}, {"t": 30.0, "e": 34.5, "l": "Hhhhhh... phew! That is a Sigh!"}, {"t": 34.5, "e": 39.0, "l": "One beat! Just one! S-I-G-H!"}, {"t": 39.0, "e": 43.5, "l": "A sound of relief when you let it out."}, {"t": 43.5, "e": 48.0, "l": "Sway... sway... left and right!"}, {"t": 48.0, "e": 51.43, "l": "Swayed! One smooth beat! S-W-A-Y-E-D!"}, {"t": 51.43, "e": 54.86, "l": "Moving from side to side with all its might!"}, {"t": 54.86, "e": 58.29, "l": "Uh oh, standing up high! This is Pre-car-i-ous!"}, {"t": 58.29, "e": 61.71, "l": "Four claps, slow: Pre-car-i-ous!"}, {"t": 61.71, "e": 65.14, "l": "P-R-E... C-A-R... I... O-U-S!"}, {"t": 65.14, "e": 68.57, "l": "Dangerous, risky, a tricky spot!"}, {"t": 68.57, "e": 72.0, "l": "Look way out, across the blue sea..."}, {"t": 72.0, "e": 75.0, "l": "Far-a-way! Three beats: Far-a-way!"}, {"t": 75.0, "e": 78.0, "l": "F-A-R... A... W-A-Y!"}, {"t": 78.0, "e": 81.0, "l": "It means very distant, far from here!"}, {"t": 81.0, "e": 84.0, "l": "Peek-a-boo! I see you! Ob-served!"}, {"t": 84.0, "e": 87.0, "l": "Two beats: Ob-served!"}, {"t": 87.0, "e": 90.0, "l": "O-B... S-E-R-V-E-D!"}, {"t": 90.0, "e": 93.0, "l": "To watch very closely, see what you see!"}, {"t": 93.0, "e": 96.0, "l": "We''re clapping the beats, we''re learning the sound!"}, {"t": 96.0, "e": 102.0, "l": "These words are the best ones that we''ve ever found!"}, {"t": 102.0, "e": 108.0, "l": "Let''s keep them all safe in our minds today!"}, {"t": 108.0, "e": 114.0, "l": "Learning is easy when we chant and we play!"}, {"t": 114.0, "e": 120.0, "l": "One on this side, one on that! Sep-a-rat-ed!"}, {"t": 120.0, "e": 123.0, "l": "Four beats: Sep-a-rat-ed!"}, {"t": 123.0, "e": 126.0, "l": "S-E-P... A... R-A-T... E-D!"}, {"t": 126.0, "e": 129.0, "l": "Divided into parts, moved apart!"}, {"t": 129.0, "e": 132.0, "l": "And finally, what does this golden color mean?"}, {"t": 132.0, "e": 135.0, "l": "Sym-bol-ized! Three beats: Sym-bol-ized!"}, {"t": 135.0, "e": 138.0, "l": "S-Y-M... B-O-L... I-Z-E-D!"}, {"t": 138.0, "e": 141.0, "l": "Representing a feeling, a hope, or a dream!"}, {"t": 141.0, "e": 144.0, "l": "Rustled! Sigh! Swayed! And more!"}, {"t": 144.0, "e": 150.0, "l": "These are the words that we now adore!"}, {"t": 150.0, "e": 156.0, "l": "Every syllable, every beat!"}, {"t": 156.0, "e": 162.0, "l": "Making our learning so smooth and so sweet!"}, {"t": 162.0, "e": 168.0, "l": "Spell it!"}, {"t": 168.0, "e": 171.0, "l": "Say it!"}, {"t": 171.0, "e": 174.0, "l": "Know what it means!"}, {"t": 174.0, "e": 180.0, "l": "(Keep on clapping... One... two... three... four...)"}]'::jsonb, 3)
on conflict (id) do nothing;
