import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Supabase before importing the endpoint
const mockFrom = vi.fn();
const mockSupabase = {
  from: mockFrom,
};

vi.mock('../../../lib/jocs-economics/server/supabase', () => ({
  getSupabase: () => mockSupabase,
}));

// Mock bank — nextQuestion returns a fixed question (no correcta/explicacion in public shape)
vi.mock('../../../lib/jocs-economics/server/bank', () => ({
  nextQuestion: vi.fn(() => ({
    id: 'eco-001-test',
    categoria: 'economia',
    dificultat: 1.0,
    opciones: ['A', 'B', 'C', 'D'],
    correcta: 0,
    explicacion: 'Test explicació — must NOT appear in response',
  })),
}));

// Set env vars before importing the module
process.env.SUPABASE_URL = 'http://localhost';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';
process.env.JOCS_TOKEN_SECRET = 'test-secret-at-least-32-chars-aaaaa';

import { POST } from '../../../pages/api/jocs/start';

function makeRequest(body: unknown): { request: Request; clientAddress: string } {
  return {
    request: new Request('http://localhost/api/jocs/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
    clientAddress: '1.2.3.4',
  };
}

beforeEach(() => {
  mockFrom.mockReset();
  // Default mock chain:
  //   institutes.upsert → ok
  //   active_games.insert.select.single → { game_id: 'test-game-id' }
  //   active_games.update.eq → ok
  mockFrom.mockImplementation((table: string) => {
    if (table === 'institutes') {
      return {
        upsert: vi.fn(() => ({ error: null })),
      };
    }
    if (table === 'active_games') {
      return {
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => ({ data: { game_id: 'test-game-id' }, error: null })),
          })),
        })),
        update: vi.fn(() => ({
          eq: vi.fn(() => ({ data: null, error: null })),
        })),
      };
    }
    return { select: vi.fn(() => ({ data: [], error: null })) };
  });
});

describe('POST /api/jocs/start', () => {
  it('returns 200 with gameId + token + firstQuestion for valid input', async () => {
    const res = await POST(makeRequest({ playerName: 'Alice', institute: 'IES Test' }) as any);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.gameId).toBeTruthy();
    expect(body.token).toBeTruthy();
    expect(body.question).toMatchObject({
      id: 'eco-001-test',
      opciones: ['A', 'B', 'C', 'D'],
    });
    // CRITICAL anti-cheat: question must NEVER include correcta or explicacion
    expect(body.question).not.toHaveProperty('correcta');
    expect(body.question).not.toHaveProperty('explicacion');
    expect(body.lives).toBe(3);
    expect(body.score).toBe(0);
  });

  it('returns 400 for empty playerName', async () => {
    const res = await POST(makeRequest({ playerName: '', institute: 'IES Test' }) as any);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('invalid-name');
  });

  it('returns 400 for whitespace-only playerName', async () => {
    const res = await POST(makeRequest({ playerName: '   ', institute: 'IES Test' }) as any);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('invalid-name');
  });

  it('returns 400 for playerName > 40 chars', async () => {
    const res = await POST(makeRequest({ playerName: 'a'.repeat(41), institute: 'IES Test' }) as any);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('invalid-name');
  });

  it('returns 400 for institute < 2 chars', async () => {
    const res = await POST(makeRequest({ playerName: 'Alice', institute: 'a' }) as any);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('invalid-institute');
  });

  it('trims playerName and institute before validation', async () => {
    // "  Alice  " trims to "Alice" (valid). "  IES Test  " trims to "IES Test" (valid).
    const res = await POST(makeRequest({ playerName: '  Alice  ', institute: '  IES Test  ' }) as any);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.gameId).toBeTruthy();
    // Whitespace-only names (post-trim empty) should fail
    const res2 = await POST(makeRequest({ playerName: '    ', institute: 'IES Test' }) as any);
    expect(res2.status).toBe(400);
  });
});
