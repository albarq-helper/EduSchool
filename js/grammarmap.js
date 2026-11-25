/* 🧩 Grammar map: reads a learner's stories and lists the grammar points she used, with the sentence that used each one.
   Every builder choice leaves a token (t:past, g:passive, j:rel, d:rep …); grammar_points.tokens says which tokens count for which point.
   Checked sentences (AI Check) add "gp:<key>" tokens. Used by levels.html. */
(function () {
  "use strict";
  const MID = new Set(["always", "usually", "often", "sometimes", "never", "already", "just", "rarely", "seldom"]);
  const PRONK = new Set(["i", "you", "he", "she", "it", "we", "they"]);
  const ADJ = /^(my|your|his|her|its|our|their)$/;
  const PAST = new Set(["past", "pastcont", "pastperf", "pastperfcont", "usedto"]);
  const ZERO = /^(at home|at school|at work|by (car|bus|train|plane|taxi|bike|boat|subway)|in bed|in class|go to (school|bed|work)|go home|on foot|have breakfast|play football)$/i;
  const clean = w => String(w || "").replace(/\s*\(.*\)\s*$/, "").trim();
  // one story → [{tok, text}]
  function storyTokens(blocks, o) {
    o = o || {}; const out = [], add = (tok, text) => out.push({ tok, text: text || "" }), names = o.names || [];
    (blocks || []).forEach(b => {
      if (!b || typeof b !== "object") return;
      if (b.k === "w") {
        const txt = b.ph || b.tw || clean(b.w), lw = clean(b.w).toLowerCase();
        if (b.tense) add("t:" + b.tense, txt);
        (b.gr || []).forEach(g => { add("g:" + g, txt); if (g === "modal-should" && PAST.has(b.tense)) add("g:modal-should+past", txt); });
        if (b.per && PRONK.has(b.per)) add("who:pron", txt);
        if (b.shape) { if (b.shape.k && b.shape.k !== "verb") add("shape:" + b.shape.k, txt); if (ADJ.test(b.shape.own || "")) add("own:adj", txt); if (/'s?$/.test(b.shape.own || "")) add("own:name", txt); }
        if (b.when && MID.has(String(b.when).toLowerCase())) add("adv:mid", txt);
        if (b.pas && (b.md || !["present", "past"].includes(b.tense))) add("pas:adv", txt);
        if (b.wb) { if (b.wb.kind === "adj" && b.wb.cmp && b.wb.cmp !== "base") add("adj:" + b.wb.cmp, txt);
          if (b.wb.kind === "noun") { add("det:" + (b.wb.det || (b.wb.c ? "a" : "some")), txt); if (["these", "those", "some", "any", "many", "afew", "alot", "two", "three", "no"].includes(b.wb.det) && b.wb.c) add("noun:pl", txt); } }
        if (o.phrasal && o.phrasal.has(lw)) add("w:phrasal", txt);
        if (o.idiom && o.idiom.has(lw)) add("w:idiom", txt);
        if ((lw === "make" || lw === "do") && (b.p || []).length) add("w:makedo", txt);
        (b.p || []).forEach(p => { const lp = String(p).toLowerCase();
          if (/^(in|on|at) /.test(lp)) add("lw:prep", txt + " · " + p);
          if (/^(by (car|bus|train|plane|taxi|bike|boat|subway)|on foot|go home)$/.test(lp)) add("lw:travel", txt + " · " + p);
          if (ZERO.test(lp)) add("lw:zero", txt + " · " + p); });
      } else if (b.k === "j") {
        let txt = ""; try { txt = window.Joiners ? Joiners.text(b, names) : ""; } catch (e) {}
        add("j:" + b.t, txt);
        if (b.t === "cond") { add("j:cond:" + (b.lv || "first"), txt); if (b.inv) add("j:cond-inv", txt); }
        if (b.t === "rel") { if (b.nd) add("j:rel-nd", txt); if (b.many) add("j:rel-many", txt); }
        if ((b.s || []).some(x => x && x.a)) add("j:art", txt);
      } else if (b.k === "d" && b.o) {
        let txt = ""; try { txt = window.Talk ? Talk.opener(b.o) : ""; } catch (e) {}
        if (b.o.mode === "q") add("d:q", txt);
        if (b.o.rep) { let r = txt; try { r = Talk.reported(b.o, o.cast || []); } catch (e) {} add("d:rep", r); if (b.o.mode === "q") add("d:repq", r); }
        if (b.o.pol) add("d:pol", txt);
        if ((b.r || []).length) add("d:r", txt);
      } else if (b.k === "t") {
        const t = String(b.t || "");
        if (/\b(and|but|or|because|so)\b/i.test(t)) add("lnk:basic", t);
        if (/\b(although|though|despite|whereas|however|even though)\b/i.test(t)) add("lnk:contrast", t);
      }
    });
    const has = k => out.some(x => x.tok === k);
    if (has("t:presperf") && has("t:past")) add("t:presperf+past", (out.find(x => x.tok === "t:presperf") || {}).text);
    return out;
  }
  // stories + checks + points → per point: {uses, stories, wrong, examples, status}
  function build(points, stories, checks, o) {
    const by = {}; points.forEach(p => by[p.key] = { p, uses: 0, stories: new Set(), wrong: 0, recent: [], ex: [] });
    const tokOf = {}; points.forEach(p => (p.tokens || []).forEach(t => (tokOf[t] = tokOf[t] || []).push(p.key)));
    (stories || []).forEach(s => storyTokens(s.blocks, o).forEach(x => (tokOf[x.tok] || []).forEach(k => { const r = by[k]; r.uses++; r.stories.add(s.id); if (x.text && r.ex.length < 4 && !r.ex.includes(x.text)) r.ex.push(x.text); })));
    (checks || []).slice().sort((a, b) => String(a.created_at).localeCompare(String(b.created_at))).forEach(c => (c.points || []).forEach(k => { const r = by[k]; if (!r) return;
      r.uses++; r.stories.add("check:" + c.id); r.recent.push(!!c.ok); if (!c.ok) r.wrong++; if (c.ok && r.ex.length < 4 && !r.ex.includes(c.sentence)) r.ex.push(c.sentence); }));
    Object.values(by).forEach(r => { const last5 = r.recent.slice(-5);
      r.status = r.uses >= 10 && !last5.includes(false) ? "mastered" : r.uses >= 5 && r.stories.size >= 2 ? "steady" : r.uses >= 3 ? "met" : r.uses >= 1 ? "tried" : "none"; });
    return by;
  }
  const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
  function levelOf(by) {   // the highest level where 80% of the points are steady or better, counting up from A1
    let reached = ""; for (const L of LEVELS) { const ps = Object.values(by).filter(r => r.p.level === L); if (!ps.length) continue;
      const ok = ps.filter(r => r.status === "steady" || r.status === "mastered").length / ps.length; if (ok >= 0.8) reached = L; else break; }
    return reached;
  }
  window.GrammarMap = { storyTokens, build, levelOf, LEVELS };
})();
