# Herramientas: plantillas + calculadoras nuevas — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 5 tools to the `/herramientas/` toolbox: 2 calculators (productividad, equilibrio de mercado with an SVG graph + ceilings/floors) and 3 fillable templates (DAFO, Business Model Canvas, BCG) that autosave to localStorage and export to PNG/PDF.

**Architecture:** Pure calc logic in `src/lib/calc/*` (TDD) consumed by Preact islands. Shared `src/lib/plantillas/` provides an SSR-safe persistence hook (wrapping the existing `src/lib/storage.ts`) and an `exportarNodo` util (html2canvas + jsPDF). All 5 tools are wired into the existing `HERRAMIENTAS` registry + `HerramientaIsland` dispatcher; their curriculum map uses a new optional manual `unidades_relacionadas` override.

**Tech Stack:** Astro 5, Preact islands (`client:load`), TypeScript, Vitest, html2canvas, jspdf.

---

## File structure

| File | Responsibility |
|---|---|
| `src/lib/calc/productividad.ts` (+ `.test.ts`) | Pure productivity math. |
| `src/lib/calc/equilibrio.ts` (+ `.test.ts`) | Pure market-equilibrium math. |
| `src/components/calculadoras/ProductividadCalc.tsx` | Productivity calculator island. |
| `src/components/calculadoras/EquilibrioCalc.tsx` | Equilibrium calculator island (SVG graph). |
| `src/lib/plantillas/persistence.ts` | `usePersistentState` hook (SSR-safe, localStorage). |
| `src/lib/plantillas/export.ts` | `exportarNodo(el, nombre, formato)` (PNG/PDF). |
| `src/components/calculadoras/DAFOCanvas.tsx` | DAFO fillable template island. |
| `src/components/calculadoras/BusinessModelCanvas.tsx` | BMC fillable template island. |
| `src/components/calculadoras/MatrizBCG.tsx` | BCG fillable template island. |
| `src/lib/herramientas.ts` (modify) | +family, +5 keys, +5 entries, optional `unidades_relacionadas`. |
| `src/lib/herramientas.test.ts` (modify) | 22 tools, 6 families, new-entry checks. |
| `src/components/calculadoras/HerramientaIsland.astro` (modify) | +5 dispatch branches. |
| `src/pages/herramientas/[familia]/[slug].astro` (modify) | unidades = manual override ?? derived. |
| `src/content.config.ts` (modify) | +5 keys in recursos `componente` enum. |

Reused: `src/lib/storage.ts` (`loadJSON`/`saveJSON`), `jspdf`, `html2canvas`.

---

## Task 1: Pure calc logic (productividad + equilibrio)

**Files:** Create `src/lib/calc/productividad.ts` (+ test), `src/lib/calc/equilibrio.ts` (+ test).

- [ ] **Step 1: Write `src/lib/calc/productividad.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { productividadFactor, productividadGlobal, variacionPct } from './productividad.ts';

describe('productividadFactor', () => {
  it('divides production by the factor', () => {
    expect(productividadFactor(1000, 5)).toBe(200);
  });
  it('returns null when the factor is non-positive', () => {
    expect(productividadFactor(1000, 0)).toBeNull();
    expect(productividadFactor(1000, -2)).toBeNull();
  });
});

describe('productividadGlobal', () => {
  it('is value of output over value of inputs', () => {
    expect(productividadGlobal(12000, 8000)).toBe(1.5);
  });
  it('returns null when inputs value is non-positive', () => {
    expect(productividadGlobal(12000, 0)).toBeNull();
  });
});

describe('variacionPct', () => {
  it('computes percentage change', () => {
    expect(variacionPct(200, 250)).toBe(25);
    expect(variacionPct(250, 200)).toBe(-20);
  });
  it('returns null when the base is zero', () => {
    expect(variacionPct(0, 100)).toBeNull();
  });
});
```

- [ ] **Step 2: Run `npx vitest run src/lib/calc/productividad.test.ts` — confirm FAIL (module missing).**

