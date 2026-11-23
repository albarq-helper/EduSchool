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
.mtr-nav .mid{font:800 .85rem var(--f-body,system-ui);background:rgba(255,255,255,.7);border-radius:999px;padding:6px 12px}`;
  // Every meter reads left → right as bad/negative (red) → good/positive (green). Meters that are neither
  // (size, distance, how loud a voice is…) are NEUTRAL and use calm blues.
  const NEUTRAL = new Set(["tiny → gigantic", "near → far", "dry → soaked", "dark → dazzling", "glance → stare", "tiptoe → stomp", "minor → crucial",
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
    const $m = $(`<div class="mtr" role="group" aria-label="${esc(o.title)} feeling meter">
      <div class="mtr-top"><div class="mtr-face" aria-hidden="true"></div><div><div class="mtr-lv"></div><div class="mtr-words"></div></div></div>
      <div class="mtr-track" style="--grad:${grad}"><input type="range" min="0" max="${L.length - 1}" step="1" value="${k}" aria-label="Strength">
        <div class="mtr-ticks">${L.map((l, j) => `<button type="button" data-j="${j}" title="${esc(l.items.map(i => clean(D[i] && D[i].w)).join(", "))}">${l.rank > 0 ? "+" : ""}${l.rank}</button>`).join("")}</div></div>
      <div class="mtr-nav"><button type="button" data-step="-1">◀ ${esc(o.left ? "more " + o.left : "less")}</button><span class="mid"></span><button type="button" data-step="1">${esc(o.right ? "more " + o.right : "more")} ▶</button></div></div>`);
    $(el).empty().append($m);
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
      $m.find(".mtr-ticks button").removeClass("on").eq(k).addClass("on");
      $m.find('[data-step="-1"]').prop("disabled", k === 0); $m.find('[data-step="1"]').prop("disabled", k === L.length - 1);
      o.onLevel && o.onLevel(l.rank);
    }
    $range.on("input", function () { show(+this.value, true); });
    $m.on("click", "[data-j]", function () { show(+$(this).data("j"), true); });
    $m.on("click", "[data-step]", function () { show(k + +$(this).data("step"), true); });
    $m.on("click", "[data-say]", function () { const i = +$(this).data("say"); if (o.onSay) o.onSay(i); else if (window.Sets) Sets.sayWord(D[i]); });
    $m.on("click", "[data-add]", function () { const i = +$(this).data("add"); o.onAdd && o.onAdd(i); $(this).text("✓ Added"); });
    $m.on("keydown", function (e) { if (e.target.tagName === "INPUT") return; if (e.key === "ArrowLeft") { show(k - 1, true); e.preventDefault(); } if (e.key === "ArrowRight") { show(k + 1, true); e.preventDefault(); } });
    show(k, false);
    return { show: r => { const j = L.findIndex(l => l.rank === r); if (j >= 0) show(j, true); } };
  }
  window.Meter = { tone, color, mount };
})(window.jQuery);
