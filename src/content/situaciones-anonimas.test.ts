import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { findForbidden, isNeverPublished } from '@/lib/situaciones';

const ROOT = process.cwd();
const TEXT_EXT = /\.(mdx?|html?|json|txt|css|js|svg|csv|ya?ml|xml|tsv)$/i;

function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  );
}

const asigDir = join(ROOT, 'src/content/asignaturas');
const roots = [
  ...(existsSync(asigDir) ? readdirSync(asigDir) : []).map((a) => join(asigDir, a, 'situaciones')),
  join(ROOT, 'public/situaciones'),
  join(ROOT, 'public/downloads/situaciones'),
];
const files = roots.flatMap(walk);

describe('situaciones anonymity guard', () => {
  it('published files hold no school identifiers', () => {
    // PDFs are derived from the scanned HTML; binaries are skipped.
    const hits = files
      .filter((f) => TEXT_EXT.test(f))
      .map((f) => ({ f, found: findForbidden(readFileSync(f, 'utf8')) }))
      .filter((x) => x.found.length);
    expect(hits).toEqual([]);
  });

  it('no published file matches a never-published pattern', () => {
    expect(files.filter((f) => isNeverPublished(f))).toEqual([]);
  });

  it('findForbidden catches identifiers', () => {
    expect(findForbidden('Profesor del IES Ramón Cid')).toEqual(['Ramón Cid']);
    expect(findForbidden('texto limpio')).toEqual([]);
    expect(findForbidden('Treballem a les aules del centre')).toEqual([]);
    expect(findForbidden('https://aules.edu.gva.es')).toEqual(['aules.edu.gva']);
    expect(findForbidden('Ramón Cid')).toEqual(['Ramón Cid']);
  });

  it('isNeverPublished flags private artefacts', () => {
    for (const n of ['a-privat.html', 'x.mp4', 'y.docx', '_build.py', 'llibreta-3.csv', 'ud00-intro.html'])
      expect(isNeverPublished(n)).toBe(true);
    expect(isNeverPublished('ud01-cas-concorde.html')).toBe(false);
  });
});
