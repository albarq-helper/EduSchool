# v57: 🔎 signs, every personality-disorder cluster (with subtypes), manipulation tactics, envy & jealousy,
# academic text + sources, 3 new traits, and characters that carry signs and conditions with a strength (1 mild · 2 clear · 3 strong).
# Our own wording (the DSM-5-TR criteria text is copyrighted and is not copied).
import json
q = lambda s: "null" if s is None else "'" + str(s).replace("'", "''") + "'"
J = lambda o: q(json.dumps(o, ensure_ascii=False)) + "::jsonb"
A = lambda xs: "array[" + ",".join(q(x) for x in xs) + "]::text[]" if xs else "'{}'::text[]"

DSM = "American Psychiatric Association (2022). Diagnostic and Statistical Manual of Mental Disorders, 5th ed., text revision (DSM-5-TR)."
ICD = "World Health Organization. ICD-11: personality disorders and related traits (6D10–6D11)."

TRAITS = [
 ("gratitude", "🙏", "Gratitude", "Character", 6, False,
  ("Never thankful", "Always feels something is missing; envies others more easily.", "People feel used and unappreciated."),
  ("Grateful", "Notices the good things and the people behind them, and says thank you."),
  ("Thanks for everything, even harm", "Accepts unfair treatment and calls it kindness.", "Others may take advantage of it."), ""),
 ("thinking", "🌈", "Black-and-white ⇄ shades of grey", "Mindset", 8, False,
  ("Black-and-white", "Sees people as all good or all bad; one mistake ruins everything.", "Judges others quickly and harshly; friendships break suddenly."),
  ("Shades of grey", "Sees that people and things are mixed, and still knows right from wrong."),
  ("Everything is grey", "Never takes a stand, even when something is clearly wrong.", "Others can't count on them to say \"this is wrong\"."), ""),
 ("assertive", "🦁", "Strength of personality", "Character", 7, True,
  ("Passive (weak)", "Can't say no; keeps feelings inside until they explode.", "Others decide for them and may take advantage."),
  ("Assertive", "Says what they think and need, calmly and with respect."),
  ("Aggressive", "Wins arguments but loses friends.", "Pushes, shouts or threatens to get their way."),
  "Some people are strong at home but can't speak up at school or work, or the other way round."),
]

