-- ============================================================
-- 019: Leaderboard Optimizations (Fixed Grouping)
-- ============================================================

-- 1. Optimized global leaderboard (Top 50 limits + Avatars)
create or replace function public.get_leaderboard(
  p_category_id text default null,
  p_topic_id text default null,
  p_since timestamptz default null
)
returns table (
  user_id uuid,
  username text,
  avatar_url text,      -- NEW
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
    u.avatar_url,
    p_category_id as category_id,
    p_topic_id as topic_id,
    sum(r.score)::int as total_score,
    sum(r.total)::int as total_questions,
    round(avg(r.percentage))::int as avg_percentage
  from results r
  join users u on u.id = r.user_id
  where (p_category_id is null or r.category_id = p_category_id)
    and (p_topic_id is null or r.topic_id = p_topic_id)
    and (p_since is null or r.created_at >= p_since)
  group by r.user_id, u.username, u.avatar_url
  order by avg_percentage desc, total_score desc
  limit 50;  -- NEW: CRITICAL PERFORMANCE FIX
end;
$$;


-- 2. Fetch an individual user's specific rank safely
create or replace function public.get_user_leaderboard_rank(
  p_user_id uuid,
  p_category_id text default null,
  p_topic_id text default null,
  p_since timestamptz default null
)
returns json language plpgsql
security definer
set search_path = public
as $$
declare
  v_total_users bigint;
  v_user_score int;
  v_user_avg int;
  v_user_rank bigint;
  v_percentile numeric;
begin
  -- Pre-aggregate everyone to establish positions
  with ranked as (
    select
      r.user_id,
      sum(r.score)::int as agg_score,
      round(avg(r.percentage))::int as agg_avg
    from results r
    where (p_category_id is null or r.category_id = p_category_id)
      and (p_topic_id is null or r.topic_id = p_topic_id)
      and (p_since is null or r.created_at >= p_since)
    group by r.user_id
  )
  select count(*) into v_total_users from ranked;

  -- Exit early if no data
  if v_total_users = 0 then
    return null;
  end if;

  -- Find the current user's actual score/avg within these filters
  with ranked as (
    select
      r.user_id,
      sum(r.score)::int as agg_score,
      round(avg(r.percentage))::int as agg_avg
    from results r
    where (p_category_id is null or r.category_id = p_category_id)
      and (p_topic_id is null or r.topic_id = p_topic_id)
      and (p_since is null or r.created_at >= p_since)
      and r.user_id = p_user_id
    group by r.user_id
  )
  select agg_score, agg_avg into v_user_score, v_user_avg from ranked;

  -- If user has no data in this filter, return null
  if v_user_avg is null then
    return null;
  end if;

  -- Find rank
  with ranked as (
    select
      r.user_id,
      sum(r.score)::int as agg_score,
      round(avg(r.percentage))::int as agg_avg
    from results r
    where (p_category_id is null or r.category_id = p_category_id)
      and (p_topic_id is null or r.topic_id = p_topic_id)
      and (p_since is null or r.created_at >= p_since)
    group by r.user_id
  )
  select count(*) + 1 into v_user_rank
  from ranked
  where agg_avg > v_user_avg
     or (agg_avg = v_user_avg and agg_score > v_user_score);

  if v_total_users > 0 then
    v_percentile := (1.0 - (v_user_rank::numeric / v_total_users::numeric)) * 100.0;
    if v_percentile > 99.9 and v_total_users > 1 then
      v_percentile := 99.9;
    end if;
  else
    v_percentile := 0;
  end if;

  return json_build_object(
    'rank', v_user_rank,
    'total_users', v_total_users,
    'score', v_user_score,
    'avg', v_user_avg,
    'percentile', round(v_percentile, 1)
  );
end;
$$;


-- 3. Get ecosystem metadata for the leaderboard footer
create or replace function public.get_leaderboard_meta()
returns json language plpgsql
security definer
set search_path = public
as $$
declare
  v_total_xp bigint;
  v_top_category text;
begin
  -- Total XP across all time
  select coalesce(sum(score), 0) into v_total_xp from results;

  -- Top category (most results count)
  select category_id into v_top_category
  from results
  group by category_id
  order by count(*) desc
  limit 1;

  if v_top_category is null then
    v_top_category := 'Cross-Domain';
  end if;

  return json_build_object(
    'total_xp', v_total_xp,
    'top_category', v_top_category
  );
end;
$$;
