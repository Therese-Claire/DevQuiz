-- DevQuiz PostgreSQL schema (Supabase-compatible)
-- Run this in Supabase SQL Editor or via psql.

-- Enable UUIDs
create extension if not exists "pgcrypto";

-- Users
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  email text not null unique,
  password_hash text not null,
  is_admin boolean not null default false,
  total_score integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Categories
create table if not exists categories (
  id text primary key, -- e.g. 'html', 'css'
  name text not null,
  icon text,
  description text,
  created_at timestamptz not null default now()
);

-- Topics
create table if not exists topics (
  id text not null, -- e.g. 'basics', 'forms' (unique per category)
  category_id text not null references categories(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  primary key (category_id, id)
);

create index if not exists idx_topics_category on topics(category_id);

-- Questions
create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  category_id text not null references categories(id) on delete cascade,
  topic_id text not null,
  question text not null,
  options text[] not null,
  correct_answer text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_questions_category on questions(category_id);
create index if not exists idx_questions_topic on questions(topic_id);

alter table questions
  add constraint questions_topic_fk
  foreign key (category_id, topic_id)
  references topics (category_id, id)
  on delete cascade;

-- Results
create table if not exists results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  category_id text not null references categories(id) on delete cascade,
  topic_id text not null,
  score integer not null,
  total integer not null,
  percentage integer not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_results_user on results(user_id);
create index if not exists idx_results_category on results(category_id);
create index if not exists idx_results_topic on results(topic_id);

alter table results
  add constraint results_topic_fk
  foreign key (category_id, topic_id)
  references topics (category_id, id)
  on delete cascade;

-- View for counts (metadata)
create or replace view question_counts as
select category_id, topic_id, count(*)::int as count
from questions
group by category_id, topic_id;

-- Updated_at trigger
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_users_updated_at on users;
create trigger trg_users_updated_at
before update on users
for each row
execute function set_updated_at();

-- RLS Policies
alter table users enable row level security;
alter table results enable row level security;
alter table questions enable row level security;
alter table categories enable row level security;
alter table topics enable row level security;

-- Users: only owner can read/write their profile
create policy "users_select_own" on users
for select using (auth.uid() = id);

create policy "users_insert_own" on users
for insert with check (auth.uid() = id);

create policy "users_update_own" on users
for update using (auth.uid() = id);

-- Results: only owner can read/insert
create policy "results_select_own" on results
for select using (auth.uid() = user_id);

create policy "results_insert_own" on results
for insert with check (auth.uid() = user_id);

-- Questions/Categories/Topics: public read
create policy "questions_public_read" on questions
for select using (true);

create policy "categories_public_read" on categories
for select using (true);

create policy "topics_public_read" on topics
for select using (true);

-- View (question_counts) inherits from questions, so public read is allowed.

-- Admin-only write policies for categories/topics/questions
create policy "categories_admin_write" on categories
for all
using (exists (select 1 from users where id = auth.uid() and is_admin = true))
with check (exists (select 1 from users where id = auth.uid() and is_admin = true));

create policy "topics_admin_write" on topics
for all
using (exists (select 1 from users where id = auth.uid() and is_admin = true))
with check (exists (select 1 from users where id = auth.uid() and is_admin = true));

create policy "questions_admin_write" on questions
for all
using (exists (select 1 from users where id = auth.uid() and is_admin = true))
with check (exists (select 1 from users where id = auth.uid() and is_admin = true));