# key, icon, name, category, min_age, kid text, academic text
SIGNS = [
 # self-image
 ("needs_admiration", "👏", "Needs to be admired", "self", 10, "Always wants praise and attention.", "Excessive need for admiration; self-esteem is regulated by outside validation."),
 ("grandiosity", "👑", "Feels more special than others", "self", 10, "Thinks they are better than others and deserve special treatment.", "Grandiose sense of self-importance; fantasies of unlimited success, power or brilliance."),
 ("entitlement", "🎫", "Expects special treatment", "self", 10, "Expects the rules not to apply to them.", "Sense of entitlement: unreasonable expectations of favourable treatment or automatic compliance."),
 ("arrogant_attitude", "🦚", "Looks down on people", "self", 10, "Acts proud and talks down to others.", "Arrogant, haughty behaviours or attitudes."),
 ("fragile_self_esteem", "🥚", "Fragile self-esteem", "self", 10, "Looks confident, but is hurt very easily.", "Unstable self-esteem that reacts strongly to perceived threats."),
 ("hidden_superiority", "🫥", "Quietly feels superior", "self", 14, "Seems shy or modest, but secretly feels better than others and not appreciated enough.", "Covert grandiosity masked by apparent modesty, shyness or self-criticism (vulnerable narcissism)."),
 ("hypersensitive_criticism", "🌵", "Can't take criticism", "self", 8, "Small comments feel like big attacks.", "Hypersensitivity to criticism; shame or anger in response to perceived slights."),
 ("unstable_identity", "🎭", "Unsure who they are", "self", 14, "Keeps changing goals, friends, values and even style.", "Identity disturbance: markedly and persistently unstable self-image or sense of self."),
 ("feels_empty", "🕳️", "Feels empty inside", "self", 14, "Often feels hollow, as if something is missing inside.", "Chronic feelings of emptiness."),
 ("feels_inadequate", "😞", "Feels not good enough", "self", 8, "Believes they are worse than others.", "Pervasive feelings of inadequacy; views self as socially inept or inferior."),
 ("inferiority", "📉", "Feels below someone", "self", 8, "Feels smaller than a particular person, in something that matters to them.", "Perceived inferiority to a similar other in a self-relevant domain: the starting point of envy."),
 ("no_try", "🪫", "Gives up before trying", "self", 7, "Says \"I can't\" before even starting.", "Avoidance driven by an expectation of failure."),
 # feelings
 ("mood_swings", "🎢", "Feelings change fast", "feelings", 10, "Can be happy, then angry, then sad within hours.", "Affective instability: intense episodes of low mood, irritability or anxiety usually lasting hours."),
 ("intense_anger", "🌋", "Sudden strong anger", "feelings", 8, "Gets very angry very fast, more than the situation needs.", "Inappropriate, intense anger or difficulty controlling anger."),
 ("shallow_emotions", "🎈", "Big feelings that don't go deep", "feelings", 14, "Shows huge feelings that change quickly and seem not very deep.", "Rapidly shifting and shallow expression of emotions."),
 ("cold_emotions", "🧊", "Shows very little feeling", "feelings", 12, "Hardly shows joy, sadness or anger.", "Emotional coldness, detachment or flattened affect."),
 ("fear_abandonment", "🚪", "Terrified of being left", "feelings", 12, "Panics at the idea that someone will leave them.", "Frantic efforts to avoid real or imagined abandonment."),
 ("envy_others", "💚", "Envies others", "feelings", 7, "Feels bad when others have what they want.", "Frequently envious of others, or believes others are envious of them."),
 ("jealous_rival", "🫣", "Afraid of being replaced", "feelings", 7, "Worries that someone will take a friend or a parent's love away.", "Jealousy: perceived threat of losing a valued relationship to a rival."),
 ("no_remorse", "🚫", "Doesn't feel sorry", "feelings", 12, "Hurts people and doesn't feel bad about it.", "Lack of remorse: indifferent to, or rationalising, having hurt or mistreated others."),
 ("enjoys_suffering", "🖤", "Enjoys others' pain", "feelings", 16, "Feels pleased when others are hurt or humiliated.", "Derives pleasure from others' suffering or humiliation (sadistic tendency)."),
 ("schadenfreude", "😏", "Happy when others fail", "feelings", 10, "Smiles inside when someone else has bad luck.", "Schadenfreude: pleasure at another's misfortune, closely linked to malicious envy."),
 ("anxiety_social", "😰", "Very nervous with people", "feelings", 8, "Feels scared and awkward around others.", "Social anxiety and inhibition in interpersonal situations."),
 ("shame_prone", "😳", "Feels ashamed easily", "feelings", 10, "Feels deeply embarrassed, as if something is wrong with them.", "Proneness to shame (a global negative evaluation of the self)."),
 ("resentment_brewing", "😤", "Holds grudges", "feelings", 8, "Never forgets or forgives a hurt.", "Persistently bears grudges; unforgiving of insults, injuries or slights."),
 # thinking
 ("black_white_thinking", "⚫", "Black-and-white thinking", "thinking", 8, "People are all good or all bad; there is no middle.", "Dichotomous thinking (\"splitting\"): others and events are seen in all-or-nothing terms."),
 ("idealize_devalue", "🔄", "Loves you, then hates you", "thinking", 12, "First thinks you're perfect, then suddenly thinks you're terrible.", "Alternation between extremes of idealisation and devaluation."),
 ("suspicious", "🕵️", "Suspects everyone", "thinking", 10, "Thinks people are secretly against them, without proof.", "Pervasive distrust: suspects, without sufficient basis, that others are exploiting, harming or deceiving them."),
 ("reads_threats", "🎯", "Hears insults in normal words", "thinking", 10, "Takes friendly words as hidden attacks.", "Reads hidden demeaning or threatening meanings into benign remarks or events."),
 ("wont_confide", "🔒", "Won't share anything personal", "thinking", 10, "Never tells anyone their worries, in case it is used against them.", "Reluctant to confide in others for fear the information will be used maliciously."),
 ("odd_beliefs", "🔮", "Unusual beliefs", "thinking", 14, "Believes in strange powers or signs that others don't.", "Odd beliefs or magical thinking inconsistent with cultural norms."),
 ("perfectionism", "📏", "Everything must be perfect", "thinking", 10, "Can't finish work because it's never perfect enough.", "Perfectionism that interferes with completing tasks."),
 ("rigid_rules", "📐", "Rules matter more than people", "thinking", 12, "Loves lists, order and rules so much that the point gets lost.", "Preoccupation with details, rules, lists and order; rigidity and stubbornness."),
 ("zero_sum", "🥧", "\"Your win is my loss\"", "thinking", 9, "Believes that if someone else wins, they lose.", "Zero-sum beliefs: perceiving others' gains as one's own losses."),
 ("victim_mindset", "🥺", "Always the victim", "thinking", 10, "Whatever happens, they feel it was done to them.", "Habitual self-presentation as a victim; blame is placed outside the self."),
 ("intrusive_thoughts", "🔁", "Unwanted thoughts that repeat", "thinking", 12, "Worrying thoughts pop up again and again, even when they don't want them.", "Recurrent, intrusive and unwanted thoughts, urges or images causing distress (obsessions)."),
 ("rumination", "🌀", "Thinks about it again and again", "thinking", 10, "Goes over the same bad thing in their head for hours.", "Rumination: repetitive negative thinking about distress and its causes."),
 ("no_gratitude", "🙅", "Never thankful", "thinking", 7, "Takes good things for granted and notices only what's missing.", "Low dispositional gratitude."),
 # relationships
 ("lacks_empathy", "💔", "Doesn't feel others' feelings", "relationships", 8, "Doesn't notice or care how others feel.", "Lack of empathy: unwilling to recognise or identify with the feelings and needs of others."),
 ("exploits_others", "🪝", "Uses people", "relationships", 12, "Is nice to people only to get something.", "Interpersonally exploitative: takes advantage of others to achieve their own ends."),
 ("attention_seeking", "📢", "Must be the centre of attention", "relationships", 10, "Feels upset when others get the attention.", "Uncomfortable in situations where they are not the centre of attention."),
 ("theatrical", "🎬", "Very dramatic", "relationships", 14, "Acts as if on a stage: big words, big gestures.", "Self-dramatisation, theatricality and exaggerated expression of emotion; may use appearance to draw attention."),
 ("easily_influenced", "🍃", "Easily led by others", "relationships", 10, "Changes their opinion to match whoever is near.", "Suggestibility: easily influenced by others or by circumstances."),
 ("unstable_relationships", "🌪️", "Stormy friendships", "relationships", 12, "Friendships start strong and end in big fights.", "A pattern of unstable and intense interpersonal relationships."),
 ("avoids_people", "🐚", "Prefers to be alone", "relationships", 10, "Chooses to be alone almost always and doesn't miss others.", "Neither desires nor enjoys close relationships; almost always chooses solitary activities."),
 ("no_close_friends", "🚶", "No close friends", "relationships", 12, "Has nobody to share secrets with.", "Lacks close friends or confidants other than first-degree relatives."),
 ("indifferent_praise", "😐", "Doesn't care about praise or blame", "relationships", 12, "Praise and criticism don't seem to touch them.", "Appears indifferent to the praise or criticism of others."),
 ("fear_rejection", "🙈", "Avoids people for fear of rejection", "relationships", 10, "Stays away from others because they might not like them.", "Avoids interpersonal contact because of fears of criticism, disapproval or rejection."),
 ("avoid_new", "🧳", "Avoids anything new", "relationships", 10, "Won't try new things in case they look silly.", "Unusually reluctant to take personal risks or engage in new activities for fear of embarrassment."),
 ("needs_reassurance", "🫂", "Needs others to decide", "relationships", 10, "Can't choose even small things without asking someone.", "Difficulty making everyday decisions without excessive advice and reassurance."),
 ("clingy", "🧲", "Can't be alone", "relationships", 10, "Feels lost when alone; quickly finds someone new to lean on.", "Uncomfortable or helpless when alone; urgently seeks another relationship when one ends."),
 ("cant_disagree", "🤐", "Can't say no or disagree", "relationships", 8, "Agrees with everyone so they won't be left.", "Difficulty expressing disagreement because of fear of losing support or approval."),
 ("controlling", "🎮", "Controls others", "relationships", 10, "Everyone must do it exactly their way.", "Reluctant to delegate or work with others unless they submit exactly to their way of doing things."),
 ("guards_relationship", "🛡️", "Watches a friend too closely", "relationships", 8, "Checks who their friend talks to and gets upset.", "Relationship-guarding: vigilance and attempts to keep a rival away."),
 ("isolates_target", "🏝️", "Cuts you off from friends", "relationships", 12, "Tries to keep a person away from their friends and family.", "Isolating a target from their social support."),
 # behaviour
 ("breaks_rules", "⛔", "Breaks rules and laws", "behaviour", 12, "Breaks rules again and again, even serious ones.", "Failure to conform to social norms and lawful behaviour."),
 ("deceitful", "🃏", "Lies and tricks for gain", "behaviour", 10, "Lies and tricks people to get things or for fun.", "Deceitfulness: repeated lying, use of aliases, or conning others for profit or pleasure."),
 ("lies_often", "🤥", "Lies often", "behaviour", 6, "Says things that aren't true, often.", "Frequent lying."),
 ("impulsive", "⚡", "Acts without thinking", "behaviour", 8, "Does things first and thinks later.", "Impulsivity or failure to plan ahead."),
 ("reckless", "🏍️", "Takes dangerous risks", "behaviour", 12, "Does dangerous things without caring who gets hurt.", "Reckless disregard for the safety of self or others."),
 ("irresponsible", "🗑️", "Doesn't keep promises or jobs", "behaviour", 12, "Doesn't do their part or pay back what they owe.", "Consistent irresponsibility in work or financial obligations."),
 ("aggressive", "👊", "Fights and threatens", "behaviour", 10, "Pushes, hits or threatens people.", "Irritability and aggressiveness, such as repeated physical fights or assaults."),
 ("picks_on_weaker", "🐁", "Picks on someone weaker", "behaviour", 6, "Picks on the same smaller or quieter person again and again.", "Repeated, intentional aggression involving an imbalance of power."),
 ("charm_manipulative", "🎩", "Charming to get what they want", "behaviour", 12, "Very sweet when they want something.", "Superficial charm used as a tool to influence others."),
 ("cynical_strategic", "♟️", "Plans how to use people", "behaviour", 14, "Thinks of people as pieces in a game.", "Machiavellianism: a cynical view of people and strategic, calculating manipulation for self-interest."),
 ("workaholic", "💼", "Work before friends and fun", "behaviour", 12, "Never has time to play or rest.", "Excessive devotion to work and productivity, to the exclusion of leisure and friendships."),
 ("cant_throw_away", "🗄️", "Can't throw things away", "behaviour", 12, "Keeps old, broken things \"just in case\".", "Unable to discard worn-out or worthless objects even without sentimental value."),
 ("compulsions", "🧼", "Repeats actions to calm worry", "behaviour", 10, "Washes, checks or counts again and again to feel OK.", "Repetitive behaviours or mental acts performed to reduce distress (compulsions)."),
 ("hides_with_jokes", "🤡", "Jokes to hide feelings", "behaviour", 10, "Makes a joke whenever things get serious.", "Humour used as a defensive, avoidant way of coping."),
 ("improves_self", "🪜", "Works harder after seeing others succeed", "behaviour", 7, "Seeing a friend win makes them practise more.", "Motivation to improve one's own position: typical of benign envy."),
 ("pulls_down", "🪓", "Tries to pull others down", "behaviour", 9, "Wants the other person to lose what they have.", "Motivation to damage the envied person's position: typical of malicious envy."),
 ("wants_what_others_have", "🫴", "Wants what others have", "feelings", 7, "Wishes they had what someone else has.", "Desire for an advantage that another person has."),
 ("self_risk", "🆘", "Hurts themselves in crises", "behaviour", 18, "", "Recurrent self-harming or suicidal behaviour in crises: a reason for urgent professional help."),
 # trauma, autism
 ("flashbacks", "🎞️", "Memories jump back", "feelings", 13, "Scary memories suddenly feel like they are happening again.", "Intrusive memories and flashbacks of a traumatic event."),
 ("nightmares", "🌙", "Nightmares", "feelings", 8, "Has bad dreams about what happened.", "Recurrent distressing dreams related to the event."),
 ("hypervigilance", "👀", "Always on alert", "feelings", 12, "Jumps at small noises and can't relax.", "Hypervigilance and an exaggerated startle response."),
 ("avoids_reminders", "↩️", "Avoids reminders", "behaviour", 12, "Stays away from places and things that remind them.", "Avoidance of trauma-related thoughts, places or people."),
 ("needs_routine", "🗓️", "Needs routines", "behaviour", 8, "Gets upset when plans change.", "Insistence on sameness and inflexible adherence to routines."),
 ("sensory", "🔊", "Sounds and lights feel too much", "feelings", 8, "Loud noise, bright light or scratchy clothes feel very strong.", "Hyper- or hypo-reactivity to sensory input."),
 ("social_cues", "🤔", "Finds hints and jokes hard", "relationships", 8, "Doesn't always understand hints, faces or jokes.", "Persistent differences in social communication and interaction."),
 ("deep_interests", "🚂", "Deep favourite topics", "behaviour", 8, "Knows everything about one favourite subject.", "Highly restricted, fixated interests that are unusual in intensity or focus."),
 ("odd_speech", "💬", "Unusual way of talking", "behaviour", 14, "Talks in a vague or strange way that is hard to follow.", "Odd thinking and speech (vague, metaphorical, over-elaborate)."),
 ("odd_behaviour", "🦄", "Unusual look or behaviour", "behaviour", 14, "Dresses or acts in a way others find very strange.", "Behaviour or appearance that is odd, eccentric or peculiar."),
 # tactics
 ("gossip", "🗣️", "Talks about people behind their back", "tactics", 8, "Says bad things about someone who isn't there.", "Negative talk about absent third parties."),
 ("spreads_rumours", "📨", "Spreads rumours", "tactics", 9, "Passes on stories that might not be true, to make someone look bad.", "Spreading unverified, damaging information about a target."),
 ("backhanded_compliment", "🌹", "Compliments with a sting", "tactics", 9, "\"Nice drawing, for once!\": praise with a hidden insult.", "Backhanded compliments: praise that carries a criticism or put-down."),
 ("concerned_gossip", "🫢", "\"I'm just worried about her…\"", "tactics", 11, "Says bad things about someone while pretending to care.", "Damaging information framed as concern, keeping the speaker deniable."),
 ("denies_reality", "🌫️", "\"That never happened\"", "tactics", 12, "Says things didn't happen, so you doubt your own memory.", "Denying events or statements so the target doubts their own memory or perception."),
 ("turns_tables", "🔃", "Turns the blame around", "tactics", 12, "When caught, acts as if they are the one being hurt.", "Reversing the roles of victim and offender when confronted."),
 ("silent_punishment", "🤫", "Punishes with silence", "tactics", 8, "Stops talking to you to punish you.", "Withdrawing communication as punishment or control (ostracism)."),
 ("shuts_down", "🧱", "Shuts down in arguments", "tactics", 10, "Goes quiet and stops answering when there is a problem.", "Stonewalling: emotional and conversational withdrawal during conflict."),
 ("uses_third_person", "🔺", "Brings others in to win", "tactics", 12, "\"Even Mum agrees with me!\": pulls a third person into a fight.", "Drawing a third person into a two-person conflict to gain leverage or reduce tension."),
 ("too_much_too_soon", "💝", "Too much love, too soon", "tactics", 14, "Showers someone with gifts and attention very fast, to make them attached.", "Overwhelming affection, attention and gifts early in a relationship to create dependence."),
 ("guilt_lever", "🎗️", "Makes you feel guilty", "tactics", 9, "\"After all I did for you…\" to get what they want.", "Inducing guilt to gain compliance."),
 ("comes_back_sweet", "🧹", "Comes back sweet after hurting", "tactics", 15, "After hurting someone, returns with promises to pull them back.", "Returning with affection or promises to resume a harmful relationship (\"hoovering\")."),
 ("blames_own_flaws", "📽️", "Blames you for their own faults", "tactics", 11, "The lazy one calls everyone else lazy.", "Projection: attributing one's own unacceptable feelings or traits to others."),
 ("moves_goalposts", "🥅", "Keeps changing what's \"good enough\"", "tactics", 11, "Whatever you do, it's never enough: the target keeps moving.", "Shifting the criteria so that the target can never satisfy them."),
]

