# v68: 😊 smile · grin · smirk · laugh … two meters (how big, how kind), two difference cards, and links to personality signs
q = lambda s: "null" if s is None else "'" + str(s).replace("'", "''") + "'"
OWNER = "(select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')"
SET = "'00000000-0000-4000-8000-00000000d1ff'"
WID = lambda hw: f"(select id from public.words where lang = 'en' and lower(headword) = lower({q(hw)}) order by (sense = '') desc limit 1)"
BIG, KIND = "Smile → Burst out laughing", "Mocking ⇄ Warm"
# headword, emoji, meaning, example, arabic, tags (big level, kind level)
W = [
 ("Smile", "😊", "To turn up the corners of your mouth because you are happy or friendly.", "She [smiled] when she saw her grandma.", "يبتسم", ["≈ Smile", "⇄ Mocking vs. warm: warm"], 1, 2),
 ("Grin", "😁", "A big, wide smile that shows your teeth.", "He had a huge [grin] after scoring the goal.", "ابتسامة عريضة", ["≈ Smile"], 2, None),
 ("Beam (smile)", "🤩", "To smile very widely because you are so happy or proud.", "Mum [beamed] when I showed her my certificate.", "يبتسم ابتسامة مشرقة", ["≈ Smile", "⇄ Mocking vs. warm: warm"], 2, 3),
 ("Chuckle", "🤭", "To laugh quietly, often to yourself.", "Grandpa [chuckled] at the old photo.", "يضحك بهدوء", ["≈ Laugh"], 3, None),
 ("Giggle", "😆", "To laugh in a light, silly way that is hard to stop.", "The girls [giggled] at the funny puppy.", "يقهقه بخفة (يكركر)", ["≈ Laugh"], 3, None),
 ("Burst out laughing", "🤣", "To suddenly start laughing loudly.", "We all [burst out laughing] when the cake fell on Dad's head.", "ينفجر ضاحكًا", ["≈ Laugh", "Phrasal verb"], 5, None),
 ("Smirk", "😏", "A small, one-sided smile that shows you feel smug or pleased that someone else has a problem.", "He [smirked] when his rival dropped the ball.", "ابتسامة متعالية (ساخرة)", ["⇄ Mocking vs. warm: mocking"], None, -1),
 ("Snicker", "🤭", "To laugh quietly in an unkind way, often behind someone's back.", "Two boys [snickered] when she tripped.", "يضحك بخبث وبصوت خافت", ["⇄ Mocking vs. warm: mocking"], None, -2),
 ("Sneer", "😒", "To show with your face or words that you think someone is worthless.", "She [sneered] at his old shoes.", "يزدري، يبتسم باحتقار", ["⇄ Mocking vs. warm: mocking"], None, -3),
 ("Cackle", "🧙", "To laugh loudly in a harsh, unkind way, like a villain.", "The witch [cackled] as she stirred the pot.", "يقهقه بخبث", ["⇄ Mocking vs. warm: mocking"], None, -3),
 ("Laugh at", "👉", "To laugh to make fun of someone.", "It's not kind to [laugh at] someone who falls.", "يضحك على (يسخر من)", ["Phrasal verb", "⇄ Mocking vs. warm: mocking"], None, -2),
 ("Laugh with", "🤝", "To laugh together with someone, sharing the fun.", "Good friends [laugh with] you, not at you.", "يضحك مع", ["⇄ Mocking vs. warm: warm"], None, 2),
]
out = ["""-- =====================================================================
-- Helper Academy — v68: 😊 smile · grin · beam · chuckle · giggle · laugh · burst out laughing · smirk · snicker · sneer · cackle · laugh at / with
--   meters "Smile → Burst out laughing" (how big) and "Mocking ⇄ Warm" (how kind); difference cards Smile ≠ Smirk, Laughing with ≠ Laughing at;
--   signs for characters: smirks & sneers, laughs at people — linked to arrogance, malicious envy, bullying, narcissism, empathy and humour.
-- Built by tools/words/build_v68.py. Safe to re-run. Run AFTER v67.
-- ====================================================================="""]
for hw, emo, m, ex, ar, tags, big, kind in W:
    t = ["Action" if "Phrasal verb" not in tags else "", "Feelings & moods", "Getting along"] + tags
    if big is not None: t.append(f"📶 {BIG}: {big}")
    if kind is not None: t.append(f"📶 {KIND}: {'+' if kind > 0 else ''}{kind}")
    t = [x for x in t if x]
    out.append(f"""insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', {q(hw)}, '', {q(m)}, {q(ex)}, {q(ar)}, '', '', {q(emo)}, '', '', array[{",".join(q(x) for x in t)}]::text[], {OWNER}
where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = lower({q(hw)}));
update public.words set tags = (select array(select distinct x from unnest(tags || array[{",".join(q(x) for x in t)}]::text[]) x order by x)) where id = {WID(hw)};
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id) select md5('smile-set:' || w.id)::uuid, {SET}, 600, 'term', 1, '{{}}', w.id
from public.words w where w.id = {WID(hw)} and not exists (select 1 from public.set_entries e where e.set_id = {SET} and e.word_id = w.id) on conflict (id) do nothing;""")
# Laugh (existing) on the big meter
out.append(f"update public.words set tags = (select array(select distinct x from unnest(tags || array['≈ Laugh', {q('📶 ' + BIG + ': 4')}]::text[]) x order by x)) where id = {WID('Laugh')};")
out.append(f"insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id) select md5('smile-set:' || w.id)::uuid, {SET}, 600, 'term', 1, '{{}}', w.id from public.words w where w.id = {WID('Laugh')} and not exists (select 1 from public.set_entries e where e.set_id = {SET} and e.word_id = w.id) on conflict (id) do nothing;")
# ≠ cards
D = [("smile-smirk", "Smile ≠ Smirk", "A smile is warm and shares happiness; a smirk is a small, one-sided smile that shows someone feels superior or is pleased about another person's trouble.",
      "الابتسامة دافئة وتشارك الفرح، أما الابتسامة المتعالية (smirk) فنصف ابتسامة تُظهر التعالي أو الشماتة بمصيبة الآخر.",
      "When Mia won, Noor smiled; Salwa smirked.", "Psychologists see the one-sided lip raise as the face of contempt (Ekman & Friesen, 1986).",
      [("Smile", "Warm and friendly: shares happiness with others.", "ابتسامة"), ("Smirk", "One-sided and smug: feels better than someone, or enjoys their trouble.", "ابتسامة متعالية / شماتة")]),
     ("laugh-with-at", "Laughing with ≠ Laughing at", "Laughing with someone shares the fun and everyone enjoys it; laughing at someone makes fun of them and hurts.",
      "الضحك مع الآخرين مشاركة في المرح، أما الضحك عليهم فسخرية تجرح.",
      "If the person isn't laughing too, you're laughing at them, not with them.", None,
      [("Laugh with", "Laughing together; everyone is enjoying it.", "يضحك مع"), ("Laugh at", "Laughing to make fun of someone; it hurts.", "يضحك على")])]
