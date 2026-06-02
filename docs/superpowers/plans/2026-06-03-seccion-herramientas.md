# Sección «Herramientas» (caja de herramientas) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a transversal `/herramientas/` toolbox section that aggregates the 17 existing calculator islands by thematic family (with a type tag) and links each to the units it appears in — deriving that curriculum map from the existing `recursos`. Rename the current 2-generator section to «Generadores».

**Architecture:** A TS registry (`src/lib/herramientas.ts`, 17 entries + 5 families) reusing the shared `familia-grouping.ts` helpers. The 17 islands are dispatched through a single extracted `HerramientaIsland.astro` (shared with `recursos/[slug].astro`). The detail page derives each tool's `unidades_relacionadas` from the `recursos` collection (single source of truth) and feeds `PuenteUnidades`.

**Tech Stack:** Astro 5, Preact islands (`client:load`), TypeScript, Vitest.

---

## File structure

| File | Responsibility |
|---|---|
| `src/pages/generadores/index.astro` (create) | The renamed 2-generator page (was `herramientas/index.astro`). |
| `src/lib/asignaturas.ts` (modify) | `SECCIONES_TRANSVERSALES`: repurpose `herramientas` entry + add `generadores`. |
| `src/lib/asignaturas.test.ts` (modify) | Cover both menu entries. |
| `src/lib/herramientas.ts` (create) | `COMPONENTE_KEYS`, `FAMILIAS_HERRAMIENTA`, `HERRAMIENTAS` registry, `herramientaPorSlug`, `gruposHerramientas`, `unidadesPorComponente`. |
| `src/lib/herramientas.test.ts` (create) | Registry/family/derivation tests. |
| `src/components/calculadoras/HerramientaIsland.astro` (create) | Shared island dispatch by `componente`. |
| `src/pages/[asignatura]/recursos/[slug].astro` (modify) | Use `HerramientaIsland`; drop the inline 17-island block. |
| `src/pages/herramientas/index.astro` (overwrite) | New toolbox hub (families + cards). |
| `src/pages/herramientas/[familia]/[slug].astro` (create) | Detail: island + derived curriculum map + competencias. |

Reused as-is: `@components/emprendimiento/PuenteUnidades.astro`, `@layouts/BaseLayout.astro`, `src/lib/familia-grouping.ts`.

---

## Task 1: Rename the current section → «Generadores»

**Files:**
- Create: `src/pages/generadores/index.astro`
- Modify: `src/lib/asignaturas.ts`
- Modify: `src/lib/asignaturas.test.ts`

- [ ] **Step 1: Create `src/pages/generadores/index.astro`** — copy the CURRENT content of `src/pages/herramientas/index.astro` verbatim, then change: the `<BaseLayout title=...>` to `title="Generadores docentes"`, the breadcrumb `<span>Herramientas</span>` → `<span>Generadores</span>`, and the `<h1>` from `Herramientas <span class="serif-italic-wonk accent">docentes</span>.` → `<span class="serif-italic-wonk accent">Generadores</span> docentes.`. Everything else (the two tool cards, the note, all the `<style>`) stays identical. (Read `src/pages/herramientas/index.astro` to copy it; do NOT delete it yet — Task 4 overwrites it with the new hub.)

- [ ] **Step 2: Write the failing menu test** — replace the existing `herramientas` assertions in `src/lib/asignaturas.test.ts` and add `generadores`. Append/adjust:

```ts
describe('SECCIONES_TRANSVERSALES — herramientas (caja) y generadores', () => {
  it('mantiene herramientas apuntando a la caja de herramientas', () => {
    const s = SECCIONES_TRANSVERSALES.find((x) => x.slug === 'herramientas');
    expect(s?.label).toBe('Herramientas');
    expect(s?.description.toLowerCase()).toContain('calculadora');
  });
  it('añade la sección generadores', () => {
    const slugs = SECCIONES_TRANSVERSALES.map((s) => s.slug);
    expect(slugs).toContain('generadores');
    const s = SECCIONES_TRANSVERSALES.find((x) => x.slug === 'generadores');
    expect(s?.label).toBe('Generadores');
    expect(s?.description.length).toBeGreaterThan(0);
  });
});
```
Note: the FILE already has an older `herramientas` expectation only if present — read it first. The current `SECCIONES_TRANSVERSALES` entry is `{ slug: 'herramientas', label: 'Herramientas', description: 'Generadores de SA LOMLOE y pruebas.' }`. There is no existing herramientas-specific test block to remove (the test file covers dinamicas, jocs-economics, debates). Just ADD the block above.

