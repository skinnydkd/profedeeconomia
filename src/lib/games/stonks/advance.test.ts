// src/lib/games/stonks/advance.test.ts
// The semester advance: friction, inflation, company death and forced sales.
// Kept apart from engine.test.ts, which covers the draws and the calendar.
import { describe, it, expect } from 'vitest';
import {
  createInitialState, advanceSemester, availableAssets, finalize,
  netWorth, realNetWorth, inflate, previewCost, TOTAL_ROUNDS,
} from './engine';
import { INCOME_PER_SEMESTER, LIFE_EVENT_CHANCE, LIFE_EVENTS } from './data';
import type { GameState } from './types';

/** rng above LIFE_EVENT_CHANCE: no life event ever fires. */
const quiet = () => 0.99;

/** A game parked in a known window with a known board. */
const game = (over: Partial<GameState> = {}): GameState => ({
  ...createInitialState(quiet),
  startYear: 2001,
  stocks: ['e_itx'],
  phase: 'allocate',
  ...over,
});

describe('netWorth and real terms', () => {
  it('sums every position', () => {
    const s = game();
    s.holdings.oro = { value: 1000, cost: 800 };
    expect(netWorth(s)).toBeCloseTo(6000, 6);
  });

  it('deflates into start-year purchasing power', () => {
    const s = game({ round: 2 });
    expect(realNetWorth(s)).toBeLessThan(netWorth(s));
  });

  it('leaves the first semester undeflated', () => {
    const s = game({ round: 0 });
    expect(realNetWorth(s)).toBeCloseTo(netWorth(s), 6);
  });
});

describe('inflate', () => {
  it('pays the start-year amount in the very first semester', () => {
    expect(inflate(INCOME_PER_SEMESTER, game({ round: 0 }))).toBeCloseTo(INCOME_PER_SEMESTER, 6);
  });

  it('tracks the CPI so a 1971 window is not handed 2025 money', () => {
    const late = game({ startYear: 1971, round: 40 });   // 1991
    expect(inflate(INCOME_PER_SEMESTER, late)).toBeGreaterThan(INCOME_PER_SEMESTER * 3);
  });
});

describe('advanceSemester — friction', () => {
  it('charges nothing to leave money exactly where it already is', () => {
    const s = game();
    s.allocation = { ...s.allocation, efectivo: 100 };   // cash stays cash
    const next = advanceSemester(s, quiet);
    expect(next.lastCosts!.commission).toBeCloseTo(0, 6);
    expect(next.lastCosts!.tax).toBeCloseTo(0, 6);
    expect(next.totalCosts).toBeCloseTo(0, 6);
  });

  it('charges for the money that moves, never for the money already invested', () => {
    // A 500.000 EUR portfolio and a 5.000 EUR one, both fully invested and both
    // left alone, pay the same: the commission tracks the flow, not the stock.
    const invested = (amount: number) => {
      const s = game();
      s.holdings.efectivo = { value: 0, cost: 0 };
      s.holdings.mundial = { value: amount, cost: amount };
      s.allocation = { ...s.allocation, mundial: 100 };
      return advanceSemester(s, quiet).lastCosts!.commission;
    };
    expect(invested(500000)).toBeCloseTo(invested(5000), 6);
  });

  it('charges one commission to put cash into the market, not two', () => {
    const s = game();
    s.allocation = { ...s.allocation, mundial: 100 };   // 5000 saved + 3000 earned
    const next = advanceSemester(s, quiet);
    expect(next.lastCosts!.commission)
      .toBeCloseTo((5000 + INCOME_PER_SEMESTER) * 0.005, 4);   // 2001 is in the 0,5 % tier
  });

  it('charges both sides when one security is swapped for another', () => {
    const s = game();
    s.holdings.efectivo = { value: 0, cost: 0 };
    s.holdings.oro = { value: 5000, cost: 5000 };
    s.allocation = { ...s.allocation, mundial: 100 };   // sell gold, buy the index
    const next = advanceSemester(s, quiet);
    const sold = 5000;
    const bought = 5000 + INCOME_PER_SEMESTER;
    expect(next.lastCosts!.commission).toBeCloseTo((sold + bought) * 0.005, 4);
  });

  it('taxes gains realised by a sale, and only those', () => {
    const s = game();
    s.holdings.efectivo = { value: 0, cost: 0 };
    s.holdings.oro = { value: 10000, cost: 4000 };      // 6000 latent gain
    s.allocation = { ...s.allocation, efectivo: 100 };
    expect(advanceSemester(s, quiet).lastCosts!.tax).toBeCloseTo(6000 * 0.19, 2);
  });

  it('lets a loss in the same semester offset a gain', () => {
    const s = game();
    s.holdings.efectivo = { value: 0, cost: 0 };
    s.holdings.oro   = { value: 10000, cost: 4000 };    // +6000
    s.holdings.deuda = { value: 2000,  cost: 8000 };    // -6000
    s.allocation = { ...s.allocation, efectivo: 100 };
    expect(advanceSemester(s, quiet).lastCosts!.tax).toBeCloseTo(0, 6);
  });

  it('does not tax a holding that merely went up while untouched', () => {
    const s = game();
    s.holdings.efectivo = { value: 0, cost: 0 };
    s.holdings.oro = { value: 10000, cost: 1000 };
    s.allocation = { ...s.allocation, oro: 100 };
    expect(advanceSemester(s, quiet).lastCosts!.tax).toBeCloseTo(0, 6);
  });

  it('previewCost matches what the advance then charges', () => {
    const s = game();
    s.holdings.efectivo = { value: 2000, cost: 1000 };
    s.holdings.oro = { value: 8000, cost: 3000 };
    s.allocation = { ...s.allocation, mundial: 60, oro: 40 };
    const preview = previewCost(s);
    const next = advanceSemester(s, quiet);
    expect(next.lastCosts!.commission).toBeCloseTo(preview.commission, 6);
    expect(next.lastCosts!.tax).toBeCloseTo(preview.tax, 6);
  });

  it('accumulates every cost for the closing lessons', () => {
    let s = game();
    s.allocation = { ...s.allocation, mundial: 100 };
    s = advanceSemester(s, quiet);
    const first = s.totalCosts;
    s.allocation = { ...s.allocation, oro: 100 };
    s = advanceSemester(s, quiet);
    expect(s.totalCosts).toBeGreaterThan(first);
  });
});

