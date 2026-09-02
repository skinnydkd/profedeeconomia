import { describe, it, expect } from 'vitest';
import { analizar, type Paso } from './embudo-validacion';

/** The numbers of the Eco 4ESO unit 10 activity: 1.200 followers, 12 sales. */
const proyecto: Paso[] = [
  { nombre: 'Ven la publicación', personas: 1200 },
  { nombre: 'Entran al perfil', personas: 180 },
  { nombre: 'Escriben preguntando', personas: 51 },
  { nombre: 'Compran', personas: 12 },
];

describe('analizar', () => {
  const r = analizar(proyecto, 60, 18);

  it('converts step by step and end to end', () => {
    expect(r.pasos[0].conversion).toBeNaN();
    expect(r.pasos[1].conversion).toBeCloseTo(0.15, 10);
    expect(r.pasos[2].conversion).toBeCloseTo(51 / 180, 10);
    expect(r.pasos[3].conversion).toBeCloseTo(12 / 51, 10);
    expect(r.conversionGlobal).toBeCloseTo(0.01, 10);
  });

  it('counts the people lost at each step', () => {
    expect(r.pasos[1].perdidas).toBe(1020);
    expect(r.pasos[3].perdidas).toBe(39);
  });

  it('finds the weakest step, which is not the last one', () => {
    // 15 % from post to profile is worse than 23,5 % or 28,3 %.
    expect(r.indiceCuelloBotella).toBe(1);
    expect(r.pasos[1].esCuelloBotella).toBe(true);
    expect(r.pasos.filter((p) => p.esCuelloBotella)).toHaveLength(1);
  });

  it('prices the outcome', () => {
    expect(r.conversiones).toBe(12);
    expect(r.costePorConversion).toBeCloseTo(5, 10);
    expect(r.ingresos).toBeCloseTo(216, 8);
    expect(r.margen).toBeCloseTo(156, 8);
  });

  it('reports the share of the top of the funnel at every step', () => {
    expect(r.pasos[0].conversionTotal).toBeCloseTo(1, 10);
    expect(r.pasos[2].conversionTotal).toBeCloseTo(51 / 1200, 10);
  });
});

describe('casos límite', () => {
  it('handles a funnel that ends in nobody', () => {
    const r = analizar([...proyecto.slice(0, 3), { nombre: 'Compran', personas: 0 }], 60, 18);
    expect(r.valido).toBe(true);
    expect(r.conversionGlobal).toBe(0);
    expect(r.costePorConversion).toBe(Infinity);
    expect(r.margen).toBeCloseTo(-60, 8);
  });
  it('accepts a funnel that loses nobody', () => {
    const r = analizar([{ nombre: 'A', personas: 10 }, { nombre: 'B', personas: 10 }], 0, 5);
    expect(r.pasos[1].conversion).toBeCloseTo(1, 10);
    expect(r.margen).toBeCloseTo(50, 8);
  });
  it('rejects a funnel that grows between steps', () => {
    expect(analizar([{ nombre: 'A', personas: 10 }, { nombre: 'B', personas: 20 }], 0, 5).valido).toBe(false);
  });
  it('rejects a funnel with fewer than two steps or an empty top', () => {
    expect(analizar([{ nombre: 'A', personas: 10 }], 0, 5).valido).toBe(false);
    expect(analizar([{ nombre: 'A', personas: 0 }, { nombre: 'B', personas: 0 }], 0, 5).valido).toBe(false);
  });
  it('rejects negative money', () => {
    expect(analizar(proyecto, -1, 18).valido).toBe(false);
    expect(analizar(proyecto, 60, -18).valido).toBe(false);
  });
});
