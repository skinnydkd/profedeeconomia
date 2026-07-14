# Fase 3A — Traducció al valencià del contingut dels debats (pilot de contingut MDX)

**Data**: 2026-07-14
**Estat**: aprovat, pendent de pla d'implementació
**Programa**: [[project-ca-translation]] — traducció de tot el web+materials al valencià (AVL)

## Context

Les fases 1–2E (PRs #190–#199, totes en producció) han traduït **tota la capa d'UI/chrome/illes/marc** al valencià. El que queda del programa és **contingut educatiu**: cossos MDX de les 61 fitxes transversals, 88 unitats de llibre, contingut servit dels jocs, i regeneració de PDFs.

Aquesta és la **primera peça de contingut** i estableix el patró reutilitzable per a la resta. Per decisió de Pau, el pilot són els **18 debats** (família `/debates/`); després es farà fan-out a dinàmiques (25) i projectes (18) amb el mateix patró, i més avant als 88 llibres.

## Decisions preses (brainstorm)

1. **Abast inicial**: només els **18 debats**. Dinàmiques i projectes van després, reutilitzant el patró.
2. **Gate de publicació**: **publica ja, Pau revisa després** (mateix flux que el chrome). Els MDX CA naixen `estado: publicado` i entren en directe al PR; Pau revisa post-merge i es corregeix amb commits posteriors.
3. **Model de fitxer**: MDX germans `lang: ca` (Opció 1), aprofitant el camp `lang: z.enum(['es','ca'])` que ja existix a l'esquema de col·leccions.

## Arquitectura

### 1. Model de fitxer i aparellament

- Cada debat ES `src/content/debates/<familia>/nn-slug.mdx` guanya un germà **`nn-slug.ca.mdx`** a la mateixa carpeta i col·lecció.
- Frontmatter del germà CA: `lang: ca`, `estado: publicado`, **mateixos** `familia` i `orden` que l'ES.
- El loader glob de la col·lecció `debates` ja captura `**/*.mdx`, així que els germans CA entren a la col·lecció sense tocar el config.
- `entry.id` del germà = `debates/<familia>/nn-slug.ca`. L'aparellament lògic ES↔CA es fa **llevant el sufix `.ca`** de l'id (o casant `familia`+`orden`).

### 2. Cablejat de la pàgina de detall

Fitxer: `src/pages/debates/[familia]/[slug].astro`.

- `getStaticPaths`: filtrar a `estado === 'publicado'` **i `lang === 'es'`** — els entries ES defineixen les rutes canòniques; els CA **no** creen rutes pròpies (evita col·lisió `familia/slug`).
- Dins de la pàgina: construir un mapa dels entries CA `publicado` per id-base. Seleccionar la vista:
  ```
  const locale = getLocale(Astro.currentLocale);
  const caSibling = caById.get(`${entry.id}.ca`);
  const view = locale === 'ca' && caSibling ? caSibling : entry;
  const { Content } = await render(view);
  const d = view.data;
  ```
- Fallback automàtic: si un debat encara no té germà CA (o està `borrador`), `/ca` mostra l'ES — coherent amb tota l'arquitectura de fallback existent.
- **GOTCHA vinculant** ([[project-ca-translation]]): el locale es deriva **sempre** d'`Astro.currentLocale`, mai de la URL (sota `fallbackType: 'rewrite'` Astro no actualitza `Astro.url.pathname`).

### 3. i18n del chrome de la pàgina de detall

Patró establert: `const copy = { es: {...}, ca: {...} }[locale]` + `contentLang={locale}` a `BaseLayout`.

- Strings de la pàgina a localitzar: títol `— Debates`, breadcrumb (Inicio/Debates), "La moción", "Objetivos", "Conceptos:", barra de descàrrega ("Descargar materiales del debate (PDF)" + subtext), "Rúbrica de evaluación", "Competencias que se trabajan" ("Clave:"/"Específicas:"), "← Todos los debates".
- Components de debat (`@components/debates/`: `DebateMeta`, `Rubrica`, `FichaPreparacion`, `PosturaCard`): reben un prop `locale?: Locale` (default `'es'`) i localitzen les seues etiquetes fixes amb `copy={es,ca}` local. `PosturaCard` probablement no té chrome propi (només mostra dades) — verificar.

### 4. Camps de frontmatter a traduir (contingut) vs preservar (estructura)

**Traduir** (prosa visible): `title`, `descripcion`, `mocion`, `objetivos[]`, `conceptos_clave[]`, `posturas[].label`, `posturas[].sintesis`, `rubrica[].criterio`, `rubrica[].descripcion` (i nivells si n'hi ha), `unidades_relacionadas[].nota`, i **tot el cos MDX**.

**Preservar idèntic** (estructura/codis): `familia`, `orden`, `formato`, `duracion`*, `agrupacion`*, `nivel[]`, `competencias_clave[]` (codis CCL/CD…), `competencias_especificas[]`, `unidades_relacionadas[].asignatura`/`unidad`/`competencias_especificas[]`, `posturas[].id`, `rubrica[]` pesos/ids.

\* `duracion`/`agrupacion` es tradueixen a la versió CA del text ("50-55 min" es manté; "Grupos de 4-6…" → "Grups de 4-6…").

### 5. Fora d'abast (documentat, no és regressió)

- **PDF "Materiales del debate"** (`build:debates` → `/downloads/*.pdf`): es queda ES; va amb el **sub-projecte D** (regeneració de PDFs). L'enllaç de descàrrega sota /ca apunta al PDF ES (assets = sempre ES, com la regla `sticky-locale` que salta fitxers amb extensió).
- **`PuenteUnidades`**: els **títols d'unitat** que mostra són contingut de llibre → fallback ES fins al **sub-projecte B** (llibres). Es localitza només la seua etiqueta de secció si en té.
- **Hub `/debates/`**: ja és VAL via overlay `fichas-ca` (Fase 2B); **no es toca**. La duplicació `title`/`descripcion` (overlay de targeta + MDX CA de detall) és mínima i acceptada; l'SSOT de la targeta segueix sent l'overlay.

## Execució

- **Pilot a mà primer**: traduir 1 debat complet a mà (fitxer CA + cablejat de pàgina + chrome + components), com a **referència exacta** per als subagents.
- **Fan-out**: subagents (1 per debat, o 1 per família si convé), cadascun apuntant al pilot com a referència, amb regles dures (només prosa; no tocar codis/estructura; notació econòmica intacta). El cablejat de pàgina, els components i el test de guarda els fa el fil principal (no els agents, per evitar curses).
- **Operativa provada** ([[project-ca-translation]]): els subagents completen l'edició del fitxer encara que caiguen escrivint l'informe → verificar sempre l'estat REAL (`grep`, `astro check`), no l'informe. Commit per lots. Mai `git checkout -- <file>` sobre feina d'agent sense commitejar.

## Verificació

- **Test de guarda**: per a cada debat ES `publicado`, existix germà CA amb (a) `familia`/`orden` idèntics, (b) els mateixos codis estructurals, (c) cap camp de prosa buit. Llig del disc (`astro:content` no és importable des de Vitest — patró de Fase 2B).
- **`astro check`**: 0 errors.
- **Render real**: dev-server, `/ca/debates/<familia>/<slug>/` servix VAL (contingut + chrome), `/es` es queda ES, `lang` correcte, zero fuites d'idioma.
- **Suite completa** verda.

## Vocabulari VAL

Valencià, norma AVL. Mateix registre i preferències que les fases prèvies (ledger de [[project-ca-translation]]): incoatives `-ix` (invertix/decidix), "despesa" (no "gasto"), "este/esta", "seua/seues", etc. La còpia VAL és nova i no revisada línia-a-línia — Pau revisa post-merge.

## Reutilització

El patró complet (germà `lang:ca` + `getStaticPaths` filtrat per lang + swap per locale amb fallback + chrome `copy={es,ca}` + test de guarda que llig del disc) servix **tal qual** per a:
- Dinàmiques (25) i projectes (18) — mateixa forma de col·lecció/pàgina.
- Els 88 llibres (sub-projecte B) — mateix model de fitxer germà; la pàgina de llibre tindrà el seu propi chrome.

## Riscos

- **Scope creep dels components compartits**: `PuenteUnidades` és compartit (l'usa també `GameShell`) → NO fer-lo locale-aware profundament; només fallback ES dels títols d'unitat.
- **Volum de prosa**: 18 cossos MDX + frontmatter ric. Mitigat amb fan-out de subagents i pilot de referència.
- **Exactitud del contingut** (crític per `CLAUDE.md`): mitigat pel gate "Pau revisa després" + guarda estructural. El risc assumit és que el VAL surt en directe abans de la revisió humana (decisió explícita de Pau).
