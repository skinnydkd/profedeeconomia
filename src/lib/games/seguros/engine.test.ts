import { describe, it, expect } from 'vitest';
import { INSURANCES, INSURANCE_KEYS, EVENT_DECK, DEFAULT_CONFIG } from './data';
import {
  createInitialState, setCoverage,
} from './engine';

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

describe('createInitialState', () => {
  it('creates N teams at round 1, coverage phase, full starting cash, no coverage', () => {
    const s = createInitialState(DEFAULT_CONFIG);
    expect(s.teams).toHaveLength(4);
    expect(s.round).toBe(1);
    expect(s.phase).toBe('coverage');
    expect(s.currentEvent).toBeNull();
    expect(s.teams[0].cash).toBe(1000);
    expect(s.teams[0].name).toBe('Equipo A');
    expect(Object.values(s.teams[0].coverage).every((v) => v === false)).toBe(true);
    expect(s.teams[0].totalPremiums).toBe(0);
  });
});

describe('setCoverage', () => {
  it('toggles a team coverage flag during coverage phase', () => {
    const s = createInitialState(DEFAULT_CONFIG);
    const s2 = setCoverage(s, 0, 'hogar');
    expect(s2.teams[0].coverage.hogar).toBe(true);
    expect(s2.teams[1].coverage.hogar).toBe(false); // other teams untouched
    const s3 = setCoverage(s2, 0, 'hogar');
    expect(s3.teams[0].coverage.hogar).toBe(false); // toggles back
  });

  it('is a no-op outside coverage phase', () => {
    const s = { ...createInitialState(DEFAULT_CONFIG), phase: 'event' as const };
    expect(setCoverage(s, 0, 'hogar')).toBe(s);
  });
});
