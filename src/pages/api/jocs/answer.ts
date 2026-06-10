// src/pages/api/jocs/answer.ts
// POST /api/jocs/answer — registra resposta + calcula score + transita o finalitza (spec §7.2).

import type { APIRoute } from 'astro';
import { getSupabase } from '../../../lib/jocs-economics/server/supabase';
import { nextQuestion, BankExhaustedError } from '../../../lib/jocs-economics/server/bank';
import { verifyGameToken } from '../../../lib/jocs-economics/server/tokens';
import { nextDifficulty } from '../../../lib/jocs-economics/server/difficulty';
import { recordedElapsedMs } from '../../../lib/jocs-economics/server/elapsed';

// SSR-only: no pre-render at build time (Supabase env vars not available)
export const prerender = false;
import { scoreFor } from '../../../lib/jocs-economics/server/scoring';
import bankData from '../../../server-only/jocs-bank.json';

const TIMER_QUESTION_MS = 45 * 1000;
const TIMER_GRACE_MS = 5 * 1000;
const MAX_ELAPSED_MS = TIMER_QUESTION_MS + TIMER_GRACE_MS; // 50 s
const CLIENT_TOLERANCE_MS = 2000;

interface AnswerRequest {
  gameId: string;
  token: string;
  questionId: string;
  optionIdx: number;
  clientElapsedMs: number;
}

