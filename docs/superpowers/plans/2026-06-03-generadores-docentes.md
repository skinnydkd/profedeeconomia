# Generadores: herramientas docentes — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `/generadores/` into a teacher-tools hub: keep the (now two) external generators, and add 6 native interactive tools — a rubric generator, a grading calculator, and 4 fillable teacher templates (plan de refuerzo, registro de aula, medidas DUA, autoevaluación) — that autosave, export to PNG/PDF and print.

**Architecture:** A TS registry `src/lib/generadores.ts` (6 native tools + 2 external links) feeds a reworked landing and a `/generadores/[slug]` detail page, with a `GeneradorIsland` dispatcher. Native islands reuse the existing `src/lib/plantillas/` utils (`usePersistentState`, `exportarNodo`) and the `src/lib/calc/*` pure-logic pattern. Separate from the student `/herramientas/` toolbox.

**Tech Stack:** Astro 5, Preact islands (`client:load`), TypeScript, Vitest, html2canvas, jspdf.

---

## File structure

| File | Responsibility |
|---|---|
| `src/lib/generadores.ts` (+ test) | Registry of 6 native + 2 external tools; helpers. |
| `src/lib/calc/calificaciones.ts` (+ test) | Pure grading math. |
| `src/components/generadores/CalificacionesCalc.tsx` | Grading calculator island. |
| `src/components/generadores/RubricaGenerator.tsx` | Dynamic rubric island. |
| `src/components/generadores/PlanRefuerzo.tsx` | Plan de refuerzo template. |
| `src/components/generadores/RegistroAula.tsx` | Classroom register template. |
| `src/components/generadores/MedidasDUA.tsx` | DUA measures template. |
| `src/components/generadores/Autoevaluacion.tsx` | Self/peer assessment template. |
| `src/components/generadores/GeneradorIsland.astro` | Dispatch the 6 islands by componente. |
| `src/pages/generadores/index.astro` (rework) | Landing: external + native grids. |
| `src/pages/generadores/[slug].astro` (create) | Native tool detail page. |
| `src/lib/asignaturas.ts` (modify) | Update `generadores` menu description. |

Reused: `src/lib/plantillas/persistence.ts` (`usePersistentState`), `src/lib/plantillas/export.ts` (`exportarNodo`).

---

## Task 1: Registry + grading logic (+ tests)

**Files:** Create `src/lib/generadores.ts` (+ `.test.ts`), `src/lib/calc/calificaciones.ts` (+ `.test.ts`).

- [ ] **Step 1: Write `src/lib/calc/calificaciones.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { mediaPonderada, sumaPesos, rubricaANota } from './calificaciones.ts';

describe('mediaPonderada', () => {
  it('weights notes by their pesos', () => {
    expect(mediaPonderada([{ peso: 2, nota: 5 }, { peso: 3, nota: 8 }])).toBeCloseTo(6.8);
  });
  it('returns null when total weight is non-positive', () => {
    expect(mediaPonderada([])).toBeNull();
    expect(mediaPonderada([{ peso: 0, nota: 9 }])).toBeNull();
  });
});

describe('sumaPesos', () => {
  it('sums the pesos', () => {
    expect(sumaPesos([{ peso: 40 }, { peso: 60 }])).toBe(100);
  });
});

describe('rubricaANota', () => {
  it('scales obtained/max to the scale (default 10)', () => {
    expect(rubricaANota(3, 4)).toBe(7.5);
    expect(rubricaANota(6, 12, 100)).toBe(50);
  });
  it('returns null when max is non-positive', () => {
    expect(rubricaANota(3, 0)).toBeNull();
  });
});
```

- [ ] **Step 2: Run `npx vitest run src/lib/calc/calificaciones.test.ts` — confirm FAIL.**

- [ ] **Step 3: Create `src/lib/calc/calificaciones.ts`**

```ts
/**
 * Pure grading math: weighted average of instruments/competences and a
 * rubric-levels → mark converter. Returns `null` for undefined cases.
 */
export function sumaPesos(items: { peso: number }[]): number {
  return items.reduce((acc, it) => acc + it.peso, 0);
}

export function mediaPonderada(items: { peso: number; nota: number }[]): number | null {
  const total = sumaPesos(items);
  if (total <= 0) return null;
  const acc = items.reduce((sum, it) => sum + it.peso * it.nota, 0);
  return acc / total;
}

export function rubricaANota(obtenidos: number, maximos: number, escala = 10): number | null {
  if (maximos <= 0) return null;
  return (obtenidos / maximos) * escala;
}
```

