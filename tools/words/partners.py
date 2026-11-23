# Helper Academy — word partners (collocations), v30. build_v30.py turns this into SQL.
# HUB: new words for the "Word Partners" set: unit|Headword|type|themes|emoji|syllables|meaning|example|Arabic
#   type: A verb, N noun (thing/place), P noun (person)
HUB_UNITS = ["Weather & nature", "School & thinking", "People & feelings", "Everyday verbs"]
HUB = """
1|Rain|N|na|🌧️|rain|Water that falls from clouds in drops.|The [rain] made the streets wet.|مطر
1|Wind|N|na|💨|wind|Air that moves outside.|The [wind] blew my hat away.|ريح
1|Storm|N|na|⛈️|storm|Very bad weather with strong wind, rain and often thunder.|A [storm] kept us inside all day.|عاصفة
1|Sun|N|na|☀️|sun|The bright star that gives the Earth light and heat.|The [sun] rises in the east.|شمس
1|Snow|N|na|❄️|snow|Soft white flakes of frozen water that fall from the sky.|We built a snowman in the [snow].|ثلج
1|Noise|N|lt|📢|noise|A sound, often loud or unpleasant.|The [noise] from the road woke me up.|ضجيج
2|Homework|N|wb|📒|home-work|School work you do at home.|I finish my [homework] before dinner.|واجب منزلي
2|Test|N|wb|📝|test|A set of questions to check what you know.|We have a spelling [test] on Monday.|اختبار
2|Question|N|st|❓|ques-tion|Something you ask to find out an answer.|May I ask a [question]?|سؤال
2|Answer|N|st|💬|an-swer|What you say or write back to a question.|Her [answer] was correct.|إجابة
2|Idea|N|st|💡|i-de-a|A thought or plan in your mind.|I have a great [idea] for our project!|فكرة
2|Decision|N|st|⚖️|de-ci-sion|A choice you make after thinking.|Choosing a pet was a big [decision].|قرار
2|Attention|N|st|👂|at-ten-tion|Careful listening, looking or thinking.|Please pay [attention] to the teacher.|انتباه
2|Effort|N|ch|🏋️|ef-fort|Hard work that you put into something.|She made a big [effort] to finish on time.|جهد
3|Friend|P|ga|🫶|friend|A person you like and who likes you.|My best [friend] lives next door.|صديق
3|Voice|N|lt|🗣️|voice|The sound you make when you speak or sing.|She has a beautiful singing [voice].|صوت
3|Sleep|N|he|🛌|sleep|The natural rest of body and mind at night.|Children need lots of [sleep].|نوم
3|Promise|N|ga|🤞|prom-ise|Words saying you will surely do something.|I always keep my [promise].|وعد
3|Mess|N|hb|🧦|mess|A dirty or untidy state.|My room is a [mess]!|فوضى
3|Trouble|N|dg|🚧|trou-ble|Problems or difficulty.|We had [trouble] finding the hotel.|مشكلة
3|Fun|N|fe|🎈|fun|Enjoyment; a good time.|We had so much [fun] at the park.|متعة
3|Laugh|A|fe|😂|laugh|To make sounds with your voice because something is funny.|The joke made us [laugh].|يضحك
4|Speak|A|st|🗨️|speak|To say words; to talk.|Please [speak] slowly.|يتكلّم
4|Run|A|mv|🏃‍♀️|run|To move very fast on your feet.|I [run] in the park every morning.|يركض
4|Do|A|ht|☑️|do|To carry out an action or a job.|I [do] my homework after school.|يفعل / يقوم بـ
4|Take|A|ht|🤲|take|To get something into your hands, or to use or need something.|[Take] an umbrella with you.|يأخذ
4|Have|A|ht|🫴|have|To own something, or to experience something.|We [have] lunch at noon.|يملك / يتناول
4|Break|A|dg|💔|break|To make something go into pieces, or to stop working.|Be careful not to [break] the glass.|يكسر
4|Pay|A|mw|💳|pay|To give money for something you buy.|We [pay] at the counter.|يدفع
4|Tell|A|st|📣|tell|To say something to someone.|[Tell] me a story, please.|يُخبِر / يحكي
4|Keep|A|ht|🔒|keep|To have something and not give it away, or to go on doing it.|[Keep] your room tidy.|يحتفظ / يُبقي
"""

