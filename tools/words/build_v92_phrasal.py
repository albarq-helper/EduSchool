#!/usr/bin/env python3
"""Build supabase_v92a/b/c_phrasal.sql: phrasal verbs from Complete-PV-list.pdf that the site did not have yet."""
import json, os, re
here = os.path.dirname(os.path.abspath(__file__)); root = os.path.join(here, "..", "..")
q = lambda s: "'" + s.replace("'", "''") + "'"
arr = lambda a: "array[" + ",".join(q(t) for t in a) + "]::text[]"
SET = "00000000-0000-4000-8000-00000000f4a5"
OWNER = "'b558b8ee-2ab1-43ca-8778-db03f4bf5f38'::uuid"
NEW_UNITS = {7: "Over, through & across", 8: "Around, about & along", 9: "Into, onto & to", 10: "At, by, from & more"}
UNIT = {"up":1,"down":2,"out":3,"on":4,"off":4,"in":5,"away":5,"back":5,"after":6,"for":6,"with":6,
        "over":7,"through":7,"across":7,"around":8,"about":8,"along":8,"round":8,"into":9,"onto":9,"to":9,"upon":9}
EMO = {1:"⬆️",2:"⬇️",3:"📤",4:"🔛",5:"↔️",6:"🔗",7:"🌉",8:"🔄",9:"➡️",10:"📌"}
GROUPS = [  # (regex on meaning, ≈ group tag)
 (r"\b(hurry|rush|quickly|speed)", "≈ Hurrying"), (r"\bfail|unsuccessful|not succeed", "≈ Fail"),
 (r"\bsucceed|success|achieve|win\b", "≈ Success"), (r"\bannoy|irritat|bother", "≈ Annoyed"),
 (r"\bangry|anger|furious", "≈ Angry"), (r"\bhelp|assist|support", "≈ Help"),
 (r"\bpatien|tolerate|put up with|endure", "≈ Patient"), (r"\bpretend|fake", "≈ Pretend"),
 (r"\blie\b|lying|deceive|trick", "≈ Lying"), (r"work hard|hard work|effort", "≈ Hard work"),
 (r"waste (time|money)|wasting", "≈ Waste time"), (r"\breject|refuse|turn down|say no", "≈ Rejected"),
 (r"\bjoin|connect|attach|combine|unite", "≈ Join"), (r"\bagree|accept", "≈ Agreed"),
 (r"\bthink of|come up with|idea|invent|imagine", "≈ Think of"), (r"\blook at|watch|examine|inspect|search|check", "≈ Look"),
 (r"\blaugh|joke", "≈ Laugh"), (r"\bsmile|grin", "≈ Smile"), (r"\bhurt|injure|wound|harm", "≈ Hurt"),
 (r"\bsad|unhappy|depress|gloomy", "≈ Sad"), (r"\bscare|frighten|afraid|terrif", "≈ Scared"),
 (r"\bshock|surprise|astonish|amaze", "≈ Shocked"), (r"\bexcite|thrill", "≈ Excited"),
 (r"\bcalm|relax|settle down", "≈ Calm"), (r"\bhappy|cheer", "≈ Happy"), (r"\blearn|study|teach", "≈ Learning"),
 (r"\blead|control|in charge|manage|command|boss", "≈ Leaders"), (r"\bmistake|error|wrong", "≈ Mistake"),
 (r"\bexplain|make clear|clarify", "≈ Clear"), (r"\bconfus|puzzle|bewilder", "≈ Confused"),
 (r"\bwant|desire|long for|wish", "≈ Want"), (r"\bcontinue|keep (on|going)|without stopping|not stop", "≈ Without stopping"),
 (r"\bbrave|courage", "≈ Brave"), (r"\bquiet|silent|silence", "≈ Quiet"), (r"\bfamous|well.known", "≈ Famous"),
 (r"\bimportant|matter", "≈ Important"), (r"\bdangerous|danger", "≈ Dangerous"), (r"\bcurious|interest", "≈ Curious"),
 (r"\blazy|idle", "≈ Lazy"), (r"\bhonest|truth", "≈ Honest"), (r"\bmotivat|encourage|inspire", "≈ Motivated"),
 (r"\blove|affection|fond", "≈ Loving"), (r"\bdark|dim", "≈ Dark"), (r"\bstop\b.*\bfriend|\bfriend", "≈ Friend"),
]
THEMES = [
 (r"\b(money|pay|buy|sell|cost|price|job|work|business|sales?|tax|customer|company|bank|spend|earn)\b", "Money & work"),
 (r"\b(sick|ill|body|health|pain|medicine|injur|disease|illness|faint|hurt|tired|sleep)\b", "Health & body"),
 (r"\b(food|eat|drink|cook|meal|hungry|bake)\b", "Food & drink"),
 (r"\b(move|walk|run|jump|enter|leave|arrive|climb|fall|rush|travel|escape|get away|return|go away|go into|go out|come in|reach|approach|follow|pass|carry|push|pull|throw|drop|lift|hold|touch|step)\b", "Ways of moving"),
 (r"\b(say|tell|speak|talk|explain|suggest|ask|answer|argue|shout|mention|discuss|complain)\b", "Saying & thinking"),
 (r"\b(think|remember|forget|decide|idea|understand|realise|realize|plan|guess|believe)\b", "Saying & thinking"),
 (r"\b(feel|angry|happy|sad|upset|calm|worry|worried|nervous|afraid|excited|embarrass|proud)\b", "Feelings & moods"),
 (r"\b(friend|quarrel|relationship|support|forgive|trust|get on|dislike|like each|visit)\b", "Getting along"),
 (r"\b(time|delay|change|become|finish|continue|wait|later|soon|delay|postpone|late|become|change|turn into)\b", "Time & change"),
 (r"\b(danger|safe|protect|risk|accident|escape)\b", "Danger & safety"),
 (r"\b(light|sound|noise|loud|bright)\b", "Light & sound"),
 (r"\b(see|look|watch|examine|notice|search|discover|visit)\b", "Looking & seeing"),
 (r"\b(book|word|write|read|letter|list|page|document|text|paper)\b", "Words & books"),
 (r"\b(place|travel|journey|car|drive|vehicle|road|trip|town|airport)\b", "Places & travel"),
 (r"\b(law|police|crime|punish|court|prison|rule|government)\b", "Government & law"),
 (r"\b(house|room|building|clean|tidy|door|window|home)\b", "Homes & buildings"),
 (r"\b(weather|plant|nature|fire|rain|wind|water|sea|garden)\b", "Plants, nature & weather"),
 (r"\b(animal|dog|bird|horse|fish)\b", "Animals"),
 (r"\b(make|do|fix|repair|use|operate|prepare|produce|build|organi[sz]e|arrange|manage|deal with|handle|complete|finish|attach|connect|fill|cut|break|open|close|cover|remove|add|put|place|set|take|give|get|keep)\b", "How things are done"),
 (r"\b(increase|decrease|reduce|bigger|smaller|amount|distance|size|rise|grow|shrink|lift|lower|extra|total)\b", "Size, amount & distance"),
 (r"\b(behave|polite|rude|kind|brave|honest|lazy|proud)\b", "Character"),
]
def fix_head(h):
    h = re.sub(r"\s*\((?:or )?[^)]*\)", "", h).strip().rstrip("!").strip()
    return h[:1].upper() + h[1:]
