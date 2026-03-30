-- Category-Specific Telemetry & Mastery Logic

-- 1. Get Overall Category Stats (Average Score, Latest Activity)
create or replace function get_category_stats(p_user_id uuid, p_category_id text)
returns json as $$
declare
    v_avg_score int;
    v_total_missions int;
    v_latest_score int;
    v_latest_date timestamptz;
begin
    -- Calculate Average Score for this category
    select coalesce(avg(percentage)::int, 0), count(*)
    into v_avg_score, v_total_missions
    from results
    where user_id = p_user_id and category_id = p_category_id;

    -- Get Latest Result
    select percentage, created_at
    into v_latest_score, v_latest_date
    from results
    where user_id = p_user_id and category_id = p_category_id
    order by created_at desc
    limit 1;

    return json_build_object(
        'avgScore', v_avg_score,
        'totalMissions', v_total_missions,
        'latestResult', json_build_object(
            'score', v_latest_score,
            'date', v_latest_date
        )
    );
end;
$$ language plpgsql security definer;

-- 2. Get Topic Mastery (Best Score per Topic)
create or replace function get_topic_mastery(p_user_id uuid, p_category_id text)
returns table (
    topic_id text,
    best_score int,
    attempts int
) as $$
begin
    return query
    select 
        r.topic_id,
        max(r.percentage)::int as best_score,
        count(*)::int as attempts
    from results r
    where r.user_id = p_user_id and r.category_id = p_category_id
    group by r.topic_id;
end;
$$ language plpgsql security definer;
