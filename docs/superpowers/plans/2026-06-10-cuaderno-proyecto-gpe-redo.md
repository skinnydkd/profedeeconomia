# Cuaderno de proyecto de GPE — rediseño · Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Llevar el cuaderno de proyecto de GPE a paridad técnica con «De cero a empresa» (página por fase + cuaderno dual alumno/profesor en PDF) y enriquecerlo con un patrón editorial propio (TL;DR de fase, caso real local, errores que cuestan, calculadoras inline, «Para el aula»), manteniendo su ADN curricular y su color de asignatura (granate `--color-gpe`).

**Architecture:** Se extiende la colección `proyecto` con campos opcionales (idénticos a los de `proyectoTransversal` donde aplica). Se reutiliza la maquinaria de DCaE: `BloqueCuaderno` + plantillas, patrón de página por fase, patrón de cuaderno dual `[modo]`, `HerramientaIsland`, `RecursosRelacionados`. Se crean 3 componentes editoriales nuevos y genéricos (`EnEstaFase`, `CasoReal`, `ErroresQueCuestan`). Spec: `docs/superpowers/specs/2026-06-10-cuaderno-proyecto-gpe-redo.md`.

**Tech Stack:** Astro 5, Tailwind 4, Preact islands (calculadoras), Vitest (tests de `recursos-relacionados`), pagedjs-cli + Chrome (PDFs). Contenido en castellano; código y comentarios en inglés.

**Branch:** `feat/cuaderno-proyecto-gpe` (ya creada; el spec ya está commiteado ahí).

**Verificación global:** `npm run build` es la verificación real (NO `astro check`, que se queda sin memoria con el aluvión de MDX). Se ejecuta al final de cada tarea de contenido/render.

---

## File Structure

**Crear:**
- `src/components/EnEstaFase.astro` — TL;DR de fase (qué haréis · entregable · sesiones · repaso del libro).
- `src/components/CasoReal.astro` — mini-caso de emprendimiento local (variante de `CasoDilema`, sin dilema obligatorio).
- `src/components/ErroresQueCuestan.astro` — caja de 2-3 errores típicos por fase.
- `src/pages/[asignatura]/proyecto/[fase].astro` — página por fase con nav prev/next.
- `src/pages/[asignatura]/proyecto/cuaderno/imprimir/[modo].astro` — cuaderno dual alumno/profesor (origen PDFs).
- `scripts/build-cuaderno-gpe-pdf.mjs` — genera `gpe-cuaderno-alumno.pdf` + `gpe-cuaderno-profesor.pdf`.

**Modificar:**
- `src/content.config.ts:262-270` — extender el schema de `proyecto` con campos opcionales.
- `src/content/asignaturas/gpe-bach/proyecto/00..05-*.mdx` (6 ficheros) — añadir frontmatter nuevo + componentes editoriales + `cuaderno`.
- `src/pages/[asignatura]/proyecto/index.astro` — convertir de cascada a portada con tarjetas de fase + 3 descargas.
- `package.json` — añadir script `build:cuaderno-gpe` y enlazarlo en `build:all`.

**Reutilizar sin tocar:** `BloqueCuaderno.astro`, `plantillas/Plantilla.astro` (+6 variantes), `HerramientaIsland.astro`, `RecursosRelacionados.astro`, `recursos-relacionados.ts` (+ sources), `FaseMeta.astro` (envuelto, no modificado).

---

## Task 1: Extender el schema de la colección `proyecto`

**Files:**
- Modify: `src/content.config.ts:262-270`

- [ ] **Step 1: Añadir los campos opcionales al schema**

En `src/content.config.ts`, sustituye el bloque `schema: z.object({ ... })` de la colección `proyecto` (líneas ~262-270) por:

```ts
  schema: z.object({
    asignatura: z.enum(ASIGNATURA_SLUGS),
    orden: z.number().int().min(0),
    title: z.string(),
    /** Etiqueta de la fase del proyecto ("Fase 1 — Idea y oportunidad"). */
    fase: z.string().optional(),
    /** Duración estimada de la fase ("2-3 sesiones"). */
    duracion: z.string().optional(),
    /** Descripción de una línea del entregable de la fase. */
    entregable: z.string().optional(),
    /** Competencia específica trabajada ("CE1"). */
    competencia_especifica: z.string().optional(),
    /** Bloques de saberes del Decret 108/2022 trabajados en la fase. */
    saberes: z.array(z.string()).default([]),
    /** Puentes a unidades del libro (alimenta «Para el aula» vía índice inverso). */
    unidades_relacionadas: z
      .array(
        z.object({
          asignatura: z.enum(ASIGNATURA_SLUGS),
          unidad: z.number().int().min(1),
          nota: z.string().optional(),
        })
      )
      .default([]),
    /** Contenido del cuaderno del alumno para esta fase (web + PDF, fuente única). */
    cuaderno: z
      .object({
        tarea: z.string(),
        reflexion: z.string(),
        orientacion_docente: z.string().optional(),
        plantilla: z.object({
          tipo: z.enum(['canvas-bm', '4p', 'punto-muerto', 'procesos', 'pitch', 'tabla']),
          columnas: z.array(z.string()).optional(),
          filas: z.number().int().optional(),
        }),
      })
      .optional(),
    lang: z.enum(LANGS).default('es'),
    estado: z.enum(ESTADOS).default('borrador'),
  }),
```

- [ ] **Step 2: Verificar que el build sigue verde con el schema ampliado**

Run: `npm run build`
Expected: build OK. Las 6 fases actuales no tienen los campos nuevos, pero todos son opcionales o con default, así que validan sin cambios.

- [ ] **Step 3: Commit**

```bash
git add src/content.config.ts
git commit -m "feat(gpe): extend proyecto schema with phase metadata + cuaderno block"
```

---

## Task 2: Componente `EnEstaFase`

**Files:**
- Create: `src/components/EnEstaFase.astro`

- [ ] **Step 1: Crear el componente**

Crea `src/components/EnEstaFase.astro`. Patrón calcado de `TldrUnidad.astro` pero con tres datos fijos (qué haréis / entregable / sesiones) en una fila de metadatos y un slot para el repaso del libro. Acento neutro mostaza (decorativo, igual que TL;DR), no el color de asignatura (eso va en los acentos de página).

