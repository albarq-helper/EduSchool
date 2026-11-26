# v82: 🗣️ firm vs. angry — a moment (snapped, raised his voice…) is not a personality (short-tempered, aggressive…)
q = lambda s: "null" if s is None else "'" + str(s).replace("'", "''") + "'"
A = lambda xs: "array[" + ",".join(q(x) for x in xs) + "]::text[]" if xs else "'{}'::text[]"
OWNER = "(select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')"
SET = "'00000000-0000-4000-8000-00000000d1ff'"  # Not the Same: Words People Mix Up · unit 1 Feelings & relationships
WID = lambda hw: f"(select id from public.words where lang = 'en' and lower(headword) = lower({q(hw)}) order by (sense = '') desc limit 1)"
MOM = "Calm → Violent (one moment)"
PER = "Even-tempered → Abusive (a personality)"
ACT, DES, IDI, NAM = "Action", "Describing", "Idiom", "Naming: things & places"
FEEL, GET, SAY, CHAR = "Feelings & moods", "Getting along", "Saying & thinking", "Character"
VOICE, TEMPER = "≈ Raising your voice", "≈ Short-tempered"
# headword, emoji, meaning, example, arabic, tags, (meter, level) or None
W = [
 # 🗣️ one moment: what someone DID once
 ("Said firmly", "💬", "Said something clearly and seriously, so you know they mean it. No shouting and no anger needed.",
  "Mum [said firmly], 'No phones at dinner.'", "قال بحزم", [ACT, SAY], (MOM, 0)),
 ("Spoke sternly", "🧐", "Spoke in a serious, strict voice to show something is not OK. Not loud.",
  "The teacher [spoke sternly] to the boys who were running in the corridor.", "تكلّم بصرامة", [ACT, SAY], (MOM, 0)),
 ("Raised his voice", "🔊", "Spoke louder than usual, usually just once, to be heard or to stop something. It does not mean he screamed.",
  "Dad [raised his voice] to stop the argument: 'Enough!'", "رفع صوته", [IDI, SAY, VOICE], (MOM, 1)),
 ("Spoke sharply", "⚡", "Said something quickly and a little harshly because they were annoyed.",
  "'Sit down,' she [spoke sharply], then smiled again.", "تكلّم بحدّة", [ACT, SAY], (MOM, 1)),
 ("Snapped at", "🗯️", "Said a few short, sharp words suddenly because they were irritated. It is over in a second.",
  "When his sister kept poking him, he [snapped at] her: 'Stop it!'", "شخط فيه / نهره", [ACT, SAY, VOICE], (MOM, 2)),
 ("Barked", "🐕", "Gave a short, loud order, like a dog's bark.", "The coach [barked], 'Run!' and everyone ran.", "زعق بأمر",
  [ACT, SAY, VOICE], (MOM, 2)),
 ("Told off", "☝️", "Spoke angrily to someone about something wrong they did; scolded them.", "The teacher [told off] Sami for copying.", "وبّخه",
  ["Phrasal verb", SAY], (MOM, 2)),
 ("Shouted", "📢", "Said something very loudly, to be heard far away or because of anger. Shouting is not always angry: you can shout 'Goal!'",
  "She [shouted] across the playground, 'Wait for me!'", "صاح", [ACT, SAY, VOICE], (MOM, 3)),
 ("Yelled", "😠", "Shouted loudly and angrily, often for a while.", "He [yelled] at his brother for breaking the game.", "صرخ عليه",
  [ACT, SAY, VOICE], (MOM, 3)),
 ("Screamed", "😱", "Made a very loud, high cry, out of control, from great anger or fear.", "She [screamed] when she saw the snake.", "صرخ بهستيريا",
  [ACT, SAY, VOICE], (MOM, 4)),
 ("Lost his temper", "🌋", "Suddenly could not control his anger any more.", "He [lost his temper] and slammed the door.", "فقد أعصابه",
  [IDI, FEEL], (MOM, 4)),
 ("Blew up", "💥", "Suddenly became very angry and loud, like something exploding.", "When she saw the mess, Mum [blew up].", "انفجر غضبًا",
  ["Phrasal verb", FEEL], (MOM, 4)),
 ("Lashed out", "👊", "Suddenly attacked someone, with hurtful words or with a hand, because of anger.", "He [lashed out] and pushed his friend.", "هاجم فجأة",
  ["Phrasal verb", FEEL], (MOM, 5)),
 ("Hit", "✋", None, None, None, [], (MOM, 5)),
 # 🧠 a personality: what someone is LIKE, again and again
 ("Even-tempered", "😌", "Usually calm; does not get angry quickly, even when things go wrong.", "Grandpa is [even-tempered]; he never shouts.", "هادئ الطبع",
  [DES, CHAR], (PER, 0)),
 ("Patient", "🕰️", None, None, None, [], (PER, 0)),
 ("Firm", "🧱", None, None, None, [], (PER, 1)),
 ("Strict", "📏", "Makes people follow the rules and does not let them break them. Strict is not the same as angry.",
  "Our coach is [strict] about being on time, but he is always kind.", "صارم", [DES, CHAR], (PER, 1)),
 ("Irritable", "😤", "Gets annoyed easily and quickly, often over small things.", "When he is tired, he gets [irritable].", "سريع الانفعال (نَزِق)",
  [DES, CHAR, TEMPER], (PER, 2)),
 ("Short-tempered", "🧨", "Gets angry very quickly and often: a short fuse.", "Don't joke with him in the morning; he is [short-tempered].", "عصبي / سريع الغضب",
  [DES, CHAR, TEMPER], (PER, 3)),
 ("Hot-tempered", "🔥", "Has a hot, quick temper: gets angry fast and strongly.", "The [hot-tempered] king shouted at everyone.", "حادّ الطبع",
  [DES, CHAR, TEMPER], (PER, 3)),
 ("Aggressive", "😾", None, None, None, [], (PER, 4)),
 ("Abusive", "⛔", "Hurts other people again and again with cruel words or actions. It is never OK, and it is never the victim's fault.",
  "Shouting insults at someone every day is [abusive].", "مسيء / مؤذٍ", [DES, CHAR, GET], (PER, 5)),
 ("Violent", "💢", "Uses physical force to hurt people or break things.", "A [violent] storm or a [violent] person can cause harm.", "عنيف",
  [DES, CHAR, "Danger & safety"], (PER, 5)),
 # 🔍 telling it fairly
 ("Exaggerate", "🎈", "To make something sound bigger, worse or better than it really was.", "He only said 'Enough!' once; saying he 'screamed' is to [exaggerate].",
  "يبالغ", [ACT, SAY], None),
 ("Blow out of proportion", "🔍", "To make a small problem seem much bigger and more serious than it is.",
  "One loud 'Stop!' got [blown out of proportion]: now everyone thinks he is an angry man.", "يُضخّم الأمر", [IDI, SAY], None),
 ("Outburst", "🌩️", "A sudden, short burst of strong feeling, like anger, that soon passes.", "After his [outburst], he said sorry.", "نوبة غضب (انفعال مفاجئ)",
  [NAM, FEEL], None),
]
D = [
 ("voice-ladder", "Raised his voice ≠ Snapped ≠ Shouted ≠ Yelled ≠ Screamed",
  "All are louder than talking, but very different: raising your voice is louder once; snapping is a sudden short sharp word; shouting is loud (maybe happy, maybe angry); yelling is loud AND angry, often for a while; screaming is very loud, high and out of control.",
  "كلها أعلى من الكلام العادي لكنها مختلفة جدًا: رفع الصوت مرة واحدة، والشخط كلمة قصيرة حادة مفاجئة، والصياح صوت عالٍ قد يكون فرحًا أو غضبًا، والصراخ عليه غاضب وقد يطول، والصراخ الهستيري عالٍ جدًا وخارج عن السيطرة.",
  "A dad who says 'Enough!' loudly once raised his voice; he did not scream.", None,
  [("Raised his voice", "Louder, once, to be heard or to stop something.", "رفع صوته"),
   ("Snapped at", "A sudden short sharp word, then over.", "شخط"),
   ("Shouted", "Loud; can be happy ('Goal!') or angry.", "صاح"),
   ("Yelled", "Loud and angry, often for a while.", "صرخ عليه"),
   ("Screamed", "Very loud, high, out of control.", "صرخ بهستيريا")]),
 ("moment-personality", "Snapped at (a moment) ≠ Short-tempered (a personality) ≠ Abusive (a pattern)",
  "What someone did ONCE is not who they ARE. Anyone can snap or raise their voice on a bad day. Short-tempered means it happens often. Abusive means hurting someone again and again, which is serious and never OK.",
  "ما فعله الإنسان مرة واحدة لا يعني أنه هكذا دائمًا. أي شخص قد يشخط أو يرفع صوته في يوم سيئ. أما العصبي فيغضب كثيرًا وبسرعة، والمسيء يؤذي الآخرين مرارًا، وهذا خطير ولا يُقبل أبدًا.",
  "'He snapped at me' describes one moment. 'He is short-tempered' describes his personality. Don't turn one moment into a label.",
  "Psychologists separate a state (how someone feels or acts now) from a trait (how they usually are): Spielberger's State-Trait Anger Expression Inventory measures state anger and trait anger separately.",
  [("Snapped at", "One moment: a short sharp word on a bad day.", "لحظة: شخط مرة"),
   ("Short-tempered", "A personality: gets angry quickly and often.", "طبع: عصبي سريع الغضب"),
   ("Abusive", "A pattern: hurts others again and again.", "نمط: يؤذي مرارًا")]),
 ("firm-aggressive", "Firm ≠ Strict ≠ Aggressive",
  "Firm: clear and serious, you know they mean it, but calm. Strict: makes you follow the rules. Aggressive: pushes, shouts or threatens to get their way. Being firm or strict is not being angry.",
  "الحازم واضح وجادّ وهادئ، والصارم يُلزمك بالقواعد، أما العدواني فيدفع ويصرخ ويهدّد ليفرض رأيه. الحزم والصرامة ليسا غضبًا.",
  "'No, you can't go out now. We'll go tomorrow.' said calmly is firm, not aggressive.", None,
  [("Firm", "Clear, serious and calm.", "حازم"), ("Strict", "Makes you follow the rules.", "صارم"), ("Aggressive", "Pushes, shouts or threatens.", "عدواني")]),
 ("tell-it-fairly", "Raised his voice ≠ Screamed: don't exaggerate",
  "How we report what someone did matters. If a husband says 'Enough!' loudly once, the fair words are 'He raised his voice' or 'He snapped at me'. Saying 'He screamed at me' or 'He is an angry man' exaggerates and can make people judge him unfairly.",
  "طريقة نقلنا لما فعله الآخرون مهمة. إذا قال الزوج «كفى!» بصوت عالٍ مرة واحدة فالوصف العادل «رفع صوته» أو «شخط فيّ»، أما «صرخ عليّ» أو «هو رجل عصبي» فمبالغة قد تجعل الناس يظلمونه.",
  "Fair: 'He raised his voice and said Enough.' Exaggerated: 'He screamed at me, he's so aggressive.'", None,
  [("Raised his voice", "What really happened: louder, once.", "ما حدث فعلًا"),
   ("Screamed", "Much stronger than what happened.", "وصف أقوى من الحقيقة"),
   ("Exaggerate", "Making it sound worse than it was.", "المبالغة")]),
]
out = ["""-- =====================================================================
-- Helper Academy — v82: 🗣️ firm vs. angry — one moment is not a personality
--   23 new words + 5 linked (Hit, Patient, Firm, Aggressive), meters "Calm → Violent (one moment)" and "Even-tempered → Abusive (a personality)",
--   4 ≠ cards, a new character strength "Temper & firmness", 4 signs, and characters. Built by tools/words/build_v82.py. Safe to re-run. Run AFTER v81.
-- ====================================================================="""]
for hw, emo, m, ex, ar, tags, mt in W:
    t = list(tags) + ([f"📶 {mt[0]}: {mt[1]}"] if mt else [])
    if m is not None:
        out.append(f"""insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', {q(hw)}, '', {q(m)}, {q(ex)}, {q(ar)}, '', '', {q(emo)}, '', '', {A(t)}, {OWNER} where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = lower({q(hw)}));""")
    out.append(f"update public.words set tags = (select array(select distinct x from unnest(tags || {A(t)}) x order by x)) where id = {WID(hw)};")
    out.append(f"""insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id) select md5('temper-set:' || w.id)::uuid, {SET}, 820, 'term', 1, '{{}}', w.id
from public.words w where w.id = {WID(hw)} and not exists (select 1 from public.set_entries e where e.set_id = {SET} and e.word_id = w.id) on conflict (id) do nothing;""")
for p, (key, title, summ, summ_ar, ex, note, parts) in enumerate(D):
    out.append(f"insert into public.word_differences (key, title, unit, min_age, summary, summary_ar, example, note, position) values ({q(key)},{q(title)},1,0,{q(summ)},{q(summ_ar)},{q(ex)},{q(note)},{90 + p}) on conflict (key) do update set title=excluded.title, summary=excluded.summary, summary_ar=excluded.summary_ar, example=excluded.example, note=excluded.note, position=excluded.position;")
    for n, (hw, e, ar) in enumerate(parts):
        out.append(f"insert into public.word_difference_parts (diff_key, word_id, explain, explain_ar, position) select {q(key)}, {WID(hw)}, {q(e)}, {q(ar)}, {n} on conflict (diff_key, word_id) do update set explain = excluded.explain, explain_ar = excluded.explain_ar, position = excluded.position;")
        out.append(f"update public.words set tags = (select array(select distinct x from unnest(tags || array[{q('≠ ' + title)}]) x order by x)) where id = {WID(hw)};")
