/**
 * Customer acquisition cost against customer lifetime value.
 *
 * Everything here is arithmetic on figures a business plan already has, and
 * the only modelling decision is how long a customer lasts: with an annual
 * retention rate `r`, the expected life is 1 / (1 − r) years. That closed form
 * is the sum of the geometric series 1 + r + r² + …, so a 75 % retention means
 * four years on average.
 */
export interface Entradas {
  /** Marketing and sales spend over the period. */
  gastoMarketing: number;
  /** New customers won with that spend. */
  nuevosClientes: number;
  /** Average purchase, in euros. */
  ticketMedio: number;
  /** Purchases per customer and year. */
  comprasAnio: number;
  /** Gross margin as a fraction of revenue (0,4 = 40 %). */
  margenBruto: number;
  /** Share of customers still buying a year later (0 ≤ r < 1). */
  retencion: number;
}

export type Veredicto = 'perdida' | 'ajustado' | 'sano';

export interface Resultado {
  valido: boolean;
  /** Cost of acquiring one customer. */
  cac: number;
  ingresoAnualCliente: number;
  margenAnualCliente: number;
  /** Expected years a customer keeps buying. */
  vidaMedia: number;
  /** Total margin one customer leaves over their whole life. */
  ltv: number;
  ratio: number;
  /** Months of margin needed to pay back the acquisition cost. */
  paybackMeses: number;
  veredicto: Veredicto;
}

const positivo = (x: number) => Number.isFinite(x) && x > 0;

export function analizar(e: Entradas): Resultado {
  const vacio: Resultado = {
    valido: false, cac: NaN, ingresoAnualCliente: NaN, margenAnualCliente: NaN,
    vidaMedia: NaN, ltv: NaN, ratio: NaN, paybackMeses: NaN, veredicto: 'perdida',
  };
  if (!positivo(e.gastoMarketing) || !positivo(e.nuevosClientes)) return vacio;
  if (!positivo(e.ticketMedio) || !positivo(e.comprasAnio)) return vacio;
  if (!Number.isFinite(e.margenBruto) || e.margenBruto <= 0 || e.margenBruto > 1) return vacio;
  // Retention of exactly 1 would mean a customer who never leaves, and an
  // infinite lifetime value. It is not a case worth drawing.
  if (!Number.isFinite(e.retencion) || e.retencion < 0 || e.retencion >= 1) return vacio;

  const cac = e.gastoMarketing / e.nuevosClientes;
  const ingresoAnualCliente = e.ticketMedio * e.comprasAnio;
  const margenAnualCliente = ingresoAnualCliente * e.margenBruto;
  const vidaMedia = 1 / (1 - e.retencion);
  const ltv = margenAnualCliente * vidaMedia;
  const ratio = ltv / cac;

  return {
    valido: true,
    cac,
    ingresoAnualCliente,
    margenAnualCliente,
    vidaMedia,
    ltv,
    ratio,
    paybackMeses: cac / (margenAnualCliente / 12),
    // The 3× rule of thumb is a convention, not a law: below 1 the business
    // loses money on every customer it wins, and between 1 and 3 it survives
    // only if nothing else goes wrong.
    veredicto: ratio < 1 ? 'perdida' : ratio < 3 ? 'ajustado' : 'sano',
  };
}

/** Retention implied by an average customer life, for working it backwards. */
export function retencionPara(vidaMedia: number): number {
  if (!Number.isFinite(vidaMedia) || vidaMedia < 1) return NaN;
  return 1 - 1 / vidaMedia;
}
