-- =====================================================================
-- Helper Academy — v75: the "How Stories Make Vocabulary Stick" dialog cut into one dialog per unit
--   Part 1 (Unit 1)  0:00–5:46   intro + Emperor Shen Nong's tea      lethargic … exhilaration
--   Part 2 (Unit 2)  6:07–9:44   the secret life of the soil          reside … life-threatening
--   Part 3 (Unit 3)  9:53–16:32  the poet and the moonlit farm + recap bookkeeper … reeds (also Unit 2 for "nocturnal")
--   The timed lines come from the full dialog, shifted to each clip's start. The full episode stays, listed last.
--   Word links (set_song_words) refresh by trigger. Run AFTER v74. Safe to re-run.
-- =====================================================================
with src as (select * from public.set_songs where id = '00000000-0000-4000-8000-00000000d101'),
parts(id, unit, also, title, file, a, b, pos) as (values
  ('00000000-0000-4000-8000-00000000d111'::uuid, 1, '{}'::int[], 'How Stories Make Vocabulary Stick · Part 1: The Emperor''s Tea', 'how-stories-1-the-emperors-tea.mp4', 0.0, 346.1, 1),
  ('00000000-0000-4000-8000-00000000d112'::uuid, 2, '{}'::int[], 'How Stories Make Vocabulary Stick · Part 2: The Secret Life of the Soil', 'how-stories-2-secret-life-of-the-soil.mp4', 366.6, 584.2, 2),
  ('00000000-0000-4000-8000-00000000d113'::uuid, 3, '{2}'::int[], 'How Stories Make Vocabulary Stick · Part 3: The Poet and the Moonlit Farm', 'how-stories-3-poet-and-moonlit-farm.mp4', 592.5, 991.92, 3))
insert into public.set_songs (id, set_id, text_id, unit, also_units, kind, title, media_url, lines, position)
select p.id, s.set_id, null, p.unit, p.also, 'dialog', p.title, 'assets/podcasts/' || p.file || '?v=20261125',
  (select jsonb_agg(jsonb_build_object('t', round(((x->>'t')::numeric - p.a), 2), 'e', round((least((x->>'e')::numeric, p.b) - p.a), 2), 'l', x->'l', 'sp', x->'sp') order by n)
     from jsonb_array_elements(s.lines) with ordinality as l(x, n) where (x->>'t')::numeric >= p.a and (x->>'t')::numeric < p.b),
  s.position + p.pos
from parts p, src s
on conflict (id) do update set unit = excluded.unit, also_units = excluded.also_units, title = excluded.title, media_url = excluded.media_url, lines = excluded.lines, position = excluded.position;

-- the full episode stays, after the three parts
update public.set_songs set title = 'How Stories Make Vocabulary Stick (full episode)', position = position + 10 where id = '00000000-0000-4000-8000-00000000d101' and title not like '%(full episode)';

select title, unit, also_units, jsonb_array_length(lines) as lines, (lines->0->>'t') as first_t, (lines->-1->>'e') as last_e,
       (select count(*) from public.set_song_words w where w.song_id = g.id) as words
from public.set_songs g where kind = 'dialog' order by position;
