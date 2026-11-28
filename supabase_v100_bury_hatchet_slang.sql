-- Bury the hatchet: keep the standard saying and add the everyday slang next to it
update public.words set equivalent = 'طوى صفحة الخلاف · طاح الحطب (بالعامية)', updated_at = now() where lang = 'en' and lower(headword) = 'bury the hatchet' and equivalent = 'طوى صفحة الخلاف';
update public.set_entries set equivalent = 'طوى صفحة الخلاف · طاح الحطب (بالعامية)' where equivalent = 'طوى صفحة الخلاف' and word_id in (select id from public.words where lang = 'en' and lower(headword) = 'bury the hatchet');
