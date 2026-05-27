// src/middleware.ts
// Astro middleware global.
// Rate limit IP per a /api/jocs/start: 20 starts/hora.
// In-memory store (Vercel functions són efímeres però per al MVP serveix
// per a deflate burst attacks; per a multi-region/persistència real cal Redis/KV).

import { defineMiddleware } from 'astro:middleware';

const ipStartTimestamps = new Map<string, number[]>();
const HOUR_MS = 60 * 60 * 1000;
const MAX_STARTS_PER_HOUR = 20;

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.url.pathname === '/api/jocs/start' && context.request.method === 'POST') {
    const ip = context.clientAddress || 'unknown';
    const now = Date.now();
    const timestamps = ipStartTimestamps.get(ip) ?? [];
    const recent = timestamps.filter((t) => now - t < HOUR_MS);

    if (recent.length >= MAX_STARTS_PER_HOUR) {
      return new Response(JSON.stringify({ error: 'rate-limited' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    recent.push(now);
    ipStartTimestamps.set(ip, recent);
  }

  return next();
});
