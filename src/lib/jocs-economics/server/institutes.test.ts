import { describe, it, expect } from 'vitest';
import { normalizeInstitute, cleanDisplayName, isValidInstituteKey, MIN_INSTITUTE_KEY_LENGTH } from './institutes';

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

describe('cleanDisplayName', () => {
  it('removes bidi controls that reorder what the ranking shows', () => {
    // U+202E RIGHT-TO-LEFT OVERRIDE would print "IES Vives" backwards to everyone after it.
    expect(cleanDisplayName('IES ‮sevIV‬')).toBe('IES sevIV');
    expect(cleanDisplayName('⁧Pau⁩ ‏')).toBe('Pau');
  });

  it('removes control and zero-width characters', () => {
    expect(cleanDisplayName('Pa\u0000u\u0007')).toBe('Pau');
    expect(cleanDisplayName('Ma​ria﻿')).toBe('Maria');
  });

  it('turns line breaks and tabs into single spaces and trims', () => {
    expect(cleanDisplayName('  IES\n\nLluís\tVives  ')).toBe('IES Lluís Vives');
  });

  it('keeps accents, apostrophes and ordinary punctuation', () => {
    expect(cleanDisplayName("I.E.S. L'Om — Picassent")).toBe("I.E.S. L'Om — Picassent");
    expect(cleanDisplayName('Núñez')).toBe('Núñez');
  });

  it('leaves nothing of a name made only of invisible characters', () => {
    expect(cleanDisplayName('​‮⁦')).toBe('');
  });
});

describe('isValidInstituteKey', () => {
  it(`needs at least ${MIN_INSTITUTE_KEY_LENGTH} letters or digits once normalized`, () => {
    expect(isValidInstituteKey(normalizeInstitute('IES Lluís Vives'))).toBe(true);
    expect(isValidInstituteKey(normalizeInstitute('IES'))).toBe(true);
  });

  it('rejects names that would share an empty or tiny key with unrelated centres', () => {
    expect(isValidInstituteKey(normalizeInstitute('学校'))).toBe(false);
    expect(isValidInstituteKey(normalizeInstitute('!!'))).toBe(false);
    expect(isValidInstituteKey(normalizeInstitute('I.E.'))).toBe(false);
  });
});
