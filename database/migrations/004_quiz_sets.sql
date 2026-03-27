-- Quiz Sets and Difficulty

alter table questions add column if not exists difficulty text not null default 'medium';
create index if not exists idx_questions_difficulty on questions(difficulty);

create table if not exists quiz_sets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  difficulty text not null default 'mixed',
  created_at timestamptz not null default now()
);

create table if not exists quiz_set_questions (
  quiz_set_id uuid not null references quiz_sets(id) on delete cascade,
  question_id uuid not null references questions(id) on delete cascade,
  primary key (quiz_set_id, question_id)
);

create index if not exists idx_quiz_set_questions_set on quiz_set_questions(quiz_set_id);
create index if not exists idx_quiz_set_questions_q on quiz_set_questions(question_id);
