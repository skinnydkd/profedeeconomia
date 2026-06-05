# Tests con tipos variados (Fase 1: sistema + pilot Eco 1BACH) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add three new self-assessment question types (true/false, numeric, matching) to the test system and enrich Eco 1BACH's 12 tests with them, without breaking the 88 existing multiple-choice tests.

**Architecture:** A discriminated-union schema (`tipo`) with a preprocess that defaults legacy questions to `opcion-multiple`. The Preact `QuizPlayer` island dispatches render + grading per type. The static print route renders each type + a per-type solucionario.

**Tech Stack:** Astro 5 content collections + Zod, Preact island, paged.js print.

---

## File structure

- **Modify** `src/content.config.ts` — `tests` schema → discriminated union with backward-compat preprocess.
- **Modify** `src/components/QuizPlayer.tsx` — type-aware render + grading.
- **Modify** `src/components/QuizPlayer.css` — styles for the new inputs (numeric, V/F, matching).
- **Modify** `src/pages/[asignatura]/actividades/imprimir/[modo].astro` — per-type print + solucionario.
- **Modify** the 12 files `src/content/asignaturas/eco-1bach/tests/*.md` — enrich with new types.

---

## Task 1: Schema — discriminated union with backward compat

**Files:** Modify `src/content.config.ts` (`tests` collection, currently `preguntas: z.array(z.object({ enunciado, opciones, correcta, explicacion }))`).

- [ ] **Step 1: Replace the `preguntas` shape** with a discriminated union, wrapped in a preprocess that injects `tipo: 'opcion-multiple'` when missing:

```ts
const baseMC = z.object({
  tipo: z.literal('opcion-multiple'),
  enunciado: z.string(),
  opciones: z.array(z.string()).min(2).max(6),
  correcta: z.number().int().min(0),
  explicacion: z.string().optional(),
});
const baseVF = z.object({
  tipo: z.literal('verdadero-falso'),
  enunciado: z.string(),
  correcta: z.boolean(),
  explicacion: z.string().optional(),
});
const baseNum = z.object({
  tipo: z.literal('numerico'),
  enunciado: z.string(),
  respuesta: z.number(),
  tolerancia: z.number().min(0).default(0),
  unidad: z.string().optional(),
  explicacion: z.string().optional(),
});
const baseRel = z.object({
  tipo: z.literal('relacionar'),
  enunciado: z.string(),
  izquierda: z.array(z.string()).min(2),
  derecha: z.array(z.string()).min(2),
  correctas: z.array(z.number().int().min(0)),
  explicacion: z.string().optional(),
}).refine((q) => q.correctas.length === q.izquierda.length && q.derecha.length === q.izquierda.length,
  { message: 'relacionar: izquierda, derecha y correctas deben tener la misma longitud' });

const preguntaSchema = z.preprocess(
  (val) => (val && typeof val === 'object' && !('tipo' in val) ? { ...val, tipo: 'opcion-multiple' } : val),
  z.discriminatedUnion('tipo', [baseMC, baseVF, baseNum, baseRel]),
);
```

Then in the `tests` collection schema, replace the `preguntas` field with:
```ts
    preguntas: z.array(preguntaSchema).min(1),
```

- [ ] **Step 2: Verify backward compat** — the 88 existing tests have no `tipo`.

Run: `npx astro check 2>&1 | head -20`
Expected: no Zod errors. Then `npx astro build 2>&1 | tail -3` → green (existing tests still parse as `opcion-multiple`).

- [ ] **Step 3: Commit**

```bash
git add src/content.config.ts
git commit -m "feat(tests): discriminated-union schema for question types (backward compatible)"
```

---

## Task 2: `QuizPlayer` — type-aware render + grading

**Files:** Modify `src/components/QuizPlayer.tsx`.

- [ ] **Step 1: Replace the `Pregunta` type** (lines 6-11) with the union, and add a `Respuesta` type:

