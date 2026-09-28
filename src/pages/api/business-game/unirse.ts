// POST /api/business-game/unirse — un equipo se une a una liga con el código.
import type { APIRoute } from 'astro';
import { json, bad, getSupabase } from '@/lib/business-game/server/api';
import { signBgToken, getSecret } from '@/lib/business-game/server/tokens';
import { normalizeInstitute } from '@/lib/jocs-economics/server/institutes';
import { MAX_EQUIPOS_POR_LIGA, MAX_INSTITUTO, MAX_MIEMBROS, MAX_NOMBRE, textoValido } from '@/lib/business-game/params-liga';
import { dentroDelLimite } from '@/lib/business-game/server/limite';

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  // A whole class joins from the centre's IP within a minute: room for that, not for a loop.
  if (!dentroDelLimite('unirse', clientAddress || 'unknown', 60)) {
    return bad('Demasiados intentos desde esta red. Espera un minuto.', 429);
  }
  let body: any;
  try { body = await request.json(); } catch { return bad('JSON inválido'); }

  const codigo = String(body?.codigo ?? '').trim().toUpperCase();
  const nombre = textoValido(body?.nombre, 2, MAX_NOMBRE);
  const instituto = textoValido(body?.instituto, 2, MAX_INSTITUTO);
  const miembros = textoValido(body?.miembros, 0, MAX_MIEMBROS);
  if (codigo.length !== 6) return bad('Código de liga no válido');
  if (!nombre) return bad(`El nombre del equipo debe tener entre 2 y ${MAX_NOMBRE} caracteres`);
  if (!instituto) return bad(`El instituto debe tener entre 2 y ${MAX_INSTITUTO} caracteres`);
  if (miembros === null) return bad(`La lista de miembros no puede pasar de ${MAX_MIEMBROS} caracteres`);

  const supabase = getSupabase();

  const { data: liga, error: ligaErr } = await supabase
    .from('bg_ligas')
    .select('id, nombre, ronda, fase, num_rondas')
    .eq('codigo', codigo)
    .single();
  if (ligaErr || !liga) return bad('No existe ninguna liga con ese código', 404);
  if (liga.fase === 'cerrada') return bad('Esta liga ya ha terminado', 409);

  const { count: numEquipos } = await supabase
    .from('bg_equipos')
    .select('id', { count: 'exact', head: true })
    .eq('liga_id', liga.id);
  if ((numEquipos ?? 0) >= MAX_EQUIPOS_POR_LIGA) {
    return bad(`Esta liga ya tiene ${MAX_EQUIPOS_POR_LIGA} equipos, el máximo`, 409);
  }

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
