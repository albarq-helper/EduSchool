/* Same-meaning words (synonyms) from the dictionary: words that share a synonym_key.
   Syn.attach(items)  → puts v.syn = ["Decapitate", …] on every word (the other words of its group), v.synKey for pointing/grouping. */
(function () {
  "use strict";
  const C = () => (window.App && App.client) || null;
  async function attach(items) {
    const c = C(); const list = items || [];
    list.forEach(v => { v.syn = []; });
    if (!c) return list;
    const ids = [...new Set(list.map(v => v.wid || v.id).filter(Boolean))];
    if (!ids.length) return list;
    try {
      await c.auth.getSession();     // wait until the sign-in is ready, or the first answer is empty
      const key = new Map();
      const parts = []; for (let k = 0; k < ids.length; k += 80) parts.push(ids.slice(k, k + 80));
      (await Promise.all(parts.map(ch => c.from("words").select("id,synonym_key").in("id", ch).not("synonym_key", "is", null)))).forEach(r => (r.data || []).forEach(x => key.set(x.id, x.synonym_key)));
      const keys = [...new Set(key.values())]; if (!keys.length) return list;
      const kp = []; for (let k = 0; k < keys.length; k += 60) kp.push(keys.slice(k, k + 60));
      const byKey = new Map();
      (await Promise.all(kp.map(ch => c.from("words").select("id,headword,synonym_key").in("synonym_key", ch)))).forEach(r => (r.data || []).forEach(x => {
        (byKey.get(x.synonym_key) || byKey.set(x.synonym_key, []).get(x.synonym_key)).push(x);
      }));
      list.forEach(v => {
        const id = v.wid || v.id, k = key.get(id); if (!k) return;
        v.synKey = k;
        v.syn = (byKey.get(k) || []).filter(x => x.id !== id).map(x => x.headword).sort((a, b) => a.localeCompare(b));
      });
    } catch (e) {}
    return list;
  }
  window.Syn = { attach };
})();
