/**
 * Checking a goal against the five SMART letters and, when it is measurable
 * and dated, working out the pace it actually requires.
 *
 * The module checks *structure*, never ambition: it cannot know whether a goal
 * is worth pursuing, and it says nothing about that. What it can do is notice
 * that a goal has no number, or no date, or that the pace it implies is far
 * above the pace already achieved — which is the useful conversation.
 */

export type Letra = 'especifico' | 'medible' | 'alcanzable' | 'relevante' | 'temporal';

export interface Objetivo {
  /** What will be done. Vague verbs ("mejorar", "esforzarme") fail the S. */
  accion: string;
  /** What is counted. Without it the goal is not measurable. */
  indicador: string;
  /** Where the indicator stands today. */
  valorInicial: number;
  /** Where it should stand at the deadline. */
  valorObjetivo: number;
  /** Weeks available. */
  semanas: number;
  /** The pace already sustained, in indicator units per week. 0 when unknown. */
  ritmoActual: number;
  /** Why it matters to this person. Empty fails the R. */
  motivo: string;
}

export interface Chequeo {
  letra: Letra;
  cumple: boolean;
  /** Machine-readable reason a letter failed, for the UI to localize. */
  motivo: 'ok' | 'vacio' | 'verbo-vago' | 'sin-avance' | 'sin-plazo' | 'ritmo-imposible';
}

export interface Resultado {
  valido: boolean;
  chequeos: Chequeo[];
  /** How many of the five letters pass. */
  puntuacion: number;
  /** Indicator units per week required to hit the target. NaN without a deadline. */
  ritmoNecesario: number;
  /** ritmoNecesario / ritmoActual, or NaN when the current pace is unknown. */
  exigencia: number;
  /** Total change asked for. */
  avance: number;
}

/**
 * Verbs that describe an intention rather than an action. A goal built on one
 * of these cannot be checked off, which is what the S is for.
 */
const VERBOS_VAGOS = [
  'mejorar', 'esforzarme', 'esforzarse', 'intentar', 'procurar', 'ser mejor',
  'estudiar mas', 'estudiar más', 'ponerme las pilas', 'centrarme',
  'millorar', 'esforcar-me', 'esforçar-me', 'intentar-ho', 'provar',
];

const vacio = (s: string) => !s || s.trim().length < 3;

export function evaluar(o: Objetivo): Resultado {
  const nums = [o.valorInicial, o.valorObjetivo, o.semanas, o.ritmoActual];
  if (!nums.every((n) => Number.isFinite(n))) {
    return { valido: false, chequeos: [], puntuacion: 0, ritmoNecesario: NaN, exigencia: NaN, avance: NaN };
  }

  const accion = o.accion.trim().toLowerCase();
  const esVago = VERBOS_VAGOS.some((v) => accion.startsWith(v));
  const avance = o.valorObjetivo - o.valorInicial;
  const ritmoNecesario = o.semanas > 0 ? avance / o.semanas : NaN;
  const exigencia = o.ritmoActual > 0 ? ritmoNecesario / o.ritmoActual : NaN;

  const chequeos: Chequeo[] = [
    {
      letra: 'especifico',
      cumple: !vacio(o.accion) && !esVago,
      motivo: vacio(o.accion) ? 'vacio' : esVago ? 'verbo-vago' : 'ok',
    },
    {
      letra: 'medible',
      cumple: !vacio(o.indicador) && avance !== 0,
      motivo: vacio(o.indicador) ? 'vacio' : avance === 0 ? 'sin-avance' : 'ok',
    },
    {
      // Achievable is the only letter the module can only flag, never confirm:
      // a pace far above the one already sustained is a warning, not a verdict.
      letra: 'alcanzable',
      cumple: !(Number.isFinite(exigencia) && exigencia > 3),
      motivo: Number.isFinite(exigencia) && exigencia > 3 ? 'ritmo-imposible' : 'ok',
    },
    { letra: 'relevante', cumple: !vacio(o.motivo), motivo: vacio(o.motivo) ? 'vacio' : 'ok' },
    { letra: 'temporal', cumple: o.semanas > 0, motivo: o.semanas > 0 ? 'ok' : 'sin-plazo' },
  ];

  return {
    valido: true,
    chequeos,
    puntuacion: chequeos.filter((c) => c.cumple).length,
    ritmoNecesario,
    exigencia,
    avance,
  };
}
