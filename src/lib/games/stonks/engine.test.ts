// src/lib/games/stonks/engine.test.ts
import { describe, it, expect } from 'vitest';
import {
  drawWindow, drawStocks, createInitialState, currentYear, currentHalf, availableAssets,
  FIRST_START_YEAR, LAST_START_YEAR, WINDOW_YEARS, TOTAL_ROUNDS,
} from './engine';
import { STAR_STOCKS, assetMeta } from './data/assets';
import type { GameState, StockId } from './types';

/** Deterministic RNG: replays the sequence, then repeats its last value. */
const seq = (values: number[]) => {
  let i = 0;
  return () => values[Math.min(i, values.length - 1)] ?? 0;
};

describe('drawWindow', () => {
  it('always yields a 25-year window ending in 2025 or earlier', () => {
    for (let i = 0; i < 500; i++) {
      const y = drawWindow(Math.random);
      expect(y).toBeGreaterThanOrEqual(FIRST_START_YEAR);
      expect(y).toBeLessThanOrEqual(LAST_START_YEAR);
      expect(y + WINDOW_YEARS - 1).toBeLessThanOrEqual(2025);
    }
  });

  it('reaches both ends of the range', () => {
    expect(drawWindow(seq([0]))).toBe(FIRST_START_YEAR);
    expect(drawWindow(seq([0.999999]))).toBe(LAST_START_YEAR);
  });
});

describe('drawStocks', () => {
  it('draws five companies without repeats', () => {
    for (let i = 0; i < 200; i++) {
      const picked = drawStocks(2001, Math.random);
      expect(picked).toHaveLength(5);
      expect(new Set(picked).size).toBe(5);
    }
  });

  it('only draws companies that trade inside the window', () => {
    for (let i = 0; i < 200; i++) {
      const start = drawWindow(Math.random);
      for (const id of drawStocks(start, Math.random)) {
        expect(assetMeta[id].fromYear, `${id} in ${start}`).toBeLessThanOrEqual(start + WINDOW_YEARS - 1);
      }
    }
  });

  it('always includes a star when one is reachable', () => {
    for (let i = 0; i < 200; i++) {
      const picked = drawStocks(1990, Math.random);
      expect(picked.some((s) => STAR_STOCKS.includes(s)), picked.join()).toBe(true);
    }
  });

  it('includes a company that actually dies inside the window when one exists', () => {
    // 1995-2019 contains the deaths of Terra (2005) and Banco Popular (2017).
    for (let i = 0; i < 200; i++) {
      const picked = drawStocks(1995, Math.random);
      const dies = picked.some((s) => {
        const u = assetMeta[s].untilYear;
        return u !== undefined && u >= 1995 && u <= 2019;
      });
      expect(dies, picked.join()).toBe(true);
    }
  });

  it('does not force a death when none can happen in the window', () => {
    // 1971-1995: every doomed company outlives the window. The guarantee must
    // decay rather than loop or throw.
    for (let i = 0; i < 50; i++) {
      const picked = drawStocks(1971, Math.random);
      expect(picked.length).toBeGreaterThan(0);
      expect(picked.length).toBeLessThanOrEqual(5);
    }
  });

  it('returns every candidate when exactly five are reachable', () => {
    // 1971-1995 reaches Banco Popular, Apple, Microsoft, Enron and Nokia.
    expect(drawStocks(1971, Math.random).sort()).toEqual(
      (['e_apple', 'e_enron', 'e_msft', 'e_nokia', 'e_popular'] as StockId[]).sort(),
    );
  });
});

describe('createInitialState', () => {
  it('starts at round 0 with the whole initial capital in cash', () => {
    const s = createInitialState(Math.random);
    expect(s.round).toBe(0);
    expect(s.phase).toBe('start');
    expect(s.holdings.efectivo.value).toBeGreaterThan(0);
    expect(s.holdings.efectivo.cost).toBe(s.holdings.efectivo.value);
    expect(s.history).toEqual([]);
    expect(s.pendingGain).toBe(0);
    expect(s.totalCosts).toBe(0);
    expect(s.deaths).toEqual([]);
  });

  it('gives every asset a zeroed position, not an undefined one', () => {
    const s = createInitialState(Math.random);
    for (const a of Object.values(assetMeta)) {
      expect(s.holdings[a.id], a.id).toEqual(
        a.id === 'efectivo' ? s.holdings.efectivo : { value: 0, cost: 0 },
      );
    }
  });

  it('maps rounds onto years and halves', () => {
    const base = createInitialState(Math.random);
    const s: GameState = { ...base, startYear: 1980 };
    expect(currentYear({ ...s, round: 0 })).toBe(1980);
    expect(currentHalf({ ...s, round: 0 })).toBe(0);
    expect(currentHalf({ ...s, round: 1 })).toBe(1);
    expect(currentYear({ ...s, round: 2 })).toBe(1981);
    expect(currentYear({ ...s, round: TOTAL_ROUNDS - 1 })).toBe(2004);
  });

  it('clamps a finished game to the last playable semester', () => {
    const s: GameState = { ...createInitialState(Math.random), startYear: 1980, round: TOTAL_ROUNDS };
    expect(currentYear(s)).toBe(2004);
  });
});

describe('availableAssets', () => {
  it('never offers a company that was not drawn for this game', () => {
    const s: GameState = { ...createInitialState(Math.random), startYear: 2001, round: 40 };
    for (const a of availableAssets(s)) {
      if (a.group === 'empresa') expect(s.stocks).toContain(a.id as StockId);
    }
  });

  it('drops a company from the board after it dies', () => {
    const base = createInitialState(Math.random);
    const s: GameState = { ...base, startYear: 2000, stocks: ['e_enron'], round: 4 }; // 2002 H1
    expect(availableAssets(s).map((a) => a.id)).not.toContain('e_enron');
  });

  it('still offers a company in the very semester it collapses', () => {
    const base = createInitialState(Math.random);
    const s: GameState = { ...base, startYear: 2000, stocks: ['e_enron'], round: 3 }; // 2001 H2
    expect(availableAssets(s).map((a) => a.id)).toContain('e_enron');
  });

  it('offers the eight core assets in 1971 and no crypto', () => {
    const base = createInitialState(Math.random);
    const s: GameState = { ...base, startYear: 1971, stocks: [], round: 0 };
    const ids = availableAssets(s).map((a) => a.id);
    expect(ids).toHaveLength(8);
    expect(ids).not.toContain('bitcoin');
  });
});
