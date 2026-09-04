/**
 * The validation funnel of a school project: how many people reach each step
 * and how many survive it.
 *
 * The reason to compute the step-by-step conversion instead of only the
 * overall one is that a project with 1.200 followers and twelve sales knows
 * its final number already; what it does not know is which step is losing the
 * people, and that is the only step worth working on next.
 */
export interface Paso {
  nombre: string;
  personas: number;
}

export interface PasoValorado extends Paso {
  /** Share of the previous step that made it here. NaN for the first step. */
  conversion: number;
  /** Share of the very first step that made it here. */
  conversionTotal: number;
  /** People lost between the previous step and this one. */
  perdidas: number;
  /** True for the step with the worst conversion. */
  esCuelloBotella: boolean;
}

export interface Resultado {
  valido: boolean;
  pasos: PasoValorado[];
  /** People who reached the last step. */
  conversiones: number;
  /** Overall conversion from first step to last. */
  conversionGlobal: number;
  /** Spend divided by the people who reached the last step. */
  costePorConversion: number;
  ingresos: number;
  margen: number;
  /** Index of the weakest step, or −1 when there is none to compare. */
  indiceCuelloBotella: number;
}

export function analizar(pasos: Paso[], gasto: number, ingresoPorConversion: number): Resultado {
  const vacio: Resultado = {
    valido: false, pasos: [], conversiones: NaN, conversionGlobal: NaN,
    costePorConversion: NaN, ingresos: NaN, margen: NaN, indiceCuelloBotella: -1,
  };
  if (!Array.isArray(pasos) || pasos.length < 2) return vacio;
  if (!pasos.every((p) => Number.isFinite(p.personas) && p.personas >= 0)) return vacio;
  if (pasos[0].personas <= 0) return vacio;
  // A funnel that widens is a counting mistake, not a funnel.
  if (pasos.some((p, i) => i > 0 && p.personas > pasos[i - 1].personas)) return vacio;
  if (!Number.isFinite(gasto) || gasto < 0) return vacio;
  if (!Number.isFinite(ingresoPorConversion) || ingresoPorConversion < 0) return vacio;

  const inicio = pasos[0].personas;
  const conversiones = pasos[pasos.length - 1].personas;

  const conConversion = pasos.map((p, i) => ({
    ...p,
    conversion: i === 0 ? NaN : pasos[i - 1].personas === 0 ? NaN : p.personas / pasos[i - 1].personas,
    conversionTotal: p.personas / inicio,
    perdidas: i === 0 ? 0 : pasos[i - 1].personas - p.personas,
  }));

  const comparables = conConversion.filter((p) => Number.isFinite(p.conversion));
  const peor = comparables.length > 0
    ? Math.min(...comparables.map((p) => p.conversion))
    : NaN;
  const indiceCuelloBotella = Number.isFinite(peor)
    ? conConversion.findIndex((p) => p.conversion === peor)
    : -1;

  const ingresos = conversiones * ingresoPorConversion;
  return {
    valido: true,
    pasos: conConversion.map((p, i) => ({ ...p, esCuelloBotella: i === indiceCuelloBotella })),
    conversiones,
    conversionGlobal: conversiones / inicio,
    costePorConversion: conversiones > 0 ? gasto / conversiones : Infinity,
    ingresos,
    margen: ingresos - gasto,
    indiceCuelloBotella,
  };
}
