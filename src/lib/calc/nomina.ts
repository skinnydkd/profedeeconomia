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
 *  - MEI (Mecanismo de Equidad Intergeneracional), parte trabajador: 0,13 %
 *
 * The MEI worker share rises each year by 0,01 pp (0,12 % in 2025 ->
 * 0,13 % in 2026), per the official MEI schedule. If the TGSS publishes a
 * different 2026 figure, update the constant below; the maths is unchanged.
 *
 * Simplifications (teaching tool): contribution bases equal the gross salary
 * (no min/max base capping), and the IRPF withholding equals the annual IRPF
 * computed in irpf.ts (state scale only). Real payrolls cap the contribution
 * base and apply the AEAT withholding algorithm; this is close enough to teach
 * why net pay is lower than gross.
 */

import { calcularIRPF, type OpcionesIRPF, type ResultadoIRPF } from './irpf';

export type Contrato = 'indefinido' | 'temporal';

export const COTIZACIONES_TRABAJADOR_2026 = {
  contingenciasComunes: 0.047,
  desempleoIndefinido: 0.0155,
  desempleoTemporal: 0.016,
  formacionProfesional: 0.001,
  mei: 0.0013,
} as const;

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
  /** Total annual worker contributions. */
  total: number;
  /** Total monthly worker contributions. */
  mensual: number;
}

export interface ResultadoNomina {
  brutoAnual: number;
  brutoMensual: number;
  pagas: 12 | 14;
  contrato: Contrato;
  cotizaciones: DesgloseCotizaciones;
  /** Taxable base for IRPF = gross − SS contributions. */
  baseIRPF: number;
  irpf: ResultadoIRPF;
  liquidoAnual: number;
  liquidoMensual: number;
}

/** Worker's unemployment contribution rate by contract type, 2026. */
export function tasaDesempleo(contrato: Contrato): number {
  return contrato === 'temporal'
    ? COTIZACIONES_TRABAJADOR_2026.desempleoTemporal
    : COTIZACIONES_TRABAJADOR_2026.desempleoIndefinido;
}

/** Compute a full payroll from an annual gross salary. */
export function calcularNomina(brutoAnual: number, opciones: OpcionesNomina = {}): ResultadoNomina {
  const bruto = Number.isFinite(brutoAnual) && brutoAnual > 0 ? brutoAnual : 0;
  const pagas = opciones.pagas ?? 14;
  const contrato = opciones.contrato ?? 'indefinido';

  const cc = bruto * COTIZACIONES_TRABAJADOR_2026.contingenciasComunes;
  const desempleo = bruto * tasaDesempleo(contrato);
  const fp = bruto * COTIZACIONES_TRABAJADOR_2026.formacionProfesional;
  const mei = bruto * COTIZACIONES_TRABAJADOR_2026.mei;
  const totalCotizaciones = cc + desempleo + fp + mei;

  const cotizaciones: DesgloseCotizaciones = {
    contingenciasComunes: cc,
    desempleo,
    formacionProfesional: fp,
    mei,
    total: totalCotizaciones,
    mensual: totalCotizaciones / pagas,
  };

  // IRPF taxable base = gross − SS contributions (rendimiento neto del trabajo).
  const baseIRPF = Math.max(0, bruto - totalCotizaciones);

  const irpf = calcularIRPF(baseIRPF, {
    hijos: opciones.hijos,
    discapacidad: opciones.discapacidad,
    deducciones: opciones.deducciones,
    rendimientoNetoTrabajo: baseIRPF,
  });

  const liquidoAnual = Math.max(0, bruto - totalCotizaciones - irpf.cuota);

  return {
    brutoAnual: bruto,
    brutoMensual: bruto / pagas,
    pagas,
    contrato,
    cotizaciones,
    baseIRPF,
    irpf,
    liquidoAnual,
    liquidoMensual: liquidoAnual / pagas,
  };
}
