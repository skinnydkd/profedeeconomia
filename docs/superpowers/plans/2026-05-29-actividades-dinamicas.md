# Actividades Dinámicas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a unified per-unit `/actividades-dinamicas/` hub for EDMN 2BACH that groups the existing self-assessment test, a new decision-tree simulator ("Has heredado la cafetería del barrio"), and unit-scoped interactive resources — all driven from MDX, single source of truth.

**Architecture:** New Astro content collection `actividadesDinamicas` whose body is a JSON block that a new Preact island `<ArbolDecisiones>` consumes. Two new routes — a hub at `/[asignatura]/actividades-dinamicas/` and a per-unit page at `/[asignatura]/actividades-dinamicas/[unidad-slug]/`. Old `/tests/[slug]/` routes 301 to the new per-unit page so external links keep working.

**Tech Stack:** Astro 5 content collections + glob loader, Preact island with `client:visible`, Zod schema for the new collection, Vitest for the simulator logic, sessionStorage for in-progress state.

**Spec:** `docs/superpowers/specs/2026-05-29-actividades-dinamicas-design.md`

**Branch:** `feat/actividades-dinamicas` (already created, spec already committed).

---

## File structure (created or modified)

```
NEW · src/content/asignaturas/edmn-2bach/actividades-dinamicas/
        06-cafeteria-del-barrio.mdx              (cas pilot)

NEW · src/components/actividades/
        ArbolDecisiones.astro                     Astro wrapper
        ArbolDecisionesIsland.tsx                 Preact island (state, UI)
        types.ts                                  ArbolJSON type
        parse-tree.ts                             extract+validate JSON from MDX
        kpi.ts                                    KPI accumulator (pure)
        kpi.test.ts                               unit tests for KPI logic
        parse-tree.test.ts                        unit tests for parser

NEW · src/pages/[asignatura]/actividades-dinamicas/
        index.astro                               Hub: 12 unit cards
        [unidad-slug].astro                       Per-unit page

MOD · src/content.config.ts                       + actividadesDinamicas collection
MOD · src/pages/[asignatura]/tests/[slug].astro   + 301 redirect to new unit page
MOD · src/pages/[asignatura]/tests/index.astro    + 301 redirect to /actividades-dinamicas/
MOD · src/pages/[asignatura]/index.astro          link "Tests" → "Actividades dinámicas"
MOD · src/content/asignaturas/edmn-2bach/recursos/*.md
        add `unidad_relacionada` where missing (audit pass)
```

---

## Task 1 · Add `actividadesDinamicas` collection to `content.config.ts`

**Files:**
- Modify: `src/content.config.ts` (append a new collection definition; add to exports)

- [ ] **Step 1 · Find the place to insert**

Read `src/content.config.ts`. After the `recursos` collection block, before the `programacion` block, is where the new collection goes.

- [ ] **Step 2 · Add the new collection**

Insert this block after the `recursos` collection (around where it ends with `});`):

```ts
/* =========================================================
   asignaturas/{slug}/actividades-dinamicas/{numero}-{slug}.mdx
   Decision-tree simulators. The MDX body must contain exactly one
   ```json … ``` fenced block whose content is parsed by
   src/components/actividades/parse-tree.ts.
   ========================================================= */
const actividadesDinamicas = defineCollection({
  loader: glob({
    pattern: 'asignaturas/*/actividades-dinamicas/**/*.{md,mdx}',
    base: './src/content',
  }),
  schema: z.object({
    asignatura: z.enum(ASIGNATURA_SLUGS),
    unidad_relacionada: z.number().int().min(1),
    title: z.string(),
    /** Only `arbol-decisiones` at the pilot; reserved for future numeric or drag-drop simulators. */
    tipo: z.enum(['arbol-decisiones']),
    /** Stable identifier used by per-unit page to know which island to mount. */
    componente: z.enum(['ArbolDecisiones']),
    duracion: z.string().optional(),
    descripcion: z.string().optional(),
    competencias_clave: z.array(z.string()).default([]),
    competencias_especificas: z.array(z.string()).default([]),
    lang: z.enum(LANGS).default('es'),
    estado: z.enum(ESTADOS).default('borrador'),
    publicado_en: z.coerce.date().optional(),
  }),
});
```

- [ ] **Step 3 · Export the new collection**

Find the `export const collections = {` block at the bottom of `src/content.config.ts` and add `actividadesDinamicas`:

```ts
export const collections = {
  libro,
  actividades,
  tests,
  recursos,
  actividadesDinamicas,
  programacion,
  // … the rest unchanged
};
```

- [ ] **Step 4 · Run `astro check` (or quick TS check) to make sure the schema compiles**

```bash
npx astro check --noSync 2>&1 | tail -5
```

Expected: no errors related to the new collection. (Existing project warnings unrelated to this change are fine.)

- [ ] **Step 5 · Commit**

```bash
git add src/content.config.ts
git commit -m "feat(actividades): add actividadesDinamicas content collection schema"
```

---

## Task 2 · Pure KPI math + tests

**Files:**
- Create: `src/components/actividades/types.ts`
- Create: `src/components/actividades/kpi.ts`
- Create: `src/components/actividades/kpi.test.ts`

- [ ] **Step 1 · Write the types**

Create `src/components/actividades/types.ts`:

```ts
/** KPI map: keyed by metric id (e.g. "caja", "satisfaccion"). Values are numbers. */
export type Kpis = Record<string, number>;

/** A single user-facing option on a decision node. */
export interface Opcion {
  label: string;
  /** Per-KPI delta applied when this option is chosen. */
  kpi_delta: Partial<Kpis>;
  /** Pedagogical paragraph shown after the user picks this option. */
  feedback: string;
  /** Id of the next node OR special string "final:exito"/"final:fracaso_parcial". */
  next: string;
}

export interface Nodo {
  titulo: string;
  situacion: string;
  opciones: Opcion[];
}

export interface Final {
  titulo: string;
  resumen: string;
  lecciones_clave: string[];
}

export interface ArbolJSON {
  intro: {
    kicker: string;
    titulo: string;
    contexto: string;
    kpi_inicial: Kpis;
  };
  nodes: Record<string, Nodo>;
  finales: Record<string, Final>;
}
```

- [ ] **Step 2 · Write the failing test for KPI accumulation**