```ts
export type Pregunta =
  | { tipo: 'opcion-multiple'; enunciado: string; opciones: string[]; correcta: number; explicacion?: string }
  | { tipo: 'verdadero-falso'; enunciado: string; correcta: boolean; explicacion?: string }
  | { tipo: 'numerico'; enunciado: string; respuesta: number; tolerancia?: number; unidad?: string; explicacion?: string }
  | { tipo: 'relacionar'; enunciado: string; izquierda: string[]; derecha: string[]; correctas: number[]; explicacion?: string };

/** MC/numeric → number, V/F → boolean, relacionar → number[] (chosen right index per left, -1 unset). */
export type Respuesta = number | boolean | number[] | null;
```

- [ ] **Step 2: Update `Estado.respuestas`** type (line 24) to `(Respuesta)[]` and add grading helpers (place after `emptyState`):

```ts
function respondida(p: Pregunta, r: Respuesta): boolean {
  switch (p.tipo) {
    case 'opcion-multiple':
    case 'verdadero-falso': return r !== null;
    case 'numerico': return typeof r === 'number' && !Number.isNaN(r);
    case 'relacionar': return Array.isArray(r) && r.length === p.izquierda.length && r.every((x) => x >= 0);
  }
}
function esCorrecta(p: Pregunta, r: Respuesta): boolean {
  switch (p.tipo) {
    case 'opcion-multiple':
    case 'verdadero-falso': return r === p.correcta;
    case 'numerico': return typeof r === 'number' && Math.abs(r - p.respuesta) <= (p.tolerancia ?? 0);
    case 'relacionar': return Array.isArray(r) && p.correctas.every((c, i) => r[i] === c);
  }
}
```

- [ ] **Step 3: Replace index-based grading** everywhere with the helpers:
- `aciertos` (lines 58-64): `acc + (esCorrecta(preguntas[i], r) ? 1 : 0)`.
- The progress dots (lines 198-199): use `esCorrecta(preguntas[i], estado.respuestas[i])`.
- `acerto`/`fallo` (lines 184-185): `const acerto = confirmada && esCorrecta(pregunta, respuestaActual);` and `const fallo = confirmada && !acerto;`.
- `confirmar` enable / `confirmar()` guard (line 81, 261): replace `respuestaActual === null` with `!respondida(pregunta, respuestaActual)`.
- The review screen `ok` (line 148): `esCorrecta(p, estado.respuestas[i])`.

- [ ] **Step 4: Replace the answer-input block** (the `<ol class="qp__opciones">` at lines 212-238) with a per-type render. Add an `elegirRel(li, di)` helper for matching and keep `elegir(i)` for MC. Render:

```tsx
{pregunta.tipo === 'opcion-multiple' && (
  <ol class="qp__opciones">
    {pregunta.opciones.map((opt, i) => {
      const sel = respuestaActual === i, corr = i === pregunta.correcta;
      const sc = confirmada ? (corr ? 'is-correct' : sel ? 'is-incorrect' : '') : sel ? 'is-selected' : '';
      return <li><button type="button" class={['qp__opt', sc].join(' ').trim()} onClick={() => elegir(i)} disabled={confirmada} aria-pressed={sel}>
        <span class="qp__opt-letra">{String.fromCharCode(65 + i)}</span><span class="qp__opt-texto">{opt}</span>
      </button></li>;
    })}
  </ol>
)}

{pregunta.tipo === 'verdadero-falso' && (
  <div class="qp__vf">
    {[true, false].map((v) => {
      const sel = respuestaActual === v, corr = v === pregunta.correcta;
      const sc = confirmada ? (corr ? 'is-correct' : sel ? 'is-incorrect' : '') : sel ? 'is-selected' : '';
      return <button type="button" class={['qp__opt', sc].join(' ').trim()} onClick={() => elegir(v as unknown as number)} disabled={confirmada} aria-pressed={sel}>
        {v ? 'Verdadero' : 'Falso'}
      </button>;
    })}
  </div>
)}

{pregunta.tipo === 'numerico' && (
  <div class="qp__num">
    <label>
      <span class="qp__num-label">Tu respuesta</span>
      <input type="text" inputmode="decimal" class="qp__num-input" disabled={confirmada}
        value={typeof respuestaActual === 'number' && !Number.isNaN(respuestaActual) ? String(respuestaActual).replace('.', ',') : ''}
        onInput={(e) => { const v = (e.currentTarget.value || '').replace(',', '.').trim(); elegir(v === '' ? (null as unknown as number) : Number(v)); }} />
      {pregunta.unidad && <span class="qp__num-unidad">{pregunta.unidad}</span>}
    </label>
  </div>
)}

{pregunta.tipo === 'relacionar' && (
  <table class="qp__rel">
    <tbody>
      {pregunta.izquierda.map((izq, li) => {
        const arr = Array.isArray(respuestaActual) ? respuestaActual : [];
        const chosen = arr[li] ?? -1;
        const okRow = confirmada && chosen === pregunta.correctas[li];
        return <tr class={confirmada ? (okRow ? 'is-ok' : 'is-fail') : ''}>
          <td class="qp__rel-izq">{izq}</td>
          <td class="qp__rel-der">
            <select disabled={confirmada} value={String(chosen)} onChange={(e) => elegirRel(li, Number(e.currentTarget.value))}>
              <option value="-1">— elige —</option>
              {pregunta.derecha.map((der, di) => <option value={String(di)}>{der}</option>)}
            </select>
          </td>
        </tr>;
      })}
    </tbody>
  </table>
)}
```

