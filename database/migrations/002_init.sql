-- Fix topics primary key to allow same topic id across categories (e.g., "basics")

-- Drop existing foreign keys that depend on topics primary key
alter table questions drop constraint if exists questions_topic_id_fkey;
alter table results drop constraint if exists results_topic_id_fkey;

-- Drop existing primary key on topics
alter table topics drop constraint if exists topics_pkey cascade;

-- Create composite primary key
alter table topics add primary key (category_id, id);

-- Recreate foreign key from questions to topics (composite)
alter table questions
  add constraint questions_topic_fk
  foreign key (category_id, topic_id)
  references topics (category_id, id)
  on delete cascade;

-- Recreate foreign key from results to topics (composite)
alter table results
  add constraint results_topic_fk
  foreign key (category_id, topic_id)
  references topics (category_id, id)
  on delete cascade;
