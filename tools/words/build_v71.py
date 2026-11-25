# v71: 🦁 predation, 🏆 competition, 🦟 parasitism — how living things live together (biology) and the narcissist's antagonistic attachment (العداء)
q = lambda s: "null" if s is None else "'" + str(s).replace("'", "''") + "'"
A = lambda xs: "array[" + ",".join(q(x) for x in xs) + "]::text[]" if xs else "'{}'::text[]"
OWNER = "(select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')"
SET = "'00000000-0000-4000-8000-00000000d1ff'"
WID = lambda hw: f"(select id from public.words where lang = 'en' and lower(headword) = lower({q(hw)}) order by (sense = '') desc limit 1)"
M = "Enemies ⇄ Partners"
G = "≈ Living together (biology)"
N, D_, S, AN = "Naming: things & places", "Describing", "Science", "Animals"
W = [  # headword, emoji, meaning, example, arabic, tags, meter level
 ("Predation", "🦁", "When one animal hunts, kills and eats another. One gains everything; the other loses its life.",
  "Lions catching zebras is an example of [predation].", "الافتراس", [N, S, AN, G], -3),
 ("Parasitism", "🦟", "When one living thing (the parasite) lives on or inside another (the host) and feeds on it, making it weaker, usually without killing it at once.",
  "Ticks feeding on a dog is an example of [parasitism].", "التطفّل", [N, S, AN, G], -2),
 ("Competition", "🏆", "When living things try to get the same thing and there isn't enough for all: food, water, space, or attention. In nature both sides lose something. In sport or school a fair competition can help you improve; it turns hostile when someone can only win if you lose.",
  "Lions and hyenas are in [competition] for the same food.", "المنافسة", [N, S, AN, G], -1),
 ("Commensalism", "🦈", "When one living thing gains and the other is neither helped nor harmed.",
  "A small remora fish rides along with a shark and eats its leftovers: that is [commensalism].", "المعايشة", [N, S, AN, G], 0),
 ("Mutualism", "🐠", "When two living things help each other and both gain.",
  "The clownfish and the sea anemone live in [mutualism]: each one protects the other.", "المنفعة المتبادلة (التقايض)", [N, S, AN, G], 3),
 ("Symbiosis", "🤝", "Two different living things living closely together. It can help both (mutualism), help one and not touch the other (commensalism), or help one and harm the other (parasitism).",
  "Bees and flowers live in [symbiosis]: the bee gets food and the flower gets pollinated.", "التكافل (العيش المشترك)", [N, S, AN, G], None),
 ("Predator", "🐺", "An animal that hunts and eats other animals. People also use it for someone who hunts for weaker people to hurt or use.",
  "The wolf is a [predator]; it hunts deer in winter.", "مفترس", [N, AN, S, "⇄ Predator vs. prey: predator"], None),
 ("Prey", "🦓", "An animal that is hunted and eaten by another animal.", "The zebra is the lion's [prey].", "فريسة",
  [N, AN, S, "⇄ Predator vs. prey: prey"], None),
 ("Parasite", "🪱", "A living thing that lives on or inside another one and feeds on it. People also call someone a parasite when they live off others and give nothing back.",
  "A tick is a [parasite]: it drinks a dog's blood.", "طفيلي", [N, AN, S, "⇄ Parasite vs. host: parasite"], None),
 ("Host (of a parasite)", "🐕", "The living thing a parasite lives on and feeds from. It gets weaker while the parasite grows.",
  "The dog was the [host] for the ticks until the vet removed them.", "العائل (المضيف)", [N, AN, S, "⇄ Parasite vs. host: host"], None),
 ("Antagonistic", "⚔️", "Working against someone, as an enemy, instead of with them.", "They had an [antagonistic] relationship: one always worked against the other.",
  "عدائي (مُعادٍ)", [D_, "Getting along"], None),
 ("Exploitation", "🪝", "Using someone unfairly to get something for yourself: their money, time, work or care.",
  "Making your little brother do all your chores is [exploitation].", "الاستغلال", [N, "Getting along"], None),
 ("Subjugation", "⛓️", "Forcing someone to obey and keeping them under your control.", "The bully's aim was the [subjugation] of the whole class.",
  "القهر والإخضاع (الهيمنة)", [N, "Getting along"], None),
]
D = [
 ("hostile-three", "Predation ≠ Parasitism ≠ Competition",
  "Three hostile ways living things meet. Predation: one hunts and eats the other. Parasitism: one feeds on the other slowly and makes it weaker. Competition: both want the same thing and there isn't enough. People who live with a narcissist often meet all three: being dominated (predation), being used (parasitism) and being treated as a rival who must lose (competition).",
  "ثلاثة أشكال عدائية: في الافتراس يصطاد كائن الآخر ويأكله، وفي التطفّل يتغذى عليه ببطء فيضعفه، وفي المنافسة يريد الاثنان الشيء نفسه وهو لا يكفي. ومن يعيش مع شخص نرجسي يدرك أن العلاقة عدائية في حقيقتها ويعيش الأشكال الثلاثة: الهيمنة والقهر (افتراس)، والاستغلال (تطفّل)، ومعاملته كمنافس يجب أن يخسر (منافسة).",
  "A lion and a zebra (predation), a tick and a dog (parasitism), lions and hyenas over one meal (competition).",
  "Julie L. Hall (2021) calls the narcissist's way of relating 'antagonistic attachment' and describes it through these three forms from biology.",
  [("Predation", "One hunts and eats the other. In people: dominating and crushing someone.", "الافتراس"),
   ("Parasitism", "One feeds on the other and makes it weaker. In people: living off someone's money, care or status.", "التطفّل"),
   ("Competition", "Both want what isn't enough for all. In people: 'I can only win if you lose.'", "المنافسة")]),
 ("living-together", "Mutualism ≠ Commensalism ≠ Parasitism",
  "When two living things live closely together: in mutualism both gain, in commensalism one gains and the other is not affected, in parasitism one gains and the other is harmed.",
  "في المنفعة المتبادلة يستفيد الطرفان، وفي المعايشة يستفيد أحدهما ولا يتأثر الآخر، وفي التطفّل يستفيد أحدهما ويتضرر الآخر.",
  "A real friendship is like mutualism; a 'friend' who only takes is like a parasite.", None,
  [("Mutualism", "Both gain (clownfish and anemone).", "المنفعة المتبادلة"),
   ("Commensalism", "One gains, the other is fine (remora and shark).", "المعايشة"),
   ("Parasitism", "One gains, the other is harmed (tick and dog).", "التطفّل")]),
 ("dependent-parasite", "Dependent ≠ Parasite",
  "A dependent person really needs help and often suffers from needing it. A parasite (in people) takes on purpose, gives little back, and leaves the giver weaker.",
  "الاتّكالي محتاج فعلًا وكثيرًا ما يتألم من حاجته، أما الطفيلي من البشر فيأخذ عن قصد ولا يردّ إلا القليل، ويترك من يعطيه أضعف.",
  "A sick grandparent who depends on you is not a parasite; someone who makes you pay for everything and uses guilt when you say no behaves like one.", None,
  [("Dependent", "Needs help, and often wishes they didn't.", "اتّكالي"),
   ("Parasite", "Takes on purpose and gives nothing back.", "طفيلي")]),
]
HALL = "Hall, J. L. (2021, August 5). The narcissist's antagonistic attachment: Subjugation, competition, and parasitism. The Narcissist Family Files."
HALL_B = "Hall, J. L. (2019). The Narcissist in Your Life: Recognizing the Patterns and Learning to Break Free. Da Capo Lifelong Books."
ECO = "Begon, M., Townsend, C. R., & Harper, J. L. (2006). Ecology: From Individuals to Ecosystems (4th ed.). Blackwell."
DSM = "American Psychiatric Association. (2022). Diagnostic and Statistical Manual of Mental Disorders (5th ed., text rev.)."
C = [  # key, icon, name, parent, aliases, about, helps, academic, sources, traits, position, (harm, core, core_ar, own, others, others_ar, protect)
 ("antagonistic_attachment", "⚔️", "Antagonistic attachment (a hostile relationship)", None, ["العداء", "ارتباط عدائي"],
  "A relationship that looks close but is hostile underneath: one person treats the other as prey to dominate, a host to feed on, or a rival who must lose. Biology names these three forms predation, parasitism and competition.",
  "Notice the pattern, not just single moments; keep your own friends and interests; get support from people who respect you.",
  "Hall describes narcissistic relating as 'antagonistic attachment', the opposite of cooperative bonding, and maps it onto three antagonistic interactions from ecology: predation (subjugation), competition and parasitism. It overlaps with the exploitativeness and entitlement criteria of narcissistic personality disorder.",
  [HALL, HALL_B, ECO], ["empathy", "boundaries"], 180,
  ("self", "the relationship as a contest", "العلاقة صراع على الهيمنة",
   "Can't feel safe in an equal relationship: someone has to be on top.",
   "Treats you as prey, as a host or as a rival, so your pain is just part of winning.",
   "عندما تدخل في علاقة مع مضطرب نرجسي ستدرك أن العلاقة عدوانية في حقيقتها، وأنك تعيش معه هذه الأشكال العدائية: افتراس، منافسة، تطفّل.",
   "Judge the relationship by how you feel over time; don't try to win their game; keep people around you who are on your side.")),
 ("subjugation", "🦁", "Subjugation (predation in people)", "antagonistic_attachment", ["الافتراس", "القهر", "الهيمنة"],
  "Like a predator with its prey, but without eating: keeping someone down by domination and constant pressure until they give in. It can be loud (shouting, insults, harsh criticism, hurting) or quiet (silent treatment, leaving out, mocking, hidden threats).",
  "Don't give in just to keep the peace; tell a trusted adult; stay close to people who respect you.",
  "Hall: where an animal predator kills its prey, the narcissist 'kills' in other ways, through domination and ongoing oppression, because every relationship is a struggle for dominance. Overt forms include verbal and physical aggression; covert forms include silent treatment, exclusion, ridicule and veiled threats.",
  [HALL, HALL_B], ["boundaries", "assertive"], 181,
  ("self", "power and control", "القوة والسيطرة",
   "Feels weak or threatened unless they are on top.",
   "Pushes you down until you give in, loudly or quietly.",
   "الهدف هو التنمر على الشخص الآخر حتى يخضع.",
   "Name what is happening; don't obey out of fear; keep records and get help from adults or authorities.")),
 ("zero_sum_competition", "🏆", "Zero-sum competition (I win only if you lose)", "antagonistic_attachment", ["المنافسة", "لعبة محصلتها صفر"],
  "Sees other people, even family, as rivals for attention, love, respect and admiration. Life is a game where they can only win if someone else loses, so they keep undermining people around them.",
  "Step out of the race: you don't have to beat them or prove yourself; share your wins with people who are glad for you.",
  "Hall: narcissists relate competitively, treating others (including family) as competitors for tangible and intangible resources (attention, love, inclusion, respect, admiration), in a zero-sum view of life. Typical behaviours: boasting, self-praise, blame, cheating, belittling, double standards and distorting information. Belief in a zero-sum game is also studied as a general social belief.",
  [HALL, "Różycka-Tran, J., Boski, P., & Wojciszke, B. (2015). Belief in a zero-sum game as a social axiom: A 37-nation study. Journal of Cross-Cultural Psychology, 46(4), 525–548."],
  ["mindset", "gratitude"], 182,
  ("self", "winning: if you win, I lose", "لا أفوز إلا إذا خسرتَ",
   "Always feels there isn't enough attention, love or respect to go round.",
   "Undermines you and makes your wins look small, to stay on top.",
   "يعمل باستمرار على تقويض من حوله مع التأكيد على تفوقه واستحقاقه الأكبر لكل شيء.",
   "Don't compete for their approval; keep your goals your own; notice double standards and don't argue the score.")),
 ("parasitism", "🦟", "Parasitism (exploitation in people)", "antagonistic_attachment", ["التطفّل", "الاستغلال"],
  "Like a parasite feeding on its host: living off another person's money, care, status or services, and giving little back. To keep the other person giving, they use guilt, charm, or punishment by going distant.",
  "Give by choice, not by guilt; set limits on money, time and care; notice who only takes.",
  "Hall: parasitism shows in relationships as exploitation; the narcissist manipulates or pressures the other into providing ongoing resources (money, social status, caretaking and other material or emotional services), using guilt induction, seduction, punishment by withdrawal and false promises. 'Interpersonally exploitative' is a DSM criterion for narcissistic personality disorder, and Hare's psychopathy checklist includes a 'parasitic lifestyle'.",
  [HALL, DSM, "Hare, R. D. (2003). Manual for the Hare Psychopathy Checklist–Revised (2nd ed.). Multi-Health Systems."],
  ["boundaries", "empathy"], 183,
  ("goal", "what I can take from you", "ما آخذه منك",
   "Feels entitled and empty inside; lives from what others provide.",
   "Feeds on you like a parasite on its host, and your tiredness doesn't stop them.",
   "يتلاعب أو يجبر الآخر على توفير موارد مستمرة مثل المال أو المكانة أو الرعاية.",
   "Say no without long explanations; don't let guilt decide; protect your money, time and energy.")),
]
out = ["""-- =====================================================================
-- Helper Academy — v71: 🦁 predation, 🏆 competition, 🦟 parasitism — how living things live together, and the narcissist's antagonistic attachment (العداء)
--   13 words (Predation, Parasitism, Competition, Commensalism, Mutualism, Symbiosis, Predator, Prey, Parasite, Host, Antagonistic, Exploitation, Subjugation),
--   meter "Enemies ⇄ Partners", 3 ≠ cards, conditions antagonistic attachment → subjugation / zero-sum competition / parasitism (with pain, core and protect),
--   signs, links, advice and characters. Built by tools/words/build_v71.py. Safe to re-run. Run AFTER v70.
-- ====================================================================="""]
for hw, emo, m, ex, ar, tags, lvl in W:
    t = tags + ([f"📶 {M}: {'+' if lvl > 0 else ''}{lvl}"] if lvl is not None else [])
    out.append(f"""insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', {q(hw)}, '', {q(m)}, {q(ex)}, {q(ar)}, '', '', {q(emo)}, '', '', {A(t)}, {OWNER} where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = lower({q(hw)}));
update public.words set tags = (select array(select distinct x from unnest(tags || {A(t)}) x order by x)) where id = {WID(hw)};
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id) select md5('hostile-set:' || w.id)::uuid, {SET}, 800, 'term', 1, '{{}}', w.id
from public.words w where w.id = {WID(hw)} and not exists (select 1 from public.set_entries e where e.set_id = {SET} and e.word_id = w.id) on conflict (id) do nothing;""")
for p, (key, title, summ, summ_ar, ex, note, parts) in enumerate(D):
    out.append(f"insert into public.word_differences (key, title, unit, min_age, summary, summary_ar, example, note, position) values ({q(key)},{q(title)},1,0,{q(summ)},{q(summ_ar)},{q(ex)},{q(note)},{80 + p}) on conflict (key) do update set title=excluded.title, summary=excluded.summary, summary_ar=excluded.summary_ar, example=excluded.example, note=excluded.note;")
    for n, (hw, e, ar) in enumerate(parts):
        out.append(f"insert into public.word_difference_parts (diff_key, word_id, explain, explain_ar, position) select {q(key)}, {WID(hw)}, {q(e)}, {q(ar)}, {n} on conflict (diff_key, word_id) do update set explain = excluded.explain, explain_ar = excluded.explain_ar;")
        out.append(f"update public.words set tags = (select array(select distinct x from unnest(tags || array[{q('≠ ' + title)}]) x order by x)) where id = {WID(hw)};")
