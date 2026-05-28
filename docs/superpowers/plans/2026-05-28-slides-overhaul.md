# Slides Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the skeleton-only Marp decks into self-sufficient editorial-keynote slides for EDMN 2BACH (12 units), honoring every rich MDX component (CasoDilema, Figure, RealExample, SolvedExercise, Diagram, VocesDesacuerdo, PistaEbau, RetoEtapa, MirarFora) at 40-70 slides per unit.

**Architecture:** Three-stage pipeline. (1) `scripts/capture-diagrams.mjs` uses Puppeteer to screenshot every `<Diagram>` instance from the Astro preview to `public/slides-assets/`. (2) `scripts/extract-slides.mjs` rewritten with `unified`+`remark-mdx` to walk the MDX AST and emit per-component Marp slides. (3) `scripts/build-slides.mjs` calls Marp CLI with a `--html-only` shortcut for fast iteration. Theme `marp-themes/profedeeconomia.css` is extended with 12 new section classes.

**Tech Stack:** Node ESM scripts, `puppeteer` (already installed), `unified` + `remark-parse` + `remark-mdx` + `mdast-util-mdx` (already in tree via Astro MDX), `yaml`, `@marp-team/marp-cli`. Vitest for unit tests.

**Spec:** `docs/superpowers/specs/2026-05-28-slides-overhaul-design.md`

**Branch:** `feat/edmn-pilot-innovacion` (existing — slides regeneration is the last block before merging the editorial-innovation pilot to main).

---

## File structure (created or modified)

```
NEW · scripts/capture-diagrams.mjs            Puppeteer screenshot driver
NEW · scripts/slide-parsers/                  One parser per MDX component
        index.mjs                             public API (parseUnit)
        ast.mjs                               MDX AST helpers (find, text, props)
        imports.mjs                           resolves `import x from '@assets/...'`
        frontmatter.mjs                       title/objetivos/conceptos slides
        tldr.mjs                              <TldrUnidad>
        caso.mjs                              <CasoDilema> + <VuelveAlCaso>
        figure.mjs                            <Figure>
        real-example.mjs                      <RealExample>
        solved-exercise.mjs                   <SolvedExercise> → 2 slides
        curiosity.mjs                         <Curiosity>
        steps.mjs                             <Steps>
        callout.mjs                           <Callout>
        diagram.mjs                           <Diagram> → PNG lookup
        voces.mjs                             <VocesDesacuerdo>
        pista-ebau.mjs                        <PistaEbau>
        reto-etapa.mjs                        <RetoEtapa>
        mirar-fora.mjs                        <MirarFora>
        key-takeaways.mjs                     <KeyTakeaways>
        h2-section.mjs                        prose between components
NEW · scripts/slide-builders/
        title-slide.mjs                       title + lema layout
        section-cover.mjs                     H2 divider slide
        deck-assembler.mjs                    orders slides in original MDX order
NEW · scripts/__fixtures__/slides/
        sample-unit.mdx                       isolated MDX for tests
NEW · scripts/extract-slides.test.mjs         end-to-end fixture test
MOD · scripts/extract-slides.mjs              orchestrator (re-written)
MOD · scripts/build-slides.mjs                + --html-only flag
MOD · src/components/Diagram.astro            + id prop → data-slide-diagram
MOD · marp-themes/profedeeconomia.css         + 12 new section classes
NEW · public/slides-assets/edmn-2bach/        (gitignored, generated PNGs)
NEW · tmp/slides-assets-manifest.json         hash cache for captured diagrams
```

---

## Task 1 · Extend Marp theme with the 12 new section classes

**Files:**
- Modify: `marp-themes/profedeeconomia.css` (append after existing `section.close` block)

- [ ] **Step 1 · Read current theme**

Run: read the file to confirm current structure. The new rules append after the last `section.close` block (around line 283).

- [ ] **Step 2 · Append new theme rules**

Add at the end of `marp-themes/profedeeconomia.css`:

```css
/* ============================================================
   Global density tweaks for self-study decks
   ============================================================ */
section { font-size: 28px; }
section p { max-width: 42em; }
section h2 { font-size: 40px; }

/* ============================================================
   TL;DR slide                       (<!-- _class: tldr -->)
   ============================================================ */
section.tldr {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 80px 100px;
}
section.tldr::before { content: "TL;DR"; position: static; font-family: var(--font-sans); font-size: 14px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--color-terra); font-weight: 700; margin-bottom: 24px; display: block; }
section.tldr .pullquote {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 42px;
  line-height: 1.3;
  color: var(--color-ink);
  font-variation-settings: "SOFT" 100, "WONK" 1;
  max-width: 24em;
  border-top: 4px solid var(--color-terra);
  padding-top: 24px;
}

/* ============================================================
   Caso dilema / Vuelve al caso     (<!-- _class: caso -->)
   ============================================================ */
section.caso {
  display: grid;
  grid-template-columns: 45% 1fr;
  gap: 50px;
  padding: 0;
  align-items: stretch;
}
section.caso .caso__media {
  background-size: cover;
  background-position: center;
  min-height: 100%;
}
section.caso .caso__body {
  padding: 70px 70px 60px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
section.caso .caso__kicker {
  font-family: var(--font-sans);
  font-size: 13px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-terra);
  font-weight: 700;
  margin-bottom: 16px;
}
section.caso h2 {
  font-family: var(--font-serif);
  font-size: 36px;
  line-height: 1.2;
  margin: 0 0 22px;
  padding: 0;
}
section.caso h2::before { display: none; }
section.caso .caso__pregunta {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 24px;
  line-height: 1.4;
  color: var(--color-ink-soft);
  font-variation-settings: "SOFT" 100, "WONK" 1;
  margin: 0 0 24px;
}
section.caso .caso__fuente {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-ink-mute);
}
section.caso-resuelto .caso__media { filter: opacity(0.7); }
section.caso-resuelto .caso__kicker { color: var(--color-mustard-deep); }

/* ============================================================
   Figure slide                      (<!-- _class: figure -->)
   ============================================================ */
section.figure {
  text-align: center;
  padding: 60px 80px;
}
section.figure img { max-width: 100%; max-height: 72vh; }
section.figure figcaption,
section.figure .figure__caption {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 20px;
  line-height: 1.4;
  color: var(--color-ink-soft);
  margin-top: 18px;
  font-variation-settings: "SOFT" 80;
}
section.figure .figure__credit {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-ink-mute);
  margin-top: 8px;
}

/* ============================================================
   Diagram slide                     (<!-- _class: diagram -->)
   ============================================================ */
section.diagram {
  background: var(--color-bg-cream);
  text-align: center;
  padding: 50px 80px;
}
section.diagram h2 { padding-top: 0; margin-bottom: 20px; }
section.diagram h2::before { display: none; }
section.diagram img { max-width: 100%; max-height: 70vh; }
section.diagram .diagram__caption {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 20px;
  color: var(--color-ink-soft);
  margin-top: 18px;
}

/* ============================================================
   Real example slide                (<!-- _class: example -->)
   ============================================================ */
section.example {
  padding: 70px 80px;
}
section.example .example__kicker {
  font-family: var(--font-sans);
  font-size: 13px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-terra);
  font-weight: 700;
  margin-bottom: 16px;
}
section.example h2 {
  border-left: 4px solid var(--color-terra);
  padding: 0 0 0 24px;
  margin-left: 0;
  font-size: 38px;
}
section.example h2::before { display: none; }
section.example .example__body { font-size: 24px; line-height: 1.6; max-width: 38em; }

/* ============================================================
   Curiosity slide                   (<!-- _class: curiosity -->)
   ============================================================ */
section.curiosity {
  background: var(--color-mustard-soft);
  padding: 70px 100px;
  position: relative;
}
section.curiosity::before {
  content: "✻";
  position: absolute;
  top: 30px;
  right: 60px;
  font-family: var(--font-serif);
  font-size: 90px;
  color: var(--color-mustard-deep);
  opacity: 0.4;
}
section.curiosity h2 { color: var(--color-mustard-deep); font-style: italic; font-variation-settings: "SOFT" 100, "WONK" 1; }
section.curiosity h2::before { background: var(--color-mustard-deep); }

/* ============================================================
   Exercise slide                    (<!-- _class: exercise -->)
   ============================================================ */
section.exercise {
  background: var(--color-bg-cream);
  padding: 60px 80px;
}
section.exercise .exercise__kicker {
  font-family: var(--font-sans);
  font-size: 13px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-terra);
  font-weight: 700;
  margin-bottom: 14px;
}
section.exercise h2 { font-size: 32px; margin-bottom: 22px; }
section.exercise .exercise__steps {
  counter-reset: step;
  list-style: none;
  padding-left: 0;
  font-size: 22px;
}
section.exercise .exercise__steps li {
  counter-increment: step;
  padding-left: 48px;
  margin-bottom: 14px;
  position: relative;
}
section.exercise .exercise__steps li::before {
  content: counter(step);
  position: absolute;
  left: 0;
  top: -4px;
  font-family: var(--font-serif);
  font-size: 30px;
  color: var(--color-terra);
  font-weight: 500;
}
section.exercise .exercise__result {
  margin-top: 24px;
  display: inline-block;
  padding: 8px 18px;
  background: var(--color-terra);
  color: var(--color-bg);
  font-family: var(--font-mono);
  border-radius: 4px;
}

/* ============================================================
   Voces en desacuerdo               (<!-- _class: voces -->)
   ============================================================ */
section.voces {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  padding: 0;
  align-items: stretch;
}
section.voces .voces__col {
  padding: 70px 50px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
section.voces .voces__col + .voces__col { border-left: 1px solid var(--color-line); }
section.voces .voces__label {
  font-family: var(--font-sans);
  font-size: 13px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-weight: 700;
  margin-bottom: 12px;
}
section.voces .voces__col--a .voces__label { color: var(--color-terra); }
section.voces .voces__col--b .voces__label { color: var(--color-mustard-deep); }
section.voces .voces__name {
  font-family: var(--font-serif);
  font-size: 28px;
  margin-bottom: 18px;
  color: var(--color-ink);
  font-variation-settings: "SOFT" 80;
}
section.voces .voces__pos { font-size: 22px; line-height: 1.5; color: var(--color-ink); }

/* ============================================================
   Pista EBAU                        (<!-- _class: ebau -->)
   ============================================================ */
section.ebau { padding: 70px 80px; }
section.ebau .ebau__flag {
  display: inline-block;
  padding: 4px 10px;
  background: var(--color-mustard);
  color: var(--color-ink);
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: 16px;
}
section.ebau h2 { font-size: 36px; margin-bottom: 22px; }
section.ebau .ebau__body { font-size: 22px; line-height: 1.6; }

/* ============================================================
   Reto etapa                        (<!-- _class: reto -->)
   ============================================================ */
section.reto {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 60px;
  padding: 70px 80px;
  align-items: center;
}
section.reto .reto__num {
  font-family: var(--font-serif);
  font-size: 200px;
  line-height: 1;
  color: transparent;
  -webkit-text-stroke: 2px var(--color-terra);
  font-variation-settings: "SOFT" 100, "WONK" 1;
  font-style: italic;
}
section.reto h2 { padding: 0; margin: 0 0 18px; font-size: 34px; }
section.reto h2::before { display: none; }
section.reto .reto__tasks { font-size: 20px; line-height: 1.6; }

/* ============================================================
   Mirar fora                        (<!-- _class: mirar-fora -->)
   ============================================================ */
section.mirar-fora {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 1px;
  padding: 0;
  background: var(--color-line);
}
section.mirar-fora h2 { display: none; }
section.mirar-fora .mf__cell {
  background: var(--color-bg);
  padding: 40px 40px;
  display: flex;
  flex-direction: column;
}
section.mirar-fora .mf__icon {
  font-family: var(--font-serif);
  font-size: 32px;
  color: var(--color-terra);
  margin-bottom: 12px;
  font-variation-settings: "SOFT" 100, "WONK" 1;
}
section.mirar-fora .mf__type {
  font-family: var(--font-sans);
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-ink-mute);
  margin-bottom: 6px;
}
section.mirar-fora .mf__title { font-family: var(--font-serif); font-size: 22px; line-height: 1.3; color: var(--color-ink); margin-bottom: 6px; }
section.mirar-fora .mf__author { font-family: var(--font-mono); font-size: 13px; color: var(--color-ink-mute); margin-bottom: 10px; }
section.mirar-fora .mf__desc { font-size: 16px; line-height: 1.5; color: var(--color-ink-soft); }

/* ============================================================
   Section cover (H2 divider)        (<!-- _class: section -->)
   uses existing section.section, no changes needed here.
   ============================================================ */
```

