# v59: 🌱 roots, 🧭 "why" links (raises / lowers, with strength and source), and 📜 quotes attached as advice.
# Many problems grow from fear and insecurity; some from learned habits, hard situations, trauma, a brain that is born different,
# or unusually LOW fear. Being secure (the golden middle, not hard) protects.
import json
q = lambda s: "null" if s is None else "'" + str(s).replace("'", "''") + "'"
J = lambda o: q(json.dumps(o, ensure_ascii=False)) + "::jsonb"
A = lambda xs: "array[" + ",".join(q(x) for x in xs) + "]::text[]" if xs else "'{}'::text[]"

# key, icon, name, kind, min_age, about, protects, academic, sources
ROOTS = [
 ("fear_not_enough", "🫥", "Fear of not being enough", "fear", 7,
  "A deep worry: \"I'm not good enough, not loved enough, not as good as them.\" Some hide it with silence, some with jokes, some with showing off.",
  "Being loved for who you are, not only for results; gratitude; small wins; comparing yourself with your own yesterday.",
  "Insecurity and shame-proneness: a fragile or contingent sense of self-worth. A common vulnerability behind envy, social anxiety, perfectionism and both forms of narcissism (grandiosity as a defence).",
  ["Crocker, J., & Park, L. E. (2004). The costly pursuit of self-esteem. Psychological Bulletin, 130(3), 392–414.", "Tangney, J. P., & Dearing, R. L. (2002). Shame and Guilt. Guilford Press."]),
 ("fear_losing", "🚪", "Fear of losing someone", "fear", 7,
  "Being afraid that the people you love will leave, or love someone else more.",
  "Reliable, warm love; keeping promises; learning that people can love more than one person.",
  "Attachment insecurity (especially anxious attachment): hyperactivated fears of rejection and abandonment, linked to jealousy, dependency and unstable relationships.",
  ["Bowlby, J. (1969). Attachment and Loss, Vol. 1: Attachment. Basic Books.", "Mikulincer, M., & Shaver, P. R. (2007). Attachment in Adulthood. Guilford Press."]),
 ("fear_punishment", "😨", "Fear of punishment", "fear", 6,
  "Being so afraid of getting in trouble that hiding the truth feels safer.",
  "Adults who stay calm when they hear the truth, and praise honesty even when the news is bad.",
  "Punitive environments increase children's lying to avoid sanctions; non-punitive responses to honesty increase truth-telling.",
  ["Talwar, V., & Lee, K. (2011). A punitive environment fosters children's dishonesty. Child Development, 82(6), 1751–1758."]),
 ("fear_chaos", "🌪️", "Fear of things going out of control", "fear", 9,
  "Feeling that if everything isn't perfect and in order, something bad will happen.",
  "Learning that \"good enough\" is OK, small safe mistakes, and flexible plans.",
  "Intolerance of uncertainty and need for control: associated with perfectionism, rigidity and obsessive-compulsive features.",
  ["Dugas, M. J., Gagnon, F., Ladouceur, R., & Freeston, M. H. (1998). Generalized anxiety disorder: a preliminary test of a conceptual model. Behaviour Research and Therapy, 36(2), 215–226."]),
 ("fear_being_hurt", "🛡️", "Fear of being hurt (attack first)", "fear", 7,
  "Feeling unsafe, so you strike first, get angry fast, or trust nobody.",
  "Feeling safe at home and school; naming feelings; calm adults who don't attack back.",
  "Threat sensitivity and hostile attribution bias: interpreting ambiguous acts as hostile and responding with reactive aggression.",
  ["Dodge, K. A. (1980). Social cognition and children's aggressive behavior. Child Development, 51(1), 162–170."]),
 ("scarcity_fear", "🥧", "Fear there isn't enough", "fear", 8,
  "Feeling that there aren't enough good things, chances or love for everyone, so every win of someone else feels like your loss.",
  "An abundance mindset, gratitude, and seeing that other people's success opens doors instead of closing them.",
  "Zero-sum and scarcity beliefs: perceiving resources and success as fixed, so others' gains are experienced as one's losses; associated with envy and competitiveness.",
  ["Różycka-Tran, J., Boski, P., & Wojciszke, B. (2015). Belief in a zero-sum game as a social axiom. Journal of Cross-Cultural Psychology, 46(4), 525–548."]),
 ("learned_rewarded", "🍬", "It worked before (learned)", "learned", 6,
  "A bad habit grows when it gets results: shouting got the toy, lying avoided trouble, silence made Mum give in.",
  "Making sure bad behaviour doesn't \"win\", and good behaviour is noticed.",
  "Operant learning: behaviours followed by reinforcement (gaining something or escaping something unpleasant) become more frequent.",
  ["Skinner, B. F. (1953). Science and Human Behavior. Macmillan."]),
 ("copied_models", "👀", "Copied from others", "learned", 6,
  "Children copy what they see: at home, at school, on screens.",
  "Good examples nearby, and talking about what we see on screens.",
  "Observational (social) learning: aggression and other behaviours are acquired by watching models, especially when the model is rewarded.",
  ["Bandura, A., Ross, D., & Ross, S. A. (1961). Transmission of aggression through imitation of aggressive models. Journal of Abnormal and Social Psychology, 63(3), 575–582."]),
 ("situation_power", "👮", "Power with nobody checking", "situation", 12,
  "Even good people can do bad things when they get power over others and nobody is watching.",
  "Rules that apply to everyone, someone checking, and the courage to say \"no\".",
  "Situational and systemic forces (role, authority, anonymity, group pressure) can override individual dispositions.",
  ["Milgram, S. (1963). Behavioral study of obedience. Journal of Abnormal and Social Psychology, 67(4), 371–378.", "Zimbardo, P. (2007). The Lucifer Effect. Random House."]),
 ("trauma", "⚡", "Something terrible happened", "trauma", 10,
  "A very frightening or painful event. This is not weakness: it can happen to the strongest person.",
  "Safety, people who listen, and doctors or therapists.",
  "Exposure to traumatic events is a necessary condition for PTSD and a risk factor for several other difficulties; outcomes depend heavily on support afterwards.",
  [ "American Psychiatric Association (2022). DSM-5-TR."]),
 ("born_different", "🧬", "Born with a brain that works differently", "born", 8,
  "Some differences are there from birth. They are not weakness and not anyone's fault.",
  "Understanding, patience, and help that fits the person.",
  "Neurodevelopmental differences (such as autism) have strong genetic and early-developmental contributions.",
  ["American Psychiatric Association (2022). DSM-5-TR."]),
 ("low_fear", "🧊", "Very little fear (no brake)", "born", 14,
  "Some people feel almost no fear, even of punishment, so nothing stops them. The opposite of most problems here!",
  "Clear limits and consequences early; teaching empathy directly.",
  "Fearlessness theory: low fear and weak responses to punishment cues are associated with psychopathy and antisocial behaviour.",
  ["Lykken, D. T. (1957). A study of anxiety in the sociopathic personality. Journal of Abnormal and Social Psychology, 55(1), 6–10."]),
]

