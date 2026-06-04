# Native Astro Slide Renderer — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Marp slide pipeline with a native Astro renderer that turns each book unit's MDX into a distinctive, art-directed deck (mixed editorial/diagram/data registers) as both a web route and a PDF.

**Architecture:** A pure `buildDeck(mdx)` maps the MDX AST to typed `Slide[]` (one idea per slide, ~18–28). Astro archetype components render each slide as a fixed 16:9 box with the house style and overflow guards. A deck route renders the web deck; a Puppeteer script prints it to PDF (reusing the existing capture pattern).

**Tech Stack:** Astro 5, TypeScript, unified/remark-mdx, Puppeteer, Vitest.

---

## File Structure

- `src/lib/slides/ast.ts` — TS port of the MDX AST helpers (parse, walk, getText, getAttr). Pure.
- `src/lib/slides/types.ts` — `Slide` union + `Deck` types.
- `src/lib/slides/build-deck.ts` — pure `buildDeck(rawMdx): Deck`. Maps AST → slides, condenses to ~18–28.
- `src/lib/slides/build-deck.test.ts` — Vitest for the builder.
- `src/components/slides/Deck.astro` — renders a `Deck` (sequence + keyboard/scroll nav + print CSS hook).
- `src/components/slides/Slide*.astro` — archetypes: `SlideCover`, `SlideConcept`, `SlideDiagram`, `SlideData`, `SlideQuote`, `SlideExercise`, `SlideClose`.
- `src/components/slides/SlideDiagramMount.astro` — static name→diagram dispatch (mirrors `HerramientaIsland`).
- `src/styles/slides.css` — house style (tokens, 16:9 grid, §/motif/footer, per-asignatura accent, overflow guards).
- `src/pages/[asignatura]/diapositivas/[unidad].astro` — web deck route.
- `src/pages/[asignatura]/diapositivas/index.astro` — MODIFY: link to the web deck + PDF.
- `scripts/build-deck-pdf.mjs` — Puppeteer: print each deck route to `public/slides/<asignatura>/<unidad>.pdf` + overflow guard.

Reference (reuse, do not import .mjs into TS): `scripts/slide-parsers/ast.mjs`, `scripts/capture-diagrams.mjs` (Puppeteer pattern), `src/components/calculadoras/HerramientaIsland.astro` (dispatch pattern), `src/components/Diagram.astro`.

---

# FASE 1 — Motor + unidad piloto (EDMN u7 «La función productiva»)

## Task 1: AST helpers (TS) + types

**Files:** Create `src/lib/slides/ast.ts`, `src/lib/slides/types.ts`; Test `src/lib/slides/ast.test.ts`

- [ ] **Step 1: Write the failing test** (`ast.test.ts`)

```ts
import { describe, it, expect } from 'vitest';
import { parseMdx, findByName, getText, getAttr } from './ast.ts';

const SAMPLE = `---
asignatura: edmn-2bach
unidad: 7
title: La función productiva
conceptos_clave: [costes fijos, punto muerto]
---

## El punto muerto

Una idea breve sobre costes.

<Callout label="Concepto clave" title="Punto muerto">El umbral de rentabilidad.</Callout>
`;

describe('ast helpers', () => {
  it('splits frontmatter and parses the body to an AST', () => {
    const { frontmatter, ast } = parseMdx(SAMPLE);
    expect(frontmatter.unidad).toBe(7);
    expect(frontmatter.title).toBe('La función productiva');
    expect(ast.type).toBe('root');
  });
  it('finds components by name and reads attrs/text', () => {
    const { ast } = parseMdx(SAMPLE);
    const callouts = findByName(ast, 'Callout');
    expect(callouts).toHaveLength(1);
    expect(getAttr(callouts[0], 'title')).toBe('Punto muerto');
    expect(getText(callouts[0])).toContain('umbral de rentabilidad');
  });
});
```

- [ ] **Step 2: Run** `npx vitest run src/lib/slides/ast.test.ts` → FAIL (module missing).

- [ ] **Step 3: Implement `types.ts`**

```ts
export type Slide =
  | { tipo: 'cover'; eyebrow?: string; title: string; subtitle?: string }
  | { tipo: 'concept'; eyebrow?: string; title?: string; body?: string; pull?: string }
  | { tipo: 'diagram'; eyebrow?: string; title?: string; diagrama: string; caption?: string }
  | { tipo: 'data'; numero: string; label?: string; title?: string; detalle?: string }
  | { tipo: 'quote'; texto: string; fuente?: string }
  | { tipo: 'exercise'; title: string; enunciado: string; pasos?: string[] }
  | { tipo: 'close'; title: string; nota?: string };

export interface Deck { asignatura: string; unidad: number; title: string; slides: Slide[]; }
```

