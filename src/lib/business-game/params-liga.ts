// Business Game — límites de lo que el profe (o cualquiera que llame a la API)
// puede guardar en una liga. `params` va tal cual a un JSONB compartido y al
// motor: un valor no numérico acababa en NaN y bloqueaba el cierre de ronda.
import { DEFAULT_PARAMS, type MarketParams } from './engine';

/** Máximo de caracteres de los textos libres. */
export const MAX_NOMBRE = 60;
export const MAX_INSTITUTO = 80;
export const MAX_MIEMBROS = 200;
/** Equipos por liga: una clase grande cabe de sobra; miles de equipos no. */
export const MAX_EQUIPOS_POR_LIGA = 40;

/** Rango admitido de cada parámetro del mercado [mínimo, máximo]. */
export const RANGOS_PARAMS: Record<keyof MarketParams, [number, number]> = {
  demandaBase: [100, 10_000_000],
  crecimientoDemanda: [-0.5, 1],
  pesoCalidad: [0, 1],
  pesoMarketing: [0, 1],
  pesoPrecio: [0, 1],
  precioReferencia: [0.5, 100_000],
  costeFijo: [0, 100_000_000],
  costeVariableBase: [0, 100_000],
  costeStock: [0, 100_000],
  interesPrestamo: [0, 1],
};

/**
 * Solo claves conocidas, solo números finitos dentro de su rango; lo demás
 * toma el valor por defecto. Sirve para crear la liga y para leerla al cerrar.
 */
export function sanearParams(raw: unknown): MarketParams {
  const entrada = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const out = { ...DEFAULT_PARAMS };
  for (const clave of Object.keys(RANGOS_PARAMS) as (keyof MarketParams)[]) {
    const v = Number(entrada[clave]);
    const [min, max] = RANGOS_PARAMS[clave];
    if (entrada[clave] !== undefined && entrada[clave] !== null && Number.isFinite(v) && v >= min && v <= max) {
      out[clave] = v;
    }
  }
  return out;
}

/** Texto libre recortado; `null` si no llega al mínimo o pasa del máximo. */
export function textoValido(raw: unknown, min: number, max: number): string | null {
  const t = String(raw ?? '').trim();
  return t.length >= min && t.length <= max ? t : null;
}
