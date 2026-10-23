# Situaciones de aprendizaje Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the 25 situaciones de aprendizaje (SA) of Eco 4ESO and Eco 1BACH as a new per-subject section, fed by a repeatable import from `C:\dev\docencia`.

**Architecture:** A new content collection `situaciones` (one MDX per SA, ES + `.ca` twin) holds the SA text, rubric, sequence and the list of its materials. Material files (standalone print HTML + PDF) are copied into `public/`; teacher guides and answer keys (Markdown) become a second collection `guias-sa`. A deterministic Node importer copies, filters and hash-tracks the files; a Claude Code skill wraps it with the parts that need judgement (anonymising, translating to Spanish, placing materials in the sequence, content review, PR).

**Tech Stack:** Astro 5 content collections, vitest, Node `.mjs` scripts, `gray-matter`, existing PDF renderer of `scripts/build-actividades-pdf.mjs`.

**Spec:** `docs/superpowers/specs/2026-10-22-situaciones-aprendizaje-design.md`

## Global Constraints

- Section path: `/[asignatura]/situaciones/` and `/[asignatura]/situaciones/[slug]/`; CA under `/ca/` via the existing i18n fallback (no `src/pages/ca/` mirror).
- First batch: `eco-4eso` (11 SA, from `docencia/economia-4eso`) and `eco-1bach` (14 SA, from `docencia/economia-1bat`).
- SA order = UD number of Pau's `programacio-aula.md` (`## UDn.` headings). The web book is not touched.
- Every published file exists in ES and CA, merged in the same PR. Materials: CA = anonymised Valencian original, ES = translation. SA text: ES from the programación, CA = translation.
- Never published: files matching `-privat`, `.mp4`, `.docx`, `__pycache__`, `_*.py`, `llibreta-*` (gradebook, may hold student data), `ud00-*`.
- Forbidden strings in anything published (case-insensitive): `Ramón Cid`, `Ramon Cid`, `Benicarló`, `Benicarlo`, `Baix Maestrat`, `12000480`, `Aules`, `ITACA`, `drive.google`, `pmonterdemiro`.
- `docencia` is the only source; web copies are regenerated on import and never hand-edited. ES translations live next to the CA file and are only redone when the source hash changes.
- Visual system: `docs/design-system.md` (no emojis, symmetric 1px boxes, subject colour tokens `--color-<color>`/`-ink`/`-soft`).
- Commits in English, Conventional Commits; PR against `main`.

## Review Focus

1. A file shared by two SA (`ud01-02-…`) must appear on both SA pages, with one copy on disk.
2. A material with only HTML or only PDF still lists, offering only what exists.
3. Re-running the importer with an unchanged `docencia` produces no diff.
4. A changed source file marks its ES translation as stale instead of silently keeping the old one.
5. An SA with zero materials renders without empty headings or a broken "Materiales" block.

---

## File structure

| File | Responsibility |
|---|---|
| `src/content.config.ts` | add `situaciones` and `guias-sa` collections |
| `src/lib/situaciones.ts` | types, loading/sorting per subject+locale, material href helpers |
| `src/lib/situaciones.test.ts` | unit tests for the above |
| `src/pages/[asignatura]/situaciones/index.astro` | list page |
| `src/pages/[asignatura]/situaciones/[slug].astro` | SA page |
| `src/pages/[asignatura]/situaciones/[slug]/[guia].astro` | rendered teacher guide / answer key |
| `src/pages/[asignatura]/index.astro` | SA block at top of hub |
| `src/content/situaciones-anonimas.test.ts` | forbidden-string guard over published SA files |
| `scripts/lib/docencia.mjs` | pure functions: classify, map to SA, filter, hash |
| `scripts/lib/docencia.test.mjs` | tests |
| `scripts/importar-docencia.mjs` + npm `importar:docencia` | copies files, writes manifest, prints report |
| `.claude/skills/importar-docencia/SKILL.md` | the full repeatable flow for Claude Code |
| `src/content/asignaturas/{eco-4eso,eco-1bach}/situaciones/*.mdx` | the 25 SA (+ `.ca`) |

