/**
 * Reads the transversal collections/registries and normalises them into
 * RecursoEntrada[] (resolving public href + section colour) so the pure
 * inverse-index helper can build the unit -> resources map.
 */
import { getCollection } from 'astro:content';
import type { RecursoEntrada, UnidadRef, RecursosDeUnidad } from './recursos-relacionados.ts';
import { buildIndiceRecursos } from './recursos-relacionados.ts';
import { FAMILIAS } from './dinamicas.ts';
import { FAMILIAS_DEBATE } from './debates.ts';
import { MATERIAS } from './proyectos.ts';
import { FAMILIAS_HERRAMIENTA, HERRAMIENTAS, unidadesPorComponente } from './herramientas.ts';
import { JUEGOS } from './juegos.ts';

const lastSeg = (id: string) => id.split('/').filter(Boolean).pop() as string;
const colorOf = (fams: { slug: string; colorVar: string }[], slug: string) =>
  fams.find((f) => f.slug === slug)?.colorVar ?? '--color-mustard';

// dinámicas (familia) and debates (familia) share the same content shape.
async function fromFamiliaContent(
  collection: 'dinamicas' | 'debates',
  tipo: RecursoEntrada['tipo'],
  fams: { slug: string; colorVar: string }[],
): Promise<RecursoEntrada[]> {
  const items = await getCollection(collection as any);
  return items
    .filter((e: any) => e.data.estado === 'publicado')
    .map((e: any) => {
      const familia = e.data.familia as string;
      const slug = lastSeg(e.id);
      return {
        tipo, slug, title: e.data.title as string,
        href: `/${collection}/${familia}/${slug}/`,
        familiaColorVar: colorOf(fams, familia),
        unidades: (e.data.unidades_relacionadas ?? []) as UnidadRef[],
      };
    });
}

// proyectos interdisciplinares use `materia` (not `familia`).
async function fromProyectos(): Promise<RecursoEntrada[]> {
  const items = await getCollection('proyectos' as any);
  return items
    .filter((e: any) => e.data.estado === 'publicado')
    .map((e: any) => {
      const materia = e.data.materia as string;
      const slug = lastSeg(e.id);
      return {
        tipo: 'proyecto' as const, slug, title: e.data.title as string,
        href: `/proyectos/${materia}/${slug}/`,
        familiaColorVar: colorOf(MATERIAS, materia),
        unidades: (e.data.unidades_relacionadas ?? []) as UnidadRef[],
      };
    });
}

// the transversal entrepreneurship project — collection `proyectoTransversal`,
// route keyed by zero-padded `fase` number.
async function fromEmprendimiento(): Promise<RecursoEntrada[]> {
  const items = await getCollection('proyectoTransversal' as any);
  return items
    .filter((e: any) => e.data.estado === 'publicado')
    .map((e: any) => {
      const fase = String(e.data.fase).padStart(2, '0');
      return {
        tipo: 'emprendimiento' as const, slug: lastSeg(e.id), title: e.data.title as string,
        href: `/emprendimiento/proyecto/${fase}/`,
        familiaColorVar: '--color-terra',
        unidades: (e.data.unidades_relacionadas ?? []) as UnidadRef[],
      };
    });
}

async function fromHerramientas(): Promise<RecursoEntrada[]> {
  const recursos = await getCollection('recursos' as any);
  const derivadas = unidadesPorComponente(recursos as any); // Map<componente, {asignatura,unidad}[]>
  return HERRAMIENTAS.map((h) => {
    const inline = h.unidades_relacionadas ?? [];
    const fromRecursos = derivadas.get(h.componente) ?? [];
    const seen = new Set<string>();
    const unidades: UnidadRef[] = [];
    for (const u of [...inline, ...fromRecursos]) {
      const k = `${u.asignatura}#${u.unidad}`;
      if (!seen.has(k)) { seen.add(k); unidades.push(u); }
    }
    return {
      tipo: 'herramienta' as const, slug: h.slug, title: h.title,
      href: `/herramientas/${h.familia}/${h.slug}/`,
      familiaColorVar: colorOf(FAMILIAS_HERRAMIENTA, h.familia),
      unidades,
    };
  }).filter((e) => e.unidades.length > 0);
}

// Cajút is excluded — it is rendered as the universal closer, not a data row.
function fromJuegos(): RecursoEntrada[] {
  return JUEGOS
    .filter((g) => g.estado === 'disponible' && g.slug !== 'cajut')
    .map((g) => ({
      tipo: 'juego' as const, slug: g.slug, title: g.title, href: g.href,
      familiaColorVar: '--color-terra',
      unidades: g.unidades_relacionadas as UnidadRef[],
    }));
}

export async function collectRecursoEntradas(): Promise<RecursoEntrada[]> {
  const [din, deb, pro, emp, her] = await Promise.all([
    fromFamiliaContent('dinamicas', 'dinamica', FAMILIAS),
    fromFamiliaContent('debates', 'debate', FAMILIAS_DEBATE),
    fromProyectos(),
    fromEmprendimiento(),
    fromHerramientas(),
  ]);
  return [...din, ...deb, ...pro, ...emp, ...her, ...fromJuegos()];
}

// Memoised across all unit-page renders in a build: collections are read once.
let _indice: Promise<Map<string, RecursosDeUnidad>> | null = null;
export function getIndiceRecursos(): Promise<Map<string, RecursosDeUnidad>> {
  if (!_indice) _indice = collectRecursoEntradas().then(buildIndiceRecursos);
  return _indice;
}
