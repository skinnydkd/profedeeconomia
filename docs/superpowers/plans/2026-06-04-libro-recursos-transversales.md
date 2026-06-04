# Referencias transversales en los libros — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mostrar en cada unidad de los libros un cajón de recursos transversales relacionados (derivado del índice inverso de `unidades_relacionadas` ya existente) y, en unidades clave, incrustar un recurso inline.

**Architecture:** Un helper PURO (`recursos-relacionados.ts`) construye un índice `Map<asignatura#unidad → grupos por tipo>` a partir de registros normalizados; un resolutor (`recursos-relacionados-sources.ts`) lee las colecciones/registros y los normaliza; un componente Astro (`RecursosRelacionados.astro`) pinta el cajón al final de la página de unidad, más un cierre universal con Cajút. Fase B añade `RecursoDestacado.astro` y una pasada editorial de incrustados inline.

**Tech Stack:** Astro 5 content collections, TypeScript, Preact islands (HerramientaIsland), Vitest.

---

## File Structure

- `src/lib/recursos-relacionados.ts` — **NUEVO**. Tipos + `buildIndiceRecursos` + `recursosDeUnidad`. Puro (sin imports de astro:content) → testeable.
- `src/lib/recursos-relacionados.test.ts` — **NUEVO**. Tests del helper puro.
- `src/lib/recursos-relacionados-sources.ts` — **NUEVO**. `collectRecursoEntradas()`: lee colecciones/registros y devuelve `RecursoEntrada[]` normalizados (resuelve href + color).
- `src/components/libro/RecursosRelacionados.astro` — **NUEVO**. El cajón «Para el aula» + cierre Cajút.
- `src/components/libro/RecursoDestacado.astro` — **NUEVO (Fase B)**. Tarjeta inline para una dinámica/debate destacada.
- `src/pages/[asignatura]/libro/[unidad].astro` — **MODIFICAR**. Construir índice y montar el cajón tras la navegación.
- Cuerpos MDX de unidades clave en `src/content/asignaturas/*/libro/*.mdx` — **MODIFICAR (Fase B)**. Incrustados inline.

---

# FASE A — Backbone (cajón automático en las 88 unidades)

## Task A1: Helper puro del índice inverso

**Files:**
- Create: `src/lib/recursos-relacionados.ts`
- Test: `src/lib/recursos-relacionados.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/recursos-relacionados.test.ts
import { describe, it, expect } from 'vitest';
import { buildIndiceRecursos, recursosDeUnidad, type RecursoEntrada } from './recursos-relacionados.ts';

const entradas: RecursoEntrada[] = [
  { tipo: 'juego', slug: 'econrisk', title: 'Econrisk', href: '/juegos/econrisk/', familiaColorVar: '--color-terra',
    unidades: [{ asignatura: 'eco-1bach', unidad: 1, nota: 'Escuelas de pensamiento.' }] },
  { tipo: 'dinamica', slug: '01-tragedia-comunes', title: 'La tragedia de los comunes', href: '/dinamicas/decisiones-comunes/01-tragedia-comunes/', familiaColorVar: '--color-taller3',
    unidades: [{ asignatura: 'eco-1bach', unidad: 6 }, { asignatura: 'eeae-bach', unidad: 3 }] },
];

describe('buildIndiceRecursos / recursosDeUnidad', () => {
  const idx = buildIndiceRecursos(entradas);

  it('agrupa por asignatura#unidad y por tipo, conservando la nota de cada vínculo', () => {
    const r = recursosDeUnidad(idx, 'eco-1bach', 1);
    expect(r.juego).toHaveLength(1);
    expect(r.juego[0].title).toBe('Econrisk');
    expect(r.juego[0].nota).toBe('Escuelas de pensamiento.');
    expect(r.dinamica).toHaveLength(0);
  });

  it('un mismo recurso aparece en cada unidad que referencia', () => {
    expect(recursosDeUnidad(idx, 'eco-1bach', 6).dinamica).toHaveLength(1);
    expect(recursosDeUnidad(idx, 'eeae-bach', 3).dinamica[0].slug).toBe('01-tragedia-comunes');
  });

  it('una unidad sin recursos devuelve todos los grupos vacíos, sin excepción', () => {
    const r = recursosDeUnidad(idx, 'fopp-4eso', 99);
    expect(r.dinamica).toEqual([]);
    expect(r.juego).toEqual([]);
    expect(r.herramienta).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/recursos-relacionados.test.ts`
