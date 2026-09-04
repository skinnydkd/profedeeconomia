import { describe, it, expect } from 'vitest';
import { calcular, type Entradas } from './cuenta-resultados';

const empresa: Entradas = {
  ventas: 500000,
  aprovisionamientos: 200000,
  gastosPersonal: 150000,
  otrosGastosExplotacion: 60000,
  amortizacion: 30000,
  ingresosFinancieros: 2000,
  gastosFinancieros: 12000,
  tipoImpositivo: 0.25,
};

describe('calcular', () => {
  const r = calcular(empresa);
  it('walks down the five levels', () => {
    expect(r.margenBruto).toBeCloseTo(300000, 8);
    expect(r.ebitda).toBeCloseTo(90000, 8);
    expect(r.baii).toBeCloseTo(60000, 8);
    expect(r.resultadoFinanciero).toBeCloseTo(-10000, 8);
    expect(r.bai).toBeCloseTo(50000, 8);
    expect(r.impuesto).toBeCloseTo(12500, 8);
    expect(r.resultado).toBeCloseTo(37500, 8);
  });
  it('expresses each level as a share of turnover', () => {
    expect(r.niveles.map((n) => n.clave)).toEqual(['margenBruto', 'ebitda', 'baii', 'bai', 'resultado']);
    expect(r.niveles[0].sobreVentas).toBeCloseTo(0.6, 10);
    expect(r.niveles[4].sobreVentas).toBeCloseTo(0.075, 10);
  });
  it('separates the operating result from the financial one', () => {
    // BAII only falls when operations get worse; interest lives below it.
    const masIntereses = calcular({ ...empresa, gastosFinancieros: 40000 });
    expect(masIntereses.baii).toBeCloseTo(r.baii, 8);
    expect(masIntereses.bai).toBeLessThan(r.bai);
  });
  it('keeps EBITDA above BAII by exactly the depreciation', () => {
    expect(r.ebitda - r.baii).toBeCloseTo(empresa.amortizacion, 8);
  });
});

describe('pérdidas', () => {
  const r = calcular({ ...empresa, gastosPersonal: 300000 });
  it('flags a loss before tax', () => {
    expect(r.bai).toBeLessThan(0);
    expect(r.perdidas).toBe(true);
  });
  it('charges no tax on a loss', () => {
    expect(r.impuesto).toBe(0);
    expect(r.resultado).toBeCloseTo(r.bai, 8);
  });
  it('can lose money at the bottom while EBITDA is still positive', () => {
    // Depreciation and interest are enough to turn a positive EBITDA around.
    const apalancada = calcular({ ...empresa, amortizacion: 70000, gastosFinancieros: 45000 });
    expect(apalancada.ebitda).toBeGreaterThan(0);
    expect(apalancada.bai).toBeLessThan(0);
  });
});

describe('casos límite', () => {
  it('charges tax at the rate given', () => {
    // The reduced 15 % rate for a new company's first profitable years.
    expect(calcular({ ...empresa, tipoImpositivo: 0.15 }).impuesto).toBeCloseTo(7500, 8);
    expect(calcular({ ...empresa, tipoImpositivo: 0 }).resultado).toBeCloseTo(50000, 8);
  });
  it('rejects a company with no turnover', () => {
    expect(calcular({ ...empresa, ventas: 0 }).valido).toBe(false);
  });
  it('rejects negative expenses and impossible rates', () => {
    expect(calcular({ ...empresa, gastosPersonal: -1 }).valido).toBe(false);
    expect(calcular({ ...empresa, tipoImpositivo: 1.2 }).valido).toBe(false);
    expect(calcular({ ...empresa, amortizacion: NaN }).valido).toBe(false);
  });
});
