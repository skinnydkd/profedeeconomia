import { describe, it, expect } from 'vitest';
import { BLOQUES, BLOQUE_SLUGS, bloqueMeta, SIMULACROS, GUIA } from './olimpiada.ts';

describe('BLOQUES', () => {
  it('has 6 core blocks with a color token each', () => {
    expect(BLOQUES).toHaveLength(6);
    for (const b of BLOQUES) expect(b.colorVar).toMatch(/^--color-[a-z0-9-]+$/);
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
