# «De cero a empresa» — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the transversal entrepreneurship project «De cero a empresa» at `/emprendimiento/proyecto/`: architecture (collection, routes, hub, index with itineraries, transversal map, PDF script) plus 3 pilot phases (Detecta, Valida, Financiación).

**Architecture:** A new `proyectoTransversal` content collection (one MDX per phase, lives in `src/content/emprendimiento/proyecto/`, NOT tied to any asignatura). A pure-logic module `src/lib/emprendimiento.ts` defines the 3 itineraries and filters phases — unit-tested with vitest. Three flat routes under `/emprendimiento/proyecto/` (index hub, per-phase page, print route) plus a rewritten `/emprendimiento/` landing. A PDF script mirrors `build-proyecto-pdf.mjs`. Reuses the Variant C editorial print system verbatim from `proyecto/imprimir.astro`.

**Tech Stack:** Astro 5 content collections (`glob` loader + zod), Preact not needed (static), vitest for the pure module, pagedjs-cli + system Chrome for PDF.

**Spec:** `docs/superpowers/specs/2026-05-31-emprendimiento-proyecto-transversal-design.md`

---

## File Structure

**Create:**
- `src/lib/emprendimiento.ts` — itinerary definitions + `fasesForItinerario()` pure helper.
- `src/lib/emprendimiento.test.ts` — vitest for the helper.
- `src/content/emprendimiento/proyecto/01-detecta.mdx` — pilot phase 1 (núcleo, todos).
- `src/content/emprendimiento/proyecto/04-valida.mdx` — pilot phase 4 (núcleo, todos).
- `src/content/emprendimiento/proyecto/08-financiacion.mdx` — pilot phase 8 (profundo, bach-fp).
- `src/components/emprendimiento/FaseMeta.astro` — phase metadata block (duración, entregable, nivel badge, competencias).
- `src/components/emprendimiento/PuenteUnidades.astro` — "Esto se trabaja en…" block linking to unit pages.
- `src/components/emprendimiento/MapaTransversal.astro` — the transversal diagram for the index.
- `src/pages/emprendimiento/proyecto/index.astro` — project index (itineraries + diagram + phase cards).
- `src/pages/emprendimiento/proyecto/[fase].astro` — single phase page.
- `src/pages/emprendimiento/proyecto/imprimir.astro` — print route (concatenates all published phases).
- `scripts/build-proyecto-transversal-pdf.mjs` — PDF builder.

**Modify:**
- `src/content.config.ts` — add `proyectoTransversal` collection + register it.
- `src/pages/emprendimiento/index.astro` — rewrite landing (GPE highlight + project entry).
- `package.json` — add `build:proyecto-transversal` script + wire into `build:all`.

**Data model (locked):**
- Phase MDX frontmatter: `fase` (number), `title` (string), `fase_label` (string, e.g. `"Fase 1 — Detecta"`), `nucleo` (boolean), `nivel` (`'todos'|'eso'|'bach-fp'`), `duracion` (string), `entregable` (string), `unidades_relacionadas` (array of `{ asignatura, unidad, nota? }`), `competencias_clave` (string[]), `competencias_especificas` (string[]), `estado`, `lang`.
- The route param value for a phase is its zero-padded number string (`"01"`, `"04"`, `"08"`), derived in `getStaticPaths`, never the filename.

---

## Task 1: Pure itinerary module + tests

**Files:**
- Create: `src/lib/emprendimiento.ts`
- Test: `src/lib/emprendimiento.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/emprendimiento.test.ts
import { describe, it, expect } from 'vitest';
import { ITINERARIOS, fasesForItinerario, type FaseLike } from './emprendimiento';

const FASES: FaseLike[] = [
  { fase: 3 }, { fase: 1 }, { fase: 11 }, { fase: 4 }, { fase: 8 }, { fase: 2 },
];

describe('ITINERARIOS', () => {
  it('defines exactly three itineraries with the expected ids', () => {
    expect(ITINERARIOS.map((i) => i.id)).toEqual(['sprint-eso', 'bach-fp', 'a-la-carta']);
  });

  it('sprint-eso includes only lean-core phases 1,2,3,4,11', () => {
    const sprint = ITINERARIOS.find((i) => i.id === 'sprint-eso')!;
    expect(sprint.fases).toEqual([1, 2, 3, 4, 11]);
  });

  it('a-la-carta has null fases (means all)', () => {
    const carta = ITINERARIOS.find((i) => i.id === 'a-la-carta')!;
    expect(carta.fases).toBeNull();
  });
});

describe('fasesForItinerario', () => {
  it('returns sprint phases sorted ascending', () => {
    const out = fasesForItinerario(FASES, 'sprint-eso').map((f) => f.fase);
    expect(out).toEqual([1, 2, 3, 4, 11]);
  });

  it('a-la-carta returns ALL phases sorted, none filtered out', () => {
    const out = fasesForItinerario(FASES, 'a-la-carta').map((f) => f.fase);
    expect(out).toEqual([1, 2, 3, 4, 8, 11]);
  });

  it('does not mutate the input array', () => {
    const input = [...FASES];
    fasesForItinerario(input, 'sprint-eso');
    expect(input.map((f) => f.fase)).toEqual([3, 1, 11, 4, 8, 2]);
  });

  it('skips phases not present in the data (e.g. fase 5 absent)', () => {
    const out = fasesForItinerario(FASES, 'bach-fp').map((f) => f.fase);
    expect(out).toEqual([1, 2, 3, 4, 8, 11]); // 5,6,7,9,10 absent in fixture
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/emprendimiento.test.ts`
Expected: FAIL — "Cannot find module './emprendimiento'".

- [ ] **Step 3: Write the implementation**

```ts
// src/lib/emprendimiento.ts
/**
 * «De cero a empresa» — transversal entrepreneurship project.
 * Pure helpers shared by the index page, the phase pages and the PDF route.
 */

export type Nivel = 'todos' | 'eso' | 'bach-fp';
export type ItinerarioId = 'sprint-eso' | 'bach-fp' | 'a-la-carta';

export interface Itinerario {
  id: ItinerarioId;
  label: string;
  descripcion: string;
  /** Phase numbers included, in display order. `null` means "all phases". */
  fases: number[] | null;
}

/** The three predefined paths through the project. */
export const ITINERARIOS: Itinerario[] = [
  {
    id: 'sprint-eso',
    label: 'Sprint ESO',
    descripcion:
      'Cinco fases lean, sin planificación pesada. Un mes aproximadamente. Pensado para 3.º y 4.º de ESO.',
    fases: [1, 2, 3, 4, 11],
  },
  {
    id: 'bach-fp',
    label: 'Proyecto Batx/FP',
    descripcion:
      'Las once fases, con la profundización de empresa (operaciones, personas, financiación). El proyecto completo.',
    fases: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  },
  {
    id: 'a-la-carta',
    label: 'A la carta',
    descripcion:
      'Elige las fases que encajen en tu asignatura y tu tiempo. Cada fase es un módulo independiente.',
    fases: null,
  },
];

export interface FaseLike {
  fase: number;
}

/**
 * Returns the phases that belong to an itinerary, sorted ascending by `fase`.
 * `a-la-carta` (fases === null) returns every phase. Never mutates the input.
 */
export function fasesForItinerario<T extends FaseLike>(all: T[], id: ItinerarioId): T[] {
  const it = ITINERARIOS.find((i) => i.id === id);
  const sorted = [...all].sort((a, b) => a.fase - b.fase);
  if (!it || it.fases === null) return sorted;
  const set = new Set(it.fases);
  return sorted.filter((f) => set.has(f.fase));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/emprendimiento.test.ts`
Expected: PASS — 8 tests green.

- [ ] **Step 5: Commit**

```bash
git add src/lib/emprendimiento.ts src/lib/emprendimiento.test.ts
git commit -m "feat(emprendimiento): itinerary module for «De cero a empresa»"
```

---

## Task 2: `proyectoTransversal` content collection

**Files:**
- Modify: `src/content.config.ts` (add collection after the `proyecto` block ~line 218; register in `collections` ~line 287)

