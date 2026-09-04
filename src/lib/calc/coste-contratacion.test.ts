import { describe, it, expect } from 'vitest';
import {
  calcularCoste, tasaTotalEmpresa, tasaDesempleoEmpresa,
  COTIZACIONES_EMPRESA_2026, TASA_AT_EP_POR_DEFECTO,
} from './coste-contratacion';
import { calcularNomina } from './nomina';

describe('tasaTotalEmpresa', () => {
  it('adds up the 2026 employer rates for an open-ended contract', () => {
    // 23,60 + 5,50 + 1,50 + 0,20 + 0,60 + 0,75 = 32,15 %
    expect(tasaTotalEmpresa('indefinido')).toBeCloseTo(0.3215, 10);
  });
  it('is higher on a temporary contract', () => {
    expect(tasaTotalEmpresa('temporal')).toBeGreaterThan(tasaTotalEmpresa('indefinido'));
    expect(tasaTotalEmpresa('temporal')).toBeCloseTo(0.3335, 10);
  });
  it('moves with the accident rate', () => {
    expect(tasaTotalEmpresa('indefinido', 0.06)).toBeCloseTo(0.3215 - 0.015 + 0.06, 10);
  });
  it('charges more for unemployment on a temporary contract', () => {
    expect(tasaDesempleoEmpresa('temporal')).toBe(COTIZACIONES_EMPRESA_2026.desempleoTemporal);
    expect(tasaDesempleoEmpresa('indefinido')).toBe(COTIZACIONES_EMPRESA_2026.desempleoIndefinido);
  });
});

describe('calcularCoste', () => {
  const r = calcularCoste(24000);

  it('breaks the employer contributions down to the same total', () => {
    const c = r.cotizacionesEmpresa;
    const suma = c.contingenciasComunes + c.desempleo + c.atEp + c.fogasa + c.formacionProfesional + c.mei;
    expect(c.total).toBeCloseTo(suma, 8);
    expect(c.total).toBeCloseTo(24000 * 0.3215, 8);
  });
  it('puts the total cost about a third above the gross salary', () => {
    expect(r.costeTotalAnual).toBeCloseTo(24000 * 1.3215, 8);
    expect(r.sobrecosteSobreBruto).toBeCloseTo(0.3215, 10);
    expect(r.costeTotalMensual).toBeCloseTo(r.costeTotalAnual / 12, 8);
  });
  it('divides by effective hours, not by contracted ones', () => {
    // 40 h × 46 weeks = 1.840 h, well below 40 × 52.
    expect(r.horasEfectivas).toBe(1840);
    expect(r.costePorHora).toBeCloseTo(r.costeTotalAnual / 1840, 8);
    const menosVacaciones = calcularCoste(24000, { semanasTrabajadas: 52 });
    expect(menosVacaciones.costePorHora).toBeLessThan(r.costePorHora);
  });
  it('measures the wedge against the take-home pay from nomina.ts', () => {
    const nomina = calcularNomina(24000, { contrato: 'indefinido' });
    expect(r.liquidoAnual).toBeCloseTo(nomina.liquidoAnual, 8);
    expect(r.cunaFiscal).toBeCloseTo(r.costeTotalAnual - nomina.liquidoAnual, 8);
    expect(r.cunaFiscalPorcentaje).toBeGreaterThan(0);
    expect(r.cunaFiscalPorcentaje).toBeLessThan(1);
  });
  it('passes the payroll options through to the worker side', () => {
    const conHijos = calcularCoste(24000, { hijos: 2 });
    // Children only change the worker's IRPF, never the employer's bill.
    expect(conHijos.costeTotalAnual).toBeCloseTo(r.costeTotalAnual, 8);
    expect(conHijos.liquidoAnual).toBeGreaterThan(r.liquidoAnual);
  });
  it('costs more on a temporary contract at the same salary', () => {
    expect(calcularCoste(24000, { contrato: 'temporal' }).costeTotalAnual)
      .toBeGreaterThan(r.costeTotalAnual);
  });
  it('uses the office default when no accident rate is given', () => {
    expect(r.cotizacionesEmpresa.atEp).toBeCloseTo(24000 * TASA_AT_EP_POR_DEFECTO, 8);
  });
  it('rejects impossible inputs', () => {
    expect(calcularCoste(0).valido).toBe(false);
    expect(calcularCoste(-1000).valido).toBe(false);
    expect(calcularCoste(24000, { tasaAtEp: -0.01 }).valido).toBe(false);
    expect(calcularCoste(24000, { tasaAtEp: 0.5 }).valido).toBe(false);
    expect(calcularCoste(24000, { horasSemana: 0 }).valido).toBe(false);
    expect(calcularCoste(24000, { semanasTrabajadas: 0 }).valido).toBe(false);
  });
});