# key, icon, name, kind, parent, cluster, min_age, aliases, about (plain), helps, academic, sources, signs {key: weight 3 core · 2 often · 1 sometimes}, traits
C = []
def c(key, icon, name, kind, min_age, about, helps, academic, sources, signs, traits=(), parent=None, cluster=None, aliases=(), acad_age=16):
    C.append(dict(key=key, icon=icon, name=name, kind=kind, parent=parent, cluster=cluster, min_age=min_age, aliases=list(aliases), about=about, helps=helps,
                  academic=academic, sources=sources, signs=signs, traits=list(traits), acad_age=acad_age))

# --- existing ones: academic text, sources and signs ---
c("bullying", "🛑", "Bullying", "behaviour", 6, None, None,
  "Repeated, intentional aggression (physical, verbal, relational or online) by someone with more power against someone who finds it hard to defend themselves. Bystanders strongly shape whether it continues.",
  ["Olweus, D. (1993). Bullying at School: What We Know and What We Can Do. Blackwell.", "Salmivalli, C. (2010). Bullying and the peer group: A review. Aggression and Violent Behavior, 15(2), 112–120."],
  {"picks_on_weaker": 3, "lacks_empathy": 2, "aggressive": 2, "gossip": 1, "spreads_rumours": 1}, ["empathy", "boundaries"])
c("lying", "🤥", "Lying", "behaviour", 6, None, None,
  "Deliberately making another person believe something false. In children it is normal in development; it becomes a concern when frequent, self-serving and combined with blaming others.",
  [], {"lies_often": 3, "deceitful": 1, "turns_tables": 1}, ["truthful", "self_honesty"])
c("low_self_esteem", "🥀", "Low self-esteem", "issue", 7, None, None,
  "A negative overall evaluation of one's own worth. Linked to avoidance, depression and vulnerability to envy and jealousy; it is a risk factor, not a diagnosis.",
  ["Rosenberg, M. (1965). Society and the Adolescent Self-Image. Princeton University Press."], {"feels_inadequate": 3, "no_try": 2, "shame_prone": 2, "cant_disagree": 1, "inferiority": 1}, ["confidence"])
c("funny_mask", "🎭", "Living behind a funny mask", "issue", 10, None, None,
  "Using humour defensively to avoid painful feelings or conversations. Self-defeating humour styles are linked with lower well-being.",
  ["Martin, R. A., et al. (2003). Individual differences in uses of humor: the Humor Styles Questionnaire. Journal of Research in Personality, 37(1), 48–75."],
  {"hides_with_jokes": 3, "feels_empty": 1, "rumination": 1}, ["humour", "feelings"])
c("autism", "🐠", "Autism", "condition", 8, None, None,
  "Autism spectrum disorder: persistent differences in social communication and interaction, together with restricted, repetitive behaviours, interests or activities, present from early development. Support needs vary widely. \"Asperger's\" is no longer a separate diagnosis in DSM-5.",
  [DSM], {"social_cues": 3, "needs_routine": 3, "sensory": 3, "deep_interests": 3}, [], aliases=["autism spectrum", "Asperger's"])
