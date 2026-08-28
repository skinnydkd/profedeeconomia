import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

/**
 * Guard for the per-page `seoTitle` frontmatter override (docs/seo-estrategia-2026.md
 * §5.3). It exists to win the click, so it has to stay inside Google's display
 * budget and must not duplicate the brand — the templates render it with
 * `brandSuffix={false}`.
 *
 * `astro:content` is not importable from Vitest, so files are read off disk.
 */
const ROOT = 'src/content';
// Google renders ~600px of title; 60 characters is the usual safe proxy.
const MAX_TITLE_CHARS = 60;

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = join(dir, d.name);
    if (d.isDirectory()) return walk(p);
    return /\.(md|mdx)$/.test(d.name) ? [p] : [];
  });
}

const withSeoTitle = walk(ROOT)
  .map((p) => ({ path: p, text: readFileSync(p, 'utf8') }))
  .filter((f) => /^seoTitle:/m.test(f.text.split('---')[1] ?? ''))
  .map((f) => ({
    rel: relative(ROOT, f.path).split(sep).join('/'),
    seoTitle: (f.text.match(/^seoTitle:\s*"(.*)"\s*$/m) ?? [])[1] ?? '',
  }));

describe('content seoTitle overrides', () => {
  it('the pages targeted in §5.3 carry an override', () => {
    expect(withSeoTitle.length).toBeGreaterThanOrEqual(18);
  });

  for (const { rel, seoTitle } of withSeoTitle) {
    it(`${rel} has a usable seoTitle`, () => {
      expect(seoTitle.length).toBeGreaterThan(0);
      expect(seoTitle.length).toBeLessThanOrEqual(MAX_TITLE_CHARS);
      expect(seoTitle).not.toContain('profedeeconomia');
      // An override earns its keep by adding something the plain title lacks —
      // a concrete deliverable, a named law, a list of cases. A bare topic
      // would just be the title again.
      expect(seoTitle).toMatch(/[:(]/);
    });
  }

  it('every override has a sibling in the other language', () => {
    for (const { rel } of withSeoTitle) {
      const sibling = rel.includes('.ca.')
        ? rel.replace('.ca.', '.')
        : rel.replace(/\.(md|mdx)$/, '.ca.$1');
      expect(withSeoTitle.some((f) => f.rel === sibling)).toBe(true);
    }
  });
});