On-disk layout of materials (decided here):
- HTML: `public/situaciones/<asig>/<file>.html` (ES) and `<file>.ca.html` (CA). Flat per subject so a shared `ud01-02-` file has one copy.
- PDF: `public/downloads/situaciones/<asig>/<file>.pdf` / `.ca.pdf` (inside `downloads/`, so `BLOB_PDF_DIRS` already uploads and strips them).
- Guides/answer keys: `src/content/asignaturas/<asig>/situaciones/guias/<file>.md` / `.ca.md`.
- Import manifest: `src/content/asignaturas/<asig>/situaciones/_import.json` — `{ [sourceRelPath]: { sha256, targets: string[], esHashOfSource: string|null } }`.

---

### Task 1: Collections and loader

**Files:**
- Modify: `src/content.config.ts` (next to `retos`, ~L122; export list ~L713)
- Create: `src/lib/situaciones.ts`, `src/lib/situaciones.test.ts`

**Interfaces:**
- Produces, `situaciones` schema (one line per scalar; twins share `asignatura`, `orden`, `estado`, `unidades_libro`):
  ```ts
  asignatura: z.enum(ASIGNATURA_SLUGS), orden: z.number().int().min(1),
  title: z.string(), reto: z.string(), producto_final: z.string(),
  sesiones: z.number().int().optional(), unidades_libro: z.array(z.number().int()).default([]),
  rubrica: z.array(z.object({ criterio: z.string(), niveles: z.array(z.string()).length(4) })).default([]),
  secuencia: z.array(z.object({ titulo: z.string(), descripcion: z.string(), materiales: z.array(z.string()).default([]) })).default([]),
  materiales: z.array(z.object({ id: z.string(), titulo: z.string(), tipo: z.enum(TIPOS_MATERIAL), html: z.boolean().default(false), pdf: z.boolean().default(false), guia: z.boolean().default(false) })).default([]),
  piezas: z.array(z.object({ href: z.string(), label: z.string() })).default([]),
  lang: z.enum(LANGS).default('es'), estado: z.enum(ESTADOS)
  ```
  glob `asignaturas/*/situaciones/*.{md,mdx}` (top level only, so `guias/` is excluded).
- `guias-sa` schema: `asignatura`, `situacion` (SA slug), `title`, `tipo: z.enum(['guia','solucionario'])`, `lang`, `estado`; glob `asignaturas/*/situaciones/guias/*.md`.
- `TIPOS_MATERIAL = ['caso','ficha','dossier','ejercicios','apuntes','resumen','dinamica','concurso','repaso','cuestionario','control','simulacro','examen','otro'] as const` exported from `src/lib/situaciones.ts`.
- `getSituaciones(asignatura: AsignaturaSlug, locale: Locale): Promise<CollectionEntry<'situaciones'>[]>` — published, ES entries sorted by `orden`, each swapped with `pickLocalizedEntry`.
- `situacionSlug(entry): string` — same id → slug rule as retos (`.split('/').pop()` minus `.mdx`/`.ca`).
- `materialHtmlHref(asig, id, locale)` → `/situaciones/<asig>/<id>[.ca].html`; `materialPdfHref(asig, id, locale)` → `/downloads/situaciones/<asig>/<id>[.ca].pdf`.
- `materialesDePaso(sa, paso)` / `materialesSueltos(sa)` — materials referenced by a step / by no step.

- [ ] **Step 1: Write failing tests** in `src/lib/situaciones.test.ts`: `materialHtmlHref('eco-4eso','ud01-cas-concorde','ca') === '/situaciones/eco-4eso/ud01-cas-concorde.ca.html'`; ES variant has no `.ca`; PDF href under `/downloads/situaciones/`; `materialesSueltos` returns only materials whose id appears in no `secuencia[].materiales`; `materialesDePaso` keeps the step's listed order and skips unknown ids.
- [ ] **Step 2:** `npx vitest run src/lib/situaciones.test.ts` → FAIL (module missing).
- [ ] **Step 3:** Implement collections + `src/lib/situaciones.ts`.
- [ ] **Step 4:** Tests PASS; `npx astro sync` succeeds.
- [ ] **Step 5:** Commit `feat(situaciones): add situaciones and guias-sa collections`.

