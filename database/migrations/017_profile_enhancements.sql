-- ============================================================
-- 017: Profile Enhancements
-- ============================================================

-- 1. Add avatar_url column to users table
alter table users
    add column if not exists avatar_url text default null;

-- 2. Supabase Storage bucket for avatars
-- NOTE: Create the bucket manually in Supabase Dashboard:
--   Storage → New Bucket → name: "avatars" → Public
-- Then add the following policies in the Supabase Storage policies UI:

-- Allow authenticated users to upload/replace their own avatar
-- insert: (auth.uid())::text = (storage.foldername(name))[1]
-- update: (auth.uid())::text = (storage.foldername(name))[1]

-- 3. RPC to update avatar_url after upload
create or replace function update_avatar_url(p_user_id uuid, p_url text)
returns void
language plpgsql
security definer
as $$
begin
    update users set avatar_url = p_url where id = p_user_id;
end;
$$;

-- 4. RPC to update username
create or replace function update_username(p_user_id uuid, p_username text)
returns void
language plpgsql
security definer
as $$
begin
    if length(trim(p_username)) < 3 then
        raise exception 'Username must be at least 3 characters';
    end if;
    update users set username = trim(p_username), updated_at = now()
    where id = p_user_id;
end;
$$;
