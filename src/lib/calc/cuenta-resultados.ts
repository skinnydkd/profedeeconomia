/**
 * The income statement built in steps, the way the Plan General Contable
 * presents it: from turnover down to the profit for the year, stopping at each
 * level that means something on its own.
 *
 * Levels: margen bruto → EBITDA → BAII (result of operations) → BAI → profit.
 * Every level also comes as a percentage of turnover, which is what makes two
 * companies of different sizes comparable.
 *
 * Teaching simplification: no tax is charged on a loss. A real company can
 * carry losses forward and offset them against future profits, so the tax line
 * of a loss-making year is not always zero.
 */
export interface Entradas {
  /** Importe neto de la cifra de negocios. */
  ventas: number;
  /** Aprovisionamientos: what the goods sold cost to buy or make. */
  aprovisionamientos: number;
  gastosPersonal: number;
  otrosGastosExplotacion: number;
  amortizacion: number;
  ingresosFinancieros: number;
  gastosFinancieros: number;
  /** Corporate tax rate as a fraction (0,25 = 25 %). */
  tipoImpositivo: number;
}

export interface Nivel {
  clave: 'margenBruto' | 'ebitda' | 'baii' | 'bai' | 'resultado';
  importe: number;
  /** Share of turnover, as a fraction. NaN when there is no turnover. */
  sobreVentas: number;
}

export interface Resultado {
  valido: boolean;
  margenBruto: number;
  ebitda: number;
  baii: number;
  resultadoFinanciero: number;
  bai: number;
  impuesto: number;
  resultado: number;
  /** The five levels in reading order, for the waterfall. */
  niveles: Nivel[];
  /** True when the company loses money before tax. */
  perdidas: boolean;
}

export function calcular(e: Entradas): Resultado {
  const campos = [
    e.ventas, e.aprovisionamientos, e.gastosPersonal, e.otrosGastosExplotacion,
    e.amortizacion, e.ingresosFinancieros, e.gastosFinancieros, e.tipoImpositivo,
  ];
  const vacio: Resultado = {
    valido: false, margenBruto: NaN, ebitda: NaN, baii: NaN, resultadoFinanciero: NaN,
    bai: NaN, impuesto: NaN, resultado: NaN, niveles: [], perdidas: false,
  };
  if (!campos.every((x) => Number.isFinite(x))) return vacio;
  if (e.ventas <= 0) return vacio;
  if (e.tipoImpositivo < 0 || e.tipoImpositivo > 1) return vacio;
  if ([e.aprovisionamientos, e.gastosPersonal, e.otrosGastosExplotacion, e.amortizacion,
       e.ingresosFinancieros, e.gastosFinancieros].some((x) => x < 0)) return vacio;

  const margenBruto = e.ventas - e.aprovisionamientos;
  const ebitda = margenBruto - e.gastosPersonal - e.otrosGastosExplotacion;
  const baii = ebitda - e.amortizacion;
  const resultadoFinanciero = e.ingresosFinancieros - e.gastosFinancieros;
  const bai = baii + resultadoFinanciero;
  const impuesto = bai > 0 ? bai * e.tipoImpositivo : 0;
  const resultado = bai - impuesto;

  const pct = (x: number) => x / e.ventas;
  return {
    valido: true,
    margenBruto, ebitda, baii, resultadoFinanciero, bai, impuesto, resultado,
    niveles: [
      { clave: 'margenBruto', importe: margenBruto, sobreVentas: pct(margenBruto) },
      { clave: 'ebitda', importe: ebitda, sobreVentas: pct(ebitda) },
      { clave: 'baii', importe: baii, sobreVentas: pct(baii) },
      { clave: 'bai', importe: bai, sobreVentas: pct(bai) },
      { clave: 'resultado', importe: resultado, sobreVentas: pct(resultado) },
    ],
    perdidas: bai <= 0,
  };
}