### Task 2: Pages and hub block

**Files:**
- Create: `src/pages/[asignatura]/situaciones/index.astro`, `[slug].astro`, `[slug]/[guia].astro`
- Modify: `src/pages/[asignatura]/index.astro`, `src/pages/[asignatura]/_secciones-vacias.test.ts`, `src/i18n/content-lang-pages.test.ts`
- Create fixture: `src/content/asignaturas/eco-4eso/situaciones/01-que-me-cuesta-de-verdad.mdx` + `.ca.mdx` (real SA 1, estado `borrador` until Task 5 fills it — enough to render locally)

**Interfaces:** Consumes Task 1 helpers. Copy pattern: `src/pages/[asignatura]/retos/` (getStaticPaths, `caById`, `pickLocalizedEntry`, `SectionHeader`, `Breadcrumb`, inline `{es,ca}[locale]` copy).

- [ ] **Step 1:** Add row `['situaciones/index.astro', /noindex=\{situaciones\.length === 0\}/]` to `VACIAS` in `_secciones-vacias.test.ts`, and `'src/pages/[asignatura]/situaciones/[slug].astro'` to `content-lang-pages.test.ts`. Run both → FAIL.
- [ ] **Step 2:** List page: ordered list of SA (number = `orden`, title, `producto_final`), `noindex={situaciones.length === 0}`. Copy ES «Situaciones de aprendizaje» / CA «Situacions d'aprenentatge»; lede ES «En el orden en que las damos en clase. Cada una con su reto, su producto final y todo el material.» (CA translated).
- [ ] **Step 3:** SA page, sections in this order: reto; producto final + rubric table (criterio × 4 niveles, headers ES «Insuficiente / Suficiente / Notable / Excelente»); secuencia (each step: titulo, descripcion, its materials as rows with title, tipo, links «Ver» → HTML, «PDF» → PDF, «Guía» → guide page, each only if the flag is true); «Más materiales» for `materialesSueltos` (omit heading when empty); «En el libro» linking `/<asig>/libro/` units from `unidades_libro` (resolve unit slugs from the `libro` collection); «También en la web» from `piezas`. Omit every section whose data is empty.
- [ ] **Step 4:** Guide page renders the `guias-sa` entry for `(asignatura, situacion, guia)` with `render()`, `noindex` false, breadcrumb back to the SA.
- [ ] **Step 5:** Hub: `const situaciones = await getSituaciones(a.slug, locale)`; when non-empty, render a block right after `.hub-hero` and before `.hub-sections`: heading «Situaciones de aprendizaje», the SA as a numbered card list (orden, title, producto_final) linking to each SA, plus a link to the list page. Do not touch the `material` array.
- [ ] **Step 6:** Tests from Step 1 PASS; `npx vitest run src/pages src/i18n` PASS (only the 5 known failures on `main` may remain: datos-obsoletos, estado-obligatorio, frontmatter-bessons ×1, texto-inline-html, content-lang-pages «leaves no localized detail route», redirects — compare with `main` before claiming).
- [ ] **Step 7:** `npm run dev`, check `/eco-4eso/situaciones/`, `/eco-4eso/situaciones/01-que-me-cuesta-de-verdad/`, `/ca/` versions, 375px width, no horizontal scroll.
- [ ] **Step 8:** Commit `feat(situaciones): list, detail and guide pages plus hub block`.

### Task 3: Anonymity guard

**Files:** Create `src/content/situaciones-anonimas.test.ts`.

