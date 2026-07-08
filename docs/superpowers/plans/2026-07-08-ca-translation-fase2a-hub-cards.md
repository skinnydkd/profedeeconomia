# CA Fase 2A — Hub Card Translation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Under `/ca/*`, render every hub card whose text lives in code (TS registries, inline `.astro` arrays, reusable UI strings) in Valencian, reusing the Fase 1 i18n patterns with clean ES fallback.

**Architecture:** Three buckets mirror where each string lives. (1) Registry overlays — one `src/i18n/<domain>-ca.ts` per registry, mirroring `asignaturas-ca.ts` (`Partial<Record<slug, Partial<Pick<T, fields>>>>` + a `localizeX(item, locale)` spread helper). (2) Inline card arrays → per-page `const copy = { es, ca }[locale]` objects (Fase 1 pattern). (3) Reusable eyebrows/CTAs/labels → `t()` keys in `src/i18n/ui.ts`. Locale is always read from `getLocale(Astro.currentLocale)`.

**Tech Stack:** Astro 5, TypeScript (strict, no `any`), Vitest. Spec: `docs/superpowers/specs/2026-07-08-ca-translation-fase2a-hub-cards-design.md`.

## Global Constraints

- **Language variety: Valencian, AVL norm.** Glossary-consistent with Fase 1 and `src/i18n/asignaturas-ca.ts` (e.g. "ferramentes" not "eines"). No auto-publish — every VAL string is for Pau's later review.
- **No emojis** in content; typographic symbols (`→ × —`) allowed.
- **TypeScript strict, no `any`.** Comments in English. Conventional Commits (English).
- **Locale source of truth: `getLocale(Astro.currentLocale)`** — never the URL (Fase 1 spike; `fallbackType: 'rewrite'` does not update `Astro.url.pathname`).
- **Overlay pattern (canonical, from `src/i18n/asignaturas-ca.ts`)** — every registry overlay mirrors this shape:
  ```ts
  import { type Locale } from './locale';
  type XCA = Partial<Pick<X, 'fieldA' | 'fieldB'>>;
  export const X_CA: Partial<Record<string, XCA>> = { /* keyed by item.slug */ };
  export function localizeX(item: X, locale: Locale): X {
    return locale === 'es' ? item : { ...item, ...X_CA[item.slug] };
  }
  ```
- **Overlay test pattern (canonical, from `src/i18n/asignaturas-ca.test.ts`)** — every overlay ships a test with: (a) `es` returns the object unchanged, (b) `ca` overlays one field + a structural field is preserved, (c) every overlay key is a real registry slug, (d) every published registry item has an overlay (guard against silent gaps).
- **Parity for `ui.ts`:** the existing `ui.test.ts` already asserts `es`/`ca` have identical key sets — new keys must be added to BOTH.
- **Only translate user-facing fields.** Structural fields (`slug`, `color`, `colorVar`, `componente`, `estado`, `orden`, `href`, `tipo`, `familia`, `grupo`) stay ES-sourced.
- **Out of scope (fase de contingut):** MDX frontmatter of debates/dinámicas/proyectos individual cards. Their *family headers* ARE in scope.
- **Verification:** `npm run check` clean; per-overlay Vitest; the Vercel PR preview is the authoritative production build (local long builds get killed in this environment).
- **Branch:** work continues on `feat/ca-fase2a-hub-cards` (spec already committed there, base `4645b3a`).

---

### Task 1: UI keys for reusable eyebrows, CTAs and labels

**Files:**
- Modify: `src/i18n/ui.ts` (add keys to both `ui.es` and `ui.ca`)
- Test: `src/i18n/ui.test.ts` (existing parity test covers new keys; add one value assertion)

**Interfaces:**
- Consumes: `ui`, `t(key: UIKey, locale)`, `UIKey = keyof (typeof ui)['es']` (existing).
- Produces: new `UIKey`s used by later tasks: `card.jugar`, `card.abrirSala`, `card.abrir`, `card.abrirExterno`, `estado.disponible`, `estado.proximamente`, `meta.multijugador`, `gen.lomloe`, `gen.grupo.evaluacion`, `gen.grupo.aula`, `nivel.eso`, `nivel.bach`, `nivel.fp`, `tipo.calculadora`, `tipo.simulador`, `tipo.rubrica`, `tipo.plantilla`.

- [ ] **Step 1: Add the ES values (verbatim from current hardcoded strings).** In `src/i18n/ui.ts`, inside `ui.es`, add:
```ts
    'card.jugar': 'Jugar →',
    'card.abrirSala': 'Abrir sala (proyector) →',
    'card.abrir': 'Abrir →',
    'card.abrirExterno': 'Abrir en oposicioneseconomia.es →',
    'estado.disponible': 'Disponible',
    'estado.proximamente': 'Próximamente',
    'meta.multijugador': 'Multijugador',
    'gen.lomloe': 'Generadores LOMLOE',
    'gen.grupo.evaluacion': 'Evaluación',
    'gen.grupo.aula': 'Atención y aula',
    'nivel.eso': 'ESO',
    'nivel.bach': 'Bachillerato',
    'nivel.fp': 'FP',
    'tipo.calculadora': 'Calculadora',
    'tipo.simulador': 'Simulador',
    'tipo.rubrica': 'Rúbrica',
    'tipo.plantilla': 'Plantilla',
```

