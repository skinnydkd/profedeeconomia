# Cuaderno visual del alumno «De cero a empresa» (Etapa A) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A downloadable, dual-edition (alumno/profesor) **visual** student workbook for the «De cero a empresa» project — one worksheet per phase with a graphic fill-in template (BMC canvas, break-even chart, 4P, etc.).

**Architecture:** Single source: each phase MDX gains a structured `cuaderno` frontmatter object (`tarea`, `reflexion`, `orientacion_docente`, `plantilla`). A set of blank visual `Plantilla*` components (mirroring the existing diagram/`EjemploEmpresa` visual language) render the fill-in artifact. A `BloqueCuaderno` component renders the worksheet on the phase web page; a paged.js print route `/emprendimiento/proyecto/cuaderno/imprimir/[modo]` compiles cover + index + one worksheet per phase into a PDF (alumno blank / profesor with teacher notes), built by `scripts/build-cuaderno-pdf.mjs`.

**Tech Stack:** Astro 5 content collections + Zod, Astro components, paged.js + Puppeteer (existing PDF pipeline). Accent mostaza `#D4A24C`.

---

## File structure

- **Modify** `src/content.config.ts` — add `cuaderno` object to the `proyectoTransversal` schema.
- **Modify** the 12 phase files `src/content/emprendimiento/proyecto/*.mdx` — add the `cuaderno` frontmatter.
- **Create** `src/components/emprendimiento/plantillas/` — the blank visual templates:
  - `PlantillaCanvasBM.astro`, `Plantilla4P.astro`, `PlantillaPuntoMuerto.astro`, `PlantillaProcesos.astro`, `PlantillaPitch.astro`, `PlantillaTabla.astro`, and `Plantilla.astro` (dispatch by `tipo`).
- **Create** `src/components/emprendimiento/BloqueCuaderno.astro` — renders tarea + plantilla + reflexion + (profesor) orientación.
- **Modify** `src/pages/emprendimiento/proyecto/[fase].astro` — render `BloqueCuaderno` (alumno mode) after the phase body.
- **Create** `src/pages/emprendimiento/proyecto/cuaderno/imprimir/[modo].astro` — paged.js dual-edition print route.
- **Create** `scripts/build-cuaderno-pdf.mjs` — generate the two PDFs.
- **Modify** `package.json` — `build:cuaderno` script + add to `build:all`.
- **Modify** `src/pages/emprendimiento/proyecto/index.astro` — download buttons.

---

## Task 1: Schema — `cuaderno` object on `proyectoTransversal`

**Files:** Modify `src/content.config.ts` (the `proyectoTransversal` schema, currently lines ~241-269).

- [ ] **Step 1: Add the `cuaderno` field** inside the `z.object({ ... })`, right before `lang:`:

```ts
    /** Student-workbook content for this phase, rendered identically on the web
     *  phase page and in the printable cuaderno PDF (single source). */
    cuaderno: z
      .object({
        /** "Manos a la obra" consigna for the student team. */
        tarea: z.string(),
        /** Short team-reflection prompt shown under the template. */
        reflexion: z.string(),
        /** Teacher orientation — only rendered in `modo === 'profesor'`. */
        orientacion_docente: z.string().optional(),
        /** The visual fill-in template. */
        plantilla: z.object({
          tipo: z.enum(['canvas-bm', '4p', 'punto-muerto', 'procesos', 'pitch', 'tabla']),
          /** For tipo 'tabla': column headers. */
          columnas: z.array(z.string()).optional(),
          /** For tipo 'tabla': number of blank rows. For 'procesos'/'pitch': number of slots. */
          filas: z.number().int().optional(),
        }),
      })
      .optional(),
```

- [ ] **Step 2: Verify the schema compiles**

Run: `npx astro check 2>&1 | head -20`
Expected: no new errors about `proyectoTransversal`. (Pre-existing unrelated warnings are fine.)

- [ ] **Step 3: Commit**

```bash
git add src/content.config.ts
git commit -m "feat(emprendimiento): add cuaderno schema to proyectoTransversal phases"
```

---

## Task 2: Visual blank templates (`Plantilla*` components)

**Files:** Create the components in `src/components/emprendimiento/plantillas/`.

