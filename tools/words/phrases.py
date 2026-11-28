# Helper Academy — Phrasal Verbs and Idioms (v29). build_v29.py turns this into SQL.
# Phrasal verbs: unit|Phrase|emoji|meaning|example ([phrase] in brackets)|Arabic meaning|tags (";"-separated, short theme codes as in families.py)
PV_UNITS = ["Up", "Down", "Out", "On & off", "In, away & back", "After, for & with"]
PV = """
1|Wake up|⏰|To stop sleeping.|I [wake up] at seven every morning.|يستيقظ|he;⇄ Asleep vs. awake: awake
1|Get up|🛏️|To get out of bed.|We [get up] early on school days.|ينهض من السرير|he
1|Give up|🏳️|To stop trying.|Don't [give up]; you can do it!|يستسلم|ch;⇄ Give up vs. keep going: give up
1|Pick up|🤏|To lift something with your hand.|Please [pick up] your toys.|يلتقط / يرفع|mv;⇄ Pick up vs. put down: pick up
1|Look up|📖|To find a word or fact in a book or online.|I [look up] new words in the dictionary.|يبحث عن (كلمة أو معلومة)|wb
1|Cheer up|😊|To start to feel happier, or to make someone happier.|A funny film will [cheer up] my sister.|يُبهِج / يرفع المعنويات|fe;≈ Happy
1|Hurry up|🏃|To do something faster.|[Hurry up], or we'll miss the bus!|يستعجل|mv;≈ Hurrying;⇄ Speed up vs. slow down: speed up
1|Speed up|🏎️|To go faster.|The car began to [speed up] on the highway.|يُسرِع|mv;≈ Speed;⇄ Speed up vs. slow down: speed up
1|Grow up|🌱|To become an adult.|I want to be a doctor when I [grow up].|يكبر|tc
1|Clean up|🧹|To make a place clean and tidy.|Let's [clean up] the kitchen after dinner.|ينظّف ويرتّب|hb;⇄ Clean vs. dirty: clean
1|Make up|💭|To invent a story or an excuse.|She likes to [make up] stories about dragons.|يختلق / يؤلّف|wb;≈ Make
1|Stand up|🧍|To get onto your feet.|Please [stand up] when the teacher comes in.|يقف|mv;⇄ Stand up vs. sit down: stand up
2|Sit down|🪑|To get into a seat.|Please [sit down] and open your books.|يجلس|mv;⇄ Stand up vs. sit down: sit down
2|Calm down|😌|To become calm after being angry, upset or excited.|Take a deep breath and [calm down].|يهدأ|fe;≈ Calm;⇄ Calm vs. angry: calm
2|Slow down|🐢|To go slower.|[Slow down]! The floor is wet.|يُبطئ|mv;⇄ Speed up vs. slow down: slow down
2|Put down|⬇️|To place something on a table or the floor.|[Put down] the glass carefully.|يضع (الشيء) جانباً|mv;⇄ Pick up vs. put down: put down
2|Break down|🚗|To stop working (for a machine).|Our car [broke down] on the way home.|يتعطّل|tc
2|Turn down|🔉|To make a sound quieter, or to say no to an offer.|Please [turn down] the music.|يخفض (الصوت) / يرفض|lt;⇄ On vs. off: off
2|Write down|📝|To write something on paper so you remember it.|[Write down] your homework in your planner.|يدوّن|wb
3|Find out|🔍|To learn a fact that you did not know.|I want to [find out] how bees make honey.|يكتشف / يعرف|st
3|Run out of|🪫|To have none left.|We [ran out of] milk this morning.|ينفد منه|tc
3|Watch out|⚠️|To be careful because of danger.|[Watch out]! There's a car coming.|ينتبه / يحترس|dg;≈ Look
3|Work out|🧮|To find the answer to a problem.|Can you [work out] this sum?|يحلّ / يستنتج|st
3|Sort out|🗂️|To fix a problem or put things in order.|Mum helped me [sort out] my messy desk.|يرتّب / يحلّ (مشكلة)|ht
3|Go out|🚪|To leave your home to do something.|We [go out] for ice cream on Fridays.|يخرج|pt;⇄ Come in vs. go out: go out
3|Hand out|📄|To give something to each person in a group.|The teacher will [hand out] the tests.|يوزّع|ga
3|Take out|🗑️|To remove something from a place.|Please [take out] the rubbish.|يُخرِج|hb
4|Turn on|💡|To start a machine or a light.|[Turn on] the light, please.|يشغّل|lt;⇄ On vs. off: on
4|Turn off|🌑|To stop a machine or a light.|[Turn off] the TV before bed.|يطفئ|lt;⇄ On vs. off: off
4|Put on|🧥|To dress in clothes.|[Put on] your coat; it's cold.|يرتدي|he;⇄ Put on vs. take off: put on
4|Take off|✈️|To remove clothes; for a plane, to leave the ground.|[Take off] your shoes at the door.|يخلع / تُقلِع (الطائرة)|mv;⇄ Put on vs. take off: take off
4|Carry on|➡️|To keep doing something.|[Carry on] reading until the bell rings.|يستمر|ht;≈ Without stopping;⇄ Give up vs. keep going: keep going
4|Go on|▶️|To continue.|Please [go on] with your story.|يُكمِل|ht;≈ Without stopping;⇄ Give up vs. keep going: keep going
4|Show off|🦚|To try to make people admire you.|He likes to [show off] his new bike.|يتباهى|ch
4|Set off|🧭|To start a journey.|We [set off] for the beach at dawn.|ينطلق (في رحلة)|pt
5|Come in|🚪|To enter a room or a building.|Knock before you [come in].|يدخل|pt;⇄ Come in vs. go out: come in
5|Join in|🤝|To take part in an activity with others.|Can I [join in] your game?|يشارك|ga;≈ Join
5|Give back|🔄|To return something to its owner.|Please [give back] my pencil.|يُعيد / يردّ|ga
5|Throw away|🗑️|To put something in the bin.|Don't [throw away] paper; recycle it.|يرمي في القمامة|sc;≈ Throw
5|Go away|👋|To leave a place or a person.|The rain will [go away] soon.|يرحل / يبتعد|mv;⇄ Go away vs. come back: go away
5|Come back|🔙|To return to a place.|Please [come back] before dark.|يعود|mv;⇄ Go away vs. come back: come back
5|Fill in|✍️|To write information in the spaces on a form.|[Fill in] your name at the top.|يملأ (استمارة)|wb
6|Look after|🧸|To take care of someone or something.|I [look after] my little brother.|يعتني بـ|ga;≈ Help
6|Look for|🔦|To try to find something.|I'm [looking for] my keys.|يبحث عن|ls;≈ Look
6|Look forward to|🤩|To feel happy about something that will happen.|I [look forward to] the holidays.|يتطلّع إلى|fe;≈ Excitement
6|Look up to|🌟|To admire and respect someone.|I [look up to] my grandfather.|يحترم ويقدّر|ga;≈ Look up to
6|Put up with|😤|To accept something unpleasant without complaining.|I can't [put up with] this noise!|يتحمّل|fe
6|Get along with|🫂|To be friendly with someone.|I [get along with] all my classmates.|يتفاهم مع|ga;≈ Peace;⇄ Agree vs. disagree: agree
6|Run into|😮|To meet someone by chance.|I [ran into] my teacher at the shop.|يصادف|ga
6|Take after|👨‍👧|To look or act like an older family member.|She [takes after] her mother.|يشبه (أحد والديه)|ga
6|Get over|🩹|To feel better after an illness or a sad time.|It took a week to [get over] my cold.|يتعافى من|he;⇄ Better vs. worse: better
"""

