# Stonks Replant — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn Stonks from a fixed 2000-2024 annual frictionless game into a 50-semester simulation inside a 25-year window drawn at random from 1971-2025, with date-gated assets, nine blind companies, trading friction, and purchasing power shown alongside nominal euros.

**Architecture:** All game logic stays pure and testable under `src/lib/games/stonks/`; `data.ts` becomes a `data/` folder so the number tables can be reviewed without opening the engine. A new `money.ts` owns the three things that are easy to get subtly wrong — commission tiers, progressive capital-gains tax, and the CPI deflator — so they are unit-tested in isolation. The Preact island keeps the existing `sk-phone` shell and gains three screens.

**Tech Stack:** Astro 5 · Preact islands · TypeScript strict (no `any`) · vitest · CSS scoped per component (Variant C palette)

**Spec:** `docs/superpowers/specs/2026-09-04-stonks-replanteig-design.md`

## Global Constraints

- **Worktree:** `C:\dev\profedeeconomia-stonks`, branch `feat/stonks-replanteig`, based on `origin/main`. Never commit to `main`. The sibling worktree `C:\dev\profedeeconomia` belongs to another session — do not touch its index, branch or files.
- **TypeScript strict. No `any`.** Code comments in English.
- **UI strings and educational content in Spanish (`es`)**; Valencian (`ca`) lives only in `src/i18n/games/stonks-ca.ts` as an overlay.
- **Conventional Commits**, English, one per task. End every commit message with `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.
- **Visual system is frozen.** Variant C palette (`#C44E2C` terracota, `#D4A24C` mostassa, `#1F6E6E` teal, ink `#2A1F18`, línia `#E5D4BD`). No gradients, no emoji as icons, no one-sided accent borders on boxes (`docs/design-system.md`).
- **Money invariant:** every euro figure held in state is **nominal euros of that semester**. Real values are derived at render time through `cpiIndex`, never stored deflated.
- **Data honesty:** `data/market.ts` and `data/inflation.ts` must carry the sources header described in spec §7 before any numbers. Rounded, unaudited, stated as such.
- Run the full suite with `npm test`. Run one file with `npx vitest run <path>`.

---

## File Structure

| File | Responsibility |
|---|---|
| `src/lib/games/stonks/types.ts` | All shared types. No logic. |
| `src/lib/games/stonks/money.ts` | Commission tiers, progressive capital-gains tax, average-cost sale, CPI deflator. |
| `src/lib/games/stonks/engine.ts` | Window draw, stock draw, semester advance, final liquidation, state machine helpers. |
| `src/lib/games/stonks/ai.ts` | «El Mercat» benchmark: DCA into the world index, never sells. |
| `src/lib/games/stonks/data/index.ts` | Constants + re-exports so `from '../data'` keeps working. |
| `src/lib/games/stonks/data/assets.ts` | 18-asset catalogue: availability dates, blind profiles, revealed names, death returns. |
| `src/lib/games/stonks/data/market.ts` | Annual returns 1971-2025 + documented intra-year overrides. |
| `src/lib/games/stonks/data/inflation.ts` | Spanish CPI 1971-2025. |
| `src/lib/games/stonks/data/news.ts` | 110 semester headlines. |
| `src/lib/games/stonks/data/cards.ts` | 28 deep explanation cards. |
| `src/lib/games/stonks/data/life-events.ts` | Life event table, amounts in start-year euros. |
| `src/components/games/stonks/StonksGame.tsx` | Island root, state machine, modal orchestration. |
| `src/components/games/stonks/WindowIntro.tsx` | **New.** Drawn window + period framing. |
| `src/components/games/stonks/AssetCardModal.tsx` | **New.** Deep card. |
| `src/components/games/stonks/RevealScreen.tsx` | **New.** Company name reveal. |
| `src/components/games/stonks/{Start,News,Allocate,Result,Final}Screen.tsx` | Existing, modified. |
| `src/components/games/stonks/EvolucionChart.tsx` | Existing; gains the real-terms series. |
| `src/i18n/games/stonks-ca.ts` | Valencian overlay. |

---

### Task 1: Types and the money module

The riskiest arithmetic in the game, isolated and tested before anything depends on it.

**Files:**
- Create: `src/lib/games/stonks/money.ts`
- Modify: `src/lib/games/stonks/types.ts` (full rewrite)
- Create: `src/lib/games/stonks/money.test.ts`
- Create: `src/lib/games/stonks/data/inflation.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `commissionRate(year: number): number`
  - `capitalGainsTax(netGain: number): number`
  - `sellFrom(p: Position, amount: number): { position: Position; realised: number }`
  - `cpiIndex(startYear: number, round: number): number` — round `0..50`, `cpiIndex(y, 0) === 1`
  - `toReal(nominal: number, index: number): number`
  - types `Half`, `Position`, `AssetId`, `BaseAssetId`, `StockId`, `Risk`, `AssetMeta`, `LifeEvent`, `SemesterNews`, `AssetCard`, `GameState`

- [ ] **Step 1: Write `types.ts`**

```ts
// src/lib/games/stonks/types.ts
export type BaseAssetId =
  | 'efectivo' | 'deposito' | 'deuda' | 'oro' | 'vivienda'
  | 'bolsa_es' | 'sp500' | 'mundial' | 'bitcoin';

export type StockId =
  | 'e_apple' | 'e_msft' | 'e_amzn' | 'e_nvda' | 'e_itx'
  | 'e_nokia' | 'e_terra' | 'e_enron' | 'e_popular';

export type AssetId = BaseAssetId | StockId;
export type Risk = 'baja' | 'media' | 'alta' | 'extrema';
export type Half = 0 | 1;
export type AssetGroup = 'seguro' | 'bolsa' | 'empresa';

/** A holding, tracked at average cost so realised gains can be computed on partial sales. */
export interface Position { value: number; cost: number; }

export interface AssetMeta {
  id: AssetId;
  label: string;          // es — row name. For stocks: the sector ('Semiconductores')
  profile?: string;       // es — stocks only: 'EE. UU. · sale a bolsa en 1999'
  realName?: string;      // stocks only: revealed on RevealScreen
  risk: Risk;
  group: AssetGroup;
  fromYear: number;
  fromHalf: Half;
  untilYear?: number;     // last semester the asset trades
  untilHalf?: Half;
  finalReturn?: number;   // return applied in the until-semester (-1 = wiped out)
}

/** amount is expressed in euros of the window's start year. */
export interface LifeEvent { id: string; text: string; amount: number; }

export interface SemesterNews { year: number; half: Half; text: string; }

/** id is an AssetId, 'clase_empresa', or `${StockId}_reveal`. */
export interface AssetCard { id: string; title: string; body: string[]; }

export interface GameState {
  startYear: number;                    // 1971..2001
  round: number;                        // 0..50 (50 = finished)
  stocks: StockId[];                    // the 5 companies drawn for this game
  seenCards: string[];                  // cards already shown
  holdings: Record<AssetId, Position>;  // includes `efectivo`; there is no separate cash field
  allocation: Record<AssetId, number>;  // integer % for the round in progress
  pendingGain: number;                  // gains realised by forced liquidation, taxed next semester
  totalCosts: number;                   // running total of commission + tax, for the closing lessons
  ai: Position;
  lastEvent: LifeEvent | null;
  lastReturns: Partial<Record<AssetId, number>> | null;
  lastCosts: { commission: number; tax: number; forced: boolean } | null;
  lastDeath: StockId | null;
  history: { year: number; half: Half; nominal: number; real: number; ai: number }[];
  phase: 'start' | 'intro' | 'news' | 'allocate' | 'results' | 'reveal' | 'finished';
}
```

- [ ] **Step 2: Write `data/inflation.ts` with its sources header**

Spanish annual CPI, 1971-2025, as fractions (`0.145` = 14.5 %). Every year in the range must be present — the deflator throws on a gap. Header must state: source of reference (INE, índice general de precios de consumo, media anual), that figures are rounded to one decimal, and that pre-1977 values are the retrospective series.

```ts
// src/lib/games/stonks/data/inflation.ts
/**
 * Spanish annual CPI (IPC general, media anual), 1971-2025, as fractions.
 *
 * SOURCE OF REFERENCE: INE, índice de precios de consumo, variación media anual.
 * Values are ROUNDED TO ONE DECIMAL and NOT audited against the INE series —
 * see spec §7. Replacing this file with a verified CSV must not require any
 * change to engine.ts or money.ts.
 */
export const CPI: Record<number, number> = {
  1971: 0.081, 1972: 0.082, 1973: 0.117, 1974: 0.156, 1975: 0.170,
  // … through 2025. No gaps.
};
export const CPI_FIRST_YEAR = 1971;
export const CPI_LAST_YEAR = 2025;
```

- [ ] **Step 3: Write the failing tests**

```ts
// src/lib/games/stonks/money.test.ts
import { describe, it, expect } from 'vitest';
import { commissionRate, capitalGainsTax, sellFrom, cpiIndex, toReal } from './money';
import { CPI, CPI_FIRST_YEAR, CPI_LAST_YEAR } from './data/inflation';

describe('CPI table', () => {
  it('covers every year from 1971 to 2025 with no gaps', () => {
    for (let y = CPI_FIRST_YEAR; y <= CPI_LAST_YEAR; y++) {
      expect(CPI[y], `CPI ${y}`).toBeTypeOf('number');
    }
  });
});

describe('commissionRate', () => {
  it('charges 1% up to 1990, 0.5% to 2010, 0.2% after', () => {
    expect(commissionRate(1971)).toBeCloseTo(0.010);
    expect(commissionRate(1990)).toBeCloseTo(0.010);
    expect(commissionRate(1991)).toBeCloseTo(0.005);
    expect(commissionRate(2010)).toBeCloseTo(0.005);
    expect(commissionRate(2011)).toBeCloseTo(0.002);
    expect(commissionRate(2025)).toBeCloseTo(0.002);
  });
});

describe('capitalGainsTax', () => {
  it('is zero for a loss or a zero gain', () => {
    expect(capitalGainsTax(-500)).toBe(0);
    expect(capitalGainsTax(0)).toBe(0);
  });
  it('applies 19% inside the first bracket', () => {
    expect(capitalGainsTax(6000)).toBeCloseTo(1140, 2);   // 6000 * 0.19
  });
  it('is progressive, not a cliff', () => {
    // 6000*0.19 + 44000*0.21 = 1140 + 9240
    expect(capitalGainsTax(50000)).toBeCloseTo(10380, 2);
    // + 50000*0.23 = 11500
    expect(capitalGainsTax(100000)).toBeCloseTo(21880, 2);
  });
});

describe('sellFrom', () => {
  it('realises gain proportionally at average cost', () => {
    const p = { value: 2000, cost: 1000 };          // 100% latent gain
    const { position, realised } = sellFrom(p, 500);
    expect(realised).toBeCloseTo(250, 6);            // half of the 500 sold is gain
    expect(position.value).toBeCloseTo(1500, 6);
    expect(position.cost).toBeCloseTo(750, 6);
  });
  it('realises a loss when the position is under water', () => {
    const { realised } = sellFrom({ value: 500, cost: 1000 }, 500);
    expect(realised).toBeCloseTo(-500, 6);
  });
  it('is a no-op on an empty position', () => {
    const { position, realised } = sellFrom({ value: 0, cost: 0 }, 100);
    expect(realised).toBe(0);
    expect(position).toEqual({ value: 0, cost: 0 });
  });
  it('never sells more than the position holds', () => {
    const { position } = sellFrom({ value: 100, cost: 100 }, 999);
    expect(position.value).toBe(0);
    expect(position.cost).toBe(0);
  });
});

