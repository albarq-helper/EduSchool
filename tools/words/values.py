# Helper Academy — values (the purpose of a quote): kindness, patience, hard work, …
# Each value has a similar-words group (≈) and an opposite pair (⇄ "good vs. bad": side).
# A quote about a value gets the value's ≈ tag and the GOOD side of its ⇄ pair.
# A word on the BAD side (lazy, rude, impatient) then finds the quotes that teach the lesson.
# Run build_v41.py to turn this into supabase_v41_quote_values.sql.

# key: (unit name, ≈ group, ⇄ pair, good side, bad side, extra tags for the quotes)
VALUES = {
  "K": ("💛 Kindness", "Kindness", "Kind vs. unkind", "kind", "unkind", []),
  "C": ("🦁 Courage", "Brave", "Brave vs. scared", "brave", "scared", []),
  "P": ("⏳ Patience", "Patient", "Patient vs. impatient", "patient", "impatient", []),
  "H": ("💪 Hard work", "Hard work", "Hard-working vs. lazy", "hard-working", "lazy", ["⇄ Give up vs. keep going: keep going"]),
  "L": ("📚 Learning & mistakes", "Learning", "Wise vs. ignorant", "wise", "ignorant", []),
  "F": ("🤝 Friends & people", "Friend", "Friend vs. enemy", "friend", "enemy", []),
  "Y": ("🏠 Family", "Family", "Together vs. alone", "together", "alone", []),
  "O": ("✅ Honesty", "Honest", "Honest vs. lying", "honest", "lying", ["⇄ Pretend vs. true: true"]),
  "W": ("💬 Words & silence", "Words", "Polite vs. rude", "polite", "rude", []),
  "T": ("⏰ Time", "Time", "Use time vs. waste time", "use time", "waste time", []),
  "S": ("🏆 Success & goals", "Success", "Succeed vs. fail", "succeed", "fail", []),
  "J": ("😊 Happiness", "Happy", "Happy vs. upset", "happy", "upset", []),
  "G": ("🙏 Gratitude", "Grateful", "Grateful vs. ungrateful", "grateful", "ungrateful", []),
  "B": ("🌟 Believe in yourself", "Confident", "Confident vs. doubtful", "confident", "doubtful", []),
  "M": ("😌 Calm & self-control", "Calm", "Calm vs. angry", "calm", "angry", []),
  "U": ("🌈 Hope in hard times", "Hope", "Hopeful vs. hopeless", "hopeful", "hopeless", []),
  "R": ("🙇 Respect & humility", "Humble", "Humble vs. arrogant", "humble", "arrogant", ["⇄ Polite vs. rude: polite"]),
  "X": ("🌱 Life lessons", None, None, None, None, []),
}
ORDER = "KCPHLFYOWTSJGBMURX"

