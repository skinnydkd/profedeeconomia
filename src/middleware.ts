// src/middleware.ts
// Astro middleware global.
// Burst limit per IP on /api/jocs/start (see lib/jocs-economics/server/rate-limit.ts):
// a class shares the centre's IP, so the limit only stops floods.

import { defineMiddleware } from 'astro:middleware';
import { localizeHtmlLinks } from '../scripts/localize-links.mjs';
import { permitirInicio } from './lib/jocs-economics/server/rate-limit';

const ipStartTimestamps = new Map<string, number[]>();

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.url.pathname === '/api/jocs/start' && context.request.method === 'POST') {
    const ip = context.clientAddress || 'unknown';
    if (!permitirInicio(ipStartTimestamps, ip, Date.now())) {
      return new Response(JSON.stringify({ error: 'rate-limited' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json', 'Retry-After': '60' },
      });
    }
  }

  // Give the /ca/ half its own internal links while developing. In a build the
  // astro.config.mjs hook does this over the emitted files; no such hook fires
  // under `astro dev`, so without this the Valencian pages would link back into
  // Spanish locally while being correct in production. Both call the same pass.
  //
  // Keyed on currentLocale rather than on the pathname: /ca/* is not a real
  // route, so a request for it runs this middleware once against the resulting
  // 404 and then again, after the i18n fallback rewrite, with the locale-less
  // path (/eco-1bach/) and currentLocale 'ca'. That second pass is the one
  // carrying the page, and the pathname no longer names the locale by then.
  if (import.meta.env.DEV && context.currentLocale === 'ca') {
    const response = await next();
    if (!response.headers.get('content-type')?.includes('text/html')) return response;

    const { html } = localizeHtmlLinks(await response.text(), { prefix: 'ca' });
    const headers = new Headers(response.headers);
    // The rewrite changes the body length, so a carried-over value would lie.
    headers.delete('content-length');
    return new Response(html, { status: response.status, headers });
  }

  return next();
});
