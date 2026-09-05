// src/lib/games/stonks/engine.ts
import type { AssetId, AssetMeta, GameState, Position, StockId } from './types';
import { capitalGainsTax, commissionRate, cpiIndex, toReal } from './money';
import { semesterReturn } from './data/market';
import {
  ASSETS, ASSET_IDS, assetMeta, isAvailable, STAR_STOCKS,
  INITIAL_CASH, INCOME_PER_SEMESTER, LIFE_EVENTS, LIFE_EVENT_CHANCE,
} from './data';
import { aiAdvance } from './ai';
import { credit, offeredIds, payFrom, rebalance, sumCosts, sumValues } from './advance-core';

export const WINDOW_YEARS = 25;
export const TOTAL_ROUNDS = WINDOW_YEARS * 2;
export const FIRST_START_YEAR = 1971;
export const LAST_START_YEAR = 2025 - WINDOW_YEARS + 1;   // 2001
export const STOCKS_PER_GAME = 5;

/** Clamped so a finished game still reports its last playable semester. */
export const currentYear = (s: GameState): number =>
  s.startYear + Math.floor(Math.min(s.round, TOTAL_ROUNDS - 1) / 2);

export const currentHalf = (s: GameState): 0 | 1 =>
  (Math.min(s.round, TOTAL_ROUNDS - 1) % 2) as 0 | 1;

const pick = <T>(xs: T[], rng: () => number): T =>
  xs[Math.min(Math.floor(rng() * xs.length), xs.length - 1)];

export function drawWindow(rng: () => number): number {
  const span = LAST_START_YEAR - FIRST_START_YEAR + 1;
  return FIRST_START_YEAR + Math.min(Math.floor(rng() * span), span - 1);
}

/**
 * Five companies drawn from those that trade inside the window.
 *
 * Guarantees, in priority order:
 *   1. one that actually DIES inside the window — a collapse falling after the
 *      final semester is a fact the player never gets to see;
 *   2. one star.
 *
 * Both decay silently when the window makes them impossible (nobody dies
 * between 1971 and 1995) rather than looping or throwing.
 */
export function drawStocks(startYear: number, rng: () => number): StockId[] {
  const endYear = startYear + WINDOW_YEARS - 1;
  const candidates = ASSETS
    .filter((a) => a.group === 'empresa' && a.fromYear <= endYear)
    .map((a) => a.id as StockId);
  if (candidates.length <= STOCKS_PER_GAME) return candidates;

  const diesInside = (id: StockId): boolean => {
    const u = assetMeta[id].untilYear;
    return u !== undefined && u >= startYear && u <= endYear;
  };

  const chosen: StockId[] = [];
  const takeOne = (pool: StockId[]) => {
    const free = pool.filter((id) => !chosen.includes(id));
    if (free.length) chosen.push(pick(free, rng));
  };

  takeOne(candidates.filter(diesInside));
  takeOne(candidates.filter((id) => STAR_STOCKS.includes(id)));
  while (chosen.length < STOCKS_PER_GAME) takeOne(candidates);
  return chosen;
}

export const emptyHoldings = (): Record<AssetId, Position> =>
  Object.fromEntries(ASSET_IDS.map((id) => [id, { value: 0, cost: 0 }])) as Record<AssetId, Position>;

export const zeroAllocation = (): Record<AssetId, number> =>
  Object.fromEntries(ASSET_IDS.map((id) => [id, 0])) as Record<AssetId, number>;

export function createInitialState(rng: () => number = Math.random): GameState {
  const startYear = drawWindow(rng);
  const holdings = emptyHoldings();
  // Initial capital is defined in start-year euros, so every window opens the same.
  holdings.efectivo = { value: INITIAL_CASH, cost: INITIAL_CASH };
  return {
    startYear,
    round: 0,
    stocks: drawStocks(startYear, rng),
    seenCards: [],
    holdings,
    allocation: zeroAllocation(),
    pendingGain: 0,
    totalCosts: 0,
    peakStockShare: 0,
    ai: { value: INITIAL_CASH, cost: INITIAL_CASH },
    lastEvent: null,
    lastReturns: null,
    lastCosts: null,
    lastDeath: null,
    deaths: [],
    history: [],
    phase: 'start',
  };
}

/** What the board shows this semester: base assets plus only the drawn companies. */
export function availableAssets(s: GameState): AssetMeta[] {
  const year = currentYear(s);
  const half = currentHalf(s);
  return ASSETS.filter((a) => {
    if (a.group === 'empresa' && !s.stocks.includes(a.id as StockId)) return false;
    return isAvailable(a, year, half);
  });
}

// ── Semester advance ──────────────────────────────────────────────────────

export const netWorth = (s: GameState): number => sumValues(s.holdings);

export const realNetWorth = (s: GameState): number =>
  toReal(netWorth(s), cpiIndex(s.startYear, s.round));

/** A start-year euro amount expressed in the current semester's euros. */
export const inflate = (amount: number, s: GameState): number =>
  amount * cpiIndex(s.startYear, s.round);

export const allocationSum = (s: GameState): number =>
  availableAssets(s).reduce((sum, a) => sum + (s.allocation[a.id] || 0), 0);

export const isAllocationValid = (s: GameState): boolean => allocationSum(s) === 100;

/**
 * The semester's pay packet, in the player's cash before they allocate.
 *
 * Income arrives at the START of the semester on purpose. Paying it at the end
 * would cost the player one semester of return on every euro they earn, and a
 * benchmark that invests on payday would then beat a perfectly passive player
 * by about 2 % over 25 years for a reason no student could ever discover.
 */
