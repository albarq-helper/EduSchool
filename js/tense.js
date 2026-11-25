// Helper Academy — ⏳ verb time line: every form of a verb, sorted from long ago to the future.
// Tense.forms(word)  -> {base, s, past, pp, ing, irregular} (works for "Scampering", "Withdrew", "Give up", "Lie (lie down)")
// Tense.say(word, key, person) -> "was lying"
// Tense.mount(el, {word, tense, person, onPick(key, person, text)})  -> the time line slider
// Tense.auto(getWord): mounts every [data-tm="<index>"] that appears on the page
(function () {
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  // irregular verbs: base: [past, past participle]
  const IRR = {
    be: ["was", "been"], have: ["had", "had"], do: ["did", "done"], go: ["went", "gone"], get: ["got", "got"], give: ["gave", "given"], take: ["took", "taken"],
    make: ["made", "made"], come: ["came", "come"], see: ["saw", "seen"], know: ["knew", "known"], think: ["thought", "thought"], say: ["said", "said"], tell: ["told", "told"],
    find: ["found", "found"], feel: ["felt", "felt"], keep: ["kept", "kept"], leave: ["left", "left"], let: ["let", "let"], put: ["put", "put"], set: ["set", "set"],
    run: ["ran", "run"], sit: ["sat", "sat"], stand: ["stood", "stood"], write: ["wrote", "written"], speak: ["spoke", "spoken"], break: ["broke", "broken"],
    build: ["built", "built"], buy: ["bought", "bought"], bring: ["brought", "brought"], catch: ["caught", "caught"], teach: ["taught", "taught"], fight: ["fought", "fought"],
    sell: ["sold", "sold"], pay: ["paid", "paid"], hit: ["hit", "hit"], cut: ["cut", "cut"], quit: ["quit", "quit"], shed: ["shed", "shed"], throw: ["threw", "thrown"],
    grow: ["grew", "grown"], show: ["showed", "shown"], sow: ["sowed", "sown"], forgive: ["forgave", "forgiven"], forbid: ["forbade", "forbidden"], withdraw: ["withdrew", "withdrawn"],
    draw: ["drew", "drawn"], fly: ["flew", "flown"], fall: ["fell", "fallen"], wake: ["woke", "woken"], speed: ["sped", "sped"], dwell: ["dwelt", "dwelt"], eat: ["ate", "eaten"],
    drink: ["drank", "drunk"], swim: ["swam", "swum"], sing: ["sang", "sung"], ring: ["rang", "rung"], begin: ["began", "begun"], win: ["won", "won"], lose: ["lost", "lost"],
    send: ["sent", "sent"], spend: ["spent", "spent"], lend: ["lent", "lent"], meet: ["met", "met"], read: ["read", "read"], hear: ["heard", "heard"], hold: ["held", "held"],
    lead: ["led", "led"], ride: ["rode", "ridden"], hide: ["hid", "hidden"], bite: ["bit", "bitten"], choose: ["chose", "chosen"], freeze: ["froze", "frozen"], steal: ["stole", "stolen"],
    wear: ["wore", "worn"], tear: ["tore", "torn"], forget: ["forgot", "forgotten"], understand: ["understood", "understood"], sleep: ["slept", "slept"], sweep: ["swept", "swept"],
    hang: ["hung", "hung"], shine: ["shone", "shone"], shoot: ["shot", "shot"], shut: ["shut", "shut"], spread: ["spread", "spread"], light: ["lit", "lit"], dig: ["dug", "dug"],
    feed: ["fed", "fed"], blow: ["blew", "blown"], drive: ["drove", "driven"], rise: ["rose", "risen"], shake: ["shook", "shaken"], mean: ["meant", "meant"], seek: ["sought", "sought"],
  };
  // a sense can change the forms: lie (tell a lie) is regular, lie (lie down) is lay / lain
  const SENSE = { "lie|lie down": ["lay", "lain"], "lie|down": ["lay", "lain"] };
  // words kept in the dictionary in another form → their base
  const LEMMA = { approved: "approve", arguing: "argue", awarded: "award", bestowed: "bestow", clashing: "clash", considered: "consider", couched: "couch", crouching: "crouch",
    demanded: "demand", deteriorating: "deteriorate", divided: "divide", dozed: "doze", faked: "fake", flowing: "flow", improving: "improve", insisted: "insist", molting: "molt",
    moved: "move", napped: "nap", nicknamed: "nickname", observed: "observe", peers: "peer", pretended: "pretend", printed: "print", published: "publish", ratified: "ratify",
    regarded: "regard", relocated: "relocate", represented: "represent", retreated: "retreat", rocked: "rock", rustled: "rustle", scampering: "scamper", scurrying: "scurry",
    separated: "separate", shedding: "shed", stomped: "stomp", stooping: "stoop", swayed: "sway", symbolized: "symbolize", whipped: "whip", withdrew: "withdraw", worsening: "worsen" };
  // thinking and feeling verbs: we rarely use them in the "-ing" times (not "I am knowing")
  const STATIVE = new Set(["believe", "know", "like", "love", "hate", "want", "need", "prefer", "adore", "despise", "detest", "dislike", "loathe", "resent", "desire", "cherish", "own", "belong", "seem", "understand", "remember", "forget", "mean", "appreciate", "admire", "respect", "crave"]);
  const DOUBLE = new Set(["quit", "permit", "regret", "prefer", "admit", "commit", "occur", "refer", "control", "compel", "forbid", "begin", "forget", "upset"]);
  const vowel = c => /[aeiou]/.test(c);
  const cvc = w => w.length >= 3 && !vowel(w.at(-1)) && !/[wxy]/.test(w.at(-1)) && vowel(w.at(-2)) && !vowel(w.at(-3)) && (w.match(/[aeiouy]+/g) || []).length === 1;
  const dbl = w => DOUBLE.has(w) || cvc(w);
  const ed = w => /e$/.test(w) ? w + "d" : /[^aeiou]y$/.test(w) ? w.slice(0, -1) + "ied" : dbl(w) ? w + w.at(-1) + "ed" : w + "ed";
  const ing = w => /ie$/.test(w) ? w.slice(0, -2) + "ying" : /e$/.test(w) && !/(ee|ye|oe)$/.test(w) && w !== "be" ? w.slice(0, -1) + "ing" : dbl(w) ? w + w.at(-1) + "ing" : w + "ing";
  const third = w => ({ have: "has", do: "does", go: "goes", be: "is" })[w] || (/(s|x|z|ch|sh|o)$/.test(w) ? w + "es" : /[^aeiou]y$/.test(w) ? w.slice(0, -1) + "ies" : w + "s");
  function parse(word) {
    const raw = String(word && word.w != null ? word.w : word || "").trim(), m = raw.match(/^(.*?)\s*\((.*)\)\s*$/);
    const head = (m ? m[1] : raw).toLowerCase(), sense = ((word && word.sense) || (m ? m[2] : "") || "").toLowerCase();
    const parts = head.split(/\s+/), first = LEMMA[parts[0]] || parts[0];
    return { first, rest: parts.slice(1).join(" "), sense };
  }
  function forms(word) {
    const { first, rest, sense } = parse(word), sk = Object.keys(SENSE).find(k => k.split("|")[0] === first && sense.includes(k.split("|")[1]));
    const irr = sk ? SENSE[sk] : IRR[first], tail = rest ? " " + rest : "";
    const f = { base: first, s: third(first), past: irr ? irr[0] : ed(first), pp: irr ? irr[1] : ed(first), ing: ing(first), irregular: !!irr };
    return { ...f, base: f.base + tail, s: f.s + tail, past: f.past + tail, pp: f.pp + tail, ing: f.ing + tail, word: first + tail };
  }
  // who does it: I, you, he, she, it, we, they, or one of the story's characters ("c:Rover" — one person, like "he")
  const PEOPLE = [["i", "I"], ["you", "You"], ["he", "He"], ["she", "She"], ["it", "It"], ["we", "We"], ["they", "They"]];
  // "c:Rover" a character, "n1:Rover's son" one person or thing, "n2:Rover's friends" many
  const one = p => p === "he" || p === "she" || p === "it" || /^(c|n1):/.test(String(p));
  const be = p => p === "i" ? "am" : one(p) ? "is" : "are", was = p => p === "i" || one(p) ? "was" : "were", hv = p => one(p) ? "has" : "have";
  const subjOf = p => /^(c|n1|n2):/.test(String(p)) ? String(p).replace(/^(c|n1|n2):/, "") : (PEOPLE.find(x => x[0] === p) || PEOPLE[3])[1];
  // the pronoun table: subject, object, possessive adjective, possessive pronoun, reflexive (+ Arabic)
  const PRON = [
    { k: "i", sub: "I", obj: "me", adj: "my", pos: "mine", ref: "myself", ar: "أنا" },
    { k: "you", sub: "you", obj: "you", adj: "your", pos: "yours", ref: "yourself / yourselves", ar: "أنتَ / أنتِ / أنتم" },
    { k: "he", sub: "he", obj: "him", adj: "his", pos: "his", ref: "himself", ar: "هو" },
    { k: "she", sub: "she", obj: "her", adj: "her", pos: "hers", ref: "herself", ar: "هي" },
    { k: "it", sub: "it", obj: "it", adj: "its", pos: "its", ref: "itself", ar: "هو / هي (لغير العاقل)" },
    { k: "we", sub: "we", obj: "us", adj: "our", pos: "ours", ref: "ourselves", ar: "نحن" },
    { k: "they", sub: "they", obj: "them", adj: "their", pos: "theirs", ref: "themselves", ar: "هم / هنّ" }];
  // people around a character: "Rover's son" (one) or "Rover's friends" (many)
  const RELS = [["son", "ابن"], ["daughter", "ابنة"], ["mother", "أم"], ["father", "أب"], ["brother", "أخ"], ["sister", "أخت"], ["grandmother", "جدّة"], ["grandfather", "جدّ"],
    ["uncle", "عم / خال"], ["aunt", "عمّة / خالة"], ["cousin", "ابن العم"], ["baby", "طفل رضيع"], ["friend", "صديق"], ["best friend", "أعزّ صديق"], ["teacher", "معلّم"], ["neighbour", "جار"], ["pet", "حيوان أليف"],
    ["friends", "أصدقاء", 2], ["parents", "والدان", 2], ["children", "أطفال", 2], ["family", "عائلة"], ["team", "فريق"]];
  const owner = n => /s$/i.test(n) ? n + "'" : n + "'s";
  // a character's pronoun: chosen in 🎭 Characters, or guessed from the picture
  const prOf = c => c.pr || (/[👧👩👵🧕🧚👸💃]/u.test(c.emoji || "") ? "she" : /[👦👨👴🧔🤴👮]/u.test(c.emoji || "") ? "he" : /[🐶🐱🐭🦊🐰🐻🦁🐴🐪🐢🐦🦜🐝🦉🐘🐟]/u.test(c.emoji || "") ? "it" : "they");
  // the time line, from long ago to the future. lv = 1: three times (young children), 2: seven, 3: all twelve
  // need: "yes" = say WHEN (or another moment), "often" = a time word helps, "no" = no time word needed, "never" = no exact past time allowed
  // sig: the time words that go with it; ex: examples (S = who, x = the verb form); bad: a common mistake
  const TENSES = [
    { k: "pastperf", lv: 3, ico: "⏪", name: "Past perfect", when: "Finished before another moment in the past", f: (F, p) => `had ${F.pp}`, z: "past",
      need: "yes", needTxt: "Needs another past moment: what happened after it", sig: ["already", "before the bell rang", "by the time we arrived", "when we got home"],
      ex: [(S, x) => `By the time we arrived, ${S} [[${x}]].`, (S, x) => `${S} [[${x}]] before the bell rang.`] },
    { k: "pastperfcont", lv: 3, ico: "⏪", name: "Past perfect continuous", when: "Had been going on for a while, before a moment in the past", f: (F, p) => `had been ${F.ing}`, z: "past",
      need: "yes", needTxt: "Needs how long (for…) and a past moment (when…)", sig: ["for an hour when the phone rang", "since morning", "all day before the storm"],
      ex: [(S, x) => `${S} [[${x}]] for an hour when the phone rang.`] },
    { k: "past", lv: 1, ico: "⬅️", name: "Past simple", when: "Happened and finished in the past (yesterday, last week)", f: (F, p) => F.past, z: "past",
      need: "often", needTxt: "Say WHEN it happened, unless the story already shows it", sig: ["yesterday", "last night", "last week", "two days ago", "in 2020", "once upon a time"],
      ex: [(S, x) => `Yesterday, ${S} [[${x}]].`, (S, x) => `${S} [[${x}]] two days ago.`, (S, x) => `Once upon a time, ${S} [[${x}]]. (the story already says "past", so no other time word is needed)`] },
    { k: "usedto", lv: 2, ico: "🕰️", name: "Used to", when: "Happened again and again in the past, but not any more", f: (F, p) => `used to ${F.base}`, z: "past",
      need: "often", needTxt: "A time word helps: when I was little, years ago", sig: ["when I was little", "years ago", "before", "as a child"],
      ex: [(S, x) => `${S} [[${x}]] when ${S === "I" ? "I was" : "they were"} little.`, (S, x) => `${S} [[${x}]] years ago, but not now.`] },
    { k: "pastcont", lv: 2, ico: "〰️", name: "Past continuous", when: "Was in the middle of happening, in the past", f: (F, p) => `${was(p)} ${F.ing}`, z: "past",
      need: "yes", needTxt: "Needs a past moment, or another thing that happened in the middle", sig: ["when the phone rang", "while it was raining", "at 8 o'clock yesterday", "all evening"],
      ex: [(S, x) => `${S} [[${x}]] when the phone rang.`, (S, x) => `At 8 o'clock yesterday, ${S} [[${x}]].`] },
    { k: "presperf", lv: 2, ico: "↩️", name: "Present perfect", when: "Happened at some time before now, and it matters now", f: (F, p) => `${hv(p)} ${F.pp}`, z: "now",
      need: "never", needTxt: "don't add a finished time like \"yesterday\" or \"last week\"", sig: ["already", "just", "never", "so far", "this week", "three times"],
      ex: [(S, x) => `${S} [[${x}]] already.`, (S, x, F, p) => `${S} [[${hv(p)} never ${F.pp}]].`, (S, x, F, p) => `${S} [[${hv(p)} just ${F.pp}]].`],
      bad: (S, x) => `${S} [[${x}]] yesterday.` },
    { k: "presperfcont", lv: 3, ico: "🔁", name: "Present perfect continuous", when: "Started in the past and is still going on now", f: (F, p) => `${hv(p)} been ${F.ing}`, z: "now",
      need: "yes", needTxt: "Needs how long: for… or since…", sig: ["for two hours", "since morning", "all day", "lately"],
      ex: [(S, x) => `${S} [[${x}]] for two hours.`, (S, x) => `${S} [[${x}]] since this morning.`] },
    { k: "present", lv: 1, ico: "🔄", name: "Present simple", when: "Happens always, every day, or is true now", f: (F, p) => one(p) ? F.s : F.base, z: "now",
      need: "often", needTxt: "Say HOW OFTEN, or nothing at all for things that are always true", sig: ["every day", "always", "usually", "often", "sometimes", "never", "on Mondays"],
      ex: [(S, x) => `${S} [[${x}]] every day.`, (S, x, F, p) => `${S} always [[${one(p) ? F.s : F.base}]].`, (S, x) => `${S} [[${x}]]. (a fact: no time word needed)`] },
    { k: "prescont", lv: 2, ico: "▶️", name: "Present continuous", when: "Happening right now", f: (F, p) => `${be(p)} ${F.ing}`, z: "now",
      need: "no", needTxt: "No time word needed: the \"-ing\" already means now", sig: ["now", "right now", "at the moment", "today"],
      ex: [(S, x) => `${S} [[${x}]].`, (S, x) => `Look! ${S.charAt(0).toUpperCase() + S.slice(1)} [[${x}]] right now.`] },
    { k: "goingto", lv: 2, ico: "🗓️", name: "Going to", when: "Planned for soon", f: (F, p) => `${be(p)} going to ${F.base}`, z: "future",
      need: "often", needTxt: "A plan: a time word helps, but it is not a must", sig: ["tomorrow", "soon", "this weekend", "next week", "tonight"],
      ex: [(S, x) => `${S} [[${x}]] tomorrow.`, (S, x) => `${S} [[${x}]]. (we know it is planned)`] },
    { k: "future", lv: 1, ico: "➡️", name: "Future simple", when: "Will happen later (tomorrow, next year)", f: (F, p) => `will ${F.base}`, z: "future",
      need: "often", needTxt: "Say WHEN, or use it for promises and guesses", sig: ["tomorrow", "next year", "one day", "soon", "later", "I think", "maybe"],
      ex: [(S, x) => `Tomorrow, ${S} [[${x}]].`, (S, x) => `I think ${S} [[${x}]] one day.`] },
    { k: "futurecont", lv: 3, ico: "〰️", name: "Future continuous", when: "Will be in the middle of happening, in the future", f: (F, p) => `will be ${F.ing}`, z: "future",
      need: "yes", needTxt: "Needs a future moment: at… / this time tomorrow", sig: ["at this time tomorrow", "at 8 o'clock tomorrow", "all day tomorrow"],
      ex: [(S, x) => `At this time tomorrow, ${S} [[${x}]].`] },
    { k: "futureperf", lv: 3, ico: "⏩", name: "Future perfect", when: "Will be finished before a moment in the future", f: (F, p) => `will have ${F.pp}`, z: "future",
      need: "yes", needTxt: "Needs \"by\" + a future time", sig: ["by Friday", "by tomorrow", "before the party", "by next year"],
      ex: [(S, x) => `By Friday, ${S} [[${x}]].`] },
  ];
  const NEED = { yes: ["⏰", "Time word needed", "#b91c1c", "#fee2e2"], often: ["🕒", "Time word helps", "#92400e", "#fef3c7"], no: ["✨", "No time word needed", "#166534", "#dcfce7"], never: ["🚫", "No exact past time", "#7c2d12", "#ffedd5"] };
  const T = k => TENSES.find(t => t.k === k);
  const MID = new Set(["always", "usually", "often", "sometimes", "never", "already", "just"]);
  // partner words that contain the verb ("run quickly") take the chosen form ("was running quickly"); others follow the verb
  // ---- 🚫 not · ❓ question · 🎚️ can / must / should / might / have to: one verb phrase, any tense ----
  const NEG = { am: "am not", is: "isn't", are: "aren't", was: "wasn't", were: "weren't", has: "hasn't", have: "haven't", had: "hadn't", will: "won't", do: "don't", does: "doesn't", did: "didn't",
    can: "can't", could: "couldn't", must: "mustn't", should: "shouldn't", might: "might not", may: "may not", would: "wouldn't" };
  const MODALS = [
    { k: "can", ico: "💪", name: "can", what: "able to, or allowed", now: (F) => `can ${F.base}`, past: (F) => `could ${F.base}`, future: (F) => `will be able to ${F.base}`,
      rule: "can = able to, or allowed. After it, the base verb: she can swim (no -s, no to). Past: could. Future: will be able to.", ar: "‏can = يستطيع أو مسموح له، وبعدها الفعل في أصله: she can swim. الماضي could والمستقبل will be able to." },
    { k: "must", ico: "❗", name: "must", what: "a strong rule", now: (F) => `must ${F.base}`, past: (F) => `had to ${F.base}`, future: (F) => `will have to ${F.base}`, dsPast: true,
      rule: "must = a strong rule or a need: you must stop. Past: had to. mustn't = it is not allowed.", ar: "‏must = قاعدة قوية أو ضرورة. في الماضي had to. و mustn't = ممنوع." },
    { k: "haveto", ico: "📋", name: "have to", what: "a rule from outside", now: (F, p) => `${hv(p)} to ${F.base}`, past: (F) => `had to ${F.base}`, future: (F) => `will have to ${F.base}`, ds: true,
      rule: "have to = a rule from outside (school, parents). It works like a normal verb: she has to go, does she have to go? don't have to = it is not needed.", ar: "‏have to = إلزام من الخارج، ويعامل كفعل عادي: does she have to go? و don't have to = غير ضروري." },
    { k: "sure", ico: "🔎", name: "must (I'm sure)", what: "I'm sure it's true", now: (F) => `must be ${F.ing}`, past: (F) => `must have ${F.pp}`, future: (F) => `must be going to ${F.base}`,
      rule: "must = I'm sure it's true: she must be swimming. can't = I'm sure it's not true: she can't be swimming. About the past: must have / can't have + past participle.", ar: "‏must هنا = أنا متأكد أنه صحيح، و can't = متأكد أنه غير صحيح. وعن الماضي must have / can't have + التصريف الثالث." },
    { k: "should", ico: "💡", name: "should", what: "good advice", now: (F) => `should ${F.base}`, past: (F) => `should have ${F.pp}`, future: (F) => `should ${F.base}`,
      rule: "should = good advice: you should rest. About the past: should have + past participle (you should have rested) = it was a good idea, but it didn't happen.", ar: "‏should = نصيحة. وعن الماضي should have + التصريف الثالث: كان الأفضل لكنه لم يحدث." },
    { k: "might", ico: "🤔", name: "might", what: "maybe", now: (F) => `might ${F.base}`, past: (F) => `might have ${F.pp}`, future: (F) => `might ${F.base}`,
      rule: "might = maybe: it might rain. About the past: might have + past participle (she might have forgotten).", ar: "‏might = ربما. وعن الماضي might have + التصريف الثالث." }];
  const MD = k => MODALS.find(m => m.k === k);
  // the verb phrase for a tense (or a modal), then not / question: returns { vp, aux, rest, dsup }
  function vpOf(F, t, p, o) {
    const shp = o.shape && o.shape.k && o.shape.k !== "verb" && o.shape.k !== "thing" ? o.shape : null, md = !shp && o.modal ? MD(o.modal) : null;
    let vp = shp ? shapeVp(shp, t, p) : md ? md[t.z === "past" ? "past" : t.z === "future" ? "future" : "now"](F, p) : t.f(F, p), dsup = false;
    // no helper verb (she plays, she played, she has to, she had to) + not / question → do / does / did
    const plain = !shp && ((!md && (t.k === "present" || t.k === "past" || t.k === "usedto")) || (md && ((md.ds && t.z !== "future") || (md.dsPast && t.z === "past"))));
    if (plain && (o.neg || o.q)) { const past = t.z === "past", d = past ? "did" : one(p) ? "does" : "do";
      vp = md ? `${d} have to ${F.base}` : t.k === "usedto" ? `${d} use to ${F.base}` : `${d} ${F.base}`; dsup = true; }
    if (md && md.k === "sure" && (o.neg || o.q)) vp = vp.replace(/^must/, o.q ? "could" : "can't");
    const ws = vp.split(" ");
    return { vp, aux: ws[0], rest: ws.slice(1).join(" "), dsup, md };
  }
  const Tense_vp = (F, t, p, o) => vpOf(F, t, p, o);
  // the grammar chips: named only when something changed (tap = one line of rule, English + Arabic)
  function chipsOf(F, t, p, o) {
    const x = vpOf(F, t, p, o), out = [];
    if (x.md) out.push({ k: "modal-" + x.md.k, name: `${x.md.ico} ${x.md.name}: ${x.md.what}`, rule: x.md.rule, ar: x.md.ar });
    if (o.q) out.push(x.dsup ? { k: "q-do", name: "❓ Questions with do / does / did", rule: "No helper verb? Put do / does / did in front, and the verb goes back to its base: She plays → Does she play?", ar: "‏إذا لم يكن هناك فعل مساعد نضع do / does / did في البداية ويرجع الفعل لأصله: Does she play?" }
      : { k: "q-aux", name: "❓ Questions: the helper verb jumps in front", rule: "The helper verb (is, was, has, will, can…) moves in front of who: She is playing → Is she playing?", ar: "‏الفعل المساعد (is, was, has, will, can…) يتقدّم على الفاعل: Is she playing?" });
    if (o.neg) out.push(x.dsup ? { k: "neg-do", name: "🚫 not with do / does / did", rule: "No helper verb? Use don't / doesn't / didn't, and the verb goes back to its base: She plays → She doesn't play (no -s).", ar: "‏بدون فعل مساعد نستخدم don't / doesn't / didn't ويرجع الفعل لأصله: She doesn't play." }
      : { k: "neg-aux", name: "🚫 not goes after the helper verb", rule: "Put not after the helper verb (is, was, has, will, can…): She is playing → She isn't playing.", ar: "‏نضع not بعد الفعل المساعد: She isn't playing." });
    if (!o.q && !o.neg && !x.md && t.k === "present" && one(p) && !(o.shape && o.shape.k && o.shape.k !== "verb")) out.push({ k: "s3", name: "➕ he / she / it + s", rule: "In the present simple, he, she, it and one person or thing take -s: I play, she plays.", ar: "‏في المضارع البسيط نضيف s مع he / she / it والمفرد: she plays." });
    if (t.k === "usedto" && !o.imp && !o.pas) out.push({ k: "usedto", name: "🕰️ used to: it happened then, not now", rule: "used to + base verb = something that happened again and again in the past, but not now: I used to cry. Not and asking: didn't use to, did you use to?", ar: "‏used to + الفعل في أصله = عادة في الماضي انتهت الآن. وفي النفي والسؤال: didn't use to / did you use to?" });
    if (o.sty === "inv") return [{ k: "inversion", name: "✨ Inversion: Never have I…", rule: "For strong emphasis, start with never, rarely, seldom, hardly ever or little, then put the helper verb before who, like a question: Rarely does she cry. Never have I seen such a storm.", ar: "‏للتأكيد القوي نبدأ بـ never / rarely / seldom ثم نقدّم الفعل المساعد على الفاعل كالسؤال: Never have I seen…" }];
    if (o.sty === "cleft") return [{ k: "cleft", name: "✨ Cleft: It was Rover who…", rule: "To point at who did it, use It is / It was + the person + who: It was Rover who ate the cake (not Mia).", ar: "‏لإبراز الفاعل نستخدم It was + الشخص + who: It was Rover who ate the cake." }];
    if (o.imp) return [{ k: "imp", name: "👉 Telling someone to: just the base verb", rule: "To tell someone to do something, start with the base verb and leave out who: Swim! Sit down. Not: Don't swim!", ar: "‏للأمر نبدأ بالفعل في أصله بدون فاعل: Swim! وللنهي: Don't swim!" }];
    if (o.pas) out.push({ k: "passive", name: "🔄 Passive: the thing comes first", rule: "Put the thing that something happens to first, then be + past participle, then by + who did it: Rover ate the cake → The cake was eaten by Rover.", ar: "‏المبني للمجهول: نبدأ بالشيء الذي وقع عليه الفعل، ثم be + التصريف الثالث، ثم by + الفاعل: The cake was eaten by Rover." });
    if (o.tag && !o.q) out.push({ k: "tag", name: "🏷️ Question tags: yes-sentence, no-tag", rule: "A short question at the end, to check: a telling sentence takes a not-tag (She swims, doesn't she?), a not-sentence takes a yes-tag (She doesn't swim, does she?).", ar: "‏سؤال قصير في آخر الجملة للتأكد: الجملة المثبتة يأتي بعدها سؤال منفي، والمنفية يأتي بعدها سؤال مثبت." });
    if (/^(am|is|are|was|were)$/.test(x.aux) && !x.md && !o.pas) out.push({ k: "be", name: "🧱 am / is / are", rule: "I am · he / she / it is · we / you / they are. Past: I / he / she / it was · we / you / they were.", ar: "‏I am · he / she / it is · we / you / they are، وفي الماضي was للمفرد و were للجمع." });
    return out;
  }
  function phrase(word, o) {
    if (o && o.shape && o.shape.k && o.shape.k !== "verb" && !o.neg && !o.q) return shapePhrase(o);
    if (o && o.shape && o.shape.k === "thing") return shapePhrase(o);
    const F = forms(word), t = T(o.tense) || T("past"), p = o.person || "she", base = F.base.split(" ")[0];
    if (o.imp) return impPhrase(F, o);
    if (o.sty === "inv" && !o.q && !o.pas) { const adv = o.invA || "rarely";   // ✨ Rarely does she swim. · Never have I seen…
      const qq = phrase(word, { ...o, sty: "", q: true, neg: false, tag: false, when: MID.has((o.when || "").toLowerCase()) ? "" : o.when }).replace(/\?$/, "");
      return cap1(adv) + " " + qq.charAt(0).toLowerCase() + qq.slice(1) + "."; }
    if (o.sty === "cleft" && !o.q && !o.pas) { const st = phrase(word, { ...o, sty: "", tag: false }), who = subjOf(p), rest = st.slice(who.length).trim();   // ✨ It was Rover who ate the cake.
      const it = t.z === "past" ? "It was" : t.z === "future" ? "It will be" : "It is", x = PRON.find(r => r.sub === who.toLowerCase() || (r.k === "i" && who === "I"));
      return `${it} ${x ? (x.k === "i" ? "I" : x.sub) : who} who ${rest}.`; }
    if (o.pas && o.pas.obj) return pasPhrase(F, t, p, o);
    const X = vpOf(F, t, p, o);
    const vp = o.neg ? (X.md && X.md.k === "sure" ? X.vp : [NEG[X.aux] || X.aux + " not", X.rest].filter(Boolean).join(" ")) : X.vp;
    const tail = F.base.split(" ").slice(1).join("\\s+");
    const re = new RegExp(`\\b(${[base, F.s, F.past, F.pp, F.ing].map(x => x.split(" ")[0]).join("|")})\\b${tail ? `(\\s+${tail})?` : ""}`, "i");
    // "always", "never", "already", "just"… sit inside the verb: "has never given up", "always lies"
    const w = o.when || "", mid = MID.has(w.toLowerCase()), parts = vp.split(" ");
    const AUX = /^(am|is|are|was|were|has|have|had|will|do|does|did|can|could|must|should|might|may|would|isn't|aren't|wasn't|weren't|hasn't|haven't|hadn't|won't|don't|doesn't|didn't|can't|couldn't|mustn't|shouldn't|wouldn't)$/;
    const at = parts[1] === "not" ? 2 : 1;   // "am not always", "might not always"
    let v2 = !mid ? vp : parts.length > at && AUX.test(parts[0]) ? [...parts.slice(0, at), w, ...parts.slice(at)].join(" ") : `${w} ${vp}`;
    // a question: the first helper word jumps in front of who ("Does she play?", "Is she playing?", "Can she swim?")
    const qa = o.q ? v2.split(" ") : null, front = qa ? qa[0] : "", core = qa ? qa.slice(1).join(" ") : v2;
    let verb = core; const extra = [];
    (o.partners || []).forEach(x => { if (re.test(x) && verb === core) verb = x.replace(re, core); else extra.push(x); });
    const who = subjOf(p), who2 = o.q && who !== "I" && PRON.some(r => r.sub === who.toLowerCase()) ? who.toLowerCase() : who;
    const out = (o.q ? [front, who2, verb, ...extra, mid ? "" : w] : [who, verb, ...extra, mid ? "" : w]).filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
    return out.charAt(0).toUpperCase() + out.slice(1) + (o.q ? "?" : o.tag ? tagOf(F, t, p, o) : "");
  }
  const cap1 = x => x.charAt(0).toUpperCase() + x.slice(1);
  // 🏷️ the tag: "…, doesn't she?" / "…, does she?" / "…, aren't I?"
  function tagOf(F, t, p, o) {
    const pr = o.tagPr || (PRON.some(r => r.k === p) ? p : ""), sub = pr === "i" ? "I" : (PRON.find(r => r.k === pr) || {}).sub;
    if (!sub) return "";
    const pa = pr === "i" ? "i" : pr === "he" || pr === "she" || pr === "it" ? "she" : "they";   // the tag agrees with its own pronoun
    let aux = vpOf(F, t, pa === "i" ? "i" : pa, { ...o, neg: true, q: false, tag: false }).aux;
    if (o.modal === "sure") aux = "must";
    const tagv = o.neg ? aux : aux === "am" ? "aren't" : (NEG[aux] || aux + " not");
    return `, ${tagv} ${sub}?`;
  }
  // 👉 "Swim!", "Don't swim!", "Be careful!"
  function impPhrase(F, o) {
    const shp = o.shape && o.shape.k && o.shape.k !== "verb" && o.shape.k !== "thing" ? o.shape : null;
    const v = shp ? `be ${shp.k === "person" ? AN(shp.w) + " " + shp.w : shp.w}` : F.base, extra = (o.partners || []).filter(Boolean);
    const out = [o.neg ? "don't" : "", v, ...extra, o.when && !MID.has(o.when.toLowerCase()) ? o.when : ""].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
    return out.charAt(0).toUpperCase() + out.slice(1) + "!";
  }
  // 🔄 passive: "The cake was eaten by Rover." — o.pas = { obj: "the cake", many: false, by: true }
  const PAS_NO = new Set(["go", "come", "arrive", "sleep", "cry", "laugh", "die", "fall", "sit", "stand", "happen", "appear", "disappear", "exist", "smile", "be", "become", "seem", "lie", "rise", "wait", "travel", "giggle", "chuckle", "sigh", "nap", "doze", "dwell", "reside", "succeed", "fail"]);
  const canPas = word => !PAS_NO.has(forms(word).base.split(" ")[0]);
  function pasPhrase(F, t, p, o) {
    const op = o.pas.many ? "they" : "it", pp = F.pp, md = o.modal ? MD(o.modal) : null, z = t.z;
    let vp = md ? ({ can: { now: "can be", past: "could be", future: "will be able to be" }, must: { now: "must be", past: "had to be", future: "will have to be" }, haveto: { now: `${hv(op)} to be`, past: "had to be", future: "will have to be" },
        should: { now: "should be", past: "should have been", future: "should be" }, might: { now: "might be", past: "might have been", future: "might be" }, sure: { now: "must be", past: "must have been", future: "must be" } }[md.k][z === "past" ? "past" : z === "future" ? "future" : "now"])
      : ({ present: be(op), past: was(op), prescont: `${be(op)} being`, pastcont: `${was(op)} being`, presperf: `${hv(op)} been`, presperfcont: `${hv(op)} been`, pastperf: "had been", pastperfcont: "had been",
        future: "will be", goingto: `${be(op)} going to be`, futurecont: "will be", futureperf: "will have been", usedto: "used to be" })[t.k] || was(op);
    vp += " " + pp;
    const tAux = md && md.k === "sure" ? "must" : /^(has to|have to|had to|used to)/.test(vp) ? (z === "past" ? "did" : one(op) ? "does" : "do") : vp.split(" ")[0];
    if ((o.neg || o.q) && /^(has to|have to|had to|used to)/.test(vp)) { const d = z === "past" ? "did" : one(op) ? "does" : "do"; vp = `${d} ${vp.replace(/^(has|have|had) to/, "have to").replace(/^used to/, "use to")}`; }
    if (md && md.k === "sure" && (o.neg || o.q)) vp = vp.replace(/^must/, o.q ? "could" : "can't");
    const ws = vp.split(" "), aux = ws[0], rest = ws.slice(1).join(" ");
    const v = o.neg && !(md && md.k === "sure") ? [NEG[aux] || aux + " not", rest].join(" ") : vp;
    const who = subjOf(p), x = PRON.find(r => r.sub === who.toLowerCase() || (r.k === "i" && who === "I")), by = o.pas.by ? " by " + (x ? x.obj : who) : "";
    const obj = String(o.pas.obj).trim(), w = o.when && !MID.has(o.when.toLowerCase()) ? " " + o.when : "";
    let out;
    if (o.q) { const qa = v.split(" "); out = `${qa[0]} ${obj} ${qa.slice(1).join(" ")}${by}${w}?`; }
    else out = `${obj} ${v}${by}${w}` + (o.tag ? `, ${o.neg ? tAux : (NEG[tAux] || tAux + " not")} ${op}?` : "");
    out = out.replace(/\s+/g, " ").trim();
    return out.charAt(0).toUpperCase() + out.slice(1);
  }
  // ---- 🔀 word shapes: the same idea as a 📦 thing (achievement), a 🧑 person (achiever) or 🎨 describing word (achievable) ----
  const PL = w => /[^aeiou]y$/.test(w) ? w.slice(0, -1) + "ies" : /(s|sh|ch|x|z)$/.test(w) ? w + "es" : w + "s";
  const AN = w => /^(hour|honou?r|honest)/i.test(w) ? "an" : /^(uni|use|eu|one)/i.test(w) ? "a" : /^[aeiou]/i.test(w) ? "an" : "a";
  const many = p => p === "we" || p === "they" || /^n2:/.test(String(p));
  // whose: the word in front of a thing ("your", "Rover's", "the", "a")
  function ownOf(p) { const x = PRON.find(r => r.k === p); if (x) return x.adj; const n = subjOf(p); return n ? (/s$/i.test(n) && /^n2:/.test(String(p)) ? n + "'" : n + "'s") : "the"; }
  const beOf = (t, p) => t.k === "past" ? was(p) : t.k === "presperf" ? hv(p) + " been" : t.k === "future" ? "will be" : be(p);
  const BE_TENSES = ["past", "presperf", "present", "future"];
  function shapeVp(sh, t, p) { const w = sh.w; return sh.k === "person" ? `${beOf(t, p)} ${many(p) ? PL(w) : AN(w) + " " + w}` : `${beOf(t, p)} ${w}`; }
  function thingPhrase(sh) { const n = sh.many ? PL(sh.w) : sh.w, o = sh.own || "the"; const out = o === "a" ? (sh.many ? n : `${AN(n)} ${n}`) : `${o} ${n}`; return out.charAt(0).toUpperCase() + out.slice(1); }
  function shapePhrase(o) {
    const sh = o.shape, t = T(o.tense) || T("present"), p = o.person || "she";
    if (sh.k === "thing") return thingPhrase(sh);
    const vp = shapeVp(sh, t, p), w = o.when || "", mid = MID.has(w.toLowerCase()), parts = vp.split(" ");
    const v2 = mid ? [parts[0], w, ...parts.slice(1)].join(" ") : vp, out = [subjOf(p), v2, mid ? "" : w].filter(Boolean).join(" ");
    return out.charAt(0).toUpperCase() + out.slice(1);
  }
  const FAMC = new Map();
  const famKeys = word => { const h = String(word && word.w || word || "").trim().toLowerCase(); return [...new Set([h, forms(word).base.toLowerCase()])]; };
  async function family(word) {
    const keys = famKeys(word), key = keys.join("|"); if (FAMC.has(key)) return FAMC.get(key);
    const pr = (async () => { const out = { thing: [], person: [], describing: [] };
      try { const r = await App.client.from("word_forms").select("base,form,kind,countable,position").in("base", keys).order("position");
        const rows = r.data || [], b = keys.find(k => rows.some(x => x.base === k));
        rows.filter(x => x.base === b).forEach(x => out[x.kind] && out[x.kind].push({ w: x.form, c: x.countable !== false })); } catch (e) {}
      FAMC.set(key, out); return out; })();
    FAMC.set(key, pr); return pr;
  }
  // the other way: achievement → { base: "achieve", kind: "thing" } (so a thing / person / describing word can become a sentence too)
  const REVC = new Map();
  function reverse(word) {
    const w = String(word && word.w || word || "").trim().toLowerCase(); if (!w || !window.App || !App.client) return Promise.resolve(null);
    if (!REVC.has(w)) REVC.set(w, (async () => { try { const r = await App.client.from("word_forms").select("base,form,kind,countable").eq("form", w).limit(1);
      const x = (r.data || [])[0]; return x ? { base: x.base, kind: x.kind, form: x.form, c: x.countable !== false } : null; } catch (e) { return null; } })());
    return REVC.get(w);
  }
  // the shapes we already know for a word (after family() has run): for checking a story uses the word
  const famForms = word => { const f = FAMC.get(famKeys(word).join("|")); return f && !f.then ? [...f.thing, ...f.person, ...f.describing].flatMap(x => [x.w, PL(x.w)]) : []; };
  const say = (word, k, p) => { const t = T(k); return t ? t.f(forms(word), p || "she") : String(word && word.w || word); };
  const allForms = word => { const F = forms(word); return [F.base, F.s, F.past, F.pp, F.ing].map(x => x.split(" ")[0]); };
  const age = () => (window.Meter && Meter.age ? Meter.age() : null);
  function depth() { try { const s = +localStorage.getItem("tenseDepth"); if (s) return s; } catch (e) {} const a = age(); return a != null && a <= 7 ? 1 : a != null && a <= 12 ? 2 : 3; }
  const css = `
.tm{display:grid;gap:10px;background:linear-gradient(180deg,#f5f3ff,#eef6ff);border:1.5px solid #dbe3f3;border-radius:16px;padding:12px 14px}
.tm-top{display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between}
.tm-forms{display:flex;flex-wrap:wrap;gap:6px}.tm-forms span{background:#fff;border:1px solid #dbe3f3;border-radius:10px;padding:3px 9px;font:700 .85rem var(--f-body,system-ui)}
.tm-forms small{display:block;font-size:.65rem;color:#64748b;font-weight:800;text-transform:uppercase;letter-spacing:.04em}
.tm-forms .irr{border-color:#f59e0b;background:#fffbeb}
.tm-seg{display:inline-flex;background:#fff;border:1px solid #dbe3f3;border-radius:999px;padding:2px}.tm-seg button{border:0;background:transparent;border-radius:999px;padding:4px 9px;font:800 .78rem var(--f-body,system-ui);cursor:pointer;color:#334155}
.tm-seg button[aria-pressed="true"]{background:#4338ca;color:#fff}
.tm-line{position:relative;padding:36px 8px 8px}
.tm-zones{position:absolute;left:8px;right:8px;top:0;display:grid;font:800 .7rem var(--f-body,system-ui);letter-spacing:.08em;color:#64748b;text-align:center}
.tm-track{position:relative;height:10px;border-radius:999px;background:linear-gradient(90deg,#c7d2fe,#a5b4fc 45%,#fde68a 50%,#86efac 55%,#bbf7d0)}
.tm-now{position:absolute;top:-8px;width:3px;height:26px;background:#f59e0b;border-radius:2px}
.tm-nowl{position:absolute;top:-24px;transform:translateX(-50%);font:900 .68rem var(--f-body,system-ui);color:#b45309;letter-spacing:.08em}
.tm-stops{position:relative;height:44px;margin-top:-26px}
.tm-stop{position:absolute;transform:translateX(-50%);display:grid;place-items:center;width:38px;height:38px;border-radius:50%;border:2px solid #fff;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.18);font-size:1.05rem;cursor:pointer;transition:transform .35s cubic-bezier(.34,1.56,.64,1),background .2s}
.tm-stop:hover{transform:translateX(-50%) scale(1.12)}.tm-stop.on{background:#4338ca;transform:translateX(-50%) scale(1.25);box-shadow:0 0 0 4px rgba(67,56,202,.25)}
.tm-say{display:grid;gap:3px;text-align:center;animation:tmIn .35s ease both}
.tm-sayit{display:flex;flex-wrap:wrap;gap:5px;align-items:center;justify-content:center}.tm-sayit .lab{font:800 .78rem var(--f-body,system-ui);color:#64748b;text-transform:uppercase;letter-spacing:.05em;margin-right:2px}
.tm-sayit button{border:1.5px solid #c7d2fe;background:#fff;border-radius:999px;padding:3px 10px;font:700 .85rem var(--f-body,system-ui);color:#3730a3;cursor:pointer}.tm-sayit button[aria-pressed="true"]{background:#4338ca;border-color:#4338ca;color:#fff}
.tm-sayit .sep{width:1px;height:20px;background:#c7d2fe;margin:0 4px}.tm-sayit .md{border-style:dashed}.tm-sayit .md[aria-pressed="true"]{border-style:solid}
.tm-gcs{display:flex;flex-wrap:wrap;gap:5px;justify-content:center}.tm-gc{border:0;background:#f1f5f9;color:#334155;border-radius:8px;padding:2px 8px;font:700 .78rem var(--f-body,system-ui);cursor:pointer}.tm-gc[aria-expanded="true"]{background:#e0e7ff;color:#3730a3}
.tm-gr{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:6px 10px;font-size:.88rem;color:#334155;text-align:left}.tm-gr .ar{display:block;font-family:var(--f-ar,inherit);margin-top:3px;color:#475569}
@keyframes tmIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.tm-say .s{font:800 1.5rem/1.2 var(--f-display,system-ui);color:#1e1b4b}.tm-say .s b{color:#4338ca;background:#e0e7ff;border-radius:8px;padding:0 5px;margin-right:1px}
.tm-say .n{font:800 .8rem var(--f-body,system-ui);color:#4338ca;text-transform:uppercase;letter-spacing:.06em}.tm-say .wh{font-size:.9rem;color:#475569}
.tm-ex{display:grid;gap:6px;text-align:left;background:#fff;border:1px solid #e0e7ff;border-radius:12px;padding:8px 10px;margin-top:4px}
.tm-need{justify-self:start;font:800 .8rem var(--f-body,system-ui);border-radius:999px;padding:2px 10px}
.tm-sig{display:flex;flex-wrap:wrap;gap:5px}.tm-w{border:1.5px dashed #a5b4fc;background:#eef2ff;color:#3730a3;border-radius:999px;padding:2px 9px;font:700 .8rem var(--f-body,system-ui);cursor:default}
.tm-w.add{cursor:pointer;border-style:solid}.tm-w.add:hover{border-color:#4338ca}.tm-w.on{background:#4338ca;color:#fff;border-color:#4338ca}
.tm-whobar{display:flex;align-items:center;gap:6px}.tm-cur{border:2px solid #4338ca;background:#fff;color:#1e1b4b;border-radius:999px;padding:4px 12px;font:800 .95rem var(--f-body,system-ui);cursor:pointer}
.tm-cur span{font-size:.75rem;color:#4338ca;margin-left:4px}
.tm-whop{background:#fff;border:1.5px solid #c7d2fe;border-radius:14px;padding:10px;display:grid;gap:8px;animation:tmIn .25s ease both}
.tm-tabs{display:flex;gap:4px;flex-wrap:wrap;border-bottom:1.5px solid #e0e7ff;padding-bottom:6px}.tm-tabs button{border:0;background:transparent;border-radius:999px;padding:5px 11px;font:800 .82rem var(--f-body,system-ui);cursor:pointer;color:#475569}
.tm-tabs button[aria-selected="true"]{background:#4338ca;color:#fff}
.tm-pron{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:6px}
.tm-pc{display:grid;gap:2px;text-align:left;border:1.5px solid #e0e7ff;background:#f8faff;border-radius:12px;padding:7px 9px;cursor:pointer;font-family:var(--f-body,system-ui)}
.tm-pc b{font:800 1.1rem var(--f-display,system-ui);color:#1e1b4b}.tm-pc .ar{font-size:.8rem;color:#64748b}
.tm-pc .fm{display:flex;flex-wrap:wrap;gap:3px}.tm-pc .fm i{font-style:normal;font-size:.72rem;background:#eef2ff;border-radius:6px;padding:0 5px;color:#3730a3}
.tm-pc.on,.tm-o.on,.tm-ch.on{border-color:#4338ca;background:#4338ca;color:#fff}.tm-pc.on b,.tm-pc.on .ar{color:#fff}.tm-pc.on .fm i{background:rgba(255,255,255,.2);color:#fff}
.tm-chars,.tm-opts,.tm-rels{display:flex;flex-wrap:wrap;gap:6px}
.tm-ch{border:1.5px solid #e0e7ff;background:#f8faff;border-radius:999px;padding:5px 12px;font:800 .9rem var(--f-body,system-ui);cursor:pointer}
.tm-sub,.tm-sub2{display:inline-flex;gap:4px;background:#eef2ff;border-radius:999px;padding:3px;justify-self:start}.tm-sub button,.tm-sub2 button{border:0;background:transparent;border-radius:999px;padding:5px 11px;font:800 .82rem var(--f-body,system-ui);cursor:pointer;color:#3730a3}
.tm-sub button[aria-pressed="true"],.tm-sub2 button[aria-pressed="true"]{background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.12)}
.tm-o{display:grid;gap:1px;text-align:left;border:1.5px solid #e0e7ff;background:#f8faff;border-radius:12px;padding:6px 10px;cursor:pointer;font-family:var(--f-body,system-ui)}
.tm-o b{font-size:.92rem}.tm-o small{font-size:.72rem;color:#64748b}.tm-o.on small{color:#e0e7ff}
.tm-otherf{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.tm-otherf input{flex:1 1 200px;font:600 .95rem var(--f-body,system-ui);padding:7px 10px;border:1.5px solid #c7d2fe;border-radius:10px}
.tm-tip{margin:0;font-size:.82rem;color:#475569}.tm-tip b{color:#4338ca}
.tm-ptab summary{cursor:pointer;font:800 .85rem var(--f-body,system-ui);color:#4338ca}.tm-ptab table{width:100%;border-collapse:collapse;margin:6px 0;font-size:.85rem}
.tm-ptab th,.tm-ptab td{border-bottom:1px solid #e0e7ff;padding:4px 6px;text-align:left}.tm-ptab th{font-size:.72rem;color:#475569}.tm-ptab th small{font-weight:600}
.tm-sig .lab,.tm-who .lab,.tm-whobar .lab{font:800 .72rem var(--f-body,system-ui);color:#64748b;align-self:center;padding:0 4px}
.tm-nav .use[disabled]{background:#e0e7ff;color:#6366f1;border-color:#c7d2fe;cursor:not-allowed}
.tm-ex ul{margin:0;padding-left:2px;list-style:none;display:grid;gap:3px;font-size:.93rem}.tm-ex li b{color:#4338ca}.tm-ex li.bad{color:#9a3412}.tm-ex li.bad small{color:#9a3412}
.tm-sig2{justify-content:center;margin-top:4px}
.tm-more{justify-self:end;border:0;background:transparent;color:#6366f1;font:800 .78rem var(--f-body,system-ui);cursor:pointer;padding:2px 6px}
.tm-shape{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.tm-sh{display:grid;border:1.5px solid #e0e7ff;background:#fff;border-radius:12px;padding:3px 10px;font:800 .9rem var(--f-body,system-ui);cursor:pointer;color:#1e1b4b;text-align:left;line-height:1.15}
.tm-sh small{font-size:.66rem;color:#64748b;font-weight:700}.tm-sh.on{background:#4338ca;border-color:#4338ca;color:#fff}.tm-sh.on small{color:#e0e7ff}
.tm-cal{border-style:dashed!important}.tm-datep{margin-top:6px;text-align:left}
.tm-dt{display:flex;flex-wrap:wrap;gap:8px;align-items:center}.tm-dt input{font:700 1rem var(--f-body,system-ui);padding:7px 10px;border:1.5px solid #c7d2fe;border-radius:10px;background:#fff;color:#1e1b4b}
.tm-quick{display:flex;flex-wrap:wrap;gap:6px}
.tm-nav{display:flex;justify-content:center;gap:8px}.tm-nav button{border:1.5px solid #c7d2fe;background:#fff;border-radius:999px;padding:5px 12px;font:800 .85rem var(--f-body,system-ui);cursor:pointer;color:#3730a3}
.tm-nav .use{background:#4338ca;color:#fff;border-color:#4338ca}
@media (prefers-reduced-motion:reduce){.tm-stop,.tm-say{transition:none;animation:none}}`;
  const addCss = () => { if (!document.getElementById("tense-css")) { const s = document.createElement("style"); s.id = "tense-css"; s.textContent = css; document.head.appendChild(s); } };
  // the examples: when a time word is needed, which ones go with it, and a common mistake
  function examples(t, F, st, subj) {
    const N = NEED[t.need], x = t.f(F, st.p), cap = w => w.charAt(0).toUpperCase() + w.slice(1), S = (PRON.some(x => x.k === st.p) && st.p !== "i") || /^n[12]:(his|her|its|their|my|your|our) /.test(st.p) ? subj.toLowerCase() : subj;
    const hi = line => esc(cap(line)).replace(/\[\[(.+?)\]\]/g, "<b>$1</b>");
    return `<div class="tm-ex"><span class="tm-need" style="color:${N[2]};background:${N[3]}">${N[0]} ${N[1]}: ${esc(t.needTxt)}</span>
      <ul>${t.ex.map(f => `<li>✅ ${hi(f(S, x, F, st.p))}</li>`).join("")}${t.bad ? `<li class="bad">❌ <s>${hi(t.bad(S, x, F, st.p))}</s> <small>(not with an exact past time: use "${esc(TENSES.find(y => y.k === "past").f(F, st.p))}" for that)</small></li>` : ""}</ul></div>`;
  }
  // ---- 📅 one exact time: a date, a time, both, a day of the week, or a year (only one at a time) ----
  const MON = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const ymd = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const addDays = n => { const d = new Date(); d.setDate(d.getDate() + n); return ymd(d); };
  const dateWords = v => { const [y, m, d] = v.split("-").map(Number); return `${d} ${MON[m - 1]} ${y}`; };
  const timeWords = v => { let [h, m] = v.split(":").map(Number); const ap = h < 12 ? "am" : "pm"; h = h % 12 || 12; return m ? `${h}:${String(m).padStart(2, "0")} ${ap}` : h === 12 && ap === "pm" ? "noon" : `${h} ${ap}`; };
  // dt = { kind: "date"|"time"|"dt"|"day"|"year", date, time, day, year } → { text, side, block, tip }
  function dtWhen(dt, t) {
    if (!dt) return null;
    const today = ymd(new Date()), rel = dt.date === today ? "today" : dt.date === addDays(-1) ? "yesterday" : dt.date === addDays(1) ? "tomorrow" : "";
    let prep, core, side = "";
    if (dt.kind === "date" || dt.kind === "dt") { if (!dt.date) return null; side = dt.date < today ? "past" : dt.date > today ? "future" : "now"; prep = rel ? "" : "on"; core = rel || dateWords(dt.date); }
    if (dt.kind === "dt") { if (!dt.time) return null; core += ` at ${timeWords(dt.time)}`; }
    if (dt.kind === "time") { if (!dt.time) return null; prep = "at"; core = timeWords(dt.time); }
    if (dt.kind === "day") { if (!dt.day) return null; prep = "on"; core = dt.day; }
    if (dt.kind === "year") { if (!dt.year) return null; const y = +dt.year, ny = new Date().getFullYear(); side = y < ny ? "past" : y > ny ? "future" : "now"; prep = "in"; core = String(y); }
    // the little word in front changes with the time on the line
    if (t.k === "presperf") return { text: "", side, block: true, tip: `🚫 This time can't take an exact time like "${[prep, core].filter(Boolean).join(" ")}". Slide to ⬅️ Past simple for that.` };
    if (t.k === "pastperf" || t.k === "futureperf") prep = "by";
    else if (t.k === "pastperfcont" || t.k === "presperfcont") prep = "since";
    else if (t.k === "present" && dt.kind === "day") core = dt.day + "s";
    const text = [prep, core].filter(Boolean).join(" ");
    let tip = "";
    if (side && side !== "now" && t.z !== "now" && side !== t.z) tip = side === "past" ? `⚠️ ${core} is in the past. Slide to the PAST side?` : `⚠️ ${core} is in the future. Slide to the FUTURE side?`;
    return { text, side, tip };
  }
  function mount(el, o) {
    addCss();
    // the time words for this time: always there (small), so the sentence can be finished
    const timeChips = t => { const lab = t.need === "yes" ? "⏰ When?" : t.need === "never" ? "➕" : "🕒 When?";
      return `<div class="tm-sig tm-sig2"><span class="lab">${lab}</span>${t.sig.map(w => `<button type="button" class="tm-w add${!st.dt && st.when === w ? " on" : ""}" data-tw="${esc(w)}" aria-pressed="${!st.dt && st.when === w}">${!st.dt && st.when === w ? "✓ " : ""}${esc(w)}</button>`).join("")}<button type="button" class="tm-w add tm-cal${st.dt ? " on" : ""}" data-dtog="1" aria-expanded="${st.dOpen}">${st.dt && st.dw && st.dw.text ? "✓ 📅 " + esc(st.dw.text) : "📅 Exact time…"}</button></div>${st.dOpen ? datePanel(t) : ""}`; };
    function datePanel(t) {
      const tabs = [["date", "📅 Date"], ["time", "🕒 Time"], ["dt", "📅🕒 Date & time"], ["day", "📆 Day"], ["year", "🎂 Year"]], k = st.dk, d = st.dt && st.dt.kind === k ? st.dt : {};
      const today = ymd(new Date()), ny = new Date().getFullYear();
      let body = "";
      if (k === "date" || k === "dt") body = `<div class="tm-dt"><input type="date" data-dd value="${esc(d.date || "")}" aria-label="Choose a date">${k === "dt" ? `<input type="time" data-dtm value="${esc(d.time || "")}" aria-label="Choose a time">` : ""}
          <span class="tm-quick">${[[-1, "Yesterday"], [0, "Today"], [1, "Tomorrow"]].map(([n, l]) => `<button type="button" class="tm-o${d.date === addDays(n) ? " on" : ""}" data-dq="${addDays(n)}"><b>${l}</b></button>`).join("")}</span></div>`;
      else if (k === "time") body = `<div class="tm-dt"><input type="time" data-dtm value="${esc(d.time || "")}" aria-label="Choose a time"><span class="tm-quick">${[["07:00", "🌅"], ["12:00", "☀️"], ["17:00", "🌇"], ["21:00", "🌙"]].map(([v, i]) => `<button type="button" class="tm-o${d.time === v ? " on" : ""}" data-tq="${v}"><b>${i} ${timeWords(v)}</b></button>`).join("")}</span></div>`;
      else if (k === "day") body = `<div class="tm-opts">${DAYS.map(x => `<button type="button" class="tm-o${d.day === x ? " on" : ""}" data-dday="${x}"><b>${x}</b></button>`).join("")}</div>`;
      else body = `<div class="tm-dt"><input type="number" data-dy min="1" max="3000" placeholder="${ny}" value="${esc(d.year || "")}" aria-label="Type a year" style="width:7em"><span class="tm-quick">${[[-1, "Last year"], [0, "This year"], [1, "Next year"]].map(([n, l]) => `<button type="button" class="tm-o${+d.year === ny + n ? " on" : ""}" data-yq="${ny + n}"><b>${l}</b><small>${ny + n}</small></button>`).join("")}</span></div>`;
      const w = st.dw;
      return `<div class="tm-whop tm-datep"><div class="tm-tabs">${tabs.map(([x, l]) => `<button type="button" data-dk="${x}" aria-selected="${k === x}">${l}</button>`).join("")}${st.dt ? `<button type="button" data-dclr="1" style="margin-left:auto">✕ Clear</button>` : ""}</div>${body}
        ${w && w.tip ? `<p class="tm-tip" style="color:#b45309;font-weight:700">${esc(w.tip)}${w.block ? ` <button type="button" class="tm-o" data-tk="past" style="display:inline-grid"><b>⬅️ Past simple</b></button>` : w.side === "past" || w.side === "future" ? ` <button type="button" class="tm-o" data-tk="${w.side === "past" ? "past" : "future"}" style="display:inline-grid"><b>${w.side === "past" ? "⬅️ Past" : "➡️ Future"}</b></button>` : ""}</p>` : `<p class="tm-tip">Pick one: it takes the place of the time words.</p>`}</div>`;
    }
    let full = false; try { full = localStorage.getItem("tenseFull") === "1"; } catch (x) {}
    const F = forms(o.word), st = { full, k: o.tense || "past", p: o.person || ((o.cast || []).find(c => c && c.name) ? "c:" + (o.cast || []).find(c => c && c.name).name : "she"), d: depth(), when: o.when || "", dt: o.dt || null, dOpen: false, sh: o.shape && o.shape.k ? { ...o.shape } : { k: "verb" }, fam: null, dk: (o.dt && o.dt.kind) || "date" };
    const cast = (o.cast || []).filter(c => c && c.name);
    st.neg = !!o.neg; st.q = !!o.q; st.md = o.modal || ""; st.gc = ""; st.imp = !!o.imp; st.tag = !!o.tag; st.sty = o.sty || ""; st.invA = o.invA || "rarely"; st.pas = o.pas ? { on: true, ...o.pas } : { on: false, obj: "", many: false, by: true };
    // who the tag is about: "she" for Rover the girl, "they" for many, nothing when we can't know
    const tagPrOf = p => { if (PRON.some(r => r.k === p)) return p; const n = String(p); if (/^c:/.test(n)) { const c = cast.find(x => "c:" + x.name === n); return c ? prOf(c) : ""; }
      if (/^n2:/.test(n)) return "they"; if (/(son|father|brother|grandfather|uncle)$/i.test(n)) return "he"; if (/(daughter|mother|sister|grandmother|aunt)$/i.test(n)) return "she"; return ""; };
    const POf = shp => ({ tense: st.k, person: st.p, when: st.when, partners: o.partners, shape: shp, neg: st.neg, q: st.q && !st.imp, modal: shp || st.imp ? "" : st.md, imp: st.imp,
      tag: st.tag && !st.q && !st.imp && st.md !== "sure", tagPr: tagPrOf(st.p), pas: st.pas.on && st.pas.obj.trim() && !shp && !st.imp ? { obj: st.pas.obj.trim(), many: st.pas.many, by: st.pas.by } : null,
      sty: st.full && !shp && !st.imp && !st.q ? st.sty : "", invA: st.invA });
    st.wt = cast.length ? "char" : "pron"; st.wc = cast[0] ? cast[0].name : ""; st.ws = "self"; st.own = "name"; st.whoOpen = false;
    function whoPanel() {
      if (st.sh.k === "thing") return whoseBar();
      const cur = subjOf(st.p), c = cast.find(x => x.name === st.wc), pr = c ? PRON.find(x => x.k === prOf(c)) : null;
      const tabs = [["char", "🎭 My characters"], ["pron", "🙋 Pronouns"], ["other", "✏️ Someone else"]];
      let body = "";
      if (st.wt === "pron") body = `<div class="tm-pron">${PRON.map(x => `<button type="button" class="tm-pc${st.p === x.k ? " on" : ""}" data-tp="${x.k}"><b>${x.k === "i" ? "I" : x.sub}</b>${o.tr ? `<span class="ar" dir="rtl">${x.ar}</span>` : ""}</button>`).join("")}</div>
        ${st.full ? `<details class="tm-ptab"><summary>📋 The pronoun table</summary><table><thead><tr><th>Subject<br><small>who does it</small></th><th>Object<br><small>who gets it</small></th><th>Possessive adj.<br><small>before a thing</small></th><th>Possessive pronoun<br><small>on its own</small></th><th>Reflexive<br><small>-self</small></th></tr></thead>
          <tbody>${PRON.map(x => `<tr><td><b>${x.k === "i" ? "I" : x.sub}</b>${o.tr ? ` <small dir="rtl" style="display:block">${x.ar}</small>` : ""}</td><td>${x.obj}</td><td>${x.adj}</td><td>${x.pos}</td><td>${x.ref}</td></tr>`).join("")}</tbody></table>
          <p class="tm-tip"><b>He</b> made lunch. Mum gave <b>him</b> a hug. He ate <b>his</b> lunch. The lunch was <b>his</b>. He made it <b>himself</b>.</p></details>` : ""}`;
      else if (st.wt === "char" && !cast.length) body = `<p class="tm-tip">Your story has no characters yet.</p>${o.addChar ? `<button type="button" class="tm-ch" data-cadd="1" style="justify-self:start">🎭 Choose a character</button>` : ""}`;
      else if (st.wt === "char") body = `<div class="tm-chars">${cast.map(x => `<button type="button" class="tm-ch${x.name === st.wc ? " on" : ""}" data-wc="${esc(x.name)}">${esc(x.emoji || "🙂")} ${esc(x.name)}</button>`).join("")}${o.addChar ? `<button type="button" class="tm-ch" data-cadd="1" style="border-style:dashed">＋ Choose a character</button>` : ""}</div>
        ${c ? `<div class="tm-sub"><button type="button" data-ws="self" aria-pressed="${st.ws === "self"}">🧍 ${esc(c.name)} ${pr.k === "i" ? "" : "/ " + pr.sub}</button><button type="button" data-ws="rel" aria-pressed="${st.ws === "rel"}">👪 ${esc(owner(c.name))} family &amp; friends</button></div>
        ${st.ws === "self" ? `<div class="tm-opts"><button type="button" class="tm-o${st.p === "c:" + c.name ? " on" : ""}" data-tp="c:${esc(c.name)}">${esc(c.emoji || "🙂")} <b>${esc(c.name)}</b><small>use the name</small></button>
            <button type="button" class="tm-o${st.p === pr.k ? " on" : ""}" data-tp="${pr.k}"><b>${pr.sub.charAt(0).toUpperCase() + pr.sub.slice(1)}</b><small>when we already know who (${esc(c.name)} → ${pr.sub})</small></button></div>
            <p class="tm-tip">${esc(c.name)} → <b>${pr.sub}</b> · ${pr.obj} · ${pr.adj} · ${pr.pos} · ${pr.ref}. You can change it in 🎭 Characters.</p>`
          : `<div class="tm-sub2"><button type="button" data-own="name" aria-pressed="${st.own === "name"}">${esc(owner(c.name))} …</button><button type="button" data-own="pr" aria-pressed="${st.own === "pr"}">${pr.adj} …</button></div>
            <div class="tm-rels">${RELS.map(([r, ar, n]) => { const who = (st.own === "name" ? owner(c.name) : pr.adj) + " " + r, key = (n === 2 ? "n2:" : "n1:") + who;
              return `<button type="button" class="tm-o${st.p === key ? " on" : ""}" data-tp="${esc(key)}"><b>${esc(who)}</b>${o.tr ? `<small dir="rtl">${ar}</small>` : n === 2 ? `<small>many</small>` : ""}</button>`; }).join("")}</div>`}` : ""}`;
      else body = `<div class="tm-otherf"><input type="text" maxlength="40" data-oth placeholder="e.g. the old man, a little bird, the children" value="${esc(/^n[12]:/.test(st.p) && !cast.some(x => st.p.includes(x.name)) ? subjOf(st.p) : "")}">
          <span class="tm-sub2"><button type="button" data-on="1" aria-pressed="${st.on !== 2}">👤 one</button><button type="button" data-on="2" aria-pressed="${st.on === 2}">👥 many</button></span><button type="button" class="tm-o" data-othok="1"><b>✓ Use</b></button></div>
        <p class="tm-tip">One → "${esc("the old man")} <b>was</b> …" · Many → "the children <b>were</b> …"</p>`;
      return `<div class="tm-whobar"><span class="lab">Who?</span><button type="button" class="tm-cur" data-whotog="1" aria-expanded="${st.whoOpen}">${esc(cur.charAt(0).toUpperCase() + cur.slice(1))} <span>${st.whoOpen ? "▴" : "✎ change"}</span></button></div>
        ${st.whoOpen ? `<div class="tm-whop"><div class="tm-tabs">${tabs.map(([k, l]) => `<button type="button" data-wt="${k}" aria-selected="${st.wt === k}">${l}</button>`).join("")}</div>${body}</div>` : ""}`;
    }
    const isBe = () => st.sh.k === "describing" || st.sh.k === "person";
    const shown = () => TENSES.filter(t => t.lv <= st.d && (!isBe() || BE_TENSES.includes(t.k)));
    const SHI = { verb: ["🏃", "doing"], thing: ["📦", "a thing"], person: ["🧑", "a person"], describing: ["🎨", "describing"] };
    // 🔀 the same idea in other shapes (only when the dictionary knows them)
    function shapeBar() {
      const f = st.fam; if (!f || !(f.thing.length + f.person.length + f.describing.length)) return "";
      const opts = [["verb", F.base], ...["thing", "person", "describing"].flatMap(k => f[k].map(x => [k, x.w]))];
      return `<div class="tm-shape"><span class="lab">🔀 Shape</span>${opts.map(([k, w]) => { const on = st.sh.k === k && (k === "verb" || st.sh.w === w);
        return `<button type="button" class="tm-sh${on ? " on" : ""}" data-sh="${k}" data-shw="${esc(w)}" aria-pressed="${on}" title="${SHI[k][1]}">${SHI[k][0]} ${esc(w)}<small>${SHI[k][1]}</small></button>`; }).join("")}</div>`;
    }
    // whose thing? "your achievement", "Rover's achievement", "the achievement"
    function whoseBar() {
      const sh = st.sh, cur = thingPhrase(sh), opts = [...cast.map(c => [c.name + "'s", `${c.emoji || "🙂"} ${c.name}'s`]), ...PRON.map(x => [x.adj, x.adj]), ["the", "the"], ["a", sh.many ? "(none)" : "a / an"]];
      return `<div class="tm-whobar"><span class="lab">Whose?</span><button type="button" class="tm-cur" data-whotog="1" aria-expanded="${st.whoOpen}">${esc(cur)} <span>${st.whoOpen ? "▴" : "✎ change"}</span></button></div>
        ${st.whoOpen ? `<div class="tm-whop"><div class="tm-chars">${opts.map(([v, l]) => `<button type="button" class="tm-ch${sh.own === v ? " on" : ""}" data-own2="${esc(v)}">${esc(l)}</button>`).join("")}</div>
          ${sh.c ? `<div class="tm-sub2"><button type="button" data-many="0" aria-pressed="${!sh.many}">👤 one ${esc(sh.w)}</button><button type="button" data-many="1" aria-pressed="${!!sh.many}">👥 many ${esc(PL(sh.w))}</button></div>` : ""}</div>` : ""}`;
    }
    function draw(anim) {
      const top = shapeBar();
      if (st.sh.k === "thing") {
        const full = thingPhrase(st.sh);
        el.innerHTML = `<div class="tm" role="group" aria-label="Word shape for ${esc(F.word)}">${top}${whoseBar()}
          <div class="tm-say"${anim ? "" : ' style="animation:none"'}><span class="s"><b>${esc(full)}</b> …</span><span class="wh">📦 A thing word doesn't change with time. The rest of your sentence says when.</span></div>
          <div class="tm-nav">${o.onPick ? `<button type="button" class="use" data-tm-use="1">Use "${esc(full)}"</button>` : `<button type="button" data-tm-hear="1">🔊 Hear</button>`}</div></div>`;
        return;
      }
      const L = shown(); if (!L.some(t => t.k === st.k)) st.k = L.find(t => t.k === "past") ? "past" : L[0].k;
      const t = T(st.k), j = L.indexOf(t), pos = n => L.length === 1 ? 50 : 6 + n * 88 / (L.length - 1);
      const nowAt = (() => { const a = L.findIndex(x => x.z === "now"), b = L.length - 1 - [...L].reverse().findIndex(x => x.z === "now"); return a < 0 ? 50 : (pos(a) + pos(b)) / 2; })();
      st.dw = dtWhen(st.dt, t);
      if (st.dt) st.when = st.dw && !st.dw.block ? st.dw.text : "";
      else if (st.when && !t.sig.includes(st.when)) st.when = "";
      const shp = isBe() ? st.sh : null, vpOf = x => shp ? shapeVp(shp, x, st.p) : x.f(F, st.p);
      const PO = POf(shp);
      const X = Tense_vp(F, t, st.p, PO), vpS = st.neg ? [NEG[X.aux] || X.aux + " not", X.rest].filter(Boolean).join(" ") : X.vp;
      const subj = subjOf(st.p), vp = PO.imp || PO.pas ? "" : PO.q ? X.aux : (st.neg || st.md ? vpS : vpOf(t)), full = phrase(o.word, PO);
      const needWhen = t.need === "yes" && !st.when && !PO.q && !PO.imp, shown2 = vp ? esc(full).replace(esc(vp), `<b>${esc(vp)}</b>`) : esc(full);
      const GC = chipsOf(F, t, st.p, PO), gOpen = GC.find(c => c.k === st.gc);
      const canTag = !PO.q && !PO.imp && !!PO.tagPr && st.md !== "sure", canP = !shp && !st.imp && canPas(o.word);
      const sayit = `<div class="tm-sayit" role="group" aria-label="Say it as"><span class="lab">Say it</span>${[["s", "✔️ telling"], ["n", "🚫 not"], ["q", "❓ asking"], ["nq", "🚫❓ not + asking"], ["i", "👉 telling to"]].filter(([k]) => k !== "nq" || st.full).map(([k, l]) => {
          const on = k === "i" ? st.imp && !st.neg : st.imp ? (k === "n" && st.neg) : k === "s" ? !st.neg && !st.q : k === "n" ? st.neg && !st.q : k === "q" ? st.q && !st.neg : st.q && st.neg;
          return `<button type="button" data-sm="${k}" aria-pressed="${on}">${l}</button>`; }).join("")}
          ${canTag || canP ? `<span class="sep"></span>` : ""}${canTag ? `<button type="button" data-tag="1" aria-pressed="${st.tag}" title="Add a short question at the end">🏷️ …, isn't it?</button>` : ""}${canP ? `<button type="button" data-pas="1" aria-pressed="${st.pas.on}" title="Start with the thing it happens to">🔄 the thing first</button>` : ""}
          ${shp || st.imp ? "" : `<span class="sep"></span>${MODALS.map(m => `<button type="button" class="md" data-md="${m.k}" aria-pressed="${st.md === m.k}" title="${esc(m.what)}">${m.ico} ${esc(m.name)}</button>`).join("")}`}</div>
        ${st.full && !shp && !st.imp && !st.q ? `<div class="tm-sayit"><span class="lab">✨ Style</span><button type="button" data-sty="" aria-pressed="${!st.sty}">plain</button><button type="button" data-sty="inv" aria-pressed="${st.sty === "inv"}">Rarely does…</button><button type="button" data-sty="cleft" aria-pressed="${st.sty === "cleft"}">It was … who</button>
          ${st.sty === "inv" ? ["never", "rarely", "seldom", "hardly ever", "little"].map(a => `<button type="button" class="md" data-inva="${a}" aria-pressed="${st.invA === a}">${a}</button>`).join("") : ""}</div>` : ""}
        ${canP && st.pas.on ? `<div class="tm-sayit tm-pas"><span class="lab">What?</span><input type="text" maxlength="40" data-pobj value="${esc(st.pas.obj)}" placeholder="e.g. the cake, my homework" aria-label="What did it happen to?" style="border:1.5px solid #c7d2fe;border-radius:999px;padding:3px 10px;font:inherit;min-width:12em">
          <button type="button" data-pmany="0" aria-pressed="${!st.pas.many}">👤 one</button><button type="button" data-pmany="1" aria-pressed="${st.pas.many}">👥 many</button><button type="button" data-pby="1" aria-pressed="${st.pas.by}">by ${esc(subjOf(st.p).toLowerCase() === "i" ? "me" : (PRON.find(r => r.sub === subjOf(st.p).toLowerCase()) || {}).obj || subjOf(st.p))}</button></div>` : ""}
        ${GC.length ? `<div class="tm-gcs">${GC.map(c => `<button type="button" class="tm-gc" data-gc="${c.k}" aria-expanded="${st.gc === c.k}">🧩 ${esc(c.name)}</button>`).join("")}</div>${gOpen ? `<div class="tm-gr">${esc(gOpen.rule)}<span class="ar" dir="rtl" lang="ar">${esc(gOpen.ar)}</span></div>` : ""}` : ""}`;
      el.innerHTML = `<div class="tm" role="group" aria-label="Verb time line for ${esc(F.word)}">${top}
        ${st.full && !shp ? `<div class="tm-top"><div class="tm-forms">${[["Base", F.base], ["He/she", F.s], ["Past", F.past], ["Past participle", F.pp], ["-ing", F.ing]].map(([l, x], n) => `<span class="${F.irregular && (n === 2 || n === 3) ? "irr" : ""}"><small>${l}</small>${esc(x)}</span>`).join("")}</div></div>` : ""}${whoPanel()}
        ${st.full && F.irregular && !shp ? `<small style="color:#b45309;font-weight:800">⚡ Irregular verb: its past is not "-ed"</small>` : ""}
        <div class="tm-line"><div class="tm-zones" style="grid-template-columns:${nowAt}% ${100 - nowAt}%"><span style="text-align:left">⏮ PAST</span><span style="text-align:right">FUTURE ⏭</span></div>
          <div class="tm-track"><div class="tm-now" style="left:calc(${nowAt}% - 1px)" title="Now"></div><span class="tm-nowl" style="left:${nowAt}%">NOW</span></div>
          <div class="tm-stops">${L.map((x, n) => `<button type="button" class="tm-stop${x.k === st.k ? " on" : ""}" style="left:${pos(n)}%" data-tk="${x.k}" title="${esc(x.name)}: ${esc(vpOf(x))}" aria-label="${esc(x.name)}" aria-pressed="${x.k === st.k}">${x.ico}</button>`).join("")}</div></div>
        <div class="tm-say"${anim ? "" : ' style="animation:none"'}>${st.full ? `<span class="n">${esc(t.name)} · ${t.z === "now" ? "now" : t.z}</span>` : ""}<span class="s">${shown2}${/[?!]$/.test(full) ? "" : "."}</span>${shp ? `<span class="wh">${SHI[shp.k][0]} "${esc(shp.w)}" is not a doing word, so "${esc(beOf(t, st.p))}" carries the time.</span>` : ""}${st.full && !shp && o.partners && o.partners.length ? `<span class="wh">✨ With your partner words: ${esc(o.partners.join(", "))}</span>` : ""}${st.full && !shp ? `<span class="wh">${esc(t.when)}</span>${examples(t, F, st, subj)}` : ""}${timeChips(t)}${st.full && !shp && STATIVE.has(F.base.split(" ")[0]) && /ing\b/.test(vp) && !/going to/.test(vp) ? `<span class="wh" style="color:#b45309;font-weight:700">⚠️ "${esc(F.base)}" is a thinking or feeling word. We usually don't use it with "-ing": say "${esc(TENSES.find(x => x.k === (t.z === "past" ? "past" : t.z === "future" ? "future" : "present")).f(F, st.p))}" instead.</span>` : ""}</div>
        ${sayit}
        <div class="tm-nav"><button type="button" data-tm-step="-1" ${j === 0 ? "disabled" : ""}>◀ Earlier</button>${o.onPick ? (needWhen ? `<button type="button" class="use" disabled title="This time needs a time word">⏰ Choose a time word first</button>` : `<button type="button" class="use" data-tm-use="1">Use "${esc(full)}"</button>`) : `<button type="button" data-tm-hear="1">🔊 Hear</button>`}<button type="button" data-tm-step="1" ${j === L.length - 1 ? "disabled" : ""}>Later ▶</button></div>
        ${st.full ? `<div class="tm-seg" role="group" aria-label="How many times" style="justify-self:center">${[[1, "⭐ 3 times"], [2, "⭐⭐ 7 times"], [3, "⭐⭐⭐ all 12"]].map(([d, l]) => `<button type="button" data-td="${d}" aria-pressed="${d === st.d}">${l}</button>`).join("")}</div>` : ""}<button type="button" class="tm-more" data-full="1" aria-expanded="${st.full}">${st.full ? "✕ Less" : "ℹ️ Full details"}</button></div>`;
    }
    el.onclick = e => { const k = e.target.closest("[data-tk]"); if (k) { st.k = k.dataset.tk; draw(true); return; }
      const sm = e.target.closest("[data-sm]"); if (sm) { const v = sm.dataset.sm;
        if (v === "i") { st.imp = true; st.neg = false; st.q = false; } else if (st.imp && v === "n") { st.neg = !st.neg; } else { st.imp = false; st.neg = v === "n" || v === "nq"; st.q = v === "q" || v === "nq"; }
        st.gc = ""; draw(true); return; }
      const sy = e.target.closest("[data-sty]"); if (sy) { st.sty = sy.dataset.sty; st.gc = st.sty === "inv" ? "inversion" : st.sty === "cleft" ? "cleft" : ""; draw(true); return; }
      const ia = e.target.closest("[data-inva]"); if (ia) { st.invA = ia.dataset.inva; draw(true); return; }
      if (e.target.closest("[data-tag]")) { st.tag = !st.tag; st.gc = st.tag ? "tag" : ""; draw(true); return; }
      if (e.target.closest("[data-pas]")) { st.pas.on = !st.pas.on; if (st.pas.on && !st.pas.obj) st.pas.obj = "it"; st.gc = st.pas.on ? "passive" : ""; draw(true); return; }
      const pm = e.target.closest("[data-pmany]"); if (pm) { st.pas.many = pm.dataset.pmany === "1"; draw(false); return; }
      if (e.target.closest("[data-pby]")) { st.pas.by = !st.pas.by; draw(false); return; }
      const md = e.target.closest("[data-md]"); if (md) { st.md = st.md === md.dataset.md ? "" : md.dataset.md; st.gc = st.md ? "modal-" + st.md : ""; draw(true); return; }
      const gc = e.target.closest("[data-gc]"); if (gc) { st.gc = st.gc === gc.dataset.gc ? "" : gc.dataset.gc; draw(false); return; }
      const sh = e.target.closest("[data-sh]"); if (sh) { const k = sh.dataset.sh, w = sh.dataset.shw, x = k === "verb" ? null : st.fam[k].find(y => y.w === w);
        st.sh = k === "verb" ? { k: "verb" } : { k, w, c: x ? x.c : true, own: st.sh.own || ownOf(st.p), many: false }; st.whoOpen = false; draw(true); return; }
      const o2 = e.target.closest("[data-own2]"); if (o2) { st.sh.own = o2.dataset.own2; st.whoOpen = false; draw(false); return; }
      const mn = e.target.closest("[data-many]"); if (mn) { st.sh.many = mn.dataset.many === "1"; draw(false); return; }
      const p = e.target.closest("[data-tp]"); if (p) { st.p = p.dataset.tp; st.whoOpen = false; draw(false); return; }
      if (e.target.closest("[data-full]")) { st.full = !st.full; try { localStorage.setItem("tenseFull", st.full ? "1" : "0"); } catch (x) {} draw(false); return; }
      if (e.target.closest("[data-whotog]")) { st.whoOpen = !st.whoOpen; draw(false); return; }
      const wt = e.target.closest("[data-wt]"); if (wt) { st.wt = wt.dataset.wt; draw(false); return; }
      if (e.target.closest("[data-cadd]") && o.addChar) { Promise.resolve(o.addChar()).then(c => { if (!c) return; if (!cast.some(x => x.name.toLowerCase() === c.name.toLowerCase())) cast.push(c);
        st.wt = "char"; st.wc = c.name; st.ws = "self"; st.p = "c:" + c.name; st.whoOpen = false; if (el.isConnected) draw(false); }); return; }
      const wc = e.target.closest("[data-wc]"); if (wc) { st.wc = wc.dataset.wc; draw(false); return; }
      const ws = e.target.closest("[data-ws]"); if (ws) { st.ws = ws.dataset.ws; draw(false); return; }
      const ow = e.target.closest("[data-own]"); if (ow) { st.own = ow.dataset.own; draw(false); return; }
      const on = e.target.closest("[data-on]"); if (on) { st.on = +on.dataset.on; const v = el.querySelector("[data-oth]").value; draw(false); el.querySelector("[data-oth]").value = v; return; }
      if (e.target.closest("[data-othok]")) { const v = el.querySelector("[data-oth]").value.trim().replace(/\s+/g, " "); if (v) { st.p = (st.on === 2 ? "n2:" : "n1:") + v; st.whoOpen = false; draw(false); } return; }
      const d = e.target.closest("[data-td]"); if (d) { st.d = +d.dataset.td; try { localStorage.setItem("tenseDepth", st.d); } catch (x) {} draw(false); return; }
      const s = e.target.closest("[data-tm-step]"); if (s) { const L = shown(), j = L.findIndex(t => t.k === st.k) + +s.dataset.tmStep; if (L[j]) { st.k = L[j].k; draw(true); } return; }
      if (e.target.closest("[data-tm-hear]")) { try { const u = new SpeechSynthesisUtterance(st.sh.k === "thing" ? thingPhrase(st.sh) : phrase(o.word, POf(st.sh.k === "verb" ? null : st.sh))); u.lang = "en-US"; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (x) {} return; }
      const tw = e.target.closest("[data-tw]"); if (tw) { const same = !st.dt && st.when === tw.dataset.tw; st.dt = null; st.dOpen = false; st.when = same ? "" : tw.dataset.tw; draw(false); return; }
      if (e.target.closest("[data-dtog]")) { st.dOpen = !st.dOpen; draw(false); return; }
      const dk = e.target.closest("[data-dk]"); if (dk) { st.dk = dk.dataset.dk; draw(false); return; }
      if (e.target.closest("[data-dclr]")) { st.dt = null; st.when = ""; draw(false); return; }
      const setDt = v => { const keep = st.dt && st.dt.kind === st.dk ? st.dt : {}; st.dt = { kind: st.dk, ...keep, ...v }; draw(false); };
      const dq = e.target.closest("[data-dq]"); if (dq) { setDt({ date: dq.dataset.dq }); return; }
      const tq = e.target.closest("[data-tq]"); if (tq) { setDt({ time: tq.dataset.tq }); return; }
      const dd = e.target.closest("[data-dday]"); if (dd) { setDt({ day: dd.dataset.dday }); return; }
      const yq = e.target.closest("[data-yq]"); if (yq) { setDt({ year: +yq.dataset.yq }); return; }
      if (e.target.closest("[data-tm-use]") && o.onPick) { const thing = st.sh.k === "thing", shp = st.sh.k === "verb" ? null : { ...st.sh };
          const PO = POf(shp), ph = thing ? thingPhrase(st.sh) : phrase(o.word, PO);
          o.onPick({ tense: thing ? null : st.k, person: st.p, who: subjOf(st.p), when: thing ? "" : st.when, dt: thing ? null : st.dt,
          form: thing ? (st.sh.many ? PL(st.sh.w) : st.sh.w) : PO.imp || PO.pas ? ph : (() => { const X = Tense_vp(F, T(st.k), st.p, PO); return st.neg ? [NEG[X.aux] || X.aux + " not", X.rest].filter(Boolean).join(" ") : X.vp; })(),
          phrase: ph, shape: shp, neg: thing ? false : st.neg, q: thing ? false : PO.q, modal: thing ? "" : PO.modal, imp: thing ? false : PO.imp, tag: thing ? false : PO.tag, tagPr: PO.tagPr, pas: thing ? null : PO.pas, sty: thing ? "" : PO.sty, invA: PO.invA,
          grammar: thing ? [] : chipsOf(F, T(st.k), st.p, PO).map(c => c.k) }); } };
    el.oninput = e => { if (e.target.matches && e.target.matches("[data-pobj]")) { st.pas.obj = e.target.value; clearTimeout(st.pt); st.pt = setTimeout(() => { const pos = e.target.selectionStart; draw(false); const i2 = el.querySelector("[data-pobj]"); if (i2) { i2.focus(); try { i2.setSelectionRange(pos, pos); } catch (x) {} } }, 500); } };
    el.onchange = e => { const x = e.target, keep = st.dt && st.dt.kind === st.dk ? st.dt : {}, set = v => { st.dt = { kind: st.dk, ...keep, ...v }; draw(false); };
      if (x.matches("[data-dd]")) set({ date: x.value }); else if (x.matches("[data-dtm]")) set({ time: x.value }); else if (x.matches("[data-dy]") && +x.value > 0) set({ year: Math.round(+x.value) }); };
    el.onkeydown = e => { if (e.target.matches && e.target.matches("input")) return; if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return; const L = shown(), j = L.findIndex(t => t.k === st.k) + (e.key === "ArrowLeft" ? -1 : 1); if (L[j]) { e.preventDefault(); st.k = L[j].k; draw(true); el.querySelector(".tm-stop.on")?.focus(); } };
    draw(false);
    if (window.App && App.client) family(o.word).then(f => { st.fam = f; if (st.sh.k !== "verb" && !f[st.sh.k].some(x => x.w === st.sh.w)) st.sh = { k: "verb" }; if (el.isConnected) draw(false); });
  }
  const isVerb = v => !!v && ((v.tags || []).includes("Action") || (v.tags || []).includes("Phrasal verb"));
  // opts(): extra options, e.g. { tr: true } to show the translation (only when the page shows translations)
  function auto(get, opts) {
    const run = root => (root.querySelectorAll ? root : document).querySelectorAll("[data-tm]:not([data-tm-on])").forEach(el => { el.setAttribute("data-tm-on", "1"); const v = get(+el.dataset.tm); if (v) mount(el, { word: v, ...(opts ? opts() : {}) }); });
    run(document); new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => n.nodeType === 1 && run(n.parentNode || n)))).observe(document.body, { childList: true, subtree: true });
  }
  // ---- a clause with a fixed verb form, for joiners (if / when / unless): "it rains", "we would fly", "I had studied" ----
  // form: present | past | will | would | pastperf | wouldhave ; neg: true for "not" ; rest: words after the verb ("to school")
  function clause(o) {
    const p = o.person || "she", F = forms(o.word || "be"), base = F.base.split(" ")[0], tail = F.base.split(" ").slice(1).join(" "), isBe = base === "be";
    const T = x => [x, tail].filter(Boolean).join(" ");
    let v;
    if (isBe) {
      const pres = be(p), past = o.form === "past" && o.were ? "were" : was(p);
      v = { present: o.neg ? (pres === "am" ? "am not" : pres + "n't") : pres, past: o.neg ? past + "n't" : past, will: o.neg ? "won't be" : "will be", would: o.neg ? "wouldn't be" : "would be",
            pastperf: o.neg ? "hadn't been" : "had been", wouldhave: o.neg ? "wouldn't have been" : "would have been" }[o.form];
    } else {
      const s3 = one(p);
      v = { present: o.neg ? `${s3 ? "doesn't" : "don't"} ${T(base)}` : (s3 ? F.s : F.base), past: o.neg ? `didn't ${T(base)}` : F.past,
            will: `${o.neg ? "won't" : "will"} ${T(base)}`, would: `${o.neg ? "wouldn't" : "would"} ${T(base)}`,
            pastperf: `${o.neg ? "hadn't" : "had"} ${F.pp}`, wouldhave: `${o.neg ? "wouldn't" : "would"} have ${F.pp}` }[o.form];
    }
    const subj = subjOf(p), sj = PEOPLE.some(x => x[1] === subj) && subj !== "I" ? subj.toLowerCase() : subj;
    return [sj, v, (o.rest || "").trim()].filter(Boolean).join(" ");
  }
  window.Tense = { AN, PL, one, be, was, hv, NEG, css: () => addCss(), canPas, MODALS, chipsOf, clause, PEOPLE, reverse, family, famForms, dtWhen, NEED, PRON, RELS, prOf, phrase, subjOf, forms, say, allForms, mount, auto, isVerb, TENSES, IRR, LEMMA };
})();
