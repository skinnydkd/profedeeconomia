# Econopoly (hot-seat 1-6 + IA) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a hot-seat (1-6 humans + AI) Monopoly-style economics board game at `/juegos/econopoly/`, reusing the games framework.

**Architecture:** Astro page → full-screen Preact island. All rules in pure deterministic TypeScript in `src/lib/games/econopoly/` (vitest, injectable RNG), mirroring `src/lib/games/stonks/*` and `src/lib/games/econrisk/*`. UI in `src/components/games/econopoly/`. Reuses `GameShell.astro` (with `wide`) and `src/lib/games/storage.ts`. 28-cell ring rendered as CSS-grid HTML (8×8 grid with the inner 6×6 used for the cycle protagonist) — no chart library. Variant C aesthetic, **4 accent palette + A-H sector chips**. Spanish only; networked multiplayer out of scope.

**Tech Stack:** Astro 5, Preact, TS strict, vitest. No new dependencies.

**Reference spec:** `docs/superpowers/specs/2026-05-26-econopoly-design.md`. **Branch:** `feat/econopoly`.

---

## Constants (fixed by this plan)

```ts
export const INITIAL_CASH = 1500;
export const PASS_START_BONUS = 200;
export const PUBLIC_FUND_SHARE_PCT = 0.10;          // 10% of fund split per pass
export const TOTAL_ROUNDS = 20;
export const RD_MULTIPLIERS = [1.0, 1.5, 2.0, 3.0] as const;
export const RD_UPGRADE_COST_PCT = 0.5;             // 50% of base price per level
export const MONOPOLY_BONUS = 2;                    // x2 rent if owns both in sector
export const TAX_BRACKETS = [
  { threshold: 500,  rate: 0.05 },
  { threshold: 1000, rate: 0.10 },
  { threshold: Infinity, rate: 0.15 },
] as const;
export const CYCLE_RENT = { expansion: 1.3, recession: 0.7 } as const;
export const CYCLE_PROPERTY = { expansion: 1.2, recession: 0.8 } as const;
export const CYCLE_LENGTH = 5;                       // alternate every 5 rounds
export const CB_INITIAL_RATE = 5;                    // %
export const CB_RATE_RANGE = [2, 12] as const;
export const AUCTION_MIN_INCREMENT = 10;
export const BOARD_SIZE = 28;
```

Convention: `@/lib/...` for src/lib (NO `@lib`); Preact patterns mirror `src/components/games/stonks/*.tsx` and `src/components/games/econrisk/*.tsx` (`@jsxImportSource preact`, `class`, hooks from `preact/hooks`). All randomness via injectable `rng: () => number` (default `Math.random`). Faction/player colors when humans add their own: 6 distinct (teal, terra, mostaza, pine, berenjena, granate).

---

## File Structure

| File | Responsibility |
|---|---|
| `src/lib/games/econopoly/types.ts` | All types. |
| `src/lib/games/econopoly/board.ts` | 28-cell ring ported from webpde (4 corners + 16 properties + 8 specials), 8 sectors. |
| `src/lib/games/econopoly/board.test.ts` | Structural tests. |
| `src/lib/games/econopoly/events.ts` | ~20 news cards ported. |
| `src/lib/games/econopoly/engine.ts` | Pure rules. |
| `src/lib/games/econopoly/engine.test.ts` | Engine TDD. |
| `src/lib/games/econopoly/ai.ts` | AI decisions. |
| `src/lib/games/econopoly/ai.test.ts` | AI tests. |
| `src/components/games/econopoly/econopoly.css` | Variant C styles (from validated mockup v2). |
| `src/components/games/econopoly/BoardView.tsx` | 8×8 grid board (HTML/CSS) with cells + tokens + center cycle. |
| `src/components/games/econopoly/SidePanel.tsx` | Phase bar + player card + hand + econ stats + action. |
| `src/components/games/econopoly/AuctionModal.tsx` | Auction overlay (bid +10 / pass). |
| `src/components/games/econopoly/SetupScreen.tsx` | Pick number of humans + names/colors. |
| `src/components/games/econopoly/PassDeviceScreen.tsx` | Hand-off between humans. |
| `src/components/games/econopoly/EndScreen.tsx` | Final ranking + Gini + lessons. |
| `src/components/games/econopoly/EconopolyGame.tsx` | Root island state machine + AI driver + auction driver. |
| `src/pages/juegos/econopoly/index.astro` | Route (GameShell `wide`). |
| `src/pages/juegos/index.astro` | Modify: surface Econopoly as available. |

---

## Task 1: Types

**Files:** Create `src/lib/games/econopoly/types.ts`

- [ ] **Step 1: Write types**