These are **blank** versions of the project's visual tools — same look as `EjemploEmpresa.astro` (labelled cells, accent `--color-mustard`), but empty with writing space. They must render the same on screen and in print (use plain CSS; tall min-heights so there's room to write by hand).

- [ ] **Step 1: `PlantillaCanvasBM.astro`** (blank 9-block Business Model Canvas)

```astro
---
/** Blank Business Model Canvas (9 blocks) for the student team to fill in. */
const BLOQUES = [
  { k: 'socios', label: 'Socios clave' },
  { k: 'actividades', label: 'Actividades clave' },
  { k: 'recursos', label: 'Recursos clave' },
  { k: 'propuesta', label: 'Propuesta de valor' },
  { k: 'relaciones', label: 'Relación con clientes' },
  { k: 'canales', label: 'Canales' },
  { k: 'segmentos', label: 'Segmentos de cliente' },
  { k: 'costes', label: 'Estructura de costes' },
  { k: 'ingresos', label: 'Fuentes de ingreso' },
];
---
<div class="bmc">
  {BLOQUES.map((b) => (
    <div class={`bmc__cell bmc__cell--${b.k}`}>
      <span class="bmc__k">{b.label}</span>
    </div>
  ))}
</div>
<style>
  .bmc { display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-rows: minmax(96px, auto); gap: 6px; }
  .bmc__cell { border: 1.5px solid var(--color-line); border-top: 3px solid var(--color-mustard); border-radius: 0 5px 5px 0; padding: 0.5rem 0.6rem; background: var(--color-paper); }
  .bmc__k { display: block; font-family: var(--font-sans); font-size: 0.66rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--color-mustard-deep); font-weight: 700; }
  /* Propuesta de valor spans the center, taller. */
  .bmc__cell--propuesta { grid-column: 2; grid-row: 1 / span 2; }
  .bmc__cell--costes, .bmc__cell--ingresos { grid-row: 3; }
  @media print { .bmc__cell { break-inside: avoid; } }
</style>
```

- [ ] **Step 2: `Plantilla4P.astro`** (blank 4-quadrant marketing mix)

Same pattern: a 2×2 grid (`grid-template-columns: 1fr 1fr`), four cells labelled **Producto · Precio · Plaza · Promoción**, each `min-height: 120px`, mustard top-border, label in `.k` style. Copy the cell CSS from PlantillaCanvasBM.

- [ ] **Step 3: `PlantillaPuntoMuerto.astro`** (blank break-even chart + formula)

An SVG with empty axes (X = "Cantidad (uds)", Y = "€"), light gridlines, NO plotted lines (the student draws them), `viewBox="0 0 760 420"`, house palette (axes `#5C4A3D`, grid `#EFE2CB`). Below the chart: the formula line `Punto muerto (uds) = Costes fijos ÷ (Precio − Coste variable unitario)` and a small 3-row blank table (Costes fijos | Coste variable unitario | Precio de venta) using the `.tabla` style from Task 2 Step 6. Reuse the axis/label CSS conventions from `src/components/diagrams/OfertaDemanda.astro` (fonts Switzer/JetBrains Mono).

- [ ] **Step 4: `PlantillaProcesos.astro`** (blank process flow)

`filas` (default 4) rounded boxes in a row connected by `→` arrows, each box empty with a small caption slot underneath ("Paso 1", "Paso 2", …). Boxes `min-height: 88px`, border `--color-line`, top-border mustard. Wraps on narrow/print width.

- [ ] **Step 5: `PlantillaPitch.astro`** (blank pitch outline)

A numbered list of `filas` (default 9) pitch beats with the standard labels (Problema, Solución, Mercado, Producto, Modelo de negocio, Competencia, Equipo, Números, Petición) each followed by 2 blank writing lines (`border-bottom: 1px dashed var(--color-line)`, `height: 1.4rem`).

- [ ] **Step 6: `PlantillaTabla.astro`** (generic blank table)

