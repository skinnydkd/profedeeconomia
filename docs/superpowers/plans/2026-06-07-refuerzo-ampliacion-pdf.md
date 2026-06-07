# Cuadernos de refuerzo y ampliación: contenido ampliado + PDF — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** For the EDMN 2BACH pilot, expand each refuerzo/ampliación block (theory recap + worked examples + more graded exercises) and generate one downloadable PDF per evaluación+tipo (6 PDFs), all from a single frontmatter source.

**Architecture:** Extend the `refuerzo` collection schema with two new optional frontmatter arrays → a shared `BloqueRefuerzo.astro` component renders both the web page and a standalone print route → a `pagedjs-cli` build script emits one PDF per block into `public/downloads`. Mirrors the proven `build-debates-pdf.mjs` + debate print-route patterns. A single "has expanded content" gate (`repaso_teorico.length > 0`) drives which blocks expose a PDF, so the pilot is naturally limited to EDMN and scales later by just adding content.

**Tech Stack:** Astro 5 content collections, Zod schema, pagedjs-cli, Node ESM build scripts, Vitest.

Spec: `docs/superpowers/specs/2026-06-07-refuerzo-ampliacion-pdf-design.md`

---

## File Structure

- `src/content.config.ts` — extend the `refuerzo` collection schema (add `repaso_teorico`, `ejemplos_resueltos`).
- `src/lib/refuerzo.ts` — pure `refuerzoPdfName(asignatura, evaluacion, tipo)` (download filename convention). **Create.**
- `src/lib/refuerzo.test.ts` — unit test. **Create.**
- `scripts/lib/refuerzo-pdf-jobs.mjs` — pure `parseRefuerzoPrintPath(relPath)` + dir-walking `findRefuerzoPrintJobs(distDir)`. **Create.**
- `scripts/lib/refuerzo-pdf-jobs.test.mjs` — unit test. **Create.**
- `src/components/refuerzo/BloqueRefuerzo.astro` — shared block body (web + print). **Create.**
- `src/pages/[asignatura]/refuerzo/index.astro` — use the component + add per-block PDF download link. **Modify.**
- `src/pages/[asignatura]/refuerzo/imprimir/[bloque].astro` — standalone print document. **Create.**
- `scripts/build-refuerzo-pdf.mjs` — build one PDF per expanded block. **Create.**
- `package.json` — add `build:refuerzo`; include it in `build:all`.
- `src/content/asignaturas/edmn-2bach/refuerzo/*.mdx` — the 6 blocks, expanded.

---

## Task 1: Extend the `refuerzo` collection schema

**Files:**
- Modify: `src/content.config.ts` (the `refuerzo = defineCollection({...})` block, ~lines 578-600)

- [ ] **Step 1: Add the two new fields**

In the `refuerzo` collection `schema`, immediately AFTER the existing
`ejercicios: z.array(...).default([]),` line, insert:

```ts
    repaso_teorico: z.array(z.object({
      titulo: z.string(),
      unidad: z.number().int().min(1).optional(),
      contenido: z.string(),
    })).default([]),
    ejemplos_resueltos: z.array(z.object({
      enunciado: z.string(),
      desarrollo: z.string(),
    })).default([]),
```

- [ ] **Step 2: Type-check the content config**

Run: `npx astro sync && npx astro check --minimumSeverity error 2>&1 | grep "content.config"`
Expected: no output (config compiles; new fields available on the collection type).

- [ ] **Step 3: Commit**

```bash
git add src/content.config.ts
git commit -m "feat(refuerzo): add repaso_teorico and ejemplos_resueltos to schema"
```

---

## Task 2: Pure download-filename helper

**Files:**
- Create: `src/lib/refuerzo.ts`
- Test: `src/lib/refuerzo.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/refuerzo.test.ts
import { describe, it, expect } from 'vitest';
import { refuerzoPdfName } from './refuerzo';

describe('refuerzoPdfName', () => {
  it('builds the canonical downloads filename', () => {
    expect(refuerzoPdfName('edmn-2bach', 1, 'refuerzo'))
      .toBe('edmn-2bach-refuerzo-eval1.pdf');
  });

  it('handles ampliacion and other evaluaciones', () => {
    expect(refuerzoPdfName('edmn-2bach', 3, 'ampliacion'))
      .toBe('edmn-2bach-ampliacion-eval3.pdf');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/refuerzo.test.ts`
Expected: FAIL — `refuerzoPdfName` is not exported.

