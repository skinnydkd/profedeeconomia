import { describe, it, expect } from 'vitest';
import {
  nextDifficulty,
  DIFFICULTY_MIN,
  DIFFICULTY_MAX,
  DIFFICULTY_STEP_CORRECT,
  DIFFICULTY_STEP_INCORRECT,
} from './difficulty';

describe('nextDifficulty', () => {
  it('starts at 1.0', () => {
    expect(DIFFICULTY_MIN).toBe(1.0);
  });

  it('caps at 10.0', () => {
    expect(DIFFICULTY_MAX).toBe(10.0);
  });

  it('increments by +0.2 on correct answer', () => {
    expect(nextDifficulty(1.0, true)).toBeCloseTo(1.2, 5);
    expect(nextDifficulty(5.0, true)).toBeCloseTo(5.2, 5);
  });

  it('stays at current value on incorrect answer', () => {
    expect(nextDifficulty(1.0, false)).toBe(1.0);
    expect(nextDifficulty(5.5, false)).toBe(5.5);
  });

  it('clamps to DIFFICULTY_MAX when correct at top', () => {
    expect(nextDifficulty(9.9, true)).toBe(10.0);
    expect(nextDifficulty(10.0, true)).toBe(10.0);
  });

  it('clamps to DIFFICULTY_MIN when below 1.0 (defensive)', () => {
    // Si current < MIN, sempre retorna MIN o mes
    expect(nextDifficulty(0.5, false)).toBe(1.0);
  });
});
