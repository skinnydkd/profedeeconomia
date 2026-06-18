import { describe, it, expect } from 'vitest';
import { MOTIFS, FALLBACK_MOTIF, MOTIF_SLUGS, getMotif } from './caratula-motifs';

describe('caratula motif registry', () => {
  const expected = ['stonks', 'econrisk', 'econopoly', 'cajut', 'seguros', 'insider'];

  it('has a bespoke motif for each of the 6 current games', () => {
    for (const slug of expected) {
      expect(MOTIF_SLUGS.has(slug)).toBe(true);
      expect(MOTIFS[slug]).toBeTruthy();
    }
    expect(MOTIF_SLUGS.size).toBe(expected.length);
  });

  it('getMotif returns the bespoke markup for a known slug', () => {
    expect(getMotif('stonks')).toBe(MOTIFS.stonks);
    expect(getMotif('stonks').length).toBeGreaterThan(0);
  });

  it('getMotif falls back for an unknown slug', () => {
    expect(getMotif('does-not-exist')).toBe(FALLBACK_MOTIF);
    expect(FALLBACK_MOTIF.length).toBeGreaterThan(0);
  });

  it('every motif draws in cream (#FBF6EC), never raw black', () => {
    for (const markup of [...Object.values(MOTIFS), FALLBACK_MOTIF]) {
      expect(markup).toContain('#FBF6EC');
      expect(markup).not.toContain('#000');
    }
  });
});

import { JUEGOS } from '../../lib/juegos';

describe('every game is ready for a carátula', () => {
  for (const j of JUEGOS) {
    it(`${j.slug} has an identity colour`, () => {
      expect(typeof j.color).toBe('string');
      expect(j.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it(`${j.slug} has a bespoke motif (not the fallback)`, () => {
      expect(MOTIF_SLUGS.has(j.slug)).toBe(true);
      expect(getMotif(j.slug).length).toBeGreaterThan(0);
    });
  }
});
