-- =====================================================================
-- Helper Academy — v60: ⚖️ double standards (moral hypocrisy) and a fuller projection
-- =====================================================================
insert into public.signs (key, icon, name, category, min_age, about, academic, position) values
 ('double_standard', '🪙', 'Different rules for me and for you', 'tactics', 8, 'Expects you to follow rules they break themselves: they can be late, you can''t.', 'Double standards: judging others'' behaviour more harshly than the same behaviour in oneself (moral hypocrisy).', 210),
 ('excuses_self', '🧴', 'Excuses for themselves, blame for you', 'tactics', 9, 'When they do it, "I was tired"; when you do it, "You''re lazy".', 'Actor–observer asymmetry used self-servingly: one''s own lapses are blamed on circumstances, others'' on their character.', 211),
 ('preaches_not_practices', '📢', 'Says one thing, does another', 'tactics', 8, 'Gives lectures about kindness or honesty, but doesn''t do it.', 'Discrepancy between espoused moral standards and actual conduct.', 212),
 ('thinks_all_alike', '🪞', 'Thinks everyone is like them', 'tactics', 10, 'Someone who lies thinks everyone lies; someone who cheats suspects everyone of cheating.', 'Projection of one''s own motives onto others (assumed similarity), often used to justify suspicion or attack.', 213)
on conflict (key) do update set icon=excluded.icon, name=excluded.name, category=excluded.category, min_age=excluded.min_age, about=excluded.about, academic=excluded.academic, position=excluded.position;

insert into public.conditions (key, icon, name, kind, parent, cluster, min_age, aliases, about, helps, academic, sources, traits, academic_min_age, position) values
 ('double_standards', '⚖️', 'Double standards (hypocrisy)', 'tactic', null, null, 8, array['الكيل بمكيالين'],
  'Using one set of rules for yourself and a stricter one for others: "I can, you can''t". It often goes together with projection.',
  'Ask calmly, "Would it be OK if I did the same?"; use the same rules for everyone, starting with yourself.',
  'Moral hypocrisy: appearing moral while avoiding the cost of acting morally, and judging others'' transgressions more harshly than one''s own. Experiments show people rate the same unfair act as less unfair when they commit it themselves.',
  array['Batson, C. D., Kobrynowicz, D., Dinnerstein, J. L., Kampf, H. C., & Wilson, A. D. (1997). In a very different voice: Unmasking moral hypocrisy. Journal of Personality and Social Psychology, 72(6), 1335–1348.',
        'Valdesolo, P., & DeSteno, D. (2007). Moral hypocrisy: Social groups and the flexibility of virtue. Psychological Science, 18(8), 689–690.'],
  array['self_honesty','responsibility','truthful'], 16, 160)
on conflict (key) do update set icon=excluded.icon, name=excluded.name, kind=excluded.kind, min_age=excluded.min_age, aliases=excluded.aliases, about=excluded.about, helps=excluded.helps, academic=excluded.academic, sources=excluded.sources, traits=excluded.traits;

update public.conditions set about = 'Blaming someone else for your own bad feelings or faults, or believing everyone is like you: the liar thinks everyone lies.',
  academic = 'A defence mechanism in which one''s own unacceptable impulses, feelings or traits are attributed to others. In conflict it is used to deflect blame and to justify suspicion of others.'
where key = 'projection';

delete from public.condition_signs where condition in ('double_standards', 'projection');
insert into public.condition_signs (condition, sign, weight) values
 ('double_standards','double_standard',3), ('double_standards','excuses_self',3), ('double_standards','preaches_not_practices',2), ('double_standards','entitlement',1), ('double_standards','blames_own_flaws',1), ('double_standards','moves_goalposts',1),
 ('projection','blames_own_flaws',3), ('projection','thinks_all_alike',3), ('projection','suspicious',1), ('projection','excuses_self',1)
on conflict do nothing;
insert into public.condition_signs (condition, sign, weight) values ('toxic','double_standard',2), ('narcissistic','double_standard',1) on conflict do nothing;

insert into public.trait_links (src_type, src_key, src_level, dst_type, dst_key, dst_level, effect, strength, note) values
 ('trait','self_honesty','low','condition','double_standards',null,'raises',2,null),
 ('trait','responsibility','low','condition','double_standards',null,'raises',1,null),
 ('sign','entitlement',null,'condition','double_standards',null,'raises',2,null),
 ('condition','narcissistic',null,'condition','double_standards',null,'raises',2,null),
 ('condition','projection',null,'condition','double_standards',null,'raises',1,'Seeing your own faults in others makes it easy to judge them more harshly than yourself.'),
 ('root','fear_not_enough',null,'condition','projection',null,'raises',1,null),
 ('trait','self_honesty','mid','condition','double_standards',null,'lowers',2,null),
 ('condition','projection',null,'sign','suspicious',null,'raises',1,null);

insert into public.advice (target_type, target_key, word_id, position)
select v.t, v.k, v.w::uuid, v.p from (values
 ('condition','double_standards','5b646ede-efb0-4625-b45c-80adbfef571e',0), ('condition','double_standards','c6fcf56c-5711-4637-8926-4d1459e45e94',1),
 ('condition','double_standards','25dd63f7-9c4d-4383-b3a3-36c895728274',2), ('condition','double_standards','dbcfe8f3-0d05-4219-a5c7-8417053e8231',3),
 ('condition','projection','25dd63f7-9c4d-4383-b3a3-36c895728274',2), ('sign','double_standard','5b646ede-efb0-4625-b45c-80adbfef571e',0)
) as v(t, k, w, p) where exists (select 1 from public.words x where x.id = v.w::uuid) on conflict do nothing;

update public.characters set signs = signs || '{"double_standard":3,"excuses_self":2}'::jsonb, cond_levels = cond_levels || '{"double_standards":2}'::jsonb,
  conditions = (select array(select distinct unnest(conditions || array['double_standards']))) where id = md5('char:Mr. Basil')::uuid;
update public.characters set signs = signs || '{"double_standard":2,"thinks_all_alike":1}'::jsonb, cond_levels = cond_levels || '{"double_standards":2,"projection":1}'::jsonb,
  conditions = (select array(select distinct unnest(conditions || array['double_standards','projection']))) where id = md5('char:Victor')::uuid;
update public.characters set signs = signs || '{"preaches_not_practices":2}'::jsonb where id = md5('char:Aunt Mona')::uuid;

select (select count(*) from public.signs) as signs, (select count(*) from public.conditions) as conditions,
  (select count(*) from public.condition_signs where condition in ('double_standards','projection')) as links, (select count(*) from public.advice where target_key in ('double_standards','projection','double_standard')) as advice;
