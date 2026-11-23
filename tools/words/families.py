# Helper Academy — word families for Grade 5: meters (📶), similar words (≈) and opposites (⇄).
# Run build_v28.py to turn this into supabase_v28_word_families.sql.
# New words: Headword|type|themes|emoji|syllables|PRONUNCIATION|meaning|example|translation
#   type: A Action, D Describing, P Naming: people, N Naming: things & places
#   themes: short codes (see THEMES), ";"-separated, "-" for none

THEMES = {"fe": "Feelings & moods", "hb": "Homes & buildings", "an": "Animals", "na": "Plants, nature & weather", "he": "Health & body",
          "fd": "Food & drink", "mw": "Money & work", "wb": "Words & books", "ls": "Looking & seeing", "mv": "Ways of moving",
          "lt": "Light & sound", "sz": "Size, amount & distance", "dg": "Danger & safety", "ga": "Getting along", "gl": "Government & law",
          "gg": "Good & great", "if": "Important & famous", "sc": "Science", "tc": "Time & change", "st": "Saying & thinking",
          "pt": "Places & travel", "ch": "Character", "ht": "How things are done"}
TYPES = {"A": "Action", "D": "Describing", "P": "Naming: people", "N": "Naming: things & places"}

NEW = """
Tiny|D|sz|🐜|ti-ny|TY-nee|Very, very small.|The ant is [tiny] next to my shoe.|صغير جداً
Small|D|sz|🐭|small|SMAWL|Not big; little in size.|A mouse is a [small] animal.|صغير
Big|D|sz|🐘|big|BIG|Large in size.|An elephant is a [big] animal.|كبير
Huge|D|sz|🐋|huge|HYOOJ|Very big.|The whale was [huge].|ضخم
Near|D|sz;pt|📍|near|NEER|A short distance away; close.|The park is [near] our house.|قريب
Nearby|D|sz;pt|🚶|near-by|neer-BY|Close to here; not far away.|There is a shop [nearby].|قريب من هنا
Remote|D|sz;pt|🏝️|re-mote|ri-MOHT|Very far away from towns and people.|They lived on a [remote] island.|نائٍ / بعيد جداً
Quiet|D|lt|🔈|qui-et|KWY-it|Making very little sound.|Please be [quiet] in the library.|هادئ
Loud|D|lt|🔊|loud|LOWD|Making a lot of sound.|The music was too [loud].|عالٍ (صوت)
Booming|D|lt|📢|boom-ing|BOOM-ing|Very loud and deep.|We heard a [booming] voice from the hall.|مدوٍّ
Deafening|D|lt|💥|deaf-en-ing|DEF-uh-ning|So loud that you can hardly hear anything else.|The fireworks were [deafening].|يصمّ الآذان
Safe|D|dg|🛡️|safe|SAYF|Not in danger; protected from harm.|We were [safe] inside the house.|آمن
Risky|D|dg|⚠️|risk-y|RIS-kee|Could go wrong or cause harm.|Climbing that wall is [risky].|محفوف بالمخاطر
Dangerous|D|dg|☠️|dan-ger-ous|DAYN-jer-us|Able to hurt you or cause harm.|Crossing the busy road is [dangerous].|خطير
Deadly|D|dg|💀|dead-ly|DED-lee|Able to cause death.|Some snakes have a [deadly] bite.|قاتل / مميت
Energetic|D|he;fe|⚡|en-er-get-ic|en-er-JET-ik|Full of energy and ready to move.|The puppy was [energetic] all morning.|نشيط
Tired|D|he;fe|🥱|tired|TYRD|Needing rest or sleep.|I was [tired] after school.|متعب
Weary|D|he;fe|😩|wear-y|WEER-ee|Very tired, especially after a long time.|The [weary] travellers sat down to rest.|مُنهَك
Exhausted|D|he;fe|😴|ex-haust-ed|ig-ZAWS-tid|Extremely tired; with no energy left.|After the race I was [exhausted].|مُرهَق جداً
Boring|D|fe|🥱|bor-ing|BOR-ing|Not interesting; dull.|The long speech was [boring].|مُمل
Interesting|D|fe|🙂|in-ter-est-ing|IN-tres-ting|Making you want to know more.|That is an [interesting] book.|مثير للاهتمام
Fascinating|D|fe|🤩|fas-ci-nat-ing|FAS-uh-nay-ting|Extremely interesting.|The museum was [fascinating].|رائع / آسر
Thrilling|D|fe|🎢|thrill-ing|THRIL-ing|Very exciting.|The roller coaster ride was [thrilling].|مثير جداً
Good|D|gg|👍|good|GUUD|Nice, pleasant or of a high level.|That was a [good] idea.|جيد
Great|D|gg|😀|great|GRAYT|Very good.|We had a [great] day at the beach.|عظيم / رائع
Wonderful|D|gg|🌟|won-der-ful|WUN-der-ful|Extremely good; it makes you happy.|What a [wonderful] surprise!|رائع
Clean|D|he|✨|clean|KLEEN|Not dirty.|My hands are [clean] now.|نظيف
Dirty|D|he|🟤|dirt-y|DUR-tee|Covered with mud, dust or marks.|My shoes were [dirty] after the rain.|متّسخ
Grimy|D|he|🐷|grim-y|GRY-mee|Covered with thick, old dirt.|The old window was [grimy].|متّسخ جداً
Minor|D|if|🤷|mi-nor|MY-ner|Small and not very important.|It was only a [minor] problem.|بسيط / ثانوي
Important|D|if|⭐|im-por-tant|im-POR-tunt|Mattering a lot.|Sleep is [important] for your body.|مهم
Essential|D|if|🔑|es-sen-tial|i-SEN-shul|Needed; you cannot do without it.|Water is [essential] for life.|أساسي / ضروري
Unknown|D|if|❓|un-known|un-NOHN|Not known by people.|The song was by an [unknown] singer.|مجهول
Famous|D|if|🌟|fa-mous|FAY-mus|Known by very many people.|She is a [famous] writer.|مشهور
Common|D|-|👥|com-mon|KOM-un|Found or seen often; usual.|Sparrows are [common] birds here.|شائع
Rare|D|-|💎|rare|RAIR|Not found or seen very often.|The panda is a [rare] animal.|نادر
Poor|D|mw|🪙|poor|POOR|Having very little money.|The [poor] man had no shoes.|فقير
Rich|D|mw|💰|rich|RICH|Having a lot of money.|The [rich] family had a big house.|غني
Wealthy|D|mw|🏦|wealth-y|WEL-thee|Rich; having a lot of money and things.|A [wealthy] merchant bought the ship.|ثري
Timid|D|ch;fe|🐭|tim-id|TIM-id|Shy and easily frightened.|The [timid] kitten hid under the bed.|خجول / هيّاب
Brave|D|ch|🦁|brave|BRAYV|Ready to face danger or pain without fear.|The [brave] girl helped her friend.|شجاع
Courageous|D|ch|💪|cou-ra-geous|kuh-RAY-jus|Very brave.|The [courageous] firefighter saved the cat.|مقدام / شجاع جداً
Dry|D|na|🏜️|dry|DRY|With no water in or on it.|The desert is very [dry].|جاف
Damp|D|na|🌫️|damp|DAMP|A little wet.|The towel is still [damp].|رطب قليلاً
Wet|D|na|💧|wet|WET|Covered with water or another liquid.|My coat got [wet] in the rain.|مبلل
Soaked|D|na|🌊|soaked|SOHKT|Completely wet.|We were [soaked] after the storm.|مبلل تماماً
Dark|D|lt|🌑|dark|DARK|With little or no light.|It was [dark] outside at night.|مظلم
Dim|D|lt|🌒|dim|DIM|Not bright; with only a little light.|The room was [dim] and quiet.|خافت
Bright|D|lt|💡|bright|BRYT|Full of light; shining strongly.|The sun is very [bright] today.|ساطع
Dazzling|D|lt|🌞|daz-zling|DAZ-ling|So bright that it is hard to look at.|The snow was [dazzling] in the sun.|مُبهِر
Disgusting|D|fd|🤮|dis-gust-ing|dis-GUS-ting|Very unpleasant; it makes you feel sick.|The old milk smelled [disgusting].|مقرف
Tasty|D|fd|😋|tast-y|TAY-stee|Having a nice taste.|These cookies are [tasty].|لذيذ
Delicious|D|fd|🤤|de-li-cious|di-LISH-us|Tasting very good.|Mum made a [delicious] cake.|شهي
Scrumptious|D|fd|🤩|scrump-tious|SKRUMP-shus|Extremely tasty.|The pizza was [scrumptious]!|شهي للغاية
Gentle|D|an;ch|🐑|gen-tle|JEN-tul|Kind, calm and soft; not rough.|The horse is very [gentle].|لطيف / وديع
Wild|D|an|🐗|wild|WYLD|Living in nature, not tamed by people.|We saw [wild] deer in the forest.|بري
Fierce|D|an;dg|🐺|fierce|FEERS|Angry and ready to attack.|The [fierce] dog barked at the gate.|شرس
Breeze|N|na|🍃|breeze|BREEZ|A soft, gentle wind.|A cool [breeze] came from the sea.|نسيم
Gale|N|na|🌬️|gale|GAYL|A very strong wind.|The [gale] knocked down the fence.|ريح عاتية
Hurricane|N|na|🌀|hur-ri-cane|HUR-i-kayn|A huge storm with very strong winds that spin.|The [hurricane] broke many trees.|إعصار
Look|A|ls|👁️|look|LUUK|To turn your eyes to see something.|[Look] at the pretty bird!|ينظر
Stare|A|ls|😳|stare|STAIR|To look at something for a long time without moving your eyes.|It is rude to [stare] at people.|يحدّق
Tiptoe|A|mv|🩰|tip-toe|TIP-toh|To walk very quietly on the front of your feet.|I [tiptoe] past my sleeping baby brother.|يمشي على رؤوس أصابعه
Walk|A|mv|🚶|walk|WAWK|To move along on your feet at a normal speed.|We [walk] to school every day.|يمشي
March|A|mv|🥁|march|MARCH|To walk with strong, even steps, like soldiers.|The band will [march] down the street.|يسير بخطى منتظمة
Clever|D|ch|🦉|clev-er|KLEV-er|Quick to learn and understand.|The [clever] fox found a way out.|ذكي
Irritate|A|fe;ga|😒|ir-ri-tate|IR-i-tayt|To make someone a little angry.|Loud chewing can [irritate] people.|يُزعِج
Peaceful|D|fe|🕊️|peace-ful|PEES-ful|Calm and quiet, with no trouble.|The garden was [peaceful] in the morning.|هادئ / مسالم
Help|A|ga|🤝|help|HELP|To make things easier for someone.|Can you [help] me carry this?|يساعد
Save|A|dg|🛟|save|SAYV|To keep someone safe from danger.|The lifeguard will [save] the swimmer.|يُنقذ
Make|A|-|🛠️|make|MAYK|To put things together so something new exists.|Let's [make] a card for Grandma.|يصنع
Build|A|hb|🧱|build|BILD|To make something by putting parts together.|They [build] a sandcastle on the beach.|يبني
Join|A|ga|🧩|join|JOIN|To put or come together.|[Join] the two pieces with tape.|يضمّ / يربط
Link|A|ga|🔗|link|LINK|To connect two things.|A bridge can [link] two towns.|يربط
Allow|A|ga|✅|al-low|uh-LOW|To let someone do something.|Mum will [allow] us to stay up late.|يسمح
Buy|A|mw|🛒|buy|BY|To get something by paying money for it.|I want to [buy] a new pencil.|يشتري
Mistake|N|-|❌|mis-take|mis-TAYK|Something that is wrong.|I made a [mistake] in my spelling.|خطأ
Lucky|D|gg|🍀|luck-y|LUK-ee|Having good things happen by chance.|I was [lucky] to find my lost ring.|محظوظ
Clear|D|ls|🔎|clear|KLEER|Easy to see or understand.|The teacher gave [clear] instructions.|واضح
Graceful|D|mv;gg|🦢|grace-ful|GRAYS-ful|Moving in a smooth and beautiful way.|The dancer was very [graceful].|رشيق
Greedy|D|ch|🤑|greed-y|GREE-dee|Wanting more than you need, and not sharing.|The [greedy] boy ate all the sweets.|جشع
Frightening|D|dg;fe|👻|fright-en-ing|FRY-tuh-ning|Making you feel scared.|The storm was [frightening].|مخيف
Intentionally|D|ht|🎯|in-ten-tion-al-ly|in-TEN-shuh-nuh-lee|On purpose; not by accident.|She [intentionally] left the door open for the cat.|عن قصد
Constantly|D|ht;tc|🔁|con-stant-ly|KON-stunt-lee|All the time, without stopping.|The baby cried [constantly].|باستمرار
Always|D|ht;tc|♾️|al-ways|AWL-wayz|Every time; at all times.|I [always] brush my teeth before bed.|دائماً
Seemingly|D|ht|🤔|seem-ing-ly|SEE-ming-lee|It looks that way, but we are not sure.|The box was [seemingly] empty.|على ما يبدو
Useless|D|ht|🗑️|use-less|YOOS-lis|Not useful; it does not help at all.|A broken umbrella is [useless].|عديم الفائدة
Worsening|A|tc|📉|wors-en-ing|WUR-suh-ning|Getting worse.|The weather was [worsening] all day.|يزداد سوءاً
Rot|A|sc;tc|🍂|rot|ROT|To go bad and break down slowly.|Old leaves [rot] on the ground.|يتعفّن
Scent|N|fd|🌸|scent|SENT|A smell, often a nice one.|The [scent] of roses filled the room.|عبير / رائحة
Drink|N|fd|🥤|drink|DRINK|A liquid that you can swallow.|I would like a cold [drink].|مشروب
Mixture|N|fd;sc|🥣|mix-ture|MIKS-cher|Different things mixed together.|Stir the [mixture] with a spoon.|خليط
Harmony|N|ga|🎶|har-mo-ny|HAR-muh-nee|Getting along well together, peacefully.|The neighbours lived in [harmony].|وئام / انسجام
Area|N|pt|🗺️|ar-e-a|AIR-ee-uh|A part of a place.|This [area] of the park has swings.|منطقة
Dwell|A|hb|🏡|dwell|DWEL|To live in a place.|Owls [dwell] in old trees.|يسكن
Moved|A|pt;hb|📦|moved|MOOVD|Went to live in a different place.|We [moved] to a new house last year.|انتقل
Scientist|P|sc|🔬|sci-en-tist|SY-un-tist|A person who studies how the world works.|The [scientist] looked through the microscope.|عالِم
Branches|N|na|🌳|branch-es|BRAN-chiz|The arms of a tree that grow out from the trunk.|Birds sat on the [branches].|أغصان
Glow|N|lt|🕯️|glow|GLOH|A soft, steady light.|We saw the [glow] of the candle.|وهج
Traveller|P|pt|🧳|trav-el-ler|TRAV-uh-ler|A person who goes on a journey.|The [traveller] stopped at the inn.|مسافر
Companion|P|ga|🧑‍🤝‍🧑|com-pan-ion|kum-PAN-yun|A friend who spends time with you.|My dog is my best [companion].|رفيق
Group|N|ga|👥|group|GROOP|A number of people or things together.|A [group] of children played football.|مجموعة
Crouching|A|mv|🐈|crouch-ing|KROWCH-ing|Bending your legs low, close to the ground.|The cat was [crouching] behind the bush.|ينحني / يقرفص
Throw|A|mv|🥎|throw|THROH|To send something through the air with your hand.|[Throw] the ball to me!|يرمي
Speed|N|mv|🏎️|speed|SPEED|How fast something moves.|The car went at a high [speed].|سرعة
Rocked|A|mv|🪑|rocked|ROKT|Moved gently backwards and forwards.|The boat [rocked] on the waves.|تأرجح
Retreated|A|mv|🔙|re-treat-ed|ri-TREE-tid|Moved back or away.|The army [retreated] from the hill.|تراجع / انسحب
Divided|A|mv|➗|di-vid-ed|di-VY-did|Split into parts.|We [divided] the cake into eight pieces.|قسّم
Faked|A|st|🎭|faked|FAYKT|Pretended something was true.|He [faked] a cough to stay home.|تظاهر
Considered|A|st|🤔|con-sid-ered|kun-SID-erd|Thought about carefully, or thought of in a certain way.|She was [considered] the best runner.|اعتُبر
Guess|A|st|❓|guess|GES|To give an answer when you are not sure.|Can you [guess] how many sweets are in the jar?|يُخمّن
Honour|A|if|🎖️|hon-our|ON-er|To show great respect for someone.|We [honour] the heroes of our country.|يُكرّم
Awarded|A|if|🏅|a-ward-ed|uh-WOR-did|Gave a prize or honour.|She was [awarded] a medal.|مُنِح
Rudeness|N|ga|😤|rude-ness|ROOD-nis|Not being polite.|His [rudeness] upset the teacher.|وقاحة
Arguing|A|ga|🗯️|ar-gu-ing|AR-gyoo-ing|Talking angrily because you disagree.|The twins were [arguing] about the toy.|يتجادل
Desire|A|fe|💭|de-sire|di-ZYR|To want something very much.|I [desire] to travel the world.|يرغب
Hit|A|dg|👊|hit|HIT|To touch something hard and fast.|Don't [hit] your brother!|يضرب
Torment|A|dg|😖|tor-ment|tor-MENT|To make someone suffer on purpose.|Bullies [torment] others; never be one.|يُعذّب
Sick|D|he|🤒|sick|SIK|Not well; ill.|I stayed home because I was [sick].|مريض
Motivated|D|fe|🚀|mo-ti-vat-ed|MOH-tuh-vay-tid|Wanting to do something and work hard at it.|She felt [motivated] to practise every day.|متحمّس
Demanded|A|st|☝️|de-mand-ed|di-MAN-did|Asked for something very strongly.|The customer [demanded] his money back.|طالب بـ
Faithful|D|ch|🤲|faith-ful|FAYTH-ful|Staying loyal and true.|He is [faithful] to his promises.|وفيّ / مُخلص
Informal|D|wb|💬|in-for-mal|in-FOR-mul|Relaxed and friendly, not formal.|We use [informal] words with our friends.|غير رسمي
Worn|D|tc|🧥|worn|WORN|Old and damaged from lots of use.|My [worn] shoes have a hole.|بالٍ
Approved|A|gl|✔️|ap-proved|uh-PROOVD|Agreed that something is good or allowed.|The head teacher [approved] the trip.|وافق على
Dump|N|sc|🚛|dump|DUMP|A place where rubbish is left.|The truck took the rubbish to the [dump].|مكبّ النفايات
Creature|N|an|🐾|crea-ture|KREE-cher|Any living animal.|A strange [creature] lived in the lake.|مخلوق
Printed|A|wb|🖨️|print-ed|PRIN-tid|Put words or pictures on paper with a machine.|The book was [printed] last year.|طُبِع
Incomplete|D|tc|🧩|in-com-plete|in-kum-PLEET|Not finished; missing parts.|The puzzle is [incomplete].|غير مكتمل
Environmental|D|sc;na|🌍|en-vi-ron-men-tal|en-vy-run-MEN-tul|About nature and the world around us.|Pollution is an [environmental] problem.|بيئي
Shedding|A|sc;an|🐍|shed-ding|SHED-ing|Letting skin, hair or leaves fall off.|The snake is [shedding] its skin.|ينسلخ / يطرح
Accountant|P|mw|🧮|ac-count-ant|uh-KOWN-tunt|A person whose job is to keep and check money records.|The [accountant] checked the numbers.|محاسب
Shoes|N|-|👟|shoes|SHOOZ|Things you wear on your feet.|Put on your [shoes] before going out.|أحذية
Under|D|sz|⬇️|un-der|UN-der|Below something.|The cat is [under] the table.|تحت
Above|D|sz|⬆️|a-bove|uh-BUV|Higher than something.|The bird flew [above] the trees.|فوق
Effect|N|if|💫|ef-fect|i-FEKT|A change that happens because of something.|Rain has a good [effect] on plants.|تأثير
Modern|D|tc|📱|mod-ern|MOD-ern|New and up to date.|They live in a [modern] flat.|حديث
Represented|A|st|🔣|rep-re-sent-ed|rep-ri-ZEN-tid|Stood for something.|The dove [represented] peace.|رمز إلى / مثّل
Minority|N|sz|🔹|mi-nor-i-ty|my-NOR-i-tee|The smaller number; less than half of a group.|Only a [minority] of pupils walk to school.|أقلية
Napped|A|he|😴|napped|NAPT|Slept for a short time in the day.|Grandpa [napped] after lunch.|أخذ قيلولة
Thin|D|sz|📏|thin|THIN|Not thick or wide.|A [thin] path ran through the woods.|رفيع
Foolish|D|ch|🤪|fool-ish|FOO-lish|Not sensible; silly.|It was [foolish] to go out without a coat.|أحمق / سخيف
Unlucky|D|gg|🐈‍⬛|un-luck-y|un-LUK-ee|Having bad things happen by chance.|I was [unlucky] and missed the bus.|سيئ الحظ
Forbid|A|ga|⛔|for-bid|fer-BID|To say someone must not do something.|My parents [forbid] eating in the car.|يمنع
Destroy|A|dg|💣|de-stroy|di-STROY|To break something so badly it cannot be used.|The storm could [destroy] the hut.|يدمّر
Sell|A|mw|🏷️|sell|SEL|To give something to someone for money.|They [sell] fruit at the market.|يبيع
Hidden|D|ls|🙈|hid-den|HID-un|Put where people cannot see or find it.|The treasure was [hidden] under a rock.|مخفي
Correct|D|-|✔️|cor-rect|kuh-REKT|Right; with no mistakes.|Your answer is [correct].|صحيح
Clumsy|D|mv|🤸|clum-sy|KLUM-zee|Moving carelessly and often dropping or bumping things.|I was [clumsy] and dropped my cup.|أخرق
Finished|D|tc|🏁|fin-ished|FIN-isht|Done; complete.|My drawing is [finished].|منتهٍ
Improving|A|tc|📈|im-prov-ing|im-PROO-ving|Getting better.|Her reading is [improving] every week.|يتحسّن
Useful|D|ht|🔧|use-ful|YOOS-ful|Helping you do something.|A torch is [useful] in the dark.|مفيد
Accidentally|D|ht|💦|ac-ci-den-tal-ly|ak-si-DEN-tuh-lee|By mistake; not on purpose.|I [accidentally] spilled the juice.|دون قصد
Healthy|D|he|🍏|health-y|HEL-thee|Well and strong; not ill.|Eating fruit keeps you [healthy].|بصحة جيدة
Catch|A|mv|🧤|catch|KACH|To take hold of something moving through the air.|Can you [catch] the ball?|يلتقط
Awake|D|he|👀|a-wake|uh-WAYK|Not sleeping.|I was [awake] before the alarm rang.|مستيقظ
Independent|D|ch|🧗|in-de-pend-ent|in-di-PEN-dunt|Able to do things by yourself.|She is very [independent] and ties her own shoes.|مستقلّ
Formal|D|wb|🎩|for-mal|FOR-mul|Serious and polite, used in important places.|Write a [formal] letter to the mayor.|رسمي
Diurnal|D|an|🌞|di-ur-nal|dy-UR-nul|Awake and active during the day, asleep at night.|Squirrels are [diurnal] animals.|نهاري
Alone|D|ga|🧍|a-lone|uh-LOHN|Without other people.|The boy sat [alone] on the bench.|وحيد
Sow|A|na|🌱|sow|SOH|To put seeds in the ground so they grow.|Farmers [sow] seeds in spring.|يزرع / يبذر
Still|D|na|🪨|still|STIL|Not moving at all.|The lake was [still] and calm.|ساكن
Excitement|N|fe|🎉|ex-cite-ment|ik-SYT-munt|A happy feeling of being very eager.|We were full of [excitement] before the trip.|حماس
Scurrying|A|mv|🐁|scur-ry-ing|SKUR-ee-ing|Running with short, quick steps.|Mice were [scurrying] across the floor.|يهرول
Blame|A|ga|👉|blame|BLAYM|To say that something bad is someone's fault.|Don't [blame] your sister for your mess.|يلوم
"""

