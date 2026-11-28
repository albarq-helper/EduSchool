# Builds supabase_v95_word_effects.sql: one row per word effect (Easter egg) with how it behaves when the kid moves a meter.
import json
rows = json.load(open("/tmp/fxrows.json"))
FULL = set("Hurricane,Gale,Wind,Gust,Breeze,Storm,Thunder,Rain,Drizzle,Shower,Downpour,Flood,Snow,Blizzard,Sleet,Hail,Sun,Heat,Golden hour,Rainbow,Raining cats and dogs,Sway,Storm swallows the page,Soaked,Stomp,Separated,Far away".split(","))
OFF = set("Magnifier,Torch,Candle,Laser,Rifle · target practice".split(","))
KIND = {"weather": "Hurricane,Gale,Wind,Gust,Breeze,Storm,Thunder,Rain,Drizzle,Shower,Downpour,Flood,Snow,Blizzard,Sleet,Hail,Sun,Heat,Golden hour,Rainbow,Raining cats and dogs,Fog,Silver lining,Moist,Damp,Wet,Soaked,Storm swallows the page",
        "light": "Night,Dark,Dim,Torch,Candle,Laser,Sunbeam,Moonbeam,Bright,Dazzling,Gleam",
        "watch": "Peep,Watching you,Magnifier,Spy"}
kind = {n: k for k, v in KIND.items() for n in v.split(",")}
q = lambda s: "'" + str(s).replace("'", "''") + "'"
out = ["-- Word effects (Easter eggs): how each one behaves while a kid moves a meter. full = whole screen, box = inside the box under the meter, off = only on the ⤢ button.",
"create table if not exists public.word_effects (effect text primary key, emoji text not null default '✨', trigger_words text not null default '', kind text not null default 'scene', page_bound boolean not null default false, in_meter text not null default 'box' check (in_meter in ('full','box','off')), note text not null default '', updated_at timestamptz not null default now());",
"alter table public.word_effects enable row level security;",
"grant select on public.word_effects to anon, authenticated; grant insert, update on public.word_effects to authenticated;",
"drop policy if exists \"read effects\" on public.word_effects; create policy \"read effects\" on public.word_effects for select using (true);",
"drop policy if exists \"parents edit effects\" on public.word_effects; create policy \"parents edit effects\" on public.word_effects for update to authenticated using (public.is_quote_editor()) with check (public.is_quote_editor());",
"drop policy if exists \"parents add effects\" on public.word_effects; create policy \"parents add effects\" on public.word_effects for insert to authenticated with check (public.is_quote_editor());",
"insert into public.word_effects (effect, emoji, trigger_words, kind, page_bound, in_meter) values"]
vals = []
for n, v in rows.items():
    f = v["flags"]
    pb = any(x in f for x in ["vortex", "split", "far", "stomp", "sway", "mag", "rifle", "torch", "laser", "puddle", "drip", "wind"]) or n == "Storm swallows the page"
    beh = "full" if n in FULL else "off" if n in OFF else "box"
    vals.append(f"({q(n)},{q(v['emoji'])},{q(v['words'])},{q(kind.get(n,'game' if 'capture' in f or 'track' in f else 'scene'))},{str(pb).lower()},{q(beh)})")
out.append(",\n".join(vals) + "\non conflict (effect) do nothing;")
open("supabase_v95_word_effects.sql", "w").write("\n".join(out) + "\n")
print(len(vals))
