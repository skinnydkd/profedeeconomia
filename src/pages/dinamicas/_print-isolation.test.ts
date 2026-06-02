import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

/**
 * Regression guard for the «Imprimir materiales» flow.
 *
 * Bug: printing a dinámica produced a PDF of the WHOLE page (theory included)
 * instead of only the repartible materials (role cards, student sheets). The
 * @media print stylesheet hid the app chrome and `.no-print` blocks but not the
 * theory prose, and the materials live as siblings of that theory inside
 * `.prose`. The fix isolates the print output to the `.print-block` materials.
 *
 * A true visual check needs a browser print preview; this guards the CSS rules
 * that make the isolation happen so the regression can't silently come back.
 */
const here = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(here, '[familia]', '[slug].astro'), 'utf8');

/**
 * Return everything from `@media print` to the end of the file. The print block
 * is the last rule in the component's `<style>`, so the tail is exactly the
 * print rules (plus the closing braces, harmless for matching).
 */
function printBlock(css: string): string {
  // Match the CSS at-rule (`@media print {`), not the prose mention of it in the
  // component's doc comment.
  const m = css.search(/@media\s+print\s*\{/);
  return m === -1 ? '' : css.slice(m);
}

describe('dinámica print stylesheet isolates the repartible materials', () => {
  const block = printBlock(src);

  it('has an @media print block', () => {
    expect(block.length).toBeGreaterThan(0);
  });

  it('hides every direct child of the prose theory in print', () => {
    expect(block).toMatch(/\.prose\s*>\s*:global\(\*\)[^}]*display:\s*none/);
  });

  it('re-shows only the .print-block materials in print', () => {
    expect(block).toMatch(/:global\(\.print-block\)[^}]*display:\s*block/);
  });

  it('hides the non-material context (kicker and lede) in print', () => {
    expect(block).toMatch(/\.kicker[^{]*\.lede|\.lede[^{]*\.kicker/);
  });
});
