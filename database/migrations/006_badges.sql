-- Streaks and Badges

create table if not exists badges (
  id text primary key,
  name text not null,
  description text,
  icon text
);

create table if not exists user_badges (
  user_id uuid not null references users(id) on delete cascade,
  badge_id text not null references badges(id) on delete cascade,
  awarded_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

create index if not exists idx_user_badges_user on user_badges(user_id);
