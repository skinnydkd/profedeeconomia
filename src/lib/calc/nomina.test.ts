import { describe, it, expect } from 'vitest';
import {
  BASE_MAXIMA_MENSUAL_2026,
  baseCotizacion,
  calcularNomina,
  COTIZACIONES_TRABAJADOR_2026,
  tasaDesempleo,
} from './nomina';

describe('COTIZACIONES_TRABAJADOR_2026', () => {
  it('matches the official 2026 worker rates', () => {
    expect(COTIZACIONES_TRABAJADOR_2026.contingenciasComunes).toBeCloseTo(0.047, 5);
    expect(COTIZACIONES_TRABAJADOR_2026.formacionProfesional).toBeCloseTo(0.001, 5);
    expect(COTIZACIONES_TRABAJADOR_2026.mei).toBeCloseTo(0.0015, 5);
  });
});

describe('tasaDesempleo', () => {
  it('is 1,55 % for permanent contracts and 1,60 % for temporary', () => {
    expect(tasaDesempleo('indefinido')).toBeCloseTo(0.0155, 5);
    expect(tasaDesempleo('temporal')).toBeCloseTo(0.016, 5);
  });
});

describe('calcularNomina', () => {
  it('computes SS contributions as the correct percentage of gross (permanent)', () => {
    const bruto = 24000;
    const r = calcularNomina(bruto, { contrato: 'indefinido' });
    // 4,70 + 1,55 + 0,10 + 0,15 = 6,50 %
    const tasaTotal = 0.047 + 0.0155 + 0.001 + 0.0015;
    expect(r.cotizaciones.total).toBeCloseTo(bruto * tasaTotal, 4);
    expect(r.cotizaciones.contingenciasComunes).toBeCloseTo(bruto * 0.047, 4);
    expect(r.cotizaciones.desempleo).toBeCloseTo(bruto * 0.0155, 4);
  });

  it('uses the higher unemployment rate for temporary contracts', () => {
    const bruto = 24000;
    const indef = calcularNomina(bruto, { contrato: 'indefinido' });
    const temp = calcularNomina(bruto, { contrato: 'temporal' });
    expect(temp.cotizaciones.desempleo).toBeGreaterThan(indef.cotizaciones.desempleo);
    expect(temp.cotizaciones.total).toBeGreaterThan(indef.cotizaciones.total);
  });

  it('low salary => near-zero IRPF retention', () => {
    const r = calcularNomina(12000, {});
    expect(r.irpf.cuota).toBeLessThan(50);
  });

  it('middle salary => positive IRPF retention and a sensible net', () => {
    const bruto = 24000;
    const r = calcularNomina(bruto, {});
    expect(r.irpf.cuota).toBeGreaterThan(0);
    expect(r.liquidoAnual).toBeGreaterThan(0);
    expect(r.liquidoAnual).toBeLessThan(bruto);
    // net = gross - SS - IRPF
    expect(r.liquidoAnual).toBeCloseTo(bruto - r.cotizaciones.total - r.irpf.cuota, 4);
  });

  it('declaring children lowers the IRPF retention and raises net pay', () => {
    const bruto = 30000;
    const sinHijos = calcularNomina(bruto, {});
    const conHijos = calcularNomina(bruto, { hijos: 2 });
    expect(conHijos.irpf.cuota).toBeLessThan(sinHijos.irpf.cuota);
    expect(conHijos.liquidoAnual).toBeGreaterThan(sinHijos.liquidoAnual);
  });

  it('disability lowers the IRPF retention', () => {
    const bruto = 30000;
    const sin = calcularNomina(bruto, {});
    const con = calcularNomina(bruto, { discapacidad: 'alta' });
    expect(con.irpf.cuota).toBeLessThan(sin.irpf.cuota);
  });

  it('IRPF feeds on the base after SS contributions are deducted', () => {
    const bruto = 24000;
    const r = calcularNomina(bruto, {});
    expect(r.baseIRPF).toBeCloseTo(bruto - r.cotizaciones.total, 4);
  });

  it('spreads the SS over twelve monthly contributions, also with 14 payments', () => {
    const r = calcularNomina(24000, { pagas: 14 });
    expect(r.cotizaciones.mensual).toBeCloseTo(r.cotizaciones.total / 12, 4);
    // The U5 example: 18.200 € a year pay 98,58 € of SS a month (6,50 % of 18.200 / 12).
    expect(calcularNomina(18200, { pagas: 14 }).cotizaciones.mensual).toBeCloseTo(98.58, 2);
  });

  it('with 14 payments, an ordinary month carries SS and the two extra pays only IRPF', () => {
    const r = calcularNomina(24000, { pagas: 14 });
    expect(r.liquidoMensual).toBeCloseTo(24000 / 14 - r.cotizaciones.total / 12 - r.irpf.cuota / 14, 4);
    expect(r.liquidoPagaExtra).toBeCloseTo(24000 / 14 - r.irpf.cuota / 14, 4);
    // Twelve ordinary months plus two extra pays make up the annual net.
    expect(12 * r.liquidoMensual + 2 * (r.liquidoPagaExtra ?? 0)).toBeCloseTo(r.liquidoAnual, 4);
  });

  it('with 12 payments every month is the same', () => {
    const r = calcularNomina(24000, { pagas: 12 });
    expect(r.liquidoMensual).toBeCloseTo(r.liquidoAnual / 12, 4);
    expect(r.cotizaciones.mensual).toBeCloseTo(r.cotizaciones.total / 12, 4);
    expect(r.liquidoPagaExtra).toBeNull();
  });

  it('handles gross 0 (no contributions, no tax, no net)', () => {
    const r = calcularNomina(0, {});
    expect(r.cotizaciones.total).toBe(0);
    expect(r.irpf.cuota).toBe(0);
    expect(r.liquidoAnual).toBe(0);
  });

  it('caps the contribution base and adds the solidarity contribution above it', () => {
    // 6.000 € × 14: the base stops at 12 × 5.101,20 €, and the worker pays about
    // 1/6 of 1,15 % and 1,25 % on the part above it.
    const r = calcularNomina(84000, {});
    expect(r.topeBase).toBe(true);
    expect(r.baseCotizacion).toBeCloseTo(12 * BASE_MAXIMA_MENSUAL_2026, 6);
    expect(r.cotizaciones.solidaridad).toBeCloseTo(46.28, 1);
    expect(r.cotizaciones.total).toBeCloseTo(4025.22, 1);
  });

  it('leaves ordinary salaries untouched by the cap', () => {
    const r = calcularNomina(24000, {});
    expect(r.topeBase).toBe(false);
    expect(r.cotizaciones.solidaridad).toBe(0);
    expect(r.cotizaciones.total).toBeCloseTo(24000 * 0.065, 6);
    expect(baseCotizacion(24000).solidaridadTotal).toBe(0);
  });

  it('handles a very high salary (high effective tax, net still positive)', () => {
    const r = calcularNomina(200000, {});
    expect(r.irpf.cuota).toBeGreaterThan(0);
    expect(r.liquidoAnual).toBeGreaterThan(0);
    expect(r.liquidoAnual).toBeLessThan(200000);
  });
});
