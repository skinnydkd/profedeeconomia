import { describe, it, expect } from 'vitest';
import { indiceBanco, indiceMostrado, ordenOpciones, publicQuestion } from './shuffle';

describe('jocs option order', () => {
  it('is a stable permutation for a game and question', () => {
    const a = ordenOpciones('g1', 'eco-1001', 4);
    expect([...a].sort()).toEqual([0, 1, 2, 3]);
    expect(ordenOpciones('g1', 'eco-1001', 4)).toEqual(a);
  });

  it('maps a tapped position back to the bank index and the key forward again', () => {
    const q = { id: 'eco-1001', opciones: ['A', 'B', 'C', 'D'] };
    const shown = publicQuestion(q, 'g1').opciones;
    for (let k = 0; k < 4; k++) {
      const banco = indiceBanco('g1', q.id, 4, k);
      expect(q.opciones[banco]).toBe(shown[k]);
      expect(indiceMostrado('g1', q.id, 4, banco)).toBe(k);
    }
  });

  it('spreads a key that was always the first option', () => {
    const pos = [0, 0, 0, 0];
    for (let g = 0; g < 400; g++) pos[indiceMostrado(`game-${g}`, 'eco-1001', 4, 0)]++;
    pos.forEach((c) => expect(c / 400).toBeLessThan(0.35));
  });

  it('never exposes the key or the explanation', () => {
    const q = { id: 'x', opciones: ['A', 'B'], correcta: 1, explicacion: 'porque sí', enunciado: '¿?' };
    expect(Object.keys(publicQuestion(q, 'g')).sort()).toEqual(['enunciado', 'id', 'opciones']);
  });
});
