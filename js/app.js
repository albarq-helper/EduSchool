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
    document.body.insertAdjacentHTML("afterbegin", `<header id="appbar"><a class="brand" href="${home}"><i>${I("book-open-check")}</i>Albarq Education Center</a>
      <nav aria-label="Main">${link(home, "house", "Home")}${link("exam.html", "clipboard-check", "Exam")}${link("games.html", "puzzle", "Games")}${link("spelling.html", "spell-check-2", "Spelling")}${link("act.html", "drama", "Act it out")}</nav>
      <span class="me"><span class="av" aria-hidden="true">${esc(initials)}</span><span class="nm">${esc(name)}</span>${profile.role === "teacher" ? '<span class="role">Teacher</span>' : ""}
      <button type="button" id="signOut">${I("log-out")}<span>Sign out</span></button></span></header>`);
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
    const row = { activity: a.activity, detail: a.detail || "", units: a.units || [], word_list: a.word_list || "", score: a.score, total: a.total };
    const { data, error } = await client.from("attempts").insert(row).select("id").single();
    if (error) return { error };
    const ans = (a.answers || []).map((x, k) => ({ attempt_id: data.id, position: k + 1, word: x.word, unit: x.unit, given: String(x.given ?? ""), correct: !!x.correct }));
    if (ans.length) { const r = await client.from("attempt_answers").insert(ans); if (r.error) return { error: r.error }; }
    return { id: data.id };
  }

  async function myLists() {
    if (!client || !profile) return [];
    const { data } = await client.from("practice_lists").select("id,name,words,score,total,created_at,created_by").eq("student_id", profile.id).order("created_at", { ascending: false });
    return data || [];
  }
  async function saveList(name, words, score, total) {
    return client.from("practice_lists").insert({ student_id: profile.id, name, words, score: score ?? null, total: total ?? null }).select("id").single();
  }
  function status(msg, ok) {
    let el = document.getElementById("appToast");
    if (!el) { document.body.insertAdjacentHTML("beforeend", `<div id="appToast" role="status" style="position:fixed;left:50%;transform:translateX(-50%);bottom:calc(84px + env(safe-area-inset-bottom,0px));z-index:40;padding:10px 16px;border-radius:999px;font:700 14px system-ui;box-shadow:0 6px 18px rgba(0,0,0,.2)"></div>`); el = document.getElementById("appToast"); }
    el.textContent = msg; el.style.background = ok ? "#1E7F4F" : "#B8322A"; el.style.color = "#fff"; el.hidden = false;
    clearTimeout(el._t); el._t = setTimeout(() => el.hidden = true, 3500);
  }
  window.App = { client, configured, requireUser, saveAttempt, myLists, saveList, status, esc, get profile() { return profile; }, get user() { return user; } };
})();
