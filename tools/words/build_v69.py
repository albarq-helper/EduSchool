# v69: 🧷 attachment (تعلق) and dependence; 🚷 exclusion and ostracism (إقصاء، نبذ مجتمعي); people-pleasing — meters, ≠ cards, conditions, signs, roots, links
q = lambda s: "null" if s is None else "'" + str(s).replace("'", "''") + "'"
A = lambda xs: "array[" + ",".join(q(x) for x in xs) + "]::text[]" if xs else "'{}'::text[]"
OWNER = "(select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')"
SET = "'00000000-0000-4000-8000-00000000d1ff'"
WID = lambda hw: f"(select id from public.words where lang = 'en' and lower(headword) = lower({q(hw)}) order by (sense = '') desc limit 1)"
M1, M2 = "Detached ⇄ Clingy", "Shunned → Belonging"
W = [  # headword, emoji, meaning, example, arabic, extra tags, meter tag
 ("Attachment", "🧷", "A strong emotional bond with someone, like a child with a parent.", "A baby's [attachment] to its mother starts in the first months.", "التعلّق", ["Naming: things & places"], None),
 ("Secure", "🏡", "Feeling safe in your relationships: close to people, but fine on your own too.", "Children who feel [secure] explore the playground, then run back for a hug.", "آمِن (تعلّق آمن)", ["Describing"], (M1, 0)),
 ("Independent", "🚶", "Able to manage things by yourself, while still enjoying other people.", "She is [independent]: she packs her own bag but loves family trips.", "مستقل", ["Describing"], (M1, -1)),
 ("Detached", "🧊", "Keeping your feelings and other people at a distance.", "After the move he became [detached] and stopped calling his friends.", "منفصل عاطفيًا، متباعد", ["Describing"], (M1, -3)),
 ("Clingy", "🧲", "Needing to be close to someone all the time and upset when they are away.", "The puppy was [clingy] and followed her from room to room.", "متشبّث، كثير التعلّق", ["Describing"], (M1, 2)),
 ("Dependent", "🪢", "Needing someone else to decide, help or approve before you can manage.", "He was so [dependent] that he couldn't choose a meal without asking.", "اتّكالي", ["Describing"], (M1, 3)),
 ("People-pleaser", "🎁", "Someone who says yes to keep everyone happy, even when it hurts them.", "As a [people-pleaser], Noor never said no to anyone.", "مُرضي الناس", [], None),
 ("Kind", "💗", "Caring and gentle towards others.", "It was [kind] of you to help.", "لطيف", ["Describing"], None),
 ("Left out", "🙁", "Not included, sometimes by accident.", "I felt [left out] when they forgot to invite me.", "مُستبعَد (منسيّ)", ["Describing"], (M2, -1)),
 ("Excluded", "🚷", "Kept out of a group or activity on purpose.", "The new boy was [excluded] from the game every day.", "مُقصى (إقصاء)", ["Describing"], (M2, -1)),
 ("Rejected", "🚫", "Clearly told or shown that you are not wanted.", "She felt [rejected] when the team said they didn't want her.", "مرفوض", ["Describing"], (M2, -2)),
 ("Ostracized", "👻", "Ignored and shut out by a whole group, as if you were invisible.", "For a week the class [ostracized] him: nobody spoke to him at all.", "منبوذ (نبذ مجتمعي)", ["Describing"], (M2, -3)),
 ("Included", "🤝", "Made part of the group.", "Everyone felt [included] in the class play.", "مُشارَك، مُدمَج", ["Describing"], (M2, 1)),
 ("Belonging", "🏠", "The feeling of being accepted and at home in a group.", "Her new team gave her a sense of [belonging].", "الانتماء", ["Naming: things & places"], (M2, 2)),
]
D = [
 ("attachment-dependence", "Attachment ≠ Dependence", "Attachment is an emotional bond; it is healthy when it feels safe. Dependence is needing someone in order to manage, decide or feel okay.",
  "التعلّق رابطة عاطفية وهو صحي حين يكون آمنًا، أما الاتكالية فهي الحاجة إلى شخص آخر لتدبير أمورك أو اتخاذ قراراتك أو الشعور بالرضا.",
  "Missing your mum on a trip is attachment; not being able to choose your clothes without her is dependence.", None,
  [("Attachment", "A close emotional bond; healthy when you feel safe both together and apart.", "التعلّق"), ("Dependent", "Needing someone else to decide, help or approve before you can manage.", "الاتكالية")]),
 ("independent-detached", "Independent ≠ Detached", "Independent people can manage alone and still connect; detached people keep feelings and others away.",
  "المستقل يدبّر أموره وحده ويبقى قريبًا من الناس، أما المنفصل عاطفيًا فيُبعد المشاعر والآخرين.",
  "Doing homework alone is independent; refusing every hug is detached.", None,
  [("Independent", "Manages alone, but still enjoys and needs people.", "مستقل"), ("Detached", "Shuts feelings and people out.", "منفصل عاطفيًا")]),
 ("left-out-group", "Left out ≠ Excluded ≠ Rejected ≠ Ostracized", "Left out can be an accident; excluded (إقصاء) is kept out on purpose; rejected is told clearly you're not wanted; ostracized (نبذ مجتمعي) is ignored by a whole group, as if invisible.",
  "قد يكون الاستبعاد سهوًا، أما الإقصاء فمتعمّد، والرفض تصريح بأنك غير مرغوب بك، والنبذ المجتمعي تجاهل جماعة كاملة لك وكأنك غير موجود.",
  "Forgetting to invite you is leaving you out; the whole class pretending you aren't there is ostracism.",
  "Psychologist Kipling Williams showed that even short ostracism hurts the needs to belong, to feel worth, to have control and to matter.",
  [("Left out", "Not included, maybe by accident.", "مُستبعَد"), ("Excluded", "Kept out on purpose.", "مُقصى"), ("Rejected", "Clearly told or shown you're not wanted.", "مرفوض"), ("Ostracized", "Ignored and shut out by a group, as if invisible.", "منبوذ")]),
 ("pleaser-kind", "People-pleaser ≠ Kind", "Kindness is a free choice that respects you too; people-pleasing comes from fear of disappointing or losing people, and forgets your own needs.",
  "اللطف اختيار حرّ يحترم نفسك أيضًا، أما إرضاء الناس فنابع من الخوف من خذلانهم أو فقدانهم وينسى حاجاتك.",
  "Helping a friend because you want to is kind; saying yes when you're exhausted because you fear they'll be upset is people-pleasing.", None,
  [("Kind", "Caring by choice, and still able to say no.", "لطيف"), ("People-pleaser", "Says yes out of fear, even when it hurts them.", "مُرضي الناس")]),
]
out = ["""-- =====================================================================
-- Helper Academy — v69: 🧷 attachment & dependence, 🚷 exclusion & ostracism, 🎁 people-pleasing
--   meters "Detached ⇄ Clingy" (golden middle: Secure) and "Shunned → Belonging"; 4 ≠ cards; attachment styles (secure, anxious, avoidant);
--   social exclusion as a tactic; signs people-pleasing and leaves people out; root "was left out"; links and advice.
-- Built by tools/words/build_v69.py. Safe to re-run. Run AFTER v68.
-- ====================================================================="""]
for hw, emo, m, ex, ar, tags, mt in W:
    t = ["Feelings & moods", "Getting along"] + tags + ([f"📶 {mt[0]}: {'+' if mt[1] > 0 and '⇄' in mt[0] else ''}{mt[1]}"] if mt else [])
    out.append(f"""insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', {q(hw)}, '', {q(m)}, {q(ex)}, {q(ar)}, '', '', {q(emo)}, '', '', {A(t)}, {OWNER} where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = lower({q(hw)}));
update public.words set tags = (select array(select distinct x from unnest(tags || {A([x for x in t if x.startswith('📶')])}) x order by x)) where id = {WID(hw)};
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id) select md5('attach-set:' || w.id)::uuid, {SET}, 700, 'term', 1, '{{}}', w.id
from public.words w where w.id = {WID(hw)} and not exists (select 1 from public.set_entries e where e.set_id = {SET} and e.word_id = w.id) on conflict (id) do nothing;""")
for p, (key, title, summ, summ_ar, ex, note, parts) in enumerate(D):
    out.append(f"insert into public.word_differences (key, title, unit, min_age, summary, summary_ar, example, note, position) values ({q(key)},{q(title)},1,0,{q(summ)},{q(summ_ar)},{q(ex)},{q(note)},{70 + p}) on conflict (key) do update set title=excluded.title, summary=excluded.summary, summary_ar=excluded.summary_ar, example=excluded.example, note=excluded.note;")
    for n, (hw, e, ar) in enumerate(parts):
        out.append(f"insert into public.word_difference_parts (diff_key, word_id, explain, explain_ar, position) select {q(key)}, {WID(hw)}, {q(e)}, {q(ar)}, {n} on conflict (diff_key, word_id) do update set explain = excluded.explain, explain_ar = excluded.explain_ar;")
        out.append(f"update public.words set tags = (select array(select distinct x from unnest(tags || array[{q('≠ ' + title)}]) x order by x)) where id = {WID(hw)};")