Expected: FAIL — `recursos-relacionados.ts` does not exist / exports undefined.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/lib/recursos-relacionados.ts
/**
 * Inverse index book-unit -> related transversal resources.
 * PURE module (no astro:content imports) so it can be unit-tested.
 * Sources are normalised into RecursoEntrada[] by recursos-relacionados-sources.ts.
 */
export type TipoRecurso =
  | 'dinamica' | 'debate' | 'proyecto' | 'herramienta' | 'emprendimiento' | 'juego';

export interface UnidadRef { asignatura: string; unidad: number; nota?: string; }

export interface RecursoEntrada {
  tipo: TipoRecurso;
  slug: string;
  title: string;
  href: string;
  familiaColorVar: string;
  unidades: UnidadRef[];
}

export interface RecursoRef {
  tipo: TipoRecurso;
  slug: string;
  title: string;
  href: string;
  familiaColorVar: string;
  nota?: string;
}

export type RecursosDeUnidad = Record<TipoRecurso, RecursoRef[]>;

const TIPOS: TipoRecurso[] = ['dinamica', 'debate', 'proyecto', 'herramienta', 'emprendimiento', 'juego'];

function emptyGroups(): RecursosDeUnidad {
  return { dinamica: [], debate: [], proyecto: [], herramienta: [], emprendimiento: [], juego: [] };
}

const key = (asignatura: string, unidad: number) => `${asignatura}#${unidad}`;

export function buildIndiceRecursos(entradas: RecursoEntrada[]): Map<string, RecursosDeUnidad> {
  const map = new Map<string, RecursosDeUnidad>();
  for (const e of entradas) {
    for (const u of e.unidades) {
      const k = key(u.asignatura, u.unidad);
      let groups = map.get(k);
      if (!groups) { groups = emptyGroups(); map.set(k, groups); }
      groups[e.tipo].push({
        tipo: e.tipo, slug: e.slug, title: e.title, href: e.href,
        familiaColorVar: e.familiaColorVar, nota: u.nota,
      });
    }
  }
  return map;
}

export function recursosDeUnidad(
  idx: Map<string, RecursosDeUnidad>, asignatura: string, unidad: number,
): RecursosDeUnidad {
  return idx.get(key(asignatura, unidad)) ?? emptyGroups();
}

