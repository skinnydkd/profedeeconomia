import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

/**
 * Regression guard for the debate «Imprimir» flow: printing must isolate the
 * student ficha (.print-block) and hide the theory/argumentary prose. This file
 * is `_`-prefixed so Astro's router ignores it (a `.ts` under src/pages becomes
 * a route endpoint otherwise — see the Dinámicas build-break lesson).
 */
const here = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(here, '[familia]', '[slug].astro'), 'utf8');

function printBlock(css: string): string {
  const m = css.search(/@media\s+print\s*\{/);
  return m === -1 ? '' : css.slice(m);
}

describe('debate print stylesheet isolates the student ficha', () => {
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
});
