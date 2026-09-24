import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import { readdirSync, readFileSync, existsSync, writeFileSync } from 'node:fs';
import matter from 'gray-matter';
import { mirrorSitemapLocale, isIndexableHtml } from './scripts/sitemap-i18n.mjs';
import { localizeHtmlLinks } from './scripts/localize-links.mjs';
import stripDeckBlocks from './src/lib/remark/strip-deck-blocks.mjs';

/** Canonical origin. Kept in sync with SITE.url in src/lib/seo.ts. */
const SITE_URL = 'https://www.profedeeconomia.es';

// Build a map of book-unit URL path → ISO date for the sitemap's <lastmod>.
// Derived from the libro MDX frontmatter (actualizado_en, falling back to
// publicado_en) so the freshness signal is honest; only published units with a
// date get a lastmod, everything else is left out (no fake build-time dates).
function buildLibroLastmod() {
  const map = new Map();
  const base = './src/content/asignaturas';
  if (!existsSync(base)) return map;
  for (const slug of readdirSync(base)) {
    const dir = `${base}/${slug}/libro`;
    if (!existsSync(dir)) continue;
    for (const file of readdirSync(dir)) {
      if (!/\.mdx?$/.test(file)) continue;
      const { data } = matter(readFileSync(`${dir}/${file}`, 'utf8'));
      if (data.estado !== 'publicado') continue;
      const d = data.actualizado_en ?? data.publicado_en;
      if (!d) continue;
      map.set(`/${slug}/libro/${file.replace(/\.mdx?$/, '')}/`, new Date(d).toISOString());
    }
  }
  return map;
}
const LIBRO_LASTMOD = buildLibroLastmod();

// https://astro.build/config

// Decides whether the sitemap may offer a built page: only one that is
// self-canonical and does not carry robots noindex. A page that points its
// canonical elsewhere (the consolidated toolbox duplicates of §5.6) or that
// asks not to be indexed is one Google will never index, so submitting it just
// parks it in Search Console's non-indexed count. Read from the page's own
// <head> rather than from a list kept in step with it by hand. Fails safe: a
// page we cannot read counts as indexable, so a surprise here can never
// silently shrink the sitemap. See docs/seo-estrategia-2026.md §5.9.
function pageIsIndexable(dir, site) {
  const cache = new Map();
  return (path) => {
    const cached = cache.get(path);
    if (cached !== undefined) return cached;
    let verdict = true;
    try {
      const html = readFileSync(new URL(`.${path}index.html`, dir), 'utf8');
      verdict = isIndexableHtml(html, new URL(path, site).toString());
    } catch {
      // Unreadable page: leave the entry in and let the integration's own
      // filter be the judge.
    }
    cache.set(path, verdict);
    return verdict;
  };
}

// Adds the /ca/ half of the sitemap and the hreflang alternates, and removes
// the entries no sitemap should carry. The logic lives in
// scripts/sitemap-i18n.mjs so it can be unit-tested; this hook only supplies
// the real filesystem checks and writes the result back.
// See docs/seo-estrategia-2026.md §5.8 and §5.9.
function sitemapI18nAlternates({ site, localePrefix = 'ca' }) {
  return {
    name: 'sitemap-i18n-alternates',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const files = readdirSync(dir).filter((f) => /^sitemap-\d+\.xml$/.test(f));
        if (files.length === 0) {
          logger.warn('no sitemap-N.xml found — nothing to mirror');
          return;
        }
        const exists = (p) => existsSync(new URL(`.${p}index.html`, dir));
        const indexable = pageIsIndexable(dir, site);
        for (const file of files) {
          const target = new URL(file, dir);
          const { xml, mirrored, dropped } = mirrorSitemapLocale(readFileSync(target, 'utf8'), {
            site,
            localePrefix,
            exists,
            indexable,
          });
          writeFileSync(target, xml);
          logger.info(
            `${file}: mirrored ${mirrored} URLs into /${localePrefix}/ with hreflang alternates, ` +
              `dropped ${dropped} that canonicalise elsewhere or are noindex`
          );
        }
      },
    },
  };
}

// Gives the /ca/ half of the site its own internal links. Astro's fallback
// rewrite re-renders each page under /ca/*, but an href written as
// `/eco-1bach/` is a literal and resolves to the Spanish page from both
// halves, so every link dropped the reader out of Valencian on the first
// click. Rewriting the emitted HTML covers the page templates and the MDX book
// prose at once, and keeps holding for pages added later. The decisions about
// which hrefs to touch live in scripts/localize-links.mjs so they can be
// unit-tested without a build; this hook only walks the files.
function localizeCaLinks({ localePrefix = 'ca' } = {}) {
  return {
    name: 'localize-ca-links',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const root = new URL(`${localePrefix}/`, dir);
        if (!existsSync(root)) {
          logger.warn(`no /${localePrefix}/ pages found — nothing to localize`);
          return;
        }
        let pages = 0;
        let links = 0;
        for (const name of readdirSync(root, { recursive: true })) {
          if (!name.endsWith('.html')) continue;
          const file = new URL(name, root);
          const { html, changed } = localizeHtmlLinks(readFileSync(file, 'utf8'), {
            prefix: localePrefix,
          });
          if (changed === 0) continue;
          writeFileSync(file, html);
          pages += 1;
          links += changed;
        }
        logger.info(`prefixed ${links} internal links across ${pages} /${localePrefix}/ pages`);
      },
    },
  };
}