- [ ] **Step 3 · Commit**

```bash
git add marp-themes/profedeeconomia.css
git commit -m "feat(slides): extend Marp theme with 12 new section classes for dense decks"
```

---

## Task 2 · Instrument `<Diagram>` with `id` prop

**Files:**
- Modify: `src/components/Diagram.astro`

- [ ] **Step 1 · Add `id` prop**

Replace the `Props` type and `figure` opening tag in `src/components/Diagram.astro`:

```astro
type Props = {
  caption: string;
  source?: string;
  variant?: 'default' | 'tight';
  /** Stable id used by capture-diagrams.mjs to name the PNG for slide output. */
  id?: string;
};

const { caption, source, variant = 'default', id } = Astro.props;
---

<figure
  class:list={['diagram', `diagram--${variant}`]}
  data-slide-diagram={id ?? ''}
>
```

- [ ] **Step 2 · Manual: ensure every `<Diagram>` in EDMN 2BACH MDX has an id**

This step is done **inside** the capture script (Task 3) — it falls back to positional indexing when `id=""`. So no MDX edits required up front. We'll add explicit ids later only for diagrams that get reused across units (none in EDMN).

- [ ] **Step 3 · Commit**

```bash
git add src/components/Diagram.astro
git commit -m "feat(slides): add optional id prop to Diagram for slide-asset capture"
```

---

## Task 3 · Create `capture-diagrams.mjs`

**Files:**
- Create: `scripts/capture-diagrams.mjs`
- Create (gitignored): `public/slides-assets/.gitkeep`
- Create (gitignored): `tmp/slides-assets-manifest.json`
- Modify: `.gitignore` (add `public/slides-assets/`)

- [ ] **Step 1 · Add `.gitignore` entries**

Append to `.gitignore`:

```
public/slides-assets/
tmp/slides-assets-manifest.json
```

Then:
```bash
mkdir -p public/slides-assets
touch public/slides-assets/.gitkeep
```

- [ ] **Step 2 · Write the script**

Create `scripts/capture-diagrams.mjs`:

```javascript
#!/usr/bin/env node
/**
 * Capture every <Diagram> instance from the Astro preview as a high-res PNG
 * so it can be embedded in Marp slide decks.
 *
 * Pipeline:
 *   1. Start `astro preview` in a child process (assumes `astro build` has run).
 *   2. Wait until http://localhost:4321 is reachable.
 *   3. For each unit page in `src/content/asignaturas/<asignatura>/libro/*.mdx`
 *      where estado==='publicado', visit the rendered page.
 *   4. Locate every `figure.diagram[data-slide-diagram]`, take a screenshot at
 *      2x scale, save to `public/slides-assets/<asignatura>/<unit>/<id>.png`.
 *   5. Cache by hash(MDX-file) — skip units whose MDX is unchanged since last
 *      run (manifest at `tmp/slides-assets-manifest.json`).
 *
 * Usage:
 *   node scripts/capture-diagrams.mjs                  # all asignaturas
 *   node scripts/capture-diagrams.mjs edmn-2bach       # only one
 */

import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import { parse as parseYaml } from 'yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const ALL = ['edmn-2bach', 'eco-1bach', 'eco-4eso', 'fopp-4eso', 'taller-eco-3eso', 'ipe1-fp', 'ipe2-fp', 'eeae-bach', 'gpe-bach'];
const filter = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const targets = filter.length ? ALL.filter((s) => filter.includes(s)) : ALL;

const manifestPath = resolve(root, 'tmp/slides-assets-manifest.json');
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {};

function hashFile(p) {
  return createHash('sha256').update(readFileSync(p)).digest('hex').slice(0, 16);
}

function parseFm(src) {
  const norm = src.replace(/\r\n/g, '\n');
  const m = norm.match(/^---\n([\s\S]*?)\n---/);
  return m ? parseYaml(m[1]) ?? {} : {};
}

async function waitForPreview(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 404) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Astro preview never started at ${url}`);
}

console.log('→ Starting astro preview…');
const preview = spawn('npx', ['astro', 'preview', '--port', '4322'], {
  cwd: root, stdio: ['ignore', 'pipe', 'pipe'], shell: true,
});
preview.stdout.on('data', (d) => process.stdout.write(`[preview] ${d}`));
preview.stderr.on('data', (d) => process.stderr.write(`[preview] ${d}`));

try {
  await waitForPreview('http://localhost:4322/');
  console.log('→ Astro preview ready.');

  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1280, height: 720, deviceScaleFactor: 2 },
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
  });

  let totalCaptured = 0;
  let totalSkipped = 0;

  for (const slug of targets) {
    const dir = resolve(root, `src/content/asignaturas/${slug}/libro`);
    if (!existsSync(dir)) { console.warn(`  · skip ${slug} (no libro)`); continue; }
    const mdxs = readdirSync(dir).filter((f) => f.endsWith('.mdx')).sort();

    for (const file of mdxs) {
      const fmPath = resolve(dir, file);
      const src = readFileSync(fmPath, 'utf8');
      const fm = parseFm(src);
      if (fm.estado !== 'publicado') continue;
      const unitSlug = file.replace(/\.mdx$/, '');
      const hash = hashFile(fmPath);
      const cacheKey = `${slug}/${unitSlug}`;
      if (manifest[cacheKey] === hash) {
        console.log(`  · ${cacheKey} cached, skip.`);
        totalSkipped++;
        continue;
      }

      const url = `http://localhost:4322/${slug}/libro/${unitSlug.replace(/^\d+-/, '')}/`;
      const page = await browser.newPage();
      console.log(`→ ${url}`);
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
      const figures = await page.$$('figure.diagram[data-slide-diagram]');
      console.log(`  found ${figures.length} diagrams`);

      const outDir = resolve(root, `public/slides-assets/${slug}/${unitSlug}`);
      mkdirSync(outDir, { recursive: true });

      for (let i = 0; i < figures.length; i++) {
        const fig = figures[i];
        const id = await fig.evaluate((el) => el.getAttribute('data-slide-diagram') || '');
        const filename = id ? `${id}.png` : `diagram-${String(i + 1).padStart(2, '0')}.png`;
        const outPath = join(outDir, filename);
        await fig.screenshot({ path: outPath, omitBackground: false });
        console.log(`  ✓ ${filename}`);
        totalCaptured++;
      }
      manifest[cacheKey] = hash;
      await page.close();
    }
  }

  await browser.close();
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\n✓ Captured ${totalCaptured} diagram PNG(s); skipped ${totalSkipped} cached unit(s).`);
} finally {
  preview.kill('SIGTERM');
}
```

