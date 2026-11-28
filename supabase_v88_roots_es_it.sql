-- Helper Academy — v88: Spanish + Italian join the same root families as French.
-- Run AFTER v87b and after es/it translations are loaded (tools/words/es_it.txt). Safe to re-run.
update public.languages set enabled = true where code in ('es', 'it');

-- 1) copy the French root link (same English look-alike / family key) onto the es + it rows of the same word
update public.word_translations t
   set root_key = f.root_key, root_en = f.root_en, root_kind = f.root_kind, root_note = f.root_note
  from public.word_translations f
 where f.lang = 'fr' and f.word_id = t.word_id and f.root_key is not null
   and t.lang in ('es', 'it');

-- 2) the look-alike is not close enough in es/it: drop the link (cognates under 40% are never shown)
update public.word_translations
   set root_key = null, root_en = null, root_sim = null, root_kind = 'cognate', root_note = ''
 where lang in ('es', 'it') and root_kind = 'cognate' and root_key is not null and coalesce(root_sim, 0) < 40;

-- 3) French-only false friends do not carry over
update public.word_translations set root_key = null, root_en = null, root_sim = null, root_kind = 'cognate', root_note = ''
 where lang in ('es', 'it') and root_kind = 'false_friend' and root_en ilike 'surname';

-- 4) Spanish / Italian false friends
update public.word_translations t
   set root_key = v.en, root_en = v.en, root_kind = 'false_friend', root_note = v.note
  from (values
    ('es', 'sensible',   'sensitive',   'sensitive', 'es: means sensitive, not sensible'),
    ('es', 'decepción',  'deception',   'deception', 'es: means disappointment, not deception'),
    ('es', 'comprensivo','comprehensive','comprehensive', 'es: means understanding, not comprehensive'),
    ('it', 'sensibile',  'sensitive',   'sensitive', 'it: means sensitive, not sensible'),
    ('it', 'delusione',  'delusion',    'delusion', 'it: means disappointment, not delusion'),
    ('it', 'comprensivo','comprehensive','comprehensive', 'it: means understanding, not comprehensive')
  ) as v(lang, term, en, k, note)
 where t.lang = v.lang and lower(t.term) = v.term;