And add `elegirRel` near `elegir`:
```ts
function elegirRel(li: number, di: number) {
  if (confirmada) return;
  setEstado((s) => {
    const respuestas = [...s.respuestas];
    const p = preguntas[s.idx];
    const base = Array.isArray(respuestas[s.idx]) ? [...(respuestas[s.idx] as number[])] : new Array(p.tipo === 'relacionar' ? p.izquierda.length : 0).fill(-1);
    base[li] = di;
    respuestas[s.idx] = base;
    return { ...s, respuestas };
  });
}
```

- [ ] **Step 5: Update the feedback + review** to show the correct answer per type. In the feedback block, after the explanation, for `relacionar` the per-row colouring already shows it; for the others the `is-correct`/`is-incorrect` classes suffice. In the **review screen** (lines 145-166), replace the `Tu respuesta` / `Correcta` lines with a helper `formatResp(p, r)`:

```ts
function formatResp(p: Pregunta, r: Respuesta): string {
  if (r === null || r === undefined) return '— sin responder —';
  switch (p.tipo) {
    case 'opcion-multiple': return typeof r === 'number' ? p.opciones[r] : '—';
    case 'verdadero-falso': return r ? 'Verdadero' : 'Falso';
    case 'numerico': return typeof r === 'number' ? String(r).replace('.', ',') + (p.unidad ? ' ' + p.unidad : '') : '—';
    case 'relacionar': return Array.isArray(r) ? r.map((d, i) => `${i + 1}→${d >= 0 ? String.fromCharCode(97 + d) : '·'}`).join(' ') : '—';
  }
}
function formatCorr(p: Pregunta): string {
  switch (p.tipo) {
    case 'opcion-multiple': return p.opciones[p.correcta];
    case 'verdadero-falso': return p.correcta ? 'Verdadero' : 'Falso';
    case 'numerico': return String(p.respuesta).replace('.', ',') + (p.unidad ? ' ' + p.unidad : '');
    case 'relacionar': return p.correctas.map((d, i) => `${i + 1}→${String.fromCharCode(97 + d)}`).join(' ');
  }
}
```
Use `formatResp(p, estado.respuestas[i])` and `formatCorr(p)` in the review list.

- [ ] **Step 6: Build + smoke-test**

Run: `npx astro build 2>&1 | tail -3` → green.

- [ ] **Step 7: Commit**

```bash
git add src/components/QuizPlayer.tsx
git commit -m "feat(tests): QuizPlayer renders and grades the four question types"
```

---

## Task 3: Styles for the new inputs

**Files:** Modify `src/components/QuizPlayer.css`.

