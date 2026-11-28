-- Spill the beans: keep the standard saying and add the everyday slang next to it
update public.words set equivalent = 'باح بالسرّ · كب العشاء (بالعامية)', updated_at = now() where lang = 'en' and lower(headword) = 'spill the beans';
update public.set_entries set equivalent = 'باح بالسرّ · كب العشاء (بالعامية)' where word_id in (select id from public.words where lang = 'en' and lower(headword) = 'spill the beans') and equivalent is not null;
