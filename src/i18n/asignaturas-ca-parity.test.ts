// src/i18n/asignaturas-ca-parity.test.ts
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

/**
 * Structural guard for every Valencian sibling under src/content/asignaturas.
 * Each `<name>.ca.mdx` must (1) have an ES sibling `<name>.mdx`, (2) declare
 * `lang: ca` + `estado: publicado`, (3) carry the REQUIRED `slug:` override
 * (Astro's glob loader strips dots from ids → without it the CA id collides
 * with the ES entry and `pickLocalizedEntry` silently falls back to ES), and
 * (4) preserve the structural `asignatura` field verbatim from its ES sibling.
 *
 * `astro:content` is not importable from Vitest, so files are read off disk.
 */
const ROOT = join('src', 'content', 'asignaturas');
const fm = (text: string) => text.split('---')[1] ?? '';
const field = (text: string, key: string) =>
  (fm(text).match(new RegExp(`^${key}:\\s*(.+?)\\s*$`, 'm')) ?? [])[1];

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = join(dir, d.name);
    if (d.isDirectory()) return walk(p);
    return d.name.endsWith('.ca.mdx') ? [p] : [];
  });
}

const caFiles = walk(ROOT);

describe('asignaturas CA sibling parity', () => {
  it('there is at least one CA asignatura file', () => {
    expect(caFiles.length).toBeGreaterThan(0);
  });

  for (const caPath of caFiles) {
    const esPath = caPath.replace(/\.ca\.mdx$/, '.mdx');
    const rel = relative(ROOT, caPath).split(sep).join('/'); // posix id segment
    const expectedSlug = `asignaturas/${rel.replace(/\.mdx$/, '')}`;

    it(`${rel} is a published CA sibling of an ES file with the slug override`, () => {
      const ca = readFileSync(caPath, 'utf8');
      const es = readFileSync(esPath, 'utf8'); // throws if the ES sibling is missing

      expect(fm(ca)).toMatch(/^lang:\s*ca\s*$/m);
      expect(fm(ca)).toMatch(/^estado:\s*publicado\s*$/m);
      expect(fm(ca)).toContain(`slug: "${expectedSlug}"`);
      // Structural field must be identical between ES and CA.
      expect(field(ca, 'asignatura')).toBe(field(es, 'asignatura'));
      // The CA file must carry real content, not an empty stub.
      expect(ca.trim().length).toBeGreaterThan(200);
    });
  }
});
