-- =====================================================================
-- Helper Academy — v54: ⏳ Verbs: every verb in one set, with its forms on a time line
--   * public.irregular_verbs: base, past, past participle (read by everyone)
--   * public.verb_lemmas: dictionary words kept in another form → their base (Scampering → scamper)
--   * set "Verbs: Time Travel" (00000000-0000-4000-8000-0000000007e5): ⚡ Irregular, ✅ Regular (-ed), 🧩 Phrasal verbs
--     every word tagged Action or Phrasal verb, now and later (a trigger adds new verbs by itself)
--   * two new verbs: Lie (tell a lie) and Lie (lie down), to show the same word with different forms
-- The time line itself (had lied … will have lied) is built on the page by js/tense.js.
-- Safe to re-run. Run AFTER v53.
-- =====================================================================
create table if not exists public.irregular_verbs (base text primary key, past text not null, pp text not null);
alter table public.irregular_verbs enable row level security;
drop policy if exists "anyone reads irregular verbs" on public.irregular_verbs;
create policy "anyone reads irregular verbs" on public.irregular_verbs for select to anon, authenticated using (true);
grant select on public.irregular_verbs to anon, authenticated;
insert into public.irregular_verbs (base, past, pp) values
('be', 'was', 'been'),('have', 'had', 'had'),('do', 'did', 'done'),('go', 'went', 'gone'),('get', 'got', 'got'),('give', 'gave', 'given'),('take', 'took', 'taken'),('make', 'made', 'made'),('come', 'came', 'come'),('see', 'saw', 'seen'),('know', 'knew', 'known'),('think', 'thought', 'thought'),('say', 'said', 'said'),('tell', 'told', 'told'),('find', 'found', 'found'),('feel', 'felt', 'felt'),('keep', 'kept', 'kept'),('leave', 'left', 'left'),('let', 'let', 'let'),('put', 'put', 'put'),('set', 'set', 'set'),('run', 'ran', 'run'),('sit', 'sat', 'sat'),('stand', 'stood', 'stood'),('write', 'wrote', 'written'),('speak', 'spoke', 'spoken'),('break', 'broke', 'broken'),('build', 'built', 'built'),('buy', 'bought', 'bought'),('bring', 'brought', 'brought'),('catch', 'caught', 'caught'),('teach', 'taught', 'taught'),('fight', 'fought', 'fought'),('sell', 'sold', 'sold'),('pay', 'paid', 'paid'),('hit', 'hit', 'hit'),('cut', 'cut', 'cut'),('quit', 'quit', 'quit'),('shed', 'shed', 'shed'),('throw', 'threw', 'thrown'),('grow', 'grew', 'grown'),('show', 'showed', 'shown'),('sow', 'sowed', 'sown'),('forgive', 'forgave', 'forgiven'),('forbid', 'forbade', 'forbidden'),('withdraw', 'withdrew', 'withdrawn'),('draw', 'drew', 'drawn'),('fly', 'flew', 'flown'),('fall', 'fell', 'fallen'),('wake', 'woke', 'woken'),('speed', 'sped', 'sped'),('dwell', 'dwelt', 'dwelt'),('eat', 'ate', 'eaten'),('drink', 'drank', 'drunk'),('swim', 'swam', 'swum'),('sing', 'sang', 'sung'),('ring', 'rang', 'rung'),('begin', 'began', 'begun'),('win', 'won', 'won'),('lose', 'lost', 'lost'),('send', 'sent', 'sent'),('spend', 'spent', 'spent'),('lend', 'lent', 'lent'),('meet', 'met', 'met'),('read', 'read', 'read'),('hear', 'heard', 'heard'),('hold', 'held', 'held'),('lead', 'led', 'led'),('ride', 'rode', 'ridden'),('hide', 'hid', 'hidden'),('bite', 'bit', 'bitten'),('choose', 'chose', 'chosen'),('freeze', 'froze', 'frozen'),('steal', 'stole', 'stolen'),('wear', 'wore', 'worn'),('tear', 'tore', 'torn'),('forget', 'forgot', 'forgotten'),('understand', 'understood', 'understood'),('sleep', 'slept', 'slept'),('sweep', 'swept', 'swept'),('hang', 'hung', 'hung'),('shine', 'shone', 'shone'),('shoot', 'shot', 'shot'),('shut', 'shut', 'shut'),('spread', 'spread', 'spread'),('light', 'lit', 'lit'),('dig', 'dug', 'dug'),('feed', 'fed', 'fed'),('blow', 'blew', 'blown'),('drive', 'drove', 'driven'),('rise', 'rose', 'risen'),('shake', 'shook', 'shaken'),('mean', 'meant', 'meant'),('seek', 'sought', 'sought')
on conflict (base) do update set past = excluded.past, pp = excluded.pp;

create table if not exists public.verb_lemmas (word text primary key, base text not null);
alter table public.verb_lemmas enable row level security;
drop policy if exists "anyone reads verb lemmas" on public.verb_lemmas;
create policy "anyone reads verb lemmas" on public.verb_lemmas for select to anon, authenticated using (true);
grant select on public.verb_lemmas to anon, authenticated;
insert into public.verb_lemmas (word, base) values
('approved', 'approve'),('arguing', 'argue'),('awarded', 'award'),('bestowed', 'bestow'),('clashing', 'clash'),('considered', 'consider'),('couched', 'couch'),('crouching', 'crouch'),('demanded', 'demand'),('deteriorating', 'deteriorate'),('divided', 'divide'),('dozed', 'doze'),('faked', 'fake'),('flowing', 'flow'),('improving', 'improve'),('insisted', 'insist'),('molting', 'molt'),('moved', 'move'),('napped', 'nap'),('nicknamed', 'nickname'),('observed', 'observe'),('peers', 'peer'),('pretended', 'pretend'),('printed', 'print'),('published', 'publish'),('ratified', 'ratify'),('regarded', 'regard'),('relocated', 'relocate'),('represented', 'represent'),('retreated', 'retreat'),('rocked', 'rock'),('rustled', 'rustle'),('scampering', 'scamper'),('scurrying', 'scurry'),('separated', 'separate'),('shedding', 'shed'),('stomped', 'stomp'),('stooping', 'stoop'),('swayed', 'sway'),('symbolized', 'symbolize'),('whipped', 'whip'),('withdrew', 'withdraw'),('worsening', 'worsen')
on conflict (word) do update set base = excluded.base;

