import { describe, it, expect } from 'vitest';
import { calcularTIR, cambiosDeSigno, van, TIR_MAX } from './van-tir';

describe('van', () => {
  it('discounts every flow and subtracts the investment', () => {
    // −1.000 + 1.100 / 1,1 = 0
    expect(van(1000, [1100], 0.1)).toBeCloseTo(0, 9);
    expect(van(100, [230, -132], 0.15)).toBeCloseTo(-100 + 230 / 1.15 - 132 / 1.15 ** 2, 9);
  });
});

describe('cambiosDeSigno', () => {
  it('counts the sign changes of −I₀, F₁ … Fₙ, skipping zeros', () => {
    expect(cambiosDeSigno(120000, [20000, 30000, 50000])).toBe(1);
    expect(cambiosDeSigno(100, [230, -132])).toBe(2);
    expect(cambiosDeSigno(100, [0, 50, 0, -10])).toBe(2);
    expect(cambiosDeSigno(100, [-10, -20])).toBe(0);
  });
});

describe('calcularTIR', () => {
  it('finds the single TIR of a conventional investment', () => {
    const flujos = [20000, 30000, 50000, 60000, 50000];
    const r = calcularTIR(120000, flujos);
    expect(r.tipo).toBe('unica');
    if (r.tipo !== 'unica') return;
    expect(van(120000, flujos, r.tir)).toBeCloseTo(0, 4);
  });

  it('reports both TIRs when the flows change sign twice (I₀ = 100, [230, −132])', () => {
    const r = calcularTIR(100, [230, -132]);
    expect(r.tipo).toBe('varias');
    if (r.tipo !== 'varias') return;
    expect(r.tirs).toHaveLength(2);
    expect(r.tirs[0]).toBeCloseTo(0.1, 9);
    expect(r.tirs[1]).toBeCloseTo(0.2, 9);
  });

  it('finds a TIR above 500 % instead of giving up (I₀ = 1.000, [10.000] → 900 %)', () => {
    const r = calcularTIR(1000, [10000]);
    expect(r).toEqual({ tipo: 'unica', tir: expect.closeTo(9, 9) });
  });

  it('says there is no TIR when the VAN is negative at every rate', () => {
    // I₀ = 100.000, [50.000, 50.000, 50.000, −60.000]: two sign changes, no root.
    expect(calcularTIR(100000, [50000, 50000, 50000, -60000])).toEqual({ tipo: 'ninguna' });
    // Flows that never turn positive cannot pay the investment back.
    expect(calcularTIR(100, [-10, -20])).toEqual({ tipo: 'ninguna' });
  });

  it('flags a TIR beyond the searched range on either side', () => {
    // 1 € turns into 1.000.000 € in a year: TIR = 99.999.900 %.
    expect(calcularTIR(1, [1000000])).toEqual({ tipo: 'fueraDeRango', lado: 'superior' });
    expect(TIR_MAX).toBeLessThan(999999);
    // 100.000 € that give back 1 €: TIR ≈ −99,999 %.
    expect(calcularTIR(100000, [1])).toEqual({ tipo: 'fueraDeRango', lado: 'inferior' });
  });
});
