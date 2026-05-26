// src/lib/games/stonks/engine.ts
import type { AssetId, AssetMeta, GameState } from './types';
import {
  ASSETS, ASSET_IDS, MARKET_DATA, YEARS, TOTAL_ROUNDS,
  INITIAL_CASH, INCOME_PER_ROUND, LIFE_EVENTS, LIFE_EVENT_CHANCE,
} from './data';
import { aiAdvance } from './ai';

const zeroAllAssets = (): Record<AssetId, number> =>
  Object.fromEntries(ASSET_IDS.map((id) => [id, 0])) as Record<AssetId, number>;

export function createInitialState(): GameState {
  return {
    round: 0,
    cash: INITIAL_CASH,
    holdings: zeroAllAssets(),
    allocation: zeroAllAssets(),
    ai: { netWorth: INITIAL_CASH },
    lastEvent: null,
    lastReturns: null,
    history: [],
    phase: 'start',
  };
}

export const currentYear = (s: GameState): number =>
  YEARS[Math.min(s.round, YEARS.length - 1)];

export const unlockedAssets = (round: number): AssetMeta[] =>
  ASSETS.filter((a) => a.unlockRound <= round);

export const netWorth = (s: GameState): number =>
  s.cash + ASSET_IDS.reduce((sum, id) => sum + s.holdings[id], 0);

export const allocationSum = (s: GameState): number =>
  unlockedAssets(s.round).reduce((sum, a) => sum + (s.allocation[a.id] || 0), 0);

export const isAllocationValid = (s: GameState): boolean => allocationSum(s) === 100;

export const isFinished = (s: GameState): boolean => s.round >= TOTAL_ROUNDS;

/** Advance one year: invest by allocation, apply returns, income, and a possible life event. */
export function advanceYear(s: GameState, rng: () => number = Math.random): GameState {
  const year = currentYear(s);
  const returns = MARKET_DATA[year];
  const total = netWorth(s);

  // 1. Re-invest the whole net worth according to the allocation.
  const holdings = zeroAllAssets();
  for (const a of unlockedAssets(s.round)) {
    holdings[a.id] = (total * (s.allocation[a.id] || 0)) / 100;
  }

  // 2. Apply this year's return to each holding (null => unchanged).
  for (const id of ASSET_IDS) {
    const r = returns[id];
    if (r != null) holdings[id] = holdings[id] * (1 + r);
  }

  // 3. New cash starts at 0 (everything was allocated); add income for the next year.
  let cash = INCOME_PER_ROUND;

  // 4. Possible life event.
  let lastEvent: GameState['lastEvent'] = null;
  if (rng() < LIFE_EVENT_CHANCE) {
    const ev = LIFE_EVENTS[Math.floor(rng() * LIFE_EVENTS.length) % LIFE_EVENTS.length];
    lastEvent = ev;
    cash = Math.max(0, cash + ev.amount);
  }

  // 5. Advance the AI benchmark.
  const ai = { netWorth: aiAdvance(s.ai.netWorth, year) };

  const nextRound = s.round + 1;
  const playerNet = cash + ASSET_IDS.reduce((sum, id) => sum + holdings[id], 0);
  const history = [...s.history, { year, playerNet, aiNet: ai.netWorth }];

  return {
    ...s,
    round: nextRound,
    cash,
    holdings,
    allocation: zeroAllAssets(),
    ai,
    lastEvent,
    lastReturns: returns,
    history,
    phase: nextRound >= TOTAL_ROUNDS ? 'finished' : 'results',
  };
}
