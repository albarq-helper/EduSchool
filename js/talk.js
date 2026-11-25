// 💬 Conversation block: one opening line (a question or a statement) and the replies of the characters.
// The opening line is built (who + verb + time + not), so the block knows its helping verb and offers the right replies:
//   Do you like tea? → Yes, I do. / No, I don't.   I like tea. → So do I. / Me too. / I don't.   I don't like rain. → Neither do I. / Me neither.
// Block: {k:"d", o:{by, mode:"q"|"s"|"sq", who, t, v, rest, neg}, r:[{by, kind, who}]}
(function () {
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const clean = w => String(w || "").replace(/\s*\(.*\)/, "").trim();
  const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  const one = p => p === "he" || p === "she" || p === "it" || /^(c|n1):/.test(String(p || ""));
  const beOf = p => p === "i" ? "am" : one(p) ? "is" : "are", wasOf = p => p === "i" || one(p) ? "was" : "were";
  // the times she can choose, each with its helping verb
  const TIMES = [
    { k: "do", name: "Present", ex: "Do you like tea?", aux: p => one(p) ? "does" : "do", neg: p => one(p) ? "doesn't" : "don't" },
    { k: "did", name: "Past", ex: "Did you finish?", aux: () => "did", neg: () => "didn't" },
    { k: "ing", name: "Now (-ing)", ex: "Are you reading?", aux: beOf, neg: p => p === "i" ? "'m not" : one(p) ? "isn't" : "aren't" },
    { k: "have", name: "Have done", ex: "Have you eaten?", aux: p => one(p) ? "has" : "have", neg: p => one(p) ? "hasn't" : "haven't" },
    { k: "will", name: "Future (will)", ex: "Will you come?", aux: () => "will", neg: () => "won't" },
    { k: "can", name: "Can", ex: "Can you swim?", aux: () => "can", neg: () => "can't" },
    { k: "be", name: "Be (am/is/are)", ex: "Are you tired?", aux: beOf, neg: p => p === "i" ? "'m not" : one(p) ? "isn't" : "aren't", noVerb: 1 },
    { k: "was", name: "Was / were", ex: "Were you scared?", aux: wasOf, neg: p => wasOf(p) + "n't", noVerb: 1 },
  ];
  const T = k => TIMES.find(x => x.k === k) || TIMES[0];
  const MODES = [["q", "❓ Question"], ["s", "💬 Statement"], ["sq", "💬❓ Statement + \"Do you?\""]];
  // who the subject is, as words
  const subj = (p, start) => { const s = Tense.subjOf(p || "you"); return s === "I" || /^(c|n1|n2):/.test(String(p)) ? s : start ? s : s.toLowerCase(); };
  // the main verb after the helping verb
  function verbPart(o) {
    const t = T(o.t); if (t.noVerb) return ""; const F = Tense.forms(o.v || "do");
    return t.k === "ing" ? F.ing : t.k === "have" ? F.pp : F.base;
  }
  // the opening line
  function opener(o) {
    const t = T(o.t), p = o.who || "you", rest = (o.rest || "").trim(), vp = verbPart(o);
    if (!t.noVerb && !o.v) return "…";
    const words = (...a) => a.filter(Boolean).join(" ");
    const statement = () => {
      if (o.neg) { const n = t.neg(p); return n.startsWith("'") ? words(subj(p, 1) + n, vp, rest) : words(subj(p, 1), n, vp, rest); }
      if (t.k === "do") return words(subj(p, 1), one(p) ? Tense.forms(o.v).s : Tense.forms(o.v).base, rest);
      if (t.k === "did") return words(subj(p, 1), Tense.forms(o.v).past, rest);
      return words(subj(p, 1), t.aux(p), vp, rest);
    };
    const question = () => { const a = o.neg ? t.neg(p).replace(/^'m not$/, "am not") : t.aux(p);
      if (o.neg && /n't$/.test(a)) return cap(words(a, subj(p), vp, rest)) + "?";
      if (o.neg) return cap(words(t.aux(p), subj(p), "not", vp, rest)) + "?";
      return cap(words(a, subj(p), vp, rest)) + "?"; };
    if (o.mode === "q") return question();
    const st = cap(statement()) + ".";
    if (o.mode === "sq") { const back = o.neg ? `${cap(t.neg("you").replace(/^'m not$/, "aren't"))} you?` : `${cap(t.aux("you"))} you?`; return `${st} ${back}`; }
    return st;
  }
  // who answers a question: "Do you…?" → I · "Does Rover…?" → he · "Do I…?" → you
  function answerer(o, cast) {
    const p = o.who || "you";
    if (p === "you") return "i"; if (p === "i") return "you"; if (p === "we") return "we"; if (p === "they") return "they";
    if (/^c:/.test(p)) { const c = (cast || []).find(x => "c:" + (x.name || "").trim() === p); return c ? Tense.prOf(c) : "they"; }
    return p;
  }
  // the reply kinds that fit the opening line
  function kinds(o) {
    if (o.mode === "q") return [["yes", "Yes, … (short answer)"], ["no", "No, … (short answer)"]];
    if (o.mode === "sq") return o.neg ? [["neither", "No, neither … (agree)"], ["no", "No, I … (short answer)"], ["disagree", "Oh, I … ! (disagree)"]]
      : [["yesso", "Yes, so … I! (both)"], ["yes", "Yes, I … (short answer)"], ["no", "No, I … (short answer)"]];
    return o.neg ? [["neither", "Neither … I (agree)"], ["meneither", "Me neither (agree)"], ["disagree", "Oh, I … ! (disagree)"]]
      : [["so", "So … I (agree)"], ["metoo", "Me too (agree)"], ["disagree", "Oh, I … n't (disagree)"]];
  }
  const TIPS = {
    yes: "Short answer: Yes + who + the same helping verb (Do you…? → Yes, I do).",
    no: "Short answer: No + who + helping verb + n't (Do you…? → No, I don't).",
    so: "So + helping verb + I agrees with a yes-sentence: I like tea. → So do I.",
    metoo: "Me too = So do I, but more casual.",
    neither: "Neither + helping verb + I agrees with a not-sentence: I don't like rain. → Neither do I.",
    meneither: "Me neither = Neither do I, but more casual.",
    disagree: "To disagree, say the opposite with the same helping verb: I like tea. → Oh, I don't. / I don't like rain. → Oh, I do!",
    yesso: "Yes answers \"Do you?\"; so do I agrees with what they said.",
  };
  // the reply, as words
  function reply(o, r, cast) {
    const t = T(o.t), me = r.who || "i", ans = o.mode === "q" ? answerer(o, cast) : me;
    if (!t.noVerb && !o.v) return "…";
    const S = (p, start) => { const s = subj(p, start); return s; };
    const negWord = p => { const n = t.neg(p); return n.startsWith("'") ? null : n; };
    const no = p => { const n = negWord(p); return n ? `No, ${S(p)} ${n}.` : `No, ${S(p)}${t.neg(p)}.`; };
    switch (r.kind) {
      case "yes": return `Yes, ${S(ans)} ${t.aux(ans)}.`;
      case "no": return no(ans);
      case "so": return `So ${t.aux(me)} ${S(me)}.`;
      case "metoo": return "Me too!";
      case "neither": return `${o.mode === "sq" ? "No, neither" : "Neither"} ${t.aux(me)} ${S(me)}.`;
      case "meneither": return "Me neither.";
      case "disagree": return o.neg ? `Oh, ${S(me)} ${t.aux(me)}!` : (negWord(me) ? `Oh, ${S(me)} ${t.neg(me)}.` : `Oh, ${S(me)}${t.neg(me)}.`);
      case "yesso": return `Yes, so ${t.aux(me)} ${S(me)}!`;
    }
    return "";
  }
  const lines = (b, cast) => [{ by: b.o.by, text: opener(b.o) }, ...(b.r || []).map(r => ({ by: r.by, text: reply(b.o, r, cast) }))];
  const complete = b => !!(b.o && (T(b.o.t).noVerb || b.o.v) && (b.r || []).length);
  const words = b => b.o && b.o.v ? [b.o.v] : [];
  function make(cast) { const n = (cast || []).map(c => (c.name || "").trim()).filter(Boolean); return { k: "d", o: { by: n[0] || "", mode: "q", who: "you", t: "do", v: "", rest: "", neg: false }, r: [] }; }
  // ---- the block on the story board ----
  const css = `
.dbox{display:grid;gap:6px;flex:1;min-width:0}.dhd{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.dhd .jt{background:#e0f2fe;color:#075985;border-radius:999px;padding:2px 10px;font:800 .9rem var(--f-body,system-ui)}
.dop{display:flex;flex-wrap:wrap;gap:5px;align-items:center;border:2px dashed #7dd3fc;background:#f0f9ff;border-radius:12px;padding:6px 8px;cursor:pointer}
.dop.act{border-color:#0284c7;box-shadow:0 0 0 4px #bae6fd}.dop.full{border-style:solid;border-color:#38bdf8;background:#fff}
.dop select,.dop input:not([type]){font:700 .88rem var(--f-body,system-ui);border:1.5px solid #bae6fd;border-radius:8px;padding:3px 6px;background:#fff;color:#0c4a6e}.dop input:not([type]){width:9em}
.dop .dv{font:800 .92rem var(--f-body,system-ui);color:#0369a1}.dop label{font:700 .78rem var(--f-body,system-ui);color:#64748b;display:inline-flex;gap:3px;align-items:center}
.dseg{display:flex;flex-wrap:wrap;gap:4px}.dseg button{border:1.5px solid #bae6fd;background:#fff;border-radius:999px;padding:3px 9px;font:800 .76rem var(--f-body,system-ui);cursor:pointer;color:#0c4a6e}
.dseg button[aria-pressed=true]{background:#0284c7;border-color:#0284c7;color:#fff}
.dl{display:flex;gap:8px;align-items:center;flex-wrap:wrap;background:#f8fafc;border-radius:10px;padding:5px 8px}.dl select{font:700 .85rem var(--f-body,system-ui);border:1px solid #cbd5e1;border-radius:8px;padding:2px 4px}
.dl .say{font:800 1rem var(--f-display,system-ui);color:#0f172a}.dl.op .say{color:#075985}.dl .x{border:0;background:none;color:#94a3b8;cursor:pointer}
.dadd{display:flex;flex-wrap:wrap;gap:4px;align-items:center}.dadd small{font:700 .78rem var(--f-body,system-ui);color:#64748b}
.dadd button{border:1.5px dashed #7dd3fc;background:#fff;border-radius:999px;padding:3px 9px;font:800 .78rem var(--f-body,system-ui);cursor:pointer;color:#075985}
.dtip{font-size:.82rem;color:#0369a1}`;
  const addCss = () => { if (!document.getElementById("talk-css")) { const s = document.createElement("style"); s.id = "talk-css"; s.textContent = css; document.head.appendChild(s); } };
  const spk = (k, n, cur, names) => `<select data-dby="${k}|${n}" aria-label="Who says it">${["", ...names].map(x => `<option value="${esc(x)}"${(cur || "") === x ? " selected" : ""}>${x ? esc(x) : "(someone)"}</option>`).join("")}</select>`;
  function frame(b, k, act, cast) {
    addCss(); const o = b.o, names = (cast || []).map(c => (c.name || "").trim()).filter(Boolean), t = T(o.t), on = act && act[0] === k && act[1] === "o";
    const whoOpts = [["you", "you"], ["i", "I"], ["we", "we"], ["they", "they"], ["he", "he"], ["she", "she"], ["it", "it"], ...names.map(n => ["c:" + n, n])];
    const op = `<span class="dop${o.v || t.noVerb ? " full" : ""}${on ? " act" : ""}" data-dslot="${k}" title="Tap, then pick a doing word on the left">
      <select data-dwho="${k}" aria-label="About who">${whoOpts.map(([v, l]) => `<option value="${esc(v)}"${o.who === v ? " selected" : ""}>${esc(l)}</option>`).join("")}</select>
      ${t.noVerb ? `<span class="dv">${esc(o.t === "was" ? "was / were" : "am / is / are")}</span>` : o.v ? `<span class="dv">${esc(clean(o.v).toLowerCase())}</span><button type="button" class="x" data-dvx="${k}" aria-label="Take away the verb">✕</button>` : `<span class="ph" style="color:#0284c7;font-weight:700">⬚ ${on ? "pick a doing word" : "doing word"}</span>`}
      <input data-drest="${k}" value="${esc(o.rest || "")}" placeholder="${t.noVerb ? "tired, at home…" : "+ more words"}" aria-label="More words"><label><input type="checkbox" data-dneg="${k}"${o.neg ? " checked" : ""}> not</label></span>`;
    const ls = lines(b, cast), used = new Set((b.r || []).map(r => r.kind));
    return `<span class="dbox"><span class="dhd"><span class="jt">💬 Conversation</span><span class="dseg">${MODES.map(([m, l]) => `<button type="button" data-dmode="${k}|${m}" aria-pressed="${o.mode === m}">${esc(l)}</button>`).join("")}</span></span>
      <span class="dseg" title="Time">${TIMES.map(x => `<button type="button" data-dt="${k}|${x.k}" aria-pressed="${o.t === x.k}" title="${esc(x.ex)}">${esc(x.name)}</button>`).join("")}</span>
      ${op}
      <span class="dl op">${spk(k, -1, o.by, names)}<span class="say">${esc(ls[0].text)}</span></span>
      ${(b.r || []).map((r, n) => `<span class="dl">${spk(k, n, r.by, names)}<span class="say">${esc(ls[n + 1].text)}</span>${["so", "neither", "disagree", "yesso"].includes(r.kind) ? `<select data-drwho="${k}|${n}" aria-label="Who agrees">${[["i", "I"], ["we", "we"], ...names.map(x => ["c:" + x, x])].map(([v, l]) => `<option value="${esc(v)}"${(r.who || "i") === v ? " selected" : ""}>${esc(l)}</option>`).join("")}</select>` : ""}<button type="button" class="x" data-drx="${k}|${n}" aria-label="Remove this reply">✕</button></span>`).join("")}
      ${(b.r || []).length < 8 && (o.v || t.noVerb) ? `<span class="dadd"><small>＋ Reply:</small>${kinds(o).map(([kk, l]) => `<button type="button" data-dadd="${k}|${kk}" title="${esc(TIPS[kk])}">${esc(l)}</button>`).join("")}</span>` : ""}
      <span class="dtip">💡 ${esc((b.r || []).length ? TIPS[b.r[b.r.length - 1].kind] : o.mode === "q" ? "Ask a question, then add the answers." : "Say something, then let the others agree or disagree.")}</span></span>`;
  }
  window.Talk = { TIMES, MODES, make, opener, reply, lines, complete, words, kinds, frame, answerer, TIPS };
})();
