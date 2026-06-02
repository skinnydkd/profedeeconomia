/**
 * Metadata and pure build helpers for the transversal «Dinámicas» section.
 * Family color-coding reuses already-validated tokens from global.css — no new colors.
 */

export type FamiliaSlug =
  | 'mercat-treball' | 'mercats-preus' | 'distribucion-produccion'
  | 'decisiones-comunes' | 'sistemas-debates' | 'empresa-organizacion' | 'teoria-juegos';

export interface Familia {
  slug: FamiliaSlug;
  label: string;
  /** One-line intro shown at the top of the family group on the hub. */
  intro: string;
  /** CSS custom property reused for the family accent (defined in global.css). */
  colorVar: string;
}

export const FAMILIAS: Familia[] = [
  { slug: 'mercat-treball',         label: 'Mercado de trabajo',        intro: 'Entrevistas, selección y negociación salarial.',                 colorVar: '--color-fopp' },
  { slug: 'mercats-preus',          label: 'Mercados y precios',        intro: 'Cómo se forman los precios: competencia, monopolio y cártel.',   colorVar: '--color-eco1' },
  { slug: 'distribucion-produccion',label: 'Distribución y producción', intro: 'Quién se queda qué valor en una cadena de producción.',          colorVar: '--color-gpe' },
  { slug: 'decisiones-comunes',     label: 'Decisiones y bienes comunes', intro: 'Cooperar o aprovecharse: comunes, bienes públicos y comercio.', colorVar: '--color-taller3' },
  { slug: 'sistemas-debates',       label: 'Sistemas económicos y debates', intro: 'Mercado, Estado y los grandes debates, con roles y turnos.',  colorVar: '--color-ipe2' },
  { slug: 'empresa-organizacion',   label: 'Empresa y organización',    intro: 'Decidir en equipo: juntas, cooperativas y cadenas de suministro.', colorVar: '--color-edmn' },
  { slug: 'teoria-juegos',          label: 'Teoría de juegos',          intro: 'Juegos clásicos y subastas para ver la estrategia en acción.',   colorVar: '--color-mustard' },
];

const BY_SLUG = new Map(FAMILIAS.map((f) => [f.slug, f]));

export function familiaMeta(slug: string): Familia {
  const f = BY_SLUG.get(slug as FamiliaSlug);
  if (!f) throw new Error(`unknown familia: ${slug}`);
  return f;
}

interface HasFamilia {
  slug: string;
  data: { familia: string; orden: number; title: string;
    unidades_relacionadas: { asignatura: string; unidad: number }[] };
}

export interface FamiliaGroup<T extends HasFamilia> { familia: Familia; dinamicas: T[]; }

/** Group dinámicas by family in FAMILIAS order; within each, sort by `orden`. Empty families are dropped. */
export function groupByFamilia<T extends HasFamilia>(items: T[]): FamiliaGroup<T>[] {
  return FAMILIAS.map((familia) => ({
    familia,
    dinamicas: items
      .filter((it) => it.data.familia === familia.slug)
      .sort((a, b) => a.data.orden - b.data.orden),
  })).filter((g) => g.dinamicas.length > 0);
}

export interface BrokenRef { slug: string; asignatura: string; unidad: number; }

/** Return every `unidades_relacionadas` entry that does not match an existing published unit. */
export function findBrokenUnidadRefs<T extends HasFamilia>(items: T[], libroUnits: Set<string>): BrokenRef[] {
  const broken: BrokenRef[] = [];
  for (const it of items) {
    for (const u of it.data.unidades_relacionadas) {
      if (!libroUnits.has(`${u.asignatura}#${u.unidad}`)) {
        broken.push({ slug: it.slug, asignatura: u.asignatura, unidad: u.unidad });
      }
    }
  }
  return broken;
}
