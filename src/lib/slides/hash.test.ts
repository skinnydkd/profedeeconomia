import { describe, expect, it } from 'vitest';
import { slideIndexFromHash } from './hash';

describe('slideIndexFromHash', () => {
  it('reads 1-based hashes', () => {
    expect(slideIndexFromHash('#5', 31)).toBe(4);
    expect(slideIndexFromHash('1', 31)).toBe(0);
  });
  it('clamps to range', () => {
    expect(slideIndexFromHash('#99', 31)).toBe(30);
    expect(slideIndexFromHash('#0', 31)).toBe(0);
  });
  it('ignores garbage', () => {
    expect(slideIndexFromHash('', 31)).toBe(0);
    expect(slideIndexFromHash('#abc', 31)).toBe(0);
    expect(slideIndexFromHash('#-3', 31)).toBe(0);
    expect(slideIndexFromHash('#5x', 31)).toBe(0);
  });
});