export default defineConfig({
  site: SITE_URL,

  // Fenced code blocks in this project hold economic formulas and fillable
  // plantillas, not source code. Shiki's default github-dark theme paints them
  // with an opaque dark background, which renders as black bars in the print
  // PDFs (dark bg + the print templates' dark ink = invisible formulas).
  // Disable syntax highlighting so code blocks are plain <pre><code>, styled
  // by each context's own CSS.
  markdown: {
    syntaxHighlight: false,
    // ```deck fences are slide-authoring data for the deck builder, not book
    // content — strip them from every rendered page (see lib/slides/authored.ts).
    remarkPlugins: [stripDeckBlocks],
  },

  // Hybrid output: most pages are static-prerendered (default), only routes
  // that opt out via `export const prerender = false` run as Vercel serverless
  // functions. The Jocs Econòmics API routes (/api/jocs/*) need this so they
  // can access Supabase at runtime.
  output: 'static',
  adapter: vercel({
    // Inject Vercel Web Analytics (/_vercel/insights). Enable it also in the
    // Vercel dashboard (Project → Analytics) for data to start flowing.
    webAnalytics: { enabled: true },
  }),

  integrations: [
    preact({ compat: false }),
    mdx(),
    // Runs before the sitemap integrations so they inspect the pages as
    // shipped: `astro:build:done` hooks fire in the order listed here.
    localizeCaLinks(),
    // Keep noindex routes (print editions, individual slide decks, and the
    // deprecated /tests/ index hubs) out of the sitemap so they aren't submitted
    // for indexing. The /diapositivas/ index and individual /tests/[slug]/ stay.
    sitemap({
      filter: (page) =>
        !page.includes('/imprimir/') &&
        !/\/diapositivas\/[^/]+\/$/.test(page) &&
        // /[asignatura]/tests/ index is noindex (the tests hub moved to
        // /actividades-dinamicas/). Individual tests /tests/[slug]/ stay indexable.
        !/\/tests\/$/.test(page),
      // Add <lastmod> to book-unit URLs from their MDX dates (see above).
      serialize(item) {
        const lastmod = LIBRO_LASTMOD.get(new URL(item.url).pathname);
        if (lastmod) item.lastmod = lastmod;
        return item;
      },
    }),
    sitemapI18nAlternates({ site: SITE_URL }),
  ],

  // i18n: Spanish is the default (root URLs); Valencian lives under /ca/*.
  // fallbackType 'rewrite' re-renders each page at its /ca/* URL so the shared
  // .astro picks CA copy by URL locale, while untranslated content falls back
  // to Spanish in place. See src/i18n/locale.ts (getLocale) for the resolver.
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'ca'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
      fallbackType: 'rewrite',
    },
    fallback: { ca: 'es' },
  },

  // /oposiciones → https://oposicioneseconomia.es/ as a 301 is handled by
  // vercel.json at the edge layer (real 301, not a meta-refresh), so no
  // Astro-level redirect is needed.

  // /[asignatura]/tests → /[asignatura]/actividades-dinamicas/ (301)
  // The old /tests hub is replaced by the unified /actividades-dinamicas/ hub.
  redirects: {
    '/edmn-2bach/tests':     '/edmn-2bach/actividades-dinamicas/',
    '/eco-1bach/tests':      '/eco-1bach/actividades-dinamicas/',
    '/eco-4eso/tests':       '/eco-4eso/actividades-dinamicas/',
    '/fopp-4eso/tests':      '/fopp-4eso/actividades-dinamicas/',
    '/taller-eco-3eso/tests':'/taller-eco-3eso/actividades-dinamicas/',
    '/ipe1-fp/tests':        '/ipe1-fp/actividades-dinamicas/',
    '/ipe2-fp/tests':        '/ipe2-fp/actividades-dinamicas/',
    '/eeae-bach/tests':      '/eeae-bach/actividades-dinamicas/',
    '/gpe-bach/tests':       '/gpe-bach/actividades-dinamicas/',
    '/cjd-bach/tests':       '/cjd-bach/actividades-dinamicas/',
  },

  vite: {
    plugins: [tailwindcss()],
  },

  build: {
    inlineStylesheets: 'auto',
  },
});
