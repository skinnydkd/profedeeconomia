// POST /api/business-game/decisiones — el equipo envía sus decisiones de la ronda actual.
import type { APIRoute } from 'astro';
import { json, bad, getSupabase, auth } from '@/lib/business-game/server/api';
import { validarDecision } from '@/lib/business-game/decision-validacion';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const payload = auth(request, 'equipo');
  if (!payload || !payload.equipoId) return bad('No autorizado', 401);

  let body: any;
  try { body = await request.json(); } catch { return bad('JSON inválido'); }
  const d = body?.decision ?? body;

  const r = validarDecision(d);
  if (!r.ok) return bad(r.error);
  const decision = r.decision;

  const supabase = getSupabase();

  const { data: liga, error: ligaErr } = await supabase
    .from('bg_ligas')
    .select('ronda, fase')
    .eq('id', payload.ligaId)
    .single();
  if (ligaErr || !liga) return bad('Liga no encontrada', 404);
  if (liga.fase !== 'decisiones') return bad('La ronda no está abierta a decisiones ahora mismo', 409);

  const { error } = await supabase
    .from('bg_decisiones')
    .upsert(
      { liga_id: payload.ligaId, equipo_id: payload.equipoId, ronda: liga.ronda, ...decision },
      { onConflict: 'equipo_id,ronda' }
    );
  if (error) return bad('No se pudieron guardar las decisiones', 500);

  return json({ ok: true, ronda: liga.ronda });
};
