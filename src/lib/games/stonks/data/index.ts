// src/lib/games/stonks/data/index.ts
export * from './assets';
export * from './market';
export * from './inflation';
export * from './life-events';

/**
 * Both are expressed in euros of the WINDOW'S START YEAR; the engine inflates
 * them each semester. That way every window opens with the same 5.000 € on
 * screen and the same purchasing power, whichever 25 years you were dealt.
 */
export const INITIAL_CASH = 5000;
export const INCOME_PER_SEMESTER = 3000;

export const ALLOCATION_STEP = 5;
export const ALLOCATION_MAX = 100;

/** What «El Mercat» buys: the world, not one country's stock market. */
export const INDEX_ASSET = 'mundial' as const;

export * from './news';
