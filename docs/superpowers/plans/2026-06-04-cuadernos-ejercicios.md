# Cuadernos de ejercicios — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or executing-plans. Steps use `- [ ]`.

**Goal:** Dual-edition exercise workbook (student/teacher) with worked solutions on quantitative exercises and a per-activity curricular fit (sabers + CE + CC).

**Architecture:** A `modo` route param (`profesor`/`alumno`) makes two static print pages from the same template; teacher shows solutions, student hides them. New `tipo: ejercicio` activities carry `solucion` steps; sabers are derived from the libro unit. The build script prints both editions to PDF.

**Tech Stack:** Astro 5 SSG, pagedjs-cli, content collections, Vitest.

---

## File Structure
- `src/content.config.ts` — MODIFY: add `solucion`, `sabers` to `actividades`.
- `src/lib/cuaderno/sabers.ts` — NEW: `sabersDeActividad(act, libroByUnit)` (own field or derive from libro unit). Pure, tested.
- `src/pages/[asignatura]/actividades/imprimir.astro` → MOVE to `src/pages/[asignatura]/actividades/imprimir/[modo].astro` — add `modo` param, curricular line, solucion box, conditional solucionario.
- `scripts/build-workbook-pdf.mjs` — MODIFY: print profesor + alumno per asignatura.
- `src/pages/[asignatura]/actividades/index.astro` — MODIFY: two download buttons; preview link → `/imprimir/profesor/?preview=1`.
- `src/content/asignaturas/*/actividades/*.md` — NEW exercise files (Fase 2).

---

# FASE 1 — Marco

## Task 1: Schema fields
- [ ] In `src/content.config.ts` `actividades` schema add:
```ts
    solucion: z.array(z.string()).default([]),
    sabers: z.array(z.string()).default([]),
```
- [ ] `npx astro check --minimumSeverity error` → no new errors. Commit.

## Task 2: sabers derivation helper (TDD)
- [ ] Test `src/lib/cuaderno/sabers.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { sabersDeActividad } from './sabers.ts';
const libroByUnit = new Map([['eco-1bach#1', ['A.1', 'A.3']]]);
describe('sabersDeActividad', () => {
  it('uses the activity own sabers when present', () => {
    expect(sabersDeActividad({ asignatura: 'eco-1bach', unidad_relacionada: 1, sabers: ['B.2'] }, libroByUnit)).toEqual(['B.2']);
  });
  it('derives from the libro unit when the activity has none', () => {
    expect(sabersDeActividad({ asignatura: 'eco-1bach', unidad_relacionada: 1, sabers: [] }, libroByUnit)).toEqual(['A.1', 'A.3']);
  });
  it('returns [] when neither exists', () => {
    expect(sabersDeActividad({ asignatura: 'x', unidad_relacionada: 9, sabers: [] }, libroByUnit)).toEqual([]);
  });
});
```
- [ ] Implement `src/lib/cuaderno/sabers.ts`:
```ts
export interface ActLike { asignatura: string; unidad_relacionada: number; sabers?: string[]; }
export function sabersDeActividad(act: ActLike, libroByUnit: Map<string, string[]>): string[] {
  if (act.sabers && act.sabers.length) return act.sabers;
  return libroByUnit.get(`${act.asignatura}#${act.unidad_relacionada}`) ?? [];
}
```
- [ ] Test green. Commit.

## Task 3: Print route — modo param + curricular + solucion + conditional solucionario
- [ ] `git mv "src/pages/[asignatura]/actividades/imprimir.astro" "src/pages/[asignatura]/actividades/imprimir/[modo].astro"`.
- [ ] In `getStaticPaths`, emit two paths per asignatura: `modo: 'profesor'` and `modo: 'alumno'` (keep the same props). Build a `libroByUnit` map: `getCollection('libro')` → `Map<asig#unidad, data.sabers>`, pass in props.
- [ ] In the frontmatter: `const esProfesor = Astro.params.modo !== 'alumno';`. Import `sabersDeActividad`.
- [ ] In each activity render (`.act`), after the title/meta, add a curricular ribbon:
```astro
<p class="act__curricular">
  {sabersDeActividad(act.data, libroByUnit).length > 0 && <><strong>Sabers</strong> {sabersDeActividad(act.data, libroByUnit).join(', ')} · </>}
  {act.data.competencias_especificas.length > 0 && <><strong>Comp. específicas</strong> {act.data.competencias_especificas.join(', ')} · </>}
  {act.data.competencias_clave.length > 0 && <><strong>Comp. clave</strong> {act.data.competencias_clave.join(', ')}</>}
</p>
```
- [ ] After `.act__body`, render the solution box for exercises, teacher only:
```astro
{esProfesor && act.data.solucion.length > 0 && (
  <div class="act__solucion">
    <span class="act__solucion-h">Solución</span>
    <ol>{act.data.solucion.map((p) => <li set:html={p} />)}</ol>
  </div>
)}
```
- [ ] Wrap the final `<section class="solucionario">…</section>` (and any "edición para profesorado" intro line that mentions the solucionario) in `{esProfesor && ( … )}`.
- [ ] In the header subtitle, show the edition: `{esProfesor ? 'Edición del profesor · con solucionario' : 'Edición del alumno'}`.
- [ ] Add CSS for `.act__curricular` (small mono/sans line, muted) and `.act__solucion` (bordered box, accent left rule) in the page `<style>`.
- [ ] `npx astro build` green; the alumno page contains no `act__solucion` / `solucionario`. Commit.

