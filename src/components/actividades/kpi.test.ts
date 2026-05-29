import { describe, it, expect } from 'vitest';
import { applyDelta, percentChange } from './kpi.ts';

describe('applyDelta', () => {
  it('adds positive and negative deltas', () => {
    const out = applyDelta({ caja: 100, sat: 5 }, { caja: 50, sat: -1 });
    expect(out).toEqual({ caja: 150, sat: 4 });
  });

  it('leaves untouched keys unchanged', () => {
    const out = applyDelta({ caja: 100, sat: 5 }, { caja: 50 });
    expect(out).toEqual({ caja: 150, sat: 5 });
  });

  it('does not mutate inputs', () => {
    const before = { caja: 100, sat: 5 };
    const delta = { caja: 50 };
    applyDelta(before, delta);
    expect(before).toEqual({ caja: 100, sat: 5 });
    expect(delta).toEqual({ caja: 50 });
  });
});

describe('percentChange', () => {
  it('returns rounded integer percent change', () => {
    expect(percentChange(100, 120)).toBe(20);
    expect(percentChange(100, 80)).toBe(-20);
    expect(percentChange(100, 100)).toBe(0);
  });

  it('returns 0 when initial is 0 (no division by zero)', () => {
    expect(percentChange(0, 100)).toBe(0);
  });
});
