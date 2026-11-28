insert into public.word_effects (effect, emoji, trigger_words, kind, page_bound, in_meter) values
('Hot street','🌡️','temperature,thermometer,degrees,celsius,fahrenheit','game',false,'box')
on conflict (effect) do nothing;
