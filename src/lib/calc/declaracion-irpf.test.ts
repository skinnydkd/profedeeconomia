import { describe, it, expect } from 'vitest';
import { simularDeclaracion } from './declaracion-irpf';
import { calcularIRPF } from './irpf';

describe('simularDeclaracion', () => {
  it('returns "resultado 0" when retentions exactly equal the annual quota', () => {
    // First find the quota for a salary, then feed that exact amount as retentions.
    const probe = simularDeclaracion({ rendimientosTrabajo: 24000, retencionesPracticadas: 0 });
    const r = simularDeclaracion({
      rendimientosTrabajo: 24000,
      retencionesPracticadas: probe.cuotaIRPF,
    });
    expect(r.resultado).toBeCloseTo(0, 6);
    expect(r.aPagar).toBe(false);
    expect(r.aDevolver).toBe(false);
  });

  it('returns "a devolver" (negative resultado) when retentions exceed the quota', () => {
    const probe = simularDeclaracion({ rendimientosTrabajo: 24000, retencionesPracticadas: 0 });
    const r = simularDeclaracion({
      rendimientosTrabajo: 24000,
      retencionesPracticadas: probe.cuotaIRPF + 500,
    });
    expect(r.resultado).toBeLessThan(0);
    expect(r.resultado).toBeCloseTo(-500, 4);
    expect(r.aDevolver).toBe(true);
    expect(r.aPagar).toBe(false);
    expect(r.importe).toBeCloseTo(500, 4);
  });

  it('returns "a pagar" (positive resultado) when retentions fall short of the quota', () => {
    const probe = simularDeclaracion({ rendimientosTrabajo: 24000, retencionesPracticadas: 0 });
    const r = simularDeclaracion({
      rendimientosTrabajo: 24000,
      retencionesPracticadas: probe.cuotaIRPF - 300,
    });
    expect(r.resultado).toBeGreaterThan(0);
    expect(r.resultado).toBeCloseTo(300, 4);
    expect(r.aPagar).toBe(true);
    expect(r.aDevolver).toBe(false);
    expect(r.importe).toBeCloseTo(300, 4);
  });

  it('declaring children lowers the quota, so the same retentions give more to refund', () => {
    const sinHijos = simularDeclaracion({ rendimientosTrabajo: 30000, retencionesPracticadas: 4000 });
    const conHijos = simularDeclaracion({
      rendimientosTrabajo: 30000,
      retencionesPracticadas: 4000,
      hijos: 2,
    });
    expect(conHijos.cuotaIRPF).toBeLessThan(sinHijos.cuotaIRPF);
    // Lower quota with identical retentions => more favourable (smaller resultado).
    expect(conHijos.resultado).toBeLessThan(sinHijos.resultado);
  });

  it('disability lowers the quota too', () => {
    const sin = simularDeclaracion({ rendimientosTrabajo: 30000, retencionesPracticadas: 4000 });
    const con = simularDeclaracion({
      rendimientosTrabajo: 30000,
      retencionesPracticadas: 4000,
      discapacidad: 'alta',
    });
    expect(con.cuotaIRPF).toBeLessThan(sin.cuotaIRPF);
    expect(con.resultado).toBeLessThan(sin.resultado);
  });

  it('handles the no-income case (no quota; retentions are fully refunded)', () => {
    const r = simularDeclaracion({ rendimientosTrabajo: 0, retencionesPracticadas: 0 });
    expect(r.cuotaIRPF).toBe(0);
    expect(r.retenciones).toBe(0);
    expect(r.resultado).toBe(0);
    expect(r.aPagar).toBe(false);
    expect(r.aDevolver).toBe(false);

    const conRetenciones = simularDeclaracion({ rendimientosTrabajo: 0, retencionesPracticadas: 200 });
    expect(conRetenciones.cuotaIRPF).toBe(0);
    expect(conRetenciones.resultado).toBeCloseTo(-200, 6);
    expect(conRetenciones.aDevolver).toBe(true);
  });

  it('cuotaIRPF is coherent with calcularIRPF on the same taxable base', () => {
    const r = simularDeclaracion({ rendimientosTrabajo: 24000, retencionesPracticadas: 0 });
    // The simulator exposes the taxable base it built; calcularIRPF on it must match.
    const directo = calcularIRPF(r.baseImponible, { rendimientoNetoTrabajo: r.baseImponible });
    expect(r.cuotaIRPF).toBeCloseTo(directo.cuota, 6);
  });

  it('the taxable base is the gross work income minus Social Security contributions', () => {
    const r = simularDeclaracion({ rendimientosTrabajo: 24000, retencionesPracticadas: 0 });
    expect(r.cotizaciones).toBeGreaterThan(0);
    expect(r.baseImponible).toBeCloseTo(24000 - r.cotizaciones, 6);
  });

  it('basic savings income (capital mobiliario) raises the quota', () => {
    const sin = simularDeclaracion({ rendimientosTrabajo: 24000, retencionesPracticadas: 0 });
    const con = simularDeclaracion({
      rendimientosTrabajo: 24000,
      retencionesPracticadas: 0,
      rendimientosCapital: 2000,
    });
    expect(con.cuotaIRPF).toBeGreaterThan(sin.cuotaIRPF);
  });

  it('clamps negative inputs to zero', () => {
    const r = simularDeclaracion({ rendimientosTrabajo: -5000, retencionesPracticadas: -100 });
    expect(r.cuotaIRPF).toBe(0);
    expect(r.retenciones).toBe(0);
    expect(r.resultado).toBe(0);
  });

  it('round-trips with a realistic over-withheld worker (typical "a devolver")', () => {
    // Workers commonly have a bit more retained than due => refund.
    const probe = simularDeclaracion({ rendimientosTrabajo: 28000, retencionesPracticadas: 0 });
    const r = simularDeclaracion({
      rendimientosTrabajo: 28000,
      retencionesPracticadas: probe.cuotaIRPF * 1.1,
    });
    expect(r.aDevolver).toBe(true);
    expect(r.importe).toBeGreaterThan(0);
    expect(r.importe).toBeCloseTo(probe.cuotaIRPF * 0.1, 4);
  });
});