- [ ] **Step 4: Implement `ast.ts`** (port of `scripts/slide-parsers/ast.mjs`)

```ts
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import { parse as parseYaml } from 'yaml';

const processor = unified().use(remarkParse).use(remarkMdx);

export interface MdxNode { type: string; name?: string; value?: string; children?: MdxNode[]; attributes?: any[]; }

export function parseMdx(src: string): { frontmatter: any; ast: MdxNode } {
  const norm = src.replace(/\r\n/g, '\n');
  const m = norm.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const frontmatter = m ? parseYaml(m[1]) ?? {} : {};
  const body = m ? m[2] : norm;
  const ast = processor.parse(body) as unknown as MdxNode;
  return { frontmatter, ast };
}

export function findByName(node: MdxNode, name: string, out: MdxNode[] = []): MdxNode[] {
  if (!node || typeof node !== 'object') return out;
  if ((node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') && node.name === name) out.push(node);
  if (Array.isArray(node.children)) for (const c of node.children) findByName(c, name, out);
  return out;
}

export function getText(node: MdxNode): string {
  if (!node) return '';
  if (node.value) return node.value;
  if (Array.isArray(node.children)) return node.children.map(getText).join(' ').replace(/\s+/g, ' ').trim();
  return '';
}

export function getAttr(node: MdxNode, attr: string): string {
  const a = (node.attributes || []).find((x: any) => x.type === 'mdxJsxAttribute' && x.name === attr);
  if (!a) return '';
  return typeof a.value === 'string' ? a.value : (a.value?.value ?? '');
}
```

- [ ] **Step 5: Run** `npx vitest run src/lib/slides/ast.test.ts` → PASS. **Commit.**

```bash
git add src/lib/slides/ast.ts src/lib/slides/types.ts src/lib/slides/ast.test.ts
git commit -m "feat(slides): typed MDX AST helpers and deck types"
```

## Task 2: Deck builder (pure, TDD)

**Files:** Create `src/lib/slides/build-deck.ts`; Test `src/lib/slides/build-deck.test.ts`

Maps the AST in document order to typed slides, condensing to keep ~18–28. Mapping (top-level walk over `ast.children`):

| Node | Slide |
|---|---|
| frontmatter | `cover` (eyebrow = `bloque`, title, subtitle = `lema`) |
| `## H2` (heading depth 2) | `cover` (section divider; eyebrow `§N`) |
| run of paragraphs/`### H3` until next block | `concept` (title from nearest H3; body condensed ≤ ~280 chars; if a short standalone sentence, `pull`) |
| `TldrUnidad` | `quote` |
| `CasoDilema` | `concept` (title = `titular` attr, pull = `pregunta` attr) |
| `Diagram` (uses inner component) | `diagram` (diagrama = inner component name; caption = `caption`) |
| `SolvedExercise` | `exercise` (enunciado + `pasos` from the solución list items) |
| `Callout` / `Curiosity` / `RealExample` | `concept` |
| `KeyTakeaways` | `concept` (title "Lo esencial") |
| `VuelveAlCaso` | `close`? No → `concept` |
| end of unit | append one `close` |

Condensing rule: long prose runs become ONE concept slide (not one per paragraph); drop `PistaEbau`, `MirarFora`, `RetoEtapa`, `Steps`, `VocesDesacuerdo`, `Bibliography`, `Figure`, `HerramientaIsland` from the deck (they live in the book) unless a `data`/`diagram` is warranted. Target count enforced by a final assertion in tests.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { buildDeck } from './build-deck.ts';

const RAW = readFileSync('src/content/asignaturas/edmn-2bach/libro/07-funcion-productiva.mdx', 'utf8');

