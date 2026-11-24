# v56: 🎭 Character library — every story picks its characters from here.
# A character = who they are (age, sex, education, role) + a personality made of TRAITS on meters (-2 … +2, the golden middle is 0),
# some traits change with the place (home / friends / school / work / online), and optional CONDITIONS (issues, behaviours, conditions, disorders, ideas).
import json
q = lambda s: "null" if s is None else "'" + str(s).replace("'", "''") + "'"
J = lambda o: q(json.dumps(o, ensure_ascii=False)) + "::jsonb"
A = lambda xs: "array[" + ",".join(q(x) for x in xs) + "]::text[]" if xs else "'{}'::text[]"

CONTEXTS = [("home", "🏠", "Home & private life"), ("friends", "🧑‍🤝‍🧑", "With friends"), ("school", "🏫", "School"), ("work", "💼", "Work & teams"), ("online", "💻", "Online")]

# key, icon, name, family, min_age, varies_by_place,
# low: (name, for self, for others), mid: (name, text), high: (name, for self, for others), place note
TRAITS = [
 ("boundaries", "🚧", "Respecting boundaries", "Character", 6, True,
  ("Crosses lines", "Gets into trouble and loses people's trust.", "Steps into other people's private space, things and choices."),
  ("Knows the line", "Knows what is OK and not OK, for himself and for others."),
  ("Builds walls", "Feels lonely and won't ask for help.", "Won't share or join in, even when working together is needed."),
  "The line moves with the place: in someone's private life, give space; in a school project or a team at work, joining in is expected."),
 ("feelings", "🎛️", "Controlling feelings", "Character", 6, True,
  ("Explodes", "Says and does things he is sorry for later.", "Scares or hurts people when angry."),
  ("Calm and steady", "Feels anger, sadness and joy, and still acts calmly."),
  ("Bottles up", "Hides feelings until they pile up.", "Seems cold: people can't tell how he feels."),
  "Some people are calm at school and explode at home, or the other way round."),
 ("responsibility", "⚖️", "Taking responsibility", "Character", 6, False,
  ("Blames others", "Never learns from what went wrong.", "Puts the blame on other people unfairly."),
  ("Owns it", "Knows that actions and words have results, and accepts them without excuses."),
  ("Blames himself for everything", "Feels guilty even for things that were not his fault.", "Takes over other people's jobs, so they don't learn."), ""),
 ("empathy", "💗", "Respect & empathy", "Character", 6, True,
  ("Selfish", "Finds it hard to keep real friends.", "Ignores how others feel."),
  ("Kind and caring", "Treats others kindly and understands their feelings."),
  ("People-pleaser", "Can't say no and forgets his own needs.", "Others may lean on him too much."), ""),
 ("decisions", "🧭", "Making decisions", "Character", 7, True,
  ("Can't decide", "Misses chances while waiting.", "Others always have to decide for him."),
  ("Chooses wisely", "Thinks, chooses, and accepts the results of the choice."),
  ("Rushes and takes over", "Jumps in without thinking about the results.", "Decides for others without asking them."), ""),
 ("self_honesty", "🪞", "Honest with myself", "Character", 7, False,
  ("Denies mistakes", "Doesn't learn from experience.", "Others get blamed for his mistakes."),
  ("Sees himself clearly", "Admits mistakes and is honest with himself."),
  ("Too hard on himself", "Every mistake feels like a disaster.", "Can be just as harsh about other people's mistakes."), ""),
 ("conscience", "🌟", "Inner compass (conscience)", "Character", 7, False,
  ("Needs a watcher", "Does the right thing only when someone is watching.", "Can't be trusted when alone."),
  ("Knows right from wrong", "Tells good from bad without anyone checking."),
  ("Guilty about everything", "Worries for days about tiny mistakes.", "Judges other people harshly."), ""),
 ("mindset", "🌱", "Scarcity ⇄ Abundance mindset", "Mindset", 9, True,
  ("Scarcity", "Feels anxious and afraid: there is never enough.", "\"For me to win, you must lose\": doesn't trust, doesn't share."),
  ("Abundance (win-win)", "Believes there is enough good for everyone; shares, trusts, and is happy when others succeed."),
  ("Too trusting", "May be taken advantage of.", "Promises more than can really be given."), ""),
 ("outlook", "☀️", "Hope (optimism)", "Mindset", 6, False,
  ("Complainer", "Sees only problems; the future always looks scary.", "Brings everyone's mood down."),
  ("Hopeful and realistic", "Expects good things and still sees real problems."),
  ("Blind optimist", "Ignores real problems until they grow.", "Doesn't take other people's worries seriously."), ""),
 ("encouraging", "📣", "Encouraging others", "Character", 6, True,
  ("Puts others down", "Ends up with people who avoid him.", "Makes others feel small and give up."),
  ("Honest encourager", "Cheers others on and tells the truth kindly."),
  ("Empty praise", "People stop believing his words.", "Says everything is great, so nobody improves."), ""),
 ("drive", "🔥", "Passion & effort", "Character", 6, True,
  ("Gives up easily", "Leaves things unfinished.", "Others have to do his share."),
  ("Works hard, rests well", "Keeps going and takes healthy breaks."),
  ("Never stops", "Burns out and gets tired or ill.", "Forgets the people around him."), ""),
 ("confidence", "💪", "Self-esteem", "Character", 7, True,
  ("Feels worthless", "Doesn't try, believing he will fail.", "Lets others treat him badly."),
  ("Healthy confidence", "Knows his strengths and his weak points."),
  ("Show-off", "Can't hear advice.", "Looks down on others."), ""),
 ("truthful", "🗣️", "Telling the truth", "Character", 6, True,
  ("Lies", "Has to remember every lie; gets caught.", "People stop trusting him."),
  ("Honest and kind", "Tells the truth gently."),
  ("Hurtfully blunt", "Loses friends.", "Says hurtful truths without caring how they land."), ""),
 ("humour", "😄", "Humour", "Character", 7, True,
  ("Always serious", "Misses the fun in life.", "Others feel they can't relax around him."),
  ("Kind humour", "Jokes that make everyone smile, at the right time."),
  ("Mask of funny", "Jokes to hide sadness or worry.", "Jokes that hurt, or jokes when someone needs him to listen."), ""),
]

