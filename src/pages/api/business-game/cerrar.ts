// POST /api/business-game/cerrar — el profe cierra la ronda: ejecuta el motor,
// guarda los resultados, actualiza el estado de cada equipo y avanza la ronda.
import type { APIRoute } from 'astro';
import { json, bad, getSupabase, auth } from '@/lib/business-game/server/api';
import {
  simularRonda, ESTADO_INICIAL,
  type MarketParams, type RoundResult, type TeamDecision, type TeamInput, type TeamState,
} from '@/lib/business-game/engine';
import { sanearParams } from '@/lib/business-game/params-liga';

export const prerender = false;

// A close that died after claiming the round (a function timeout, a request that
// never came back) cannot hand it back: after this long another «Cerrar» takes it over.
const RECLAIM_AFTER_MS = 2 * 60 * 1000;

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

  // Sanitized again here: leagues created before the limits may hold non-numbers.
  const params = sanearParams(liga.params);
  const ronda = liga.ronda as number;

  // Atomically claim this round-close. No transactions available, so flip the
  // phase to the transient 'resultados' state; only the first concurrent caller
  // matches `fase='decisiones'` and proceeds. Duplicates/retries get 409. A claim
  // older than RECLAIM_AFTER_MS is taken over the same way (it refreshes
  // last_action_at, so only one caller wins it).
  const ahora = Date.now();
  const reclamar = supabase
    .from('bg_ligas')
    .update({ fase: 'resultados', last_action_at: new Date(ahora).toISOString() })
    .eq('id', liga.id)
    .eq('ronda', ronda);
  const { data: claimed, error: claimErr } = await (liga.fase === 'resultados'
    ? reclamar.eq('fase', 'resultados').lt('last_action_at', new Date(ahora - RECLAIM_AFTER_MS).toISOString())
    : reclamar.eq('fase', 'decisiones')
  ).select('id');
  if (claimErr) return bad('No se pudo cerrar la ronda', 500);
  if (!claimed || claimed.length === 0) {
    return bad('La ronda ya se está cerrando o ya se ha cerrado', 409);
  }

  // Any failure from here on hands the round back to 'decisiones', so the
  // teacher can press «Cerrar» again instead of the league staying locked in
  // 'resultados' for good. The retry is safe: see the stored results below.
  const liberar = async (mensaje: string, status: number) => {
    await supabase.from('bg_ligas').update({ fase: 'decisiones' })
      .eq('id', liga.id).eq('ronda', ronda).eq('fase', 'resultados');
    return bad(mensaje, status);
  };

  const { data: equipos, error: eqErr } = await supabase
    .from('bg_equipos')
    .select('id, nombre')
    .eq('liga_id', liga.id);
  if (eqErr) return liberar('No se pudieron leer los equipos, vuelve a intentarlo', 500);
  if (!equipos || equipos.length === 0) return liberar('No hay equipos en la liga', 409);

  // Each team plays the round from its stored result of the previous one, or
  // from scratch if it has none (it joined later). Never from bg_equipos: a
  // close that failed half-way may already have moved some of those rows past
  // this round. If such an attempt saved this round's results, they stand:
  // everyone has seen them since, and a team that joined in between starts
  // next round.
  const { data: guardados, error: guardErr } = await supabase
    .from('bg_resultados')
    .select('equipo_id, ronda, caja, beneficio_acumulado, deuda')
    .eq('liga_id', liga.id)
    .in('ronda', [ronda - 1, ronda]);
  if (guardErr) return liberar('No se pudieron leer los resultados, vuelve a intentarlo', 500);
  const estadosDeRonda = (n: number) => new Map<string, TeamState>(
    (guardados ?? []).filter((g) => Number(g.ronda) === n).map((g) => [g.equipo_id, {
      caja: Number(g.caja), beneficioAcumulado: Number(g.beneficio_acumulado), deuda: Number(g.deuda),
    }]),
  );
  const inicio = estadosDeRonda(ronda - 1);
  const previos = estadosDeRonda(ronda);
  const estadoInicial = (id: string): TeamState => inicio.get(id) ?? ESTADO_INICIAL;

  let estados: { id: string; estado: TeamState }[];
  if (previos.size > 0) {
    estados = equipos.map((e) => ({ id: e.id, estado: previos.get(e.id) ?? estadoInicial(e.id) }));
  } else {
    const { data: decisiones, error: decErr } = await supabase
      .from('bg_decisiones')
      .select('equipo_id, precio, marketing, produccion, calidad, rrhh, prestamo')
      .eq('liga_id', liga.id)
      .eq('ronda', ronda);
    // Without them every team would play the default decisions and the round would move on.
    if (decErr) return liberar('No se pudieron leer las decisiones, vuelve a intentarlo', 500);
    const decMap = new Map((decisiones ?? []).map((d) => [d.equipo_id, d]));

    const entradas: TeamInput[] = equipos.map((e) => {
      const d = decMap.get(e.id);
      const decision: TeamDecision = d
        ? { precio: Number(d.precio), marketing: Number(d.marketing), produccion: Number(d.produccion), calidad: Number(d.calidad), rrhh: Number(d.rrhh), prestamo: Number(d.prestamo) }
        : decisionPorDefecto(params);
      return { id: e.id, nombre: e.nombre, estado: estadoInicial(e.id), decision };
    });

    const resultados: RoundResult[] = simularRonda(params, entradas, ronda);

    // Guarda resultados (idempotente por equipo+ronda) antes de tocar los equipos.
    const filasRes = resultados.map((r) => ({
      liga_id: liga.id, equipo_id: r.id, ronda,
      calidad: r.calidad, cvu: r.costeVariableUnitario, atractivo: r.atractivo, cuota: r.cuota,
      demanda: r.demanda, ventas: r.ventas, stock: r.stock, ingresos: r.ingresos, costes: r.costes,
      beneficio: r.beneficio, caja: r.estado.caja, beneficio_acumulado: r.estado.beneficioAcumulado, deuda: r.estado.deuda,
    }));
    const { error: resErr } = await supabase.from('bg_resultados').upsert(filasRes, { onConflict: 'equipo_id,ronda' });
    if (resErr) return liberar('No se pudieron guardar los resultados, vuelve a intentarlo', 500);
    estados = resultados.map((r) => ({ id: r.id, estado: r.estado }));
  }

  // Absolute values from the stored results, so repeating this step is harmless.
  const actualizaciones = await Promise.all(estados.map(({ id, estado }) =>
    supabase.from('bg_equipos').update({
      caja: estado.caja, beneficio_acumulado: estado.beneficioAcumulado, deuda: estado.deuda,
    }).eq('id', id)
  ));
  if (actualizaciones.some((u) => u.error)) {
    return liberar('No se pudo actualizar a todos los equipos, vuelve a cerrar la ronda', 500);
  }

  // Advance the round (or finish), clearing the transient 'resultados' claim.
  // Only from this round's claim: a close that took this one over may have
  // advanced the league already, and a late write must not move it back.
  const esUltima = ronda >= (liga.num_rondas as number);
  const { error: avanceErr } = await supabase.from('bg_ligas').update({
    ronda: esUltima ? ronda : ronda + 1,
    fase: esUltima ? 'cerrada' : 'decisiones',
    last_action_at: new Date().toISOString(),
  }).eq('id', liga.id).eq('ronda', ronda).eq('fase', 'resultados');
  if (avanceErr) return liberar('No se pudo avanzar la ronda, vuelve a intentarlo', 500);

  return json({ ok: true, ronda, terminada: esUltima, siguienteRonda: esUltima ? ronda : ronda + 1 });
};