```astro
---
interface Props { columnas: string[]; filas?: number }
const { columnas, filas = 6 } = Astro.props;
const rows = Array.from({ length: filas });
---
<table class="cuad-tabla">
  <thead><tr>{columnas.map((c) => <th>{c}</th>)}</tr></thead>
  <tbody>{rows.map(() => <tr>{columnas.map(() => <td></td>)}</tr>)}</tbody>
</table>
<style>
  .cuad-tabla { width: 100%; border-collapse: collapse; margin: 0.4rem 0; }
  .cuad-tabla th { font-family: var(--font-sans); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-mustard-deep); text-align: left; padding: 0.4rem 0.6rem; border-bottom: 2px solid var(--color-mustard); }
  .cuad-tabla td { border: 1px solid var(--color-line); height: 2.4rem; padding: 0.3rem 0.6rem; }
  @media print { .cuad-tabla tr { break-inside: avoid; } }
</style>
```

- [ ] **Step 7: `Plantilla.astro`** (dispatch)

```astro
---
import PlantillaCanvasBM from './PlantillaCanvasBM.astro';
import Plantilla4P from './Plantilla4P.astro';
import PlantillaPuntoMuerto from './PlantillaPuntoMuerto.astro';
import PlantillaProcesos from './PlantillaProcesos.astro';
import PlantillaPitch from './PlantillaPitch.astro';
import PlantillaTabla from './PlantillaTabla.astro';
interface Props { plantilla: { tipo: string; columnas?: string[]; filas?: number } }
const { plantilla: p } = Astro.props;
---
{p.tipo === 'canvas-bm' && <PlantillaCanvasBM />}
{p.tipo === '4p' && <Plantilla4P />}
{p.tipo === 'punto-muerto' && <PlantillaPuntoMuerto />}
{p.tipo === 'procesos' && <PlantillaProcesos filas={p.filas} />}
{p.tipo === 'pitch' && <PlantillaPitch filas={p.filas} />}
{p.tipo === 'tabla' && <PlantillaTabla columnas={p.columnas ?? []} filas={p.filas} />}
```

- [ ] **Step 8: Commit**

```bash
git add src/components/emprendimiento/plantillas/
git commit -m "feat(emprendimiento): blank visual workbook templates (BMC, 4P, punto muerto, etc.)"
```

---

## Task 3: `BloqueCuaderno` component

**Files:** Create `src/components/emprendimiento/BloqueCuaderno.astro`.

Renders one phase's workbook block. `modo` controls whether the teacher orientation shows.

- [ ] **Step 1: Write the component**

```astro
---
import Plantilla from './plantillas/Plantilla.astro';
interface Props {
  cuaderno: {
    tarea: string;
    reflexion: string;
    orientacion_docente?: string;
    plantilla: { tipo: string; columnas?: string[]; filas?: number };
  };
  modo?: 'alumno' | 'profesor';
}
const { cuaderno: c, modo = 'alumno' } = Astro.props;
---
<section class="cuad">
  <p class="cuad__eyebrow">Manos a la obra</p>
  <p class="cuad__tarea" set:html={c.tarea} />
  <div class="cuad__plantilla"><Plantilla plantilla={c.plantilla} /></div>
  <p class="cuad__reflexion"><span>Reflexión del equipo —</span> {c.reflexion}</p>
  {modo === 'profesor' && c.orientacion_docente && (
    <div class="cuad__orientacion">
      <span class="cuad__orientacion-k">Orientación docente</span>
      <p set:html={c.orientacion_docente} />
    </div>
  )}
</section>
<style>
  .cuad { margin: 2rem 0; padding: 1.4rem 1.6rem; background: var(--color-mustard-soft); border: 1px solid var(--color-line); border-radius: 8px; }
  .cuad__eyebrow { font-family: var(--font-sans); font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: var(--color-mustard-deep); margin: 0 0 0.4rem; }
  .cuad__tarea { margin: 0 0 1.1rem; font-size: 1.05rem; }
  .cuad__plantilla { background: var(--color-bg); border-radius: 6px; padding: 1rem; }
  .cuad__reflexion { margin: 1rem 0 0; font-family: var(--font-serif); font-style: italic; color: var(--color-ink-soft); }
  .cuad__reflexion span { font-family: var(--font-sans); font-style: normal; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--color-mustard-deep); }
  .cuad__orientacion { margin-top: 1.1rem; padding: 0.9rem 1.1rem; background: var(--color-paper); border-left: 3px solid var(--color-mustard-deep); border-radius: 0 6px 6px 0; }
  .cuad__orientacion-k { display: block; font-family: var(--font-sans); font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-mustard-deep); margin-bottom: 0.3rem; }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/emprendimiento/BloqueCuaderno.astro
git commit -m "feat(emprendimiento): BloqueCuaderno renders a phase worksheet"
```

