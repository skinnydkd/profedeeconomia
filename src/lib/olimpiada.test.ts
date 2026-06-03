import { describe, it, expect } from 'vitest';
import { BLOQUES, BLOQUE_SLUGS, bloqueMeta, SIMULACROS, GUIA } from './olimpiada.ts';

describe('BLOQUES', () => {
  it('has 12 blocks with a color token and unique slug each', () => {
    expect(BLOQUES).toHaveLength(12);
    for (const b of BLOQUES) expect(b.colorVar).toMatch(/^--color-[a-z0-9-]+$/);
    expect(new Set(BLOQUE_SLUGS).size).toBe(BLOQUES.length);
  });
});
describe('bloqueMeta', () => {
  it('resolves and throws', () => {
    expect(bloqueMeta('fpp').label).toContain('FPP');
    expect(() => bloqueMeta('nope')).toThrow(/unknown bloque/i);
  });
});
describe('SIMULACROS', () => {
  it('lists the 3 official exams + megaexamen, each with a pdf path', () => {
    expect(SIMULACROS.filter((s) => s.oficial)).toHaveLength(3);
    for (const s of SIMULACROS) expect(s.pdf).toMatch(/^\/olimpiada\/.*\.pdf$/);
  });
});
describe('GUIA', () => {
  it('describes the 3 parts', () => { expect(GUIA.partes).toHaveLength(3); });
});
