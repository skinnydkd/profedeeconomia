import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

/**
 * Regression guard for the print-and-play («Versión para imprimir») pages.
 *
 * Each game's imprimir.astro must isolate its print output to the `.print-block`
 * sheets: hide the page chrome (`.no-print`, header/footer) and start each block
 * on its own page. A true visual check needs a browser print preview; this
 * guards the CSS rules that make the isolation happen so it can't silently break.
 */
const here = dirname(fileURLToPath(import.meta.url));
const GAMES = ['econopoly', 'econrisk', 'cajut', 'insider'];

function printBlock(css: string): string {
  const m = css.search(/@media\s+print\s*\{/);
  return m === -1 ? '' : css.slice(m);
}

describe.each(GAMES)('%s/imprimir.astro print isolation', (game) => {
  const src = readFileSync(join(here, game, 'imprimir.astro'), 'utf8');
  const block = printBlock(src);

  it('has an @media print block', () => {
    expect(block.length).toBeGreaterThan(0);
  });

  it('hides the .no-print chrome in print', () => {
    expect(block).toMatch(/\.no-print[^}]*display:\s*none/);
  });

  it('breaks each .print-block onto its own page', () => {
    expect(block).toMatch(/\.print-block\s*\+\s*\.print-block[^}]*break-before:\s*page/);
  });
});
