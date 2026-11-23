// Helper Academy — "music" Edge Function (Director's Studio soundtrack).
// action "compose": make an original soundtrack with ElevenLabs Music (POST /v1/music) from a style prompt,
// save the MP3 in the public "movies" bucket and record it in public.story_music.
// Safety: signed-in parent (teacher) accounts only, only stories they may direct, at most DAILY_TRACKS per 24 hours,
// every try logged in public.ai_usage (service 'elevenlabs', task 'music'). Uses the "elevenlabs" secret. Runs as the signed-in user.
import { createClient } from "npm:@supabase/supabase-js@2";

const DAILY_TRACKS = 6;
const MODEL = Deno.env.get("music_model") || "music_v1";
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
    const db = createClient(url, apikey, { global: { headers: { Authorization: `Bearer ${jwt}` } }, auth: { persistSession: false } });
    const { data: { user } } = await db.auth.getUser(jwt);
    if (!user) return reply({ error: "Please sign in." }, 401);
    const { data: prof } = await db.from("profiles").select("role").eq("id", user.id).single();
    if (prof?.role !== "teacher") return reply({ error: "Only the parent account can make music." }, 403);
    const key = Deno.env.get("elevenlabs");
    if (!key) return reply({ error: "The elevenlabs secret is missing in Supabase." }, 500);
    const body = await req.json().catch(() => ({}));
    if (body.action !== "compose") return reply({ error: "Unknown action." }, 400);

    const storyId = String(body.story_id || ""), scene = Math.max(0, Math.min(50, Math.trunc(+body.scene || 0)));
    const prompt = String(body.prompt || "").trim().slice(0, 4000), style = String(body.style || "").slice(0, 200);
    const lengthMs = Math.max(5000, Math.min(180000, Math.trunc(+body.length_ms || 30000)));
    if (!storyId || prompt.length < 3) return reply({ error: "Missing story or music description." }, 400);
    const { data: s } = await db.from("stories").select("id").eq("id", storyId).maybeSingle();
    if (!s) return reply({ error: "Story not found." }, 404);
    const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    const { count } = await db.from("ai_usage").select("id", { count: "exact", head: true })
      .eq("user_id", user.id).eq("service", "elevenlabs").eq("task", "music").gte("created_at", since);
    if ((count ?? 0) >= DAILY_TRACKS) return reply({ error: `Daily music limit reached (${DAILY_TRACKS} tracks in 24 hours).` }, 429);

    const r = await fetch("https://api.elevenlabs.io/v1/music?output_format=mp3_44100_128", {
      method: "POST",
      headers: { "xi-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, music_length_ms: lengthMs, model_id: MODEL }),
    });
    if (!r.ok) {
      const t = await r.text().catch(() => "");
      let msg = t; try { const j = JSON.parse(t); msg = j?.detail?.message || j?.detail?.status || (typeof j?.detail === "string" ? j.detail : "") || t; } catch (_) { /* text */ }
      await db.from("ai_usage").insert({ user_id: user.id, service: "elevenlabs", task: "music", story_id: storyId, ok: false });
      return reply({ error: "ElevenLabs: " + String(msg || r.status).slice(0, 300) }, 502);
    }
    const bytes = new Uint8Array(await r.arrayBuffer());
    const path = `${storyId}/music-${scene}-${Date.now()}.mp3`;
    const up = await db.storage.from("movies").upload(path, bytes, { contentType: "audio/mpeg", upsert: false });
    await db.from("ai_usage").insert({ user_id: user.id, service: "elevenlabs", task: "music", story_id: storyId, ok: !up.error });
    if (up.error) return reply({ error: "Could not save the music: " + up.error.message }, 500);
    const audioUrl = db.storage.from("movies").getPublicUrl(path).data.publicUrl;
    const { data: track, error } = await db.from("story_music").insert({ story_id: storyId, scene, prompt, style, length_ms: lengthMs, audio_url: audioUrl }).select("*").single();
    if (error) return reply({ error: error.message }, 400);
    return reply({ track, used: (count ?? 0) + 1, limit: DAILY_TRACKS });
  } catch (e) {
    return reply({ error: String((e as Error)?.message || e) }, 500);
  }
});
