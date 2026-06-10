import { describe, it, expect } from 'vitest';
import { shuffle, shuffleNoIdentidad } from './shuffle-utils';

describe('shuffle', () => {
  it('returns an array of the same length', () => {
    expect(shuffle([1, 2, 3, 4]).length).toBe(4);
  });

  it('returns a new array (does not mutate the original)', () => {
    const arr = [1, 2, 3];
    const result = shuffle(arr);
    expect(result).not.toBe(arr);
  });

  it('contains the same elements', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = shuffle(arr);
    expect(result.sort()).toEqual([...arr].sort());
  });
});

describe('shuffleNoIdentidad', () => {
  it('never returns the original order for [0, 1, 2, 3] across 200 runs', () => {
    const original = [0, 1, 2, 3];
    for (let i = 0; i < 200; i++) {
      const result = shuffleNoIdentidad(original);
      const isIdentical = result.every((v, idx) => v === original[idx]);
      expect(isIdentical).toBe(false);
    }
  });

  it('returns a copy for single-element arrays', () => {
    const arr = [42];
    const result = shuffleNoIdentidad(arr);
    expect(result).toEqual([42]);
    expect(result).not.toBe(arr);
  });

  it('returns a copy for empty arrays', () => {
    const result = shuffleNoIdentidad<number>([]);
    expect(result).toEqual([]);
  });

  it('returns an array with the same elements', () => {
    const arr = ['a', 'b', 'c', 'd'];
    const result = shuffleNoIdentidad(arr);
    expect(result.sort()).toEqual([...arr].sort());
    expect(result.length).toBe(arr.length);
  });

  it('bails gracefully when all elements are identical (cannot avoid identity)', () => {
    // All elements equal: every permutation is "identical", so after 20 tries
    // the function returns whatever shuffle produced — no infinite loop.
    const arr = [7, 7, 7, 7];
    expect(() => shuffleNoIdentidad(arr)).not.toThrow();
    const result = shuffleNoIdentidad(arr);
    expect(result.length).toBe(4);
    result.forEach((v) => expect(v).toBe(7));
  });
});