- [ ] **Step 2: Add the VAL (AVL) values under `ui.ca`.** Add the SAME keys with Valencian values (translate; imperative verbs in Valencian, e.g. "Juga →", "Obri →"; "Pròximament"; keep glossary consistent with Fase 1). Every key added in Step 1 MUST exist here.

- [ ] **Step 3: Add a value assertion to the parity test.** In `src/i18n/ui.test.ts`, add inside the existing describe block:
```ts
  it('localizes a card CTA to Valencian', () => {
    expect(t('card.abrir', 'es')).toBe('Abrir →');
    expect(t('card.abrir', 'ca')).not.toBe('Abrir →');
  });
```

- [ ] **Step 4: Run tests.** Run: `npx vitest run src/i18n/ui.test.ts`. Expected: PASS (parity holds; the new assertion passes). If parity fails, a key is missing from `ca` or `es`.

- [ ] **Step 5: Type-check.** Run: `npm run check`. Expected: 0 new errors.

- [ ] **Step 6: Commit.**
```bash
git add src/i18n/ui.ts src/i18n/ui.test.ts
git commit -m "feat(i18n): add UI keys for hub card eyebrows, CTAs and labels"
```

---

### Task 2: `localizeFamilias` helper + `familias-ca.ts` overlays

**Files:**
- Create: `src/i18n/familias-ca.ts`
- Test: `src/i18n/familias-ca.test.ts`

**Interfaces:**
- Consumes: `Familia` (`src/lib/familia-grouping.ts`, shape `{ slug, label, intro, colorVar }`); the registries `FAMILIAS_DEBATE` (`src/lib/debates.ts`), `FAMILIAS` (`src/lib/dinamicas.ts`), `MATERIAS` (`src/lib/proyectos.ts`), `FAMILIAS_HERRAMIENTA` (`src/lib/herramientas.ts`), `BLOQUES` and `AMBITOS` (`src/lib/olimpiada.ts`).
- Produces: `type FamiliaOverlay = Partial<Record<string, Pick<Familia, 'label' | 'intro'>>>`; `localizeFamilias(list: Familia[], overlay: FamiliaOverlay, locale: Locale): Familia[]`; and one overlay const per registry: `FAMILIAS_DEBATE_CA`, `FAMILIAS_DINAMICAS_CA`, `MATERIAS_PROYECTOS_CA`, `FAMILIAS_HERRAMIENTA_CA`, `BLOQUES_OLIMPIADA_CA`, `AMBITOS_OLIMPIADA_CA`.

- [ ] **Step 1: Write the failing test.** Create `src/i18n/familias-ca.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { FAMILIAS_DEBATE } from '@/lib/debates';
import { FAMILIAS as FAMILIAS_DINAMICAS } from '@/lib/dinamicas';
import { MATERIAS } from '@/lib/proyectos';
import { FAMILIAS_HERRAMIENTA } from '@/lib/herramientas';
import { BLOQUES, AMBITOS } from '@/lib/olimpiada';
import {
  localizeFamilias,
  FAMILIAS_DEBATE_CA,
  FAMILIAS_DINAMICAS_CA,
  MATERIAS_PROYECTOS_CA,
  FAMILIAS_HERRAMIENTA_CA,
  BLOQUES_OLIMPIADA_CA,
  AMBITOS_OLIMPIADA_CA,
} from './familias-ca';

const cases = [
  ['debates', FAMILIAS_DEBATE, FAMILIAS_DEBATE_CA],
  ['dinamicas', FAMILIAS_DINAMICAS, FAMILIAS_DINAMICAS_CA],
  ['proyectos', MATERIAS, MATERIAS_PROYECTOS_CA],
  ['herramientas', FAMILIAS_HERRAMIENTA, FAMILIAS_HERRAMIENTA_CA],
  ['bloques', BLOQUES, BLOQUES_OLIMPIADA_CA],
  ['ambitos', AMBITOS, AMBITOS_OLIMPIADA_CA],
] as const;

describe('localizeFamilias', () => {
  it('es returns the list unchanged', () => {
    expect(localizeFamilias(FAMILIAS_DEBATE, FAMILIAS_DEBATE_CA, 'es')).toEqual(FAMILIAS_DEBATE);
  });
  it('ca overlays label/intro and preserves structural fields', () => {
    const [first] = localizeFamilias(FAMILIAS_DEBATE, FAMILIAS_DEBATE_CA, 'ca');
    expect(first.slug).toBe(FAMILIAS_DEBATE[0].slug);
    expect(first.colorVar).toBe(FAMILIAS_DEBATE[0].colorVar);
    expect(first.label).not.toBe('');
  });
  for (const [name, list, overlay] of cases) {
    it(`${name}: every overlay key is a real family slug`, () => {
      const slugs = new Set(list.map((f) => f.slug));
      for (const key of Object.keys(overlay)) expect(slugs.has(key)).toBe(true);
    });
    it(`${name}: every family has a CA overlay`, () => {
      for (const f of list) expect(overlay[f.slug]).toBeDefined();
    });
  }
});
```

