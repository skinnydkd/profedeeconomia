/**
 * Pure productivity math. Partial productivity (output per factor), global
 * productivity (value of output / value of inputs) and the % change between
 * two periods. Returns `null` for undefined cases instead of NaN/Infinity.
 */
export function productividadFactor(produccion: number, factor: number): number | null {
  if (factor <= 0) return null;
  return produccion / factor;
}

export function productividadGlobal(valorProduccion: number, valorFactores: number): number | null {
  if (valorFactores <= 0) return null;
  return valorProduccion / valorFactores;
}

export function variacionPct(base: number, nuevo: number): number | null {
  if (base === 0) return null;
  return ((nuevo - base) / base) * 100;
}
