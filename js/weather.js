/* 🌦️ Word weather: when a weather word appears, the whole page acts it out for a few seconds.
   Hurricane spins the page into a 🌀, rain words make it rain (stronger along the Dry → Soaked meter), wind words blow
   (stronger along Hurricane → Breeze), storms flash and thunder, snow falls, fog rolls in, night goes dark …
   Loaded on the fly: word cards (.syl[aria-label]), flash cards (.term), [data-wx="word"], or Weather.play(word) from code. */
(function () {
  "use strict";
  // word → recipe. Numbers are strength 1–5 (taken from the meters where a meter exists).
  const R = {};
  const add = (ws, r) => ws.split(",").forEach(w => R[w.trim()] = r);
  add("hurricane,tornado,cyclone,typhoon,twister", { e: "🌀", name: "Hurricane", wind: 5, vortex: 1, rain: 3 });
  add("gale", { e: "🌬️", name: "Gale", wind: 4, rain: 1 });
  add("wind,windy,blustery", { e: "💨", name: "Wind", wind: 3 });
  add("gust,gusty", { e: "💨", name: "Gust", wind: 2, gust: 1 });
  add("breeze,breezy", { e: "🍃", name: "Breeze", wind: 1 });
  add("moist", { e: "💧", name: "Moist", rain: 1, fog: 0.4 });
  add("damp", { e: "🌫️", name: "Damp", rain: 2, fog: 0.3 });
  add("drizzle,drizzling", { e: "🌦️", name: "Drizzle", rain: 1 });
  add("shower,showers", { e: "🌦️", name: "Shower", rain: 2 });
  add("wet,rain,rainy,raining", { e: "🌧️", name: "Rain", rain: 3 });
  add("soaked,drenched,downpour,deluge,torrential,pouring", { e: "🌊", name: "Downpour", rain: 5, puddle: 1 });
  add("flood,flooded,flooding", { e: "🌊", name: "Flood", rain: 4, puddle: 2 });
  add("storm,stormy,thunderstorm,tempest", { e: "⛈️", name: "Storm", rain: 4, wind: 2, flash: 3, night: 0.35 });
  add("thunder,lightning,thunderbolt", { e: "🌩️", name: "Thunder", flash: 3, night: 0.4 });
  add("snow,snowy,snowflake,snowfall", { e: "❄️", name: "Snow", snow: 3 });
  add("blizzard", { e: "🌨️", name: "Blizzard", snow: 5, wind: 4 });
  add("sleet", { e: "🌨️", name: "Sleet", snow: 2, rain: 2 });
  add("hail,hailstorm", { e: "🧊", name: "Hail", drops: ["🧊"], dropN: 3 });
  add("sun,sunny,sunshine,sunlight,warmth", { e: "☀️", name: "Sun", sun: 1 });
  add("scorching,sweltering,heatwave,boiling", { e: "🥵", name: "Heat", sun: 2, heat: 1 });
  add("golden hour,sunset,sunrise", { e: "🌅", name: "Golden hour", sun: 1, tint: "rgba(255,150,40,.18)" });
  add("fog,foggy,mist,misty,haze,hazy", { e: "🌫️", name: "Fog", fog: 1 });
  add("night,midnight", { e: "🌙", name: "Night", night: 0.7, stars: 1 });
  add("dark", { e: "🌑", name: "Dark", night: 0.6 });
  add("shadowy,dim,gloomy", { e: "🌘", name: "Dim", night: 0.35 });
  add("bright", { e: "🔆", name: "Bright", bright: 1 });
  add("dazzling,blinding,glaring", { e: "✨", name: "Dazzling", bright: 2 });
  add("rainbow", { e: "🌈", name: "Rainbow", rain: 1, rainbow: 1 });
  add("raining cats and dogs", { e: "🐈", name: "Raining cats and dogs", rain: 3, drops: ["🐈", "🐕"], dropN: 2 });
  add("every cloud has a silver lining", { e: "🌥️", name: "Silver lining", fog: 0.5, sun: 1 });
  const recipe = w => R[String(w || "").trim().toLowerCase().replace(/[.!?]$/, "")] || null;

  // 🔊 sounds (synthesized, no files)
  let AC = null;
  const ac = () => { try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === "suspended") AC.resume(); } catch (e) { AC = null; } return AC; };
  ["pointerdown", "keydown"].forEach(t => addEventListener(t, () => ac(), { once: true, capture: true }));
  function noise(dur, vol, type, f0, f1, q, t0) {
    const a = ac(); if (!a || a.state !== "running") return null;
    const len = Math.floor(a.sampleRate * dur), b = a.createBuffer(1, len, a.sampleRate), d = b.getChannelData(0);
    let last = 0; for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; last = type === "lowpass" ? (last + 0.02 * w) / 1.02 : w; d[i] = type === "lowpass" ? last * 3.5 : w; }
    const n = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain(), now = a.currentTime + (t0 || 0);
    n.buffer = b; f.type = type === "lowpass" ? "lowpass" : "bandpass"; f.Q.value = q || 1;
    f.frequency.setValueAtTime(f0, now); f.frequency.linearRampToValueAtTime(f1, now + dur * 0.6); f.frequency.linearRampToValueAtTime(f0, now + dur);
    g.gain.setValueAtTime(0.0001, now); g.gain.exponentialRampToValueAtTime(vol, now + 0.6); g.gain.setValueAtTime(vol, now + dur - 0.9); g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    n.connect(f); f.connect(g); g.connect(a.destination); n.start(now); n.stop(now + dur + 0.1);
    return { stop: () => { try { g.gain.cancelScheduledValues(a.currentTime); g.gain.setTargetAtTime(0.0001, a.currentTime, 0.15); } catch (e) {} } };
  }
  function chirp(t0) { const a = ac(); if (!a || a.state !== "running") return; [0, .12, .24].forEach(d => { const o = a.createOscillator(), g = a.createGain(), n = a.currentTime + t0 + d; o.type = "sine"; o.frequency.setValueAtTime(2600, n); o.frequency.exponentialRampToValueAtTime(3800, n + .08); g.gain.setValueAtTime(.0001, n); g.gain.exponentialRampToValueAtTime(.05, n + .02); g.gain.exponentialRampToValueAtTime(.0001, n + .09); o.connect(g); g.connect(a.destination); o.start(n); o.stop(n + .1); }); }
  function soundFor(r, dur) {
    const s = [];
    if (r.rain) s.push(noise(dur, 0.04 + r.rain * 0.035, "band", 2500, 3500, 0.6));
    if (r.wind) s.push(noise(dur, 0.05 + r.wind * 0.04, "band", 300 + r.wind * 80, 900 + r.wind * 250, 2.5));
    if (r.snow && !r.wind) s.push(noise(dur, 0.02, "band", 6000, 7000, 1));
    if (r.sun && !r.heat) [0.4, 1.6, 3].forEach(t => chirp(t));
    return { stop: () => s.forEach(x => x && x.stop()) };
  }
  function thunder(t0) { noise(2.4, 0.5, "lowpass", 120, 60, 1, t0); }

  // 🎨 the stage: a full-screen canvas above the page that ignores clicks
  const css = document.createElement("style");
  css.textContent = `.wx-stage{position:fixed;inset:0;z-index:9990;pointer-events:none}
.wx-layer{position:fixed;inset:0;z-index:9989;pointer-events:none;transition:opacity .8s}
.wx-chip{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:9995;display:flex;gap:6px;align-items:center;background:#fff;border-radius:999px;padding:6px 8px 6px 12px;box-shadow:0 4px 18px #0003;font:700 14px var(--f-display,system-ui);color:#333}
.wx-chip button{border:0;border-radius:999px;padding:4px 10px;font:inherit;cursor:pointer;background:#F1F1F4}
.wx-btn{border:0;background:none;cursor:pointer;font-size:.8em;padding:0 3px;vertical-align:middle;opacity:.85}
.wx-btn:hover{opacity:1;transform:scale(1.15)}`;
  document.head.appendChild(css);
  const OFF_KEY = "wx-off";
  const isOff = () => { try { return localStorage.getItem(OFF_KEY) === "1"; } catch (e) { return false; } };
  const reduce = () => matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  let current = null;

  function play(word, opts) {
    const r = typeof word === "object" ? word : recipe(word);
    if (!r || (isOff() && !(opts && opts.force))) return false;
    stop();
    const dur = (opts && opts.dur) || (r.vortex ? 6500 : 6000), t0 = performance.now();
    const cv = document.createElement("canvas"); cv.className = "wx-stage"; cv.setAttribute("aria-hidden", "true");
    const ctx = cv.getContext("2d"); document.body.appendChild(cv);
    const W = () => innerWidth, H = () => innerHeight, dpr = Math.min(2, devicePixelRatio || 1);
    const size = () => { cv.width = W() * dpr; cv.height = H() * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }; size();
    const layers = [];
    const layer = (bg, op) => { const d = document.createElement("div"); d.className = "wx-layer"; d.style.background = bg; d.style.opacity = 0; document.body.appendChild(d); layers.push(d); requestAnimationFrame(() => d.style.opacity = op); return d; };
    if (r.night) layer("radial-gradient(ellipse at 50% 30%, rgba(10,15,40," + (r.night * .7) + "), rgba(5,8,25," + r.night + "))", 1);
    if (r.tint) layer(r.tint, 1);
    if (r.snow) layer("linear-gradient(rgba(150,175,215,.35), rgba(200,215,235,.2))", 1);
    if (r.sun) layer(`radial-gradient(circle at 88% 8%, rgba(255,230,120,${.55 * r.sun}) 0, rgba(255,200,80,${.25 * r.sun}) 18%, transparent 45%)`, 1);
    if (r.heat) layer("rgba(255,120,40,.12)", 1);
    if (r.bright) layer(`radial-gradient(circle at 50% 40%, rgba(255,255,255,${.5 * r.bright}), rgba(255,250,220,${.25 * r.bright}))`, 1);
    let puddle = null;
    if (r.puddle) { puddle = document.createElement("div"); puddle.className = "wx-layer"; Object.assign(puddle.style, { top: "auto", height: "0", background: "linear-gradient(to bottom, rgba(90,160,230,.35), rgba(40,110,200,.55))", transition: "height 4s ease-in, opacity .8s" }); document.body.appendChild(puddle); layers.push(puddle); requestAnimationFrame(() => puddle.style.height = (r.puddle > 1 ? 22 : 9) + "vh"); }
    // particles
    const P = [], rnd = (a, b) => a + Math.random() * (b - a);
    const windX = (r.wind || 0) * 2.2;
    const N = (r.rain || 0) * 70 + (r.snow || 0) * 40 + (r.wind && !r.rain && !r.snow ? r.wind * 10 : 0);
    for (let i = 0; i < N; i++) P.push(spawn(true));
    function spawn(first) {
      const kind = r.rain && (!r.snow || Math.random() < .5) ? "rain" : r.snow ? "snow" : "leaf";
      const p = { kind, x: rnd(-W() * .3, W()), y: first ? rnd(-H(), H()) : rnd(-60, -10), z: rnd(.5, 1.2) };
      if (kind === "rain") { p.vy = rnd(9, 15) * p.z * (0.7 + (r.rain || 1) * .08); p.vx = windX * 1.5 + 1.5; p.len = rnd(8, 18) * p.z; }
      else if (kind === "snow") { p.vy = rnd(.8, 2.2) * p.z; p.vx = windX * .8; p.r = rnd(1.5, 4) * p.z; p.ph = rnd(0, 6); if (Math.random() < .08) p.flake = 1; }
      else { p.x = first ? rnd(-W(), W()) : rnd(-160, -30); p.y = rnd(0, H()); p.vx = rnd(4, 9) * (r.wind || 1) * .6; p.vy = rnd(-1, 1); p.e = ["🍃", "🍂", "🍁", "💨"][Math.floor(rnd(0, r.wind > 3 ? 4 : 2))]; p.rot = rnd(0, 6); }
      return p;
    }
    const drops = (r.drops || []).length ? Array.from({ length: (r.dropN || 2) * 6 }, () => ({ e: r.drops[Math.floor(rnd(0, r.drops.length))], x: rnd(0, W()), y: rnd(-H(), -30), vy: rnd(2.5, 5), rot: rnd(-.5, .5), vr: rnd(-.05, .05), s: rnd(22, 40) })) : [];
    const stars = r.stars ? Array.from({ length: 90 }, () => ({ x: rnd(0, W()), y: rnd(0, H() * .7), r: rnd(.5, 1.8), ph: rnd(0, 6) })) : [];
    const flashes = r.flash ? Array.from({ length: r.flash }, (_, i) => 700 + i * rnd(1200, 1900)) : [];
    const sfx = soundFor(r, dur / 1000);
    flashes.forEach(t => thunder(t / 1000 + .25));
    // 🌀 the page itself moves
    const moved = movePage(r, dur);
    let raf = 0, ended = false;
    function frame(now) {
      const t = now - t0, life = t / dur, fade = life < .1 ? life / .1 : life > .85 ? Math.max(0, (1 - life) / .15) : 1;
      ctx.clearRect(0, 0, W(), H());
      ctx.globalAlpha = fade;
      if (stars.length) stars.forEach(s => { ctx.fillStyle = `rgba(255,255,230,${.5 + .5 * Math.sin(t / 300 + s.ph)})`; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 7); ctx.fill(); });
      if (r.fog) { for (let i = 0; i < 4; i++) { const fx = ((t / 40 * (i + 1)) % (W() * 1.6)) - W() * .3, fy = H() * (.2 + i * .2); const g = ctx.createRadialGradient(fx, fy, 0, fx, fy, W() * .45); g.addColorStop(0, `rgba(235,238,245,${.55 * r.fog})`); g.addColorStop(1, "rgba(235,238,245,0)"); ctx.fillStyle = g; ctx.fillRect(0, 0, W(), H()); } }
      if (r.sun) { ctx.save(); ctx.translate(W() * .88, H() * .08); ctx.rotate(t / 4000); ctx.fillStyle = `rgba(255,220,90,${.18 * r.sun})`; for (let i = 0; i < 12; i++) { ctx.rotate(Math.PI / 6); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(W() * .5, -20); ctx.lineTo(W() * .5, 20); ctx.fill(); } ctx.restore(); ctx.font = "64px system-ui"; ctx.fillText(r.heat ? "🔥" : "☀️", W() * .88 - 32, H() * .08 + 24); }
      if (r.heat) { ctx.fillStyle = "rgba(255,160,60,.08)"; for (let y = 0; y < H(); y += 24) ctx.fillRect(Math.sin(t / 200 + y / 30) * 6, y, W(), 10); }
      if (r.rainbow && life > .25) { const a = Math.min(1, (life - .25) * 3); ["#ff4b4b", "#ff9f40", "#ffe14b", "#5bd75b", "#4b9bff", "#7a5bff"].forEach((c, i) => { ctx.strokeStyle = c; ctx.globalAlpha = fade * a * .55; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(W() / 2, H() * 1.05, W() * .42 - i * 14, Math.PI, 0); ctx.stroke(); }); ctx.globalAlpha = fade; }
      // rain, snow, leaves
      ctx.lineCap = "round"; const floor = H() - (puddle ? puddle.offsetHeight : 0);
      for (let i = 0; i < P.length; i++) {
        const p = P[i];
        if (p.kind === "rain") { ctx.strokeStyle = `rgba(110,150,210,${.35 + .3 * p.z})`; ctx.lineWidth = 1.2 * p.z; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * p.len / p.vy, p.y - p.len); ctx.stroke(); p.x += p.vx; p.y += p.vy; if (p.y > floor) { splash(p); P[i] = spawn(); } }
        else if (p.kind === "snow") { p.ph += .03; p.x += p.vx + Math.sin(p.ph) * .6; p.y += p.vy; if (p.flake) { ctx.font = `${p.r * 5}px system-ui`; ctx.fillText("❄️", p.x, p.y); } else { ctx.fillStyle = "rgba(255,255,255,.95)"; ctx.shadowColor = "rgba(120,140,180,.6)"; ctx.shadowBlur = 3; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill(); ctx.shadowBlur = 0; } if (p.y > H() + 10 || p.x > W() + 20) P[i] = spawn(); }
        else { p.x += p.vx * (r.gust ? (1 + Math.max(0, Math.sin(t / 500)) * 2) : 1); p.y += p.vy + Math.sin(t / 300 + i) * 1.5; p.rot += .1; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.font = "22px system-ui"; ctx.fillText(p.e, -11, 8); ctx.restore(); if (p.x > W() + 40) P[i] = spawn(); }
      }
      if (r.wind && (r.rain || r.snow)) { ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 2; for (let k = 0; k < r.wind * 2; k++) { const y = (k * 97 + t / 3) % H(), x = ((t * (1 + k % 3)) / 2 + k * 211) % (W() + 300) - 150; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 60, y - 12, x + 140, y); ctx.stroke(); } }
      drops.forEach(d => { d.y += d.vy; d.rot += d.vr; if (d.y > H() + 40) { d.y = -40; d.x = rnd(0, W()); } ctx.save(); ctx.translate(d.x, d.y); ctx.rotate(d.rot); ctx.font = d.s + "px system-ui"; ctx.fillText(d.e, -d.s / 2, d.s / 2); ctx.restore(); });
      splashes.forEach((s, k) => { s.a -= .06; if (s.a <= 0) return splashes.splice(k, 1); ctx.strokeStyle = `rgba(110,150,210,${s.a})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(s.x, s.y, (1 - s.a) * 10 + 2, (1 - s.a) * 3 + 1, 0, 0, 7); ctx.stroke(); });
      if (r.vortex) { const cx = W() / 2, cy = H() * .45; ctx.save(); ctx.translate(cx, cy); ctx.rotate(-t / 140); ctx.globalAlpha = fade * .9; ctx.font = Math.min(W(), H()) * .35 * Math.min(1, life * 4) + "px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("🌀", 0, 0); ctx.restore();
        ctx.globalAlpha = fade; for (let k = 0; k < 14; k++) { const ang = t / 260 + k * .45, rad = 60 + (k * 37 + t / 12) % (Math.min(W(), H()) * .55); ctx.font = "26px system-ui"; ctx.fillText(["🍃", "🍂", "📄", "🧢", "🌿", "🪵", "☂️"][k % 7], cx + Math.cos(ang) * rad - 13, cy + Math.sin(ang) * rad * .6 + 9); } }
      flashes.forEach(ft => { const d = t - ft; if (d > 0 && d < 260) { ctx.globalAlpha = (d < 60 ? 1 : d < 120 ? .3 : d < 180 ? .8 : .2) * .85; ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, W(), H()); if (d < 180) bolt(ft); ctx.globalAlpha = fade; } });
      if (t < dur && !ended) raf = requestAnimationFrame(frame); else stop();
    }
    const splashes = [];
    function splash(p) { if (splashes.length < 60 && Math.random() < .5) splashes.push({ x: p.x, y: p.y, a: 1 }); }
    const bolts = {};
    function bolt(key) {
      const pts = bolts[key] || (bolts[key] = (() => { let x = rnd(W() * .15, W() * .85), y = 0; const a = [[x, y]]; while (y < H() * .65) { x += rnd(-40, 40); y += rnd(25, 60); a.push([x, y]); } return a; })());
      ctx.strokeStyle = "#FFF6B0"; ctx.lineWidth = 4; ctx.shadowColor = "#fff"; ctx.shadowBlur = 20; ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); ctx.shadowBlur = 0;
    }
    const chip = document.createElement("div");
    chip.className = "wx-chip"; chip.setAttribute("role", "status");
    chip.innerHTML = `<span>${r.e} ${r.name}</span><button type="button" data-x>✕ Stop</button><button type="button" data-off>Turn effects off</button>`;
    chip.querySelector("[data-x]").onclick = () => stop();
    chip.querySelector("[data-off]").onclick = () => { try { localStorage.setItem(OFF_KEY, "1"); } catch (e) {} stop(); };
    document.body.appendChild(chip);
    addEventListener("resize", size);
    current = { stop() { if (ended) return; ended = true; cancelAnimationFrame(raf); sfx.stop(); moved.stop(); removeEventListener("resize", size); cv.remove(); chip.remove(); layers.forEach(l => { l.style.opacity = 0; if (l === puddle) l.style.height = "0"; setTimeout(() => l.remove(), 900); }); } };
    raf = requestAnimationFrame(frame);
    return true;
  }
  function stop() { if (current) { current.stop(); current = null; } }

  // The page moves: a breeze sways it, a gale shakes it, a hurricane lifts things up, spins them round the 🌀 and puts them back.
  function movePage(r, dur) {
    const anims = [];
    const ani = (el, kf, o) => { try { const a = el.animate(kf, o); anims.push(a); } catch (e) {} };
    if (reduce()) return { stop() {} };
    if (r.vortex) {
      const cx = innerWidth / 2, cy = innerHeight * .45;
      const pieces = [...document.querySelectorAll(".card, .item, .say1, h1, h2, img.pic, video, .chipb, .btn, button.round, .tag")]
        .filter(el => { const b = el.getBoundingClientRect(); return b.bottom > 0 && b.top < innerHeight && b.width > 10 && b.width < innerWidth * .9 && !el.closest(".wx-chip"); }).slice(0, 36);
      pieces.forEach((el, i) => {
        const b = el.getBoundingClientRect(), ex = b.left + b.width / 2, ey = b.top + b.height / 2, a0 = Math.atan2(ey - cy, ex - cx);
        const kf = [{ transform: "none", offset: 0 }];
        for (let k = 1; k <= 8; k++) { const ang = a0 + k * .9, rad = 140 + (i % 5) * 30; kf.push({ transform: `translate(${cx + Math.cos(ang) * rad - ex}px, ${cy + Math.sin(ang) * rad * .6 - ey}px) rotate(${k * 45 * (i % 2 ? 1 : -1)}deg) scale(${.6 + (i % 3) * .1})`, offset: .12 + k * .085 }); }
        kf.push({ transform: "none", offset: 1 });
        ani(el, kf, { duration: dur * .95, delay: i * 25, easing: "ease-in-out" });
      });
      document.querySelectorAll("body > .wrap").forEach(w => ani(w, [{ transform: "none" }, { transform: "rotate(-1.5deg) translateX(-8px)" }, { transform: "rotate(1.5deg) translateX(8px)" }, { transform: "none" }], { duration: 700, iterations: Math.floor(dur / 700) }));
    } else if (r.wind) {
      const amp = r.wind;
      document.querySelectorAll("body > .wrap").forEach(w => ani(w, [{ transform: "none" }, { transform: `skewX(${-amp * .5}deg) translateX(${amp * 3}px)` }, { transform: "none" }], { duration: Math.max(500, 1600 - amp * 220), iterations: Infinity, easing: "ease-in-out" }));
      if (amp >= 2) document.querySelectorAll(".card, .item, img.pic, .tag").forEach((el, i) => { if (i < 40) ani(el, [{ transform: "none" }, { transform: `rotate(${(i % 2 ? 1 : -1) * amp * .7}deg) translateX(${amp * 2}px)` }, { transform: "none" }], { duration: 900 - amp * 80, iterations: Infinity, delay: i * 40 }); });
    } else if (r.flash) {
      document.querySelectorAll("body > .wrap").forEach(w => ani(w, [{ transform: "none" }, { transform: "translate(3px,-2px)" }, { transform: "translate(-3px,2px)" }, { transform: "none" }], { duration: 120, iterations: 6, delay: 800 }));
    }
    return { stop() { anims.forEach(a => { try { a.cancel(); } catch (e) {} }); } };
  }

  // 👀 on the fly: watch the page for weather words
  const done = new Set(); let lastAuto = 0;
  const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, w = el.dataset.wxWord; io.unobserve(el);
    if (!w || done.has(w.toLowerCase()) || isOff() || reduce() || current || Date.now() - lastAuto < 12000) return;
    done.add(w.toLowerCase()); lastAuto = Date.now();
    setTimeout(() => { if (el.isConnected) play(w); }, 700);
  }), { threshold: 1 }) : null;
  function scan() {
    document.querySelectorAll(".syl[aria-label], .term, [data-wx]").forEach(el => {
      if (el.dataset.wxDone || el.closest(".wx-off")) return;
      el.dataset.wxDone = "1";
      const w = String(el.dataset.wx || el.getAttribute("aria-label") || el.textContent || "").trim(), r = recipe(w);
      if (!r) return;
      el.dataset.wxWord = w;
      const btn = document.createElement("button");
      btn.type = "button"; btn.className = "wx-btn"; btn.textContent = r.e;
      btn.title = `Make it ${r.name.toLowerCase()} on the page!`; btn.setAttribute("aria-label", `Show ${r.name} on the whole page`);
      btn.addEventListener("click", ev => { ev.preventDefault(); ev.stopPropagation(); ac(); try { localStorage.removeItem(OFF_KEY); } catch (e) {} play(w, { force: 1 }); });
      (el.nextElementSibling && el.nextElementSibling.classList.contains("egg-btn") ? el.nextElementSibling : el).insertAdjacentElement("afterend", btn);
      if (io) io.observe(el);
    });
  }
  const mo = new MutationObserver(ms => { if (ms.some(m => [...m.addedNodes].some(n => n.nodeType === 1 && !/wx-|egg-/.test(n.className || "")))) scan(); });
  const start = () => { scan(); mo.observe(document.body, { childList: true, subtree: true }); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
  addEventListener("keydown", e => { if (e.key === "Escape") stop(); });
  window.Weather = { play, stop, recipe, R };
})();