# 📶 meters: name -> ({rank: face}, [(word, rank), ...]). Feelings meters already exist; only new members are listed.
SCALES = {
  "Afraid → Calm": (None, [("Nervous", -2), ("Serene", 0)]),
  "Angry → Calm": (None, [("Serene", 0), ("Frustrated", -2), ("Pique", -2)]),
  "Sad ⇄ Happy":    (None, [("Depressed", -4), ("Delighted", 3), ("Exhilaration", 5)]),
  "Hate ⇄ Love":    (None, [("Appreciate", 1), ("Admire", 2)]),
  "Hungry → Full": (None, [("Starving", -5)]),
  "Tiny → Gigantic": ("🐜🐭🐕🐘🐋🦕", [("Tiny", 0), ("Small", 1), ("Big", 3), ("Huge", 4), ("Enormous", 4), ("Gigantic", 5)]),
  "Near → Far":      ("🏠🚶🚲🚗✈️🚀", [("Near", 0), ("Nearby", 1), ("Distant", 3), ("Faraway", 4), ("Remote", 5)]),
  "Deafening → Silent": ("🤫🔈🔉🔊📢💥", [("Silent", 0), ("Quiet", -1), ("Loud", -3), ("Booming", -4), ("Deafening", -5)]),
  "Deadly → Safe": ("😌🙂😬⚠️😱☠️", [("Safe", 0), ("Risky", -2), ("Precarious", -2), ("Dangerous", -3), ("Hazardous", -3), ("Life-threatening", -5), ("Deadly", -5)]),
  "Exhausted → Energetic": ("⚡🙂🥱😪😩😴", [("Energetic", 0), ("Rejuvenated", 0), ("Tired", -2), ("Lethargic", -3), ("Weary", -4), ("Exhausted", -5), ("Exhaustion", -5)]),
  "Boring → Thrilling": ("😴🥱🙂🤔🤩🎢", [("Monotonous", 0), ("Boring", 1), ("Interesting", 2), ("Intriguing", 3), ("Fascinating", 4), ("Thrilling", 5)]),
  "Okay → Fantastic": ("👌👍😀🌟✨🎉", [("Okay", 0), ("Good", 1), ("Great", 2), ("Wonderful", 3), ("Fabulous", 4), ("Fantastic", 5)]),
  "Filthy → Clean": ("✨🧼🤏🟤🐷🤢", [("Clean", 0), ("Dirty", -3), ("Grimy", -4), ("Filthy", -5)]),
  "Minor → Crucial": ("🤷🙂👀⭐🔑🚨", [("Minor", 0), ("Significant", 2), ("Important", 3), ("Essential", 4), ("Crucial", 5)]),
  "Unknown → Renowned": ("❓🙂👥📣🌟🏆", [("Unknown", 0), ("Well-known", 3), ("Famous", 4), ("Renowned", 5)]),
  "Common → Unique": ("👥🙂🤨💎🦄🌟", [("Common", 0), ("Unusual", 2), ("Rare", 3), ("Unique", 5)]),
  "Poor → Affluent": ("🪙💵💳🏠💰🏰", [("Poor", 0), ("Rich", 4), ("Wealthy", 4), ("Affluent", 5)]),
  "Timid → Heroic":  ("🫣🙂😤🦁💪🦸", [("Timid", 0), ("Brave", 3), ("Spunky", 3), ("Courageous", 4), ("Heroic", 5)]),
  "Dry → Soaked":    ("🏜️🌱🌫️💧🌧️🌊", [("Dry", 0), ("Moist", 1), ("Damp", 2), ("Wet", 3), ("Soaked", 5)]),
  "Dark → Dazzling": ("🌑🌒🌓💡☀️🌞", [("Dark", 0), ("Shadowy", 1), ("Dim", 1), ("Bright", 3), ("Dazzling", 5)]),
  "Disgusting → Delicious": ("🤮🤢😐😋🤤🤩", [("Disgusting", 0), ("Unpalatable", 1), ("Tasty", 3), ("Delicious", 4), ("Scrumptious", 5)]),
  "Ferocious → Gentle": ("🐑🐶🐱🐗🐺🦁", [("Gentle", 0), ("Wild", -3), ("Fierce", -4), ("Ferocious", -5)]),
  "Hurricane → Breeze": ("😌🍃💨🌬️🌪️🌀", [("Breeze", -1), ("Gust", -2), ("Gale", -4), ("Hurricane", -5)]),
  "Glance → Stare":  ("👀🫣👁️📺🔍😳", [("Glance", 0), ("Peep", 1), ("Look", 2), ("Watch", 3), ("Peers", 4), ("Observed", 4), ("Stare", 5)]),
  "Tiptoe → Stomp":  ("🤫🐭🚶🥁🐘🦖", [("Tiptoe", 0), ("Scampering", 1), ("Walk", 2), ("March", 3), ("Stomped", 5)]),
}

