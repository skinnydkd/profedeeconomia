/**
 * IRPF (Spanish personal income tax) — pure, unit-tested logic.
 *
 * Scope: a teaching-grade approximation for Eco 4ESO. It models the *state*
 * general scale plus the personal/family minimum mechanism, the earned-income
 * reduction and an optional lump of extra deductions. It deliberately does NOT
 * model the autonomous-community half of the scale (each CCAA sets its own),
 * regional deductions, joint filing or other special regimes.
 *
 * 2026 figures / sources (Agencia Tributaria, Ley 35/2006 IRPF):
 *  - State general scale (escala estatal de gravamen): unchanged for 2026,
 *    same brackets as 2024-2025 (BOE; AEAT manual de renta).
 *  - Personal minimum (mínimo del contribuyente): 5.550 €.
 *  - Minimum per descendant: 2.400 / 2.700 / 4.000 / 4.500 € (1st..4th+).
 *  - Disability minimum: 3.000 € (33–65 %) / 12.000 € (>=65 %).
 *  - Earned-income reduction (reducción por rendimientos del trabajo),
 *    raised for 2025+ (RDL 4/2024): max 7.302 € for net income <= 14.852 €,
 *    phasing out linearly up to 19.747,5 €.
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
  /** Taxable base fed in. */
  base: number;
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
 * State general scale (escala estatal), 2026. These are the *state* rates;
 * the full marginal rate a taxpayer pays also includes the autonomous-community
 * scale, which roughly doubles them. For a teaching tool we use the state scale
 * doubled is avoided — we apply only the state scale and say so in the UI.
 */
export const ESCALA_IRPF_2026: TramoEscala[] = [
  { desde: 0, hasta: 12450, tipo: 0.19 },
  { desde: 12450, hasta: 20200, tipo: 0.24 },
  { desde: 20200, hasta: 35200, tipo: 0.3 },
  { desde: 35200, hasta: 60000, tipo: 0.37 },
  { desde: 60000, hasta: 300000, tipo: 0.45 },
  { desde: 300000, hasta: Infinity, tipo: 0.47 },
];

/**
 * Earned-income reduction (reducción por rendimientos del trabajo), 2026.
 * - net income <= 14.852 €  -> 7.302 €
 * - 14.852 < net <= 19.747,5 -> 7.302 − 1,75 × (net − 14.852)
 * - net > 19.747,5          -> 0
 */
export function reduccionRendimientosTrabajo(rendimientoNeto: number): number {
  if (!Number.isFinite(rendimientoNeto) || rendimientoNeto <= 0) return 0;
  if (rendimientoNeto <= 14852) return 7302;
  if (rendimientoNeto <= 19747.5) {
    return Math.max(0, 7302 - 1.75 * (rendimientoNeto - 14852));
  }
  return 0;
}

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
 * Compute IRPF for a given taxable base.
 *
 * Method (mirrors the AEAT mechanism): the scale is applied to the full base
 * AND to the personal/family minimum; the tax due is the difference, so the
 * minimum is effectively taxed at 0 %. Then extra deductions are subtracted.
 * The result is floored at 0 (no refunds modelled here).
 */
export function calcularIRPF(baseImponible: number, opciones: OpcionesIRPF = {}): ResultadoIRPF {
  const base = Number.isFinite(baseImponible) && baseImponible > 0 ? baseImponible : 0;

  // Earned-income reduction lowers the taxable base.
  const rendimientoNeto = opciones.rendimientoNetoTrabajo ?? base;
  const reduccion = reduccionRendimientosTrabajo(rendimientoNeto);
  const baseTrasReduccion = Math.max(0, base - reduccion);

  const minimo = minimoPersonalYFamiliar(opciones);

  const escalaBase = aplicarEscala(baseTrasReduccion, ESCALA_IRPF_2026);
  const escalaMinimo = aplicarEscala(Math.min(minimo, baseTrasReduccion), ESCALA_IRPF_2026);

  const cuotaIntegra = escalaBase.cuota;
  const cuotaMinimo = escalaMinimo.cuota;
  const cuotaTrasMinimo = Math.max(0, cuotaIntegra - cuotaMinimo);

  const deduccionesSolicitadas = Math.max(0, opciones.deducciones ?? 0);
  const deducciones = Math.min(deduccionesSolicitadas, cuotaTrasMinimo);
  const cuota = Math.max(0, cuotaTrasMinimo - deducciones);

  const tipoMedio = base > 0 ? (cuota / base) * 100 : 0;

  return {
    base,
    minimo,
    desglose: escalaBase.desglose,
    cuotaIntegra,
    cuotaMinimo,
    deducciones,
    cuota,
    tipoMedio,
  };
}
