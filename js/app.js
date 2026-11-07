/* Shared app code: Supabase client, sign-in guard, top bar, saving results. */
(function () {
  const cfg = window.APP_CONFIG || {};
  const configured = !!(cfg.supabaseUrl && cfg.supabaseKey);
  const client = (window.__MOCK_SUPABASE__) || (configured && window.supabase ? window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseKey) : null);
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  let profile = null, user = null;

  async function loadProfile() {
    const { data: { session } } = await client.auth.getSession();
    user = session ? session.user : null;
    if (!user) return null;
    const { data } = await client.from("profiles").select("*").eq("id", user.id).maybeSingle();
    profile = data || { id: user.id, full_name: user.user_metadata?.full_name || "", role: user.user_metadata?.role || "student" };
    return profile;
  }

  function setupNotice() {
    document.body.insertAdjacentHTML("afterbegin", `<div style="background:#FBE7E5;color:#7a1f19;padding:12px 16px;font:15px system-ui">
      The website isn't connected to its database yet. Add the Supabase Project URL and publishable key to <b>js/config.js</b>.</div>`);
  }

  function topBar() {
    if (document.getElementById("appbar")) return;
    const I = (n) => (window.icon ? window.icon(n, 18) : "");
    const home = profile.role === "teacher" ? "teacher.html" : "student.html";
    const here = location.pathname.split("/").pop() || "index.html";
    const name = profile.full_name || user.email;
    const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join("");
    const link = (href, ic, label) => `<a href="${href}" class="${here === href ? "on" : ""}" ${here === href ? 'aria-current="page"' : ""}>${I(ic)}<span>${label}</span></a>`;
    const css = `#appbar{position:sticky;top:env(safe-area-inset-top,0px);z-index:30;display:flex;align-items:center;gap:4px;flex-wrap:wrap;
      padding:8px 16px;background:var(--sheet,#fff);border-bottom:1px solid var(--rule,#DCE1EA);font:14px var(--f-body,system-ui)}
      #appbar .brand{display:flex;align-items:center;gap:8px;font:800 1rem var(--f-display,system-ui);color:var(--ink,#1B2333);margin-right:10px;text-decoration:none}
      #appbar .brand i{width:30px;height:30px;border-radius:9px;display:grid;place-items:center;background:var(--accent,#2347C5);color:#fff;font-style:normal}
      #appbar a.nav{display:contents}
      #appbar nav{display:flex;gap:2px;flex-wrap:wrap}
      #appbar nav a{display:inline-flex;align-items:center;gap:6px;font:700 .9rem var(--f-body,system-ui);color:var(--muted,#5E6A80);text-decoration:none;padding:7px 10px;border-radius:9px}
      #appbar nav a:hover{background:var(--paper,#F7F8FB);color:var(--ink,#1B2333)}
      #appbar nav a.on{background:var(--accent-soft,#E6ECFB);color:var(--accent,#2347C5)}
      #appbar .me{margin-left:auto;display:flex;align-items:center;gap:8px}
      #appbar .av{width:32px;height:32px;border-radius:50%;display:grid;place-items:center;font:800 .8rem var(--f-display,system-ui);background:var(--accent-soft,#E6ECFB);color:var(--accent,#2347C5)}
      #appbar .nm{font-weight:700;color:var(--ink,#1B2333);max-width:16ch;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      #appbar .role{font-size:.75rem;font-weight:700;padding:2px 8px;border-radius:999px;background:var(--ink,#1B2333);color:var(--sheet,#fff)}
      #appbar button{display:inline-flex;align-items:center;gap:6px;font:700 .85rem var(--f-body,system-ui);color:var(--muted,#5E6A80);background:none;border:1px solid var(--rule,#DCE1EA);border-radius:9px;cursor:pointer;padding:6px 10px}
      @media (max-width:760px){#appbar nav a span{display:none}#appbar .nm{display:none}}`;
    document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`);
    document.body.insertAdjacentHTML("afterbegin", `<div id="appbar" role="banner"><a class="brand" href="${home}"><i>${I("book-open-check")}</i>Albarq Education Center</a>
      <nav aria-label="Main">${link(home, "house", "Home")}${link("library.html", "library", "Library")}${profile.role === "teacher" ? link("mysets.html", "layers", "My sets") : ""}${profile.is_admin ? link("admin.html", "shield-check", "Admin") : ""}</nav>
      <span class="me"><span class="av" aria-hidden="true">${esc(initials)}</span><span class="nm">${esc(name)}</span>${profile.role === "teacher" ? '<span class="role">Teacher</span>' : ""}
      <button type="button" id="signOut">${I("log-out")}<span>Sign out</span></button></span></div>`);
    document.getElementById("signOut").onclick = async () => { await client.auth.signOut(); location.href = "index.html"; };
  }

  // Call on every protected page. Resolves with the profile, or redirects to the sign-in page.
  async function requireUser(opts = {}) {
    if (!client) { setupNotice(); throw new Error("not configured"); }
    const p = await loadProfile();
    if (!p) { location.replace("index.html?next=" + encodeURIComponent(location.pathname.split("/").pop() + location.search)); throw new Error("signed out"); }
    if (opts.role && p.role !== opts.role) { location.replace(p.role === "teacher" ? "teacher.html" : "student.html"); throw new Error("wrong role"); }
    if (opts.bar !== false) topBar();
    return p;
  }

  // Save one finished activity. answers: [{word, unit, given, correct}]
  async function saveAttempt(a) {
    if (!client || !profile || profile.role !== "student") return { skipped: true };
    const row = { activity: a.activity, detail: a.detail || "", units: a.units || [], word_list: a.word_list || "", score: a.score, total: a.total, set_id: a.set_id || (window.CURRENT_SET ? window.CURRENT_SET.id : null) };
    const { data, error } = await client.from("attempts").insert(row).select("id").single();
    if (error) return { error };
    const ans = (a.answers || []).map((x, k) => ({ attempt_id: data.id, position: k + 1, word: x.word, unit: x.unit, given: String(x.given ?? ""), correct: !!x.correct }));
    if (ans.length) { const r = await client.from("attempt_answers").insert(ans); if (r.error) return { error: r.error }; }
    return { id: data.id };
  }

  async function myLists(setId) {
    if (!client || !profile) return [];
    const { data } = await client.from("practice_lists").select("id,name,words,score,total,created_at,created_by,set_id").eq("student_id", profile.id).order("created_at", { ascending: false });
    const sid = setId === undefined ? (window.CURRENT_SET ? window.CURRENT_SET.id : null) : setId;
    return (data || []).filter(l => !sid || l.set_id === sid || (!l.set_id && sid === G5));
  }
  async function saveList(name, words, score, total) {
    return client.from("practice_lists").insert({ student_id: profile.id, name, words, score: score ?? null, total: total ?? null, set_id: window.CURRENT_SET ? window.CURRENT_SET.id : null }).select("id").single();
  }
  function status(msg, ok) {
    let el = document.getElementById("appToast");
    if (!el) { document.body.insertAdjacentHTML("beforeend", `<div id="appToast" role="status" style="position:fixed;left:50%;transform:translateX(-50%);bottom:calc(84px + env(safe-area-inset-bottom,0px));z-index:40;padding:10px 16px;border-radius:999px;font:700 14px system-ui;box-shadow:0 6px 18px rgba(0,0,0,.2)"></div>`); el = document.getElementById("appToast"); }
    el.textContent = msg; el.style.background = ok ? "#1E7F4F" : "#B8322A"; el.style.color = "#fff"; el.hidden = false;
    clearTimeout(el._t); el._t = setTimeout(() => el.hidden = true, 3500);
  }
  // Subjects, levels and schools (cached for the page).
  let LK = null;
  async function lookups() {
    if (LK) return LK;
    const [s, l, i] = await Promise.all([
      client.from("subjects").select("id,name,icon,sort").order("sort", { ascending: true }),
      client.from("levels").select("code,name,stage,sort").order("sort", { ascending: true }),
      client.from("institutions").select("id,name,kind,country,city").order("name", { ascending: true }).limit(5000)]);
    LK = { subjects: s.data || [], levels: l.data || [], institutions: i.data || [] };
    LK.subject = id => LK.subjects.find(x => x.id === id) || { name: "", icon: "book-open" };
    LK.level = c => LK.levels.find(x => x.code === c) || { name: "" };
    LK.inst = id => LK.institutions.find(x => x.id === id) || null;
    return LK;
  }
  const LEVEL_GROUPS = { early: "Kindergarten", primary: "Primary school", middle: "Middle school", secondary: "High school", university: "University", adult: "Adults", any: "Any" };
  function levelOptions(levels, sel, blank) {
    const g = {}; levels.forEach(l => (g[l.stage] = g[l.stage] || []).push(l));
    return (blank ? `<option value="">${esc(blank)}</option>` : "") + Object.keys(g).map(k => `<optgroup label="${esc(LEVEL_GROUPS[k] || k)}">${g[k].map(l => `<option value="${l.code}" ${l.code === sel ? "selected" : ""}>${esc(l.name)}</option>`).join("")}</optgroup>`).join("");
  }
  function subjectOptions(subjects, sel, blank) {
    return (blank ? `<option value="">${esc(blank)}</option>` : "") + subjects.map(s => `<option value="${s.id}" ${s.id === Number(sel) ? "selected" : ""}>${esc(s.name)}</option>`).join("");
  }
  const G5 = "00000000-0000-4000-8000-000000000005";
  // A study-set card for the library and home pages. s: study_sets row (+ optional cover image url).
  function setCard(s, LK, opts = {}) {
    const sub = LK.subject(s.subject_id), lvl = LK.level(s.level_code), inst = LK.inst(s.institution_id);
    let h = 0; for (const c of String(s.id)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    const I = (n, z) => window.icon(n, z || 14);
    return `<a class="setcard" href="set.html?id=${s.id}"><div class="cv cv-${h % 5}">${s.cover_url ? `<img src="${esc(s.cover_url)}" alt="" loading="lazy">` : ""}<span class="sub">${I(sub.icon || "book-open", 20)}</span></div>
      <div class="bd"><div class="row" style="gap:6px">${opts.mine ? (s.visibility === "public" ? `<span class="tag pub">${I("globe", 12)}Public</span>` : `<span class="tag priv">${I("lock", 12)}Private</span>`) : `<span class="tag">${esc(sub.name)}</span>`}${opts.assigned ? `<span class="tag" style="background:var(--sun-soft);color:#8A6100">${I("school", 12)}${esc(opts.assigned)}</span>` : ""}</div>
      <b>${esc(s.title)}</b>
      <div class="mt"><span>${I("graduation-cap")}${esc(lvl.name || "All levels")}</span><span>${I("layers")}${s.term_count} terms${s.question_count ? " · " + s.question_count + " questions" : ""}</span></div>
      <div class="mt">${inst ? `<span>${I(inst.kind === "university" ? "landmark" : "school")}${esc(inst.name)}</span>` : ""}${s.author_name ? `<span>${I("pencil")}${esc(s.author_name)}</span>` : ""}</div></div></a>`;
  }
  window.App = { lookups, levelOptions, subjectOptions, G5, setCard, client, configured, requireUser, saveAttempt, myLists, saveList, status, esc, get profile() { return profile; }, get user() { return user; } };
})();
