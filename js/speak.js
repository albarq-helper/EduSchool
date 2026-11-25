/* 🎤 Say it: the browser listens and marks each word green (said) or orange (missed). Free: uses the browser's own speech recognition
   (Chrome, Edge, Safari). Speak.check(target, el) → Promise<{heard, score, html}>. Speak.ok tells whether this browser can listen.
   Also adds a 🎤 button after word-card titles (.syl[aria-label]). */
(function () {
  "use strict";
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const norm = w => String(w).toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9']/g, "");
  const words = s => String(s).replace(/\s*\(.*\)\s*$/, "").split(/\s+/).map(w => ({ raw: w, n: norm(w) })).filter(x => x.n);
  let busy = false;
  function listen() {
    return new Promise((res, rej) => {
      if (!SR) return rej(new Error("This browser can't listen. Try Chrome or Safari."));
      const r = new SR(); r.lang = "en-US"; r.interimResults = false; r.maxAlternatives = 3;
      let done = false; const t = setTimeout(() => { try { r.stop(); } catch (e) {} }, 8000);
      r.onresult = e => { done = true; clearTimeout(t); res([...e.results[0]].map(a => a.transcript)); };
      r.onerror = e => { clearTimeout(t); if (!done) rej(new Error(e.error === "not-allowed" ? "Please allow the microphone." : e.error === "no-speech" ? "I didn't hear anything. Try again, a bit louder." : "Couldn't listen: " + e.error)); };
      r.onend = () => { clearTimeout(t); if (!done) rej(new Error("I didn't hear anything. Try again.")); };
      r.start();
    });
  }
  // best alternative: the one that matches most target words, in order
  function mark(target, alts) {
    const T = words(target); let best = null;
    alts.forEach(a => { const H = words(a).map(x => x.n); let j = 0; const hit = T.map(x => { const k = H.indexOf(x.n, j); if (k >= 0) { j = k + 1; return true; } return false; });
      const sc = hit.filter(Boolean).length; if (!best || sc > best.sc) best = { sc, hit, heard: a }; });
    const score = T.length ? Math.round(100 * best.sc / T.length) : 0;
    const html = T.map((x, i) => `<span style="color:${best.hit[i] ? "#15803d" : "#c2410c"};font-weight:800${best.hit[i] ? "" : ";text-decoration:underline wavy"}">${esc(x.raw)}</span>`).join(" ");
    return { heard: best.heard, score, html };
  }
  async function check(target, out) {
    if (busy) return null; busy = true;
    if (out) out.innerHTML = `<span style="color:#7c3aed;font-weight:800">🎤 Listening… say: “${esc(target)}”</span>`;
    try { const alts = await listen(), m = mark(target, alts);
      if (out) out.innerHTML = `<div>${m.html}</div><small style="color:#475569">I heard: “${esc(m.heard)}” · ${m.score === 100 ? "🌟 Perfect!" : m.score >= 70 ? "👍 Nearly! Try the orange words again." : "🔁 Listen with 🔊, then try again."}</small>`;
      return m;
    } catch (e) { if (out) out.innerHTML = `<small style="color:#b45309;font-weight:700">${esc(e.message)}</small>`; return null; }
    finally { busy = false; }
  }
  // a 🎤 after each word-card title
  function scan() {
    if (!SR) return;
    document.querySelectorAll(".syl[aria-label]").forEach(el => {
      if (el.dataset.spk) return; el.dataset.spk = "1";
      const w = el.getAttribute("aria-label"), b = document.createElement("button"), out = document.createElement("span");
      b.type = "button"; b.className = "egg-btn"; b.textContent = "🎤"; b.title = `Say “${w}”`; b.setAttribute("aria-label", `Say ${w}`);
      out.style.cssText = "display:block;font-size:.9rem";
      b.addEventListener("click", ev => { ev.preventDefault(); ev.stopPropagation(); check(String(w).replace(/\s*\(.*\)\s*$/, ""), out); });
      let at = el; while (at.nextElementSibling && /egg-btn|wx-btn/.test(at.nextElementSibling.className)) at = at.nextElementSibling;
      at.insertAdjacentElement("afterend", b); b.insertAdjacentElement("afterend", out);
    });
  }
  if (SR) { const mo = new MutationObserver(() => scan()); const go = () => { scan(); mo.observe(document.body, { childList: true, subtree: true }); };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go(); }
  window.Speak = { ok: !!SR, check, mark };
})();