## Task 4: Build two PDFs
- [ ] In `scripts/build-workbook-pdf.mjs`, for each asignatura render BOTH:
  - profesor: `http://localhost:${PORT}/${slug}/actividades/imprimir/profesor/` → `<slug>-cuaderno.pdf`
  - alumno: `…/imprimir/alumno/` → `<slug>-cuaderno-alumno.pdf`
- [ ] Run for one asignatura, confirm 2 PDFs, and that the alumno PDF has no solucionario. Commit.

## Task 5: Hub buttons
- [ ] In `src/pages/[asignatura]/actividades/index.astro`: update the preview link to `/${a.slug}/actividades/imprimir/profesor/?preview=1`; add a second download button `<slug>-cuaderno-alumno.pdf` labelled "Cuaderno del alumno (sin soluciones)"; relabel the existing one "Cuaderno del profesor (con solucionario)". Build green. Commit.

## Task 6: PR Fase 1 (marco), validar visualmente con Pau.

---

# FASE 2 — Contenido: ejercicios cuantitativos
- [ ] Per quantitative unit (calc↔unit map: PuntoMuerto, Ratios, Elasticidad, EquilibrioMercado, MultiplicadorGasto/ADAS, VANTIR/DCF, InteresCompuesto, NominaESO/IRPF, Productividad), author 1-2 `tipo: ejercicio` activities with realistic data, a verified numeric `solucion` (step list), `competencias_especificas`, `competencias_clave`. Subagent per asignatura (write-only); each exercise's solution recomputed.
- [ ] No MDX-safety issues (these are `.md`, plain). Build green per asignatura. Commit per asignatura.

# FASE 3 — Regenerar
- [ ] `npm run build && node scripts/build-workbook-pdf.mjs` → 18 PDFs (9 profesor + 9 alumno). Spot-check: alumno sin soluciones, profesor con ellas, curricular visible. Commit PDFs. PR → main.

---

## Self-Review (plan vs spec)
- Spec §3.1 solucion+sabers → Task 1. ✓
- Spec §3.1 derive sabers from libro → Task 2 (helper, TDD). ✓
- Spec §3.2 curricular ribbon → Task 3. ✓
- Spec §3.3 dual edition (modo) → Task 3 (route param, SSG-correct; query-param approach in spec revised to a route param because pages are static). ✓
- Spec §3.4 two PDFs → Task 4. ✓
- Spec §3.5 hub buttons → Task 5. ✓
- Spec §3.6 content → Fase 2. ✓
- Spec §5 testing → Task 2 test, Task 3/4 build + no-leak check. ✓
