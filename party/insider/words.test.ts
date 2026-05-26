import { describe, it, expect } from 'vitest';
import { WORDS } from './words';

describe('insider words', () => {
  it('has at least 50 terms', () => {
    expect(WORDS.length).toBeGreaterThanOrEqual(50);
  });

  it('all terms are non-empty strings with no surrounding whitespace', () => {
    for (const w of WORDS) {
      expect(typeof w).toBe('string');
      expect(w.length).toBeGreaterThan(0);
      expect(w.trim()).toBe(w);
    }
  });

  it('has no duplicates', () => {
    expect(new Set(WORDS).size).toBe(WORDS.length);
  });
});
