import { describe, it, expect } from 'vitest';
import { analizar, type Curvas } from './externalidad';

/**
 * The reference case is the one worked in the Eco 1BACH activity
 * «Externalidad negativa con números» (unit 6): P = 100 − 0,5Q,
 * CMg = 20 + 0,5Q, external cost 20 €/unit.
 */
const cementera: Curvas = { A: 100, B: 0.5, c: 20, d: 0.5, e: 20, tipo: 'negativa' };

describe('analizar · externalidad negativa', () => {
  const r = analizar(cementera);
  it('reproduces the worked activity', () => {
    expect(r.valido).toBe(true);
    expect(r.privado.Q).toBeCloseTo(80, 10);
    expect(r.privado.P).toBeCloseTo(60, 10);
    expect(r.social.Q).toBeCloseTo(60, 10);
    expect(r.social.P).toBeCloseTo(70, 10);
    expect(r.perdidaEficiencia).toBeCloseTo(200, 10);
    expect(r.recaudacion).toBeCloseTo(1200, 10);
  });
  it('leaves the seller with exactly its private marginal cost', () => {
    // 70 paid − 20 of tax = 50, and CMg(60) = 20 + 0,5·60 = 50.
    expect(r.precioProductor).toBeCloseTo(50, 10);
    expect(r.precioProductor).toBeCloseTo(cementera.c + cementera.d * r.social.Q, 10);
  });
  it('produces less than the market, never more', () => {
    expect(r.social.Q).toBeLessThan(r.privado.Q);
    expect(r.brecha).toBeCloseTo(20, 10);
  });
});

describe('analizar · externalidad positiva', () => {
  const vacuna: Curvas = { ...cementera, tipo: 'positiva' };
  const r = analizar(vacuna);
  it('pushes the optimum above the market quantity', () => {
    expect(r.social.Q).toBeCloseTo(100, 10);
    expect(r.privado.Q).toBeCloseTo(80, 10);
  });
  it('prices the subsidy as money paid out, not collected', () => {
    expect(r.recaudacion).toBeCloseTo(2000, 10);
    // Buyers pay 50 and sellers receive 70: the subsidy drives the wedge.
    expect(r.social.P).toBeCloseTo(50, 10);
    expect(r.precioProductor).toBeCloseTo(70, 10);
  });
  it('measures the same triangle as the mirror case', () => {
    expect(r.perdidaEficiencia).toBeCloseTo(200, 10);
  });
});

describe('analizar · casos límite', () => {
  it('collapses the two equilibria when there is no external effect', () => {
    const r = analizar({ ...cementera, e: 0 });
    expect(r.privado.Q).toBeCloseTo(r.social.Q, 10);
    expect(r.perdidaEficiencia).toBeCloseTo(0, 10);
    expect(r.recaudacion).toBeCloseTo(0, 10);
  });
  it('rejects a market that does not exist', () => {
    expect(analizar({ ...cementera, A: 10 }).valido).toBe(false);
  });
  it('rejects an external cost so large that nothing should be produced', () => {
    // (100 − 20 − 200) / 1 < 0: the social optimum is off the board.
    expect(analizar({ ...cementera, e: 200 }).valido).toBe(false);
  });
  it('rejects a subsidy that would drive the price paid below zero', () => {
    expect(analizar({ ...cementera, e: 300, tipo: 'positiva' }).valido).toBe(false);
  });
  it('rejects impossible slopes', () => {
    expect(analizar({ ...cementera, B: 0 }).valido).toBe(false);
    expect(analizar({ ...cementera, d: -1 }).valido).toBe(false);
  });
  it('works with a flat marginal cost', () => {
    const r = analizar({ A: 100, B: 1, c: 20, d: 0, e: 10, tipo: 'negativa' });
    expect(r.privado.Q).toBeCloseTo(80, 10);
    expect(r.social.Q).toBeCloseTo(70, 10);
    expect(r.perdidaEficiencia).toBeCloseTo(50, 10);
  });
});
