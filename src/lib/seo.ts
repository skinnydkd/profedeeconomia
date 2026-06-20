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

/** Verified public profiles for the brand entity (schema.org `sameAs`).
 * Only list profiles that actually exist — a broken link is worse than none. */
export const SAME_AS = [
  'https://instagram.com/profedeeconomia',
  'https://oposicioneseconomia.es',
] as const;

/** Topics the organization is an authority on (schema.org `knowsAbout`). */
const KNOWS_ABOUT = [
  'Economía',
  'Empresa',
  'Finanzas',
  'Emprendimiento',
  'Currículo LOMLOE',
  'Bachillerato',
  'ESO',
  'Formación Profesional',
] as const;

/** Resolve a site-relative path to an absolute URL on the canonical domain. */
export const absUrl = (path: string): string => new URL(path, SITE.url).toString();

// ponytail: logo is the favicon SVG; a raster logo-512.png would also qualify
// for Google's logo rich result — swap in when a real raster asset exists.
const orgRef = () => ({
  '@type': 'Organization',
  name: SITE.name,
  url: SITE.url,
  logo: { '@type': 'ImageObject', url: absUrl('/favicon.svg') },
  sameAs: [...SAME_AS],
});

/** schema.org EducationalOrganization — emit once, on the home page. */
export function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: SITE.name,
    url: SITE.url,
    logo: { '@type': 'ImageObject', url: absUrl('/favicon.svg') },
    description: SITE.description,
    inLanguage: SITE.locale,
    knowsAbout: [...KNOWS_ABOUT],
    sameAs: [...SAME_AS],
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

/**
 * schema.org Article + LearningResource for a long-form educational page
 * (e.g. a book unit). The dual type tells AI/search what the page teaches and
 * to whom — exactly the metadata that gets a page cited as a learning source.
 */
export function articleLd(opts: {
  title: string;
  description: string;
  path: string;
  datePublished?: string;
  /** Last meaningful content edit; falls back to datePublished when absent. */
  dateModified?: string;
  section?: string;
  /** Absolute or site-relative image URL (e.g. the per-asignatura OG image). */
  image?: string;
  /** Educational stage, e.g. "2.º Bachillerato". */
  educationalLevel?: string;
  /** Key concepts the unit teaches (schema.org `teaches`). */
  teaches?: string[];
}) {
  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': ['Article', 'LearningResource'],
    headline: opts.title,
    description: opts.description,
    inLanguage: SITE.locale,
    mainEntityOfPage: absUrl(opts.path),
    isAccessibleForFree: true,
    learningResourceType: 'Unidad didáctica',
    author: orgRef(),
    publisher: orgRef(),
  };
  if (opts.image) ld.image = absUrl(opts.image);
  if (opts.datePublished) ld.datePublished = opts.datePublished;
  if (opts.dateModified ?? opts.datePublished)
    ld.dateModified = opts.dateModified ?? opts.datePublished;
  if (opts.section) ld.articleSection = opts.section;
  if (opts.educationalLevel) ld.educationalLevel = opts.educationalLevel;
  if (opts.teaches && opts.teaches.length) ld.teaches = opts.teaches;
  return ld;
}

/**
 * schema.org Course for an asignatura hub. Each of the 9 subjects is a course;
 * `educationalAlignment` to the LOMLOE Real Decreto is a differentiator almost
 * no Spanish education site emits.
 */
export function courseLd(opts: {
  name: string;
  description: string;
  path: string;
  educationalLevel: string;
  /** LOMLOE framework reference, e.g. "Real Decreto 243/2022". */
  marcoNormativo: string;
  /** Target curriculum name, e.g. "Empresa y Diseño de Modelos de Negocio, 2.º Bachillerato". */
  targetName: string;
  teaches?: string[];
}) {
  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: opts.name,
    description: opts.description,
    url: absUrl(opts.path),
    inLanguage: SITE.locale,
    isAccessibleForFree: true,
    educationalLevel: opts.educationalLevel,
    provider: {
      '@type': 'EducationalOrganization',
      name: SITE.name,
      url: SITE.url,
    },
    educationalAlignment: {
      '@type': 'AlignmentObject',
      alignmentType: 'educationalSubject',
      educationalFramework: `LOMLOE — ${opts.marcoNormativo}`,
      targetName: opts.targetName,
    },
  };
  if (opts.teaches && opts.teaches.length) ld.teaches = opts.teaches;
  return ld;
}

/** schema.org ItemList from an ordered list of `{ name, path }` (e.g. a TOC). */
export function itemListLd(opts: { name: string; items: { name: string; path: string }[] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: opts.name,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: opts.items.length,
    itemListElement: opts.items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      url: absUrl(it.path),
    })),
  };
}
