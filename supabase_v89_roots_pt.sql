-- Helper Academy — v89: Portuguese joins the same root families (copied from Spanish, which is closest).
-- Run AFTER pt translations are loaded (tools/words/pt.txt). Safe to re-run.
update public.languages set enabled = true where code = 'pt';

update public.word_translations t
   set root_key = f.root_key, root_en = f.root_en, root_kind = f.root_kind, root_note = f.root_note
  from public.word_translations f
 where f.lang = 'fr' and f.word_id = t.word_id and f.root_key is not null and t.lang = 'pt';

update public.word_translations
   set root_key = null, root_en = null, root_sim = null, root_kind = 'cognate', root_note = ''
 where lang = 'pt' and root_kind = 'cognate' and root_key is not null and coalesce(root_sim, 0) < 40;

update public.word_translations set root_key = null, root_en = null, root_sim = null, root_kind = 'cognate', root_note = ''
 where lang = 'pt' and root_kind = 'false_friend' and root_en ilike 'surname';

update public.word_translations t
   set root_key = v.en, root_en = v.en, root_kind = 'false_friend', root_note = v.note
  from (values
    ('sensível',   'sensible',      'means sensitive, not sensible'),
    ('decepção',   'deception',     'means disappointment, not deception'),
    ('compreensivo','comprehensive','means understanding, not comprehensive')
  ) as v(term, en, note)
 where t.lang = 'pt' and lower(t.term) = v.term;
