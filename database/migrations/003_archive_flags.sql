-- Add soft-delete flags for archiving

alter table categories add column if not exists is_archived boolean not null default false;
alter table topics add column if not exists is_archived boolean not null default false;
alter table questions add column if not exists is_archived boolean not null default false;

create index if not exists idx_categories_archived on categories(is_archived);
create index if not exists idx_topics_archived on topics(is_archived);
create index if not exists idx_questions_archived on questions(is_archived);

-- Recreate question_counts view to exclude archived questions
create or replace view question_counts as
select category_id, topic_id, count(*)::int as count
from questions
where is_archived = false
group by category_id, topic_id;