```astro
---
/**
 * "En esta fase" — phase-level TL;DR for the GPE project workbook.
 * Generic (not GPE-bound) so «De cero a empresa» can adopt it later.
 * Mirrors the visual language of TldrUnidad.
 */
type Props = {
  /** What the team will do this phase (one line). */
  haras: string;
  /** Deliverable produced at the end of the phase. */
  entregable: string;
  /** Estimated sessions ("2-3 sesiones"). */
  sesiones: string;
};
const { haras, entregable, sesiones } = Astro.props;
---

<aside class="enfase">
  <header class="enfase__head">
    <span class="enfase__kicker">En esta fase</span>
    <span class="enfase__dur">{sesiones}</span>
  </header>
  <dl class="enfase__grid">
    <div><dt>Qué haréis</dt><dd>{haras}</dd></div>
    <div><dt>Qué entregáis</dt><dd>{entregable}</dd></div>
  </dl>
  <div class="enfase__repaso"><slot /></div>
</aside>

<style>
  .enfase { margin: 0 0 2.4rem; padding: 1.4rem 1.6rem; background: var(--color-bg-soft); border-left: 4px solid var(--color-mustard); border-radius: 0 4px 4px 0; }
  .enfase__head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.9rem; }
  .enfase__kicker { font-family: var(--font-sans); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.16em; color: var(--color-mustard-deep); font-weight: 700; }
  .enfase__dur { font-family: var(--font-mono); font-size: 0.74rem; color: var(--color-ink-mute); }
  .enfase__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 0 0 0.9rem; }
  .enfase__grid dt { font-family: var(--font-sans); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-ink-mute); font-weight: 700; margin-bottom: 0.2rem; }
  .enfase__grid dd { margin: 0; font-size: 0.98rem; color: var(--color-ink); line-height: 1.45; }
  .enfase__repaso { font-family: var(--font-serif); font-size: 1rem; line-height: 1.55; color: var(--color-ink-soft); border-top: 1px dashed var(--color-line); padding-top: 0.8rem; }
  .enfase__repaso :global(p) { margin: 0; }
  @media (max-width: 540px) { .enfase__grid { grid-template-columns: 1fr; } }
  @media print { .enfase { break-inside: avoid; page-break-inside: avoid; } }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/EnEstaFase.astro
git commit -m "feat(components): add EnEstaFase phase TL;DR component"
```

---

## Task 3: Componente `CasoReal`

**Files:**
- Create: `src/components/CasoReal.astro`

- [ ] **Step 1: Crear el componente**

Crea `src/components/CasoReal.astro`. Igual que `CasoDilema.astro` salvo: kicker "Caso real · Cerca de ti", `pregunta` opcional (no toda fase es un dilema) y acento granate de GPE en vez de terracota (`var(--color-gpe)`), para que case con la página.

```astro
---
/**
 * "Caso real" — a short proximity-economy case that illustrates a project phase.
 * Variant of CasoDilema: the closing question is optional (not every phase is a
 * dilemma) and the accent is the subject color, not terracotta.
 */
type Props = {
  /** Case headline. */
  titular: string;
  /** Source (outlet + date, or "Adaptado de…"). */
  fuente: string;
  /** Optional closing question/hook. */
  pregunta?: string;
};
const { titular, fuente, pregunta } = Astro.props;
---

<aside class="caso">
  <span class="caso__kicker">Caso real · Cerca de ti</span>
  <h3 class="caso__titular">{titular}</h3>
  <p class="caso__fuente">{fuente}</p>
  <div class="caso__body"><slot /></div>
  {pregunta && <p class="caso__pregunta">{pregunta}</p>}
</aside>

<style>
  .caso { margin: 0 0 2.4rem; padding: 1.6rem 1.8rem; background: var(--color-paper); border: 1px solid var(--color-line); border-top: 4px solid var(--color-gpe); border-radius: 4px; }
  .caso__kicker { font-family: var(--font-sans); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.16em; color: var(--color-gpe); font-weight: 700; display: block; margin-bottom: 0.4rem; }
  .caso__titular { font-family: var(--font-serif); font-size: 1.45rem; line-height: 1.2; margin: 0 0 0.4rem; color: var(--color-ink); font-weight: 500; font-variation-settings: "SOFT" 80, "WONK" 0; letter-spacing: -0.005em; }
  .caso__fuente { font-family: var(--font-mono); font-size: 0.76rem; color: var(--color-ink-mute); margin: 0 0 1rem; }
  .caso__body { font-family: var(--font-serif); font-size: 1rem; line-height: 1.55; color: var(--color-ink-soft); }
  .caso__body :global(p) { margin: 0 0 0.8em; }
  .caso__body :global(p:last-child) { margin-bottom: 0; }
  .caso__pregunta { font-family: var(--font-serif); font-style: italic; font-size: 1.05rem; line-height: 1.4; color: var(--color-gpe); margin: 1.2rem 0 0; padding-top: 1rem; border-top: 1px dashed var(--color-line); font-variation-settings: "SOFT" 100, "WONK" 1; }
  @media print { .caso { break-inside: avoid; page-break-inside: avoid; } }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/CasoReal.astro
git commit -m "feat(components): add CasoReal local-case component"
```

---

## Task 4: Componente `ErroresQueCuestan`

**Files:**
- Create: `src/components/ErroresQueCuestan.astro`

- [ ] **Step 1: Crear el componente**

Crea `src/components/ErroresQueCuestan.astro`. Caja con título fijo y un slot donde el MDX pone una lista `<ul>` de errores. Tono de colega. Acento terracota suave para diferenciarlo visualmente de cuaderno (mostaza) y caso (granate).

```astro
---
/**
 * "Errores que cuestan" — a short box flagging the 2-3 typical mistakes teams
 * make in a given phase. Content (a list) goes in the default slot.
 */
type Props = {
  /** Optional override for the box title. */
  titulo?: string;
};
const { titulo = 'Errores que cuestan' } = Astro.props;
---

<aside class="errores">
  <span class="errores__kicker">{titulo}</span>
  <div class="errores__body"><slot /></div>
</aside>

<style>
  .errores { margin: 2rem 0; padding: 1.3rem 1.6rem; background: var(--color-terra-soft); border-left: 4px solid var(--color-terra); border-radius: 0 4px 4px 0; }
  .errores__kicker { font-family: var(--font-sans); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--color-terra-deep); font-weight: 700; display: block; margin-bottom: 0.6rem; }
  .errores__body { font-size: 0.98rem; line-height: 1.55; color: var(--color-ink); }
  .errores__body :global(ul) { margin: 0; padding-left: 1.2rem; }
  .errores__body :global(li) { margin-bottom: 0.45em; }
  .errores__body :global(li::marker) { color: var(--color-terra); }
  .errores__body :global(strong) { color: var(--color-ink); }
  @media print { .errores { break-inside: avoid; page-break-inside: avoid; } }
</style>
```

- [ ] **Step 2: Verificar que los 3 componentes compilan**

Run: `npm run build`
Expected: build OK (los componentes aún no se usan, pero deben compilar sin errores de sintaxis).

- [ ] **Step 3: Commit**

```bash
git add src/components/ErroresQueCuestan.astro
git commit -m "feat(components): add ErroresQueCuestan pitfalls box"
```

---

## Task 5: Página por fase `[fase].astro`

**Files:**
- Create: `src/pages/[asignatura]/proyecto/[fase].astro`

Esta página es el corazón del rediseño. Replica `src/pages/emprendimiento/proyecto/[fase].astro` adaptada a la colección `proyecto` (por asignatura), con `FaseMeta` envuelto (GPE no usa `nivel`/`nucleo`/`valiente`, así que se le pasan valores fijos que ocultan esos badges) y acento de asignatura inline.

- [ ] **Step 1: Crear la página**

