// src/lib/games/stonks/data.test.ts
import { describe, it, expect } from 'vitest';
import { MARKET_DATA, YEARS, ASSET_IDS, YEAR_NEWS, LIFE_EVENTS, ASSETS } from './data';

describe('stonks dataset', () => {
  it('covers 2000..2024 inclusive', () => {
    expect(YEARS[0]).toBe(2000);
    expect(YEARS[YEARS.length - 1]).toBe(2024);
    expect(YEARS.length).toBe(25);
  });

  it('every year has a value for every asset', () => {
    for (const y of YEARS) {
      for (const id of ASSET_IDS) {
        expect(MARKET_DATA[y]).toHaveProperty(id);
      }
    }
  });

  it('bitcoin is null before 2012 and a number from 2012', () => {
    for (const y of [2008, 2009, 2010, 2011]) {
      expect(MARKET_DATA[y].bitcoin).toBeNull();
    }
    expect(typeof MARKET_DATA[2012].bitcoin).toBe('number');
  });

  it('matches known historical anchors (±0.5pp)', () => {
    expect(MARKET_DATA[2000].ibex).toBeCloseTo(-0.217, 2);
    expect(MARKET_DATA[2008].sp500).toBeCloseTo(-0.37, 2);
    expect(MARKET_DATA[2019].sp500).toBeCloseTo(0.315, 2);
    expect(MARKET_DATA[2022].bitcoin).toBeCloseTo(-0.643, 2);
  });

  it('every year has news', () => {
    for (const y of YEARS) expect(YEAR_NEWS[y]).toBeTruthy();
  });

  it('has at least 10 life events with non-zero amounts', () => {
    expect(LIFE_EVENTS.length).toBeGreaterThanOrEqual(10);
    for (const e of LIFE_EVENTS) expect(e.amount).not.toBe(0);
  });

  it('unlock rounds are within range', () => {
    for (const a of ASSETS) expect(a.unlockRound).toBeLessThan(YEARS.length);
  });
});
