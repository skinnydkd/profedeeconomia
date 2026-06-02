# «Dinámicas» — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the transversal `/dinamicas/` section (framework + first pilot dinámica) so any classroom dynamic can be authored as a single MDX with printable role cards and a cross-asignatura curriculum map.

**Architecture:** A new flat `dinamicas` content collection (modeled on the existing `proyectoTransversal` / «De cero a empresa»), a hub page grouping dinámicas by family, a detail page rendering MDX body + printable materials with an `@media print` mode, and pure build helpers (family grouping + reference integrity) covered by Vitest. Family color-coding reuses existing validated tokens — no new colors.

**Tech Stack:** Astro 5 (content collections, `getCollection`/`render`), MDX, Vitest, plain CSS with `@media print`. No Preact island needed.

**Scope of THIS plan:** PR 1 — the framework end-to-end plus one fully authored pilot dinámica («La entrevista de trabajo»). PRs 2–5 author the remaining ~23 dinámicas following the exact pattern the pilot establishes; their workflow is the Appendix, not numbered tasks (repetitive MDX authoring, not new engineering).

**Reference docs:** `docs/superpowers/specs/2026-06-02-dinamicas-design.md`.

Reused patterns (read before starting):
- `src/pages/emprendimiento/proyecto/[fase].astro` — detail page layout/prose styles.
- `src/components/emprendimiento/PuenteUnidades.astro` — renders `unidades_relacionadas` (reused as-is for the curriculum map).
- `src/components/emprendimiento/FaseMeta.astro` — metadata badges (model for `DinamicaMeta`).
- `src/lib/emprendimiento.ts` — `unidadSlug(libro, asignatura, unidad)` helper.
- `src/components/actividades/parse-tree.test.ts` — Vitest style in this repo.

---

## Task 1: Family metadata + pure build helpers (`src/lib/dinamicas.ts`)

**Files:**
- Create: `src/lib/dinamicas.ts`
- Test: `src/lib/dinamicas.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/dinamicas.test.ts
import { describe, it, expect } from 'vitest';
import { FAMILIAS, familiaMeta, groupByFamilia, findBrokenUnidadRefs } from './dinamicas.ts';

type D = { slug: string; data: { familia: string; orden: number; title: string;
  unidades_relacionadas: { asignatura: string; unidad: number }[] } };

const make = (slug: string, familia: string, orden: number, refs: D['data']['unidades_relacionadas'] = []): D =>
  ({ slug, data: { familia, orden, title: slug, unidades_relacionadas: refs } });

describe('FAMILIAS', () => {
  it('declares the 7 families in display order with a color token each', () => {
    expect(FAMILIAS.map((f) => f.slug)).toEqual([
      'mercat-treball', 'mercats-preus', 'distribucion-produccion',
      'decisiones-comunes', 'sistemas-debates', 'empresa-organizacion', 'teoria-juegos',
    ]);
    for (const f of FAMILIAS) expect(f.colorVar).toMatch(/^--color-[a-z0-9]+$/);
  });
});

describe('familiaMeta', () => {
  it('returns the metadata for a known family', () => {
    expect(familiaMeta('teoria-juegos').label).toBe('Teoría de juegos');
  });
  it('throws on an unknown family', () => {
    expect(() => familiaMeta('nope')).toThrow(/unknown familia/i);
  });
});

describe('groupByFamilia', () => {
  it('groups dinámicas by family in FAMILIAS order, sorted by orden within each', () => {
    const items = [
      make('b1', 'mercats-preus', 2), make('a2', 'mercat-treball', 2),
      make('a1', 'mercat-treball', 1), make('b0', 'mercats-preus', 1),
    ];
    const groups = groupByFamilia(items);
    expect(groups.map((g) => g.familia.slug)).toEqual(['mercat-treball', 'mercats-preus']);
    expect(groups[0].dinamicas.map((d) => d.slug)).toEqual(['a1', 'a2']);
    expect(groups[1].dinamicas.map((d) => d.slug)).toEqual(['b0', 'b1']);
  });
  it('omits families that have no dinámicas', () => {
    const groups = groupByFamilia([make('x', 'teoria-juegos', 1)]);
    expect(groups).toHaveLength(1);
    expect(groups[0].familia.slug).toBe('teoria-juegos');
  });
});

describe('findBrokenUnidadRefs', () => {
  // libroUnits: set of "asignatura#unidad" that actually exist & are published
  const libroUnits = new Set(['fopp-4eso#3', 'eeae-bach#5']);
  it('returns nothing when every ref points to an existing unit', () => {
    const items = [make('a1', 'mercat-treball', 1, [{ asignatura: 'fopp-4eso', unidad: 3 }])];
    expect(findBrokenUnidadRefs(items, libroUnits)).toEqual([]);
  });
  it('flags a ref whose unit does not exist', () => {
    const items = [make('a1', 'mercat-treball', 1, [
      { asignatura: 'fopp-4eso', unidad: 3 }, { asignatura: 'eeae-bach', unidad: 99 },
    ])];
    expect(findBrokenUnidadRefs(items, libroUnits)).toEqual([
      { slug: 'a1', asignatura: 'eeae-bach', unidad: 99 },
    ]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/dinamicas.test.ts`