- [ ] **Step 1:** Add styles mirroring `.qp__opt` for the new controls:
- `.qp__vf` — flex row, two wide buttons (reuse `.qp__opt`).
- `.qp__num-input` — a bordered number input with `:focus-visible` ring; `.qp__num-label` eyebrow; `.qp__num-unidad` muted suffix.
- `.qp__rel` — table; `.qp__rel-izq` left cell (mustard left border), `.qp__rel-der select` styled select; `tr.is-ok`/`tr.is-fail` tint rows on confirm.
Match the existing palette tokens (`--color-mustard`, `--color-terra`, `--color-line`).

- [ ] **Step 2: Commit**

```bash
git add src/components/QuizPlayer.css
git commit -m "feat(tests): styles for true/false, numeric and matching inputs"
```

---

## Task 4: Print rendering per type

**Files:** Modify `src/pages/[asignatura]/actividades/imprimir/[modo].astro` (test block ~563-577, solucionario ~586-594).

- [ ] **Step 1: Render each question by type** in the `.test` section. Replace the single `q.opciones.map(...)` with a per-type branch:
- `opcion-multiple` (and legacy without tipo): the current `<ul class="q__opts">` with letters.
- `verdadero-falso`: `<p class="q__vf">Verdadero ☐   Falso ☐</p>`.
- `numerico`: `<p class="q__num">Respuesta: <span class="q__blank"></span> {q.unidad}</p>` (a blank underline).
- `relacionar`: a two-column block — left items numbered (1, 2, 3…), right items lettered (a, b, c…) in a separate column, with a blank to write the letter.
Guard the type on `(q.tipo ?? 'opcion-multiple')`.

- [ ] **Step 2: Update the solucionario** (profesor) per type:
- `opcion-multiple`: `letra(q.correcta))` (current).
- `verdadero-falso`: `q.correcta ? 'Verdadero' : 'Falso'`.
- `numerico`: `q.respuesta + (q.unidad ? ' '+q.unidad : '')`.
- `relacionar`: `q.correctas.map((d,i)=> (i+1)+'→'+letra(d)).join(', ')`.
Keep showing `q.explicacion`.

- [ ] **Step 3: Add minimal print CSS** for `.q__vf`, `.q__num .q__blank` (underline), and the relacionar two-column layout, in the route's `<style is:inline>`.

- [ ] **Step 4: Build**

Run: `npx astro build 2>&1 | tail -3` → green.

- [ ] **Step 5: Commit**

```bash
git add "src/pages/[asignatura]/actividades/imprimir/[modo].astro"
git commit -m "feat(tests): print + solucionario render the new question types"
```

---

## Task 5: Enrich Eco 1BACH's 12 tests (pilot content)

**Files:** Modify each `src/content/asignaturas/eco-1bach/tests/*.md` (01..12).

- [ ] **Step 1: Per test, reach ~12 questions with a fitting mix.** Keep the existing MC (add `tipo: opcion-multiple` is OPTIONAL — legacy parse works, but for clarity add it as you touch each). Add to each test:
- 1-2 **`verdadero-falso`** razonado (with `explicacion`).
- a **`numerico`** where the unit is quantitative: u3 (interés compuesto / cuota), u4-u5 (equilibrio, elasticidad), u7-u8 (tasas macro, PIB), u9 (tasa de paro), u10 (multiplicador del dinero), u11 (multiplicador del gasto). Use `respuesta` + `tolerancia` (e.g. 0.01) + `unidad`.
- one **`relacionar`** where there are concepts to pair: u4 (estructuras de mercado ↔ definición), u6 (fallos de mercado ↔ ejemplo), u9 (tipos de paro ↔ definición), u10 (agregados monetarios ↔ qué incluyen), u11 (política ↔ instrumento). 4 pairs typical.
Author in the project voice; keep correct accents; no emojis; explanations on every new question. Numbers must be correct (verify each `numerico` answer).

