// POST /api/business-game/decisiones — el equipo envía sus decisiones de la ronda actual.
import type { APIRoute } from 'astro';
import { json, bad, getSupabase, auth } from '@/lib/business-game/server/api';
import { validarDecision } from '@/lib/business-game/decision-validacion';
import { DEFAULT_PARAMS } from '@/lib/business-game/engine';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const payload = auth(request, 'equipo');
  if (!payload || !payload.equipoId) return bad('No autorizado', 401);

  let body: any;
  try { body = await request.json(); } catch { return bad('JSON inválido'); }
  const d = body?.decision ?? body;

  const supabase = getSupabase();

  const { data: liga, error: ligaErr } = await supabase
    .from('bg_ligas')
    .select('ronda, fase, params')
    .eq('id', payload.ligaId)
    .single();
  if (ligaErr || !liga) return bad('Liga no encontrada', 404);
  if (liga.fase !== 'decisiones') return bad('La ronda no está abierta a decisiones ahora mismo', 409);

  // A close that failed half-way may have saved this round's results and handed
  // the round back to 'decisiones'. Closing it again keeps those results, so a
  // decision sent now would be stored and never count: say so instead.
  const { data: calculados, error: resErr } = await supabase
    .from('bg_resultados')
    .select('equipo_id')
    .eq('liga_id', payload.ligaId)
    .eq('ronda', liga.ronda)
    .limit(1);
  if (resErr) return bad('No se pudo comprobar la ronda, vuelve a intentarlo', 500);
  if (calculados && calculados.length > 0) {
    return bad('Los resultados de esta ronda ya están calculados: espera a que el profe termine de cerrarla', 409);
  }

  // Half the league's base variable cost: selling below that is not a price.
  const costeBase = Number(liga.params?.costeVariableBase ?? DEFAULT_PARAMS.costeVariableBase);
  const r = validarDecision(d, { precioMinimo: Number.isFinite(costeBase) ? costeBase / 2 : undefined });
  if (!r.ok) return bad(r.error);
  const decision = r.decision;

  const { error } = await supabase
    .from('bg_decisiones')
    .upsert(
      { liga_id: payload.ligaId, equipo_id: payload.equipoId, ronda: liga.ronda, ...decision },
      { onConflict: 'equipo_id,ronda' }
    );
  if (error) return bad('No se pudieron guardar las decisiones', 500);

  return json({ ok: true, ronda: liga.ronda });
};