Expected: FAIL — `Cannot find module './dinamicas.ts'`.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/lib/dinamicas.ts
/**
 * Metadata and pure build helpers for the transversal «Dinámicas» section.
 * Family color-coding reuses already-validated tokens from global.css — no new colors.
 */

export type FamiliaSlug =
  | 'mercat-treball' | 'mercats-preus' | 'distribucion-produccion'
  | 'decisiones-comunes' | 'sistemas-debates' | 'empresa-organizacion' | 'teoria-juegos';

export interface Familia {
  slug: FamiliaSlug;
  label: string;
  /** One-line intro shown at the top of the family group on the hub. */
  intro: string;
  /** CSS custom property reused for the family accent (defined in global.css). */
  colorVar: string;
}

export const FAMILIAS: Familia[] = [
  { slug: 'mercat-treball',         label: 'Mercado de trabajo',        intro: 'Entrevistas, selección y negociación salarial.',                 colorVar: '--color-fopp' },
  { slug: 'mercats-preus',          label: 'Mercados y precios',        intro: 'Cómo se forman los precios: competencia, monopolio y cártel.',   colorVar: '--color-eco1' },
  { slug: 'distribucion-produccion',label: 'Distribución y producción', intro: 'Quién se queda qué valor en una cadena de producción.',          colorVar: '--color-gpe' },
  { slug: 'decisiones-comunes',     label: 'Decisiones y bienes comunes', intro: 'Cooperar o aprovecharse: comunes, bienes públicos y comercio.', colorVar: '--color-taller3' },
  { slug: 'sistemas-debates',       label: 'Sistemas económicos y debates', intro: 'Mercado, Estado y los grandes debates, con roles y turnos.',  colorVar: '--color-ipe2' },
  { slug: 'empresa-organizacion',   label: 'Empresa y organización',    intro: 'Decidir en equipo: juntas, cooperativas y cadenas de suministro.', colorVar: '--color-edmn' },
  { slug: 'teoria-juegos',          label: 'Teoría de juegos',          intro: 'Juegos clásicos y subastas para ver la estrategia en acción.',   colorVar: '--color-mustard' },
];

const BY_SLUG = new Map(FAMILIAS.map((f) => [f.slug, f]));

export function familiaMeta(slug: string): Familia {
  const f = BY_SLUG.get(slug as FamiliaSlug);
  if (!f) throw new Error(`unknown familia: ${slug}`);
  return f;
}

interface HasFamilia {
  slug: string;
  data: { familia: string; orden: number; title: string;
    unidades_relacionadas: { asignatura: string; unidad: number }[] };
}

export interface FamiliaGroup<T extends HasFamilia> { familia: Familia; dinamicas: T[]; }

/** Group dinámicas by family in FAMILIAS order; within each, sort by `orden`. Empty families are dropped. */
export function groupByFamilia<T extends HasFamilia>(items: T[]): FamiliaGroup<T>[] {
  return FAMILIAS.map((familia) => ({
    familia,
    dinamicas: items
      .filter((it) => it.data.familia === familia.slug)
      .sort((a, b) => a.data.orden - b.data.orden),
  })).filter((g) => g.dinamicas.length > 0);
}

export interface BrokenRef { slug: string; asignatura: string; unidad: number; }

