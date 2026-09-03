import { describe, it, expect } from 'vitest';
import { comparar, cuotaEscala, puntoDeCorte, FORMAS } from './forma-juridica';
import { ESCALA_IRPF_2026 } from './irpf';

describe('FORMAS', () => {
  it('separates the forms that shield personal assets from the ones that do not', () => {
    expect(FORMAS.autonomo.responsabilidadIlimitada).toBe(true);
    expect(FORMAS['comunidad-bienes'].responsabilidadIlimitada).toBe(true);
    expect(FORMAS.sl.responsabilidadIlimitada).toBe(false);
    expect(FORMAS.cooperativa.responsabilidadIlimitada).toBe(false);
  });
  it('ties legal personality to the taxation route', () => {
    for (const f of Object.values(FORMAS)) {
      expect(f.tributacion).toBe(f.personalidadJuridica ? 'sociedades' : 'irpf');
    }
  });
  it('needs at least two founders for the collective forms', () => {
    expect(FORMAS['comunidad-bienes'].sociosMinimos).toBe(2);
    expect(FORMAS.cooperativa.sociosMinimos).toBe(2);
    expect(FORMAS.autonomo.sociosMinimos).toBe(1);
  });
});

describe('cuotaEscala', () => {
  it('taxes nothing on a zero or negative base', () => {
    expect(cuotaEscala(0)).toBe(0);
    expect(cuotaEscala(-100)).toBe(0);
  });
  it('applies only the first bracket inside it', () => {
    expect(cuotaEscala(10000)).toBeCloseTo(10000 * 0.19, 6);
  });
  it('applies each bracket to its own slice, not the whole base', () => {
    // 12.450 at 19 % + 7.550 at 24 %
    expect(cuotaEscala(20000)).toBeCloseTo(12450 * 0.19 + 7550 * 0.24, 6);
  });
  it('is monotonic and its average rate rises with the base', () => {
    const a = cuotaEscala(20000) / 20000;
    const b = cuotaEscala(60000) / 60000;
    const c = cuotaEscala(200000) / 200000;
    expect(a).toBeLessThan(b);
    expect(b).toBeLessThan(c);
  });
});

describe('puntoDeCorte', () => {
  it('finds the profit where a flat rate starts costing less than the scale', () => {
    const corte = puntoDeCorte(0.25);
    expect(Number.isFinite(corte)).toBe(true);
    // Below it the scale is cheaper, above it the flat rate is.
    expect(cuotaEscala(corte - 1000)).toBeLessThan((corte - 1000) * 0.25);
    expect(cuotaEscala(corte + 1000)).toBeGreaterThan((corte + 1000) * 0.25);
  });
  it('moves the crossover up when the flat rate rises', () => {
    expect(puntoDeCorte(0.30)).toBeGreaterThan(puntoDeCorte(0.25));
  });
  it('has no crossover when the flat rate is above the top marginal rate', () => {
    expect(puntoDeCorte(0.50)).toBeNaN();
  });
  it('rejects a rate outside 0–1', () => {
    expect(puntoDeCorte(1.5)).toBeNaN();
    expect(puntoDeCorte(-0.1)).toBeNaN();
  });
});

describe('comparar', () => {
  it('makes the progressive route cheaper on a small profit', () => {
    const r = comparar(15000, 0.25);
    expect(r.valido).toBe(true);
    expect(r.cuotaIRPF).toBeLessThan(r.cuotaIS);
    expect(r.ahorroSociedad).toBeLessThan(0);
  });

  it('makes the flat route cheaper on a large profit', () => {
    const r = comparar(200000, 0.25);
    expect(r.cuotaIS).toBeLessThan(r.cuotaIRPF);
    expect(r.ahorroSociedad).toBeGreaterThan(0);
  });

  it('reports the flat rate as its own average rate', () => {
    expect(comparar(80000, 0.25).tipoMedioIS).toBe(0.25);
  });

  it('agrees with the crossover it reports', () => {
    const r = comparar(50000, 0.25);
    expect(r.beneficio < r.beneficioDeCorte).toBe(r.ahorroSociedad < 0);
  });

  it('handles a zero profit without dividing by zero', () => {
    const r = comparar(0, 0.25);
    expect(r.valido).toBe(true);
    expect(r.cuotaIRPF).toBe(0);
    expect(r.tipoMedioIRPF).toBe(0);
  });

  it('rejects a negative profit or a bad rate', () => {
    expect(comparar(-1, 0.25).valido).toBe(false);
    expect(comparar(1000, 2).valido).toBe(false);
    expect(comparar(NaN, 0.25).valido).toBe(false);
  });

  it('uses the scale it is given, so a caller can supply another one', () => {
    const plana = [{ desde: 0, hasta: Infinity, tipo: 0.2 }];
    const r = comparar(50000, 0.25, plana);
    expect(r.cuotaIRPF).toBeCloseTo(10000, 6);
    expect(r.beneficioDeCorte).toBeNaN(); // a 20 % scale is never beaten by 25 %
  });

  it('uses the same state scale as the IRPF module', () => {
    expect(cuotaEscala(30000)).toBeCloseTo(cuotaEscala(30000, ESCALA_IRPF_2026), 10);
  });
});
