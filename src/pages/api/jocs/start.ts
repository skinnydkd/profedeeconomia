// src/pages/api/jocs/start.ts
// POST /api/jocs/start — crea una nova partida (spec §7.1).

import type { APIRoute } from 'astro';
import { getSupabase } from '../../../lib/jocs-economics/server/supabase';
import { nextQuestion } from '../../../lib/jocs-economics/server/bank';
import { signGameToken } from '../../../lib/jocs-economics/server/tokens';
import { normalizeInstitute } from '../../../lib/jocs-economics/server/institutes';

// SSR-only: no pre-render at build time (Supabase env vars not available)
export const prerender = false;

interface StartRequest {
  playerName: string;
  institute: string;
}

interface PublicQuestion {
  id: string;
  enunciado?: string;
  opciones: string[];
}

function jsonError(reason: string, status = 400): Response {
  return new Response(JSON.stringify({ error: reason }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function jsonOk<T>(data: T, status = 200): Response {
  return new Response(JSON.stringify(data), {
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

function toPublicQuestion(q: { id: string; opciones: string[]; enunciado?: string }): PublicQuestion {
  // CRITICAL anti-cheat: NEVER include correcta or explicacion
  return {
    id: q.id,
    ...(q.enunciado ? { enunciado: q.enunciado } : {}),
    opciones: q.opciones,
  };
}

export const POST: APIRoute = async ({ request }) => {
  let body: Partial<StartRequest>;
  try {
    body = (await request.json()) as StartRequest;
  } catch {
    return jsonError('invalid-body', 400);
  }

  // Validate + trim
  const playerName = String(body.playerName ?? '').trim();
  const institute = String(body.institute ?? '').trim();

  if (playerName.length < 1 || playerName.length > 40) {
    return jsonError('invalid-name', 400);
  }
  if (institute.length < 2 || institute.length > 80) {
    return jsonError('invalid-institute', 400);
  }

  const secret = process.env.JOCS_TOKEN_SECRET;
  if (!secret) return jsonError('server-misconfigured', 500);

  const supabase = getSupabase();
  const instituteNorm = normalizeInstitute(institute);

  // Upsert institute (increment players_count on conflict)
  await supabase.from('institutes').upsert(
    {
      institute_norm: instituteNorm,
      institute_display: institute,
      last_seen_at: new Date().toISOString(),
    },
    { onConflict: 'institute_norm', ignoreDuplicates: false },
  );

  // Create active_game row
  const { data: gameRow, error: insertErr } = await supabase
    .from('active_games')
    .insert({
      player_name: playerName,
      institute_norm: instituteNorm,
      institute_display: institute,
      current_difficulty: 1.0,
      lives: 3,
      score: 0,
    })
    .select('game_id')
    .single();

  if (insertErr || !gameRow) {
    return jsonError('database-error', 500);
  }

  const gameId = gameRow.game_id as string;

  // Pick first question
  const firstQ = nextQuestion(1.0, [], rng(gameId));

  // Update active_game with first question
  await supabase
    .from('active_games')
    .update({
      current_question_id: firstQ.id,
      current_question_started_at: new Date().toISOString(),
    })
    .eq('game_id', gameId);

  const token = signGameToken(gameId, secret);

  return jsonOk({
    gameId,
    token,
    question: toPublicQuestion(firstQ),
    lives: 3,
    score: 0,
  });
};
