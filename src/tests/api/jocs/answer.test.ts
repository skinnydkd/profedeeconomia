import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signGameToken } from '../../../lib/jocs-economics/server/tokens';

const SECRET = 'test-secret-at-least-32-chars-long-aaaa';
process.env.JOCS_TOKEN_SECRET = SECRET;
process.env.SUPABASE_URL = 'http://localhost';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';

// --- Mocks ---

const mockFrom = vi.fn();

vi.mock('../../../lib/jocs-economics/server/supabase', () => ({
  getSupabase: () => ({ from: mockFrom }),
}));

vi.mock('../../../lib/jocs-economics/server/bank', () => ({
  nextQuestion: vi.fn(() => ({
    id: 'eco-002',
    opciones: ['x', 'y', 'z', 'w'],
    correcta: 1,
    explicacion: 'next q expl',
  })),
  BankExhaustedError: class BankExhaustedError extends Error {
    constructor() {
      super('bank-exhausted');
      this.name = 'BankExhaustedError';
    }
  },
}));

// Mock the private bank JSON so lookupQuestion can find eco-001
vi.mock('../../../server-only/jocs-bank.json', () => ({
  default: {
    preguntas: [
      {
        id: 'eco-001',
        categoria: 'economia',
        dificultat: 1.0,
        opciones: ['a', 'b', 'c', 'd'],
        correcta: 2,
        explicacion: 'eco-001 expl',
      },
      {
        id: 'eco-002',
        categoria: 'economia',
        dificultat: 1.2,
        opciones: ['x', 'y', 'z', 'w'],
        correcta: 1,
        explicacion: 'eco-002 expl',
      },
    ],
  },
}));

import { POST } from '../../../pages/api/jocs/answer';

// Base game row used by most tests
const BASE_GAME_ROW = {
  game_id: 'test-game-id',
  player_name: 'Alice',
  institute_norm: 'iestestnorm',
  institute_display: 'IES Test',
  current_difficulty: 1.0,
  lives: 3,
  score: 0,
  questions_answered: 0,
  time_total_ms: 0,
  seen_question_ids: ['eco-001'],
  current_question_id: 'eco-001',
  current_question_started_at: new Date(Date.now() - 5000).toISOString(), // 5s ago
  finished: false,
};

function makeReq(body: unknown): { request: Request; clientAddress: string } {
  return {
    request: new Request('http://localhost/api/jocs/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
    clientAddress: '1.2.3.4',
  };
}

// Helper: sets up mockFrom to return a valid game row for select, and ok for update
function setupGameMock(gameRow: typeof BASE_GAME_ROW) {
  mockFrom.mockImplementation((table: string) => {
    if (table === 'active_games') {
      return {
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => ({ data: gameRow, error: null })),
          })),
        })),
        update: vi.fn(() => ({
          eq: vi.fn(() => ({ data: null, error: null })),
        })),
      };
    }
    if (table === 'scores') {
      return {
        insert: vi.fn(() => ({ data: null, error: null })),
        select: vi.fn(() => ({
          order: function () { return this; },
          limit: vi.fn(() => ({ data: [], error: null })),
        })),
      };
    }
    if (table === 'institute_leaderboard') {
      return {
        select: vi.fn(() => ({
          order: function () { return this; },
          limit: vi.fn(() => ({ data: [], error: null })),
        })),
      };
    }
    return { select: vi.fn(() => ({ data: [], error: null })) };
  });
}

beforeEach(() => {
  mockFrom.mockReset();
});

