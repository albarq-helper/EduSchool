# Helper Academy — the feelings wheel (Fear, Anger, Disgust, Sad, Happy, Surprise).
# Run build_v43.py to turn this into supabase_v43_feelings_wheel.sql.
# Headword|type|themes|emoji|syllables|PRONUNCIATION|meaning|example|translation|min_age
NEW = """
Insecure|D|fe|🫣|in-se-cure|in-si-KYOOR|Not sure of yourself; worried that you are not good enough.|She felt [insecure] about her new haircut.|غير واثق من نفسه|0
Submissive|D|fe;ga|🙇|sub-mis-sive|sub-MIS-iv|Always doing what others want, even when you don't agree.|The [submissive] puppy rolled over for the big dog.|خاضع / مستسلم|0
Rejected|D|fe;ga|💔|re-ject-ed|ri-JEK-tid|Feeling unwanted because someone said no to you or left you out.|He felt [rejected] when nobody picked him for the team.|مرفوض|0
Humiliated|D|fe|😳|hu-mil-i-at-ed|hyoo-MIL-ee-ay-tid|Very embarrassed and ashamed in front of others.|She felt [humiliated] when she tripped on stage.|مُهان / مُذَلّ|0
Hurt|D|fe|🤕|hurt|HURT|Feeling pain in your body, or sad because of what someone did.|I felt [hurt] when my friend laughed at me.|مجروح / متألّم|0
Threatened|D|fe|⚠️|threat-ened|THRET-und|Feeling that someone or something may harm you.|The cat felt [threatened] by the barking dog.|مُهدَّد|0
Hateful|D|fe;ga|😠|hate-ful|HAYT-ful|Full of hate; very unkind.|Writing [hateful] words about others is wrong.|مليء بالكراهية|0
Mad|D|fe|😤|mad|MAD|Angry.|Mum was [mad] when I spilled juice on the sofa.|غاضب|0
Aggressive|D|fe;ga|👊|ag-gres-sive|uh-GRES-iv|Ready to fight or attack.|The [aggressive] goose chased the children.|عدواني|0
Critical|D|ga;st|🧐|crit-i-cal|KRIT-i-kul|Pointing out what is wrong, often in an unkind way.|He was very [critical] of my drawing.|ناقد / كثير الانتقاد|0
Disapproval|N|fe;ga|👎|dis-ap-prov-al|dis-uh-PROO-vul|The feeling that something is bad or wrong.|Dad shook his head in [disapproval].|عدم الرضا / الاستنكار|0
Awful|D|fe;gg|😖|aw-ful|AW-ful|Very bad or unpleasant.|The medicine tasted [awful].|فظيع / سيئ جداً|0
Avoidance|N|fe|🙅|a-void-ance|uh-VOY-duns|Keeping away from something or someone.|His [avoidance] of the dentist made his tooth worse.|التجنّب|0
Guilty|D|fe;ch|😔|guilt-y|GIL-tee|Feeling bad because you did something wrong.|I felt [guilty] after I took the last cookie.|مذنب / يشعر بالذنب|0
Abandoned|D|fe|🏚️|a-ban-doned|uh-BAN-dund|Left alone by someone who should have stayed.|The [abandoned] kitten was found in a box.|مهجور / متروك|0
Bored|D|fe|🥱|bored|BORD|Tired and unhappy because nothing is interesting.|I was [bored] on the long car ride.|يشعر بالملل|0
Intimate|D|fe;ga|💞|in-ti-mate|IN-tuh-mit|Very close and private between people who love or trust each other.|They had an [intimate] talk about their worries.|حميم|13
Powerful|D|fe|💪|pow-er-ful|POW-er-ful|Very strong; able to do a lot.|She felt [powerful] after she finished the race.|قوي|0
Accepted|D|fe;ga|🤗|ac-cept-ed|uk-SEP-tid|Feeling welcome and liked by a group.|In her new class, she quickly felt [accepted].|مقبول / مُرحَّب به|0
Proud|D|fe|🦚|proud|PROWD|Happy about something you or someone close to you did.|I am [proud] of my little brother for learning to swim.|فخور|0
Interested|D|fe|🤔|in-ter-est-ed|IN-tres-tid|Wanting to know more about something.|She is [interested] in dinosaurs.|مهتمّ|0
Open|D|fe;ch|🔓|o-pen|OH-pun|Happy to share your feelings and listen to new ideas.|Be [open] to trying new food.|منفتح|0
Playful|D|fe;ch|🤹|play-ful|PLAY-ful|Full of fun and wanting to play.|The [playful] kitten chased the string.|مرِح / يحب اللعب|0
Sensitive|D|fe;ch|🥺|sen-si-tive|SEN-si-tiv|Easily upset, or quick to notice how others feel.|He is [sensitive] and notices when his friends are sad.|حسّاس|0
Loving|D|fe;ga|🥰|lov-ing|LUV-ing|Showing a lot of love.|Grandma gave me a [loving] hug.|محب / حنون|0
Provocative|D|ga|😏|pro-voc-a-tive|pruh-VOK-uh-tiv|Meant to make people angry or get a strong reaction.|His [provocative] comment started an argument.|استفزازي|13
Fulfilled|D|fe|🌻|ful-filled|ful-FILD|Happy because your life or work feels complete and worthwhile.|Helping others made her feel [fulfilled].|راضٍ / مكتفٍ|0
Respected|D|fe;ga|🎖️|re-spect-ed|ri-SPEK-tid|Feeling that others think well of you.|The coach was [respected] by all the players.|مُحترَم|0
Inquisitive|D|fe;st|🔍|in-quis-i-tive|in-KWIZ-i-tiv|Always asking questions and wanting to learn.|The [inquisitive] boy asked "why?" all day.|فضولي / كثير السؤال|0
Amused|D|fe|😄|a-mused|uh-MYOOZD|Finding something funny.|We were [amused] by the clown's tricks.|مستمتع / مسرور|0
Liberated|D|fe|🕊️|lib-er-at-ed|LIB-uh-ray-tid|Feeling free, as if something holding you back is gone.|After the exams she felt [liberated].|متحرّر|0
Eager|D|fe|🙋|ea-ger|EE-ger|Wanting very much to do something.|The children were [eager] to open their presents.|متلهّف / متحمّس|0
Awe|N|fe|🤩|awe|AW|A feeling of wonder at something huge or amazing.|We looked at the mountains in [awe].|الرهبة / الانبهار|0
Astonished|D|fe|😮|as-ton-ished|uh-STON-isht|Very, very surprised.|He was [astonished] to see snow in the desert.|مندهش جداً|0
Perplexed|D|fe;st|😕|per-plexed|per-PLEKST|Confused because you can't understand something.|The tricky riddle left me [perplexed].|محتار|0
Disillusioned|D|fe|😞|dis-il-lu-sioned|dis-i-LOO-zhund|Sad because something is not as good as you believed.|She was [disillusioned] when her hero turned out to be unkind.|خائب الأمل|0
Dismayed|D|fe|😧|dis-mayed|dis-MAYD|Shocked and upset by bad news.|We were [dismayed] to hear the trip was cancelled.|مصدوم ومستاء|0
Excited|D|fe|🤩|ex-cit-ed|ik-SY-tid|Very happy and full of energy about something good.|We were [excited] about the school trip.|متحمّس|0
Amazed|D|fe|😲|a-mazed|uh-MAYZD|Very surprised, in a good way.|I was [amazed] by the magic trick.|مندهش / مذهول|0
Confused|D|fe;st|😵‍💫|con-fused|kun-FYOOZD|Not able to understand or think clearly.|The new maths rule left me [confused].|مرتبك / محتار|0
Startled|D|fe|🙀|star-tled|STAR-tuld|Suddenly surprised or a little frightened.|The loud bang [startled] the baby.|مفزوع / مجفل|0
Shocked|D|fe|😱|shocked|SHOKT|Very surprised and upset by something you did not expect.|I was [shocked] when the vase fell.|مصدوم|0
Disgust|N|fe|🤢|dis-gust|dis-GUST|A strong feeling that something is very unpleasant.|She looked at the rotten apple with [disgust].|الاشمئزاز|0
Surprise|N|fe|🎉|sur-prise|ser-PRYZ|Something you did not expect, or the feeling it gives you.|The party was a big [surprise].|المفاجأة|0
Overwhelmed|D|fe|🌊|o-ver-whelmed|oh-ver-WELMD|Feeling there is too much to handle.|With five tests in one week, I felt [overwhelmed].|مُثقَل / مغمور بالضغط|0
Inadequate|D|fe|📉|in-ad-e-quate|in-AD-i-kwit|Feeling not good enough.|He felt [inadequate] next to the older players.|يشعر بالنقص|0
Inferior|D|fe|⬇️|in-fe-ri-or|in-FEER-ee-er|Feeling less good or less important than others.|Don't let anyone make you feel [inferior].|أدنى / أقل شأناً|0
Worthless|D|fe|🪫|worth-less|WURTH-lis|Feeling that you have no value at all.|Nobody is [worthless]; everyone matters.|عديم القيمة|0
Insignificant|D|fe|🐜|in-sig-nif-i-cant|in-sig-NIF-i-kunt|Feeling small and not important.|Standing next to the pyramid, I felt [insignificant].|تافه / غير مهم|0
Alienated|D|fe;ga|👽|al-ien-at-ed|AY-lee-uh-nay-tid|Feeling that you don't belong in a group.|The new boy felt [alienated] because nobody talked to him.|منعزل / غريب عن الجماعة|0
Disrespected|D|fe;ga|🙄|dis-re-spect-ed|dis-ri-SPEK-tid|Feeling that someone did not treat you with respect.|She felt [disrespected] when they ignored her idea.|غير مُحترَم|0
Ridiculed|D|fe;ga|🤡|rid-i-culed|RID-i-kyoold|Laughed at in an unkind way.|He was [ridiculed] for his old shoes.|مُستهزأ به|0
Embarrassed|D|fe|🙈|em-bar-rassed|em-BAIR-ust|Feeling silly or shy because of something you did.|I was [embarrassed] when I called my teacher "Mum".|محرَج|0
Jealous|D|fe;ga|💚|jeal-ous|JEL-us|Wanting what someone else has, and feeling upset about it.|He was [jealous] of his friend's new bike.|غيور / حاسد|0
Resentful|D|fe;ga|😒|re-sent-ful|ri-ZENT-ful|Angry for a long time about something unfair.|She felt [resentful] that her brother got the bigger room.|ممتعض / حاقد|0
Violated|D|fe|🚫|vi-o-lat-ed|VY-uh-lay-tid|Feeling that something private or important to you was badly broken or taken.|She felt [violated] when someone read her diary.|مُنتهَك|13
Enraged|D|fe|👹|en-raged|en-RAYJD|Extremely angry.|The [enraged] bull charged at the gate.|هائج / غاضب جداً|0
Provoked|D|fe|🔥|pro-voked|pruh-VOHKT|Made angry on purpose by someone.|The dog only bites when it is [provoked].|مُستفَز|0
Hostile|D|fe;ga|😾|hos-tile|HOS-tyl|Unfriendly and ready to argue or fight.|The cat gave the new puppy a [hostile] look.|عدائي|0
Infuriated|D|fe|🤬|in-fu-ri-at-ed|in-FYOOR-ee-ay-tid|Extremely angry.|The long wait [infuriated] the passengers.|مُغضَب جداً|0
Withdrawn|D|fe|🐢|with-drawn|with-DRAWN|Quiet and not wanting to talk to others.|After the bad news he became [withdrawn].|منطوٍ / منسحب|0
Suspicious|D|fe;st|🕵️|sus-pi-cious|suh-SPISH-us|Thinking that something is wrong or someone is not honest.|The guard was [suspicious] of the man in the dark coat.|مرتاب / مشكوك|0
Skeptical|D|st|🤨|skep-ti-cal|SKEP-ti-kul|Not easily believing something.|I am [skeptical] that he saw a dragon.|متشكّك|0
Sarcastic|D|ga;st|🙃|sar-cas-tic|sar-KAS-tik|Saying the opposite of what you mean, to tease or hurt.|"Great job," he said in a [sarcastic] voice after I dropped the ball.|ساخر / تهكّمي|0
Judgmental|D|ga;st|⚖️|judg-men-tal|juj-MEN-tul|Quick to decide that others are bad or wrong.|Don't be [judgmental] about people you don't know.|يُطلق الأحكام على الآخرين|0
Loathing|N|fe|🤮|loath-ing|LOH-thing|A very strong feeling of hate or disgust.|She felt [loathing] for the cruel king in the story.|المقت / الكراهية الشديدة|0
Repugnant|D|fe|🦨|re-pug-nant|ri-PUG-nunt|So unpleasant that you can't stand it.|The smell from the bin was [repugnant].|بغيض / مُقرف|0
Revolted|D|fe|😝|re-volt-ed|ri-VOHL-tid|Feeling sick with disgust.|I was [revolted] by the worm in my apple.|مشمئز|0
Revulsion|N|fe|🤧|re-vul-sion|ri-VUL-shun|A strong feeling of disgust.|He looked at the slimy food with [revulsion].|النفور / الاشمئزاز|0
Detestable|D|fe|👿|de-test-a-ble|di-TES-tuh-bul|So bad that people hate it.|Bullying is a [detestable] thing to do.|بغيض / مكروه|0
Aversion|N|fe|🙅‍♀️|a-ver-sion|uh-VUR-zhun|A strong dislike of something.|My cat has an [aversion] to water.|النفور / الكره|0
Hesitant|D|fe|😬|hes-i-tant|HEZ-i-tunt|Not sure, so you wait before doing something.|She was [hesitant] to jump into the cold pool.|متردّد|0
Remorseful|D|fe;ch|😢|re-morse-ful|ri-MORS-ful|Very sorry for something wrong you did.|The [remorseful] boy apologized for breaking the window.|نادم|0
Ashamed|D|fe;ch|😣|a-shamed|uh-SHAYMD|Feeling bad about yourself because of something you did.|I was [ashamed] that I lied to my mum.|خجلان / يشعر بالعار|0
Ignored|D|fe;ga|🙉|ig-nored|ig-NORD|Feeling that nobody notices or listens to you.|He felt [ignored] when nobody answered his question.|مُتجاهَل|0
Victimized|D|fe;ga|🎯|vic-tim-ized|VIK-tuh-myzd|Treated unfairly or hurt again and again by others.|She felt [victimized] by the bullies.|مُضطهَد / ضحية|13
Powerless|D|fe|🔌|pow-er-less|POW-er-lis|Feeling that you can do nothing to change things.|We felt [powerless] as the storm got worse.|عاجز|0
Vulnerable|D|fe|🐣|vul-ner-a-ble|VUL-ner-uh-bul|Easy to hurt, physically or in your feelings.|A baby bird is very [vulnerable].|ضعيف / مُعرَّض للأذى|0
Empty|D|fe|🫙|emp-ty|EMP-tee|Feeling nothing inside, often after something sad.|After her friend moved away, she felt [empty].|فارغ / خاوٍ|0
Isolated|D|fe;ga|🏝️|i-so-lat-ed|EYE-suh-lay-tid|Alone and cut off from other people.|Living on the farm, he sometimes felt [isolated].|معزول|0
Apathetic|D|fe|😶|ap-a-thet-ic|ap-uh-THET-ik|Not caring or feeling interested at all.|He was [apathetic] about the game and didn't even watch.|لا مبالٍ|0
"""
# ≈ similar groups (the wheel's inner ring). Existing groups are extended.
SIM = {
  "Insecure": "Insecure Inadequate Inferior Worthless Insignificant",
  "Rejected": "Rejected Alienated Isolated Abandoned Ignored",
  "Humiliated": "Humiliated Disrespected Ridiculed Embarrassed",
  "Powerless": "Powerless Vulnerable Submissive Victimized",
  "Worried": "Overwhelmed",
  "Angry": "Mad Enraged Infuriated Hostile Aggressive",
  "Hurt": "Hurt Threatened Violated",
  "Hateful": "Hateful Resentful Jealous",
  "Suspicious": "Suspicious Skeptical Hesitant Withdrawn",
  "Critical": "Critical Judgmental Sarcastic Disapproval",
  "Disgust": "Disgust Revulsion Loathing Aversion Avoidance Revolted",
  "Disgusting": "Repugnant Detestable Awful",
  "Guilty": "Guilty Remorseful Ashamed",
  "Sad": "Empty",
  "Bored": "Bored Apathetic Indifferent",
  "Happy": "Amused Playful Liberated",
  "Proud": "Proud Fulfilled Respected Powerful",
  "Loving": "Loving Intimate Sensitive Open Accepted",
  "Curious": "Interested Inquisitive Curious",
  "Excited": "Excited Eager Energetic",
  "Amazed": "Amazed Astonished Awe Surprise",
  "Shocked": "Shocked Startled",
  "Disappointed": "Disappointed Disillusioned Dismayed",
  "Confused": "Confused Perplexed",
  "Provoke": "Provoked Provocative",
}
# ⇄ opposites (existing pairs are extended)
OPP = {
  "Accepted vs. rejected": {"accepted": "Accepted Respected", "rejected": "Rejected Alienated Ignored Abandoned Isolated"},
  "Interested vs. bored": {"interested": "Interested Inquisitive Eager Excited Curious", "bored": "Bored Apathetic Indifferent"},
  "Proud vs. ashamed": {"proud": "Proud Fulfilled Respected", "ashamed": "Ashamed Humiliated Embarrassed Guilty Remorseful Ridiculed Disrespected"},
  "Powerful vs. powerless": {"powerful": "Powerful Confident Courageous Liberated", "powerless": "Powerless Vulnerable Submissive Victimized Inadequate Insecure Inferior Worthless Insignificant"},
  "Calm vs. angry": {"angry": "Mad Enraged Infuriated Hostile Aggressive Provoked"},
  "Kind vs. unkind": {"kind": "Loving Sensitive", "unkind": "Hateful Jealous Resentful Critical Judgmental Sarcastic Provocative"},
  "Trusting vs. suspicious": {"trusting": "Open", "suspicious": "Suspicious Skeptical Hesitant Withdrawn"},
  "Like vs. disgusted": {"like": "Loving", "disgusted": "Disgust Revulsion Loathing Aversion Revolted Repugnant Detestable Awful Disapproval Avoidance"},
  "Happy vs. upset": {"happy": "Amused Playful", "upset": "Empty Hurt Disillusioned Dismayed"},
  "Brave vs. scared": {"scared": "Threatened Overwhelmed Violated"},
  "Sure vs. confused": {"sure": "Confident", "confused": "Confused Perplexed"},
}
# 📶 meters: existing meters get new levels; one new meter
SCALES = {
  "Angry → Calm": [("Provoked", -2), ("Mad", -3), ("Hostile", -4), ("Infuriated", -5), ("Enraged", -5)],
  "Afraid → Calm": [("Hesitant", -1), ("Insecure", -1), ("Threatened", -3), ("Overwhelmed", -3)],
  "Hate ⇄ Love": [("Disapproval", -2), ("Aversion", -3), ("Hateful", -4), ("Loathing", -5), ("Revulsion", -5), ("Loving", 4)],
  "Sad ⇄ Happy": [("Empty", -4), ("Amused", 2), ("Playful", 2), ("Fulfilled", 4)],
  "Ashamed ⇄ Proud": [("Humiliated", -5), ("Ashamed", -4), ("Embarrassed", -2), ("Respected", 3), ("Proud", 4)],
  "Bored → Excited": [("Apathetic", 0), ("Bored", 1), ("Interested", 2), ("Inquisitive", 3), ("Eager", 4), ("Excited", 5)],
}
# the six families of the wheel → units in "Feelings: Word Scales" (with every wheel word, old and new)
FAMILIES = [
  ("😨 Feelings wheel: Fear", "Fear Scared Anxious Insecure Submissive Rejected Humiliated Terrified Frightened Overwhelmed Worried Inadequate Inferior Worthless Insignificant Alienated Disrespected Ridiculed Embarrassed"),
  ("😠 Feelings wheel: Anger", "Anger Hurt Threatened Hateful Mad Aggressive Frustrated Distant Critical Devastated Jealous Resentful Violated Furious Enraged Provoked Hostile Infuriated Irritated Withdrawn Suspicious Skeptical Sarcastic"),
  ("🤢 Feelings wheel: Disgust", "Disgust Disapproval Disappointed Awful Avoidance Judgmental Loathing Repugnant Revolted Revulsion Detestable Aversion Hesitant"),
  ("😢 Feelings wheel: Sad", "Sad Guilty Abandoned Despair Depressed Lonely Bored Remorseful Ashamed Ignored Victimized Powerless Vulnerable Empty Isolated Apathetic Indifferent"),
  ("😊 Feelings wheel: Happy", "Happy Optimistic Intimate Peaceful Powerful Accepted Proud Interested Joyful Inspired Open Playful Sensitive Hopeful Loving Provocative Courageous Fulfilled Respected Confident Important Inquisitive Amused Ecstatic"),
  ("😲 Feelings wheel: Surprise", "Surprise Excited Amazed Confused Startled Liberated Energetic Eager Awe Astonished Perplexed Disillusioned Dismayed Shocked"),
]