- [ ] **Step 1: Add the collection definition**

Insert after the `proyecto` collection definition (after its closing `});`, before the `juegos` block):

```ts
/* =========================================================
   emprendimiento/proyecto — «De cero a empresa».
   Transversal entrepreneurship project. One MDX per phase,
   NOT tied to any asignatura. Source of truth for the phase
   pages and the project workbook PDF.
   ========================================================= */
const proyectoTransversal = defineCollection({
  loader: glob({
    pattern: 'emprendimiento/proyecto/**/*.{md,mdx}',
    base: './src/content',
  }),
  schema: z.object({
    /** Phase number; also the route param (zero-padded) and sort key. */
    fase: z.number().int().min(1),
    title: z.string(),
    /** Display label, e.g. "Fase 1 — Detecta". */
    fase_label: z.string(),
    /** Core lean phase (true) vs. deepening phase for Batx/FP (false). */
    nucleo: z.boolean().default(true),
    nivel: z.enum(['todos', 'eso', 'bach-fp']).default('todos'),
    duracion: z.string(),
    /** One-line description of the deliverable produced in this phase. */
    entregable: z.string(),
    /** Bridges to specific units of each asignatura. */
    unidades_relacionadas: z
      .array(
        z.object({
          asignatura: z.enum(ASIGNATURA_SLUGS),
          unidad: z.number().int().min(1),
          nota: z.string().optional(),
        })
      )
      .default([]),
    competencias_clave: z.array(z.string()).default([]),
    competencias_especificas: z.array(z.string()).default([]),
    lang: z.enum(LANGS).default('es'),
    estado: z.enum(ESTADOS).default('borrador'),
  }),
});
```

- [ ] **Step 2: Register the collection**

In the `export const collections = { … }` object, add `proyectoTransversal,` after `proyecto,`:

```ts
  ebau,
  proyecto,
  proyectoTransversal,
  juegos,
```

- [ ] **Step 3: Add a temporary fixture so the schema compiles against real data**

Create `src/content/emprendimiento/proyecto/01-detecta.mdx` with ONLY frontmatter for now (body filled in Task 3). Use `estado: borrador` so the body is not compiled:

```mdx
---
fase: 1
title: "Detecta un problema que merezca la pena"
fase_label: "Fase 1 — Detecta"
nucleo: true
nivel: todos
duracion: "2-3 sesiones"
entregable: "Mapa de problemas del entorno + un problema elegido y justificado."
unidades_relacionadas: []
competencias_clave: [CPSAA, CC, CE]
competencias_especificas: []
estado: borrador
lang: es
---

Pendiente de redacción (Task 3).
```

- [ ] **Step 4: Verify the schema compiles**

Run: `npx astro build 2>&1 | grep -iE "proyectoTransversal|error|InvalidContentEntry|Completed in"`
Expected: build succeeds (`✓ Completed`), no schema error. (The fixture is `borrador`, so no route is generated yet.)

- [ ] **Step 5: Commit**

```bash
git add src/content.config.ts src/content/emprendimiento/proyecto/01-detecta.mdx
git commit -m "feat(emprendimiento): proyectoTransversal collection + phase 1 fixture"
```

---

## Task 3: Pilot phase content (3 MDX files)

**Files:**
- Modify: `src/content/emprendimiento/proyecto/01-detecta.mdx` (replace body)
- Create: `src/content/emprendimiento/proyecto/04-valida.mdx`
- Create: `src/content/emprendimiento/proyecto/08-financiacion.mdx`

> Content guidelines (from CLAUDE.md): castellano, acentuación correcta, sin emojis pictográficos (sí → × —), tono cercano en plural ("os proponemos"), nunca vender. Verify every `unidades_relacionadas` entry against the real catalogue (see Step 0).

- [ ] **Step 0: Verify the unit bridges against the real catalogue**

For each bridge you cite, confirm the unit exists and is on-topic. Run:

Run: `git ls-tree -r --name-only HEAD -- src/content/asignaturas/edmn-2bach/libro | grep -E "0[4-9]-"`
Expected: lists EDMN units; confirm the numbers you cite (e.g. U4 modelos de negocio, U6 marketing, U9 financiera) match their slugs. Repeat for `eco-1bach` for the financiación/macro bridges. If a number does not match, fix the frontmatter to the real unit.

- [ ] **Step 1: Write phase 1 — Detecta** (replace the fixture file entirely)

```mdx
---
fase: 1
title: "Detecta un problema que merezca la pena"
fase_label: "Fase 1 — Detecta"
nucleo: true
nivel: todos
duracion: "2-3 sesiones"
entregable: "Mapa de problemas del entorno + un problema elegido y justificado."
unidades_relacionadas:
  - { asignatura: "eco-4eso", unidad: 1, nota: "Necesidades y recursos: la raíz del problema económico." }
competencias_clave: [CPSAA, CC, CE]
competencias_especificas: []
estado: publicado
lang: es
---

import Callout from '@components/Callout.astro';
import Steps from '@components/Steps.astro';

Una empresa no nace de una idea brillante en el vacío: nace de un problema real
que alguien tiene y nadie resuelve bien. Esta primera fase no va de inventar
productos, sino de **mirar el entorno con ojos de quien busca lo que falla**:
vuestro barrio, vuestro instituto, vuestra familia, vuestra ciudad.

## Por qué empezar por el problema

Si empezáis por la idea ("montemos una app", "vendamos pulseras"), os enamoráis
de la solución antes de saber si alguien la necesita. Empezar por el problema os
obliga a escuchar primero. Es lo que hacen las empresas que duran.

<Callout tipo="idea" titulo="La regla de esta fase">
No se vale "se me ha ocurrido un producto". Se vale "he visto que mucha gente
tiene este problema". El producto llega en la Fase 2.
</Callout>

## Qué vais a hacer

<Steps>
1. **Salid a observar.** Durante unos días, anotad molestias, esperas, cosas que
   funcionan mal o que cuestan más de lo que deberían. Sin filtrar.
2. **Agrupad por temas.** Movilidad, comida, estudios, tiempo libre, dinero,
   medio ambiente… ¿qué problemas se repiten?
3. **Elegid uno.** El que más os afecte o más os indigne. La motivación importa:
   vais a vivir con este problema todo el proyecto.
4. **Justificadlo.** ¿A cuánta gente afecta? ¿Quién lo sufre? ¿Qué hace ahora
   esa gente para apañarse? ¿Por qué las soluciones actuales no bastan?
</Steps>

## El entregable

Un **mapa de problemas** de vuestro entorno (puede ser un mural, un documento o
una presentación) y, destacado, **el problema que elegís**, con una ficha que
responda: a quién afecta, con qué frecuencia, y por qué merece la pena
resolverlo.

## Para evaluar esta fase

| Criterio | Insuficiente | Adecuado | Excelente |
|---|---|---|---|
| Observación | Problemas genéricos copiados de internet | Problemas reales del entorno | Problemas observados de primera mano, con detalle |
| Justificación | "Nos gusta" | Explica a quién afecta | Cuantifica el alcance y analiza alternativas actuales |
| Trabajo en equipo | Lo hace una persona | Reparto desigual | Todos aportan observaciones propias |
```

- [ ] **Step 2: Write phase 4 — Valida**

