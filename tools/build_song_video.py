#!/usr/bin/env python3
"""
Build a "video edition" of a song: the word clips cut to the singing, lyrics on screen,
each new word shown whole first and then split into coloured syllables. No new AI video is generated.

  python3 build2.py config.json            # render
  ASS_ONLY=1 python3 build2.py config.json # only write the subtitles (fast preview)

Config keys:
  src, out, lines (aligned lyric JSON [{t,e,l}]), workdir
  sections: [[start, end, kind, word, clip_offset?], ...]
      kind = cover | clip (word shown whole, then split) | recap (word already split, short cut) | grid
  effects:  [{"word":"rustled","at":20.2,"trim":[0,5],"len":4.2,"gain":1.25}, ...]   real sounds from a clip
  ducks:    [[from, to, level], ...]   the song dips while a real sound plays
"""
import json, subprocess, re, os, sys
C = json.load(open(sys.argv[1]))
W = 1024; FPS = 30; D = 0.5
SRC = C['src']; OUT = C['workdir']; os.makedirs(f'{OUT}/seg', exist_ok=True)
CL = C.get('clips', '/mnt/user-data/uploads/Reem/Website/assets/videos/{}.raw.mp4')
lines = json.load(open(C['lines']))
TOTAL = float(subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'a:0', '-show_entries', 'stream=duration', '-of', 'csv=p=0', SRC],
                             capture_output=True, text=True).stdout.strip())
S = [tuple(x) for x in C['sections']]
if S[-1][1] in (None, 'end'): S[-1] = (S[-1][0], TOTAL) + tuple(S[-1][2:])
SYL = {'rustled': ['Rus', 'tled'], 'sigh': ['Sigh'], 'swayed': ['Swayed'], 'precarious': ['Pre', 'car', 'i', 'ous'], 'faraway': ['Far', 'a', 'way'],
       'observed': ['Ob', 'served'], 'separated': ['Sep', 'a', 'rat', 'ed'], 'symbolized': ['Sym', 'bol', 'ized']}
TITLE_Y = {'faraway': 360}          # keep the sailboat visible
ORDER = ['rustled', 'sigh', 'swayed', 'precarious', 'faraway', 'observed', 'separated', 'symbolized']
def run(cmd): subprocess.run(cmd, check=True)
enc = ['-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', str(FPS)]
cover = f'{OUT}/cover.png'
if not os.path.exists(cover): run(['ffmpeg', '-v', 'error', '-y', '-ss', '2', '-i', SRC, '-frames:v', '1', '-vf', f'scale={W}:{W}', cover])
segs = []
for k, sec in enumerate(S):
    s, e, kind, w = sec[:4]; off = sec[4] if len(sec) > 4 else 0
    L = (e - s) + (D if k < len(S) - 1 else 0)
    f = f'{OUT}/seg/{k:02d}.mp4'
    if os.environ.get('ASS_ONLY') or os.path.exists(f): segs.append((f, L)); continue
    if kind == 'cover':
        run(['ffmpeg', '-v', 'error', '-y', '-loop', '1', '-i', cover, '-t', f'{L:.3f}', '-vf', f'scale={W}:{W},setsar=1', *enc, f])
    elif kind in ('clip', 'recap'):
        run(['ffmpeg', '-v', 'error', '-y', '-stream_loop', '-1', '-ss', str(off), '-i', CL.format(w), '-t', f'{L:.3f}', '-an',
             '-vf', f'scale={W}:{W}:flags=lanczos,setsar=1', *enc, f])
    else:   # 3x3 grid: the 8 clips around the cover
        c = 341; ins = []; fl = []
        tiles = ORDER[:4] + ['__cover'] + ORDER[4:]
        for j, t in enumerate(tiles):
            if t == '__cover': ins += ['-loop', '1', '-t', f'{L:.3f}', '-i', cover]
            else: ins += ['-stream_loop', '-1', '-t', f'{L:.3f}', '-i', CL.format(t)]
            fl.append(f'[{j}:v]scale={c-6}:{c-6}:flags=lanczos,setsar=1,pad={c}:{c}:3:3:color=0xF4EBDD[t{j}]')
        layout = '|'.join(f'{(j%3)*c}_{(j//3)*c}' for j in range(9))
        fl.append(''.join(f'[t{j}]' for j in range(9)) + f'xstack=inputs=9:layout={layout}:fill=0xF4EBDD,pad={W}:{W}:0:0:color=0xF4EBDD[v]')
        run(['ffmpeg', '-v', 'error', '-y', *ins, '-filter_complex', ';'.join(fl), '-map', '[v]', '-an', '-t', f'{L:.3f}', *enc, f])
    segs.append((f, L)); print('segment', k, kind, w, round(L, 2), flush=True)

