# Materiales descargables de los debates — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate, for each of the 18 transversal debates, a single real PDF "Materiales para el aula" (teacher guide + scoring sheet + posture/role cut-out cards + student prep sheet), all derived from existing frontmatter + MDX body.

**Architecture:** Four pure Astro material components → a standalone print page per debate (`/debates/[familia]/[slug]/imprimir`) → a `pagedjs-cli` build script that emits one PDF per debate into `public/downloads`. The debate detail page links to the pre-generated PDF. Mirrors the proven `build-cuaderno-pdf.mjs` + emprendimiento print-route patterns. Single source of truth: the prep sheet moves from authored MDX into a component shown on both web and PDF.

**Tech Stack:** Astro 5 content collections + `render()`, pagedjs-cli, Node ESM build scripts, Vitest for the pure helpers.

---

## File Structure

- `src/lib/debates.ts` — add pure `debatePdfName(familia, slug)` (download filename convention). Imported by the detail page.
- `src/lib/debates.test.ts` — unit test for `debatePdfName`.
- `scripts/lib/debate-pdf-jobs.mjs` — pure `parseDebatePrintPath(relPath)` + dir-walking `findDebatePrintJobs(distDir)` for the build script.
- `scripts/lib/debate-pdf-jobs.test.mjs` — unit test for `parseDebatePrintPath`.
- `src/components/debates/materiales/FichaPreparacion.astro` — student prep sheet (from `mocion`).
- `src/components/debates/materiales/HojaEvaluacion.astro` — rubric → scoring table (from `rubrica`).
- `src/components/debates/materiales/TarjetasPostura.astro` — posture + (conditional) moderator cut-out cards.
- `src/components/debates/materiales/GuiaProfesor.astro` — teacher-guide header + `<slot/>` for the MDX body.
- `src/pages/debates/[familia]/[slug]/imprimir.astro` — standalone print document composing the four materials.
- `scripts/build-debates-pdf.mjs` — build one PDF per debate.
- `package.json` — add `build:debates`; include it in `build:all`.
- `src/pages/debates/[familia]/[slug].astro` — replace print button with a "Descargar materiales (PDF)" link; render `<FichaPreparacion>` on the web.
- The 18 `src/content/debates/**/*.mdx` — remove the authored `<FichaAlumno>` block + unused import.

---

## Task 1: Pure download-filename helper

**Files:**
- Modify: `src/lib/debates.ts`
- Test: `src/lib/debates.test.ts` (create)

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/debates.test.ts
import { describe, it, expect } from 'vitest';
import { debatePdfName } from './debates';