```mdx
---
fase: 4
title: "Sal a la calle: valida antes de construir"
fase_label: "Fase 4 — Valida"
nucleo: true
nivel: todos
duracion: "3-4 sesiones"
entregable: "Hipótesis, un MVP mínimo y un informe de validación con la decisión: seguir o pivotar."
unidades_relacionadas:
  - { asignatura: "gpe-bach", unidad: 4, nota: "Metodología lean y validación de la idea." }
  - { asignatura: "eco-4eso", unidad: 1, nota: "Coste de oportunidad: validar barato antes de invertir." }
competencias_clave: [CPSAA, CE, STEM, CD]
competencias_especificas: []
estado: publicado
lang: es
---

import Callout from '@components/Callout.astro';
import Steps from '@components/Steps.astro';

Aquí está el corazón del método lean y la idea más contraintuitiva del proyecto:
**no construyáis la empresa entera para ver si funciona.** Lo barato es preguntar
primero. La mayoría de las ideas que parecen geniales en clase se caen en cuanto
sales a preguntar a gente real. Mejor descubrirlo ahora que tras meses de trabajo.

## Hipótesis: lo que creéis, dicho en voz alta

Vuestro proyecto se apoya en suposiciones. La más peligrosa suele ser: "la gente
tiene este problema y pagaría por nuestra solución". Eso no es un hecho, es una
**hipótesis**. Y las hipótesis se prueban.

<Callout tipo="aviso" titulo="El sesgo del entusiasmo">
Cuando preguntéis, la gente tiende a ser amable y deciros que sí. Preguntad por
lo que han hecho, no por lo que harían: "¿cuándo fue la última vez que tuviste
este problema?" vale más que "¿usarías nuestra app?".
</Callout>

## Qué es un MVP

Un **Producto Mínimo Viable** es la versión más pequeña posible que os permite
aprender algo real. No es un producto a medias: es un experimento. Un cartel, una
maqueta, una hoja de pedidos, un vídeo… lo que haga falta para que alguien
reaccione de verdad.

## Qué vais a hacer

<Steps>
1. **Escribid vuestra hipótesis más arriesgada** en una frase.
2. **Diseñad el experimento más barato** que la confirme o la tumbe.
3. **Salid a la calle.** Hablad con al menos diez personas que tengan el problema.
4. **Anotad lo que pasa**, no lo que esperabais que pasara.
5. **Decidid:** ¿los datos confirman la hipótesis (seguir) o la tumban (pivotar)?
</Steps>

## Pivotar no es fracasar

Si los datos dicen que no, cambiar de rumbo es la decisión inteligente. Las
mejores empresas pivotaron varias veces. Documentad el pivote: qué aprendisteis y
hacia dónde vais ahora.

## El entregable

Un **informe de validación**: la hipótesis, el experimento, lo que respondió la
gente real, y la decisión razonada de seguir o pivotar.

## Para evaluar esta fase

| Criterio | Insuficiente | Adecuado | Excelente |
|---|---|---|---|
| Hipótesis | No se identifica | Hipótesis clara | Identifica la suposición más arriesgada |
| Experimento | No se sale del aula | Se pregunta a algunas personas | MVP real probado con usuarios reales |
| Decisión | Ignora los datos | Decide con los datos | Pivota con criterio si los datos lo piden |
```

- [ ] **Step 3: Write phase 8 — Financiación**

```mdx
---
fase: 8
title: "¿De dónde sale el dinero?"
fase_label: "Fase 8 — Financiación e inversión"
nucleo: false
nivel: bach-fp
duracion: "3-4 sesiones"
entregable: "Plan de financiación: inversión inicial, fuentes y un análisis de coste y riesgo."
unidades_relacionadas:
  - { asignatura: "edmn-2bach", unidad: 9, nota: "La función financiera de la empresa." }
  - { asignatura: "eco-1bach", unidad: 10, nota: "Sistema financiero y fuentes de financiación." }
competencias_clave: [STEM, CD, CE, CPSAA]
competencias_especificas: []
estado: publicado
lang: es
---

import Callout from '@components/Callout.astro';
import Steps from '@components/Steps.astro';

Esta fase es de **profundización para Bachillerato y FP**: tiene sentido cuando ya
habéis validado la idea (Fase 4) y sabéis vuestros números (Fase 9). En el método
lean no se busca financiación antes de validar: sería invertir en algo que quizá
nadie quiere. Pero una vez validado, toca la pregunta de toda empresa real:
**¿de dónde sale el dinero para arrancar?**

## Cuánto necesitáis antes de cómo

Antes de buscar financiación hay que saber cuánto. La **inversión inicial** es
todo lo que necesitáis gastar antes de ingresar el primer euro: material,
equipos, local, permisos, primeras existencias. Sin esta cifra, hablar de
financiación es hablar al aire.

## Fuentes de financiación

<Steps>
1. **Recursos propios.** Lo que ponéis vosotros. Sin deuda, pero limitado.
2. **Familia y amigos.** Habitual al principio; con confianza pero con riesgo
   personal.
3. **Préstamo bancario.** Hay que devolverlo con intereses; exige un plan creíble.
4. **Subvenciones y ayudas.** Públicas, para emprendimiento joven; no se devuelven
   pero compiten y tardan.
5. **Inversores.** Aportan dinero a cambio de una parte de la empresa.
6. **Microfinanciación (crowdfunding).** La gente precompra o aporta; valida y
   financia a la vez.
</Steps>

<Callout tipo="idea" titulo="Coste y control">
Cada euro tiene un coste. La deuda se devuelve con intereses; el dinero de un
inversor se "paga" cediendo parte de la empresa y del control. No hay dinero
gratis: hay dinero con distintas condiciones.
</Callout>

## Qué vais a hacer

<Steps>
1. **Calculad la inversión inicial** de vuestro proyecto, partida por partida.
2. **Elegid una combinación de fuentes** realista para vuestro caso.
3. **Analizad coste y riesgo** de cada fuente que uséis.
4. **Justificad la decisión:** ¿por qué esta mezcla y no otra?
</Steps>

## El entregable

Un **plan de financiación**: la inversión inicial detallada, las fuentes
elegidas, y un análisis de qué cuesta y qué riesgo asume cada una.

## Para evaluar esta fase

| Criterio | Insuficiente | Adecuado | Excelente |
|---|---|---|---|
| Inversión inicial | No se calcula | Cifra global | Desglose realista partida a partida |
| Fuentes | Una sola, sin justificar | Varias fuentes | Mezcla justificada para el caso concreto |
| Coste y riesgo | No se analiza | Menciona intereses | Compara coste y control de cada fuente |
```

- [ ] **Step 4: Verify all three phases compile**

