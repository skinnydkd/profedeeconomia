/**
 * Data and helpers for the «Olimpiada de Economía» prep section (Bachillerato).
 * Thematic blocks reuse the generic familia-grouping (shared with Dinámicas etc.).
 * Color tokens reuse global.css — no new colors.
 */
import type { Familia } from './familia-grouping';
export { groupByFamilia } from './familia-grouping';
export type { Familia, FamiliaGroup, HasFamilia } from './familia-grouping';

export const BLOQUES: Familia[] = [
  { slug: 'fpp',                 label: 'FPP y coste de oportunidad',        intro: 'Frontera de posibilidades, eficiencia y coste de oportunidad.', colorVar: '--color-taller3' },
  { slug: 'oferta-demanda',      label: 'Oferta, demanda y elasticidad',     intro: 'Equilibrio de mercado, desplazamientos y elasticidades.',       colorVar: '--color-eco1' },
  { slug: 'punto-muerto',        label: 'Producción, costes y punto muerto', intro: 'Costes, umbral de rentabilidad y la cuenta de resultados.',     colorVar: '--color-edmn' },
  { slug: 'politica-economica',  label: 'Política monetaria y fiscal',       intro: 'Objetivos, instrumentos y efectos sobre precios, producción y empleo.', colorVar: '--color-ipe2' },
  { slug: 'mercado-trabajo',     label: 'Mercado de trabajo y desempleo',    intro: 'EPA, tasas, tipos de paro y el funcionamiento del mercado laboral.', colorVar: '--color-fopp' },
  { slug: 'contabilidad',        label: 'Contabilidad y rentabilidad',       intro: 'Balance, resultado, fondo de maniobra y ratios de rentabilidad.', colorVar: '--color-gpe' },
];

export const BLOQUE_SLUGS = BLOQUES.map((b) => b.slug) as [string, ...string[]];
const BY_SLUG = new Map(BLOQUES.map((b) => [b.slug, b]));
export function bloqueMeta(slug: string): Familia {
  const b = BY_SLUG.get(slug);
  if (!b) throw new Error(`unknown bloque: ${slug}`);
  return b;
}

export interface Simulacro { slug: string; title: string; convocatoria: string; anio: number; pdf: string; oficial: boolean; }
export const SIMULACROS: Simulacro[] = [
  { slug: 'cv-2014', title: 'Fase Local C. Valenciana 2014', convocatoria: 'Fase Local · C. Valenciana', anio: 2014, pdf: '/olimpiada/examen-olimpiadas-1.pdf', oficial: true },
  { slug: 'cv-2018', title: 'Fase Local C. Valenciana 2018', convocatoria: 'Fase Local · C. Valenciana', anio: 2018, pdf: '/olimpiada/examen-olimpiadas-3.pdf', oficial: true },
  { slug: 'cv-2021', title: 'Fase Local C. Valenciana 2021', convocatoria: 'Fase Local · C. Valenciana', anio: 2021, pdf: '/olimpiada/examen-olimpiadas-2.pdf', oficial: true },
  { slug: 'megaexamen', title: 'Megaexamen de práctica', convocatoria: 'Material de práctica del profesor', anio: 0, pdf: '/olimpiada/megaexamen-olimpiadas.pdf', oficial: false },
];

export interface Lectura { categoria: string; titulo: string; autor: string; comentario: string; }
export const LECTURAS: Lectura[] = [ /* populated in Task 5 from RECOMENDACIONES */ ];

export interface ParteGuia { nombre: string; puntos: string; tiempo?: string; descripcion: string; }
export const GUIA: { duracion: string; total: string; partes: ParteGuia[] } = {
  duracion: '2 horas y 30 minutos',
  total: '8 puntos',
  partes: [
    { nombre: 'Parte I — Teoría', puntos: '4,5 pts (3 × 1,5)', descripcion: 'Elige 3 de 6 preguntas de desarrollo. Definir conceptos y representarlos gráficamente; razonar la veracidad de afirmaciones.' },
    { nombre: 'Parte II — Ejercicio', puntos: '3 pts', descripcion: 'Elige 1 de 2 ejercicios numéricos. El punto muerto aparece casi siempre; también FPP, oferta-demanda algebraica o contabilidad.' },
    { nombre: 'Parte III — Comentario de texto', puntos: '2,5 pts', descripcion: 'Texto de prensa económica con preguntas que conectan cada párrafo con un concepto del temario.' },
  ],
};
