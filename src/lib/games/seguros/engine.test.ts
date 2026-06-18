import { describe, it, expect } from 'vitest';
import { INSURANCES, INSURANCE_KEYS, EVENT_DECK, DEFAULT_CONFIG } from './data';
import {
  createInitialState, setCoverage, lockCoverage, premiumsFor, drawCard, revealEvent,
  nextRound, ranking, debriefStats, isFinished,
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

describe('lockCoverage', () => {
  it('adds income and subtracts the premiums of covered insurances, then moves to event phase', () => {
    let s = createInitialState(DEFAULT_CONFIG);     // cash 1000, income 350
    s = setCoverage(s, 0, 'hogar');                  // hogar prima 80
    s = setCoverage(s, 0, 'salud');                  // salud prima 60
    const locked = lockCoverage(s);
    expect(locked.phase).toBe('event');
    // team 0: 1000 + 350 - (80+60) = 1210
    expect(locked.teams[0].cash).toBe(1210);
    expect(locked.teams[0].totalPremiums).toBe(140);
    // team 1 (no coverage): 1000 + 350 = 1350
    expect(locked.teams[1].cash).toBe(1350);
    expect(locked.teams[1].totalPremiums).toBe(0);
  });

  it('premiumsFor sums the primas of covered insurances', () => {
    const s = setCoverage(setCoverage(createInitialState(DEFAULT_CONFIG), 0, 'movil'), 0, 'rc');
    expect(premiumsFor(s.teams[0])).toBe(30 + 90);
  });
});

describe('drawCard', () => {
  it('selects a card by weight using rng in [0,1)', () => {
    // rng=0 -> first card ('calma', peso 30)
    expect(drawCard(EVENT_DECK, () => 0).key).toBe('calma');
    // rng just below 1 -> last card ('rc')
    expect(drawCard(EVENT_DECK, () => 0.999999).key).toBe('rc');
  });
});

describe('revealEvent', () => {
  it('charges the damage to uncovered teams and records avoided for covered teams', () => {
    let s = createInitialState(DEFAULT_CONFIG);
    s = setCoverage(s, 0, 'hogar');     // team 0 covered for hogar
    s = lockCoverage(s);                // phase 'event'
    // Force the 'hogar' card (dano 600). Its cumulative weight window: after calma(30)+movil(16)+coche(16)+salud(16)=78 .. 92.
    // total weight 100, so rng must land in [78,92): rng = 0.80.
    const resolved = revealEvent(s, () => 0.80);
    expect(resolved.phase).toBe('resolved');
    expect(resolved.currentEvent?.key).toBe('hogar');
    // team 0 covered: cash unchanged from locked, avoided += 600
    expect(resolved.teams[0].cash).toBe(s.teams[0].cash);
    expect(resolved.teams[0].totalAvoided).toBe(600);
    expect(resolved.teams[0].totalDamages).toBe(0);
    // team 1 uncovered: pays 600
    expect(resolved.teams[1].cash).toBe(s.teams[1].cash - 600);
    expect(resolved.teams[1].totalDamages).toBe(600);
  });

  it('on calma nobody pays', () => {
    const s = lockCoverage(createInitialState(DEFAULT_CONFIG));
    const resolved = revealEvent(s, () => 0); // calma
    expect(resolved.currentEvent?.key).toBe('calma');
    for (const t of resolved.teams) {
      expect(t.totalDamages).toBe(0);
      expect(t.totalAvoided).toBe(0);
    }
  });
});

describe('nextRound', () => {
  it('advances to next round in coverage phase, keeping coverage, clearing event', () => {
    let s = createInitialState(DEFAULT_CONFIG);
    s = setCoverage(s, 0, 'hogar');
    s = lockCoverage(s);
    s = revealEvent(s, () => 0); // calma -> phase 'resolved'
    const next = nextRound(s);
    expect(next.round).toBe(2);
    expect(next.phase).toBe('coverage');
    expect(next.currentEvent).toBeNull();
    expect(next.teams[0].coverage.hogar).toBe(true); // coverage carries over
  });

  it('goes to debrief after the last round', () => {
    let s = createInitialState({ ...DEFAULT_CONFIG, rounds: 1 });
    s = lockCoverage(s);
    s = revealEvent(s, () => 0);
    const next = nextRound(s);
    expect(next.phase).toBe('debrief');
    expect(isFinished(next)).toBe(true);
  });
});

describe('ranking', () => {
  it('sorts teams by cash descending', () => {
    const s = createInitialState(DEFAULT_CONFIG);
    s.teams[0].cash = 500;
    s.teams[1].cash = 900;
    s.teams[2].cash = 700;
    // team 3 keeps DEFAULT_CONFIG.startingCash (1000), so rank is: 3(1000) > 1(900) > 2(700) > 0(500)
    expect(ranking(s).map((t) => t.id)).toEqual([3, 1, 2, 0]);
  });
});

describe('debriefStats', () => {
  it('reports premiums, damages and avoided per team plus net insurance result', () => {
    const s = createInitialState(DEFAULT_CONFIG);
    s.teams[0] = { ...s.teams[0], totalPremiums: 300, totalDamages: 0, totalAvoided: 600 };
    const stats = debriefStats(s);
    const t0 = stats.find((x) => x.id === 0)!;
    expect(t0.premiums).toBe(300);
    expect(t0.damages).toBe(0);
    expect(t0.avoided).toBe(600);
    // net = avoided - premiums (positive means insurance "paid off")
    expect(t0.net).toBe(300);
  });
});
