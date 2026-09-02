import { describe, it, expect } from 'vitest';
import { calcularTasas, tasaParoMalCalculada } from './tasas-epa';

/** The worked example in FOPP 4ESO · Unidad 7 (SolvedExercise 7.1, Vilanova del Camp). */
const VILANOVA = { poblacion16: 20000, ocupados: 9600, parados: 1400 };

describe('the three EPA rates', () => {
  it('reproduces the worked example of the unit', () => {
    const r = calcularTasas(VILANOVA);
    expect(r.activos).toBe(11000);
    expect(r.inactivos).toBe(9000);
    expect(r.actividad.valor).toBeCloseTo(55);
    expect(r.paro.valor).toBeCloseTo(12.7272, 3);
    expect(r.empleo.valor).toBeCloseTo(48);
    expect(r.coherente).toBe(true);
  });

  it('runs the unemployment rate over the active population, not over 16+', () => {
    const r = calcularTasas(VILANOVA);
    expect(r.paro.denominador).toBe(11000);
    expect(r.actividad.denominador).toBe(20000);
    expect(r.empleo.denominador).toBe(20000);
  });

  it('keeps activity = employment + unemployment share of the working-age population', () => {
    const r = calcularTasas(VILANOVA);
    const paroSobre16 = (VILANOVA.parados / VILANOVA.poblacion16) * 100;
    expect(r.actividad.valor!).toBeCloseTo(r.empleo.valor! + paroSobre16);
  });
});

describe('the common mistake the unit warns about', () => {
  it('dividing by the whole 16+ population understates unemployment', () => {
    const malo = tasaParoMalCalculada(VILANOVA);
    const bueno = calcularTasas(VILANOVA).paro;
    expect(malo.valor).toBeCloseTo(7);
    expect(malo.valor!).toBeLessThan(bueno.valor!);
  });

  it('the two coincide only when nobody of working age is inactive', () => {
    const sinInactivos = { poblacion16: 11000, ocupados: 9600, parados: 1400 };
    expect(tasaParoMalCalculada(sinInactivos).valor).toBeCloseTo(
      calcularTasas(sinInactivos).paro.valor!,
    );
  });
});

describe('edge cases', () => {
  it('returns null instead of dividing by zero when nobody is active', () => {
    const r = calcularTasas({ poblacion16: 500, ocupados: 0, parados: 0 });
    expect(r.paro.valor).toBeNull();
    expect(r.actividad.valor).toBeCloseTo(0);
    expect(r.empleo.valor).toBeCloseTo(0);
  });

  it('returns null for every rate on an empty population', () => {
    const r = calcularTasas({ poblacion16: 0, ocupados: 0, parados: 0 });
    expect(r.actividad.valor).toBeNull();
    expect(r.empleo.valor).toBeNull();
    expect(r.paro.valor).toBeNull();
  });

  it('full employment gives a 0 % unemployment rate and equal activity and employment', () => {
    const r = calcularTasas({ poblacion16: 20000, ocupados: 11000, parados: 0 });
    expect(r.paro.valor).toBeCloseTo(0);
    expect(r.actividad.valor).toBeCloseTo(r.empleo.valor!);
  });

  it('flags more active people than people of working age as incoherent', () => {
    const r = calcularTasas({ poblacion16: 1000, ocupados: 900, parados: 200 });
    expect(r.coherente).toBe(false);
    expect(r.inactivos).toBe(-100);
  });

  it('flags a negative head count as incoherent', () => {
    expect(calcularTasas({ poblacion16: 100, ocupados: -1, parados: 0 }).coherente).toBe(false);
  });
});
