import { describe, it, expect } from 'vitest';
import { parseDebatePrintPath } from './debate-pdf-jobs.mjs';

describe('parseDebatePrintPath', () => {
  it('extracts familia/slug and builds route + out name from a dist html path', () => {
    const rel = 'debates/dinero-tecnologia-futuro/01-criptomonedas/imprimir/index.html';
    expect(parseDebatePrintPath(rel)).toEqual({
      familia: 'dinero-tecnologia-futuro',
      slug: '01-criptomonedas',
      route: 'debates/dinero-tecnologia-futuro/01-criptomonedas/imprimir',
      out: 'debate-dinero-tecnologia-futuro-01-criptomonedas.pdf',
    });
  });

  it('returns null for non-debate or non-imprimir paths', () => {
    expect(parseDebatePrintPath('debates/mercado-estado/01-x/index.html')).toBeNull();
    expect(parseDebatePrintPath('juegos/econopoly/imprimir/index.html')).toBeNull();
  });

  it('normalizes Windows backslashes', () => {
    const rel = 'debates\\mercado-estado\\02-salario\\imprimir\\index.html';
    expect(parseDebatePrintPath(rel)?.slug).toBe('02-salario');
  });
});
