# v76: 🔗 Little words — prepositions (in, on, at, by, to) and articles (a, an, the): partners grouped by the rule, exceptions marked,
#      travel & place nouns (car, bus, home, school, hospital …) in Word Partners. American English first (Reem follows the American curriculum).
q = lambda s: "null" if s is None else "'" + str(s).replace("'", "''") + "'"
A = lambda xs: "array[" + ",".join(q(x) for x in xs) + "]::text[]" if xs else "'{}'::text[]"
OWNER = "(select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')"
LSET, PSET = "00000000-0000-4000-8000-00000000c1a7", "00000000-0000-4000-8000-00000000c011"
WID = lambda hw: f"(select id from public.words where lang = 'en' and headword = {q(hw)} and sense = '' limit 1)"

# headword, emoji, meaning, example, arabic, tags, unit, also_units
LITTLE = [
 ("By", "🚗", "Shows HOW you travel (by car, by bus: no a or the), and also next to (by the door) or not later than (by Friday).", "We go to school [by] bus.", "بـ / بواسطة (وسيلة النقل)، بجانب، قبل موعد", ["Little words"], 1, []),
 ("On", "🔛", "On top of a surface (on the table); on big vehicles you can walk in (on the bus); with days and dates (on Monday). Walking is on foot.", "The book is [on] the table.", "على؛ في (مع الأيام)", ["Little words"], 2, [1, 3]),
 ("In", "📥", "Inside a space (in the box, in the kitchen); in small vehicles you sit in (in a car); with months, years and parts of the day (in July, in the morning).", "The cat is [in] the box.", "في / داخل", ["Little words"], 2, [1, 3]),
 ("At", "📍", "At a point or a place where something happens (at the door, at school, at home); with clock times (at 7 o'clock, at night).", "I'll meet you [at] the bus stop.", "عند / في (لنقطة أو مكان أو ساعة محددة)", ["Little words"], 2, [3]),
 ("To", "➡️", "Shows where you are going (go to school, go to bed). But we say go home, with no to.", "We walk [to] the park.", "إلى", ["Little words"], 4, []),
 ("A", "🅰️", "Used before a singular thing when it is one of many, or the first time you mention it. Use A before a consonant SOUND: a car, a university.", "I saw [a] dog in the park.", "أداة نكرة (واحد من كثير)", ["Little words"], 5, []),
 ("An", "🅰️", "Like A, but before a vowel SOUND: an apple, an idea, an hour (the h is silent).", "She ate [an] apple.", "أداة نكرة قبل صوت متحرك", ["Little words"], 5, []),
 ("The", "👉", "Used when we both know which one (the door of this room), when there is only one (the sun), or for places in town (the park). No article in fixed phrases: at home, by car, go to bed.", "Please close [the] door.", "ال (أداة التعريف)", ["Little words"], 5, []),
]
NOUNS = [
 ("Car", "🚗", "A vehicle with four wheels and an engine, for a few people.", "Dad drives the [car] to work.", "سيارة", "car"),
 ("Bus", "🚌", "A big vehicle that carries many passengers along a route.", "We take the [bus] to school.", "حافلة", "bus"),
 ("Train", "🚆", "A long vehicle that runs on rails.", "The [train] was full this morning.", "قطار", "train"),
 ("Airplane", "✈️", "A vehicle with wings that flies (also called a plane).", "We flew to Jeddah by [airplane].", "طائرة", "air-plane"),
 ("Bike", "🚲", "A bicycle: two wheels that you push with your feet.", "She rides her [bike] in the park.", "دراجة", "bike"),
 ("Taxi", "🚕", "A car with a driver that you pay to take you somewhere.", "We took a [taxi] to the airport.", "سيارة أجرة", "tax-i"),
 ("Foot", "🦶", "The part of your leg you stand on. On foot means walking.", "We went to the shop on [foot].", "قدم (سيرًا على الأقدام)", "foot"),
 ("Home", "🏠", "The place where you live. We say at home and go home (no the, no to).", "I stayed at [home] all day.", "البيت / المنزل", "home"),
 ("School", "🏫", "The place where children learn. At school, go to school (no the).", "We have art at [school] today.", "مدرسة", "school"),
 ("Work", "💼", "The place where you do your job, or the job itself. At work, go to work (no the).", "Mom is at [work] until five.", "العمل", "work"),
 ("Office", "🏢", "A room or building where people work at desks.", "Dad works in an [office].", "مكتب", "of-fice"),
 ("Hospital", "🏥", "A place where sick or hurt people are cared for. In American English: in the hospital; in British English: in hospital.", "Grandpa is in the [hospital] for a few days.", "مستشفى", "hos-pi-tal"),
 ("Bed", "🛏️", "A piece of furniture you sleep on. In bed, go to bed (no the).", "It's late: time for [bed].", "سرير", "bed"),
 ("Kitchen", "🍳", "The room where food is cooked.", "Mom is in the [kitchen].", "مطبخ", "kitch-en"),
 ("Morning", "🌅", "The early part of the day, before noon. In the morning.", "I read in the [morning].", "صباح", "morn-ing"),
 ("Weekend", "🗓️", "Saturday and Sunday (or Friday and Saturday in Saudi Arabia). American: on the weekend; British: at the weekend.", "We visit Grandma on the [weekend].", "عطلة نهاية الأسبوع", "week-end"),
]
# word → [(group, [phrases])]; notes mark exceptions and US/UK differences
G = {
 "By": [
  ("🚗 How you travel: BY + vehicle, no a or the", ["by car", "by bus", "by train", "by plane", "by taxi", "by bike", "by boat", "by subway"]),
  ("📍 By = next to", ["by the door", "by the window", "by the sea"]),
  ("⏰ By = not later than", ["by 5 o'clock", "by Friday", "by tomorrow"]),
 ],
 "On": [
  ("🚗 Travel: ON big vehicles you can stand or walk in, and bikes", ["on the bus", "on the train", "on a plane", "on a ship", "on a bike", "on a horse"]),
  ("🚗 The exception: walking is ON foot", ["on foot"]),
  ("📍 Place: ON a surface", ["on the table", "on the wall", "on the floor", "on the page", "on the screen"]),
  ("📺 Fixed phrases with ON", ["on TV", "on the phone", "on the internet", "on the radio"]),
  ("⏰ Time: ON days and dates", ["on Monday", "on my birthday", "on May 5th", "on the weekend", "on Eid"]),
 ],
 "In": [
  ("🚗 Travel: IN small vehicles you sit in", ["in a car", "in a taxi", "in my dad's car"]),
  ("📍 Place: IN = inside a space or an area", ["in the box", "in the kitchen", "in my room", "in the garden", "in the city", "in Saudi Arabia"]),
  ("📍 Fixed: IN with no the", ["in bed", "in class", "in school"]),
  ("🏥 In the hospital (as a patient)", ["in the hospital"]),
  ("⏰ Time: IN months, years, seasons and parts of the day", ["in the morning", "in the afternoon", "in the evening", "in July", "in 2026", "in summer"]),
 ],
 "At": [
  ("📍 Place: AT a point, or where something happens", ["at the door", "at the bus stop", "at the station", "at the airport", "at the office", "at the doctor's", "at the party"]),
  ("📍 Fixed: AT with no the", ["at home", "at school", "at work"]),
  ("🏥 At the hospital (visiting or working there)", ["at the hospital"]),
  ("⏰ Time: AT clock times and short moments", ["at 7 o'clock", "at noon", "at lunchtime", "at sunset", "at the moment"]),
  ("⏰ The exception: AT night (but IN the morning)", ["at night"]),
 ],
 "To": [
  ("➡️ Going somewhere: TO + the place", ["go to school", "go to work", "go to bed", "go to the park", "go to the hospital", "go to the office"]),
  ("⚠️ The exception: go home (no TO)", ["go home", "come home", "get home"]),
 ],
 "A": [
  ("🔤 A before a consonant SOUND", ["a car", "a bus", "a dog", "a book", "a pen"]),
  ("👂 It's the sound, not the letter: A + 'you' sound", ["a university", "a uniform", "a unicorn", "a one-way street"]),
 ],
 "An": [
  ("🔤 AN before a vowel SOUND (a, e, i, o, u)", ["an apple", "an egg", "an idea", "an orange", "an umbrella", "an elephant"]),
  ("👂 It's the sound, not the letter: silent h", ["an hour", "an honest friend"]),
 ],
 "The": [
  ("👉 THE = the one we both know", ["the door", "the teacher", "the book I gave you"]),
  ("🌍 THE = there is only one", ["the sun", "the moon", "the sky", "the world", "the internet"]),
  ("🏙️ THE with places in town", ["the park", "the zoo", "the hospital", "the bus stop", "the beach"]),
  ("🚫 No article in these fixed phrases", ["at home", "by car", "in bed", "go to school", "play football", "have breakfast"]),
 ],
}
NOTES = {
 "on foot": "⚠️ Exception: walking is on foot, not by foot",
 "at night": "⚠️ Exception: at night, but in the morning",
 "go home": "⚠️ Exception: no to", "come home": "⚠️ Exception: no to", "get home": "⚠️ Exception: no to",
 "on the weekend": "🇺🇸 American; British English says at the weekend",
 "in the hospital": "🇺🇸 American; British English says in hospital",
 "in school": "🇺🇸 American: still a student (in school); British: at school",
 "a university": "⚠️ Careful: 'yoo' sound, so A", "a uniform": "⚠️ Careful: 'yoo' sound, so A", "a unicorn": "⚠️ Careful: 'yoo' sound, so A",
 "a one-way street": "⚠️ Careful: 'won' sound, so A", "an hour": "⚠️ Careful: silent h, so AN", "an honest friend": "⚠️ Careful: silent h, so AN",
 "in a car": "Compare: by car (how you travel) / in a car (inside one car)",
 "on the bus": "Compare: by bus (how you travel) / on the bus (inside this bus)",
}
RULE = {  # shown on the cards (also in list.html)
 "In": "⏰ AT a clock time, ON a day, IN a month, year or part of the day. 📍 AT a point, ON a surface, IN inside a space.",
}
out = ["""-- =====================================================================
-- Helper Academy — v76: 🔗 Little words: in, on, at, by, to · a, an, the
--   A new "Little Words" set (Linking-words box in the Story builder) with 8 little words; 16 travel & place nouns in Word Partners
--   (unit 5 "Travel & places"); every phrase grouped by its rule with 🧭 tags, exceptions and US/UK differences marked with ⚠️ / 🇺🇸 tags,
--   and linked to the noun's dictionary word. American English first. Built by tools/words/build_v76.py. Safe to re-run. Run AFTER v75.
-- =====================================================================
insert into public.study_sets (id, owner_id, author_name, institution_id, subject_id, level_code, title, description, language, translation_lang, units, visibility, story_box)
select '""" + LSET + """', """ + OWNER + """, 'Ab', null, 1, 'any', 'Little Words: in, on, at, by, to · a, an, the',
  'The small words that are hardest for learners: how you travel (by car, on foot), where you are (at home, in the kitchen), when (at 7, on Monday, in July), where you go (go to school, go home) and a / an / the.',
  'en', 'ar', '[{"u": 1, "name": "🚗 How you travel"},{"u": 2, "name": "📍 Where you are"},{"u": 3, "name": "⏰ When"},{"u": 4, "name": "➡️ Where you go"},{"u": 5, "name": "🔤 A, an, the"}]'::jsonb, 'public', 'link'
on conflict (id) do update set title = excluded.title, description = excluded.description, units = excluded.units, story_box = excluded.story_box;
update public.study_sets set units = units || '[{"u": 5, "name": "🚗 Travel & places"}]'::jsonb
  where id = '""" + PSET + """' and not units @> '[{"u": 5}]'::jsonb;"""]