# ≈ similar words: group -> words (a family of words that mean nearly the same, or belong together)
SIM = {
  "Huge": "Gigantic Enormous Huge Big", "Tiny": "Tiny Small Narrow Thin", "Far away": "Distant Faraway Remote",
  "Dangerous": "Hazardous Precarious Life-threatening Dangerous Risky Deadly", "Tired": "Lethargic Tired Weary Exhausted Exhaustion",
  "Lively": "Rejuvenated Spunky Energetic", "Wonderful": "Fantastic Fabulous Wonderful Great", "Clever": "Smart Brilliant Clever",
  "Brave": "Heroic Spunky Brave Courageous", "Worried": "Nervous Worried Anxious Uneasy", "Sad": "Depressed Sad Miserable Gloomy",
  "Happy": "Delighted Pleased Cheerful Joyful", "Annoyed": "Frustrated Annoyed Irritated Cross Pique", "Annoy": "Annoy Irritate",
  "Calm": "Serene Calm Relaxed Peaceful", "Quiet": "Silent Quiet", "Look": "Glance Peep Peers Observed Watch Look Stare",
  "Help": "Assist Help", "Save": "Rescue Save", "Make": "Create Make Build", "Join": "Connect Join Link", "Allow": "Permit Allow",
  "Buy": "Purchase Buy", "Mistake": "Error Mistake", "Lucky": "Fortunate Lucky", "Clear": "Obvious Clear", "Dirty": "Filthy Dirty Grimy",
  "Graceful": "Elegant Graceful", "Rare": "Unusual Unique Rare Exotic", "Famous": "Renowned Well-known Famous",
  "Important": "Crucial Significant Important Essential", "Rich": "Affluent Rich Wealthy", "Selfish": "Selfish Greedy",
  "Interesting": "Intriguing Interesting Fascinating", "Boring": "Monotonous Boring", "Fierce": "Ferocious Fierce Wild",
  "Scary": "Horrific Frightening", "On purpose": "Deliberately Intentionally", "Without stopping": "Relentlessly Constantly",
  "Every time": "Consistently Always", "At the same time": "Simultaneously Meanwhile While", "It seems": "Apparently Seemingly",
  "Useless": "Futile Useless", "Getting worse": "Deteriorating Worsening", "Rot": "Decompose Rot", "Smell": "Aroma Scent",
  "Drink": "Beverage Tonic Drink", "Mixture": "Blend Concoction Mixture", "Peace": "Concord Harmony", "Area": "Region Precinct Area",
  "Live in": "Reside Dwell", "Move house": "Relocated Moved", "Wet": "Moist Damp Wet Soaked", "Living things": "Organism Species Creature Crustacean",
  "Scientist": "Entomologist Scientist", "Animal homes": "Kennel Cote Stable", "Songbirds": "Wren Lark", "Plants": "Fern Moss Reeds",
  "Branches": "Boughs Branches", "Shine": "Gleam Beam Glow", "Dark": "Shadowy Dark Dim", "Traveller": "Rover Traveller",
  "Friend": "Fellow Companion", "Group": "Company Group", "Bend down": "Stooping Couched Crouching", "Throw": "Toss Launch Throw",
  "Speed": "Pace Speed", "Swing": "Swayed Rocked", "Move back": "Withdrew Retreated", "Split": "Separated Divided",
  "Pretend": "Pretended Faked", "Think of": "Regarded Considered", "Guess": "Estimate Guess", "Honour": "Commemorate Honour",
  "Give a prize": "Bestowed Awarded", "Rudeness": "Insolence Insubordination Rudeness", "Disagree": "Clashing Arguing",
  "Value": "Appreciate Cherish", "Look up to": "Admire Respect", "Want": "Crave Desire", "Hit": "Whipped Hit",
  "Hurt badly": "Torture Torment", "Sick": "Ailing Sick", "Kindness": "Empathy Compassion Understanding", "Motivated": "Inspired Motivated",
  "Demanded": "Insisted Demanded", "Disgusting": "Unpalatable Disgusting", "Faithful": "Devout Faithful", "Everyday words": "Colloquial Informal",
  "Worn": "Weathered Worn", "Agreed": "Ratified Approved", "Leaders": "Senator Chieftainship", "Rubbish dump": "Landfill Dump",
  "Beast": "Beast Creature", "Printed": "Published Printed", "Other names": "Pseudonym Nicknamed", "Unfinished": "Unfinished Incomplete",
  "Nature": "Ecological Environmental", "Shedding": "Molting Shedding", "Money keeper": "Bookkeeper Accountant", "Shoes": "Shoon Shoes",
  "Under": "Beneath Under", "Effect": "Impact Effect", "Stood for": "Symbolized Represented", "Slept": "Dozed Napped",
  "Hungry": "Starving Famished Ravenous Hungry", "Parts of a house": "Casements Thatch Windowsill",
  "Wind": "Gust Breeze Gale Hurricane", "Heavy steps": "Stomped March",
  "Tasty": "Tasty Delicious Scrumptious", "Old ways": "Traditional Classics", "Excitement": "Exhilaration Excitement", "Hurrying": "Scampering Scurrying", "Soft sounds": "Rustled Sigh", "Known well": "Familiar Well-known", "Short forms": "Abbreviation Department_(Dept.)"
}