# Idioms: unit|Idiom|emoji|real meaning|literal meaning|example|Arabic real meaning|Arabic of the literal meaning|Arabic saying with the same idea|tags
ID_UNITS = ["Feelings", "Easy & hard", "Animals", "Body", "Time & weather", "Wise sayings", "Getting along & secrets"]
ID = """
1|Over the moon|🌙|Very, very happy.|Above the moon.|She was [over the moon] when she won the prize.|سعيد جداً|فوق القمر|طار من الفرح|fe;📶 Sad ⇄ Happy: +5;≈ Happy
1|On cloud nine|☁️|Extremely happy.|Sitting on cloud number nine.|I was [on cloud nine] on my birthday.|في غاية السعادة|على السحابة رقم تسعة|في السماء السابعة|fe;📶 Sad ⇄ Happy: +5;≈ Happy
1|Jump for joy|🤸|To be so happy you want to jump.|To jump up because of joy.|We [jumped for joy] when school closed for snow.|يفرح كثيراً|يقفز من الفرح|يرقص من الفرح|fe;📶 Sad ⇄ Happy: +4;≈ Happy
1|Down in the dumps|😞|Sad and without hope.|Down low among the rubbish heaps.|He's been [down in the dumps] since his friend moved away.|حزين ومحبَط|في الأسفل بين أكوام القمامة|معنوياته في الحضيض|fe;📶 Sad ⇄ Happy: -3;≈ Sad
1|Feel blue|💙|To feel sad.|To feel the colour blue.|I [feel blue] when it rains all day.|يشعر بالحزن|يشعر باللون الأزرق|ضاق صدره|fe;📶 Sad ⇄ Happy: -2;≈ Sad
1|Butterflies in my stomach|🦋|A nervous feeling before something important.|Butterflies flying inside my tummy.|I had [butterflies in my stomach] before the play.|توتّر وقلق قبل أمر مهم|فراشات في معدتي|أعصابه مشدودة|fe;📶 Afraid → Calm: -2;≈ Worried
1|Get cold feet|🥶|To become too nervous to do something you planned.|Your feet become cold.|He [got cold feet] and didn't sing on stage.|يتراجع خوفاً في آخر لحظة|تبرد قدماه|تراجع في آخر لحظة|fe;📶 Afraid → Calm: -3;⇄ Brave vs. scared: scared
1|Scared stiff|😱|Extremely frightened.|So scared that your body goes hard.|I was [scared stiff] during the storm.|خائف جداً|خائف حتى تيبّس جسده|تجمّد الدم في عروقه|fe;📶 Afraid → Calm: -5;⇄ Brave vs. scared: scared
1|Cool as a cucumber|🥒|Very calm, even when things are hard.|As cold as a cucumber.|She stayed [cool as a cucumber] in the exam.|هادئ جداً|بارد مثل الخيار|أعصابه باردة|fe;📶 Afraid → Calm: 0;≈ Calm
1|Fed up|😒|Annoyed and tired of something.|Given so much food that you are full.|I'm [fed up] with this noise!|ضجِر ومنزعج|أُطعِم حتى شبع|طفح الكيل|fe;📶 Angry → Calm: -3;≈ Annoyed
1|See red|😡|To become very angry.|To see the colour red.|My brother [sees red] when I touch his games.|يغضب بشدة|يرى اللون الأحمر|ثارت ثائرته|fe;📶 Angry → Calm: -5;⇄ Calm vs. angry: angry
2|A piece of cake|🍰|Very easy.|A slice of cake.|The spelling test was [a piece of cake].|سهل جداً|قطعة من الكعك|أسهل من شربة ماء|ht
2|Easier said than done|🧗|Harder to do than to talk about.|Easier to say than to do.|Cleaning my room in five minutes is [easier said than done].|الكلام أسهل من الفعل|أسهل قولاً من فعلاً|الكلام ليس كالفعل|ht
2|Break the ice|🧊|To say or do something to help people feel relaxed together.|To crack the ice.|The teacher told a joke to [break the ice].|يبدأ حديثاً ودّياً ليزيل الحرج|يكسر الجليد|كسر الجليد|ga
2|Hit the books|📚|To study hard.|To hit your books.|I need to [hit the books] before the test.|يذاكر بجدّ|يضرب الكتب|انكبّ على الكتب|wb
2|Learn the ropes|🪢|To learn how to do a new job or activity.|To learn about the ropes (on a ship).|It took a week to [learn the ropes] at my new club.|يتعلّم أساسيات العمل|يتعلّم الحبال|تعلّم أصول الصنعة|st
2|Bite off more than you can chew|😵|To try to do more than you are able to.|To bite a bigger piece than you can chew.|I [bit off more than I could chew] with three projects.|يحمّل نفسه فوق طاقته|يقضم أكثر مما يستطيع مضغه|حمّل نفسه فوق طاقته|ht
3|Let the cat out of the bag|🐱|To tell a secret by mistake.|To let a cat get out of a bag.|Sami [let the cat out of the bag] about the surprise party.|أفشى السرّ دون قصد|أخرج القطة من الكيس|كشف المستور|ga;⇄ Clear vs. hidden: clear
3|Raining cats and dogs|🌧️|Raining very heavily.|Cats and dogs falling from the sky.|Take an umbrella; it's [raining cats and dogs]!|تمطر بغزارة شديدة|تمطر قططاً وكلاباً|تمطر كأفواه القِرَب|na;≈ Wet
3|Kill two birds with one stone|🐦|To do two things with one action.|To hit two birds with one stone.|I walked to school and exercised: I [killed two birds with one stone].|يُنجز أمرين بعمل واحد|يقتل طائرين بحجر واحد|ضرب عصفورين بحجر واحد|ht
3|The early bird catches the worm|🐛|People who start early do well.|The bird that wakes early gets the worm.|Get up early: [the early bird catches the worm].|من يبدأ مبكراً ينجح|الطائر المبكّر يمسك الدودة|البركة في البُكور|tc
3|As busy as a bee|🐝|Very busy and working hard.|As busy as a bee.|Mum is [as busy as a bee] before Eid.|مشغول جداً ونشيط|مشغول مثل النحلة|نشيط كالنحلة|ch;≈ Lively
3|Hold your horses|🐎|Wait; don't rush.|Hold on to your horses.|[Hold your horses]! We haven't finished.|انتظر ولا تستعجل|أمسك خيولك|على مهلك|ht;⇄ Speed up vs. slow down: slow down
3|A fish out of water|🐟|Someone who feels uncomfortable in a new place.|A fish that is out of the water.|On my first day at the new school, I felt like [a fish out of water].|شخص غير مرتاح في مكان جديد|سمكة خارج الماء|غريب الدار|fe
4|Keep an eye on|👁️|To watch someone or something carefully.|To keep one eye on something.|Please [keep an eye on] the baby.|يراقب جيداً|يُبقي عيناً على|خلِّ عينك عليه|ls;≈ Look;📶 Glance → Stare: 3
4|All ears|👂|Listening carefully.|Made completely of ears.|Tell me your news; I'm [all ears]!|يُصغي باهتمام|كلّه آذان|كلّي آذان صاغية|ls
4|Give someone a hand|🤝|To help someone.|To give someone your hand.|Can you [give me a hand] with these bags?|يساعد|يعطي أحداً يداً|مدّ يد العون|ga;≈ Help
4|Cost an arm and a leg|💸|To be very expensive.|To cost one arm and one leg.|That bike [cost an arm and a leg].|غالي الثمن جداً|يكلّف ذراعاً وساقاً|سعره نار|mw;⇄ Rich vs. poor: rich
4|Pull someone's leg|😜|To joke with someone by telling them something untrue.|To pull on someone's leg.|Don't worry, I'm just [pulling your leg].|يمازح أحداً|يشدّ ساق أحدهم|يمزح معه|ga
4|Bite your tongue|🤐|To stop yourself from saying something.|To bite your own tongue.|I wanted to argue, but I [bit my tongue].|يمتنع عن الكلام|يعضّ لسانه|أمسك لسانه|st
4|Break a leg|🎭|Good luck! (said before a show)|Go and break your leg.|[Break a leg] in your school play tonight!|بالتوفيق|اكسر ساقاً|الله يوفّقك|ga
5|Once in a blue moon|🔵|Very rarely.|One time when the moon is blue.|We eat pizza only [once in a blue moon].|نادراً جداً|مرّة عندما يكون القمر أزرق|كلّ فين وفين|tc;≈ Rare
5|Under the weather|🤒|Feeling a little ill.|Below the weather.|I stayed home because I was [under the weather].|متوعّك قليلاً|تحت الطقس|صحّته على قدّها|he;≈ Sick
5|In hot water|🫖|In trouble.|Inside hot water.|He was [in hot water] for breaking the window.|في ورطة|في ماء ساخن|وقع في ورطة|dg
5|Call it a day|🌇|To stop working for today.|To call it a day.|We were tired, so we [called it a day].|يتوقّف عن العمل لهذا اليوم|يسمّيه يوماً|يكفي لهذا اليوم|tc;⇄ Give up vs. keep going: give up
5|Time flies|⏳|Time passes very quickly.|Time has wings and flies.|[Time flies] when you're having fun!|الوقت يمرّ بسرعة|الوقت يطير|الأيام تمرّ مرّ السحاب|tc
5|Better late than never|⌛|It is better to do something late than not at all.|Late is better than never.|You finished your book! [Better late than never].|التأخّر أفضل من عدم الفعل|متأخّر أفضل من أبداً|أن تصل متأخراً خيرٌ من ألّا تصل|tc
6|Every cloud has a silver lining|🌥️|Something good can come from a bad thing.|Every cloud has a silver edge.|I missed the bus but found a friend; [every cloud has a silver lining].|في كلّ أمر سيئ جانب جيد|لكلّ غيمة حافة فضية|رُبَّ ضارّةٍ نافعة|fe
6|Actions speak louder than words|💪|What you do matters more than what you say.|Actions talk more loudly than words.|Don't just promise to help; [actions speak louder than words].|الأفعال أهمّ من الأقوال|الأفعال تتكلم بصوت أعلى من الكلمات|العبرة بالأفعال لا بالأقوال|ch
6|Don't judge a book by its cover|📕|Don't decide what someone is like only from how they look.|Don't judge a book from its cover.|He looked shy but was so funny; [don't judge a book by its cover].|لا تحكم على الناس من مظهرهم|لا تحكم على الكتاب من غلافه|المظاهر خدّاعة|ch
6|Practice makes perfect|🎯|If you practise a lot, you will become very good.|Practice makes things perfect.|Keep playing the piano; [practice makes perfect].|التمرين يوصل إلى الإتقان|التمرين يجعل الشيء كاملاً|التكرار يعلّم الشُّطّار|ch
6|Don't cry over spilt milk|🥛|Don't be upset about something that cannot be changed.|Don't cry about milk that fell.|The vase is broken, but [don't cry over spilt milk].|لا تحزن على ما فات|لا تبكِ على الحليب المسكوب|لا تبكِ على اللبن المسكوب|fe
6|Could eat a horse|🐴|Very, very hungry.|So hungry you could eat a whole horse.|After football, I [could eat a horse]!|جائع جداً|يستطيع أن يأكل حصاناً|ميّت من الجوع|fd;📶 Hungry → Full: -5;≈ Hungry
7|In the same boat|⛵|In the same difficult situation as others.|Sitting in the same boat.|We all forgot our homework, so we're [in the same boat].|في الموقف الصعب نفسه|في القارب نفسه|كلّنا في الهوا سوا|ga
7|The ball is in your court|🎾|It is your turn to decide or act.|The ball is on your side of the court.|I said sorry; now [the ball is in your court].|القرار الآن لك|الكرة في ملعبك|الكرة في ملعبك|ga
7|Like two peas in a pod|🫛|Very similar to each other.|Like two peas inside one pod.|The twins are [like two peas in a pod].|متشابهان جداً|مثل حبّتي بازلاء في قرن واحد|نسخة طبق الأصل|ga
7|Spill the beans|🫘|To tell a secret.|To let the beans fall out.|Come on, [spill the beans]! What's the surprise?|يكشف السرّ|يسكب حبوب الفول|باح بالسرّ · كب العشاء (بالعامية)|ga;⇄ Clear vs. hidden: clear
7|Bury the hatchet|🕊️|To stop arguing and become friends again.|To bury the small axe in the ground.|After the fight, they [buried the hatchet].|يتصالح وينهي الخلاف|يدفن الفأس|طوى صفحة الخلاف|ga;≈ Peace;⇄ Agree vs. disagree: agree
"""