- [ ] **Step 2: Run to verify it fails.** Run: `npx vitest run src/i18n/familias-ca.test.ts`. Expected: FAIL (module not found).

- [ ] **Step 3: Implement `familias-ca.ts`.** Create `src/i18n/familias-ca.ts` with the helper and six overlays. Translate every family's `label` + `intro` to Valencian (AVL) by reading the ES source in each registry file. Skeleton (fill each overlay with ALL slugs from its registry):
```ts
import { type Familia } from '@/lib/familia-grouping';
import { type Locale } from './locale';

export type FamiliaOverlay = Partial<Record<string, Pick<Familia, 'label' | 'intro'>>>;

/** Overlay VAL label/intro onto family headers; structural fields stay ES. */
export function localizeFamilias(list: Familia[], overlay: FamiliaOverlay, locale: Locale): Familia[] {
  return locale === 'es' ? list : list.map((f) => ({ ...f, ...overlay[f.slug] }));
}

// Keyed by family slug. One overlay per registry (slugs may repeat ACROSS
// registries with different meaning — never merge them into one map).
export const FAMILIAS_DEBATE_CA: FamiliaOverlay = { /* all slugs from FAMILIAS_DEBATE */ };
export const FAMILIAS_DINAMICAS_CA: FamiliaOverlay = { /* all slugs from FAMILIAS (dinamicas) */ };
export const MATERIAS_PROYECTOS_CA: FamiliaOverlay = { /* all slugs from MATERIAS */ };
export const FAMILIAS_HERRAMIENTA_CA: FamiliaOverlay = { /* all slugs from FAMILIAS_HERRAMIENTA */ };
export const BLOQUES_OLIMPIADA_CA: FamiliaOverlay = { /* all slugs from BLOQUES */ };
export const AMBITOS_OLIMPIADA_CA: FamiliaOverlay = { /* all slugs from AMBITOS */ };
```

- [ ] **Step 4: Run tests.** Run: `npx vitest run src/i18n/familias-ca.test.ts`. Expected: PASS. A failing "every family has a CA overlay" means a slug was missed.

- [ ] **Step 5: Type-check.** Run: `npm run check`. Expected: 0 new errors.

- [ ] **Step 6: Commit.**
```bash
git add src/i18n/familias-ca.ts src/i18n/familias-ca.test.ts
git commit -m "feat(i18n): add VAL overlays for transversal family headers"
```

---

### Task 3: Juegos overlay + wire `/juegos/`

**Files:**
- Create: `src/i18n/juegos-ca.ts`
- Test: `src/i18n/juegos-ca.test.ts`
- Modify: `src/pages/juegos/index.astro` (card map ~lines 55-76; imports)

**Interfaces:**
- Consumes: `Juego` (`src/lib/juegos.ts`, fields incl. `slug`, `title`, `descripcion`, `nota_aula`, `modo`, `estado: 'disponible' | 'proximamente'`); `getLocale` (`src/i18n/locale.ts`); `t` (`src/i18n/ui.ts`) keys from Task 1.
- Produces: `JUEGOS_CA`, `localizeJuego(j: Juego, locale): Juego`.

- [ ] **Step 1: Write the failing test.** Create `src/i18n/juegos-ca.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { JUEGOS } from '@/lib/juegos';
import { localizeJuego, JUEGOS_CA } from './juegos-ca';

describe('localizeJuego', () => {
  it('es returns the game unchanged', () => {
    expect(localizeJuego(JUEGOS[0], 'es')).toEqual(JUEGOS[0]);
  });
  it('ca overlays title and preserves slug', () => {
    const j = localizeJuego(JUEGOS[0], 'ca');
    expect(j.slug).toBe(JUEGOS[0].slug);
    expect(typeof j.title).toBe('string');
  });
  it('every overlay key is a real game slug', () => {
    const slugs = new Set(JUEGOS.map((j) => j.slug));
    for (const key of Object.keys(JUEGOS_CA)) expect(slugs.has(key)).toBe(true);
  });
  it('every game has a CA overlay', () => {
    for (const j of JUEGOS) expect(JUEGOS_CA[j.slug]).toBeDefined();
  });
});
```