describe('POST /api/jocs/answer', () => {
  it('rejects with invalid-token if JWT is not valid', async () => {
    const res = await POST(makeReq({
      gameId: 'test-game-id',
      token: 'invalid.token.here',
      questionId: 'eco-001',
      optionIdx: 0,
      clientElapsedMs: 5000,
    }) as any);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('invalid-token');
  });

  it('rejects with wrong-question if questionId does not match current_question_id', async () => {
    mockFrom.mockImplementation(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({
            data: { ...BASE_GAME_ROW, current_question_id: 'eco-XXX' },
            error: null,
          })),
        })),
      })),
    }));
    const token = signGameToken('test-game-id', SECRET);
    const res = await POST(makeReq({
      gameId: 'test-game-id',
      token,
      questionId: 'eco-001',
      optionIdx: 0,
      clientElapsedMs: 5000,
    }) as any);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('wrong-question');
  });

  it('returns 200 with isCorrect=true + scoreGain=100 when optionIdx matches correcta', async () => {
    setupGameMock(BASE_GAME_ROW);
    const token = signGameToken('test-game-id', SECRET);
    // eco-001 has correcta: 2 (from mock bank)
    const res = await POST(makeReq({
      gameId: 'test-game-id',
      token,
      questionId: 'eco-001',
      optionIdx: 2,       // correct!
      clientElapsedMs: 5000,
    }) as any);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.result.isCorrect).toBe(true);
    expect(body.result.scoreGain).toBe(100); // scoreFor(1.0) = 100
    expect(body.result.livesLeft).toBe(3);   // lives unchanged on correct
    expect(body.result.correctIdx).toBe(2);
    // Must include next question (game continues since lives > 0)
    expect(body.nextQuestion).toBeDefined();
    // CRITICAL: nextQuestion must NOT include correcta or explicacion
    expect(body.nextQuestion).not.toHaveProperty('correcta');
    expect(body.nextQuestion).not.toHaveProperty('explicacion');
    expect(body.finished).toBeUndefined();
  });

  it('returns 200 with isCorrect=false + scoreGain=0 + livesLeft=2 when optionIdx is wrong', async () => {
    setupGameMock(BASE_GAME_ROW);
    const token = signGameToken('test-game-id', SECRET);
    // eco-001 has correcta: 2; we answer 0 (wrong)
    const res = await POST(makeReq({
      gameId: 'test-game-id',
      token,
      questionId: 'eco-001',
      optionIdx: 0,       // wrong
      clientElapsedMs: 5000,
    }) as any);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.result.isCorrect).toBe(false);
    expect(body.result.scoreGain).toBe(0);
    expect(body.result.livesLeft).toBe(2);
    expect(body.result.correctIdx).toBe(2);
    // explicacion revealed after answer
    expect(body.result.explicacion).toBe('eco-001 expl');
    expect(body.nextQuestion).toBeDefined();
  });

  it('forces incorrect + records TIMER_QUESTION_MS when serverElapsed > 50s (timeout)', async () => {
    // Simulate question started 60s ago (well beyond the 50s timeout)
    const staleGame = {
      ...BASE_GAME_ROW,
      current_question_started_at: new Date(Date.now() - 60_000).toISOString(),
    };
    setupGameMock(staleGame);
    const token = signGameToken('test-game-id', SECRET);
    const res = await POST(makeReq({
      gameId: 'test-game-id',
      token,
      questionId: 'eco-001',
      optionIdx: 2,         // would be correct, but timeout overrides
      clientElapsedMs: 5000,
    }) as any);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.result.isCorrect).toBe(false); // forced incorrect due to timeout
    expect(body.result.scoreGain).toBe(0);
    expect(body.result.elapsedMsRecorded).toBe(45_000); // TIMER_QUESTION_MS
  });

  it('returns finished:true with final stats when lives reach 0', async () => {
    // Game already on last life (lives: 1)
    const lastLifeGame = { ...BASE_GAME_ROW, lives: 1 };
    setupGameMock(lastLifeGame);
    const token = signGameToken('test-game-id', SECRET);
    // Answer incorrectly → lives drops to 0 → game over
    const res = await POST(makeReq({
      gameId: 'test-game-id',
      token,
      questionId: 'eco-001',
      optionIdx: 0,    // wrong (correcta is 2)
      clientElapsedMs: 5000,
    }) as any);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.result.livesLeft).toBe(0);
    expect(body.finished).toBe(true);
    expect(body.final).toBeDefined();
    expect(typeof body.final.score).toBe('number');
    expect(typeof body.final.questionsAnswered).toBe('number');
    // nextQuestion must NOT be present when finished
    expect(body.nextQuestion).toBeUndefined();
  });
});
