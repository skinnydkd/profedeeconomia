# Sección «Debates» Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an independent transversal `/debates/` section (under «Otros») with its own content collection, debate-format schema, family-grouped hub, detail page with printable student worksheet, and one complete published pilot — wired to curricular units and competencias like Dinámicas.

**Architecture:** Mirror the existing Dinámicas section. Extract the generic family-grouping helpers into `src/lib/familia-grouping.ts` (shared by Dinámicas and Debates). New `debates` collection + `src/lib/debates.ts` (6 thematic families). Pages route by `[familia]/[slug]` (two single-segment params, NOT a catch-all). Print isolation reuses the proven `.print-block` + `@media print` pattern.

**Tech Stack:** Astro 5 content collections (glob loader), Zod schema, Astro components, Vitest, MDX.

---

## File structure

| File | Responsibility |
|---|---|
| `src/lib/familia-grouping.ts` (create) | Generic `groupByFamilia` / `findBrokenUnidadRefs` / `HasFamilia` / `FamiliaGroup` / `BrokenRef`, shared by Dinámicas + Debates. |
| `src/lib/familia-grouping.test.ts` (create) | Unit tests for the generic helpers. |
| `src/lib/dinamicas.ts` (modify) | Re-export the helpers from the shared module; drop the local copies. |
| `src/lib/dinamicas.test.ts` (modify) | `.dinamicas` → `.items` after the rename. |
| `src/pages/dinamicas/index.astro` (modify) | `g.dinamicas` → `g.items`. |
| `src/lib/debates.ts` (create) | `FAMILIAS_DEBATE`, `FAMILIA_DEBATE_SLUGS`, `familiaMeta`. |
| `src/lib/debates.test.ts` (create) | Families well-formed, `familiaMeta`. |
| `src/content.config.ts` (modify) | `debates` collection + schema; add to `collections`. |
| `src/lib/asignaturas.ts` (modify) | Add `debates` to `SECCIONES_TRANSVERSALES`. |
| `src/lib/asignaturas.test.ts` (modify) | Cover the `debates` menu entry. |
| `src/components/debates/DebateMeta.astro` (create) | Metadata badge row. |
| `src/components/debates/PosturaCard.astro` (create) | One debate side (label + síntesis). |
| `src/components/debates/Argumentario.astro` (create) | Arguments-per-side block for the MDX body. |
| `src/components/debates/Fases.astro` (create) | Mechanics/turns timeline for the MDX body. |
| `src/components/debates/Rubrica.astro` (create) | Criterion↔competencia table. |
| `src/components/debates/FichaAlumno.astro` (create) | Printable student worksheet (`.print-block`). |
| `src/pages/debates/index.astro` (create) | Hub, families grouped, color-coded. |
| `src/pages/debates/[familia]/[slug].astro` (create) | Detail page + `@media print` isolation. |
| `src/pages/debates/_print-isolation.test.ts` (create) | Print-isolation regression guard (`_`-prefixed → not a route). |
| `src/content/debates/mercado-estado/01-salario-minimo.mdx` (create) | The pilot. |

Reused as-is: `@components/dinamicas/PrintButton.astro`, `@components/emprendimiento/PuenteUnidades.astro`, `@layouts/BaseLayout.astro`.

---

## Task 1: Extract the shared family-grouping helpers

**Files:**
- Create: `src/lib/familia-grouping.ts`
- Create: `src/lib/familia-grouping.test.ts`
- Modify: `src/lib/dinamicas.ts` (replace local helper definitions with re-exports)
- Modify: `src/lib/dinamicas.test.ts` (`.dinamicas` → `.items`)
- Modify: `src/pages/dinamicas/index.astro` (`g.dinamicas` → `g.items`)

- [ ] **Step 1: Write the failing test** — `src/lib/familia-grouping.test.ts`

```ts
import { describe, it, expect } from 'vitest';
import { groupByFamilia, findBrokenUnidadRefs, type Familia } from './familia-grouping.ts';

const FAMS: Familia[] = [
  { slug: 'a', label: 'A', intro: '', colorVar: '--color-eco1' },
  { slug: 'b', label: 'B', intro: '', colorVar: '--color-fopp' },
];
type Item = { slug: string; data: { familia: string; orden: number; title: string;
  unidades_relacionadas: { asignatura: string; unidad: number }[] } };
const make = (slug: string, familia: string, orden: number,
  refs: Item['data']['unidades_relacionadas'] = []): Item =>
  ({ slug, data: { familia, orden, title: slug, unidades_relacionadas: refs } });

describe('groupByFamilia (generic)', () => {
  it('groups by family in the provided order, sorted by orden, dropping empty', () => {
    const groups = groupByFamilia(FAMS, [
      make('b1', 'b', 2), make('a2', 'a', 2), make('a1', 'a', 1),
    ]);
    expect(groups.map((g) => g.familia.slug)).toEqual(['a', 'b']);
    expect(groups[0].items.map((d) => d.slug)).toEqual(['a1', 'a2']);
    expect(groups[1].items.map((d) => d.slug)).toEqual(['b1']);
  });
});

describe('findBrokenUnidadRefs (generic)', () => {
  it('flags refs whose unit is not in the published set', () => {
    const items = [make('a1', 'a', 1, [
      { asignatura: 'fopp-4eso', unidad: 3 }, { asignatura: 'eeae-bach', unidad: 99 },
    ])];
    expect(findBrokenUnidadRefs(items, new Set(['fopp-4eso#3']))).toEqual([
      { slug: 'a1', asignatura: 'eeae-bach', unidad: 99 },
    ]);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/lib/familia-grouping.test.ts`
Expected: FAIL — `Cannot find module './familia-grouping.ts'`.

- [ ] **Step 3: Create `src/lib/familia-grouping.ts`**

