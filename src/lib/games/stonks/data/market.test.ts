// src/lib/games/stonks/data/market.test.ts
import { describe, it, expect } from 'vitest';
import { ANNUAL, FIRST_HALF, semesterReturn, MARKET_FIRST_YEAR, MARKET_LAST_YEAR } from './market';
import { ASSETS, assetMeta, isAvailable } from './assets';
import type { AssetId } from '../types';

describe('market data coverage', () => {
  it('spans 1971 to 2025 with no missing year', () => {
    expect(MARKET_FIRST_YEAR).toBe(1971);
    expect(MARKET_LAST_YEAR).toBe(2025);
    for (let y = MARKET_FIRST_YEAR; y <= MARKET_LAST_YEAR; y++) {
      expect(ANNUAL[y], `year ${y}`).toBeDefined();
    }
  });

  it('gives a return for every asset in every year it was available', () => {
    for (let y = MARKET_FIRST_YEAR; y <= MARKET_LAST_YEAR; y++) {
      for (const a of ASSETS) {
        if (a.id === 'efectivo') continue;             // always 0 by definition
        if (!isAvailable(a, y, 0) && !isAvailable(a, y, 1)) continue;
        // The final semester of a doomed company is its wipe-out, not a market year.
        if (a.untilYear === y && (a.untilHalf ?? 1) === 0) continue;
        expect(ANNUAL[y][a.id], `${a.id} ${y}`).toBeTypeOf('number');
      }
    }
  });

  it('never carries a return for an asset that did not exist that year', () => {
    for (let y = MARKET_FIRST_YEAR; y <= MARKET_LAST_YEAR; y++) {
      for (const id of Object.keys(ANNUAL[y]) as AssetId[]) {
        const a = assetMeta[id];
        expect(a, `unknown asset ${id} in ${y}`).toBeDefined();
        const alive = isAvailable(a, y, 0) || isAvailable(a, y, 1);
        expect(alive, `${id} has a ${y} return but was not trading`).toBe(true);
      }
    }
  });

  it('reports null for an asset that did not exist that semester', () => {
    expect(semesterReturn('bitcoin', 1984, 0)).toBeNull();
    expect(semesterReturn('e_enron', 2002, 0)).toBeNull();
    expect(semesterReturn('e_msft', 1986, 0)).toBeNull();
  });

  it('always reports zero for cash — that is the whole point of cash', () => {
    expect(semesterReturn('efectivo', 1977, 0)).toBe(0);
    expect(semesterReturn('efectivo', 2020, 1)).toBe(0);
  });
});

describe('semester split', () => {
  it('splits geometrically when the year carries no explicit shape', () => {
    const annual = ANNUAL[1995].sp500!;
    expect(FIRST_HALF[1995]?.sp500).toBeUndefined();
    expect(semesterReturn('sp500', 1995, 0)!).toBeCloseTo(Math.sqrt(1 + annual) - 1, 10);
  });

  /**
   * THE invariant the data's honesty rests on (design spec §7): an intra-year
   * shape may move a return between the halves, never change the year's total.
   */
  it('never lets an intra-year shape change the annual figure', () => {
    for (let y = MARKET_FIRST_YEAR; y <= MARKET_LAST_YEAR; y++) {
      for (const a of ASSETS) {
        const h1 = semesterReturn(a.id, y, 0);
        const h2 = semesterReturn(a.id, y, 1);
        if (h1 === null || h2 === null) continue;
        if (a.untilYear === y) continue;               // the wipe-out overrides the market
        const annual = a.id === 'efectivo' ? 0 : ANNUAL[y][a.id]!;
        expect((1 + h1) * (1 + h2), `${a.id} ${y}`).toBeCloseTo(1 + annual, 6);
      }
    }
  });

  it('only shapes years that also carry an annual figure for that asset', () => {
    for (const yearKey of Object.keys(FIRST_HALF)) {
      const y = Number(yearKey);
      for (const id of Object.keys(FIRST_HALF[y]) as AssetId[]) {
        expect(ANNUAL[y]?.[id], `${id} ${y} is shaped but has no annual return`).toBeTypeOf('number');
      }
    }
  });

  it('puts the 2020 crash in the first half and the recovery in the second', () => {
    expect(semesterReturn('sp500', 2020, 0)!).toBeLessThan(0);
    expect(semesterReturn('sp500', 2020, 1)!).toBeGreaterThan(0);
    expect(semesterReturn('mundial', 2020, 0)!).toBeLessThan(0);
  });

  it('separates Bear Stearns from Lehman inside 2008', () => {
    const h1 = semesterReturn('mundial', 2008, 0)!;
    const h2 = semesterReturn('mundial', 2008, 1)!;
    expect(h1).toBeLessThan(0);
    expect(h2).toBeLessThan(h1);                       // the second half was far worse
  });

  it('applies the final return in a doomed company last semester', () => {
    for (const id of ['e_enron', 'e_popular', 'e_terra'] as const) {
      const a = assetMeta[id];
      expect(semesterReturn(id, a.untilYear!, a.untilHalf!), id).toBe(a.finalReturn);
    }
  });

  it('never wipes out more than everything', () => {
    for (let y = MARKET_FIRST_YEAR; y <= MARKET_LAST_YEAR; y++) {
      for (const a of ASSETS) {
        for (const h of [0, 1] as const) {
          const r = semesterReturn(a.id, y, h);
          if (r === null) continue;
          expect(r, `${a.id} ${y} H${h + 1}`).toBeGreaterThanOrEqual(-1);
        }
      }
    }
  });
});

describe('the history the data has to tell', () => {
  it('remembers that Spanish shares lost money for most of the seventies', () => {
    let acc = 1;
    for (let y = 1974; y <= 1982; y++) acc *= 1 + ANNUAL[y].bolsa_es!;
    expect(acc).toBeLessThan(1);
  });

  it('remembers 2008 as a global crash', () => {
    for (const id of ['sp500', 'mundial', 'bolsa_es'] as const) {
      expect(ANNUAL[2008][id]!, id).toBeLessThan(-0.3);
    }
  });

  it('keeps gold flat-to-negative through the eighties disinflation', () => {
    let acc = 1;
    for (let y = 1981; y <= 1985; y++) acc *= 1 + ANNUAL[y].oro!;
    expect(acc).toBeLessThan(1);
  });
});
