import { describe, it, expect } from 'vitest';
import {
  criterioDecisivo,
  normalizarNota,
  pesosNormalizados,
  resolverMatriz,
  UMBRAL_EMPATE,
  type Criterio,
  type Opcion,
} from './matriz-decision';

const CRITERIOS: Criterio[] = [
  { id: 'gusta', nombre: 'Me gusta', peso: 5 },
  { id: 'salidas', nombre: 'Salidas laborales', peso: 3 },
  { id: 'cerca', nombre: 'Lo tengo cerca', peso: 2 },
];

const OPCIONES: Opcion[] = [
  { id: 'bach', nombre: 'Bachillerato', notas: { gusta: 4, salidas: 4, cerca: 5 } },
  { id: 'fp', nombre: 'FP de Grado Medio', notas: { gusta: 5, salidas: 5, cerca: 2 } },
];

describe('weight normalisation', () => {
  it('turns any numbers into fractions that sum to one', () => {
    const w = pesosNormalizados(CRITERIOS);
    expect(w).toEqual([0.5, 0.3, 0.2]);
    expect(w.reduce((a, b) => a + b, 0)).toBeCloseTo(1);
  });

  it('gives all zeros when no criterion carries weight', () => {
    expect(pesosNormalizados([{ id: 'a', nombre: 'A', peso: 0 }])).toEqual([0]);
  });

  it('treats a negative weight as zero rather than flipping the sign', () => {
    expect(pesosNormalizados([
      { id: 'a', nombre: 'A', peso: -4 },
      { id: 'b', nombre: 'B', peso: 2 },
    ])).toEqual([0, 1]);
  });
});

describe('score clamping', () => {
  it('keeps scores inside the 1-5 scale', () => {
    expect(normalizarNota(9)).toBe(5);
    expect(normalizarNota(0)).toBe(1);
    expect(normalizarNota(3)).toBe(3);
  });

  it('falls back to the minimum for a missing or unusable score', () => {
    expect(normalizarNota(undefined)).toBe(1);
    expect(normalizarNota(NaN)).toBe(1);
  });
});

describe('ranking', () => {
  it('scores each option as the weighted average of its marks', () => {
    const r = resolverMatriz(CRITERIOS, OPCIONES);
    // FP: 5(.5) + 5(.3) + 2(.2) = 4.4 · Bach: 4(.5) + 4(.3) + 5(.2) = 4.2
    const fp = r.ranking.find((x) => x.opcionId === 'fp')!;
    const bach = r.ranking.find((x) => x.opcionId === 'bach')!;
    expect(fp.total).toBeCloseTo(4.4);
    expect(bach.total).toBeCloseTo(4.2);
    expect(r.ranking[0].opcionId).toBe('fp');
  });

  it('keeps the total on the same 1-5 scale as the marks', () => {
    const r = resolverMatriz(CRITERIOS, OPCIONES);
    for (const p of r.ranking) {
      expect(p.total!).toBeGreaterThanOrEqual(1);
      expect(p.total!).toBeLessThanOrEqual(5);
    }
  });

  it('changing the weights can change the winner', () => {
    const cercaManda = CRITERIOS.map((c) => ({ ...c, peso: c.id === 'cerca' ? 20 : 1 }));
    expect(resolverMatriz(cercaManda, OPCIONES).ranking[0].opcionId).toBe('bach');
  });

  it('returns null totals and no margin when no criterion carries weight', () => {
    const sinPeso = CRITERIOS.map((c) => ({ ...c, peso: 0 }));
    const r = resolverMatriz(sinPeso, OPCIONES);
    expect(r.ranking.every((p) => p.total === null)).toBe(true);
    expect(r.margen).toBeNull();
    expect(r.esEmpateTecnico).toBe(false);
  });

  it('breaks exact ties by input order', () => {
    const iguales: Opcion[] = [
      { id: 'a', nombre: 'A', notas: { gusta: 3, salidas: 3, cerca: 3 } },
      { id: 'b', nombre: 'B', notas: { gusta: 3, salidas: 3, cerca: 3 } },
    ];
    expect(resolverMatriz(CRITERIOS, iguales).ranking.map((p) => p.opcionId)).toEqual(['a', 'b']);
  });

  it('handles a single option without a margin', () => {
    const r = resolverMatriz(CRITERIOS, [OPCIONES[0]]);
    expect(r.ranking).toHaveLength(1);
    expect(r.margen).toBeNull();
  });
});

describe('near-ties', () => {
  it('flags a close result as undecided', () => {
    const r = resolverMatriz(CRITERIOS, OPCIONES);
    expect(r.margen).toBeCloseTo(0.2);
    expect(r.margen!).toBeLessThan(UMBRAL_EMPATE);
    expect(r.esEmpateTecnico).toBe(true);
  });

  it('does not flag a clear winner', () => {
    const claro: Opcion[] = [
      { id: 'a', nombre: 'A', notas: { gusta: 5, salidas: 5, cerca: 5 } },
      { id: 'b', nombre: 'B', notas: { gusta: 1, salidas: 1, cerca: 1 } },
    ];
    const r = resolverMatriz(CRITERIOS, claro);
    expect(r.margen).toBeCloseTo(4);
    expect(r.esEmpateTecnico).toBe(false);
  });
});

describe('what drove the result', () => {
  it('names the criterion that separates the top two the most', () => {
    expect(criterioDecisivo(resolverMatriz(CRITERIOS, OPCIONES))).toBe('gusta');
  });

  it('returns null when there is nothing to compare', () => {
    expect(criterioDecisivo(resolverMatriz(CRITERIOS, [OPCIONES[0]]))).toBeNull();
    expect(criterioDecisivo(resolverMatriz(CRITERIOS, []))).toBeNull();
  });
});