- [ ] **Step 3 · Add npm script**

Modify `package.json` `scripts` block — add:

```json
"capture:diagrams": "node scripts/capture-diagrams.mjs",
```

- [ ] **Step 4 · Smoke test**

Run from project root (Astro must be built first):

```bash
npm run build
node scripts/capture-diagrams.mjs edmn-2bach
ls public/slides-assets/edmn-2bach/06-funcion-comercial-marketing
```

Expected: at least one `*.png` file under U6 (which has MarketingMix4P).

- [ ] **Step 5 · Commit**

```bash
git add scripts/capture-diagrams.mjs package.json .gitignore public/slides-assets/.gitkeep
git commit -m "feat(slides): puppeteer-based diagram screenshot capture with hash cache"
```

---

## Task 4 · MDX AST infrastructure + tests

**Files:**
- Create: `scripts/slide-parsers/ast.mjs`
- Create: `scripts/slide-parsers/imports.mjs`
- Create: `scripts/__fixtures__/slides/sample-unit.mdx`
- Create: `scripts/slide-parsers/ast.test.mjs`

- [ ] **Step 1 · Write fixture MDX**

Create `scripts/__fixtures__/slides/sample-unit.mdx`:

```mdx
---
asignatura: edmn-2bach
unidad: 99
title: Unidad de prueba
lema: Sólo para tests.
lang: es
estado: publicado
conceptos_clave:
  - concepto a
  - concepto b
objetivos:
  - Aprender una cosa.
  - Aprender otra cosa.
---

import Figure from '@components/Figure.astro';
import TldrUnidad from '@components/TldrUnidad.astro';

import sampleImg from '@assets/libro/edmn-2bach/06/boqueria-barcelona.jpg';

<TldrUnidad>
Resumen breve de la unidad para test.
</TldrUnidad>

## Sección uno

Texto de párrafo.

<Figure src={sampleImg} alt="alt de prueba" caption="caption de prueba" credit="crédito" />

## Sección dos

- punto a
- punto b
```

- [ ] **Step 2 · Write the failing test**

Create `scripts/slide-parsers/ast.test.mjs`:

```javascript
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseMdx, findComponents, getText } from './ast.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const fixture = resolve(here, '../__fixtures__/slides/sample-unit.mdx');

describe('ast helpers', () => {
  it('parseMdx returns frontmatter + ast', () => {
    const { frontmatter, ast } = parseMdx(readFileSync(fixture, 'utf8'));
    expect(frontmatter.title).toBe('Unidad de prueba');
    expect(frontmatter.unidad).toBe(99);
    expect(ast.type).toBe('root');
  });

  it('findComponents locates JSX elements by name', () => {
    const { ast } = parseMdx(readFileSync(fixture, 'utf8'));
    const tldrs = findComponents(ast, 'TldrUnidad');
    expect(tldrs).toHaveLength(1);
    const figures = findComponents(ast, 'Figure');
    expect(figures).toHaveLength(1);
  });

  it('getText collects plain text from a subtree', () => {
    const { ast } = parseMdx(readFileSync(fixture, 'utf8'));
    const [tldr] = findComponents(ast, 'TldrUnidad');
    expect(getText(tldr)).toContain('Resumen breve');
  });
});
```

- [ ] **Step 3 · Run, expect failure**

```bash
npx vitest run scripts/slide-parsers/ast.test.mjs
```

Expected: FAIL — module `./ast.mjs` not found.

- [ ] **Step 4 · Implement `ast.mjs`**

Create `scripts/slide-parsers/ast.mjs`:

```javascript
/**
 * MDX AST helpers used by every parser. Wraps `unified` + `remark-parse`
 * + `remark-mdx` so the rest of the codebase doesn't need to know about
 * the parsing pipeline.
 */
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import { parse as parseYaml } from 'yaml';

const processor = unified().use(remarkParse).use(remarkMdx);

function splitFrontmatter(src) {
  const norm = src.replace(/\r\n/g, '\n');
  const m = norm.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { fm: {}, body: norm };
  return { fm: parseYaml(m[1]) ?? {}, body: m[2] };
}

export function parseMdx(src) {
  const { fm, body } = splitFrontmatter(src);
  const ast = processor.parse(body);
  return { frontmatter: fm, ast };
}

/**
 * Walks the tree and returns all JSX elements whose `name` matches.
 * Includes both opening and self-closing forms (mdxJsxFlowElement and
 * mdxJsxTextElement).
 */
export function findComponents(node, name, out = []) {
  if (!node || typeof node !== 'object') return out;
  if ((node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') && node.name === name) {
    out.push(node);
  }
  if (Array.isArray(node.children)) {
    for (const child of node.children) findComponents(child, name, out);
  }
  return out;
}

/**
 * Recursively collects plain-text content from a subtree, joining with
 * spaces. Skips `mdxFlowExpression` (we don't evaluate JS) and `code`
 * (handled separately by exercise/diagram parsers).
 */
export function getText(node) {
  if (!node) return '';
  if (node.type === 'text' || node.type === 'inlineCode') return node.value;
  if (node.type === 'mdxFlowExpression' || node.type === 'mdxTextExpression') return '';
  if (!Array.isArray(node.children)) return '';
  return node.children.map(getText).join(' ').replace(/\s+/g, ' ').trim();
}

/**
 * Reads a JSX attribute by name. Returns the literal string when the
 * attribute is a string; returns the source code when it's an expression.
 */
export function getAttr(jsxNode, attrName) {
  const attrs = jsxNode.attributes || [];
  for (const a of attrs) {
    if (a.name === attrName) {
      if (a.value == null) return true;
      if (typeof a.value === 'string') return a.value;
      if (a.value.type === 'mdxJsxAttributeValueExpression') return a.value.value;
    }
  }
  return undefined;
}
```

- [ ] **Step 5 · Run, expect pass**

```bash
npx vitest run scripts/slide-parsers/ast.test.mjs
```

Expected: all 3 tests pass.

- [ ] **Step 6 · Implement `imports.mjs`**

Create `scripts/slide-parsers/imports.mjs`:

```javascript
/**
 * Resolves the asset imports declared at the top of an MDX unit so a
 * <Figure src={photo} /> can be rewritten to an absolute file:// URL that
 * Marp can embed via --allow-local-files.
 */
import { resolve, dirname } from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '../..');

/** Extracts `import x from '...'` statements from the MDX body. */
export function readImports(ast) {
  const map = new Map();
  for (const node of ast.children || []) {
    if (node.type !== 'mdxjsEsm') continue;
    const code = node.value || '';
    const re = /import\s+([A-Za-z0-9_]+)\s+from\s+['"]([^'"]+)['"]/g;
    let m;
    while ((m = re.exec(code))) map.set(m[1], m[2]);
  }
  return map;
}

/**
 * Resolves an MDX import path like `@assets/libro/edmn-2bach/06/x.jpg`
 * to an absolute filesystem path. Returns null if the file doesn't
 * exist on disk.
 */
export function resolveAssetPath(spec) {
  if (!spec) return null;
  let rel = spec;
  if (spec.startsWith('@assets/')) rel = spec.replace('@assets/', 'src/assets/');
  else if (spec.startsWith('@components/')) rel = spec.replace('@components/', 'src/components/');
  const abs = resolve(root, rel);
  return existsSync(abs) ? abs : null;
}

/** Builds a file:// URL Marp can load via --allow-local-files. */
export function fileUrl(absPath) {
  if (!absPath) return null;
  return 'file:///' + absPath.replace(/\\/g, '/');
}
```

- [ ] **Step 7 · Commit**

```bash
git add scripts/slide-parsers/ast.mjs scripts/slide-parsers/ast.test.mjs scripts/slide-parsers/imports.mjs scripts/__fixtures__/slides/sample-unit.mdx
git commit -m "feat(slides): MDX AST helpers + asset import resolver with tests"
```

---

## Task 5 · Simple component parsers — TldrUnidad, CasoDilema, VuelveAlCaso

**Files:**
- Create: `scripts/slide-parsers/tldr.mjs`
- Create: `scripts/slide-parsers/caso.mjs`
- Create: `scripts/slide-parsers/tldr.test.mjs`

- [ ] **Step 1 · Test for `tldr.mjs`**

Create `scripts/slide-parsers/tldr.test.mjs`:

```javascript
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseMdx, findComponents } from './ast.mjs';
import { renderTldr } from './tldr.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const fixture = resolve(here, '../__fixtures__/slides/sample-unit.mdx');

describe('tldr parser', () => {
  it('renders a tldr slide with the inner text', () => {
    const { ast } = parseMdx(readFileSync(fixture, 'utf8'));
    const [node] = findComponents(ast, 'TldrUnidad');
    const md = renderTldr(node);
    expect(md).toMatch(/<!-- _class: tldr -->/);
    expect(md).toMatch(/Resumen breve de la unidad/);
    expect(md).toMatch(/class="pullquote"/);
  });
});
```

