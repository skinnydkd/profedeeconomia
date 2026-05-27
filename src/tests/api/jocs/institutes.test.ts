import { describe, it, expect, vi } from 'vitest';

process.env.SUPABASE_URL = 'http://localhost';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';

const mockFrom = vi.fn();
vi.mock('../../../lib/jocs-economics/server/supabase', () => ({
  getSupabase: () => ({ from: mockFrom }),
}));

import { GET } from '../../../pages/api/jocs/institutes';

describe('GET /api/jocs/institutes', () => {
  it('returns empty suggestions for q < 2 chars', async () => {
    const url = new URL('http://localhost/api/jocs/institutes?q=a');
    const res = await GET({ url } as any);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.suggestions).toEqual([]);
  });

  it('returns suggestions for q >= 2 chars', async () => {
    mockFrom.mockImplementation(() => ({
      select: () => ({
        ilike: () => ({
          order: () => ({
            limit: () => ({ data: [{ institute_display: 'IES Lluís Vives' }], error: null }),
          }),
        }),
      }),
    }));
    const url = new URL('http://localhost/api/jocs/institutes?q=lluis');
    const res = await GET({ url } as any);
    const body = await res.json();
    expect(body.suggestions).toContain('IES Lluís Vives');
  });
});
