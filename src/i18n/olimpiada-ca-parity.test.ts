import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Every `nn-slug.ca.mdx` olimpiada ficha/texto must (1) have an ES sibling,
 * (2) declare `lang: ca` + `estado: publicado`, (3) share `orden` with its ES
 * sibling, (4) carry a non-trivial body, (5) carry the `slug:` override (Astro
 * strips dots from glob-loader ids → without it /ca silently serves ES). Files
 * are read straight off disk because `astro:content` is not importable from
 * Vitest. Covers both subtrees (fichas, textos).
 */
const ROOT = join('src', 'content', 'olimpiada');
const fm = (text: string) => text.split('---')[1] ?? '';
const body = (text: string) => text.split(/^---$/m).slice(2).join('---');
const orden = (text: string) => (fm(text).match(/^orden:\s*(\d+)/m) ?? [])[1];

const caFiles = readdirSync(ROOT, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .flatMap((sub) =>
    readdirSync(join(ROOT, sub.name))
      .filter((f) => f.endsWith('.ca.mdx'))
      .map((f) => ({ sub: sub.name, file: f })),
  );

describe('olimpiada CA sibling parity', () => {
  it('there is at least one CA olimpiada file', () => {
    expect(caFiles.length).toBeGreaterThan(0);
  });
  for (const { sub, file } of caFiles) {
    const caPath = join(ROOT, sub, file);
    const esPath = join(ROOT, sub, file.replace(/\.ca\.mdx$/, '.mdx'));
    const ca = readFileSync(caPath, 'utf8');
    it(`${sub}/${file} has an ES sibling with the same orden and is published CA prose`, () => {
      const es = readFileSync(esPath, 'utf8'); // throws if missing
      expect(fm(ca)).toMatch(/^lang:\s*ca\s*$/m);
      expect(fm(ca)).toMatch(/^estado:\s*publicado\s*$/m);
      expect(orden(ca)).toBeDefined();
      expect(orden(ca)).toBe(orden(es));
      expect(body(ca).trim().length).toBeGreaterThan(200);
      const expectedSlug = `olimpiada/${sub}/${file.replace(/\.mdx$/, '')}`;
      expect(fm(ca)).toContain(`slug: "${expectedSlug}"`);
    });
  }
});
