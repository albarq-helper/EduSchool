# builds supabase_v85b_cognates_fr.sql from cognates_fr.txt (term|english look-alike|group|F|note)
import os
here=os.path.dirname(__file__)
rows=[]
for l in open(os.path.join(here,'cognates_fr.txt'),encoding='utf8'):
    l=l.rstrip('\n')
    if not l: continue
    p=l.split('|'); p+=['']*(5-len(p))
    fr,en,g,k,n=p[:5]
    rows.append((fr,en,(g or en).lower(),'false_friend' if k=='F' else 'cognate',n))
q=lambda s:"'"+s.replace("'","''")+"'"
v=",\n".join("  (%s,%s,%s,%s,%s)"%tuple(q(x) for x in r) for r in rows)
sql=f"""-- =====================================================================
-- Helper Academy — v85b: French look-alikes (cognates) for the study words, bound into families
--   Keyed by the French word that is already saved in word_translations, so every study word that was taught
--   with that French word gets its look-alike. The similarity % is filled by the database itself. Safe to re-run. Run AFTER v85.
-- =====================================================================
create temporary table _cog (fr text, en text, grp text, kind text, note text);
insert into _cog values
{v};

insert into public.cognate_groups (key) select distinct grp from _cog on conflict (key) do nothing;

insert into public.word_cognates (word_id, lang, term, en_word, en_word_id, group_id, kind, note, source)
select t.word_id, 'fr', t.term, x.en,
       (select w.id from public.words w where w.lang = 'en' and lower(w.headword) = lower(x.en) order by w.sense limit 1),
       (select cg.id from public.cognate_groups cg where cg.key = x.grp), x.kind, x.note, 'ai'
from _cog x join public.word_translations t on t.lang = 'fr' and t.term = x.fr
on conflict (word_id, lang, en_word) do update
  set term = excluded.term, en_word_id = excluded.en_word_id, group_id = excluded.group_id, kind = excluded.kind, note = excluded.note
  where public.word_cognates.status <> 'reviewed';

drop table _cog;

select count(*) as cognate_rows, count(distinct group_id) as families, count(*) filter (where kind = 'false_friend') as false_friends from public.word_cognates;
"""
open(os.path.join(here,'..','..','supabase_v85b_cognates_fr.sql'),'w',encoding='utf8').write(sql)
print(len(rows),'rows')
