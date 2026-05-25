# Stonks (versión solo) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-player, no-backend stock-market simulator at `/juegos/stonks/` that also establishes the reusable games framework for the rest of the Bucket A games.

**Architecture:** Astro page renders a full-screen Preact island. All game mechanics live in pure, deterministic TypeScript modules under `src/lib/games/stonks/` (unit-tested with vitest, same pattern as `src/lib/calc/*`). UI components are Preact under `src/components/games/stonks/`. A shared `GameShell.astro` and `src/lib/games/storage.ts` are reused by future games. Charts are hand-written SVG (no chart library). Spanish only; multiplayer is out of scope (Phase 2).

**Tech Stack:** Astro 5, Preact (islands), TypeScript (strict), Tailwind 4, vitest. No new runtime dependencies.

**Reference spec:** `docs/superpowers/specs/2026-05-25-stonks-solo-design.md`

---

## Clarifications that supersede the spec

- **Round count is data-driven.** `TOTAL_ROUNDS = MARKET_DATA.length`. The real dataset spans the years 2000–2024, so the game runs **25 rounds** (this supersedes the spec's loose "20", which came from the old config; 25 years includes the dotcom crash, 2008 and COVID-2020, which is pedagogically richer).
- **Constants:** `INITIAL_CASH = 5000`, `INCOME_PER_ROUND = 3000`.
- **AI "El Mercat":** DCA fully invested in the S&P 500 index each year (receives the same yearly income, then applies that year's S&P return).
- **Determinism:** randomness (life events) goes through an injectable RNG so tests are deterministic.

## File Structure

| File | Responsibility |
|---|---|
| `src/lib/games/stonks/types.ts` | Types: `AssetId`, `AssetMeta`, `Risk`, `LifeEvent`, `MarketData`, `GameState`. |
| `src/lib/games/stonks/data.ts` | Static data: asset metadata (label/risk/unlockRound), `MARKET_DATA` (returns per year/asset), `LIFE_EVENTS`, year news. |
| `src/lib/games/stonks/data.test.ts` | Structural + anchor-value tests for the ported dataset. |
| `src/lib/games/stonks/engine.ts` | Pure game logic: init, allocation validation, advancing a year, net worth, finished. |
| `src/lib/games/stonks/engine.test.ts` | Engine unit tests. |
| `src/lib/games/stonks/ai.ts` | "El Mercat" DCA strategy. |
| `src/lib/games/stonks/ai.test.ts` | AI unit tests. |
| `src/lib/games/storage.ts` | Reusable localStorage wrapper (namespaced per game). |
| `src/lib/games/storage.test.ts` | Storage unit tests (with injected storage). |
| `src/components/games/GameShell.astro` | Reusable full-screen game shell (Variant C, exit link). |
| `src/components/games/stonks/EvolucionChart.tsx` | Hand-written SVG line chart (player vs AI). |
| `src/components/games/stonks/StonksGame.tsx` | Root Preact island: UI state machine wiring engine + screens + storage. |
| `src/components/games/stonks/StartScreen.tsx` | Start/continue screen. |
| `src/components/games/stonks/NewsScreen.tsx` | Year news screen. |
| `src/components/games/stonks/AllocateScreen.tsx` | Core allocation screen. |
| `src/components/games/stonks/ResultScreen.tsx` | Per-year results screen. |
| `src/components/games/stonks/FinalScreen.tsx` | Final summary (chart + lessons + AI verdict). |
| `src/components/games/stonks/stonks.css` | Scoped Variant C styles for the game (from validated mockups). |
| `src/pages/juegos/stonks/index.astro` | Route hosting the island. |
| `src/pages/juegos/index.astro` | Modify: surface stonks as available. |

---

## Task 1: Types

**Files:**
- Create: `src/lib/games/stonks/types.ts`

- [ ] **Step 1: Write the types module**

```ts
// src/lib/games/stonks/types.ts
export type AssetId =
  | 'ahorro' | 'deposito' | 'bonos' | 'oro'
  | 'ibex' | 'sp500' | 'bitcoin' | 'inmobiliario';

export type Risk = 'baja' | 'media' | 'alta' | 'extrema';

export interface AssetMeta {
  id: AssetId;
  label: string;        // es
  risk: Risk;
  unlockRound: number;  // round index from which the asset can be used
  blurb: string;        // one-sentence description for the info button (es)
}

export interface LifeEvent {
  id: string;
  text: string;   // es
  amount: number; // € applied to cash (negative = expense)
}

/** Annual return as a fraction (0.15 = +15%). null = asset did not exist that year. */
export type MarketData = Record<number, Record<AssetId, number | null>>;

export interface GameState {
  round: number;                       // 0-based index into the sorted year list
  cash: number;
  holdings: Record<AssetId, number>;   // € currently held per asset
  allocation: Record<AssetId, number>; // % for the round in progress (integers, sum 100)
  ai: { netWorth: number };
  lastEvent: LifeEvent | null;         // event applied in the most recent advance
  lastReturns: Record<AssetId, number | null> | null; // returns applied last advance
  history: { year: number; playerNet: number; aiNet: number }[];
  phase: 'start' | 'news' | 'allocate' | 'results' | 'finished';
}
```

- [ ] **Step 2: Typecheck**

Run: `npx astro check 2>&1 | tail -5` (or `npx tsc --noEmit` if faster)
Expected: no errors referencing `types.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/games/stonks/types.ts
git commit -m "feat(stonks): game types"
```

---

## Task 2: Data (port + verify the historical dataset)

**Files:**
- Create: `src/lib/games/stonks/data.ts`
- Test: `src/lib/games/stonks/data.test.ts`

The real returns table lives in the old game. Port it; do not invent figures.

- [ ] **Step 1: Fetch the old data**

Fetch `https://raw.githubusercontent.com/skinnydkd/webpde/main/stonks.html` and locate the JS objects holding (a) the per-year/per-asset returns and (b) the life events and (c) the per-year news strings. (Use WebFetch or `gh api repos/skinnydkd/webpde/contents/stonks.html` and base64-decode.)

- [ ] **Step 2: Write `data.ts` with asset metadata + ported tables**

Asset metadata is fixed (below). Port `MARKET_DATA` (years 2000–2024), `YEAR_NEWS` and `LIFE_EVENTS` from the old source into the typed structures. Bitcoin is `null` until 2012.

```ts
// src/lib/games/stonks/data.ts
import type { AssetId, AssetMeta, LifeEvent, MarketData } from './types';

export const INITIAL_CASH = 5000;
export const INCOME_PER_ROUND = 3000;
export const INDEX_ASSET: AssetId = 'sp500'; // AI DCA index

export const ASSETS: AssetMeta[] = [
  { id: 'ahorro',       label: 'Ahorro',        risk: 'baja',    unlockRound: 0, blurb: 'Dinero disponible al instante; casi no da rendimiento y pierde poder con la inflación.' },
  { id: 'deposito',     label: 'Depósito',      risk: 'baja',    unlockRound: 0, blurb: 'Inmovilizas el dinero un tiempo a cambio de un interés fijo pequeño.' },
  { id: 'bonos',        label: 'Bonos',         risk: 'media',   unlockRound: 5, blurb: 'Prestas dinero a un Estado o empresa que te lo devuelve con intereses.' },
  { id: 'oro',          label: 'Oro',           risk: 'media',   unlockRound: 5, blurb: 'Activo refugio: suele subir cuando hay miedo, pero no genera rentas.' },
  { id: 'ibex',         label: 'IBEX 35',       risk: 'alta',    unlockRound: 3, blurb: 'Índice de las 35 mayores empresas españolas; sube y baja con la economía.' },
  { id: 'sp500',        label: 'S&P 500',       risk: 'alta',    unlockRound: 3, blurb: 'Índice de las 500 mayores empresas de EE. UU.; el más seguido del mundo.' },
  { id: 'bitcoin',      label: 'Bitcoin',       risk: 'extrema', unlockRound: 8, blurb: 'Criptomoneda muy volátil: puede multiplicarse o desplomarse en un año.' },
  { id: 'inmobiliario', label: 'Inmobiliario',  risk: 'media',   unlockRound: 8, blurb: 'Comprar vivienda o locales para alquilar; poco líquido, sube despacio.' },
];

export const ASSET_IDS = ASSETS.map((a) => a.id) as AssetId[];

// Ported from webpde/stonks.html. Fractions (0.15 = +15%). null = not yet available.
// VERIFY against the anchors in data.test.ts before committing.
export const MARKET_DATA: MarketData = {
  2000: { ahorro: 0.03, deposito: 0.04, bonos: 0.05, oro: -0.06, ibex: -0.217, sp500: -0.10, bitcoin: null, inmobiliario: 0.08 },
  // ... port every year through 2024 from the old source ...
  2024: { ahorro: 0.02, deposito: 0.03, bonos: 0.02, oro: 0.27, ibex: 0.149, sp500: 0.23, bitcoin: 1.20, inmobiliario: 0.06 },
};

export const YEARS = Object.keys(MARKET_DATA).map(Number).sort((a, b) => a - b);
export const TOTAL_ROUNDS = YEARS.length;

export const YEAR_NEWS: Record<number, string> = {
  2000: 'Estalla la burbuja de las puntocom.',
  2008: 'Crisis financiera global.',
  2020: 'La COVID-19 paraliza la economía mundial.',
  // ... port the rest from the old source; every year in YEARS must have an entry ...
};

export const LIFE_EVENTS: LifeEvent[] = [
  { id: 'coche',      text: 'Avería del coche.',                amount: -1500 },
  { id: 'medico',     text: 'Gasto médico inesperado.',         amount: -3000 },
  { id: 'multa',      text: 'Multa de tráfico.',                amount: -300 },
  { id: 'movil',      text: 'Se te rompe el móvil.',            amount: -600 },
  { id: 'reforma',    text: 'Reparación en casa.',              amount: -1200 },
  { id: 'paga',       text: 'Paga extra de Navidad.',           amount: 2000 },
  { id: 'herencia',   text: 'Pequeña herencia de un familiar.', amount: 4000 },
  { id: 'loteria',    text: 'Premio menor de lotería.',         amount: 1000 },
  { id: 'bonus',      text: 'Bonus por objetivos en el trabajo.', amount: 1500 },
  { id: 'devolucion', text: 'Devolución de Hacienda.',          amount: 800 },
  { id: 'boda',       text: 'Boda de un amigo: regalo y viaje.', amount: -700 },
  { id: 'beca',       text: 'Te conceden una beca/ayuda.',      amount: 1200 },
];

export const LIFE_EVENT_CHANCE = 0.3; // probability per round
```

- [ ] **Step 3: Write the verification test**

```ts
// src/lib/games/stonks/data.test.ts
import { describe, it, expect } from 'vitest';
import { MARKET_DATA, YEARS, ASSET_IDS, YEAR_NEWS, LIFE_EVENTS, ASSETS } from './data';

describe('stonks dataset', () => {
  it('covers 2000..2024 inclusive', () => {
    expect(YEARS[0]).toBe(2000);
    expect(YEARS[YEARS.length - 1]).toBe(2024);
    expect(YEARS.length).toBe(25);
  });

  it('every year has a value for every asset', () => {
    for (const y of YEARS) {
      for (const id of ASSET_IDS) {
        expect(MARKET_DATA[y]).toHaveProperty(id);
      }
    }
  });

  it('bitcoin is null before 2012 and a number from 2012', () => {
    expect(MARKET_DATA[2011].bitcoin).toBeNull();
    expect(typeof MARKET_DATA[2012].bitcoin).toBe('number');
  });

  it('matches known historical anchors (±0.5pp)', () => {
    expect(MARKET_DATA[2000].ibex).toBeCloseTo(-0.217, 2);
    expect(MARKET_DATA[2008].sp500).toBeCloseTo(-0.37, 2);
    expect(MARKET_DATA[2019].sp500).toBeCloseTo(0.315, 2);
    expect(MARKET_DATA[2022].bitcoin).toBeCloseTo(-0.643, 2);
  });

  it('every year has news', () => {
    for (const y of YEARS) expect(YEAR_NEWS[y]).toBeTruthy();
  });

  it('has at least 10 life events with non-zero amounts', () => {
    expect(LIFE_EVENTS.length).toBeGreaterThanOrEqual(10);
    for (const e of LIFE_EVENTS) expect(e.amount).not.toBe(0);
  });

  it('unlock rounds are within range', () => {
    for (const a of ASSETS) expect(a.unlockRound).toBeLessThan(YEARS.length);
  });
});
```

- [ ] **Step 4: Run tests, port until green**

Run: `npx vitest run src/lib/games/stonks/data.test.ts`
Expected: all pass once the full `MARKET_DATA` and `YEAR_NEWS` are ported (the anchor test will fail until real values are in). Do not weaken the anchor test to pass — fix the data.

- [ ] **Step 5: Commit**

```bash
git add src/lib/games/stonks/data.ts src/lib/games/stonks/data.test.ts
git commit -m "feat(stonks): port historical dataset, assets and life events"
```

---

## Task 3: Engine (pure logic, TDD)

**Files:**
- Create: `src/lib/games/stonks/engine.ts`
- Test: `src/lib/games/stonks/engine.test.ts`

Helpers exposed: `createInitialState()`, `unlockedAssets(round)`, `allocationSum(state)`, `isAllocationValid(state)`, `currentYear(state)`, `netWorth(state)`, `advanceYear(state, rng?)`, `isFinished(state)`.

- [ ] **Step 1: Write failing tests**

```ts
// src/lib/games/stonks/engine.test.ts
import { describe, it, expect } from 'vitest';
import {
  createInitialState, unlockedAssets, allocationSum, isAllocationValid,
  netWorth, advanceYear, isFinished, currentYear,
} from './engine';
import { INITIAL_CASH, INCOME_PER_ROUND, YEARS, TOTAL_ROUNDS } from './data';

const noEvents = () => 1; // rng returning 1 => no life event (>= LIFE_EVENT_CHANCE)

describe('engine', () => {
  it('starts at round 0, year 2000, all cash, no holdings', () => {
    const s = createInitialState();
    expect(s.round).toBe(0);
    expect(currentYear(s)).toBe(YEARS[0]);
    expect(s.cash).toBe(INITIAL_CASH);
    expect(netWorth(s)).toBe(INITIAL_CASH);
    expect(s.phase).toBe('start');
  });

  it('unlocks only round-appropriate assets', () => {
    expect(unlockedAssets(0).map((a) => a.id)).toEqual(['ahorro', 'deposito']);
    expect(unlockedAssets(3).map((a) => a.id)).toContain('ibex');
    expect(unlockedAssets(8).map((a) => a.id)).toContain('bitcoin');
  });

  it('validates the allocation sums to 100 over unlocked assets', () => {
    const s = createInitialState();
    s.allocation = { ...s.allocation, ahorro: 50, deposito: 50 };
    expect(allocationSum(s)).toBe(100);
    expect(isAllocationValid(s)).toBe(true);
    s.allocation = { ...s.allocation, ahorro: 40 };
    expect(isAllocationValid(s)).toBe(false);
  });

  it('advanceYear invests net worth by allocation then applies that year return', () => {
    const s = createInitialState();
    s.phase = 'allocate';
    s.allocation = { ...s.allocation, ahorro: 0, deposito: 100 };
    const before = netWorth(s); // 5000
    const next = advanceYear(s, noEvents);
    // deposito 2000 return applied + income added next round; net worth grew by the deposito return on the invested base
    expect(next.round).toBe(1);
    expect(next.cash + Object.values(next.holdings).reduce((a, b) => a + b, 0)).toBeGreaterThan(before);
    expect(next.lastEvent).toBeNull();
  });

  it('adds income each advanced year', () => {
    const s = createInitialState();
    s.phase = 'allocate';
    s.allocation = { ...s.allocation, ahorro: 100, deposito: 0 };
    const next = advanceYear(s, noEvents);
    // ahorro ~0 return; net worth should be ~ initial*(1+ahorro2000) + income
    expect(netWorth(next)).toBeGreaterThanOrEqual(INITIAL_CASH + INCOME_PER_ROUND - 1);
  });

  it('applies a life event when rng triggers it', () => {
    const s = createInitialState();
    s.phase = 'allocate';
    s.allocation = { ...s.allocation, ahorro: 100, deposito: 0 };
    const next = advanceYear(s, () => 0); // 0 < chance => event fires
    expect(next.lastEvent).not.toBeNull();
  });

  it('records history and finishes after TOTAL_ROUNDS', () => {
    let s = createInitialState();
    s.phase = 'allocate';
    for (let i = 0; i < TOTAL_ROUNDS; i++) {
      s.allocation = { ...s.allocation, ...Object.fromEntries(unlockedAssets(s.round).map((a, idx, arr) => [a.id, idx === 0 ? 100 - (arr.length - 1) * Math.floor(100 / arr.length) : Math.floor(100 / arr.length)])) };
      s = advanceYear(s, noEvents);
    }
    expect(isFinished(s)).toBe(true);
    expect(s.phase).toBe('finished');
    expect(s.history.length).toBe(TOTAL_ROUNDS);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/lib/games/stonks/engine.test.ts`
Expected: FAIL (engine not implemented).

- [ ] **Step 3: Implement the engine**

```ts
// src/lib/games/stonks/engine.ts
import type { AssetId, GameState } from './types';
import {
  ASSETS, ASSET_IDS, MARKET_DATA, YEARS, TOTAL_ROUNDS,
  INITIAL_CASH, INCOME_PER_ROUND, LIFE_EVENTS, LIFE_EVENT_CHANCE,
} from './data';
import { aiAdvance } from './ai';

const zeroBy = <T extends number>(v: T) => Object.fromEntries(ASSET_IDS.map((id) => [id, v])) as Record<AssetId, T>;

export function createInitialState(): GameState {
  return {
    round: 0,
    cash: INITIAL_CASH,
    holdings: zeroBy(0),
    allocation: zeroBy(0),
    ai: { netWorth: INITIAL_CASH },
    lastEvent: null,
    lastReturns: null,
    history: [],
    phase: 'start',
  };
}

export const currentYear = (s: GameState): number => YEARS[Math.min(s.round, YEARS.length - 1)];
export const unlockedAssets = (round: number) => ASSETS.filter((a) => a.unlockRound <= round);
export const netWorth = (s: GameState): number =>
  s.cash + ASSET_IDS.reduce((sum, id) => sum + s.holdings[id], 0);

export const allocationSum = (s: GameState): number =>
  unlockedAssets(s.round).reduce((sum, a) => sum + (s.allocation[a.id] || 0), 0);

export const isAllocationValid = (s: GameState): boolean => allocationSum(s) === 100;

export const isFinished = (s: GameState): boolean => s.round >= TOTAL_ROUNDS;

/** Advance one year: invest by allocation, apply returns, income, and a possible life event. */
export function advanceYear(s: GameState, rng: () => number = Math.random): GameState {
  const year = currentYear(s);
  const returns = MARKET_DATA[year];
  const total = netWorth(s);

  // 1. Re-invest the whole net worth according to the allocation.
  const holdings = zeroBy(0);
  for (const a of unlockedAssets(s.round)) {
    holdings[a.id] = (total * (s.allocation[a.id] || 0)) / 100;
  }

  // 2. Apply this year's return to each holding (null => unchanged).
  for (const id of ASSET_IDS) {
    const r = returns[id];
    if (r != null) holdings[id] = holdings[id] * (1 + r);
  }

  // 3. New cash starts at 0 (everything was allocated); add income for the next year.
  let cash = INCOME_PER_ROUND;

  // 4. Possible life event.
  let lastEvent = null as GameState['lastEvent'];
  if (rng() < LIFE_EVENT_CHANCE) {
    const ev = LIFE_EVENTS[Math.floor(rng() * LIFE_EVENTS.length) % LIFE_EVENTS.length];
    lastEvent = ev;
    cash = Math.max(0, cash + ev.amount);
  }

  // 5. Advance the AI benchmark.
  const ai = { netWorth: aiAdvance(s.ai.netWorth, year) };

  const nextRound = s.round + 1;
  const playerNet = cash + ASSET_IDS.reduce((sum, id) => sum + holdings[id], 0);
  const history = [...s.history, { year, playerNet, aiNet: ai.netWorth }];

  return {
    ...s,
    round: nextRound,
    cash,
    holdings,
    allocation: zeroBy(0),
    ai,
    lastEvent,
    lastReturns: returns,
    history,
    phase: nextRound >= TOTAL_ROUNDS ? 'finished' : 'results',
  };
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npx vitest run src/lib/games/stonks/engine.test.ts`
Expected: PASS (after Task 4 `ai.ts` exists; if running before Task 4, create a temporary `ai.ts` stub — or implement Task 4 first, then this. Recommended order: do Task 4 before Step 4 here).

- [ ] **Step 5: Commit**

```bash
git add src/lib/games/stonks/engine.ts src/lib/games/stonks/engine.test.ts
git commit -m "feat(stonks): pure game engine with tests"
```

---

## Task 4: AI "El Mercat" (DCA, TDD)

**Files:**
- Create: `src/lib/games/stonks/ai.ts`
- Test: `src/lib/games/stonks/ai.test.ts`

> Implement this BEFORE Task 3 Step 4 (engine imports `aiAdvance`).

- [ ] **Step 1: Write failing test**

```ts
// src/lib/games/stonks/ai.test.ts
import { describe, it, expect } from 'vitest';
import { aiAdvance } from './ai';
import { INCOME_PER_ROUND, MARKET_DATA, INDEX_ASSET } from './data';

describe('ai El Mercat (DCA on the index)', () => {
  it('adds income then applies the index return for the year', () => {
    const start = 5000;
    const year = 2019;
    const r = MARKET_DATA[year][INDEX_ASSET]!; // +0.315
    expect(aiAdvance(start, year)).toBeCloseTo((start + INCOME_PER_ROUND) * (1 + r), 2);
  });

  it('drops in a bad year', () => {
    expect(aiAdvance(10000, 2008)).toBeLessThan(10000 + INCOME_PER_ROUND);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/lib/games/stonks/ai.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement**

```ts
// src/lib/games/stonks/ai.ts
import { MARKET_DATA, INDEX_ASSET, INCOME_PER_ROUND } from './data';

/** El Mercat: dollar-cost-averaging fully invested in the index. */
export function aiAdvance(netWorth: number, year: number): number {
  const r = MARKET_DATA[year][INDEX_ASSET] ?? 0;
  return (netWorth + INCOME_PER_ROUND) * (1 + r);
}
```

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run src/lib/games/stonks/ai.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/games/stonks/ai.ts src/lib/games/stonks/ai.test.ts
git commit -m "feat(stonks): El Mercat DCA benchmark with tests"
```

---

## Task 5: Reusable localStorage wrapper (TDD)

**Files:**
- Create: `src/lib/games/storage.ts`
- Test: `src/lib/games/storage.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// src/lib/games/storage.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { makeGameStorage } from './storage';

function memoryStorage(): Storage {
  const m = new Map<string, string>();
  return {
    getItem: (k) => (m.has(k) ? m.get(k)! : null),
    setItem: (k, v) => void m.set(k, v),
    removeItem: (k) => void m.delete(k),
    clear: () => m.clear(),
    key: (i) => [...m.keys()][i] ?? null,
    get length() { return m.size; },
  } as Storage;
}

describe('game storage', () => {
  let store: ReturnType<typeof makeGameStorage>;
  beforeEach(() => { store = makeGameStorage('stonks', memoryStorage()); });

  it('saves and loads state', () => {
    expect(store.load()).toBeNull();
    store.save({ round: 3 });
    expect(store.load()).toEqual({ round: 3 });
  });

  it('clears state', () => {
    store.save({ round: 1 });
    store.clear();
    expect(store.load()).toBeNull();
  });

  it('tracks best score (max wins)', () => {
    expect(store.getBest()).toBe(0);
    store.setBest(100);
    store.setBest(50);
    expect(store.getBest()).toBe(100);
  });

  it('survives corrupt JSON', () => {
    const raw = memoryStorage();
    raw.setItem('pde:game:stonks:state', '{not json');
    const s = makeGameStorage('stonks', raw);
    expect(s.load()).toBeNull();
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/lib/games/storage.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement**

```ts
// src/lib/games/storage.ts
/** Namespaced localStorage wrapper for games. Pass a custom Storage in tests. */
export function makeGameStorage<T = unknown>(
  slug: string,
  backend: Storage | null = typeof localStorage !== 'undefined' ? localStorage : null,
) {
  const stateKey = `pde:game:${slug}:state`;
  const bestKey = `pde:game:${slug}:best`;
  return {
    load(): T | null {
      if (!backend) return null;
      const raw = backend.getItem(stateKey);
      if (!raw) return null;
      try { return JSON.parse(raw) as T; } catch { return null; }
    },
    save(state: T): void { backend?.setItem(stateKey, JSON.stringify(state)); },
    clear(): void { backend?.removeItem(stateKey); },
    getBest(): number {
      const raw = backend?.getItem(bestKey);
      const n = raw ? Number(raw) : 0;
      return Number.isFinite(n) ? n : 0;
    },
    setBest(value: number): void {
      if (!backend) return;
      if (value > this.getBest()) backend.setItem(bestKey, String(Math.round(value)));
    },
  };
}
```

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run src/lib/games/storage.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/games/storage.ts src/lib/games/storage.test.ts
git commit -m "feat(games): reusable namespaced localStorage wrapper"
```

---

## Task 6: Game styles (Variant C, from validated mockups)

**Files:**
- Create: `src/components/games/stonks/stonks.css`

- [ ] **Step 1: Write the stylesheet**

Port the validated mockup styling. Use the project's CSS variables if present (`--color-*`); otherwise define the Variant C palette locally. Cover: full-screen container, phone-width card, top bar (year/round), news block, wealth, asset rows (name + typographic risk label + `−/+` controls + allocation bar), total indicator, primary CTA, results list, final card (verdict, scores, chart wrapper, legend, lessons list, CTA row). Risk colors: `baja`→teal `#1F6E6E`, `media`→mostaza `#A87A2A`, `alta`→terracota `#C44E2C`, `extrema`→terracota deep `#9C3A1C`. No gradients, no emoji.

(Use the markup/classes from `docs/superpowers/specs/2026-05-25-stonks-solo-design.md` §7 and the validated mockup CSS: `.sk-*` and `.kf-*` class shapes.)

- [ ] **Step 2: Commit**

```bash
git add src/components/games/stonks/stonks.css
git commit -m "feat(stonks): Variant C game styles"
```

---

## Task 7: EvolucionChart (hand-written SVG)

**Files:**
- Create: `src/components/games/stonks/EvolucionChart.tsx`

- [ ] **Step 1: Implement the chart**

```tsx
// src/components/games/stonks/EvolucionChart.tsx
interface Point { year: number; playerNet: number; aiNet: number }
export function EvolucionChart({ history }: { history: Point[] }) {
  if (history.length === 0) return null;
  const W = 600, H = 220, padL = 50, padR = 20, padT = 20, padB = 30;
  const max = Math.max(...history.flatMap((p) => [p.playerNet, p.aiNet]), 1);
  const xs = (i: number) => padL + (i / (history.length - 1 || 1)) * (W - padL - padR);
  const ys = (v: number) => H - padB - (v / max) * (H - padT - padB);
  const line = (key: 'playerNet' | 'aiNet') =>
    history.map((p, i) => `${xs(i)},${ys(p[key])}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Evolución del patrimonio frente a la IA">
      <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="#E5D4BD" />
      <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="#E5D4BD" />
      <polyline fill="none" stroke="#8A7868" stroke-width="2" stroke-dasharray="4 3" points={line('aiNet')} />
      <polyline fill="none" stroke="#C44E2C" stroke-width="2.5" points={line('playerNet')} />
      <text x={padL} y={H - 8} font-family="monospace" font-size="9" fill="#8A7868">{history[0].year}</text>
      <text x={W - padR} y={H - 8} text-anchor="end" font-family="monospace" font-size="9" fill="#8A7868">{history[history.length - 1].year}</text>
    </svg>
  );
}
```

- [ ] **Step 2: Typecheck & commit**

Run: `npx astro check 2>&1 | tail -5`
```bash
git add src/components/games/stonks/EvolucionChart.tsx
git commit -m "feat(stonks): SVG evolution chart"
```

---

## Task 8: Screen components

**Files:**
- Create: `StartScreen.tsx`, `NewsScreen.tsx`, `AllocateScreen.tsx`, `ResultScreen.tsx`, `FinalScreen.tsx` under `src/components/games/stonks/`

Each is a presentational Preact component receiving state + callbacks. No game logic inside (it lives in the engine). Build them to match the validated mockups (spec §7). Below is the contract for each; implement the markup with the `stonks.css` classes.

- [ ] **Step 1: `AllocateScreen.tsx`** — the core screen.

```tsx
// src/components/games/stonks/AllocateScreen.tsx
import type { GameState } from '@/lib/games/stonks/types';
import { unlockedAssets, allocationSum, isAllocationValid, netWorth, currentYear } from '@/lib/games/stonks/engine';
import { ASSETS } from '@/lib/games/stonks/data';

