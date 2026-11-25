/* 🧩 More word effects, played by weather.js (Weather.add). Each one gets a canvas over the page (A.ctx) and returns
   { frame(t, life, fade), down(x, y), move(x, y), up(x, y), stop() }. Pointer-driven ones block page clicks while they run. */
(function () {
  "use strict";
  if (!window.Weather || !Weather.add) return;
  const em = (ctx, e, x, y, size, rot, sx) => { ctx.save(); ctx.translate(x, y); if (rot) ctx.rotate(rot); if (sx) ctx.scale(sx, 1); ctx.font = size + "px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(e, 0, 0); ctx.restore(); };
  const bubble = (ctx, text, x, y, size) => { ctx.save(); ctx.font = `800 ${size}px system-ui`; const w = ctx.measureText(text).width + size * 1.2, h = size * 1.7; ctx.fillStyle = "#fff"; ctx.strokeStyle = "#1f2937"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x - w / 2, y - h / 2, w, h, h / 2) : ctx.rect(x - w / 2, y - h / 2, w, h); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - 8, y + h / 2 - 1); ctx.lineTo(x, y + h / 2 + 12); ctx.lineTo(x + 8, y + h / 2 - 1); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#1f2937"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(text, x, y + 1); ctx.restore(); };
  const big = (ctx, text, x, y, size, color) => { ctx.save(); ctx.font = `900 ${size}px system-ui`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.lineWidth = size / 7; ctx.strokeStyle = "#fff"; ctx.strokeText(text, x, y); ctx.fillStyle = color || "#1f2937"; ctx.fillText(text, x, y); ctx.restore(); };
  const shakeKids = (A, at, amp, ms) => A.kids().forEach(el => A.ani(el, [{ transform: "none" }, { transform: `translate(${-amp}px,${amp * .7}px)` }, { transform: `translate(${amp}px,${-amp * .6}px)` }, { transform: `translate(${-amp * .6}px,${amp * .4}px)` }, { transform: "none" }], { duration: ms || 320, delay: at }));
  const confetti = (list, x, y, n) => { for (let k = 0; k < n; k++) list.push({ x, y, vx: (Math.random() - .5) * 10, vy: -Math.random() * 9 - 2, c: ["#f43f5e", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7", "#fde047"][k % 6], a: 1 }); };
  const drawBits = (ctx, list) => { for (let i = list.length - 1; i >= 0; i--) { const p = list[i]; p.x += p.vx; p.y += p.vy; p.vy += .3; p.a -= .014; if (p.a <= 0) { list.splice(i, 1); continue; } ctx.globalAlpha = p.a; ctx.fillStyle = p.c; ctx.fillRect(p.x, p.y, 7, 4); } ctx.globalAlpha = 1; };

  // 🪢 WHIPPED: a whip lashes across the screen three times; CRACK, the page jolts
  Weather.add("whip,whips,whipped,whipping,lash,lashed,crack of the whip", { e: "🪢", name: "Whip crack", dur: 4200 }, A => {
    const hits = [500, 1700, 2900]; hits.forEach((ms, i) => { A.noise(.09, .55, "band", 4200, 2400, 3, ms / 1000); A.kids().forEach(el => A.ani(el, [{ transform: "none" }, { transform: `translateX(${i % 2 ? -14 : 14}px) skewX(${i % 2 ? 3 : -3}deg)` }, { transform: "none" }], { duration: 260, delay: ms })); });
    return { frame(t) { const { ctx } = A, W = A.W(), H = A.H();
      hits.forEach((ms, i) => { const d = t - ms + 420; if (d < 0 || d > 700) return; const k = Math.min(1, d / 420), y0 = H * (.3 + i * .2), dir = i % 2 ? -1 : 1, x0 = dir > 0 ? -20 : W + 20;
        ctx.strokeStyle = "#5b3a1e"; ctx.lineCap = "round"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x0, y0 + 60); const pts = 30; for (let j = 1; j <= pts; j++) { const u = j / pts * k; ctx.lineTo(x0 + dir * u * W * .9, y0 + 60 - Math.sin(u * Math.PI) * 120 * (1 - k * .6) + Math.sin(u * 14 - d / 40) * 18 * (1 - u)); ctx.lineWidth = 6 - 4.5 * (j / pts); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x0 + dir * u * W * .9, y0 + 60 - Math.sin(u * Math.PI) * 120 * (1 - k * .6) + Math.sin(u * 14 - d / 40) * 18 * (1 - u)); }
        if (d > 400 && d < 650) { const cx = x0 + dir * k * W * .9, cy = y0 + 60 - Math.sin(k * Math.PI) * 120 * (1 - k * .6); ctx.strokeStyle = "#fde047"; ctx.lineWidth = 3; for (let s = 0; s < 10; s++) { const a = s * .63; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * 10, cy + Math.sin(a) * 10); ctx.lineTo(cx + Math.cos(a) * 34, cy + Math.sin(a) * 34); ctx.stroke(); } big(ctx, "CRACK!", cx - dir * 40, cy - 46, 34, "#b91c1c"); } }); } };
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

  // 🦁 BEAST: the screen cracks from the middle, shatters, and a curious animal pushes its head through, roars, then looks around
  Weather.add("beast,beasts,beastly,monster,monsters,creature,creatures,wild animal,ferocious,roar,roared,roaring", { e: "🦁", name: "Beast", dur: 8000, top: 1 }, A => {
    const who = ["🦁", "🐻", "🐯", "🦍", "🐺"][Math.floor(Math.random() * 5)], cracks = [], shards = [];
    for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2 + Math.random() * .3, pts = [[0, 0]]; let rr = 0; while (rr < 1.2) { rr += .08 + Math.random() * .1; pts.push([Math.cos(a + (Math.random() - .5) * .35) * rr, Math.sin(a + (Math.random() - .5) * .35) * rr]); } cracks.push(pts); }
    [500, 1100, 1700].forEach((ms, i) => { A.noise(.25, .35 + i * .1, "band", 3000, 1200, 2, ms / 1000); shakeKids(A, ms, 4 + i * 3); });
    A.noise(.4, .5, "band", 2500, 800, 1, 2.3); shakeKids(A, 2300, 14, 500);
    setTimeout(() => { try { A.boom(0); A.noise(1.6, .45, "lowpass", 220, 90, 1); } catch (e) {} }, 2900);
    return { frame(t, life) { const { ctx } = A, W = A.W(), H = A.H(), cx = W / 2, cy = H / 2, S = Math.max(W, H) * .5;
      const crackK = t < 500 ? 0 : t < 2300 ? Math.min(1, (t - 500) / 1800) : 1;
      if (t > 2300 && !shards.length) for (let i = 0; i < 40; i++) { const a = Math.random() * 7, r0 = Math.random() * S * .35; shards.push({ x: cx + Math.cos(a) * r0, y: cy + Math.sin(a) * r0, vx: Math.cos(a) * (3 + Math.random() * 6), vy: Math.sin(a) * (3 + Math.random() * 6) - 3, s: 10 + Math.random() * 26, rot: Math.random() * 6, vr: (Math.random() - .5) * .3 }); }
      if (crackK) { ctx.strokeStyle = "rgba(255,255,255,.95)"; ctx.shadowColor = "#000"; ctx.shadowBlur = 3; ctx.lineWidth = 2.5; cracks.forEach(pts => { const m = Math.max(2, Math.floor(pts.length * crackK)); ctx.beginPath(); pts.slice(0, m).forEach(([x, y], j) => j ? ctx.lineTo(cx + x * S, cy + y * S) : ctx.moveTo(cx + x * S, cy + y * S)); ctx.stroke(); }); ctx.shadowBlur = 0;
        for (let ring = 1; ring <= 3; ring++) { if (crackK < ring / 3) break; ctx.beginPath(); for (let i = 0; i <= 14; i++) { const p = cracks[i % 14], q = p[Math.min(p.length - 1, ring * 3)]; i ? ctx.lineTo(cx + q[0] * S, cy + q[1] * S) : ctx.moveTo(cx + q[0] * S, cy + q[1] * S); } ctx.stroke(); } }
      const hole = t > 2300 ? Math.min(1, (t - 2300) / 300) * S * .42 : 0;
      if (hole) { ctx.fillStyle = "#0b0b0b"; ctx.beginPath(); for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2, rr = hole * (.8 + (i % 2) * .25); i ? ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr) : ctx.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } ctx.closePath(); ctx.fill();
        const pop = Math.min(1, (t - 2450) / 350), look = t > 3600 ? Math.sin((t - 3600) / 450) * .28 : 0, sz = hole * 1.7 * Math.max(0, pop) * (t > 2900 && t < 3500 ? 1.08 + Math.sin(t / 30) * .03 : 1);
        if (pop > 0) { em(ctx, who, cx + Math.sin(look) * 20, cy + 10, sz, look); if (t > 2900 && t < 3600) big(ctx, "ROAR!", cx, cy - hole - 30, 54, "#b45309"); if (t > 3800 && life < .9) bubble(ctx, "Hmm? 🤔", cx + hole * .9, cy - hole * .75, 22); } }
      shards.forEach(sh => { sh.vy += .4; sh.x += sh.vx; sh.y += sh.vy; sh.rot += sh.vr; ctx.save(); ctx.translate(sh.x, sh.y); ctx.rotate(sh.rot); ctx.fillStyle = "rgba(200,230,255,.55)"; ctx.strokeStyle = "rgba(255,255,255,.9)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-sh.s / 2, -sh.s / 3); ctx.lineTo(sh.s / 2, -sh.s / 2); ctx.lineTo(sh.s / 4, sh.s / 2); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); }); } };
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
  Weather.add("scamper,scampers,scampered,scampering,scurry,scurries,scurried,scurrying,dart,darted,darting,skitter,skittered,scuttle,scuttled", { e: "🐁", name: "Scamper", dur: 9000, track: 1 }, A => {
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

  Weather.rescan();
})();
