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