out.append("""
-- 🔎 signs
insert into public.signs (key, icon, name, category, min_age, about, academic, position) values
 ('pushes_to_submit', '🦁', 'Pushes people down until they give in', 'tactics', 8, 'Orders, shouts, insults or criticises harshly, or punishes quietly, until the other person obeys.', 'Dominance and subjugation: overt (verbal or physical aggression) or covert (silent treatment, exclusion, ridicule, veiled threats) pressure to make the other submit.', 224),
 ('takes_never_gives', '🦟', 'Takes and takes, gives little back', 'relationships', 7, 'Expects money, help, care or favours from others and rarely gives anything back.', 'Interpersonal exploitativeness and a parasitic lifestyle: relying on others for resources without reciprocity.', 225)
on conflict (key) do update set icon=excluded.icon, name=excluded.name, category=excluded.category, min_age=excluded.min_age, about=excluded.about, academic=excluded.academic, position=excluded.position;
""")
rows = []
for key, icon, name, parent, al, about, helps, acad, src, tr, pos, _ in C:
    rows.append(f" ({q(key)}, {q(icon)}, {q(name)}, {'idea' if parent is None else 'tactic'!r}, {q(parent)}, null, 8, {A(al)}, {q(about)}, {q(helps)}, {q(acad)}, {A(src)}, {A(tr)}, 16, {pos})")
