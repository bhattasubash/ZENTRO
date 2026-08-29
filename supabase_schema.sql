-- Run this SQL in your Supabase Dashboard -> SQL Editor (or migrations)

-- 1. Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  plan text default 'free' not null check (plan in ('free', 'pro')),
  stripe_customer_id text,
  stripe_subscription_id text,
  updated_at timestamptz default now()
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Trigger to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Create roadmaps table
create table if not exists public.roadmaps (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  idea text not null,
  data jsonb not null,
  created_at timestamptz default now() not null,
  is_shared boolean default false,
  share_token text unique
);

-- Enable RLS for roadmaps
alter table public.roadmaps enable row level security;

create policy "Users can read own roadmaps"
  on public.roadmaps for select
  using (auth.uid() = user_id);

create policy "Users can insert own roadmaps"
  on public.roadmaps for insert
  with check (auth.uid() = user_id);

create policy "Users can update own roadmaps"
  on public.roadmaps for update
  using (auth.uid() = user_id);

create policy "Users can delete own roadmaps"
  on public.roadmaps for delete
  using (auth.uid() = user_id);

create policy "Anyone can view shared roadmaps with token"
  on public.roadmaps for select
  using (is_shared = true and share_token is not null);
