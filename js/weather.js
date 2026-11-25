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
  // the wet family is NOT rain: water on the glass, then water in the page itself
  add("moist,humid,humidity,muggy,dewy,clammy,steamy", { e: "💧", name: "Moist", glass: 0.6, beads: 70 });
  add("damp,dank", { e: "💧", name: "Damp", glass: 0.45, beads: 45, trickles: 5 });
  add("wet,watery,splashed", { e: "💦", name: "Wet", glass: 0.2, beads: 60, trickles: 22 });
  add("soaked,drenched,sopping,soggy,waterlogged,saturated", { e: "👕", name: "Soaked", beads: 20, trickles: 8, drip: 1, wring: 1, puddle: 1 });
  add("drizzle,drizzling", { e: "🌦️", name: "Drizzle", rain: 1 });
  add("shower,showers", { e: "🌦️", name: "Shower", rain: 2 });
  add("rain,rainy,raining", { e: "🌧️", name: "Rain", rain: 3 });
  add("downpour,deluge,torrential,pouring", { e: "🌊", name: "Downpour", rain: 5, puddle: 1 });
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
  // 🔦 light you can play with: the page goes dark and the light follows your finger or mouse
  add("beam,flashlight,torch,torchlight,spotlight,searchlight,headlight,headlights", { e: "🔦", name: "Torch", torch: { r: 110, c: "255,250,225" }, long: 1 });
  add("candle,candlelight,lantern,lamplight,glow,glowing", { e: "🕯️", name: "Candle", torch: { r: 120, c: "255,190,110", flicker: 1 }, long: 1 });
  add("laser,laser beam,laser pointer", { e: "🔴", name: "Laser", laser: 1, long: 1, night: .3 });
  // ☀️ beams pouring in through a window
  add("sunbeam,sunbeams,ray,rays,sunray,sunrays,shaft of light", { e: "🌤️", name: "Sunbeam", beams: { c: "255,235,170", from: .12 }, night: .72 });
  add("moonbeam,moonbeams,moonlight,moonlit", { e: "🌙", name: "Moonbeam", beams: { c: "190,210,255", from: .82 }, night: .8, stars: 1 });
  add("bright", { e: "🔆", name: "Bright", bright: 1 });
  add("dazzling,blinding,glaring", { e: "✨", name: "Dazzling", bright: 2 });
  add("rainbow", { e: "🌈", name: "Rainbow", rain: 1, rainbow: 1 });
  add("raining cats and dogs", { e: "🐈", name: "Raining cats and dogs", rain: 3, drops: ["🐈", "🐕"], dropN: 2 });
  add("every cloud has a silver lining", { e: "🌥️", name: "Silver lining", fog: 0.5, sun: 1 });
  // sayings about light get the light that fits them (set directly: they contain commas)
  const SAY = { "it is better to light one small candle than to curse the darkness": "candle",
    "when you're driving through the darkness, you can only see as far as the headlights shine, but you can make the whole trip that way": "headlights",
    "don't be afraid of a shadow. it just means there's a light nearby": "sunbeam",
    "if you look for the light, you will often find it. but if you look for the dark, it is all you will ever see": "sunbeam" };
  Object.keys(SAY).forEach(k => R[k] = R[SAY[k]]);
  const recipe = w => R[String(w || "").trim().toLowerCase().replace(/[’]/g, "'").replace(/[.!?]$/, "")] || null;

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
    if (r.glass && !r.trickles) s.push(noise(dur, 0.02, "lowpass", 400, 300, 1));
    if (r.trickles || r.drip) for (let i = 0; i < (r.drip ? 14 : 6); i++) plink(0.5 + Math.random() * (dur - 1));
    if (r.wring) [1.2, 2.4, 3.6].forEach(t => noise(0.5, 0.12, "band", 700, 300, 2, t));
    return { stop: () => s.forEach(x => x && x.stop()) };
  }
  function plink(t0) { const a = ac(); if (!a || a.state !== "running") return; const o = a.createOscillator(), g = a.createGain(), n = a.currentTime + t0, f = 900 + Math.random() * 700; o.type = "sine"; o.frequency.setValueAtTime(f, n); o.frequency.exponentialRampToValueAtTime(f * 2.2, n + .06); g.gain.setValueAtTime(.0001, n); g.gain.exponentialRampToValueAtTime(.06, n + .01); g.gain.exponentialRampToValueAtTime(.0001, n + .18); o.connect(g); g.connect(a.destination); o.start(n); o.stop(n + .2); }
  function thunder(t0) { noise(2.4, 0.5, "lowpass", 120, 60, 1, t0); }

  // 🎨 the stage: a full-screen canvas above the page that ignores clicks
  const css = document.createElement("style");
  css.textContent = `.wx-stage{position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:9990;pointer-events:none}
.wx-layer{position:fixed;inset:0;z-index:9989;pointer-events:none;transition:opacity .8s}
.wx-chip{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:9995;display:flex;gap:6px;align-items:center;background:#fff;border-radius:999px;padding:6px 8px 6px 12px;box-shadow:0 4px 18px #0003;font:700 14px var(--f-display,system-ui);color:#333}
.wx-chip,.wx-chip *{cursor:auto;white-space:nowrap}.wx-chip{flex-wrap:wrap;justify-content:center;max-width:96vw}.wx-chip.top{bottom:auto;top:12px}.wx-chip button{cursor:pointer;border:0;border-radius:999px;padding:4px 10px;font:inherit;cursor:pointer;background:#F1F1F4}
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
    const dur = (opts && opts.dur) || (r.long ? (r.torch && !r.torch.flicker ? 25000 : 14000) : r.vortex ? 6500 : 6000), t0 = performance.now();
    const cv = document.createElement("canvas"); cv.className = "wx-stage"; cv.setAttribute("aria-hidden", "true");
    const ctx = cv.getContext("2d"); document.body.appendChild(cv);
    const W = () => innerWidth, H = () => innerHeight, dpr = Math.min(2, devicePixelRatio || 1);
    const size = () => { cv.width = W() * dpr; cv.height = H() * dpr; cv.style.width = W() + "px"; cv.style.height = H() + "px"; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }; size();
    const layers = [];
    const layer = (bg, op) => { const d = document.createElement("div"); d.className = "wx-layer"; d.style.background = bg; d.style.opacity = 0; document.body.appendChild(d); layers.push(d); requestAnimationFrame(() => d.style.opacity = op); return d; };
    if (r.night) layer("radial-gradient(ellipse at 50% 30%, rgba(10,15,40," + (r.night * .7) + "), rgba(5,8,25," + r.night + "))", 1);
    if (r.tint) layer(r.tint, 1);
    if (r.snow) layer("linear-gradient(rgba(150,175,215,.35), rgba(200,215,235,.2))", 1);
    if (r.sun) layer(`radial-gradient(circle at 88% 8%, rgba(255,230,120,${.55 * r.sun}) 0, rgba(255,200,80,${.25 * r.sun}) 18%, transparent 45%)`, 1);
    if (r.heat) layer("rgba(255,120,40,.12)", 1);
    if (r.bright) layer(`radial-gradient(circle at 50% 40%, rgba(255,255,255,${.5 * r.bright}), rgba(255,250,220,${.25 * r.bright}))`, 1);
    if (r.glass) { const g = layer(`rgba(236,242,248,${.35 * r.glass})`, 1); g.style.transition = "opacity 2.5s"; g.style.backdropFilter = g.style.webkitBackdropFilter = `blur(${(r.glass * 5).toFixed(1)}px)`; }
    // 👆 where the finger or mouse is (the torch and laser follow it; until it moves, they sweep by themselves)
    const ptr = { x: W() / 2, y: H() / 2, moved: 0 };
    const onMove = e => { if (e.target && e.target.closest && e.target.closest(".wx-chip")) return; const q = e.touches ? e.touches[0] : e; if (!q) return; ptr.x = q.clientX; ptr.y = q.clientY; ptr.moved = performance.now(); };
    if (r.torch || r.laser) { addEventListener("pointermove", onMove, { passive: true }); addEventListener("touchmove", onMove, { passive: true }); addEventListener("pointerdown", onMove, { passive: true }); }
    const dark = r.torch ? layer("rgba(3,5,18,.94)", 1) : null;
    // 🔦 the torch only moves when you move it: it leans a little left; tilt it with ⬅️ ➡️, make the beam longer or shorter with ⬆️ ⬇️ or the mouse wheel
    const beam = { len: Math.min(370, Math.max(W(), H()) * .55), tilt: -.45 }; // the default Ab picked: leaning left, a long beam
    const lenBy = d => { beam.len = Math.max(70, Math.min(Math.max(W(), H()) * .8, beam.len + d)); ptr.moved = ptr.moved || performance.now(); };
    const tiltBy = d => { beam.tilt = Math.max(-1.4, Math.min(1.4, beam.tilt + d)); ptr.moved = ptr.moved || performance.now(); };
    const onKey = e => { if (!r.torch || r.torch.flicker) return; const k = { ArrowUp: () => lenBy(30), ArrowDown: () => lenBy(-30), ArrowLeft: () => tiltBy(-.15), ArrowRight: () => tiltBy(.15) }[e.key]; if (k) { e.preventDefault(); k(); } };
    const onWheel = e => { if (!r.torch || r.torch.flicker) return; e.preventDefault(); lenBy(-e.deltaY * .4); };
    if (r.torch && !r.torch.flicker) { addEventListener("keydown", onKey); addEventListener("wheel", onWheel, { passive: false }); }
    const oldCur = document.documentElement.style.cursor; if (r.torch || r.laser) document.documentElement.style.cursor = "none";
    const cat = { x: -60, y: H() * .8, f: 1 };
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
    // 💧 beads on the glass: they appear, grow, and some get heavy and run down, leaving a trail
    const beads = Array.from({ length: r.beads || 0 }, (_, i) => ({ x: rnd(0, W()), y: rnd(0, H()), r: 0, max: rnd(3, i < (r.trickles || 0) ? 12 : 7), born: rnd(0, dur * .5), run: i < (r.trickles || 0), vy: 0, trail: [] }));
    // 👕 soaked: water drips off the bottom edge of the cards on screen
    const edges = r.drip ? [...document.querySelectorAll(".card, .item, .panel, .say1, img.pic, .btn, h1, h2")].map(el => el.getBoundingClientRect()).filter(b => b.bottom > 0 && b.bottom < innerHeight && b.width > 30).slice(0, 30) : [];
    const dripping = [];
    const motes = r.beams ? Array.from({ length: 80 }, () => ({ x: rnd(0, W()), y: rnd(0, H()), r: rnd(.6, 2.2), vy: rnd(.05, .3), ph: rnd(0, 6) })) : [];
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
      if (r.torch || r.laser) { if (!ptr.moved) { ptr.x = W() / 2 + Math.sin(t / 900) * W() * .32; ptr.y = H() * .45 + Math.sin(t / 650) * H() * .22; } }
      if (dark) { const T = r.torch, fl = T.flicker ? 1 + Math.sin(t / 60) * .04 + Math.sin(t / 23) * .03 : 1, R0 = T.r * fl, a = Math.max(.15, fade);
        // the mouse IS the torch: the light lands ahead of it, aimed toward the middle of the page (straight up when it is already in the middle)
        const ang = -Math.PI / 2 + beam.tilt;
        const reach = T.flicker ? 0 : beam.len, sx = ptr.x + Math.cos(ang) * reach, sy = ptr.y + Math.sin(ang) * reach, x = sx.toFixed(0), y = sy.toFixed(0);
        dark.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(${T.c},${.07 * a}) 0, rgba(${T.c},${.03 * a}) ${R0 * .6}px, rgba(3,5,18,${.55 * a}) ${R0}px, rgba(3,5,18,${.94 * a}) ${R0 * 1.6}px)`;
        if (!T.flicker) { // a torch held at the bottom of the screen, always pointing at the light, with its cone of light
          const d = reach; ctx.save(); ctx.translate(ptr.x, ptr.y); ctx.rotate(ang); ctx.translate(-16, 0);
          const cg = ctx.createLinearGradient(16, 0, d, 0); cg.addColorStop(0, `rgba(${T.c},${.38 * a})`); cg.addColorStop(1, `rgba(${T.c},${.08 * a})`);
          ctx.fillStyle = cg; ctx.beginPath(); ctx.moveTo(16, -13); ctx.lineTo(d, -R0 * .85); ctx.lineTo(d, R0 * .85); ctx.lineTo(16, 13); ctx.closePath(); ctx.fill();
          const bg = ctx.createLinearGradient(0, -11, 0, 11); bg.addColorStop(0, "#6b7280"); bg.addColorStop(.35, "#d1d5db"); bg.addColorStop(1, "#1f2937");
          ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(-78, -10, 72, 20, 6) : ctx.rect(-78, -10, 72, 20); ctx.fill();
          ctx.fillStyle = "#111827"; ctx.fillRect(-50, -12, 12, 4);
          const hg = ctx.createLinearGradient(0, -16, 0, 16); hg.addColorStop(0, "#9ca3af"); hg.addColorStop(.4, "#f3f4f6"); hg.addColorStop(1, "#374151");
          ctx.fillStyle = hg; ctx.beginPath(); ctx.moveTo(-8, -11); ctx.lineTo(14, -16); ctx.lineTo(14, 16); ctx.lineTo(-8, 11); ctx.closePath(); ctx.fill();
          ctx.fillStyle = `rgba(${T.c},1)`; ctx.shadowColor = `rgba(${T.c},1)`; ctx.shadowBlur = 18; ctx.beginPath(); ctx.ellipse(15, 0, 3.5, 15, 0, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
          ctx.restore(); }
        else { ctx.font = "34px system-ui"; ctx.textAlign = "center"; ctx.fillText("🕯️", ptr.x, ptr.y + 12); ctx.textAlign = "start"; } }
      if (r.laser) { const tx = ptr.x + (cat.x < ptr.x ? -46 : 46), dx = tx - cat.x, dy = ptr.y + 10 - cat.y; cat.x += dx * .045; cat.y += dy * .045; if (Math.abs(dx) > 4) cat.f = dx > 0 ? -1 : 1; const near = Math.hypot(dx, dy) < 50;
        ctx.save(); ctx.translate(cat.x, cat.y + (near ? Math.sin(t / 60) * 6 : 0)); ctx.scale(cat.f, 1); ctx.font = "52px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(near ? "😼" : "🐈", 0, 0); ctx.restore();
        const g = ctx.createRadialGradient(ptr.x, ptr.y, 0, ptr.x, ptr.y, 20); g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(.25, "rgba(255,30,30,1)"); g.addColorStop(1, "rgba(255,0,0,0)"); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(ptr.x, ptr.y, 20, 0, 7); ctx.fill(); }
      if (r.beams) { const B = r.beams, ox = W() * B.from, sway = Math.sin(t / 1400) * .05;
        ctx.save(); ctx.globalCompositeOperation = "lighter";
        for (let k = 0; k < 5; k++) { const ang = (B.from < .5 ? .55 : Math.PI - .55 - .45) + k * .11 + sway, len = Math.hypot(W(), H()) * 1.1, wd = .035 + (k % 2) * .02;
          const g = ctx.createLinearGradient(ox, 0, ox + Math.cos(ang) * len, Math.sin(ang) * len); g.addColorStop(0, `rgba(${B.c},${.42 * fade})`); g.addColorStop(.7, `rgba(${B.c},${.1 * fade})`); g.addColorStop(1, `rgba(${B.c},0)`);
          ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(ox, -10); ctx.lineTo(ox + Math.cos(ang - wd) * len, -10 + Math.sin(ang - wd) * len); ctx.lineTo(ox + Math.cos(ang + wd) * len, -10 + Math.sin(ang + wd) * len); ctx.closePath(); ctx.fill(); }
        motes.forEach(m => { m.x += Math.sin(t / 900 + m.ph) * .25; m.y += m.vy; if (m.y > H()) m.y = -5; const tw = .45 + .55 * Math.sin(t / 250 + m.ph); ctx.fillStyle = `rgba(${B.c},${tw * .9 * fade})`; ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, 7); ctx.fill(); });
        ctx.restore(); ctx.font = "54px system-ui"; ctx.fillText("🪟", ox - 27, 44); }
      if (beads.length) beads.forEach(b => { if (t < b.born) return; if (b.r < b.max) b.r += .08; 
          if (b.run && b.r >= b.max) { b.vy = Math.min(b.vy + .04, 2.4); b.x += Math.sin(t / 180 + b.max) * .3; b.y += b.vy; b.trail.push([b.x, b.y]); if (b.trail.length > 90) b.trail.shift(); if (b.y > H() + 10) { b.y = rnd(-20, H() * .3); b.x = rnd(0, W()); b.r = 0; b.vy = 0; b.trail = []; b.born = t; } }
          if (b.trail.length > 1) { ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = b.r * .7; ctx.beginPath(); b.trail.forEach(([x, y], k) => k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); }
          const g = ctx.createRadialGradient(b.x - b.r * .35, b.y - b.r * .35, b.r * .1, b.x, b.y, b.r); g.addColorStop(0, "rgba(255,255,255,.95)"); g.addColorStop(.45, "rgba(200,225,245,.35)"); g.addColorStop(1, "rgba(70,110,160,.55)");
          ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(b.x, b.y, b.r * .9, b.r * (b.run && b.vy > 0 ? 1.25 : 1), 0, 0, 7); ctx.fill(); });
      if (edges.length || dripping.length) { if (edges.length && dripping.length < 70 && Math.random() < .5) { const e = edges[Math.floor(rnd(0, edges.length))]; dripping.push({ x: rnd(e.left + 6, e.right - 6), y: e.bottom, r: 0, vy: 0 }); }
        for (let k = dripping.length - 1; k >= 0; k--) { const d = dripping[k]; if (d.r < 4) d.r += .12; else { d.vy += .35; d.y += d.vy; }
          if (d.y > floor) { splash(d); dripping.splice(k, 1); continue; }
          ctx.fillStyle = "rgba(80,140,210,.75)"; ctx.beginPath(); ctx.moveTo(d.x, d.y - d.r * 1.8 - Math.min(d.vy, 6)); ctx.quadraticCurveTo(d.x + d.r, d.y, d.x, d.y + d.r); ctx.quadraticCurveTo(d.x - d.r, d.y, d.x, d.y - d.r * 1.8 - Math.min(d.vy, 6)); ctx.fill(); } }
      if (r.wring) { const cx = W() / 2, cy = H() * .38, s = Math.min(W(), H()) * .22, tw = Math.sin(t / 380); ctx.save(); ctx.translate(cx, cy); ctx.scale(1 - Math.abs(tw) * .35, 1 + Math.abs(tw) * .12); ctx.rotate(tw * .25); ctx.font = s + "px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("👕", 0, 0); ctx.restore();
        ctx.font = s * .35 + "px system-ui"; ctx.textAlign = "center"; ctx.fillText("🫳", cx - s * .55, cy - s * .1); ctx.fillText("🫴", cx + s * .55, cy + s * .1); ctx.textAlign = "start";
        if (Math.abs(tw) > .6 && Math.random() < .7) dripping.push({ x: cx + rnd(-s * .25, s * .25), y: cy + s * .4, r: 4, vy: rnd(1, 3) }); }
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
    if (r.torch && !r.torch.flicker) { const c = document.createElement("span"); c.style.display = "flex"; c.style.gap = "4px";
      [["↺", "Tilt left", () => tiltBy(-.2)], ["➖", "Shorter beam", () => lenBy(-40)], ["➕", "Longer beam", () => lenBy(40)], ["↻", "Tilt right", () => tiltBy(.2)]].forEach(([t, l, f]) => { const b = document.createElement("button"); b.type = "button"; b.textContent = t; b.title = l; b.setAttribute("aria-label", l); b.onpointerdown = e => { e.stopPropagation(); f(); }; c.appendChild(b); });
      chip.insertBefore(c, chip.querySelector("[data-x]")); }
    if (r.torch || r.laser) chip.classList.add("top");
    chip.querySelector("[data-x]").onclick = () => stop();
    chip.querySelector("[data-off]").onclick = () => { try { localStorage.setItem(OFF_KEY, "1"); } catch (e) {} stop(); };
    document.body.appendChild(chip);
    addEventListener("resize", size);
    current = { stop() { if (ended) return; ended = true; cancelAnimationFrame(raf); sfx.stop(); moved.stop(); removeEventListener("resize", size); if (r.torch || r.laser) document.documentElement.style.cursor = oldCur; removeEventListener("pointermove", onMove); removeEventListener("keydown", onKey); removeEventListener("wheel", onWheel); removeEventListener("touchmove", onMove); removeEventListener("pointerdown", onMove); cv.remove(); chip.remove(); layers.forEach(l => { l.style.opacity = 0; if (l === puddle) l.style.height = "0"; setTimeout(() => l.remove(), 900); }); } };
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