Run: `npx astro build 2>&1 | grep -iE "emprendimiento|error|Completed in"`
Expected: build succeeds; no MDX/YAML error. (Routes still 404 until Task 6, that's fine.)

- [ ] **Step 5: Commit**

```bash
git add src/content/emprendimiento/proyecto/
git commit -m "feat(emprendimiento): pilot phases Detecta, Valida y Financiación"
```

---

## Task 4: `FaseMeta` and `PuenteUnidades` components

**Files:**
- Create: `src/components/emprendimiento/FaseMeta.astro`
- Create: `src/components/emprendimiento/PuenteUnidades.astro`

- [ ] **Step 1: Write `FaseMeta.astro`**

```astro
---
/**
 * Metadata header for a phase page: nivel badge, duración, entregable,
 * and the LOMLOE competence chips. Pure presentational.
 */
import type { Nivel } from '@/lib/emprendimiento';

interface Props {
  faseLabel: string;
  nivel: Nivel;
  nucleo: boolean;
  duracion: string;
  entregable: string;
  competenciasClave: string[];
}
const { faseLabel, nivel, nucleo, duracion, entregable, competenciasClave } = Astro.props;
const nivelLabel = nivel === 'eso' ? 'ESO' : nivel === 'bach-fp' ? 'Batx · FP' : 'Todos los niveles';
---

<header class="fase-meta">
  <div class="badges">
    <span class={`badge badge--${nucleo ? 'nucleo' : 'profundo'}`}>
      {nucleo ? 'Núcleo' : 'Profundización'}
    </span>
    <span class="badge badge--nivel">{nivelLabel}</span>
    <span class="badge badge--dur">{duracion}</span>
  </div>
  <p class="entregable"><strong>Entregable:</strong> {entregable}</p>
  {competenciasClave.length > 0 && (
    <ul class="comps" aria-label="Competencias clave">
      {competenciasClave.map((c) => <li>{c}</li>)}
    </ul>
  )}
</header>

<style>
  .fase-meta { margin: 1.5rem 0 2rem; padding: 1.2rem 1.4rem; background: var(--color-paper); border: 1px solid var(--color-line); border-radius: 6px; }
  .badges { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.8rem; }
  .badge { font-family: var(--font-sans); font-size: 0.72rem; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; padding: 0.25rem 0.6rem; border-radius: 999px; }
  .badge--nucleo { background: var(--color-mustard-soft); color: var(--color-mustard-deep); }
  .badge--profundo { background: var(--color-terra-soft); color: var(--color-terra-deep); }
  .badge--nivel, .badge--dur { background: var(--color-bg-cream); color: var(--color-ink-soft); }
  .entregable { font-size: 0.98rem; color: var(--color-ink-soft); margin: 0; line-height: 1.55; }
  .comps { list-style: none; display: flex; flex-wrap: wrap; gap: 0.4rem; padding: 0; margin: 0.9rem 0 0; }
  .comps li { font-family: var(--font-mono); font-size: 0.72rem; color: var(--color-ink-mute); border: 1px solid var(--color-line); border-radius: 4px; padding: 0.15rem 0.45rem; }
</style>
```

- [ ] **Step 2: Write `PuenteUnidades.astro`**

```astro
---
/**
 * "Esto se trabaja en…" — bridges a phase to specific units of each asignatura,
 * the core of the project's transversality. Links to each unit page.
 */
import { ASIGNATURAS } from '@/lib/asignaturas';

interface Bridge { asignatura: string; unidad: number; nota?: string; }
interface Props { unidades: Bridge[]; }
const { unidades } = Astro.props;
---

{unidades.length > 0 && (
  <aside class="puente">
    <h3 class="puente__title">Esto se trabaja en…</h3>
    <ul class="puente__list">
      {unidades.map((u) => {
        const a = ASIGNATURAS[u.asignatura as keyof typeof ASIGNATURAS];
        const href = `/${u.asignatura}/libro/${String(u.unidad).padStart(2, '0')}`;
        return (
          <li>
            <a href={href} class="puente__link">
              <strong>{a ? a.shortLabel : u.asignatura}</strong> · Unidad {u.unidad}
            </a>
            {u.nota && <span class="puente__nota">{u.nota}</span>}
          </li>
        );
      })}
    </ul>
  </aside>
)}

<style>
  .puente { margin: 2.5rem 0 1rem; padding: 1.2rem 1.4rem; border-left: 4px solid var(--color-mustard); background: var(--color-bg-cream); border-radius: 0 6px 6px 0; }
  .puente__title { font-family: var(--font-sans); font-size: 0.8rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-mustard-deep); margin: 0 0 0.7rem; }
  .puente__list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.6rem; }
  .puente__link { color: var(--color-terra); text-decoration: none; font-weight: 500; }
  .puente__link:hover { text-decoration: underline; }
  .puente__nota { display: block; font-family: var(--font-serif); font-style: italic; font-size: 0.92rem; color: var(--color-ink-soft); margin-top: 0.15rem; }
</style>
```

- [ ] **Step 3: Verify they compile (typecheck via build later; for now a syntax build)**

Run: `npx astro check 2>&1 | grep -iE "FaseMeta|PuenteUnidades|error" | head` (if `astro check` OOMs, skip — Task 6 build is the real gate).
Expected: no errors referencing these files.

- [ ] **Step 4: Commit**

```bash
git add src/components/emprendimiento/
git commit -m "feat(emprendimiento): FaseMeta and PuenteUnidades components"
```

---

## Task 5: Per-phase route `[fase].astro`

**Files:**
- Create: `src/pages/emprendimiento/proyecto/[fase].astro`

- [ ] **Step 1: Write the route**

```astro
---
/**
 * A single phase of «De cero a empresa». Param `fase` is the zero-padded
 * phase number ("01", "04", "08"). Reuses the editorial prose styling from
 * the asignatura proyecto page.
 */
import BaseLayout from '@layouts/BaseLayout.astro';
import FaseMeta from '@components/emprendimiento/FaseMeta.astro';
import PuenteUnidades from '@components/emprendimiento/PuenteUnidades.astro';
import { getCollection, render } from 'astro:content';
import type { GetStaticPaths } from 'astro';

export const getStaticPaths = (async () => {
  const all = (await getCollection('proyectoTransversal')).filter(
    (e) => e.data.estado === 'publicado'
  );
  all.sort((a, b) => a.data.fase - b.data.fase);
  return all.map((entry, i) => ({
    params: { fase: String(entry.data.fase).padStart(2, '0') },
    props: {
      entry,
      prev: all[i - 1] ?? null,
      next: all[i + 1] ?? null,
    },
  }));
}) satisfies GetStaticPaths;

const { entry, prev, next } = Astro.props;
const d = entry.data;
const { Content } = await render(entry);
const faseHref = (e: typeof prev) =>
  e ? `/emprendimiento/proyecto/${String(e.data.fase).padStart(2, '0')}` : '#';
---

<BaseLayout title={`${d.fase_label} — De cero a empresa`} description={d.entregable}>
  <div class="container">
    <nav class="breadcrumb">
      <a href="/">Inicio</a> <span class="sep">›</span>
      <a href="/emprendimiento/">Emprendimiento</a> <span class="sep">›</span>
      <a href="/emprendimiento/proyecto/">De cero a empresa</a> <span class="sep">›</span>
      <span>{d.fase_label}</span>
    </nav>
  </div>

  <section class="body">
    <div class="container container--narrow">
      <span class="kicker">{d.fase_label}</span>
      <h1>{d.title}</h1>
      <FaseMeta
        faseLabel={d.fase_label}
        nivel={d.nivel}
        nucleo={d.nucleo}
        duracion={d.duracion}
        entregable={d.entregable}
        competenciasClave={d.competencias_clave}
      />
      <article class="prose">
        <Content />
      </article>
      <PuenteUnidades unidades={d.unidades_relacionadas} />

      <nav class="phase-nav">
        {prev ? <a href={faseHref(prev)} class="phase-nav__prev">← {prev.data.fase_label}</a> : <span />}
        {next ? <a href={faseHref(next)} class="phase-nav__next">{next.data.fase_label} →</a> : <span />}
      </nav>
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
  .kicker { font-family: var(--font-sans); font-size: 0.8rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-terra); }
  h1 { margin: 0.6rem 0 0; max-width: 24ch; }
  .prose { font-size: 1.05rem; line-height: 1.7; color: var(--color-ink); }
  .prose :global(h2) { font-family: var(--font-serif); font-size: 1.6rem; margin: 2.2em 0 0.7em; position: relative; padding-top: 1em; font-weight: 500; }
  .prose :global(h2::before) { content: ""; position: absolute; top: 0; left: 0; width: 2.5rem; height: 4px; background: var(--color-terra); border-radius: 999px; }
  .prose :global(h2:nth-of-type(2n)::before) { background: var(--color-mustard); }
  .prose :global(h3) { font-family: var(--font-serif); font-size: 1.25rem; margin: 1.6em 0 0.5em; font-weight: 500; }
  .prose :global(p) { margin: 0 0 1em; }
  .prose :global(ul), .prose :global(ol) { padding-left: 1.4rem; margin: 0 0 1em; }
  .prose :global(li) { margin-bottom: 0.4em; }
  .prose :global(ul li::marker) { color: var(--color-mustard); }
  .prose :global(table) { width: 100%; border-collapse: separate; border-spacing: 0; margin: 1.4em 0; font-size: 0.92rem; }
  .prose :global(th), .prose :global(td) { text-align: left; padding: 0.55em 0.75em; border-bottom: 1px solid var(--color-line-soft); vertical-align: top; }
  .prose :global(th) { font-family: var(--font-sans); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--color-terra-deep); background: var(--color-terra-soft); font-weight: 700; }
  .phase-nav { display: flex; justify-content: space-between; gap: 1rem; margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid var(--color-line); font-family: var(--font-sans); font-size: 0.95rem; }
  .phase-nav a { color: var(--color-terra); text-decoration: none; font-weight: 500; }
  .phase-nav a:hover { text-decoration: underline; }
</style>
```

- [ ] **Step 2: Build and verify the three phase pages render**

Run: `npx astro build 2>&1 | grep -E "emprendimiento/proyecto/(01|04|08)" ; echo "EXIT:${PIPESTATUS[0]}"`
Expected: three lines for `/emprendimiento/proyecto/01/`, `/04/`, `/08/`; build exit 0.

- [ ] **Step 3: Verify content + bridge link in generated HTML**

Run: `grep -oE "Esto se trabaja|/edmn-2bach/libro/09|De cero a empresa" dist/client/emprendimiento/proyecto/08/index.html | sort -u`
Expected: shows the bridge heading and the EDMN U9 link.

- [ ] **Step 4: Commit**

```bash
git add src/pages/emprendimiento/proyecto/\[fase\].astro
git commit -m "feat(emprendimiento): per-phase route for the transversal project"
```

---

## Task 6: Transversal map component + project index page

**Files:**
- Create: `src/components/emprendimiento/MapaTransversal.astro`
- Create: `src/pages/emprendimiento/proyecto/index.astro`

- [ ] **Step 1: Write `MapaTransversal.astro`**

A compact, static SVG-free diagram (CSS grid) showing the spine of phases crossing the asignaturas. Keep it editorial, no gradients.

```astro
---
/**
 * Transversal map: shows how the project's phases connect to the asignaturas.
 * Receives the published phases (already sorted) and renders a simple
 * editorial grid — spine of phases with the asignaturas each one touches.
 */
import { ASIGNATURAS } from '@/lib/asignaturas';

interface Bridge { asignatura: string; unidad: number; }
interface Fase { fase: number; fase_label: string; nucleo: boolean; unidades: Bridge[]; }
interface Props { fases: Fase[]; }
const { fases } = Astro.props;
---

<div class="mapa">
  <p class="mapa__lead">
    El proyecto es la espina dorsal; cada fase se apoya en unidades concretas de
    las asignaturas. Así se cruza el temario en lugar de ir suelto.
  </p>
  <ol class="mapa__spine">
    {fases.map((f) => (
      <li class={`mapa__node ${f.nucleo ? 'is-nucleo' : 'is-profundo'}`}>
        <span class="mapa__fase">{f.fase_label}</span>
        {f.unidades.length > 0 && (
          <span class="mapa__links">
            {f.unidades.map((u) => {
              const a = ASIGNATURAS[u.asignatura as keyof typeof ASIGNATURAS];
              return <span class="mapa__chip">{a ? a.shortLabel : u.asignatura} · U{u.unidad}</span>;
            })}
          </span>
        )}
      </li>
    ))}
  </ol>
</div>

<style>
  .mapa { margin: 2rem 0; }
  .mapa__lead { font-family: var(--font-serif); font-style: italic; font-size: 1.1rem; color: var(--color-ink-soft); max-width: 55ch; margin: 0 0 1.5rem; }
  .mapa__spine { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.6rem; }
  .mapa__node { display: flex; flex-wrap: wrap; align-items: baseline; gap: 0.6rem 1rem; padding: 0.7rem 1rem; border-left: 4px solid var(--color-mustard); background: var(--color-paper); border: 1px solid var(--color-line); border-left-width: 4px; border-radius: 0 6px 6px 0; }
  .mapa__node.is-profundo { border-left-color: var(--color-terra); }
  .mapa__fase { font-family: var(--font-serif); font-weight: 500; color: var(--color-ink); min-width: 16ch; }
  .mapa__links { display: flex; flex-wrap: wrap; gap: 0.35rem; }
  .mapa__chip { font-family: var(--font-mono); font-size: 0.72rem; color: var(--color-ink-mute); border: 1px solid var(--color-line); border-radius: 4px; padding: 0.12rem 0.4rem; }
</style>
```

- [ ] **Step 2: Write the project index page**

```astro
---
/**
 * «De cero a empresa» — project index. Shows the three itineraries, the
 * transversal map, the phase cards, and the workbook PDF download.
 */
import BaseLayout from '@layouts/BaseLayout.astro';
import MapaTransversal from '@components/emprendimiento/MapaTransversal.astro';
import { ITINERARIOS } from '@/lib/emprendimiento';
import { getCollection } from 'astro:content';

const published = (await getCollection('proyectoTransversal'))
  .filter((e) => e.data.estado === 'publicado')
  .sort((a, b) => a.data.fase - b.data.fase);

const fasesForMap = published.map((e) => ({
  fase: e.data.fase,
  fase_label: e.data.fase_label,
  nucleo: e.data.nucleo,
  unidades: e.data.unidades_relacionadas,
}));

const pdfHref = '/downloads/emprendimiento-proyecto.pdf';
---

<BaseLayout
  title="De cero a empresa — proyecto de emprendimiento transversal"
  description="Un proyecto modular y por niveles: el alumnado crea una empresa que resuelve un problema real, la valida con metodología lean y la pone a prueba. Transversal a todas las asignaturas."
>
  <div class="container">
    <nav class="breadcrumb">
      <a href="/">Inicio</a> <span class="sep">›</span>
      <a href="/emprendimiento/">Emprendimiento</a> <span class="sep">›</span>
      <span>De cero a empresa</span>
    </nav>
  </div>

  <section class="hero">
    <div class="container">
      <span class="kicker">Proyecto transversal</span>
      <h1>De cero a <span class="serif-italic-wonk accent">empresa</span>.</h1>
      <p class="lede">
        En equipo, vuestro alumnado crea una empresa que resuelve un problema real
        de su entorno, la valida saliendo a la calle y la pone a prueba con datos.
        Modular: lo montáis a vuestra medida.
      </p>
      <div class="downloads">
        <a class="download-cta" href={pdfHref} download>
          <span class="download-cta__icon" aria-hidden="true">↓</span>
          <span class="download-cta__text">
            <strong>Descargar el cuaderno del proyecto en PDF</strong>
            <span class="muted">Todas las fases publicadas · listo para el aula</span>
          </span>
        </a>
      </div>
    </div>
  </section>

  <section class="block">
    <div class="container container--narrow">
      <h2>Tres maneras de hacerlo</h2>
      <div class="itin-grid">
        {ITINERARIOS.map((it) => (
          <div class="itin">
            <h3>{it.label}</h3>
            <p>{it.descripcion}</p>
            {it.fases && <span class="itin__fases">Fases: {it.fases.join(' · ')}</span>}
          </div>
        ))}
      </div>
    </div>
  </section>

  <section class="block block--alt">
    <div class="container container--narrow">
      <h2>Cómo cruza las asignaturas</h2>
      <MapaTransversal fases={fasesForMap} />
    </div>
  </section>

  <section class="block">
    <div class="container container--narrow">
      <h2>Las fases</h2>
      {published.length === 0 ? (
        <p class="empty">Las fases se publicarán según se vayan completando.</p>
      ) : (
        <ul class="fase-cards">
          {published.map((e) => (
            <li class={`fase-card ${e.data.nucleo ? 'is-nucleo' : 'is-profundo'}`}>
              <a href={`/emprendimiento/proyecto/${String(e.data.fase).padStart(2, '0')}`}>
                <span class="fase-card__label">{e.data.fase_label}</span>
                <span class="fase-card__title">{e.data.title}</span>
                <span class="fase-card__meta">{e.data.nucleo ? 'Núcleo' : 'Profundización'} · {e.data.duracion}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
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
  .hero { padding: 1rem 0 clamp(2rem, 5vw, 3.5rem); }
  .kicker { font-family: var(--font-sans); font-size: 0.8rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-terra); }
  h1 { max-width: 18ch; margin: 0.6rem 0 0.8rem; }
  .accent { color: var(--color-terra); }
  .lede { font-family: var(--font-serif); font-style: italic; font-size: 1.35rem; color: var(--color-ink-soft); max-width: 54ch; margin: 1rem 0 1.5rem; line-height: 1.5; font-variation-settings: "SOFT" 80; }
  .downloads { display: flex; flex-wrap: wrap; gap: 1.2rem; }
  .download-cta { display: inline-flex; align-items: center; gap: 1rem; padding: 0.9rem 1.4rem 0.9rem 1.1rem; background: var(--color-terra); color: #fff; text-decoration: none; border-radius: 6px; transition: background .2s var(--ease-soft); }
  .download-cta:hover { background: var(--color-terra-deep); }
  .download-cta__icon { font-family: var(--font-serif); font-style: italic; font-size: 1.7rem; line-height: 1; color: var(--color-mustard-soft); }
  .download-cta__text { display: flex; flex-direction: column; gap: 0.15rem; }
  .download-cta__text strong { font-family: var(--font-sans); font-size: 0.95rem; font-weight: 600; }
  .download-cta__text .muted { font-family: var(--font-sans); font-size: 0.78rem; opacity: 0.75; }
  .block { padding: clamp(2rem, 5vw, 3.5rem) 0; }
  .block--alt { background: var(--color-bg-soft); border-top: 1px solid var(--color-line); border-bottom: 1px solid var(--color-line); }
  h2 { margin: 0 0 1.5rem; }
  .itin-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; }
  .itin { background: var(--color-paper); border: 1px solid var(--color-line); border-top: 3px solid var(--color-mustard); border-radius: 6px; padding: 1.3rem 1.4rem; }
  .itin h3 { margin: 0 0 0.5rem; font-size: 1.2rem; }
  .itin p { color: var(--color-ink-soft); font-size: 0.95rem; line-height: 1.55; margin: 0 0 0.7rem; }
  .itin__fases { font-family: var(--font-mono); font-size: 0.78rem; color: var(--color-ink-mute); }
  .fase-cards { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.2rem; }
  .fase-card a { display: flex; flex-direction: column; gap: 0.35rem; background: var(--color-paper); border: 1px solid var(--color-line); border-top: 3px solid var(--color-mustard); border-radius: 6px; padding: 1.2rem 1.3rem; text-decoration: none; color: inherit; transition: transform .18s var(--ease-soft), box-shadow .18s var(--ease-soft); }
  .fase-card.is-profundo a { border-top-color: var(--color-terra); }
  .fase-card a:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(42,31,24,0.08); }
  .fase-card__label { font-family: var(--font-sans); font-size: 0.72rem; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--color-mustard-deep); }
  .fase-card__title { font-family: var(--font-serif); font-size: 1.15rem; line-height: 1.2; color: var(--color-ink); }
  .fase-card__meta { font-family: var(--font-sans); font-size: 0.8rem; color: var(--color-ink-mute); }
  .empty { color: var(--color-ink-soft); font-style: italic; font-family: var(--font-serif); }
</style>
```

- [ ] **Step 3: Build and verify the index renders with itineraries + phases**

Run: `npx astro build 2>&1 | grep -E "emprendimiento/proyecto/index|Completed in" ; echo "EXIT:${PIPESTATUS[0]}"`
Expected: index built, exit 0.

Run: `grep -oE "Sprint ESO|Proyecto Batx/FP|A la carta|De cero a|Fase 1 — Detecta" dist/client/emprendimiento/proyecto/index.html | sort -u`
Expected: shows the 3 itineraries + project name + at least one phase card.

- [ ] **Step 4: Commit**

```bash
git add src/components/emprendimiento/MapaTransversal.astro src/pages/emprendimiento/proyecto/index.astro
git commit -m "feat(emprendimiento): project index with itineraries and transversal map"
```

---

## Task 7: Print route + PDF script

**Files:**
- Create: `src/pages/emprendimiento/proyecto/imprimir.astro`
- Create: `scripts/build-proyecto-transversal-pdf.mjs`
- Modify: `package.json`

- [ ] **Step 1: Write the print route**

Mirror of `src/pages/[asignatura]/proyecto/imprimir.astro` but for the flat collection. Copy that file's `<head>`/`<style is:global>` block verbatim (fonts, @page, cover, `.doc`, `.proyecto-sec`), changing only: the data source (`proyectoTransversal`, filtered+sorted by `fase`), the accent (use emprendimiento mustard), the cover title and eyebrow, and the doc-title string.

```astro
---
/**
 * Print-ready workbook for «De cero a empresa» (pagedjs-cli → PDF).
 * Mirror of [asignatura]/proyecto/imprimir.astro, adapted to the flat
 * proyectoTransversal collection (no asignatura param).
 */
import { getCollection, render } from 'astro:content';

const secciones = (await getCollection('proyectoTransversal'))
  .filter((e) => e.data.estado === 'publicado')
  .sort((a, b) => a.data.fase - b.data.fase);
const rendered = await Promise.all(secciones.map(async (s) => ({ s, ...(await render(s)) })));
const today = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

// Emprendimiento accent = mustard (matches the home E card).
const accent = { base: '#D4A24C', deep: '#A87A2A', soft: '#F5E5BC' };
---

<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>De cero a empresa — profedeeconomia</title>
    <meta name="robots" content="noindex,nofollow" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..700,0..100,0..1;1,9..144,300..700,0..100,0..1&display=swap" />
    <style is:inline>
      @font-face { font-family: 'Switzer'; src: url('/fonts/switzer/switzer-400.woff2') format('woff2'); font-weight: 400; font-display: swap; }
      @font-face { font-family: 'Switzer'; src: url('/fonts/switzer/switzer-500.woff2') format('woff2'); font-weight: 500; font-display: swap; }
      @font-face { font-family: 'Switzer'; src: url('/fonts/switzer/switzer-600.woff2') format('woff2'); font-weight: 600; font-display: swap; }
      @font-face { font-family: 'Switzer'; src: url('/fonts/switzer/switzer-700.woff2') format('woff2'); font-weight: 700; font-display: swap; }
    </style>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" />
    <style is:global>
      :root {
        --color-bg: #FBF6EC; --color-paper: #FFFFFF; --color-bg-cream: #F5EDD9;
        --color-ink: #2A1F18; --color-ink-soft: #5C4A3D; --color-ink-mute: #8A7868;
        --color-line: #E5D4BD; --color-line-soft: #EFE2CB;
        --color-terra: #C44E2C; --color-mustard: #D4A24C; --color-mustard-deep: #A87A2A;
        --font-serif: "Fraunces", Georgia, serif; --font-sans: "Switzer", -apple-system, sans-serif; --font-mono: "JetBrains Mono", monospace;
      }
      @page {
        size: 165mm 235mm; margin: 12mm 12mm 13mm 12mm;
        @top-left { content: string(doc-title); font-family: var(--font-sans); font-size: 8.5pt; letter-spacing: 0.06em; text-transform: uppercase; color: var(--color-ink-mute); }
        @top-right { content: "De cero a empresa"; font-family: var(--font-serif); font-style: italic; font-size: 9pt; color: var(--color-ink-mute); }
        @bottom-right { content: counter(page); font-family: var(--font-serif); font-size: 10pt; color: var(--book-accent); }
      }
      @page :first { @top-left { content: none; } @top-right { content: none; } @bottom-right { content: none; } }
      @page no-header { @top-left { content: none; } @top-right { content: none; } }
      * { box-sizing: border-box; }
      html { font-size: 9.5pt; }
      body { margin: 0; background: var(--color-bg); color: var(--color-ink); font-family: var(--font-serif); font-size: 9.5pt; line-height: 1.34; font-variation-settings: "SOFT" 50, "WONK" 0; }
      h1, h2, h3, h4 { font-family: var(--font-serif); font-weight: 500; color: var(--color-ink); line-height: 1.16; }
      p { margin: 0 0 0.45em; orphans: 2; widows: 2; -webkit-hyphens: auto; hyphens: auto; }
      strong { color: var(--color-ink); } em { font-style: italic; }
      ul, ol { padding-left: 1.2em; margin: 0 0 0.55em; } li { margin-bottom: 0.18em; }
      ul li::marker { color: var(--color-mustard); }
      table { width: 100%; border-collapse: separate; border-spacing: 0; margin: 0.8em 0; font-size: 8.6pt; page-break-inside: auto; }
      th, td { text-align: left; padding: 0.34em 0.55em; border-bottom: 1px solid var(--color-line-soft); vertical-align: top; }
      th { font-family: var(--font-sans); font-size: 7.5pt; text-transform: uppercase; letter-spacing: 0.06em; color: var(--book-accent-deep); background: var(--book-accent-soft); font-weight: 700; }
      blockquote { margin: 0.9em 0; padding: 0.6em 1em; border-left: 3px solid var(--color-mustard); background: var(--color-bg-cream); font-style: italic; color: var(--color-ink-soft); break-inside: avoid; }
      code { font-family: var(--font-mono); font-size: 0.92em; background: var(--color-bg-cream); padding: 0.05em 0.3em; border-radius: 2px; }

      .cover { page: no-header; break-after: page; height: 211mm; display: flex; flex-direction: column; justify-content: space-between; }
      .cover__top { display: flex; justify-content: space-between; align-items: flex-start; font-family: var(--font-sans); font-size: 8.5pt; letter-spacing: 0.12em; text-transform: uppercase; color: var(--book-accent); }
      .cover__top .mark { width: 20pt; height: 20pt; border-radius: 50%; background: var(--book-accent); position: relative; }
      .cover__top .mark::before { content: ""; position: absolute; inset: 4pt; background: var(--color-mustard); border-radius: 50%; }
      .cover__top .mark::after { content: ""; position: absolute; inset: 8pt; background: var(--color-bg); border-radius: 50%; }
      .cover__center { margin-top: -8mm; }
      .cover__eyebrow { font-family: var(--font-sans); font-size: 9.5pt; letter-spacing: 0.18em; text-transform: uppercase; color: var(--book-accent); font-weight: 700; margin-bottom: 4mm; }
      .cover__title { font-family: var(--font-serif); font-size: 40pt; line-height: 1.02; letter-spacing: -0.02em; color: var(--color-ink); margin: 0 0 4mm; font-weight: 400; font-variation-settings: "SOFT" 80; max-width: 16ch; }
      .cover__title em { font-style: italic; color: var(--book-accent); font-variation-settings: "SOFT" 100, "WONK" 1; }
      .cover__sub { font-family: var(--font-serif); font-style: italic; font-size: 15pt; color: var(--color-ink-soft); margin: 0; font-variation-settings: "SOFT" 80; }
      .cover__rule { width: 34mm; height: 5pt; background: var(--book-accent); border-radius: 999px; margin: 6mm 0; }
      .cover__bottom { display: flex; justify-content: space-between; align-items: flex-end; font-family: var(--font-sans); font-size: 9pt; color: var(--color-ink-soft); }
      .cover__bottom .stack { display: flex; flex-direction: column; gap: 2mm; }
      .cover__bottom .stack strong { color: var(--color-ink); font-weight: 600; font-size: 9.5pt; }
      .cover__bottom .stack .muted { font-size: 8pt; color: var(--color-ink-mute); letter-spacing: 0.06em; text-transform: uppercase; }

      .doc { string-set: doc-title attr(data-doc-title); padding-top: 3mm; }
      .doc h2 { font-size: 14pt; margin: 1.3em 0 0.5em; position: relative; padding-top: 0.7em; break-after: avoid; break-before: auto; }
      .doc h2::before { content: ""; position: absolute; top: 0; left: 0; width: 22mm; height: 3px; background: var(--book-accent); border-radius: 999px; }
      .doc h2:nth-of-type(2n)::before { background: var(--color-mustard); }
      .doc h3 { font-size: 11.5pt; margin: 1.1em 0 0.4em; break-after: avoid; }
      .proyecto-sec { break-before: page; }
      .proyecto-sec:first-of-type { break-before: avoid; }
      .proyecto-sec__label { font-family: var(--font-sans); font-size: 8pt; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--book-accent); }
    </style>
  </head>
  <style is:inline set:html={`body { --book-accent: ${accent.base}; --book-accent-deep: ${accent.deep}; --book-accent-soft: ${accent.soft}; }`}></style>
  <body>
    <section class="cover">
      <header class="cover__top"><span>profedeeconomia.es</span><span class="mark"></span></header>
      <div class="cover__center">
        <div class="cover__eyebrow">Proyecto de emprendimiento transversal</div>
        <h1 class="cover__title">De cero a <em>empresa</em></h1>
        <p class="cover__sub">Un proyecto modular para todas las asignaturas</p>
        <div class="cover__rule"></div>
      </div>
      <footer class="cover__bottom">
        <div class="stack"><span class="muted">Editorial</span><strong>profedeeconomia.es</strong></div>
        <div class="stack"><span class="muted">Material</span><strong>Emprendimiento</strong></div>
        <div class="stack"><span class="muted">Generado</span><strong>{today}</strong></div>
      </footer>
    </section>

    <section class="doc" data-doc-title="De cero a empresa">
      {rendered.map(({ s, Content }) => (
        <div class="proyecto-sec">
          <span class="proyecto-sec__label">{s.data.fase_label}</span>
          <Content />
        </div>
      ))}
    </section>

    <script is:inline>
      if (new URLSearchParams(location.search).has('preview')) {
        const s = document.createElement('script');
        s.src = 'https://unpkg.com/pagedjs/dist/paged.polyfill.js';
        document.body.appendChild(s);
      }
    </script>
  </body>
</html>
```

- [ ] **Step 2: Write the PDF script**

```js
// scripts/build-proyecto-transversal-pdf.mjs
#!/usr/bin/env node
/**
 * Build the print-ready workbook PDF for «De cero a empresa» from the
 * proyectoTransversal collection, via /emprendimiento/proyecto/imprimir.
 * Mirror of build-proyecto-pdf.mjs (single output, no per-subject loop).
 *
 * Usage: node scripts/build-proyecto-transversal-pdf.mjs
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { platform } from 'node:os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const PORT = 4330;
const BASE = `http://localhost:${PORT}`;

function run(cmd, args, opts = {}) {
  return new Promise((res, rej) => {
    const p = spawn(cmd, args, { stdio: 'inherit', shell: platform() === 'win32', ...opts });
    p.on('close', (code) => (code === 0 ? res() : rej(new Error(`${cmd} exited ${code}`))));
  });
}

async function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const r = await fetch(url);
      if (r.ok || r.status === 404) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server at ${url} did not start in ${timeoutMs}ms`);
}

async function main() {
  const distDir = resolve(root, 'dist/client');
  if (!existsSync(distDir)) {
    console.error('dist/client not found — run `npm run build` first.');
    process.exit(1);
  }
  const server = spawn('npx', ['serve', '-l', String(PORT), distDir], {
    shell: platform() === 'win32',
    stdio: 'ignore',
  });
  try {
    await waitForServer(BASE);
    const outDir = resolve(root, 'public/downloads');
    mkdirSync(outDir, { recursive: true });
    const url = `${BASE}/emprendimiento/proyecto/imprimir/?preview=1`;
    const out = join(outDir, 'emprendimiento-proyecto.pdf');
    console.log(`· emprendimiento → ${out}`);
    await run('npx', ['pagedjs-cli', url, '-o', out]);
  } finally {
    server.kill();
  }
}

main();
```

- [ ] **Step 3: Wire the script into package.json**

Add after the `"build:proyecto"` line:

```json
    "build:proyecto-transversal": "node scripts/build-proyecto-transversal-pdf.mjs",
```

And in `"build:all"`, insert `&& npm run build:proyecto-transversal` right after `&& npm run build:proyecto`:

```json
    "build:all": "npm run build && npm run build:pdf && npm run build:workbooks && npm run build:programaciones && npm run build:ebau && npm run build:proyecto && npm run build:proyecto-transversal && npm run build:slides",
```

- [ ] **Step 4: Build the site, then generate the PDF**

Run: `npx astro build 2>&1 | grep -E "proyecto/imprimir|Completed in" ; echo "EXIT:${PIPESTATUS[0]}"`
Expected: print route built, exit 0.

Run: `npm run build:proyecto-transversal`
Expected: `public/downloads/emprendimiento-proyecto.pdf` created (an "Error: se agotó el tiempo de espera" copy-step warning is non-fatal — verify the file exists).

Run: `test -f public/downloads/emprendimiento-proyecto.pdf && echo "PDF OK"`
Expected: `PDF OK`.

- [ ] **Step 5: Commit**

```bash
git add src/pages/emprendimiento/proyecto/imprimir.astro scripts/build-proyecto-transversal-pdf.mjs package.json public/downloads/emprendimiento-proyecto.pdf
git commit -m "feat(emprendimiento): print route + PDF builder for «De cero a empresa»"
```

---

## Task 8: Rewrite `/emprendimiento/` landing

**Files:**
- Modify: `src/pages/emprendimiento/index.astro` (full rewrite)

- [ ] **Step 1: Rewrite the landing**

Highlights GPE Bach (the pure-entrepreneurship subject) and the project as the two pillars of the section.

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
import { ASIGNATURAS } from '@/lib/asignaturas';

const gpe = ASIGNATURAS['gpe-bach'];
---

<BaseLayout
  title="Emprendimiento"
  description="La asignatura de emprendimiento puro (GPE) y «De cero a empresa», un proyecto transversal para llevar al aula en cualquier nivel."
>
  <div class="container">
    <nav class="breadcrumb"><a href="/">Inicio</a> <span class="sep">›</span> <span>Emprendimiento</span></nav>
  </div>

  <section class="hero">
    <div class="container">
      <span class="kicker">Material transversal</span>
      <h1><span class="serif-italic-wonk accent">Emprendimiento</span> en el aula.</h1>
      <p class="lede">
        El emprendimiento atraviesa todas nuestras asignaturas. Aquí están las dos
        puertas de entrada: la materia que lo trabaja a fondo y un proyecto para
        montar con el alumnado, sea cual sea tu nivel.
      </p>
    </div>
  </section>

  <section class="cards">
    <div class="container">
      <div class="card-grid">
        <a class="card card--proyecto" href="/emprendimiento/proyecto/">
          <span class="card__eyebrow">Proyecto transversal</span>
          <h2 class="card__title serif">De cero a empresa</h2>
          <p class="card__desc">
            En equipo, el alumnado crea una empresa que resuelve un problema real,
            la valida saliendo a la calle y la pone a prueba con datos. Modular:
            de un sprint de un mes al curso entero.
          </p>
          <span class="card__cta">Ver el proyecto →</span>
        </a>

        <a class="card card--gpe" href={`/${gpe.slug}/`}>
          <span class="card__eyebrow">Asignatura</span>
          <h2 class="card__title serif">{gpe.title}</h2>
          <p class="card__desc">
            La materia de emprendimiento puro de Bachillerato: del equipo y la idea
            al pitch final, con libro, cuaderno de proyecto, actividades y tests.
          </p>
          <span class="card__cta">Ir a la asignatura →</span>
        </a>
      </div>
    </div>
  </section>
</BaseLayout>

<style>
  .container { max-width: 1240px; margin: 0 auto; padding: 0 clamp(1.5rem, 4vw, 3rem); }
  .breadcrumb { font-size: 0.92rem; color: var(--color-ink-mute); margin: 2rem 0; }
  .breadcrumb a { color: var(--color-ink-mute); text-decoration: none; }
  .breadcrumb a:hover { color: var(--color-terra); }
  .breadcrumb .sep { margin: 0 0.5em; color: var(--color-mustard); }
  .hero { padding: 1rem 0 clamp(2rem, 5vw, 3.5rem); }
  .kicker { font-family: var(--font-sans); font-size: 0.8rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-terra); }
  h1 { max-width: 22ch; margin: 0.6rem 0 0.8rem; }
  .accent { color: var(--color-terra); }
  .lede { font-family: var(--font-serif); font-style: italic; font-size: 1.4rem; color: var(--color-ink-soft); max-width: 56ch; margin: 1rem 0; line-height: 1.5; font-variation-settings: "SOFT" 80; }
  .cards { padding: 0 0 clamp(3rem, 7vw, 6rem); }
  .card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
  .card { display: block; background: #fff; border: 1px solid var(--color-line); border-top: 3px solid var(--color-mustard); padding: 1.6rem 1.75rem 1.4rem; text-decoration: none; color: inherit; transition: box-shadow 0.18s ease, transform 0.18s ease, border-color 0.18s ease; }
  .card--gpe { border-top-color: #8C2F39; }
  .card:hover { box-shadow: 0 4px 18px rgba(42,31,24,0.08); transform: translateY(-2px); }
  .card__eyebrow { font-size: 0.78rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-mustard-deep); font-weight: 600; }
  .card--gpe .card__eyebrow { color: #8C2F39; }
  .card__title { font-size: 1.6rem; line-height: 1.1; margin: 0.5rem 0 0.75rem; font-variation-settings: "SOFT" 80; }
  .card__desc { color: var(--color-ink-soft); font-size: 1rem; line-height: 1.6; margin: 0 0 1rem; }
  .card__cta { font-size: 0.9rem; font-weight: 600; color: var(--color-terra); }
</style>
```

- [ ] **Step 2: Build and verify the landing**

Run: `npx astro build 2>&1 | grep -E "emprendimiento/index|Completed in" ; echo "EXIT:${PIPESTATUS[0]}"`
Expected: built, exit 0.

Run: `grep -oE "De cero a empresa|Gestión de Proyectos|en preparación" dist/client/emprendimiento/index.html | sort -u`
Expected: shows "De cero a empresa" + the GPE title; NO "en preparación".

- [ ] **Step 3: Commit**

```bash
git add src/pages/emprendimiento/index.astro
git commit -m "feat(emprendimiento): rewrite landing — GPE + «De cero a empresa»"
```

---

## Task 9: Full build + test suite gate

**Files:** none (verification only)

- [ ] **Step 1: Run the full test suite**

Run: `npx vitest run 2>&1 | tail -15`
Expected: all tests pass, including the 8 new `emprendimiento` tests.

- [ ] **Step 2: Full production build**

Run: `npx astro build 2>&1 | tail -20`
Expected: `✓ Completed`, no errors. Confirm the new routes appear: `/emprendimiento/`, `/emprendimiento/proyecto/`, `/emprendimiento/proyecto/{01,04,08}/`, `/emprendimiento/proyecto/imprimir/`.

- [ ] **Step 3: Commit (only if anything changed; otherwise skip)**

```bash
git status --short
```

---

## Self-Review (completed during planning)

**Spec coverage:**
- Nombre «De cero a empresa» → Tasks 6, 7, 8. ✓
- Tronco de 11 fases + ★ → data model in Task 2; 3 pilot phases in Task 3; rest are future tandas (in scope per spec). ✓
- Itinerarios (Sprint ESO / Batx-FP / a la carta) → Task 1 (`ITINERARIOS`) + Task 6 (index). ✓
- Núcleo/profundo + nivel → schema (Task 2), `FaseMeta` badge (Task 4), card styling (Task 6). ✓
- Mapa transversal + puentes a unidades → `PuenteUnidades` (Task 4) + `MapaTransversal` (Task 6); verified against catalogue (Task 3 Step 0). ✓
- Web por fases + PDF (patrón GPE) → routes (Tasks 5-6) + print route & script (Task 7). ✓
- Rúbricas por fase + competencias LOMLOE → tables in each phase MDX (Task 3) + competence chips (Task 4). ✓
- GPE destacada en /emprendimiento/ → Task 8. ✓
- ★ venta valiente, 8 fases restantes, componentes interactivos → out of scope this tanda (per spec). ✓

**Placeholder scan:** No TBD/TODO in steps; the only "Pendiente de redacción" is the temporary fixture in Task 2, replaced in Task 3 Step 1. ✓

**Type consistency:** `fasesForItinerario`, `ITINERARIOS`, `Nivel`, `FaseLike` used consistently across Tasks 1/6. Frontmatter field names (`fase`, `fase_label`, `nucleo`, `nivel`, `duracion`, `entregable`, `unidades_relacionadas`, `competencias_clave`) identical across Tasks 2/3/4/5/6/7. Route param `fase` is the zero-padded string everywhere. ✓
