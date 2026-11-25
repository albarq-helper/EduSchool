# v66: ≠ Not the same — words people mix up, each with what makes it different (Arabic notes from Ab's list)
q = lambda s: "null" if s is None else "'" + str(s).replace("'", "''") + "'"
UNITS = [(1, "💞 Feelings & relationships"), (2, "🧠 Mind & knowledge"), (3, "🏠 Family, school & character"), (4, "⚖️ Fairness, law & society"), (5, "🔬 Body & science"), (6, "🕌 Faith & beliefs")]
# (key, unit, min_age, title, summary, summary_ar, example, note, parts[(headword, emoji, explanation, arabic)])
D = [
 ("painter-artist", 3, 0, "Painter ≠ Artist", "A painter copies the world onto the canvas; an artist shows how they see the world.", "الرسام ينقل صورة من العالم إلى لوحته، أما الفنان فينقل تصوّره للعالم عبر فنّه.",
  "Anyone can learn to paint a bowl of fruit; an artist makes you feel something about it.", None,
  [("Painter", "🖌️", "Someone who paints pictures: puts what they see onto the canvas.", "رسّام"), ("Artist", "🎨", "Someone who shows their own way of seeing the world through art.", "فنّان")]),
 ("past-history", 3, 0, "Past ≠ History", "The past is what happened and is closed; history is the open page we still read and learn from.", "الماضي مراحل وقضايا مضت وطويت صفحتها، أما التاريخ فصفحة مفتوحة مهما بلغ قدمها.",
  "My past is my own; history is what everyone can learn from.", None,
  [("Past", "⏮️", "The time and events that are over.", "الماضي"), ("History", "📜", "The story of the past that we keep studying and learning from.", "التاريخ")]),
 ("love-affection", 1, 0, "Love ≠ Affection", "Love is a feeling; affection (مودّة) is how you behave: kind, warm actions. Good people stay kind even when the feeling fades.", "الحب شعور بينما المودّة سلوك؛ الأنقياء إن فقدوا شعور الحب مارسوا سلوكهم الودود.",
  "Even on days she was angry with her brother, she still treated him with affection.", None,
  [("Love", "❤️", "A strong feeling of caring about someone.", "الحب"), ("Affection", "🤗", "Kind, warm behaviour towards someone: what love looks like in action.", "المودّة")]),
 ("hatred-hostility", 1, 0, "Hatred ≠ Hostility", "Hatred is a feeling; hostility is behaviour. You can dislike someone without acting against them.", "الكراهية شعور والعداوة سلوك؛ إن شعرت بالكراهية تجاه أحد فليس بالضرورة أن تمارس العداوة ضده.",
  "He didn't like his rival, but he never showed hostility.", None,
  [("Hatred", "😠", "A strong feeling of dislike.", "الكراهية"), ("Hostility", "⚔️", "Acting against someone: unfriendly or aggressive behaviour.", "العداوة")]),
 ("care-upbringing", 3, 0, "Care ≠ Upbringing", "Care gives food, clothes and safety; upbringing prepares a child to face life's challenges alone.", "الأكل واللبس الجيد رعاية؛ أما التربية فهي الإعداد والتأهيل لمواجهة تحديات الحياة منفردًا.",
  "Good food and clothes are care; teaching a child to solve problems is upbringing.", None,
  [("Care", "🍲", "Looking after someone's needs: food, clothes, health, safety.", "الرعاية"), ("Upbringing", "🌱", "Raising a child to become able to face life on their own.", "التربية")]),
 ("feeling-emotion-drive-sensation", 1, 10, "Sensation ≠ Feeling ≠ Emotion ≠ Drive", "In everyday talk we mix them; in science they differ, and different parts of the brain handle them.", "في اللغة نخلط بينها، لكن في الأوساط العلمية هناك فرق بين الحواس والإحساس والشعور والغريزة، ولكل منها مناطق في الدماغ.",
  "Cold air on your skin is a sensation; feeling uneasy is a feeling; fear is an emotion; hunger is a drive.",
  "Scientists use these terms in slightly different ways; this is a common way to separate them.",
  [("Sensation", "👆", "What the senses pick up: heat, light, sound, touch.", "الحس (الحواس)"), ("Feeling", "🌤️", "What you notice inside yourself: the inner experience of your body or mood.", "الإحساس"),
   ("Emotion", "🎭", "A strong reaction like fear, anger or joy, with changes in the body and face.", "الشعور (العاطفة)"), ("Drive", "🍽️", "A natural push to meet a need: hunger, thirst, sleep.", "الغريزة (الدافع)")]),
 ("reward-bribe", 3, 0, "Reward ≠ Bribe", "A reward thanks someone for effort after the good deed, from strength; a bribe pays someone to act for you or to stop something bad, from weakness.", "المكافأة تقدير يُمنح عرفانًا بجهد أو إنجاز ويُقدّم في لحظة قوة؛ أما الرشوة فوسيلة لحثّ شخص على التصرف لصالحك أو استرجاء إيقاف عمل سيئ، وتُقدّم في لحظة ضعف.",
  "\"Well done, here's a sticker\" is a reward; \"Stop crying and I'll give you sweets\" is a bribe.", None,
  [("Reward", "🏅", "Something given to thank someone for effort or a good result.", "المكافأة"), ("Bribe", "💰", "Something given to make someone act the way you want, or to stop doing something bad.", "الرشوة")]),
 ("suspicion-caution", 2, 0, "Suspicion ≠ Caution", "Suspicion is a gut feeling (or, when constant, a problem); caution is a decision to trust only after experience.", "الشك حدس أو مرض، أما عدم الوثوق إلا بالتجربة فهو قرار.",
  "Checking a new friend's promise is caution; believing everyone is lying is suspicion.", None,
  [("Suspicion", "🕵️", "A feeling that someone may be doing something wrong, often without proof.", "الشك"), ("Caution", "🛑", "Choosing to wait and see before you trust.", "الحذر (الوثوق بالتجربة)")]),
 ("firm-rude", 3, 0, "Firm ≠ Rude", "A strong personality is confident, clear and knows the limits, and can change its mind without losing respect; rudeness doesn't care about others' feelings and tries to put them down.", "قوي الشخصية يملك الثقة والحزم والوضوح ومعرفة الحدود، والتراجع عن قراره لا يمس هيبته؛ أما قلة الأدب فعدم اكتراث بمشاعر الآخرين وسعي لإهانتهم برفع الصوت وحدّة النبرة.",
  "\"No, I won't do that\" said calmly is firm; shouting insults is rude.", None,
  [("Firm", "🦁", "Confident and clear about what you will and won't do, while staying respectful.", "حازم (قوي الشخصية)"), ("Rude", "🙊", "Not polite: not caring about other people's feelings.", "قليل الأدب")]),
 ("hypersensitive-empathic", 1, 12, "Hypersensitive ≠ Empathic", "Both are \"sensitive\", but in opposite directions: the hypersensitive person reads everything as being about themselves (praise or insult); the empathic person is sensitive to others.", "الحساسية موجودة عند المضطربين والمتعاطفين؛ المضطرب حساسيته تجاه ذاته فيفسّر كل شيء إطراءً أو إهانة، والمتعاطف حساسيته تجاه الآخرين. والمفارقة أن المتلاعب يهوّن من أفعاله تجاه ضحيته بقوله: أنت حساس.",
  "She noticed her friend was sad (empathic); he thought every joke was about him (hypersensitive).",
  "Manipulators often dismiss their victims with \"You're too sensitive\".",
  [("Hypersensitive", "🌵", "Takes things too personally; reads events as about themselves.", "شديد الحساسية تجاه ذاته"), ("Empathic", "💗", "Feels and understands what other people feel.", "متعاطف")]),
 ("acceptance-indifference", 1, 10, "Acceptance ≠ Indifference", "Acceptance takes part in life without trying to control everything, with hope and calm; indifference gives up, with despair. In a river: fighting the current is not accepting; swimming with it to safety is acceptance; letting it carry you away is indifference.", "القبول هو الانخراط في الحياة دون محاولة إخضاعها ويرافقه أمل وهدوء؛ أما اللامبالاة فأهم سماتها اليأس. في النهر: السباحة ضد التيار عدم قبول، والسباحة معه نحو النجاة قبول، والاستسلام للمصير لامبالاة.",
  "After losing the match she accepted it and trained harder; he just stopped caring.", None,
  [("Acceptance", "🌊", "Calmly taking life as it is, while still hoping and acting.", "القبول"), ("Indifference", "😶", "Not caring any more; giving up.", "اللامبالاة")]),
 ("letter-spirit-law", 4, 12, "Letter of the law ≠ Spirit of the law", "The letter of the law is its exact words; the spirit of the law is the purpose behind them.", "هناك فرق بين تطبيق نص القانون وروح القانون.",
  "\"No vehicles in the park\": an ambulance breaks the letter but not the spirit of the rule.", None,
  [("Letter of the law", "📃", "Following the exact words of a rule.", "نص القانون"), ("Spirit of the law", "🕊️", "Following what the rule was made for.", "روح القانون")]),
 ("explanation-justification", 2, 10, "Explanation ≠ Justification", "Explaining says how and why something happened; justifying says it was right or acceptable.", "التفسير يبيّن كيف ولماذا وقع الأمر، والتبرير يجعله مقبولًا؛ الباحث الجنائي يفسّر الجريمة من حيث الأداة والطريقة والدافع لكنه لا يبرّرها.",
  "A detective explains how a crime happened but doesn't justify it.", None,
  [("Explanation", "🔍", "Saying how and why something happened.", "التفسير"), ("Justification", "🛡️", "Giving reasons why something was right or acceptable.", "التبرير")]),
 ("pleasure-happiness", 1, 0, "Pleasure ≠ Happiness", "Pleasure is a short feeling; happiness is a lasting feeling that flows from inside.", "اللذة شعور مؤقت، أما السعادة فشعور دائم متدفق من الداخل.",
  "A sweet gives pleasure for a minute; a loving family gives happiness for years.",
  "Popular science links pleasure with dopamine and calm well-being with serotonin; real brain chemistry is more mixed than that.",
  [("Pleasure", "🍬", "A good feeling that comes quickly and goes quickly.", "اللذة"), ("Happiness", "🌞", "A deep, lasting feeling of being well and content.", "السعادة")]),
 ("citizenship-nationality", 4, 12, "Citizenship ≠ Nationality", "Citizenship (التابعية) is the legal tie between a person and a state; nationality is belonging to a nation or people.", "التابعية كلمة دقيقة قانونيًا تعني أن المواطن تابع لهذه الدولة سياسيًا، والجنسية تعني أن تكون فردًا من أمة أو قومية.",
  "His passport shows his citizenship; his nationality is the people he belongs to.", "In everyday English the two words are often used the same way.",
  [("Citizenship", "🛂", "Being officially a member of a country, with its rights and duties.", "التابعية (المواطنة)"), ("Nationality", "🏳️", "Belonging to a nation or people.", "الجنسية (القومية)")]),
 ("envy-jealousy", 1, 7, "Envy ≠ Jealousy", "Envy is hostile and wants to destroy; jealousy is about love. Envy is between two people; jealousy involves a third. Envy heals by building yourself; jealousy by talking.", "الحسد مشاعر عدائية قائمة على التدمير بينما الغيرة محورها الحب؛ الحسد بين طرفين والغيرة علاقة مع طرف ثالث؛ الحسد يعالج ببناء الذات والغيرة بالحوار.",
  "Wanting your friend's prize is envy; fearing a new girl will take your best friend is jealousy.", None,
  [("Envy", "💚", "Wanting what someone else has, even wishing they lost it.", "الحسد"), ("Jealousy", "🫣", "Fear of losing someone you love to another person.", "الغيرة")]),
 ("knowledge-awareness", 2, 10, "Knowledge ≠ Awareness", "Knowledge tells right from wrong; awareness is acting for your far goal even when it goes against what you want now.", "المعرفة في تحديد الصواب من الخطأ، والوعي في قدرتك على تحقيق غايتك البعيدة حتى وإن تعارضت مع رغبتك الحالية.",
  "You know kunafa is tasty but unhealthy (knowledge); you skip it for your health (awareness).", None,
  [("Knowledge", "📚", "Knowing facts and what is right or wrong.", "المعرفة"), ("Awareness", "🧭", "Acting wisely for your long-term goal, not just the wish of the moment.", "الوعي")]),
 ("believe-convinced", 2, 10, "Believe ≠ Be convinced", "Believing someone is a decision and needs no proof; being convinced is a result, built on evidence.", "التصديق قرار وليس بالضرورة له برهان، بينما الاقتناع نتيجة مبنية على الأدلة.",
  "\"Did you take my pen?\" \"No.\" Believing him is a decision; seeing the pen in your bag convinces you.", None,
  [("Believe", "🤝", "To accept that something is true, often as a choice to trust.", "التصديق"), ("Convinced", "✔️", "Sure, because the evidence showed it.", "مقتنع")]),
 ("atheism-agnosticism", 6, 14, "Atheism ≠ Agnosticism", "Atheism is about belief (believing there is no god); agnosticism is about knowledge (holding that we can't know).", "الإلحاد يخصّ الإيمان، بينما اللاأدرية تخصّ المعرفة.",
  None, None,
  [("Atheism", "⭕", "The belief that there is no god.", "الإلحاد"), ("Agnosticism", "❔", "The view that people cannot know whether God exists.", "اللاأدرية")]),
 ("infatuation-love", 1, 12, "Infatuation ≠ Love", "Infatuation is liking someone because they seem perfect; love is knowing they are not perfect and staying.", "الافتتان ميلك لشخص بسبب مثاليته، بينما الحب معرفتك بعدم مثالية هذا الإنسان واستمرارك.",
  None, None,
  [("Infatuation", "😍", "A strong but short attraction to someone who seems perfect.", "الافتتان"), ("Love", "❤️", "A strong feeling of caring about someone.", "الحب")]),
 ("observation-judgement", 2, 10, "Observation ≠ Judgement", "First notice, then judge: two steps to keep apart. The immature rush to judge and hurt themselves and others; doctors, engineers, programmers and judges train to separate them.", "الملاحظة من جهة والتقييم/الحكم من جهة أخرى مرحلتان يجب الفصل بينهما، وهي مهارة من صميم الطب والهندسة والبرمجة والقضاء؛ وغير الناضج يسارع لإطلاق الأحكام.",
  "\"He didn't say hello\" is an observation; \"He's rude\" is a judgement.", None,
  [("Observation", "👀", "Noticing what happened, without deciding good or bad.", "الملاحظة"), ("Judgement", "⚖️", "Deciding whether something or someone is good or bad.", "الحكم (التقييم)")]),
 ("manage-solve", 2, 10, "Managing a problem ≠ Solving a problem", "Some problems are solved and gone; others, like many illnesses, are managed by keeping them under control.", "بعض المشاكل لا تُحل وإنما تُدار مثل الأمراض؛ فكرة \"القضاء على\" غير واقعية أحيانًا، بل التحكم بمستويات.",
  "You solve a puzzle; you manage asthma.", None,
  [("Solve", "🧩", "To find the answer so the problem is gone.", "حلّ المشكلة"), ("Manage", "🎛️", "To keep a problem under control when it can't be ended.", "إدارة المشكلة")]),
 ("forgive-group", 1, 10, "Pardon ≠ Forgive ≠ Overlook ≠ Absolve", "Four steps of letting go: pardon drops the punishment; forgive lets go of anger; overlook turns the page with no blame left; absolve wipes the wrong away completely (in faith, God's forgiveness).", "هناك فرق بين العفو والمسامحة والصفح والغفران.",
  None, "Arabic draws finer lines here than English does.",
  [("Pardon", "🕊️", "To cancel a punishment you had the right to give.", "العفو"), ("Forgive", "🤲", "To stop being angry with someone for a wrong.", "المسامحة"),
   ("Overlook", "📖", "To turn the page and not hold the wrong against someone at all.", "الصفح"), ("Absolve", "✨", "To free someone completely from blame or sin.", "الغفران")]),
 ("success-flourishing", 3, 10, "Success ≠ Flourishing", "Success reaches a goal; flourishing (فلاح) is lasting goodness in your whole life, and in faith, beyond it.", "هناك فرق بين النجاح والفلاح.",
  "Winning the race is success; being a good, happy person for life is flourishing.", None,
  [("Success", "🏆", "Reaching the goal you wanted.", "النجاح"), ("Flourishing", "🌳", "Living well and growing in goodness, now and in the long run.", "الفلاح")]),
 ("result-outcome", 2, 10, "Result ≠ Outcome", "The result is what you win or lose at the end; the outcome is where it leaves you afterwards.", "نتيجة الحرب الانتصار أما المآل فخراب في كل الديار؛ نتيجة القضية الربح أما المآل فافتقاد المميزات التي كنت تتمتع بها قبلها.",
  "The result of the war was victory; the outcome was ruined cities.", None,
  [("Result", "🎯", "What happens at the end of something: win, lose, score.", "النتيجة"), ("Outcome", "🌄", "The longer-term effect of what happened.", "المآل")]),
 ("hard-tough-stiff", 5, 10, "Hard ≠ Tough ≠ Stiff", "In materials: hard resists scratches and dents; tough absorbs hits without breaking; stiff resists bending.", "هناك فرق بين الصلادة والمتانة والصلابة.",
  "Glass is hard but not tough (it shatters); rubber is tough but not hard; steel is stiff.", None,
  [("Hard", "💎", "Difficult to scratch or dent (like diamond or glass).", "صلد (الصلادة)"), ("Tough", "🛞", "Takes hits and bends without breaking (like rubber or leather).", "متين (المتانة)"),
   ("Stiff", "📏", "Hard to bend (like a steel bar).", "صُلب (الصلابة)")]),
 ("muscle-mass-strength", 5, 10, "Muscle mass ≠ Muscle strength", "Muscle mass is how much muscle you have; strength is how much force it can make. Big muscles aren't always the strongest.", "هناك فرق بين الكتلة العضلية والقوة العضلية.",
  None, None,
  [("Muscle mass", "💪", "How much muscle the body has.", "الكتلة العضلية"), ("Muscle strength", "🏋️", "How much force the muscles can produce.", "القوة العضلية")]),
 ("news-opinion", 2, 0, "News ≠ Opinion", "News is what happened; opinion is what someone thinks about it. Professional media keep the news neutral.", "استقالة الوزير خبر، و\"غير مهم للغاية\" رأي؛ والحياد في الخبر منهج الإعلام المحترف.",
  "\"The minister resigned\" is news; \"It doesn't matter at all\" is opinion.", None,
  [("News", "📰", "Information about something that happened.", "الخبر"), ("Opinion", "💭", "What a person thinks or feels about something.", "الرأي")]),
 ("intuition-inference", 2, 10, "Intuition ≠ Inference", "Intuition comes from silent experience and unconscious processing, and is hard to explain; inference is a logical step from information you have.", "الحدس نتيجة خبرة صامتة ومعالجة غير واعية يصعب التعبير عنها منطقيًا؛ أما البديهة فمنطقية وتأتي بعد تفكير في معلومات موجودة.",
  "\"Something feels wrong here\" is intuition; \"The ground is wet, so it rained\" is inference.", None,
  [("Intuition", "✨", "Knowing something without being able to say how, from experience.", "الحدس"), ("Inference", "🔗", "A conclusion you reach by reasoning from facts.", "الاستنتاج (البديهة)")]),
 ("sex-gender", 5, 14, "Sex ≠ Gender", "Sex is about the body (biology); gender is about the roles and identity a society links with being a woman or a man. People disagree about how these relate.", "هناك فرق بين Sex وGender.",
  None, "A debated topic; the definitions here are the common dictionary ones.",
  [("Sex (biology)", "🧬", "Whether a body is female or male, by biology.", "الجنس البيولوجي"), ("Gender", "👥", "The roles and identity a society links with being a woman or a man.", "النوع الاجتماعي")]),
 ("cure-treatment", 5, 10, "Cure ≠ Treatment", "A cure ends the illness; a treatment helps or controls it. \"A treatment that wipes out cancer\" is not an accurate phrase in medicine.", "عبارة \"علاج يقضي على السرطان\" ليست دقيقة في الطب، فهناك فرق بين Cure وTreatment.",
  "Antibiotics can cure an infection; insulin treats diabetes.", None,
  [("Cure", "✅", "Something that makes an illness go away for good.", "الشفاء (العلاج الشافي)"), ("Treatment", "💊", "Care or medicine that helps with an illness.", "العلاج")]),
 ("ruling-fatwa", 6, 12, "Ruling ≠ Fatwa", "A ruling (حكم) is religion's general position on a matter; a fatwa is religion's position for a particular person in their situation.", "الحكم موقف الدين العام من الأمر، أما الفتوى فموقف الدين من الفرد في هذا الأمر.",
  "Ruling: anything that clouds the mind is forbidden. Fatwa: a patient in surgery may receive anaesthesia as needed.", None,
  [("Ruling", "📖", "The general religious judgement on a matter.", "الحكم"), ("Fatwa", "🗣️", "A scholar's answer for a person's specific situation.", "الفتوى")]),
 ("leadership-control", 3, 10, "Leadership ≠ Control", "Control comes from fear, not strength; leadership leaves room for each person to play their full part.", "السيطرة ليست نابعة من قوة بل من خوف، والقيادية ليست كلها مركزية؛ هناك مساحة يجب أن تترك للطرفين ليأخذا أدوارهما.",
  "A leader asks \"How would you do it?\"; a controller says \"Do it exactly my way.\"", None,
  [("Leadership", "🧭", "Guiding people while trusting them with their part.", "القيادة"), ("Control", "🎮", "Making others do everything your way, often out of fear.", "السيطرة")]),
 ("expectation-hope", 1, 10, "Expectation ≠ Hope", "Expectations are fixed scripts that end in satisfaction or letdown; hope is flexible and open, giving things time to improve.", "التوقعات أشياء جامدة وسيناريوهات محددة تنتهي برضا أو خيبة، بينما الأمل حياة ومرونة وواقعية ومستقبل مفتوح غير مرتبط بخبراتك السابقة.",
  "Expecting a perfect birthday sets you up to be let down; hoping for a nice one leaves room for joy.", None,
  [("Expectation", "📋", "A fixed idea of exactly what should happen.", "التوقعات"), ("Hope", "🌱", "Wishing and trusting that good things can come, with an open mind.", "الأمل")]),
 ("knowledge-wisdom", 2, 0, "Knowledge ≠ Wisdom", "Knowledge is what you say; wisdom is when you say it.", "إن كانت المعرفة في ما تقوله، فإن الحكمة في متى تقوله.",
  "Knowing a funny story is knowledge; not telling it at a funeral is wisdom.", None,
  [("Knowledge", "📚", "Knowing facts and what is right or wrong.", "المعرفة"), ("Wisdom", "🦉", "Knowing what to do, and when and how to do it.", "الحكمة")]),
 ("expression-insult", 4, 10, "Freedom of expression ≠ Freedom to insult", "You are free to share your ideas; that doesn't make it right to insult or humiliate people.", "هناك فرق بين حرية التعبير وحرية الإساءة.",
  None, None,
  [("Freedom of expression", "🗨️", "The right to share your thoughts and opinions.", "حرية التعبير"), ("Insult", "🗯️", "Words or actions meant to hurt or shame someone.", "الإساءة")]),
 ("mood-depression-complaining", 1, 10, "A low mood ≠ Depression ≠ A complaining habit", "A low mood passes; depression is a medical condition (low most days for weeks, with lost interest) that doctors can help; someone in hard times is reacting to real trouble; a chronic complainer complains about everything, from waking up early as a child to bills as an adult.", "هناك فرق بين حالات مزاجية عابرة، وبين شخص دومًا مكتئب، وشخص يمر بظروف صعبة، وشخص دومًا متحلطم؛ المتحلطم الصغير يصبح متحلطمًا كبيرًا ثم عجوزًا.",
  None, None,
  [("Low mood", "🌧️", "Feeling sad or down for a short time.", "مزاج عابر"), ("Depression", "🩺", "A medical condition: low mood and lost interest most days for weeks.", "الاكتئاب"),
   ("Complainer", "😒", "Someone who always complains, whatever happens.", "المتحلطم")]),
 ("teaching-learning-upbringing", 3, 10, "Teaching ≠ Learning ≠ Upbringing", "Teaching is what the teacher gives; learning is what the student actually takes in; upbringing shapes character and values.", "هناك فرق بين التعليم والتعلّم والتربية؛ الوزارات تتجه نحو التعليم، والمدرسون يمتعضون من التربية، أما التعلّم فقد يهزّ المنظومة كلها.",
  "A class can be taught all day and still learn nothing.", None,
  [("Teaching", "🧑‍🏫", "Giving knowledge or skills to others.", "التعليم"), ("Learning", "🧠", "Taking in knowledge or skills yourself.", "التعلّم"), ("Upbringing", "🌱", "Raising a child to become able to face life on their own.", "التربية")]),
 ("organized-tidy", 3, 0, "Organized ≠ Tidy", "Organizing places things in the best way to use them (efficiency); tidying puts them back in their places (how it looks).", "التنظيم توزيع المحتويات التوزيع الأمثل لاستخدام كفؤ وهو دال على الكفاءة، أما الترتيب فالمحافظة على وضع الأشياء أماكنها ويتعلق بالمنظر.",
  "I'm not always tidy, but I'm organized: I know where everything is.", None,
  [("Organized", "🗂️", "Arranged in a smart way so things are easy to find and use.", "منظَّم"), ("Tidy", "🧹", "Neat, with everything in its place.", "مرتَّب")]),
 ("projection-rationalization", 2, 12, "Projection ≠ Rationalization", "Projection unconsciously sticks your own fault on others; rationalization is lying to yourself with good-sounding reasons. Arabs say: رمتني بدائها وانسلّت (she threw her own illness at me and slipped away).", "الإسقاط آلية دفاعية يلصق فيها الشخص عيبه بالآخرين لا شعوريًا، أما التبرير فعملية كذب على النفس. تقول العرب: رمتني بدائها وانسلّت.",
  "The lazy one calling others lazy is projection; \"I skipped training because rest is healthy\" is rationalization.", None,
  [("Projection", "📽️", "Blaming others for your own faults or feelings, without noticing.", "الإسقاط"), ("Rationalization", "🧴", "Giving yourself nice-sounding reasons for something you know isn't right.", "التبرير (خداع النفس)")]),
 ("equity-equality", 4, 10, "Equity ≠ Equality", "Equality gives everyone the same; equity gives each person what they need for a fair result.", "المساواة تركّز على العدالة في التوزيع بغض النظر عن الفروقات، أما الإنصاف فيركّز على عدالة النتائج؛ المساواة لا تعني الإنصاف.",
  "Same-size boxes for everyone to see over a fence is equality; different boxes so everyone can see is equity.", None,
  [("Equality", "🟰", "Everyone gets exactly the same.", "المساواة"), ("Equity", "⚖️", "Everyone gets what they need for a fair outcome.", "الإنصاف")]),
 ("legal-legitimate", 4, 12, "Legal ≠ Legitimate", "Legal means allowed by the law; legitimate means justified or acceptable. They usually match, but not always, and courts decide cases like self-defence.", "هناك فرق بين المشروعية والشرعي (القانوني)؛ قد يكون لك حق الدفاع عن النفس، لكن الفعل نفسه يقيّمه القانون حسب الظروف.",
  "Defending yourself can be legitimate; whether a particular act was legal is for a court to decide.", None,
  [("Legal", "📜", "Allowed by the law.", "قانوني (شرعي)"), ("Legitimate", "✔️", "Fair, reasonable or justified.", "مشروع")]),
]
out = ["""-- =====================================================================
-- Helper Academy — v66: ≠ Not the same — words people mix up, and what makes each one different
--   word_differences (title, summary EN + AR, example, note, min age) and word_difference_parts (each word with its own explanation)
--   missing words are added to the dictionary; every word gets a tag "≠ <title>"; new set "Not the Same: Words People Mix Up"
-- Built by tools/words/build_v66.py. Safe to re-run.
-- =====================================================================
create table if not exists public.word_differences (key text primary key, title text not null, unit int not null default 1, min_age int not null default 0,
  summary text, summary_ar text, example text, note text, position int not null default 0);
create table if not exists public.word_difference_parts (diff_key text not null references public.word_differences(key) on delete cascade,
  word_id uuid not null references public.words(id) on delete cascade, explain text, explain_ar text, position int not null default 0, primary key (diff_key, word_id));
alter table public.word_differences enable row level security; alter table public.word_difference_parts enable row level security;
grant select on public.word_differences, public.word_difference_parts to anon, authenticated;
drop policy if exists "read differences for my age" on public.word_differences; create policy "read differences for my age" on public.word_differences for select using (min_age <= public.viewer_age());
drop policy if exists "read difference parts" on public.word_difference_parts; create policy "read difference parts" on public.word_difference_parts for select using (true);
insert into public.study_sets (id, owner_id, author_name, institution_id, subject_id, level_code, title, description, language, translation_lang, units, visibility, story_box)
select '00000000-0000-4000-8000-00000000d1ff', (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com'), 'Ab', null, 1, 'any',
  'Not the Same: Words People Mix Up', 'Pairs of words that look alike but mean different things (painter / artist, love / affection, reward / bribe), each with what makes it different.', 'en', 'ar',
  '""" + "[" + ",".join(f'{{"u": {u}, "name": "{n}"}}' for u, n in UNITS) + """]'::jsonb, 'public', 'words'
on conflict (id) do update set title = excluded.title, description = excluded.description, units = excluded.units;
"""]
pos = 0
for p, (key, unit, ma, title, summ, summ_ar, ex, note, parts) in enumerate(D):
    tag = "≠ " + title
    out.append(f"insert into public.word_differences (key, title, unit, min_age, summary, summary_ar, example, note, position) values ({q(key)},{q(title)},{unit},{ma},{q(summ)},{q(summ_ar)},{q(ex)},{q(note)},{p}) on conflict (key) do update set title=excluded.title, unit=excluded.unit, min_age=excluded.min_age, summary=excluded.summary, summary_ar=excluded.summary_ar, example=excluded.example, note=excluded.note, position=excluded.position;")
    for n, (hw, emo, expl, ar) in enumerate(parts):
        pos += 1
        out.append(f"""insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id, min_age)
select 'en', {q(hw)}, '', {q(expl)}, '', {q(ar)}, '', '', {q(emo)}, '', '', array[{q(tag)}]::text[], (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com'), {ma}
where not exists (select 1 from public.words w where w.lang = 'en' and lower(w.headword) = lower({q(hw)}));
update public.words set tags = (select array(select distinct x from unnest(tags || array[{q(tag)}]) x order by x)) where id = (select id from public.words where lang = 'en' and lower(headword) = lower({q(hw)}) order by (sense = '') desc limit 1);
insert into public.word_difference_parts (diff_key, word_id, explain, explain_ar, position) select {q(key)}, w.id, {q(expl)}, {q(ar)}, {n} from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower({q(hw)}) order by (sense = '') desc limit 1)
on conflict (diff_key, word_id) do update set explain = excluded.explain, explain_ar = excluded.explain_ar, position = excluded.position;
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id, min_age)
select md5('diff:' || {q(key)} || ':' || w.id)::uuid, '00000000-0000-4000-8000-00000000d1ff', {pos}, 'term', {unit}, '{{}}', w.id, {ma} from public.words w where w.id = (select id from public.words where lang = 'en' and lower(headword) = lower({q(hw)}) order by (sense = '') desc limit 1)
and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000d1ff' and e.word_id = w.id)
on conflict (id) do nothing;""")
out.append("select (select count(*) from public.word_differences) as differences, (select count(*) from public.word_difference_parts) as parts, (select count(*) from public.set_entries where set_id = '00000000-0000-4000-8000-00000000d1ff') as set_words;")
open("supabase_v66_differences.sql", "w").write("\n".join(out) + "\n")
print(len(D), pos)