- [ ] **Step 3: Create `src/lib/calc/productividad.ts`**

```ts
/**
 * Pure productivity math. Partial productivity (output per factor), global
 * productivity (value of output / value of inputs) and the % change between
 * two periods. Returns `null` for undefined cases instead of NaN/Infinity.
 */
export function productividadFactor(produccion: number, factor: number): number | null {
  if (factor <= 0) return null;
  return produccion / factor;
}

export function productividadGlobal(valorProduccion: number, valorFactores: number): number | null {
  if (valorFactores <= 0) return null;
  return valorProduccion / valorFactores;
}

export function variacionPct(base: number, nuevo: number): number | null {
  if (base === 0) return null;
  return ((nuevo - base) / base) * 100;
}
```

- [ ] **Step 4: Run the test — confirm PASS.**

- [ ] **Step 5: Write `src/lib/calc/equilibrio.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { equilibrio, evaluarPrecio, intervencion } from './equilibrio.ts';

// Qd = 100 - 2P ; Qs = 20 + 2P  → P* = 20, Q* = 60
const COEF = { a: 100, b: 2, c: 20, d: 2 };

describe('equilibrio', () => {
  it('solves P* and Q* for linear curves', () => {
    expect(equilibrio(COEF.a, COEF.b, COEF.c, COEF.d)).toEqual({ valido: true, P: 20, Q: 60 });
  });
  it('flags invalid when slopes sum to zero', () => {
    expect(equilibrio(100, 0, 20, 0).valido).toBe(false);
  });
  it('flags invalid when equilibrium quantity is negative', () => {
    // Qd = 10 - 2P, Qs = 90 + 2P → P* = -20 → invalid
    expect(equilibrio(10, 2, 90, 2).valido).toBe(false);
  });
});

describe('evaluarPrecio', () => {
  it('returns qd, qs and the excess (qs - qd) at a price', () => {
    // at P = 10: qd = 80, qs = 40 → exceso = -40 (escasez)
    expect(evaluarPrecio(COEF, 10)).toEqual({ qd: 80, qs: 40, exceso: -40 });
  });
});

describe('intervencion', () => {
  it('a binding price ceiling (below P*) creates a shortage', () => {
    // precio máximo 10 (< 20): qd 80, qs 40, traded = 40, escasez 40
    const r = intervencion(COEF, 'maximo', 10);
    expect(r).toEqual({ efectivo: true, intercambiada: 40, escasez: 40, excedente: 0 });
  });
  it('a non-binding price ceiling (above P*) does nothing', () => {
    expect(intervencion(COEF, 'maximo', 30).efectivo).toBe(false);
  });
  it('a binding price floor (above P*) creates a surplus', () => {
    // precio mínimo 30 (> 20): qd 40, qs 80, traded = 40, excedente 40
    const r = intervencion(COEF, 'minimo', 30);
    expect(r).toEqual({ efectivo: true, intercambiada: 40, escasez: 0, excedente: 40 });
  });
});
```

- [ ] **Step 6: Run `npx vitest run src/lib/calc/equilibrio.test.ts` — confirm FAIL.**

- [ ] **Step 7: Create `src/lib/calc/equilibrio.ts`**

