import { describe, it, expect } from 'vitest';
import { proyectar, ventasConCrecimiento, MESES, type Supuestos } from './tesoreria';

const plan: Supuestos = {
  saldoInicial: 10000,
  ventas: new Array(12).fill(20000),
  cobroContado: 0.4,
  mesesCobro: 2,
  comprasSobreVentas: 0.5,
  pagoContado: 0.5,
  mesesPago: 1,
  gastosFijos: 6000,
};

describe('proyectar', () => {
  const r = proyectar(plan);

  it('returns one row per month', () => {
    expect(r.valido).toBe(true);
    expect(r.meses).toHaveLength(MESES);
    expect(r.meses.map((m) => m.n)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it('collects the deferred part exactly `mesesCobro` months later', () => {
    // Month 1: only the cash part, 40 % of 20.000.
    expect(r.meses[0].cobros).toBeCloseTo(8000, 8);
    // Month 3: its own cash part plus the 60 % deferred from month 1.
    expect(r.meses[2].cobros).toBeCloseTo(8000 + 12000, 8);
  });

  it('pays fixed costs every month whatever else happens', () => {
    // Month 1: fixed costs plus half of that month's purchases (50 % of 20.000).
    expect(r.meses[0].pagos).toBeCloseTo(6000 + 5000, 8);
  });

  it('carries the balance forward month to month', () => {
    let saldo = plan.saldoInicial;
    for (const m of r.meses) {
      saldo += m.flujo;
      expect(m.saldo).toBeCloseTo(saldo, 8);
    }
    expect(r.saldoFinal).toBeCloseTo(saldo, 8);
  });

  it('bridges profit and cash with the outstanding tails', () => {
    // saldoFinal = saldoInicial + beneficio − lo no cobrado + lo no pagado.
    expect(r.saldoFinal).toBeCloseTo(
      plan.saldoInicial + r.beneficioPeriodo - r.cobrosPendientes + r.pagosPendientes,
      6,
    );
  });

  it('leaves the last months of credit sales uncollected', () => {
    // With two months of credit, months 11 and 12 fall outside the horizon.
    expect(r.cobrosPendientes).toBeCloseTo(2 * 20000 * 0.6, 8);
    expect(r.pagosPendientes).toBeCloseTo(1 * 10000 * 0.5, 8);
  });

  it('reports the profit for the horizon separately from the cash', () => {
    // 12 × (20.000 − 10.000 − 6.000) = 48.000 of profit.
    expect(r.beneficioPeriodo).toBeCloseTo(48000, 8);
    expect(r.saldoFinal).not.toBeCloseTo(plan.saldoInicial + r.beneficioPeriodo, 2);
  });
});

describe('el agujero de caja', () => {
  it('finds the lowest balance and what it would take to cover it', () => {
    // A plan that is profitable but collects late runs out of money early.
    const apretado = proyectar({ ...plan, saldoInicial: 2000, cobroContado: 0, mesesCobro: 3 });
    expect(apretado.saldoMinimo).toBeLessThan(0);
    expect(apretado.mesSaldoMinimo).toBeGreaterThan(0);
    expect(apretado.mesesEnNegativo).toBeGreaterThan(0);
    expect(apretado.necesidadFinanciacion).toBeCloseTo(-apretado.saldoMinimo, 8);
    // And it is profitable all the same: that is the whole lesson.
    expect(apretado.beneficioPeriodo).toBeGreaterThan(0);
  });

  it('asks for no financing when the balance never goes negative', () => {
    const holgado = proyectar({ ...plan, saldoInicial: 100000 });
    expect(holgado.mesesEnNegativo).toBe(0);
    expect(holgado.necesidadFinanciacion).toBe(0);
  });

  it('improves when customers pay sooner, with the same profit', () => {
    const tarde = proyectar({ ...plan, cobroContado: 0, mesesCobro: 3 });
    const pronto = proyectar({ ...plan, cobroContado: 1, mesesCobro: 0 });
    expect(pronto.saldoMinimo).toBeGreaterThan(tarde.saldoMinimo);
    expect(pronto.beneficioPeriodo).toBeCloseTo(tarde.beneficioPeriodo, 8);
  });

  it('collapses to profit plus opening balance when everything is spot', () => {
    const contado = proyectar({ ...plan, cobroContado: 1, mesesCobro: 0, pagoContado: 1, mesesPago: 0 });
    expect(contado.cobrosPendientes).toBeCloseTo(0, 10);
    expect(contado.pagosPendientes).toBeCloseTo(0, 10);
    expect(contado.saldoFinal).toBeCloseTo(plan.saldoInicial + contado.beneficioPeriodo, 6);
  });
});

describe('validación', () => {
  it('rejects a sales array of the wrong length', () => {
    expect(proyectar({ ...plan, ventas: new Array(11).fill(1000) }).valido).toBe(false);
  });
  it('rejects fractions outside [0, 1] and impossible delays', () => {
    expect(proyectar({ ...plan, cobroContado: 1.2 }).valido).toBe(false);
    expect(proyectar({ ...plan, comprasSobreVentas: -0.1 }).valido).toBe(false);
    expect(proyectar({ ...plan, mesesCobro: 2.5 }).valido).toBe(false);
    expect(proyectar({ ...plan, mesesPago: 9 }).valido).toBe(false);
    expect(proyectar({ ...plan, gastosFijos: -100 }).valido).toBe(false);
  });
  it('rejects a negative or non-numeric sale', () => {
    const malas = [...plan.ventas]; malas[4] = -1;
    expect(proyectar({ ...plan, ventas: malas }).valido).toBe(false);
  });
});

describe('ventasConCrecimiento', () => {
  it('compounds the monthly rate over twelve months', () => {
    const v = ventasConCrecimiento(10000, 0.05);
    expect(v).toHaveLength(MESES);
    expect(v[0]).toBeCloseTo(10000, 8);
    expect(v[11]).toBeCloseTo(10000 * Math.pow(1.05, 11), 6);
  });
  it('stays flat at zero growth', () => {
    expect(ventasConCrecimiento(8000, 0).every((x) => x === 8000)).toBe(true);
  });
});
