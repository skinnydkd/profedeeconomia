/**
 * Reads the transversal collections/registries and normalises them into
 * RecursoEntrada[] (resolving public href + section colour) so the pure
 * inverse-index helper can build the unit -> resources map.
 */
import { getCollection } from 'astro:content';
import type { RecursoEntrada, UnidadRef, RecursosDeUnidad } from './recursos-relacionados.ts';
import { buildIndiceRecursos, pickByLocale, slugBase } from './recursos-relacionados.ts';
import { type Locale, localizePath } from '../i18n/locale.ts';
import { localizeHerramienta } from '../i18n/herramientas-ca.ts';
import { localizeJuego } from '../i18n/juegos-ca.ts';
import { FAMILIAS } from './dinamicas.ts';
import { FAMILIAS_DEBATE } from './debates.ts';
import { MATERIAS } from './proyectos.ts';
import { FAMILIAS_HERRAMIENTA, HERRAMIENTAS, unidadesPorComponente } from './herramientas.ts';
import { JUEGOS } from './juegos.ts';

const colorOf = (fams: { slug: string; colorVar: string }[], slug: string) =>
  fams.find((f) => f.slug === slug)?.colorVar ?? '--color-mustard';

// dinámicas (familia) and debates (familia) share the same content shape.
async function fromFamiliaContent(
  collection: 'dinamicas' | 'debates',
  tipo: RecursoEntrada['tipo'],
  fams: { slug: string; colorVar: string }[],
  locale: Locale,
): Promise<RecursoEntrada[]> {
  const items = await getCollection(collection as any);
  const publicados = items.filter((e: any) => e.data.estado === 'publicado');
  return pickByLocale(publicados as any, locale).map((e: any) => {
    const familia = e.data.familia as string;
    const slug = slugBase(e.id);
    return {
      tipo, slug, title: e.data.title as string,
      href: localizePath(`/${collection}/${familia}/${slug}/`, locale),
      familiaColorVar: colorOf(fams, familia),
      unidades: (e.data.unidades_relacionadas ?? []) as UnidadRef[],
    };
  });
}

// proyectos interdisciplinares use `materia` (not `familia`).
async function fromProyectos(locale: Locale): Promise<RecursoEntrada[]> {
  const items = await getCollection('proyectos' as any);
  const publicados = items.filter((e: any) => e.data.estado === 'publicado');
  return pickByLocale(publicados as any, locale).map((e: any) => {
    const materia = e.data.materia as string;
    const slug = slugBase(e.id);
    return {
      tipo: 'proyecto' as const, slug, title: e.data.title as string,
      href: localizePath(`/proyectos/${materia}/${slug}/`, locale),
      familiaColorVar: colorOf(MATERIAS, materia),
      unidades: (e.data.unidades_relacionadas ?? []) as UnidadRef[],
    };
  });
}

// the transversal entrepreneurship project — collection `proyectoTransversal`,
// route keyed by zero-padded `fase` number.
async function fromEmprendimiento(locale: Locale): Promise<RecursoEntrada[]> {
  const items = await getCollection('proyectoTransversal' as any);
  const publicados = items.filter((e: any) => e.data.estado === 'publicado');
  return pickByLocale(publicados as any, locale).map((e: any) => {
    const fase = String(e.data.fase).padStart(2, '0');
    return {
      tipo: 'emprendimiento' as const, slug: slugBase(e.id), title: e.data.title as string,
      href: localizePath(`/emprendimiento/proyecto/${fase}/`, locale),
      familiaColorVar: '--color-terra',
      unidades: (e.data.unidades_relacionadas ?? []) as UnidadRef[],
    };
  });
}

async function fromHerramientas(locale: Locale): Promise<RecursoEntrada[]> {
  const recursos = await getCollection('recursos' as any);
  const derivadas = unidadesPorComponente(recursos as any); // Map<componente, {asignatura,unidad}[]>
  return HERRAMIENTAS.map((base) => {
    const h = localizeHerramienta(base, locale);
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
      href: localizePath(`/herramientas/${h.familia}/${h.slug}/`, locale),
      familiaColorVar: colorOf(FAMILIAS_HERRAMIENTA, h.familia),
      unidades,
    };
  }).filter((e) => e.unidades.length > 0);
}

// Cajút is excluded — it is rendered as the universal closer, not a data row.
function fromJuegos(locale: Locale): RecursoEntrada[] {
  return JUEGOS
    .filter((g) => g.estado === 'disponible' && g.slug !== 'cajut')
    .map((base) => {
      const g = localizeJuego(base, locale);
      return {
        tipo: 'juego' as const, slug: g.slug, title: g.title,
        href: localizePath(g.href, locale),
        familiaColorVar: '--color-terra',
        unidades: g.unidades_relacionadas as UnidadRef[],
      };
    });
}

export async function collectRecursoEntradas(locale: Locale = 'es'): Promise<RecursoEntrada[]> {
  const [din, deb, pro, emp, her] = await Promise.all([
    fromFamiliaContent('dinamicas', 'dinamica', FAMILIAS, locale),
    fromFamiliaContent('debates', 'debate', FAMILIAS_DEBATE, locale),
    fromProyectos(locale),
    fromEmprendimiento(locale),
    fromHerramientas(locale),
  ]);
  return [...din, ...deb, ...pro, ...emp, ...her, ...fromJuegos(locale)];
}

/**
 * Memoised per language across all unit-page renders in a build: the
 * collections are read once for each edition, not once per page.
 */
const _indices = new Map<Locale, Promise<Map<string, RecursosDeUnidad>>>();
export function getIndiceRecursos(locale: Locale = 'es'): Promise<Map<string, RecursosDeUnidad>> {
  let idx = _indices.get(locale);
  if (!idx) {
    idx = collectRecursoEntradas(locale).then(buildIndiceRecursos);
    _indices.set(locale, idx);
  }
  return idx;
}
