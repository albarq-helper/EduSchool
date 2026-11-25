-- =====================================================================
-- Helper Academy — v64: 🕰️ "the right reply comes too late"
--   * the saying shared online as Dostoevsky's (no source found in his works: kept as "often credited to Dostoevsky")
--   * a new sign: thinks of the right reply too late (l'esprit de l'escalier), with links and advice
-- Run AFTER v63.
-- =====================================================================
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
values ('en',
  'The tragedy of most good people is that they lose their presence of mind at the moment they are attacked, so others take advantage and win short, painful, unfair battles. A peaceful mind and a clean conscience find the right reply only after the moment has passed and the round is lost. This is not stupidity, but a nature that is purer than it should be.',
  '', 'Kind people often freeze when they are attacked and only think of the right answer later. That isn''t stupidity: it comes from a gentle, honest nature. Practising calm, firm replies helps.',
  '',
  'إن مأساة معظم الطيبين هي عدم حضور الذهن والرد لحظة التعرض للهجوم، فيستغلها الآخرون ويفوزون فوزًا غير شرعي بمعارك قصيرة، موجعة. ولا يستحضر الذهن المسالم والضمير السليم الرد الملائم إلا بعد انتهاء الموقف، وخسارة الجولة! ما هذا بغباء، وإنما فطرة نقية أكثر مما ينبغي.',
  '', '', '💬', '', 'Unknown · often credited to Dostoevsky',
  array['Saying','⇄ Kind vs. unkind: kind','⇄ Brave vs. scared: brave'],
  (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com'))
on conflict (lang, lower(headword), sense) do update set meaning = excluded.meaning, translation = excluded.translation, author = excluded.author, tags = excluded.tags;

insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select '00000000-0000-4000-8000-000007eb9007'::uuid, '00000000-0000-4000-8000-000000009007', 2027, 'term', 6, '{}', w.id
from public.words w where w.lang = 'en' and w.sense = '' and w.headword like 'The tragedy of most good people%'
on conflict (id) do nothing;

insert into public.people (name, kind) values ('Fyodor Dostoevsky', 'person') on conflict do nothing;
update public.people set born = '1821', died = '1881', nationality = 'Russia', known_for = 'Novelist: Crime and Punishment, The Idiot, The Brothers Karamazov', emoji = '📚'
  where name = 'Fyodor Dostoevsky' and coalesce(born, '') = '';
delete from public.quote_people l using public.words w where l.word_id = w.id and w.headword like 'The tragedy of most good people%';
insert into public.quote_people (word_id, person_id, role, status, work, source_url, note, checked_at)
select w.id, p.id, 'misattributed', 'disputed', '', '',
  'Shared widely online (mostly in Arabic) as Dostoevsky''s, but no source in his novels, letters or diaries has been found. The idea is close to Diderot''s "l''esprit de l''escalier" (the reply that comes on the staircase, after you leave), and to Prince Myshkin in The Idiot, whose goodness others mistake for foolishness.',
  now()
from public.words w, public.people p where w.headword like 'The tragedy of most good people%' and w.sense = '' and lower(p.name) = 'fyodor dostoevsky'
on conflict do nothing;

-- 🔎 the sign: the right reply comes too late
insert into public.signs (key, icon, name, category, min_age, about, academic, position) values
 ('late_reply', '🕰️', 'Thinks of the right reply too late', 'relationships', 8,
  'Freezes when someone attacks with words, and only later, at home, thinks: "I should have said…"',
  'L''esprit de l''escalier (Diderot): the fitting retort comes only after the moment has passed. Common under acute stress (a freeze response), and in agreeable, conflict-avoidant people; manipulators exploit it by attacking quickly and moving on.', 215)
on conflict (key) do update set icon=excluded.icon, name=excluded.name, category=excluded.category, min_age=excluded.min_age, about=excluded.about, academic=excluded.academic, position=excluded.position;

insert into public.condition_signs (condition, sign, weight) values ('dependent_pd','late_reply',1), ('avoidant_pd','late_reply',1) on conflict do nothing;

delete from public.trait_links where dst_key = 'late_reply' or src_key = 'late_reply';
insert into public.trait_links (src_type, src_key, src_level, dst_type, dst_key, dst_level, effect, strength, note) values
 ('trait','assertive','low','sign','late_reply',null,'raises',3,null),
 ('trait','empathy','high','sign','late_reply',null,'raises',1,'A very kind, people-pleasing nature hesitates to hit back.'),
 ('trait','feelings','high','sign','late_reply',null,'raises',1,null),
 ('root','fear_being_hurt',null,'sign','late_reply',null,'raises',1,'Fear can freeze the mind in the moment.'),
 ('trait','assertive','mid','sign','late_reply',null,'lowers',3,null),
 ('sign','late_reply',null,'sign','rumination',null,'raises',2,'Afterwards the scene plays again and again in the head.');

-- 📜 as advice: for the kind ones who freeze, and wherever someone attacks fast (narcissists, gaslighting, DARVO, smears, bullying, toxic people)
insert into public.advice (target_type, target_key, word_id, position)
select v.t, v.k, w.id, v.p from (values
 ('sign','late_reply',0), ('trait','assertive',2), ('condition','narcissistic',5), ('condition','grandiose_narcissism',5), ('condition','gaslighting',5),
 ('condition','darvo',5), ('condition','character_assassination',5), ('condition','silent_assassination',5), ('condition','toxic',5), ('condition','bullying',5),
 ('condition','dependent_pd',5), ('condition','avoidant_pd',5)
) as v(t, k, p), public.words w where w.headword like 'The tragedy of most good people%' and w.sense = ''
on conflict (target_type, target_key, word_id) do update set position = excluded.position;

-- characters who freeze: the kind people-pleasers
update public.characters set signs = signs || '{"late_reply":3}'::jsonb where id = md5('char:Noor')::uuid;
update public.characters set signs = signs || '{"late_reply":2}'::jsonb where id = md5('char:Sara')::uuid;
update public.characters set signs = signs || '{"late_reply":2}'::jsonb where id = md5('char:Hiba')::uuid;
update public.characters set signs = signs || '{"late_reply":1}'::jsonb where id = md5('char:Rana')::uuid;

select (select count(*) from public.set_entries where set_id = '00000000-0000-4000-8000-000000009007') as quotes,
       (select count(*) from public.advice a join public.words w on w.id = a.word_id where w.headword like 'The tragedy of most good people%') as advice_links,
       (select count(*) from public.characters where signs ? 'late_reply') as characters;