# key, icon, name, kind, min_age, aliases, text (for the child), signs, who helps, related traits
CONDITIONS = [
 ("bullying", "🛑", "Bullying", "behaviour", 6, [],
  "Hurting someone again and again on purpose, when it is hard for them to defend themselves: hitting, mean words, leaving someone out, or online.",
  ["Picks on the same person again and again", "Laughs when someone is hurt", "Gets others to join in"],
  "Tell a trusted adult. People who watch (bystanders) can help by not laughing and by speaking up.", ["empathy", "boundaries"]),
 ("lying", "🤥", "Lying", "behaviour", 6, [],
  "Saying things that are not true, often to escape trouble or to look better. Small lies tend to grow into bigger ones.",
  ["Stories change each time", "Blames others", "Avoids eye contact or over-explains"],
  "Being honest early, even about mistakes; adults who stay calm when the truth is told.", ["truthful", "self_honesty"]),
 ("low_self_esteem", "🥀", "Low self-esteem", "issue", 7, ["self-esteem"],
  "Believing you are not good enough, even when that is not true.",
  ["\"I can't\" before trying", "Stops trying after one mistake", "Lets others be unkind"],
  "Small wins, kind people, and noticing your strengths.", ["confidence"]),
 ("funny_mask", "🎭", "Living behind a funny mask", "issue", 10, ["mask of funny"],
  "Always joking to hide sadness, fear or loneliness inside. Everyone laughs, so nobody asks how they really are.",
  ["Turns every serious talk into a joke", "Seems happy with everyone, but quiet when alone"],
  "A friend or adult who asks, \"How are you, really?\" and listens.", ["humour", "feelings"]),
 ("autism", "🐠", "Autism", "condition", 8, ["autism spectrum", "Asperger's"],
  "A different way the brain works, from birth. It can make noise, change or social rules hard, and often comes with deep focus on favourite topics. Like a fish out of water in some places, and a great swimmer in others. \"Asperger's\" is an older name now included in the autism spectrum.",
  ["Prefers routines; changes feel upsetting", "Finds jokes, hints or eye contact hard", "Strong interest in a few topics", "Sounds, lights or labels can feel too much"],
  "Understanding and patience from others; doctors and specialists can diagnose it and give support. It is not something to \"fix\" or tease.", []),
 ("ocd", "🔁", "OCD (obsessive-compulsive disorder)", "condition", 12, ["وسواس قهري"],
  "Unwanted, worrying thoughts keep coming back (obsessions), and the person repeats actions to calm the worry (compulsions), like washing or checking again and again.",
  ["Repeats an action many times", "Very upset if things are not \"just right\"", "Knows the worry doesn't make sense but can't stop it"],
  "Doctors and therapists; it can be treated.", ["conscience"]),
 ("ptsd", "⚡", "PTSD (post-traumatic stress disorder)", "condition", 13, [],
  "After something very frightening, the memories keep coming back, with nightmares and always feeling on alert, long after the danger is gone.",
  ["Nightmares or sudden memories", "Avoids places that remind them", "Jumps at sudden noises"],
  "Doctors and therapists; it can be treated, and support from family helps a lot.", ["feelings"]),
 ("toxic", "☠️", "Toxic (poisonous) behaviour", "behaviour", 13, ["poisoned personality"],
  "A pattern of behaviour that harms the people around: putting others down, tricking them (manipulation), making them feel guilty, or always being the victim. It is not a medical diagnosis.",
  ["You feel worse about yourself after time with them", "Rules change to suit them", "Never says sorry"],
  "Clear boundaries; talking to someone trusted; sometimes keeping distance.", ["boundaries", "empathy", "encouraging"]),
 ("lucifer_effect", "🎭", "The Lucifer effect", "idea", 15, [],
  "An idea from psychologist Philip Zimbardo: ordinary people can do cruel things when the situation pushes them, for example when they get power over others, wear a uniform or nobody checks them. It came from his Stanford Prison Experiment (1971), which other scientists have since criticised.",
  ["Following the group or a role instead of the conscience", "\"I was only doing my job\""],
  "Knowing the danger helps; so does standing up, even alone, when something is wrong.", ["conscience", "boundaries"]),
 ("narcissistic", "🪞", "Narcissistic personality disorder", "disorder", 16, ["narcissist"],
  "A long-lasting pattern of needing admiration, feeling more special than others, and having little empathy. Only a doctor can diagnose it; calling someone a \"narcissist\" in a fight is not a diagnosis.",
  ["Needs constant praise", "Can't take criticism", "Uses people to get what they want"],
  "Doctors and therapists. People around them may need strong boundaries.", ["empathy", "confidence"]),
 ("bpd", "🌊", "Borderline personality disorder (BPD)", "disorder", 18, ["BPD"],
  "Very strong feelings that change fast, a deep fear of being left alone, relationships that swing between love and anger, and acting on impulse. Only a doctor can diagnose it, and it can be treated (for example with DBT therapy).",
  ["Feelings change very quickly", "Strong fear of being abandoned", "Sees people as all good or all bad"],
  "Doctors and therapists; patience and clear boundaries from others.", ["feelings", "boundaries"]),
 ("sadism", "🖤", "Sadism", "disorder", 18, ["sadistic"],
  "Enjoying other people's pain or humiliation. Psychologists study it as one of the \"dark traits\" of personality. It is very different from simple anger.",
  ["Enjoys watching others suffer", "Cruelty for fun, not only when angry"],
  "Professionals; the people hurt need protection and support.", ["empathy", "conscience"]),
]

