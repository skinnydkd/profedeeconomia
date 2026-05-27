-- Jocs Econòmics — schema inicial
-- Aplicar manualment al SQL editor de Supabase Studio.

-- Extensions necessàries
create extension if not exists pg_trgm;
create extension if not exists pg_cron;

-- ──────────────────────────────────────────────────────────────────────
-- 1. active_games — partides en curs (efímer, 30 min TTL)
-- ──────────────────────────────────────────────────────────────────────
create table if not exists active_games (
  game_id uuid primary key default gen_random_uuid(),
  player_name text not null,
  institute_norm text not null,
  institute_display text not null,
  created_at timestamptz not null default now(),
  last_action_at timestamptz not null default now(),
  current_difficulty real not null default 1.0,
  lives smallint not null default 3 check (lives >= 0 and lives <= 3),
  score integer not null default 0,
  questions_answered integer not null default 0,
  time_total_ms integer not null default 0,
  seen_question_ids text[] not null default '{}',
  current_question_id text,
  current_question_started_at timestamptz,
  finished boolean not null default false
);

create index if not exists active_games_cleanup_idx
  on active_games (last_action_at) where finished = false;

alter table active_games enable row level security;

-- ──────────────────────────────────────────────────────────────────────
-- 2. scores — leaderboard persistent
-- ──────────────────────────────────────────────────────────────────────
create table if not exists scores (
  id bigserial primary key,
  game_id uuid not null unique,
  player_name text not null,
  institute_norm text not null,
  institute_display text not null,
  score integer not null,
  questions_answered integer not null,
  time_total_ms integer not null,
  max_difficulty_reached real not null,
  finished_at timestamptz not null default now()
);

create index if not exists scores_individual_rank_idx
  on scores (score desc, questions_answered desc, time_total_ms asc);
create index if not exists scores_by_institute_idx
  on scores (institute_norm, score desc);
create index if not exists scores_finished_at_idx
  on scores (finished_at desc);

alter table scores enable row level security;

-- ──────────────────────────────────────────────────────────────────────
-- 3. institutes — catàleg per a autocompletat
-- ──────────────────────────────────────────────────────────────────────
create table if not exists institutes (
  institute_norm text primary key,
  institute_display text not null,
  players_count integer not null default 1,
  last_seen_at timestamptz not null default now()
);

create index if not exists institutes_search_idx
  on institutes using gin (institute_display gin_trgm_ops);

alter table institutes enable row level security;

-- ──────────────────────────────────────────────────────────────────────
-- 4. institute_leaderboard — vista materialitzada (suma top-5 per institut)
-- ──────────────────────────────────────────────────────────────────────
create materialized view if not exists institute_leaderboard as
with ranked as (
  select
    institute_norm,
    institute_display,
    score,
    questions_answered,
    time_total_ms,
    player_name,
    row_number() over (
      partition by institute_norm
      order by score desc, questions_answered desc, time_total_ms asc
    ) as rn
  from scores
),
top5 as (
  select institute_norm, score, questions_answered, time_total_ms, player_name
  from ranked
  where rn <= 5
),
agg as (
  select
    institute_norm,
    sum(score)                  as total_score,
    sum(questions_answered)     as total_questions,
    sum(time_total_ms)          as total_time_ms,
    count(distinct player_name) as players_count
  from top5
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
  agg.players_count,
  top_player.player_name as top_player_name,
  top_player.top_player_score
from agg
join institutes i using (institute_norm)
join top_player using (institute_norm);

create unique index if not exists institute_leaderboard_pk_idx
  on institute_leaderboard (institute_norm);
create index if not exists institute_leaderboard_rank_idx
  on institute_leaderboard (total_score desc, total_questions desc, total_time_ms asc);

-- ──────────────────────────────────────────────────────────────────────
-- 5. pg_cron jobs
-- ──────────────────────────────────────────────────────────────────────

select cron.schedule(
  'jocs-cleanup-active-games', '*/5 * * * *',
  $$
    delete from active_games
    where finished = true
       or last_action_at < now() - interval '30 minutes';
  $$
);

select cron.schedule(
  'jocs-refresh-institute-leaderboard', '*/5 * * * *',
  $$ refresh materialized view concurrently institute_leaderboard; $$
);
