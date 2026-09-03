import { describe, it, expect } from 'vitest';
import { valorar, pibReal, deflactorImplicito, type Anyo } from './pib-real';

const serie: Anyo[] = [
  { etiqueta: '2023', nominal: 1000, deflactor: 100, poblacion: 10 },
  { etiqueta: '2024', nominal: 1100, deflactor: 105, poblacion: 10 },
  { etiqueta: '2025', nominal: 1150, deflactor: 115, poblacion: 10 },
];

describe('pibReal', () => {
  it('deflates a nominal figure to base-year prices', () => {
    expect(pibReal(1100, 105)).toBeCloseTo(1047.619, 3);
  });
  it('leaves the base year untouched', () => {
    expect(pibReal(1000, 100)).toBe(1000);
  });
  it('rejects a non-positive deflator', () => {
    expect(pibReal(1000, 0)).toBeNaN();
    expect(pibReal(1000, -5)).toBeNaN();
  });
});

describe('deflactorImplicito', () => {
  it('recovers the deflator from nominal and real', () => {
    expect(deflactorImplicito(1100, 1047.619)).toBeCloseTo(105, 3);
  });
  it('is the inverse of pibReal', () => {
    expect(deflactorImplicito(1100, pibReal(1100, 105))).toBeCloseTo(105, 10);
  });
  it('rejects a zero real figure', () => {
    expect(deflactorImplicito(1100, 0)).toBeNaN();
  });
});

describe('valorar', () => {
  const r = valorar(serie);

  it('deflates every year of the series', () => {
    expect(r.valido).toBe(true);
    expect(r.anyos[0].real).toBe(1000);
    expect(r.anyos[1].real).toBeCloseTo(1047.619, 3);
    expect(r.anyos[2].real).toBeCloseTo(1000, 3);
  });

  it('leaves the first year without growth rates', () => {
    expect(r.anyos[0].crecimientoNominal).toBeNaN();
    expect(r.anyos[0].crecimientoReal).toBeNaN();
    expect(r.anyos[0].inflacion).toBeNaN();
  });

  it('computes nominal and real growth separately', () => {
    expect(r.anyos[1].crecimientoNominal).toBeCloseTo(0.1, 10);
    expect(r.anyos[1].crecimientoReal).toBeCloseTo(0.047619, 5);
  });

  it('reads the deflator change as the implicit inflation', () => {
    expect(r.anyos[1].inflacion).toBeCloseTo(0.05, 10);
  });

  it('flags the year where nominal grows and real does not', () => {
    // 2025: nominal +4,5 % but real back to 1000 — the whole rise was prices.
    expect(r.anyos[2].crecimientoNominal).toBeGreaterThan(0);
    expect(r.anyos[2].crecimientoReal).toBeLessThan(0);
    expect(r.anyos[2].espejismo).toBe(true);
    expect(r.anyos[1].espejismo).toBe(false);
  });

  it('divides real GDP by population when it is given', () => {
    expect(r.anyos[0].perCapita).toBe(100);
    expect(r.anyos[1].perCapita).toBeCloseTo(104.7619, 4);
  });

  it('reports per capita as NaN when population is missing or zero', () => {
    const sin = valorar([{ etiqueta: 'x', nominal: 1000, deflactor: 100 }]);
    expect(sin.anyos[0].perCapita).toBeNaN();
    const cero = valorar([{ etiqueta: 'x', nominal: 1000, deflactor: 100, poblacion: 0 }]);
    expect(cero.anyos[0].perCapita).toBeNaN();
  });

  it('rejects an empty series or a bad deflator', () => {
    expect(valorar([]).valido).toBe(false);
    expect(valorar([{ etiqueta: 'x', nominal: 100, deflactor: 0 }]).valido).toBe(false);
    expect(valorar([{ etiqueta: 'x', nominal: NaN, deflactor: 100 }]).valido).toBe(false);
  });

  it('grows real GDP when population grows faster: per capita can fall while GDP rises', () => {
    const r2 = valorar([
      { etiqueta: 'a', nominal: 1000, deflactor: 100, poblacion: 10 },
      { etiqueta: 'b', nominal: 1050, deflactor: 100, poblacion: 12 },
    ]);
    expect(r2.anyos[1].crecimientoReal).toBeCloseTo(0.05, 10);
    expect(r2.anyos[1].perCapita).toBeLessThan(r2.anyos[0].perCapita);
  });
});
