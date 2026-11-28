/* 🌍 Lang: every language on the same level as English.
   Data (see supabase_v84_languages.sql): languages · word_translations (one row per word + language) · student_languages (what this student shows/hears).
   Lang.load()                 → loads the languages and the student's choice (cached)
   Lang.mine()                 → [{code, name_en, native_name, dir, tts_lang, has_romanization, flag, show, hear}] in the student's order
   Lang.attach(items)          → puts v.trs = { fr: {term, meaning, example, romanization, audio_url}, … } on each word (v.wid || v.id), keeping the old v.ar for Arabic
   Lang.lines(v)               → the translation lines to show for a word: [{code, flag, native, dir, term, rom, hear}]
   Lang.say(v, code, opts)     → hear it: a recorded voice if there is one, otherwise the browser voice for that language
   Lang.picker(mountEl, cb)    → the "🌍 My languages" panel (show / hear / order per language, with how many words are translated)
   Lang.hearLangs()            → the languages that have a 🔊 for this student */
(function () {
  "use strict";
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const C = () => window.App && App.client;
  let ALL = [], MINE = [], loaded = null, COV = {};

  function profile() { return (window.App && App.profile) || {}; }
  function load() {
    if (loaded) return loaded;
    loaded = (async () => {
      try {
        try { await C().auth.getSession(); } catch (e) {}      // wait until the sign-in is ready: before that the database answers nothing
        const p = profile();
        const [l, s, c] = await Promise.all([
          C().from("languages").select("*").order("position"),
          p.id ? C().from("student_languages").select("lang,show,hear,position").eq("student_id", p.id).order("position") : Promise.resolve({ data: [] }),
          C().from("language_coverage").select("code,words_total,words_translated,words_reviewed")]);
        ALL = (l.data || []);
        (c.data || []).forEach(x => { COV[x.code] = x; });
        let rows = (s.data || []);
        if (!rows.length) rows = [{ lang: p.home_lang || "ar", show: true, hear: true }];   // nothing chosen yet: the student's own language
        const by = new Map(ALL.map(x => [x.code, x]));
        MINE = rows.filter(r => by.has(r.lang) && by.get(r.lang).enabled && r.lang !== "en").map(r => ({ ...by.get(r.lang), show: r.show !== false, hear: r.hear !== false }));
      } catch (e) { console.warn("languages", e); }
      if (!ALL.length) loaded = null;      // nothing came back (not signed in yet?): ask again next time, never keep an empty answer
      return MINE;
    })();
    return loaded;
  }
  const mine = () => MINE.slice();
  const hearLangs = () => MINE.filter(x => x.hear);

  // translations for a list of words (only the languages the student shows or hears)
  async function attach(items) {
    await load();
    const want = MINE.filter(x => x.show || x.hear).map(x => x.code);
    const ids = [...new Set((items || []).map(v => v.wid || v.id).filter(Boolean))];
    const TR = new Map();
    if (want.length && ids.length && C()) {
      const parts = []; for (let k = 0; k < ids.length; k += 80) parts.push(ids.slice(k, k + 80));
      const res = await Promise.all(parts.map(ch => C().from("word_translations").select("word_id,lang,term,meaning,example,romanization,audio_url,root_key,root_en,root_sim,root_kind,root_note").in("lang", want).in("word_id", ch).neq("term", "")));
      res.forEach(r => (r.data || []).forEach(x => { (TR.get(x.word_id) || TR.set(x.word_id, {}).get(x.word_id))[x.lang] = x; }));
    }
    (items || []).forEach(v => {
      const t = Object.assign({}, TR.get(v.wid || v.id) || {});
      if (!t.ar && v.ar && want.includes("ar")) t.ar = { term: v.ar, meaning: "", example: "", romanization: "", audio_url: "" };   // the old Arabic column, until every page moves over
      v.trs = t;
    });
    return items;
  }

  // the translation lines to show under a word
  function lines(v) {
    const out = [];
    MINE.forEach(L => {
      const t = v && v.trs && v.trs[L.code]; if (!t || !t.term) return;
      const ff = t.root_kind === "false_friend", rel = t.root_kind === "related", near = t.root_en && (ff || rel || (t.root_sim != null && t.root_sim >= 40)) ? t.root_en : "";   // the English look-alike, only when there is a root
      out.push({ code: L.code, flag: L.flag, native: L.native_name, dir: L.dir, term: t.term, rom: t.romanization || "", hear: L.hear, meaning: t.meaning || "", near, ff, rel, note: t.root_note || "" });
    });
    return out;
  }
  // the look-alike lines for a word, read from its own translations (root origin lives in the dictionary): the % and the root are kept in the database, not shown
  function cogLines(v) {
    const out = [];
    MINE.forEach(L => {
      const t = L.show && v && v.trs && v.trs[L.code]; if (!t || !t.root_en) return;
      const ff = t.root_kind === "false_friend";
      if (!ff && t.root_kind !== "related" && (t.root_sim == null || t.root_sim < 40)) return;     // too different to look alike
      out.push({ code: L.code, flag: L.flag, term: t.term, en: t.root_en, kind: ff ? "false_friend" : "cognate", note: t.root_note || "", hear: L.hear });
    });
    return out.sort((a, b) => (a.kind === "false_friend") - (b.kind === "false_friend"));
  }
  // "خيالي: غريب وكأنه من الأحلام" → the word part is what is read aloud for a single word
  const head = t => { const m = String(t).match(/^([^:：]{1,40})[:：]\s*\S/); return m && m[1].trim().split(/\s+/).length <= 4 ? m[1].trim() : String(t); };

  let audio = null, voiceWarned = {};
  function say(v, code, opts) {
    opts = opts || {};
    const L = ALL.find(x => x.code === code), t = v && v.trs && v.trs[code];
    if (!L || !t || !t.term) return false;
    const text = opts.full ? t.term : head(t.term), done = opts.done || (() => {});
    try { if (audio) audio.pause(); speechSynthesis.cancel(); } catch (e) {}
    if (t.audio_url) {
      try { audio = new Audio(t.audio_url); audio.onended = done; audio.onerror = () => speakText(text, L, done); audio.play().catch(() => speakText(text, L, done)); return true; } catch (e) {}
    }
    return speakText(text, L, done);
  }
  function speakText(text, L, done) {
    if (!("speechSynthesis" in window)) { notify("This browser can't read aloud."); done(); return false; }
    try {
      const vs = speechSynthesis.getVoices(), lc = L.tts_lang.toLowerCase(), pre = lc.slice(0, 2);
      const vo = vs.find(x => x.lang.toLowerCase().replace("_", "-") === lc) || vs.find(x => x.lang.toLowerCase().startsWith(pre));
      if (!vo && vs.length && !voiceWarned[L.code]) { voiceWarned[L.code] = 1; notify(`This device has no ${L.name_en} voice yet. Add one in its language settings and try again.`); }
      const u = new SpeechSynthesisUtterance(text); u.lang = L.tts_lang; u.rate = .85; if (vo) u.voice = vo;
      u.onend = u.onerror = () => done(); speechSynthesis.speak(u); return true;
    } catch (e) { done(); return false; }
  }
  function notify(m) { try { if (window.App && App.status) App.status(m, false); } catch (e) {} }

  // 🌍 the student's panel
  async function save(sel) {
    const p = profile(); if (!p.id) return;
    const items = sel.filter(x => x.show || x.hear).map(x => ({ lang: x.code, show: !!x.show, hear: !!x.hear }));
    let r = null;
    for (let t = 0; t < 3; t++) {            // a dropped connection should not lose the choice: try again
      try { r = await C().rpc("set_my_languages", { p_student: p.id, p: items }); } catch (e) { r = { error: e }; }
      if (!r.error) break;
      await new Promise(z => setTimeout(z, 700 * (t + 1)));
    }
    if (r.error) { notify("Could not save your languages: " + (r.error.message || r.error)); return false; }
    loaded = null; await load(); return true;
  }
  async function picker(mount, onChange) {
    await load();
    // the picker keeps its own list (order + show/hear), redraws at once, and saves once things have settled: quick clicks never overwrite each other
    const enabled = () => ALL.filter(x => x.enabled && x.code !== "en");
    let STATE = [...MINE.map(x => ({ code: x.code, show: x.show, hear: x.hear })), ...enabled().filter(x => !MINE.some(m => m.code === x.code)).map(x => ({ code: x.code, show: false, hear: false }))];
    let timer = null, chain = Promise.resolve();
    const persist = () => { clearTimeout(timer); timer = setTimeout(() => { chain = chain.then(async () => { if (await save(STATE)) onChange && onChange(); }); }, 400); };
    const draw = () => {
      const rows = STATE.map(st => { const L = enabled().find(x => x.code === st.code); if (!L) return ""; const cv = COV[st.code] || {};
        return `<div class="lg-row" data-c="${st.code}"><span class="lg-n">${L.flag} <b>${esc(L.native_name)}</b> <small>${esc(L.name_en)}</small></span>
          <label title="Show it under each word"><input type="checkbox" data-lg="show" ${st.show ? "checked" : ""}> Show</label>
          <label title="Add a 🔊 so I can hear it"><input type="checkbox" data-lg="hear" ${st.hear ? "checked" : ""}> 🔊 Hear</label>
          <span class="lg-mv"><button type="button" data-lgmv="-1" aria-label="Move up">▲</button><button type="button" data-lgmv="1" aria-label="Move down">▼</button></span>
          <small class="lg-cov">${cv.words_translated || 0} of ${cv.words_total || 0} words</small></div>`; }).join("");
      const n = STATE.filter(x => x.show || x.hear).length, open = mount.querySelector("details") ? mount.querySelector("details").open : false;
      mount.innerHTML = `<details class="lg-box"${open ? " open" : ""}><summary>🌍 My languages <span class="lg-count">${n}</span></summary>
        <p class="lg-help">Tick the languages you want under every word, and 🔊 to hear them. The order here is the order on the cards.</p>${rows || "<p>No other languages are turned on yet.</p>"}</details>`;
    };
    if (!document.getElementById("lg-css")) { const s = document.createElement("style"); s.id = "lg-css";
      s.textContent = `.lg-box{border:1.5px solid var(--rule,#ddd);border-radius:12px;padding:6px 12px;background:var(--paper,#fff)}.lg-box summary{cursor:pointer;font:800 .95rem var(--f-body,system-ui)}.lg-count{background:var(--accent,#7c3aed);color:#fff;border-radius:999px;padding:0 8px;font-size:.8rem;margin-left:4px}
.lg-help{margin:.4rem 0;color:var(--muted,#666);font-size:.85rem}.lg-row{display:flex;gap:10px;align-items:center;flex-wrap:wrap;padding:5px 0;border-top:1px solid var(--rule,#eee)}.lg-n{flex:1 1 160px}.lg-n small{color:var(--muted,#666)}.lg-row label{font-size:.85rem;white-space:nowrap}.lg-mv button{border:0;background:var(--chip,#eee);border-radius:6px;cursor:pointer;padding:2px 7px}.lg-cov{color:var(--muted,#666);font-size:.78rem}`; document.head.appendChild(s); }
    draw();
    mount.addEventListener("change", e => {
      const k = e.target.dataset && e.target.dataset.lg; if (!k) return;
      const st = STATE.find(x => x.code === e.target.closest(".lg-row").dataset.c); if (!st) return;
      st[k] = e.target.checked; draw(); persist();
    });
    mount.addEventListener("click", e => {
      const b = e.target.closest("[data-lgmv]"); if (!b) return;
      const c = b.closest(".lg-row").dataset.c, i = STATE.findIndex(x => x.code === c), j = i + +b.dataset.lgmv; if (j < 0 || j >= STATE.length) return;
      [STATE[i], STATE[j]] = [STATE[j], STATE[i]]; draw(); persist();
    });
  }
  window.Lang = { load, mine, hearLangs, attach, lines, cogLines, say, picker, head, all: () => ALL.slice(), coverage: () => COV };
})();
