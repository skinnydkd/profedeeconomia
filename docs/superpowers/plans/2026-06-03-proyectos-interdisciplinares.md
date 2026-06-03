# Sección «Proyectos interdisciplinares» Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Add an 8th transversal `/proyectos/` section: a catalogue of interdisciplinary (ABP) projects crossing economics with another subject, organized by the connected subject, mirroring the Debates section. Deliver framework + 1 published pilot (Economía × Matemáticas: inflation investigation). Add it to the «Otros» menu and the home «Material transversal» strip (→ 8 sections).

**Architecture:** TS lib `src/lib/proyectos.ts` (6 subject families) reusing `src/lib/familia-grouping.ts`. MDX collection `proyectos`. Hub + `[materia]/[slug]` detail. Reuse `@components/debates/Fases.astro`, `@components/debates/Rubrica.astro`, `@components/emprendimiento/PuenteUnidades.astro`.

**Tech Stack:** Astro 5 content collections, MDX, TypeScript, Vitest.

---

## Task 1: Subject-families library

**Files:** Create `src/lib/proyectos.ts` (+ `.test.ts`).

- [ ] **Step 1: Write `src/lib/proyectos.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { MATERIAS, MATERIA_SLUGS, materiaMeta } from './proyectos.ts';

describe('MATERIAS', () => {
  it('declares the 6 subjects in display order with a color token each', () => {
    expect(MATERIAS.map((m) => m.slug)).toEqual([
      'historia', 'matematicas', 'geografia', 'etica-valores', 'lengua', 'tecnologia',
    ]);
    for (const m of MATERIAS) expect(m.colorVar).toMatch(/^--color-[a-z0-9-]+$/);
  });
  it('exposes the slugs as a non-empty tuple', () => {
    expect(MATERIA_SLUGS.length).toBe(MATERIAS.length);
  });
});

describe('materiaMeta', () => {
  it('returns metadata for a known subject', () => {
    expect(materiaMeta('matematicas').label).toBe('Matemáticas');
  });
  it('throws on an unknown subject', () => {
    expect(() => materiaMeta('nope')).toThrow(/unknown materia/i);
  });
});
```

- [ ] **Step 2: Run `npx vitest run src/lib/proyectos.test.ts` — confirm FAIL.**

- [ ] **Step 3: Create `src/lib/proyectos.ts`**

```ts
/**
 * Metadata and helpers for the transversal «Proyectos interdisciplinares» section.
 * Each project crosses economics with another school subject (the "materia"),
 * which acts as the family. Color tokens reuse global.css — no new colors.
 * Generic grouping lives in ./familia-grouping (shared with Dinámicas/Debates).
 */
import type { Familia } from './familia-grouping';
export { groupByFamilia, findBrokenUnidadRefs } from './familia-grouping';
export type { FamiliaGroup, HasFamilia, BrokenRef } from './familia-grouping';

export const MATERIAS: Familia[] = [
  { slug: 'historia',      label: 'Historia',         intro: 'Crisis, revoluciones y la economía detrás de los hechos.',     colorVar: '--color-gpe' },
  { slug: 'matematicas',   label: 'Matemáticas',      intro: 'Datos, porcentajes, índices y gráficos para entender la economía.', colorVar: '--color-ipe2' },
  { slug: 'geografia',     label: 'Geografía',        intro: 'Territorio, recursos y comercio: dónde pasa la economía.',      colorVar: '--color-taller3' },
  { slug: 'etica-valores', label: 'Ética y valores',  intro: 'Decisiones económicas con dilemas morales y ciudadanía.',      colorVar: '--color-fopp' },
  { slug: 'lengua',        label: 'Lengua',           intro: 'Comunicar, persuadir y analizar el discurso económico.',       colorVar: '--color-terra' },
  { slug: 'tecnologia',    label: 'Tecnología',       intro: 'Construir, programar y prototipar con mirada económica.',      colorVar: '--color-eco1' },
];

export const MATERIA_SLUGS = MATERIAS.map((m) => m.slug) as [string, ...string[]];

const BY_SLUG = new Map(MATERIAS.map((m) => [m.slug, m]));

export function materiaMeta(slug: string): Familia {
  const m = BY_SLUG.get(slug);
  if (!m) throw new Error(`unknown materia: ${slug}`);
  return m;
}
```

