/**
 * Pure labour-market model behind the EPA rates calculator (FOPP 4ESO · Unidad 7,
 * «Cómo se mide el mercado laboral: la EPA y sus tres tasas»).
 *
 * No Preact, no DOM: only the arithmetic, so the definitions can be unit-tested
 * independently of the UI.
 *
 * The survey splits everyone aged 16 or over into three groups:
 *
 *   población de 16+ = ocupados + parados + inactivos
 *   población activa = ocupados + parados
 *
 * and derives three percentages from them:
 *
 *   tasa de actividad = activos   / población 16+ × 100
 *   tasa de empleo    = ocupados  / población 16+ × 100
 *   tasa de paro      = parados   / población activa × 100
 *
 * The denominators are the whole point of the exercise: the unemployment rate
 * runs over the *active* population, not over everyone of working age. Dividing
 * by the wrong one is the mistake the unit warns about, so `denominador` is
 * part of every result and the UI can show it.
 */

/** Head counts as reported by the survey, all in persons. */
export interface PoblacionEPA {
  /** Everyone aged 16 or over: the working-age population. */
  poblacion16: number;
  /** People who hold a job, employees and self-employed alike. */
  ocupados: number;
  /** People without a job who are available and actively looking for one. */
  parados: number;
}

/** One rate, with the two numbers it came from so the UI can show the division. */
export interface Tasa {
  /** Percentage in [0, 100], or null when the denominator is zero. */
  valor: number | null;
  numerador: number;
  denominador: number;
}

export interface ResultadoEPA {
  /** ocupados + parados. */
  activos: number;
  /** población16 − activos. Negative inputs are reported by `coherente`. */
  inactivos: number;
  actividad: Tasa;
  empleo: Tasa;
  paro: Tasa;
  /**
   * False when the head counts cannot describe a real population: a negative
   * figure, or more active people than people of working age. The UI warns
   * instead of showing rates above 100 % or a negative inactive count.
   */
  coherente: boolean;
}

/** Percentage with its operands; null value when the denominator is zero. */
function tasa(numerador: number, denominador: number): Tasa {
  return {
    valor: denominador > 0 ? (numerador / denominador) * 100 : null,
    numerador,
    denominador,
  };
}

/** The three EPA rates plus the derived head counts, from raw survey figures. */
export function calcularTasas(p: PoblacionEPA): ResultadoEPA {
  const { poblacion16, ocupados, parados } = p;
  const activos = ocupados + parados;
  const inactivos = poblacion16 - activos;
  const coherente =
    poblacion16 >= 0 && ocupados >= 0 && parados >= 0 && inactivos >= 0;

  return {
    activos,
    inactivos,
    actividad: tasa(activos, poblacion16),
    empleo: tasa(ocupados, poblacion16),
    paro: tasa(parados, activos),
    coherente,
  };
}

/**
 * The rate a student gets by dividing the unemployed by the whole working-age
 * population instead of by the active population — the "trampa habitual" the
 * unit calls the single most common mistake in this exercise. Exposed so the
 * calculator can show, side by side, the wrong figure and the right one.
 */
export function tasaParoMalCalculada(p: PoblacionEPA): Tasa {
  return tasa(p.parados, p.poblacion16);
}
