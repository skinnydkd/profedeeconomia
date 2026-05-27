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
  adapter: vercel(),

  integrations: [
    preact({ compat: false }),
    mdx(),
    sitemap(),
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

  vite: {
    plugins: [tailwindcss()],
  },

  build: {
    inlineStylesheets: 'auto',
  },
});
