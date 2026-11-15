import json, subprocess, re, os
# Builds the 'Across the Blue Sea' video: song cover + each word's clip while it is sung (crossfades),
# word titles shown whole first then split into coloured syllables, burned-in karaoke lyrics (ASS/libass),
# finale 3x3 grid, and the clips' real sounds mixed in with the song gently ducked. Free: ffmpeg only.
W=1024; FPS=30; D=0.5   # crossfade seconds
SRC='/home/claude/songs/across-the-blue-sea.mp4'
CL='/mnt/user-data/uploads/Reem/Website/assets/videos/{}.raw.mp4'
OUT='/home/claude/songs/ab'
lines=json.load(open('/home/claude/songs/across-aligned.json'))   # line times measured from the singing (Whisper), not the file's estimates
TOTAL=177.93
# (start, end, kind, word)
S=[(0,17.9,'cover',None),(17.9,32.4,'clip','rustled'),(32.4,44.8,'clip','sigh'),(44.8,59.9,'clip','swayed'),(59.9,74.4,'clip','precarious'),
   (74.4,86.8,'clip','faraway'),(86.8,98.5,'clip','observed'),(98.5,119.8,'cover',None),(119.8,131.1,'clip','separated'),(131.1,147.3,'clip','symbolized'),(147.3,TOTAL,'grid',None)]
SYL={'rustled':['Rus','tled'],'sigh':['Sigh'],'swayed':['Swayed'],'precarious':['Pre','car','i','ous'],'faraway':['Far','a','way'],
     'observed':['Ob','served'],'separated':['Sep','a','rat','ed'],'symbolized':['Sym','bol','ized']}
OFFSET={'sigh':1.95}   # the visible breath (2.6 s into the clip) lands on the sung sigh at 0:33.05
TITLE_Y={'faraway':360}   # move the title down when the top of the clip matters (the sailboat)
ORDER=['rustled','sigh','swayed','precarious','faraway','observed','separated','symbolized']
def run(cmd): subprocess.run(cmd,check=True)
enc=['-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','-r',str(FPS)]
segs=[]
cover=f'{OUT}/cover.png'
run(['ffmpeg','-v','error','-y','-ss','2','-i',SRC,'-frames:v','1',cover])
for k,(s,e,kind,w) in enumerate(S):
    L=(e-s)+(D if k<len(S)-1 else 0)
    f=f'{OUT}/seg/{k:02d}.mp4'
    if os.path.exists(f): segs.append((f,L)); continue
    if kind=='cover':
        run(['ffmpeg','-v','error','-y','-loop','1','-i',cover,'-t',f'{L:.3f}','-vf',f'scale={W}:{W},setsar=1',*enc,f])
    elif kind=='clip':
        run(['ffmpeg','-v','error','-y','-stream_loop','-1','-ss',str(OFFSET.get(w,0)),'-i',CL.format(w),'-t',f'{L:.3f}','-an','-vf',f'scale={W}:{W}:flags=lanczos,setsar=1',*enc,f])
    else:   # 3x3 grid: 8 clips around the cover
        c=341; ins=[]; fl=[]
        tiles=ORDER[:4]+['__cover']+ORDER[4:]
        for j,t in enumerate(tiles):
            if t=='__cover': ins+=['-loop','1','-t',f'{L:.3f}','-i',cover]
            else: ins+=['-stream_loop','-1','-t',f'{L:.3f}','-i',CL.format(t)]
            fl.append(f'[{j}:v]scale={c-6}:{c-6}:flags=lanczos,setsar=1,pad={c}:{c}:3:3:color=0xF4EBDD[t{j}]')
        layout='|'.join(f'{(j%3)*c}_{(j//3)*c}' for j in range(9))
        fl.append(''.join(f'[t{j}]' for j in range(9))+f'xstack=inputs=9:layout={layout}:fill=0xF4EBDD,pad={W}:{W}:0:0:color=0xF4EBDD[v]')
        run(['ffmpeg','-v','error','-y',*ins,'-filter_complex',';'.join(fl),'-map','[v]','-an','-t',f'{L:.3f}',*enc,f])
    segs.append((f,L)); print('segment',k,kind,w,round(L,2))
