/**
 * 4-year university degree budget estimator for FOPP 4ESO (Unit 6 —
 * FP / Universidad / becas).
 *
 * Pure module (no Preact): two functions that estimate the yearly and total
 * cost of studying a public university degree, depending on whether the student
 * lives at home or away (residence / shared flat), and how a grant (beca
 * MEC/general) changes the picture.
 *
 * IMPORTANT — honesty about the figures: every default amount here is
 * *orientativo* (a rough order of magnitude), NOT an official price. Public
 * tuition in Spain is set per credit by each autonomous community and varies a
 * lot (roughly 700–1.700 € per course as of 2024-25). The real figure must be
 * checked in the price decree of the student's CCAA / university. The defaults
 * are exported so the UI can show them while making clear they are editable.
 */

/* -------------------------------------------------------------------------- */
/*  Orientative defaults (NOT official — see module header)                    */
/* -------------------------------------------------------------------------- */

/**
 * Rough yearly amounts, in euros. Public-university scenario. These are coarse
 * national averages a 4º-ESO student can tweak; they are not prices from any
 * official decree.
 */
export const DEFAULTS = {
  /** Public tuition per course (full-time). Real range ≈ 700–1.700 €/curso. */
  matricula: 1000,
  /** Living away: residence / shared flat, per course (~10 months). */
  alojamientoFuera: 5500,
  /** Living at home: small share of household costs attributed to the student. */
  alojamientoCasa: 0,
  /** Food and daily expenses, per course. Lower when living at home. */
  manutencionFuera: 3000,
  manutencionCasa: 1200,
  /** Books, materials, software, per course. */
  material: 400,
  /** Transport, per course. Higher when commuting from home town. */
  transporteFuera: 600,
  transporteCasa: 1000,
  /** Typical years for a Spanish "grado" (Bolonia). */
  anos: 4,
} as const;

/* -------------------------------------------------------------------------- */
/*  Yearly cost                                                                 */
/* -------------------------------------------------------------------------- */

export interface PresupuestoAnualInput {
  /** Public tuition for the course (€/curso). */
  matricula: number;
  /** Accommodation for the course (€/curso). Ignored when viveEnCasa is true. */
  alojamiento: number;
  /** Food / daily living for the course (€/curso). */
  manutencion: number;
  /** Books, materials, software for the course (€/curso). */
  material: number;
  /** Transport for the course (€/curso). */
  transporte: number;
  /**
   * Whether the student lives at home. When true, accommodation is reduced to
   * `alojamientoEnCasa` (0 by default) regardless of `alojamiento`.
   */
  viveEnCasa: boolean;
  /**
   * Accommodation cost charged even when living at home (e.g. a small share of
   * household bills). Defaults to 0. Only used when `viveEnCasa` is true.
   */
  alojamientoEnCasa?: number;
}

export interface DesglosePartida {
  matricula: number;
  alojamiento: number;
  manutencion: number;
  material: number;
  transporte: number;
}

export interface PresupuestoAnualResultado {
  /** Per-concept yearly breakdown (after the at-home accommodation rule). */
  desglose: DesglosePartida;
  /** Total yearly cost (sum of the breakdown). */
  total: number;
  viveEnCasa: boolean;
}

/** Treat negative / non-finite inputs as 0 so the maths never goes wrong. */
function sane(n: number): number {
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/**
 * Yearly cost of one course, broken down by concept.
 *
 * The at-home rule: if `viveEnCasa` is true, accommodation is replaced by
 * `alojamientoEnCasa` (0 by default), modelling that living at home removes the
 * rent of a residence / shared flat.
 */
export function presupuestoAnual(input: PresupuestoAnualInput): PresupuestoAnualResultado {
  const matricula = sane(input.matricula);
  const manutencion = sane(input.manutencion);
  const material = sane(input.material);
  const transporte = sane(input.transporte);
  const alojamiento = input.viveEnCasa
    ? sane(input.alojamientoEnCasa ?? 0)
    : sane(input.alojamiento);

  const desglose: DesglosePartida = {
    matricula,
    alojamiento,
    manutencion,
    material,
    transporte,
  };
  const total = matricula + alojamiento + manutencion + material + transporte;

  return { desglose, total, viveEnCasa: input.viveEnCasa };
}

/* -------------------------------------------------------------------------- */
/*  Full degree cost (N years)                                                  */
/* -------------------------------------------------------------------------- */

/** How the grant amount is expressed. */
export type BecaModo = 'anual' | 'total';

export interface PresupuestoGradoInput extends PresupuestoAnualInput {
  /** Number of years of the degree. Defaults to 4. Clamped to >= 1. */
  anos?: number;
  /** Grant amount. Interpreted per `becaModo`. Defaults to 0. */
  beca?: number;
  /** Whether `beca` is per year ('anual') or for the whole degree ('total'). */
  becaModo?: BecaModo;
}

export interface PresupuestoGradoResultado {
  /** Years used in the calculation (clamped). */
  anos: number;
  /** Yearly breakdown (same every year — constant model). */
  anual: PresupuestoAnualResultado;
  /** Gross total cost of the degree (yearly total × years), before any grant. */
  totalBruto: number;
  /** Total grant applied over the whole degree (per `becaModo`). */
  becaTotal: number;
  /** Net cost after subtracting the grant. Never below 0. */
  totalNeto: number;
}

/** Round to 2 decimals to avoid floating-point noise in money figures. */
function money(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Total cost of an N-year degree under a constant-yearly-cost model, with the
 * grant subtracted.
 *
 * - `anos` is clamped to at least 1 (you cannot study a 0-year degree).
 * - The grant can be given per year (`becaModo: 'anual'`, multiplied by years)
 *   or as a single lump sum for the whole degree (`becaModo: 'total'`).
 * - The net cost is floored at 0: a grant larger than the cost does NOT produce
 *   a negative figure (the family does not "earn" money), it just covers it all.
 */
export function presupuestoGrado(input: PresupuestoGradoInput): PresupuestoGradoResultado {
  const anos = Math.max(1, Math.floor(sane(input.anos ?? DEFAULTS.anos)));
  const anual = presupuestoAnual(input);
  const totalBruto = money(anual.total * anos);

  const becaModo: BecaModo = input.becaModo ?? 'anual';
  const beca = sane(input.beca ?? 0);
  const becaTotal = money(becaModo === 'anual' ? beca * anos : beca);

  // Floor net at 0: a grant bigger than the cost covers everything, no refund.
  const totalNeto = money(Math.max(0, totalBruto - becaTotal));

  return { anos, anual, totalBruto, becaTotal, totalNeto };
}
