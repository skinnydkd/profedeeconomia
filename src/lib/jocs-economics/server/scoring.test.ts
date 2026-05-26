import { describe, it, expect } from 'vitest';
import { scoreFor } from './scoring';

describe('scoreFor', () => {
  it('returns 100 at difficulty 1.0', () => {
    expect(scoreFor(1.0)).toBe(100);
  });

  it('returns 1000 at difficulty 10.0', () => {
    expect(scoreFor(10.0)).toBe(1000);
  });

  it('returns 500 at difficulty 5.0', () => {
    expect(scoreFor(5.0)).toBe(500);
  });

  it('rounds to nearest integer', () => {
    expect(scoreFor(1.234)).toBe(123);
    expect(scoreFor(5.678)).toBe(568);
    expect(Number.isInteger(scoreFor(3.333))).toBe(true);
  });
});
