import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * A close that fails after saving the round's results hands the round back to
 * 'decisiones' (cerrar.ts), and closing it again keeps those results. Decisions
 * sent in between used to be stored and silently ignored; now they are refused.
 */
type Row = Record<string, unknown>;
const db: Record<string, Row[]> = {};

function builder(table: string) {
  let op: 'select' | 'upsert' = 'select';
  let payload: Row | null = null;
  let wantSingle = false;
  let max = Infinity;
  const filters: [string, unknown][] = [];
  const run = () => {
    const rows = (db[table] ??= []);
    if (op === 'upsert') {
      const n = payload as Row;
      const i = rows.findIndex((r) => r.equipo_id === n.equipo_id && r.ronda === n.ronda);
      if (i >= 0) rows[i] = { ...rows[i], ...n };
      else rows.push({ ...n });
      return { data: null, error: null };
    }
    const hit = rows.filter((r) => filters.every(([c, v]) => r[c] === v)).slice(0, max);
    if (wantSingle) return { data: hit[0] ?? null, error: hit[0] ? null : { message: 'no rows' } };
    return { data: hit, error: null };
  };
  const b = {
    select() { return b; },
    upsert(p: Row) { op = 'upsert'; payload = p; return b; },
    eq(col: string, value: unknown) { filters.push([col, value]); return b; },
    limit(n: number) { max = n; return b; },
    single() { wantSingle = true; return b; },
    then<T>(res: (v: ReturnType<typeof run>) => T, rej?: (e: unknown) => T) {
      return Promise.resolve(run()).then(res, rej);
    },
  };
  return b;
}

vi.mock('@/lib/business-game/server/api', () => ({
  json: (d: unknown, s = 200) => new Response(JSON.stringify(d), { status: s }),
  bad: (m: string, s = 400) => new Response(JSON.stringify({ error: m }), { status: s }),
  getSupabase: () => ({ from: (t: string) => builder(t) }),
  auth: () => ({ ligaId: 'L1', equipoId: 'E1', rol: 'equipo' }),
}));

import { POST } from '../../../pages/api/business-game/decisiones';

const DECISION = { precio: 25, marketing: 20000, produccion: 5000, calidad: 15000, rrhh: 15000, prestamo: 0 };

async function enviar(): Promise<{ status: number; body: Record<string, unknown> }> {
  const request = new Request('http://x', { method: 'POST', body: JSON.stringify({ decision: DECISION }) });
  const r = await POST({ request } as unknown as Parameters<typeof POST>[0]);
  return { status: r.status, body: await r.json() };
}

beforeEach(() => {
  for (const k of Object.keys(db)) delete db[k];
  db.bg_ligas = [{ id: 'L1', ronda: 2, fase: 'decisiones', params: {} }];
  db.bg_resultados = [{ liga_id: 'L1', equipo_id: 'E1', ronda: 1 }];
});

describe('POST /api/business-game/decisiones', () => {
  it('stores the decisions of an open round', async () => {
    const r = await enviar();
    expect(r.status).toBe(200);
    expect(r.body).toEqual({ ok: true, ronda: 2 });
    expect(db.bg_decisiones).toEqual([{ liga_id: 'L1', equipo_id: 'E1', ronda: 2, ...DECISION }]);
  });

  it('refuses them when a failed close already saved this round\'s results', async () => {
    db.bg_resultados.push({ liga_id: 'L1', equipo_id: 'E2', ronda: 2 });
    const r = await enviar();
    expect(r.status).toBe(409);
    expect(String(r.body.error)).toMatch(/ya están calculados/);
    expect(db.bg_decisiones ?? []).toEqual([]);
  });

  it('refuses them while the round is being closed', async () => {
    db.bg_ligas[0].fase = 'resultados';
    const r = await enviar();
    expect(r.status).toBe(409);
    expect(db.bg_decisiones ?? []).toEqual([]);
  });
});
