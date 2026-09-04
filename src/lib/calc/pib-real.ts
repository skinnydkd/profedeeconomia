/**
 * Nominal GDP, real GDP and the implicit deflator. The whole point of the
 * module is the identity deflator = nominal / real × 100: everything else is
 * derived from it, so a student can enter any two of the three and get the
 * third. Growth rates are computed on the real series, which is the only one
 * that says anything about production.
 */

export interface Anyo {
  /** Label for the period; the module never parses it. */
  etiqueta: string;
  /** Nominal GDP in current euros (millions, or whatever unit is consistent). */
  nominal: number;
  /** GDP deflator, base 100. */
  deflactor: number;
  /** Population, for GDP per capita. Optional. */
  poblacion?: number;
}

export interface AnyoValorado extends Anyo {
  /** nominal / deflactor × 100 — GDP at constant (base-year) prices. */
  real: number;
  /** Real GDP per head, or NaN when population is missing. */
  perCapita: number;
  /** Growth of nominal GDP over the previous period, or NaN for the first. */
  crecimientoNominal: number;
  /** Growth of real GDP over the previous period, or NaN for the first. */
  crecimientoReal: number;
  /** Change in the deflator: the inflation implicit in the series. */
  inflacion: number;
  /**
   * True when nominal GDP grew but real GDP did not. The headline goes up and
   * production does not: the single most useful thing this table shows.
   */
  espejismo: boolean;
}

export interface Resultado {
  valido: boolean;
  anyos: AnyoValorado[];
}

const crecimiento = (actual: number, previo: number) =>
  Number.isFinite(previo) && previo !== 0 ? actual / previo - 1 : NaN;

/** Real GDP from nominal GDP and the deflator. Exposed for the reverse exercise. */
export function pibReal(nominal: number, deflactor: number): number {
  if (!Number.isFinite(nominal) || !Number.isFinite(deflactor) || deflactor <= 0) return NaN;
  return (nominal / deflactor) * 100;
}

/** The deflator implied by a nominal and a real figure. */
export function deflactorImplicito(nominal: number, real: number): number {
  if (!Number.isFinite(nominal) || !Number.isFinite(real) || real === 0) return NaN;
  return (nominal / real) * 100;
}

export function valorar(anyos: Anyo[]): Resultado {
  if (!Array.isArray(anyos) || anyos.length === 0) return { valido: false, anyos: [] };
  const ok = anyos.every(
    (a) => Number.isFinite(a.nominal) && a.nominal >= 0 && Number.isFinite(a.deflactor) && a.deflactor > 0,
  );
  if (!ok) return { valido: false, anyos: [] };

  const valorados = anyos.map((a, i) => {
    const real = pibReal(a.nominal, a.deflactor);
    const prev = i > 0 ? anyos[i - 1] : undefined;
    const realPrev = prev ? pibReal(prev.nominal, prev.deflactor) : NaN;
    const crecimientoReal = crecimiento(real, realPrev);
    const crecimientoNominal = prev ? crecimiento(a.nominal, prev.nominal) : NaN;
    return {
      ...a,
      real,
      perCapita:
        Number.isFinite(a.poblacion) && (a.poblacion as number) > 0 ? real / (a.poblacion as number) : NaN,
      crecimientoNominal,
      crecimientoReal,
      inflacion: prev ? crecimiento(a.deflactor, prev.deflactor) : NaN,
      espejismo: crecimientoNominal > 0 && crecimientoReal <= 0,
    };
  });

  return { valido: true, anyos: valorados };
}
