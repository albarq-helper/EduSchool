-- =====================================================================
-- Helper Academy — v34: link famous sayings to words by meaning
--   A saying is linked to a word when they share a similar-words group (≈) or the same side of an opposite (⇄).
--   This adds those idea tags to the sayings (and "keep going" to the never-give-up words), so e.g.
--   Relentlessly → "Fall seven times, stand up eight." The site finds the links by itself from the tags.
-- Safe to re-run. Run AFTER v33.
-- =====================================================================
create or replace function pg_temp.tag(p_head text, p_tags text[]) returns void language sql as $$
  update public.words set tags = (select array(select distinct t from unnest(tags || p_tags) t order by t)), updated_at = now()
  where lang = 'en' and sense = '' and lower(headword) = lower(p_head);
  update public.set_entries set tags = (select array(select distinct t from unnest(tags || p_tags) t order by t))
  where tags is not null and word_id in (select id from public.words where lang = 'en' and sense = '' and lower(headword) = lower(p_head));
$$;
select pg_temp.tag(h, t) from (values
  -- never give up
  ('Fall seven times, stand up eight.',                         array['≈ Without stopping','⇄ Give up vs. keep going: keep going']),
  ('Where there''s a will, there''s a way.',                    array['⇄ Give up vs. keep going: keep going','≈ Motivated']),
  ('Little by little, the bird builds its nest.',               array['≈ Without stopping','⇄ Give up vs. keep going: keep going']),
  ('The journey of a thousand miles begins with a single step.',array['⇄ Give up vs. keep going: keep going']),
  ('Rome wasn''t built in a day.',                              array['⇄ Give up vs. keep going: keep going','⇄ Speed up vs. slow down: slow down']),
  ('Genius is one percent inspiration and ninety-nine percent perspiration.', array['⇄ Give up vs. keep going: keep going']),
  ('Whoever works hard finds success; whoever plants, harvests.', array['⇄ Sow vs. harvest: harvest','⇄ Give up vs. keep going: keep going']),
  ('Patience is the key to relief.',                            array['≈ Calm','⇄ Speed up vs. slow down: slow down']),
  ('Look before you leap.',                                     array['⇄ Speed up vs. slow down: slow down']),
  ('Two heads are better than one.',                            array['⇄ Together vs. alone: together','≈ Help']),
  ('A friend in need is a friend indeed.',                      array['≈ Help','⇄ Together vs. alone: together']),
  ('Honesty is the best policy.',                               array['⇄ Pretend vs. true: true']),
  ('Knowledge is power.',                                       array['≈ Important','≈ Clever']),
  ('Learning when young is like carving in stone.',             array['≈ Important']),
  ('Hope is the thing with feathers.',                          array['≈ Happy','≈ Motivated']),
  ('Time is like a sword: if you do not cut it, it cuts you.',  array['≈ Important']),
  ('Speech is silver, silence is golden.',                      array['≈ Quiet','⇄ Loud vs. quiet: quiet']),
  ('The only true wisdom is in knowing you know nothing.',      array['≈ Clever']),
  ('Imagination is more important than knowledge.',             array['≈ Important','≈ Make']),
  ('I came, I saw, I conquered.',                               array['≈ Brave']),
  ('Well done is better than well said.',                       array['⇄ Pretend vs. true: true']),
  -- the words that mean "keep going"
  ('Relentlessly',  array['⇄ Give up vs. keep going: keep going']),
  ('Consistently',  array['⇄ Give up vs. keep going: keep going']),
  ('Constantly',    array['⇄ Give up vs. keep going: keep going']),
  ('Motivated',     array['⇄ Give up vs. keep going: keep going']),
  ('Sincerity',     array['⇄ Pretend vs. true: true'])
) as x(h, t);

-- check: which words now reach "Fall seven times, stand up eight."
select string_agg(distinct w.headword, ', ') as words_linked_to_fall_seven_times
from public.words s, public.words w
where s.headword = 'Fall seven times, stand up eight.' and w.id <> s.id and w.author = ''
  and exists (select 1 from unnest(s.tags) t where (t like '≈ %' or t like '⇄ %') and t = any(w.tags));
