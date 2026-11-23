# Helper Academy — Director's Toolbox (v32): camera, light, transitions and music moods for young directors.
# unit|Name|emoji|kid meaning|example ([name] in brackets)|Arabic|film: the instruction sent to the video (or music) AI
DIR_UNITS = ["Shot size", "Camera angle", "Camera move", "Light & weather", "Transitions", "Music & sound"]
DIR = """
1|Wide shot|🏞️|Shows the whole place and everyone in it.|Start with a [wide shot] of the forest.|لقطة واسعة|wide establishing shot showing the whole place
1|Medium shot|🧍|Shows a character from the waist up.|Use a [medium shot] when Rover talks to the cat.|لقطة متوسطة|medium shot, character seen from the waist up
1|Close-up|😮|Shows a face up close, so we can see the feeling.|A [close-up] shows how scared the girl is.|لقطة قريبة|close-up on the character's face showing the emotion
1|Extreme close-up|👁️|Shows one tiny detail very big: an eye, a key, a drop.|An [extreme close-up] of the old key.|لقطة قريبة جداً|extreme close-up on one small detail
1|Two-shot|👫|Shows two characters together in one picture.|A [two-shot] of the two friends laughing.|لقطة لشخصين معاً|two-shot framing both characters together
2|Eye level|👀|The camera is as high as the character's eyes. It feels normal and friendly.|Film the chat at [eye level].|بمستوى العين|eye-level camera angle
2|Low angle|🦸|The camera looks up, so the character looks big and strong.|A [low angle] makes the giant look huge.|زاوية منخفضة|low-angle shot looking up, making the character look big and powerful
2|High angle|🐭|The camera looks down, so the character looks small or scared.|A [high angle] makes the lost mouse look tiny.|زاوية مرتفعة|high-angle shot looking down, the character looks small
2|Bird's-eye view|🦅|The camera looks straight down from the sky.|A [bird's-eye view] of the busy market.|منظور عين الطائر|bird's-eye view from directly above
2|Over-the-shoulder|🗣️|We look past one character's shoulder at the other one.|Use [over-the-shoulder] when they argue.|لقطة من فوق الكتف|over-the-shoulder shot
2|Point of view|🎯|We see what the character sees, through their eyes.|A [point of view] shot as she opens the door.|لقطة من عيني الشخصية|first-person point-of-view shot through the character's eyes
3|Still camera|📷|The camera does not move; only the action moves.|Keep a [still camera] while the cat walks past.|كاميرا ثابتة|static locked-off camera
3|Pan|↔️|The camera turns left or right, like turning your head.|[Pan] across the beach to find the boat.|تحريك أفقي|slow camera pan from left to right
3|Tilt|↕️|The camera tips up or down, like nodding your head.|[Tilt] up the tall tower.|إمالة الكاميرا|camera tilts slowly upward
3|Zoom in|🔍|The picture gets closer and bigger.|[Zoom in] on the secret letter.|تقريب الصورة|slow zoom in
3|Dolly in|🛤️|The whole camera rolls closer to the character.|[Dolly in] as the hero makes a promise.|اقتراب الكاميرا|smooth dolly in toward the character
3|Tracking shot|🏃|The camera moves along with a walking or running character.|A [tracking shot] follows the racing horse.|لقطة متابعة|tracking shot following the character as they move
3|Orbit|🔄|The camera goes all the way around the character.|[Orbit] around the hero at the end.|دوران حول الشخصية|camera orbits 360 degrees around the character
3|Crane up|🏗️|The camera rises high up into the air.|[Crane up] to show the whole city.|رفع الكاميرا إلى الأعلى|crane shot rising up into the sky
3|Shaky camera|📳|The camera shakes, for excitement or danger.|Use a [shaky camera] in the earthquake.|كاميرا مهتزة|handheld shaky camera, tense and exciting
3|Slow motion|🐢|Everything moves slowly, to show a big moment.|Show the winning goal in [slow motion].|حركة بطيئة|slow motion
4|Golden hour|🌅|Warm orange light at sunrise or sunset.|They walk home in the [golden hour].|الساعة الذهبية|warm golden-hour sunlight
4|Night|🌙|Dark blue light with the moon and stars.|The owl wakes up at [night].|ليل|night scene with moonlight and stars
4|Spotlight|🔦|One bright light on the character, dark all around.|A [spotlight] on the singer.|ضوء مسلّط|dramatic spotlight on the character, dark background
4|Rainy|🌧️|Rain, puddles and grey clouds.|A [rainy] street makes the scene feel sad.|ممطر|rainy weather, puddles, grey sky
4|Foggy|🌫️|Soft white fog; things are hard to see. Mysterious!|A [foggy] morning by the lake.|ضبابي|thick mysterious fog
4|Sunny|🌞|Bright sun and blue sky: happy and clear.|A [sunny] picnic in the park.|مشمس|bright sunny day with a blue sky
5|Cut|✂️|Jump straight to the next scene.|[Cut] to the kitchen.|قطع|cut
5|Fade to black|⚫|The picture slowly goes dark. Good for the end.|[Fade to black] after the last line.|تلاشٍ إلى السواد|fade
5|Dissolve|💫|One picture slowly melts into the next one.|[Dissolve] from the day to the night.|مزج|fade
6|Happy ukulele|🎸|Cheerful, bouncy music.|Play [happy ukulele] music at the picnic.|موسيقى مرحة|cheerful bouncy ukulele with handclaps, happy children's music
6|Calm piano|🎹|Soft, gentle piano.|[Calm piano] while she reads her book.|بيانو هادئ|gentle soft solo piano, calm and peaceful
6|Adventure|🗺️|Big orchestra with drums: brave and exciting!|[Adventure] music as the ship sails.|موسيقى مغامرة|epic adventurous orchestral music with drums and brass
6|Spooky|👻|Creepy, mysterious music (not too scary).|[Spooky] music in the old house.|موسيقى غامضة|spooky mysterious music for children, pizzicato strings, not too scary
6|Funny cartoon|🤡|Silly, bouncy cartoon music.|[Funny cartoon] music when the cat slips.|موسيقى كرتونية مضحكة|silly playful cartoon music with bassoon and xylophone
6|Sad violin|🎻|Slow, sad strings.|[Sad violin] when the friends say goodbye.|كمان حزين|slow sad tender violin and cello
6|Lullaby|💤|Sleepy, soft music for bedtime.|A [lullaby] as the baby falls asleep.|تهويدة|soft lullaby with a music box and gentle humming
6|Victory march|🏆|Proud music for winning.|A [victory march] when the team wins.|مارش النصر|triumphant victory march with trumpets and drums
6|Desert journey|🐪|Music with oud and drums, like travelling in the desert.|[Desert journey] music for the camel ride.|موسيقى رحلة الصحراء|Middle Eastern adventure music with oud, qanun and darbuka
6|Sing-along song|🎤|A happy song with singing about the story.|End with a [sing-along song].|أغنية للغناء معاً|upbeat children's sing-along song with a catchy chorus and friendly vocals
"""
