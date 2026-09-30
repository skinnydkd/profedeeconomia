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
import { publicQuestion } from '../../../lib/jocs-economics/server/shuffle';

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

// Minimal model of what start.ts writes, to check what reaches the tables.
interface InstituteRow { institute_display: string; last_seen_at: string }
const institutesTable = new Map<string, InstituteRow>();
const insertedGames: Record<string, unknown>[] = [];

beforeEach(() => {
  mockFrom.mockReset();
  institutesTable.clear();
  insertedGames.length = 0;
  // Default mock chain:
  //   institutes.upsert → insert (or overwrite unless ignoreDuplicates)
  //   institutes.update.eq.select.single → the stored row
  //   active_games.insert.select.single → { game_id: 'test-game-id' }
  //   active_games.update.eq → ok
  mockFrom.mockImplementation((table: string) => {
    if (table === 'institutes') {
      return {
        upsert: vi.fn((row: InstituteRow & { institute_norm: string }, opts?: { ignoreDuplicates?: boolean }) => {
          if (!institutesTable.has(row.institute_norm) || !opts?.ignoreDuplicates) {
            institutesTable.set(row.institute_norm, {
              institute_display: row.institute_display,
              last_seen_at: row.last_seen_at,
            });
          }
          return { error: null };
        }),
        update: vi.fn((patch: Partial<InstituteRow>) => ({
          eq: vi.fn((_col: string, norm: string) => ({
            select: vi.fn(() => ({
              single: vi.fn(() => {
                const row = institutesTable.get(norm);
                if (!row) return { data: null, error: { message: 'no rows' } };
                Object.assign(row, patch);
                return { data: { ...row }, error: null };
              }),
            })),
          })),
        })),
      };
    }
    if (table === 'active_games') {
      return {
        insert: vi.fn((row: Record<string, unknown>) => (insertedGames.push(row), {
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
    expect(body.question.id).toBe('eco-001-test');
    // Shown in this game's order: same options, per-game permutation.
    expect([...body.question.opciones].sort()).toEqual(['A', 'B', 'C', 'D']);
    expect(body.question.opciones).toEqual(
      publicQuestion({ id: 'eco-001-test', opciones: ['A', 'B', 'C', 'D'] }, body.gameId).opciones,
    );
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

  it('keeps the first spelling of an institute: a later variant of the same key cannot rename it', async () => {
    await POST(makeRequest({ playerName: 'Ana', institute: 'IES Lluís Vives' }) as any);
    const res = await POST(makeRequest({ playerName: 'Troll', institute: 'IES Lluís Vives — ¡¡¡ПОЗОР!!!' }) as any);
    expect(res.status).toBe(200);
    // Same key, so the ranking and the autocomplete keep showing the first name…
    expect(institutesTable.get('iesluisvives')?.institute_display).toBe('IES Lluís Vives');
    // …and the new game is filed under it too.
    expect(insertedGames[1]).toMatchObject({ institute_norm: 'iesluisvives', institute_display: 'IES Lluís Vives' });
  });

  it('still records when an institute was last seen, for the autocomplete order', async () => {
    institutesTable.set('iesluisvives', { institute_display: 'IES Lluís Vives', last_seen_at: '2026-01-01T00:00:00.000Z' });
    await POST(makeRequest({ playerName: 'Ana', institute: 'ies lluis vives' }) as any);
    expect(institutesTable.get('iesluisvives')?.last_seen_at).not.toBe('2026-01-01T00:00:00.000Z');
  });

  it('rejects institutes whose key would be empty or too short to tell centres apart', async () => {
    for (const institute of ['学校', '!!', 'I.E.', 'Ω Ψ']) {
      const res = await POST(makeRequest({ playerName: 'Alice', institute }) as any);
      expect(res.status, institute).toBe(400);
      expect((await res.json()).error).toBe('invalid-institute');
    }
    expect(institutesTable.size).toBe(0);
  });

  it('strips control and bidi characters from the names that go public', async () => {
    const res = await POST(makeRequest({ playerName: 'Pa\u202Eu\u200B', institute: 'IES\u2066 Vives\n' }) as any);
    expect(res.status).toBe(200);
    expect(insertedGames[0]).toMatchObject({ player_name: 'Pau', institute_display: 'IES Vives' });
    // Only invisible characters: nothing left of the name.
    const res2 = await POST(makeRequest({ playerName: '\u200B\u202E', institute: 'IES Vives' }) as any);
    expect(res2.status).toBe(400);
    expect((await res2.json()).error).toBe('invalid-name');
  });
});
