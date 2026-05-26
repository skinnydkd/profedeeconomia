// src/lib/games/stonks/ai.test.ts
import { describe, it, expect } from 'vitest';
import { aiAdvance } from './ai';
import { INCOME_PER_ROUND, MARKET_DATA, INDEX_ASSET } from './data';

describe('ai El Mercat (DCA on the index)', () => {
  it('adds income then applies the index return for the year', () => {
    const start = 5000;
    const year = 2019;
    const r = MARKET_DATA[year][INDEX_ASSET]!; // +0.315
    expect(aiAdvance(start, year)).toBeCloseTo((start + INCOME_PER_ROUND) * (1 + r), 2);
  });

  it('drops in a bad year', () => {
    expect(aiAdvance(10000, 2008)).toBeLessThan(10000 + INCOME_PER_ROUND);
  });
});