- [ ] **Step 2 · Run, expect failure**

```bash
npx vitest run scripts/slide-parsers/tldr.test.mjs
```

- [ ] **Step 3 · Implement `tldr.mjs`**

Create `scripts/slide-parsers/tldr.mjs`:

```javascript
import { getText } from './ast.mjs';

export function renderTldr(node) {
  const body = getText(node);
  return [
    '<!-- _class: tldr -->',
    '',
    `<p class="pullquote">${escape(body)}</p>`,
  ].join('\n');
}

function escape(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
```

- [ ] **Step 4 · Run, expect pass**

```bash
npx vitest run scripts/slide-parsers/tldr.test.mjs
```

- [ ] **Step 5 · Implement `caso.mjs` (no test — visual layout, validated in pilot)**

Create `scripts/slide-parsers/caso.mjs`:

```javascript
/**
 * Renders <CasoDilema> and <VuelveAlCaso> as side-by-side image+text slides.
 * The image comes from the unit's hero photo: by convention, the first
 * <Figure> import in the MDX. If no image is available, falls back to
 * a single-column text layout (still uses the caso class for typography).
 */
import { getText, getAttr } from './ast.mjs';
import { fileUrl } from './imports.mjs';

export function renderCaso(node, { heroImageAbs }) {
  return render(node, { heroImageAbs, klass: 'caso', kicker: 'CASO REAL' });
}

export function renderVuelveAlCaso(node, { heroImageAbs }) {
  return render(node, { heroImageAbs, klass: 'caso caso-resuelto', kicker: 'VUELVE AL CASO' });
}

function render(node, { heroImageAbs, klass, kicker }) {
  const titular = getAttr(node, 'titular') || '';
  const pregunta = getAttr(node, 'pregunta') || '';
  const fuente = getAttr(node, 'fuente') || '';
  const body = getText(node);
  const bg = heroImageAbs ? `style="background-image:url('${fileUrl(heroImageAbs)}')"` : '';

  return [
    `<!-- _class: ${klass} -->`,
    '',
    `<div class="caso__media" ${bg}></div>`,
    `<div class="caso__body">`,
    `  <p class="caso__kicker">${kicker}</p>`,
    titular ? `  <h2>${esc(titular)}</h2>` : '',
    body ? `  <p class="caso__body-text">${esc(body)}</p>` : '',
    pregunta ? `  <p class="caso__pregunta">${esc(pregunta)}</p>` : '',
    fuente ? `  <p class="caso__fuente">${esc(fuente)}</p>` : '',
    `</div>`,
  ].filter(Boolean).join('\n');
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
```

- [ ] **Step 6 · Commit**

```bash
git add scripts/slide-parsers/tldr.mjs scripts/slide-parsers/tldr.test.mjs scripts/slide-parsers/caso.mjs
git commit -m "feat(slides): parsers for TldrUnidad, CasoDilema, VuelveAlCaso"
```

---

## Task 6 · Parsers — Figure, RealExample, Curiosity, Callout, Steps

**Files:**
- Create: `scripts/slide-parsers/figure.mjs`
- Create: `scripts/slide-parsers/real-example.mjs`
- Create: `scripts/slide-parsers/curiosity.mjs`
- Create: `scripts/slide-parsers/callout.mjs`
- Create: `scripts/slide-parsers/steps.mjs`
- Create: `scripts/slide-parsers/figure.test.mjs`

- [ ] **Step 1 · Test for figure.mjs**

```javascript
// scripts/slide-parsers/figure.test.mjs
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseMdx, findComponents } from './ast.mjs';
import { readImports } from './imports.mjs';
import { renderFigure } from './figure.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const fixture = resolve(here, '../__fixtures__/slides/sample-unit.mdx');

describe('figure parser', () => {
  it('emits an img with a file:// url resolved from the imports map', () => {
    const { ast } = parseMdx(readFileSync(fixture, 'utf8'));
    const imports = readImports(ast);
    const [fig] = findComponents(ast, 'Figure');
    const md = renderFigure(fig, imports);
    expect(md).toMatch(/<!-- _class: figure -->/);
    expect(md).toMatch(/file:\/\/\//);
    expect(md).toMatch(/boqueria-barcelona\.jpg/);
    expect(md).toMatch(/caption de prueba/);
  });
});
```

- [ ] **Step 2 · Run, expect failure, then implement**

Create `scripts/slide-parsers/figure.mjs`:

```javascript
import { getAttr } from './ast.mjs';
import { resolveAssetPath, fileUrl } from './imports.mjs';

export function renderFigure(node, importsMap) {
  const srcAttr = getAttr(node, 'src') || '';
  const alt = getAttr(node, 'alt') || '';
  const caption = getAttr(node, 'caption') || '';
  const credit = getAttr(node, 'credit') || '';

  // src may be either a literal path string or a JSX expression naming an import.
  const importPath = importsMap.get(srcAttr.trim());
  const abs = resolveAssetPath(importPath);
  const url = fileUrl(abs);
  if (!url) return null; // skip — better to omit than to render broken

  return [
    '<!-- _class: figure -->',
    '',
    `![${escAttr(alt)}](${url})`,
    '',
    caption ? `<p class="figure__caption">${esc(caption)}</p>` : '',
    credit ? `<p class="figure__credit">${esc(credit)}</p>` : '',
  ].filter(Boolean).join('\n');
}

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function escAttr(s) { return esc(s).replace(/"/g, '&quot;'); }
```

- [ ] **Step 3 · Run, expect pass**

```bash
npx vitest run scripts/slide-parsers/figure.test.mjs
```

- [ ] **Step 4 · Implement real-example.mjs**

```javascript
// scripts/slide-parsers/real-example.mjs
import { getText, getAttr } from './ast.mjs';

export function renderRealExample(node) {
  const empresa = getAttr(node, 'empresa') || getAttr(node, 'nombre') || '';
  const body = getText(node);
  return [
    '<!-- _class: example -->',
    '',
    `<p class="example__kicker">Caso real${empresa ? ' · ' + esc(empresa) : ''}</p>`,
    '',
    '## ' + (empresa ? esc(empresa) : 'Ejemplo real'),
    '',
    `<div class="example__body">${esc(body)}</div>`,
  ].join('\n');
}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
```

- [ ] **Step 5 · Implement curiosity.mjs**

```javascript
// scripts/slide-parsers/curiosity.mjs
import { getText, getAttr } from './ast.mjs';

export function renderCuriosity(node) {
  const titulo = getAttr(node, 'titulo') || getAttr(node, 'title') || '¿Sabías que…?';
  const body = getText(node);
  return [
    '<!-- _class: curiosity -->',
    '',
    `## ${esc(titulo)}`,
    '',
    `<p>${esc(body)}</p>`,
  ].join('\n');
}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
```

- [ ] **Step 6 · Implement callout.mjs**

```javascript
// scripts/slide-parsers/callout.mjs
import { getText, getAttr } from './ast.mjs';

/**
 * <Callout> is rendered as a small attention slide. We re-use the
 * curiosity layout but keep the mustard accent muted.
 */
export function renderCallout(node) {
  const tipo = getAttr(node, 'tipo') || getAttr(node, 'type') || 'nota';
  const body = getText(node);
  if (!body) return null;
  return [
    '<!-- _class: curiosity -->',
    '',
    `## ${esc(tipo.toString().toUpperCase())}`,
    '',
    `<p>${esc(body)}</p>`,
  ].join('\n');
}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
```

- [ ] **Step 7 · Implement steps.mjs**

```javascript
// scripts/slide-parsers/steps.mjs
import { getText } from './ast.mjs';

/**
 * <Steps> renders as a single exercise-class slide listing each child <li>
 * as a numbered step. Useful for procedural blocks like "cómo formular un
 * objetivo SMART" or "cómo segmentar un mercado".
 */
export function renderSteps(node, titleFallback = 'Pasos') {
  const items = (node.children || []).flatMap((child) => {
    if (child.type === 'list') return (child.children || []).map(getText);
    return [];
  }).filter(Boolean);

  if (!items.length) return null;

  return [
    '<!-- _class: exercise -->',
    '',
    `<p class="exercise__kicker">PROCEDIMIENTO</p>`,
    `## ${esc(titleFallback)}`,
    '',
    '<ol class="exercise__steps">',
    ...items.map((i) => `  <li>${esc(i)}</li>`),
    '</ol>',
  ].join('\n');
}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
```

- [ ] **Step 8 · Commit**

```bash
git add scripts/slide-parsers/figure.mjs scripts/slide-parsers/figure.test.mjs \
        scripts/slide-parsers/real-example.mjs scripts/slide-parsers/curiosity.mjs \
        scripts/slide-parsers/callout.mjs scripts/slide-parsers/steps.mjs
git commit -m "feat(slides): parsers for Figure, RealExample, Curiosity, Callout, Steps"
```

---

## Task 7 · `SolvedExercise` parser → 2 slides (enunciat / solució)

**Files:**
- Create: `scripts/slide-parsers/solved-exercise.mjs`
- Create: `scripts/slide-parsers/solved-exercise.test.mjs`

- [ ] **Step 1 · Inspect the component**

Read `src/components/SolvedExercise.astro` to learn its prop names and the
expected children structure. Likely props: `titulo`, `enunciado`, `datos`,
plus children for the solution. Use the actual props you see.

- [ ] **Step 2 · Add fixture**

Append to `scripts/__fixtures__/slides/sample-unit.mdx`:

```mdx
import SolvedExercise from '@components/SolvedExercise.astro';

