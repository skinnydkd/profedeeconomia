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
  /**
   * False when the page has no Valencian edition: its /ca/ copy is the
   * Spanish page again and canonicalises to it, so the Spanish page must not
   * name it as the `ca` alternate either. Defaults to true.
   */
  translated?: boolean;
}): {
  htmlLang: Locale;
  contentLangAttr: ContentLang | null;
  ogLocale: 'es_ES' | 'ca_ES';
  canonical: string;
  alternates: { hreflang: string; href: string }[];
  /** True for the error page, which no search engine should index. */
  noindex: boolean;
} {
  const { pathname, locale, contentLang, site, canonicalPath, translated = true } = opts;
  const base = stripLocalePrefix(pathname); // locale-less path
  const abs = (p: string) => new URL(p, site).toString();
  const esUrl = abs(localizePath(base, 'es'));
  const caUrl = abs(localizePath(base, 'ca'));
  const selfUrl = locale === 'ca' ? caUrl : esUrl;
  // The i18n fallback builds /ca/404/ as an ordinary page that answers 200, so
  // the error page has to ask not to be indexed, and is nobody's alternate.
  const errorPage = /^\/404(\/|\.html)?$/.test(base);

  return {
    htmlLang: locale,
    contentLangAttr: contentLang === locale ? null : contentLang,
    ogLocale: locale === 'ca' ? 'ca_ES' : 'es_ES',
    canonical: canonicalPath
      ? abs(localizePath(canonicalPath, contentLang === locale ? locale : 'es'))
      : contentLang === locale
        ? selfUrl
        : esUrl,
    // hreflang only on self-canonical pages that exist in both languages: not
    // on a consolidated duplicate, not on a /ca/ copy that shows the Spanish
    // text (it canonicalises to the Spanish page), and not on a Spanish page
    // whose /ca/ copy is such a fallback.
    alternates: errorPage || canonicalPath || contentLang !== locale || !translated
      ? []
      : [
          { hreflang: 'es', href: esUrl },
          { hreflang: 'ca', href: caUrl },
          { hreflang: 'x-default', href: esUrl },
        ],
    noindex: errorPage,
  };
}