c("ocd", "🔁", "OCD (obsessive-compulsive disorder)", "condition", 12, None, None,
  "Obsessions (intrusive, unwanted thoughts, urges or images) and/or compulsions (repetitive behaviours or mental acts aimed at reducing distress) that are time-consuming or cause significant distress. Different from OCPD, a personality pattern.",
  [DSM], {"intrusive_thoughts": 3, "compulsions": 3, "rumination": 1}, ["conscience"], aliases=["وسواس قهري"])
c("ptsd", "⚡", "PTSD (post-traumatic stress disorder)", "condition", 13, None, None,
  "After exposure to a traumatic event: intrusion symptoms (memories, nightmares, flashbacks), avoidance, negative changes in thinking and mood, and heightened arousal, lasting more than a month.",
  [DSM], {"flashbacks": 3, "nightmares": 3, "hypervigilance": 3, "avoids_reminders": 3}, ["feelings"])
c("toxic", "☠️", "Toxic (poisonous) behaviour", "behaviour", 13, None, None,
  "A popular, non-clinical term for a repeated pattern of behaviour that harms others' well-being: belittling, manipulation, guilt-induction and chronic victimhood. Useful in everyday language, but not a diagnosis.",
  [], {"backhanded_compliment": 2, "guilt_lever": 2, "victim_mindset": 2, "moves_goalposts": 2, "gossip": 1, "lacks_empathy": 1}, ["boundaries", "empathy", "encouraging"], aliases=["poisoned personality"])
c("lucifer_effect", "🎭", "The Lucifer effect", "idea", 15, None, None,
  "Zimbardo's term for the transformation of ordinary people into perpetrators under situational and systemic pressures (roles, anonymity, authority, dehumanisation). Its main evidence, the 1971 Stanford Prison Experiment, has been strongly criticised for its methods.",
  ["Zimbardo, P. (2007). The Lucifer Effect: Understanding How Good People Turn Evil. Random House.", "Le Texier, T. (2019). Debunking the Stanford Prison Experiment. American Psychologist, 74(7), 823–839."], {}, ["conscience", "boundaries"])

# --- personality disorders: Cluster A (odd, eccentric) ---
PD = "A personality disorder is a long-lasting pattern of inner experience and behaviour that differs markedly from cultural expectations, is inflexible, begins by adolescence or early adulthood, and causes distress or impairment. Only a qualified clinician can diagnose it."
c("paranoid_pd", "🕵️", "Paranoid personality disorder", "disorder", 16,
  "Someone who trusts nobody and believes people are secretly against them, without proof.", "Clinicians and therapy; a calm, honest and predictable way of talking helps build trust.",
  "Cluster A. Pervasive distrust and suspiciousness: others' motives are read as malevolent. Suspects exploitation without basis, doubts loyalty, won't confide, reads threats into benign remarks, bears grudges, perceives attacks on character and counter-attacks quickly. " + PD,
  [DSM, ICD], {"suspicious": 3, "reads_threats": 3, "resentment_brewing": 3, "wont_confide": 2, "intense_anger": 1, "guards_relationship": 1}, ["thinking"], cluster="A")
c("schizoid_pd", "🐚", "Schizoid personality disorder", "disorder", 16,
  "Someone who prefers to be alone almost always and shows very little feeling.", "Respecting their need for space; clinicians if they are suffering.",
  "Cluster A. Pervasive detachment from social relationships and a restricted range of emotional expression: no desire for close relationships, solitary activities, little pleasure, indifference to praise or criticism, emotional coldness. " + PD,
  [DSM, ICD], {"avoids_people": 3, "no_close_friends": 3, "cold_emotions": 3, "indifferent_praise": 2}, [], cluster="A")
c("schizotypal_pd", "🔮", "Schizotypal personality disorder", "disorder", 16,
  "Someone with unusual beliefs, an unusual way of talking or dressing, and great discomfort with close relationships.", "Clinicians; patience and acceptance.",
  "Cluster A. Acute discomfort with close relationships plus cognitive or perceptual distortions and eccentric behaviour: ideas of reference, odd beliefs or magical thinking, unusual perceptions, odd speech, suspiciousness, social anxiety that does not lessen with familiarity. " + PD,
  [DSM, ICD], {"odd_beliefs": 3, "odd_speech": 2, "odd_behaviour": 2, "suspicious": 2, "no_close_friends": 2, "anxiety_social": 2}, [], cluster="A")
# --- Cluster B (dramatic, emotional, erratic) ---
c("antisocial_pd", "⛔", "Antisocial personality disorder", "disorder", 16,
  "Someone who keeps breaking rules, lying and hurting others without feeling sorry.", "Clinicians and the law; people around them need protection and clear limits.",
  "Cluster B. Pervasive disregard for and violation of the rights of others: unlawful behaviour, deceitfulness, impulsivity, aggressiveness, reckless disregard for safety, consistent irresponsibility and lack of remorse. Diagnosed only from age 18, with evidence of conduct disorder before 15. " + PD,
  [DSM, ICD], {"breaks_rules": 3, "deceitful": 3, "no_remorse": 3, "impulsive": 2, "aggressive": 2, "reckless": 2, "irresponsible": 2, "charm_manipulative": 1}, ["conscience", "empathy"], cluster="B")
c("bpd", "🌊", "Borderline personality disorder (BPD)", "disorder", 16, None,
  "Doctors and therapists: Dialectical Behaviour Therapy (DBT) has good evidence; patience and clear boundaries from others.",
  "Cluster B. Pervasive instability of relationships, self-image and emotions, with marked impulsivity: frantic efforts to avoid abandonment, idealisation-devaluation, identity disturbance, impulsivity, recurrent self-harm or suicidal behaviour, affective instability, chronic emptiness, intense anger, and stress-related paranoid ideas or dissociation. " + PD,
  [DSM, ICD, "Linehan, M. M. (1993). Cognitive-Behavioral Treatment of Borderline Personality Disorder. Guilford Press."],
  {"fear_abandonment": 3, "idealize_devalue": 3, "unstable_identity": 3, "mood_swings": 3, "unstable_relationships": 3, "impulsive": 2, "feels_empty": 2, "intense_anger": 2, "black_white_thinking": 2, "self_risk": 2}, ["feelings", "boundaries", "thinking"], cluster="B", aliases=["BPD"])
c("histrionic_pd", "🎬", "Histrionic personality disorder", "disorder", 16,
  "Someone who always needs to be the centre of attention, with big, dramatic feelings that change fast.", "Clinicians and therapy.",
  "Cluster B. Pervasive excessive emotionality and attention-seeking: discomfort when not the centre of attention, rapidly shifting and shallow emotions, use of appearance to draw attention, theatricality, suggestibility, and considering relationships more intimate than they are. " + PD,
  [DSM, ICD], {"attention_seeking": 3, "shallow_emotions": 3, "theatrical": 3, "easily_influenced": 2, "needs_admiration": 1}, ["feelings"], cluster="B")
c("narcissistic", "🪞", "Narcissistic personality disorder", "disorder", 16, None,
  "Doctors and therapists. People around them may need strong boundaries.",
  "Cluster B. Pervasive pattern of grandiosity (in fantasy or behaviour), need for admiration and lack of empathy: inflated self-importance, fantasies of success or power, belief in being special, entitlement, exploitation, envy, arrogance. Research describes two forms: grandiose and vulnerable (\"covert\"). " + PD,
  [DSM, ICD, "Pincus, A. L., & Lukowitsky, M. R. (2010). Pathological narcissism and narcissistic personality disorder. Annual Review of Clinical Psychology, 6, 421–446."],
  {"grandiosity": 3, "needs_admiration": 3, "entitlement": 3, "lacks_empathy": 3, "exploits_others": 2, "envy_others": 2, "arrogant_attitude": 2, "hypersensitive_criticism": 2, "fragile_self_esteem": 1}, ["empathy", "confidence"], cluster="B", aliases=["narcissist"])