export function tieneRecursos(r: RecursosDeUnidad): boolean {
  return TIPOS.some((t) => r[t].length > 0);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/recursos-relacionados.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/recursos-relacionados.ts src/lib/recursos-relacionados.test.ts
git commit -m "feat(libro): pure inverse-index helper for related resources"
```

---

## Task A2: Resolutor de fuentes (normaliza colecciones/registros)

**Files:**
- Create: `src/lib/recursos-relacionados-sources.ts`

Mapea cada fuente a `RecursoEntrada[]`. Las dinámicas/debates/proyectos son colecciones; herramientas/juegos son registros TS; emprendimiento es colección. `slug` se deriva del último segmento del `id` de la entrada (igual que hacen las rutas `[familia]/[slug].astro`). Cajút se EXCLUYE de la lista de juegos (es el cierre universal del componente).

- [ ] **Step 1: Implementation**

```ts
// src/lib/recursos-relacionados-sources.ts
import { getCollection } from 'astro:content';
import type { RecursoEntrada, UnidadRef } from './recursos-relacionados.ts';
import { FAMILIAS } from './dinamicas.ts';
import { FAMILIAS_DEBATE } from './debates.ts';
import { MATERIAS } from './proyectos.ts';
import { FAMILIAS_HERRAMIENTA, HERRAMIENTAS, unidadesPorComponente } from './herramientas.ts';
import { JUEGOS } from './juegos.ts';

const lastSeg = (id: string) => id.split('/').filter(Boolean).pop() as string;
const colorOf = (fams: { slug: string; colorVar: string }[], slug: string) =>
  fams.find((f) => f.slug === slug)?.colorVar ?? '--color-mustard';

// dinámicas / debates / proyectos share the same content shape.
async function fromContent(
  collection: 'dinamicas' | 'debates' | 'proyectos',
  tipo: RecursoEntrada['tipo'],
  fams: { slug: string; colorVar: string }[],
  routeBase: string,
): Promise<RecursoEntrada[]> {
  const items = await getCollection(collection as any);
  return items
    .filter((e: any) => e.data.estado === 'publicado')
    .map((e: any) => {
      const familia = e.data.familia as string;
      const slug = lastSeg(e.id);
      return {
        tipo, slug, title: e.data.title as string,
        href: `/${routeBase}/${familia}/${slug}/`,
        familiaColorVar: colorOf(fams, familia),
        unidades: (e.data.unidades_relacionadas ?? []) as UnidadRef[],
      };
    });
}

async function fromEmprendimiento(): Promise<RecursoEntrada[]> {
  const items = await getCollection('emprendimiento' as any);
  return items
    .filter((e: any) => e.data.estado === 'publicado')
    .map((e: any) => {
      const slug = lastSeg(e.id);
      return {
        tipo: 'emprendimiento' as const, slug, title: e.data.title as string,
        href: `/emprendimiento/proyecto/${slug}/`,
        familiaColorVar: '--color-terra',
        unidades: (e.data.unidades_relacionadas ?? []) as UnidadRef[],
      };
    });
}

async function fromHerramientas(): Promise<RecursoEntrada[]> {
  const recursos = await getCollection('recursos' as any);
  const derivadas = unidadesPorComponente(recursos as any); // Map<componente, {asignatura,unidad}[]>
  return HERRAMIENTAS.map((h) => {
    const inline = h.unidades_relacionadas ?? [];
    const fromRecursos = derivadas.get(h.componente) ?? [];
    // dedupe by asignatura#unidad
    const seen = new Set<string>();
    const unidades: UnidadRef[] = [];
    for (const u of [...inline, ...fromRecursos]) {
      const k = `${u.asignatura}#${u.unidad}`;
      if (!seen.has(k)) { seen.add(k); unidades.push(u); }
    }
    return {
      tipo: 'herramienta' as const, slug: h.slug, title: h.title,
      href: `/herramientas/${h.familia}/${h.slug}/`,
      familiaColorVar: colorOf(FAMILIAS_HERRAMIENTA, h.familia),
      unidades,
    };
  }).filter((e) => e.unidades.length > 0);
}

function fromJuegos(): RecursoEntrada[] {
  return JUEGOS
    .filter((g) => g.estado === 'disponible' && g.slug !== 'cajut')
    .map((g) => ({
      tipo: 'juego' as const, slug: g.slug, title: g.title, href: g.href,
      familiaColorVar: '--color-terra',
      unidades: g.unidades_relacionadas as UnidadRef[],
    }));
}

export async function collectRecursoEntradas(): Promise<RecursoEntrada[]> {
  const [din, deb, pro, emp, her] = await Promise.all([
    fromContent('dinamicas', 'dinamica', FAMILIAS, 'dinamicas'),
    fromContent('debates', 'debate', FAMILIAS_DEBATE, 'debates'),
    fromContent('proyectos', 'proyecto', MATERIAS, 'proyectos'),
    fromEmprendimiento(),
    fromHerramientas(),
  ]);
  return [...din, ...deb, ...pro, ...emp, ...her, ...fromJuegos()];
}
```

- [ ] **Step 2: Type-check it compiles**

Run: `npx astro check --minimumSeverity error 2>&1 | head -30`
Expected: no NEW errors referencing `recursos-relacionados-sources.ts`. (If `getCollection('emprendimiento')` / `'recursos'` collection names differ, fix to the real names found in `src/content.config.ts`.)

- [ ] **Step 3: Commit**

```bash
git add src/lib/recursos-relacionados-sources.ts
git commit -m "feat(libro): source resolver normalising transversal collections"
```

**Verification note for implementer:** confirm the exact collection names (`dinamicas`, `debates`, `proyectos`, `emprendimiento`, `recursos`) and the `id`→slug shape against `src/content.config.ts` and the existing `src/pages/{dinamicas,debates,proyectos}/[familia]/[slug].astro` route files. Adjust `lastSeg`/href only if those routes build the URL differently.

---

## Task A3: Componente del cajón + cierre Cajút

**Files:**
- Create: `src/components/libro/RecursosRelacionados.astro`

Mirrors `PuenteUnidades.astro` styling. Renders only non-empty groups; always renders the Cajút closer.

- [ ] **Step 1: Implementation**

```astro
---
// src/components/libro/RecursosRelacionados.astro
import type { RecursosDeUnidad, TipoRecurso, RecursoRef } from '@/lib/recursos-relacionados';
import { tieneRecursos } from '@/lib/recursos-relacionados';

interface Props { recursos: RecursosDeUnidad; asignaturaLabel: string; unidad: number; }
const { recursos, asignaturaLabel, unidad } = Astro.props;

const GRUPOS: { tipo: TipoRecurso; label: string }[] = [
  { tipo: 'dinamica',      label: 'Dinámicas de aula' },
  { tipo: 'debate',        label: 'Debates' },
  { tipo: 'herramienta',   label: 'Herramientas' },
  { tipo: 'proyecto',      label: 'Proyectos interdisciplinares' },
  { tipo: 'juego',         label: 'Juegos' },
  { tipo: 'emprendimiento',label: 'Proyecto de emprendimiento' },
];
const visibles = GRUPOS.filter((g) => recursos[g.tipo].length > 0);
const cajutNota = `El profe elige ${asignaturaLabel} · Unidad ${unidad} y los alumnos responden desde el móvil.`;
---

<section class="recursos" aria-labelledby="recursos-title">
  <h2 id="recursos-title" class="recursos__title">Para el aula</h2>

  {tieneRecursos(recursos) ? (
    <div class="recursos__grupos">
      {visibles.map((g) => (
        <div class="recursos__grupo">
          <h3 class="recursos__grupo-title">{g.label}</h3>
          <ul class="recursos__list">
            {recursos[g.tipo].map((r: RecursoRef) => (
              <li class="recursos__item" style={`--card: var(${r.familiaColorVar});`}>
                <a class="recursos__link" href={r.href}>{r.title}</a>
                {r.nota && <span class="recursos__nota">{r.nota}</span>}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  ) : (
    <p class="recursos__vacio">Aún no hay recursos transversales ligados a esta unidad. Puedes repasarla con Cajút.</p>
  )}

  <a class="recursos__cajut" href="/juegos/cajut/host/">
    <span class="recursos__cajut-kicker">Repaso en clase</span>
    <strong>Repasa esta unidad con Cajút</strong>
    <span class="recursos__cajut-nota">{cajutNota}</span>
  </a>
</section>

<style>
  .recursos { margin: 3rem 0 1rem; padding-top: 1.5rem; border-top: 1px solid var(--color-line); }
  .recursos__title { font-family: var(--font-sans); font-size: 0.8rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-mustard-deep); margin: 0 0 1.2rem; }
  .recursos__grupos { display: grid; gap: 1.4rem; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
  .recursos__grupo-title { font-family: var(--font-sans); font-size: 0.95rem; font-weight: 600; margin: 0 0 0.5rem; color: var(--color-ink); }
  .recursos__list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; }
  .recursos__item { border-left: 3px solid var(--card, var(--color-mustard)); padding-left: 0.7rem; }
  .recursos__link { color: var(--color-terra); text-decoration: none; font-weight: 500; }
  .recursos__link:hover { text-decoration: underline; }
  .recursos__nota { display: block; font-family: var(--font-serif); font-style: italic; font-size: 0.9rem; color: var(--color-ink-soft); margin-top: 0.1rem; }
  .recursos__vacio { color: var(--color-ink-soft); font-style: italic; }
  .recursos__cajut { display: block; margin-top: 1.6rem; padding: 1.1rem 1.3rem; border: 1px solid var(--color-line); border-left: 4px solid var(--color-terra); border-radius: 0 6px 6px 0; background: var(--color-bg-cream); color: var(--color-ink); text-decoration: none; }
  .recursos__cajut:hover { box-shadow: 0 4px 16px rgba(42,31,24,0.08); }
  .recursos__cajut-kicker { display: block; font-family: var(--font-sans); font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-terra); }
  .recursos__cajut strong { display: block; font-family: var(--font-serif); font-size: 1.2rem; margin: 0.15rem 0; }
  .recursos__cajut-nota { display: block; font-size: 0.9rem; color: var(--color-ink-soft); }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/libro/RecursosRelacionados.astro
git commit -m "feat(libro): RecursosRelacionados drawer component with Cajut closer"
```

---

## Task A4: Montar el cajón en la página de unidad

**Files:**
- Modify: `src/pages/[asignatura]/libro/[unidad].astro`

The page already has `unit.data.asignatura`, `unit.data.unidad`, and `a` (= `ASIGNATURAS[unit.data.asignatura]`, which has `shortLabel`). Build the index once at module load.

- [ ] **Step 1: Add imports + index build to the frontmatter**

At the top of the frontmatter (with the other imports), add:
```ts
import RecursosRelacionados from '@components/libro/RecursosRelacionados.astro';
import { collectRecursoEntradas } from '@/lib/recursos-relacionados';
import { buildIndiceRecursos, recursosDeUnidad } from '@/lib/recursos-relacionados';
```
After `const a = ASIGNATURAS[unit.data.asignatura];` add:
```ts
const indiceRecursos = buildIndiceRecursos(await collectRecursoEntradas());
const recursos = recursosDeUnidad(indiceRecursos, unit.data.asignatura, unit.data.unidad);
```
(Note: `collectRecursoEntradas` is imported from `recursos-relacionados-sources` via a re-export, or import it directly from `@/lib/recursos-relacionados-sources`. Use the direct path: `import { collectRecursoEntradas } from '@/lib/recursos-relacionados-sources';`.)

- [ ] **Step 2: Insert the component after the unit nav**

After the `.unit-nav` block (ends ~line 131) and before the layout closes, insert:
```astro
<RecursosRelacionados recursos={recursos} asignaturaLabel={a.shortLabel} unidad={unit.data.unidad} />
```
Place it inside the same container that wraps `<Content />`/nav so it shares the page width.

- [ ] **Step 3: Build**

Run: `npx astro build 2>&1 | tail -15`
Expected: `Complete!`, no broken-link errors, 88 unit pages built. Spot a couple: `eco-1bach/libro/<u1>` shows Econrisk; a unit with no resources shows only the Cajút closer.

- [ ] **Step 4: Commit**

```bash
git add "src/pages/[asignatura]/libro/[unidad].astro"
git commit -m "feat(libro): render related-resources drawer on every unit page"
```

---

## Task A5: Branch + PR for Fase A

- [ ] Push `feat/libro-recursos-transversales` and open a PR to `main`. Verify build green in CI/local. (Respect the 1h self-review gate before merge.)

---

# FASE B — Pasada editorial de incrustados inline (9 asignaturas)

## Task B1: Componente inline destacado

**Files:**
- Create: `src/components/libro/RecursoDestacado.astro`

Rich inline card to embed a single standout dinámica/debate inside a unit body. Calculators use the existing `HerramientaIsland` (no new component).

- [ ] **Step 1: Implementation**

```astro
---
// src/components/libro/RecursoDestacado.astro
// Inline highlight card for a single transversal resource inside a unit body.
interface Props { href: string; kicker: string; title: string; descripcion: string; colorVar?: string; }
const { href, kicker, title, descripcion, colorVar = '--color-terra' } = Astro.props;
---
<a class="destacado" href={href} style={`--card: var(${colorVar});`}>
  <span class="destacado__kicker">{kicker}</span>
  <strong class="destacado__title">{title}</strong>
  <span class="destacado__desc">{descripcion}</span>
  <span class="destacado__cta">Abrir el recurso →</span>
</a>
<style>
  .destacado { display: block; margin: 2rem 0; padding: 1.2rem 1.4rem; border: 1px solid var(--color-line); border-left: 4px solid var(--card); border-radius: 0 8px 8px 0; background: var(--color-paper); color: var(--color-ink); text-decoration: none; transition: box-shadow .2s, transform .2s; }
  .destacado:hover { box-shadow: 0 6px 22px rgba(42,31,24,0.1); transform: translateY(-2px); }
  .destacado__kicker { display: block; font-family: var(--font-sans); font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--card); }
  .destacado__title { display: block; font-family: var(--font-serif); font-size: 1.3rem; margin: 0.2rem 0; }
  .destacado__desc { display: block; color: var(--color-ink-soft); margin-bottom: 0.5rem; }
  .destacado__cta { font-family: var(--font-sans); font-weight: 600; color: var(--color-terra); font-size: 0.92rem; }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/libro/RecursoDestacado.astro
git commit -m "feat(libro): RecursoDestacado inline highlight component"
```

## Task B2: Pasada editorial (las 9 asignaturas, unidades clave)

This task is content-authoring, not code. Execute it as a curated pass (one content sub-agent per asignatura works well). Each embed MUST follow the same MDX-safety rules that already bit us (no `$$`/`\frac`/`\text{` LaTeX, no HTML `<!-- -->` comments inside SVG, no pictographic emojis, correct accents).

**Criterio de unidad clave (embed sólo cuando encaja limpio):**
- **Calculadora** (`HerramientaIsland`): cuando la lección pide un cálculo que una de las herramientas hace (p. ej. punto muerto, elasticidad, equilibrio, VAN/TIR, interés compuesto, nómina/IRPF). Importar al inicio del MDX y colocar tras la explicación teórica del concepto.
- **Recurso destacado** (`RecursoDestacado`): cuando hay UNA dinámica o debate de alto valor directamente ligada a la unidad; colócalo cerca del cierre del epígrafe correspondiente, no al principio.
- No incrustar más de ~1-2 por unidad; no incrustar en unidades donde ninguno encaja con naturalidad (esas se quedan solo con el cajón de Fase A).

- [ ] **Step 1: Per asignatura, list candidate units**
For each asignatura, read its `libro/*.mdx` titles + `conceptos_clave` and the index of related resources (from `collectRecursoEntradas`) to pick the units where a calculator or a standout dinámica/debate fits the lesson flow. Produce a short embed list `{asignatura, unidad-file, recurso, dónde}`.

- [ ] **Step 2: Embed**
In each chosen unit MDX: add the import at the top of the frontmatter (`import HerramientaIsland from '@components/calculadoras/HerramientaIsland.astro';` or `import RecursoDestacado from '@components/libro/RecursoDestacado.astro';`) and place the tag in the body. For a calculator: `<HerramientaIsland componente="PuntoMuerto" client:visible />` (use the real `componente` key + the load directive that HerramientaIsland expects — confirm by reading `HerramientaIsland.astro`). For a highlight: `<RecursoDestacado href="/dinamicas/.../..." kicker="Dinámica de aula" title="…" descripcion="…" colorVar="--color-taller3" />`.

- [ ] **Step 3: Build green after each asignatura**
Run: `npx astro build 2>&1 | tail -8` → `Complete!` with no MDX transform errors. Fix any MDX-safety breakage before moving on.

- [ ] **Step 4: Commit per asignatura**
```bash
git add src/content/asignaturas/<asignatura>/libro/
git commit -m "feat(libro): inline transversal embeds in <asignatura> key units"
```

## Task B3: Quality review + PR

- [ ] Read-only review of the embeds: each is pedagogically justified, the calculator `componente` keys are valid, no MDX-safety breakage, no pictographic emojis, accents correct.
- [ ] Build green; push; PR to `main` (respect the 1h gate).

---

## Self-Review (plan vs spec)

- **Spec §3.1 índice inverso** → Task A1 (pure helper) + A2 (resolver). ✓
- **Spec §3.2 componente cajón + cierre Cajút** → Task A3. ✓
- **Spec §3.3 inserción en la página** → Task A4. ✓
- **Spec §3.4 RecursoDestacado / HerramientaIsland inline** → Task B1 + B2. ✓
- **Spec §2 secciones incluidas (din/deb/pro/herr/empr/juegos), Cajút universal, olimpiada+generadores excluidos** → A2 includes exactly those sources; Cajút excluded from data list and rendered as closer in A3; olimpiada/generadores never sourced. ✓
- **Spec §2 capa A en 88 unidades, capa B en 9 asignaturas** → A4 renders on every unit; B2 covers all asignaturas. ✓
- **Spec §5 testing** → A1 unit tests; A4/B build green. ✓
- **Type consistency:** `RecursoEntrada`/`RecursoRef`/`RecursosDeUnidad`/`UnidadRef` used identically across A1→A2→A3. `collectRecursoEntradas` returns `RecursoEntrada[]` consumed by `buildIndiceRecursos`. ✓
- **Known verification point (not a placeholder):** exact collection names + `id`→slug shape (flagged in A2 Step-3 note) — the implementer confirms against `content.config.ts` and the route files.
