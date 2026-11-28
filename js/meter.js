// Helper Academy — Feeling meter (jQuery): slide along a scale of words, from one pole to the other.
// A big face changes with the strength, the words at that level pop up, and each can be heard or added.
// Meter.mount(el, {title, left, right, two, levels:[{rank, items:[wordIndex]}], start, onAdd(i), onSay(i), addLabel, words})
//   words: optional list of {w, d, emoji} to use instead of window.WORDS (e.g. word partners: light rain … pouring rain)
(function ($) {
  if (!$) return;
  const FACES = {
    "hate ⇄ love": { "-5": "🤬", "-4": "😡", "-3": "😠", "-2": "😒", "-1": "🙁", "0": "😐", "1": "🙂", "2": "😊", "3": "🤗", "4": "🥰", "5": "😍" },
    "ashamed ⇄ proud": { "-5": "😖", "-4": "😣", "-3": "😳", "-2": "🙈", "-1": "😕", "0": "😐", "1": "🙂", "2": "😊", "3": "😌", "4": "🦚", "5": "🏆" },
    "bored → excited": { "0": "😶", "1": "🥱", "2": "🙂", "3": "🤔", "4": "🙋", "5": "🤩" },
    "betrayal → trust": { "0": "🤝", "-1": "😕", "-2": "😞", "-3": "😢", "-4": "🏚️", "-5": "💔" },
    "sad ⇄ happy": { "-5": "😭", "-4": "😩", "-3": "😢", "-2": "😞", "-1": "😕", "0": "😐", "1": "🙂", "2": "😊", "3": "😄", "4": "😁", "5": "🤩" },
    "angry → calm": { "0": "😌", "-1": "😒", "-2": "😤", "-3": "😠", "-4": "😡", "-5": "🤬" },
    "afraid → calm": { "0": "😌", "-1": "😬", "-2": "😟", "-3": "😨", "-4": "😱", "-5": "🫣" },
    "hungry → full": { "0": "😌", "-1": "🙂", "-2": "🤔", "-3": "😋", "-4": "😫", "-5": "😵" },
    "tiny → gigantic": { "0": "🐜", "1": "🐭", "2": "🐕", "3": "🐘", "4": "🐋", "5": "🦕" },
    "near → far": { "0": "🏠", "1": "🚶", "2": "🚲", "3": "🚗", "4": "✈️", "5": "🚀" },
    "deafening → silent": { "0": "🤫", "-1": "🔈", "-2": "🔉", "-3": "🔊", "-4": "📢", "-5": "💥" },
    "deadly → safe": { "0": "😌", "-1": "🙂", "-2": "😬", "-3": "⚠️", "-4": "😱", "-5": "☠️" },
    "exhausted → energetic": { "0": "⚡", "-1": "🙂", "-2": "🥱", "-3": "😪", "-4": "😩", "-5": "😴" },
    "boring → thrilling": { "0": "😴", "1": "🥱", "2": "🙂", "3": "🤔", "4": "🤩", "5": "🎢" },
    "okay → fantastic": { "0": "👌", "1": "👍", "2": "😀", "3": "🌟", "4": "✨", "5": "🎉" },
    "filthy → clean": { "0": "✨", "-1": "🧼", "-2": "🤏", "-3": "🟤", "-4": "🐷", "-5": "🤢" },
    "minor → crucial": { "0": "🤷", "1": "🙂", "2": "👀", "3": "⭐", "4": "🔑", "5": "🚨" },
    "unknown → renowned": { "0": "❓", "1": "🙂", "2": "👥", "3": "📣", "4": "🌟", "5": "🏆" },
    "common → unique": { "0": "👥", "1": "🙂", "2": "🤨", "3": "💎", "4": "🦄", "5": "🌟" },
    "poor → affluent": { "0": "🪙", "1": "💵", "2": "💳", "3": "🏠", "4": "💰", "5": "🏰" },
    "timid → heroic": { "0": "🫣", "1": "🙂", "2": "😤", "3": "🦁", "4": "💪", "5": "🦸" },
    "dry → soaked": { "0": "🏜️", "1": "🌱", "2": "🌫️", "3": "💧", "4": "🌧️", "5": "🌊" },
    "dark → dazzling": { "0": "🌑", "1": "🌒", "2": "🌓", "3": "💡", "4": "☀️", "5": "🌞" },
    "disgusting → delicious": { "0": "🤮", "1": "🤢", "2": "😐", "3": "😋", "4": "🤤", "5": "🤩" },
    "ferocious → gentle": { "0": "🐑", "-1": "🐶", "-2": "🐱", "-3": "🐗", "-4": "🐺", "-5": "🦁" },
    "hurricane → breeze": { "0": "😌", "-1": "🍃", "-2": "💨", "-3": "🌬️", "-4": "🌪️", "-5": "🌀" },
    "glance → stare": { "0": "👀", "1": "🫣", "2": "👁️", "3": "📺", "4": "🔍", "5": "😳" },
    "tiptoe → stomp": { "0": "🤫", "1": "🐭", "2": "🚶", "3": "🥁", "4": "🐘", "5": "🦖" }
  };
  const STRENGTH = ["", "a little", "some", "strong", "very strong", "strongest"];
  const css = `.mtr{--bg:#eef2f7;background:var(--bg);border-radius:18px;padding:16px;display:grid;gap:12px;transition:background .35s;user-select:none}
.mtr-top{display:grid;grid-template-columns:auto 1fr;gap:16px;align-items:center}
.mtr-face{font-size:clamp(3.4rem,9vw,5.2rem);line-height:1;filter:drop-shadow(0 4px 8px rgba(0,0,0,.15));transition:transform .25s}
.mtr-face.pop{animation:mtrpop .45s ease}
@keyframes mtrpop{0%{transform:scale(.55) rotate(-12deg)}60%{transform:scale(1.18) rotate(6deg)}100%{transform:scale(1) rotate(0)}}
.mtr-lv{font:800 .78rem var(--f-body,system-ui);letter-spacing:.06em;text-transform:uppercase;opacity:.75}
.mtr-words{display:flex;flex-wrap:wrap;gap:8px;margin-top:6px}
.mtr-w{background:#fff;border-radius:14px;padding:8px 10px;box-shadow:0 2px 6px rgba(0,0,0,.08);display:flex;flex-direction:column;gap:4px;min-width:150px;max-width:260px}
.mtr-w b{font:800 1.25rem var(--f-display,system-ui);display:flex;align-items:center;gap:6px}
.mtr-w small{font-size:.82rem;color:#475569;line-height:1.3}
.mtr-w.x{background:rgba(255,255,255,.75);border:1.5px dashed rgba(0,0,0,.18)}
.mtr-xt{font:800 .62rem var(--f-body,system-ui);letter-spacing:.04em;text-transform:uppercase;background:#1f2937;color:#fff;border-radius:999px;padding:2px 7px;margin-left:4px}
.mtr-w .row{display:flex;gap:6px;margin-top:2px}
.mtr-w button{font:800 .8rem var(--f-body,system-ui);border-radius:999px;border:1.5px solid var(--accent,#2347c5);background:#fff;color:var(--accent,#2347c5);padding:4px 10px;cursor:pointer}
.mtr-w button.add{background:var(--accent,#2347c5);color:#fff}
.mtr-track{position:relative;padding:6px 0 2px}
.mtr-fxbox{position:relative;height:210px;border-radius:16px;background:rgba(255,255,255,.62);border:1.5px dashed #cbd5e1;display:grid;place-items:center;overflow:hidden;color:#64748b;font:700 13px system-ui;text-align:center;padding:10px 44px}.mtr-fxbox[hidden]{display:none}
.mtr-fxbox .fxl{max-width:30ch;line-height:1.35}.mtr-fxfull{position:absolute;right:8px;top:8px;z-index:9996;width:34px;height:34px;border-radius:10px;border:1.5px solid #cbd5e1;background:#fff;font:800 18px system-ui;cursor:pointer;color:#334155;display:grid;place-items:center;padding:0}.mtr-fxfull[hidden]{display:none}.mtr-fxfull:hover{border-color:#6d28d9;color:#6d28d9}
.mtr-fxrow{display:flex;justify-content:center;margin-top:6px}.mtr-fx{border:1.5px solid #e2e8f0;border-radius:999px;background:#fff;padding:4px 12px;font:700 13px system-ui;cursor:pointer;color:#334155}.mtr-fx[aria-pressed=true]{border-color:#a78bfa;background:#f5f3ff;color:#5b21b6}
.mtr-track input[type=range]{width:100%;-webkit-appearance:none;appearance:none;height:16px;border-radius:99px;outline:none;cursor:pointer;background:var(--grad)}
.mtr-track input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:38px;height:38px;border-radius:50%;background:#fff;border:4px solid #1f2937;box-shadow:0 3px 8px rgba(0,0,0,.25);cursor:grab}
.mtr-track input[type=range]::-moz-range-thumb{width:32px;height:32px;border-radius:50%;background:#fff;border:4px solid #1f2937;cursor:grab}
.mtr-track input[type=range]:focus-visible::-webkit-slider-thumb{outline:4px solid var(--accent,#2347c5)}
.mtr-ticks{display:flex;justify-content:space-between;margin-top:6px}
.mtr-ticks button{border:0;background:none;cursor:pointer;font:800 .8rem var(--f-body,system-ui);color:#334155;padding:2px 4px;border-radius:6px;min-width:26px}
.mtr-ticks button.on{background:#1f2937;color:#fff}
.mtr-nav{display:flex;justify-content:space-between;align-items:center;gap:8px}
.mtr-nav button{font:800 .9rem var(--f-body,system-ui);border:0;border-radius:999px;padding:8px 14px;cursor:pointer;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.08)}
.mtr-nav button:disabled{opacity:.35;cursor:default}
.mtr-head{display:flex;justify-content:flex-end;margin:-6px -6px -4px 0}
.mtr-sty{display:inline-flex;background:rgba(255,255,255,.6);border-radius:999px;padding:2px}
.mtr-sty button{border:0;background:transparent;border-radius:999px;font-size:1rem;padding:3px 9px;cursor:pointer;opacity:.6}
.mtr-sty button[aria-pressed="true"]{background:#fff;opacity:1;box-shadow:0 1px 4px rgba(0,0,0,.12)}
.mtr-gauge{display:none;justify-content:center}
.mtr-gauge svg{width:min(100%,460px);height:auto;overflow:visible}
.mtr-gauge text{font-family:var(--f-body,system-ui);pointer-events:none}
.mtr-gauge .sg{cursor:pointer;transition:transform .35s cubic-bezier(.34,1.56,.64,1),filter .2s;transform-box:view-box;transform-origin:0 0;stroke:#fff;stroke-width:3}
.mtr-gauge .sg:hover{filter:brightness(1.08)}
.mtr-gauge .ndl{transition:transform .75s cubic-bezier(.34,1.56,.64,1);transform-box:view-box;transform-origin:0 0}
.mtr-gauge .tk{cursor:pointer}
.mtr-gauge .big{animation:mtrpop .45s ease;transform-box:fill-box;transform-origin:center}
.mtr[data-sty="arc"] .mtr-gauge,.mtr[data-sty="dial"] .mtr-gauge,.mtr[data-sty="thermo"] .mtr-gauge{display:flex}
.mtr[data-sty="thermo"] .mtr-track,.mtr[data-sty="thermo"] .mtr-face{display:none}.mtr[data-sty="thermo"] .mtr-top{grid-template-columns:1fr}
.mtr-gauge .hg{transition:transform .8s cubic-bezier(.34,1.56,.64,1),fill .4s;transform-box:fill-box;transform-origin:50% 100%}
.mtr-gauge .bub{animation:mtrbub 1.6s ease-in infinite;opacity:0}
@keyframes mtrbub{0%{transform:translateY(0);opacity:0}20%{opacity:.8}100%{transform:translateY(-60px);opacity:0}}
.mtr[data-sty="arc"] .mtr-track,.mtr[data-sty="dial"] .mtr-track,.mtr[data-sty="arc"] .mtr-face,.mtr[data-sty="dial"] .mtr-face{display:none}
.mtr[data-sty="arc"] .mtr-top,.mtr[data-sty="dial"] .mtr-top{grid-template-columns:1fr}
@media (prefers-reduced-motion:reduce){.mtr-gauge .sg,.mtr-gauge .ndl{transition:none}}
.mtr-nav .mid{font:800 .85rem var(--f-body,system-ui);background:rgba(255,255,255,.7);border-radius:999px;padding:6px 12px}`;
  // Every meter reads left → right as bad/negative (red) → good/positive (green). Meters that are neither
  // (size, distance, how loud a voice is…) are NEUTRAL and use calm blues.
  const NEUTRAL = new Set(["detached ⇄ clingy", "smile → burst out laughing", "gullible ⇄ distrustful", "passive ⇄ rude", "resisting ⇄ indifferent", "hands-off ⇄ controlling", "low mood → depression", "tiny → gigantic", "near → far", "dry → soaked", "dark → dazzling", "glance → stare", "tiptoe → stomp", "minor → crucial",
    "rain · light → pouring", "rain · how long · short → all day", "snow · light → heavy", "sun · weak → blazing", "voice · whispering → booming",
    "speak · whisper → shout", "laugh · quietly → loudly", "impact · small → huge", "obvious · very → perfectly", "decision · small → crucial"]);
  // how a meter behaves: two-sided (−5 … +5), negative only (−5 … 0, 0 = the good end), or positive only (0 … +5)
  function tone(title, levels) { const rs = (levels || []).map(l => l.rank), min = Math.min(0, ...rs), max = Math.max(0, ...rs);
    const two = /⇄/.test(title || "") || (min < 0 && max > 0);
    return { min, max, two, neg: !two && min < 0, neutral: NEUTRAL.has(String(title || "").toLowerCase()) }; }
  function color(r, T) { const t = T.max === T.min ? 1 : (r - T.min) / (T.max - T.min);
    if (T.neutral) return `hsl(210 70% ${93 - t * 16}%)`;
    return `hsl(${Math.round(t * 140)} 75% ${88 - Math.abs(t - .5) * 8}%)`; }
  function gradient(T) { return T.neutral ? "linear-gradient(90deg,hsl(205 80% 82%),hsl(225 70% 55%))" : "linear-gradient(90deg,hsl(0 80% 55%),hsl(45 90% 58%),hsl(140 60% 42%))"; }
  // how meters look: 🌈 rainbow arc (young children), ⏱️ dial with a needle, 🎚️ slider. Chosen by age; the child can switch.
  function age() { const p = window.App && App.profile; if (!p || p.role === "teacher" || p.is_admin) return null;
    if (p.birth_date) { const b = new Date(p.birth_date), n = new Date(); let a = n.getFullYear() - b.getFullYear(); if (n.getMonth() < b.getMonth() || (n.getMonth() === b.getMonth() && n.getDate() < b.getDate())) a--; return a; }
    return p.birth_year ? new Date().getFullYear() - p.birth_year : null; }
  // what the parent allows (profiles.view_prefs); nothing set = everything on, chosen by age
  const LOOKS = ["arc", "dial", "thermo", "bar"];
  function prefs() { const p = (window.App && App.profile && App.profile.view_prefs) || {}, a = age();
    const meters = (Array.isArray(p.meters) ? p.meters : LOOKS).filter(x => LOOKS.includes(x));
    const words = Array.isArray(p.words) ? p.words.filter(x => x === "wheel" || x === "venn") : (a != null && a <= 7 ? ["wheel"] : ["wheel", "venn"]);
    return { meters: meters.length ? meters : LOOKS, meterDefault: LOOKS.includes(p.meterDefault) ? p.meterDefault : "auto", words }; }
  function style() { const P = prefs(); try { const s = localStorage.getItem("meterStyle"); if (s && P.meters.includes(s)) return s; } catch (e) {}
    if (P.meterDefault !== "auto" && P.meters.includes(P.meterDefault)) return P.meterDefault;
    const a = age(), byAge = a == null || a <= 11 ? "arc" : a <= 14 ? "dial" : "bar"; return P.meters.includes(byAge) ? byAge : P.meters[0]; }
  const MOUNTED = new Set();
  function setStyle(s) { try { localStorage.setItem("meterStyle", s); } catch (e) {} MOUNTED.forEach(f => { if (!document.body.contains(f.el)) MOUNTED.delete(f); else f.restyle(s); }); }
  function mount(el, o) {
    if (!document.getElementById("meter-css")) $("head").append(`<style id="meter-css">${css}</style>`);
    const D = o.words || window.WORDS || [], L = (o.levels || []).slice().sort((a, b) => a.rank - b.rank);
    if (!L.length) { $(el).empty(); return null; }
    const faces = FACES[String(o.title || "").toLowerCase()] || {};
    const X = new Set(o.extra || []);   // words from outside this list, shown to complete the scale
    const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const clean = w => String(w || "").replace(/\s*\(.*\)/, "");
    const T = tone(o.title, L), grad = gradient(T);
    let k = Math.max(0, L.findIndex(l => l.rank === (o.start != null ? o.start : (T.two ? 0 : L[0].rank)))); if (k < 0) k = 0;
    if (o.start != null && L[k].rank !== o.start) k = L.reduce((b, l, j) => Math.abs(l.rank - o.start) < Math.abs(L[b].rank - o.start) ? j : b, 0);
    let sty = o.style || style();
    const $m = $(`<div class="mtr" role="group" aria-label="${esc(o.title)} feeling meter" data-sty="${sty}">
      <div class="mtr-head"${prefs().meters.length < 2 ? " hidden" : ""}><div class="mtr-sty" role="group" aria-label="Meter look">${[["arc", "🌈", "Rainbow"], ["dial", "⏱️", "Dial"], ["thermo", "🌡️", "Thermometer"], ["bar", "🎚️", "Slider"]].filter(x => prefs().meters.includes(x[0])).map(([k, i, t]) => `<button type="button" data-sty="${k}" title="${t}" aria-label="${t}" aria-pressed="${k === sty}">${i}</button>`).join("")}</div></div>
      <div class="mtr-gauge"></div>
      <div class="mtr-top"><div class="mtr-face" aria-hidden="true"></div><div><div class="mtr-lv"></div><div class="mtr-words"></div></div></div>
      <div class="mtr-track" style="--grad:${grad}"><input type="range" min="0" max="${L.length - 1}" step="1" value="${k}" aria-label="Strength">
        <div class="mtr-ticks">${L.map((l, j) => `<button type="button" data-j="${j}" title="${esc(l.items.map(i => clean(D[i] && D[i].w)).join(", "))}">${l.rank > 0 ? "+" : ""}${l.rank}</button>`).join("")}</div></div>
      <div class="mtr-nav"><button type="button" data-step="-1">◀ ${esc(o.left ? "more " + o.left : "less")}</button><span class="mid"></span><button type="button" data-step="1">${esc(o.right ? "more " + o.right : "more")} ▶</button></div>
      <div class="mtr-fxbox" data-fxbox hidden><span class="fxl"></span><button type="button" class="mtr-fxfull" data-fxfull title="Play it on the whole screen" aria-label="Play it on the whole screen" hidden>⤢</button></div>
      <div class="mtr-fxrow"><button type="button" class="mtr-fx" data-mfx aria-pressed="true"></button></div></div>`);
    $(el).empty().append($m);
    const N = L.length, PI = Math.PI, P = (r, a) => [+(r * Math.cos(a)).toFixed(1), +(r * Math.sin(a)).toFixed(1)];
    const segA = j => [PI + j * PI / N, PI + (j + 1) * PI / N];
    const arcD = (r1, r2, a1, a2) => { const [x1, y1] = P(r2, a1), [x2, y2] = P(r2, a2), [x3, y3] = P(r1, a2), [x4, y4] = P(r1, a1); return `M${x1},${y1}A${r2},${r2} 0 0 1 ${x2},${y2}L${x3},${y3}A${r1},${r1} 0 0 0 ${x4},${y4}Z`; };
    const strong = r => { const t = T.max === T.min ? 1 : (r - T.min) / (T.max - T.min); return T.neutral ? `hsl(${205 + t * 20} 75% ${72 - t * 26}%)` : `hsl(${Math.round(t * 130)} 72% 52%)`; };
    const faceOf = l => faces[String(l.rank)] || (D[l.items[0]] && D[l.items[0]].emoji) || "🙂";
    const word1 = l => clean(D[l.items[0]] && D[l.items[0]].w);
    function gauge() {
      const $g = $m.find(".mtr-gauge"); if (sty === "bar") { $g.empty(); return; }
      const ends = `<text x="-150" y="22" font-size="11" font-weight="800" text-anchor="start" fill="#334155">${esc(String(o.left || "").toUpperCase())}</text><text x="150" y="22" font-size="11" font-weight="800" text-anchor="end" fill="#334155">${esc(String(o.right || "").toUpperCase())}</text>`;
      if (sty === "arc") $g.html(`<svg viewBox="-160 -152 320 182">${L.map((l, j) => { const [a1, a2] = segA(j), [ex, ey] = P(106, (a1 + a2) / 2);
          return `<g class="sg" data-j="${j}"><path d="${arcD(72, 142, a1, a2)}" fill="${strong(l.rank)}"><title>${esc(l.items.map(i => clean(D[i] && D[i].w)).join(", "))}</title></path>${N <= 12 ? `<text x="${ex}" y="${ey}" font-size="${N > 8 ? 17 : 22}" text-anchor="middle" dominant-baseline="middle">${faceOf(l)}</text>` : ""}</g>`; }).join("")}
        <text class="cw" x="0" y="-18" font-size="24" font-weight="800" text-anchor="middle" fill="#1b2333"></text><text class="cl" x="0" y="4" font-size="11" font-weight="800" text-anchor="middle" fill="#475569"></text>${ends}</svg>`);
      else if (sty === "thermo") { const top = 10, bot = 200, H = bot - top, yOf = j => bot - (j + .5) * H / N;
        $g.html(`<svg viewBox="0 -10 380 270">
          <rect x="58" y="${top - 6}" width="44" height="${H + 12}" rx="22" fill="#fff" stroke="#cbd5e1" stroke-width="3"/>
          <rect class="hg" x="68" y="${top}" width="24" height="${H + 30}" rx="12" fill="${strong(L[0].rank)}"/>
          <circle class="bulb" cx="80" cy="${bot + 28}" r="30" fill="${strong(L[0].rank)}" stroke="#fff" stroke-width="5"/>
          <circle cx="71" cy="${bot + 19}" r="8" fill="rgba(255,255,255,.55)"/>
          ${[0, 1, 2].map(b => `<circle class="bub" cx="${74 + b * 6}" cy="${bot + 10}" r="3" fill="rgba(255,255,255,.8)" style="animation-delay:${b * .5}s"/>`).join("")}
          ${L.map((l, j) => { const y = yOf(j); return `<g class="tk" data-j="${j}"><line x1="104" y1="${y}" x2="118" y2="${y}" stroke="#334155" stroke-width="3" stroke-linecap="round"/>
            <text x="34" y="${y + 1}" font-size="${N > 9 ? 15 : 19}" text-anchor="middle" dominant-baseline="middle">${faceOf(l)}</text>
            <rect class="tl" x="124" y="${y - 11}" width="${Math.min(246, 22 + l.items.map(i => clean(D[i] && D[i].w)).join(", ").length * 6.4)}" height="22" rx="11" fill="rgba(255,255,255,.7)"/>
            <text class="tt" x="134" y="${y + 1}" font-size="11.5" font-weight="700" dominant-baseline="middle" fill="#1b2333">${esc((l.rank > 0 ? "+" : "") + l.rank + " · " + (l.items.map(i => clean(D[i] && D[i].w)).join(", ").slice(0, 34)))}</text></g>`; }).join("")}
          <text x="80" y="${bot + 74}" font-size="11" font-weight="800" text-anchor="middle" fill="#334155">${esc(String(o.left || "").toUpperCase())}</text>
          <text x="80" y="${top - 16}" font-size="11" font-weight="800" text-anchor="middle" fill="#334155">${esc(String(o.right || "").toUpperCase())}</text></svg>`); }
      else $g.html(`<svg viewBox="-165 -165 330 195">${L.map((l, j) => { const [a1, a2] = segA(j); return `<path d="${arcD(118, 130, a1 + .01, a2 - .01)}" fill="${strong(l.rank)}"/>`; }).join("")}
        ${L.map((l, j) => { const [a1, a2] = segA(j), m = (a1 + a2) / 2, [x1, y1] = P(110, m), [x2, y2] = P(100, m), [tx, ty] = P(146, m);
          return `<g class="tk" data-j="${j}"><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#334155" stroke-width="3" stroke-linecap="round"/><circle cx="${tx}" cy="${ty}" r="13" fill="rgba(255,255,255,.85)"/><text x="${tx}" y="${ty + 1}" font-size="10" font-weight="800" text-anchor="middle" dominant-baseline="middle" fill="#1b2333">${l.rank > 0 ? "+" : ""}${l.rank}</text></g>`; }).join("")}
        <text x="-150" y="-6" font-size="26" text-anchor="middle">${faceOf(L[0])}</text><text x="150" y="-6" font-size="26" text-anchor="middle">${faceOf(L[N - 1])}</text>
        <text class="big" x="0" y="-62" font-size="40" text-anchor="middle" dominant-baseline="middle"></text>
        <g class="ndl"><path d="M-7,0 L0,-112 L7,0 Z" fill="#dc2626"/><circle r="12" fill="#1b2333"/><circle r="5" fill="#fff"/></g>
        <text class="cw" x="0" y="26" font-size="17" font-weight="800" text-anchor="middle" fill="#1b2333"></text>${ends.replace(/y="22"/g, 'y="26"')}</svg>`);
    }
    function paint(animate) {
      const l = L[k];
      if (sty === "arc") { $m.find(".mtr-gauge .sg").each(function (j) { const [a1, a2] = segA(j), m = (a1 + a2) / 2, on = j === k;
          this.style.transform = on ? `translate(${(Math.cos(m) * 9).toFixed(1)}px,${(Math.sin(m) * 9).toFixed(1)}px) scale(1.04)` : ""; this.style.opacity = on ? 1 : .55; });
        $m.find(".mtr-gauge .cw").text(word1(l)); $m.find(".mtr-gauge .cl").text(`${l.rank > 0 ? "+" : ""}${l.rank}`); }
      if (sty === "thermo") { const top = 10, bot = 200, Hr = bot - top + 30, yk = bot - (k + .5) * (bot - top) / N, frac = (top + Hr - yk) / Hr, c = strong(l.rank);
        $m.find(".mtr-gauge .hg").css("transform", `scaleY(${frac.toFixed(3)})`).attr("fill", c); $m.find(".mtr-gauge .bulb").attr("fill", c);
        $m.find(".mtr-gauge .tk").each(function (j) { $(this).find(".tl").attr("fill", j === k ? "#1b2333" : "rgba(255,255,255,.7)"); $(this).find(".tt").attr("fill", j === k ? "#fff" : "#1b2333"); }); }
      if (sty === "dial") { const [a1, a2] = segA(k), deg = ((a1 + a2) / 2) * 180 / PI - 270;
        $m.find(".mtr-gauge .ndl").css("transform", `rotate(${deg.toFixed(1)}deg)`); $m.find(".mtr-gauge .cw").text(word1(l));
        const $b = $m.find(".mtr-gauge .big"); $b.text(faceOf(l)); if (animate && $b[0]) { $b.removeClass("big"); void $b[0].getBBox; $b.addClass("big"); } }
    }
    const $face = $m.find(".mtr-face"), $lv = $m.find(".mtr-lv"), $words = $m.find(".mtr-words"), $range = $m.find("input"), $mid = $m.find(".mid");
    function show(j, animate) {
      k = Math.max(0, Math.min(L.length - 1, j)); const l = L[k], a = Math.abs(l.rank);
      const f = faces[String(l.rank)] || (D[l.items[0]] && D[l.items[0]].emoji) || "🙂";
      $face.text(f); if (animate) { $face.removeClass("pop"); void $face[0].offsetWidth; $face.addClass("pop"); }
      $m.css("--bg", color(l.rank, T)); $range.val(k);
      const lab = l.rank === 0 ? (T.two ? "neutral: in the middle" : String((T.neg ? o.right : o.left) || "lowest").toLowerCase())
        : `${STRENGTH[Math.min(5, a)]}${T.two ? " · " + (l.rank < 0 ? o.left : o.right) : T.neg ? " · " + String(o.left || "").toLowerCase() : ""}`;
      $lv.text(`${l.rank > 0 ? "+" : ""}${l.rank} · ${lab}`); $mid.text(lab);
      $words.html(l.items.map(i => { const v = D[i] || {}; return `<div class="mtr-w${X.has(i) ? " x" : ""}"><b>${esc(v.emoji || "")} ${esc(clean(v.w))}${X.has(i) ? '<span class="mtr-xt" title="Not in this set: shown so you can see the whole scale">extra word</span>' : ""}</b><small>${esc(v.d || "")}</small>
        <div class="row"><button type="button" data-say="${i}">🔊 Hear</button>${o.onAdd ? `<button type="button" class="add" data-add="${i}">${esc(o.addLabel || "+ Add")}</button>` : ""}</div></div>`; }).join(""));
      $m.find(".mtr-ticks button").removeClass("on").eq(k).addClass("on"); paint(animate);
      $m.find('[data-step="-1"]').prop("disabled", k === 0); $m.find('[data-step="1"]').prop("disabled", k === L.length - 1);
      o.onLevel && o.onLevel(l.rank);
      if (animate) playLevel(l);
    }
    // ✨ effects as you move: the first word on the new level that has an effect plays it (waits until a drag stops)
    const FXK = "meter-fx", fxOn = () => { try { return localStorage.getItem(FXK) !== "0"; } catch (e) { return true; } };
    const fxBtn = () => { const $b = $m.find("[data-mfx]"), off = !window.Weather || (Weather.mode && Weather.mode() === "off"); $b.closest(".mtr-fxrow").toggle(!!window.Weather); const on = !!window.Weather && fxOn() && !off, $bx = $m.find("[data-fxbox]"); $bx.prop("hidden", !on); if (on && !$bx.data("seen")) { $bx.data("seen", 1); $bx.find(".fxl").text("✨ Move the meter: a little scene plays here"); } $b.attr("aria-pressed", String(fxOn() && !off)).text(off ? "✨ Effects are off (corner switch)" : fxOn() ? "✨ Effects as I move: On" : "✨ Effects as I move: Off"); };
    let fxTimer = 0;
    let lastW = null, fxTok = 0;
    const fxLab = h => $m.find("[data-fxbox] .fxl").html(h);
    function playLevel(l) { if (!window.Weather || !fxOn() || (Weather.mode && Weather.mode() === "off")) return; clearTimeout(fxTimer);
      fxTimer = setTimeout(async () => { const my = ++fxTok, box = $m.find("[data-fxbox]")[0], $full = $m.find("[data-fxfull]");
        const w = l.items.map(i => D[i] && D[i].w).find(w => w && Weather.recipe(w)); Weather.stop();
        if (!w) { lastW = null; $full.prop("hidden", true); fxLab("✨ No scene for these words"); return; }
        if (Weather.load) await Weather.load(); if (my !== fxTok) return;
        const r = Weather.recipe(w), how = Weather.behaviour ? Weather.behaviour(w) : "full"; lastW = w; $full.prop("hidden", false);
        if (how === "full") { fxLab(`${r.e} ${r.name}<br><small>plays on the whole screen</small>`); Weather.play(w, { force: 1 }); }
        else if (how === "box" && Weather.play(w, { force: 1, box })) fxLab("");
        else fxLab(`${r.e} ${r.name}<br><small>tap ⤢ to see it on the whole screen</small>`); }, 380); }
    $m.on("click", "[data-fxfull]", function () { if (lastW) { Weather.stop(); Weather.play(lastW, { force: 1 }); } });
    $m.on("click", "[data-mfx]", function () { if (Weather.mode && Weather.mode() === "off") return; try { localStorage.setItem(FXK, fxOn() ? "0" : "1"); } catch (e) {} if (!fxOn()) Weather.stop(); fxBtn(); });
    setTimeout(fxBtn, 0);
    $range.on("input", function () { show(+this.value, true); });
    $m.on("click", "[data-j]", function () { show(+$(this).data("j"), true); });
    $m.on("click", "[data-step]", function () { show(k + +$(this).data("step"), true); });
    $m.on("click", "[data-say]", function () { const i = +$(this).data("say"); if (o.onSay) o.onSay(i); else if (window.Sets) Sets.sayWord(D[i]); });
    $m.on("click", "[data-add]", function () { const i = +$(this).data("add"); o.onAdd && o.onAdd(i); $(this).text("✓ Added"); });
    $m.on("keydown", function (e) { if (e.target.tagName === "INPUT") return; if (e.key === "ArrowLeft") { show(k - 1, true); e.preventDefault(); } if (e.key === "ArrowRight") { show(k + 1, true); e.preventDefault(); } });
    $m.on("click", "[data-sty]", function () { setStyle(String($(this).data("sty"))); });
    const me = { el: $m[0], restyle(s) { sty = s; $m.attr("data-sty", s); $m.find(".mtr-sty button").each(function () { this.setAttribute("aria-pressed", this.dataset.sty === s); }); gauge(); paint(false); } };
    MOUNTED.add(me);
    gauge(); show(k, false);
    return { show: r => { const j = L.findIndex(l => l.rank === r); if (j >= 0) show(j, true); } };
  }
  window.Meter = { tone, color, mount, style, setStyle, age, prefs };
})(window.jQuery);
