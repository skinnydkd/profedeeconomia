import { describe, it, expect } from 'vitest';
import { analizar, intercambio, type Paises } from './ventaja-comparativa';

/**
 * The reference case is the one worked in the Eco 1BACH activity «Ventaja
 * comparativa: dos países» (unit 12). Good 1 is oil, good 2 is cloth.
 * España: 120 oil / 240 cloth. Portugal: 60 oil / 180 cloth.
 */
const ricardo: Paises = { a: { bien1: 120, bien2: 240 }, b: { bien1: 60, bien2: 180 } };

describe('analizar', () => {
  const r = analizar(ricardo);
  it('computes the four opportunity costs', () => {
    expect(r.costes.a1).toBeCloseTo(2, 10);
    expect(r.costes.b1).toBeCloseTo(3, 10);
    expect(r.costes.a2).toBeCloseTo(0.5, 10);
    expect(r.costes.b2).toBeCloseTo(1 / 3, 10);
  });
  it('gives España both absolute advantages', () => {
    expect(r.absoluta).toEqual({ bien1: 'a', bien2: 'a' });
  });
  it('splits the comparative advantages anyway', () => {
    expect(r.comparativa).toEqual({ bien1: 'a', bien2: 'b' });
  });
  it('places the terms of trade between the two opportunity costs', () => {
    expect(r.rango).toEqual({ min: 2, max: 3 });
  });
  it('adds up world output under full specialisation', () => {
    expect(r.especializacion).toEqual({ bien1: 120, bien2: 180 });
  });
  it('never hands one country both comparative advantages', () => {
    const casos: Paises[] = [
      ricardo,
      { a: { bien1: 10, bien2: 90 }, b: { bien1: 40, bien2: 20 } },
      { a: { bien1: 1, bien2: 1000 }, b: { bien1: 999, bien2: 1 } },
    ];
    for (const c of casos) {
      const { comparativa } = analizar(c);
      expect(comparativa.bien1).not.toBe(comparativa.bien2);
    }
  });
  it('finds no comparative advantage when the relative costs match', () => {
    const gemelos: Paises = { a: { bien1: 100, bien2: 200 }, b: { bien1: 50, bien2: 100 } };
    const g = analizar(gemelos);
    expect(g.comparativa).toEqual({ bien1: null, bien2: null });
    expect(g.rango).toBeNull();
    expect(g.especializacion).toBeNull();
    // España is still twice the size, which is exactly the point.
    expect(g.absoluta).toEqual({ bien1: 'a', bien2: 'a' });
  });
  it('rejects a country that cannot produce something', () => {
    expect(analizar({ ...ricardo, b: { bien1: 0, bien2: 180 } }).valido).toBe(false);
  });
});

describe('intercambio', () => {
  it('reproduces the worked swap: both sides gain 20 of cloth', () => {
    const x = intercambio(ricardo, 40, 100);
    expect(x.valido).toBe(true);
    expect(x.relacion).toBeCloseTo(2.5, 10);
    expect(x.dentroDelRango).toBe(true);
    expect(x.exportadorBien1).toBe('a');
    expect(x.gananciaA).toBeCloseTo(20, 10);
    expect(x.gananciaB).toBeCloseTo(20, 10);
  });
  it('reports what each country ends up consuming', () => {
    const x = intercambio(ricardo, 40, 100);
    expect(x.consumoA).toEqual({ bien1: 80, bien2: 100 });
    expect(x.consumoB).toEqual({ bien1: 40, bien2: 80 });
  });
  it('turns one gain negative outside the band', () => {
    // 1,5 cloth per oil is below España's own cost of 2: it would rather not trade.
    const bajo = intercambio(ricardo, 40, 60);
    expect(bajo.dentroDelRango).toBe(false);
    expect(bajo.gananciaA).toBeLessThan(0);
    expect(bajo.gananciaB).toBeGreaterThan(0);
    // 3,5 is above Portugal's cost of 3: now it is Portugal who refuses.
    const alto = intercambio(ricardo, 40, 140);
    expect(alto.dentroDelRango).toBe(false);
    expect(alto.gananciaB).toBeLessThan(0);
    expect(alto.gananciaA).toBeGreaterThan(0);
  });
  it('leaves both at zero exactly on the edge of the band', () => {
    expect(intercambio(ricardo, 40, 80).gananciaA).toBeCloseTo(0, 10);
    expect(intercambio(ricardo, 40, 120).gananciaB).toBeCloseTo(0, 10);
  });
  it('works when the comparative advantage sits the other way round', () => {
    // Portugal now gives up less cloth per unit of oil, so it exports oil.
    const invertido: Paises = { a: { bien1: 120, bien2: 480 }, b: { bien1: 60, bien2: 180 } };
    const an = analizar(invertido);
    expect(an.comparativa).toEqual({ bien1: 'b', bien2: 'a' });
    const x = intercambio(invertido, 20, 70);
    expect(x.exportadorBien1).toBe('b');
    expect(x.dentroDelRango).toBe(true);
    expect(x.gananciaA).toBeGreaterThan(0);
    expect(x.gananciaB).toBeGreaterThan(0);
    expect(x.consumoB).toEqual({ bien1: 40, bien2: 70 });
  });
  it('refuses a swap larger than what the exporter produces', () => {
    expect(intercambio(ricardo, 200, 500).valido).toBe(false);
    expect(intercambio(ricardo, 40, 200).valido).toBe(false);
  });
  it('refuses to check a swap when there is no comparative advantage', () => {
    const gemelos: Paises = { a: { bien1: 100, bien2: 200 }, b: { bien1: 50, bien2: 100 } };
    expect(intercambio(gemelos, 10, 25).valido).toBe(false);
  });
});