# Partners: Headword: kind: phrase, phrase | kind: ... ; the partner word is in *stars*.
#   a adjectives (what kind?)  d adverbs (how?)  v verbs  n nouns  p little words (prepositions)
#   i idioms & phrasal verbs: exact headwords from the Idioms / Phrasal Verbs sets
PARTNERS = """
Rain: a: *heavy* rain, *light* rain, *pouring* rain | d: rain *heavily*, rain *lightly*, rain *relentlessly* | v: the rain *stops*, the rain *pours down*, *get caught in* the rain | n: a *drop* of rain, rain *cloud* | i: Raining cats and dogs
Wind: a: *strong* wind, *gentle* wind, *cold* wind | d: blow *hard*, blow *gently* | v: the wind *blows*, the wind *howls*, the wind *drops* | n: a *gust* of wind
Storm: a: *violent* storm, *heavy* storm | v: a storm *is coming*, a storm *passes*, *shelter from* the storm | n: the *eye* of the storm
Sun: a: *bright* sun, *hot* sun, *setting* sun, *rising* sun | v: the sun *rises*, the sun *sets*, the sun *shines* | d: shine *brightly*
Snow: a: *deep* snow, *fresh* snow, *heavy* snow | v: snow *falls*, snow *melts*, *play in* the snow | d: snow *heavily* | n: a snow*flake*
Noise: a: *loud* noise, *strange* noise, *deafening* noise | v: *make* a noise, *hear* a noise | i: Turn down
Homework: v: *do* your homework, *finish* your homework, *hand in* your homework | a: *easy* homework, *difficult* homework
Test: v: *take* a test, *pass* a test, *fail* a test, *study for* a test | a: *easy* test, *hard* test, *spelling* test | i: Hit the books, A piece of cake
Question: v: *ask* a question, *answer* a question | a: *easy* question, *tricky* question, *good* question
Answer: v: *give* an answer, *know* the answer, *find* the answer | a: *correct* answer, *wrong* answer, *short* answer | i: Work out
Idea: v: *have* an idea, *come up with* an idea, *share* an idea | a: *great* idea, *brilliant* idea, *clever* idea, *bad* idea
Decision: v: *make* a decision, *change* your decision | a: *big* decision, *difficult* decision, *wise* decision, *crucial* decision | i: The ball is in your court
Attention: v: *pay* attention, *get* attention, *crave* attention | a: *full* attention, *close* attention | i: All ears, Keep an eye on
Effort: v: *make* an effort, *put* effort *into* something | a: *big* effort, *great* effort, *real* effort | i: Practice makes perfect
Friend: a: *best* friend, *close* friend, *old* friend, *loyal* friend | v: *make* friends, *meet* a friend, *help* a friend | i: Get along with, Like two peas in a pod, Bury the hatchet
Voice: a: *loud* voice, *quiet* voice, *soft* voice, *booming* voice | v: *raise* your voice, *lower* your voice, *lose* your voice
Sleep: v: *go to* sleep, *get enough* sleep, *have* a good sleep | a: *deep* sleep, *good* sleep | d: sleep *soundly*, sleep *peacefully* | i: Wake up, Get up
Promise: v: *make* a promise, *keep* a promise, *break* a promise
Mess: v: *make* a mess, *clean up* the mess | a: *big* mess, *terrible* mess | i: Clean up, Sort out
Trouble: v: *get into* trouble, *have* trouble, *cause* trouble | a: *big* trouble, *serious* trouble | i: In hot water
Fun: v: *have* fun | a: *great* fun, *lots of* fun | i: Time flies
Laugh: d: laugh *loudly*, laugh *happily* | p: laugh *at* a joke, laugh *with* friends | i: Pull someone's leg
Speak: d: speak *clearly*, speak *slowly*, speak *softly*, speak *loudly* | p: speak *to* someone, speak *about* something | n: speak *the truth*, speak *English* | i: Bite your tongue
Run: d: run *fast*, run *quickly* | n: run *a race* | i: Run out of, Run into
Do: n: do *your homework*, do *the dishes*, do *your best*, do *exercise*, do *a favour* | d: do *well*
Make: n: make *a mistake*, make *a decision*, make *a noise*, make *a mess*, make *friends*, make *an effort*, make *a promise* | i: Make up
Take: n: take *a photo*, take *a test*, take *a break*, take *a bus*, take *turns* | i: Take off, Take after, Take out
Have: n: have *breakfast*, have *fun*, have *an idea*, have *a bath*, have *trouble*
Break: n: break *a promise*, break *a record*, break *the rules* | i: Break the ice, Break a leg, Break down
Pay: n: pay *attention*, pay *a bill* | p: pay *for* something | i: Cost an arm and a leg
Tell: n: tell *the truth*, tell *a story*, tell *a lie*, tell *a joke*, tell *the time* | i: Spill the beans, Let the cat out of the bag
Keep: n: keep *a promise*, keep *a secret* | a: keep *calm*, keep *quiet*, keep *safe* | i: Keep an eye on, Carry on
Catch: n: catch *a ball*, catch *a cold*, catch *a bus*, catch *a fish* | i: The early bird catches the worm
Mistake: v: *make* a mistake, *correct* a mistake, *learn from* your mistakes | a: *big* mistake, *silly* mistake, *careless* mistake
Error: v: *make* an error, *find* an error, *fix* an error | a: *spelling* error, *small* error
Rescue: n: rescue *a kitten*, rescue *people* | p: rescue *from* danger
Harvest: a: *good* harvest, *rich* harvest | n: harvest *crops*, harvest *time*
Purchase: v: *make* a purchase | n: purchase *tickets*
Estimate: a: *rough* estimate, *good* estimate | v: *make* an estimate
Impact: v: *have* an impact *on*, *make* an impact | a: *big* impact, *huge* impact, *positive* impact
Species: a: *endangered* species, *rare* species, *new* species
Aroma: a: *sweet* aroma, *rich* aroma | n: the aroma *of coffee*
Gust: n: a gust *of wind* | a: *strong* gust, *sudden* gust
Toss: n: toss *a coin*, toss *a ball*
Glance: a: a *quick* glance | v: *take* a glance | p: glance *at* something
Insisted: p: insisted *on*
Apologize: p: apologize *for* something, apologize *to* someone | d: apologize *sincerely*
Crave: n: crave *chocolate*, crave *attention*
Curiosity: a: *great* curiosity | p: *out of* curiosity
Empathy: v: *show* empathy, *feel* empathy | p: empathy *for* others
Silent: v: *fall* silent, *stay* silent, *keep* silent | d: *completely* silent
Obvious: d: *perfectly* obvious, *very* obvious | n: obvious *answer*, obvious *reason*
Hazardous: n: hazardous *waste*, hazardous *chemicals*
Crucial: n: crucial *role*, crucial *decision*
Relentlessly: v: *rain* relentlessly, *work* relentlessly
Deliberately: v: deliberately *ignore*, deliberately *break*
Consistently: v: *work* consistently, *practise* consistently
Assist: p: assist *with* something | n: assist *the teacher*
Connect: p: connect *to*, connect *with* | n: connect *the dots*
Create: n: create *a story*, create *art*, create *a plan*
Launch: n: launch *a rocket*, launch *a ship*
Commemorate: n: commemorate *a hero*, commemorate *an event*
Fortunate: d: *extremely* fortunate, *very* fortunate
Significant: n: significant *change*, significant *role*
Delighted: p: delighted *with*, delighted *to hear*
Frustrated: p: frustrated *with*, frustrated *by*
Nervous: p: nervous *about* | d: *a bit* nervous, *very* nervous | i: Butterflies in my stomach
Hungry: d: *very* hungry | i: Could eat a horse
Elegant: n: elegant *dress*, elegant *dancer*
Unique: d: *truly* unique | n: unique *chance*
"""

