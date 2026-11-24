-- =====================================================================
-- Helper Academy — v61: 📜 four Arabic sayings about projection, added to Quotes & Sayings and attached as advice
--   كلٌّ يرى الناس بعين طبعه · al-Shafi'i (attributed) · al-Mutanabbi · Abu al-Ala al-Ma'arri
-- Safe to re-run. Run AFTER v60.
-- =====================================================================
create temp table nq(k int, h text, m text, t text, who text, work text, role text, status text, src text, note text, tags text[], u int);
insert into nq values
 (2023, 'Everyone sees people through the eye of their own nature.',
  'We often judge others by what is inside ourselves: a kind person expects kindness, and someone who lies thinks everyone lies.',
  'كلٌّ يرى الناسَ بعينِ طبعِه.', 'Arabic proverb', '', 'proverb', 'unchecked', '',
  'A common Arabic saying; it describes what psychologists call projection.', array['Saying','⇄ Honest vs. lying: honest'], 6),
 (2024, 'Turn away from the ignorant fool, for everything he said is really about himself. The Euphrates is never harmed if a few dogs wade into it.',
  'Don''t answer a foolish person''s insults: what they say describes them, not you, and it cannot harm someone great.',
  'أَعرِض عَنِ الجاهِلِ السَفيهِ ... فَكُلُّ ما قالَ فَهُوَ فيهِ' || chr(10) || 'ما ضَرَّ بَحرَ الفُراتِ يَوماً ... إِن خاضَ بَعضُ الكِلابِ فيهِ',
  'Al-Shafi''i', '', 'attributed', 'unchecked', '',
  'Verses traditionally attributed to Imam al-Shafi''i (767–820) in the collections of his poetry.', array['Saying','≈ Calm','⇄ Calm vs. angry: calm'], 9),
 (2025, 'When a man''s deeds turn bad, his thoughts about others turn bad too, and he believes the suspicions he is used to. He becomes an enemy of those who love him because of what his enemies say, and lives in a dark night of doubt.',
  'People who do wrong start expecting wrong from everyone, so they push away the very people who love them.',
  'إِذا ساءَ فِعلُ المَرءِ ساءَت ظُنونُهُ ... وَصَدَّقَ ما يَعتادُهُ مِن تَوَهُّمِ' || chr(10) || 'وَعادى مُحِبّيهِ بِقَولِ عُداتِهِ ... وَأَصبَحَ في لَيلٍ مِنَ الشَكِّ مُظلِمِ',
  'Al-Mutanabbi', 'poem (10th century)', 'said', 'verified', '',
  'Two verses by al-Mutanabbi (915–965). In his diwan the first verse ends "وصدّق ما يعتاده من توهّم" (what he is used to imagining); it is often quoted as "ما يخشاه".', array['Saying','≈ Friend','⇄ Honest vs. lying: honest'], 6),
 (2026, 'When the miser Madir calls Hatim al-Ta''i stingy, and Baqil, who could hardly speak, mocks Quss for stumbling words; when the faint star Suha tells the sun "you are hidden", and the night tells the morning "your colour is faded"; when the earth foolishly claims to be taller than the sky, and pebbles boast over the shooting stars…',
  'A world turned upside down: the most famous miser calls the most generous man stingy, the worst speaker mocks the greatest speaker, and darkness accuses the light. People often accuse others of their own faults (projection) and judge with double standards.',
  'إذا وَصَفَ الطائيَّ بالبُخلِ مادِرٌ ... وعَيَّرَ قُسًّا بالفَهاهةِ باقِلُ' || chr(10) || 'وقالَ السُّهى للشمسِ أنتِ خَفيّةٌ ... وقالَ الدُّجى يا صُبحُ لونُكَ حائِلُ' || chr(10) || 'وطاوَلَتِ الأرضُ السماءَ سَفاهةً ... وفاخَرَتِ الشُّهبَ الحَصى والجَنادِلُ',
  'Abu al-Ala al-Ma''arri', 'Saqt al-Zand', 'said', 'verified', '',
  'From al-Ma''arri''s poem "ألا في سبيل المجد ما أنا فاعلُ". Hatim al-Ta''i was famous for generosity, Madir for meanness, Quss ibn Sa''ida for eloquence and Baqil for being unable to speak. The poem''s next verse ("فيا موت زر…", O death, come) is left out here.',
  array['Saying','⇄ Honest vs. lying: honest'], 18);

insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, audio_url, author, tags, owner_id)
select 'en', h, '', m, '', t, '', '', '💬', '', case when who = 'Unknown' then '' else who || case when work <> '' then ' · ' || work else '' end end, tags,
       (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')
from nq on conflict (lang, lower(headword), sense) do nothing;
update public.words w set meaning = nq.m, translation = nq.t, author = case when nq.who = 'Unknown' then '' else nq.who || case when nq.work <> '' then ' · ' || nq.work else '' end end,
       tags = (select array(select distinct x from unnest(w.tags || nq.tags) x order by x))
  from nq where w.lang = 'en' and w.sense = '' and lower(w.headword) = lower(nq.h);

insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select ('00000000-0000-4000-8000-' || lpad(to_hex(nq.k), 8, '0') || '9007')::uuid, '00000000-0000-4000-8000-000000009007', nq.k, 'term', nq.u, '{}', w.id
from nq join public.words w on w.lang = 'en' and w.sense = '' and lower(w.headword) = lower(nq.h)
on conflict (id) do nothing;

insert into public.people (name, kind) select distinct who, case when who ilike '%proverb%' then 'proverb' else 'person' end from nq on conflict do nothing;
update public.people set born = '767', died = '820', nationality = 'Arabia / Egypt', known_for = 'Imam and founder of the Shafi''i school of law; poetry is attributed to him', emoji = '📜' where name = 'Al-Shafi''i' and coalesce(born, '') = '';
update public.people set born = '915', died = '965', nationality = 'Iraq / Syria', known_for = 'One of the greatest Arabic poets', emoji = '🐎' where name = 'Al-Mutanabbi' and coalesce(born, '') = '';
update public.people set born = '973', died = '1057', nationality = 'Syria', known_for = 'Blind poet and philosopher of Ma''arrat al-Nu''man', emoji = '🕯️' where name = 'Abu al-Ala al-Ma''arri' and coalesce(born, '') = '';
delete from public.quote_people l using nq, public.words w where w.lang = 'en' and lower(w.headword) = lower(nq.h) and l.word_id = w.id;
insert into public.quote_people (word_id, person_id, role, status, work, source_url, note, checked_at)
select w.id, p.id, nq.role, nq.status, nq.work, nq.src, nq.note, case when nq.status = 'unchecked' then null else now() end
from nq join public.words w on w.lang = 'en' and w.sense = '' and lower(w.headword) = lower(nq.h)
        join public.people p on lower(btrim(p.name)) = lower(nq.who)
on conflict do nothing;

-- 📜 as advice: projection, double standards, suspicion, insults
insert into public.advice (target_type, target_key, word_id, position)
select v.t, v.k, w.id, v.p from (values
 ('condition','projection',2023,0), ('condition','projection',2025,1), ('condition','projection',2026,2), ('condition','projection',2024,3),
 ('condition','double_standards',2026,0), ('condition','double_standards',2023,4),
 ('sign','thinks_all_alike',2023,0), ('sign','thinks_all_alike',2025,1), ('sign','blames_own_flaws',2024,0), ('sign','blames_own_flaws',2023,1),
 ('sign','suspicious',2025,0), ('condition','paranoid_pd',2025,0), ('condition','character_assassination',2024,0), ('condition','silent_assassination',2024,0)
) as v(t, k, n, p) join nq on nq.k = v.n join public.words w on w.lang = 'en' and w.sense = '' and lower(w.headword) = lower(nq.h)
on conflict (target_type, target_key, word_id) do update set position = excluded.position;
drop table nq;

select (select count(*) from public.set_entries where set_id = '00000000-0000-4000-8000-000000009007') as quotes,
       (select count(*) from public.set_entries where set_id = '00000000-0000-4000-8000-000000009007' and position between 2023 and 2026) as new_quotes,
       (select count(*) from public.advice where target_key in ('projection','double_standards')) as advice_projection,
       (select count(*) from public.quote_people l join public.set_entries e on e.word_id = l.word_id where e.position between 2023 and 2026 and e.set_id = '00000000-0000-4000-8000-000000009007') as linked;
