import { describe, it, expect } from 'vitest';
import { normalizeInstitute } from './institutes';

describe('normalizeInstitute', () => {
  it('lowercases', () => {
    expect(normalizeInstitute('IES Lluís Vives')).toBe('iesluisvives');
  });

  it('strips accents (NFD normalize)', () => {
    expect(normalizeInstitute('Lluís')).toBe('luis');
    expect(normalizeInstitute('Camí Vell')).toBe('camivell');
    expect(normalizeInstitute('Català')).toBe('catala');
    expect(normalizeInstitute('Núñez')).toBe('nunez');
  });

  it('strips punctuation and whitespace', () => {
    expect(normalizeInstitute('I.E.S. Lluís Vives')).toBe('iesluisvives');
    expect(normalizeInstitute('  I.E.S.  Lluís   Vives  ')).toBe('iesluisvives');
    expect(normalizeInstitute('IES-Vives')).toBe('iesvives');
  });

  it('matches the 4 spellings of "IES Lluís Vives" to the same norm', () => {
    const variants = [
      'IES Lluís Vives',
      'ies lluis vives',
      'I.E.S. Lluís Vives',
      'I.E.S Lluis  Vives',
    ];
    const norms = variants.map(normalizeInstitute);
    expect(new Set(norms).size).toBe(1);
  });

  it('handles empty/whitespace-only input as empty string', () => {
    expect(normalizeInstitute('')).toBe('');
    expect(normalizeInstitute('   ')).toBe('');
    expect(normalizeInstitute('...')).toBe('');
  });
});