for i, (hw, emo, m, ex, ar, tags, u, also) in enumerate(LITTLE):
    out.append(f"""insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', {q(hw)}, '', {q(m)}, {q(ex)}, {q(ar)}, {q(hw.lower())}, '', {q(emo)}, '', '', {A(tags)}, {OWNER} where not exists (select 1 from public.words w where w.lang = 'en' and w.headword = {q(hw)} and w.sense = '');
update public.words set meaning = {q(m)}, translation = {q(ar)}, tags = (select array(select distinct x from unnest(tags || {A(tags)}) x order by x)) where id = {WID(hw)};
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id) select md5('little:' || w.id)::uuid, '{LSET}', {i + 1}, 'term', {u}, '{{{",".join(map(str, also))}}}', w.id
from public.words w where w.id = {WID(hw)} on conflict (id) do update set unit = excluded.unit, also_units = excluded.also_units, position = excluded.position;""")
for i, (hw, emo, m, ex, ar, syl) in enumerate(NOUNS):
    t = ["Naming: things & places", "Places & travel"]
    out.append(f"""insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', {q(hw)}, '', {q(m)}, {q(ex)}, {q(ar)}, {q(syl)}, '', {q(emo)}, '', '', {A(t)}, {OWNER} where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = lower({q(hw)}) and w.sense = '');
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id) select md5('travel:' || w.id)::uuid, '{PSET}', {500 + i}, 'term', 5, '{{}}', w.id
from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower({q(hw)}) and sense = '' limit 1)
  and not exists (select 1 from public.set_entries e where e.set_id = '{PSET}' and e.word_id = w.id) on conflict (id) do nothing;""")