---

## Task 4: Fill `cuaderno` frontmatter in the 12 phases

**Files:** Modify each `src/content/emprendimiento/proyecto/*.mdx` (01-detecta, 02-idea-equipo, 03-modelo-negocio, 04-valida, 05-marketing, 06-operaciones, 07-personas-equipo, 08-financiacion, 09-numeros-viabilidad, 10-estres-test, 11-pitch-dossier, 99-lanza-valiente).

Add a `cuaderno:` block to each phase's frontmatter. The `tipo` + columnas come from this mapping (one per phase):

| File | plantilla |
|---|---|
| 01-detecta | `tabla`, columnas `["¿Dónde lo veo?","El problema","¿A quién afecta?","¿Vale la pena resolverlo?"]`, filas 6 |
| 02-idea-equipo | `tabla`, columnas `["Integrante","Lo que se le da bien","Rol en el equipo"]`, filas 5 |
| 03-modelo-negocio | `canvas-bm` |
| 04-valida | `tabla`, columnas `["Hipótesis a comprobar","A quién pregunté","Qué aprendí","¿Se confirma?"]`, filas 6 |
| 05-marketing | `tabla`, columnas `["Público objetivo","Mensaje","Canales","Una acción concreta"]`, filas 4 |
| 06-operaciones | `procesos`, filas 5 |
| 07-personas-equipo | `tabla`, columnas `["Área / tarea","Responsable","Norma de equipo"]`, filas 6 |
| 08-financiacion | `tabla`, columnas `["¿Para qué necesito dinero?","¿Cuánto?","¿De dónde sale?"]`, filas 5 |
| 09-numeros-viabilidad | `punto-muerto` |
| 10-estres-test | `tabla`, columnas `["Riesgo","Probabilidad","Impacto","Plan B"]`, filas 5 |
| 11-pitch-dossier | `pitch`, filas 9 |
| 99-lanza-valiente | `tabla`, columnas `["Fecha","Qué vendí","A quién","Qué aprendí"]`, filas 6 |

- [ ] **Step 1: Example — `03-modelo-negocio.mdx`** (the graphic BMC case). Add to its frontmatter:

```yaml
cuaderno:
  tarea: "Rellenad vuestro **Business Model Canvas**: empezad por la **propuesta de valor** (qué problema resolvéis y para quién) y completad después los nueve bloques. Usad los *ejemplos con chispa* de esta fase como espejo, no como plantilla a copiar."
  reflexion: "¿Qué bloque os ha costado más rellenar y por qué? Eso suele señalar la parte más floja del modelo."
  orientacion_docente: "Lo esencial es la **coherencia entre bloques**: que los ingresos cubran los costes y que canales y relaciones encajen con el segmento. No exijáis perfección; exigid que cada bloque esté justificado."
  plantilla:
    tipo: canvas-bm
```

- [ ] **Step 2: Example — `01-detecta.mdx`** (a table case):

```yaml
cuaderno:
  tarea: "Salid a observar vuestro entorno (instituto, barrio, casa) y **anotad al menos seis problemas reales**. Para cada uno, decidid a quién afecta y si vale la pena resolverlo. Al final, **rodead el problema elegido**."
  reflexion: "El problema que habéis elegido, ¿lo tenéis vosotros o lo tiene otra gente? Los mejores proyectos resuelven problemas de muchos, no solo propios."
  orientacion_docente: "Frenad la tentación de saltar a la solución. Esta fase va de **enamorarse del problema**, no de la idea. Un buen mapa tiene problemas concretos y observados, no genéricos."
  plantilla:
    tipo: tabla
    columnas: ["¿Dónde lo veo?", "El problema", "¿A quién afecta?", "¿Vale la pena resolverlo?"]
    filas: 6
```

- [ ] **Step 3: Example — `09-numeros-viabilidad.mdx`** (the chart case):

