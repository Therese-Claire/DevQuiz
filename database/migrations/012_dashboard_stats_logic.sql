-- Sync user total score when a result is inserted
create or replace function update_user_total_score()
returns trigger as $$
begin
  update users
  set total_score = (select coalesce(sum(score), 0) from results where user_id = new.user_id)
  where id = new.user_id;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_update_user_score on results;
create trigger trg_update_user_score
after insert or update or delete on results
for each row execute function update_user_total_score();

-- Get user rank and percentile
create or replace function get_user_stats(user_uuid uuid)
returns json as $$
declare
  total_users bigint;
  user_rank bigint;
  user_score int;
  user_percentile float;
begin
  select count(*) into total_users from users;
  select total_score into user_score from users where id = user_uuid;
  select count(*) + 1 into user_rank from users where total_score > user_score;
  
  if total_users > 0 then
    user_percentile := (1.0 - (user_rank::float / total_users::float)) * 100.0;
    -- Cap percentile at 99.9% if not literally the only user
    if user_percentile > 99.9 and total_users > 1 then
      user_percentile := 99.9;
    end if;
  else
    user_percentile := 0;
  end if;

  return json_build_object(
    'total_users', total_users,
    'rank', user_rank,
    'score', user_score,
    'percentile', round(user_percentile::numeric, 1)
  );
end;
$$ language plpgsql security definer;