- [ ] **Step 4: Run the test — confirm PASS (4 tests). Then `npx astro check` — no new errors.**

- [ ] **Step 5: Commit**

```bash
git add src/lib/proyectos.ts src/lib/proyectos.test.ts
git commit -m "feat(proyectos): subject-families library"
```

---

## Task 2: Content collection schema + ProyectoMeta component

**Files:** Modify `src/content.config.ts`; Create `src/components/proyectos/ProyectoMeta.astro`.

- [ ] **Step 1: In `src/content.config.ts`**, add the import next to the other lib imports at the top:
```ts
import { MATERIA_SLUGS } from './lib/proyectos';
```

- [ ] **Step 2: Define the `proyectos` collection** before `export const collections`:
```ts
/* =========================================================
   proyectos/{materia}/{nn}-{slug}.mdx — interdisciplinary
   ABP projects crossing economics with another subject.
   ========================================================= */
const proyectos = defineCollection({
  loader: glob({ pattern: 'proyectos/**/*.{md,mdx}', base: './src/content' }),
  schema: z.object({
    title: z.string(),
    materia: z.enum(MATERIA_SLUGS),
    orden: z.number().int().min(0),
    descripcion: z.string(),
    reto: z.string(),
    producto_final: z.string(),
    nivel: z.array(z.enum(['eso', 'bach', 'fp'])).min(1),
    duracion: z.string(),
    agrupacion: z.string(),
    objetivos: z.array(z.string()).min(1),
    conceptos_clave: z.array(z.string()).default([]),
    unidades_relacionadas: z.array(z.object({
      asignatura: z.enum(ASIGNATURA_SLUGS),
      unidad: z.number().int().min(1),
      nota: z.string().optional(),
      competencias_especificas: z.array(z.string()).default([]),
    })).default([]),
    competencias_clave: z.array(z.string()).default([]),
    competencias_especificas: z.array(z.string()).default([]),
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

- [ ] **Step 3: Register** — add `proyectos,` to `export const collections = { ... }` (after `dinamicas,` or near the other transversal ones).

- [ ] **Step 4: Create `src/components/proyectos/ProyectoMeta.astro`**
```astro
---
/** Metadata badge row for an interdisciplinary project. */
interface Props { materia: string; nivel: string[]; duracion: string; agrupacion: string; }
const { materia, nivel, duracion, agrupacion } = Astro.props;
const NIVEL_LABEL: Record<string, string> = { eso: 'ESO', bach: 'Bachillerato', fp: 'FP' };
const MATERIA_LABEL: Record<string, string> = {
  historia: 'Historia', matematicas: 'Matemáticas', geografia: 'Geografía',
  'etica-valores': 'Ética y valores', lengua: 'Lengua', tecnologia: 'Tecnología',
};
---
<dl class="meta">
  <div><dt>Conecta con</dt><dd>{MATERIA_LABEL[materia] ?? materia}</dd></div>
  <div><dt>Nivel</dt><dd>{nivel.map((n) => NIVEL_LABEL[n] ?? n).join(' · ')}</dd></div>
  <div><dt>Duración</dt><dd>{duracion}</dd></div>
  <div><dt>Agrupación</dt><dd>{agrupacion}</dd></div>
</dl>
<style>
  .meta { display: flex; flex-wrap: wrap; gap: 1.4rem; margin: 1.4rem 0 2rem; padding: 1rem 1.2rem; background: var(--color-bg-cream); border-radius: 8px; }
  .meta div { display: flex; flex-direction: column; gap: 0.15rem; }
  .meta dt { font-family: var(--font-sans); font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-ink-mute); margin: 0; }
  .meta dd { font-family: var(--font-serif); font-size: 1rem; margin: 0; color: var(--color-ink); }