- [ ] **Step 1:** Test walks `src/content/asignaturas/*/situaciones/**`, `public/situaciones/**`, and the text of `public/downloads/situaciones/**/*.pdf` is skipped (PDFs are derived from the HTML already scanned). Asserts no file contains any forbidden string from Global Constraints (case-insensitive), and no filename matches the never-published patterns. Second test: a temp string containing `IES Ramón Cid` is caught by the exported `findForbidden(text): string[]`.
- [ ] **Step 2:** Run → FAIL (no `findForbidden`). Implement `findForbidden` in `src/lib/situaciones.ts` (export `FORBIDDEN` too, the importer reuses the list via a JSON file `src/lib/situaciones-forbidden.json` read by both).
- [ ] **Step 3:** PASS. Commit `test(situaciones): guard published SA files against school identifiers`.

### Task 4: Importer

**Files:** Create `scripts/lib/docencia.mjs`, `scripts/lib/docencia.test.mjs`, `scripts/importar-docencia.mjs`; add npm script `"importar:docencia": "node scripts/importar-docencia.mjs"`.

**Interfaces:**
- `MATERIAS = { 'economia-4eso': 'eco-4eso', 'economia-1bat': 'eco-1bach' }`; source root from env `DOCENCIA_DIR`, default `C:/dev/docencia`.
- `isPublishable(relPath): boolean` — false for the never-published patterns; true only under `unitats/`, `activitats/`, `avaluacio/`.
- `unidadesDe(fileName): number[]` — `ud01-x` → `[1]`, `ud01-02-x` → `[1,2]`, no prefix → `[]`.
- `materialId(fileName): string` — basename without extension and without `-GUIA`/`-SOLUCIONARI`.
- `guiaTipo(fileName): 'guia'|'solucionario'|null`.
- `groupMaterials(relPaths): Map<id, { html?, pdf?, guias: string[], unidades: number[] }>`.
- `sha256(buf): string`.
- CLI: only files tracked by git in `docencia` (`git -C <dir> ls-files`), so uncommitted work is never imported. Copies CA files to the layout above (HTML → `.ca.html`, PDF → `.ca.pdf`, md guide → `guias/<id>-<tipo>.ca.md` with frontmatter `asignatura, situacion, title, tipo, lang: ca, estado: publicado` added). Rewrites `_import.json`. Prints JSON report `{ nuevos: [], cambiados: [], sinCambios: n, traduccionPendiente: [] }`, where `traduccionPendiente` lists every CA target whose ES twin is missing or whose `esHashOfSource` ≠ current sha256. Never writes ES files.

- [ ] **Step 1:** Tests: `unidadesDe('ud01-02-examen.html')` → `[1,2]`; `isPublishable('unitats/ud02-x/video-cooperativa-classe-privat.mp4')` false; `isPublishable('avaluacio/llibreta-ud01-02.html')` false; `isPublishable('activitats/ud01-cas-concorde.html')` true; `materialId('ud01-cas-concorde-GUIA.md')` → `'ud01-cas-concorde'`; `groupMaterials` pairs `.html` + `.pdf` + `-GUIA.md` + `-SOLUCIONARI.md` of one id; running the CLI twice against a fixture dir (`scripts/lib/__fixtures__/docencia/`) leaves `_import.json` byte-identical (Review Focus 3); changing a fixture file puts its target in `traduccionPendiente` (Review Focus 4).
- [ ] **Step 2:** FAIL → implement → PASS.
- [ ] **Step 3:** Commit `feat(situaciones): docencia importer with hash manifest`.

### Task 5: Skill `importar-docencia`

**Files:** Create `.claude/skills/importar-docencia/SKILL.md`.

