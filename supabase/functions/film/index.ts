// Helper Academy — "film" Edge Function (Director's Studio).
// action "shoot": start a clip for one scene with fal (Seedance 2.0, 16:9, 5 s) using the "fal_key" secret.
// action "check": ask fal how a take is doing; when finished, copy the clip into the public "movies" bucket.
// Safety: signed-in parent (teacher) accounts only, only stories they may direct, at most DAILY_SHOTS per 24 hours,
// every take logged in public.ai_usage (service 'fal'). Runs as the signed-in user; no server key needed.
import { createClient } from "npm:@supabase/supabase-js@2";

const DAILY_SHOTS = 12;
const MODEL = Deno.env.get("fal_model") || "bytedance/seedance-2.0/text-to-video";
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
    if (prof?.role !== "teacher") return reply({ error: "Only the parent account can make movies." }, 403);
    const key = Deno.env.get("fal_key");
    if (!key) return reply({ error: "The fal_key secret is missing in Supabase." }, 500);
    const fal = async (method: string, u: string, body?: unknown) => {
      const r = await fetch(u, { method, headers: { Authorization: `Key ${key}`, "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error("fal: " + (j?.detail?.[0]?.msg || j?.detail || j?.error || r.status));
      return j;
    };
    const body = await req.json().catch(() => ({}));

    if (body.action === "shoot") {
      const storyId = String(body.story_id || ""), scene = Math.trunc(+body.scene || 0), prompt = String(body.prompt || "").trim().slice(0, 3500);
      if (!storyId || scene < 1 || prompt.length < 5) return reply({ error: "Missing story, scene or prompt." }, 400);
      const { data: s } = await db.from("stories").select("id").eq("id", storyId).maybeSingle();
      if (!s) return reply({ error: "Story not found." }, 404);
      const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
      const { count } = await db.from("ai_usage").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("service", "fal").gte("created_at", since);
      if ((count ?? 0) >= DAILY_SHOTS) return reply({ error: `Daily movie limit reached (${DAILY_SHOTS} shots in 24 hours).` }, 429);
      const j = await fal("POST", `https://queue.fal.run/${MODEL}`, { prompt, duration: "5", resolution: "720p", aspect_ratio: "16:9", generate_audio: true });
      const { data: shot, error } = await db.from("story_shots").insert({
        story_id: storyId, scene, prompt, status: "shooting", request_id: j.request_id || "", status_url: j.status_url || "", response_url: j.response_url || "",
      }).select("*").single();
      await db.from("ai_usage").insert({ user_id: user.id, service: "fal", task: "shoot", story_id: storyId, ok: !error });
      if (error) return reply({ error: error.message }, 400);
      return reply({ shot, used: (count ?? 0) + 1, limit: DAILY_SHOTS });
    }

    if (body.action === "check") {
      const { data: shot } = await db.from("story_shots").select("*").eq("id", String(body.shot_id || "")).maybeSingle();
      if (!shot) return reply({ error: "Take not found." }, 404);
      if (shot.status === "ready" || shot.status === "failed") return reply({ shot });
      const st = await fal("GET", shot.status_url);
      if (st.status === "COMPLETED") {
        const r = await fal("GET", shot.response_url);
        const src = r?.video?.url;
        if (!src) {
          const { data: f } = await db.from("story_shots").update({ status: "failed", error: "No video in the answer", updated_at: new Date().toISOString() }).eq("id", shot.id).select("*").single();
          return reply({ shot: f });
        }
        let finalUrl = src;
        try { // keep our own copy (fal links can expire)
          const bytes = new Uint8Array(await (await fetch(src)).arrayBuffer());
          const path = `${shot.story_id}/scene${shot.scene}-${shot.id}.mp4`;
          const up = await db.storage.from("movies").upload(path, bytes, { contentType: "video/mp4", upsert: false });
          if (!up.error) finalUrl = db.storage.from("movies").getPublicUrl(path).data.publicUrl;
        } catch (_) { /* fall back to fal's link */ }
        const { data: done } = await db.from("story_shots").update({ status: "ready", video_url: finalUrl, updated_at: new Date().toISOString() }).eq("id", shot.id).select("*").single();
        return reply({ shot: done });
      }
      if (st.status === "FAILED" || st.status === "ERROR") {
        const { data: f } = await db.from("story_shots").update({ status: "failed", error: String(st.error || "fal could not make this shot"), updated_at: new Date().toISOString() }).eq("id", shot.id).select("*").single();
        return reply({ shot: f });
      }
      return reply({ shot, fal_status: st.status, queue_position: st.queue_position ?? null });
    }
    return reply({ error: "Unknown action." }, 400);
  } catch (e) {
    return reply({ error: String((e as Error)?.message || e) }, 500);
  }
});