c("grandiose_narcissism", "👑", "Grandiose (overt) narcissism", "disorder", 16,
  "The loud kind: openly shows off, dominates and expects admiration.", "Clear limits; not feeding the need for admiration.",
  "Subtype described in research (not a separate DSM diagnosis): overt self-enhancement, dominance, exhibitionism, entitlement and interpersonal exploitation, with relatively high self-reported self-esteem.",
  ["Wink, P. (1991). Two faces of narcissism. Journal of Personality and Social Psychology, 61(4), 590–597.", "Pincus & Lukowitsky (2010), see above."],
  {"grandiosity": 3, "needs_admiration": 3, "arrogant_attitude": 3, "attention_seeking": 2, "charm_manipulative": 2, "exploits_others": 2}, ["confidence", "empathy"], parent="narcissistic", cluster="B", aliases=["overt narcissist"])
c("vulnerable_narcissism", "🫥", "Vulnerable (covert) narcissism", "disorder", 16,
  "The quiet kind: seems shy or modest, but secretly feels special, is deeply hurt by criticism, envies others and holds grudges.", "Therapy; honest, steady relationships with clear boundaries.",
  "Subtype described in research (\"covert narcissism\" in popular language; not a separate DSM diagnosis): hidden grandiose expectations with shame, hypersensitivity to evaluation, social withdrawal, resentment, envy and fragile self-esteem.",
  ["Wink, P. (1991). Two faces of narcissism. Journal of Personality and Social Psychology, 61(4), 590–597.", "Pincus & Lukowitsky (2010), see above."],
  {"hidden_superiority": 3, "hypersensitive_criticism": 3, "fragile_self_esteem": 3, "envy_others": 2, "resentment_brewing": 2, "shame_prone": 2, "victim_mindset": 2, "needs_admiration": 2, "entitlement": 2}, ["confidence", "gratitude"], parent="narcissistic", cluster="B", aliases=["covert narcissist", "covert narcissism"])
c("malignant_narcissism", "🦂", "Malignant narcissism", "disorder", 18,
  "The most dangerous mix: narcissism with cruelty, suspicion and no guilt.", "Professionals; the people hurt need protection.",
  "A clinical concept from Otto Kernberg (not a DSM diagnosis): narcissistic personality combined with antisocial behaviour, ego-syntonic aggression or sadism, and paranoid features.",
  ["Kernberg, O. F. (1984). Severe Personality Disorders: Psychotherapeutic Strategies. Yale University Press."],
  {"grandiosity": 3, "no_remorse": 3, "exploits_others": 3, "suspicious": 2, "aggressive": 2, "enjoys_suffering": 2}, ["empathy", "conscience"], parent="narcissistic", cluster="B", acad_age=18)
# --- Cluster C (anxious, fearful) ---
c("avoidant_pd", "🙈", "Avoidant personality disorder", "disorder", 16,
  "Someone who wants friends but stays away from people because they are terrified of being judged.", "Therapy; gentle, patient friends.",
  "Cluster C. Pervasive social inhibition, feelings of inadequacy and hypersensitivity to negative evaluation: avoids contact for fear of criticism, restrained in close relationships, preoccupied with rejection, views self as inferior, reluctant to take risks. " + PD,
  [DSM, ICD], {"fear_rejection": 3, "feels_inadequate": 3, "anxiety_social": 2, "avoid_new": 2, "shame_prone": 2}, ["confidence", "assertive"], cluster="C")
c("dependent_pd", "🧲", "Dependent personality disorder", "disorder", 16,
  "Someone who can't make choices alone, can't say no, and is terrified of being left on their own.", "Therapy that builds confidence and independence.",
  "Cluster C. Pervasive, excessive need to be taken care of, leading to submissive, clinging behaviour and fears of separation: difficulty with everyday decisions, needs others to take responsibility, can't disagree, discomfort when alone. " + PD,
  [DSM, ICD], {"needs_reassurance": 3, "clingy": 3, "cant_disagree": 3, "fear_abandonment": 1}, ["assertive", "decisions"], cluster="C")
c("ocpd", "📐", "Obsessive-compulsive personality disorder (OCPD)", "disorder", 16,
  "Someone so focused on rules, order and perfection that work never gets finished and friends come last. Different from OCD.", "Therapy; learning that \"good enough\" is OK.",
  "Cluster C. Pervasive preoccupation with orderliness, perfectionism and control at the expense of flexibility and efficiency: rules and lists, perfectionism that blocks completion, devotion to work, rigidity, reluctance to delegate, hoarding of worthless objects. Unlike OCD, the pattern usually feels right to the person. " + PD,
  [DSM, ICD], {"perfectionism": 3, "rigid_rules": 3, "workaholic": 2, "controlling": 2, "cant_throw_away": 1}, ["thinking"], cluster="C")
# --- dark traits ---
c("dark_triad", "🌑", "The dark triad", "idea", 16,
  "Three dark personality traits that often go together: narcissism, Machiavellianism (scheming) and psychopathy (cold, no guilt).", "Knowing the signs helps protect yourself.",
  "Three overlapping, socially aversive traits measured in the general population (not diagnoses): narcissism, Machiavellianism and subclinical psychopathy. Shared core: callousness and manipulation.",
  ["Paulhus, D. L., & Williams, K. M. (2002). The dark triad of personality. Journal of Research in Personality, 36(6), 556–563."],
  {"grandiosity": 2, "cynical_strategic": 3, "lacks_empathy": 3, "charm_manipulative": 2, "no_remorse": 2}, ["empathy", "conscience"])
c("dark_tetrad", "🌚", "The dark tetrad", "idea", 18,
  "The dark triad plus everyday sadism: enjoying other people's pain.", "Knowing the signs helps protect yourself.",
  "The dark triad plus everyday sadism, which predicts cruelty beyond the other three traits.",
  ["Buckels, E. E., Jones, D. N., & Paulhus, D. L. (2013). Behavioral confirmation of everyday sadism. Psychological Science, 24(11), 2201–2209."],
  {"enjoys_suffering": 3, "cynical_strategic": 2, "lacks_empathy": 3, "no_remorse": 2, "grandiosity": 1}, ["empathy", "conscience"], acad_age=18)
c("machiavellianism", "♟️", "Machiavellianism", "idea", 15,
  "Treating people as pieces in a game: charming, calculating, and always working for themselves.", "Noticing patterns, not words; keeping your own boundaries.",
  "Dark-triad trait named after Niccolò Machiavelli: cynical views of human nature, strategic manipulation and a focus on self-interest over morality. Measured with the Mach-IV scale.",
  ["Christie, R., & Geis, F. L. (1970). Studies in Machiavellianism. Academic Press."], {"cynical_strategic": 3, "charm_manipulative": 2, "deceitful": 2, "exploits_others": 2}, ["conscience"], parent="dark_triad")
c("psychopathy", "🧊", "Psychopathy", "idea", 16,
  "Very cold personality: no guilt, no fear, charming on the outside, and often reckless.", "Professionals; protection for others.",
  "A personality construct (not a DSM diagnosis; overlaps with antisocial PD): shallow affect, callousness, lack of remorse, superficial charm, impulsivity and irresponsibility. Assessed in research and forensic settings with Hare's PCL-R.",
  ["Hare, R. D. (2003). The Hare Psychopathy Checklist–Revised (2nd ed.). Multi-Health Systems."], {"no_remorse": 3, "lacks_empathy": 3, "charm_manipulative": 2, "cold_emotions": 2, "impulsive": 2, "reckless": 1}, ["empathy", "conscience"], parent="dark_triad")
c("sadism", "🖤", "Sadism", "disorder", 18, None, None,
  "Enjoyment of others' pain or humiliation. \"Everyday sadism\" is studied as the fourth dark-tetrad trait. (Sadistic personality disorder appeared only in the appendix of DSM-III-R and is not a current diagnosis.)",
  ["Buckels, E. E., Jones, D. N., & Paulhus, D. L. (2013). Behavioral confirmation of everyday sadism. Psychological Science, 24(11), 2201–2209."],
  {"enjoys_suffering": 3, "lacks_empathy": 2, "schadenfreude": 2, "aggressive": 1}, ["empathy", "conscience"], parent="dark_tetrad")