- [ ] **Step 3: Run it to verify it fails**

Run: `npx vitest run src/lib/asignaturas.test.ts`
Expected: FAIL — `generadores` missing; herramientas description doesn't contain "calculadora".

- [ ] **Step 4: Edit `SECCIONES_TRANSVERSALES`** in `src/lib/asignaturas.ts`. Change the `herramientas` entry's description and add a `generadores` entry right after it:

```ts
  { slug: 'herramientas',   label: 'Herramientas',   description: 'Calculadoras y simuladores para usar en clase.' },
  { slug: 'generadores',    label: 'Generadores',    description: 'Situaciones de Aprendizaje LOMLOE y pruebas de evaluación.' },
```
(Keep the rest of the array unchanged; preserve the `as const` and column alignment.)

- [ ] **Step 5: Run it to verify it passes**

Run: `npx vitest run src/lib/asignaturas.test.ts`
Expected: PASS.

- [ ] **Step 6: Type-check**

Run: `npx astro check`
Expected: no NEW errors (6 pre-existing unrelated errors remain).

- [ ] **Step 7: Commit**

```bash
git add src/pages/generadores/index.astro src/lib/asignaturas.ts src/lib/asignaturas.test.ts
git commit -m "feat(herramientas): rename current section to Generadores, free the Herramientas name"
```

---

## Task 2: Herramientas registry library

**Files:**
- Create: `src/lib/herramientas.ts`
- Create: `src/lib/herramientas.test.ts`

- [ ] **Step 1: Write the failing test** — `src/lib/herramientas.test.ts`

```ts
import { describe, it, expect } from 'vitest';
import {
  COMPONENTE_KEYS, FAMILIAS_HERRAMIENTA, HERRAMIENTAS,
  herramientaPorSlug, gruposHerramientas, unidadesPorComponente,
} from './herramientas.ts';

describe('HERRAMIENTAS registry', () => {
  it('has 17 tools, all with a valid componente and an existing familia', () => {
    expect(HERRAMIENTAS).toHaveLength(17);
    const fams = new Set(FAMILIAS_HERRAMIENTA.map((f) => f.slug));
    for (const h of HERRAMIENTAS) {
      expect(COMPONENTE_KEYS).toContain(h.componente);
      expect(fams.has(h.familia)).toBe(true);
    }
  });
  it('every componente is used exactly once and slugs are unique', () => {
    const comps = HERRAMIENTAS.map((h) => h.componente);
    expect(new Set(comps).size).toBe(17);
    const slugs = HERRAMIENTAS.map((h) => `${h.familia}/${h.slug}`);
    expect(new Set(slugs).size).toBe(17);
  });
});

describe('FAMILIAS_HERRAMIENTA', () => {
  it('declares 5 families with a color token each', () => {
    expect(FAMILIAS_HERRAMIENTA.map((f) => f.slug)).toEqual([
      'costes-resultados', 'mercados-macro', 'inversion-finanzas',
      'finanzas-personales', 'orientacion-fp',
    ]);
    for (const f of FAMILIAS_HERRAMIENTA) expect(f.colorVar).toMatch(/^--color-[a-z0-9-]+$/);
  });
});

describe('herramientaPorSlug', () => {
  it('resolves a known tool', () => {
    expect(herramientaPorSlug('costes-resultados', 'punto-muerto')?.componente).toBe('PuntoMuerto');
  });
  it('returns undefined for an unknown tool', () => {
    expect(herramientaPorSlug('costes-resultados', 'nope')).toBeUndefined();
  });
});

describe('gruposHerramientas', () => {
  it('groups in family order and exposes the herramienta on each item', () => {
    const groups = gruposHerramientas();
    expect(groups[0].familia.slug).toBe('costes-resultados');
    expect(groups[0].items[0].h.componente).toBe('PuntoMuerto');
  });
});

describe('unidadesPorComponente', () => {
  it('groups {asignatura, unidad} by componente and dedupes', () => {
    const recursos = [
      { data: { componente: 'PuntoMuerto', asignatura: 'edmn-2bach', unidad_relacionada: 4 } },
      { data: { componente: 'PuntoMuerto', asignatura: 'edmn-2bach', unidad_relacionada: 4 } },
      { data: { componente: 'Ratios', asignatura: 'eco-1bach', unidad_relacionada: 7 } },
      { data: { componente: 'PuntoMuerto', asignatura: 'gpe-bach' } }, // no unidad → skipped
    ];
    const map = unidadesPorComponente(recursos);
    expect(map.get('PuntoMuerto')).toEqual([{ asignatura: 'edmn-2bach', unidad: 4 }]);
    expect(map.get('Ratios')).toEqual([{ asignatura: 'eco-1bach', unidad: 7 }]);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/lib/herramientas.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `src/lib/herramientas.ts`**

```ts
/**
 * Registry for the transversal «Herramientas» toolbox. Each tool is an existing
 * Preact island keyed by `componente` (the same enum used by the `recursos`
 * collection). The per-tool curriculum map is NOT stored here — it is derived
 * from `recursos` at build time (see unidadesPorComponente). Family color-coding
 * reuses existing global.css tokens — no new colors.
 */