```ts
export type SectorId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';
export type PlayerId = number; // 0..5
export type CellKind = 'start' | 'tax' | 'news' | 'cb' | 'rd' | 'freemarket' | 'property';
export type Phase = 'roll' | 'resolve' | 'action';
export type Cycle = 'expansion' | 'recession';
export type RdLevel = 0 | 1 | 2 | 3;

export interface PropertyData {
  sector: SectorId;
  label: string;      // es
  basePrice: number;
  baseRent: number;
}
export interface Cell {
  id: number;         // 0..27 position on the ring (clockwise starting at SALIDA)
  kind: CellKind;
  label: string;      // es display (corners and specials)
  property?: PropertyData;
}
export interface NewsCard {
  id: string;
  text: string;       // es
  kind: 'bonusCash' | 'penaltyCash' | 'rateChange' | 'sectorBoost' | 'sectorBust' | 'taxHoliday' | 'none';
  amount?: number;
  sector?: SectorId;
}
export interface PlayerState {
  id: PlayerId;
  name: string;
  color: string;
  isHuman: boolean;
  alive: boolean;
  cash: number;
  position: number;   // 0..27
}
export interface PropertyState {
  cellId: number;
  owner: PlayerId | null;
  rdLevel: RdLevel;
}
export interface AuctionBid { player: PlayerId; amount: number; }
export interface AuctionState {
  cellId: number;
  currentBidder: PlayerId;     // next to act
  highestBid: number;
  highestBidder: PlayerId | null;
  passed: PlayerId[];          // who has passed this round
}
export interface GameState {
  cells: Cell[];
  players: PlayerState[];
  properties: Record<number, PropertyState>;
  current: number;             // index into players (alive only)
  round: number;               // 1..TOTAL_ROUNDS
  phase: Phase;
  cycle: Cycle;
  cbRate: number;
  publicFund: number;
  lastEvent: NewsCard | null;
  lastRoll: { d1: number; d2: number } | null;
  pendingPurchase: number | null;  // cellId, set when human lands on free property awaiting buy/pass
  activeAuction: AuctionState | null;
  log: string[];
  winner: PlayerId | null;
}
```

- [ ] **Step 2: Commit** — `git add ... && git commit -m "feat(econopoly): types"`

---

## Task 2: Board (port + verify)

**Files:** Create `src/lib/games/econopoly/board.ts`, `board.test.ts`

- [ ] **Step 1: Fetch the old board layout** from `https://raw.githubusercontent.com/skinnydkd/webpde/main/econopoly.html` (WebFetch or `gh api repos/skinnydkd/webpde/contents/econopoly.html` then base64-decode). Locate the cell list and sector definitions.

- [ ] **Step 2: Write `board.ts`** with 28 cells (clockwise from SALIDA), 8 sectors × 2 properties. Port labels, base prices and base rents from the source; for each property assign a sector A-H (pair adjacent properties by sector). 4 corners at positions 0/7/14/21 are: 0 SALIDA, 7 IMPUESTO, 14 MERCADO LIBRE, 21 NOTICIA. The other 4 specials (Banco Central, R+D, Noticia ×2, Impuesto ×1, etc.) distributed; port positions from the source.

```ts
// src/lib/games/econopoly/board.ts
import type { Cell, SectorId } from './types';
import { BOARD_SIZE } from './constants';

export const SECTOR_IDS: SectorId[] = ['A','B','C','D','E','F','G','H'];
export const SECTOR_LABEL: Record<SectorId, string> = {
  A: 'Tecnología', B: 'Salud', C: 'Energía', D: 'Banca',
  E: 'Alimentación', F: 'Industria', G: 'Lujo', H: 'Inmobiliario',
};
// Paired palette colors (4 accents, 2 sectors each)
export const SECTOR_COLOR: Record<SectorId, string> = {
  A: '#1F6E6E', B: '#1F6E6E',  // teal
  C: '#A87A2A', D: '#A87A2A',  // mostaza
  E: '#C44E2C', F: '#C44E2C',  // terracota
  G: '#2E5E3A', H: '#2E5E3A',  // pi
};

// PORT FROM webpde/econopoly.html. Each non-corner non-special is a property.
export const CELLS: Cell[] = [
  { id: 0,  kind: 'start',       label: 'SALIDA' },
  { id: 1,  kind: 'property',    label: 'DataLabs',     property: { sector: 'A', label: 'DataLabs',     basePrice: 120, baseRent: 12 } },
  { id: 2,  kind: 'property',    label: 'SaaS Ibérica', property: { sector: 'A', label: 'SaaS Ibérica', basePrice: 140, baseRent: 14 } },
  { id: 3,  kind: 'news',        label: 'Noticia' },
  { id: 4,  kind: 'property',    label: 'SolarMed',     property: { sector: 'C', label: 'SolarMed',     basePrice: 180, baseRent: 18 } },
  { id: 5,  kind: 'property',    label: 'Eólica Norte', property: { sector: 'C', label: 'Eólica Norte', basePrice: 200, baseRent: 20 } },
  { id: 6,  kind: 'rd',          label: 'R+D' },
  { id: 7,  kind: 'tax',         label: 'IMPUESTO' },
  // ... PORT the remaining 20 cells (8-27) from the old source, keeping sectors paired and corners at 14 and 21 ...
];

export const cellById = (id: number) => CELLS[id];
export const properties = () => CELLS.filter((c) => c.kind === 'property');
export const sectorCellIds = (s: SectorId): number[] =>
  CELLS.filter((c) => c.property?.sector === s).map((c) => c.id);
```

