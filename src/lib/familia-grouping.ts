/**
 * Generic family-grouping helpers shared by the transversal sections
 * (Dinámicas, Debates). A "familia" is a thematic bucket with a reused color
 * token; items carry `data.familia` + `data.orden` and a curriculum map.
 */

export interface Familia {
  slug: string;
  label: string;
  /** One-line intro shown at the top of the family group on a hub. */
  intro: string;
  /** CSS custom property reused for the family accent (defined in global.css). */
  colorVar: string;
}

export interface HasFamilia {
  slug: string;
  data: {
    familia: string;
    orden: number;
    title: string;
    unidades_relacionadas: { asignatura: string; unidad: number }[];
  };
}

export interface FamiliaGroup<T extends HasFamilia> { familia: Familia; items: T[]; }

/** Group items by family in the given `familias` order; within each, sort by `orden`. Empty families are dropped. */
export function groupByFamilia<T extends HasFamilia>(familias: Familia[], items: T[]): FamiliaGroup<T>[] {
  return familias
    .map((familia) => ({
      familia,
      items: items
        .filter((it) => it.data.familia === familia.slug)
        .sort((a, b) => a.data.orden - b.data.orden),
    }))
    .filter((g) => g.items.length > 0);
}

export interface BrokenRef { slug: string; asignatura: string; unidad: number; }

/** Return every `unidades_relacionadas` entry that does not match an existing published unit (keyed `asignatura#unidad`). */
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
