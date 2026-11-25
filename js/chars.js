// 🎭 Character library: load, show a personality on meters, describe it for a story, and pick characters for a story.
// A trait value is a number −2 … +2 (0 = the golden middle) or { all: n, home: n, school: n, … } when it changes with the place.
(function () {
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  let L = null;
  async function load(force) {
    if (L && !force) return L;
    const C = App.client, [t, p, c, r, ch, sg, cs, ag, rt, lk, ad] = await Promise.all([
      C.from("traits").select("*").order("position"), C.from("trait_places").select("*").order("position"),
      C.from("conditions").select("*").order("position"), C.from("character_roles").select("*").order("position"),
      C.from("characters").select("*").order("name"), C.from("signs").select("*").order("position"), C.from("condition_signs").select("*"),
      C.rpc("viewer_age").then(x => x, () => ({ data: null })), C.from("roots").select("*").order("position"), C.from("trait_links").select("*"), C.from("advice").select("*").order("position")]);
    L = { traits: t.data || [], places: p.data || [], conditions: c.data || [], roles: r.data || [], chars: ch.data || [], signs: sg.data || [], age: ag && ag.data != null ? +ag.data : null };
    L.S = Object.fromEntries(L.signs.map(x => [x.key, x]));
    L.roots = rt.data || []; L.RT = Object.fromEntries(L.roots.map(x => [x.key, x])); L.links = lk.data || []; L.advice = ad.data || [];
    const ids = [...new Set(L.advice.map(x => x.word_id))]; L.Q = {};
    for (let k = 0; k < ids.length; k += 100) { const r2 = await C.from("words").select("id,headword,author,min_age,translation").in("id", ids.slice(k, k + 100)); (r2.data || []).forEach(w => L.Q[w.id] = w); }
    L.CS = {}; (cs.data || []).forEach(x => { if (L.S[x.sign]) (L.CS[x.condition] = L.CS[x.condition] || []).push(x); }); Object.values(L.CS).forEach(a => a.sort((x, y) => y.weight - x.weight));
    L.T = Object.fromEntries(L.traits.map(x => [x.key, x])); L.P = Object.fromEntries(L.places.map(x => [x.key, x]));
    L.C = Object.fromEntries(L.conditions.map(x => [x.key, x])); L.R = Object.fromEntries(L.roles.map(x => [x.key, x]));
    return L;
  }
  const base = v => v && typeof v === "object" ? +(v.all || 0) : +(v || 0);
  const byPlace = v => v && typeof v === "object" ? Object.entries(v).filter(([k]) => k !== "all") : [];
  // −2 "Explodes", −1 "a bit: Explodes", 0 "Calm and steady", …
  function levelName(t, v) { v = Math.max(-2, Math.min(2, Math.round(+v || 0))); const n = v < 0 ? t.low_name : v > 0 ? t.high_name : t.mid_name; return Math.abs(v) === 1 ? `a bit ${String(n).charAt(0).toLowerCase() + String(n).slice(1)}` : n; }
  function levelText(t, v) { v = Math.round(+v || 0); if (!v) return { me: t.mid_text, others: "" }; return v < 0 ? { me: t.low_self, others: t.low_others } : { me: t.high_self, others: t.high_others }; }
  const css = `
.ch-meter{display:grid;gap:3px}.ch-meter .hd{display:flex;align-items:baseline;gap:6px;font:800 .9rem var(--f-body,system-ui)}.ch-meter .hd small{color:var(--muted,#64748b);font-weight:700}
.ch-bar{position:relative;display:grid;grid-template-columns:repeat(5,1fr);gap:2px;height:14px}
.ch-bar i{border-radius:4px}.ch-bar i:nth-child(1),.ch-bar i:nth-child(5){background:#fca5a5}.ch-bar i:nth-child(2),.ch-bar i:nth-child(4){background:#fde68a}.ch-bar i:nth-child(3){background:linear-gradient(180deg,#fde047,#f59e0b)}
.ch-bar b{position:absolute;top:-5px;width:22px;height:22px;margin-left:-11px;border-radius:50%;background:#1e1b4b;border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35);transition:left .4s cubic-bezier(.34,1.56,.64,1)}
.ch-bar b.pl{width:18px;height:18px;margin-left:-9px;top:-3px;background:#fff;border:2px solid #1e1b4b;font-size:.62rem;display:grid;place-items:center}
.ch-ends{display:flex;justify-content:space-between;font:700 .7rem var(--f-body,system-ui);color:var(--muted,#64748b)}.ch-ends .g{color:#b45309}
.ch-say{font-size:.86rem;line-height:1.35}.ch-say b{font-weight:800}
.ch-places{display:flex;flex-wrap:wrap;gap:4px}.ch-places span{font:700 .74rem var(--f-body,system-ui);background:var(--paper,#f8fafc);border:1px solid var(--rule,#e2e8f0);border-radius:999px;padding:1px 8px}
.ch-str{display:flex;justify-content:space-between;gap:8px;align-items:center;padding:4px 0;border-bottom:1px dashed var(--rule,#e2e8f0);font-size:.9rem}.ch-str small{color:var(--muted,#64748b);font-weight:700}
.ch-str .d{font:800 .95rem var(--f-body,system-ui);letter-spacing:1px;white-space:nowrap}.ch-str .d1{color:#ca8a04}.ch-str .d2{color:#ea580c}.ch-str .d3{color:#dc2626}
.ch-cond{display:inline-flex;gap:4px;align-items:center;font:800 .78rem var(--f-body,system-ui);background:#ede9fe;color:#5b21b6;border-radius:999px;padding:2px 9px;border:0;cursor:pointer}
.ch-card{display:grid;gap:8px;background:var(--sheet,#fff);border:1.5px solid var(--rule,#e2e8f0);border-radius:16px;padding:12px;text-align:left;font-family:var(--f-body,system-ui);color:var(--ink,#0f172a)}
.ch-card .top{display:flex;gap:10px;align-items:center}.ch-card .em{font-size:2.2rem;line-height:1}.ch-card h3{margin:0;font:800 1.1rem var(--f-display,system-ui)}
.ch-card .meta{font:700 .78rem var(--f-body,system-ui);color:var(--muted,#64748b)}.ch-card .bio{margin:0;font-size:.9rem}
.ch-mini{display:flex;flex-wrap:wrap;gap:4px}.ch-mini span{font:700 .74rem var(--f-body,system-ui);border-radius:999px;padding:1px 8px;background:#fef3c7;color:#92400e}.ch-mini span.g{background:#dcfce7;color:#166534}
.ch-pick{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:8px;max-height:52vh;overflow:auto;padding:2px}
.ch-pick .ch-card{cursor:pointer}.ch-pick .ch-card:hover{border-color:var(--accent,#2347C5)}.ch-pick .ch-card.on{border-color:var(--accent,#2347C5);box-shadow:0 0 0 3px var(--accent-soft,#E6ECFB)}
.ch-pick .ch-card.used{opacity:.5;cursor:default}
.ch-dlg{border:0;border-radius:18px;padding:16px;max-width:min(920px,96vw);width:100%;background:var(--sheet,#fff);color:var(--ink,#0f172a)}.ch-dlg::backdrop{background:rgba(15,23,42,.45)}
.ch-filters{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:8px 0}.ch-filters input{flex:1 1 200px;font:600 .95rem var(--f-body,system-ui);padding:7px 10px;border:1.5px solid var(--rule,#e2e8f0);border-radius:10px}
.ch-filters button{border:1.5px solid var(--rule,#e2e8f0);background:var(--paper,#fff);border-radius:999px;padding:4px 10px;font:800 .8rem var(--f-body,system-ui);cursor:pointer;color:var(--ink,#0f172a)}.ch-filters button[aria-pressed=true]{background:var(--accent,#2347C5);color:#fff;border-color:var(--accent,#2347C5)}
.ch-name{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:10px}.ch-name input{font:700 1rem var(--f-body,system-ui);padding:8px 10px;border:1.5px solid var(--rule,#e2e8f0);border-radius:10px;flex:1 1 200px}`;
  const addCss = () => { if (!document.getElementById("chars-css")) { const s = document.createElement("style"); s.id = "chars-css"; s.textContent = css; document.head.appendChild(s); } };
  const pos = v => (Math.max(-2, Math.min(2, +v || 0)) + 2) * 20 + 10;
  // one trait on a meter: golden middle, marker at the level, little place markers when it changes with the place
  function meter(t, v, o = {}) {
    addCss(); const b = base(v), pl = byPlace(v), tx = levelText(t, b);
    return `<div class="ch-meter"><div class="hd">${esc(t.icon || "")} ${esc(t.name)} <small>· ${esc(levelName(t, b))}</small></div>
      <div class="ch-bar" role="img" aria-label="${esc(t.name)}: ${esc(levelName(t, b))}"><i></i><i></i><i></i><i></i><i></i><b style="left:${pos(b)}%"></b>${pl.map(([k, x]) => `<b class="pl" style="left:${pos(x)}%" title="${esc((L && L.P[k] || {}).name || k)}">${esc((L && L.P[k] || {}).icon || "•")}</b>`).join("")}</div>
      <div class="ch-ends"><span>◀ ${esc(t.low_name)}</span><span class="g">🌟 ${esc(t.mid_name)}</span><span>${esc(t.high_name)} ▶</span></div>
      ${o.text === false ? "" : `<div class="ch-say">${tx.me ? `🙋 <b>For them:</b> ${esc(tx.me)}` : ""}${tx.others ? `<br>👥 <b>For others:</b> ${esc(tx.others)}` : ""}</div>`}
      ${pl.length ? `<div class="ch-places">${pl.map(([k, x]) => `<span>${esc((L && L.P[k] || {}).icon || "")} ${esc((L && L.P[k] || {}).name || k)}: ${esc(levelName(t, x))}</span>`).join("")}</div>` : ""}</div>`;
  }
  // ---- 🧭 analysis: roots → traits / signs → conditions → tactics ----
  const known = (t, k) => !!(L && (t === "root" ? L.RT[k] : t === "trait" ? L.T[k] : t === "sign" ? L.S[k] : L.C[k]));
  const lvOf = v => v < 0 ? "low" : v > 0 ? "high" : "mid";
  // how strongly a character has something (0 = not at all)
  function has(c, t, k, lv) {
    if (t === "root") return +((c.roots || {})[k] || 0);
    if (t === "sign") return +((c.signs || {})[k] || 0);
    if (t === "condition") { if ((c.conditions || []).includes(k)) return lvl(c, k); const sub = (c.conditions || []).filter(x => L.C[x] && L.C[x].parent === k); return sub.length ? Math.max(...sub.map(x => lvl(c, x))) : 0; }
    const v = (c.traits || {})[k]; if (v == null) return 0;
    const vals = [base(v), ...byPlace(v).map(([, x]) => +x)], m = vals.filter(x => lvOf(x) === lv);
    return m.length ? (lv === "mid" ? 2 : Math.max(...m.map(x => Math.abs(x) === 2 ? 3 : 2))) : 0;
  }
  function label(t, k, lv) {
    if (t === "trait") { const x = L.T[k]; return x ? `${x.icon} ${lv === "low" ? x.low_name : lv === "high" ? x.high_name : "🌟 " + x.mid_name} (${x.name})` : k; }
    const x = t === "root" ? L.RT[k] : t === "sign" ? L.S[k] : L.C[k]; return x ? `${x.icon} ${x.name}` : k;
  }
  const advOf = (t, k) => L.advice.filter(a => a.target_type === t && a.target_key === k && L.Q[a.word_id] && (L.age == null || (L.Q[a.word_id].min_age || 0) <= L.age)).map(a => L.Q[a.word_id]);
  function analyse(c) {
    const out = { why: [], risks: [], protects: [], helps: [], advice: [] }, mine = [];
    ["condition", "sign"].forEach(t => (t === "condition" ? (c.conditions || []) : Object.keys(c.signs || {})).forEach(k => { if (has(c, t, k) && known(t, k)) mine.push({ t, k, n: has(c, t, k) }); }));
    Object.keys(c.traits || {}).forEach(k => ["low", "high"].forEach(lv => { const n = has(c, "trait", k, lv); if (n && known("trait", k)) mine.push({ t: "trait", k, lv, n }); }));
    const src = l => has(c, l.src_type, l.src_key, l.src_level);
    mine.forEach(m => { const from = L.links.filter(l => l.effect === "raises" && l.dst_type === m.t && l.dst_key === m.k && (l.dst_level || null) === (m.lv || null) && src(l) && known(l.src_type, l.src_key))
      .map(l => ({ t: l.src_type, k: l.src_key, lv: l.src_level, n: src(l), s: l.strength, note: l.note })).sort((a, b) => b.s * b.n - a.s * a.n);
      if (from.length && m.t !== "trait") out.why.push({ ...m, from }); });
    out.why.sort((a, b) => (a.t === "condition" ? 0 : 1) - (b.t === "condition" ? 0 : 1) || b.n - a.n);
    // what could grow next: things they don't have yet, pushed up by what they have, pushed down by what protects them
    const score = {};
    L.links.forEach(l => { if (l.dst_type === "trait" || l.dst_type === "root" || has(c, l.dst_type, l.dst_key) || !known(l.dst_type, l.dst_key)) return; const n = src(l); if (!n) return;
      const key = l.dst_type + ":" + l.dst_key, e = score[key] || (score[key] = { t: l.dst_type, k: l.dst_key, up: 0, down: 0, from: [], against: [] });
      if (l.effect === "raises") { e.up += l.strength * n / 2; e.from.push({ t: l.src_type, k: l.src_key, lv: l.src_level }); } else { e.down += l.strength * n / 2; e.against.push({ t: l.src_type, k: l.src_key, lv: l.src_level }); } });
    out.risks = Object.values(score).filter(e => e.up - e.down >= 3 && e.from.length >= 2).sort((a, b) => (b.up - b.down) - (a.up - a.down)).slice(0, 5);
    // what already protects them, and what would help with what they have
    L.links.filter(l => l.effect === "lowers" && src(l) && known(l.dst_type, l.dst_key)).forEach(l => out.protects.push({ src: { t: l.src_type, k: l.src_key, lv: l.src_level }, dst: { t: l.dst_type, k: l.dst_key, lv: l.dst_level } }));
    const roots = Object.keys(c.roots || {}).filter(k => c.roots[k] > 0 && known("root", k));
    mine.filter(m => m.t !== "trait").forEach(m => L.links.filter(l => l.effect === "lowers" && l.dst_type === m.t && l.dst_key === m.k && !src(l) && known(l.src_type, l.src_key))
      .forEach(l => { if (!out.helps.some(h => h.src.k === l.src_key && h.src.lv === l.src_level)) out.helps.push({ src: { t: l.src_type, k: l.src_key, lv: l.src_level }, dst: m }); }));
    roots.forEach(k => out.helps.push({ root: L.RT[k] }));
    const seen = new Set();
    [...roots.map(k => ["root", k]), ...mine.map(m => [m.t, m.k])].forEach(([t, k]) => advOf(t, k).forEach(q => { if (!seen.has(q.id)) { seen.add(q.id); out.advice.push({ q, for: label(t, k) }); } }));
    out.advice = out.advice.slice(0, 6);
    return out;
  }
  // a sign or condition with its strength: ●●○
  function strengthRow(icon, name, n, sub) { addCss(); return `<div class="ch-str"><span>${esc(icon || "")} <b>${esc(name)}</b>${sub ? ` <small>${esc(sub)}</small>` : ""}</span><span class="d d${n}" title="${STR[n]}">${dots(n)} <small>${STR[n]}</small></span></div>`; }
  // the traits that stand out (away from the middle), for a card
  function highlights(c, n = 4) {
    const out = []; Object.entries(c.traits || {}).forEach(([k, v]) => { const t = L && L.T[k]; if (!t) return; const b = base(v);
      out.push({ t, b, s: Math.abs(b) + (byPlace(v).length ? .5 : 0), txt: levelName(t, b) + (byPlace(v).some(([, x]) => x !== b) ? " (depends where)" : "") }); });
    return out.sort((a, b) => b.s - a.s).slice(0, n);
  }
  const STR = ["", "mild", "clear", "strong"], WEIGHT = ["", "sometimes", "often", "core sign"];
  const dots = n => "●".repeat(n) + "○".repeat(3 - n);
  const lvl = (c, k) => +((c.cond_levels || {})[k] || 2);
  const SEX = { female: "♀", male: "♂", other: "" }, EDU = { none: "", kindergarten: "kindergarten", primary: "primary school", middle: "middle school", high: "high school", university: "university", doctorate: "doctorate" };
  function card(c, o = {}) {
    addCss(); const r = L && L.R[c.role];
    return `<${o.tag || "div"} class="ch-card${o.cls ? " " + o.cls : ""}" ${o.attr || ""}><div class="top"><span class="em">${esc(c.emoji)}</span><div><h3>${esc(c.name)}</h3>
      <div class="meta">${[c.age != null ? `${c.age} yrs` : "", SEX[c.sex] || "", EDU[c.education] || "", r ? `${r.icon} ${r.name}` : ""].filter(Boolean).map(esc).join(" · ")}</div></div></div>
      ${c.bio ? `<p class="bio">${esc(c.bio)}</p>` : ""}
      <div class="ch-mini">${highlights(c).map(h => `<span class="${h.b ? "" : "g"}">${esc(h.t.icon)} ${esc(h.txt)}</span>`).join("")}${(c.conditions || []).map(k => L && L.C[k] ? `<span style="background:#ede9fe;color:#5b21b6" title="${STR[lvl(c, k)]}">${esc(L.C[k].icon)} ${esc(L.C[k].name)} <small>${dots(lvl(c, k))}</small></span>` : "").join("")}</div></${o.tag || "div"}>`;
  }
  // for the story writer: "complains a lot; at home explodes …"
  function personality(c) {
    const parts = [];
    Object.entries(c.traits || {}).forEach(([k, v]) => { const t = L && L.T[k]; if (!t) return; const b = base(v);
      let s = `${t.name}: ${levelName(t, b)}`; const pl = byPlace(v).filter(([, x]) => x !== b);
      if (pl.length) s += ` (${pl.map(([p, x]) => `${(L.P[p] || {}).name || p}: ${levelName(t, x)}`).join("; ")})`; parts.push(s); });
    (c.conditions || []).forEach(k => { const x = L && L.C[k]; if (x) parts.push(`${x.kind === "tactic" ? "uses" : x.kind === "emotion" ? "feels" : "shows signs of"} ${x.name} (${STR[lvl(c, k)]}${x.core ? `; core: ${x.core}; with others' pain: ${x.others_pain}` : ""})`); });
    const sg = Object.entries(c.signs || {}).filter(([k, n]) => n > 0 && L && L.S[k]).sort((a, b) => b[1] - a[1]);
    if (sg.length) parts.push("signs: " + sg.map(([k, n]) => `${L.S[k].name} (${STR[n]})`).join(", "));
    const rt = Object.entries(c.roots || {}).filter(([k, n]) => n > 0 && L && L.RT[k]);
    if (rt.length) parts.push("underneath (roots): " + rt.map(([k, n]) => `${L.RT[k].name} (${STR[n]})`).join(", "));
    if (L && L.links) { const a = analyse(c).advice.slice(0, 2); if (a.length) parts.push("advice that fits them (a wise character may say it): " + a.map(x => `"${x.q.headword}"${x.q.author ? ` (${x.q.author.split(" · ")[0]})` : ""}`).join(" / ")); }
    return parts.join("; ");
  }
  const pronounOf = c => c.sex === "female" ? "she" : c.sex === "male" ? "he" : "it";
  // pick one character from the library: resolves { lib, name } or null. used = library ids already in the story
  function pick(o = {}) {
    addCss();
    return new Promise(async res => {
      const d = document.createElement("dialog"); d.className = "ch-dlg"; document.body.appendChild(d);
      d.innerHTML = `<p class="muted">Loading the characters…</p>`; d.showModal();
      try { await load(); } catch (e) { d.innerHTML = `<p>Could not load the character library.</p>`; }
      const st = { q: "", role: "", sel: null };
      const used = new Set(o.used || []);
      const draw = () => {
        const list = L.chars.filter(c => (!st.role || c.role === st.role) && (!st.q || (c.name + " " + (c.bio || "")).toLowerCase().includes(st.q.toLowerCase())));
        const sel = st.sel && L.chars.find(c => c.id === st.sel);
        d.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><h2 style="margin:0">🎭 Choose a character</h2><button type="button" class="btn small" data-x="1">✕</button></div>
          <p class="muted" style="margin:4px 0 0">Every character has a personality: some complain, some encourage, some cross lines. Pick who fits your story. You can give them another name.</p>
          <div class="ch-filters"><input type="search" data-q placeholder="Search by name or what they are like" value="${esc(st.q)}"><button type="button" data-role="" aria-pressed="${!st.role}">All</button>${L.roles.filter(r => L.chars.some(c => c.role === r.key)).map(r => `<button type="button" data-role="${r.key}" aria-pressed="${st.role === r.key}">${r.icon} ${esc(r.name)}</button>`).join("")}</div>
          ${sel ? `<div class="ch-name">${card(sel, { cls: "on" })}<div style="display:grid;gap:6px;flex:1 1 260px"><label class="muted">Their name in your story<input data-nm maxlength="40" value="${esc(st.nm != null ? st.nm : sel.name)}"></label>
            <div style="display:flex;gap:6px"><button type="button" class="btn primary" data-ok="1">✓ Add ${esc(sel.emoji)} to my story</button><button type="button" class="btn" data-back="1">Back</button></div></div></div>`
          : `<div class="ch-pick">${list.map(c => card(c, { tag: "button", attr: `type="button" data-id="${c.id}"${used.has(c.id) ? " disabled" : ""}`, cls: used.has(c.id) ? "used" : "" })).join("") || `<p class="muted">No characters found.</p>`}</div>`}`;
        const qi = d.querySelector("[data-q]"); if (qi) qi.oninput = () => { st.q = qi.value; const p = qi.selectionStart; draw(); const q2 = d.querySelector("[data-q]"); q2.focus(); q2.setSelectionRange(p, p); };
      };
      const done = v => { d.close(); d.remove(); res(v); };
      d.addEventListener("cancel", e => { e.preventDefault(); done(null); });
      d.addEventListener("click", e => {
        if (e.target.closest("[data-x]")) return done(null);
        const r = e.target.closest("[data-role]"); if (r) { st.role = r.dataset.role; return draw(); }
        const c = e.target.closest("[data-id]"); if (c && !c.disabled) { st.sel = c.dataset.id; st.nm = null; return draw(); }
        if (e.target.closest("[data-back]")) { st.sel = null; return draw(); }
        if (e.target.closest("[data-ok]")) { const lib = L.chars.find(x => x.id === st.sel), nm = (d.querySelector("[data-nm]").value || "").trim().replace(/\s+/g, " ") || lib.name; return done({ lib, name: nm }); }
      });
      d.addEventListener("input", e => { if (e.target.matches("[data-nm]")) st.nm = e.target.value; });
      if (L) draw();
    });
  }
  // a story character made from a library character (a copy, so old stories keep working)
  function forStory(lib, name) {
    return { id: "c" + Date.now().toString(36), lib: lib.id, name, libName: lib.name, emoji: lib.emoji, age: lib.age != null ? String(lib.age) : "", sex: lib.sex || "", role: lib.role || "",
      look: lib.bio || "", pr: pronounOf(lib), traits: lib.traits || {}, conditions: lib.conditions || [], signs: lib.signs || {}, cond_levels: lib.cond_levels || {}, roots: lib.roots || {}, persona: personality(lib) };
  }
  window.Chars = { analyse, has, label, advOf, STR, WEIGHT, dots, lvl, strengthRow, load, get lib() { return L; }, meter, card, highlights, personality, levelName, levelText, pick, forStory, pronounOf, base, byPlace, esc };
})();
