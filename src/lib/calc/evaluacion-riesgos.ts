/**
 * Simplified risk assessment: probability × consequence, and what each level
 * obliges you to do about it.
 *
 * The matrix and the action table follow the simplified method the INSST
 * publishes for basic-level risk assessment, which is the one an FP student is
 * expected to apply. It is a stable methodology rather than a figure that
 * changes each year, so it lives here as a constant.
 *
 * The teaching point the module is built around: the level does not just label
 * a risk, it determines whether you may keep working while you fix it. That is
 * what separates an assessment from an opinion.
 */

export type Probabilidad = 'baja' | 'media' | 'alta';
export type Consecuencia = 'ligeramente-daninio' | 'daninio' | 'extremadamente-daninio';
export type Nivel = 'trivial' | 'tolerable' | 'moderado' | 'importante' | 'intolerable';

const P_ORDEN: Probabilidad[] = ['baja', 'media', 'alta'];
const C_ORDEN: Consecuencia[] = ['ligeramente-daninio', 'daninio', 'extremadamente-daninio'];

/** Rows are probability, columns are consequence, in the orders above. */
const MATRIZ: Nivel[][] = [
  ['trivial', 'tolerable', 'moderado'],
  ['tolerable', 'moderado', 'importante'],
  ['moderado', 'importante', 'intolerable'],
];

export interface Riesgo {
  id: string;
  probabilidad: Probabilidad;
  consecuencia: Consecuencia;
}

export interface RiesgoValorado extends Riesgo {
  nivel: Nivel;
  /** Rank 0–4, for sorting. */
  orden: number;
  /** Can work continue while the measure is put in place? */
  puedeSeguirTrabajando: boolean;
  /** Does the level require action at all? */
  requiereAccion: boolean;
}

const ORDEN_NIVEL: Nivel[] = ['trivial', 'tolerable', 'moderado', 'importante', 'intolerable'];

export function valorarRiesgo(p: Probabilidad, c: Consecuencia): Nivel | null {
  const i = P_ORDEN.indexOf(p);
  const j = C_ORDEN.indexOf(c);
  if (i < 0 || j < 0) return null;
  return MATRIZ[i][j];
}

export interface Resultado {
  valido: boolean;
  /** Sorted most severe first. */
  riesgos: RiesgoValorado[];
  /** Levels that stop work: 'intolerable' now, 'importante' until corrected. */
  bloqueantes: RiesgoValorado[];
  porNivel: Record<Nivel, number>;
}

export function evaluar(riesgos: Riesgo[]): Resultado {
  const vacioPorNivel = Object.fromEntries(ORDEN_NIVEL.map((n) => [n, 0])) as Record<Nivel, number>;
  if (!Array.isArray(riesgos) || riesgos.length === 0) {
    return { valido: false, riesgos: [], bloqueantes: [], porNivel: vacioPorNivel };
  }
  if (!riesgos.every((r) => valorarRiesgo(r.probabilidad, r.consecuencia) !== null)) {
    return { valido: false, riesgos: [], bloqueantes: [], porNivel: vacioPorNivel };
  }

  const valorados: RiesgoValorado[] = riesgos.map((r) => {
    const nivel = valorarRiesgo(r.probabilidad, r.consecuencia) as Nivel;
    return {
      ...r,
      nivel,
      orden: ORDEN_NIVEL.indexOf(nivel),
      // Intolerable stops work outright; importante does not allow starting
      // and requires correcting before continuing.
      puedeSeguirTrabajando: nivel !== 'intolerable' && nivel !== 'importante',
      requiereAccion: nivel !== 'trivial',
    };
  }).sort((a, b) => b.orden - a.orden);

  const porNivel = valorados.reduce((acc, r) => {
    acc[r.nivel] += 1;
    return acc;
  }, { ...vacioPorNivel });

  return {
    valido: true,
    riesgos: valorados,
    bloqueantes: valorados.filter((r) => !r.puedeSeguirTrabajando),
    porNivel,
  };
}
