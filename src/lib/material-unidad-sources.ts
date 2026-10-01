/**
 * Feeds material-unidad.ts from the content collections: the published units
 * of a subject (titles in the page's language), their tests, activities and
 * challenges. Only published ES entries count; CA twins share their slugs.
 */
import { getCollection } from 'astro:content';
import type { Locale } from '@/i18n/locale';
import { pickLocalizedEntry } from '@/i18n/content-locale';
import { materialPorUnidad, type MaterialDeUnidad } from './material-unidad';

const idToSlug = (id: string) => id.split('/').pop()?.replace(/\.mdx?$/, '') ?? id;

export async function getMaterialPorUnidad(asignatura: string, locale: Locale): Promise<MaterialDeUnidad[]> {
  const [libro, tests, actividades, retos] = await Promise.all([
    getCollection('libro'),
    getCollection('tests'),
    getCollection('actividades'),
    getCollection('retos'),
  ]);
  const libroCa = new Map(
    libro.filter((u) => u.data.estado === 'publicado' && u.data.lang === 'ca').map((u) => [u.id, u]),
  );
  const unidades = libro
    .filter((u) => u.data.asignatura === asignatura && u.data.estado === 'publicado' && u.data.lang === 'es')
    .map((u) => ({ unidad: u.data.unidad, slug: idToSlug(u.id), title: pickLocalizedEntry(u, libroCa, locale).data.title }));
  const deLaAsignatura = <T extends { data: { asignatura: string; estado: string; lang: string } }>(e: T) =>
    e.data.asignatura === asignatura && e.data.estado === 'publicado' && e.data.lang === 'es';
  return materialPorUnidad(
    asignatura,
    unidades,
    tests.filter(deLaAsignatura).map((t) => ({ unidad: t.data.unidad_relacionada, slug: idToSlug(t.id) })),
    actividades.filter(deLaAsignatura).map((x) => ({ unidad: x.data.unidad_relacionada, slug: idToSlug(x.id) })),
    retos
      .filter(deLaAsignatura)
      .flatMap((r) => (r.data.unidad_relacionada ? [{ unidad: r.data.unidad_relacionada, slug: idToSlug(r.id) }] : [])),
  );
}
