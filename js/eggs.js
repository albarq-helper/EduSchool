/* 🥚 Hidden-word Easter eggs: finds a little thing hiding inside a word (preCARious, deliberATely → rat) and acts it out:
   the letters light up, turn into the thing (🚗, 🐀 …), it makes its sound, runs off and leaves a gap, then comes back.
   It plays by itself the first time a word appears on this device; the small emoji button after the word replays it. */
(function () {
  "use strict";
  // thing → [emoji, how it moves, sound]. Movers: drive, scurry, fly, hop, swim, roll. Emoji mostly face left, so they leave to the left.
  // Groups go in priority order (animals and vehicles beat objects); inside a group the longest hidden word wins.
  const GROUPS = [
    { car: ["🚗", "drive", "engine"], bus: ["🚌", "drive", "engine"], van: ["🚐", "drive", "engine"], cab: ["🚕", "drive", "engine"], train: ["🚆", "drive", "horn"],
      jet: ["✈️", "fly", "whoosh"], ship: ["🚢", "swim", "horn"], boat: ["⛵", "swim", "whoosh"], bike: ["🚲", "drive", "beep"] },
    { rat: ["🐀", "scurry", "squeak"], mouse: ["🐁", "scurry", "squeak"], cat: ["🐈", "hop", "meow"], dog: ["🐕", "hop", "woof"],
      bat: ["🦇", "fly", "flap"], bee: ["🐝", "fly", "buzz"], owl: ["🦉", "fly", "hoot"], hen: ["🐔", "hop", "cluck"],
      ant: ["🐜", "scurry", "tick"], pig: ["🐖", "hop", "oink"], cow: ["🐄", "hop", "moo"], fox: ["🦊", "hop", "boing"],
      ape: ["🦍", "hop", "boing"], yak: ["🐂", "hop", "moo"], lion: ["🦁", "hop", "roar"], bear: ["🐻", "hop", "roar"],
      deer: ["🦌", "hop", "boing"], goat: ["🐐", "hop", "boing"], seal: ["🦭", "swim", "boing"], crab: ["🦀", "scurry", "tick"],
      frog: ["🐸", "hop", "boing"], duck: ["🦆", "swim", "quack"], wolf: ["🐺", "hop", "roar"], horse: ["🐎", "hop", "neigh"],
      tuna: ["🐟", "swim", "splash"], fish: ["🐟", "swim", "splash"], hare: ["🐇", "hop", "boing"], lamb: ["🐑", "hop", "boing"], moth: ["🦋", "fly", "flap"] },
    { heart: ["❤️", "hop", "pop"], tent: ["⛺", "hop", "pop"], nest: ["🪺", "hop", "pop"], star: ["⭐", "fly", "ding"], pear: ["🍐", "roll", "pop"],
      pea: ["🫛", "roll", "pop"], tea: ["🍵", "hop", "pop"], ink: ["🖋️", "hop", "pop"], art: ["🎨", "hop", "ding"], hat: ["🎩", "fly", "whoosh"],
      arm: ["💪", "hop", "boing"], leg: ["🦵", "hop", "boing"], ear: ["👂", "hop", "ding"], one: ["☝️", "hop", "ding"], ten: ["🔟", "hop", "ding"],
      pen: ["🖊️", "hop", "pop"], pin: ["📌", "hop", "pop"], can: ["🥫", "roll", "thud"], tie: ["👔", "fly", "whoosh"], fan: ["🪭", "fly", "whoosh"],
      ice: ["🧊", "scurry", "ding"], pot: ["🍲", "hop", "pop"], band: ["🥁", "hop", "drum"], book: ["📖", "fly", "flap"], rock: ["🪨", "roll", "thud"],
      wing: ["🪽", "fly", "flap"], log: ["🪵", "roll", "thud"], oak: ["🌳", "hop", "whoosh"], elm: ["🌳", "hop", "whoosh"], fir: ["🌲", "hop", "whoosh"] }
  ];
  const THINGS = Object.assign({}, ...GROUPS);
  // Pairs that are part of a common ending or start, not a real hiding place (importANT, wHEN, friendSHIP, adoRATion …).
  const SKIP = { pin: /ping$/, ant: /ant$|ants$/, hen: /^w?hen|^t?hen/, ship: /ships?$/, rat: /ration/, one: /^one/, ten: /tens?$/, can: /^can/ };
  const NEVER = /^(behead)$/;                       // words where a joke would be wrong
  // Words we want for sure, even if the rules above would pick something else.
  const FEATURED = { precarious: "car", deliberately: "rat", separate: "rat", scarce: "car", vicarious: "car", pirate: "rat", heartbroken: "heart", insignificant: "can", significant: "can" };

  const letters = w => String(w || "").toLowerCase().replace(/[^a-z]/g, "");
  function find(word) {
    const w = String(word || "").replace(/\s*\(.*\)\s*$/, "").trim(), lw = w.toLowerCase();
    if (!/^[A-Za-z][A-Za-z'-]*$/.test(w) || w.length < 5 || NEVER.test(lw)) return null;
    const pick = (key, at) => ({ key, at, emoji: THINGS[key][0], move: THINGS[key][1], sound: THINGS[key][2], word: w });
    const f = FEATURED[letters(w)];
    if (f && lw.indexOf(f) >= 0) return pick(f, lw.indexOf(f));
    for (const g of GROUPS) {
      for (const k of Object.keys(g).sort((a, b) => b.length - a.length)) {
        const at = lw.indexOf(k);
        if (at < 0 || lw.length < k.length + 2 || (SKIP[k] && SKIP[k].test(lw))) continue;
        return pick(k, at);
      }
    }
    return null;
  }

  // 🔊 tiny synthesized sounds (no files, no downloads)
  let AC = null;
  const ac = () => { try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === "suspended") AC.resume(); } catch (e) { AC = null; } return AC; };
  ["pointerdown", "keydown"].forEach(t => addEventListener(t, () => ac(), { once: true, capture: true }));
  function tone(type, f0, f1, t0, dur, vol, filt) {
    const a = ac(); if (!a || a.state !== "running") return;
    const o = a.createOscillator(), g = a.createGain(), now = a.currentTime + t0;
    o.type = type; o.frequency.setValueAtTime(f0, now); o.frequency.exponentialRampToValueAtTime(Math.max(f1, 1), now + dur);
    g.gain.setValueAtTime(0.0001, now); g.gain.exponentialRampToValueAtTime(vol, now + Math.min(0.04, dur / 3)); g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    let last = o;
    if (filt) { const bq = a.createBiquadFilter(); bq.type = "lowpass"; bq.frequency.value = filt; o.connect(bq); last = bq; }
    last.connect(g); g.connect(a.destination); o.start(now); o.stop(now + dur + 0.05);
  }
  function noise(t0, dur, vol, from, to) {
    const a = ac(); if (!a || a.state !== "running") return;
    const n = a.createBufferSource(), b = a.createBuffer(1, a.sampleRate * dur, a.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    n.buffer = b; const bq = a.createBiquadFilter(), g = a.createGain(), now = a.currentTime + t0;
    bq.type = "bandpass"; bq.frequency.setValueAtTime(from, now); bq.frequency.exponentialRampToValueAtTime(to, now + dur);
    g.gain.setValueAtTime(vol, now); g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    n.connect(bq); bq.connect(g); g.connect(a.destination); n.start(now);
  }
  const SOUNDS = {
    engine: s => { tone("sawtooth", 55, 70, s, 0.5, 0.18, 400); tone("sawtooth", 70, 210, s + 0.45, 0.9, 0.2, 900); },
    horn: s => { tone("square", 392, 392, s, 0.18, 0.12, 1800); tone("square", 392, 392, s + 0.25, 0.3, 0.12, 1800); },
    beep: s => { tone("square", 523, 523, s, 0.12, 0.1, 2400); tone("square", 523, 523, s + 0.18, 0.16, 0.1, 2400); },
    squeak: s => { [0, 0.16, 0.3].forEach(d => tone("sine", 1900, 3200, s + d, 0.1, 0.12)); },
    meow: s => { tone("triangle", 500, 900, s, 0.25, 0.15, 2500); tone("triangle", 900, 450, s + 0.25, 0.35, 0.15, 2500); },
    woof: s => { tone("square", 180, 110, s, 0.15, 0.2, 700); tone("square", 190, 110, s + 0.22, 0.18, 0.2, 700); },
    buzz: s => { tone("sawtooth", 210, 240, s, 1.1, 0.07, 1200); },
    flap: s => { [0, 0.12, 0.24, 0.36].forEach(d => noise(s + d, 0.08, 0.25, 900, 300)); },
    hoot: s => { tone("sine", 420, 380, s, 0.3, 0.2); tone("sine", 420, 360, s + 0.45, 0.45, 0.2); },
    cluck: s => { [0, 0.14, 0.28].forEach(d => tone("square", 700, 400, s + d, 0.07, 0.1, 1600)); },
    tick: s => { [0, 0.08, 0.16, 0.24, 0.32].forEach(d => tone("square", 2400, 2000, s + d, 0.025, 0.06)); },
    oink: s => { tone("sawtooth", 260, 180, s, 0.22, 0.15, 900); tone("sawtooth", 280, 190, s + 0.3, 0.22, 0.15, 900); },
    moo: s => { tone("sawtooth", 150, 120, s, 0.9, 0.16, 600); },
    roar: s => { tone("sawtooth", 140, 70, s, 0.8, 0.2, 500); noise(s, 0.8, 0.15, 600, 200); },
    quack: s => { tone("sawtooth", 600, 400, s, 0.15, 0.12, 1500); tone("sawtooth", 600, 400, s + 0.22, 0.15, 0.12, 1500); },
    boing: s => { tone("sine", 200, 700, s, 0.3, 0.18); },
    whoosh: s => { noise(s, 0.7, 0.3, 300, 3000); },
    neigh: s => { tone("sawtooth", 900, 1400, s, 0.25, 0.1, 2500); tone("sawtooth", 1300, 600, s + 0.25, 0.5, 0.1, 2500); },
    splash: s => { noise(s, 0.4, 0.35, 1500, 400); tone("sine", 900, 300, s + 0.05, 0.2, 0.08); },
    ding: s => { tone("sine", 1320, 1320, s, 0.6, 0.12); tone("sine", 1980, 1980, s + 0.02, 0.5, 0.05); },
    pop: s => { tone("sine", 300, 1200, s, 0.08, 0.2); },
    drum: s => { [0, .15, .3, .38].forEach(d => { tone("sine", 160, 60, s + d, 0.15, 0.3); noise(s + d, 0.06, 0.15, 3000, 2000); }); },
    thud: s => { tone("sine", 120, 45, s, 0.3, 0.35); }
  };
  const play = (name, at) => { try { (SOUNDS[name] || SOUNDS.boing)(at || 0); } catch (e) {} };

  // 🎬 the act
  const css = document.createElement("style");
  css.textContent = `.egg-hit{display:inline-block;border-radius:6px;transition:background .3s,color .3s}
.egg-hit.glow{background:#FFE58A;color:#7A4B00!important;box-shadow:0 0 0 3px #FFE58A}
.egg-gap{display:inline-block;border-bottom:3px dashed #E0A400;color:transparent!important}
.egg-actor{position:fixed;z-index:9999;pointer-events:none;line-height:1;will-change:transform}
.egg-btn{border:0;background:none;cursor:pointer;font-size:.8em;padding:0 4px;vertical-align:middle;opacity:.85;filter:saturate(1.1)}
.egg-btn:hover{opacity:1;transform:scale(1.15)}
.egg-say{position:fixed;z-index:9999;pointer-events:none;font:800 14px var(--f-display,system-ui);background:#fff;color:#333;border-radius:12px;padding:4px 8px;box-shadow:0 2px 8px #0003}`;
  document.head.appendChild(css);
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const anim = (el, frames, opt) => new Promise(r => { try { const a = el.animate(frames, opt); a.onfinish = r; a.oncancel = r; } catch (e) { r(); } });
  const reduce = () => matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const busy = new WeakSet();

  async function act(el, word, egg) {
    if (busy.has(el) || !el.isConnected) return;
    busy.add(el);
    const keep = el.innerHTML, w = String(word);
    const pre = w.slice(0, egg.at), mid = w.slice(egg.at, egg.at + egg.key.length), post = w.slice(egg.at + egg.key.length);
    el.innerHTML = `<span>${esc(pre)}</span><span class="egg-hit">${esc(mid)}</span><span>${esc(post)}</span>`;
    const hit = el.querySelector(".egg-hit");
    try {
      hit.classList.add("glow");
      await anim(hit, [{ transform: "translateY(0)" }, { transform: "translateY(-.25em) scale(1.15)" }, { transform: "translateY(0)" }], { duration: 380, iterations: 2 });
      const r = hit.getBoundingClientRect(), size = Math.max(28, r.height * 1.4);
      const actor = document.createElement("span");
      actor.className = "egg-actor"; actor.textContent = egg.emoji; actor.setAttribute("aria-hidden", "true");
      Object.assign(actor.style, { left: (r.left + r.width / 2 - size / 2) + "px", top: (r.top + r.height / 2 - size / 2) + "px", fontSize: size + "px" });
      document.body.appendChild(actor);
      hit.classList.remove("glow"); hit.classList.add("egg-gap");
      await anim(actor, [{ transform: "scale(0) rotate(-30deg)" }, { transform: "scale(1.35) rotate(8deg)" }, { transform: "scale(1)" }], { duration: 420, easing: "ease-out" });
      play(egg.sound);
      const say = bubble(actor, egg);
      const away = -(r.left + size * 2);              // off the left edge of the screen
      if (egg.move === "drive") {
        await anim(actor, [{ transform: "translate(0,0)" }, { transform: "translate(1px,-1px)" }, { transform: "translate(-1px,1px)" }, { transform: "translate(0,0)" }], { duration: 120, iterations: 4 });
        puff(r);
        await anim(actor, [{ transform: "translateX(0)" }, { transform: `translateX(${away}px)` }], { duration: 1100, easing: "cubic-bezier(.5,0,.9,.4)" });
      } else if (egg.move === "scurry") {
        await anim(actor, [{ transform: "translate(0,0)" }, { transform: `translate(${away * .25}px,-14px)` }, { transform: `translate(${away * .5}px,10px)` }, { transform: `translate(${away * .75}px,-10px)` }, { transform: `translate(${away}px,0)` }], { duration: 900, easing: "ease-in" });
      } else if (egg.move === "fly") {
        await anim(actor, [{ transform: "translate(0,0) rotate(0)" }, { transform: `translate(${away * .4}px,-90px) rotate(-12deg)` }, { transform: `translate(${away}px,-200px) rotate(-20deg)` }], { duration: 1300, easing: "ease-in" });
      } else if (egg.move === "swim") {
        await anim(actor, [{ transform: "translate(0,0)" }, { transform: `translate(${away * .33}px,8px)` }, { transform: `translate(${away * .66}px,-8px)` }, { transform: `translate(${away}px,0)` }], { duration: 1400, easing: "ease-in-out" });
      } else if (egg.move === "roll") {
        await anim(actor, [{ transform: "translateX(0) rotate(0)" }, { transform: `translateX(${away}px) rotate(${Math.round(away / 2)}deg)` }], { duration: 1300, easing: "ease-in" });
      } else {
        await anim(actor, [0, .2, .4, .6, .8, 1].map((p, i) => ({ transform: `translate(${away * p}px,${i % 2 ? -40 : 0}px)` })), { duration: 1200, easing: "linear" });
      }
      if (say) say.remove();
      await sleep(1300);                               // the word sits there with a hole in it
      // …and it comes back, from the other side of the screen
      const back = innerWidth - r.left + size;
      actor.style.transform = `translateX(${back}px)`;
      if (egg.move === "drive") play("beep"); else play(egg.sound);
      await anim(actor, [{ transform: `translateX(${back}px)` }, { transform: "translateX(0)" }], { duration: 1000, easing: "cubic-bezier(.2,.6,.3,1)", fill: "forwards" });
      await anim(actor, [{ transform: "scale(1)" }, { transform: "scale(0)" }], { duration: 300, fill: "forwards" });
      actor.remove();
      hit.classList.remove("egg-gap"); hit.classList.add("glow");
      await anim(hit, [{ transform: "scale(0)" }, { transform: "scale(1.2)" }, { transform: "scale(1)" }], { duration: 350 });
      await sleep(700);
    } finally {
      if (el.isConnected) el.innerHTML = keep;
      document.querySelectorAll(".egg-actor").forEach(a => a.remove());
      busy.delete(el);
    }
  }
  function bubble(actor, egg) {
    const r = actor.getBoundingClientRect(), b = document.createElement("span");
    b.className = "egg-say"; b.textContent = (egg.move === "drive" ? "Vroom! " : "") + `A ${egg.key}!`;
    Object.assign(b.style, { left: r.left + "px", top: Math.max(4, r.top - 30) + "px" });
    document.body.appendChild(b); return b;
  }
  function puff(r) {
    const p = document.createElement("span");
    p.className = "egg-actor"; p.textContent = "💨";
    Object.assign(p.style, { left: (r.right + 4) + "px", top: (r.top) + "px", fontSize: Math.max(18, r.height) + "px" });
    document.body.appendChild(p);
    anim(p, [{ opacity: 1, transform: "scale(.6)" }, { opacity: 0, transform: "scale(1.6) translateX(20px)" }], { duration: 900 }).then(() => p.remove());
  }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // 👀 watch the page: a word element is `.syl[aria-label]` (word cards), `.term` (flash cards) or anything with data-egg="word"
  const SEEN_KEY = "eggs-seen-v1";
  const seen = (() => { try { return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || "[]")); } catch (e) { return new Set(); } })();
  const remember = w => { seen.add(w); try { localStorage.setItem(SEEN_KEY, JSON.stringify([...seen].slice(-500))); } catch (e) {} };
  let lastAuto = 0;
  const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, w = el.dataset.eggWord, egg = find(w);
    io.unobserve(el);
    if (!egg || seen.has(letters(w)) || reduce() || Date.now() - lastAuto < 9000) return;
    lastAuto = Date.now(); remember(letters(w));
    setTimeout(() => act(el, w, egg), 600);
  }), { threshold: 0.9 }) : null;

  function wordOf(el) { return el.dataset.egg || el.getAttribute("aria-label") || el.textContent; }
  function scan(root) {
    (root.querySelectorAll ? root : document).querySelectorAll(".syl[aria-label], .term, [data-egg]").forEach(el => {
      if (el.dataset.eggDone || el.closest(".egg-off")) return;
      const w = String(wordOf(el) || "").trim(), egg = find(w);
      el.dataset.eggDone = "1";
      if (!egg) return;
      el.dataset.eggWord = w;
      const btn = document.createElement("button");
      btn.type = "button"; btn.className = "egg-btn"; btn.textContent = egg.emoji;
      btn.title = `Something is hiding in “${w}”… tap to find it!`;
      btn.setAttribute("aria-label", `Find the ${egg.key} hiding in ${w}`);
      btn.addEventListener("click", ev => { ev.preventDefault(); ev.stopPropagation(); ac(); act(el, w, egg); });
      el.insertAdjacentElement("afterend", btn);
      if (io) io.observe(el);
    });
  }
  const mo = new MutationObserver(ms => { if (ms.some(m => m.addedNodes.length)) scan(document); });
  const start = () => { scan(document); mo.observe(document.body, { childList: true, subtree: true }); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
  window.Eggs = { find, act, scan, THINGS };
})();
