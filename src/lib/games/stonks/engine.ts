// src/lib/games/stonks/engine.ts
import type { AssetId, AssetMeta, GameState, Position, StockId } from './types';
import { ASSETS, ASSET_IDS, assetMeta, isAvailable, STAR_STOCKS, INITIAL_CASH } from './data';

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

const pick = <T>(xs: T[], rng: () => number): T => xs[Math.min(Math.floor(rng() * xs.length), xs.length - 1)];

export function drawWindow(rng: () => number): number {
  const span = LAST_START_YEAR - FIRST_START_YEAR + 1;
  return FIRST_START_YEAR + Math.min(Math.floor(rng() * span), span - 1);
}

/**
 * Five companies drawn from those that trade inside the window.
 *
 * Guarantees, in priority order:
 *   1. one that actually DIES inside the window — a wipe-out that happens
 *      after the final semester teaches nothing;
 *   2. one star.
 *
 * Both decay silently when the window makes them impossible (1971-1995 has no
 * deaths at all), rather than looping or throwing.
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

const zeroPosition = (): Position => ({ value: 0, cost: 0 });

export const emptyHoldings = (): Record<AssetId, Position> =>
  Object.fromEntries(ASSET_IDS.map((id) => [id, zeroPosition()])) as Record<AssetId, Position>;

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
