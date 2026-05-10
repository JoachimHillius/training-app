alter table public.day_completions
  add column if not exists exercises_completed jsonb default '[]'::jsonb;
