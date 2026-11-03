import { getCollection } from 'astro:content';
import { pickLocalizedEntry } from '@/i18n/content-locale';
import { getLocale } from '@/i18n/locale';

/**
 * Published solved-problem families of a subject, localised to `locale`
 * (Spanish fallback when no published Valencian twin exists).
 * Kept apart from src/lib/ebau.ts so that file stays free of `astro:content`.
 */
export async function cargarFamilias(asignatura: string, locale: ReturnType<typeof getLocale>) {
  const all = (await getCollection('ebauProblemas')).filter((e) => e.data.estado === 'publicado');
  const ca = new Map(all.filter((e) => e.data.lang === 'ca').map((e) => [e.id, e]));
  return all
    .filter((e) => e.data.asignatura === asignatura && e.data.lang === 'es')
    .map((e) => pickLocalizedEntry(e, ca, locale));
}