# New dictionary words: Headword|type|themes|emoji|syllables|PRONUNCIATION|meaning|example|translation
NEW = """
Kindness|N|ch;ga|💛|kind-ness|KYND-nis|Being friendly, caring and helpful to others.|Her [kindness] made the new girl feel welcome.|اللطف / الطيبة
Unkind|D|ch;ga|😠|un-kind|un-KYND|Not nice to others; a little mean.|It was [unkind] to laugh at his drawing.|غير لطيف / قاسٍ
Cruel|D|ch;ga|👿|cru-el|KROO-ul|Happy to hurt others, or not caring when they are hurt.|Pulling the cat's tail is [cruel].|قاسٍ / وحشي
Caring|D|ch;ga|🤗|car-ing|KAIR-ing|Kind and wanting to look after others.|My [caring] sister made me soup when I was sick.|حنون / يهتم بالآخرين
Generous|D|ch;ga|🎁|gen-er-ous|JEN-er-us|Happy to give and share with others.|He was [generous] and shared his snacks with everyone.|كريم
Forgive|A|ga|🕊️|for-give|fer-GIV|To stop being angry with someone who did something wrong.|I decided to [forgive] my friend for breaking my pencil.|يسامح / يغفر
Revenge|N|ga|🗡️|re-venge|ri-VENJ|Hurting someone because they hurt you first.|Taking [revenge] only makes the problem bigger.|الانتقام
Courage|N|ch|🦁|cour-age|KUR-ij|The strength to do something even when you are afraid.|It took [courage] to sing in front of the whole school.|الشجاعة
Fear|N|fe|😨|fear|FEER|The feeling you get when you think something bad may happen.|She faced her [fear] and jumped into the pool.|الخوف
Afraid|D|fe|😟|a-fraid|uh-FRAYD|Feeling fear; scared.|My little brother is [afraid] of the dark.|خائف
Coward|P|ch|🐔|cow-ard|KOW-erd|Someone who is not brave enough to do what is right.|Only a [coward] blames others for his own mistake.|جبان
Patience|N|ch|⏳|pa-tience|PAY-shuns|Being able to wait calmly without getting upset.|Learning to ride a bike takes [patience].|الصبر
Patient|D|ch|🧘|pa-tient|PAY-shunt|Able to wait calmly without getting upset.|Be [patient]; the cake needs ten more minutes.|صبور
Impatient|D|ch;fe|😤|im-pa-tient|im-PAY-shunt|Not able to wait; wanting things right now.|The [impatient] boy kept asking, "Are we there yet?"|نافد الصبر
Hasty|D|ch;ht|💨|has-ty|HAY-stee|Done too quickly, without enough thinking.|His [hasty] answer was wrong because he didn't read the question.|متسرّع
Hard work|N|mw;ch|💪|hard work|HARD WURK|Working with a lot of effort for a long time.|Her good marks came from [hard work].|العمل الجاد / الاجتهاد
Hardworking|D|ch;mw|🐝|hard-work-ing|HARD-wur-king|Always working with a lot of effort.|Bees are small but very [hardworking].|مجتهد
Diligent|D|ch;mw|📝|dil-i-gent|DIL-i-junt|Careful and hardworking in everything you do.|A [diligent] student checks her homework twice.|مثابر / حريص في عمله
Persevere|A|ch|🧗|per-se-vere|pur-suh-VEER|To keep trying even when something is hard.|If you [persevere], you will finish the puzzle.|يثابر
Determined|D|ch|🎯|de-ter-mined|di-TUR-mind|Having decided to do something and not letting anything stop you.|She was [determined] to win the race.|مصمِّم / عازم
Lazy|D|ch|🦥|la-zy|LAY-zee|Not wanting to work or make an effort.|The [lazy] cat slept all day.|كسول
Laziness|N|ch|🛋️|la-zi-ness|LAY-zee-nis|Not wanting to work or make an effort.|His [laziness] meant the work was never finished.|الكسل
Quit|A|ch|🏳️|quit|KWIT|To stop doing something before it is finished; to give up.|Don't [quit] just because it is hard.|يستسلم / يترك
Learning|N|wb;st|📚|learn-ing|LUR-ning|Getting new knowledge or skills.|[Learning] a new language is fun.|التعلّم
Learn|A|wb;st|🧠|learn|LURN|To get new knowledge or a new skill.|I want to [learn] how to swim.|يتعلّم
Knowledge|N|wb;st|💡|knowl-edge|NOL-ij|What you know and understand.|Reading books gives you [knowledge].|المعرفة
Wisdom|N|st;ch|🦉|wis-dom|WIZ-dum|Good sense that comes from knowledge and experience.|Grandpa's [wisdom] helped us decide.|الحكمة
Wise|D|st;ch|🧙|wise|WYZ|Able to make good choices because of knowledge and experience.|The [wise] owl gave the animals good advice.|حكيم
Curious|D|st;ch|🧐|cu-ri-ous|KYOOR-ee-us|Wanting to know or learn about something.|The [curious] puppy sniffed every box.|فضولي / محب للمعرفة
Ignorant|D|st|🙈|ig-no-rant|IG-ner-unt|Not knowing about something you should know.|He was [ignorant] of the rules, so he broke them.|جاهل
Friendship|N|ga|🤝|friend-ship|FREND-ship|The good feeling and bond between friends.|Their [friendship] lasted many years.|الصداقة
Enemy|P|ga|⚔️|en-e-my|EN-uh-mee|Someone who hates you or wants to hurt you.|The two kings were [enemy] rulers for years.|العدو
Lonely|D|fe|🥀|lone-ly|LOHN-lee|Sad because you are alone or have no friends.|He felt [lonely] on his first day at the new school.|وحيد
Family|N|ga|👨‍👩‍👧|fam-i-ly|FAM-uh-lee|The people you are related to, like parents, brothers and sisters.|My [family] eats dinner together every night.|العائلة / الأسرة
Parent|P|ga|👪|par-ent|PAIR-unt|A mother or a father.|Each [parent] signed the school trip form.|أحد الوالدين
Honesty|N|ch|✅|hon-es-ty|ON-uh-stee|Telling the truth and not cheating.|Her [honesty] made everyone trust her.|الصدق / الأمانة
Honest|D|ch|🙋|hon-est|ON-ist|Always telling the truth.|Be [honest] and say who broke the vase.|صادق / أمين
Truthful|D|ch|🗣️|truth-ful|TROOTH-ful|Telling the truth.|The [truthful] boy said he forgot his homework.|صادق
Truth|N|ch;st|🔎|truth|TROOTH|What is really true; the real facts.|Always tell the [truth].|الحقيقة
Lie|N|ch;st|🤥|lie|LY|Something you say that you know is not true.|Telling a [lie] can break a friend's trust.|كذبة
Dishonest|D|ch|🦹|dis-hon-est|dis-ON-ist|Not telling the truth; cheating.|It is [dishonest] to copy someone's test.|غير أمين / كاذب
Speech|N|st;wb|🎤|speech|SPEECH|The words you say; also a talk given to a group.|She gave a short [speech] at the party.|الكلام / الخطاب
Silence|N|lt;st|🤫|si-lence|SY-luns|When there is no sound or nobody is talking.|There was [silence] when the teacher came in.|الصمت
Polite|D|ga|🎩|po-lite|puh-LYT|Speaking and acting with good manners.|It is [polite] to say please and thank you.|مهذّب
Rude|D|ga|😛|rude|ROOD|Not polite; with bad manners.|It is [rude] to talk while others are talking.|وقح / قليل الأدب
Insult|A|ga;st|🗯️|in-sult|in-SULT|To say something unkind that hurts someone's feelings.|Never [insult] someone because of how they look.|يهين / يشتم
Time|N|tc|⏰|time|TYM|Minutes, hours and days, as they pass.|We had a lot of [time] to play after school.|الوقت
Moment|N|tc|⏱️|mo-ment|MOH-munt|A very short time.|Wait a [moment], I'm coming.|لحظة
Waste|A|tc;mw|🗑️|waste|WAYST|To use something badly or for nothing.|Don't [waste] your time on your phone all day.|يُضيّع / يهدر
Procrastinate|A|tc;ch|📅|pro-cras-ti-nate|proh-KRAS-tuh-nayt|To keep putting off something you should do now.|If you [procrastinate], the homework piles up.|يُماطل / يؤجّل
Punctual|D|tc;ch|🕘|punc-tu-al|PUNGK-choo-ul|Arriving or doing things exactly on time.|Our [punctual] teacher starts class at eight sharp.|دقيق في المواعيد
Late|D|tc|🐌|late|LAYT|After the right or expected time.|I was [late] for school because I missed the bus.|متأخر
Success|N|mw;gg|🏆|suc-cess|suk-SES|Getting what you worked or hoped for.|The school play was a big [success].|النجاح
Succeed|A|mw;gg|🥇|suc-ceed|suk-SEED|To do well; to get what you tried to get.|If you practise, you will [succeed].|ينجح
Achieve|A|mw;gg|🎯|a-chieve|uh-CHEEV|To reach a goal by working for it.|She worked hard to [achieve] her dream.|يحقّق / يُنجز
Goal|N|mw|🥅|goal|GOHL|Something you want to do or get in the future.|My [goal] is to read twenty books this year.|هدف
Fail|A|mw|❌|fail|FAYL|To not do what you tried to do.|Even if you [fail], you can try again.|يفشل / يرسب
Failure|N|mw|📉|fail-ure|FAYL-yer|When something does not work out.|One [failure] taught him how to do it right.|الفشل
Happiness|N|fe|😊|hap-pi-ness|HAP-ee-nis|The feeling of being happy.|Her face was full of [happiness].|السعادة
Happy|D|fe|😀|hap-py|HAP-ee|Feeling good and pleased.|I am [happy] when I play with my friends.|سعيد
Joy|N|fe|🥳|joy|JOY|A feeling of great happiness.|The children jumped with [joy].|الفرح / البهجة
Grateful|D|fe;ch|🙏|grate-ful|GRAYT-ful|Feeling thankful for something.|I am [grateful] for my teacher's help.|ممتنّ / شاكر
Thankful|D|fe;ch|💐|thank-ful|THANGK-ful|Happy and grateful for what you have.|We are [thankful] for our food.|شاكر
Ungrateful|D|ch|🙄|un-grate-ful|un-GRAYT-ful|Not showing thanks for what you got.|The [ungrateful] boy did not say thank you for the gift.|جاحد / ناكر للجميل
Complain|A|st;fe|😒|com-plain|kum-PLAYN|To say that you are unhappy about something.|Don't [complain] about the rain; let's play inside.|يشتكي / يتذمّر
Confident|D|ch;fe|😎|con-fi-dent|KON-fi-dunt|Sure that you can do something well.|She felt [confident] before the spelling test.|واثق
Confidence|N|ch;fe|🌟|con-fi-dence|KON-fi-duns|Believing that you can do something well.|Practice gave him [confidence].|الثقة بالنفس
Believe|A|st|🙌|be-lieve|bi-LEEV|To think that something is true or possible.|[Believe] in yourself and keep trying.|يؤمن / يصدّق
Doubt|N|st;fe|🤔|doubt|DOWT|A feeling of not being sure.|She had no [doubt] she could do it.|الشك
Anger|N|fe|😡|an-ger|ANG-ger|The strong feeling of being angry.|Count to ten when you feel [anger].|الغضب
Hope|N|fe|🌈|hope|HOHP|The feeling that something good can happen.|After the storm, there was [hope] for a sunny day.|الأمل
Hopeful|D|fe|🌅|hope-ful|HOHP-ful|Believing that something good will happen.|We are [hopeful] that our team will win.|متفائل / مليء بالأمل
Hopeless|D|fe|😞|hope-less|HOHP-lis|Feeling that nothing good can happen.|Don't feel [hopeless]; tomorrow is a new day.|يائس
Optimistic|D|fe|☀️|op-ti-mis-tic|op-tuh-MIS-tik|Expecting good things to happen.|She is [optimistic] about the new school year.|متفائل
Despair|N|fe|🌧️|de-spair|di-SPAIR|The feeling of having no hope at all.|He was in [despair] when he lost his dog, but then it came home.|اليأس
Humble|D|ch|🙇|hum-ble|HUM-bul|Not thinking you are better than others.|The champion stayed [humble] and thanked her coach.|متواضع
Modest|D|ch|🌾|mod-est|MOD-ist|Not boasting about what you can do.|He was [modest] about winning the prize.|متواضع
Arrogant|D|ch|🦚|ar-ro-gant|AIR-uh-gunt|Acting as if you are better than everyone else.|The [arrogant] hare thought he could not lose.|متكبّر / مغرور
Boastful|D|ch|📣|boast-ful|BOHST-ful|Talking too proudly about yourself.|Nobody liked the [boastful] boy who bragged all day.|متفاخر / متباهٍ
"""

