// Helper Academy — shared Story builder rules (levels, scenes, AI prompts, parsing).
// Used by story.html (the student's builder) and studio.html (the parent's Director's Studio).
(function () {
  const LEVELS = [null,
    { n: "Word collector", mode: "none", min: 3, scenes: 1, d: "Pick at least 3 words and put them in order.", use: {} },
    { n: "Scene maker", mode: "none", min: 4, scenes: 2, d: "At least 4 words, in 2 or more scenes.", use: { cast: 1 } },
    { n: "Story linker", mode: "none", min: 5, scenes: 2, link: 1, d: "At least 5 words, and your own linking words in every scene.", use: { cast: 1, partner: 1 } },
    { n: "Phrase writer", mode: "scene", min: 5, scenes: 2, len: 3, tol: 4, d: "Write a short phrase (3+ words) for every scene, using one of its words.", use: { cast: 1, partner: 2, saying: 1, joiner: 1 } },
    { n: "Sentence maker", mode: "scene", min: 5, scenes: 2, len: 5, caps: 1, tol: 3, d: "Write one full sentence (5+ words) for every scene, using one of its words.", use: { cast: 2, partner: 2, saying: 1, swap: 1, joiner: 1 } },
    { n: "Strong sentences", mode: "scene", min: 6, scenes: 3, len: 7, caps: 1, all: 1, tol: 2, d: "One sentence (7+ words) per scene that uses ALL of its words.", use: { cast: 2, partner: 3, said: 1, swap: 1, phrasal: 1, joiner: 1 } },
    { n: "Word by word", mode: "word", min: 5, scenes: 2, len: 5, caps: 1, tol: 2, d: "One sentence (5+ words) for every word.", use: { cast: 2, partner: 3, said: 1, swap: 2, phrasal: 1, idiom: 1, joiner: 2 } },
    { n: "Clear meaning", mode: "word", min: 6, scenes: 3, len: 7, caps: 1, mean: 1, tol: 1, d: "One sentence (7+ words) per word that shows what the word means.", use: { cast: 2, partner: 4, said: 1, swap: 2, phrasal: 1, idiom: 1, director: 1, joiner: 2 } },
    { n: "Story writer", mode: "word", min: 8, scenes: 3, len: 8, caps: 1, mean: 1, link: 1, tol: 1, d: "8+ words per sentence, meanings clear, linking words in every scene.", use: { cast: 2, partner: 4, said: 2, swap: 2, phrasal: 2, idiom: 1, director: 1, joiner: 3 } },
    { n: "Author", mode: "word", min: 10, scenes: 4, len: 10, caps: 1, mean: 1, link: 1, tol: 0, d: "10+ words per sentence, every meaning clear, no mistakes allowed.", use: { cast: 3, partner: 5, said: 2, swap: 3, phrasal: 2, idiom: 2, director: 2, joiner: 3 } }];
  // the toolbox each level asks for (on top of the words): characters, partner words, stronger words, phrasal verbs, idioms, quotes, director cards
  const TOOLS = {
    cast:     { i: "🎭", one: "character with a name and a look", many: "characters with a name and a look", how: "Add them in 🎭 Characters." },
    partner:  { i: "✨", one: "partner word that describes a word", many: "partner words that describe words", how: "Press 🔍 on a word, then ✨ Describe it (heavy rain, ran quickly)." },
    swap:     { i: "🎚️", one: "word swapped for a stronger or better one", many: "words swapped for stronger or better ones", how: "Press 🔍 on a word, pick from a meter, ≈ Similar or ⇄ Opposites, then ↺ Use instead." },
    phrasal:  { i: "🧩", one: "phrasal verb", many: "phrasal verbs", how: "From the Phrasal Verbs box (give up, look after, find out)." },
    idiom:    { i: "🐱", one: "idiom", many: "idioms", how: "From the Idioms box, or 🔍 then ✨ Describe it (raining cats and dogs)." },
    saying:   { i: "📜", one: "quote or saying", many: "quotes or sayings", how: "From the sayings box, 🔍 then 📜 Sayings, or 💡 Quotes that fit your story." },
    said:     { i: "🗣️", one: "quote said by one of your characters", many: "quotes said by your characters", how: "Add a quote, tap its little circle and choose a character." },
    director: { i: "🎬", one: "camera or music card", many: "camera or music cards", how: "From the Director's Toolbox box." },
    joiner:   { i: "🔗", one: "joiner (a list, either … or, if …)", many: "joiners (a list, either … or, if …)", how: "Press 🔗 Joiners under your story, then fill the glowing boxes with words from the left." } };
  const TOOL_ORDER = ["cast", "partner", "swap", "joiner", "phrasal", "idiom", "saying", "said", "director"];
  // what the story already uses. D = the word library ([{w, tags}]); a phrase counts when it is a block or a partner word
  function toolCount(s, D) {
    const B = (s && s.blocks) || [], by = new Map((D || []).map(v => [String(v.w).toLowerCase(), v]));
    const has = (w, t) => { const v = by.get(String(w).toLowerCase()); return !!(v && (v.tags || []).includes(t)); };
    const names = new Set(((s && s.characters) || []).map(c => (c.name || "").trim().toLowerCase()).filter(Boolean));
    const W = B.filter(b => b.k === "w"), subs = W.flatMap(b => b.p || []);
    const isSay = b => b.k === "q" || (b.k === "w" && (has(b.w, "Saying") || (by.get(String(b.w).toLowerCase()) || {}).author));
    const says = B.filter(isSay);
    return {
      cast: ((s && s.characters) || []).filter(c => (c.name || "").trim() && ((c.look || "").trim() || (c.age || "").toString().trim())).length,
      partner: subs.filter(p => !has(p, "Idiom")).length,
      swap: W.filter(b => b.from).length,
      phrasal: W.filter(b => has(b.w, "Phrasal verb")).length + subs.filter(p => has(p, "Phrasal verb")).length,
      idiom: W.filter(b => has(b.w, "Idiom")).length + subs.filter(p => has(p, "Idiom")).length,
      saying: says.length,
      said: says.filter(b => names.has((b.by || "").trim().toLowerCase())).length,
      director: B.filter(b => b.k === "c").length,
      joiner: B.filter(b => b.k === "j" && window.Joiners && Joiners.complete(b)).length };
  }
  // [{k, need, have, ok, text, how}] for the level of the story
  function toolChecks(s, D) {
    const L = lvl(s), u = L.use || {}, c = toolCount(s, D);
    return TOOL_ORDER.filter(k => u[k] && !(k === "saying" && (u.said || 0) >= u[k])).map(k => {
      const T = TOOLS[k], n = u[k]; return { k, need: n, have: c[k], ok: c[k] >= n, text: `${T.i} ${Math.min(c[k], n)} of ${n} ${n > 1 ? T.many : T.one}`, how: T.how }; });
  }
  const useText = L => { const u = L.use || {}; const ks = TOOL_ORDER.filter(k => u[k] && !(k === "saying" && (u.said || 0) >= u[k]));
    return ks.length ? ks.map(k => `${TOOLS[k].i} ${u[k]} ${u[k] > 1 ? TOOLS[k].many : TOOLS[k].one}`).join(", ") : "—"; };
  const STATUS = { draft: "Draft", sent: "Sent to parent ✉️", returned: "Needs fixing ✏️", written: "Story ready 📖", filmed: "Movie ready 🎬" };
  const FILM_STYLE = "Cinematic soft 3D cartoon animation for children, warm friendly colours, gentle camera movement, consistent characters in every shot, no text, no letters, no words on screen, no speech, only soft music and natural sound effects.";
  const SHOT_COST = 0.85; // US$ per 5-second 720p shot (approximate)
  const clean = w => String(w).replace(/\s*\(.*\)/, "");
  // a famous saying block: {k:"q", w: saying, a: author, by: who says it ("Voice-over" or a character)}
  const sayingLine = b => `FAMOUS SAYING (${(b.by || "").trim() ? `said by ${b.by.trim()}` : "part of the story: weave it in naturally"}): "${b.w}"${b.a ? ` — ${b.a}` : ""}`;
  const lvl = s => LEVELS[(s && s.level) || 3];
  // a word block that is really a quote (from Quotes & Sayings) is not a vocabulary word
  const sayW = w => { const v = (window.WORDS || []).find(x => x.w === w); return !!(v && (v.author || (v.tags || []).includes("Saying"))); };
  // her characters: [{name, age, look, role, emoji}] -> prompt lines; the CAST line must keep them
  const ROLE_NAMES = { hero: "hero", friend: "friend", wise: "wise one", family: "family", animal: "animal", rival: "rival", other: "", doctor: "doctor", encourager: "encourager", trouble: "trouble-maker", helper: "helper", teacher: "teacher" };
  const castLines = s => (s && Array.isArray(s.characters) ? s.characters : []).filter(c => (c.name || "").trim())
    .map(c => `- ${c.name.trim()}${c.age ? `, age ${String(c.age).trim()}` : ""}${ROLE_NAMES[c.role] ? ` (${ROLE_NAMES[c.role]})` : ""}${(c.look || "").trim() ? `: ${c.look.trim()}` : ""}${(c.persona || "").trim() ? `\n  Personality: ${c.persona.trim()}` : ""}`).join("\n");
  const castBlock = s => { const c = castLines(s); return c ? `\nHer characters (use these names, ages and looks; the CAST line must describe them exactly like this):\n${c}\n` : ""; };
  // [{n, words:[term], texts:[own words]}]
  function scenes(s) {
    const sc = [{ n: 1, words: [], texts: [], cam: [], music: [], trans: [] }];
    (s && s.blocks || []).forEach(b => {
      if (b.k === "s") sc.push({ n: sc.length + 1, words: [], texts: [], cam: [], music: [], trans: [] });
      else if (b.k === "w") { if (!sayW(b.w)) sc[sc.length - 1].words.push(b.w); }
      else if (b.k === "j" && window.Joiners) { Joiners.words(b).forEach(w => { if ((window.WORDS || []).some(v => v.w === w) && !sayW(w)) sc[sc.length - 1].words.push(w); }); }
      else if (b.k === "c") { const x = sc[sc.length - 1]; if (b.m) x.music.push({ w: b.w, f: b.f || b.w }); else if (b.tr) x.trans.push(b.w); else x.cam.push({ w: b.w, f: b.f || b.w }); }
      else if ((b.t || "").trim()) sc[sc.length - 1].texts.push(b.t.trim());
    });
    return sc.filter(x => x.words.length || x.texts.length || x.cam.length || x.music.length);
  }
  // what the student has to write at this level
  function items(s) {
    const L = lvl(s), sc = scenes(s);
    if (L.mode === "scene") return sc.filter(x => x.words.length || x.texts.length).map(x => ({ key: "s" + x.n, scene: x.n, words: x.words }));
    if (L.mode === "word") return sc.flatMap(x => [...new Set(x.words)].map(w => ({ key: x.n + "|" + w, scene: x.n, words: [w] })));
    return [];
  }
  const meanings = (s, D) => [...new Set((s.blocks || []).filter(b => b.k === "w").map(b => b.w))]
    .map(w => `- ${clean(w)}: ${(D.find(v => v.w === w) || {}).d || ""}`).join("\n");
  const videoRule = `After the story, add one line starting "CAST:" that describes how each main character looks (kind of animal or person, size, colours, clothes), so every video clip shows them the same way. Then, for each scene, add one line starting "VIDEO SCENE n:" describing what a short video clip should show (place, characters, action, and the vocabulary words it shows). No text or letters on screen.`;
  function writePrompt(s, D) {
    const B = s.blocks || [], sc = [[]];
    B.forEach(b => b.k === "s" ? sc.push([]) : sc[sc.length - 1].push(b));
    const nW = new Set(B.filter(b => b.k === "w" && !sayW(b.w)).map(b => b.w)).size;
    const plan = sc.filter(x => x.length).map((x, k) => `Scene ${k + 1}: ` + x.map(b => b.k === "w" && sayW(b.w) ? sayingLine(b) : b.k === "w" ? `${(b.by || "").trim() ? `${b.by.trim()} SAYS: ` : ""}[${clean(b.w)}${b.tw ? ` → "${b.ph || b.tw}"` : ""}]${(b.p || []).length ? ` (with: ${b.p.join(", ")})` : ""}` : b.k === "j" ? (window.Joiners ? `[🔗 ${Joiners.label(b)} → "${Joiners.text(b, (s.characters || []).map(c => c.name))}"]` : "") : b.k === "q" ? sayingLine(b) : b.k === "c" ? `${b.m ? "MUSIC" : b.tr ? "TRANSITION" : "CAMERA"}: ${b.w}` : `"${(b.t || "").trim()}"`).filter(t => t && t !== '""').join(" → ")).join("\n");
    const hasQ = B.some(b => b.k === "q" || (b.k === "w" && sayW(b.w)));
    return `Please write a short children's story for my daughter, a Grade 5 student learning English vocabulary. She planned it herself in a story builder.

Her title: ${(s.title || "").trim() || "(no title yet — please suggest one)"}
${castBlock(s)}
Her plan, in her order (words in [brackets] are vocabulary words; words in "quotes" are her own words):
${plan}

Rules:
- Keep her order, her scenes and her ideas. Fill the gaps so it reads as a real story.
${B.some(b => b.k === "j") ? `- [🔗 joiner → "words"] are phrases or sentences she joined herself (lists, either … or, neither … nor, if / when): keep them exactly, including the verb forms of the if-sentences.\n` : ""}${B.some(b => b.k === "w" && b.tw) ? `- [verb → "sentence"] means she built that sentence herself (who, when and the verb form): use it in the story with exactly that verb form and time word (for example [Lie → "Rover was lying when the phone rang"]). She may also have changed the word's shape (for example [Achieve → "Your achievement"] or [Succeed → "Rover will be successful tomorrow"]): use that shape, not the verb.\n` : ""}${(s.characters || []).some(c => (c.persona || "").trim()) ? `- Each character's Personality is a set of meters (the golden middle is healthy; too little or too much causes trouble). SHOW it through what they do and say, don't list it. Let the personalities cause the conflict and the lesson. Only a doctor character may name a condition or give medical advice; a wise character may explain what is happening.\n` : ""}${castLines(s) ? `- Use her characters with their names. A FAMOUS SAYING said by one of them is spoken by that character in the story, in quotes.\n` : ""}${B.some(b => b.k === "c" && !b.m && !b.tr) ? `- CAMERA notes are her director choices (shot, angle, camera move, light). Put them in that scene's VIDEO line.\n` : ""}- Where a scene has no CAMERA note (Auto), choose a good shot size, camera angle and move for it yourself and put them in its VIDEO line. When a character says a quote, show that character (a close-up or over-the-shoulder shot) unless she chose a camera.\n${B.some(b => b.k === "c" && b.m) ? `- MUSIC notes are for the soundtrack only; do not describe music in the story or the VIDEO lines.\n` : ""}${hasQ ? `- A FAMOUS SAYING must appear word for word, spoken by the character named (or by a narrator, as a voice-over, if it says Voice-over; if it says part of the story, weave it in naturally). You may mention who first said it.\n` : ""}${B.some(b => b.k === "w" && (b.by || "").trim()) ? `- "NAME SAYS: [words]" means that character says those words aloud, in quotes, in the story.\n` : ""}${B.some(b => (b.p || []).length) ? `- "(with: …)" after a word lists word partners or idioms she chose for it (e.g. heavy rain). Use each one with its word.\n` : ""}- Use EVERY vocabulary word at least once (you may change the form, e.g. insist → insisted). Make each meaning clear from the sentence.
- Grade 5 reading level, warm and fun, about ${Math.min(600, Math.max(180, nW * 30))} words. One short paragraph per scene. No violence beyond what the words need.
- ${videoRule}

Vocabulary meanings:
${meanings(s, D)}`;
  }
  // her toolbox, for the teacher prompt
  function toolLines(s, D) {
    const B = s.blocks || [], out = [], subs = B.filter(b => b.k === "w" && (b.p || []).length).map(b => `${clean(b.w)} (with: ${b.p.join(", ")})`);
    if (subs.length) out.push(`Words she described with partner words: ${subs.join("; ")}`);
    const sw = B.filter(b => b.k === "w" && b.from).map(b => `${clean(b.from)} → ${clean(b.w)}`); if (sw.length) out.push(`Words she swapped for stronger or better ones: ${sw.join("; ")}`);
    const q = B.filter(b => b.k === "q" || (b.k === "w" && sayW(b.w))).map(sayingLine); if (q.length) out.push(...q);
    const jn = B.filter(b => b.k === "j" && window.Joiners && Joiners.complete(b)).map(b => `${Joiners.label(b)}: "${Joiners.text(b, (s.characters || []).map(c => c.name))}"`); if (jn.length) out.push(`Joiners she built: ${jn.join("; ")}`);
    const dir = B.filter(b => b.k === "c").map(b => `${b.m ? "MUSIC" : b.tr ? "TRANSITION" : "CAMERA"}: ${b.w}`); if (dir.length) out.push(`Director cards: ${dir.join("; ")}`);
    return out.length ? out.join("\n") + "\n\n" : "";
  }
  function checkPrompt(s, D) {
    const L = lvl(s), its = items(s), S = s.sentences || {};
    return `Please act as a kind English teacher for my daughter, a Grade 5 student learning English vocabulary. She planned a story in a story builder and wrote her own sentences.

Her level: ${s.level} of 10 (${L.n}): ${L.d}
Her title: ${(s.title || "").trim() || "(no title yet — please suggest one)"}
${castBlock(s)}
${toolLines(s, D)}Her sentences, scene by scene (vocabulary words in [brackets]):
${scenes(s).map(x => `Scene ${x.n} — [${x.words.map(clean).join("], [")}]${x.texts.length ? ` (her own words: ${x.texts.map(t => `"${t}"`).join(", ")})` : ""}\n` + its.filter(it => it.scene === x.n).map(it => `  ${L.mode === "word" ? clean(it.words[0]) + ": " : ""}"${(S[it.key] || "").trim()}"`).join("\n")).join("\n")}

STEP 1 — Check her sentences.
- Allowed small mistakes in total at this level: ${L.tol} (spelling, grammar, capital letters, punctuation).${L.mean ? "\n- Each vocabulary word must be used with its correct meaning, and the sentence should make the meaning clear." : "\n- Each vocabulary word must be used with a sensible meaning."}
- A vocabulary word used with the wrong meaning always counts as a mistake. Idioms and phrasal verbs are vocabulary too: check she used their real meaning, not the word-for-word one.
Reply first with exactly one line: VERDICT: ACCEPT or VERDICT: REJECT
Then list every sentence with ✓ or ✗. For each ✗ give a short, kind hint saying what to fix. Do NOT write the corrected sentence for her.

STEP 2 — Only if ACCEPT: write the final story. Keep her sentences as much as possible (fix small mistakes, join them smoothly, add a little in between so it flows). Keep her order and scenes, one paragraph per scene, Grade 5 level. ${videoRule}

Vocabulary meanings:
${meanings(s, D)}`;
  }
  const prompt = (s, D) => lvl(s).mode === "none" ? writePrompt(s, D) : checkPrompt(s, D);
  const apiPrompt = (s, D) => prompt(s, D) + (lvl(s).mode === "none"
    ? "\n\nFORMAT: Start your reply with a line 'STORY:' followed by the story, then a line 'CAST:' with the character descriptions, then a line 'VIDEO SCENES:' followed by the VIDEO SCENE lines. No other headings."
    : "\n\nFORMAT: Use exactly these headings, each on its own line: 'VERDICT: ACCEPT' or 'VERDICT: REJECT', then 'FEEDBACK:' followed by the ✓/✗ list with hints, then (only if ACCEPT) 'STORY:' followed by the story, 'CAST:' with the character descriptions, and 'VIDEO SCENES:' followed by the VIDEO SCENE lines.");
  // split an AI answer into VERDICT / FEEDBACK / STORY / CAST / VIDEO SCENES
  function sections(t) {
    const out = {}, re = /^\s*\**\s*(VERDICT|FEEDBACK|STORY|CAST|VIDEO SCENES)\s*:\**\s*(.*)$/gim, marks = []; let m;
    while ((m = re.exec(t))) marks.push({ k: m[1].toUpperCase(), i: m.index, end: re.lastIndex, rest: m[2] });
    marks.forEach((x, j) => { const body = t.slice(x.end, j + 1 < marks.length ? marks[j + 1].i : t.length); out[x.k] = ((x.rest || "") + "\n" + body).replace(/\n{3,}/g, "\n\n").trim(); });
    return out;
  }
  // "CAST: ...\nVIDEO SCENE 1: ...\nVIDEO SCENE 2: ..." <-> {cast, shots:[{n,text}]}
  function parsePlan(txt) {
    const shots = [], castM = String(txt || "").match(/^\s*CAST\s*:\s*(.+)$/im);
    String(txt || "").split(/\n/).forEach(l => { const m = l.match(/^\s*\**\s*VIDEO SCENE\s*(\d+)\s*\**\s*[:.\-–]\s*(.+)$/i); if (m) shots.push({ n: +m[1], text: m[2].trim() }); });
    return { cast: castM ? castM[1].trim() : "", shots };
  }
  const planText = (cast, shots) => (cast ? `CAST: ${cast}\n` : "") + shots.map((x, k) => `VIDEO SCENE ${k + 1}: ${x.text}`).join("\n");
  const paragraphs = t => String(t || "").split(/\n\s*\n|\n/).map(x => x.trim()).filter(Boolean);
  window.StoryCore = { TOOLS, toolCount, toolChecks, useText, sayingLine, castLines, LEVELS, STATUS, FILM_STYLE, SHOT_COST, clean, lvl, scenes, items, writePrompt, checkPrompt, prompt, apiPrompt, sections, parsePlan, planText, paragraphs };
})();