ROLES = [("wise", "🦉", "Wise one", "Explains what is happening and why, and helps others understand."),
         ("doctor", "🩺", "Doctor", "Can recognise signs, give a diagnosis and medical advice."),
         ("encourager", "📣", "Encourager", "Keeps others going."), ("hero", "🦸", "Hero", "The one the story follows."),
         ("friend", "🤝", "Friend", "Stands next to the hero."), ("rival", "⚔️", "Rival", "Wants the same thing, or the opposite."),
         ("trouble", "🌪️", "Trouble-maker", "Brings the problem into the story."), ("helper", "🧰", "Helper", "Helps with skills or things."),
         ("family", "👪", "Family", "Parents, brothers, sisters, grandparents."), ("teacher", "🧑‍🏫", "Teacher", "Teaches and guides.")]

# name, emoji, age, sex, education, role, min_age, bio, traits, conditions
T = lambda **k: k
CHARS = [
 ("Rover", "🐶", 5, "male", "none", "hero", 0, "A curious family dog who wants to help but sometimes jumps in too fast.", T(drive=1, decisions=1, boundaries=-1, empathy=1), []),
 ("Grandpa Yusuf", "👴", 72, "male", "university", "wise", 0, "A retired teacher who listens first and speaks last. He explains why people act as they do.", T(feelings=0, empathy=0, self_honesty=0, encouraging=0, outlook=0), []),
 ("Dr. Salma", "👩‍⚕️", 45, "female", "doctorate", "doctor", 0, "A children's doctor and psychiatrist. She explains signs kindly and says what help is possible.", T(empathy=0, truthful=0, boundaries=0, feelings=0), []),
 ("Ms. Huda", "👩‍🏫", 34, "female", "university", "teacher", 0, "A class teacher who is fair and firm.", T(boundaries=0, encouraging=0, responsibility=0, feelings=0), []),
 ("Mia", "👧", 10, "female", "primary", "hero", 0, "Brave and curious; asks a lot of questions.", T(drive=1, outlook=1, confidence=0, empathy=0), []),
 ("Sami", "👦", 9, "male", "primary", "trouble", 6, "Quick with excuses. When something breaks, it's never his fault.", T(responsibility=-2, truthful=-1, self_honesty=-1, confidence=1), ["lying"]),
 ("Noor", "👧", 11, "female", "primary", "friend", 0, "Helps everyone and never says no, even when she is tired.", T(empathy=2, boundaries={"all": 1, "friends": 2, "home": 1}, confidence=-1), []),
 ("Omar", "🧒", 12, "male", "middle", "trouble", 6, "Big for his age; he picks on smaller children when adults aren't looking.", T(empathy=-2, boundaries=-2, conscience=-1, confidence=1), ["bullying"]),
 ("Layla", "👩", 13, "female", "middle", "friend", 0, "Calm at school, but at home she explodes when she's tired.", T(feelings={"all": 0, "home": -2, "school": 0}, empathy=1), []),
 ("Hamza", "👦", 10, "male", "primary", "rival", 0, "Complains about everything: the weather, the food, the game.", T(outlook=-2, encouraging=-1, drive=-1), []),
 ("Sunny", "🐤", 3, "female", "none", "encourager", 0, "A little bird who always says \"You can do it!\" and means it.", T(outlook=1, encouraging=0, empathy=1), []),
 ("Captain Hope", "🦸", 30, "male", "university", "hero", 0, "A cheerful hero who sometimes ignores real danger because \"it'll be fine\".", T(outlook=2, decisions=1, confidence=1), []),
 ("Tariq", "🧑", 15, "male", "high", "friend", 10, "The funniest person in class. Nobody knows he is sad at home.", T(humour=2, feelings=1, confidence=-1), ["funny_mask"]),
 ("Kareem", "🧒", 11, "male", "primary", "hero", 8, "Knows everything about trains. Loud places and changes of plan are hard for him.", T(drive=2, truthful=1, boundaries={"all": 0, "friends": 1}), ["autism"]),
 ("Aunt Mona", "👩", 40, "female", "high", "family", 0, "Gives advice nobody asked for and opens other people's letters.", T(boundaries={"all": -2, "home": -2, "work": 0}, empathy=1, truthful=1), []),
 ("Zaid", "👨", 38, "male", "university", "family", 0, "A dad who keeps his feelings inside; his children can't tell when he is sad.", T(feelings=2, responsibility=1, humour=-1), []),
 ("Rana", "👧", 12, "female", "middle", "hero", 0, "Waits so long to choose that the chance is gone.", T(decisions=-2, confidence=-1, conscience=1), []),
 ("Fox the Trickster", "🦊", 6, "male", "none", "trouble", 0, "Clever and charming; he wins by making others lose.", T(mindset=-2, truthful=-2, empathy=-1, confidence=1), []),
 ("Bear Baba", "🐻", 20, "male", "none", "wise", 0, "A slow, gentle bear who shares honey with the whole forest.", T(mindset=0, empathy=0, outlook=0, feelings=0), []),
 ("Dana", "👩", 14, "female", "high", "friend", 12, "Checks the door lock ten times and feels terrible if things aren't \"just right\".", T(conscience=2, self_honesty=1, feelings=1), ["ocd"]),
 ("Lina", "👧", 9, "female", "primary", "friend", 7, "Thinks she is bad at everything, so she doesn't try.", T(confidence=-2, drive=-1, outlook=-1), ["low_self_esteem"]),
 ("Coach Adel", "🧔", 35, "male", "university", "encourager", 0, "A football coach who cheers loudly and tells the truth kindly.", T(encouraging=0, drive=1, truthful=0), []),
 ("Max the Show-off", "😎", 13, "male", "middle", "rival", 0, "Has the newest phone and makes sure everyone knows.", T(confidence=2, empathy=-1, encouraging=-1), []),
 ("Rex the Robot", "🤖", 1, "other", "none", "helper", 0, "A robot who says exactly what he thinks, even when it hurts.", T(truthful=2, empathy=-1, humour=-2), []),
 ("Fatima", "👩‍💼", 28, "female", "university", "hero", 0, "Works all night and forgets to eat; her team never sees her rest.", T(drive=2, boundaries={"all": 0, "work": -1}, responsibility=2), []),
 ("Mr. Basil", "👨‍💼", 50, "male", "university", "trouble", 13, "A manager who takes credit for his team's work and makes them feel small.", T(empathy=-2, encouraging=-2, truthful=-1, confidence=2), ["toxic"]),
 ("Captain Faris", "🪖", 42, "male", "university", "hero", 13, "A soldier home from war. Fireworks make his heart race; he sleeps badly.", T(feelings=1, responsibility=1, boundaries=1), ["ptsd"]),
 ("Guard Kamal", "💂", 25, "male", "high", "trouble", 15, "A kind young man who changes when he gets a uniform and power over others.", T(conscience={"all": 0, "work": -2}, boundaries={"all": 0, "work": -2}), ["lucifer_effect"]),
 ("Victor", "🕴️", 35, "male", "university", "rival", 16, "Charming at first; he needs everyone to admire him and can't stand criticism.", T(confidence=2, empathy=-2, self_honesty=-2), ["narcissistic"]),
 ("Rania", "👩", 24, "female", "university", "hero", 18, "Loves deeply, fears being left, and her feelings change like the sea.", T(feelings=-2, boundaries=-1, decisions=1), ["bpd"]),
 ("The Shadow", "🦹", 40, "male", "university", "trouble", 18, "A villain who enjoys other people's fear.", T(empathy=-2, conscience=-2), ["sadism"]),
 ("Lulu the Cat", "🐱", 4, "female", "none", "friend", 0, "Loves her own space: \"Don't touch my basket!\" but plays happily outside.", T(boundaries={"all": 0, "home": 2, "friends": 0}, feelings=0), []),
]

