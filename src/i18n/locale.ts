export const LOCALES = ['es', 'ca'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'es';

/**
 * Active locale from Astro.currentLocale. Under fallbackType 'rewrite' Astro
 * updates currentLocale to 'ca' on rewritten /ca/* pages (but NOT Astro.url),
 * so this is the reliable source. Anything not 'ca' resolves to the default.
 */
export function getLocale(currentLocale: string | undefined): Locale {
  return currentLocale === 'ca' ? 'ca' : 'es';
}

/** Remove the `/ca` prefix; always returns a path starting with `/`. */
export function stripLocalePrefix(pathname: string): string {
  if (pathname === '/ca' || pathname === '/ca/') return '/';
  if (pathname.startsWith('/ca/')) return pathname.slice(3);
  return pathname;
}

/** Add the locale prefix to a locale-less path. */
export function localizePath(pathname: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return pathname;
  return pathname === '/' ? '/ca/' : `/ca${pathname}`;
}

/** Same page in the target locale, regardless of the input's current prefix. */
export function switchLocalePath(pathname: string, target: Locale): string {
  return localizePath(stripLocalePrefix(pathname), target);
}