<SolvedExercise titulo="Ejercicio resuelto: punto muerto">
**Enunciado.** Una empresa tiene CF = 12.000 €, p = 30 €, cv = 18 €. Calcula Q*.

**Solución.**
1. Margen de contribución unitario: 30 − 18 = 12 €.
2. Punto muerto: Q* = 12.000 / 12 = 1.000 unidades.

Resultado: **1.000 unidades**.
</SolvedExercise>
```

- [ ] **Step 3 · Write the failing test**

```javascript
// scripts/slide-parsers/solved-exercise.test.mjs
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseMdx, findComponents } from './ast.mjs';
import { renderSolvedExercise } from './solved-exercise.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const fixture = resolve(here, '../__fixtures__/slides/sample-unit.mdx');

describe('solved exercise parser', () => {
  it('returns two slides (enunciado then solución)', () => {
    const { ast } = parseMdx(readFileSync(fixture, 'utf8'));
    const [node] = findComponents(ast, 'SolvedExercise');
    const slides = renderSolvedExercise(node);
    expect(slides).toHaveLength(2);
    expect(slides[0]).toMatch(/ENUNCIADO/);
    expect(slides[1]).toMatch(/SOLUCIÓN/);
    expect(slides[1]).toMatch(/1\.000 unidades/);
  });
});
```

- [ ] **Step 4 · Run, expect failure**

- [ ] **Step 5 · Implement `solved-exercise.mjs`**

```javascript
import { getText, getAttr } from './ast.mjs';

/**
 * Returns [enunciadoSlide, solucionSlide]. The split is heuristic: we
 * look for the first child paragraph that starts with **Solución** or
 * a separator (`<hr/>`); everything before goes to the enunciado, the
 * rest to the solución. If we can't split, both slides repeat the
 * full body — better than silently dropping content.
 */
export function renderSolvedExercise(node) {
  const titulo = getAttr(node, 'titulo') || getAttr(node, 'title') || 'Ejercicio resuelto';
  const children = node.children || [];

  let splitIdx = -1;
  for (let i = 0; i < children.length; i++) {
    const text = getText(children[i]);
    if (/^\s*\*?\*?Soluci[oó]n/i.test(text) || children[i].type === 'thematicBreak') {
      splitIdx = i;
      break;
    }
  }

  const enunciadoNodes = splitIdx >= 0 ? children.slice(0, splitIdx) : children;
  const solucionNodes = splitIdx >= 0 ? children.slice(splitIdx) : children;
  const enunciadoText = enunciadoNodes.map(getText).join(' ').trim();
  const solucionText = solucionNodes.map(getText).join(' ').trim();

  const enunciado = [
    '<!-- _class: exercise -->',
    '',
    `<p class="exercise__kicker">ENUNCIADO</p>`,
    `## ${esc(titulo)}`,
    '',
    `<p>${esc(enunciadoText)}</p>`,
  ].join('\n');

  const solucion = [
    '<!-- _class: exercise -->',
    '',
    `<p class="exercise__kicker">SOLUCIÓN</p>`,
    `## ${esc(titulo)}`,
    '',
    `<p>${esc(solucionText)}</p>`,
  ].join('\n');

  return [enunciado, solucion];
}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
```

- [ ] **Step 6 · Run, expect pass**

- [ ] **Step 7 · Commit**

```bash
git add scripts/slide-parsers/solved-exercise.mjs scripts/slide-parsers/solved-exercise.test.mjs scripts/__fixtures__/slides/sample-unit.mdx
git commit -m "feat(slides): SolvedExercise parser splits into enunciado + solución slides"
```

---

## Task 8 · `Diagram` parser — PNG lookup from slides-assets

**Files:**
- Create: `scripts/slide-parsers/diagram.mjs`
- Create: `scripts/slide-parsers/diagram.test.mjs`

- [ ] **Step 1 · Test for diagram.mjs**

```javascript
// scripts/slide-parsers/diagram.test.mjs
import { describe, it, expect } from 'vitest';
import { renderDiagram } from './diagram.mjs';

describe('diagram parser', () => {
  it('uses explicit id when present and existing PNG', () => {
    // resolveExists is injected so we can stub the filesystem in tests
    const fakeExists = () => true;
    const node = { attributes: [{ name: 'id', value: 'marketing-mix-4p' }, { name: 'caption', value: 'Las 4P' }] };
    const md = renderDiagram(node, { asignatura: 'edmn-2bach', unitSlug: '06-funcion-comercial-marketing', positionalIndex: 0, existsFn: fakeExists });
    expect(md).toMatch(/marketing-mix-4p\.png/);
    expect(md).toMatch(/Las 4P/);
  });

  it('falls back to positional name when no id', () => {
    const node = { attributes: [{ name: 'caption', value: 'sin id' }] };
    const md = renderDiagram(node, { asignatura: 'edmn-2bach', unitSlug: '06-funcion-comercial-marketing', positionalIndex: 2, existsFn: () => true });
    expect(md).toMatch(/diagram-03\.png/);
  });

  it('returns null if the asset is missing', () => {
    const node = { attributes: [{ name: 'caption', value: 'X' }] };
    const md = renderDiagram(node, { asignatura: 'x', unitSlug: 'y', positionalIndex: 0, existsFn: () => false });
    expect(md).toBeNull();
  });
});
```

- [ ] **Step 2 · Implement diagram.mjs**

```javascript
import { existsSync as defaultExists } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getAttr } from './ast.mjs';
import { fileUrl } from './imports.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '../..');

export function renderDiagram(node, { asignatura, unitSlug, positionalIndex, existsFn = defaultExists }) {
  const id = getAttr(node, 'id') || '';
  const caption = getAttr(node, 'caption') || '';
  const source = getAttr(node, 'source') || '';
  const filename = id ? `${id}.png` : `diagram-${String(positionalIndex + 1).padStart(2, '0')}.png`;
  const abs = resolve(root, 'public/slides-assets', asignatura, unitSlug, filename);
  if (!existsFn(abs)) return null;

  return [
    '<!-- _class: diagram -->',
    '',
    caption ? `## ${esc(caption)}` : '',
    '',
    `![${esc(caption)}](${fileUrl(abs)})`,
    '',
    source ? `<p class="diagram__caption">Fuente: ${esc(source)}</p>` : '',
  ].filter(Boolean).join('\n');
}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
```

- [ ] **Step 3 · Run, expect pass**

```bash
npx vitest run scripts/slide-parsers/diagram.test.mjs
```

- [ ] **Step 4 · Commit**

```bash
git add scripts/slide-parsers/diagram.mjs scripts/slide-parsers/diagram.test.mjs
git commit -m "feat(slides): Diagram parser resolves cached PNG from slides-assets"
```

---

## Task 9 · Parsers — VocesDesacuerdo, PistaEbau, RetoEtapa

**Files:**
- Create: `scripts/slide-parsers/voces.mjs`
- Create: `scripts/slide-parsers/pista-ebau.mjs`
- Create: `scripts/slide-parsers/reto-etapa.mjs`

- [ ] **Step 1 · Read each Astro component briefly**

Open `src/components/VocesDesacuerdo.astro`, `PistaEbau.astro`, `RetoEtapa.astro` to confirm the actual prop names. Use the names you see.

- [ ] **Step 2 · Implement voces.mjs**

```javascript
import { getText, getAttr } from './ast.mjs';

/**
 * <VocesDesacuerdo ladoA="Friedman" ladoB="Mazzucato" posturaA="..." posturaB="...">
 *   children: contextual blurb
 * </VocesDesacuerdo>
 */
export function renderVoces(node) {
  const ladoA = getAttr(node, 'ladoA') || getAttr(node, 'a') || 'A';
  const ladoB = getAttr(node, 'ladoB') || getAttr(node, 'b') || 'B';
  const posturaA = getAttr(node, 'posturaA') || getAttr(node, 'aPostura') || '';
  const posturaB = getAttr(node, 'posturaB') || getAttr(node, 'bPostura') || '';
  const debate = getAttr(node, 'debate') || getAttr(node, 'titulo') || 'Voces en desacuerdo';

  return [
    '<!-- _class: voces -->',
    '',
    '<div class="voces__col voces__col--a">',
    `  <p class="voces__label">${esc(debate)} · A</p>`,
    `  <p class="voces__name">${esc(ladoA)}</p>`,
    `  <p class="voces__pos">${esc(posturaA || getText(node))}</p>`,
    '</div>',
    '<div class="voces__col voces__col--b">',
    `  <p class="voces__label">${esc(debate)} · B</p>`,
    `  <p class="voces__name">${esc(ladoB)}</p>`,
    `  <p class="voces__pos">${esc(posturaB)}</p>`,
    '</div>',
  ].join('\n');
}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
```

- [ ] **Step 3 · Implement pista-ebau.mjs**

```javascript
import { getText, getAttr } from './ast.mjs';