describe('cpiIndex', () => {
  it('is exactly 1 at the start of the window', () => {
    expect(cpiIndex(1980, 0)).toBe(1);
  });
  it('compounds half a year per semester', () => {
    const oneYear = cpiIndex(1980, 2);
    expect(oneYear).toBeCloseTo(1 + CPI[1980], 6);
    expect(cpiIndex(1980, 1)).toBeCloseTo(Math.sqrt(1 + CPI[1980]), 6);
  });
  it('is monotonically non-decreasing across the whole window', () => {
    for (let r = 1; r <= 50; r++) {
      expect(cpiIndex(1971, r)).toBeGreaterThanOrEqual(cpiIndex(1971, r - 1));
    }
  });
  it('deflates nominal euros into start-year purchasing power', () => {
    expect(toReal(1000, 2)).toBeCloseTo(500, 6);
  });
});
```

- [ ] **Step 4: Run the tests and confirm they fail**

Run: `npx vitest run src/lib/games/stonks/money.test.ts`
Expected: FAIL — `Failed to resolve import "./money"`.

- [ ] **Step 5: Implement `money.ts`**

```ts
// src/lib/games/stonks/money.ts
import type { Half, Position } from './types';
import { CPI } from './data/inflation';

/** Retail brokerage cost fell by an order of magnitude over the period; that is itself history. */
const COMMISSION_TIERS: { untilYear: number; rate: number }[] = [
  { untilYear: 1990, rate: 0.010 },
  { untilYear: 2010, rate: 0.005 },
  { untilYear: Infinity, rate: 0.002 },
];

export function commissionRate(year: number): number {
  return COMMISSION_TIERS.find((t) => year <= t.untilYear)!.rate;
}

/** Spanish savings-base brackets. Progressive: each slice is taxed at its own rate. */
const GAINS_BRACKETS: { upTo: number; rate: number }[] = [
  { upTo: 6000, rate: 0.19 },
  { upTo: 50000, rate: 0.21 },
  { upTo: Infinity, rate: 0.23 },
];

export function capitalGainsTax(netGain: number): number {
  if (netGain <= 0) return 0;
  let remaining = netGain;
  let previous = 0;
  let tax = 0;
  for (const b of GAINS_BRACKETS) {
    const slice = Math.min(remaining, b.upTo - previous);
    tax += slice * b.rate;
    remaining -= slice;
    previous = b.upTo;
    if (remaining <= 0) break;
  }
  return tax;
}

/**
 * Sell `amount` € out of a position, average-cost basis.
 * Spanish law is FIFO for shares; average cost is a documented simplification
 * (spec §8.1) that avoids tracking lots and does not change the lesson.
 */
export function sellFrom(p: Position, amount: number): { position: Position; realised: number } {
  if (p.value <= 0 || amount <= 0) return { position: p, realised: 0 };
  const sold = Math.min(amount, p.value);
  const share = sold / p.value;
  const costSold = p.cost * share;
  return {
    position: { value: p.value - sold, cost: p.cost - costSold },
    realised: sold - costSold,
  };
}

/**
 * Cumulative price index at the START of semester `round`, anchored so that
 * cpiIndex(startYear, 0) === 1. Inflation is split geometrically within a year.
 */
export function cpiIndex(startYear: number, round: number): number {
  const years = Math.floor(round / 2);
  const half = (round % 2) as Half;
  let index = 1;
  for (let y = startYear; y < startYear + years; y++) {
    index *= 1 + rate(y);
  }
  if (half === 1) index *= Math.sqrt(1 + rate(startYear + years));
  return index;
}

function rate(year: number): number {
  const r = CPI[year];
  if (r === undefined) throw new Error(`No CPI data for ${year}`);
  return r;
}

/** Nominal euros → purchasing power of the window's start year. */
export const toReal = (nominal: number, index: number): number => nominal / index;
```

- [ ] **Step 6: Run the tests and confirm they pass**

Run: `npx vitest run src/lib/games/stonks/money.test.ts`
Expected: PASS, all cases.

- [ ] **Step 7: Commit**

```bash
git add src/lib/games/stonks/types.ts src/lib/games/stonks/money.ts \
        src/lib/games/stonks/money.test.ts src/lib/games/stonks/data/inflation.ts
git commit -m "feat(stonks): commission tiers, progressive gains tax and CPI deflator

The three pieces of arithmetic the rest of the replant leans on, isolated
and tested before anything imports them. Capital gains are progressive per
slice rather than a single rate chosen by total, and the deflator is
anchored so index(startYear) is exactly 1.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 2: Asset catalogue

**Files:**
- Create: `src/lib/games/stonks/data/assets.ts`
- Create: `src/lib/games/stonks/data/assets.test.ts`

**Interfaces:**
- Consumes: `AssetMeta`, `AssetId`, `StockId` from Task 1.
- Produces: `ASSETS: AssetMeta[]`, `ASSET_IDS: AssetId[]`, `STOCK_IDS: StockId[]`, `STAR_STOCKS: StockId[]`, `DOOMED_STOCKS: StockId[]`, `assetMeta: Record<AssetId, AssetMeta>`, `isAvailable(a: AssetMeta, year: number, half: Half): boolean`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/games/stonks/data/assets.test.ts
import { describe, it, expect } from 'vitest';
import { ASSETS, ASSET_IDS, STOCK_IDS, STAR_STOCKS, DOOMED_STOCKS, assetMeta, isAvailable } from './assets';

