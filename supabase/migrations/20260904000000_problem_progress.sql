create table public.problem_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  problem_id integer not null check (problem_id > 0),
  completed_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, problem_id)
);

create index problem_progress_user_completed_at_idx
  on public.problem_progress (user_id, completed_at desc);

alter table public.problem_progress enable row level security;

create policy "Users can read their own problem progress"
  on public.problem_progress
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can add their own problem progress"
  on public.problem_progress
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can remove their own problem progress"
  on public.problem_progress
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);
