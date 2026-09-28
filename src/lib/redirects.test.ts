import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

/**
 * An Astro `redirects` entry on a path that a page also generates makes both
 * write the same index.html, and which one wins changes between /es and /ca.
 * That is how /ca/<asig>/tests/ ended up as a stub to the Castilian dynamics
 * hub while /<asig>/tests/ stayed a page. Redirects must live elsewhere.
 */

/** Keys of the `redirects` block in astro.config.mjs, read statically. */
function redirectKeys(): string[] {
  const config = readFileSync('astro.config.mjs', 'utf8');
  const block = config.match(/^\s*redirects\s*:\s*\{([\s\S]*?)\}/m);
  if (!block) return [];
  return [...block[1].matchAll(/['"](\/[^'"]*)['"]\s*:/g)].map((m) => m[1]);
}

/** One pattern per page file; dynamic segments match any single segment. */
function pageRoutes(dir = 'src/pages'): RegExp[] {
  const out: RegExp[] = [];
  const walk = (d: string) => {
    for (const name of readdirSync(d)) {
      const path = join(d, name);
      if (statSync(path).isDirectory()) {
        walk(path);
        continue;
      }
      if (!/\.(astro|md|mdx|ts)$/.test(name) || /\.test\.ts$/.test(name)) continue;
      const route = relative('src/pages', path)
        .replace(/\.(astro|md|mdx|ts)$/, '')
        .replace(/(^|\/)index$/, '')
        .split('/')
        .map((seg) =>
          seg.startsWith('[...') ? '.*' : seg.startsWith('[') ? '[^/]+' : seg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        )
        .join('/');
      out.push(new RegExp(`^/${route}${route ? '/?' : ''}$`));
    }
  };
  walk(dir);
  return out;
}

describe('astro redirects', () => {
  const routes = pageRoutes();

  it('the route walker sees the pages it has to protect', () => {
    expect(routes.some((r) => r.test('/edmn-2bach/tests/'))).toBe(true);
    expect(routes.some((r) => r.test('/eco-1bach/libro/01-economia-ciencia-social/'))).toBe(true);
  });

  it('no redirect sits on a path a page already generates', () => {
    for (const key of redirectKeys()) {
      const clash = routes.find((r) => r.test(key) || r.test(`${key}/`));
      expect(clash, `redirect ${key} collides with page route ${clash}`).toBeUndefined();
    }
  });
});