# links: (src_type, src_key, src_level, dst_type, dst_key, dst_level, effect, strength, note)
# types: root, trait (level low/mid/high), sign, condition. strength 1 a little · 2 clearly · 3 strongly
L = []
def up(s, d, n, note=None): L.append((*s, *d, "raises", n, note))
def down(s, d, n, note=None): L.append((*s, *d, "lowers", n, note))
R = lambda k: ("root", k, None); Tl = lambda k: ("trait", k, "low"); Tm = lambda k: ("trait", k, "mid"); Th = lambda k: ("trait", k, "high")
S = lambda k: ("sign", k, None); C = lambda k: ("condition", k, None)
# roots
for d, n in [(Tl("confidence"), 3), (C("low_self_esteem"), 3), (S("compares_always"), 3), (C("envy"), 2), (C("vulnerable_narcissism"), 2), (C("avoidant_pd"), 2), (S("perfectionism"), 2), (S("hides_with_jokes"), 1), (S("attention_seeking"), 1), (C("grandiose_narcissism"), 1)]:
    up(R("fear_not_enough"), d, n)
for d, n in [(C("jealousy"), 3), (S("guards_relationship"), 2), (S("clingy"), 2), (S("cant_disagree"), 2), (C("dependent_pd"), 2), (C("bpd"), 1), (Tl("assertive"), 1)]:
    up(R("fear_losing"), d, n)
