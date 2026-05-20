import { describe, it, expect } from 'vitest';
import {
  arcElasticity,
  pointElasticity,
  classify,
  classifyLabel,
  revenueEffect,
  analyze,
  type PricePoint,
} from './elasticidad';

describe('arcElasticity (midpoint method)', () => {
  it('matches a known textbook value', () => {
    // P: 4 → 6, Q: 120 → 80.
    // %ΔQ = (80−120)/100 = −0.4 ; %ΔP = (6−4)/5 = +0.4 ; E = −1.
    const r = arcElasticity({ P: 4, Q: 120 }, { P: 6, Q: 80 });
    expect(r.pctChangeQ).toBeCloseTo(-0.4);
    expect(r.pctChangeP).toBeCloseTo(0.4);
    expect(r.E).toBeCloseTo(-1);
    expect(r.absE).toBeCloseTo(1);
  });

  it('a normal demand curve has a negative elasticity', () => {
    const r = arcElasticity({ P: 10, Q: 100 }, { P: 12, Q: 70 });
    expect(r.E).toBeLessThan(0);
  });

  it('is symmetric: same result whether the price rises or falls', () => {
    const up = arcElasticity({ P: 4, Q: 120 }, { P: 6, Q: 80 });
    const down = arcElasticity({ P: 6, Q: 80 }, { P: 4, Q: 120 });
    expect(up.E).toBeCloseTo(down.E);
  });

  it('returns ±Infinity when price does not change (vertical move)', () => {
    expect(arcElasticity({ P: 5, Q: 100 }, { P: 5, Q: 80 }).E).toBe(-Infinity);
    expect(arcElasticity({ P: 5, Q: 80 }, { P: 5, Q: 100 }).E).toBe(Infinity);
  });

  it('returns 0 when quantity does not change (perfectly inelastic move)', () => {
    expect(arcElasticity({ P: 4, Q: 100 }, { P: 6, Q: 100 }).E).toBe(0);
  });

  it('throws when the two points are identical', () => {
    expect(() => arcElasticity({ P: 5, Q: 100 }, { P: 5, Q: 100 })).toThrow();
  });

  it('throws when the average price is zero (division by zero)', () => {
    expect(() => arcElasticity({ P: -5, Q: 100 }, { P: 5, Q: 80 })).toThrow();
  });

  it('throws when the average quantity is zero', () => {
    expect(() => arcElasticity({ P: 4, Q: -100 }, { P: 6, Q: 100 })).toThrow();
  });
});

describe('pointElasticity', () => {
  it('computes E = b · (P / Q) on a linear curve', () => {
    // Q = 100 − 2P. At P = 10, Q = 80, slope b = −2. E = −2 · 10/80 = −0.25.
    expect(pointElasticity(-2, 10, 80)).toBeCloseTo(-0.25);
  });

  it('throws when quantity is zero', () => {
    expect(() => pointElasticity(-2, 50, 0)).toThrow();
  });
});

describe('classify', () => {
  it('labels the three core cases', () => {
    expect(classify(-2)).toBe('elastica'); // |E| > 1
    expect(classify(-0.5)).toBe('inelastica'); // |E| < 1
    expect(classify(-1)).toBe('unitaria'); // |E| = 1
  });

  it('classifies on the magnitude regardless of sign', () => {
    expect(classify(2)).toBe('elastica');
    expect(classify(0.5)).toBe('inelastica');
  });

  it('handles the two limit cases', () => {
    expect(classify(0)).toBe('perfectamente_inelastica');
    expect(classify(Infinity)).toBe('perfectamente_elastica');
    expect(classify(-Infinity)).toBe('perfectamente_elastica');
  });

  it('treats tiny float noise around 1 as unitaria', () => {
    expect(classify(-1 + 1e-12)).toBe('unitaria');
    expect(classify(-1 - 1e-12)).toBe('unitaria');
  });

  it('classifyLabel returns Spanish text for every kind', () => {
    expect(classifyLabel(classify(-2))).toMatch(/elástica/);
    expect(classifyLabel(classify(-0.5))).toMatch(/inelástica/);
    expect(classifyLabel(classify(-1))).toMatch(/unitaria/);
    expect(classifyLabel(classify(0))).toMatch(/perfectamente inelástica/);
    expect(classifyLabel(classify(Infinity))).toMatch(/perfectamente elástica/);
  });
});

describe('revenueEffect when the price rises', () => {
  it('elastic demand → total revenue falls', () => {
    // E = −1.5 (elastic): P 10→12, Q 100→70.
    const a: PricePoint = { P: 10, Q: 100 };
    const b: PricePoint = { P: 12, Q: 70 };
    expect(classify(arcElasticity(a, b).E)).toBe('elastica');
    const r = revenueEffect(a, b);
    expect(r.before).toBeCloseTo(1000);
    expect(r.after).toBeCloseTo(840);
    expect(r.change).toBeLessThan(0);
    expect(r.direction).toBe('baja');
  });

  it('inelastic demand → total revenue rises', () => {
    // P 10→12, Q 100→95: small quantity drop, inelastic.
    const a: PricePoint = { P: 10, Q: 100 };
    const b: PricePoint = { P: 12, Q: 95 };
    expect(classify(arcElasticity(a, b).E)).toBe('inelastica');
    const r = revenueEffect(a, b);
    expect(r.before).toBeCloseTo(1000);
    expect(r.after).toBeCloseTo(1140);
    expect(r.change).toBeGreaterThan(0);
    expect(r.direction).toBe('sube');
  });

  it('unitary demand → total revenue is unchanged', () => {
    // Constant IT = 1200 along the curve → unit elastic, IT igual.
    const a: PricePoint = { P: 10, Q: 120 };
    const b: PricePoint = { P: 12, Q: 100 };
    const r = revenueEffect(a, b);
    expect(r.before).toBeCloseTo(1200);
    expect(r.after).toBeCloseTo(1200);
    expect(r.direction).toBe('igual');
  });

  it('orders by price so the result always describes a price increase', () => {
    const up = revenueEffect({ P: 10, Q: 100 }, { P: 12, Q: 70 });
    const down = revenueEffect({ P: 12, Q: 70 }, { P: 10, Q: 100 });
    expect(up).toEqual(down);
  });
});

describe('analyze (full report)', () => {
  it('bundles arc elasticity, classification label and revenue effect', () => {
    const r = analyze({ P: 4, Q: 120 }, { P: 6, Q: 80 });
    expect(r.arc.E).toBeCloseTo(-1);
    expect(r.kind).toBe('unitaria');
    expect(r.label).toMatch(/unitaria/);
    expect(r.revenue.direction).toBe('igual');
  });
});