</style>
```

- [ ] **Step 5: `npx astro check` — no new errors (the empty `proyectos` collection syncs with a "no files" warning, fine). Commit:**
```bash
git add src/content.config.ts src/components/proyectos/ProyectoMeta.astro
git commit -m "feat(proyectos): content collection schema and metadata component"
```

---

## Task 3: Menu entry + home card

**Files:** Modify `src/lib/asignaturas.ts`, `src/lib/asignaturas.test.ts`, `src/pages/index.astro`.

- [ ] **Step 1: Write the failing menu test** — update the order assertion in `src/lib/asignaturas.test.ts`. Replace the existing `lista las secciones de «Otros» en el orden acordado` expected array with the 8-entry order, and add a presence check:
```ts
  it('lista las secciones de «Otros» en el orden acordado', () => {
    expect(SECCIONES_TRANSVERSALES.map((s) => s.slug)).toEqual([
      'dinamicas', 'herramientas', 'emprendimiento', 'proyectos', 'debates', 'juegos', 'jocs-economics', 'generadores',
    ]);
  });
```
Add (in the same `describe` or a new one):
```ts
  it('da label y descripción a proyectos', () => {
    const s = SECCIONES_TRANSVERSALES.find((x) => x.slug === 'proyectos');
    expect(s?.label).toBe('Proyectos interdisciplinares');
    expect((s?.description.length ?? 0)).toBeGreaterThan(0);
  });
```

- [ ] **Step 2: Run `npx vitest run src/lib/asignaturas.test.ts` — confirm FAIL.**

- [ ] **Step 3: Insert the entry** in `SECCIONES_TRANSVERSALES` (`src/lib/asignaturas.ts`), right AFTER the `emprendimiento` line:
```ts
  { slug: 'proyectos',      label: 'Proyectos interdisciplinares', description: 'Proyectos que cruzan la economía con otra materia.' },
```

- [ ] **Step 4: Add the 8th home card** in `src/pages/index.astro`'s `TRANSVERSAL` array, right AFTER the `emprendimiento` entry:
```ts
  { slug: 'proyectos',      letra: 'P', color: '--color-eeae',   title: 'Proyectos interdisciplinares', cta: 'Ver los proyectos',  desc: 'Proyectos ABP que cruzan la economía con otra materia (historia, matemáticas, geografía…), con su reto, secuencia de sesiones y rúbrica.' },
```
(`--color-eeae` is a free palette token, distinct from the other 7 cards.)

- [ ] **Step 5: Run `npx vitest run src/lib/asignaturas.test.ts` — confirm PASS. Then `npx astro check` — no new errors. Commit:**
```bash
git add src/lib/asignaturas.ts src/lib/asignaturas.test.ts src/pages/index.astro
git commit -m "feat(proyectos): add to «Otros» menu (8 secciones) and home strip"
```

---

## Task 4: Hub + detail pages

**Files:** Create `src/pages/proyectos/index.astro`, `src/pages/proyectos/[materia]/[slug].astro`.

- [ ] **Step 1: Create the hub `src/pages/proyectos/index.astro`** — adapt the Debates hub (`src/pages/debates/index.astro`): read it and reproduce it changing `debates`→`proyectos`, `FAMILIAS_DEBATE`→`MATERIAS`, `familiaMeta`→`materiaMeta`, the collection name to `'proyectos'`, the id prefix strip `/^proyectos\//`, hrefs to `/proyectos/${d.slug}/`, the hero copy to projects, and the card meta to `{d.data.nivel...}` + duración. Keep the same classes/CSS/filter script. Title "Proyectos interdisciplinares"; lede about ABP projects crossing economics with another subject.

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
import { groupByFamilia, MATERIAS } from '@/lib/proyectos';
import { getCollection } from 'astro:content';

