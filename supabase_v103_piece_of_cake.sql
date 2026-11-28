insert into public.word_effects (effect, emoji, trigger_words, kind, page_bound, in_meter) values
('Piece of cake','🍰','a piece of cake,piece of cake','game',false,'off')
on conflict (effect) do nothing;
update public.words set equivalent = 'أسهل من شربة ماء · زي شرب الموية (بالعامية)', updated_at = now() where lang = 'en' and lower(headword) = 'a piece of cake' and equivalent = 'أسهل من شربة ماء';
update public.set_entries set equivalent = 'أسهل من شربة ماء · زي شرب الموية (بالعامية)' where equivalent = 'أسهل من شربة ماء' and word_id in (select id from public.words where lang = 'en' and lower(headword) = 'a piece of cake');