# ---------- subtitles (ASS) ----------
def ts(t): t=max(0,t); return f"{int(t//3600)}:{int(t%3600//60):02d}:{t%60:05.2f}"
COLS=['&H00C54723&','&H000C41C2&','&H006E760F&','&H00ED3A7C&']   # blue, orange, teal, purple (BGR)
YEL='&H004DC9FF&'
vocab='|'.join(sorted([re.escape(w) for w in ['Rustled','Sigh','Swayed','Precarious','Faraway','Observed','Separated','Symbolized']]+
    ['Rus-tled','Pre-car-i-ous','Far-a-way','Ob-served','Sep-a-rat-ed','Sym-bol-ized'],key=len,reverse=True))
VR=re.compile(r'(?<![A-Za-z])('+vocab+r')(?![A-Za-z])',re.I)
def lyr(t):
    t=t.replace('*','').replace('{','(').replace('}',')')
    return VR.sub(lambda m:'{\\c'+YEL+'}'+m.group(1)+'{\\c&H00FFFFFF&}',t)
ass=['[Script Info]','ScriptType: v4.00+',f'PlayResX: {W}',f'PlayResY: {W}','WrapStyle: 0','ScaledBorderAndShadow: yes','',
 '[V4+ Styles]','Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding',
 'Style: Lyric,Fredoka SemiBold,46,&H00FFFFFF,&H00FFFFFF,&H40331B1B,&H80331B1B,0,0,0,0,100,100,0,0,3,14,0,2,60,60,46,1',
 'Style: Word,Fredoka,104,&H00FFFFFF,&H00FFFFFF,&H00FFFFFF,&H60000000,1,0,0,0,100,100,1,0,1,8,4,8,40,40,34,1',
 'Style: Beats,Fredoka SemiBold,38,&H00FFFFFF,&H00FFFFFF,&H40331B1B,&H80331B1B,0,0,0,0,100,100,1,0,3,10,0,8,40,40,168,1',
 'Style: Label,Fredoka SemiBold,30,&H00FFFFFF,&H00FFFFFF,&H40331B1B,&H80331B1B,0,0,0,0,100,100,0,0,3,7,0,2,0,0,0,1','',
 '[Events]','Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text']
for i,x in enumerate(lines):
    st=x['t']; en=lines[i+1]['t'] if i+1<len(lines) else TOTAL
    if not x['l'].strip(): continue
    ass.append(f"Dialogue: 2,{ts(st)},{ts(en-0.05)},Lyric,,0,0,0,,{{\\fad(120,80)}}{lyr(x['l'])}")
for (s,e,kind,w) in S:
    if kind!='clip': continue
    parts=SYL[w]; n=len(parts)
    # 1) the whole word in one colour  2) at SPLIT ms the gaps grow open, each syllable takes its colour and bounces
    NAVY='&H00331B1B&'; SPLIT=1600; DUR=700
    bounce=f"\\t({SPLIT},{SPLIT+DUR//2},\\fscx112\\fscy112)\\t({SPLIT+DUR//2},{SPLIT+DUR},\\fscx100\\fscy100)"
    segs_=[]
    for j,p in enumerate(parts):
        segs_.append(f"{{\\alpha&H00&\\fscx100\\fscy100\\c{NAVY}\\t({SPLIT},{SPLIT+DUR},\\c{COLS[j%4]}){bounce}}}{p}")
        if j<n-1:   # separator starts squeezed to zero width and invisible, then opens up
            segs_.append(f"{{\\c{NAVY}\\fscx0\\alpha&HFF&\\t({SPLIT},{SPLIT+DUR},\\fscx100\\alpha&H00&)}} · ")
    title=''.join(segs_)
    beats=f"{n} beat{'s' if n>1 else ''}  ·  "+'-'.join(w.upper())
    y=TITLE_Y.get(w); p1=f"\\an8\\pos({W//2},{y})" if y else ""; p2=f"\\an8\\pos({W//2},{y+134})" if y else ""
    ass.append(f"Dialogue: 3,{ts(s+0.3)},{ts(e-0.2)},Word,,0,0,0,,{{\\fad(300,200){p1}}}{title}")
    ass.append(f"Dialogue: 3,{ts(s+0.3+(SPLIT+DUR)/1000)},{ts(e-0.2)},Beats,,0,0,0,,{{\\fad(300,200){p2}}}{beats}")
