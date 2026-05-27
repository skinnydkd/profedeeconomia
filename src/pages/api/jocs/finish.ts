// src/pages/api/jocs/finish.ts
// POST /api/jocs/finish — finalització voluntària (spec §7.3).
// Si questionsAnswered < 5 → no insertem a scores (decisió D7 anti-grind).

import type { APIRoute } from 'astro';
import { getSupabase } from '../../../lib/jocs-economics/server/supabase';
import { verifyGameToken } from '../../../lib/jocs-economics/server/tokens';

const MIN_QUESTIONS_FOR_RANKING = 5;

interface FinishRequest {
  gameId: string;
  token: string;
}

function jsonError(reason: string, status = 400): Response {
  return new Response(JSON.stringify({ error: reason }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  let body: Partial<FinishRequest>;
  try {
    body = (await request.json()) as FinishRequest;
  } catch {
    return jsonError('invalid-body', 400);
  }

  const { gameId, token } = body;
  if (!gameId || !token) return jsonError('invalid-body', 400);

  const secret = process.env.JOCS_TOKEN_SECRET;
  if (!secret) return jsonError('server-misconfigured', 500);

  const tokenResult = verifyGameToken(token, secret);
  if (!tokenResult.ok || tokenResult.gameId !== gameId) {
    return jsonError('invalid-token', 400);
  }

  const supabase = getSupabase();

  const { data: game, error: loadErr } = await supabase
    .from('active_games')
    .select('*')
    .eq('game_id', gameId)
    .single();

  if (loadErr || !game) return jsonError('invalid-game', 404);
  if (game.finished) return jsonError('already-finished', 400);

  // D7: fewer than 5 questions answered → mark finished but do NOT insert into scores
  if (game.questions_answered < MIN_QUESTIONS_FOR_RANKING) {
    await supabase.from('active_games').update({ finished: true }).eq('game_id', gameId);
    return new Response(
      JSON.stringify({
        final: {
          score: game.score,
          questionsAnswered: game.questions_answered,
          timeTotalMs: game.time_total_ms,
          maxDifficultyReached: game.current_difficulty,
          finalRank: null,
          instituteRank: null,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  }

  // Insert into scores leaderboard
  await supabase.from('scores').insert({
    game_id: gameId,
    player_name: game.player_name,
    institute_norm: game.institute_norm,
    institute_display: game.institute_display,
    score: game.score,
    questions_answered: game.questions_answered,
    time_total_ms: game.time_total_ms,
    max_difficulty_reached: game.current_difficulty,
  });

  await supabase.from('active_games').update({ finished: true }).eq('game_id', gameId);

  // MVP: ranks returned as null for simplicity (full rank computation done in answer.ts)
  return new Response(
    JSON.stringify({
      final: {
        score: game.score,
        questionsAnswered: game.questions_answered,
        timeTotalMs: game.time_total_ms,
        maxDifficultyReached: game.current_difficulty,
        finalRank: null,
        instituteRank: null,
      },
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  );
};
