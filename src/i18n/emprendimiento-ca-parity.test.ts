import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Every emprendimiento `slug.ca.mdx` sibling (actividades, ejemplos, proyecto)
 * must (1) have an ES sibling, (2) declare `lang: ca` + `estado: publicado`,
 * (3) share its ordering key with the ES sibling (`orden` for actividades and
 * ejemplos, `fase` for proyecto), (4) carry the `slug:` override (Astro strips
 * dots from glob-loader ids → without it /ca silently serves ES). Bodies are
 * only checked where content lives in the body: ejemplos render entirely from
 * frontmatter, so a short body is expected there. Files are read straight off
 * disk because `astro:content` is not importable from Vitest.
 */
const ROOT = join('src', 'content', 'emprendimiento');
const SUBDIRS = ['actividades', 'ejemplos', 'proyecto'] as const;
const fm = (text: string) => text.split('---')[1] ?? '';
const body = (text: string) => text.split(/^---$/m).slice(2).join('---');
const num = (text: string, key: string) =>
  (fm(text).match(new RegExp(`^${key}:\\s*(\\d+)`, 'm')) ?? [])[1];

const caFiles = SUBDIRS.flatMap((sub) =>
  readdirSync(join(ROOT, sub))
    .filter((f) => f.endsWith('.ca.mdx'))
    .map((f) => ({ sub, file: f })),
);

describe('emprendimiento CA sibling parity', () => {
  it('all 33 CA emprendimiento siblings are present', () => {
    expect(caFiles.length).toBe(33);
  });
  for (const { sub, file } of caFiles) {
    const caPath = join(ROOT, sub, file);
    const esPath = join(ROOT, sub, file.replace(/\.ca\.mdx$/, '.mdx'));
    const ca = readFileSync(caPath, 'utf8');
    const orderKey = sub === 'proyecto' ? 'fase' : 'orden';
    it(`${sub}/${file} mirrors its published ES sibling`, () => {
      const es = readFileSync(esPath, 'utf8'); // throws if missing
      expect(fm(ca)).toMatch(/^lang:\s*ca\s*$/m);
      expect(fm(ca)).toMatch(/^estado:\s*publicado\s*$/m);
      expect(num(ca, orderKey)).toBeDefined();
      expect(num(ca, orderKey)).toBe(num(es, orderKey));
      const expectedSlug = `emprendimiento/${sub}/${file.replace(/\.mdx$/, '')}`;
      expect(fm(ca)).toContain(`slug: "${expectedSlug}"`);
      // Body-carried content (not ejemplos, which are frontmatter-only cards).
      if (sub !== 'ejemplos') {
        expect(body(ca).trim().length).toBeGreaterThan(200);
      }
    });
  }
});
