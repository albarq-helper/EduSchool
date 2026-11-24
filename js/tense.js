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
  const one = p => p === "he" || p === "she" || p === "it" || String(p).startsWith("c:");
  const be = p => p === "i" ? "am" : one(p) ? "is" : "are", was = p => p === "i" || one(p) ? "was" : "were", hv = p => one(p) ? "has" : "have";
  const subjOf = p => String(p).startsWith("c:") ? String(p).slice(2) : (PEOPLE.find(x => x[0] === p) || PEOPLE[3])[1];
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
  function phrase(word, o) {
    const F = forms(word), t = T(o.tense) || T("past"), p = o.person || "she", vp = t.f(F, p), base = F.base.split(" ")[0];
    const tail = F.base.split(" ").slice(1).join("\\s+");
    const re = new RegExp(`\\b(${[base, F.s, F.past, F.pp, F.ing].map(x => x.split(" ")[0]).join("|")})\\b${tail ? `(\\s+${tail})?` : ""}`, "i");
    // "always", "never", "already", "just"… sit inside the verb: "has never given up", "always lies"
    const w = o.when || "", mid = MID.has(w.toLowerCase()), parts = vp.split(" ");
    let v2 = !mid ? vp : parts.length > 1 && /^(am|is|are|was|were|has|have|had|will)$/.test(parts[0]) ? [parts[0], w, ...parts.slice(1)].join(" ") : `${w} ${vp}`;
    let verb = v2; const extra = [];
    (o.partners || []).forEach(x => { if (re.test(x) && verb === v2) verb = x.replace(re, v2); else extra.push(x); });
    return [subjOf(p), verb, ...extra, mid ? "" : w].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
  }
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
.tm-line{position:relative;padding:26px 8px 8px}
.tm-zones{position:absolute;left:8px;right:8px;top:0;display:grid;font:800 .7rem var(--f-body,system-ui);letter-spacing:.08em;color:#64748b;text-align:center}
.tm-track{position:relative;height:10px;border-radius:999px;background:linear-gradient(90deg,#c7d2fe,#a5b4fc 45%,#fde68a 50%,#86efac 55%,#bbf7d0)}
.tm-now{position:absolute;top:-8px;width:3px;height:26px;background:#f59e0b;border-radius:2px}
.tm-nowl{position:absolute;top:-24px;transform:translateX(-50%);font:900 .68rem var(--f-body,system-ui);color:#b45309;letter-spacing:.08em}
.tm-stops{position:relative;height:44px;margin-top:-26px}
.tm-stop{position:absolute;transform:translateX(-50%);display:grid;place-items:center;width:38px;height:38px;border-radius:50%;border:2px solid #fff;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.18);font-size:1.05rem;cursor:pointer;transition:transform .35s cubic-bezier(.34,1.56,.64,1),background .2s}
.tm-stop:hover{transform:translateX(-50%) scale(1.12)}.tm-stop.on{background:#4338ca;transform:translateX(-50%) scale(1.25);box-shadow:0 0 0 4px rgba(67,56,202,.25)}
.tm-say{display:grid;gap:3px;text-align:center;animation:tmIn .35s ease both}
@keyframes tmIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.tm-say .s{font:800 1.5rem/1.2 var(--f-display,system-ui);color:#1e1b4b}.tm-say .s b{color:#4338ca;background:#e0e7ff;border-radius:8px;padding:0 5px;margin-right:1px}
.tm-say .n{font:800 .8rem var(--f-body,system-ui);color:#4338ca;text-transform:uppercase;letter-spacing:.06em}.tm-say .wh{font-size:.9rem;color:#475569}
.tm-ex{display:grid;gap:6px;text-align:left;background:#fff;border:1px solid #e0e7ff;border-radius:12px;padding:8px 10px;margin-top:4px}
.tm-need{justify-self:start;font:800 .8rem var(--f-body,system-ui);border-radius:999px;padding:2px 10px}
.tm-sig{display:flex;flex-wrap:wrap;gap:5px}.tm-w{border:1.5px dashed #a5b4fc;background:#eef2ff;color:#3730a3;border-radius:999px;padding:2px 9px;font:700 .8rem var(--f-body,system-ui);cursor:default}
.tm-w.add{cursor:pointer;border-style:solid}.tm-w.add:hover{border-color:#4338ca}.tm-w.on{background:#4338ca;color:#fff;border-color:#4338ca}
.tm-sig .lab,.tm-who .lab{font:800 .72rem var(--f-body,system-ui);color:#64748b;align-self:center;padding:0 4px}
.tm-nav .use[disabled]{background:#e0e7ff;color:#6366f1;border-color:#c7d2fe;cursor:not-allowed}
.tm-ex ul{margin:0;padding-left:2px;list-style:none;display:grid;gap:3px;font-size:.93rem}.tm-ex li b{color:#4338ca}.tm-ex li.bad{color:#9a3412}.tm-ex li.bad small{color:#9a3412}
.tm-nav{display:flex;justify-content:center;gap:8px}.tm-nav button{border:1.5px solid #c7d2fe;background:#fff;border-radius:999px;padding:5px 12px;font:800 .85rem var(--f-body,system-ui);cursor:pointer;color:#3730a3}
.tm-nav .use{background:#4338ca;color:#fff;border-color:#4338ca}
@media (prefers-reduced-motion:reduce){.tm-stop,.tm-say{transition:none;animation:none}}`;
  const addCss = () => { if (!document.getElementById("tense-css")) { const s = document.createElement("style"); s.id = "tense-css"; s.textContent = css; document.head.appendChild(s); } };
  // the examples: when a time word is needed, which ones go with it, and a common mistake
  function examples(t, F, st, subj) {
    const N = NEED[t.need], x = t.f(F, st.p), cap = w => w.charAt(0).toUpperCase() + w.slice(1), S = st.p === "i" || String(st.p).startsWith("c:") ? subj : subj.toLowerCase();
    const hi = line => esc(cap(line)).replace(/\[\[(.+?)\]\]/g, "<b>$1</b>");
    return `<div class="tm-ex"><span class="tm-need" style="color:${N[2]};background:${N[3]}">${N[0]} ${N[1]}: ${esc(t.needTxt)}</span>
      <div class="tm-sig"><span class="lab">${t.need === "no" ? "Time words (not needed):" : "Pick a time word:"}</span>${t.sig.map(w => `<button type="button" class="tm-w add${st.when === w ? " on" : ""}" data-tw="${esc(w)}" aria-pressed="${st.when === w}">${st.when === w ? "✓ " : ""}${esc(w)}</button>`).join("")}</div>
      <ul>${t.ex.map(f => `<li>✅ ${hi(f(S, x, F, st.p))}</li>`).join("")}${t.bad ? `<li class="bad">❌ <s>${hi(t.bad(S, x, F, st.p))}</s> <small>(not with an exact past time: use "${esc(TENSES.find(y => y.k === "past").f(F, st.p))}" for that)</small></li>` : ""}</ul></div>`;
  }
  function mount(el, o) {
    addCss();
    const F = forms(o.word), st = { k: o.tense || "past", p: o.person || "she", d: depth(), when: o.when || "" };
    const people = [...(o.cast || []).filter(c => c && c.name).map(c => ["c:" + c.name, (c.emoji ? c.emoji + " " : "") + c.name]), ...PEOPLE];
    const shown = () => TENSES.filter(t => t.lv <= st.d);
    function draw(anim) {
      const L = shown(); if (!L.some(t => t.k === st.k)) st.k = L.find(t => t.k === "past") ? "past" : L[0].k;
      const t = T(st.k), j = L.indexOf(t), pos = n => L.length === 1 ? 50 : 6 + n * 88 / (L.length - 1);
      const nowAt = (() => { const a = L.findIndex(x => x.z === "now"), b = L.length - 1 - [...L].reverse().findIndex(x => x.z === "now"); return a < 0 ? 50 : (pos(a) + pos(b)) / 2; })();
      if (st.when && !t.sig.includes(st.when)) st.when = "";
      const subj = subjOf(st.p), vp = t.f(F, st.p), full = phrase(o.word, { tense: st.k, person: st.p, when: st.when, partners: o.partners });
      const needWhen = t.need === "yes" && !st.when, shown2 = esc(full).replace(esc(vp), `<b>${esc(vp)}</b>`);
      el.innerHTML = `<div class="tm" role="group" aria-label="Verb time line for ${esc(F.word)}">
        <div class="tm-top"><div class="tm-forms">${[["Base", F.base], ["He/she", F.s], ["Past", F.past], ["Past participle", F.pp], ["-ing", F.ing]].map(([l, x], n) => `<span class="${F.irregular && (n === 2 || n === 3) ? "irr" : ""}"><small>${l}</small>${esc(x)}</span>`).join("")}</div>
          <div class="tm-seg tm-who" role="group" aria-label="Who does it?"><span class="lab">Who?</span>${people.map(([k, l]) => `<button type="button" data-tp="${esc(k)}" aria-pressed="${k === st.p}">${esc(l)}</button>`).join("")}</div></div>
        ${F.irregular ? `<small style="color:#b45309;font-weight:800">⚡ Irregular verb: its past is not "-ed"</small>` : ""}
        <div class="tm-line"><div class="tm-zones" style="grid-template-columns:${nowAt}% ${100 - nowAt}%"><span style="text-align:left">⏮ PAST</span><span style="text-align:right">FUTURE ⏭</span></div>
          <div class="tm-track"><div class="tm-now" style="left:calc(${nowAt}% - 1px)" title="Now"></div><span class="tm-nowl" style="left:${nowAt}%">NOW</span></div>
          <div class="tm-stops">${L.map((x, n) => `<button type="button" class="tm-stop${x.k === st.k ? " on" : ""}" style="left:${pos(n)}%" data-tk="${x.k}" title="${esc(x.name)}: ${esc(x.f(F, st.p))}" aria-label="${esc(x.name)}" aria-pressed="${x.k === st.k}">${x.ico}</button>`).join("")}</div></div>
        <div class="tm-say"${anim ? "" : ' style="animation:none"'}><span class="n">${esc(t.name)} · ${t.z === "now" ? "now" : t.z}</span><span class="s">${shown2}.</span>${o.partners && o.partners.length ? `<span class="wh">✨ With your partner words: ${esc(o.partners.join(", "))}</span>` : ""}<span class="wh">${esc(t.when)}</span>${examples(t, F, st, subj)}${STATIVE.has(F.base.split(" ")[0]) && /ing\b/.test(vp) && !/going to/.test(vp) ? `<span class="wh" style="color:#b45309;font-weight:700">⚠️ "${esc(F.base)}" is a thinking or feeling word. We usually don't use it with "-ing": say "${esc(TENSES.find(x => x.k === (t.z === "past" ? "past" : t.z === "future" ? "future" : "present")).f(F, st.p))}" instead.</span>` : ""}</div>
        <div class="tm-nav"><button type="button" data-tm-step="-1" ${j === 0 ? "disabled" : ""}>◀ Earlier</button>${o.onPick ? (needWhen ? `<button type="button" class="use" disabled title="This time needs a time word">⏰ Choose a time word first</button>` : `<button type="button" class="use" data-tm-use="1">Use "${esc(full)}"</button>`) : `<button type="button" data-tm-hear="1">🔊 Hear</button>`}<button type="button" data-tm-step="1" ${j === L.length - 1 ? "disabled" : ""}>Later ▶</button></div>
        <div class="tm-seg" role="group" aria-label="How many times" style="justify-self:center">${[[1, "⭐ 3 times"], [2, "⭐⭐ 7 times"], [3, "⭐⭐⭐ all 12"]].map(([d, l]) => `<button type="button" data-td="${d}" aria-pressed="${d === st.d}">${l}</button>`).join("")}</div></div>`;
    }
    el.onclick = e => { const k = e.target.closest("[data-tk]"); if (k) { st.k = k.dataset.tk; draw(true); return; }
      const p = e.target.closest("[data-tp]"); if (p) { st.p = p.dataset.tp; draw(false); return; }
      const d = e.target.closest("[data-td]"); if (d) { st.d = +d.dataset.td; try { localStorage.setItem("tenseDepth", st.d); } catch (x) {} draw(false); return; }
      const s = e.target.closest("[data-tm-step]"); if (s) { const L = shown(), j = L.findIndex(t => t.k === st.k) + +s.dataset.tmStep; if (L[j]) { st.k = L[j].k; draw(true); } return; }
      if (e.target.closest("[data-tm-hear]")) { try { const u = new SpeechSynthesisUtterance(phrase(o.word, { tense: st.k, person: st.p, when: st.when, partners: o.partners })); u.lang = "en-US"; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (x) {} return; }
      const tw = e.target.closest("[data-tw]"); if (tw) { st.when = st.when === tw.dataset.tw ? "" : tw.dataset.tw; draw(false); return; }
      if (e.target.closest("[data-tm-use]") && o.onPick) o.onPick({ tense: st.k, person: st.p, who: subjOf(st.p), when: st.when, form: T(st.k).f(F, st.p), phrase: phrase(o.word, { tense: st.k, person: st.p, when: st.when, partners: o.partners }) }); };
    el.onkeydown = e => { if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return; const L = shown(), j = L.findIndex(t => t.k === st.k) + (e.key === "ArrowLeft" ? -1 : 1); if (L[j]) { e.preventDefault(); st.k = L[j].k; draw(true); el.querySelector(".tm-stop.on")?.focus(); } };
    draw(false);
  }
  const isVerb = v => !!v && ((v.tags || []).includes("Action") || (v.tags || []).includes("Phrasal verb"));
  function auto(get) {
    const run = root => (root.querySelectorAll ? root : document).querySelectorAll("[data-tm]:not([data-tm-on])").forEach(el => { el.setAttribute("data-tm-on", "1"); const v = get(+el.dataset.tm); if (v) mount(el, { word: v }); });
    run(document); new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => n.nodeType === 1 && run(n.parentNode || n)))).observe(document.body, { childList: true, subtree: true });
  }
  window.Tense = { NEED, phrase, subjOf, forms, say, allForms, mount, auto, isVerb, TENSES, IRR, LEMMA };
})();
