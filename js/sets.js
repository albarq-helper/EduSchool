/* Loads one study set from the database for the activity pages, then starts the page.
   Page scripts are marked type="text/x-app" and run after the set is ready. */
(function () {
  const G5 = "00000000-0000-4000-8000-000000000005";
  const LANGS = { en: "English", ar: "Arabic", fr: "French", es: "Spanish", de: "German", tr: "Turkish", ur: "Urdu", hi: "Hindi", zh: "Chinese", ja: "Japanese", ko: "Korean", ru: "Russian", it: "Italian", pt: "Portuguese", id: "Indonesian", ms: "Malay", fa: "Persian", bn: "Bengali", tl: "Filipino", sw: "Swahili", la: "Latin" };
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const qs = new URLSearchParams(location.search);
  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };

  // Tile for terms without a clip or picture: the term's emoji when it has one, else its first letter.
  function tile(term, emoji) {
    const pal = [["#E6ECFB", "#2347C5"], ["#DDF3EE", "#127A68"], ["#FDE7DF", "#B4472A"], ["#FFF3CC", "#8A6100"], ["#EDE6FB", "#6236C5"]];
    let h = 0; for (const c of String(term)) h = (h * 31 + c.codePointAt(0)) >>> 0;
    const [bg, fg] = pal[h % pal.length], ch = esc((String(term).trim()[0] || "?").toUpperCase());
    if (emoji) {
      const em = esc(emoji);
      return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="24" fill="${bg}"/><text x="60" y="62" dominant-baseline="middle" font-family="'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif" font-size="66" text-anchor="middle">${em}</text></svg>`);
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="24" fill="${bg}"/><text x="60" y="80" font-family="system-ui,sans-serif" font-size="64" font-weight="800" text-anchor="middle" fill="${fg}">${ch}</text></svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }
  // Rough syllable split for Latin-script single words (used by the syllable builder).
  function autoSyl(w) {
    const s = String(w).toLowerCase();
    if (!/^[a-z']+$/.test(s) || s.length < 4) return s;
    const parts = s.match(/[^aeiouy]*[aeiouy]+(?:[^aeiouy]*$|[^aeiouy](?=[^aeiouy]))?/g);
    return parts && parts.join("") === s ? parts.join("-") : s;
  }
  // Put [brackets] round the term in the example so "fill the blank" works.
  function blankify(ex, term) {
    if (!ex) return "[" + term + "]";
    if (/\[[^\]]+\]/.test(ex)) return ex;
    const i = ex.toLowerCase().indexOf(String(term).toLowerCase());
    return i >= 0 ? ex.slice(0, i) + "[" + ex.slice(i, i + term.length) + "]" + ex.slice(i + term.length) : ex + " — [" + term + "]";
  }
  let voice = null;
  function speak(text, rate) {
    if (!("speechSynthesis" in window)) return false;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(String(text).replace(/\s*\(.*\)/, ""));
      u.lang = window.SET_LANG || "en"; u.rate = rate || .85;
      if (!voice) voice = speechSynthesis.getVoices().find(v => v.lang.toLowerCase().startsWith(u.lang.toLowerCase())) || null;
      if (voice) u.voice = voice;
      speechSynthesis.speak(u); return true;
    } catch (e) { return false; }
  }

  // Multi-unit picker (the same one as on the Exam page). Remembers the choice (shared with the Exam page).
  // Sets.unitPicker(mountEl, onChange) -> { selected(): number[], match(word): bool }
  function unitPicker(mount, onChange) {
    const U = window.UNITS_LIST || [], KEY = "vocabUnitsSel";
    if (!document.getElementById("unitpick-css")) document.head.insertAdjacentHTML("beforeend", `<style id="unitpick-css">.unitpick{position:relative}
.unitpick summary{list-style:none;cursor:pointer;font:inherit;padding:8px 30px 8px 10px;border:1px solid var(--rule);border-radius:8px;background:var(--sheet);color:var(--ink);min-width:12rem;max-width:100%;position:relative}
.unitpick summary::-webkit-details-marker{display:none}
.unitpick summary::after{content:"\\25BE";position:absolute;right:10px;top:50%;transform:translateY(-50%);color:var(--muted)}
.unitpick[open] summary{border-color:var(--accent)}
.unitpick .ubox{position:absolute;z-index:20;top:calc(100% + 4px);left:0;width:min(23rem,calc(100vw - 32px));max-height:min(60vh,26rem);overflow:auto;background:var(--sheet);border:1px solid var(--rule);border-radius:10px;padding:10px;box-shadow:0 10px 24px rgba(0,0,0,.18);display:flex;flex-direction:column;gap:4px}
.unitpick .uquick{display:flex;flex-wrap:wrap;gap:6px;padding-bottom:8px;margin-bottom:4px;border-bottom:1px solid var(--rule)}
.unitpick .uquick button{font:700 .82rem var(--f-body);padding:5px 10px;border-radius:999px;border:1px solid var(--accent);background:transparent;color:var(--accent);cursor:pointer}
.unitpick label{display:flex;gap:8px;align-items:flex-start;padding:5px 4px;border-radius:6px;cursor:pointer;font-size:.92rem;line-height:1.3}
.unitpick label:hover{background:var(--accent-soft)}
.unitpick input{width:18px;height:18px;flex:none;margin-top:1px;accent-color:var(--accent)}
.unitpick .uc{margin-left:auto;color:var(--muted);font-variant-numeric:tabular-nums;padding-left:8px}
.unitpick .uwarn{color:var(--bad);font-size:.85rem;font-weight:700;padding:4px}</style>`);
    mount.innerHTML = `<details class="unitpick"><summary></summary><div class="ubox"></div></details>`;
    const det = mount.querySelector("details"), sum = mount.querySelector("summary"), box = mount.querySelector(".ubox");
    let saved = null; try { saved = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) {}
    const name = x => x.u ? (x.name ? `Unit ${x.u} · ${x.name}` : `Unit ${x.u}`) : (x.name || "General");
    box.innerHTML = `<div class="uquick"><button type="button" data-q="all">All</button><button type="button" data-q="none">None</button></div>` +
      U.map(x => `<label><input type="checkbox" value="${x.u}" ${!saved || saved.includes(x.u) ? "checked" : ""}><span>${esc(name(x))}</span><span class="uc">${x.n}</span></label>`).join("") +
      `<div class="uwarn" hidden>Tick at least one unit.</div>`;
    const sel = () => [...box.querySelectorAll("input:checked")].map(c => +c.value);
    if (!sel().length) box.querySelectorAll("input").forEach(c => c.checked = true);
    const match = w => { const S = sel(); return S.includes(w.u) || (w.also || []).some(u => S.includes(u)); };
    const range = S => { const n = S.filter(u => u > 0).sort((a, b) => a - b), out = [];
      for (let k = 0; k < n.length;) { let j = k; while (j + 1 < n.length && n[j + 1] === n[j] + 1) j++; out.push(j > k ? `${n[k]}–${n[j]}` : `${n[k]}`); k = j + 1; }
      let t = out.length ? (n.length > 1 ? "Units " : "Unit ") + out.join(", ") : ""; if (S.includes(0)) t += (t ? " + " : "") + "general"; return t; };
    const summary = () => { const S = sel(), n = (window.WORDS || []).filter(match).length;
      sum.textContent = !S.length ? "Choose at least one unit" : (S.length === U.length ? "All units" : (S.length === 1 ? name(U.find(x => x.u === S[0]) || { u: S[0] }) : range(S))) + ` (${n} words)`;
      box.querySelector(".uwarn").hidden = !!S.length; try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
    box.addEventListener("click", e => { const b = e.target.closest("[data-q]"); if (!b) return;
      box.querySelectorAll("input").forEach(c => c.checked = b.dataset.q === "all"); summary(); onChange && onChange(); });
    box.addEventListener("change", () => { summary(); onChange && onChange(); });
    document.addEventListener("click", e => { if (det.open && !det.contains(e.target)) det.open = false; });
    summary();
    return { selected: sel, match, refresh: summary };
  }
  // ---------- word groups (tags) ----------
  // Tag kinds: word type (fixed names), opposites ("⇄ Group: side"), and themes (everything else).
  // word types: [stored tag, icon, grammar name shown to children]
  const TYPES = [["Naming: things & places", "📦", "Noun · thing or place"], ["Naming: people", "🧑", "Noun · person"], ["Action", "🏃", "Verb · action"],
    ["Describing", "🎨", "Adjective · describes a noun"], ["Adverb", "⏩", "Adverb · how, when, how often"], ["Phrasal verb", "🧩", "Phrasal verb"], ["Idiom", "💬", "Idiom"], ["Saying", "📜", "Famous saying"], ["Camera", "🎥", "Camera & light"], ["Music", "🎵", "Music & sound"]];
  const typeName = t => { const x = TYPES.find(y => y[0] === t); return x ? x[2] : t; };
  const THEME_ICONS = { "Feelings & moods": "😊", "Homes & buildings": "🏠", "Animals": "🐾", "Plants, nature & weather": "🌿", "Health & body": "🩺",
    "Food & drink": "🍵", "Money & work": "💼", "Words & books": "📚", "Looking & seeing": "👀", "Ways of moving": "🦶", "Light & sound": "🔆",
    "Size, amount & distance": "📏", "Danger & safety": "⚠️", "Getting along": "🤝", "Government & law": "🏛️", "Good & great": "⭐",
    "Important & famous": "🏆", "Science": "🔬", "Time & change": "⏳", "Saying & thinking": "💬", "Places & travel": "🧭", "Character": "🧠", "How things are done": "⚙️", "Ways to show love": "💞", "Caring qualities": "🤲",
    "Time & order": "⏰", "Adding ideas": "➕", "Contrast": "⚖️", "Cause & effect": "💡", "Examples": "🔍", "Endings": "🎬" };
  const isType = t => TYPES.some(x => x[0] === t), isOpp = t => /^⇄\s/.test(t), isScale = t => /^📶\s/.test(t), isSim = t => /^≈\s/.test(t), simName = t => t.replace(/^≈\s*/, "").trim();
  // "📶 Hate ⇄ Love: -4" -> {g:"Hate ⇄ Love", r:-4}
  const scaleSplit = t => { const m = t.replace(/^📶\s*/, "").match(/^(.*?):\s*([+-]?\d+)\s*$/); return m ? { g: m[1].trim(), r: +m[2] } : { g: t.replace(/^📶\s*/, ""), r: 0 }; };
  const oppSplit = t => { const m = t.replace(/^⇄\s*/, "").match(/^(.*?):\s*(.+)$/); return m ? { g: m[1].trim(), side: m[2].trim() } : { g: t.replace(/^⇄\s*/, ""), side: "" }; };
  const tagIcon = t => isType(t) ? TYPES.find(x => x[0] === t)[1] : isScale(t) ? "📶" : isSim(t) ? "≈" : isOpp(t) ? "⇄" : THEME_ICONS[t] || "🏷️";
  // all groups present in a word list: {types:[{tag,n}], themes:[{tag,n}], opps:[{g, sides:[a,b], n}]}
  function groupsOf(D) {
    const cnt = new Map(), opp = new Map(), scl = new Map(), sim = new Map();
    D.forEach(v => (v.tags || []).forEach(t => { if (isScale(t)) { const x = scaleSplit(t); scl.set(x.g, (scl.get(x.g) || 0) + 1); } else if (isSim(t)) { const g = simName(t); sim.set(g, (sim.get(g) || 0) + 1); } else if (isOpp(t)) { const o = oppSplit(t); if (!opp.has(o.g)) opp.set(o.g, new Map()); const m = opp.get(o.g); m.set(o.side, (m.get(o.side) || 0) + 1); } else cnt.set(t, (cnt.get(t) || 0) + 1); }));
    const themes = [...cnt].filter(([t]) => !isType(t)).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([tag, n]) => ({ tag, n }));
    const types = TYPES.filter(([t]) => cnt.has(t)).map(([tag]) => ({ tag, n: cnt.get(tag) }));
    const opps = [...opp].map(([g, m]) => { const sides = [...m.keys()]; const want = g.split(/\s+vs\.?\s+/i).map(x => x.trim().toLowerCase());
      sides.sort((a, b) => (want.indexOf(a.toLowerCase()) + 1 || 9) - (want.indexOf(b.toLowerCase()) + 1 || 9)); return { g, sides, n: [...m.values()].reduce((a, b) => a + b, 0) }; })
      .sort((a, b) => b.n - a.n);
    const scales = [...scl].map(([g, n]) => ({ g, n })).sort((a, b) => b.n - a.n);
    const sims = [...sim].filter(([g, n]) => n > 0).map(([g, n]) => ({ g, n })).sort((a, b) => b.n - a.n || a.g.localeCompare(b.g));
    return { types, themes, opps, scales, sims };
  }
  // the groups one word belongs to: [{kind:"scale"|"opp"|"theme", tag, label, r?, side?}]
  function wordGroups(v) {
    const out = [];
    (v.tags || []).forEach(t => {
      if (isScale(t)) { const x = scaleSplit(t); out.push({ kind: "scale", tag: x.g, r: x.r, label: "🎚️ " + x.g + " · level " + (x.r > 0 && /⇄/.test(x.g) ? "+" : "") + x.r }); }
      else if (isSim(t)) out.push({ kind: "sim", tag: simName(t), label: "≈ " + simName(t) });
      else if (isOpp(t)) { const o = oppSplit(t); out.push({ kind: "opp", tag: o.g, side: o.side, label: "⇄ " + o.g + (o.side ? " · " + o.side : "") }); }
      else if (!isType(t)) out.push({ kind: "theme", tag: t, label: tagIcon(t) + " " + t });
    });
    const ord = { scale: 0, sim: 1, opp: 2, theme: 3 };
    return out.sort((a, b) => ord[a.kind] - ord[b.kind]);
  }
  // Sets.groupPicker(mountEl, onChange, {words, key, kind}) -> { match(word), sections(indices), state(), set(kind, tag) }
  // words: the words whose groups to offer (default: all words); kind: the tab to open first.
  function groupPicker(mount, onChange, opts) {
    opts = opts || {}; const D = window.WORDS || [], G = groupsOf(opts.words || D), KEY = opts.key || "wordGroupSel";
    if (!G.types.length && !G.themes.length && !G.opps.length && !G.scales.length && !G.sims.length) { mount.innerHTML = ""; return { match: () => true, sections: L => [{ items: L }], state: () => ({ kind: "all" }), view: () => ({ mode: "both", follow: false }), set: () => {}, has: () => false }; }
    if (!document.getElementById("gpick-css")) document.head.insertAdjacentHTML("beforeend", `<style id="gpick-css">.gpick{display:flex;flex-direction:column;gap:8px;width:100%}
.gpick .gk{display:inline-flex;flex-wrap:wrap;gap:4px;align-self:flex-start;border:1px solid var(--rule);border-radius:12px;padding:3px;background:var(--paper)}
.gpick .gk button{border:0;background:transparent;font:700 .86rem var(--f-body);color:var(--muted);padding:6px 11px;border-radius:9px;cursor:pointer}
.gpick .gk button[aria-pressed="true"]{background:var(--sheet);color:var(--ink);box-shadow:inset 0 0 0 2px var(--accent)}
.gpick .gc{display:flex;flex-wrap:wrap;gap:6px}
.gpick .gc button{font:700 .84rem var(--f-body);padding:5px 11px;border-radius:999px;border:1.5px solid var(--chip-edge,var(--rule));background:var(--chip,var(--paper));color:var(--ink);cursor:pointer}
.gpick .gc button[aria-pressed="true"]{background:var(--accent);border-color:var(--accent);color:#fff}
.gpick .gc small{opacity:.7;font-weight:700;margin-left:3px}
.gpick .gv{display:flex;flex-wrap:wrap;gap:6px;align-items:center;font:700 .82rem var(--f-body);color:var(--muted)}
.gpick .gv button{font:700 .82rem var(--f-body);padding:5px 10px;border-radius:9px;border:1.5px solid var(--rule);background:var(--sheet);color:var(--ink);cursor:pointer}
.gpick .gv button[aria-pressed="true"]{border-color:var(--accent);box-shadow:inset 0 0 0 1px var(--accent);color:var(--accent)}
.gpick .gvsep{width:1px;height:20px;background:var(--rule);margin:0 4px}
.gsec{margin:14px 0 6px;font:800 1.05rem var(--f-display);display:flex;gap:8px;align-items:center}.gsec small{font:700 .82rem var(--f-body);color:var(--muted)}
.gopp{display:grid;grid-template-columns:1fr auto 1fr;gap:12px;align-items:start}.gopp .gvs{font:800 1.6rem var(--f-display);color:var(--accent);align-self:center}
.gopp h4{margin:0 0 6px;font:800 .82rem var(--f-body);letter-spacing:.06em;text-transform:uppercase;color:var(--accent)}
@media (max-width:640px){.gopp{grid-template-columns:1fr}.gopp .gvs{justify-self:center}}
.gscale{display:flex;flex-direction:column;gap:8px;margin-bottom:6px}
.gsbar{display:flex;align-items:center;gap:10px;font:800 .9rem var(--f-body)}.gsbar .gsgrad{flex:1;height:10px;border-radius:99px;background:linear-gradient(90deg,hsl(0 75% 55%),hsl(220 15% 85%),hsl(145 55% 45%))}
.gsbar .gsgrad.one{background:linear-gradient(90deg,hsl(145 55% 60%),hsl(40 85% 60%),hsl(0 80% 50%))}
.gsstrip{display:flex;gap:4px;overflow-x:auto;padding-bottom:4px}
.gss{flex:1 0 auto;min-width:74px;border-radius:10px;padding:6px 8px;display:flex;flex-direction:column;gap:3px;color:#1f2937}
.gss b{font:800 .85rem var(--f-display);opacity:.8}.gss span{font:700 .82rem var(--f-body);white-space:nowrap}
.gslv{display:grid;grid-template-columns:110px 1fr;gap:10px;align-items:start}
.gsr{border-radius:12px;padding:8px 10px;display:flex;flex-direction:column;gap:2px;color:#1f2937}.gsr span{font:800 1.3rem var(--f-display)}.gsr small{font:700 .74rem var(--f-body);opacity:.85}
@media (max-width:640px){.gslv{grid-template-columns:1fr}}</style>`);
    let st = { kind: opts.kind || "all", tag: "", view: opts.view || "both", follow: opts.follow !== false }; try { st = Object.assign(st, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) {}
    if (!["both", "meter", "list"].includes(st.view)) st.view = "both";
    const kinds = [["all", "All words"], ["type", "🔤 Word type"], ["theme", "🏷️ Themes"], ["scale", "🎚️ Meters"], ["sim", "≈ Similar words"], ["opp", "⇄ Opposites"]].filter(([k]) => k === "all" || (k === "type" ? G.types.length : k === "theme" ? G.themes.length : k === "scale" ? G.scales.length : k === "sim" ? G.sims.length : G.opps.length));
    if (!kinds.some(k => k[0] === st.kind)) st = { kind: "all", tag: "" };
    if (st.tag && !(st.kind === "opp" ? G.opps.some(x => x.g === st.tag) : st.kind === "scale" ? G.scales.some(x => x.g === st.tag) : st.kind === "sim" ? G.sims.some(x => x.g === st.tag) : (st.kind === "type" ? G.types : G.themes).some(x => x.tag === st.tag))) st.tag = "";
    function draw() {
      const chips = st.kind === "type" ? G.types.map(x => [x.tag, tagIcon(x.tag) + " " + typeName(x.tag), x.n]) : st.kind === "theme" ? G.themes.map(x => [x.tag, tagIcon(x.tag) + " " + x.tag, x.n])
        : st.kind === "sim" ? G.sims.map(x => [x.g, "≈ " + x.g, x.n]) : st.kind === "opp" ? G.opps.map(x => [x.g, x.sides.join(" ⇄ "), x.n]) : st.kind === "scale" ? G.scales.map(x => [x.g, "🎚️ " + x.g, x.n]) : [];
      const vrow = st.kind === "scale" ? `<div class="gv" role="group" aria-label="Show"><span>Show</span>${[["both", "🎚️ Meter + cards"], ["meter", "🎚️ Meter only"], ["list", "📋 Full list"]].map(([v, l]) => `<button type="button" data-view="${v}" aria-pressed="${st.view === v}">${l}</button>`).join("")}
        ${st.view === "both" ? `<span class="gvsep"></span><span>Cards</span><button type="button" data-follow="1" aria-pressed="${!!st.follow}">Follow the meter</button><button type="button" data-follow="0" aria-pressed="${!st.follow}">All levels</button>` : ""}</div>` : "";
      mount.innerHTML = `<div class="gpick"><div class="gk" role="group" aria-label="Group the words">${kinds.map(([k, l]) => `<button type="button" data-k="${k}" aria-pressed="${st.kind === k}">${l}</button>`).join("")}</div>
        ${chips.length ? `<div class="gc" role="group" aria-label="Choose a group"><button type="button" data-t="" aria-pressed="${!st.tag}">All groups</button>${chips.map(([t, l, n]) => `<button type="button" data-t="${esc(t)}" aria-pressed="${st.tag === t}">${esc(l)}<small>${n}</small></button>`).join("")}</div>` : ""}${vrow}</div>`;
    }
    mount.addEventListener("click", e => { const k = e.target.closest("[data-k]"), t = e.target.closest("[data-t]"), vw = e.target.closest("[data-view]"), fl = e.target.closest("[data-follow]");
      if (k) st = { ...st, kind: k.dataset.k, tag: "" }; else if (t) st.tag = t.dataset.t; else if (vw) st.view = vw.dataset.view; else if (fl) st.follow = fl.dataset.follow === "1"; else return;
      try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} draw(); onChange && onChange(); });
    const has = (v, t) => (v.tags || []).includes(t), simOf = (v, g) => (v.tags || []).some(t => isSim(t) && simName(t) === g), oppTags = (v, g) => (v.tags || []).filter(t => isOpp(t) && oppSplit(t).g === g);
    const scaleOf = (v, g) => { const t = (v.tags || []).find(t => isScale(t) && scaleSplit(t).g === g); return t ? scaleSplit(t).r : null; };
    function match(v) { if (st.kind === "all" || !st.tag) return true; return st.kind === "opp" ? oppTags(v, st.tag).length > 0 : st.kind === "sim" ? simOf(v, st.tag) : st.kind === "scale" ? scaleOf(v, st.tag) !== null : has(v, st.tag); }
    // sections for display: [{title, icon, items}] or [{title, sides:[{name, items}]}]
    function sections(L) {
      if (st.kind === "all") return [{ items: L }];
      if (st.kind === "scale") { const gs = st.tag ? G.scales.filter(x => x.g === st.tag) : G.scales;
        // the whole scale: this list's words, plus the same scale's words from other boxes and the dictionary ("extra words")
        const inL = new Set(L), terms = new Set(L.map(i => String(D[i].w).toLowerCase()));
        return gs.map(o => { const lv = new Map(), extra = [];
          const put = i => { const r = scaleOf(D[i], o.g); if (r === null) return; if (!lv.has(r)) lv.set(r, []); lv.get(r).push(i); };
          L.forEach(put);
          D.forEach((v, i) => { if (inL.has(i) || scaleOf(v, o.g) === null) return; const t = String(v.w).toLowerCase(); if (terms.has(t)) return; terms.add(t); extra.push(i); put(i); });
          const poles = o.g.split(/\s*(?:⇄|→|->|<->|vs\.?)\s*/); const levels = [...lv].sort((a, b) => a[0] - b[0]).map(([rank, items]) => ({ rank, items }));
          return { title: o.g, icon: "📶", scale: { left: poles[0] || "", right: poles[1] || "", two: /⇄/.test(o.g) || (levels.some(l => l.rank < 0) && levels.some(l => l.rank > 0)), levels, extra } }; }).filter(x => x.scale.levels.length); }
      // words outside this list that belong to group test(v): other units and dictionary words ("extra words")
      const extrasFor = (L, test) => { const inL = new Set(L), terms = new Set(L.map(i => String(D[i].w).toLowerCase())), out = [];
        D.forEach((v, i) => { if (inL.has(i) || !test(v)) return; const t = String(v.w).toLowerCase(); if (terms.has(t)) return; terms.add(t); out.push(i); }); return out; };
      if (st.kind === "sim") { const gs = st.tag ? G.sims.filter(x => x.g === st.tag) : G.sims;
        return gs.map(o => { const items = L.filter(i => simOf(D[i], o.g)); return items.length ? { title: o.g, icon: "≈", items: items.concat(extrasFor(items, v => simOf(v, o.g))) } : null; }).filter(Boolean); }
      if (st.kind === "opp") { const gs = st.tag ? G.opps.filter(x => x.g === st.tag) : G.opps;
        return gs.map(o => { const mine = L.filter(i => oppTags(D[i], o.g).length); if (!mine.length) return null;
          const all = mine.concat(extrasFor(mine, v => oppTags(v, o.g).length > 0)), sides = [...o.sides];
          all.forEach(i => oppTags(D[i], o.g).forEach(t => { const sd = oppSplit(t).side; if (!sides.includes(sd)) sides.push(sd); }));
          const want = o.g.split(/\s+vs\.?\s+/i).map(x => x.trim().toLowerCase());
          sides.sort((a, b) => (want.indexOf(a.toLowerCase()) + 1 || 9) - (want.indexOf(b.toLowerCase()) + 1 || 9));
          return { title: o.g, icon: "⇄", sides: sides.map(sd => ({ name: sd, items: all.filter(i => oppTags(D[i], o.g).some(t => oppSplit(t).side === sd)) })) }; }).filter(Boolean); }
      const list = st.tag ? [st.tag] : (st.kind === "type" ? G.types : G.themes).map(x => x.tag);
      const out = list.map(t => ({ title: st.kind === "type" ? typeName(t) : t, icon: tagIcon(t), items: L.filter(i => has(D[i], t)) })).filter(x => x.items.length);
      if (!st.tag) { const rest = L.filter(i => !(D[i].tags || []).some(t => st.kind === "type" ? isType(t) : !isType(t) && !isOpp(t) && !isScale(t) && !isSim(t))); if (rest.length) out.push({ title: st.kind === "type" ? "Other" : "No theme yet", icon: "🏷️", items: rest }); }
      return out;
    }
    draw();
    const hasGroup = (k, t) => k === "opp" ? G.opps.some(x => x.g === t) : k === "scale" ? G.scales.some(x => x.g === t) : k === "sim" ? G.sims.some(x => x.g === t) : k === "theme" ? G.themes.some(x => x.tag === t) : G.types.some(x => x.tag === t);
    return { match, sections, has: hasGroup, state: () => ({ ...st }), view: () => ({ mode: st.view, follow: st.view === "both" && !!st.follow }), set: (kind, tag) => { st = { ...st, kind, tag: tag || "" }; try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} draw(); onChange && onChange(); } };
  }
  // Draw groupPicker sections. view(indices) returns the HTML for a list of words in the page's own style.
  function sectionsHTML(secs, view, opts) {
    opts = opts || {}; const mode = opts.mode || (opts.rows === false ? "meter" : "both"), useMeter = !!window.Meter && opts.meter !== false && mode !== "list";
    const lab2 = r => r === 0 ? "neutral" : ["", "a little", "some", "strong", "very strong", "strongest"][Math.min(5, Math.abs(r))];
    const lab1 = (r, S) => r === 0 ? String((S && S.left) || "lowest").toLowerCase() : ["", "a little", "some", "strong", "very strong", "strongest"][Math.min(5, r)];
    // same colours as the meter: red (bad, left) → green (good, right); neutral meters in blue
    let colT = null; const col = (r, two, title, levels) => { if (window.Meter && Meter.color && levels) return Meter.color(r, Meter.tone(title, levels)); const a = Math.min(5, Math.abs(r)); if (two) return r < 0 ? `hsl(0 75% ${92 - a * 9}%)` : r > 0 ? `hsl(145 55% ${92 - a * 9}%)` : "hsl(220 15% 90%)";
      return r <= 0 ? "hsl(145 55% 85%)" : `hsl(${40 - a * 8} 85% ${90 - a * 7}%)`; };
    return secs.map(sc => {
      if (sc.scale) { const S = sc.scale;
        const D = window.WORDS || [];
        const strip = `<div class="gsstrip">${S.levels.map(l => `<div class="gss" style="background:${col(l.rank, S.two, sc.title, S.levels)}"><b>${l.rank > 0 ? "+" : ""}${l.rank}</b>${l.items.map(i => `<span>${esc(String(D[i] ? D[i].w : "").replace(/\s*\(.*\)/, ""))}</span>`).join("")}</div>`).join("")}</div>`;
        const k = secs.indexOf(sc);
        if (useMeter && mode === "meter") return `<h3 class="gsec">🎚️ ${esc(sc.title)}</h3><div class="gscale"><div class="meterbox" data-mi="${k}"></div></div>`;
        return `<h3 class="gsec">${useMeter ? "🎚️" : "📶"} ${esc(sc.title)}</h3><div class="gscale">${useMeter ? `<div class="meterbox" data-mi="${k}"></div>` : `<div class="gsbar"><b>${esc(S.left)}</b><span class="gsgrad${S.two ? "" : " one"}"></span><b>${esc(S.right)}</b></div>${strip}`}
          ${S.levels.map(l => `<div class="gslv" data-rank="${l.rank}"><div class="gsr" style="background:${col(l.rank, S.two, sc.title, S.levels)}"><span>${l.rank > 0 ? "+" : ""}${l.rank}</span><small>${S.two ? lab2(l.rank) : lab1(l.rank, S)}${S.two && l.rank ? " · " + esc(l.rank < 0 ? S.left : S.right) : ""}</small></div><div class="gsw">${view(l.items)}</div></div>`).join("")}</div>`; }
      if (sc.sides) return `<h3 class="gsec">⇄ ${esc(sc.title)}</h3><div class="gopp">${sc.sides.map((sd, k) => `${k ? '<div class="gvs" aria-hidden="true">⇄</div>' : ""}<div><h4>${esc(sd.name)}</h4>${sd.items.length ? view(sd.items) : '<p class="muted">—</p>'}</div>`).join("")}</div>`;
      return (sc.title ? `<h3 class="gsec">${sc.icon} ${esc(sc.title)} <small>${sc.items.length} word${sc.items.length === 1 ? "" : "s"}</small></h3>` : "") + view(sc.items);
    }).join("");
  }
  // Story builder word boxes: the current set plus every set marked study_sets.story_box ('words' or 'link').
  // Their words are added to window.WORDS (each word gets .box = set id) so stories can use them everywhere.
  // -> [{id, title, kind:'set'|'words'|'link', icon, idx:[indices into window.WORDS]}]
  async function loadBoxes(cur) {
    const D = window.WORDS || (window.WORDS = []), C = App.client;
    D.forEach(v => { if (!v.box) v.box = cur.id; });
    const boxes = [{ id: cur.id, title: cur.title, kind: "set", icon: "📘", idx: D.map((v, i) => i) }];
    const r = await C.from("study_sets").select("id,title,story_box,units").not("story_box", "is", null).order("title");
    for (const b of (r.data || [])) {
      if (b.id === cur.id) { boxes[0].kind = b.story_box; continue; }
      const got = await load(b.id); if (!got) continue;
      const m = mapItems(got.set, got.items), start = D.length;
      m.words.forEach(w => { w.box = b.id; w.boxKind = b.story_box; w.boxUnits = m.units; D.push(w); });
      boxes.push({ id: b.id, title: b.story_box === "sayings" ? "Wise sayings & advice" : b.title, kind: b.story_box, icon: b.story_box === "link" ? "🔗" : b.story_box === "sayings" ? "📜" : b.story_box === "director" ? "🎬" : /feel/i.test(b.title) ? "💗" : "📦", idx: m.words.map((w, j) => start + j) });
    }
    return boxes;
  }
  // Meter companions: other dictionary words on the same scales as this set's words (e.g. Peckish … Hungry under Starving).
  // They are added to window.WORDS with .companion = true and appear only inside meters, similar-word and opposite groups, marked "extra word".
  async function loadCompanions() {
    if (window.__companions) return window.__companions;
    return (window.__companions = (async () => {
      const D = window.WORDS || [], want = new Set();
      D.forEach(v => (v.tags || []).forEach(t => {
        if (isScale(t)) { const g = scaleSplit(t).g; for (let r = -5; r <= 5; r++) want.add(`📶 ${g}: ${r > 0 ? "+" : ""}${r}`); }
        else if (isSim(t)) want.add(t);
        else if (isOpp(t)) { const g = oppSplit(t).g; g.split(/\s+vs\.?\s+/i).forEach(sd => want.add(`⇄ ${g}: ${sd.trim().toLowerCase()}`)); want.add(t); }
      }));
      if (!want.size) return 0;
      const list = [...want], parts = []; for (let k = 0; k < list.length; k += 50) parts.push(list.slice(k, k + 50));
      const res = await Promise.all(parts.map(p => App.client.from("words").select("id,headword,meaning,example,translation,syllables,pronunciation,sound_hint,image_url,anim_url,audio_url,video_url,emoji,tags").overlaps("tags", p)));
      const have = new Set(D.map(v => String(v.w).toLowerCase())), rows = [];
      res.forEach(r => (r.data || []).forEach(x => { const k = String(x.headword).toLowerCase(); if (have.has(k)) return; have.add(k); rows.push(x); }));
      const m = mapItems({ units: [] }, rows.map(x => ({ ...x, kind: "term", term: x.headword, unit: 0, also_units: [] })));
      m.words.forEach(w => { w.companion = true; D.push(w); });
      rows.forEach((x, k) => { if (m.words[k]) m.words[k].wid = x.id; });
      return m.words.length;
    })());
  }
  // Word partners (collocations) for the words on the page: Map(word id -> {own: [...], also: [...]})
  //   own: partners stored on the word (heavy rain); also: phrases on other words that use this word (rain relentlessly, on Relentlessly)
  //   each: {kind, phrase, partner, link: {w, set} | null}  (set null = the word is on this page)
  async function loadPartners(words) {
    const list = words || window.WORDS || [], ids = [...new Set(list.map(v => v.wid).filter(Boolean))], out = new Map();
    if (!ids.length) return out;
    const chunks = []; for (let k = 0; k < ids.length; k += 100) chunks.push(ids.slice(k, k + 100));
    const cols = "word_id,kind,phrase,partner,partner_word_id,position,tags";
    const res = await Promise.all(chunks.flatMap(c => [App.client.from("word_partners").select(cols).in("word_id", c), App.client.from("word_partners").select(cols).in("partner_word_id", c)]));
    const rows = []; res.forEach(r => (r.data || []).forEach(x => rows.push(x)));
    const here = new Map(list.filter(v => v.wid).map(v => [v.wid, v])), where = new Map();
    const look = [...new Set(rows.flatMap(x => [x.word_id, x.partner_word_id]).filter(id => id && !here.has(id)))];
    for (let k = 0; k < look.length; k += 100) {
      const r = await App.client.from("set_items").select("set_id,word_id,term").in("word_id", look.slice(k, k + 100));
      (r.data || []).forEach(x => { if (!where.has(x.word_id)) where.set(x.word_id, { w: x.term, set: x.set_id }); });
    }
    const link = id => !id ? null : here.has(id) ? { w: here.get(id).w, set: null } : where.get(id) || null;
    const box = id => { if (!out.has(id)) out.set(id, { own: [], also: [] }); return out.get(id); }, seen = new Set();
    const uniq = rows.sort((a, b) => a.position - b.position).filter(x => { const key = x.word_id + "|" + x.phrase.toLowerCase(); if (seen.has(key)) return false; seen.add(key); return true; });
    uniq.forEach(x => { if (here.has(x.word_id)) box(x.word_id).own.push({ kind: x.kind, phrase: x.phrase, partner: x.partner, tags: x.tags || [], link: link(x.partner_word_id) }); });
    uniq.forEach(x => {
      if (x.partner_word_id && here.has(x.partner_word_id) && x.partner_word_id !== x.word_id) {
        const o = box(x.partner_word_id); if (!o.own.some(y => y.phrase.toLowerCase() === x.phrase.toLowerCase())) o.also.push({ kind: x.kind, phrase: x.phrase, partner: "", link: link(x.word_id) });
      }
    });
    return out;
  }
  // partners that sit on a meter, one meter per kind (light rain → pouring rain; rain lightly → rain relentlessly):
  //   [{g, kind, two, left, right, items:[partner + r]}]. The same meter name links kinds: same level = same strength.
  function partnerScales(list) {
    const m = new Map();
    (list || []).forEach(x => (x.tags || []).forEach(t => { if (!isScale(t)) return; const s = scaleSplit(t), key = s.g + "|" + x.kind; if (!m.has(key)) m.set(key, { g: s.g, kind: x.kind, items: [] }); m.get(key).items.push({ ...x, r: s.r }); }));
    return [...m.values()].map(o => { const e = o.g.split(/\s*·\s*/).pop().split(/\s*(?:→|⇄)\s*/);
      return { ...o, two: /⇄/.test(o.g) || (o.items.some(i => i.r < 0) && o.items.some(i => i.r > 0)), left: e[0], right: e[1] || "", items: o.items.sort((a, b) => a.r - b.r) }; });
  }
  // the same meter slider as for words, filled with partner phrases
  function mountPartnerMeter(el, sc, o = {}) {
    const words = sc.items.map(x => ({ w: x.phrase, d: "", emoji: o.emoji || "" })), byR = new Map();
    sc.items.forEach((x, k) => { if (!byR.has(x.r)) byR.set(x.r, []); byR.get(x.r).push(k); });
    const start = o.start != null ? o.start : sc.items[0].r;
    Meter.mount(el, { title: sc.g, left: sc.left, right: sc.right, two: sc.two, words, levels: [...byR].map(([rank, items]) => ({ rank, items })), start,
      onAdd: o.onAdd ? k => o.onAdd(sc.items[k]) : null, addLabel: o.addLabel, onSay: k => speak(sc.items[k].phrase), onLevel: o.onLevel });
  }
  const PARTNER_KINDS = [["adjective", "🎨 Adjectives", "what kind?"], ["adverb", "⏩ Adverbs", "how?"], ["verb", "🏃 Verbs", "what happens?"], ["noun", "📦 Nouns", "what?"],
    ["preposition", "🔗 Little words", "at, for, with…"], ["idiom", "💬 Idioms & phrasal verbs", ""], ["saying", "📜 Famous sayings", ""]];

  // Turn the meter boxes drawn by sectionsHTML into live Feeling meters. opts: {onAdd(i), start:{scaleTitle: rank}, addLabel}
  function mountMeters(root, secs, opts) {
    opts = opts || {}; if (!window.Meter || !root) return;
    root.querySelectorAll(".meterbox[data-mi]").forEach(box => { const sc = secs[+box.dataset.mi]; if (!sc || !sc.scale) return;
      const wrap = box.closest(".gscale");
      const onLevel = r => { if (opts.onLevel) opts.onLevel(sc.title, r); if (!wrap) return;
        wrap.querySelectorAll(".gslv[data-rank]").forEach(row => { row.hidden = !!opts.follow && +row.dataset.rank !== r; }); };
      Meter.mount(box, { title: sc.title, left: sc.scale.left, right: sc.scale.right, two: sc.scale.two, levels: sc.scale.levels,
        start: (opts.start || {})[sc.title], onAdd: opts.onAdd, addLabel: opts.addLabel, onLevel, extra: sc.scale.extra || [] }); });
  }
  // Say a word once: its recorded audio when there is one, otherwise the browser voice.
  // Returns a promise that resolves when the word has finished (or after a safety timeout).
  let wordAudio = null;
  function sayWord(v) {
    return new Promise(done => {
      if (!v) return done();
      const t = setTimeout(done, 3000);
      const fin = () => { clearTimeout(t); done(); };
      if (wordAudio) { try { wordAudio.pause(); } catch (e) {} }
      const tts = () => {
        if (!("speechSynthesis" in window)) return fin();
        speak(v.w);
        const iv = setInterval(() => { if (!speechSynthesis.speaking) { clearInterval(iv); fin(); } }, 150);
      };
      if (v.au && v.au !== "tts") {
        try { wordAudio = new Audio(v.au); wordAudio.onended = fin; wordAudio.onerror = tts; wordAudio.play().catch(tts); return; } catch (e) {}
      }
      tts();
    });
  }
  // Play a word clip: the clip plays once with its own sounds (see and hear the action);
  // at the end it holds on the last picture while the word is said ONCE; then it loops silently.
  // The clips themselves contain no voice.
  function playClip(video, v) {
    if (!video) return;
    const run = (video._run = (video._run || 0) + 1);       // a newer tap cancels the older sequence
    video.muted = false; video.loop = false; video.currentTime = 0;
    video.onended = async () => {
      video.onended = null;
      await sayWord(v);                                       // the picture stays on the final frame meanwhile
      await new Promise(r => setTimeout(r, 400));
      if (video._run !== run || video.paused === false) return;
      video.muted = true; video.loop = true; video.currentTime = 0; video.play().catch(() => {});
    };
    video.play().catch(() => {});
  }
  // Stop the sound and go back to the silent loop (clips play silently by default while on screen).
  function stopClip(video) {
    if (!video) return;
    video._run = (video._run || 0) + 1; video.onended = null; video.muted = true; video.loop = true;
    if (video.dataset.auto != null && video._seen) video.play().catch(() => {}); else video.pause();
  }
  // The picture for a term: its clip (playing silently on a loop while on screen) or its picture / emoji tile.
  function media(v, o = {}) {
    const cls = o.cls ? ` class="${o.cls}"` : "", alt = esc(o.alt != null ? o.alt : v.w), extra = o.attrs || "";
    if (v.vid) return `<video${cls} src="${esc(v.vid)}" poster="${esc(v.real ? v.img : "")}" muted loop playsinline preload="none" data-auto aria-label="${alt ? "Clip showing " + alt : "Clip"}"${extra}></video>`;
    return `<img${cls} src="${esc(v.img)}" alt="${alt}" loading="lazy"${extra}>`;
  }
  // Play every [data-auto] clip silently while it is on screen and pause it when it scrolls away.
  // New clips are picked up automatically, so pages only need to output media(...).
  let io = null;
  function watchClips() {
    if (io || !("IntersectionObserver" in window)) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    io = new IntersectionObserver(es => es.forEach(e => {
      const v = e.target; v._seen = e.isIntersecting;
      if (reduce) { if (e.isIntersecting && v.preload === "none") v.preload = "metadata"; return; }
      if (e.isIntersecting) { if (v.preload === "none") v.preload = "auto"; if (v.paused && v.muted) v.play().catch(() => {}); }
      else if (v.muted) v.pause();
    }), { rootMargin: "120px" });
    const scan = root => (root.querySelectorAll ? root : document).querySelectorAll("video[data-auto]").forEach(v => { if (!v._io) { v._io = 1; io.observe(v); } });
    scan(document);
    new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1) { if (n.matches && n.matches("video[data-auto]")) scan(n.parentNode); else scan(n); } }))).observe(document.body, { childList: true, subtree: true });
  }

  async function pickSetId(p) {
    const want = qs.get("set");
    if (want) return want;
    const last = store.get("lastSet");
    if (last) return last;
    const { data } = await App.client.from("class_sets").select("set_id, assigned_at").order("assigned_at", { ascending: false }).limit(1);
    if (data && data[0]) return data[0].set_id;
    return null;
  }

  async function load(id) {
    const C = App.client;
    const [{ data: set, error }, { data: items }, { data: songs }, { data: texts }] = await Promise.all([
      C.from("study_sets").select("*, subjects(name,icon), levels(name), curricula(short_name,name)").eq("id", id).maybeSingle(),
      C.from("set_items").select("*").eq("set_id", id).order("position", { ascending: true }).limit(5000),
      C.from("set_songs").select("id").eq("set_id", id).limit(1),
      C.from("set_texts").select("id").eq("set_id", id).limit(1)
    ]);
    if (error || !set) return null;
    return { set, items: items || [], hasSongs: !!((songs || []).length || (texts || []).length) };
  }

  function mapItems(set, items) {
    const terms = items.filter(x => x.kind === "term"), questions = items.filter(x => x.kind !== "term");
    const words = terms.map(x => ({
      id: x.id, w: x.term, d: x.meaning, s: blankify(x.example, x.term), ar: x.translation || "",
      u: x.unit, also: x.also_units || [], img: x.anim_url || (x.emoji ? tile(x.term, x.emoji) : "") || x.image_url || tile(x.term), emoji: x.emoji || "",   // clip first (vid), then animated emoji, emoji, photo
      photo: (x.anim_url || x.emoji) && x.image_url ? x.image_url : "", au: x.audio_url || "tts",
      author: x.author || "", film: x.film || "", lit: x.literal || "", litAr: x.literal_tr || "", eq: x.equivalent || "", wid: x.word_id || null, vid: x.video_url || "", tags: Array.isArray(x.tags) ? x.tags : [], pron: x.pronunciation || "", hint: x.sound_hint || "", syl: (x.syllables || (/\s/.test(x.term) ? x.term.toLowerCase() : autoSyl(x.term))).toLowerCase(), real: !!(x.anim_url || x.image_url)
    }));
    const named = new Map((set.units || []).map(u => [Number(u.u), u.name || ""]));
    const counts = new Map(); words.forEach(w => counts.set(w.u, (counts.get(w.u) || 0) + 1));
    const order = [...counts.keys()].sort((a, b) => (a === 0) - (b === 0) || a - b);
    const units = order.map(u => ({ u, name: named.get(u) || (u === 0 ? "General" : ""), n: counts.get(u) }));
    return { words, questions, units };
  }

  function setBar(set, words, questions) {
    const here = location.pathname.split("/").pop();
    const I = n => (window.icon ? window.icon(n, 16) : "");
    const acts = [["set.html", "layout-grid", "Overview", true], ["list.html", "list-checks", "Word list", words.length > 0], ["cards.html", "layers", "Flashcards", words.length > 0],
      ["exam.html", "clipboard-check", "Exam", words.length >= 4], ["games.html", "puzzle", "Games", words.length >= 4],
      ["spelling.html", "spell-check-2", "Spelling", words.length >= 2], ["quiz.html", "circle-help", "Quiz", questions.length > 0], ["songs.html", "music", "Songs & dialogs", !!window.HAS_SONGS], ["story.html", "sparkles", "Story builder", words.length >= 2], ["studio.html", "drama", "Director's Studio", !!(window.App && App.profile && App.profile.role === "teacher")]];
    const css = `#setbar{background:var(--ink,#1B2333);color:#fff;padding:10px 16px;display:flex;gap:10px 18px;align-items:center;flex-wrap:wrap;font:14px var(--f-body,system-ui)}
      #setbar .t{display:flex;flex-direction:column;min-width:0;flex:1 1 240px}#setbar .t b{font:800 1.02rem var(--f-display,system-ui);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      #setbar .t span{color:#C9D1E3;font-size:.82rem}#setbar nav{display:flex;gap:4px;flex-wrap:wrap}
      #setbar nav a{display:inline-flex;align-items:center;gap:6px;color:#E3E8F3;text-decoration:none;font-weight:700;font-size:.86rem;padding:6px 10px;border-radius:9px;border:1px solid rgba(255,255,255,.18)}
      #setbar nav a:hover{background:rgba(255,255,255,.1)}#setbar nav a.on{background:var(--sun,#FFC94D);color:#1B2333;border-color:transparent}
      @media (max-width:600px){#setbar nav a span{display:none}}`;
    document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`);
    const meta = [set.subjects?.name, set.levels?.name, set.curricula?.short_name, `${words.length} terms`, questions.length ? `${questions.length} questions` : ""].filter(Boolean).join(" · ");
    const nav = acts.filter(a => a[3]).map(a => `<a href="${a[0]}?${a[0] === "set.html" ? "id" : "set"}=${set.id}" class="${here === a[0] ? "on" : ""}">${I(a[1])}<span>${a[2]}</span></a>`).join("");
    const bar = `<div id="setbar"><div class="t"><b>${esc(set.title)}</b><span>${esc(meta)}</span></div><nav aria-label="Activities for this set">${nav}</nav></div>`;
    const ab = document.getElementById("appbar");
    if (ab) ab.insertAdjacentHTML("afterend", bar); else document.body.insertAdjacentHTML("afterbegin", bar);
  }

  function blocker(title, text, set) {
    const w = document.querySelector(".wrap") || document.body;
    w.innerHTML = `<div style="max-width:560px;margin:48px auto;padding:24px;border-radius:18px;background:var(--sheet,#fff);border:1px solid var(--rule,#DCE1EA);font:16px var(--f-body,system-ui);display:flex;flex-direction:column;gap:12px">
      <h1 style="margin:0;font:800 1.5rem var(--f-display,system-ui)">${esc(title)}</h1><p style="margin:0">${text}</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap">${set ? `<a href="set.html?id=${set.id}" style="font-weight:700">Back to the set</a> · ` : ""}<a href="library.html" style="font-weight:700">Open the library</a></div></div>`;
  }

  function runPage() {
    document.querySelectorAll('script[type="text/x-app"]').forEach(s => {
      const n = document.createElement("script"); n.textContent = s.textContent; document.body.appendChild(n);
    });
    watchClips();
  }

  async function boot(opts = {}) {
    let p; try { p = await App.requireUser(); } catch (e) { return; }
    const id = await pickSetId(p);
    if (!id) { location.replace("library.html"); return; }
    const got = await load(id);
    if (!got) { if (store.get("lastSet") === id) { try { localStorage.removeItem("lastSet"); } catch (e) {} }
      blocker("Set not available", "This study set doesn't exist any more, or it hasn't been shared with you.", null); return; }
    const { set, items } = got, { words, questions, units } = mapItems(set, items);
    store.set("lastSet", set.id);
    window.CURRENT_SET = set; window.SET_ITEMS = items; window.WORDS = words; window.QUESTIONS = questions; window.UNITS_LIST = units;
    window.SET_LANG = set.language || "en"; window.TL_NAME = LANGS[set.translation_lang] || "Translation";
    window.SYL_MAP = Object.fromEntries(words.map(w => [w.w, w.syl]));
    window.HAS_PICS = words.filter(w => w.real).length >= 6;
    document.documentElement.lang = set.language || "en";
    window.HAS_SONGS = got.hasSongs;
    setBar(set, words, questions);
    const eb = document.getElementById("setEyebrow");
    if (eb) eb.textContent = [set.subjects?.name, set.levels?.name, set.curricula?.short_name].filter(Boolean).join(" · ");
    const need = opts.min || 0, have = opts.questions ? questions.length : words.length;
    if (have < need) {
      blocker(opts.questions ? "No questions in this set yet" : "Not enough terms for this activity",
        opts.questions ? "This set has no multiple-choice or true/false questions. Try the flashcards or the exam instead."
          : `This activity needs at least ${need} terms, and this set has ${have}.`, set);
      return;
    }
    runPage();
  }

  window.Sets = { boot, speak, sayWord, unitPicker, groupPicker, groupsOf, wordGroups, tagIcon, typeName, loadPartners, PARTNER_KINDS, partnerScales, mountPartnerMeter, sectionsHTML, mountMeters, loadBoxes, loadCompanions, scaleOfWord: (v, g) => { const t = (v.tags || []).find(t => isScale(t) && (!g || scaleSplit(t).g === g)); return t ? scaleSplit(t) : null; }, TAG_TYPES: TYPES, TAG_THEMES: THEME_ICONS, playClip, stopClip, media, watchClips, tile, autoSyl, blankify, load, mapItems, G5, LANGS };
})();
