# Fase 3A — Debats content translation to Valencian — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Serve the 18 debats in Valencian under `/ca/debates/...` (full content + chrome), establishing the reusable content-translation pattern.

**Architecture:** Each ES debate MDX gains a `lang: ca` sibling (`nn-slug.ca.mdx`) in the same `debates` collection. `getStaticPaths` routes only ES entries; the detail page swaps to the CA sibling when `Astro.currentLocale === 'ca'` (with ES fallback). Fixed chrome (page + debate components) becomes locale-aware via inline `copy={es,ca}[locale]`.

**Tech Stack:** Astro 5 content collections (glob loader), Astro i18n (`fallbackType: 'rewrite'`), Vitest, TypeScript strict.

## Global Constraints

- **Locale source (VINCULANT):** always derive locale from `Astro.currentLocale`, NEVER from `Astro.url.pathname` (under `fallbackType: 'rewrite'` Astro updates currentLocale but not the pathname). Use `getLocale(Astro.currentLocale)` from `@/i18n/locale`.
- **Preserve structural frontmatter identical between ES and CA:** `familia`, `orden`, `formato`, `nivel[]`, `competencias_clave[]` (codes CCL/CD/…), `competencias_especificas[]`, `posturas[].id`, `unidades_relacionadas[].asignatura`/`.unidad`/`.competencias_especificas[]`, rubric weights/ids. Translate only prose: `title`, `descripcion`, `mocion`, `objetivos[]`, `conceptos_clave[]`, `posturas[].label`, `posturas[].sintesis`, `rubrica[].criterio`, `rubrica[].descripcion`, `unidades_relacionadas[].nota`, `duracion`/`agrupacion` text, and the whole MDX body.
- **CA files:** `lang: ca`, `estado: publicado`. Same folder as the ES file, name `nn-slug.ca.mdx`.
- **`slug:` override (REQUIRED on every CA file):** add `slug: "debates/<familia>/<nn-slug>.ca"` to the CA frontmatter. Astro's glob loader runs each path segment through github-slugger, which **strips dots** — so `01-x.ca.mdx` would otherwise get the id `...01-xca` (colliding with the ES entry) and `pickLocalizedEntry` would silently fall back to ES under `/ca`. The `slug:` field is read before schema parsing and used verbatim as the id; the debates zod schema doesn't declare it, so it's dropped from `data` after parsing (no schema change, no render leak). Discovered in Task 2.
- **Route/card guards for CA siblings:** any page that generates debate routes or cards via `getCollection('debates')` must filter `e.data.lang === 'es'`, or CA siblings produce bogus `.ca` routes / duplicate 404 cards. Consumers: `[familia]/[slug].astro` (detail), `index.astro` (hub), `[familia]/[slug]/imprimir.astro` (print view).
- **Vocabulary:** Valencian, AVL norm. Same register as prior phases (incoatives `-ix`, "despesa" not "gasto", "este/esta", "seua/seues"). Not line-reviewed yet — Pau reviews post-merge.
- **TypeScript strict, no `any`.** Comments in English. Conventional Commits.
- **Verify commands:** `npx astro check` (0 errors), `npx vitest run` (green). Never trust a subagent's report over the real file state (`grep`, re-read).

---

### Task 1: `pickLocalizedEntry` shared helper

**Files:**
- Create: `src/i18n/content-locale.ts`
- Test: `src/i18n/content-locale.test.ts`

**Interfaces:**
- Produces: `pickLocalizedEntry<T extends { id: string }>(esEntry: T, caById: Map<string, T>, locale: Locale): T`

- [ ] **Step 1: Write the failing test**

