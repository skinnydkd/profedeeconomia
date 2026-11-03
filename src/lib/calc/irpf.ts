/**
 * IRPF (Spanish personal income tax) — pure, unit-tested logic.
 *
 * Scope: a teaching-grade approximation for Eco 4ESO. It models the general
 * scale (state half plus a model regional half, see ESCALA_COMBINADA_2026),
 * the personal/family minimum mechanism, the 2.000 € of other deductible
 * expenses, the earned-income reduction and an optional lump of extra
 * deductions. It does NOT model each region's own scale, regional
 * deductions, joint filing or other special regimes.
 *
 * 2026 figures / sources (Agencia Tributaria, Ley 35/2006 IRPF):
 *  - General scale: state half (art. 63: 9,5 / 12 / 15 / 18,5 / 22,5 / 24,5 %)
 *    plus the supplementary regional half (art. 74: 9,5 / 12 / 15 / 18,5 /
 *    22,5 / 22,5 %), which gives 19 / 24 / 30 / 37 / 45 / 47 %. Each region
 *    applies its own half to the whole base; this is the model one.
 *  - Other deductible expenses of every employee (art. 19.2.f): 2.000 €.
 *  - Personal minimum (mínimo del contribuyente): 5.550 €.
 *  - Minimum per descendant: 2.400 / 2.700 / 4.000 / 4.500 € (1st..4th+).
 *  - Disability minimum: 3.000 € (33–65 %) / 12.000 € (>=65 %).
 *  - Earned-income reduction (reducción por rendimientos del trabajo, art. 20
 *    as amended by RDL 4/2024): 7.302 € up to 14.852 € of net income, then two
 *    slopes (−1,75 up to 17.673,52 € and −1,14 up to 19.747,5 €).
 *  - Earned-income deduction on the quota (DA 61.ª, RDL 5/2026): up to
 *    590,89 €, gone at 20.048,45 € of gross earned income. Only the tax
 *    return applies it (declaracion-irpf.ts); calcularIRPF does not.
 *
 * NOTE: the figures above are the most recent official values known at the
 * time of writing (2026-05). If the AEAT publishes updated 2026 thresholds,
 * adjust the constants below — the algorithm does not change.
 */

export type Discapacidad = 'ninguna' | 'media' | 'alta';

export interface OpcionesIRPF {
  /** Number of dependent children (descendientes). */
  hijos?: number;
  /** Disability grade of the taxpayer. */
  discapacidad?: Discapacidad;
  /** Extra deductions applied to the gross quota, in euros. */
  deducciones?: number;
  /**
   * Net earned income used for the earned-income reduction. Defaults to the
   * taxable base passed to calcularIRPF (a fair approximation once SS
   * contributions are already netted out upstream).
   */
  rendimientoNetoTrabajo?: number;
}

export interface TramoEscala {
  desde: number;
  hasta: number;
  tipo: number;
}

export interface DesgloseTramo {
  desde: number;
  hasta: number;
  tipo: number;
  baseEnTramo: number;
  cuota: number;
}

export interface ResultadoIRPF {
  /** Income fed in (net of Social Security, before the work deductions). */
  base: number;
  /** Other deductible expenses applied to the work income (2.000 € at most). */
  otrosGastos: number;
  /** Earned-income reduction applied. */
  reduccion: number;
  /** Base the scale is applied to: base − other expenses − reduction. */
  baseLiquidable: number;
  /** Personal + family minimum applied (taxed at the lowest bracket rate). */
  minimo: number;
  /** Per-bracket breakdown of the scale applied to the full base. */
  desglose: DesgloseTramo[];
  /** Quota of the scale applied to the base, before the minimum credit. */
  cuotaIntegra: number;
  /** Quota of the scale applied to the personal/family minimum (the credit). */
  cuotaMinimo: number;
  /** Extra deductions actually applied (cannot exceed the quota). */
  deducciones: number;
  /** Final IRPF due (never negative). */
  cuota: number;
  /** Effective average rate over the base, as a percentage (0–100). */
  tipoMedio: number;
}

/** Personal minimum (mínimo del contribuyente), 2026. */
export const MINIMO_PERSONAL = 5550;

/** Disability minimum add-ons, 2026. */
const MINIMO_DISCAPACIDAD: Record<Discapacidad, number> = {
  ninguna: 0,
  media: 3000, // 33 %–65 %
  alta: 12000, // >= 65 %
};

/** Minimum per descendant by birth order (1st, 2nd, 3rd, 4th and beyond), 2026. */
const MINIMO_POR_HIJO = [2400, 2700, 4000, 4500];

/**
 * General scale, 2026: the state half (art. 63 LIRPF) plus the supplementary
 * regional half (art. 74), which is what a taxpayer pays where the region has
 * not set its own. The 47 % top rate is 24,5 + 22,5. Every region applies its
 * own half to the whole base, so real figures move a little around these.
 */
export const ESCALA_COMBINADA_2026: TramoEscala[] = [
  { desde: 0, hasta: 12450, tipo: 0.19 },
  { desde: 12450, hasta: 20200, tipo: 0.24 },
  { desde: 20200, hasta: 35200, tipo: 0.3 },
  { desde: 35200, hasta: 60000, tipo: 0.37 },
  { desde: 60000, hasta: 300000, tipo: 0.45 },
  { desde: 300000, hasta: Infinity, tipo: 0.47 },
];

/** Other deductible expenses of every employee (art. 19.2.f LIRPF), per year. */
export const OTROS_GASTOS_TRABAJO = 2000;