import type { Familia } from './familia-grouping';
import { groupByFamilia } from './familia-grouping';
export type { Familia, FamiliaGroup } from './familia-grouping';

export const COMPONENTE_KEYS = [
  'PuntoMuerto', 'VANTIR', 'Ratios', 'ADASSimulator', 'InteresCompuesto', 'NominaESO',
  'Presupuesto503020', 'BuscadorItinerarios', 'GeneradorCVEuropass', 'DCF', 'RatiosBenchmark',
  'Elasticidad', 'MultiplicadorGasto', 'IRPFDeclaracion', 'CocheVsAlternativa', 'RIASEC',
  'PresupuestoUni',
] as const;
export type ComponenteKey = typeof COMPONENTE_KEYS[number];

export type TipoHerramienta = 'calculadora' | 'simulador' | 'test' | 'generador' | 'buscador' | 'plantilla';

export interface Herramienta {
  componente: ComponenteKey;
  slug: string;
  title: string;
  familia: string;
  orden: number;
  tipo: TipoHerramienta;
  descripcion: string;
  competencias_clave: string[];
  competencias_especificas: string[];
}

export const FAMILIAS_HERRAMIENTA: Familia[] = [
  { slug: 'costes-resultados',   label: 'Costes y resultados',     intro: 'Umbral de rentabilidad y análisis de cuentas.',        colorVar: '--color-edmn' },
  { slug: 'mercados-macro',      label: 'Mercados y macroeconomía',intro: 'Elasticidad, oferta y demanda agregada, multiplicador.', colorVar: '--color-eco1' },
  { slug: 'inversion-finanzas',  label: 'Inversión y finanzas',    intro: 'Valorar inversiones: VAN, TIR, descuento e interés.',   colorVar: '--color-mustard' },
  { slug: 'finanzas-personales', label: 'Finanzas personales',     intro: 'Nómina, IRPF, presupuesto y decisiones de gasto.',      colorVar: '--color-fopp' },
  { slug: 'orientacion-fp',      label: 'Orientación y FP',        intro: 'Intereses, itinerarios y currículum.',                  colorVar: '--color-ipe2' },
];

