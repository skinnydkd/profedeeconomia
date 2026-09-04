/**
 * Inverse index book-unit -> related transversal resources.
 * PURE module (no astro:content imports) so it can be unit-tested.
 * Sources are normalised into RecursoEntrada[] by recursos-relacionados-sources.ts.
 */
export type TipoRecurso =
  | 'dinamica' | 'debate' | 'proyecto' | 'herramienta' | 'emprendimiento' | 'juego';

export interface UnidadRef { asignatura: string; unidad: number; nota?: string; }

export interface RecursoEntrada {
  tipo: TipoRecurso;
  slug: string;
  title: string;
  href: string;
  familiaColorVar: string;
  unidades: UnidadRef[];
}

export interface RecursoRef {
  tipo: TipoRecurso;
  slug: string;
  title: string;
  href: string;
  familiaColorVar: string;
  nota?: string;
}

export type RecursosDeUnidad = Record<TipoRecurso, RecursoRef[]>;

const TIPOS: TipoRecurso[] = ['dinamica', 'debate', 'proyecto', 'herramienta', 'emprendimiento', 'juego'];

function emptyGroups(): RecursosDeUnidad {
  return { dinamica: [], debate: [], proyecto: [], herramienta: [], emprendimiento: [], juego: [] };
}

const key = (asignatura: string, unidad: number) => `${asignatura}#${unidad}`;

export function buildIndiceRecursos(entradas: RecursoEntrada[]): Map<string, RecursosDeUnidad> {
  const map = new Map<string, RecursosDeUnidad>();
  for (const e of entradas) {
    for (const u of e.unidades) {
      const k = key(u.asignatura, u.unidad);
      let groups = map.get(k);
      if (!groups) { groups = emptyGroups(); map.set(k, groups); }
      groups[e.tipo].push({
        tipo: e.tipo, slug: e.slug, title: e.title, href: e.href,
        familiaColorVar: e.familiaColorVar, nota: u.nota,
      });
    }
  }
  return map;
}

/**
 * Base slug of a content entry id, with the `.ca` suffix of a Valencian
 * sibling removed. Both languages of the same resource share a public route,
 * so the id is what tells them apart and the base is what builds the href.
 */
export function slugBase(id: string): string {
  const last = id.split('/').filter(Boolean).pop() ?? '';
  return last.replace(/\.ca$/, '');
}

/**
 * One entry per resource in the requested language, falling back to Spanish
 * where a translation does not exist yet. Order follows the Spanish list, so
 * the two editions show the same resources in the same order.
 */
export function pickByLocale<T extends { id: string; data: { lang?: string } }>(
  entradas: T[], locale: string,
): T[] {
  const porBase = new Map<string, { es?: T; otra?: T }>();
  for (const e of entradas) {
    const base = slugBase(e.id);
    const slot = porBase.get(base) ?? {};
    if ((e.data.lang ?? 'es') === 'es') slot.es = e; else if (e.data.lang === locale) slot.otra = e;
    porBase.set(base, slot);
  }
  const out: T[] = [];
  for (const { es, otra } of porBase.values()) {
    const elegida = locale === 'es' ? es : (otra ?? es);
    if (elegida) out.push(elegida);
  }
  return out;
}

export function recursosDeUnidad(
  idx: Map<string, RecursosDeUnidad>, asignatura: string, unidad: number,
): RecursosDeUnidad {
  return idx.get(key(asignatura, unidad)) ?? emptyGroups();
}

export function tieneRecursos(r: RecursosDeUnidad): boolean {
  return TIPOS.some((t) => r[t].length > 0);
}
