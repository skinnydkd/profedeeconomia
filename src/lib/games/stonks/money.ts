// src/lib/games/stonks/money.ts
import type { Half, Position } from './types';
import { CPI } from './data/inflation';

/**
 * Retail brokerage cost fell by an order of magnitude over the period, and
 * that fall is itself economic history worth showing rather than averaging away.
 */
const COMMISSION_TIERS: { untilYear: number; rate: number }[] = [
  { untilYear: 1990, rate: 0.010 },
  { untilYear: 2010, rate: 0.005 },
  { untilYear: Infinity, rate: 0.002 },
];

export function commissionRate(year: number): number {
  return COMMISSION_TIERS.find((t) => year <= t.untilYear)!.rate;
}

/**
 * Spanish savings-base brackets. Progressive: each slice is taxed at its own
 * rate, so one more euro of gain can never cost more than one euro of tax.
 */
const GAINS_BRACKETS: { upTo: number; rate: number }[] = [
  { upTo: 6000, rate: 0.19 },
  { upTo: 50000, rate: 0.21 },
  { upTo: Infinity, rate: 0.23 },
];

export function capitalGainsTax(netGain: number): number {
  if (netGain <= 0) return 0;
  let remaining = netGain;
  let previous = 0;
  let tax = 0;
  for (const b of GAINS_BRACKETS) {
    const slice = Math.min(remaining, b.upTo - previous);
    tax += slice * b.rate;
    remaining -= slice;
    previous = b.upTo;
    if (remaining <= 0) break;
  }
  return tax;
}

/**
 * Sell `amount` € out of a position, average-cost basis.
 *
 * Spanish law is FIFO for shares; average cost is a documented simplification
 * (design spec §8.1). It avoids tracking individual lots and does not change
 * the lesson, which is that selling a winner triggers a bill.
 */
export function sellFrom(p: Position, amount: number): { position: Position; realised: number } {
  if (p.value <= 0 || amount <= 0) return { position: p, realised: 0 };
  const sold = Math.min(amount, p.value);
  const share = sold / p.value;
  const costSold = p.cost * share;
  return {
    position: { value: p.value - sold, cost: p.cost - costSold },
    realised: sold - costSold,
  };
}

function rate(year: number): number {
  const r = CPI[year];
  if (r === undefined) throw new Error(`No CPI data for ${year}`);
  return r;
}

/**
 * Cumulative price index at the START of semester `round`, anchored so that
 * cpiIndex(startYear, 0) === 1. Inflation is split geometrically within a year,
 * the same rule the market returns use.
 */
export function cpiIndex(startYear: number, round: number): number {
  const years = Math.floor(round / 2);
  const half = (round % 2) as Half;
  let index = 1;
  for (let y = startYear; y < startYear + years; y++) {
    index *= 1 + rate(y);
  }
  if (half === 1) index *= Math.sqrt(1 + rate(startYear + years));
  return index;
}

/** Nominal euros → purchasing power of the window's start year. */
export const toReal = (nominal: number, index: number): number => nominal / index;
