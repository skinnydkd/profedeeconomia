import { describe, it, expect } from 'vitest';
import {
  simularRonda,
  ranking,
  nivelCalidad,
  costeVariableUnitario,
  ESTADO_INICIAL,
  DEFAULT_PARAMS,
  type MarketParams,
  type TeamInput,
  type TeamDecision,
} from './engine.ts';

const SIMPLE: MarketParams = {
  demandaBase: 1000,
  crecimientoDemanda: 0,
  pesoCalidad: 0.34,
  pesoMarketing: 0.33,
  pesoPrecio: 0.33,
  precioReferencia: 10,
  costeFijo: 1000,
  costeVariableBase: 5,
  costeStock: 1,
  interesPrestamo: 0.1,
};

const baseDecision = (over: Partial<TeamDecision> = {}): TeamDecision => ({
  precio: 10, marketing: 0, produccion: 1000, calidad: 0, rrhh: 0, prestamo: 0, ...over,
});
const team = (id: string, over: Partial<TeamDecision> = {}): TeamInput => ({
  id, nombre: id, estado: { ...ESTADO_INICIAL }, decision: baseDecision(over),
});

describe('simularRonda — caso exacto (monopolio)', () => {
  it('calcula ventas, costes y beneficio a mano', () => {
    const [r] = simularRonda(SIMPLE, [team('A')], 1);
    expect(r.cuota).toBe(1);
    expect(r.demanda).toBe(1000);
    expect(r.ventas).toBe(1000);
    expect(r.stock).toBe(0);
    expect(r.costeVariableUnitario).toBe(5); // sin RRHH, CVu = base
    expect(r.ingresos).toBe(10000); // 1000 × 10
    expect(r.costes).toBe(6000); // 1000 CF + 5×1000 CVu
    expect(r.beneficio).toBe(4000);
    expect(r.estado.beneficioAcumulado).toBe(4000);
    expect(r.estado.caja).toBe(4000);
  });
});

describe('reparto de mercado', () => {
  it('las cuotas suman 1', () => {
    const res = simularRonda(DEFAULT_PARAMS, [team('A'), team('B', { precio: 18 }), team('C', { marketing: 30000 })], 1);
    const suma = res.reduce((s, r) => s + r.cuota, 0);
    expect(suma).toBeCloseTo(1, 6);
  });

  it('equipos idénticos reparten el mercado a partes iguales', () => {
    const res = simularRonda(DEFAULT_PARAMS, [team('A'), team('B')], 1);
    expect(res[0].cuota).toBeCloseTo(0.5, 6);
    expect(res[1].cuota).toBeCloseTo(0.5, 6);
  });

  it('bajar el precio aumenta la cuota (ceteris paribus)', () => {
    const res = simularRonda(SIMPLE, [team('barato', { precio: 8 }), team('caro', { precio: 12 })], 1);
    const barato = res.find((r) => r.id === 'barato')!;
    const caro = res.find((r) => r.id === 'caro')!;
    expect(barato.cuota).toBeGreaterThan(caro.cuota);
  });

  it('más marketing aumenta la cuota (ceteris paribus)', () => {
    const res = simularRonda(DEFAULT_PARAMS, [team('mucho', { marketing: 40000 }), team('poco', { marketing: 5000 })], 1);
    expect(res.find((r) => r.id === 'mucho')!.cuota).toBeGreaterThan(res.find((r) => r.id === 'poco')!.cuota);
  });

  it('más inversión en calidad aumenta la cuota (ceteris paribus)', () => {
    const res = simularRonda(DEFAULT_PARAMS, [team('premium', { calidad: 50000 }), team('basico', { calidad: 0 })], 1);
    expect(res.find((r) => r.id === 'premium')!.cuota).toBeGreaterThan(res.find((r) => r.id === 'basico')!.cuota);
  });
});

describe('coherencia ventas ↔ ingresos (unidades enteras)', () => {
  it('los ingresos se calculan sobre las ventas enteras mostradas', () => {
    // 3 equipos idénticos reparten 1000 de demanda → 333,33 cada uno (fraccional).
    // Producción 1000 > demanda, así que ventas = demanda fraccional sin el fix.
    const res = simularRonda(SIMPLE, [team('A'), team('B'), team('C')], 1);
    for (const r of res) {
      // ingresos deben ser exactamente las ventas enteras × precio (precio = 10).
      expect(r.ingresos).toBe(r.ventas * 10);
    }
  });
});

describe('producción y stock', () => {
  it('no se vende más de lo producido; lo que sobra es stock', () => {
    const [r] = simularRonda(SIMPLE, [team('A', { produccion: 1300 })], 1); // demanda 1000 < 1300
    expect(r.ventas).toBe(1000);
    expect(r.stock).toBe(300);
  });
  it('si se produce de menos, las ventas quedan limitadas por la producción', () => {
    const [r] = simularRonda(SIMPLE, [team('A', { produccion: 700 })], 1); // demanda 1000 > 700
    expect(r.ventas).toBe(700);
    expect(r.stock).toBe(0);
  });
});

describe('palancas', () => {
  it('invertir en RR. HH. reduce el coste variable unitario', () => {
    expect(costeVariableUnitario(DEFAULT_PARAMS, 30000)).toBeLessThan(DEFAULT_PARAMS.costeVariableBase);
    expect(costeVariableUnitario(DEFAULT_PARAMS, 0)).toBe(DEFAULT_PARAMS.costeVariableBase);
  });
  it('invertir en calidad (y RR. HH.) sube el nivel de calidad, con rendimientos decrecientes', () => {
    expect(nivelCalidad(0, 0)).toBe(40);
    expect(nivelCalidad(40000, 0)).toBeGreaterThan(nivelCalidad(10000, 0));
    const salto1 = nivelCalidad(10000, 0) - nivelCalidad(0, 0);
    const salto2 = nivelCalidad(40000, 0) - nivelCalidad(30000, 0);
    expect(salto2).toBeLessThan(salto1); // rendimientos decrecientes
  });
});

describe('rondas y ranking', () => {
  it('la demanda total crece con las rondas', () => {
    const r1 = simularRonda(DEFAULT_PARAMS, [team('A')], 1)[0];
    const r2 = simularRonda(DEFAULT_PARAMS, [team('A')], 2)[0];
    expect(r2.demanda).toBeGreaterThan(r1.demanda);
  });
  it('el préstamo entra en caja y suma deuda con intereses', () => {
    const [r] = simularRonda(SIMPLE, [team('A', { prestamo: 2000 })], 1);
    expect(r.estado.deuda).toBe(2000);
    // costes incluyen 10 % de interés sobre la deuda: 200 € más que sin préstamo
    const sinPrestamo = simularRonda(SIMPLE, [team('A')], 1)[0];
    expect(r.costes - sinPrestamo.costes).toBeCloseTo(200, 6);
  });
  it('ranking ordena por beneficio acumulado descendente', () => {
    const res = [
      { estado: { beneficioAcumulado: 100 } },
      { estado: { beneficioAcumulado: 500 } },
      { estado: { beneficioAcumulado: 300 } },
    ] as any;
    const ord = ranking(res);
    expect(ord.map((r: any) => r.estado.beneficioAcumulado)).toEqual([500, 300, 100]);
  });
});