export function renderPistaEbau(node) {
  const tipo = getAttr(node, 'tipo') || 'teórica';
  const titulo = getAttr(node, 'titulo') || 'Cómo cae esto en la EBAU';
  const body = getText(node);
  return [
    '<!-- _class: ebau -->',
    '',
    `<span class="ebau__flag">EBAU · ${esc(tipo.toString())}</span>`,
    '',
    `## ${esc(titulo)}`,
    '',
    `<div class="ebau__body">${esc(body)}</div>`,
  ].join('\n');
}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
```

- [ ] **Step 4 · Implement reto-etapa.mjs**

```javascript
import { getText, getAttr } from './ast.mjs';

export function renderRetoEtapa(node) {
  const etapa = getAttr(node, 'etapa') || getAttr(node, 'numero') || '';
  const total = getAttr(node, 'total') || '12';
  const titulo = getAttr(node, 'titulo') || 'Reto del curso';
  const body = getText(node);
  const num = etapa ? `${String(etapa).padStart(2, '0')}/${String(total).padStart(2, '0')}` : '?/12';
  return [
    '<!-- _class: reto -->',
    '',
    `<div class="reto__num">${num}</div>`,
    `<div>`,
    `  <h2>Reto del curso · ${esc(titulo)}</h2>`,
    `  <div class="reto__tasks">${esc(body)}</div>`,
    `</div>`,
  ].join('\n');
}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
```

- [ ] **Step 5 · Commit**

```bash
git add scripts/slide-parsers/voces.mjs scripts/slide-parsers/pista-ebau.mjs scripts/slide-parsers/reto-etapa.mjs
git commit -m "feat(slides): parsers for VocesDesacuerdo, PistaEbau, RetoEtapa"
```

---

## Task 10 · MirarFora parser + KeyTakeaways

**Files:**
- Create: `scripts/slide-parsers/mirar-fora.mjs`
- Create: `scripts/slide-parsers/key-takeaways.mjs`

- [ ] **Step 1 · Read `<MirarFora>` component**

Open `src/components/MirarFora.astro` to confirm props. Expected props: `libro`, `video`, `cuenta`, `actividad`, each a string or short object.

- [ ] **Step 2 · Implement mirar-fora.mjs**

```javascript
import { getAttr, getText } from './ast.mjs';

/**
 * <MirarFora> may use either string props per quadrant or named children
 * for each. We support both — if the component passes structured props,
 * use them; otherwise fall back to dumping body text in the first cell.
 */
export function renderMirarFora(node) {
  const libroTitulo = getAttr(node, 'libroTitulo') || getAttr(node, 'libro') || '';
  const libroAutor = getAttr(node, 'libroAutor') || '';
  const libroDesc = getAttr(node, 'libroDesc') || '';
  const videoTitulo = getAttr(node, 'videoTitulo') || getAttr(node, 'video') || '';
  const videoAutor = getAttr(node, 'videoAutor') || '';
  const videoDesc = getAttr(node, 'videoDesc') || '';
  const cuentaTitulo = getAttr(node, 'cuentaTitulo') || getAttr(node, 'cuenta') || '';
  const cuentaAutor = getAttr(node, 'cuentaAutor') || '';
  const cuentaDesc = getAttr(node, 'cuentaDesc') || '';
  const actividadTitulo = getAttr(node, 'actividadTitulo') || getAttr(node, 'actividad') || '';
  const actividadDesc = getAttr(node, 'actividadDesc') || '';

  const cell = (icon, type, title, author, desc) => [
    '<div class="mf__cell">',
    `  <div class="mf__icon">${icon}</div>`,
    `  <div class="mf__type">${esc(type)}</div>`,
    `  <div class="mf__title">${esc(title || '—')}</div>`,
    author ? `  <div class="mf__author">${esc(author)}</div>` : '',
    desc ? `  <div class="mf__desc">${esc(desc)}</div>` : '',
    '</div>',
  ].filter(Boolean).join('\n');

  return [
    '<!-- _class: mirar-fora -->',
    '',
    '## Mirar fora',
    '',
    cell('§', 'Leer', libroTitulo, libroAutor, libroDesc),
    cell('▶', 'Ver', videoTitulo, videoAutor, videoDesc),
    cell('@', 'Seguir', cuentaTitulo, cuentaAutor, cuentaDesc),
    cell('✎', 'Hacer', actividadTitulo, '', actividadDesc),
  ].join('\n');
}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
```

- [ ] **Step 3 · Implement key-takeaways.mjs (refactor)**

```javascript
// Refactored from the regex-based extractor in extract-slides.mjs.
import { getText } from './ast.mjs';

export function renderKeyTakeaways(node) {
  // <KeyTakeaways> children should be a list of bullet items.
  const bullets = [];
  for (const child of node.children || []) {
    if (child.type === 'list') {
      for (const li of child.children || []) bullets.push(getText(li));
    }
  }
  if (!bullets.length) return null;
  return [
    '## Lo esencial',
    '',
    ...bullets.map((b) => `- ${b}`),
  ].join('\n');
}
```

- [ ] **Step 4 · Commit**

```bash
git add scripts/slide-parsers/mirar-fora.mjs scripts/slide-parsers/key-takeaways.mjs
git commit -m "feat(slides): MirarFora + KeyTakeaways parsers"
```

---

## Task 11 · H2 sections + deck assembler

**Files:**
- Create: `scripts/slide-parsers/h2-section.mjs`
- Create: `scripts/slide-parsers/frontmatter.mjs`
- Create: `scripts/slide-builders/title-slide.mjs`
- Create: `scripts/slide-builders/section-cover.mjs`
- Create: `scripts/slide-builders/deck-assembler.mjs`
- Create: `scripts/slide-parsers/index.mjs`

- [ ] **Step 1 · Implement frontmatter.mjs**

```javascript
// scripts/slide-parsers/frontmatter.mjs
export function renderObjetivos(fm) {
  if (!Array.isArray(fm.objetivos) || !fm.objetivos.length) return null;
  return ['## Objetivos de la unidad', '', ...fm.objetivos.map((o) => `- ${o}`)].join('\n');
}

export function renderConceptos(fm) {
  if (!Array.isArray(fm.conceptos_clave) || !fm.conceptos_clave.length) return null;
  return ['## Conceptos clave', '', ...fm.conceptos_clave.map((c) => `- **${c}**`)].join('\n');
}
```

- [ ] **Step 2 · Implement title-slide.mjs**

```javascript
// scripts/slide-builders/title-slide.mjs
export function renderTitle(fm) {
  return [
    '<!-- _class: title -->',
    '<!-- _paginate: false -->',
    '',
    `<div class="kicker">Unidad ${fm.unidad}${fm.bloque ? ' · ' + fm.bloque : ''}</div>`,
    '',
    `# ${fm.title}`,
    '',
    fm.lema ? `<p>${String(fm.lema).replace(/\n/g, ' ').trim()}</p>` : '',
  ].filter(Boolean).join('\n');
}
```

- [ ] **Step 3 · Implement section-cover.mjs**

```javascript
// scripts/slide-builders/section-cover.mjs
export function renderSectionCover(heading) {
  return [
    '<!-- _class: section -->',
    '<!-- _paginate: false -->',
    '',
    `# *${heading}*`,
  ].join('\n');
}
```

- [ ] **Step 4 · Implement h2-section.mjs (text between components)**

```javascript
// scripts/slide-parsers/h2-section.mjs
import { getText } from './ast.mjs';

/**
 * Given the consecutive prose / list / table nodes that sit between two
 * MDX components inside a section, render one concept slide. Skips empty
 * blocks. Returns null if no useful content.
 */
export function renderConceptSlide(heading, nodes) {
  const pieces = [];
  for (const n of nodes) {
    if (n.type === 'heading' && n.depth === 3) {
      pieces.push(`### ${getText(n)}`);
    } else if (n.type === 'paragraph') {
      const t = getText(n);
      if (t) pieces.push(t);
    } else if (n.type === 'list') {
      const items = (n.children || []).map(getText).filter(Boolean);
      pieces.push(...items.map((i) => `- ${i}`));
    } else if (n.type === 'table') {
      // remark gives us a table AST; we re-render as markdown table
      pieces.push(renderTable(n));
    } else if (n.type === 'blockquote') {
      const t = getText(n);
      if (t) pieces.push(`> ${t}`);
    }
  }
  if (!pieces.length) return null;
  return [`## ${heading}`, '', ...pieces].join('\n');
}

