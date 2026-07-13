import { describe, it, expect } from 'vitest';
import { pickLocalizedEntry } from './content-locale';

const es = { id: 'debates/fam/01-x', data: { t: 'ES' } };
const ca = { id: 'debates/fam/01-x.ca', data: { t: 'CA' } };
const caById = new Map([[ca.id, ca]]);

describe('pickLocalizedEntry', () => {
  it('returns the ES entry under es locale', () => {
    expect(pickLocalizedEntry(es, caById, 'es')).toBe(es);
  });
  it('returns the CA sibling under ca when present', () => {
    expect(pickLocalizedEntry(es, caById, 'ca')).toBe(ca);
  });
  it('falls back to the ES entry under ca when the sibling is missing', () => {
    expect(pickLocalizedEntry(es, new Map(), 'ca')).toBe(es);
  });
});
