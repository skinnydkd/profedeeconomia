import { describe, it, expect, vi, beforeEach } from 'vitest';

process.env.SUPABASE_URL = 'http://localhost';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';

/**
 * CODE-SRV-15: the league state is what every screen of a class polls. It is
 * served from one CDN copy per league for a few seconds (browsers keep
 * `no-store`), carries the time it was built so the screens can order answers
 * that cross, and only reads the result columns the screens show.
 */
const TABLAS: Record<string, unknown> = {
  bg_ligas: { id: 'l1', nombre: 'Liga', ronda: 2, fase: 'decisiones', num_rondas: 8 },
  bg_equipos: [{ id: 'e1', nombre: 'A', institute_display: 'IES', caja: '10', beneficio_acumulado: '5', deuda: '0' }],
  bg_decisiones: [{ equipo_id: 'e1' }],
  bg_resultados: [{
    equipo_id: 'e1', ronda: 1, calidad: '1', cuota: '0.5', ventas: '100', stock: '0',
    ingresos: '1000', costes: '900', beneficio: '100', beneficio_acumulado: '100',
  }],
};
const columnas: Record<string, string> = {};

function consulta(tabla: string) {
  const resultado = { data: TABLAS[tabla], error: null };
  const q = {
    select(cols: string) { columnas[tabla] = cols; return q; },
    eq() { return q; },
    order() { return q; },
    single: () => Promise.resolve(resultado),
    then: (ok: (r: typeof resultado) => unknown) => Promise.resolve(resultado).then(ok),
  };
  return q;
}

vi.mock('../../../lib/jocs-economics/server/supabase', () => ({
  getSupabase: () => ({ from: consulta }),
}));

import { GET } from '../../../pages/api/business-game/estado';

type Ctx = Parameters<typeof GET>[0];
const pedir = (codigo: string) =>
  GET({ url: new URL(`http://x/api/business-game/estado?codigo=${codigo}`) } as unknown as Ctx) as Promise<Response>;

describe('GET /api/business-game/estado', () => {
  beforeEach(() => {
    for (const k of Object.keys(columnas)) delete columnas[k];
  });

  it('lets the CDN share one copy per league for a few seconds, never the browser', async () => {
    const res = await pedir('ABC123');
    expect(res.status).toBe(200);
    expect(res.headers.get('vercel-cdn-cache-control')).toBe('max-age=3, stale-while-revalidate=5');
    expect(res.headers.get('cache-control')).toBe('no-store');
  });

  it('dates the state so the screens can order answers that cross', async () => {
    const antes = Date.now();
    const body = await (await pedir('ABC123')).json();
    expect(body.generadoEn).toBeGreaterThanOrEqual(antes);
    expect(body.liga).toEqual({ id: 'l1', nombre: 'Liga', ronda: 2, fase: 'decisiones', numRondas: 8 });
    expect(body.equipos[0]).toMatchObject({ id: 'e1', haEnviado: true, caja: 10 });
    expect(body.resultados[0]).toMatchObject({ equipoId: 'e1', ronda: 1, beneficio: 100, beneficioAcumulado: 100 });
  });

  it('reads only the result columns it returns', async () => {
    await pedir('ABC123');
    expect(columnas.bg_resultados).not.toContain('*');
    expect(columnas.bg_resultados.split(',').map((c) => c.trim()).sort()).toEqual(
      ['beneficio', 'beneficio_acumulado', 'calidad', 'costes', 'cuota', 'equipo_id', 'ingresos', 'ronda', 'stock', 'ventas'],
    );
  });

  it('keeps errors out of every cache', async () => {
    const res = await pedir('X');
    expect(res.status).toBe(400);
    expect(res.headers.get('vercel-cdn-cache-control')).toBeNull();
  });
});