```astro
---
/**
 * A single phase of an asignatura project workbook (currently GPE).
 * Param `fase` is the zero-padded `orden` ("00", "01"…). Reuses FaseMeta,
 * BloqueCuaderno, PuenteUnidades and the editorial prose styling.
 */
import BaseLayout from '@layouts/BaseLayout.astro';
import FaseMeta from '@components/emprendimiento/FaseMeta.astro';
import BloqueCuaderno from '@components/emprendimiento/BloqueCuaderno.astro';
import PuenteUnidades from '@components/emprendimiento/PuenteUnidades.astro';
import { ASIGNATURAS } from '@/lib/asignaturas';
import { getCollection, render } from 'astro:content';
import type { GetStaticPaths } from 'astro';

export const getStaticPaths = (async () => {
  const all = (await getCollection('proyecto')).filter((e) => e.data.estado === 'publicado');
  const bySlug = new Map<string, typeof all>();
  for (const e of all) {
    const arr = bySlug.get(e.data.asignatura) ?? [];
    arr.push(e);
    bySlug.set(e.data.asignatura, arr);
  }
  const paths = [];
  for (const [slug, secciones] of bySlug.entries()) {
    secciones.sort((a, b) => a.data.orden - b.data.orden);
    for (let i = 0; i < secciones.length; i++) {
      paths.push({
        params: { asignatura: slug, fase: String(secciones[i].data.orden).padStart(2, '0') },
        props: {
          entry: secciones[i],
          prev: secciones[i - 1] ?? null,
          next: secciones[i + 1] ?? null,
          asignatura: ASIGNATURAS[slug],
        },
      });
    }
  }
  return paths;
}) satisfies GetStaticPaths;

const { entry, prev, next, asignatura: a } = Astro.props;
const d = entry.data;
const { Content } = await render(entry);
const faseHref = (e: typeof prev) =>
  e ? `/${a.slug}/proyecto/${String(e.data.orden).padStart(2, '0')}` : '#';
---

<BaseLayout title={`${d.fase ?? d.title} — Cuaderno de proyecto · ${a.shortLabel}`} description={d.entregable ?? d.title}>
  <div class="container">
    <nav class="breadcrumb">
      <a href="/">Inicio</a> <span class="sep">›</span>
      <a href={`/${a.slug}/`}>{a.shortLabel}</a> <span class="sep">›</span>
      <a href={`/${a.slug}/proyecto/`}>Cuaderno de proyecto</a> <span class="sep">›</span>
      <span>{d.fase ?? d.title}</span>
    </nav>
  </div>

  <section class="body" style={`--accent: var(--color-${a.color}); --accent-soft: var(--color-${a.color}-soft);`}>
    <div class="container container--narrow">
      <span class="kicker">{d.fase ?? `Fase ${d.orden}`}</span>
      <h1>{d.title}</h1>
      <FaseMeta
        faseLabel={d.fase ?? `Fase ${d.orden}`}
        nivel="bach-fp"
        nucleo={true}
        duracion={d.duracion ?? ''}
        entregable={d.entregable ?? ''}
        competenciasClave={d.competencia_especifica ? [d.competencia_especifica] : []}
      />
      <article class="prose">
        <Content />
      </article>
      {d.cuaderno && <BloqueCuaderno cuaderno={d.cuaderno} modo="alumno" />}
      <PuenteUnidades unidades={d.unidades_relacionadas} />

      <nav class="phase-nav">
        {prev ? <a href={faseHref(prev)} class="phase-nav__prev">← {prev.data.fase ?? prev.data.title}</a> : <span />}
        {next ? <a href={faseHref(next)} class="phase-nav__next">{next.data.fase ?? next.data.title} →</a> : <span />}
      </nav>
    </div>
  </section>
</BaseLayout>

<style>
  .container { max-width: 1240px; margin: 0 auto; padding: 0 clamp(1.5rem, 4vw, 3rem); }
  .container--narrow { max-width: 820px; }
  .breadcrumb { font-size: 0.92rem; color: var(--color-ink-mute); margin: 2rem 0; }
  .breadcrumb a { color: var(--color-ink-mute); text-decoration: none; }
  .breadcrumb a:hover { color: var(--accent); }
  .breadcrumb .sep { margin: 0 0.5em; color: var(--color-mustard); }
  .body { padding: 1rem 0 clamp(3rem, 7vw, 6rem); }
  .kicker { font-family: var(--font-sans); font-size: 0.8rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent); }
  h1 { margin: 0.6rem 0 0; max-width: 24ch; }
  .prose { font-size: 1.05rem; line-height: 1.7; color: var(--color-ink); }
  .prose :global(h2) { font-family: var(--font-serif); font-size: 1.6rem; margin: 2.2em 0 0.7em; position: relative; padding-top: 1em; font-weight: 500; }
  .prose :global(h2::before) { content: ""; position: absolute; top: 0; left: 0; width: 2.5rem; height: 4px; background: var(--accent); border-radius: 999px; }
  .prose :global(h2:nth-of-type(2n)::before) { background: var(--color-mustard); }
  .prose :global(h3) { font-family: var(--font-serif); font-size: 1.25rem; margin: 1.6em 0 0.5em; font-weight: 500; }
  .prose :global(p) { margin: 0 0 1em; }
  .prose :global(ul), .prose :global(ol) { padding-left: 1.4rem; margin: 0 0 1em; }
  .prose :global(li) { margin-bottom: 0.4em; }
  .prose :global(ul li::marker) { color: var(--color-mustard); }
  .prose :global(strong) { color: var(--color-ink); }
  .prose :global(table) { width: 100%; border-collapse: separate; border-spacing: 0; margin: 1.4em 0; font-size: 0.92rem; }
  .prose :global(th), .prose :global(td) { text-align: left; padding: 0.55em 0.75em; border-bottom: 1px solid var(--color-line-soft); vertical-align: top; }
  .prose :global(th) { font-family: var(--font-sans); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--accent); background: var(--accent-soft); font-weight: 700; }
  .phase-nav { display: flex; justify-content: space-between; gap: 1rem; margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid var(--color-line); font-family: var(--font-sans); font-size: 0.95rem; }
  .phase-nav a { color: var(--accent); text-decoration: none; font-weight: 500; }
  .phase-nav a:hover { text-decoration: underline; }
</style>
```

- [ ] **Step 2: Verificar que las rutas de fase se generan**

Run: `npm run build`
Expected: build OK. En la salida deben aparecer rutas `/gpe-bach/proyecto/00/`…`/05/` (6 rutas). Como las fases aún no tienen `cuaderno` ni metadatos nuevos, la página renderiza con FaseMeta semivacío — es esperado en este punto; se rellena en la Task 8.

- [ ] **Step 3: Commit**

```bash
git add "src/pages/[asignatura]/proyecto/[fase].astro"
git commit -m "feat(gpe): per-phase project page with prev/next navigation"
```

---

## Task 6: Convertir el índice en portada con tarjetas

**Files:**
- Modify: `src/pages/[asignatura]/proyecto/index.astro`

La página actual renderiza las 6 fases en cascada. Se convierte en portada: hero + grid de tarjetas (una por fase, enlazando a `/[asignatura]/proyecto/[fase]/`) + bloque de 3 descargas (alumno, profesor, guía completa).

- [ ] **Step 1: Reescribir el index**

Sustituye el contenido completo de `src/pages/[asignatura]/proyecto/index.astro` por:

```astro
---
/**
 * Portada del cuaderno de proyecto de una asignatura (de momento GPE).
 * Muestra el recorrido de fases como tarjetas + las descargas (cuaderno
 * alumno/profesor para rellenar y guía completa del profe).
 */
import BaseLayout from '@layouts/BaseLayout.astro';
import { ASIGNATURAS } from '@/lib/asignaturas';
import { getCollection } from 'astro:content';
import type { GetStaticPaths } from 'astro';

export const getStaticPaths = (async () => {
  const all = await getCollection('proyecto');
  const bySlug = new Map<string, typeof all>();
  for (const e of all) {
    if (e.data.estado !== 'publicado') continue;
    const arr = bySlug.get(e.data.asignatura) ?? [];
    arr.push(e);
    bySlug.set(e.data.asignatura, arr);
  }
  return [...bySlug.entries()].map(([slug, secciones]) => {
    secciones.sort((a, b) => a.data.orden - b.data.orden);
    return { params: { asignatura: slug }, props: { secciones, asignatura: ASIGNATURAS[slug] } };
  });
}) satisfies GetStaticPaths;

const { secciones, asignatura: a } = Astro.props;
const guiaHref = `/downloads/${a.slug}-proyecto.pdf`;
const alumnoHref = `/downloads/${a.slug}-cuaderno-alumno.pdf`;
const profesorHref = `/downloads/${a.slug}-cuaderno-profesor.pdf`;
const faseHref = (orden: number) => `/${a.slug}/proyecto/${String(orden).padStart(2, '0')}`;
---

<BaseLayout
  title={`Cuaderno de proyecto — ${a.shortLabel}`}
  description={`Cuaderno de proyecto de ${a.title}: guía paso a paso, por fases, para que el alumnado desarrolle su propia iniciativa emprendedora.`}
>
  <div class="container">
    <nav class="breadcrumb">
      <a href="/">Inicio</a> <span class="sep">›</span>
      <a href={`/${a.slug}/`}>{a.shortLabel}</a> <span class="sep">›</span>
      <span>Cuaderno de proyecto</span>
    </nav>
  </div>

  <section class="hero" style={`--accent: var(--color-${a.color}); --accent-soft: var(--color-${a.color}-soft);`}>
    <div class="container">
      <span class="kicker">{a.shortLabel} · Proyecto emprendedor</span>
      <h1>Cuaderno de proyecto</h1>
      <p class="lede">Una guía paso a paso, fase a fase, para que vuestro alumnado convierta un reto de su entorno en un proyecto emprendedor: equipo, oportunidad, modelo de negocio, viabilidad y puesta en marcha.</p>

      <p class="downloads-lead">Descargad el <strong>cuaderno del equipo</strong> y rellenadlo fase a fase, con sus plantillas visuales.</p>
      <div class="downloads">
        <a class="download-cta" href={alumnoHref} download>
          <span class="download-cta__icon" aria-hidden="true">↓</span>
          <span class="download-cta__text">
            <strong>Cuaderno del alumno (para rellenar)</strong>
            <span class="muted">Una hoja por fase con plantilla visual en blanco</span>
          </span>
        </a>
        <a class="download-cta" href={profesorHref} download>
          <span class="download-cta__icon" aria-hidden="true">↓</span>
          <span class="download-cta__text">
            <strong>Cuaderno del profesor (con orientación)</strong>
            <span class="muted">El mismo, con orientación docente por fase</span>
          </span>
        </a>
        <a class="download-secondary" href={guiaHref} download>Guía completa del proyecto en PDF</a>
      </div>

      <p class="adapt-note">
        Cuaderno pensado para trabajar el proyecto a lo largo del curso. Adáptalo a la duración, el agrupamiento y el contexto de tu centro.
      </p>
      <p class="related-note">
        Este es el recorrido anclado al temario de <strong>{a.shortLabel}</strong>. Si buscas la versión
        transversal y modular —de un sprint a un curso entero, para cualquier asignatura y nivel—,
        es el mismo viaje en <a href="/emprendimiento/proyecto/">«De cero a empresa»</a>.
      </p>
    </div>
  </section>

  <section class="fases" style={`--accent: var(--color-${a.color}); --accent-soft: var(--color-${a.color}-soft);`}>
    <div class="container">
      <ol class="fase-grid">
        {secciones.map((s) => (
          <li>
            <a class="fase-card" href={faseHref(s.data.orden)}>
              <span class="fase-card__num">{String(s.data.orden).padStart(2, '0')}</span>
              <span class="fase-card__label">{s.data.fase ?? `Fase ${s.data.orden}`}</span>
              <span class="fase-card__title">{s.data.title}</span>
              {s.data.entregable && <span class="fase-card__entregable">{s.data.entregable}</span>}
              <span class="fase-card__go" aria-hidden="true">→</span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  </section>
</BaseLayout>

<style>
  .container { max-width: 1240px; margin: 0 auto; padding: 0 clamp(1.5rem, 4vw, 3rem); }
  .breadcrumb { font-size: 0.92rem; color: var(--color-ink-mute); margin: 2rem 0; }
  .breadcrumb a { color: var(--color-ink-mute); text-decoration: none; }
  .breadcrumb a:hover { color: var(--color-gpe); }
  .breadcrumb .sep { margin: 0 0.5em; color: var(--color-mustard); }
  .hero { padding: 1rem 0 clamp(1.5rem, 4vw, 3rem); }
  .kicker { font-family: var(--font-sans); font-size: 0.8rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent); }
  h1 { max-width: 22ch; margin: 1rem 0 0.6rem; }
  .lede { font-family: var(--font-serif); font-style: italic; font-size: 1.35rem; color: var(--color-ink-soft); max-width: 52ch; margin: 1rem 0 1.5rem; line-height: 1.5; font-variation-settings: "SOFT" 80; }
  .downloads-lead { font-size: 1rem; color: var(--color-ink-soft); margin: 0 0 1rem; }
  .downloads { display: flex; flex-wrap: wrap; align-items: center; gap: 1.2rem; }
  .download-cta { display: inline-flex; align-items: center; gap: 1rem; padding: 0.9rem 1.4rem 0.9rem 1.1rem; background: var(--accent); color: #fff; text-decoration: none; border-radius: 6px; transition: filter .2s var(--ease-soft), transform .2s var(--ease-soft); }
  .download-cta:hover { filter: brightness(0.92); transform: translateY(-1px); }
  .download-cta__icon { font-family: var(--font-serif); font-style: italic; font-size: 1.7rem; line-height: 1; color: var(--color-mustard-soft); font-variation-settings: "SOFT" 100, "WONK" 1; }
  .download-cta__text { display: flex; flex-direction: column; gap: 0.15rem; }
  .download-cta__text strong { font-family: var(--font-sans); font-size: 0.95rem; font-weight: 600; }
  .download-cta__text .muted { font-family: var(--font-sans); font-size: 0.78rem; opacity: 0.8; letter-spacing: 0.04em; }
  .download-secondary { font-family: var(--font-serif); font-style: italic; font-size: 1rem; color: var(--color-ink-soft); text-decoration: none; border-bottom: 1px dashed var(--color-line); padding-bottom: 1px; font-variation-settings: "SOFT" 80; }
  .download-secondary:hover { color: var(--accent); border-bottom-color: var(--accent); }
  .adapt-note { margin: 1.6rem 0 0; font-family: var(--font-serif); font-style: italic; font-size: 1rem; color: var(--color-ink-soft); background: var(--accent-soft); border-left: 4px solid var(--accent); border-radius: 0 4px 4px 0; padding: 0.9rem 1.2rem; max-width: 60ch; }
  .related-note { margin: 1rem 0 0; font-size: 0.98rem; color: var(--color-ink-soft); line-height: 1.6; max-width: 60ch; }
  .related-note a { color: var(--accent); text-decoration: none; border-bottom: 1px solid var(--accent-soft); }
  .related-note a:hover { border-bottom-color: var(--accent); }
  .fases { padding: clamp(1.5rem, 4vw, 3rem) 0 clamp(3rem, 7vw, 6rem); }
  .fase-grid { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.2rem; }
  .fase-card { position: relative; display: flex; flex-direction: column; gap: 0.35rem; height: 100%; padding: 1.4rem 1.5rem; background: var(--color-paper); border: 1px solid var(--color-line); border-top: 3px solid var(--accent); border-radius: 8px; text-decoration: none; color: inherit; transition: transform .2s var(--ease-soft), box-shadow .2s var(--ease-soft); }
  .fase-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(42, 31, 24, 0.08); }
  .fase-card__num { font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent); font-weight: 500; }
  .fase-card__label { font-family: var(--font-sans); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--color-ink-mute); font-weight: 600; }
  .fase-card__title { font-family: var(--font-serif); font-size: 1.2rem; line-height: 1.2; color: var(--color-ink); margin-top: 0.1rem; }
  .fase-card__entregable { font-size: 0.9rem; color: var(--color-ink-soft); line-height: 1.45; margin-top: 0.2rem; }
  .fase-card__go { margin-top: auto; padding-top: 0.6rem; color: var(--accent); font-size: 1.1rem; }
</style>
```

