import { describe, it, expect } from 'vitest';
import { valorActual, valorResidualGordon, valorarDCF } from './dcf';

describe('valorActual', () => {
  it('discounts a single flow received in one year', () => {
    // 110 € a 1 año al 10 % -> 100 €
    expect(valorActual(110, 0.1, 1)).toBeCloseTo(100, 6);
  });

  it('discounts a flow received in two years', () => {
    // 121 € a 2 años al 10 % -> 100 €
    expect(valorActual(121, 0.1, 2)).toBeCloseTo(100, 6);
  });

  it('returns the flow unchanged at t=0', () => {
    expect(valorActual(500, 0.1, 0)).toBeCloseTo(500, 6);
  });
});

describe('valorResidualGordon', () => {
  it('computes the Gordon perpetuity when WACC > g', () => {
    // 100 · (1 + 0,02) / (0,10 − 0,02) = 102 / 0,08 = 1275
    expect(valorResidualGordon(100, 0.1, 0.02)).toBeCloseTo(1275, 6);
  });

  it('reduces to flujo/WACC when g = 0', () => {
    // 100 · 1 / 0,10 = 1000
    expect(valorResidualGordon(100, 0.1, 0)).toBeCloseTo(1000, 6);
  });

  it('returns null when g equals WACC (no convergence)', () => {
    expect(valorResidualGordon(100, 0.1, 0.1)).toBeNull();
  });

  it('returns null when g exceeds WACC', () => {
    expect(valorResidualGordon(100, 0.1, 0.15)).toBeNull();
  });
});

describe('valorarDCF', () => {
  it('values a single one-year flow with no terminal value', () => {
    const r = valorarDCF({ flujos: [110], wacc: 0.1, valorResidualManual: 0 });
    expect(r.valido).toBe(true);
    expect(r.valorActualFlujos).toBeCloseTo(100, 6);
    expect(r.valorActualResidual).toBe(0);
    expect(r.valorEmpresa).toBeCloseTo(100, 6);
    expect(r.desglose).toHaveLength(1);
    expect(r.desglose[0]).toMatchObject({ anio: 1, flujo: 110 });
    expect(r.desglose[0].valorActual).toBeCloseTo(100, 6);
  });

  it('discounts a series of flows', () => {
    // 100 €/año durante 3 años al 10 % (sin residual)
    // 100/1,1 + 100/1,21 + 100/1,331 = 90,909 + 82,645 + 75,131 = 248,685
    const r = valorarDCF({ flujos: [100, 100, 100], wacc: 0.1, valorResidualManual: 0 });
    expect(r.valorActualFlujos).toBeCloseTo(248.685, 3);
    expect(r.valorEmpresa).toBeCloseTo(248.685, 3);
    expect(r.desglose).toHaveLength(3);
  });

  it('raising the WACC lowers the enterprise value', () => {
    const base = { flujos: [100, 120, 140], crecimientoPerpetuo: 0.02 };
    const bajo = valorarDCF({ ...base, wacc: 0.08 });
    const alto = valorarDCF({ ...base, wacc: 0.12 });
    expect(alto.valorEmpresa).toBeLessThan(bajo.valorEmpresa);
  });

  it('adds the discounted Gordon terminal value to the enterprise value', () => {
    // Flujos: [100, 100], WACC 10 %, g 2 %.
    // VR(año 2) = 100·1,02/0,08 = 1275 ; VA(VR) = 1275/1,21 = 1053,719
    // VA flujos = 90,909 + 82,645 = 173,554 ; total = 1227,273
    const r = valorarDCF({ flujos: [100, 100], wacc: 0.1, crecimientoPerpetuo: 0.02 });
    expect(r.valorResidual).toBeCloseTo(1275, 3);
    expect(r.valorActualResidual).toBeCloseTo(1053.719, 3);
    expect(r.valorActualFlujos).toBeCloseTo(173.554, 3);
    expect(r.valorEmpresa).toBeCloseTo(1227.273, 2);
    expect(r.aviso).toBeNull();
  });

  it('handles g >= WACC without Infinity / NaN and warns', () => {
    const r = valorarDCF({ flujos: [100, 100], wacc: 0.05, crecimientoPerpetuo: 0.08 });
    expect(r.valido).toBe(true);
    expect(Number.isFinite(r.valorEmpresa)).toBe(true);
    expect(Number.isNaN(r.valorEmpresa)).toBe(false);
    expect(r.valorResidual).toBe(0);
    expect(r.valorActualResidual).toBe(0);
    expect(r.aviso).not.toBeNull();
    // The valuation falls back to the explicit flows only.
    expect(r.valorEmpresa).toBeCloseTo(r.valorActualFlujos, 6);
  });

  it('flags empty flows as invalid', () => {
    const r = valorarDCF({ flujos: [], wacc: 0.1 });
    expect(r.valido).toBe(false);
    expect(r.valorEmpresa).toBe(0);
    expect(r.desglose).toHaveLength(0);
    expect(r.aviso).not.toBeNull();
  });

  it('flags an invalid WACC as invalid', () => {
    const r = valorarDCF({ flujos: [100], wacc: -1.5 });
    expect(r.valido).toBe(false);
    expect(r.aviso).not.toBeNull();
  });

  it('uses the manual terminal value over the Gordon perpetuity when provided', () => {
    const r = valorarDCF({
      flujos: [100],
      wacc: 0.1,
      crecimientoPerpetuo: 0.05,
      valorResidualManual: 500,
    });
    expect(r.valorResidual).toBe(500);
    // VA(500) at year 1 = 500/1,1 = 454,545
    expect(r.valorActualResidual).toBeCloseTo(454.545, 3);
  });
});