def fix_text(t):
    t = re.sub(r"\s+", " ", t).strip()
    if not t: return t
    t = t[0].upper() + t[1:]
    return t if t[-1] in ".!?\"')" else t + "."
raw = json.load(open(os.path.join(here, "pv", "pv_final.json")))
seen = {}; rows = []
for h0, m, e in raw:
    h = fix_head(h0); k = h.lower()
    n = seen.get(k, 0); seen[k] = n + 1
    sense = "" if n == 0 else f"meaning {n+1}"
    m = fix_text(m); e = fix_text(e)
    if "[" not in e:
        fw = h.split()[0]
        e = re.sub(r"\b(%s\w*)" % re.escape(fw[:max(3, len(fw)-2)]), r"[\1]", e, count=1, flags=re.I)
    if len(e) < 8 or "[" not in e: e = ""
    part = h.split()[-1].lower(); u = UNIT.get(part, 10)
    ml = m.lower(); tags = ["Phrasal verb", "Action"]
    th = [n_ for rx, n_ in THEMES if re.search(rx, ml)]
    tags += list(dict.fromkeys(th))[:2] or ["How things are done"]
    tags += list(dict.fromkeys(g for rx, g in GROUPS if re.search(rx, ml)))[:2]
    rows.append((h, sense, u, m, e, EMO[u], tags))
