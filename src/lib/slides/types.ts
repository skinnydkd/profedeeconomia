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
  | { tipo: 'close'; title: string; nota?: string };

export type SlideTipo = Slide['tipo'];

export interface Deck {
  asignatura: string;
  unidad: number;
  title: string;
  slides: Slide[];
}
