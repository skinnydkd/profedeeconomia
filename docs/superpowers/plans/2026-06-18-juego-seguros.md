# Juego de seguros ("Asegurados") — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A teacher-projected, team-based classroom game where teams choose which insurances to pay each round, a shared random event hits the class, covered teams are safe and uncovered teams pay the damage, with a live scoreboard and a pedagogical debrief.

**Architecture:** Pure TypeScript engine in `src/lib/games/seguros/` (deterministic, RNG injectable, unit-tested with vitest including a Monte Carlo balance check) + a Preact island UI in `src/components/games/seguros/` rendered through the existing `GameShell.astro`. State persists to `localStorage` via the existing `makeGameStorage` helper. Registered in `src/lib/juegos.ts`.

**Tech Stack:** Astro 5, Preact (islands), TypeScript (strict), vitest, Variant C design tokens (CSS).

---

## File Structure

**Create:**
- `src/lib/games/seguros/types.ts` — `GameState`, `Team`, `InsuranceKey`, `EventCard`, `GameConfig`, `Phase`.
- `src/lib/games/seguros/data.ts` — `INSURANCES`, `EVENT_DECK`, `DEFAULT_CONFIG`, `INSURANCE_KEYS`.
- `src/lib/games/seguros/engine.ts` — pure functions: state transitions, event draw, ranking, debrief stats.
- `src/lib/games/seguros/engine.test.ts` — vitest suite incl. Monte Carlo balance.
- `src/components/games/seguros/SegurosGame.tsx` — root Preact island (state machine + persistence).
- `src/components/games/seguros/SetupScreen.tsx` — config form / resume.
- `src/components/games/seguros/CoverageScreen.tsx` — teams×insurances coverage grid.
- `src/components/games/seguros/EventScreen.tsx` — reveal + resolve + scoreboard.
- `src/components/games/seguros/Scoreboard.tsx` — live ranking (reused).
- `src/components/games/seguros/DebriefScreen.tsx` — end-game analysis.
- `src/components/games/seguros/seguros.css` — Variant C styling.
- `src/pages/juegos/seguros/index.astro` — route (GameShell + island).

**Modify:**
- `src/lib/juegos.ts` — add the `seguros` entry to the `JUEGOS` array.

---

## Task 1: Engine types + data

**Files:**
- Create: `src/lib/games/seguros/types.ts`
- Create: `src/lib/games/seguros/data.ts`
- Test: `src/lib/games/seguros/engine.test.ts` (data section)

- [ ] **Step 1: Write `types.ts`**

```ts
// src/lib/games/seguros/types.ts
export type InsuranceKey = 'movil' | 'coche' | 'hogar' | 'salud' | 'rc';

export interface Insurance {
  key: InsuranceKey;
  label: string;
  prima: number; // premium charged per round when covered
}

export interface EventCard {
  key: string;                 // unique id ('calma', 'movil', ...)
  label: string;               // shown when revealed
  cubre: InsuranceKey | null;  // which insurance protects against it; null = no event
  dano: number;                // damage paid if NOT covered (0 for 'calma')
  peso: number;                // deck weight (probability share)
}

export interface GameConfig {
  numTeams: number;
  teamNames: string[];
  rounds: number;
  startingCash: number;
  income: number; // added to every team at the start of each round
}

export interface Team {
  id: number;
  name: string;
  cash: number;
  coverage: Record<InsuranceKey, boolean>; // current coverage (carries over each round)
  totalPremiums: number; // cumulative premiums paid
  totalDamages: number;  // cumulative damages paid while uncovered
  totalAvoided: number;  // cumulative damages avoided while covered
}

export type Phase = 'coverage' | 'event' | 'resolved' | 'debrief';

export interface GameState {
  config: GameConfig;
  round: number;                  // 1-based
  phase: Phase;
  teams: Team[];
  currentEvent: EventCard | null; // the event drawn this round (set in 'resolved')
}
```

- [ ] **Step 2: Write `data.ts`**