```ts
/**
 * Generic family-grouping helpers shared by the transversal sections
 * (Dinámicas, Debates). A "familia" is a thematic bucket with a reused color
 * token; items carry `data.familia` + `data.orden` and a curriculum map.
 */

export interface Familia {
  slug: string;
  label: string;
  /** One-line intro shown at the top of the family group on a hub. */
  intro: string;
  /** CSS custom property reused for the family accent (defined in global.css). */
  colorVar: string;
}

export interface HasFamilia {
  slug: string;
  data: {
    familia: string;
    orden: number;
    title: string;
    unidades_relacionadas: { asignatura: string; unidad: number }[];
  };
}

export interface FamiliaGroup<T extends HasFamilia> { familia: Familia; items: T[]; }

/** Group items by family in the given `familias` order; within each, sort by `orden`. Empty families are dropped. */
export function groupByFamilia<T extends HasFamilia>(familias: Familia[], items: T[]): FamiliaGroup<T>[] {
  return familias
    .map((familia) => ({
      familia,
      items: items
        .filter((it) => it.data.familia === familia.slug)
        .sort((a, b) => a.data.orden - b.data.orden),
    }))
    .filter((g) => g.items.length > 0);
}

export interface BrokenRef { slug: string; asignatura: string; unidad: number; }

/** Return every `unidades_relacionadas` entry that does not match an existing published unit (keyed `asignatura#unidad`). */
export function findBrokenUnidadRefs<T extends HasFamilia>(items: T[], libroUnits: Set<string>): BrokenRef[] {
  const broken: BrokenRef[] = [];
  for (const it of items) {
    for (const u of it.data.unidades_relacionadas) {
      if (!libroUnits.has(`${u.asignatura}#${u.unidad}`)) {
        broken.push({ slug: it.slug, asignatura: u.asignatura, unidad: u.unidad });
      }
    }
  }
  return broken;
}
```

- [ ] **Step 4: Run it to verify it passes**

Run: `npx vitest run src/lib/familia-grouping.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Refactor `src/lib/dinamicas.ts` to use the shared helpers**

Replace the local `Familia` interface, `FamiliaGroup`, `groupByFamilia`, `BrokenRef`, `findBrokenUnidadRefs`, and `HasFamilia` (lines ~10–17 and ~39–70) with a re-export. Keep `FamiliaSlug`, `FAMILIAS`, `FAMILIA_SLUGS`, `familiaMeta`. The new top of the helper section:

```ts
import type { Familia } from './familia-grouping';
export { groupByFamilia, findBrokenUnidadRefs } from './familia-grouping';
export type { FamiliaGroup, HasFamilia, BrokenRef } from './familia-grouping';
```

`FAMILIAS: Familia[]` keeps the same literal data (the local `Familia` interface is now imported). The `familiaMeta` function and `BY_SLUG` map stay. Delete the now-duplicated `groupByFamilia`/`findBrokenUnidadRefs`/`HasFamilia`/`FamiliaGroup`/`BrokenRef` definitions.

- [ ] **Step 6: Update `src/pages/dinamicas/index.astro`**

The `groupByFamilia` call now takes `(FAMILIAS, items)` and the group property is `items` (was `dinamicas`):

```astro
const groups = groupByFamilia(FAMILIAS, all.map((e) => ({
  slug: e.id.replace(/^dinamicas\//, ''),
  data: e.data,
})));
```
And in the markup, `g.dinamicas.map(...)` → `g.items.map(...)`.

- [ ] **Step 7: Update `src/lib/dinamicas.test.ts`**

The `groupByFamilia` describe block now calls `groupByFamilia(FAMILIAS, items)` and asserts `.items` instead of `.dinamicas`:

```ts
const groups = groupByFamilia(FAMILIAS, items);
expect(groups.map((g) => g.familia.slug)).toEqual(['mercat-treball', 'mercats-preus']);
expect(groups[0].items.map((d) => d.slug)).toEqual(['a1', 'a2']);
expect(groups[1].items.map((d) => d.slug)).toEqual(['b0', 'b1']);
```
And in the "omits families" test: `expect(groups[0].items...` and the call `groupByFamilia(FAMILIAS, [make(...)])`. Import `FAMILIAS` is already present.

- [ ] **Step 8: Run the Dinámicas + shared tests**

Run: `npx vitest run src/lib/dinamicas.test.ts src/lib/familia-grouping.test.ts`
Expected: PASS (all).

- [ ] **Step 9: Type-check the touched Dinámicas page**

Run: `npx astro check`
Expected: no NEW errors in `src/lib/dinamicas.ts` or `src/pages/dinamicas/index.astro` (the 6 pre-existing `[asignatura]/proyecto` ts(7053) errors are unrelated and may remain).

- [ ] **Step 10: Commit**

```bash
git add src/lib/familia-grouping.ts src/lib/familia-grouping.test.ts src/lib/dinamicas.ts src/lib/dinamicas.test.ts src/pages/dinamicas/index.astro
git commit -m "refactor(lib): extract generic familia-grouping helpers shared by secciones"
```

---

## Task 2: Debates library (families)

**Files:**
- Create: `src/lib/debates.ts`
- Create: `src/lib/debates.test.ts`

- [ ] **Step 1: Write the failing test** — `src/lib/debates.test.ts`

```ts
import { describe, it, expect } from 'vitest';
import { FAMILIAS_DEBATE, FAMILIA_DEBATE_SLUGS, familiaMeta } from './debates.ts';

describe('FAMILIAS_DEBATE', () => {
  it('declares the 6 families in display order with a color token each', () => {
    expect(FAMILIAS_DEBATE.map((f) => f.slug)).toEqual([
      'mercado-estado', 'trabajo-desigualdad', 'globalizacion-comercio',
      'sostenibilidad-crecimiento', 'etica-empresa-consumo', 'dinero-tecnologia-futuro',
    ]);
    for (const f of FAMILIAS_DEBATE) expect(f.colorVar).toMatch(/^--color-[a-z0-9-]+$/);
  });
  it('exposes the slugs as a non-empty tuple', () => {
    expect(FAMILIA_DEBATE_SLUGS.length).toBe(FAMILIAS_DEBATE.length);
  });
});

describe('familiaMeta', () => {
  it('returns metadata for a known family', () => {
    expect(familiaMeta('mercado-estado').label).toBe('Mercado y Estado');
  });
  it('throws on an unknown family', () => {
    expect(() => familiaMeta('nope')).toThrow(/unknown familia de debate/i);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/lib/debates.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `src/lib/debates.ts`**

```ts
/**
 * Metadata and helpers for the transversal «Debates» section. Family
 * color-coding reuses already-validated tokens from global.css — no new colors.
 * Generic grouping/validation live in ./familia-grouping (shared with Dinámicas).
 */
import type { Familia } from './familia-grouping';
export { groupByFamilia, findBrokenUnidadRefs } from './familia-grouping';
export type { FamiliaGroup, HasFamilia, BrokenRef } from './familia-grouping';

export const FAMILIAS_DEBATE: Familia[] = [
  { slug: 'mercado-estado',            label: 'Mercado y Estado',            intro: '¿Hasta dónde debe intervenir el Estado en la economía?',     colorVar: '--color-eco1' },
  { slug: 'trabajo-desigualdad',       label: 'Trabajo y desigualdad',       intro: 'Salarios, empleo y reparto de la renta.',                    colorVar: '--color-fopp' },
  { slug: 'globalizacion-comercio',    label: 'Globalización y comercio',    intro: 'Comercio internacional, deslocalización y proteccionismo.',  colorVar: '--color-edmn' },
  { slug: 'sostenibilidad-crecimiento',label: 'Sostenibilidad y crecimiento',intro: '¿Crecer sin límite o decrecer para durar?',                  colorVar: '--color-mustard' },
  { slug: 'etica-empresa-consumo',     label: 'Ética, empresa y consumo',    intro: 'Responsabilidad de las empresas y consumo consciente.',      colorVar: '--color-gpe' },
  { slug: 'dinero-tecnologia-futuro',  label: 'Dinero, tecnología y futuro', intro: 'Cripto, automatización, IA y renta básica.',                 colorVar: '--color-ipe2' },
];

