// src/lib/games/stonks/ai.ts
import { MARKET_DATA, INDEX_ASSET, INCOME_PER_ROUND } from './data';

/** El Mercat: dollar-cost-averaging fully invested in the index. */
export function aiAdvance(netWorth: number, year: number): number {
  const r = MARKET_DATA[year][INDEX_ASSET] ?? 0;
  return (netWorth + INCOME_PER_ROUND) * (1 + r);
}
