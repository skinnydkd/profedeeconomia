/**
 * SEO structured-data (JSON-LD) builders.
 *
 * Pages pass the returned objects to `<BaseLayout jsonLd={...}>`, which renders
 * each as a `<script type="application/ld+json">`. URLs are absolute against the
 * canonical site domain (kept in sync with `astro.config.mjs` `site`).
 */

export const SITE = {
  name: 'profedeeconomia',
  url: 'https://www.profedeeconomia.es',
  locale: 'es-ES',
  description:
    'Material editorial para profesores de instituto de economía, empresa y finanzas: libros, diapositivas, actividades, tests y recursos por asignatura.',
} as const;

/** Resolve a site-relative path to an absolute URL on the canonical domain. */
export const absUrl = (path: string): string => new URL(path, SITE.url).toString();

const orgRef = () => ({
  '@type': 'Organization',
  name: SITE.name,
  url: SITE.url,
  logo: { '@type': 'ImageObject', url: absUrl('/favicon.svg') },
});

/** schema.org Organization — emit once, on the home page. */
export function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.url,
    logo: absUrl('/favicon.svg'),
    description: SITE.description,
  };
}

/** schema.org WebSite — emit once, on the home page. */
export function websiteLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
    inLanguage: SITE.locale,
    publisher: orgRef(),
  };
}

/** schema.org BreadcrumbList from an ordered list of `{ name, path }`. */
export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absUrl(it.path),
    })),
  };
}

/**
 * Serialize a JSON-LD object to a string safe for inline `<script>` injection.
 * JSON.stringify does not escape `<`, so a title containing `</script>` could
 * break out of the script tag. We replace `<` with the Unicode escape `<`.
 */
export function jsonLdToString(obj: object): string {
  return JSON.stringify(obj).replace(/</g, '\\u003c');
}

/** schema.org Article for a long-form content page (e.g. a book unit). */
export function articleLd(opts: {
  title: string;
  description: string;
  path: string;
  datePublished?: string;
  section?: string;
}) {
  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    inLanguage: SITE.locale,
    mainEntityOfPage: absUrl(opts.path),
    author: orgRef(),
    publisher: orgRef(),
  };
  if (opts.datePublished) ld.datePublished = opts.datePublished;
  if (opts.section) ld.articleSection = opts.section;
  return ld;
}
