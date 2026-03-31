-- ============================================================
-- 016: Quiz Ecosystem Enhancements
-- ============================================================

-- 1. Quiz Set Results table
-- Tracks completed quiz set sessions so badges/leaderboards can
-- account for set completions, not just individual topic results.
create table if not exists quiz_set_results (
    id          uuid primary key default gen_random_uuid(),
    user_id     uuid not null references users(id) on delete cascade,
    quiz_set_id uuid not null references quiz_sets(id) on delete cascade,
    score       int  not null default 0,
    total       int  not null default 0,
    percentage  int  not null default 0,
    created_at  timestamptz not null default now()
);

alter table quiz_set_results enable row level security;

create policy "quiz_set_results_select_own" on quiz_set_results
    for select using (auth.uid() = user_id);

create policy "quiz_set_results_insert_own" on quiz_set_results
    for insert with check (auth.uid() = user_id);

-- 2. Server-side answer validation RPC
-- Returns { is_correct, correct_answer } so the frontend never needs
-- to expose the correct_answer in the initial question list fetch.
create or replace function validate_answer(p_question_id uuid, p_user_answer text)
returns json
language plpgsql
security definer
as $$
declare
    v_correct text;
begin
    select correct_answer into v_correct
    from questions
    where id = p_question_id;

    if not found then
        raise exception 'Question not found';
    end if;

    return json_build_object(
        'is_correct',     (v_correct = p_user_answer),
        'correct_answer', v_correct
    );
end;
$$;