- [ ] **Step 3: Write `board.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { CELLS, SECTOR_IDS, sectorCellIds, SECTOR_COLOR } from './board';
import { BOARD_SIZE } from './constants';

describe('econopoly board', () => {
  it(`has exactly ${BOARD_SIZE} cells`, () => { expect(CELLS.length).toBe(BOARD_SIZE); });
  it('cells are numbered 0..27 in order', () => {
    CELLS.forEach((c, i) => expect(c.id).toBe(i));
  });
  it('has the 4 corners at positions 0, 7, 14, 21 with the right kinds', () => {
    expect(CELLS[0].kind).toBe('start');
    expect(CELLS[7].kind).toBe('tax');
    expect(CELLS[14].kind).toBe('freemarket');
    expect(CELLS[21].kind).toBe('news');
  });
  it('has exactly 16 property cells, paired into 8 sectors of 2', () => {
    const props = CELLS.filter((c) => c.kind === 'property');
    expect(props.length).toBe(16);
    for (const s of SECTOR_IDS) {
      expect(sectorCellIds(s).length).toBe(2);
    }
  });
  it('the 8 sectors share 4 accent colors (A-B, C-D, E-F, G-H)', () => {
    expect(SECTOR_COLOR.A).toBe(SECTOR_COLOR.B);
    expect(SECTOR_COLOR.C).toBe(SECTOR_COLOR.D);
    expect(SECTOR_COLOR.E).toBe(SECTOR_COLOR.F);
    expect(SECTOR_COLOR.G).toBe(SECTOR_COLOR.H);
    expect(new Set([SECTOR_COLOR.A, SECTOR_COLOR.C, SECTOR_COLOR.E, SECTOR_COLOR.G]).size).toBe(4);
  });
  it('every property has positive base price and rent', () => {
    for (const c of CELLS.filter((c) => c.kind === 'property')) {
      expect(c.property!.basePrice).toBeGreaterThan(0);
      expect(c.property!.baseRent).toBeGreaterThan(0);
    }
  });
});
```

Also create `src/lib/games/econopoly/constants.ts` with the constants block at the top of this plan (exported).

- [ ] **Step 4: Run** — `npx vitest run src/lib/games/econopoly/board.test.ts` — port until green.
- [ ] **Step 5: Commit** — `git add ... && git commit -m "feat(econopoly): port 28-cell board and 8 sectors"`

---

## Task 3: News cards (port)

**Files:** Create `src/lib/games/econopoly/events.ts`

- [ ] **Step 1: Port ~20 cards** from the old source. Map each to a `NewsCard` with one of the `kind`s (`bonusCash` / `penaltyCash` / `rateChange` / `sectorBoost` / `sectorBust` / `taxHoliday` / `none`) plus `amount` / `sector` when relevant.

```ts
import type { NewsCard } from './types';
export const NEWS_CARDS: NewsCard[] = [
  { id: 'subsidy',     text: 'Subsidio gubernamental: recibes 100 €.',                    kind: 'bonusCash',    amount: 100 },
  { id: 'fine',        text: 'Multa por infracción: pagas 80 €.',                         kind: 'penaltyCash',  amount: 80 },
  { id: 'rate_up',     text: 'El Banco Central sube tipos +1 punto.',                     kind: 'rateChange',   amount: 1 },
  { id: 'tech_boom',   text: 'Boom tecnológico: rentas de Tecnología +50% este turno.',  kind: 'sectorBoost',  sector: 'A' },
  // ... PORT the rest (~20 total) from webpde/econopoly.html ...
];
```

- [ ] **Step 2: Commit** — `git add ... && git commit -m "feat(econopoly): port news cards"`

---

## Task 4: Engine (pure rules, TDD)

**Files:** Create `src/lib/games/econopoly/engine.ts`, `engine.test.ts`

Exports: `createInitialState(players: { name: string; color: string; isHuman: boolean }[])`, `rollDice(rng?)`, `move(state, steps)`, `computeRent(state, cellId)`, `resolveCell(state, rng?)`, `buyProperty(state, cellId)`, `startAuction(state, cellId)`, `auctionBid(state, amount)`, `auctionPass(state)`, `upgradeRd(state, cellId)`, `applyTax(state)`, `applyNewsCard(state, rng?)`, `advancePhase(state, rng?)`, `endTurn(state, rng?)`, `netWorth(state, playerId)`, `giniIndex(state)`, `checkVictory(state)`.

- [ ] **Step 1: Write failing tests** (representative core)