START = 53
open(os.path.join(root, "supabase_v93_pv_tags.sql"), "w").write("-- v93: sharper link tags for the imported phrasal verbs. Safe to re-run.\n" + "".join(
 ("update public.words w set tags = v.tg from (values\n" + ",\n".join(f"  ({q(r[0].lower())}, {q(r[1])}, {arr(r[6])})" for r in rows[i:i+500]) +
  "\n) as v(h, s, tg) where w.lang = 'en' and lower(w.headword) = v.h and w.sense = v.s and 'Phrasal verb' = any(w.tags);\n\n") for i in range(0, len(rows), 500)) + "select count(*) from public.words where 'Phrasal verb' = any(tags);\n")
parts = [rows[i::1] for i in range(1)][0]
size = -(-len(rows) // 6)
unitsql = f"""update public.study_sets set units = units || (
  select coalesce(jsonb_agg(x), '[]'::jsonb) from jsonb_array_elements('[{",".join('{"u": %d, "name": "%s"}' % (k, n) for k, n in NEW_UNITS.items())}]'::jsonb) x
   where not exists (select 1 from jsonb_array_elements(units) o where (o->>'u')::int = (x->>'u')::int))
 where id = '{SET}';
"""
for ci, letter in enumerate("abcdef"):
    chunk = rows[ci*size:(ci+1)*size]
    out = [f"""-- Helper Academy — v92{letter}: phrasal verbs from Complete-PV-list.pdf ({len(chunk)} meanings, part {ci+1} of 6). Safe to re-run.
-- Arabic is left empty on purpose (parent translate button). Generated by tools/words/build_v92_phrasal.py
{unitsql}
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, literal, literal_tr, equivalent, tags, owner_id)
select 'en', v.h, v.s, v.m, v.e, '', '', '', v.j, '', '', '', v.tg, {OWNER}
from (values
"""]
    out.append(",\n".join(f"  ({q(r[0])}, {q(r[1])}, {q(r[3])}, {q(r[4])}, {q(r[5])}, {arr(r[6])})" for r in chunk))
    out.append(") as v(h, s, m, e, j, tg)\non conflict (lang, lower(headword), sense) do nothing;\n\ninsert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)\nselect x.id::uuid, x.s::uuid, x.k, 'term', x.u, '{}', w.id\nfrom (values\n")
    ent = []
    for k, r in enumerate(chunk, start=START + ci*size):
        eid = SET[:24] + "0001" + SET[-4:] + f"{k:04x}"
        ent.append(f"  ({q(eid)}, '{SET}', {k}, {r[2]}, {q(r[0].lower())}, {q(r[1])})")
    out.append(",\n".join(ent))
    out.append(f") as x(id, s, k, u, hw, sn)\njoin public.words w on w.lang = 'en' and lower(w.headword) = x.hw and w.sense = x.sn\non conflict (id) do nothing;\n\nselect count(*) as items_in_set from public.set_entries where set_id = '{SET}';\n")
    open(os.path.join(root, f"supabase_v92{letter}_phrasal.sql"), "w").write("".join(out))
print(len(rows), "rows;", size, "per chunk")
from collections import Counter
print(Counter(r[2] for r in rows)); print(Counter(t for r in rows for t in r[6]).most_common(12))
print(sum(1 for r in rows if not r[4]), "without example")