describe('advanceSemester — the market and the calendar', () => {
  it('applies the semester return to value but never to cost basis', () => {
    const s = game();
    s.holdings.efectivo = { value: 0, cost: 0 };
    s.holdings.oro = { value: 1000, cost: 1000 };
    s.allocation = { ...s.allocation, oro: 100 };
    const next = advanceSemester(s, quiet);
    const r = next.lastReturns!.oro!;
    expect(next.holdings.oro.value / next.holdings.oro.cost).toBeCloseTo(1 + r, 6);
  });

  it('never lets an asset the board does not offer hold value', () => {
    const s = game({ startYear: 1971, round: 0, stocks: [] });
    s.allocation = { ...s.allocation, bitcoin: 100 };   // does not exist in 1971
    expect(advanceSemester(s, quiet).holdings.bitcoin.value).toBe(0);
  });

  it('appends one history row per semester and ends after 50', () => {
    let s = game({ round: 0 });
    for (let i = 0; i < TOTAL_ROUNDS; i++) {
      s.allocation = { ...s.allocation, efectivo: 100 };
      s = advanceSemester(s, quiet);
    }
    expect(s.history).toHaveLength(TOTAL_ROUNDS);
    expect(s.round).toBe(TOTAL_ROUNDS);
    expect(s.phase).toBe('reveal');
  });

  it('records both nominal and real in every history row', () => {
    let s = game({ startYear: 1974, round: 0, stocks: [] });
    s.allocation = { ...s.allocation, efectivo: 100 };
    s = advanceSemester(s, quiet);
    const row = s.history[0]!;
    expect(row.year).toBe(1974);
    expect(row.half).toBe(0);
    expect(row.real).toBeLessThan(row.nominal);         // 1974 inflation was 15,7 %
  });
});

describe('advanceSemester — company death', () => {
  it('wipes the position, flags it, and drops the asset from the board', () => {
    const s = game({ startYear: 2001, stocks: ['e_popular'], round: 32 });  // 2017 H1
    s.holdings.efectivo = { value: 0, cost: 0 };
    s.holdings.e_popular = { value: 4000, cost: 3000 };
    s.allocation = { ...s.allocation, e_popular: 100 };
    const next = advanceSemester(s, quiet);
    expect(next.lastDeath).toBe('e_popular');
    expect(next.deaths).toContain('e_popular');
    expect(next.holdings.e_popular.value).toBe(0);
    expect(next.pendingGain).toBeLessThan(0);           // the loss carries to next semester
    expect(availableAssets(next).map((a) => a.id)).not.toContain('e_popular');
  });

  it('leaves lastDeath null in an ordinary semester', () => {
    const s = game();
    s.allocation = { ...s.allocation, efectivo: 100 };
    expect(advanceSemester(s, quiet).lastDeath).toBeNull();
  });
});