out = ["""-- =====================================================================
-- Helper Academy — v56: 🎭 Character library
--   traits (personality meters −2 … +2, golden middle 0, some change with the place), trait_places,
--   conditions (issues, behaviours, conditions, disorders, ideas — each with a minimum age), character_roles, characters (the library).
--   Everyone reads what fits their age (viewer_age()); parents/teachers add and edit.
--   Built by tools/characters/build_v56.py
-- =====================================================================
create table if not exists public.trait_places (key text primary key, icon text, name text not null, position int not null default 0);
create table if not exists public.traits (key text primary key, icon text, name text not null, family text not null default 'Character', min_age int not null default 0,
  varies_by_place boolean not null default false, low_name text, low_self text, low_others text, mid_name text, mid_text text,
  high_name text, high_self text, high_others text, place_note text, position int not null default 0);
create table if not exists public.conditions (key text primary key, icon text, name text not null, kind text not null check (kind in ('issue','behaviour','condition','disorder','idea')),
  min_age int not null default 0, aliases text[] not null default '{}', about text, signs text[] not null default '{}', helps text, traits text[] not null default '{}', position int not null default 0);
create table if not exists public.character_roles (key text primary key, icon text, name text not null, about text, position int not null default 0);
create table if not exists public.characters (id uuid primary key default gen_random_uuid(), name text not null, emoji text not null default '🙂',
  age int check (age between 0 and 150), sex text check (sex in ('female','male','other')), education text, role text references public.character_roles(key),
  bio text, traits jsonb not null default '{}'::jsonb, conditions text[] not null default '{}', min_age int not null default 0 check (min_age between 0 and 21),
  is_public boolean not null default true, created_by uuid references auth.users(id) on delete set null, created_at timestamptz not null default now());
do $$ declare t text; begin
  foreach t in array array['trait_places','traits','conditions','character_roles','characters'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('grant select on public.%I to anon, authenticated', t);
  end loop; end $$;
drop policy if exists "read places" on public.trait_places; create policy "read places" on public.trait_places for select using (true);
drop policy if exists "read roles" on public.character_roles; create policy "read roles" on public.character_roles for select using (true);
drop policy if exists "read traits for my age" on public.traits; create policy "read traits for my age" on public.traits for select using (min_age <= public.viewer_age());
drop policy if exists "read conditions for my age" on public.conditions; create policy "read conditions for my age" on public.conditions for select using (min_age <= public.viewer_age());
drop policy if exists "read characters for my age" on public.characters;
create policy "read characters for my age" on public.characters for select using ((is_public or created_by = auth.uid()) and min_age <= public.viewer_age());
grant insert, update, delete on public.characters to authenticated;
drop policy if exists "parents add characters" on public.characters;
create policy "parents add characters" on public.characters for insert to authenticated with check (public.is_quote_editor() and created_by = auth.uid());
drop policy if exists "parents edit characters" on public.characters;
create policy "parents edit characters" on public.characters for update to authenticated using (public.is_quote_editor() and (created_by = auth.uid() or public.is_admin() or created_by is null)) with check (public.is_quote_editor());
drop policy if exists "parents remove characters" on public.characters;
create policy "parents remove characters" on public.characters for delete to authenticated using (public.is_quote_editor() and (created_by = auth.uid() or public.is_admin()));
"""]
out.append("insert into public.trait_places (key, icon, name, position) values " + ",".join(f"({q(k)},{q(i)},{q(n)},{p})" for p, (k, i, n) in enumerate(CONTEXTS)) + " on conflict (key) do update set icon=excluded.icon, name=excluded.name, position=excluded.position;")
rows = []
for p, (k, ic, n, fam, ma, v, lo, mid, hi, note) in enumerate(TRAITS):
    rows.append(f"({q(k)},{q(ic)},{q(n)},{q(fam)},{ma},{'true' if v else 'false'},{q(lo[0])},{q(lo[1])},{q(lo[2])},{q(mid[0])},{q(mid[1])},{q(hi[0])},{q(hi[1])},{q(hi[2])},{q(note or None)},{p})")
