import { type Locale, stripLocalePrefix, localizePath } from './locale';

type ContentLang = Locale;

export function resolveSeo(opts: {
  pathname: string;
  locale: Locale;
  contentLang: ContentLang;
  site: string;
}): {
  htmlLang: Locale;
  contentLangAttr: ContentLang | null;
  ogLocale: 'es_ES' | 'ca_ES';
  canonical: string;
  alternates: { hreflang: string; href: string }[];
} {
  const { pathname, locale, contentLang, site } = opts;
  const base = stripLocalePrefix(pathname); // locale-less path
  const abs = (p: string) => new URL(p, site).toString();
  const esUrl = abs(localizePath(base, 'es'));
  const caUrl = abs(localizePath(base, 'ca'));
  const selfUrl = locale === 'ca' ? caUrl : esUrl;

  return {
    htmlLang: locale,
    contentLangAttr: contentLang === locale ? null : contentLang,
    ogLocale: locale === 'ca' ? 'ca_ES' : 'es_ES',
    canonical: contentLang === locale ? selfUrl : esUrl,
    alternates: [
      { hreflang: 'es', href: esUrl },
      { hreflang: 'ca', href: caUrl },
      { hreflang: 'x-default', href: esUrl },
    ],
  };
}
