# CA Fase 2C — The `/herramientas/` detail page and its 22 Preact islands

> **For agentic workers:** REQUIRED SUB-SKILL: `superpowers:executing-plans`. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Under `/ca/*`, a teacher who clicks a tool card gets a Valencian tool. Today the `/herramientas/` hub is VAL (Fase 2A) but the detail page and the interactive island behind it are still ES.

**Phases before:** 2A (hub cards from code) PR #193 · 2B (transversal card frontmatter) PR #194 — both merged.

## Design

Islands take an explicit **`locale` prop**; they never derive it themselves. `HerramientaIsland.astro` is the single dispatch point and forwards `locale` (default `'es'`) to whichever island it renders.

This matters because the same islands are embedded in **two other places** that are *not* localized: the per-asignatura recurso page (`/[asignatura]/recursos/[slug].astro`) and the slide renderer (`SlideDiagramMount.astro`). Those pages are ES content under `/ca` (fallback), so they must keep passing no locale and get the ES default. A calculator that read `Astro.currentLocale` itself would render VAL inside an ES book unit.

Each island keeps its strings in a **local exported `COPY = { es, ca }` object** and reads `COPY[locale]`. No new i18n module, no cross-file churn: the diff stays inside the island it belongs to. A single parity test imports every island's `COPY` and asserts `es` and `ca` have identical key sets, so a missed string fails CI rather than silently falling back.

## Global Constraints

- **Valencian, AVL norm.** Glossary-consistent with Fases 1/2A/2B (e.g. "ferramentes" not "eines"; "nivell d'assoliment"; "servici"). No auto-publish — every VAL string is for Pau's later review.
- **Strings only.** No changes to any island's maths, state, hooks or markup structure. A translation PR that alters `useMemo` logic is a bug.
- **Economic notation is not translated**: `VAN`, `TIR`, `DCF`, `IRPF`, `DAFO`, `BCG`, `RIASEC`, `Q*`, `CF`, `CVu`, `€/mes`, `%`.
- **TypeScript strict, no `any`.** Comments in English. Conventional Commits. No emojis.
- **Verification:** `npm run check` clean; `npx vitest run`; Vercel PR preview is the authoritative build (local long builds get killed here).
- **Branch:** `feat/ca-fase2c-islas-herramientas` from `main` (2B merged, `dff2768`).

---

### Task 1: Locale plumbing + detail page chrome

**Files:**
- Modify: `src/components/calculadoras/HerramientaIsland.astro` (add `locale` prop, forward it, localize the print note)
- Modify: `src/pages/herramientas/[familia]/[slug].astro` (breadcrumb, tipo eyebrow, «Competencias que se trabajan», back-link, meta; card fields via `localizeHerramienta`)

- [ ] **Step 1: `HerramientaIsland.astro`** — `interface Props { componente?: string; locale?: Locale }`, default `'es'`, pass `locale={locale}` to every island. Localize the print-only note.
- [ ] **Step 2: Detail page** — `getLocale(Astro.currentLocale)`; run `h` through `localizeHerramienta` and `famMeta` through `localizeFamilias`; replace the inline `TIPO_LABEL` with `t('tipo.*')`; add a `copy = {es,ca}[locale]` for the breadcrumb, the competences headings and the back-link; `contentLang={locale}`.
- [ ] **Step 3: Verify the other two mount points are untouched** — `/[asignatura]/recursos/[slug].astro` and `SlideDiagramMount.astro` must NOT pass `locale`, so their islands stay ES. Grep to confirm.
- [ ] **Step 4:** `npm run check` → 0 new errors.
- [ ] **Step 5: Commit.** `feat(i18n): pass locale into tool islands and localize the herramienta detail page`

---

### Task 2: Pilot island + the parity guard

**Files:**
- Modify: `src/components/calculadoras/PuntoMuertoCalc.tsx`
- Create: `src/components/calculadoras/copy-parity.test.ts`

- [ ] **Step 1: Write the failing test.** `copy-parity.test.ts` imports `COPY` from every island listed in `HerramientaIsland.astro` and, per island, asserts `Object.keys(COPY.es)` equals `Object.keys(COPY.ca)` (sorted) and that no `ca` value is empty. Start it with just `PuntoMuertoCalc`; it fails because `COPY` is not exported yet.
- [ ] **Step 2: Run to verify it fails.** `npx vitest run src/components/calculadoras/copy-parity.test.ts`.
- [ ] **Step 3: Implement the pilot.** In `PuntoMuertoCalc.tsx`: add `export const COPY = { es: {...}, ca: {...} }`, `interface Props { locale?: Locale }`, `const c = COPY[locale]`, and swap every hardcoded ES string for `c.<key>`. Logic untouched.
- [ ] **Step 4:** Test passes; `npm run check` clean.
- [ ] **Step 5: Commit.** `feat(i18n): translate the punto muerto island to Valencian`

---

### Task 3: The remaining 21 islands

Same recipe as Task 2, one island at a time, **dispatched in parallel** (`superpowers:dispatching-parallel-agents`) since the islands share no state. Each worker: export `COPY`, add the `locale` prop, swap the strings, leave the maths alone, add its island to `copy-parity.test.ts`.

Islands: `VANTIRCalc`, `RatiosCalc`, `ADASSimulator`, `InteresCompuestoCalc`, `CalculadoraNominaESO`, `CalculadoraPresupuesto503020`, `BuscadorItinerarios`, `GeneradorCVEuropass`, `DCFCalc`, `RatiosBenchmark`, `ElasticidadCalc`, `MultiplicadorGasto`, `IRPFDeclaracion`, `CocheVsAlternativa`, `RIASECTest`, `PresupuestoUni`, `ProductividadCalc`, `EquilibrioCalc`, `DAFOCanvas`, `BusinessModelCanvas`, `MatrizBCG`.

- [ ] **Step 1:** Fan out; each island in its own commit or one batched commit per group of ~5.
- [ ] **Step 2:** `npx vitest run` — parity test green for all 22.
- [ ] **Step 3:** `npm run check` — 0 new errors.

---

## Final verification

- [ ] `npm run check` — 0 new errors.
- [ ] `npx vitest run` — full suite green.
- [ ] Spot-check that `/[asignatura]/recursos/*` and the slide decks still render their islands in ES.
- [ ] Push, open PR. **The Vercel preview is authoritative**; confirm the deployment check is `pass` before merge.
- [ ] Surface for Pau's VAL review: the 22 `COPY.ca` blocks + the detail page `copy.ca`.

## Out of scope (later phases)

The 6 `/generadores/` islands and their detail pages (Fase 2D); the 55 game islands; MDX bodies of the 61 transversal fichas; the 88 book units; PDFs/slides in VAL; `inLanguage` in the JSON-LD.