for d, n in [(C("lying"), 3), (S("turns_tables"), 1), (S("denies_reality"), 1)]:
    up(R("fear_punishment"), d, n)
for d, n in [(S("controlling"), 2), (S("perfectionism"), 2), (S("rigid_rules"), 2), (C("ocpd"), 2)]:
    up(R("fear_chaos"), d, n)
for d, n in [(S("aggressive"), 2), (S("intense_anger"), 2), (S("suspicious"), 2), (C("bullying"), 1), (C("paranoid_pd"), 1)]:
    up(R("fear_being_hurt"), d, n, "Beneath a lot of anger there is fear.")
for d, n in [(Tl("mindset"), 3), (S("zero_sum"), 3), (S("scarce_opportunities"), 3), (S("competes_always"), 2), (C("envy"), 2), (C("malicious_envy"), 1)]:
    up(R("scarcity_fear"), d, n)
for d, n in [(C("bullying"), 2), (C("lying"), 2), (C("guilt_tripping"), 2), (C("silent_treatment"), 2), (C("gaslighting"), 1), (S("attention_seeking"), 1)]:
    up(R("learned_rewarded"), d, n)
for d, n in [(C("bullying"), 2), (S("aggressive"), 2), (S("gossip"), 2)]:
    up(R("copied_models"), d, n)
for d, n in [(C("lucifer_effect"), 3), (S("picks_on_weaker"), 1)]:
    up(R("situation_power"), d, n)
for d, n in [(C("ptsd"), 3), (S("hypervigilance"), 3), (S("suspicious"), 1), (C("bpd"), 1)]:
    up(R("trauma"), d, n)
for d, n in [(C("autism"), 3), (S("sensory"), 2)]:
    up(R("born_different"), d, n)
for d, n in [(C("psychopathy"), 3), (S("reckless"), 2), (C("antisocial_pd"), 2), (S("no_remorse"), 1)]:
    up(R("low_fear"), d, n)
# traits → raise
for s, d, n in [(Tl("gratitude"), C("envy"), 3), (Tl("gratitude"), C("malicious_envy"), 2), (Tl("confidence"), C("envy"), 2), (Tl("confidence"), C("jealousy"), 2),
                (Tl("confidence"), C("low_self_esteem"), 3), (Tl("confidence"), C("avoidant_pd"), 2), (Th("confidence"), C("grandiose_narcissism"), 2), (Th("confidence"), S("arrogant_attitude"), 2),
                (Tl("mindset"), C("envy"), 3), (Tl("mindset"), C("malicious_envy"), 2), (Tl("mindset"), S("zero_sum"), 3), (Tl("mindset"), S("competes_always"), 1),
                (Tl("thinking"), S("black_white_thinking"), 3), (Tl("thinking"), C("envy"), 1), (Tl("thinking"), C("bpd"), 1), (Tl("thinking"), C("paranoid_pd"), 1),
                (Tl("empathy"), C("bullying"), 2), (Tl("empathy"), C("malicious_envy"), 1), (Tl("empathy"), C("character_assassination"), 1),
                (Tl("assertive"), C("dependent_pd"), 2), (Th("assertive"), S("aggressive"), 2), (Th("assertive"), C("bullying"), 1),
                (Tl("feelings"), S("intense_anger"), 3), (Tl("feelings"), S("aggressive"), 1), (Th("feelings"), C("funny_mask"), 1),
                (Tl("responsibility"), S("turns_tables"), 2), (Tl("responsibility"), S("victim_mindset"), 2), (Tl("responsibility"), C("darvo"), 1), (Tl("responsibility"), C("projection"), 1),
                (Tl("truthful"), C("lying"), 3), (Tl("truthful"), C("gaslighting"), 1), (Tl("conscience"), C("lucifer_effect"), 2), (Tl("conscience"), C("antisocial_pd"), 1),
                (Th("humour"), C("funny_mask"), 2), (Tl("outlook"), S("victim_mindset"), 1), (Tl("self_honesty"), C("projection"), 2)]:
    up(s, d, n)
