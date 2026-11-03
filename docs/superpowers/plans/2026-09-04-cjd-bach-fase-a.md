# Cultura Jurídica i Democràtica — Fase A Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Register `cjd-bach` as the site's 10th asignatura (skeleton only, no book content yet) and fix the duplicated print-accent maps that this addition would otherwise make worse.

**Architecture:** Three independent deliverables. (1) A verified curriculum research doc extracted from the official DOGV PDF. (2) A refactor that collapses six copies of the print `ACCENTS` map into one exhaustively-typed export in the registry — this also fixes three subjects whose PDFs currently print in the wrong colour. (3) The `cjd-bach` registry entry, its Valencian overlay, its colour tokens, and a test that guards the CSS layer the type system cannot see.

**Tech Stack:** Astro 5, TypeScript (strict), Vitest, Tailwind 4, plain CSS custom properties.

**Spec:** [docs/superpowers/specs/2026-09-04-cjd-bach-design.md](../specs/2026-09-04-cjd-bach-design.md)

## Global Constraints

- Branch is `feat/cjd-bach`, already created off `main`. **Never push directly to `main`** — integration is by PR.
- Conventional Commits, message body in English, code comments in English.
- TypeScript strict. No `any`.
- `estado: 'proximamente'` for `cjd-bach` throughout Fase A. It flips to `'publicado'` only at the end of Fase B, once the 8 book units exist. A `'publicado'` subject with no content renders a live, empty hub.
- Slug `cjd-bach` · `shortLabel: 'CJD'` · `num: '10'` · `color: 'cjd'` · `etapa: 'bach'` · `curso: 'bach'`.
- Colour índigo: base `#4A3B8F`, soft `#E0DCF0`, ink `#4A3B8F`, deep `#382C6B`.
- `marcoNormativo: 'Decret 108/2022, mod. Decret 103/2026 (CV) — optativa'`.
- Run tests with `npm test` (`vitest run`). Type-check with `npm run check` (`astro check`).
- Docs and specs are written in Valencian; UI strings and content in Spanish, with a Valencian overlay.

---

### Task 1: Curriculum research doc

**Files:**
- Create: `docs/curriculum-cjd-bach.md`
- Reference (format to mirror): `docs/curriculum-gpe-bach.md`

**Interfaces:**
- Consumes: nothing.
- Produces: the source of truth for Fase B unit authoring. Task 3 quotes no values from it; the two tasks are independent.

- [ ] **Step 1: Download and extract the official curriculum**

The official PDF is the only primary source — this optative has no state-level equivalent in RD 243/2022.

```bash
curl -sL -o /tmp/cjd.pdf "https://ceice.gva.es/documents/162640733/364026431/Cultura+jur%C3%ADdica+y+democr%C3%A1tica.pdf/de0eece7-43d4-92e6-5d11-4cd15ad85db7?t=1663312633685"
pdftotext -layout -enc UTF-8 /tmp/cjd.pdf /tmp/cjd.txt
grep -n "^\s*[0-9]\+\.[0-9. ]*[A-ZÁÉÍÓÚ]" /tmp/cjd.txt
```

Expected: a 12-page PDF whose outline shows `1. Presentación`, `2. Competencias específicas` (2.1–2.6), `3. Saberes básicos` (3.1–3.8), `4. Situaciones de aprendizaje`, `5. Criterios de evaluación` (5.1–5.6).

- [ ] **Step 2: Write the doc**

Mirror the section order of `docs/curriculum-gpe-bach.md`. Required sections:

