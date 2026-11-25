/* 🧱 Sentence box for naming words (nouns) and describing words (adjectives) — grammar by taste.
   Nouns:      There is a cat · There are two cats · I have some milk · This is a cat · These are cats  (a / the / this / some / any / much / many / a few / a little …)
   Describing: Rover is fast · very fast · faster than Max · the fastest in the class · as fast as Max · too fast · fast enough
   Every change shows a small 🧩 chip; tapping it opens one line of rule in English and Arabic. Uses window.Tense for agreement (am / is / are …). */
(function () {
  "use strict";
  const T = window.Tense;
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const clean = w => String(w || "").replace(/\s*\(.*\)\s*$/, "").trim();
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

  // ---------- naming words ----------
  const UNC = new Set(("water milk juice tea coffee rice bread sugar salt money homework advice information news music furniture luggage weather rain snow air " +
    "love happiness sadness anger fear time work help knowledge courage patience honesty kindness wisdom food fruit hair paper chocolate cheese meat soup butter oil sand " +
    "grass traffic fun peace health jealousy envy pride shame trust respect confidence equality equity guidance support compassion empathy gratitude laziness boredom").split(" "));
  const IRRP = { child: "children", man: "men", woman: "women", person: "people", foot: "feet", tooth: "teeth", mouse: "mice", goose: "geese", sheep: "sheep", fish: "fish", deer: "deer",
    species: "species", leaf: "leaves", knife: "knives", wife: "wives", life: "lives", half: "halves", shelf: "shelves", wolf: "wolves", potato: "potatoes", tomato: "tomatoes", hero: "heroes", ox: "oxen" };
  const countable = (w, tags) => { const lw = clean(w).toLowerCase(); if (UNC.has(lw)) return false;
    if (/(ness|ity|ism|hood|dom)$/.test(lw) && !/(city|activity|community|university|opportunity)$/.test(lw)) return false;
    if ((tags || []).some(t => /^Feelings/.test(t)) && !(tags || []).some(t => /^Naming: people/.test(t))) return false; return true; };
  const plural = w => { const lw = clean(w).toLowerCase(); if (IRRP[lw]) return IRRP[lw]; const last = lw.split(" ").pop(); return IRRP[last] ? lw.replace(/\S+$/, IRRP[last]) : T.PL(lw); };
  // which / how many: [key, label, many?, who it suits: "c" countable, "u" can't count, "b" both]
  const DETS = [["a", "a / an", false, "c"], ["the", "the", false, "b"], ["my", "my", false, "b"], ["this", "this", false, "b"], ["that", "that", false, "b"], ["these", "these", true, "c"], ["those", "those", true, "c"],
    ["some", "some", true, "b"], ["any", "any", true, "b"], ["no", "no", true, "b"], ["many", "many", true, "c"], ["much", "much", false, "u"], ["afew", "a few", true, "c"], ["alittle", "a little", false, "u"],
    ["alot", "a lot of", true, "b"], ["every", "every", false, "c"], ["two", "two", true, "c"], ["three", "three", true, "c"]];
  const isMany = (st, c) => { const d = DETS.find(x => x[0] === st.det) || DETS[0]; return c && d[2]; };
  function nounPhrase(word, st, c, neg, q) {
    let det = st.det || (c ? "a" : "some");
    if ((neg || q) && det === "some") det = "any";
    if (neg && det === "no") det = "any";
    const many = isMany({ det }, c), n = many ? plural(word) : clean(word).toLowerCase();
    const lab = { a: T.AN(n), afew: "a few", alittle: "a little", alot: "a lot of" }[det] || det;
    return `${lab} ${n}`;
  }
  const PERSON = [["i", "I"], ["you", "you"], ["he", "he"], ["she", "she"], ["it", "it"], ["we", "we"], ["they", "they"]];
  const whoName = (p, cast) => /^c:/.test(p) ? p.slice(2) : (PERSON.find(x => x[0] === p) || PERSON[3])[1];
  const who3 = p => /^c:/.test(p) || p === "he" || p === "she" || p === "it";
  function nounSentence(word, st, o) {
    const c = st.c, tz = st.t || "present", neg = !!st.neg, q = !!st.q;
    if (st.frame === "point") {
      const ptr = ["this", "that", "these", "those"].includes(st.ptr) ? st.ptr : "this", many = (ptr === "these" || ptr === "those") && c;
      const np = many ? plural(word) : c ? `${T.AN(clean(word).toLowerCase())} ${clean(word).toLowerCase()}` : clean(word).toLowerCase();
      const b = { present: many ? "are" : "is", past: many ? "were" : "was", future: "will be" }[tz], nb = { present: many ? "aren't" : "isn't", past: many ? "weren't" : "wasn't", future: "won't be" }[tz];
      const s = q ? (tz === "future" ? `Will ${ptr} be ${np}?` : `${cap(b)} ${ptr} ${np}?`) : `${cap(ptr)} ${neg ? nb : b} ${np}.`;
      return s;
    }
    const np = nounPhrase(word, st, c, neg, q), many = isMany({ det: st.det || (c ? "a" : "some") }, c);
    const extra = (o.partners || []).filter(Boolean).join(" "), tail = extra ? " " + extra : "";
    if (st.frame === "have") {
      const p = st.p || "i", S = whoName(p, o.cast), s3 = who3(p);
      const v = q ? { present: `${s3 ? "Does" : "Do"} ${S === "I" ? "I" : S} have`, past: `Did ${S} have`, future: `Will ${S} have` }[tz]
        : neg ? `${cap(S)} ${{ present: s3 ? "doesn't have" : "don't have", past: "didn't have", future: "won't have" }[tz]}`
          : `${cap(S)} ${{ present: s3 ? "has" : "have", past: "had", future: "will have" }[tz]}`;
      return `${v} ${np}${tail}${q ? "?" : "."}`;
    }
    const pl = many; // there is / there are
    const b = { present: pl ? "are" : "is", past: pl ? "were" : "was", future: "will be" }[tz], nb = { present: pl ? "aren't" : "isn't", past: pl ? "weren't" : "wasn't", future: "won't be" }[tz];
    return q ? (tz === "future" ? `Will there be ${np}${tail}?` : `${cap(b)} there ${np}${tail}?`) : `There ${neg ? nb : b} ${np}${tail}.`;
  }
  function nounChips(word, st) {
    const out = [], c = st.c, det = st.det || (c ? "a" : "some");
    out.push(c ? { k: "count", name: "🧮 You can count it", rule: `You can count ${plural(word)}: ${T.AN(clean(word).toLowerCase())} ${clean(word).toLowerCase()}, two ${plural(word)}, many, a few.`, ar: "‏اسم معدود: نقول a / an للمفرد، وللجمع many و a few والأرقام." }
      : { k: "uncount", name: "🫗 You can't count it", rule: `You can't count ${clean(word).toLowerCase()}: no a / an and no -s. Use some, much, a little, a lot of.`, ar: "‏اسم غير معدود: لا نستخدم a / an ولا نضيف s، ونقول some / much / a little / a lot of." });
    if (st.frame === "there" || !st.frame) out.push({ k: "there", name: "🏠 There is / There are", rule: "There is + one thing or something you can't count. There are + many things. Past: there was / there were.", ar: "‏There is للمفرد وغير المعدود، و There are للجمع. وفي الماضي was / were." });
    if (st.frame === "have") out.push({ k: "have", name: "🎒 have / has", rule: "I, you, we, they have · he, she, it has. Not and asking use do / does: She doesn't have… Does she have…?", ar: "‏have مع I / you / we / they و has مع he / she / it، وفي النفي والسؤال doesn't have / Does she have." });
    if (st.frame === "point") out.push({ k: "this", name: "👉 this, that, these, those", rule: "this / these = near you · that / those = far away. this, that + one; these, those + many.", ar: "‏this / these للقريب و that / those للبعيد، والأوليان للمفرد والأخريان للجمع." });
    if (st.frame !== "point" && (det === "some" || det === "any")) out.push({ k: "someany", name: "🔁 some in telling, any in not and asking", rule: "Use some in telling sentences (There is some milk) and any in not and asking (Is there any milk? There isn't any milk).", ar: "‏some في الجمل المثبتة، و any في النفي والسؤال." });
    if (st.frame !== "point" && ["many", "much", "afew", "alittle"].includes(det)) out.push({ k: "manymuch", name: "⚖️ many / much · a few / a little", rule: "many and a few go with things you can count (many cats); much and a little with things you can't count (much water).", ar: "‏many و a few مع المعدود، و much و a little مع غير المعدود." });
    if (st.frame !== "point" && det === "a") out.push({ k: "an", name: "🔤 a or an?", rule: "a before a consonant sound, an before a vowel sound: a cat, an apple, an hour.", ar: "‏a قبل صوت ساكن و an قبل صوت متحرك." });
    if (IRRP[clean(word).toLowerCase()] && isMany({ det }, c)) out.push({ k: "irrpl", name: "⚡ An irregular plural", rule: `${clean(word).toLowerCase()} → ${plural(word)}: no -s.`, ar: "‏جمع غير قياسي، لا نضيف له s." });
    return out;
  }

  // ---------- describing words ----------
  const IRRC = { good: ["better", "best"], bad: ["worse", "worst"], far: ["farther", "farthest"], little: ["less", "least"], many: ["more", "most"], much: ["more", "most"], well: ["better", "best"], ill: ["worse", "worst"] };
  const syl = w => { const x = w.toLowerCase().replace(/e$/, "").replace(/[^a-z]/g, ""); return Math.max(1, (x.match(/[aeiouy]+/g) || []).length); };
  function cmp(word) {
    const w = clean(word).toLowerCase();
    if (IRRC[w]) return { er: IRRC[w][0], est: IRRC[w][1], more: false, irr: true };
    if (/[\s-]/.test(w) || /(ed|ing|ful|ous|ive|less|ish|ic|al)$/.test(w)) return { er: "more " + w, est: "most " + w, more: true };
    const n = syl(w);
    if (n === 1) {
      if (/e$/.test(w)) return { er: w + "r", est: w + "st" };
      if (/[^aeiou][aeiou][^aeiouwxy]$/.test(w)) return { er: w + w.slice(-1) + "er", est: w + w.slice(-1) + "est", dbl: true };
      if (/[^aeiou]y$/.test(w)) return { er: w.slice(0, -1) + "ier", est: w.slice(0, -1) + "iest" };
      return { er: w + "er", est: w + "est" };
    }
    if (n === 2 && /[^aeiou]y$/.test(w)) return { er: w.slice(0, -1) + "ier", est: w.slice(0, -1) + "iest", y: true };
    if (n === 2 && /(ow|le|er)$/.test(w)) return /le$/.test(w) ? { er: w + "r", est: w + "st" } : { er: w + "er", est: w + "est" };
    return { er: "more " + w, est: "most " + w, more: true };
  }
  const CMPS = [["base", "plain"], ["very", "very"], ["er", "-er than"], ["est", "the -est"], ["asas", "as … as"], ["too", "too"], ["enough", "enough"]];
  function adjSentence(word, st, o) {
    const w = clean(word).toLowerCase(), C = cmp(w), p = st.p || "she", tz = st.t || "present", neg = !!st.neg, q = !!st.q;
    const S = whoName(p, o.cast), one = who3(p), other = (st.other || "").trim() || "the others", place = st.place || "";
    const X = { base: w, very: "very " + w, er: `${C.er} than ${other}`, est: `the ${C.est}${place ? " " + place : ""}`, asas: `as ${w} as ${other}`, too: "too " + w, enough: w + " enough" }[st.cmp || "base"];
    const b = { present: p === "i" ? "am" : one ? "is" : "are", past: p === "i" || one ? "was" : "were", future: "will be" }[tz];
    const nb = { present: p === "i" ? "am not" : one ? "isn't" : "aren't", past: p === "i" || one ? "wasn't" : "weren't", future: "won't be" }[tz];
    if (q) return tz === "future" ? `Will ${S === "I" ? "I" : S} be ${X}?` : `${cap(b)} ${S === "I" ? "I" : S} ${X}?`;
    return `${cap(S)} ${neg ? nb : b} ${X}.`;
  }
  function adjChips(word, st) {
    const C = cmp(word), w = clean(word).toLowerCase(), k = st.cmp || "base", out = [];
    if (k === "er" || k === "est") {
      out.push(C.irr ? { k: "cmp-irr", name: `⚡ ${w} → ${C.er} → ${C.est}`, rule: `${w} is irregular: ${w}, ${C.er}, ${C.est}.`, ar: "‏صفة غير قياسية في المقارنة والتفضيل." }
        : C.more ? { k: "cmp-more", name: "📏 Long word: more / most", rule: `Long describing words (2 or more beats) use more and most: more ${w}, the most ${w}.`, ar: "‏الصفات الطويلة نستخدم معها more للمقارنة و most للتفضيل." }
          : { k: "cmp-er", name: "📏 Short word: -er / -est", rule: `Short describing words add -er and -est: ${C.er}, the ${C.est}.${C.dbl ? " One vowel + one consonant at the end: double it (big → bigger)." : C.y ? " -y becomes -ier (happy → happier)." : ""}`, ar: "‏الصفات القصيرة نضيف لها er للمقارنة و est للتفضيل." });
      out.push(k === "er" ? { k: "than", name: "⚖️ -er + than", rule: "Comparing two: faster than, more careful than.", ar: "‏للمقارنة بين اثنين نستخدم than." }
        : { k: "the-est", name: "🏆 the + -est", rule: "The top one of a group: the fastest in the class, the most careful of all.", ar: "‏للتفضيل في مجموعة نستخدم the قبل الصفة." });
    }
    if (k === "asas") out.push({ k: "asas", name: "🟰 as … as", rule: "as fast as = the same. not as fast as = less.", ar: "‏as … as للتساوي، و not as … as للأقل." });
    if (k === "too" || k === "enough") out.push({ k: "tooenough", name: "🎯 too / enough", rule: "too fast = more than is OK. fast enough = just OK. too comes before the word, enough comes after it.", ar: "‏too = أكثر من اللازم وتأتي قبل الصفة، و enough = بالقدر الكافي وتأتي بعدها." });
    if (k === "very") out.push({ k: "very", name: "➕ very", rule: "very makes the word stronger: very fast. With -er, use much: much faster.", ar: "‏very للتقوية، ومع صيغة المقارنة نستخدم much." });
    out.push({ k: "be", name: "🧱 am / is / are", rule: "I am · he / she / it is · we / you / they are. Past: was / were.", ar: "‏I am · he / she / it is · we / you / they are، وفي الماضي was / were." });
    return out;
  }

  // ---------- which box? ----------
  function kind(v) {
    if (!v || v.author || /\s.*\s.*\s/.test(clean(v.w))) return null;
    const tags = v.tags || [];
    if (tags.some(t => /^Describing/.test(t))) return "adj";
    if (tags.some(t => /^Naming/.test(t))) return "noun";
    return null;
  }
  function phrase(word, st, o) { return st.kind === "adj" ? adjSentence(word, st, o || {}) : nounSentence(word, st, o || {}); }
  function chips(word, st) { return st.kind === "adj" ? adjChips(word, st) : nounChips(word, st); }

  // ---------- the box ----------
  function mount(el, o) {
    if (T.css) T.css();
    const v = o.v || {}, word = clean(o.word), k = o.kind || kind(v), cast = (o.cast || []).filter(c => c && c.name);
    const st = Object.assign({ kind: k, t: "present", neg: false, q: false, gc: "" }, k === "adj" ? { cmp: "base", p: cast[0] ? "c:" + cast[0].name : "she", other: cast[1] ? cast[1].name : "", place: "" }
      : { frame: "there", det: "", c: countable(word, v.tags), p: cast[0] ? "c:" + cast[0].name : "i", ptr: "this" }, o.state || {});
    const pill = (attr, val, on, label, title) => `<button type="button" ${attr}="${esc(val)}" aria-pressed="${!!on}"${title ? ` title="${esc(title)}"` : ""}>${label}</button>`;
    function whoRow() {
      return `<div class="tm-sayit"><span class="lab">Who?</span>${cast.map(c => pill("data-wp", "c:" + c.name, st.p === "c:" + c.name, `${esc(c.emoji || "🙂")} ${esc(c.name)}`)).join("")}${PERSON.map(([kk, l]) => pill("data-wp", kk, st.p === kk, kk === "i" ? "I" : l)).join("")}</div>`;
    }
    function draw(anim) {
      const full = phrase(word, st, { cast, partners: o.partners }), GC = chips(word, st), gOpen = GC.find(c => c.k === st.gc);
      let rows = "";
      if (k === "noun") {
        const dets = DETS.filter(d => d[3] === "b" || (d[3] === "c") === !!st.c);
        rows += `<div class="tm-sayit"><span class="lab">Say it with</span>${pill("data-fr", "there", st.frame === "there", "🏠 There is…")}${pill("data-fr", "have", st.frame === "have", "🎒 I have…")}${pill("data-fr", "point", st.frame === "point", "👉 This is…")}
          <span class="sep"></span>${pill("data-cnt", "1", st.c, st.c ? "🧮 can count" : "🫗 can't count", "Can you count it? Tap to change")}</div>`;
        rows += st.frame === "point" ? `<div class="tm-sayit"><span class="lab">Which?</span>${["this", "that"].concat(st.c ? ["these", "those"] : []).map(x => pill("data-ptr", x, st.ptr === x, x)).join("")}</div>`
          : `<div class="tm-sayit"><span class="lab">How many?</span>${dets.map(d => pill("data-det", d[0], (st.det || (st.c ? "a" : "some")) === d[0], esc(d[1]))).join("")}</div>`;
        if (st.frame === "have") rows += whoRow();
      } else {
        rows += whoRow();
        rows += `<div class="tm-sayit"><span class="lab">Compare</span>${CMPS.map(([kk, l]) => pill("data-cmp", kk, st.cmp === kk, esc(l))).join("")}</div>`;
        if (st.cmp === "er" || st.cmp === "asas") rows += `<div class="tm-sayit"><span class="lab">${st.cmp === "er" ? "than" : "as"}</span>${cast.filter(c => "c:" + c.name !== st.p).map(c => pill("data-oth", c.name, st.other === c.name, `${esc(c.emoji || "🙂")} ${esc(c.name)}`)).join("")}
          <input type="text" maxlength="30" data-othx value="${esc(cast.some(c => c.name === st.other) ? "" : st.other)}" placeholder="someone or something" style="border:1.5px solid #c7d2fe;border-radius:999px;padding:3px 10px;font:inherit;min-width:10em"></div>`;
        if (st.cmp === "est") rows += `<div class="tm-sayit"><span class="lab">Of what?</span>${[["", "—"], ["in the class", "in the class"], ["in the world", "in the world"], ["in the family", "in the family"], ["of all", "of all"]].map(([v2, l]) => pill("data-plc", v2, st.place === v2, esc(l))).join("")}</div>`;
      }
      rows += `<div class="tm-sayit"><span class="lab">When?</span>${[["past", "⬅️ past"], ["present", "🔄 now"], ["future", "➡️ future"]].map(([kk, l]) => pill("data-wt2", kk, st.t === kk, l)).join("")}
        <span class="sep"></span>${[["s", "✔️ telling"], ["n", "🚫 not"], ["q", "❓ asking"]].map(([kk, l]) => pill("data-sm2", kk, kk === "s" ? !st.neg && !st.q : kk === "n" ? st.neg : st.q, l)).join("")}</div>`;
      const chipsHtml = GC.length ? `<div class="tm-gcs">${GC.map(c => `<button type="button" class="tm-gc" data-gc="${c.k}" aria-expanded="${st.gc === c.k}">🧩 ${esc(c.name)}</button>`).join("")}</div>${gOpen ? `<div class="tm-gr">${esc(gOpen.rule)}<span class="ar" dir="rtl" lang="ar">${esc(gOpen.ar)}</span></div>` : ""}` : "";
      el.innerHTML = `<div class="tm" role="group" aria-label="Sentence with ${esc(word)}">
        <div class="tm-say"${anim ? "" : ' style="animation:none"'}><span class="s">${esc(full)}</span></div>${rows}${chipsHtml}
        ${o.verb && o.onVerb ? `<p class="tm-tip" style="text-align:center">🔀 It comes from the doing word <b>${esc(o.verb)}</b>. <button type="button" class="tm-o" data-wverb="1" style="display:inline-grid"><b>Use ${esc(o.verb)}</b></button></p>` : ""}
        <div class="tm-nav">${o.onPick ? `<button type="button" class="use" data-wb-use="1">Use "${esc(full)}"</button>` : ""}<button type="button" data-wb-hear="1">🔊 Hear</button></div></div>`;
    }
    el.onclick = e => {
      const g = (a) => e.target.closest(`[${a}]`);
      let x;
      if ((x = g("data-fr"))) { st.frame = x.dataset.fr; st.gc = ""; return draw(true); }
      if (g("data-cnt")) { st.c = !st.c; st.det = ""; st.gc = st.c ? "count" : "uncount"; return draw(true); }
      if ((x = g("data-det"))) { st.det = x.dataset.det; st.gc = ""; return draw(true); }
      if ((x = g("data-ptr"))) { st.ptr = x.dataset.ptr; return draw(true); }
      if ((x = g("data-wp"))) { st.p = x.dataset.wp; return draw(true); }
      if ((x = g("data-cmp"))) { st.cmp = x.dataset.cmp; st.gc = ""; return draw(true); }
      if ((x = g("data-oth"))) { st.other = x.dataset.oth; return draw(true); }
      if ((x = g("data-plc"))) { st.place = x.dataset.plc; return draw(true); }
      if ((x = g("data-wt2"))) { st.t = x.dataset.wt2; return draw(true); }
      if ((x = g("data-sm2"))) { const m = x.dataset.sm2; st.neg = m === "n"; st.q = m === "q"; return draw(true); }
      if ((x = g("data-gc"))) { st.gc = st.gc === x.dataset.gc ? "" : x.dataset.gc; return draw(false); }
      if (g("data-wverb") && o.onVerb) return o.onVerb();
      if (g("data-wb-hear")) { try { const u = new SpeechSynthesisUtterance(phrase(word, st, { cast, partners: o.partners })); u.lang = "en-US"; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (er) {} return; }
      if (g("data-wb-use") && o.onPick) { const s = { ...st }; delete s.gc; o.onPick({ phrase: phrase(word, st, { cast, partners: o.partners }), state: s, grammar: chips(word, st).map(c => c.k) }); }
    };
    el.oninput = e => { if (e.target.matches("[data-othx]")) { st.other = e.target.value; clearTimeout(st.tm); st.tm = setTimeout(() => { draw(false); const i2 = el.querySelector("[data-othx]"); if (i2) { i2.focus(); const L = i2.value.length; i2.setSelectionRange(L, L); } }, 450); } };
    draw(false);
  }
  window.WordBox = { kind, mount, phrase, chips, cmp, plural, countable, nounSentence, adjSentence };
})();