out.append("insert into public.traits (key, icon, name, family, min_age, varies_by_place, low_name, low_self, low_others, mid_name, mid_text, high_name, high_self, high_others, place_note, position) values\n" + ",\n".join(rows) +
  "\non conflict (key) do update set icon=excluded.icon, name=excluded.name, family=excluded.family, min_age=excluded.min_age, varies_by_place=excluded.varies_by_place, low_name=excluded.low_name, low_self=excluded.low_self, low_others=excluded.low_others, mid_name=excluded.mid_name, mid_text=excluded.mid_text, high_name=excluded.high_name, high_self=excluded.high_self, high_others=excluded.high_others, place_note=excluded.place_note, position=excluded.position;")
rows = [f"({q(k)},{q(ic)},{q(n)},{q(kd)},{ma},{A(al)},{q(ab)},{A(sg)},{q(hp)},{A(tr)},{p})" for p, (k, ic, n, kd, ma, al, ab, sg, hp, tr) in enumerate(CONDITIONS)]
out.append("insert into public.conditions (key, icon, name, kind, min_age, aliases, about, signs, helps, traits, position) values\n" + ",\n".join(rows) +
  "\non conflict (key) do update set icon=excluded.icon, name=excluded.name, kind=excluded.kind, min_age=excluded.min_age, aliases=excluded.aliases, about=excluded.about, signs=excluded.signs, helps=excluded.helps, traits=excluded.traits, position=excluded.position;")