out.append("""
-- 🔎 signs
insert into public.signs (key, icon, name, category, min_age, about, academic, position) values
 ('people_pleasing', '🎁', 'Says yes to please everyone', 'relationships', 7, 'Agrees, helps and gives in to keep people happy, even when it hurts them.', 'People-pleasing (sociotropy): excessive concern with others'' approval, linked to fear of rejection, low assertiveness and anxious attachment.', 222),
 ('leaves_out', '🚷', 'Leaves people out on purpose', 'tactics', 6, 'Doesn''t let someone join, or gets others to ignore them.', 'Social exclusion and ostracism used as relational aggression.', 223)
on conflict (key) do update set icon=excluded.icon, name=excluded.name, category=excluded.category, min_age=excluded.min_age, about=excluded.about, academic=excluded.academic, position=excluded.position;

-- 🩺 attachment styles (ideas) and social exclusion (a tactic)
insert into public.conditions as c (key, icon, name, kind, parent, cluster, min_age, aliases, about, helps, academic, sources, traits, academic_min_age, position) values
 ('attachment_styles', '🧷', 'Attachment styles', 'idea', null, null, 8, array['التعلّق'],
  'How we bond with the people we love. It starts in childhood with our parents and shapes our friendships later: some feel safe, some worry about being left, some keep their distance.',
  'Warm, reliable care in childhood; later, safe friendships and relationships can make anyone more secure.',
  'Attachment theory (Bowlby) and research by Ainsworth describe patterns of bonding (secure, anxious, avoidant, disorganized). In adults they are usually measured as two dimensions: anxiety about abandonment and avoidance of closeness.',
  array['Bowlby, J. (1969). Attachment and Loss, Vol. 1: Attachment. Basic Books.','Ainsworth, M. D. S., Blehar, M. C., Waters, E., & Wall, S. (1978). Patterns of Attachment. Erlbaum.','Hazan, C., & Shaver, P. (1987). Romantic love conceptualized as an attachment process. Journal of Personality and Social Psychology, 52(3), 511–524.'],
  array['empathy','assertive'], 16, 170),
 ('secure_attachment', '🏡', 'Secure attachment', 'idea', 'attachment_styles', null, 8, '{}',
  'Feels safe with people: can be close and can be alone. Trusts that loved ones will come back.', 'It is the healthy middle of the Detached ⇄ Clingy meter.',
  'Low attachment anxiety and low avoidance: comfortable with intimacy and with autonomy.', '{}', array['confidence'], 16, 171),
 ('anxious_attachment', '🧲', 'Anxious attachment', 'idea', 'attachment_styles', null, 8, '{}',
  'Worries that loved ones will leave or love someone else more, so needs a lot of closeness and reassurance.', 'Steady, predictable love; learning to calm yourself; healthy self-esteem.',
  'High attachment anxiety: hypervigilance to signs of rejection, reassurance seeking, jealousy and difficulty being alone.',
  array['Bartholomew, K., & Horowitz, L. M. (1991). Attachment styles among young adults: a test of a four-category model. Journal of Personality and Social Psychology, 61(2), 226–244.'], array['confidence','assertive'], 16, 172),
 ('avoidant_attachment', '🧊', 'Avoidant attachment', 'idea', 'attachment_styles', null, 8, '{}',
  'Keeps people at a distance and hides feelings, to avoid being hurt or depending on anyone.', 'Patient people who don''t push; small, safe steps of sharing.',
  'High attachment avoidance: discomfort with closeness and dependence, emotional self-reliance, suppression of feelings.',
  array['Bartholomew, K., & Horowitz, L. M. (1991). Attachment styles among young adults: a test of a four-category model. Journal of Personality and Social Psychology, 61(2), 226–244.'], array['feelings'], 16, 173),
 ('social_exclusion', '🚷', 'Social exclusion (ostracism)', 'tactic', null, null, 6, array['إقصاء','نبذ مجتمعي'],
  'Leaving someone out on purpose or getting a group to ignore them, as if they were invisible. It hurts as much as hitting.', 'Invite the one who is left out; tell a trusted adult; one friend makes a huge difference.',
  'Ostracism (being ignored and excluded) threatens the needs for belonging, self-esteem, control and meaningful existence; rejected people can become more aggressive, or try harder to please.',
  array['Williams, K. D. (2001). Ostracism: The Power of Silence. Guilford Press.','Twenge, J. M., Baumeister, R. F., Tice, D. M., & Stucke, T. S. (2001). If you can''t join them, beat them: effects of social exclusion on aggressive behavior. Journal of Personality and Social Psychology, 81(6), 1058–1069.'],
  array['empathy','boundaries'], 16, 174)
on conflict (key) do update set icon=excluded.icon, name=excluded.name, kind=excluded.kind, parent=excluded.parent, min_age=excluded.min_age, aliases=excluded.aliases, about=excluded.about, helps=excluded.helps, academic=excluded.academic, sources=excluded.sources, traits=excluded.traits;
delete from public.condition_signs where condition in ('anxious_attachment','avoidant_attachment','social_exclusion');
insert into public.condition_signs (condition, sign, weight) values
 ('anxious_attachment','fear_abandonment',3), ('anxious_attachment','clingy',3), ('anxious_attachment','needs_reassurance',2), ('anxious_attachment','jealous_rival',2), ('anxious_attachment','people_pleasing',2), ('anxious_attachment','guards_relationship',1),
 ('avoidant_attachment','avoids_people',2), ('avoidant_attachment','cold_emotions',2), ('avoidant_attachment','wont_confide',2), ('avoidant_attachment','shuts_down',2),
 ('social_exclusion','leaves_out',3), ('social_exclusion','silent_punishment',2), ('social_exclusion','isolates_target',2), ('social_exclusion','gossip',1), ('social_exclusion','laughs_at_others',1),
 ('dependent_pd','people_pleasing',2), ('bullying','leaves_out',2)
on conflict do nothing;

-- 🌱 a root: was left out or rejected
insert into public.roots (key, icon, name, kind, min_age, about, protects, academic, sources, position) values
 ('was_left_out', '🚷', 'Was left out or rejected', 'situation', 7, 'Being left out, rejected or ignored by a group, especially again and again. Some people try harder to please; some pull away; some get angry.',
  'One real friend, a group where you belong, and adults who notice and invite you in.',
  'Social rejection increases sensitivity to further rejection and can lead to people-pleasing, withdrawal or aggression.',
  array['Twenge, J. M., Baumeister, R. F., Tice, D. M., & Stucke, T. S. (2001). If you can''t join them, beat them: effects of social exclusion on aggressive behavior. Journal of Personality and Social Psychology, 81(6), 1058–1069.'], 12)
on conflict (key) do update set icon=excluded.icon, name=excluded.name, kind=excluded.kind, min_age=excluded.min_age, about=excluded.about, protects=excluded.protects, academic=excluded.academic, sources=excluded.sources;

-- 🧭 links
delete from public.trait_links where src_key in ('was_left_out','people_pleasing','anxious_attachment','avoidant_attachment','social_exclusion','leaves_out') or dst_key in ('people_pleasing','anxious_attachment','avoidant_attachment','social_exclusion','leaves_out');
insert into public.trait_links (src_type, src_key, src_level, dst_type, dst_key, dst_level, effect, strength, note) values
 ('root','was_left_out',null,'sign','fear_rejection',null,'raises',2,null),
 ('root','was_left_out',null,'sign','people_pleasing',null,'raises',2,'Some try harder to be liked.'),
 ('root','was_left_out',null,'condition','anxious_attachment',null,'raises',1,null),
 ('root','was_left_out',null,'condition','avoidant_attachment',null,'raises',1,'Some pull away so it can''t happen again.'),
 ('root','was_left_out',null,'sign','intense_anger',null,'raises',1,'Some get angry.'),
 ('root','fear_losing',null,'condition','anxious_attachment',null,'raises',3,null),
 ('root','fear_being_hurt',null,'condition','avoidant_attachment',null,'raises',2,null),
 ('trait','empathy','high','sign','people_pleasing',null,'raises',3,null),
 ('trait','assertive','low','sign','people_pleasing',null,'raises',2,null),
 ('trait','confidence','low','condition','anxious_attachment',null,'raises',1,null),
 ('trait','feelings','high','condition','avoidant_attachment',null,'raises',1,null),
 ('trait','assertive','mid','sign','people_pleasing',null,'lowers',2,'Saying no kindly protects you.'),
 ('trait','confidence','mid','condition','anxious_attachment',null,'lowers',2,null),
 ('condition','anxious_attachment',null,'condition','jealousy',null,'raises',2,null),
 ('condition','anxious_attachment',null,'condition','dependent_pd',null,'raises',1,null),
 ('sign','people_pleasing',null,'sign','late_reply',null,'raises',1,null),
 ('trait','empathy','low','condition','social_exclusion',null,'raises',2,null),
 ('condition','malicious_envy',null,'condition','social_exclusion',null,'raises',1,null),
 ('trait','empathy','mid','condition','social_exclusion',null,'lowers',2,null);

-- 📜 advice from the sayings
insert into public.advice (target_type, target_key, word_id, position)
select v.t, v.k, w.id, v.p from (values
 ('sign','people_pleasing','61a9733c-643e-424b-a372-dafbeb4511b8',0), ('sign','people_pleasing','5105459c-a8ca-453d-aae9-a98a576ad199',1), ('sign','people_pleasing','81efbef4-6167-4f48-8b26-0f2812e76bde',2),
 ('condition','anxious_attachment','4ba77bd1-506a-40fa-8be2-4ddd7c897145',0), ('condition','anxious_attachment','a56bce26-1d70-479b-8826-a3f8a01dd1a4',1), ('condition','anxious_attachment','8b61757e-2a7f-4438-bade-c90d707dcf81',2),
 ('condition','social_exclusion','2dd880c2-5839-4d94-8bb9-b774ccd3ab40',0), ('condition','social_exclusion','81efbef4-6167-4f48-8b26-0f2812e76bde',1), ('condition','social_exclusion','2a45c7da-ddb1-4e46-b800-556aeea38e9f',2),
 ('root','was_left_out','81efbef4-6167-4f48-8b26-0f2812e76bde',0), ('root','was_left_out','4ba77bd1-506a-40fa-8be2-4ddd7c897145',1),
 ('condition','avoidant_attachment','50c7b7f9-5f35-4a74-942f-f55a396bb0c1',0)
) as v(t, k, w, p) join public.words w on w.id = v.w::uuid on conflict (target_type, target_key, word_id) do update set position = excluded.position;

-- 🎭 characters
update public.characters set signs = signs || '{"people_pleasing":3}'::jsonb, cond_levels = cond_levels || '{"anxious_attachment":2}'::jsonb,
  conditions = (select array(select distinct unnest(conditions || array['anxious_attachment']))), roots = roots || '{"was_left_out":1}'::jsonb, min_age = greatest(min_age, 8) where id = md5('char:Noor')::uuid;
update public.characters set cond_levels = cond_levels || '{"anxious_attachment":3}'::jsonb, conditions = (select array(select distinct unnest(conditions || array['anxious_attachment']))), signs = signs || '{"people_pleasing":2}'::jsonb where id = md5('char:Sara')::uuid;
update public.characters set cond_levels = cond_levels || '{"anxious_attachment":1}'::jsonb, conditions = (select array(select distinct unnest(conditions || array['anxious_attachment']))) where id = md5('char:Yara')::uuid;
update public.characters set cond_levels = cond_levels || '{"avoidant_attachment":1}'::jsonb, conditions = (select array(select distinct unnest(conditions || array['avoidant_attachment']))), min_age = greatest(min_age, 8) where id = md5('char:Zaid')::uuid;
update public.characters set cond_levels = cond_levels || '{"avoidant_attachment":2}'::jsonb, conditions = (select array(select distinct unnest(conditions || array['avoidant_attachment']))) where id = md5('char:Mr. Hakim')::uuid;
update public.characters set cond_levels = cond_levels || '{"social_exclusion":3}'::jsonb, conditions = (select array(select distinct unnest(conditions || array['social_exclusion']))), signs = signs || '{"leaves_out":3}'::jsonb where id = md5('char:Salwa')::uuid;
update public.characters set signs = signs || '{"leaves_out":2}'::jsonb where id = md5('char:Omar')::uuid;
update public.characters set roots = roots || '{"was_left_out":2}'::jsonb where id in (md5('char:Hiba')::uuid, md5('char:Tariq')::uuid);
""")
out.append(f"select (select count(*) from public.words where exists (select 1 from unnest(tags) t where t like {q('📶 ' + M1 + '%')})) as attach_meter, (select count(*) from public.words where exists (select 1 from unnest(tags) t where t like {q('📶 ' + M2 + '%')})) as belong_meter, (select count(*) from public.conditions where key in ('attachment_styles','secure_attachment','anxious_attachment','avoidant_attachment','social_exclusion')) as conditions;")
open("supabase_v69_attachment.sql", "w").write("\n".join(out) + "\n")
print("ok")