const withIncome = (s: GameState): Record<AssetId, Position> => ({
  ...s.holdings,
  efectivo: credit(s.holdings.efectivo, inflate(INCOME_PER_SEMESTER, s)),
});

interface Plan {
  holdings: Record<AssetId, Position>;
  commission: number;
  tax: number;
}

/**
 * Price the move, then execute it against what is left after paying for it.
 *
 * Two passes: the first prices the trade against the whole pot, the second
 * allocates the pot minus that bill. The alternative — allocate everything,
 * then bill — leaves a player who chose 100 % equities with no cash to pay
 * with, forcing a sale and a phantom tax charge every single semester.
 *
 * The second pass moves marginally less than the first, so the bill is a
 * hair's breadth high. It is quoted from the first pass either way, which is
 * what keeps previewCost honest: the figure shown is the figure charged.
 */
function planSemester(s: GameState, holdings: Record<AssetId, Position>): Plan {
  const offered = offeredIds(availableAssets(s));
  const total = sumValues(holdings);

  const priced = rebalance(holdings, s.allocation, offered, total);
  const commission = priced.turnover * commissionRate(currentYear(s));
  const tax = capitalGainsTax(priced.realised + s.pendingGain);

  const executed = rebalance(holdings, s.allocation, offered, Math.max(0, total - commission - tax));
  return { holdings: executed.holdings, commission, tax };
}

/** What confirming the current allocation would cost, shown before committing. */
export function previewCost(s: GameState): { commission: number; tax: number } {
  const { commission, tax } = planSemester(s, withIncome(s));
  return { commission, tax };
}

/**
 * One semester. The order is load-bearing:
 *   1. income lands, 2. the allocation is priced and executed, 3. the market
 *   moves, 4. any company whose final semester this is collapses, 5. life event.
 * Pricing BEFORE the returns is what makes a still portfolio cost nothing.
 */
export function advanceSemester(s: GameState, rng: () => number = Math.random): GameState {
  const year = currentYear(s);
  const half = currentHalf(s);
  const income = inflate(INCOME_PER_SEMESTER, s);

  // 1-2. Income arrives, then the allocation is priced and executed.
  const plan = planSemester(s, withIncome(s));
  let holdings = plan.holdings;
  let pendingGain = 0;
  let forced = false;

  // 3. The market moves. Value changes; cost basis never does.
  const lastReturns: Partial<Record<AssetId, number>> = {};
  for (const id of ASSET_IDS) {
    const r = semesterReturn(id, year, half);
    if (r === null) continue;
    lastReturns[id] = r;
    holdings[id] = { ...holdings[id], value: holdings[id].value * (1 + r) };
  }

  // 4. A company dies: the position is gone and the loss is real.
  let lastDeath: StockId | null = null;
  const deaths = [...s.deaths];
  for (const id of s.stocks) {
    const m = assetMeta[id];
    if (m.untilYear === year && (m.untilHalf ?? 1) === half) {
      lastDeath = id;
      deaths.push(id);
      pendingGain += holdings[id].value - holdings[id].cost;
      holdings[id] = { value: 0, cost: 0 };
    }
  }

  // 5. Life event. An expense larger than cash forces a sale at whatever price
  //    the market happens to be offering, which is exactly the point.
  let lastEvent: GameState['lastEvent'] = null;
  if (rng() < LIFE_EVENT_CHANCE) {
    const ev = LIFE_EVENTS[Math.min(Math.floor(rng() * LIFE_EVENTS.length), LIFE_EVENTS.length - 1)];
    const amount = inflate(ev.amount, s);
    lastEvent = ev;
    if (amount >= 0) {
      holdings.efectivo = credit(holdings.efectivo, amount);
    } else {
      const paid = payFrom(holdings, -amount);
      holdings = paid.holdings;
      pendingGain += paid.realised;
      forced = paid.forced;
    }
  }

  // 6. Book the semester.
  const nextRound = s.round + 1;
  const nominal = sumValues(holdings);
  const ai = aiAdvance(s.ai, year, half, income);
  const biggestStock = s.stocks.reduce((max, id) => Math.max(max, holdings[id].value), 0);

  return {
    ...s,
    round: nextRound,
    holdings,
    allocation: zeroAllocation(),
    pendingGain,
    totalCosts: s.totalCosts + plan.commission + plan.tax,
    peakStockShare: nominal > 0
      ? Math.max(s.peakStockShare, biggestStock / nominal)
      : s.peakStockShare,
    ai,
    lastEvent,
    lastReturns,
    lastCosts: { commission: plan.commission, tax: plan.tax, forced },
    lastDeath,
    deaths,
    history: [...s.history, {
      year, half, nominal,
      real: toReal(nominal, cpiIndex(s.startYear, nextRound)),
      ai: ai.value,
    }],
    phase: nextRound >= TOTAL_ROUNDS ? 'reveal' : 'results',
  };
}

/**
 * End of the game: both sides liquidate and settle the deferred tax on their
 * latent gains, so a player who traded all the way through is compared fairly
 * against a benchmark that never sold.
 */
export function finalize(s: GameState): { player: number; ai: number } {
  const value = netWorth(s);
  return {
    player: value - capitalGainsTax(value - sumCosts(s.holdings) + s.pendingGain),
    ai: s.ai.value - capitalGainsTax(s.ai.value - s.ai.cost),
  };
}