```ts
import { describe, it, expect } from 'vitest';
import {
  createInitialState, rollDice, move, computeRent, resolveCell, buyProperty,
  startAuction, auctionBid, auctionPass, upgradeRd, applyTax, advancePhase,
  endTurn, netWorth, giniIndex, checkVictory,
} from './engine';
import { CELLS, sectorCellIds } from './board';
import {
  INITIAL_CASH, RD_MULTIPLIERS, MONOPOLY_BONUS, CYCLE_RENT, PASS_START_BONUS,
  TAX_BRACKETS, AUCTION_MIN_INCREMENT, TOTAL_ROUNDS,
} from './constants';

const PLAYERS = [
  { name: 'Lara',  color: '#1F6E6E', isHuman: true },
  { name: 'Marc',  color: '#C44E2C', isHuman: false },
];
const seq = (vals: number[]) => { let i = 0; return () => vals[i++ % vals.length]; };

describe('econopoly engine', () => {
  it('initial state: cash, positions, phase, cycle', () => {
    const s = createInitialState(PLAYERS);
    expect(s.players.length).toBe(2);
    for (const p of s.players) { expect(p.cash).toBe(INITIAL_CASH); expect(p.position).toBe(0); expect(p.alive).toBe(true); }
    expect(s.round).toBe(1);
    expect(s.phase).toBe('roll');
    expect(s.cycle).toBe('expansion');
    expect(s.winner).toBeNull();
  });

  it('rollDice produces 1..6 for each die deterministically with rng', () => {
    const r = rollDice(seq([0.0, 0.99]));
    expect(r.d1).toBe(1); expect(r.d2).toBe(6);
  });

  it('move wraps around 28 cells and grants PASS_START_BONUS when crossing 0', () => {
    const s = createInitialState(PLAYERS);
    s.players[0].position = 25;
    const before = s.players[0].cash;
    const next = move(s, 5); // 25 + 5 = 30 → wraps to 2, crossed start
    expect(next.players[0].position).toBe(2);
    expect(next.players[0].cash).toBe(before + PASS_START_BONUS);
  });

  it('computeRent applies R+D × cycle × monopoly bonus', () => {
    const s = createInitialState(PLAYERS);
    // give player 1 both properties of sector A → monopoly
    const sectorA = sectorCellIds('A');
    for (const cid of sectorA) s.properties[cid] = { cellId: cid, owner: 1, rdLevel: 1 };
    s.cycle = 'expansion';
    const rent = computeRent(s, sectorA[0]);
    const base = CELLS[sectorA[0]].property!.baseRent;
    const expected = base * RD_MULTIPLIERS[1] * CYCLE_RENT.expansion * MONOPOLY_BONUS;
    expect(rent).toBeCloseTo(expected, 2);
  });

  it('buyProperty transfers cash and ownership', () => {
    const s = createInitialState(PLAYERS); s.phase = 'resolve';
    const cellId = sectorCellIds('A')[0];
    s.players[0].position = cellId;
    s.pendingPurchase = cellId;
    const before = s.players[0].cash;
    const next = buyProperty(s, cellId);
    expect(next.properties[cellId].owner).toBe(0);
    expect(next.players[0].cash).toBe(before - CELLS[cellId].property!.basePrice);
    expect(next.pendingPurchase).toBeNull();
  });

  it('startAuction + bid + pass: highest bid wins; if no bid, property stays free', () => {
    const s = createInitialState(PLAYERS); s.phase = 'resolve';
    const cellId = sectorCellIds('A')[0];
    s.players[0].position = cellId;
    let s2 = startAuction(s, cellId);
    expect(s2.activeAuction).not.toBeNull();
    s2 = auctionBid(s2, CELLS[cellId].property!.basePrice + AUCTION_MIN_INCREMENT);
    s2 = auctionPass(s2); // other player passes
    expect(s2.activeAuction).toBeNull();
    expect(s2.properties[cellId].owner).toBe(0); // bidder won
  });

  it('upgradeRd costs RD_UPGRADE_COST_PCT of base price and advances level', () => {
    const s = createInitialState(PLAYERS); s.phase = 'action';
    const cellId = sectorCellIds('A')[0];
    s.properties[cellId] = { cellId, owner: 0, rdLevel: 0 };
    const cost = CELLS[cellId].property!.basePrice * 0.5;
    const cashBefore = s.players[0].cash;
    const next = upgradeRd(s, cellId);
    expect(next.properties[cellId].rdLevel).toBe(1);
    expect(next.players[0].cash).toBe(cashBefore - cost);
  });

  it('applyTax: progressive 5/10/15% on net worth, added to publicFund', () => {
    const s = createInitialState(PLAYERS);
    s.players[0].cash = 400; // <500 → 5%
    const before = s.publicFund;
    const next = applyTax({ ...s, current: 0 });
    expect(next.publicFund).toBe(before + 20);   // 400 * 5%
    expect(next.players[0].cash).toBe(400 - 20);
  });

  it('giniIndex is 0 when all players have equal net worth', () => {
    const s = createInitialState(PLAYERS);
    expect(giniIndex(s)).toBeCloseTo(0, 2);
  });

  it('checkVictory: at round > TOTAL_ROUNDS, highest net worth wins', () => {
    const s = createInitialState(PLAYERS);
    s.round = TOTAL_ROUNDS + 1;
    s.players[0].cash = 5000; s.players[1].cash = 1000;
    expect(checkVictory(s)).toBe(0);
  });

  it('endTurn advances current to next alive player; round++ on wrap', () => {
    const s = createInitialState(PLAYERS);
    s.phase = 'action';
    const next = endTurn(s);
    expect(next.current).toBe(1);
    const next2 = endTurn(next);
    expect(next2.current).toBe(0);
    expect(next2.round).toBe(2);
  });

  it('cycle alternates expansion/recession every CYCLE_LENGTH rounds', () => {
    let s = createInitialState(PLAYERS);
    for (let r = 1; r <= 6; r++) {
      s.round = r;
      // simulate a full round wrap by calling endTurn twice
      s.current = s.players.length - 1; s.phase = 'action';
      s = endTurn(s);
    }
    // after round 5 → should flip to recession
    expect(s.cycle).toBe('recession');
  });
});
```