export const HERRAMIENTAS: Herramienta[] = [
  // Costes y resultados
  { componente: 'PuntoMuerto',        slug: 'punto-muerto',        title: 'Punto muerto (umbral de rentabilidad)', familia: 'costes-resultados',   orden: 1, tipo: 'calculadora', descripcion: 'Calcula el punto muerto y el umbral de rentabilidad de un producto.', competencias_clave: ['STEM', 'CD', 'CE'], competencias_especificas: [] },
  { componente: 'Ratios',             slug: 'ratios',              title: 'Ratios financieros',                    familia: 'costes-resultados',   orden: 2, tipo: 'calculadora', descripcion: 'Liquidez, solvencia, endeudamiento y rentabilidad a partir del balance.', competencias_clave: ['STEM', 'CD', 'CE'], competencias_especificas: [] },
  { componente: 'RatiosBenchmark',    slug: 'ratios-benchmark',    title: 'Ratios con comparativa sectorial',      familia: 'costes-resultados',   orden: 3, tipo: 'calculadora', descripcion: 'Compara los ratios de una empresa con referencias del sector.', competencias_clave: ['STEM', 'CD', 'CE'], competencias_especificas: [] },
  // Mercados y macroeconomía
  { componente: 'Elasticidad',        slug: 'elasticidad',         title: 'Elasticidad de la demanda',             familia: 'mercados-macro',      orden: 1, tipo: 'calculadora', descripcion: 'Elasticidad precio de la demanda y su efecto sobre el ingreso.', competencias_clave: ['STEM', 'CD'], competencias_especificas: [] },
  { componente: 'ADASSimulator',      slug: 'oferta-demanda-agregada', title: 'Simulador oferta y demanda agregada', familia: 'mercados-macro',  orden: 2, tipo: 'simulador',   descripcion: 'Mueve la AD y la AS y observa el efecto sobre producción y precios.', competencias_clave: ['STEM', 'CD'], competencias_especificas: [] },
  { componente: 'MultiplicadorGasto', slug: 'multiplicador-gasto', title: 'Multiplicador del gasto',               familia: 'mercados-macro',      orden: 3, tipo: 'calculadora', descripcion: 'Efecto multiplicador de una variación del gasto sobre la renta.', competencias_clave: ['STEM', 'CD'], competencias_especificas: [] },
  // Inversión y finanzas
  { componente: 'VANTIR',             slug: 'van-tir',             title: 'VAN y TIR',                             familia: 'inversion-finanzas',  orden: 1, tipo: 'calculadora', descripcion: 'Valor actual neto y tasa interna de retorno de una inversión.', competencias_clave: ['STEM', 'CD', 'CE'], competencias_especificas: [] },
  { componente: 'DCF',                slug: 'descuento-flujos',    title: 'Descuento de flujos (DCF)',             familia: 'inversion-finanzas',  orden: 2, tipo: 'calculadora', descripcion: 'Valora un proyecto descontando sus flujos de caja futuros.', competencias_clave: ['STEM', 'CD', 'CE'], competencias_especificas: [] },
  { componente: 'InteresCompuesto',   slug: 'interes-compuesto',   title: 'Interés compuesto',                     familia: 'inversion-finanzas',  orden: 3, tipo: 'calculadora', descripcion: 'Crecimiento de un capital con interés compuesto y aportaciones.', competencias_clave: ['STEM', 'CD', 'CE'], competencias_especificas: [] },
  // Finanzas personales
  { componente: 'NominaESO',          slug: 'nomina',              title: 'Calculadora de nómina',                 familia: 'finanzas-personales', orden: 1, tipo: 'calculadora', descripcion: 'Del salario bruto al neto: cotizaciones y retención de IRPF.', competencias_clave: ['STEM', 'CPSAA', 'CD'], competencias_especificas: [] },
  { componente: 'IRPFDeclaracion',    slug: 'irpf',                title: 'Declaración de IRPF',                   familia: 'finanzas-personales', orden: 2, tipo: 'calculadora', descripcion: 'Simula una declaración de la renta sencilla paso a paso.', competencias_clave: ['STEM', 'CPSAA', 'CD'], competencias_especificas: [] },
  { componente: 'PresupuestoUni',     slug: 'presupuesto-universidad', title: 'Presupuesto para la universidad',   familia: 'finanzas-personales', orden: 3, tipo: 'calculadora', descripcion: 'Estima el coste de estudiar fuera y cómo financiarlo.', competencias_clave: ['STEM', 'CPSAA', 'CD'], competencias_especificas: [] },
  { componente: 'Presupuesto503020',  slug: 'presupuesto-50-30-20',title: 'Presupuesto 50/30/20',                  familia: 'finanzas-personales', orden: 4, tipo: 'calculadora', descripcion: 'Reparte unos ingresos entre necesidades, deseos y ahorro.', competencias_clave: ['STEM', 'CPSAA', 'CD'], competencias_especificas: [] },
  { componente: 'CocheVsAlternativa', slug: 'coche-vs-alternativa',title: '¿Coche propio o alternativas?',         familia: 'finanzas-personales', orden: 5, tipo: 'calculadora', descripcion: 'Compara el coste real del coche frente a otras opciones de movilidad.', competencias_clave: ['STEM', 'CPSAA', 'CD'], competencias_especificas: [] },
  // Orientación y FP
  { componente: 'RIASEC',             slug: 'test-riasec',         title: 'Test de intereses RIASEC',              familia: 'orientacion-fp',      orden: 1, tipo: 'test',        descripcion: 'Identifica perfiles de interés profesional (modelo RIASEC).', competencias_clave: ['CPSAA', 'CE'], competencias_especificas: [] },
  { componente: 'GeneradorCVEuropass',slug: 'cv-europass',         title: 'Generador de CV Europass',              familia: 'orientacion-fp',      orden: 2, tipo: 'generador',   descripcion: 'Rellena y descarga un currículum en formato Europass.', competencias_clave: ['CPSAA', 'CE'], competencias_especificas: [] },
  { componente: 'BuscadorItinerarios',slug: 'itinerarios',         title: 'Buscador de itinerarios formativos',    familia: 'orientacion-fp',      orden: 3, tipo: 'buscador',    descripcion: 'Explora qué estudiar después según tus intereses y nivel.', competencias_clave: ['CPSAA', 'CE'], competencias_especificas: [] },
];