The skill is the runbook Claude follows when Pau says «importa docencia» (optionally one subject). Steps it must contain, in order:
1. Branch from `main`: `feat/situaciones-import-<asig>-<date>`.
2. `npm run importar:docencia` and read the report.
3. For each CA file in `nuevos`/`cambiados`: anonymise in place (replace forbidden strings with generic wording, e.g. «el tejido productivo de la comarca» → «el tejido productivo de vuestra comarca»; centre-specific rules removed), keeping layout and print CSS intact.
4. For each `traduccionPendiente`: write the ES twin (Spanish, same HTML structure), set `esHashOfSource` in `_import.json`.
5. Render PDFs for every changed HTML (ES and CA) with the renderer used by `scripts/build-actividades-pdf.mjs`, double-sided A4, no header/footer.
6. Update each affected SA MDX (ES + CA): add the material to `materiales` (id, title, tipo, html/pdf/guia flags) and to the right `secuencia` step (judgement, from the programación and the guide); a file with two units goes to both SA.
7. `npx vitest run src/content src/lib scripts/lib`, then dispatch the `content-reviewer` agent on the changed SA and guides; fix what it finds.
8. `npm run upload:pdfs` is NOT run by the skill; the PR body reminds Pau that merging needs it (follow the existing PDF release flow).
9. Open the PR with the report and the list of materials per SA. Merge = Pau's review.

- [ ] **Step 1:** Write the skill; dry-run it mentally against `ud01-cas-concorde` and confirm every step names a command or a file.
- [ ] **Step 2:** Commit `docs(situaciones): add importar-docencia skill`.

### Task 6: The 11 SA of Eco 4ESO

**Files:** `src/content/asignaturas/eco-4eso/situaciones/NN-<slug>.mdx` + `.ca.mdx`, NN = 01…11.

Source: `docencia/economia-4eso/programacio/programacio-aula.md`, each `## UDn.` section. Per SA:
- `title` = the SA's own name (e.g. «¿Qué me cuesta de verdad?»), slug from it.
- `reto` from the situation of departure in «Metodología»; `producto_final` from «Situación de aprendizaje y producto final»; `sesiones` from «Temporalización».
- `secuencia` = the «Metodología» bullets as steps (title + one-sentence description), no materials yet.
- `rubrica` = proposed by the AI for the producto final: 3–5 criteria × 4 levels, aligned with the unit's criterios de evaluación (spec decision).
- `unidades_libro` = web book units of `eco-4eso` that cover the SA's saberes (read `src/content/asignaturas/eco-4eso/libro/*.mdx` titles/objetivos).
- `piezas` = existing tests/retos/actividades/recursos of `eco-4eso` that the programación's «Recursos» table already links (the `profedeeconomia.es/...` rows), as root-relative hrefs that exist.
- Anonymised; `estado: publicado`; CA twin translated.

- [ ] **Step 1:** Write the 11 ES files; fixture from Task 2 becomes SA 01.
- [ ] **Step 2:** Write the 11 CA twins.
- [ ] **Step 3:** `npx vitest run src/content src/lib` (frontmatter-bessons, anonymity) PASS except known failures; every `piezas[].href` and `unidades_libro` resolves (add an assertion to `src/lib/situaciones.test.ts`: all `piezas` hrefs start with `/<asignatura>/` and the target content entry exists).
- [ ] **Step 4:** `content-reviewer` on the 22 files; fix.
- [ ] **Step 5:** Commit `feat(situaciones): eco-4eso learning situations`.

### Task 7: The 14 SA of Eco 1BACH

Same as Task 6 with `docencia/economia-1bat/programacio/programacio-aula.md`, `eco-1bach`, NN = 01…14. Commit `feat(situaciones): eco-1bach learning situations`.

### Task 8: First import

- [ ] **Step 1:** Run the Task 5 skill for both subjects (materials today: 4ESO UD1–UD2, 1BACH UD1–UD4).
- [ ] **Step 2:** Check in the browser: SA 1 of each subject shows its materials in steps, HTML opens and prints double-sided, PDF downloads, guide page renders, `/ca/` shows the Valencian originals.
- [ ] **Step 3:** Full `npx vitest run`; compare failures with `main`.
- [ ] **Step 4:** Commit, push, open the PR against `main` (Tasks 1–8 together, or Tasks 1–7 first if the PR gets too big to review: decide at this point by diff size).