1. `# Currículum oficial — CJD Bach (Cultura Jurídica i Democràtica, Batxillerat)` with the same kind of blockquote preamble: autonomous Valencian curriculum, **no state equivalent in RD 243/2022**, primary source is the DOGV / CEICE annex.
2. `## 1. Identificació de la matèria` — Etapa Batxillerat; Curs **1r o 2n** (the centre decides, the student may only take it in one of the two); Caràcter: optativa autonòmica, not compulsory to offer (art. 16.5, Decret 103/2026 wording, reserves that to Segona Llengua Estrangera and Informàtica); Modalitat: not tied to any modality; Marc normatiu: Decret 108/2022, annex of optatives — **Decret 103/2026 replaces only annex II (comunes i modalitat), so this curriculum text is unchanged**; Slug intern `cjd-bach`.
3. `## 2. Finalitat de la matèria` — paraphrase §1 of the PDF: legal culture for responsible, critical citizenship; connects with ESO's Geografia i Història and Valors Ètics i Cívics; propaedeutic value for further study; active methodologies (ABP, aprenentatge servei, debate).
4. `## 3. Competències específiques (CE1–CE6)` — one `###` per competence, short Valencian title plus the paraphrased official wording. The six, verified:
   - CE1 — identify and appreciate the values of freedom, justice and equality in democratic culture through case analysis.
   - CE2 — investigate the state and autonomous legal order from contrasted reliable sources, and explain its effect on society critically.
   - CE3 — critically identify the principles of the international legal framework, especially the EU, and its repercussions here.
   - CE4 — recognise and denounce, with argument, attacks on freedom, justice and equality, and propose solutions.
   - CE5 — create and interpret oral and written messages with correct, coherent legal language, avoiding discriminatory usage.
   - CE6 — search, contrast and share legal and social digital information, using ICT responsibly and safely.
5. `## 4. Sabers bàsics — 8 blocs` — one `###` per block, with the literal bullet list of sabers paraphrased into Valencian. Blocks 1 and 2 are marked transversal to all competences; blocks 3–8 carry `(C1, C2, C4, C5, C6)`. Block titles, verified against the PDF:
   1. Sociedad y Derecho
   2. Persona y relaciones supranacionales
   3. Persona y poderes del Estado
   4. Persona y relaciones interpersonales
   5. Persona y relaciones laborales
   6. Persona e impuestos
   7. Persona y comportamientos sociales
   8. Persona y tutela judicial efectiva

   ⚠️ The PDF's §1 prose calls block 2 "Sociedad y relaciones supranacionales" while the §3.2 heading calls it "Persona y relaciones supranacionales". Follow the §3 heading (the definitive sabers section) and record the discrepancy in a note, exactly as `curriculum-gpe-bach.md` records its own five-vs-six-blocks discrepancy.
6. `## 5. Criteris d'avaluació` — the numbered criteria from §5 of the PDF, grouped by competence (1.1–1.4, 2.1–2.5, 3.1–3.3, 4.1–4.4, 5.1–5.4, 6.1–6.4).
7. `## 6. Anti-solapament amb FOPP 4ESO i IPE I/II` — reproduce the rule from the spec: blocks 5 and 6 are approached from the legal angle at Bachillerato level; payroll, severance and IRPF arithmetic is **not** rewritten but cross-linked through `src/lib/recursos-relacionados-sources.ts`.
8. `## 7. Fonts` — the PDF URL used in Step 1, the CEICE curriculum index, and the DOGV page for Decret 103/2026.

- [ ] **Step 3: Verify the doc against the source text**

Every block title and competence in the doc must appear in the extracted text. Run:

```bash
for s in "Sociedad y Derecho" "relaciones supranacionales" "poderes del Estado" "relaciones interpersonales" "relaciones laborales" "Persona e impuestos" "comportamientos sociales" "tutela judicial efectiva"; do
  printf '%-40s ' "$s"; grep -c "$s" /tmp/cjd.txt
done
```

Expected: every line reports a count of 1 or more. A `0` means a title was invented — go back to the PDF.

- [ ] **Step 4: Commit**

```bash
git add docs/curriculum-cjd-bach.md
git commit -m "docs(cjd-bach): verified curriculum reference from the DOGV annex"
```

---

### Task 2: Centralise the print ACCENTS map

**Files:**
- Modify: `src/lib/asignaturas.ts` (append after the `ASIGNATURAS` record, around line 180)
- Modify: `src/pages/[asignatura]/libro/imprimir.astro:129-137`
- Modify: `src/pages/[asignatura]/actividades/imprimir/[modo].astro:120-128`
- Modify: `src/pages/[asignatura]/ebau/imprimir.astro:43-51`
- Modify: `src/pages/[asignatura]/programacion/imprimir.astro:35-46`
- Modify: `src/pages/[asignatura]/proyecto/imprimir.astro:43-54`
- Modify: `src/pages/[asignatura]/proyecto/cuaderno/imprimir/[modo].astro:52-60`
- Test: `src/lib/asignaturas.test.ts` (append)

