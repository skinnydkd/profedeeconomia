import { describe, it, expect } from 'vitest';
import {
  pms,
  leakage,
  multiplier,
  simpleMultiplier,
  deltaIncome,
  spendingRounds,
  solveMultiplier,
} from './multiplicador';

describe('simple multiplier (closed economy, no taxes)', () => {
  it('PMC 0.8 → k = 5', () => {
    expect(simpleMultiplier(0.8)).toBeCloseTo(5);
    expect(multiplier({ pmc: 0.8 })).toBeCloseTo(5);
  });
  it('k = 1 / PMS', () => {
    expect(simpleMultiplier(0.75)).toBeCloseTo(1 / 0.25); // 4
    expect(pms(0.75)).toBeCloseTo(0.25);
  });
  it('a higher PMC gives a larger multiplier', () => {
    expect(simpleMultiplier(0.9)).toBeGreaterThan(simpleMultiplier(0.6));
  });
});

describe('edge cases for the simple multiplier', () => {
  it('PMC 0 → k = 1 (nothing is re-spent)', () => {
    expect(simpleMultiplier(0)).toBeCloseTo(1);
  });
  it('PMC → 1 makes the multiplier diverge to Infinity', () => {
    expect(simpleMultiplier(1)).toBe(Infinity);
    expect(solveMultiplier(100, { pmc: 1 }).converges).toBe(false);
  });
  it('the multiplier grows without bound as PMC approaches 1', () => {
    expect(simpleMultiplier(0.99)).toBeGreaterThan(simpleMultiplier(0.95));
    expect(simpleMultiplier(0.999)).toBeGreaterThan(900);
  });
});

describe('multiplier with a proportional income tax', () => {
  it('k = 1 / (1 − PMC·(1 − t))', () => {
    // PMC 0.8, t 0.25 → 1 / (1 − 0.8·0.75) = 1 / 0.4 = 2.5
    expect(multiplier({ pmc: 0.8, t: 0.25 })).toBeCloseTo(2.5);
  });
  it('taxes shrink the multiplier vs the no-tax case', () => {
    expect(multiplier({ pmc: 0.8, t: 0.25 })).toBeLessThan(simpleMultiplier(0.8));
  });
  it('t = 0 reduces to the simple multiplier', () => {
    expect(multiplier({ pmc: 0.8, t: 0 })).toBeCloseTo(simpleMultiplier(0.8));
  });
});

describe('open-economy multiplier with imports', () => {
  it('k = 1 / (1 − PMC·(1 − t) + m)', () => {
    // PMC 0.8, t 0.25, m 0.1 → 1 / (1 − 0.6 + 0.1) = 1 / 0.5 = 2
    expect(multiplier({ pmc: 0.8, t: 0.25, m: 0.1 })).toBeCloseTo(2);
  });
  it('imports shrink the multiplier further', () => {
    expect(multiplier({ pmc: 0.8, t: 0.25, m: 0.1 })).toBeLessThan(
      multiplier({ pmc: 0.8, t: 0.25 })
    );
  });
  it('leakage = 1 − PMC·(1 − t) + m', () => {
    expect(leakage({ pmc: 0.8, t: 0.25, m: 0.1 })).toBeCloseTo(0.5);
    expect(leakage({ pmc: 0.8 })).toBeCloseTo(0.2);
  });
});

describe('effect on equilibrium income ΔY = k · ΔSpending', () => {
  it('ΔY = k · ΔG with the simple multiplier', () => {
    // k = 5, ΔG = 100 → ΔY = 500
    expect(deltaIncome(100, { pmc: 0.8 })).toBeCloseTo(500);
  });
  it('solveMultiplier reports the same ΔY', () => {
    const r = solveMultiplier(100, { pmc: 0.8 });
    expect(r.k).toBeCloseTo(5);
    expect(r.deltaIncome).toBeCloseTo(500);
    expect(r.converges).toBe(true);
  });
  it('a negative injection (austerity) yields a negative ΔY', () => {
    expect(deltaIncome(-50, { pmc: 0.8 })).toBeCloseTo(-250);
  });
  it('ΔY is Infinity (non-convergent) when PMC = 1', () => {
    expect(solveMultiplier(100, { pmc: 1 }).deltaIncome).toBe(Infinity);
  });
});

describe('spending rounds cascade', () => {
  it('round 1 is the initial injection itself', () => {
    const rounds = spendingRounds(100, { pmc: 0.8 }, 3);
    expect(rounds[0]).toMatchObject({ round: 1, spending: 100, cumulative: 100 });
  });
  it('each round is PMC·(1 − t) − m of the previous one', () => {
    // simple: spend ratio = PMC = 0.8 → 100, 80, 64, ...
    const rounds = spendingRounds(100, { pmc: 0.8 }, 3);
    expect(rounds[1].spending).toBeCloseTo(80);
    expect(rounds[2].spending).toBeCloseTo(64);
    // cumulative accumulates: 100, 180, 244
    expect(rounds[1].cumulative).toBeCloseTo(180);
    expect(rounds[2].cumulative).toBeCloseTo(244);
  });
  it('the spend ratio shrinks with taxes and imports', () => {
    // PMC 0.8, t 0.25, m 0.1 → spend ratio = 0.8·0.75 − 0.1 = 0.5
    const rounds = spendingRounds(100, { pmc: 0.8, t: 0.25, m: 0.1 }, 3);
    expect(rounds[1].spending).toBeCloseTo(50);
    expect(rounds[2].spending).toBeCloseTo(25);
  });
  it('returns the requested number of rounds and an empty array for 0', () => {
    expect(spendingRounds(100, { pmc: 0.8 }, 5)).toHaveLength(5);
    expect(spendingRounds(100, { pmc: 0.8 }, 0)).toHaveLength(0);
  });
});

describe('the rounds series converges to ΔY', () => {
  it('the cumulative sum of many rounds approaches k · ΔSpending (simple)', () => {
    const target = deltaIncome(100, { pmc: 0.8 }); // 500
    const rounds = spendingRounds(100, { pmc: 0.8 }, 200);
    const last = rounds[rounds.length - 1].cumulative;
    expect(last).toBeCloseTo(target, 3);
  });
  it('the series also converges with taxes and imports', () => {
    const params = { pmc: 0.8, t: 0.25, m: 0.1 };
    const target = deltaIncome(100, params); // k = 2 → 200
    const rounds = spendingRounds(100, params, 200);
    const last = rounds[rounds.length - 1].cumulative;
    expect(target).toBeCloseTo(200);
    expect(last).toBeCloseTo(target, 3);
  });
  it('with PMC 0 the series equals the injection (k = 1)', () => {
    const rounds = spendingRounds(100, { pmc: 0 }, 10);
    expect(rounds[0].cumulative).toBeCloseTo(100);
    expect(rounds[rounds.length - 1].cumulative).toBeCloseTo(100);
  });
  it('cumulative is monotonically non-decreasing for a positive injection', () => {
    const rounds = spendingRounds(100, { pmc: 0.7 }, 20);
    for (let i = 1; i < rounds.length; i++) {
      expect(rounds[i].cumulative).toBeGreaterThanOrEqual(rounds[i - 1].cumulative);
    }
  });
});
