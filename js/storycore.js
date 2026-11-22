// Helper Academy — shared Story builder rules (levels, scenes, AI prompts, parsing).
// Used by story.html (the student's builder) and studio.html (the parent's Director's Studio).
(function () {
  const LEVELS = [null,
    { n: "Word collector", mode: "none", min: 3, scenes: 1, d: "Pick at least 3 words and put them in order." },
    { n: "Scene maker", mode: "none", min: 4, scenes: 2, d: "At least 4 words, in 2 or more scenes." },
    { n: "Story linker", mode: "none", min: 5, scenes: 2, link: 1, d: "At least 5 words, and your own linking words in every scene." },
    { n: "Phrase writer", mode: "scene", min: 5, scenes: 2, len: 3, tol: 4, d: "Write a short phrase (3+ words) for every scene, using one of its words." },
    { n: "Sentence maker", mode: "scene", min: 5, scenes: 2, len: 5, caps: 1, tol: 3, d: "Write one full sentence (5+ words) for every scene, using one of its words." },
    { n: "Strong sentences", mode: "scene", min: 6, scenes: 3, len: 7, caps: 1, all: 1, tol: 2, d: "One sentence (7+ words) per scene that uses ALL of its words." },
    { n: "Word by word", mode: "word", min: 5, scenes: 2, len: 5, caps: 1, tol: 2, d: "One sentence (5+ words) for every word." },
    { n: "Clear meaning", mode: "word", min: 6, scenes: 3, len: 7, caps: 1, mean: 1, tol: 1, d: "One sentence (7+ words) per word that shows what the word means." },
    { n: "Story writer", mode: "word", min: 8, scenes: 3, len: 8, caps: 1, mean: 1, link: 1, tol: 1, d: "8+ words per sentence, meanings clear, linking words in every scene." },
    { n: "Author", mode: "word", min: 10, scenes: 4, len: 10, caps: 1, mean: 1, link: 1, tol: 0, d: "10+ words per sentence, every meaning clear, no mistakes allowed." }];
  const STATUS = { draft: "Draft", sent: "Sent to parent ✉️", returned: "Needs fixing ✏️", written: "Story ready 📖", filmed: "Movie ready 🎬" };
  const FILM_STYLE = "Cinematic soft 3D cartoon animation for children, warm friendly colours, gentle camera movement, consistent characters in every shot, no text, no letters, no words on screen, no speech, only soft music and natural sound effects.";
  const SHOT_COST = 0.85; // US$ per 5-second 720p shot (approximate)
  const clean = w => String(w).replace(/\s*\(.*\)/, "");
  const lvl = s => LEVELS[(s && s.level) || 3];
  // [{n, words:[term], texts:[own words]}]
  function scenes(s) {
    const sc = [{ n: 1, words: [], texts: [] }];
    (s && s.blocks || []).forEach(b => {
      if (b.k === "s") sc.push({ n: sc.length + 1, words: [], texts: [] });
      else if (b.k === "w") sc[sc.length - 1].words.push(b.w);
      else if ((b.t || "").trim()) sc[sc.length - 1].texts.push(b.t.trim());
    });
    return sc.filter(x => x.words.length || x.texts.length);
  }
  // what the student has to write at this level
  function items(s) {
    const L = lvl(s), sc = scenes(s);
    if (L.mode === "scene") return sc.map(x => ({ key: "s" + x.n, scene: x.n, words: x.words }));
    if (L.mode === "word") return sc.flatMap(x => [...new Set(x.words)].map(w => ({ key: x.n + "|" + w, scene: x.n, words: [w] })));
    return [];
  }
  const meanings = (s, D) => [...new Set((s.blocks || []).filter(b => b.k === "w").map(b => b.w))]
    .map(w => `- ${clean(w)}: ${(D.find(v => v.w === w) || {}).d || ""}`).join("\n");
  const videoRule = `After the story, add one line starting "CAST:" that describes how each main character looks (kind of animal or person, size, colours, clothes), so every video clip shows them the same way. Then, for each scene, add one line starting "VIDEO SCENE n:" describing what a short video clip should show (place, characters, action, and the vocabulary words it shows). No text or letters on screen.`;
  function writePrompt(s, D) {
    const B = s.blocks || [], sc = [[]];
    B.forEach(b => b.k === "s" ? sc.push([]) : sc[sc.length - 1].push(b));
    const nW = new Set(B.filter(b => b.k === "w").map(b => b.w)).size;
    const plan = sc.filter(x => x.length).map((x, k) => `Scene ${k + 1}: ` + x.map(b => b.k === "w" ? `[${clean(b.w)}]` : `"${(b.t || "").trim()}"`).filter(t => t !== '""').join(" → ")).join("\n");
    return `Please write a short children's story for my daughter, a Grade 5 student learning English vocabulary. She planned it herself in a story builder.

Her title: ${(s.title || "").trim() || "(no title yet — please suggest one)"}

Her plan, in her order (words in [brackets] are vocabulary words; words in "quotes" are her own words):
${plan}

Rules:
- Keep her order, her scenes and her ideas. Fill the gaps so it reads as a real story.
- Use EVERY vocabulary word at least once (you may change the form, e.g. insist → insisted). Make each meaning clear from the sentence.
- Grade 5 reading level, warm and fun, about ${Math.min(600, Math.max(180, nW * 30))} words. One short paragraph per scene. No violence beyond what the words need.
- ${videoRule}

Vocabulary meanings:
${meanings(s, D)}`;
  }
  function checkPrompt(s, D) {
    const L = lvl(s), its = items(s), S = s.sentences || {};
    return `Please act as a kind English teacher for my daughter, a Grade 5 student learning English vocabulary. She planned a story in a story builder and wrote her own sentences.

Her level: ${s.level} of 10 (${L.n}): ${L.d}
Her title: ${(s.title || "").trim() || "(no title yet — please suggest one)"}

Her sentences, scene by scene (vocabulary words in [brackets]):
${scenes(s).map(x => `Scene ${x.n} — [${x.words.map(clean).join("], [")}]${x.texts.length ? ` (her own words: ${x.texts.map(t => `"${t}"`).join(", ")})` : ""}\n` + its.filter(it => it.scene === x.n).map(it => `  ${L.mode === "word" ? clean(it.words[0]) + ": " : ""}"${(S[it.key] || "").trim()}"`).join("\n")).join("\n")}

STEP 1 — Check her sentences.
- Allowed small mistakes in total at this level: ${L.tol} (spelling, grammar, capital letters, punctuation).${L.mean ? "\n- Each vocabulary word must be used with its correct meaning, and the sentence should make the meaning clear." : "\n- Each vocabulary word must be used with a sensible meaning."}
- A vocabulary word used with the wrong meaning always counts as a mistake.
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
  window.StoryCore = { LEVELS, STATUS, FILM_STYLE, SHOT_COST, clean, lvl, scenes, items, writePrompt, checkPrompt, prompt, apiPrompt, sections, parsePlan, planText, paragraphs };
})();
