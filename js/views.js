// Helper Academy — picture views of words, built from the data (no fixed lists):
//   Views.wheel(el, o): a feelings-wheel style sunburst. Centre = families (sections, word types, themes or ≈ groups),
//                       middle ring = ≈ similar groups inside each family, outer ring = the words. Tap to zoom.
//   Views.venn(el, o):  2–3 overlapping circles (any section, ≈ group, ⇄ side, type or theme); tap a region to see its words.
// o = { D: words [{w, d, ar, emoji, tags, u, also}], idx: [indexes to show], units: [{u, name}], onAdd(i), addLabel }
(function () {
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const clean = w => String(w || "").replace(/\s*\(.*\)/, "");
  const TYPES = ["Naming: people", "Naming: things & places", "Naming", "Action", "Describing", "Adverb", "Phrasal verb", "Idiom", "Saying", "Linking", "Camera", "Music"];
  const isIdea = t => /^(≈|⇄|📶)\s/.test(t);
  const css = `
.vw{display:grid;gap:12px}
.vw-bar{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.vw-bar select{font:700 .9rem var(--f-body,system-ui);padding:7px 10px;border:1.5px solid var(--rule,#dce1ea);border-radius:10px;background:var(--paper,#fff);color:var(--ink,#1b2333)}
.vw-bar .hint{color:var(--muted,#5e6a80);font-size:.85rem}
.vw-stage{position:relative;display:grid;place-items:center}
.vw svg{width:min(100%,640px);height:auto;overflow:visible;touch-action:manipulation}
.vw svg text{pointer-events:none;font-family:var(--f-body,system-ui);fill:#1b2333}
.vw .wh-in{animation:whIn .7s cubic-bezier(.34,1.56,.64,1) both;transform-box:view-box;transform-origin:0 0}
@keyframes whIn{from{transform:rotate(-70deg) scale(.4);opacity:0}to{transform:none;opacity:1}}
.vw .seg{cursor:pointer;transition:transform .25s,filter .2s;transform-box:view-box;transform-origin:0 0;stroke:#fff;stroke-width:1.2}
.vw .seg:hover{filter:brightness(1.07) saturate(1.15);transform:scale(1.03)}
.vw .seg.on{stroke:#1b2333;stroke-width:2.4;filter:saturate(1.3)}
.vw .seg.dim{opacity:.28}
.vw .ctr{cursor:pointer}
.vw-card{background:var(--sheet,#fff);border:1.5px solid var(--rule,#dce1ea);border-radius:16px;padding:12px 14px;display:grid;gap:6px;max-width:640px;width:100%;animation:vwUp .35s ease both}
@keyframes vwUp{from{transform:translateY(10px);opacity:0}to{transform:none;opacity:1}}
.vw-card h4{margin:0;font:800 1.4rem var(--f-display,system-ui);display:flex;gap:8px;align-items:center}
.vw-card .ar{font-family:var(--f-ar,serif);font-size:1.1rem}
.vw-card .tg{display:flex;flex-wrap:wrap;gap:5px}.vw-card .tg span{font:700 .78rem var(--f-body,system-ui);background:var(--chip,#eef2f7);border-radius:999px;padding:2px 9px}
.vw-card .row{display:flex;gap:6px;flex-wrap:wrap}
.vw-card button{font:800 .85rem var(--f-body,system-ui);border-radius:999px;border:1.5px solid var(--accent,#2347c5);background:#fff;color:var(--accent,#2347c5);padding:5px 12px;cursor:pointer}
.vw-card button.add{background:var(--accent,#2347c5);color:#fff}
.vw-chips{display:flex;flex-wrap:wrap;gap:6px;max-width:640px}
.vw-chips button{font:700 .9rem var(--f-body,system-ui);border:1.5px solid var(--rule,#dce1ea);background:var(--paper,#fff);border-radius:999px;padding:5px 11px;cursor:pointer;animation:vwUp .3s ease both}
.vw-chips button:hover{border-color:var(--accent,#2347c5)}
.vw .vc{transform-box:fill-box;transform-origin:center;animation:vcIn .6s cubic-bezier(.34,1.56,.64,1) both;mix-blend-mode:multiply}
@keyframes vcIn{from{transform:scale(.2);opacity:0}to{transform:none;opacity:1}}
.vw .rg{cursor:pointer}.vw .rg:hover circle{stroke:#1b2333;stroke-width:2}
.vw .rg.on circle{fill:#1b2333}.vw .rg.on text{fill:#fff}
@media (prefers-reduced-motion:reduce){.vw .wh-in,.vw .vc,.vw-card,.vw-chips button{animation:none}}`;
  const addCss = () => { if (!document.getElementById("views-css")) { const s = document.createElement("style"); s.id = "views-css"; s.textContent = css; document.head.appendChild(s); } };
  // a colour for a family: feelings get their usual colours, others take turns round the colour wheel
  const HUES = [[/fear|scared|afraid|worr/i, 26], [/ang|mad|furi/i, 4], [/disgust/i, 182], [/sad|blue|lonel/i, 268], [/happy|joy|cheer/i, 46], [/surpris|amaz/i, 210],
    [/love|kind|care/i, 338], [/calm|peace/i, 160], [/brave|courage/i, 18], [/patien/i, 120], [/hard work|lazy/i, 36], [/honest/i, 196]];
  const PALETTE = [210, 140, 32, 280, 350, 180, 60, 240, 100, 310, 10, 160];
  function hueOf(name, n) { for (const [re, h] of HUES) if (re.test(name)) return h; return PALETTE[n % PALETTE.length]; }
  const fill = (h, ring) => `hsl(${h} ${ring === 0 ? 72 : ring === 1 ? 68 : 62}% ${ring === 0 ? 58 : ring === 1 ? 72 : 86}%)`;

  // ---- ways to sort words into families (all from the data) ----
  function families(o, by) {
    const D = o.D, idx = o.idx, names = new Map((o.units || []).map(u => [Number(u.u), u.name || "Unit " + u.u]));
    const strip = s => String(s).replace(/^.*?(wheel|families?)\s*:\s*/i, "");
    let on = o.unitsOn; if (by === "unit" && on) { const wheelU = on.filter(u => /wheel/i.test(names.get(u) || "")); if (wheelU.length >= 2) on = wheelU; }
    const out = new Map(), put = (name, i) => { if (!out.has(name)) out.set(name, []); out.get(name).push(i); };
    idx.forEach(i => { const v = D[i] || {}, tags = v.tags || [];
      if (by === "unit") { const us = [v.u, ...(v.also || [])].filter(u => !on || on.includes(u)); if (!us.length) return; us.forEach(u => put(strip(names.get(u) || "Unit " + u), i)); }
      else if (by === "type") put(tags.find(t => TYPES.includes(t)) || "Other", i);
      else if (by === "theme") { const th = tags.filter(t => !TYPES.includes(t) && !isIdea(t) && !/^[\p{Extended_Pictographic}]/u.test(t)); (th.length ? th.slice(0, 1) : ["Other"]).forEach(t => put(t, i)); }
      else if (by === "sim") { const g = tags.filter(t => t.startsWith("≈ ")); (g.length ? g.slice(0, 1) : ["Other"]).forEach(t => put(t.slice(2), i)); }
      else if (by === "opp") { const g = tags.filter(t => t.startsWith("⇄ ")); (g.length ? g.slice(0, 1) : ["Other"]).forEach(t => put(t.slice(2).split(":")[0], i)); }
    });
    let F = [...out.entries()].map(([name, items]) => ({ name, items: [...new Set(items)] }));
    if (by === "sim" || by === "opp" || by === "theme") { F.sort((a, b) => b.items.length - a.items.length); const big = F.filter(f => f.items.length >= 2 && f.name !== "Other").slice(0, 10);
      const rest = [...new Set(F.filter(f => !big.includes(f)).flatMap(f => f.items))]; F = big.concat(rest.length ? [{ name: "Other", items: rest }] : []); }
    return F;
  }
  // inside a family: the words that share a ≈ group (or a ⇄ side) form the middle ring
  function subgroups(o, fam, by) {
    const D = o.D, count = new Map();
    const keysOf = i => ((D[i] || {}).tags || []).filter(t => by === "sim" ? t.startsWith("⇄ ") : t.startsWith("≈ ")).map(t => by === "sim" ? t.slice(2).split(":").pop().trim() : t.slice(2));
    fam.items.forEach(i => keysOf(i).forEach(k => count.set(k, (count.get(k) || 0) + 1)));
    const subs = new Map(), used = new Set();
    fam.items.forEach(i => { const ks = keysOf(i).filter(k => count.get(k) >= 2 && k !== fam.name).sort((a, b) => count.get(b) - count.get(a)); const k = ks[0] || "";
      if (!subs.has(k)) subs.set(k, []); subs.get(k).push(i); used.add(i); });
    return [...subs.entries()].sort((a, b) => (a[0] === "") - (b[0] === "") || b[1].length - a[1].length).map(([name, items]) => ({ name, items }));
  }
  const pt = (r, a) => [r * Math.cos(a), r * Math.sin(a)];
  function arcPath(r1, r2, a1, a2) {
    if (a2 - a1 >= Math.PI * 2 - 1e-6) a2 = a1 + Math.PI * 2 - 1e-4;
    const big = a2 - a1 > Math.PI ? 1 : 0, [x1, y1] = pt(r2, a1), [x2, y2] = pt(r2, a2), [x3, y3] = pt(r1, a2), [x4, y4] = pt(r1, a1);
    return r1 > 0 ? `M${x1},${y1}A${r2},${r2} 0 ${big} 1 ${x2},${y2}L${x3},${y3}A${r1},${r1} 0 ${big} 0 ${x4},${y4}Z` : `M0,0L${x1},${y1}A${r2},${r2} 0 ${big} 1 ${x2},${y2}Z`;
  }
  function radialText(r, a, txt, size, maxLen) {
    let deg = a * 180 / Math.PI; const flip = deg > 90 && deg < 270; const [x, y] = pt(r, a); if (flip) deg += 180;
    const t = txt.length > maxLen ? txt.slice(0, maxLen - 1) + "…" : txt;
    return `<text x="${x}" y="${y}" font-size="${size}" font-weight="700" text-anchor="middle" dominant-baseline="middle" transform="rotate(${deg} ${x} ${y})">${esc(t)}</text>`;
  }
  function wordCard(o, i) {
    const v = o.D[i] || {}, tags = (v.tags || []).filter(isIdea).slice(0, 6).map(t => t.replace(/^📶\s*/, "🎚️ "));
    return `<div class="vw-card"><h4>${esc(v.emoji || "")} ${esc(clean(v.w))}</h4>${v.d ? `<div>${esc(v.d)}</div>` : ""}${v.ar ? `<div class="ar" dir="rtl">${esc(v.ar)}</div>` : ""}
      ${tags.length ? `<div class="tg">${tags.map(t => `<span>${esc(t)}</span>`).join("")}</div>` : ""}
      <div class="row"><button type="button" data-vsay="${i}">🔊 Hear</button>${o.onAdd ? `<button type="button" class="add" data-vadd="${i}">${esc(o.addLabel || "+ Add")}</button>` : ""}</div></div>`;
  }
  function wireCard(root, o) {
    root.addEventListener("click", e => { const s = e.target.closest("[data-vsay]"); if (s) { const v = o.D[+s.dataset.vsay]; if (window.Sets) Sets.sayWord(v); return; }
      const a = e.target.closest("[data-vadd]"); if (a && o.onAdd) { o.onAdd(+a.dataset.vadd); a.textContent = "✓ Added"; } });
  }

  // ---------------- 🎡 wheel ----------------
  function wheel(el, o) {
    addCss();
    const st = { by: o.by || (o.units && o.units.length > 1 ? "unit" : "sim"), zoom: null, sub: null, pick: null };
    const host = document.createElement("div"); host.className = "vw"; el.innerHTML = ""; el.appendChild(host);
    const BYS = [["unit", "Sections"], ["sim", "Similar words (≈)"], ["opp", "Opposites (⇄)"], ["type", "Word type"], ["theme", "Theme"]];
    function draw() {
      let F = families(o, st.by); if (!F.length) { host.innerHTML = `<div class="empty">No words to show.</div>`; return; }
      if (st.zoom && !F.some(f => f.name === st.zoom)) st.zoom = null;
      const shown = st.zoom ? F.filter(f => f.name === st.zoom) : F;
      const all = shown.reduce((n, f) => n + f.items.length, 0), many = all > 60;
      const R0 = st.zoom ? 62 : 70, R1 = st.zoom ? 118 : 122, R2 = 198, TAU = Math.PI * 2;
      let a = -Math.PI / 2, svg = "";
      shown.forEach((f, n) => { const h = hueOf(f.name, F.indexOf(f)), a0 = a, span = TAU * f.items.length / all;
        const subs = subgroups(o, f, st.by); let b = a0;
        subs.forEach(s => { const sspan = span * s.items.length / f.items.length;
          if (s.name) { const on = st.sub === f.name + "|" + s.name; svg += `<path class="seg${on ? " on" : ""}" d="${arcPath(R0, R1, b, b + sspan)}" fill="${fill(h, 1)}" data-sub="${esc(f.name + "|" + s.name)}"><title>${esc(s.name)} (${s.items.length})</title></path>`;
            if (sspan > 0.12) svg += radialText((R0 + R1) / 2, b + sspan / 2, s.name, sspan > 0.3 ? 10 : 8, 14); }
          else svg += `<path d="${arcPath(R0, R1, b, b + sspan)}" fill="${fill(h, 2)}" stroke="#fff" stroke-width="1.2"/>`;
          let c = b; const each = sspan / s.items.length;
          s.items.forEach(i => { const v = o.D[i] || {}, dim = st.sub && st.sub !== f.name + "|" + s.name;
            svg += `<path class="seg${st.pick === i ? " on" : ""}${dim ? " dim" : ""}" d="${arcPath(R1, R2, c, c + each)}" fill="${fill(h, 2)}" data-w="${i}"><title>${esc(clean(v.w))}</title></path>`;
            const fs = Math.max(6, Math.min(13, each * 150)); svg += radialText((R1 + R2) / 2 + 4, c + each / 2, (many ? "" : (v.emoji ? v.emoji + " " : "")) + clean(v.w), fs, 16);
            c += each; });
          b += sspan; });
        // the family in the centre
        if (!st.zoom) { svg += `<path class="seg" d="${arcPath(0, R0, a0, a0 + span)}" fill="${fill(h, 0)}" data-fam="${esc(f.name)}"><title>${esc(f.name)} (${f.items.length}): tap to zoom</title></path>`;
          if (span > 0.25) { const [x, y] = pt(R0 * .62, a0 + span / 2); svg += `<text x="${x}" y="${y}" font-size="${span > 0.8 ? 11 : 8.5}" font-weight="800" text-anchor="middle" dominant-baseline="middle" fill="#fff">${esc(f.name.length > 12 ? f.name.slice(0, 11) + "…" : f.name)}</text>`; } }
        else svg += `<g class="ctr" data-unzoom="1"><circle r="${R0 - 4}" fill="${fill(h, 0)}"/><text y="-8" font-size="15" font-weight="800" text-anchor="middle" fill="#fff">${esc(f.name.length > 14 ? f.name.slice(0, 13) + "…" : f.name)}</text><text y="14" font-size="10" font-weight="700" text-anchor="middle" fill="#fff">↩ all</text></g>`;
        a += span; });
      host.innerHTML = `<div class="vw-bar"><label>Sort by <select data-by>${BYS.map(([k, l]) => `<option value="${k}"${k === st.by ? " selected" : ""}>${l}</option>`).join("")}</select></label>
          <span class="hint">${st.zoom ? "Tap the middle to see everything again." : "Tap a colour in the middle to zoom in. Tap a word to learn it."} ${all} words</span></div>
        <div class="vw-stage"><svg viewBox="-205 -205 410 410" role="img" aria-label="Word wheel"><g class="wh-in">${svg}</g></svg></div>
        <div class="vw-more">${st.pick != null ? wordCard(o, st.pick) : st.sub ? `<div class="vw-chips">${(F.find(f => f.name === st.sub.split("|")[0]) ? subgroups(o, F.find(f => f.name === st.sub.split("|")[0]), st.by).find(s => s.name === st.sub.split("|")[1]) || { items: [] } : { items: [] }).items.map(i => `<button type="button" data-w="${i}">${esc((o.D[i].emoji || "") + " " + clean(o.D[i].w))}</button>`).join("")}</div>` : ""}</div>`;
    }
    host.addEventListener("change", e => { if (e.target.matches("[data-by]")) { st.by = e.target.value; st.zoom = st.sub = st.pick = null; draw(); } });
    host.addEventListener("click", e => {
      const f = e.target.closest("[data-fam]"); if (f) { st.zoom = f.dataset.fam; st.sub = st.pick = null; draw(); return; }
      if (e.target.closest("[data-unzoom]")) { st.zoom = st.sub = st.pick = null; draw(); return; }
      const s = e.target.closest("[data-sub]"); if (s) { st.sub = st.sub === s.dataset.sub ? null : s.dataset.sub; st.pick = null; draw(); return; }
      const w = e.target.closest("[data-w]"); if (w) { st.pick = +w.dataset.w; draw(); if (window.Sets) Sets.sayWord(o.D[st.pick]); host.querySelector(".vw-card")?.scrollIntoView({ block: "nearest", behavior: "smooth" }); }
    });
    wireCard(host, o); draw();
    return { redraw: draw };
  }

  // ---------------- ⭕ venn ----------------
  function candidates(o) {
    const D = o.D, idx = o.idx, names = new Map((o.units || []).map(u => [Number(u.u), u.name || "Unit " + u.u])), C = new Map();
    const add = (key, label, i) => { if (!C.has(key)) C.set(key, { key, label, items: new Set() }); C.get(key).items.add(i); };
    idx.forEach(i => { const v = D[i] || {};
      [v.u, ...(v.also || [])].forEach(u => names.has(u) && add("u" + u, "📘 " + names.get(u), i));
      (v.tags || []).forEach(t => { if (t.startsWith("≈ ")) add(t, "≈ " + t.slice(2), i); else if (t.startsWith("⇄ ")) add(t, "⇄ " + t.slice(2).split(":").pop().trim() + " (" + t.slice(2).split(":")[0] + ")", i);
        else if (t.startsWith("📶 ")) add("m" + t.split(":")[0], "🎚️ " + t.slice(2).split(":")[0], i); else if (!/^[\p{Extended_Pictographic}]/u.test(t)) add("t" + t, (TYPES.includes(t) ? "🔤 " : "🏷️ ") + t, i); }); });
    return [...C.values()].filter(c => c.items.size >= 1).sort((a, b) => b.items.size - a.items.size);
  }
  function bestThree(Cs) {
    const total = new Set(Cs.flatMap(c => [...c.items])).size, rank = c => /^(≈|⇄|m|u)/.test(c.key) ? 0 : 1;
    const ok = Cs.filter(c => c.items.size >= 2 && c.items.size <= Math.max(6, total * .4)).sort((a, b) => rank(a) - rank(b) || b.items.size - a.items.size).slice(0, 60), inter = (a, b) => [...a.items].filter(i => b.items.has(i)).length;
    let best = null, bs = -1;
    for (let x = 0; x < ok.length; x++) for (let y = x + 1; y < ok.length; y++) { const n = inter(ok[x], ok[y]); if (n > 0 && n < Math.min(ok[x].items.size, ok[y].items.size) && n > bs) { bs = n; best = [ok[x], ok[y]]; } }
    if (!best) return ok.slice(0, 2);
    let third = null, ts = 0; ok.forEach(c => { if (best.includes(c)) return; const n = inter(c, best[0]) + inter(c, best[1]); if (n > ts && n < c.items.size) { ts = n; third = c; } });
    return third ? best.concat(third) : best;
  }
  function venn(el, o) {
    addCss();
    const Cs = candidates(o), host = document.createElement("div"); host.className = "vw"; el.innerHTML = ""; el.appendChild(host);
    if (Cs.length < 2) { host.innerHTML = `<div class="empty">These words don't have enough groups to compare. Try more words.</div>`; return; }
    const st = { pick: bestThree(Cs).map(c => c.key), region: null, word: null };
    while (st.pick.length < 2) st.pick.push(Cs.find(c => !st.pick.includes(c.key)).key);
    const HU = [338, 140, 230];
    function draw() {
      const S = st.pick.map(k => Cs.find(c => c.key === k)).filter(Boolean), n = S.length;
      const pos = n === 3 ? [[-62, -38], [62, -38], [0, 68]] : [[-58, 0], [58, 0]], R = n === 3 ? 112 : 120;
      // every word in at least one circle → its region (which circles it is in)
      const regions = new Map(); [...new Set(S.flatMap(c => [...c.items]))].forEach(i => { const key = S.map(c => c.items.has(i) ? 1 : 0).join(""); if (!regions.has(key)) regions.set(key, []); regions.get(key).push(i); });
      // where to write each region: the average of the centres of its circles, pushed away from the others
      const spot = key => { const inn = [...key].map(Number); let x = 0, y = 0, k = 0; inn.forEach((b, j) => { if (b) { x += pos[j][0]; y += pos[j][1]; k++; } }); x /= k; y /= k;
        if (k < n) { let ox = 0, oy = 0, m = 0; inn.forEach((b, j) => { if (!b) { ox += pos[j][0]; oy += pos[j][1]; m++; } }); ox /= m; oy /= m; const dx = x - ox, dy = y - oy, d = Math.hypot(dx, dy) || 1; const push = k === 1 ? 48 : 22; x += dx / d * push; y += dy / d * push; }
        return [x, y]; };
      let svg = S.map((c, j) => `<circle class="vc" style="animation-delay:${j * .12}s" cx="${pos[j][0]}" cy="${pos[j][1]}" r="${R}" fill="hsl(${HU[j]} 75% 62% / .45)" stroke="hsl(${HU[j]} 60% 40%)" stroke-width="2"/>`).join("");
      const lab = S.map((c, j) => { const [x, y] = pos[j], bottom = n === 3 && j === 2, ly = bottom ? y + R + 18 : y - R - 10, anchor = bottom ? "middle" : j === 0 ? "end" : "start", lx = bottom ? x : j === 0 ? x + 30 : x - 30;
        const t = c.label.replace(/^📘\s*/, ""); return `<text x="${lx}" y="${ly}" font-size="12.5" font-weight="800" text-anchor="${anchor}" fill="hsl(${HU[j]} 60% 30%)">${esc(t.length > 30 ? t.slice(0, 29) + "…" : t)}</text>`; }).join("");
      regions.forEach((items, key) => { const [x, y] = spot(key), on = st.region === key, all = !key.includes("0");
        const names = items.slice(0, all ? 3 : 2).map(i => clean(o.D[i].w)).map(s => s.length > 13 ? s.slice(0, 12) + "…" : s);
        svg += `<g class="rg${on ? " on" : ""}" data-rg="${key}"><circle cx="${x}" cy="${y}" r="${all ? 17 : 15}" fill="#fff" stroke="#94a3b8"/><text x="${x}" y="${y + 1}" font-size="13" font-weight="800" text-anchor="middle" dominant-baseline="middle">${items.length}</text>
          ${names.map((s, k) => `<text x="${x}" y="${y + 26 + k * 12}" font-size="10" font-weight="700" text-anchor="middle">${esc(s)}</text>`).join("")}</g>`; });
      const opts = sel => `<option value="">—</option>` + Cs.slice(0, 160).map(c => `<option value="${esc(c.key)}"${c.key === sel ? " selected" : ""}>${esc(c.label)} (${c.items.size})</option>`).join("");
      const R_ = st.region && regions.get(st.region);
      host.innerHTML = `<div class="vw-bar">${[0, 1, 2].map(j => `<select data-vp="${j}" aria-label="Circle ${j + 1}">${opts(st.pick[j] || "")}</select>`).join("")}<span class="hint">Tap a number to see the words in that part.</span></div>
        <div class="vw-stage"><svg viewBox="-215 -190 430 ${n === 3 ? 410 : 330}" role="img" aria-label="Venn diagram">${svg}${lab}</svg></div>
        ${R_ ? `<div class="vw-chips"><b style="width:100%">${esc(regionName(st.region, S))}</b>${R_.map(i => `<button type="button" data-vw="${i}">${esc((o.D[i].emoji || "") + " " + clean(o.D[i].w))}</button>`).join("")}</div>` : ""}
        ${st.word != null ? wordCard(o, st.word) : ""}`;
    }
    const regionName = (key, S) => { const inn = S.filter((c, j) => key[j] === "1").map(c => c.label), out = S.filter((c, j) => key[j] === "0").map(c => c.label);
      return inn.length > 1 ? `In both ${inn.join(" and ")}` + (out.length ? `, not ${out.join(", ")}` : "") : `Only ${inn[0]}`; };
    host.addEventListener("change", e => { const s = e.target.closest("[data-vp]"); if (!s) return; const j = +s.dataset.vp; st.pick[j] = s.value; st.pick = st.pick.filter(Boolean);
      st.pick = [...new Set(st.pick)]; if (st.pick.length < 2) st.pick.push(Cs.find(c => !st.pick.includes(c.key)).key); st.region = st.word = null; draw(); });
    host.addEventListener("click", e => { const r = e.target.closest("[data-rg]"); if (r) { st.region = st.region === r.dataset.rg ? null : r.dataset.rg; st.word = null; draw(); return; }
      const w = e.target.closest("[data-vw]"); if (w) { st.word = +w.dataset.vw; draw(); if (window.Sets) Sets.sayWord(o.D[st.word]); } });
    wireCard(host, o); draw();
  }
  window.Views = { wheel, venn, families, candidates };
})();