rows = []
for hw, groups in G.items():
    pos = 0
    for g, phrases in groups:
        for ph in phrases:
            pos += 1
            first, rest = (ph.split(" ", 1) + [""])[:2]
            tags = ["🧭 " + g] + ([NOTES[ph]] if ph in NOTES else [])
            noun = {"plane": "Airplane"}.get(ph.split(" ")[-1].replace("'s", ""), ph.split(" ")[-1].replace("'s", ""))
            if hw == "The" and g.startswith("🚫"): noun = ""   # shown on The's card only; the nouns already get them from at/by/in/to
            rows.append(f"({q(hw)}, 'noun', {q(ph)}, {q(rest if first.lower() == hw.lower() else ph)}, {pos}, {A(tags)}, {q(noun)})")
out.append("""-- 🧭 partners, grouped by the rule
delete from public.word_partners p using public.words w where p.word_id = w.id and w.lang = 'en' and w.sense = '' and w.headword in ('By','On','In','At','To','A','An','The');
insert into public.word_partners (word_id, kind, phrase, partner, position, tags, partner_word_id)
select (select id from public.words where lang = 'en' and headword = v.h and sense = '' limit 1), v.k, v.ph, v.pa, v.pos, v.tg,
       (select x.id from public.words x where x.lang = 'en' and lower(x.headword) = lower(v.noun) and x.sense = '' limit 1)
from (values
""" + ",\n".join(rows) + """
) as v(h, k, ph, pa, pos, tg, noun)
on conflict (word_id, lower(phrase)) do update set kind = excluded.kind, partner = excluded.partner, position = excluded.position, tags = excluded.tags, partner_word_id = excluded.partner_word_id;""")
out.append(f"""select (select count(*) from public.set_entries where set_id = '{LSET}') as little_words,
       (select count(*) from public.set_entries where set_id = '{PSET}' and unit = 5) as travel_nouns,
       (select count(*) from public.word_partners p join public.words w on w.id = p.word_id where w.headword in ('By','On','In','At','To','A','An','The') and w.sense = '') as partners,
       (select count(*) from public.word_partners p join public.words w on w.id = p.word_id where w.headword in ('By','On','In','At','To','A','An','The') and w.sense = '' and p.partner_word_id is not null) as linked;""")
open("supabase_v76_little_words.sql", "w").write("\n".join(out) + "\n")
print(len(rows), "partners")
