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

export function recursosDeUnidad(
  idx: Map<string, RecursosDeUnidad>, asignatura: string, unidad: number,
): RecursosDeUnidad {
  return idx.get(key(asignatura, unidad)) ?? emptyGroups();
}

export function tieneRecursos(r: RecursosDeUnidad): boolean {
  return TIPOS.some((t) => r[t].length > 0);
}
