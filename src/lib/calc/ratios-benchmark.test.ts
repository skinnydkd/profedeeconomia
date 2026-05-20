import { describe, it, expect } from 'vitest';
import {
  calcularRatios,
  clasificar,
  esFavorable,
  evaluarEmpresa,
  BENCHMARKS,
  RATIOS,
  SECTORES,
  type DatosEmpresa,
} from './ratios-benchmark';

/**
 * A clean, self-consistent company:
 *   activoTotal = patrimonioNeto + deudaTotal = 200 + 200 = 400
 *   deudaTotal  = pasivoCorriente + pasivo no corriente = 100 + 100
 */
const EMPRESA: DatosEmpresa = {
  activoCorriente: 200,
  pasivoCorriente: 100,
  existencias: 80,
  deudaTotal: 200,
  patrimonioNeto: 200,
  activoTotal: 400,
  ventas: 600,
  beneficioNeto: 30,
  baii: 48,
};

describe('calcularRatios', () => {
  it('computes each ratio from known data', () => {
    const r = calcularRatios(EMPRESA);
    expect(r.liquidez).toBeCloseTo(200 / 100, 6); // 2.0
    expect(r.acida).toBeCloseTo((200 - 80) / 100, 6); // 1.2
    expect(r.endeudamiento).toBeCloseTo(200 / 400, 6); // 0.5
    expect(r.autonomia).toBeCloseTo(200 / 400, 6); // 0.5
    expect(r.roe).toBeCloseTo(30 / 200, 6); // 0.15
    expect(r.roa).toBeCloseTo(48 / 400, 6); // 0.12
    expect(r.margenNeto).toBeCloseTo(30 / 600, 6); // 0.05
    expect(r.rotacionActivos).toBeCloseTo(600 / 400, 6); // 1.5
  });

  it('endeudamiento and autonomía are complementary when activoTotal = PN + deuda', () => {
    const r = calcularRatios(EMPRESA);
    expect((r.endeudamiento ?? 0) + (r.autonomia ?? 0)).toBeCloseTo(1, 6);
  });

  it('returns percentages as fractions (0.15 not 15)', () => {
    const r = calcularRatios(EMPRESA);
    expect(r.roe).toBeLessThan(1);
    expect(r.roe).toBeGreaterThan(0);
  });
});

describe('division by zero handling', () => {
  it('returns null instead of Infinity/NaN for zero denominators', () => {
    const r = calcularRatios({
      activoCorriente: 50,
      pasivoCorriente: 0, // -> liquidez, acida null
      existencias: 10,
      deudaTotal: 0,
      patrimonioNeto: 0, // -> roe null
      activoTotal: 0, // -> endeudamiento, autonomia, roa, rotacion null
      ventas: 0, // -> margenNeto null
      beneficioNeto: 5,
      baii: 4,
    });
    expect(r.liquidez).toBeNull();
    expect(r.acida).toBeNull();
    expect(r.endeudamiento).toBeNull();
    expect(r.autonomia).toBeNull();
    expect(r.roe).toBeNull();
    expect(r.roa).toBeNull();
    expect(r.margenNeto).toBeNull();
    expect(r.rotacionActivos).toBeNull();
    // None of them should be a non-finite number.
    for (const v of Object.values(r)) {
      expect(v === null || Number.isFinite(v)).toBe(true);
    }
  });
});

describe('clasificar', () => {
  it('labels values below / inside / above the band', () => {
    expect(clasificar(0.5, [1, 2])).toBe('bajo');
    expect(clasificar(1.5, [1, 2])).toBe('dentro');
    expect(clasificar(2.5, [1, 2])).toBe('alto');
  });

  it('treats the exact boundaries as inside the band', () => {
    expect(clasificar(1, [1, 2])).toBe('dentro');
    expect(clasificar(2, [1, 2])).toBe('dentro');
  });

  it('returns sinDato for null/non-finite', () => {
    expect(clasificar(null, [1, 2])).toBe('sinDato');
    expect(clasificar(Infinity, [1, 2])).toBe('sinDato');
    expect(clasificar(NaN, [1, 2])).toBe('sinDato');
  });
});

