# v67: ≠ fixes (Care → looking after, Affection → affectionate behaviour, mood group split) and 8 meters from the difference groups
q = lambda s: "null" if s is None else "'" + str(s).replace("'", "''") + "'"
OWNER = "(select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')"
SET = "'00000000-0000-4000-8000-00000000d1ff'"
WID = lambda hw: f"(select id from public.words where lang = 'en' and lower(headword) = lower({q(hw)}) order by (sense = '') desc limit 1)"
out = ["""-- =====================================================================
-- Helper Academy — v67: ≠ fixes and 8 meters from the difference groups. Built by tools/words/build_v67.py. Safe to re-run. Run AFTER v66.
-- ====================================================================="""]
def word(hw, emo, meaning, ar, unit, tags=()):
    out.append(f"""insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', {q(hw)}, '', {q(meaning)}, '', {q(ar)}, '', '', {q(emo)}, '', '', array[{",".join(q(t) for t in tags)}]::text[], {OWNER}
where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = lower({q(hw)}));""")
    inset(hw, unit)
def inset(hw, unit):
    out.append(f"""insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select md5('diff-word:' || w.id)::uuid, {SET}, 500, 'term', {unit}, '{{}}', w.id from public.words w where w.id = {WID(hw)}
and not exists (select 1 from public.set_entries e where e.set_id = {SET} and e.word_id = w.id) on conflict (id) do nothing;""")
def tag(hw, t): out.append(f"update public.words set tags = (select array(select distinct x from unnest(tags || array[{q(t)}]) x order by x)) where id = {WID(hw)};")
def untag_all(t): out.append(f"update public.words set tags = array_remove(tags, {q(t)}) where {q(t)} = any(tags);")
def swap_part(key, old, new, expl, ar, pos):
    out.append(f"delete from public.word_difference_parts where diff_key = {q(key)} and word_id = {WID(old)};")
    out.append(f"""insert into public.word_difference_parts (diff_key, word_id, explain, explain_ar, position) select {q(key)}, {WID(new)}, {q(expl)}, {q(ar)}, {pos}
on conflict (diff_key, word_id) do update set explain = excluded.explain, explain_ar = excluded.explain_ar, position = excluded.position;""")
def drop_from_set_if_unused(hw):
    out.append(f"""delete from public.set_entries e where e.set_id = {SET} and e.word_id = {WID(hw)}
and not exists (select 1 from public.word_difference_parts p where p.word_id = e.word_id) and not exists (select 1 from public.words w where w.id = e.word_id and exists (select 1 from unnest(w.tags) t where t like '📶%' and t not like '📶 Hate%'));""")

# 1. Care ≠ Upbringing: the dictionary "Care" is a feeling; رعاية is looking after
word("Care (looking after)", "🍲", "Looking after someone's needs: food, clothes, health, safety.", "الرعاية", 3, ["≠ Care ≠ Upbringing"])
untag_all("≠ Care ≠ Upbringing"); tag("Care (looking after)", "≠ Care ≠ Upbringing"); tag("Upbringing", "≠ Care ≠ Upbringing")
swap_part("care-upbringing", "Care", "Care (looking after)", "Looking after someone's needs: food, clothes, health, safety.", "الرعاية", 0)
out.append(f"update public.word_differences set title = 'Care (looking after) ≠ Upbringing' where key = 'care-upbringing';")
untag_all("≠ Care ≠ Upbringing"); tag("Care (looking after)", "≠ Care (looking after) ≠ Upbringing"); tag("Upbringing", "≠ Care (looking after) ≠ Upbringing")
out.append(f"delete from public.set_entries where set_id = {SET} and word_id = {WID('Care')};")

# 2. Love ≠ Affection: in English affection is a feeling (it stays on the Hate ⇄ Love meter); مودّة is the behaviour
word("Affectionate behaviour", "🤗", "Warm, kind actions towards someone: love shown in what you do, even on days the feeling is weak.", "المودّة", 1)
untag_all("≠ Love ≠ Affection")
swap_part("love-affection", "Affection", "Affectionate behaviour", "Warm, kind actions towards someone: love shown in what you do.", "المودّة", 1)
out.append("update public.word_differences set title = 'Love ≠ Affectionate behaviour', summary = 'Love is a feeling; affectionate behaviour (مودّة) is what you do: kind, warm actions. Good people stay kind even when the feeling fades.' where key = 'love-affection';")
tag("Love", "≠ Love ≠ Affectionate behaviour"); tag("Affectionate behaviour", "≠ Love ≠ Affectionate behaviour")
out.append(f"delete from public.set_entries where set_id = {SET} and word_id = {WID('Affection')};")

