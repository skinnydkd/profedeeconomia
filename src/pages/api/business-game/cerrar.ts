// POST /api/business-game/cerrar — el profe cierra la ronda: ejecuta el motor,
// guarda los resultados, actualiza el estado de cada equipo y avanza la ronda.
import type { APIRoute } from 'astro';
import { json, bad, getSupabase, auth } from '@/lib/business-game/server/api';
import { simularRonda, type MarketParams, type TeamDecision, type TeamInput } from '@/lib/business-game/engine';

export const prerender = false;

function decisionPorDefecto(params: MarketParams): TeamDecision {
  return { precio: params.precioReferencia, marketing: 20000, produccion: 5000, calidad: 15000, rrhh: 15000, prestamo: 0 };
}

export const POST: APIRoute = async ({ request }) => {
  const payload = auth(request, 'profe');
  if (!payload) return bad('No autorizado', 401);

  const supabase = getSupabase();

  const { data: liga, error: ligaErr } = await supabase
    .from('bg_ligas')
    .select('id, ronda, fase, params, num_rondas')
    .eq('id', payload.ligaId)
    .single();
  if (ligaErr || !liga) return bad('Liga no encontrada', 404);
  if (liga.fase === 'cerrada') return bad('La liga ya ha terminado', 409);

  const params = liga.params as MarketParams;
  const ronda = liga.ronda as number;

  const { data: equipos, error: eqErr } = await supabase
    .from('bg_equipos')
    .select('id, nombre, caja, beneficio_acumulado, deuda')
    .eq('liga_id', liga.id);
  if (eqErr || !equipos || equipos.length === 0) return bad('No hay equipos en la liga', 409);

  const { data: decisiones } = await supabase
    .from('bg_decisiones')
    .select('equipo_id, precio, marketing, produccion, calidad, rrhh, prestamo')
    .eq('liga_id', liga.id)
    .eq('ronda', ronda);
  const decMap = new Map((decisiones ?? []).map((d) => [d.equipo_id, d]));

  const entradas: TeamInput[] = equipos.map((e) => {
    const d = decMap.get(e.id);
    const decision: TeamDecision = d
      ? { precio: Number(d.precio), marketing: Number(d.marketing), produccion: Number(d.produccion), calidad: Number(d.calidad), rrhh: Number(d.rrhh), prestamo: Number(d.prestamo) }
      : decisionPorDefecto(params);
    return {
      id: e.id,
      nombre: e.nombre,
      estado: { caja: Number(e.caja), beneficioAcumulado: Number(e.beneficio_acumulado), deuda: Number(e.deuda) },
      decision,
    };
  });

  const resultados = simularRonda(params, entradas, ronda);

  // Guarda resultados (idempotente por equipo+ronda) y actualiza el estado de los equipos.
  const filasRes = resultados.map((r) => ({
    liga_id: liga.id, equipo_id: r.id, ronda,
    calidad: r.calidad, cvu: r.costeVariableUnitario, atractivo: r.atractivo, cuota: r.cuota,
    demanda: r.demanda, ventas: r.ventas, stock: r.stock, ingresos: r.ingresos, costes: r.costes,
    beneficio: r.beneficio, caja: r.estado.caja, beneficio_acumulado: r.estado.beneficioAcumulado, deuda: r.estado.deuda,
  }));
  const { error: resErr } = await supabase.from('bg_resultados').upsert(filasRes, { onConflict: 'equipo_id,ronda' });
  if (resErr) return bad('No se pudieron guardar los resultados', 500);

  for (const r of resultados) {
    await supabase.from('bg_equipos').update({
      caja: r.estado.caja, beneficio_acumulado: r.estado.beneficioAcumulado, deuda: r.estado.deuda,
    }).eq('id', r.id);
  }

  const esUltima = ronda >= (liga.num_rondas as number);
  await supabase.from('bg_ligas').update({
    ronda: esUltima ? ronda : ronda + 1,
    fase: esUltima ? 'cerrada' : 'decisiones',
    last_action_at: new Date().toISOString(),
  }).eq('id', liga.id);

  return json({ ok: true, ronda, terminada: esUltima, siguienteRonda: esUltima ? ronda : ronda + 1 });
};
