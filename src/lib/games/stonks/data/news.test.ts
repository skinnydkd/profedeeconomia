// src/lib/games/stonks/data/news.test.ts
import { describe, it, expect } from 'vitest';
import { NEWS, newsFor } from './news';
import { MARKET_FIRST_YEAR, MARKET_LAST_YEAR } from './market';

describe('semester news', () => {
  it('covers both halves of every year the market data spans', () => {
    expect(NEWS).toHaveLength((MARKET_LAST_YEAR - MARKET_FIRST_YEAR + 1) * 2);
    for (let y = MARKET_FIRST_YEAR; y <= MARKET_LAST_YEAR; y++) {
      for (const h of [0, 1] as const) {
        expect(NEWS.find((n) => n.year === y && n.half === h), `${y} H${h + 1}`).toBeDefined();
      }
    }
  });

  it('has no duplicate semester', () => {
    const keys = NEWS.map((n) => `${n.year}-${n.half}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('writes a real headline, not a placeholder', () => {
    for (const n of NEWS) {
      expect(n.text.length, `${n.year} H${n.half + 1}`).toBeGreaterThan(30);
      // Case-sensitive and word-bounded on purpose: /TODO/i would flag the
      // perfectly ordinary Spanish word in "todo el mundo".
      expect(n.text, `${n.year} H${n.half + 1}`).not.toMatch(/\b(TODO|TBD|FIXME)\b|Lorem ipsum/);
      expect(n.text.trim().endsWith('.'), `${n.year} H${n.half + 1} ends with a full stop`).toBe(true);
    }
  });

  it('never repeats the same headline in two semesters', () => {
    const texts = NEWS.map((n) => n.text);
    expect(new Set(texts).size).toBe(texts.length);
  });

  it('tells the two halves of 2008 apart', () => {
    expect(newsFor(2008, 0)).toMatch(/Bear Stearns/i);
    expect(newsFor(2008, 1)).toMatch(/Lehman/i);
  });

  it('puts the Nixon shock and the oil shock in the right halves', () => {
    expect(newsFor(1971, 1)).toMatch(/oro|Bretton/i);
    expect(newsFor(1973, 1)).toMatch(/OPEP|petróleo/i);
  });

  /**
   * The headline is information, not advice. A student must be able to be
   * wrong; a headline that tells them what to do removes the whole exercise.
   */
  it('never gives the player a recommendation', () => {
    for (const n of NEWS) {
      expect(n.text, `${n.year} H${n.half + 1}`)
        .not.toMatch(/buen momento|conviene (comprar|vender)|deberías|oportunidad de compra|no te pierdas/i);
    }
  });

  it('answers with an empty string outside the range instead of throwing', () => {
    expect(newsFor(1950, 0)).toBe('');
  });
});