# Words (new or already in the dictionary) per value: (good side words, bad side words, extra ≈ words)
WORDS = {
  "K": ("Kindness Kind Caring Generous Forgive Compassion Empathy", "Unkind Cruel Revenge Greedy Selfish", ""),
  "C": ("Courage Brave Courageous", "Fear Afraid Coward Scared Timid", ""),
  "P": ("Patience Patient", "Impatient Hasty", ""),
  "H": ("Hard_work Hardworking Diligent Persevere Determined Effort", "Lazy Laziness Quit", ""),
  "L": ("Learning Learn Knowledge Wisdom Wise Curious", "Ignorant Foolish", ""),
  "F": ("Friend Friendship Loyal", "Enemy", ""),
  "Y": ("Family Parent", "Lonely Alone", ""),
  "O": ("Honesty Honest Truthful Truth", "Lie Dishonest", "Sincerity"),
  "W": ("Polite Respect", "Rude Insult", "Speech Silence"),
  "T": ("Punctual", "Waste Procrastinate Late", "Time Moment"),
  "S": ("Success Succeed Achieve", "Fail Failure", "Goal"),
  "J": ("Happiness Happy Joy Joyful", "Sad", ""),
  "G": ("Grateful Thankful Gratitude", "Ungrateful Complain", "Content"),
  "B": ("Confident Confidence Believe", "Doubt", ""),
  "M": ("Calm", "Anger Angry", ""),
  "U": ("Hope Hopeful Optimistic", "Hopeless Despair", ""),
  "R": ("Humble Modest", "Arrogant Boastful", ""),
}
# the words that mean "give up"
GIVE_UP = "Quit"