```ts
// src/lib/games/seguros/data.ts
import type { Insurance, EventCard, GameConfig, InsuranceKey } from './types';

export const INSURANCES: Insurance[] = [
  { key: 'movil', label: 'Móvil',       prima: 30 },
  { key: 'coche', label: 'Coche/Moto',  prima: 70 },
  { key: 'hogar', label: 'Hogar',       prima: 80 },
  { key: 'salud', label: 'Salud',       prima: 60 },
  { key: 'rc',    label: 'Resp. civil', prima: 90 },
];

export const INSURANCE_KEYS: InsuranceKey[] = INSURANCES.map((i) => i.key);

// Deck weights sum to 100. Each round draws exactly one card.
// Premiums are calibrated so prima ≈ (peso/100) × dano (roughly fair).
export const EVENT_DECK: EventCard[] = [
  { key: 'calma', label: 'Todo tranquilo: no pasa nada', cubre: null,    dano: 0,    peso: 30 },
  { key: 'movil', label: 'Pantalla rota / robo del móvil', cubre: 'movil', dano: 200,  peso: 16 },
  { key: 'coche', label: 'Accidente de coche o moto',      cubre: 'coche', dano: 450,  peso: 16 },
  { key: 'salud', label: 'Gasto médico inesperado',        cubre: 'salud', dano: 400,  peso: 16 },
  { key: 'hogar', label: 'Incendio o inundación en casa',  cubre: 'hogar', dano: 600,  peso: 14 },
  { key: 'rc',    label: 'Te reclaman judicialmente',      cubre: 'rc',    dano: 1200, peso: 8  },
];

export const DEFAULT_CONFIG: GameConfig = {
  numTeams: 4,
  teamNames: ['Equipo A', 'Equipo B', 'Equipo C', 'Equipo D', 'Equipo E', 'Equipo F', 'Equipo G', 'Equipo H'],
  rounds: 10,
  startingCash: 1000,
  income: 350,
};
```

- [ ] **Step 3: Write the failing data test**

Append to `src/lib/games/seguros/engine.test.ts`:

```ts
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
```

- [ ] **Step 4: Run the data tests**

Run: `npx vitest run src/lib/games/seguros/engine.test.ts`
Expected: PASS (3 tests in `data`).

- [ ] **Step 5: Commit**

```bash
git add src/lib/games/seguros/types.ts src/lib/games/seguros/data.ts src/lib/games/seguros/engine.test.ts
git commit -m "feat(seguros): engine types and calibrated data"
```

---

## Task 2: createInitialState + setCoverage

**Files:**
- Create: `src/lib/games/seguros/engine.ts`
- Test: `src/lib/games/seguros/engine.test.ts`

- [ ] **Step 1: Write the failing test**

Append to `engine.test.ts`:

```ts
import {
  createInitialState, setCoverage,
} from './engine';
import { DEFAULT_CONFIG } from './data';

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
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/lib/games/seguros/engine.test.ts`
Expected: FAIL — `createInitialState` / `setCoverage` not exported.

- [ ] **Step 3: Write `engine.ts` (initial)**

```ts
// src/lib/games/seguros/engine.ts
import type { GameState, GameConfig, Team, InsuranceKey } from './types';
import { INSURANCES, INSURANCE_KEYS, EVENT_DECK, DEFAULT_CONFIG } from './data';

function emptyCoverage(): Record<InsuranceKey, boolean> {
  const c = {} as Record<InsuranceKey, boolean>;
  for (const k of INSURANCE_KEYS) c[k] = false;
  return c;
}

export function createInitialState(config: GameConfig = DEFAULT_CONFIG): GameState {
  const teams: Team[] = [];
  for (let i = 0; i < config.numTeams; i++) {
    teams.push({
      id: i,
      name: config.teamNames[i] ?? `Equipo ${i + 1}`,
      cash: config.startingCash,
      coverage: emptyCoverage(),
      totalPremiums: 0,
      totalDamages: 0,
      totalAvoided: 0,
    });
  }
  return { config, round: 1, phase: 'coverage', teams, currentEvent: null };
}

export function setCoverage(state: GameState, teamId: number, key: InsuranceKey): GameState {
  if (state.phase !== 'coverage') return state;
  const teams = state.teams.map((t) =>
    t.id === teamId ? { ...t, coverage: { ...t.coverage, [key]: !t.coverage[key] } } : t,
  );
  return { ...state, teams };
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run src/lib/games/seguros/engine.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/games/seguros/engine.ts src/lib/games/seguros/engine.test.ts
git commit -m "feat(seguros): createInitialState and setCoverage"
```

---

## Task 3: lockCoverage (income + premiums)

**Files:**
- Modify: `src/lib/games/seguros/engine.ts`
- Test: `src/lib/games/seguros/engine.test.ts`

- [ ] **Step 1: Write the failing test**

Append to `engine.test.ts`:

```ts
import { lockCoverage, premiumsFor } from './engine';

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
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/lib/games/seguros/engine.test.ts`
Expected: FAIL — `lockCoverage` / `premiumsFor` not exported.

- [ ] **Step 3: Add to `engine.ts`**

```ts
export function premiumsFor(team: Team): number {
  return INSURANCES.reduce((s, ins) => (team.coverage[ins.key] ? s + ins.prima : s), 0);
}

export function lockCoverage(state: GameState): GameState {
  if (state.phase !== 'coverage') return state;
  const teams = state.teams.map((t) => {
    const primas = premiumsFor(t);
    return {
      ...t,
      cash: t.cash + state.config.income - primas,
      totalPremiums: t.totalPremiums + primas,
    };
  });
  return { ...state, teams, phase: 'event' };
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run src/lib/games/seguros/engine.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/games/seguros/engine.ts src/lib/games/seguros/engine.test.ts
git commit -m "feat(seguros): lockCoverage charges income minus premiums"
```

