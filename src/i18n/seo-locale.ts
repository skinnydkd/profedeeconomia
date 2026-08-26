import { type Locale, stripLocalePrefix, localizePath } from './locale';

type ContentLang = Locale;

export function resolveSeo(opts: {
  pathname: string;
  locale: Locale;
  contentLang: ContentLang;
  site: string;
  /**
   * Locale-less path of a *different* page this one is a duplicate of. When
   * set, the canonical points there instead of at self, and the hreflang
   * alternates are dropped: hreflang must only be declared by self-canonical
   * pages, so leaving them on a consolidated duplicate would contradict the
   * canonical. See docs/seo-estrategia-2026.md §5.6.
   */
  canonicalPath?: string;
}): {
  htmlLang: Locale;
  contentLangAttr: ContentLang | null;
  ogLocale: 'es_ES' | 'ca_ES';
  canonical: string;
  alternates: { hreflang: string; href: string }[];
} {
  const { pathname, locale, contentLang, site, canonicalPath } = opts;
  const base = stripLocalePrefix(pathname); // locale-less path
  const abs = (p: string) => new URL(p, site).toString();
  const esUrl = abs(localizePath(base, 'es'));
  const caUrl = abs(localizePath(base, 'ca'));
  const selfUrl = locale === 'ca' ? caUrl : esUrl;

  return {
    htmlLang: locale,
    contentLangAttr: contentLang === locale ? null : contentLang,
    ogLocale: locale === 'ca' ? 'ca_ES' : 'es_ES',
    canonical: canonicalPath
      ? abs(localizePath(canonicalPath, contentLang === locale ? locale : 'es'))
      : contentLang === locale
        ? selfUrl
        : esUrl,
    alternates: canonicalPath
      ? []
      : [
          { hreflang: 'es', href: esUrl },
          { hreflang: 'ca', href: caUrl },
          { hreflang: 'x-default', href: esUrl },
        ],
  };
}