- [ ] **Step 2: Run to verify failure** — `npx vitest run src/lib/games/econopoly/engine.test.ts` → FAIL.

- [ ] **Step 3: Implement `engine.ts`** — implement every export per the rules in the spec §5. Key implementation notes:
  - `createInitialState(players)`: validate 1-6 players; init properties map with all property cells `owner=null, rdLevel=0`; randomize player order? (use insertion order); cycle=expansion, cbRate=CB_INITIAL_RATE, publicFund=0.
  - `move(state, steps)`: `newPos = (oldPos + steps) % BOARD_SIZE`; if wrap (newPos < oldPos or steps >= BOARD_SIZE), award `PASS_START_BONUS + floor(publicFund * PUBLIC_FUND_SHARE_PCT)` and reduce publicFund accordingly.
  - `resolveCell(state, rng?)`: dispatch on `cells[player.position].kind`: 
    - `'start'`: no extra effect (the move already handled the bonus).
    - `'tax'`: call `applyTax(state)`.
    - `'news'`: call `applyNewsCard(state, rng)`.
    - `'cb'`: bump rate (+/-1) within `CB_RATE_RANGE`.
    - `'rd'`: flag that the player can upgrade R+D this action phase (no immediate effect; UI surfaces it).
    - `'freemarket'`: nothing (no rent).
    - `'property'`: if `owner === null` → set `pendingPurchase = cellId` (UI offers buy/pass); else if `owner !== current` → pay rent via `computeRent` (capped by cash); else nothing.
  - `computeRent(state, cellId)`: `baseRent * RD_MULTIPLIERS[rdLevel] * CYCLE_RENT[cycle] * (controlsSector ? MONOPOLY_BONUS : 1)`. Round to integer.
  - `buyProperty(state, cellId)`: charge price (rounded by cycle if needed; for simplicity use basePrice), set owner = current; clear `pendingPurchase`.
  - `startAuction`: set `activeAuction = { cellId, currentBidder: next player after current, highestBid: basePrice - AUCTION_MIN_INCREMENT, highestBidder: null, passed: [] }`. Clear pendingPurchase.
  - `auctionBid(state, amount)`: validate `amount >= highestBid + AUCTION_MIN_INCREMENT` and `amount <= currentBidder.cash`; set highestBid/highestBidder; reset `passed` (anyone who passed can act again? — keep it simple: passing is sticky; the auction ends when all OTHER players have passed). Advance `currentBidder` to the next non-passed player.
  - `auctionPass(state)`: add currentBidder to passed; advance to next non-passed; if only the highest bidder remains (or all passed), end auction: if `highestBidder !== null` → transfer property; else → leave free.
  - `upgradeRd(state, cellId)`: only owner, only in `phase==='action'`, only if `rdLevel < 3`, only if cash ≥ cost; bump level, deduct cash.
  - `applyTax(state)`: compute current player's net worth; find bracket; deduct, add to publicFund.
  - `applyNewsCard(state, rng?)`: draw one via rng; apply by `kind` (cash bonus/penalty to current; rateChange to cbRate within range; sectorBoost/Bust = temporary flag effective until endTurn; taxHoliday = flag; none = flavour only).
  - `advancePhase`: roll→resolve→action; in 'action' the human ends with explicit endTurn.
  - `endTurn`: clear per-turn temp flags (sector boost/bust, taxHoliday, lastEvent display marker); advance `current` to next alive; if wrap, `round++`; flip `cycle` if `(round-1) % CYCLE_LENGTH === 0` and round>1; recompute victory.
  - `netWorth(state, pid)`: cash + sum of (basePrice * RD_MULTIPLIERS[rdLevel] * CYCLE_PROPERTY[cycle]) for owned properties.
  - `giniIndex(state)`: classic Gini on the array of alive net worths (sort asc, sum |xi-xj| / 2*n*sum or the formula `(2*sum(i*xi) - (n+1)*sum(xi)) / (n*sum(xi))`).
  - `checkVictory`: only at `round > TOTAL_ROUNDS` → argmax netWorth among alive players; else null.

