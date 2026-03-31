-- ============================================================
-- 018: Avatar Storage Bucket + RLS Policies
-- ============================================================

-- 1. Create the avatars bucket (safe to run even if it already exists)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'avatars',
    'avatars',
    true,                          -- public bucket (URLs work without auth)
    2097152,                       -- 2 MB limit enforced at bucket level
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
    set public = true,
        file_size_limit = 2097152,
        allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- 2. Drop any old conflicting policies (idempotent)
drop policy if exists "Avatar upload own folder"   on storage.objects;
drop policy if exists "Avatar update own folder"   on storage.objects;
drop policy if exists "Avatar delete own folder"   on storage.objects;
drop policy if exists "Avatar public read"          on storage.objects;

-- 3. INSERT — authenticated users may upload into their own /{userId}/ folder
create policy "Avatar upload own folder"
on storage.objects
for insert
to authenticated
with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (auth.uid())::text
);

-- 4. UPDATE — authenticated users may replace their own avatar
create policy "Avatar update own folder"
on storage.objects
for update
to authenticated
using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (auth.uid())::text
);

-- 5. DELETE — authenticated users may delete their own avatar
create policy "Avatar delete own folder"
on storage.objects
for delete
to authenticated
using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (auth.uid())::text
);

-- 6. SELECT — anyone can read (bucket is public, but the policy is still required)
create policy "Avatar public read"
on storage.objects
for select
to public
using (bucket_id = 'avatars');
