/**
 * How exposed a job is to automation, task by task.
 *
 * The framing matters more than the arithmetic here, and it is the framing the
 * chapter argues for: automation replaces TASKS, not jobs. An occupation whose
 * routine half is automatable does not disappear — it changes, and what it
 * changes into is the other half plus whatever the new tools require.
 *
 * So the module never outputs "your job will be replaced". It outputs which
 * share of the described hours sits in routine tasks, which sits in tasks that
 * need judgement, dealing with people or handling the unexpected, and what the
 * occupation looks like if the first group shrinks.
 */

export interface Tarea {
  nombre: string;
  /** Hours a week spent on it. */
  horas: number;
  /** Same steps every time, predictable input and output. */
  rutinaria: boolean;
  /** Requires deciding with incomplete information. */
  requiereCriterio: boolean;
  /** Requires dealing with people: care, persuasion, negotiation, teaching. */
  requiereTrato: boolean;
  /** Requires physical work in an unpredictable setting. */
  requiereManos: boolean;
}

export interface TareaValorada extends Tarea {
  /**
   * 0–1. Routine raises exposure; judgement, human contact and unpredictable
   * physical work each lower it. This is a teaching heuristic, not a forecast,
   * and the UI says so.
   */
  exposicion: number;
}

export interface Resultado {
  valido: boolean;
  tareas: TareaValorada[];
  horasTotales: number;
  /** Hours weighted by exposure, as a share of the total. */
  exposicionMedia: number;
  /** Hours in tasks with exposure at or above the high threshold. */
  horasAltaExposicion: number;
  /** Hours in tasks that survive: the shape of the job after the change. */
  horasNucleo: number;
  /** Tasks the occupation would be built around, most protected first. */
  nucleo: TareaValorada[];
}

export const UMBRAL_ALTA = 0.6;

export function exposicionTarea(t: Tarea): number {
  let e = t.rutinaria ? 0.9 : 0.35;
  if (t.requiereCriterio) e -= 0.3;
  if (t.requiereTrato) e -= 0.25;
  if (t.requiereManos) e -= 0.15;
  return Math.min(1, Math.max(0, Number(e.toFixed(4))));
}

export function evaluar(tareas: Tarea[]): Resultado {
  const vacio: Resultado = {
    valido: false, tareas: [], horasTotales: 0, exposicionMedia: NaN,
    horasAltaExposicion: 0, horasNucleo: 0, nucleo: [],
  };
  if (!Array.isArray(tareas) || tareas.length === 0) return vacio;
  if (!tareas.every((t) => Number.isFinite(t.horas) && t.horas >= 0)) return vacio;

  const horasTotales = tareas.reduce((s, t) => s + t.horas, 0);
  if (horasTotales <= 0) return vacio;

  const valoradas: TareaValorada[] = tareas.map((t) => ({ ...t, exposicion: exposicionTarea(t) }));
  const ponderada = valoradas.reduce((s, t) => s + t.exposicion * t.horas, 0);

  const nucleo = valoradas.filter((t) => t.exposicion < UMBRAL_ALTA).sort((a, b) => a.exposicion - b.exposicion);

  return {
    valido: true,
    tareas: valoradas.sort((a, b) => b.exposicion - a.exposicion),
    horasTotales,
    exposicionMedia: ponderada / horasTotales,
    horasAltaExposicion: valoradas.filter((t) => t.exposicion >= UMBRAL_ALTA).reduce((s, t) => s + t.horas, 0),
    horasNucleo: nucleo.reduce((s, t) => s + t.horas, 0),
    nucleo,
  };
}