describe('evaluarEmpresa', () => {
  it('produces one evaluation per defined ratio, in order', () => {
    const ev = evaluarEmpresa(EMPRESA, 'comercio');
    expect(ev).toHaveLength(RATIOS.length);
    expect(ev.map((e) => e.id)).toEqual(RATIOS.map((d) => d.id));
  });

  it('classifies a ratio against the selected sector band', () => {
    // liquidez = 2.0. Comercio band is [0.9, 1.5] -> 'alto'.
    const comercio = evaluarEmpresa(EMPRESA, 'comercio');
    const liqC = comercio.find((e) => e.id === 'liquidez')!;
    expect(liqC.valor).toBeCloseTo(2, 6);
    expect(liqC.posicion).toBe('alto');
    expect(liqC.comentario).toMatch(/sector/i);
  });

  it('changing the sector changes the verdict for the same company', () => {
    // liquidez = 2.0:
    //   comercio  [0.9, 1.5] -> alto
    //   industria [1.3, 2.0] -> dentro (boundary)
    const comercio = evaluarEmpresa(EMPRESA, 'comercio');
    const industria = evaluarEmpresa(EMPRESA, 'industria');
    const liqC = comercio.find((e) => e.id === 'liquidez')!;
    const liqI = industria.find((e) => e.id === 'liquidez')!;
    expect(liqC.valor).toBeCloseTo(liqI.valor!, 6); // same number
    expect(liqC.posicion).not.toBe(liqI.posicion); // different verdict
    expect(liqI.posicion).toBe('dentro');
  });

  it('rotación de activos verdict flips between commerce and tech', () => {
    // rotacion = 1.5: comercio [1.8, 3.5] -> bajo; tecnologia [0.5, 1.2] -> alto
    const rotC = evaluarEmpresa(EMPRESA, 'comercio').find((e) => e.id === 'rotacionActivos')!;
    const rotT = evaluarEmpresa(EMPRESA, 'tecnologia').find((e) => e.id === 'rotacionActivos')!;
    expect(rotC.posicion).toBe('bajo');
    expect(rotT.posicion).toBe('alto');
  });

  it('propagates null ratios as sinDato', () => {
    const zeroPC: DatosEmpresa = { ...EMPRESA, pasivoCorriente: 0 };
    const ev = evaluarEmpresa(zeroPC, 'comercio');
    const liq = ev.find((e) => e.id === 'liquidez')!;
    expect(liq.valor).toBeNull();
    expect(liq.posicion).toBe('sinDato');
  });
});

describe('esFavorable', () => {
  it('inside the band is always favourable', () => {
    for (const def of RATIOS) {
      expect(esFavorable(def.id, 'dentro')).toBe(true);
    }
  });

  it('low debt (endeudamiento bajo) is favourable, high debt is not', () => {
    expect(esFavorable('endeudamiento', 'bajo')).toBe(true);
    expect(esFavorable('endeudamiento', 'alto')).toBe(false);
  });

  it('high autonomy is favourable, low autonomy is not', () => {
    expect(esFavorable('autonomia', 'alto')).toBe(true);
    expect(esFavorable('autonomia', 'bajo')).toBe(false);
  });

  it('higher profitability / liquidity / turnover than the sector is acceptable', () => {
    expect(esFavorable('roe', 'alto')).toBe(true);
    expect(esFavorable('liquidez', 'alto')).toBe(true);
    expect(esFavorable('rotacionActivos', 'alto')).toBe(true);
    expect(esFavorable('roa', 'bajo')).toBe(false);
  });

  it('sinDato is never favourable', () => {
    expect(esFavorable('liquidez', 'sinDato')).toBe(false);
  });
});

describe('benchmark dataset integrity', () => {
  it('defines all four sectors', () => {
    expect(SECTORES.map((s) => s.id).sort()).toEqual(
      ['comercio', 'hosteleria', 'industria', 'tecnologia'].sort()
    );
  });

  it('every sector defines a valid [min, max] band for every ratio', () => {
    for (const sector of SECTORES) {
      const bandas = BENCHMARKS[sector.id];
      for (const def of RATIOS) {
        const band = bandas[def.id];
        expect(band, `${sector.id}/${def.id}`).toBeDefined();
        expect(band[0]).toBeLessThan(band[1]);
        expect(band[0]).toBeGreaterThanOrEqual(0);
      }
    }
  });
});
