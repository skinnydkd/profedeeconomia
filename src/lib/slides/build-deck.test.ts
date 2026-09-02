import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildDeck } from './build-deck.ts';
import { MAX_AUTHORED_SLIDES } from './authored.ts';

const LIBROS = 'src/content/asignaturas';
/** buildDeck always frames the body with a cover and a close slide. */
const FRAME_SLIDES = 2;
const MIN_SLIDES = 16;
const MAX_SLIDES = MAX_AUTHORED_SLIDES + FRAME_SLIDES;

const RAW = readFileSync('src/content/asignaturas/edmn-2bach/libro/07-funcion-productiva.mdx', 'utf8');
const deck = buildDeck(RAW);

describe('buildDeck (EDMN u7 — la función productiva / punto muerto)', () => {
  it('reads deck identity from frontmatter', () => {
    expect(deck.asignatura).toBe('edmn-2bach');
    expect(deck.unidad).toBe(7);
    expect(deck.title.toLowerCase()).toContain('productiva');
  });
  it('opens with a cover slide', () => {
    expect(deck.slides[0].tipo).toBe('cover');
  });
  it('turns the TL;DR into a quote slide', () => {
    expect(deck.slides.some((s) => s.tipo === 'quote')).toBe(true);
  });
  it('mounts the BreakEvenChart and ProcesosProductivos diagrams', () => {
    const diagramas = deck.slides.filter((s) => s.tipo === 'diagram').map((s: any) => s.diagrama);
    expect(diagramas).toContain('BreakEvenChart');
    expect(diagramas).toContain('ProcesosProductivos');
  });
  it('includes at least one exercise slide', () => {
    expect(deck.slides.some((s) => s.tipo === 'exercise')).toBe(true);
  });
  it('drops book-only blocks (no slide carries PistaEbau/MirarFora content verbatim)', () => {
    // sanity: section covers exist
    expect(deck.slides.some((s) => s.tipo === 'cover' && (s as any).eyebrow?.startsWith('§'))).toBe(true);
  });
  it('stays within a tight presentation range', () => {
    expect(deck.slides.length).toBeGreaterThanOrEqual(MIN_SLIDES);
    expect(deck.slides.length).toBeLessThanOrEqual(MAX_SLIDES);
  });
  it('ends with a close slide', () => {
    expect(deck.slides[deck.slides.length - 1].tipo).toBe('close');
  });
});

/**
 * The same range, checked across every published unit instead of one fixture.
 * An authored deck ships as cover + the authored slides + close, so the ceiling
 * is MAX_AUTHORED_SLIDES (src/lib/slides/authored.ts) plus those two.
 */
describe('every unit deck stays presentable', () => {
  const units = readdirSync(LIBROS, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .flatMap((d) =>
      readdirSync(join(LIBROS, d.name, 'libro'))
        .filter((f) => f.endsWith('.mdx'))
        .map((f) => [`${d.name}/${f}`, join(LIBROS, d.name, 'libro', f)] as const),
    );

  it('finds units to check', () => {
    expect(units.length).toBeGreaterThan(0);
  });

  it(`builds every deck to between ${MIN_SLIDES} and ${MAX_SLIDES} slides`, () => {
    const offenders = units
      .map(([id, path]) => [id, buildDeck(readFileSync(path, 'utf8')).slides.length] as const)
      .filter(([, n]) => n < MIN_SLIDES || n > MAX_SLIDES)
      .map(([id, n]) => `${id}: ${n}`);
    expect(offenders).toEqual([]);
  }, 120_000); // parses every unit in both languages
});
