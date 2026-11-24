/**
 * Geometry for the data-driven market diagram (MercadoGrafico.astro).
 * A linear curve is written the way the book writes it: Q = q0 + m·P.
 */

export interface Tramo { p1: number; q1: number; p2: number; q2: number; }

/**
 * The part of Q = q0 + m·P that falls inside the plot box
 * 0 ≤ P ≤ pMax, 0 ≤ Q ≤ qMax, from its lowest price to its highest.
 * Returns null when the line never enters the box.
 */
export function tramoVisible(q0: number, m: number, pMax: number, qMax: number): Tramo | null {
  let lo = 0;
  let hi = pMax;
  if (m === 0) {
    if (q0 < 0 || q0 > qMax) return null;
  } else {
    const pEnQ0 = -q0 / m;
    const pEnQMax = (qMax - q0) / m;
    lo = Math.max(lo, Math.min(pEnQ0, pEnQMax));
    hi = Math.min(hi, Math.max(pEnQ0, pEnQMax));
  }
  if (lo >= hi) return null;
  return { p1: lo, q1: q0 + m * lo, p2: hi, q2: q0 + m * hi };
}

/** 18000 → «18 000», 7.5 → «7,5»: the way the book writes figures. */
export function cifra(n: number): string {
  const [entero, decimal] = String(Math.round(n * 100) / 100).split('.');
  const miles = entero.replace(/\B(?=(\d{3})+$)/g, ' ');
  return decimal ? `${miles},${decimal}` : miles;
}
