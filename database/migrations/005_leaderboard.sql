-- Leaderboard RPC

create or replace function public.get_leaderboard(
  p_category_id text default null,
  p_topic_id text default null,
  p_since timestamptz default null
)
returns table (
  user_id uuid,
  username text,
  category_id text,
  topic_id text,
  total_score int,
  total_questions int,
  avg_percentage int
) language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select
    r.user_id,
    u.username,
    r.category_id,
    r.topic_id,
    sum(r.score)::int as total_score,
    sum(r.total)::int as total_questions,
    round(avg(r.percentage))::int as avg_percentage
  from results r
  join users u on u.id = r.user_id
  where (p_category_id is null or r.category_id = p_category_id)
    and (p_topic_id is null or r.topic_id = p_topic_id)
    and (p_since is null or r.created_at >= p_since)
  group by r.user_id, u.username, r.category_id, r.topic_id
  order by avg_percentage desc, total_score desc;
end;
$$;
