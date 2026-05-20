/**
 * DCF (Discounted Cash Flow) valuation — pure, unit-tested logic.
 *
 * Teaching-grade model for EDMN 2BACH (financiación / valoración de empresas).
 * Discounts a series of projected free cash flows at a discount rate (WACC) and
 * adds a terminal / residual value to obtain the enterprise value.
 *
 *   VA(flujo_t) = flujo_t / (1 + WACC)^t
 *   Valor residual (Gordon) = flujo_n · (1 + g) / (WACC − g)   [si WACC > g]
 *   Valor de empresa = Σ VA(flujo_t) + VA(valor residual)
 *
 * The terminal value is computed at the end of the explicit horizon (year n)
 * and then discounted back to t=0 with the same factor as the last flow.
 *
 * All inputs are rates as decimals (0.08 = 8 %), not percentages.
 */

/** Per-year breakdown of the explicit-horizon discounting. */
export interface DesgloseAnio {
  /** 1-based year index. */
  anio: number;
  /** Projected cash flow for the year, in euros. */
  flujo: number;
  /** Discount factor (1 + WACC)^t. */
  factor: number;
  /** Present value of the flow: flujo / factor. */
  valorActual: number;
}

export interface OpcionesDCF {
  /** Projected free cash flows, one per explicit year (year 1..n), in euros. */
  flujos: number[];
  /** Weighted average cost of capital (discount rate) as a decimal. */
  wacc: number;
  /**
   * Perpetual growth rate (g) for the Gordon terminal value, as a decimal.
   * Ignored when valorResidualManual is provided.
   */
  crecimientoPerpetuo?: number;
  /**
   * Manual terminal value at the end of the horizon (year n), in euros.
   * Overrides the Gordon perpetuity when defined.
   */
  valorResidualManual?: number;
}

export interface ResultadoDCF {
  /** Whether the inputs produced a usable valuation. */
  valido: boolean;
  /** Human-readable note (e.g. why the terminal value could not be computed). */
  aviso: string | null;
  /** Per-year present-value breakdown of the explicit flows. */
  desglose: DesgloseAnio[];
  /** Sum of the present values of the explicit flows. */
  valorActualFlujos: number;
  /** Terminal value at the end of the horizon (year n), undiscounted. */
  valorResidual: number;
  /** Present value (at t=0) of the terminal value. */
  valorActualResidual: number;
  /** Enterprise value: valorActualFlujos + valorActualResidual. */
  valorEmpresa: number;
}

/** Present value of a single flow received at year `t` discounted at `wacc`. */
export function valorActual(flujo: number, wacc: number, t: number): number {
  return flujo / Math.pow(1 + wacc, t);
}

/**
 * Gordon perpetuity terminal value at the end of the explicit horizon:
 * VR = flujoFinal · (1 + g) / (WACC − g).
 *
 * Returns null when WACC <= g (the perpetuity does not converge), so callers
 * never propagate Infinity / NaN into the valuation.
 */
export function valorResidualGordon(
  flujoFinal: number,
  wacc: number,
  g: number
): number | null {
  if (!Number.isFinite(flujoFinal) || !Number.isFinite(wacc) || !Number.isFinite(g)) {
    return null;
  }
  if (wacc <= g) return null;
  return (flujoFinal * (1 + g)) / (wacc - g);
}

/**
 * Full DCF valuation: discounts the explicit flows, computes the terminal
 * value (manual or Gordon) and sums everything into an enterprise value.
 */
export function valorarDCF(opciones: OpcionesDCF): ResultadoDCF {
  const { flujos, wacc, crecimientoPerpetuo = 0, valorResidualManual } = opciones;

  const vacio: ResultadoDCF = {
    valido: false,
    aviso: 'Introduce al menos un flujo de caja proyectado.',
    desglose: [],
    valorActualFlujos: 0,
    valorResidual: 0,
    valorActualResidual: 0,
    valorEmpresa: 0,
  };

  if (!Array.isArray(flujos) || flujos.length === 0) {
    return vacio;
  }
  if (!Number.isFinite(wacc) || wacc <= -1) {
    return {
      ...vacio,
      aviso: 'La tasa de descuento (WACC) no es válida.',
    };
  }

  // Explicit horizon: present value of each projected flow.
  const desglose: DesgloseAnio[] = flujos.map((flujo, i) => {
    const t = i + 1;
    const factor = Math.pow(1 + wacc, t);
    return { anio: t, flujo, factor, valorActual: flujo / factor };
  });
  const valorActualFlujos = desglose.reduce((acc, d) => acc + d.valorActual, 0);

  // Terminal value at the end of the horizon (year n).
  const n = flujos.length;
  const flujoFinal = flujos[n - 1];
  let valorResidual = 0;
  let aviso: string | null = null;

  if (valorResidualManual !== undefined && Number.isFinite(valorResidualManual)) {
    valorResidual = valorResidualManual;
  } else {
    const vr = valorResidualGordon(flujoFinal, wacc, crecimientoPerpetuo);
    if (vr === null) {
      valorResidual = 0;
      aviso =
        'El crecimiento perpetuo (g) iguala o supera al WACC: la renta perpetua no converge. ' +
        'Se ignora el valor residual; reduce g o sube el WACC.';
    } else {
      valorResidual = vr;
    }
  }

  // Discount the terminal value back to t=0 with the year-n factor.
  const factorFinal = Math.pow(1 + wacc, n);
  const valorActualResidual = valorResidual / factorFinal;

  return {
    valido: true,
    aviso,
    desglose,
    valorActualFlujos,
    valorResidual,
    valorActualResidual,
    valorEmpresa: valorActualFlujos + valorActualResidual,
  };
}
