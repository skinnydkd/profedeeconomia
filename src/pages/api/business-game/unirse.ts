// POST /api/business-game/unirse — un equipo se une a una liga con el código.
import type { APIRoute } from 'astro';
import { json, bad, getSupabase } from '@/lib/business-game/server/api';
import { signBgToken, getSecret } from '@/lib/business-game/server/tokens';
import { normalizeInstitute } from '@/lib/jocs-economics/server/institutes';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let body: any;
  try { body = await request.json(); } catch { return bad('JSON inválido'); }

  const codigo = String(body?.codigo ?? '').trim().toUpperCase();
  const nombre = String(body?.nombre ?? '').trim();
  const instituto = String(body?.instituto ?? '').trim();
  const miembros = String(body?.miembros ?? '').trim();
  if (codigo.length !== 6) return bad('Código de liga no válido');
  if (nombre.length < 2) return bad('El nombre del equipo es obligatorio');
  if (instituto.length < 2) return bad('El instituto es obligatorio');

  const supabase = getSupabase();

  const { data: liga, error: ligaErr } = await supabase
    .from('bg_ligas')
    .select('id, nombre, ronda, fase, num_rondas')
    .eq('codigo', codigo)
    .single();
  if (ligaErr || !liga) return bad('No existe ninguna liga con ese código', 404);
  if (liga.fase === 'cerrada') return bad('Esta liga ya ha terminado', 409);

  const { data: equipo, error: insErr } = await supabase
    .from('bg_equipos')
    .insert({
      liga_id: liga.id,
      nombre,
      institute_norm: normalizeInstitute(instituto),
      institute_display: instituto,
      miembros,
    })
    .select('id')
    .single();

  if (insErr) {
    if (String(insErr.message).includes('duplicate')) return bad('Ya hay un equipo con ese nombre en la liga', 409);
    return bad('No se pudo unir a la liga', 500);
  }

  const token = signBgToken({ ligaId: liga.id, rol: 'equipo', equipoId: equipo.id }, getSecret());
  return json({ token, equipoId: equipo.id, ligaId: liga.id, liga: { nombre: liga.nombre, ronda: liga.ronda, fase: liga.fase, numRondas: liga.num_rondas } });
};