- [ ] **Step 4: Run the test — confirm PASS.**

- [ ] **Step 5: Write `src/lib/generadores.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import {
  GENERADOR_KEYS, GENERADORES_NATIVOS, GENERADORES_EXTERNOS,
  generadorPorSlug, gruposNativos,
} from './generadores.ts';

describe('GENERADORES_NATIVOS', () => {
  it('has 6 tools, each with a valid componente, unique slug, valid grupo/tipo', () => {
    expect(GENERADORES_NATIVOS).toHaveLength(6);
    const slugs = new Set<string>();
    for (const g of GENERADORES_NATIVOS) {
      expect(GENERADOR_KEYS).toContain(g.componente);
      expect(['evaluacion', 'aula']).toContain(g.grupo);
      expect(['rubrica', 'calculadora', 'plantilla']).toContain(g.tipo);
      slugs.add(g.slug);
    }
    expect(slugs.size).toBe(6);
  });
});

describe('GENERADORES_EXTERNOS', () => {
  it('lists the 2 external generators with an href', () => {
    expect(GENERADORES_EXTERNOS.length).toBe(2);
    for (const e of GENERADORES_EXTERNOS) expect(e.href).toMatch(/^https?:\/\//);
  });
});

describe('generadorPorSlug', () => {
  it('resolves a known tool and is undefined otherwise', () => {
    expect(generadorPorSlug('rubricas')?.componente).toBe('Rubrica');
    expect(generadorPorSlug('nope')).toBeUndefined();
  });
});

describe('gruposNativos', () => {
  it('groups by grupo (evaluacion then aula)', () => {
    const g = gruposNativos();
    expect(g.map((x) => x.grupo)).toEqual(['evaluacion', 'aula']);
    expect(g[0].items.every((it) => it.grupo === 'evaluacion')).toBe(true);
  });
});
```

- [ ] **Step 6: Run `npx vitest run src/lib/generadores.test.ts` — confirm FAIL.**

- [ ] **Step 7: Create `src/lib/generadores.ts`**

