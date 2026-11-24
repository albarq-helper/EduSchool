-- =====================================================================
-- Helper Academy — v58: 💚 envy, written more completely
--   envy is not only "wanting what others have": it grows with comparison, competition and a world that feels short of chances,
--   and its harmful side enjoys the other's loss, or destroys, even with no gain for oneself.
-- =====================================================================
insert into public.signs (key, icon, name, category, min_age, about, academic, position) values
 ('compares_always', '⚖️', 'Always compares themselves', 'thinking', 7, 'Keeps checking who has more, who is better, who got more praise.', 'Frequent upward social comparison with similar others in self-relevant domains.', 200),
 ('competes_always', '🏁', 'Turns everything into a competition', 'behaviour', 7, 'Even a game with friends must have a winner, and it must be them.', 'Hypercompetitiveness: an indiscriminate need to compete and win at any cost.', 201),
 ('scarce_opportunities', '🚪', 'Believes there aren''t enough chances', 'thinking', 9, 'Thinks there is only one prize, one place, one chance, so someone else getting it means they never will.', 'Perceived scarcity of opportunities or resources, which makes another''s advantage feel like a personal threat.', 202),
 ('wants_others_lose', '🫳', 'Wishes the other would lose it', 'feelings', 8, 'Doesn''t just want the same thing: wants the other person to lose what they have.', 'Desire for the removal of the other''s advantage (in Arabic, حسد as distinct from غبطة).', 203),
 ('spiteful_harm', '🔥', 'Would lose something just to make you lose more', 'behaviour', 12, 'Would even pay or give something up just so the other person loses, though it brings them nothing.', 'Spiteful, costly destruction of another''s advantage without material gain to oneself.', 204)
on conflict (key) do update set icon=excluded.icon, name=excluded.name, category=excluded.category, min_age=excluded.min_age, about=excluded.about, academic=excluded.academic, position=excluded.position;

update public.conditions set
  about = 'A painful feeling that comes from comparing yourself with someone who has something you want. It grows with competition and when it feels as if there aren''t enough chances for everyone. It has two sides: wanting to have it too, and wanting the other person to lose it. In Arabic: حسد is wishing the good thing would be taken away from the other person; غبطة is wishing to have it too, without them losing it.',
  helps = 'Gratitude for what you have, comparing yourself with your own yesterday, seeing that another person''s success doesn''t take yours away, and turning the feeling into effort.',
  academic = 'An unpleasant emotion arising from upward social comparison with a similar other who has an advantage in a self-relevant domain. Intensified by competition, perceived scarcity and zero-sum beliefs, low self-esteem and low gratitude. Two forms: benign envy (motivation to level up) and malicious envy (motivation to level down: hostility, schadenfreude, and even costly, spiteful destruction of the other''s advantage without personal gain).',
  sources = array['Festinger, L. (1954). A theory of social comparison processes. Human Relations, 7(2), 117–140.',
    'Smith, R. H., & Kim, S. H. (2007). Comprehending envy. Psychological Bulletin, 133(1), 46–64.',
    'van de Ven, N., Zeelenberg, M., & Pieters, R. (2009). Leveling up and down: The experiences of benign and malicious envy. Emotion, 9(3), 419–429.',
    'McCullough, M. E., Emmons, R. A., & Tsang, J.-A. (2002). The grateful disposition. Journal of Personality and Social Psychology, 82(1), 112–127.']
where key = 'envy';
update public.conditions set
  about = 'Envy that wants the other person to lose what they have, and feels good when they fail, even when it brings no gain at all. This is حسد in its full meaning.',
  academic = 'Envy that motivates levelling the other down: hostile thoughts, derogation, schadenfreude at their misfortune, and spiteful behaviour. In economic experiments many participants paid their own money to reduce others'' earnings, with no material benefit to themselves.',
  sources = array['van de Ven, N., Zeelenberg, M., & Pieters, R. (2009). Leveling up and down: The experiences of benign and malicious envy. Emotion, 9(3), 419–429.',
    'van Dijk, W. W., Ouwerkerk, J. W., Goslinga, S., Nieweg, M., & Gallucci, M. (2006). When people fall from grace: Reconsidering the role of envy in schadenfreude. Emotion, 6(1), 156–160.',
    'Zizzo, D. J., & Oswald, A. J. (2001). Are people willing to pay to reduce others'' incomes? Annales d''Économie et de Statistique, 63–64, 39–65.']
where key = 'malicious_envy';
update public.conditions set
  about = 'Envy that makes you try harder: "I want to be good at that too", without wishing the other person to lose anything. In Arabic: غبطة.',
  academic = 'Envy that motivates moving oneself up (levelling up) through effort and learning, without hostility toward the envied person.'
where key = 'benign_envy';

delete from public.condition_signs where condition in ('envy', 'malicious_envy', 'benign_envy');
insert into public.condition_signs (condition, sign, weight) values
 ('envy','compares_always',3), ('envy','inferiority',3), ('envy','wants_what_others_have',3),
 ('envy','competes_always',2), ('envy','scarce_opportunities',2), ('envy','zero_sum',2), ('envy','wants_others_lose',2), ('envy','schadenfreude',2), ('envy','envy_others',2),
 ('envy','no_gratitude',1), ('envy','pulls_down',1),
 ('malicious_envy','wants_others_lose',3), ('malicious_envy','pulls_down',3), ('malicious_envy','schadenfreude',3),
 ('malicious_envy','spiteful_harm',2), ('malicious_envy','gossip',1), ('malicious_envy','backhanded_compliment',1), ('malicious_envy','spreads_rumours',1),
 ('benign_envy','improves_self',3), ('benign_envy','wants_what_others_have',2), ('benign_envy','compares_always',1);

update public.characters set signs = signs || '{"compares_always":2,"scarce_opportunities":1}'::jsonb where id = md5('char:Hamza')::uuid;
update public.characters set signs = signs || '{"wants_others_lose":2,"compares_always":2,"schadenfreude":2}'::jsonb where id = md5('char:Salwa')::uuid;
update public.characters set signs = signs || '{"compares_always":1}'::jsonb where id = md5('char:Ziad')::uuid;

select (select count(*) from public.signs) as signs, (select count(*) from public.condition_signs where condition in ('envy','malicious_envy','benign_envy')) as envy_links;