- [ ] **Step 2: Verificar build y que la portada lista 6 fases**

Run: `npm run build`
Expected: build OK. `/gpe-bach/proyecto/` ahora es portada con 6 tarjetas. Los enlaces de descarga `gpe-bach-cuaderno-{alumno,profesor}.pdf` apuntan a ficheros que aún no existen (se generan en Task 9) — el HTML es correcto igualmente.

- [ ] **Step 3: Commit**

```bash
git add "src/pages/[asignatura]/proyecto/index.astro"
git commit -m "feat(gpe): turn project index into a phase-card cover with downloads"
```

---

## Task 7: Página de impresión del cuaderno dual `[modo]`

**Files:**
- Create: `src/pages/[asignatura]/proyecto/cuaderno/imprimir/[modo].astro`

Calcada de `src/pages/emprendimiento/proyecto/cuaderno/imprimir/[modo].astro`, pero por asignatura y con acento de asignatura. Genera 2 rutas por asignatura: `alumno` y `profesor`.

- [ ] **Step 1: Crear la página**

```astro
---
/**
 * Print-ready dual-edition «Cuaderno del equipo» for an asignatura project
 * (currently GPE). Used by scripts/build-cuaderno-gpe-pdf.mjs to produce the
 * alumno/profesor workbook PDFs. noindex.
 */
import BloqueCuaderno from '@components/emprendimiento/BloqueCuaderno.astro';
import { ASIGNATURAS, ASIGNATURA_SLUGS } from '@/lib/asignaturas';
import type { GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';

const ACCENTS: Record<string, { base: string; deep: string; soft: string }> = {
  edmn: { base: '#C44E2C', deep: '#9C3A1C', soft: '#FBE3D6' },
  eco1: { base: '#1F6E6E', deep: '#164F4F', soft: '#DBEDED' },
  eco4: { base: '#D4A24C', deep: '#A87A2A', soft: '#F5E5BC' },
  fopp: { base: '#5B3A4E', deep: '#46293A', soft: '#ECDCE5' },
  taller3: { base: '#6B8E23', deep: '#4F6B18', soft: '#E4ECD2' },
  ipe1: { base: '#4A6FA5', deep: '#36527D', soft: '#DCE5F0' },
  ipe2: { base: '#2F4F7F', deep: '#22395C', soft: '#D5DEEB' },
  eeae: { base: '#2E5E3A', deep: '#234A2D', soft: '#D9E6DC' },
  gpe:  { base: '#8C2F39', deep: '#6E2530', soft: '#F1DADD' },
};

export const getStaticPaths = (async () => {
  const all = (await getCollection('proyecto')).filter(
    (f) => f.data.estado === 'publicado' && f.data.cuaderno
  );
  const bySlug = new Map<string, typeof all>();
  for (const e of all) {
    const arr = bySlug.get(e.data.asignatura) ?? [];
    arr.push(e);
    bySlug.set(e.data.asignatura, arr);
  }
  const paths = [];
  for (const [slug, fases] of bySlug.entries()) {
    fases.sort((a, b) => a.data.orden - b.data.orden);
    for (const modo of ['alumno', 'profesor'] as const) {
      paths.push({ params: { asignatura: slug, modo }, props: { fases, asignatura: ASIGNATURAS[slug] } });
    }
  }
  return paths;
}) satisfies GetStaticPaths;

const { fases, asignatura: a } = Astro.props;
const esProfesor = Astro.params.modo !== 'alumno';
const edicion = esProfesor ? 'Profesorado' : 'Alumnado';
const accent = ACCENTS[a.color] ?? ACCENTS.gpe;
---
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="robots" content="noindex" />
    <title>{a.shortLabel} — Cuaderno del {edicion}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..700,0..100,0..1;1,9..144,300..700,0..100,0..1&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" />
    <style is:inline>
      @font-face { font-family: 'Switzer'; src: url('/fonts/switzer/switzer-400.woff2') format('woff2'); font-weight: 400; font-display: swap; font-style: normal; }
      @font-face { font-family: 'Switzer'; src: url('/fonts/switzer/switzer-500.woff2') format('woff2'); font-weight: 500; font-display: swap; font-style: normal; }
      @font-face { font-family: 'Switzer'; src: url('/fonts/switzer/switzer-600.woff2') format('woff2'); font-weight: 600; font-display: swap; font-style: normal; }
      @font-face { font-family: 'Switzer'; src: url('/fonts/switzer/switzer-700.woff2') format('woff2'); font-weight: 700; font-display: swap; font-style: normal; }
      :root {
        --color-bg: #FBF6EC; --color-paper: #FFFFFF; --color-bg-cream: #F5EDD9; --color-ink: #2A1F18;
        --color-ink-soft: #5C4A3D; --color-ink-mute: #806C5A;
        --color-line: #E5D4BD; --color-line-soft: #EFE2CB;
        --color-mustard: #D4A24C; --color-mustard-deep: #A87A2A; --color-mustard-soft: #F5E5BC;
        --color-terra: #C44E2C;
        --font-serif: "Fraunces", Georgia, serif;
        --font-sans: "Switzer", -apple-system, sans-serif;
        --font-mono: "JetBrains Mono", monospace;
      }
      @page { size: A4; margin: 18mm 16mm 16mm; }
      * { box-sizing: border-box; }
      body { margin: 0; font-family: var(--font-sans); color: var(--color-ink); font-size: 10.5pt; line-height: 1.5; background: #fff; }
      .cover { display: flex; flex-direction: column; justify-content: center; height: 244mm; break-after: page; }
      .cover__eyebrow { color: var(--accent-deep); font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; font-size: 11pt; }
      .cover__title { font-family: var(--font-serif); font-size: 34pt; line-height: 1.05; margin: 0.4rem 0; }
      .cover__ed { font-style: italic; font-family: var(--font-serif); color: var(--color-ink-soft); font-size: 14pt; }
      .cover__equipo { margin-top: 2.2rem; border: 1.5px solid var(--color-line); border-top: 3px solid var(--accent); border-radius: 6px; padding: 1.1rem 1.3rem; }
      .cover__equipo h3 { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent-deep); margin: 0 0 0.7rem; }
      .cover__field { border-bottom: 1px dashed var(--color-line); height: 1.9rem; margin-bottom: 0.7rem; font-size: 0.9rem; color: var(--color-ink-mute); }
      .toc { break-after: page; }
      .toc h2 { font-family: var(--font-serif); font-size: 22pt; }
      .toc ol { padding-left: 1.3rem; line-height: 1.9; }
      .fase { break-before: page; min-height: 242mm; }
      .fase__label { color: var(--accent-deep); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.78rem; }
      .fase__title { font-family: var(--font-serif); font-size: 20pt; margin: 0.2rem 0; }
      .fase__entregable { color: var(--color-ink-soft); font-style: italic; margin: 0 0 0.6rem; font-size: 0.95rem; }
    </style>
    <style is:inline set:html={`body { --accent: ${accent.base}; --accent-deep: ${accent.deep}; --accent-soft: ${accent.soft}; }`}></style>
  </head>
  <body>
    <section class="cover">
      <div class="cover__eyebrow">{a.shortLabel} · Cuaderno de proyecto</div>
      <div class="cover__title">Vuestro proyecto, paso a paso</div>
      <div class="cover__ed">Edición · {edicion}</div>
      <div class="cover__equipo">
        <h3>El equipo</h3>
        <div class="cover__field">Nombre del proyecto:</div>
        <div class="cover__field">Integrantes:</div>
        <div class="cover__field">Curso y grupo:</div>
      </div>
    </section>

    <section class="toc">
      <h2>Las fases</h2>
      <ol>{fases.map((f) => <li>{f.data.fase ?? f.data.title} — {f.data.title}</li>)}</ol>
    </section>

    {fases.map((f) => (
      <section class="fase">
        <div class="fase__label">{f.data.fase ?? `Fase ${f.data.orden}`}</div>
        <h2 class="fase__title">{f.data.title}</h2>
        {f.data.entregable && <p class="fase__entregable"><strong>Entregable:</strong> {f.data.entregable}</p>}
        <BloqueCuaderno cuaderno={f.data.cuaderno} modo={esProfesor ? 'profesor' : 'alumno'} />
      </section>
    ))}
  </body>
</html>
```

