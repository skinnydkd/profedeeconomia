import type { Locale } from './locale';

/**
 * Pick the locale-appropriate collection entry. `caById` maps the CA sibling's
 * id ("<esId>.ca") to the CA entry and must be pre-filtered to published CA
 * entries. Under 'ca' returns the sibling when it exists, else the ES entry
 * (fallback). Under 'es' always returns the ES entry.
 */
export function pickLocalizedEntry<T extends { id: string }>(
  esEntry: T,
  caById: Map<string, T>,
  locale: Locale,
): T {
  if (locale !== 'ca') return esEntry;
  return caById.get(`${esEntry.id}.ca`) ?? esEntry;
}
