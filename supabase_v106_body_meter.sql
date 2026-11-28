-- Helper Academy — v106: Body meter (shivering ⇄ sweating) on the Temperature word, and the Hot street egg learns the body words.
insert into public.word_partners (word_id, kind, phrase, partner, position, tags, owner_id)
select w.id, x.kind, x.phrase, x.partner, x.pos, array[x.tag],
  (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')
from (values
  ('temperature','verb','teeth chatter','chatter','📶 Body · shivering ⇄ sweating: -5',700),
  ('temperature','verb','shiver','shiver','📶 Body · shivering ⇄ sweating: -4',701),
  ('temperature','verb','get goosebumps','goosebumps','📶 Body · shivering ⇄ sweating: -3',702),
  ('temperature','verb','hug yourself','hug','📶 Body · shivering ⇄ sweating: -2',703),
  ('temperature','verb','see your breath','breath','📶 Body · shivering ⇄ sweating: -2',704),
  ('temperature','verb','flush','flush','📶 Body · shivering ⇄ sweating: +2',705),
  ('temperature','verb','sweat','sweat','📶 Body · shivering ⇄ sweating: +3',706),
  ('temperature','verb','pant','pant','📶 Body · shivering ⇄ sweating: +4',707),
  ('temperature','verb','drip with sweat','drip','📶 Body · shivering ⇄ sweating: +5',708)
) as x(hw, kind, phrase, partner, tag, pos)
join public.words w on w.lang = 'en' and lower(w.headword) = x.hw and w.sense = ''
on conflict (word_id, lower(phrase)) do update set tags = excluded.tags, partner = excluded.partner, kind = excluded.kind;

update public.word_effects set trigger_words = 'temperature,thermometer,degrees,celsius,fahrenheit,teeth chatter,chattering,shiver,shivering,goosebumps,get goosebumps,hug yourself,see your breath,flush,flushed,sweat,sweating,pant,panting,drip with sweat'
where effect = 'Hot street';

select count(*) as body_partners from public.word_partners p join public.words w on w.id = p.word_id where lower(w.headword) = 'temperature' and exists (select 1 from unnest(p.tags) t where t like '📶 Body%');
