// src/i18n/debates-ca-parity.test.ts
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Every `nn-slug.ca.mdx` debate must (1) have an ES sibling, (2) declare
 * `lang: ca` + `estado: publicado`, (3) share `orden` with its ES sibling,
 * (4) carry a non-trivial body. `astro:content` is not importable from Vitest,
 * so files are read straight off disk because content collections are not available at test time.
 */
const ROOT = join('src', 'content', 'debates');
const fm = (text: string) => text.split('---')[1] ?? '';
const body = (text: string) => text.split(/^---$/m).slice(2).join('---');
const orden = (text: string) => (fm(text).match(/^orden:\s*(\d+)/m) ?? [])[1];

const caFiles = readdirSync(ROOT, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .flatMap((fam) =>
    readdirSync(join(ROOT, fam.name))
      .filter((f) => f.endsWith('.ca.mdx'))
      .map((f) => ({ familia: fam.name, file: f })),
  );

describe('debates CA sibling parity', () => {
  it('there is at least one CA debate', () => {
    expect(caFiles.length).toBeGreaterThan(0);
  });
  for (const { familia, file } of caFiles) {
    const caPath = join(ROOT, familia, file);
    const esPath = join(ROOT, familia, file.replace(/\.ca\.mdx$/, '.mdx'));
    const ca = readFileSync(caPath, 'utf8');
    it(`${familia}/${file} has an ES sibling with the same orden and is published CA prose`, () => {
      const es = readFileSync(esPath, 'utf8'); // throws if missing
      expect(fm(ca)).toMatch(/^lang:\s*ca\s*$/m);
      expect(fm(ca)).toMatch(/^estado:\s*publicado\s*$/m);
      expect(orden(ca)).toBeDefined();
      expect(orden(ca)).toBe(orden(es));
      expect(body(ca).trim().length).toBeGreaterThan(200);
      // slug override REQUIRED (Astro strips dots from ids → else silent ES fallback)
      const expectedSlug = `debates/${familia}/${file.replace(/\.mdx$/, '')}`;
      expect(fm(ca)).toContain(`slug: "${expectedSlug}"`);
    });
  }
});
