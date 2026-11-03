import { describe, it, expect, vi, beforeEach } from 'vitest';
import { simularRonda, type TeamDecision, type TeamState } from '../../../lib/business-game/engine';
import { sanearParams } from '../../../lib/business-game/params-liga';

// ---- In-memory fake of the supabase-js chains cerrar.ts uses (from the R6 review repro) ----
type Row = Record<string, unknown>;
type Filter = { kind: 'eq' | 'in' | 'lt'; col: string; value: unknown };
const db: Record<string, Row[]> = {};
const fail = { decisionesRead: false, equipoUpdateIds: new Set<string>() };

function matches(row: Row, f: Filter): boolean {
  if (f.kind === 'eq') return row[f.col] === f.value;
  if (f.kind === 'in') return (f.value as unknown[]).includes(row[f.col]);
  return String(row[f.col]) < String(f.value); // ISO timestamps compare as strings
}

function builder(table: string) {
  let op: 'select' | 'update' | 'upsert' = 'select';
  let payload: Row | Row[] | null = null;
  let returning = false;
  let wantSingle = false;
  const filters: Filter[] = [];
  const run = () => {
    const rows = (db[table] ??= []);
    const hit = () => rows.filter((r) => filters.every((f) => matches(r, f)));
    if (op === 'select') {
      if (table === 'bg_decisiones' && fail.decisionesRead) return { data: null, error: { message: 'fetch failed' } };
      const out = hit().map((r) => ({ ...r }));
      if (wantSingle) return { data: out[0] ?? null, error: out[0] ? null : { message: 'no rows' } };
      return { data: out, error: null };
    }
    if (op === 'update') {
      const id = filters.find((f) => f.col === 'id')?.value;
      if (table === 'bg_equipos' && fail.equipoUpdateIds.has(String(id))) return { data: null, error: { message: 'timeout' } };
      const rowsHit = hit();
      for (const r of rowsHit) Object.assign(r, payload);
      return { data: returning ? rowsHit.map((r) => ({ id: r.id })) : null, error: null };
    }
    // upsert on (equipo_id, ronda)
    for (const n of payload as Row[]) {
      const i = rows.findIndex((r) => r.equipo_id === n.equipo_id && r.ronda === n.ronda);
      if (i >= 0) rows[i] = { ...rows[i], ...n };
      else rows.push({ ...n });
    }
    return { data: null, error: null };
  };
  const b = {
    select() { if (op === 'update') returning = true; return b; },
    update(p: Row) { op = 'update'; payload = p; return b; },
    upsert(p: Row[]) { op = 'upsert'; payload = p; return b; },
    eq(col: string, value: unknown) { filters.push({ kind: 'eq', col, value }); return b; },
    in(col: string, value: unknown[]) { filters.push({ kind: 'in', col, value }); return b; },
    lt(col: string, value: unknown) { filters.push({ kind: 'lt', col, value }); return b; },
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
  auth: () => ({ ligaId: 'L1', rol: 'profe' }),
}));

import { POST } from '../../../pages/api/business-game/cerrar';

async function cerrar(): Promise<{ status: number; body: Record<string, unknown> }> {
  const r = await POST({ request: new Request('http://x', { method: 'POST' }) } as unknown as Parameters<typeof POST>[0]);
  return { status: r.status, body: await r.json() };
}

const DEC_A: TeamDecision = { precio: 25, marketing: 20000, produccion: 5000, calidad: 15000, rrhh: 15000, prestamo: 0 };
const DEC_B: TeamDecision = { precio: 18, marketing: 20000, produccion: 5000, calidad: 15000, rrhh: 15000, prestamo: 0 };
const dec = (equipo_id: string, ronda: number, d: TeamDecision) => ({ liga_id: 'L1', equipo_id, ronda, ...d });
const equipo = (id: string, extra: Row = {}) => ({ id, liga_id: 'L1', nombre: id, caja: 0, beneficio_acumulado: 0, deuda: 0, ...extra });
const liga = () => db.bg_ligas[0];
const eq = (id: string) => db.bg_equipos.find((e) => e.id === id)!;
const res = (id: string, ronda: number) => db.bg_resultados.find((r) => r.equipo_id === id && r.ronda === ronda);

/** What the engine gives when A and B play round `ronda` from the given states. */
function esperado(ronda: number, a: TeamState, b: TeamState) {
  const [ra, rb] = simularRonda(sanearParams({}), [
    { id: 'A', nombre: 'A', estado: a, decision: DEC_A },
    { id: 'B', nombre: 'B', estado: b, decision: DEC_B },
  ], ronda);
  return { A: ra, B: rb };
}
const CERO: TeamState = { caja: 0, beneficioAcumulado: 0, deuda: 0 };