out.append("insert into public.character_roles (key, icon, name, about, position) values " + ",".join(f"({q(k)},{q(i)},{q(n)},{q(a)},{p})" for p, (k, i, n, a) in enumerate(ROLES)) + " on conflict (key) do update set icon=excluded.icon, name=excluded.name, about=excluded.about, position=excluded.position;")
tk = {t[0] for t in TRAITS}; ck = {c[0] for c in CONDITIONS}
rows = []
for n, e, age, sex, ed, role, ma, bio, tr, co in CHARS:
    assert set(tr) <= tk, (n, set(tr) - tk); assert set(co) <= ck, n
    cmin = max([ma] + [c[4] for c in CONDITIONS if c[0] in co]); assert cmin == ma, (n, cmin, ma)
    rows.append(f"(md5('char:'||{q(n)})::uuid,{q(n)},{q(e)},{age},{q(sex)},{q(ed)},{q(role)},{ma},{q(bio)},{J(tr)},{A(co)})")
out.append("insert into public.characters (id, name, emoji, age, sex, education, role, min_age, bio, traits, conditions) values\n" + ",\n".join(rows) +
  "\non conflict (id) do update set name=excluded.name, emoji=excluded.emoji, age=excluded.age, sex=excluded.sex, education=excluded.education, role=excluded.role, min_age=excluded.min_age, bio=excluded.bio, traits=excluded.traits, conditions=excluded.conditions;")
out.append("select (select count(*) from public.traits) as traits, (select count(*) from public.conditions) as conditions, (select count(*) from public.characters) as characters;")
open("supabase_v56_characters.sql", "w").write("\n".join(out) + "\n")
print(len(TRAITS), len(CONDITIONS), len(CHARS))