- [ ] **Step 4: Run to verify pass** — `npx vitest run src/lib/games/econopoly/engine.test.ts` → all green.
- [ ] **Step 5: Commit** — `git add ... && git commit -m "feat(econopoly): pure engine with tests"`

---

## Task 5: AI (TDD)

**Files:** Create `src/lib/games/econopoly/ai.ts`, `ai.test.ts`

Export `aiTakeTurn(state, rng?): GameState` — plays the current AI player's full turn (roll→resolve→action→endTurn). Also `aiAuctionDecide(state): { kind: 'bid'; amount: number } | { kind: 'pass' }`.

- [ ] **Step 1: Failing test**

```ts
import { describe, it, expect } from 'vitest';
import { createInitialState } from './engine';
import { aiTakeTurn, aiAuctionDecide } from './ai';
const seq = (vals: number[]) => { let i = 0; return () => vals[i++ % vals.length]; };
const PLAYERS = [{ name: 'Lara', color: '#1F6E6E', isHuman: true }, { name: 'Marc', color: '#C44E2C', isHuman: false }];

describe('econopoly AI', () => {
  it('plays a full turn and advances to the next player', () => {
    const s = createInitialState(PLAYERS); s.current = 1; s.phase = 'roll';
    const next = aiTakeTurn(s, () => 0.5);
    expect(next.current).not.toBe(1);
    expect(next.players.length).toBe(2);
  });
  it('decides to bid up to a reasonable cap and pass otherwise', () => {
    const s = createInitialState(PLAYERS);
    s.activeAuction = { cellId: 1, currentBidder: 1, highestBid: 50, highestBidder: 0, passed: [] };
    const d = aiAuctionDecide({ ...s, current: 1 });
    expect(d.kind === 'bid' || d.kind === 'pass').toBe(true);
  });
});
```

- [ ] **Step 2: Run → FAIL.**
- [ ] **Step 3: Implement** using only engine public functions:
  - Roll: call `advancePhase` (rng), which moves the player.
  - Resolve: `advancePhase` resolves the cell; if `pendingPurchase` and `cash >= 2*basePrice` and the sector is open → `buyProperty`; else `startAuction`. While `activeAuction !== null` and `currentBidder === aiId`, call `auctionBid` or `auctionPass` per `aiAuctionDecide`. (The other players still ai-decide too — keep it within the same call: while any AI is the current bidder, drive their decisions; if a human is the current bidder, return state and let the UI prompt them.)
  - Action: greedy R+D upgrade on the AI's most rentable owned property if affordable (cash > 2× cost and `rdLevel < 3`).
  - End turn.
  - `aiAuctionDecide`: bid `highestBid + AUCTION_MIN_INCREMENT` while it's ≤ `min(0.5 * cash, estimatedValue)`, where `estimatedValue = computeRent * 8` (estimate 8 rounds of rent); else pass.
- [ ] **Step 4: Run → PASS.**
- [ ] **Step 5: Commit** — `git add ... && git commit -m "feat(econopoly): AI with tests"`

---

## Task 6: Styles

**Files:** Create `src/components/games/econopoly/econopoly.css`

- [ ] **Step 1:** Port the validated mockup v2 styling (`.ep2-*` shapes from `.superpowers/brainstorm/.../econopoly-board-v2.html`): full-width frame, top bar, 8×8 grid board with cells (chip A-H, name, price, sector left border), corners + specials, center with cycle protagonist (Fraunces italic), tokens (discs without letters), side panel with phase bar + player card + hand grid + econ strip + action, auction modal styling, setup/end screens. Use the project `--color-*` vars where they exist; faction/player colors as constants. **No gradients, no emojis.**
- [ ] **Step 2: Commit** — `git commit -m "feat(econopoly): Variant C game styles"`

---

## Task 7: BoardView

**Files:** Create `src/components/games/econopoly/BoardView.tsx`

- [ ] **Step 1: Implement** as a CSS-grid 8×8 board rendering the 28 cells in clockwise order from position 0:
  - Cells flow into the grid such that positions 0..7 are the top row, 8..13 are the right column (rows 1..6), 14..20 are the bottom row (reversed visually: rightmost first to maintain clockwise reading; OR render them left-to-right but with `id` mapping to the correct visual position), 21..27 are the left column (bottom-to-top). Use explicit `grid-column` / `grid-row` per cell rather than relying on auto-placement, so the 28→8×8 mapping is deterministic.
  - Inner 6×6 area (cols 2..7, rows 2..7 in CSS-line terms) is the **center** with the cycle protagonist text (Fraunces italic).
  - Each cell renders chip + label + price for properties; corners and specials use the `.corner` / `.special` styles.
  - Tokens for players currently on each cell are rendered as small colored discs in the cell (bottom-left).
  - `onCellClick(cellId)` optional handler for inspecting cells.

