import { describe, it, expect } from 'vitest';
import {
  costeCocheAnual,
  costeAlternativaAnual,
  compararMovilidad,
  type OpcionesCoche,
  type OpcionesAlternativa,
} from './coche';

// Reusable base case with round numbers so the maths is easy to verify.
//   Depreciación = 15000 / 10 = 1500
//   Combustible  = (10000/100) · 6 · 1,5 = 100 · 6 · 1,5 = 900
//   Fijos        = 500 + 600 + 100 + 300 = 1500
//   Total        = 1500 + 900 + 1500 = 3900
//   Coste/km     = 3900 / 10000 = 0,39
const baseCoche: OpcionesCoche = {
  precioCompra: 15000,
  anosVidaUtil: 10,
  kmAnuales: 10000,
  consumoL100: 6,
  precioCombustible: 1.5,
  seguro: 500,
  mantenimiento: 600,
  impuestos: 100,
  aparcamiento: 300,
};

describe('costeCocheAnual', () => {
  it('breaks down the annual cost into depreciation, fuel and fixed', () => {
    const r = costeCocheAnual(baseCoche);
    expect(r.depreciacion).toBeCloseTo(1500, 6);
    expect(r.combustible).toBeCloseTo(900, 6);
    expect(r.fijos).toBeCloseTo(1500, 6);
    expect(r.total).toBeCloseTo(3900, 6);
  });

  it('cost per km equals total / km', () => {
    const r = costeCocheAnual(baseCoche);
    expect(r.costePorKm).toBeCloseTo(3900 / 10000, 9);
    expect(r.costePorKm).toBeCloseTo(0.39, 6);
  });

  it('returns null cost per km when km = 0 (no division by zero)', () => {
    const r = costeCocheAnual({ ...baseCoche, kmAnuales: 0 });
    expect(r.costePorKm).toBeNull();
    expect(r.combustible).toBe(0);
    expect(Number.isFinite(r.total)).toBe(true);
    // Fixed costs and depreciation remain even if the car never moves.
    expect(r.total).toBeCloseTo(1500 + 1500, 6);
  });

  it('avoids division by zero when useful life is 0', () => {
    const r = costeCocheAnual({ ...baseCoche, anosVidaUtil: 0 });
    expect(r.depreciacion).toBe(0);
    expect(Number.isFinite(r.total)).toBe(true);
  });

  it('adds optional otrosFijos to the fixed bucket', () => {
    const r = costeCocheAnual({ ...baseCoche, otrosFijos: 200 });
    expect(r.fijos).toBeCloseTo(1700, 6);
    expect(r.total).toBeCloseTo(4100, 6);
  });

  it('fuel cost scales with mileage', () => {
    const pocos = costeCocheAnual({ ...baseCoche, kmAnuales: 5000 });
    const muchos = costeCocheAnual({ ...baseCoche, kmAnuales: 20000 });
    expect(muchos.combustible).toBeGreaterThan(pocos.combustible);
    // Fixed + depreciation are mileage-independent.
    expect(muchos.fijos).toBeCloseTo(pocos.fijos, 6);
    expect(muchos.depreciacion).toBeCloseTo(pocos.depreciacion, 6);
  });
});

// Alternative base case:
//   Transporte = 40 · 12 = 480
//   Taxi       = 4 · 15 · 12 = 720
//   Alquiler   = 10 · 50 = 500
//   Total      = 480 + 720 + 500 = 1700
const baseAlt: OpcionesAlternativa = {
  abonoTransporteMensual: 40,
  viajesTaxiMes: 4,
  costeMedioTaxi: 15,
  alquilerPuntualDias: 10,
  costeAlquilerDia: 50,
};

describe('costeAlternativaAnual', () => {
  it('sums season pass, taxi and occasional rental', () => {
    const r = costeAlternativaAnual(baseAlt);
    expect(r.transporte).toBeCloseTo(480, 6);
    expect(r.taxi).toBeCloseTo(720, 6);
    expect(r.alquiler).toBeCloseTo(500, 6);
    expect(r.total).toBeCloseTo(1700, 6);
  });

  it('adds optional otrosAnuales', () => {
    const r = costeAlternativaAnual({ ...baseAlt, otrosAnuales: 100 });
    expect(r.otros).toBeCloseTo(100, 6);
    expect(r.total).toBeCloseTo(1800, 6);
  });

  it('is zero when nothing is consumed', () => {
    const r = costeAlternativaAnual({
      abonoTransporteMensual: 0,
      viajesTaxiMes: 0,
      costeMedioTaxi: 0,
      alquilerPuntualDias: 0,
      costeAlquilerDia: 0,
    });
    expect(r.total).toBe(0);
  });
});