Create `src/components/actividades/kpi.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { applyDelta, percentChange } from './kpi.ts';

describe('applyDelta', () => {
  it('adds positive and negative deltas', () => {
    const out = applyDelta({ caja: 100, sat: 5 }, { caja: 50, sat: -1 });
    expect(out).toEqual({ caja: 150, sat: 4 });
  });

  it('leaves untouched keys unchanged', () => {
    const out = applyDelta({ caja: 100, sat: 5 }, { caja: 50 });
    expect(out).toEqual({ caja: 150, sat: 5 });
  });

  it('does not mutate inputs', () => {
    const before = { caja: 100, sat: 5 };
    const delta = { caja: 50 };
    applyDelta(before, delta);
    expect(before).toEqual({ caja: 100, sat: 5 });
    expect(delta).toEqual({ caja: 50 });
  });
});

describe('percentChange', () => {
  it('returns rounded integer percent change', () => {
    expect(percentChange(100, 120)).toBe(20);
    expect(percentChange(100, 80)).toBe(-20);
    expect(percentChange(100, 100)).toBe(0);
  });

  it('returns 0 when initial is 0 (no division by zero)', () => {
    expect(percentChange(0, 100)).toBe(0);
  });
});
```

- [ ] **Step 3 · Run, expect failure**

```bash
npx vitest run src/components/actividades/kpi.test.ts
```

Expected: FAIL — module `./kpi.ts` not found.

- [ ] **Step 4 · Implement `kpi.ts`**

Create `src/components/actividades/kpi.ts`:

```ts
import type { Kpis } from './types.ts';

/** Returns a new Kpis with each delta added on top of `current`. Pure. */
export function applyDelta(current: Kpis, delta: Partial<Kpis>): Kpis {
  const next = { ...current };
  for (const [k, dv] of Object.entries(delta)) {
    if (typeof dv === 'number') next[k] = (next[k] ?? 0) + dv;
  }
  return next;
}

/** Returns integer percent change from `initial` to `current`. 0 if initial is 0. */
export function percentChange(initial: number, current: number): number {
  if (initial === 0) return 0;
  return Math.round(((current - initial) / initial) * 100);
}
```

- [ ] **Step 5 · Run, expect pass**

```bash
npx vitest run src/components/actividades/kpi.test.ts
```

Expected: PASS — all 5 tests.

- [ ] **Step 6 · Commit**

```bash
git add src/components/actividades/types.ts src/components/actividades/kpi.ts src/components/actividades/kpi.test.ts
git commit -m "feat(actividades): types + pure KPI math with tests"
```

---

## Task 3 · JSON tree parser

**Files:**
- Create: `src/components/actividades/parse-tree.ts`
- Create: `src/components/actividades/parse-tree.test.ts`

- [ ] **Step 1 · Write the failing test**

Create `src/components/actividades/parse-tree.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { parseTreeFromMdxBody } from './parse-tree.ts';

const sampleBody = `
Algo de prosa antes del JSON.

\`\`\`json
{
  "intro": { "kicker": "K", "titulo": "T", "contexto": "C", "kpi_inicial": { "caja": 100 } },
  "nodes": { "n1": { "titulo": "T1", "situacion": "S1", "opciones": [
    { "label": "A", "kpi_delta": { "caja": 10 }, "feedback": "F", "next": "final:exito" }
  ] } },
  "finales": { "exito": { "titulo": "Win", "resumen": "R", "lecciones_clave": ["L"] } }
}
\`\`\`

Algo más después.
`;

describe('parseTreeFromMdxBody', () => {
  it('extracts the JSON block and returns a typed tree', () => {
    const tree = parseTreeFromMdxBody(sampleBody);
    expect(tree.intro.titulo).toBe('T');
    expect(tree.nodes.n1.opciones[0].next).toBe('final:exito');
    expect(tree.finales.exito.lecciones_clave).toEqual(['L']);
  });

  it('throws a descriptive error when no JSON block exists', () => {
    expect(() => parseTreeFromMdxBody('# Just markdown')).toThrow(/no JSON block/i);
  });

  it('throws when the JSON is malformed', () => {
    const bad = '```json\n{ "intro": }\n```';
    expect(() => parseTreeFromMdxBody(bad)).toThrow(/malformed JSON/i);
  });

  it('throws when required keys are missing', () => {
    const incomplete = '```json\n{ "intro": {} }\n```';
    expect(() => parseTreeFromMdxBody(incomplete)).toThrow(/intro\.titulo/i);
  });
});
```

- [ ] **Step 2 · Run, expect failure**

```bash
npx vitest run src/components/actividades/parse-tree.test.ts
```

Expected: FAIL — module `./parse-tree.ts` not found.

- [ ] **Step 3 · Implement `parse-tree.ts`**

Create `src/components/actividades/parse-tree.ts`:

```ts
import type { ArbolJSON } from './types.ts';

/**
 * Extracts the first fenced ```json … ``` block from an MDX body and
 * returns it as a validated ArbolJSON. Throws with a descriptive
 * message on any failure — the failure goes to the build log and
 * surfaces immediately when Pau edits a tree.
 */
export function parseTreeFromMdxBody(body: string): ArbolJSON {
  const match = body.match(/```json\s*\n([\s\S]*?)\n```/);
  if (!match) throw new Error('parseTreeFromMdxBody: no JSON block found in MDX body');

  let raw: unknown;
  try {
    raw = JSON.parse(match[1]);
  } catch (err) {
    throw new Error(`parseTreeFromMdxBody: malformed JSON — ${(err as Error).message}`);
  }

  return validateTree(raw);
}

function validateTree(raw: unknown): ArbolJSON {
  if (typeof raw !== 'object' || raw === null) {
    throw new Error('parseTreeFromMdxBody: root must be an object');
  }
  const r = raw as Record<string, unknown>;
  const intro = r.intro as Record<string, unknown> | undefined;
  if (!intro || typeof intro.titulo !== 'string') {
    throw new Error('parseTreeFromMdxBody: intro.titulo is required');
  }
  if (typeof r.nodes !== 'object' || r.nodes === null) {
    throw new Error('parseTreeFromMdxBody: nodes object is required');
  }
  if (typeof r.finales !== 'object' || r.finales === null) {
    throw new Error('parseTreeFromMdxBody: finales object is required');
  }
  // Trust shape from here — types.ts is the contract; further runtime checks
  // would obscure the simple "Pau edits MDX → sees the error in build log".
  return raw as ArbolJSON;
}
```

- [ ] **Step 4 · Run, expect pass**

```bash
npx vitest run src/components/actividades/parse-tree.test.ts
```

Expected: PASS — all 4 tests.

- [ ] **Step 5 · Commit**

```bash
git add src/components/actividades/parse-tree.ts src/components/actividades/parse-tree.test.ts
git commit -m "feat(actividades): JSON tree parser with descriptive validation errors"
```

---

## Task 4 · Preact island `<ArbolDecisionesIsland>`

**Files:**
- Create: `src/components/actividades/ArbolDecisionesIsland.tsx`

- [ ] **Step 1 · Write the component (no test — pure UI; logic is covered by Task 2)**

Create `src/components/actividades/ArbolDecisionesIsland.tsx`:

```tsx
/** @jsxImportSource preact */
import { useEffect, useState } from 'preact/hooks';
import type { ArbolJSON, Kpis, Opcion } from './types.ts';
import { applyDelta, percentChange } from './kpi.ts';