const all = (await getCollection('proyectos')).filter((e) => e.data.estado === 'publicado');
const groups = groupByFamilia(MATERIAS, all.map((e) => ({
  slug: e.id.replace(/^proyectos\//, ''),
  data: e.data,
})));
const activeMaterias = new Set(groups.map((g) => g.familia.slug));
const NIVEL_LABEL: Record<string, string> = { eso: 'ESO', bach: 'Bachillerato', fp: 'FP' };
---
<BaseLayout
  title="Proyectos interdisciplinares"
  description="Proyectos ABP que cruzan la economía con otra materia —historia, matemáticas, geografía, ética, lengua, tecnología— con su reto, secuencia de sesiones, conexión curricular y rúbrica."
>
  <div class="container">
    <nav class="breadcrumb"><a href="/">Inicio</a> <span class="sep">›</span> <span>Proyectos</span></nav>
  </div>
  <section class="hero">
    <div class="container">
      <span class="kicker">Material transversal</span>
      <h1><span class="serif-italic-wonk accent">Proyectos</span> que cruzan materias.</h1>
      <p class="lede">
        Aprendizaje por proyectos donde la economía se cruza con otra materia: un reto,
        un producto final, la secuencia de sesiones y la rúbrica. Cada uno con su encaje
        curricular en las unidades de economía.
      </p>
    </div>
  </section>
  <section class="filters">
    <div class="container">
      <button class="chip is-active" data-filter="all" type="button">Todos</button>
      {MATERIAS.filter((m) => activeMaterias.has(m.slug)).map((m) => (
        <button class="chip" data-filter={m.slug} type="button" style={`--chip-color: var(${m.colorVar})`}>{m.label}</button>
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
            <a class="card" href={`/proyectos/${d.slug}/`} style={`--fam-color: var(${g.familia.colorVar})`}>
              <span class="card__eyebrow">{g.familia.label}</span>
              <h3 class="card__title serif">{d.data.title}</h3>
              <p class="card__desc">{d.data.descripcion}</p>
              <span class="card__meta">{d.data.nivel.map((n) => NIVEL_LABEL[n] ?? n).join(' · ')} · {d.data.duracion}</span>
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

- [ ] **Step 2: Create the detail page `src/pages/proyectos/[materia]/[slug].astro`**
```astro
---
/**
 * A single interdisciplinary project. Routed by `[materia]/[slug]` (two params).
 * Renders the reto, the producto final, the MDX body (sessions + conexión), the
 * rubric, the curriculum map and competences.
 */
import BaseLayout from '@layouts/BaseLayout.astro';
import ProyectoMeta from '@components/proyectos/ProyectoMeta.astro';
import Rubrica from '@components/debates/Rubrica.astro';
import PuenteUnidades from '@components/emprendimiento/PuenteUnidades.astro';
import { materiaMeta } from '@/lib/proyectos';
import { getCollection, render } from 'astro:content';
import type { GetStaticPaths } from 'astro';

export const getStaticPaths = (async () => {
  const all = (await getCollection('proyectos')).filter((e) => e.data.estado === 'publicado');
  return all.map((entry) => {
    const [materia, ...rest] = entry.id.replace(/^proyectos\//, '').split('/');
    return { params: { materia, slug: rest.join('/') }, props: { entry } };
  });
}) satisfies GetStaticPaths;

const { entry } = Astro.props;
const d = entry.data;
const { Content } = await render(entry);
const materia = materiaMeta(d.materia);
---
<BaseLayout title={`${d.title} — Proyectos`} description={d.descripcion}>
  <div class="container">
    <nav class="breadcrumb">
      <a href="/">Inicio</a> <span class="sep">›</span>
      <a href="/proyectos/">Proyectos</a> <span class="sep">›</span>
      <span>{d.title}</span>
    </nav>
  </div>
  <section class="body">
    <div class="container container--narrow">
      <span class="kicker" style={`color: var(${materia.colorVar})`}>Economía × {materia.label}</span>
      <h1>{d.title}</h1>
      <p class="lede">{d.descripcion}</p>

      <ProyectoMeta materia={d.materia} nivel={d.nivel} duracion={d.duracion} agrupacion={d.agrupacion} />

      <section class="block reto">
        <h2>El reto</h2>
        <blockquote class="reto__q">{d.reto}</blockquote>
        <p class="producto"><strong>Producto final:</strong> {d.producto_final}</p>
      </section>

      {d.objetivos.length > 0 && (
        <section class="block">
          <h2>Objetivos</h2>
          <ul>{d.objetivos.map((o) => <li>{o}</li>)}</ul>
          {d.conceptos_clave.length > 0 && (
            <p class="conceptos"><strong>Conceptos:</strong> {d.conceptos_clave.join(' · ')}</p>
          )}
        </section>
      )}

      <article class="prose"><Content /></article>

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
          {d.competencias_clave.length > 0 && (<p><strong>Clave:</strong> {d.competencias_clave.join(' · ')}</p>)}
          {d.competencias_especificas.length > 0 && (<p><strong>Específicas:</strong> {d.competencias_especificas.join(' · ')}</p>)}
        </section>
      )}

      <nav class="back"><a href="/proyectos/">← Todos los proyectos</a></nav>
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
  .reto__q { font-family: var(--font-serif); font-style: italic; font-size: 1.3rem; line-height: 1.4; color: var(--color-ink); border-left: 4px solid var(--color-terra); margin: 0.4rem 0 1rem; padding: 0.2rem 0 0.2rem 1rem; }
  .producto { color: var(--color-ink-soft); }
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
</style>
```

- [ ] **Step 3: `npx astro check` — no new errors. Commit:**
```bash
git add "src/pages/proyectos/index.astro" "src/pages/proyectos/[materia]/[slug].astro"
git commit -m "feat(proyectos): hub and detail pages"
```

---

## Task 5: The pilot project + full build verification

**Files:** Create `src/content/proyectos/matematicas/01-precio-de-la-cesta.mdx`.

- [ ] **Step 1: Find real published units.** Grep the libros for inflation/IPC/dinero concepts:
`grep -rilE "inflación|IPC|índice de precios|poder adquisitivo|dinero" src/content/asignaturas/*/libro/*.mdx` — open matches, confirm `unidad:` + `estado: publicado`. Expect eco-1bach (macro indicators), eco-4eso, taller-eco-3eso. Use 2-3 real pairs.

- [ ] **Step 2: Create `src/content/proyectos/matematicas/01-precio-de-la-cesta.mdx`** (replace the EXAMPLE units with real ones from Step 1):

````mdx
---
title: "El precio de la cesta: una investigación sobre la inflación"
materia: matematicas
orden: 1
descripcion: "Economía × Matemáticas: el alumnado mide la subida de precios con datos reales y construye su propio índice."
reto: "¿Cuánto ha subido de verdad el precio de lo que compra tu familia, y cómo lo demuestras con datos?"
producto_final: "Un informe con una cesta-índice propia, los precios recogidos, gráficos de evolución y conclusiones."
nivel: [eso, bach]
duracion: "5-6 sesiones"
agrupacion: "Equipos de 3-4"
objetivos:
  - "Entender qué es la inflación y cómo se mide con un índice de precios."
  - "Recoger, organizar y representar datos de precios reales."
  - "Calcular variaciones porcentuales y un número índice sencillo."
  - "Interpretar los resultados y comunicarlos con rigor."
conceptos_clave: ["inflación", "IPC", "número índice", "poder adquisitivo", "porcentaje", "media"]
unidades_relacionadas:
  # EXAMPLE — replace with the real pairs found in Step 1
  - asignatura: eco-1bach
    unidad: 1
    nota: "Encaja al estudiar los indicadores macroeconómicos y la inflación."
    competencias_especificas: []
  - asignatura: eco-4eso
    unidad: 1
    competencias_especificas: []
competencias_clave: ["STEM", "CCL", "CD", "CPSAA"]
competencias_especificas: []
rubrica:
  - criterio: "Rigor de los datos"
    descripcion: "Recoge precios reales, suficientes y bien documentados (fuente y fecha)."
    competencia: "STEM"
  - criterio: "Corrección matemática"
    descripcion: "Calcula bien el índice, las variaciones porcentuales y las medias."
    competencia: "STEM"
  - criterio: "Interpretación económica"
    descripcion: "Relaciona los resultados con la inflación y el poder adquisitivo."
    competencia: "CPSAA"
  - criterio: "Comunicación del informe"
    descripcion: "Presenta los gráficos y las conclusiones con claridad y orden."
    competencia: "CCL"
lang: es
estado: publicado
---

import Fases from '@components/debates/Fases.astro';

## El reto

Todo el mundo dice que «todo está más caro», pero ¿cuánto, exactamente? En este proyecto
vais a dejar de repetir titulares y a **medirlo vosotros mismos**: elegiréis una cesta de
productos, recogeréis sus precios, construiréis vuestro propio índice y comprobaréis con
datos cuánto ha cambiado el coste de la vida.

## Qué aporta cada materia

- **Economía** pone los conceptos: qué es la inflación, qué mide el IPC, qué es un número
  índice y cómo afecta al poder adquisitivo de una familia.
- **Matemáticas** pone las herramientas: recogida y organización de datos, porcentajes,
  números índice, medias y representación gráfica de la evolución.

## Cómo se desarrolla

<Fases fases={[
  { fase: "Definir la cesta", tiempo: "1 sesión", descripcion: "Cada equipo elige 8-10 productos representativos de su consumo y justifica la elección." },
  { fase: "Recoger los precios", tiempo: "1 sesión + trabajo en casa", descripcion: "Anotan el precio actual de cada producto (con fuente y fecha) y buscan un precio de referencia anterior." },
  { fase: "Construir el índice", tiempo: "1 sesión", descripcion: "Calculan la variación porcentual de cada producto y un número índice de la cesta respecto al año base." },
  { fase: "Representar los datos", tiempo: "1 sesión", descripcion: "Hacen gráficos de la evolución y comparan productos: qué ha subido más y qué menos." },
  { fase: "Interpretar y redactar", tiempo: "1 sesión", descripcion: "Relacionan su índice con la inflación oficial y redactan las conclusiones." },
  { fase: "Presentación", tiempo: "1 sesión", descripcion: "Cada equipo expone su informe; se comparan las cestas y los resultados de la clase." },
]} />

## El producto final

Un **informe** (en papel o digital) que incluya: la cesta elegida y su justificación, la
tabla de precios con sus fuentes, el cálculo del índice y las variaciones, los gráficos de
evolución y unas conclusiones que respondan al reto inicial. Cada equipo lo presenta a la
clase, y se contrasta con el dato oficial de inflación del periodo.
````

- [ ] **Step 3: Run tests** — `npx vitest run src/lib/proyectos.test.ts src/lib/asignaturas.test.ts` — expect pass.

- [ ] **Step 4: FULL BUILD** — `npx astro build` — expect `Complete!`. Routes `/proyectos/`, `/proyectos/matematicas/01-precio-de-la-cesta/` prerender; the home shows 8 transversal cards; the menu has 8 entries. Fix any Zod/build error and re-run.

- [ ] **Step 5: Dev smoke (recommended)** — `/proyectos/` hub (Matemáticas family + card), the pilot detail (reto, sesiones via Fases, rúbrica, «Esto se trabaja en…» links resolve), the menu «Otros» (8 entries) and the home (8th card «Proyectos interdisciplinares»). Stop dev.

- [ ] **Step 6: Commit**
```bash
git add src/content/proyectos/matematicas/01-precio-de-la-cesta.mdx
git commit -m "feat(proyectos): pilot — El precio de la cesta (Economía × Matemáticas)"
```

---

## Task 6: PR + merge

- [ ] **Step 1: Push + PR to `dev`**:
```bash
git push -u origin feat/proyectos-interdisciplinares
gh pr create --base dev --head feat/proyectos-interdisciplinares --title "feat(proyectos): sección Proyectos interdisciplinares (marco + pilot)" --body "Nueva 8ª sección transversal /proyectos/: proyectos ABP que cruzan la economía con otra materia, por materia conectada, con reto, producto final, secuencia de sesiones, conexión curricular y rúbrica. Añadida al menú «Otros» y a la home. Marco + 1 pilot publicado (Economía × Matemáticas). Spec: docs/superpowers/specs/2026-06-03-proyectos-interdisciplinares-design.md"
```
- [ ] **Step 2: Wait for Vercel green, merge to `dev`, then `dev → main`, verify production.**

---

## Self-review notes
- **Distinct from Emprendimiento's project** — separate collection/route; interdisciplinary, not the entrepreneurship capstone.
- **Reuses** `familia-grouping`, `@components/debates/Fases` & `Rubrica`, `PuenteUnidades` — do not duplicate.
- **Real units** in the pilot (Task 5 Step 1) — replace the EXAMPLE pairs.
- **8th home card color** `--color-eeae` (free); menu order has 8 entries with `proyectos` after `emprendimiento`.
- **No new colors; no pictographic emojis; accents correct.**
- Two-param route `[materia]/[slug]`; no stray `.ts` under `src/pages/proyectos/`.
