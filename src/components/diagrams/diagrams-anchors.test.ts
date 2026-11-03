import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * CODE-WEB-15: in an SVG, a CSS rule wins over a presentation attribute, so a
 * `text-anchor="start"` on a text whose class centres it does nothing. The
 * multiplier diagram's subtitle was centred on x=62 and ran off the left edge
 * («nsión marginal al consumo c = 0,75»). Positioning belongs in the class or
 * in a `style`, never in an attribute the class overrides.
 */
const DIR = join(import.meta.dirname, '.');
const FILES = readdirSync(DIR).filter((f) => f.endsWith('.astro'));

/** text-anchor set by each class in the diagram's own stylesheet. */
function anclasPorClase(src: string): Map<string, string> {
  const out = new Map<string, string>();
  for (const m of src.matchAll(/\.([\w-]+)\s*\{[^}]*text-anchor:\s*([\w-]+)/g)) out.set(m[1], m[2]);
  return out;
}

describe('diagram text anchors', () => {
  it.each(FILES)('%s has no text-anchor attribute its class overrides', (file) => {
    const src = readFileSync(join(DIR, file), 'utf8');
    const anclas = anclasPorClase(src);
    const ignorados = [...src.matchAll(/<text\b[^>]*>/g)]
      .map((m) => m[0])
      .filter((tag) => {
        const clase = /class="([^"]+)"/.exec(tag)?.[1].split(/\s+/).find((c) => anclas.has(c));
        const attr = /\stext-anchor="([\w-]+)"/.exec(tag)?.[1];
        return clase && attr && attr !== anclas.get(clase);
      });
    expect(ignorados).toEqual([]);
  });

  it('prints the initial-spending label in ink, above its bar', () => {
    const src = readFileSync(join(DIR, 'MultiplicadorFiscal.astro'), 'utf8');
    // White text only belongs inside the terracota bar (y ≥ 158), not above it on cream.
    for (const m of src.matchAll(/<text class="round-(?:name|amt)-light"[^>]*\sy="(\d+)"/g)) {
      expect(Number(m[1])).toBeGreaterThan(158);
    }
  });
});