```yaml
cuaderno:
  tarea: "Calculad vuestro **punto muerto**: cuántas unidades necesitáis vender para empezar a ganar. Rellenad costes fijos, coste variable por unidad y precio, aplicad la fórmula y **dibujad las dos líneas** (ingresos y costes totales) en la gráfica."
  reflexion: "Si el punto muerto exige vender muchísimo, ¿el precio es bajo, los costes fijos altos o el mercado pequeño? ¿Qué cambiaríais?"
  orientacion_docente: "El objetivo no es la exactitud contable, sino que entiendan la **lógica**: fijos vs variables y por qué el precio es una decisión crítica. Conectad con la calculadora de punto muerto de Herramientas."
  plantilla:
    tipo: punto-muerto
```

- [ ] **Step 4: Fill the remaining 9 phases** following the same shape: write a `tarea` (1-2 sentences, action-oriented), a `reflexion` (a question), an `orientacion_docente` (teacher note), and the `plantilla` from the mapping table above. Keep the project's voice (plural, close, no emojis, correct accents).

- [ ] **Step 5: Verify content loads**

Run: `npx astro build 2>&1 | tail -5`
Expected: build completes; the phases parse with the new frontmatter (no Zod errors).

- [ ] **Step 6: Commit**

```bash
git add src/content/emprendimiento/proyecto/
git commit -m "feat(emprendimiento): author cuaderno worksheets for the 12 phases"
```

---

## Task 5: Render the worksheet on the phase web page

**Files:** Modify `src/pages/emprendimiento/proyecto/[fase].astro`.

- [ ] **Step 1: Import + render.** Add the import to the frontmatter:

```ts
import BloqueCuaderno from '@components/emprendimiento/BloqueCuaderno.astro';
```

And after the phase `<article>` body (where `<Content />` is rendered), add:

```astro
{fase.data.cuaderno && <BloqueCuaderno cuaderno={fase.data.cuaderno} modo="alumno" />}
```

