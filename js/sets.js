/* Loads one study set from the database for the activity pages, then starts the page.
   Page scripts are marked type="text/x-app" and run after the set is ready. */
(function () {
  const G5 = "00000000-0000-4000-8000-000000000005";
  const LANGS = { en: "English", ar: "Arabic", fr: "French", es: "Spanish", de: "German", tr: "Turkish", ur: "Urdu", hi: "Hindi", zh: "Chinese", ja: "Japanese", ko: "Korean", ru: "Russian", it: "Italian", pt: "Portuguese", id: "Indonesian", ms: "Malay", fa: "Persian", bn: "Bengali", tl: "Filipino", sw: "Swahili", la: "Latin" };
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const qs = new URLSearchParams(location.search);
  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };

  // Coloured letter tile for terms without a picture.
  function tile(term) {
    const pal = [["#E6ECFB", "#2347C5"], ["#DDF3EE", "#127A68"], ["#FDE7DF", "#B4472A"], ["#FFF3CC", "#8A6100"], ["#EDE6FB", "#6236C5"]];
    let h = 0; for (const c of String(term)) h = (h * 31 + c.codePointAt(0)) >>> 0;
    const [bg, fg] = pal[h % pal.length], ch = esc((String(term).trim()[0] || "?").toUpperCase());
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="24" fill="${bg}"/><text x="60" y="80" font-family="system-ui,sans-serif" font-size="64" font-weight="800" text-anchor="middle" fill="${fg}">${ch}</text></svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }
  // Rough syllable split for Latin-script single words (used by the syllable builder).
  function autoSyl(w) {
    const s = String(w).toLowerCase();
    if (!/^[a-z']+$/.test(s) || s.length < 4) return s;
    const parts = s.match(/[^aeiouy]*[aeiouy]+(?:[^aeiouy]*$|[^aeiouy](?=[^aeiouy]))?/g);
    return parts && parts.join("") === s ? parts.join("-") : s;
  }
  // Put [brackets] round the term in the example so "fill the blank" works.
  function blankify(ex, term) {
    if (!ex) return "[" + term + "]";
    if (/\[[^\]]+\]/.test(ex)) return ex;
    const i = ex.toLowerCase().indexOf(String(term).toLowerCase());
    return i >= 0 ? ex.slice(0, i) + "[" + ex.slice(i, i + term.length) + "]" + ex.slice(i + term.length) : ex + " — [" + term + "]";
  }
  let voice = null;
  function speak(text, rate) {
    if (!("speechSynthesis" in window)) return false;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(String(text).replace(/\s*\(.*\)/, ""));
      u.lang = window.SET_LANG || "en"; u.rate = rate || .85;
      if (!voice) voice = speechSynthesis.getVoices().find(v => v.lang.toLowerCase().startsWith(u.lang.toLowerCase())) || null;
      if (voice) u.voice = voice;
      speechSynthesis.speak(u); return true;
    } catch (e) { return false; }
  }

  async function pickSetId(p) {
    const want = qs.get("set");
    if (want) return want;
    const last = store.get("lastSet");
    if (last) return last;
    const { data } = await App.client.from("class_sets").select("set_id, assigned_at").order("assigned_at", { ascending: false }).limit(1);
    if (data && data[0]) return data[0].set_id;
    return null;
  }

  async function load(id) {
    const C = App.client;
    const [{ data: set, error }, { data: items }] = await Promise.all([
      C.from("study_sets").select("*, subjects(name,icon), levels(name)").eq("id", id).maybeSingle(),
      C.from("set_items").select("*").eq("set_id", id).order("position", { ascending: true }).limit(5000)
    ]);
    if (error || !set) return null;
    return { set, items: items || [] };
  }

  function mapItems(set, items) {
    const terms = items.filter(x => x.kind === "term"), questions = items.filter(x => x.kind !== "term");
    const words = terms.map(x => ({
      id: x.id, w: x.term, d: x.meaning, s: blankify(x.example, x.term), ar: x.translation || "",
      u: x.unit, also: x.also_units || [], img: x.anim_url || x.image_url || tile(x.term),
      photo: x.anim_url && x.image_url ? x.image_url : "", au: x.audio_url || "tts",
      syl: (x.syllables || (/\s/.test(x.term) ? x.term.toLowerCase() : autoSyl(x.term))).toLowerCase(), real: !!(x.anim_url || x.image_url)
    }));
    const named = new Map((set.units || []).map(u => [Number(u.u), u.name || ""]));
    const counts = new Map(); words.forEach(w => counts.set(w.u, (counts.get(w.u) || 0) + 1));
    const order = [...counts.keys()].sort((a, b) => (a === 0) - (b === 0) || a - b);
    const units = order.map(u => ({ u, name: named.get(u) || (u === 0 ? "General" : ""), n: counts.get(u) }));
    return { words, questions, units };
  }

  function setBar(set, words, questions) {
    const here = location.pathname.split("/").pop();
    const I = n => (window.icon ? window.icon(n, 16) : "");
    const acts = [["set.html", "layout-grid", "Overview", true], ["cards.html", "layers", "Flashcards", words.length > 0],
      ["exam.html", "clipboard-check", "Exam", words.length >= 4], ["games.html", "puzzle", "Games", words.length >= 4],
      ["spelling.html", "spell-check-2", "Spelling", words.length >= 2], ["quiz.html", "circle-help", "Quiz", questions.length > 0]];
    const css = `#setbar{background:var(--ink,#1B2333);color:#fff;padding:10px 16px;display:flex;gap:10px 18px;align-items:center;flex-wrap:wrap;font:14px var(--f-body,system-ui)}
      #setbar .t{display:flex;flex-direction:column;min-width:0;flex:1 1 240px}#setbar .t b{font:800 1.02rem var(--f-display,system-ui);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      #setbar .t span{color:#C9D1E3;font-size:.82rem}#setbar nav{display:flex;gap:4px;flex-wrap:wrap}
      #setbar nav a{display:inline-flex;align-items:center;gap:6px;color:#E3E8F3;text-decoration:none;font-weight:700;font-size:.86rem;padding:6px 10px;border-radius:9px;border:1px solid rgba(255,255,255,.18)}
      #setbar nav a:hover{background:rgba(255,255,255,.1)}#setbar nav a.on{background:var(--sun,#FFC94D);color:#1B2333;border-color:transparent}
      @media (max-width:600px){#setbar nav a span{display:none}}`;
    document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`);
    const meta = [set.subjects?.name, set.levels?.name, `${words.length} terms`, questions.length ? `${questions.length} questions` : ""].filter(Boolean).join(" · ");
    const nav = acts.filter(a => a[3]).map(a => `<a href="${a[0]}?${a[0] === "set.html" ? "id" : "set"}=${set.id}" class="${here === a[0] ? "on" : ""}">${I(a[1])}<span>${a[2]}</span></a>`).join("");
    const bar = `<div id="setbar"><div class="t"><b>${esc(set.title)}</b><span>${esc(meta)}</span></div><nav aria-label="Activities for this set">${nav}</nav></div>`;
    const ab = document.getElementById("appbar");
    if (ab) ab.insertAdjacentHTML("afterend", bar); else document.body.insertAdjacentHTML("afterbegin", bar);
  }

  function blocker(title, text, set) {
    const w = document.querySelector(".wrap") || document.body;
    w.innerHTML = `<div style="max-width:560px;margin:48px auto;padding:24px;border-radius:18px;background:var(--sheet,#fff);border:1px solid var(--rule,#DCE1EA);font:16px var(--f-body,system-ui);display:flex;flex-direction:column;gap:12px">
      <h1 style="margin:0;font:800 1.5rem var(--f-display,system-ui)">${esc(title)}</h1><p style="margin:0">${text}</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap">${set ? `<a href="set.html?id=${set.id}" style="font-weight:700">Back to the set</a> · ` : ""}<a href="library.html" style="font-weight:700">Open the library</a></div></div>`;
  }

  function runPage() {
    document.querySelectorAll('script[type="text/x-app"]').forEach(s => {
      const n = document.createElement("script"); n.textContent = s.textContent; document.body.appendChild(n);
    });
  }

  async function boot(opts = {}) {
    let p; try { p = await App.requireUser(); } catch (e) { return; }
    const id = await pickSetId(p);
    if (!id) { location.replace("library.html"); return; }
    const got = await load(id);
    if (!got) { if (store.get("lastSet") === id) { try { localStorage.removeItem("lastSet"); } catch (e) {} }
      blocker("Set not available", "This study set doesn't exist any more, or it hasn't been shared with you.", null); return; }
    const { set, items } = got, { words, questions, units } = mapItems(set, items);
    store.set("lastSet", set.id);
    window.CURRENT_SET = set; window.SET_ITEMS = items; window.WORDS = words; window.QUESTIONS = questions; window.UNITS_LIST = units;
    window.SET_LANG = set.language || "en"; window.TL_NAME = LANGS[set.translation_lang] || "Translation";
    window.SYL_MAP = Object.fromEntries(words.map(w => [w.w, w.syl]));
    window.HAS_PICS = words.filter(w => w.real).length >= 6;
    document.documentElement.lang = set.language || "en";
    setBar(set, words, questions);
    const eb = document.getElementById("setEyebrow");
    if (eb) eb.textContent = [set.subjects?.name, set.levels?.name].filter(Boolean).join(" · ");
    const need = opts.min || 0, have = opts.questions ? questions.length : words.length;
    if (have < need) {
      blocker(opts.questions ? "No questions in this set yet" : "Not enough terms for this activity",
        opts.questions ? "This set has no multiple-choice or true/false questions. Try the flashcards or the exam instead."
          : `This activity needs at least ${need} terms, and this set has ${have}.`, set);
      return;
    }
    runPage();
  }

  window.Sets = { boot, speak, tile, autoSyl, blankify, load, mapItems, G5, LANGS };
})();
