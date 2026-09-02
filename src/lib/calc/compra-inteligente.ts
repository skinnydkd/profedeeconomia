/**
 * Two comparisons a consumer needs and a shop never makes for them.
 *
 * 1. Price per unit, so that packs of different sizes can be compared.
 * 2. What paying in instalments really costs, expressed as an annual rate
 *    rather than as «only 15 € a month».
 *
 * The instalment rate is a proper internal rate of return: the monthly rate
 * that makes the present value of the payments equal to the amount financed.
 * There is no closed form, so it is solved by bisection, which converges
 * safely for any positive payment stream.
 */
export interface Opcion {
  nombre: string;
  precio: number;
  /** Content of the pack, in whatever unit the comparison uses. */
  cantidad: number;
}

export interface OpcionValorada extends Opcion {
  precioUnitario: number;
  /** How much dearer than the cheapest option, as a fraction. NaN if invalid. */
  sobrecoste: number;
  esMasBarata: boolean;
}

/**
 * Whether a row can be compared at all. Exported because the island has to
 * line its own rows up with the results, and duplicating the rule there is how
 * the two drift apart.
 */
export function opcionValida(o: Opcion): boolean {
  return Number.isFinite(o.precio) && o.precio > 0 && Number.isFinite(o.cantidad) && o.cantidad > 0;
}

/** Prices per unit, with the cheapest option flagged. Invalid rows are dropped. */
export function compararOpciones(opciones: Opcion[]): OpcionValorada[] {
  const validas = opciones.filter(opcionValida);
  if (validas.length === 0) return [];
  const conUnitario = validas.map((o) => ({ ...o, precioUnitario: o.precio / o.cantidad }));
  const minimo = Math.min(...conUnitario.map((o) => o.precioUnitario));
  return conUnitario.map((o) => ({
    ...o,
    sobrecoste: o.precioUnitario / minimo - 1,
    esMasBarata: o.precioUnitario === minimo,
  }));
}

export interface Aplazamiento {
  valido: boolean;
  /** Everything paid, entry payment included. */
  totalPagado: number;
  /** What the credit costs on top of the cash price. */
  coste: number;
  /** Cost as a share of the cash price. */
  costeSobrePrecio: number;
  /** Monthly internal rate of return, as a fraction. */
  tasaMensual: number;
  /** Annual equivalent rate, compounding the monthly one. */
  tae: number;
  /** True when nothing is charged: the instalments add up to the cash price. */
  sinIntereses: boolean;
}

/**
 * Cost of paying `precio` with an optional entry payment and `cuotas` monthly
 * instalments of `cuota`.
 */
export function costeAplazamiento(precio: number, entrada: number, cuotas: number, cuota: number): Aplazamiento {
  const vacio: Aplazamiento = {
    valido: false, totalPagado: NaN, coste: NaN, costeSobrePrecio: NaN,
    tasaMensual: NaN, tae: NaN, sinIntereses: false,
  };
  if (!Number.isFinite(precio) || precio <= 0) return vacio;
  if (!Number.isFinite(entrada) || entrada < 0 || entrada >= precio) return vacio;
  if (!Number.isInteger(cuotas) || cuotas < 1 || cuotas > 120) return vacio;
  if (!Number.isFinite(cuota) || cuota <= 0) return vacio;

  const financiado = precio - entrada;
  const totalPagado = entrada + cuota * cuotas;
  const coste = totalPagado - precio;
  // Instalments that do not even cover what was financed are not a credit.
  if (cuota * cuotas < financiado) return vacio;

  const valorActual = (i: number) => {
    if (i === 0) return cuota * cuotas;
    let vp = 0;
    for (let k = 1; k <= cuotas; k++) vp += cuota / Math.pow(1 + i, k);
    return vp;
  };

  let tasaMensual = 0;
  if (coste > 1e-9) {
    // The present value falls as the rate rises, so bisect between 0 and a
    // rate high enough to overshoot any consumer credit.
    let lo = 0;
    let hi = 1;
    for (let n = 0; n < 200; n++) {
      const mid = (lo + hi) / 2;
      if (valorActual(mid) > financiado) lo = mid; else hi = mid;
    }
    tasaMensual = (lo + hi) / 2;
  }

  return {
    valido: true,
    totalPagado,
    coste,
    costeSobrePrecio: coste / precio,
    tasaMensual,
    tae: Math.pow(1 + tasaMensual, 12) - 1,
    sinIntereses: coste <= 1e-9,
  };
}
