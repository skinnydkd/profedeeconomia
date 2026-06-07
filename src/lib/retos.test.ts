// src/lib/retos.test.ts
import { describe, it, expect } from 'vitest';
import { nivelForScore, resolveNiveles } from './retos';

describe('nivelForScore', () => {
  it('maps score ratio to a level index (0/1/2)', () => {
    expect(nivelForScore(0, 10)).toBe(0);   // 0%
    expect(nivelForScore(4, 10)).toBe(0);   // 40% < 50
    expect(nivelForScore(5, 10)).toBe(1);   // 50%
    expect(nivelForScore(7, 10)).toBe(1);   // 70% < 80
    expect(nivelForScore(8, 10)).toBe(2);   // 80%
    expect(nivelForScore(10, 10)).toBe(2);  // 100%
  });
  it('returns 0 when there are no auto-scored items', () => {
    expect(nivelForScore(0, 0)).toBe(0);
  });
});

const EVAL = {
  competencias: [
    {
      codigo: 'CE1',
      descripcion: 'Valorar la escasez…',
      criterios: ['1.1'],
      niveles: [
        { nivel: 'En desarrollo', descriptor: 'D0' },
        { nivel: 'Adecuado', descriptor: 'D1' },
        { nivel: 'Avanzado', descriptor: 'D2' },
      ],
    },
    { codigo: 'CE2', descripcion: 'Otra', criterios: [], niveles: [{ nivel: 'x', descriptor: 'y' }] },
  ],
};

describe('resolveNiveles', () => {
  it('returns competencia text and 3 levels for a known código', () => {
    const r = resolveNiveles(EVAL, 'CE1');
    expect(r?.competenciaTexto).toBe('Valorar la escasez…');
    expect(r?.niveles).toHaveLength(3);
    expect(r?.niveles[2]).toEqual({ nivel: 'Avanzado', descriptor: 'D2' });
  });
  it('returns null for an unknown código', () => {
    expect(resolveNiveles(EVAL, 'CE9')).toBeNull();
  });
  it('returns null when the competencia has fewer than 3 levels', () => {
    expect(resolveNiveles(EVAL, 'CE2')).toBeNull();
  });
});