```tsx
/** @jsxImportSource preact */
import type { GameState } from '@/lib/games/econopoly/types';
import { CELLS, SECTOR_COLOR } from '@/lib/games/econopoly/board';

// Map id 0..27 to (row, col) on an 8x8 grid clockwise from top-left
function pos(id: number): { row: number; col: number } {
  if (id <= 7) return { row: 1, col: id + 1 };                    // top row (CSS 1-indexed)
  if (id <= 13) return { row: id - 6, col: 8 };                   // right col rows 2..7
  if (id <= 20) return { row: 8, col: 8 - (id - 14) };            // bottom row right-to-left
  return { row: 8 - (id - 21), col: 1 };                          // left col bottom-to-top
}

export function BoardView({ state, onCellClick }: { state: GameState; onCellClick?: (id: number) => void }) {
  return (
    <div class="ep2-board">
      <div class="ep2-center">
        <div class="round-lab">Ronda {state.round} / 20</div>
        <div class={`pro serif-it${state.cycle === 'recession' ? ' rec' : ''}`}>
          {state.cycle === 'expansion' ? 'Expansión' : 'Recesión'}
        </div>
      </div>
      {CELLS.map((c) => {
        const p = pos(c.id);
        const tokens = state.players.filter((pl) => pl.alive && pl.position === c.id);
        const sectorClass = c.property ? `sec-${c.property.sector}` : '';
        const classes = `ep2-cell ${c.kind === 'property' ? sectorClass : c.kind === 'start' || c.kind === 'tax' || c.kind === 'freemarket' || c.kind === 'news' && (c.id === 21) ? 'corner' : c.kind !== 'property' ? 'special' : ''}`;
        return (
          <div key={c.id} class={classes} style={{ gridColumn: p.col, gridRow: p.row }} onClick={() => onCellClick?.(c.id)}>
            {c.property ? (
              <>
                <span class={`chip ${c.property.sector}`}>{c.property.sector}{c.id % 2 ? 2 : 1}</span>
                <div class="nm">{c.property.label}</div>
                <div class="pr">{c.property.basePrice} €</div>
              </>
            ) : c.id === 0 || c.id === 7 || c.id === 14 || c.id === 21 ? (
              <><div class="cl">{c.label}</div></>
            ) : (
              <><div class="sl">{c.label}</div></>
            )}
            {tokens.map((t, i) => (
              <span key={t.id} class={`tok2 t${i + 1}${state.current === state.players.indexOf(t) ? ' active' : ''}`} style={{ background: t.color }} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
```

> Note: simplify the `classes` computation in implementation (the inline ternary above is illustrative; refactor into a small helper for readability).

- [ ] **Step 2: Commit** — `git commit -m "feat(econopoly): board view"`

---

## Task 8: AuctionModal

**Files:** Create `src/components/games/econopoly/AuctionModal.tsx`