function jsonError(reason: string, status = 400): Response {
  return new Response(JSON.stringify({ error: reason }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Mulberry32 PRNG seeded with FNV-1a hash of a string
function rng(seed: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  let t = h >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function lookupQuestion(id: string): any {
  return (bankData as any).preguntas.find((q: any) => q.id === id) ?? null;
}

function toPublicQuestion(q: any) {
  // CRITICAL anti-cheat: NEVER include correcta or explicacion
  return {
    id: q.id,
    ...(q.enunciado ? { enunciado: q.enunciado } : {}),
    opciones: q.opciones,
  };
}

export const POST: APIRoute = async ({ request }) => {
  let body: Partial<AnswerRequest>;
  try {
    body = (await request.json()) as AnswerRequest;
  } catch {
    return jsonError('invalid-body', 400);
  }

  const { gameId, token, questionId, optionIdx, clientElapsedMs } = body;

  if (
    !gameId ||
    !token ||
    !questionId ||
    typeof optionIdx !== 'number' ||
    typeof clientElapsedMs !== 'number'
  ) {
    return jsonError('invalid-body', 400);
  }

  // Verify JWT
  const secret = process.env.JOCS_TOKEN_SECRET;
  if (!secret) return jsonError('server-misconfigured', 500);

  const tokenResult = verifyGameToken(token, secret);
  if (!tokenResult.ok || tokenResult.gameId !== gameId) {
    return jsonError('invalid-token', 400);
  }

  const supabase = getSupabase();

  // Load active game
  const { data: game, error: loadErr } = await supabase
    .from('active_games')
    .select('*')
    .eq('game_id', gameId)
    .single();

  if (loadErr || !game) return jsonError('invalid-game', 404);
  if (game.finished) return jsonError('already-finished', 400);
  if (game.current_question_id !== questionId) return jsonError('wrong-question', 400);

  // Lookup the private question (with correcta + explicacion)
  const currentQ = lookupQuestion(questionId);
  if (!currentQ) return jsonError('invalid-question-id', 400);

  if (optionIdx < 0 || optionIdx >= currentQ.opciones.length) {
    return jsonError('invalid-option', 400);
  }

  // Time computation
  const now = Date.now();
  const questionStarted = new Date(game.current_question_started_at).getTime();
  const serverElapsedMs = now - questionStarted;

  let isCorrect: boolean;
  let elapsedMsRecorded: number;

  if (serverElapsedMs > MAX_ELAPSED_MS) {
    // Timeout: forced incorrect; record full timer time
    isCorrect = false;
    elapsedMsRecorded = TIMER_QUESTION_MS;
  } else {
    isCorrect = optionIdx === currentQ.correcta;
    elapsedMsRecorded = recordedElapsedMs(serverElapsedMs, clientElapsedMs, CLIENT_TOLERANCE_MS);
  }

  const scoreGain = isCorrect ? scoreFor(game.current_difficulty) : 0;
  const newScore = game.score + scoreGain;
  const newLives = isCorrect ? game.lives : game.lives - 1;
  const newQuestionsAnswered = game.questions_answered + 1;
  const newTimeTotal = game.time_total_ms + elapsedMsRecorded;
  const newDifficulty = nextDifficulty(game.current_difficulty, isCorrect);
  const newSeen = [...(game.seen_question_ids ?? []), questionId];

  // ─── Game Over (lives = 0) ────────────────────────────────────────────────
  if (newLives === 0) {
    await supabase.from('scores').insert({
      game_id: gameId,
      player_name: game.player_name,
      institute_norm: game.institute_norm,
      institute_display: game.institute_display,
      score: newScore,
      questions_answered: newQuestionsAnswered,
      time_total_ms: newTimeTotal,
      max_difficulty_reached: newDifficulty,
    });

    await supabase
      .from('active_games')
      .update({
        finished: true,
        lives: 0,
        score: newScore,
        questions_answered: newQuestionsAnswered,
        time_total_ms: newTimeTotal,
      })
      .eq('game_id', gameId);

    // Compute final rank (top 1000 ordered by tri-key)
    const { data: allScores } = await supabase
      .from('scores')
      .select('score, questions_answered, time_total_ms')
      .order('score', { ascending: false })
      .order('questions_answered', { ascending: false })
      .order('time_total_ms', { ascending: true })
      .limit(1000);

    let finalRank: number | null = null;
    if (allScores) {
      const idx = allScores.findIndex(
        (s: any) =>
          s.score === newScore &&
          s.questions_answered === newQuestionsAnswered &&
          s.time_total_ms === newTimeTotal,
      );
      finalRank = idx >= 0 ? idx + 1 : null;
    }

    // Compute institute rank from materialized view
    const { data: instLb } = await supabase
      .from('institute_leaderboard')
      .select('institute_norm, total_score, total_questions, total_time_ms')
      .order('total_score', { ascending: false })
      .order('total_questions', { ascending: false })
      .order('total_time_ms', { ascending: true })
      .limit(100);

    let instituteRank: number | null = null;
    if (instLb) {
      const idx = instLb.findIndex((r: any) => r.institute_norm === game.institute_norm);
      instituteRank = idx >= 0 ? idx + 1 : null;
    }

    return new Response(
      JSON.stringify({
        result: {
          isCorrect,
          correctIdx: currentQ.correcta,
          scoreGain,
          livesLeft: 0,
          elapsedMsRecorded,
          ...(currentQ.explicacion ? { explicacion: currentQ.explicacion } : {}),
        },
        finished: true,
        final: {
          score: newScore,
          questionsAnswered: newQuestionsAnswered,
          timeTotalMs: newTimeTotal,
          maxDifficultyReached: newDifficulty,
          finalRank,
          instituteRank,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  }

  // ─── Continue game: pick next question ───────────────────────────────────
  let nextQ;
  try {
    nextQ = nextQuestion(newDifficulty, newSeen, rng(`${gameId}:${newQuestionsAnswered}`));
  } catch (err) {
    if (err instanceof BankExhaustedError) {
      // Bank exhausted → finish as if game over (score is kept)
      await supabase.from('scores').insert({
        game_id: gameId,
        player_name: game.player_name,
        institute_norm: game.institute_norm,
        institute_display: game.institute_display,
        score: newScore,
        questions_answered: newQuestionsAnswered,
        time_total_ms: newTimeTotal,
        max_difficulty_reached: newDifficulty,
      });
      await supabase.from('active_games').update({ finished: true }).eq('game_id', gameId);
      return new Response(
        JSON.stringify({
          result: {
            isCorrect,
            correctIdx: currentQ.correcta,
            scoreGain,
            livesLeft: newLives,
            elapsedMsRecorded,
            ...(currentQ.explicacion ? { explicacion: currentQ.explicacion } : {}),
          },
          finished: true,
          final: {
            score: newScore,
            questionsAnswered: newQuestionsAnswered,
            timeTotalMs: newTimeTotal,
            maxDifficultyReached: newDifficulty,
            finalRank: null,
            instituteRank: null,
          },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    }
    throw err;
  }

  // Update active_game with new state + next question
  await supabase
    .from('active_games')
    .update({
      current_difficulty: newDifficulty,
      lives: newLives,
      score: newScore,
      questions_answered: newQuestionsAnswered,
      time_total_ms: newTimeTotal,
      seen_question_ids: newSeen,
      current_question_id: nextQ.id,
      current_question_started_at: new Date().toISOString(),
      last_action_at: new Date().toISOString(),
    })
    .eq('game_id', gameId);

  return new Response(
    JSON.stringify({
      result: {
        isCorrect,
        correctIdx: currentQ.correcta,
        scoreGain,
        livesLeft: newLives,
        elapsedMsRecorded,
        ...(currentQ.explicacion ? { explicacion: currentQ.explicacion } : {}),
      },
      nextQuestion: toPublicQuestion(nextQ),
      totals: {
        score: newScore,
        questionsAnswered: newQuestionsAnswered,
        timeTotalMs: newTimeTotal,
      },
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  );
};