```ts
/**
 * Registry for the teacher-tools section «Generadores»: 6 native interactive
 * tools (rubric, grading, and 4 fillable templates) plus the 2 external
 * generators hosted on oposicioneseconomia.es. Separate from the student
 * `/herramientas/` toolbox. No curriculum map (teacher tools aren't unit-bound).
 */
export type TipoGenerador = 'rubrica' | 'calculadora' | 'plantilla';
export type GrupoGenerador = 'evaluacion' | 'aula';

export const GENERADOR_KEYS = ['Rubrica', 'Calificaciones', 'Autoevaluacion', 'PlanRefuerzo', 'RegistroAula', 'MedidasDUA'] as const;
export type GeneradorKey = typeof GENERADOR_KEYS[number];

export interface GeneradorNativo {
  componente: GeneradorKey;
  slug: string;
  title: string;
  descripcion: string;
  comoUsar: string;
  tipo: TipoGenerador;
  grupo: GrupoGenerador;
  orden: number;
}
export interface GeneradorExterno { title: string; descripcion: string; href: string; eyebrow: string; }

const PROGRAMACION_URL = 'https://oposicioneseconomia.es/programacion';

export const GENERADORES_EXTERNOS: GeneradorExterno[] = [
  { eyebrow: 'Generador', title: 'Situaciones de Aprendizaje', descripcion: 'Un asistente por pasos que arma una Situación de Aprendizaje LOMLOE completa: saberes, competencias, criterios, secuencia de actividades, instrumentos de evaluación y medidas DUA. Lista para imprimir.', href: PROGRAMACION_URL },
  { eyebrow: 'Generador', title: 'Programación anual', descripcion: 'Monta una programación didáctica anual alineada con el currículo LOMLOE de tu asignatura y nivel, lista para descargar.', href: PROGRAMACION_URL },
];

export const GENERADORES_NATIVOS: GeneradorNativo[] = [
  { componente: 'Rubrica', slug: 'rubricas', title: 'Generador de rúbricas', tipo: 'rubrica', grupo: 'evaluacion', orden: 1, descripcion: 'Construye una rúbrica con criterios y niveles de logro, ligada a competencias, lista para exportar e imprimir.', comoUsar: 'Añade criterios y niveles, escribe el descriptor de cada celda y expórtala en PDF o imprímela.' },
  { componente: 'Calificaciones', slug: 'calificaciones', title: 'Calculadora de calificaciones', tipo: 'calculadora', grupo: 'evaluacion', orden: 2, descripcion: 'Media ponderada de instrumentos o competencias y conversor de niveles de rúbrica a nota.', comoUsar: 'Introduce los pesos y las notas de cada instrumento; abajo, convierte niveles de rúbrica en una calificación.' },
  { componente: 'Autoevaluacion', slug: 'autoevaluacion', title: 'Autoevaluación y coevaluación', tipo: 'plantilla', grupo: 'evaluacion', orden: 3, descripcion: 'Hoja para que el alumnado se autoevalúe o evalúe al equipo según unos criterios y una escala.', comoUsar: 'Edita los criterios, reparte la hoja y que el alumnado marque su valoración. Exporta o imprime.' },
  { componente: 'PlanRefuerzo', slug: 'plan-refuerzo', title: 'Plan de refuerzo', tipo: 'plantilla', grupo: 'aula', orden: 4, descripcion: 'Ficha de refuerzo o recuperación para un alumno: áreas, medidas, actividades, temporización y seguimiento.', comoUsar: 'Rellena los campos del plan para el alumno, guárdalo (se autoguarda) y expórtalo o imprímelo.' },
  { componente: 'RegistroAula', slug: 'registro-aula', title: 'Registro de aula', tipo: 'plantilla', grupo: 'aula', orden: 5, descripcion: 'Hoja de seguimiento del grupo: asistencia, actitud, entregas y observaciones por alumno.', comoUsar: 'Añade los alumnos, anota el seguimiento de la sesión y expórtalo o imprímelo.' },
  { componente: 'MedidasDUA', slug: 'medidas-dua', title: 'Medidas DUA / adaptación', tipo: 'plantilla', grupo: 'aula', orden: 6, descripcion: 'Plantilla de medidas de atención a la diversidad (DUA): barreras, ajustes, recursos y seguimiento.', comoUsar: 'Describe el contexto, las barreras y los ajustes (representación, acción, implicación), y expórtalo.' },
];

const BY_SLUG = new Map(GENERADORES_NATIVOS.map((g) => [g.slug, g]));
export function generadorPorSlug(slug: string): GeneradorNativo | undefined { return BY_SLUG.get(slug); }

export function gruposNativos(): { grupo: GrupoGenerador; label: string; items: GeneradorNativo[] }[] {
  const defs: { grupo: GrupoGenerador; label: string }[] = [
    { grupo: 'evaluacion', label: 'Evaluación' },
    { grupo: 'aula', label: 'Atención y aula' },
  ];
  return defs.map((d) => ({
    ...d,
    items: GENERADORES_NATIVOS.filter((g) => g.grupo === d.grupo).sort((a, b) => a.orden - b.orden),
  })).filter((g) => g.items.length > 0);
}
```

- [ ] **Step 8: Run both test files — confirm PASS.** Then `npx astro check` — no new errors.

- [ ] **Step 9: Commit**

```bash
git add src/lib/generadores.ts src/lib/generadores.test.ts src/lib/calc/calificaciones.ts src/lib/calc/calificaciones.test.ts
git commit -m "feat(generadores): registry and pure grading logic"
```

---

## Task 2: Grading calculator island

**Files:** Create `src/components/generadores/CalificacionesCalc.tsx`.

Preact island (verified by build + smoke). Read `src/components/calculadoras/PuntoMuertoCalc.tsx` for the house style. Import `mediaPonderada, sumaPesos, rubricaANota` from `@/lib/calc/calificaciones`.

- [ ] **Step 1: Build `CalificacionesCalc.tsx`** — contract:
  - **Block 1 — Media ponderada:** an editable list of rows `{ nombre: string, peso: number, nota: number }` (add/remove rows; sensible default rows). Show `mediaPonderada(rows)` as the final mark (or "—" if null), and show `sumaPesos(rows)` with a visible warning when it ≠ 100 ("Los pesos suman X %, no 100 %").
  - **Block 2 — Rúbrica → nota:** inputs `obtenidos` and `maximos` (niveles), and an optional `escala` (default 10); show `rubricaANota(obtenidos, maximos, escala)` or "—".
  - `useState` only (no persistence required). All math via the lib (do not reimplement). Spanish labels, tokens only, no emojis. Renders "—" for null.