- [ ] **Step 3: Implement**

```ts
// src/lib/refuerzo.ts
/**
 * Canonical filename for a refuerzo/ampliación block's pre-generated PDF, served
 * from /downloads/. Must match the name produced by scripts/build-refuerzo-pdf.mjs
 * (and parseRefuerzoPrintPath).
 */
export function refuerzoPdfName(
  asignatura: string,
  evaluacion: number,
  tipo: 'refuerzo' | 'ampliacion',
): string {
  return `${asignatura}-${tipo}-eval${evaluacion}.pdf`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/refuerzo.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/refuerzo.ts src/lib/refuerzo.test.ts
git commit -m "feat(refuerzo): add refuerzoPdfName download-filename helper"
```

---

## Task 3: Build-script job discovery (pure parse + dir walk)

**Files:**
- Create: `scripts/lib/refuerzo-pdf-jobs.mjs`
- Test: `scripts/lib/refuerzo-pdf-jobs.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
// scripts/lib/refuerzo-pdf-jobs.test.mjs
import { describe, it, expect } from 'vitest';
import { parseRefuerzoPrintPath } from './refuerzo-pdf-jobs.mjs';

describe('parseRefuerzoPrintPath', () => {
  it('extracts asignatura/evaluacion/tipo and builds route + out name', () => {
    const rel = 'edmn-2bach/refuerzo/imprimir/eval1-refuerzo/index.html';
    expect(parseRefuerzoPrintPath(rel)).toEqual({
      asignatura: 'edmn-2bach',
      evaluacion: 1,
      tipo: 'refuerzo',
      route: 'edmn-2bach/refuerzo/imprimir/eval1-refuerzo',
      out: 'edmn-2bach-refuerzo-eval1.pdf',
    });
  });

  it('handles ampliacion', () => {
    const rel = 'eco-1bach/refuerzo/imprimir/eval3-ampliacion/index.html';
    expect(parseRefuerzoPrintPath(rel)?.out).toBe('eco-1bach-ampliacion-eval3.pdf');
  });

  it('returns null for non-matching paths', () => {
    expect(parseRefuerzoPrintPath('edmn-2bach/refuerzo/index.html')).toBeNull();
    expect(parseRefuerzoPrintPath('edmn-2bach/actividades/imprimir/alumno/index.html')).toBeNull();
    expect(parseRefuerzoPrintPath('edmn-2bach/refuerzo/imprimir/eval9-x/index.html')).toBeNull();
  });

  it('normalizes Windows backslashes', () => {
    const rel = 'fopp-4eso\\refuerzo\\imprimir\\eval2-refuerzo\\index.html';
    expect(parseRefuerzoPrintPath(rel)?.evaluacion).toBe(2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run scripts/lib/refuerzo-pdf-jobs.test.mjs`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the module**

```js
// scripts/lib/refuerzo-pdf-jobs.mjs
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Parse a dist-relative HTML path for a refuerzo print route. Returns the
 * asignatura/evaluacion/tipo, the (slash-joined) route path and the output PDF
 * filename, or null when the path is not a refuerzo `.../imprimir/<bloque>/index.html`.
 * Expected shape: <asignatura>/refuerzo/imprimir/eval<n>-<tipo>/index.html
 */
export function parseRefuerzoPrintPath(relPath) {
  const parts = relPath.replace(/\\/g, '/').split('/');
  if (parts.length !== 5) return null;
  const [asignatura, sec, leaf, bloque, file] = parts;
  if (sec !== 'refuerzo' || leaf !== 'imprimir' || file !== 'index.html') return null;
  const m = bloque.match(/^eval([1-3])-(refuerzo|ampliacion)$/);
  if (!m) return null;
  const evaluacion = Number(m[1]);
  const tipo = m[2];
  return {
    asignatura,
    evaluacion,
    tipo,
    route: `${asignatura}/refuerzo/imprimir/${bloque}`,
    out: `${asignatura}-${tipo}-eval${evaluacion}.pdf`,
  };
}

/**
 * Walk distDir and return one job per refuerzo print route. Each job is the
 * object returned by parseRefuerzoPrintPath, sorted by route for determinism.
 */
export function findRefuerzoPrintJobs(distDir) {
  const jobs = [];
  const walk = (absDir, relDir) => {
    let entries;
    try { entries = readdirSync(absDir); } catch { return; }
    for (const name of entries) {
      const abs = join(absDir, name);
      const rel = relDir ? `${relDir}/${name}` : name;
      let isDir = false;
      try { isDir = statSync(abs).isDirectory(); } catch { continue; }
      if (isDir) { walk(abs, rel); continue; }
      if (name !== 'index.html') continue;
      const job = parseRefuerzoPrintPath(rel);
      if (job) jobs.push(job);
    }
  };
  walk(distDir, '');
  return jobs.sort((a, b) => a.route.localeCompare(b.route));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run scripts/lib/refuerzo-pdf-jobs.test.mjs`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/refuerzo-pdf-jobs.mjs scripts/lib/refuerzo-pdf-jobs.test.mjs
