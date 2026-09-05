// src/lib/games/stonks/advance-core.ts
// The rebalance itself, kept apart from the semester orchestration in engine.ts
// so the money-moving rules can be read and tested on their own.
import type { AssetId, GameState, Position } from './types';
import { ASSET_IDS } from './data';
import { sellFrom } from './money';

export interface Rebalanced {
  holdings: Record<AssetId, Position>;
  turnover: number;
  realised: number;
}

/**
 * Move every position towards its share of `investable`. Sells realise gains at
 * average cost; buys extend the cost basis.
 *
 * Two rules carry the whole lesson:
 *
 *   · Turnover is what MOVED, not what is held. A portfolio left alone costs
 *     nothing — the thing the closing screen has always claimed and never
 *     enforced.
 *   · `efectivo` is excluded from turnover. Cash is not a security and no
 *     broker charges you to move money out of your own account; counting it
 *     would bill every euro of income twice on its way into the market.
 */
export function rebalance(
  holdings: Record<AssetId, Position>,
  allocation: Record<AssetId, number>,
  offered: Set<AssetId>,
  investable: number,
): Rebalanced {
  const next = { ...holdings };
  let turnover = 0;
  let realised = 0;

  const targetFor = (id: AssetId): number =>
    offered.has(id) ? (investable * (allocation[id] || 0)) / 100 : 0;

  // Sells first, so the proceeds are real before anything is bought.
  for (const id of ASSET_IDS) {
    const diff = next[id].value - targetFor(id);
    if (diff > 0) {
      const { position, realised: gain } = sellFrom(next[id], diff);
      next[id] = position;
      if (id !== 'efectivo') turnover += diff;
      realised += gain;
    }
  }
  for (const id of ASSET_IDS) {
    const diff = targetFor(id) - next[id].value;
    if (diff > 0) {
      next[id] = { value: next[id].value + diff, cost: next[id].cost + diff };
      if (id !== 'efectivo') turnover += diff;
    }
  }
  return { holdings: next, turnover, realised };
}

/**
 * Take `amount` € out of cash; if cash is short, liquidate the rest
 * proportionally across every other position.
 *
 * Gains realised this way are RETURNED rather than taxed here, so the caller
 * can defer them to the next semester. Taxing them on the spot would recurse:
 * tax → forced sale → gain → more tax.
 */
export function payFrom(
  holdings: Record<AssetId, Position>,
  amount: number,
): { holdings: Record<AssetId, Position>; realised: number; forced: boolean } {
  const next = { ...holdings };
  const fromCash = Math.min(amount, next.efectivo.value);
  next.efectivo = {
    value: next.efectivo.value - fromCash,
    cost: Math.max(0, next.efectivo.cost - fromCash),
  };
  const short = amount - fromCash;
  if (short <= 1e-9) return { holdings: next, realised: 0, forced: false };

  const others = ASSET_IDS.filter((id) => id !== 'efectivo' && next[id].value > 0);
  const pool = others.reduce((sum, id) => sum + next[id].value, 0);
  if (pool <= 0) return { holdings: next, realised: 0, forced: true };

  let realised = 0;
  const take = Math.min(short, pool);
  for (const id of others) {
    const { position, realised: gain } = sellFrom(next[id], take * (next[id].value / pool));
    next[id] = position;
    realised += gain;
  }
  return { holdings: next, realised, forced: true };
}

/** Add money to a position with no latent gain attached (income, a windfall). */
export const credit = (p: Position, amount: number): Position =>
  ({ value: p.value + amount, cost: p.cost + amount });

export const sumValues = (h: Record<AssetId, Position>): number =>
  ASSET_IDS.reduce((sum, id) => sum + h[id].value, 0);

export const sumCosts = (h: Record<AssetId, Position>): number =>
  ASSET_IDS.reduce((sum, id) => sum + h[id].cost, 0);

/** Convenience for callers that only have a GameState. */
export const offeredIds = (assets: { id: AssetId }[]): Set<AssetId> =>
  new Set(assets.map((a) => a.id));

export type { GameState };
