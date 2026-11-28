#!/usr/bin/env python3
"""Prepare phrasal verbs from Complete-PV-list.pdf (parsed to /tmp/pvclean.json by position) -> pv/pv_senses.json"""
import json, re, sys, collections
e = json.load(open(sys.argv[1]))
fix = {
 21: ('Answer back', 'To reply rudely to someone in authority.', 'Her mother was shocked when she started ANSWERING her BACK and refusing to help.'),
 1419: ('Hack around', 'Waste time.', "I've been HACKING AROUND all morning because I can't get down to doing any revision."),
 1752: ('Look down on', 'Have a low opinion of.', "He LOOKS DOWN ON his colleagues because he thinks he's better than they are."),
 1807: ('Make up for', 'Compensate.', 'I sent her a present to try to MAKE UP FOR my appalling behaviour.'),
 2743: ('Stick out for', 'Demand a salary raise.', "We're STICKING OUT FOR a 5% increase."),
 3097: ('Walk away with', 'Win easily.', 'She WALKED AWAY WITH the first prize.'),
}
drop = {22, 1420, 1753, 1807 - 0 if False else -1, 3098}
rows = []
for i, x in enumerate(e):
    if i in (22, 1420, 1753, 3098): continue
    if i in fix: v, m, ex = fix[i]
    else: v, m, ex = x[1], x[2], x[3]
    rows.append((v.strip(), m.strip(), ex.strip()))
def cap(v): return v[0].upper() + v[1:]
def bracket(ex):
    ex = re.sub(r'(?<=[a-z])- (?=[a-z])', '-', ex)
    toks = ex.split(' ')
    out = []; i = 0
    isCap = lambda t: re.fullmatch(r"[A-Z][A-Z'’\-]*[A-Z]|[A-Z]", re.sub(r'[.,;:!?"”“)]+$', '', re.sub(r'^[("“]+', '', t))) and re.sub(r'[^A-Za-z]', '', t) not in ('I',)
    while i < len(toks):
        t = toks[i]
        core = re.sub(r'^[("“]+|[.,;:!?"”“)]+$', '', t)
        if re.fullmatch(r"[A-Z][A-Z'’\-]+", core):
            lead = t[:len(t) - len(t.lstrip('("“'))]; tail = t[len(core) + len(lead):]
            word = core.lower()
            if not out and not lead or (out and re.search(r'[.!?]$', out[-1]) ) : word = word.capitalize()
            out.append(lead + '[' + word + ']' + tail)
        else: out.append(t)
        i += 1
    s = ' '.join(out)
    s = re.sub(r'\]\s+\[', ' ', s)           # adjacent caps words -> one bracket
    s = s.replace('] [', ' ')
    # merge "[look] [down]" produced above into [look down]
    return s
res = []
for v, m, ex in rows:
    m = re.sub(r'\.\.+', '.', m)
    if m and m[-1] not in '.!?': m += '.'
    ex = bracket(ex)
    if ex and ex[-1] not in '.!?"\'’”': ex += '.'
    res.append((cap(v), m, ex))
json.dump(res, open('pv/pv_senses.json', 'w'), ensure_ascii=False)
print(len(res)); 
for r in res[:6]: print(r)
c = sum(1 for r in res if '[' not in r[2]); print('no bracket', c)
print([r for r in res if '[' not in r[2]][:8])