- [ ] **Step 2: Verificar build (rutas aún vacías hasta tener `cuaderno`)**

Run: `npm run build`
Expected: build OK. Las rutas `/gpe-bach/proyecto/cuaderno/imprimir/{alumno,profesor}/` solo se generan cuando alguna fase tiene `cuaderno`. Hasta la Task 8 no habrá ninguna, así que puede que estas rutas no aparezcan todavía — es esperado. No falla el build.

- [ ] **Step 3: Commit**

```bash
git add "src/pages/[asignatura]/proyecto/cuaderno/imprimir/[modo].astro"
git commit -m "feat(gpe): dual-edition printable workbook route per asignatura"
```

---

## Task 8: Enriquecer las 6 fases (frontmatter + componentes editoriales)

Una subtarea por fase. Para CADA fase: añadir al frontmatter `duracion`, `entregable`, `competencia_especifica`, `saberes`, `unidades_relacionadas` y el bloque `cuaderno`; e insertar en el cuerpo, en este orden, `<EnEstaFase>` (arriba del todo, tras los imports), `<CasoReal>` (tras la intro), `<HerramientaIsland>` donde aplique (solo Fase 4), y `<ErroresQueCuestan>` (antes del entregable). El cuerpo pedagógico actual se conserva.

**IMPORTANTE — contenido (CLAUDE.md):**
- Acentos diacríticos correctos en todo el texto castellano.
- Sin emojis pictográficos; sí símbolos tipográficos (→ × —).
- Casos reales: fuente real citada, o marcados "Adaptado de fuentes públicas". Pau valida/intercambia los casos antes del merge — los del spec son propuesta.
- Cada `cuaderno.plantilla.tipo` debe ser uno de: `canvas-bm | 4p | punto-muerto | procesos | pitch | tabla`.

**Mapa fase → plantilla y calculadora (decisión de diseño):**

| Fase (orden) | fichero | plantilla cuaderno | calculadora inline | CE |
|---|---|---|---|---|
| 0 | `00-equipo-y-reto.mdx` | `tabla` (reto: necesidad/afectados/porqué) | — | CE1 |
| 1 | `01-idea-y-oportunidad.mdx` | `tabla` (idea/oportunidad: criterios) | — | CE1 |
| 2 | `02-modelo-negocio-arranque.mdx` | `canvas-bm` | — | CE2 |
| 3 | `03-marketing-y-prototipo.mdx` | `4p` | — | CE2 |
| 4 | `04-viabilidad.mdx` | `punto-muerto` | `PuntoMuerto` + `VANTIR` | CE3 |
| 5 | `05-puesta-en-marcha-y-pitch.mdx` | `pitch` | — | CE3 |

> Nota: las CE exactas (CE1/CE2/CE3) deben verificarse contra `src/content/asignaturas/gpe-bach/evaluacion/evaluacion.mdx` o `programacion/programacion.mdx` antes de escribir cada frontmatter; usa las que ya estén definidas ahí para GPE. Si el fichero define otras etiquetas (p. ej. "CE 1.1"), usa esas literalmente.

Cada subtarea sigue el MISMO patrón. Se detalla la Fase 0 como modelo COMPLETO; las demás replican el patrón con su contenido propio.

### Task 8.0: Fase 0 — Equipo y reto

**Files:**
- Modify: `src/content/asignaturas/gpe-bach/proyecto/00-equipo-y-reto.mdx`

- [ ] **Step 1: Verificar las CE/saberes reales de GPE**

Run: `Grep -n "CE" src/content/asignaturas/gpe-bach/evaluacion/evaluacion.mdx`
Expected: lista de competencias específicas de GPE. Anota la etiqueta literal de la CE de emprendimiento/innovación para usarla en el frontmatter (el cuerpo actual ya cita "CE1" y "Bloc 1" del Decret 108/2022).

- [ ] **Step 2: Ampliar el frontmatter**

Sustituye el frontmatter de `00-equipo-y-reto.mdx` por (ajusta `competencia_especifica` y `saberes` a lo verificado en Step 1):

```yaml
---
asignatura: gpe-bach
orden: 0
title: "Equipo y reto: autoconocimiento y desafío local"
fase: "Fase 0 — Equipo y reto"
duracion: "2-3 sesiones"
entregable: "DAFO personal de cada miembro, reparto de roles, normas de equipo y ficha del reto local elegido."
competencia_especifica: "CE1"
saberes:
  - "El proceso emprendedor (B1)"
  - "Autodiagnóstico de actitudes emprendedoras (B1.2.1)"
  - "Detección de oportunidades en el entorno (B1.3.1, B1.3.4)"
unidades_relacionadas:
  - { asignatura: gpe-bach, unidad: 1, nota: "Autodiagnóstico y emprendimiento social" }
cuaderno:
  tarea: "Rellenad la <strong>ficha del reto local</strong> de vuestro equipo: qué necesidad de vuestro entorno habéis detectado, a quién afecta, por qué importa y por qué sois el equipo adecuado para abordarla."
  reflexion: "¿Vuestro reto es de verdad un problema local que os importa, o lo habéis elegido por comodidad?"
  orientacion_docente: "Forzad que el reto sea verificable de primera mano (barrio, pueblo, instituto). Rechazad retos genéricos tipo «el cambio climático»: pedid que lo aterricen a una manifestación local concreta. Una buena señal: el equipo puede nombrar a personas reales afectadas."
  plantilla:
    tipo: tabla
    columnas: ["Necesidad o problema local", "¿A quién afecta?", "¿Por qué importa?", "¿Por qué nuestro equipo?"]
    filas: 1
lang: es
estado: publicado
---
```

