// src/lib/games/stonks/ai.test.ts
import { describe, it, expect } from 'vitest';
import { aiAdvance } from './ai';
import { semesterReturn } from './data/market';
import { commissionRate } from './money';

describe('aiAdvance — «El Mercat»', () => {
  it('invests the income in the world index after paying commission', () => {
    const r = semesterReturn('mundial', 2015, 0)!;
    const invested = 500 * (1 - commissionRate(2015));
    expect(aiAdvance({ value: 1000, cost: 1000 }, 2015, 0, 500).value)
      .toBeCloseTo((1000 + invested) * (1 + r), 4);
  });

  it('never sells, so the cost basis only ever grows', () => {
    const next = aiAdvance({ value: 1000, cost: 1000 }, 2015, 0, 500);
    expect(next.cost).toBeCloseTo(1000 + 500 * (1 - commissionRate(2015)), 4);
  });

  it('rides a losing semester down rather than stepping aside', () => {
    const r = semesterReturn('mundial', 2008, 1)!;
    expect(r).toBeLessThan(0);
    expect(aiAdvance({ value: 10000, cost: 10000 }, 2008, 1, 0).value).toBeLessThan(10000);
  });

  it('pays the commission of its era, not a modern one', () => {
    const early = aiAdvance({ value: 0, cost: 0 }, 1980, 0, 1000);
    const late = aiAdvance({ value: 0, cost: 0 }, 2020, 0, 1000);
    expect(early.cost).toBeCloseTo(1000 * (1 - 0.010), 6);
    expect(late.cost).toBeCloseTo(1000 * (1 - 0.002), 6);
  });
});
