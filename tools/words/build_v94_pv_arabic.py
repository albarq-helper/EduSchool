#!/usr/bin/env python3
"""Build supabase_v94a/b/c_pv_arabic.sql: Arabic meanings for the imported phrasal verbs (+ removal of 18 unsuitable meanings)."""
import json, os
here = os.path.dirname(os.path.abspath(__file__)); root = os.path.join(here, "..", "..")
q = lambda s: "'" + s.replace("'", "''") + "'"
rows = json.load(open(os.path.join(here, "pv", "pv_rows.json")))
ar = {int(k): v for k, v in json.load(open(os.path.join(here, "pv", "ar_all.json"))).items()}
# sense label as in build_v92: "" for first meaning of a headword, "meaning n" afterwards (same order as v92)
seen = {}; items = []
for i, (h, s, m) in enumerate(rows):
    items.append((h.lower(), s, ar[i]))
keep = [x for x in items if x[2] != "X"]; drop = [x for x in items if x[2] == "X"]
n = -(-len(keep) // 3)
for ci, L in enumerate("abc"):
    ch = keep[ci*n:(ci+1)*n]
    out = [f"-- Helper Academy — v94{L}: Arabic meanings for the imported phrasal verbs (part {ci+1} of 3). Safe to re-run.\n"]
    if ci == 0 and drop:
        out.append("-- remove meanings that are not suitable for a 10-year-old (they were imported by mistake in v92)\n")
        cond = " or ".join(f"(lower(w.headword) = {q(h)} and w.sense = {q(s)})" for h, s, _ in drop)
        out.append(f"delete from public.set_entries se using public.words w where se.word_id = w.id and 'Phrasal verb' = any(w.tags) and ({cond});\n")
        out.append(f"delete from public.words w where 'Phrasal verb' = any(w.tags) and ({cond});\n\n")
    out.append("update public.words w set translation = v.a from (values\n")
    out.append(",\n".join(f"  ({q(h)}, {q(s)}, {q(a)})" for h, s, a in ch))
    out.append("\n) as v(h, s, a) where w.lang = 'en' and lower(w.headword) = v.h and w.sense = v.s and 'Phrasal verb' = any(w.tags);\n\n")
    out.append("select count(*) as with_arabic from public.words where 'Phrasal verb' = any(tags) and coalesce(translation,'') <> '';\n")
    open(os.path.join(root, f"supabase_v94{L}_pv_arabic.sql"), "w").write("".join(out))
print(len(keep), "translations;", len(drop), "removed")
