/**
 * Metadata and pure build helpers for the transversal «Dinámicas» section.
 * Family color-coding reuses already-validated tokens from global.css — no new colors.
 * Generic grouping logic lives in familia-grouping.ts (shared with Debates, etc.).
 */

import type { Familia } from './familia-grouping';
export { groupByFamilia, findBrokenUnidadRefs } from './familia-grouping';
export type { FamiliaGroup, HasFamilia, BrokenRef } from './familia-grouping';

export type FamiliaSlug =
  | 'mercat-treball' | 'mercats-preus' | 'distribucion-produccion'
  | 'decisiones-comunes' | 'sistemas-debates' | 'empresa-organizacion' | 'teoria-juegos';

export const FAMILIAS: Familia[] = [
  { slug: 'mercat-treball',         label: 'Mercado de trabajo',        intro: 'Entrevistas, selección y negociación salarial.',                 colorVar: '--color-fopp' },
  { slug: 'mercats-preus',          label: 'Mercados y precios',        intro: 'Cómo se forman los precios: competencia, monopolio y cártel.',   colorVar: '--color-eco1' },
  { slug: 'distribucion-produccion',label: 'Distribución y producción', intro: 'Quién se queda qué valor en una cadena de producción.',          colorVar: '--color-gpe' },
  { slug: 'decisiones-comunes',     label: 'Decisiones y bienes comunes', intro: 'Cooperar o aprovecharse: comunes, bienes públicos y comercio.', colorVar: '--color-taller3' },
  { slug: 'sistemas-debates',       label: 'Sistemas económicos y debates', intro: 'Mercado, Estado y los grandes debates, con roles y turnos.',  colorVar: '--color-ipe2' },
  { slug: 'empresa-organizacion',   label: 'Empresa y organización',    intro: 'Decidir en equipo: juntas, cooperativas y cadenas de suministro.', colorVar: '--color-edmn' },
  { slug: 'teoria-juegos',          label: 'Teoría de juegos',          intro: 'Juegos clásicos y subastas para ver la estrategia en acción.',   colorVar: '--color-mustard' },
];

export const FAMILIA_SLUGS = FAMILIAS.map((f) => f.slug) as [FamiliaSlug, ...FamiliaSlug[]];

const BY_SLUG = new Map(FAMILIAS.map((f) => [f.slug, f]));

export function familiaMeta(slug: string): Familia {
  const f = BY_SLUG.get(slug as FamiliaSlug);
  if (!f) throw new Error(`unknown familia: ${slug}`);
  return f;
}

