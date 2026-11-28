/* 🌦️ Word weather: when a weather word appears, the whole page acts it out for a few seconds.
   Hurricane spins the page into a 🌀, rain words make it rain (stronger along the Dry → Soaked meter), wind words blow
   (stronger along Hurricane → Breeze), storms flash and thunder, snow falls, fog rolls in, night goes dark …
   Loaded on the fly: word cards (.syl[aria-label]), flash cards (.term), [data-wx="word"], or Weather.play(word) from code. */
(function () {
  "use strict";
  // word → recipe. Numbers are strength 1–5 (taken from the meters where a meter exists).
  const R = {}, FX = {};
  // every word keeps ALL its effects (V), not only the last one (R); ALSO links related effects (beam → sunbeam, moonbeam, laser…)
  const V = {}, ALSO = {};
  const add = (ws, r) => ws.split(",").forEach(w => { w = w.trim(); R[w] = r; (V[w] = V[w] || []).includes(r) || V[w].push(r); });
  add("hurricane,tornado,cyclone,typhoon,twister", { e: "🌀", name: "Hurricane", wind: 5, vortex: 1, rain: 3 });
  add("gale", { e: "🌬️", name: "Gale", wind: 4, rain: 1 });
  add("wind,windy,blustery", { e: "💨", name: "Wind", wind: 3 });
  add("gust,gusty", { e: "💨", name: "Gust", wind: 2, gust: 1 });
  // 👀 being watched: big eyes follow your finger; binoculars let you spy on the page
  add("peep,peeps,peeped,peeping,peek,peeks,peeked,peeking,peephole,keyhole", { e: "🕳️", name: "Peep", peep: 1, dur: 9000 });
  add("look,looks,looked,looking,watch,watched,watching,stare,stared,staring,gaze,gazed,gazing,glance,glanced,notice,noticed", { e: "👀", name: "Watching you", eyes: 1, long: 1, dur: 10000 });
  // 🔍 a magnifying glass over the page: everything under it twice as big, and the word under it in large letters
  add("observe,observed,observes,observing,observation,observant,examine,examined,inspect,inspected,magnify,magnified,magnifying,magnifying glass,magnifier,study,studied,detail,details,detailed,closely,scrutinize", { e: "🔍", name: "Magnifier", mag: 2.2, long: 1, dur: 20000 });
  add("spy,spied,spying,binoculars,scan,scanned,survey,surveyed,lookout,peer,peered,peering", { e: "🔭", name: "Spy", bino: 1, long: 1, dur: 14000 });
  add("separate,separated,separates,separating,separation,split,splits,splitting,divide,divided,dividing,apart,torn,tear apart,rip,ripped,halves,half", { e: "✂️", name: "Separated", split: 1, dur: 6500 });
  add("rifle,rifles,gun,guns,shoot,shoots,shooting,bullet,bullets,aim,aimed,aiming,target,targets,marksman,sniper", { e: "🎯", icon: "<svg viewBox=\"0 0 64 18\" width=\"30\" height=\"9\" style=\"vertical-align:middle\" aria-hidden=\"true\"><path d=\"M2 8 L14 6 L16 14 L4 15 Z\" fill=\"#8b5a2b\"/><rect x=\"14\" y=\"6\" width=\"16\" height=\"5\" rx=\"1\" fill=\"#374151\"/><rect x=\"30\" y=\"7\" width=\"32\" height=\"2.4\" fill=\"#1f2937\"/><rect x=\"18\" y=\"2\" width=\"10\" height=\"3\" rx=\"1.5\" fill=\"#111827\"/><path d=\"M22 11 L24 15 L26 11\" fill=\"none\" stroke=\"#374151\" stroke-width=\"1.4\"/></svg>", name: "Rifle · target practice", rifle: 1, long: 1, dur: 20000 });
  add("stomp,stomps,stomped,stomping,trample,trampled,trampling,thud,thump,thumped,clomp,clomped,giant footsteps", { e: "🦶", name: "Stomp", stomp: [600, 1500, 2400, 3300, 4200], dur: 6200 });
  add("faraway,far away,far off,far-off,distant,distance,far,afar,vanish,vanished,disappear,disappeared", { e: "🛣️", name: "Far away", far: 1, dur: 7000 });
  add("sway,sways,swayed,swaying,swing,swinging,rocking,wobble,wobbly", { e: "🌴", name: "Sway", sway: 1 });
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
  const keyOf = w => { const k = String(w || "").trim().toLowerCase().replace(/[’]/g, "'").replace(/[.!?]$/, ""); return R[k] ? k : k.replace(/\s*\([^)]*\)\s*$/, ""); }; // "Impact (hit)" = impact
  const recipe = w => R[keyOf(w)] || null;
  const variants = w => { const k = keyOf(w), out = []; [...(R[k] ? [R[k]] : []), ...(V[k] || []), ...(ALSO[k] || []).flatMap(a => V[a] || [])].forEach(r => { if (!out.includes(r) && !out.some(o => o.name === r.name)) out.push(r); }); return out; };

  // 📦 Meters: where an effect plays while a kid moves the meter. "full" = the whole screen, "box" = inside the box under the meter,
  // "off" = only when the kid taps ⤢. Set per effect in the word_effects table (effects.html); these are the defaults.
  const PAGE_NAMES = new Set(["Storm swallows the page"]);
  const boxable = r => !!r && !(r.vortex || r.split || r.far || r.stomp || r.sway || r.wind || r.mag || r.rifle || r.torch || r.laser || r.puddle || r.drip || r.nocursor || PAGE_NAMES.has(r.name));
  const FULL_BY_DEFAULT = new Set("Hurricane,Gale,Wind,Gust,Breeze,Storm,Thunder,Rain,Drizzle,Shower,Downpour,Flood,Snow,Blizzard,Sleet,Hail,Sun,Heat,Golden hour,Rainbow,Raining cats and dogs,Sway,Storm swallows the page,Soaked,Stomp,Separated,Far away".split(","));
  const BEH = {};
  let behLoaded = null;
  const loadBehaviours = () => behLoaded || (behLoaded = new Promise(res => { const done = () => res(BEH); setTimeout(done, 1500);
    try { if (window.App && App.client) { App.client.from("word_effects").select("effect,in_meter").then(x => { (x.data || []).forEach(e => BEH[e.effect] = e.in_meter); done(); }, done); return; } } catch (e) {} done(); }));
  const behaviour = w => { const r = typeof w === "object" ? w : recipe(w); if (!r) return "off"; const b = BEH[r.name] || (FULL_BY_DEFAULT.has(r.name) ? "full" : boxable(r) ? "box" : "off"); return b === "box" && !boxable(r) ? "off" : b; };

  // 🔊 sounds (synthesized, no files)
  let AC = null;
  const ac = () => { try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === "suspended") AC.resume(); } catch (e) { AC = null; } return AC; };
  ["pointerdown", "keydown"].forEach(t => addEventListener(t, () => ac(), { once: true, capture: true }));
  function noise(dur, vol, type, f0, f1, q, t0) { try { return noise0(dur, vol, type, f0, f1, q, t0); } catch (e) { return null; } }
  function noise0(dur, vol, type, f0, f1, q, t0) {
    const a = ac(); if (!a || a.state !== "running") return null;
    const len = Math.floor(a.sampleRate * dur), b = a.createBuffer(1, len, a.sampleRate), d = b.getChannelData(0);
    let last = 0; for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; last = type === "lowpass" ? (last + 0.02 * w) / 1.02 : w; d[i] = type === "lowpass" ? last * 3.5 : w; }
    const n = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain(), now = a.currentTime + (t0 || 0);
    n.buffer = b; f.type = type === "lowpass" ? "lowpass" : "bandpass"; f.Q.value = q || 1;
    f.frequency.setValueAtTime(f0, now); f.frequency.linearRampToValueAtTime(f1, now + dur * 0.6); f.frequency.linearRampToValueAtTime(dur < 1 ? f1 : f0, now + dur);
    const att = Math.min(0.6, dur * 0.15), rel = Math.min(0.9, dur * 0.6); // short sounds (a bang, a pop) get a fast attack and release
    g.gain.setValueAtTime(0.0001, now); g.gain.exponentialRampToValueAtTime(vol, now + att); g.gain.setValueAtTime(vol, now + Math.max(att, dur - rel)); g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
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
    if (r.stomp) r.stomp.forEach(ms => boom(ms / 1000));
    if (r.split) { s.push(noise(1.2, 0.16, "band", 1800, 4200, 3, 0.1)); s.push(noise(0.5, 0.08, "band", 300, 200, 1, dur - 1.1)); }
    if (r.far) { s.push(noise(2.6, 0.12, "band", 1400, 250, 1.5)); s.push(noise(2.4, 0.08, "band", 250, 1200, 1.5, dur - 2.6)); }
    if (r.sway) s.push(noise(dur, 0.06, "band", 350, 700, 2));
    if (r.glass && !r.trickles) s.push(noise(dur, 0.02, "lowpass", 400, 300, 1));
    if (r.trickles || r.drip) for (let i = 0; i < (r.drip ? 14 : 6); i++) plink(0.5 + Math.random() * (dur - 1));
    if (r.wring) [1.2, 2.4, 3.6].forEach(t => noise(0.5, 0.12, "band", 700, 300, 2, t));
    return { stop: () => s.forEach(x => x && x.stop()) };
  }
  function plink(t0) { const a = ac(); if (!a || a.state !== "running") return; const o = a.createOscillator(), g = a.createGain(), n = a.currentTime + t0, f = 900 + Math.random() * 700; o.type = "sine"; o.frequency.setValueAtTime(f, n); o.frequency.exponentialRampToValueAtTime(f * 2.2, n + .06); g.gain.setValueAtTime(.0001, n); g.gain.exponentialRampToValueAtTime(.06, n + .01); g.gain.exponentialRampToValueAtTime(.0001, n + .18); o.connect(g); g.connect(a.destination); o.start(n); o.stop(n + .2); }
  function boom(t0) { const a = ac(); if (!a || a.state !== "running") return; try { const o = a.createOscillator(), g = a.createGain(), n = a.currentTime + t0; o.type = "sine"; o.frequency.setValueAtTime(90, n); o.frequency.exponentialRampToValueAtTime(32, n + .45); g.gain.setValueAtTime(.0001, n); g.gain.exponentialRampToValueAtTime(.7, n + .015); g.gain.exponentialRampToValueAtTime(.0001, n + .6); o.connect(g); g.connect(a.destination); o.start(n); o.stop(n + .65); } catch (e) {} noise(0.35, 0.35, "lowpass", 300, 120, 1, t0); }
  function bang() { noise(0.35, 0.5, "lowpass", 900, 120, 1); noise(0.08, 0.35, "band", 3000, 1500, 1); }
  function pop() { noise(0.12, 0.3, "band", 2500, 900, 2); plink(0.05); }
  function thunder(t0) { noise(2.4, 0.5, "lowpass", 120, 60, 1, t0); }

  // 🎨 the stage: a full-screen canvas above the page that ignores clicks
  const css = document.createElement("style");
  css.textContent = `.wx-stage{position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:9990;pointer-events:none}
.wx-layer{position:fixed;inset:0;z-index:9989;pointer-events:none;transition:opacity .8s}
.wx-stage.wx-boxed{border-radius:14px}.wx-chip.inbox [data-off]{display:none}.wx-chip.inbox{flex-wrap:nowrap;position:absolute;bottom:6px;top:auto;left:50%;max-width:calc(100% - 12px);font-size:12px;padding:3px 6px 3px 10px}
.wx-chip{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:9995;display:flex;gap:6px;align-items:center;background:#fff;border-radius:999px;padding:6px 8px 6px 12px;box-shadow:0 4px 18px #0003;font:700 14px var(--f-display,system-ui);color:#333}
.wx-chip,.wx-chip *{cursor:auto;white-space:nowrap}.wx-chip{flex-wrap:wrap;justify-content:center;max-width:96vw}.wx-chip.top{bottom:auto;top:12px}.wx-chip button{cursor:pointer;border:0;border-radius:999px;padding:4px 10px;font:inherit;cursor:pointer;background:#F1F1F4}
.wx-btn{border:0;background:none;cursor:pointer;font-size:.8em;padding:0 3px;vertical-align:middle;opacity:.85}
.wx-btn:hover{opacity:1;transform:scale(1.15)}
html.fx-off .wx-btn,html.fx-off .egg-btn,html.fx-off .wx-strip{display:none!important}
.wx-picwrap{display:grid;gap:8px;align-content:start;min-width:0}
.wx-strip{display:flex;flex-wrap:wrap;gap:5px;align-items:center;padding:7px;border-radius:14px;background:linear-gradient(135deg,#f5f3ff,#eef2ff);border:1px solid #e0e7ff}
.wx-strip .wx-st{flex-basis:100%;font:800 10.5px system-ui;letter-spacing:.06em;text-transform:uppercase;color:#6d28d9;padding:0 2px}
.wx-ex{display:inline-flex;align-items:center;gap:5px;border:1px solid #ddd6fe;background:#fff;border-radius:999px;padding:3px 9px 3px 5px;font:700 12px system-ui;color:#3730a3;cursor:pointer;box-shadow:0 1px 2px #6d28d91a;transition:transform .15s,box-shadow .15s,border-color .15s;max-width:100%}
.wx-ex i{font-style:normal;font-size:15px;line-height:1;display:inline-flex}.wx-ex span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wx-ex:hover{transform:translateY(-1px);box-shadow:0 4px 10px #6d28d92e;border-color:#a78bfa}.wx-ex:active{transform:scale(.96)}
article.d .wx-picwrap{width:min-content;max-width:100%}.wx-strip{min-width:0;max-width:100%;box-sizing:border-box}.wx-ex{min-width:0}.wx-ex span{min-width:0}.wx-strip .wx-st{white-space:normal;line-height:1.25}
@media (max-width:720px){.wx-strip{padding:5px;gap:4px}.wx-ex span{display:none}.wx-ex{padding:4px 6px}.wx-ex i{font-size:17px}.wx-strip .wx-st{font-size:9px;letter-spacing:.03em}}
@media print{.wx-strip{display:none}}
.fx-mode{position:fixed;left:12px;bottom:12px;z-index:9994;border:1.5px solid #e2e8f0;border-radius:999px;background:#fff;box-shadow:0 4px 14px #0002;padding:6px 12px;font:700 13px system-ui;cursor:pointer;color:#334155}
.fx-mode:hover{border-color:#a78bfa}@media print{.fx-mode{display:none}}`;
  document.head.appendChild(css);
  const OFF_KEY = "wx-off";
  // ✨ effects mode, shared with the hidden-word eggs: "tap" (default: only when you press a button), "auto" (play by themselves as you scroll), "off"
  const MODE_KEY = "fx-mode", MODES = ["tap", "auto", "off"], LABEL = { tap: "👆 On tap", auto: "▶️ Auto", off: "🚫 Off" };
  const mode = () => { try { const m = localStorage.getItem(MODE_KEY); if (MODES.includes(m)) return m; return localStorage.getItem(OFF_KEY) === "1" ? "off" : "tap"; } catch (e) { return "tap"; } };
  const setMode = m => { try { localStorage.setItem(MODE_KEY, m); localStorage.removeItem(OFF_KEY); } catch (e) {} document.documentElement.classList.toggle("fx-off", m === "off"); const b = document.querySelector(".fx-mode"); if (b) b.textContent = "✨ Effects: " + LABEL[m]; };
  const isOff = () => mode() !== "auto"; // things that play by themselves need "auto"
  const reduce = () => matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  let current = null;

  function play(word, opts) {
    const r = typeof word === "object" ? word : recipe(word);
    if (!r || (isOff() && !(opts && opts.force))) return false;
    const bx = (opts && opts.box && boxable(r)) ? opts.box : null; // a box on the page: play inside it, not over everything
    if (opts && opts.box && !bx) return false;
    stop();
    const dur = (opts && opts.dur) || r.dur || (r.long ? (r.torch && !r.torch.flicker ? 25000 : 14000) : r.vortex ? 6500 : 6000), t0 = performance.now();
    const cv = document.createElement("canvas"); cv.className = "wx-stage" + (bx ? " wx-boxed" : ""); cv.setAttribute("aria-hidden", "true");
    const ctx = cv.getContext("2d"); document.body.appendChild(cv);
    const W = () => bx ? Math.max(80, Math.round(bx.clientWidth)) : innerWidth, H = () => bx ? Math.max(80, Math.round(bx.clientHeight)) : innerHeight, dpr = Math.min(2, devicePixelRatio || 1);
    const size = () => { cv.width = W() * dpr; cv.height = H() * dpr; cv.style.width = W() + "px"; cv.style.height = H() + "px"; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }; size();
    const layers = [];
    const OX = () => bx ? bx.getBoundingClientRect().left : 0, OY = () => bx ? bx.getBoundingClientRect().top : 0;
    const inBx = e => { if (!bx) return true; const q = e.touches && e.touches[0] ? e.touches[0] : e, b = bx.getBoundingClientRect(); return q.clientX >= b.left && q.clientX <= b.right && q.clientY >= b.top && q.clientY <= b.bottom; };
    const place = () => { if (!bx) return; const b = bx.getBoundingClientRect(); cv.style.left = b.left + "px"; cv.style.top = b.top + "px"; layers.forEach(l => { if (l.classList && l.classList.contains("wx-layer")) Object.assign(l.style, { inset: "auto", left: b.left + "px", top: b.top + "px", width: b.width + "px", height: b.height + "px" }); }); };
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
    const onMove = e => { if (e.target && e.target.closest && e.target.closest(".wx-chip")) return; if (!inBx(e)) return; const q = e.touches ? e.touches[0] : e; if (!q) return; ptr.x = q.clientX - OX(); ptr.y = q.clientY - OY(); ptr.moved = performance.now(); };
    const track = r.torch || r.laser || r.eyes || r.bino || r.mag || r.peep || r.rifle || r.track;
    if (track) { addEventListener("pointermove", onMove, { passive: true }); addEventListener("touchmove", onMove, { passive: true }); addEventListener("pointerdown", onMove, { passive: true }); }
    const dark = r.torch ? layer("rgba(3,5,18,.94)", 1) : null;
    const bino = !!r.bino;
    const eye = { lid: 0, next: 1800 };
    // 🎯 target practice: balloons float up; click to fire; hits pop, misses leave a cracked hole that fades
    const G = { balloons: [], holes: [], bits: [], score: 0, kick: 0, nextB: 0 };
    const ST = { feet: (r.stomp || []).map((ms, i) => ({ at: ms, x: W() * (i % 2 ? .64 : .36), y: H() * (.25 + i * (.5 / Math.max(1, (r.stomp || []).length - 1))), f: i % 2 ? -1 : 1, done: 0 })), stuff: [] };
    const fire = e => { if (e.target && e.target.closest && e.target.closest(".wx-chip")) return; e.preventDefault(); e.stopPropagation(); if (e.type !== "pointerdown") return;
      const q = e.touches ? e.touches[0] : e; ptr.x = q.clientX; ptr.y = q.clientY; ptr.moved = performance.now(); bang(); G.kick = 1;
      const hit = G.balloons.find(b => !b.dead && Math.hypot((b.x0 == null ? b.x : b.x0) - ptr.x, b.y - ptr.y) < b.r * 1.15);
      if (hit) { hit.dead = 1; pop(); G.score++; for (let k = 0; k < 22; k++) G.bits.push({ x: hit.x, y: hit.y, vx: rnd(-5, 5), vy: rnd(-6, 2), c: ["#f43f5e", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7", "#fde047"][k % 6], a: 1 }); const sc = chip.querySelector("[data-score]"); if (sc) sc.textContent = "🎈 " + G.score; }
      else G.holes.push({ x: ptr.x, y: ptr.y, a: 1, rot: rnd(0, 6) }); };
    if (r.rifle) ["pointerdown", "click", "mousedown", "touchstart"].forEach(ev => addEventListener(ev, fire, { capture: true, passive: false }));
    let lens = null, lensIn = null, lensWord = null; const pairs = []; const LR = Math.round(Math.min(W(), H()) * .19);
    if (r.mag) {
      lens = document.createElement("div"); lens.className = "wx-mag"; lens.setAttribute("aria-hidden", "true");
      Object.assign(lens.style, { position: "fixed", width: LR * 2 + "px", height: LR * 2 + "px", borderRadius: "50%", overflow: "hidden", zIndex: "9992", pointerEvents: "none", border: "7px solid #334155", boxShadow: "0 8px 30px #0006, inset 0 0 18px #0003", background: getComputedStyle(document.body).backgroundColor || "#fff", left: "-999px", top: "-999px", opacity: 0, transition: "opacity .4s" });
      lensIn = document.createElement("div"); Object.assign(lensIn.style, { position: "absolute", left: 0, top: 0, width: document.documentElement.clientWidth + "px", transformOrigin: "0 0" });
      [...document.body.children].forEach(el => { if (/^(SCRIPT|STYLE|CANVAS|DIALOG)$/.test(el.tagName) || /(wx-|egg-)/.test(el.className || "")) return; const c = el.cloneNode(true); c.setAttribute("aria-hidden", "true"); c.inert = true; lensIn.appendChild(c); pairs.push([el, c]); });
      lens.appendChild(lensIn); document.body.appendChild(lens); layers.push(lens); requestAnimationFrame(() => lens.style.opacity = 1);
      lensWord = document.createElement("div"); lensWord.className = "wx-mag-word"; lensWord.setAttribute("aria-hidden", "true");
      Object.assign(lensWord.style, { position: "fixed", zIndex: "9993", pointerEvents: "none", background: "#fff", color: "#1f2937", font: "800 34px var(--f-display,system-ui)", padding: "4px 16px", borderRadius: "14px", boxShadow: "0 6px 20px #0004", whiteSpace: "nowrap", transform: "translateX(-50%)", display: "none" });
      document.body.appendChild(lensWord); layers.push(lensWord);
    }
    const wordAt = (x, y) => { try { let node, off; if (document.caretRangeFromPoint) { const rg = document.caretRangeFromPoint(x, y); if (!rg) return ""; node = rg.startContainer; off = rg.startOffset; } else if (document.caretPositionFromPoint) { const cp = document.caretPositionFromPoint(x, y); if (!cp) return ""; node = cp.offsetNode; off = cp.offset; } else return "";
      if (!node || node.nodeType !== 3 || (node.parentElement && node.parentElement.closest(".wx-chip,.wx-mag,.wx-mag-word"))) return ""; const t = node.textContent; let a = off, b = off; const isW = c => /[\p{L}\p{N}'’-]/u.test(c); while (a > 0 && isW(t[a - 1])) a--; while (b < t.length && isW(t[b])) b++; return t.slice(a, b).replace(/^['’-]+|['’-]+$/g, ""); } catch (e) { return ""; } };
    // 🔦 the torch only moves when you move it: it leans a little left; tilt it with ⬅️ ➡️, make the beam longer or shorter with ⬆️ ⬇️ or the mouse wheel
    const beam = { len: Math.min(370, Math.max(W(), H()) * .55), tilt: -.45 }; // the default Ab picked: leaning left, a long beam
    const lenBy = d => { beam.len = Math.max(70, Math.min(Math.max(W(), H()) * .8, beam.len + d)); ptr.moved = ptr.moved || performance.now(); };
    const tiltBy = d => { beam.tilt = Math.max(-1.4, Math.min(1.4, beam.tilt + d)); ptr.moved = ptr.moved || performance.now(); };
    const onKey = e => { if (!r.torch || r.torch.flicker) return; const k = { ArrowUp: () => lenBy(30), ArrowDown: () => lenBy(-30), ArrowLeft: () => tiltBy(-.15), ArrowRight: () => tiltBy(.15) }[e.key]; if (k) { e.preventDefault(); k(); } };
    const onWheel = e => { if (!r.torch || r.torch.flicker) return; e.preventDefault(); lenBy(-e.deltaY * .4); };
    if (r.torch && !r.torch.flicker) { addEventListener("keydown", onKey); addEventListener("wheel", onWheel, { passive: false }); }
    const oldCur = document.documentElement.style.cursor; if (r.torch || r.laser || r.mag || r.rifle || r.nocursor) document.documentElement.style.cursor = "none";
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
    const moved = bx ? { stop() {} } : movePage(r, dur, typeof word === "string" ? word : "");
    // 🧩 effects from js/fx.js: { frame(t, life, fade), down(x, y), move(x, y), up(x, y), stop() }
    let plug = null, chipText = ""; const kidsOf = () => bx ? [] : [...document.body.children].filter(el => !/^(SCRIPT|STYLE|CANVAS|DIALOG)$/.test(el.tagName) && !/(wx-|egg-)/.test(el.className || ""));
    if (r.fx && FX[r.fx]) { try { plug = FX[r.fx]({ ctx, W, H, dur, ptr, rnd, noise, boom, plink, chirp, ani: (el, kf, o) => { try { const a = el.animate(kf, o); return a; } catch (e) { return null; } }, kids: kidsOf, opts: opts || {}, boxed: !!bx, word: typeof word === "string" ? word : "", setChip: html => { chipText = html; const c = document.querySelector(".wx-chip [data-fx]"); if (c) c.innerHTML = html; }, reduce: reduce() }) || null; } catch (e) { plug = null; } }
    const pDown = e => { if (!plug || (e.target && e.target.closest && e.target.closest(".wx-chip,[data-fxfull]")) || !inBx(e)) return; if (r.capture) { e.preventDefault(); e.stopPropagation(); } if (e.type === "pointerdown" && plug.down) plug.down(e.clientX - OX(), e.clientY - OY()); };
    const pMove = e => { if (plug && plug.move && inBx(e)) plug.move(e.clientX - OX(), e.clientY - OY()); };
    const pUp = e => { if (!plug || (e.target && e.target.closest && e.target.closest(".wx-chip,[data-fxfull]")) || !inBx(e)) return; if (r.capture) { e.preventDefault(); e.stopPropagation(); } if (e.type === "pointerup" && plug.up) plug.up(e.clientX - OX(), e.clientY - OY()); };
    if (plug) { ["pointerdown", "mousedown", "click", "touchstart"].forEach(ev => addEventListener(ev, pDown, { capture: true, passive: false })); addEventListener("pointermove", pMove, { passive: true }); ["pointerup", "mouseup", "touchend"].forEach(ev => addEventListener(ev, pUp, { capture: true, passive: false })); }
    let raf = 0, ended = false;
    function frame(now) {
      const t = now - t0, life = t / dur, fade = life < .1 ? life / .1 : life > .85 ? Math.max(0, (1 - life) / .15) : 1;
      if (bx) { if (!document.body.contains(bx)) { stop(); return; } place(); if (cv.width !== Math.round(W() * dpr)) size(); }
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
      if (track) { if (!ptr.moved) { ptr.x = W() / 2 + Math.sin(t / 900) * W() * .32; ptr.y = H() * .45 + Math.sin(t / 650) * H() * .22; } }
      if (lens) { const Z = r.mag, x = ptr.x, y = ptr.y; lens.style.left = (x - LR - 7) + "px"; lens.style.top = (y - LR - 7) + "px";
        // line up the copy with the part of the page under the pointer (works for sticky headers too)
        let cx = x + scrollX, cy = y + scrollY; for (const [o, c] of pairs) { const b = o.getBoundingClientRect(); if (y >= b.top && y < b.bottom) { cx = c.offsetLeft + (x - b.left); cy = c.offsetTop + (y - b.top); break; } }
        lensIn.style.transform = `translate(${(-cx * Z + LR).toFixed(1)}px, ${(-cy * Z + LR).toFixed(1)}px) scale(${Z})`;
        const w = wordAt(x, y); if (w && w.length > 1) { lensWord.textContent = w; lensWord.style.display = "block"; lensWord.style.left = x + "px"; lensWord.style.top = Math.min(H() - 60, y + LR + 18) + "px"; } else lensWord.style.display = "none";
        ctx.save(); ctx.translate(x + (LR + 4) * .707, y + (LR + 4) * .707); ctx.rotate(Math.PI / 4); const hg = ctx.createLinearGradient(0, -9, 0, 9); hg.addColorStop(0, "#8b5a2b"); hg.addColorStop(.5, "#c08040"); hg.addColorStop(1, "#5c3a1a"); ctx.fillStyle = "#334155"; ctx.fillRect(0, -7, 18, 14); ctx.fillStyle = hg; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(16, -9, Math.max(60, LR * .9), 18, 9) : ctx.rect(16, -9, LR, 18); ctx.fill(); ctx.restore();
        ctx.strokeStyle = "rgba(255,255,255,.55)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, LR * .8, Math.PI * 1.1, Math.PI * 1.45); ctx.stroke(); }
      if (r.stomp) { let shake = 0;
        ST.feet.forEach(ft => { const d = t - ft.at; if (d < -260) return; const S = Math.min(W(), H()) * .3;
          if (d < 0) { const k = 1 + (-d / 260) * 1.6; ctx.save(); ctx.globalAlpha = .35 + .65 * (1 + d / 260); ctx.translate(ft.x, ft.y); ctx.scale(ft.f * k, k); ctx.font = S + "px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("🦶", 0, 0); ctx.restore(); return; }
          if (!ft.done) { ft.done = 1; for (let k = 0; k < 5; k++) ST.stuff.push({ e: ["🍎", "🍕", "🍩", "🥕", "🧁", "🍌", "📚", "🥄", "🧀", "🍪"][Math.floor(rnd(0, 10))], x: rnd(20, W() - 20), y: rnd(-120, -30), vx: rnd(-1.5, 1.5), vy: rnd(0, 2), rot: rnd(0, 6), vr: rnd(-.15, .15), s: rnd(28, 44), b: 0 }); }
          if (d < 260) shake = Math.max(shake, (1 - d / 260) * 14);
          if (d < 380) { ctx.save(); ctx.globalAlpha = 1 - Math.max(0, (d - 200) / 180); ctx.translate(ft.x, ft.y - Math.max(0, d - 200) * .5); ctx.scale(ft.f, 1); ctx.font = S + "px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("🦶", 0, 0); ctx.restore(); }
          const a = Math.max(0, 1 - d / 2600); if (a > 0) { ctx.save(); ctx.globalAlpha = a * fade; ctx.translate(ft.x, ft.y); ctx.scale(ft.f, 1); ctx.fillStyle = "rgba(92,64,40,.55)"; ctx.beginPath(); ctx.ellipse(0, S * .12, S * .2, S * .3, 0, 0, 7); ctx.fill(); [[-.17, -.27, .07], [-.06, -.33, .055], [.04, -.33, .05], [.12, -.3, .045], [.18, -.24, .04]].forEach(([tx, ty, tr]) => { ctx.beginPath(); ctx.arc(tx * S, ty * S, tr * S, 0, 7); ctx.fill(); }); ctx.restore();
            if (d < 500) { ctx.save(); ctx.globalAlpha = (1 - d / 500) * .8; ctx.strokeStyle = "#7c5a3a"; ctx.lineWidth = 3; for (let k = 0; k < 8; k++) { const ang = k * .8, r0 = S * .4 + d * .15; ctx.beginPath(); ctx.moveTo(ft.x + Math.cos(ang) * r0, ft.y + Math.sin(ang) * r0 * .6); ctx.lineTo(ft.x + Math.cos(ang) * (r0 + 14), ft.y + Math.sin(ang) * (r0 + 14) * .6); ctx.stroke(); } ctx.restore(); } } });
        ST.stuff.forEach(o => { o.vy += .45; o.x += o.vx; o.y += o.vy; o.rot += o.vr; if (o.y > H() - o.s * .5) { o.y = H() - o.s * .5; if (o.b < 3) { o.vy *= -.45; o.vx *= .8; o.b++; } else { o.vy = 0; o.vx *= .9; o.vr *= .8; } }
          ctx.save(); ctx.translate(o.x, o.y); ctx.rotate(o.rot); ctx.font = o.s + "px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(o.e, 0, 0); ctx.restore(); });
        if (shake > 0) cv.style.transform = `translate(${rnd(-shake, shake)}px, ${rnd(-shake, shake)}px)`; else cv.style.transform = ""; }
      if (r.rifle) {
        G.kick = Math.max(0, G.kick - .08); const sx = ptr.x, sy = ptr.y - G.kick * 18, SR = Math.min(W(), H()) * .22;
        ctx.save(); ctx.fillStyle = `rgba(0,0,0,${.55 * fade})`; ctx.fillRect(0, 0, W(), H()); ctx.globalCompositeOperation = "destination-out"; ctx.beginPath(); ctx.arc(sx, sy, SR, 0, 7); ctx.fill(); ctx.restore();
        if (t > G.nextB && life < .9) { const rr = rnd(26, 40); G.balloons.push({ x: rnd(rr * 2, W() - rr * 2), y: H() + rr * 2, r: rr, vy: rnd(.9, 1.8), ph: rnd(0, 6), c: ["#f43f5e", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7", "#ec4899"][Math.floor(rnd(0, 6))] }); G.nextB = t + rnd(500, 1000); }
        G.balloons.forEach(b => { if (b.dead) return; b.y -= b.vy; b.ph += .03; const bx = b.x + Math.sin(b.ph) * 10;
          ctx.strokeStyle = "rgba(100,100,100,.7)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(bx, b.y + b.r * 1.15); ctx.quadraticCurveTo(bx + 8, b.y + b.r * 1.8, bx - 2, b.y + b.r * 2.6); ctx.stroke();
          const g = ctx.createRadialGradient(bx - b.r * .35, b.y - b.r * .4, b.r * .1, bx, b.y, b.r * 1.2); g.addColorStop(0, "#fff"); g.addColorStop(.25, b.c); g.addColorStop(1, b.c); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(bx, b.y, b.r * .9, b.r * 1.1, 0, 0, 7); ctx.fill();
          ctx.fillStyle = b.c; ctx.beginPath(); ctx.moveTo(bx - 5, b.y + b.r * 1.15); ctx.lineTo(bx + 5, b.y + b.r * 1.15); ctx.lineTo(bx, b.y + b.r * 1.05); ctx.fill(); b.x0 = bx; });
        G.balloons = G.balloons.filter(b => !b.dead && b.y > -b.r * 3);
        G.bits.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .25; p.a -= .025; ctx.fillStyle = p.c; ctx.globalAlpha = Math.max(0, p.a) * fade; ctx.fillRect(p.x, p.y, 6, 4); }); G.bits = G.bits.filter(p => p.a > 0); ctx.globalAlpha = fade;
        G.holes.forEach(h => { h.a -= .006; ctx.save(); ctx.globalAlpha = Math.max(0, h.a) * fade; ctx.translate(h.x, h.y); ctx.rotate(h.rot); ctx.strokeStyle = "rgba(255,255,255,.85)"; ctx.lineWidth = 1.5; for (let k = 0; k < 7; k++) { const a = k * .9; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 6, Math.sin(a) * 6); ctx.lineTo(Math.cos(a + .2) * 22, Math.sin(a + .2) * 22); ctx.lineTo(Math.cos(a - .1) * 34, Math.sin(a - .1) * 34); ctx.stroke(); }
          ctx.fillStyle = "#111"; ctx.beginPath(); ctx.arc(0, 0, 6, 0, 7); ctx.fill(); ctx.strokeStyle = "#555"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, 7, 0, 7); ctx.stroke(); ctx.restore(); }); G.holes = G.holes.filter(h => h.a > 0); ctx.globalAlpha = fade;
        // the scope
        ctx.strokeStyle = "#111"; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(sx, sy, SR + 3, 0, 7); ctx.stroke();
        ctx.strokeStyle = "rgba(0,0,0,.85)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sx - SR, sy); ctx.lineTo(sx - 10, sy); ctx.moveTo(sx + 10, sy); ctx.lineTo(sx + SR, sy); ctx.moveTo(sx, sy - SR); ctx.lineTo(sx, sy - 10); ctx.moveTo(sx, sy + 10); ctx.lineTo(sx, sy + SR); ctx.stroke();
        ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(sx - SR, sy); ctx.lineTo(sx - SR * .6, sy); ctx.moveTo(sx + SR * .6, sy); ctx.lineTo(sx + SR, sy); ctx.moveTo(sx, sy + SR * .6); ctx.lineTo(sx, sy + SR); ctx.stroke();
        ctx.fillStyle = "#ef4444"; ctx.beginPath(); ctx.arc(sx, sy, 3.5, 0, 7); ctx.fill();
        { const gx = W() * .8, gy = H() * .84, ang = Math.atan2(sy - gy, sx - gx), kb = G.kick * 26, L = Math.min(W(), H()) * .42; ctx.save(); ctx.translate(gx, gy); ctx.rotate(ang); ctx.translate(-kb, 0);
          ctx.fillStyle = "#8b5a2b"; ctx.beginPath(); ctx.moveTo(-L * .55, -14); ctx.lineTo(-L * .2, -12); ctx.lineTo(-L * .16, 16); ctx.lineTo(-L * .5, 26); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#5c3a1a"; ctx.lineWidth = 2; ctx.stroke();
          ctx.fillStyle = "#374151"; ctx.fillRect(-L * .2, -12, L * .3, 18); ctx.fillStyle = "#1f2937"; ctx.fillRect(L * .1, -7, L * .5, 8); ctx.fillRect(L * .58, -9, 10, 12);
          ctx.fillStyle = "#111827"; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(-L * .14, -26, L * .2, 12, 6) : ctx.rect(-L * .14, -26, L * .2, 12); ctx.fill(); ctx.strokeStyle = "#374151"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-L * .08, 6); ctx.quadraticCurveTo(-L * .05, 20, -L * .02, 6); ctx.stroke();
          if (G.kick > .6) { ctx.fillStyle = `rgba(255,200,80,${(G.kick - .6) * 2.4})`; ctx.beginPath(); ctx.moveTo(L * .6 + 10, -3); ctx.lineTo(L * .6 + 50, -18); ctx.lineTo(L * .6 + 40, -3); ctx.lineTo(L * .6 + 55, 10); ctx.closePath(); ctx.fill(); }
          ctx.restore(); }
        if (G.kick > .6) { ctx.fillStyle = `rgba(255,220,120,${(G.kick - .6) * 2})`; ctx.beginPath(); ctx.arc(sx, sy, 26, 0, 7); ctx.fill(); } }
      if (r.split && life < .24) { const k = Math.min(1, life / .2), sy = k * (H() + 40) - 20; ctx.save(); ctx.translate(W() / 2 + Math.sin(t / 40) * 3, sy); ctx.rotate(Math.PI / 2); ctx.font = "56px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("✂️", 0, 0); ctx.restore();
        ctx.strokeStyle = "rgba(30,41,59,.7)"; ctx.lineWidth = 2; ctx.setLineDash([6, 5]); ctx.beginPath(); ctx.moveTo(W() / 2, 0); ctx.lineTo(W() / 2, sy); ctx.stroke(); ctx.setLineDash([]); }
      if (r.peep) { // a black wall with a hole; an eye on the other side peeks through, looks around, blinks, leaves; then the hole opens
        const hx = W() / 2, hy = H() * .45, R0 = Math.min(W(), H()) * .2, open = life > .8 ? Math.pow((life - .8) / .2, 2) : 0, HR = R0 * (1 + open * 6);
        const slide = life < .15 ? 1 - (life - .05) / .1 : life > .7 ? (life - .7) / .08 : 0, ex = hx + Math.max(0, Math.min(1, slide)) * R0 * 2.6;
        ctx.save(); ctx.globalAlpha = Math.min(1, life * 12); ctx.fillStyle = "#050505"; ctx.fillRect(0, 0, W(), H());
        ctx.globalCompositeOperation = "destination-out"; ctx.beginPath(); ctx.arc(hx, hy, HR, 0, 7); ctx.fill(); ctx.globalCompositeOperation = "source-over";
        if (life < .8 && life > .05) { ctx.beginPath(); ctx.arc(hx, hy, R0, 0, 7); ctx.clip();
          const sk = ctx.createRadialGradient(ex, hy, R0 * .2, ex, hy, R0 * 1.4); sk.addColorStop(0, "#e9b48c"); sk.addColorStop(1, "#7a4a2c"); ctx.fillStyle = "#1a1208"; ctx.fillRect(hx - R0, hy - R0, R0 * 2, R0 * 2); ctx.fillStyle = sk; ctx.beginPath(); ctx.ellipse(ex, hy, R0 * 1.25, R0 * 1.05, 0, 0, 7); ctx.fill();
          if (t > eye.next) { eye.lid = 1; eye.next = t + rnd(1500, 2600); } eye.lid = Math.max(0, eye.lid - .07); const lk = eye.lid > .5 ? (1 - eye.lid) * 2 : eye.lid * 2;
          const ew = R0 * .78, eh = R0 * .42 * (1 - lk);
          ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.ellipse(ex, hy, ew, Math.max(1, eh), 0, 0, 7); ctx.fill();
          ctx.save(); ctx.beginPath(); ctx.ellipse(ex, hy, ew, Math.max(1, eh), 0, 0, 7); ctx.clip();
          const look = ptr.moved ? Math.atan2(ptr.y - hy, ptr.x - ex) : t / 700, dd = ptr.moved ? Math.min(ew * .45, Math.hypot(ptr.x - ex, ptr.y - hy) / 5) : ew * .4, px = ex + Math.cos(look) * dd, py = hy + Math.sin(look) * dd * .5;
          const ir = ctx.createRadialGradient(px, py, 2, px, py, R0 * .3); ir.addColorStop(0, "#5a8a3a"); ir.addColorStop(.7, "#3d6b2a"); ir.addColorStop(1, "#1d3a12");
          ctx.fillStyle = ir; ctx.beginPath(); ctx.arc(px, py, R0 * .3, 0, 7); ctx.fill(); ctx.fillStyle = "#000"; ctx.beginPath(); ctx.arc(px, py, R0 * .14, 0, 7); ctx.fill(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(px - R0 * .08, py - R0 * .09, R0 * .05, 0, 7); ctx.fill(); ctx.restore();
          ctx.strokeStyle = "#3a2010"; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(ex, hy, ew, Math.max(1, eh), 0, 0, 7); ctx.stroke();
          ctx.lineWidth = 3; for (let k = -4; k <= 4; k++) { const a = Math.PI * 1.5 + k * .16, bx = ex + Math.cos(a) * ew, by = hy + Math.sin(a) * Math.max(1, eh); ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + k * 3, by - 12); ctx.stroke(); }
          ctx.strokeStyle = "#2a1608"; ctx.lineWidth = 9; ctx.beginPath(); ctx.ellipse(ex, hy - R0 * .72, R0 * .7, R0 * .18, 0, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); }
        ctx.restore();
        if (open < .3) { ctx.strokeStyle = `rgba(60,60,60,${1 - open * 3})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(hx, hy, HR + 2, 0, 7); ctx.stroke(); } }
      if (bino) { const R0 = Math.min(W(), H()) * .2, x1 = ptr.x - R0 * .78, x2 = ptr.x + R0 * .78, y = ptr.y;
        ctx.save(); ctx.fillStyle = `rgba(4,8,14,${.96 * fade})`; ctx.fillRect(0, 0, W(), H()); ctx.globalCompositeOperation = "destination-out"; ctx.fillStyle = "#000";
        [x1, x2].forEach(x => { ctx.beginPath(); ctx.arc(x, y, R0, 0, 7); ctx.fill(); }); ctx.restore();
        ctx.strokeStyle = `rgba(20,25,35,${.9 * fade})`; ctx.lineWidth = 10; [x1, x2].forEach(x => { ctx.beginPath(); ctx.arc(x, y, R0 + 4, 0, 7); ctx.stroke(); });
        ctx.strokeStyle = `rgba(80,90,110,${.35 * fade})`; ctx.lineWidth = 1.5; [x1, x2].forEach(x => { ctx.beginPath(); ctx.moveTo(x - 12, y); ctx.lineTo(x + 12, y); ctx.moveTo(x, y - 12); ctx.lineTo(x, y + 12); ctx.stroke(); }); }
      if (r.eyes) { const R0 = Math.min(W(), H()) * .13, rise = Math.min(1, life * 6, (1 - life) * 6), cy = H() + R0 * .9 - rise * R0 * 2.1;
        if (t > eye.next) { eye.lid = 1; eye.next = t + rnd(1800, 3200); } eye.lid = Math.max(0, eye.lid - .08); const lidK = eye.lid > .5 ? (1 - eye.lid) * 2 : eye.lid * 2;
        [W() / 2 - R0 * 1.15, W() / 2 + R0 * 1.15].forEach(cx => {
          ctx.fillStyle = "#fff"; ctx.strokeStyle = "#1f2937"; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(cx, cy, R0, R0 * 1.15, 0, 0, 7); ctx.fill(); ctx.stroke();
          const a = Math.atan2(ptr.y - cy, ptr.x - cx), d = Math.min(R0 * .5, Math.hypot(ptr.x - cx, ptr.y - cy) / 6), px = cx + Math.cos(a) * d, py = cy + Math.sin(a) * d * 1.1;
          ctx.fillStyle = "#3b2a1a"; ctx.beginPath(); ctx.arc(px, py, R0 * .42, 0, 7); ctx.fill(); ctx.fillStyle = "#000"; ctx.beginPath(); ctx.arc(px, py, R0 * .22, 0, 7); ctx.fill();
          ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(px - R0 * .12, py - R0 * .14, R0 * .08, 0, 7); ctx.fill();
          if (lidK > 0) { ctx.save(); ctx.beginPath(); ctx.ellipse(cx, cy, R0, R0 * 1.15, 0, 0, 7); ctx.clip(); ctx.fillStyle = "#f2c9a0"; ctx.fillRect(cx - R0 - 4, cy - R0 * 1.2, R0 * 2 + 8, R0 * 2.35 * lidK); ctx.strokeStyle = "#1f2937"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx - R0, cy - R0 * 1.2 + R0 * 2.35 * lidK); ctx.lineTo(cx + R0, cy - R0 * 1.2 + R0 * 2.35 * lidK); ctx.stroke(); ctx.restore();
            ctx.strokeStyle = "#1f2937"; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(cx, cy, R0, R0 * 1.15, 0, 0, 7); ctx.stroke(); }
          ctx.strokeStyle = "#1f2937"; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(cx, cy - R0 * 1.5, R0 * .8, R0 * .25, 0, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); }); }
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
      if (r.sway) { const sw = Math.sin(t / 1100 * Math.PI) * .22, sz = Math.min(W(), H()) * .28; [[sz * .45, 1], [W() - sz * .45, -1]].forEach(([x, f]) => { ctx.save(); ctx.translate(x, H() + 6); ctx.rotate(sw); ctx.scale(f, 1); ctx.font = sz + "px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.fillText("🌴", 0, 0); ctx.restore(); }); }
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
      if (plug && plug.frame) { try { ctx.save(); plug.frame(t, life, fade); ctx.restore(); } catch (e) { plug = null; } }
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
    chip.innerHTML = `<span>${r.icon || r.e} ${r.name}</span><button type="button" data-x>✕ Stop</button><button type="button" data-off>${mode() === "auto" ? "Stop auto-play" : "Close"}</button>`;
    if (r.torch && !r.torch.flicker) { const c = document.createElement("span"); c.style.display = "flex"; c.style.gap = "4px";
      [["↺", "Tilt left", () => tiltBy(-.2)], ["➖", "Shorter beam", () => lenBy(-40)], ["➕", "Longer beam", () => lenBy(40)], ["↻", "Tilt right", () => tiltBy(.2)]].forEach(([t, l, f]) => { const b = document.createElement("button"); b.type = "button"; b.textContent = t; b.title = l; b.setAttribute("aria-label", l); b.onpointerdown = e => { e.stopPropagation(); f(); }; c.appendChild(b); });
      chip.insertBefore(c, chip.querySelector("[data-x]")); }
    if (!bx && (r.torch || r.laser || r.eyes || r.bino || r.mag || r.peep || r.rifle || r.top)) chip.classList.add("top");
    if (bx) chip.classList.add("inbox");
    if (r.fx) { const fxs = document.createElement("b"); fxs.dataset.fx = "1"; fxs.style.padding = "0 4px"; fxs.innerHTML = chipText; chip.insertBefore(fxs, chip.querySelector("[data-x]")); }
    if (r.rifle) { const sc = document.createElement("b"); sc.dataset.score = "1"; sc.textContent = "🎈 0"; sc.style.padding = "0 6px"; chip.insertBefore(sc, chip.querySelector("[data-x]")); }
    chip.querySelector("[data-x]").onclick = () => stop();
    chip.querySelector("[data-off]").onclick = () => { setMode("tap"); stop(); };
    (bx || document.body).appendChild(chip);
    place();
    addEventListener("resize", size);
    current = { stop() { if (ended) return; ended = true; if (plug && plug.stop) { try { plug.stop(); } catch (e) {} } ["pointerdown", "mousedown", "click", "touchstart"].forEach(ev => removeEventListener(ev, pDown, { capture: true })); removeEventListener("pointermove", pMove); ["pointerup", "mouseup", "touchend"].forEach(ev => removeEventListener(ev, pUp, { capture: true })); cancelAnimationFrame(raf); sfx.stop(); moved.stop(); removeEventListener("resize", size); if (r.torch || r.laser || r.mag || r.rifle || r.nocursor) document.documentElement.style.cursor = oldCur; removeEventListener("pointermove", onMove); if (r.rifle) ["pointerdown", "click", "mousedown", "touchstart"].forEach(ev => removeEventListener(ev, fire, { capture: true })); removeEventListener("keydown", onKey); removeEventListener("wheel", onWheel); removeEventListener("touchmove", onMove); removeEventListener("pointerdown", onMove); cv.remove(); chip.remove(); layers.forEach(l => { l.style.opacity = 0; if (l === puddle) l.style.height = "0"; setTimeout(() => l.remove(), 900); }); } };
    raf = requestAnimationFrame(frame);
    return true;
  }
  function stop() { if (current) { current.stop(); current = null; } }

  // The page moves: a breeze sways it, a gale shakes it, a hurricane lifts things up, spins them round the 🌀 and puts them back.
  function movePage(r, dur, word) {
    const anims = [];
    const ani = (el, kf, o) => { try { const a = el.animate(kf, o); anims.push(a); } catch (e) {} };
    if (reduce()) return { stop() {} };
    if (r.far) { // the page flies down a road to the horizon, waits there as a speck, then comes back
      const hz = innerHeight * .52, back = document.createElement("div"); back.className = "wx-back";
      back.innerHTML = `<i style="position:absolute;inset:0 0 48% 0;background:linear-gradient(#5aa9e6,#bfe3ff)"></i><i style="position:absolute;inset:52% 0 0 0;background:linear-gradient(#9bd37a,#4f9a3a)"></i><i style="position:absolute;inset:52% 0 0 0;background:linear-gradient(#8a8f98,#4b5058);clip-path:polygon(49.4% 0,50.6% 0,78% 100%,22% 100%)"></i><i style="position:absolute;inset:52% 0 0 0;background:#fff8;clip-path:polygon(49.95% 0,50.05% 0,50.6% 100%,49.4% 100%)"></i><b style="position:absolute;left:12%;top:18%;font-size:52px">☁️</b><b style="position:absolute;right:16%;top:10%;font-size:40px">☁️</b><b style="position:absolute;left:14%;top:44%;font-size:46px">⛰️</b><b style="position:absolute;right:12%;top:41%;font-size:58px">⛰️</b><b style="position:absolute;right:30%;top:47%;font-size:26px">🌳</b>`;
      Object.assign(back.style, { position: "fixed", inset: "0", zIndex: "-1", opacity: "0", transition: "opacity .6s" }); document.body.appendChild(back); requestAnimationFrame(() => back.style.opacity = 1);
      const kids = [...document.body.children].filter(el => el !== back && !/^(SCRIPT|STYLE|CANVAS|DIALOG)$/.test(el.tagName) && !/(wx-|egg-)/.test(el.className || ""));
      kids.forEach(el => { const top = el.getBoundingClientRect().top; el.style.transformOrigin = `50% ${hz - top}px`;
        ani(el, [{ transform: "scale(1)", opacity: 1, offset: 0 }, { transform: "scale(.04)", opacity: .7, offset: .42, easing: "ease-in" }, { transform: "scale(.04)", opacity: .7, offset: .62 }, { transform: "scale(1)", opacity: 1, offset: 1 }], { duration: dur, easing: "ease-in-out" }); });
      return { stop() { anims.forEach(a => { try { a.cancel(); } catch (e) {} }); kids.forEach(el => el.style.transformOrigin = ""); back.style.opacity = 0; setTimeout(() => back.remove(), 700); } };
    }
    if (r.stomp) { // every stomp shakes the page hard and makes the cards jump
      const kids = [...document.body.children].filter(el => !/^(SCRIPT|STYLE|CANVAS|DIALOG)$/.test(el.tagName) && !/(wx-|egg-)/.test(el.className || ""));
      r.stomp.forEach(ms => { kids.forEach(el => ani(el, [{ transform: "none" }, { transform: "translate(-9px,7px)" }, { transform: "translate(8px,-6px)" }, { transform: "translate(-6px,4px)" }, { transform: "translate(4px,-2px)" }, { transform: "none" }], { duration: 320, delay: ms }));
        document.querySelectorAll(".card, .item, .panel").forEach((el, i) => { if (i < 30) ani(el, [{ transform: "none" }, { transform: `translateY(-${10 + (i % 4) * 5}px) rotate(${i % 2 ? 2 : -2}deg)`, offset: .35 }, { transform: "none" }], { duration: 420, delay: ms + (i % 5) * 20, easing: "ease-out" }); }); });
      // the page itself falls apart: words, titles, chips, buttons and pictures near each foot (above and below it) get knocked loose,
      // tumble to the bottom of the screen and pile up; the stomped word falls first; at the end everything flies back
      const vw = innerWidth, vh = innerHeight, n = r.stomp.length, taken = new Set();
      const cands = [...document.querySelectorAll("h1, h2, h3, h4, p, li, label, button, a, img, .syl, .tag, .chipb, .say1, [class*=chip], [class*=pill], b, strong, em, i, small, span")]
        .filter(el => { if (el.closest(".wx-chip, .wx-mag, .wx-split, .wx-back, .wx-stage, .wx-layer, nav, header")) return false; const b = el.getBoundingClientRect(); if (b.bottom < 0 || b.top > vh || b.width < 8 || b.height < 8 || b.width > vw * .92 || b.height > 160) return false;
          if (el.children.length > 4) return false; return !(el.parentElement && el.parentElement.closest("h1, h2, h3, button, a, label") && !/^(IMG)$/.test(el.tagName)); });
      const fall = (el, ms, k) => { if (taken.has(el) || [...taken].some(t => t.contains(el) || el.contains(t))) return; taken.add(el); const b = el.getBoundingClientRect(), total = dur - ms; if (total < 1200) return;
        const drop = Math.max(20, vh - b.bottom - 6 - (k % 4) * 14), rot = ((k * 37) % 70) - 35, dx = ((k * 53) % 60) - 30, f1 = Math.min(.5, 900 / total), back = Math.max(f1 + .05, (total - 750) / total);
        if (getComputedStyle(el).display === "inline") el.style.display = "inline-block";
        ani(el, [{ transform: "none", offset: 0 }, { transform: `translate(${dx * .5}px, ${drop * .55}px) rotate(${rot * .5}deg)`, offset: f1 * .55, easing: "ease-in" }, { transform: `translate(${dx}px, ${drop}px) rotate(${rot}deg)`, offset: f1 * .8, easing: "ease-out" },
          { transform: `translate(${dx}px, ${drop - 18}px) rotate(${rot * 1.1}deg)`, offset: f1 * .9, easing: "ease-in" }, { transform: `translate(${dx}px, ${drop}px) rotate(${rot}deg)`, offset: f1 }, { transform: `translate(${dx}px, ${drop}px) rotate(${rot}deg)`, offset: back, easing: "ease-in-out" }, { transform: "none", offset: 1 }],
          { duration: total, delay: ms + (k % 6) * 40 }); };
      const me = word ? [...document.querySelectorAll("[data-wx-word]")].find(el => el.dataset.wxWord.toLowerCase() === word.toLowerCase() && el.getBoundingClientRect().bottom > 0 && el.getBoundingClientRect().top < vh) : null;
      if (me) fall(me, r.stomp[0], 0);
      r.stomp.forEach((ms, i) => { const fx = vw * (i % 2 ? .64 : .36), fy = vh * (.25 + i * (.5 / Math.max(1, n - 1)));
        cands.map(el => { const b = el.getBoundingClientRect(); return [el, Math.hypot((b.left + b.width / 2 - fx) * .6, b.top + b.height / 2 - fy)]; }).filter(([, d]) => d < vh * .32).sort((a, b) => a[1] - b[1]).slice(0, 9).forEach(([el], k) => fall(el, ms + 40, k + i)); });
      return { stop() { anims.forEach(a => { try { a.cancel(); } catch (e) {} }); } };
    }
    if (r.split) { // scissors cut the page down the middle along a jagged tear, the halves slide apart, then join again
      const vw = innerWidth, vh = innerHeight, zig = []; for (let i = 0; i <= 25; i++) zig.push([50 + (i % 2 ? 1.4 : -1.4) + (Math.random() - .5), i * 4]);
      const polyL = "polygon(0 0," + zig.map(([x, y]) => x + "% " + y + "%").join(",") + ",0 100%)", polyR = "polygon(100% 0," + zig.map(([x, y]) => x + "% " + y + "%").join(",") + ",100% 100%)";
      const kids = [...document.body.children].filter(el => !/^(SCRIPT|STYLE|CANVAS|DIALOG)$/.test(el.tagName) && !/(wx-|egg-)/.test(el.className || ""));
      const gap = document.createElement("div"); gap.className = "wx-split"; Object.assign(gap.style, { position: "fixed", inset: 0, zIndex: 9987, pointerEvents: "none", background: "radial-gradient(ellipse at 50% 50%, #1e293b, #020617)" }); document.body.appendChild(gap);
      const half = poly => { const h = document.createElement("div"); h.className = "wx-split"; Object.assign(h.style, { position: "fixed", inset: 0, zIndex: 9988, pointerEvents: "none", overflow: "hidden", clipPath: poly, webkitClipPath: poly, background: getComputedStyle(document.body).backgroundColor || "#fff", filter: "drop-shadow(0 0 10px #0008)" });
        kids.forEach(el => { const b = el.getBoundingClientRect(); if (b.bottom < 0 || b.top > vh || !b.width) return; const c = el.cloneNode(true); c.setAttribute("aria-hidden", "true"); c.inert = true; Object.assign(c.style, { position: "absolute", left: b.left + "px", top: b.top + "px", width: b.width + "px", margin: 0 }); h.appendChild(c); });
        document.body.appendChild(h); return h; };
      const L = half(polyL), R = half(polyR), hidden = kids.map(el => [el, el.style.visibility]); kids.forEach(el => el.style.visibility = "hidden");
      const away = Math.min(vw * .22, 220), o = { duration: dur, easing: "ease-in-out" };
      ani(L, [{ transform: "none", offset: 0 }, { transform: "none", offset: .22 }, { transform: `translateX(${-away}px) rotate(-2deg)`, offset: .42 }, { transform: `translateX(${-away}px) rotate(-2deg)`, offset: .72 }, { transform: "none", offset: .9 }, { transform: "none", offset: 1 }], o);
      ani(R, [{ transform: "none", offset: 0 }, { transform: "none", offset: .22 }, { transform: `translateX(${away}px) rotate(2deg)`, offset: .42 }, { transform: `translateX(${away}px) rotate(2deg)`, offset: .72 }, { transform: "none", offset: .9 }, { transform: "none", offset: 1 }], o);
      return { stop() { anims.forEach(a => { try { a.cancel(); } catch (e) {} }); hidden.forEach(([el, v]) => el.style.visibility = v); document.querySelectorAll(".wx-split").forEach(x => x.remove()); } };
    }
    if (r.sway) { // the whole page sways from the bottom of the screen, like a tree; cards sway a little on their own too
      const kids = [...document.body.children].filter(el => !/^(SCRIPT|STYLE|CANVAS|DIALOG)$/.test(el.tagName) && !/(wx-|egg-)/.test(el.className || "") && getComputedStyle(el).position !== "fixed");
      kids.forEach(el => { const top = el.getBoundingClientRect().top; el.style.transformOrigin = `50% ${innerHeight - top}px`;
        ani(el, [{ transform: "rotate(0deg)" }, { transform: "rotate(2.2deg)" }, { transform: "rotate(0deg)" }, { transform: "rotate(-2.2deg)" }, { transform: "rotate(0deg)" }], { duration: 2200, iterations: Math.ceil(dur / 2200), easing: "ease-in-out" }); });
      document.querySelectorAll(".card, .item, img.pic, .tag, .btn").forEach((el, i) => { if (i < 40) ani(el, [{ transform: "none" }, { transform: `rotate(${i % 2 ? 1.2 : -1.2}deg)` }, { transform: "none" }], { duration: 1100, iterations: Math.ceil(dur / 1100), delay: (i % 6) * 120, easing: "ease-in-out" }); });
      return { stop() { anims.forEach(a => { try { a.cancel(); } catch (e) {} }); kids.forEach(el => el.style.transformOrigin = ""); } };
    }
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
  // ✨ "See it" strip under the picture/video of a word card: one chip per example of the word
  const escH = x => String(x).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function strip(el, w) {
    const card = el.closest("article[data-i]"); if (!card) return false; if (card.dataset.wxStrip === w) return true; if (card.dataset.wxStrip) return false;
    const pic = card.querySelector(".vwrap, img.pic, .pic"); const vs = variants(w); if (!pic || !vs.length) return false;
    card.dataset.wxStrip = w; const target = pic.closest(".vwrap") || pic;
    let wrap = target.parentElement && target.parentElement.classList.contains("wx-picwrap") ? target.parentElement : null;
    if (!wrap) { wrap = document.createElement("div"); wrap.className = "wx-picwrap"; target.replaceWith(wrap); wrap.appendChild(target); }
    const box = document.createElement("div"); box.className = "wx-strip";
    box.innerHTML = `<span class="wx-st">✨ See it${vs.length > 1 ? ` · ${vs.length} ways` : ""}</span>` + vs.map((r, k) => `<button type="button" class="wx-ex" data-k="${k}" title="Show “${escH(r.name)}” on the whole page"><i>${r.icon || escH(r.e)}</i><span>${escH(r.name)}</span></button>`).join("");
    box.addEventListener("click", ev => { const b = ev.target.closest(".wx-ex"); if (!b) return; ev.preventDefault(); ev.stopPropagation(); ac(); play(vs[+b.dataset.k], { force: 1 }); });
    wrap.appendChild(box); return true;
  }
  function scan() {
    document.querySelectorAll(".syl[aria-label], .term, [data-wx]").forEach(el => {
      if (el.dataset.wxDone || el.closest(".wx-off")) return;
      el.dataset.wxDone = "1";
      const w = String(el.dataset.wx || el.getAttribute("aria-label") || el.textContent || "").trim(), r = recipe(w);
      if (!r) return;
      el.dataset.wxWord = w;
      if (strip(el, w)) { if (io) io.observe(el); return; }
      const btn = document.createElement("button");
      btn.type = "button"; btn.className = "wx-btn"; if (r.icon) btn.innerHTML = r.icon; else btn.textContent = r.e; // icon = our own drawing (never user text)
      btn.title = `Make it ${r.name.toLowerCase()} on the page!` + (variants(w).length > 1 ? ` (${variants(w).length} ways: ${variants(w).map(v => v.name).join(", ")})` : ""); btn.setAttribute("aria-label", `Show ${r.name} on the whole page`);
      btn.addEventListener("click", ev => { ev.preventDefault(); ev.stopPropagation(); ac(); play(w, { force: 1 }); });
      (el.nextElementSibling && el.nextElementSibling.classList.contains("egg-btn") ? el.nextElementSibling : el).insertAdjacentElement("afterend", btn);
      if (io) io.observe(el);
    });
  }
  const mo = new MutationObserver(ms => { if (ms.some(m => [...m.addedNodes].some(n => n.nodeType === 1 && !/wx-|egg-/.test(n.className || "")))) scan(); });
  const modeSwitch = () => { if (document.querySelector(".fx-mode") || !document.querySelector(".wx-btn, .egg-btn")) return; const b = document.createElement("button"); b.type = "button"; b.className = "fx-mode";
    b.title = "On tap: effects play only when you press their button · Auto: they play by themselves as you scroll · Off: no effects"; b.onclick = () => { const m = MODES[(MODES.indexOf(mode()) + 1) % MODES.length]; setMode(m); if (m === "off") stop(); }; document.body.appendChild(b); setMode(mode()); };
  const start = () => { scan(); setMode(mode()); modeSwitch(); mo.observe(document.body, { childList: true, subtree: true }); setInterval(modeSwitch, 2000); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
  addEventListener("keydown", e => { if (e.key === "Escape") stop(); });
  // js/fx.js adds effects: Weather.add("word,word", recipe, fxFunction)
  const addFx = (words, rec, fn) => { const name = rec.fx || (rec.fx = "fx" + Object.keys(FX).length); if (fn) FX[name] = fn; add(words, rec); };
  window.Weather = { play, stop, recipe, behaviour, load: loadBehaviours, boxable, BEH, variants, R, FX, add: addFx, mode, setMode, also: (ws, keys) => ws.split(",").forEach(w => { w = w.trim(); ALSO[w] = [...new Set([...(ALSO[w] || []), ...keys.split(",").map(k => k.trim())])]; }), rescan: () => { document.querySelectorAll("[data-wx-done]").forEach(el => { if (!el.dataset.wxWord) delete el.dataset.wxDone; }); scan(); } };
})();