**Interfaces:**
- Consumes: `Asignatura` and `ASIGNATURAS_LIST`, already exported from `src/lib/asignaturas.ts`.
- Produces: `export const ACCENTS: Record<Asignatura['color'], { base: string; deep: string; soft: string }>` from `@/lib/asignaturas`. Task 3 adds one entry to it.

**Why:** the map is copied into six print routes and three copies are stale — `libro`, `actividades` and `ebau` are missing `taller3`, `ipe1` and `ipe2`, so the book and activity PDFs of Taller 3ESO, IPE I and IPE II currently render in EDMN terracotta via the `?? ACCENTS.edmn` fallback. Typing one shared map as a total `Record` over the colour union turns a future omission into a compile error.

- [ ] **Step 1: Write the failing test**

Two edits to `src/lib/asignaturas.test.ts`.

First, **at the top of the file**, add the two node imports and widen the existing `./asignaturas.ts` import on line 2 rather than writing a second one:

```ts
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { SECCIONES_TRANSVERSALES, ASIGNATURAS_LIST, ACCENTS } from './asignaturas.ts';
```

Then append the constants and the new describe block **at the bottom**:

```ts
const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const read = (p: string) => readFileSync(ROOT + p, 'utf8');

const PRINT_ROUTES = [
  'src/pages/[asignatura]/libro/imprimir.astro',
  'src/pages/[asignatura]/actividades/imprimir/[modo].astro',
  'src/pages/[asignatura]/ebau/imprimir.astro',
  'src/pages/[asignatura]/programacion/imprimir.astro',
  'src/pages/[asignatura]/proyecto/imprimir.astro',
  'src/pages/[asignatura]/proyecto/cuaderno/imprimir/[modo].astro',
];

describe('ACCENTS — the print palette lives in one place', () => {
  it('gives every asignatura an accent of its own, never the EDMN fallback', () => {
    const collapsedToEdmn = ASIGNATURAS_LIST
      .filter((a) => a.color !== 'edmn')
      .filter((a) => ACCENTS[a.color].base === ACCENTS.edmn.base)
      .map((a) => a.slug);
    expect(collapsedToEdmn).toEqual([]);
  });

  it('leaves no local ACCENTS copy behind in any print route', () => {
    for (const route of PRINT_ROUTES) {
      const src = read(route);
      expect(src, `${route} still declares its own ACCENTS`).not.toMatch(/const ACCENTS\s*[:=]/);
      expect(src, `${route} does not import ACCENTS`).toMatch(
        /import \{[^}]*\bACCENTS\b[^}]*\} from '@\/lib\/asignaturas'/
      );
    }
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/lib/asignaturas.test.ts`

Expected: FAIL. The first failure is the import — `ACCENTS` is not exported from `./asignaturas.ts` yet.

- [ ] **Step 3: Add the shared map to the registry**

In `src/lib/asignaturas.ts`, immediately after the closing `};` of the `ASIGNATURAS` record and before `export const ASIGNATURAS_LIST`:

```ts
/**
 * Print-only accent hexes. The PDF routes render through paged.js inside their
 * own <style>, where the `var(--color-*)` tokens from global.css are out of
 * scope, so the palette has to be repeated here as literals.
 *
 * Typed as a *total* Record over the colour union on purpose: adding a colour
 * to `Asignatura['color']` without adding it here is a compile error, rather
 * than a PDF that silently prints in EDMN terracotta.
 */
export const ACCENTS: Record<Asignatura['color'], { base: string; deep: string; soft: string }> = {
  edmn:    { base: '#C44E2C', deep: '#9C3A1C', soft: '#FBE3D6' },
  eco1:    { base: '#1F6E6E', deep: '#164F4F', soft: '#DBEDED' },
  eco4:    { base: '#D4A24C', deep: '#A87A2A', soft: '#F5E5BC' },
  fopp:    { base: '#5B3A4E', deep: '#46293A', soft: '#ECDCE5' },
  taller3: { base: '#6B8E23', deep: '#4F6B18', soft: '#E4ECD2' },
  ipe1:    { base: '#4A6FA5', deep: '#36527D', soft: '#DCE5F0' },
  ipe2:    { base: '#2F4F7F', deep: '#22395C', soft: '#D5DEEB' },
  eeae:    { base: '#2E5E3A', deep: '#234A2D', soft: '#D9E6DC' },
  gpe:     { base: '#8C2F39', deep: '#6E2530', soft: '#F1DADD' },
  proximamente: { base: '#6E5A47', deep: '#5C4A3D', soft: '#EFE2CB' },
};
```

