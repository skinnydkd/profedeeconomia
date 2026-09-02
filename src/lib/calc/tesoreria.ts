/**
 * Twelve-month cash forecast for a business plan.
 *
 * The point of the model is the gap between profit and cash: a sale in month 3
 * collected in month 5 counts as profit in 3 and as money in 5, and a plan that
 * only looks at profit misses the months in between. The module therefore
 * reports both figures and the bridge between them.
 *
 * Sales made near the end of the horizon whose collection falls past month 12
 * are left outstanding rather than pulled forward: that tail is part of the
 * lesson, not an edge case to hide.
 */
export const MESES = 12;

export interface Supuestos {
  saldoInicial: number;
  /** Sales per month, twelve figures. */
  ventas: number[];
  /** Share of each sale collected in the same month (0 ≤ x ≤ 1). */
  cobroContado: number;
  /** Months later the rest is collected. */
  mesesCobro: number;
  /** Purchases as a share of the same month's sales. */
  comprasSobreVentas: number;
  /** Share of each purchase paid in the same month. */
  pagoContado: number;
  /** Months later the rest is paid. */
  mesesPago: number;
  /** Fixed costs charged and paid every month. */
  gastosFijos: number;
}

export interface Mes {
  /** 1-indexed month. */
  n: number;
  ventas: number;
  compras: number;
  cobros: number;
  pagos: number;
  flujo: number;
  saldo: number;
}

export interface Resultado {
  valido: boolean;
  meses: Mes[];
  saldoFinal: number;
  saldoMinimo: number;
  /** Month of the lowest balance, 1-indexed. */
  mesSaldoMinimo: number;
  /** How many months close with a negative balance. */
  mesesEnNegativo: number;
  /** Financing needed to never go below zero. */
  necesidadFinanciacion: number;
  /** Profit over the horizon: sales − purchases − fixed costs. */
  beneficioPeriodo: number;
  /** Sales still uncollected at month 12. */
  cobrosPendientes: number;
  /** Purchases still unpaid at month 12. */
  pagosPendientes: number;
}

const fraccion = (x: number) => Number.isFinite(x) && x >= 0 && x <= 1;

export function proyectar(s: Supuestos): Resultado {
  const vacio: Resultado = {
    valido: false, meses: [], saldoFinal: NaN, saldoMinimo: NaN, mesSaldoMinimo: 0,
    mesesEnNegativo: 0, necesidadFinanciacion: NaN, beneficioPeriodo: NaN,
    cobrosPendientes: NaN, pagosPendientes: NaN,
  };
  if (!Number.isFinite(s.saldoInicial)) return vacio;
  if (!Array.isArray(s.ventas) || s.ventas.length !== MESES) return vacio;
  if (!s.ventas.every((v) => Number.isFinite(v) && v >= 0)) return vacio;
  if (!fraccion(s.cobroContado) || !fraccion(s.pagoContado)) return vacio;
  if (!fraccion(s.comprasSobreVentas)) return vacio;
  if (!Number.isInteger(s.mesesCobro) || s.mesesCobro < 0 || s.mesesCobro > 6) return vacio;
  if (!Number.isInteger(s.mesesPago) || s.mesesPago < 0 || s.mesesPago > 6) return vacio;
  if (!Number.isFinite(s.gastosFijos) || s.gastosFijos < 0) return vacio;

  const compras = s.ventas.map((v) => v * s.comprasSobreVentas);
  const cobros = new Array<number>(MESES).fill(0);
  const pagos = new Array<number>(MESES).fill(s.gastosFijos);
  let cobrosPendientes = 0;
  let pagosPendientes = 0;

  for (let i = 0; i < MESES; i++) {
    cobros[i] += s.ventas[i] * s.cobroContado;
    const aplazadoCobro = s.ventas[i] * (1 - s.cobroContado);
    const destinoCobro = i + s.mesesCobro;
    if (destinoCobro < MESES) cobros[destinoCobro] += aplazadoCobro;
    else cobrosPendientes += aplazadoCobro;

    pagos[i] += compras[i] * s.pagoContado;
    const aplazadoPago = compras[i] * (1 - s.pagoContado);
    const destinoPago = i + s.mesesPago;
    if (destinoPago < MESES) pagos[destinoPago] += aplazadoPago;
    else pagosPendientes += aplazadoPago;
  }

  const meses: Mes[] = [];
  let saldo = s.saldoInicial;
  let saldoMinimo = Infinity;
  let mesSaldoMinimo = 1;
  let mesesEnNegativo = 0;

  for (let i = 0; i < MESES; i++) {
    const flujo = cobros[i] - pagos[i];
    saldo += flujo;
    if (saldo < saldoMinimo) { saldoMinimo = saldo; mesSaldoMinimo = i + 1; }
    if (saldo < 0) mesesEnNegativo++;
    meses.push({ n: i + 1, ventas: s.ventas[i], compras: compras[i], cobros: cobros[i], pagos: pagos[i], flujo, saldo });
  }

  const totalVentas = s.ventas.reduce((a, b) => a + b, 0);
  const totalCompras = compras.reduce((a, b) => a + b, 0);

  return {
    valido: true,
    meses,
    saldoFinal: saldo,
    saldoMinimo,
    mesSaldoMinimo,
    mesesEnNegativo,
    necesidadFinanciacion: Math.max(0, -saldoMinimo),
    beneficioPeriodo: totalVentas - totalCompras - s.gastosFijos * MESES,
    cobrosPendientes,
    pagosPendientes,
  };
}

/** Twelve months of sales growing at a monthly rate, for seeding the table. */
export function ventasConCrecimiento(inicial: number, crecimientoMensual: number): number[] {
  return Array.from({ length: MESES }, (_, i) => inicial * Math.pow(1 + crecimientoMensual, i));
}
