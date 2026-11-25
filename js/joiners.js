// 🔗 Joiners: either … or, neither … nor, both … and, not only … but also, lists (A, B and C), and if / when / unless.
// A joiner block in a story: {k:"j", t:type, s:[slots], end:"and"|"or", ox:bool, c:"if"|"when"|…, lv:"zero"|…, mf:bool}
//   word slot {w: dictionary word, t: own text} · sentence slot (if/when) {who, v: verb, rest, neg}
(function () {
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const clean = w => String(w || "").replace(/\s*\(.*\)/, "").trim();
  const TYPES = {
    list:    { i: "📋", name: "list: A, B and C", age: 6, kind: "list", tip: "Commas between the words, and \"and\" (or \"or\") before the last one." },
    either:  { i: "🔀", name: "either … or", age: 7, parts: ["either", "or"], tip: "One of the two, not both." },
    both:    { i: "🤝", name: "both … and", age: 7, parts: ["both", "and"], tip: "The two of them together." },
    neither: { i: "🚫", name: "neither … nor", age: 9, parts: ["neither", "nor"], tip: "Not this one and not that one. The verb after it matches the nearer word: \"Neither Mia nor her friends are late.\"" },
    notonly: { i: "➕", name: "not only … but also", age: 10, parts: ["not only", "but also"], tip: "The second part is even more surprising than the first." },
    cond:    { i: "❓", name: "if / when / unless", age: 8, kind: "cond", tip: "Two small sentences: the condition and what happens." },
    rel:     { i: "👉", name: "who / which / that", age: 9, kind: "rel", tip: "Say which one you mean: who for people, which for things, that for both.", ar: "‏who للأشخاص و which للأشياء و that للاثنين، لتحديد من أو ما نقصد." },
    vv:      { i: "🔗", name: "verb + verb (enjoy reading, want to read)", age: 9, kind: "vv", tip: "Some verbs are followed by -ing (enjoy, finish, stop, avoid), some by to (want, decide, hope, need), some by both (like, love, start).", ar: "‏بعض الأفعال يأتي بعدها الفعل بـ ing مثل enjoy، وبعضها بـ to مثل want، وبعضها بالاثنين مثل like." },
    so:      { i: "💥", name: "so … that / such … that", age: 10, kind: "so", tip: "so + describing word; such + a describing word + a thing. Then that + what happened because of it.", ar: "‏so + صفة، و such + a + صفة + اسم، ثم that + النتيجة." },
    wish:    { i: "🌠", name: "I wish / If only", age: 10, kind: "wish", tip: "A wish about now goes one step back in time (I wish I had a dog). A wish about the past uses had + done (I wish I had studied).", ar: "‏التمني عن الحاضر نرجع فيه خطوة للماضي، وعن الماضي نستخدم had + التصريف الثالث." },
  };
  // verb + verb: which second form?
  const VV_ING = new Set("enjoy finish stop mind avoid keep practise practice miss imagine consider suggest admit deny quit risk dislike".split(" "));
  const VV_BOTH = new Set("like love hate start begin prefer continue".split(" "));
  const vvKind = v => { const b = clean(v).toLowerCase().split(" ")[0]; return VV_ING.has(b) ? "ing" : VV_BOTH.has(b) ? "both" : "to"; };
  // how real is it? each stop fixes the verb forms of both parts
  const LV = [
    { k: "zero", i: "✅", name: "Always true", age: 8, f: ["present", "present"], ex: "If you heat ice, it melts.", tip: "Always true, like a science fact. Here \"if\" and \"when\" mean the same." },
    { k: "first", i: "🌦️", name: "Might happen", age: 8, f: ["present", "will"], ex: "If it rains, we will stay home.", tip: "It might really happen. After \"if\", use the present (not \"will\"); in the other part, use \"will\"." },
    { k: "second", i: "🦄", name: "Imaginary now", age: 10, f: ["past", "would"], ex: "If I had wings, I would fly.", tip: "Not real now, just imagined. Past after \"if\", \"would\" in the other part. With \"be\", say \"were\": If I were a bird…" },
    { k: "third", i: "⏪", name: "Imaginary past", age: 10, f: ["pastperf", "wouldhave"], ex: "If I had studied, I would have passed.", tip: "It didn't happen, and it can't change now. \"had + done\" after \"if\", \"would have + done\" in the other part." },
    { k: "mixed", i: "🔀", name: "Past → now", age: 10, f: ["pastperf", "would"], ex: "If I had slept, I wouldn't be tired now.", tip: "An imagined past with a result now." },
  ];
  const CONJ = [
    { k: "if", name: "if", age: 8, tip: "If = maybe it happens." },
    { k: "when", name: "when", age: 8, real: 1, tip: "When = you are sure it will happen (When Dad comes home, we'll eat)." },
    { k: "unless", name: "unless", age: 10, tip: "Unless = if … not (Unless it rains = If it doesn't rain). Don't add another \"not\" after it." },
    { k: "as soon as", name: "as soon as", age: 10, real: 1, tip: "As soon as = right at the moment it happens." },
    { k: "in case", name: "in case", age: 10, real: 1, tip: "In case = to be ready if it happens (Take a coat in case it rains)." },
  ];
  const age = () => { try { const p = App.profile || {}; if (p.role === "teacher" || p.is_admin) return 99; const b = p.birth_date; if (!b) return 10;
    const d = new Date(b), n = new Date(); let a = n.getFullYear() - d.getFullYear(); if (n < new Date(n.getFullYear(), d.getMonth(), d.getDate())) a--; return a; } catch (e) { return 10; } };
  function make(t) {
    const T = TYPES[t]; if (!T) return null;
    if (T.kind === "list") return { k: "j", t, s: [{}, {}, {}], end: "and" };
    if (T.kind === "cond") return { k: "j", t, c: "if", lv: "first", s: [{ who: "it" }, { who: "we" }] };
    if (T.kind === "rel") return { k: "j", t, f: "past", s: [{}, { cl: 1, who: "" }] };
    if (T.kind === "vv") return { k: "j", t, f: "present", s: [{ cl: 1, who: "i" }, { cl: 1, two: 1 }] };
    if (T.kind === "so") return { k: "j", t, f: "past", su: "so", who0: "it", noun: "", s: [{}, { cl: 1, who: "we" }] };
    if (T.kind === "wish") return { k: "j", t, wt: "now", s: [{ cl: 1, who: "i" }] };
    return { k: "j", t, s: [{}, {}] };
  }
  // a word in a slot, as it reads in a sentence ("a cake", "the moon", "Rover"); x.a = "a" (a/an by sound) | "the" | "" (nothing)
  const AN = w => /^(hour|honou?r|honest|heir)/i.test(w) ? "an" : /^(uni|use|usu|eu|one|once|u[bcfhjklmnpqrstvwxyz][aeiou])/i.test(w) && !/^un[^i]/i.test(w) ? "a" : /^[aeiou]/i.test(w) ? "an" : "a";
  const artOf = (x, w) => x && x.a === "a" ? AN(w) : x && x.a === "the" ? "the" : "";
  const isName = (w, names) => (names || []).some(n => n.toLowerCase() === w.toLowerCase()) || w === "I";
  const wordOf = (x, names, bare) => { if (!x) return ""; if (x.t) return x.t.trim(); const w = clean(x.w); if (!w) return "";
    const ww = isName(w, names) ? w : w.charAt(0).toLowerCase() + w.slice(1), a = !bare && !isName(w, names) ? artOf(x, ww) : "";
    return a ? a + " " + ww : ww; };
  // can this slot take a / an / the? (story.html sets Joiners.isNoun from the dictionary: naming words only)
  const canArt = (x, names) => !!(x && x.w && !x.t && !isName(clean(x.w), names) && api.isNoun && api.isNoun(x.w));
  const filled = x => !!(x && ((x.w || x.t || "").trim() || x.v));
  const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  // who / which / that: chosen, or guessed (people → who, things → which); commas never take "that"
  function relOf(b, names) { const x = b.s[0] || {}, w = clean(x.w || x.t || ""), person = isName(w, names) || (api.isPerson && x.w && api.isPerson(x.w));
    let r = b.rp || (person ? "who" : "which"); if (b.nd && r === "that") r = person ? "who" : "which"; return r; }
  function lvOf(b) { const L = LV.find(x => x.k === b.lv) || LV[1]; const C = CONJ.find(x => x.k === b.c) || CONJ[0]; return C.real && !["zero", "first"].includes(L.k) ? LV[1] : L; }
  function clauseText(x, form, were) {
    if (!x || !x.v) return x && (x.rest || "").trim() ? `${(x.rest || "").trim()}` : "…";
    return Tense.clause({ word: x.v, person: x.who || "she", form, neg: !!x.neg, rest: x.rest || "", were });
  }
  // the finished words, as she will read them
  function text(b, names) {
    const T = TYPES[b.t]; if (!T) return "";
    if (T.kind === "list") { const xs = (b.s || []).map(x => wordOf(x, names)).filter(Boolean); if (!xs.length) return "";
      if (xs.length === 1) return xs[0]; const last = xs.pop(); return `${xs.join(", ")}${b.ox && xs.length > 1 ? "," : ""} ${b.end || "and"} ${last}`; }
    if (T.kind === "cond") { const L = lvOf(b), c = (CONJ.find(x => x.k === b.c) || CONJ[0]).k;
      const a = clauseText(b.s[0], L.f[0], true), m = clauseText(b.s[1], L.f[1]);
      return b.mf ? `${cap(m)} ${c} ${a}.` : `${cap(c)} ${a}, ${m}.`; }
    if (T.kind === "rel") { const x0 = b.s[0] || {}, bare = wordOf(x0, names, true), np = !bare ? "…" : b.many && !isName(bare, names) ? [x0.a === "the" ? "the" : "", Tense.PL(bare)].filter(Boolean).join(" ") : wordOf(x0, names), x = b.s[1] || {}, rp = relOf(b, names), f = b.f || "past";
      let cl = "…";
      if (x.v) { if (x.who) cl = Tense.clause({ word: x.v, person: x.who, form: f, neg: !!x.neg, rest: x.rest || "" });
        else { const one = !b.many; cl = Tense.clause({ word: x.v, person: one ? "it" : "they", form: f, neg: !!x.neg, rest: x.rest || "" }).replace(/^(it|they)\s+/i, ""); } }
      const r2 = x.who && b.drop && !b.nd ? "" : rp + " ";
      return b.nd ? `${np}, ${r2}${cl},` : `${np} ${r2}${cl}`; }
    if (T.kind === "wish") { const x = b.s[0] || {}, f = { now: "past", past: "pastperf", would: "would" }[b.wt || "now"];
      return `${b.io ? "If only" : "I wish"} ${clauseText(x, f, true)}${b.io ? "!" : "."}`; }
    if (T.kind === "vv") { const x = b.s[0] || {}, y = b.s[1] || {};
      const main = x.v ? Tense.clause({ word: x.v, person: x.who || "i", form: b.f || "present", neg: !!x.neg, rest: "" }) : "…";
      const k2 = x.v ? vvKind(x.v) : "to", useIng = k2 === "ing" || (k2 === "both" && b.vp === "ing"), F2 = y.v ? Tense.forms(y.v) : null;
      const sec = F2 ? (useIng ? F2.ing : "to " + F2.base) : "…";
      return `${cap(main)} ${sec}${(y.rest || "").trim() ? " " + y.rest.trim() : ""}.`; }
    if (T.kind === "so") { const adj = (wordOf(b.s[0], names, true) || "…").toLowerCase(), x = b.s[1] || {}, f = b.f || "past", p = b.who0 || "it";
      const one = Tense.one(p), be = { past: p === "i" || one ? "was" : "were", present: p === "i" ? "am" : one ? "is" : "are", will: "will be" }[f] || "was";
      const S = Tense.subjOf(p), mid = b.su === "such" ? `such ${AN(adj)} ${adj} ${(b.noun || "day").trim()}` : `so ${adj}`;
      return `${cap(S === "I" ? "I" : S.toLowerCase())} ${be} ${mid} that ${clauseText(x, f === "will" ? "will" : f)}.`; }
    const [p1, p2] = T.parts, a = wordOf(b.s[0], names) || "…", z = wordOf(b.s[1], names) || "…";
    return `${p1} ${a} ${p2} ${z}`;
  }
  const slotDone = (b, x) => x && (x.cl || TYPES[b.t].kind === "cond" ? !!x.v : filled(x));
  const complete = b => { const T = TYPES[b.t]; if (!T) return false; if (T.kind === "list") return (b.s || []).filter(filled).length >= 2; return (b.s || []).every(x => slotDone(b, x)); };
  const label = b => { const T = TYPES[b.t]; if (!T) return ""; if (T.kind === "cond") { const L = lvOf(b); return `${b.c || "if"} · ${L.name.toLowerCase()}`; } return T.name; };
  const words = b => (b.s || []).flatMap(x => [x.w, x.v]).filter(Boolean);
  // the next slot that still needs something
  const nextEmpty = (b, from) => { const s = b.s || []; for (let n = from + 1; n < s.length; n++) if (!slotDone(b, s[n])) return n; return -1; };
  // ---- the frame on the story board ----
  const css = `
.jbox{display:grid;gap:6px;flex:1;min-width:0}.jhd{display:flex;flex-wrap:wrap;gap:6px;align-items:center;font:800 .9rem var(--f-body,system-ui)}
.jhd .jt{background:#ede9fe;color:#5b21b6;border-radius:999px;padding:2px 10px}
.jslots{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.jw{font:800 .95rem var(--f-body,system-ui);color:#6d28d9}
.jslot{display:inline-flex;align-items:center;gap:4px;border:2px dashed #c4b5fd;background:#faf5ff;border-radius:12px;padding:4px 10px;font:700 .92rem var(--f-body,system-ui);cursor:pointer;color:#1e1b4b;min-height:34px}
.jslot.full{border-style:solid;border-color:#a78bfa;background:#fff}.jslot.act{border-color:#7c3aed;box-shadow:0 0 0 4px #ddd6fe;animation:jglow 1.4s ease-in-out infinite}
@keyframes jglow{50%{box-shadow:0 0 0 7px #ede9fe}}
.jart{border:1px dashed #a78bfa;background:#fff;color:#7c3aed;border-radius:8px;font:700 .78rem var(--f-body,system-ui);padding:1px 6px;margin-right:4px;cursor:pointer}.jart.on{border-style:solid;background:#ede9fe;font-size:.9rem}
.jx{border:0;background:none;color:#94a3b8;cursor:pointer;font-size:.8rem;padding:0 2px}.jslot .ph{color:#7c3aed;font-weight:700}
.jcl{display:flex;flex-wrap:wrap;gap:5px;align-items:center;border:2px dashed #c4b5fd;background:#faf5ff;border-radius:12px;padding:5px 8px;cursor:pointer}
.jcl.act{border-color:#7c3aed;box-shadow:0 0 0 4px #ddd6fe}.jcl.full{border-style:solid;border-color:#a78bfa;background:#fff}
.jcl select,.jcl input{font:700 .88rem var(--f-body,system-ui);border:1.5px solid #ddd6fe;border-radius:8px;padding:3px 6px;background:#fff;color:#1e1b4b}.jcl input:not([type]){width:9em}.jcl input[type=checkbox]{width:auto;margin:0}
.jcl .jv{font:800 .92rem var(--f-body,system-ui);color:#6d28d9}.jcl label{font:700 .78rem var(--f-body,system-ui);color:#64748b;display:inline-flex;gap:3px;align-items:center}
.jseg{display:flex;flex-wrap:wrap;gap:4px}.jseg button{border:1.5px solid #ddd6fe;background:#fff;border-radius:999px;padding:3px 9px;font:800 .78rem var(--f-body,system-ui);cursor:pointer;color:#1e1b4b}
.jseg button[aria-pressed=true]{background:#7c3aed;border-color:#7c3aed;color:#fff}
.jout{font:800 1.02rem var(--f-display,system-ui);color:#1e1b4b;background:#f5f3ff;border-radius:10px;padding:5px 10px}.jtip{font-size:.82rem;color:#6d28d9}.jtip.warn{color:#b45309;font-weight:700}
.jmenu{position:absolute;z-index:40;background:var(--sheet,#fff);border:1.5px solid var(--rule,#e2e8f0);border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,.15);padding:8px;display:grid;gap:4px;min-width:250px}
.jmenu button{all:unset;cursor:pointer;padding:7px 10px;border-radius:10px;font:700 .92rem var(--f-body,system-ui);display:grid}.jmenu button:hover{background:#f5f3ff}.jmenu small{color:#64748b;font-weight:600}`;
  const addCss = () => { if (!document.getElementById("joiners-css")) { const s = document.createElement("style"); s.id = "joiners-css"; s.textContent = css; document.head.appendChild(s); } };
  function whoSel(k, n, x, cast, none, attr) {
    const opts = [...(none ? [["", none]] : []), ...cast.map(c => ["c:" + c, c]), ...Tense.PEOPLE.map(([v, l]) => [v, l === "I" ? "I" : l.toLowerCase()])];
    return `<select ${attr || `data-jwho="${k}|${n}"`} aria-label="Who">${opts.map(([v, l]) => `<option value="${esc(v)}"${(x.who || "") === v ? " selected" : ""}>${esc(l)}</option>`).join("")}</select>`;
  }
  // act = [k, n] the glowing slot; cast = character names
  function frame(b, k, act, cast) {
    addCss(); const T = TYPES[b.t]; if (!T) return "";
    const on = n => act && act[0] === k && act[1] === n, A = age();
    const wslot = (x, n) => `<span class="jslot${filled(x) ? " full" : ""}${on(n) ? " act" : ""}" data-jslot="${k}|${n}" role="button" tabindex="0" title="Tap, then pick a word on the left">${filled(x) ? `${canArt(x, cast) ? `<button type="button" class="jart${x.a ? " on" : ""}" data-jart="${k}|${n}" title="${x.a ? "Tap to change: a/an → the → nothing" : "Does it need a, an or the? Tap to add"}">${x.a ? esc(artOf(x, wordOf(x, cast, true))) : "＋a/the"}</button>` : ""}${esc(wordOf(x, cast, true))}<button type="button" class="jx" data-jx="${k}|${n}" aria-label="Empty this box">✕</button>` : `<span class="ph">⬚ ${on(n) ? "pick a word" : "tap here"}</span>`}</span>`;
    let body = "", ctl = "", tip = T.tip, warn = "";
    const seg = (key, opts, cur) => `<span class="jseg">${opts.map(([v, l, t2]) => `<button type="button" data-jopt="${k}|${key}|${v}" aria-pressed="${cur === v}"${t2 ? ` title="${esc(t2)}"` : ""}>${l}</button>`).join("")}</span>`;
    const tog = (key, l, t2) => `<button type="button" data-jopt="${k}|${key}|!" aria-pressed="${!!b[key]}"${t2 ? ` title="${esc(t2)}"` : ""}>${l}</button>`;
    const TIMES = [["past", "⬅️ past"], ["present", "🔄 now"], ["will", "➡️ future"]];
    const clSlot = (x, n, lab, o2) => { o2 = o2 || {}; return `<span class="jcl${x.v ? " full" : ""}${on(n) ? " act" : ""}" data-jslot="${k}|${n}" title="Tap, then pick a doing word on the left">
        ${lab ? `<small class="jw">${esc(lab)}</small>` : ""}${o2.noWho ? "" : whoSel(k, n, x, cast, o2.whoNone)}${x.v ? `<span class="jv">${esc(clean(x.v).toLowerCase())}</span><button type="button" class="jx" data-jx="${k}|${n}" aria-label="Take away the verb">✕</button>` : `<span class="ph" style="color:#7c3aed;font-weight:700">⬚ ${on(n) ? "pick a doing word" : "doing word"}</span>`}
        <input data-jrest="${k}|${n}" value="${esc(x.rest || "")}" placeholder="+ more words" aria-label="More words">${o2.noNeg ? "" : `<label><input type="checkbox" data-jneg="${k}|${n}"${x.neg ? " checked" : ""}> not</label>`}</span>`; };
    if (T.kind === "list") {
      body = (b.s || []).map((x, n) => (n ? `<span class="jw">${n === b.s.length - 1 ? esc(b.end || "and") : ","}</span>` : "") + wslot(x, n)).join("") + (b.s.length < 8 ? `<button type="button" class="jslot" data-jadd="${k}" title="One more">＋</button>` : "");
      ctl = `<span class="jseg">${["and", "or"].map(e => `<button type="button" data-jend="${k}|${e}" aria-pressed="${(b.end || "and") === e}">… ${e} last</button>`).join("")}${A >= 10 ? `<button type="button" data-jox="${k}" aria-pressed="${!!b.ox}" title="A comma before and / or">Oxford comma</button>` : ""}</span>`;
    } else if (T.kind === "cond") {
      const L = lvOf(b), C = CONJ.find(x => x.k === b.c) || CONJ[0];
      if (C.real && b.lv && !["zero", "first"].includes(b.lv)) warn = `"${C.name}" is for real things; for imagined ones use "if".`;
      if (C.k === "unless" && b.s[0] && b.s[0].neg) warn = `"Unless" already means "if not": take away the "not".`;
      const cl = (x, n, lab) => `<span class="jcl${x.v ? " full" : ""}${on(n) ? " act" : ""}" data-jslot="${k}|${n}" title="Tap, then pick a doing word on the left">
        <small class="jw">${lab}</small>${whoSel(k, n, x, cast)}${x.v ? `<span class="jv">${esc(clean(x.v).toLowerCase())}</span><button type="button" class="jx" data-jx="${k}|${n}" aria-label="Take away the verb">✕</button>` : `<span class="ph" style="color:#7c3aed;font-weight:700">⬚ ${on(n) ? "pick a doing word" : "doing word"}</span>`}
        <input data-jrest="${k}|${n}" value="${esc(x.rest || "")}" placeholder="+ more words" aria-label="More words"><label><input type="checkbox" data-jneg="${k}|${n}"${x.neg ? " checked" : ""}> not</label></span>`;
      const first = cl(b.s[0], 0, b.mf ? C.name : cap(C.name)), main = cl(b.s[1], 1, b.mf ? "" : "then");
      body = b.mf ? main + first : first + main;
      ctl = `<span class="jseg">${CONJ.filter(x => x.age <= A).map(x => `<button type="button" data-jc="${k}|${x.k}" aria-pressed="${C.k === x.k}">${esc(x.name)}</button>`).join("")}</span>
        <span class="jseg" title="How real is it?">${LV.filter(x => x.age <= A && (!C.real || ["zero", "first"].includes(x.k))).map(x => `<button type="button" data-jlv="${k}|${x.k}" aria-pressed="${L.k === x.k}" title="${esc(x.ex)}">${x.i} ${esc(x.name)}</button>`).join("")}</span>
        <span class="jseg"><button type="button" data-jmf="${k}" aria-pressed="${!!b.mf}" title="Put the ${esc(C.name)} part second">⇄ ${b.mf ? `${C.name} part last` : `${C.name} part first`}</button></span>`;
      tip = `${L.tip} ${C.tip}`;
    } else if (T.kind === "rel") {
      const rp = relOf(b, cast), x = b.s[0] || {}, objRel = !!(b.s[1] && b.s[1].who), person = isName(clean(x.w || ""), cast) || (api.isPerson && x.w && api.isPerson(x.w));
      body = wslot(b.s[0], 0) + (b.nd ? `<span class="jw">,</span>` : "") + clSlot(b.s[1], 1, objRel && b.drop && !b.nd ? "(that)" : rp, { whoNone: "— (it / they do it)" });
      ctl = seg("rp", [["who", "who", "for people"], ["which", "which", "for things"], ["that", "that", "people and things"]], b.rp || rp)
        + `<span class="jseg">${tog("nd", "⸴ extra info", "Extra information between commas")}${objRel && !b.nd ? tog("drop", `leave out ${rp}`) : ""}${tog("many", "👥 many")}</span>` + seg("f", TIMES, b.f || "past");
      if (b.rp === "who" && x.w && !person) warn = "who is for people. For things, use which or that.";
      if (b.rp === "which" && person) warn = "which is for things. For people, use who or that.";
      if (b.nd && b.rp === "that") warn = "With commas (extra information), use who or which, never that.";
      tip = b.nd ? "Extra information between commas: the sentence still works without it (Rover, who loves bones, ran home)." : objRel ? "Someone else does the action (the book that I read): you can leave out that." : T.tip;
    } else if (T.kind === "wish") {
      const x = b.s[0] || {}; body = `<span class="jw">${b.io ? "If only" : "I wish"}</span>` + clSlot(x, 0, "");
      ctl = `<span class="jseg">${tog("io", "If only", "Stronger than I wish")}</span>` + seg("wt", [["now", "😔 about now"], ["past", "⏪ about the past"], ["would", "🙄 please stop (would)"]], b.wt || "now");
      tip = { now: "About now: one step back in time. I wish I had a dog. I wish it were Friday.", past: "About the past: had + done. I wish I had listened.", would: "To complain about what someone keeps doing: I wish you would stop! (Not about yourself.)" }[b.wt || "now"];
      if (b.wt === "would" && (x.who || "i") === "i") warn = "Use would for other people (I wish you would…), not for I.";
    } else if (T.kind === "vv") {
      const x = b.s[0] || {}, k2 = x.v ? vvKind(x.v) : "to", useIng = k2 === "ing" || (k2 === "both" && b.vp === "ing");
      body = clSlot(x, 0, "") + `<span class="jw">${!x.v ? "+" : useIng ? "+ -ing" : "+ to"}</span>` + clSlot(b.s[1] || {}, 1, "", { noWho: 1, noNeg: 1 });
      ctl = seg("f", TIMES, b.f || "present") + (k2 === "both" ? seg("vp", [["to", "+ to"], ["ing", "+ -ing"]], b.vp || "to") : "");
      tip = x.v ? (k2 === "ing" ? `${clean(x.v).toLowerCase()} is followed by -ing (I enjoy reading).` : k2 === "both" ? `${clean(x.v).toLowerCase()} can take -ing or to: both are right.` : `${clean(x.v).toLowerCase()} is followed by to + the base verb (I want to read).`) : T.tip;
    } else if (T.kind === "so") {
      body = whoSel(k, 0, { who: b.who0 || "it" }, cast, "", `data-jwho0="${k}"`) + `<span class="jw">${b.su === "such" ? "… such a" : "… so"}</span>` + wslot(b.s[0], 0)
        + (b.su === "such" ? `<input data-jtxt="${k}|noun" value="${esc(b.noun || "")}" placeholder="day, dog…" aria-label="Which thing?" style="width:7em;font:700 .88rem var(--f-body,system-ui);border:1.5px solid #ddd6fe;border-radius:8px;padding:3px 6px">` : "")
        + `<span class="jw">that</span>` + clSlot(b.s[1] || {}, 1, "");
      ctl = seg("su", [["so", "so …"], ["such", "such a …"]], b.su || "so") + seg("f", TIMES, b.f || "past");
    } else body = wslot(b.s[0], 0) + `<span class="jw">${esc(T.parts[1])}</span>` + wslot(b.s[1], 1);
    if (!T.kind) body = `<span class="jw">${esc(cap(T.parts[0]))}</span>` + body;
    const out = text(b, cast);
    return `<span class="jbox"><span class="jhd"><span class="jt">🔗 ${esc(T.i)} ${esc(T.name)}</span>${ctl}</span><span class="jslots">${body}</span>
      ${complete(b) ? `<span class="jout">${esc(out)}</span>` : ""}<span class="jtip${warn ? " warn" : ""}">${warn ? "⚠️ " + esc(warn) : "💡 " + esc(tip)}</span>${T.ar && !warn ? `<span class="jtip" dir="rtl" lang="ar">${esc(T.ar)}</span>` : ""}</span>`;
  }
  // the 🔗 Joiners menu (only the ones for her age)
  function menu(anchor, onPick) {
    addCss(); document.querySelectorAll(".jmenu").forEach(m => m.remove());
    const A = age(), m = document.createElement("div"); m.className = "jmenu"; m.setAttribute("role", "menu");
    m.innerHTML = Object.entries(TYPES).filter(([, T]) => T.age <= A).map(([k, T]) => `<button type="button" role="menuitem" data-jpick="${k}">${T.i} ${esc(T.name)}<small>${esc({ cond: "If it rains, we will stay home.", list: "milk, eggs and bread", rel: "the girl who won the race", vv: "I enjoy reading · I want to read", so: "It was so cold that we stayed home.", wish: "I wish I had a dog." }[k] || `${T.parts[0]} this ${T.parts[1]} that`)}</small></button>`).join("");
    document.body.appendChild(m); const r = anchor.getBoundingClientRect(); m.style.left = Math.max(8, r.left + scrollX) + "px"; m.style.top = (r.bottom + scrollY + 4) + "px";
    const off = e => { if (!m.contains(e.target) && e.target !== anchor) { m.remove(); document.removeEventListener("click", off, true); } };
    setTimeout(() => document.addEventListener("click", off, true));
    m.onclick = e => { const b = e.target.closest("[data-jpick]"); if (!b) return; m.remove(); document.removeEventListener("click", off, true); onPick(b.dataset.jpick); };
  }
  const api = { TYPES, LV, CONJ, make, text, complete, label, words, nextEmpty, frame, menu, filled, age, AN, vvKind, isNoun: null, isPerson: null };
  window.Joiners = api;
})();
