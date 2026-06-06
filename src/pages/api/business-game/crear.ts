// POST /api/business-game/crear — el profe crea una liga y recibe el código + token.
import type { APIRoute } from 'astro';
import { json, bad, getSupabase } from '@/lib/business-game/server/api';
import { signBgToken, getSecret, generarCodigo } from '@/lib/business-game/server/tokens';
import { normalizeInstitute } from '@/lib/jocs-economics/server/institutes';
import { DEFAULT_PARAMS } from '@/lib/business-game/engine';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let body: any;
  try { body = await request.json(); } catch { return bad('JSON inválido'); }

  const nombre = String(body?.nombre ?? '').trim();
  const instituto = String(body?.instituto ?? '').trim();
  if (nombre.length < 2) return bad('El nombre de la liga es obligatorio');
  if (instituto.length < 2) return bad('El instituto es obligatorio');

  const numRondas = Math.min(Math.max(parseInt(String(body?.numRondas ?? 8), 10) || 8, 1), 20);
  const params = { ...DEFAULT_PARAMS, ...(body?.params && typeof body.params === 'object' ? body.params : {}) };

  const supabase = getSupabase();

  // Genera un código único (reintenta ante colisión).
  let codigo = '';
  let ligaId = '';
  for (let intento = 0; intento < 6; intento++) {
    codigo = generarCodigo();
    const { data, error } = await supabase
      .from('bg_ligas')
      .insert({
        codigo,
        nombre,
        institute_norm: normalizeInstitute(instituto),
        institute_display: instituto,
        params,
        num_rondas: numRondas,
      })
      .select('id')
      .single();
    if (!error && data) { ligaId = data.id; break; }
    if (error && !String(error.message).includes('duplicate')) return bad('No se pudo crear la liga', 500);
  }
  if (!ligaId) return bad('No se pudo generar un código único, inténtalo de nuevo', 500);

  const token = signBgToken({ ligaId, rol: 'profe' }, getSecret());
  return json({ codigo, token, ligaId, ronda: 1, fase: 'decisiones', numRondas, params });
};
