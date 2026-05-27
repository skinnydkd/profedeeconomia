import { describe, it, expect } from 'vitest';
import { compareScores, rankOf, type ScoreEntry } from './ranking';

const e = (score: number, q: number, t: number): ScoreEntry => ({
  score,
  questionsAnswered: q,
  timeTotalMs: t,
});

describe('compareScores', () => {
  it('orders by score DESC primarily', () => {
    expect(compareScores(e(100, 5, 1000), e(200, 5, 1000))).toBeGreaterThan(0);
    expect(compareScores(e(200, 5, 1000), e(100, 5, 1000))).toBeLessThan(0);
  });

  it('breaks ties on score with questionsAnswered DESC', () => {
    expect(compareScores(e(100, 5, 1000), e(100, 10, 1000))).toBeGreaterThan(0);
    expect(compareScores(e(100, 10, 1000), e(100, 5, 1000))).toBeLessThan(0);
  });

  it('breaks tie on score+questions with timeTotalMs ASC (less time wins)', () => {
    expect(compareScores(e(100, 5, 2000), e(100, 5, 1000))).toBeGreaterThan(0);
    expect(compareScores(e(100, 5, 1000), e(100, 5, 2000))).toBeLessThan(0);
  });

  it('returns 0 when all three are identical', () => {
    expect(compareScores(e(100, 5, 1000), e(100, 5, 1000))).toBe(0);
  });
});

describe('rankOf', () => {
  it('returns 1-indexed rank within a sorted list', () => {
    const sorted = [e(1000, 30, 1000), e(800, 20, 1000), e(500, 10, 1000)];
    expect(rankOf(sorted, e(1000, 30, 1000))).toBe(1);
    expect(rankOf(sorted, e(800, 20, 1000))).toBe(2);
    expect(rankOf(sorted, e(500, 10, 1000))).toBe(3);
  });

  it('returns null when entry not found', () => {
    const sorted = [e(1000, 30, 1000), e(800, 20, 1000)];
    expect(rankOf(sorted, e(999, 99, 9999))).toBeNull();
  });
});