export const FAMILIA_DEBATE_SLUGS = FAMILIAS_DEBATE.map((f) => f.slug) as [string, ...string[]];

const BY_SLUG = new Map(FAMILIAS_DEBATE.map((f) => [f.slug, f]));

export function familiaMeta(slug: string): Familia {
  const f = BY_SLUG.get(slug);
  if (!f) throw new Error(`unknown familia de debate: ${slug}`);
  return f;
}
```

- [ ] **Step 4: Run it to verify it passes**

Run: `npx vitest run src/lib/debates.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/debates.ts src/lib/debates.test.ts
git commit -m "feat(debates): thematic families library"
```

---

## Task 3: Content collection schema

**Files:**
- Modify: `src/content.config.ts`

- [ ] **Step 1: Add the import** at the top of `src/content.config.ts`, next to the existing `import { FAMILIA_SLUGS } from './lib/dinamicas';`:

```ts
import { FAMILIA_DEBATE_SLUGS } from './lib/debates';
```

- [ ] **Step 2: Define the `debates` collection** before the `export const collections` block:

```ts
/* =========================================================
   debates/{familia}/{nn}-{slug}.mdx — transversal classroom
   debates (motion, sides, argumentary, mechanics, rubric).
   ========================================================= */
const debates = defineCollection({
  loader: glob({ pattern: 'debates/**/*.{md,mdx}', base: './src/content' }),
  schema: z.object({
    title: z.string(),
    mocion: z.string(),
    familia: z.enum(FAMILIA_DEBATE_SLUGS),
    /** Sort key within the family; also the filename prefix. */
    orden: z.number().int().min(0),
    /** One-line summary for the hub card. */
    descripcion: z.string(),
    formato: z.enum(['parlamentario', 'mesa-redonda', 'juicio-simulado', 'dilema-etico', 'fishbowl']),
    duracion: z.string(),
    agrupacion: z.string(),
    nivel: z.array(z.enum(['eso', 'bach', 'fp'])).min(1),
    objetivos: z.array(z.string()).min(1),
    conceptos_clave: z.array(z.string()).default([]),
    /** The opposing sides (>= 2). */
    posturas: z.array(z.object({
      id: z.string(),
      label: z.string(),
      sintesis: z.string(),
    })).min(2),
    /** Cross-asignatura curriculum map. */
    unidades_relacionadas: z.array(z.object({
      asignatura: z.enum(ASIGNATURA_SLUGS),
      unidad: z.number().int().min(1),
      nota: z.string().optional(),
      competencias_especificas: z.array(z.string()).default([]),
    })).default([]),
    competencias_clave: z.array(z.string()).default([]),
    competencias_especificas: z.array(z.string()).default([]),
    /** Structured rubric → printable ficha + competency link. */
    rubrica: z.array(z.object({
      criterio: z.string(),
      descripcion: z.string(),
      competencia: z.string().optional(),
    })).default([]),
    lang: z.enum(LANGS).default('es'),
    estado: z.enum(ESTADOS).default('borrador'),
  }),
});
```

- [ ] **Step 3: Register the collection** — add `debates,` to the `export const collections = { ... }` object (after `dinamicas,`).

- [ ] **Step 4: Type-check**

Run: `npx astro check`
Expected: no NEW errors from `content.config.ts`. (Content sync runs; with no `debates/` files yet the collection is simply empty.)

- [ ] **Step 5: Commit**

```bash
git add src/content.config.ts
git commit -m "feat(debates): content collection schema"
```

---

## Task 4: Menu entry under «Otros»

**Files:**
- Modify: `src/lib/asignaturas.ts` (`SECCIONES_TRANSVERSALES`)
- Modify: `src/lib/asignaturas.test.ts`

- [ ] **Step 1: Write the failing test** — append to `src/lib/asignaturas.test.ts`:

```ts
describe('SECCIONES_TRANSVERSALES — debates', () => {
  it('incluye debates tras jocs-economics', () => {
    const slugs = SECCIONES_TRANSVERSALES.map((s) => s.slug);
    expect(slugs).toContain('debates');
    expect(slugs.indexOf('debates')).toBe(slugs.indexOf('jocs-economics') + 1);
  });
  it('le da label y descripción', () => {
    const s = SECCIONES_TRANSVERSALES.find((x) => x.slug === 'debates');
    expect(s?.label).toBe('Debates');
    expect((s?.description.length ?? 0)).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/lib/asignaturas.test.ts`
Expected: FAIL — `debates` not found / index -1.

- [ ] **Step 3: Add the entry** to `SECCIONES_TRANSVERSALES` in `src/lib/asignaturas.ts` (after the `jocs-economics` line):

```ts
  { slug: 'debates',        label: 'Debates',        description: 'Controversias económicas para argumentar en clase.' },
```

- [ ] **Step 4: Run it to verify it passes**

Run: `npx vitest run src/lib/asignaturas.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/asignaturas.ts src/lib/asignaturas.test.ts
git commit -m "feat(debates): add Debates entry to the «Otros» menu"
```

---

## Task 5: Presentational components

**Files:**
- Create: `src/components/debates/DebateMeta.astro`
- Create: `src/components/debates/PosturaCard.astro`
- Create: `src/components/debates/Argumentario.astro`
- Create: `src/components/debates/Fases.astro`
- Create: `src/components/debates/Rubrica.astro`
- Create: `src/components/debates/FichaAlumno.astro`

These are presentational Astro components (no unit tests; verified by build + visual review in Task 6/7). Create all six, then build.

- [ ] **Step 1: `DebateMeta.astro`**

```astro
---
/** Metadata badge row for a debate (format, duration, grouping, level). */
interface Props { formato: string; duracion: string; agrupacion: string; nivel: string[]; }
const { formato, duracion, agrupacion, nivel } = Astro.props;
const FORMATO_LABEL: Record<string, string> = {
  'parlamentario': 'Parlamentario', 'mesa-redonda': 'Mesa redonda',
  'juicio-simulado': 'Juicio simulado', 'dilema-etico': 'Dilema ético', 'fishbowl': 'Fishbowl',
};
const NIVEL_LABEL: Record<string, string> = { eso: 'ESO', bach: 'Bachillerato', fp: 'FP' };
---
<dl class="meta">
  <div><dt>Formato</dt><dd>{FORMATO_LABEL[formato] ?? formato}</dd></div>
  <div><dt>Duración</dt><dd>{duracion}</dd></div>
  <div><dt>Agrupación</dt><dd>{agrupacion}</dd></div>
  <div><dt>Nivel</dt><dd>{nivel.map((n) => NIVEL_LABEL[n] ?? n).join(' · ')}</dd></div>
</dl>
<style>
  .meta { display: flex; flex-wrap: wrap; gap: 1.4rem; margin: 1.4rem 0 2rem; padding: 1rem 1.2rem; background: var(--color-bg-cream); border-radius: 8px; }
  .meta div { display: flex; flex-direction: column; gap: 0.15rem; }
  .meta dt { font-family: var(--font-sans); font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-ink-mute); margin: 0; }
  .meta dd { font-family: var(--font-serif); font-size: 1rem; margin: 0; color: var(--color-ink); }
</style>
```

- [ ] **Step 2: `PosturaCard.astro`**

```astro
---
/** One side of the debate: its label and a one-line synthesis. */
interface Props { label: string; sintesis: string; tono?: 'favor' | 'contra' | 'neutro'; }
const { label, sintesis, tono = 'neutro' } = Astro.props;
const COLOR: Record<string, string> = { favor: '--color-eco1', contra: '--color-terra', neutro: '--color-mustard' };
---
<div class="postura" style={`--postura-color: var(${COLOR[tono]})`}>
  <span class="postura__tag">{label}</span>
  <p class="postura__sintesis">{sintesis}</p>
</div>
<style>
  .postura { border: 1.5px solid var(--color-line); border-left: 4px solid var(--postura-color); border-radius: 8px; padding: 1rem 1.2rem; background: var(--color-paper); }
  .postura__tag { font-family: var(--font-sans); font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--postura-color); }
  .postura__sintesis { font-family: var(--font-serif); font-size: 1.05rem; margin: 0.3rem 0 0; color: var(--color-ink); }
</style>
```

- [ ] **Step 3: `Argumentario.astro`** (used inside the MDX body; children are the arguments)

```astro
---
/** A prepared-arguments block for one debate side, placed in the MDX body. */
interface Props { postura: string; tono?: 'favor' | 'contra' | 'neutro'; }
const { postura, tono = 'neutro' } = Astro.props;
const COLOR: Record<string, string> = { favor: '--color-eco1', contra: '--color-terra', neutro: '--color-mustard' };
---
<aside class="arg" style={`--arg-color: var(${COLOR[tono]})`}>
  <h4 class="arg__head">{postura}</h4>
  <div class="arg__body"><slot /></div>
</aside>
<style>
  .arg { margin: 1.2rem 0; padding: 1rem 1.2rem; border-radius: 8px; background: var(--color-bg-cream); border-top: 3px solid var(--arg-color); }
  .arg__head { font-family: var(--font-sans); font-size: 0.8rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--arg-color); margin: 0 0 0.4rem; }
  .arg__body :global(p) { margin: 0 0 0.6em; }
  .arg__body :global(ul) { padding-left: 1.3rem; margin: 0; }
  .arg__body :global(ul li::marker) { color: var(--arg-color); }
</style>
```

- [ ] **Step 4: `Fases.astro`** (mechanics/turns timeline; takes an array prop)

```astro
---
/** The classroom procedure as an ordered list of phases (phase, time, what happens). */
interface Fase { fase: string; tiempo?: string; descripcion: string; }
interface Props { fases: Fase[]; }
const { fases } = Astro.props;
---
<ol class="fases">
  {fases.map((f) => (
    <li class="fase">
      <div class="fase__head"><span class="fase__name">{f.fase}</span>{f.tiempo && <span class="fase__time">{f.tiempo}</span>}</div>
      <p class="fase__desc">{f.descripcion}</p>
    </li>
  ))}
</ol>
<style>
  .fases { list-style: none; padding: 0; margin: 1.2rem 0; counter-reset: fase; }
  .fase { position: relative; padding: 0 0 1rem 2rem; border-left: 2px solid var(--color-line); margin-left: 0.5rem; }
  .fase::before { counter-increment: fase; content: counter(fase); position: absolute; left: -0.85rem; top: 0; width: 1.5rem; height: 1.5rem; border-radius: 50%; background: var(--color-terra); color: var(--color-paper); font-family: var(--font-sans); font-size: 0.8rem; font-weight: 700; display: grid; place-items: center; }
  .fase__head { display: flex; align-items: baseline; gap: 0.6rem; }
  .fase__name { font-family: var(--font-serif); font-size: 1.1rem; color: var(--color-ink); }
  .fase__time { font-family: var(--font-mono); font-size: 0.78rem; color: var(--color-ink-mute); }
  .fase__desc { color: var(--color-ink-soft); margin: 0.2rem 0 0; }
</style>
```

- [ ] **Step 5: `Rubrica.astro`** (criterion ↔ competencia table)

```astro
---
/** Evaluation rubric: criteria and the competencia each one works. */
interface Criterio { criterio: string; descripcion: string; competencia?: string; }
interface Props { rubrica: Criterio[]; }
const { rubrica } = Astro.props;
---
{rubrica.length > 0 && (
  <table class="rubrica">
    <thead><tr><th>Criterio</th><th>Qué se valora</th><th>Competencia</th></tr></thead>
    <tbody>
      {rubrica.map((r) => (
        <tr><td>{r.criterio}</td><td>{r.descripcion}</td><td>{r.competencia ?? '—'}</td></tr>
      ))}
    </tbody>
  </table>
)}
<style>
  .rubrica { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.95rem; }
  .rubrica th, .rubrica td { border: 1px solid var(--color-line); padding: 0.55em 0.7em; text-align: left; vertical-align: top; }
  .rubrica th { font-family: var(--font-sans); font-size: 0.72rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--color-ink-mute); background: var(--color-bg-cream); }
  .rubrica td { color: var(--color-ink-soft); }
