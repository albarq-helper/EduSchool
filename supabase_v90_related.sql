-- Helper Academy — v90: root_kind 'related' = same family, not the same meaning (shown as "related: word").
alter table public.word_translations drop constraint if exists word_translations_root_kind_check;
alter table public.word_translations add constraint word_translations_root_kind_check
  check (root_kind in ('cognate', 'false_friend', 'related'));

-- Life-threatening ~ mortal (same root mors, but "mortal" mostly means "will die" in English)
update public.word_translations t set root_key = 'mortal', root_en = 'mortal', root_kind = 'related', root_note = ''
  from public.words w
 where w.id = t.word_id and w.lang = 'en' and w.headword = 'Life-threatening' and t.lang in ('fr', 'es', 'it', 'pt');

-- starving / hungry words that come from the same root as famine
update public.word_translations t set root_key = 'famine', root_en = 'famine', root_kind = 'related', root_note = ''
  from public.words w
 where w.id = t.word_id and w.lang = 'en'
   and ((t.lang in ('fr', 'it') and w.headword in ('Starving', 'Starving (no food)', 'Famished', 'Hungry'))
     or (t.lang = 'pt' and w.headword = 'Starving (no food)'))
   and (t.term ilike 'affam%' or t.term ilike 'famin%');
