-- Word effects: the Hunger scene (a man goes Full → Starving over 10 hours; in a meter only the man shows)
insert into public.word_effects (effect, emoji, trigger_words, kind, page_bound, in_meter) values
('Hunger','🍽️','full,peckish,hungry,ravenous,famished,starving,starve,starved,hunger,appetite,underfed,empty stomach','game',false,'box')
on conflict (effect) do nothing;
