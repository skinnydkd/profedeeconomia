import { describe, it, expect } from 'vitest';
import { comparar, cuotaPorTramos, type Persona, type Tramo } from './progresividad';

const tramos: Tramo[] = [
  { hasta: 12000, tipo: 0 },
  { hasta: 30000, tipo: 0.2 },
  { hasta: Infinity, tipo: 0.35 },
];
const personas: Persona[] = [
  { nombre: 'Ana', renta: 15000 },
  { nombre: 'Marcos', renta: 60000 },
];

describe('cuotaPorTramos', () => {
  it('taxes nothing inside an exempt first bracket', () => {
    expect(cuotaPorTramos(10000, tramos)).toBe(0);
  });
  it('taxes only the part above the exempt bracket', () => {
    expect(cuotaPorTramos(15000, tramos)).toBeCloseTo(3000 * 0.2, 6);
  });
  it('applies each bracket to its own slice', () => {
    // 12.000 exempt + 18.000 at 20 % + 30.000 at 35 %
    expect(cuotaPorTramos(60000, tramos)).toBeCloseTo(18000 * 0.2 + 30000 * 0.35, 6);
  });
  it('returns zero for a zero or negative base', () => {
    expect(cuotaPorTramos(0, tramos)).toBe(0);
    expect(cuotaPorTramos(-100, tramos)).toBe(0);
  });
});

describe('comparar', () => {
  const r = comparar(personas, tramos, 300, 0.21);

  it('reads the income tax as progressive when the effective rate rises', () => {
    expect(r.valido).toBe(true);
    expect(r.rentaEsProgresiva).toBe(true);
    const ana = r.personas.find((p) => p.nombre === 'Ana')!;
    const marcos = r.personas.find((p) => p.nombre === 'Marcos')!;
    expect(marcos.tipoMedioRenta).toBeGreaterThan(ana.tipoMedioRenta);
  });

  it('charges both people the same consumption tax in euros', () => {
    const [a, b] = r.personas;
    expect(a.cuotaConsumo).toBe(b.cuotaConsumo);
    expect(a.cuotaConsumo).toBeCloseTo(63, 6);
  });

  it('reads the consumption tax as regressive: the same euros weigh more on the lower income', () => {
    expect(r.consumoEsRegresivo).toBe(true);
    const ana = r.personas.find((p) => p.nombre === 'Ana')!;
    const marcos = r.personas.find((p) => p.nombre === 'Marcos')!;
    expect(ana.pesoConsumo).toBeGreaterThan(marcos.pesoConsumo);
    expect(ana.pesoConsumo).toBeCloseTo(63 / 15000, 10);
  });

  it('adds both taxes as a share of income', () => {
    const ana = r.personas.find((p) => p.nombre === 'Ana')!;
    expect(ana.pesoTotal).toBeCloseTo((ana.cuotaRenta + ana.cuotaConsumo) / ana.renta, 10);
  });

  it('reports a flat income tax as not progressive', () => {
    const plana: Tramo[] = [{ hasta: Infinity, tipo: 0.2 }];
    const r2 = comparar(personas, plana, 300, 0.21);
    expect(r2.rentaEsProgresiva).toBe(false);
    expect(r2.personas[0].tipoMedioRenta).toBeCloseTo(0.2, 10);
    expect(r2.personas[1].tipoMedioRenta).toBeCloseTo(0.2, 10);
  });

  it('reports no regressivity when nothing is bought', () => {
    const r3 = comparar(personas, tramos, 0, 0.21);
    expect(r3.consumoEsRegresivo).toBe(false);
    expect(r3.personas[0].pesoConsumo).toBe(0);
  });

  it('needs at least two people to compare anything', () => {
    expect(comparar([personas[0]], tramos, 300, 0.21).valido).toBe(false);
  });

  it('rejects a zero or negative income', () => {
    expect(comparar([{ nombre: 'X', renta: 0 }, personas[1]], tramos, 300, 0.21).valido).toBe(false);
  });

  it('rejects a rate outside 0–1', () => {
    expect(comparar(personas, tramos, 300, 1.5).valido).toBe(false);
    expect(comparar(personas, [{ hasta: Infinity, tipo: 2 }], 300, 0.21).valido).toBe(false);
  });

  it('rejects an empty bracket table rather than treating it as tax-free', () => {
    expect(comparar(personas, [], 300, 0.21).valido).toBe(false);
  });
});

describe('comparar — validación de tramos', () => {
  const personas: Persona[] = [{ nombre: 'A', renta: 15000 }, { nombre: 'B', renta: 60000 }];

  it('accepts an open-ended top bracket', () => {
    const r = comparar(personas, [{ hasta: 12000, tipo: 0 }, { hasta: Infinity, tipo: 0.3 }], 100, 0.21);
    expect(r.valido).toBe(true);
  });

  it('rejects brackets whose ceilings do not increase', () => {
    const r = comparar(personas, [{ hasta: 30000, tipo: 0.2 }, { hasta: 12000, tipo: 0.3 }], 100, 0.21);
    expect(r.valido).toBe(false);
  });

  it('rejects a NaN or non-positive ceiling', () => {
    expect(comparar(personas, [{ hasta: NaN, tipo: 0.2 }], 100, 0.21).valido).toBe(false);
    expect(comparar(personas, [{ hasta: 0, tipo: 0.2 }], 100, 0.21).valido).toBe(false);
  });
});