const BY_SLUG = new Map(HERRAMIENTAS.map((h) => [`${h.familia}/${h.slug}`, h]));

export function herramientaPorSlug(familia: string, slug: string): Herramienta | undefined {
  return BY_SLUG.get(`${familia}/${slug}`);
}

/** Group the registry by family (FAMILIAS_HERRAMIENTA order), exposing the tool on `.h`. */
export function gruposHerramientas() {
  const items = HERRAMIENTAS.map((h) => ({
    slug: h.slug,
    data: { familia: h.familia, orden: h.orden, title: h.title, unidades_relacionadas: [] as { asignatura: string; unidad: number }[] },
    h,
  }));
  return groupByFamilia(FAMILIAS_HERRAMIENTA, items);
}

/** Derive, per componente, the {asignatura, unidad} pairs from the recursos that embed it. */
export function unidadesPorComponente(
  recursos: { data: { componente?: string; asignatura: string; unidad_relacionada?: number } }[]
): Map<string, { asignatura: string; unidad: number }[]> {
  const map = new Map<string, { asignatura: string; unidad: number }[]>();
  for (const r of recursos) {
    const { componente, asignatura, unidad_relacionada } = r.data;
    if (!componente || unidad_relacionada === undefined) continue;
    const arr = map.get(componente) ?? [];
    if (!arr.some((u) => u.asignatura === asignatura && u.unidad === unidad_relacionada)) {
      arr.push({ asignatura, unidad: unidad_relacionada });
    }
    map.set(componente, arr);
  }
  return map;
}
```

- [ ] **Step 4: Run it to verify it passes**

Run: `npx vitest run src/lib/herramientas.test.ts`
Expected: PASS (all).

- [ ] **Step 5: Type-check**

Run: `npx astro check`
Expected: no new errors.

- [ ] **Step 6: Commit**

```bash
git add src/lib/herramientas.ts src/lib/herramientas.test.ts
git commit -m "feat(herramientas): tools registry, families and curriculum-map derivation"
```

---

## Task 3: Shared island dispatcher + recursos refactor

**Files:**
- Create: `src/components/calculadoras/HerramientaIsland.astro`
- Modify: `src/pages/[asignatura]/recursos/[slug].astro`

- [ ] **Step 1: Create `src/components/calculadoras/HerramientaIsland.astro`** — move the island imports + conditional dispatch here. (This is the exact block currently inline in `recursos/[slug].astro`.)

```astro
---
/**
 * Renders the interactive island that matches `componente`. Single source of the
 * island dispatch, shared by the per-asignatura recurso page and the transversal
 * «Herramientas» toolbox detail page. Add new identifiers here as components ship.
 */
import PuntoMuertoCalc from '@components/calculadoras/PuntoMuertoCalc.tsx';
import VANTIRCalc from '@components/calculadoras/VANTIRCalc.tsx';
import RatiosCalc from '@components/calculadoras/RatiosCalc.tsx';
import ADASSimulator from '@components/calculadoras/ADASSimulator.tsx';
import InteresCompuestoCalc from '@components/calculadoras/InteresCompuestoCalc.tsx';
import CalculadoraNominaESO from '@components/calculadoras/CalculadoraNominaESO.tsx';
import CalculadoraPresupuesto503020 from '@components/calculadoras/CalculadoraPresupuesto503020.tsx';
import BuscadorItinerarios from '@components/calculadoras/BuscadorItinerarios.tsx';
import GeneradorCVEuropass from '@components/calculadoras/GeneradorCVEuropass.tsx';
import DCFCalc from '@components/calculadoras/DCFCalc.tsx';
import RatiosBenchmark from '@components/calculadoras/RatiosBenchmark.tsx';
import ElasticidadCalc from '@components/calculadoras/ElasticidadCalc.tsx';
import MultiplicadorGasto from '@components/calculadoras/MultiplicadorGasto.tsx';
import IRPFDeclaracion from '@components/calculadoras/IRPFDeclaracion.tsx';
import CocheVsAlternativa from '@components/calculadoras/CocheVsAlternativa.tsx';
import RIASECTest from '@components/calculadoras/RIASECTest.tsx';
import PresupuestoUni from '@components/calculadoras/PresupuestoUni.tsx';

