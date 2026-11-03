/**
 * Payroll (nómina) — pure, unit-tested logic for Eco 4ESO.
 *
 * From an annual gross salary it computes the worker's Social Security
 * contributions and the IRPF withholding, returning the net pay (líquido).
 *
 * 2026 worker contribution rates (Tesorería General de la Seguridad Social,
 * régimen general; rates approved for 2026):
 *  - Contingencias comunes:        4,70 %
 *  - Desempleo (indefinido):       1,55 %  ·  (temporal): 1,60 %
 *  - Formación profesional:        0,10 %
 *  - MEI (Mecanismo de Equidad Intergeneracional), parte trabajador: 0,15 %
 *
 * The MEI total rises 0,10 pp per year (0,80 % in 2025 -> 0,90 % in 2026)
 * and is split 5/6 employer, 1/6 worker, so the worker share is 0,15 % in
 * 2026 (0,13 % in 2025). If the TGSS publishes a different figure, update
 * the constant below; the maths is unchanged.
 *
 * Contribution base: the gross salary with the extras prorated over twelve
 * months, capped at the 2026 maximum base (5.101,20 €/month, Orden
 * PJC/297/2026). Pay above the cap owes the solidarity contribution (art. 19
 * bis LGSS), shared like common contingencies.
 *
 * Social Security is paid in twelve monthly contributions on that base, so
 * with 14 payments the two extra pays carry IRPF withholding but no SS: an
 * ordinary month nets gross/14 − SS/12 − IRPF/14 and an extra pay
 * gross/14 − IRPF/14.
 *
 * Simplifications (teaching tool): no minimum base (it depends on the
 * professional group and the hours), and the IRPF withholding equals the
 * annual IRPF computed in irpf.ts. Real payrolls apply the AEAT withholding
 * algorithm; this is close enough to teach why net pay is lower than gross.
 */

import { calcularIRPF, type OpcionesIRPF, type ResultadoIRPF } from './irpf';

export type Contrato = 'indefinido' | 'temporal';

export const COTIZACIONES_TRABAJADOR_2026 = {
  contingenciasComunes: 0.047,
  desempleoIndefinido: 0.0155,
  desempleoTemporal: 0.016,
  formacionProfesional: 0.001,
  mei: 0.0015,
} as const;

/** Maximum monthly contribution base, 2026 (Orden PJC/297/2026). */
export const BASE_MAXIMA_MENSUAL_2026 = 5101.2;

/**
 * Solidarity contribution on monthly pay above the maximum base, 2026:
 * 1,15 % up to 10 % above it, 1,25 % from 10 % to 50 %, 1,46 % beyond.
 */
export const SOLIDARIDAD_2026: ReadonlyArray<{ hastaSobreBase: number; tipo: number }> = [
  { hastaSobreBase: 0.1, tipo: 0.0115 },
  { hastaSobreBase: 0.5, tipo: 0.0125 },
  { hastaSobreBase: Infinity, tipo: 0.0146 },
];

/** Worker's share of the solidarity contribution: 4,70 of the 28,30 points of common contingencies. */
export const PARTE_TRABAJADOR_SOLIDARIDAD = 0.047 / 0.283;

/**
 * Annual contribution base and total solidarity contribution (worker and
 * employer together) for an annual gross salary, prorating the extras.
 */
export function baseCotizacion(brutoAnual: number): { baseAnual: number; solidaridadTotal: number } {
  const bruto = Number.isFinite(brutoAnual) && brutoAnual > 0 ? brutoAnual : 0;
  const max = BASE_MAXIMA_MENSUAL_2026;
  const mensual = bruto / 12;
  const exceso = Math.max(0, mensual - max);
  let solidaridadMensual = 0;
  let desde = 0;
  for (const tramo of SOLIDARIDAD_2026) {
    const hasta = tramo.hastaSobreBase * max;
    solidaridadMensual += Math.max(0, Math.min(exceso, hasta) - desde) * tramo.tipo;
    if (exceso <= hasta) break;
    desde = hasta;
  }
  return { baseAnual: Math.min(mensual, max) * 12, solidaridadTotal: solidaridadMensual * 12 };
}

export interface OpcionesNomina {
  /** Number of pay periods per year (12 or 14). Default 14. */
  pagas?: 12 | 14;
  /** Contract type — affects the unemployment contribution. Default indefinido. */
  contrato?: Contrato;
  /** Dependent children for the IRPF personal/family minimum. */
  hijos?: number;
  /** Disability grade for the IRPF minimum. */
  discapacidad?: OpcionesIRPF['discapacidad'];
  /** Extra IRPF deductions, in euros. */
  deducciones?: number;
}

