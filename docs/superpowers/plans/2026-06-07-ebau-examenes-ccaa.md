# Exámenes EBAU por comunidad (EDMN 2BACH) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a per-comunidad section of official past EBAU exams (+ solutions) for EDMN 2BACH: real PDFs downloaded from official sources and hosted under `public/`, shown per CCAA × año × convocatoria, with automatic "próximamente" for missing slots and for 2026.

**Architecture:** A pure TS registry (`src/lib/ebau-examenes.ts`) defines the 17 CCAA, years, convocatorias and the PDF filename convention. A new Astro route detects at build time (Node `fs`) which PDFs exist under `public/ebau-examenes/` and renders download links or "próximamente". The PDFs are downloaded from official portals by subagents (one per CCAA) via WebSearch + `curl`. Mirrors the Olimpiada/simulacros pattern.

**Tech Stack:** Astro 5, Node fs (build-time), Vitest, curl (download).

Spec: `docs/superpowers/specs/2026-06-07-ebau-examenes-ccaa-design.md`

---

## File Structure

- `src/lib/ebau-examenes.ts` — registry (CCAA list, años, convocatorias) + filename/URL helpers. **Create.**
- `src/lib/ebau-examenes.test.ts` — unit test. **Create.**
- `src/pages/[asignatura]/ebau/examenes/index.astro` — per-CCAA exam listing with build-time file detection. **Create.**
- `src/pages/[asignatura]/ebau/index.astro` — add a callout linking to `./examenes/`. **Modify.**
- `public/ebau-examenes/{ccaa}/empresa-{anio}-{conv}-{tipo}.pdf` — real official PDFs. **Create (download).**

---

## Task 1: Registry + helpers (TDD)

**Files:**
- Create: `src/lib/ebau-examenes.ts`
- Test: `src/lib/ebau-examenes.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/ebau-examenes.test.ts
import { describe, it, expect } from 'vitest';
import { CCAA_LIST, ANIOS, CONVOCATORIAS, ebauPdfRelPath, ebauPdfHref } from './ebau-examenes';

describe('ebau-examenes registry', () => {
  it('lists the 17 comunidades with Comunitat Valenciana first', () => {
    expect(CCAA_LIST).toHaveLength(17);
    expect(CCAA_LIST[0].slug).toBe('comunidad-valenciana');
    // slugs are unique
    expect(new Set(CCAA_LIST.map((c) => c.slug)).size).toBe(17);
  });

  it('exposes the available años (2025, 2024) and two convocatorias', () => {
    expect([...ANIOS]).toEqual([2025, 2024]);
    expect(CONVOCATORIAS.map((c) => c.slug)).toEqual(['junio', 'julio']);
  });

  it('builds the canonical PDF rel path and public href', () => {
    expect(ebauPdfRelPath('madrid', 2025, 'junio', 'examen'))
      .toBe('ebau-examenes/madrid/empresa-2025-junio-examen.pdf');
    expect(ebauPdfHref('madrid', 2025, 'junio', 'solucion'))
      .toBe('/ebau-examenes/madrid/empresa-2025-junio-solucion.pdf');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/ebau-examenes.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement**

```ts
// src/lib/ebau-examenes.ts
export interface Ccaa { slug: string; label: string; }

/** Comunitat Valenciana first (Pau's region); the rest alphabetical by label. */
export const CCAA_LIST: Ccaa[] = [
  { slug: 'comunidad-valenciana', label: 'Comunitat Valenciana' },
  { slug: 'andalucia', label: 'Andalucía' },
  { slug: 'aragon', label: 'Aragón' },
  { slug: 'asturias', label: 'Asturias' },
  { slug: 'cantabria', label: 'Cantabria' },
  { slug: 'castilla-la-mancha', label: 'Castilla-La Mancha' },
  { slug: 'castilla-y-leon', label: 'Castilla y León' },
  { slug: 'cataluna', label: 'Cataluña' },
  { slug: 'extremadura', label: 'Extremadura' },
  { slug: 'galicia', label: 'Galicia' },
  { slug: 'islas-baleares', label: 'Islas Baleares' },
  { slug: 'islas-canarias', label: 'Islas Canarias' },
  { slug: 'la-rioja', label: 'La Rioja' },
  { slug: 'madrid', label: 'Comunidad de Madrid' },
  { slug: 'murcia', label: 'Región de Murcia' },
  { slug: 'navarra', label: 'Navarra' },
  { slug: 'pais-vasco', label: 'País Vasco' },
];

