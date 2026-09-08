/**
 * Mirror a sitemap's default-locale URLs into their localized twins, give every
 * pair its hreflang alternates, and drop the entries that never belonged there.
 *
 * Why the mirroring exists: Astro's i18n fallback rewrite emits /ca/* pages
 * without registering them as routes, so @astrojs/sitemap never sees them — 839
 * of the site's 1,678 indexable pages were missing, and no URL declared an
 * hreflang alternate. Declaring `i18n` on the integration does not help: it can
 * only annotate pages it already discovered.
 *
 * Why the dropping exists: a sitemap is a list of pages you are asking Google to
 * index, so a page that points its canonical at a different URL, or carries
 * robots noindex, does not belong in one. Search Console files those under
 * "alternate page with proper canonical tag" and "excluded by noindex tag" for
 * as long as they are submitted, where they sit in the non-indexed count
 * forever. `indexable` answers that from the built page itself rather than from
 * a hand-kept list, so a page that starts or stops canonicalising elsewhere
 * corrects itself on the next build.
 *
 * Kept as a pure function over the XML string so it can be tested without a
 * build; astro.config.mjs supplies the real `exists` and `indexable` (both
 * filesystem reads) so a twin is only ever added when that page was actually
 * written to disk. See docs/seo-estrategia-2026.md §5.8 and §5.9.
 */

export const XHTML_NS = 'http://www.w3.org/1999/xhtml';

/**
 * Does a built page invite indexing — is it self-canonical and free of robots
 * noindex? Only the `<head>` is consulted, and only what contradicts the
 * submission counts: a page with no canonical at all is left alone.
 *
 * Pure over the HTML string so the parsing is testable without a build;
 * astro.config.mjs does the file reading, the caching and the fail-safe.
 *
 * @param {string} html  the page's rendered HTML
 * @param {string} url   the absolute URL the page was written for
 * @returns {boolean}
 */
export function isIndexableHtml(html, url) {
  const headEnd = html.indexOf('</head>');
  const head = headEnd === -1 ? html : html.slice(0, headEnd);
  if (/<meta[^>]+name="robots"[^>]*content="[^"]*noindex/i.test(head)) return false;
  const tag = head.match(/<link[^>]+rel="canonical"[^>]*>/i)?.[0];
  const canonical = tag?.match(/href="([^"]*)"/i)?.[1];
  return !canonical || canonical === url;
}

/**
 * @param {string} xml            the emitted sitemap-N.xml
 * @param {object} opts
 * @param {string} opts.site      canonical origin, e.g. https://www.profedeeconomia.es
 * @param {string} opts.localePrefix   path segment of the secondary locale ('ca')
 * @param {(path: string) => boolean} opts.exists  was this path actually built?
 * @param {(path: string) => boolean} [opts.indexable]  may we ask Google to index
 *   the page at this path — is it self-canonical and not noindex? Defaults to
 *   submitting everything, which is what the sitemap did before this check.
 * @returns {{ xml: string, mirrored: number, dropped: number }}
 */
export function mirrorSitemapLocale(xml, { site, localePrefix, exists, indexable = () => true }) {
  const blocks = xml.match(/<url>[\s\S]*?<\/url>/g) ?? [];
  const out = [];
  let mirrored = 0;
  let dropped = 0;

  for (const block of blocks) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
    if (!loc) {
      out.push(block);
      continue;
    }
    const path = new URL(loc).pathname;

    // Not a page we may ask for. Checked ahead of the already-processed
    // short-circuit below so a rerun over a written sitemap reaches the same
    // verdict as the first pass.
    if (!indexable(path)) {
      dropped++;
      continue;
    }

    // Already processed (a re-run over a written sitemap): the alternates are
    // there and its twin was emitted alongside it, so mirroring again would
    // duplicate the entry. Keeps the hook safe over a dirty dist/.
    if (block.includes('xhtml:link')) {
      out.push(block);
      continue;
    }
    // Never re-mirror a URL that is already in the secondary locale.
    if (path === `/${localePrefix}/` || path.startsWith(`/${localePrefix}/`)) {
      out.push(block);
      continue;
    }
    const twinPath = `/${localePrefix}${path}`;
    // The twin must exist on disk *and* be one we may submit: under the i18n
    // fallback rewrite an untranslated page is still written to /ca/, but it
    // canonicalises back to Spanish, so pairing them would contradict both that
    // canonical and the hreflang set it would join.
    if (!exists(twinPath) || !indexable(twinPath)) {
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
  return { xml: next, mirrored, dropped };
}
