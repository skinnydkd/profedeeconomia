// src/lib/games/stonks/engine.test.ts
import { describe, it, expect } from 'vitest';
import {
  createInitialState, unlockedAssets, allocationSum, isAllocationValid,
  netWorth, advanceYear, isFinished, currentYear,
} from './engine';
import { INITIAL_CASH, INCOME_PER_ROUND, YEARS, TOTAL_ROUNDS } from './data';

const noEvents = () => 1; // rng returning 1 => no life event (>= LIFE_EVENT_CHANCE)

describe('engine', () => {
  it('starts at round 0, year 2000, all cash, no holdings', () => {
    const s = createInitialState();
    expect(s.round).toBe(0);
    expect(currentYear(s)).toBe(YEARS[0]);
    expect(s.cash).toBe(INITIAL_CASH);
    expect(netWorth(s)).toBe(INITIAL_CASH);
    expect(s.phase).toBe('start');
  });

  it('unlocks only round-appropriate assets', () => {
    expect(unlockedAssets(0).map((a) => a.id)).toEqual(['ahorro', 'deposito']);
    expect(unlockedAssets(3).map((a) => a.id)).toContain('ibex');
    expect(unlockedAssets(8).map((a) => a.id)).toContain('bitcoin');
  });

  it('validates the allocation sums to 100 over unlocked assets', () => {
    const s = createInitialState();
    s.allocation = { ...s.allocation, ahorro: 50, deposito: 50 };
    expect(allocationSum(s)).toBe(100);
    expect(isAllocationValid(s)).toBe(true);
    s.allocation = { ...s.allocation, ahorro: 40 };
    expect(isAllocationValid(s)).toBe(false);
  });

  it('advanceYear invests net worth by allocation then applies that year return', () => {
    const s = createInitialState();
    s.phase = 'allocate';
    s.allocation = { ...s.allocation, ahorro: 0, deposito: 100 };
    const before = netWorth(s); // 5000
    const next = advanceYear(s, noEvents);
    // year-2000 deposito return (+4%): 5000*1.04 = 5200, plus INCOME_PER_ROUND (3000) = 8200 net worth
    expect(next.round).toBe(1);
    expect(next.cash + Object.values(next.holdings).reduce((a, b) => a + b, 0)).toBeGreaterThan(before);
    expect(next.lastEvent).toBeNull();
    expect(netWorth(next)).toBeCloseTo(8200, 2);
  });

  it('adds income each advanced year', () => {
    const s = createInitialState();
    s.phase = 'allocate';
    s.allocation = { ...s.allocation, ahorro: 100, deposito: 0 };
    const next = advanceYear(s, noEvents);
    // ahorro ~0 return; net worth should be ~ initial*(1+ahorro2000) + income
    expect(netWorth(next)).toBeGreaterThanOrEqual(INITIAL_CASH + INCOME_PER_ROUND - 1);
  });

  it('applies a life event when rng triggers it', () => {
    const s = createInitialState();
    s.phase = 'allocate';
    s.allocation = { ...s.allocation, ahorro: 100, deposito: 0 };
    const next = advanceYear(s, () => 0); // 0 < chance => event fires
    expect(next.lastEvent).not.toBeNull();
  });

  it('asset with null return that year keeps its value unchanged', () => {
    const s = createInitialState();
    s.round = 8;            // year 2008, bitcoin unlocked but MARKET_DATA[2008].bitcoin === null
    s.phase = 'allocate';
    s.cash = 0;
    s.holdings = { ...s.holdings, bitcoin: 1000 };
    s.allocation = { ...s.allocation };
    for (const a of unlockedAssets(8)) s.allocation[a.id] = 0;
    s.allocation.bitcoin = 100;
    const next = advanceYear(s, () => 1); // no event
    expect(next.holdings.bitcoin).toBeCloseTo(1000, 2); // net worth 1000 → 100% bitcoin → null return → unchanged
  });

  it('life event cannot push cash below zero', () => {
    const s = createInitialState();
    s.phase = 'allocate';
    s.allocation = { ...s.allocation, ahorro: 100, deposito: 0 };
    // Force the medico event (amount: -3000) which exceeds INCOME_PER_ROUND (3000).
    // rng call 1: triggers the event (0 < LIFE_EVENT_CHANCE = 0.3).
    // rng call 2: selects medico (index 1 in LIFE_EVENTS, length 14) → floor(1/14 * 14) = 1.
    const rng = (() => {
      let call = 0;
      return () => { call++; return call === 1 ? 0 : 1 / 14; };
    })();
    const next = advanceYear(s, rng);
    expect(next.lastEvent).not.toBeNull();
    expect(next.cash).toBeGreaterThanOrEqual(0);
  });

  it('records history and finishes after TOTAL_ROUNDS', () => {
    let s = createInitialState();
    s.phase = 'allocate';
    for (let i = 0; i < TOTAL_ROUNDS; i++) {
      s.allocation = { ...s.allocation, ...Object.fromEntries(unlockedAssets(s.round).map((a, idx, arr) => [a.id, idx === 0 ? 100 - (arr.length - 1) * Math.floor(100 / arr.length) : Math.floor(100 / arr.length)])) };
      s = advanceYear(s, noEvents);
    }
    expect(isFinished(s)).toBe(true);
    expect(s.phase).toBe('finished');
    expect(s.history.length).toBe(TOTAL_ROUNDS);
  });
});
