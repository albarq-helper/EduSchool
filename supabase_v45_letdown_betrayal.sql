-- =====================================================================
-- Helper Academy — v45: Letdown, Let down, Disappointment, Abandonment, Betrayal, Betray
--   * new dictionary words with meaning, example and Arabic; "Let down" joins Phrasal Verbs (Down)
--   * linked: ≈ Disappointed / ≈ Rejected / new ≈ Betrayal; ⇄ Happy vs. upset, Accepted vs. rejected,
--     Friend vs. enemy, Honest vs. lying (so a story about betrayal finds the friendship and honesty quotes)
--   * new meter "Betrayal → Trust": Trust 0, Letdown -1, Disappointment -2, Abandonment -4, Betrayal -5
--   * the feeling words go into "Feelings: Word Scales" (Sad family); Abandoned gets a clearer Arabic meaning
-- Safe to re-run. Run AFTER v44.
-- =====================================================================
create or replace function pg_temp.add_family_tags(p_head text, p_tags text[]) returns int language plpgsql as $$
declare n int;
begin
  update public.words w set tags = (
      select array(select distinct t from unnest(
        array(select t0 from unnest(w.tags) t0 where not (t0 like '📶 %' and split_part(t0, ':', 1) in (select split_part(x, ':', 1) from unnest(p_tags) x where x like '📶 %')))
        || p_tags) t order by t)), updated_at = now()
  where w.lang = 'en' and lower(w.headword) = lower(p_head) and w.sense = '';
  get diagnostics n = row_count;
  update public.set_entries e set tags = (
      select array(select distinct t from unnest(
        array(select t0 from unnest(e.tags) t0 where not (t0 like '📶 %' and split_part(t0, ':', 1) in (select split_part(x, ':', 1) from unnest(p_tags) x where x like '📶 %')))
        || p_tags) t order by t))
  where e.tags is not null and e.word_id in (select id from public.words where lang = 'en' and lower(headword) = lower(p_head) and sense = '');
  return n;
end $$;

insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, tags, owner_id)
select 'en', v.h, '', v.m, v.e, v.t, v.s, v.p, v.j, '{}'::text[],
       (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')
from (values
  ('Letdown', 'A disappointment: something that is not as good as you hoped.', 'The rainy holiday was a big [letdown].', 'خيبة أمل', 'let-down', 'LET-down', '😞'),
  ('Let down', 'To disappoint someone by not doing what they hoped or expected.', 'Don''t [let down] your team; come to practice.', 'يخذل / يُخيّب ظنّ', 'let down', 'let DOWN', '😔'),
  ('Disappointment', 'The sad feeling when something is not as good as you hoped.', 'To my [disappointment], the shop was closed.', 'خيبة أمل / إحباط', 'dis-ap-point-ment', 'dis-uh-POINT-munt', '😩'),
  ('Abandonment', 'Being left alone by someone when you needed them.', 'After its [abandonment], the puppy found a new home with us.', 'التخلّي / الهجر', 'a-ban-don-ment', 'uh-BAN-dun-munt', '🏚️'),
  ('Betrayal', 'Breaking someone''s trust, especially a friend''s.', 'Telling her secret to everyone was a [betrayal].', 'خيانة / غدر', 'be-tray-al', 'bi-TRAY-ul', '🗡️'),
  ('Betray', 'To break the trust of someone who believed in you.', 'A true friend will never [betray] you.', 'يخون / يغدر', 'be-tray', 'bi-TRAY', '💔')
) as v(h, m, e, t, s, p, j)
on conflict (lang, lower(headword), sense) do nothing;

select count(*) filter (where n = 0) as words_not_found from (values
  (pg_temp.add_family_tags('Letdown', array['Naming: things & places','Feelings & moods','≈ Disappointed','⇄ Happy vs. upset: upset','📶 Betrayal → Trust: -1'])),
  (pg_temp.add_family_tags('Let down', array['Phrasal verb','Feelings & moods','Getting along','≈ Disappointed','⇄ Happy vs. upset: upset'])),
  (pg_temp.add_family_tags('Disappointment', array['Naming: things & places','Feelings & moods','≈ Disappointed','⇄ Happy vs. upset: upset','📶 Betrayal → Trust: -2'])),
  (pg_temp.add_family_tags('Abandonment', array['Naming: things & places','Feelings & moods','Getting along','≈ Rejected','⇄ Accepted vs. rejected: rejected','📶 Betrayal → Trust: -4'])),
  (pg_temp.add_family_tags('Betrayal', array['Naming: things & places','Getting along','Character','≈ Betrayal','⇄ Friend vs. enemy: enemy','⇄ Honest vs. lying: lying','📶 Betrayal → Trust: -5'])),
  (pg_temp.add_family_tags('Betray', array['Action','Getting along','Character','≈ Betrayal','⇄ Friend vs. enemy: enemy','⇄ Honest vs. lying: lying'])),
  (pg_temp.add_family_tags('Trust', array['⇄ Friend vs. enemy: friend','⇄ Honest vs. lying: honest','📶 Betrayal → Trust: 0']))
) as r(n);

-- clearer Arabic for Abandoned (a person, not only a place)
update public.words set translation = 'متروك / يشعر بأنه تُرك وحيداً', updated_at = now()
 where lang = 'en' and sense = '' and headword = 'Abandoned' and translation = 'مهجور / متروك';

-- Feelings: Word Scales (Sad family, unit 11) and Phrasal Verbs (Down, unit 2)
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id)
select ('00000000-0000-4000-8000-' || lpad(to_hex(x.k), 8, '0') || x.sfx)::uuid, x.set_id::uuid, x.k, 'term', x.u, '{}', w.id
from (values
  (3200, 'fee1', '00000000-0000-4000-8000-00000000fee1', 11, 'letdown'),
  (3201, 'fee1', '00000000-0000-4000-8000-00000000fee1', 11, 'disappointment'),
  (3202, 'fee1', '00000000-0000-4000-8000-00000000fee1', 11, 'abandonment'),
  (3203, 'fee1', '00000000-0000-4000-8000-00000000fee1', 11, 'betrayal'),
  (3204, 'fee1', '00000000-0000-4000-8000-00000000fee1', 11, 'betray'),
  (5000, 'f4a5', '00000000-0000-4000-8000-00000000f4a5', 2, 'let down')
) as x(k, sfx, set_id, u, hw)
join public.words w on w.lang = 'en' and lower(w.headword) = x.hw and w.sense = ''
where not exists (select 1 from public.set_entries e where e.set_id = x.set_id::uuid and e.word_id = w.id)
on conflict (id) do nothing;

-- check
select (select count(*) from public.words where lang = 'en' and sense = '' and headword in ('Letdown','Let down','Disappointment','Abandonment','Betrayal','Betray')) as added,
       (select count(*) from public.words w, unnest(w.tags) t where t like '📶 Betrayal → Trust:%') as on_trust_meter,
       (select count(*) from public.set_entries e join public.words w on w.id = e.word_id where e.set_id = '00000000-0000-4000-8000-00000000f4a5' and w.headword = 'Let down') as in_phrasal_verbs;