# --- manipulation tactics ---
c("character_assassination", "🗡️", "Character assassination", "tactic", 10,
  "Trying to ruin someone's good name by spreading bad stories about them, true or not.", "Stay calm, keep facts, tell trusted people; don't spread it further.",
  "A deliberate, sustained effort to damage a person's reputation and credibility, through rumours, distortion, ridicule or selective disclosure.",
  ["Samoilenko, S. A., Icks, M., Keohane, J., & Shiraev, E. (Eds.) (2020). Routledge Handbook of Character Assassination and Reputation Management. Routledge."],
  {"spreads_rumours": 3, "gossip": 3, "blames_own_flaws": 1}, ["truthful", "empathy"], aliases=["smear campaign"])
c("silent_assassination", "🫢", "Silent character assassination", "tactic", 11,
  "Quiet damage to someone's name: small hints, \"worried\" whispers and compliments with a sting, so nobody can say they attacked.", "Ask directly, \"What do you mean?\"; speak to the person, not about them.",
  "A covert form of reputational aggression (also called a whisper campaign): innuendo, feigned concern, backhanded compliments and strategic omissions that preserve the aggressor's deniability. Related to relational/indirect aggression.",
  ["Crick, N. R., & Grotpeter, J. K. (1995). Relational aggression, gender, and social-psychological adjustment. Child Development, 66(3), 710–722."],
  {"concerned_gossip": 3, "backhanded_compliment": 3, "spreads_rumours": 2, "gossip": 2}, ["truthful", "empathy"], parent="character_assassination", aliases=["whisper campaign"])
c("gaslighting", "🌫️", "Gaslighting", "tactic", 13,
  "Making someone doubt their own memory or feelings: \"That never happened\", \"You're too sensitive\".", "Write things down; check with people you trust; your feelings are real.",
  "Manipulation that leads a target to doubt their own perceptions, memory or sanity. Named after the play and film Gaslight (1938/1944); described sociologically as rooted in power inequalities.",
  ["Sweet, P. L. (2019). The sociology of gaslighting. American Sociological Review, 84(5), 851–875."],
  {"denies_reality": 3, "isolates_target": 2, "moves_goalposts": 1, "turns_tables": 1}, ["truthful"])
c("triangulation", "🔺", "Triangulation", "tactic", 13,
  "Pulling a third person into a problem between two people, to win or to make someone jealous.", "Talk directly to the person you have the problem with.",
  "Bowen family-systems concept: a two-person relationship under tension draws in a third person to stabilise it; used manipulatively to gain allies or provoke jealousy.",
  ["Bowen, M. (1978). Family Therapy in Clinical Practice. Jason Aronson."], {"uses_third_person": 3, "gossip": 1}, ["boundaries"])
c("love_bombing", "💝", "Love bombing", "tactic", 15,
  "Too much love, gifts and attention too fast, so the other person becomes attached and easier to control.", "Healthy relationships grow slowly; watch what happens after the start.",
  "Overwhelming displays of affection and attention early in a relationship to create dependence. The term comes from studies of cult recruitment in the 1970s.",
  [], {"too_much_too_soon": 3, "isolates_target": 1, "charm_manipulative": 1}, ["boundaries"])
c("silent_treatment", "🤫", "The silent treatment", "tactic", 8,
  "Stopping talking to someone on purpose, to punish them.", "Say \"I'm upset and need time\" instead; then talk.",
  "Deliberate withdrawal of communication as punishment or control: a form of ostracism that threatens belonging, self-esteem, control and meaningful existence.",
  ["Williams, K. D. (2001). Ostracism: The Power of Silence. Guilford Press."], {"silent_punishment": 3}, ["feelings", "assertive"])
c("stonewalling", "🧱", "Stonewalling", "tactic", 12,
  "Shutting down in an argument: no answers, no looking, like talking to a wall.", "Take a short break, then come back to talk.",
  "Emotional and conversational withdrawal during conflict; one of Gottman's \"Four Horsemen\" that predict relationship breakdown.",
  ["Gottman, J. M. (1994). What Predicts Divorce? Lawrence Erlbaum."], {"shuts_down": 3}, ["feelings"])
c("darvo", "🔃", "DARVO", "tactic", 15,
  "When caught: Deny it, Attack the person who complained, and act like the real victim.", "Stick to the facts; get support.",
  "Deny, Attack, Reverse Victim and Offender: a response pattern of perpetrators when held accountable, which increases the doubt and self-blame of the accuser.",
  ["Freyd, J. J. (1997). Violations of power, adaptive blindness, and betrayal trauma theory. Feminism & Psychology, 7(1), 22–32."],
  {"turns_tables": 3, "denies_reality": 2, "victim_mindset": 2}, ["responsibility"])
c("projection", "📽️", "Projection", "tactic", 12,
  "Blaming someone else for your own bad feelings or faults.", "Ask, \"Is this really about me?\"",
  "A defence mechanism in which one's own unacceptable impulses, feelings or traits are attributed to others.",
  ["Freud, A. (1936). The Ego and the Mechanisms of Defence."], {"blames_own_flaws": 3}, ["self_honesty"])
c("guilt_tripping", "🎗️", "Guilt-tripping", "tactic", 9,
  "Making someone feel guilty so they do what you want: \"After all I did for you…\"", "You can be kind and still say no.",
  "Inducing guilt as an interpersonal influence strategy to gain compliance; effective in close relationships but breeds resentment.",
  ["Baumeister, R. F., Stillwell, A. M., & Heatherton, T. F. (1994). Guilt: An interpersonal approach. Psychological Bulletin, 115(2), 243–267."],
  {"guilt_lever": 3, "victim_mindset": 1}, ["assertive"])
c("hoovering", "🧹", "Hoovering", "tactic", 16,
  "After hurting someone and leaving, coming back with sweet promises to pull them back in.", "Look at what they do, not what they promise.",
  "Popular (non-clinical) term for attempts to draw a person back into a harmful relationship through affection, promises or crises.",
  [], {"comes_back_sweet": 3, "too_much_too_soon": 1, "guilt_lever": 1}, ["boundaries"])
# --- emotions ---
c("envy", "💚", "Envy", "emotion", 7,
  "The painful feeling of wanting what someone else has. It is normal; what we do with it matters.", "Gratitude, focusing on your own path, and turning envy into effort.",
  "An unpleasant emotion arising when another person has an advantage in a domain relevant to oneself. Research links it to perceived inferiority, low self-esteem, zero-sum beliefs and low gratitude.",
  ["Smith, R. H., & Kim, S. H. (2007). Comprehending envy. Psychological Bulletin, 133(1), 46–64.", "McCullough, M. E., Emmons, R. A., & Tsang, J.-A. (2002). The grateful disposition. Journal of Personality and Social Psychology, 82(1), 112–127."],
  {"wants_what_others_have": 3, "inferiority": 3, "envy_others": 2, "zero_sum": 1, "no_gratitude": 1}, ["gratitude", "confidence", "mindset"], aliases=["حسد"])
c("benign_envy", "🪜", "Benign envy (the useful kind)", "emotion", 9,
  "Envy that makes you try harder: \"I want to be good at that too.\"", "Learn from the person; ask how they did it.",
  "Envy that motivates moving oneself up (\"levelling up\"), without wishing harm to the other.",
  ["van de Ven, N., Zeelenberg, M., & Pieters, R. (2009). Leveling up and down: The experiences of benign and malicious envy. Emotion, 9(3), 419–429."],
  {"improves_self": 3, "wants_what_others_have": 2}, ["drive"], parent="envy", aliases=["غبطة"])
