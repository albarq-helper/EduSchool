# Match timed words from Whisper (one JSON per 20 s window, 15 s apart) to lyric lines.
# usage: python3 align_lyrics.py whisper_windows.json lines.json out.json
import json,re,difflib,sys
W=json.load(open(sys.argv[1])); lines=json.load(open(sys.argv[2])); STEP=15; WIN=20
words=[]
for s,r in W.items():
    s=int(s)
    for c in r.get('chunks',[]):
        a,b=c['timestamp']; a=(a or 0)+s; b=(b or a-s)+s
        mid=(a+b)/2
        # keep a word only from the window where it sits in the trusted middle part
        lo=s+(0 if s==0 else 2.5); hi=s+(WIN if s>=max(int(x) for x in W) else STEP+2.5)
        if lo<=mid<hi: words.append((a,b,c['text']))
words.sort()
norm=lambda t:re.sub(r"[^a-z]","",t.lower())
rw=[(a,norm(t)) for a,b,t in words if norm(t)]
lw=[];owner=[]
for i,x in enumerate(lines):
    for t in re.split(r"[\s\-…\.]+",x['l']):
        n=norm(t)
        if n: lw.append(n); owner.append(i)
sm=difflib.SequenceMatcher(a=lw,b=[w for _,w in rw],autojunk=False)
first={}
for blk in sm.get_matching_blocks():
    for k in range(blk.size):
        li=owner[blk.a+k]; t=rw[blk.b+k][0]
        if li not in first: first[li]=t
# fuzzy pass for lines with no exact match: nearest similar word after previous line
out=[]
prev=0
for i,x in enumerate(lines):
    t=first.get(i)
    if t is None or t<prev: t=None
    out.append(t); prev=t if t is not None else prev
# fill gaps by interpolation between known neighbours
known=[i for i,t in enumerate(out) if t is not None]
for i,t in enumerate(out):
    if t is None:
        L=max([k for k in known if k<i],default=None); R=min([k for k in known if k>i],default=None)
        if L is not None and R is not None: out[i]=out[L]+(out[R]-out[L])*(i-L)/(R-L)
        elif L is not None: out[i]=out[L]+3*(i-L)
        else: out[i]=max(0,out[R]-3*(R-i))
res=[]
for i,x in enumerate(lines):
    st=round(max(0,out[i]-0.15),2); en=round(out[i+1]-0.15,2) if i+1<len(lines) else 177.9
    res.append({'t':st,'e':en,'l':x['l'],'matched':i in first})
json.dump(res,open(sys.argv[3],'w'),ensure_ascii=False,indent=0)
for o,x in zip(res,lines): print(f"{x['t']:6.1f} -> {o['t']:6.1f} {'✓' if o['matched'] else '~'} {x['l'][:55]}")