The `proximamente` hexes are the literal values of `--color-ink-mute`, `--color-ink-soft` and `--color-line-soft` in `src/styles/global.css`.

- [ ] **Step 4: Point the six print routes at the shared map**

In each of the six files, do exactly three edits:

1. Add `ACCENTS` to the existing `@/lib/asignaturas` import. For example, in `libro/imprimir.astro:11`:
   ```ts
   import { ACCENTS, ASIGNATURA_SLUGS, ASIGNATURAS } from '@/lib/asignaturas';
   ```
   The other five already import from the same module (`ASIGNATURAS`, sometimes with `type AsignaturaSlug`); add `ACCENTS` to that same brace list rather than writing a second import.
2. Delete the whole local `const ACCENTS: Record<string, …> = { … };` block.
3. Drop the now-dead fallback:
   ```ts
   const accent = ACCENTS[a.color];
   ```
   Note `proyecto/cuaderno/imprimir/[modo].astro` falls back to `ACCENTS.gpe`, not `ACCENTS.edmn` — it goes too. The lookup is total, so no `??` is needed anywhere.

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- src/lib/asignaturas.test.ts`

Expected: PASS, both cases.

- [ ] **Step 6: Type-check**

Run: `npm run check`

Expected: no new errors. If a route reports `'ACCENTS' is declared but never read`, its local block was deleted but the import edit was missed, or vice versa.

- [ ] **Step 7: Commit**

```bash
git add src/lib/asignaturas.ts src/lib/asignaturas.test.ts "src/pages/[asignatura]"
git commit -m "fix(pdf): give Taller 3ESO and IPE I/II their own print accent

The ACCENTS map was copied into six print routes and three copies were
stale, so those subjects' book, activity and EBAU PDFs fell through to
the EDMN terracotta fallback. One shared map, typed as a total Record
over the colour union, makes a future omission a compile error."
```

---

### Task 3: Register cjd-bach with its colour

**Files:**
- Modify: `src/lib/asignaturas.ts` (`ASIGNATURA_SLUGS`, the `color` union, the `ASIGNATURAS` record, `ACCENTS`)
- Modify: `src/i18n/asignaturas-ca.ts` (append to `ASIGNATURAS_CA`)
- Modify: `src/content.config.ts:8-18`
- Modify: `src/styles/global.css:53`, `:71`, `:101`
- Modify: `src/styles/slides.css:25`
- Modify: `src/components/SubjectCard.astro:51`
- Modify: `src/pages/[asignatura]/index.astro:384`
- Modify: `src/pages/[asignatura]/evaluacion/index.astro:171`
- Modify: `src/pages/[asignatura]/refuerzo/index.astro:173`
- Test: `src/lib/asignaturas.test.ts` (append)

**Interfaces:**
- Consumes: `ACCENTS` from Task 2.
- Produces: `'cjd-bach'` in `ASIGNATURA_SLUGS` and `'cjd'` in `Asignatura['color']`. Fase B writes MDX under `src/content/asignaturas/cjd-bach/libro/`.

- [ ] **Step 1: Write the CSS coverage test**

The compiler polices `ACCENTS`, but nothing polices the CSS layer. Append to `src/lib/asignaturas.test.ts` (it reuses `ROOT`, `read` and `ASIGNATURAS_LIST` from Task 2):

```ts
const COLOR_MAP_FILES = [
  'src/components/SubjectCard.astro',
  'src/pages/[asignatura]/index.astro',
  'src/pages/[asignatura]/evaluacion/index.astro',
  'src/pages/[asignatura]/refuerzo/index.astro',
];