describe('compararMovilidad', () => {
  function comparar(opcCoche: OpcionesCoche, opcAlt: OpcionesAlternativa) {
    const coche = costeCocheAnual(opcCoche);
    const alt = costeAlternativaAnual(opcAlt);
    return compararMovilidad(
      {
        ...coche,
        kmAnuales: opcCoche.kmAnuales,
        consumoL100: opcCoche.consumoL100,
        precioCombustible: opcCoche.precioCombustible,
      },
      alt
    );
  }

  it('with the base data the car is more expensive than the alternative', () => {
    const r = comparar(baseCoche, baseAlt);
    // Coche 3900 vs alternativa 1700.
    expect(r.totalCoche).toBeCloseTo(3900, 6);
    expect(r.totalAlternativa).toBeCloseTo(1700, 6);
    expect(r.opcionMasBarata).toBe('alternativa');
    expect(r.diferenciaAnual).toBeCloseTo(2200, 6);
  });

  it('the car is cheaper at very high mileage when the alternative is pricey', () => {
    // Push the alternative up (lots of taxi) so the car wins on heavy use.
    const altCara: OpcionesAlternativa = { ...baseAlt, viajesTaxiMes: 60, costeMedioTaxi: 20 };
    const r = comparar({ ...baseCoche, kmAnuales: 30000 }, altCara);
    expect(r.opcionMasBarata).toBe('coche');
    expect(r.totalCoche).toBeLessThan(r.totalAlternativa);
  });

  it('reports a positive break-even mileage between both options', () => {
    // Alternative costs 1700/yr. Car fixed part = depreciación + fijos = 3000,
    // already above 1700, so with these defaults there is no positive crossover.
    const r = comparar(baseCoche, baseAlt);
    expect(r.kmEquilibrio).toBeNull();

    // With a pricier alternative the crossover becomes positive.
    const altCara: OpcionesAlternativa = { ...baseAlt, viajesTaxiMes: 60, costeMedioTaxi: 20 };
    const r2 = comparar(baseCoche, altCara);
    // altCara total = 480 + (60·20·12=14400) + 500 = 15380
    // costesFijosCoche = 3000 ; variablePorKm = 6/100·1,5 = 0,09
    // km = (15380 − 3000) / 0,09 = 12380 / 0,09 ≈ 137555,56
    expect(r2.kmEquilibrio).not.toBeNull();
    expect(r2.kmEquilibrio!).toBeCloseTo(12380 / 0.09, 2);
    expect(r2.kmEquilibrio!).toBeGreaterThan(0);
  });

  it('returns no break-even when there is no positive crossover', () => {
    // Cheap alternative below the car fixed cost -> never breaks even.
    const altBarata: OpcionesAlternativa = { ...baseAlt, viajesTaxiMes: 0, alquilerPuntualDias: 0 };
    const r = comparar(baseCoche, altBarata);
    expect(r.kmEquilibrio).toBeNull();
  });

  it('returns no break-even when the car has no per-km cost', () => {
    const r = comparar({ ...baseCoche, consumoL100: 0 }, baseAlt);
    expect(r.kmEquilibrio).toBeNull();
  });

  it('flags a tie when both totals match', () => {
    // Build an alternative whose total equals the car total (3900).
    const altIgual: OpcionesAlternativa = {
      abonoTransporteMensual: 0,
      viajesTaxiMes: 0,
      costeMedioTaxi: 0,
      alquilerPuntualDias: 1,
      costeAlquilerDia: 3900,
    };
    const r = comparar(baseCoche, altIgual);
    expect(r.opcionMasBarata).toBe('empate');
    expect(r.diferenciaAnual).toBeCloseTo(0, 6);
  });
});
