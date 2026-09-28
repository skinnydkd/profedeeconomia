/**
 * IRPF annual tax return (declaración de la renta) — pure, unit-tested logic
 * for Eco 4ESO, Unit 8 (economía personal).
 *
 * The payroll module (nomina.ts) models the *monthly withholding*. This module
 * models the *year-end settlement*: it computes the real annual IRPF quota and
 * compares it with the retentions already withheld during the year. The
 * difference is the "resultado de la declaración":
 *   - resultado > 0  -> you withheld too little  -> a pagar (you owe money)
 *   - resultado < 0  -> you withheld too much    -> a devolver (Hacienda refunds you)
 *   - resultado = 0  -> exactly right            -> nothing to settle
 *
 * Reuse / coherence:
 *  - The annual quota comes straight from calcularIRPF (irpf.ts): general
 *    scale, personal/family minimum, the 2.000 € of other expenses, the
 *    earned-income reduction and extra deductions. We do NOT re-implement any
 *    tax figure here.
 *  - The Social Security contributions come from nomina.ts (same 2026 rates,
 *    same capped base), so "make the payroll" and "do the tax return" stay
 *    consistent.
 *
 * Scope kept deliberately simple (4ESO): only earned income plus an optional
 * lump of basic savings income (rendimientos del capital mobiliario), which we
 * fold into the same base for teaching purposes. No joint filing, no regional
 * scale, no special regimes.
 */

import { calcularIRPF, type Discapacidad } from './irpf';
import { cotizacionesTrabajador, type Contrato } from './nomina';

export interface OpcionesDeclaracion {
  /** Gross earned income for the year (rendimientos íntegros del trabajo), in euros. */
  rendimientosTrabajo: number;
  /** IRPF retentions already withheld during the year (suma de retenciones de las nóminas), in euros. */
  retencionesPracticadas: number;
  /** Optional basic savings income (rendimientos del capital mobiliario), in euros. */
  rendimientosCapital?: number;
  /** Contract type — affects the unemployment contribution used to net the base. Default indefinido. */
  contrato?: Contrato;
  /** Dependent children for the IRPF personal/family minimum. */
  hijos?: number;
  /** Disability grade of the taxpayer for the IRPF minimum. */
  discapacidad?: Discapacidad;
  /** Extra IRPF deductions applied to the quota, in euros. */
  deducciones?: number;
}

export interface ResultadoDeclaracion {
  /** Gross earned income fed in. */
  rendimientosTrabajo: number;
  /** Basic savings income fed in. */
  rendimientosCapital: number;
  /** Worker's Social Security contributions deducted to build the taxable base. */
  cotizaciones: number;
  /** Net work income = gross work income − SS contributions. */
  rendimientoNetoTrabajo: number;
  /** Other deductible expenses of every employee (2.000 € at most). */
  otrosGastos: number;
  /** Earned-income reduction. */
  reduccion: number;
  /** Taxable base = net work income − other expenses − reduction (+ savings income). */
  baseImponible: number;
  /** Real annual IRPF quota (from calcularIRPF). */
  cuotaIRPF: number;
  /** Effective average IRPF rate over the base, as a percentage (0–100). */
  tipoMedio: number;
  /** Personal + family minimum applied. */
  minimo: number;
  /** Retentions already withheld during the year (clamped to >= 0). */
  retenciones: number;
  /**
   * Settlement result = cuotaIRPF − retenciones.
   *   positive -> a pagar, negative -> a devolver, zero -> nothing to settle.
   */
  resultado: number;
  /** Absolute value of the settlement (always >= 0). */
  importe: number;
  /** True when resultado > 0 (you owe Hacienda). */
  aPagar: boolean;
  /** True when resultado < 0 (Hacienda refunds you). */
  aDevolver: boolean;
}

const noNeg = (n: number | undefined): number =>
  Number.isFinite(n) && (n as number) > 0 ? (n as number) : 0;

/**
 * Simulate an annual IRPF tax return (declaración de la renta).
 *
 * Nets the worker's SS contributions (same 2026 rules as the payroll) out of
 * the gross work income, adds any basic savings income, runs calcularIRPF to
 * get the real annual quota, and subtracts the retentions already withheld to
 * obtain the settlement.
 */
export function simularDeclaracion(opciones: OpcionesDeclaracion): ResultadoDeclaracion {
  const rendimientosTrabajo = noNeg(opciones.rendimientosTrabajo);
  const rendimientosCapital = noNeg(opciones.rendimientosCapital);
  const retenciones = noNeg(opciones.retencionesPracticadas);
  const contrato = opciones.contrato ?? 'indefinido';

  // Net the SS contributions out of the gross work income to get the
  // rendimiento neto del trabajo, consistent with nomina.ts.
  const cotizaciones = cotizacionesTrabajador(rendimientosTrabajo, contrato).total;
  const netoTrabajo = Math.max(0, rendimientosTrabajo - cotizaciones);

  // For a 4ESO-grade tool we fold the basic savings income into the same base.
  const irpf = calcularIRPF(netoTrabajo + rendimientosCapital, {
    hijos: opciones.hijos,
    discapacidad: opciones.discapacidad,
    deducciones: opciones.deducciones,
    // The earned-income reduction is based on the net work income only.
    rendimientoNetoTrabajo: netoTrabajo,
  });

  const cuotaIRPF = irpf.cuota;
  const resultado = cuotaIRPF - retenciones;

  return {
    rendimientosTrabajo,
    rendimientosCapital,
    cotizaciones,
    rendimientoNetoTrabajo: netoTrabajo,
    otrosGastos: irpf.otrosGastos,
    reduccion: irpf.reduccion,
    baseImponible: irpf.baseLiquidable,
    cuotaIRPF,
    tipoMedio: irpf.tipoMedio,
    minimo: irpf.minimo,
    retenciones,
    resultado,
    importe: Math.abs(resultado),
    aPagar: resultado > 0,
    aDevolver: resultado < 0,
  };
}
