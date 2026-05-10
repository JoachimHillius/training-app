-- ============================================================
-- ProGrip JP — Migration 001: core schema
-- Run this in the Supabase SQL editor (project → SQL editor → New query)
-- ============================================================


-- ── profiles ──────────────────────────────────────────────────
-- One row per user. Created automatically via trigger on signup.

create table if not exists public.profiles (
  user_id          uuid        primary key references auth.users(id) on delete cascade,
  full_name        text,
  assigned_program text        check (assigned_program in ('10_week', '3_month', '6_month', '1on1')),
  current_week     integer     not null default 1,
  created_at       timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users can only see their own row
create policy "profiles: own select"
  on public.profiles for select
  using (auth.uid() = user_id);

-- Users can update their own row (name, etc.)
create policy "profiles: own update"
  on public.profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Needed so the trigger can insert on signup
create policy "profiles: own insert"
  on public.profiles for insert
  with check (auth.uid() = user_id);

-- Admin operations (assigning programs, listing all users) bypass RLS
-- by using the service-role client in the app server — no extra policy needed.


-- ── day_completions ───────────────────────────────────────────
-- One row per (user, program, week, day). Upserted when a day is saved.

create table if not exists public.day_completions (
  id             uuid        primary key default gen_random_uuid(),
  user_id        uuid        not null references auth.users(id) on delete cascade,
  program_type   text        not null,
  week_number    integer     not null,
  day_number     integer     not null check (day_number between 1 and 7),
  completed_at   timestamptz not null default now(),
  notes_text     text,
  created_at     timestamptz not null default now(),

  -- prevents duplicate rows; enables ON CONFLICT upsert in the app
  unique (user_id, program_type, week_number, day_number)
);

alter table public.day_completions enable row level security;

create policy "day_completions: own select"
  on public.day_completions for select
  using (auth.uid() = user_id);

create policy "day_completions: own insert"
  on public.day_completions for insert
  with check (auth.uid() = user_id);

create policy "day_completions: own update"
  on public.day_completions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "day_completions: own delete"
  on public.day_completions for delete
  using (auth.uid() = user_id);


-- ── auto-create profile on user signup ────────────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

-- Drop first so re-running this file is safe
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
