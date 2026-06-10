/**
 * Pure price elasticity of demand for the Eco 1BACH Unit 5 calculator.
 *
 * No Preact, no DOM: only the economics, so every formula can be unit-tested
 * independently of the UI.
 *
 * Two ways to measure the elasticity:
 *
 *   ARC (midpoint method) — between two observed points (P1, Q1) and (P2, Q2):
 *
 *            (Q2 − Q1) / ((Q2 + Q1) / 2)
 *       E = -----------------------------
 *            (P2 − P1) / ((P2 + P1) / 2)
 *
 *     The midpoint base makes the result symmetric: the elasticity is the same
 *     whether price rises P1→P2 or falls P2→P1. For a normal demand curve E is
 *     negative (quantity and price move in opposite directions).
 *
 *   POINT — at a single point on a linear demand curve Q = a + b·P (b < 0):
 *
 *       E = b · (P / Q)
 *
 *     where b = dQ/dP is the slope of the demand function.
 *
 * Classification uses |E| (the magnitude), the convention taught at this level:
 *   |E| > 1  → elástica
 *   |E| < 1  → inelástica
 *   |E| = 1  → unitaria
 *   |E| = 0  → perfectamente inelástica (vertical demand)
 *   |E| = ∞  → perfectamente elástica (horizontal demand)
 *
 * Total revenue (IT = P · Q) reacts to a price rise depending on elasticity:
 *   elástica   → IT cae   (the % drop in Q beats the % rise in P)
 *   inelástica → IT sube  (the % drop in Q is smaller than the % rise in P)
 *   unitaria   → IT igual
 */

/** Tolerance for treating |E| as exactly 1 (unit elastic) given float noise. */
export const UNIT_TOLERANCE = 1e-9;

export type ElasticityKind =
  | 'elastica'
  | 'inelastica'
  | 'unitaria'
  | 'perfectamente_elastica'
  | 'perfectamente_inelastica';

export interface PricePoint {
  /** Price. */
  P: number;
  /** Quantity demanded at that price. */
  Q: number;
}

export interface ArcElasticityResult {
  /** Signed elasticity (negative for a normal demand curve). */
  E: number;
  /** Magnitude |E| used for the classification. */
  absE: number;
  /** Percentage change in quantity (midpoint base), as a ratio. */
  pctChangeQ: number;
  /** Percentage change in price (midpoint base), as a ratio. */
  pctChangeP: number;
}

/**
 * Arc (midpoint) elasticity between two points of the demand curve.
 *
 * Returns E = Infinity / -Infinity when price does not change (vertical move),
 * and E = 0 when quantity does not change. Throws if the two points coincide.
 */
export function arcElasticity(a: PricePoint, b: PricePoint): ArcElasticityResult {
  const avgQ = (a.Q + b.Q) / 2;
  const avgP = (a.P + b.P) / 2;

  if (avgP === 0) {
    throw new Error('El precio medio no puede ser cero.');
  }
  if (avgQ === 0) {
    throw new Error('La cantidad media no puede ser cero.');
  }

  const pctChangeQ = (b.Q - a.Q) / avgQ;
  const pctChangeP = (b.P - a.P) / avgP;

  if (pctChangeP === 0 && pctChangeQ === 0) {
    throw new Error('Los dos puntos son idénticos: no hay variación.');
  }

  const E = pctChangeP === 0 ? (pctChangeQ > 0 ? Infinity : -Infinity) : pctChangeQ / pctChangeP;

  return { E, absE: Math.abs(E), pctChangeQ, pctChangeP };
}

/**
 * Point elasticity on a linear demand curve, given the slope b = dQ/dP and a
 * point (P, Q) on the curve:  E = b · (P / Q).
 *
 * Throws if quantity is zero (elasticity undefined there).
 */
export function pointElasticity(slope: number, P: number, Q: number): number {
  if (Q === 0) {
    throw new Error('La cantidad no puede ser cero al calcular la elasticidad punto.');
  }
  return slope * (P / Q);
}

/**
 * Classify an elasticity from its (possibly signed) value.
 *
 * Uses |E|. Infinite magnitude → perfectamente elástica, zero → perfectamente
 * inelástica, within tolerance of 1 → unitaria.
 */
export function classify(E: number): ElasticityKind {
  const absE = Math.abs(E);
  if (!Number.isFinite(absE)) return 'perfectamente_elastica';
  if (absE === 0) return 'perfectamente_inelastica';
  if (Math.abs(absE - 1) <= UNIT_TOLERANCE) return 'unitaria';
  return absE > 1 ? 'elastica' : 'inelastica';
}

/** Human-readable Spanish label for an elasticity kind. */
export function classifyLabel(kind: ElasticityKind): string {
  switch (kind) {
    case 'elastica':
      return 'Demanda elástica';
    case 'inelastica':
      return 'Demanda inelástica';
    case 'unitaria':
      return 'Demanda de elasticidad unitaria';
    case 'perfectamente_elastica':
      return 'Demanda perfectamente elástica';
    case 'perfectamente_inelastica':
      return 'Demanda perfectamente inelástica';
  }
}

export type RevenueDirection = 'sube' | 'baja' | 'igual';

export interface RevenueEffect {
  /** Total revenue before the price move (P · Q at the lower price). */
  before: number;
  /** Total revenue after the price move (P · Q at the higher price). */
  after: number;
  /** Signed change after − before. */
  change: number;
  /** Direction of the change in total revenue when the price rises. */
  direction: RevenueDirection;
}

/**
 * Effect on total revenue (IT = P · Q) of moving along the demand curve.
 *
 * The two points are taken as observed price/quantity pairs; `before` is the
 * IT at the point with the lower price and `after` the IT at the higher price,
 * so the result describes "what happens to IT when the price rises".
 *
 * For a normal demand curve this matches the elasticity rule:
 *   elástica → IT baja, inelástica → IT sube, unitaria → IT igual.
 *
 * Returns null when both prices are equal (a vertical/perfectly-elastic move):
 * the price does not rise, so a "what happens to IT when the price rises"
 * narrative would be misleading.
 */
export function revenueEffect(a: PricePoint, b: PricePoint): RevenueEffect | null {
  if (a.P === b.P) return null;

  // Order by price so the result always describes a price *increase*.
  const low = a.P <= b.P ? a : b;
  const high = a.P <= b.P ? b : a;

  const before = low.P * low.Q;
  const after = high.P * high.Q;
  const change = after - before;

  let direction: RevenueDirection;
  if (Math.abs(change) <= UNIT_TOLERANCE) direction = 'igual';
  else if (change > 0) direction = 'sube';
  else direction = 'baja';

  return { before, after, change, direction };
}

export interface ElasticityReport {
  arc: ArcElasticityResult;
  kind: ElasticityKind;
  label: string;
  /** Effect on total revenue, or null when both prices are equal (no price rise). */
  revenue: RevenueEffect | null;
}

/**
 * Full report for two demand points: arc elasticity, classification and the
 * effect on total revenue. Convenience wrapper used by the UI.
 */
export function analyze(a: PricePoint, b: PricePoint): ElasticityReport {
  const arc = arcElasticity(a, b);
  const kind = classify(arc.E);
  return {
    arc,
    kind,
    label: classifyLabel(kind),
    revenue: revenueEffect(a, b),
  };
}
