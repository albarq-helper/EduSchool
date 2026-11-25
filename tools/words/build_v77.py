# v77: 🧩 grammar points (62, A1–C2) with their rules in English and Arabic and which builder choices count for each,
#      the AI Check switch per learner (parent controls it), and the Check results. Feeds levels.html (the level map).
q = lambda s: "null" if s is None else "'" + str(s).replace("'", "''") + "'"
A = lambda xs: "array[" + ",".join(q(x) for x in xs) + "]::text[]" if xs else "'{}'::text[]"
# key, level, name, where it is practised, rule, rule_ar, tokens that count (from js/grammarmap.js)
P = [
 ("be", "A1", "to be: am, is, are", "Sentence: Who", "I am · he / she / it is · we / you / they are. Past: was / were.", "‏I am · he / she / it is · we / you / they are، وفي الماضي was / were.", ["g:be"]),
 ("have", "A1", "have / has", "Sentence: There / I have", "I, you, we, they have · he, she, it has.", "‏have مع I / you / we / they و has مع he / she / it.", ["g:have"]),
 ("pronouns", "A1", "Pronouns (I / me, she / her)", "Sentence: Who", "Subject: I, you, he, she, it, we, they. Object: me, you, him, her, it, us, them.", "‏ضمائر الفاعل I / he / she… وضمائر المفعول me / him / her…", ["who:pron"]),
 ("possadj", "A1", "my, your, her, their", "Sentence: Whose?", "my, your, his, her, its, our, their come before a thing: my bag.", "‏صفات الملكية تأتي قبل الاسم: my bag.", ["own:adj", "det:my"]),
 ("plurals", "A1", "Plural nouns (-s, -es, children)", "Naming words: How many?", "Many things: add -s or -es (cats, boxes); some are irregular (children, feet).", "‏الجمع بإضافة s أو es، وبعضه غير قياسي مثل children.", ["noun:pl", "g:irrpl", "j:rel-many"]),
 ("articles", "A1", "a / an / the", "Joiner a/an/the button, Little Words", "a before a consonant sound, an before a vowel sound, the for the one we both know.", "‏a قبل الصوت الساكن و an قبل المتحرك و the للمعروف.", ["g:an", "j:art", "det:a", "det:the"]),
 ("this", "A1", "this / that / these / those", "Naming words: This is…", "this / these near, that / those far; this, that + one; these, those + many.", "‏this / these للقريب و that / those للبعيد.", ["g:this", "det:this", "det:that", "det:these", "det:those"]),
 ("there", "A1", "there is / there are", "Naming words: There is…", "There is + one; there are + many.", "‏There is للمفرد و There are للجمع.", ["g:there"]),
 ("presimple", "A1", "Present simple", "Sentence: time line", "Things that are always true or happen often: She plays.", "‏المضارع البسيط للعادات والحقائق.", ["t:present", "g:s3"]),
 ("prescont", "A1", "Present continuous", "Sentence: time line", "Happening now: am / is / are + -ing.", "‏ما يحدث الآن: am / is / are + ing.", ["t:prescont"]),
 ("can", "A1", "can / can't", "Sentence: modals", "can + base verb: able to, or allowed.", "‏can + الفعل في أصله: يستطيع أو مسموح.", ["g:modal-can"]),
 ("imperative", "A1", "Telling to (Sit down. Don't run.)", "Sentence: Say it", "Start with the base verb; not: Don't + verb.", "‏الأمر يبدأ بالفعل في أصله، والنهي Don't + الفعل.", ["g:imp"]),
 ("prepositions", "A1", "in / on / at", "Little Words", "AT a point or clock time, ON a surface or day, IN inside or a month.", "‏AT للنقطة والساعة، ON للسطح واليوم، IN للداخل والشهر.", ["lw:prep"]),
 ("questions", "A1", "Yes/no and wh- questions", "Sentence: asking; Conversation", "The helper verb goes first; no helper verb? use do / does / did.", "‏الفعل المساعد يتقدّم، وإن لم يوجد نستخدم do / does / did.", ["g:q-do", "g:q-aux", "d:q"]),
 ("pastsimple", "A2", "Past simple", "Sentence: time line", "Finished in the past: walked, went.", "‏الماضي البسيط لحدث انتهى.", ["t:past"]),
 ("pastcont", "A2", "Past continuous", "Sentence: time line", "Was / were + -ing: in the middle of something in the past.", "‏was / were + ing لحدث كان مستمرًا في الماضي.", ["t:pastcont"]),
 ("future", "A2", "will / going to", "Sentence: time line", "will for decisions and guesses; going to for plans.", "‏will للقرار والتوقع، و going to للخطط.", ["t:future", "t:goingto"]),
 ("presperf", "A2", "Present perfect (ever, never, just, yet)", "Sentence: time line", "has / have + past participle: before now, and it matters now.", "‏has / have + التصريف الثالث: حدث قبل الآن وله أثر الآن.", ["t:presperf"]),
 ("compare", "A2", "Comparatives and superlatives", "Describing words: Compare", "Short words: -er / -est; long words: more / most; as … as.", "‏الصفات القصيرة er / est والطويلة more / most.", ["adj:er", "adj:est", "adj:asas"]),
 ("countable", "A2", "some / any, much / many, a few / a little", "Naming words: How many?", "Count it: many, a few. Can't count it: much, a little. some in telling, any in not and asking.", "‏المعدود many / a few وغير المعدود much / a little.", ["g:count", "g:uncount", "g:someany", "g:manymuch"]),
 ("adverbs", "A2", "Adverbs and word order (always, never)", "Sentence: time words", "always, usually, never go before the main verb: She always plays.", "‏ظروف التكرار تأتي قبل الفعل الرئيسي.", ["adv:mid"]),
 ("posspron", "A2", "mine, yours, Reem's", "Sentence: Whose?", "'s shows who owns it (Reem's book); mine, yours stand alone.", "‏'s للملكية، و mine / yours تأتي وحدها.", ["own:name"]),
 ("must", "A2", "must, have to, should", "Sentence: modals", "must = strong rule; have to = rule from outside; should = advice.", "‏must قاعدة قوية، have to إلزام خارجي، should نصيحة.", ["g:modal-must", "g:modal-haveto", "g:modal-should"]),
 ("linking", "A2", "and, but, or, because, so", "Joiners, Linking Words", "Join two ideas: and (more), but (different), because (why), so (result).", "‏أدوات الربط: and / but / or / because / so.", ["j:list", "lnk:basic"]),
 ("cond1", "A2", "First conditional", "Joiners: if", "If + present, will + verb: If it rains, we will stay home.", "‏If + المضارع، will + الفعل.", ["j:cond:first"]),
 ("shortanswers", "A2", "Yes, I do · So do I · Neither do I", "Conversation", "Answer with the helper verb: Yes, I do. So do I. Neither do I.", "‏نجيب بالفعل المساعد: Yes, I do / So do I.", ["d:r"]),
 ("makedo", "A2", "make / do", "Word partners", "make = something new comes out; do = jobs and activities.", "‏make لصنع شيء جديد، و do للأعمال والأنشطة.", ["w:makedo"]),
 ("travel", "A2", "by car, on foot, go home", "Little Words", "by + vehicle (no a / the); on foot; go home (no to).", "‏by + وسيلة النقل، on foot، go home بدون to.", ["lw:travel"]),
 ("perfvspast", "B1", "Present perfect vs past simple", "Sentence: time line", "Finished time (yesterday) → past simple; no finished time → present perfect.", "‏مع زمن منتهٍ نستخدم الماضي البسيط، وبدونه المضارع التام.", ["t:presperf+past"]),
 ("perfcont", "B1", "Present perfect continuous", "Sentence: time line", "has / have been + -ing: started before and still going (for, since).", "‏has / have been + ing لحدث بدأ ولا يزال مستمرًا.", ["t:presperfcont"]),
 ("pastperf", "B1", "Past perfect", "Sentence: time line; Joiners: if", "had + past participle: before another past moment.", "‏had + التصريف الثالث لحدث قبل حدث آخر في الماضي.", ["t:pastperf", "j:cond:third"]),
 ("usedto", "B1", "used to", "Sentence: time line", "used to + base verb: past habits that stopped.", "‏used to + الفعل في أصله لعادة في الماضي انتهت.", ["t:usedto", "g:usedto"]),
 ("cond02", "B1", "Zero and second conditionals", "Joiners: if", "Zero: always true. Second: imagined now (If I had wings, I would fly).", "‏الحالة الصفرية للحقائق، والثانية للتخيل في الحاضر.", ["j:cond:zero", "j:cond:second"]),
 ("passive", "B1", "Passive: present and past", "Sentence: the thing first", "The thing first, be + past participle, by + who did it.", "‏المبني للمجهول: be + التصريف الثالث.", ["g:passive"]),
 ("relative", "B1", "who / which / that", "Joiners", "who for people, which for things, that for both.", "‏who للأشخاص و which للأشياء و that للاثنين.", ["j:rel"]),
 ("reported", "B1", "Reported speech: statements", "Conversation: she said…", "One step back in time: like → liked, will → would.", "‏في الكلام المنقول نرجع الزمن خطوة للوراء.", ["d:rep"]),
 ("gerinf", "B1", "enjoy reading / want to read", "Joiners: verb + verb", "Some verbs take -ing, some take to, some take both.", "‏بعض الأفعال يتبعها ing وبعضها to.", ["j:vv"]),
 ("might", "B1", "might, could, may", "Sentence: modals", "might = maybe; could = possible, or past of can.", "‏might = ربما، و could = ممكن أو ماضي can.", ["g:modal-might"]),
 ("tags", "B1", "Question tags", "Sentence: …, isn't it?", "Telling sentence → not-tag; not-sentence → yes-tag.", "‏الجملة المثبتة يتبعها سؤال منفي والعكس.", ["g:tag"]),
 ("tooenough", "B1", "too and enough", "Describing words: Compare", "too + word = more than OK; word + enough = just OK.", "‏too قبل الصفة للزيادة، و enough بعدها للكفاية.", ["adj:too", "adj:enough"]),
 ("phrasal", "B1", "Phrasal verbs and idioms", "Word partners", "A verb + a small word with a new meaning: give up, run out of.", "‏فعل + كلمة صغيرة بمعنى جديد.", ["w:phrasal"]),
 ("sosuch", "B1", "so / such, either / neither", "Joiners", "so + word, such a + word + thing; either … or, neither … nor.", "‏so + صفة، such a + صفة + اسم.", ["j:so", "j:either", "j:neither"]),
 ("cond3", "B2", "Third and mixed conditionals", "Joiners: if", "If + had done, would have done (it didn't happen).", "‏If + had + التصريف الثالث، would have + التصريف الثالث.", ["j:cond:third", "j:cond:mixed"]),
 ("wish", "B2", "wish / if only", "Joiners: I wish", "About now: one step back; about the past: had + done; would for others.", "‏التمني عن الحاضر بالماضي، وعن الماضي بـ had + التصريف الثالث.", ["j:wish"]),
 ("pastmodals", "B2", "must have, can't have, should have", "Sentence: modals in the past", "must have / can't have = sure about the past; should have = good idea that didn't happen.", "‏must have / can't have للاستنتاج عن الماضي، و should have للندم.", ["g:modal-sure", "g:modal-should+past"]),
 ("passiveall", "B2", "Passive in all tenses", "Sentence: the thing first", "has been eaten, will be eaten, was being eaten, must be eaten.", "‏المبني للمجهول في كل الأزمنة.", ["pas:adv"]),
 ("reportedq", "B2", "Reported questions and requests", "Conversation: she said…", "asked if …; asked me to …; no question mark.", "‏السؤال المنقول: asked if، والطلب: asked me to.", ["d:repq"]),
 ("nondefining", "B2", "Extra information with commas", "Joiners: who / which, extra info", "Rover, who loves bones, … (never that).", "‏المعلومة الإضافية بين فاصلتين ولا نستخدم that.", ["j:rel-nd"]),
 ("futureperf", "B2", "Future continuous and future perfect", "Sentence: time line", "will be + -ing; will have + past participle.", "‏will be + ing و will have + التصريف الثالث.", ["t:futurecont", "t:futureperf"]),
 ("contrast", "B2", "although, despite, whereas, not only", "Joiners, Linking Words", "Show contrast or add a surprise: although it rained, we played.", "‏أدوات التضاد: although / despite / whereas.", ["lnk:contrast", "j:notonly"]),
 ("families", "B2", "Word families (achieve, achievement)", "Sentence: shapes", "The same idea as a doing word, a thing, a person or a describing word.", "‏عائلة الكلمة: فعل واسم وصفة.", ["shape:thing", "shape:person", "shape:describing"]),
 ("zeroarticle", "B2", "No article: at home, by car, go to bed", "Little Words", "Some fixed phrases take no a or the.", "‏عبارات ثابتة بدون أداة.", ["lw:zero"]),
 ("inversion", "C1", "Inversion (Never have I…)", "Sentence: Style", "Start with never / rarely, then helper verb + who.", "‏نبدأ بـ never / rarely ثم الفعل المساعد ثم الفاعل.", ["g:inversion"]),
 ("cleft", "C1", "It was Rover who…", "Sentence: Style", "It is / was + the person + who … to point at who did it.", "‏It was + الشخص + who لإبراز الفاعل.", ["g:cleft"]),
 ("participle", "C1", "Having finished… / Walking home…", "Joiners", "An -ing or having + done part, then the main sentence, same person.", "‏جملة تبدأ بـ ing أو having + التصريف الثالث.", ["j:part"]),
 ("invcond", "C1", "Had I known… / Should it rain…", "Joiners: if, formal", "Leave out if and turn it round.", "‏نحذف if ونقلب الترتيب.", ["j:cond-inv"]),
 ("register", "C1", "Polite and formal style", "Conversation: polite", "Could you…, please? Would you…? are softer.", "‏Could you / Would you أكثر تهذيبًا.", ["d:pol"]),
 ("nuance", "C1", "Near-synonyms and nuance", "Not the same cards, meters", "Choose the exact word: a breeze is not a gale.", "‏اختيار الكلمة الدقيقة.", ["p:meter"]),
 ("subjunctive", "C2", "I suggest that she be…", "Joiners", "After suggest / insist / it is important that: base verb for everyone.", "‏بعد suggest / insist نستخدم الفعل في أصله.", ["j:sub"]),
 ("ellipsis", "C2", "Leaving words out (ellipsis)", "AI Check", "Leave out what is clear: She can swim and I can too.", "‏حذف ما هو مفهوم.", []),
 ("idioms", "C2", "Idiomatic and figurative meaning", "Idioms, meaning senses", "Words that mean more than they say: raining cats and dogs.", "‏تعبيرات اصطلاحية ومعانٍ مجازية.", ["w:idiom"]),
 ("rhetoric", "C2", "Rhetorical devices in writing", "AI Check", "Repetition, contrast and questions that make writing stronger.", "‏أساليب بلاغية تقوّي الكتابة.", []),
]
assert len(P) == 62, len(P)
out = ["""-- =====================================================================
-- Helper Academy — v77: 🧩 grammar points (62, A1–C2), the AI Check switch per learner, and Check results
--   grammar_points: rule in English and Arabic + which builder choices count (tokens from js/grammarmap.js); read by everyone signed in.
--   ai_check_settings: the parent turns AI Check on for a child, with a daily cap (off by default).
--   grammar_checks: each checked sentence (learner, sentence, result, points); the learner and her teacher / parent can read them.
--   Built by tools/words/build_v77.py. Safe to re-run. Run AFTER v76.
-- =====================================================================
create table if not exists public.grammar_points (
  key text primary key, level text not null check (level in ('A1','A2','B1','B2','C1','C2')), name text not null, place text not null default '',
  rule text not null default '', rule_ar text not null default '', tokens text[] not null default '{}', position int not null default 0);
alter table public.grammar_points enable row level security;
drop policy if exists gp_read on public.grammar_points;
create policy gp_read on public.grammar_points for select using (true);
grant select on public.grammar_points to anon, authenticated;

create table if not exists public.ai_check_settings (
  student_id uuid primary key references public.profiles(id) on delete cascade,
  check_on boolean not null default false, daily_cap int not null default 10 check (daily_cap between 0 and 50),
  updated_by uuid default auth.uid(), updated_at timestamptz not null default now());
alter table public.ai_check_settings enable row level security;
drop policy if exists acs_read on public.ai_check_settings;
create policy acs_read on public.ai_check_settings for select using (student_id = auth.uid() or public.teaches(student_id) or public.is_admin());
drop policy if exists acs_write on public.ai_check_settings;
create policy acs_write on public.ai_check_settings for insert with check (public.teaches(student_id) or public.is_admin());
drop policy if exists acs_update on public.ai_check_settings;
create policy acs_update on public.ai_check_settings for update using (public.teaches(student_id) or public.is_admin()) with check (public.teaches(student_id) or public.is_admin());
grant select, insert, update on public.ai_check_settings to authenticated;

create table if not exists public.grammar_checks (
  id bigserial primary key, user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  sentence text not null check (length(sentence) between 2 and 400), ok boolean not null default true,
  points text[] not null default '{}', result jsonb not null default '{}'::jsonb, created_at timestamptz not null default now());
create index if not exists grammar_checks_user_idx on public.grammar_checks (user_id, created_at desc);
alter table public.grammar_checks enable row level security;
drop policy if exists gc_read on public.grammar_checks;
create policy gc_read on public.grammar_checks for select using (user_id = auth.uid() or public.teaches(user_id) or public.is_admin());
drop policy if exists gc_insert on public.grammar_checks;
create policy gc_insert on public.grammar_checks for insert with check (user_id = auth.uid());
grant select, insert on public.grammar_checks to authenticated;
grant usage on sequence public.grammar_checks_id_seq to authenticated;
"""]
rows = [f"({q(k)},{q(l)},{q(n)},{q(pl)},{q(r)},{q(ra)},{A(t)},{i + 1})" for i, (k, l, n, pl, r, ra, t) in enumerate(P)]
out.append("insert into public.grammar_points (key, level, name, place, rule, rule_ar, tokens, position) values\n" + ",\n".join(rows) +
           "\non conflict (key) do update set level = excluded.level, name = excluded.name, place = excluded.place, rule = excluded.rule, rule_ar = excluded.rule_ar, tokens = excluded.tokens, position = excluded.position;")
out.append("select (select count(*) from public.grammar_points) as points, (select count(*) from public.grammar_points where tokens = '{}') as ai_only;")
open("supabase_v77_grammar_points.sql", "w").write("\n".join(out) + "\n")
print("ok")
