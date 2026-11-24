# v55: word families — a verb's other shapes: 📦 thing (noun), 🧑 person (noun for who does it), 🎨 describing (adjective)
# "~" after a thing = no plural (uncountable)
FAM = """
achieve|T:achievement|P:achiever|D:achievable
admire|T:admiration~|P:admirer|D:admirable
adore|T:adoration~|D:adorable
annoy|T:annoyance|D:annoying,annoyed
apologize|T:apology
appreciate|T:appreciation~|D:appreciative
approve|T:approval~
argue|T:argument|D:argumentative
assist|T:assistance~|P:assistant
award|T:award
believe|T:belief|P:believer|D:believable
betray|T:betrayal
blame|T:blame~|D:blameless
break|T:break|D:broken,breakable
build|T:building|P:builder
buy|P:buyer
care|T:care~|P:carer|D:careful,careless,caring
catch|T:catch|P:catcher
cherish|D:cherished
clash|T:clash
commemorate|T:commemoration
complain|T:complaint
connect|T:connection|D:connected
consider|T:consideration|D:considerate
crave|T:craving
create|T:creation|P:creator|D:creative
decompose|T:decomposition~
demand|T:demand|D:demanding
desire|T:desire|D:desirable
despise|D:despicable
destroy|T:destruction~|D:destructive
deteriorate|T:deterioration~
detest|D:detestable
dislike|T:dislike
divide|T:division
doze|T:doze
dwell|T:dwelling|P:dweller
estimate|T:estimate
fail|T:failure
fake|T:fake|D:fake
flow|T:flow
forbid|D:forbidden
forgive|T:forgiveness~|D:forgiving
glance|T:glance
guess|T:guess
hate|T:hatred~|D:hateful
help|T:help~|P:helper|D:helpful,helpless
hit|T:hit
honour|T:honour|D:honourable
improve|T:improvement
insist|T:insistence~|D:insistent
insult|T:insult|D:insulting
irritate|T:irritation|D:irritating,irritated
keep|P:keeper
laugh|T:laughter~,laugh
launch|T:launch
learn|T:learning~|P:learner
lie (tell a lie)|T:lie|P:liar
like|T:liking|D:likeable
link|T:link
loathe|D:loathsome
look|T:look
love|T:love~|D:lovely,lovable,loving
make|P:maker
march|T:march
move|T:movement,move
nap|T:nap
nickname|T:nickname
observe|T:observation|P:observer|D:observant
pay|T:payment
peep|T:peep
permit|T:permission~
persevere|T:perseverance~
pretend|T:pretence
print|T:print|P:printer
procrastinate|T:procrastination~|P:procrastinator
publish|T:publication|P:publisher
purchase|T:purchase
quit|P:quitter
ratify|T:ratification
regard|T:regard
relocate|T:relocation
represent|T:representation|P:representative
rescue|T:rescue|P:rescuer
resent|T:resentment|D:resentful
reside|T:residence|P:resident
respect|T:respect~|D:respectful,respectable
retreat|T:retreat
rot|T:rot~|D:rotten
run|T:run|P:runner
rustle|T:rustle
sell|T:sale|P:seller
separate|T:separation|D:separate
speak|T:speech|P:speaker
stare|T:stare
succeed|T:success|D:successful
symbolize|T:symbol|D:symbolic
throw|T:throw|P:thrower
torment|T:torment
torture|T:torture
toss|T:toss
walk|T:walk|P:walker
waste|T:waste~|D:wasteful
whip|T:whip
withdraw|T:withdrawal
break down|T:breakdown
come back|T:comeback
let down|T:letdown
make up|T:make-up~
take off|T:takeoff
work out|T:workout
show off|P:show-off
hand out|T:handout
clean up|T:clean-up
grow up|P:grown-up
slow down|T:slowdown
throw away|D:throwaway
"""
K = {"T": "thing", "P": "person", "D": "describing"}
rows = []
for line in FAM.strip().splitlines():
    base, *parts = line.split("|")
    n = 0
    for p in parts:
        k, forms = p.split(":")
        for f in forms.split(","):
            n += 1
            rows.append((base, f.rstrip("~"), K[k], not f.endswith("~"), n))
q = lambda s: "'" + s.replace("'", "''") + "'"
vals = ",\n".join(f"({q(b)},{q(f)},{q(k)},{'true' if c else 'false'},{n})" for b, f, k, c, n in rows)
sql = f"""-- =====================================================================
-- Helper Academy — v55: word families for verbs (achieve → achievement · achiever · achievable)
--   public.word_forms: base (the verb, lower case; "lie (tell a lie)" for one sense) → form, kind (thing / person / describing), countable
--   Read by everyone; the Verb time line uses it to let a child change the word's shape ("your achievement", "you were successful").
-- =====================================================================
create table if not exists public.word_forms (
  base text not null, form text not null, kind text not null check (kind in ('thing','person','describing')),
  countable boolean not null default true, position int not null default 0, primary key (base, form, kind));
alter table public.word_forms enable row level security;
drop policy if exists "anyone reads word forms" on public.word_forms;
create policy "anyone reads word forms" on public.word_forms for select to anon, authenticated using (true);
grant select on public.word_forms to anon, authenticated;
insert into public.word_forms (base, form, kind, countable, position) values
{vals}
on conflict (base, form, kind) do update set countable = excluded.countable, position = excluded.position;
select count(*) as forms, count(distinct base) as verbs from public.word_forms;
"""
open("supabase_v55_word_forms.sql", "w").write(sql)
print(len(rows), len({r[0] for r in rows}))