interface Props { componente?: string }
const { componente } = Astro.props;
---
{componente === 'PuntoMuerto' && <PuntoMuertoCalc client:load />}
{componente === 'VANTIR' && <VANTIRCalc client:load />}
{componente === 'Ratios' && <RatiosCalc client:load />}
{componente === 'ADASSimulator' && <ADASSimulator client:load />}
{componente === 'InteresCompuesto' && <InteresCompuestoCalc client:load />}
{componente === 'NominaESO' && <CalculadoraNominaESO client:load />}
{componente === 'Presupuesto503020' && <CalculadoraPresupuesto503020 client:load />}
{componente === 'BuscadorItinerarios' && <BuscadorItinerarios client:load />}
{componente === 'GeneradorCVEuropass' && <GeneradorCVEuropass client:load />}
{componente === 'DCF' && <DCFCalc client:load />}
{componente === 'RatiosBenchmark' && <RatiosBenchmark client:load />}
{componente === 'Elasticidad' && <ElasticidadCalc client:load />}
{componente === 'MultiplicadorGasto' && <MultiplicadorGasto client:load />}
{componente === 'IRPFDeclaracion' && <IRPFDeclaracion client:load />}
{componente === 'CocheVsAlternativa' && <CocheVsAlternativa client:load />}
{componente === 'RIASEC' && <RIASECTest client:load />}
{componente === 'PresupuestoUni' && <PresupuestoUni client:load />}
```

- [ ] **Step 2: Refactor `src/pages/[asignatura]/recursos/[slug].astro`**:
  1. Remove the 17 island `import` lines (currently lines ~5–21).
  2. Add `import HerramientaIsland from '@components/calculadoras/HerramientaIsland.astro';`.
  3. Replace the whole conditional-render block inside `<div class="container container--narrow"> … </div>` (the 17 `{recurso.data.componente === '...' && <... client:load />}` lines) with a single line:
     `<HerramientaIsland componente={recurso.data.componente} />`
  Leave everything else (frontmatter logic, layout, styles) untouched.

- [ ] **Step 3: Type-check + targeted build sanity**

Run: `npx astro check`
Expected: no new errors. (The recurso page still type-checks; `recurso.data.componente` is `string | undefined`, matching the prop.)

- [ ] **Step 4: Verify a recurso page still renders its island (dev smoke)** — OPTIONAL but recommended.

Run: `npx astro dev`, open a known calculator recurso (e.g. a page using `componente: 'PuntoMuerto'`), confirm the calculator still loads. Stop dev.

- [ ] **Step 5: Commit**

```bash
git add src/components/calculadoras/HerramientaIsland.astro "src/pages/[asignatura]/recursos/[slug].astro"
git commit -m "refactor(calculadoras): extract HerramientaIsland dispatcher, reuse in recursos"
```

---

## Task 4: Toolbox hub page

**Files:**
- Overwrite: `src/pages/herramientas/index.astro`

- [ ] **Step 1: Overwrite `src/pages/herramientas/index.astro`** with the new hub (the old generators content already lives in `src/pages/generadores/index.astro` from Task 1):

```astro
---
/**
 * Herramientas hub. The toolbox: existing calculator/simulator islands grouped
 * by family (FAMILIAS_HERRAMIENTA order), each card linking to its detail page.
 */
import BaseLayout from '@layouts/BaseLayout.astro';
import { gruposHerramientas, FAMILIAS_HERRAMIENTA } from '@/lib/herramientas';

const groups = gruposHerramientas();
const activeFamilias = new Set(groups.map((g) => g.familia.slug));
const TIPO_LABEL: Record<string, string> = {
  calculadora: 'Calculadora', simulador: 'Simulador', test: 'Test',
  generador: 'Generador', buscador: 'Buscador', plantilla: 'Plantilla',
};
---

