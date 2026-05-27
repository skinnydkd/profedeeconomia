import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signGameToken } from '../../../lib/jocs-economics/server/tokens';

const SECRET = 'test-secret-at-least-32-chars-long-aaaa';
process.env.JOCS_TOKEN_SECRET = SECRET;
process.env.SUPABASE_URL = 'http://localhost';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';

const mockFrom = vi.fn();
vi.mock('../../../lib/jocs-economics/server/supabase', () => ({
  getSupabase: () => ({ from: mockFrom }),
}));

import { POST } from '../../../pages/api/jocs/finish';

function makeReq(body: unknown): { request: Request } {
  return {
    request: new Request('http://localhost/api/jocs/finish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  };
}

// Helper to build a full mock chain for active_games select + update + scores insert
function setupGameMock(gameData: Record<string, unknown>) {
  mockFrom.mockImplementation((table: string) => {
    if (table === 'active_games') {
      return {
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => ({ data: gameData, error: null })),
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
      };
    }
    return { select: vi.fn(() => ({ data: [], error: null })) };
  });
}

beforeEach(() => {
  mockFrom.mockReset();
});

describe('POST /api/jocs/finish', () => {
  it('rejects with invalid-token if JWT is not valid', async () => {
    const res = await POST(makeReq({ gameId: 'test-game', token: 'bad.token' }) as any);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('invalid-token');
  });

  it('returns finalRank: null when questionsAnswered < 5 (D7 anti-grind)', async () => {
    setupGameMock({
      game_id: 'test-game',
      player_name: 'Alice',
      institute_norm: 'iestest',
      institute_display: 'IES Test',
      questions_answered: 3,
      score: 200,
      time_total_ms: 10_000,
      current_difficulty: 2.0,
      finished: false,
    });
    const token = signGameToken('test-game', SECRET);
    const res = await POST(makeReq({ gameId: 'test-game', token }) as any);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.final.finalRank).toBeNull();
    expect(body.final.instituteRank).toBeNull();
    expect(body.final.score).toBe(200);
    expect(body.final.questionsAnswered).toBe(3);
  });

  it('returns 200 and inserts into scores when questionsAnswered >= 5', async () => {
    setupGameMock({
      game_id: 'test-game',
      player_name: 'Bob',
      institute_norm: 'iesbob',
      institute_display: 'IES Bob',
      questions_answered: 10,
      score: 1500,
      time_total_ms: 90_000,
      current_difficulty: 5.0,
      finished: false,
    });
    const token = signGameToken('test-game', SECRET);
    const res = await POST(makeReq({ gameId: 'test-game', token }) as any);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.final.score).toBe(1500);
    expect(body.final.questionsAnswered).toBe(10);
    // MVP: ranks are null in voluntary finish
    expect(body.final.finalRank).toBeNull();
  });

  it('returns 400 already-finished if game is already finished', async () => {
    setupGameMock({
      game_id: 'test-game',
      player_name: 'Alice',
      institute_norm: 'iestest',
      institute_display: 'IES Test',
      questions_answered: 5,
      score: 500,
      time_total_ms: 30_000,
      current_difficulty: 3.0,
      finished: true,  // already finished
    });
    const token = signGameToken('test-game', SECRET);
    const res = await POST(makeReq({ gameId: 'test-game', token }) as any);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('already-finished');
  });
});
