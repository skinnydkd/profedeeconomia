import { describe, it, expect } from 'vitest';
import { formatEUR, formatPercent, formatNumber, clamp, parseESNumber } from './format';

// NBSP is the locale group/currency separator Intl emits; normalise for assertions.
const norm = (s: string) => s.replace(/ /g, ' ');

describe('formatEUR', () => {
  it('formats with two decimals and euro sign', () => {
    expect(norm(formatEUR(1234.5))).toBe('1.234,50 €');
  });
  it('handles zero', () => {
    expect(norm(formatEUR(0))).toBe('0,00 €');
  });
  it('returns em dash for non-finite', () => {
    expect(formatEUR(Infinity)).toBe('—');
    expect(formatEUR(NaN)).toBe('—');
  });
});

describe('formatPercent', () => {
  it('scales a ratio to a percent', () => {
    expect(norm(formatPercent(0.155))).toBe('15,5 %');
  });
  it('respects scaled=false for already-scaled values', () => {
    expect(norm(formatPercent(15.5, 1, false))).toBe('15,5 %');
  });
});

describe('formatNumber', () => {
  it('groups thousands with es-ES separators', () => {
    expect(formatNumber(1234.5)).toBe('1.234,5');
  });
});

describe('clamp', () => {
  it('bounds within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-3, 0, 10)).toBe(0);
    expect(clamp(99, 0, 10)).toBe(10);
  });
});

describe('parseESNumber', () => {
  it('parses es-ES formatted strings', () => {
    expect(parseESNumber('1.234,5')).toBe(1234.5);
    expect(parseESNumber('0,5')).toBe(0.5);
    expect(parseESNumber('42')).toBe(42);
  });
  it('returns NaN for empty or invalid', () => {
    expect(parseESNumber('')).toBeNaN();
    expect(parseESNumber('abc')).toBeNaN();
  });
});