<BaseLayout
  title="Herramientas"
  description="Calculadoras y simuladores para usar en clase: punto muerto, ratios, VAN/TIR, elasticidad, nómina, IRPF y más, con su encaje curricular."
>
  <div class="container">
    <nav class="breadcrumb"><a href="/">Inicio</a> <span class="sep">›</span> <span>Herramientas</span></nav>
  </div>

  <section class="hero">
    <div class="container">
      <span class="kicker">Material transversal</span>
      <h1><span class="serif-italic-wonk accent">Herramientas</span> para usar en clase.</h1>
      <p class="lede">
        La caja de herramientas del web: calculadoras y simuladores interactivos
        —punto muerto, ratios, VAN y TIR, elasticidad, nómina…— agrupados por tema
        y con el mapa de en qué unidades de qué asignaturas encajan.
      </p>
    </div>
  </section>

  <section class="filters">
    <div class="container">
      <button class="chip is-active" data-filter="all" type="button">Todas</button>
      {FAMILIAS_HERRAMIENTA.filter((f) => activeFamilias.has(f.slug)).map((f) => (
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
          {g.items.map(({ h }) => (
            <a class="card" href={`/herramientas/${h.familia}/${h.slug}/`} style={`--fam-color: var(${g.familia.colorVar})`}>
              <span class="card__eyebrow">{TIPO_LABEL[h.tipo] ?? h.tipo}</span>
              <h3 class="card__title serif">{h.title}</h3>
              <p class="card__desc">{h.descripcion}</p>
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
</style>
```

- [ ] **Step 2: Type-check**

Run: `npx astro check`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/herramientas/index.astro
git commit -m "feat(herramientas): toolbox hub grouped by family"
```

---

## Task 5: Toolbox detail page

**Files:**
- Create: `src/pages/herramientas/[familia]/[slug].astro`

- [ ] **Step 1: Create `src/pages/herramientas/[familia]/[slug].astro`**

```astro
---
/**
 * A single tool. Routed by `[familia]/[slug]` (two single-segment params). Renders
 * the interactive island (via HerramientaIsland), the curriculum map (units derived
 * from the recursos that embed this componente) and the competences.
 */
import BaseLayout from '@layouts/BaseLayout.astro';
import HerramientaIsland from '@components/calculadoras/HerramientaIsland.astro';
import PuenteUnidades from '@components/emprendimiento/PuenteUnidades.astro';
import { HERRAMIENTAS, herramientaPorSlug, unidadesPorComponente, FAMILIAS_HERRAMIENTA } from '@/lib/herramientas';
import { getCollection } from 'astro:content';
import type { GetStaticPaths } from 'astro';

export const getStaticPaths = (async () => {
  return HERRAMIENTAS.map((h) => ({
    params: { familia: h.familia, slug: h.slug },
    props: { componente: h.componente, familia: h.familia, slug: h.slug },
  }));
}) satisfies GetStaticPaths;

const { componente, familia, slug } = Astro.props;
const h = herramientaPorSlug(familia, slug)!;
const famMeta = FAMILIAS_HERRAMIENTA.find((f) => f.slug === familia)!;
const TIPO_LABEL: Record<string, string> = {
  calculadora: 'Calculadora', simulador: 'Simulador', test: 'Test',
  generador: 'Generador', buscador: 'Buscador', plantilla: 'Plantilla',
};

const recursos = await getCollection('recursos');
const unidades = unidadesPorComponente(recursos.filter((r) => r.data.estado === 'publicado'))
  .get(componente) ?? [];
---

<BaseLayout title={`${h.title} — Herramientas`} description={h.descripcion}>
  <div class="container">
    <nav class="breadcrumb">
      <a href="/">Inicio</a> <span class="sep">›</span>
      <a href="/herramientas/">Herramientas</a> <span class="sep">›</span>
      <span>{h.title}</span>
    </nav>
  </div>

  <section class="body">
    <div class="container container--narrow">
      <span class="kicker" style={`color: var(${famMeta.colorVar})`}>{famMeta.label} · {TIPO_LABEL[h.tipo] ?? h.tipo}</span>
      <h1>{h.title}</h1>
      <p class="lede">{h.descripcion}</p>
    </div>
  </section>

  <section class="player-wrap">
    <div class="container container--narrow">
      <HerramientaIsland componente={componente} />
    </div>
  </section>

  <section class="body">
    <div class="container container--narrow">
      <PuenteUnidades unidades={unidades} />

      {h.competencias_clave.length > 0 && (
        <section class="block">
          <h2>Competencias que se trabajan</h2>
          <p><strong>Clave:</strong> {h.competencias_clave.join(' · ')}</p>
          {h.competencias_especificas.length > 0 && (
            <p><strong>Específicas:</strong> {h.competencias_especificas.join(' · ')}</p>
          )}
        </section>
      )}

      <nav class="back"><a href="/herramientas/">← Todas las herramientas</a></nav>
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
  .body { padding: 1rem 0; }
  .kicker { font-family: var(--font-sans); font-size: 0.8rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; }
  h1 { margin: 0.6rem 0 0.4rem; max-width: 24ch; }
  .lede { font-size: 1.2rem; color: var(--color-ink-soft); line-height: 1.5; margin: 0 0 0.5rem; }
  .player-wrap { padding: clamp(1rem, 3vw, 2rem) 0 clamp(1.5rem, 4vw, 2.5rem); }
  .block { margin: 1.6rem 0; }
  .block h2 { font-family: var(--font-serif); font-size: 1.4rem; font-weight: 500; margin: 0 0 0.5rem; }
  .back { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--color-line); font-family: var(--font-sans); }
  .back a { color: var(--color-terra); text-decoration: none; font-weight: 500; }
  .back a:hover { text-decoration: underline; }
</style>
```

- [ ] **Step 2: Type-check**

Run: `npx astro check`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add "src/pages/herramientas/[familia]/[slug].astro"
git commit -m "feat(herramientas): tool detail page with island and derived curriculum map"
```

---

## Task 6: Full build verification + PR

- [ ] **Step 1: Run the test suite**

Run: `npx vitest run src/lib/herramientas.test.ts src/lib/asignaturas.test.ts`
Expected: all pass.

- [ ] **Step 2: FULL BUILD — the real verification**

Run: `npx astro build`
Expected: ends with `Complete!`, exit 0. Routes `/herramientas/`, `/generadores/`, and the 17 `/herramientas/{familia}/{slug}/` pages prerender with NO ENOENT. If a build error appears (e.g. an island import path), read it and fix minimally. Re-run until green.

- [ ] **Step 3: Dev smoke (recommended)**

Run: `npx astro dev`. Check: `/herramientas/` hub shows 5 families + cards; one detail page (e.g. `/herramientas/costes-resultados/punto-muerto/`) loads the calculator island and shows «Esto se trabaja en…» links; `/generadores/` shows the two generators; the «Otros» menu lists both Herramientas and Generadores. Stop dev.

- [ ] **Step 4: Push and open PR to `dev`**

```bash
git push -u origin feat/seccion-herramientas
gh pr create --base dev --head feat/seccion-herramientas \
  --title "feat(herramientas): caja de herramientas transversal (reuso de 17 calculadoras)" \
  --body "Nueva sección /herramientas/ que agrupa las 17 calculadoras/simuladores existentes por familia temática con tag de tipo y mapa curricular derivado de los recursos. Renombra la sección anterior a «Generadores» (/generadores/). Extrae HerramientaIsland (dispatch compartido con recursos). Spec: docs/superpowers/specs/2026-06-03-herramientas-design.md"
```

- [ ] **Step 5: Wait for the Vercel check to go green**, then merge per Pau's call.

---

## Self-review notes (for the implementer)

- **The recursos refactor (Task 3) must stay behaviour-identical.** Same `componente` string → same island → `client:load`. Verify a real recurso page still renders its calculator.
- **`/herramientas/` content changes meaning** between Task 1 and Task 4: Task 1 leaves the old generators page there; Task 4 overwrites it with the hub. The generators live at `/generadores/` from Task 1 on. Don't delete `herramientas/index.astro` in Task 1 — overwrite it in Task 4.
- **Curriculum map is derived, not authored.** A tool with no recurso using its `componente` will show no unit links — that's acceptable.
- **No new colors.** Every `colorVar` reuses an existing `--color-*` token.
- **Two-param route `[familia]/[slug]`** — no catch-all. No stray `.ts` under `src/pages/herramientas/`.
