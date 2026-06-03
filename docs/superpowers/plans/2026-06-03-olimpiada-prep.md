# Sección «Olimpiada de Economía» — Implementation Plan (v1: marco + núcleo)

> REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Spec: docs/superpowers/specs/2026-06-03-olimpiada-prep-design.md

**Goal:** Build a `/olimpiada/` prep mini-suite (positioned in Bachillerato): hub+guía, simulacros (3 official PDFs), fichas-resumen (6 core blocks), banco de preguntas (QuizPlayer per block), taller de textos (1-2), lecturas. Level 2BACH+/1º carrera. Then expand after merge.

**Architecture:** `src/lib/olimpiada.ts` (BLOQUES reusing familia-grouping, SIMULACROS, LECTURAS, GUIA) + banco data + 2 MDX collections. Standalone `/olimpiada/` routes. Reuses calculators (PuntoMuerto/Equilibrio/Elasticidad/ADAS) in fichas and `QuizPlayer` in banco. Linked from BACH nav + EDMN 2BACH/Eco 1BACH hubs.

---

## Task 1: Library + collections + banco data (+ tests)

**Files:** `src/lib/olimpiada.ts` (+test), `src/lib/olimpiada/banco.ts` (+test), `src/content.config.ts` (modify).

- [ ] **Step 1: Create `src/lib/olimpiada.ts`** — full code:

```ts
/**
 * Data and helpers for the «Olimpiada de Economía» prep section (Bachillerato).
 * Thematic blocks reuse the generic familia-grouping (shared with Dinámicas etc.).
 * Color tokens reuse global.css — no new colors.
 */
import type { Familia } from './familia-grouping';
export { groupByFamilia } from './familia-grouping';
export type { Familia, FamiliaGroup, HasFamilia } from './familia-grouping';

export const BLOQUES: Familia[] = [
  { slug: 'fpp',                 label: 'FPP y coste de oportunidad',        intro: 'Frontera de posibilidades, eficiencia y coste de oportunidad.', colorVar: '--color-taller3' },
  { slug: 'oferta-demanda',      label: 'Oferta, demanda y elasticidad',     intro: 'Equilibrio de mercado, desplazamientos y elasticidades.',       colorVar: '--color-eco1' },
  { slug: 'punto-muerto',        label: 'Producción, costes y punto muerto', intro: 'Costes, umbral de rentabilidad y la cuenta de resultados.',     colorVar: '--color-edmn' },
  { slug: 'politica-economica',  label: 'Política monetaria y fiscal',       intro: 'Objetivos, instrumentos y efectos sobre precios, producción y empleo.', colorVar: '--color-ipe2' },
  { slug: 'mercado-trabajo',     label: 'Mercado de trabajo y desempleo',    intro: 'EPA, tasas, tipos de paro y el funcionamiento del mercado laboral.', colorVar: '--color-fopp' },
  { slug: 'contabilidad',        label: 'Contabilidad y rentabilidad',       intro: 'Balance, resultado, fondo de maniobra y ratios de rentabilidad.', colorVar: '--color-gpe' },
];

export const BLOQUE_SLUGS = BLOQUES.map((b) => b.slug) as [string, ...string[]];
const BY_SLUG = new Map(BLOQUES.map((b) => [b.slug, b]));
export function bloqueMeta(slug: string): Familia {
  const b = BY_SLUG.get(slug);
  if (!b) throw new Error(`unknown bloque: ${slug}`);
  return b;
}

export interface Simulacro { slug: string; title: string; convocatoria: string; anio: number; pdf: string; oficial: boolean; }
export const SIMULACROS: Simulacro[] = [
  { slug: 'cv-2014', title: 'Fase Local C. Valenciana 2014', convocatoria: 'Fase Local · C. Valenciana', anio: 2014, pdf: '/olimpiada/examen-olimpiadas-1.pdf', oficial: true },
  { slug: 'cv-2018', title: 'Fase Local C. Valenciana 2018', convocatoria: 'Fase Local · C. Valenciana', anio: 2018, pdf: '/olimpiada/examen-olimpiadas-3.pdf', oficial: true },
  { slug: 'cv-2021', title: 'Fase Local C. Valenciana 2021', convocatoria: 'Fase Local · C. Valenciana', anio: 2021, pdf: '/olimpiada/examen-olimpiadas-2.pdf', oficial: true },
  { slug: 'megaexamen', title: 'Megaexamen de práctica', convocatoria: 'Material de práctica del profesor', anio: 0, pdf: '/olimpiada/megaexamen-olimpiadas.pdf', oficial: false },
];

export interface Lectura { categoria: string; titulo: string; autor: string; comentario: string; }
export const LECTURAS: Lectura[] = [ /* populated in Task 5 from RECOMENDACIONES */ ];

export interface ParteGuia { nombre: string; puntos: string; tiempo?: string; descripcion: string; }
export const GUIA: { duracion: string; total: string; partes: ParteGuia[] } = {
  duracion: '2 horas y 30 minutos',
  total: '8 puntos',
  partes: [
    { nombre: 'Parte I — Teoría', puntos: '4,5 pts (3 × 1,5)', descripcion: 'Elige 3 de 6 preguntas de desarrollo. Definir conceptos y representarlos gráficamente; razonar la veracidad de afirmaciones.' },
    { nombre: 'Parte II — Ejercicio', puntos: '3 pts', descripcion: 'Elige 1 de 2 ejercicios numéricos. El punto muerto aparece casi siempre; también FPP, oferta-demanda algebraica o contabilidad.' },
    { nombre: 'Parte III — Comentario de texto', puntos: '2,5 pts', descripcion: 'Texto de prensa económica con preguntas que conectan cada párrafo con un concepto del temario.' },
  ],
};
```