describe('subject colours reach the CSS layer', () => {
  const colors = [...new Set(ASIGNATURAS_LIST.map((a) => a.color))];

  it('defines a token and a soft token for every colour in global.css', () => {
    const css = read('src/styles/global.css');
    const missing = colors.flatMap((c) => [
      css.includes(`--color-${c}:`) ? [] : [`--color-${c}`],
      css.includes(`--color-${c}-soft:`) ? [] : [`--color-${c}-soft`],
    ].flat());
    expect(missing).toEqual([]);
  });

  it('maps every colour to a .c-{color} rule in each colour-map file', () => {
    const missing: string[] = [];
    for (const file of COLOR_MAP_FILES) {
      const src = read(file);
      for (const c of colors) {
        if (!src.includes(`.c-${c}`)) missing.push(`${file} → .c-${c}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it('gives every asignatura a slide accent rule', () => {
    const css = read('src/styles/slides.css');
    const missing = ASIGNATURAS_LIST
      .filter((a) => a.color !== 'edmn') // EDMN uses the sheet's default accent
      .filter((a) => !css.includes(`[data-asig="${a.slug}"]`))
      .map((a) => a.slug);
    expect(missing).toEqual([]);
  });
});
```

- [ ] **Step 2: Run it to confirm the guard is green on today's nine colours**

Run: `npm test -- src/lib/asignaturas.test.ts`

Expected: PASS. This is a guard, not a red — it proves the assertion is correctly written against a codebase that already satisfies it. If it fails now, the test is wrong, not the code.

- [ ] **Step 3: Add the asignatura to the registry**

In `src/lib/asignaturas.ts`:

1. Append `'cjd-bach',` to `ASIGNATURA_SLUGS` after `'gpe-bach',`.
2. Extend the `color` union: `… | 'eeae' | 'gpe' | 'cjd' | 'proximamente';`
3. Append `cjd: { base: '#4A3B8F', deep: '#382C6B', soft: '#E0DCF0' },` to `ACCENTS` after the `gpe` line.
4. Append to the `ASIGNATURAS` record after `'gpe-bach'`:

```ts
  'cjd-bach': {
    slug: 'cjd-bach',
    level: 'Bachillerato (1.º/2.º)',
    shortLabel: 'CJD',
    title: 'Cultura Jurídica y Democrática',
    tagline:
      'Ocho bloques de Derecho —constitucional, civil, laboral, tributario, penal y procesal— para una optativa que suele caer sin material. Laboral y fiscal enlazan con lo que ya tenemos en FOPP e IPE.',
    num: '10',
    color: 'cjd',
    marcoNormativo: 'Decret 108/2022, mod. Decret 103/2026 (CV) — optativa',
    modalidad: 'Optativa (1.º o 2.º)',
    etapa: 'bach',
    curso: 'bach',
    estado: 'proximamente',
  },
```

Also update the module's header comment: it says "Hi ha 9 asignaturas" and lists two Bachillerato electives — make it 10 and mention the third (CJD, Cultura Jurídica i Democràtica).

`ASIGNATURAS_POR_ETAPA.bach.cursos.bach` picks it up automatically through the `curso === 'bach'` filter. No change there.

- [ ] **Step 4: Run the test to verify it fails**

Run: `npm test -- src/lib/asignaturas.test.ts`

Expected: FAIL on all three cases of the new describe block — `['--color-cjd', '--color-cjd-soft']`, four `→ .c-cjd` entries, and `['cjd-bach']` for the slide rule. `ACCENTS` does not fail, because Step 3 added its entry; had it not, `npm run check` would have refused to compile.

- [ ] **Step 5: Add the colour to the CSS layer**

`src/styles/global.css` — after line 53 (`--color-gpe-soft: #F1DADD;`):

```css
  --color-cjd: #4A3B8F;           /* índigo — CJD Bach */
  --color-cjd-soft: #E0DCF0;
```

And in *both* ink blocks, after each `--color-gpe-ink: #8C2F39;` (lines 71 and 101):

```css
  --color-cjd-ink: #4A3B8F;       /* base already AA */
```

`src/styles/slides.css` — after the `gpe-bach` rule on line 25:

```css
[data-asig="cjd-bach"]   .slide { --accent: var(--color-cjd); --accent-ink: var(--color-cjd); }
```

The four colour-map files, each after its `c-gpe` line:

```css
/* src/components/SubjectCard.astro:51 */
  .subject-card.c-cjd     { --card-color: var(--color-cjd);     --card-color-soft: var(--color-cjd-soft); }

/* src/pages/[asignatura]/index.astro:384 */
  .section-card.c-cjd { --card-color: var(--color-cjd); }

/* src/pages/[asignatura]/evaluacion/index.astro:171 */
  .ce.c-cjd { --card-color: var(--color-cjd); }

/* src/pages/[asignatura]/refuerzo/index.astro:173 */
  .bloque.c-cjd { --card-color: var(--color-cjd); }
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npm test -- src/lib/asignaturas.test.ts`

Expected: PASS, all cases.

- [ ] **Step 7: De-duplicate the slug list in the content config**

`src/content.config.ts` declares its own copy of `ASIGNATURA_SLUGS` (lines 8–18) feeding nine `z.enum(ASIGNATURA_SLUGS)` calls. Import the registry's instead of hand-adding `'cjd-bach'` to a second list. Delete lines 8–18 and add to the import block at the top:

```ts
import { ASIGNATURA_SLUGS } from './lib/asignaturas';
```

The file already imports `./lib/dinamicas`, `./lib/debates`, `./lib/proyectos` and `./lib/olimpiada` the same way, and `z.enum` accepts the registry's `as const` tuple exactly as it accepted the local one.

- [ ] **Step 8: Add the Valencian overlay**

`src/i18n/asignaturas-ca.ts`, appended to `ASIGNATURAS_CA` after `'gpe-bach'`:

```ts
  'cjd-bach': {
    level: 'Batxillerat (1r/2n)',
    title: 'Cultura Jurídica i Democràtica',
    tagline:
      'Huit blocs de Dret —constitucional, civil, laboral, tributari, penal i processal— per a una optativa que sol caure sense material. Laboral i fiscal enllacen amb el que ja tenim a FOPP i IPE.',
    modalidad: 'Optativa (1r o 2n)',
    marcoNormativo: 'Decret 108/2022, mod. Decret 103/2026 (CV) — optativa',
  },
```

- [ ] **Step 9: Type-check and build**

Run: `npm run check && npm test && npm run build`

Expected: no errors, all tests pass, build succeeds. The build is the real proof that `content.config.ts` still validates every collection after Step 7 — a broken `z.enum` there fails every content entry at once, loudly.

- [ ] **Step 10: Verify the hub renders as "Próximamente"**

Run: `npm run dev` and open `http://localhost:4321/cjd-bach/`.

Expected: the hub renders with the índigo accent, the CJD title, and the «Próximamente» tag. **No empty section cards** — every section is gated on published content, and there is none yet. Confirm the card also appears under BACH → «Optativas (1.º/2.º)» in the header nav, next to GPE.

- [ ] **Step 11: Commit**

```bash
git add src/lib/asignaturas.ts src/lib/asignaturas.test.ts src/i18n/asignaturas-ca.ts src/content.config.ts src/styles/global.css src/styles/slides.css src/components/SubjectCard.astro "src/pages/[asignatura]"
git commit -m "feat(cjd-bach): register Cultura Jurídica y Democrática as the 10th subject

Skeleton only — estado stays 'proximamente' until the eight book units
land in Fase B. Adds the índigo colour across the token, slide and
colour-map layers, with a test that guards the CSS the compiler cannot
see, and drops the duplicate slug list in content.config.ts."
```

---

## Done when

- `docs/curriculum-cjd-bach.md` exists and every block title in it is grep-able in the official PDF text.
- `npm test` passes, including the three new guards.
- `npm run check` and `npm run build` are clean.
- `/cjd-bach/` renders with the índigo accent and the «Próximamente» tag, no empty sections.
- A book PDF for IPE I prints in slate blue rather than EDMN terracotta.

Opening the PR against `main` is Pau's call — the branch is `feat/cjd-bach`.

## Not in this plan

Fase B (8 book units × ES/CA) and Fase C (activities, tests, resources, programación). Each is its own plan.
