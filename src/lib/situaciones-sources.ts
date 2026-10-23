import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { pickLocalizedEntry } from '@/i18n/content-locale';
import type { Locale } from '@/i18n/locale';
import type { AsignaturaSlug } from './asignaturas';
import { selectGuias } from './situaciones';

/** Published situaciones of a subject, sorted by `orden`, localised (ES fallback). */
export async function getSituaciones(
  asignatura: AsignaturaSlug,
  locale: Locale,
): Promise<CollectionEntry<'situaciones'>[]> {
  const all = (await getCollection('situaciones')).filter((e) => e.data.estado === 'publicado');
  const ca = new Map(all.filter((e) => e.data.lang === 'ca').map((e) => [e.id, e]));
  return all
    .filter((e) => e.data.asignatura === asignatura && e.data.lang === 'es')
    .sort((a, b) => a.data.orden - b.data.orden)
    .map((e) => pickLocalizedEntry(e, ca, locale));
}

/** Published guía / solucionario entries of one material, guia first. */
export async function getGuias(
  asignatura: AsignaturaSlug,
  materialId: string,
  locale: Locale,
): Promise<CollectionEntry<'guias-sa'>[]> {
  return selectGuias(await getCollection('guias-sa'), asignatura, materialId, locale);
}