- [ ] **Step 2: Create `src/lib/olimpiada/banco.ts`** — the question type (compatible with QuizPlayer's `Pregunta`) + array. Start with a small seed (Task 6 fills it):

```ts
/** A banco question: extends QuizPlayer's Pregunta with the thematic block + level. */
export interface PreguntaBanco {
  bloque: string;            // one of BLOQUE_SLUGS
  nivel: 1 | 2 | 3;          // 1 concepto, 2 aplicación, 3 olimpiada
  enunciado: string;
  opciones: string[];
  correcta: number;          // index into opciones
  explicacion?: string;
}
export const BANCO: PreguntaBanco[] = [ /* populated in Task 6, ~10-15 per core block */ ];
export function preguntasDeBloque(bloque: string): PreguntaBanco[] {
  return BANCO.filter((p) => p.bloque === bloque);
}
```

- [ ] **Step 3: Tests** — `src/lib/olimpiada.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { BLOQUES, BLOQUE_SLUGS, bloqueMeta, SIMULACROS, GUIA } from './olimpiada.ts';

describe('BLOQUES', () => {
  it('has 6 core blocks with a color token each', () => {
    expect(BLOQUES).toHaveLength(6);
    for (const b of BLOQUES) expect(b.colorVar).toMatch(/^--color-[a-z0-9-]+$/);
  });
});
describe('bloqueMeta', () => {
  it('resolves and throws', () => {
    expect(bloqueMeta('fpp').label).toContain('FPP');
    expect(() => bloqueMeta('nope')).toThrow(/unknown bloque/i);
  });
});
describe('SIMULACROS', () => {
  it('lists the 3 official exams + megaexamen, each with a pdf path', () => {
    expect(SIMULACROS.filter((s) => s.oficial)).toHaveLength(3);
    for (const s of SIMULACROS) expect(s.pdf).toMatch(/^\/olimpiada\/.*\.pdf$/);
  });
});
describe('GUIA', () => {
  it('describes the 3 parts', () => { expect(GUIA.partes).toHaveLength(3); });
});
```
And `src/lib/olimpiada/banco.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { BANCO, preguntasDeBloque } from './banco.ts';
import { BLOQUE_SLUGS } from '../olimpiada.ts';

describe('BANCO', () => {
  it('every question is well-formed', () => {
    for (const p of BANCO) {
      expect(BLOQUE_SLUGS).toContain(p.bloque);
      expect(p.opciones.length).toBeGreaterThanOrEqual(2);
      expect(p.correcta).toBeGreaterThanOrEqual(0);
      expect(p.correcta).toBeLessThan(p.opciones.length);
    }
  });
  it('preguntasDeBloque filters by block', () => {
    if (BANCO.length) expect(preguntasDeBloque(BANCO[0].bloque).length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 4: Collections in `src/content.config.ts`** — import `BLOQUE_SLUGS` from `./lib/olimpiada`; define and register:
```ts
const olimpiadaFichas = defineCollection({
  loader: glob({ pattern: 'olimpiada/fichas/**/*.{md,mdx}', base: './src/content' }),
  schema: z.object({
    title: z.string(), bloque: z.enum(BLOQUE_SLUGS), orden: z.number().int().min(0),
    resumen: z.string(), conceptos_clave: z.array(z.string()).default([]),
    herramienta: z.enum(['PuntoMuerto', 'Equilibrio', 'Elasticidad', 'ADASSimulator']).optional(),
    preguntas_tipicas: z.array(z.string()).default([]),
    competencias_clave: z.array(z.string()).default([]),
    lang: z.enum(LANGS).default('es'), estado: z.enum(ESTADOS).default('borrador'),
  }),
});
const olimpiadaTextos = defineCollection({
  loader: glob({ pattern: 'olimpiada/textos/**/*.{md,mdx}', base: './src/content' }),
  schema: z.object({
    title: z.string(), fuente: z.string(), fecha: z.string(), descripcion: z.string(),
    orden: z.number().int().min(0), temas: z.array(z.string()).default([]),
    bloque: z.enum(BLOQUE_SLUGS).optional(),
    lang: z.enum(LANGS).default('es'), estado: z.enum(ESTADOS).default('borrador'),
  }),
});
// add olimpiadaFichas, olimpiadaTextos to `export const collections`.
```

- [ ] **Step 5: tests pass + `astro check` no new errors. Commit** `feat(olimpiada): library, collections schema and banco data scaffold`.

---

## Task 2: Copy the simulacro PDFs to public/

- [ ] Create `public/olimpiada/` and copy the 4 PDFs (rename to web-safe lowercase-hyphen names matching SIMULACROS `pdf` paths):
  - `Examen Olimpiadas 1.pdf` → `public/olimpiada/examen-olimpiadas-1.pdf`
  - `Examen Olimpiadas 2.pdf` → `public/olimpiada/examen-olimpiadas-2.pdf`
  - `Examen Olimpiadas 3.pdf` → `public/olimpiada/examen-olimpiadas-3.pdf`
  - `MEGAEXAMEN Olimpiadas.pdf` → `public/olimpiada/megaexamen-olimpiadas.pdf`
  Source dir: `C:\Users\paumo\Desktop\Docència\Assignatures\EDMN 2BACH\Olimpiades\`.
  (Use `Copy-Item` in PowerShell or `cp`.) Commit `feat(olimpiada): add simulacro PDFs`.

---

## Task 3: Pages + components

**Files:** `src/components/olimpiada/{GuiaExamen,FichaMeta,SimulacroCard,BancoIsland}.astro|tsx`, and pages under `src/pages/olimpiada/`.

Build these following the established hub/detail patterns (read `src/pages/debates/index.astro` and `src/pages/debates/[familia]/[slug].astro` for the card/detail style and CSS; reuse the same classes/tokens):

- [ ] **`/olimpiada/index.astro`** — hub: hero + the **guía** (render `GUIA` parts in a styled list/table) + a card grid linking to the 5 sub-areas (Simulacros, Fichas, Banco, Textos, Lecturas), each with a short description.
- [ ] **`/olimpiada/simulacros/index.astro`** — list `SIMULACROS` as cards (title, convocatoria, año, «Ver PDF» + «Descargar» linking to `s.pdf`), plus a «Cómo usar los simulacros» note (timed, the 3-part format from GUIA).
- [ ] **`/olimpiada/fichas/index.astro`** — `getCollection('olimpiadaFichas')` filtered published, grouped by `bloque` via `groupByFamilia(BLOQUES, …)` (map id→slug, `{...data, familia: data.bloque}`), cards → `/olimpiada/fichas/{slug}/`.
- [ ] **`/olimpiada/fichas/[slug].astro`** — single ficha: header (bloque + title + resumen), the MDX body (`<Content/>`), conceptos_clave, preguntas_tipicas list, and — if `herramienta` is set — embed the matching calculator island via a small dispatch (import the 4 calc components; render the one matching `data.herramienta` with `client:load`). Single-param route; getStaticPaths over the collection.
- [ ] **`/olimpiada/banco/index.astro`** — lets the user pick a bloque (chips) and renders `QuizPlayer` with `preguntasDeBloque(bloque)` mapped to `Pregunta` shape (`{enunciado, opciones, correcta, explicacion}`), `storageKey={'olimpiada-banco-'+bloque}`. A Preact island `BancoIsland.tsx` holds the block selector + QuizPlayer (import QuizPlayer from `@components/QuizPlayer.tsx`).
- [ ] **`/olimpiada/textos/index.astro`** + **`/olimpiada/textos/[slug].astro`** — list + detail of `olimpiadaTextos` (the taller). Detail: source/fecha, the text + questions (MDX body), and a «cómo afrontar el comentario» note on the index.
- [ ] **`/olimpiada/lecturas/index.astro`** — render `LECTURAS` grouped by `categoria` (libros, conductual, teoría de juegos, clásicos, finanzas, marketing; webs/vídeos), each with autor + comentario.

Type-check after each; reuse only existing CSS tokens; no emojis; accents correct. Commit `feat(olimpiada): hub, sub-area pages and components`.

---

## Task 4: Navigation (within BACH)

- [ ] In `src/components/SiteHeader.astro` BACH dropdown (after the 1º/2º bach asignaturas), add a destacado link «Olimpiada de Economía» → `/olimpiada/` (a distinct styled `<a>` so it reads as a special program, not an asignatura).
- [ ] Add a card/link to `/olimpiada/` from the EDMN 2BACH and Eco 1BACH asignatura hubs (find where each `/[asignatura]/index` lists its sections; add an «Olimpiada de Economía» entry shown only for these two slugs, or a small note). Keep it minimal and consistent.
- [ ] `astro check`; commit `feat(olimpiada): surface in BACH nav and bach econ hubs`.

---

## Task 5: Lecturas content

- [ ] Populate `LECTURAS` in `src/lib/olimpiada.ts` from the RECOMENDACIONES analysis: categorías (Economía general, Economía conductual, Teoría de juegos, Clásicos del pensamiento, Finanzas, Marketing y empresa) + a «Webs y vídeos» note. Each `{categoria, titulo, autor, comentario}` with a 1-line editorial comment. ~20-25 entries. Commit `feat(olimpiada): reading list from recomendaciones`.

---

## Task 6: Core content — 6 fichas + banco + 2 textos

Produced by subagents (one per ficha-block; banco from the megaexamen; textos). Level **2BACH+/1º carrera**, rigorous, accurate, no fabricated stats, no emojis, accents.

- [ ] **6 fichas** `src/content/olimpiada/fichas/{bloque}/01-…mdx` (or `{nn}-{slug}.mdx`), one per core bloque: FPP, oferta-demanda, punto-muerto, politica-economica, mercado-trabajo, contabilidad. Each: frontmatter (title, bloque, orden 1, resumen, conceptos_clave, `herramienta` where it applies — punto-muerto→PuntoMuerto, oferta-demanda→Equilibrio (and mention Elasticidad), politica-economica→ADASSimulator —, preguntas_tipicas (3-4 real exam-style), competencias_clave, estado: publicado). Body: rigorous summary + the **canonical graph** (inline SVG or described) + key relations + worked mini-example. For punto-muerto include the formula derivation (the "ejercicio estrella").
- [ ] **Banco**: fill `BANCO` in `src/lib/olimpiada/banco.ts` with ~10-15 questions per core bloque (≈70-90 total) drawn from the MEGAEXAMEN (`C:\Users\paumo\Desktop\Docència\Assignatures\EDMN 2BACH\Olimpiades\MEGAEXAMEN Olimpiadas.pdf`, pages 1-27 test bank). Each: `{bloque, nivel, enunciado, opciones[3-4], correcta, explicacion}`. Verify `correcta` is right.
- [ ] **2 textos** `src/content/olimpiada/textos/01-…mdx`, `02-…mdx`: one from the SVB case (megaexamen pp.31-35) and one press-style economic text (e.g. sector agrario / inflación), each with frontmatter (title, fuente, fecha, descripcion, temas, bloque?) and body = el texto + 4-5 preguntas estilo Parte III + pauta breve.
- [ ] Tests green; commit per logical unit.

---

## Task 7: Build + PR + merge

- [ ] `npx astro build` — `Complete!`; verify `/olimpiada/` and sub-areas prerender; the 4 PDFs are served from `dist/client/olimpiada/*.pdf`. Dev smoke: hub guía, a ficha with its calculator, banco quiz, a texto, lecturas, and the BACH nav link.
- [ ] Push, PR → dev, Vercel green, merge dev→main, verify production (`/olimpiada/` 200, PDFs 200).

---

## After merge — EXPANSION (Pau asked to develop the sections fully, not stop at the core)
Follow-up phases, each its own PR: (a) fichas for ALL remaining blocks (estructuras de mercado, macro PIB/inflación, sistema financiero, comercio internacional, empresa, fallos de mercado); (b) banco ampliado (more questions, all blocks); (c) more textos (varias convocatorias / actualidad). Same quality bar + review.

## Self-review notes
- Reuse `QuizPlayer` (Pregunta = {enunciado, opciones, correcta, explicacion?}) — map banco questions to it; storageKey per block.
- Reuse the 4 calculators in fichas; familia-grouping for fichas/blocks.
- NOT in «Otros»/home strip; surfaced in BACH nav + the two bach econ hubs.
- No new colors; no pictographic emojis; accents correct; rigorous 2BACH+/1º-carrera level.
- No stray `.ts` under `src/pages/olimpiada/`.
