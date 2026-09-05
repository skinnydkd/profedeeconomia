import { describe, it, expect } from 'vitest';
import {
  createInitialState, advanceSemester, availableAssets, netWorth, realNetWorth,
  finalize, currentYear, currentHalf,
  TOTAL_ROUNDS, FIRST_START_YEAR, LAST_START_YEAR,
} from './engine';
import type { GameState } from './types';

// Every window, played to the end. The per-unit tests pin each rule; this one
// pins that the rules survive 50 compounding rounds on all 31 windows without
// producing a number nobody can put on screen.

/** Deterministic RNG so a failure names a seed you can replay. */
function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

/** Spreads 100 % over the board, remainder onto the first asset. */
function spread(s: GameState): Record<string, number> {
  const board = availableAssets(s);
  const step = Math.floor(100 / board.length / 5) * 5;
  const alloc: Record<string, number> = {};
  for (const a of board) alloc[a.id] = step;
  alloc[board[0].id] += 100 - step * board.length;
  return alloc;
}

function play(startSeed: number, pick: (s: GameState) => Record<string, number>) {
  const r = rng(startSeed);
  let s = createInitialState(r);
  for (let i = 0; i < TOTAL_ROUNDS; i++) {
    s = { ...s, allocation: { ...s.allocation, ...pick(s) } };
    s = advanceSemester(s, r);
  }
  return s;
}

describe('a full 25-year run', () => {
  const windows = Array.from(
    { length: LAST_START_YEAR - FIRST_START_YEAR + 1 },
    (_, i) => FIRST_START_YEAR + i,
  );

  it('covers every start year the draw can produce', () => {
    expect(windows).toHaveLength(31);
    const drawn = new Set(
      Array.from({ length: 4000 }, (_, i) => createInitialState(rng(i)).startYear),
    );
    expect([...drawn].sort((a, b) => a - b)).toEqual(windows);
  });

  it('reaches the end with finite, non-negative money on every seed', () => {
    for (let seed = 1; seed <= 120; seed++) {
      const s = play(seed, spread);
      const where = `seed ${seed} (${s.startYear})`;

      expect(s.round, where).toBe(TOTAL_ROUNDS);
      // The engine stops at the reveal; 'finished' is the UI's next click.
      expect(s.phase, where).toBe('reveal');
      expect(s.history, where).toHaveLength(TOTAL_ROUNDS);

      for (const v of [netWorth(s), realNetWorth(s), s.ai.value]) {
        expect(Number.isFinite(v), where).toBe(true);
        expect(v, where).toBeGreaterThanOrEqual(0);
      }
      const { player, ai } = finalize(s);
      expect(Number.isFinite(player) && Number.isFinite(ai), where).toBe(true);
      expect(player, where).toBeGreaterThanOrEqual(0);

      for (const p of s.history) {
        expect(Number.isFinite(p.nominal) && Number.isFinite(p.real) && Number.isFinite(p.ai), where)
          .toBe(true);
      }
    }
  });

  it('walks the calendar forward one semester at a time, without leaving the window', () => {
    const r = rng(7);
    let s = createInitialState(r);
    const start = s.startYear;
    const seen: string[] = [];
    for (let i = 0; i < TOTAL_ROUNDS; i++) {
      seen.push(`${currentYear(s)}-${currentHalf(s)}`);
      s = { ...s, allocation: { ...s.allocation, ...spread(s) } };
      s = advanceSemester(s, r);
    }
    expect(seen[0]).toBe(`${start}-0`);
    expect(seen.at(-1)).toBe(`${start + 24}-1`);
    expect(new Set(seen).size).toBe(TOTAL_ROUNDS);
  });

  it('never lets a dead company keep a value on the board', () => {
    for (let seed = 1; seed <= 120; seed++) {
      const s = play(seed, spread);
      for (const dead of s.deaths) {
        expect(s.holdings[dead]?.value ?? 0, `seed ${seed}, ${dead}`).toBe(0);
        expect(availableAssets(s).map((a) => a.id), `seed ${seed}`).not.toContain(dead);
      }
    }
  });

  it('sitting in cash for 25 years loses purchasing power', () => {
    // The whole point of showing the real column: doing nothing is not neutral.
    const s = play(3, () => ({ efectivo: 100 }));
    expect(realNetWorth(s)).toBeLessThan(netWorth(s));
  });
});