# ---------- subtitles (ASS) ----------
def ts(t): t = max(0, t); return f"{int(t//3600)}:{int(t%3600//60):02d}:{t%60:05.2f}"
COLS = ['&H00C54723&', '&H000C41C2&', '&H006E760F&', '&H00ED3A7C&']   # blue, orange, teal, purple (BGR)
YEL = '&H004DC9FF&'; NAVY = '&H00331B1B&'
vocab = '|'.join(sorted([re.escape(w) for w in ['Rustled', 'Sigh', 'Swayed', 'Precarious', 'Faraway', 'Observed', 'Separated', 'Symbolized']] +
                        ['Rus-tled', 'Pre-car-i-ous', 'Far-a-way', 'Ob-served', 'Sep-a-rat-ed', 'Sym-bol-ized'], key=len, reverse=True))
VR = re.compile(r'(?<![A-Za-z])(' + vocab + r')(?![A-Za-z])', re.I)
def lyr(t):
    t = t.replace('*', '').replace('{', '(').replace('}', ')')
    return VR.sub(lambda m: '{\\c' + YEL + '}' + m.group(1) + '{\\c&H00FFFFFF&}', t)
ass = ['[Script Info]', 'ScriptType: v4.00+', f'PlayResX: {W}', f'PlayResY: {W}', 'WrapStyle: 0', 'ScaledBorderAndShadow: yes', '',
       '[V4+ Styles]', 'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding',
       'Style: Lyric,Fredoka SemiBold,46,&H00FFFFFF,&H00FFFFFF,&H40331B1B,&H80331B1B,0,0,0,0,100,100,0,0,3,14,0,2,60,60,46,1',
       'Style: Word,Fredoka,104,&H00FFFFFF,&H00FFFFFF,&H00FFFFFF,&H60000000,1,0,0,0,100,100,1,0,1,8,4,8,40,40,34,1',
       'Style: Beats,Fredoka SemiBold,38,&H00FFFFFF,&H00FFFFFF,&H40331B1B,&H80331B1B,0,0,0,0,100,100,1,0,3,10,0,8,40,40,168,1',
       'Style: Label,Fredoka SemiBold,30,&H00FFFFFF,&H00FFFFFF,&H40331B1B,&H80331B1B,0,0,0,0,100,100,0,0,3,7,0,2,0,0,0,1', '',
       '[Events]', 'Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text']
for i, x in enumerate(lines):
    st = x['t']; en = min(lines[i+1]['t'] if i + 1 < len(lines) else TOTAL, TOTAL)
    if not x['l'].strip(): continue
    in_grid = any(sec[2] == 'grid' and sec[0] - 0.3 <= st < sec[1] for sec in S)
    pos = f"\\an5\\pos({W//2},{W//2})" if in_grid else ""   # over the centre tile, clear of the labels
    ass.append(f"Dialogue: 2,{ts(st)},{ts(en-0.05)},Lyric,,0,0,0,,{{\\fad(120,80){pos}}}{lyr(x['l'])}")
