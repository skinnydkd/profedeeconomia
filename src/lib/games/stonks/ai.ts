// src/lib/games/stonks/ai.ts
import type { Half, Position } from './types';
import { semesterReturn } from './data/market';
import { commissionRate } from './money';
import { INDEX_ASSET } from './data';

/**
 * «El Mercat»: buys the world index with every euro of income and never sells.
 *
 * The WORLD index, not the S&P 500. Treating US outperformance as a law of
 * nature is precisely the lesson we do not want to leave behind.
 *
 * It pays the same commission the player pays, invests on the same clock (the
 * semester's income is in hand before that semester's return), and its
 * deferred capital gains are settled by engine.finalize(). A passive player
 * holding 100 % of the world index must therefore end up exactly level with
 * it — there is a test for that, and any gap is a modelling bug, not a lesson.
 */
export function aiAdvance(ai: Position, year: number, half: Half, income: number): Position {
  const invested = income * (1 - commissionRate(year));
  const r = semesterReturn(INDEX_ASSET, year, half) ?? 0;
  return {
    value: (ai.value + invested) * (1 + r),
    cost: ai.cost + invested,
  };
}
