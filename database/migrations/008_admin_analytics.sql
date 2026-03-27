-- Admin analytics RPC

create or replace function public.get_admin_analytics(p_since timestamptz default now() - interval '30 days')
returns table (
  day date,
  active_users int,
  quiz_completions int,
  completion_rate int
) language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  with daily as (
    select
      date(r.created_at) as day,
      count(distinct r.user_id)::int as active_users,
      count(*)::int as quiz_completions
    from results r
    where r.created_at >= p_since
    group by date(r.created_at)
  )
  select
    d.day,
    d.active_users,
    d.quiz_completions,
    case when d.active_users = 0 then 0
         else round(d.quiz_completions::numeric / d.active_users)::int end as completion_rate
  from daily d
  order by d.day asc;
end;
$$;
