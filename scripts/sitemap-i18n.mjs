/**
 * Mirror a sitemap's default-locale URLs into their localized twins and give
 * every pair its hreflang alternates.
 *
 * Why this exists: Astro's i18n fallback rewrite emits /ca/* pages without
 * registering them as routes, so @astrojs/sitemap never sees them — 839 of the
 * site's 1,678 indexable pages were missing, and no URL declared an hreflang
 * alternate. Declaring `i18n` on the integration does not help: it can only
 * annotate pages it already discovered.
 *
 * Kept as a pure function over the XML string so it can be tested without a
 * build; astro.config.mjs supplies the real `exists` (a filesystem check) so a
 * twin is only ever added when that page was actually written to disk.
 * See docs/seo-estrategia-2026.md §5.8.
 */

export const XHTML_NS = 'http://www.w3.org/1999/xhtml';

/**
 * @param {string} xml            the emitted sitemap-N.xml
 * @param {object} opts
 * @param {string} opts.site      canonical origin, e.g. https://www.profedeeconomia.es
 * @param {string} opts.localePrefix   path segment of the secondary locale ('ca')
 * @param {(path: string) => boolean} opts.exists  was this path actually built?
 * @returns {{ xml: string, mirrored: number }}
 */
export function mirrorSitemapLocale(xml, { site, localePrefix, exists }) {
  const blocks = xml.match(/<url>[\s\S]*?<\/url>/g) ?? [];
  const out = [];
  let mirrored = 0;

  for (const block of blocks) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
    if (!loc) {
      out.push(block);
      continue;
    }
    // Already processed (a re-run over a written sitemap): the alternates are
    // there and its twin was emitted alongside it, so mirroring again would
    // duplicate the entry. Keeps the hook safe over a dirty dist/.
    if (block.includes('xhtml:link')) {
      out.push(block);
      continue;
    }
    const path = new URL(loc).pathname;
    // Never re-mirror a URL that is already in the secondary locale.
    if (path === `/${localePrefix}/` || path.startsWith(`/${localePrefix}/`)) {
      out.push(block);
      continue;
    }
    const twinPath = `/${localePrefix}${path}`;
    if (!exists(twinPath)) {
      out.push(block);
      continue;
    }

    const twinLoc = new URL(twinPath, site).toString();
    const alternates =
      `<xhtml:link rel="alternate" hreflang="es" href="${loc}"/>` +
      `<xhtml:link rel="alternate" hreflang="${localePrefix}" href="${twinLoc}"/>` +
      `<xhtml:link rel="alternate" hreflang="x-default" href="${loc}"/>`;

    // Both members of an hreflang set must list the whole set, itself included.
    out.push(block.replace('</url>', `${alternates}</url>`));
    out.push(
      block
        .replace(`<loc>${loc}</loc>`, `<loc>${twinLoc}</loc>`)
        .replace('</url>', `${alternates}</url>`)
    );
    mirrored++;
  }

  const next = xml.replace(
    /<urlset([^>]*)>[\s\S]*<\/urlset>/,
    (_m, attrs) =>
      `<urlset${attrs.includes('xmlns:xhtml') ? attrs : `${attrs} xmlns:xhtml="${XHTML_NS}"`}>` +
      `${out.join('')}</urlset>`
  );
  return { xml: next, mirrored };
}
