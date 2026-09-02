import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

/**
 * Guard for the `<RecursoDestacado>` cross-links embedded in unit bodies.
 *
 * Two things go wrong easily here and neither shows up in a build:
 *  - a slug typo silently ships a card that 404s;
 *  - a Catalan unit hardcodes the Spanish path and drops the reader out of
 *    the locale. The component localises internal hrefs itself
 *    (src/components/libro/RecursoDestacado.astro), so content must keep the
 *    paths locale-less and let it do the prefixing.
 *
 * `astro:content` is not importable from Vitest, so files are read off disk and
 * each target is resolved back to the content entry that renders it.
 */
const ROOT = 'src/content';

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = join(dir, d.name);
    if (d.isDirectory()) return walk(p);
    return /\.mdx?$/.test(d.name) ? [p] : [];
  });
}

interface Link {
  rel: string;
  href: string;
}

const links: Link[] = walk(ROOT).flatMap((path) => {
  const rel = relative(ROOT, path).split(sep).join('/');
  const text = readFileSync(path, 'utf8');
  return [...text.matchAll(/<RecursoDestacado[^>]*\shref="([^"]+)"/g)].map((m) => ({
    rel,
    href: m[1],
  }));
});

/** Content path that backs a site route, e.g. /debates/fam/slug/ → debates/fam/slug. */
function entryFor(href: string): string | null {
  const parts = href.replace(/^\/|\/$/g, '').split('/');
  if (parts.length !== 3) return null;
  return parts.join('/');
}

describe('RecursoDestacado cross-links', () => {
  it('finds cards to check', () => {
    expect(links.length).toBeGreaterThan(0);
  });

  it('never hardcodes a locale prefix', () => {
    const prefixed = links.filter((l) => l.href.startsWith('/ca/'));
    expect(
      prefixed.map((l) => `${l.rel}: ${l.href}`),
      'the component localises internal hrefs; keep content paths locale-less',
    ).toEqual([]);
  });

  it('points at a content entry that exists', () => {
    const broken = links
      .filter((l) => l.href.startsWith('/'))
      .filter((l) => {
        const entry = entryFor(l.href);
        if (entry === null) return false; // hub or non-entry route, not checked here
        return !['mdx', 'md'].some((ext) => existsSync(join(ROOT, `${entry}.${ext}`)));
      });
    expect(broken.map((l) => `${l.rel}: ${l.href}`)).toEqual([]);
  });
});