git commit -m "feat(refuerzo): add pdf-job discovery for the build script"
```

---

## Task 4: Shared `BloqueRefuerzo` component

**Files:**
- Create: `src/components/refuerzo/BloqueRefuerzo.astro`

- [ ] **Step 1: Create the component**

```astro
---
/**
 * Shared body of a refuerzo/ampliación block: theory recap, key points,
 * vocabulary, worked examples and the graded exercises. Rendered identically on
 * the web (mode="web": per-exercise folded solutions) and in the print/PDF
 * document (mode="print": enunciados only + a numbered solucionario at the end).
 * Single source for /[asignatura]/refuerzo/ and the print route. All rich text
 * fields are HTML strings (consistent with the rest of the refuerzo section).
 */
interface Repaso { titulo: string; unidad?: number; contenido: string; }
interface Ejemplo { enunciado: string; desarrollo: string; }
interface Ejercicio { enunciado: string; solucion?: string; }
interface Props {
  esencial: string[];
  conceptos: string[];
  repaso: Repaso[];
  ejemplos: Ejemplo[];
  ejercicios: Ejercicio[];
  tipo: 'refuerzo' | 'ampliacion';
  mode: 'web' | 'print';
}
const { esencial, conceptos, repaso, ejemplos, ejercicios, tipo, mode } = Astro.props;
const ejerciciosLabel = tipo === 'refuerzo' ? 'Practica' : 'Retos';
const haySoluciones = ejercicios.some((e) => e.solucion);
---
{repaso.length > 0 && (
  <div class="rb-sec">
    <h4 class="rb-sub">Repaso teórico</h4>
    {repaso.map((r) => (
      <div class="rb-repaso">
        <h5 class="rb-repaso__t">{r.unidad ? `U${r.unidad}. ` : ''}{r.titulo}</h5>
        <div class="rb-prose" set:html={r.contenido} />
      </div>
    ))}
  </div>
)}

{esencial.length > 0 && (
  <div class="rb-sec">
    <h4 class="rb-sub">Lo esencial</h4>
    <ul class="rb-esencial">{esencial.map((e) => <li>{e}</li>)}</ul>
  </div>
)}

{conceptos.length > 0 && (
  <div class="rb-sec">
    <h4 class="rb-sub">Vocabulario</h4>
    <ul class="rb-chips">{conceptos.map((c) => <li class="rb-chip">{c}</li>)}</ul>
  </div>
)}

{ejemplos.length > 0 && (
  <div class="rb-sec">
    <h4 class="rb-sub">Ejemplos resueltos</h4>
    <ol class="rb-ejemplos">
      {ejemplos.map((ej) => (
        <li class="rb-ejemplo">
          <div class="rb-ejemplo__e" set:html={ej.enunciado} />
          <div class="rb-ejemplo__d" set:html={ej.desarrollo} />
        </li>
      ))}
    </ol>
  </div>
)}

{ejercicios.length > 0 && (
  <div class="rb-sec">
    <h4 class="rb-sub">{ejerciciosLabel}</h4>
    <ol class="rb-ejercicios">
      {ejercicios.map((ej) => (
        <li class="rb-ejercicio">
          <div class="rb-ejercicio__en" set:html={ej.enunciado} />
          {mode === 'web' && ej.solucion && (
            <details class="rb-sol">
              <summary>Ver solución</summary>
              <div class="rb-sol__body" set:html={ej.solucion} />
            </details>
          )}
        </li>
      ))}
    </ol>
  </div>
)}

