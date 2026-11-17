-- =====================================================================
-- Helper Academy — v8: Unit 6 word clips and the song "Never Gonna Slow Us Down"
-- Run AFTER supabase_v7_song_timing.sql (safe to run more than once).
-- =====================================================================
update public.set_items i set video_url = 'assets/videos/' || v.slug || '.mp4?v=20261117'
from (values ('Stooping','stooping'),('Boughs','boughs'),('Fern','fern'),('Moss','moss'),('Rover','rover'),('Wren','wren'),
             ('Affluent','affluent'),('Majority','majority'),('Simultaneously','simultaneously'),('Renowned','renowned'),
             ('Deteriorating','deteriorating')) as v(term, slug)
where i.set_id = '00000000-0000-4000-8000-000000000005' and i.term = v.term;