# the golden middle protects
for s, d, n in [(Tm("gratitude"), C("envy"), 3), (Tm("gratitude"), C("malicious_envy"), 2), (Tm("confidence"), C("envy"), 2), (Tm("confidence"), C("jealousy"), 2),
                (Tm("mindset"), C("envy"), 2), (Tm("mindset"), C("malicious_envy"), 2), (Tm("thinking"), S("black_white_thinking"), 2),
                (Tm("empathy"), C("bullying"), 2), (Tm("assertive"), C("dependent_pd"), 2), (Tm("assertive"), C("guilt_tripping"), 1),
                (Tm("feelings"), S("intense_anger"), 2), (Tm("conscience"), C("lucifer_effect"), 1), (Tm("truthful"), C("lying"), 2), (Tm("self_honesty"), C("projection"), 2)]:
    down(s, d, n)
# chains: one thing feeds another
for s, d, n in [(C("low_self_esteem"), C("envy"), 2), (C("low_self_esteem"), C("jealousy"), 2), (S("compares_always"), C("envy"), 3), (S("zero_sum"), C("envy"), 2),
                (S("zero_sum"), C("malicious_envy"), 2), (S("no_gratitude"), C("envy"), 2), (C("envy"), C("malicious_envy"), 2), (C("envy"), C("benign_envy"), 1),
                (C("malicious_envy"), C("silent_assassination"), 2), (C("malicious_envy"), C("character_assassination"), 2), (C("malicious_envy"), S("schadenfreude"), 2),
                (C("jealousy"), S("guards_relationship"), 2), (C("jealousy"), S("controlling"), 1), (C("vulnerable_narcissism"), C("envy"), 2), (C("vulnerable_narcissism"), C("silent_treatment"), 1),
                (C("narcissistic"), C("gaslighting"), 1), (C("narcissistic"), C("darvo"), 1), (C("narcissistic"), C("love_bombing"), 1), (S("black_white_thinking"), S("idealize_devalue"), 2)]:
    up(s, d, n)