YAML shape for the new types:
```yaml
  - tipo: verdadero-falso
    enunciado: "La curva de demanda siempre tiene pendiente negativa, sin excepciones."
    correcta: false
    explicacion: "Hay excepciones teóricas (bienes Giffen y Veblen), donde la cantidad demandada sube con el precio."
  - tipo: numerico
    enunciado: "Si el precio sube de 10 € a 12 € y la cantidad cae de 100 a 90 uds, ¿cuál es la elasticidad-precio (método simple, 2 decimales)?"
    respuesta: -0.5
    tolerancia: 0.05
    unidad: ""
    explicacion: "E = (ΔQ/Q)/(ΔP/P) = (−10/100)/(2/10) = −0,10/0,20 = −0,5."
  - tipo: relacionar
    enunciado: "Relaciona cada estructura de mercado con su rasgo definitorio:"
    izquierda: ["Competencia perfecta", "Monopolio", "Oligopolio", "Competencia monopolística"]
    derecha: ["Una empresa fija el precio", "Muchas empresas, producto idéntico, precio dado", "Pocas empresas interdependientes", "Muchas empresas, producto diferenciado"]
    correctas: [1, 0, 2, 3]
    explicacion: "Competencia perfecta: precio-aceptante; monopolio: precio-fijador; oligopolio: interdependencia; competencia monopolística: diferenciación."
```

- [ ] **Step 2: Build + verify the schema accepts all 12**

Run: `npx astro build 2>&1 | tail -3` → green.

- [ ] **Step 3: Spot-check the interactive quiz** — open `/eco-1bach/tests/04-oferta-demanda-mercado/` (dev): the new types render, grade and give feedback.

- [ ] **Step 4: Commit**

```bash
git add src/content/asignaturas/eco-1bach/tests/
git commit -m "feat(tests): enrich Eco 1BACH tests with varied question types (~12 q each)"
```

---

## Task 6: Final verification + regenerate the workbook PDF

- [ ] **Step 1: Full build**

Run: `npx astro build` → green.

- [ ] **Step 2: Regenerate the Eco 1BACH activity workbook** (it includes the tests):

Run: `npm run build:workbooks eco-1bach 2>&1 | tail -5` (or the equivalent invocation; check `package.json`/`scripts/build-workbook-pdf.mjs` for the filter argument). Open the profesor PDF and confirm the new question types + their solucionario render correctly (V/F, numeric blank, matching two columns).

- [ ] **Step 3: Run the existing test**

Run: `npm test 2>&1 | tail -10`
Expected: `QuizPlayer.test.ts` passes (update it if it asserts the old `Pregunta` shape).

- [ ] **Step 4: Commit any PDF/test updates**

```bash
git add public/downloads/eco-1bach-cuaderno-actividades-*.pdf src/components/QuizPlayer.test.ts
git commit -m "chore(tests): regenerate Eco 1BACH workbook; update QuizPlayer test"
```

---

## Done criteria

- Schema accepts the 4 types; the other 88 tests still validate untouched.
- `QuizPlayer` renders + grades MC, V/F, numeric and matching, with feedback and nota.
- Print + solucionario render all four types.
- Eco 1BACH's 12 tests have ~12 questions with a fitting mix.
- `astro build` green; workbook PDF regenerates; `npm test` passes.

## Self-review

- **Spec coverage:** schema + backward compat (T1), QuizPlayer type-aware render+grading (T2-T3), print + solucionario (T4), pilot content (T5), verification + PDF (T6). All four types covered in every layer. Backward compat via preprocess (T1). Other 8 books explicitly Fase 2.
- **Placeholder scan:** concrete Zod schema, full grading helpers, full per-type render JSX, YAML examples for the three new types, and the per-unit type-assignment guidance. Print/CSS steps describe exact markup per type.
- **Naming consistency:** `tipo` values (`opcion-multiple`, `verdadero-falso`, `numerico`, `relacionar`) identical across schema (T1), `Pregunta` union + helpers (T2), print branches (T4) and authored content (T5). Field names (`respuesta`/`tolerancia`/`unidad`; `izquierda`/`derecha`/`correctas`) consistent schema↔component↔content.