/** Return every `unidades_relacionadas` entry that does not match an existing published unit. */
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

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/dinamicas.test.ts`
Expected: PASS (all cases).

- [ ] **Step 5: Commit**

```bash
git add src/lib/dinamicas.ts src/lib/dinamicas.test.ts
git commit -m "feat(dinamicas): family metadata and build helpers"
```

---

## Task 2: Register the `dinamicas` content collection

**Files:**
- Modify: `src/content.config.ts` (add collection + register in `collections`)

- [ ] **Step 1: Add the collection definition**

Insert after the `proyectoTransversal` collection block (keep the existing `ASIGNATURA_SLUGS`, `LANGS`, `ESTADOS` consts already declared at the top of the file):

```ts
/* =========================================================
   dinamicas/{familia}/{nn}-{slug}.mdx — transversal classroom
   dynamics (role-plays, market simulations, debates). NOT tied
   to a single asignatura; each maps to units across asignaturas
   via `unidades_relacionadas`. Single source for the page + print.
   ========================================================= */
const dinamicas = defineCollection({
  loader: glob({ pattern: 'dinamicas/**/*.{md,mdx}', base: './src/content' }),
  schema: z.object({
    title: z.string(),
    familia: z.enum([
      'mercat-treball', 'mercats-preus', 'distribucion-produccion',
      'decisiones-comunes', 'sistemas-debates', 'empresa-organizacion', 'teoria-juegos',
    ]),
    /** Sort key within the family; also the filename prefix. */
    orden: z.number().int().min(0),
    /** One-line summary for the hub card. */
    descripcion: z.string(),
    tipo: z.enum(['role-play', 'simulacion-mercado', 'juego-experimental', 'debate', 'negociacion']),
    duracion: z.string(),
    agrupacion: z.string(),
    participantes: z.string().optional(),
    nivel: z.array(z.enum(['eso', 'bach', 'fp'])).min(1),
    objetivos: z.array(z.string()).min(1),
    conceptos_clave: z.array(z.string()).default([]),
    materiales_necesarios: z.array(z.string()).default([]),
    /** Cross-asignatura curriculum map. */
    unidades_relacionadas: z.array(z.object({
      asignatura: z.enum(ASIGNATURA_SLUGS),
      unidad: z.number().int().min(1),
      nota: z.string().optional(),
    })).default([]),
    competencias_clave: z.array(z.string()).default([]),
    competencias_especificas: z.array(z.string()).default([]),
    lang: z.enum(LANGS).default('es'),
    estado: z.enum(ESTADOS).default('borrador'),
  }),
});
```

- [ ] **Step 2: Register it in the `collections` export**

In the `export const collections = { ... }` object at the bottom, add `dinamicas,` to the list (next to `proyectoTransversal,`).

- [ ] **Step 3: Verify the config typechecks**

Run: `npx astro sync`
Expected: completes with no error; `dinamicas` types are generated.

- [ ] **Step 4: Commit**

```bash
git add src/content.config.ts
git commit -m "feat(dinamicas): register dinamicas content collection"
```

---

## Task 3: Add `dinamicas` to the «Otros» menu

**Files:**
- Modify: `src/lib/asignaturas.ts:233-237` (`SECCIONES_TRANSVERSALES`)
- Test: `src/lib/asignaturas.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/asignaturas.test.ts
import { describe, it, expect } from 'vitest';
import { SECCIONES_TRANSVERSALES } from './asignaturas.ts';