```ts
// src/i18n/content-locale.test.ts
import { describe, it, expect } from 'vitest';
import { pickLocalizedEntry } from './content-locale';

const es = { id: 'debates/fam/01-x', data: { t: 'ES' } };
const ca = { id: 'debates/fam/01-x.ca', data: { t: 'CA' } };
const caById = new Map([[ca.id, ca]]);

describe('pickLocalizedEntry', () => {
  it('returns the ES entry under es locale', () => {
    expect(pickLocalizedEntry(es, caById, 'es')).toBe(es);
  });
  it('returns the CA sibling under ca when present', () => {
    expect(pickLocalizedEntry(es, caById, 'ca')).toBe(ca);
  });
  it('falls back to the ES entry under ca when the sibling is missing', () => {
    expect(pickLocalizedEntry(es, new Map(), 'ca')).toBe(es);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/i18n/content-locale.test.ts`
Expected: FAIL — "Failed to resolve import './content-locale'".

- [ ] **Step 3: Write minimal implementation**

```ts
// src/i18n/content-locale.ts
import type { Locale } from './locale';

/**
 * Pick the locale-appropriate collection entry. `caById` maps the CA sibling's
 * id ("<esId>.ca") to the CA entry and must be pre-filtered to published CA
 * entries. Under 'ca' returns the sibling when it exists, else the ES entry
 * (fallback). Under 'es' always returns the ES entry.
 */
export function pickLocalizedEntry<T extends { id: string }>(
  esEntry: T,
  caById: Map<string, T>,
  locale: Locale,
): T {
  if (locale !== 'ca') return esEntry;
  return caById.get(`${esEntry.id}.ca`) ?? esEntry;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/i18n/content-locale.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/i18n/content-locale.ts src/i18n/content-locale.test.ts
git commit -m "feat(i18n): add pickLocalizedEntry helper for CA content siblings"
```

---

### Task 2: Wire the debate detail page for locale + create the pilot CA debat

**Files:**
- Modify: `src/pages/debates/[familia]/[slug].astro`
- Create: `src/content/debates/dinero-tecnologia-futuro/01-criptomonedas.ca.mdx`

**Interfaces:**
- Consumes: `pickLocalizedEntry` (Task 1), `getLocale` (`@/i18n/locale`).

- [ ] **Step 1: Create the pilot CA file**

Read the ES source `src/content/debates/dinero-tecnologia-futuro/01-criptomonedas.mdx` in full. Create the sibling `01-criptomonedas.ca.mdx` translating every prose field + the whole body to Valencian (AVL), preserving all structural fields per Global Constraints. Frontmatter starts:

```yaml
---
title: "Les criptomonedes són el futur dels diners o una bambolla?"
mocion: "Les criptomonedes són una alternativa de futur als diners tradicionals."
familia: dinero-tecnologia-futuro
orden: 1
descripcion: "Un debat de taula redona sobre si les criptomonedes poden complir les funcions dels diners o si són, sobretot, un actiu especulatiu."
formato: mesa-redonda
duracion: "50-55 min"
agrupacion: "Grups de 4-6 participants + moderació"
nivel: [bach, fp]
lang: ca
estado: publicado
objetivos:
  - "Aplicar les tres funcions dels diners (mitjà de pagament, unitat de compte, reserva de valor) als actius digitals."
  - "Distingir entre arguments sobre eficiència tecnològica i arguments sobre estabilitat monetària."
  - "Avaluar críticament evidències sobre volatilitat, adopció i cost mediambiental."
conceptos_clave: ["criptomonedes", "Bitcoin", "blockchain", "funcions dels diners", "volatilitat", "diners fiduciaris", "inclusió financera"]
posturas:
  - id: a-favor
    label: "A favor de les criptomonedes"
    sintesis: "Descentralització, inclusió financera i innovació tecnològica les converteixen en una alternativa real als diners tradicionals."
  - id: en-contra
    label: "En contra de les criptomonedes"
    sintesis: "La volatilitat extrema, l'ús especulatiu i el cost energètic mostren que no complixen bé les funcions bàsiques dels diners."
# ...unidades_relacionadas: translate only `nota`, keep asignatura/unidad/competencias; competencias_clave codes intact; rubrica: translate criterio/descripcion, keep competencia codes
---
```

Translate the MDX body preserving all MDX/markdown structure (headings, `:::` directives if any, lists, emphasis).

