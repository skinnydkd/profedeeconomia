import { describe, it, expect } from 'vitest';
import { mediaPonderada, pesosSuman100, sumaPesos, rubricaANota } from './calificaciones.ts';

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

describe('pesosSuman100', () => {
  it('accepts decimal weights that add up to 100 despite float noise', () => {
    const total = sumaPesos([{ peso: 24.6 }, { peso: 39.7 }, { peso: 35.7 }]);
    expect(total).not.toBe(100); // 100.00000000000001
    expect(pesosSuman100(total)).toBe(true);
  });
  it('still flags weights that do not add up to 100', () => {
    expect(pesosSuman100(99.5)).toBe(false);
    expect(pesosSuman100(100.1)).toBe(false);
  });
});