interface Props {
  state: GameState;
  onChange: (id: string, delta: number) => void; // +/- 5 typically
  onConfirm: () => void;
}
const RISK_LABEL = { baja: 'Riesgo bajo', media: 'Riesgo medio', alta: 'Riesgo alto', extrema: 'Riesgo extremo' };

export function AllocateScreen({ state, onChange, onConfirm }: Props) {
  const unlocked = unlockedAssets(state.round);
  const sum = allocationSum(state);
  const valid = isAllocationValid(state);
  return (
    <div class="sk-phone">
      <div class="sk-top">
        <div><div class="sk-year serif">{currentYear(state)}</div>
          <div class="sk-round">Ronda {state.round + 1} de {state.history.length + (state.history.length, 25)}</div></div>
      </div>
      <div class="sk-wealth"><div class="l">Tu patrimonio</div>
        <div class="v">{Math.round(netWorth(state)).toLocaleString('es-ES')} €</div></div>
      <div class="sk-assets">
        {ASSETS.map((a) => {
          const locked = !unlocked.includes(a);
          return (
            <div class={`sk-asset risk-${a.risk} ${locked ? 'locked' : ''}`} key={a.id}>
              <div class="row1">
                <div><span class="nm">{a.label}</span>{' '}
                  {locked ? <span class="lock">se desbloquea más adelante</span>
                          : <span class={`risk r-${a.risk}`}>{RISK_LABEL[a.risk]}</span>}</div>
                {!locked && (
                  <div class="ctrl">
                    <button class="sk-btn" onClick={() => onChange(a.id, -5)}>−</button>
                    <span class="sk-pct">{state.allocation[a.id] || 0}%</span>
                    <button class="sk-btn" onClick={() => onChange(a.id, +5)}>+</button>
                  </div>)}
              </div>
              {!locked && <div class="sk-bar"><i style={{ width: `${state.allocation[a.id] || 0}%` }} /></div>}
            </div>);
        })}
      </div>
      <div class="sk-total"><span class="lab">Total repartido</span>
        <span class={valid ? 'ok' : 'bad'}>{sum}%{valid ? ' ✓' : ''}</span></div>
      <button class="sk-cta" disabled={!valid} onClick={onConfirm}>Confirmar inversión</button>
    </div>
  );
}
```

> Note: replace the `(state.history.length, 25)` placeholder with the imported `TOTAL_ROUNDS` from `data.ts`. Import it: `import { TOTAL_ROUNDS } from '@/lib/games/stonks/data';` and render `Ronda {state.round + 1} de {TOTAL_ROUNDS}`.

- [ ] **Step 2: `StartScreen.tsx`** — title, intro paragraph, `Empezar` button; if `hasSave`, also `Continuar`.

```tsx
export function StartScreen({ hasSave, onStart, onContinue }:
  { hasSave: boolean; onStart: () => void; onContinue: () => void }) {
  return (
    <div class="sk-phone sk-start">
      <h1 class="sk-year serif">Stonks</h1>
      <p class="sk-intro">Invierte durante 25 años (2000–2024) repartiendo tu patrimonio entre distintos activos. Tu objetivo: terminar con más que «El Mercat», una IA que invierte siempre en un índice. ¿Lo conseguirás?</p>
      {hasSave && <button class="sk-cta ghost" onClick={onContinue}>Continuar partida</button>}
      <button class="sk-cta" onClick={onStart}>Empezar</button>
    </div>
  );
}
```

- [ ] **Step 3: `NewsScreen.tsx`** — year + `YEAR_NEWS[year]` + `Invertir` button.

```tsx
import { YEAR_NEWS } from '@/lib/games/stonks/data';
export function NewsScreen({ year, onContinue }: { year: number; onContinue: () => void }) {
  return (
    <div class="sk-phone">
      <div class="sk-news"><div class="eyebrow">Noticia del año {year}</div>
        <div class="t serif">{YEAR_NEWS[year]}</div></div>
      <button class="sk-cta" onClick={onContinue}>Invertir</button>
    </div>);
}
```

- [ ] **Step 4: `ResultScreen.tsx`** — show `state.lastReturns` per asset, `state.lastEvent` if any, new net worth, `Siguiente año` button.

```tsx
import type { GameState } from '@/lib/games/stonks/types';
import { ASSETS } from '@/lib/games/stonks/data';
import { netWorth } from '@/lib/games/stonks/engine';
export function ResultScreen({ state, onNext }: { state: GameState; onNext: () => void }) {
  const r = state.lastReturns;
  return (
    <div class="sk-phone">
      <div class="sk-round">Resultado del año {state.history.at(-1)?.year}</div>
      <div class="sk-wealth"><div class="l">Tu patrimonio</div>
        <div class="v">{Math.round(netWorth(state)).toLocaleString('es-ES')} €</div></div>
      {state.lastEvent && <div class="sk-news"><div class="eyebrow">Imprevisto</div>
        <div class="t">{state.lastEvent.text} ({state.lastEvent.amount > 0 ? '+' : ''}{state.lastEvent.amount} €)</div></div>}
      <ul class="sk-returns">
        {r && ASSETS.filter((a) => r[a.id] != null).map((a) =>
          <li key={a.id}><span>{a.label}</span>
            <span class={r[a.id]! >= 0 ? 'pos' : 'neg'}>{(r[a.id]! * 100).toFixed(1)}%</span></li>)}
      </ul>
      <button class="sk-cta" onClick={onNext}>{state.phase === 'finished' ? 'Ver resumen' : 'Siguiente año'}</button>
    </div>);
}
```

- [ ] **Step 5: `FinalScreen.tsx`** — verdict, player vs AI scores, `EvolucionChart`, 6 lessons, `Jugar otra vez`.

```tsx
import type { GameState } from '@/lib/games/stonks/types';
import { netWorth } from '@/lib/games/stonks/engine';
import { EvolucionChart } from './EvolucionChart';
const LESSONS = [
  'Diversificar reduce el riesgo: no lo pongas todo en un solo activo.',
  'Tiempo en el mercado supera a acertar el momento: invertir pronto y mantener.',
  'El interés compuesto es la fuerza más poderosa de las finanzas.',
  'La volatilidad no es tu enemiga si tienes paciencia.',
  'El 80% de los fondos activos no baten al índice a largo plazo.',
  'DCA: invertir lo mismo cada periodo, pase lo que pase.',
];
export function FinalScreen({ state, onРestartReplace }: any) {} // see Step 5b
```

- [ ] **Step 5b: Correct `FinalScreen.tsx`** (write this real version; the snippet above is intentionally a stub to force you to read the contract):

```tsx
import type { GameState } from '@/lib/games/stonks/types';
import { netWorth } from '@/lib/games/stonks/engine';
import { EvolucionChart } from './EvolucionChart';