describe('SECCIONES_TRANSVERSALES', () => {
  it('includes the dinamicas section after emprendimiento', () => {
    const slugs = SECCIONES_TRANSVERSALES.map((s) => s.slug);
    expect(slugs).toContain('dinamicas');
    expect(slugs.indexOf('dinamicas')).toBe(slugs.indexOf('emprendimiento') + 1);
  });
  it('gives the dinamicas section a label and description', () => {
    const s = SECCIONES_TRANSVERSALES.find((x) => x.slug === 'dinamicas');
    expect(s?.label).toBe('Dinámicas');
    expect(s?.description.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/asignaturas.test.ts`
Expected: FAIL — `dinamicas` not found in the array.

- [ ] **Step 3: Add the section entry**

Replace the `SECCIONES_TRANSVERSALES` array body so it reads:

```ts
export const SECCIONES_TRANSVERSALES = [
  { slug: 'juegos',         label: 'Juegos',         description: 'Material para una clase activa.' },
  { slug: 'herramientas',   label: 'Herramientas',   description: 'Generadores de SA LOMLOE y pruebas.' },
  { slug: 'emprendimiento', label: 'Emprendimiento', description: 'Plantillas y dinámicas transversales.' },
  { slug: 'dinamicas',      label: 'Dinámicas',      description: 'Role-plays y simulaciones para hacer en clase.' },
] as const;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/asignaturas.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/asignaturas.ts src/lib/asignaturas.test.ts
git commit -m "feat(dinamicas): add Dinámicas to the Otros menu"
```

---

## Task 4: Printable material components

**Files:**
- Create: `src/components/dinamicas/RoleCard.astro`
- Create: `src/components/dinamicas/FichaAlumno.astro`
- Create: `src/components/dinamicas/PrintButton.astro`
- Create: `src/components/dinamicas/DinamicaMeta.astro`

These are presentational Astro components with no logic to unit-test; they are verified by the build + visual check in Task 7. Write the actual markup now (no placeholders).

- [ ] **Step 1: RoleCard.astro**

```astro
---
/**
 * A printable role/position card for a classroom dynamic. Rendered as a visual
 * block on the page and isolated to its own A4 page in print mode via
 * `data-print` + `.print-block` (see [slug].astro print CSS).
 */
interface Props { rol: string; reparto?: string; }
const { rol, reparto } = Astro.props;
---
<div class="role-card print-block" data-print>
  <div class="role-card__head">
    <span class="role-card__tag">Tarjeta de rol</span>
    <h4 class="role-card__rol">{rol}</h4>
    {reparto && <span class="role-card__reparto">{reparto}</span>}
  </div>
  <div class="role-card__body"><slot /></div>
  <span class="role-card__cut" aria-hidden="true">✂ recorta por aquí</span>
</div>
<style>
  .role-card { border: 1.5px dashed var(--color-line); border-radius: 8px; padding: 1.1rem 1.3rem; margin: 1rem 0; background: var(--color-paper); }
  .role-card__head { display: flex; flex-wrap: wrap; align-items: baseline; gap: 0.6rem; border-bottom: 1px solid var(--color-line-soft); padding-bottom: 0.5rem; margin-bottom: 0.7rem; }
  .role-card__tag { font-family: var(--font-sans); font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-terra); }
  .role-card__rol { font-family: var(--font-serif); font-size: 1.2rem; margin: 0; font-weight: 500; }
  .role-card__reparto { font-family: var(--font-sans); font-size: 0.8rem; color: var(--color-ink-mute); margin-left: auto; }
  .role-card__body { font-size: 1rem; line-height: 1.55; }
  .role-card__body :global(p) { margin: 0 0 0.6em; }
  .role-card__cut { display: block; margin-top: 0.8rem; font-family: var(--font-mono); font-size: 0.7rem; color: var(--color-ink-mute); }
</style>
```

- [ ] **Step 2: FichaAlumno.astro**

```astro
---
/**
 * A printable student worksheet / observation sheet. Same print isolation as
 * RoleCard. Use for tables, blanks to fill in, observation rubrics.
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

- [ ] **Step 3: PrintButton.astro**

```astro
---
/** Button that triggers the browser print dialog. Hidden in print output. */
---
<button class="print-btn no-print" type="button" data-print-trigger>
  Imprimir materiales
</button>
<script>
  document.querySelector('[data-print-trigger]')?.addEventListener('click', () => window.print());
</script>
<style>
  .print-btn { font-family: var(--font-sans); font-size: 0.9rem; font-weight: 600; color: var(--color-terra); background: transparent; border: 1.5px solid var(--color-terra); border-radius: 6px; padding: 0.5rem 1rem; cursor: pointer; transition: background .15s ease, color .15s ease; }
  .print-btn:hover { background: var(--color-terra); color: var(--color-paper); }
</style>
```

- [ ] **Step 4: DinamicaMeta.astro**

```astro
---
/**
 * Metadata badge row for a dinámica (duration, grouping, participants, level).
 * Modeled on emprendimiento/FaseMeta.astro.
 */
interface Props {
  tipo: string; duracion: string; agrupacion: string;
  participantes?: string; nivel: string[];
}
const { tipo, duracion, agrupacion, participantes, nivel } = Astro.props;
const TIPO_LABEL: Record<string, string> = {
  'role-play': 'Role-play', 'simulacion-mercado': 'Simulación de mercado',
  'juego-experimental': 'Juego experimental', 'debate': 'Debate', 'negociacion': 'Negociación',
};
const NIVEL_LABEL: Record<string, string> = { eso: 'ESO', bach: 'Bachillerato', fp: 'FP' };
---
<dl class="meta">
  <div><dt>Tipo</dt><dd>{TIPO_LABEL[tipo] ?? tipo}</dd></div>
  <div><dt>Duración</dt><dd>{duracion}</dd></div>
  <div><dt>Agrupación</dt><dd>{agrupacion}</dd></div>
  {participantes && <div><dt>Participantes</dt><dd>{participantes}</dd></div>}
  <div><dt>Nivel</dt><dd>{nivel.map((n) => NIVEL_LABEL[n] ?? n).join(' · ')}</dd></div>
</dl>
<style>
  .meta { display: flex; flex-wrap: wrap; gap: 1.4rem; margin: 1.4rem 0 2rem; padding: 1rem 1.2rem; background: var(--color-bg-cream); border-radius: 8px; }
  .meta div { display: flex; flex-direction: column; gap: 0.15rem; }
  .meta dt { font-family: var(--font-sans); font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-ink-mute); margin: 0; }
  .meta dd { font-family: var(--font-serif); font-size: 1rem; margin: 0; color: var(--color-ink); }
</style>
```

- [ ] **Step 5: Commit**

```bash
git add src/components/dinamicas/
git commit -m "feat(dinamicas): printable material components"
```

---

## Task 5: Pilot dinámica content (`01-entrevista-trabajo.mdx`)

**Files:**
- Create: `src/content/dinamicas/mercat-treball/01-entrevista-trabajo.mdx`

This is the worked example every later dinámica copies. `estado: 'publicado'` so it renders.

- [ ] **Step 1: Write the MDX**

```mdx
---
title: "La entrevista de trabajo"
familia: mercat-treball
orden: 1
descripcion: "Role-play de una entrevista de selección, con entrevistador, candidato y observadores que evalúan con rúbrica."
tipo: role-play
duracion: "1-2 sesiones"
agrupacion: "tríos (entrevistador, candidato, observador)"
participantes: "rota en grupos de 3; clase entera"
nivel: [eso, bach, fp]
objetivos:
  - "Preparar y afrontar una entrevista de trabajo real."
  - "Identificar qué valora quien selecciona y por qué."
  - "Dar y recibir retroalimentación con criterios objetivos."
conceptos_clave:
  - "Proceso de selección"
  - "Competencias profesionales"
  - "Marca personal"
  - "Comunicación no verbal"
materiales_necesarios:
  - "Tarjetas de rol impresas (una por participante)"
  - "Una oferta de empleo por grupo (puede usarse la de ejemplo)"
  - "Hoja de observación impresa (una por observador)"
unidades_relacionadas:
  - { asignatura: "fopp-4eso", unidad: 3, nota: "Búsqueda de empleo y proceso de selección." }
  - { asignatura: "eeae-bach", unidad: 5, nota: "Recursos humanos: reclutamiento y selección." }
competencias_clave: [CCL, CPSAA, CE, CD]
competencias_especificas: []
lang: es
estado: publicado
---

import Steps from '@components/Steps.astro';
import Callout from '@components/Callout.astro';
import RoleCard from '@components/dinamicas/RoleCard.astro';
import FichaAlumno from '@components/dinamicas/FichaAlumno.astro';

Una entrevista no se improvisa: se prepara. En esta dinámica el alumnado vive las
dos caras del proceso —quien selecciona y quien se presenta— y descubre, desde
dentro, qué marca la diferencia entre una buena y una mala entrevista.

## Cómo funciona

<Steps label="Desarrollo" title="De la oferta a la decisión">
  <li>**Reparto de roles.** En cada trío: un entrevistador, un candidato y un observador. Se reparten las tarjetas de rol.</li>
  <li>**Preparación (10 min).** El candidato prepara su presentación a partir de la oferta; el entrevistador prepara 5 preguntas; el observador estudia la hoja de observación.</li>
  <li>**Entrevista (8-10 min).** Se desarrolla la entrevista. El observador anota sin intervenir.</li>
  <li>**Feedback (5 min).** El observador comparte lo anotado con criterios, no opiniones.</li>
  <li>**Rotación.** Se rotan los roles para que todos pasen por los tres.</li>
</Steps>

## Guía del profesor

### Preparación

Imprime las tarjetas y la hoja de observación. Si tu grupo no tiene experiencia,
proyecta primero un ejemplo de oferta y desgranad juntos qué pide.

### Gestión en el aula

Cronometra las fases en voz alta. Pasa por los grupos y frena dos errores típicos:
el candidato que solo responde «sí/no» y el entrevistador que hace de interrogador
en lugar de conversar.

### El debrief (lo más importante)

Reunid a toda la clase y preguntad, en este orden:

- ¿Qué hizo que un candidato resultara convincente? (Recoged ejemplos concretos.)
- ¿Qué buscaba realmente el entrevistador detrás de cada pregunta?
- ¿Qué cambiaríais de vuestra propia entrevista ahora que la habéis vivido?

<Callout label="Idea clave" title="No se contrata al mejor, se contrata al que mejor lo demuestra">
La competencia importa, pero la entrevista evalúa cómo la comunicas. Esa es la
lección que el alumnado debe llevarse.
</Callout>

### Errores comunes

- Convertir el feedback en juicio personal. Recuérdales: se evalúa la entrevista, no a la persona.
- Candidatos que inventan experiencia. Mejor trabajar la honestidad bien presentada.

## Materiales repartibles

<RoleCard rol="Entrevistador/a" reparto="1 por grupo">
Representas al departamento de RRHH. Tu objetivo es saber si esta persona encaja
en el puesto. Prepara 5 preguntas: al menos una sobre una situación difícil
(«cuéntame una vez que…»). No interrogues: conversa.
</RoleCard>

<RoleCard rol="Candidato/a" reparto="1 por grupo">
Optas al puesto de la oferta. Prepara una presentación de 1 minuto: quién eres,
qué aportas y por qué este puesto. Lleva preparado un ejemplo concreto de algo
que hayas hecho bien.
</RoleCard>

<RoleCard rol="Observador/a" reparto="1 por grupo">
No intervienes. Observas y anotas en tu hoja: claridad, ejemplos concretos,
escucha y comunicación no verbal. Al final, das feedback con hechos, no opiniones.
</RoleCard>

<FichaAlumno titulo="Hoja de observación" subtitulo="Marca y anota un ejemplo concreto de cada criterio">

| Criterio | Insuficiente | Adecuado | Excelente | Ejemplo observado |
|---|---|---|---|---|
| Claridad del mensaje | | | | |
| Ejemplos concretos | | | | |
| Escucha y reacción | | | | |
| Comunicación no verbal | | | | |

</FichaAlumno>
```

- [ ] **Step 2: Verify it loads**

Run: `npx astro sync`
Expected: no schema error for the new entry.

- [ ] **Step 3: Commit**

```bash
git add src/content/dinamicas/
git commit -m "feat(dinamicas): pilot dinámica «La entrevista de trabajo»"
```

---

## Task 6: Detail page (`[slug].astro`) with print mode

**Files:**
- Create: `src/pages/dinamicas/[slug].astro`

Reuses `PuenteUnidades` (curriculum map), `DinamicaMeta`, `PrintButton`, and the prose styles from the emprendimiento phase page.

- [ ] **Step 1: Write the page**

```astro
---
/**
 * A single dinámica. `slug` is the collection entry id (e.g.
 * "mercat-treball/01-entrevista-trabajo"). Renders MDX body (cómo funciona +
 * guía del profe + materiales) plus metadata, curriculum map and competences.
 * Includes an @media print mode that isolates the `.print-block` materials.
 */
import BaseLayout from '@layouts/BaseLayout.astro';
import DinamicaMeta from '@components/dinamicas/DinamicaMeta.astro';
import PrintButton from '@components/dinamicas/PrintButton.astro';
import PuenteUnidades from '@components/emprendimiento/PuenteUnidades.astro';
import { familiaMeta } from '@/lib/dinamicas';
import { getCollection, render } from 'astro:content';
import type { GetStaticPaths } from 'astro';

export const getStaticPaths = (async () => {
  const all = (await getCollection('dinamicas')).filter((e) => e.data.estado === 'publicado');
  return all.map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
}) satisfies GetStaticPaths;

const { entry } = Astro.props;
const d = entry.data;
const { Content } = await render(entry);
const familia = familiaMeta(d.familia);
---

<BaseLayout title={`${d.title} — Dinámicas`} description={d.descripcion}>
  <div class="container">
    <nav class="breadcrumb no-print">
      <a href="/">Inicio</a> <span class="sep">›</span>
      <a href="/dinamicas/">Dinámicas</a> <span class="sep">›</span>
      <span>{d.title}</span>
    </nav>
  </div>

  <section class="body">
    <div class="container container--narrow">
      <span class="kicker" style={`color: var(${familia.colorVar})`}>{familia.label}</span>
      <h1>{d.title}</h1>
      <p class="lede">{d.descripcion}</p>

      <DinamicaMeta tipo={d.tipo} duracion={d.duracion} agrupacion={d.agrupacion}
        participantes={d.participantes} nivel={d.nivel} />

      {d.objetivos.length > 0 && (
        <section class="block no-print">
          <h2>Objetivos</h2>
          <ul>{d.objetivos.map((o) => <li>{o}</li>)}</ul>
          {d.conceptos_clave.length > 0 && (
            <p class="conceptos"><strong>Conceptos:</strong> {d.conceptos_clave.join(' · ')}</p>
          )}
        </section>
      )}

      {d.materiales_necesarios.length > 0 && (
        <section class="block no-print">
          <h2>Qué necesitas</h2>
          <ul>{d.materiales_necesarios.map((m) => <li>{m}</li>)}</ul>
        </section>
      )}

      <div class="print-bar no-print"><PrintButton /></div>

      <article class="prose">
        <Content />
      </article>

      <div class="no-print">
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

        <nav class="back"><a href="/dinamicas/">← Todas las dinámicas</a></nav>
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

  /* ── Print: keep only the repartible materials, one .print-block per page ── */
  @media print {
    :global(.site-header), :global(.site-footer), .no-print { display: none !important; }
    .body { padding: 0; }
    .prose :global(h2:not(:has(+ * .print-block))) { /* headings stay visible inline */ }
    .prose :global(.print-block) { break-after: page; }
    .prose :global(.print-block:last-of-type) { break-after: auto; }
  }
</style>
```

- [ ] **Step 2: Verify the page builds and renders**

Run: `npx astro build`
Expected: builds with no error; `dist/dinamicas/mercat-treball/01-entrevista-trabajo/index.html` exists.

Run: `node -e "const fs=require('fs');const p='dist/dinamicas/mercat-treball/01-entrevista-trabajo/index.html';const h=fs.readFileSync(p,'utf8');if(!h.includes('La entrevista de trabajo'))process.exit(1);if(!h.includes('Tarjeta de rol'))process.exit(1);if(!h.includes('Esto se trabaja en'))process.exit(1);console.log('OK');"`
Expected: prints `OK` (title, role card and curriculum map all present).

- [ ] **Step 3: Commit**

```bash
git add src/pages/dinamicas/\[slug\].astro
git commit -m "feat(dinamicas): dinámica detail page with print mode"
```

---

## Task 7: Hub page (`index.astro`)

**Files:**
- Create: `src/pages/dinamicas/index.astro`

- [ ] **Step 1: Write the hub**

```astro
---
/**
 * Dinámicas hub. Lists published dinámicas grouped by family (FAMILIAS order),
 * each card linking to its detail page. A lightweight client-side family filter.
 */
import BaseLayout from '@layouts/BaseLayout.astro';
import { groupByFamilia, FAMILIAS } from '@/lib/dinamicas';
import { getCollection } from 'astro:content';

const all = (await getCollection('dinamicas')).filter((e) => e.data.estado === 'publicado');
const groups = groupByFamilia(all.map((e) => ({ slug: e.id, data: e.data })));
const activeFamilias = new Set(groups.map((g) => g.familia.slug));
---

<BaseLayout
  title="Dinámicas"
  description="Role-plays, simulaciones de mercado, juegos y debates para hacer en clase, con materiales para profe y alumnado y su encaje curricular."
>
  <div class="container">
    <nav class="breadcrumb"><a href="/">Inicio</a> <span class="sep">›</span> <span>Dinámicas</span></nav>
  </div>

  <section class="hero">
    <div class="container">
      <span class="kicker">Material transversal</span>
      <h1><span class="serif-italic-wonk accent">Dinámicas</span> para hacer en clase.</h1>
      <p class="lede">
        Role-plays, simulaciones de mercado, juegos y debates listos para llevar al
        aula. Cada uno con su guía para el profe, materiales para repartir e imprimir,
        y el mapa de en qué unidades de qué asignaturas encaja.
      </p>
    </div>
  </section>

  <section class="filters">
    <div class="container">
      <button class="chip is-active" data-filter="all" type="button">Todas</button>
      {FAMILIAS.filter((f) => activeFamilias.has(f.slug)).map((f) => (
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
          {g.dinamicas.map((d) => (
            <a class="card" href={`/dinamicas/${d.slug}/`} style={`--fam-color: var(${g.familia.colorVar})`}>
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

- [ ] **Step 2: Verify the hub builds and lists the pilot**

Run: `npx astro build`
Expected: builds clean; `dist/dinamicas/index.html` exists.

Run: `node -e "const fs=require('fs');const h=fs.readFileSync('dist/dinamicas/index.html','utf8');if(!h.includes('La entrevista de trabajo'))process.exit(1);if(!h.includes('Mercado de trabajo'))process.exit(1);console.log('OK');"`
Expected: prints `OK`.

- [ ] **Step 3: Run the full test suite + commit**

Run: `npm run test`
Expected: all suites pass (including `dinamicas.test.ts` and `asignaturas.test.ts`).

```bash
git add src/pages/dinamicas/index.astro
git commit -m "feat(dinamicas): hub page with family grouping and filter"
```

---

## Task 8: Manual visual check (dev server)

**Files:** none (verification only).

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`

- [ ] **Step 2: Verify in the browser**

- Visit `/dinamicas/` → hero, the «Mercado de trabajo» family group, one card, working family filter chips.
- Open `/dinamicas/mercat-treball/01-entrevista-trabajo/` → metadata row, objetivos, «Cómo funciona» steps, guía del profe, three role cards, observation sheet, curriculum map, competences.
- Click **Imprimir materiales** (or browser print preview) → only the three role cards and the observation sheet appear, each on its own page; header/nav/theory hidden.
- Open the «Otros» menu in the header → **Dinámicas** entry appears and links to `/dinamicas/`.

- [ ] **Step 3: Stop the server**

Stop with Ctrl+C. No commit (verification task).

---

## Self-Review notes (addressed)

- **Spec coverage:** §4 architecture → Tasks 1–7; §4.1 schema → Task 2; §4.2 page → Task 6; §4.3 hub → Task 7; §4.4 colors → Task 1 `FAMILIAS.colorVar`; §7 testing → Tasks 1, 3, 7; menu entry → Task 3. The full ~24-dinámica catalogue (§5) is delivered by the Appendix workflow, not this plan.
- **Type consistency:** `groupByFamilia` / `familiaMeta` / `findBrokenUnidadRefs` signatures match between Task 1 (definition) and Tasks 6–7 (use). `colorVar` name is consistent across lib, detail page and hub.
- **Reused component:** `PuenteUnidades` consumes `{asignatura, unidad, nota}[]`, exactly the shape of `unidades_relacionadas` — no adapter needed.

---

## Appendix — Authoring the rest of the catalogue (PRs 2–5)

PRs 2–5 add the remaining ~23 dinámicas. **No new engineering** — each is one MDX file
created exactly like Task 5's pilot. Per dinámica:

1. Create `src/content/dinamicas/{familia}/{nn}-{slug}.mdx` with full frontmatter
   (correct `familia`, sequential `orden`, real `unidades_relacionadas` verified
   against published units of each asignatura).
2. Body sections in this order: intro → `## Cómo funciona` (`<Steps>`) →
   `## Guía del profesor` (preparación, gestión, **debrief**, errores comunes) →
   `## Materiales repartibles` (`<RoleCard>` / `<FichaAlumno>`).
3. Keep `estado: borrador` until Pau reviews; only `publicado` renders.
4. `npx astro build` to confirm it loads, then commit.

Suggested PR batches (each: branch from `dev`, self-review, merge):
- **PR 2** — Familia A (resto: dinámica de grupo, negociación salarial, proceso de selección) + Familia G (laboratorio de juegos, tipos de subasta).
- **PR 3** — Familias B y D.
- **PR 4** — Familias C y E.
- **PR 5** — Familia F + optional cross-references from units back to dinámicas.

Optional hardening once content grows (not required for PR 1): add a build-time
guard that calls `findBrokenUnidadRefs` over the real `dinamicas` + `libro`
collections and fails the build on a broken ref (mirrors the `unidadSlug` safety
in `PuenteUnidades`).