insert into public.study_sets (id, owner_id, author_name, institution_id, subject_id, level_code, title, description, language, translation_lang, units, visibility, story_box)
select '00000000-0000-4000-8000-0000000007e5', (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com'), 'Ab', null, 1, 'any',
       'Verbs: Time Travel', 'Every action word with its forms (lie, lied, lying…) on a time line from long ago to the future.', 'en', 'ar',
       '[{"u": 1, "name": "⚡ Irregular verbs"},{"u": 2, "name": "✅ Regular verbs (-ed)"},{"u": 3, "name": "🧩 Phrasal verbs"}]'::jsonb, 'public', 'words'
on conflict (id) do update set title = excluded.title, description = excluded.description, units = excluded.units, story_box = excluded.story_box;

-- which unit a verb belongs to
create or replace function public.verb_unit(p_head text, p_sense text, p_tags text[]) returns int language sql stable set search_path = public as $$
  select case when 'Phrasal verb' = any(p_tags) then 3
              when exists (select 1 from irregular_verbs i where i.base = coalesce((select base from verb_lemmas l where l.word = lower(split_part(p_head, ' ', 1))), lower(split_part(p_head, ' ', 1))))
                   or lower(p_sense) like '%down%' then 1
              else 2 end
$$;
-- every verb joins the Verbs set (when it is added, or when it is tagged Action / Phrasal verb later)
create or replace function public.add_to_verbs_set() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.lang = 'en' and ('Action' = any(new.tags) or 'Phrasal verb' = any(new.tags))
     and not exists (select 1 from set_entries e where e.set_id = '00000000-0000-4000-8000-0000000007e5' and e.word_id = new.id) then
    insert into set_entries (id, set_id, position, kind, unit, also_units, word_id, term)
    values (md5('verbs' || new.id::text)::uuid, '00000000-0000-4000-8000-0000000007e5', 10000, 'term', verb_unit(new.headword, new.sense, new.tags), '{}', new.id,
            case when new.sense <> '' then new.headword || ' (' || new.sense || ')' end)
    on conflict (id) do nothing;
  end if;
  return new;
end $$;
drop trigger if exists words_add_to_verbs_set on public.words;
create trigger words_add_to_verbs_set after insert or update of tags on public.words for each row execute function public.add_to_verbs_set();

-- the two Lies
insert into public.words (lang, headword, sense, meaning, example, translation, syllables, pronunciation, emoji, tags, owner_id)
select 'en', 'Lie', v.s, v.m, v.e, v.t, 'lie', 'LY', v.j, v.tg, (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = 'albarq2000@hotmail.com')
from (values
  ('tell a lie', 'To say something that you know is not true.', 'Never [lie] to your friends.', 'يكذب', '🤥', array['Action','Getting along','Character','≈ Betrayal','⇄ Honest vs. lying: lying']::text[]),
  ('lie down', 'To rest with your body flat on a bed or on the ground.', 'I [lie] on the grass and watch the clouds.', 'يستلقي', '🛌', array['Action','Health & body']::text[])
) as v(s, m, e, t, j, tg)
on conflict (lang, lower(headword), sense) do nothing;

-- all the verbs already in the dictionary, in A–Z order
insert into public.set_entries (id, set_id, position, kind, unit, also_units, word_id, term)
select md5('verbs' || w.id::text)::uuid, '00000000-0000-4000-8000-0000000007e5', row_number() over (order by lower(w.headword), w.sense), 'term', public.verb_unit(w.headword, w.sense, w.tags), '{}', w.id,
       case when w.sense <> '' then w.headword || ' (' || w.sense || ')' end
from public.words w
where w.lang = 'en' and ('Action' = any(w.tags) or 'Phrasal verb' = any(w.tags))
  and not exists (select 1 from public.set_entries e where e.set_id = '00000000-0000-4000-8000-0000000007e5' and e.word_id = w.id)
on conflict (id) do nothing;
-- keep A–Z order and the right unit (also for verbs added by the trigger)
update public.set_entries e set position = x.n, unit = public.verb_unit(w.headword, w.sense, w.tags)
  from (select e2.id, row_number() over (order by lower(w2.headword), w2.sense) n from public.set_entries e2 join public.words w2 on w2.id = e2.word_id where e2.set_id = '00000000-0000-4000-8000-0000000007e5') x,
       public.words w
 where e.id = x.id and w.id = e.word_id;

-- check
select (select count(*) from public.set_entries where set_id = '00000000-0000-4000-8000-0000000007e5') as verbs,
       (select count(*) from public.set_entries where set_id = '00000000-0000-4000-8000-0000000007e5' and unit = 1) as irregular,
       (select count(*) from public.set_entries where set_id = '00000000-0000-4000-8000-0000000007e5' and unit = 2) as regular,
       (select count(*) from public.set_entries where set_id = '00000000-0000-4000-8000-0000000007e5' and unit = 3) as phrasal;