/**
 * Earned-income reduction (reducción por rendimientos del trabajo, art. 20
 * LIRPF), 2026. `rendimientoNeto` is the work income minus Social Security,
 * before the 2.000 € of other expenses.
 * - net <= 14.852 €               -> 7.302 €
 * - 14.852 < net <= 17.673,52 €   -> 7.302 − 1,75 × (net − 14.852)
 * - 17.673,52 < net <= 19.747,5 € -> 2.364,34 − 1,14 × (net − 17.673,52)
 * - net > 19.747,5 €              -> 0
 */
export function reduccionRendimientosTrabajo(rendimientoNeto: number): number {
  if (!Number.isFinite(rendimientoNeto) || rendimientoNeto <= 0) return 0;
  if (rendimientoNeto <= 14852) return 7302;
  if (rendimientoNeto <= 17673.52) return 7302 - 1.75 * (rendimientoNeto - 14852);
  if (rendimientoNeto <= 19747.5) return Math.max(0, 2364.34 - 1.14 * (rendimientoNeto - 17673.52));
  return 0;
}

/**
 * Deduction for obtaining earned income, 2026 (deducción por obtención de
 * rendimientos del trabajo, DA 61.ª LIRPF as set by RDL 5/2026). It is based
 * on the gross earned income (rendimientos íntegros del trabajo):
 * - RIT <= 17.094 € (the 2026 SMI)  -> 590,89 €
 * - above it                       -> 590,89 − 0,2 × (RIT − 17.094), 0 from 20.048,45 €
 * It cannot exceed the tax on the earned income and only applies when the
 * other income is 6.500 € or less; the tax return simulator checks both. It
 * is not part of the withholding, so the payroll calculator leaves it out:
 * a minimum-wage earner gets back in the return what was withheld.
 */
export function deduccionRendimientosTrabajo2026(rendimientosIntegros: number): number {
  if (!Number.isFinite(rendimientosIntegros) || rendimientosIntegros <= 0) return 0;
  if (rendimientosIntegros <= 17094) return 590.89;
  return Math.max(0, 590.89 - 0.2 * (rendimientosIntegros - 17094));
}

/** Other income above which the deduction above does not apply, 2026. */
export const OTRAS_RENTAS_MAX_DEDUCCION_TRABAJO = 6500;

/** Personal + family minimum (mínimo personal y familiar), 2026. */
export function minimoPersonalYFamiliar(opciones: OpcionesIRPF): number {
  const hijos = Math.max(0, Math.floor(opciones.hijos ?? 0));
  const discapacidad = opciones.discapacidad ?? 'ninguna';

  let minimo = MINIMO_PERSONAL + MINIMO_DISCAPACIDAD[discapacidad];
  for (let i = 0; i < hijos; i++) {
    minimo += MINIMO_POR_HIJO[Math.min(i, MINIMO_POR_HIJO.length - 1)];
  }
  return minimo;
}

/** Apply a progressive scale to a base, returning the quota and a breakdown. */
function aplicarEscala(base: number, escala: TramoEscala[]): { cuota: number; desglose: DesgloseTramo[] } {
  const desglose: DesgloseTramo[] = [];
  let cuota = 0;
  for (const t of escala) {
    const ancho = t.hasta - t.desde;
    const baseEnTramo = Math.max(0, Math.min(base, t.hasta) - t.desde);
    const c = baseEnTramo * t.tipo;
    cuota += c;
    desglose.push({
      desde: t.desde,
      hasta: t.hasta,
      tipo: t.tipo,
      baseEnTramo,
      cuota: c,
    });
    if (base <= t.hasta) break;
    void ancho;
  }
  return { cuota, desglose };
}

/**
 * Compute IRPF for a given income, net of Social Security.
 *
 * Method (mirrors the AEAT mechanism): the work income first loses the
 * 2.000 € of other expenses and the earned-income reduction, neither of which
 * can take it below zero. The scale is then applied to the resulting base AND
 * to the personal/family minimum; the tax due is the difference, so the
 * minimum is effectively taxed at 0 %. Then extra deductions are subtracted.
 * The result is floored at 0 (no refunds modelled here).
 */
export function calcularIRPF(baseImponible: number, opciones: OpcionesIRPF = {}): ResultadoIRPF {
  const base = Number.isFinite(baseImponible) && baseImponible > 0 ? baseImponible : 0;

  // Work deductions, computed on the work income only (the whole base by default).
  const rendimientoNeto = Math.max(0, opciones.rendimientoNetoTrabajo ?? base);
  const otrosGastos = Math.min(OTROS_GASTOS_TRABAJO, rendimientoNeto);
  const reduccion = Math.min(reduccionRendimientosTrabajo(rendimientoNeto), rendimientoNeto - otrosGastos);
  const baseTrasReduccion = Math.max(0, base - otrosGastos - reduccion);

  const minimo = minimoPersonalYFamiliar(opciones);

  const escalaBase = aplicarEscala(baseTrasReduccion, ESCALA_COMBINADA_2026);
  const escalaMinimo = aplicarEscala(Math.min(minimo, baseTrasReduccion), ESCALA_COMBINADA_2026);

  const cuotaIntegra = escalaBase.cuota;
  const cuotaMinimo = escalaMinimo.cuota;
  const cuotaTrasMinimo = Math.max(0, cuotaIntegra - cuotaMinimo);

  const deduccionesSolicitadas = Math.max(0, opciones.deducciones ?? 0);
  const deducciones = Math.min(deduccionesSolicitadas, cuotaTrasMinimo);
  const cuota = Math.max(0, cuotaTrasMinimo - deducciones);

  const tipoMedio = base > 0 ? (cuota / base) * 100 : 0;

  return {
    base,
    otrosGastos,
    reduccion,
    baseLiquidable: baseTrasReduccion,
    minimo,
    desglose: escalaBase.desglose,
    cuotaIntegra,
    cuotaMinimo,
    deducciones,
    cuota,
    tipoMedio,
  };
}
