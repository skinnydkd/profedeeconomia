# Carátulas de los juegos — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give each game on the `/juegos/` hub a recognizable cover plate — a solid identity-colour band with a unique abstract SVG motif — keeping the editorial-sober look.

**Architecture:** A pure-data motif registry (`caratula-motifs.ts`) maps each game `slug` to inline SVG markup; a small presentational Astro component (`JuegoCaratula.astro`) wraps it in a coloured plate; the hub (`index.astro`) renders the plate above the existing text body. The game's identity colour is added to `JUEGOS` as the single source of truth. A unit test guards that every game has a colour and a motif.

**Tech Stack:** Astro 5, TypeScript, Vitest 4, inline SVG/CSS (no raster images, no new deps).

**Spec:** `docs/superpowers/specs/2026-06-18-juego-caratulas-design.md`
**Mockup (validated):** `mockups/juegos-caratulas/index.html`

## Global Constraints

- Identity colour lives **only on the plate** (decorative). Card body keeps the functional terracota for eyebrow/CTA. No coloured small text that would fail WCAG AA.
- Trace colour of every motif is cream `#FBF6EC`.
- No emojis, mascots, stock illustration, or gradients. No raster images.
- The plate/SVG is decorative: `aria-hidden="true"` + `role="presentation"`; never the only carrier of meaning (the title is real text in the body).
- TypeScript strict, no `any`. Files kebab-case, components PascalCase.
- Conventional Commits, English. Branch `feat/juego-caratulas` (already created). Never push to main.
- Identity colours (hex, from the validated palette):
  `stonks #1F6E6E` · `econrisk #C44E2C` · `econopoly #A87A2A` · `cajut #5B3A4E` · `seguros #2E5E3A` · `insider #8C2F39`.

---

### Task 1: Motif registry

**Files:**
- Create: `src/components/juegos/caratula-motifs.ts`
- Test: `src/components/juegos/caratula-motifs.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `MOTIFS: Record<string, string>` — slug → inner SVG markup (no `<svg>` wrapper).
  - `FALLBACK_MOTIF: string` — neutral motif for unknown slugs.
  - `MOTIF_SLUGS: Set<string>` — `new Set(Object.keys(MOTIFS))`.
  - `getMotif(slug: string): string` — `MOTIFS[slug] ?? FALLBACK_MOTIF`.

- [ ] **Step 1: Write the failing test**

Create `src/components/juegos/caratula-motifs.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/juegos/caratula-motifs.test.ts`
Expected: FAIL — cannot resolve `./caratula-motifs`.

- [ ] **Step 3: Write minimal implementation**

Create `src/components/juegos/caratula-motifs.ts`:

```ts
/**
 * Cover-plate motifs for the games on the /juegos/ hub. Each entry is the INNER
 * SVG markup (paths/shapes only) for a plate with viewBox "0 0 320 132"; the
 * <svg> wrapper and the cream stroke live in JuegoCaratula.astro. Ported from the
 * validated mockup at mockups/juegos-caratulas/index.html (direction A).
 */
const CREAM = '#FBF6EC';

/** 6×3 dot grid with one highlighted dot — Insider's "hidden one". */
function insiderGrid(): string {
  let dots = '';
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 6; c++) {
      const x = 50 + c * 44;
      const y = 36 + r * 30;
      dots += `<circle cx="${x}" cy="${y}" r="4" fill="${CREAM}" stroke="none" opacity="0.55"/>`;
    }
  }
  return `${dots}<circle cx="182" cy="66" r="4" fill="${CREAM}" stroke="none"/><circle cx="182" cy="66" r="12" stroke-width="2"/>`;
}

export const MOTIFS: Record<string, string> = {
  // Rising stepped market line + vertices.
  stonks: `
    <g stroke="${CREAM}" opacity="0.28" stroke-width="1"><line x1="28" y1="104" x2="292" y2="104"/></g>
    <polyline points="28,96 78,80 118,86 162,52 206,60 250,32 292,18" stroke-width="3"/>
    <g fill="${CREAM}" stroke="none"><rect x="74" y="76" width="8" height="8"/><rect x="158" y="48" width="8" height="8"/><rect x="246" y="28" width="8" height="8"/><rect x="288" y="14" width="8" height="8"/></g>`,
  // Tessellated territory triangles, a couple filled.
  econrisk: `
    <g stroke-width="1.5" opacity="0.85"><path d="M40 96 L80 40 L120 96 Z"/><path d="M120 96 L80 40 L160 40 L120 96"/><path d="M120 96 L160 40 L200 96 Z"/><path d="M200 96 L160 40 L240 40 L200 96"/><path d="M200 96 L240 40 L280 96 Z"/></g>
    <path d="M120 96 L80 40 L160 40 L120 96" fill="${CREAM}" opacity="0.9" stroke="none"/>
    <path d="M200 96 L240 40 L280 96 Z" fill="${CREAM}" opacity="0.4" stroke="none"/>`,
  // Square spiral board with a marked node.
  econopoly: `
    <g stroke-width="2"><rect x="40" y="22" width="240" height="88"/><rect x="64" y="36" width="192" height="60"/><rect x="88" y="50" width="144" height="32"/></g>
    <circle cx="40" cy="22" r="6" fill="${CREAM}" stroke="none"/>
    <circle cx="280" cy="110" r="6" fill="${CREAM}" stroke="none" opacity="0.5"/>`,
  // Concentric signal arcs (quiz buzz).
  cajut: `
    <g stroke-width="2.5"><path d="M46 110 A 28 28 0 0 1 74 82"/><path d="M46 110 A 58 58 0 0 1 104 52"/><path d="M46 110 A 88 88 0 0 1 134 22"/></g>
    <circle cx="46" cy="110" r="6" fill="${CREAM}" stroke="none"/>`,
  // Shelter dome over dots (covered vs exposed).
  seguros: `
    <path d="M70 92 A 90 90 0 0 1 250 92" stroke-width="3"/>
    <line x1="160" y1="20" x2="160" y2="44" stroke-width="2.5"/>
    <g fill="${CREAM}" stroke="none"><circle cx="120" cy="84" r="5"/><circle cx="160" cy="80" r="5"/><circle cx="200" cy="84" r="5"/></g>
    <g fill="${CREAM}" stroke="none" opacity="0.4"><circle cx="60" cy="104" r="5"/><circle cx="270" cy="104" r="5"/></g>`,
  // Regular dot grid with one singled out.
  insider: insiderGrid(),
};