</style>
```

- [ ] **Step 6: `FichaAlumno.astro`** (printable; same `.print-block` pattern as Dinámicas)

```astro
---
/**
 * A printable student worksheet for a debate. Same print isolation as the
 * Dinámicas FichaAlumno: lives inside .prose as a .print-block so the @media
 * print rules in the detail page isolate it onto its own A4 page.
 */
interface Props { titulo: string; subtitulo?: string; }
const { titulo, subtitulo } = Astro.props;
---
<div class="ficha print-block" data-print>
  <div class="ficha__head">
    <span class="ficha__tag">Ficha del alumno</span>
    <h4 class="ficha__title">{titulo}</h4>
    {subtitulo && <p class="ficha__sub">{subtitulo}</p>}
  </div>
  <div class="ficha__body"><slot /></div>
</div>
<style>
  .ficha { border: 1.5px solid var(--color-line); border-radius: 8px; padding: 1.1rem 1.3rem; margin: 1rem 0; background: var(--color-paper); }
  .ficha__head { margin-bottom: 0.8rem; }
  .ficha__tag { font-family: var(--font-sans); font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-mustard-deep); }
  .ficha__title { font-family: var(--font-serif); font-size: 1.2rem; margin: 0.2rem 0 0; font-weight: 500; }
  .ficha__sub { font-family: var(--font-serif); font-style: italic; color: var(--color-ink-soft); margin: 0.2rem 0 0; }
  .ficha__body { font-size: 1rem; line-height: 1.6; }
  .ficha__body :global(table) { width: 100%; border-collapse: collapse; margin: 0.6em 0; }
  .ficha__body :global(th), .ficha__body :global(td) { border: 1px solid var(--color-line); padding: 0.5em 0.6em; text-align: left; }