describe('debatePdfName', () => {
  it('builds the canonical downloads filename from familia + slug', () => {
    expect(debatePdfName('dinero-tecnologia-futuro', '01-criptomonedas'))
      .toBe('debate-dinero-tecnologia-futuro-01-criptomonedas.pdf');
  });

  it('does not double-prefix or alter the segments', () => {
    expect(debatePdfName('mercado-estado', '03-salario-minimo'))
      .toBe('debate-mercado-estado-03-salario-minimo.pdf');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/debates.test.ts`
Expected: FAIL — `debatePdfName` is not exported.

- [ ] **Step 3: Add the implementation**

Append to `src/lib/debates.ts`:

```ts
/**
 * Canonical filename for a debate's pre-generated material pack PDF, served
 * from /downloads/. Must match the name produced by scripts/build-debates-pdf.mjs.
 */
export function debatePdfName(familia: string, slug: string): string {
  return `debate-${familia}-${slug}.pdf`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/debates.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/debates.ts src/lib/debates.test.ts
git commit -m "feat(debates): add debatePdfName download-filename helper"
```

---

## Task 2: Build-script job discovery (pure parse + dir walk)

**Files:**
- Create: `scripts/lib/debate-pdf-jobs.mjs`
- Test: `scripts/lib/debate-pdf-jobs.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
// scripts/lib/debate-pdf-jobs.test.mjs
import { describe, it, expect } from 'vitest';
import { parseDebatePrintPath } from './debate-pdf-jobs.mjs';

describe('parseDebatePrintPath', () => {
  it('extracts familia/slug and builds route + out name from a dist html path', () => {
    const rel = 'debates/dinero-tecnologia-futuro/01-criptomonedas/imprimir/index.html';
    expect(parseDebatePrintPath(rel)).toEqual({
      familia: 'dinero-tecnologia-futuro',
      slug: '01-criptomonedas',
      route: 'debates/dinero-tecnologia-futuro/01-criptomonedas/imprimir',
      out: 'debate-dinero-tecnologia-futuro-01-criptomonedas.pdf',
    });
  });

  it('returns null for non-debate or non-imprimir paths', () => {
    expect(parseDebatePrintPath('debates/mercado-estado/01-x/index.html')).toBeNull();
    expect(parseDebatePrintPath('juegos/econopoly/imprimir/index.html')).toBeNull();
  });

  it('normalizes Windows backslashes', () => {
    const rel = 'debates\\mercado-estado\\02-salario\\imprimir\\index.html';
    expect(parseDebatePrintPath(rel)?.slug).toBe('02-salario');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run scripts/lib/debate-pdf-jobs.test.mjs`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the module**

```js
// scripts/lib/debate-pdf-jobs.mjs
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Parse a dist-relative HTML path for a debate print route. Returns the
 * familia/slug, the (slash-joined) route path and the output PDF filename,
 * or null when the path is not a debate `.../imprimir/index.html`.
 */
export function parseDebatePrintPath(relPath) {
  const parts = relPath.replace(/\\/g, '/').split('/');
  // expected: debates / <familia> / <slug> / imprimir / index.html
  if (parts.length !== 5) return null;
  const [root, familia, slug, leaf, file] = parts;
  if (root !== 'debates' || leaf !== 'imprimir' || file !== 'index.html') return null;
  return {
    familia,
    slug,
    route: `debates/${familia}/${slug}/imprimir`,
    out: `debate-${familia}-${slug}.pdf`,
  };
}

/**
 * Walk distDir/debates and return one job per debate print route. Each job is
 * the object returned by parseDebatePrintPath, sorted by route for determinism.
 */
export function findDebatePrintJobs(distDir) {
  const base = join(distDir, 'debates');
  const jobs = [];
  const walk = (absDir, relDir) => {
    let entries;
    try { entries = readdirSync(absDir); } catch { return; }
    for (const name of entries) {
      const abs = join(absDir, name);
      const rel = relDir ? `${relDir}/${name}` : name;
      if (statSync(abs).isDirectory()) { walk(abs, rel); continue; }
      if (name !== 'index.html') continue;
      const job = parseDebatePrintPath(`debates/${rel}`);
      if (job) jobs.push(job);
    }
  };
  walk(base, '');
  return jobs.sort((a, b) => a.route.localeCompare(b.route));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run scripts/lib/debate-pdf-jobs.test.mjs`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/debate-pdf-jobs.mjs scripts/lib/debate-pdf-jobs.test.mjs
git commit -m "feat(debates): add pdf-job discovery for the build script"
```

---

## Task 3: FichaPreparacion component (student prep sheet)

**Files:**
- Create: `src/components/debates/materiales/FichaPreparacion.astro`

- [ ] **Step 1: Create the component**

```astro
---
/**
 * Uniform student prep sheet for any debate, derived from the motion. Shown
 * on the web detail page and as one A4 page in the material-pack PDF.
 * Replaces the per-debate authored <FichaAlumno> block (single source).
 */
interface Props { mocion: string; }
const { mocion } = Astro.props;
const lineas = (n: number) => Array.from({ length: n });
---
<section class="ficha print-block">
  <header class="ficha__head">
    <span class="ficha__tag">Ficha del alumno · antes del debate</span>
    <h2 class="ficha__title">Preparo mi postura</h2>
  </header>

  <p class="ficha__mocion"><strong>Moción:</strong> {mocion}</p>

  <div class="ficha__field"><span>Mi postura</span><span class="line"></span></div>

  <p class="ficha__q">Mis 3 argumentos (con una evidencia o ejemplo concreto en cada uno):</p>
  {[1, 2, 3].map((n) => (
    <div class="arg">
      <div class="ficha__field"><span>{n}. Argumento</span><span class="line"></span></div>
      <div class="ficha__field ficha__field--sub"><span>Evidencia</span><span class="line"></span></div>
    </div>
  ))}

  <p class="ficha__q">Una pregunta que le haré al grupo rival:</p>
  {lineas(2).map(() => <span class="line line--full"></span>)}

  <p class="ficha__q">Un argumento del otro grupo que tendré que refutar:</p>
  {lineas(2).map(() => <span class="line line--full"></span>)}

  <p class="ficha__q">Notas durante el debate:</p>
  {lineas(3).map(() => <span class="line line--full"></span>)}
</section>
<style>
  .ficha { border: 1.5px solid var(--color-line); border-radius: 8px; padding: 1.2rem 1.4rem; margin: 1rem 0; background: var(--color-paper); }
  .ficha__head { margin-bottom: 0.8rem; }
  .ficha__tag { font-family: var(--font-sans); font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-mustard-deep); }
  .ficha__title { font-family: var(--font-serif); font-size: 1.35rem; margin: 0.2rem 0 0; font-weight: 500; }
  .ficha__mocion { font-family: var(--font-serif); font-style: italic; color: var(--color-ink-soft); border-left: 3px solid var(--color-terra); padding-left: 0.8rem; margin: 0.6rem 0 1rem; }
  .ficha__q { font-weight: 600; margin: 1rem 0 0.4rem; }
  .ficha__field { display: flex; align-items: baseline; gap: 0.6rem; margin: 0.4rem 0; }
  .ficha__field > span:first-child { font-size: 0.85rem; color: var(--color-ink-mute); white-space: nowrap; }
  .ficha__field--sub { padding-left: 1rem; }
  .arg { margin-bottom: 0.5rem; }
  .line { flex: 1; border-bottom: 1px solid var(--color-line); height: 1.4rem; }
  .line--full { display: block; border-bottom: 1px solid var(--color-line); height: 1.7rem; margin: 0.3rem 0; }
</style>
```

- [ ] **Step 2: Type-check**

Run: `npx astro check --minimumSeverity error 2>&1 | grep FichaPreparacion`
Expected: no output (no errors in this file).

- [ ] **Step 3: Commit**

```bash
git add src/components/debates/materiales/FichaPreparacion.astro
git commit -m "feat(debates): add FichaPreparacion student prep-sheet component"
```

---

## Task 4: HojaEvaluacion component (rubric → scoring table)

**Files:**
- Create: `src/components/debates/materiales/HojaEvaluacion.astro`

- [ ] **Step 1: Create the component**

```astro
---
/**
 * Printable scoring sheet: the debate's rubric turned into a 4-level grid
 * (1 Inicio / 2 En proceso / 3 Bien / 4 Excelente). One A4 page, to photocopy
 * per group or student. Levels are generic (the rubric schema stores no
 * per-level descriptors).
 */
interface Criterio { criterio: string; descripcion: string; competencia?: string; }
interface Props { rubrica: Criterio[]; title: string; }
const { rubrica, title } = Astro.props;
const niveles = ['1 Inicio', '2 En proceso', '3 Bien', '4 Excelente'];
---
<section class="hoja print-block">
  <header class="hoja__head">
    <span class="hoja__tag">Hoja de evaluación</span>
    <h2 class="hoja__title">{title}</h2>
    <div class="hoja__meta">
      <span>Grupo / alumno: <span class="line"></span></span>
      <span>Fecha: <span class="line line--sm"></span></span>
    </div>
  </header>

  <table class="hoja__table">
    <thead>
      <tr>
        <th class="c-crit">Criterio</th>
        {niveles.map((n) => <th class="c-niv">{n}</th>)}
      </tr>
    </thead>
    <tbody>
      {rubrica.map((r) => (
        <tr>
          <td class="c-crit">
            <strong>{r.criterio}</strong>
            <span class="desc">{r.descripcion}</span>
            {r.competencia && <span class="comp">{r.competencia}</span>}
          </td>
          {niveles.map(() => <td class="c-niv"><span class="box" aria-hidden="true"></span></td>)}
        </tr>
      ))}
    </tbody>
  </table>

  <p class="hoja__obs"><strong>Observaciones:</strong></p>
  <span class="line line--full"></span>
  <span class="line line--full"></span>
</section>
<style>
  .hoja { margin: 1rem 0; }
  .hoja__tag { font-family: var(--font-sans); font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-mustard-deep); }
  .hoja__title { font-family: var(--font-serif); font-size: 1.3rem; margin: 0.2rem 0 0.6rem; font-weight: 500; }
  .hoja__meta { display: flex; gap: 1.5rem; font-size: 0.85rem; color: var(--color-ink-mute); margin-bottom: 0.9rem; }
  .hoja__meta span { display: inline-flex; align-items: baseline; gap: 0.4rem; }
  .hoja__meta .line { display: inline-block; width: 14rem; border-bottom: 1px solid var(--color-line); height: 1rem; }
  .hoja__meta .line--sm { width: 7rem; }
  .hoja__table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
  .hoja__table th, .hoja__table td { border: 1px solid var(--color-line); padding: 0.5em 0.6em; vertical-align: top; }
  .hoja__table th { font-family: var(--font-sans); font-size: 0.7rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: var(--color-ink-mute); background: var(--color-mustard-soft); }
  .c-niv { width: 4.5rem; text-align: center; }
  .desc { display: block; color: var(--color-ink-soft); font-weight: 400; margin-top: 0.2rem; }
  .comp { display: inline-block; margin-top: 0.3rem; font-family: var(--font-mono); font-size: 0.72rem; color: var(--color-terra-deep); }
  .box { display: inline-block; width: 1rem; height: 1rem; border: 1.5px solid var(--color-ink-mute); border-radius: 3px; }
  .hoja__obs { margin: 1rem 0 0.3rem; }
  .line--full { display: block; border-bottom: 1px solid var(--color-line); height: 1.7rem; margin: 0.3rem 0; }
</style>
```

- [ ] **Step 2: Type-check**

Run: `npx astro check --minimumSeverity error 2>&1 | grep HojaEvaluacion`
Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/components/debates/materiales/HojaEvaluacion.astro
git commit -m "feat(debates): add HojaEvaluacion scoring-sheet component"
```

---

## Task 5: TarjetasPostura component (cut-out cards)

**Files:**
- Create: `src/components/debates/materiales/TarjetasPostura.astro`

- [ ] **Step 1: Create the component**

```astro
---
/**
 * Cut-out cards handed to each group: one per postura (label + síntesis) plus,
 * for moderated formats, a moderador/observador card. One A4 page.
 */
interface Postura { id: string; label: string; sintesis: string; }
interface Props { posturas: Postura[]; formato: string; mocion: string; }
const { posturas, formato, mocion } = Astro.props;
const conModerador = ['mesa-redonda', 'fishbowl', 'juicio-simulado'].includes(formato);
---
<section class="tarjetas print-block">
  <header class="tarjetas__head">
    <span class="tarjetas__tag">Tarjetas de postura · recortables</span>
    <h2 class="tarjetas__title">Reparto de posturas</h2>
    <p class="tarjetas__mocion">{mocion}</p>
  </header>

  <div class="tarjetas__grid">
    {posturas.map((p) => (
      <article class="tarjeta">
        <span class="tarjeta__kicker">Defendéis esta postura</span>
        <h3 class="tarjeta__label">{p.label}</h3>
        <p class="tarjeta__sintesis">{p.sintesis}</p>
        <span class="tarjeta__cut" aria-hidden="true">✂ recorta por aquí</span>
      </article>
    ))}

    {conModerador && (
      <article class="tarjeta tarjeta--mod">
        <span class="tarjeta__kicker">Equipo de moderación</span>
        <h3 class="tarjeta__label">Moderación y observación</h3>
        <p class="tarjeta__sintesis">
          Dais y quitáis turnos, controláis los tiempos de cada fase y anotáis qué
          argumentos quedan sin respuesta. No defendéis ninguna postura: vuestra tarea
          es que el debate sea limpio y ordenado.
        </p>
        <span class="tarjeta__cut" aria-hidden="true">✂ recorta por aquí</span>
      </article>
    )}
  </div>
</section>
<style>
  .tarjetas { margin: 1rem 0; }
  .tarjetas__tag { font-family: var(--font-sans); font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-terra); }
  .tarjetas__title { font-family: var(--font-serif); font-size: 1.3rem; margin: 0.2rem 0 0.3rem; font-weight: 500; }
  .tarjetas__mocion { font-family: var(--font-serif); font-style: italic; color: var(--color-ink-soft); margin: 0 0 1rem; }
  .tarjetas__grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
  .tarjeta { border: 1.5px dashed var(--color-line); border-radius: 8px; padding: 1.1rem 1.3rem; background: var(--color-paper); break-inside: avoid; }
  .tarjeta--mod { border-style: solid; border-color: var(--color-mustard); }
  .tarjeta__kicker { font-family: var(--font-sans); font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-ink-mute); }
  .tarjeta__label { font-family: var(--font-serif); font-size: 1.25rem; margin: 0.2rem 0 0.5rem; font-weight: 500; }
  .tarjeta__sintesis { font-size: 0.95rem; line-height: 1.55; color: var(--color-ink-soft); margin: 0; }
  .tarjeta__cut { display: block; margin-top: 0.8rem; font-family: var(--font-mono); font-size: 0.7rem; color: var(--color-ink-mute); }
</style>
```

- [ ] **Step 2: Type-check**

Run: `npx astro check --minimumSeverity error 2>&1 | grep TarjetasPostura`
Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/components/debates/materiales/TarjetasPostura.astro
git commit -m "feat(debates): add TarjetasPostura cut-out cards component"
```

---

## Task 6: GuiaProfesor component (header + slot)

**Files:**
- Create: `src/components/debates/materiales/GuiaProfesor.astro`

- [ ] **Step 1: Create the component**

```astro
---
/**
 * Teacher-guide header for the material pack: motion, format/duration/grouping,
 * objectives, key concepts and the cross-curriculum map, derived from
 * frontmatter. The MDX body (de qué va + argumentario + fases) is passed via
 * the default <slot/>.
 */
import { ASIGNATURAS } from '@/lib/asignaturas';

interface Unidad { asignatura: string; unidad: number; nota?: string; }
interface Props {
  title: string;
  mocion: string;
  formato: string;
  duracion: string;
  agrupacion: string;
  objetivos: string[];
  conceptos: string[];
  unidades: Unidad[];
  competencias: string[];
}
const { title, mocion, formato, duracion, agrupacion, objetivos, conceptos, unidades, competencias } = Astro.props;
const asigLabel = (slug: string) => ASIGNATURAS[slug]?.shortLabel ?? slug;
---
<section class="guia print-block">
  <span class="guia__tag">Guía del profesor</span>
  <h2 class="guia__title">{title}</h2>
  <p class="guia__mocion">{mocion}</p>

  <dl class="guia__meta">
    <div><dt>Formato</dt><dd>{formato}</dd></div>
    <div><dt>Duración</dt><dd>{duracion}</dd></div>
    <div><dt>Agrupación</dt><dd>{agrupacion}</dd></div>
  </dl>

  {objetivos.length > 0 && (
    <div class="guia__block">
      <h3>Objetivos</h3>
      <ul>{objetivos.map((o) => <li>{o}</li>)}</ul>
    </div>
  )}

  {conceptos.length > 0 && (
    <p class="guia__conceptos"><strong>Conceptos clave:</strong> {conceptos.join(' · ')}</p>
  )}

  {unidades.length > 0 && (
    <div class="guia__block">
      <h3>Encaje curricular</h3>
      <ul>
        {unidades.map((u) => (
          <li><strong>{asigLabel(u.asignatura)} · U{u.unidad}</strong>{u.nota ? ` — ${u.nota}` : ''}</li>
        ))}
      </ul>
    </div>
  )}

  {competencias.length > 0 && (
    <p class="guia__conceptos"><strong>Competencias clave:</strong> {competencias.join(' · ')}</p>
  )}

  <hr class="guia__rule" />
  <slot />
</section>
<style>
  .guia { margin: 0 0 1rem; }
  .guia__tag { font-family: var(--font-sans); font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-mustard-deep); }
  .guia__title { font-family: var(--font-serif); font-size: 1.5rem; margin: 0.2rem 0 0.3rem; font-weight: 500; }
  .guia__mocion { font-family: var(--font-serif); font-style: italic; font-size: 1.1rem; color: var(--color-ink); border-left: 4px solid var(--color-terra); padding-left: 0.9rem; margin: 0.4rem 0 1rem; }
  .guia__meta { display: flex; flex-wrap: wrap; gap: 1.4rem; margin: 0 0 1rem; padding: 0; }
  .guia__meta dt { font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.07em; color: var(--color-ink-mute); font-weight: 700; }
  .guia__meta dd { margin: 0.1rem 0 0; font-size: 0.95rem; }
  .guia__block { margin: 0.8rem 0; }
  .guia__block h3 { font-family: var(--font-serif); font-size: 1.1rem; margin: 0 0 0.3rem; font-weight: 500; }
  .guia__block ul { padding-left: 1.2rem; margin: 0; }
  .guia__block li { margin-bottom: 0.25rem; font-size: 0.95rem; }
  .guia__conceptos { font-size: 0.9rem; color: var(--color-ink-soft); margin: 0.5rem 0; }
  .guia__rule { border: none; border-top: 2px solid var(--color-mustard); margin: 1.2rem 0; }
</style>
```

- [ ] **Step 2: Type-check**

Run: `npx astro check --minimumSeverity error 2>&1 | grep GuiaProfesor`
Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/components/debates/materiales/GuiaProfesor.astro
git commit -m "feat(debates): add GuiaProfesor guide-header component"
```

---

## Task 7: Print route — standalone material-pack document

**Files:**
- Create: `src/pages/debates/[familia]/[slug]/imprimir.astro`

Note: this coexists with the existing `src/pages/debates/[familia]/[slug].astro` (detail page). The standalone `<html>` shell (fonts, `:root` tokens, `@page A4`, print CSS) mirrors `emprendimiento/proyecto/cuaderno/imprimir/[modo].astro`.

- [ ] **Step 1: Create the route**

```astro
---
/**
 * Print-ready material pack for one debate. Consumed by pagedjs-cli
 * (scripts/build-debates-pdf.mjs) to produce debate-{familia}-{slug}.pdf.
 * Composes: teacher guide (header + MDX body), scoring sheet, posture cards,
 * student prep sheet. noindex.
 */
import GuiaProfesor from '@components/debates/materiales/GuiaProfesor.astro';
import HojaEvaluacion from '@components/debates/materiales/HojaEvaluacion.astro';
import TarjetasPostura from '@components/debates/materiales/TarjetasPostura.astro';
import FichaPreparacion from '@components/debates/materiales/FichaPreparacion.astro';
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
---
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="robots" content="noindex" />
    <title>{d.title} — Materiales para el aula</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..700,0..100,0..1;1,9..144,300..700,0..100,0..1&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" />
    <style is:inline>
      @font-face { font-family: 'Switzer'; src: url('/fonts/switzer/switzer-400.woff2') format('woff2'); font-weight: 400; font-display: swap; }
      @font-face { font-family: 'Switzer'; src: url('/fonts/switzer/switzer-500.woff2') format('woff2'); font-weight: 500; font-display: swap; }
      @font-face { font-family: 'Switzer'; src: url('/fonts/switzer/switzer-600.woff2') format('woff2'); font-weight: 600; font-display: swap; }
      @font-face { font-family: 'Switzer'; src: url('/fonts/switzer/switzer-700.woff2') format('woff2'); font-weight: 700; font-display: swap; }
      :root {
        --color-bg: #FBF6EC; --color-bg-cream: #F5EDD9; --color-paper: #FFFFFF;
        --color-ink: #2A1F18; --color-ink-soft: #5C4A3D; --color-ink-mute: #806C5A;
        --color-line: #E5D4BD; --color-line-soft: #EFE2CB;
        --color-mustard: #D4A24C; --color-mustard-deep: #A87A2A; --color-mustard-soft: #F5E5BC;
        --color-terra: #C44E2C; --color-terra-deep: #9C3A1C;
        --font-serif: "Fraunces", Georgia, serif;
        --font-sans: "Switzer", -apple-system, sans-serif;
        --font-mono: "JetBrains Mono", monospace;
      }
      @page { size: A4; margin: 16mm 15mm; }
      * { box-sizing: border-box; }
      body { margin: 0; font-family: var(--font-sans); color: var(--color-ink); font-size: 10.5pt; line-height: 1.5; background: #fff; }
      .print-block { break-before: page; }
      .print-block:first-child { break-before: auto; }
      .pack-cover { break-after: page; padding-top: 4rem; }
      .pack-cover__eyebrow { color: var(--color-mustard-deep); font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; font-size: 10pt; }
      .pack-cover__title { font-family: var(--font-serif); font-size: 30pt; line-height: 1.05; margin: 0.5rem 0; }
      .pack-cover__sub { font-style: italic; font-family: var(--font-serif); color: var(--color-ink-soft); font-size: 13pt; }
      .pack-cover__index { margin-top: 2rem; font-size: 0.95rem; color: var(--color-ink-soft); }
      .pack-cover__index li { margin-bottom: 0.3rem; }
      /* Tame the web prose styles of the MDX body inside the guide */
      .guia :global(h2) { font-family: var(--font-serif); font-size: 1.25rem; margin: 1.2em 0 0.4em; font-weight: 500; }
      .guia :global(h3) { font-family: var(--font-serif); font-size: 1.05rem; margin: 1em 0 0.3em; font-weight: 500; }
      .guia :global(p) { margin: 0 0 0.7em; }
      .guia :global(ul) { padding-left: 1.3rem; }
    </style>
  </head>
  <body>
    <section class="pack-cover">
      <div class="pack-cover__eyebrow">Debate · Materiales para el aula</div>
      <h1 class="pack-cover__title">{d.title}</h1>
      <p class="pack-cover__sub">{d.descripcion}</p>
      <ol class="pack-cover__index">
        <li>Guía del profesor (moción, cronograma y argumentario)</li>
        <li>Hoja de evaluación</li>
        <li>Tarjetas de postura (recortables)</li>
        <li>Ficha de preparación del alumno (fotocopiar)</li>
      </ol>
    </section>

    <GuiaProfesor
      title={d.title}
      mocion={d.mocion}
      formato={d.formato}
      duracion={d.duracion}
      agrupacion={d.agrupacion}
      objetivos={d.objetivos}
      conceptos={d.conceptos_clave}
      unidades={d.unidades_relacionadas}
      competencias={d.competencias_clave}
    >
      <Content />
    </GuiaProfesor>

    <HojaEvaluacion rubrica={d.rubrica} title={d.title} />
    <TarjetasPostura posturas={d.posturas} formato={d.formato} mocion={d.mocion} />
    <FichaPreparacion mocion={d.mocion} />
  </body>
</html>
```

- [ ] **Step 2: Verify the route builds and renders**

Run: `npm run build 2>&1 | tail -5`
Expected: build succeeds. Confirm a file exists, e.g.:
`Test-Path "dist/client/debates/dinero-tecnologia-futuro/01-criptomonedas/imprimir/index.html"` → `True`
(If `dist/client` doesn't exist, check `dist/`.)

- [ ] **Step 3: Commit**

```bash
git add "src/pages/debates/[familia]/[slug]/imprimir.astro"
git commit -m "feat(debates): add standalone material-pack print route"
```

---

## Task 8: Build script + package.json wiring

**Files:**
- Create: `scripts/build-debates-pdf.mjs`
- Modify: `package.json`

- [ ] **Step 1: Create the build script**

Adapted from `scripts/build-cuaderno-pdf.mjs` — same static server + Chrome detection + pagedjs invocation; jobs come from `findDebatePrintJobs`.

```js
#!/usr/bin/env node
/**
 * Build one "Materiales para el aula" PDF per published transversal debate from
 * the static build, using the same HTTP-server + pagedjs pattern as
 * build-cuaderno-pdf. Writes debate-{familia}-{slug}.pdf into public/downloads.
 *
 * Usage:
 *   node scripts/build-debates-pdf.mjs            # copy to public/downloads/
 *   node scripts/build-debates-pdf.mjs --in-dist  # only write to dist/downloads/
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, copyFileSync, statSync, readFileSync } from 'node:fs';
import { resolve, dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { platform } from 'node:os';
import { createServer } from 'node:http';
import { findDebatePrintJobs } from './lib/debate-pdf-jobs.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const PORT = 4338;

const args = new Set(process.argv.slice(2));
const inDistOnly = args.has('--in-dist');

function findChromeExecutable() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH && existsSync(process.env.PUPPETEER_EXECUTABLE_PATH)) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }
  const candidates = platform() === 'win32'
    ? ['C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
       'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
       `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`]
    : platform() === 'darwin'
    ? ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome']
    : ['/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium-browser', '/usr/bin/chromium'];
  for (const c of candidates) { if (c && existsSync(c)) return c; }
  return null;
}

const chromePath = findChromeExecutable();
if (chromePath) { process.env.PUPPETEER_EXECUTABLE_PATH = chromePath; console.log(`Usando Chrome del sistema: ${chromePath}`); }

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.woff2': 'font/woff2', '.woff': 'font/woff',
  '.ttf': 'font/ttf', '.otf': 'font/otf', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8',
};

function startStaticServer(distDir, port) {
  const server = createServer((req, res) => {
    try {
      const url = decodeURIComponent(req.url.split('?')[0]);
      let filePath = join(distDir, url);
      if (existsSync(filePath) && statSync(filePath).isDirectory()) filePath = join(filePath, 'index.html');
      if (!existsSync(filePath)) { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end(`404 Not Found: ${url}`); return; }
      const ext = extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME[ext] ?? 'application/octet-stream', 'Cache-Control': 'no-cache' });
      res.end(readFileSync(filePath));
    } catch (err) { res.writeHead(500, { 'Content-Type': 'text/plain' }); res.end(`500: ${err.message}`); }
  });
  return new Promise((resolveSrv, rejectSrv) => { server.listen(port, '0.0.0.0', () => resolveSrv(server)); server.on('error', rejectSrv); });
}

let distDir = resolve(root, 'dist/client');
if (!existsSync(distDir)) distDir = resolve(root, 'dist');
if (!existsSync(distDir)) { console.error('✖ No existe dist/ ni dist/client/. Corre "npm run build" antes.'); process.exit(1); }

const jobs = findDebatePrintJobs(distDir);
if (jobs.length === 0) { console.error('✖ No se encontraron rutas de impresión de debates en dist/.'); process.exit(1); }
console.log(`\nDebates encontrados: ${jobs.length}`);

console.log(`Iniciando servidor estático en http://localhost:${PORT}`);
const server = await startStaticServer(distDir, PORT);

const publicDownloads = resolve(root, 'public/downloads');
const distDownloads = resolve(root, 'dist/downloads');
mkdirSync(publicDownloads, { recursive: true });
mkdirSync(distDownloads, { recursive: true });

for (const job of jobs) {
  const url = `http://localhost:${PORT}/${job.route}/`;
  try {
    const probe = await fetch(url);
    if (!probe.ok) { console.error(`✖ El servidor no sirve ${url} (status ${probe.status}).`); server.close(); process.exit(1); }
  } catch (e) { console.error(`✖ No se puede conectar a ${url}: ${e.message}`); server.close(); process.exit(1); }

  const outDist = resolve(distDownloads, job.out);
  const outPublic = resolve(publicDownloads, job.out);
  console.log(`\n— Generando ${job.out}`);
  const exitCode = await new Promise((resolveExit) => {
    const child = spawn('npx',
      ['--no-install', 'pagedjs-cli', url, '-o', outDist, '-t', '120000', '--browserArgs', '--no-sandbox'],
      { cwd: root, stdio: 'inherit', shell: true, env: { ...process.env, PUPPETEER_EXECUTABLE_PATH: chromePath ?? '' } });
    child.on('close', (code) => resolveExit(code));
    child.on('error', (err) => { console.error(`✖ Error lanzando pagedjs-cli: ${err.message}`); resolveExit(1); });
  });
  if (exitCode !== 0) { server.close(); console.error(`✖ pagedjs-cli falló (código ${exitCode})`); process.exit(1); }
  if (!inDistOnly) { copyFileSync(outDist, outPublic); console.log(`  Copiado a ${outPublic}`); }
}

server.close();
console.log(`\n✓ ${jobs.length} packs de debate listos.`);
```

- [ ] **Step 2: Wire package.json**

In `package.json` `scripts`, add after the `build:cuaderno` line:

```json
    "build:debates": "node scripts/build-debates-pdf.mjs",
```

And extend `build:all` to include it (append before `&& npm run build:decks`):

```
... && npm run build:cuaderno && npm run build:debates && npm run build:decks",
```

- [ ] **Step 3: Run the build script against the existing dist**

Run: `npm run build:debates 2>&1 | tail -15`
Expected: "Debates encontrados: 18" then one "Generando debate-…pdf" per debate, ending "✓ 18 packs de debate listos." Confirm `Test-Path public/downloads/debate-dinero-tecnologia-futuro-01-criptomonedas.pdf` → `True`.

- [ ] **Step 4: Commit**

```bash
git add scripts/build-debates-pdf.mjs package.json
git commit -m "feat(debates): build one material-pack PDF per debate"
```

---

## Task 9: Wire the download link + prep sheet on the detail page

**Files:**
- Modify: `src/pages/debates/[familia]/[slug].astro`

- [ ] **Step 1: Replace the print button with a download link and add the prep sheet**

Add to the imports (top frontmatter):

```ts
import FichaPreparacion from '@components/debates/materiales/FichaPreparacion.astro';
import { familiaMeta, debatePdfName } from '@/lib/debates';
```

(Remove the now-unused `PrintButton` import.)

In the frontmatter, after `const familia = familiaMeta(d.familia);`, add:

```ts
const pdfHref = `/downloads/${debatePdfName(d.familia, Astro.params.slug!)}`;
```

Replace the print bar:

```astro
      <div class="print-bar no-print"><PrintButton /></div>
```

with:

```astro
      <div class="print-bar no-print">
        <a class="download-cta" href={pdfHref} download>
          <span class="download-cta__icon" aria-hidden="true">↓</span>
          <span class="download-cta__text">
            <strong>Descargar materiales del debate (PDF)</strong>
            <span class="muted">Guía del profesor · hoja de evaluación · tarjetas · ficha del alumno</span>
          </span>
        </a>
      </div>
```

After the closing `</article>` of `.prose` (and before the `<div class="no-print">` block), add the web-visible prep sheet:

```astro
      <FichaPreparacion mocion={d.mocion} />
```

Add these styles inside the `<style>` block (near `.print-bar`):

```css
  .download-cta { display: inline-flex; align-items: center; gap: 1rem; padding: 0.9rem 1.4rem 0.9rem 1.1rem; background: var(--color-terra); color: #fff; text-decoration: none; border-radius: 6px; }
  .download-cta:hover { background: var(--color-terra-deep); }
  .download-cta__icon { font-family: var(--font-serif); font-style: italic; font-size: 1.7rem; line-height: 1; color: var(--color-mustard-soft); }
  .download-cta__text { display: flex; flex-direction: column; gap: 0.15rem; }
  .download-cta__text strong { font-family: var(--font-sans); font-size: 0.95rem; font-weight: 600; }
  .download-cta__text .muted { font-family: var(--font-sans); font-size: 0.78rem; opacity: 0.8; }
```

- [ ] **Step 2: Type-check + build**

Run: `npx astro check --minimumSeverity error 2>&1 | grep "debates/\[familia\]/\[slug\].astro"`
Expected: no output (no new errors in this file).

- [ ] **Step 3: Commit**

```bash
git add "src/pages/debates/[familia]/[slug].astro"
git commit -m "feat(debates): link the material PDF and show prep sheet on web"
```

---

## Task 10: Remove the authored FichaAlumno block from the 18 debate MDX files

The student prep sheet is now the `FichaPreparacion` component (web + PDF). The authored `<FichaAlumno>` blocks must go so the guide's `<Content />` doesn't duplicate it.

**Files:**
- Modify: all `src/content/debates/**/*.mdx` that contain `<FichaAlumno`.

- [ ] **Step 1: List the affected files**

Run: `npx rg -l "FichaAlumno" src/content/debates`
Expected: up to 18 paths. Note the count.

- [ ] **Step 2: For each file, apply this exact transform**

1. Delete the import line:
   ```
   import FichaAlumno from '@components/debates/FichaAlumno.astro';
   ```
2. Delete the whole block from the opening `<FichaAlumno ...>` to its matching `</FichaAlumno>` (inclusive), including the surrounding blank lines.

Leave `Argumentario` and `Fases` imports/usages untouched. Do not change frontmatter.

If a file's `<FichaAlumno>` contains debate-specific prose that is NOT the generic "Preparo mi postura / 3 argumentos / pregunta / refutar" template, STOP and report it instead of deleting — it may need bespoke handling. (Based on the audited sample, all are generic.)

- [ ] **Step 3: Verify nothing references FichaAlumno anymore**

Run: `npx rg -l "FichaAlumno" src/content/debates`
Expected: no output.

- [ ] **Step 4: Build to confirm the bodies still render**

Run: `npm run build 2>&1 | tail -5`
Expected: success.

- [ ] **Step 5: Commit**

```bash
git add src/content/debates
git commit -m "refactor(debates): drop authored prep sheet in favor of FichaPreparacion"
```

---

## Task 11: Full regeneration + verification

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: PASS, including the new `debatePdfName` and `parseDebatePrintPath` tests.

- [ ] **Step 2: Rebuild site + regenerate all debate PDFs**

Run: `npm run build` then `npm run build:debates 2>&1 | tail -15`
Expected: "✓ 18 packs de debate listos." 18 fresh PDFs in `public/downloads/`.

- [ ] **Step 3: Manual visual check (2 debates of different formats)**

Open `public/downloads/debate-dinero-tecnologia-futuro-01-criptomonedas.pdf` (mesa-redonda → has moderator card) and one `mercado-estado` / `parlamentario` debate. Verify each PDF has: cover, teacher guide with argumentario + cronograma, scoring sheet, posture cards (+ moderator only where expected), prep sheet. No blank pages, no web chrome.

- [ ] **Step 4: Dev-server spot check of the web page**

Run: `npm run dev`, open a debate detail page. Confirm the "Descargar materiales (PDF)" button and the on-page prep sheet render, and the page no longer shows a duplicate authored ficha.

- [ ] **Step 5: Final commit (if any tweaks were needed)**

```bash
git add -A
git commit -m "chore(debates): regenerate material-pack PDFs"
```

---

## Self-Review notes (coverage vs spec)

- Pack contents (guide / scoring / cards / prep): Tasks 6, 4, 5, 3 + composed in Task 7. ✓
- Real pre-generated PDF per debate via pagedjs: Tasks 7, 8. ✓
- Single-source cleanup (prep sheet from component, remove authored ficha): Tasks 3, 9, 10. ✓
- Download link on detail page: Task 9. ✓
- Moderator card only for mesa-redonda/fishbowl/juicio-simulado: Task 5. ✓
- Scope limited to 18 transversal debates; auto-discovery scales to all of them: Tasks 2, 8. ✓
- Testable build logic (filename + job discovery): Tasks 1, 2. ✓
- Naming consistency: `debate-${familia}-${slug}.pdf` used identically in `debatePdfName` (Task 1, app side) and `parseDebatePrintPath` (Task 2, build side). ✓