- [ ] **Step 2: Add the `lang === 'es'` filter to getStaticPaths and the locale swap**

In `src/pages/debates/[familia]/[slug].astro`, add the import and update `getStaticPaths` + frontmatter.

Add to the import block:
```ts
import { getLocale } from '@/i18n/locale';
import { pickLocalizedEntry } from '@/i18n/content-locale';
```

Change the getStaticPaths filter (ES entries define the canonical routes; CA siblings must NOT create their own routes):
```ts
export const getStaticPaths = (async () => {
  const all = (await getCollection('debates')).filter(
    (e) => e.data.estado === 'publicado' && e.data.lang === 'es',
  );
  return all.map((entry) => {
    const [familia, ...rest] = entry.id.replace(/^debates\//, '').split('/');
    return { params: { familia, slug: rest.join('/') }, props: { entry } };
  });
}) satisfies GetStaticPaths;
```

Replace the `const { entry } = Astro.props;` block with the locale swap:
```ts
const { entry } = Astro.props;
const locale = getLocale(Astro.currentLocale);
const caById = new Map(
  (await getCollection('debates'))
    .filter((e) => e.data.estado === 'publicado' && e.data.lang === 'ca')
    .map((e) => [e.id, e]),
);
const view = pickLocalizedEntry(entry, caById, locale);
const d = view.data;
const { Content } = await render(view);
```

(The rest of the frontmatter — `familia`, `pdfHref`, `breadcrumb`, `tonoFor` — stays; it already reads from `d`/`Astro.params`.)

Add `contentLang={locale}` to the `<BaseLayout ...>` opening tag.

- [ ] **Step 3: Verify types**

Run: `npx astro check`
Expected: 0 errors. (Pre-existing warnings/hints in unrelated files are fine.)

- [ ] **Step 4: Verify the render end-to-end**

Start the dev server (`npx astro dev --port 4331`), then fetch and check markers (raw HTTP body stays out of context — derive in code):

```python
import urllib.request
def get(u): return urllib.request.urlopen(u, timeout=20).read().decode('utf-8','replace')
ca = get("http://localhost:4331/ca/debates/dinero-tecnologia-futuro/01-criptomonedas/")
es = get("http://localhost:4331/debates/dinero-tecnologia-futuro/01-criptomonedas/")
print("CA has Valencian title:", "futur dels diners" in ca, '| lang=ca:', 'lang="ca"' in ca)
print("ES still Spanish:", "futuro del dinero" in es, '| lang=es:', 'lang="es"' in es)
print("CA has NO ES motion leak:", "una alternativa de futuro al dinero" not in ca)
```
Expected: all True. Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add "src/pages/debates/[familia]/[slug].astro" "src/content/debates/dinero-tecnologia-futuro/01-criptomonedas.ca.mdx"
git commit -m "feat(i18n): serve debate detail page by locale + pilot CA debat"
```

---

### Task 3: Localize the debate detail chrome + components

**Files:**
- Modify: `src/pages/debates/[familia]/[slug].astro`
- Modify: `src/components/debates/DebateMeta.astro`
- Modify: `src/components/debates/Rubrica.astro`
- Modify: `src/components/debates/materiales/FichaPreparacion.astro`

**Interfaces:**
- Each component gains an optional `locale?: Locale` prop (default `'es'`). The detail page passes `locale={locale}`.

- [ ] **Step 1: Localize DebateMeta**

Replace the frontmatter of `src/components/debates/DebateMeta.astro`:
```ts
---
import type { Locale } from '@/i18n/locale';
/** Metadata badge row for a debate (format, duration, grouping, level). */
interface Props { formato: string; duracion: string; agrupacion: string; nivel: string[]; locale?: Locale; }
const { formato, duracion, agrupacion, nivel, locale = 'es' } = Astro.props;
const copy = {
  es: {
    dt: { formato: 'Formato', duracion: 'Duración', agrupacion: 'Agrupación', nivel: 'Nivel' },
    formatoLabel: { 'parlamentario': 'Parlamentario', 'mesa-redonda': 'Mesa redonda', 'juicio-simulado': 'Juicio simulado', 'dilema-etico': 'Dilema ético', 'fishbowl': 'Fishbowl' } as Record<string, string>,
    nivelLabel: { eso: 'ESO', bach: 'Bachillerato', fp: 'FP' } as Record<string, string>,
  },
  ca: {
    dt: { formato: 'Format', duracion: 'Durada', agrupacion: 'Agrupació', nivel: 'Nivell' },
    formatoLabel: { 'parlamentario': 'Parlamentari', 'mesa-redonda': 'Taula redona', 'juicio-simulado': 'Juí simulat', 'dilema-etico': 'Dilema ètic', 'fishbowl': 'Fishbowl' } as Record<string, string>,
    nivelLabel: { eso: 'ESO', bach: 'Batxillerat', fp: 'FP' } as Record<string, string>,
  },
}[locale];
---
<dl class="meta">
  <div><dt>{copy.dt.formato}</dt><dd>{copy.formatoLabel[formato] ?? formato}</dd></div>
  <div><dt>{copy.dt.duracion}</dt><dd>{duracion}</dd></div>
  <div><dt>{copy.dt.agrupacion}</dt><dd>{agrupacion}</dd></div>
  <div><dt>{copy.dt.nivel}</dt><dd>{nivel.map((n) => copy.nivelLabel[n] ?? n).join(' · ')}</dd></div>
