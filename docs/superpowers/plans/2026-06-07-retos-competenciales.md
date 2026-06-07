# Retos competenciales Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a third interactive activity type — the *reto competencial*: a multi-step scenario centred on one competencia específica, solved on screen with immediate feedback, ending in a LOMLOE achievement level (En desarrollo / Adecuado / Avanzado) with the real descriptor from `evaluacion.mdx`. Pilot: Eco 1BACH, 3 retos.

**Architecture:** New `retos` content collection; the reto structure (scenario + steps + items) lives as a JSON block in the MDX body (mirrors `actividades-dinamicas`), parsed + Zod-validated at build. A new Preact island `RetoPlayer` (mirrors `QuizPlayer` UX, does NOT touch it) renders 6 item types and the level ending. The detail route resolves the 3 level descriptors from the subject's `evaluacion` collection. The subject hub presents interactive practice as three cards (Tests · Simuladores · Retos competenciales).

**Tech Stack:** Astro 5 content collections, Zod, Preact islands (client:load), Vitest.

Spec: `docs/superpowers/specs/2026-06-07-retos-competenciales-design.md`

---

## File Structure

- `src/content.config.ts` — add the `retos` collection + register it in `collections`.
- `src/components/retos/parse-reto.ts` — Zod schema + types (`RetoData`, `Item`, `Paso`) + `parseRetoFromMdxBody`. **Create.**
- `src/components/retos/parse-reto.test.ts` — unit test. **Create.**
- `src/lib/retos.ts` — `nivelForScore` + `resolveNiveles` + `NivelInfo`. **Create.**
- `src/lib/retos.test.ts` — unit test. **Create.**
- `src/components/retos/RetoPlayer.tsx` — the interactive engine. **Create.**
- `src/components/retos/RetoPlayer.css` — styles for the new pieces. **Create.**
- `src/pages/[asignatura]/retos/index.astro` — card grid. **Create.**
- `src/pages/[asignatura]/retos/[slug].astro` — detail + player. **Create.**
- `src/pages/[asignatura]/index.astro` — present the interactive trio. **Modify.**
- `src/content/asignaturas/eco-1bach/retos/01..03-*.mdx` — 3 pilot retos. **Create (content).**

---

## Task 1: `retos` content collection

**Files:**
- Modify: `src/content.config.ts`

- [ ] **Step 1: Define the collection**

Add this near the other `defineCollection` blocks (e.g. after the `tests` collection):

```ts
const retos = defineCollection({
  loader: glob({ pattern: 'asignaturas/*/retos/**/*.{md,mdx}', base: './src/content' }),
  schema: z.object({
    asignatura: z.enum(ASIGNATURA_SLUGS),
    competencia: z.string(),
    unidad_relacionada: z.number().int().min(1).optional(),
    title: z.string(),
    descripcion: z.string(),
    duracion: z.string().optional(),
    competencias_clave: z.array(z.string()).default([]),
    lang: z.enum(LANGS).default('es'),
    estado: z.enum(ESTADOS).default('borrador'),
  }),
});
```

- [ ] **Step 2: Register it in the `collections` export**

In the `export const collections = { ... }` object, add the line:

```ts
  retos,
```

- [ ] **Step 3: Type-check**

Run: `npx astro sync && npx astro check --minimumSeverity error 2>&1 | grep "content.config"`
Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add src/content.config.ts
git commit -m "feat(retos): add retos content collection"
```

---

## Task 2: Reto parser + Zod schema + types

**Files:**
- Create: `src/components/retos/parse-reto.ts`
- Test: `src/components/retos/parse-reto.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/components/retos/parse-reto.test.ts
import { describe, it, expect } from 'vitest';
import { parseRetoFromMdxBody } from './parse-reto';

const VALID = `Intro text.

\`\`\`json
{
  "intro": { "kicker": "Reto", "titulo": "Escasez", "contexto": "<p>Contexto</p>" },
  "pasos": [
    {
      "titulo": "Paso 1",
      "escenario": "<p>Datos</p>",
      "items": [
        { "tipo": "opcion-multiple", "enunciado": "2+2?", "opciones": ["3", "4"], "correcta": 1, "explicacion": "Suma" },
        { "tipo": "ordenar", "enunciado": "Ordena", "elementos": ["a", "b", "c"] },
        { "tipo": "abierta", "enunciado": "Explica", "modelo": "<p>Modelo</p>" }
      ]
    }
  ]
}
\`\`\`
`;