# 📜 quotes as advice: target (type, key) → quote word ids (from the live dictionary)
ADV = {
 ("condition", "envy"): ["d64b2e62-bd69-4bee-a6fa-1cb046d559e7", "a7643b6f-81d8-4540-b91f-6f55aa40dc0c", "d643ed11-948c-407c-a7e2-bc30f6e9cc0c", "8608d91d-1f07-4888-93f6-11472b3bb7d9", "c26110e3-555f-4c85-87c7-b15ad8269b03", "61c9d3a3-0a44-4901-8ca9-a5f2dc7563e1"],
 ("condition", "malicious_envy"): ["c6fcf56c-5711-4637-8926-4d1459e45e94", "e6e9e4ae-4640-4df2-b7b9-76d6b657a2b1", "a6561b2c-f77f-4f20-8010-908e5cc3b9d9"],
 ("condition", "benign_envy"): ["d7130b14-c497-4d91-af1c-c24dd3995d49", "cb3700a9-5080-4016-87ce-33a0aecdb3a1", "7163e88f-8870-40d8-8b59-2d685a93a9a0"],
 ("condition", "jealousy"): ["bcea46b5-b7bd-4073-9b1c-f1d852bb4123", "4ba77bd1-506a-40fa-8be2-4ddd7c897145"],
 ("condition", "lying"): ["803844c8-3dbd-4cdb-8344-e295142928c9", "5bd05eb9-c834-47c2-bc1f-ab2ebed4d398", "38737014-03a9-4333-9524-11a783178c2a", "5bd41d58-fc2f-44aa-b50c-d5f46f3d9378"],
 ("condition", "bullying"): ["d67c832e-ade0-401c-a7af-52de9d243ea6", "2dd880c2-5839-4d94-8bb9-b774ccd3ab40", "82947370-343c-4f52-b2b6-d9a0442070be", "71cade82-87ba-4249-b4f3-4fcc17888366"],
 ("condition", "character_assassination"): ["3c60bedd-3475-4013-bf58-01da23bf3700", "eb2bb85f-153e-48af-b982-55357e6e07a7", "62c6e880-9dec-4447-ba77-e68be22737d2", "5bd41d58-fc2f-44aa-b50c-d5f46f3d9378"],
 ("condition", "silent_assassination"): ["3c60bedd-3475-4013-bf58-01da23bf3700", "58ac87c9-6775-4482-86b6-10d3fc8dbddc", "ee0cf42a-35a7-44f8-82e2-5f2f7d79e84f"],
 ("condition", "guilt_tripping"): ["61a9733c-643e-424b-a372-dafbeb4511b8", "bcdd3ecf-db3e-44ff-aef0-431464d6f0da"],
 ("condition", "dependent_pd"): ["6efdbd14-5e72-4bce-a25d-1757f4e893c7", "b1a2501c-8e71-459b-9d9e-095bf37e1fa2", "a56bce26-1d70-479b-8826-a3f8a01dd1a4"],
 ("condition", "toxic"): ["3828853c-1a8b-4d85-95b8-4ecda7067d8c", "ee83040e-7f51-45a4-ad00-548554f63b18", "9e56c65e-e67d-4253-afd4-c981724acc15"],
 ("condition", "gaslighting"): ["62c6e880-9dec-4447-ba77-e68be22737d2", "3828853c-1a8b-4d85-95b8-4ecda7067d8c"],
 ("condition", "love_bombing"): ["2cde03aa-d0cf-4d62-a907-ddb2a3ee4b01", "fc6c144c-b1a4-4dc1-9074-1684b1c32b85"],
 ("condition", "narcissistic"): ["6d31b9c2-6554-4494-a6d1-2d4efacefe37", "de6e6f8d-45d3-49ae-a595-03e75dd94bab", "5105459c-a8ca-453d-aae9-a98a576ad199"],
 ("condition", "grandiose_narcissism"): ["6d31b9c2-6554-4494-a6d1-2d4efacefe37", "ee0cf42a-35a7-44f8-82e2-5f2f7d79e84f"],
 ("condition", "vulnerable_narcissism"): ["4ba77bd1-506a-40fa-8be2-4ddd7c897145", "ceb2f292-e604-41cd-aad3-f4194b663018", "5105459c-a8ca-453d-aae9-a98a576ad199"],
 ("condition", "low_self_esteem"): ["49f56fd5-c782-4114-a2dd-f7c17807ae23", "0ca054f4-7f65-445a-8e33-0019aa922d00", "099dab8a-32cb-4166-9a76-373937daf328", "1ef97d0d-3c1b-486f-9bee-64cbe81a4a86"],
 ("condition", "avoidant_pd"): ["0ca054f4-7f65-445a-8e33-0019aa922d00", "4bf811fa-88a7-4877-8b58-539b2615a5a1", "17606526-e211-427a-a824-614e606aa38f"],
 ("condition", "lucifer_effect"): ["97b4655b-4646-490c-af1c-bb3e35ce1ab7", "abc8af7e-b206-4123-b076-83d42d892cde"],
 ("condition", "silent_treatment"): ["54fcdb81-3e23-4fb3-a805-4303206566c5", "0db1ead3-b389-48e2-b600-57e445b0fcb5"],
 ("condition", "projection"): ["c6fcf56c-5711-4637-8926-4d1459e45e94", "dbcfe8f3-0d05-4219-a5c7-8417053e8231"],
 ("condition", "darvo"): ["dbcfe8f3-0d05-4219-a5c7-8417053e8231", "62c6e880-9dec-4447-ba77-e68be22737d2"],
 ("condition", "ocpd"): ["2f9d3765-86ab-432f-aacc-c35ccf9f9cbd", "62457ce3-1d95-4042-84f6-037ae955d8c0"],
 ("sign", "intense_anger"): ["a66d57c3-86f7-41d0-9e84-970a431c8841", "54fcdb81-3e23-4fb3-a805-4303206566c5", "df9642f9-cbc5-43e5-8781-d16dc43287aa", "a5e69cd6-b14f-4d7c-9a1c-d2ed316c0585"],
 ("sign", "compares_always"): ["a7643b6f-81d8-4540-b91f-6f55aa40dc0c", "d643ed11-948c-407c-a7e2-bc30f6e9cc0c"],
 ("sign", "victim_mindset"): ["9696a229-f11a-42f7-8f09-3526326296b3", "dbcfe8f3-0d05-4219-a5c7-8417053e8231"],
 ("sign", "black_white_thinking"): ["b030f145-6c6b-4044-b8a0-edca72d5eff0"],
 ("sign", "perfectionism"): ["2f9d3765-86ab-432f-aacc-c35ccf9f9cbd", "099dab8a-32cb-4166-9a76-373937daf328"],
 ("sign", "gossip"): ["3c60bedd-3475-4013-bf58-01da23bf3700", "58ac87c9-6775-4482-86b6-10d3fc8dbddc"],
 ("trait", "gratitude"): ["5414899c-e5fe-4a4f-9a42-f1abd6ece72b", "c051c3a7-ba96-41dd-a6b2-6ae00091cf66", "d712414f-1039-4630-845e-b0ab3c94d02b"],
 ("trait", "responsibility"): ["dbcfe8f3-0d05-4219-a5c7-8417053e8231", "fcfe172b-8b66-460f-bc7c-5f418c541435"],
 ("trait", "outlook"): ["9696a229-f11a-42f7-8f09-3526326296b3", "61da9e85-a4e5-4355-90d7-eced15520fd5"],
 ("trait", "assertive"): ["61a9733c-643e-424b-a372-dafbeb4511b8", "b1a2501c-8e71-459b-9d9e-095bf37e1fa2"],
 ("root", "fear_not_enough"): ["4ba77bd1-506a-40fa-8be2-4ddd7c897145", "d64b2e62-bd69-4bee-a6fa-1cb046d559e7", "49f56fd5-c782-4114-a2dd-f7c17807ae23"],
 ("root", "fear_being_hurt"): ["a66d57c3-86f7-41d0-9e84-970a431c8841", "a5e69cd6-b14f-4d7c-9a1c-d2ed316c0585"],
 ("root", "fear_punishment"): ["b5b86c38-576e-403f-a0a9-96319b60e68e", "803844c8-3dbd-4cdb-8344-e295142928c9"],
 ("root", "scarcity_fear"): ["c26110e3-555f-4c85-87c7-b15ad8269b03", "8608d91d-1f07-4888-93f6-11472b3bb7d9"],
 ("root", "fear_chaos"): ["2f9d3765-86ab-432f-aacc-c35ccf9f9cbd", "62457ce3-1d95-4042-84f6-037ae955d8c0"],
 ("root", "fear_losing"): ["8b61757e-2a7f-4438-bade-c90d707dcf81", "4ba77bd1-506a-40fa-8be2-4ddd7c897145"],
 ("root", "situation_power"): ["97b4655b-4646-490c-af1c-bb3e35ce1ab7", "82947370-343c-4f52-b2b6-d9a0442070be"],
}