</dl>
```
(Leave the `<style>` block unchanged.)

- [ ] **Step 2: Localize Rubrica**

Replace the frontmatter + `<thead>` of `src/components/debates/Rubrica.astro`:
```ts
---
import type { Locale } from '@/i18n/locale';
/** Evaluation rubric: criteria and the competencia each one works. */
interface Criterio { criterio: string; descripcion: string; competencia?: string; }
interface Props { rubrica: Criterio[]; locale?: Locale; }
const { rubrica, locale = 'es' } = Astro.props;
const copy = {
  es: { criterio: 'Criterio', valora: 'Qué se valora', competencia: 'Competencia' },
  ca: { criterio: 'Criteri', valora: 'Què es valora', competencia: 'Competència' },
}[locale];
---
```
And the header row:
```astro
<thead><tr><th>{copy.criterio}</th><th>{copy.valora}</th><th>{copy.competencia}</th></tr></thead>
```

- [ ] **Step 3: Localize FichaPreparacion**

Replace the frontmatter of `src/components/debates/materiales/FichaPreparacion.astro`:
```ts
---
import type { Locale } from '@/i18n/locale';
interface Props { mocion: string; locale?: Locale; }
const { mocion, locale = 'es' } = Astro.props;
const lineas = (n: number) => Array.from({ length: n });
const copy = {
  es: { tag: 'Ficha del alumno · antes del debate', title: 'Preparo mi postura', mocion: 'Moción:', postura: 'Mi postura', args: 'Mis 3 argumentos (con una evidencia o ejemplo concreto en cada uno):', arg: 'Argumento', evidencia: 'Evidencia', pregunta: 'Una pregunta que le haré al grupo rival:', refutar: 'Un argumento del otro grupo que tendré que refutar:', notas: 'Notas durante el debate:' },
  ca: { tag: "Fitxa de l'alumne · abans del debat", title: 'Preparo la meua postura', mocion: 'Moció:', postura: 'La meua postura', args: 'Els meus 3 arguments (amb una evidència o exemple concret en cadascun):', arg: 'Argument', evidencia: 'Evidència', pregunta: 'Una pregunta que li faré al grup rival:', refutar: "Un argument de l'altre grup que hauré de refutar:", notas: 'Notes durant el debat:' },
}[locale];
---
```
Then replace the fixed strings in the markup: `{copy.tag}`, `{copy.title}`, `<strong>{copy.mocion}</strong>`, `<span>{copy.postura}</span>`, `{copy.args}`, `<span>{n}. {copy.arg}</span>`, `<span>{copy.evidencia}</span>`, the two `<p class="ficha__q">` for `{copy.pregunta}` and `{copy.refutar}`, and `{copy.notas}`. (Leave the `<style>` block and line-generation logic unchanged.)

- [ ] **Step 4: Add the page chrome copy + pass locale to components**

In `src/pages/debates/[familia]/[slug].astro`, add a `copy` object to the frontmatter (after the `view`/`d` lines):
```ts
const copy = {
  es: { debates: 'Debates', inicio: 'Inicio', mocionH: 'La moción', objetivos: 'Objetivos', conceptos: 'Conceptos:', descargar: 'Descargar materiales del debate (PDF)', descargarSub: 'Guía del profesor · hoja de evaluación · tarjetas · ficha del alumno', rubricaH: 'Rúbrica de evaluación', compH: 'Competencias que se trabajan', clave: 'Clave:', especificas: 'Específicas:', volver: '← Todos los debates' },
  ca: { debates: 'Debats', inicio: 'Inici', mocionH: 'La moció', objetivos: 'Objectius', conceptos: 'Conceptes:', descargar: 'Descarregar materials del debat (PDF)', descargarSub: "Guia del professor · full d'avaluació · targetes · fitxa de l'alumne", rubricaH: "Rúbrica d'avaluació", compH: 'Competències que es treballen', clave: 'Clau:', especificas: 'Específiques:', volver: '← Tots els debats' },
}[locale];
```
Replace the corresponding hardcoded strings in the markup with `copy.*` (title `` `${d.title} — ${copy.debates}` ``, breadcrumb `{copy.inicio}`/`{copy.debates}`, `{copy.mocionH}`, `{copy.objetivos}`, `<strong>{copy.conceptos}</strong>`, download `<strong>{copy.descargar}</strong>` + `<span class="muted">{copy.descargarSub}</span>`, `{copy.rubricaH}`, `{copy.compH}`, `<strong>{copy.clave}</strong>`, `<strong>{copy.especificas}</strong>`, `{copy.volver}`). Pass `locale` to the components:
```astro
<DebateMeta formato={d.formato} duracion={d.duracion} agrupacion={d.agrupacion} nivel={d.nivel} locale={locale} />
...
<PosturaCard label={p.label} sintesis={p.sintesis} tono={tonoFor(i, d.posturas.length)} />
...
<Rubrica rubrica={d.rubrica} locale={locale} />
...
<FichaPreparacion mocion={d.mocion} locale={locale} />
```
(PosturaCard has no fixed chrome — no locale needed.)

- [ ] **Step 5: Verify types + render**

Run: `npx astro check` → 0 errors.
Start dev server; check the CA page chrome:
```python
import urllib.request
ca = urllib.request.urlopen("http://localhost:4331/ca/debates/dinero-tecnologia-futuro/01-criptomonedas/", timeout=20).read().decode('utf-8','replace')
for m in ["La moció", "Objectius", "Conceptes:", "Tots els debats", "Taula redona", "Rúbrica d&#39;avaluació"]:
    print(m, "->", m in ca)