for p, (key, title, summ, summ_ar, ex, note, parts) in enumerate(D):
    out.append(f"insert into public.word_differences (key, title, unit, min_age, summary, summary_ar, example, note, position) values ({q(key)},{q(title)},1,0,{q(summ)},{q(summ_ar)},{q(ex)},{q(note)},{60 + p}) on conflict (key) do update set title=excluded.title, summary=excluded.summary, summary_ar=excluded.summary_ar, example=excluded.example, note=excluded.note;")
    for n, (hw, e, ar) in enumerate(parts):
        out.append(f"insert into public.word_difference_parts (diff_key, word_id, explain, explain_ar, position) select {q(key)}, {WID(hw)}, {q(e)}, {q(ar)}, {n} on conflict (diff_key, word_id) do update set explain = excluded.explain, explain_ar = excluded.explain_ar;")
        out.append(f"update public.words set tags = (select array(select distinct x from unnest(tags || array[{q('≠ ' + title)}]) x order by x)) where id = {WID(hw)};")
# 🔎 personality signs + links
out.append("""insert into public.signs (key, icon, name, category, min_age, about, academic, position) values
 ('smirks_sneers', '😼', 'Smirks and sneers at others', 'relationships', 7, 'Gives a smug half-smile, or a look of disgust, when someone makes a mistake or has a problem.',
  'Smirking and sneering are facial displays of contempt (a one-sided lip-corner raise), signalling superiority or schadenfreude; contempt is one of Gottman''s "Four Horsemen" that predict relationship breakdown.', 220),
 ('laughs_at_others', '👉', 'Laughs at people, not with them', 'relationships', 6, 'Makes fun of people and laughs when they are hurt or embarrassed.',
  'Disparagement humour and ridicule aimed at a target; a common form of verbal and relational bullying.', 221)
on conflict (key) do update set icon=excluded.icon, name=excluded.name, category=excluded.category, min_age=excluded.min_age, about=excluded.about, academic=excluded.academic, position=excluded.position;
insert into public.condition_signs (condition, sign, weight) values
 ('narcissistic','smirks_sneers',1), ('grandiose_narcissism','smirks_sneers',2), ('malicious_envy','smirks_sneers',2), ('toxic','smirks_sneers',1),
 ('bullying','laughs_at_others',3), ('bullying','smirks_sneers',1), ('sadism','laughs_at_others',2), ('silent_assassination','smirks_sneers',1)
on conflict do nothing;
delete from public.trait_links where src_key in ('smirks_sneers','laughs_at_others') or dst_key in ('smirks_sneers','laughs_at_others');
insert into public.trait_links (src_type, src_key, src_level, dst_type, dst_key, dst_level, effect, strength, note) values
 ('sign','arrogant_attitude',null,'sign','smirks_sneers',null,'raises',2,'Feeling above others shows on the face.'),
 ('sign','schadenfreude',null,'sign','smirks_sneers',null,'raises',2,'Enjoying someone''s trouble often leaks out as a smirk.'),
 ('trait','confidence','high','sign','smirks_sneers',null,'raises',1,null),
 ('trait','empathy','low','sign','laughs_at_others',null,'raises',2,null),
 ('trait','humour','high','sign','laughs_at_others',null,'raises',1,'Jokes that hurt are the dark side of humour.'),
 ('root','copied_models',null,'sign','laughs_at_others',null,'raises',1,null),
 ('trait','empathy','mid','sign','laughs_at_others',null,'lowers',2,null),
 ('trait','humour','mid','sign','laughs_at_others',null,'lowers',2,'Kind humour laughs with people.'),
 ('sign','laughs_at_others',null,'condition','bullying',null,'raises',2,null);
insert into public.advice (target_type, target_key, word_id, position)
select v.t, v.k, w.id, 0 from (values ('sign','laughs_at_others'), ('trait','humour')) as v(t, k), public.words w
where w.headword = 'Laugh, and the world laughs with you.' and w.sense = '' on conflict do nothing;
update public.characters set signs = signs || '{"smirks_sneers":2}'::jsonb where id in (md5('char:Max the Show-off')::uuid, md5('char:Salwa')::uuid, md5('char:Victor')::uuid);
update public.characters set signs = signs || '{"laughs_at_others":3,"smirks_sneers":1}'::jsonb where id = md5('char:Omar')::uuid;
update public.characters set signs = signs || '{"laughs_at_others":2}'::jsonb where id = md5('char:Fox the Trickster')::uuid;
update public.characters set signs = signs || '{"laughs_at_others":1}'::jsonb where id = md5('char:Rex the Robot')::uuid;""")
out.append(f"select (select count(*) from public.words where exists (select 1 from unnest(tags) t where t like {q('📶 ' + BIG + '%')})) as big_meter, (select count(*) from public.words where exists (select 1 from unnest(tags) t where t like {q('📶 ' + KIND + '%')})) as kind_meter, (select count(*) from public.signs where key in ('smirks_sneers','laughs_at_others')) as signs;")
open("supabase_v68_smiles.sql", "w").write("\n".join(out) + "\n")
print("ok")
