/**
 * Typed slide model for the native Astro slide renderer.
 * A Deck is an ordered list of typed Slides; each archetype renders one 16:9 box.
 */
export type Slide =
  | { tipo: 'cover'; eyebrow?: string; title: string; subtitle?: string }
  | { tipo: 'concept'; eyebrow?: string; title?: string; body?: string; pull?: string }
  | { tipo: 'diagram'; eyebrow?: string; title?: string; diagrama: string; caption?: string }
  | { tipo: 'data'; numero: string; label?: string; title?: string; detalle?: string }
  | { tipo: 'quote'; texto: string; fuente?: string }
  | { tipo: 'exercise'; title: string; enunciado: string; pasos?: string[] }
  // Authored-deck archetypes (see lib/slides/authored.ts). They exist so a
  // slide can carry real study density — definitions, comparisons, data,
  // images, self-check questions — instead of one condensed paragraph.
  | { tipo: 'terms'; eyebrow?: string; title?: string; terms: { t: string; d: string }[] }
  | { tipo: 'table'; eyebrow?: string; title?: string; head: string[]; rows: string[][]; caption?: string }
  | { tipo: 'split'; eyebrow?: string; title?: string; left: SplitCol; right: SplitCol }
  | { tipo: 'list'; eyebrow?: string; title?: string; items: string[]; ordered?: boolean }
  | { tipo: 'figure'; src: string; alt: string; title?: string; caption?: string; credit?: string; meta?: unknown }
  | { tipo: 'quiz'; eyebrow?: string; pregunta: string; opciones: string[]; correcta: number; explicacion?: string }
  // Second authored wave: the deck was 26 % plain prose because these shapes
  // had nowhere to go. Each one takes a job that `concept` was doing badly.
  | { tipo: 'formula'; eyebrow?: string; title?: string; formula: string; terminos?: FormulaTerm[]; ejemplo?: string }
  | { tipo: 'timeline'; eyebrow?: string; title?: string; hitos: Hito[] }
  | { tipo: 'caso'; eyebrow?: string; title: string; contexto: string; datos?: string[]; pregunta: string }
  | { tipo: 'recap'; eyebrow?: string; title?: string; items: string[] }
  | { tipo: 'curriculum'; eyebrow?: string; title?: string; saberes: string[]; competencias: string[]; criterios?: string[] }
  | { tipo: 'close'; title: string; nota?: string };

/** One symbol of a formula and what it stands for. */
export interface FormulaTerm { s: string; d: string }
/** One dated milestone on a timeline. */
export interface Hito { fecha: string; hito: string; detalle?: string }

export interface SplitCol { h?: string; items: string[] }

export type SlideTipo = Slide['tipo'];

export interface Deck {
  asignatura: string;
  unidad: number;
  title: string;
  slides: Slide[];
}
