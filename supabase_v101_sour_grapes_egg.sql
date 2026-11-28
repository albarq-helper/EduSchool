insert into public.word_effects (effect, emoji, trigger_words, kind, page_bound, in_meter) values
('Sour grapes','🍇','sour grapes,sour grape','game',false,'off')
on conflict (effect) do nothing;
