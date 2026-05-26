import { describe, it, expect } from 'vitest';
import { scoreFor } from './scoring';
import { SCORE_MAX, SCORE_MIN_ON_CORRECT, TIMER_QUESTION_S } from './constants';

describe('scoreFor', () => {
  it('returns 0 for incorrect answer (regardless of speed)', () => {
    expect(scoreFor(false, 0, TIMER_QUESTION_S)).toBe(0);
    expect(scoreFor(false, 5000, TIMER_QUESTION_S)).toBe(0);
    expect(scoreFor(false, 20000, TIMER_QUESTION_S)).toBe(0);
  });

  it('returns SCORE_MAX for instant correct (elapsedMs = 0)', () => {
    expect(scoreFor(true, 0, TIMER_QUESTION_S)).toBe(SCORE_MAX);
  });

  it('returns SCORE_MIN_ON_CORRECT for correct at timer end', () => {
    expect(scoreFor(true, TIMER_QUESTION_S * 1000, TIMER_QUESTION_S)).toBe(SCORE_MIN_ON_CORRECT);
  });

  it('returns midpoint score for correct at timer midpoint', () => {
    const mid = (SCORE_MAX + SCORE_MIN_ON_CORRECT) / 2; // 750
    expect(scoreFor(true, (TIMER_QUESTION_S * 1000) / 2, TIMER_QUESTION_S)).toBe(mid);
  });

  it('clamps elapsedMs > timer to timer end (returns SCORE_MIN_ON_CORRECT)', () => {
    expect(scoreFor(true, TIMER_QUESTION_S * 1000 * 2, TIMER_QUESTION_S)).toBe(SCORE_MIN_ON_CORRECT);
  });

  it('rounds to nearest integer', () => {
    expect(scoreFor(true, 1, TIMER_QUESTION_S)).toBe(SCORE_MAX);
    const result = scoreFor(true, 3333, TIMER_QUESTION_S);
    expect(Number.isInteger(result)).toBe(true);
    expect(result).toBeGreaterThan(900);
    expect(result).toBeLessThan(925);
  });
});
