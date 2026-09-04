import { describe, it, expect } from 'vitest';
import { calcular, type Entradas } from './tamano-mercado';

const proyecto: Entradas = {
  poblacion: 80000,
  perfil: 0.12,
  frecuencia: 6,
  precio: 15,
  cuota: 0.03,
  objetivo: 20000,
};

describe('calcular', () => {
  const r = calcular(proyecto);
  it('filters the market three times', () => {
    // 80.000 × 6 × 15 = 7.200.000 · ×12 % = 864.000 · ×3 % = 25.920
    expect(r.tam).toBeCloseTo(7200000, 6);
    expect(r.sam).toBeCloseTo(864000, 6);
    expect(r.som).toBeCloseTo(25920, 6);
  });
  it('keeps each figure below the one before it', () => {
    expect(r.som).toBeLessThan(r.sam);
    expect(r.sam).toBeLessThan(r.tam);
  });
  it('counts customers, not only euros', () => {
    expect(r.clientesPerfil).toBeCloseTo(9600, 8);
    expect(r.clientesPropios).toBeCloseTo(288, 8);
  });
  it('breaks the yearly figure into months', () => {
    expect(r.somMensual).toBeCloseTo(25920 / 12, 8);
  });
});

describe('el objetivo de ingresos', () => {
  it('says how many customers a target needs', () => {
    // 20.000 € ÷ (6 × 15) = 222,2 customers.
    expect(calcular(proyecto).clientesParaObjetivo).toBeCloseTo(20000 / 90, 8);
  });
  it('turns that into a share of the reachable market', () => {
    const r = calcular(proyecto);
    expect(r.cuotaParaObjetivo).toBeCloseTo((20000 / 90) / 9600, 10);
    expect(r.objetivoImposible).toBe(false);
  });
  it('flags a target bigger than the whole reachable market', () => {
    const r = calcular({ ...proyecto, objetivo: 2000000 });
    expect(r.objetivoImposible).toBe(true);
    expect(r.cuotaParaObjetivo).toBeGreaterThan(1);
  });
  it('accepts a target of zero', () => {
    const r = calcular({ ...proyecto, objetivo: 0 });
    expect(r.valido).toBe(true);
    expect(r.clientesParaObjetivo).toBe(0);
  });
});

describe('validación', () => {
  it('rejects a share outside (0, 1]', () => {
    expect(calcular({ ...proyecto, perfil: 0 }).valido).toBe(false);
    expect(calcular({ ...proyecto, perfil: 1.5 }).valido).toBe(false);
    expect(calcular({ ...proyecto, cuota: 0 }).valido).toBe(false);
  });
  it('accepts a whole-population profile', () => {
    expect(calcular({ ...proyecto, perfil: 1 }).sam).toBeCloseTo(calcular(proyecto).tam, 6);
  });
  it('rejects impossible sizes and prices', () => {
    expect(calcular({ ...proyecto, poblacion: 0 }).valido).toBe(false);
    expect(calcular({ ...proyecto, precio: -3 }).valido).toBe(false);
    expect(calcular({ ...proyecto, frecuencia: 0 }).valido).toBe(false);
    expect(calcular({ ...proyecto, objetivo: -1 }).valido).toBe(false);
  });
});