SPLIT = 1600; DUR = 700
for sec in S:
    s, e, kind, w = sec[:4]
    if kind not in ('clip', 'recap'): continue
    parts = SYL[w]; n = len(parts)
    y = TITLE_Y.get(w); p1 = f"\\an8\\pos({W//2},{y})" if y else ""; p2 = f"\\an8\\pos({W//2},{y+134})" if y else ""
    if kind == 'recap':   # already learned: show it split and coloured straight away
        title = f"{{\\c{NAVY}}} · ".join(f"{{\\c{COLS[j%4]}}}{p}" for j, p in enumerate(parts))
        ass.append(f"Dialogue: 3,{ts(s+0.15)},{ts(e-0.1)},Word,,0,0,0,,{{\\fad(150,120){p1}}}{title}")
        continue
    bounce = f"\\t({SPLIT},{SPLIT+DUR//2},\\fscx112\\fscy112)\\t({SPLIT+DUR//2},{SPLIT+DUR},\\fscx100\\fscy100)"
    out = []
    for j, p in enumerate(parts):
        out.append(f"{{\\alpha&H00&\\fscx100\\fscy100\\c{NAVY}\\t({SPLIT},{SPLIT+DUR},\\c{COLS[j%4]}){bounce}}}{p}")
        if j < n - 1:
            out.append(f"{{\\c{NAVY}\\fscx0\\alpha&HFF&\\t({SPLIT},{SPLIT+DUR},\\fscx100\\alpha&H00&)}} · ")
    beats = f"{n} beat{'s' if n > 1 else ''}  ·  " + '-'.join(w.upper())
    ass.append(f"Dialogue: 3,{ts(s+0.3)},{ts(e-0.2)},Word,,0,0,0,,{{\\fad(300,200){p1}}}{''.join(out)}")
    ass.append(f"Dialogue: 3,{ts(s+0.3+(SPLIT+DUR)/1000)},{ts(e-0.2)},Beats,,0,0,0,,{{\\fad(300,200){p2}}}{beats}")
for sec in S:   # finale grid labels
    if sec[2] != 'grid': continue
    gs = sec[0]; c = 341
    for j, t in enumerate(ORDER[:4] + [None] + ORDER[4:]):
        if not t: continue
        x = (j % 3) * c + c // 2; y = (j // 3) * c + c - 14
        ass.append(f"Dialogue: 1,{ts(gs+0.4+j*0.25)},{ts(sec[1])},Label,,0,0,0,,{{\\an2\\pos({x},{y})\\fad(250,0)}}{'·'.join(SYL[t])}")
open(f'{OUT}/lyrics.ass', 'w').write('\n'.join(ass) + '\n')
if os.environ.get('ASS_ONLY'): sys.exit()

# ---------- join with crossfades, burn subtitles, mix in real sounds ----------
ins = []
for f, L in segs: ins += ['-i', f]
fl = []; prev = '[0:v]'; off = 0
for k in range(1, len(segs)):
    off += segs[k-1][1] - D
    lab = f'[x{k}]'; fl.append(f'{prev}[{k}:v]xfade=transition=fade:duration={D}:offset={off:.3f}{lab}'); prev = lab
fl.append(f"{prev}ass={OUT}/lyrics.ass:fontsdir=/root/.fonts,format=yuv420p[v]")
N = len(segs)
DUCKS = C.get('ducks', [])
g = '*'.join(f"(1-{1-l}*clip((t-{a})/0.35,0,1)*clip(({b}-t)/0.35,0,1))" for a, b, l in DUCKS) or '1'
fl.append(f"[{N}:a]volume=eval=frame:volume='{g}',aresample=48000[song]")
extra = []; mix = ['[song]']
for j, fx in enumerate(C.get('effects', [])):
    extra += ['-i', CL.format(fx['word'])]
    a, b = fx['trim']; ms = int(fx['at'] * 1000); ln = fx['len']
    norm = fx.get('norm', 'dynaudnorm=f=150:g=15')
    fl.append(f"[{N+1+j}:a]atrim={a}:{b},asetpts=PTS-STARTPTS,aresample=48000,{norm},volume={fx['gain']},afade=t=in:d=0.05,"
              f"afade=t=out:st={ln-0.45:.2f}:d=0.45,atrim=0:{ln},adelay={ms}|{ms}[fx{j}]")
    mix.append(f'[fx{j}]')
fl.append(f"{''.join(mix)}amix=inputs={len(mix)}:normalize=0:duration=first,alimiter=limit=0.95[a]")
run(['ffmpeg', '-v', 'error', '-y', *ins, '-i', SRC, *extra, '-filter_complex', ';'.join(fl), '-map', '[v]', '-map', '[a]',
     '-c:v', 'libx264', '-preset', 'slow', '-crf', '28', '-tune', 'animation', '-r', str(FPS), '-pix_fmt', 'yuv420p',
     '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', '-shortest', C['out']])
print('done', C['out'])