- [ ] **Step 3: Añadir los imports de los componentes nuevos**

En el bloque de imports del MDX (tras `import RolesEquipo …`), añade:

```mdx
import EnEstaFase from '@components/EnEstaFase.astro';
import CasoReal from '@components/CasoReal.astro';
import ErroresQueCuestan from '@components/ErroresQueCuestan.astro';
```

- [ ] **Step 4: Insertar `<EnEstaFase>` al inicio del cuerpo**

Justo después del último import y ANTES del párrafo "Bienvenidos al cuaderno…", inserta:

```mdx
<EnEstaFase
  haras="Conoceros como equipo (DAFO personal y reparto de roles) y elegir un reto real de vuestro entorno."
  entregable="Ficha del reto local + normas de equipo"
  sesiones="2-3 sesiones"
>
Repasad de la **Unidad 1** el autodiagnóstico de actitudes emprendedoras y la idea de emprendimiento social: aquí los vais a aplicar, no a estudiar.
</EnEstaFase>
```

- [ ] **Step 5: Insertar `<CasoReal>` tras el párrafo de intro**

Tras el párrafo que termina "…el sello de esta materia es el desarrollo económico de proximidad." e inserta (caso PROPUESTO, a validar por Pau):

```mdx
<CasoReal
  titular="La Fageda: una cooperativa que nació de un problema de su comarca"
  fuente="Adaptado de fuentes públicas sobre La Fageda (La Garrotxa, Girona)"
  pregunta="¿Qué problema de vuestro entorno conocéis tan de cerca como para querer resolverlo?"
>
En la comarca de La Garrotxa, un grupo decidió dar trabajo digno a personas con problemas de salud mental que el mercado laboral dejaba fuera. En vez de montar «cualquier negocio», partieron de un reto local muy concreto y construyeron alrededor una cooperativa de yogures que hoy emplea a cientos de personas y retiene valor en su territorio.

Lo que hizo fuerte al proyecto no fue la idea de los yogures: fue el equipo y el reto. Sabían a quién querían ayudar y por qué eran ellos quienes debían hacerlo.
</CasoReal>
```

- [ ] **Step 6: Insertar `<ErroresQueCuestan>` antes de "## Entregable de la Fase 0"**

```mdx
<ErroresQueCuestan>
- **Elegir el reto por amistad, no por las fortalezas del equipo.** El reparto de roles tiene que salir del DAFO real, no de con quién os lleváis mejor.
- **Un reto demasiado grande o lejano.** «Acabar con el paro» no es un reto de proyecto; «la falta de un punto de recogida de bicis en el instituto» sí. Si no lo conocéis de primera mano, se os caerá en la Fase 1.
- **Saltaros las normas de equipo.** El proyecto largo se hunde por la convivencia antes que por la idea. Pactad ahora, en frío, qué hacéis cuando alguien no cumple.
</ErroresQueCuestan>
```

- [ ] **Step 7: Añadir «Para el aula» al final del fichero**

El componente `RecursosRelacionados` se invoca desde la página de fase vía `PuenteUnidades` (ya incluido en Task 5, que usa `unidades_relacionadas`). NO se añade dentro del MDX. Verifica solo que `unidades_relacionadas` del frontmatter apunta a la unidad correcta del libro de GPE (hecho en Step 2).

- [ ] **Step 8: Build y revisión visual**

Run: `npm run build`
Expected: build OK. La ruta `/gpe-bach/proyecto/00/` renderiza EnEstaFase, CasoReal, el cuerpo, ErroresQueCuestan, el BloqueCuaderno (plantilla tabla) y el puente a la Unidad 1. La ruta `/gpe-bach/proyecto/cuaderno/imprimir/alumno/` ya existe (hay al menos una fase con `cuaderno`).

- [ ] **Step 9: Commit**

```bash
git add src/content/asignaturas/gpe-bach/proyecto/00-equipo-y-reto.mdx
git commit -m "content(gpe): enrich phase 0 (En esta fase, caso real, errores, cuaderno)"
```

### Task 8.1–8.5: Fases 1 a 5

**Files (una por subtarea):**
- `src/content/asignaturas/gpe-bach/proyecto/01-idea-y-oportunidad.mdx`
- `src/content/asignaturas/gpe-bach/proyecto/02-modelo-negocio-arranque.mdx`
- `src/content/asignaturas/gpe-bach/proyecto/03-marketing-y-prototipo.mdx`
- `src/content/asignaturas/gpe-bach/proyecto/04-viabilidad.mdx`
- `src/content/asignaturas/gpe-bach/proyecto/05-puesta-en-marcha-y-pitch.mdx`

Para cada fase, repetir EXACTAMENTE los Steps 1-9 de la Task 8.0 con su contenido propio:

- [ ] **Fase 1 — Idea y oportunidad** · plantilla `tabla` (criterios idea→oportunidad) · sin calculadora · CE de innovación/oportunidad. Caso propuesto: **Internxt** (València, nube privada) — de una necesidad (privacidad de datos) a oportunidad detectada; fuente "Adaptado de fuentes públicas sobre Internxt". Errores típicos: confundir idea con oportunidad; enamorarse de la idea sin validar; no mirar a la competencia. `cuaderno.tarea`: rellenar la tabla de validación idea/oportunidad. `unidades_relacionadas`: libro GPE unidad 2.
- [ ] **Fase 2 — Modelo de negocio y arranque** · plantilla `canvas-bm` · sin calculadora · CE de gestión/modelo. Caso propuesto: **Som Energia** — por qué eligieron forma cooperativa frente a SL; fuente "Adaptado de fuentes públicas sobre Som Energia". Errores: un canvas con nueve bloques que no encajan entre sí; elegir forma jurídica sin informarse en el PAE; olvidar los costes reales de arranque. `cuaderno.tarea`: dibujar el Business Model Canvas del proyecto. `unidades_relacionadas`: libro GPE unidad 3.
- [ ] **Fase 3 — Marketing y prototipo** · plantilla `4p` · sin calculadora · CE de marketing/comercial. Caso propuesto: **Sheedo** (València, papel plantable) — prototipo y las 4P; fuente "Adaptado de fuentes públicas sobre Sheedo". Errores: prototipo demasiado caro/perfecto antes de validar; 4P incoherentes con el segmento; no probar el prototipo con clientes reales. `cuaderno.tarea`: completar el marketing mix (4P) del proyecto. `unidades_relacionadas`: libro GPE unidad 4.
- [ ] **Fase 4 — Viabilidad** · plantilla `punto-muerto` · **calculadoras `PuntoMuerto` y `VANTIR` inline** · CE de viabilidad/contabilidad. Caso propuesto: **La Fageda / Auara** — rentable Y con impacto triple; fuente "Adaptado de fuentes públicas". Errores: contar solo la viabilidad económica y olvidar la social/ambiental; ingresos optimistas sin punto muerto; confundir beneficio con caja. `cuaderno.tarea`: calcular el punto muerto del proyecto y rellenar la plantilla. `unidades_relacionadas`: libro GPE unidad 6 (y 7 para impacto). Para las calculadoras, añadir `import HerramientaIsland from '@components/calculadoras/HerramientaIsland.astro';` y, en la sección de números, `<HerramientaIsland componente="PuntoMuerto" />` y en la de financiación `<HerramientaIsland componente="VANTIR" />` (mismo uso que en `libro/06-…mdx:262`).
- [ ] **Fase 5 — Puesta en marcha y pitch** · plantilla `pitch` · sin calculadora · CE de comunicación/puesta en marcha. Caso propuesto: **Internxt** u otra startup local que logró financiación con su pitch; fuente "Adaptado de fuentes públicas". Errores: un pitch que cuenta el producto y no el problema; leer las diapositivas; no ensayar el tiempo. `cuaderno.tarea`: preparar el guion del pitch (10 diapositivas). `unidades_relacionadas`: libro GPE unidad 1 (proceso emprendedor) o la que cierre el proyecto.

