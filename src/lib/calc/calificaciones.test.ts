import { describe, it, expect } from 'vitest';
import { mediaPonderada, sumaPesos, rubricaANota } from './calificaciones.ts';

describe('mediaPonderada', () => {
  it('weights notes by their pesos', () => {
    expect(mediaPonderada([{ peso: 2, nota: 5 }, { peso: 3, nota: 8 }])).toBeCloseTo(6.8);
  });
  it('returns null when total weight is non-positive', () => {
    expect(mediaPonderada([])).toBeNull();
    expect(mediaPonderada([{ peso: 0, nota: 9 }])).toBeNull();
  });
});

describe('sumaPesos', () => {
  it('sums the pesos', () => {
    expect(sumaPesos([{ peso: 40 }, { peso: 60 }])).toBe(100);
  });
});

describe('rubricaANota', () => {
  it('scales obtained/max to the scale (default 10)', () => {
    expect(rubricaANota(3, 4)).toBe(7.5);
    expect(rubricaANota(6, 12, 100)).toBe(50);
  });
  it('returns null when max is non-positive', () => {
    expect(rubricaANota(3, 0)).toBeNull();
  });
});
