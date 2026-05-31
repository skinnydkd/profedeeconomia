/**
 * «De cero a empresa» — transversal entrepreneurship project.
 * Pure helpers shared by the index page, the phase pages and the PDF route.
 */

export type Nivel = 'todos' | 'eso' | 'bach-fp';
export type ItinerarioId = 'sprint-eso' | 'bach-fp' | 'a-la-carta';

export interface Itinerario {
  id: ItinerarioId;
  label: string;
  descripcion: string;
  /** Phase numbers included, in display order. `null` means "all phases". */
  fases: number[] | null;
}

/** The three predefined paths through the project. */
export const ITINERARIOS: Itinerario[] = [
  {
    id: 'sprint-eso',
    label: 'Sprint ESO',
    descripcion:
      'Cinco fases lean, sin planificación pesada. Un mes aproximadamente. Pensado para 3.º y 4.º de ESO.',
    fases: [1, 2, 3, 4, 11],
  },
  {
    id: 'bach-fp',
    label: 'Proyecto Batx/FP',
    descripcion:
      'Las once fases, con la profundización de empresa (operaciones, personas, financiación). El proyecto completo.',
    fases: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  },
  {
    id: 'a-la-carta',
    label: 'A la carta',
    descripcion:
      'Elige las fases que encajen en tu asignatura y tu tiempo. Cada fase es un módulo independiente.',
    fases: null,
  },
];

export interface FaseLike {
  fase: number;
}

/**
 * Returns the phases that belong to an itinerary, sorted ascending by `fase`.
 * `a-la-carta` (fases === null) returns every phase. Never mutates the input.
 */
export function fasesForItinerario<T extends FaseLike>(all: T[], id: ItinerarioId): T[] {
  const it = ITINERARIOS.find((i) => i.id === id);
  const sorted = [...all].sort((a, b) => a.fase - b.fase);
  if (!it || it.fases === null) return sorted;
  const set = new Set(it.fases);
  return sorted.filter((f) => set.has(f.fase));
}

/** Minimal shape of a `libro` collection entry needed to resolve its route. */
export interface UnidadLike {
  id: string;
  data: { asignatura: string; unidad: number; estado: string };
}

/**
 * Resolves the real route slug for a unit, given the `libro` collection entries.
 * The libro route param is the filename slug (e.g. "09-funcion-financiera"),
 * NOT the unit number — so a transversal bridge that only knows
 * (asignatura, número) must look the slug up here. Returns `null` when no
 * published unit matches, so callers can avoid emitting a broken 404 link.
 */
export function unidadSlug(
  libro: UnidadLike[],
  asignatura: string,
  unidad: number
): string | null {
  const entry = libro.find(
    (u) =>
      u.data.asignatura === asignatura &&
      u.data.unidad === unidad &&
      u.data.estado === 'publicado'
  );
  if (!entry) return null;
  return entry.id.split('/').pop()?.replace(/\.mdx?$/, '') ?? null;
}
