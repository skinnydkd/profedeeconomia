/**
 * Prefix a page's own internal links with the locale segment on the localized
 * half of the site.
 *
 * Why this exists: Astro's i18n fallback rewrite re-renders every page under
 * /ca/* from the same .astro file, but a link written as `/eco-1bach/` is a
 * literal — it resolves to the Spanish page whichever half rendered it. The
 * whole Valencian edition was therefore one click deep: every link took the
 * reader straight back to Spanish. `localizePath` exists in src/i18n/locale.ts
 * and is tested, but the 235 hrefs in src/pages and src/components were built
 * by hand, and 54 more live inside the MDX book content, where no template
 * helper can reach them.
 *
 * Doing it over the emitted HTML fixes the templates and the book prose in one
 * place, and keeps working for pages and content added later — the failure
 * mode of a call-site sweep is that link 236 forgets.
 *
 * What is deliberately left alone:
 *  - anything that is not an `<a href>`: `<link rel=canonical|alternate>`,
 *    `<meta>`, scripts and asset URLs are locale-less by design
 *  - an `<a>` carrying an explicit `hreflang`, which is a link whose target
 *    language was chosen on purpose — that is the language switcher, and
 *    prefixing it would make "ver en español" point back at Valencian
 *  - paths already under the prefix, which makes the pass idempotent
 *  - files: anything with an extension in its last segment. /downloads/*.pdf
 *    are single real files and the Valencian ones already carry `.ca` in the
 *    filename, so a /ca/ prefix would 404
 *  - /api/* endpoints and /_astro/* assets, which have no localized twin
 *  - /oposiciones, a 301 to another domain resolved at the edge by vercel.json
 *
 * Kept as pure functions over the HTML string so they can be tested without a
 * build; astro.config.mjs walks the files and writes the result back, and
 * src/middleware.ts runs the same pass in `astro dev`, where no build hook fires.
 */

/** Paths with no localized twin, matched as prefixes. */
const SKIP_PREFIXES = ['/api/', '/_astro/', '/_image'];

/** Paths with no localized twin, matched whole. */
const SKIP_EXACT = new Set(['/oposiciones', '/oposiciones/']);

/**
 * Should this href get the locale prefix?
 *
 * @param {string} href    the attribute value as authored
 * @param {string} prefix  locale path segment, e.g. 'ca'
 * @returns {boolean}
 */
export function shouldLocalize(href, prefix) {
  // Same-origin absolute paths only: leaves `#anchor`, `?query`, `mailto:`,
  // `tel:`, `https://…` and protocol-relative `//host/…` untouched.
  if (!href.startsWith('/') || href.startsWith('//')) return false;

  const path = href.split(/[?#]/)[0];
  if (path === `/${prefix}` || path.startsWith(`/${prefix}/`)) return false;
  if (SKIP_EXACT.has(path)) return false;
  if (SKIP_PREFIXES.some((p) => path.startsWith(p))) return false;

  // A last segment with a dot is a file, not a page.
  const last = path.split('/').filter(Boolean).pop();
  if (last?.includes('.')) return false;

  return true;
}

/**
 * The same link on the localized half of the site, query and fragment intact.
 *
 * @param {string} href
 * @param {string} prefix
 * @returns {string}
 */
export function localizeHref(href, prefix) {
  return shouldLocalize(href, prefix) ? `/${prefix}${href}` : href;
}

// Opening <a> tag, tolerant of `>` inside quoted attribute values.
const A_TAG = /<a\b(?:"[^"]*"|'[^']*'|[^>"'])*>/gi;
// `href` as its own attribute — the leading space stops it matching `data-href`.
const HREF_ATTR = /(\shref\s*=\s*)(?:"([^"]*)"|'([^']*)')/i;
const HAS_HREFLANG = /\shreflang\s*=/i;

/**
 * Rewrite every internal `<a href>` in a rendered page.
 *
 * @param {string} html
 * @param {object} [opts]
 * @param {string} [opts.prefix]  locale path segment, defaults to 'ca'
 * @returns {{ html: string, changed: number }}
 */
export function localizeHtmlLinks(html, { prefix = 'ca' } = {}) {
  let changed = 0;

  const out = html.replace(A_TAG, (tag) => {
    if (HAS_HREFLANG.test(tag)) return tag;

    return tag.replace(HREF_ATTR, (match, lead, doubleQuoted, singleQuoted) => {
      const raw = doubleQuoted !== undefined ? doubleQuoted : singleQuoted;
      const next = localizeHref(raw, prefix);
      if (next === raw) return match;
      changed += 1;
      const quote = doubleQuoted !== undefined ? '"' : "'";
      return `${lead}${quote}${next}${quote}`;
    });
  });

  return { html: out, changed };
}