export interface DesgloseCotizaciones {
  contingenciasComunes: number;
  desempleo: number;
  formacionProfesional: number;
  mei: number;
  /** Worker's share of the solidarity contribution (0 below the maximum base). */
  solidaridad: number;
  /** Total annual worker contributions. */
  total: number;
  /** Monthly worker contributions: total / 12, also with 14 payments (the extra pays carry none). */
  mensual: number;
}

export interface ResultadoNomina {
  brutoAnual: number;
  brutoMensual: number;
  pagas: 12 | 14;
  contrato: Contrato;
  /** Annual contribution base: the gross, capped at twelve maximum monthly bases. */
  baseCotizacion: number;
  /** True when the gross goes over the maximum base. */
  topeBase: boolean;
  cotizaciones: DesgloseCotizaciones;
  /** Net work income for IRPF = gross − SS contributions (before the IRPF deductions). */
  baseIRPF: number;
  irpf: ResultadoIRPF;
  liquidoAnual: number;
  /** Net pay of an ordinary month: gross/pagas − SS/12 − IRPF/pagas. */
  liquidoMensual: number;
  /** Net of each of the two extra pays (gross/14 − IRPF/14, no SS); null with 12 payments. */
  liquidoPagaExtra: number | null;
}

/** Worker's unemployment contribution rate by contract type, 2026. */
export function tasaDesempleo(contrato: Contrato): number {
  return contrato === 'temporal'
    ? COTIZACIONES_TRABAJADOR_2026.desempleoTemporal
    : COTIZACIONES_TRABAJADOR_2026.desempleoIndefinido;
}

/** Worker's Social Security contributions for a year, on the capped base. */
export function cotizacionesTrabajador(
  brutoAnual: number,
  contrato: Contrato = 'indefinido',
): DesgloseCotizaciones {
  const { baseAnual, solidaridadTotal } = baseCotizacion(brutoAnual);
  const cc = baseAnual * COTIZACIONES_TRABAJADOR_2026.contingenciasComunes;
  const desempleo = baseAnual * tasaDesempleo(contrato);
  const fp = baseAnual * COTIZACIONES_TRABAJADOR_2026.formacionProfesional;
  const mei = baseAnual * COTIZACIONES_TRABAJADOR_2026.mei;
  const solidaridad = solidaridadTotal * PARTE_TRABAJADOR_SOLIDARIDAD;
  const total = cc + desempleo + fp + mei + solidaridad;
  return {
    contingenciasComunes: cc,
    desempleo,
    formacionProfesional: fp,
    mei,
    solidaridad,
    total,
    mensual: total / 12,
  };
}

/** Compute a full payroll from an annual gross salary. */
export function calcularNomina(brutoAnual: number, opciones: OpcionesNomina = {}): ResultadoNomina {
  const bruto = Number.isFinite(brutoAnual) && brutoAnual > 0 ? brutoAnual : 0;
  const pagas = opciones.pagas ?? 14;
  const contrato = opciones.contrato ?? 'indefinido';

  const { baseAnual } = baseCotizacion(bruto);
  const cotizaciones = cotizacionesTrabajador(bruto, contrato);
  const totalCotizaciones = cotizaciones.total;

  // IRPF taxable base = gross − SS contributions (rendimiento neto del trabajo).
  const baseIRPF = Math.max(0, bruto - totalCotizaciones);

  const irpf = calcularIRPF(baseIRPF, {
    hijos: opciones.hijos,
    discapacidad: opciones.discapacidad,
    deducciones: opciones.deducciones,
    rendimientoNetoTrabajo: baseIRPF,
  });

  const liquidoAnual = Math.max(0, bruto - totalCotizaciones - irpf.cuota);
  // Every payment withholds its share of the IRPF; only the twelve ordinary
  // months carry the Social Security contribution.
  const brutoMensual = bruto / pagas;
  const irpfPorPaga = irpf.cuota / pagas;

  return {
    brutoAnual: bruto,
    brutoMensual,
    pagas,
    contrato,
    baseCotizacion: baseAnual,
    topeBase: baseAnual < bruto,
    cotizaciones,
    baseIRPF,
    irpf,
    liquidoAnual,
    liquidoMensual: Math.max(0, brutoMensual - cotizaciones.mensual - irpfPorPaga),
    liquidoPagaExtra: pagas === 14 ? Math.max(0, brutoMensual - irpfPorPaga) : null,
  };
}
