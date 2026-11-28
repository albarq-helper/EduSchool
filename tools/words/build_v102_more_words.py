#!/usr/bin/env python3
"""Build supabase_v102_more_words.sql: 17 extra words in a new set 'More Words' (NOT in the Grade 5 set)."""
import os
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
q = lambda s: "'" + s.replace("'", "''") + "'"
arr = lambda a: "array[" + ",".join(q(t) for t in a) + "]::text[]"
SET = "00000000-0000-4000-8000-00000000c2e1"
N, P, A, D = "Naming: things & places", "Naming: people", "Action", "Describing"
# headword, emoji, meaning, example, arabic, syllables, pronunciation, tags
W = [
 ("Prairie", "🌾", "A large, flat area of grassland with very few trees, found in North America.", "Wild bison once roamed the wide [prairie].", "البراري", "prai-rie", "PRAIR-ee", [N, "Plants, nature & weather"]),
 ("Noble", "👑", "Good, honest and brave; or from a very important family.", "The [noble] knight helped every family in the village.", "نبيل", "no-ble", "NOH-bul", [D]),
 ("Offer", "🎁", "To give or provide something, or to say you are ready to do something for someone.", "The shop will [offer] a free juice to every child.", "يوفّر", "of-fer", "AW-fer", [A]),
 ("Thobe", "👕", "A long, loose garment that men wear in Arabian countries.", "My father wore a white [thobe] on Eid.", "ثوب", "thobe", "THOHB", [N]),
 ("Cuff", "👔", "The end of a sleeve, around the wrist.", "He folded back the [cuff] of his sleeve.", "كف", "cuff", "KUF", [N]),
 ("Wadi", "🏜️", "A dry river valley in the desert that fills with water after heavy rain.", "After the storm, water rushed through the [wadi].", "وادي", "wa-di", "WAH-dee", [N, "Plants, nature & weather"]),
 ("Coffin", "⚰️", "A long box in which a dead person is buried.", "The [coffin] was carried slowly to the cemetery.", "كفن", "cof-fin", "KAW-fin", [N]),
 ("Earth", "🌍", "The planet we live on; also the soil or ground.", "The astronauts looked back at [Earth] from space.", "أرض", "earth", "URTH", [N, "Plants, nature & weather"]),
 ("Syrup", "🍯", "A thick, sweet liquid, like the kind you pour on pancakes.", "She poured maple [syrup] over the pancakes.", "شراب", "syr-up", "SIR-up", [N, "Food & drink"]),
 ("Mummy", "🏺", "A dead body wrapped in cloth and kept for thousands of years, especially in ancient Egypt.", "We saw a real [mummy] at the museum.", "مومياء", "mum-my", "MUM-ee", [N]),
 ("Misery", "😭", "A feeling of great sadness or suffering.", "The cold, rainy week was pure [misery].", "مزري", "mis-er-y", "MIZ-uh-ree", [N, "Feelings & moods"]),
 ("Would", "💭", "Used for wishes, polite questions and things that might happen.", "[Would] you like some tea?", "يودّ", "would", "WUUD", [A]),
 ("Tail", "🐕", "The part that sticks out at the back of an animal's body.", "The dog wagged its [tail] happily.", "ذيل", "tail", "TAYL", [N, "Animals"]),
 ("Body", "🧍", "All the physical parts of a person or an animal.", "Exercise keeps your [body] strong.", "بدن", "bod-y", "BAW-dee", [N, "Health & body"]),
 ("Harpoon", "🔱", "A long spear tied to a rope, used for hunting whales and big fish.", "The sailor threw the [harpoon] at the whale.", "حربة", "har-poon", "har-POON", [N]),
 ("Nagging", "😩", "Complaining or telling someone to do something again and again, in an annoying way.", "His little sister's [nagging] made him stop playing.", "نكدي", "nag-ging", "NAG-ing", [D]),
 ("Waist", "📏", "The narrow part of your body between your ribs and your hips.", "He tied the belt around his [waist].", "وسط", "waist", "WAYST", [N, "Health & body"]),
]
heads = [w[0].lower() for w in W]; assert len(heads) == len(set(heads))
owner = "(select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')"
out = [f"""-- =====================================================================
-- Helper Academy — v102: 📚 More Words: {len(W)} extra words (prairie … waist), in their own set, NOT in Grade 5
-- Built by tools/words/build_v102_more_words.py. Safe to re-run.
-- =====================================================================
insert into public.study_sets (id, owner_id, author_name, institution_id, subject_id, level_code, title, description, language, translation_lang, units, visibility)
select '{SET}', {owner}, 'Ab', null, 1, 'any', 'More Words', 'Extra words with their Arabic meaning: prairie, noble, wadi, thobe, harpoon and more.', 'en', 'ar', '[{{"u": 1, "name": "📚 Extra words"}}]'::jsonb, 'public'
on conflict (id) do update set title = excluded.title, description = excluded.description, units = excluded.units;
"""]
for k, (h, e, m, ex, ar, sy, pr, tg) in enumerate(W, start=1):
    out.append(f"""insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', {q(h)}, '', {q(m)}, {q(ex)}, {q(ar)}, {q(sy)}, {q(pr)}, {q(e)}, '', '', {arr(tg)}, {owner}
where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = {q(h.lower())} and w.sense = '');
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('more:' || w.id)::uuid, '{SET}', {k}, 'term', 1, '{{}}', w.id from public.words w where w.lang = 'en' and lower(w.headword) = {q(h.lower())} and w.sense = '' limit 1
on conflict (id) do update set position = excluded.position;""")
out.append(f"select count(*) as in_more_words from public.set_entries where set_id = '{SET}';")
open(os.path.join(root, "supabase_v102_more_words.sql"), "w", encoding="utf8").write("\n".join(out) + "\n")
print(len(W))
