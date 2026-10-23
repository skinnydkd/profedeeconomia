import forbidden from './situaciones-forbidden.json';
import { pickLocalizedEntry } from '@/i18n/content-locale';
import type { Locale } from '@/i18n/locale';

// Pure helpers only: src/content.config.ts imports this file, so it must stay
// free of `astro:content`. Collection loaders live in situaciones-sources.ts.

export const TIPOS_MATERIAL = [
  'caso',
  'ficha',
  'dossier',
  'ejercicios',
  'apuntes',
  'resumen',
  'dinamica',
  'concurso',
  'repaso',
  'cuestionario',
  'control',
  'simulacro',
  'examen',
  'otro',
] as const;

const stem = (id: string) =>
  id
    .split('/')
    .pop()
    ?.replace(/\.mdx?$/, '')
    .replace(/\.ca$/, '') ?? id;

/** Slug of a situación (same id → slug rule as retos). */
export const situacionSlug = (entry: { id: string }): string => stem(entry.id);

/** Slug of a guía / solucionario, e.g. `ud01-cas-concorde-guia`. */
export const guiaSlug = (entry: { id: string }): string => stem(entry.id);

const suffix = (locale: Locale) => (locale === 'ca' ? '.ca' : '');

export const materialHtmlHref = (asig: string, id: string, locale: Locale): string =>
  `/situaciones/${asig}/${id}${suffix(locale)}.html`;

export const materialPdfHref = (asig: string, id: string, locale: Locale): string =>
  `/downloads/situaciones/${asig}/${id}${suffix(locale)}.pdf`;

type WithMateriales<M> = { materiales: M[] };

/** Materials a step lists, in the step's order; unknown ids are skipped. */
export function materialesDePaso<M extends { id: string }>(
  sa: WithMateriales<M>,
  paso: { materiales: string[] },
): M[] {
  return paso.materiales.flatMap((id) => sa.materiales.filter((m) => m.id === id));
}

/** Materials no step references. */
export function materialesSueltos<M extends { id: string }>(
  sa: WithMateriales<M> & { secuencia: { materiales: string[] }[] },
): M[] {
  const used = new Set(sa.secuencia.flatMap((p) => p.materiales));
  return sa.materiales.filter((m) => !used.has(m.id));
}

type GuiaLike = {
  id: string;
  data: { asignatura: string; material: string; tipo: string; lang: string; estado: string };
};

/** Published guías of one material: ES entries swapped to CA, guia before solucionario. */
export function selectGuias<T extends GuiaLike>(
  all: T[],
  asignatura: string,
  materialId: string,
  locale: Locale,
): T[] {
  const published = all.filter((e) => e.data.estado === 'publicado');
  const ca = new Map(published.filter((e) => e.data.lang === 'ca').map((e) => [e.id, e]));
  return published
    .filter((e) => e.data.lang === 'es' && e.data.asignatura === asignatura && e.data.material === materialId)
    .sort((a, b) => Number(a.data.tipo === 'solucionario') - Number(b.data.tipo === 'solucionario'))
    .map((e) => pickLocalizedEntry(e, ca, locale));
}

/** Identifiers that must never appear in published situaciones files. */
export const FORBIDDEN: readonly string[] = forbidden.strings;

const NEVER_PUBLISHED = forbidden.filePatterns.map((p) => new RegExp(p, 'i'));

/** Forbidden strings found in `text` (case-insensitive). */
export function findForbidden(text: string): string[] {
  const t = text.normalize('NFC').toLowerCase();
  return FORBIDDEN.filter((s) => t.includes(s.toLowerCase()));
}

/** True when a file name/path matches a never-published pattern. */
export function isNeverPublished(fileName: string): boolean {
  return NEVER_PUBLISHED.some((r) => r.test(fileName));
}
