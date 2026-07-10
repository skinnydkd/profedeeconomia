# CA Fase 2B — Frontmatter of the transversal cards

> **For agentic workers:** REQUIRED SUB-SKILL: `superpowers:executing-plans`. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Under `/ca/*`, render the 61 hub cards of `/debates/`, `/dinamicas/` and `/proyectos/` in Valencian. Fase 2A translated their *family headers* and left the cards ES, so those three hubs currently read VAL-chrome over ES-cards.

**Phase before:** Fase 2A (hub cards whose text lives in code) — plan `2026-07-08-ca-translation-fase2a-hub-cards.md`, merged in PR #193.

## Design

The card text lives in **MDX frontmatter**, not in code. Duplicating the MDX under `/ca/` would break the project's single-source-of-truth rule, so we reuse the Fase 2A overlay pattern instead: one TS overlay per collection, keyed by the entry's stripped id (`familia/nn-slug`), spread over `entry.data` at render time.

Only the four fields the hub cards render are translated:

| Field | Rendered on | Example |
|---|---|---|
| `title` | card `<h3>` | «El salario mínimo, ¿ayuda o destruye empleo?» |
| `descripcion` | card `<p>` | one-line summary |
| `duracion` | card meta | `"50-55 min"`, `"5-6 sesiones"` |
| `agrupacion` | card meta (debates, dinámicas) | `"Equipos de 3-4"` |

`nivel` is already localized through `t('nivel.*')` (proyectos). All other frontmatter (`mocion`, `objetivos`, `posturas`, `reto`, `producto_final`, `conceptos_clave`…) and the MDX **body** stay ES.

**Detail pages stay fully ES.** The overlay is applied *only* where the hub renders its cards. A detail page reads its own frontmatter, so it keeps its ES title over its ES body — internally coherent. Translating detail titles would leave a VAL heading on ES prose; that is the content phase's job, not this one.

## Global Constraints

- **Valencian, AVL norm.** Glossary-consistent with Fase 1 / 2A (e.g. "ferramentes" not "eines"). No auto-publish — every VAL string is for Pau's later review.
- **TypeScript strict, no `any`.** Comments in English. Conventional Commits.
- **Locale from `getLocale(Astro.currentLocale)`**, never the URL (`fallbackType: 'rewrite'` does not update `Astro.url.pathname`).
- **Only the four card fields.** Everything else in the frontmatter is structural or content.
- **No emojis**; typographic symbols (`→ × —`) allowed.
- **Verification:** `npm run check` clean; per-overlay Vitest; the Vercel PR preview is the authoritative production build (local long builds get killed in this environment).
- **Branch:** `feat/ca-fase2b-fichas` from `main` (2A merged, `fbaf646`).

---

### Task 1: `localizeFicha` helper + the three overlays

**Files:**
- Create: `src/i18n/fichas-ca.ts`
- Test: `src/i18n/fichas-ca.test.ts`

**Interfaces:**
- Consumes: the `debates`, `dinamicas` and `proyectos` collections (`getCollection`); `Locale`.
- Produces: `type FichaCA = Partial<{ title, descripcion, duracion, agrupacion }>`; `FichaOverlay = Partial<Record<string, FichaCA>>`; `localizeFicha(data, slug, overlay, locale)`; `DEBATES_CA`, `DINAMICAS_CA`, `PROYECTOS_CA`.

Keys are the **stripped entry id** (`e.id.replace(/^debates\//, '')` → `familia/nn-slug`), which is exactly what the hubs already use as `slug`.

- [ ] **Step 1: Write the failing test.** Mirror the canonical overlay test (`asignaturas-ca.test.ts`): (a) `es` returns `data` unchanged, (b) `ca` overlays `title` and preserves a structural field, (c) every overlay key is a real published entry slug, (d) **every published entry has an overlay** (guards against silent gaps). Load the entries with `getCollection` from `astro:content` — check whether Vitest can import it; if not, read the slugs from the filesystem instead and say so in a comment.
- [ ] **Step 2: Run to verify it fails.** `npx vitest run src/i18n/fichas-ca.test.ts` → FAIL (module not found).
- [ ] **Step 3: Implement `fichas-ca.ts`.** Generic helper, three overlay maps. Translate `title` + `descripcion` + `duracion` + `agrupacion` for all 61 entries (18 debates, 25 dinámicas, 18 proyectos), reading the ES source from each MDX frontmatter.
- [ ] **Step 4: Run tests.** → PASS. A failing "every entry has an overlay" means a slug was missed.
- [ ] **Step 5: Type-check.** `npm run check` → 0 new errors.
- [ ] **Step 6: Commit.** `feat(i18n): add VAL overlays for transversal card frontmatter`

---

### Task 2: Wire the three hubs

**Files:**
- Modify: `src/pages/debates/index.astro`, `src/pages/dinamicas/index.astro`, `src/pages/proyectos/index.astro`

Each already has `locale`, `t()` and `localizeFamilias` from Fase 2A. Map each card's `data` through `localizeFicha(d.data, d.slug, <OVERLAY>, locale)` at render.

- [ ] **Step 1: Wire debates** (`DEBATES_CA`).
- [ ] **Step 2: Wire dinamicas** (`DINAMICAS_CA`).
- [ ] **Step 3: Wire proyectos** (`PROYECTOS_CA`).
- [ ] **Step 4: Set `contentLang={locale}`** on the three `BaseLayout`s and localize their hero + breadcrumb + meta with the `copy = {es,ca}[locale]` pattern — with the cards translated, the hub is now VAL end to end.
- [ ] **Step 5: Type-check + tests.** `npm run check`; `npx vitest run src/i18n/`.
- [ ] **Step 6: Commit.** `feat(i18n): translate debates/dinamicas/proyectos hub cards to Valencian`

---

## Final verification

- [ ] `npm run check` — 0 new errors.
- [ ] `npx vitest run` — full suite green.
- [ ] Push branch, open PR. **The Vercel preview build is authoritative**; confirm the deployment check is `pass` before merge.
- [ ] Surface for Pau's VAL review: `src/i18n/fichas-ca.ts` (61 × 4 strings) + the three hubs' `copy.ca`.

## Out of scope (later phases)

MDX **bodies** and the rest of the frontmatter of these 61 fichas; the 88 book units; PDFs/slides in VAL; Preact game/tool islands; `inLanguage` in the JSON-LD.
