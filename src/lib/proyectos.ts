/**
 * Metadata and helpers for the transversal «Proyectos interdisciplinares» section.
 * Each project crosses economics with another school subject (the "materia"),
 * which acts as the family. Color tokens reuse global.css — no new colors.
 * Generic grouping lives in ./familia-grouping (shared with Dinámicas/Debates).
 */
import type { Familia } from './familia-grouping';
export { groupByFamilia, findBrokenUnidadRefs } from './familia-grouping';
export type { FamiliaGroup, HasFamilia, BrokenRef } from './familia-grouping';

export const MATERIAS: Familia[] = [
  { slug: 'historia',      label: 'Historia',         intro: 'Crisis, revoluciones y la economía detrás de los hechos.',     colorVar: '--color-gpe' },
  { slug: 'matematicas',   label: 'Matemáticas',      intro: 'Datos, porcentajes, índices y gráficos para entender la economía.', colorVar: '--color-ipe2' },
  { slug: 'geografia',     label: 'Geografía',        intro: 'Territorio, recursos y comercio: dónde pasa la economía.',      colorVar: '--color-taller3' },
  { slug: 'etica-valores', label: 'Ética y valores',  intro: 'Decisiones económicas con dilemas morales y ciudadanía.',      colorVar: '--color-fopp' },
  { slug: 'filosofia',     label: 'Filosofía',        intro: 'La buena vida, la justicia y el sentido del dinero.',          colorVar: '--color-mustard' },
  { slug: 'lengua',        label: 'Lengua',           intro: 'Comunicar, persuadir y analizar el discurso económico.',       colorVar: '--color-terra' },
  { slug: 'tecnologia',    label: 'Tecnología',       intro: 'Construir, programar y prototipar con mirada económica.',      colorVar: '--color-eco1' },
];

export const MATERIA_SLUGS = MATERIAS.map((m) => m.slug) as [string, ...string[]];

const BY_SLUG = new Map(MATERIAS.map((m) => [m.slug, m]));

export function materiaMeta(slug: string): Familia {
  const m = BY_SLUG.get(slug);
  if (!m) throw new Error(`unknown materia: ${slug}`);
  return m;
}