- [ ] **Step 2: Run to verify it fails.** Run: `npx vitest run src/i18n/juegos-ca.test.ts`. Expected: FAIL (module not found).

- [ ] **Step 3: Implement `juegos-ca.ts`.** Mirror the canonical overlay pattern. Read `src/lib/juegos.ts` and translate each game's `title`, `descripcion`, `nota_aula`, `modo` to VAL for ALL slugs (stonks, econrisk, econopoly, cajut, seguros, insider):
```ts
import { type Juego } from '@/lib/juegos';
import { type Locale } from './locale';

type JuegoCA = Partial<Pick<Juego, 'title' | 'descripcion' | 'nota_aula' | 'modo'>>;
export const JUEGOS_CA: Partial<Record<string, JuegoCA>> = { /* keyed by slug */ };

export function localizeJuego(j: Juego, locale: Locale): Juego {
  return locale === 'es' ? j : { ...j, ...JUEGOS_CA[j.slug] };
}
```

- [ ] **Step 4: Run tests.** Run: `npx vitest run src/i18n/juegos-ca.test.ts`. Expected: PASS.

- [ ] **Step 5: Wire `/juegos/index.astro`.** Add imports `import { localizeJuego } from '@/i18n/juegos-ca';` and (if absent) `import { t } from '@/i18n/ui';` and confirm `getLocale`/`locale` exist (the page already localizes its hero). In the card map, render `const j = localizeJuego(rawJuego, locale)` (map over `JUEGOS.map((raw) => { const j = localizeJuego(raw, locale); ... })`), and replace the hardcoded card strings with `t()`: eyebrow "Disponible"/"Próximamente" → `t(j.estado === 'disponible' ? 'estado.disponible' : 'estado.proximamente', locale)`; "· Multijugador" suffix → `t('meta.multijugador', locale)`; CTA "Jugar →"/"Abrir sala (proyector) →" → `t('card.jugar', locale)` / `t('card.abrirSala', locale)`; the inline `NIVEL_LABEL` map (line ~7) → derive from `t('nivel.eso'|'nivel.bach'|'nivel.fp', locale)`. The "imprimibles" list (lines ~74-76) reuses `j.title` — map those through `localizeJuego` too.

- [ ] **Step 6: Type-check + tests.** Run: `npm run check` (expected 0 new errors) and `npx vitest run src/i18n/juegos-ca.test.ts src/i18n/ui.test.ts` (expected PASS).

- [ ] **Step 7: Commit.**
```bash
git add src/i18n/juegos-ca.ts src/i18n/juegos-ca.test.ts src/pages/juegos/index.astro
git commit -m "feat(i18n): translate juegos hub cards to Valencian"
```

---

### Task 4: Herramientas overlay + wire `/herramientas/`

**Files:**
- Create: `src/i18n/herramientas-ca.ts`
- Test: `src/i18n/herramientas-ca.test.ts`
- Modify: `src/pages/herramientas/index.astro` (card map ~lines 75-81; family headers; imports)

**Interfaces:**
- Consumes: `Herramienta` (`src/lib/herramientas.ts`, fields incl. `slug`, `title`, `descripcion`, `familia`, `tipo`), `HERRAMIENTAS`, `FAMILIAS_HERRAMIENTA`, `gruposHerramientas()`; `localizeFamilias` + `FAMILIAS_HERRAMIENTA_CA` (Task 2); `t` (Task 1); `getLocale`.
- Produces: `HERRAMIENTAS_CA`, `localizeHerramienta(h, locale)`.