(Use the actual prop name for the phase entry in this file — inspect whether it's `fase`, `entry`, or `phase` and match it.)

- [ ] **Step 2: Build + spot-check**

Run: `npx astro build 2>&1 | tail -3`
Then open `/emprendimiento/proyecto/03-modelo-negocio/` (dev) — the blank BMC canvas shows under the phase text.

- [ ] **Step 3: Commit**

```bash
git add "src/pages/emprendimiento/proyecto/[fase].astro"
git commit -m "feat(emprendimiento): show the workbook block on each phase page"
```

---

## Task 6: Dual-edition print route

**Files:** Create `src/pages/emprendimiento/proyecto/cuaderno/imprimir/[modo].astro`.

Mirror `src/pages/[asignatura]/actividades/imprimir/[modo].astro`: two static paths (`alumno`/`profesor`), `noindex`, paged.js polyfill, `@page` A4, cover + index + one worksheet per phase. Accent mustard `#D4A24C`.

- [ ] **Step 1: Write the route**

```astro
---
import { getCollection } from 'astro:content';
import BloqueCuaderno from '@components/emprendimiento/BloqueCuaderno.astro';
import type { GetStaticPaths } from 'astro';

export const getStaticPaths = (async () => {
  const fases = (await getCollection('proyectoTransversal'))
    .filter((f) => f.data.estado === 'publicado' && f.data.cuaderno)
    .sort((a, b) => a.data.fase - b.data.fase);
  const props = { fases };
  return [
    { params: { modo: 'alumno' }, props },
    { params: { modo: 'profesor' }, props },
  ];
}) satisfies GetStaticPaths;

const { fases } = Astro.props;
const esProfesor = Astro.params.modo !== 'alumno';
const edicion = esProfesor ? 'Profesorado' : 'Alumnado';
const accent = '#D4A24C';
const accentDeep = '#A87A2A';
---
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="robots" content="noindex" />
  <title>De cero a empresa — Cuaderno del {edicion}</title>
  <script src="https://unpkg.com/pagedjs/dist/paged.polyfill.js"></script>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..700,0..100,0..1;1,9..144,300..700,0..100,0..1&display=swap" />
  <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=switzer@400,500,600,700&display=swap" />
  <style is:global>
    @page { size: A4; margin: 18mm 16mm 16mm; }
    :root { --color-bg:#FBF6EC; --color-paper:#FFF; --color-ink:#2A1F18; --color-ink-soft:#5C4A3D; --color-ink-mute:#806C5A; --color-line:#E5D4BD; --color-mustard: ${accent}; --color-mustard-deep: ${accentDeep}; --color-mustard-soft:#F5E5BC; --font-serif:'Fraunces',serif; --font-sans:'Switzer',sans-serif; --font-mono:'JetBrains Mono',monospace; }
    body { font-family: var(--font-sans); color: var(--color-ink); font-size: 10.5pt; line-height: 1.5; }
    .cover { display:flex; flex-direction:column; justify-content:center; height: 240mm; }
    .cover__eyebrow { color: ${accentDeep}; font-weight:700; letter-spacing:.12em; text-transform:uppercase; font-size:11pt; }
    .cover__title { font-family:var(--font-serif); font-size:34pt; line-height:1.05; margin:.4rem 0; }
    .cover__ed { font-style:italic; font-family:var(--font-serif); color:var(--color-ink-soft); font-size:14pt; }
    .cover__equipo { margin-top: 2rem; border:1.5px solid var(--color-line); border-top:3px solid ${accent}; border-radius:6px; padding:1rem 1.2rem; }
    .cover__equipo h3 { font-size:.72rem; text-transform:uppercase; letter-spacing:.08em; color:${accentDeep}; margin:0 0 .6rem; }
    .cover__field { border-bottom:1px dashed var(--color-line); height:1.8rem; margin-bottom:.6rem; }
    .toc { break-before: page; }
    .toc h2 { font-family:var(--font-serif); }
    .fase { break-before: page; }
    .fase__label { color:${accentDeep}; font-weight:700; text-transform:uppercase; letter-spacing:.08em; font-size:.78rem; }
    .fase__title { font-family:var(--font-serif); font-size:20pt; margin:.2rem 0 .2rem; }
    .fase__entregable { color:var(--color-ink-soft); font-style:italic; margin:0 0 1rem; }
  </style>
</head>
<body>
  <section class="cover">
    <div class="cover__eyebrow">De cero a empresa · Cuaderno del equipo</div>
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
    <ol>{fases.map((f) => <li>{f.data.fase_label} — {f.data.title}</li>)}</ol>
  </section>

  {fases.map((f) => (
    <section class="fase">
      <div class="fase__label">{f.data.fase_label}</div>
      <h2 class="fase__title">{f.data.title}</h2>
      <p class="fase__entregable"><strong>Entregable:</strong> {f.data.entregable}</p>
      <BloqueCuaderno cuaderno={f.data.cuaderno} modo={esProfesor ? 'profesor' : 'alumno'} />
    </section>
  ))}
</body>
</html>
```

- [ ] **Step 2: Build + open both modes**

Run: `npx astro build 2>&1 | tail -3`
Open `/emprendimiento/proyecto/cuaderno/imprimir/alumno/` and `/profesor/` — alumno shows blank templates; profesor adds the orientación box per phase.

- [ ] **Step 3: Commit**

```bash
git add "src/pages/emprendimiento/proyecto/cuaderno/imprimir/[modo].astro"
git commit -m "feat(emprendimiento): dual-edition print route for the cuaderno"
```

---

## Task 7: PDF build script

**Files:** Create `scripts/build-cuaderno-pdf.mjs`; modify `package.json`.

- [ ] **Step 1: Create the script** by copying `scripts/build-entrevista-pdf.mjs` and changing:
- It must render **two** URLs: `emprendimiento/proyecto/cuaderno/imprimir/alumno/` → `emprendimiento-cuaderno-alumno.pdf`, and `…/profesor/` → `emprendimiento-cuaderno-profesor.pdf`.
- Use a free PORT not used by other scripts (e.g. `4337`).
- Keep the `findChromeExecutable()` + static server (serving `dist/client`) + `pagedjs-cli` invocation pattern. Output to both `public/downloads/` and `dist/downloads/` (mirror the source script exactly).

Concretely, wrap the per-URL logic in a small loop:

```js
const JOBS = [
  { url: 'emprendimiento/proyecto/cuaderno/imprimir/alumno',   out: 'emprendimiento-cuaderno-alumno.pdf' },
  { url: 'emprendimiento/proyecto/cuaderno/imprimir/profesor', out: 'emprendimiento-cuaderno-profesor.pdf' },
];
```
and call the existing pagedjs render once per job.

- [ ] **Step 2: Add npm scripts.** In `package.json`, add after `build:entrevista`:

```json
    "build:cuaderno": "node scripts/build-cuaderno-pdf.mjs",
```
and insert `npm run build:cuaderno && ` into `build:all` right after `npm run build:entrevista && `.

- [ ] **Step 3: Generate the PDFs**

Run: `npm run build && npm run build:cuaderno 2>&1 | tail -8`
Expected: `emprendimiento-cuaderno-alumno.pdf` and `…-profesor.pdf` written to `public/downloads/`, no errors.

- [ ] **Step 4: Visual check** — open both PDFs: cover with team fields, index, one worksheet per phase, blank templates that fit the page (no clipping), profesor edition adds orientación boxes.

- [ ] **Step 5: Commit**

```bash
git add scripts/build-cuaderno-pdf.mjs package.json public/downloads/emprendimiento-cuaderno-alumno.pdf public/downloads/emprendimiento-cuaderno-profesor.pdf
git commit -m "feat(emprendimiento): build the dual-edition cuaderno PDFs"
```

---

## Task 8: Download buttons on the project hub

**Files:** Modify `src/pages/emprendimiento/proyecto/index.astro`.

- [ ] **Step 1:** Next to the existing project-PDF download, add two buttons:
- `Cuaderno del alumno (PDF)` → `/downloads/emprendimiento-cuaderno-alumno.pdf`
- `Cuaderno del profesor (PDF)` → `/downloads/emprendimiento-cuaderno-profesor.pdf`

Match the existing download-button markup/classes in that file (inspect and reuse). Add a one-line framing sentence: "Descargad el cuaderno del equipo y rellenadlo fase a fase."

- [ ] **Step 2: Build**

Run: `npx astro build 2>&1 | tail -3`
Expected: green; the hub shows the two new buttons.

- [ ] **Step 3: Commit**

```bash
git add src/pages/emprendimiento/proyecto/index.astro
git commit -m "feat(emprendimiento): link the student/teacher cuaderno from the project hub"
```

---

## Task 9: Final verification

- [ ] **Step 1: Full build**

Run: `npx astro build`
Expected: green.

- [ ] **Step 2: Regenerate the PDFs and confirm no overflow / clipping**

Run: `npm run build:cuaderno`
Expected: both PDFs regenerate cleanly. Open them and confirm every phase's template fits within the page margins (BMC canvas, punto-muerto chart, tables, pitch outline). If any template overflows, reduce its min-heights / rows so it fits A4.

---

## Done criteria

- Each of the 12 phases has a `cuaderno` block (tarea + plantilla + reflexion + orientación).
- Blank visual templates render the same on the web phase page and in the PDF.
- `/emprendimiento/proyecto/cuaderno/imprimir/{alumno,profesor}/` build; the two PDFs generate without overflow.
- The project hub links both editions.
- `astro build` green.

## Self-review

- **Spec coverage:** Etapa A items all mapped — schema (T1), plantilla components incl. visual BMC/punto-muerto (T2), BloqueCuaderno (T3), per-phase content (T4), web render (T5), dual print route (T6), build script + build:all (T7), hub button (T8), verification (T9). Visual-templates principle is honoured (BMC canvas + break-even chart are graphic, not text). Single-source via frontmatter `cuaderno` (T1) consumed by both web (T5) and PDF (T6). Etapa B (weaving ejemplos/entrevista/kit + hub reframe) is intentionally a separate later plan.
- **Placeholder scan:** concrete code for schema, dispatch, two representative plantillas, BloqueCuaderno, print route, and three full phase examples; the other plantillas/phases have exact design specs + the mapping table (no "TBD").
- **Naming consistency:** `cuaderno.{tarea,reflexion,orientacion_docente,plantilla.{tipo,columnas,filas}}` used identically across schema (T1), frontmatter (T4), `Plantilla.astro` dispatch (T2), `BloqueCuaderno` (T3), and the print route (T6). Plantilla `tipo` values match the dispatch cases.
