# CA Fase 2D — The `/generadores/` detail page + its 6 Preact islands

> **For agentic workers:** REQUIRED SUB-SKILL: `superpowers:executing-plans`. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Under `/ca/*`, a teacher who opens a teacher-tool generator gets a Valencian detail page and a Valencian interactive island. Fase 2A localized the `/generadores/` hub cards; this localizes the tools themselves.

**Phase before:** Fase 2C (`/herramientas/` detail page + 22 islands), PR #195, merged `1f322c4`. This phase is the exact same recipe on the 6 teacher-tool islands.

## Design

Identical to Fase 2C:
- Islands take an explicit `locale?: Locale` prop (default `'es'`), never derive it. `GeneradorIsland.astro` (single dispatch) forwards `locale`.
- The two mount points that stay ES: none other than `/generadores/[slug]` renders these — they are teacher-only tools, not embedded in book units. So the dispatch always forwards the page locale. (Confirm no other `GeneradorIsland`/direct-import usage exists before assuming this.)
- Each island exports a local `COPY = { es, ca }` and reads `COPY[locale]`.
- `localizeGeneradorNativo` (from `src/i18n/generadores-ca.ts`, Fase 2A) already localizes the detail page's `title`/`descripcion`/`comoUsar`.

## Global Constraints

- **Valencian, AVL norm.** Glossary-consistent with Fases 1–2C (e.g. "ferramenta" not "eina"; "nivell d'assoliment"; "servici"; incoatius en -ix; "este/esta"). No auto-publish.
- **Strings only.** No changes to any island's logic, storage keys, ids, hooks, CSS, or markup structure. These are fillable teacher templates with localStorage + export/print — treat storage keys and field ids as structural (ES).
- **TypeScript strict, no `any`.** Comments in English. Conventional Commits. No emojis.
- **Verification:** `npm run check` clean; a `copy-parity.test.ts` in `src/components/generadores/`; Vercel PR preview is authoritative.
- **Branch:** `feat/ca-fase2d-islas-generadores` from `main` (`1f322c4`).

---

### Task 1: Locale plumbing + detail page chrome

**Files:**
- Modify: `src/components/generadores/GeneradorIsland.astro` (add `locale` prop, forward to every island)
- Modify: `src/pages/generadores/[slug].astro` (breadcrumb, tipo eyebrow via `t('tipo.*')`, back-link, meta; `localizeGeneradorNativo`; `contentLang={locale}`)
- Modify: `src/i18n/ui.ts` (add `generadores.volver` in both `es`/`ca`)

- [ ] **Step 1: `GeneradorIsland.astro`** — `interface Props { componente?: string; locale?: Locale }`, default `'es'`, pass `locale={locale}` to every island.
- [ ] **Step 2: `[slug].astro`** — `getLocale`; run `g` through `localizeGeneradorNativo`; replace inline `TIPO_LABEL` with `t('tipo.*')` if the eyebrow is shown (note: this page does NOT currently show a tipo eyebrow — verify; the `TIPO_LABEL` const at line 14 may be dead code, remove if unused); add `copy = {es,ca}[locale]` for breadcrumb + back-link + meta suffix; `contentLang={locale}`.
- [ ] **Step 3:** `npm run check` → 0 new errors.
- [ ] **Step 4: Commit.** `feat(i18n): pass locale into generador islands and localize the generador detail page`

---

### Task 2: Pilot island + parity guard

**Files:**
- Modify: `src/components/generadores/RubricaGenerator.tsx` (the biggest / most representative)
- Create: `src/components/generadores/copy-parity.test.ts` (mirror `src/components/calculadoras/copy-parity.test.ts` exactly — same recursive key-set + non-empty assertions)

- [ ] **Step 1:** Write the parity test importing only `RubricaGenerator`'s `COPY`; run to confirm it fails (no export yet).
- [ ] **Step 2:** Implement the pilot: `export const COPY = { es, ca }`, `interface Props { locale?: Locale }`, `const c = COPY[locale]`, swap strings. Structural ids / storage keys stay ES.
- [ ] **Step 3:** Test passes; `npm run check` clean.
- [ ] **Step 4: Commit.** `feat(i18n): translate the rúbrica generator island to Valencian`

---

### Task 3: The remaining 5 islands

Same recipe, dispatched in parallel (independent, no shared state): `CalificacionesCalc`, `Autoevaluacion`, `PlanRefuerzo`, `RegistroAula`, `MedidasDUA`. Register each in the dispatch + parity test as it lands.

- [ ] **Step 1:** Fan out; commit in batches.
- [ ] **Step 2:** `npx vitest run` — parity green for all 6.
- [ ] **Step 3:** `npm run check` — 0 new errors; leftover-Spanish grep on each island clean.

---

## Final verification

- [ ] `npm run check` — 0 new errors.
- [ ] `npx vitest run` — full suite green.
- [ ] Push, open PR. **Vercel preview is authoritative**; confirm the deployment check is `pass` before merge.
- [ ] Surface for Pau's VAL review: the 6 `COPY.ca` blocks + the detail page `copy.ca` + the new `generadores.volver` key.

## Out of scope (later phases)

The 55 game islands; MDX bodies of the 61 transversal fichas; the 88 book units; PDFs/slides in VAL; CV-Europass generated-PDF strings; `inLanguage` in the JSON-LD.