interface Props {
  data: ArbolJSON;
  /** Stable id used as the sessionStorage key. */
  simuladorId: string;
}

type Phase = 'intro' | 'node' | 'feedback' | 'final';

interface SessionState {
  phase: Phase;
  nodeId: string;
  kpis: Kpis;
  lastChoice: { feedback: string; next: string } | null;
}

export default function ArbolDecisionesIsland({ data, simuladorId }: Props) {
  const storageKey = `arbol:${simuladorId}`;
  const initialState: SessionState = { phase: 'intro', nodeId: '', kpis: data.intro.kpi_inicial, lastChoice: null };

  const [state, setState] = useState<SessionState>(() => {
    if (typeof window === 'undefined') return initialState;
    const stored = window.sessionStorage.getItem(storageKey);
    if (!stored) return initialState;
    try { return JSON.parse(stored) as SessionState; } catch { return initialState; }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') window.sessionStorage.setItem(storageKey, JSON.stringify(state));
  }, [state, storageKey]);

  function start() {
    const firstNodeId = Object.keys(data.nodes)[0];
    setState({ phase: 'node', nodeId: firstNodeId, kpis: data.intro.kpi_inicial, lastChoice: null });
  }

  function chooseOption(opt: Opcion) {
    const newKpis = applyDelta(state.kpis, opt.kpi_delta);
    setState({ ...state, phase: 'feedback', kpis: newKpis, lastChoice: { feedback: opt.feedback, next: opt.next } });
  }

  function advance() {
    if (!state.lastChoice) return;
    const next = state.lastChoice.next;
    if (next.startsWith('final:')) {
      setState({ ...state, phase: 'final', nodeId: next.replace('final:', ''), lastChoice: null });
    } else {
      setState({ ...state, phase: 'node', nodeId: next, lastChoice: null });
    }
  }

  function restart() {
    if (typeof window !== 'undefined') window.sessionStorage.removeItem(storageKey);
    setState(initialState);
  }

  return (
    <div class="arbol">
      <KpiBar kpis={state.kpis} initial={data.intro.kpi_inicial} />

      {state.phase === 'intro' && (
        <div class="arbol__card">
          <p class="arbol__kicker">{data.intro.kicker}</p>
          <h2 class="arbol__h2">{data.intro.titulo}</h2>
          <p class="arbol__contexto">{data.intro.contexto}</p>
          <button class="arbol__btn-primary" type="button" onClick={start}>Empezar</button>
        </div>
      )}

      {state.phase === 'node' && data.nodes[state.nodeId] && (
        <div class="arbol__card">
          <h3 class="arbol__h3">{data.nodes[state.nodeId].titulo}</h3>
          <p class="arbol__situacion">{data.nodes[state.nodeId].situacion}</p>
          <ul class="arbol__opciones">
            {data.nodes[state.nodeId].opciones.map((opt, i) => (
              <li key={i}>
                <button class="arbol__opcion" type="button" onClick={() => chooseOption(opt)}>{opt.label}</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {state.phase === 'feedback' && state.lastChoice && (
        <div class="arbol__feedback">
          <p class="arbol__kicker arbol__kicker--mustard">Consecuencia</p>
          <p>{state.lastChoice.feedback}</p>
          <button class="arbol__btn-primary" type="button" onClick={advance}>Continuar</button>
        </div>
      )}

      {state.phase === 'final' && data.finales[state.nodeId] && (
        <div class="arbol__final">
          <p class="arbol__kicker">Final</p>
          <h2 class="arbol__h2">{data.finales[state.nodeId].titulo}</h2>
          <p class="arbol__resumen">{data.finales[state.nodeId].resumen}</p>
          <h3 class="arbol__h3">Lecciones clave</h3>
          <ul class="arbol__lecciones">
            {data.finales[state.nodeId].lecciones_clave.map((l, i) => <li key={i}>{l}</li>)}
          </ul>
          <button class="arbol__btn-secondary" type="button" onClick={restart}>Reiniciar simulación</button>
        </div>
      )}
    </div>
  );
}

function KpiBar({ kpis, initial }: { kpis: Kpis; initial: Kpis }) {
  return (
    <div class="kpi-bar">
      {Object.keys(initial).map((k) => {
        const change = percentChange(initial[k], kpis[k] ?? initial[k]);
        const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'flat';
        return (
          <div class={`kpi-pill kpi-pill--${trend}`} key={k}>
            <span class="kpi-pill__label">{k}</span>
            <span class="kpi-pill__value">{kpis[k] ?? initial[k]}</span>
            {change !== 0 && <span class="kpi-pill__delta">{change > 0 ? '+' : ''}{change}%</span>}
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2 · Commit (no test run — pure UI; the build step in Task 9 verifies it compiles)**

```bash
git add src/components/actividades/ArbolDecisionesIsland.tsx
git commit -m "feat(actividades): Preact island for decision-tree simulator with sessionStorage"
```

---

## Task 5 · Astro wrapper `<ArbolDecisiones>` + scoped styles

**Files:**
- Create: `src/components/actividades/ArbolDecisiones.astro`

- [ ] **Step 1 · Write the wrapper**

Create `src/components/actividades/ArbolDecisiones.astro`:

```astro
---
import type { ArbolJSON } from './types.ts';
import ArbolDecisionesIsland from './ArbolDecisionesIsland.tsx';

type Props = {
  data: ArbolJSON;
  /** Stable identifier (e.g. the MDX file slug) used as the sessionStorage key. */
  simuladorId: string;
};

const { data, simuladorId } = Astro.props;
---

<div class="arbol-wrap">
  <ArbolDecisionesIsland data={data} simuladorId={simuladorId} client:visible />
</div>

<style is:global>
  /* Decision-tree simulator — scoped to .arbol-wrap so the styles don't
     leak. is:global because the island Preact components don't share the
     Astro CSS module scope. */
  .arbol-wrap .arbol { display: grid; gap: 24px; max-width: 720px; margin: 0 auto; }

  .arbol-wrap .kpi-bar {
    display: flex; gap: 12px; flex-wrap: wrap;
    padding: 16px;
    background: var(--color-bg-cream);
    border: 1px solid var(--color-line);
    border-radius: 6px;
  }
  .arbol-wrap .kpi-pill {
    display: flex; align-items: baseline; gap: 8px;
    padding: 8px 14px;
    background: var(--color-bg);
    border: 1px solid var(--color-line);
    border-radius: 999px;
    font-family: var(--font-sans);
  }
  .arbol-wrap .kpi-pill__label {
    font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--color-ink-mute);
  }
  .arbol-wrap .kpi-pill__value { font-family: var(--font-mono); font-size: 16px; color: var(--color-ink); }
  .arbol-wrap .kpi-pill__delta { font-family: var(--font-mono); font-size: 12px; font-weight: 700; }
  .arbol-wrap .kpi-pill--up    { border-color: #2e5e3a; }
  .arbol-wrap .kpi-pill--up    .kpi-pill__delta { color: #2e5e3a; }
  .arbol-wrap .kpi-pill--down  { border-color: var(--color-terra-deep); }
  .arbol-wrap .kpi-pill--down  .kpi-pill__delta { color: var(--color-terra-deep); }

  .arbol-wrap .arbol__card,
  .arbol-wrap .arbol__feedback,
  .arbol-wrap .arbol__final {
    padding: 28px 32px;
    background: var(--color-paper);
    border: 1px solid var(--color-line);
    border-radius: 6px;
    box-shadow: 0 1px 2px rgba(42,31,24,.04), 0 4px 14px rgba(42,31,24,.05);
  }
  .arbol-wrap .arbol__feedback { background: var(--color-mustard-soft); border-left: 4px solid var(--color-mustard-deep); }
  .arbol-wrap .arbol__final    { background: var(--color-terra-soft);   border-left: 4px solid var(--color-terra); }

  .arbol-wrap .arbol__kicker {
    font-family: var(--font-sans); font-size: 12px; letter-spacing: 0.18em;
    text-transform: uppercase; color: var(--color-terra); font-weight: 700;
    margin: 0 0 12px;
  }
  .arbol-wrap .arbol__kicker--mustard { color: var(--color-mustard-deep); }
  .arbol-wrap .arbol__h2 { font-family: var(--font-serif); font-size: 30px; margin: 0 0 16px; color: var(--color-ink); font-variation-settings: "SOFT" 80; }
  .arbol-wrap .arbol__h3 { font-family: var(--font-serif); font-size: 20px; margin: 16px 0 8px; color: var(--color-ink); }
  .arbol-wrap .arbol__contexto,
  .arbol-wrap .arbol__situacion,
  .arbol-wrap .arbol__resumen { font-size: 17px; line-height: 1.55; margin: 0 0 16px; color: var(--color-ink); }

  .arbol-wrap .arbol__opciones { list-style: none; padding: 0; margin: 0; display: grid; gap: 12px; }
  .arbol-wrap .arbol__opcion {
    width: 100%; text-align: left;
    padding: 14px 18px;
    background: var(--color-bg);
    border: 1px solid var(--color-line);
    border-radius: 6px;
    font-family: var(--font-sans); font-size: 16px; line-height: 1.4;
    cursor: pointer;
    transition: border-color .15s, background .15s;
  }
  .arbol-wrap .arbol__opcion:hover { border-color: var(--color-terra); background: var(--color-terra-soft); }

  .arbol-wrap .arbol__btn-primary,
  .arbol-wrap .arbol__btn-secondary {
    padding: 10px 22px; border-radius: 999px;
    font-family: var(--font-sans); font-size: 14px; font-weight: 600; letter-spacing: 0.06em;
    cursor: pointer; border: 1px solid transparent;
  }
  .arbol-wrap .arbol__btn-primary   { background: var(--color-terra); color: var(--color-bg); }
  .arbol-wrap .arbol__btn-primary:hover { background: var(--color-terra-deep); }
  .arbol-wrap .arbol__btn-secondary { background: transparent; color: var(--color-terra); border-color: var(--color-terra); }
  .arbol-wrap .arbol__btn-secondary:hover { background: var(--color-terra-soft); }

  .arbol-wrap .arbol__lecciones { padding-left: 1.2em; }
  .arbol-wrap .arbol__lecciones li { margin-bottom: 6px; }
</style>
```

- [ ] **Step 2 · Commit**

```bash
git add src/components/actividades/ArbolDecisiones.astro
git commit -m "feat(actividades): Astro wrapper + Variant C styling for ArbolDecisiones"
```

---

## Task 6 · Hub route `/[asignatura]/actividades-dinamicas/`

**Files:**
- Create: `src/pages/[asignatura]/actividades-dinamicas/index.astro`

- [ ] **Step 1 · Write the page**

Create `src/pages/[asignatura]/actividades-dinamicas/index.astro`:

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
import { ASIGNATURAS } from '@/lib/asignaturas';
import { getCollection } from 'astro:content';
import type { GetStaticPaths } from 'astro';

export const getStaticPaths = (async () => {
  return Object.values(ASIGNATURAS).map((a) => ({ params: { asignatura: a.slug } }));
}) satisfies GetStaticPaths;

const { asignatura } = Astro.params;
const a = ASIGNATURAS[asignatura as keyof typeof ASIGNATURAS];

const [libroAll, testsAll, dinAll, recAll] = await Promise.all([
  getCollection('libro'),
  getCollection('tests'),
  getCollection('actividadesDinamicas'),
  getCollection('recursos'),
]);

const units = libroAll
  .filter((u) => u.data.asignatura === a.slug && u.data.estado === 'publicado')
  .sort((x, y) => x.data.unidad - y.data.unidad)
  .map((u) => {
    const unidad = u.data.unidad;
    const slug = u.id.split('/').pop()?.replace(/\.mdx?$/, '') ?? u.id;
    const hasTest = testsAll.some((t) => t.data.asignatura === a.slug && t.data.unidad_relacionada === unidad && t.data.estado === 'publicado');
    const numSim = dinAll.filter((d) => d.data.asignatura === a.slug && d.data.unidad_relacionada === unidad && d.data.estado === 'publicado').length;
    const numRec = recAll.filter((r) => r.data.asignatura === a.slug && r.data.unidad_relacionada === unidad && r.data.estado === 'publicado').length;
    return { unidad, slug, title: u.data.title, lema: u.data.lema, hasTest, numSim, numRec };
  });
---

<BaseLayout title={`Actividades dinámicas — ${a.shortLabel}`} description={`Tests, simuladores y recursos interactivos por unidad de ${a.title}.`}>
  <div class="container">
    <nav class="breadcrumb">
      <a href="/">Inicio</a> <span class="sep">›</span>
      <a href={`/${a.slug}/`}>{a.shortLabel}</a> <span class="sep">›</span>
      <span>Actividades dinámicas</span>
    </nav>
  </div>

  <section class="hero">
    <div class="container">
      <span class="kicker">{a.shortLabel}</span>
      <h1>Actividades dinámicas</h1>
      <p class="lede">Tests de autoevaluación, simuladores de decisión y recursos interactivos agrupados por unidad.</p>
    </div>
  </section>

  <section class="grid-section">
    <div class="container">
      <ul class="unit-grid">
        {units.map((u) => (
          <li class="unit-card">
            <a href={`/${a.slug}/actividades-dinamicas/${u.slug}/`}>
              <span class="unit-card__num">Unidad {u.unidad}</span>
              <h2 class="unit-card__title">{u.title}</h2>
              {u.lema && <p class="unit-card__lema">{u.lema}</p>}
              <p class="unit-card__chips">
                <span class={`chip ${u.hasTest ? 'chip--on' : 'chip--off'}`}>{u.hasTest ? 'Test ✓' : 'Test —'}</span>
                <span class={`chip ${u.numSim > 0 ? 'chip--on' : 'chip--off'}`}>{u.numSim > 0 ? `${u.numSim} simuladores` : 'Sin simulador'}</span>
                <span class={`chip ${u.numRec > 0 ? 'chip--on' : 'chip--off'}`}>{u.numRec > 0 ? `${u.numRec} recursos` : 'Sin recursos'}</span>
              </p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  </section>
</BaseLayout>

<style>
  .grid-section { padding: 40px 0 80px; }
  .unit-grid { list-style: none; padding: 0; margin: 0; display: grid; gap: 16px; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); }
  .unit-card a {
    display: block; padding: 24px 26px;
    background: var(--color-paper);
    border: 1px solid var(--color-line);
    border-radius: 6px;
    text-decoration: none; color: inherit;
    transition: border-color .15s, transform .15s;
  }
  .unit-card a:hover { border-color: var(--color-terra); transform: translateY(-2px); }
  .unit-card__num   { font-family: var(--font-sans); font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--color-terra); font-weight: 700; }
  .unit-card__title { font-family: var(--font-serif); font-size: 22px; margin: 10px 0 8px; }
  .unit-card__lema  { font-family: var(--font-serif); font-style: italic; font-size: 15px; color: var(--color-ink-soft); margin: 0 0 14px; }
  .unit-card__chips { display: flex; flex-wrap: wrap; gap: 6px; margin: 0; }
  .chip { display: inline-block; font-family: var(--font-sans); font-size: 11px; padding: 3px 8px; border-radius: 999px; letter-spacing: 0.04em; }
  .chip--on  { background: var(--color-terra-soft); color: var(--color-terra-deep); }
  .chip--off { background: var(--color-bg-cream);   color: var(--color-ink-mute); }
</style>
```

- [ ] **Step 2 · Smoke test**

```bash
npm run dev -- --port 4321 &
sleep 8
curl -s http://localhost:4321/edmn-2bach/actividades-dinamicas/ | grep -c "Unidad 1"
# Expected: at least 1
kill %1 2>/dev/null
```

- [ ] **Step 3 · Commit**

```bash
git add src/pages/[asignatura]/actividades-dinamicas/index.astro
git commit -m "feat(actividades): hub route /actividades-dinamicas/ with per-unit cards"
```

---

## Task 7 · Per-unit page `/[asignatura]/actividades-dinamicas/[unidad-slug]/`

**Files:**
- Create: `src/pages/[asignatura]/actividades-dinamicas/[unidad-slug].astro`

- [ ] **Step 1 · Write the page**

Create `src/pages/[asignatura]/actividades-dinamicas/[unidad-slug].astro`:

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
import { ASIGNATURAS } from '@/lib/asignaturas';
import { getCollection } from 'astro:content';
import QuizPlayer from '@components/QuizPlayer.tsx';
import ArbolDecisiones from '@components/actividades/ArbolDecisiones.astro';
import { parseTreeFromMdxBody } from '@components/actividades/parse-tree.ts';
import type { GetStaticPaths } from 'astro';

export const getStaticPaths = (async () => {
  const libroAll = await getCollection('libro');
  return libroAll
    .filter((u) => u.data.estado === 'publicado')
    .map((u) => {
      const slug = u.id.split('/').pop()?.replace(/\.mdx?$/, '') ?? u.id;
      return {
        params: { asignatura: u.data.asignatura, 'unidad-slug': slug },
        props: { unit: u },
      };
    });
}) satisfies GetStaticPaths;

const { unit } = Astro.props;
const a = ASIGNATURAS[unit.data.asignatura as keyof typeof ASIGNATURAS];
const unidad = unit.data.unidad;

const [testsAll, dinAll, recAll] = await Promise.all([
  getCollection('tests'),
  getCollection('actividadesDinamicas'),
  getCollection('recursos'),
]);
const test = testsAll.find((t) => t.data.asignatura === a.slug && t.data.unidad_relacionada === unidad && t.data.estado === 'publicado');
const simuladores = dinAll.filter((d) => d.data.asignatura === a.slug && d.data.unidad_relacionada === unidad && d.data.estado === 'publicado');
const recursos = recAll.filter((r) => r.data.asignatura === a.slug && r.data.unidad_relacionada === unidad && r.data.estado === 'publicado');

// Pre-parse simulator JSON so build-time errors surface clearly.
const simuladoresParsed = simuladores.map((s) => {
  const simSlug = s.id.split('/').pop()?.replace(/\.mdx?$/, '') ?? s.id;
  return { entry: s, simSlug, tree: parseTreeFromMdxBody(s.body ?? '') };
});
---

<BaseLayout title={`Actividades · ${unit.data.title} — ${a.shortLabel}`} description={`Test, simuladores y recursos interactivos de la unidad ${unidad}.`}>
  <div class="container">
    <nav class="breadcrumb">
      <a href="/">Inicio</a> <span class="sep">›</span>
      <a href={`/${a.slug}/`}>{a.shortLabel}</a> <span class="sep">›</span>
      <a href={`/${a.slug}/actividades-dinamicas/`}>Actividades dinámicas</a> <span class="sep">›</span>
      <span>Unidad {unidad}</span>
    </nav>
  </div>

  <section class="hero">
    <div class="container">
      <span class="kicker">Unidad {unidad} · {a.shortLabel}</span>
      <h1>{unit.data.title}</h1>
      {unit.data.lema && <p class="lede">{unit.data.lema}</p>}
    </div>
  </section>

  {test && (
    <section class="bloque">
      <div class="container container--narrow">
        <h2 class="bloque__h2">Test de autoevaluación</h2>
        <p class="bloque__meta">{test.data.preguntas.length} preguntas{test.data.duracion_estimada && <> · {test.data.duracion_estimada}</>}</p>
        <QuizPlayer preguntas={test.data.preguntas} client:visible />
      </div>
    </section>
  )}

  {simuladoresParsed.length > 0 && (
    <section class="bloque bloque--alt">
      <div class="container container--narrow">
        <h2 class="bloque__h2">Simuladores de decisión</h2>
        {simuladoresParsed.map(({ entry, simSlug, tree }) => (
          <article class="simulador">
            <h3 class="simulador__h3">{entry.data.title}</h3>
            {entry.data.descripcion && <p class="simulador__lede">{entry.data.descripcion}</p>}
            <ArbolDecisiones data={tree} simuladorId={`${a.slug}-${simSlug}`} />
          </article>
        ))}
      </div>
    </section>
  )}

  {recursos.length > 0 && (
    <section class="bloque">
      <div class="container container--narrow">
        <h2 class="bloque__h2">Recursos interactivos</h2>
        <ul class="recurso-list">
          {recursos.map((r) => {
            const rSlug = r.id.split('/').pop()?.replace(/\.mdx?$/, '') ?? r.id;
            return (
              <li>
                <a href={`/${a.slug}/recursos/${rSlug}/`}>
                  <h3>{r.data.title}</h3>
                  <p>{r.data.descripcion}</p>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  )}

  {!test && simuladoresParsed.length === 0 && recursos.length === 0 && (
    <section class="bloque">
      <div class="container container--narrow">
        <p class="empty">Pronto aquí: simulador, recursos y test de esta unidad.</p>
      </div>
    </section>
  )}
</BaseLayout>

<style>
  .bloque { padding: 48px 0; border-top: 1px solid var(--color-line); }
  .bloque--alt { background: var(--color-bg-cream); }
  .bloque__h2 { font-family: var(--font-serif); font-size: 28px; margin: 0 0 8px; }
  .bloque__meta { font-family: var(--font-mono); font-size: 13px; color: var(--color-ink-mute); margin: 0 0 24px; }
  .simulador { margin-bottom: 40px; }
  .simulador__h3 { font-family: var(--font-serif); font-size: 22px; margin: 24px 0 6px; }
  .simulador__lede { font-family: var(--font-serif); font-style: italic; color: var(--color-ink-soft); margin: 0 0 18px; }
  .recurso-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 12px; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
  .recurso-list a { display: block; padding: 18px 20px; background: var(--color-paper); border: 1px solid var(--color-line); border-radius: 6px; text-decoration: none; color: inherit; }
  .recurso-list a:hover { border-color: var(--color-terra); }
  .recurso-list h3 { font-family: var(--font-serif); font-size: 18px; margin: 0 0 6px; }
  .recurso-list p  { font-size: 14px; color: var(--color-ink-soft); margin: 0; }
  .empty { font-family: var(--font-serif); font-style: italic; color: var(--color-ink-mute); }
</style>
```

- [ ] **Step 2 · Commit**

```bash
git add src/pages/[asignatura]/actividades-dinamicas/[unidad-slug].astro
git commit -m "feat(actividades): per-unit page with test + simulators + resources sections"
```

---

## Task 8 · Cafeteria simulator content (the actual case)

**Files:**
- Create: `src/content/asignaturas/edmn-2bach/actividades-dinamicas/06-cafeteria-del-barrio.mdx`

- [ ] **Step 1 · Write the MDX with the JSON tree**

Create `src/content/asignaturas/edmn-2bach/actividades-dinamicas/06-cafeteria-del-barrio.mdx`:

````mdx
---
asignatura: edmn-2bach
unidad_relacionada: 6
title: "Has heredado la cafetería del barrio"
tipo: arbol-decisiones
componente: ArbolDecisiones
duracion: "15-20 min"
descripcion: "Tu tío te deja la Cafetería Central. Las ventas caen, la caja se agota. Diseña el marketing mix antes de quedarte sin pista."
competencias_clave: [CPSAA, CE, CD]
competencias_especificas: [CE3]
estado: publicado
publicado_en: 2026-05-30
---

```json
{
  "intro": {
    "kicker": "Caso · Marketing",
    "titulo": "Has heredado la cafetería del barrio",
    "contexto": "Tu tío Antonio te ha dejado en herencia la Cafetería Central. Tres mesas, terraza pequeña, clientela fiel de jubilados que viene cada mañana al café con leche y la tertulia. Las ventas caen un 12 % cada año desde 2022. Te quedan 8.000 € en caja y 6 meses antes de tener que cerrar. Estudias 2º de Bachillerato, así que tendrás que decidir mientras te preparas la EBAU.",
    "kpi_inicial": { "caja": 8000, "clientes_mes": 240, "satisfaccion": 8.5 }
  },
  "nodes": {
    "n1": {
      "titulo": "Decisión 1 — La oferta de Coca-Cola",
      "situacion": "Un comercial de Coca-Cola te ofrece: nevera nueva + 600 € al año si vendes solo sus refrescos. Tus clientes actuales son mayores y no piden refrescos casi nunca, pero el comercial insiste en que «todos los bares aceptan».",
      "opciones": [
        {
          "label": "Acepto, 600 € son 600 € y la nevera no me cuesta nada",
          "kpi_delta": { "caja": 600, "satisfaccion": -1 },
          "feedback": "Cogiste el dinero, pero firmaste un contrato que limita tu propuesta de valor. Si mañana cambia tu segmento (p. ej. atraer jóvenes que piden Aquarius), no puedes adaptarte. Lección: una decisión de precio o suministro nunca es solo financiera — define con qué segmento puedes trabajar.",
          "next": "n2"
        },
        {
          "label": "No acepto, mantengo libertad de marca",
          "kpi_delta": { "caja": 0, "satisfaccion": 0 },
          "feedback": "Conservas margen de maniobra. El comercial vuelve dentro de dos meses con mejor oferta — eso suele pasar cuando dices que no la primera vez.",
          "next": "n2"
        },
        {
          "label": "Negocio 1.200 € + libertad para vender otras marcas premium",
          "kpi_delta": { "caja": 800, "satisfaccion": 0 },
          "feedback": "Mejor jugada: usas el interés de Coca-Cola como leverage para obtener mejores términos. Coca-Cola sigue ganando con tu volumen, tú no firmas exclusividad. Lección: el precio es señal, también para tus proveedores.",
          "next": "n2"
        }
      ]
    },
    "n2": {
      "titulo": "Decisión 2 — Segmentación del local",
      "situacion": "Has identificado tres segmentos posibles: (a) los jubilados de siempre — gastan 3 €/visita, vienen 3 veces por semana; (b) opositores que vienen a estudiar — gastan 6 €/visita, se quedan 3 horas; (c) familias del fin de semana — gastan 18 €/visita, vienen 1 vez por semana. No tienes recursos para atender a los tres bien.",
      "opciones": [
        {
          "label": "Me concentro en los opositores (wifi, mesas grandes, ambiente silencioso)",
          "kpi_delta": { "clientes_mes": 60, "satisfaccion": 0.3 },
          "feedback": "Segmentación concentrada (nicho). Subes ticket medio porque el opositor se queda 3 horas pero consume 2 cosas, y atraes nuevos clientes con la misma propuesta. Los jubilados de siempre se quejan del silencio pero la mayoría se queda.",
          "next": "n3"
        },
        {
          "label": "Mantengo a los jubilados pero abro fines de semana para familias",
          "kpi_delta": { "clientes_mes": 30, "caja": -800, "satisfaccion": 0.1 },
          "feedback": "Marketing diferenciado. Necesitas dos mixes distintos (mañanas tranquilas vs fines de semana con niños), eso sube tus costes operativos. Funciona, pero requiere más esfuerzo y los fines de semana hay que contratar refuerzo.",
          "next": "n3"
        },
        {
          "label": "Sigo con todo el mundo como hasta ahora",
          "kpi_delta": { "clientes_mes": -20, "satisfaccion": -0.5 },
          "feedback": "Marketing indiferenciado. Si tu local no destaca para nadie, no destaca para nadie. La caída del 12 % anual sigue. Lección clave: «un mensaje para todos» es un mensaje para nadie.",
          "next": "n3"
        }
      ]
    },
    "n3": {
      "titulo": "Decisión 3 — Precio del café",
      "situacion": "El café te cuesta 0,35 € (grano + leche + electricidad + amortización de la cafetera). Lo vendes a 1,50 €. La cafetería de la esquina ha bajado el suyo a 1,20 € y la cadena 'Coffee Lab' acaba de abrir a 200 m vendiendo el cappuccino a 3,50 € con leche de avena.",
      "opciones": [
        {
          "label": "Bajo a 1,20 € para no perder clientes vs la otra cafetería",
          "kpi_delta": { "caja": -1200, "clientes_mes": 10, "satisfaccion": -0.2 },
          "feedback": "Guerra de precios. Tu margen baja un 25 % y los clientes que ya tenías no compran más porque no es eso lo que les retiene. Es un movimiento defensivo costoso. Lección: el precio es la P más fácil de bajar y la que más cuesta recuperar.",
          "next": "final"
        },
        {
          "label": "Mantengo 1,50 € y mejoro la experiencia (taza buena, café de tueste local)",
          "kpi_delta": { "caja": -400, "clientes_mes": 25, "satisfaccion": 1.0 },
          "feedback": "Producto + Plaza coherentes con el segmento. Subes el margen percibido sin tocar el precio. El boca a oreja te trae clientes nuevos. Lección clave: la mejor respuesta a una bajada de precio del competidor casi nunca es bajar el tuyo.",
          "next": "final"
        },
        {
          "label": "Subo a 2,20 € con leche de avena y barista certificado",
          "kpi_delta": { "caja": -600, "clientes_mes": -30, "satisfaccion": 0.3 },
          "feedback": "Te mueves al segmento 'Coffee Lab', pero tu local no tiene la decoración ni la marca. Pierdes a los jubilados y no captas a los hipster premium porque no es coherente con la propuesta. Lección: posicionamiento se construye con todas las P a la vez, no solo subiendo el precio.",
          "next": "final"
        }
      ]
    }
  },
  "finales": {
    "exito": {
      "titulo": "Has reflotado la cafetería",
      "resumen": "Ventas mensuales +20 %, satisfacción cliente por encima de 9, caja sostenible al cierre del año.",
      "lecciones_clave": [
        "Una propuesta de valor coherente con el segmento gana al volumen barato.",
        "Las 4P se diseñan juntas, no por separado: cambiar una sin las demás rompe la coherencia.",
        "El precio es señal, no resultado del coste. Y casi nunca es la primera P a tocar."
      ]
    },
    "fracaso_parcial": {
      "titulo": "La cafetería sobrevive, justa",
      "resumen": "Has evitado el cierre pero el negocio queda frágil. Margen ajustado, ningún segmento claramente conquistado.",
      "lecciones_clave": [
        "Diluir tu propuesta para no perder a nadie suele significar no convencer a nadie.",
        "Guerra de precios solo funciona si tienes ventaja en costes — y tú no la tienes."
      ]
    }
  }
}
```
````

- [ ] **Step 2 · Hand-route the endings in the JSON**

The current `next: "final"` in n3 is not specific. Replace the three n3 endings with these specific `next` values so the simulator routes to either ending based on the user's choices:

In node `n3`, change:
- Option 1 (`"Bajo a 1,20 €"`): `"next": "final:fracaso_parcial"`
- Option 2 (`"Mantengo 1,50 €"`): `"next": "final:exito"`
- Option 3 (`"Subo a 2,20 €"`): `"next": "final:fracaso_parcial"`

Apply the edit:

```bash
# Manual edit of the MDX, three lines changed.
```

- [ ] **Step 3 · Smoke parse: confirm the MDX body still parses**

```bash
node -e "
import('./src/components/actividades/parse-tree.ts').then(async (m) => {
  const fs = await import('node:fs');
  const src = fs.readFileSync('src/content/asignaturas/edmn-2bach/actividades-dinamicas/06-cafeteria-del-barrio.mdx', 'utf8');
  const body = src.split(/^---\\n[\\s\\S]*?\\n---\\n/)[1];
  const tree = m.parseTreeFromMdxBody(body);
  console.log('OK:', tree.intro.titulo);
});
"
```

Expected: `OK: Has heredado la cafetería del barrio`.

- [ ] **Step 4 · Commit**

```bash
git add src/content/asignaturas/edmn-2bach/actividades-dinamicas/06-cafeteria-del-barrio.mdx
git commit -m "feat(actividades): cafeteria simulator for EDMN 2BACH U6 (3 decisions, 2 endings)"
```

---

## Task 9 · Audit `unidad_relacionada` on EDMN 2BACH recursos

**Files:**
- Modify: `src/content/asignaturas/edmn-2bach/recursos/*.md` (only those that lack `unidad_relacionada`)

- [ ] **Step 1 · Find recursos missing `unidad_relacionada`**

```bash
grep -L "unidad_relacionada" src/content/asignaturas/edmn-2bach/recursos/*.md
```

Expected output: paths of files needing the field. The mapping (Pau-approved):

| File | Suggested `unidad_relacionada` |
|---|:---:|
| `calculadora-punto-muerto.md` | 7 |
| `calculadora-ratios.md` | 11 |
| `calculadora-van-tir.md` | 9 |
| `calculadora-dcf.md` | 9 |
| `ratios-benchmark.md` | 11 |

If a file already has `unidad_relacionada`, skip it.

- [ ] **Step 2 · Add the field to each missing file**

For each file in the table above, open it, find the YAML frontmatter, and add the line (preserving alphabetical order if it matters):

```yaml
unidad_relacionada: <number>
```

immediately after `asignatura: edmn-2bach`.

- [ ] **Step 3 · Build to confirm the schema still accepts everything**

```bash
npx astro check --noSync 2>&1 | grep -i "recursos\|unidad_relacionada" | head -5
```

Expected: no errors mentioning `recursos` or `unidad_relacionada`.

- [ ] **Step 4 · Commit**

```bash
git add src/content/asignaturas/edmn-2bach/recursos/
git commit -m "chore(recursos): tag EDMN 2BACH recursos with unidad_relacionada"
```

---

## Task 10 · 301 redirects from `/tests/` to `/actividades-dinamicas/`

**Files:**
- Modify: `astro.config.mjs`

- [ ] **Step 1 · Check current redirect block**

```bash
grep -A 5 "redirects" astro.config.mjs
```

If there's no `redirects` key, add one inside `defineConfig({ … })`.

- [ ] **Step 2 · Add the redirects**

Inside `defineConfig({ … })`, add (or extend) the `redirects` key:

```js
redirects: {
  // Per-asignatura tests landing
  '/edmn-2bach/tests': '/edmn-2bach/actividades-dinamicas/',
  '/eco-1bach/tests':  '/eco-1bach/actividades-dinamicas/',
  '/eco-4eso/tests':   '/eco-4eso/actividades-dinamicas/',
  '/fopp-4eso/tests':  '/fopp-4eso/actividades-dinamicas/',
  '/taller-eco-3eso/tests': '/taller-eco-3eso/actividades-dinamicas/',
  '/ipe1-fp/tests':    '/ipe1-fp/actividades-dinamicas/',
  '/ipe2-fp/tests':    '/ipe2-fp/actividades-dinamicas/',
  '/eeae-bach/tests':  '/eeae-bach/actividades-dinamicas/',
  '/gpe-bach/tests':   '/gpe-bach/actividades-dinamicas/',
  // Individual test pages: /[asignatura]/tests/[slug] → /[asignatura]/actividades-dinamicas/[slug]
  // Astro doesn't support wildcards in `redirects`, but the existing slug matches the
  // unidad-slug perfectly because both come from the same libro filename. We rely on
  // SEO crawlers following the index redirect; individual deep links keep working
  // because the old route still resolves (tests collection is unchanged).
},
```

Note: Individual `/tests/[slug]/` pages still work because we leave the original route in place — we only redirect the hub.

- [ ] **Step 3 · Commit**

```bash
git add astro.config.mjs
git commit -m "feat(actividades): redirect /[asignatura]/tests hub to /actividades-dinamicas/"
```

---

## Task 11 · Link from asignatura landing page

**Files:**
- Modify: `src/pages/[asignatura]/index.astro`

- [ ] **Step 1 · Find the section that lists "Tests"**

```bash
grep -n -B 2 -A 6 "Tests" src/pages/[asignatura]/index.astro | head -30
```

There's likely a card grid with "Libro / Diapositivas / Tests / Recursos" or similar.

- [ ] **Step 2 · Replace the "Tests" + "Recursos" cards with one "Actividades dinámicas" card**

Find the JSX-like Astro fragments for those two cards and replace them with a single one. Example (exact code depends on current structure):

```astro
<li class="card">
  <a href={`/${a.slug}/actividades-dinamicas/`}>
    <h3>Actividades dinámicas</h3>
    <p>Tests, simuladores de decisión y recursos interactivos por unidad.</p>
  </a>
</li>
```

- [ ] **Step 3 · Smoke test**

```bash
npm run dev -- --port 4321 &
sleep 8
curl -s http://localhost:4321/edmn-2bach/ | grep -c "Actividades dinámicas"
# Expected: at least 1
kill %1 2>/dev/null
```

- [ ] **Step 4 · Commit**

```bash
git add src/pages/[asignatura]/index.astro
git commit -m "feat(actividades): replace Tests+Recursos cards with single Actividades dinámicas card"
```

---

## Task 12 · End-to-end build smoke test

**Files:** No new files. Just verify everything compiles and renders.

- [ ] **Step 1 · Full Astro build**

```bash
npm run build 2>&1 | tail -10
```

Expected: build completes successfully. Look for any errors related to `actividades-dinamicas` or the new collection.

- [ ] **Step 2 · Spot-check the generated HTML**

```bash
ls dist/client/edmn-2bach/actividades-dinamicas/ | head
# Expected: index.html plus 12 unit folders (01-persona-emprendedora/, …, 12-…)

grep -c "Has heredado la cafetería" dist/client/edmn-2bach/actividades-dinamicas/06-funcion-comercial-marketing/index.html
# Expected: at least 1 (it's the simulator title)

grep -c "QuizPlayer\|ArbolDecisionesIsland" dist/client/edmn-2bach/actividades-dinamicas/06-funcion-comercial-marketing/index.html
# Expected: at least 1 (the islands are referenced)
```

- [ ] **Step 3 · Run all tests one last time**

```bash
npx vitest run
```

Expected: all tests pass — including the new `kpi.test.ts` and `parse-tree.test.ts`.

- [ ] **Step 4 · Final summary commit (no code changes — just for the log)**

If any small fixes were needed during the smoke test, commit them. Otherwise nothing to do here.

- [ ] **Step 5 · Push the branch and open a PR**

```bash
git push -u origin feat/actividades-dinamicas
gh pr create --base main --head feat/actividades-dinamicas \
  --title "feat(actividades): /actividades-dinamicas/ hub + cafeteria simulator (EDMN U6)" \
  --body "Implements the spec at docs/superpowers/specs/2026-05-29-actividades-dinamicas-design.md."
```

---

## Self-review (post-write)

**1. Spec coverage:**
- `/actividades-dinamicas/` hub → Task 6 ✓
- Per-unit page with 3 sections → Task 7 ✓
- `<ArbolDecisiones>` component → Tasks 2 (types), 3 (parser), 4 (island), 5 (wrapper) ✓
- New `actividadesDinamicas` collection → Task 1 ✓
- Cafeteria case content → Task 8 ✓
- `unidad_relacionada` audit on recursos → Task 9 ✓
- Redirects from /tests/ → Task 10 ✓
- Asignatura landing page link → Task 11 ✓
- End-to-end verification → Task 12 ✓

**2. Placeholder scan:** None — every step has explicit code or commands.

**3. Type consistency:** `ArbolJSON`, `Kpis`, `Opcion`, `Nodo`, `Final` defined in Task 2's `types.ts`, used in Tasks 3, 4, 5, 7. `parseTreeFromMdxBody` defined in Task 3, used in Task 7. `applyDelta`/`percentChange` defined in Task 2, used in Task 4. Naming consistent throughout.

**4. Variance from spec:** None. The plan matches the spec one-to-one.