function renderTable(node) {
  const rows = (node.children || []).map((row) =>
    (row.children || []).map((cell) => getText(cell)),
  );
  if (!rows.length) return '';
  const header = `| ${rows[0].join(' | ')} |`;
  const sep = `| ${rows[0].map(() => '---').join(' | ')} |`;
  const body = rows.slice(1).map((r) => `| ${r.join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}
```

- [ ] **Step 5 · Implement deck-assembler.mjs**

```javascript
// scripts/slide-builders/deck-assembler.mjs
import { renderTitle } from './title-slide.mjs';
import { renderSectionCover } from './section-cover.mjs';
import { renderObjetivos, renderConceptos } from '../slide-parsers/frontmatter.mjs';
import { renderTldr } from '../slide-parsers/tldr.mjs';
import { renderCaso, renderVuelveAlCaso } from '../slide-parsers/caso.mjs';
import { renderFigure } from '../slide-parsers/figure.mjs';
import { renderRealExample } from '../slide-parsers/real-example.mjs';
import { renderCuriosity } from '../slide-parsers/curiosity.mjs';
import { renderCallout } from '../slide-parsers/callout.mjs';
import { renderSteps } from '../slide-parsers/steps.mjs';
import { renderSolvedExercise } from '../slide-parsers/solved-exercise.mjs';
import { renderDiagram } from '../slide-parsers/diagram.mjs';
import { renderVoces } from '../slide-parsers/voces.mjs';
import { renderPistaEbau } from '../slide-parsers/pista-ebau.mjs';
import { renderRetoEtapa } from '../slide-parsers/reto-etapa.mjs';
import { renderMirarFora } from '../slide-parsers/mirar-fora.mjs';
import { renderKeyTakeaways } from '../slide-parsers/key-takeaways.mjs';
import { renderConceptSlide } from '../slide-parsers/h2-section.mjs';
import { readImports } from '../slide-parsers/imports.mjs';
import { resolveAssetPath } from '../slide-parsers/imports.mjs';

const COMPONENT_RENDERERS = {
  TldrUnidad: (node, ctx) => [renderTldr(node)],
  CasoDilema: (node, ctx) => [renderCaso(node, { heroImageAbs: ctx.heroImageAbs })],
  VuelveAlCaso: (node, ctx) => [renderVuelveAlCaso(node, { heroImageAbs: ctx.heroImageAbs })],
  Figure: (node, ctx) => [renderFigure(node, ctx.importsMap)],
  RealExample: (node) => [renderRealExample(node)],
  Curiosity: (node) => [renderCuriosity(node)],
  Callout: (node) => [renderCallout(node)],
  Steps: (node) => [renderSteps(node)],
  SolvedExercise: (node) => renderSolvedExercise(node),
  Diagram: (node, ctx) => [renderDiagram(node, {
    asignatura: ctx.asignatura,
    unitSlug: ctx.unitSlug,
    positionalIndex: ctx.diagramIndex++,
  })],
  VocesDesacuerdo: (node) => [renderVoces(node)],
  PistaEbau: (node) => [renderPistaEbau(node)],
  RetoEtapa: (node) => [renderRetoEtapa(node)],
  MirarFora: (node) => [renderMirarFora(node)],
  KeyTakeaways: (node) => [renderKeyTakeaways(node)],
};

/**
 * Splits the AST root children into per-H2 groups; within each group,
 * walks linearly and emits:
 *   - a slide for every JSX component we know how to render
 *   - one or more concept slides for the prose/list/table blocks between
 *     components, grouped under their H2 heading
 */
function groupByH2(rootChildren) {
  const groups = [];
  let current = { heading: null, items: [] };
  for (const node of rootChildren) {
    if (node.type === 'heading' && node.depth === 2) {
      if (current.heading || current.items.length) groups.push(current);
      current = { heading: getTextSafe(node), items: [] };
    } else {
      current.items.push(node);
    }
  }
  if (current.heading || current.items.length) groups.push(current);
  return groups;
}
function getTextSafe(node) {
  return (node.children || []).map((c) => c.value || '').join('').trim();
}

/**
 * Decides if a node is a JSX component we render via COMPONENT_RENDERERS.
 */
function isComponent(node) {
  return (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement')
    && node.name && COMPONENT_RENDERERS[node.name];
}

/**
 * Builds the full deck markdown.
 *
 * Order:
 *   1. Title
 *   2. Top-of-MDX components (TldrUnidad, CasoDilema) — rendered in the
 *      preamble (before any H2). We treat the "preamble group" as the
 *      one with heading=null and emit its components but no section cover.
 *   3. Objetivos
 *   4. Conceptos
 *   5. Per H2 group: cover + per-item slides (components + concept blocks)
 *   6. KeyTakeaways (intercepted from any group)
 *   7. Close slide
 */
export function assembleDeck({ frontmatter, ast, asignatura, unitSlug, importsMap }) {
  const ctx = {
    asignatura,
    unitSlug,
    importsMap,
    diagramIndex: 0,
    heroImageAbs: null,
  };

  // resolve the first <Figure> import as the hero image for caso/vuelve
  const figures = (ast.children || []).filter((n) => n.type === 'mdxJsxFlowElement' && n.name === 'Figure');
  if (figures.length) {
    const srcAttr = (figures[0].attributes || []).find((a) => a.name === 'src');
    const ident = (srcAttr && srcAttr.value && srcAttr.value.value) || (srcAttr && typeof srcAttr.value === 'string' && srcAttr.value);
    const importPath = importsMap.get(String(ident || '').trim());
    ctx.heroImageAbs = resolveAssetPath(importPath);
  }

  const groups = groupByH2(ast.children || []);
  const slides = [];

  // 1. Title
  slides.push(renderTitle(frontmatter));

  // 2. Preamble components (TldrUnidad, CasoDilema)
  const preamble = groups.find((g) => g.heading === null);
  if (preamble) {
    for (const item of preamble.items) {
      if (isComponent(item)) slides.push(...COMPONENT_RENDERERS[item.name](item, ctx).filter(Boolean));
    }
  }

  // 3. Objetivos, 4. Conceptos
  const o = renderObjetivos(frontmatter); if (o) slides.push(o);
  const c = renderConceptos(frontmatter); if (c) slides.push(c);

  // 5. Per-H2 groups (skipping preamble already handled)
  const keyTakeawaysSlides = [];
  const vuelveSlides = [];
  const mirarForaSlides = [];
  const retoSlides = [];

  for (const group of groups) {
    if (group.heading === null) continue;
    slides.push(renderSectionCover(group.heading));

    let proseBuffer = [];
    const flushProse = () => {
      if (!proseBuffer.length) return;
      const md = renderConceptSlide(group.heading, proseBuffer);
      if (md) slides.push(md);
      proseBuffer = [];
    };

    for (const item of group.items) {
      if (isComponent(item)) {
        flushProse();
        const rendered = COMPONENT_RENDERERS[item.name](item, ctx).filter(Boolean);
        // Intercept "tail" components so they go at the end of the deck:
        if (item.name === 'KeyTakeaways') keyTakeawaysSlides.push(...rendered);
        else if (item.name === 'VuelveAlCaso') vuelveSlides.push(...rendered);
        else if (item.name === 'MirarFora') mirarForaSlides.push(...rendered);
        else if (item.name === 'RetoEtapa') retoSlides.push(...rendered);
        else slides.push(...rendered);
      } else {
        proseBuffer.push(item);
      }
    }
    flushProse();
  }

  // 6. Tail slides in the spec'd order
  slides.push(...vuelveSlides);
  slides.push(...retoSlides);
  slides.push(...keyTakeawaysSlides);
  slides.push(...mirarForaSlides);

  // 7. Close slide
  slides.push([
    '<!-- _class: close -->',
    '<!-- _paginate: false -->',
    '',
    '# *Hasta aquí la teoría.*',
    '',
    '_Continúa en el libro_  ·  profedeeconomia.es',
  ].join('\n'));

  return slides.filter(Boolean);
}
```

- [ ] **Step 6 · Implement `slide-parsers/index.mjs` (public façade)**

```javascript
// scripts/slide-parsers/index.mjs
import { parseMdx } from './ast.mjs';
import { readImports } from './imports.mjs';
import { assembleDeck } from '../slide-builders/deck-assembler.mjs';

export function buildDeckMarkdown(src, { asignatura, unitSlug }) {
  const { frontmatter, ast } = parseMdx(src);
  const importsMap = readImports(ast);
  const slides = assembleDeck({ frontmatter, ast, asignatura, unitSlug, importsMap });

  const head = [
    '---',
    'marp: true',
    'theme: profedeeconomia',
    'size: 16:9',
    'paginate: true',
    `title: "Unidad ${frontmatter.unidad} · ${frontmatter.title}"`,
    '---',
    '',
  ].join('\n');

  return head + slides.join('\n\n---\n\n') + '\n';
}
```

- [ ] **Step 7 · Commit**

```bash
git add scripts/slide-parsers/h2-section.mjs scripts/slide-parsers/frontmatter.mjs scripts/slide-parsers/index.mjs scripts/slide-builders/
git commit -m "feat(slides): H2 section parser, frontmatter renderers, deck assembler"
```

---

## Task 12 · Rewrite `extract-slides.mjs` orchestrator + update `build-slides.mjs`

**Files:**
- Modify: `scripts/extract-slides.mjs` (replace contents)
- Modify: `scripts/build-slides.mjs` (add `--html-only` flag, call capture before extract)

- [ ] **Step 1 · Replace `extract-slides.mjs`**

Replace the entire contents with:

```javascript
#!/usr/bin/env node
/**
 * Auto-extract per-unit slide decks from each MDX unit. Re-written to use
 * an MDX AST (unified + remark-mdx) so every rich component renders its
 * own slide. Diagrams are looked up from `public/slides-assets/`, pre-
 * captured by scripts/capture-diagrams.mjs.
 *
 * Output: tmp/slides/<asignatura>/<unit-slug>.md
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve, dirname, basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDeckMarkdown } from './slide-parsers/index.mjs';
import { parse as parseYaml } from 'yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const ALL = ['edmn-2bach', 'eco-1bach', 'eco-4eso', 'fopp-4eso', 'taller-eco-3eso', 'ipe1-fp', 'ipe2-fp', 'eeae-bach', 'gpe-bach'];
const filter = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const targets = filter.length ? ALL.filter((s) => filter.includes(s)) : ALL;

function readFm(src) {
  const norm = src.replace(/\r\n/g, '\n');
  const m = norm.match(/^---\n([\s\S]*?)\n---/);
  return m ? parseYaml(m[1]) ?? {} : {};
}

let total = 0;
for (const slug of targets) {
  const dir = resolve(root, `src/content/asignaturas/${slug}/libro`);
  let mdxs;
  try { mdxs = readdirSync(dir).filter((f) => f.endsWith('.mdx')).sort(); }
  catch (err) { console.error(`✖ ${dir} not found`); continue; }

  const outDir = resolve(root, `tmp/slides/${slug}`);
  mkdirSync(outDir, { recursive: true });

  for (const file of mdxs) {
    const src = readFileSync(resolve(dir, file), 'utf8');
    const fm = readFm(src);
    if (fm.estado !== 'publicado') { console.log(`  · ${file}: estado=${fm.estado}, omitido`); continue; }

    const unitSlug = basename(file, '.mdx');
    try {
      const md = buildDeckMarkdown(src, { asignatura: slug, unitSlug });
      writeFileSync(join(outDir, `${unitSlug}.md`), md, 'utf8');
      console.log(`  ✓ ${slug}/${unitSlug}.md (${md.length} bytes)`);
      total++;
    } catch (err) {
      console.error(`  ✖ ${slug}/${unitSlug}: ${err.message}`);
      console.error(err.stack);
    }
  }
}
console.log(`\nGenerados ${total} esqueletos de deck.`);
```

- [ ] **Step 2 · Update `build-slides.mjs` — add `--html-only` flag and capture-diagrams call**

Edit `scripts/build-slides.mjs`. Two changes:

**Change A** (top of file, right after `ASIGNATURAS` declaration). Detect the flag:

```javascript
const htmlOnly = process.argv.includes('--html-only');
const skipCapture = process.argv.includes('--skip-capture');
```

**Change B** (between Step 1 — extract — and Step 2 — Marp). Add capture step
before extract, and switch the loop to skip PDF when `htmlOnly`:

```javascript
// Step 0: capture diagrams (skip if --skip-capture)
if (!skipCapture) {
  console.log('\n→ Capturando diagramas…');
  await runScript(resolve(__dirname, 'capture-diagrams.mjs'), slugFilters);
}
```

And inside the `for (const ext of ['pdf', 'html'])` loop, replace the loop with:

```javascript
const formats = htmlOnly ? ['html'] : ['pdf', 'html'];
for (const ext of formats) {
  // … existing body …
}
```

Also update `runScript` to forward the slug filter args:

```javascript
function runScript(scriptPath, args = []) {
  return new Promise((resolveDone) => {
    const child = spawn(process.execPath, [scriptPath, ...args], {
      cwd: root, stdio: 'inherit', env: process.env,
    });
    child.on('close', (code) => {
      if (code !== 0) { console.error(`✖ ${scriptPath} exit ${code}`); process.exit(code); }
      resolveDone();
    });
  });
}
```

And call as `runScript(scriptPath, slugFilters)` everywhere.

- [ ] **Step 3 · Smoke test extract only**

```bash
node scripts/extract-slides.mjs edmn-2bach
ls tmp/slides/edmn-2bach
```

Expected: 12 `.md` files. Open `06-funcion-comercial-marketing.md` and visually confirm it has TL;DR, Caso, Figures with `file:///` URLs, and the new component classes (`<!-- _class: caso -->`, etc.).

- [ ] **Step 4 · Commit**

```bash
git add scripts/extract-slides.mjs scripts/build-slides.mjs
git commit -m "feat(slides): rewrite extract-slides over MDX AST + --html-only flag"
```

---

## Task 13 · Pilot on U6 (Función comercial) — iterate visual

**Files:**
- No new files. Visual validation only.

- [ ] **Step 1 · Build the deck (HTML only, fast)**

```bash
npm run build:slides edmn-2bach -- --html-only
open public/slides/edmn-2bach/06-funcion-comercial-marketing.html
# (windows: start public\slides\edmn-2bach\06-funcion-comercial-marketing.html)
```

- [ ] **Step 2 · Eyeball the deck. Check:**

- [ ] Title slide has italic-wonk on a word
- [ ] TL;DR slide reads as a pull-quote
- [ ] Caso dilema has the Boqueria photo at 45% left + title + question right
- [ ] At least one `<Figure>` renders the actual JPG
- [ ] MarketingMix4P diagram appears as a PNG slide
- [ ] RealExample (Nespresso) renders with terracota border
- [ ] Vuelve al caso appears near the end with dimmed image
- [ ] Voces en desacuerdo (Galbraith vs Kotler) appears as 2 columns
- [ ] RetoEtapa 06/12 has the giant outline number
- [ ] Mirar fora has 4 quadrants
- [ ] Close slide on ink background

- [ ] **Step 3 · Fix any visual bug immediately**

For each broken layout, edit `marp-themes/profedeeconomia.css` and/or the relevant parser. Re-run `npm run build:slides edmn-2bach -- --html-only --skip-capture` (skip-capture saves time after the first run).

- [ ] **Step 4 · Generate the PDF for U6**

```bash
npm run build:slides edmn-2bach
```

Open `public/slides/edmn-2bach/06-funcion-comercial-marketing.pdf` and confirm it matches the HTML preview.

- [ ] **Step 5 · Pause for Pau's approval**

This is a checkpoint — show Pau the U6 deck (HTML + PDF). Only proceed when he says it's good.

- [ ] **Step 6 · Commit any final visual fixes**

```bash
git add marp-themes/profedeeconomia.css scripts/slide-parsers/ scripts/slide-builders/
git commit -m "fix(slides): visual polish from U6 pilot review"
```

---

## Task 14 · Build full EDMN 2BACH (12 units) and finalize

**Files:**
- No new files. Final generation + commit.

- [ ] **Step 1 · Full regeneration**

```bash
npm run build
npm run build:slides edmn-2bach
```

Expected: 12 PDFs + 12 HTML files under `public/slides/edmn-2bach/`. Each PDF
should weigh between 5-30 MB (more for unitats with many fotos).

- [ ] **Step 2 · Sanity-check pagination**

For 3 random units (e.g., U2, U7, U11), open the PDF and confirm:
- Pagination footer shows N / total
- No truncated content
- No dangling slides with `*(añadir aquí el contenido)*` placeholder

If you see placeholder text, the relevant parser is missing the component
in that unit. Fix the parser and re-run.

- [ ] **Step 3 · Commit the generated PDFs/HTMLs**

```bash
git add public/slides/edmn-2bach/
git commit -m "build(slides): regenerate EDMN 2BACH decks (12 units, dense self-study format)"
```

- [ ] **Step 4 · Update memory entry**

Update `C:\Users\paumo\.claude\projects\C--Users-paumo-Desktop-projects-profedeeconomia\memory\project_edmn_pilot_innovacion.md` — under "Bloc 3 — Regenerar diapositives": mark as completed for EDMN 2BACH, note pending for the 8 remaining books.

- [ ] **Step 5 · Final summary to Pau**

Report:
- Number of slides per unit (range)
- Total PDF weight
- Any unit that needed manual fixes
- Suggest: open PR `feat/edmn-pilot-innovacion → main` once Pau validates.

---

## Self-review (post-write)

**Spec coverage check** (going through `2026-05-28-slides-overhaul-design.md`):
- ✓ Editorial-keynote balancejat → theme keeps Variant C
- ✓ 40-70 slides/unit → assembler emits per-component slides
- ✓ Self-sufficient for study → no truncation in h2-section.mjs
- ✓ EDMN 2BACH pilot → tasks 13-14 target only edmn-2bach
- ✓ Diagrams via Playwright screenshots → Task 3 uses Puppeteer (same API; already installed; equivalent to Playwright for `element.screenshot()` — accepted variance from spec for zero new deps)
- ✓ Images via --allow-local-files → figure.mjs emits `file:///` URLs
- ✓ HTML-only iteration mode → Task 12 step 2 adds `--html-only`
- ✓ 12 new section classes → Task 1 adds all 12 (tldr/caso/caso-resuelto/figure/diagram/example/curiosity/exercise/voces/ebau/reto/mirar-fora)
- ✓ Body font 26→28px → Task 1 includes `section { font-size: 28px; }`
- ✓ SolvedExercise → 2 slides → Task 7
- ✓ Vuelve al caso ends near the back, not next to Caso → assembler intercepts and puts it after H2 groups
- ✓ MirarFora at the end → assembler puts it last (after takeaways)
- ✓ Tests for parsers → ast, tldr, figure, diagram, solved-exercise

**Placeholder scan:** None. Every step shows the actual code or command.

**Type / name consistency:** All renderer exports follow `render<Name>(...)`. The assembler imports each by that name. `COMPONENT_RENDERERS` map keys match the JSX component names exactly (TldrUnidad, CasoDilema, etc.).

**Spec variance noted:**
- Spec said "Playwright"; plan uses "Puppeteer" (zero new dependency; same screenshot API). Acceptable.
- Spec mentioned `<Diagram>` instrumentation as plural components; plan instruments only the single `Diagram.astro` wrapper because every diagram in the book is rendered through that wrapper.
