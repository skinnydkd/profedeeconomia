import { describe, it, expect } from 'vitest';
import { productividadFactor, productividadGlobal, variacionPct } from './productividad.ts';

describe('productividadFactor', () => {
  it('divides production by the factor', () => {
    expect(productividadFactor(1000, 5)).toBe(200);
  });
  it('returns null when the factor is non-positive', () => {
    expect(productividadFactor(1000, 0)).toBeNull();
    expect(productividadFactor(1000, -2)).toBeNull();
  });
});

describe('productividadGlobal', () => {
  it('is value of output over value of inputs', () => {
    expect(productividadGlobal(12000, 8000)).toBe(1.5);
  });
  it('returns null when inputs value is non-positive', () => {
    expect(productividadGlobal(12000, 0)).toBeNull();
  });
});

describe('variacionPct', () => {
  it('computes percentage change', () => {
    expect(variacionPct(200, 250)).toBe(25);
    expect(variacionPct(250, 200)).toBe(-20);
  });
  it('returns null when the base is zero', () => {
    expect(variacionPct(0, 100)).toBeNull();
  });
});
