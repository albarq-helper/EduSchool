// Helper Academy — Montage player: plays a story's scene clips one after another as one movie,
// with an opening title card, the story text as subtitles, scene dots and a closing card.
// Montage.mount(el, {title, by, shots:[{scene, video_url}], captions:[text per scene],
//   music:{film: mp3 for the whole movie, scenes:{n: mp3}}, trans:[["Fade to black"|"Dissolve"|"Cut"] per scene]})
// With music, each clip's own sound plays softly underneath.
(function () {
  const css = `.mt{position:relative;background:#000;border-radius:16px;overflow:hidden;aspect-ratio:16/9;max-width:960px;color:#fff;font-family:var(--f-body,system-ui)}
.mt video{width:100%;height:100%;object-fit:cover;display:block}
.mt .card{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px;background:radial-gradient(circle at 50% 40%,#1e293b,#020617);transition:opacity .8s}
.mt .card.hide{opacity:0;pointer-events:none}
.mt .card small{letter-spacing:.3em;text-transform:uppercase;color:#facc15;font-weight:800;font-size:clamp(.7rem,1.6vw,.95rem)}
.mt .card h2{font:800 clamp(1.4rem,4.6vw,3rem)/1.1 var(--f-display,system-ui);margin:10px 0 8px}
.mt .card p{margin:0;color:#cbd5e1;font-size:clamp(.85rem,2vw,1.15rem)}
.mt .card .go{margin-top:20px;font:800 1rem var(--f-body,system-ui);background:#facc15;color:#111;border:0;border-radius:999px;padding:12px 26px;cursor:pointer}
.mt .sub{position:absolute;left:5%;right:5%;bottom:7%;text-align:center;font:700 clamp(.8rem,2.1vw,1.25rem)/1.4 var(--f-body,system-ui);text-shadow:0 2px 6px #000,0 0 2px #000;background:rgba(0,0,0,.35);border-radius:10px;padding:6px 12px;opacity:0;transition:opacity .4s}
.mt .sub.on{opacity:1}
.mt .bar{position:absolute;left:0;right:0;top:0;display:flex;gap:4px;padding:8px 10px;opacity:.9}
.mt .bar i{flex:1;height:4px;border-radius:4px;background:rgba(255,255,255,.3);overflow:hidden}.mt .bar i b{display:block;height:100%;width:0;background:#facc15}
.mt .ctl{position:absolute;right:10px;bottom:10px;display:flex;gap:6px}
.mt .fade{position:absolute;inset:0;background:#000;opacity:0;pointer-events:none;transition:opacity .6s}.mt .fade.on{opacity:1}
.mt .ctl button{background:rgba(0,0,0,.55);color:#fff;border:1px solid rgba(255,255,255,.35);border-radius:999px;padding:6px 12px;font:700 .85rem var(--f-body,system-ui);cursor:pointer}`;
  function mount(el, o) {
    if (!document.getElementById("montage-css")) document.head.insertAdjacentHTML("beforeend", `<style id="montage-css">${css}</style>`);
    const shots = (o.shots || []).filter(s => s.video_url).sort((a, b) => a.scene - b.scene);
    const esc = s => String(s || "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    if (!shots.length) { el.innerHTML = `<p class="muted">No scenes have been filmed yet.</p>`; return; }
    el.innerHTML = `<div class="mt"><video playsinline preload="auto"></video><div class="bar">${shots.map(() => "<i><b></b></i>").join("")}</div>
      <div class="sub"></div><div class="fade"></div><div class="ctl">${o.music && (o.music.film || Object.keys(o.music.scenes || {}).length) ? `<button type="button" data-a="music">🎵 Music on</button>` : ""}<button type="button" data-a="pause">❚❚ Pause</button><button type="button" data-a="restart">↺ From the start</button></div>
      <div class="card"><small>A film by ${esc(o.by || "the author")}</small><h2>${esc(o.title || "My story")}</h2><p>${shots.length} scene${shots.length > 1 ? "s" : ""}</p><button class="go" type="button">▶ Play the movie</button></div></div>`;
    const root = el.querySelector(".mt"), v = root.querySelector("video"), card = root.querySelector(".card"), sub = root.querySelector(".sub"), bars = [...root.querySelectorAll(".bar b")];
    let k = 0, playing = false, musicOn = true;
    const M = o.music || {}, film = M.film ? new Audio(M.film) : null, sceneA = {}, fadeEl = root.querySelector(".fade");
    Object.entries(M.scenes || {}).forEach(([n, u]) => { sceneA[n] = new Audio(u); });
    let cur = null;   // the scene track that is playing
    const hasMusic = () => musicOn && (film || Object.keys(sceneA).length);
    const stopScene = () => { if (cur) { cur.pause(); cur = null; } };
    function music(i) { const n = String(shots[i].scene), a = sceneA[n];
      v.volume = hasMusic() ? 0.3 : 1;
      if (!musicOn) { stopScene(); if (film) film.pause(); return; }
      if (a) { if (film) film.volume = 0.25; if (cur !== a) { stopScene(); cur = a; a.currentTime = 0; a.play().catch(() => {}); } }
      else { stopScene(); if (film) film.volume = 0.9; }
      if (film && film.paused) film.play().catch(() => {}); }
    const transOf = i => ((o.trans || [])[shots[i].scene - 1] || []).map(x => String(x).toLowerCase()).join(" ");
    function load(i) { k = i; v.src = shots[i].video_url; const c = (o.captions || [])[shots[i].scene - 1] || ""; sub.textContent = c; sub.classList.toggle("on", !!c);
      bars.forEach((b, j) => b.style.width = j < i ? "100%" : "0"); v.play().catch(() => {}); music(i); setTimeout(() => fadeEl.classList.remove("on"), 60); }
    function start() { card.classList.add("hide"); playing = true; if (film) { film.currentTime = 0; } stopScene(); load(0); }
    function end() { playing = false; stopScene(); if (film) { const f = film; let vol = f.volume; const t = setInterval(() => { vol -= 0.08; if (vol <= 0) { clearInterval(t); f.pause(); } else f.volume = vol; }, 120); } sub.classList.remove("on"); bars.forEach(b => b.style.width = "100%");
      card.innerHTML = `<small>The end</small><h2>${esc(o.title || "My story")}</h2><p>A film by ${esc(o.by || "the author")}</p><button class="go" type="button">↺ Watch again</button>`;
      card.classList.remove("hide"); card.querySelector(".go").onclick = start; }
    v.addEventListener("timeupdate", () => { if (v.duration) bars[k].style.width = (v.currentTime / v.duration * 100) + "%"; });
    v.addEventListener("ended", () => { const t = transOf(k);
      if (/fade|dissolve/.test(t)) { fadeEl.classList.add("on"); setTimeout(() => { if (k + 1 < shots.length) load(k + 1); else end(); }, 650); }
      else if (k + 1 < shots.length) load(k + 1); else end(); });
    card.querySelector(".go").onclick = start;
    root.querySelector('[data-a="pause"]').onclick = e => { if (v.paused) { v.play(); if (musicOn) { if (film) film.play().catch(() => {}); if (cur) cur.play().catch(() => {}); } e.target.textContent = "❚❚ Pause"; } else { v.pause(); if (film) film.pause(); if (cur) cur.pause(); e.target.textContent = "▶ Play"; } };
    const mb = root.querySelector('[data-a="music"]'); if (mb) mb.onclick = () => { musicOn = !musicOn; mb.textContent = musicOn ? "🎵 Music on" : "🔇 Music off"; if (playing) music(k); };
    root.querySelector('[data-a="restart"]').onclick = start;
    // preload the next clip quietly
    v.addEventListener("playing", () => { const n = shots[k + 1]; if (n) { const p = document.createElement("link"); p.rel = "preload"; p.as = "video"; p.href = n.video_url; document.head.appendChild(p); } });
  }
  // newest finished take for each scene
  function latest(rows) { const m = new Map(); (rows || []).filter(r => r.status === "ready" && r.video_url).sort((a, b) => new Date(a.created_at) - new Date(b.created_at)).forEach(r => m.set(r.scene, r)); return [...m.values()]; }
  window.Montage = { mount, latest };
})();