- [ ] **Step 2: `npx astro check` — no new errors. Commit:**

```bash
git add src/components/generadores/CalificacionesCalc.tsx
git commit -m "feat(generadores): grading calculator island"
```

---

## Task 3: Dynamic rubric generator island

**Files:** Create `src/components/generadores/RubricaGenerator.tsx`.

Preact island. Read `src/components/calculadoras/DAFOCanvas.tsx` for the persistence + action-bar + print pattern, and reuse `usePersistentState` (`@/lib/plantillas/persistence`) and `exportarNodo` (`@/lib/plantillas/export`).

- [ ] **Step 1: Build `RubricaGenerator.tsx`** — contract:
  - State (persisted under `pde:generador:rubricas` via `usePersistentState`):
    ```ts
    { titulo: string; niveles: string[]; criterios: { id: string; nombre: string; competencia: string; celdas: string[] }[] }
    ```
    `niveles` default `['Insuficiente', 'Suficiente', 'Notable', 'Sobresaliente']`; each criterio's `celdas` array has one entry per nivel.
  - Render an editable table: a title input; a header row of editable `niveles` labels (+ a "Añadir nivel" / "Quitar nivel" control that keeps every criterio's `celdas` length in sync); one row per criterio with an editable `nombre`, an editable `competencia` (small), and one `<textarea>` descriptor per nivel; an "Añadir criterio" button and a per-row remove button.
  - Generate ids without `Date.now()`/`Math.random()` at module/render top level is fine inside event handlers (use `crypto.randomUUID?.()` or a simple incrementing counter ref); these run only on user interaction in the browser, so they're allowed — but keep the INITIAL state static (no dynamic ids in the persisted default).
  - The editable table lives inside a `.lienzo` ref. Action bar (`no-print`): Exportar PNG · Exportar PDF · Imprimir · Vaciar (confirm → reset to default). Export via `exportarNodo(ref.current!, 'rubrica', fmt)` in try/catch. `@media print` isolates `.lienzo`, prints textarea text, hides controls.
  - Tokens only; no emojis; accents correct.

- [ ] **Step 2: `npx astro check` — no new errors. Commit:**

```bash
git add src/components/generadores/RubricaGenerator.tsx
git commit -m "feat(generadores): dynamic rubric generator island"
```

---

## Task 4: The 4 teacher template islands

**Files:** Create `PlanRefuerzo.tsx`, `RegistroAula.tsx`, `MedidasDUA.tsx`, `Autoevaluacion.tsx` in `src/components/generadores/`.

All follow the SAME pattern (read `src/components/calculadoras/DAFOCanvas.tsx`): `usePersistentState('pde:generador:<slug>', INITIAL)`, a `.lienzo` ref, an action bar (`no-print`) with Exportar PNG/PDF · Imprimir · Vaciar (export in try/catch), and an `@media print` block isolating the `.lienzo`. Tokens only; no emojis; accents correct.

- [ ] **Step 1: `PlanRefuerzo.tsx`** (key `pde:generador:plan-refuerzo`) — a form: alumno/grupo, curso/fecha, áreas o criterios a reforzar, medidas/apoyos, actividades propuestas, temporización, seguimiento/observaciones. Labelled `<input>`/`<textarea>` fields.

- [ ] **Step 2: `RegistroAula.tsx`** (key `pde:generador:registro-aula`) — a table: rows = alumnos (add/remove, name editable), columns = Asistencia, Actitud, Entregas, Observaciones (each cell an input/textarea). A "Añadir alumno" button. Header with a fecha/sesión field.

- [ ] **Step 3: `MedidasDUA.tsx`** (key `pde:generador:medidas-dua`) — a form: contexto/alumno, barreras detectadas, ajustes de **representación**, ajustes de **acción y expresión**, ajustes de **implicación**, recursos, seguimiento. Labelled textareas grouped by the three DUA principles.

- [ ] **Step 4: `Autoevaluacion.tsx`** (key `pde:generador:autoevaluacion`) — a sheet: a title, an editable list of criterios (add/remove), and per criterio a textual scale selector/row (e.g. columns "Poco / Bastante / Mucho" or a 1–4 scale the student marks). Header with nombre/equipo/fecha. NO pictographic emojis for the scale — use text or numbers.

- [ ] **Step 5: `npx astro check` — no new errors. Commit:**

```bash
git add src/components/generadores/PlanRefuerzo.tsx src/components/generadores/RegistroAula.tsx src/components/generadores/MedidasDUA.tsx src/components/generadores/Autoevaluacion.tsx
git commit -m "feat(generadores): plan de refuerzo, registro de aula, medidas DUA and autoevaluación templates"
```

---

## Task 5: Dispatcher, detail page, landing rework, menu

**Files:** Create `src/components/generadores/GeneradorIsland.astro`, `src/pages/generadores/[slug].astro`; rework `src/pages/generadores/index.astro`; modify `src/lib/asignaturas.ts`.

- [ ] **Step 1: Create `src/components/generadores/GeneradorIsland.astro`**

```astro
---
/** Renders the teacher tool island matching `componente`. */
import CalificacionesCalc from '@components/generadores/CalificacionesCalc.tsx';
import RubricaGenerator from '@components/generadores/RubricaGenerator.tsx';
import PlanRefuerzo from '@components/generadores/PlanRefuerzo.tsx';
import RegistroAula from '@components/generadores/RegistroAula.tsx';
import MedidasDUA from '@components/generadores/MedidasDUA.tsx';
import Autoevaluacion from '@components/generadores/Autoevaluacion.tsx';

interface Props { componente?: string }
const { componente } = Astro.props;
---
{componente === 'Calificaciones' && <CalificacionesCalc client:load />}
{componente === 'Rubrica' && <RubricaGenerator client:load />}
{componente === 'PlanRefuerzo' && <PlanRefuerzo client:load />}
{componente === 'RegistroAula' && <RegistroAula client:load />}
{componente === 'MedidasDUA' && <MedidasDUA client:load />}
{componente === 'Autoevaluacion' && <Autoevaluacion client:load />}
```

- [ ] **Step 2: Create `src/pages/generadores/[slug].astro`**

```astro
---
/** A single teacher tool. Routed by `[slug]` over GENERADORES_NATIVOS. */
import BaseLayout from '@layouts/BaseLayout.astro';
import GeneradorIsland from '@components/generadores/GeneradorIsland.astro';
import { GENERADORES_NATIVOS, generadorPorSlug } from '@/lib/generadores';
import type { GetStaticPaths } from 'astro';

export const getStaticPaths = (async () => {
  return GENERADORES_NATIVOS.map((g) => ({ params: { slug: g.slug }, props: { componente: g.componente, slug: g.slug } }));
}) satisfies GetStaticPaths;

const { componente, slug } = Astro.props;
const g = generadorPorSlug(slug)!;
const TIPO_LABEL: Record<string, string> = { rubrica: 'Rúbrica', calculadora: 'Calculadora', plantilla: 'Plantilla' };
---

<BaseLayout title={`${g.title} — Generadores`} description={g.descripcion}>
  <div class="container">
    <nav class="breadcrumb">
      <a href="/">Inicio</a> <span class="sep">›</span>
      <a href="/generadores/">Generadores</a> <span class="sep">›</span>
      <span>{g.title}</span>
    </nav>
  </div>

  <section class="body">
    <div class="container container--narrow">
      <span class="kicker">Herramienta docente · {TIPO_LABEL[g.tipo] ?? g.tipo}</span>
      <h1>{g.title}</h1>
      <p class="lede">{g.descripcion}</p>
      <p class="como">{g.comoUsar}</p>
    </div>
  </section>

  <section class="player-wrap">
    <div class="container container--narrow">
      <GeneradorIsland componente={componente} />
    </div>
  </section>

  <section class="body">
    <div class="container container--narrow">
      <nav class="back"><a href="/generadores/">← Todos los generadores</a></nav>
    </div>
  </section>
</BaseLayout>

<style>
  .container { max-width: 1240px; margin: 0 auto; padding: 0 clamp(1.5rem, 4vw, 3rem); }
  .container--narrow { max-width: 900px; }
  .breadcrumb { font-size: 0.92rem; color: var(--color-ink-mute); margin: 2rem 0; }
  .breadcrumb a { color: var(--color-ink-mute); text-decoration: none; }
  .breadcrumb a:hover { color: var(--color-terra); }
  .breadcrumb .sep { margin: 0 0.5em; color: var(--color-mustard); }
  .body { padding: 1rem 0; }
  .kicker { font-family: var(--font-sans); font-size: 0.8rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-terra); }
  h1 { margin: 0.6rem 0 0.4rem; max-width: 24ch; }
  .lede { font-size: 1.2rem; color: var(--color-ink-soft); line-height: 1.5; margin: 0 0 0.4rem; }
  .como { color: var(--color-ink-soft); font-size: 0.98rem; }
  .player-wrap { padding: clamp(1rem, 3vw, 2rem) 0 clamp(1.5rem, 4vw, 2.5rem); }
  .back { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--color-line); font-family: var(--font-sans); }
  .back a { color: var(--color-terra); text-decoration: none; font-weight: 500; }
  .back a:hover { text-decoration: underline; }
</style>
```

- [ ] **Step 3: Rework `src/pages/generadores/index.astro`** — replace the whole file. Keep the existing hero styling/tokens; render `GENERADORES_EXTERNOS` (2 cards linking out) under a heading «Generadores (oposicioneseconomia.es)», and `gruposNativos()` under «Herramientas de evaluación y aula», each native card linking to `/generadores/{slug}/`.

```astro
---
/**
 * Generadores hub: the external LOMLOE generators (hosted on the sibling project)
 * plus native teacher tools (rubric, grading, templates) grouped by purpose.
 */
import BaseLayout from '@layouts/BaseLayout.astro';
import { GENERADORES_EXTERNOS, gruposNativos } from '@/lib/generadores';

const grupos = gruposNativos();
const TIPO_LABEL: Record<string, string> = { rubrica: 'Rúbrica', calculadora: 'Calculadora', plantilla: 'Plantilla' };
---

<BaseLayout
  title="Generadores docentes"
  description="Generadores LOMLOE (situaciones de aprendizaje, programación) y herramientas de evaluación y aula: rúbricas, calificaciones y plantillas para imprimir."
>
  <div class="container">
    <nav class="breadcrumb"><a href="/">Inicio</a> <span class="sep">›</span> <span>Generadores</span></nav>
  </div>

  <section class="hero">
    <div class="container">
      <span class="kicker">Material para el profe</span>
      <h1><span class="serif-italic-wonk accent">Generadores</span> docentes.</h1>
      <p class="lede">
        Lo que usamos para preparar las clases: los generadores LOMLOE de nuestro
        proyecto hermano y un puñado de herramientas de evaluación y aula que funcionan
        en el navegador, se autoguardan y se exportan o imprimen.
      </p>
    </div>
  </section>

  <section class="tools">
    <div class="container">
      <h2 class="group-title">Generadores LOMLOE</h2>
      <div class="tool-grid">
        {GENERADORES_EXTERNOS.map((t) => (
          <a class="tool-card" href={t.href} rel="external noopener" target="_blank">
            <span class="tc-eyebrow">{t.eyebrow}</span>
            <h3 class="tc-title serif">{t.title}</h3>
            <p class="tc-desc">{t.descripcion}</p>
            <span class="tc-cta">Abrir en oposicioneseconomia.es →</span>
          </a>
        ))}
      </div>

      {grupos.map((g) => (
        <>
          <h2 class="group-title">{g.label}</h2>
          <div class="tool-grid">
            {g.items.map((t) => (
              <a class="tool-card" href={`/generadores/${t.slug}/`}>
                <span class="tc-eyebrow">{TIPO_LABEL[t.tipo] ?? t.tipo}</span>
                <h3 class="tc-title serif">{t.title}</h3>
                <p class="tc-desc">{t.descripcion}</p>
                <span class="tc-cta">Abrir →</span>
              </a>
            ))}
          </div>
        </>
      ))}

      <p class="note">
        Los generadores LOMLOE viven en
        <a href="https://oposicioneseconomia.es" class="editorial-link" rel="external noopener" target="_blank">oposicioneseconomia.es</a>,
        donde los mantenemos. El resto son herramientas que hemos montado aquí, por si os sirven.
      </p>
    </div>
  </section>
</BaseLayout>

<style>
  .container { max-width: 1240px; margin: 0 auto; padding: 0 clamp(1.5rem, 4vw, 3rem); }
  .breadcrumb { font-size: 0.92rem; color: var(--color-ink-mute); margin: 2rem 0; }
  .breadcrumb a { color: var(--color-ink-mute); text-decoration: none; }
  .breadcrumb a:hover { color: var(--color-terra); }
  .breadcrumb .sep { margin: 0 0.5em; color: var(--color-mustard); }
  .hero { padding: 1rem 0 clamp(1.5rem, 4vw, 2.5rem); }
  h1 { max-width: 22ch; margin: 1rem 0 0.6rem; }
  .kicker { font-family: var(--font-sans); font-size: 0.8rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-terra); }
  .accent { color: var(--color-terra); }
  .lede { font-family: var(--font-serif); font-style: italic; font-size: 1.3rem; color: var(--color-ink-soft); max-width: 58ch; margin: 1.2rem 0; line-height: 1.5; font-variation-settings: "SOFT" 80; }
  .tools { padding: 0 0 clamp(3rem, 7vw, 6rem); }
  .group-title { font-family: var(--font-serif); font-size: 1.5rem; font-weight: 500; margin: 1.5rem 0 1rem; }
  .tool-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem; }
  .tool-card { display: block; background: #fff; border: 1px solid var(--color-line); border-top: 3px solid var(--color-eco1, #1F6E6E); padding: 1.6rem 1.75rem 1.4rem; text-decoration: none; color: inherit; transition: box-shadow 0.18s ease, border-color 0.18s ease, transform 0.18s ease; }
  .tool-card:hover { box-shadow: 0 4px 18px rgba(42, 31, 24, 0.08); border-top-color: var(--color-terra); transform: translateY(-2px); }
  .tc-eyebrow { font-size: 0.78rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-eco1, #1F6E6E); font-weight: 600; }
  .tc-title { font-size: 1.5rem; line-height: 1.1; margin: 0.5rem 0 0.75rem; font-variation-settings: "SOFT" 80; }
  .tc-desc { color: var(--color-ink-soft); font-size: 1rem; line-height: 1.6; margin: 0 0 1rem; }
  .tc-cta { font-size: 0.9rem; font-weight: 600; color: var(--color-terra); }
  .note { font-family: var(--font-serif); font-style: italic; color: var(--color-ink-soft); max-width: 60ch; font-size: 1.05rem; line-height: 1.55; font-variation-settings: "SOFT" 80; }
</style>
```

- [ ] **Step 4: Update the menu description** in `src/lib/asignaturas.ts` — the `generadores` entry: change `description` to `'Generadores LOMLOE y herramientas de evaluación y aula.'`. (Leave label «Generadores».)

- [ ] **Step 5: Tests + type-check + build**

Run: `npx vitest run src/lib/generadores.test.ts src/lib/calc/calificaciones.test.ts`
Expected: pass.
Run: `npx astro check` — no new errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/generadores/GeneradorIsland.astro "src/pages/generadores/[slug].astro" src/pages/generadores/index.astro src/lib/asignaturas.ts
git commit -m "feat(generadores): dispatcher, detail page, landing rework and menu copy"
```

---

## Task 6: Full build, smoke, PR + merge

- [ ] **Step 1: Full build** — `npx astro build`; expected `Complete!`. The 6 `/generadores/{slug}/` pages + the reworked landing prerender; islands bundle. Fix and re-run until green.

- [ ] **Step 2: Dev smoke** — `/generadores/` (external cards + native grids), `/generadores/rubricas/` (add criterio/nivel, type, reload persists, Exportar PDF, Imprimir shows only the table), `/generadores/calificaciones/` (weighted mean + pesos≠100 warning + rúbrica→nota), one template page. Stop dev.

- [ ] **Step 3: Push + PR to `dev`** — `git push -u origin feat/generadores-docentes`; controller opens the PR.

- [ ] **Step 4: Merge** per controller (Vercel green first), then the `dev → main` release.

---

## Self-review notes (for the implementer)

- **Teacher tools are NOT in the student `HERRAMIENTAS` registry / `HerramientaIsland`** — they live in `generadores.ts` / `GeneradorIsland`. Keep the sections separate.
- **Reuse `usePersistentState` + `exportarNodo`** — do not re-implement localStorage or export.
- **No `Date.now()`/`Math.random()` in INITIAL/persisted default state**; generating ids inside event handlers (browser-only) is fine.
- **Export degrades to print** (try/catch around `exportarNodo`).
- **No new colors; no pictographic emojis** (especially in the autoevaluación scale — use text/numbers). Accents correct.
- **Landing keeps the external links live** (oposicioneseconomia.es/programacion); the dead «Pruebas» card is gone.
