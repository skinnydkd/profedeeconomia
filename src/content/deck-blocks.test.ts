import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { parseMdx } from '@/lib/slides/ast';
import { extractAuthoredYaml, parseAuthoredSlides } from '@/lib/slides/authored';

/**
 * Content-level guard for the authored `{/* deck … *​/}` blocks in book units.
 * Every block must (1) parse and validate against the strict slide schema,
 * (2) reference only figure images that actually exist under src/assets/libro,
 * and (3) keep ES↔CA parity: if one language authors a deck, its sibling does
 * too, with the same slide count and the same sequence of slide types — a
 * translated deck that silently loses slides defeats the point of parity.
 *
 * `astro:content` is not importable from Vitest, so files are read off disk.
 */
const ROOT = join('src', 'content', 'asignaturas');
const ASSETS = join('src', 'assets', 'libro');

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = join(dir, d.name);
    if (d.isDirectory()) return walk(p);
    return /\/libro\/[^/]+\.mdx?$/.test(p.split(sep).join('/')) ? [p] : [];
  });
}

const units = walk(ROOT).map((path) => {
  const rel = relative(ROOT, path).split(sep).join('/');
  const yaml = extractAuthoredYaml(parseMdx(readFileSync(path, 'utf8')).ast);
  return { path, rel, yaml };
});
const authored = units.filter((u) => u.yaml !== null);

describe('authored deck blocks in book units', () => {
  it('sanity: the scanner sees the book units', () => {
    expect(units.length).toBeGreaterThan(100);
  });

  for (const u of authored) {
    describe(u.rel, () => {
      const slides = (() => {
        try { return parseAuthoredSlides(u.yaml!); } catch (e) { return e as Error; }
      })();

      it('parses and validates against the slide schema', () => {
        if (slides instanceof Error) throw slides;
        expect(slides.length).toBeGreaterThanOrEqual(12);
      });

      it('references only figure images that exist', () => {
        if (slides instanceof Error) return; // reported above
        for (const s of slides) {
          if (s.tipo === 'figure') {
            expect(existsSync(join(ASSETS, s.src)), `missing ${s.src}`).toBe(true);
          }
        }
      });

      it('has a language sibling with an equivalent deck', () => {
        const sibling = u.path.includes('.ca.')
          ? u.path.replace('.ca.', '.')
          : u.path.replace(/\.(mdx?)$/, '.ca.$1');
        expect(existsSync(sibling), `missing sibling ${sibling}`).toBe(true);
        const sibYaml = extractAuthoredYaml(parseMdx(readFileSync(sibling, 'utf8')).ast);
        expect(sibYaml, 'sibling has no deck block').not.toBeNull();
        if (slides instanceof Error) return;
        const sibSlides = parseAuthoredSlides(sibYaml!);
        expect(sibSlides.map((s) => s.tipo)).toEqual(slides.map((s) => s.tipo));
      });
    });
  }
});
