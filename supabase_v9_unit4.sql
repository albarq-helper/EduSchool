-- =====================================================================
-- Helper Academy — v9: Unit 4 word clips (safe to run more than once)
-- =====================================================================
update public.set_items i set video_url = 'assets/videos/' || v.slug || '.mp4?v=20261119'
from (values ('Relentlessly','relentlessly'),('Starving','starving'),('Nervous','nervous'),('Ferocious','ferocious'),
             ('Deliberately','deliberately'),('Brilliant','brilliant')) as v(term, slug)
where i.set_id = '00000000-0000-4000-8000-000000000005' and i.term = v.term;
