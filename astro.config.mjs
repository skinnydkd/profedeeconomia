import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.profedeeconomia.es',

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
    // Keep noindex routes (print editions and individual slide decks) out of the
    // sitemap so they aren't submitted for indexing. The /diapositivas/ index stays.
    sitemap({
      filter: (page) =>
        !page.includes('/imprimir/') &&
        !/\/diapositivas\/[^/]+\/$/.test(page),
    }),
  ],

  // i18n: at the MVP only Spanish is published. Catalan/Valencian is
  // architected (the content collections accept lang: 'es' | 'ca' and the
  // file structure is prepared) but locale routing is disabled to avoid
  // phantom /ca/* pages serving Spanish copy with the wrong <html lang>.
  // To activate CA later, restore: locales: ['es', 'ca'], fallback: { ca: 'es' }.
  i18n: {
    defaultLocale: 'es',
    locales: ['es'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
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
  },

  vite: {
    plugins: [tailwindcss()],
  },

  build: {
    inlineStylesheets: 'auto',
  },
});
