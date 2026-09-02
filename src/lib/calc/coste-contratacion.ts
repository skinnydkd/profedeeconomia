/**
 * What a hire really costs the company, and how far that is from what the
 * worker takes home.
 *
 * The worker's side is already modelled in nomina.ts; this module adds the
 * employer's contributions and turns the annual figure into a cost per
 * effective hour, which is the number a business plan needs.
 *
 * 2026 employer contribution rates, régimen general (Tesorería General de la
 * Seguridad Social):
 *  - Contingencias comunes:            23,60 %
 *  - Desempleo (indefinido):            5,50 %  ·  (temporal): 6,70 %
 *  - FOGASA:                            0,20 %
 *  - Formación profesional:             0,60 %
 *  - MEI, parte empresa:                0,75 %  (5/6 of the 0,90 % total)
 *  - Accidentes de trabajo y enfermedad profesional: depends on the activity
 *    tariff, so it is an input rather than a constant. 1,50 % is a common
 *    office-work figure; construction and agriculture are far higher.
 *
 * Same simplification as nomina.ts: the contribution base equals the gross
 * salary, with no minimum or maximum base capping. Rates change every year —
 * check them against the TGSS before teaching the exact figure.
 */
import { calcularNomina, tasaDesempleo, type Contrato, type OpcionesNomina } from './nomina';

export const COTIZACIONES_EMPRESA_2026 = {
  contingenciasComunes: 0.236,
  desempleoIndefinido: 0.055,
  desempleoTemporal: 0.067,
  fogasa: 0.002,
  formacionProfesional: 0.006,
  mei: 0.0075,
} as const;

/** Default AT/EP rate: a common office tariff, not a legal constant. */
export const TASA_AT_EP_POR_DEFECTO = 0.015;

export interface OpcionesCoste extends OpcionesNomina {
  /** Accident/occupational-illness rate as a fraction (0,015 = 1,5 %). */
  tasaAtEp?: number;
  /** Contracted hours per week. */
  horasSemana?: number;
  /** Weeks actually worked, once holidays and public days are taken out. */
  semanasTrabajadas?: number;
}

export interface DesgloseEmpresa {
  contingenciasComunes: number;
  desempleo: number;
  atEp: number;
  fogasa: number;
  formacionProfesional: number;
  mei: number;
  total: number;
}

export interface ResultadoCoste {
  valido: boolean;
  brutoAnual: number;
  contrato: Contrato;
  cotizacionesEmpresa: DesgloseEmpresa;
  /** Gross salary plus employer contributions. */
  costeTotalAnual: number;
  costeTotalMensual: number;
  /** Employer contributions as a share of the gross salary. */
  sobrecosteSobreBruto: number;
  horasEfectivas: number;
  costePorHora: number;
  /** What the worker actually receives, from nomina.ts. */
  liquidoAnual: number;
  /** Company cost minus take-home pay: the wedge, in euros. */
  cunaFiscal: number;
  /** The wedge as a share of the total cost. */
  cunaFiscalPorcentaje: number;
}

export function tasaDesempleoEmpresa(contrato: Contrato): number {
  return contrato === 'temporal'
    ? COTIZACIONES_EMPRESA_2026.desempleoTemporal
    : COTIZACIONES_EMPRESA_2026.desempleoIndefinido;
}

export function calcularCoste(brutoAnual: number, opciones: OpcionesCoste = {}): ResultadoCoste {
  const {
    tasaAtEp = TASA_AT_EP_POR_DEFECTO,
    horasSemana = 40,
    semanasTrabajadas = 46,
    contrato = 'indefinido',
    ...restoNomina
  } = opciones;

  const vacio: ResultadoCoste = {
    valido: false,
    brutoAnual,
    contrato,
    cotizacionesEmpresa: {
      contingenciasComunes: NaN, desempleo: NaN, atEp: NaN,
      fogasa: NaN, formacionProfesional: NaN, mei: NaN, total: NaN,
    },
    costeTotalAnual: NaN, costeTotalMensual: NaN, sobrecosteSobreBruto: NaN,
    horasEfectivas: NaN, costePorHora: NaN, liquidoAnual: NaN,
    cunaFiscal: NaN, cunaFiscalPorcentaje: NaN,
  };
  if (!Number.isFinite(brutoAnual) || brutoAnual <= 0) return vacio;
  if (!Number.isFinite(tasaAtEp) || tasaAtEp < 0 || tasaAtEp > 0.25) return vacio;
  if (horasSemana <= 0 || semanasTrabajadas <= 0) return vacio;

  const r = COTIZACIONES_EMPRESA_2026;
  const cotizacionesEmpresa: DesgloseEmpresa = {
    contingenciasComunes: brutoAnual * r.contingenciasComunes,
    desempleo: brutoAnual * tasaDesempleoEmpresa(contrato),
    atEp: brutoAnual * tasaAtEp,
    fogasa: brutoAnual * r.fogasa,
    formacionProfesional: brutoAnual * r.formacionProfesional,
    mei: brutoAnual * r.mei,
    total: 0,
  };
  cotizacionesEmpresa.total =
    cotizacionesEmpresa.contingenciasComunes + cotizacionesEmpresa.desempleo +
    cotizacionesEmpresa.atEp + cotizacionesEmpresa.fogasa +
    cotizacionesEmpresa.formacionProfesional + cotizacionesEmpresa.mei;

  const costeTotalAnual = brutoAnual + cotizacionesEmpresa.total;
  const horasEfectivas = horasSemana * semanasTrabajadas;
  const nomina = calcularNomina(brutoAnual, { ...restoNomina, contrato });

  return {
    valido: true,
    brutoAnual,
    contrato,
    cotizacionesEmpresa,
    costeTotalAnual,
    costeTotalMensual: costeTotalAnual / 12,
    sobrecosteSobreBruto: cotizacionesEmpresa.total / brutoAnual,
    horasEfectivas,
    costePorHora: costeTotalAnual / horasEfectivas,
    liquidoAnual: nomina.liquidoAnual,
    cunaFiscal: costeTotalAnual - nomina.liquidoAnual,
    cunaFiscalPorcentaje: (costeTotalAnual - nomina.liquidoAnual) / costeTotalAnual,
  };
}

/** Total employer rate for a contract type, useful for the «×1,3x» rule of thumb. */
export function tasaTotalEmpresa(contrato: Contrato, tasaAtEp = TASA_AT_EP_POR_DEFECTO): number {
  const r = COTIZACIONES_EMPRESA_2026;
  return r.contingenciasComunes + tasaDesempleoEmpresa(contrato) + tasaAtEp +
    r.fogasa + r.formacionProfesional + r.mei;
}

/** Re-exported so the island can show both sides of the wedge from one import. */
export { tasaDesempleo };
