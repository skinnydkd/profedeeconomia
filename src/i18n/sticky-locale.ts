import type { Locale } from './locale';

/**
 * Keep the chosen locale sticky across navigation. Under fallbackType 'rewrite'
 * every page is also served at /ca/*, but internal links are authored
 * locale-less (they point at the ES root). When the user is on a VAL page we
 * rewrite those hrefs on the client so clicking through stays under /ca.
 *
 * Server output keeps the clean ES hrefs (good for crawling; canonical/hreflang
 * are already emitted server-side), so this is pure progressive enhancement:
 * with JS off, navigation simply falls back to ES.
 */

/**
 * The /ca-prefixed href for a locale-less internal link, or `null` when the
 * link must be left untouched (default locale, external, already localized, an
 * external redirect, or a static asset like a PDF that has no /ca/* route).
 */
export function localizeHref(href: string, locale: Locale): string | null {
  if (locale !== 'ca') return null;
  if (!href.startsWith('/') || href.startsWith('//')) return null; // external / protocol-relative
  if (href === '/ca' || href.startsWith('/ca/')) return null; // already localized
  if (href === '/oposiciones' || href.startsWith('/oposiciones')) return null; // external 301
  const path = href.split(/[?#]/)[0]; // ignore query/hash for the asset check
  const last = path.split('/').pop() ?? '';
  if (last.includes('.')) return null; // static asset (e.g. /downloads/x.pdf), not a page route
  return href === '/' ? '/ca/' : `/ca${href}`;
}

/**
 * Rewrite every eligible internal link in the document to keep the VAL locale.
 * No-op unless <html lang="ca">. Skips the language switcher (it must be able to
 * point back to ES) and any rel="external" link.
 * ponytail: runs once on load; re-call on `astro:page-load` if View Transitions
 * are ever enabled.
 */
export function applyStickyLocale(doc: Document = document): void {
  const locale: Locale = doc.documentElement.lang === 'ca' ? 'ca' : 'es';
  if (locale !== 'ca') return;
  for (const a of doc.querySelectorAll<HTMLAnchorElement>('a[href^="/"]')) {
    if (a.closest('.lang-switch') || a.rel.includes('external')) continue;
    const next = localizeHref(a.getAttribute('href') ?? '', 'ca');
    if (next) a.setAttribute('href', next);
  }
}
