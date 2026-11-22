// Helper Academy — Feeling meter (jQuery): slide along a scale of words, from one pole to the other.
// A big face changes with the strength, the words at that level pop up, and each can be heard or added.
// Meter.mount(el, {title, left, right, two, levels:[{rank, items:[wordIndex]}], start, onAdd(i), onSay(i), addLabel})
(function ($) {
  if (!$) return;
  const FACES = {
    "hate ⇄ love": { "-5": "🤬", "-4": "😡", "-3": "😠", "-2": "😒", "-1": "🙁", "0": "😐", "1": "🙂", "2": "😊", "3": "🤗", "4": "🥰", "5": "😍" },
    "sad ⇄ happy": { "-5": "😭", "-4": "😩", "-3": "😢", "-2": "😞", "-1": "😕", "0": "😐", "1": "🙂", "2": "😊", "3": "😄", "4": "😁", "5": "🤩" },
    "calm → angry": { "0": "😌", "1": "😒", "2": "😤", "3": "😠", "4": "😡", "5": "🤬" },
    "calm → afraid": { "0": "😌", "1": "😬", "2": "😟", "3": "😨", "4": "😱", "5": "🫣" }
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
  function color(r, two) { const a = Math.min(5, Math.abs(r));
    if (two) return r < 0 ? `hsl(0 80% ${94 - a * 6}%)` : r > 0 ? `hsl(145 60% ${94 - a * 6}%)` : "hsl(220 20% 93%)";
    return r <= 0 ? "hsl(145 60% 90%)" : `hsl(${45 - a * 9} 90% ${92 - a * 5}%)`; }
  function mount(el, o) {
    if (!document.getElementById("meter-css")) $("head").append(`<style id="meter-css">${css}</style>`);
    const D = window.WORDS || [], L = (o.levels || []).slice().sort((a, b) => a.rank - b.rank);
    if (!L.length) { $(el).empty(); return null; }
    const faces = FACES[String(o.title || "").toLowerCase()] || {};
    const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const clean = w => String(w || "").replace(/\s*\(.*\)/, "");
    const grad = o.two ? "linear-gradient(90deg,hsl(0 80% 55%),hsl(220 15% 82%),hsl(145 60% 42%))" : "linear-gradient(90deg,hsl(145 60% 55%),hsl(45 90% 58%),hsl(0 85% 52%))";
    let k = Math.max(0, L.findIndex(l => l.rank === (o.start != null ? o.start : (o.two ? 0 : L[0].rank)))); if (k < 0) k = 0;
    const $m = $(`<div class="mtr" role="group" aria-label="${esc(o.title)} feeling meter">
      <div class="mtr-top"><div class="mtr-face" aria-hidden="true"></div><div><div class="mtr-lv"></div><div class="mtr-words"></div></div></div>
      <div class="mtr-track" style="--grad:${grad}"><input type="range" min="0" max="${L.length - 1}" step="1" value="${k}" aria-label="Strength">
        <div class="mtr-ticks">${L.map((l, j) => `<button type="button" data-j="${j}" title="${esc(l.items.map(i => clean(D[i] && D[i].w)).join(", "))}">${l.rank > 0 ? "+" : ""}${l.rank}</button>`).join("")}</div></div>
      <div class="mtr-nav"><button type="button" data-step="-1">◀ ${esc(o.two ? "more " + o.left : "calmer")}</button><span class="mid"></span><button type="button" data-step="1">${esc(o.two ? "more " + o.right : "stronger")} ▶</button></div></div>`);
    $(el).empty().append($m);
    const $face = $m.find(".mtr-face"), $lv = $m.find(".mtr-lv"), $words = $m.find(".mtr-words"), $range = $m.find("input"), $mid = $m.find(".mid");
    function show(j, animate) {
      k = Math.max(0, Math.min(L.length - 1, j)); const l = L[k], a = Math.abs(l.rank);
      const f = faces[String(l.rank)] || (D[l.items[0]] && D[l.items[0]].emoji) || "🙂";
      $face.text(f); if (animate) { $face.removeClass("pop"); void $face[0].offsetWidth; $face.addClass("pop"); }
      $m.css("--bg", color(l.rank, o.two)); $range.val(k);
      const lab = l.rank === 0 ? (o.two ? "neutral: in the middle" : "calm") : `${STRENGTH[Math.min(5, a)]}${o.two ? " · " + (l.rank < 0 ? o.left : o.right) : ""}`;
      $lv.text(`${l.rank > 0 ? "+" : ""}${l.rank} · ${lab}`); $mid.text(lab);
      $words.html(l.items.map(i => { const v = D[i] || {}; return `<div class="mtr-w"><b>${esc(v.emoji || "")} ${esc(clean(v.w))}</b><small>${esc(v.d || "")}</small>
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
  window.Meter = { mount };
})(window.jQuery);
