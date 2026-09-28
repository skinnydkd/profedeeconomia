import { describe, it, expect } from 'vitest';
import {
  calcularIRPF,
  minimoPersonalYFamiliar,
  reduccionRendimientosTrabajo,
  MINIMO_PERSONAL,
  ESCALA_COMBINADA_2026,
} from './irpf';

describe('ESCALA_COMBINADA_2026', () => {
  it('starts at 0 and the brackets are continuous and increasing', () => {
    expect(ESCALA_COMBINADA_2026[0].desde).toBe(0);
    for (let i = 1; i < ESCALA_COMBINADA_2026.length; i++) {
      expect(ESCALA_COMBINADA_2026[i].desde).toBe(ESCALA_COMBINADA_2026[i - 1].hasta);
      expect(ESCALA_COMBINADA_2026[i].tipo).toBeGreaterThan(ESCALA_COMBINADA_2026[i - 1].tipo);
    }
    expect(ESCALA_COMBINADA_2026[ESCALA_COMBINADA_2026.length - 1].hasta).toBe(Infinity);
  });
});

describe('reduccionRendimientosTrabajo', () => {
  it('applies the full reduction for very low net work income', () => {
    // 2026: rendimientos netos <= 14.852 € -> reducción de 7.302 €
    expect(reduccionRendimientosTrabajo(10000)).toBe(7302);
  });
  it('phases the reduction out between 14.852 and 19.747,5 €', () => {
    const r = reduccionRendimientosTrabajo(17000);
    expect(r).toBeGreaterThan(0);
    expect(r).toBeLessThan(7302);
  });
  it('is zero above the upper threshold', () => {
    expect(reduccionRendimientosTrabajo(25000)).toBe(0);
  });
  it('follows the two slopes of art. 20 (RDL 4/2024)', () => {
    expect(reduccionRendimientosTrabajo(17000)).toBeCloseTo(7302 - 1.75 * (17000 - 14852), 6);
    expect(reduccionRendimientosTrabajo(17673.52)).toBeCloseTo(2364.34, 2);
    expect(reduccionRendimientosTrabajo(18500)).toBeCloseTo(1422.15, 2);
    expect(reduccionRendimientosTrabajo(19500)).toBeCloseTo(282.15, 2);
    expect(reduccionRendimientosTrabajo(19747.5)).toBeCloseTo(0, 1);
  });
});

describe('work income deductions', () => {
  it('takes the 2.000 € of other expenses (art. 19.2.f) before the scale', () => {
    const r = calcularIRPF(22440, { rendimientoNetoTrabajo: 22440 });
    expect(r.otrosGastos).toBe(2000);
    expect(r.reduccion).toBe(0);
    expect(r.baseLiquidable).toBe(20440);
    // 24.000 € gross minus 6,50 % SS: the quota the audit recomputed by hand.
    expect(r.cuota).toBeCloseTo(3243, 2);
  });

  it('matches the reference quotas for the SMI and the payroll presets', () => {
    const cuota = (neto: number) => calcularIRPF(neto, { rendimientoNetoTrabajo: neto }).cuota;
    expect(cuota(17094 * 0.935)).toBeCloseTo(590.89, 1); // SMI 2026, 1.221 × 14
    expect(cuota(21000 * 0.935)).toBeCloseTo(2524.62, 1); // 1.500 € × 14
    expect(cuota(30000 * 0.935)).toBeCloseTo(4926, 1); // 2.500 € × 12
    expect(cuota(40000 * 0.935)).toBeCloseTo(7745, 1);
  });

  it('never takes the work income below zero', () => {
    const r = calcularIRPF(5000, { rendimientoNetoTrabajo: 5000 });
    expect(r.otrosGastos + r.reduccion).toBeLessThanOrEqual(5000);
    expect(r.baseLiquidable).toBe(0);
    expect(r.cuota).toBe(0);
  });
});

describe('minimoPersonalYFamiliar', () => {
  it('returns the personal minimum with no dependants', () => {
    expect(minimoPersonalYFamiliar({})).toBe(MINIMO_PERSONAL);
  });
  it('adds the first-child minimum', () => {
    // 5.550 + 2.400
    expect(minimoPersonalYFamiliar({ hijos: 1 })).toBe(MINIMO_PERSONAL + 2400);
  });
  it('escalates with more children (2.400 + 2.700 + 4.000)', () => {
    expect(minimoPersonalYFamiliar({ hijos: 3 })).toBe(MINIMO_PERSONAL + 2400 + 2700 + 4000);
  });
  it('adds the disability minimum (33-65 %)', () => {
    // +3.000 €
    expect(minimoPersonalYFamiliar({ discapacidad: 'media' })).toBe(MINIMO_PERSONAL + 3000);
  });
  it('adds the higher disability minimum (>=65 %)', () => {
    // +12.000 €
    expect(minimoPersonalYFamiliar({ discapacidad: 'alta' })).toBe(MINIMO_PERSONAL + 12000);
  });
});

describe('calcularIRPF', () => {
  it('returns zero tax for income at or below the exempt threshold', () => {
    const r = calcularIRPF(12000, {});
    expect(r.cuota).toBe(0);
    expect(r.tipoMedio).toBe(0);
  });

  it('computes a positive tax for a middle income', () => {
    const r = calcularIRPF(30000, {});
    expect(r.cuota).toBeGreaterThan(0);
    // sanity: average rate for a 30k gross is in a teen-ish percentage band
    expect(r.tipoMedio).toBeGreaterThan(5);
    expect(r.tipoMedio).toBeLessThan(25);
  });

  it('children reduce the tax (more personal/family minimum)', () => {
    const sinHijos = calcularIRPF(30000, {});
    const conHijos = calcularIRPF(30000, { hijos: 2 });
    expect(conHijos.cuota).toBeLessThan(sinHijos.cuota);
  });

  it('disability reduces the tax', () => {
    const sin = calcularIRPF(30000, {});
    const con = calcularIRPF(30000, { discapacidad: 'alta' });
    expect(con.cuota).toBeLessThan(sin.cuota);
  });

  it('extra deductions reduce the tax', () => {
    const sin = calcularIRPF(30000, {});
    const con = calcularIRPF(30000, { deducciones: 1000 });
    expect(con.cuota).toBeLessThanOrEqual(sin.cuota);
  });

  it('never returns a negative tax (deductions cannot create a refund here)', () => {
    const r = calcularIRPF(15000, { deducciones: 100000 });
    expect(r.cuota).toBeGreaterThanOrEqual(0);
  });

  it('handles zero income', () => {
    const r = calcularIRPF(0, {});
    expect(r.cuota).toBe(0);
    expect(r.tipoMedio).toBe(0);
  });

  it('handles a very high income (top marginal rate applies)', () => {
    const r = calcularIRPF(500000, {});
    expect(r.cuota).toBeGreaterThan(0);
    // top marginal (state + model regional) is 47 %; the average rate stays well above the lower brackets
    expect(r.tipoMedio).toBeGreaterThan(35);
    expect(r.tipoMedio).toBeLessThan(47);
  });

  it('exposes a per-bracket breakdown that sums to the gross quota', () => {
    const r = calcularIRPF(40000, {});
    const sumaTramos = r.desglose.reduce((acc, t) => acc + t.cuota, 0);
    // gross quota (before minimum credit) should equal the sum of bracket quotas
    expect(sumaTramos).toBeCloseTo(r.cuotaIntegra, 2);
  });
});