- [ ] **Step 1: Implement** as an overlay shown when `state.activeAuction !== null`. Props: `{ state, onBid(amount), onPass }`. Display: property name + sector chip, base price, current highest bid + bidder name (or "—"), the queue (who has passed, who is next to act). Two buttons: `Oferir +{AUCTION_MIN_INCREMENT} €` (disabled if next-bid > current player's cash) and `Pasar`. Only render the buttons when `currentBidder === activeHumanId`; otherwise show "Esperando a {name}…".

- [ ] **Step 2: Commit** — `git commit -m "feat(econopoly): auction overlay"`

---

## Task 9: Other screens

**Files:** `SetupScreen.tsx`, `SidePanel.tsx`, `PhaseBar.tsx` (or fold into SidePanel), `PassDeviceScreen.tsx`, `EndScreen.tsx`

- [ ] **Step 1: `SetupScreen.tsx`** — props `{ onStart(players) }`. Pick 1-6 players with name input + color picker (6 preset colors). Require ≥1 human (Setup-screen guard, like Econrisk). "Empezar".
- [ ] **Step 2: `SidePanel.tsx`** — props `{ state, onAdvancePhase, onRollDice, onUpgradeRd, onBuyPending, onPassPending }`. Phase bar (Tirar/Resolver/Acción), current player card (color stripe, name, cash, net worth, position), hand grid (mini property cards with sector chip and R+D level), econ strip (BC rate, Gini, fund), phase-specific action area (buttons for roll/buy/auction/upgrade/end turn).
- [ ] **Step 3: `PassDeviceScreen.tsx`** — props `{ playerName, color, onReady }`. "Pasa el dispositivo a {name}" + "Estoy listo".
- [ ] **Step 4: `EndScreen.tsx`** — props `{ state, onRestart }`. Sorted ranking (1st..Nth) by net worth, final Gini, per-player highlights, "Jugar otra vez".
- [ ] **Step 5: Commit** — `git commit -m "feat(econopoly): screens"`

---

## Task 10: Root island (state machine + AI driver + auction driver)

**Files:** Create `src/components/games/econopoly/EconopolyGame.tsx`

- [ ] **Step 1: Implement** with strict SSR-safety (mirror `StonksGame.tsx` / `EconriskGame.tsx`):
  - State: `state: GameState | null` (null until setup), `ui: 'setup' | 'pass' | 'playing' | 'finished'`, `hasSave: boolean`.
  - **NEVER** read `localStorage` in initializer or render — load in `useEffect`, set `hasSave`.
  - **AI driver** (`useEffect([state, ui])` + ref guard `aiPending`): when current player is AI and ui==='playing' and no winner and no active auction (or auction's current bidder is AI), call `aiTakeTurn` (or the auction-step variant) after ~700ms. Re-validate inside the callback.
  - **Auction flow**: when `state.activeAuction !== null`, show `<AuctionModal>`. If the current bidder is human, surface bid/pass buttons; if AI, let the AI driver drive.
  - **Property landing on human**: when `state.pendingPurchase !== null`, surface "Comprar por X €" / "Pasar (subastar)" buttons in SidePanel action area; the AI driver handles AI buy/auction decisions.
  - **Hot-seat pass**: when the next current player is human and different from the last human who acted, show `<PassDeviceScreen>` first.
  - **Persistence**: `makeGameStorage('econopoly')`, save on state change (non-setup), clear on finish, set hasSave=false on clear/restart.
  - Import `'./econopoly.css'`.
- [ ] **Step 2: Build** — `npm run build 2>&1 | tail -6` succeeds.
- [ ] **Step 3: Commit** — `git commit -m "feat(econopoly): root island state machine + AI/auction driver"`

---

## Task 11: Route + landing

**Files:** Create `src/pages/juegos/econopoly/index.astro`; modify `src/pages/juegos/index.astro`.

- [ ] **Step 1: Route**

```astro
---
import GameShell from '@components/games/GameShell.astro';
import EconopolyGame from '@components/games/econopoly/EconopolyGame.tsx';
---
<GameShell title="Econopoly" wide>
  <EconopolyGame client:load />
</GameShell>
```

- [ ] **Step 2: Landing** — add an "Disponible" card for Econopoly to `/juegos/`, alongside Stonks and Econrisk. Keep the rest "pendientes" (playground 10, concurso, insider, communist). Match the existing Variant C styling.
- [ ] **Step 3: Build** — confirm `dist/juegos/econopoly/index.html` generated.
- [ ] **Step 4: Commit** — `git commit -m "feat(econopoly): route + surface in /juegos landing"`

---

## Task 12: Full verification + playtest

- [ ] **Step 1:** `npx vitest run 2>&1 | tail -5` — all pass (existing + econopoly tests).
- [ ] **Step 2:** `npm run build 2>&1 | tail -5` — green.
- [ ] **Step 3: Manual playtest** — `npm run dev` → `/juegos/econopoly/`: setup 1 human + 3 AI, play several rounds — verify dice roll, movement (PASS_START bonus on wrap), buying at face, declining → auction (AI bids), rent payment, R+D upgrade, tax square (progressive), news card draw, cycle transition at round 6/11/16, BC rate change, Gini updating, end at round 20 with correct ranking. Resume mid-game via "Continuar". Variant C look correct.
- [ ] **Step 4: Commit** any playtest tweaks.

---

## Self-Review notes (author)

- **Spec coverage:** framework reuse (route/GameShell `wide`/storage) ✔ T10-T11; board 28 cells ported ✔ T2; engine: movement/rent/R+D/cycles/CB/tax/public fund/news/Gini/victory ✔ T4; simplified single-round auction ✔ T4,T8,T10; AI for turns + auction bidding ✔ T5; SSR-safe persistence ✔ T10; ES-only, Variant C with 4-accent paired palette + A-H chips ✔ T6,T7; networked multiplayer NOT built.
- **Port-not-invent:** board layout (T2) and event cards (T3) ported from `webpde/econopoly.html` with structural tests; constants in this plan are explicit defaults to avoid guessing during implementation.
- **Type consistency:** `GameState` fields used across engine/AI/UI defined in T1; engine exports used by AI (T5) and island (T10) match; auction state shape consistent between engine and AuctionModal.
- **Tricky bits flagged:** the 28→8×8 grid mapping (T7) is non-trivial — implement via the `pos()` helper with explicit grid placement, don't rely on auto-flow. The auction needs to handle AI-only bidders (advance currentBidder past humans waiting) — the engine API is sufficient; the island drives via `aiAuctionDecide`.
- **SSR/AI-driver pattern:** mirror `EconriskGame.tsx` exactly (load storage in useEffect; aiPending ref guard; 700ms timeout; re-validate inside callback).
