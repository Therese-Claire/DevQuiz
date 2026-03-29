-- Consolidated Registration & Profile Synchronization Fix
-- RUN THIS IN YOUR SUPABASE SQL EDITOR

-- 1. Ensure the function captures metadata correctly
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, username)
  values (
    new.id, 
    new.email, 
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  )
  on conflict (id) do update 
  set 
    email = excluded.email,
    username = coalesce(excluded.username, users.username);
  return new;
end;
$$ language plpgsql security definer;

-- 2. Ensure the trigger is properly attached to auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3. Final verification: ensure the users table doesn't have a mandatory password_hash
-- (Only run this if you haven't run migration 009 already)
-- alter table if exists public.users drop column if exists password_hash;