# 3. the mood group split: a meter (low mood → depression) and a new difference (hard times ≠ complaining habit)
untag_all("≠ A low mood ≠ Depression ≠ A complaining habit")
out.append(f"delete from public.word_difference_parts where diff_key = 'mood-depression-complaining' and word_id = {WID('Complainer')};")
out.append("update public.word_differences set title = 'Low mood ≠ Depression', summary = 'A low mood passes in hours or days; depression is a medical condition (low mood and lost interest most days for at least two weeks) that doctors can help with.', summary_ar = 'هناك فرق بين حالة مزاجية عابرة وبين الاكتئاب، فالاكتئاب حالة طبية تستمر أسابيع ويساعد فيها الأطباء.' where key = 'mood-depression-complaining';")
tag("Low mood", "≠ Low mood ≠ Depression"); tag("Depression", "≠ Low mood ≠ Depression")
word("Hardship", "⛈️", "A really difficult time in life, like illness, losing a job or losing someone.", "ظروف صعبة", 1)
out.append("""insert into public.word_differences (key, title, unit, min_age, summary, summary_ar, example, note, position) values ('hardship-complaining', 'Hardship ≠ Complaining habit', 1, 10,
 'Someone going through hardship is reacting to real trouble; a complainer complains about everything, whatever happens. The little complainer grows into a big one: first about waking up early and homework, later about bills and children.',
 'هناك فرق بين شخص يمر بظروف صعبة وبين شخص دومًا متحلطم؛ المتحلطم الصغير يصبح متحلطمًا كبيرًا ثم عجوزًا: أول الأمر على الصحيان المبكر والواجبات، ثم على المصاريف وهموم الأولاد.',
 'Losing a pet is hardship; moaning about every meal is a complaining habit.', null, 37)
on conflict (key) do update set title = excluded.title, summary = excluded.summary, summary_ar = excluded.summary_ar, example = excluded.example;""")
for n, (hw, ex, ar) in enumerate([("Hardship", "A really difficult time caused by real trouble.", "ظروف صعبة"), ("Complainer", "Someone who always complains, whatever happens.", "المتحلطم")]):
    out.append(f"""insert into public.word_difference_parts (diff_key, word_id, explain, explain_ar, position) select 'hardship-complaining', {WID(hw)}, {q(ex)}, {q(ar)}, {n}
on conflict (diff_key, word_id) do update set explain = excluded.explain, explain_ar = excluded.explain_ar;""")
    tag(hw, "≠ Hardship ≠ Complaining habit")

# 4. eight meters (📶 tags). Golden-middle meters have 0 in the middle and use calm colours (meter.js NEUTRAL)
M = {
 "Pardon → Absolve": [("Pardon", 1), ("Forgive", 2), ("Overlook", 3), ("Absolve", 4)],
 "Gullible ⇄ Distrustful": [("Gullible", -2), ("Cautious", 0), ("Suspicious", 2), ("Distrustful", 3)],
 "Passive ⇄ Rude": [("Passive", -2), ("Firm", 0), ("Rude", 2)],
 "Resisting ⇄ Indifferent": [("Resisting", -2), ("Acceptance", 0), ("Indifference", 2)],
 "Hands-off ⇄ Controlling": [("Hands-off", -2), ("Leadership", 0), ("Control", 2)],
 "Low mood → Depression": [("Low mood", 1), ("Sad", 2), ("Depression", 4)],
 "Knowledge → Wisdom": [("Knowledge", 1), ("Awareness", 2), ("Wisdom", 3)],
 "Doubtful → Convinced": [("Doubtful", 1), ("Believe", 2), ("Convinced", 3)],
}
NEW = {"Gullible": ("🐑", "Believes and trusts people too easily, so they can be tricked.", "ساذج، سريع التصديق", 2),
       "Cautious": ("🛑", "Careful: waits and sees before trusting or acting.", "حذِر", 2),
       "Suspicious": ("🕵️", "Thinks someone may be doing something wrong, often without proof.", "مرتاب، شكّاك", 2),
       "Distrustful": ("🔒", "Doesn't trust anyone, even people who have done nothing wrong.", "عديم الثقة بالآخرين", 2),
       "Passive": ("🫥", "Lets others decide and push them around; doesn't speak up.", "سلبي، خانع", 3),
       "Resisting": ("🏊", "Fighting against what has already happened instead of dealing with it.", "مقاومة الواقع (عدم القبول)", 1),
       "Hands-off": ("🙌", "Leaving people completely alone, without any guidance.", "ترك الحبل على الغارب", 3),
       "Sad": ("😢", "Feeling unhappy.", "حزين", 1),
       "Doubtful": ("🤔", "Not sure whether something is true.", "متشكّك، غير متأكد", 2)}
for title, items in M.items():
    for hw, r in items:
        if hw in NEW: emo, m, ar, u = NEW[hw]; word(hw, emo, m, ar, u)
        else: inset(hw, 2)
        tag(hw, f"📶 {title}: {'+' if r > 0 and '⇄' in title else ''}{r}")
out.append(f"select (select count(*) from public.word_differences) as differences, (select count(*) from public.words where exists (select 1 from unnest(tags) t where t like any (array[{','.join(q('📶 ' + t + ':%') for t in M)}]))) as meter_words, (select count(*) from public.set_entries where set_id = {SET}) as set_words;")
open("supabase_v67_diff_meters.sql", "w").write("\n".join(out) + "\n")
print("ok")