print("no ES chrome leak:", all(x not in ca for x in ["La moción", "Todos los debates", ">Objetivos<"]))
```
Expected: all markers True, no leak. Stop the dev server.

- [ ] **Step 6: Commit**

```bash
git add "src/pages/debates/[familia]/[slug].astro" src/components/debates/DebateMeta.astro src/components/debates/Rubrica.astro src/components/debates/materiales/FichaPreparacion.astro
git commit -m "feat(i18n): localize debate detail chrome + components to Valencian"
```

---

### Task 4: CA↔ES structural parity guard test

**Files:**
- Create: `src/i18n/debates-ca-parity.test.ts`

- [ ] **Step 1: Write the test**

```ts
// src/i18n/debates-ca-parity.test.ts
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Every `nn-slug.ca.mdx` debate must (1) have an ES sibling, (2) declare
 * `lang: ca` + `estado: publicado`, (3) share `orden` with its ES sibling,
 * (4) carry a non-trivial body. `astro:content` is not importable from Vitest,
 * so files are read straight off disk (same approach as fichas-ca.test.ts).
 */
const ROOT = join('src', 'content', 'debates');
const fm = (text: string) => text.split('---')[1] ?? '';
const body = (text: string) => text.split(/^---$/m).slice(2).join('---');
const orden = (text: string) => (fm(text).match(/^orden:\s*(\d+)/m) ?? [])[1];