---

## Task 4: revealEvent + drawCard

**Files:**
- Modify: `src/lib/games/seguros/engine.ts`
- Test: `src/lib/games/seguros/engine.test.ts`

- [ ] **Step 1: Write the failing test**

Append to `engine.test.ts`:

```ts
import { drawCard, revealEvent } from './engine';
import { EVENT_DECK } from './data';

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
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/lib/games/seguros/engine.test.ts`
Expected: FAIL — `drawCard` / `revealEvent` not exported.

- [ ] **Step 3: Add to `engine.ts`**

```ts
import type { EventCard } from './types';

export function drawCard(deck: EventCard[], rng: () => number): EventCard {
  const total = deck.reduce((s, c) => s + c.peso, 0);
  let r = rng() * total;
  for (const card of deck) {
    if (r < card.peso) return card;
    r -= card.peso;
  }
  return deck[deck.length - 1];
}

export function revealEvent(state: GameState, rng: () => number = Math.random): GameState {
  if (state.phase !== 'event') return state;
  const card = drawCard(EVENT_DECK, rng);
  const teams = state.teams.map((t) => {
    if (!card.cubre || card.dano === 0) return t; // calma
    if (t.coverage[card.cubre]) {
      return { ...t, totalAvoided: t.totalAvoided + card.dano };
    }
    return { ...t, cash: t.cash - card.dano, totalDamages: t.totalDamages + card.dano };
  });
  return { ...state, teams, currentEvent: card, phase: 'resolved' };
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run src/lib/games/seguros/engine.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/games/seguros/engine.ts src/lib/games/seguros/engine.test.ts
git commit -m "feat(seguros): revealEvent resolves a weighted shared event"
```

---

## Task 5: nextRound + ranking + debriefStats

**Files:**
- Modify: `src/lib/games/seguros/engine.ts`
- Test: `src/lib/games/seguros/engine.test.ts`

- [ ] **Step 1: Write the failing test**

Append to `engine.test.ts`:

```ts
import { nextRound, ranking, debriefStats, isFinished } from './engine';

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
    expect(ranking(s).map((t) => t.id)).toEqual([1, 2, 0, 3]);
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
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/lib/games/seguros/engine.test.ts`
Expected: FAIL — `nextRound`/`ranking`/`debriefStats`/`isFinished` not exported.

- [ ] **Step 3: Add to `engine.ts`**

```ts
export function nextRound(state: GameState): GameState {
  if (state.round >= state.config.rounds) {
    return { ...state, phase: 'debrief', currentEvent: null };
  }
  return { ...state, round: state.round + 1, phase: 'coverage', currentEvent: null };
}

export function isFinished(state: GameState): boolean {
  return state.phase === 'debrief';
}

export function ranking(state: GameState): Team[] {
  return [...state.teams].sort((a, b) => b.cash - a.cash);
}

export interface DebriefRow {
  id: number;
  name: string;
  cash: number;
  premiums: number;
  damages: number;
  avoided: number;
  net: number; // avoided - premiums: >0 means coverage saved more than it cost
}

export function debriefStats(state: GameState): DebriefRow[] {
  return state.teams.map((t) => ({
    id: t.id,
    name: t.name,
    cash: t.cash,
    premiums: t.totalPremiums,
    damages: t.totalDamages,
    avoided: t.totalAvoided,
    net: t.totalAvoided - t.totalPremiums,
  }));
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run src/lib/games/seguros/engine.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/games/seguros/engine.ts src/lib/games/seguros/engine.test.ts
git commit -m "feat(seguros): nextRound, ranking and debrief stats"
```

---

## Task 6: Monte Carlo balance test

Validates the data calibration: an always-insured strategy should have much lower variance than a never-insured strategy, and their mean final cash should be in a comparable band (insurance ≈ fair). Uses a seeded PRNG for reproducibility.

**Files:**
- Test: `src/lib/games/seguros/engine.test.ts`

- [ ] **Step 1: Write the test**

Append to `engine.test.ts`:

