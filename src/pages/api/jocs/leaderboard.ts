// src/pages/api/jocs/leaderboard.ts
// GET /api/jocs/leaderboard?type=individual|institute&limit=50&offset=0
// Spec §7.4

import type { APIRoute } from 'astro';
import { getSupabase } from '../../../lib/jocs-economics/server/supabase';

// SSR-only: no pre-render at build time (Supabase env vars not available)
export const prerender = false;

const MAX_LIMIT = 200;
const DEFAULT_LIMIT = 50;

export const GET: APIRoute = async ({ url }) => {
  const type = url.searchParams.get('type') ?? 'individual';
  const rawLimit = Number(url.searchParams.get('limit') ?? DEFAULT_LIMIT);
  const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(Math.trunc(rawLimit), 1), MAX_LIMIT) : DEFAULT_LIMIT;
  const rawOffset = Number(url.searchParams.get('offset') ?? 0);
  const offset = Number.isFinite(rawOffset) ? Math.max(Math.trunc(rawOffset), 0) : 0;

  const supabase = getSupabase();

  if (type === 'individual') {
    const { data, error } = await supabase
      .from('scores')
      .select('player_name, institute_display, score, questions_answered, time_total_ms, finished_at')
      .order('score', { ascending: false })
      .order('questions_answered', { ascending: false })
      .order('time_total_ms', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      return new Response(JSON.stringify({ error: 'database-error' }), { status: 500 });
    }
    const rows = (data ?? []).map((r: any, i: number) => ({
      rank: offset + i + 1,
      playerName: r.player_name,
      institute: r.institute_display,
      score: r.score,
      questionsAnswered: r.questions_answered,
      timeTotalMs: r.time_total_ms,
      finishedAt: r.finished_at,
    }));
    return new Response(JSON.stringify({ type: 'individual', rows }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=30, s-maxage=30',
      },
    });
  }

  if (type === 'institute') {
    const { data, error } = await supabase
      .from('institute_leaderboard')
      .select('institute_display, total_score, total_questions, total_time_ms, players_count, top_player_name, top_player_score')
      .order('total_score', { ascending: false })
      .order('total_questions', { ascending: false })
      .order('total_time_ms', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      return new Response(JSON.stringify({ error: 'database-error' }), { status: 500 });
    }
    const rows = (data ?? []).map((r: any, i: number) => ({
      rank: offset + i + 1,
      institute: r.institute_display,
      totalScore: r.total_score,
      playersCount: r.players_count,
      topPlayer: { playerName: r.top_player_name, score: r.top_player_score },
    }));
    return new Response(JSON.stringify({ type: 'institute', rows }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=30, s-maxage=30',
      },
    });
  }

  return new Response(JSON.stringify({ error: 'invalid-type' }), { status: 400 });
};
