/**
 * Checking whether a sustainability claim can be checked.
 *
 * The module makes no judgement about whether a claim is TRUE — it cannot know
 * that, and says so. What it evaluates is whether the claim is *verifiable*:
 * whether it names a figure, a scope, a baseline and an independent
 * certification, and whether it is hiding the bulk of the impact behind a
 * detail. A claim can be perfectly honest and still score badly here, which is
 * itself worth discussing; and a well-formed claim can still be false.
 */

export type Senal =
  | 'sin-dato'
  | 'sin-alcance'
  | 'sin-referencia'
  | 'sin-certificacion'
  | 'parte-por-el-todo'
  | 'cumplir-la-ley'
  | 'termino-vago';

export interface Afirmacion {
  /** Does it give a number rather than an adjective? */
  tieneDato: boolean;
  /** Does it say what share of the product or activity it covers? */
  defineAlcance: boolean;
  /** Does it say "compared with what": a baseline year, a previous model? */
  tieneReferencia: boolean;
  /** Verified by an independent third party, not self-declared. */
  certificacionIndependiente: boolean;
  /** The claim covers a detail while the main impact stays untouched. */
  parteRelevante: boolean;
  /** The "achievement" is something the law already requires. */
  masAllaDeLaLey: boolean;
  /** Uses undefined terms: "eco", "natural", "verde", "responsable". */
  terminosVagos: boolean;
}

export interface Resultado {
  valido: boolean;
  senales: Senal[];
  /** 0–7: how many of the checks the claim passes. */
  puntuacion: number;
  total: number;
  /**
   * 'verificable' when nothing is missing, 'incompleta' with one or two gaps,
   * 'no-verificable' beyond that. Never 'falsa': the module cannot know.
   */
  lectura: 'verificable' | 'incompleta' | 'no-verificable';
}

/** The order is the order the flags are worth raising in class. */
const CHEQUEOS: { senal: Senal; pasa: (a: Afirmacion) => boolean }[] = [
  { senal: 'sin-dato', pasa: (a) => a.tieneDato },
  { senal: 'sin-alcance', pasa: (a) => a.defineAlcance },
  { senal: 'sin-referencia', pasa: (a) => a.tieneReferencia },
  { senal: 'sin-certificacion', pasa: (a) => a.certificacionIndependiente },
  { senal: 'parte-por-el-todo', pasa: (a) => a.parteRelevante },
  { senal: 'cumplir-la-ley', pasa: (a) => a.masAllaDeLaLey },
  { senal: 'termino-vago', pasa: (a) => !a.terminosVagos },
];

export const TOTAL_CHEQUEOS = CHEQUEOS.length;

export function analizar(a: Afirmacion): Resultado {
  if (!a || typeof a !== 'object') {
    return { valido: false, senales: [], puntuacion: 0, total: TOTAL_CHEQUEOS, lectura: 'no-verificable' };
  }
  const senales = CHEQUEOS.filter((c) => !c.pasa(a)).map((c) => c.senal);
  const puntuacion = TOTAL_CHEQUEOS - senales.length;
  return {
    valido: true,
    senales,
    puntuacion,
    total: TOTAL_CHEQUEOS,
    lectura:
      senales.length === 0 ? 'verificable'
      : senales.length <= 2 ? 'incompleta'
      : 'no-verificable',
  };
}