```ts
import { INSURANCE_KEYS as KEYS } from './data';

// Deterministic PRNG (mulberry32) for reproducible Monte Carlo.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function playOneGame(insureAll: boolean, rng: () => number): number {
  let s = createInitialState({ ...DEFAULT_CONFIG, numTeams: 1, rounds: 10 });
  for (let r = 0; r < 10; r++) {
    if (insureAll) for (const k of KEYS) {
      if (!s.teams[0].coverage[k]) s = setCoverage(s, 0, k);
    }
    s = lockCoverage(s);
    s = revealEvent(s, rng);
    s = nextRound(s);
  }
  return s.teams[0].cash;
}

function stats(values: number[]) {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
  return { mean, sd: Math.sqrt(variance) };
}

describe('balance (Monte Carlo)', () => {
  it('insuring reduces variance dramatically and means stay in a comparable band', () => {
    const N = 4000;
    const rng = mulberry32(12345);
    const insured: number[] = [];
    const uninsured: number[] = [];
    for (let i = 0; i < N; i++) insured.push(playOneGame(true, rng));
    for (let i = 0; i < N; i++) uninsured.push(playOneGame(false, rng));
    const si = stats(insured);
    const su = stats(uninsured);
    // 1. Uninsured is far more volatile.
    expect(su.sd).toBeGreaterThan(si.sd * 3);
    // 2. Means are in a comparable band (insurance is roughly fair, within ~600€).
    expect(Math.abs(si.mean - su.mean)).toBeLessThan(600);
    // 3. Fully insured almost never goes broke; uninsured sometimes does.
    expect(insured.filter((c) => c < 0).length).toBe(0);
    expect(uninsured.filter((c) => c < 0).length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run the balance test**

Run: `npx vitest run src/lib/games/seguros/engine.test.ts`
Expected: PASS. If it fails on the mean-band or broke-count assertions, the data in `data.ts` is mis-calibrated — adjust premiums/weights/damages there (not the test) until it passes, then re-run. Document any change in the commit message.

- [ ] **Step 3: Run the full engine suite**

Run: `npx vitest run src/lib/games/seguros/engine.test.ts`
Expected: PASS (all describes).

- [ ] **Step 4: Commit**

```bash
git add src/lib/games/seguros/engine.test.ts src/lib/games/seguros/data.ts
git commit -m "test(seguros): Monte Carlo balance check for the data calibration"
```

---

## Task 7: CSS + route + root island + SetupScreen

UI components have no unit tests in this project (engine is the tested core). Verify by build + manual run.

**Files:**
- Create: `src/components/games/seguros/seguros.css`
- Create: `src/components/games/seguros/SegurosGame.tsx`
- Create: `src/components/games/seguros/SetupScreen.tsx`
- Create: `src/pages/juegos/seguros/index.astro`

- [ ] **Step 1: Write `seguros.css`**

```css
/* src/components/games/seguros/seguros.css */
.sg { max-width: 1100px; margin: 0 auto; font-family: var(--font-sans); color: var(--color-ink); }
.sg h1, .sg h2 { font-family: var(--font-serif); font-weight: 500; }
.sg__kicker { font-family: var(--font-sans); font-size: 0.8rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-terra); }
.sg__round { font-family: var(--font-mono); color: var(--color-ink-mute); }
.sg-btn { font-family: var(--font-sans); font-weight: 600; border-radius: 6px; padding: 0.6rem 1.1rem; cursor: pointer; border: 1px solid var(--color-terra); background: var(--color-terra); color: #fff; }
.sg-btn:hover { background: var(--color-terra-deep); border-color: var(--color-terra-deep); }
.sg-btn--ghost { background: transparent; color: var(--color-ink-soft); border-color: var(--color-line); }
.sg-btn--ghost:hover { color: var(--color-terra); border-color: var(--color-terra); }
.sg-field { display: flex; flex-direction: column; gap: 0.3rem; margin-bottom: 1rem; }
.sg-field label { font-size: 0.85rem; color: var(--color-ink-mute); font-weight: 600; }
.sg-field input { font-family: var(--font-sans); font-size: 1rem; padding: 0.5rem 0.7rem; border: 1px solid var(--color-line); border-radius: 6px; background: var(--color-paper); }

/* Coverage grid */
.sg-grid { width: 100%; border-collapse: collapse; }
.sg-grid th, .sg-grid td { padding: 0.5rem 0.6rem; border-bottom: 1px solid var(--color-line-soft); text-align: center; }
.sg-grid th:first-child, .sg-grid td:first-child { text-align: left; font-weight: 600; }
.sg-grid thead th { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-ink-mute); }
.sg-grid .prima { font-family: var(--font-mono); font-size: 0.72rem; color: var(--color-ink-mute); display: block; }
.sg-cell { width: 2rem; height: 2rem; border-radius: 6px; border: 1.5px solid var(--color-line); background: var(--color-paper); cursor: pointer; }
.sg-cell[aria-pressed="true"] { background: var(--color-teal, #1F6E6E); border-color: var(--color-teal, #1F6E6E); color: #fff; }

/* Scoreboard */
.sg-score { list-style: none; padding: 0; margin: 1rem 0; }
.sg-score li { display: flex; align-items: baseline; gap: 0.8rem; padding: 0.5rem 0.7rem; border-bottom: 1px solid var(--color-line-soft); }
.sg-score .pos { font-family: var(--font-mono); color: var(--color-ink-mute); width: 1.5rem; }
.sg-score .name { font-weight: 600; flex: 1; }
.sg-score .cash { font-family: var(--font-sans); font-weight: 700; color: var(--color-terra); }
.sg-score .cov { font-size: 0.72rem; color: var(--color-ink-mute); }

/* Event card */
.sg-event { background: var(--color-paper); border: 1px solid var(--color-line); border-left: 4px solid var(--color-terra); border-radius: 8px; padding: 1.4rem 1.6rem; margin: 1rem 0; }
.sg-event h2 { margin: 0.2rem 0; }
.sg-event .dano { font-family: var(--font-mono); color: var(--color-terra-deep); }
.sg-outcome--safe { color: var(--color-teal, #1F6E6E); }
.sg-outcome--hit { color: var(--color-terra); }
```

- [ ] **Step 2: Write `SetupScreen.tsx`**

```tsx
/** @jsxImportSource preact */
import { useState } from 'preact/hooks';
import type { GameConfig } from '@/lib/games/seguros/types';
import { DEFAULT_CONFIG } from '@/lib/games/seguros/data';

interface Props {
  hasSave: boolean;
  onStart: (config: GameConfig) => void;
  onResume: () => void;
}

export default function SetupScreen({ hasSave, onStart, onResume }: Props) {
  const [numTeams, setNumTeams] = useState(DEFAULT_CONFIG.numTeams);
  const [rounds, setRounds] = useState(DEFAULT_CONFIG.rounds);
  const [startingCash, setStartingCash] = useState(DEFAULT_CONFIG.startingCash);
  const [income, setIncome] = useState(DEFAULT_CONFIG.income);

  const start = () => {
    const n = Math.max(2, Math.min(8, numTeams));
    onStart({
      ...DEFAULT_CONFIG,
      numTeams: n,
      teamNames: DEFAULT_CONFIG.teamNames.slice(0, n),
      rounds: Math.max(1, rounds),
      startingCash: Math.max(0, startingCash),
      income: Math.max(0, income),
    });
  };

  return (
    <div class="sg">
      <span class="sg__kicker">Juego de clase · proyector</span>
      <h1>Asegurados</h1>
      <p>Cada equipo decide qué seguros paga cada ronda. Cuando ocurre un imprevisto, quien
        está cubierto no paga nada; quien no, paga el daño. Gana quien acabe con más dinero…
        si la suerte acompaña.</p>

      {hasSave && (
        <p><button class="sg-btn sg-btn--ghost" onClick={onResume}>Reanudar partida guardada</button></p>
      )}

      <div class="sg-field">
        <label>Número de equipos (2–8)</label>
        <input type="number" min={2} max={8} value={numTeams}
          onInput={(e) => setNumTeams(parseInt((e.target as HTMLInputElement).value || '4', 10))} />
      </div>
      <div class="sg-field">
        <label>Rondas</label>
        <input type="number" min={1} value={rounds}
          onInput={(e) => setRounds(parseInt((e.target as HTMLInputElement).value || '10', 10))} />
      </div>
      <div class="sg-field">
        <label>Saldo inicial (€)</label>
        <input type="number" min={0} value={startingCash}
          onInput={(e) => setStartingCash(parseInt((e.target as HTMLInputElement).value || '1000', 10))} />
      </div>
      <div class="sg-field">
        <label>Ingreso por ronda (€)</label>
        <input type="number" min={0} value={income}
          onInput={(e) => setIncome(parseInt((e.target as HTMLInputElement).value || '350', 10))} />
      </div>

      <button class="sg-btn" onClick={start}>Empezar partida</button>
    </div>
  );
}
```

- [ ] **Step 3: Write `SegurosGame.tsx` (root state machine)**

```tsx
/** @jsxImportSource preact */
import { useState, useEffect } from 'preact/hooks';
import type { GameState, GameConfig } from '@/lib/games/seguros/types';
import { createInitialState } from '@/lib/games/seguros/engine';
import { makeGameStorage } from '@/lib/games/storage';
import SetupScreen from './SetupScreen';
import CoverageScreen from './CoverageScreen';
import EventScreen from './EventScreen';
import DebriefScreen from './DebriefScreen';
import './seguros.css';

const store = makeGameStorage<GameState>('seguros');

export default function SegurosGame() {
  const [state, setState] = useState<GameState | null>(null);
  const [hasSave, setHasSave] = useState(false);

  useEffect(() => { setHasSave(!!store.load()); }, []);

  useEffect(() => {
    if (!state) return;
    if (state.phase === 'debrief') store.clear();
    else store.save(state);
  }, [state]);

  if (!state) {
    return (
      <SetupScreen
        hasSave={hasSave}
        onStart={(cfg: GameConfig) => setState(createInitialState(cfg))}
        onResume={() => { const s = store.load(); if (s) setState(s); }}
      />
    );
  }
  if (state.phase === 'coverage') return <CoverageScreen state={state} setState={setState} />;
  if (state.phase === 'event' || state.phase === 'resolved') return <EventScreen state={state} setState={setState} />;
  return <DebriefScreen state={state} onRestart={() => { store.clear(); setState(null); }} />;
}
```

- [ ] **Step 4: Write the route `index.astro`**

```astro
---
// src/pages/juegos/seguros/index.astro
import GameShell from '@components/games/GameShell.astro';
import SegurosGame from '@components/games/seguros/SegurosGame.tsx';
---
<GameShell title="Asegurados" slug="seguros">
  <SegurosGame client:load />
</GameShell>
```

- [ ] **Step 5: Verify it compiles (build will run in Task 11). For now, type-check:**

Run: `npx astro check 2>&1 | head -20`
Expected: no errors referencing `seguros` files. (CoverageScreen/EventScreen/DebriefScreen don't exist yet → there WILL be missing-import errors for those three; that's expected until Tasks 8–10. Confirm the only errors are those missing modules.)

- [ ] **Step 6: Commit**

```bash
git add src/components/games/seguros/seguros.css src/components/games/seguros/SetupScreen.tsx src/components/games/seguros/SegurosGame.tsx "src/pages/juegos/seguros/index.astro"
git commit -m "feat(seguros): route, root island, setup screen, styles"
```

---

## Task 8: CoverageScreen + Scoreboard

**Files:**
- Create: `src/components/games/seguros/Scoreboard.tsx`
- Create: `src/components/games/seguros/CoverageScreen.tsx`

- [ ] **Step 1: Write `Scoreboard.tsx`**

```tsx
/** @jsxImportSource preact */
import type { GameState } from '@/lib/games/seguros/types';
import { ranking } from '@/lib/games/seguros/engine';
import { INSURANCES } from '@/lib/games/seguros/data';

export default function Scoreboard({ state }: { state: GameState }) {
  const rows = ranking(state);
  return (
    <ol class="sg-score">
      {rows.map((t, i) => (
        <li>
          <span class="pos">{i + 1}.</span>
          <span class="name">{t.name}</span>
          <span class="cov">
            {INSURANCES.filter((ins) => t.coverage[ins.key]).map((ins) => ins.label).join(' · ') || 'sin seguros'}
          </span>
          <span class="cash">{t.cash} €</span>
        </li>
      ))}
    </ol>
  );
}
```

- [ ] **Step 2: Write `CoverageScreen.tsx`**

```tsx
/** @jsxImportSource preact */
import type { GameState } from '@/lib/games/seguros/types';
import type { StateUpdater } from 'preact/hooks';
import { INSURANCES } from '@/lib/games/seguros/data';
import { setCoverage, lockCoverage, premiumsFor } from '@/lib/games/seguros/engine';

interface Props {
  state: GameState;
  setState: StateUpdater<GameState | null>;
}

export default function CoverageScreen({ state, setState }: Props) {
  const toggle = (teamId: number, key: typeof INSURANCES[number]['key']) =>
    setState(setCoverage(state, teamId, key));

  return (
    <div class="sg">
      <span class="sg__kicker">Cobertura</span>
      <h1>Ronda {state.round} <span class="sg__round">de {state.config.rounds}</span></h1>
      <p>Cada equipo cobra <strong>{state.config.income} €</strong> esta ronda. Marca qué seguros
        contrata cada equipo (se mantiene lo de la ronda anterior). Al confirmar se cobran las primas.</p>

      <table class="sg-grid">
        <thead>
          <tr>
            <th>Equipo</th>
            {INSURANCES.map((ins) => (
              <th>{ins.label}<span class="prima">{ins.prima} €</span></th>
            ))}
            <th>Prima total</th>
          </tr>
        </thead>
        <tbody>
          {state.teams.map((t) => (
            <tr>
              <td>{t.name}<span class="prima">{t.cash} €</span></td>
              {INSURANCES.map((ins) => (
                <td>
                  <button
                    class="sg-cell"
                    aria-pressed={t.coverage[ins.key] ? 'true' : 'false'}
                    title={`${t.name} · ${ins.label}`}
                    onClick={() => toggle(t.id, ins.key)}
                  >{t.coverage[ins.key] ? '✓' : ''}</button>
                </td>
              ))}
              <td class="prima">{premiumsFor(t)} €</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style="margin-top:1.2rem">
        <button class="sg-btn" onClick={() => setState(lockCoverage(state))}>
          Confirmar cobertura y cobrar primas →
        </button>
      </p>
    </div>
  );
}
```

- [ ] **Step 3: Verify type-check progresses**

Run: `npx astro check 2>&1 | head -20`
Expected: remaining errors only for the missing `EventScreen`/`DebriefScreen` modules.

- [ ] **Step 4: Commit**

```bash
git add src/components/games/seguros/Scoreboard.tsx src/components/games/seguros/CoverageScreen.tsx
git commit -m "feat(seguros): coverage grid and scoreboard"
```

---

## Task 9: EventScreen

**Files:**
- Create: `src/components/games/seguros/EventScreen.tsx`

- [ ] **Step 1: Write `EventScreen.tsx`**

```tsx
/** @jsxImportSource preact */
import type { GameState } from '@/lib/games/seguros/types';
import type { StateUpdater } from 'preact/hooks';
import { revealEvent, nextRound } from '@/lib/games/seguros/engine';
import Scoreboard from './Scoreboard';

interface Props {
  state: GameState;
  setState: StateUpdater<GameState | null>;
}

export default function EventScreen({ state, setState }: Props) {
  const ev = state.currentEvent;
  return (
    <div class="sg">
      <span class="sg__kicker">Imprevisto</span>
      <h1>Ronda {state.round} <span class="sg__round">de {state.config.rounds}</span></h1>

      {state.phase === 'event' && (
        <>
          <p>Primas cobradas. El azar decide qué pasa esta ronda…</p>
          <button class="sg-btn" onClick={() => setState(revealEvent(state))}>Revelar imprevisto 🎲</button>
        </>
      )}

      {state.phase === 'resolved' && ev && (
        <>
          <div class="sg-event">
            <span class="sg__kicker">{ev.cubre ? 'Imprevisto' : 'Sin novedad'}</span>
            <h2>{ev.label}</h2>
            {ev.dano > 0 && <p class="dano">Daño: {ev.dano} € si no estabas cubierto</p>}
          </div>

          {ev.dano > 0 && ev.cubre && (
            <ul class="sg-score">
              {state.teams.map((t) => {
                const safe = t.coverage[ev.cubre!];
                return (
                  <li>
                    <span class="name">{t.name}</span>
                    <span class={safe ? 'sg-outcome--safe' : 'sg-outcome--hit'}>
                      {safe ? 'Cubierto: no paga' : `Paga ${ev.dano} €`}
                    </span>
                    <span class="cash">{t.cash} €</span>
                  </li>
                );
              })}
            </ul>
          )}

          <h2>Clasificación</h2>
          <Scoreboard state={state} />

          <button class="sg-btn" onClick={() => setState(nextRound(state))}>
            {state.round >= state.config.rounds ? 'Ver resultados finales →' : 'Siguiente ronda →'}
          </button>
        </>
      )}
    </div>
  );
}
```

> Note: the 🎲 above is a Unicode die on a button label (an interactive control), not a content icon — acceptable. If preferred, replace with the text "Revelar imprevisto". Do NOT add pictographic emojis to game content/cards.

- [ ] **Step 2: Verify type-check progresses**

Run: `npx astro check 2>&1 | head -20`
Expected: remaining errors only for the missing `DebriefScreen` module.

- [ ] **Step 3: Commit**

```bash
git add src/components/games/seguros/EventScreen.tsx
git commit -m "feat(seguros): event reveal and resolution screen"
```

---

## Task 10: DebriefScreen

**Files:**
- Create: `src/components/games/seguros/DebriefScreen.tsx`

- [ ] **Step 1: Write `DebriefScreen.tsx`**

```tsx
/** @jsxImportSource preact */
import type { GameState } from '@/lib/games/seguros/types';
import { debriefStats, ranking } from '@/lib/games/seguros/engine';

interface Props {
  state: GameState;
  onRestart: () => void;
}

function verdict(net: number, damages: number): string {
  if (damages === 0 && net < 0) return 'Pagó seguros pero no tuvo ningún imprevisto: tranquilidad que no necesitó… esta vez.';
  if (net > 0) return 'Estar asegurado le salió a cuenta: evitó más de lo que pagó en primas.';
  if (net < 0) return 'Pagó más en primas de lo que le habría costado el riesgo… esta partida.';
  return 'Quedó en tablas entre primas y daños.';
}

export default function DebriefScreen({ state, onRestart }: Props) {
  const winner = ranking(state)[0];
  const rows = debriefStats(state).sort((a, b) => b.cash - a.cash);
  return (
    <div class="sg">
      <span class="sg__kicker">Fin de la partida</span>
      <h1>Gana {winner.name} con {winner.cash} €</h1>

      <table class="sg-grid">
        <thead>
          <tr><th>Equipo</th><th>Saldo</th><th>Primas</th><th>Daños pagados</th><th>Daños evitados</th></tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr>
              <td>{r.name}</td>
              <td class="cash">{r.cash} €</td>
              <td class="prima">{r.premiums} €</td>
              <td class="prima">{r.damages} €</td>
              <td class="prima">{r.avoided} €</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Para debatir en clase</h2>
      <ul>
        {rows.map((r) => <li><strong>{r.name}:</strong> {verdict(r.net, r.damages)}</li>)}
      </ul>
      <p><em>El seguro no sirve para ganar dinero: sirve para que un golpe de mala suerte no te
        arruine. De media cuesta parecido asegurarse que no hacerlo; lo que cambia es el riesgo.</em></p>

      <button class="sg-btn sg-btn--ghost" onClick={onRestart}>Nueva partida</button>
    </div>
  );
}
```

- [ ] **Step 2: Type-check should now be clean for seguros**

Run: `npx astro check 2>&1 | head -20`
Expected: no errors referencing any `seguros` file.

- [ ] **Step 3: Commit**

```bash
git add src/components/games/seguros/DebriefScreen.tsx
git commit -m "feat(seguros): debrief screen with per-team verdicts"
```

---

## Task 11: Register game + build + manual verification

**Files:**
- Modify: `src/lib/juegos.ts`

- [ ] **Step 1: Add the registry entry**

In `src/lib/juegos.ts`, add this object to the exported `JUEGOS` array (follow the existing entries' formatting; place it among the single-player/standalone games):

```ts
{
  slug: 'seguros',
  title: 'Asegurados',
  descripcion: 'Cada equipo decide qué seguros paga. Cuando llega el imprevisto, quien está cubierto respira; quien no, paga. ¿Gana quien más se asegura o quien más arriesga?',
  tipo: 'tablero',
  nivel: ['eso', 'bach'],
  modo: 'clase por equipos · proyector',
  estado: 'disponible',
  imprimible: false,
  href: '/juegos/seguros/',
  nota_aula: 'El profesor proyecta la pantalla y lleva el marcador; cada equipo decide su cobertura ronda a ronda.',
  unidades_relacionadas: [
    { asignatura: 'eco-1bach', unidad: 3, nota: 'Planificación financiera personal: gestión del riesgo y seguros.', competencias_especificas: ['CE2'] },
    { asignatura: 'eco-4eso', unidad: 7, nota: 'Finanzas personales: dinero, presupuesto y protección ante imprevistos.' },
  ],
  competencias_clave: ['STEM', 'CD', 'CPSAA', 'CE'],
},
```

> Before committing, open `src/lib/juegos.ts` and confirm: (a) the `tipo` value `'tablero'` is in the `Juego.tipo` union; (b) `eco-4eso` unit 7 exists (adjust the `unidad`/`nota` to a real published unit about finance if not — check `src/content/asignaturas/eco-4eso/libro/`); (c) the field names match the `Juego`/`JuegoBridge` interfaces exactly. Fix to match reality.

- [ ] **Step 2: Run the full test suite**

Run: `npm test`
Expected: PASS (all existing tests + the new `seguros` engine tests).

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: `Complete!`, no errors. The route `/juegos/seguros/` is generated.

- [ ] **Step 4: Manual verification (run the app)**

Run: `npm run dev`, open `http://localhost:4321/juegos/seguros/`. Verify the full flow:
- Setup screen shows; start with 4 teams / 10 rounds.
- Coverage grid toggles per team; "Confirmar" charges income − primas (saldo updates).
- "Revelar imprevisto" shows an event; covered teams safe, uncovered charged; scoreboard reorders.
- "Siguiente ronda" loops; coverage persists between rounds.
- After the last round, debrief shows the table + per-team verdicts + winner.
- Refresh mid-game → "Reanudar partida guardada" restores state.
- The game appears on `/juegos/` hub with its card.

- [ ] **Step 5: Commit**

```bash
git add src/lib/juegos.ts
git commit -m "feat(seguros): register the game in the juegos hub"
```

- [ ] **Step 6: Finish the branch**

Use the `superpowers:finishing-a-development-branch` skill to open a PR for `feat/juego-seguros`.

---

## Self-Review (completed by plan author)

- **Spec coverage:** teacher-projected/team mode (Tasks 7–9 UI, registry modo), income+renew round flow (Task 3 lockCoverage, Task 5 nextRound), shared weighted event (Task 4), 5 insurances + calibrated numbers (Task 1 data), live scoreboard (Task 8), debrief (Task 10), config screen + localStorage resume (Task 7), architecture/registry (Tasks 7,11), out-of-scope print/individual (not built). ✔
- **Placeholder scan:** all steps contain concrete code/commands. ✔
- **Type consistency:** `Phase` = `'coverage'|'event'|'resolved'|'debrief'`; functions `createInitialState/setCoverage/premiumsFor/lockCoverage/drawCard/revealEvent/nextRound/isFinished/ranking/debriefStats` used consistently across engine, tests and components; `Team`/`GameState`/`EventCard`/`GameConfig` fields match between `types.ts` and all consumers. ✔
- **Known check points flagged for the implementer:** `Juego.tipo` must include `'tablero'`; `eco-4eso` finance unit number must be verified against real content; `StateUpdater` import path from `preact/hooks`. These are called out inline in their tasks.