describe('advanceSemester — life events and forced liquidation', () => {
  const noisy = () => 0.01;   // fires an event, and picks the first row of the table

  /** Fires the life event, then selects `id` from the table. */
  const firesEvent = (id: string) => {
    const i = LIFE_EVENTS.findIndex((e) => e.id === id);
    if (i < 0) throw new Error(`no life event ${id}`);
    let call = 0;
    return () => (call++ === 0 ? 0.01 : (i + 0.5) / LIFE_EVENTS.length);
  };

  it('has at least one expense a semester of income cannot absorb', () => {
    // Otherwise the forced-sale path is unreachable and the cushion lesson dies.
    const worst = Math.min(...LIFE_EVENTS.map((e) => e.amount));
    expect(-worst).toBeGreaterThan(INCOME_PER_SEMESTER);
  });

  it('sells proportionally when income and cash cannot cover the expense', () => {
    const s = game();
    s.holdings.efectivo = { value: 0, cost: 0 };
    s.holdings.oro = { value: 20000, cost: 20000 };
    s.allocation = { ...s.allocation, oro: 100 };
    const next = advanceSemester(s, firesEvent('paro'));
    expect(next.lastEvent!.id).toBe('paro');
    expect(next.lastCosts!.forced).toBe(true);
    expect(next.holdings.oro.value).toBeLessThan(20000);
  });

  it('does not force a sale when cash covers it', () => {
    const s = game();
    s.holdings.efectivo = { value: 50000, cost: 50000 };
    s.allocation = { ...s.allocation, efectivo: 100 };
    expect(advanceSemester(s, firesEvent('paro')).lastCosts!.forced).toBe(false);
  });

  it('is a cash cushion, not income, that prevents a forced sale', () => {
    // Income does not protect you if you put every euro of it into the market
    // the moment it arrives. Only cash you actually kept does.
    const withCushion = game();
    withCushion.holdings.efectivo = { value: 0, cost: 0 };
    withCushion.holdings.oro = { value: 20000, cost: 20000 };
    withCushion.allocation = { ...withCushion.allocation, oro: 90, efectivo: 10 };
    expect(advanceSemester(withCushion, firesEvent('multa')).lastCosts!.forced).toBe(false);

    const allIn = game();
    allIn.holdings.efectivo = { value: 0, cost: 0 };
    allIn.holdings.oro = { value: 20000, cost: 20000 };
    allIn.allocation = { ...allIn.allocation, oro: 100 };
    expect(advanceSemester(allIn, firesEvent('multa')).lastCosts!.forced).toBe(true);
  });

  it('fires an event roughly one semester in five', () => {
    let fired = 0;
    const runs = 1000;
    for (let i = 0; i < runs; i++) {
      const s = game();
      s.allocation = { ...s.allocation, efectivo: 100 };
      if (advanceSemester(s, Math.random).lastEvent) fired++;
    }
    expect(fired / runs).toBeGreaterThan(LIFE_EVENT_CHANCE - 0.06);
    expect(fired / runs).toBeLessThan(LIFE_EVENT_CHANCE + 0.06);
  });
});

describe('finalize', () => {
  it('settles the deferred tax on both sides', () => {
    const s = game({ round: TOTAL_ROUNDS });
    s.holdings.efectivo = { value: 0, cost: 0 };
    s.holdings.mundial = { value: 20000, cost: 10000 };
    s.ai = { value: 20000, cost: 10000 };
    const { player, ai } = finalize(s);
    expect(player).toBeLessThan(20000);
    expect(player).toBeCloseTo(ai, 6);
  });

  it('ties with a player who holds the world index and never trades', () => {
    // The benchmark must be neither beatable by accident nor unbeatable by construction.
    let s = game({ startYear: 1990, stocks: [] });
    s.holdings.efectivo = { value: 0, cost: 0 };
    s.holdings.mundial = { value: s.ai.value, cost: s.ai.cost };
    for (let i = 0; i < TOTAL_ROUNDS; i++) {
      s.allocation = { ...s.allocation, mundial: 100 };
      s = advanceSemester(s, quiet);
    }
    const { player, ai } = finalize(s);
    expect(player / ai).toBeCloseTo(1, 2);
  });
});