const LESSONS = [
  'Diversificar reduce el riesgo: no lo pongas todo en un solo activo.',
  'Tiempo en el mercado supera a acertar el momento: invertir pronto y mantener.',
  'El interés compuesto es la fuerza más poderosa de las finanzas.',
  'La volatilidad no es tu enemiga si tienes paciencia.',
  'El 80% de los fondos activos no baten al índice a largo plazo.',
  'DCA: invertir lo mismo cada periodo, pase lo que pase.',
];

export function FinalScreen({ state, onRestart }: { state: GameState; onRestart: () => void }) {
  const you = Math.round(netWorth(state));
  const ai = Math.round(state.ai.netWorth);
  const won = you >= ai;
  return (
    <div class="kf-card">
      <div class="kf-eyebrow">{state.history[0]?.year} — {state.history.at(-1)?.year} · {state.history.length} años</div>
      <div class="kf-verdict serif">Has <span class="ac">{won ? 'ganado' : 'perdido contra'}</span> el Mercado</div>
      <div class="kf-scores">
        <div class="kf-score you"><div class="l">Tu patrimonio</div><div class="v">{you.toLocaleString('es-ES')} €</div></div>
        <div class="kf-score ai"><div class="l">IA «El Mercat»</div><div class="v">{ai.toLocaleString('es-ES')} €</div></div>
      </div>
      <div class="kf-chart"><EvolucionChart history={state.history} />
        <div class="kf-legend"><span><i style={{ background: '#C44E2C' }} />Tú</span>
          <span><i style={{ background: '#8A7868' }} />IA «El Mercat»</span></div></div>
      <div class="kf-lessons"><h3 class="serif">Lo que has aprendido</h3>
        <ul>{LESSONS.map((l) => <li key={l}>{l}</li>)}</ul></div>
      <div class="kf-cta"><button class="primary" onClick={onRestart}>Jugar otra vez</button></div>
    </div>);
}
```

- [ ] **Step 6: Typecheck & commit**

Run: `npx astro check 2>&1 | tail -8`
```bash
git add src/components/games/stonks/StartScreen.tsx src/components/games/stonks/NewsScreen.tsx src/components/games/stonks/AllocateScreen.tsx src/components/games/stonks/ResultScreen.tsx src/components/games/stonks/FinalScreen.tsx
git commit -m "feat(stonks): screen components"
```

---

## Task 9: Root island (state machine wiring)

**Files:**
- Create: `src/components/games/stonks/StonksGame.tsx`

- [ ] **Step 1: Implement the island**

```tsx
// src/components/games/stonks/StonksGame.tsx
import { useState, useEffect } from 'preact/hooks';
import type { GameState } from '@/lib/games/stonks/types';
import { createInitialState, advanceYear, currentYear, netWorth } from '@/lib/games/stonks/engine';
import { makeGameStorage } from '@/lib/games/storage';
import { StartScreen } from './StartScreen';
import { NewsScreen } from './NewsScreen';
import { AllocateScreen } from './AllocateScreen';
import { ResultScreen } from './ResultScreen';
import { FinalScreen } from './FinalScreen';
import './stonks.css';