beforeEach(() => {
  for (const k of Object.keys(db)) delete db[k];
  fail.decisionesRead = false;
  fail.equipoUpdateIds.clear();
  db.bg_ligas = [{ id: 'L1', ronda: 1, fase: 'decisiones', params: {}, num_rondas: 8, last_action_at: new Date().toISOString() }];
  db.bg_equipos = [equipo('A'), equipo('B')];
  db.bg_decisiones = [dec('A', 1, DEC_A), dec('B', 1, DEC_B)];
  db.bg_resultados = [];
});

describe('POST /api/business-game/cerrar', () => {
  it('closes a round: stores the results, updates the teams and opens the next round', async () => {
    const r = await cerrar();
    expect(r.status).toBe(200);
    const e = esperado(1, CERO, CERO);
    expect(res('A', 1)?.beneficio).toBe(e.A.beneficio);
    expect(eq('A').beneficio_acumulado).toBe(e.A.estado.beneficioAcumulado);
    expect(eq('B').beneficio_acumulado).toBe(e.B.estado.beneficioAcumulado);
    expect(liga()).toMatchObject({ ronda: 2, fase: 'decisiones' });
  });

  it('does not play the round with default decisions when reading them fails (R6-A8)', async () => {
    fail.decisionesRead = true;
    const r = await cerrar();
    expect(r.status).toBe(500);
    expect(db.bg_resultados).toEqual([]);
    expect(liga()).toMatchObject({ ronda: 1, fase: 'decisiones' });
    // Once the read works again, the teams' real decisions are the ones played.
    fail.decisionesRead = false;
    expect((await cerrar()).status).toBe(200);
    expect(res('A', 1)?.beneficio).toBe(esperado(1, CERO, CERO).A.beneficio);
  });

  it('a retry after a partial failure counts the round once, even if a team joined in between (R6-A9)', async () => {
    fail.equipoUpdateIds.add('B'); // results saved, A updated, B's update fails
    const r1 = await cerrar();
    expect(r1.status).toBe(500);
    expect(liga()).toMatchObject({ ronda: 1, fase: 'decisiones' });

    fail.equipoUpdateIds.clear();
    db.bg_equipos.push(equipo('C')); // a late team joins before the retry
    const r2 = await cerrar();
    expect(r2.status).toBe(200);

    const e = esperado(1, CERO, CERO);
    expect(eq('A').beneficio_acumulado).toBe(e.A.estado.beneficioAcumulado);
    expect(eq('A').beneficio_acumulado).toBe(res('A', 1)?.beneficio);
    expect(eq('B').beneficio_acumulado).toBe(e.B.estado.beneficioAcumulado);
    // The round was already played when C joined: C starts next round.
    expect(res('C', 1)).toBeUndefined();
    expect(eq('C')).toMatchObject({ caja: 0, beneficio_acumulado: 0, deuda: 0 });
    expect(liga()).toMatchObject({ ronda: 2, fase: 'decisiones' });
  });

  it("starts each team from its previous round's stored result, not from bg_equipos (R6-A9)", async () => {
    const r1 = esperado(1, CERO, CERO);
    const fila = (id: 'A' | 'B') => ({
      liga_id: 'L1', equipo_id: id, ronda: 1, beneficio: r1[id].beneficio,
      caja: r1[id].estado.caja, beneficio_acumulado: r1[id].estado.beneficioAcumulado, deuda: r1[id].estado.deuda,
    });
    db.bg_resultados = [fila('A'), fila('B')];
    db.bg_ligas[0].ronda = 2;
    db.bg_decisiones = [dec('A', 2, DEC_A), dec('B', 2, DEC_B)];
    // A's row counted round 1 twice (the old retry bug); B's is right.
    db.bg_equipos = [
      equipo('A', { caja: 2 * r1.A.estado.caja, beneficio_acumulado: 2 * r1.A.estado.beneficioAcumulado }),
      equipo('B', { caja: r1.B.estado.caja, beneficio_acumulado: r1.B.estado.beneficioAcumulado }),
    ];
    expect((await cerrar()).status).toBe(200);
    const r2 = esperado(2, r1.A.estado, r1.B.estado);
    expect(eq('A').beneficio_acumulado).toBe(r2.A.estado.beneficioAcumulado);
    expect(eq('B').beneficio_acumulado).toBe(r2.B.estado.beneficioAcumulado);
  });

  it('takes over a round left in «resultados» by a close that died more than 2 minutes ago (R6-A10)', async () => {
    db.bg_ligas[0].fase = 'resultados';
    db.bg_ligas[0].last_action_at = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const r = await cerrar();
    expect(r.status).toBe(200);
    expect(liga()).toMatchObject({ ronda: 2, fase: 'decisiones' });
  });

  it('still answers 409 while another close is in progress', async () => {
    db.bg_ligas[0].fase = 'resultados';
    db.bg_ligas[0].last_action_at = new Date(Date.now() - 30 * 1000).toISOString();
    const r = await cerrar();
    expect(r.status).toBe(409);
    expect(liga()).toMatchObject({ ronda: 1, fase: 'resultados' });
    expect(db.bg_resultados).toEqual([]);
  });
});