describe('parseRetoFromMdxBody', () => {
  it('parses and validates a reto JSON block', () => {
    const reto = parseRetoFromMdxBody(VALID);
    expect(reto.intro.titulo).toBe('Escasez');
    expect(reto.pasos).toHaveLength(1);
    expect(reto.pasos[0].items).toHaveLength(3);
    expect(reto.pasos[0].items[0].tipo).toBe('opcion-multiple');
  });

  it('throws when there is no JSON block', () => {
    expect(() => parseRetoFromMdxBody('no json here')).toThrow(/no JSON block/);
  });

  it('throws on a schema violation (missing intro.titulo)', () => {
    const bad = '```json\n{ "pasos": [] }\n```';
    expect(() => parseRetoFromMdxBody(bad)).toThrow();
  });

  it('throws on an unknown item tipo', () => {
    const bad = '```json\n{ "intro": { "titulo": "x", "contexto": "y" }, "pasos": [ { "titulo": "p", "items": [ { "tipo": "loquesea", "enunciado": "z" } ] } ] }\n```';
    expect(() => parseRetoFromMdxBody(bad)).toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/retos/parse-reto.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the parser**

```ts
// src/components/retos/parse-reto.ts
import { z } from 'zod';

const itemSchema = z.discriminatedUnion('tipo', [
  z.object({ tipo: z.literal('opcion-multiple'), enunciado: z.string(), opciones: z.array(z.string()).min(2).max(6), correcta: z.number().int().min(0), explicacion: z.string().optional() }),
  z.object({ tipo: z.literal('verdadero-falso'), enunciado: z.string(), correcta: z.boolean(), explicacion: z.string().optional() }),
  z.object({ tipo: z.literal('numerico'), enunciado: z.string(), respuesta: z.number(), tolerancia: z.number().min(0).optional(), unidad: z.string().optional(), explicacion: z.string().optional() }),
  z.object({ tipo: z.literal('relacionar'), enunciado: z.string(), izquierda: z.array(z.string()).min(2), derecha: z.array(z.string()).min(2), correctas: z.array(z.number().int().min(0)), explicacion: z.string().optional() }),
  z.object({ tipo: z.literal('ordenar'), enunciado: z.string(), elementos: z.array(z.string()).min(2), explicacion: z.string().optional() }),
  z.object({ tipo: z.literal('abierta'), enunciado: z.string(), modelo: z.string() }),
]);

const pasoSchema = z.object({
  titulo: z.string(),
  escenario: z.string().optional(),
  items: z.array(itemSchema).min(1),
});

const retoSchema = z.object({
  intro: z.object({ kicker: z.string().optional(), titulo: z.string(), contexto: z.string() }),
  pasos: z.array(pasoSchema).min(1),
});

export type Item = z.infer<typeof itemSchema>;
export type Paso = z.infer<typeof pasoSchema>;
export type RetoData = z.infer<typeof retoSchema>;

/**
 * Extract the first fenced ```json … ``` block from an MDX body and return it
 * as a Zod-validated RetoData. Throws a descriptive error (surfaces in the build
 * log) when the block is missing or the structure is invalid.
 */
export function parseRetoFromMdxBody(body: string): RetoData {
  const match = body.match(/```json\s*\n([\s\S]*?)\n```/);
  if (!match) throw new Error('parseRetoFromMdxBody: no JSON block found in MDX body');
  let raw: unknown;
  try {
    raw = JSON.parse(match[1]);
  } catch (err) {
    throw new Error(`parseRetoFromMdxBody: malformed JSON — ${(err as Error).message}`);
  }
  const result = retoSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(`parseRetoFromMdxBody: invalid reto — ${result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')}`);
  }
  return result.data;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/retos/parse-reto.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/retos/parse-reto.ts src/components/retos/parse-reto.test.ts
git commit -m "feat(retos): add reto JSON parser with Zod validation"
```

---

## Task 3: Level helpers (`nivelForScore`, `resolveNiveles`)

**Files:**
- Create: `src/lib/retos.ts`
- Test: `src/lib/retos.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/retos.test.ts
import { describe, it, expect } from 'vitest';
import { nivelForScore, resolveNiveles } from './retos';

describe('nivelForScore', () => {
  it('maps score ratio to a level index (0/1/2)', () => {
    expect(nivelForScore(0, 10)).toBe(0);   // 0%
    expect(nivelForScore(4, 10)).toBe(0);   // 40% < 50
    expect(nivelForScore(5, 10)).toBe(1);   // 50%
    expect(nivelForScore(7, 10)).toBe(1);   // 70% < 80
    expect(nivelForScore(8, 10)).toBe(2);   // 80%
    expect(nivelForScore(10, 10)).toBe(2);  // 100%
  });
  it('returns 0 when there are no auto-scored items', () => {
    expect(nivelForScore(0, 0)).toBe(0);
  });
});

const EVAL = {
  competencias: [
    {
      codigo: 'CE1',
      descripcion: 'Valorar la escasez…',
      criterios: ['1.1'],
      niveles: [
        { nivel: 'En desarrollo', descriptor: 'D0' },
        { nivel: 'Adecuado', descriptor: 'D1' },
        { nivel: 'Avanzado', descriptor: 'D2' },
      ],
    },
    { codigo: 'CE2', descripcion: 'Otra', criterios: [], niveles: [{ nivel: 'x', descriptor: 'y' }] },
  ],
};

describe('resolveNiveles', () => {
  it('returns competencia text and 3 levels for a known código', () => {
    const r = resolveNiveles(EVAL, 'CE1');
    expect(r?.competenciaTexto).toBe('Valorar la escasez…');
    expect(r?.niveles).toHaveLength(3);
    expect(r?.niveles[2]).toEqual({ nivel: 'Avanzado', descriptor: 'D2' });
  });
  it('returns null for an unknown código', () => {
    expect(resolveNiveles(EVAL, 'CE9')).toBeNull();
  });
  it('returns null when the competencia has fewer than 3 levels', () => {
    expect(resolveNiveles(EVAL, 'CE2')).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/retos.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement**

```ts
// src/lib/retos.ts
export interface NivelInfo {
  nivel: string;
  descriptor: string;
}

/**
 * Map a score (aciertos out of total auto-scored items) to an achievement-level
 * index: 0 = En desarrollo (<50%), 1 = Adecuado (50–<80%), 2 = Avanzado (≥80%).
 * Returns 0 when there are no auto-scored items.
 */
export function nivelForScore(aciertos: number, total: number): 0 | 1 | 2 {
  if (total <= 0) return 0;
  const pct = aciertos / total;
  if (pct >= 0.8) return 2;
  if (pct >= 0.5) return 1;
  return 0;
}

interface NivelRaw { nivel: string; descriptor: string }
interface CompetenciaRaw { codigo: string; descripcion: string; niveles?: NivelRaw[] }
interface EvaluacionDataLike { competencias?: CompetenciaRaw[] }

/**
 * Look up a competencia específica by código in a subject's evaluación data and
 * return its description plus its three achievement-level descriptors. Returns
 * null when the código is absent or it does not have at least 3 levels (the
 * caller then falls back to generic level labels).
 */
export function resolveNiveles(
  evaluacionData: EvaluacionDataLike,
  codigo: string,
): { competenciaTexto: string; niveles: NivelInfo[] } | null {
  const comp = evaluacionData?.competencias?.find((c) => c.codigo === codigo);
  if (!comp || !Array.isArray(comp.niveles) || comp.niveles.length < 3) return null;
  return {
    competenciaTexto: comp.descripcion,
    niveles: comp.niveles.slice(0, 3).map((n) => ({ nivel: n.nivel, descriptor: n.descriptor })),
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/retos.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/retos.ts src/lib/retos.test.ts
git commit -m "feat(retos): add nivelForScore and resolveNiveles helpers"
```

---

## Task 4: `RetoPlayer` Preact engine

**Files:**
- Create: `src/components/retos/RetoPlayer.tsx`
- Create: `src/components/retos/RetoPlayer.css`

Reuses `QuizPlayer.css` (imported) for the shared widgets (`qp__*` classes) and adds
`RetoPlayer.css` only for the new pieces (scenario block, ordenar, abierta, level ending).
Does NOT modify `QuizPlayer`.

- [ ] **Step 1: Create `RetoPlayer.tsx`**

```tsx
/** @jsxImportSource preact */
import { useEffect, useMemo, useState } from 'preact/hooks';
import { loadJSON, removeKey, saveJSON } from '../../lib/storage';
import { nivelForScore, type NivelInfo } from '../../lib/retos';
import type { Item, RetoData } from './parse-reto';
import '../QuizPlayer.css';
import './RetoPlayer.css';

type Props = {
  reto: RetoData;
  niveles: NivelInfo[];          // exactly 3 (real descriptors or generic fallback)
  competenciaTexto: string;
  competenciaCodigo: string;
  storageKey: string;            // localStorage namespace, pass the reto slug
};

type Respuesta = number | boolean | number[] | string[] | string | null;

type Entrada = {
  item: Item;
  pasoTitulo: string;
  escenario?: string;
  primeroDelPaso: boolean;
};

function aplanar(reto: RetoData): Entrada[] {
  const out: Entrada[] = [];
  reto.pasos.forEach((paso) => {
    paso.items.forEach((item, itemIdx) => {
      out.push({ item, pasoTitulo: paso.titulo, escenario: paso.escenario, primeroDelPaso: itemIdx === 0 });
    });
  });
  return out;
}

const esAuto = (it: Item) => it.tipo !== 'abierta';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function respondida(it: Item, r: Respuesta): boolean {
  switch (it.tipo) {
    case 'opcion-multiple':
    case 'verdadero-falso': return r !== null;
    case 'numerico': return typeof r === 'number' && !Number.isNaN(r);
    case 'relacionar': return Array.isArray(r) && (r as number[]).length === it.izquierda.length && (r as number[]).every((x) => x >= 0);
    case 'ordenar': return Array.isArray(r) && (r as string[]).length === it.elementos.length;
    case 'abierta': return typeof r === 'string' && r.trim().length > 0;
  }
}

function esCorrecta(it: Item, r: Respuesta): boolean {
  switch (it.tipo) {
    case 'opcion-multiple':
    case 'verdadero-falso': return r === it.correcta;
    case 'numerico': return typeof r === 'number' && Math.abs(r - it.respuesta) <= (it.tolerancia ?? 0);
    case 'relacionar': return Array.isArray(r) && it.correctas.every((c, i) => (r as number[])[i] === c);
    case 'ordenar': return Array.isArray(r) && (r as string[]).length === it.elementos.length && (r as string[]).every((v, i) => v === it.elementos[i]);
    case 'abierta': return false; // not auto-scored
  }
}

const numComma = (n: number) => String(n).replace('.', ',');

type Estado = { idx: number; respuestas: Respuesta[]; confirmadas: boolean[]; finalizado: boolean };

function emptyState(entradas: Entrada[]): Estado {
  return {
    idx: 0,
    respuestas: entradas.map((e) => (e.item.tipo === 'ordenar' ? shuffle(e.item.elementos) : null)),
    confirmadas: entradas.map(() => false),
    finalizado: false,
  };
}

function bestKey(storageKey: string): string {
  return `reto:${storageKey}:best`;
}

export default function RetoPlayer({ reto, niveles, competenciaTexto, competenciaCodigo, storageKey }: Props) {
  const entradas = useMemo(() => aplanar(reto), [reto]);
  const totalAuto = useMemo(() => entradas.filter((e) => esAuto(e.item)).length, [entradas]);
  const [estado, setEstado] = useState<Estado>(() => emptyState(entradas));

  const [bestNivel, setBestNivel] = useState<number | null>(null);
  useEffect(() => {
    const stored = loadJSON<number | null>(bestKey(storageKey), null);
    if (typeof stored === 'number') setBestNivel(stored);
  }, [storageKey]);

  const aciertos = useMemo(
    () => entradas.reduce((acc, e, i) => acc + (esAuto(e.item) && esCorrecta(e.item, estado.respuestas[i]) ? 1 : 0), 0),
    [entradas, estado.respuestas],
  );
  const nivelIdx = nivelForScore(aciertos, totalAuto);

  const entrada = entradas[estado.idx];
  const item = entrada.item;
  const r = estado.respuestas[estado.idx];
  const confirmada = estado.confirmadas[estado.idx];
  const total = entradas.length;

  function setRespuesta(value: Respuesta) {
    if (confirmada) return;
    setEstado((s) => {
      const respuestas = [...s.respuestas];
      respuestas[s.idx] = value;
      return { ...s, respuestas };
    });
  }

  function elegirRel(li: number, di: number) {
    if (confirmada || item.tipo !== 'relacionar') return;
    setEstado((s) => {
      const respuestas = [...s.respuestas];
      const base = Array.isArray(respuestas[s.idx]) ? [...(respuestas[s.idx] as number[])] : new Array(item.izquierda.length).fill(-1);
      base[li] = di;
      respuestas[s.idx] = base;
      return { ...s, respuestas };
    });
  }

  function mover(pos: number, dir: -1 | 1) {
    if (confirmada || item.tipo !== 'ordenar') return;
    setEstado((s) => {
      const respuestas = [...s.respuestas];
      const arr = [...(respuestas[s.idx] as string[])];
      const target = pos + dir;
      if (target < 0 || target >= arr.length) return s;
      [arr[pos], arr[target]] = [arr[target], arr[pos]];
      respuestas[s.idx] = arr;
      return { ...s, respuestas };
    });
  }

  function confirmar() {
    if (!respondida(item, r)) return;
    setEstado((s) => {
      const confirmadas = [...s.confirmadas];
      confirmadas[s.idx] = true;
      return { ...s, confirmadas };
    });
  }

  function siguiente() {
    setEstado((s) => {
      if (s.idx + 1 >= total) {
        setBestNivel((prev) => {
          if (prev !== null && prev >= nivelIdx) return prev;
          saveJSON(bestKey(storageKey), nivelIdx);
          return nivelIdx;
        });
        return { ...s, finalizado: true };
      }
      return { ...s, idx: s.idx + 1 };
    });
  }

  function anterior() { setEstado((s) => ({ ...s, idx: Math.max(0, s.idx - 1) })); }
  function reiniciar() { setEstado(emptyState(entradas)); }
  function borrarProgreso() { removeKey(bestKey(storageKey)); setBestNivel(null); }

  // ─── Final screen: achievement level ─────────────────────
  if (estado.finalizado) {
    const nivel = niveles[nivelIdx] ?? { nivel: ['En desarrollo', 'Adecuado', 'Avanzado'][nivelIdx], descriptor: '' };
    return (
      <div class="qp rp">
        <div class="qp__final">
          <div class="qp__eyebrow">Resultado · {competenciaCodigo}</div>
          <div class={`rp__nivel rp__nivel--${nivelIdx}`}>
            <span class="rp__nivel-label">Nivel de logro</span>
            <strong class="rp__nivel-name">{nivel.nivel}</strong>
          </div>
          <p class="qp__detail">{aciertos} de {totalAuto} {totalAuto === 1 ? 'ítem evaluable' : 'ítems evaluables'} correctos</p>
          {nivel.descriptor && <p class="rp__nivel-desc">{nivel.descriptor}</p>}
          <p class="rp__comp"><strong>{competenciaCodigo}.</strong> {competenciaTexto}</p>
          {bestNivel !== null && (
            <p class="qp__best">Tu mejor nivel: {(niveles[bestNivel]?.nivel) ?? ['En desarrollo', 'Adecuado', 'Avanzado'][bestNivel]}</p>
          )}
          <div class="qp__actions">
            <button class="qp__btn qp__btn--primary" type="button" onClick={reiniciar}>Volver a intentarlo</button>
            {bestNivel !== null && (
              <button class="qp__btn qp__btn--ghost" type="button" onClick={borrarProgreso}>Borrar mi progreso</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── Item screen ─────────────────────────────────────────
  const acerto = confirmada && esCorrecta(item, r);
  const ordArr = item.tipo === 'ordenar' && Array.isArray(r) ? (r as string[]) : [];

  return (
    <div class="qp rp">
      <div class="qp__header">
        <span class="qp__eyebrow">Paso {estado.idx + 1} de {total}</span>
        <div class="qp__progress">
          {entradas.map((e, i) => {
            const done = estado.confirmadas[i];
            const auto = esAuto(e.item);
            const ok = done && auto && esCorrecta(e.item, estado.respuestas[i]);
            const fail = done && auto && !ok;
            return (
              <span key={i} class={['qp__dot', i === estado.idx ? 'is-current' : '', ok ? 'is-ok' : '', fail ? 'is-fail' : '', done && !auto ? 'is-ok' : ''].join(' ').trim()} />
            );
          })}
        </div>
      </div>

      {entrada.primeroDelPaso && (
        <div class="rp__paso">
          <h2 class="rp__paso-titulo">{entrada.pasoTitulo}</h2>
          {entrada.escenario && <div class="rp__escenario" set:html={entrada.escenario} />}
        </div>
      )}

      <h3 class="qp__enunciado">{item.enunciado}</h3>

      {item.tipo === 'opcion-multiple' && (
        <ol class="qp__opciones">
          {item.opciones.map((opt, i) => {
            const sel = r === i;
            const corr = i === item.correcta;
            const sc = confirmada ? (corr ? 'is-correct' : sel ? 'is-incorrect' : '') : sel ? 'is-selected' : '';
            return (
              <li>
                <button type="button" class={['qp__opt', sc].join(' ').trim()} onClick={() => setRespuesta(i)} disabled={confirmada} aria-pressed={sel}>
                  <span class="qp__opt-letra">{String.fromCharCode(65 + i)}</span>
                  <span class="qp__opt-texto">{opt}</span>
                </button>
              </li>
            );
          })}
        </ol>
      )}

      {item.tipo === 'verdadero-falso' && (
        <div class="qp__vf">
          {[true, false].map((v) => {
            const sel = r === v;
            const corr = v === item.correcta;
            const sc = confirmada ? (corr ? 'is-correct' : sel ? 'is-incorrect' : '') : sel ? 'is-selected' : '';
            return (
              <button type="button" class={['qp__opt', sc].join(' ').trim()} onClick={() => setRespuesta(v)} disabled={confirmada} aria-pressed={sel}>
                <span class="qp__opt-texto">{v ? 'Verdadero' : 'Falso'}</span>
              </button>
            );
          })}
        </div>
      )}

      {item.tipo === 'numerico' && (
        <div class={['qp__num', confirmada ? (acerto ? 'is-correct' : 'is-incorrect') : ''].join(' ').trim()}>
          <label class="qp__num-label">
            <span>Tu respuesta</span>
            <span class="qp__num-field">
              <input type="text" inputmode="decimal" class="qp__num-input" disabled={confirmada}
                value={typeof r === 'number' && !Number.isNaN(r) ? numComma(r) : ''}
                onInput={(e) => { const raw = (e.currentTarget.value || '').replace(',', '.').trim(); setRespuesta(raw === '' ? null : Number(raw)); }} />
              {item.unidad && <span class="qp__num-unidad">{item.unidad}</span>}
            </span>
          </label>
        </div>
      )}

      {item.tipo === 'relacionar' && (
        <table class="qp__rel">
          <tbody>
            {item.izquierda.map((izq, li) => {
              const arr = Array.isArray(r) ? (r as number[]) : [];
              const chosen = arr[li] ?? -1;
              const okRow = confirmada && chosen === item.correctas[li];
              return (
                <tr class={confirmada ? (okRow ? 'is-ok' : 'is-fail') : ''}>
                  <td class="qp__rel-num">{li + 1}</td>
                  <td class="qp__rel-izq">{izq}</td>
                  <td class="qp__rel-der">
                    <select disabled={confirmada} value={String(chosen)} onChange={(e) => elegirRel(li, Number(e.currentTarget.value))}>
                      <option value="-1">— elige —</option>
                      {item.derecha.map((der, di) => (<option value={String(di)}>{String.fromCharCode(97 + di)}) {der}</option>))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {item.tipo === 'ordenar' && (
        <ul class="rp__ord">
          {ordArr.map((el, pos) => {
            const okRow = confirmada && el === item.elementos[pos];
            return (
              <li class={['rp__ord-item', confirmada ? (okRow ? 'is-ok' : 'is-fail') : ''].join(' ').trim()}>
                <span class="rp__ord-pos">{pos + 1}</span>
                <span class="rp__ord-text">{el}</span>
                {!confirmada && (
                  <span class="rp__ord-btns">
                    <button type="button" onClick={() => mover(pos, -1)} disabled={pos === 0} aria-label="Subir">↑</button>
                    <button type="button" onClick={() => mover(pos, 1)} disabled={pos === ordArr.length - 1} aria-label="Bajar">↓</button>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {item.tipo === 'abierta' && (
        <div class="rp__abierta">
          <textarea class="rp__abierta-input" rows={4} disabled={confirmada}
            value={typeof r === 'string' ? r : ''}
            placeholder="Escribe tu respuesta…"
            onInput={(e) => setRespuesta(e.currentTarget.value)} />
          {confirmada && (
            <div class="rp__modelo">
              <span class="rp__modelo-label">Respuesta modelo (compárala con la tuya):</span>
              <div class="rp__modelo-body" set:html={item.modelo} />
            </div>
          )}
        </div>
      )}

      {confirmada && item.tipo !== 'abierta' && (
        <div class={['qp__feedback', acerto ? 'is-ok' : 'is-fail'].join(' ')}>
          <strong>{acerto ? '¡Correcto!' : 'Incorrecto.'}</strong>
          {'explicacion' in item && item.explicacion && <p>{item.explicacion}</p>}
        </div>
      )}

      <div class="qp__actions">
        <button class="qp__btn qp__btn--ghost" type="button" onClick={anterior} disabled={estado.idx === 0}>← Anterior</button>
        {!confirmada ? (
          <button class="qp__btn qp__btn--primary" type="button" onClick={confirmar} disabled={!respondida(item, r)}>
            {item.tipo === 'abierta' ? 'Ver respuesta modelo' : 'Confirmar'}
          </button>
        ) : (
          <button class="qp__btn qp__btn--primary" type="button" onClick={siguiente}>
            {estado.idx + 1 === total ? 'Ver mi nivel' : 'Siguiente →'}
          </button>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `RetoPlayer.css`**

```css
/* New pieces only; shared widgets reuse QuizPlayer.css (qp__*). */
.rp__paso { margin: 0 0 1.2rem; padding: 0 0 0.8rem; border-bottom: 1px solid var(--color-line); }
.rp__paso-titulo { font-family: var(--font-serif); font-size: 1.15rem; font-weight: 500; margin: 0 0 0.5rem; color: var(--color-ink); }
.rp__escenario { font-size: 0.98rem; line-height: 1.6; color: var(--color-ink-soft); background: var(--color-bg); border-left: 3px solid var(--color-mustard); border-radius: 0 6px 6px 0; padding: 0.8rem 1rem; }
.rp__escenario :global(p) { margin: 0 0 0.5em; }
.rp__escenario :global(p:last-child) { margin-bottom: 0; }

.rp__ord { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.5rem; }
.rp__ord-item { display: flex; align-items: center; gap: 0.7rem; padding: 0.6rem 0.8rem; border: 1px solid var(--color-line); border-radius: 6px; background: var(--color-paper); }
.rp__ord-item.is-ok { border-color: #2f7d4f; background: #eef7f0; }
.rp__ord-item.is-fail { border-color: var(--color-terra); background: var(--color-terra-soft); }
.rp__ord-pos { font-family: var(--font-mono); font-size: 0.85rem; color: var(--color-ink-mute); width: 1.4rem; text-align: center; }
.rp__ord-text { flex: 1; line-height: 1.4; }
.rp__ord-btns { display: flex; gap: 0.3rem; }
.rp__ord-btns button { font-family: var(--font-sans); border: 1px solid var(--color-line); background: var(--color-bg); border-radius: 5px; width: 2rem; height: 2rem; cursor: pointer; color: var(--color-ink); }
.rp__ord-btns button:disabled { opacity: 0.35; cursor: default; }

.rp__abierta-input { width: 100%; box-sizing: border-box; font-family: var(--font-sans); font-size: 1rem; line-height: 1.5; padding: 0.7rem 0.9rem; border: 1px solid var(--color-line); border-radius: 6px; background: var(--color-paper); resize: vertical; }
.rp__modelo { margin-top: 0.7rem; padding: 0.8rem 1rem; background: var(--color-bg); border-left: 3px solid var(--color-mustard); border-radius: 0 6px 6px 0; }
.rp__modelo-label { display: block; font-family: var(--font-sans); font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--color-ink-mute); margin-bottom: 0.4rem; }
.rp__modelo-body { line-height: 1.6; color: var(--color-ink-soft); }
.rp__modelo-body :global(p) { margin: 0 0 0.5em; }

.rp__nivel { display: flex; flex-direction: column; gap: 0.2rem; margin: 0.5rem 0 1rem; padding: 1rem 1.2rem; border-radius: 8px; background: var(--color-bg); border: 1px solid var(--color-line); }
.rp__nivel--0 { border-left: 5px solid var(--color-ink-mute); }
.rp__nivel--1 { border-left: 5px solid var(--color-mustard); }
.rp__nivel--2 { border-left: 5px solid #2f7d4f; }
.rp__nivel-label { font-family: var(--font-sans); font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-ink-mute); }
.rp__nivel-name { font-family: var(--font-serif); font-size: 1.6rem; font-weight: 500; color: var(--color-ink); }
.rp__nivel-desc { font-size: 1rem; line-height: 1.6; color: var(--color-ink); margin: 0 0 1rem; }
.rp__comp { font-size: 0.92rem; line-height: 1.55; color: var(--color-ink-soft); border-top: 1px dashed var(--color-line); padding-top: 0.9rem; }
```

- [ ] **Step 3: Type-check**

Run: `npx astro check --minimumSeverity error 2>&1 | grep RetoPlayer`
Expected: no output. (Note: ~12 pre-existing unrelated errors in other files; ignore them.)

- [ ] **Step 4: Commit**

```bash
git add src/components/retos/RetoPlayer.tsx src/components/retos/RetoPlayer.css
git commit -m "feat(retos): add RetoPlayer interactive engine (6 item types + level ending)"
```

---

## Task 5: Routes — index + detail

**Files:**
- Create: `src/pages/[asignatura]/retos/index.astro`
- Create: `src/pages/[asignatura]/retos/[slug].astro`

- [ ] **Step 1: Create the index route**

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
import { ASIGNATURA_SLUGS, ASIGNATURAS } from '@/lib/asignaturas';
import { getCollection } from 'astro:content';
import type { GetStaticPaths } from 'astro';

export const getStaticPaths = (async () => {
  return ASIGNATURA_SLUGS.map((slug) => ({ params: { asignatura: slug }, props: { asignatura: ASIGNATURAS[slug] } }));
}) satisfies GetStaticPaths;

const { asignatura: a } = Astro.props;
const all = await getCollection('retos');
const retos = all
  .filter((r) => r.data.asignatura === a.slug && r.data.estado === 'publicado')
  .sort((x, y) => x.data.competencia.localeCompare(y.data.competencia));
---

<BaseLayout title={`Retos competenciales — ${a.shortLabel}`} description={`Retos competenciales interactivos de ${a.title}: escenarios paso a paso centrados en cada competencia específica, con tu nivel de logro al final.`}>
  <div class="container">
    <nav class="breadcrumb">
      <a href="/">Inicio</a> <span class="sep">›</span>
      <a href={`/${a.slug}/`}>{a.shortLabel}</a> <span class="sep">›</span>
      <span>Retos competenciales</span>
    </nav>
  </div>

  <section class="hero">
    <div class="container">
      <span class="kicker">{a.shortLabel} · retos competenciales</span>
      <h1>Retos competenciales</h1>
      <p class="lede">
        {retos.length === 0
          ? 'Los retos competenciales se publicarán a medida que se completen.'
          : 'Escenarios paso a paso centrados en una competencia específica. Resuélvelos en pantalla: al final te sitúan en tu nivel de logro.'}
      </p>
    </div>
  </section>

  {retos.length > 0 && (
    <section class="grid">
      <div class="container">
        <ul class="card-grid">
          {retos.map((reto) => {
            const slug = reto.id.split('/').pop()?.replace(/\.mdx?$/, '');
            return (
              <li class="card">
                <div class="card__num">{reto.data.competencia}</div>
                <h3 class="card__title">{reto.data.title}</h3>
                <p class="card__lede">{reto.data.descripcion}</p>
                <div class="card__meta">
                  {reto.data.duracion && <span>{reto.data.duracion}</span>}
                  {reto.data.unidad_relacionada && <span>· Unidad {reto.data.unidad_relacionada}</span>}
                </div>
                <a class="cta" href={`/${a.slug}/retos/${slug}/`}>Empezar reto →</a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  )}
</BaseLayout>

<style>
  .container { max-width: 1240px; margin: 0 auto; padding: 0 clamp(1.5rem, 4vw, 3rem); }
  .breadcrumb { font-size: 0.92rem; color: var(--color-ink-mute); margin: 2rem 0; }
  .breadcrumb a { color: var(--color-ink-mute); text-decoration: none; }
  .breadcrumb a:hover { color: var(--color-terra); }
  .breadcrumb .sep { margin: 0 0.5em; color: var(--color-mustard); }
  .hero { padding: 1rem 0 clamp(2rem, 5vw, 4rem); }
  h1 { margin: 1rem 0 0.6rem; }
  .lede { font-family: var(--font-serif); font-style: italic; font-size: 1.35rem; color: var(--color-ink-soft); max-width: 55ch; line-height: 1.5; margin: 1.5rem 0 0.6rem; font-variation-settings: "SOFT" 80; }
  .grid { padding-bottom: clamp(3rem, 7vw, 6rem); }
  .card-grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
  .card { background: var(--color-paper); border: 1px solid var(--color-line); border-radius: 8px; padding: 1.6rem 1.7rem 1.7rem; display: flex; flex-direction: column; gap: 0.6rem; transition: transform .2s var(--ease-soft), border-color .2s var(--ease-soft), box-shadow .2s var(--ease-soft); }
  .card:hover { border-color: var(--color-terra); transform: translateY(-2px); box-shadow: 0 4px 18px rgba(42, 31, 24, 0.08); }
  .card__num { font-family: var(--font-mono); font-size: 0.9rem; font-weight: 500; color: var(--color-terra); letter-spacing: 0.04em; }
  .card__title { font-family: var(--font-serif); font-size: 1.2rem; line-height: 1.25; color: var(--color-ink); margin: 0; font-weight: 500; font-variation-settings: "SOFT" 60; }
  .card__lede { font-family: var(--font-serif); font-style: italic; font-size: 0.95rem; color: var(--color-ink-soft); line-height: 1.45; margin: 0; font-variation-settings: "SOFT" 80; flex: 1; }
  .card__meta { font-family: var(--font-sans); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-ink-mute); margin-top: 0.4rem; display: flex; gap: 0.5rem; flex-wrap: wrap; }
  .cta { display: inline-flex; align-items: center; justify-content: center; padding: 0.6rem 0.9rem; background: var(--color-terra); color: var(--color-bg); border-radius: 5px; text-decoration: none; font-family: var(--font-sans); font-size: 0.92rem; font-weight: 600; margin-top: 0.6rem; transition: background .2s var(--ease-soft); }
  .cta:hover { background: var(--color-terra-deep); }
</style>
```

- [ ] **Step 2: Create the detail route**

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
import { ASIGNATURAS } from '@/lib/asignaturas';
import { getCollection } from 'astro:content';
import RetoPlayer from '@components/retos/RetoPlayer.tsx';
import { parseRetoFromMdxBody } from '@components/retos/parse-reto';
import { resolveNiveles, type NivelInfo } from '@/lib/retos';
import type { GetStaticPaths } from 'astro';

export const getStaticPaths = (async () => {
  const all = await getCollection('retos');
  return all
    .filter((r) => r.data.estado === 'publicado')
    .map((r) => {
      const slug = r.id.split('/').pop()?.replace(/\.mdx?$/, '') ?? r.id;
      return { params: { asignatura: r.data.asignatura, slug }, props: { reto: r } };
    });
}) satisfies GetStaticPaths;

const { reto } = Astro.props;
const a = ASIGNATURAS[reto.data.asignatura];
const data = parseRetoFromMdxBody(reto.body ?? '');

// Resolve the real achievement-level descriptors from the subject's evaluación.
const evalAll = await getCollection('evaluacion');
const evalEntry = evalAll.find((e) => e.data.asignatura === a.slug && e.data.estado === 'publicado');
const resolved = evalEntry ? resolveNiveles(evalEntry.data, reto.data.competencia) : null;
if (!resolved) {
  console.warn(`[retos] No 3-level competencia "${reto.data.competencia}" in evaluacion for ${a.slug} — using generic labels.`);
}
const niveles: NivelInfo[] = resolved?.niveles ?? [
  { nivel: 'En desarrollo', descriptor: '' },
  { nivel: 'Adecuado', descriptor: '' },
  { nivel: 'Avanzado', descriptor: '' },
];
const competenciaTexto = resolved?.competenciaTexto ?? '';
const slug = reto.id.split('/').pop()?.replace(/\.mdx?$/, '') ?? reto.id;
---

<BaseLayout title={`${reto.data.title} — ${a.shortLabel}`} description={reto.data.descripcion}>
  <div class="container">
    <nav class="breadcrumb">
      <a href="/">Inicio</a> <span class="sep">›</span>
      <a href={`/${a.slug}/`}>{a.shortLabel}</a> <span class="sep">›</span>
      <a href={`/${a.slug}/retos/`}>Retos competenciales</a> <span class="sep">›</span>
      <span>{reto.data.competencia}</span>
    </nav>
  </div>

  <section class="hero">
    <div class="container">
      <span class="kicker">Reto competencial · {reto.data.competencia}</span>
      <h1>{reto.data.title}</h1>
      <p class="lede">{reto.data.descripcion}</p>
      {reto.data.duracion && <p class="meta">{reto.data.duracion}</p>}
    </div>
  </section>

  <section class="player-wrap">
    <div class="container container--narrow">
      <RetoPlayer
        client:load
        reto={data}
        niveles={niveles}
        competenciaTexto={competenciaTexto}
        competenciaCodigo={reto.data.competencia}
        storageKey={`${a.slug}-${slug}`}
      />
    </div>
  </section>
</BaseLayout>

<style>
  .container { max-width: 1240px; margin: 0 auto; padding: 0 clamp(1.5rem, 4vw, 3rem); }
  .container--narrow { max-width: 760px; }
  .breadcrumb { font-size: 0.92rem; color: var(--color-ink-mute); margin: 2rem 0; }
  .breadcrumb a { color: var(--color-ink-mute); text-decoration: none; }
  .breadcrumb a:hover { color: var(--color-terra); }
  .breadcrumb .sep { margin: 0 0.5em; color: var(--color-mustard); }
  .hero { padding: 1rem 0 clamp(1.5rem, 4vw, 3rem); }
  h1 { max-width: 24ch; margin: 1rem 0 0.6rem; }
  .lede { font-family: var(--font-serif); font-style: italic; font-size: 1.3rem; color: var(--color-ink-soft); max-width: 55ch; margin: 1rem 0 1rem; line-height: 1.5; font-variation-settings: "SOFT" 80; }
  .meta { font-family: var(--font-sans); font-size: 0.92rem; color: var(--color-ink-mute); }
  .player-wrap { padding-bottom: clamp(3rem, 7vw, 6rem); }
</style>
```

- [ ] **Step 3: Type-check**

Run: `npx astro check --minimumSeverity error 2>&1 | grep "retos/"`
Expected: no output for the new route files.

- [ ] **Step 4: Commit**

```bash
git add "src/pages/[asignatura]/retos/index.astro" "src/pages/[asignatura]/retos/[slug].astro"
git commit -m "feat(retos): add index and detail routes"
```

---

## Task 6: Present the interactive trio on the subject hub

**Files:**
- Modify: `src/pages/[asignatura]/index.astro`

The `interactivo` group currently has a single conflated card. Add content-gated cards for
the three interactive types (Tests, Simuladores, Retos competenciales) while keeping the
existing actividades-dinámicas and EBAU cards.

- [ ] **Step 1: Add the content gates**

Near the existing `hasEvaluacion` / `hasRefuerzo` lookups (after `const evaluacionAll = ...`), add:

```ts
const testsAll = await getCollection('tests');
const hasTests = testsAll.some((t) => t.data.asignatura === a.slug && t.data.estado === 'publicado');
const recursosAll = await getCollection('recursos');
const hasRecursos = recursosAll.some((rec) => rec.data.asignatura === a.slug && rec.data.estado === 'publicado');
const retosAll = await getCollection('retos');
const hasRetos = retosAll.some((r) => r.data.asignatura === a.slug && r.data.estado === 'publicado');
```

- [ ] **Step 2: Rebuild the `interactivo` array**

Replace the current `interactivo` array:

```ts
const interactivo = [
  { slug: 'actividades-dinamicas', title: 'Actividades interactivas', desc: 'Tests autocorregibles, simuladores de decisión y recursos interactivos por unidad.' },
  ...(hasEbau ? [{ slug: 'ebau', title: 'Preparación EBAU', desc: 'Estructura de la prueba, teoría esencial, problemas resueltos y simulacros con solucionario.' }] : []),
];
```

with:

```ts
const interactivo = [
  ...(hasTests ? [{ slug: 'tests', title: 'Tests', desc: 'Tests autocorregibles por unidad: respuesta inmediata, nota y repaso en el navegador.' }] : []),
  ...(hasRecursos ? [{ slug: 'recursos', title: 'Simuladores', desc: 'Calculadoras y simuladores interactivos (punto muerto, VAN, equilibrio de mercado…) para experimentar con los modelos.' }] : []),
  ...(hasRetos ? [{ slug: 'retos', title: 'Retos competenciales', desc: 'Escenarios paso a paso centrados en una competencia específica; al final, tu nivel de logro.' }] : []),
  { slug: 'actividades-dinamicas', title: 'Árboles de decisión', desc: 'Casos con decisiones encadenadas: cada elección mueve unos indicadores y abre la siguiente.' },
  ...(hasEbau ? [{ slug: 'ebau', title: 'Preparación EBAU', desc: 'Estructura de la prueba, teoría esencial, problemas resueltos y simulacros con solucionario.' }] : []),
];
```

(The decision-tree card is retitled "Árboles de decisión" so the three new cards own the clearer names; its slug/route is unchanged.)

- [ ] **Step 3: Type-check + build**

Run: `npx astro check --minimumSeverity error 2>&1 | grep "asignatura]/index"`
Expected: no output.
Run: `npm run build 2>&1 | tail -5`
Expected: build succeeds (retos routes generate; with no published retos yet they generate index pages only, no detail — fine).

- [ ] **Step 4: Commit**

```bash
git add "src/pages/[asignatura]/index.astro"
git commit -m "feat(retos): present interactive practice as three distinct cards on the hub"
```

---

## Task 7: Pilot content — 3 retos for Eco 1BACH

**Files:**
- Create: `src/content/asignaturas/eco-1bach/retos/01-escasez-sistemas.mdx` (competencia CE1)
- Create: `src/content/asignaturas/eco-1bach/retos/02-mercados-agentes.mdx` (competencia CE2)
- Create: `src/content/asignaturas/eco-1bach/retos/03-sistema-financiero.mdx` (competencia CE4)

This is a **content** task. Dispatch one subagent per reto (3 total). Each reads the
matching competencia (código + descripción + the 3 `niveles`) from
`src/content/asignaturas/eco-1bach/evaluacion/evaluacion.mdx` and the relevant `libro`
units (`src/content/asignaturas/eco-1bach/libro/`) for source accuracy, then authors the
MDX.

**Each reto file structure:**

Frontmatter:
```yaml
---
asignatura: eco-1bach
competencia: "CE1"            # CE1 / CE2 / CE4 respectively
unidad_relacionada: 1          # a representative unit
title: "…"
descripcion: "…"
duracion: "15-20 min"
competencias_clave: [CCL, CPSAA]
estado: publicado
---
```

Body: prose intro (1-2 lines) then a single fenced ```json``` block matching the
parser schema (Task 2): `intro {kicker, titulo, contexto}` + `pasos[]`, each paso
`{ titulo, escenario?, items[] }`.

**Targets per reto:**
- 4-6 pasos forming one coherent scenario aligned to the competencia.
- A mix of item types across the reto: include at least one each of `opcion-multiple`,
  `verdadero-falso`, `numerico`, `relacionar`, `ordenar`, and one `abierta` (self-assessed,
  with a `modelo`). 10-16 auto-scored items total so the score→nivel mapping is meaningful.
- `escenario` HTML on the pasos that need data/context. All rich text is HTML strings.
- Numeric items must be arithmetically correct.
- The reto must genuinely exercise the competencia (e.g. CE1 = escasez, coste de
  oportunidad, FPP, sistemas económicos; CE2 = agentes y mercados, oferta/demanda,
  equilibrio; CE4 = sistema financiero, interés, productos financieros).

**JSON authoring rules (must parse):** valid JSON (double quotes, no trailing commas);
HTML inside string values only; no emojis; proper Spanish accents; `correcta` is a 0-based
index for opción múltiple and the chosen right-index array for relacionar; `elementos` in
`ordenar` are listed in the CORRECT order (the player shuffles them for display).

**Quality gate per reto (subagent self-checks before returning):** JSON parses; item-type
mix present; numbers correct; aligned to the real CE descriptor; `estado: publicado`.

- [ ] **Step 1: Author the 3 retos** (one subagent per file)

- [ ] **Step 2: Validate the collection compiles + retos parse**

Run: `npx astro sync && npx astro check --minimumSeverity error 2>&1 | grep "eco-1bach/retos"`
Expected: no output.
Run: `npm run build 2>&1 | tail -5`
Expected: build succeeds and the 3 detail routes are generated (the parser runs at build;
a malformed reto would fail the build here).
Confirm: `find dist -path "*eco-1bach/retos/*/index.html"` lists the index + 3 detail pages.

- [ ] **Step 3: Pau reviews the content** (manual gate — content accuracy is critical).

- [ ] **Step 4: Commit**

```bash
git add src/content/asignaturas/eco-1bach/retos
git commit -m "content(retos): add 3 Eco 1BACH competency challenges (CE1, CE2, CE4)"
```

---

## Task 8: Full verification

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: PASS, including the new `parseRetoFromMdxBody`, `nivelForScore`, `resolveNiveles` tests.

- [ ] **Step 2: Build**

Run: `npm run build 2>&1 | tail -5`
Expected: success.

- [ ] **Step 3: Manual dev-server check**

Run: `npm run dev`. Open `/eco-1bach/retos/` → 3 cards. Open one reto and:
- Resolve it end to end. Confirm: paso scenario shows at the first item of each paso;
  immediate feedback on the auto-scored items (incl. `ordenar` up/down and `relacionar`);
  `abierta` reveals the model answer and is NOT counted; the final screen shows a level
  whose index matches the score thresholds (<50 / 50-80 / ≥80) and the REAL descriptor
  text from `evaluacion.mdx`; "Volver a intentarlo" resets.
- Open the subject hub `/eco-1bach/` → the "Práctica interactiva" group shows Tests ·
  Simuladores · Retos competenciales (+ Árboles de decisión, EBAU if present).
- Open a subject with no retos (e.g. `/fopp-4eso/`) → no Retos card; its hub otherwise unchanged.

- [ ] **Step 4: Final commit (if any tweaks were needed)**

```bash
git add -A
git commit -m "chore(retos): polish after verification"
```

---

## Self-Review notes (coverage vs spec)

- Collection `retos` (frontmatter incl. `competencia` código): Task 1. ✓
- JSON-in-body structure + Zod validation + 6 item types (incl. `ordenar`, `abierta`): Task 2. ✓
- `nivelForScore` thresholds (<50/50-80/≥80) + `resolveNiveles` (with <3-levels fallback): Task 3. ✓
- `RetoPlayer` engine: scenario per paso, immediate feedback, `abierta` excluded from score, level ending with real descriptor; QuizPlayer untouched: Task 4. ✓
- Index + detail routes; detail resolves niveles from `evaluacion`, fallback + warn: Task 5. ✓
- Hub presents the interactive trio (gated), `/evaluacion/` untouched: Task 6. ✓
- Pilot: Eco 1BACH, 3 retos (CE1/CE2/CE4) with mixed item types: Task 7. ✓
- TDD for the pure logic (parser, nivelForScore, resolveNiveles): Tasks 2, 3. ✓
- Backward compatibility: new collection + new routes; other subjects show no Retos card (gate): Tasks 5, 6. ✓
- Verification (tests, build, manual flow incl. level mapping): Task 8. ✓
```
