-- Helper Academy — v104: Temperature meter (freezing ⇄ boiling) in the Word Partners set, with weather effects.
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, tags, owner_id)
select 'en','Temperature','','How hot or cold something is.','The [temperature] dropped a lot at night.','درجة الحرارة','tem-per-a-ture','','🌡️',
  array['Naming: things & places','Plants, nature & weather']::text[],
  (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')
on conflict (lang, lower(headword), sense) do nothing;

insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select gen_random_uuid(), '00000000-0000-4000-8000-00000000c011',
  coalesce((select max(position) from public.set_entries where set_id = '00000000-0000-4000-8000-00000000c011'), 0) + 1, 'term', 1, '{}', w.id
from public.words w where w.lang = 'en' and lower(w.headword) = 'temperature' and w.sense = ''
  and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-00000000c011' and e.word_id = w.id);

insert into public.word_partners (word_id, kind, phrase, partner, position, tags, owner_id)
select w.id, x.kind, x.phrase, x.partner, x.pos, array[x.tag],
  (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')
from (values
  ('temperature','adjective','freezing temperature','freezing','📶 Temperature · freezing ⇄ boiling: -5',600),
  ('temperature','adjective','cold as ice','cold as ice','📶 Temperature · freezing ⇄ boiling: -5',601),
  ('temperature','adjective','icy temperature','icy','📶 Temperature · freezing ⇄ boiling: -4',602),
  ('temperature','adjective','chilled to the bone','chilled to the bone','📶 Temperature · freezing ⇄ boiling: -4',603),
  ('temperature','adjective','chilly temperature','chilly','📶 Temperature · freezing ⇄ boiling: -3',604),
  ('temperature','adjective','cool temperature','cool','📶 Temperature · freezing ⇄ boiling: -1',605),
  ('temperature','adjective','mild temperature','mild','📶 Temperature · freezing ⇄ boiling: 0',606),
  ('temperature','adjective','warm temperature','warm','📶 Temperature · freezing ⇄ boiling: +2',607),
  ('temperature','adjective','hot temperature','hot','📶 Temperature · freezing ⇄ boiling: +3',608),
  ('temperature','adjective','hot as an oven','hot as an oven','📶 Temperature · freezing ⇄ boiling: +4',609),
  ('temperature','adjective','sweltering temperature','sweltering','📶 Temperature · freezing ⇄ boiling: +4',610),
  ('temperature','adjective','boiling temperature','boiling','📶 Temperature · freezing ⇄ boiling: +5',611)
) as x(hw, kind, phrase, partner, tag, pos)
join public.words w on w.lang = 'en' and lower(w.headword) = x.hw and w.sense = ''
on conflict (word_id, lower(phrase)) do update set tags = excluded.tags, partner = excluded.partner;

insert into public.word_effects (effect, emoji, trigger_words, kind, page_bound, in_meter) values
('Freezing','🥶','freezing,frozen,icy,frosty,cold as ice,chilled to the bone','weather',true,'full'),
('Chilly','🧣','chilly,chill,nippy','weather',true,'full'),
('Warm','🌤️','warm,balmy','weather',true,'full'),
('Hot','🔥','hot,baking,hot as an oven','weather',true,'full')
on conflict (effect) do nothing;

select count(*) as temperature_partners from public.word_partners p join public.words w on w.id = p.word_id where lower(w.headword) = 'temperature';