const caFiles = readdirSync(ROOT, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .flatMap((fam) =>
    readdirSync(join(ROOT, fam.name))
      .filter((f) => f.endsWith('.ca.mdx'))
      .map((f) => ({ familia: fam.name, file: f })),
  );

describe('debates CA sibling parity', () => {
  it('there is at least one CA debate', () => {
    expect(caFiles.length).toBeGreaterThan(0);
  });
  for (const { familia, file } of caFiles) {
    const caPath = join(ROOT, familia, file);
    const esPath = join(ROOT, familia, file.replace(/\.ca\.mdx$/, '.mdx'));
    const ca = readFileSync(caPath, 'utf8');
    it(`${familia}/${file} has an ES sibling with the same orden and is published CA prose`, () => {
      const es = readFileSync(esPath, 'utf8'); // throws if missing
      expect(fm(ca)).toMatch(/^lang:\s*ca\s*$/m);
      expect(fm(ca)).toMatch(/^estado:\s*publicado\s*$/m);
      expect(orden(ca)).toBe(orden(es));
      expect(body(ca).trim().length).toBeGreaterThan(200);
      // slug override REQUIRED (Astro strips dots from ids → else silent ES fallback)
      const expectedSlug = `debates/${familia}/${file.replace(/\.mdx$/, '')}`;
      expect(fm(ca)).toContain(`slug: "${expectedSlug}"`);
    });
  }
});
```

- [ ] **Step 2: Run test to verify it passes (pilot present)**

Run: `npx vitest run src/i18n/debates-ca-parity.test.ts`
Expected: PASS (pilot `01-criptomonedas.ca.mdx` satisfies all assertions).

- [ ] **Step 3: Commit**

```bash
git add src/i18n/debates-ca-parity.test.ts
git commit -m "test(i18n): guard CA↔ES structural parity for debates"
```

---

### Task 5: Translate the remaining 17 debats (fan-out)

**Files (create one `.ca.mdx` per ES source, same folder):**
```
dinero-tecnologia-futuro/02-ia-y-empleo.ca.mdx
dinero-tecnologia-futuro/03-sociedad-sin-efectivo.ca.mdx
etica-empresa-consumo/01-rsc-vs-greenwashing.ca.mdx
etica-empresa-consumo/02-publicidad-menores.ca.mdx
etica-empresa-consumo/03-tope-sueldos-directivos.ca.mdx
globalizacion-comercio/01-proteccionismo-libre-comercio.ca.mdx
globalizacion-comercio/02-deslocalizacion.ca.mdx
globalizacion-comercio/03-comprar-local-vs-barato.ca.mdx
mercado-estado/01-salario-minimo.ca.mdx
mercado-estado/02-tope-alquileres.ca.mdx
mercado-estado/03-renta-basica.ca.mdx
sostenibilidad-crecimiento/01-decrecimiento-vs-crecimiento-verde.ca.mdx
sostenibilidad-crecimiento/02-vuelos-cortos.ca.mdx
sostenibilidad-crecimiento/03-quien-paga-transicion.ca.mdx
trabajo-desigualdad/01-jornada-4-dias.ca.mdx
trabajo-desigualdad/02-impuesto-grandes-fortunas.ca.mdx
trabajo-desigualdad/03-impuesto-sucesiones.ca.mdx
```

- [ ] **Step 1: Fan out translation subagents**

Dispatch one subagent per file (or batch by família). Each subagent prompt MUST include:
- The reference: `src/content/debates/dinero-tecnologia-futuro/01-criptomonedas.ca.mdx` (the pilot) — replicate its shape exactly.
- The ES source to translate (the matching `.mdx`).
- Hard rules (Global Constraints): translate prose only; preserve `familia`/`orden`/`formato`/`nivel`/`competencias_*` codes/`posturas[].id`/`unidades_relacionadas` codes/rubric ids identical; set `lang: ca`, `estado: publicado`; **set the REQUIRED `slug: "debates/<familia>/<nn-slug>.ca"` field** (else /ca silently serves ES — see Global Constraints); keep MDX/markdown structure intact; AVL vocabulary; economic notation untouched.
- Reference the pilot `01-criptomonedas.ca.mdx` for the exact frontmatter shape (including the `slug:` line).
- Output: write ONLY the `.ca.mdx` file. Do not touch pages, components, or tests.

- [ ] **Step 1b: Add the `lang === 'es'` route/card guards (once, before verifying the fan-out)**

Confirm these two consumers filter `e.data.lang === 'es'` (done in Task 2's follow-up, but verify): `src/pages/debates/index.astro` (hub cards) and `src/pages/debates/[familia]/[slug]/imprimir.astro` (print routes). Without them, CA siblings double-list on the hub / create bogus `.ca` print routes.

- [ ] **Step 2: Verify real file state (not agent reports)**

Run:
```bash
ls src/content/debates/*/*.ca.mdx | wc -l   # expect 18
grep -L "lang: ca" src/content/debates/*/*.ca.mdx   # expect no output
grep -L "estado: publicado" src/content/debates/*/*.ca.mdx   # expect no output
```
Expected: 18 files; both greps empty.

- [ ] **Step 3: Run the parity guard + typecheck**

Run: `npx vitest run src/i18n/debates-ca-parity.test.ts` → PASS (18 cases).
Run: `npx astro check` → 0 errors.

- [ ] **Step 4: Spot-check render of 2-3 debats from different famílies**

Start dev server; for a couple of CA URLs confirm Valencian body + no obvious ES leak in the prose (derive in code, print booleans). Stop the server.

- [ ] **Step 5: Commit (batched)**

```bash
git add src/content/debates
git commit -m "feat(i18n): translate the remaining 17 debats to Valencian"
```

---

### Task 6: Final verification + finish the branch

- [ ] **Step 1: Full suite + typecheck**

Run: `npx vitest run` → all green.
Run: `npx astro check` → 0 errors.

- [ ] **Step 2: Update the CA program memory ledger**

Add a "Fase 3A" entry to `project_ca_translation.md` (and the MEMORY.md index line): pattern established (lang:ca siblings + pickLocalizedEntry + locale swap + parity guard), 18 debats live, reuse path for dinàmiques/proyectos/books. Note deferred: materials PDF (sub-project D), PuenteUnidades unit titles (sub-project B).

- [ ] **Step 3: Push + open PR (only when Pau asks)**

Do not push/PR autonomously. When Pau asks, push `feat/ca-fase3a-debats-content` and open a PR against `main` summarizing the pattern + the publish-now gate (Pau reviews post-merge).

## Self-Review

**Spec coverage:** file model (Task 2 pilot + Task 5 fan-out), page wiring/locale swap (Task 1 helper + Task 2), chrome i18n incl. components (Task 3), out-of-scope PDFs/PuenteUnidades/hub (documented, not touched), parity guard (Task 4), render verification (Tasks 2/3/5), reuse note (Task 6). All spec sections map to a task.

**Placeholder scan:** No TBD/TODO. Content-authoring steps (Tasks 2/5) legitimately describe *what* to produce + rules rather than embedding 18 full translations — that is the work product, not a logic placeholder. All code/logic steps show real code.

**Type consistency:** `pickLocalizedEntry(esEntry, caById, locale)` signature identical in Task 1 (def) and Task 2 (use). `locale?: Locale` prop consistent across DebateMeta/Rubrica/FichaPreparacion and the page's `locale={locale}` calls. `caById` keyed by `"<esId>.ca"` in both the page (Task 2) and the helper contract (Task 1).
