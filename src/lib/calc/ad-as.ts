/**
 * Pure AD-AS macroeconomic model for the Eco 1BACH Unit 8 simulator.
 *
 * No Preact, no DOM: only the economics, so the equilibria can be unit-tested
 * independently of the UI.
 *
 * Conventions (all magnitudes are dimensionless *index* numbers so the model
 * stays readable for 16-17 year-old students):
 *
 *   Y  = real output (real GDP), baseline potential = 100
 *   P  = aggregate price level (price index), baseline = 100
 *
 * Three curves:
 *
 *   LRAS — long-run aggregate supply. Vertical line at potential output:
 *            Y = Y_pot = 100 + lrasShift
 *          Potential output depends only on structural factors (capital,
 *          labour, technology), never on the price level.
 *
 *   AD   — aggregate demand. Downward sloping. A demand shock moves it
 *          horizontally by `adShift`:
 *            P = P0 + (Y_AD0 + adShift) − Y          [slope −1]
 *          i.e. at the reference price the curve passes through
 *          Y = Y_AD0 + adShift.
 *
 *   SRAS — short-run aggregate supply. Upward sloping. A *cost* shock moves it:
 *          a negative supply shock (dearer energy/wages) shifts SRAS left/up,
 *          a positive one (cheaper inputs, higher productivity) shifts it
 *          right/down. Modelled as a horizontal shift `srasShift`:
 *            P = P0 + (Y − (Y_SRAS0 + srasShift))    [slope +SRAS_SLOPE]
 *
 * Short-run equilibrium = AD ∩ SRAS.
 * Output gap = Y* − Y_pot:
 *   gap > 0 → inflationary (expansive) gap
 *   gap < 0 → recessionary gap
 *   gap = 0 → full employment / potential output.
 *
 * Long-run self-correction: when output differs from potential, the SRAS curve
 * drifts until the short-run equilibrium lands exactly on LRAS (gap → 0). The
 * price level absorbs the whole adjustment; output returns to Y_pot.
 */

// Baseline reference point shared by every curve (the "calm" starting economy).
export const BASE_Y = 100;
export const BASE_P = 100;

/** Slope of SRAS in (P per unit of Y). 1 keeps the algebra clean for students. */
export const SRAS_SLOPE = 1;

/** Inputs that fully describe the state of the model. */
export interface ADASState {
  /** Horizontal shift of aggregate demand (demand shock). */
  adShift: number;
  /** Horizontal shift of short-run aggregate supply (cost/supply shock). */
  srasShift: number;
  /** Shift of potential output / LRAS (structural change). */
  lrasShift: number;
}

export type GapKind = 'recesiva' | 'inflacionaria' | 'neutra';

/** A computed equilibrium point. */
export interface Equilibrium {
  /** Real output at equilibrium. */
  Y: number;
  /** Price level at equilibrium. */
  P: number;
}

export interface ADASResult {
  /** Potential output (where LRAS sits). */
  potentialY: number;
  /** Short-run equilibrium (AD ∩ SRAS). */
  shortRun: Equilibrium;
  /** Long-run equilibrium (AD ∩ LRAS, after SRAS self-corrects). */
  longRun: Equilibrium;
  /** Output gap = shortRun.Y − potentialY. */
  outputGap: number;
  /** Output gap as a percentage of potential output. */
  outputGapPct: number;
  /** Qualitative classification of the gap. */
  gapKind: GapKind;
}

/** Treat |x| below this as zero (avoids floating-point noise in labels). */
const EPS = 1e-9;

/** Aggregate demand: price as a function of output, given the state. */
export function adPrice(Y: number, state: ADASState): number {
  // P = BASE_P + (BASE_Y + adShift) − Y
  return BASE_P + (BASE_Y + state.adShift) - Y;
}

/** Short-run aggregate supply: price as a function of output, given the state. */
export function srasPrice(Y: number, state: ADASState): number {
  // P = BASE_P + SRAS_SLOPE * (Y − (BASE_Y + srasShift))
  return BASE_P + SRAS_SLOPE * (Y - (BASE_Y + state.srasShift));
}

/** Potential output / position of the vertical LRAS. */
export function potentialOutput(state: ADASState): number {
  return BASE_Y + state.lrasShift;
}

/**
 * Solve AD ∩ SRAS for the short-run equilibrium.
 *
 * BASE_P + (BASE_Y + adShift) − Y = BASE_P + SRAS_SLOPE·(Y − BASE_Y − srasShift)
 *   (BASE_Y + adShift) − Y = SRAS_SLOPE·Y − SRAS_SLOPE·(BASE_Y + srasShift)
 *   Y·(1 + SRAS_SLOPE) = (BASE_Y + adShift) + SRAS_SLOPE·(BASE_Y + srasShift)
 */
export function shortRunEquilibrium(state: ADASState): Equilibrium {
  const num =
    BASE_Y + state.adShift + SRAS_SLOPE * (BASE_Y + state.srasShift);
  const Y = num / (1 + SRAS_SLOPE);
  const P = adPrice(Y, state);
  return { Y, P };
}

/**
 * Long-run equilibrium: output returns to potential (AD ∩ LRAS). SRAS has
 * drifted until it crosses that point, so the price level is read off AD.
 */
export function longRunEquilibrium(state: ADASState): Equilibrium {
  const Y = potentialOutput(state);
  const P = adPrice(Y, state);
  return { Y, P };
}

/** Classify an output gap into one of the three pedagogical categories. */
export function classifyGap(gap: number): GapKind {
  if (Math.abs(gap) <= EPS) return 'neutra';
  return gap > 0 ? 'inflacionaria' : 'recesiva';
}

/** Full solve: everything the UI needs from a given state. */
export function solveADAS(state: ADASState): ADASResult {
  const potentialY = potentialOutput(state);
  const shortRun = shortRunEquilibrium(state);
  const longRun = longRunEquilibrium(state);
  const outputGap = shortRun.Y - potentialY;
  const outputGapPct = potentialY !== 0 ? (outputGap / potentialY) * 100 : 0;
  return {
    potentialY,
    shortRun,
    longRun,
    outputGap,
    outputGapPct,
    gapKind: classifyGap(outputGap),
  };
}

/**
 * Compute the SRAS shift required for the long-run self-correction, i.e. the
 * value of `srasShift` that makes the short-run equilibrium land on LRAS.
 *
 * Setting shortRunEquilibrium(state').Y = potentialOutput(state) and solving
 * for srasShift':
 *   potentialY·(1 + SRAS_SLOPE) = (BASE_Y + adShift) + SRAS_SLOPE·(BASE_Y + s')
 *   s' = [potentialY·(1 + SRAS_SLOPE) − (BASE_Y + adShift)] / SRAS_SLOPE − BASE_Y
 */
export function srasShiftForLongRun(state: ADASState): number {
  const potentialY = potentialOutput(state);
  const num =
    potentialY * (1 + SRAS_SLOPE) - (BASE_Y + state.adShift);
  return num / SRAS_SLOPE - BASE_Y;
}

/**
 * Return the state after the economy has fully self-corrected to the long run:
 * AD and LRAS unchanged, SRAS drifted so the gap closes.
 */
export function adjustToLongRun(state: ADASState): ADASState {
  return { ...state, srasShift: srasShiftForLongRun(state) };
}
