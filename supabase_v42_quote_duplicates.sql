-- =====================================================================
-- Helper Academy — v42: remove duplicate quotes from Quotes & Sayings
--   * the same quote twice (it was in two videos): keep the first clip, remove the second link
--   * the same quote in slightly different words: keep one, remove the other (and its dictionary entry)
-- Safe to re-run. Run AFTER v41.
-- =====================================================================
-- 1) same quote linked twice
delete from public.set_entries e
 where e.set_id = '00000000-0000-4000-8000-000000009007'
   and exists (select 1 from public.set_entries o where o.set_id = e.set_id and o.word_id = e.word_id
                 and (o.position < e.position or (o.position = e.position and o.id < e.id)));

-- 2) near-identical wording: (remove, keep)
drop table if exists pg_temp.dup;
create temp table dup(remove text, keep text);
insert into dup values
  ('Accept what is. Let go of what was. Have faith in what will be.', 'Accept what is, let go of what was, have faith in what will be.'),
  ('You can''t reach for what''s in front of you until you let go of what''s behind you.', 'You can''t reach what''s in front of you until you let go of what''s behind you.'),
  ('A journey of a thousand miles begins with a single step.', 'The journey of a thousand miles begins with a single step.'),
  ('If you stay positive in a negative situation, you win.', 'If you can stay positive in a negative situation, you win.'),
  ('Breathe. It''s just a bad day, not a bad life. Things will get better. Just wait.', 'Take a deep breath. It''s just a bad day, not a bad life.');

-- keep the clip of the removed one when the kept one has none
update public.set_entries k set audio_url = r.audio_url
  from dup d, public.words wk, public.words wr, public.set_entries r
 where wk.lang = 'en' and lower(wk.headword) = lower(d.keep) and wr.lang = 'en' and lower(wr.headword) = lower(d.remove)
   and k.word_id = wk.id and k.set_id = '00000000-0000-4000-8000-000000009007'
   and r.word_id = wr.id and r.set_id = k.set_id and coalesce(k.audio_url, '') = '' and coalesce(r.audio_url, '') <> '';

delete from public.set_entries e using dup d, public.words w
 where w.lang = 'en' and lower(w.headword) = lower(d.remove) and e.word_id = w.id
   and exists (select 1 from public.words k where k.lang = 'en' and lower(k.headword) = lower(d.keep));
delete from public.words w using dup d
 where w.lang = 'en' and lower(w.headword) = lower(d.remove) and w.sense = ''
   and not exists (select 1 from public.set_entries e where e.word_id = w.id);

-- check
select (select count(*) from public.set_entries where set_id = '00000000-0000-4000-8000-000000009007') as quotes,
       (select count(*) - count(distinct word_id) from public.set_entries where set_id = '00000000-0000-4000-8000-000000009007') as still_linked_twice;