CROOTS = {
 "Salwa": {"fear_not_enough": 2, "scarcity_fear": 3, "copied_models": 1}, "Hamza": {"scarcity_fear": 2, "fear_not_enough": 1}, "Yara": {"fear_losing": 2, "fear_not_enough": 1},
 "Sami": {"fear_punishment": 3, "learned_rewarded": 2}, "Omar": {"fear_being_hurt": 1, "copied_models": 2, "learned_rewarded": 2}, "Tamer": {"learned_rewarded": 2},
 "Nadim": {"fear_not_enough": 3}, "Victor": {"fear_not_enough": 1, "learned_rewarded": 1}, "Jad": {"learned_rewarded": 2}, "Mr. Wolf": {"low_fear": 3},
 "Captain Faris": {"trauma": 3}, "Kareem": {"born_different": 3}, "Dana": {"fear_chaos": 2}, "Uncle Fawzi": {"fear_chaos": 3}, "Sara": {"fear_losing": 3},
 "Hiba": {"fear_not_enough": 3}, "Lady Lamia": {"fear_not_enough": 2}, "Mr. Hakim": {"fear_being_hurt": 3}, "Guard Kamal": {"situation_power": 3},
 "Rania": {"fear_losing": 3, "trauma": 1}, "Lina": {"fear_not_enough": 3}, "Tariq": {"fear_not_enough": 2}, "Mr. Basil": {"learned_rewarded": 2, "fear_not_enough": 1},
 "Noor": {"fear_losing": 1}, "Max the Show-off": {"fear_not_enough": 2}, "Fox the Trickster": {"learned_rewarded": 2}, "The Shadow": {"low_fear": 2},
 "Layla": {"fear_being_hurt": 1}, "Aunt Mona": {"fear_losing": 1},
}

