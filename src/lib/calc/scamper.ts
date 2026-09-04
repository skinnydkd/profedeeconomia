/**
 * SCAMPER as a divergence discipline, not as a list of prompts.
 *
 * The interesting thing this module enforces is the order: you diverge first
 * and converge afterwards, and mixing the two is what kills a brainstorming
 * session. So it tracks how many prompts have actually been used and how many
 * ideas exist, and reports when a group is trying to score ideas before it has
 * produced enough of them to have anything worth scoring.
 */

export type Prompt = 'sustituir' | 'combinar' | 'adaptar' | 'modificar' | 'otros-usos' | 'eliminar' | 'reordenar';

export const PROMPTS: Prompt[] = [
  'sustituir', 'combinar', 'adaptar', 'modificar', 'otros-usos', 'eliminar', 'reordenar',
];

export interface Idea {
  prompt: Prompt;
  texto: string;
  /** 0 until the group converges. Only meaningful once divergence is done. */
  potencial?: number;
  esfuerzo?: number;
}

/** Below this many ideas, scoring is premature: there is nothing to choose from. */
export const MINIMO_DIVERGENCIA = 12;
/** Using fewer prompts than this means the group stayed in its comfort zone. */
export const MINIMO_PROMPTS = 4;

export interface Resultado {
  valido: boolean;
  total: number;
  /** How many ideas came from each prompt. */
  porPrompt: Record<Prompt, number>;
  promptsUsados: number;
  promptsSinUsar: Prompt[];
  /** True once there are enough ideas, from enough angles, to start choosing. */
  listoParaConverger: boolean;
  /** Ideas ranked by potential over effort, only once convergence makes sense. */
  ranking: (Idea & { indice: number })[];
}

export function evaluar(ideas: Idea[]): Resultado {
  const vacioPorPrompt = Object.fromEntries(PROMPTS.map((p) => [p, 0])) as Record<Prompt, number>;
  if (!Array.isArray(ideas)) {
    return {
      valido: false, total: 0, porPrompt: vacioPorPrompt, promptsUsados: 0,
      promptsSinUsar: PROMPTS, listoParaConverger: false, ranking: [],
    };
  }

  const utiles = ideas.filter((i) => i.texto && i.texto.trim().length > 0 && PROMPTS.includes(i.prompt));
  const porPrompt = utiles.reduce((acc, i) => {
    acc[i.prompt] += 1;
    return acc;
  }, { ...vacioPorPrompt });

  const promptsUsados = PROMPTS.filter((p) => porPrompt[p] > 0).length;
  const listoParaConverger = utiles.length >= MINIMO_DIVERGENCIA && promptsUsados >= MINIMO_PROMPTS;

  const ranking = listoParaConverger
    ? utiles
        .map((i) => {
          const pot = Number.isFinite(i.potencial) ? (i.potencial as number) : 0;
          const esf = Number.isFinite(i.esfuerzo) ? (i.esfuerzo as number) : 0;
          // Effort of zero would divide by zero; a floor of 1 keeps the order sane
          // and matches the scale the UI offers (1–5).
          return { ...i, indice: pot / Math.max(1, esf) };
        })
        .sort((a, b) => b.indice - a.indice)
    : [];

  return {
    valido: true,
    total: utiles.length,
    porPrompt,
    promptsUsados,
    promptsSinUsar: PROMPTS.filter((p) => porPrompt[p] === 0),
    listoParaConverger,
    ranking,
  };
}
