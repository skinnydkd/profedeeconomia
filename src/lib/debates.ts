/**
 * Metadata and helpers for the transversal «Debates» section. Family
 * color-coding reuses already-validated tokens from global.css — no new colors.
 * Generic grouping/validation live in ./familia-grouping (shared with Dinámicas).
 */
import type { Familia } from './familia-grouping';
export { groupByFamilia, findBrokenUnidadRefs } from './familia-grouping';
export type { FamiliaGroup, HasFamilia, BrokenRef } from './familia-grouping';

export const FAMILIAS_DEBATE: Familia[] = [
  { slug: 'mercado-estado',            label: 'Mercado y Estado',            intro: '¿Hasta dónde debe intervenir el Estado en la economía?',     colorVar: '--color-eco1' },
  { slug: 'trabajo-desigualdad',       label: 'Trabajo y desigualdad',       intro: 'Salarios, empleo y reparto de la renta.',                    colorVar: '--color-fopp' },
  { slug: 'globalizacion-comercio',    label: 'Globalización y comercio',    intro: 'Comercio internacional, deslocalización y proteccionismo.',  colorVar: '--color-edmn' },
  { slug: 'sostenibilidad-crecimiento',label: 'Sostenibilidad y crecimiento',intro: '¿Crecer sin límite o decrecer para durar?',                  colorVar: '--color-mustard' },
  { slug: 'etica-empresa-consumo',     label: 'Ética, empresa y consumo',    intro: 'Responsabilidad de las empresas y consumo consciente.',      colorVar: '--color-gpe' },
  { slug: 'dinero-tecnologia-futuro',  label: 'Dinero, tecnología y futuro', intro: 'Cripto, automatización, IA y renta básica.',                 colorVar: '--color-ipe2' },
];

export const FAMILIA_DEBATE_SLUGS = FAMILIAS_DEBATE.map((f) => f.slug) as [string, ...string[]];

const BY_SLUG = new Map(FAMILIAS_DEBATE.map((f) => [f.slug, f]));

export function familiaMeta(slug: string): Familia {
  const f = BY_SLUG.get(slug);
  if (!f) throw new Error(`unknown familia de debate: ${slug}`);
  return f;
}

/**
 * Canonical filename for a debate's pre-generated material pack PDF, served
 * from /downloads/. Must match the name produced by scripts/build-debates-pdf.mjs.
 */
export function debatePdfName(familia: string, slug: string): string {
  return `debate-${familia}-${slug}.pdf`;
}