out = ["""-- =====================================================================
-- Helper Academy — v59: 🌱 roots, 🧭 why-links (raises / lowers) and 📜 quotes as advice. Built by tools/characters/build_v59.py
-- =====================================================================
create table if not exists public.roots (key text primary key, icon text, name text not null, kind text not null check (kind in ('fear','learned','situation','trauma','born')),
  min_age int not null default 0, about text, protects text, academic text, sources text[] not null default '{}', position int not null default 0);
create table if not exists public.trait_links (id bigint generated always as identity primary key,
  src_type text not null check (src_type in ('root','trait','sign','condition')), src_key text not null, src_level text check (src_level in ('low','mid','high')),
  dst_type text not null check (dst_type in ('root','trait','sign','condition')), dst_key text not null, dst_level text check (dst_level in ('low','mid','high')),
  effect text not null check (effect in ('raises','lowers')), strength int not null default 2 check (strength between 1 and 3), note text);
create table if not exists public.advice (target_type text not null check (target_type in ('root','trait','sign','condition')), target_key text not null,
  word_id uuid not null references public.words(id) on delete cascade, position int not null default 0, primary key (target_type, target_key, word_id));
alter table public.roots enable row level security; alter table public.trait_links enable row level security; alter table public.advice enable row level security;
grant select on public.roots, public.trait_links, public.advice to anon, authenticated;
drop policy if exists "read roots for my age" on public.roots; create policy "read roots for my age" on public.roots for select using (min_age <= public.viewer_age());
drop policy if exists "read links" on public.trait_links; create policy "read links" on public.trait_links for select using (true);
drop policy if exists "read advice" on public.advice; create policy "read advice" on public.advice for select using (true);
alter table public.characters add column if not exists roots jsonb not null default '{}'::jsonb;
"""]
out.append("insert into public.roots (key, icon, name, kind, min_age, about, protects, academic, sources, position) values\n" + ",\n".join(
    f"({q(k)},{q(i)},{q(n)},{q(kd)},{ma},{q(ab)},{q(pr)},{q(ac)},{A(src)},{p})" for p, (k, i, n, kd, ma, ab, pr, ac, src) in enumerate(ROOTS)) +
  "\non conflict (key) do update set icon=excluded.icon, name=excluded.name, kind=excluded.kind, min_age=excluded.min_age, about=excluded.about, protects=excluded.protects, academic=excluded.academic, sources=excluded.sources, position=excluded.position;")
out.append("truncate public.trait_links;")
out.append("insert into public.trait_links (src_type, src_key, src_level, dst_type, dst_key, dst_level, effect, strength, note) values\n" + ",\n".join(
    f"({q(a)},{q(b)},{q(c)},{q(d)},{q(e)},{q(f)},{q(g)},{h},{q(i)})" for a, b, c, d, e, f, g, h, i in L) + ";")
rows = []
for (t, k), ids in ADV.items():
    for p, w in enumerate(ids): rows.append(f"({q(t)},{q(k)},{q(w)}::uuid,{p})")
out.append("delete from public.advice;")
out.append("insert into public.advice (target_type, target_key, word_id, position) select v.t, v.k, v.w, v.p from (values\n" + ",\n".join(rows) +
  ") as v(t, k, w, p) where exists (select 1 from public.words x where x.id = v.w) on conflict do nothing;")
for n, r in CROOTS.items():
    out.append(f"update public.characters set roots = {J(r)} where id = md5('char:'||{q(n)})::uuid;")
out.append("select (select count(*) from public.roots) as roots, (select count(*) from public.trait_links) as links, (select count(*) from public.advice) as advice, (select count(*) from public.characters where roots <> '{}'::jsonb) as characters_with_roots;")
open("supabase_v59_roots.sql", "w").write("\n".join(out) + "\n")
print(len(ROOTS), "roots", len(L), "links", len(rows), "advice")