</style>
```

- [ ] **Step 7: Commit**

```bash
git add src/components/debates/
git commit -m "feat(debates): presentational components (meta, postura, argumentario, fases, rubrica, ficha)"
```

---

## Task 6: Hub + detail pages with print isolation

**Files:**
- Create: `src/pages/debates/index.astro`
- Create: `src/pages/debates/[familia]/[slug].astro`
- Create: `src/pages/debates/_print-isolation.test.ts`

- [ ] **Step 1: Write the failing print-isolation test** — `src/pages/debates/_print-isolation.test.ts`

```ts
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

/**
 * Regression guard for the debate «Imprimir» flow: printing must isolate the
 * student ficha (.print-block) and hide the theory/argumentary prose. This file
 * is `_`-prefixed so Astro's router ignores it (a `.ts` under src/pages becomes
 * a route endpoint otherwise — see the Dinámicas build-break lesson).
 */
const here = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(here, '[familia]', '[slug].astro'), 'utf8');

function printBlock(css: string): string {
  const m = css.search(/@media\s+print\s*\{/);
  return m === -1 ? '' : css.slice(m);
}

describe('debate print stylesheet isolates the student ficha', () => {
  const block = printBlock(src);
  it('has an @media print block', () => {
    expect(block.length).toBeGreaterThan(0);
  });
  it('hides every direct child of the prose theory in print', () => {
    expect(block).toMatch(/\.prose\s*>\s*:global\(\*\)[^}]*display:\s*none/);
  });
  it('re-shows only the .print-block materials in print', () => {
    expect(block).toMatch(/:global\(\.print-block\)[^}]*display:\s*block/);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/pages/debates/_print-isolation.test.ts`
Expected: FAIL — cannot read `[familia]/[slug].astro` (file doesn't exist yet).

- [ ] **Step 3: Create the hub** — `src/pages/debates/index.astro`

```astro
---
/**
 * Debates hub. Lists published debates grouped by family (FAMILIAS_DEBATE order),
 * each card linking to its detail page, with a client-side family filter.
 */
import BaseLayout from '@layouts/BaseLayout.astro';
import { groupByFamilia, FAMILIAS_DEBATE } from '@/lib/debates';
import { getCollection } from 'astro:content';

const all = (await getCollection('debates')).filter((e) => e.data.estado === 'publicado');
// entry.id from glob loader is "debates/familia/nn-slug"; strip the prefix so
// slugs resolve to "familia/nn-slug" and hrefs are /debates/familia/nn-slug/
const groups = groupByFamilia(FAMILIAS_DEBATE, all.map((e) => ({
  slug: e.id.replace(/^debates\//, ''),
  data: e.data,
})));
const activeFamilias = new Set(groups.map((g) => g.familia.slug));
---

<BaseLayout
  title="Debates"
  description="Controversias económicas para argumentar en clase: moción, posturas, argumentario, mecánica de turnos y rúbrica, con su encaje curricular."
>
  <div class="container">
    <nav class="breadcrumb"><a href="/">Inicio</a> <span class="sep">›</span> <span>Debates</span></nav>
  </div>

  <section class="hero">
    <div class="container">
      <span class="kicker">Material transversal</span>
      <h1><span class="serif-italic-wonk accent">Debates</span> para argumentar en clase.</h1>
      <p class="lede">
        Las grandes controversias económicas, listas para llevar al aula: la moción,
        las posturas enfrentadas, el argumentario por bando, la mecánica de turnos y
        una rúbrica de evaluación. Cada uno con su encaje curricular.
      </p>
    </div>
  </section>

  <section class="filters">
    <div class="container">
      <button class="chip is-active" data-filter="all" type="button">Todos</button>
      {FAMILIAS_DEBATE.filter((f) => activeFamilias.has(f.slug)).map((f) => (
        <button class="chip" data-filter={f.slug} type="button"
          style={`--chip-color: var(${f.colorVar})`}>{f.label}</button>
      ))}
    </div>
  </section>

  {groups.map((g) => (
    <section class="familia" data-familia={g.familia.slug}>
      <div class="container">
        <div class="familia__head" style={`--fam-color: var(${g.familia.colorVar})`}>
          <h2>{g.familia.label}</h2>
          <p>{g.familia.intro}</p>
        </div>
        <div class="card-grid">
          {g.items.map((d) => (
            <a class="card" href={`/debates/${d.slug}/`} style={`--fam-color: var(${g.familia.colorVar})`}>
              <span class="card__eyebrow">{g.familia.label}</span>
              <h3 class="card__title serif">{d.data.title}</h3>
              <p class="card__desc">{d.data.descripcion}</p>
              <span class="card__meta">{d.data.duracion} · {d.data.agrupacion}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  ))}
</BaseLayout>

<script>
  const chips = document.querySelectorAll<HTMLButtonElement>('.chip');
  const sections = document.querySelectorAll<HTMLElement>('.familia');
  chips.forEach((chip) => chip.addEventListener('click', () => {
    chips.forEach((c) => c.classList.remove('is-active'));
    chip.classList.add('is-active');
    const f = chip.dataset.filter;
    sections.forEach((s) => { s.hidden = f !== 'all' && s.dataset.familia !== f; });
  }));
</script>

<style>
  .container { max-width: 1240px; margin: 0 auto; padding: 0 clamp(1.5rem, 4vw, 3rem); }
  .breadcrumb { font-size: 0.92rem; color: var(--color-ink-mute); margin: 2rem 0; }
  .breadcrumb a { color: var(--color-ink-mute); text-decoration: none; }
  .breadcrumb a:hover { color: var(--color-terra); }
  .breadcrumb .sep { margin: 0 0.5em; color: var(--color-mustard); }
  .hero { padding: 1rem 0 2rem; }
  .kicker { font-family: var(--font-sans); font-size: 0.8rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-terra); }
  .accent { color: var(--color-terra); }
  h1 { margin: 0.6rem 0 0.8rem; }
  .lede { font-size: 1.2rem; color: var(--color-ink-soft); line-height: 1.55; max-width: 60ch; }
  .filters .container { display: flex; flex-wrap: wrap; gap: 0.5rem; padding-top: 1rem; padding-bottom: 1.5rem; }
  .chip { font-family: var(--font-sans); font-size: 0.85rem; font-weight: 600; color: var(--color-ink-soft); background: transparent; border: 1.5px solid var(--color-line); border-radius: 999px; padding: 0.4rem 0.9rem; cursor: pointer; transition: all .15s ease; }
  .chip:hover { border-color: var(--chip-color, var(--color-terra)); color: var(--chip-color, var(--color-terra)); }
  .chip.is-active { background: var(--chip-color, var(--color-ink)); border-color: var(--chip-color, var(--color-ink)); color: var(--color-paper); }
  .familia { padding: 1.5rem 0; }
  .familia__head { border-left: 4px solid var(--fam-color); padding-left: 1rem; margin-bottom: 1.5rem; }
  .familia__head h2 { font-family: var(--font-serif); font-size: 1.7rem; font-weight: 500; margin: 0; }
  .familia__head p { color: var(--color-ink-soft); margin: 0.3rem 0 0; }
  .card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 1.2rem; }
  .card { display: flex; flex-direction: column; gap: 0.5rem; padding: 1.4rem; background: var(--color-paper); border: 1px solid var(--color-line); border-top: 4px solid var(--fam-color); border-radius: 10px; text-decoration: none; transition: transform .15s ease, box-shadow .15s ease; }
  .card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(42, 31, 24, 0.1); }
  .card__eyebrow { font-family: var(--font-sans); font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--fam-color); }
  .card__title { font-size: 1.3rem; color: var(--color-ink); margin: 0; }
  .card__desc { color: var(--color-ink-soft); font-size: 0.95rem; line-height: 1.5; margin: 0; flex: 1; }
  .card__meta { font-family: var(--font-mono); font-size: 0.78rem; color: var(--color-ink-mute); margin-top: 0.3rem; }
</style>
```

- [ ] **Step 4: Create the detail page** — `src/pages/debates/[familia]/[slug].astro`

```astro
---
/**
 * A single debate. Routed by `[familia]/[slug]` (two single-segment params): the
 * collection id is "debates/familia/nn-slug", mapped to these two params, URL
 * /debates/familia/nn-slug/.
 *
 * Renders motion, posturas, the MDX body (argumentario + mechanics), the rubric,
 * the curriculum map and competences. An @media print mode isolates the
 * `.print-block` student fichas.
 */
import BaseLayout from '@layouts/BaseLayout.astro';
import DebateMeta from '@components/debates/DebateMeta.astro';
import PosturaCard from '@components/debates/PosturaCard.astro';
import Rubrica from '@components/debates/Rubrica.astro';
import PrintButton from '@components/dinamicas/PrintButton.astro';
import PuenteUnidades from '@components/emprendimiento/PuenteUnidades.astro';
import { familiaMeta } from '@/lib/debates';
import { getCollection, render } from 'astro:content';
import type { GetStaticPaths } from 'astro';

export const getStaticPaths = (async () => {
  const all = (await getCollection('debates')).filter((e) => e.data.estado === 'publicado');
  return all.map((entry) => {
    const [familia, ...rest] = entry.id.replace(/^debates\//, '').split('/');
    return { params: { familia, slug: rest.join('/') }, props: { entry } };
  });
}) satisfies GetStaticPaths;

const { entry } = Astro.props;
const d = entry.data;
const { Content } = await render(entry);
const familia = familiaMeta(d.familia);
const tonoFor = (i: number, total: number): 'favor' | 'contra' | 'neutro' =>
  total === 2 ? (i === 0 ? 'favor' : 'contra') : 'neutro';
---

<BaseLayout title={`${d.title} — Debates`} description={d.descripcion}>
  <div class="container">
    <nav class="breadcrumb no-print">
      <a href="/">Inicio</a> <span class="sep">›</span>
      <a href="/debates/">Debates</a> <span class="sep">›</span>
      <span>{d.title}</span>
    </nav>
  </div>

  <section class="body">
    <div class="container container--narrow">
      <span class="kicker" style={`color: var(${familia.colorVar})`}>{familia.label}</span>
      <h1>{d.title}</h1>
      <p class="lede">{d.descripcion}</p>

      <DebateMeta formato={d.formato} duracion={d.duracion} agrupacion={d.agrupacion} nivel={d.nivel} />

      <section class="block no-print mocion">
        <h2>La moción</h2>
        <blockquote class="mocion__q">{d.mocion}</blockquote>
        <div class="posturas">
          {d.posturas.map((p, i) => (
            <PosturaCard label={p.label} sintesis={p.sintesis} tono={tonoFor(i, d.posturas.length)} />
          ))}
        </div>
      </section>

      {d.objetivos.length > 0 && (
        <section class="block no-print">
          <h2>Objetivos</h2>
          <ul>{d.objetivos.map((o) => <li>{o}</li>)}</ul>
          {d.conceptos_clave.length > 0 && (
            <p class="conceptos"><strong>Conceptos:</strong> {d.conceptos_clave.join(' · ')}</p>
          )}
        </section>
      )}

      <div class="print-bar no-print"><PrintButton /></div>

      <article class="prose">
        <Content />
      </article>

      <div class="no-print">
        {d.rubrica.length > 0 && (
          <section class="block">
            <h2>Rúbrica de evaluación</h2>
            <Rubrica rubrica={d.rubrica} />
          </section>
        )}

        <PuenteUnidades unidades={d.unidades_relacionadas} />

        {(d.competencias_clave.length > 0 || d.competencias_especificas.length > 0) && (
          <section class="block">
            <h2>Competencias que se trabajan</h2>
            {d.competencias_clave.length > 0 && (
              <p><strong>Clave:</strong> {d.competencias_clave.join(' · ')}</p>
            )}
            {d.competencias_especificas.length > 0 && (
              <p><strong>Específicas:</strong> {d.competencias_especificas.join(' · ')}</p>
            )}
          </section>
        )}

        <nav class="back"><a href="/debates/">← Todos los debates</a></nav>
      </div>
    </div>
  </section>
</BaseLayout>

<style>
  .container { max-width: 1240px; margin: 0 auto; padding: 0 clamp(1.5rem, 4vw, 3rem); }
  .container--narrow { max-width: 820px; }
  .breadcrumb { font-size: 0.92rem; color: var(--color-ink-mute); margin: 2rem 0; }
  .breadcrumb a { color: var(--color-ink-mute); text-decoration: none; }
  .breadcrumb a:hover { color: var(--color-terra); }
  .breadcrumb .sep { margin: 0 0.5em; color: var(--color-mustard); }
  .body { padding: 1rem 0 clamp(3rem, 7vw, 6rem); }
  .kicker { font-family: var(--font-sans); font-size: 0.8rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; }
  h1 { margin: 0.6rem 0 0.4rem; max-width: 24ch; }
  .lede { font-size: 1.2rem; color: var(--color-ink-soft); line-height: 1.5; margin: 0 0 0.5rem; }
  .block { margin: 1.6rem 0; }
  .block h2 { font-family: var(--font-serif); font-size: 1.4rem; font-weight: 500; margin: 0 0 0.5rem; }
  .block ul { padding-left: 1.3rem; } .block li { margin-bottom: 0.3em; }
  .block ul li::marker { color: var(--color-mustard); }
  .conceptos { color: var(--color-ink-soft); margin-top: 0.6rem; }
  .mocion__q { font-family: var(--font-serif); font-style: italic; font-size: 1.3rem; line-height: 1.4; color: var(--color-ink); border-left: 4px solid var(--color-terra); margin: 0.4rem 0 1rem; padding: 0.2rem 0 0.2rem 1rem; }
  .posturas { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; }
  .print-bar { margin: 1.5rem 0; }
  .prose { font-size: 1.05rem; line-height: 1.7; color: var(--color-ink); }
  .prose :global(h2) { font-family: var(--font-serif); font-size: 1.6rem; margin: 2.2em 0 0.7em; position: relative; padding-top: 1em; font-weight: 500; }
  .prose :global(h2::before) { content: ""; position: absolute; top: 0; left: 0; width: 2.5rem; height: 4px; background: var(--color-terra); border-radius: 999px; }
  .prose :global(h3) { font-family: var(--font-serif); font-size: 1.25rem; margin: 1.6em 0 0.5em; font-weight: 500; }
  .prose :global(p) { margin: 0 0 1em; }
  .prose :global(ul), .prose :global(ol) { padding-left: 1.4rem; margin: 0 0 1em; }
  .prose :global(ul li::marker) { color: var(--color-mustard); }
  .back { margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid var(--color-line); font-family: var(--font-sans); }
  .back a { color: var(--color-terra); text-decoration: none; font-weight: 500; }
  .back a:hover { text-decoration: underline; }

  /* Print: isolate ONLY the student fichas (.print-block). Everything else —
     app chrome, motion, posturas, theory prose, rubric, metadata — is hidden so
     the PDF contains just the printable handouts, one .print-block per A4 page. */
  @media print {
    :global(.site-header), :global(.site-footer), .no-print { display: none !important; }
    .breadcrumb, .kicker, .lede { display: none !important; }
    :global(.meta) { display: none !important; }
    .body { padding: 0; }
    .container--narrow { max-width: none; padding: 0; }
    h1 { font-size: 1.4rem; margin: 0 0 1.2rem; max-width: none; }
    .prose > :global(*) { display: none !important; }
    .prose :global(.print-block) {
      display: block !important;
      break-after: page;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .prose :global(.print-block:last-of-type) { break-after: auto; }
  }
</style>
```

- [ ] **Step 5: Run the print-isolation test to verify it passes**

Run: `npx vitest run src/pages/debates/_print-isolation.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
git add src/pages/debates/
git commit -m "feat(debates): hub and detail pages with print isolation"
```

---

## Task 7: The pilot debate + full build verification

**Files:**
- Create: `src/content/debates/mercado-estado/01-salario-minimo.mdx`

- [ ] **Step 1: Find real published units to reference**

The pilot's `unidades_relacionadas` must point to **existing published units** (otherwise `PuenteUnidades` renders no link). Find the labor-market / minimum-wage units:

Run: `npx vitest run` is not it — instead grep the libro collection:
Run (PowerShell): `Get-ChildItem -Recurse src/content/asignaturas/*/libro/*.mdx | Select-String -List 'mercado de trabajo|salario mínimo|mercado laboral' | Select-Object Path`
Or (bash): `grep -rilE "mercado de trabajo|salario mínimo|mercado laboral" src/content/asignaturas/*/libro/*.mdx`

For each match, note the `asignatura` (folder) and the unit number from the file's frontmatter `unidad:`. Use 2–4 real `{asignatura, unidad}` pairs in the frontmatter below (replace the EXAMPLE pairs). Candidates to expect: `eco-1bach`, `fopp-4eso`, `eeae-bach`, `ipe2-fp`.

- [ ] **Step 2: Create the pilot** — `src/content/debates/mercado-estado/01-salario-minimo.mdx`

Replace the `unidades_relacionadas` pairs with the real ones found in Step 1.

````mdx
---
title: "¿Debe el Estado subir el salario mínimo?"
mocion: "El salario mínimo interprofesional debería subir de forma significativa."
familia: mercado-estado
orden: 1
descripcion: "Un debate parlamentario sobre la intervención del Estado en el mercado de trabajo: ¿proteger salarios o no destruir empleo?"
formato: parlamentario
duracion: "50-55 min"
agrupacion: "Dos equipos + moderación"
nivel: [bach, fp]
objetivos:
  - "Argumentar con evidencia a favor y en contra de subir el salario mínimo."
  - "Distinguir entre efectos sobre los salarios y efectos sobre el empleo."
  - "Reconocer los supuestos del modelo de mercado de trabajo (competitivo vs monopsonio)."
conceptos_clave: ["salario mínimo", "mercado de trabajo", "desempleo", "pobreza laboral", "monopsonio"]
posturas:
  - id: a-favor
    label: "A favor de subirlo"
    sintesis: "Protege a los trabajadores con menos poder de negociación y reduce la pobreza laboral."
  - id: en-contra
    label: "En contra de subirlo"
    sintesis: "Un suelo demasiado alto encarece el empleo poco cualificado y puede destruir puestos."
unidades_relacionadas:
  # EXAMPLE — replace with the real pairs found in Step 1
  - asignatura: eco-1bach
    unidad: 1
    nota: "Encaja al estudiar el mercado de trabajo y la intervención del Estado."
    competencias_especificas: []
  - asignatura: fopp-4eso
    unidad: 1
    competencias_especificas: []
competencias_clave: ["CCL", "CPSAA", "CC"]
competencias_especificas: []
rubrica:
  - criterio: "Calidad de los argumentos"
    descripcion: "Los argumentos son pertinentes, claros y conectan con conceptos económicos."
    competencia: "CC"
  - criterio: "Uso de evidencia"
    descripcion: "Apoya las afirmaciones con datos, ejemplos o comparativas."
    competencia: "CPSAA"
  - criterio: "Capacidad de refutación"
    descripcion: "Responde a los argumentos del otro equipo en lugar de repetir los propios."
    competencia: "CC"
  - criterio: "Expresión oral y turnos"
    descripcion: "Se expresa con claridad, respeta los tiempos y el turno de palabra."
    competencia: "CCL"
lang: es
estado: publicado
---

import Argumentario from '@components/debates/Argumentario.astro';
import Fases from '@components/debates/Fases.astro';
import FichaAlumno from '@components/debates/FichaAlumno.astro';

## De qué va

El salario mínimo interprofesional (SMI) es el sueldo más bajo que la ley permite
pagar por una jornada completa. Subirlo es una de las decisiones de política
económica más debatidas: para unos protege a quien menos cobra; para otros, encarece
el empleo y deja fuera a los menos cualificados. Este debate enfrenta las dos
posturas con sus mejores argumentos.

## Argumentario

<Argumentario postura="A favor de subir el SMI" tono="favor">

- **Reduce la pobreza laboral.** Hay gente que trabaja a jornada completa y aun así
  no llega a fin de mes; un suelo más alto mejora directamente su renta.
- **Corrige el desequilibrio de poder.** En muchos sectores el trabajador negocia en
  inferioridad (monopsonio): el empleador fija el salario por debajo de la
  productividad. Un mínimo lo compensa sin destruir empleo.
- **Estimula el consumo.** Las rentas bajas gastan casi todo lo que ingresan, así que
  subirles el sueldo se traduce en demanda para la economía local.

</Argumentario>

<Argumentario postura="En contra de subir el SMI" tono="contra">

- **Puede destruir empleo.** Si el salario obligatorio supera lo que aporta un puesto
  poco cualificado, a la empresa le deja de salir a cuenta contratarlo.
- **Perjudica a quien quiere proteger.** Los primeros en quedar fuera son los jóvenes
  y los menos formados, justo quienes más necesitan una primera oportunidad.
- **Hay herramientas mejor dirigidas.** Complementos salariales o deducciones ayudan a
  las rentas bajas sin encarecer la contratación.

</Argumentario>

## Cómo se desarrolla

<Fases fases={[
  { fase: "Preparación en equipos", tiempo: "12 min", descripcion: "Cada equipo recibe su postura, prepara 3 argumentos y anticipa los del rival." },
  { fase: "Turnos de apertura", tiempo: "8 min", descripcion: "Un portavoz por equipo expone la posición (4 min cada uno), sin interrupciones." },
  { fase: "Réplica", tiempo: "12 min", descripcion: "Turnos alternos para refutar al rival. Se valora responder, no repetir." },
  { fase: "Turno del público", tiempo: "8 min", descripcion: "El alumnado no asignado pregunta a ambos equipos." },
  { fase: "Cierre", tiempo: "6 min", descripcion: "Cada equipo resume su mejor argumento en 2 minutos." },
  { fase: "Debrief", tiempo: "8 min", descripcion: "El profe deshace el rol: ¿qué dice la evidencia? Distinguir efecto-salario de efecto-empleo." },
]} />

<FichaAlumno titulo="Preparo mi postura" subtitulo="Rellena antes del debate con tu equipo.">

**Moción:** El salario mínimo debería subir de forma significativa.

**Mi postura:** ____________________

**Mis 3 argumentos (con evidencia):**

1. ____________________
2. ____________________
3. ____________________

**Un argumento del equipo rival que tendré que refutar:**

____________________

</FichaAlumno>
````

- [ ] **Step 3: Run the lib + page tests**

Run: `npx vitest run src/lib/debates.test.ts src/pages/debates/_print-isolation.test.ts src/lib/asignaturas.test.ts src/lib/familia-grouping.test.ts src/lib/dinamicas.test.ts`
Expected: PASS (all).

- [ ] **Step 4: Full build (the real verification — local Windows must complete end-to-end)**

Run: `npx astro build`
Expected: `Complete!`, exit 0. The new `/debates/`, `/debates/mercado-estado/01-salario-minimo/` routes prerender without ENOENT. If the build throws a Zod content error, fix the pilot frontmatter to match the schema (Task 3).

- [ ] **Step 5: Visual smoke check (dev)**

Run: `npx astro dev` and open `http://localhost:4321/debates/` and the pilot page. Confirm: hub shows the Mercado y Estado family + card; detail shows motion, posturas, argumentario, fases, rubric, «Esto se trabaja en…» links resolve (no 404), and «Imprimir» yields a print preview with only the ficha.

- [ ] **Step 6: Commit**

```bash
git add src/content/debates/mercado-estado/01-salario-minimo.mdx
git commit -m "feat(debates): pilot — ¿Debe el Estado subir el salario mínimo?"
```

---

## Task 8: PR

- [ ] **Step 1: Push and open PR to `dev`**

```bash
git push -u origin feat/seccion-debates
gh pr create --base dev --head feat/seccion-debates \
  --title "feat(debates): sección Debates (marco + pilot salario mínimo)" \
  --body "Nueva sección transversal /debates/ bajo «Otros», independiente de Dinámicas: colección con schema propio (moción, posturas, argumentario, mecánica, rúbrica), hub por familia temática, página de detalle con ficha de alumno imprimible y encaje curricular. Extrae helpers genéricos de familia a un módulo compartido. Entrega: marco + 1 pilot publicado. Spec: docs/superpowers/specs/2026-06-02-debates-design.md"
```

- [ ] **Step 2: Wait for the Vercel build check to go green**, then merge per Pau's call (the local Windows build already passed in Task 7, so green on Vercel is expected).

---

## Self-review notes (for the implementer)

- **Shared-helper rename is breaking on purpose:** `groupByFamilia` now takes `(familias, items)` and returns `.items` (was `.dinamicas`). Task 1 updates every Dinámicas consumer in the same commit — don't leave `.dinamicas` references behind.
- **`_`-prefix the print test from the start** (Task 6): a bare `.test.ts` under `src/pages/` becomes a route endpoint and breaks the build (the Dinámicas lesson). The file is `_print-isolation.test.ts`.
- **Pilot units must be real** (Task 7 Step 1): the EXAMPLE pairs are placeholders to be replaced; broken refs don't fail the build but render dead (no link).
- **No new colors:** every `colorVar` reuses an existing `--color-*` token from `global.css`.
