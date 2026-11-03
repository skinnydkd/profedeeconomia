import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * CODE-SRV-16: the print pages loaded paged.js from unpkg without a version or
 * integrity hash, so a new release or a compromised package would have run on
 * this origin (next to the Business Game tokens in localStorage), and the
 * interview sheet sent every visitor's IP to unpkg on load. The polyfill is now
 * served from /vendor/, pinned to the version pagedjs-cli prints the PDFs with,
 * and only loaded for the in-browser preview (?preview=1).
 */
const VERSION = JSON.parse(readFileSync('node_modules/pagedjs/package.json', 'utf8')).version as string;

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return walk(path);
    return /\.(astro|tsx?|mjs)$/.test(name) && !/\.test\.ts$/.test(name) ? [path] : [];
  });
}

const fuentes = walk('src').map((path) => ({ path, src: readFileSync(path, 'utf8') }));
const conPolyfill = fuentes.filter(({ src }) => src.includes('paged.polyfill'));

describe('paged.js polyfill', () => {
  it('finds the print pages that use it', () => {
    expect(conPolyfill.length).toBeGreaterThanOrEqual(7);
  });

  it('is never loaded from a third-party origin', () => {
    const externos = fuentes.filter(({ src }) => /https?:\/\/(unpkg\.com|cdn\.jsdelivr\.net)\/pagedjs/.test(src));
    expect(externos.map(({ path }) => path)).toEqual([]);
  });

  it('points every page at the vendored copy of the version pagedjs-cli uses', () => {
    const ruta = `/vendor/pagedjs@${VERSION}/paged.polyfill.min.js`;
    expect(existsSync(join('public', ruta))).toBe(true);
    for (const { path, src } of conPolyfill) {
      const usadas = [...src.matchAll(/['"](\/vendor\/pagedjs@[^'"]+)['"]/g)].map((m) => m[1]);
      expect(usadas, path).toEqual([ruta]);
    }
  });

  it('is only loaded for the in-browser preview, never on a plain visit', () => {
    for (const { path, src } of conPolyfill) {
      expect(src, path).not.toMatch(/<script[^>]*src=["'][^"']*paged\.polyfill/);
      expect(src, path).toContain("has('preview')");
    }
  });
});