- [ ] **Step 1: Write the failing test.** Create `src/i18n/herramientas-ca.test.ts` (mirror Task 3's test, swapping `HERRAMIENTAS`/`localizeHerramienta`/`HERRAMIENTAS_CA`, asserting `slug` preserved and every `HERRAMIENTAS` item has an overlay).

- [ ] **Step 2: Run to verify it fails.** Run: `npx vitest run src/i18n/herramientas-ca.test.ts`. Expected: FAIL (module not found).

- [ ] **Step 3: Implement `herramientas-ca.ts`.** Mirror the canonical pattern; translate `title` + `descripcion` for ALL 22 `HERRAMIENTAS` slugs (read `src/lib/herramientas.ts`):
```ts
import { type Herramienta } from '@/lib/herramientas';
import { type Locale } from './locale';

type HerramientaCA = Partial<Pick<Herramienta, 'title' | 'descripcion'>>;
export const HERRAMIENTAS_CA: Partial<Record<string, HerramientaCA>> = { /* keyed by slug */ };

export function localizeHerramienta(h: Herramienta, locale: Locale): Herramienta {
  return locale === 'es' ? h : { ...h, ...HERRAMIENTAS_CA[h.slug] };
}
```

- [ ] **Step 4: Run tests.** Run: `npx vitest run src/i18n/herramientas-ca.test.ts`. Expected: PASS.

- [ ] **Step 5: Wire `/herramientas/index.astro`.** Add imports for `localizeHerramienta`, `localizeFamilias`, `FAMILIAS_HERRAMIENTA_CA`, and `t`; confirm `locale` exists (hero already localized). Map each tool through `localizeHerramienta(h, locale)` in the card grid, and each family header through `localizeFamilias(FAMILIAS_HERRAMIENTA, FAMILIAS_HERRAMIENTA_CA, locale)`. Replace the inline `TIPO_LABEL` eyebrow (~lines 12-15) with `t('tipo.calculadora' | 'tipo.simulador' | ... , locale)`. If `gruposHerramientas()` groups by `FAMILIAS_HERRAMIENTA` internally, localize the family label/intro at render time (do not mutate the registry).

- [ ] **Step 6: Type-check + tests.** Run: `npm run check` and `npx vitest run src/i18n/herramientas-ca.test.ts src/i18n/familias-ca.test.ts`. Expected: 0 new errors, PASS.

- [ ] **Step 7: Commit.**
```bash
git add src/i18n/herramientas-ca.ts src/i18n/herramientas-ca.test.ts src/pages/herramientas/index.astro
git commit -m "feat(i18n): translate herramientas hub cards to Valencian"
```

---

### Task 5: Generadores overlay + wire `/generadores/`

**Files:**
- Create: `src/i18n/generadores-ca.ts`
- Test: `src/i18n/generadores-ca.test.ts`
- Modify: `src/pages/generadores/index.astro` (external cards ~lines 61-68; native cards ~lines 75-82; imports)

**Interfaces:**
- Consumes: `GeneradorNativo` (fields incl. `slug`, `title`, `descripcion`, `comoUsar`, `grupo`, `tipo`), `GeneradorExterno` (`{ title, descripcion, href, eyebrow }` — NO slug), `GENERADORES_NATIVOS`, `GENERADORES_EXTERNOS`, `gruposNativos()`; `t` (Task 1); `getLocale`.
- Produces: `GENERADORES_NATIVOS_CA` (keyed by `slug`), `GENERADORES_EXTERNOS_CA` (keyed by `href`, since externals have no slug), `localizeGeneradorNativo(g, locale)`, `localizeGeneradorExterno(g, locale)`.

- [ ] **Step 1: Write the failing test.** Create `src/i18n/generadores-ca.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { GENERADORES_NATIVOS, GENERADORES_EXTERNOS } from '@/lib/generadores';
import {
  localizeGeneradorNativo, GENERADORES_NATIVOS_CA,
  localizeGeneradorExterno, GENERADORES_EXTERNOS_CA,
} from './generadores-ca';

describe('generadores overlays', () => {
  it('es returns unchanged', () => {
    expect(localizeGeneradorNativo(GENERADORES_NATIVOS[0], 'es')).toEqual(GENERADORES_NATIVOS[0]);
    expect(localizeGeneradorExterno(GENERADORES_EXTERNOS[0], 'es')).toEqual(GENERADORES_EXTERNOS[0]);
  });
  it('every native overlay key is a real slug + every native has an overlay', () => {
    const slugs = new Set(GENERADORES_NATIVOS.map((g) => g.slug));
    for (const key of Object.keys(GENERADORES_NATIVOS_CA)) expect(slugs.has(key)).toBe(true);
    for (const g of GENERADORES_NATIVOS) expect(GENERADORES_NATIVOS_CA[g.slug]).toBeDefined();
  });
  it('every external overlay key is a real href + every external has an overlay', () => {
    const hrefs = new Set(GENERADORES_EXTERNOS.map((g) => g.href));
    for (const key of Object.keys(GENERADORES_EXTERNOS_CA)) expect(hrefs.has(key)).toBe(true);
    for (const g of GENERADORES_EXTERNOS) expect(GENERADORES_EXTERNOS_CA[g.href]).toBeDefined();
  });
});
```

- [ ] **Step 2: Run to verify it fails.** Run: `npx vitest run src/i18n/generadores-ca.test.ts`. Expected: FAIL (module not found).

- [ ] **Step 3: Implement `generadores-ca.ts`.** Translate native `title`/`descripcion`/`comoUsar` (6 slugs) and external `eyebrow`/`title`/`descripcion` (2, keyed by `href`):
```ts
import { type GeneradorNativo, type GeneradorExterno } from '@/lib/generadores';
import { type Locale } from './locale';

type GenNativoCA = Partial<Pick<GeneradorNativo, 'title' | 'descripcion' | 'comoUsar'>>;
export const GENERADORES_NATIVOS_CA: Partial<Record<string, GenNativoCA>> = { /* keyed by slug */ };
export function localizeGeneradorNativo(g: GeneradorNativo, locale: Locale): GeneradorNativo {
  return locale === 'es' ? g : { ...g, ...GENERADORES_NATIVOS_CA[g.slug] };
}

type GenExternoCA = Partial<Pick<GeneradorExterno, 'eyebrow' | 'title' | 'descripcion'>>;
export const GENERADORES_EXTERNOS_CA: Partial<Record<string, GenExternoCA>> = { /* keyed by href */ };
export function localizeGeneradorExterno(g: GeneradorExterno, locale: Locale): GeneradorExterno {
  return locale === 'es' ? g : { ...g, ...GENERADORES_EXTERNOS_CA[g.href] };
}
```

- [ ] **Step 4: Run tests.** Run: `npx vitest run src/i18n/generadores-ca.test.ts`. Expected: PASS.

- [ ] **Step 5: Wire `/generadores/index.astro`.** Import both localize helpers + `t`; confirm `locale` exists (hero already localized). Map external cards through `localizeGeneradorExterno` and native cards through `localizeGeneradorNativo`. Replace hardcoded CTAs with `t('card.abrirExterno', locale)` / `t('card.abrir', locale)`, the "Generadores LOMLOE" section title with `t('gen.lomloe', locale)`, and the native group labels from `gruposNativos()` ("Evaluación", "Atención y aula") with `t('gen.grupo.evaluacion' | 'gen.grupo.aula', locale)` at render (localize the label by `grupo` key; do not mutate the registry). Replace the inline `TIPO_LABEL` (~line 11) with `t('tipo.*', locale)`.

- [ ] **Step 6: Type-check + tests.** Run: `npm run check` and `npx vitest run src/i18n/generadores-ca.test.ts src/i18n/ui.test.ts`. Expected: 0 new errors, PASS.

- [ ] **Step 7: Commit.**
```bash
git add src/i18n/generadores-ca.ts src/i18n/generadores-ca.test.ts src/pages/generadores/index.astro
git commit -m "feat(i18n): translate generadores hub cards to Valencian"
```

---

### Task 6: Family headers on `/debates/`, `/dinamicas/`, `/proyectos/`

**Files:**
- Modify: `src/pages/debates/index.astro` (family headers ~lines 53-54, filter chips ~line 44)
- Modify: `src/pages/dinamicas/index.astro` (same structure)
- Modify: `src/pages/proyectos/index.astro` (materia headers, ~lines 47-54 area)

**Interfaces:**
- Consumes: `localizeFamilias` + `FAMILIAS_DEBATE_CA`/`FAMILIAS_DINAMICAS_CA`/`MATERIAS_PROYECTOS_CA` (Task 2); `getLocale`. The registries `FAMILIAS_DEBATE`/`FAMILIAS`/`MATERIAS`.
- Produces: nothing (page wiring only).

Scope note: ONLY the family headers + filter chips move to VAL. The individual cards (MDX frontmatter) stay ES per the spec.

- [ ] **Step 1: Wire debates.** In `src/pages/debates/index.astro`, add `import { getLocale } from '@/i18n/locale';` (if absent), `import { localizeFamilias, FAMILIAS_DEBATE_CA } from '@/i18n/familias-ca';`, and `const locale = getLocale(Astro.currentLocale);`. Where family label/intro are read for the `<h2>`/intro and the filter chips, resolve them through `localizeFamilias(FAMILIAS_DEBATE, FAMILIAS_DEBATE_CA, locale)` (build a slug→localized-familia lookup and use it for both the grouping headers and the chips).

- [ ] **Step 2: Wire dinamicas.** Same edit in `src/pages/dinamicas/index.astro` with `FAMILIAS` (dinamicas) + `FAMILIAS_DINAMICAS_CA`.

- [ ] **Step 3: Wire proyectos.** Same edit in `src/pages/proyectos/index.astro` with `MATERIAS` + `MATERIAS_PROYECTOS_CA`.

- [ ] **Step 4: Type-check.** Run: `npm run check`. Expected: 0 new errors.

- [ ] **Step 5: Run the family test (regression guard).** Run: `npx vitest run src/i18n/familias-ca.test.ts`. Expected: PASS.

- [ ] **Step 6: Commit.**
```bash
git add src/pages/debates/index.astro src/pages/dinamicas/index.astro src/pages/proyectos/index.astro
git commit -m "feat(i18n): translate debates/dinamicas/proyectos family headers to Valencian"
```

---

### Task 7: Olimpiada — guia overlay + inline sub-areas + family headers

**Files:**
- Create: `src/i18n/olimpiada-ca.ts`
- Test: `src/i18n/olimpiada-ca.test.ts`
- Modify: `src/pages/olimpiada/index.astro` (inline `subAreas` ~lines 32-63; `GUIA` render ~lines 94-104; section titles)
- Modify: family headers on `src/pages/olimpiada/banco/index.astro` and `src/pages/olimpiada/simulacros/index.astro` (BLOQUES/AMBITOS headers only — quiz/content stays ES)

**Interfaces:**
- Consumes: `GUIA` (`src/lib/olimpiada.ts`, `{ duracion, total, partes: {nombre, puntos, descripcion}[] }`); `BLOQUES`, `AMBITOS`; `localizeFamilias` + `BLOQUES_OLIMPIADA_CA`/`AMBITOS_OLIMPIADA_CA` (Task 2); `getLocale`.
- Produces: `localizeGuia(guia, locale)` returning a GUIA-shaped object with VAL `duracion`/`total`/`partes[].nombre|puntos|descripcion`.

- [ ] **Step 1: Write the failing test.** Create `src/i18n/olimpiada-ca.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { GUIA } from '@/lib/olimpiada';
import { localizeGuia } from './olimpiada-ca';

describe('localizeGuia', () => {
  it('es returns the guide unchanged', () => {
    expect(localizeGuia(GUIA, 'es')).toEqual(GUIA);
  });
  it('ca keeps the same number of partes', () => {
    expect(localizeGuia(GUIA, 'ca').partes.length).toBe(GUIA.partes.length);
  });
});
```

- [ ] **Step 2: Run to verify it fails.** Run: `npx vitest run src/i18n/olimpiada-ca.test.ts`. Expected: FAIL (module not found).

- [ ] **Step 3: Implement `olimpiada-ca.ts`.** Read `src/lib/olimpiada.ts` for `GUIA`. Translate `duracion`, `total` and each `partes[].nombre`/`puntos`/`descripcion` to VAL. Because `GUIA` has no slug, translate positionally by index (partes order is stable):
```ts
import { GUIA } from '@/lib/olimpiada';
import { type Locale } from './locale';

type Guia = typeof GUIA;
const GUIA_CA: Guia = { /* full VAL copy of GUIA, same shape/length */ };

export function localizeGuia(guia: Guia, locale: Locale): Guia {
  return locale === 'es' ? guia : GUIA_CA;
}
```

- [ ] **Step 4: Run tests.** Run: `npx vitest run src/i18n/olimpiada-ca.test.ts`. Expected: PASS.

- [ ] **Step 5: Wire `/olimpiada/index.astro`.** Add a `const copy = { es: {...}, ca: {...} }[locale];` object holding VAL for the inline `subAreas` array (title + desc for the 5 items), the section titles ("Cómo es el examen", "Recursos de preparación") and the "Olimpiada" eyebrow. Render sub-area cards from `copy` (keep slugs/hrefs/colors structural). Render the exam guide via `localizeGuia(GUIA, locale)`.

- [ ] **Step 6: Wire olimpiada sub-hub family headers.** In `src/pages/olimpiada/banco/index.astro` and `src/pages/olimpiada/simulacros/index.astro`, resolve the `BLOQUES`/`AMBITOS` family headers through `localizeFamilias(..., BLOQUES_OLIMPIADA_CA | AMBITOS_OLIMPIADA_CA, locale)`. Do NOT touch the quiz questions or PDFs — content stays ES.

- [ ] **Step 7: Type-check + tests.** Run: `npm run check` and `npx vitest run src/i18n/olimpiada-ca.test.ts src/i18n/familias-ca.test.ts`. Expected: 0 new errors, PASS.

- [ ] **Step 8: Commit.**
```bash
git add src/i18n/olimpiada-ca.ts src/i18n/olimpiada-ca.test.ts src/pages/olimpiada/index.astro src/pages/olimpiada/banco/index.astro src/pages/olimpiada/simulacros/index.astro
git commit -m "feat(i18n): translate olimpiada hub cards and family headers to Valencian"
```

---

### Task 8: Emprendimiento — itinerarios overlay + inline hub copy

**Files:**
- Create: `src/i18n/emprendimiento-ca.ts`
- Test: `src/i18n/emprendimiento-ca.test.ts`
- Modify: `src/pages/emprendimiento/index.astro` (feature card ~lines 50-74; two-materias cards ~lines 82-101; recursos cards ~lines 116-133; headings; imports)

**Interfaces:**
- Consumes: `Itinerario` (`src/lib/emprendimiento.ts`, `{ id, label, descripcion, fases }`), `ITINERARIOS`; `ASIGNATURAS` + `localizeAsignatura` (existing, for the GPE card title); `getLocale`.
- Produces: `ITINERARIOS_CA` (keyed by `id`), `localizeItinerario(it, locale)`.

- [ ] **Step 1: Write the failing test.** Create `src/i18n/emprendimiento-ca.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { ITINERARIOS } from '@/lib/emprendimiento';
import { localizeItinerario, ITINERARIOS_CA } from './emprendimiento-ca';

describe('localizeItinerario', () => {
  it('es returns unchanged', () => {
    expect(localizeItinerario(ITINERARIOS[0], 'es')).toEqual(ITINERARIOS[0]);
  });
  it('every overlay key is a real itinerario id + every itinerario has an overlay', () => {
    const ids = new Set(ITINERARIOS.map((i) => i.id));
    for (const key of Object.keys(ITINERARIOS_CA)) expect(ids.has(key)).toBe(true);
    for (const i of ITINERARIOS) expect(ITINERARIOS_CA[i.id]).toBeDefined();
  });
});
```

- [ ] **Step 2: Run to verify it fails.** Run: `npx vitest run src/i18n/emprendimiento-ca.test.ts`. Expected: FAIL (module not found).

- [ ] **Step 3: Implement `emprendimiento-ca.ts`.** Translate `label` + `descripcion` for the 3 itinerarios (keyed by `id`):
```ts
import { type Itinerario, ITINERARIOS } from '@/lib/emprendimiento';
import { type Locale } from './locale';

type ItinerarioCA = Partial<Pick<Itinerario, 'label' | 'descripcion'>>;
export const ITINERARIOS_CA: Partial<Record<string, ItinerarioCA>> = { /* keyed by id */ };

export function localizeItinerario(it: Itinerario, locale: Locale): Itinerario {
  return locale === 'es' ? it : { ...it, ...ITINERARIOS_CA[it.id] };
}
```

- [ ] **Step 4: Run tests.** Run: `npx vitest run src/i18n/emprendimiento-ca.test.ts`. Expected: PASS.

- [ ] **Step 5: Wire `/emprendimiento/index.astro`.** Add `getLocale`, `localizeItinerario`, `localizeAsignatura`, `t`. Add a `const copy = { es: {...}, ca: {...} }[locale];` object for ALL inline ES on the page: feature card «De cero a empresa» (eyebrow/title/desc/cta), the EDMN card (title/desc/eyebrow), the 3 recursos cards (eyebrow/title/desc/cta), and all section headings. Render itinerary rows via `localizeItinerario`; render the GPE card title via `localizeAsignatura(gpe, locale).title`. Pass `contentLang={locale}` to the layout since the whole hub becomes VAL (verify no ES-only children need otherwise).

- [ ] **Step 6: Type-check + tests.** Run: `npm run check` and `npx vitest run src/i18n/emprendimiento-ca.test.ts`. Expected: 0 new errors, PASS.

- [ ] **Step 7: Commit.**
```bash
git add src/i18n/emprendimiento-ca.ts src/i18n/emprendimiento-ca.test.ts src/pages/emprendimiento/index.astro
git commit -m "feat(i18n): translate emprendimiento hub to Valencian"
```

---

### Task 9: Asignatura hub — section cards inline copy + hero fix

**Files:**
- Modify: `src/pages/[asignatura]/index.astro` (section arrays ~lines 45-68; card render ~lines 153-176; hero ~lines 116-121; imports)

**Interfaces:**
- Consumes: `ASIGNATURAS` + `localizeAsignatura` (existing); `getLocale`. The inline arrays `material`/`interactivo`/`profe` and `grupos`.
- Produces: nothing (page wiring only).

- [ ] **Step 1: Fix the hero.** The page imports `ASIGNATURAS` and reads `a.title`/`a.tagline` directly. Add `import { getLocale } from '@/i18n/locale';`, `import { localizeAsignatura } from '@/i18n/asignaturas-ca';`, `const locale = getLocale(Astro.currentLocale);`, and replace the hero source `const a = ...props...` usage with `const a = localizeAsignatura(rawAsignatura, locale);` so the hero title/tagline localize under `/ca`.

- [ ] **Step 2: Add inline copy for the section cards.** Add a `const copy = { es: {...}, ca: {...} }[locale];` object containing VAL for every `{title, desc}` in `material`/`interactivo`/`profe` (~12 items: libro, diapositivas, actividades, refuerzo, proyecto, tests→"Simuladores", recursos, retos, actividades-dinamicas, ebau, evaluacion, programacion — read the ES source at lines ~45-63), the group labels/descs, and the Olimpiada cross-link card (~lines 170-176). Keep item `slug`s structural; select label/desc from `copy` by slug.

- [ ] **Step 3: Type-check.** Run: `npm run check`. Expected: 0 new errors.

- [ ] **Step 4: Regression tests.** Run: `npx vitest run src/i18n/asignaturas-ca.test.ts`. Expected: PASS (hero fix must not break the existing overlay).

- [ ] **Step 5: Commit.**
```bash
git add "src/pages/[asignatura]/index.astro"
git commit -m "feat(i18n): translate asignatura hub section cards + fix VAL hero"
```

---

## Final verification (after all tasks)

- [ ] `npm run check` — 0 new errors.
- [ ] `npx vitest run` — full suite green (all new `*-ca.test.ts` + existing).
- [ ] Push branch, open PR. The **Vercel preview build is the authoritative production build**; confirm the deployment check is `pass` before merge.
- [ ] Surface for Pau's VAL review: the six new overlay files + the inline `copy.ca` objects (juegos, herramientas, generadores, familias, olimpiada, emprendimiento, asignatura hub) + the new `ui.ca` keys.
