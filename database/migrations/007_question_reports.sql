-- Question reporting / moderation

create table if not exists question_reports (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references questions(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  reason text not null,
  status text not null default 'open', -- open | reviewed | dismissed
  created_at timestamptz not null default now()
);

create index if not exists idx_question_reports_question on question_reports(question_id);
create index if not exists idx_question_reports_status on question_reports(status);

-- RLS
alter table question_reports enable row level security;

create policy "reports_insert_own" on question_reports
for insert with check (auth.uid() = user_id);

create policy "reports_select_own" on question_reports
for select using (auth.uid() = user_id);

-- Admin can read/update all reports
create policy "reports_admin_read" on question_reports
for select using (exists (select 1 from users where id = auth.uid() and is_admin = true));

create policy "reports_admin_update" on question_reports
for update using (exists (select 1 from users where id = auth.uid() and is_admin = true));
