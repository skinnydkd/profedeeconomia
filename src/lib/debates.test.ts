import { describe, it, expect } from 'vitest';
import { FAMILIAS_DEBATE, FAMILIA_DEBATE_SLUGS, familiaMeta, debatePdfName } from './debates.ts';

describe('FAMILIAS_DEBATE', () => {
  it('declares the 6 families in display order with a color token each', () => {
    expect(FAMILIAS_DEBATE.map((f) => f.slug)).toEqual([
      'mercado-estado', 'trabajo-desigualdad', 'globalizacion-comercio',
      'sostenibilidad-crecimiento', 'etica-empresa-consumo', 'dinero-tecnologia-futuro',
    ]);
    for (const f of FAMILIAS_DEBATE) expect(f.colorVar).toMatch(/^--color-[a-z0-9-]+$/);
  });
  it('exposes the slugs as a non-empty tuple', () => {
    expect(FAMILIA_DEBATE_SLUGS.length).toBe(FAMILIAS_DEBATE.length);
  });
});

describe('familiaMeta', () => {
  it('returns metadata for a known family', () => {
    expect(familiaMeta('mercado-estado').label).toBe('Mercado y Estado');
  });
  it('throws on an unknown family', () => {
    expect(() => familiaMeta('nope')).toThrow(/unknown familia de debate/i);
  });
});

describe('debatePdfName', () => {
  it('builds the canonical downloads filename from familia + slug', () => {
    expect(debatePdfName('dinero-tecnologia-futuro', '01-criptomonedas'))
      .toBe('debate-dinero-tecnologia-futuro-01-criptomonedas.pdf');
  });

  it('does not double-prefix or alter the segments', () => {
    expect(debatePdfName('mercado-estado', '03-salario-minimo'))
      .toBe('debate-mercado-estado-03-salario-minimo.pdf');
  });
});