export const ANIOS = [2025, 2024] as const;

export const CONVOCATORIAS = [
  { slug: 'junio', label: 'Junio (ordinaria)' },
  { slug: 'julio', label: 'Julio (extraordinaria)' },
] as const;

export type Tipo = 'examen' | 'solucion';

/** Path relative to public/ (no leading slash). Uniform filename across CCAA. */
export function ebauPdfRelPath(ccaa: string, anio: number, conv: string, tipo: Tipo): string {
  return `ebau-examenes/${ccaa}/empresa-${anio}-${conv}-${tipo}.pdf`;
}

/** Public URL (leading slash). */
export function ebauPdfHref(ccaa: string, anio: number, conv: string, tipo: Tipo): string {
  return `/${ebauPdfRelPath(ccaa, anio, conv, tipo)}`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/ebau-examenes.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/ebau-examenes.ts src/lib/ebau-examenes.test.ts
git commit -m "feat(ebau): add per-CCAA exam registry and PDF path helpers"
```

---

## Task 2: Exam-listing route with build-time file detection

**Files:**
- Create: `src/pages/[asignatura]/ebau/examenes/index.astro`

Generates one page per subject that has published EBAU content (de facto `edmn-2bach`). At
build, checks which PDFs exist under `public/ebau-examenes/` and renders download links or
"próximamente". 2026 is always "próximamente".

- [ ] **Step 1: Create the route**

```astro
---
/**
 * Exámenes EBAU oficiales de años anteriores, por comunidad autónoma (EDMN 2BACH).
 * Los PDFs reales se alojan en public/ebau-examenes/. La disponibilidad se detecta
 * en build con fs.existsSync; lo que falta (y todo 2026) se muestra "próximamente".
 */
import BaseLayout from '@layouts/BaseLayout.astro';
import { ASIGNATURAS } from '@/lib/asignaturas';
import { CCAA_LIST, ANIOS, CONVOCATORIAS, ebauPdfRelPath, ebauPdfHref } from '@/lib/ebau-examenes';
import { getCollection } from 'astro:content';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import type { GetStaticPaths } from 'astro';

export const getStaticPaths = (async () => {
  const all = await getCollection('ebau');
  const slugs = [...new Set(all.filter((e) => e.data.estado === 'publicado').map((e) => e.data.asignatura))];
  return slugs.map((slug) => ({ params: { asignatura: slug }, props: { asignatura: ASIGNATURAS[slug] } }));
}) satisfies GetStaticPaths;

const { asignatura: a } = Astro.props;

const tiene = (ccaa: string, anio: number, conv: string, tipo: 'examen' | 'solucion') =>
  existsSync(resolve(process.cwd(), 'public', ebauPdfRelPath(ccaa, anio, conv, tipo)));

interface Fila {
  anio: number; convLabel: string;
  examen: string | null; solucion: string | null; proximamente: boolean;
}

const grupos = CCAA_LIST.map((c) => {
  const filas: Fila[] = [];
  for (const anio of ANIOS) {
    for (const conv of CONVOCATORIAS) {
      const tieneExamen = tiene(c.slug, anio, conv.slug, 'examen');
      filas.push({
        anio,
        convLabel: conv.label,
        examen: tieneExamen ? ebauPdfHref(c.slug, anio, conv.slug, 'examen') : null,
        solucion: tiene(c.slug, anio, conv.slug, 'solucion') ? ebauPdfHref(c.slug, anio, conv.slug, 'solucion') : null,
        proximamente: !tieneExamen,
      });
    }
  }
  // 2026: siempre próximamente
  filas.push({ anio: 2026, convLabel: 'Junio (ordinaria)', examen: null, solucion: null, proximamente: true });
  const disponibles = filas.filter((f) => f.examen).length;
  return { ccaa: c, filas, disponibles };
});

const totalDisponibles = grupos.reduce((n, g) => n + g.disponibles, 0);
---

<BaseLayout
  title={`Exámenes EBAU por comunidad — ${a.shortLabel}`}
  description={`Exámenes oficiales de EBAU/PAU de Economía de la Empresa de años anteriores, por comunidad autónoma, con su resolución en PDF.`}
>
  <div class="container">
    <nav class="breadcrumb">
      <a href="/">Inicio</a> <span class="sep">›</span>
      <a href={`/${a.slug}/`}>{a.shortLabel}</a> <span class="sep">›</span>
      <a href={`/${a.slug}/ebau/`}>Preparación EBAU</a> <span class="sep">›</span>
      <span>Exámenes por comunidad</span>
    </nav>
  </div>

  <section class="hero">
    <div class="container">
      <span class="kicker">{a.shortLabel} · EBAU</span>
      <h1>Exámenes EBAU por comunidad</h1>
      <p class="lede">
        Exámenes oficiales de la prueba de acceso (Economía de la Empresa) de años anteriores,
        organizados por comunidad autónoma y convocatoria, con su resolución. {totalDisponibles > 0
          ? `${totalDisponibles} exámenes disponibles; el resto, próximamente.`
          : 'Se irán publicando por comunidad; los que faltan aparecen como próximamente.'}
      </p>
    </div>
  </section>

  <section class="lista">
    <div class="container">
      {grupos.map((g) => (
        <div class="ccaa">
          <h2 class="ccaa__title serif">{g.ccaa.label}</h2>
          <table class="tabla">
            <thead>
              <tr><th>Convocatoria</th><th>Examen</th><th>Resolución</th></tr>
            </thead>
            <tbody>
              {g.filas.map((f) => (
                <tr class={f.proximamente ? 'is-prox' : ''}>
                  <td class="conv">{f.anio} · {f.convLabel}</td>
                  <td>
                    {f.examen
                      ? <a class="dl" href={f.examen} download>Descargar examen</a>
                      : <span class="prox">Próximamente</span>}
                  </td>
                  <td>
                    {f.solucion
                      ? <a class="dl" href={f.solucion} download>Descargar resolución</a>
                      : (f.examen ? <span class="prox">—</span> : <span class="prox">Próximamente</span>)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  </section>

  <section class="nota">
    <div class="container">
      <p class="nota-text">
        Los exámenes son documentos oficiales de las pruebas de acceso a la universidad de
        cada comunidad autónoma, alojados aquí con fines educativos y de estudio. Cada PDF
        procede de la fuente oficial correspondiente. Confirma siempre el modelo vigente de
        tu convocatoria en el portal oficial de tu comunidad.
      </p>
    </div>
  </section>

  <div class="container back-link">
    <a href={`/${a.slug}/ebau/`}>← Preparación EBAU</a>
  </div>
</BaseLayout>

<style>
  .container { max-width: 1240px; margin: 0 auto; padding: 0 clamp(1.5rem, 4vw, 3rem); }
  .breadcrumb { font-size: 0.92rem; color: var(--color-ink-mute); margin: 2rem 0; }
  .breadcrumb a { color: var(--color-ink-mute); text-decoration: none; }
  .breadcrumb a:hover { color: var(--color-terra); }
  .breadcrumb .sep { margin: 0 0.5em; color: var(--color-mustard); }

  .hero { padding: 1rem 0 2rem; }
  .kicker { font-family: var(--font-sans); font-size: 0.8rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-terra); }
  h1 { margin: 0.6rem 0 0.8rem; }
  .lede { font-size: 1.2rem; color: var(--color-ink-soft); line-height: 1.55; max-width: 62ch; }

  .lista { padding: 0 0 2rem; }
  .ccaa { margin-bottom: 2.2rem; }
  .ccaa__title { font-size: 1.4rem; margin: 0 0 0.7rem; padding-bottom: 0.4rem; border-bottom: 1px solid var(--color-line); color: var(--color-ink); }
  .tabla { width: 100%; border-collapse: collapse; font-size: 0.95rem; }
  .tabla th { text-align: left; font-family: var(--font-sans); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--color-ink-mute); font-weight: 700; padding: 0.4rem 0.6rem; border-bottom: 1px solid var(--color-line); }
  .tabla td { padding: 0.55rem 0.6rem; border-bottom: 1px solid var(--color-line-soft, var(--color-line)); vertical-align: middle; }
  .tabla .conv { font-family: var(--font-mono); font-size: 0.85rem; color: var(--color-ink); white-space: nowrap; }
  tr.is-prox .conv { color: var(--color-ink-mute); }
  .dl { font-family: var(--font-sans); font-size: 0.9rem; font-weight: 600; color: var(--color-terra); text-decoration: none; }
  .dl:hover { text-decoration: underline; }
  .prox { font-family: var(--font-sans); font-size: 0.85rem; color: var(--color-ink-mute); }

  .nota { padding: 0 0 1.5rem; }
  .nota-text { font-family: var(--font-serif); font-style: italic; font-size: 1rem; color: var(--color-ink-mute); max-width: 70ch; line-height: 1.5; border-top: 1px dashed var(--color-line); padding-top: 1.2rem; }

  .back-link { padding: 0 0 3rem; }
  .back-link a { font-family: var(--font-sans); font-size: 0.95rem; font-weight: 500; color: var(--color-terra); text-decoration: none; }
  .back-link a:hover { text-decoration: underline; }
</style>
```

- [ ] **Step 2: Type-check + build (no PDFs yet → all próximamente)**

Run: `npx astro check --minimumSeverity error 2>&1 | grep "ebau/examenes"`
Expected: no output (no errors in this file). Note: ~12 pre-existing unrelated errors elsewhere; ignore.
Run: `npm run build 2>&1 | tail -5`
Expected: build succeeds; `dist/client/edmn-2bach/ebau/examenes/index.html` exists and shows "Próximamente" everywhere (no PDFs downloaded yet).

- [ ] **Step 3: Commit**

```bash
git add "src/pages/[asignatura]/ebau/examenes/index.astro"
git commit -m "feat(ebau): per-CCAA exam listing route with build-time file detection"
```

---

## Task 3: Link the new section from the EBAU index

**Files:**
- Modify: `src/pages/[asignatura]/ebau/index.astro`

- [ ] **Step 1: Add a callout after the hero's `.downloads` block**

In `src/pages/[asignatura]/ebau/index.astro`, inside the `.hero`'s `<div class="container">`,
immediately AFTER the closing `</div>` of `<div class="downloads"> … </div>` and BEFORE the
`<p class="adapt-note">`, insert:

```astro
      <p class="examenes-link">
        <a href={`/${a.slug}/ebau/examenes/`}>↗ Exámenes EBAU oficiales de otras comunidades (con resolución)</a>
      </p>
```

- [ ] **Step 2: Add the style**

Inside the `<style>` block (after the `.adapt-note` rule, or anywhere in the block), add:

```css
  .examenes-link { margin: 0.8rem 0 0; }
  .examenes-link a { font-family: var(--font-sans); font-size: 0.95rem; font-weight: 600; color: var(--color-terra); text-decoration: none; }
  .examenes-link a:hover { text-decoration: underline; }
```

- [ ] **Step 3: Type-check + commit**

Run: `npx astro check --minimumSeverity error 2>&1 | grep "ebau/index"`
Expected: no output.

```bash
git add "src/pages/[asignatura]/ebau/index.astro"
git commit -m "feat(ebau): link the per-CCAA exams section from EBAU index"
```

---

## Task 4: Download official PDFs (17 CCAA, subagents)

**Files:**
- Create (download): `public/ebau-examenes/{ccaa}/empresa-{anio}-{conv}-{tipo}.pdf`

This is a research + download task. Dispatch **one subagent per comunidad** (17 total). The
CCAA slugs (folder names) are exactly those in `CCAA_LIST` (Task 1).

- [ ] **Step 1: For each comunidad, the subagent does:**

1. **Search** (WebSearch) the OFFICIAL source for that comunidad's «Economía de la Empresa»
   (alias «Empresa y Diseño de Modelos de Negocio») access-exam (EBAU/PAU/PEvAU/EvAU/Selectividad)
   for **2024 and 2025**, convocatoria **ordinaria (junio)** and **extraordinaria (julio)**,
   plus the **criterios de corrección / solución**. Prefer the coordinating university or the
   comunidad's education portal. The subject slug differs by region (CV uses "empresa"); search
   both names.
2. For each PDF with a **direct URL**, download with curl to the exact path:
   `public/ebau-examenes/{ccaa}/empresa-{anio}-{conv}-{tipo}.pdf`
   where `{anio}`∈{2024,2025}, `{conv}`∈{junio,julio}, `{tipo}`∈{examen,solucion}.
   Use: `curl -sS -L --max-time 60 -o "<path>" "<url>"` (create the folder first with `mkdir -p`).
3. **Verify** each downloaded file; delete it if it fails ANY check:
   - HTTP was 200 and content is a real PDF: first 5 bytes are `%PDF-`
     (`head -c 5 file | grep -q '%PDF-'`).
   - Size > 20 KB (`[ $(wc -c < file) -gt 20000 ]`). (Guards against HTML error pages / stubs.)
4. **Do NOT fabricate or guess**: if no official direct PDF is found for a slot, leave it
   empty (the page shows "próximamente"). Do NOT rename unrelated PDFs.
5. **Report**: a table of the 8 slots (2024/2025 × junio/julio × examen/solucion → really
   4 examen + 4 solucion), which were filled, the exact source URL used for each, and which
   are missing and why.

   Example verify snippet the subagent should use after each download:
   ```bash
   f="public/ebau-examenes/madrid/empresa-2025-junio-examen.pdf"
   if head -c 5 "$f" | grep -q '%PDF-' && [ "$(wc -c < "$f")" -gt 20000 ]; then echo "OK $f"; else echo "BAD $f"; rm -f "$f"; fi
   ```

- [ ] **Step 2: After all subagents, sanity-check the downloads**

Run: `find public/ebau-examenes -name '*.pdf' | wc -l` (count) and
`for f in $(find public/ebau-examenes -name '*.pdf'); do head -c 5 "$f" | grep -q '%PDF-' || echo "NOT PDF: $f"; done`
Expected: a count > 0 and NO "NOT PDF" lines.

- [ ] **Step 3: Commit the downloaded PDFs**

```bash
git add public/ebau-examenes
git commit -m "content(ebau): add official EBAU exams + solutions per comunidad (first batch)"
```

---

## Task 5: Build, verify, manual review

- [ ] **Step 1: Full test suite**

Run: `npm test`
Expected: PASS, including the new `ebau-examenes` helper tests.

- [ ] **Step 2: Build and confirm detection**

Run: `npm run build 2>&1 | tail -5`
Expected: success. The page `/edmn-2bach/ebau/examenes/` now shows "Descargar examen/resolución"
for the slots whose PDF exists and "Próximamente" for the rest (and for all 2026).

- [ ] **Step 3: Coverage report**

Run: `find public/ebau-examenes -type f -name '*.pdf' | sed -E 's#public/ebau-examenes/##' | sort`
List the coverage so Pau sees exactly which comunidades/años/convocatorias are filled.

- [ ] **Step 4: Manual review (Pau gate — exactitud)**

Open a sample of PDFs (a couple of comunidades) and confirm each is the CORRECT exam
(comunidad/año/convocatoria, asignatura Economía de la Empresa) and that the solución matches.
Content accuracy is critical; this is the gate before considering it done.

- [ ] **Step 5: Final commit (if any fixes)**

```bash
git add -A
git commit -m "chore(ebau): coverage tweaks after review"
```

---

## Self-Review notes (coverage vs spec)

- Registry (17 CCAA CV-first, años, convocatorias, path/href helpers) + TDD: Task 1. ✓
- Hosted PDFs under `public/ebau-examenes/{ccaa}/empresa-{anio}-{conv}-{tipo}.pdf`: Tasks 1 (convention), 4 (files). ✓
- Build-time file detection → download vs "próximamente"; 2026 always próximamente: Task 2. ✓
- New route grouped by comunidad, mirror of olimpiada UI; attribution note: Task 2. ✓
- Link from existing EBAU section: Task 3. ✓
- Download from official sources, all 17 CCAA, verify %PDF + size, no fabrication: Task 4. ✓
- Partial coverage handled (missing → próximamente), no silent faking: Tasks 2, 4. ✓
- Verification (tests, build, coverage list, manual gate): Task 5. ✓
- Only edmn-2bach (getStaticPaths gated to subjects with published EBAU): Task 2. ✓
```
