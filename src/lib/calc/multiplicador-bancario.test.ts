import { describe, it, expect } from 'vitest';
import { creacion, rondas, coeficientePara } from './multiplicador-bancario';

describe('creacion · sin filtración de efectivo', () => {
  it('gives the textbook 1/r multiplier', () => {
    const c = creacion(1000, 0.1);
    expect(c.valido).toBe(true);
    expect(c.multiplicador).toBeCloseTo(10, 10);
    expect(c.depositosTotales).toBeCloseTo(10000, 8);
    expect(c.dineroCreado).toBeCloseTo(9000, 8);
  });
  it('keeps reserves equal to the original deposit', () => {
    // Every euro of the first deposit ends up immobilised as reserves.
    const c = creacion(1000, 0.2);
    expect(c.reservasTotales).toBeCloseTo(1000, 8);
    expect(c.prestamosTotales).toBeCloseTo(4000, 8);
  });
  it('creates nothing when banks lend nothing', () => {
    const c = creacion(1000, 1);
    expect(c.multiplicador).toBeCloseTo(1, 10);
    expect(c.dineroCreado).toBeCloseTo(0, 10);
  });
  it('makes the money supply equal to total deposits', () => {
    const c = creacion(500, 0.25);
    expect(c.efectivoTotal).toBeCloseTo(0, 10);
    expect(c.ofertaMonetaria).toBeCloseTo(c.depositosTotales, 8);
  });
});

describe('creacion · con filtración de efectivo', () => {
  it('matches the (1 + c) / (r + c) form of the manuals', () => {
    // f = c / (1 + c): a drain of f = 0,2 is the same as c = 0,25.
    const f = 0.2;
    const r = 0.1;
    const cRatio = f / (1 - f);
    const esperado = 1 / (1 - (1 - r) * (1 - f));
    expect(creacion(1000, r, f).multiplicador).toBeCloseTo(esperado, 10);
    expect(esperado).toBeCloseTo((1 + cRatio) / (r + cRatio), 10);
  });
  it('shrinks the multiplier compared with no drain', () => {
    expect(creacion(1000, 0.1, 0.2).multiplicador).toBeLessThan(creacion(1000, 0.1).multiplicador);
  });
  it('adds the cash held by the public to the money supply', () => {
    const c = creacion(1000, 0.1, 0.2);
    expect(c.ofertaMonetaria).toBeCloseTo(c.depositosTotales + c.efectivoTotal, 8);
    expect(c.efectivoTotal).toBeGreaterThan(0);
  });
});

describe('creacion · casos límite', () => {
  it('rejects a system where nothing ever leaks out', () => {
    expect(creacion(1000, 0).valido).toBe(false);
  });
  it('rejects impossible inputs', () => {
    expect(creacion(0, 0.1).valido).toBe(false);
    expect(creacion(-100, 0.1).valido).toBe(false);
    expect(creacion(1000, 1.2).valido).toBe(false);
    expect(creacion(1000, 0.1, -0.1).valido).toBe(false);
  });
});

describe('rondas', () => {
  it('starts with the original deposit and decays geometrically', () => {
    const rs = rondas(1000, 0.1, 0, 4);
    expect(rs.map((x) => x.deposito)).toEqual([1000, 900, 810, 729]);
    expect(rs[0].reservas).toBeCloseTo(100, 10);
    expect(rs[0].prestamo).toBeCloseTo(900, 10);
  });
  it('converges to the closed form when enough rounds are summed', () => {
    const total = rondas(1000, 0.1, 0, 400).reduce((s, x) => s + x.deposito, 0);
    expect(total).toBeCloseTo(creacion(1000, 0.1).depositosTotales, 6);
  });
  it('converges with a cash drain too', () => {
    const total = rondas(1000, 0.15, 0.1, 400).reduce((s, x) => s + x.deposito, 0);
    expect(total).toBeCloseTo(creacion(1000, 0.15, 0.1).depositosTotales, 6);
  });
  it('splits each loan between cash and the next deposit', () => {
    const rs = rondas(1000, 0.1, 0.25, 3);
    expect(rs[0].efectivo).toBeCloseTo(225, 10);
    expect(rs[1].deposito).toBeCloseTo(900 - 225, 10);
  });
  it('returns nothing for an invalid system', () => {
    expect(rondas(1000, 0)).toEqual([]);
  });
});

describe('coeficientePara', () => {
  it('inverts the simple multiplier', () => {
    expect(coeficientePara(10)).toBeCloseTo(0.1, 10);
    expect(coeficientePara(4)).toBeCloseTo(0.25, 10);
  });
  it('rejects a multiplier below one', () => {
    expect(coeficientePara(0.5)).toBeNaN();
  });
});
