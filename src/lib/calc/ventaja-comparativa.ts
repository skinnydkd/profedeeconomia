/**
 * Ricardian comparative advantage with two countries and two goods.
 *
 * Inputs are the maximum output of each good in each country when all its
 * resources go to that good, so each frontier is the straight line between
 * the two extremes and the opportunity cost of a good is constant.
 *
 * The module answers the four questions an exercise asks — opportunity costs,
 * who holds the absolute advantage, who holds the comparative one, and the
 * band the terms of trade must fall inside — and then checks a concrete swap
 * to show both sides ending up beyond their own frontier.
 */
export interface Produccion {
  /** Maximum units of good 1 if all resources go to good 1. */
  bien1: number;
  /** Maximum units of good 2 if all resources go to good 2. */
  bien2: number;
}

export interface Paises { a: Produccion; b: Produccion; }

export type Pais = 'a' | 'b';

export interface Costes {
  /** Units of good 2 given up for one unit of good 1. */
  a1: number;
  b1: number;
  /** Units of good 1 given up for one unit of good 2 (the reciprocal). */
  a2: number;
  b2: number;
}

export interface Analisis {
  valido: boolean;
  costes: Costes;
  /** Who produces more of each good outright; null when they tie. */
  absoluta: { bien1: Pais | null; bien2: Pais | null };
  /** Who gives up less to make each good; null when the relative costs match. */
  comparativa: { bien1: Pais | null; bien2: Pais | null };
  /**
   * Terms of trade for one unit of good 1, expressed in good 2. Trade is worth
   * it to both only strictly inside this band.
   */
  rango: { min: number; max: number } | null;
  /** Total world output once each country specialises completely. */
  especializacion: { bien1: number; bien2: number } | null;
}

const finitoPositivo = (x: number) => Number.isFinite(x) && x > 0;

export function analizar({ a, b }: Paises): Analisis {
  const vacio: Analisis = {
    valido: false,
    costes: { a1: NaN, b1: NaN, a2: NaN, b2: NaN },
    absoluta: { bien1: null, bien2: null },
    comparativa: { bien1: null, bien2: null },
    rango: null,
    especializacion: null,
  };
  if (![a.bien1, a.bien2, b.bien1, b.bien2].every(finitoPositivo)) return vacio;

  const costes: Costes = {
    a1: a.bien2 / a.bien1,
    b1: b.bien2 / b.bien1,
    a2: a.bien1 / a.bien2,
    b2: b.bien1 / b.bien2,
  };

  const mayor = (x: number, y: number): Pais | null => (x === y ? null : x > y ? 'a' : 'b');
  const menor = (x: number, y: number): Pais | null => (x === y ? null : x < y ? 'a' : 'b');

  const compBien1 = menor(costes.a1, costes.b1);
  const min = Math.min(costes.a1, costes.b1);
  const max = Math.max(costes.a1, costes.b1);

  return {
    valido: true,
    costes,
    absoluta: { bien1: mayor(a.bien1, b.bien1), bien2: mayor(a.bien2, b.bien2) },
    // Relative costs are reciprocals, so whoever is cheaper in good 1 is
    // necessarily dearer in good 2. There is no case where one country holds
    // both comparative advantages.
    comparativa: { bien1: compBien1, bien2: compBien1 === null ? null : compBien1 === 'a' ? 'b' : 'a' },
    rango: compBien1 === null ? null : { min, max },
    especializacion: compBien1 === null
      ? null
      : compBien1 === 'a'
        ? { bien1: a.bien1, bien2: b.bien2 }
        : { bien1: b.bien1, bien2: a.bien2 },
  };
}

export interface Intercambio {
  valido: boolean;
  /** Units of good 2 per unit of good 1 in this swap. */
  relacion: number;
  dentroDelRango: boolean;
  /** Country exporting good 1 (the one holding its comparative advantage). */
  exportadorBien1: Pais | null;
  /** Each country's gain, measured in units of good 2. */
  gananciaA: number;
  gananciaB: number;
  /** What each country ends up consuming after the swap. */
  consumoA: { bien1: number; bien2: number };
  consumoB: { bien1: number; bien2: number };
}

/**
 * Checks a specific swap: `q1` units of good 1 against `q2` units of good 2,
 * with each country specialised in the good of its comparative advantage.
 *
 * The gain is measured against the honest benchmark — not against the
 * country's maximum, but against the good 2 it could have made on its own
 * while still producing the good 1 it keeps.
 */
export function intercambio(paises: Paises, q1: number, q2: number): Intercambio {
  const vacio: Intercambio = {
    valido: false, relacion: NaN, dentroDelRango: false, exportadorBien1: null,
    gananciaA: NaN, gananciaB: NaN,
    consumoA: { bien1: NaN, bien2: NaN }, consumoB: { bien1: NaN, bien2: NaN },
  };
  const an = analizar(paises);
  if (!an.valido || !an.rango || !an.comparativa.bien1) return vacio;
  if (!finitoPositivo(q1) || !finitoPositivo(q2)) return vacio;

  const exp1 = an.comparativa.bien1;
  const exp2: Pais = exp1 === 'a' ? 'b' : 'a';
  const prod = { a: paises.a, b: paises.b };
  // The exporter of good 1 cannot ship more than it makes, and likewise for good 2.
  if (q1 > prod[exp1].bien1 || q2 > prod[exp2].bien2) return vacio;

  const relacion = q2 / q1;
  const coste1Exportador = exp1 === 'a' ? an.costes.a1 : an.costes.b1;
  const coste1Importador = exp1 === 'a' ? an.costes.b1 : an.costes.a1;

  // Exporter of good 1: keeps what it did not ship, receives q2 of good 2.
  // On its own it could have had q1 · coste1 of good 2 instead.
  const gananciaExp1 = q2 - q1 * coste1Exportador;
  // Exporter of good 2: receives q1 of good 1, which on its own would have
  // cost it q1 · coste1 of good 2; it gave up q2 instead.
  const gananciaExp2 = q1 * coste1Importador - q2;

  const consumo = {
    [exp1]: { bien1: prod[exp1].bien1 - q1, bien2: q2 },
    [exp2]: { bien1: q1, bien2: prod[exp2].bien2 - q2 },
  } as Record<Pais, { bien1: number; bien2: number }>;

  return {
    valido: true,
    relacion,
    dentroDelRango: relacion > an.rango.min && relacion < an.rango.max,
    exportadorBien1: exp1,
    gananciaA: exp1 === 'a' ? gananciaExp1 : gananciaExp2,
    gananciaB: exp1 === 'a' ? gananciaExp2 : gananciaExp1,
    consumoA: consumo.a,
    consumoB: consumo.b,
  };
}