out.append("""
-- 🧠 a new character strength: Temper & firmness (low = hot-tempered, middle = even-tempered and firm when needed, high = can never be firm)
insert into public.traits (key, icon, name, family, min_age, varies_by_place, low_name, low_self, low_others, mid_name, mid_text, high_name, high_self, high_others, place_note, position) values
('temper','🌡️','Temper & firmness','Character',6,true,'Hot-tempered','Snaps, yells or blows up often, then feels bad or ashamed.','People feel scared or walk on eggshells around him.',
 'Even-tempered and firm','Stays calm most of the time, and can be firm (even raise his voice once) when something must stop, without being cruel.',
 'Can never be firm','Can''t say a serious no, even when something is wrong or dangerous.','Others ignore the rules, and problems grow.',
 'Some people are calm at work but short-tempered at home, or the other way round.',24)
on conflict (key) do update set icon=excluded.icon, name=excluded.name, family=excluded.family, min_age=excluded.min_age, varies_by_place=excluded.varies_by_place, low_name=excluded.low_name, low_self=excluded.low_self, low_others=excluded.low_others, mid_name=excluded.mid_name, mid_text=excluded.mid_text, high_name=excluded.high_name, high_self=excluded.high_self, high_others=excluded.high_others, place_note=excluded.place_note, position=excluded.position;

-- 🔎 signs: patterns (again and again), not single moments
insert into public.signs (key, icon, name, category, min_age, about, academic, position) values
 ('snaps_often','🗯️','Snaps at people often','behaviour',7,'Says short, sharp, irritated words to others many times, over small things.','Trait irritability: a low threshold for frustration shown as frequent sharp responses (Spielberger, State-Trait Anger Expression Inventory-2).',0),
 ('yells_often','📢','Yells or screams a lot','behaviour',7,'Often shouts angrily or screams at people, not just once on a bad day.','Frequent outward anger expression (anger-out), as distinct from a single episode of state anger.',0),
 ('lashes_out','👊','Lashes out when angry','behaviour',8,'When angry, suddenly pushes, hits or throws things, or says very hurtful things.','Reactive (hostile) aggression: impulsive, anger-driven aggression in response to provocation.',0),
 ('exaggerates_harm','🎈','Makes others'' words sound worse than they were','tactics',9,'Tells people "he screamed at me" or "she is so aggressive" when the other person only raised their voice once.','Exaggeration and catastrophising in reports of others'' behaviour; can be used to gain sympathy or to make the other person look bad.',0)
on conflict (key) do update set icon=excluded.icon, name=excluded.name, category=excluded.category, min_age=excluded.min_age, about=excluded.about, academic=excluded.academic, position=excluded.position;
insert into public.condition_signs (condition, sign, weight) values ('bullying','yells_often',1), ('bullying','lashes_out',2)
on conflict do nothing;
delete from public.trait_links where src_key in ('temper','snaps_often','yells_often','lashes_out','exaggerates_harm') or dst_key in ('temper','snaps_often','yells_often','lashes_out','exaggerates_harm');
insert into public.trait_links (src_type, src_key, src_level, dst_type, dst_key, dst_level, effect, strength, note) values
 ('trait','temper','low','sign','snaps_often',null,'raises',3,null),
 ('trait','temper','low','sign','yells_often',null,'raises',2,null),
 ('trait','temper','low','sign','lashes_out',null,'raises',1,'A hot temper can turn into lashing out when it is never managed.'),
 ('trait','feelings','low','trait','temper','low','raises',2,'Not controlling feelings shows as a hot temper.'),
 ('trait','feelings','mid','trait','temper','mid','raises',2,null),
 ('trait','assertive','low','trait','temper','high','raises',2,'A passive person often can''t be firm, even when they need to be.'),
 ('trait','assertive','high','sign','yells_often',null,'raises',1,null);

-- 🎭 characters: who is firm, who is short-tempered, who can never be firm
update public.characters set traits = traits || '{"temper":0}'::jsonb where id in (md5('char:Grandpa Yusuf')::uuid, md5('char:Captain Faris')::uuid, md5('char:Ms. Huda')::uuid);
update public.characters set traits = traits || '{"temper":-1}'::jsonb, signs = signs || '{"snaps_often":2}'::jsonb where id in (md5('char:Coach Adel')::uuid, md5('char:Uncle Fawzi')::uuid, md5('char:Mr. Basil')::uuid);
update public.characters set traits = traits || '{"temper":-2}'::jsonb, signs = signs || '{"yells_often":2,"snaps_often":2,"lashes_out":1}'::jsonb where id in (md5('char:Omar')::uuid);
update public.characters set traits = traits || '{"temper":-2}'::jsonb, signs = signs || '{"snaps_often":3,"yells_often":2}'::jsonb where id in (md5('char:Rania')::uuid);
update public.characters set traits = traits || '{"temper":2}'::jsonb where id in (md5('char:Noor')::uuid, md5('char:Sara')::uuid);
update public.characters set signs = signs || '{"exaggerates_harm":2}'::jsonb where id in (md5('char:Aunt Mona')::uuid);
""")
out.append(f"select (select count(*) from public.words where exists (select 1 from unnest(tags) t where t like {q('📶 ' + MOM + '%')})) as moment_meter, (select count(*) from public.words where exists (select 1 from unnest(tags) t where t like {q('📶 ' + PER + '%')})) as personality_meter, (select count(*) from public.word_differences where key in ('voice-ladder','moment-personality','firm-aggressive','tell-it-fairly')) as diffs, (select count(*) from public.characters where traits ? 'temper') as chars_with_temper;")
open("supabase_v82_temper.sql", "w").write("\n".join(out) + "\n")
print("ok")