describe('asset catalogue', () => {
  it('holds 18 assets: 9 base and 9 companies', () => {
    expect(ASSETS).toHaveLength(18);
    expect(STOCK_IDS).toHaveLength(9);
    expect(ASSETS.filter((a) => a.group !== 'empresa')).toHaveLength(9);
  });

  it('has unique ids', () => {
    expect(new Set(ASSET_IDS).size).toBe(ASSET_IDS.length);
  });

  it('gives every company a blind profile and a real name', () => {
    for (const id of STOCK_IDS) {
      const a = assetMeta[id];
      expect(a.profile, `profile ${id}`).toBeTruthy();
      expect(a.realName, `realName ${id}`).toBeTruthy();
      expect(a.group).toBe('empresa');
    }
  });

  it('never leaks a real company name into the labels shown during play', () => {
    for (const id of STOCK_IDS) {
      const a = assetMeta[id];
      const shown = `${a.label} ${a.profile}`.toLowerCase();
      expect(shown, `blind label ${id}`).not.toContain(a.realName!.toLowerCase());
    }
  });

  it('gives every doomed company an end date and a final return', () => {
    for (const id of DOOMED_STOCKS) {
      const a = assetMeta[id];
      expect(a.untilYear, `untilYear ${id}`).toBeTypeOf('number');
      expect(a.finalReturn, `finalReturn ${id}`).toBeTypeOf('number');
      expect(a.finalReturn!).toBeLessThan(0);
      expect(a.finalReturn!).toBeGreaterThanOrEqual(-1);
    }
  });

  it('wipes out Enron and Banco Popular but not Terra, which was absorbed', () => {
    expect(assetMeta.e_enron.finalReturn).toBe(-1);
    expect(assetMeta.e_popular.finalReturn).toBe(-1);
    expect(assetMeta.e_terra.finalReturn).toBeGreaterThan(-1);
    expect(assetMeta.e_terra.finalReturn).toBeLessThan(-0.8);
  });

  it('keeps stars and doomed companies disjoint', () => {
    expect(STAR_STOCKS.filter((s) => DOOMED_STOCKS.includes(s))).toEqual([]);
  });

  it('makes the eight core assets available from the first semester of 1971', () => {
    const core = ASSETS.filter((a) => a.group !== 'empresa' && a.id !== 'bitcoin');
    expect(core).toHaveLength(8);
    for (const a of core) expect(isAvailable(a, 1971, 0)).toBe(true);
  });

  it('gates bitcoin to 2011 and Nvidia to 1999', () => {
    expect(isAvailable(assetMeta.bitcoin, 2010, 1)).toBe(false);
    expect(isAvailable(assetMeta.bitcoin, 2011, 0)).toBe(true);
    expect(isAvailable(assetMeta.e_nvda, 1998, 1)).toBe(false);
    expect(isAvailable(assetMeta.e_nvda, 1999, 0)).toBe(true);
  });

  it('keeps a doomed company available through its final semester and no further', () => {
    expect(isAvailable(assetMeta.e_enron, 2001, 1)).toBe(true);
    expect(isAvailable(assetMeta.e_enron, 2002, 0)).toBe(false);
  });
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npx vitest run src/lib/games/stonks/data/assets.test.ts`
Expected: FAIL — cannot resolve `./assets`.

- [ ] **Step 3: Implement `data/assets.ts`**

Exact table from spec §6. `label` is what the row shows; for companies it is the sector alone, and `profile` carries country and listing year.

```ts
// src/lib/games/stonks/data/assets.ts
import type { AssetMeta, AssetId, StockId, Half } from '../types';

export const ASSETS: AssetMeta[] = [
  { id: 'efectivo', label: 'Efectivo',                  risk: 'baja',    group: 'seguro', fromYear: 1971, fromHalf: 0 },
  { id: 'deposito', label: 'Depósito a plazo',          risk: 'baja',    group: 'seguro', fromYear: 1971, fromHalf: 0 },
  { id: 'deuda',    label: 'Deuda pública española',    risk: 'baja',    group: 'seguro', fromYear: 1971, fromHalf: 0 },
  { id: 'oro',      label: 'Oro',                       risk: 'media',   group: 'seguro', fromYear: 1971, fromHalf: 0 },
  { id: 'vivienda', label: 'Vivienda en España',        risk: 'media',   group: 'seguro', fromYear: 1971, fromHalf: 0 },
  { id: 'bolsa_es', label: 'Bolsa española',            risk: 'alta',    group: 'bolsa',  fromYear: 1971, fromHalf: 0 },
  { id: 'sp500',    label: 'Bolsa de EE. UU.',          risk: 'alta',    group: 'bolsa',  fromYear: 1971, fromHalf: 0 },
  { id: 'mundial',  label: 'Bolsa mundial',             risk: 'alta',    group: 'bolsa',  fromYear: 1971, fromHalf: 0 },
  { id: 'bitcoin',  label: 'Criptomoneda',              risk: 'extrema', group: 'bolsa',  fromYear: 2011, fromHalf: 0 },

  { id: 'e_apple',   label: 'Electrónica de consumo', profile: 'EE. UU. · sale a bolsa en 1980',  realName: 'Apple',         risk: 'extrema', group: 'empresa', fromYear: 1981, fromHalf: 0 },
  { id: 'e_msft',    label: 'Software',               profile: 'EE. UU. · sale a bolsa en 1986',  realName: 'Microsoft',     risk: 'extrema', group: 'empresa', fromYear: 1986, fromHalf: 1 },
  { id: 'e_amzn',    label: 'Comercio electrónico',   profile: 'EE. UU. · sale a bolsa en 1997',  realName: 'Amazon',        risk: 'extrema', group: 'empresa', fromYear: 1997, fromHalf: 1 },
  { id: 'e_nvda',    label: 'Semiconductores',        profile: 'EE. UU. · sale a bolsa en 1999',  realName: 'Nvidia',        risk: 'extrema', group: 'empresa', fromYear: 1999, fromHalf: 0 },
  { id: 'e_itx',     label: 'Textil',                 profile: 'España · sale a bolsa en 2001',   realName: 'Inditex',       risk: 'extrema', group: 'empresa', fromYear: 2001, fromHalf: 1 },
  { id: 'e_nokia',   label: 'Telefonía móvil',        profile: 'Finlandia · cotiza desde 1994',   realName: 'Nokia',         risk: 'extrema', group: 'empresa', fromYear: 1994, fromHalf: 0 },
  { id: 'e_terra',   label: 'Portal de internet',     profile: 'España · sale a bolsa en 1999',   realName: 'Terra',         risk: 'extrema', group: 'empresa', fromYear: 1999, fromHalf: 1, untilYear: 2005, untilHalf: 1, finalReturn: -0.92 },
  { id: 'e_enron',   label: 'Energía',                profile: 'EE. UU. · cotiza desde 1986',     realName: 'Enron',         risk: 'extrema', group: 'empresa', fromYear: 1986, fromHalf: 0, untilYear: 2001, untilHalf: 1, finalReturn: -1 },
  { id: 'e_popular', label: 'Banca',                  profile: 'España · cotiza desde 1971',      realName: 'Banco Popular', risk: 'extrema', group: 'empresa', fromYear: 1971, fromHalf: 0, untilYear: 2017, untilHalf: 0, finalReturn: -1 },
];

export const ASSET_IDS = ASSETS.map((a) => a.id);
export const assetMeta = Object.fromEntries(ASSETS.map((a) => [a.id, a])) as Record<AssetId, AssetMeta>;
export const STOCK_IDS = ASSETS.filter((a) => a.group === 'empresa').map((a) => a.id) as StockId[];

/** Companies that made their holders rich; the draw guarantees at least one. */
export const STAR_STOCKS: StockId[] = ['e_apple', 'e_msft', 'e_amzn', 'e_nvda', 'e_itx'];
/** Companies that ended in a wipe-out or a near-total loss. */
export const DOOMED_STOCKS: StockId[] = ['e_terra', 'e_enron', 'e_popular'];

const rank = (year: number, half: Half | number): number => year * 2 + half;

export function isAvailable(a: AssetMeta, year: number, half: Half): boolean {
  const now = rank(year, half);
  if (now < rank(a.fromYear, a.fromHalf)) return false;
  if (a.untilYear !== undefined) return now <= rank(a.untilYear, a.untilHalf ?? 1);
  return true;
}
```

- [ ] **Step 4: Run the test and confirm it passes**

Run: `npx vitest run src/lib/games/stonks/data/assets.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/games/stonks/data/assets.ts src/lib/games/stonks/data/assets.test.ts
git commit -m "feat(stonks): 18-asset catalogue gated by real dates

Availability is now keyed to the semester an asset actually existed rather
than to a round index, so bitcoin cannot appear in 1984. Companies carry a
blind profile for play and a real name for the reveal; a test asserts the
name never leaks into what the board shows.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 3: Market data and the semester split

The invariant test here is what protects the data's credibility: no intra-year shape may change an annual figure.

**Files:**
- Create: `src/lib/games/stonks/data/market.ts`
- Create: `src/lib/games/stonks/data/market.test.ts`

**Interfaces:**
- Consumes: `AssetId`, `Half` from Task 1; `ASSETS`, `isAvailable`, `assetMeta` from Task 2.
- Produces: `ANNUAL: Record<number, Partial<Record<AssetId, number>>>`, `HALVES: Record<number, Partial<Record<AssetId, [number, number]>>>`, `semesterReturn(id: AssetId, year: number, half: Half): number | null`, `MARKET_FIRST_YEAR`, `MARKET_LAST_YEAR`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/games/stonks/data/market.test.ts
import { describe, it, expect } from 'vitest';
import { ANNUAL, HALVES, semesterReturn, MARKET_FIRST_YEAR, MARKET_LAST_YEAR } from './market';
import { ASSETS, assetMeta, isAvailable } from './assets';

describe('market data coverage', () => {
  it('spans 1971 to 2025 with no missing year', () => {
    expect(MARKET_FIRST_YEAR).toBe(1971);
    expect(MARKET_LAST_YEAR).toBe(2025);
    for (let y = 1971; y <= 2025; y++) expect(ANNUAL[y], `year ${y}`).toBeDefined();
  });

  it('gives a return for every asset in every year it was available', () => {
    for (let y = 1971; y <= 2025; y++) {
      for (const a of ASSETS) {
        if (a.id === 'efectivo') continue;              // efectivo is always 0 by definition
        if (!isAvailable(a, y, 0) && !isAvailable(a, y, 1)) continue;
        expect(ANNUAL[y][a.id], `${a.id} ${y}`).toBeTypeOf('number');
      }
    }
  });

  it('reports null for an asset that did not exist that semester', () => {
    expect(semesterReturn('bitcoin', 1984, 0)).toBeNull();
    expect(semesterReturn('e_enron', 2002, 0)).toBeNull();
  });
});

describe('semester split', () => {
  it('splits geometrically by default', () => {
    const annual = ANNUAL[1995].sp500!;
    const h = semesterReturn('sp500', 1995, 0)!;
    expect(h).toBeCloseTo(Math.sqrt(1 + annual) - 1, 10);
  });

  // THE invariant that protects the data's honesty (spec §7).
  it('never lets an intra-year shape change the annual figure', () => {
    for (const yearKey of Object.keys(HALVES)) {
      const y = Number(yearKey);
      for (const [id, pair] of Object.entries(HALVES[y])) {
        const annual = ANNUAL[y][id as never];
        expect(annual, `${id} ${y} has halves but no annual`).toBeTypeOf('number');
        const [h1, h2] = pair as [number, number];
        expect((1 + h1) * (1 + h2), `${id} ${y}`).toBeCloseTo(1 + (annual as number), 6);
      }
    }
  });

  it('holds the invariant for every asset and every year, shaped or not', () => {
    for (let y = 1971; y <= 2025; y++) {
      for (const a of ASSETS) {
        const h1 = semesterReturn(a.id, y, 0);
        const h2 = semesterReturn(a.id, y, 1);
        if (h1 === null || h2 === null) continue;
        expect((1 + h1) * (1 + h2), `${a.id} ${y}`).toBeCloseTo(1 + ANNUAL[y][a.id]!, 6);
      }
    }
  });

  it('puts the 2020 crash in the first half, not spread evenly', () => {
    const h1 = semesterReturn('sp500', 2020, 0)!;
    const h2 = semesterReturn('sp500', 2020, 1)!;
    expect(h1).toBeLessThan(0);
    expect(h2).toBeGreaterThan(0);
  });

  it('applies the final return in a doomed company last semester', () => {
    const a = assetMeta.e_enron;
    expect(semesterReturn('e_enron', a.untilYear!, a.untilHalf!)).toBe(a.finalReturn);
  });
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npx vitest run src/lib/games/stonks/data/market.test.ts`
Expected: FAIL — cannot resolve `./market`.

- [ ] **Step 3: Write the sources header and the `ANNUAL` table**

This is a bulk-data step, not a logic step. The acceptance criterion is the test above, which is exhaustive: every asset × every available year must carry a number, and the invariant must hold everywhere. Write the header first, then fill the table year by year.

```ts
// src/lib/games/stonks/data/market.ts
/**
 * Annual total returns 1971-2025, as fractions (0.15 = +15 %).
 *
 * HOW TO READ THIS FILE — and its limits (spec §7):
 *   · All series are IN EUROS (pesetas converted at 166,386), WITHOUT currency
 *     hedging. A Spanish investor holding US equities really did carry the
 *     dollar's swings, and the game should not hide that.
 *   · Equity and property series are TOTAL RETURN (dividends / rents
 *     reinvested); gold and bitcoin are price only; deposits and public debt
 *     are the nominal yield of the period.
 *   · Reference series: bolsa_es = Índice General de la Bolsa de Madrid to
 *     1991, IBEX 35 with dividends from 1992. sp500 = S&P 500 TR.
 *     mundial = MSCI World TR. deuda = Spanish 10-year bond.
 *     vivienda = average dwelling price, Ministerio de Vivienda / INE.
 *   · FIGURES ARE ROUNDED AND NOT AUDITED against a primary source. They are
 *     historically faithful in direction and rough magnitude, which is what
 *     the lesson needs; they are not investment data. Replacing this file
 *     with a verified CSV must not require touching engine.ts.
 */
import type { AssetId, Half } from '../types';
import { assetMeta } from './assets';

export const MARKET_FIRST_YEAR = 1971;
export const MARKET_LAST_YEAR = 2025;

export const ANNUAL: Record<number, Partial<Record<AssetId, number>>> = {
  1971: { deposito: 0.060, deuda: 0.075, oro: 0.150, vivienda: 0.090, bolsa_es: 0.120, sp500: 0.104, mundial: 0.170, e_popular: 0.110 },
  // … every year through 2025.
};
```

`efectivo` is deliberately absent from `ANNUAL`: `semesterReturn` returns `0` for it. That is the point of holding cash.

- [ ] **Step 4: Write the `HALVES` overrides for the six documented periods**

Only the years in spec §7.1: 1973, 1974, 1987, 2000, 2008, 2020, 2022. Each pair must satisfy `(1+h1)(1+h2) = 1+annual` — compute the second half from the first so the invariant holds by construction.

```ts
/**
 * Intra-year shape for the years where WHEN it happened is the lesson.
 * Each pair must reproduce its ANNUAL figure exactly — enforced by
 * market.test.ts. Derive h2 from h1: h2 = (1+annual)/(1+h1) - 1.
 */
export const HALVES: Record<number, Partial<Record<AssetId, [number, number]>>> = {
  2020: {
    // Covid: -34 % peak to trough in March, then a V. An even split would erase the crash.
    sp500:   [-0.0400, 0.2333],
    mundial: [-0.0620, 0.2050],
    // … remaining shaped assets for 2020
  },
  // … 1973, 1974, 1987, 2000, 2008, 2022
};
```

- [ ] **Step 5: Implement `semesterReturn`**

```ts
const HALF_SPLIT = (annual: number): [number, number] => {
  const h = Math.sqrt(1 + annual) - 1;
  return [h, h];
};

/** Return for one semester. null = the asset did not trade then. */
export function semesterReturn(id: AssetId, year: number, half: Half): number | null {
  const meta = assetMeta[id];
  if (!meta) return null;
  if (id === 'efectivo') return 0;

  const rank = (y: number, h: number) => y * 2 + h;
  if (rank(year, half) < rank(meta.fromYear, meta.fromHalf)) return null;
  if (meta.untilYear !== undefined) {
    const last = rank(meta.untilYear, meta.untilHalf ?? 1);
    if (rank(year, half) > last) return null;
    // The company's last semester is its wipe-out, whatever the market did.
    if (rank(year, half) === last) return meta.finalReturn ?? null;
  }

  const annual = ANNUAL[year]?.[id];
  if (annual === undefined) return null;
  const shaped = HALVES[year]?.[id];
  return shaped ? shaped[half] : HALF_SPLIT(annual)[half];
}
```

- [ ] **Step 6: Run the tests and confirm they pass**

Run: `npx vitest run src/lib/games/stonks/data/market.test.ts`
Expected: PASS. If the invariant test fails on a shaped year, the fix is always to recompute `h2` from `h1` and the annual figure — never to loosen the tolerance.

- [ ] **Step 7: Commit**

```bash
git add src/lib/games/stonks/data/market.ts src/lib/games/stonks/data/market.test.ts
git commit -m "feat(stonks): annual returns 1971-2025 with documented semester split

Semesters are geometric halves by default. Seven years where the intra-year
shape is the lesson (1973, 1974, 1987, 2000, 2008, 2020, 2022) carry explicit
halves, and a test asserts that no shape can change its annual figure — the
invariant the data's credibility rests on.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 4: Window and company draw

**Files:**
- Modify: `src/lib/games/stonks/engine.ts` (full rewrite starts here)
- Create: `src/lib/games/stonks/data/index.ts`
- Create: `src/lib/games/stonks/data/life-events.ts`
- Create: `src/lib/games/stonks/engine.test.ts` (replaces the existing file)
- Delete: `src/lib/games/stonks/data.ts`, `src/lib/games/stonks/data.test.ts` — **ask Pau before deleting; if he prefers, leave them and remove in a later cleanup commit.**

**Interfaces:**
- Consumes: Tasks 1-3.
- Produces: `WINDOW_YEARS = 25`, `TOTAL_ROUNDS = 50`, `FIRST_START_YEAR = 1971`, `LAST_START_YEAR = 2001`, `drawWindow(rng): number`, `drawStocks(startYear, rng): StockId[]`, `createInitialState(rng?): GameState`, `currentYear(s)`, `currentHalf(s)`, `availableAssets(s): AssetMeta[]`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/games/stonks/engine.test.ts
import { describe, it, expect } from 'vitest';
import { drawWindow, drawStocks, createInitialState, currentYear, currentHalf,
         availableAssets, FIRST_START_YEAR, LAST_START_YEAR, WINDOW_YEARS, TOTAL_ROUNDS } from './engine';
import { STAR_STOCKS, DOOMED_STOCKS, assetMeta } from './data/assets';
import type { GameState } from './types';

/** Deterministic RNG: replays the given sequence, then repeats the last value. */
const seq = (values: number[]) => {
  let i = 0;
  return () => values[Math.min(i++, values.length - 1)];
};

describe('drawWindow', () => {
  it('always yields a 25-year window ending in 2025 or earlier', () => {
    for (let i = 0; i < 200; i++) {
      const y = drawWindow(Math.random);
      expect(y).toBeGreaterThanOrEqual(FIRST_START_YEAR);
      expect(y).toBeLessThanOrEqual(LAST_START_YEAR);
      expect(y + WINDOW_YEARS - 1).toBeLessThanOrEqual(2025);
    }
  });
  it('reaches both ends of the range', () => {
    expect(drawWindow(seq([0]))).toBe(FIRST_START_YEAR);
    expect(drawWindow(seq([0.9999]))).toBe(LAST_START_YEAR);
  });
});

describe('drawStocks', () => {
  it('draws five companies without repeats', () => {
    for (let i = 0; i < 100; i++) {
      const picked = drawStocks(2001, Math.random);
      expect(picked).toHaveLength(5);
      expect(new Set(picked).size).toBe(5);
    }
  });

  it('only draws companies that trade inside the window', () => {
    for (let i = 0; i < 100; i++) {
      const start = drawWindow(Math.random);
      for (const id of drawStocks(start, Math.random)) {
        expect(assetMeta[id].fromYear, `${id} in ${start}`).toBeLessThanOrEqual(start + WINDOW_YEARS - 1);
      }
    }
  });

  it('always includes a star when one is reachable', () => {
    for (let i = 0; i < 100; i++) {
      const picked = drawStocks(1990, Math.random);
      expect(picked.some((s) => STAR_STOCKS.includes(s))).toBe(true);
    }
  });

  it('includes a company that actually dies during the window when one exists', () => {
    // 1995-2019 contains the deaths of Terra (2005) and Banco Popular (2017).
    for (let i = 0; i < 100; i++) {
      const picked = drawStocks(1995, Math.random);
      const dies = picked.some((s) => {
        const u = assetMeta[s].untilYear;
        return u !== undefined && u >= 1995 && u <= 2019;
      });
      expect(dies).toBe(true);
    }
  });

  it('does not force a death when none can happen in the window', () => {
    // 1971-1995: nobody dies. The guarantee must decay, not throw or loop.
    const picked = drawStocks(1971, Math.random);
    expect(picked.length).toBeGreaterThan(0);
    expect(picked.length).toBeLessThanOrEqual(5);
  });

  it('returns every candidate when fewer than five are reachable', () => {
    const picked = drawStocks(1971, Math.random);   // apple, msft, nokia, enron, popular
    expect(picked).toHaveLength(5);
  });
});

describe('createInitialState', () => {
  it('starts at round 0 with the whole initial capital in cash', () => {
    const s = createInitialState(Math.random);
    expect(s.round).toBe(0);
    expect(s.phase).toBe('start');
    expect(s.holdings.efectivo.value).toBeGreaterThan(0);
    expect(s.holdings.efectivo.cost).toBe(s.holdings.efectivo.value);
    expect(s.history).toEqual([]);
    expect(s.pendingGain).toBe(0);
    expect(s.totalCosts).toBe(0);
  });

  it('maps rounds onto years and halves', () => {
    const s = { ...createInitialState(Math.random), startYear: 1980 };
    expect(currentYear({ ...s, round: 0 })).toBe(1980);
    expect(currentHalf({ ...s, round: 0 })).toBe(0);
    expect(currentHalf({ ...s, round: 1 })).toBe(1);
    expect(currentYear({ ...s, round: 2 })).toBe(1981);
    expect(currentYear({ ...s, round: TOTAL_ROUNDS - 1 })).toBe(2004);
  });
});

describe('availableAssets', () => {
  it('never offers a company that was not drawn for this game', () => {
    const s = { ...createInitialState(Math.random), startYear: 2001, round: 40 };
    const offered = availableAssets(s).map((a) => a.id);
    for (const id of offered) {
      if (assetMeta[id].group === 'empresa') expect(s.stocks).toContain(id);
    }
  });
  it('drops a company from the board after it dies', () => {
    const base = createInitialState(Math.random);
    const s = { ...base, startYear: 2000, stocks: ['e_enron' as const], round: 4 }; // 2002 H1
    expect(availableAssets(s).map((a) => a.id)).not.toContain('e_enron');
  });
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npx vitest run src/lib/games/stonks/engine.test.ts`
Expected: FAIL — the named exports do not exist.

- [ ] **Step 3: Write `data/life-events.ts` and `data/index.ts`**

```ts
// src/lib/games/stonks/data/life-events.ts
import type { LifeEvent } from '../types';

/** Amounts are in euros of the window's START YEAR; the engine inflates them. */
export const LIFE_EVENTS: LifeEvent[] = [
  { id: 'coche',      text: 'Avería del coche.',                   amount: -1500 },
  { id: 'medico',     text: 'Gasto médico inesperado.',            amount: -3000 },
  { id: 'multa',      text: 'Multa de tráfico.',                   amount:  -400 },
  { id: 'electrodom', text: 'Avería de electrodomésticos.',        amount:  -800 },
  { id: 'reforma',    text: 'Reparación en casa.',                 amount: -2500 },
  { id: 'dental',     text: 'Gasto dental imprevisto.',            amount: -1000 },
  { id: 'viaje',      text: 'Viaje inesperado.',                   amount: -1800 },
  { id: 'paga',       text: 'Paga extra de Navidad.',              amount:  2000 },
  { id: 'herencia',   text: 'Herencia familiar.',                  amount:  8000 },
  { id: 'loteria',    text: '¡Premio de lotería!',                 amount:  5000 },
  { id: 'devolucion', text: 'Devolución de Hacienda.',             amount:  1200 },
  { id: 'premio',     text: 'Premio por objetivos en el trabajo.', amount:  3000 },
  { id: 'cumple',     text: 'Regalo de cumpleaños.',               amount:   500 },
  { id: 'ropausada',  text: 'Venta de ropa usada.',                amount:   300 },
];

export const LIFE_EVENT_CHANCE = 0.2;   // per semester; 0.3 would fire 15 times in 50 rounds
```

```ts
// src/lib/games/stonks/data/index.ts
export * from './assets';
export * from './market';
export * from './inflation';
export * from './news';
export * from './cards';
export * from './life-events';

/** Both in euros of the window's start year; the engine inflates them. */
export const INITIAL_CASH = 5000;
export const INCOME_PER_SEMESTER = 3000;
export const ALLOCATION_STEP = 5;
export const ALLOCATION_MAX = 100;
export const INDEX_ASSET = 'mundial' as const;
```

Task 4 does not yet create `news.ts` or `cards.ts` — add those two `export *` lines in Task 8 and Task 9 respectively, so the build stays green.

- [ ] **Step 4: Implement the draw and state constructors in `engine.ts`**

```ts
// src/lib/games/stonks/engine.ts
import type { AssetId, AssetMeta, GameState, Half, StockId } from './types';
import { ASSETS, ASSET_IDS, assetMeta, isAvailable, STAR_STOCKS,
         INITIAL_CASH } from './data';

export const WINDOW_YEARS = 25;
export const TOTAL_ROUNDS = WINDOW_YEARS * 2;
export const FIRST_START_YEAR = 1971;
export const LAST_START_YEAR = 2025 - WINDOW_YEARS + 1;   // 2001
export const STOCKS_PER_GAME = 5;

export const currentYear = (s: GameState): number =>
  s.startYear + Math.floor(Math.min(s.round, TOTAL_ROUNDS - 1) / 2);
export const currentHalf = (s: GameState): Half =>
  (Math.min(s.round, TOTAL_ROUNDS - 1) % 2) as Half;

const pick = <T,>(xs: T[], rng: () => number): T => xs[Math.floor(rng() * xs.length) % xs.length];

export function drawWindow(rng: () => number): number {
  const span = LAST_START_YEAR - FIRST_START_YEAR + 1;
  return FIRST_START_YEAR + Math.min(Math.floor(rng() * span), span - 1);
}

/**
 * Five companies, drawn from those that trade inside the window.
 * Guarantees, in priority order: one that actually DIES inside the window
 * (spec §6.2 — a doomed company whose collapse falls outside the window
 * teaches nothing), then one star. Both guarantees decay silently when the
 * window makes them impossible.
 */
export function drawStocks(startYear: number, rng: () => number): StockId[] {
  const endYear = startYear + WINDOW_YEARS - 1;
  const candidates = ASSETS
    .filter((a) => a.group === 'empresa' && a.fromYear <= endYear)
    .map((a) => a.id as StockId);
  if (candidates.length <= STOCKS_PER_GAME) return candidates;

  const diesInside = (id: StockId): boolean => {
    const u = assetMeta[id].untilYear;
    return u !== undefined && u >= startYear && u <= endYear;
  };

  const chosen: StockId[] = [];
  const takeOne = (pool: StockId[]) => {
    const free = pool.filter((id) => !chosen.includes(id));
    if (free.length) chosen.push(pick(free, rng));
  };

  takeOne(candidates.filter(diesInside));
  takeOne(candidates.filter((id) => STAR_STOCKS.includes(id)));
  while (chosen.length < STOCKS_PER_GAME) takeOne(candidates);
  return chosen;
}

const emptyHoldings = (): Record<AssetId, { value: number; cost: number }> =>
  Object.fromEntries(ASSET_IDS.map((id) => [id, { value: 0, cost: 0 }])) as Record<AssetId, { value: number; cost: number }>;

const zeroAllocation = (): Record<AssetId, number> =>
  Object.fromEntries(ASSET_IDS.map((id) => [id, 0])) as Record<AssetId, number>;

export function createInitialState(rng: () => number = Math.random): GameState {
  const startYear = drawWindow(rng);
  const holdings = emptyHoldings();
  // Initial capital is defined in start-year euros, so every window opens the same.
  holdings.efectivo = { value: INITIAL_CASH, cost: INITIAL_CASH };
  return {
    startYear,
    round: 0,
    stocks: drawStocks(startYear, rng),
    seenCards: [],
    holdings,
    allocation: zeroAllocation(),
    pendingGain: 0,
    totalCosts: 0,
    ai: { value: INITIAL_CASH, cost: INITIAL_CASH },
    lastEvent: null,
    lastReturns: null,
    lastCosts: null,
    lastDeath: null,
    history: [],
    phase: 'start',
  };
}

/** What the board shows this semester: base assets plus only the drawn companies. */
export function availableAssets(s: GameState): AssetMeta[] {
  const year = currentYear(s);
  const half = currentHalf(s);
  return ASSETS.filter((a) => {
    if (a.group === 'empresa' && !s.stocks.includes(a.id as StockId)) return false;
    return isAvailable(a, year, half);
  });
}
```

- [ ] **Step 5: Run the test and confirm it passes**

Run: `npx vitest run src/lib/games/stonks/engine.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/games/stonks/engine.ts src/lib/games/stonks/engine.test.ts \
        src/lib/games/stonks/data/index.ts src/lib/games/stonks/data/life-events.ts
git commit -m "feat(stonks): draw a random 25-year window and five companies

The window is uniform over 1971-2001 so it always ends by 2025. The company
draw guarantees one that dies INSIDE the window before it guarantees a star:
a wipe-out that happens after the final semester teaches nothing. Both
guarantees decay silently for windows that make them impossible, such as
1971-1995, where nobody dies.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 5: The semester advance

The heart of the replant. Order of operations is load-bearing and is asserted by the tests.

**Files:**
- Modify: `src/lib/games/stonks/engine.ts`
- Modify: `src/lib/games/stonks/engine.test.ts`

**Interfaces:**
- Consumes: Tasks 1-4.
- Produces: `netWorth(s)`, `realNetWorth(s)`, `allocationSum(s)`, `isAllocationValid(s)`, `inflate(amountInStartYearEuros, s)`, `previewCost(s): { commission: number; tax: number }`, `advanceSemester(s, rng?): GameState`, `finalize(s): { player: number; ai: number }`

**Order of operations inside `advanceSemester` — do not reorder:**
1. Rebalance to the target allocation (sells realise gains; buys set cost basis).
2. Charge commission on total turnover + tax on `realised + pendingGain`; pay from `efectivo`, forcing a proportional liquidation if it is short. Gains realised by that forced sale go to `pendingGain` for next semester — this avoids a tax-on-tax recursion and is a documented simplification.
3. Apply this semester's returns to every position's `value` (never to `cost`).
4. Apply a company death if this is its final semester: position to zero, loss into `pendingGain`.
5. Add income to `efectivo`, inflated, at `cost = value`.
6. Roll a life event (20 %), inflated; a shortfall forces the same proportional liquidation.
7. Record history, advance the AI, increment `round`.

- [ ] **Step 1: Write the failing tests**

```ts
// append to src/lib/games/stonks/engine.test.ts
import { netWorth, realNetWorth, advanceSemester, previewCost, inflate, finalize } from './engine';
import { INCOME_PER_SEMESTER } from './data';

const never = () => 0.99;   // rng high enough that no life event fires (chance 0.2)

/** A game parked in a known window with a known allocation. */
const game = (over: Partial<GameState> = {}): GameState => ({
  ...createInitialState(never), startYear: 2001, stocks: ['e_itx'], phase: 'allocate', ...over,
});

describe('netWorth', () => {
  it('sums every position', () => {
    const s = game();
    s.holdings.oro = { value: 1000, cost: 800 };
    expect(netWorth(s)).toBeCloseTo(5000 + 1000, 6);
  });
  it('deflates into start-year purchasing power', () => {
    const s = game({ round: 2 });
    expect(realNetWorth(s)).toBeLessThan(netWorth(s));   // CPI is positive in 2001
  });
});

describe('advanceSemester — friction', () => {
  it('charges nothing when the portfolio does not move', () => {
    const s = game();
    s.holdings.efectivo = { value: 0, cost: 0 };
    s.holdings.mundial = { value: 5000, cost: 5000 };
    s.allocation = { ...s.allocation, mundial: 100 };
    const next = advanceSemester(s, never);
    expect(next.lastCosts!.commission).toBeCloseTo(0, 6);
    expect(next.lastCosts!.tax).toBeCloseTo(0, 6);
  });

  it('charges commission on both sides of a rebalance', () => {
    const s = game();
    s.allocation = { ...s.allocation, mundial: 100 };   // 5000 of cash -> mundial
    const next = advanceSemester(s, never);
    // turnover = 5000 sold out of efectivo + 5000 bought of mundial; 2001 sits in the 0.5% tier
    expect(next.lastCosts!.commission).toBeCloseTo(10000 * 0.005, 4);
  });

  it('taxes gains realised by a sale, and only those', () => {
    const s = game();
    s.holdings.efectivo = { value: 0, cost: 0 };
    s.holdings.oro = { value: 10000, cost: 4000 };       // 6000 latent gain
    s.allocation = { ...s.allocation, efectivo: 100 };   // sell it all
    const next = advanceSemester(s, never);
    expect(next.lastCosts!.tax).toBeCloseTo(6000 * 0.19, 2);
  });

  it('lets a loss in the same semester offset a gain', () => {
    const s = game();
    s.holdings.efectivo = { value: 0, cost: 0 };
    s.holdings.oro      = { value: 10000, cost: 4000 };  // +6000
    s.holdings.deuda    = { value: 2000,  cost: 8000 };  // -6000
    s.allocation = { ...s.allocation, efectivo: 100 };
    const next = advanceSemester(s, never);
    expect(next.lastCosts!.tax).toBeCloseTo(0, 6);
  });

  it('previewCost matches what the advance actually charges', () => {
    const s = game();
    s.allocation = { ...s.allocation, mundial: 100 };
    const preview = previewCost(s);
    const next = advanceSemester(s, never);
    expect(next.lastCosts!.commission).toBeCloseTo(preview.commission, 6);
    expect(next.lastCosts!.tax).toBeCloseTo(preview.tax, 6);
  });
});

describe('advanceSemester — inflation', () => {
  it('inflates income so a 1971 window is not handed 2025 money', () => {
    const early = { ...game({ startYear: 1971 }), round: 40 };  // 1991
    expect(inflate(INCOME_PER_SEMESTER, early)).toBeGreaterThan(INCOME_PER_SEMESTER * 3);
  });
  it('pays the start-year amount in the very first semester', () => {
    const s = game({ round: 0 });
    expect(inflate(INCOME_PER_SEMESTER, s)).toBeCloseTo(INCOME_PER_SEMESTER, 6);
  });
});

describe('advanceSemester — company death', () => {
  it('wipes the position, flags it, and drops the asset from the board', () => {
    const s = game({ startYear: 2001, stocks: ['e_popular'], round: 32 });  // 2017 H1
    s.holdings.efectivo = { value: 0, cost: 0 };
    s.holdings.e_popular = { value: 4000, cost: 3000 };
    s.allocation = { ...s.allocation, e_popular: 100 };
    const next = advanceSemester(s, never);
    expect(next.lastDeath).toBe('e_popular');
    expect(next.holdings.e_popular.value).toBe(0);
    expect(next.pendingGain).toBeLessThan(0);           // the loss carries forward
  });
});

describe('advanceSemester — forced liquidation', () => {
  it('sells proportionally when cash cannot cover a life event', () => {
    const always = () => 0.01;                          // fires a life event, picks the first
    const s = game();
    s.holdings.efectivo = { value: 0, cost: 0 };
    s.holdings.oro = { value: 20000, cost: 20000 };
    s.allocation = { ...s.allocation, oro: 100 };
    const next = advanceSemester(s, always);
    expect(next.lastCosts!.forced).toBe(true);
    expect(next.holdings.oro.value).toBeLessThan(20000);
  });
});

describe('advanceSemester — bookkeeping', () => {
  it('appends one history row per semester and finishes after 50', () => {
    let s = game({ round: 0 });
    s.allocation = { ...s.allocation, efectivo: 100 };
    for (let i = 0; i < TOTAL_ROUNDS; i++) {
      s = advanceSemester(s, never);
      s.allocation = { ...s.allocation, efectivo: 100 };
    }
    expect(s.history).toHaveLength(TOTAL_ROUNDS);
    expect(s.phase).toBe('reveal');
    expect(s.round).toBe(TOTAL_ROUNDS);
  });

  it('never lets an asset the board does not offer hold value', () => {
    const s = game({ startYear: 1971, round: 0 });
    s.allocation = { ...s.allocation, bitcoin: 100 };   // not available in 1971
    const next = advanceSemester(s, never);
    expect(next.holdings.bitcoin.value).toBe(0);
  });
});
```

- [ ] **Step 2: Run and confirm they fail**

Run: `npx vitest run src/lib/games/stonks/engine.test.ts`
Expected: FAIL — `advanceSemester is not a function`.

- [ ] **Step 3: Implement the advance**

```ts
// append to src/lib/games/stonks/engine.ts
import { capitalGainsTax, commissionRate, cpiIndex, sellFrom, toReal } from './money';
import { semesterReturn } from './data/market';
import { INCOME_PER_SEMESTER, LIFE_EVENTS, LIFE_EVENT_CHANCE } from './data';
import { aiAdvance } from './ai';

export const netWorth = (s: GameState): number =>
  ASSET_IDS.reduce((sum, id) => sum + s.holdings[id].value, 0);

export const realNetWorth = (s: GameState): number =>
  toReal(netWorth(s), cpiIndex(s.startYear, s.round));

/** A start-year euro amount expressed in the current semester's euros. */
export const inflate = (amount: number, s: GameState): number =>
  amount * cpiIndex(s.startYear, s.round);

export const allocationSum = (s: GameState): number =>
  availableAssets(s).reduce((sum, a) => sum + (s.allocation[a.id] || 0), 0);

export const isAllocationValid = (s: GameState): boolean => allocationSum(s) === 100;

interface Rebalanced {
  holdings: GameState['holdings'];
  turnover: number;
  realised: number;
}

/** Move every position to its target; sells realise gains, buys extend cost basis. */
function rebalance(s: GameState): Rebalanced {
  const total = netWorth(s);
  const offered = new Set(availableAssets(s).map((a) => a.id));
  const holdings = { ...s.holdings };
  let turnover = 0;
  let realised = 0;

  // Sells first, so the proceeds are real before anything is bought.
  for (const id of ASSET_IDS) {
    const target = offered.has(id) ? (total * (s.allocation[id] || 0)) / 100 : 0;
    const diff = holdings[id].value - target;
    if (diff > 0) {
      const { position, realised: g } = sellFrom(holdings[id], diff);
      holdings[id] = position;
      turnover += diff;
      realised += g;
    }
  }
  for (const id of ASSET_IDS) {
    const target = offered.has(id) ? (total * (s.allocation[id] || 0)) / 100 : 0;
    const diff = target - holdings[id].value;
    if (diff > 0) {
      holdings[id] = { value: holdings[id].value + diff, cost: holdings[id].cost + diff };
      turnover += diff;
    }
  }
  return { holdings, turnover, realised };
}

/** What confirming the current allocation would cost, shown before the player commits. */
export function previewCost(s: GameState): { commission: number; tax: number } {
  const { turnover, realised } = rebalance(s);
  return {
    commission: turnover * commissionRate(currentYear(s)),
    tax: capitalGainsTax(realised + s.pendingGain),
  };
}

/**
 * Take `amount` € out of cash; if cash is short, liquidate the rest
 * proportionally across every other position. Gains realised this way are
 * returned so the caller can defer them to next semester's tax — taxing them
 * here would recurse (tax → sale → gain → tax).
 */
function payFrom(
  holdings: GameState['holdings'],
  amount: number,
): { holdings: GameState['holdings']; realised: number; forced: boolean } {
  const next = { ...holdings };
  const fromCash = Math.min(amount, next.efectivo.value);
  next.efectivo = { value: next.efectivo.value - fromCash, cost: Math.max(0, next.efectivo.cost - fromCash) };
  let short = amount - fromCash;
  if (short <= 1e-9) return { holdings: next, realised: 0, forced: false };

  const others = ASSET_IDS.filter((id) => id !== 'efectivo' && next[id].value > 0);
  const pool = others.reduce((sum, id) => sum + next[id].value, 0);
  if (pool <= 0) return { holdings: next, realised: 0, forced: true };   // wiped out; nothing left to sell

  let realised = 0;
  const take = Math.min(short, pool);
  for (const id of others) {
    const slice = take * (next[id].value / pool);
    const r = sellFrom(next[id], slice);
    next[id] = r.position;
    realised += r.realised;
  }
  return { holdings: next, realised, forced: true };
}

export function advanceSemester(s: GameState, rng: () => number = Math.random): GameState {
  const year = currentYear(s);
  const half = currentHalf(s);

  // 1. Execute the allocation.
  const { holdings: rebalanced, turnover, realised } = rebalance(s);

  // 2. Pay the bill for moving.
  const commission = turnover * commissionRate(year);
  const tax = capitalGainsTax(realised + s.pendingGain);
  const paid = payFrom(rebalanced, commission + tax);
  let holdings = paid.holdings;
  let pendingGain = paid.realised;
  let forced = paid.forced;

  // 3. The market moves.
  const lastReturns: Partial<Record<AssetId, number>> = {};
  for (const id of ASSET_IDS) {
    const r = semesterReturn(id, year, half);
    if (r === null) continue;
    lastReturns[id] = r;
    holdings[id] = { ...holdings[id], value: holdings[id].value * (1 + r) };
  }

  // 4. A company dies: the position is gone and the loss is real.
  let lastDeath: StockId | null = null;
  for (const id of s.stocks) {
    const m = assetMeta[id];
    if (m.untilYear === year && (m.untilHalf ?? 1) === half) {
      lastDeath = id;
      pendingGain += holdings[id].value - holdings[id].cost;
      holdings[id] = { value: 0, cost: 0 };
    }
  }

  // 5. Income, in this semester's euros.
  const income = inflate(INCOME_PER_SEMESTER, s);
  holdings.efectivo = {
    value: holdings.efectivo.value + income,
    cost: holdings.efectivo.cost + income,
  };

  // 6. Life event.
  let lastEvent: GameState['lastEvent'] = null;
  if (rng() < LIFE_EVENT_CHANCE) {
    const ev = LIFE_EVENTS[Math.floor(rng() * LIFE_EVENTS.length) % LIFE_EVENTS.length];
    const amount = inflate(ev.amount, s);
    lastEvent = ev;
    if (amount >= 0) {
      holdings.efectivo = {
        value: holdings.efectivo.value + amount,
        cost: holdings.efectivo.cost + amount,
      };
    } else {
      const r = payFrom(holdings, -amount);
      holdings = r.holdings;
      pendingGain += r.realised;
      forced = forced || r.forced;
    }
  }

  // 7. Book the semester.
  const nextRound = s.round + 1;
  const nominal = ASSET_IDS.reduce((sum, id) => sum + holdings[id].value, 0);
  const ai = aiAdvance(s.ai, year, half, income);
  const history = [...s.history, {
    year, half,
    nominal,
    real: toReal(nominal, cpiIndex(s.startYear, nextRound)),
    ai: ai.value,
  }];

  return {
    ...s,
    round: nextRound,
    holdings,
    allocation: zeroAllocation(),
    pendingGain,
    totalCosts: s.totalCosts + commission + tax,
    ai,
    lastEvent,
    lastReturns,
    lastCosts: { commission, tax, forced },
    lastDeath,
    history,
    phase: nextRound >= TOTAL_ROUNDS ? 'reveal' : 'results',
  };
}

/**
 * End of the game: both sides liquidate and settle the deferred tax on their
 * latent gains, so a player who traded is compared fairly against a benchmark
 * that never sold.
 */
export function finalize(s: GameState): { player: number; ai: number } {
  const value = netWorth(s);
  const cost = ASSET_IDS.reduce((sum, id) => sum + s.holdings[id].cost, 0);
  return {
    player: value - capitalGainsTax(value - cost + s.pendingGain),
    ai: s.ai.value - capitalGainsTax(s.ai.value - s.ai.cost),
  };
}
```

- [ ] **Step 4: Run the tests and confirm they pass**

Run: `npx vitest run src/lib/games/stonks/engine.test.ts`
Expected: PASS. `advanceSemester` imports `aiAdvance`, which Task 6 writes — until then, stub it in `ai.ts` as `export const aiAdvance = (p: Position) => p;` so this task's tests can run, and replace it in Task 6.

- [ ] **Step 5: Commit**

```bash
git add src/lib/games/stonks/engine.ts src/lib/games/stonks/engine.test.ts src/lib/games/stonks/ai.ts
git commit -m "feat(stonks): semester advance with friction, inflation and company death

Commission is charged on the delta, not the portfolio, so a holding that is
left alone pays nothing — the lesson the game's own closing screen has always
claimed but never enforced. Gains realised by a forced liquidation defer to
the next semester rather than recursing through tax-on-tax.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 6: «El Mercat» benchmark

**Files:**
- Modify: `src/lib/games/stonks/ai.ts` (replace the Task 5 stub)
- Create: `src/lib/games/stonks/ai.test.ts` (replaces the existing file)

**Interfaces:**
- Consumes: Tasks 1-5.
- Produces: `aiAdvance(ai: Position, year: number, half: Half, income: number): Position`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/games/stonks/ai.test.ts
import { describe, it, expect } from 'vitest';
import { aiAdvance } from './ai';
import { advanceSemester, createInitialState, finalize, TOTAL_ROUNDS } from './engine';
import { semesterReturn } from './data/market';
import { commissionRate } from './money';

describe('aiAdvance', () => {
  it('invests the income in the world index after paying commission', () => {
    const r = semesterReturn('mundial', 2015, 0)!;
    const next = aiAdvance({ value: 1000, cost: 1000 }, 2015, 0, 500);
    const invested = 500 * (1 - commissionRate(2015));
    expect(next.value).toBeCloseTo((1000 + invested) * (1 + r), 4);
  });

  it('never sells, so cost basis only grows', () => {
    const start = { value: 1000, cost: 1000 };
    const next = aiAdvance(start, 2015, 0, 500);
    expect(next.cost).toBeGreaterThan(start.cost);
    expect(next.cost).toBeCloseTo(1000 + 500 * (1 - commissionRate(2015)), 4);
  });

  it('ties with a player who holds 100% of the world index and never trades', () => {
    // Spec §14: the benchmark must not be beatable by accident, nor unbeatable by construction.
    let s = { ...createInitialState(() => 0.99), startYear: 1990 };
    s.holdings.efectivo = { value: 0, cost: 0 };
    s.holdings.mundial = { value: s.ai.value, cost: s.ai.cost };
    for (let i = 0; i < TOTAL_ROUNDS; i++) {
      s.allocation = { ...s.allocation, mundial: 100 };
      s = advanceSemester(s, () => 0.99);              // 0.99 > LIFE_EVENT_CHANCE: no events
    }
    const { player, ai } = finalize(s);
    expect(player).toBeCloseTo(ai, 0);
  });

  it('rides a losing semester down rather than stepping aside', () => {
    const r = semesterReturn('mundial', 2008, 1)!;
    expect(r).toBeLessThan(0);
    const next = aiAdvance({ value: 10000, cost: 10000 }, 2008, 1, 0);
    expect(next.value).toBeLessThan(10000);
  });
});
```

- [ ] **Step 2: Run and confirm it fails**

Run: `npx vitest run src/lib/games/stonks/ai.test.ts`
Expected: FAIL — the stub returns the position unchanged.

- [ ] **Step 3: Implement**

```ts
// src/lib/games/stonks/ai.ts
import type { Half, Position } from './types';
import { semesterReturn } from './data/market';
import { commissionRate } from './money';
import { INDEX_ASSET } from './data';

/**
 * «El Mercat»: buys the world index with every euro of income and never sells.
 * The world index, not the S&P 500 — treating US outperformance as a law of
 * nature is exactly the lesson we do not want to teach. Deferred capital gains
 * are settled by engine.finalize(), so the comparison stays fair.
 */
export function aiAdvance(ai: Position, year: number, half: Half, income: number): Position {
  const invested = income * (1 - commissionRate(year));
  const r = semesterReturn(INDEX_ASSET, year, half) ?? 0;
  return {
    value: (ai.value + invested) * (1 + r),
    cost: ai.cost + invested,
  };
}
```

- [ ] **Step 4: Run and confirm it passes**

Run: `npx vitest run src/lib/games/stonks/ai.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/games/stonks/ai.ts src/lib/games/stonks/ai.test.ts
git commit -m "feat(stonks): benchmark tracks the world index, not the S&P 500

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 7: Semester news

**Files:**
- Create: `src/lib/games/stonks/data/news.ts`
- Create: `src/lib/games/stonks/data/news.test.ts`
- Modify: `src/lib/games/stonks/data/index.ts` (add `export * from './news';`)

**Interfaces:**
- Consumes: `SemesterNews`, `Half`.
- Produces: `NEWS: SemesterNews[]` (110 entries), `newsFor(year: number, half: Half): string`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/games/stonks/data/news.test.ts
import { describe, it, expect } from 'vitest';
import { NEWS, newsFor } from './news';

describe('semester news', () => {
  it('covers both halves of every year from 1971 to 2025', () => {
    expect(NEWS).toHaveLength(110);
    for (let y = 1971; y <= 2025; y++) {
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
      expect(n.text.length, `${n.year} H${n.half + 1}`).toBeGreaterThan(25);
      expect(n.text).not.toMatch(/TODO|TBD|Lorem|pendiente/i);
    }
  });

  it('tells the two halves of 2008 apart', () => {
    expect(newsFor(2008, 0)).not.toBe(newsFor(2008, 1));
    expect(newsFor(2008, 1)).toMatch(/Lehman/i);
  });
});
```

- [ ] **Step 2: Run and confirm it fails**

Run: `npx vitest run src/lib/games/stonks/data/news.test.ts`

- [ ] **Step 3: Write the 110 headlines**

Bulk content. One sentence per semester, Spanish, present tense, factual — no market advice and no hindsight nudging ("los mercados se desploman", never "buen momento para comprar"). Sample shape, first and hardest years:

```ts
// src/lib/games/stonks/data/news.ts
import type { Half, SemesterNews } from '../types';

/** One headline per semester, 1971-2025. Factual and neutral: the player must
 *  decide with the information of the moment, not with a hint from us. */
export const NEWS: SemesterNews[] = [
  { year: 1971, half: 0, text: 'La inflación se acelera en Estados Unidos y crecen las dudas sobre el dólar.' },
  { year: 1971, half: 1, text: 'Nixon suspende la convertibilidad del dólar en oro: cae el sistema de Bretton Woods.' },
  { year: 1973, half: 1, text: 'La OPEP cuadruplica el precio del petróleo tras la guerra del Yom Kipur.' },
  { year: 2008, half: 0, text: 'JP Morgan compra Bear Stearns por una fracción de su valor con ayuda de la Reserva Federal.' },
  { year: 2008, half: 1, text: 'Quiebra Lehman Brothers y el crédito mundial se congela.' },
  // … 110 entries in total, ordered by year then half.
];

const byKey = new Map(NEWS.map((n) => [`${n.year}-${n.half}`, n.text]));
export const newsFor = (year: number, half: Half): string => byKey.get(`${year}-${half}`) ?? '';
```

- [ ] **Step 4: Add the re-export**

In `src/lib/games/stonks/data/index.ts`, add `export * from './news';` next to the other data exports.

- [ ] **Step 5: Run and confirm it passes**

Run: `npx vitest run src/lib/games/stonks/data/news.test.ts`

- [ ] **Step 6: Commit**

```bash
git add src/lib/games/stonks/data/news.ts src/lib/games/stonks/data/news.test.ts src/lib/games/stonks/data/index.ts
git commit -m "feat(stonks): 110 semester headlines, 1971-2025

Bear Stearns and Lehman are not the same screen any more.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 8: Deep asset cards

**Files:**
- Create: `src/lib/games/stonks/data/cards.ts`
- Create: `src/lib/games/stonks/data/cards.test.ts`
- Modify: `src/lib/games/stonks/data/index.ts` (add `export * from './cards';`)

**Interfaces:**
- Consumes: `AssetCard`, `ASSETS`, `STOCK_IDS`.
- Produces: `CARDS: AssetCard[]` (28 entries), `cardFor(id: string): AssetCard | undefined`, `CLASS_CARD_ID = 'clase_empresa'`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/games/stonks/data/cards.test.ts
import { describe, it, expect } from 'vitest';
import { CARDS, cardFor, CLASS_CARD_ID } from './cards';
import { ASSETS, STOCK_IDS, assetMeta } from './assets';

describe('deep cards', () => {
  it('has one per base asset, one shared company card, and a reveal per company', () => {
    expect(CARDS).toHaveLength(28);
    for (const a of ASSETS.filter((x) => x.group !== 'empresa')) {
      expect(cardFor(a.id), `card ${a.id}`).toBeDefined();
    }
    expect(cardFor(CLASS_CARD_ID)).toBeDefined();
    for (const id of STOCK_IDS) {
      expect(cardFor(id), `profile card ${id}`).toBeDefined();
      expect(cardFor(`${id}_reveal`), `reveal card ${id}`).toBeDefined();
    }
  });

  it('follows the five-part structure with real prose', () => {
    for (const c of CARDS) {
      expect(c.title, c.id).toBeTruthy();
      expect(c.body.length, `${c.id} paragraphs`).toBeGreaterThanOrEqual(4);
      for (const p of c.body) {
        expect(p.length, `${c.id} paragraph length`).toBeGreaterThan(60);
        expect(p).not.toMatch(/TODO|TBD|Lorem/i);
      }
    }
  });

  it('keeps company names out of the cards shown during play', () => {
    for (const id of STOCK_IDS) {
      const shown = JSON.stringify(cardFor(id)).toLowerCase();
      expect(shown, `blind card ${id}`).not.toContain(assetMeta[id].realName!.toLowerCase());
    }
  });

  it('names the company in its reveal card', () => {
    for (const id of STOCK_IDS) {
      const reveal = JSON.stringify(cardFor(`${id}_reveal`)).toLowerCase();
      expect(reveal).toContain(assetMeta[id].realName!.toLowerCase());
    }
  });

  it('never promises a return', () => {
    for (const c of CARDS) {
      const text = c.body.join(' ');
      expect(text, c.id).not.toMatch(/garantiza|seguro que sube|siempre sube|no puede bajar/i);
    }
  });
});
```

- [ ] **Step 2: Run and confirm it fails**

Run: `npx vitest run src/lib/games/stonks/data/cards.test.ts`

- [ ] **Step 3: Write the 28 cards**

Each `body` follows spec §9: (1) what it is, as a mechanism; (2) where the return comes from; (3) the concrete risk; (4) a fact from the period; (5) what it is not good for. Worked example to copy the register from:

```ts
// src/lib/games/stonks/data/cards.ts
import type { AssetCard } from '../types';

export const CLASS_CARD_ID = 'clase_empresa';

export const CARDS: AssetCard[] = [
  {
    id: 'deposito',
    title: 'Depósito a plazo',
    body: [
      'Le prestas dinero al banco durante un plazo fijo y el banco te paga un interés pactado de antemano. No puedes recuperarlo antes sin penalización: esa es exactamente la contrapartida del interés.',
      'El rendimiento sale del negocio del banco: presta ese dinero a un tipo más alto del que te paga a ti, y la diferencia es su margen.',
      'El riesgo no es que el banco no te devuelva el dinero, que en España está garantizado hasta 100.000 € por titular. El riesgo es la inflación: si te pagan un 4 % y los precios suben un 14 %, has perdido un 10 % de poder de compra con el dinero perfectamente a salvo.',
      'Entre 1974 y 1982 los depósitos españoles pagaban intereses de dos dígitos y aun así perdían frente al IPC casi todos los años. Ganar euros y perder poder de compra a la vez no es una rareza: fue lo normal durante una década.',
      'No sirve para hacer crecer un patrimonio a largo plazo. Sirve para tener a mano el dinero que vas a necesitar pronto y que no te puedes permitir ver caer.',
    ],
  },
  // … 27 more.
];

const byId = new Map(CARDS.map((c) => [c.id, c]));
export const cardFor = (id: string): AssetCard | undefined => byId.get(id);
```

- [ ] **Step 4: Add the re-export**

In `data/index.ts`, add `export * from './cards';`.

- [ ] **Step 5: Run and confirm it passes**

Run: `npx vitest run src/lib/games/stonks/data/cards.test.ts`

- [ ] **Step 6: Commit**

```bash
git add src/lib/games/stonks/data/cards.ts src/lib/games/stonks/data/cards.test.ts src/lib/games/stonks/data/index.ts
git commit -m "feat(stonks): 28 deep asset cards

Each card explains the mechanism, where the return comes from, the concrete
risk, a fact from the period, and what the asset is NOT for — the section no
commercial leaflet writes. A test asserts no card promises a return and no
blind card leaks its company's name.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 9: Game shell, window intro and the card modal

**Files:**
- Modify: `src/components/games/stonks/StonksGame.tsx`
- Modify: `src/components/games/stonks/StartScreen.tsx`
- Create: `src/components/games/stonks/WindowIntro.tsx`
- Create: `src/components/games/stonks/AssetCardModal.tsx`
- Modify: `src/components/games/stonks/stonks.css`

**Interfaces:**
- Consumes: `createInitialState`, `advanceSemester`, `currentYear`, `currentHalf`, `netWorth`, `cardFor` from Tasks 1-8.
- Produces: phase flow `start → intro → news → allocate → results → … → reveal → finished`; `openCard(id: string)` passed down to `AllocateScreen`.

- [ ] **Step 1: Rewrite the state machine in `StonksGame.tsx`**

Key changes from the current file, which otherwise keeps its shape:
- `advanceYear` → `advanceSemester`.
- `start()` sets `phase: 'intro'` rather than `'news'`.
- New `const [cardId, setCardId] = useState<string | null>(null)`; `openCard` sets it and pushes the id onto `state.seenCards`.
- On entering `allocate`, auto-open the card for every newly available asset not yet in `seenCards`, one at a time.
- Saved games missing `startYear` are discarded (spec §13):

```tsx
useEffect(() => {
  const saved = store.load();
  setHasSave(!!saved && typeof saved.startYear === 'number');
}, []);
```

- `phase === 'reveal'` renders `RevealScreen`; `'finished'` renders `FinalScreen`.

- [ ] **Step 2: Write `WindowIntro.tsx`**

```tsx
/** @jsxImportSource preact */
import { useGameLocale } from '../locale-context';
import { WINDOW_YEARS } from '@/lib/games/stonks/engine';

interface Props { startYear: number; onContinue: () => void; }

export const COPY = {
  es: {
    eyebrow: 'Tu ventana',
    lede: (a: number, b: number) =>
      `Vas a invertir de ${a} a ${b}. No sabes lo que viene: decide con lo que sepas en cada momento.`,
    start: 'Empezar',
  },
  ca: {
    eyebrow: 'La teua finestra',
    lede: (a: number, b: number) =>
      `Invertiràs de ${a} a ${b}. No saps què ve: decidix amb el que sàpies en cada moment.`,
    start: 'Comença',
  },
};

export function WindowIntro({ startYear, onContinue }: Props) {
  const c = COPY[useGameLocale()];
  const endYear = startYear + WINDOW_YEARS - 1;
  return (
    <div class="sk-phone sk-start">
      <div class="eyebrow">{c.eyebrow}</div>
      <h1 class="sk-year serif">{startYear}–{endYear}</h1>
      <p class="sk-intro">{c.lede(startYear, endYear)}</p>
      <button class="sk-cta" onClick={onContinue}>{c.start}</button>
    </div>
  );
}
```

- [ ] **Step 3: Write `AssetCardModal.tsx`**

```tsx
/** @jsxImportSource preact */
import { useEffect, useRef } from 'preact/hooks';
import { cardFor } from '@/lib/games/stonks/data/cards';
import { useGameLocale } from '../locale-context';
import { localizeCard } from '@/i18n/games/stonks-ca';

interface Props { id: string; onClose: () => void; }

const CLOSE = { es: 'Entendido', ca: 'Entesos' };

export function AssetCardModal({ id, onClose }: Props) {
  const locale = useGameLocale();
  const card = localizeCard(cardFor(id), locale);
  const closeRef = useRef<HTMLButtonElement>(null);

  // The modal is the one place a keyboard user can get stuck, so it owns focus
  // while open and hands it back on Escape or dismiss.
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!card) return null;

  return (
    <div class="sk-modal-backdrop" onClick={onClose}>
      <div
        class="sk-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sk-card-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="sk-card-title" class="serif">{card.title}</h2>
        {card.body.map((p, i) => <p key={i}>{p}</p>)}
        <button ref={closeRef} class="sk-cta" onClick={onClose}>{CLOSE[locale]}</button>
      </div>
    </div>
  );
}
```

`localizeCard(card, locale)` is added to `src/i18n/games/stonks-ca.ts` in Task 12; until then have it return the Spanish card unchanged.

- [ ] **Step 4: Update `StartScreen` copy**

Replace the hard-coded `2000–2024` in both locales with a description of the random window: `'Invierte durante 25 años en una ventana entre 1971 y 2025…'`.

- [ ] **Step 5: Verify in the browser**

Start the dev server through the Browser pane (`preview_start`, never `npm run dev` in Bash), open `/juegos/stonks/`, and confirm: start → intro shows a plausible window → news → allocate. Check `read_console_messages` for errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/games/stonks/
git commit -m "feat(stonks): window intro, card modal and the extended phase flow

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 10: Allocation, results and reveal screens

**Files:**
- Modify: `src/components/games/stonks/AllocateScreen.tsx`
- Modify: `src/components/games/stonks/NewsScreen.tsx`
- Modify: `src/components/games/stonks/ResultScreen.tsx`
- Create: `src/components/games/stonks/RevealScreen.tsx`
- Modify: `src/components/games/stonks/stonks.css`

**Interfaces:**
- Consumes: `availableAssets`, `previewCost`, `realNetWorth`, `inflate`, `newsFor`, `cardFor`.
- Produces: nothing consumed downstream except by Task 11's chart.

- [ ] **Step 1: `AllocateScreen` — groups, info buttons, real value, cost preview**

- Rows come from `availableAssets(state)`, grouped by `a.group` under three headings: `Seguro`, `Bolsa`, `Empresas`. Companies render `label` on line one and `profile` in the mono micro-label.
- Header shows both figures: `{nominal} €` and, underneath, `{real} € en poder adquisitivo de {startYear}`.
- Each row gets an `ⓘ` button (`aria-label={`Qué es ${a.label}`}`) calling `openCard(a.id)`.
- Above the confirm button, render `previewCost(state)` when either figure exceeds `0.5 €`:
  `Mover la cartera te costará {commission} € de comisiones y {tax} € de impuestos.`
  Suppress it entirely at zero so a still portfolio shows nothing — the absence is the lesson.

- [ ] **Step 2: `NewsScreen` — semester, not year**

Take `year` and `half` props; eyebrow becomes `1.er semestre de {year}` / `2.º semestre de {year}` (`1r` / `2n` in `ca`); body from `newsFor(year, half)`.

- [ ] **Step 3: `ResultScreen` — costs, death, real value**

Add, in this order: the returns list (unchanged), the life event (unchanged), a costs line when `lastCosts.commission + lastCosts.tax > 0.5`, a forced-sale warning when `lastCosts.forced`, and a death callout when `lastDeath`:

```
es: 'Has tenido que vender parte de tu cartera para cubrir el gasto. Sin dinero disponible, se vende en el momento que toque, no en el que te convenga.'
es: `${realName ?? 'La empresa'} ha desaparecido. Tu inversión en ella vale 0 €.`
```

The death callout must NOT use `realName` — the company is still blind. Use the profile: `'La empresa de {label} ha desaparecido. Tu inversión en ella vale 0 €.'`

- [ ] **Step 4: `RevealScreen`**

One card per drawn company: profile as it was shown during play, then the real name, then the reveal card's paragraphs from `cardFor(`${id}_reveal`)`. A single `Ver resultado` button advances to `phase: 'finished'`.

- [ ] **Step 5: Verify in the browser**

Play a full game with the dev tools: set `localStorage` state to a late round to reach the reveal quickly, or play through. Confirm the cost preview matches what the result screen then charges.

- [ ] **Step 6: Commit**

```bash
git add src/components/games/stonks/
git commit -m "feat(stonks): grouped allocation with cost preview, semester news and the reveal

The cost preview is not decoration: without it the friction reads as an
unexplained leak instead of the lesson it is meant to be.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 11: Final screen — dual curve and generated lessons

**Files:**
- Modify: `src/components/games/stonks/FinalScreen.tsx`
- Modify: `src/components/games/stonks/EvolucionChart.tsx`
- Create: `src/lib/games/stonks/lessons.ts`
- Create: `src/lib/games/stonks/lessons.test.ts`

**Interfaces:**
- Consumes: `GameState`, `finalize`, `history`.
- Produces: `buildLessons(s: GameState): string[]` — between three and six sentences, all true of this game.

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/games/stonks/lessons.test.ts
import { describe, it, expect } from 'vitest';
import { buildLessons } from './lessons';
import { createInitialState } from './engine';
import type { GameState } from './types';

const finished = (over: Partial<GameState> = {}): GameState => ({
  ...createInitialState(() => 0.5), round: 50, phase: 'finished',
  history: Array.from({ length: 50 }, (_, i) => ({
    year: 2001 + Math.floor(i / 2), half: (i % 2) as 0 | 1,
    nominal: 5000 * (1 + i / 50), real: 5000, ai: 5000 * (1 + i / 40),
  })),
  ...over,
});

describe('buildLessons', () => {
  it('returns between three and six sentences', () => {
    const l = buildLessons(finished());
    expect(l.length).toBeGreaterThanOrEqual(3);
    expect(l.length).toBeLessThanOrEqual(6);
  });

  it('calls out the gap between nominal and real when inflation ate the gain', () => {
    const s = finished({
      history: Array.from({ length: 50 }, (_, i) => ({
        year: 1971 + Math.floor(i / 2), half: (i % 2) as 0 | 1,
        nominal: 5000 * (1 + i / 10), real: 4000, ai: 5000,
      })),
      startYear: 1971,
    });
    expect(buildLessons(s).join(' ')).toMatch(/poder de compra|poder adquisitivo/i);
  });

  it('never says something false about a game with zero trading costs', () => {
    const s = finished({ totalCosts: 0 });
    expect(buildLessons(s).join(' ')).not.toMatch(/has pagado .* en comisiones/i);
  });

  it('reports the real cost of trading when there was some', () => {
    const s = finished({ totalCosts: 4200 });
    expect(buildLessons(s).join(' ')).toMatch(/4\.?200|comisiones/i);
  });
});
```

- [ ] **Step 2: Run and confirm it fails**

Run: `npx vitest run src/lib/games/stonks/lessons.test.ts`

- [ ] **Step 3: Implement `lessons.ts`**

```ts
// src/lib/games/stonks/lessons.ts
import type { GameState } from './types';
import { finalize } from './engine';
import { assetMeta } from './data/assets';

const eur = (n: number): string => `${Math.round(n).toLocaleString('es-ES')} €`;

/** Always-true fallbacks, used only to pad a game too quiet to say anything specific. */
const GENERIC = [
  'Diversificar no elimina el riesgo, pero evita que una sola decisión te arruine.',
  'El interés compuesto necesita tiempo: es la única variable que no puedes acelerar.',
  'Lo que no vendes no paga impuestos todavía. Ese aplazamiento vale dinero.',
];

/** Every rule returns a sentence that is TRUE of this game, or null. */
export function buildLessons(s: GameState): string[] {
  const out: string[] = [];
  const last = s.history.at(-1);
  const { player, ai } = finalize(s);

  // 1. Nominal euros grew but purchasing power did not.
  if (last && last.nominal > s.history[0].nominal && last.real <= s.history[0].real * 1.05) {
    out.push(
      `Acabas con ${eur(last.nominal)}, pero en poder adquisitivo de ${s.startYear} son ${eur(last.real)}. ` +
      'Tener más euros y poder comprar lo mismo no es ganar dinero: es empatar con la inflación.',
    );
  }

  // 2. What moving the portfolio actually cost.
  if (s.totalCosts > 1) {
    out.push(
      `Has pagado ${eur(s.totalCosts)} en comisiones e impuestos por mover la cartera. ` +
      'Cada cambio de idea tiene precio, y se paga aunque el cambio fuera acertado.',
    );
  } else {
    out.push('No has pagado ni un euro en comisiones: dejar quieta una cartera es gratis, y casi nunca es la peor opción.');
  }

  // 3. Concentration in a single company.
  const biggest = s.stocks
    .map((id) => ({ id, value: s.holdings[id].value }))
    .sort((a, b) => b.value - a.value)[0];
  if (biggest && last && biggest.value > last.nominal * 0.3) {
    out.push(
      `Llegaste a tener más del 30 % de todo tu patrimonio en una sola empresa (${assetMeta[biggest.id].label}). ` +
      'Cuando sale bien parece visión; cuando sale mal no hay a dónde agarrarse.',
    );
  }

  // 4. A company the player was holding disappeared.
  if (s.lastDeath) {
    out.push(
      `Una de las empresas del tablero desapareció durante tu partida. No quebró por sorpresa para todo el mundo: ` +
      'quebró después de años de señales que casi nadie quiso leer.',
    );
  }

  // 5. Versus the benchmark.
  const gap = player - ai;
  out.push(
    gap >= 0
      ? `Has terminado ${eur(gap)} por encima de «El Mercat», que se limitó a comprar el índice mundial y no vender nunca.`
      : `«El Mercat» te ha ganado por ${eur(-gap)} sin tomar ni una sola decisión: compró el índice mundial y no vendió nunca.`,
  );

  for (const g of GENERIC) {
    if (out.length >= 3) break;
    out.push(g);
  }
  return out.slice(0, 6);
}
```

- [ ] **Step 4: Dual curve in `EvolucionChart.tsx`**

Three series: player nominal (terracota `#C44E2C`), player real (terracota dashed, `stroke-dasharray="4 3"`), benchmark (`#8A7868`). Legend gains the third entry. Y-axis scaled to the maximum of all three.

- [ ] **Step 5: `FinalScreen` — use `finalize()` and the generated lessons**

Replace `netWorth(state)` and `state.ai.netWorth` with `finalize(state)`, add a line explaining the settlement (`'Cifras después de liquidar y pagar impuestos sobre las plusvalías.'`), and render `buildLessons(state)` in place of the fixed six.

- [ ] **Step 6: Run all tests and commit**

```bash
npm test
git add src/lib/games/stonks/lessons.ts src/lib/games/stonks/lessons.test.ts src/components/games/stonks/
git commit -m "feat(stonks): closing screen states what happened in THIS game

Six fixed platitudes become rules that read the player's own history. A game
with no trading is no longer told what its commissions cost it.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 12: Valencian overlay, hub copy and full verification

**Files:**
- Modify: `src/i18n/games/stonks-ca.ts`
- Modify: `src/i18n/games/content-parity.test.ts`
- Modify: `src/lib/juegos.ts`
- Modify: `src/pages/juegos/stonks/index.astro` (only if it passes props that changed)

- [ ] **Step 1: Extend the parity test first**

```ts
// in src/i18n/games/content-parity.test.ts, replacing the stonks block
import { ASSETS, NEWS, CARDS, LIFE_EVENTS } from '@/lib/games/stonks/data';
import { ASSETS_CA, NEWS_CA, CARDS_CA, LIFE_EVENTS_CA } from './stonks-ca';

describe('stonks content overlay completeness', () => {
  it('translates every asset label, profile and blurb', () => {
    for (const a of ASSETS) {
      expect(ASSETS_CA[a.id], `asset ${a.id}`).toBeTruthy();
      expect(ASSETS_CA[a.id].label, `label ${a.id}`).toBeTruthy();
      if (a.profile) expect(ASSETS_CA[a.id].profile, `profile ${a.id}`).toBeTruthy();
    }
  });
  it('translates all 110 semester headlines', () => {
    for (const n of NEWS) {
      expect(NEWS_CA[`${n.year}-${n.half}`], `${n.year} H${n.half + 1}`).toBeTruthy();
    }
  });
  it('translates every card, paragraph for paragraph', () => {
    for (const c of CARDS) {
      const ca = CARDS_CA[c.id];
      expect(ca, `card ${c.id}`).toBeTruthy();
      expect(ca.body.length, `card ${c.id} paragraph count`).toBe(c.body.length);
    }
  });
  it('translates every life event', () => {
    for (const e of LIFE_EVENTS) expect(LIFE_EVENTS_CA[e.id], `life event ${e.id}`).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npx vitest run src/i18n/games/content-parity.test.ts`
Expected: FAIL — the overlay is missing the new keys.

- [ ] **Step 3: Write the Valencian overlay**

Translate every new key. **This is a translation, not a rewrite**: the Valencian must say the same thing, and per CLAUDE.md it needs Pau's human review before it ships. Flag it in the PR body as pending review.

- [ ] **Step 4: Update the hub card in `src/lib/juegos.ts`**

The current description says «Invierte durante 25 años…». Replace with copy that names the new shape: 50 semestres, ventana aleatoria entre 1971 y 2025, empresas a ciegas. Keep `tipo`, `nivel`, `color` and the curriculum bridges untouched.

- [ ] **Step 5: Full verification — run everything and prove it**

```bash
npm test
npx tsc --noEmit
npm run build
```

All three must pass with zero errors. Then, in the Browser pane, play one complete game start to finish — 50 semesters — and confirm: the window intro matches the years actually played, at least one card modal opens, the cost preview matches what gets charged, the reveal names all five companies, and the final chart draws three lines. Capture a screenshot of the reveal and the final screen.

Do not claim this task is done on a green `npm test` alone. The build and the playthrough are part of it.

- [ ] **Step 6: Commit and open the PR**

```bash
git add src/i18n/games/ src/lib/juegos.ts
git commit -m "feat(stonks): Valencian overlay and hub copy for the replant

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
git push -u origin feat/stonks-replanteig
```

PR body must state: the design spec path, that the market and CPI series are **rounded and unaudited** (spec §7), and that the **Valencian overlay is pending Pau's human review**.

---

## Notes for whoever executes this

- **Tasks 3, 7 and 8 are content, not code.** Together they are the bulk of the work: ~990 return figures, 110 headlines and 28 cards. Each has an exhaustive test that fails until the content is complete — treat the test as the definition of done, and do not weaken a tolerance to make a red test green.
- **Do not touch `C:\dev\profedeeconomia`.** Another session has 1166 files staged there.
- **The `finalReturn` of a doomed company overrides the market**, including in a year where its `ANNUAL` entry exists. That is deliberate: the wipe-out is the event.
- If a task's tests pass but you cannot explain why a number came out as it did, stop and say so rather than moving on.