Cada subtarea termina con su build verde y su commit:

- [ ] Build tras cada fase: `npm run build` → OK; la fase renderiza completa.
- [ ] Commit por fase: `git commit -m "content(gpe): enrich phase N (…)"`.

---

## Task 9: Script de PDF dual del cuaderno de GPE

**Files:**
- Create: `scripts/build-cuaderno-gpe-pdf.mjs`
- Modify: `package.json` (scripts)

- [ ] **Step 1: Crear el script**

Crea `scripts/build-cuaderno-gpe-pdf.mjs` como copia de `scripts/build-cuaderno-pdf.mjs` cambiando SOLO el array `JOBS` (líneas 22-25 del original) por las rutas y salidas de GPE. El resto del fichero (servidor estático, detección de Chrome, pagedjs-cli, copia a `public/downloads/`) es idéntico. El `JOBS` nuevo:

```js
const JOBS = [
  { path: 'gpe-bach/proyecto/cuaderno/imprimir/alumno',   out: 'gpe-bach-cuaderno-alumno.pdf' },
  { path: 'gpe-bach/proyecto/cuaderno/imprimir/profesor', out: 'gpe-bach-cuaderno-profesor.pdf' },
];
const PORT = 4339;
```

(Cambia también el `PORT` a 4339 para no chocar con el 4337 del script transversal, y el mensaje final de consola a "Cuadernos GPE (alumno + profesor) listos".)

- [ ] **Step 2: Añadir el script a package.json**

En `package.json`, añade tras la línea `"build:cuaderno": …` (línea 24):

```json
    "build:cuaderno-gpe": "node scripts/build-cuaderno-gpe-pdf.mjs",
```

Y en `build:all` (línea 29), añade `&& npm run build:cuaderno-gpe` justo después de `&& npm run build:cuaderno`:

```
… && npm run build:entrevista && npm run build:cuaderno && npm run build:cuaderno-gpe && npm run build:debates && …
```

- [ ] **Step 3: Generar los PDFs (requiere build previo + Chrome)**

Run:
```
npm run build
npm run build:cuaderno-gpe
```
Expected: se crean `public/downloads/gpe-bach-cuaderno-alumno.pdf` y `gpe-bach-cuaderno-profesor.pdf`. El de profesor incluye los bloques "Orientación docente"; el de alumno no. (Requiere Chrome instalado; el script lo autodetecta en Windows.)

- [ ] **Step 4: Verificar la diferencia alumno/profesor**

Run: `Grep -c "Orientación docente" <(pdftotext public/downloads/gpe-bach-cuaderno-profesor.pdf -)` si `pdftotext` está disponible; si no, abrir ambos PDFs y comprobar visualmente que solo el de profesor tiene las cajas de orientación.
Expected: profesor > 0 ocurrencias; alumno = 0.

- [ ] **Step 5: Commit**

```bash
git add scripts/build-cuaderno-gpe-pdf.mjs package.json public/downloads/gpe-bach-cuaderno-alumno.pdf public/downloads/gpe-bach-cuaderno-profesor.pdf
git commit -m "feat(gpe): dual-edition workbook PDFs (alumno + profesor)"
```

---

## Task 10: Verificación final y cierre

**Files:** ninguno (verificación).

- [ ] **Step 1: Build completo verde**

Run: `npm run build`
Expected: OK, sin errores. Rutas presentes: `/gpe-bach/proyecto/`, `/gpe-bach/proyecto/00..05/`, `/gpe-bach/proyecto/cuaderno/imprimir/{alumno,profesor}/`.

- [ ] **Step 2: Regenerar la guía completa del profe (PDF existente)**

Run: `npm run build:proyecto`
Expected: `gpe-bach-proyecto.pdf` regenerado con el contenido enriquecido (ahora incluye los nuevos componentes en el flujo de impresión). Verifica que los componentes nuevos tienen `@media print` (lo tienen, por diseño) y no rompen la paginación.

- [ ] **Step 3: Revisión de checklist del spec**

Comprueba contra `docs/superpowers/specs/2026-06-10-cuaderno-proyecto-gpe-redo.md` §"Criterios de éxito":
1. Portada con 6 tarjetas + 3 descargas ✓
2. 6 fases con anatomía completa + nav ✓
3. PDFs duales con/ sin orientación ✓
4. `npm run build` verde ✓
5. Acentos en granate (`--color-gpe`), sello local presente, sin terracota como color principal ✓
6. Sin contenido copiado; casos marcados "Adaptado de…" pendientes de validación de Pau ✓

- [ ] **Step 4: Actualizar memoria del proyecto**

Crea/actualiza un fichero de memoria del proyecto resumiendo el rediseño (estructura por fase, componentes nuevos, PDFs duales, casos pendientes de validación de Pau), y añade su línea al `MEMORY.md`.

- [ ] **Step 5: Abrir PR (no merge directo a main)**

```bash
git push -u origin feat/cuaderno-proyecto-gpe
gh pr create --base main --title "feat(gpe): rediseño del cuaderno de proyecto (paridad con «De cero a empresa»)" --body "..."
```

Recuerda (CLAUDE.md): mínimo 1h entre abrir y mergear; Pau valida los casos reales antes del merge.

---

## Self-Review (hecho por el autor del plan)

**Cobertura del spec:**
- Arquitectura de rutas → Tasks 5, 6, 7 ✓
- Schema extendido → Task 1 ✓
- Anatomía de fase (EnEstaFase, CasoReal, cuerpo, HerramientaIsland, ErroresQueCuestan, BloqueCuaderno, rúbrica, Para el aula) → Tasks 2-4 (componentes) + 8 (aplicación) + 5 (PuenteUnidades en la página) ✓
- Casos reales locales → Task 8 (propuestos, a validar) ✓
- PDFs duales + guía → Task 9 + Task 10 Step 2 ✓
- Color granate + sello local → Tasks 5, 6, 7 (`--color-gpe`) ✓
- Fuera de alcance respetado (no se fusionan colecciones, no se toca DCaE) ✓

**Placeholder scan:** sin TBD/TODO. El único punto diferido explícitamente es la etiqueta literal de la CE (Task 8.0 Step 1 lo resuelve verificando contra el fichero de evaluación real, en vez de inventarla) — esto es verificación, no placeholder.

**Type consistency:** `cuaderno.plantilla.tipo` usa el enum del schema (Task 1) en todas las fases (Task 8). `--accent`/`--accent-soft` se definen igual en Tasks 5, 6, 7. `componente="PuntoMuerto"`/`"VANTIR"` coinciden con los nombres del dispatcher `HerramientaIsland`. Nombres de PDF (`gpe-bach-cuaderno-{alumno,profesor}.pdf`, `gpe-bach-proyecto.pdf`) coinciden entre la portada (Task 6), el script (Task 9) y el build existente.