```ts
/**
 * Pure market-equilibrium math for linear curves Qd = a − b·P, Qs = c + d·P
 * (b, d > 0). The island draws the SVG; this module only computes numbers.
 */
export interface Coef { a: number; b: number; c: number; d: number; }

export function equilibrio(a: number, b: number, c: number, d: number):
  { valido: true; P: number; Q: number } | { valido: false } {
  const sum = b + d;
  if (sum === 0) return { valido: false };
  const P = (a - c) / sum;
  const Q = a - b * P;
  if (P < 0 || Q < 0) return { valido: false };
  return { valido: true, P, Q };
}

export function evaluarPrecio(coef: Coef, P: number): { qd: number; qs: number; exceso: number } {
  const qd = coef.a - coef.b * P;
  const qs = coef.c + coef.d * P;
  return { qd, qs, exceso: qs - qd };
}

export function intervencion(coef: Coef, tipo: 'maximo' | 'minimo', precio: number):
  { efectivo: boolean; intercambiada: number; escasez: number; excedente: number } {
  const eq = equilibrio(coef.a, coef.b, coef.c, coef.d);
  const { qd, qs } = evaluarPrecio(coef, precio);
  // A ceiling binds only below P*; a floor only above P*.
  const efectivo = eq.valido && (tipo === 'maximo' ? precio < eq.P : precio > eq.P);
  if (!efectivo) return { efectivo: false, intercambiada: eq.valido ? eq.Q : 0, escasez: 0, excedente: 0 };
  return {
    efectivo: true,
    intercambiada: Math.min(qd, qs),
    escasez: tipo === 'maximo' ? Math.max(0, qd - qs) : 0,
    excedente: tipo === 'minimo' ? Math.max(0, qs - qd) : 0,
  };
}
```

- [ ] **Step 8: Run the test — confirm PASS.**

- [ ] **Step 9: Commit**

```bash
git add src/lib/calc/productividad.ts src/lib/calc/productividad.test.ts src/lib/calc/equilibrio.ts src/lib/calc/equilibrio.test.ts
git commit -m "feat(calc): pure productividad and equilibrio (with ceilings/floors) logic"
```

---

## Task 2: Calculator islands (productividad + equilibrio)

**Files:** Create `src/components/calculadoras/ProductividadCalc.tsx`, `src/components/calculadoras/EquilibrioCalc.tsx`.