describe('buildDeck (EDMN u7 punto muerto)', () => {
  const deck = buildDeck(RAW);
  it('reads deck identity from frontmatter', () => {
    expect(deck.asignatura).toBe('edmn-2bach');
    expect(deck.unidad).toBe(7);
    expect(deck.title).toContain('productiva');
  });
  it('opens with a cover slide', () => {
    expect(deck.slides[0].tipo).toBe('cover');
  });
  it('includes the break-even diagram slide mounting BreakEvenChart', () => {
    const diag = deck.slides.find((s) => s.tipo === 'diagram' && s.diagrama === 'BreakEvenChart');
    expect(diag).toBeTruthy();
  });
  it('includes at least one exercise slide with steps', () => {
    const ex = deck.slides.find((s) => s.tipo === 'exercise');
    expect(ex).toBeTruthy();
  });
  it('stays within the tight presentation range (18..32)', () => {
    expect(deck.slides.length).toBeGreaterThanOrEqual(18);
    expect(deck.slides.length).toBeLessThanOrEqual(32);
  });
  it('ends with a close slide', () => {
    expect(deck.slides[deck.slides.length - 1].tipo).toBe('close');
  });
});
```

- [ ] **Step 2: Run** → FAIL.

- [ ] **Step 3: Implement `build-deck.ts`** using the mapping above. Key extraction details:
  - Diagram inner component name: `findByName(diagramNode, ...)` won't help; read the FIRST child that is an `mdxJsxFlowElement` and use its `.name` (e.g. `BreakEvenChart`). Fallback: skip if none.
  - `SolvedExercise` steps: split children at the first paragraph matching `/^\**Soluci[oó]n/i` (mirror `scripts/slide-parsers/solved-exercise.mjs`); collect list items after it into `pasos`.
  - Walk `ast.children` once, accumulating prose into a pending `concept` flushed on the next H2/component.
  - Enforce condensation so the count lands in range (merge tiny concept runs).

  (Write the full function; ~120–160 lines. No placeholders — implement each branch.)

- [ ] **Step 4: Run** → PASS (all 6). **Commit.**

```bash
git add src/lib/slides/build-deck.ts src/lib/slides/build-deck.test.ts
git commit -m "feat(slides): pure MDX->Deck builder (tight, art-directed mapping)"
```

## Task 3: House style + archetype components

**Files:** Create `src/styles/slides.css`, `src/components/slides/Deck.astro`, `Slide{Cover,Concept,Diagram,Data,Quote,Exercise,Close}.astro`, `SlideDiagramMount.astro`.

- [ ] **Step 1: `slides.css`** — define on `:root` the tokens (reuse `global.css` values), a `.slide` box `width:1280px;height:720px` scaled responsively (`transform: scale(var(--fit))` or CSS container), Fraunces/Switzer/JetBrains at projection scale, the §/footer/corner-motif, per-asignatura accent via `[data-asig]`. **Overflow guard styling**: `.slide__body{overflow:hidden}` and content uses `clamp()` for type; long text uses `-webkit-line-clamp`. Print: `@media print { .slide { page-break-after: always; } @page { size: 1280px 720px; margin:0 } }`.

- [ ] **Step 2: Archetype components** — each is a `.slide` with its register layout (mirror the validated mockups). `SlideDiagram.astro` renders `<SlideDiagramMount diagrama={...} />`. Props match the `Slide` union fields.

- [ ] **Step 3: `SlideDiagramMount.astro`** — dispatch mirroring `HerramientaIsland`. For the pilot, import + switch the diagrams EDMN u7 needs:

```astro
---
import BreakEvenChart from '@components/diagrams/BreakEvenChart.astro';
import ProcesosProductivos from '@components/diagrams/ProcesosProductivos.astro';
interface Props { diagrama: string }
const { diagrama } = Astro.props;
---
{diagrama === 'BreakEvenChart' && <BreakEvenChart />}
{diagrama === 'ProcesosProductivos' && <ProcesosProductivos />}
```
(Extend this switch per asignatura in later phases. A later optional task can codegen it from `src/components/diagrams/`.)

- [ ] **Step 4: `Deck.astro`** — takes `deck: Deck`, sets `data-asig`, renders each slide via the matching archetype, adds keyboard/scroll nav script. Commit.

```bash
git add src/styles/slides.css src/components/slides/
git commit -m "feat(slides): house-style CSS and slide archetype components"
```

## Task 4: Web deck route + index link

**Files:** Create `src/pages/[asignatura]/diapositivas/[unidad].astro`; Modify `.../diapositivas/index.astro`.

- [ ] **Step 1: Route** — `getStaticPaths` from `getCollection('libro')` (published), param `unidad` = unit file slug. In frontmatter: read the raw MDX from `src/content/asignaturas/${asignatura}/libro/${unidad}.mdx` (Node `fs`), `const deck = buildDeck(raw)`, render `<Deck deck={deck} />` inside a minimal layout that includes `slides.css`. Build green.

- [ ] **Step 2: Index** — add a "Ver presentación" link to `/${a.slug}/diapositivas/${slug}/` next to the PDF/HTML CTAs. Commit.

```bash
git add "src/pages/[asignatura]/diapositivas/"
git commit -m "feat(slides): web deck route and index link"
```

## Task 5: PDF export + overflow guard

**Files:** Create `scripts/build-deck-pdf.mjs`; Modify `package.json` (`build:decks` script).

- [ ] **Step 1: Script** — reuse the Puppeteer pattern from `scripts/capture-diagrams.mjs` (find Chrome, serve `dist/client` on :4322, launch headless). For each target deck route `/<asig>/diapositivas/<unit>/`: `page.goto(..., {waitUntil:'networkidle0'})`, then:
  - **Overflow guard**: evaluate every `.slide` — if `el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1`, collect a failure `{unit, index}`.
  - **PDF**: `await page.pdf({ path: 'public/slides/<asig>/<unit>.pdf', width:'1280px', height:'720px', printBackground:true, pageRanges:'' })`.
  - At the end, if any overflow failures: print them and `process.exit(1)`.

- [ ] **Step 2:** `package.json` → add `"build:decks": "node scripts/build-deck-pdf.mjs"`.

- [ ] **Step 3:** Run `npm run build && npm run build:decks -- edmn-2bach 07-funcion-productiva` → 0 overflow failures, PDF written. Commit.

```bash
git add scripts/build-deck-pdf.mjs package.json public/slides/edmn-2bach/07-funcion-productiva.pdf
git commit -m "feat(slides): puppeteer PDF export with overflow guard"
```

## Task 6: Pilot validation

- [ ] Generate the EDMN u7 deck (web + PDF), open it, confirm: ~18–28 slides, registers alternate, no overflow/overlap, signature DNA present, BreakEvenChart + ProcesosProductivos render live. Get Pau's visual OK before Phase 2.

---

# FASE 2 — Libro EDMN completo (12 unidades)

- [ ] Extend `SlideDiagramMount` switch with every diagram used across EDMN units (grep their MDX imports).
- [ ] Run `buildDeck` over the 12 units; add per-unit assertions only where a unit has special structure. Tune the condensation heuristics so every unit lands ~18–28 with no overflow.
- [ ] `npm run build:decks -- edmn-2bach` (all 12) → 0 overflow. Visual review. Commit per batch.

# FASE 3 — 8 asignaturas restantes + deprecación Marp

- [ ] Extend `SlideDiagramMount` to all 56 diagrams (consider a codegen task generating the switch from `src/components/diagrams/`).
- [ ] Generate decks for the other 8 asignaturas; overflow guard green; visual spot-check.
- [ ] Remove the Marp pipeline: delete `scripts/extract-slides.mjs`, `scripts/build-slides.mjs`, `scripts/slide-parsers/`, `scripts/slide-builders/`, `marp-themes/`, the `@marp-team/marp-cli` devDep and the `build:slides`/`capture:diagrams` scripts. Point the index `.html` link to the web deck route (or generate static HTML from the route). Commit.

---

## Self-Review (plan vs spec)

- **Spec §3.1 Slide/Deck types** → Task 1 (types.ts). ✓
- **Spec §3.2 pure deck builder reusing AST extraction** → Task 1 (ast.ts) + Task 2 (build-deck.ts, TDD). ✓
- **Spec §3.3 archetype components + route + house style + per-asig accent** → Task 3 + Task 4. ✓
- **Spec §3.3 diagram mount (live, by name, HerramientaIsland-style)** → Task 3 `SlideDiagramMount`. ✓
- **Spec §3.4 automatic mapping + condensation to ~18–28; overrides** → Task 2 mapping table + count test. (Overrides: attribute read via `getAttr` is available; explicit override handling added in Phase 2 when needed — noted, not a Phase-1 gap.)
- **Spec §3.5 PDF via Puppeteer print** → Task 5. ✓
- **Spec §5 testing: build-deck test + overflow guard + astro build** → Task 2 test, Task 5 guard, Task 4 build. ✓
- **Spec §3.6 / §4 migration + phases** → Fase 2 / Fase 3. ✓
- **Type consistency:** `Slide`/`Deck` from `types.ts` used by `build-deck.ts`, `Deck.astro`, archetypes, route — same field names (`diagrama`, `numero`, `pasos`). ✓
- **Known detail (not placeholder):** the full `build-deck.ts` body and each archetype's CSS are implemented in their steps; the condensation heuristic is tuned against the real u7 file (test-driven).
