// GET /api/business-game/estado?codigo=XXXXXX — estado público de la liga para
// que el profe y los equipos hagan polling: liga, equipos (con su estado y si han
// enviado decisiones esta ronda) y resultados de todas las rondas.
import type { APIRoute } from 'astro';
import { json, bad, getSupabase } from '@/lib/business-game/server/api';

export const prerender = false;

// The whole class polls the same league, so Vercel's CDN answers them from one
// copy: fresh for 3 s, then served stale for up to 5 s more while it refetches.
// A class then costs one function call every few seconds instead of one per
// screen. Browsers still get `no-store`; the screens never let an older copy
// replace a newer state, and skip the copy after their own actions
// (lib/business-game/polling.ts).
const CACHE_CDN = { 'vercel-cdn-cache-control': 'max-age=3, stale-while-revalidate=5' };

export const GET: APIRoute = async ({ url }) => {
  const codigo = (url.searchParams.get('codigo') ?? '').trim().toUpperCase();
  if (codigo.length !== 6) return bad('Código no válido');

  const supabase = getSupabase();

  const { data: liga, error: ligaErr } = await supabase
    .from('bg_ligas')
    .select('id, nombre, ronda, fase, num_rondas')
    .eq('codigo', codigo)
    .single();
  if (ligaErr || !liga) return bad('Liga no encontrada', 404);

  const [{ data: equipos }, { data: decis }, { data: resultados }] = await Promise.all([
    supabase.from('bg_equipos').select('id, nombre, institute_display, caja, beneficio_acumulado, deuda')
      .eq('liga_id', liga.id).order('beneficio_acumulado', { ascending: false }),
    supabase.from('bg_decisiones').select('equipo_id').eq('liga_id', liga.id).eq('ronda', liga.ronda),
    supabase.from('bg_resultados')
      .select('equipo_id, ronda, calidad, cuota, ventas, stock, ingresos, costes, beneficio, beneficio_acumulado')
      .eq('liga_id', liga.id).order('ronda', { ascending: true }),
  ]);

  const enviado = new Set((decis ?? []).map((d) => d.equipo_id));

  return json({
    generadoEn: Date.now(),
    liga: { id: liga.id, nombre: liga.nombre, ronda: liga.ronda, fase: liga.fase, numRondas: liga.num_rondas },
    equipos: (equipos ?? []).map((e) => ({
      id: e.id, nombre: e.nombre, instituto: e.institute_display,
      caja: Number(e.caja), beneficioAcumulado: Number(e.beneficio_acumulado), deuda: Number(e.deuda),
      haEnviado: enviado.has(e.id),
    })),
    resultados: (resultados ?? []).map((r) => ({
      equipoId: r.equipo_id, ronda: r.ronda, calidad: Number(r.calidad), cuota: Number(r.cuota),
      ventas: Number(r.ventas), stock: Number(r.stock), ingresos: Number(r.ingresos), costes: Number(r.costes),
      beneficio: Number(r.beneficio), beneficioAcumulado: Number(r.beneficio_acumulado),
    })),
  }, 200, CACHE_CDN);
};
