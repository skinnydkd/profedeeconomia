import { describe, it, expect } from 'vitest';
import { INSURANCES, INSURANCE_KEYS, EVENT_DECK } from './data';

describe('data', () => {
  it('event deck weights sum to 100', () => {
    expect(EVENT_DECK.reduce((s, c) => s + c.peso, 0)).toBe(100);
  });

  it('every damaging event maps to a defined insurance key', () => {
    const keys = new Set<string>(INSURANCE_KEYS);
    for (const card of EVENT_DECK) {
      if (card.dano > 0) {
        expect(card.cubre).not.toBeNull();
        expect(keys.has(card.cubre as string)).toBe(true);
      } else {
        expect(card.cubre).toBeNull();
      }
    }
  });

  it('each insurance has a positive premium', () => {
    for (const ins of INSURANCES) expect(ins.prima).toBeGreaterThan(0);
  });
});
