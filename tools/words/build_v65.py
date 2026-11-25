# v65: 🧭 Make or do? — collocations grouped by the rule, with the exceptions marked
q = lambda s: "'" + str(s).replace("'", "''") + "'"
DO = "2adc0e7e-269f-498d-b1d9-0e46e47857d1"; MAKE = "ce45e590-e2ad-481f-b740-c1a6fa05f45b"
G = {
 DO: [
  ("Do: jobs & chores at home", ["do the dishes", "do the laundry", "do the housework", "do the shopping", "do the cleaning", "do the ironing", "do the cooking"]),
  ("Do: school & work", ["do your homework", "do a project", "do research", "do your job", "do business", "do a course"]),
  ("Do: helping, harm & effort", ["do your best", "do a favour", "do good", "do harm", "do damage", "do the right thing"]),
  ("Do: body & sport", ["do exercise", "do yoga", "do your hair", "do your nails"]),
  ("Do: something, nothing, anything", ["do something", "do nothing", "do anything", "do everything"]),
 ],
 MAKE: [
  ("Make: something new (create, build, cook)", ["make a cake", "make dinner", "make a sandwich", "make tea", "make a model", "make a list", "make a plan", "make a film"]),
  ("Make: sounds & words", ["make a noise", "make a speech", "make a phone call", "make a joke", "make a comment", "make a complaint", "make an excuse", "make a suggestion", "make a promise"]),
  ("Make: choices & changes", ["make a decision", "make a choice", "make a change", "make a difference", "make progress", "make an effort", "make sure"]),
  ("Make: results & feelings", ["make a mistake", "make a mess", "make money", "make friends", "make peace", "make someone laugh", "make someone happy"]),
  ("Make: the exception (a home chore, but MAKE)", ["make your bed"]),
 ],
}
NOTES = {"make your bed": "⚠️ Exception", "make dinner": "⚠️ Careful: make dinner, but do the cooking"}
out = ["""-- =====================================================================
-- Helper Academy — v65: 🧭 Make or do?
--   Rule: DO = activities, jobs and chores (do the dishes, do your homework); MAKE = create or produce something new
--   (make a cake, make a decision, make a noise). Exception: make your bed. Partners are grouped by the rule with tags
--   "🧭 <group>"; exceptions also carry "⚠️ …". Partner nouns link to their dictionary words when they exist.
-- Built by tools/words/build_v65.py. Safe to re-run.
-- =====================================================================
alter table public.word_partners add column if not exists tags text[] not null default '{}';"""]
rows = []
for wid, groups in G.items():
    pos = 0
    for g, phrases in groups:
        for ph in phrases:
            pos += 1
            verb, rest = ph.split(" ", 1)
            tags = ["🧭 " + g] + ([NOTES[ph]] if ph in NOTES else [])
            noun = rest.replace("your ", "").replace("the ", "").replace("a ", "").replace("an ", "").replace("someone ", "")
            rows.append(f"({q(wid)}::uuid, 'noun', {q(ph)}, {q(rest)}, {pos}, array[{','.join(q(t) for t in tags)}]::text[], {q(noun)})")
out.append("""insert into public.word_partners (word_id, kind, phrase, partner, position, tags, partner_word_id)
select v.w, v.k, v.ph, v.pa, v.pos, v.tg, (select x.id from public.words x where x.lang = 'en' and lower(x.headword) = lower(v.noun) and x.sense = '' limit 1)
from (values
""" + ",\n".join(rows) + """
) as v(w, k, ph, pa, pos, tg, noun)
where exists (select 1 from public.words y where y.id = v.w)
on conflict (word_id, lower(phrase)) do update set kind = excluded.kind, partner = excluded.partner, position = excluded.position, tags = excluded.tags,
  partner_word_id = coalesce(excluded.partner_word_id, word_partners.partner_word_id);""")
out.append(f"""update public.words set meaning = 'To carry out an action, a job or a chore (do the dishes, do your homework). Rule: DO for activities and jobs; MAKE when something new is created.' where id = {q(DO)};
update public.words set meaning = 'To create or produce something that wasn''t there before (make a cake, make a decision, make a noise). Rule: MAKE when something new comes out; DO for activities and jobs. Exception: make your bed.' where id = {q(MAKE)};
select (select count(*) from public.word_partners where word_id = {q(DO)}) as do_partners, (select count(*) from public.word_partners where word_id = {q(MAKE)}) as make_partners,
       (select count(*) from public.word_partners where word_id in ({q(DO)}, {q(MAKE)}) and partner_word_id is not null) as linked_to_words;""")
open("supabase_v65_make_do.sql", "w").write("\n".join(out) + "\n")
print(len(rows))
