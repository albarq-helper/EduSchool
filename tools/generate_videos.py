#!/usr/bin/env python3
"""
Generate one short cartoon clip per vocabulary word with Seedance 2.0 on fal.ai.

HOW IT WORKS (the same pattern works for almost every AI video model on fal.ai):
  1. SUBMIT  - POST the prompt to   https://queue.fal.run/<model-id>
               fal answers at once with a request_id plus a status_url and a response_url.
  2. POLL    - GET the status_url every few seconds until "status" is "COMPLETED".
               (Video models take ~30 s to a few minutes; they run in a queue, not instantly.)
  3. FETCH   - GET the response_url -> JSON with {"video": {"url": "https://...fal.media/..."}}.
  4. DOWNLOAD the MP4 from that URL (fal keeps it only for a limited time, so save it).
  Every request needs the header   Authorization: Key <your fal key>.

USAGE
  python3 generate_videos.py --key-file ../../fal_key.rtf --prompts prompts_unit5.json --out ../assets/videos
  python3 generate_videos.py ... --only rustled,sigh      # just some words
  python3 generate_videos.py ... --dry-run                # show prompts and estimated cost, spend nothing

Price (Seedance 2.0, Nov 2026): billed by tokens = height x width x seconds x 24 / 1024,
at $0.014 per 1,000 tokens.  A square 720x720 clip of 5 s is about 60,750 tokens = about $0.85.
"""
import argparse, json, os, re, sys, time, urllib.request, urllib.error

MODEL = "bytedance/seedance-2.0/text-to-video"
QUEUE = "https://queue.fal.run/"

def read_key(path):
    """Read the fal key from a .txt or .rtf file without printing it. Keys look like  id:secret."""
    raw = open(path, encoding="utf-8", errors="ignore").read()
    if path.lower().endswith(".rtf"):                      # strip RTF control words and braces
        raw = re.sub(r"\\[a-zA-Z]+-?\d* ?", "", raw).replace("{", "").replace("}", "")
    m = re.search(r"[A-Za-z0-9_-]{8,}:[A-Za-z0-9_-]{16,}", re.sub(r"\s+", "", raw))
    if not m:
        sys.exit("No fal key found in " + path)
    return m.group(0)

def call(method, url, key, body=None):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method,
                                 headers={"Authorization": "Key " + key, "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"{method} {url.split('?')[0]} -> HTTP {e.code}: {e.read().decode()[:300]}")

def tokens(settings):
    side = {"480p": 480, "720p": 720, "1080p": 1080}[settings.get("resolution", "720p")]
    w, h = (side, side) if settings.get("aspect_ratio") == "1:1" else (side * 16 // 9, side)
    return w * h * int(settings.get("duration", "5")) * 24 / 1024

APP = "/".join(MODEL.split("/")[:2])          # queue URLs use owner/app, e.g. bytedance/seedance-2.0

def job_urls(request_id):
    base = f"{QUEUE}{APP}/requests/{request_id}"
    return {"request_id": request_id, "status_url": base + "/status", "response_url": base}

def generate(key, prompt, settings, out_path, log, jobs, slug, jobs_file):
    # 1. submit (or resume a job submitted earlier, so we never pay twice)
    if slug in jobs:
        job = jobs[slug]; log(f"   resuming request_id={job['request_id']}")
    else:
        job = call("POST", QUEUE + MODEL, key, {"prompt": prompt, **settings})
        jobs[slug] = {k: job[k] for k in ("request_id", "status_url", "response_url")}
        json.dump(jobs, open(jobs_file, "w"), indent=1)
        log(f"   queued  request_id={job['request_id']}")
    # 2. poll
    t0 = time.time()
    while True:
        st = call("GET", job["status_url"], key)
        if st.get("status") == "COMPLETED":
            break
        if time.time() - t0 > 900:
            raise RuntimeError("timed out after 15 minutes")
        time.sleep(6)
    log(f"   finished in {time.time() - t0:.0f} s")
    # 3. fetch result, 4. download the video
    res = call("GET", job["response_url"], key)
    url = res["video"]["url"]
    with urllib.request.urlopen(url, timeout=300) as r, open(out_path, "wb") as f:
        f.write(r.read())
    return res

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--key-file", required=True)
    ap.add_argument("--prompts", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--only", default="")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--force", action="store_true", help="regenerate even if the file exists")
    a = ap.parse_args()
    P = json.load(open(a.prompts))
    words = [w for w in P["words"] if not a.only or w["slug"] in a.only.split(",")]
    os.makedirs(a.out, exist_ok=True)
    cost_each = tokens(P["settings"]) / 1000 * 0.014
    print(f"{len(words)} clips x ~${cost_each:.2f} = ~${cost_each * len(words):.2f}")
    log = lambda s: print(s, flush=True)
    report = []
    jobs_file = os.path.join(a.out, "_jobs.json")
    jobs = json.load(open(jobs_file)) if os.path.exists(jobs_file) else {}
    for w in words:
        prompt = f"{w['scene']} {P['style']}"
        out = os.path.join(a.out, w["slug"] + ".raw.mp4")
        print(f"\n== {w['term']}")
        if a.dry_run:
            print("   " + prompt); continue
        if os.path.exists(out) and not a.force:
            print("   already done, skipping (use --force to redo)"); continue
        key = read_key(a.key_file)
        try:
            generate(key, prompt, P["settings"], out, log, jobs, w["slug"], jobs_file)
            report.append({"slug": w["slug"], "ok": True}); jobs.pop(w["slug"], None)
            json.dump(jobs, open(jobs_file, "w"), indent=1)
            print(f"   saved {out}")
        except Exception as e:
            report.append({"slug": w["slug"], "ok": False, "error": str(e)})
            print(f"   FAILED: {e}")
    json.dump(report, open(os.path.join(a.out, "_report.json"), "w"), indent=1)

if __name__ == "__main__":
    main()
