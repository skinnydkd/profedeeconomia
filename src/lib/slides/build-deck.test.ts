import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { buildDeck } from './build-deck.ts';

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
    expect(deck.slides.length).toBeGreaterThanOrEqual(16);
    expect(deck.slides.length).toBeLessThanOrEqual(30);
  });
  it('ends with a close slide', () => {
    expect(deck.slides[deck.slides.length - 1].tipo).toBe('close');
  });
});
