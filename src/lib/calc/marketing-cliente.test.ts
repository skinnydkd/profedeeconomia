import { describe, it, expect } from 'vitest';
import { analizar, retencionPara, type Entradas } from './marketing-cliente';

const base: Entradas = {
  gastoMarketing: 6000,
  nuevosClientes: 120,
  ticketMedio: 25,
  comprasAnio: 8,
  margenBruto: 0.4,
  retencion: 0.75,
};

describe('analizar', () => {
  const r = analizar(base);
  it('computes the acquisition cost per customer', () => {
    expect(r.cac).toBeCloseTo(50, 10);
  });
  it('turns retention into an expected life', () => {
    // 1 / (1 − 0,75) = 4 years.
    expect(r.vidaMedia).toBeCloseTo(4, 10);
  });
  it('builds the lifetime value from margin, not revenue', () => {
    expect(r.ingresoAnualCliente).toBeCloseTo(200, 10);
    expect(r.margenAnualCliente).toBeCloseTo(80, 10);
    expect(r.ltv).toBeCloseTo(320, 10);
  });
  it('reports the ratio and the payback in months', () => {
    expect(r.ratio).toBeCloseTo(6.4, 10);
    // 50 € of cost against 80 € of margin a year: 7,5 months.
    expect(r.paybackMeses).toBeCloseTo(7.5, 10);
    expect(r.veredicto).toBe('sano');
  });
});

describe('veredicto', () => {
  it('flags a business that loses money on every customer', () => {
    const r = analizar({ ...base, gastoMarketing: 60000 });
    expect(r.cac).toBeCloseTo(500, 10);
    expect(r.ratio).toBeLessThan(1);
    expect(r.veredicto).toBe('perdida');
  });
  it('calls the middle band tight rather than healthy', () => {
    const r = analizar({ ...base, gastoMarketing: 18000 });
    expect(r.ratio).toBeCloseTo(2.133, 3);
    expect(r.veredicto).toBe('ajustado');
  });
  it('puts the boundary exactly at three', () => {
    // CAC of 320/3 leaves the ratio at 3, which already counts as healthy.
    const r = analizar({ ...base, gastoMarketing: (320 / 3) * 120 });
    expect(r.ratio).toBeCloseTo(3, 10);
    expect(r.veredicto).toBe('sano');
  });
});

describe('sensibilidad', () => {
  it('rewards retention faster than it rewards the ticket', () => {
    const masTicket = analizar({ ...base, ticketMedio: base.ticketMedio * 1.2 });
    const masRetencion = analizar({ ...base, retencion: 0.8 });
    expect(masTicket.ltv).toBeCloseTo(384, 10);
    expect(masRetencion.ltv).toBeCloseTo(400, 10);
    expect(masRetencion.ltv).toBeGreaterThan(masTicket.ltv);
  });
  it('leaves the payback untouched when only retention moves', () => {
    // Payback depends on the yearly margin, not on how many years it lasts.
    expect(analizar({ ...base, retencion: 0.9 }).paybackMeses).toBeCloseTo(analizar(base).paybackMeses, 10);
  });
});

describe('casos límite', () => {
  it('treats zero retention as a single year', () => {
    const r = analizar({ ...base, retencion: 0 });
    expect(r.vidaMedia).toBeCloseTo(1, 10);
    expect(r.ltv).toBeCloseTo(80, 10);
  });
  it('rejects a customer who never leaves', () => {
    expect(analizar({ ...base, retencion: 1 }).valido).toBe(false);
  });
  it('rejects impossible inputs', () => {
    expect(analizar({ ...base, nuevosClientes: 0 }).valido).toBe(false);
    expect(analizar({ ...base, gastoMarketing: 0 }).valido).toBe(false);
    expect(analizar({ ...base, margenBruto: 0 }).valido).toBe(false);
    expect(analizar({ ...base, margenBruto: 1.4 }).valido).toBe(false);
    expect(analizar({ ...base, retencion: -0.2 }).valido).toBe(false);
  });
});

describe('retencionPara', () => {
  it('inverts the expected life', () => {
    expect(retencionPara(4)).toBeCloseTo(0.75, 10);
    expect(retencionPara(1)).toBeCloseTo(0, 10);
  });
  it('rejects a life shorter than a year', () => {
    expect(retencionPara(0.5)).toBeNaN();
  });
});
