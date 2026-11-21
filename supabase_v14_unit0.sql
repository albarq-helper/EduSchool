-- Helper Academy — v14: Unit 0 (grammar words) clips, and the new Behead clip (throne-room scene). Safe to run more than once.
update public.set_items i set video_url = 'assets/videos/' || v.slug || '.mp4?v=' || v.ver
from (values ('Department (Dept.)','department','20261121'),('Abbreviation','abbreviation','20261121'),('Behead','behead','20261121b')) as v(term, slug, ver)
where i.set_id = '00000000-0000-4000-8000-000000000005' and i.term = v.term;