ADVERBS = "Relentlessly Deliberately Simultaneously Consistently Apparently Intentionally Constantly Always Seemingly Accidentally".split()

# Partner meters (v33): partners that are steps on one scale, from weak to strong.
#   Head|meter name (no colon)|kind|phrase:partner:rank, …   (new phrases are added; existing ones get the tag)
PARTNER_SCALES = """
Rain|Rain · light → pouring|adjective|light rain:light:1, steady rain:steady:3, heavy rain:heavy:4, pouring rain:pouring:5
Wind|Wind · gentle → howling|adjective|gentle wind:gentle:1, strong wind:strong:4, howling wind:howling:5
Storm|Storm · mild → violent|adjective|mild storm:mild:1, heavy storm:heavy:4, violent storm:violent:5
Snow|Snow · light → heavy|adjective|light snow:light:1, steady snow:steady:3, heavy snow:heavy:5
Sun|Sun · weak → blazing|adjective|weak sun:weak:1, bright sun:bright:3, hot sun:hot:4, blazing sun:blazing:5
Noise|Noise · faint → deafening|adjective|faint noise:faint:1, loud noise:loud:4, deafening noise:deafening:5
Voice|Voice · whispering → booming|adjective|whispering voice:whispering:0, soft voice:soft:1, quiet voice:quiet:2, loud voice:loud:4, booming voice:booming:5
Speak|Speak · whisper → shout|adverb|speak in a whisper:in a whisper:0, speak softly:softly:1, speak loudly:loudly:4, speak at the top of your voice:at the top of your voice:5
Laugh|Laugh · quietly → loudly|adverb|laugh quietly:quietly:1, laugh happily:happily:3, laugh loudly:loudly:4
Mistake|Mistake · tiny → terrible|adjective|tiny mistake:tiny:0, silly mistake:silly:1, careless mistake:careless:2, big mistake:big:4, terrible mistake:terrible:5
Trouble|Trouble · a little → serious|adjective|a little trouble:a little:1, big trouble:big:4, serious trouble:serious:5
Effort|Effort · small → great|adjective|small effort:small:1, real effort:real:3, big effort:big:4, great effort:great:5
Idea|Idea · bad ⇄ brilliant|adjective|bad idea:bad:-3, good idea:good:2, clever idea:clever:4, great idea:great:4, brilliant idea:brilliant:5
Fun|Fun · a little → great|adjective|a little fun:a little:1, lots of fun:lots of:4, great fun:great:5
Impact|Impact · small → huge|adjective|small impact:small:1, big impact:big:3, huge impact:huge:5
Nervous|Nervous · a bit → very|adverb|a bit nervous:a bit:1, very nervous:very:4
Fortunate|Fortunate · very → extremely|adverb|very fortunate:very:3, extremely fortunate:extremely:5
Obvious|Obvious · very → perfectly|adverb|very obvious:very:3, perfectly obvious:perfectly:5
Rain|Rain · light → pouring|adverb|rain lightly:lightly:1, rain steadily:steadily:3, rain heavily:heavily:4, rain really hard:really hard:5
Rain|Rain · light → pouring|noun|a drop of rain:drop:0, a drizzle:drizzle:1, a shower:shower:3, a downpour:downpour:5
Rain|Rain · how long: short → all day|adverb|rain briefly:briefly:1, rain on and off:on and off:2, rain all day:all day:4, rain relentlessly:relentlessly:5
Wind|Wind · gentle → howling|noun|a breath of wind:breath:0, a breeze:breeze:1, a gust of wind:gust:3, a gale:gale:5
Snow|Snow · light → heavy|noun|a snowflake:flake:0, a flurry:flurry:1, a snowfall:snowfall:3, a blizzard:blizzard:5
Noise|Noise · faint → deafening|noun|a murmur:murmur:1, a racket:racket:4, an uproar:uproar:5
Rain|Rain · light → pouring|idiom|Raining cats and dogs:Raining cats and dogs:5
Wind|Wind · gentle → howling|adverb|blow gently:gently:1, blow hard:hard:4
Snow|Snow · light → heavy|adverb|snow lightly:lightly:1, snow heavily:heavily:5
Sleep|Sleep · light → deep|adjective|light sleep:light:1, good sleep:good:3, deep sleep:deep:5
Sleep|Sleep · light → deep|adverb|sleep lightly:lightly:1, sleep peacefully:peacefully:3, sleep soundly:soundly:5
Trouble|Trouble · a little → serious|idiom|In hot water:In hot water:4
Test|Test · easy → hard|adjective|easy test:easy:0, hard test:hard:4
Test|Test · easy → hard|idiom|A piece of cake:A piece of cake:0
Homework|Homework · easy → difficult|adjective|easy homework:easy:0, difficult homework:difficult:4
Question|Question · easy → tricky|adjective|easy question:easy:0, good question:good:2, tricky question:tricky:4
Decision|Decision · small → crucial|adjective|small decision:small:1, big decision:big:3, difficult decision:difficult:4, crucial decision:crucial:5
Attention|Attention · close → full|adjective|close attention:close:3, full attention:full:5
Attention|Attention · close → full|idiom|Keep an eye on:Keep an eye on:3, All ears:All ears:5
"""