const store = makeGameStorage<GameState>('stonks');

export default function StonksGame() {
  const [state, setState] = useState<GameState>(() => store.load() ?? createInitialState());
  const hasSave = state.phase !== 'start' && !!store.load();

  useEffect(() => {
    if (state.phase === 'finished') { store.setBest(netWorth(state)); store.clear(); }
    else if (state.phase !== 'start') store.save(state);
  }, [state]);

  const start = () => setState({ ...createInitialState(), phase: 'news' });
  const cont = () => { const s = store.load(); if (s) setState(s); };
  const toAllocate = () => setState((s) => ({ ...s, phase: 'allocate' }));
  const change = (id: string, delta: number) => setState((s) => {
    const next = Math.max(0, Math.min(100, (s.allocation[id as keyof typeof s.allocation] || 0) + delta));
    return { ...s, allocation: { ...s.allocation, [id]: next } };
  });
  const confirm = () => setState((s) => advanceYear(s));
  const next = () => setState((s) => (s.phase === 'finished' ? s : { ...s, phase: 'news' }));
  const restart = () => setState({ ...createInitialState(), phase: 'news' });

  return (
    <div class="sk">
      {state.phase === 'start' && <StartScreen hasSave={hasSave} onStart={start} onContinue={cont} />}
      {state.phase === 'news' && <NewsScreen year={currentYear(state)} onContinue={toAllocate} />}
      {state.phase === 'allocate' && <AllocateScreen state={state} onChange={change} onConfirm={confirm} />}
      {state.phase === 'results' && <ResultScreen state={state} onNext={next} />}
      {state.phase === 'finished' && (
        <div class="kf"><ResultScreen state={state} onNext={() => setState((s) => ({ ...s }))} /></div>
      )}
      {state.phase === 'finished' && <FinalScreen state={state} onRestart={restart} />}
    </div>
  );
}
```

> Note: simplify the `finished` branch to render only `<FinalScreen>` (drop the duplicated ResultScreen). The contract: after the last `advanceYear`, `phase === 'finished'` and `FinalScreen` shows. Adjust so results of the final year are visible inside FinalScreen or via a preceding results view.

- [ ] **Step 2: Typecheck & commit**

Run: `npx astro check 2>&1 | tail -8`
```bash
git add src/components/games/stonks/StonksGame.tsx
git commit -m "feat(stonks): root island state machine"
```

---

## Task 10: Route + GameShell + landing

**Files:**
- Create: `src/components/games/GameShell.astro`, `src/pages/juegos/stonks/index.astro`
- Modify: `src/pages/juegos/index.astro`

- [ ] **Step 1: `GameShell.astro`** (reusable)

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
interface Props { title: string; }
const { title } = Astro.props;
---
<BaseLayout title={title} description={`${title} — juego de profedeeconomia.es`}>
  <div class="game-shell">
    <a class="game-exit" href="/juegos/">← Volver a Juegos</a>
    <slot />
  </div>
</BaseLayout>
<style>
  .game-shell { max-width: 720px; margin: 0 auto; padding: 1rem clamp(1rem, 4vw, 2rem) 4rem; }
  .game-exit { display: inline-block; margin: 1rem 0; color: var(--color-ink-mute); text-decoration: none; font-size: .92rem; }
  .game-exit:hover { color: var(--color-terra); }
</style>
```

