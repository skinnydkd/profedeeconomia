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

export function validarDecision(raw: any): ValidacionDecision {
  const decision = {} as Record<CampoDecision, number>;
  for (const c of CAMPOS_DECISION) {
    const v = Number(raw?.[c]);
    if (!Number.isFinite(v) || v < 0) return { ok: false, error: `Decisión inválida en "${c}"` };
    if (v > MAX_DECISION[c]) return { ok: false, error: `El valor de "${c}" supera el máximo permitido` };
    decision[c] = v;
  }
  if (decision.precio <= 0) return { ok: false, error: 'El precio debe ser mayor que 0' };
  return { ok: true, decision };
}
