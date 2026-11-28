-- Idiom easter eggs: silly word-for-word scene, flip to the real meaning, one-question check and a rhyme.
insert into public.word_effects (effect, emoji, trigger_words, kind, page_bound, in_meter) values
('Spill the beans','🫘','spill the beans,spilled the beans,spilling the beans','game',false,'off'),
('Cat out of the bag','🐈','let the cat out of the bag,lets the cat out of the bag,let the cat out','game',false,'off'),
('Break the ice','🧊','break the ice,broke the ice,breaking the ice','game',false,'off')
on conflict (effect) do nothing;
