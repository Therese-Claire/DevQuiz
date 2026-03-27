-- Remove unused password_hash column from public.users (Supabase Auth handles passwords)

alter table if exists public.users
  drop column if exists password_hash;
