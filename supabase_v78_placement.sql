-- v78: placement results (the level quiz) — one row per finished quiz
create table if not exists public.placement_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  level text not null check (level in ('Pre-A1','A1','A2','B1','B2','C1','C2')),
  score jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists placement_results_user_idx on public.placement_results(user_id, created_at desc);
alter table public.placement_results enable row level security;
drop policy if exists pr_read on public.placement_results;
create policy pr_read on public.placement_results for select using (user_id = auth.uid() or public.teaches(user_id) or public.is_admin());
drop policy if exists pr_insert on public.placement_results;
create policy pr_insert on public.placement_results for insert with check (user_id = auth.uid());
grant select, insert on public.placement_results to authenticated;
select 'placement_results' as t, count(*) from public.placement_results;
