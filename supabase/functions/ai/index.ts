// Helper Academy — "ai" Edge Function.
// The browser sends a prompt; this function adds the OpenAI key (secret "open_ai") on the server and returns the answer.
// Safety: signed-in users only, parent (teacher) accounts only, at most DAILY_LIMIT calls per rolling 24 hours,
// every call logged in public.ai_usage (rows can be added but never deleted). Optional secret "openai_model" picks the model.
// It runs as the signed-in user (normal database security rules apply); no server key is needed.
import { createClient } from "npm:@supabase/supabase-js@2";

const DAILY_LIMIT = 30;
const MODEL = Deno.env.get("openai_model") || "gpt-4o-mini";
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const reply = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return reply({ error: "POST only" }, 405);
  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const apikey = req.headers.get("apikey") || Deno.env.get("SUPABASE_PUBLISHABLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY") || "";
    const jwt = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
    if (!jwt) return reply({ error: "Please sign in." }, 401);
    const asUser = createClient(url, apikey, { global: { headers: { Authorization: `Bearer ${jwt}` } }, auth: { persistSession: false } });
    const { data: { user } } = await asUser.auth.getUser(jwt);
    if (!user) return reply({ error: "Please sign in." }, 401);
    const admin = asUser; // same signed-in user; row-level security applies

    const { data: prof } = await admin.from("profiles").select("role").eq("id", user.id).single();
    if (prof?.role !== "teacher") return reply({ error: "Only the parent account can use AI." }, 403);

    const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    const { count } = await admin.from("ai_usage").select("id", { count: "exact", head: true })
      .eq("user_id", user.id).eq("service", "openai").gte("created_at", since);
    const used = count ?? 0;
    if (used >= DAILY_LIMIT) return reply({ error: `Daily AI limit reached (${DAILY_LIMIT} in 24 hours). Try again tomorrow.` }, 429);

    const body = await req.json().catch(() => ({}));
    const prompt = String(body.prompt || "").slice(0, 20000);
    const task = String(body.task || "").slice(0, 40);
    let storyId: string | null = body.story_id || null;
    if (prompt.trim().length < 20) return reply({ error: "The prompt is empty." }, 400);
    if (storyId) { // only stories this parent can see
      const { data: s } = await asUser.from("stories").select("id").eq("id", storyId).maybeSingle();
      if (!s) storyId = null;
    }

    const key = Deno.env.get("open_ai");
    if (!key) return reply({ error: "The open_ai secret is missing in Supabase." }, 500);
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: "You are a kind, careful English teacher for a Grade 5 child. Follow the requested format exactly." },
          { role: "user", content: prompt },
        ],
        max_completion_tokens: 3000,
      }),
    });
    const out = await r.json().catch(() => ({}));
    await admin.from("ai_usage").insert({
      user_id: user.id, service: "openai", task, story_id: storyId,
      tokens_in: out?.usage?.prompt_tokens || 0, tokens_out: out?.usage?.completion_tokens || 0, ok: r.ok,
    });
    if (!r.ok) return reply({ error: "OpenAI: " + (out?.error?.message || r.status) }, 502);
    return reply({ text: out?.choices?.[0]?.message?.content || "", model: out?.model || MODEL, used: used + 1, limit: DAILY_LIMIT });
  } catch (e) {
    return reply({ error: String((e as Error)?.message || e) }, 500);
  }
});
