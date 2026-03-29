-- Fix handle_new_user trigger to use username from registration metadata
-- This allows the username field in the Register form to be correctly saved.

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
