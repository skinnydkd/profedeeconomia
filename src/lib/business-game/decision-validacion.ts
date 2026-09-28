export const CAMPOS_DECISION = ['precio', 'marketing', 'produccion', 'calidad', 'rrhh', 'prestamo'] as const;
export type CampoDecision = (typeof CAMPOS_DECISION)[number];

/**
 * Per-field upper bounds. Generous for any realistic classroom play, but finite
 * so one team can't submit an absurd value that griefs the shared market.
 */
export const MAX_DECISION: Record<CampoDecision, number> = {
  precio: 1_000_000,
  marketing: 5_000_000,
  produccion: 5_000_000,
  calidad: 5_000_000,
  rrhh: 5_000_000,
  prestamo: 50_000_000,
};

export type ValidacionDecision =
  | { ok: true; decision: Record<CampoDecision, number> }
  | { ok: false; error: string };

/**
 * `precioMinimo` (por liga: la mitad del coste variable base) evita precios de
 * céntimos que no tienen sentido económico; sin él, basta con que sea > 0.
 */
export function validarDecision(raw: any, opciones: { precioMinimo?: number } = {}): ValidacionDecision {
  const decision = {} as Record<CampoDecision, number>;
  for (const c of CAMPOS_DECISION) {
    const v = Number(raw?.[c]);
    if (!Number.isFinite(v) || v < 0) return { ok: false, error: `Decisión inválida en "${c}"` };
    if (v > MAX_DECISION[c]) return { ok: false, error: `El valor de "${c}" supera el máximo permitido` };
    decision[c] = v;
  }
  if (decision.precio <= 0) return { ok: false, error: 'El precio debe ser mayor que 0' };
  const minimo = opciones.precioMinimo ?? 0;
  if (decision.precio < minimo) {
    return { ok: false, error: `El precio no puede bajar de ${minimo.toLocaleString('es-ES')} € por unidad` };
  }
  return { ok: true, decision };
}
