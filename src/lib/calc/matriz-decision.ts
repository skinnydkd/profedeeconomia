/**
 * Pure weighted-decision model behind the decision matrix (FOPP 4ESO · Unidad 4,
 * «El proceso de cinco fases» → comparar opciones con criterios explícitos).
 *
 * No Preact, no DOM: only the arithmetic, so the ranking rules can be
 * unit-tested independently of the UI.
 *
 * The unit teaches comparing options «con la misma vara»: name the criteria
 * that matter, say how much each one weighs, and score every option on every
 * criterion. The total is the weighted average
 *
 *   puntuación(opción) = Σ (peso_normalizado(criterio) × nota(opción, criterio))
 *
 * Weights are normalised so they always sum to 1, which means a student can
 * type any numbers (3, 5, 1) without having to make them add up to 10 or 100,
 * and the total stays on the same 1–5 scale as the individual scores.
 *
 * The tool is a thinking aid, not an oracle: it also reports how close the top
 * two options are, because a near-tie means the matrix has not decided anything
 * and the choice is genuinely open.
 */

/** One thing that matters in the decision, with how much it matters. */
export interface Criterio {
  id: string;
  nombre: string;
  /** Any non-negative number; normalised against the other criteria. */
  peso: number;
}

/** One alternative, scored on every criterion by its id. */
export interface Opcion {
  id: string;
  nombre: string;
  /** criterio.id → score on the scale below. Missing ids count as the minimum. */
  notas: Record<string, number>;
}

/** Scores run 1–5, the same scale the unit's paper table uses. */
export const NOTA_MIN = 1;
export const NOTA_MAX = 5;

/** How much one criterion contributed to an option's total. */
export interface Aportacion {
  criterioId: string;
  nota: number;
  pesoNormalizado: number;
  /** nota × pesoNormalizado. */
  aporta: number;
}

export interface Puntuacion {
  opcionId: string;
  nombre: string;
  /** Weighted average on the 1–5 scale, or null when no criterion has weight. */
  total: number | null;
  aportaciones: Aportacion[];
}

export interface ResultadoMatriz {
  /** Every option, highest score first; ties keep the input order. */
  ranking: Puntuacion[];
  /** Sum of the raw weights, before normalising. */
  pesoTotal: number;
  /**
   * Gap between the first and second option, on the 1–5 scale. Null when there
   * are fewer than two options or no criterion carries weight.
   */
  margen: number | null;
  /**
   * True when the top two are within `UMBRAL_EMPATE`. The matrix has not
   * decided: the UI says so rather than pretending the winner is clear.
   */
  esEmpateTecnico: boolean;
}

/** Below this gap on the 1–5 scale, the top two count as a tie. */
export const UMBRAL_EMPATE = 0.25;

/** Clamp a score into the 1–5 scale; anything unusable becomes the minimum. */
export function normalizarNota(n: number | undefined): number {
  if (typeof n !== 'number' || !Number.isFinite(n)) return NOTA_MIN;
  return Math.min(NOTA_MAX, Math.max(NOTA_MIN, n));
}

/** Weights as fractions of the total; all zeros (or negatives) give all zeros. */
export function pesosNormalizados(criterios: Criterio[]): number[] {
  const pesos = criterios.map((c) => (Number.isFinite(c.peso) ? Math.max(0, c.peso) : 0));
  const suma = pesos.reduce((a, b) => a + b, 0);
  if (suma <= 0) return pesos.map(() => 0);
  return pesos.map((p) => p / suma);
}

/** Score every option and rank them, best first. */
export function resolverMatriz(criterios: Criterio[], opciones: Opcion[]): ResultadoMatriz {
  const normalizados = pesosNormalizados(criterios);
  const pesoTotal = criterios.reduce(
    (a, c) => a + (Number.isFinite(c.peso) ? Math.max(0, c.peso) : 0),
    0,
  );
  const hayPeso = pesoTotal > 0 && criterios.length > 0;

  const puntuaciones: Puntuacion[] = opciones.map((o) => {
    const aportaciones = criterios.map((cr, i) => {
      const nota = normalizarNota(o.notas[cr.id]);
      return {
        criterioId: cr.id,
        nota,
        pesoNormalizado: normalizados[i],
        aporta: nota * normalizados[i],
      };
    });
    return {
      opcionId: o.id,
      nombre: o.nombre,
      total: hayPeso ? aportaciones.reduce((a, x) => a + x.aporta, 0) : null,
      aportaciones,
    };
  });

  // Stable sort: equal totals keep the order the student typed them in.
  const ranking = puntuaciones
    .map((p, i) => ({ p, i }))
    .sort((a, b) => (b.p.total ?? -Infinity) - (a.p.total ?? -Infinity) || a.i - b.i)
    .map((x) => x.p);

  const margen =
    ranking.length >= 2 && ranking[0].total !== null && ranking[1].total !== null
      ? ranking[0].total - ranking[1].total
      : null;

  return {
    ranking,
    pesoTotal,
    margen,
    esEmpateTecnico: margen !== null && margen < UMBRAL_EMPATE,
  };
}

/**
 * The criterion that separates the top two options the most, i.e. the one
 * actually driving the result. Null when there is no second option or no
 * criterion carries weight. Lets the UI answer "why did this one win?".
 */
export function criterioDecisivo(resultado: ResultadoMatriz): string | null {
  const [primero, segundo] = resultado.ranking;
  if (!primero || !segundo || primero.total === null) return null;

  let mejorId: string | null = null;
  let mejorDiff = -Infinity;
  primero.aportaciones.forEach((a, i) => {
    const diff = a.aporta - (segundo.aportaciones[i]?.aporta ?? 0);
    if (diff > mejorDiff) {
      mejorDiff = diff;
      mejorId = a.criterioId;
    }
  });
  return mejorDiff > 0 ? mejorId : null;
}