out.append("-- 🩺 antagonistic attachment and its three forms\ninsert into public.conditions as c (key, icon, name, kind, parent, cluster, min_age, aliases, about, helps, academic, sources, traits, academic_min_age, position) values\n" + ",\n".join(rows) +
           "\non conflict (key) do update set icon=excluded.icon, name=excluded.name, kind=excluded.kind, parent=excluded.parent, min_age=excluded.min_age, aliases=excluded.aliases, about=excluded.about, helps=excluded.helps, academic=excluded.academic, sources=excluded.sources, traits=excluded.traits;")
for key, *_r, (h, core, core_ar, own, oth, oth_ar, prot) in C:
    out.append(f"update public.conditions set harm = {q(h)}, core = {q(core)}, core_ar = {q(core_ar)}, own_pain = {q(own)}, others_pain = {q(oth)}, others_pain_ar = {q(oth_ar)}, protect = {q(prot)} where key = {q(key)};")
out.append("""delete from public.condition_signs where condition in ('antagonistic_attachment','subjugation','zero_sum_competition','parasitism');
insert into public.condition_signs (condition, sign, weight) values
 ('antagonistic_attachment','pushes_to_submit',1), ('antagonistic_attachment','competes_always',1), ('antagonistic_attachment','takes_never_gives',1), ('antagonistic_attachment','lacks_empathy',1),
 ('subjugation','pushes_to_submit',3), ('subjugation','controlling',3), ('subjugation','aggressive',2), ('subjugation','picks_on_weaker',2), ('subjugation','silent_punishment',2), ('subjugation','leaves_out',1), ('subjugation','laughs_at_others',1),
 ('zero_sum_competition','competes_always',3), ('zero_sum_competition','zero_sum',3), ('zero_sum_competition','wants_others_lose',2), ('zero_sum_competition','pulls_down',2), ('zero_sum_competition','double_standard',2),
 ('zero_sum_competition','compares_always',1), ('zero_sum_competition','arrogant_attitude',1), ('zero_sum_competition','turns_tables',1), ('zero_sum_competition','deceitful',1),
 ('parasitism','takes_never_gives',3), ('parasitism','exploits_others',3), ('parasitism','entitlement',2), ('parasitism','guilt_lever',2), ('parasitism','charm_manipulative',2), ('parasitism','silent_punishment',1),
 ('narcissistic','takes_never_gives',2), ('narcissistic','pushes_to_submit',1), ('grandiose_narcissism','takes_never_gives',2), ('malignant_narcissism','pushes_to_submit',3),
 ('psychopathy','takes_never_gives',2), ('antisocial_pd','takes_never_gives',2), ('bullying','pushes_to_submit',2), ('toxic','pushes_to_submit',1)
on conflict do nothing;

-- 🧭 links
delete from public.trait_links where src_key in ('antagonistic_attachment','subjugation','zero_sum_competition','parasitism','pushes_to_submit','takes_never_gives') or dst_key in ('antagonistic_attachment','subjugation','zero_sum_competition','parasitism','pushes_to_submit','takes_never_gives');
insert into public.trait_links (src_type, src_key, src_level, dst_type, dst_key, dst_level, effect, strength, note) values
 ('condition','narcissistic',null,'condition','antagonistic_attachment',null,'raises',3,'Hall: the narcissist relates through predation, competition and parasitism.'),
 ('condition','narcissistic',null,'condition','zero_sum_competition',null,'raises',3,null),
 ('condition','narcissistic',null,'condition','parasitism',null,'raises',2,null),
 ('condition','narcissistic',null,'condition','subjugation',null,'raises',2,null),
 ('condition','malignant_narcissism',null,'condition','subjugation',null,'raises',3,null),
 ('condition','vulnerable_narcissism',null,'condition','zero_sum_competition',null,'raises',2,'Competes quietly, through envy and sulking.'),
 ('condition','psychopathy',null,'condition','parasitism',null,'raises',3,'Hare''s checklist includes a parasitic lifestyle.'),
 ('condition','antisocial_pd',null,'condition','parasitism',null,'raises',2,null),
 ('condition','bullying',null,'condition','subjugation',null,'raises',2,null),
 ('condition','malicious_envy',null,'condition','zero_sum_competition',null,'raises',2,null),
 ('condition','subjugation',null,'condition','social_exclusion',null,'raises',1,'Leaving out is one of the quiet ways to make someone give in.'),
 ('root','scarcity_fear',null,'condition','zero_sum_competition',null,'raises',3,'If there is never enough, everyone becomes a rival.'),
 ('root','fear_not_enough',null,'condition','zero_sum_competition',null,'raises',2,null),
 ('root','situation_power',null,'condition','subjugation',null,'raises',2,null),
 ('root','learned_rewarded',null,'condition','parasitism',null,'raises',1,'Was always given things without having to give back.'),
 ('trait','empathy','low','condition','parasitism',null,'raises',2,null),
 ('trait','empathy','low','condition','subjugation',null,'raises',2,null),
 ('trait','gratitude','low','sign','takes_never_gives',null,'raises',2,null),
 ('trait','empathy','mid','condition','parasitism',null,'lowers',2,null),
 ('trait','gratitude','mid','sign','takes_never_gives',null,'lowers',2,'Gratitude makes people give back.'),
 ('trait','mindset','mid','condition','zero_sum_competition',null,'lowers',2,'An abundance mindset: your win doesn''t take away mine.'),
 ('trait','assertive','low','condition','subjugation',null,'raises',1,'Easier to push down someone who can''t say no.');

-- 📜 advice from the sayings
insert into public.advice (target_type, target_key, word_id, position)
select v.t, v.k, w.id, v.p from (values
 ('condition','antagonistic_attachment','Pay attention to the negative signs that people give off and immediately disconnect from them. It will save you a lot of pain and, more importantly, wasted time.',0), ('condition','antagonistic_attachment','You cannot convince people to love you. No one will ever give you love because you want him or her to give it. Real love moves freely in both directions. Don''t waste your time on anything else.',1), ('condition','antagonistic_attachment','Never confuse people who are always around you with people who are always there for you.',2),
 ('condition','subjugation','Don''t be neutral in the face of injustice. Then, being neutral is not wisdom but fear. You may not stand with the oppressor, but your silence leaves the oppressed alone.',0), ('condition','subjugation','Be alone until you''re valued.',1), ('condition','subjugation','In the end, we will remember not the words of our enemies, but the silence of our friends.',2),
 ('condition','zero_sum_competition','Victory over others gives strength. Victory over oneself gives fearlessness.',0), ('condition','zero_sum_competition','You alone are enough. You have nothing to prove to anyone.',1), ('condition','zero_sum_competition','I never lose. Either I win or I learn.',2),
 ('condition','parasitism','Be kind to people without allowing them to take advantage of your good nature.',0), ('condition','parasitism','Use things, not people. Love people, not things.',1), ('condition','parasitism','Never take the responsibility that does not belong to you.',2),
 ('sign','takes_never_gives','Be kind to people without allowing them to take advantage of your good nature.',0), ('sign','pushes_to_submit','Don''t be neutral in the face of injustice. Then, being neutral is not wisdom but fear. You may not stand with the oppressor, but your silence leaves the oppressed alone.',0)
) as v(t, k, w, p) join lateral (select id from public.words x where x.lang = 'en' and x.headword = v.w order by x.created_at limit 1) w on true on conflict (target_type, target_key, word_id) do update set position = excluded.position;

-- 🎭 characters
update public.characters set cond_levels = cond_levels || '{"antagonistic_attachment":3,"zero_sum_competition":3,"parasitism":2,"subjugation":1}'::jsonb, signs = signs || '{"takes_never_gives":2}'::jsonb,
  conditions = (select array(select distinct unnest(conditions || array['antagonistic_attachment','zero_sum_competition','parasitism','subjugation']))) where id = md5('char:Victor')::uuid;
update public.characters set cond_levels = cond_levels || '{"zero_sum_competition":2,"parasitism":2}'::jsonb, conditions = (select array(select distinct unnest(conditions || array['zero_sum_competition','parasitism']))) where id = md5('char:Nadim')::uuid;
update public.characters set cond_levels = cond_levels || '{"parasitism":3,"subjugation":2}'::jsonb, signs = signs || '{"takes_never_gives":3}'::jsonb, conditions = (select array(select distinct unnest(conditions || array['parasitism','subjugation']))) where id = md5('char:Mr. Wolf')::uuid;
update public.characters set cond_levels = cond_levels || '{"subjugation":2,"zero_sum_competition":2}'::jsonb, signs = signs || '{"pushes_to_submit":2}'::jsonb, conditions = (select array(select distinct unnest(conditions || array['subjugation','zero_sum_competition']))) where id = md5('char:Mr. Basil')::uuid;
update public.characters set cond_levels = cond_levels || '{"subjugation":2}'::jsonb, signs = signs || '{"pushes_to_submit":2}'::jsonb, conditions = (select array(select distinct unnest(conditions || array['subjugation']))) where id = md5('char:Omar')::uuid;
""")
out.append(f"select (select count(*) from public.words where exists (select 1 from unnest(tags) t where t like {q('📶 ' + M + '%')})) as meter, (select count(*) from public.words where {q(G)} = any(tags)) as living_group, (select count(*) from public.conditions where parent = 'antagonistic_attachment') as forms, (select count(*) from public.characters where conditions && array['subjugation','zero_sum_competition','parasitism']) as characters;")
open("supabase_v71_hostile.sql", "w").write("\n".join(out) + "\n")
print("ok")