/** Neutral motif for games without a bespoke one (e.g. future "próximamente"). */
export const FALLBACK_MOTIF = `
  <circle cx="160" cy="66" r="34" stroke-width="2"/>
  <circle cx="160" cy="66" r="6" fill="${CREAM}" stroke="none"/>`;

export const MOTIF_SLUGS: Set<string> = new Set(Object.keys(MOTIFS));

export function getMotif(slug: string): string {
  return MOTIFS[slug] ?? FALLBACK_MOTIF;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/juegos/caratula-motifs.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/juegos/caratula-motifs.ts src/components/juegos/caratula-motifs.test.ts
git commit -m "feat(juego-caratulas): SVG motif registry for game cover plates"
```

---

### Task 2: Identity colour on each game

**Files:**
- Modify: `src/lib/juegos.ts` (interface `Juego` + the 6 `JUEGOS` entries)
- Test: `src/components/juegos/caratula-motifs.test.ts` (append a block)

**Interfaces:**
- Consumes: `MOTIF_SLUGS`, `getMotif` (Task 1); `JUEGOS` (existing).
- Produces: `Juego.color: string` populated for all 6 games.

- [ ] **Step 1: Write the failing test**

Append to `src/components/juegos/caratula-motifs.test.ts` (relative import — Vitest has no
`@/` alias; every existing test uses relative paths):

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/juegos/caratula-motifs.test.ts`
Expected: FAIL — TypeScript error / `j.color` is `undefined` (property does not exist on `Juego`).

- [ ] **Step 3: Add the `color` field — interface**

In `src/lib/juegos.ts`, inside `export interface Juego`, add after the `href` field:

```ts
  /** Identity colour for the game's cover plate on the hub. Hex from the validated
   *  palette; single source of truth for the carátula. */
  color: string;
```

- [ ] **Step 4: Add the `color` value to each of the 6 games**

In `src/lib/juegos.ts`, add a `color` line to each `JUEGOS` entry (place it right after each game's `href`):

- `stonks` → `color: '#1F6E6E',`
- `econrisk` → `color: '#C44E2C',`
- `econopoly` → `color: '#A87A2A',`
- `cajut` → `color: '#5B3A4E',`
- `seguros` → `color: '#2E5E3A',`
- `insider` → `color: '#8C2F39',`

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/components/juegos/caratula-motifs.test.ts`
Expected: PASS (all blocks).

- [ ] **Step 6: Typecheck**

Run: `npm run check`
Expected: no new errors in `juegos.ts` or the test.

- [ ] **Step 7: Commit**

```bash
git add src/lib/juegos.ts src/components/juegos/caratula-motifs.test.ts
git commit -m "feat(juego-caratulas): identity colour per game in JUEGOS"
```

---

### Task 3: Carátula component + hub integration

**Files:**
- Create: `src/components/juegos/JuegoCaratula.astro`
- Modify: `src/pages/juegos/index.astro` (card markup + card CSS)

**Interfaces:**
- Consumes: `getMotif` (Task 1); `Juego.color` (Task 2).
- Produces: `<JuegoCaratula slug={string} color={string} />` — a decorative coloured plate.

- [ ] **Step 1: Create the component**

Create `src/components/juegos/JuegoCaratula.astro`:

```astro
---
import { getMotif } from './caratula-motifs';

interface Props {
  slug: string;
  color: string;
}

const { slug, color } = Astro.props;
const motif = getMotif(slug);
---

<div class="caratula" style={`--gc-color: ${color}`}>
  <svg
    viewBox="0 0 320 132"
    fill="none"
    stroke="#FBF6EC"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    role="presentation"
    set:html={motif}
  ></svg>
</div>

<style>
  .caratula {
    aspect-ratio: 320 / 132;
    background: var(--gc-color);
  }
  .caratula svg {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>
```

- [ ] **Step 2: Import the component in the hub**

In `src/pages/juegos/index.astro`, add to the frontmatter (after the existing imports):

```ts
import JuegoCaratula from '@/components/juegos/JuegoCaratula.astro';
```

- [ ] **Step 3: Replace the card markup**

In `src/pages/juegos/index.astro`, replace the whole `{JUEGOS.map(...)}` card block with:

```astro
{JUEGOS.map((j) => (
  <a class={`game-card ${j.estado}`} href={j.href}>
    <JuegoCaratula slug={j.slug} color={j.color} />
    <div class="gc-body">
      <div class="gc-eyebrow">
        {j.estado === 'disponible' ? 'Disponible' : 'Próximamente'}{j.tipo === 'party' && ' · Multijugador'}
      </div>
      <div class="gc-title serif">{j.title}</div>
      <p class="gc-desc">{j.descripcion}</p>
      {j.nota_aula && <p class="gc-note">{j.nota_aula}</p>}
      <span class="gc-meta">{j.nivel.map((n) => NIVEL_LABEL[n]).join(' · ')} · {j.modo}</span>
      <span class="gc-cta">{j.tipo === 'party' ? 'Abrir sala (proyector) →' : 'Jugar →'}</span>
    </div>
  </a>
))}
```

- [ ] **Step 4: Update the card CSS**

In the `<style>` block of `src/pages/juegos/index.astro`:

4a. Replace the `.game-grid` rule:

```css
.game-grid {
  margin: 2rem 0 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}
```

4b. Replace the `.game-card` and `.game-card:hover` rules (the plate now carries the colour; padding moves to the body):

```css
.game-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid var(--color-line);
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: box-shadow 0.18s ease, transform 0.18s ease;
}
.game-card:hover {
  box-shadow: 0 8px 26px 0 rgba(44, 31, 24, 0.12);
  transform: translateY(-2px);
}

.gc-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1.25rem 1.5rem 1.35rem;
}
```

4c. Delete the now-unused `.party-card` rules (3 lines at the end of the style block):

```css
.party-card { border-top-color: #5B3A4E; }
.party-card:hover { border-top-color: #3f2736; }
.party-card .gc-eyebrow, .party-card .gc-cta { color: #5B3A4E; }
```

(The `gc-eyebrow`, `gc-title`, `gc-desc`, `gc-note`, `gc-meta`, `gc-cta` rules stay as they are — they already use the functional terracota.)

- [ ] **Step 5: Typecheck + build**

Run: `npm run check`
Expected: no errors.

Run: `npm run build`
Expected: build succeeds; `/juegos/` page emitted with no errors.

- [ ] **Step 6: Visual check**

Run: `npm run dev`, open `http://localhost:4321/juegos/`.
Expected: each of the 6 cards shows its coloured plate with the right motif (Stonks teal rising line, Econrisk terracota triangles, Econopoly mostaza spiral, Cajút berenjena arcs, Asegurados verde-pino dome, Insider granate dot-grid); text body unchanged; eyebrow/CTA terracota; hover lifts the card. Verify the printable list and the "próximamente" note below still render.

- [ ] **Step 7: Commit**

```bash
git add src/components/juegos/JuegoCaratula.astro src/pages/juegos/index.astro
git commit -m "feat(juego-caratulas): render cover plates on the juegos hub"
```

---

### Task 4: Full verification

**Files:** none (verification only).

- [ ] **Step 1: Full test suite**

Run: `npm test`
Expected: all tests pass, including `caratula-motifs.test.ts`.

- [ ] **Step 2: Full build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 3: Accessibility sanity check**

In the built output for `/juegos/` (or in dev DevTools), confirm each plate `<svg>` carries `aria-hidden="true"` and `role="presentation"`, and that the accessible name of each card link is the game title + text (the plate contributes nothing).

- [ ] **Step 4: Push branch and open PR (when Pau asks)**

Do not push to main. When instructed:

```bash
git push -u origin feat/juego-caratulas
```

Open a PR `feat/juego-caratulas` → `main` summarizing the carátulas, linking the spec and the mockup.

---

## Self-Review notes

- **Spec coverage:** registry (Task 1) ✓ · `color` field + SSOT (Task 2) ✓ · component with `set:html` + decorative a11y (Task 3 step 1) ✓ · hub integration, plate-only colour, remove party border, functional terracota (Task 3 steps 3-4) ✓ · integrity test: colour defined + slug in `MOTIF_SLUGS` + non-empty motif (Tasks 1-2 tests) ✓ · fallback for future games (Task 1) ✓ · scope limited to the 6 games, no internal pages (whole plan) ✓.
- **No raster images / no new deps:** all SVG/CSS ✓.
- **Type consistency:** `getMotif`, `MOTIFS`, `MOTIF_SLUGS`, `FALLBACK_MOTIF`, `Juego.color` used with the same names/types across Tasks 1-3 ✓.
