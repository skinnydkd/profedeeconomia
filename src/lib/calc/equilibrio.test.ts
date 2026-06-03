import { describe, it, expect } from 'vitest';
import { equilibrio, evaluarPrecio, intervencion } from './equilibrio.ts';

const COEF = { a: 100, b: 2, c: 20, d: 2 };

describe('equilibrio', () => {
  it('solves P* and Q* for linear curves', () => {
    expect(equilibrio(COEF.a, COEF.b, COEF.c, COEF.d)).toEqual({ valido: true, P: 20, Q: 60 });
  });
  it('flags invalid when slopes sum to zero', () => {
    expect(equilibrio(100, 0, 20, 0).valido).toBe(false);
  });
  it('flags invalid when equilibrium quantity is negative', () => {
    expect(equilibrio(10, 2, 90, 2).valido).toBe(false);
  });
});

describe('evaluarPrecio', () => {
  it('returns qd, qs and the excess (qs - qd) at a price', () => {
    expect(evaluarPrecio(COEF, 10)).toEqual({ qd: 80, qs: 40, exceso: -40 });
  });
});

describe('intervencion', () => {
  it('a binding price ceiling (below P*) creates a shortage', () => {
    const r = intervencion(COEF, 'maximo', 10);
    expect(r).toEqual({ efectivo: true, intercambiada: 40, escasez: 40, excedente: 0 });
  });
  it('a non-binding price ceiling (above P*) does nothing', () => {
    expect(intervencion(COEF, 'maximo', 30).efectivo).toBe(false);
  });
  it('a binding price floor (above P*) creates a surplus', () => {
    const r = intervencion(COEF, 'minimo', 30);
    expect(r).toEqual({ efectivo: true, intercambiada: 40, escasez: 0, excedente: 40 });
  });
});