c("malicious_envy", "🪓", "Malicious envy (the harmful kind)", "emotion", 10,
  "Envy that wants the other person to lose what they have.", "Gratitude, talking about it, and seeing that their success doesn't take yours away.",
  "Envy that motivates pulling the other down (\"levelling down\"), associated with schadenfreude and hostile behaviour.",
  ["van de Ven, N., Zeelenberg, M., & Pieters, R. (2009). Leveling up and down: The experiences of benign and malicious envy. Emotion, 9(3), 419–429."],
  {"pulls_down": 3, "schadenfreude": 2, "gossip": 1, "backhanded_compliment": 1, "spreads_rumours": 1}, ["gratitude", "mindset"], parent="envy")
c("jealousy", "🫣", "Jealousy", "emotion", 7,
  "The fear of losing someone you love to another person. Everyone feels it sometimes; it becomes a problem when it controls you.", "Talking about the fear, building trust, and healthy self-esteem.",
  "An emotion triggered by a perceived threat to a valued relationship from a rival. Different from envy (wanting what another has). Normal and partly evolved; stronger with low self-esteem and insecure attachment.",
  ["Buss, D. M. (2000). The Dangerous Passion: Why Jealousy Is as Necessary as Love and Sex. Free Press."],
  {"jealous_rival": 3, "guards_relationship": 2, "fear_abandonment": 1, "suspicious": 1}, ["confidence"], aliases=["غيرة"])

# characters: (name, signs {key: strength}, condition strengths {key: strength}, new trait values) — updates to v56 characters, plus new ones
UPD = {
 "Hamza": ({"no_gratitude": 2, "envy_others": 2, "zero_sum": 1}, {"envy": 2}, {"gratitude": -2, "thinking": -1}),
 "Sami": ({"lies_often": 3, "turns_tables": 1}, {"lying": 2}, {}),
 "Omar": ({"picks_on_weaker": 3, "aggressive": 2, "lacks_empathy": 2}, {"bullying": 3}, {"assertive": 2}),
 "Noor": ({"cant_disagree": 3}, {}, {"assertive": -2}),
 "Tariq": ({"hides_with_jokes": 3, "rumination": 1}, {"funny_mask": 2}, {}),
 "Kareem": ({"needs_routine": 3, "sensory": 2, "deep_interests": 3, "social_cues": 2}, {"autism": 2}, {}),
 "Dana": ({"intrusive_thoughts": 3, "compulsions": 3}, {"ocd": 2}, {}),
 "Lina": ({"feels_inadequate": 3, "no_try": 2}, {"low_self_esteem": 3}, {"gratitude": 0}),
 "Captain Faris": ({"flashbacks": 2, "nightmares": 3, "hypervigilance": 3}, {"ptsd": 2}, {}),
 "Mr. Basil": ({"backhanded_compliment": 2, "moves_goalposts": 3, "guilt_lever": 1}, {"toxic": 3}, {}),
 "Guard Kamal": ({}, {"lucifer_effect": 2}, {}),
 "Victor": ({"grandiosity": 3, "needs_admiration": 3, "entitlement": 2, "lacks_empathy": 2, "charm_manipulative": 2}, {"narcissistic": 2, "grandiose_narcissism": 3}, {}),
 "Rania": ({"fear_abandonment": 3, "idealize_devalue": 2, "mood_swings": 3}, {"bpd": 2}, {"thinking": -2}),
 "The Shadow": ({"enjoys_suffering": 3}, {"sadism": 3}, {}),
 "Fox the Trickster": ({"lies_often": 2}, {}, {"gratitude": -1}),
 "Bear Baba": ({}, {}, {"gratitude": 0, "thinking": 0}),
 "Grandpa Yusuf": ({}, {}, {"gratitude": 0, "thinking": 0, "assertive": 0}),
 "Zaid": ({}, {}, {"assertive": -1}),
}
T = lambda **k: k
NEW = [
 ("Salwa", "👩", 13, "female", "middle", "trouble", "Always \"worried\" about her classmates, and somehow their secrets spread. Her compliments sting.",
  T(gratitude=-2, empathy=-1, confidence=-1, mindset=-1), {"concerned_gossip": 3, "backhanded_compliment": 3, "envy_others": 2}, {"silent_assassination": 3, "malicious_envy": 2}),
 ("Yara", "👧", 11, "female", "primary", "friend", "Gets upset when her best friend plays with someone new; she's afraid of being replaced.",
  T(confidence=-1, thinking=-1, empathy=1), {"jealous_rival": 2, "guards_relationship": 1}, {"jealousy": 2}),
 ("Ziad", "👦", 12, "male", "middle", "hero", "When his friend won the prize, he asked how she practised, and started practising too.",
  T(gratitude=1, drive=1, mindset=0), {"improves_self": 3, "wants_what_others_have": 1}, {"benign_envy": 2}),
 ("Tamer", "🧒", 10, "male", "primary", "trouble", "When he doesn't get his way, he stops talking to you for days, or reminds you of everything he ever did for you.",
  T(assertive=-1, feelings=1, responsibility=-1), {"silent_punishment": 3, "guilt_lever": 2}, {"silent_treatment": 2, "guilt_tripping": 2}),
 ("Nadim", "🧑", 19, "male", "university", "rival", "Quiet and modest on the outside; inside he feels he deserves more than everyone, and every criticism wounds him for weeks.",
  T(confidence=-1, gratitude=-2, thinking=-1), {"hidden_superiority": 3, "hypersensitive_criticism": 3, "envy_others": 2, "resentment_brewing": 2}, {"vulnerable_narcissism": 3}),
 ("Jad", "🕴️", 32, "male", "university", "trouble", "Sweet and generous at first. Later he says things never happened, and when caught, he's the one who is hurt.",
  T(truthful=-2, empathy=-2, boundaries=-2), {"too_much_too_soon": 3, "denies_reality": 3, "turns_tables": 3, "isolates_target": 2}, {"love_bombing": 2, "gaslighting": 3, "darvo": 2}),
 ("Uncle Fawzi", "👴", 61, "male", "university", "family", "His lists have lists. The family trip is cancelled again because the plan isn't perfect yet.",
  T(feelings=1, thinking=-1, drive=2), {"perfectionism": 3, "rigid_rules": 3, "workaholic": 2, "cant_throw_away": 2}, {"ocpd": 2}),
 ("Sara", "👩", 22, "female", "university", "friend", "Can't choose a dress, a course or a meal without asking three people, and never disagrees.",
  T(assertive=-2, decisions=-2, confidence=-1), {"needs_reassurance": 3, "clingy": 2, "cant_disagree": 3}, {"dependent_pd": 2}),
 ("Hiba", "👩", 25, "female", "university", "hero", "Wants friends badly but turns down every invitation, sure that people will laugh at her.",
  T(confidence=-2, assertive=-1), {"fear_rejection": 3, "feels_inadequate": 3, "avoid_new": 2}, {"avoidant_pd": 2}),
 ("Lady Lamia", "💃", 30, "female", "high", "rival", "Every room becomes her stage; her feelings are huge and change by the minute.",
  T(feelings=-1, boundaries=-1), {"attention_seeking": 3, "theatrical": 3, "shallow_emotions": 2, "easily_influenced": 2}, {"histrionic_pd": 2}),
 ("Mr. Hakim", "🧔", 55, "male", "high", "rival", "Trusts nobody, keeps every grudge, and hears insults in a simple \"good morning\".",
  T(thinking=-2, empathy=-1), {"suspicious": 3, "reads_threats": 3, "resentment_brewing": 3, "wont_confide": 2}, {"paranoid_pd": 2}),
 ("Mr. Wolf", "🐺", 40, "male", "university", "trouble", "Charming in meetings, cold behind closed doors; people are pieces in his game, and he never feels sorry.",
  T(empathy=-2, conscience=-2, truthful=-2), {"cynical_strategic": 3, "charm_manipulative": 3, "no_remorse": 3}, {"dark_triad": 3, "machiavellianism": 3, "psychopathy": 2}),
]