- [ ] **Step 2: Route**

```astro
---
// src/pages/juegos/stonks/index.astro
import GameShell from '@components/games/GameShell.astro';
import StonksGame from '@components/games/stonks/StonksGame.tsx';
---
<GameShell title="Stonks">
  <StonksGame client:load />
</GameShell>
```

- [ ] **Step 3: Surface stonks in the landing**

Modify `src/pages/juegos/index.astro`: replace the "pendiente de migración" lede with a card/list where **Stonks** links to `/juegos/stonks/` as available, and the rest remain "pendientes de migración". Keep Variant C styling already in that file.

- [ ] **Step 4: Build**

Run: `npm run build 2>&1 | tail -5`
Expected: build succeeds; `/juegos/stonks/index.html` generated.

- [ ] **Step 5: Commit**

```bash
git add src/components/games/GameShell.astro src/pages/juegos/stonks/index.astro src/pages/juegos/index.astro
git commit -m "feat(stonks): route, reusable GameShell, surface in /juegos landing"
```

---

## Task 11: Full verification + manual playtest

- [ ] **Step 1: Run the whole test suite**

Run: `npx vitest run 2>&1 | tail -5`
Expected: all previous tests (258) + the new stonks tests pass.

- [ ] **Step 2: Build**

Run: `npm run build 2>&1 | tail -5`
Expected: green.

