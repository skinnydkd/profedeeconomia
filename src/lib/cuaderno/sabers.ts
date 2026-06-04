/**
 * Resolve the LOMLOE saberes for an activity: its own `sabers` if set, otherwise
 * derived from the libro unit it relates to (single source of truth in the book).
 */
export interface ActLike {
  asignatura: string;
  unidad_relacionada: number;
  sabers?: string[];
}

export function sabersDeActividad(act: ActLike, libroByUnit: Map<string, string[]>): string[] {
  if (act.sabers && act.sabers.length) return act.sabers;
  return libroByUnit.get(`${act.asignatura}#${act.unidad_relacionada}`) ?? [];
}