{mode === 'print' && haySoluciones && (
  <div class="rb-sec rb-solucionario">
    <h4 class="rb-sub">Solucionario</h4>
    <ol class="rb-sols">
      {ejercicios.map((ej) => (
        <li class="rb-sol-item">
          {ej.solucion ? <div set:html={ej.solucion} /> : <span>—</span>}
        </li>
      ))}
    </ol>
  </div>
)}
<style>
  .rb-sec { margin-top: 1.1rem; }
  .rb-sub {
    font-family: var(--font-sans); font-size: 0.74rem; text-transform: uppercase;
    letter-spacing: 0.1em; color: var(--color-ink-mute); font-weight: 700; margin: 0 0 0.5rem;
  }
  .rb-repaso { margin-bottom: 0.8rem; }
  .rb-repaso__t { font-family: var(--font-serif); font-size: 1.02rem; font-weight: 500; margin: 0 0 0.25rem; }
  .rb-prose { line-height: 1.55; color: var(--color-ink-soft); }
  .rb-prose :global(p) { margin: 0 0 0.5em; }
  .rb-prose :global(ul) { padding-left: 1.2rem; margin: 0 0 0.5em; }

  .rb-esencial { margin: 0; padding-left: 1.1rem; }
  .rb-esencial li { margin-bottom: 0.35rem; line-height: 1.5; color: var(--color-ink); }
  .rb-esencial li::marker { color: var(--color-terra); }

  .rb-chips { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .rb-chip {
    font-family: var(--font-mono); font-size: 0.78rem; color: var(--color-ink-soft);
    background: var(--color-bg); border: 1px solid var(--color-line);
    border-radius: 999px; padding: 0.15rem 0.7rem;
  }

  .rb-ejemplos { margin: 0; padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.9rem; }
  .rb-ejemplo__e { font-weight: 600; line-height: 1.5; margin-bottom: 0.3rem; }
  .rb-ejemplo__d {
    line-height: 1.55; color: var(--color-ink-soft);
    background: var(--color-bg); border-left: 3px solid var(--color-mustard);
    border-radius: 0 5px 5px 0; padding: 0.6rem 0.9rem;
  }
  .rb-ejemplo__d :global(p) { margin: 0 0 0.4em; }

  .rb-ejercicios { margin: 0; padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.8rem; }
  .rb-ejercicio__en { line-height: 1.55; color: var(--color-ink); margin-bottom: 0.3rem; }
  .rb-sol summary { cursor: pointer; font-family: var(--font-sans); font-size: 0.85rem; font-weight: 600; color: var(--color-terra); }
  .rb-sol__body {
    margin-top: 0.5rem; padding: 0.7rem 0.9rem; background: var(--color-bg);
    border-left: 3px solid var(--color-terra); border-radius: 0 5px 5px 0;
    font-size: 0.92rem; line-height: 1.55; color: var(--color-ink-soft);
  }
  .rb-sol__body :global(p) { margin: 0 0 0.4em; }

  .rb-solucionario { margin-top: 1.6rem; padding-top: 0.8rem; border-top: 2px solid var(--color-mustard); }
  .rb-sols { margin: 0; padding-left: 1.4rem; display: flex; flex-direction: column; gap: 0.5rem; }
  .rb-sol-item { line-height: 1.5; color: var(--color-ink-soft); }
  .rb-sol-item :global(p) { margin: 0 0 0.3em; }
</style>
```

- [ ] **Step 2: Type-check**

Run: `npx astro check --minimumSeverity error 2>&1 | grep BloqueRefuerzo`
Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/components/refuerzo/BloqueRefuerzo.astro
git commit -m "feat(refuerzo): add shared BloqueRefuerzo component (web + print)"
```

---

## Task 5: Use the component on the web page + add PDF download links

**Files:**
- Modify: `src/pages/[asignatura]/refuerzo/index.astro`

The web page (`src/pages/[asignatura]/refuerzo/index.astro`) currently renders each
block's `esencial`, `conceptos_clave` and `ejercicios` inline (around lines 75-110).
Replace that inline body with the shared component and add a per-block PDF download
link, shown only for blocks with expanded content (`repaso_teorico.length > 0`).

- [ ] **Step 1: Add imports**

After the existing import line `import { ASIGNATURA_SLUGS, ASIGNATURAS } from '@/lib/asignaturas';`
add:

```ts
import BloqueRefuerzo from '@components/refuerzo/BloqueRefuerzo.astro';
import { refuerzoPdfName } from '@/lib/refuerzo';
```

- [ ] **Step 2: Replace the inline block body**

Replace this exact span (the three `b.data.esencial` / `conceptos_clave` / `ejercicios`
sections, currently lines ~75-110):

```astro
              {b.data.esencial.length > 0 && (
                <div class="bloque__sec">
                  <h4 class="bloque__sub">Lo esencial</h4>
                  <ul class="bloque__esencial">
                    {b.data.esencial.map((e) => <li>{e}</li>)}
                  </ul>
                </div>
              )}

              {b.data.conceptos_clave.length > 0 && (
                <div class="bloque__sec">
                  <h4 class="bloque__sub">Vocabulario</h4>
                  <ul class="bloque__chips">
                    {b.data.conceptos_clave.map((c) => <li class="chip">{c}</li>)}
                  </ul>
                </div>
              )}

              {b.data.ejercicios.length > 0 && (
                <div class="bloque__sec">
                  <h4 class="bloque__sub">{b.data.tipo === 'refuerzo' ? 'Practica' : 'Retos'}</h4>
                  <ol class="bloque__ejercicios">
                    {b.data.ejercicios.map((ej) => (
                      <li class="ejercicio">
                        <p class="ejercicio__enunciado" set:html={ej.enunciado} />
                        {ej.solucion && (
                          <details class="ejercicio__sol">
                            <summary>Ver solución</summary>
                            <div class="ejercicio__sol-body" set:html={ej.solucion} />
                          </details>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
```

with:

```astro
              {b.data.repaso_teorico.length > 0 && (
                <p class="bloque__download">
                  <a href={`/downloads/${refuerzoPdfName(a.slug, b.data.evaluacion, b.data.tipo)}`} download>
                    ↓ Descargar este cuaderno (PDF)
                  </a>
                </p>
              )}

              <BloqueRefuerzo
                esencial={b.data.esencial}
                conceptos={b.data.conceptos_clave}
                repaso={b.data.repaso_teorico}
                ejemplos={b.data.ejemplos_resueltos}
                ejercicios={b.data.ejercicios}
                tipo={b.data.tipo}
                mode="web"
              />
```

- [ ] **Step 3: Add the download-link style**

Inside the `<style>` block, after the `.bloque__desc { ... }` rule, add:

```css
  .bloque__download { margin: 0.8rem 0 0; }
  .bloque__download a {
    font-family: var(--font-sans); font-size: 0.9rem; font-weight: 600;
    color: var(--color-terra); text-decoration: none;
  }
  .bloque__download a:hover { text-decoration: underline; }
```

- [ ] **Step 4: Remove now-unused styles**

The inline rendering moved to the component, which carries its own styles. Delete these
now-dead rules from the `<style>` block (they were only used by the replaced markup):
`.bloque__esencial`, `.bloque__esencial li`, `.bloque__esencial li::marker`,
`.bloque__chips`, `.chip`, `.bloque__ejercicios`, `.ejercicio__enunciado`,
`.ejercicio__sol summary`, `.ejercicio__sol-body`, `.ejercicio__sol-body :global(p)`.
Keep `.bloque__sec` and `.bloque__sub` ONLY if still referenced; after this change they
are not, so delete them too. (Leave everything else — hero, eval, bloque card, chrome.)

- [ ] **Step 5: Type-check + build the page**

Run: `npx astro check --minimumSeverity error 2>&1 | grep "refuerzo/index"`
Expected: no output.
Run: `npm run build 2>&1 | tail -5`
Expected: build succeeds.

- [ ] **Step 6: Commit**

```bash
git add "src/pages/[asignatura]/refuerzo/index.astro"
git commit -m "feat(refuerzo): render via BloqueRefuerzo and link the PDF on web"
```

---

## Task 6: Print route — standalone block document

**Files:**
- Create: `src/pages/[asignatura]/refuerzo/imprimir/[bloque].astro`

Generates one print page per **expanded** published block (gate:
`repaso_teorico.length > 0`), so the pilot is limited to EDMN until more content lands.
The standalone `<html>` shell mirrors `src/pages/debates/[familia]/[slug]/imprimir.astro`.

- [ ] **Step 1: Create the route**

```astro
---
/**
 * Print-ready cuaderno for one refuerzo/ampliación block. Consumed by pagedjs-cli
 * (scripts/build-refuerzo-pdf.mjs) to produce {asignatura}-{tipo}-eval{n}.pdf.
 * Only blocks with expanded content (repaso_teorico) get a page, so PDF coverage
 * tracks the migration. noindex.
 */
import BloqueRefuerzo from '@components/refuerzo/BloqueRefuerzo.astro';
import { ASIGNATURAS } from '@/lib/asignaturas';
import { getCollection } from 'astro:content';
import type { GetStaticPaths } from 'astro';

const ORDINAL: Record<number, string> = { 1: '1.ª', 2: '2.ª', 3: '3.ª' };

export const getStaticPaths = (async () => {
  const all = await getCollection('refuerzo');
  return all
    .filter((e) => e.data.estado === 'publicado' && e.data.repaso_teorico.length > 0)
    .map((entry) => ({
      params: {
        asignatura: entry.data.asignatura,
        bloque: `eval${entry.data.evaluacion}-${entry.data.tipo}`,
      },
      props: { entry },
    }));
}) satisfies GetStaticPaths;

const { entry } = Astro.props;
const d = entry.data;
const a = ASIGNATURAS[d.asignatura];
const tipoLabel = d.tipo === 'refuerzo' ? 'Refuerzo' : 'Ampliación';
const unidadesLabel = d.unidades.length > 0 ? `Unidades ${d.unidades.join(', ')}` : '';
---
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="robots" content="noindex" />
    <title>{d.title} — {a?.shortLabel ?? d.asignatura}</title>
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
      .cover { break-after: page; padding-top: 4rem; }
      .cover__eyebrow { color: var(--color-mustard-deep); font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; font-size: 10pt; }
      .cover__title { font-family: var(--font-serif); font-size: 28pt; line-height: 1.08; margin: 0.5rem 0; }
      .cover__sub { font-style: italic; font-family: var(--font-serif); color: var(--color-ink-soft); font-size: 12.5pt; }
      .cover__meta { margin-top: 1.5rem; font-size: 0.95rem; color: var(--color-ink-soft); }
    </style>
  </head>
  <body>
    <section class="cover">
      <div class="cover__eyebrow">{a?.shortLabel ?? d.asignatura} · {tipoLabel}</div>
      <h1 class="cover__title">{d.title}</h1>
      {d.descripcion && <p class="cover__sub">{d.descripcion}</p>}
      <p class="cover__meta">{ORDINAL[d.evaluacion]} evaluación{unidadesLabel ? ` · ${unidadesLabel}` : ''}</p>
    </section>

    <BloqueRefuerzo
      esencial={d.esencial}
      conceptos={d.conceptos_clave}
      repaso={d.repaso_teorico}
      ejemplos={d.ejemplos_resueltos}
      ejercicios={d.ejercicios}
      tipo={d.tipo}
      mode="print"
    />
  </body>
</html>
```

- [ ] **Step 2: Build to confirm the route renders**

Note: this requires at least one expanded block to exist. If Task 8 has not run yet,
this step produces ZERO print pages (the gate filters everything out) and that is OK —
just confirm the build does not error. After Task 8, re-confirm pages appear.

Run: `npm run build 2>&1 | tail -5`
Expected: build succeeds (no error).

- [ ] **Step 3: Commit**

```bash
git add "src/pages/[asignatura]/refuerzo/imprimir/[bloque].astro"
git commit -m "feat(refuerzo): add standalone print route per block"
```

---

## Task 7: Build script + package.json wiring

**Files:**
- Create: `scripts/build-refuerzo-pdf.mjs`
- Modify: `package.json`

- [ ] **Step 1: Create the build script**

Adapted from `scripts/build-debates-pdf.mjs` — same static server + Chrome detection +
pagedjs invocation; jobs come from `findRefuerzoPrintJobs`. Uses PORT 4339.

```js
#!/usr/bin/env node
/**
 * Build one PDF per expanded refuerzo/ampliación block from the static build,
 * using the same HTTP-server + pagedjs pattern as build-debates-pdf. Writes
 * {asignatura}-{tipo}-eval{n}.pdf into public/downloads.
 *
 * Usage:
 *   node scripts/build-refuerzo-pdf.mjs            # copy to public/downloads/
 *   node scripts/build-refuerzo-pdf.mjs --in-dist  # only write to dist/downloads/
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, copyFileSync, statSync, readFileSync } from 'node:fs';
import { resolve, dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { platform } from 'node:os';
import { createServer } from 'node:http';
import { findRefuerzoPrintJobs } from './lib/refuerzo-pdf-jobs.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const PORT = 4339;

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

const jobs = findRefuerzoPrintJobs(distDir);
if (jobs.length === 0) { console.error('✖ No se encontraron rutas de impresión de refuerzo en dist/.'); process.exit(1); }
console.log(`\nBloques encontrados: ${jobs.length}`);

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
console.log(`\n✓ ${jobs.length} cuadernos de refuerzo listos.`);
```

- [ ] **Step 2: Wire package.json**

In `package.json` `scripts`, add after the `"build:debates": ...` line:

```json
    "build:refuerzo": "node scripts/build-refuerzo-pdf.mjs",
```

And extend `build:all` to include it right after `npm run build:debates`:

```
... && npm run build:debates && npm run build:refuerzo && npm run build:decks",
```

- [ ] **Step 3: Commit**

```bash
git add scripts/build-refuerzo-pdf.mjs package.json
git commit -m "feat(refuerzo): build one cuaderno PDF per expanded block"
```

(The script is exercised end-to-end in Task 9, after content exists.)

---

## Task 8: Expand the 6 EDMN 2BACH blocks (content)

**Files:**
- Modify (all 6):
  - `src/content/asignaturas/edmn-2bach/refuerzo/eval1-refuerzo.mdx` (Unidades 1-4)
  - `src/content/asignaturas/edmn-2bach/refuerzo/eval1-ampliacion.mdx` (Unidades 1-4)
  - `src/content/asignaturas/edmn-2bach/refuerzo/eval2-refuerzo.mdx` (Unidades 5-8)
  - `src/content/asignaturas/edmn-2bach/refuerzo/eval2-ampliacion.mdx` (Unidades 5-8)
  - `src/content/asignaturas/edmn-2bach/refuerzo/eval3-refuerzo.mdx` (Unidades 9-12)
  - `src/content/asignaturas/edmn-2bach/refuerzo/eval3-ampliacion.mdx` (Unidades 9-12)

This is a **content** task, not codeable as exact text. Dispatch one subagent per block
(6 total). Each subagent reads the current file (to keep existing frontmatter and reuse
its `esencial`/`conceptos_clave`/`unidades`/`competencias_clave`) and the corresponding
units of the EDMN 2BACH `libro` (`src/content/asignaturas/edmn-2bach/libro/`) for source
accuracy, then rewrites the frontmatter to the "amplio" format.

**Per-block target (size "amplio"):**
- `repaso_teorico`: one entry per unit of the evaluación (4 entries), each `{ titulo,
  unidad, contenido }` where `contenido` is 2-4 short HTML paragraphs (`<p>…</p>`, may use
  `<ul>`), a clear synthesis of the unit's essentials.
- `ejemplos_resueltos`: 3-5 entries `{ enunciado, desarrollo }`. `desarrollo` is HTML,
  step-by-step. Refuerzo → very guided, basic. Ampliación → higher level.
- `ejercicios`: 18-25 entries `{ enunciado, solucion }`, **solucion always present** and
  complete. Graduated difficulty; variety: define, calcular (punto muerto, VAN/payback,
  ratios, productividad…), interpretar, casos breves, V/F razonado. Numeric exercises must
  have arithmetically-correct solutions.
- Keep `asignatura`, `evaluacion`, `tipo`, `title`, `descripcion`, `unidades`,
  `esencial`, `conceptos_clave`, `competencias_clave`, `orden`, `lang`. Keep
  `estado: publicado`.

**Format model** — the new fields must look exactly like this (HTML strings in YAML):

```yaml
repaso_teorico:
  - titulo: "El coste de oportunidad y la FPP"
    unidad: 1
    contenido: >
      <p>Toda decisión económica implica renunciar a alternativas. El <strong>coste
      de oportunidad</strong> es el valor de la mejor alternativa a la que renuncias.</p>
      <p>La <strong>frontera de posibilidades de producción (FPP)</strong> representa
      las combinaciones máximas de dos bienes que una economía puede producir con sus
      recursos. Producir más de un bien obliga a producir menos del otro.</p>
ejemplos_resueltos:
  - enunciado: "Una empresa fabrica sillas con un coste fijo de 2.000 € y un coste variable de 30 €/silla. Las vende a 50 €. ¿Cuál es su punto muerto?"
    desarrollo: >
      <p>El punto muerto iguala ingresos y costes totales: <em>P·Q = CF + CVu·Q</em>.</p>
      <p>50·Q = 2.000 + 30·Q → 20·Q = 2.000 → <strong>Q = 100 sillas</strong>.</p>
      <p>A partir de 100 sillas vendidas, la empresa empieza a tener beneficios.</p>
ejercicios:
  - enunciado: "Calcula el punto muerto de una empresa con CF = 6.000 €, precio 40 € y coste variable unitario 25 €."
    solucion: >
      <p>40·Q = 6.000 + 25·Q → 15·Q = 6.000 → <strong>Q = 400 unidades</strong>.</p>
```

**Quality gate per block (the subagent must self-check before returning):**
1. All numeric solutions are arithmetically correct.
2. Content matches the EDMN 2BACH units listed and is original (no copy from third parties).
3. Exercise count 18-25; worked examples 3-5; one repaso entry per unit.
4. Valid YAML, HTML well-formed, `estado: publicado` kept.

- [ ] **Step 1: Expand all 6 blocks** (one subagent per file; see dispatch note above)

- [ ] **Step 2: Validate the collection compiles**

Run: `npx astro sync && npx astro check --minimumSeverity error 2>&1 | grep "edmn-2bach/refuerzo"`
Expected: no output (all 6 files validate against the schema).

- [ ] **Step 3: Pau reviews the content** (manual gate — content accuracy is critical;
  do not mark `publicado` content as done without review).

- [ ] **Step 4: Commit**

```bash
git add src/content/asignaturas/edmn-2bach/refuerzo
git commit -m "content(refuerzo): expand the 6 EDMN 2BACH blocks (repaso + ejemplos + ejercicios)"
```

---

## Task 9: Full regeneration + verification

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: PASS, including the new `refuerzoPdfName` and `parseRefuerzoPrintPath` tests.

- [ ] **Step 2: Rebuild site + confirm the 6 print routes exist**

Run: `npm run build 2>&1 | tail -5`
Then confirm (PowerShell): `Test-Path "dist/client/edmn-2bach/refuerzo/imprimir/eval1-refuerzo/index.html"` → `True`.
And count: there should be 6 such `index.html` under `*/refuerzo/imprimir/*/`.

- [ ] **Step 3: Generate the PDFs**

Run: `npm run build:refuerzo 2>&1 | tail -15`
Expected: "Bloques encontrados: 6", one "Generando …pdf" per block, ending
"✓ 6 cuadernos de refuerzo listos." Confirm
`Test-Path public/downloads/edmn-2bach-refuerzo-eval1.pdf` → `True`.

- [ ] **Step 4: Manual visual check (1 refuerzo + 1 ampliación PDF)**

Open `public/downloads/edmn-2bach-refuerzo-eval1.pdf` and
`public/downloads/edmn-2bach-ampliacion-eval3.pdf`. Verify each has: cover, repaso
teórico, lo esencial, vocabulario, ejemplos resueltos, ejercicios numerados, and a
Solucionario at the end. No web chrome, no blank pages.

- [ ] **Step 5: Dev-server spot check of the web page**

Run: `npm run dev`, open `/edmn-2bach/refuerzo/`. Confirm each EDMN block now shows the
repaso + ejemplos + exercises with folded solutions and a "Descargar este cuaderno (PDF)"
link; the other 8 subjects' pages still render unchanged (no download link, no repaso).

- [ ] **Step 6: Commit the PDFs**

```bash
git add public/downloads/edmn-2bach-*.pdf
git commit -m "chore(refuerzo): generate EDMN 2BACH cuaderno PDFs"
```

---

## Self-Review notes (coverage vs spec)

- Schema extension (repaso_teorico, ejemplos_resueltos, default []): Task 1. ✓
- Filename helper + job discovery, TDD: Tasks 2, 3. ✓
- Shared web+print component with mode (folded web / solucionario print): Task 4. ✓
- Web page uses component + per-block PDF link gated on expanded content: Task 5. ✓
- Standalone A4 print route per block, gate = repaso_teorico>0: Task 6. ✓
- Build script (pagedjs) + package.json wiring, name `{asignatura}-{tipo}-eval{n}.pdf`: Task 7. ✓
- Naming consistency: `refuerzoPdfName` (app) and `parseRefuerzoPrintPath` (build) both
  emit `{asignatura}-{tipo}-eval{n}.pdf`: Tasks 2, 3, 7. ✓
- Pilot limited to EDMN, scales by content: gate in Tasks 5/6. ✓
- Content expansion ~7-10 pp (repaso per unit + 3-5 ejemplos + 18-25 ejercicios): Task 8. ✓
- Backward compatibility (other 8 subjects untouched, still validate/render): Tasks 1, 5, 9. ✓
- One edition, solutions at end: Task 4 (print solucionario). ✓
- Verification (tests, build, 6 PDFs, visual, web): Task 9. ✓
```