- [ ] **Step 3: Manual playtest**

Run: `npm run dev` and open `/juegos/stonks/`. Verify: start → play several rounds (allocation must hit 100% to confirm) → assets unlock at the right rounds → results show returns + occasional event → finishing 25 rounds shows the final chart, verdict vs AI, and lessons. Reload mid-game → "Continuar" resumes. Confirm Variant C look, no emojis/gradients, mobile width works.

- [ ] **Step 4: Final commit (if any tweaks)**

```bash
git add -A && git commit -m "fix(stonks): playtest adjustments"
```

---

## Self-Review notes (author)

- **Spec coverage:** framework (Tasks 5,6,10) · engine/mechanics (3,4) · data faithful port (2) · 3 screens + start/news (8) · chart SVG (7) · persistence (5) · i18n ES-only (all strings es) · landing update (10) · tests/TDD (2-5) · Variant C (6,10) · multiplayer out of scope (not built). ✔
- **Deliberate stubs:** Task 8 Step 5 ships a stub then Step 5b the real `FinalScreen` (forces reading the contract). The `AllocateScreen` round-count note and the `StonksGame` finished-branch note must be applied as written.
- **Type consistency:** `GameState` fields used by screens (`allocation`, `holdings`, `lastReturns`, `lastEvent`, `history`, `ai.netWorth`, `phase`) all defined in Task 1. Engine exports (`createInitialState`, `advanceYear`, `currentYear`, `netWorth`, `unlockedAssets`, `allocationSum`, `isAllocationValid`, `isFinished`) match their usages. Storage API (`load/save/clear/getBest/setBest`) consistent across Tasks 5 and 9.
- **Path aliases (verified against tsconfig):** the repo defines `@/*`→`src/*`, `@components/*`, `@layouts/*`, `@assets/*`, `@content/*`. There is **no `@lib`**; `src/lib` is imported as `@/lib/...` (e.g. `@/lib/calc/ad-as`). The plan uses `@/lib/games/...`, `@components/...`, `@layouts/...` accordingly.
