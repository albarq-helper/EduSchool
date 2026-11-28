-- Spill the beans: the Arabic saying with the same idea, in everyday speech
update public.words set equivalent = 'كب العشاء', updated_at = now() where lang = 'en' and lower(headword) = 'spill the beans';
update public.set_entries set equivalent = 'كب العشاء' where equivalent = 'باح بالسرّ' and word_id in (select id from public.words where lang = 'en' and lower(headword) = 'spill the beans');
