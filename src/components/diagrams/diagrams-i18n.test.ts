import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Every label inside a diagram used to be a Spanish literal, so the Valencian
 * edition of the book and of the decks rendered the diagrams in Spanish while
 * the text around them was translated.
 *
 * These guards keep that from coming back: a diagram resolves the active
 * locale, declares the same keys in both languages, and prints prose only
 * through the dictionary. Axis symbols (P*, Q*, M0, ΔY = 2,4) stay inline —
 * they read the same in both languages, and `isProse` is what separates them.
 */
const DIR = join(import.meta.dirname, '.');
const FILES = readdirSync(DIR).filter((f) => f.endsWith('.astro'));

/** The template body: everything after the frontmatter fence. */
const body = (src: string) => src.slice(src.indexOf('---', 3) + 3);

/** A run of two lowercase letters, or a word of four capitals, is prose. */
const isProse = (s: string) => /[a-záéíóúüñ]{2,}/.test(s) || /[A-ZÁÉÍÓÚÑ]{4,}/.test(s);

describe('diagram components', () => {
  it('finds the diagrams', () => {
    expect(FILES.length).toBeGreaterThan(80);
  });

  it.each(FILES)('%s resolves the active locale', (file) => {
    const src = readFileSync(join(DIR, file), 'utf8');
    expect(src).toContain('getLocale(Astro.currentLocale)');
    expect(src).toContain('const t = COPY[locale];');
  });

  it.each(FILES)('%s declares the same keys in both languages', (file) => {
    const src = readFileSync(join(DIR, file), 'utf8');
    const block = src.slice(src.indexOf('const COPY = {'), src.indexOf('} as const;'));
    const es = block.slice(block.indexOf('es: {'), block.indexOf('ca: {'));
    const ca = block.slice(block.indexOf('ca: {'));
    const keys = (s: string) => [...s.matchAll(/^ {4}([A-Za-z][A-Za-z0-9]*):/gm)].map((m) => m[1]);
    expect(keys(es).length).toBeGreaterThan(0);
    expect(keys(ca)).toEqual(keys(es));
  });

  it.each(FILES)('%s prints prose only through the dictionary', (file) => {
    const src = readFileSync(join(DIR, file), 'utf8');
    const literals = [...body(src).matchAll(/>([^<>{}]*[A-Za-zÁÉÍÓÚÜÑáéíóúüñ][^<>{}]*)</g)]
      .map((m) => m[1].trim())
      .filter((s) => s.length > 0 && isProse(s));
    expect(literals).toEqual([]);
  });

  it.each(FILES)('%s carries no Spanish in an attribute', (file) => {
    const src = readFileSync(join(DIR, file), 'utf8');
    // aria-label is read aloud by a screen reader, so it is as translatable
    // as anything drawn on screen; it has to come from the dictionary too.
    expect(body(src)).not.toMatch(/aria-label="/);
  });

  it('translates the phrases that differ between the two languages', () => {
    // A spot check that the ca side is a real translation and not a copy of es.
    const src = readFileSync(join(DIR, 'BalanceMasas.astro'), 'utf8');
    expect(src).toContain("'Balance por masas patrimoniales'");
    expect(src).toContain("'Balanç per masses patrimonials'");
  });
});