# finale grid labels
gs=S[-1][0]; c=341
tiles=ORDER[:4]+[None]+ORDER[4:]
for j,t in enumerate(tiles):
    if not t: continue
    x=(j%3)*c+c//2; y=(j//3)*c+c-14
    ass.append(f"Dialogue: 1,{ts(gs+0.4+j*0.25)},{ts(TOTAL)},Label,,0,0,0,,{{\\an2\\pos({x},{y})\\fad(250,0)}}{''.join(SYL[t]) if len(SYL[t])==1 else '·'.join(SYL[t])}")
open(f'{OUT}/lyrics.ass','w').write('\n'.join(ass)+'\n')
import sys
if os.environ.get('ASS_ONLY'): sys.exit()
# ---------- join with crossfades, burn subtitles, add the song ----------
ins=[]; 
for f,L in segs: ins+=['-i',f]
fl=[]; prev='[0:v]'; off=0
for k in range(1,len(segs)):
    off+=segs[k-1][1]-D
    lab=f'[x{k}]'; fl.append(f'{prev}[{k}:v]xfade=transition=fade:duration={D}:offset={off:.3f}{lab}'); prev=lab
fl.append(f"{prev}ass={OUT}/lyrics.ass:fontsdir=/root/.fonts,format=yuv420p[v]")
N=len(segs)
# (song start, song end, level) — the song dips to this level while the real sound plays; 0.35 s ramps
DUCKS=[(20.4,23.6,0.62),(32.75,34.25,0.30)]   # sung 'Swish! Swish!' 20.6-23.6 s; sung 'Hhh... phew!' 33.0-34.2 s
g='*'.join(f"(1-{1-l}*clip((t-{a})/0.35,0,1)*clip(({b}-t)/0.35,0,1))" for a,b,l in DUCKS)
fl.append(f"[{N}:a]volume=eval=frame:volume='{g}'[song]")
fl.append(f"[{N+1}:a]atrim=0:5.0,asetpts=PTS-STARTPTS,aresample=48000,dynaudnorm=f=150:g=15,volume=1.25,afade=t=in:d=0.3,afade=t=out:st=3.6:d=0.6,atrim=0:4.2,adelay=20200|20200[rus]")
fl.append(f"[{N+2}:a]atrim=2.3:3.75,asetpts=PTS-STARTPTS,aresample=48000,dynaudnorm=f=75:g=9,volume=2.2,afade=t=out:st=1.0:d=0.45,adelay=32750|32750[sig]")
fl.append("[song]aresample=48000[s48];[s48][rus][sig]amix=inputs=3:normalize=0:duration=first,alimiter=limit=0.95[a]")
run(['ffmpeg','-v','error','-y',*ins,'-i',SRC,'-i',CL.format('rustled'),'-i',CL.format('sigh'),'-filter_complex',';'.join(fl),'-map','[v]','-map','[a]',
     '-c:v','libx264','-preset','slow','-crf','28','-tune','animation','-r',str(FPS),'-pix_fmt','yuv420p','-c:a','aac','-b:a','160k','-movflags','+faststart','-shortest',f'{OUT}/across-the-blue-sea-words.mp4'])
print('done')
