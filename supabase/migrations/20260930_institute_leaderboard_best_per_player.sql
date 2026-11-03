-- Jocs Econòmics — institute ranking: one game per student, real participant count
-- Apply by hand in the Supabase Studio SQL editor (like 20260527_init_jocs.sql).
--
-- Before: an institute's top 5 was taken over games (rows of `scores`), so one
-- student with five good games made up the whole total, and players_count
-- counted names inside that top 5 (never more than 5).
-- Now: keep each student's best game first, take the top 5 of those, and count
-- every student of the institute in players_count.
--
-- A student is an (institute_norm, player_name) pair, the name compared trimmed
-- and case-insensitively. Same columns and indexes as before, so the API routes
-- and the pg_cron refresh (jocs-refresh-institute-leaderboard) keep working.

begin;

drop materialized view if exists institute_leaderboard;

create materialized view institute_leaderboard as
with best_per_player as (
  select distinct on (institute_norm, lower(btrim(player_name)))
    institute_norm,
    player_name,
    score,
    questions_answered,
    time_total_ms
  from scores
  order by institute_norm, lower(btrim(player_name)),
    score desc, questions_answered desc, time_total_ms asc
),
ranked as (
  select
    best_per_player.*,
    row_number() over (
      partition by institute_norm
      order by score desc, questions_answered desc, time_total_ms asc
    ) as rn
  from best_per_player
),
top5 as (
  select institute_norm, player_name, score, questions_answered, time_total_ms
  from ranked
  where rn <= 5
),
agg as (
  select
    institute_norm,
    sum(score)              as total_score,
    sum(questions_answered) as total_questions,
    sum(time_total_ms)      as total_time_ms
  from top5
  group by institute_norm
),
participants as (
  select institute_norm, count(distinct lower(btrim(player_name))) as players_count
  from scores
  group by institute_norm
),
top_player as (
  select distinct on (institute_norm)
    institute_norm,
    player_name,
    score as top_player_score
  from top5
  order by institute_norm, score desc, questions_answered desc, time_total_ms asc
)
select
  agg.institute_norm,
  i.institute_display,
  agg.total_score,
  agg.total_questions,
  agg.total_time_ms,
  participants.players_count,
  top_player.player_name as top_player_name,
  top_player.top_player_score
from agg
join institutes i using (institute_norm)
join participants using (institute_norm)
join top_player using (institute_norm);

-- Dropping the view dropped its indexes; the unique one is required by
-- `refresh materialized view concurrently`.
create unique index institute_leaderboard_pk_idx
  on institute_leaderboard (institute_norm);
create index institute_leaderboard_rank_idx
  on institute_leaderboard (total_score desc, total_questions desc, total_time_ms asc);

commit;
