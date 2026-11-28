/* 🧩 More word effects, played by weather.js (Weather.add). Each one gets a canvas over the page (A.ctx) and returns
   { frame(t, life, fade), down(x, y), move(x, y), up(x, y), stop() }. Pointer-driven ones block page clicks while they run. */
(function () {
  "use strict";
  if (!window.Weather || !Weather.add) return;
  const em = (ctx, e, x, y, size, rot, sx) => { ctx.save(); ctx.translate(x, y); if (rot) ctx.rotate(rot); if (sx) ctx.scale(sx, 1); ctx.font = size + "px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = "#000"; ctx.fillText(e, 0, 0); ctx.restore(); };
  const bubble = (ctx, text, x, y, size) => { ctx.save(); ctx.font = `800 ${size}px system-ui`; const w = ctx.measureText(text).width + size * 1.2, h = size * 1.7; ctx.fillStyle = "#fff"; ctx.strokeStyle = "#1f2937"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x - w / 2, y - h / 2, w, h, h / 2) : ctx.rect(x - w / 2, y - h / 2, w, h); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - 8, y + h / 2 - 1); ctx.lineTo(x, y + h / 2 + 12); ctx.lineTo(x + 8, y + h / 2 - 1); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#1f2937"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(text, x, y + 1); ctx.restore(); };
  const big = (ctx, text, x, y, size, color) => { ctx.save(); ctx.font = `900 ${size}px system-ui`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.lineWidth = size / 7; ctx.strokeStyle = "#fff"; ctx.strokeText(text, x, y); ctx.fillStyle = color || "#1f2937"; ctx.fillText(text, x, y); ctx.restore(); };
  const shakeKids = (A, at, amp, ms) => A.kids().forEach(el => A.ani(el, [{ transform: "none" }, { transform: `translate(${-amp}px,${amp * .7}px)` }, { transform: `translate(${amp}px,${-amp * .6}px)` }, { transform: `translate(${-amp * .6}px,${amp * .4}px)` }, { transform: "none" }], { duration: ms || 320, delay: at }));
  const confetti = (list, x, y, n) => { for (let k = 0; k < n; k++) list.push({ x, y, vx: (Math.random() - .5) * 10, vy: -Math.random() * 9 - 2, c: ["#f43f5e", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7", "#fde047"][k % 6], a: 1 }); };
  // 🧒 a full-body cartoon footballer: x,y = between the feet, S = height, dir 1 = facing right, ph = walk phase, kick 0..1 lifts the front leg
  const footballer = (ctx, x, y, S, dir, ph, kick, mud, kitA, kitB, skinC) => { ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1); ctx.lineCap = "round"; ctx.lineJoin = "round";
    const O = "#1f2937", skin = skinC || "#e8b48a", kit = kitA || "#2563eb", kit2 = kitB || "#1e3a8a", hipY = -S * .46, th = S * .22, sh = S * .22, sw = Math.sin(ph) * .5;
    const stroke2 = (w, c, pts) => { [[w + S * .03, O], [w, c]].forEach(([lw, col]) => { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath(); pts.forEach(([px, py], i) => i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)); ctx.stroke(); }); };
    const leg = (a, bend, front) => { const kx = Math.sin(a) * th, ky = hipY + Math.cos(a) * th, fa = a - bend, fx = kx + Math.sin(fa) * sh, fy = ky + Math.cos(fa) * sh;
      stroke2(S * .075, skin, [[0, hipY], [kx, ky]]); stroke2(S * .07, kit2, [[kx, ky], [fx, fy]]);
      ctx.fillStyle = mud ? "#5b3a1e" : "#111827"; ctx.strokeStyle = O; ctx.lineWidth = S * .015; ctx.beginPath(); ctx.ellipse(fx + S * .045, fy + S * .015, S * .085, S * .045, fa * .2, 0, 7); ctx.fill(); ctx.stroke();
      if (mud) { ctx.fillStyle = "#6b4423"; ctx.beginPath(); ctx.arc(fx - S * .01, fy - S * .06, S * .03, 0, 7); ctx.arc(kx + S * .02, ky + S * .04, S * .022, 0, 7); ctx.fill(); } };
    const back = -sw, frontA = kick ? -1.1 * kick + sw * (1 - kick) : sw;
    leg(back, Math.max(0, -back) * .9 + .15, 0);
    const arm = (a, front) => { const ex = Math.sin(a) * S * .16, ey = -S * .76 + Math.cos(a) * S * .17; stroke2(S * .07, front ? kit : kit2, [[0, -S * .78], [ex * .6, ey - S * .03]]); stroke2(S * .06, skin, [[ex * .6, ey - S * .03], [ex, ey + S * .12]]); };
    arm(-sw * .9, 0);
    ctx.fillStyle = kit2; ctx.strokeStyle = O; ctx.lineWidth = S * .015; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(-S * .14, hipY - S * .08, S * .28, S * .15, S * .03) : ctx.rect(-S * .14, hipY - S * .08, S * .28, S * .15); ctx.fill(); ctx.stroke();
    leg(frontA, kick ? .2 : Math.max(0, -frontA) * .9 + .15, 1);
    ctx.fillStyle = kit; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(-S * .15, -S * .86, S * .3, S * .36, S * .08) : ctx.rect(-S * .15, -S * .86, S * .3, S * .36); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#fff"; ctx.fillRect(-S * .15, -S * .69, S * .3, S * .03);
    arm(sw * .9, 1);
    ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(S * .01, -S * .99, S * .14, 0, 7); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#3b2a1a"; ctx.beginPath(); ctx.arc(S * .0, -S * 1.03, S * .145, Math.PI * 1.0, Math.PI * 2.05); ctx.lineTo(S * .14, -S * 1.0); ctx.fill();
    ctx.fillStyle = O; ctx.beginPath(); ctx.arc(S * .08, -S * .99, S * .018, 0, 7); ctx.fill(); ctx.lineWidth = S * .014; ctx.beginPath(); ctx.arc(S * .07, -S * .94, S * .04, .3, 1.5); ctx.stroke();
    if (mud) { ctx.fillStyle = "rgba(107,68,35,.92)"; [[-.08, -.74, .035], [.07, -.6, .03], [-.04, -.44, .03], [.1, -.4, .025], [.06, -1.06, .022], [-.11, -.98, .02]].forEach(([a2, b2, r2]) => { ctx.beginPath(); ctx.arc(a2 * S, b2 * S, r2 * S, 0, 7); ctx.fill(); }); }
    ctx.restore(); };
  const drawBits = (ctx, list) => { for (let i = list.length - 1; i >= 0; i--) { const p = list[i]; p.x += p.vx; p.y += p.vy; p.vy += .3; p.a -= .014; if (p.a <= 0) { list.splice(i, 1); continue; } ctx.globalAlpha = p.a; ctx.fillStyle = p.c; ctx.fillRect(p.x, p.y, 7, 4); } ctx.globalAlpha = 1; };

  // 🏇 WHIPPED: a horse race! 3-2-1-GO, tap (or Space) to crack the whip; every crack is a burst of speed, but cracks are limited
  Weather.add("whip,whips,whipped,whipping,lash,lashed,horse race,horse racing,gallop,galloped,galloping,jockey", { e: "🏇", name: "Horse race", dur: 60000, track: 1, capture: 1, top: 1 }, A => {
    const MAXW = 30; let R = null, ended = 0;
    const start = t => { R = { t0: t, go: t + 3000, horses: [0, 1, 2, 3].map(i => ({ me: i === 2, x: 0, v: 0, boost: 0, lane: i, bob: Math.random() * 6, done: 0, place: 0, crack: -9999, base: i === 2 ? .052 : .072 + Math.random() * .012, surge: 0 })), whips: MAXW, finished: 0, result: "", resAt: 0 }; A.setChip(`🪢 × ${MAXW}`); };
    const whip = () => { if (!R || R.result) { if (R && R.result && performance.now() - R.resAt > 800) start(R.now); return; } const t = R.now; if (t < R.go || R.whips <= 0) return; const me = R.horses[2]; if (me.done) return;
      R.whips--; me.boost = Math.min(me.boost + .055, .16); me.crack = t; A.noise(.08, .5, "band", 4200, 2400, 3); A.setChip(R.whips ? `🪢 × ${R.whips}` : "no whips left!"); };
    const onKey = e => { if (e.code === "Space" || e.key === " " || e.key === "Enter") { e.preventDefault(); whip(); } }; addEventListener("keydown", onKey);
    let lastHoof = 0;
    return { stop() { removeEventListener("keydown", onKey); }, down() { whip(); },
      frame(t, life) { const { ctx } = A, W = A.W(), H = A.H(); if (!R) start(t); R.now = t; const dt = Math.min(50, t - (R.last || t)); R.last = t;
        const top = H * .2, laneH = Math.min(90, H * .17), x0 = 50, fin = W - 70, len = fin - x0;
        // the track
        ctx.fillStyle = "rgba(34,120,50,.9)"; ctx.fillRect(0, top - 40, W, laneH * 4 + 80); ctx.fillStyle = "#b07a46"; ctx.fillRect(0, top, W, laneH * 4);
        ctx.strokeStyle = "rgba(255,255,255,.8)"; ctx.lineWidth = 2; for (let i = 0; i <= 4; i++) { ctx.beginPath(); ctx.moveTo(0, top + i * laneH); ctx.lineTo(W, top + i * laneH); ctx.stroke(); }
        const sq = laneH / 6; for (let r = 0; r < 24; r++) for (let c = 0; c < 2; c++) { ctx.fillStyle = (r + c) % 2 ? "#111" : "#fff"; ctx.fillRect(fin + c * sq, top + r * sq, sq, sq); }
        ctx.fillStyle = "rgba(255,255,255,.9)"; ctx.fillRect(x0 - 3, top, 3, laneH * 4);
        // crowd
        for (let k = 0; k < Math.ceil(W / 34); k++) { const e = ["🙋", "🧑", "👧", "👦", "🙆", "👩"][k % 6]; em(ctx, e, 17 + k * 34, top - 22 + (R.result ? Math.abs(Math.sin(t / 120 + k)) * -8 : 0), 22); }
        const racing = t >= R.go && !R.result;
        R.horses.forEach(h => { if (racing && !h.done) {
            if (!h.me) { if (Math.random() < .01) h.surge = .025 + Math.random() * .02; h.surge *= .985; }
            h.boost *= Math.pow(.9985, dt); const sp = (h.base + h.boost + h.surge) * len / 1000; h.x = Math.min(len, h.x + sp * dt);
            if (h.x >= len) { h.done = 1; h.place = ++R.finished; if (h.me) { R.result = h.place === 1 ? "win" : "lose"; R.resAt = performance.now(); if (h.place === 1) { [0, .2, .4, .6].forEach(d => A.chirp(d)); A.noise(1.6, .25, "band", 900, 1600, 1); } else A.noise(.6, .12, "lowpass", 400, 200, 1); A.setChip(h.place === 1 ? "🥇 you won!" : "tap to race again"); } } }
          const y = top + h.lane * laneH + laneH * .55, x = x0 + h.x, gal = racing && !h.done ? Math.abs(Math.sin(t / 70 + h.bob)) * 7 : 0, S = laneH * .85;
          if (h.me) { ctx.fillStyle = "rgba(250,204,21,.25)"; ctx.fillRect(0, top + h.lane * laneH, W, laneH); big(ctx, "YOU", Math.max(30, x - S * .9), y - S * .45, 15, "#a16207"); }
          if (racing && !h.done && Math.random() < .4) { ctx.fillStyle = "rgba(160,120,80,.5)"; ctx.beginPath(); ctx.arc(x - S * .5 - Math.random() * 20, y + S * .3, 4 + Math.random() * 6, 0, 7); ctx.fill(); }
          em(ctx, "🏇", x, y - gal, S, 0, -1);
          if (h.me && t - h.crack < 260) { const k = (t - h.crack) / 260; ctx.strokeStyle = "#5b3a1e"; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x - S * .1, y - S * .35); ctx.quadraticCurveTo(x - S * .6, y - S * (1 - k * .6), x - S * (1.1 - k * .3), y - S * .1); ctx.stroke(); ctx.strokeStyle = "#fde047"; for (let s = 0; s < 6; s++) { const a = s; ctx.beginPath(); ctx.moveTo(x - S * .95 + Math.cos(a) * 6, y - S * .1 + Math.sin(a) * 6); ctx.lineTo(x - S * .95 + Math.cos(a) * 18, y - S * .1 + Math.sin(a) * 18); ctx.stroke(); } big(ctx, "CRACK!", x - S * .9, y - S * .75, 16, "#b91c1c"); }
          if (h.done && h.place) big(ctx, ["", "🥇", "🥈", "🥉", "4th"][h.place], x + S * .7, y - S * .2, 24, "#1f2937"); });
        // speed meter for my horse
        const me = R.horses[2], meter = Math.min(1, (me.base + me.boost) / (.052 + .16)); ctx.fillStyle = "rgba(255,255,255,.9)"; ctx.fillRect(20, top + laneH * 4 + 50, 220, 16); ctx.fillStyle = meter > .7 ? "#dc2626" : meter > .4 ? "#f59e0b" : "#22c55e"; ctx.fillRect(20, top + laneH * 4 + 50, 220 * meter, 16); ctx.font = "800 13px system-ui"; ctx.fillStyle = "#1f2937"; ctx.textAlign = "left"; ctx.fillText("🏇 SPEED", 250, top + laneH * 4 + 63);
        if (racing && t - lastHoof > 140) { lastHoof = t; A.noise(.05, .06, "lowpass", 300, 200, 1); }
        // countdown and help
        if (t < R.go) { const n = 3 - Math.floor((t - R.t0) / 1000); big(ctx, n > 0 ? String(n) : "GO!", W / 2, top + laneH * 2, 90, "#dc2626"); big(ctx, "Tap (or Space) to crack the whip 🪢 — faster taps, faster horse!", W / 2, top + laneH * 4 + 30 + 60, 16, "#1f2937"); }
        else if (t < R.go + 700) big(ctx, "GO!", W / 2, top + laneH * 2, 90, "#16a34a");
        if (R.result) { big(ctx, R.result === "win" ? "🥇 You won!" : "So close! Tap to race again", W / 2, top + laneH * 2, R.result === "win" ? 60 : 38, R.result === "win" ? "#15803d" : "#b45309"); if (R.result === "win") big(ctx, "Tap to race again", W / 2, top + laneH * 2 + 52, 20, "#1f2937"); } } };
  });

  // 🏀 TOSS: drag back and let go to throw; things fly, bounce off the walls and pile up
  Weather.add("toss,tossed,tossing,throw,throws,threw,thrown,throwing,fling,flung,hurl,hurled,lob,lobbed", { e: "🏀", name: "Toss", dur: 18000, track: 1, capture: 1, top: 1 }, A => {
    const things = [], ITEMS = ["🏀", "⚽", "🎾", "🍎", "🧸", "🪃", "🥏", "🎈"]; let grab = null, n = 0;
    const hand = () => ({ x: A.ptr.x, y: A.ptr.y });
    A.setChip("drag back and let go!");
    return { down(x, y) { grab = { x, y, e: ITEMS[n++ % ITEMS.length] }; },
      up(x, y) { if (!grab) return; const vx = (grab.x - x) * .18, vy = (grab.y - y) * .18; things.push({ e: grab.e, x, y, vx: vx || (Math.random() - .5) * 6, vy: vy || -10, r: 22, rot: 0, vr: vx * .02, b: 0 }); A.noise(.15, .2, "band", 900, 400, 1); grab = null; },
      frame(t) { const { ctx } = A, W = A.W(), H = A.H();
        things.forEach(o => { o.vy += .45; o.x += o.vx; o.y += o.vy; o.rot += o.vr; if (o.x < o.r) { o.x = o.r; o.vx *= -.7; } if (o.x > W - o.r) { o.x = W - o.r; o.vx *= -.7; } if (o.y < o.r) { o.y = o.r; o.vy *= -.6; }
          if (o.y > H - o.r) { o.y = H - o.r; if (Math.abs(o.vy) > 2) { A.plink(0); } o.vy *= -.55; o.vx *= .9; o.vr *= .9; } em(ctx, o.e, o.x, o.y, 44, o.rot); });
        if (grab) { const h = hand(); ctx.strokeStyle = "rgba(30,41,59,.6)"; ctx.setLineDash([6, 6]); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(grab.x, grab.y); ctx.lineTo(h.x, h.y); ctx.stroke(); ctx.setLineDash([]);
          // where it will go
          let px = h.x, py = h.y, vx = (grab.x - h.x) * .18, vy = (grab.y - h.y) * .18; ctx.fillStyle = "rgba(30,41,59,.35)"; for (let k = 0; k < 24; k++) { vy += .45; px += vx; py += vy; if (k % 2) { ctx.beginPath(); ctx.arc(px, py, 3, 0, 7); ctx.fill(); } }
          em(ctx, grab.e, h.x, h.y, 44); } else em(ctx, "✋", A.ptr.x, A.ptr.y, 40); } };
  });

  // 🦁 BEAST: a jeep is stuck on safari and big cats close in from both sides; tap each one to HONK and scare it off; hold out and the jeep escapes
  Weather.add("beast,beasts,beastly,monster,monsters,creature,creatures,wild animal,wild animals,ferocious,roar,roared,roaring,safari,predator,predators", { e: "🦁", name: "Safari", dur: 40000, track: 1, capture: 1, top: 1 }, A => {
    const cats = [], dust = []; let shooed = 0, rock = 0, lastSpawn = 0, escape = 0, carX = 0, roarAt = -9999, honkAt = -9999, END = 20000;
    A.setChip("tap the lions to honk! 📯"); A.noise(1.2, .35, "lowpass", 220, 90, 1, .4);
    const roar = () => { A.noise(1.1, .45, "lowpass", 240, 80, 1); };
    const honk = () => { A.noise(.16, .35, "band", 420, 440, 12); A.noise(.16, .35, "band", 340, 350, 12, .2); };
    return { down(x, y) { const S = Math.min(A.W(), A.H()) * .16; const c = cats.filter(c => !c.flee).sort((a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y))[0];
        honk(); honkAt = performance.now(); if (c && Math.hypot(c.x - x, c.y - y) < S * .9) { c.flee = 1; c.dir = c.x < A.W() / 2 ? -1 : 1; shooed++; A.setChip(`scared off ${shooed} 📯`); } },
      frame(t, life) { const { ctx } = A, W = A.W(), H = A.H(), S = Math.min(W, H) * .16, cy = H * .6, cx = W / 2 + carX;
        // the savanna
        const sky = ctx.createLinearGradient(0, 0, 0, H * .5); sky.addColorStop(0, "rgba(253,186,116,.95)"); sky.addColorStop(1, "rgba(254,240,138,.95)"); ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H * .5);
        ctx.fillStyle = "rgba(249,115,22,.9)"; ctx.beginPath(); ctx.arc(W * .8, H * .32, Math.min(W, H) * .1, 0, 7); ctx.fill();
        const gr = ctx.createLinearGradient(0, H * .45, 0, H); gr.addColorStop(0, "rgba(202,160,70,.97)"); gr.addColorStop(1, "rgba(161,118,40,.97)"); ctx.fillStyle = gr; ctx.fillRect(0, H * .45, W, H * .55);
        [[.12, .44, 1], [.35, .46, .7], [.9, .45, .9]].forEach(([fx, fy, k]) => em(ctx, "🌳", W * fx, H * fy - S * .4 * k, S * 1.3 * k));
        ctx.strokeStyle = "rgba(120,80,20,.5)"; ctx.lineWidth = 2; for (let g = 0; g < 40; g++) { const gx = (g * 97) % W, gy = H * .5 + (g * 53) % (H * .48); ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx - 3, gy - 9); ctx.moveTo(gx + 3, gy); ctx.lineTo(gx + 5, gy - 8); ctx.stroke(); }
        // big cats
        if (!escape && t < END && t - lastSpawn > Math.max(700, 1500 - t / 20)) { lastSpawn = t; const side = Math.random() < .5 ? -1 : 1; cats.push({ e: ["🦁", "🦁", "🐅", "🐆"][Math.floor(Math.random() * 4)], x: side < 0 ? -S : W + S, y: cy + (Math.random() - .3) * S * 1.6, side, v: .7 + Math.random() * .9 + t / 25000, flee: 0, near: 0 }); roar(); roarAt = t; }
        let pressing = 0;
        cats.forEach(c => { if (c.flee) { c.x += c.dir * 9; c.y -= .5; } else { const tx = cx - c.side * S * 1.05, dx = tx - c.x; if (Math.abs(dx) > 6) c.x += Math.sign(dx) * c.v * 2; else { c.near++; pressing++; } c.y += (cy + S * .05 - c.y) * .01; }
          const face = c.flee ? -c.dir : (c.x < cx ? -1 : 1), step = c.flee || Math.abs(cx - c.side * S * 1.05 - c.x) > 6 ? Math.abs(Math.sin(t / 90 + c.x)) * 5 : 0, pounce = c.near && Math.floor((t + c.x) / 500) % 2 ? -S * .25 : 0;
          if (c.e === "🦁") { // a lion: drawn body, legs and tufted tail, with the lion face at the front
            const bx = c.x, by = c.y - step + pounce, f = face, L = S * .55, ph = t / 90 + c.x, moving = step > 0 || c.flee;
            ctx.save(); ctx.translate(bx, by); ctx.scale(-f, 1);
            ctx.strokeStyle = "#a16207"; ctx.lineWidth = S * .09; ctx.lineCap = "round"; [[-.45, 0], [-.25, 1.5], [.2, 3], [.4, 4.5]].forEach(([lx, p0]) => { const sw = moving ? Math.sin(ph + p0) * S * .12 : 0; ctx.beginPath(); ctx.moveTo(lx * L * 1.6 - L * .55, S * .12); ctx.lineTo(lx * L * 1.6 - L * .55 + sw, S * .48); ctx.stroke(); });
            ctx.lineWidth = S * .05; ctx.beginPath(); ctx.moveTo(-L * 1.45, -S * .02); ctx.quadraticCurveTo(-L * 1.95, -S * .1 + Math.sin(ph) * 8, -L * 1.85, -S * .38); ctx.stroke(); ctx.fillStyle = "#7c2d12"; ctx.beginPath(); ctx.arc(-L * 1.85, -S * .4, S * .07, 0, 7); ctx.fill();
            ctx.fillStyle = "#d9a441"; ctx.beginPath(); ctx.ellipse(-L * .55, S * .05, L * .95, S * .24, 0, 0, 7); ctx.fill(); ctx.restore();
            em(ctx, "🦁", bx + f * -L * .15 * 0 + (-f) * L * .35 * -1 * 0, by - S * .12, S * .78, 0, f); }
          else em(ctx, c.e, c.x, c.y - step + pounce, S * 1.05, 0, face);
          if (c.near && Math.floor((t + c.x) / 900) % 3 === 0) big(ctx, "ROAR!", c.x, c.y - S * .8, 22, "#b45309");
          if (c.flee && c.fleeT == null) c.fleeT = t; if (c.flee && t - c.fleeT < 600) bubble(ctx, "eek!", c.x, c.y - S * .75, 16); });
        for (let i = cats.length - 1; i >= 0; i--) if (cats[i].x < -S * 2 || cats[i].x > W + S * 2) cats.splice(i, 1);
        if (pressing && Math.random() < .03) { roar(); roarAt = t; }
        rock = pressing ? Math.sin(t / 45) * .05 : rock * .9;
        // escape: after END with no cat touching the car, drive away
        if (!escape && t > END && !cats.some(c => !c.flee)) { escape = t; A.setChip("Phew! Safe! 🎉"); A.noise(2.5, .2, "lowpass", 300, 500, 1); }
        if (escape) { carX += Math.min(14, (t - escape) / 80); if (Math.random() < .9) dust.push({ x: cx - S * .9, y: cy + S * .3, r: 8, a: .8 }); }
        dust.forEach(d => { d.x -= 2; d.r += 1.2; d.a -= .012; ctx.fillStyle = `rgba(214,180,120,${Math.max(0, d.a)})`; ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 7); ctx.fill(); }); for (let i = dust.length - 1; i >= 0; i--) if (dust[i].a <= 0) dust.splice(i, 1);
        // the jeep with scared people
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(rock); const faces = pressing ? ["😱", "😨"] : t - honkAt < 500 ? ["😤", "😬"] : ["😟", "😰"];
        em(ctx, "🚙", 0, 0, S * 1.9, 0, -1); em(ctx, faces[0], -S * .22, -S * .32, S * .36); em(ctx, faces[1], S * .2, -S * .32, S * .36);
        if (t - honkAt < 400) big(ctx, "HONK! 📯", S * .9, -S * .9, 24, "#1d4ed8"); ctx.restore();
        if (escape && carX > W * .2) big(ctx, "Phew! Safe! 🎉", W / 2, H * .25, 50, "#15803d");
        if (t < 2500) big(ctx, "Tap the big cats to honk them away!", W / 2, H * .12, 20, "#7c2d12"); } };
  });

  // 👑 BESTOWED: a royal ceremony; the hero walks up the red carpet and kneels, tap the king to bestow the medal; fanfare, cheers and fireworks
  Weather.add("bestow,bestowed,bestows,bestowing,award,awarded,awarding,honour,honor,honoured,honored,medal,medals,ceremony,knighted,decorated", { e: "👑", name: "Bestowed", dur: 30000, track: 1, capture: 1, top: 1 }, A => {
    let given = 0, givenAt = 0, ready = 0, auto = 9000; const bits = [], fw = [];
    const note = (f, d, at) => A.noise(d, .28, "band", f, f, 40, at);
    const fanfare = at => [[523, .18], [659, .18], [784, .18], [1046, .6]].reduce((t0, [f, d]) => (note(f, d, t0), note(f * 1.5, d, t0), t0 + d), at);
    fanfare(.3); A.setChip("watch the ceremony…");
    const give = () => { if (given || !ready) return; given = 1; givenAt = performance.now(); A.setChip("🏅 medal bestowed!"); fanfare(.8); A.noise(2.2, .22, "band", 900, 1700, 1, .8); };
    return { down() { give(); },
      frame(t) { const { ctx } = A, W = A.W(), H = A.H(), S = Math.min(W, H) * .2, kx = W / 2, ky = H * .36, now = performance.now();
        // throne room
        const bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "rgba(76,29,149,.96)"); bg.addColorStop(1, "rgba(30,27,75,.97)"); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
        for (let i = 0; i < 4; i++) { const px = W * (.08 + i * .28 + (i > 1 ? .0 : 0)); if (Math.abs(px - kx) < S) continue; ctx.fillStyle = "rgba(226,232,240,.18)"; ctx.fillRect(px - 18, H * .05, 36, H * .8); }
        [[.2, "#dc2626"], [.8, "#dc2626"]].forEach(([fx, c]) => { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(W * fx - 26, H * .06); ctx.lineTo(W * fx + 26, H * .06); ctx.lineTo(W * fx + 26, H * .32); ctx.lineTo(W * fx, H * .27); ctx.lineTo(W * fx - 26, H * .32); ctx.fill(); em(ctx, "🦁", W * fx, H * .16, 26); });
        ctx.fillStyle = "#b91c1c"; ctx.beginPath(); ctx.moveTo(kx - S * .5, ky + S * .55); ctx.lineTo(kx + S * .5, ky + S * .55); ctx.lineTo(kx + S * 1.6, H); ctx.lineTo(kx - S * 1.6, H); ctx.fill();
        ctx.strokeStyle = "#facc15"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(kx - S * .5, ky + S * .55); ctx.lineTo(kx - S * 1.6, H); ctx.moveTo(kx + S * .5, ky + S * .55); ctx.lineTo(kx + S * 1.6, H); ctx.stroke();
        // throne + king
        ctx.fillStyle = "#ca8a04"; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(kx - S * .55, ky - S * .85, S * 1.1, S * 1.45, 18) : ctx.rect(kx - S * .55, ky - S * .85, S * 1.1, S * 1.45); ctx.fill(); ctx.fillStyle = "#7f1d1d"; ctx.fillRect(kx - S * .4, ky - S * .65, S * .8, S * 1.05);
        em(ctx, "🤴", kx, ky, S * .95); em(ctx, "👑", kx, ky - S * .55 + Math.sin(t / 400) * 2, S * .45);
        // the hero walks up, kneels, then stands proudly
        const walkK = Math.min(1, t / 2600), hx = kx + S * .02, hy = H + S * .3 - (H + S * .3 - (ky + S * 1.05)) * walkK, step = walkK < 1 ? Math.abs(Math.sin(t / 120)) * 6 : 0;
        if (walkK >= 1 && !ready) { ready = 1; A.setChip("tap the king to bestow the medal 👑"); }
        if (ready && !given && t > auto) give();
        const standing = given && now - givenAt > 1700; em(ctx, walkK < 1 ? "🚶" : standing ? "🦸" : "🧎", hx, hy - step, S * (walkK < 1 ? .9 : .85), 0, walkK < 1 || standing ? 1 : -1);
        // the medal: in the king's hand, then floats down onto the hero
        const mk = given ? Math.min(1, (now - givenAt) / 1400) : 0, mx = kx + S * .35 + (hx - kx - S * .35) * mk, my = ky + S * .1 + (hy - S * .05 - ky - S * .1) * mk - Math.sin(mk * Math.PI) * S * .6;
        if (!(standing && mk >= 1)) em(ctx, "🏅", mx, my, S * .4, Math.sin(t / 300) * .15); else em(ctx, "🏅", hx + S * .05, hy + S * .05, S * .3);
        if (ready && !given) { ctx.strokeStyle = `rgba(250,204,21,${.5 + .5 * Math.sin(t / 200)})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(kx, ky, S * .75, 0, 7); ctx.stroke(); big(ctx, "Tap the king to bestow the medal!", W / 2, H * .9, 20, "#7c2d12"); }
        // celebration
        if (given && now - givenAt > 1400) { if (bits.length < 300 && Math.random() < .6) for (let k = 0; k < 6; k++) bits.push({ x: Math.random() * W, y: -10, vx: (Math.random() - .5) * 2, vy: Math.random() * 2 + 1, c: ["#facc15", "#f43f5e", "#22c55e", "#60a5fa", "#fff"][k % 5], a: 1 });
          if (Math.random() < .05) { const fx = W * (.15 + Math.random() * .7), fy = H * (.1 + Math.random() * .3); A.noise(.4, .15, "band", 2200, 500, 1); for (let k = 0; k < 40; k++) { const a = k / 40 * 6.28, sp = 2 + Math.random() * 3; fw.push({ x: fx, y: fy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, c: ["#facc15", "#f472b6", "#a5f3fc", "#bbf7d0"][Math.floor(Math.random() * 4)], a: 1 }); } }
          big(ctx, "Bestowed! 🏅", W / 2, H * .88, 48, "#ca8a04"); bubble(ctx, "For your bravery!", kx + S * 1.1, ky - S * .5, 18); }
        bits.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .03; if (p.y > H) p.a = 0; ctx.fillStyle = p.c; ctx.globalAlpha = p.a; ctx.fillRect(p.x, p.y, 6, 4); }); for (let i = bits.length - 1; i >= 0; i--) if (bits[i].a <= 0) bits.splice(i, 1);
        fw.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .05; p.a -= .015; ctx.globalAlpha = Math.max(0, p.a); ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, 2.5, 0, 7); ctx.fill(); }); for (let i = fw.length - 1; i >= 0; i--) if (fw[i].a <= 0) fw.splice(i, 1); ctx.globalAlpha = 1; } };
  });

  // 🏃 EXHAUSTION: the legend of the first marathon; a runner goes from Marathon to Athens (42.195 km), getting more and more tired; tap to give water; he reaches Athens, cries "We won!" and collapses
  Weather.add("exhaustion,exhausted,exhausting,exhaust,tired,tiredness,weary,weariness,worn out,fatigue,fatigued,marathon,marathons,out of breath,breathless", { e: "🏃", name: "Marathon", dur: 26000, track: 1, capture: 1, top: 1 }, A => {
    const RUN = 14000; let x = 0, energy = 1, bonus = 0, cups = 3, last = 0, pant = 0, arrived = 0, drink = -9999; const sweat = [];
    A.setChip("tap the runner to give water 💧 × 3");
    return { down(px, py) { if (arrived || cups <= 0) return; cups--; bonus = Math.min(.35, bonus + .2); drink = performance.now(); A.plink(0); A.setChip(cups ? `💧 × ${cups} left` : "no water left!"); },
      frame(t) { const { ctx } = A, W = A.W(), H = A.H(), S = Math.min(W, H) * .2, road = H * .72, dt = Math.min(50, t - (last || t)); last = t;
        // Greece: sky, hills, olive trees, the road
        const sky = ctx.createLinearGradient(0, 0, 0, road); sky.addColorStop(0, "rgba(125,190,240,.97)"); sky.addColorStop(1, "rgba(220,238,250,.97)"); ctx.fillStyle = sky; ctx.fillRect(0, 0, W, road);
        ctx.fillStyle = "rgba(250,204,21,.9)"; ctx.beginPath(); ctx.arc(W * .15, H * .14, Math.min(W, H) * .06, 0, 7); ctx.fill();
        ctx.fillStyle = "rgba(120,150,90,.95)"; ctx.beginPath(); ctx.moveTo(0, road); for (let k = 0; k <= 10; k++) ctx.lineTo(W * k / 10, road - H * (.08 + .07 * Math.abs(Math.sin(k * 1.7)))); ctx.lineTo(W, road); ctx.fill();
        ctx.fillStyle = "rgba(214,190,140,.98)"; ctx.fillRect(0, road, W, H - road); ctx.fillStyle = "rgba(180,150,100,.9)"; ctx.fillRect(0, road + 6, W, 10);
        for (let k = 0; k < 6; k++) em(ctx, "🫒", W * (.08 + k * .17), road - S * .2, S * .35);
        em(ctx, "🪧", W * .06, road - S * .55, S * .55); big(ctx, "Marathon", W * .06 + 4, road - S * 1.0, 14, "#1f2937");
        em(ctx, "🏛️", W - S * .65, road - S * .6, S * 1.25); big(ctx, "Athens", W - S * .65, road - S * 1.4, 18, "#1f2937");
        // the run: slows as energy drains
        const start = 1200, x0 = W * .1, x1 = W - S * 1.25;
        if (t > start && !arrived) { bonus = Math.max(0, bonus - dt / 9000); energy = Math.max(.02, Math.min(1, 1 - Math.pow(x / (x1 - x0), 1.15) + bonus)); const sp = (.35 + .9 * energy) * (x1 - x0) / RUN * 1.25; x = Math.min(x1 - x0, x + sp * dt); if (x >= x1 - x0) { arrived = t; A.noise(.6, .2, "band", 700, 400, 1); }
          if (t - pant > 260 + (1 - energy) * 520) { pant = t; A.noise(.18, .05 + (1 - energy) * .1, "band", 1400, 900, 2); }
          if (energy < .7 && Math.random() < .15 + (1 - energy) * .3) sweat.push({ x: x0 + x, y: road - S * .95, vx: -1 - Math.random() * 2, vy: -2 - Math.random() * 2, a: 1 }); }
        const km = Math.min(42.195, x / (x1 - x0) * 42.195);
        // distance + energy
        ctx.fillStyle = "rgba(255,255,255,.92)"; ctx.fillRect(16, H * .06 + 40, 230, 62); ctx.fillStyle = "#1f2937"; ctx.font = "800 16px system-ui"; ctx.textAlign = "left";
        ctx.fillText(`🏃 ${km.toFixed(km >= 42 ? 3 : 1)} km  (${(km * .621371).toFixed(1)} mi)`, 26, H * .06 + 62); ctx.fillText("⚡", 26, H * .06 + 90);
        ctx.fillStyle = "#e5e7eb"; ctx.fillRect(50, H * .06 + 78, 180, 14); ctx.fillStyle = energy > .5 ? "#22c55e" : energy > .2 ? "#f59e0b" : "#dc2626"; ctx.fillRect(50, H * .06 + 78, 180 * energy, 14);
        // the runner
        const rx = x0 + x, running = t > start && !arrived, ph = t / (70 + (1 - energy) * 120), bob = running ? Math.abs(Math.sin(ph)) * (10 * energy + 2) : 0, wob = running ? Math.sin(t / 300) * (1 - energy) * .25 : 0;
        sweat.forEach(d => { d.x += d.vx; d.y += d.vy; d.vy += .25; d.a -= .03; ctx.fillStyle = `rgba(56,189,248,${Math.max(0, d.a)})`; ctx.beginPath(); ctx.ellipse(d.x, d.y, 2.5, 4, 0, 0, 7); ctx.fill(); }); for (let i = sweat.length - 1; i >= 0; i--) if (sweat[i].a <= 0) sweat.splice(i, 1);
        if (!arrived || t - arrived < 1800) { em(ctx, "🏃", rx, road - S * .45 - bob, S, wob, -1);
          const face = arrived ? "😮‍💨" : energy > .7 ? "😀" : energy > .45 ? "😅" : energy > .2 ? "🥵" : "😵‍💫", fx = rx + S * .35, fy = road - S * 1.25 - bob;
          ctx.fillStyle = "#fff"; ctx.strokeStyle = "#cbd5e1"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(fx, fy, S * .22, 0, 7); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(fx - S * .16, fy + S * .2, S * .05, 0, 7); ctx.fill(); ctx.stroke(); em(ctx, face, fx, fy, S * .3); }
        else { const k = Math.min(1, (t - arrived - 1800) / 500); em(ctx, "🧍", rx + S * .3 * k, road - S * .45 + S * .15 * k, S, k * Math.PI / 2); em(ctx, "😵", rx + S * .55 * k + S * .05, road - S * (1.15 - .75 * k), S * .36); if (k >= 1) { ctx.fillStyle = "rgba(255,255,255,.8)"; ["z", "Z", "z"].forEach((z, i) => big(ctx, z, rx + S * .6 + i * 14, road - S * .9 - i * 16 - (t / 40 % 20), 16 + i * 4, "#475569")); } }
        if (performance.now() - drink < 700) em(ctx, "💧", rx + S * .4, road - S * .9, S * .35);
        if (arrived && t - arrived < 1800) bubble(ctx, "We won! 🏆", rx - S * .2, road - S * 1.6, 22);
        if (t < start) big(ctx, "490 BC · Marathon → Athens", W / 2, H * .3, 26, "#1e3a8a");
        // the story
        if (arrived && t - arrived > 2400) { big(ctx, "EXHAUSTION", W / 2, H * .3, 52, "#b91c1c");
          const lines = ["Legend: in 490 BC Pheidippides ran from Marathon to Athens", "to bring news of victory, then collapsed from exhaustion.", "Today a marathon is 42.195 km (26.2 miles).", "The first modern Olympic marathon was in Athens in 1896."];
          ctx.font = "700 14px system-ui"; const w = Math.max(...lines.map(l => ctx.measureText(l).width)) + 28; ctx.fillStyle = "rgba(255,255,255,.95)"; ctx.fillRect(W / 2 - w / 2, H * .36, w, 92); ctx.strokeStyle = "#1e3a8a"; ctx.lineWidth = 2; ctx.strokeRect(W / 2 - w / 2, H * .36, w, 92);
          ctx.fillStyle = "#1f2937"; ctx.textAlign = "center"; lines.forEach((l, i) => ctx.fillText(l, W / 2, H * .36 + 22 + i * 20)); ctx.textAlign = "start"; } } };
  });

  // 👟 FILTHY: a kid comes in from football in the mud and walks muddy shoe prints all over the screen; then scrub them away with a sponge
  Weather.add("filthy,filth,dirty,dirt,muddy,mud,grimy,grime,grubby,messy,mess,stained,smudged,soiled,mucky,squelch,squelched", { e: "👟", name: "Muddy shoes", dur: 45000, track: 1, capture: 1, top: 1 }, A => {
    const W = A.W(), H = A.H(), prints = [], splats = [], path = []; let rub = 0, total = 0, done = 0, walkEnd = 0, ball = { x: 0, y: 0, vy: 0 };
    // a wobbly walk across the screen: in on the left, around the middle, out on the right
    for (let k = 0; k <= 60; k++) { const u = k / 60; path.push([-60 + u * (W + 120), H * (.58 + .2 * Math.sin(u * Math.PI * 2.2) + .06 * Math.sin(u * 9))]); }
    const at = u => { const f = Math.min(path.length - 1.001, u * (path.length - 1)), i = Math.floor(f), k = f - i; return [path[i][0] + (path[i + 1][0] - path[i][0]) * k, path[i][1] + (path[i + 1][1] - path[i][1]) * k, Math.atan2(path[i + 1][1] - path[i][1], path[i + 1][0] - path[i][0])]; };
    const WALK = 7500, START = 1800; let nextStep = 0, side = 1;
    const sole = (ctx, x, y, a, sd, alpha) => { ctx.save(); ctx.translate(x, y); ctx.rotate(a + Math.PI / 2); ctx.translate(sd * 9, 0); ctx.globalAlpha = alpha; ctx.fillStyle = "#5b3a1e";
      ctx.beginPath(); ctx.ellipse(0, -9, 9, 13, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(0, 12, 7, 8, 0, 0, 7); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,.25)"; for (let k = -3; k <= 3; k++) ctx.fillRect(-7, -9 + k * 4, 14, 1.5); ctx.restore(); };
    A.setChip("⚽ after football in the mud…");
    return { move(x, y) { if (!walkEnd) return; rub++; },
      frame(t) { const { ctx } = A;
        // walking: a step every ~280 ms leaves a print; mud splats now and then
        if (t > START && !walkEnd) { const u = (t - START) / WALK; if (u >= 1) { walkEnd = t; total = prints.length; A.setChip(`🧽 scrub them away! ${total} prints`); }
          else if (t > nextStep) { nextStep = t + 280; side = -side; const [x, y, a] = at(u); if (x > 14 && x < W - 14) prints.push({ x, y, a, sd: side, al: .85 }); A.noise(.12, .12, "lowpass", 500, 250, 2);
            if (Math.random() < .35) splats.push({ x: x + (Math.random() - .5) * 90, y: y + (Math.random() - .5) * 90, r: 5 + Math.random() * 12, al: .8, n: 5 + Math.floor(Math.random() * 4), seed: Math.random() * 6 }); } }
        // scrubbing: anything under the sponge fades
        if (walkEnd) { const sx = A.ptr.x, sy = A.ptr.y; [...prints, ...splats].forEach(p => { if (Math.hypot(p.x - sx, p.y - sy) < 58 && p.al > 0) { p.al -= .2; if (p.al <= 0 && p.sd) { A.plink(0); } } });
          const left = prints.filter(p => p.al > 0).length; if (!done) { A.setChip(left ? `🧽 ${left} prints left` : "✨ sparkling clean!"); if (!left) { done = t; [0, .2, .4].forEach(d => A.chirp(d)); } } }
        splats.forEach(p => { if (p.al <= 0) return; ctx.globalAlpha = p.al; ctx.fillStyle = "#6b4423"; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill(); for (let k = 0; k < p.n; k++) { const a = p.seed + k * 1.3, d = p.r * (1.3 + (k % 3) * .4); ctx.beginPath(); ctx.arc(p.x + Math.cos(a) * d, p.y + Math.sin(a) * d, p.r * .3, 0, 7); ctx.fill(); } }); ctx.globalAlpha = 1;
        prints.forEach(p => { if (p.al > 0) sole(ctx, p.x, p.y, p.a, p.sd, p.al); });
        // the muddy kid
        if (t < START) { const S = Math.min(W, H) * .3, kx = W * .2, ky = H * .72, cyc = (t % 700) / 700, kick = cyc < .25 ? Math.sin(cyc / .25 * Math.PI) : 0, by = ky - S * .2 - Math.abs(Math.sin(cyc * Math.PI)) * S * .9;
          footballer(ctx, kx, ky, S, 1, 0, kick, 1); em(ctx, "⚽", kx + S * .28, by, S * .2, t / 150); if (kick > .5 && cyc < .15) A.plink(0); big(ctx, "⚽ After football in the mud…", W / 2, H * .22, 26, "#5b3a1e"); }
        else if (!walkEnd) { const u = (t - START) / WALK, [x, y, a] = at(u), S = Math.min(W, H) * .24, dir = Math.cos(a) >= 0 ? 1 : -1;
          footballer(ctx, x, y, S, dir, t / 110, 0, 1); em(ctx, "⚽", x + dir * S * .32, y - S * .07, S * .19, t / 90 * dir); }
        // the sponge follows the finger once the walking is done
        if (walkEnd && !done) { em(ctx, "🧽", A.ptr.x, A.ptr.y, 46, Math.sin(t / 80) * .25); if (t - walkEnd < 3000) big(ctx, "Rub with the sponge to clean it!", W / 2, H * .12, 22, "#1d4ed8"); }
        if (done) { big(ctx, "Sparkling clean! ✨", W / 2, H * .45, 48, "#0891b2"); for (let k = 0; k < 14; k++) { const a = k * .45 + t / 700, r = 90 + 30 * Math.sin(t / 300 + k); em(ctx, "✨", W / 2 + Math.cos(a) * r * 2, H * .45 + Math.sin(a) * r, 18); } } } };
  });

  // 🔌 CONNECT: glowing lines link the cards on the page like a network; then drag each coloured plug to its socket; all connected = the bulb lights up
  Weather.add("connect,connects,connected,connecting,connection,connections,link,links,linked,linking,attach,attached,plug,plugged,network,wire,wires,wired,circuit", { e: "🔌", name: "Connect", dur: 40000, track: 1, capture: 1, top: 1 }, A => {
    const W = A.W(), H = A.H(), COL = [["#ef4444", "red"], ["#22c55e", "green"], ["#3b82f6", "blue"], ["#f59e0b", "yellow"]], NET = 2600;
    const nodes = [...document.querySelectorAll(".card, img, h1, h2, .btn, .panel, .tag")].map(el => el.getBoundingClientRect()).filter(b => b.bottom > 0 && b.top < innerHeight && b.width > 20).slice(0, 14).map(b => ({ x: b.left + b.width / 2, y: b.top + Math.min(b.height / 2, 30) }));
    const links = []; nodes.forEach((n, i) => { const near = nodes.map((m, j) => [j, Math.hypot(m.x - n.x, m.y - n.y)]).filter(([j]) => j !== i).sort((a, b) => a[1] - b[1]).slice(0, 2); near.forEach(([j]) => { if (!links.some(l => (l[0] === j && l[1] === i))) links.push([i, j]); }); });
    const order = [0, 1, 2, 3].sort(() => Math.random() - .5), lx = W * .18, rx = W * .82, ys = k => H * (.3 + k * .14);
    const plugs = COL.map((c, k) => ({ k, x: lx, y: ys(k), done: 0 })), sockets = COL.map((c, k) => ({ k, x: rx, y: ys(order.indexOf(k)) }));
    let drag = null, made = 0, lit = 0, said = 0; const sparks = [];
    return { down(x, y) { if (Date.now() < 0) return; const p = plugs.find(q => !q.done && Math.hypot(q.x - x, q.y - y) < 34); if (p) { drag = p; A.plink(0); } },
      move(x, y) { },
      up(x, y) { if (!drag) return; const s0 = sockets.find(q => Math.hypot(q.x - x, q.y - y) < 40); if (s0 && s0.k === drag.k) { drag.done = 1; made++; A.noise(.15, .3, "band", 3000, 1500, 3); for (let k = 0; k < 18; k++) sparks.push({ x: s0.x, y: s0.y, vx: (Math.random() - .5) * 8, vy: (Math.random() - .5) * 8, a: 1 }); A.setChip(made < 4 ? `🔌 ${made} / 4 connected` : "💡 all connected!"); if (made === 4) { lit = performance.now(); [0, .2, .4].forEach(d => A.chirp(d)); } }
        else if (s0) { A.noise(.2, .15, "lowpass", 300, 150, 1); } drag = null; },
      frame(t) { const { ctx } = A;
        // 1) the page becomes a network
        const netK = Math.min(1, t / 1400), fadeNet = t > NET ? Math.max(0, 1 - (t - NET) / 700) : 1;
        if (fadeNet > 0) { ctx.save(); ctx.globalAlpha = fadeNet; ctx.lineWidth = 2.5; links.forEach(([i, j], n) => { const a = nodes[i], b = nodes[j], k = Math.min(1, Math.max(0, netK * 1.6 - n * .05)); if (!k) return; const ex = a.x + (b.x - a.x) * k, ey = a.y + (b.y - a.y) * k;
            ctx.strokeStyle = "rgba(56,189,248,.85)"; ctx.shadowColor = "#38bdf8"; ctx.shadowBlur = 10; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(ex, ey); ctx.stroke(); ctx.shadowBlur = 0;
            if (k >= 1) { const u = ((t / 900) + n * .37) % 1; ctx.fillStyle = "#fde047"; ctx.beginPath(); ctx.arc(a.x + (b.x - a.x) * u, a.y + (b.y - a.y) * u, 3.5, 0, 7); ctx.fill(); } });
          nodes.forEach(n => { ctx.fillStyle = "#0ea5e9"; ctx.beginPath(); ctx.arc(n.x, n.y, 6 * netK, 0, 7); ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke(); }); ctx.restore(); }
        if (t < NET) { if (!said) { said = 1; A.setChip("connecting…"); } return; }
        if (said === 1) { said = 2; A.setChip("drag each plug to its colour 🔌"); }
        // 2) the wire game
        const g = Math.min(1, (t - NET) / 500); ctx.globalAlpha = g; ctx.fillStyle = "rgba(15,23,42,.88)"; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1;
        ctx.fillStyle = "#334155"; ctx.fillRect(lx - 40, ys(0) - 50, 50, ys(3) - ys(0) + 100); ctx.fillRect(rx - 10, ys(0) - 50, 50, ys(3) - ys(0) + 100);
        sockets.forEach(q => { ctx.fillStyle = "#0f172a"; ctx.beginPath(); ctx.arc(q.x, q.y, 20, 0, 7); ctx.fill(); ctx.strokeStyle = COL[q.k][0]; ctx.lineWidth = 6; ctx.stroke(); ctx.fillStyle = "#475569"; ctx.fillRect(q.x - 6, q.y - 9, 4, 18); ctx.fillRect(q.x + 3, q.y - 9, 4, 18); });
        plugs.forEach(p => { const end = p.done ? sockets.find(q => q.k === p.k) : drag === p ? { x: A.ptr.x, y: A.ptr.y } : null;
          if (end) { ctx.strokeStyle = COL[p.k][0]; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(p.x, p.y); const mx = (p.x + end.x) / 2; ctx.bezierCurveTo(mx, p.y + 60, mx, end.y + 60, end.x, end.y); ctx.stroke();
            if (p.done) { const u = (t / 700 + p.k * .25) % 1, bx = Math.pow(1 - u, 3) * p.x + 3 * Math.pow(1 - u, 2) * u * mx + 3 * (1 - u) * u * u * mx + u * u * u * end.x, by = Math.pow(1 - u, 3) * p.y + 3 * Math.pow(1 - u, 2) * u * (p.y + 60) + 3 * (1 - u) * u * u * (end.y + 60) + u * u * u * end.y; ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(bx, by, 4, 0, 7); ctx.fill(); } }
          const hx = end && !p.done ? end.x : p.x, hy = end && !p.done ? end.y : p.y; ctx.fillStyle = COL[p.k][0]; ctx.strokeStyle = "#fff"; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(hx - 18, hy - 14, 36, 28, 8) : ctx.rect(hx - 18, hy - 14, 36, 28); ctx.fill(); ctx.stroke();
          if (!p.done && !drag && Math.floor(t / 400) % 2) { ctx.strokeStyle = "rgba(255,255,255,.6)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(p.x, p.y, 28, 0, 7); ctx.stroke(); } });
        sparks.forEach(sp => { sp.x += sp.vx; sp.y += sp.vy; sp.a -= .04; ctx.fillStyle = `rgba(253,224,71,${Math.max(0, sp.a)})`; ctx.beginPath(); ctx.arc(sp.x, sp.y, 3, 0, 7); ctx.fill(); }); for (let i = sparks.length - 1; i >= 0; i--) if (sparks[i].a <= 0) sparks.splice(i, 1);
        // the bulb
        const on = lit ? Math.min(1, (performance.now() - lit) / 400) : 0, bx = W / 2, by = H * .8;
        if (on) { const gl = ctx.createRadialGradient(bx, by, 10, bx, by, 160); gl.addColorStop(0, `rgba(253,224,71,${.8 * on})`); gl.addColorStop(1, "rgba(253,224,71,0)"); ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(bx, by, 160, 0, 7); ctx.fill(); }
        ctx.save(); ctx.globalAlpha = on ? 1 : .45; em(ctx, "💡", bx, by, 70); ctx.restore();
        if (on) big(ctx, "Connected! ⚡", W / 2, H * .17, 46, "#ca8a04"); else big(ctx, "Drag each plug to the socket of the same colour", W / 2, H * .17, 18, "#1e293b"); } };
  });

  // 🪫 LETHARGIC: side by side, a kid full of energy vs. a lethargic kid (no energy, very slow, sleepy); tap to call him to play
  Weather.add("lethargic,lethargy,sluggish,listless,languid,lazy,no energy", { e: "🪫", name: "Lethargic", dur: 16000, capture: 1, top: 1 }, A => {
    let call = -9999; A.setChip("tap to call him to play ⚽");
    return { down() { call = performance.now(); A.chirp(0); },
      frame(t) { const { ctx } = A, W = A.W(), H = A.H(), half = W / 2, gy = H * .82, S = Math.min(half, H) * .45, now = performance.now(), called = now - call < 2600;
        ctx.fillStyle = "rgba(220,252,231,.95)"; ctx.fillRect(0, 0, half, H); ctx.fillStyle = "rgba(226,232,240,.97)"; ctx.fillRect(half, 0, half, H); ctx.fillStyle = "#94a3b8"; ctx.fillRect(half - 2, H * .1, 4, H * .9);
        ctx.fillStyle = "#86efac"; ctx.fillRect(0, gy, half, H - gy); ctx.fillStyle = "#cbd5e1"; ctx.fillRect(half, gy, half, H - gy);
        big(ctx, "LETHARGIC = no energy · very slow · sleepy", W / 2, Math.max(H * .17, 96), Math.min(26, W / 30), "#1e293b");
        // left: full of energy
        big(ctx, "Full of energy ⚡ 100%", half / 2, Math.max(H * .26, 136), 20, "#15803d");
        const run = (t / 1300) % 2, lx = half * (.2 + .6 * (run < 1 ? run : 2 - run)), ldir = run < 1 ? 1 : -1, jump = Math.abs(Math.sin(t / 160)) * S * .22;
        footballer(ctx, lx, gy - jump, S, ldir, t / 60, 0, 0); em(ctx, "⚽", lx + ldir * S * .35, gy - S * .1 - Math.abs(Math.sin(t / 130)) * S * .5, S * .2, t / 80);
        // right: lethargic, barely moving, head drooping, eyes half closed
        big(ctx, "Lethargic 🪫 3%", half + half / 2, Math.max(H * .26, 136), 20, "#475569");
        const rx = half + half * (.3 + .4 * ((t / 16000) % 1)), droop = called ? Math.max(0, .35 - (now - call) / 1200 * .35) + (now - call > 1500 ? .35 * Math.min(1, (now - call - 1500) / 800) : 0) : .35;
        ctx.save(); ctx.translate(rx, gy); ctx.rotate(droop * .35); footballer(ctx, 0, 0, S * .97, 1, t / 900, 0, 0); ctx.restore();
        const hx = rx + Math.sin(droop * .35) * S * .99, hy = gy - Math.cos(droop * .35) * S * .99; ctx.fillStyle = "#e8b48a"; ctx.fillRect(hx + S * .03, hy - S * .03, S * .1, S * .035); ctx.strokeStyle = "#1f2937"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(hx + S * .04, hy + S * .005); ctx.lineTo(hx + S * .11, hy + S * .005); ctx.stroke();
        ctx.fillStyle = "#fff"; ctx.strokeStyle = "#475569"; ctx.lineWidth = 2; const by2 = Math.max(H * .26, 136) + 22; ctx.fillRect(half + half * .78, by2, 46, 22); ctx.strokeRect(half + half * .78, by2, 46, 22); ctx.fillStyle = "#dc2626"; ctx.fillRect(half + half * .78 + 2, by2 + 2, 3, 18); ctx.fillStyle = "#475569"; ctx.fillRect(half + half * .78 + 46, by2 + 7, 4, 8);
        if (!called) { const ph = (t / 5000) % 1; if (ph < .35) bubble(ctx, "🥱 yaaawn…", rx + S * .1, gy - S * 1.35, 16); else for (let k = 0; k < 3; k++) big(ctx, "z", rx + S * .25 + k * 14, gy - S * 1.15 - k * 16 - (t / 40 % 16), 14 + k * 5, "#64748b"); }
        else { bubble(ctx, "Come on, let's play! ⚽", lx, gy - S * 1.35, 15); if (now - call > 700) bubble(ctx, "…maybe later… 😴", rx + S * .1, gy - S * 1.35, 15); }
        ctx.font = "700 14px system-ui"; ctx.fillStyle = "#334155"; ctx.textAlign = "center"; ctx.fillText("Same kid, same game. One has energy, one is lethargic: tired, slow and sleepy.", W / 2, H * .95); ctx.textAlign = "start"; } };
  });

  // 🥧 AROMA: a pie follows your finger, wavy smell ribbons float from it, and a hungry dog follows the smell
  Weather.add("aroma,aromas,fragrant,fragrance,scent,scents,smell,smells,smelled,smelling,sniff,sniffed,whiff,odour,odor", { e: "🥧", name: "Aroma", dur: 14000, track: 1, top: 1 }, A => {
    const trail = [], dog = { x: -80, y: A.H() * .7, f: -1 }; let last = 0;
    return { frame(t) { const { ctx } = A, W = A.W(), H = A.H(), px = A.ptr.moved ? A.ptr.x : W / 2 + Math.sin(t / 1500) * W * .3, py = A.ptr.moved ? A.ptr.y : H * .45 + Math.cos(t / 1100) * 60;
      if (t - last > 90) { last = t; trail.push({ x: px, y: py - 30, a: 1, ph: Math.random() * 6, c: ["#f59e0b", "#fb923c", "#fbbf24"][Math.floor(Math.random() * 3)] }); }
      trail.forEach(p => { p.y -= .7; p.x += Math.sin(t / 300 + p.ph) * .8; p.a -= .007; }); for (let i = trail.length - 1; i >= 0; i--) if (trail[i].a <= 0) trail.splice(i, 1);
      ctx.lineCap = "round"; for (let k = 0; k < 3; k++) { ctx.strokeStyle = ["#f59e0b", "#fb923c", "#fbbf24"][k]; ctx.lineWidth = 5; ctx.beginPath(); trail.forEach((p, i) => { const xx = p.x + Math.sin(i * .35 + t / 400 + k * 2) * 14 + (k - 1) * 12; i ? ctx.lineTo(xx, p.y) : ctx.moveTo(xx, p.y); }); ctx.globalAlpha = .55; ctx.stroke(); ctx.globalAlpha = 1; }
      em(ctx, "🥧", px, py, 64); 
      const dx = px - dog.x, dy = (py + 40) - dog.y; dog.x += dx * .025; dog.y += dy * .025; if (Math.abs(dx) > 3) dog.f = dx > 0 ? -1 : 1; const near = Math.hypot(dx, dy) < 90;
      em(ctx, "🐕", dog.x, dog.y + Math.abs(Math.sin(t / 120)) * -6, 64, 0, dog.f); em(ctx, "👃", dog.x - dog.f * 30, dog.y - 34, 20);
      if (Math.floor(t / 1600) % 2) bubble(ctx, near ? "Mmm! 😋" : "sniff sniff…", dog.x, dog.y - 62, 16);
      if (!A.ptr.moved && t < 4000) big(ctx, "Move the pie! The smell will follow it", W / 2, H * .15, 18, "#9a3412"); } };
  });

  // ☄️ IMPACT: a meteor streaks in and hits the page: flash, crater, shockwave; everything is knocked outwards and shakes
  Weather.add("impact,impacts,impacted,crash,crashed,collide,collided,collision,meteor,meteorite,smash,smashed,slam,slammed", { e: "☄️", name: "Impact", dur: 6500, top: 1 }, A => {
    const HIT = 1300, rocks = []; let hit = 0;
    setTimeout(() => { try { A.boom(0); A.noise(1.5, .55, "lowpass", 700, 90, 1); } catch (e) {} }, HIT);
    const cx0 = innerWidth / 2, cy0 = innerHeight * .55;
    document.querySelectorAll(".card, .item, img, .btn, h1, h2, .tag, .panel").forEach((el, i) => { if (i > 50) return; const b = el.getBoundingClientRect(); if (b.bottom < 0 || b.top > innerHeight) return; const dx = b.left + b.width / 2 - cx0, dy = b.top + b.height / 2 - cy0, d = Math.max(60, Math.hypot(dx, dy)), k = 3000 / d;
      A.ani(el, [{ transform: "none" }, { transform: "none", offset: .2 }, { transform: `translate(${dx / d * k * 8}px, ${dy / d * k * 8}px) rotate(${(i % 2 ? 1 : -1) * k}deg)`, offset: .26 }, { transform: `translate(${dx / d * k * 3}px, ${dy / d * k * 3}px)`, offset: .5 }, { transform: "none" }], { duration: 6500, easing: "ease-out" }); });
    A.kids().forEach(el => A.ani(el, [{ transform: "none" }, { transform: "translate(-14px,10px)" }, { transform: "translate(12px,-9px)" }, { transform: "translate(-8px,6px)" }, { transform: "translate(5px,-3px)" }, { transform: "none" }], { duration: 700, delay: HIT }));
    return { frame(t) { const { ctx } = A, W = A.W(), H = A.H(), cx = W / 2, cy = H * .55;
      if (t < HIT) { const k = t / HIT, mx = W + 80 - (W + 80 - cx) * k, my = -80 + (cy + 80) * k; ctx.strokeStyle = "rgba(251,146,60,.6)"; ctx.lineWidth = 18; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(mx + 140, my - 120); ctx.lineTo(mx, my); ctx.stroke(); em(ctx, "☄️", mx, my, 80, 0, -1); return; }
      const d = t - HIT; if (!hit) { hit = 1; for (let i = 0; i < 40; i++) { const a = Math.random() * Math.PI - Math.PI, sp = 4 + Math.random() * 10; rocks.push({ x: cx, y: cy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: 3 + Math.random() * 7 }); } }
      if (d < 350) { ctx.fillStyle = `rgba(255,255,230,${1 - d / 350})`; ctx.fillRect(0, 0, W, H); }
      const ring = d * .9; if (ring < Math.max(W, H)) { ctx.strokeStyle = `rgba(255,255,255,${Math.max(0, 1 - ring / Math.max(W, H))})`; ctx.lineWidth = 8; ctx.beginPath(); ctx.ellipse(cx, cy, ring, ring * .45, 0, 0, 7); ctx.stroke(); }
      ctx.fillStyle = "#3f2a1d"; ctx.beginPath(); ctx.ellipse(cx, cy, 120, 44, 0, 0, 7); ctx.fill(); ctx.fillStyle = "#1c120b"; ctx.beginPath(); ctx.ellipse(cx, cy + 6, 90, 28, 0, 0, 7); ctx.fill(); ctx.strokeStyle = "#7c5a3a"; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(cx, cy, 124, 48, 0, Math.PI, Math.PI * 2); ctx.stroke();
      if (d < 2500) { ctx.fillStyle = `rgba(120,113,108,${.6 * (1 - d / 2500)})`; for (let k = 0; k < 8; k++) { ctx.beginPath(); ctx.arc(cx + (k - 3.5) * 40, cy - 30 - d * .05 - (k % 3) * 20, 30 + d * .03, 0, 7); ctx.fill(); } }
      rocks.forEach(r => { r.x += r.vx; r.y += r.vy; r.vy += .35; ctx.fillStyle = "#57534e"; ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, 7); ctx.fill(); });
      if (d > 300 && d < 3500) big(ctx, "IMPACT!", W / 2, H * .22, 64, "#c2410c"); } };
  });

  // 🦉 NOCTURNAL: night falls on the page; an owl wakes up with glowing eyes, bats flutter, fireflies blink
  Weather.add("nocturnal,owl,owls,bat,bats,nighttime,night-time,nightfall,midnight", { e: "🦉", name: "Nocturnal", dur: 11000, track: 1, top: 1 }, A => {
    const W = A.W(), H = A.H(), bats = Array.from({ length: 6 }, (_, i) => ({ x: -60 - i * 120, y: H * (.15 + Math.random() * .35), v: 2.5 + Math.random() * 2, ph: Math.random() * 6 })), flies = Array.from({ length: 30 }, () => ({ x: Math.random() * W, y: H * (.45 + Math.random() * .5), ph: Math.random() * 6 })), stars = Array.from({ length: 70 }, () => [Math.random() * W, Math.random() * H * .6, Math.random() * 6]);
    let blink = 0, nextBlink = 2500; A.noise(11, .05, "band", 4200, 4600, 8); [2, 5.5, 8].forEach(d => A.noise(.5, .15, "band", 400, 320, 6, d));
    return { frame(t) { const { ctx } = A, k = Math.min(1, t / 1500);
      ctx.fillStyle = `rgba(8,12,38,${.88 * k})`; ctx.fillRect(0, 0, W, H);
      stars.forEach(([x, y, p]) => { ctx.fillStyle = `rgba(255,255,255,${k * (.4 + .6 * Math.abs(Math.sin(t / 700 + p)))})`; ctx.fillRect(x, y, 2, 2); });
      ctx.fillStyle = `rgba(254,249,195,${k})`; ctx.beginPath(); ctx.arc(W * .82, H * .16, 40, 0, 7); ctx.fill(); ctx.fillStyle = `rgba(8,12,38,${k})`; ctx.beginPath(); ctx.arc(W * .82 + 16, H * .16 - 8, 36, 0, 7); ctx.fill();
      ctx.strokeStyle = `rgba(68,40,20,${k})`; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(0, H * .5); ctx.quadraticCurveTo(W * .2, H * .46, W * .38, H * .5); ctx.stroke();
      const ox = W * .22, oy = H * .5 - 46; em(ctx, "🦉", ox, oy, 90 * k);
      if (t > nextBlink) { blink = 1; nextBlink = t + 2200 + Math.random() * 1500; } blink = Math.max(0, blink - .1);
      if (k >= 1 && blink < .5) { const lx = Math.max(-5, Math.min(5, (A.ptr.x - ox) / 60)), ly = Math.max(-4, Math.min(4, (A.ptr.y - oy) / 60)); [-16, 16].forEach(dx => { const g = ctx.createRadialGradient(ox + dx, oy - 8, 1, ox + dx, oy - 8, 16); g.addColorStop(0, "rgba(253,224,71,.95)"); g.addColorStop(1, "rgba(253,224,71,0)"); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(ox + dx, oy - 8, 16, 0, 7); ctx.fill(); ctx.fillStyle = "#111"; ctx.beginPath(); ctx.arc(ox + dx + lx, oy - 8 + ly, 4, 0, 7); ctx.fill(); }); }
      if (t > 2000 && t < 3200) bubble(ctx, "Hoo-hoo! Good morning… at night!", ox + 40, oy - 70, 15);
      bats.forEach(b => { if (t < 1500) return; b.x += b.v; if (b.x > W + 60) b.x = -60; const fl = Math.sin(t / 60 + b.ph); em(ctx, "🦇", b.x, b.y + Math.sin(t / 300 + b.ph) * 20, 34, fl * .3, -1); });
      flies.forEach(f => { const a = Math.max(0, Math.sin(t / 400 + f.ph)); if (a < .2) return; f.x += Math.sin(t / 900 + f.ph) * .6; f.y += Math.cos(t / 700 + f.ph) * .4; const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, 9); g.addColorStop(0, `rgba(190,242,100,${a})`); g.addColorStop(1, "rgba(190,242,100,0)"); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(f.x, f.y, 9, 0, 7); ctx.fill(); });
      if (t > 3500 && t < 9000) big(ctx, "Nocturnal: awake at night 🌙", W / 2, H * .9, 22, "#312e81"); } };
  });

  // 📚 PRECARIOUS: a wobbly stack of books on a cliff edge; move left and right to keep it balanced for 10 seconds
  Weather.add("precarious,precariously,teeter,teetered,teetering,unstable,unsteady,balance,balanced,balancing,topple,toppled", { e: "📚", name: "Precarious", dur: 40000, track: 1, capture: 1, top: 1 }, A => {
    let ang = 0, vel = 0, held = 0, state = 0, endAt = 0, last = 0, tStart = 0, keyPush = 0, push = 0; const GOAL = 10000, books = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#a855f7", "#ec4899"];
    const kd = e => { if (e.key === "ArrowLeft") { keyPush = -1; e.preventDefault(); } if (e.key === "ArrowRight") { keyPush = 1; e.preventDefault(); } }, ku = e => { if (e.key === "ArrowLeft" || e.key === "ArrowRight") keyPush = 0; };
    addEventListener("keydown", kd); addEventListener("keyup", ku);
    A.setChip("move the SAME way it leans ⚖️");
    return { stop() { removeEventListener("keydown", kd); removeEventListener("keyup", ku); }, down() { if (state && performance.now() - endAt > 700) { ang = (Math.random() - .5) * .05; vel = 0; held = 0; state = 0; tStart = 0; A.setChip("move left & right to balance! ⚖️"); } },
      frame(t) { const { ctx } = A, W = A.W(), H = A.H(), dt = Math.min(40, t - (last || t)); last = t; if (!tStart) tStart = t; const bx = W * .55, by = H * .72, bw = Math.min(W, H) * .2, bh = 26;
        // the cliff
        ctx.fillStyle = "rgba(186,230,253,.92)"; ctx.fillRect(0, 0, W, H); ctx.fillStyle = "#78716c"; ctx.beginPath(); ctx.moveTo(0, by); ctx.lineTo(bx + 30, by); ctx.lineTo(bx + 60, H); ctx.lineTo(0, H); ctx.fill(); ctx.fillStyle = "#4d7c0f"; ctx.fillRect(0, by - 6, bx + 30, 8);
        ctx.fillStyle = "rgba(14,116,144,.5)"; ctx.fillRect(bx + 60, H * .93, W, H * .07);
        if (state === 0) { push = keyPush || (A.ptr.moved ? Math.max(-1, Math.min(1, (A.ptr.x - W / 2) / (W * .4))) : 0); if (location.hostname === "localhost") window.__wxAng = ang; const wind = Math.sin((t - tStart) / 700) * .0009 + Math.sin((t - tStart) / 1900) * .0007; vel += (ang * 4.4e-7 + wind * 1e-4 - push * 6e-7) * dt; vel *= .99; ang += vel * dt; held = t - tStart;
          if (Math.abs(ang) > .7) { state = 2; endAt = performance.now(); A.noise(.9, .3, "lowpass", 600, 150, 1); A.setChip("oops! tap to try again"); } else if (held > GOAL) { state = 1; endAt = performance.now(); [0, .2, .4].forEach(d => A.chirp(d)); A.setChip("✨ balanced! tap to play again"); } if (Math.random() < .03) A.noise(.12, .06, "band", 300, 200, 3); }
        const fallK = state === 2 ? Math.min(1, (performance.now() - endAt) / 900) : 0;
        ctx.save(); ctx.translate(bx, by); ctx.rotate(ang + Math.sign(ang) * fallK * 1.2); ctx.translate(Math.sign(ang) * fallK * 120, fallK * fallK * H * .3);
        books.forEach((c, i) => { ctx.fillStyle = c; ctx.strokeStyle = "#1f2937"; ctx.lineWidth = 2; const off = Math.sin(i * 2.1) * 10; ctx.fillRect(-bw / 2 + off, -(i + 1) * bh, bw - Math.abs(off), bh - 2); ctx.strokeRect(-bw / 2 + off, -(i + 1) * bh, bw - Math.abs(off), bh - 2); ctx.fillStyle = "rgba(255,255,255,.7)"; ctx.fillRect(-bw / 2 + off + 8, -(i + 1) * bh + 9, bw * .5, 3); });
        em(ctx, "🚗", 0, -books.length * bh - 18, 32); ctx.restore();
        ctx.fillStyle = "#e5e7eb"; ctx.fillRect(W / 2 - 110, H * .1, 220, 14); ctx.fillStyle = "#16a34a"; ctx.fillRect(W / 2 - 110, H * .1, 220 * Math.min(1, held / GOAL), 14);
        if (state === 0) big(ctx, `Keep it steady! ${Math.max(0, Math.ceil((GOAL - held) / 1000))}`, W / 2, H * .18, 24, Math.abs(ang) > .3 ? "#dc2626" : "#0f172a");
        if (state === 1) big(ctx, "Phew! Saved from a precarious spot ✨", W / 2, H * .3, 28, "#16a34a"); if (state === 2) big(ctx, "Oops! That was precarious 😬", W / 2, H * .3, 30, "#b91c1c");
        // help: which way to move, and how hard you are pushing
        if (state === 0) { const topY = by - books.length * bh - 70, dirn = Math.sign(ang), danger = Math.abs(ang) > .35;
          if (Math.abs(ang) > .06) { const ax = bx + dirn * 70; big(ctx, dirn > 0 ? "➡️" : "⬅️", ax, topY, danger ? 54 : 40, "#0f172a"); big(ctx, dirn > 0 ? "move RIGHT!" : "move LEFT!", ax, topY + 40, danger ? 22 : 17, danger ? "#dc2626" : "#0f172a"); }
          const pw = Math.min(W * .7, 420), px0 = W / 2 - pw / 2, py0 = H * .94; ctx.fillStyle = "rgba(255,255,255,.9)"; ctx.fillRect(px0, py0 - 10, pw, 20); ctx.fillStyle = "#94a3b8"; ctx.fillRect(W / 2 - 1, py0 - 14, 2, 28);
          ctx.fillStyle = "#2563eb"; const pl = push * pw / 2; ctx.fillRect(Math.min(W / 2, W / 2 + pl), py0 - 6, Math.abs(pl), 12); em(ctx, "👆", W / 2 + pl, py0 - 22, 30);
          ctx.font = "800 13px system-ui"; ctx.fillStyle = "#334155"; ctx.textAlign = "center"; ctx.fillText("◀ push left", px0 + 50, py0 + 26); ctx.fillText("push right ▶", px0 + pw - 50, py0 + 26); ctx.textAlign = "start";
          if (t - tStart < 4000) big(ctx, "Move the mouse (or your finger, or ← →) the SAME way the books lean", W / 2, H * .26, 17, "#1e3a8a"); }
        ctx.strokeStyle = "rgba(15,23,42,.35)"; ctx.setLineDash([4, 6]); ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, by - books.length * bh - 40); ctx.stroke(); ctx.setLineDash([]); } };
  });

  // 🌱 REJUVENATED: the page turns old, grey and wilted; water and sparkles bring it back young and bright
  Weather.add("rejuvenate,rejuvenated,rejuvenating,refresh,refreshed,refreshing,revive,revived,renew,renewed,restore,restored,invigorated,reborn", { e: "🌱", name: "Rejuvenated", dur: 8000, top: 1 }, A => {
    A.kids().forEach(el => A.ani(el, [{ filter: "none" }, { filter: "grayscale(1) sepia(.6) contrast(.85) brightness(.9)", offset: .3 }, { filter: "grayscale(1) sepia(.6) contrast(.85) brightness(.9)", offset: .45 }, { filter: "saturate(1.4) brightness(1.05)", offset: .7 }, { filter: "none" }], { duration: 8000 }));
    [3.8, 4.1, 4.4].forEach(d => A.chirp(d)); A.noise(1.5, .08, "band", 3000, 5000, 1, 3.6);
    return { frame(t) { const { ctx } = A, W = A.W(), H = A.H(), cx = W / 2, cy = H * .62;
      if (t < 3600) { const k = Math.min(1, t / 2400); ctx.strokeStyle = `rgba(68,64,60,${.5 * k})`; ctx.lineWidth = 1.5; for (let c = 0; c < 8; c++) { ctx.beginPath(); let x = (c * 173) % W, y = (c * 97) % H; ctx.moveTo(x, y); for (let s2 = 0; s2 < 6 * k; s2++) { x += 18 - Math.random() * 36; y += 18; ctx.lineTo(x, y); } ctx.stroke(); } em(ctx, "🥀", cx, cy, 120 * (.7 + .3 * k), .3 * k); if (t > 1500) big(ctx, "old… tired… faded…", W / 2, H * .25, 26, "#57534e"); }
      else { const d = t - 3600; if (d < 900) for (let k = 0; k < 6; k++) em(ctx, "💧", cx + (k - 2.5) * 28, H * .1 + d * .5 + (k % 2) * 30, 26);
        const g = Math.min(1, d / 1200); em(ctx, g < .5 ? "🌱" : "🌹", cx, cy, 70 + g * 70); for (let k = 0; k < 16; k++) { const a = k / 16 * 6.28 + d / 900, r = 60 + g * 120; em(ctx, "✨", cx + Math.cos(a) * r, cy + Math.sin(a) * r * .7, 16 + 6 * Math.sin(d / 200 + k)); }
        if (d > 900) big(ctx, "Rejuvenated! Young and fresh again 🌱", W / 2, H * .25, 28, "#15803d"); } } };
  });

  // 🐹 FUTILE: a hamster runs and runs in its wheel; tap to make it run faster; steps go up, distance stays 0 m
  Weather.add("futile,futility,pointless,useless,in vain,fruitless,hopeless,no use", { e: "🐹", name: "Futile", dur: 14000, capture: 1, top: 1 }, A => {
    let rot = 0, sp = .08, steps = 0, last = 0; A.setChip("tap to make it run faster!");
    return { down() { sp = Math.min(.5, sp + .06); A.plink(0); },
      frame(t) { const { ctx } = A, W = A.W(), H = A.H(), R = Math.min(W, H) * .22, cx = W / 2, cy = H * .52, dt = Math.min(40, t - (last || t)); last = t;
        sp = Math.max(.08, sp * .995); rot += sp * dt * .01; steps += sp * dt * .08;
        ctx.fillStyle = "rgba(254,243,199,.93)"; ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = "#64748b"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx - R * .5, cy + R * 1.25); ctx.moveTo(cx, cy); ctx.lineTo(cx + R * .5, cy + R * 1.25); ctx.stroke();
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(0, 0, R, 0, 7); ctx.stroke(); ctx.lineWidth = 3; for (let k = 0; k < 24; k++) { const a = k / 24 * 6.28; ctx.beginPath(); ctx.moveTo(Math.cos(a) * R * .93, Math.sin(a) * R * .93); ctx.lineTo(Math.cos(a) * R * 1.03, Math.sin(a) * R * 1.03); ctx.stroke(); } for (let k = 0; k < 6; k++) { const a = k / 6 * 6.28; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * R, Math.sin(a) * R); ctx.stroke(); } ctx.restore();
        em(ctx, "🐹", cx, cy + R * .72 - Math.abs(Math.sin(t / (60 / (sp * 4 + .3)))) * 8, R * .55, 0, -1);
        if (sp > .2) for (let k = 0; k < 3; k++) em(ctx, "💦", cx + R * .35 + k * 10, cy + R * .35 - k * 12, 14);
        ctx.fillStyle = "#fff"; ctx.fillRect(16, H * .12, 210, 64); ctx.strokeStyle = "#1f2937"; ctx.strokeRect(16, H * .12, 210, 64); ctx.fillStyle = "#1f2937"; ctx.font = "800 17px system-ui"; ctx.textAlign = "left"; ctx.fillText(`👣 Steps: ${Math.floor(steps)}`, 28, H * .12 + 26); ctx.fillStyle = "#b91c1c"; ctx.fillText("📏 Distance: 0 m", 28, H * .12 + 52); ctx.textAlign = "start";
        if (t > 5000) big(ctx, "Futile: lots of effort… no progress!", W / 2, H * .9, 24, "#7c2d12"); } };
  });

  // 😴 DOZED: the page nods off: eyelids close, Zzz, snoring; then it jolts awake, twice
  Weather.add("doze,dozed,dozes,dozing,nap,napped,napping,drowsy,snooze,snoozed,nod off,nodded off,sleepy,drowsiness", { e: "😴", name: "Dozed", dur: 9500 }, A => {
    const cyc = [[0, 3800], [4300, 8300]]; cyc.forEach(([a, b]) => { A.noise(1.4, .1, "lowpass", 300, 120, 1, (a + 1600) / 1000); A.noise(.25, .3, "band", 1800, 900, 2, b / 1000); });
    A.kids().forEach(el => A.ani(el, [{ transform: "none" }, { transform: "translateY(26px) rotate(1.5deg)", offset: .32 }, { transform: "translateY(36px) rotate(2deg)", offset: .39 }, { transform: "translateY(-10px)", offset: .42 }, { transform: "none", offset: .46 }, { transform: "translateY(28px) rotate(-1.5deg)", offset: .8 }, { transform: "translateY(38px) rotate(-2deg)", offset: .86 }, { transform: "translateY(-12px)", offset: .88 }, { transform: "none" }], { duration: 9500, easing: "ease-in-out" }));
    return { frame(t) { const { ctx } = A, W = A.W(), H = A.H(); let lid = 0, awake = 0;
      cyc.forEach(([a, b]) => { if (t >= a && t < b) lid = Math.min(1, (t - a) / (b - a - 400)); if (t >= b && t < b + 500) awake = 1 - (t - b) / 500; });
      const lh = H / 2 * Math.min(1, lid * 1.05); ctx.fillStyle = "#0f172a"; ctx.fillRect(0, 0, W, lh); ctx.fillRect(0, H - lh, W, lh);
      if (lid > .5) for (let k = 0; k < 3; k++) big(ctx, "Z", W * .62 + k * 30, H * .45 - k * 34 - ((t / 20) % 30), 26 + k * 10, "#94a3b8");
      if (awake > 0) big(ctx, "!", W / 2, H * .4, 120, "#dc2626"); } };
  });

  // 🦢 SERENE: a calm lake at sunset; a swan glides, slow ripples; the page breathes slowly
  Weather.add("serene,serenity,peaceful,tranquil,tranquility,calm,calmly,soothing,placid", { e: "🦢", name: "Serene", dur: 11000 }, A => {
    A.kids().forEach(el => A.ani(el, [{ transform: "scale(1)" }, { transform: "scale(1.012)" }, { transform: "scale(1)" }], { duration: 3600, iterations: 3, easing: "ease-in-out" })); A.noise(11, .06, "lowpass", 380, 300, 1);
    return { frame(t, life, fade) { const { ctx } = A, W = A.W(), H = A.H(), hz = H * .55;
      const sky = ctx.createLinearGradient(0, 0, 0, hz); sky.addColorStop(0, "rgba(167,139,250,.75)"); sky.addColorStop(1, "rgba(253,186,116,.8)"); ctx.fillStyle = sky; ctx.fillRect(0, 0, W, hz);
      ctx.fillStyle = "rgba(251,146,60,.9)"; ctx.beginPath(); ctx.arc(W / 2, hz, 60, Math.PI, 0); ctx.fill();
      ctx.fillStyle = "rgba(76,29,149,.55)"; ctx.beginPath(); ctx.moveTo(0, hz); ctx.lineTo(W * .2, hz - 50); ctx.lineTo(W * .35, hz - 20); ctx.lineTo(W * .55, hz - 70); ctx.lineTo(W * .8, hz - 25); ctx.lineTo(W, hz - 45); ctx.lineTo(W, hz); ctx.fill();
      const lake = ctx.createLinearGradient(0, hz, 0, H); lake.addColorStop(0, "rgba(251,146,60,.6)"); lake.addColorStop(1, "rgba(30,58,138,.8)"); ctx.fillStyle = lake; ctx.fillRect(0, hz, W, H - hz);
      ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 2; for (let k = 0; k < 12; k++) { const y = hz + 20 + k * (H - hz) / 12, w = 40 + k * 12, x = (W / 2) + Math.sin(t / 2000 + k) * 30; ctx.beginPath(); ctx.moveTo(x - w, y); ctx.lineTo(x + w, y); ctx.stroke(); }
      const sx = -60 + (W + 120) * (t / 11000), sy = hz + (H - hz) * .4; em(ctx, "🦢", sx, sy, 60, 0, -1); for (let r = 0; r < 3; r++) { const rr = ((t / 25 + r * 30) % 90); ctx.strokeStyle = `rgba(255,255,255,${.4 * (1 - rr / 90)})`; ctx.beginPath(); ctx.ellipse(sx - 20, sy + 22, rr, rr * .25, 0, 0, 7); ctx.stroke(); }
      big(ctx, "Serene… breathe in… breathe out…", W / 2, H * .15, 22, "#4c1d95"); } };
  });

  // 🎁 CURIOSITY: a mystery box shakes with question marks; tap it three times to open it, and a surprise pops out
  Weather.add("curiosity,curious,curiously,intriguing,intrigued,intrigue,mystery,mysterious,inquisitive,wonder,wondered,wondering", { e: "🎁", name: "Curiosity", dur: 25000, capture: 1, top: 1 }, A => {
    const SUR = ["🦄", "🐣", "🚀", "🧞", "🐉", "🎈", "🦖", "🌈"]; let taps = 0, openAt = 0, shake = 0, prize = SUR[Math.floor(Math.random() * SUR.length)]; const bits = [];
    A.setChip("tap the box 3 times… 👀");
    return { down() { if (openAt) return; taps++; shake = 1; A.noise(.15, .2, "band", 600 + taps * 200, 300, 2); if (taps >= 3) { openAt = performance.now(); confetti(bits, A.W() / 2, A.H() * .55, 80); [0, .15, .3, .45].forEach(d => A.chirp(d)); A.setChip("surprise! 🎉"); } else A.setChip(`${3 - taps} more…`); },
      frame(t) { const { ctx } = A, W = A.W(), H = A.H(), cx = W / 2, cy = H * .58, S = Math.min(W, H) * .3; shake = Math.max(0, shake - .05);
        ctx.fillStyle = "rgba(30,27,75,.85)"; ctx.fillRect(0, 0, W, H);
        for (let k = 0; k < 7; k++) { const a = k / 7 * 6.28 + t / 1500, r = S * (.85 + .1 * Math.sin(t / 300 + k)); ctx.save(); ctx.globalAlpha = openAt ? .2 : .9; big(ctx, "?", cx + Math.cos(a) * r, cy + Math.sin(a) * r * .7 - S * .1, 30 + 8 * Math.sin(t / 400 + k), "#a78bfa"); ctx.restore(); }
        const wob = openAt ? 0 : Math.sin(t / 60) * (.03 + shake * .2 + taps * .03);
        if (!openAt) em(ctx, "🎁", cx, cy, S, wob);
        else { const d = performance.now() - openAt, k = Math.min(1, d / 600); em(ctx, "📦", cx, cy + S * .15, S * .9); em(ctx, prize, cx, cy - k * S * .55, S * (.3 + .7 * k), Math.sin(d / 200) * .1); if (d > 500) big(ctx, "Surprise! Curiosity pays off 🎉", W / 2, H * .22, 26, "#4c1d95"); }
        drawBits(ctx, bits); if (!openAt) big(ctx, "What's inside? 🤔", W / 2, H * .22, 26, "#4c1d95"); } };
  });

  // 🏚️ DETERIORATING: a time-lapse of a house over 100 years; it fades, cracks, breaks and crumbles; then drag the time slider to travel back and forth
  Weather.add("deteriorate,deteriorated,deteriorates,deteriorating,deterioration,decay,decayed,decaying,crumble,crumbled,crumbling,dilapidated,run-down,rundown,ruin,ruined,ruins,derelict,weathered,worn out,neglected,dereliction", { e: "🏚️", name: "Deteriorating", dur: 60000, track: 1, capture: 1, top: 1 }, A => {
    let rs = 7; const rnd = () => (rs = (rs * 16807) % 2147483647) / 2147483647;
    const cracks = Array.from({ length: 9 }, () => { const pts = [[rnd(), rnd() * .5]]; for (let k = 0; k < 7; k++) { const [x, y] = pts[pts.length - 1]; pts.push([x + (rnd() - .5) * .12, y + rnd() * .09]); } return { pts, at: .1 + rnd() * .6 }; });
    const tiles = Array.from({ length: 48 }, (_, i) => ({ i, gone: .35 + rnd() * .6 })), peel = Array.from({ length: 12 }, () => ({ x: rnd(), y: rnd(), r: .03 + rnd() * .05, at: .15 + rnd() * .5 })), weeds = Array.from({ length: 26 }, () => ({ x: rnd(), h: .5 + rnd() * .5, at: rnd() * .6 })), planks = Array.from({ length: 12 }, () => ({ at: .35 + rnd() * .6, dir: rnd() < .5 ? -1 : 1 }));
    const AUTO = 9000; let dec = 0, drag = 0, auto = 1, lastTick = 0;
    const ease = x => Math.max(0, Math.min(1, x)), mix = (a, b, k) => a.map((v, i) => Math.round(v + (b[i] - v) * k)), rgb = c => `rgb(${c[0]},${c[1]},${c[2]})`;
    const slider = () => { const W = A.W(), H = A.H(), w = Math.min(W * .8, 520); return { x0: W / 2 - w / 2, w, y: H * .93 }; };
    const setFrom = x => { const sl = slider(); dec = ease((x - sl.x0) / sl.w); };
    A.setChip("⏳ time is passing…");
    return { down(x, y) { const sl = slider(); if (Math.abs(y - sl.y) < 40) { drag = 1; auto = 0; setFrom(x); } },
      move(x) { if (drag) setFrom(x); }, up() { drag = 0; },
      frame(t) { const { ctx } = A, W = A.W(), H = A.H(); if (auto) { dec = ease(t / AUTO); if (t > AUTO + 600) { auto = 0; A.setChip("drag the time slider ⏳"); } }
        const year = Math.round(1925 + dec * 100); if (Math.floor(dec * 20) !== lastTick) { lastTick = Math.floor(dec * 20); A.noise(.05, .03, "band", 3000, 3000, 6); if (dec > .5 && Math.random() < .5) A.noise(.2, .08, "lowpass", 500, 200, 1); }
        // time-lapse sky: days fly by while it plays
        const day = auto ? (Math.sin(t / 260) + 1) / 2 : .85, sky = mix([20, 24, 60], [125, 190, 240], day); ctx.fillStyle = rgb(sky); ctx.fillRect(0, 0, W, H);
        if (auto) { const a = (t / 260) % (Math.PI * 2); em(ctx, Math.sin(t / 260) > 0 ? "☀️" : "🌙", W / 2 + Math.cos(a) * W * .45, H * .45 - Math.abs(Math.sin(a)) * H * .35, 34); }
        const gy = H * .78, gr = mix([74, 160, 70], [120, 110, 60], dec); ctx.fillStyle = rgb(gr); ctx.fillRect(0, gy, W, H - gy);
        // the house
        const S = Math.min(W, H) * .5, hx = W / 2 - S * .55, hw = S * 1.1, hh = S * .62, hy = gy - hh;
        const wall = mix([253, 230, 138], [140, 128, 110], dec), roof = mix([220, 38, 38], [87, 63, 55], dec), sag = ease((dec - .88) / .12);
        ctx.fillStyle = rgb(wall); ctx.fillRect(hx, hy, hw, hh); ctx.strokeStyle = "#1f2937"; ctx.lineWidth = 3; ctx.strokeRect(hx, hy, hw, hh);
        peel.forEach(p => { const k = ease((dec - p.at) / .25); if (!k) return; ctx.fillStyle = `rgba(214,204,186,${.9 * k})`; ctx.beginPath(); ctx.ellipse(hx + p.x * hw, hy + p.y * hh, p.r * hw * k, p.r * hw * .6 * k, p.x * 3, 0, 7); ctx.fill(); });
        // windows: shiny → cracked → smashed; a shutter comes loose
        [[.12, .18], [.66, .18]].forEach(([fx, fy], wi) => { const x = hx + fx * hw, y = hy + fy * hh, ww = hw * .22, wh = hh * .3; ctx.fillStyle = dec < .6 ? rgb(mix([147, 197, 253], [100, 116, 139], dec / .6)) : "#1e293b"; ctx.fillRect(x, y, ww, wh); ctx.strokeStyle = "#7c2d12"; ctx.lineWidth = 4; ctx.strokeRect(x, y, ww, wh); ctx.beginPath(); ctx.moveTo(x + ww / 2, y); ctx.lineTo(x + ww / 2, y + wh); ctx.moveTo(x, y + wh / 2); ctx.lineTo(x + ww, y + wh / 2); ctx.stroke();
          if (dec > .3 && dec <= .6) { ctx.strokeStyle = "rgba(255,255,255,.9)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x + ww * .3, y + wh * .3); ctx.lineTo(x + ww * .1, y + wh * .1); ctx.moveTo(x + ww * .3, y + wh * .3); ctx.lineTo(x + ww * .45, y + wh * .05); ctx.moveTo(x + ww * .3, y + wh * .3); ctx.lineTo(x + ww * .15, y + wh * .5); ctx.stroke(); }
          if (dec > .6) { ctx.fillStyle = "rgba(203,213,225,.8)"; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + ww * .4, y); ctx.lineTo(x + ww * .15, y + wh * .35); ctx.lineTo(x, y + wh * .5); ctx.fill(); }
          const sh = ease((dec - .45) / .3) * (wi ? 1 : 0); ctx.save(); ctx.translate(x + ww + 2, y); ctx.rotate(sh * .9); ctx.fillStyle = rgb(mix([22, 101, 52], [80, 80, 60], dec)); ctx.fillRect(0, 0, ww * .35, wh); ctx.restore(); });
        // door
        const door = ease((dec - .65) / .3); ctx.save(); ctx.translate(hx + hw * .42, gy); ctx.rotate(-door * .18); ctx.fillStyle = rgb(mix([120, 53, 15], [90, 80, 70], dec)); ctx.fillRect(0, -hh * .5, hw * .16, hh * .5); ctx.strokeStyle = "#1f2937"; ctx.lineWidth = 2; ctx.strokeRect(0, -hh * .5, hw * .16, hh * .5); ctx.fillStyle = "#facc15"; ctx.beginPath(); ctx.arc(hw * .13, -hh * .25, 3, 0, 7); ctx.fill(); ctx.restore();
        // cracks spread
        ctx.strokeStyle = "rgba(41,37,36,.85)"; ctx.lineWidth = 2; cracks.forEach(c => { const k = ease((dec - c.at) / .3); if (!k) return; const n = Math.max(2, Math.floor(c.pts.length * k)); ctx.beginPath(); c.pts.slice(0, n).forEach(([px, py], i) => { const X = hx + px * hw, Y = hy + py * hh; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); ctx.stroke(); });
        // ivy creeps up
        const ivy = ease((dec - .35) / .5); if (ivy) { ctx.strokeStyle = "#166534"; ctx.lineWidth = 3; [[hx + 6, 1], [hx + hw - 6, -1]].forEach(([vx, dirv]) => { ctx.beginPath(); ctx.moveTo(vx, gy); for (let k = 0; k <= 20 * ivy; k++) ctx.lineTo(vx + Math.sin(k * .9) * 10 * dirv + k * 2 * dirv, gy - k * hh / 20); ctx.stroke(); for (let k = 2; k <= 20 * ivy; k += 2) em(ctx, "🍃", vx + Math.sin(k * .9) * 10 * dirv + k * 2 * dirv, gy - k * hh / 20, 14); }); }
        // roof: tiles fall away, chimney leans, roof sags at the end
        const rx0 = hx - S * .08, rx1 = hx + hw + S * .08, apex = hy - S * .4 + sag * S * .22;
        ctx.fillStyle = rgb(roof); ctx.beginPath(); ctx.moveTo(rx0, hy); ctx.lineTo(W / 2, apex); ctx.lineTo(rx1, hy); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#1f2937"; ctx.lineWidth = 3; ctx.stroke();
        ctx.fillStyle = "rgba(15,23,42,.85)"; tiles.forEach(tl => { if (dec < tl.gone) return; const row = Math.floor(tl.i / 8), col = tl.i % 8, ty = hy - (row + .5) * (hy - apex) / 6, half = (rx1 - rx0) / 2 * (1 - (row + .5) / 6), tx = W / 2 - half + (col + .5) * (2 * half / 8); ctx.fillRect(tx - 6, ty - 5, 12, 9); });
        const lean = ease((dec - .7) / .25); ctx.save(); ctx.translate(W / 2 + S * .25, hy - S * .2 + sag * S * .1); ctx.rotate(lean * .3); ctx.fillStyle = rgb(mix([185, 28, 28], [100, 90, 85], dec)); ctx.fillRect(-12, -S * .2, 24, S * .2); ctx.strokeStyle = "#1f2937"; ctx.strokeRect(-12, -S * .2, 24, S * .2);
        if (dec < .6) for (let k = 0; k < 3; k++) { ctx.fillStyle = `rgba(203,213,225,${.6 - k * .15})`; ctx.beginPath(); ctx.arc(Math.sin(t / 300 + k) * 6, -S * .24 - k * 14 - (t / 30 % 14), 7 + k * 3, 0, 7); ctx.fill(); } ctx.restore();
        // fence planks fall; weeds grow
        for (let k = 0; k < planks.length; k++) { const fx = hx + hw + S * .12 + k * 12, fk = ease((dec - planks[k].at) / .15); if (fx > W - 10) break; ctx.save(); ctx.translate(fx, gy); ctx.rotate(planks[k].dir * fk * 1.45); ctx.fillStyle = rgb(mix([250, 250, 250], [120, 110, 95], dec)); ctx.fillRect(-4, -S * .2, 8, S * .2); ctx.restore(); }
        weeds.forEach(wd => { const k = ease((dec - wd.at) / .35); if (!k) return; const x = wd.x * W; ctx.strokeStyle = "#3f6212"; ctx.lineWidth = 2; for (let b = -1; b <= 1; b++) { ctx.beginPath(); ctx.moveTo(x, gy + 4); ctx.quadraticCurveTo(x + b * 6, gy - 20 * k * wd.h, x + b * 12, gy - 38 * k * wd.h); ctx.stroke(); } });
        if (dec > .85) { const rx = hx + hw * (.2 + .6 * ((t / 4000) % 1)); em(ctx, "🐀", rx, gy - 8, 26, 0, -1); }
        // year + slider
        big(ctx, String(year), W / 2, H * .17, 54, dec > .7 ? "#7c2d12" : "#1e3a8a"); big(ctx, dec < .05 ? "brand new" : dec > .95 ? "100 years later… deteriorated!" : `${year - 1925} years later…`, W / 2, H * .17 + 42, 20, "#334155");
        const sl = slider(); ctx.fillStyle = "rgba(255,255,255,.9)"; ctx.fillRect(sl.x0, sl.y - 7, sl.w, 14); ctx.fillStyle = "#b45309"; ctx.fillRect(sl.x0, sl.y - 7, sl.w * dec, 14); ctx.strokeStyle = "#1f2937"; ctx.lineWidth = 2; ctx.strokeRect(sl.x0, sl.y - 7, sl.w, 14);
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(sl.x0 + sl.w * dec, sl.y, 14, 0, 7); ctx.fill(); ctx.stroke(); em(ctx, "⏳", sl.x0 + sl.w * dec, sl.y, 16);
        ctx.font = "800 13px system-ui"; ctx.fillStyle = "#1f2937"; ctx.textAlign = "left"; ctx.fillText("1925", sl.x0, sl.y - 14); ctx.textAlign = "right"; ctx.fillText("2025", sl.x0 + sl.w, sl.y - 14); ctx.textAlign = "start";
        if (!auto && t < AUTO + 4500) big(ctx, "Drag ⏳ to travel in time", W / 2, sl.y - 36, 18, "#1e3a8a"); } };
  });

  // 📦 RELOCATED: drag each thing to its new home (the dashed shadow); all moved = 🎉
  Weather.add("relocate,relocated,relocates,relocating,relocation,move house,moved house,rearrange,rearranged", { e: "📦", name: "Relocate", dur: 30000, track: 1, capture: 1, top: 1 }, A => {
    const W = A.W(), H = A.H(), S = Math.min(W, H) * .11, ITEMS = ["🪴", "📚", "🧸", "🛋️"], bits = [];
    const objs = ITEMS.map((e, i) => ({ e, x: W * .18, y: H * (.25 + i * .17), hx: W * .78 + (i % 2 ? S * .4 : -S * .4), hy: H * (.25 + ((i + 2) % 4) * .17), done: 0 }));
    let held = null, ok = 0, finishedAt = 0; A.setChip("0 / 4 moved");
    return { down(x, y) { held = objs.find(o => !o.done && Math.hypot(o.x - x, o.y - y) < S * .7) || null; if (held) A.plink(0); },
      move(x, y) { if (held) { held.x = x; held.y = y; } },
      up() { if (!held) return; if (Math.hypot(held.x - held.hx, held.y - held.hy) < S * .7) { held.x = held.hx; held.y = held.hy; held.done = 1; ok++; A.chirp(0); confetti(bits, held.x, held.y, 16); A.setChip(`${ok} / 4 moved`); if (ok === 4) { finishedAt = performance.now(); A.setChip("🎉 all relocated!"); } } held = null; },
      frame() { const { ctx } = A;
        ctx.fillStyle = "rgba(255,255,255,.82)"; ctx.fillRect(0, 0, A.W(), A.H());
        ctx.fillStyle = "#e0f2fe"; ctx.fillRect(A.W() * .6, A.H() * .12, A.W() * .36, A.H() * .78); ctx.fillStyle = "#fef3c7"; ctx.fillRect(A.W() * .04, A.H() * .12, A.W() * .3, A.H() * .78);
        big(ctx, "📍 old place", A.W() * .19, A.H() * .08, 20, "#92400e"); big(ctx, "🏠 new place", A.W() * .78, A.H() * .08, 20, "#075985");
        ctx.save(); ctx.lineWidth = 2; ctx.strokeStyle = "#94a3b8"; ctx.setLineDash([7, 6]); objs.forEach(o => { ctx.beginPath(); ctx.arc(o.hx, o.hy, S * .62, 0, 7); ctx.stroke(); ctx.globalAlpha = o.done ? 0 : .22; em(ctx, o.e, o.hx, o.hy, S); ctx.globalAlpha = 1; }); ctx.restore();
        objs.forEach(o => em(ctx, o.e, o.x, o.y, S * (o === held ? 1.15 : 1)));
        if (!held && ok < 4) em(ctx, "👆", A.ptr.x, A.ptr.y + 18, 34); drawBits(ctx, bits);
        if (finishedAt) big(ctx, "Relocated! 🎉", A.W() / 2, A.H() * .5, 52, "#16a34a"); } };
  });

  // 🦸 HEROIC: an original caped hero zooms in, lands with a thud, strikes a proud pose; stars and cheers
  Weather.add("heroic,hero,heroes,heroine,heroism,brave,bravery,courage,courageous,fearless,valiant", { e: "🦸", name: "Hero", dur: 7000, top: 1 }, A => {
    const bits = []; let landed = 0; A.noise(1.1, .25, "band", 600, 2400, 1, .1);
    return { frame(t, life) { const { ctx } = A, W = A.W(), H = A.H(), S = Math.min(W, H) * .32, gx = W / 2, gy = H * .62;
      let x, y, rot = 0; if (t < 1200) { const k = t / 1200; x = -S + (gx + S) * k; y = H * .15 + (gy - H * .15) * k * k; rot = .5 - k * .5; ctx.strokeStyle = "rgba(59,130,246,.5)"; ctx.lineWidth = 6; for (let s = 1; s <= 4; s++) { ctx.beginPath(); ctx.moveTo(x - s * 40, y - 20 + s * 8); ctx.lineTo(x - s * 40 - 60, y - 20 + s * 8); ctx.stroke(); } }
      else { x = gx; y = gy; if (!landed) { landed = 1; A.boom(0); shakeKids(A, 0, 10, 400); confetti(bits, gx, gy - S * .4, 60); [0, .25, .5, .75].forEach(d => A.chirp(d)); } }
      if (t > 1200) { const pr = Math.min(1, (t - 1200) / 400); ctx.save(); ctx.globalAlpha = .9 * pr; for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2 + t / 2000, r0 = S * .55, r1 = S * (.9 + .15 * Math.sin(t / 200 + i)); ctx.strokeStyle = i % 2 ? "#facc15" : "#f97316"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r0, y - S * .2 + Math.sin(a) * r0); ctx.lineTo(x + Math.cos(a) * r1, y - S * .2 + Math.sin(a) * r1); ctx.stroke(); } ctx.restore();
        ctx.save(); ctx.fillStyle = "#dc2626"; ctx.beginPath(); const wv = Math.sin(t / 160) * 18; ctx.moveTo(x - S * .18, y - S * .42); ctx.quadraticCurveTo(x - S * .55 + wv, y - S * .1, x - S * .62 + wv, y + S * .38); ctx.lineTo(x + S * .1, y + S * .3); ctx.quadraticCurveTo(x, y - S * .1, x + S * .12, y - S * .42); ctx.fill(); ctx.restore(); }
      em(ctx, "🦸", x, y - S * .1, S, rot); if (t > 1500) { big(ctx, "HERO!", W / 2, H * .18, 64, "#1d4ed8"); [0, 1, 2, 3, 4].forEach(i => em(ctx, "⭐", W / 2 + (i - 2) * 56, H * .18 + 50 + Math.sin(t / 200 + i) * 6, 28)); } drawBits(ctx, bits); } };
  });

  // 🚁 RESCUE: people wave for help on a flooded roof; fly the helicopter over one and tap to drop the rope; they climb up, saved!
  Weather.add("rescue,rescued,rescues,rescuing,rescuer,aid,aided,aiding,save,saved,saving,lifeguard", { e: "🚁", name: "Rescue", dur: 30000, track: 1, capture: 1, top: 1 }, A => {
    const W = A.W(), H = A.H(), pp = [.22, .5, .78].map((f, i) => ({ x: W * f, y: H * .74, e: ["🙋", "🙋‍♂️", "🧒"][i], state: 0, k: 0 })), heli = { x: W / 2, y: H * .2 }, bits = []; let rope = null, saved = 0, done = 0;
    A.setChip("move the 🚁, tap to drop the rope"); A.noise(30, .07, "band", 140, 200, 3);
    return { down(x) { if (rope || done) return; rope = { x: heli.x, len: 0, who: pp.find(p => !p.state && Math.abs(p.x - heli.x) < Math.min(W, H) * .09) || null, phase: 0 }; A.plink(0); },
      frame(t) { const { ctx } = A, S = Math.min(W, H) * .12;
        const sky = ctx.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, "rgba(125,170,215,.92)"); sky.addColorStop(1, "rgba(190,215,235,.92)"); ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#475569"; pp.forEach(p => ctx.fillRect(p.x - S * .9, p.y + S * .35, S * 1.8, H)); ctx.fillStyle = "#7f1d1d"; pp.forEach(p => { ctx.beginPath(); ctx.moveTo(p.x - S, p.y + S * .4); ctx.lineTo(p.x, p.y - S * .05); ctx.lineTo(p.x + S, p.y + S * .4); ctx.fill(); });
        const wl = H * .82 + Math.sin(t / 600) * 6; ctx.fillStyle = "rgba(37,99,235,.75)"; ctx.beginPath(); ctx.moveTo(0, H); for (let x = 0; x <= W; x += 20) ctx.lineTo(x, wl + Math.sin(x / 40 + t / 300) * 6); ctx.lineTo(W, H); ctx.fill();
        if (!rope) heli.x += (A.ptr.x - heli.x) * .08;
        pp.forEach(p => { if (p.state === 2) return; const wave = p.state ? 0 : Math.sin(t / 180 + p.x) * .25; em(ctx, p.e, p.x, p.y - (p.state ? p.k : 0), S, wave); if (!p.state && Math.floor(t / 700 + p.x) % 3 === 0) bubble(ctx, "Help!", p.x, p.y - S * .95, 18); });
        if (rope) { const ropeTop = heli.y + S * .4, target = rope.who ? rope.who.y - S * .3 - ropeTop : H * .45;
          if (rope.phase === 0) { rope.len += 9; if (rope.len >= target) { rope.len = target; rope.phase = rope.who ? 1 : 2; if (rope.who) { rope.who.state = 1; A.chirp(0); } } }
          else if (rope.phase === 1) { rope.len -= 4; rope.who.k += 4; if (rope.len <= 0) { rope.who.state = 2; saved++; confetti(bits, heli.x, heli.y, 30); A.setChip(`saved ${saved} / 3`); rope = null; if (saved === 3) { done = 1; A.setChip("🎉 everyone is safe!"); } } }
          else { rope.len -= 12; if (rope.len <= 0) rope = null; }
          if (rope) { ctx.strokeStyle = "#a16207"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(rope.x, ropeTop); ctx.lineTo(rope.x + Math.sin(t / 200) * 4, ropeTop + rope.len); ctx.stroke(); em(ctx, "🛟", rope.x, ropeTop + rope.len, 26); } }
        em(ctx, "🚁", heli.x, heli.y + Math.sin(t / 150) * 4, S * 1.4, 0, -1);
        ctx.strokeStyle = "rgba(30,30,30,.5)"; ctx.lineWidth = 3; const bl = S * .9 * Math.cos(t / 25); ctx.beginPath(); ctx.moveTo(heli.x - bl, heli.y - S * .5); ctx.lineTo(heli.x + bl, heli.y - S * .5); ctx.stroke();
        if (!rope && !done) { ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.setLineDash([5, 7]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(heli.x, heli.y + S * .5); ctx.lineTo(heli.x, H * .7); ctx.stroke(); ctx.setLineDash([]); }
        drawBits(ctx, bits); if (done) big(ctx, "Rescued! 🎉", W / 2, H * .45, 54, "#15803d"); } };
  });

  // 🚀 LAUNCH: 5…4…3…2…1, fire and huge smoke clouds, the page shakes, LIFT OFF and the rocket flies away into space
  Weather.add("launch,launched,launches,launching,liftoff,lift off,lift-off,blast off,blastoff,rocket,rockets,takeoff,take off", { e: "🚀", name: "Launch", dur: 11000, top: 1 }, A => {
    const smoke = [], T0 = 5000; [0, 1, 2, 3, 4].forEach(i => A.plink(i));
    setTimeout(() => { try { A.noise(5.5, .5, "lowpass", 260, 90, 1); A.boom(0); } catch (e) {} shakeKids(A, 0, 7, 2600); }, T0);
    return { frame(t, life) { const { ctx } = A, W = A.W(), H = A.H(), S = Math.min(W, H) * .24, gx = W / 2, pad = H * .86;
      const sky = Math.min(1, Math.max(0, (t - T0 - 1500) / 3000)); ctx.fillStyle = `rgba(10,15,40,${.15 + sky * .7})`; ctx.fillRect(0, 0, W, H);
      if (sky > .3) for (let i = 0; i < 60; i++) { ctx.fillStyle = `rgba(255,255,255,${(sky - .3) * (.5 + .5 * Math.sin(i * 7 + t / 300))})`; ctx.fillRect((i * 137) % W, (i * 89) % (H * .8), 2, 2); }
      ctx.fillStyle = "#334155"; ctx.fillRect(gx - S * .7, pad, S * 1.4, H - pad); ctx.fillStyle = "#64748b"; ctx.fillRect(gx + S * .45, pad - S * 1.3, 12, S * 1.3);
      const up = t < T0 ? 0 : Math.pow((t - T0) / 1000, 2.2) * 60, rx = gx + (t > T0 + 2000 ? Math.sin((t - T0) / 900) * 10 : 0), ry = pad - S * .55 - up, scale = t > T0 + 2500 ? Math.max(.15, 1 - (t - T0 - 2500) / 4000) : 1;
      if (t > T0 - 1500) { const n = t < T0 ? 2 : 9; for (let k = 0; k < n; k++) smoke.push({ x: gx + (Math.random() - .5) * S * .5, y: pad - 6 - Math.random() * 10, vx: (Math.random() - .5) * (t < T0 ? 3 : 16), vy: -Math.random() * (t < T0 ? 1 : 3), r: 16 + Math.random() * 20, g: 1.6 + Math.random() * 1.8, a: .95, c: 150 + Math.floor(Math.random() * 70) }); }
      for (let i = smoke.length - 1; i >= 0; i--) { const p = smoke[i]; p.x += p.vx; p.y += p.vy; p.vx *= .97; p.vy *= .99; p.r += p.g * (p.r < 90 ? 1 : .2); p.a -= .0035; if (p.a <= 0) { smoke.splice(i, 1); continue; } ctx.fillStyle = `rgba(${p.c},${p.c},${p.c + 6},${p.a * .85})`; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill(); } if (smoke.length > 900) smoke.splice(0, smoke.length - 900);
      if (t > T0 - 300 && ry > -S * 2) { ctx.save(); ctx.translate(rx, ry + S * .5 * scale); for (let f = 0; f < 3; f++) { const fl = S * (.5 + Math.random() * .35) * (1 + Math.min(1, up / 200)) * scale, g = ctx.createLinearGradient(0, 0, 0, fl); g.addColorStop(0, "#fff7ae"); g.addColorStop(.35, "#fb923c"); g.addColorStop(1, "rgba(220,38,38,0)"); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-S * .13 * scale, 0); ctx.quadraticCurveTo(0, fl * 1.1, S * .13 * scale, 0); ctx.fill(); } ctx.restore(); }
      if (ry > -S * 2) em(ctx, "🚀", rx, ry, S * scale, -Math.PI / 4);
      if (t < T0) { const n = 5 - Math.floor(t / 1000), k = (t % 1000) / 1000; ctx.save(); ctx.globalAlpha = 1 - k * .6; big(ctx, String(n), W / 2, H * .3, 120 * (1.3 - k * .3), "#dc2626"); ctx.restore(); }
      else if (t < T0 + 1800) big(ctx, "LIFT OFF!", W / 2, H * .3, 66, "#ea580c"); } };
  });

  // 🤫 SILENT: someone walks to the middle, finger on lips, "Shhh…"; the page goes quiet and still
  Weather.add("silent,silence,silently,quiet,quietly,hush,hushed,shush,shh,mute,muted", { e: "🤫", name: "Shhh", dur: 6500, top: 1 }, A => {
    A.noise(1.4, .1, "band", 5200, 4200, 2, 1.3);
    A.kids().forEach(el => A.ani(el, [{ filter: "none", opacity: 1 }, { filter: "grayscale(.9) blur(1px)", opacity: .45, offset: .3 }, { filter: "grayscale(.9) blur(1px)", opacity: .45, offset: .85 }, { filter: "none", opacity: 1 }], { duration: 6500 }));
    return { frame(t) { const { ctx } = A, W = A.W(), H = A.H(), S = Math.min(W, H) * .42, k = Math.min(1, t / 1100), x = -S + (W / 2 + S) * (1 - Math.pow(1 - k, 3)), bob = k < 1 ? Math.abs(Math.sin(t / 110)) * 10 : 0;
      em(ctx, k < 1 ? "🚶" : "🤫", x, H * .5 - bob, S); if (t > 1300 && t < 5800) { const n = Math.floor((t - 1300) / 400) % 4; bubble(ctx, "Shhh" + ".".repeat(n), x + S * .45, H * .5 - S * .55, 30); } } };
  });

  // 🤧 ALLERGIC: someone sniffs a flower, pollen floats up their nose… ah… ah… ACHOO! and the page gets blown away
  Weather.add("allergic,allergy,allergies,sneeze,sneezed,sneezes,sneezing,achoo,pollen,hay fever,hayfever,itchy nose", { e: "🤧", name: "Achoo", dur: 7000, top: 1 }, A => {
    const pollen = [], spray = []; const SN = 4200;
    [2200, 3000].forEach(ms => A.noise(.45, .12, "band", 600, 1500, 2, ms / 1000)); A.noise(.5, .6, "band", 3500, 900, 1, SN / 1000);
    A.kids().forEach(el => A.ani(el, [{ transform: "none" }, { transform: "translateX(70px) rotate(3deg)", offset: .3 }, { transform: "translateX(-10px)", offset: .7 }, { transform: "none" }], { duration: 900, delay: SN, easing: "ease-out" }));
    return { frame(t) { const { ctx } = A, W = A.W(), H = A.H(), S = Math.min(W, H) * .3, fx = W * .3, fy = H * .55;
      const face = t < 1600 ? "😊" : t < 2200 ? "😌" : t < SN - 200 ? (Math.floor(t / 300) % 2 ? "😖" : "😫") : t < SN + 1400 ? "🤧" : "😅";
      em(ctx, "🌸", fx + S * .65, fy + S * .1, S * .45, Math.sin(t / 500) * .1);
      if (t > 500 && t < SN) { if (Math.random() < .5) pollen.push({ x: fx + S * .62 + (Math.random() - .5) * 20, y: fy, a: 1 }); }
      pollen.forEach(p => { p.x += (fx + S * .1 - p.x) * .03; p.y += (fy - S * .05 - p.y) * .03 + Math.sin(t / 100 + p.a * 9) * .6; p.a -= .008; ctx.fillStyle = `rgba(250,204,21,${Math.max(0, p.a)})`; ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, 7); ctx.fill(); });
      const lean = t > SN - 600 && t < SN ? -(t - SN + 600) / 600 * .25 : t >= SN && t < SN + 300 ? .35 : 0;
      em(ctx, face, fx, fy, S, lean);
      if (t > 2200 && t < SN) bubble(ctx, t < 3000 ? "ah…" : "ah… ah…", fx - S * .1, fy - S * .75, 24);
      if (t >= SN && t < SN + 60) for (let k = 0; k < 90; k++) spray.push({ x: fx + S * .35, y: fy + S * .05, vx: 6 + Math.random() * 14, vy: (Math.random() - .5) * 8, a: 1, r: 2 + Math.random() * 4 });
      spray.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .12; p.a -= .015; ctx.fillStyle = `rgba(148,200,255,${Math.max(0, p.a)})`; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill(); });
      if (t >= SN && t < SN + 1500) big(ctx, "ACHOO!", W * .64, H * .32, 70, "#0369a1"); } };
  });

  // ✨ GLEAM: a bright shine sweeps across every card and picture, and little sparkles twinkle on their corners
  Weather.add("gleam,gleams,gleamed,gleaming,glint,glinted,glinting,glisten,glistened,glistening,shine,shiny,shimmer,shimmering,sparkle,sparkled,sparkling,glitter,glittering,polished,lustrous", { e: "✨", name: "Gleam", dur: 5500 }, A => {
    const els = [...document.querySelectorAll(".card, .item, img, .btn, h1, h2, .tag, .panel, [class*=chip]")].filter(el => { const b = el.getBoundingClientRect(); return b.bottom > 0 && b.top < innerHeight && b.width > 20 && !el.closest(".wx-chip"); }).slice(0, 40);
    const spark = els.flatMap(el => { const b = el.getBoundingClientRect(); return [[b.left + 4, b.top + 4], [b.right - 4, b.top + 4], [b.right - 4, b.bottom - 4]]; }).map(([x, y], i) => ({ x, y, ph: i * .7 }));
    els.forEach((el, i) => A.ani(el, [{ filter: "brightness(1)" }, { filter: "brightness(1.25) saturate(1.2)", offset: .5 }, { filter: "brightness(1)" }], { duration: 1200, delay: 300 + (el.getBoundingClientRect().left / innerWidth) * 1500 + i * 10, iterations: 2 }));
    [0, .7, 1.4, 2.1, 2.8, 3.5].forEach(d => A.chirp(d));
    return { frame(t) { const { ctx } = A, W = A.W(), H = A.H();
      [0, 1].forEach(rep => { const p = ((t - rep * 2200) / 2000); if (p < 0 || p > 1.2) return; const x = -W * .3 + p * W * 1.6; ctx.save(); ctx.translate(x, H / 2); ctx.rotate(.35); [[160, .35], [60, .9]].forEach(([w, a]) => { const g = ctx.createLinearGradient(-w, 0, w, 0); g.addColorStop(0, "rgba(255,255,240,0)"); g.addColorStop(.5, `rgba(255,255,240,${a})`); g.addColorStop(1, "rgba(255,255,240,0)"); ctx.fillStyle = g; ctx.fillRect(-w, -H, w * 2, H * 2); }); ctx.restore(); });
      spark.forEach(s => { const k = Math.max(0, Math.sin(t / 260 + s.ph)); if (k < .2) return; const r = 18 * k; ctx.save(); ctx.translate(s.x, s.y); ctx.rotate(t / 600); ctx.fillStyle = `rgba(255,236,140,${k})`; ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rr = i % 2 ? r * .3 : r; ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } ctx.fill(); ctx.restore(); }); } };
  });

  // 🐁 SCAMPERING: little mice and squirrels scurry across the page in quick zigzags and run away from your finger
  Weather.add("scamper,scampers,scampered,scampering,scurry,scurries,scurried,scurrying,dart,darted,darting,skitter,skittered,scuttle,scuttled", { e: "🐁", name: "Little animals", dur: 9000, track: 1 }, A => {
    const W = A.W(), H = A.H(), crit = Array.from({ length: 9 }, (_, i) => ({ e: ["🐁", "🐿️", "🦎", "🐁", "🐇"][i % 5], x: Math.random() < .5 ? -40 : W + 40, y: H * (.15 + Math.random() * .75), tx: Math.random() * W, ty: H * (.1 + Math.random() * .8), wait: i * 250, v: 6 + Math.random() * 5, f: 1 }));
    const tick = () => { if (A.ptr && Math.random() < .3) A.noise(.05, .05, "band", 5000, 6000, 4); }; const iv = setInterval(tick, 120);
    return { stop() { clearInterval(iv); },
      frame(t, life) { const { ctx } = A;
        crit.forEach(c => { if (t < c.wait) return; const fleeing = Math.hypot(A.ptr.x - c.x, A.ptr.y - c.y) < 110;
          if (fleeing) { const a = Math.atan2(c.y - A.ptr.y, c.x - A.ptr.x); c.tx = c.x + Math.cos(a) * 260; c.ty = Math.max(30, Math.min(H - 30, c.y + Math.sin(a) * 260)); }
          if (life > .85) { c.tx = c.x < W / 2 ? -80 : W + 80; }
          const dx = c.tx - c.x, dy = c.ty - c.y, d = Math.hypot(dx, dy);
          if (d < 12) { if (Math.random() < .04) { c.tx = Math.random() * W; c.ty = H * (.1 + Math.random() * .8); } }
          else { const sp = c.v * (fleeing ? 1.8 : 1); c.x += dx / d * Math.min(sp, d) + Math.sin(t / 40 + c.wait) * 1.5; c.y += dy / d * Math.min(sp, d); if (Math.abs(dx) > 2) c.f = dx > 0 ? -1 : 1; }
          const hop = d > 12 ? Math.abs(Math.sin(t / 50 + c.wait)) * 5 : 0; em(ctx, c.e, c.x, c.y - hop, 44, 0, c.f); }); } };
  });

  // 🌊 FLOWING: the page ripples like water, and a stream flows along the bottom carrying leaves and paper boats
  Weather.add("flow,flows,flowed,flowing,stream,streams,streaming,current,currents,ripple,ripples,rippling,trickle,trickling,river,rivers", { e: "🌊", name: "Flowing", dur: 8000 }, A => {
    let svg = null; const ns = "http://www.w3.org/2000/svg";
    if (!A.reduce) { svg = document.createElementNS(ns, "svg"); svg.setAttribute("width", "0"); svg.setAttribute("height", "0"); svg.style.position = "absolute"; svg.classList.add("wx-flowsvg");
      svg.innerHTML = '<filter id="wx-flow"><feTurbulence id="wx-turb" type="fractalNoise" baseFrequency="0.012 0.03" numOctaves="2" seed="3"/><feDisplacementMap id="wx-disp" in="SourceGraphic" scale="0" xChannelSelector="R" yChannelSelector="G"/></filter>';
      document.body.appendChild(svg); A.kids().forEach(el => { el.dataset.wxFilter = el.style.filter || ""; el.style.filter = "url(#wx-flow)"; }); }
    const turb = svg && svg.querySelector("#wx-turb"), disp = svg && svg.querySelector("#wx-disp"), floaters = Array.from({ length: 7 }, (_, i) => ({ e: ["🍃", "⛵", "🍂", "🦆", "🍃", "🪵", "🍁"][i], x: -i * 150 - 40, s: 26 + (i % 3) * 8 }));
    A.noise(8, .09, "lowpass", 900, 600, 1);
    return { stop() { A.kids().forEach(el => { if (el.dataset.wxFilter != null) { el.style.filter = el.dataset.wxFilter; delete el.dataset.wxFilter; } }); if (svg) svg.remove(); },
      frame(t, life, fade) { const { ctx } = A, W = A.W(), H = A.H();
        if (turb) { turb.setAttribute("baseFrequency", `${(0.012 + Math.sin(t / 900) * .003).toFixed(4)} ${(0.03 + Math.sin(t / 700) * .006).toFixed(4)}`); disp.setAttribute("scale", (14 * fade).toFixed(1)); }
        const wl = H * .86; ctx.fillStyle = "rgba(56,152,236,.55)"; ctx.beginPath(); ctx.moveTo(0, H); for (let x = 0; x <= W; x += 16) ctx.lineTo(x, wl + Math.sin(x / 50 + t / 260) * 7 + Math.sin(x / 23 - t / 400) * 3); ctx.lineTo(W, H); ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,.6)"; ctx.lineWidth = 2; for (let k = 0; k < 10; k++) { const x = ((k * 173 + t / 4) % (W + 100)) - 50, y = wl + 18 + (k % 3) * 14; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 15, y - 5, x + 30, y); ctx.stroke(); }
        floaters.forEach((f, i) => { f.x += 1.8 + (i % 3) * .5; if (f.x > W + 60) f.x = -60; em(ctx, f.e, f.x, wl + 6 + Math.sin(t / 300 + i) * 5, f.s, Math.sin(t / 400 + i) * .2); }); } };
  });

  // 🧒 SCAMPERING (children): the bell rings and kids scamper across the playground in quick little zigzags
  Weather.add("scampering children,kids scampering,scamper kids", { e: "🧒", name: "Kids at play", dur: 9000, top: 1 }, A => {
    const W = A.W(), H = A.H(), KITS = [["#ef4444", "#991b1b", "#f1c27d"], ["#22c55e", "#166534", "#8d5524"], ["#f59e0b", "#b45309", "#e0ac69"], ["#a855f7", "#6b21a8", "#c68642"], ["#0ea5e9", "#075985", "#f1c27d"]];
    const kids = KITS.map((k, i) => ({ k, x: -60 - i * 90, y: H * (.62 + (i % 3) * .1), tx: W * (.15 + Math.random() * .7), ty: H * (.6 + Math.random() * .3), wait: i * 260, f: 1 }));
    A.noise(.5, .2, "band", 2400, 2600, 20, .1); A.noise(.5, .2, "band", 2400, 2600, 20, .7);
    return { frame(t, life) { const { ctx } = A, gy = H * .58;
      const sky = ctx.createLinearGradient(0, 0, 0, gy); sky.addColorStop(0, "rgba(125,211,252,.95)"); sky.addColorStop(1, "rgba(224,242,254,.95)"); ctx.fillStyle = sky; ctx.fillRect(0, 0, W, gy); ctx.fillStyle = "rgba(134,239,172,.97)"; ctx.fillRect(0, gy, W, H - gy);
      em(ctx, "🛝", W * .82, gy - 10, 110); em(ctx, "🌳", W * .1, gy - 60, 130); em(ctx, "🔔", W * .5, H * .2 + Math.sin(t / 60) * (t < 1400 ? 6 : 0), 40, t < 1400 ? Math.sin(t / 50) * .4 : 0);
      kids.forEach(c => { if (t < c.wait) return; if (life > .82) { c.tx = c.x < W / 2 ? -100 : W + 100; }
        const dx = c.tx - c.x, dy = c.ty - c.y, d = Math.hypot(dx, dy); if (d < 14 && life <= .82) { c.tx = W * (.08 + Math.random() * .84); c.ty = H * (.62 + Math.random() * .3); }
        else { const sp = 7.5; c.x += dx / d * Math.min(sp, d) + Math.sin(t / 45 + c.wait) * 2.2; c.y += dy / d * Math.min(sp, d) * .6; if (Math.abs(dx) > 2) c.f = dx > 0 ? 1 : -1; }
        footballer(ctx, c.x, c.y - Math.abs(Math.sin(t / 55 + c.wait)) * 8, H * .2, c.f, t / 45 + c.wait, 0, 0, c.k[0], c.k[1], c.k[2]); });
      big(ctx, "Kids scampering to the playground!", W / 2, H * .3, 24, "#0c4a6e"); } };
  });

  // 🌪️ HURRICANE: the sky goes black, the clouds spin, a funnel comes down and SUCKS THE PAGE IN: cards, pictures and titles spiral into it; then it lifts and everything drops back
  Weather.add("hurricane,hurricanes,tornado,tornadoes,cyclone,cyclones,typhoon,twister,whirlwind,vortex", { e: "🌪️", name: "Storm swallows the page", dur: 10000, top: 1 }, A => {
    const W = A.W(), H = A.H(), FX = W * .5, BASE = H * .9, ABS = 3000, ABS_END = 6000, BACK = 7600, END = 9400, debris = [];
    A.noise(10, .25, "band", 300, 900, 1); A.noise(4, .3, "lowpass", 180, 80, 1, 2.6); [1.2, 4.2].forEach(d => A.boom(d));
    // the page pieces: cards and other top-level blocks that are on screen (no piece inside another piece)
    const sel = [...document.querySelectorAll("article, .card, .panel, section, h1, h2, h3, header, nav, p, li, img, .btn, button, .tag, label, table, form")].filter(el => !el.closest(".wx-chip,.wx-stage,.wx-layer,.fx-mode") && (() => { const b = el.getBoundingClientRect(); return b.bottom > 0 && b.top < H && b.width > 10 && b.height > 6 && b.width < W * .98; })());
    const pieces = sel.filter(el => !sel.some(o => o !== el && o.contains(el))).slice(0, 60);
    pieces.forEach((el, i) => { const b = el.getBoundingClientRect(), cx = b.left + b.width / 2, cy = b.top + b.height / 2, r0 = Math.hypot(cx - FX, cy - BASE), a0 = Math.atan2(cy - BASE, cx - FX), delay = Math.min(1200, r0 * 1.2) + (i % 5) * 60, total = 10000;
      const kf = [{ transform: "none", opacity: 1, offset: 0 }, { transform: "none", opacity: 1, offset: (ABS + delay) / total }];
      for (let k = 1; k <= 8; k++) { const u = k / 8, r = r0 * (1 - u) * (1 - u * .2), a = a0 + u * 7, up = u * H * .55, x = FX + Math.cos(a) * r * (1 - u * .5) - cx, y = BASE - up + Math.sin(a) * r * .35 * (1 - u) - cy;
        kf.push({ transform: `translate(${x.toFixed(0)}px, ${y.toFixed(0)}px) rotate(${(u * 720 * (i % 2 ? 1 : -1)).toFixed(0)}deg) scale(${(1 - u * .9).toFixed(2)})`, opacity: u > .85 ? (1 - (u - .85) / .15) : 1, offset: Math.min(.99, (ABS + delay + u * (ABS_END - ABS - 400)) / total) }); }
      kf.push({ transform: `translate(${(FX - cx).toFixed(0)}px, ${(BASE - H * .55 - cy).toFixed(0)}px) scale(.1)`, opacity: 0, offset: BACK / total });
      kf.push({ transform: `translate(0px, -${(H * .4).toFixed(0)}px) rotate(${i % 2 ? 8 : -8}deg)`, opacity: 1, offset: (BACK + 500 + (i % 6) * 60) / total });
      kf.push({ transform: "translateY(10px)", opacity: 1, offset: (END - 300) / total }); kf.push({ transform: "none", opacity: 1, offset: 1 });
      kf.sort((p, q) => p.offset - q.offset); for (let k = 1; k < kf.length; k++) if (kf[k].offset <= kf[k - 1].offset) kf[k].offset = Math.min(1, kf[k - 1].offset + .001);
      A.ani(el, kf, { duration: total, easing: "linear" }); });
    return { frame(t) { const { ctx } = A;
      const dark = Math.min(1, t / 1500) * (t > BACK ? Math.max(0, 1 - (t - BACK) / 1500) : 1);
      ctx.fillStyle = `rgba(30,34,44,${(t > ABS && t < BACK ? .5 : .78) * dark})`; ctx.fillRect(0, 0, W, H);
      // spinning cloud disc
      for (let k = 0; k < 14; k++) { const a = t / 700 + k * .45, r = W * (.15 + (k % 5) * .1); ctx.fillStyle = `rgba(${70 + k * 4},${74 + k * 4},${86 + k * 4},${.55 * dark})`; ctx.beginPath(); ctx.ellipse(FX + Math.cos(a) * r * .9, H * .08 + Math.sin(a) * 30, 90, 36, a, 0, 7); ctx.fill(); }
      // rain streaks
      ctx.strokeStyle = `rgba(200,210,230,${.35 * dark})`; ctx.lineWidth = 1.5; for (let k = 0; k < 90; k++) { const x = (k * 97 + t * .9) % (W + 200) - 100, y = (k * 53 + t * 1.4) % H; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 18, y + 26); ctx.stroke(); }
      // the funnel: drops down, spins, then lifts away
      const drop = t < 1500 ? 0 : t < ABS ? (t - 1500) / (ABS - 1500) : t < BACK ? 1 : Math.max(0, 1 - (t - BACK) / 900), sway = Math.sin(t / 600) * 30;
      if (drop > 0) { const topY = H * .1, botY = topY + (BASE - topY) * drop; for (let y = topY; y < botY; y += 6) { const u = (y - topY) / (BASE - topY), w = (1 - u) * W * .2 + 18, x = FX + sway * u + Math.sin(y / 30 - t / 90) * 12 * u, sh = 60 + Math.sin(y / 14 - t / 60) * 30;
          ctx.fillStyle = `rgba(${sh},${sh + 4},${sh + 14},${.85 * dark})`; ctx.beginPath(); ctx.ellipse(x, y, w, 7, 0, 0, 7); ctx.fill(); }
        // debris spiralling in the funnel
        if (t > 1800 && t < BACK && debris.length < 40 && Math.random() < .3) debris.push({ e: ["🍃", "📄", "🍂", "🪵", "📰", "🧢"][Math.floor(Math.random() * 6)], u: 1, a: Math.random() * 7 });
        debris.forEach(d => { d.u -= .006; d.a += .18; const y = topY + (BASE - topY) * d.u * drop, w = (1 - d.u) * W * .2 + 30; em(ctx, d.e, FX + sway * d.u + Math.cos(d.a) * w, y, 22, d.a); }); for (let i = debris.length - 1; i >= 0; i--) if (debris[i].u <= 0) debris.splice(i, 1);
        ctx.fillStyle = `rgba(120,113,108,${.5 * dark})`; for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.arc(FX + sway + Math.cos(t / 200 + k) * 50, BASE + Math.sin(t / 150 + k) * 8, 20 + k * 3, 0, 7); ctx.fill(); } }
      if (t > ABS && t < BACK) big(ctx, "The storm is swallowing the page! 🌪️", W / 2, H * .22, 24, "#1e293b");
      if (t > BACK + 400 && t < END) big(ctx, "Phew… it passed!", W / 2, H * .22, 28, "#1e3a8a"); } };
  });

  // 💡 SWINGING LAMP: a ceiling lamp on a cord swings left-right and back-forward; its cone of light sweeps across the dark page; tap to push it
  Weather.add("ceiling lamp,swinging lamp,hanging lamp,pendulum,lamp", { e: "💡", name: "Swinging lamp", dur: 16000, capture: 1, top: 1 }, A => {
    let ampX = .55, ampZ = .45, last = 0; A.setChip("tap to push the lamp 💡"); A.noise(16, .03, "band", 120, 120, 4);
    return { down(x) { const W = A.W(); ampX = Math.min(.9, ampX + .25); ampZ = Math.min(.8, ampZ + .1); A.noise(.15, .12, "band", 900, 500, 3); },
      frame(t) { const { ctx } = A, W = A.W(), H = A.H(), dt = Math.min(40, t - (last || t)); last = t; ampX = Math.max(.25, ampX * Math.pow(.99995, dt)); ampZ = Math.max(.2, ampZ * Math.pow(.99995, dt));
        const sw = Math.sin(t / 900) * ampX, z = Math.cos(t / 1300) * ampZ, L = H * .38 * (1 + z * .15), px = W / 2, py = 0, lx = px + Math.sin(sw) * L, ly = py + Math.cos(sw) * L, sc = 1 + z * .35;
        // dark room, then cut the light cone out of the dark
        ctx.save(); ctx.fillStyle = "rgba(5,7,16,.9)"; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = "destination-out";
        const ang = sw, reach = H * 1.1, spread = .42 + z * .1, ex = lx + Math.sin(ang) * reach, ey = ly + Math.cos(ang) * reach, nx = Math.cos(ang), ny = -Math.sin(ang), half = Math.tan(spread) * reach;
        const g = ctx.createLinearGradient(lx, ly, ex, ey); g.addColorStop(0, "rgba(0,0,0,.95)"); g.addColorStop(.7, "rgba(0,0,0,.75)"); g.addColorStop(1, "rgba(0,0,0,.4)"); ctx.fillStyle = g;
        ctx.beginPath(); ctx.moveTo(lx - nx * 18 * sc, ly - ny * 18 * sc); ctx.lineTo(ex - nx * half, ey - ny * half); ctx.lineTo(ex + nx * half, ey + ny * half); ctx.lineTo(lx + nx * 18 * sc, ly + ny * 18 * sc); ctx.closePath(); ctx.fill();
        const fy = Math.min(H * .92, ly + H * .55), fx = lx + Math.tan(ang) * (fy - ly), pool = ctx.createRadialGradient(fx, fy, 10, fx, fy, 180 * sc); pool.addColorStop(0, "rgba(0,0,0,1)"); pool.addColorStop(1, "rgba(0,0,0,0)"); ctx.fillStyle = pool; ctx.beginPath(); ctx.ellipse(fx, fy, 190 * sc, 70 * sc, 0, 0, 7); ctx.fill(); ctx.restore();
        ctx.save(); ctx.globalCompositeOperation = "lighter"; const tint = ctx.createLinearGradient(lx, ly, ex, ey); tint.addColorStop(0, "rgba(255,220,140,.35)"); tint.addColorStop(1, "rgba(255,220,140,0)"); ctx.fillStyle = tint; ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(ex - nx * half, ey - ny * half); ctx.lineTo(ex + nx * half, ey + ny * half); ctx.closePath(); ctx.fill(); ctx.restore();
        // cord, shade and bulb (closer = bigger)
        ctx.strokeStyle = "#cbd5e1"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(lx, ly - 22 * sc); ctx.stroke(); ctx.fillStyle = "#94a3b8"; ctx.fillRect(px - 20, 0, 40, 8);
        ctx.save(); ctx.translate(lx, ly); ctx.rotate(-sw); ctx.scale(sc, sc); ctx.fillStyle = "#1e3a8a"; ctx.beginPath(); ctx.moveTo(-14, -24); ctx.lineTo(14, -24); ctx.lineTo(34, 4); ctx.lineTo(-34, 4); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#93c5fd"; ctx.lineWidth = 2; ctx.stroke();
        const bulb = ctx.createRadialGradient(0, 6, 1, 0, 6, 26); bulb.addColorStop(0, "#fffbeb"); bulb.addColorStop(.4, "#fde68a"); bulb.addColorStop(1, "rgba(253,230,138,0)"); ctx.fillStyle = bulb; ctx.beginPath(); ctx.arc(0, 6, 26, 0, 7); ctx.fill(); ctx.restore();
        if (t < 3500) big(ctx, "A beam of light from a swinging lamp", W / 2, H * .9, 20, "#78350f"); } };
  });

  // 🔗 the same word, different examples: shown together in the ✨ See it strip under the picture
  // 💙 FEEL BLUE: first the joke (is he really blue?), then the real meaning: a sad boy under his own little rain cloud while the page loses its colour.
  //   Tap to help: a friend comes, gives a hug, and the cloud goes away; the colour and the sun come back.
  Weather.add("feel blue,feeling blue,feels blue,felt blue,down in the dumps,sad,sadness,sadly,unhappy,miserable,downcast,glum,heartbroken,cheer up,cheered up", { e: "💙", name: "Feel blue", dur: 30000, capture: 1, top: 1 }, A => {
    const kids = A.kids(), old = kids.map(el => [el.style.filter, el.style.transition]);
    const tint = f => kids.forEach(el => { el.style.transition = "filter 1.4s ease"; el.style.filter = f; });
    const JOKE = 3800; let step = 0, stepAt = 0, sadAt = 0, rain = null, tears = [], drops = [], bits = [];
    tint("sepia(1) hue-rotate(180deg) saturate(3)"); A.setChip("is he really blue? 🤔");
    const help = now => { if (now < JOKE || step >= 3) return; step++; stepAt = now;
      if (step === 1) { A.plink(0); A.setChip("tap: give a hug 🤗"); }
      if (step === 2) { A.plink(0); A.plink(.15); A.setChip("tap: send the cloud away ☀️"); }
      if (step === 3) { try { rain && rain.stop && rain.stop(); } catch (e) {} tint("none"); [0, .2, .4, .6].forEach(d => A.chirp(d)); A.setChip("cheered up! 😊"); } };
    return { stop() { try { rain && rain.stop && rain.stop(); } catch (e) {} kids.forEach((el, i) => { el.style.filter = old[i][0]; setTimeout(() => { el.style.transition = old[i][1]; }, 1500); }); },
      down() { help(performance.now() - A.t0); },
      frame(t, life, fade) { if (!A.t0) A.t0 = performance.now() - t; const { ctx } = A, W = A.W(), H = A.H(), gy = H * .8, S = Math.min(W * .3, H * .38), bx = W * .42;
        // auto mode: if nobody taps, the friend still comes
        if (t > JOKE + 6000 && step === 0) help(t); if (step && step < 3 && t - stepAt > 4500) help(t);
        if (t < JOKE) { // 🤔 the joke: a boy who is literally blue
          ctx.fillStyle = "rgba(219,234,254,.9)"; ctx.fillRect(0, 0, W, H);
          big(ctx, "“I feel blue.”", W / 2, H * .16, Math.min(40, W / 14), "#1d4ed8");
          footballer(ctx, bx + S * .25, gy, S, 1, 0, 0, 0, "#1d4ed8", "#1e3a8a", "#60a5fa");
          bubble(ctx, "Huh? I'm not THAT blue! 😅", bx + S * .25, gy - S * 1.35, 16);
          if (t > 1800) { big(ctx, "❌ Not the colour!", W / 2, H * .3, 26, "#dc2626"); }
          return; }
        if (!sadAt) { sadAt = t; tint(step < 3 ? "grayscale(.85) brightness(.9) sepia(.25) hue-rotate(180deg)" : "none"); rain = A.noise(22, .035, "band", 2500, 3500, .6); A.setChip("tap to help him 🤝"); }
        const happy = step >= 3 ? Math.min(1, (t - stepAt) / 1500) : 0;
        // the room: grey-blue, then warm and bright
        const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, happy ? `rgba(253,230,138,${.55 + .3 * happy})` : "rgba(100,116,139,.82)"); g.addColorStop(1, happy ? "rgba(187,247,208,.9)" : "rgba(51,65,85,.88)"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = happy ? "#86efac" : "#475569"; ctx.fillRect(0, gy, W, H - gy);
        if (happy) { em(ctx, "☀️", W * .82, H * .2 + (1 - happy) * 80, 90 * happy, t / 3000); ctx.globalAlpha = happy * .8; ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6"].forEach((c, i) => { ctx.strokeStyle = c; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(W / 2, gy, Math.min(W, H) * .55 - i * 10, Math.PI, 0); ctx.stroke(); }); ctx.globalAlpha = 1; }
        // the boy: head down when sad; jumps when cheered up
        const jump = happy ? Math.abs(Math.sin(t / 180)) * S * .15 : 0, droop = happy ? 0 : (step === 2 ? .15 : .3);
        ctx.save(); ctx.translate(bx, gy - jump); ctx.rotate(droop * .25); footballer(ctx, 0, 0, S, 1, 0, 0, 0, happy ? "#f59e0b" : "#64748b", happy ? "#b45309" : "#334155"); ctx.restore();
        const hx = bx + Math.sin(droop * .25) * S * .99, hy = gy - jump - Math.cos(droop * .25) * S * .99;
        if (!happy) { ctx.fillStyle = "#e8b48a"; ctx.fillRect(hx + S * .04, hy - S * .045, S * .1, S * .07); ctx.strokeStyle = "#1f2937"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(hx + S * .08, hy + S * .02, S * .035, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
          if (Math.random() < .05) tears.push({ x: hx + S * .1, y: hy - S * .01, v: 0 });
        }
        for (let i = tears.length - 1; i >= 0; i--) { const d = tears[i]; d.v += .15; d.y += d.v; ctx.fillStyle = "#60a5fa"; ctx.beginPath(); ctx.ellipse(d.x, d.y, 3, 5, 0, 0, 7); ctx.fill(); if (d.y > gy) tears.splice(i, 1); }
        // his own little rain cloud: it shrinks with each kind thing, and floats away at the end
        const cloudX = bx + (happy ? happy * W : 0), cloudY = gy - S * 1.32 - happy * 160, cs = S * (step === 0 ? .55 : step === 1 ? .45 : step === 2 ? .35 : .3);
        if (happy < 1) { ctx.globalAlpha = 1 - happy; ctx.filter = "brightness(.55)"; em(ctx, "☁️", cloudX, cloudY, cs * 1.15); ctx.filter = "none"; if (!happy && Math.random() < .9) drops.push({ x: cloudX + (Math.random() - .5) * cs * 1.2, y: cloudY + cs * .4 }); ctx.globalAlpha = 1; }
        ctx.strokeStyle = "rgba(191,219,254,.95)"; ctx.lineWidth = 3; for (let i = drops.length - 1; i >= 0; i--) { const d = drops[i]; d.y += 9; ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - 1, d.y + 10); ctx.stroke(); if (d.y > gy - S * .1 || happy) drops.splice(i, 1); }
        // the friend
        if (step >= 1) { const k = Math.min(1, (t - (step === 1 ? stepAt : 0) + (step > 1 ? 9e9 : 0)) / 1400), fx = W + S * .4 - (W + S * .4 - (bx + S * .55)) * Math.min(1, k), hug = step >= 2;
          footballer(ctx, hug ? bx + S * .4 : fx, gy - (happy ? Math.abs(Math.sin(t / 180 + 1)) * S * .15 : 0), S * .95, -1, k < 1 ? t / 70 : 0, 0, 0, "#ec4899", "#9d174d", "#c68642");
          if (step === 1 && k >= 1) bubble(ctx, "Are you OK? I'm here. 💛", bx + S * .55, gy - S * 1.3, 15);
          if (step === 2) { em(ctx, "🤗", bx + S * .2, gy - S * .75, S * .28); em(ctx, "💛", bx + S * .2, gy - S * 1.15 - ((t - stepAt) / 30 % 40), 24); bubble(ctx, "Want to talk about it?", bx + S * .65, gy - S * 1.32, 15); } }
        if (happy && Math.random() < .3) confetti(bits, bx, gy - S, 2); drawBits(ctx, bits);
        // what it means
        big(ctx, happy ? "Cheered up! 😊" : "Feel blue = feel sad 😢", W / 2, Math.max(H * .12, 70), Math.min(34, W / 16), happy ? "#15803d" : "#1e3a8a");
        ctx.font = "700 15px system-ui"; ctx.textAlign = "center"; ctx.fillStyle = happy ? "#14532d" : "#f1f5f9";
        ctx.fillText(happy ? "When a friend feels blue, be there: ask, listen, and stay with them. 💛" : step ? "A friend noticed. Kind things make the cloud smaller." : "Everything looks grey, like his own little rain cloud. (In English, “blue” can also mean sad.)", W / 2, H * .93); ctx.textAlign = "start"; } };
  });

  if (Weather.also) {
    Weather.also("gloomy,gloom,depressing", "feel blue");
    Weather.also("beam,beams,beamed,beaming", "swinging lamp,sunbeam,moonbeam,laser");
    Weather.also("sunbeam,sunbeams,ray,rays", "beam,moonbeam");
    Weather.also("scamper,scampers,scampered,scampering,scurry,scurried,scurrying,dart,darted", "scampering children");
    Weather.also("peep,peeps,peeped,peeping,peek,peeked,peeking", "look");
    Weather.also("glance,glanced,look,looked,looking,watch,watched,watching,stare,gaze", "peep,spy");
    Weather.also("observe,observed,observing,observation,examine,inspect", "look,spy");
    Weather.also("exhaustion,exhausted,tired,weary,fatigue,worn out", "lethargic,dozed");
    Weather.also("doze,dozed,dozing,drowsy,sleepy,nap,napping", "lethargic");
    Weather.also("serene,serenity,peaceful,tranquil", "calm");
    Weather.also("heroic,hero,heroes,brave,bravery,courage,courageous", "rescue,bestowed");
    Weather.also("bestow,bestowed,award,awarded,medal,honour,honor", "heroic");
    Weather.also("faraway,far away,distant,distance,far", "spy");
    Weather.also("curiosity,curious,intriguing,intrigued,mystery,mysterious", "observe,peep");
    Weather.also("gleam,gleamed,gleaming,glint,glisten,shine,shiny,sparkle", "sunbeam");
    Weather.also("precarious,unstable,unsteady,teetering", "sway");
    Weather.also("separated,separate,split,apart,divided", "faraway");
    Weather.also("ferocious,beast,beasts,predator,roar,roared", "stomp");
  }


  // 🍽️ HUNGER: a man goes from Full → Peckish → Hungry → Ravenous → Starving over 10 hours, then collapses on the floor.
  //   On the page (full screen) there is a timeline that plays by itself and that you can drag; in a meter box only the man shows,
  //   at the level of the meter (he eases from the level before, so moving the meter walks him through the hours).
  let hungerH = 0;
  Weather.add("full,peckish,hungry,ravenous,famished,starving,starve,starved,hunger,appetite,underfed,empty stomach", { e: "🍽️", name: "Hunger", dur: 52000, track: 1, capture: 1, top: 1 }, A => {
    const HRS = [0, 2, 3.5, 5, 8, 10], rk = r => { r = Math.max(0, Math.min(5, +r || 0)); const i = Math.floor(r); return i >= 5 ? 10 : HRS[i] + (HRS[i + 1] - HRS[i]) * (r - i); };
    const STATES = [[1, "Full", "😌"], [3.5, "Peckish", "🍎"], [6.5, "Hungry", "😋"], [9, "Ravenous", "🍝"], [99, "Starving", "😵"]];
    const stOf = h => STATES.find(x => h < x[0]);
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, k) => a + (b - a) * k;
    const mix = (c1, c2, k) => `rgb(${[0, 1, 2].map(i => Math.round(lerp(c1[i], c2[i], k))).join(",")})`;
    const boxed = !!A.boxed, o = A.opts || {};
    let h = boxed ? hungerH : 0, target = boxed ? rk(o.rank) : 10, playing = !boxed, drag = false, last = null, prevH = h, startT = null, lay = null;
    const growl = () => A.noise(.9, .2, "lowpass", 150, 70, 1);
    A.setChip(boxed ? "🍽️ hunger" : "⏱️ watch the hours go by, or drag the timeline");
    const layout = () => { const W = A.W(), H = A.H();
      if (boxed) return { cx: 0, cy: 0, cw: W, ch: H, th: 0, sx: 0, sy: 0, sw: W, sh: H };
      const cw = Math.min(W - 20, 660), ch = Math.min(H - 20, 480), cx = (W - cw) / 2, cy = (H - ch) / 2, th = 92;
      return { cx, cy, cw, ch, th, sx: cx, sy: cy, sw: cw, sh: ch - th, bx0: cx + 66, bx1: cx + cw - 30, by: cy + ch - 40 }; };
    const hOfX = x => clamp((x - lay.bx0) / (lay.bx1 - lay.bx0), 0, 1) * 10;
    const onBar = (x, y) => lay && !boxed && y > lay.by - 30 && y < lay.by + 30 && x > lay.bx0 - 14 && x < lay.bx1 + 14;
    const onPlay = (x, y) => lay && !boxed && Math.hypot(x - (lay.cx + 34), y - lay.by) < 26;
    const person = (ctx, mx, gy, S, h, t, ang, reach, calm) => {
      const hh = h / 10, s2 = clamp((h - 3) / 6, 0, 1), hb = clamp((h - 2.5) / 1.5, 0, 1) * (1 - clamp((h - 8.6) / .6, 0, 1));
      const skin = mix([242, 201, 160], [214, 214, 170], Math.min(1, hh * 1.1)), shirt = mix([249, 115, 22], [176, 160, 142], Math.min(1, hh * 1.2)), pants = "#334155", O = "#1f2937";
      const tw = .34 - .12 * hh, shY = -.78 + .035 * s2, hy = -.93 + .05 * s2, br = 1 + (calm ? 0 : Math.sin(t / (520 + h * 70)) * .012 * (1 - hh));
      ctx.save(); ctx.translate(mx, gy); ctx.rotate(ang); ctx.scale(S, S); ctx.lineCap = "round"; ctx.lineJoin = "round";
      const line = (w, c, pts) => { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); };
      const kb = s2 * .03;
      [-1, 1].forEach(sd => { line(.09, pants, [[sd * .07, -.46], [sd * (.085 - kb * 2), -.23], [sd * .09, -.02]]); ctx.fillStyle = "#111827"; ctx.beginPath(); ctx.ellipse(sd * .105, -.005, .075, .035, 0, 0, 7); ctx.fill(); });
      ctx.save(); ctx.translate(0, shY); ctx.scale(1, br); ctx.translate(0, -shY);
      ctx.fillStyle = shirt; ctx.strokeStyle = O; ctx.lineWidth = .014; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(-tw / 2, shY, tw, -.42 - shY, .08) : ctx.rect(-tw / 2, shY, tw, -.42 - shY); ctx.fill(); ctx.stroke();
      const bellyR = lerp(.13, 0, clamp(h / 3, 0, 1)); if (bellyR > .012) { ctx.beginPath(); ctx.ellipse(0, -.55, tw / 2 + bellyR * .55, .1 + bellyR * .5, 0, 0, 7); ctx.fill(); ctx.stroke(); }
      ctx.fillStyle = pants; ctx.fillRect(-tw / 2, -.46, tw, .045); ctx.restore();
      [-1, 1].forEach(sd => { const shx = sd * (tw / 2 - .01), shy = shY + .03, hang = [sd * (tw / 2 + .055), -.5 + .03 * s2];
        let hand = hang; if (sd < 0) { hand = [lerp(hang[0], -.02, hb), lerp(hang[1], -.57, hb)]; hand = [lerp(hand[0], -(tw / 2 + .06), reach), lerp(hand[1], -.42, reach)]; }
        else hand = [lerp(hang[0], tw / 2 + .04, reach), lerp(hang[1], shY - .24, reach)];
        const el = [(shx + hand[0]) / 2 + sd * .035, (shy + hand[1]) / 2];
        line(.075, O, [[shx, shy], el, hand]); line(.058, shirt, [[shx, shy], el]); line(.05, skin, [el, hand]); ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(hand[0], hand[1], .04, 0, 7); ctx.fill(); });
      ctx.save(); ctx.translate(0, hy); ctx.rotate(s2 * .14 + (calm ? 0 : Math.sin(t / 900) * s2 * .08));
      ctx.fillStyle = skin; ctx.strokeStyle = O; ctx.lineWidth = .014; ctx.beginPath(); ctx.arc(0, 0, .13, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#3b2a1a"; ctx.beginPath(); ctx.arc(0, -.015, .137, Math.PI * 1.03, Math.PI * 1.97); ctx.fill();
      const stroke = (w, pts) => { ctx.strokeStyle = O; ctx.lineWidth = w; ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); };
      const dot = (x, y, r, c) => { ctx.fillStyle = c || O; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); };
      if (h < 1) { dot(-.05, -.01, .018); dot(.05, -.01, .018); dot(-.045, -.017, .006, "#fff"); dot(.055, -.017, .006, "#fff"); dot(-.085, .035, .022, "rgba(244,114,182,.45)"); dot(.085, .035, .022, "rgba(244,114,182,.45)");
        ctx.strokeStyle = O; ctx.lineWidth = .014; ctx.beginPath(); ctx.arc(0, .02, .05, .2, Math.PI - .2); ctx.stroke(); }
      else if (h < 3.5) { dot(-.05, -.01, .018); dot(.05, -.01, .018); dot(-.04, -.01, .008, "#fff"); dot(.06, -.01, .008, "#fff"); stroke(.012, [[-.07, -.05], [-.03, -.055]]); stroke(.012, [[.03, -.055], [.07, -.05]]); stroke(.014, [[-.035, .05], [.035, .045]]); }
      else if (h < 6.5) { dot(-.05, -.005, .018); dot(.05, -.005, .018); stroke(.013, [[-.078, -.04], [-.03, -.065]]); stroke(.013, [[.03, -.065], [.078, -.04]]);
        ctx.strokeStyle = O; ctx.lineWidth = .014; ctx.beginPath(); ctx.arc(0, .075, .04, Math.PI + .3, 2 * Math.PI - .3); ctx.stroke(); }
      else if (h < 9.3) { [-1, 1].forEach(sd => { dot(sd * .05, -.005, .03, "#fff"); ctx.strokeStyle = O; ctx.lineWidth = .008; ctx.beginPath(); ctx.arc(sd * .05, -.005, .03, 0, 7); ctx.stroke(); dot(sd * .05 + .006, -.003, .011); });
        stroke(.013, [[-.085, -.05], [-.03, -.075]]); stroke(.013, [[.03, -.075], [.085, -.05]]);
        const mo = .03 + .008 * Math.sin(t / 120); ctx.fillStyle = "#7f1d1d"; ctx.strokeStyle = O; ctx.lineWidth = .01; ctx.beginPath(); ctx.ellipse(0, .06, .036, mo, 0, 0, 7); ctx.fill(); ctx.stroke(); dot(0, .07, .017, "#f87171");
        const dl = .03 + .03 * (Math.sin(t / 380) * .5 + .5); ctx.strokeStyle = "rgba(125,211,252,.9)"; ctx.lineWidth = .012; ctx.beginPath(); ctx.moveTo(.03, .075); ctx.lineTo(.03, .075 + dl); ctx.stroke(); dot(.03, .08 + dl, .012, "rgba(125,211,252,.95)"); }
      else { if (h > 9.6) { [-1, 1].forEach(sd => { stroke(.014, [[sd * .05 - .022, -.03], [sd * .05 + .022, .012]]); stroke(.014, [[sd * .05 + .022, -.03], [sd * .05 - .022, .012]]); }); }
        else { stroke(.014, [[-.075, -.005], [-.025, .004]]); stroke(.014, [[.025, .004], [.075, -.005]]); }
        const pts = []; for (let k = 0; k <= 8; k++) pts.push([-.045 + k * .011, .07 + Math.sin(k * 1.4) * .008]); stroke(.013, pts); }
      ctx.restore(); ctx.restore(); };
    const world = (mx, gy, S, ang, x, y) => [mx + (x * Math.cos(ang) - y * Math.sin(ang)) * S, gy + (x * Math.sin(ang) + y * Math.cos(ang)) * S];
    return {
      down(x, y) { if (boxed) return; if (onPlay(x, y)) { if (h >= 10) { h = 0; prevH = 0; } playing = !playing || h < 10 ? !playing : true; return; }
        if (onBar(x, y)) { drag = true; playing = false; h = hOfX(x); } },
      move(x, y) { if (drag) h = hOfX(x); },
      up() { drag = false; },
      stop() { if (boxed) hungerH = h; },
      frame(t) { const { ctx } = A, W = A.W(), H = A.H(); if (startT == null) startT = t; const dt = last == null ? 16 : Math.min(60, t - last); last = t;
        lay = layout();
        if (boxed) h += (target - h) * (1 - Math.exp(-dt / 380)); else if (playing && t - startT > 1200 && !drag) { h = Math.min(10, h + dt / 1000 * .62); if (h >= 10) playing = false; }
        [3.2, 5.5, 7.5, 8.8].forEach(k => { if (prevH < k && h >= k) growl(); }); if (prevH < 9.55 && h >= 9.55) A.boom(0); prevH = h;
        const { cx, cy, cw, ch, th, sx, sy, sw, sh } = lay, hh = h / 10, st = stOf(h);
        if (!boxed) { ctx.fillStyle = "rgba(15,23,42,.55)"; ctx.fillRect(0, 0, W, H); }
        ctx.save(); ctx.beginPath(); ctx.roundRect ? ctx.roundRect(cx, cy, cw, ch, boxed ? 14 : 22) : ctx.rect(cx, cy, cw, ch); ctx.clip();
        const sky = ctx.createLinearGradient(0, sy, 0, sy + sh); sky.addColorStop(0, mix([150, 210, 255], [255, 170, 110], hh)); sky.addColorStop(1, mix([225, 242, 255], [255, 223, 180], hh)); ctx.fillStyle = sky; ctx.fillRect(cx, cy, cw, sh);
        const sunX = sx + sw * (.1 + .8 * hh), sunY = sy + sh * (.34 - .2 * Math.sin(Math.PI * hh) + .22 * hh * hh); const S = Math.min(sh * .74, sw * .46);
        em(ctx, hh > .93 ? "🌇" : "☀️", sunX, sunY, S * .22);
        const gy = sy + sh * .86; ctx.fillStyle = mix([222, 190, 140], [190, 160, 120], hh); ctx.fillRect(cx, gy, cw, sh - sh * .86 + (boxed ? 0 : 0)); ctx.fillStyle = "rgba(0,0,0,.08)"; ctx.fillRect(cx, gy, cw, 3);
        // the table with food that stays out of reach
        const tx = sx + sw * .84; ctx.fillStyle = "#a16207"; ctx.fillRect(tx - S * .22, gy - S * .3, S * .44, S * .045); ctx.fillRect(tx - S * .19, gy - S * .26, S * .035, S * .26); ctx.fillRect(tx + S * .155, gy - S * .26, S * .035, S * .26);
        em(ctx, h < 6.5 ? "🍲" : "🍗", tx, gy - S * .4, S * .24);
        const mx = sx + sw * .36, f = clamp((h - 9) / .9, 0, 1), ang = (Math.PI / 2) * (f * f) * 1.0 + (A.reduce ? 0 : Math.sin(t / 260) * (.012 + .07 * clamp((h - 6) / 3.2, 0, 1)) * (1 - f));
        person(ctx, mx, gy, S, h, t, ang, f, !!A.reduce);
        // rumbling belly, sweat, dizzy stars, thought bubble
        const head = world(mx, gy, S, ang, 0, -.93 + .05 * clamp((h - 3) / 6, 0, 1));
        if (h > 3 && h < 9.7) { const k = (Math.sin(t / (600 - 25 * h)) + 1) / 2; if (k > .55) { const b = world(mx, gy, S, ang, -.26, -.5); big(ctx, h < 7 ? "grr…" : "GRRR!", b[0] + Math.sin(t / 40) * 2, b[1], S * (.1 + hh * .05), "#b91c1c"); } }
        if (h > 4.5 && h < 9.6) em(ctx, "💧", head[0] + S * .17, head[1] - S * .03 + ((t / 9) % (S * .16)), S * .08);
        if (h > 8.2) { for (let k = 0; k < 3; k++) { const a = t / 380 + k * 2.1; em(ctx, h > 9.5 ? "⭐" : "💫", head[0] + Math.cos(a) * S * .22, head[1] - S * .2 + Math.sin(a) * S * .06, S * .1); } }
        if (h >= 9.9) { for (let k = 0; k < 3; k++) { const a = t / 260 + k * 2.2; em(ctx, "🪰", head[0] + S * .3 + Math.cos(a) * S * .16, head[1] - S * .22 + Math.sin(a * 1.3) * S * .08, S * .07); } }
        if (h >= 1 && h < 9.95) { const food = h < 3.5 ? ["🍎"] : h < 6.5 ? ["🍔"] : h < 9 ? ["🍝", "🍗", "🍕"] : ["🍞"], fe = food[Math.floor(t / 750) % food.length], bx = head[0] + S * .45, by = head[1] - S * .42 + Math.sin(t / 500) * 4, bR = S * .24;
          ctx.fillStyle = "#fff"; ctx.strokeStyle = "#1f2937"; [[head[0] + S * .2, head[1] - S * .2, S * .03], [head[0] + S * .3, head[1] - S * .3, S * .05]].forEach(([x, y, r]) => { ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.lineWidth = 1.5; ctx.stroke(); });
          ctx.beginPath(); ctx.ellipse(bx, by, bR, bR * .8, 0, 0, 7); ctx.fill(); ctx.lineWidth = 2; ctx.stroke(); ctx.globalAlpha *= h >= 9 ? .45 + .3 * Math.sin(t / 200) : 1; em(ctx, fe, bx, by, bR * 1.1, Math.sin(t / 300) * (h > 6.5 ? .25 : .06)); ctx.globalAlpha = 1; }
        if (h >= 9.95) { const hd = world(mx, gy, S, ang, 0, -.93); bubble(ctx, "so… hungry… 🍞", hd[0] - S * .1, hd[1] - S * .42, Math.max(13, S * .1)); }
        // labels
        const pill = (txt, x, y, size, bg) => { ctx.save(); ctx.font = `800 ${size}px system-ui`; const w = ctx.measureText(txt).width + size * 1.1, hgt = size * 1.8; ctx.fillStyle = bg || "rgba(255,255,255,.92)"; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, w, hgt, hgt / 2) : ctx.rect(x, y, w, hgt); ctx.fill(); ctx.fillStyle = "#1f2937"; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(txt, x + size * .55, y + hgt / 2 + 1); ctx.restore(); };
        pill(`${st[2]} ${st[1]}`, cx + 10, cy + 10, boxed ? 13 : 17); pill(`${Math.round(h)} h without food`, cx + 10, cy + (boxed ? 38 : 48), boxed ? 11 : 13, "rgba(255,255,255,.75)");
        if (!boxed) { // the timeline
          ctx.fillStyle = "rgba(255,255,255,.96)"; ctx.fillRect(cx, cy + sh, cw, th);
          const by = lay.by, x0 = lay.bx0, x1 = lay.bx1, g = ctx.createLinearGradient(x0, 0, x1, 0); g.addColorStop(0, "#4ade80"); g.addColorStop(.35, "#facc15"); g.addColorStop(.7, "#fb923c"); g.addColorStop(1, "#ef4444");
          ctx.lineCap = "round"; ctx.strokeStyle = "#e2e8f0"; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(x0, by); ctx.lineTo(x1, by); ctx.stroke();
          ctx.strokeStyle = g; ctx.beginPath(); ctx.moveTo(x0, by); ctx.lineTo(x0 + (x1 - x0) * hh, by); ctx.stroke();
          ctx.fillStyle = "#475569"; ctx.font = "700 11px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "top"; for (let k = 0; k <= 10; k++) { const x = x0 + (x1 - x0) * k / 10; ctx.fillRect(x - 1, by + 10, 2, 5); if (k % 2 === 0) ctx.fillText(k + "h", x, by + 17); }
          [[0, "😌"], [2, "🍎"], [5, "😋"], [8, "🍝"], [10, "😵"]].forEach(([k, e]) => em(ctx, e, x0 + (x1 - x0) * k / 10, by - 26, 22));
          const hx = x0 + (x1 - x0) * hh; ctx.fillStyle = "#fff"; ctx.strokeStyle = "#1f2937"; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(hx, by, 13, 0, 7); ctx.fill(); ctx.stroke();
          ctx.fillStyle = playing ? "#fee2e2" : "#dcfce7"; ctx.strokeStyle = "#1f2937"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx + 34, by, 20, 0, 7); ctx.fill(); ctx.stroke(); ctx.fillStyle = "#1f2937"; ctx.font = "800 17px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(h >= 10 ? "↻" : playing ? "⏸" : "▶", cx + 34, by + 1);
        }
        ctx.restore(); ctx.strokeStyle = "rgba(31,41,55,.55)"; ctx.lineWidth = boxed ? 0 : 3; if (!boxed) { ctx.beginPath(); ctx.roundRect ? ctx.roundRect(cx, cy, cw, ch, 22) : ctx.rect(cx, cy, cw, ch); ctx.stroke(); }
        A.setChip(boxed ? "🍽️ hunger" : `⏱️ hour ${h.toFixed(1)} · ${st[1]}`); } };
  });

  Weather.rescan();
})();
