import { describe, it, expect, vi } from 'vitest';

process.env.SUPABASE_URL = 'http://localhost';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';

const mockFrom = vi.fn();
vi.mock('../../../lib/jocs-economics/server/supabase', () => ({
  getSupabase: () => ({ from: mockFrom }),
}));

import { GET } from '../../../pages/api/jocs/leaderboard';

describe('GET /api/jocs/leaderboard', () => {
  it('returns individual leaderboard with rank 1-indexed', async () => {
    mockFrom.mockImplementation(() => ({
      select: () => ({
        order: function () { return this; },
        range: () => ({
          data: [
            { player_name: 'Alice', institute_display: 'IES A', score: 1000, questions_answered: 30, time_total_ms: 60000, finished_at: '2026-05-27T12:00:00Z' },
            { player_name: 'Bob', institute_display: 'IES B', score: 800, questions_answered: 25, time_total_ms: 50000, finished_at: '2026-05-27T11:00:00Z' },
          ],
          error: null,
        }),
      }),
    }));
    const url = new URL('http://localhost/api/jocs/leaderboard?type=individual&limit=50');
    const res = await GET({ url } as any);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.type).toBe('individual');
    expect(body.rows[0]).toMatchObject({ rank: 1, playerName: 'Alice', score: 1000 });
    expect(body.rows[1].rank).toBe(2);
  });

  it('returns 400 for invalid type', async () => {
    mockFrom.mockImplementation(() => ({
      select: () => ({ order: function () { return this; }, range: () => ({ data: [], error: null }) }),
    }));
    const url = new URL('http://localhost/api/jocs/leaderboard?type=invalid');
    const res = await GET({ url } as any);
    expect(res.status).toBe(400);
  });

  it('returns institute leaderboard with rank 1-indexed and topPlayer object', async () => {
    mockFrom.mockImplementation(() => ({
      select: () => ({
        order: function () { return this; },
        range: () => ({
          data: [
            { institute_display: 'IES A', total_score: 5000, players_count: 5, top_player_name: 'Alice', top_player_score: 1500 },
          ],
          error: null,
        }),
      }),
    }));
    const url = new URL('http://localhost/api/jocs/leaderboard?type=institute&limit=50');
    const res = await GET({ url } as any);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.type).toBe('institute');
    expect(body.rows[0]).toMatchObject({
      rank: 1,
      institute: 'IES A',
      totalScore: 5000,
      playersCount: 5,
      topPlayer: { playerName: 'Alice', score: 1500 },
    });
  });
});