These are Preact islands (no unit test; verified by build + dev smoke). Follow the EXISTING island style — read `src/components/calculadoras/PuntoMuertoCalc.tsx` and `src/components/calculadoras/ElasticidadCalc.tsx` first for the exact conventions (`/** @jsxImportSource preact */`, `useState`/`useMemo`, scoped `<style>` or inline styles with the project's `--color-*`/`--font-*` tokens, `formatES`/number formatting helpers if present in `src/lib/calc/format.ts`).

- [ ] **Step 1: `ProductividadCalc.tsx`** — contract:
  - State: two periods, each `{ produccion, trabajadores, horas, capital, valorProduccion, valorFactores }` (numbers).
  - Uses `productividadFactor`, `productividadGlobal`, `variacionPct` from `@/lib/calc/productividad` (import via relative `../../lib/calc/productividad` or the project alias used by sibling islands — check how PuntoMuertoCalc imports its lib).
  - For each period shows: productividad del trabajo (producción / trabajadores, and a secondary producción / horas), productividad del capital (producción / capital), productividad global (valorProduccion / valorFactores). Show "—" when a function returns `null`.
  - Shows the % variation between period 0 and period 1 for each of the three measures (`variacionPct`).
  - Pure presentational; no persistence.

- [ ] **Step 2: `EquilibrioCalc.tsx`** — contract:
  - Inputs: a, b, c, d (Qd = a − bP, Qs = c + dP); a price `P` to inspect; an optional intervention `{tipo: 'maximo'|'minimo', precio}` toggled by the user.
  - Uses `equilibrio`, `evaluarPrecio`, `intervencion` from `@/lib/calc/equilibrio`.
  - Shows P* and Q* (or an invalid message). At the inspected price shows qd, qs and whether there is escasez (exceso<0) or excedente (exceso>0). When an intervention is active, shows intercambiada + escasez/excedente and whether it is efectivo.
  - **SVG graph** (self-contained, fixed viewBox e.g. `0 0 320 240`): axes (P vertical, Q horizontal), the demand line (negative slope), the supply line (positive slope), the equilibrium point marked, and — when a price/tope is set — a horizontal dashed line at that price and a highlighted segment for the shortage/surplus. Compute screen coords by scaling Q to width and P to height over a sensible domain (e.g. P from 0 to the demand x-intercept a/b). Keep it readable; this is a teaching graph, not a precise plot. Numbers come from the lib; the SVG only positions.
  - No persistence.

- [ ] **Step 3: Type-check**: `npx astro check` — no new errors. (Islands are referenced by HerramientaIsland only after Task 5; that's fine.)

- [ ] **Step 4: Commit**

```bash
git add src/components/calculadoras/ProductividadCalc.tsx src/components/calculadoras/EquilibrioCalc.tsx
git commit -m "feat(calculadoras): productividad and equilibrio islands"
```

---

## Task 3: Shared template utilities (persistence + export)

**Files:** Create `src/lib/plantillas/persistence.ts`, `src/lib/plantillas/export.ts`.

- [ ] **Step 1: Create `src/lib/plantillas/persistence.ts`**

```ts
/** @jsxImportSource preact */
import { useEffect, useState } from 'preact/hooks';
import { loadJSON, saveJSON } from '@/lib/storage';

/**
 * State backed by localStorage under `key`. SSR-safe: `loadJSON`/`saveJSON`
 * guard for the absence of `window` and degrade to the in-memory value.
 */
export function usePersistentState<T>(key: string, initial: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() => loadJSON<T>(key, initial));
  useEffect(() => { saveJSON(key, value); }, [key, value]);
  return [value, setValue];
}
```

(First confirm `src/lib/storage.ts` exports `loadJSON` and `saveJSON`; it exports `loadJSON` — if the writer function is named differently, e.g. `saveJSON`/`storeJSON`, use the actual name. Read the file.)

- [ ] **Step 2: Create `src/lib/plantillas/export.ts`**

```ts
/**
 * Export a DOM node as a PNG download or an A4 (landscape) PDF, using the same
 * html2canvas + jsPDF stack already in the project. Browser-only.
 */
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export async function exportarNodo(el: HTMLElement, nombre: string, formato: 'png' | 'pdf'): Promise<void> {
  const canvas = await html2canvas(el, { backgroundColor: '#ffffff', scale: 2 });
  if (formato === 'png') {
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `${nombre}.png`;
    a.click();
    return;
  }
  const img = canvas.toDataURL('image/png');
  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'landscape' });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const ratio = Math.min(pageW / canvas.width, pageH / canvas.height);
  const w = canvas.width * ratio;
  const h = canvas.height * ratio;
  pdf.addImage(img, 'PNG', (pageW - w) / 2, (pageH - h) / 2, w, h);
  pdf.save(`${nombre}.pdf`);
}
```

- [ ] **Step 3: Type-check**: `npx astro check` — no new errors. (If `html2canvas` lacks types, the existing project config already tolerates it since it's a dependency; if a type error appears, add `// @ts-expect-error` only on the import line, matching how the project handles it elsewhere — check first.)

- [ ] **Step 4: Commit**

```bash
git add src/lib/plantillas/persistence.ts src/lib/plantillas/export.ts
git commit -m "feat(plantillas): shared persistence hook and PNG/PDF export util"
```

---

## Task 4: The three fillable template islands

**Files:** Create `src/components/calculadoras/DAFOCanvas.tsx`, `BusinessModelCanvas.tsx`, `MatrizBCG.tsx`.

Preact islands; verified by build + dev smoke. Each follows the SAME structure (read PuntoMuertoCalc.tsx for the house style). Common contract for all three:
- State is a record of block-id → string, via `usePersistentState('pde:plantilla:<nombre>', {...initial blanks})`.
- Each block is a labelled cell with a `<textarea>` (or `contenteditable`) bound to its state field.
- An action bar (outside the `.lienzo` node, class `no-print`): buttons **Exportar PNG**, **Exportar PDF** (call `exportarNodo(lienzoRef.current!, '<nombre>', 'png'|'pdf')`), **Imprimir** (`window.print()`), **Vaciar** (reset state to blanks after a confirm).
- A `ref` (`useRef<HTMLDivElement>`) on the `.lienzo` wrapper so export captures exactly the canvas.
- `@media print` (scoped `<style>`): hide everything but `.lienzo` (same isolation idea as the dinámicas print: `.no-print { display: none }`, and make the lienzo full width). Textareas must print their text (set print color, remove resize handles).
- Tokens only (`--color-*`, `--font-*`); no new colors; no pictographic emojis.

- [ ] **Step 1: `DAFOCanvas.tsx`** — 2×2 grid. Blocks: `debilidades` (interno/–), `amenazas` (externo/–), `fortalezas` (interno/+), `oportunidades` (externo/+). Header row/col labels (Interno/Externo, Positivo/Negativo). Persistence key `pde:plantilla:dafo`.

- [ ] **Step 2: `BusinessModelCanvas.tsx`** — the 9 BMC blocks in the canonical layout: top row `socios_clave | actividades_clave (+ recursos_clave stacked) | propuestas_valor | relaciones_clientes (+ canales stacked) | segmentos_clientes`, bottom row `estructura_costes | fuentes_ingresos`. Persistence key `pde:plantilla:canvas`. A responsive grid is fine (exact BMC proportions not required, but keep the 9 labelled blocks and the two-bottom-blocks structure).

- [ ] **Step 3: `MatrizBCG.tsx`** — 2×2 with axis labels (vertical: Crecimiento alto/bajo; horizontal: Cuota alta/baja). Quadrants: `estrella` (alto/alta), `interrogante` (alto/baja), `vaca` (bajo/alta), `perro` (bajo/baja), each a labelled cell. Persistence key `pde:plantilla:bcg`.

- [ ] **Step 4: Type-check**: `npx astro check` — no new errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/calculadoras/DAFOCanvas.tsx src/components/calculadoras/BusinessModelCanvas.tsx src/components/calculadoras/MatrizBCG.tsx
git commit -m "feat(plantillas): DAFO, Business Model Canvas and BCG fillable templates"
```

---

## Task 5: Wire the 5 tools into the registry + dispatcher + detail + recursos enum

**Files:** Modify `src/lib/herramientas.ts`, `src/lib/herramientas.test.ts`, `src/components/calculadoras/HerramientaIsland.astro`, `src/pages/herramientas/[familia]/[slug].astro`, `src/content.config.ts`.

- [ ] **Step 1: Find real units for the 5 new tools' curriculum maps.** Grep the published libros and note `{asignatura, unidad}` (folder + frontmatter `unidad:`, `estado: publicado`):
  - Strategy (DAFO / Canvas / BCG): `grep -rilE "DAFO|modelo de negocio|business model|análisis estratégico|plan de empresa|cartera de productos|matriz BCG" src/content/asignaturas/*/libro/*.mdx`
  - Productividad: `grep -rilE "productividad" src/content/asignaturas/*/libro/*.mdx`
  - Equilibrio: `grep -rilE "oferta y demanda|equilibrio de mercado|equilibrio del mercado" src/content/asignaturas/*/libro/*.mdx`
  Pick 1–3 real published pairs per tool (e.g. EDMN 2BACH, EEAE-bach, GPE-bach for strategy; Eco 1BACH/Eco 4ESO for equilibrio).

- [ ] **Step 2: Extend `src/lib/herramientas.ts`:**
  1. `COMPONENTE_KEYS`: append `'Productividad', 'EquilibrioMercado', 'DAFO', 'CanvasBM', 'BCG'`.
  2. Add the optional field to the interface: in `Herramienta`, add `unidades_relacionadas?: { asignatura: string; unidad: number }[];`.
  3. `FAMILIAS_HERRAMIENTA`: append `{ slug: 'estrategia-planificacion', label: 'Estrategia y planificación', intro: 'Diagnóstico y diseño: DAFO, modelo de negocio y cartera.', colorVar: '--color-gpe' }`.
  4. Append 5 entries to `HERRAMIENTAS` (replace the `unidades_relacionadas` pairs with the REAL ones from Step 1):

```ts
  // Costes y resultados
  { componente: 'Productividad', slug: 'productividad', title: 'Productividad', familia: 'costes-resultados', orden: 4, tipo: 'calculadora', descripcion: 'Productividad del trabajo y del capital, global y su variación entre periodos.', competencias_clave: ['STEM', 'CD', 'CE'], competencias_especificas: [], unidades_relacionadas: [{ asignatura: 'edmn-2bach', unidad: 1 }] },
  // Mercados y macroeconomía
  { componente: 'EquilibrioMercado', slug: 'equilibrio-mercado', title: 'Equilibrio de mercado', familia: 'mercados-macro', orden: 4, tipo: 'calculadora', descripcion: 'Oferta y demanda lineales: precio y cantidad de equilibrio, topes y excesos.', competencias_clave: ['STEM', 'CD'], competencias_especificas: [], unidades_relacionadas: [{ asignatura: 'eco-1bach', unidad: 1 }] },
  // Estrategia y planificación
  { componente: 'DAFO', slug: 'dafo', title: 'DAFO', familia: 'estrategia-planificacion', orden: 1, tipo: 'plantilla', descripcion: 'Lienzo de Debilidades, Amenazas, Fortalezas y Oportunidades para rellenar.', competencias_clave: ['CPSAA', 'CE'], competencias_especificas: [], unidades_relacionadas: [{ asignatura: 'edmn-2bach', unidad: 1 }] },
  { componente: 'CanvasBM', slug: 'business-model-canvas', title: 'Business Model Canvas', familia: 'estrategia-planificacion', orden: 2, tipo: 'plantilla', descripcion: 'Los 9 bloques del modelo de negocio para diseñar y pivotar.', competencias_clave: ['CPSAA', 'CE'], competencias_especificas: [], unidades_relacionadas: [{ asignatura: 'edmn-2bach', unidad: 1 }] },
  { componente: 'BCG', slug: 'matriz-bcg', title: 'Matriz BCG', familia: 'estrategia-planificacion', orden: 3, tipo: 'plantilla', descripcion: 'Cartera de productos por crecimiento y cuota: estrella, interrogante, vaca y perro.', competencias_clave: ['CPSAA', 'CE'], competencias_especificas: [], unidades_relacionadas: [{ asignatura: 'edmn-2bach', unidad: 1 }] },
```
  (Use the REAL units from Step 1, not the `unidad: 1` placeholders above.)

- [ ] **Step 3: Update the detail page fallback** in `src/pages/herramientas/[familia]/[slug].astro`. Replace the `const unidades = ...` line with:

```ts
const derivadas = unidadesPorComponente(recursos.filter((r) => r.data.estado === 'publicado')).get(componente) ?? [];
const unidades = h.unidades_relacionadas ?? derivadas;
```

- [ ] **Step 4: Add 5 dispatch branches to `src/components/calculadoras/HerramientaIsland.astro`.** Add the imports:
```astro
import ProductividadCalc from '@components/calculadoras/ProductividadCalc.tsx';
import EquilibrioCalc from '@components/calculadoras/EquilibrioCalc.tsx';
import DAFOCanvas from '@components/calculadoras/DAFOCanvas.tsx';
import BusinessModelCanvas from '@components/calculadoras/BusinessModelCanvas.tsx';
import MatrizBCG from '@components/calculadoras/MatrizBCG.tsx';
```
and the branches:
```astro
{componente === 'Productividad' && <ProductividadCalc client:load />}
{componente === 'EquilibrioMercado' && <EquilibrioCalc client:load />}
{componente === 'DAFO' && <DAFOCanvas client:load />}
{componente === 'CanvasBM' && <BusinessModelCanvas client:load />}
{componente === 'BCG' && <MatrizBCG client:load />}
```

- [ ] **Step 5: Add the 5 keys to the `recursos` `componente` enum** in `src/content.config.ts` (append `'Productividad', 'EquilibrioMercado', 'DAFO', 'CanvasBM', 'BCG'` to the existing `z.enum([...])` list around line 124).

- [ ] **Step 6: Update `src/lib/herramientas.test.ts`** — change the count expectations to 22 and add coverage for the new family/entries:

```ts
// in 'HERRAMIENTAS registry' first test: expect(HERRAMIENTAS).toHaveLength(22);
//   and the uniqueness test: expect(new Set(comps).size).toBe(22); slugs 22.
// in 'FAMILIAS_HERRAMIENTA': the slug list now ends with 'estrategia-planificacion' (6 families).
```
Add a focused test:
```ts
describe('herramientas nuevas (plantillas + calc)', () => {
  it('the 3 templates are tipo plantilla in estrategia-planificacion with a manual unidades override', () => {
    for (const c of ['DAFO', 'CanvasBM', 'BCG']) {
      const h = HERRAMIENTAS.find((x) => x.componente === c)!;
      expect(h.tipo).toBe('plantilla');
      expect(h.familia).toBe('estrategia-planificacion');
      expect((h.unidades_relacionadas ?? []).length).toBeGreaterThan(0);
    }
  });
  it('productividad and equilibrio are calculadoras with a manual override', () => {
    for (const c of ['Productividad', 'EquilibrioMercado']) {
      const h = HERRAMIENTAS.find((x) => x.componente === c)!;
      expect(h.tipo).toBe('calculadora');
      expect((h.unidades_relacionadas ?? []).length).toBeGreaterThan(0);
    }
  });
});
```
Update the FAMILIAS_HERRAMIENTA order assertion to include `'estrategia-planificacion'` as the 6th slug.

- [ ] **Step 7: Run tests + type-check**

Run: `npx vitest run src/lib/herramientas.test.ts src/lib/calc/productividad.test.ts src/lib/calc/equilibrio.test.ts`
Expected: all pass.
Run: `npx astro check` — no new errors.

- [ ] **Step 8: Commit**

```bash
git add src/lib/herramientas.ts src/lib/herramientas.test.ts "src/components/calculadoras/HerramientaIsland.astro" "src/pages/herramientas/[familia]/[slug].astro" src/content.config.ts
git commit -m "feat(herramientas): wire productividad, equilibrio and the 3 templates into the toolbox"
```

---

## Task 6: Full build, smoke, PR + merge

- [ ] **Step 1: Full build**

Run: `npx astro build`
Expected: `Complete!`, exit 0. 22 detail pages under `/herramientas/`; the 5 new islands bundle. Fix any error and re-run until green.

- [ ] **Step 2: Dev smoke** (recommended): `npx astro dev`; open `/herramientas/` (6 families incl. «Estrategia y planificación»), `/herramientas/estrategia-planificacion/dafo/` (type in a cell, reload → text persists, Exportar PNG downloads, Imprimir shows only the lienzo), and `/herramientas/mercados-macro/equilibrio-mercado/` (graph renders, ceiling shows shortage). Stop dev.

- [ ] **Step 3: Push + PR** (this branch is stacked on `feat/seccion-herramientas` / PR #90). Controller handles base retargeting: once #90 is merged to `dev`, target `dev`; otherwise target `feat/seccion-herramientas`.

```bash
git push -u origin feat/herramientas-plantillas-calc
# PR creation done by the controller after deciding the base (see notes).
```

- [ ] **Step 4: Merge** per the controller's instruction (Vercel green first).

---

## Self-review notes (for the implementer)

- **Pure logic is TDD; islands are not unit-tested** — they're verified by build + dev smoke. Don't invent brittle DOM tests.
- **localStorage hook must be SSR-safe** — it goes through `src/lib/storage.ts`, which already guards `window`. The prerender must not crash.
- **Export degrades to print** — if `exportarNodo` throws (html2canvas edge cases), the Imprimir button still works; don't let an export failure break the island.
- **Real units (Task 5 Step 1)** — replace the `unidad: 1` placeholders with units that actually exist and are published.
- **No new colors** beyond the `estrategia-planificacion` family using the existing `--color-gpe`. **No pictographic emojis.**
- **Equilibrio graph** is a teaching SVG; numbers come from `equilibrio.ts` (tested), the SVG only positions.