# ⇄ opposites: "A vs. B" -> {side: words}
OPP = {
  "Big vs. small": {"big": "Gigantic Enormous Huge Big", "small": "Wren Lark Narrow Tiny Small Thin"},
  "Near vs. far": {"near": "Near Nearby", "far": "Distant Faraway Remote"},
  "Safe vs. dangerous": {"safe": "Safe", "dangerous": "Hazardous Precarious Life-threatening Risky Dangerous Deadly"},
  "Tired vs. full of energy": {"tired": "Tired Weary Exhausted Dozed", "full of energy": "Energetic Rejuvenated Spunky"},
  "Exciting vs. dull": {"exciting": "Interesting Fascinating Thrilling Intriguing", "dull": "Boring Monotonous"},
  "Happy vs. upset": {"happy": "Cheerful Joyful Delighted", "upset": "Sad Miserable Depressed Frustrated"},
  "Brave vs. scared": {"brave": "Brave Courageous Heroic", "scared": "Timid Scared Frightened Nervous"},
  "Loud vs. quiet": {"loud": "Loud Booming Deafening Stomped", "quiet": "Quiet Silent Tiptoe"},
  "Kind vs. unkind": {"kind": "Kind Compassion", "unkind": "Greedy Selfish"},
  "Common vs. rare": {"common": "Common Familiar", "rare": "Rare Unique Unusual"},
  "Light vs. dark": {"light": "Bright Dazzling Glow", "dark": "Dark Dim Shadowy"},
  "Nice vs. nasty": {"nice": "Tasty Delicious", "nasty": "Disgusting Unpalatable"},
  "Clean vs. dirty": {"clean": "Clean", "dirty": "Filthy Dirty Grimy"},
  "Wet vs. dry": {"wet": "Moist Damp Wet Soaked", "dry": "Dry"},
  "Rich vs. poor": {"rich": "Affluent Rich Wealthy", "poor": "Poor"},
  "Famous vs. unknown": {"famous": "Renowned Well-known Famous", "unknown": "Unknown"},
  "Important vs. minor": {"important": "Crucial Significant Important Essential", "minor": "Minor"},
  "Calm vs. angry": {"calm": "Serene Calm Peaceful", "angry": "Frustrated Annoyed Angry Pique"},
  "Smart vs. foolish": {"smart": "Smart Brilliant Clever", "foolish": "Foolish"},
  "Lucky vs. unlucky": {"lucky": "Fortunate Lucky", "unlucky": "Unlucky"},
  "Allow vs. forbid": {"allow": "Permit Allow", "forbid": "Forbid"},
  "Make vs. destroy": {"make": "Create Make Build", "destroy": "Destroy"},
  "Join vs. separate": {"join": "Connect Join Link", "separate": "Separated Divided"},
  "Buy vs. sell": {"buy": "Purchase Buy", "sell": "Sell"},
  "Clear vs. hidden": {"clear": "Obvious Clear", "hidden": "Hidden"},
  "Right vs. wrong": {"right": "Correct", "wrong": "Error Mistake"},
  "Gentle vs. fierce": {"gentle": "Gentle", "fierce": "Ferocious Fierce Wild"},
  "Graceful vs. clumsy": {"graceful": "Elegant Graceful", "clumsy": "Clumsy"},
  "Above vs. below": {"above": "Above", "below": "Beneath Under"},
  "Most vs. fewest": {"most": "Majority", "fewest": "Minority"},
  "Finished vs. unfinished": {"finished": "Finished", "unfinished": "Unfinished Incomplete"},
  "Better vs. worse": {"better": "Improving Rejuvenated", "worse": "Deteriorating Worsening"},
  "Useful vs. useless": {"useful": "Useful", "useless": "Futile Useless"},
  "On purpose vs. by accident": {"on purpose": "Deliberately Intentionally", "by accident": "Accidentally"},
  "Old vs. new": {"old": "Traditional Weathered Worn", "new": "Modern"},
  "Agree vs. disagree": {"agree": "Concord Harmony Ratified Approved", "disagree": "Clashing Arguing"},
  "Healthy vs. sick": {"healthy": "Healthy Tonic", "sick": "Ailing Sick"},
  "Throw vs. catch": {"throw": "Toss Throw Launch", "catch": "Catch"},
  "Asleep vs. awake": {"asleep": "Dozed Napped", "awake": "Awake"},
  "Needing help vs. independent": {"needing help": "Dependent", "independent": "Independent"},
  "Everyday vs. formal": {"everyday": "Colloquial Informal", "formal": "Formal"},
  "Say sorry vs. blame": {"say sorry": "Apologize", "blame": "Blame"},
  "Polite vs. rude": {"polite": "Respect Admire", "rude": "Insolence Insubordination Rudeness"},
  "Help vs. hurt": {"help": "Assist Help Rescue Save", "hurt": "Torture Torment Whipped Hit"},
  "Want vs. don't care": {"want": "Crave Desire Curiosity", "don't care": "Indifferent"},
  "Pretend vs. true": {"pretend": "Pretended Faked", "true": "Sincerity"},
  "Hungry vs. full": {"hungry": "Starving Hungry Famished Ravenous", "full": "Full"},
  "Quick look vs. long look": {"quick look": "Glance Peep", "long look": "Stare Watch Observed Peers"},
  "Together vs. alone": {"together": "Company Fellow Companion Group", "alone": "Alone"},
  "Sow vs. harvest": {"sow": "Sow", "harvest": "Harvest"},
  "Flowing vs. still": {"flowing": "Flowing Swayed", "still": "Still"},
  "Night vs. day": {"night": "Nocturnal", "day": "Diurnal"},
  "Move closer vs. move away": {"move closer": "Connect", "move away": "Withdrew Retreated Relocated"},
}
