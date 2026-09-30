import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

/**
 * CODE-WEB-18: every published subject gets these section indexes, so CJD had
 * four «se publicarán próximamente» pages that were indexable and in the
 * sitemap (eight URLs with /ca/), and its hub linked «Actividades». An empty
 * index asks not to be indexed (the sitemap drops noindex pages by itself), and
 * the hub only shows a card whose section has something published.
 */
const DIR = 'src/pages/[asignatura]';
const VACIAS: [string, RegExp][] = [
  ['actividades/index.astro', /noindex=\{items\.length === 0\}/],
  ['refuerzo/index.astro', /noindex=\{grupos\.length === 0\}/],
  ['retos/index.astro', /noindex=\{retos\.length === 0\}/],
  ['evaluacion/index.astro', /noindex=\{!entry\}/],
];

describe('empty subject sections', () => {
  it.each(VACIAS)('%s is noindex while it has nothing published', (file, patron) => {
    expect(readFileSync(`${DIR}/${file}`, 'utf8')).toMatch(patron);
  });

  it('the hub only links sections with published content', () => {
    const hub = readFileSync(`${DIR}/index.astro`, 'utf8');
    const material = /const material = \[([\s\S]*?)\];/.exec(hub)?.[1] ?? '';
    // libro and diapositivas come from the book itself; the rest are conditional.
    const fijas = [...material.matchAll(/^\s*'([a-z/-]+)',$/gm)].map((m) => m[1]);
    expect(fijas).toEqual(['libro', 'diapositivas']);
    expect(material).toContain("...(hasActividades ? ['actividades'] : [])");
  });
});
