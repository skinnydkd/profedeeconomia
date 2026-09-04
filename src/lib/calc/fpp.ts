/**
 * Production possibilities frontier (FPP). Two goods, one fixed pool of
 * resources. The island draws the SVG; this module only computes numbers.
 *
 * Two shapes, because a 1BACH course needs both:
 * - `recta`: resources are perfectly interchangeable, so the opportunity cost
 *   of X is the same everywhere on the frontier (maxY / maxX).
 * - `concava`: the quarter ellipse y = maxY·√(1 − (x/maxX)²), the usual
 *   textbook curve. Opportunity cost grows as production of X grows, which is
 *   the law of increasing opportunity cost made visible.
 */
export type FormaFPP = 'recta' | 'concava';

export interface FPP {
  maxX: number;
  maxY: number;
  forma: FormaFPP;
}

/** Quantity of Y attainable on the frontier when X is produced. NaN outside [0, maxX]. */
export function fronteraY({ maxX, maxY, forma }: FPP, x: number): number {
  if (maxX <= 0 || maxY < 0) return NaN;
  if (x < 0 || x > maxX) return NaN;
  const r = x / maxX;
  return forma === 'recta' ? maxY * (1 - r) : maxY * Math.sqrt(Math.max(0, 1 - r * r));
}

export type Posicion = 'eficiente' | 'ineficiente' | 'inalcanzable';

/**
 * Where a production point sits relative to the frontier. `tol` is a relative
 * tolerance on maxY so that a point typed in with two decimals still reads as
 * efficient instead of falling a hair inside the curve.
 */
export function clasificar(fpp: FPP, x: number, y: number, tol = 0.005): Posicion {
  if (x < 0 || y < 0 || x > fpp.maxX) return 'inalcanzable';
  const frontera = fronteraY(fpp, x);
  const margen = fpp.maxY * tol;
  if (y > frontera + margen) return 'inalcanzable';
  if (y < frontera - margen) return 'ineficiente';
  return 'eficiente';
}

export interface CosteArco {
  /** Units of X gained (may be negative when moving left). */
  deltaX: number;
  /** Units of Y given up (positive when Y falls). */
  deltaY: number;
  /** Units of Y sacrificed per extra unit of X. NaN when x1 === x2. */
  coste: number;
}

/**
 * Opportunity cost of moving along the frontier from x1 to x2, measured as
 * units of Y sacrificed per unit of X gained. This is the arc cost — the one a
 * 1BACH exercise computes — not the derivative.
 */
export function costeOportunidadArco(fpp: FPP, x1: number, x2: number): CosteArco {
  const y1 = fronteraY(fpp, x1);
  const y2 = fronteraY(fpp, x2);
  const deltaX = x2 - x1;
  const deltaY = y1 - y2;
  return { deltaX, deltaY, coste: deltaX === 0 ? NaN : deltaY / deltaX };
}

/**
 * Growth: the same frontier after resources or technology improve by a
 * percentage in each good. Uneven growth tilts the curve instead of pushing it
 * out evenly, which is the point of showing it.
 */
export function crecimiento(fpp: FPP, pctX: number, pctY: number): FPP {
  return { ...fpp, maxX: fpp.maxX * (1 + pctX / 100), maxY: fpp.maxY * (1 + pctY / 100) };
}
