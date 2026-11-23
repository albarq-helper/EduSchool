# Helper Academy — Famous Sayings (v31). build_v31.py turns this into SQL.
# unit|saying (English)|author · source|emoji|simple meaning|Arabic translation|Arabic saying with the same idea (or the Arabic original)|tags
SAY_UNITS = ["Writers & poets", "Scientists & thinkers", "Leaders & history", "Arab wisdom", "Proverbs from around the world"]
SAY = """
1|To be or not to be, that is the question.|William Shakespeare · Hamlet (1600)|🎭|A famous line about facing a very hard choice.|أكونُ أو لا أكون، تلك هي المسألة.||wb;ch
1|All that glitters is not gold.|William Shakespeare · The Merchant of Venice (1596)|✨|Something that looks good is not always good.|ليس كلُّ ما يلمع ذهباً.|ليس كلُّ ما يلمع ذهباً|ch;≈ Clear
1|Brevity is the soul of wit.|William Shakespeare · Hamlet (1600)|✂️|Clever words are short words.|الإيجازُ روحُ الذكاء.|خيرُ الكلامِ ما قلَّ ودلّ|wb
1|The pen is mightier than the sword.|Edward Bulwer-Lytton · Richelieu (1839)|🖋️|Words and ideas can be stronger than fighting.|القلمُ أقوى من السيف.|القلمُ أقوى من السيف|wb;if
1|Hope is the thing with feathers.|Emily Dickinson · poem (about 1861)|🪶|Hope is like a little bird that keeps singing inside us.|الأملُ هو ذلك الشيءُ ذو الريش.|تفاءلوا بالخيرِ تجدوه|fe
1|A thing of beauty is a joy for ever.|John Keats · Endymion (1818)|🌸|Beautiful things make us happy again and again.|الشيءُ الجميلُ بهجةٌ دائمة.|الجمالُ يُبهِجُ النفس|fe;gg
1|Laugh, and the world laughs with you.|Ella Wheeler Wilcox · Solitude (1883)|😄|When you are cheerful, other people join you.|اضحك، يضحكْ معك العالم.|اضحك تضحكْ لك الدنيا|fe;ga;≈ Happy
2|Knowledge is power.|Francis Bacon · Meditationes Sacrae (1597)|📚|The more you learn, the more you can do.|المعرفةُ قوّة.|العلمُ نور|st;if
2|I think, therefore I am.|René Descartes · Discourse on the Method (1637)|🤔|Because I can think, I know that I exist.|أنا أفكّر، إذن أنا موجود.||st;sc
2|Eureka! I have found it!|Archimedes · ancient Greece (about 250 BC)|🛁|What you shout when you suddenly discover something.|وجدتُها! وجدتُها!|وجدتُها!|sc;fe
2|The only true wisdom is in knowing you know nothing.|Socrates · as told by Plato (about 400 BC)|🏛️|Wise people know there is always more to learn.|الحكمةُ الحقيقيةُ أن تعرفَ أنك لا تعرفُ شيئاً.|من قال لا أدري فقد أفتى|st;ch
2|If I have seen further, it is by standing on the shoulders of giants.|Isaac Newton · letter (1675)|🔭|We learn more because of the people who learned before us.|إن كنتُ قد رأيتُ أبعد، فذلك لأني وقفتُ على أكتافِ العمالقة.|الفضلُ للمتقدّم|sc;ga
2|Genius is one percent inspiration and ninety-nine percent perspiration.|Thomas Edison · interview (about 1903)|💡|Great ideas need a lot of hard work.|العبقريةُ واحدٌ بالمئةِ إلهامٌ وتسعةٌ وتسعون بالمئةِ عرق.|من جدَّ وجد|sc;ch;≈ Motivated
2|Imagination is more important than knowledge.|Albert Einstein · interview (1929)|🌌|Dreaming up new ideas matters even more than knowing facts.|الخيالُ أهمُّ من المعرفة.||sc;st
3|I came, I saw, I conquered.|Julius Caesar · letter to Rome (47 BC)|🏛️|A short way to say "I won quickly and easily."|جئتُ، رأيتُ، انتصرتُ.||gl
3|Ask not what your country can do for you; ask what you can do for your country.|John F. Kennedy · speech (1961)|🇺🇸|Think about how you can help others, not only what you can get.|لا تسألْ ماذا يمكنُ أن يقدّمَ لك وطنُك، بل اسألْ ماذا يمكنُك أن تقدّمَ لوطنك.|حبُّ الوطنِ من الإيمان|gl;ga
3|Injustice anywhere is a threat to justice everywhere.|Martin Luther King Jr. · letter (1963)|⚖️|If something unfair happens to anyone, it matters to all of us.|الظلمُ في أيِّ مكانٍ تهديدٌ للعدلِ في كلِّ مكان.|العدلُ أساسُ الملك|gl;ga
3|Education is the most powerful weapon which you can use to change the world.|Nelson Mandela · speech (2003)|🎓|Learning gives you the power to make the world better.|التعليمُ أقوى سلاحٍ يمكنك أن تغيّرَ به العالم.|العلمُ يرفعُ بيتاً لا عمادَ له|gl;st;≈ Important
3|Well done is better than well said.|Benjamin Franklin · Poor Richard's Almanack (1737)|🔨|Doing a good thing is better than talking about it.|العملُ الجيّدُ خيرٌ من القولِ الجيّد.|العبرةُ بالأفعالِ لا بالأقوال|ch
4|The horse, the night and the desert know me.|Al-Mutanabbi · poem (10th century)|🐎|A poet proudly says he is brave and knows the desert well.|الخيلُ والليلُ والبيداءُ تعرفني.|الخيلُ والليلُ والبيداءُ تعرفني والسيفُ والرمحُ والقرطاسُ والقلمُ|wb;ch;≈ Brave
4|The best companion in time is a book.|Al-Mutanabbi · poem (10th century)|📖|A book is always a good friend.|وخيرُ جليسٍ في الزمانِ كتابُ.|وخيرُ جليسٍ في الزمانِ كتابُ|wb;ga;≈ Friend
4|Patience is the key to relief.|Arabic proverb|🗝️|If you wait calmly, good things will come.|الصبرُ مفتاحُ الفرج.|الصبرُ مفتاحُ الفرج|ch;fe
4|Whoever works hard finds success; whoever plants, harvests.|Arabic proverb|🌾|Hard work brings good results.|من جدَّ وجد، ومن زرعَ حصد.|من جدَّ وجد، ومن زرعَ حصد|ch;na
4|Time is like a sword: if you do not cut it, it cuts you.|Arabic proverb|⏳|Use your time well, or it will be wasted.|الوقتُ كالسيف، إن لم تقطعْه قطعك.|الوقتُ كالسيف، إن لم تقطعْه قطعك|tc
4|Learning when young is like carving in stone.|Arabic proverb|🪨|What you learn as a child stays with you for ever.|العلمُ في الصغرِ كالنقشِ على الحجر.|العلمُ في الصغرِ كالنقشِ على الحجر|st;tc
4|A friend in need is a friend indeed.|English proverb|🤝|A true friend helps you when things are hard.|الصديقُ عند الحاجةِ هو الصديقُ الحقيقي.|الصديقُ وقتَ الضيق|ga;≈ Friend
4|Speech is silver, silence is golden.|Proverb|🤫|Sometimes it is wiser to stay quiet.|إذا كان الكلامُ من فضّة، فالسكوتُ من ذهب.|إذا كان الكلامُ من فضّة، فالسكوتُ من ذهب|st;≈ Quiet
5|The journey of a thousand miles begins with a single step.|Laozi · Tao Te Ching (China, about 500 BC)|👣|Every big job starts with one small step.|رحلةُ الألفِ ميلٍ تبدأُ بخطوةٍ واحدة.|رحلةُ الألفِ ميلٍ تبدأُ بخطوة|tc;mv
5|Where there's a will, there's a way.|English proverb|🛤️|If you really want something, you will find a way to do it.|حيثُ توجدُ الإرادة، يوجدُ الطريق.|من سارَ على الدربِ وصل|ch
5|Rome wasn't built in a day.|Proverb (Europe)|🏟️|Big things take time.|لم تُبنَ روما في يومٍ واحد.|اصبرْ تنلْ|tc
5|Fall seven times, stand up eight.|Japanese proverb|🎌|Never give up, however many times you fail.|اسقطْ سبعَ مرّات، وانهضْ ثماني.|لا يأسَ مع الحياة|ch;⇄ Give up vs. keep going: keep going
5|Two heads are better than one.|English proverb|🧠|Two people thinking together find better answers.|رأسان أفضلُ من رأسٍ واحد.|يدٌ واحدةٌ لا تصفّق|ga
5|Honesty is the best policy.|English proverb|💯|Telling the truth is always the best choice.|الصدقُ أفضلُ سياسة.|الصدقُ منجاة|ch
5|Look before you leap.|English proverb|👀|Think carefully before you act.|انظرْ قبلَ أن تقفز.|في التأنّي السلامة، وفي العجلةِ الندامة|ht;≈ Look
5|Little by little, the bird builds its nest.|French proverb|🐦|Small steps every day lead to big results.|شيئاً فشيئاً يبني الطائرُ عُشَّه.|قطرةٌ فوقَ قطرةٍ تصبحُ نهراً|tc;an
"""
STOP = "have will with that this what your from they there than when then which only more most".split()