out = [f"""-- =====================================================================
-- Helper Academy — v57: 🔎 signs, personality-disorder clusters A/B/C (with subtypes), manipulation tactics, envy & jealousy,
--   academic text and sources, traits gratitude / thinking / assertive, and characters with sign and condition strengths.
--   Our own wording; the DSM-5-TR criteria text is not copied. Built by tools/characters/build_v57.py
-- =====================================================================
alter table public.conditions drop constraint if exists conditions_kind_check;
alter table public.conditions add constraint conditions_kind_check check (kind in ('issue','behaviour','condition','disorder','idea','tactic','emotion'));
alter table public.conditions add column if not exists parent text, add column if not exists cluster text, add column if not exists academic text,
  add column if not exists sources text[] not null default '{{}}', add column if not exists academic_min_age int not null default 16;
create table if not exists public.signs (key text primary key, icon text, name text not null, category text not null, min_age int not null default 0,
  about text, academic text, position int not null default 0);
create table if not exists public.condition_signs (condition text not null references public.conditions(key) on delete cascade, sign text not null references public.signs(key) on delete cascade,
  weight int not null default 2 check (weight between 1 and 3), primary key (condition, sign));
alter table public.signs enable row level security; alter table public.condition_signs enable row level security;
grant select on public.signs, public.condition_signs to anon, authenticated;
drop policy if exists "read signs for my age" on public.signs; create policy "read signs for my age" on public.signs for select using (min_age <= public.viewer_age());
drop policy if exists "read condition signs" on public.condition_signs; create policy "read condition signs" on public.condition_signs for select using (true);
alter table public.characters add column if not exists signs jsonb not null default '{{}}'::jsonb, add column if not exists cond_levels jsonb not null default '{{}}'::jsonb;
-- academic text only for older readers: a view-safe helper
create or replace function public.condition_academic(p_key text) returns text language sql stable security definer set search_path = public as $$
  select case when public.viewer_age() >= academic_min_age then academic end from public.conditions where key = p_key and min_age <= public.viewer_age()
$$;
grant execute on function public.condition_academic(text) to anon, authenticated;
"""]
# traits
rows = []
for p, (k, ic, n, fam, ma, v, lo, mid, hi, note) in enumerate(TRAITS):
    rows.append(f"({q(k)},{q(ic)},{q(n)},{q(fam)},{ma},{'true' if v else 'false'},{q(lo[0])},{q(lo[1])},{q(lo[2])},{q(mid[0])},{q(mid[1])},{q(hi[0])},{q(hi[1])},{q(hi[2])},{q(note or None)},{20 + p})")
out.append("insert into public.traits (key, icon, name, family, min_age, varies_by_place, low_name, low_self, low_others, mid_name, mid_text, high_name, high_self, high_others, place_note, position) values\n" + ",\n".join(rows) +
  "\non conflict (key) do update set icon=excluded.icon, name=excluded.name, family=excluded.family, min_age=excluded.min_age, varies_by_place=excluded.varies_by_place, low_name=excluded.low_name, low_self=excluded.low_self, low_others=excluded.low_others, mid_name=excluded.mid_name, mid_text=excluded.mid_text, high_name=excluded.high_name, high_self=excluded.high_self, high_others=excluded.high_others, place_note=excluded.place_note, position=excluded.position;")
# signs
keys = set()
rows = []
for p, (k, ic, n, cat, ma, kid, ac) in enumerate(SIGNS):
    assert k not in keys, k; keys.add(k)
    rows.append(f"({q(k)},{q(ic)},{q(n)},{q(cat)},{ma},{q(kid or None)},{q(ac)},{p})")
out.append("insert into public.signs (key, icon, name, category, min_age, about, academic, position) values\n" + ",\n".join(rows) +
  "\non conflict (key) do update set icon=excluded.icon, name=excluded.name, category=excluded.category, min_age=excluded.min_age, about=excluded.about, academic=excluded.academic, position=excluded.position;")
# conditions (existing keep their about/helps when None)
tk = {"boundaries", "feelings", "responsibility", "empathy", "decisions", "self_honesty", "conscience", "mindset", "outlook", "encouraging", "drive", "confidence", "truthful", "humour"} | {t[0] for t in TRAITS}
ck = {x["key"] for x in C}
rows = []; links = []
for p, x in enumerate(C):
    assert set(x["signs"]) <= keys, (x["key"], set(x["signs"]) - keys); assert set(x["traits"]) <= tk, x["key"]
    assert x["parent"] is None or x["parent"] in ck, x["key"]
    rows.append(f"({q(x['key'])},{q(x['icon'])},{q(x['name'])},{q(x['kind'])},{q(x['parent'])},{q(x['cluster'])},{x['min_age']},{A(x['aliases'])},{q(x['about'])},{q(x['helps'])},{q(x['academic'])},{A(x['sources'])},{A(x['traits'])},{x['acad_age']},{p})")
    links += [f"({q(x['key'])},{q(s)},{w})" for s, w in x["signs"].items()]
out.append("insert into public.conditions as c (key, icon, name, kind, parent, cluster, min_age, aliases, about, helps, academic, sources, traits, academic_min_age, position) values\n" + ",\n".join(rows) +
  "\non conflict (key) do update set icon=excluded.icon, name=excluded.name, kind=excluded.kind, parent=excluded.parent, cluster=excluded.cluster, min_age=excluded.min_age, aliases=excluded.aliases, about=coalesce(excluded.about, c.about), helps=coalesce(excluded.helps, c.helps), academic=excluded.academic, sources=excluded.sources, traits=excluded.traits, academic_min_age=excluded.academic_min_age, position=excluded.position;")
out.append("delete from public.condition_signs where condition in (" + ",".join(q(k) for k in ck) + ");")
out.append("insert into public.condition_signs (condition, sign, weight) values\n" + ",\n".join(links) + ";")
# a condition's age is never below the age of its parent; signs of a condition stay visible only from their own age
sage = {s[0]: s[4] for s in SIGNS}; cage = {x["key"]: x["min_age"] for x in C}
CAGE = lambda cs: max([0] + [cage[k] for k in cs])
SAGE = lambda ss: max([0] + [sage[k] for k in ss])
for n, (sg, cl, tr) in UPD.items():
    assert set(sg) <= keys and set(cl) <= ck and set(tr) <= tk, n
    out.append(f"update public.characters set signs = {J(sg)}, cond_levels = {J(cl)}, conditions = (select array(select distinct unnest(conditions || {A(list(cl))}))), traits = traits || {J(tr)}, min_age = greatest(min_age, {max(CAGE(cl), SAGE(sg))}) where id = md5('char:'||{q(n)})::uuid;")
rows = []
for n, e, age, sex, ed, role, bio, tr, sg, cl in NEW:
    assert set(sg) <= keys and set(cl) <= ck and set(tr) <= tk, n
    ma = max(CAGE(cl), SAGE(sg))
    rows.append(f"(md5('char:'||{q(n)})::uuid,{q(n)},{q(e)},{age},{q(sex)},{q(ed)},{q(role)},{ma},{q(bio)},{J(tr)},{A(list(cl))},{J(sg)},{J(cl)})")
out.append("insert into public.characters (id, name, emoji, age, sex, education, role, min_age, bio, traits, conditions, signs, cond_levels) values\n" + ",\n".join(rows) +
  "\non conflict (id) do update set name=excluded.name, emoji=excluded.emoji, age=excluded.age, sex=excluded.sex, education=excluded.education, role=excluded.role, min_age=excluded.min_age, bio=excluded.bio, traits=excluded.traits, conditions=excluded.conditions, signs=excluded.signs, cond_levels=excluded.cond_levels;")
out.append("select (select count(*) from public.signs) as signs, (select count(*) from public.conditions) as conditions, (select count(*) from public.condition_signs) as links, (select count(*) from public.traits) as traits, (select count(*) from public.characters) as characters;")
open("supabase_v57_signs.sql", "w").write("\n".join(out) + "\n")
print(len(SIGNS), "signs", len(C), "conditions", len(links), "links", len(NEW), "new characters")
