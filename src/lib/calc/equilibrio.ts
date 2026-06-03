/**
 * Pure market-equilibrium math for linear curves Qd = a − b·P, Qs = c + d·P
 * (b, d > 0). The island draws the SVG; this module only computes numbers.
 */
export interface Coef { a: number; b: number; c: number; d: number; }

export function equilibrio(a: number, b: number, c: number, d: number):
  { valido: true; P: number; Q: number } | { valido: false } {
  const sum = b + d;
  if (sum === 0) return { valido: false };
  const P = (a - c) / sum;
  const Q = a - b * P;
  if (P < 0 || Q < 0) return { valido: false };
  return { valido: true, P, Q };
}

export function evaluarPrecio(coef: Coef, P: number): { qd: number; qs: number; exceso: number } {
  const qd = coef.a - coef.b * P;
  const qs = coef.c + coef.d * P;
  return { qd, qs, exceso: qs - qd };
}

export function intervencion(coef: Coef, tipo: 'maximo' | 'minimo', precio: number):
  { efectivo: boolean; intercambiada: number; escasez: number; excedente: number } {
  const eq = equilibrio(coef.a, coef.b, coef.c, coef.d);
  const { qd, qs } = evaluarPrecio(coef, precio);
  const efectivo = eq.valido && (tipo === 'maximo' ? precio < eq.P : precio > eq.P);
  if (!efectivo) return { efectivo: false, intercambiada: eq.valido ? eq.Q : 0, escasez: 0, excedente: 0 };
  return {
    efectivo: true,
    intercambiada: Math.min(qd, qs),
    escasez: tipo === 'maximo' ? Math.max(0, qd - qs) : 0,
    excedente: tipo === 'minimo' ? Math.max(0, qs - qd) : 0,
  };
}
