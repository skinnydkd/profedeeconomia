import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

/**
 * Audit VIS-NAV-22: every page used to build its own breadcrumb, each with its
 * own styles, an English or missing aria-label, no list and no current page.
 * They all come from <Breadcrumb> now (directly or through <SectionHeader>).
 */
const root = process.cwd();
const pagesDir = join(root, 'src', 'pages');

function astroFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return astroFiles(path);
    return name.endsWith('.astro') ? [path] : [];
  });
}

describe('breadcrumbs', () => {
  it('no page builds its own breadcrumb markup', () => {
    const handmade = astroFiles(pagesDir)
      .filter((f) => /class="breadcrumb|nav\.breadcrumb|aria-label="Breadcrumb"/.test(readFileSync(f, 'utf8')))
      .map((f) => relative(pagesDir, f));
    expect(handmade).toEqual([]);
  });

  it('the component is a labelled nav with an ordered list and the current page marked', () => {
    const src = readFileSync(join(root, 'src', 'components', 'Breadcrumb.astro'), 'utf8');
    expect(src).toMatch(/<nav[^>]*aria-label=\{t\('nav\.breadcrumb', locale\)\}/);
    expect(src).toMatch(/<ol>/);
    expect(src).toMatch(/aria-current=\{actual \? 'page' : undefined\}/);
  });
});
