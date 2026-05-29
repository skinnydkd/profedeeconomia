# EDMN 2BACH · Pilot d'innovació editorial — pla d'implementació

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar les sis innovacions editorials del spec
[2026-05-27-edmn-pilot-innovacion](../specs/2026-05-27-edmn-pilot-innovacion.md)
sobre el llibre EDMN 2BACH, fixar el bug del TOC, i deixar la unitat
U6 (Función comercial · marketing) maquetada amb el patró nou com a
prova de concepte.

**Architecture:** Astro 5 + Preact + Tailwind, contingut a MDX amb
components Astro reusables. PDF generat amb paged.js + pagedjs-cli.
Cap component requereix interactivitat (totes estàtiques). EBAU
appendix s'integra al render del PDF dins de `imprimir.astro`.

**Tech Stack:** Astro 5, MDX, Tailwind 4, paged.js, pagedjs-cli, vitest
(opcional, per a tests de schema).

**Abast d'aquest pla.** Infraestructura editorial completa (components,
print CSS, estructura del llibre) + Pilot sobre **una sola unitat**
(U6). Les 11 unitats restants i els altres 10 llibres queden fora
d'aquest pla — es planifiquen quan el pilot estiga validat.

---

## File Structure

### Components a crear

| Fitxer | Responsabilitat |
|---|---|
| `src/components/TldrUnidad.astro` | Caixa TL;DR de 90 segons al començament de la unitat |
| `src/components/CasoDilema.astro` | Opener: notícia datada + dilema |
| `src/components/VuelveAlCaso.astro` | Tancament: resposta argumentada |
| `src/components/PistaEbau.astro` | Sidebar curt amb truc d'EBAU |
| `src/components/VocesDesacuerdo.astro` | Sidebar "vs" amb dues postures etiquetades |
| `src/components/RetoEtapa.astro` | Fitxa de mitja pàgina del projecte continu |
| `src/components/MirarFora.astro` | Pàgina completa amb llibre + vídeo + compte + activitat + tip "Para clase" |

### Estructura de contingut a crear

| Fitxer | Contingut |
|---|---|
| `src/content/asignaturas/edmn-2bach/ebau/01-teoria-como-responder.mdx` | Apèndix EBAU secció 1 |
| `src/content/asignaturas/edmn-2bach/ebau/02-umbral-rentabilidad.mdx` | Apèndix EBAU secció 2 |
| `src/content/asignaturas/edmn-2bach/ebau/03-balance-pyg.mdx` | Apèndix EBAU secció 3 |
| `src/content/asignaturas/edmn-2bach/ebau/04-ratios.mdx` | Apèndix EBAU secció 4 |
| `src/content/asignaturas/edmn-2bach/ebau/05-van-tir-payback.mdx` | Apèndix EBAU secció 5 |
| `src/content/asignaturas/edmn-2bach/ebau/06-gestion-tiempo.mdx` | Apèndix EBAU secció 6 |
| `src/content/asignaturas/edmn-2bach/ebau/07-cheatsheet.mdx` | Apèndix EBAU secció 7 |
| `src/content/asignaturas/edmn-2bach/reto/intro.mdx` | 2 pàg. obertura del Reto del curso |
| `src/content/asignaturas/edmn-2bach/reto/rubrica.mdx` | Rúbrica final del pitch |

### Estructura de schema

Afegit a `src/content.config.ts`:

```ts
// Nova col·lecció — reto-del-curso (intro + rúbrica)
const retoCurso = defineCollection({
  loader: glob({
    pattern: 'asignaturas/*/reto/**/*.{md,mdx}',
    base: './src/content',
  }),
  schema: z.object({
    asignatura: z.enum(ASIGNATURA_SLUGS),
    orden: z.number().int().min(0),
    title: z.string(),
    lang: z.enum(LANGS).default('es'),
    estado: z.enum(ESTADOS).default('borrador'),
  }),
});
```

### Fitxers a modificar

| Fitxer | Modificació |
|---|---|
| `src/content.config.ts` | Afegir col·lecció `retoCurso` |
| `src/pages/[asignatura]/libro/imprimir.astro` | (a) Fix bug TOC, (b) print CSS per als 7 components nous, (c) injecció de pàgines Reto Intro abans del TOC, (d) injecció d'apèndix EBAU després de l'últim capítol |
| `src/content/asignaturas/edmn-2bach/libro/06-funcion-comercial-marketing.mdx` | Afegir els components nous al pilot (TL;DR, CasoDilema, VuelveAlCaso, PistaEbau, VocesDesacuerdo, RetoEtapa, MirarFora) |
| `docs/issues-pilot-edmn.md` | Llista d'errors trobats al bug audit |

---

## Notes de testing

L'stack no té tests existents (`tests/` no existeix). Vitest sí està
configurat al `package.json`. La filosofia pragmàtica per a aquest pla:

- **Tests d'schema** amb vitest: validar que MDX nous compleixen
  l'schema (un test per col·lecció nova).
- **Tests visuals**: per a cada component, generem una pàgina de
  preview a `/dev/` i fem screenshot. La verificació humana és el
  test.
- **Test integral**: `npm run build:pdf` per a EDMN 2BACH ha de
  produir un PDF sense errors al final del pla.

Per a cada task que crea un component, l'ordre real és:
1. Escriure un MDX de prova mínim que use el component
2. Confirmar amb `npm run dev` que renderitza al web
3. Confirmar amb `npm run build:pdf` que renderitza al PDF sense
   bloquejar la paginació
4. Commit

No es fa TDD pur amb vitest perquè els components són purament
presentacionals — la unitat de verificació és el render.

---

## Fase 0 · Auditoria de bugs

### Task 0.1: Generar PDF baseline d'EDMN 2BACH

**Files:**
- Use: `npm run build:pdf`

- [ ] **Step 1: Build site (prerequisit del PDF)**

```bash
npm run build
```

Expected: build OK, sense errors.

- [ ] **Step 2: Generar PDF d'EDMN 2BACH**

```bash
npm run build:pdf
```

Expected: fitxers PDF generats a `dist/` o on `build:pdf` els deixe.
Comprovar amb `ls dist/**/*.pdf` (o glob equivalent).

- [ ] **Step 3: Verificar manualment el PDF d'EDMN 2BACH**

Obrir el PDF generat amb el visor del sistema. Anar a la pàgina del
TOC. Confirmar que es reprodueix el bug del screenshot (lema d'item
trencat de pàgina i renderitzat en columna estreta).

- [ ] **Step 4: Commit**

Cap canvi de codi. Sense commit. Continuar a Task 0.2.

---

### Task 0.2: Crear fitxer d'issues amb el resultat de l'auditoria

**Files:**
- Create: `docs/issues-pilot-edmn.md`

- [ ] **Step 1: Crear l'arxiu amb estructura inicial**

```markdown
# EDMN 2BACH — Issues d'auditoria (pilot innovació)

Data: 2026-05-27
Tipus: visuals (paged.js) + contingut.

## Visuals

### B-001 — TOC overflow al canvi de pàgina
- Descripció: ítems del TOC que es trenquen entre dues pàgines
  re-flueixen amb el `lema` en columna vertical estretíssima al marge.
- Causa: a `imprimir.astro:437`, `.toc__item` usa
  `display: grid; grid-template-columns: 16mm 1fr auto`. Sense
  `break-inside: avoid`, paged.js fragmenta l'ítem entre pàgines i
  el grid items perden el seu ample esperat.
- Severitat: alta (visible al primer fullejada del llibre)
- Plan: Task 0.3

## Contingut

(Pendents d'omplir durant Task 0.4)
```

- [ ] **Step 2: Recórrer el PDF pàgina a pàgina afegint issues nous**

Per a cada pàgina del PDF, anotar a `docs/issues-pilot-edmn.md` qualsevol cosa rara:
drop caps duplicats, figures que es passen del bloc, sidebars trencats,
errates ortotipogràfiques visibles, fórmules incorrectes.

Format dels issues:
```markdown
### B-NNN — [Títol curt]
- Descripció:
- Causa (si es coneix):
- Severitat: alta / mitjana / baixa
- Plan: Task X.Y / pendent
```

- [ ] **Step 3: Commit**

```bash
git add docs/issues-pilot-edmn.md
git commit -m "docs: auditoria d'errors d'EDMN 2BACH (pilot innovació)"
```

---

### Task 0.3: Fix del bug del TOC

**Files:**
- Modify: `src/pages/[asignatura]/libro/imprimir.astro:436-470`

- [ ] **Step 1: Modificar `.toc__item` per a impedir trencament**

Localitzar (línia ~436):

```css
.toc__item {
  display: grid;
  grid-template-columns: 16mm 1fr auto;
  column-gap: 4mm;
  align-items: baseline;
  padding: 3mm 0;
  border-bottom: 1px solid var(--color-line-soft);
}
```

Reemplaçar per:

```css
.toc__item {
  display: grid;
  grid-template-columns: 16mm 1fr auto;
  column-gap: 4mm;
  align-items: baseline;
  padding: 3mm 0;
  border-bottom: 1px solid var(--color-line-soft);
  break-inside: avoid;
  page-break-inside: avoid;
}
```

I limitar el `lema` a un màxim de 2 línies amb truncació suau:

```css
.toc__lede {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 9pt;
  color: var(--color-ink-mute);
  line-height: 1.35;
  font-variation-settings: "SOFT" 80;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

- [ ] **Step 2: Regenerar el PDF**

```bash
npm run build:pdf
```

Expected: build OK.

- [ ] **Step 3: Verificar visualment el TOC del PDF nou**

Obrir el PDF d'EDMN 2BACH. Anar a la pàgina del TOC. Confirmar:
- Cap ítem es trenca entre pàgines (poden quedar al final i empènyer
  l'últim ítem a la pàgina següent — és el comportament correcte).
- Tots els lemes són d'1-2 línies max, sense overflow.

- [ ] **Step 4: Marcar issue B-001 com a resolt**

```markdown
### B-001 — TOC overflow al canvi de pàgina
- Estat: ✓ Resolt a Task 0.3
- Descripció: ...
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/[asignatura]/libro/imprimir.astro docs/issues-pilot-edmn.md
git commit -m "fix(print): TOC items mai es trenquen de pàgina + lede a 2 línies max"
```

---

### Task 0.4: Resoldre issues addicionals trobats

**Files:** depèn dels issues trobats a Task 0.2

- [ ] **Step 1: Per a cada issue de severitat alta, decidir si va al pla**

Si l'issue és puntual i ràpid (<15 min de fix), es resol ara. Si és
estructural (afecta múltiples components o pàgines), es planifica al
seu propi task. Si és contingut (errata, error conceptual), es deixa
per a la fase de pilot a U6.

- [ ] **Step 2: Aplicar els fixos puntuals decidits**

Cada fix segueix el patró: localitzar al codi, fer canvi mínim,
regenerar PDF, verificar visualment, actualitzar el marcador d'estat
del issue a `docs/issues-pilot-edmn.md`.

- [ ] **Step 3: Commit per cada grup lògic de fixos**

```bash
git add <files>
git commit -m "fix(print): <descripció breu>"
```

---

## Fase 1 · Components nous

### Task 1.1: Component `PistaEbau` (el més senzill primer)

**Files:**
- Create: `src/components/PistaEbau.astro`
- Reference: `src/components/Curiosity.astro` (mateix patró estructural)

- [ ] **Step 1: Crear el component**

```astro
---
type Props = {
  /** Tipus de pista — afecta el kicker. */
  tipo: 'teorica' | 'practica';
  /** Etiqueta del concepte ("Umbral", "VAN/TIR", "Ratios"…). */
  concepto: string;
  /** Referència interna a l'apèndix ("Apèndix D.4" o similar). */
  apendice?: string;
};
const { tipo, concepto, apendice } = Astro.props;
const kicker = tipo === 'teorica' ? 'Pista EBAU · Teoría' : 'Pista EBAU · Práctica';
---

<aside class="pista-ebau" data-tipo={tipo}>
  <span class="pista-ebau__kicker">{kicker}</span>
  <h4 class="pista-ebau__concepto">{concepto}</h4>
  <div class="pista-ebau__body"><slot /></div>
  {apendice && <p class="pista-ebau__ref">→ {apendice}</p>}
</aside>

<style>
  .pista-ebau {
    margin: 2rem 0;
    padding: 1.2rem 1.4rem;
    background: var(--color-terra-soft);
    border-left: 3px solid var(--color-terra);
    border-radius: 0 6px 6px 0;
  }
  .pista-ebau__kicker {
    font-family: var(--font-sans);
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--color-terra-deep);
    font-weight: 700;
    display: block;
    margin-bottom: 0.3rem;
  }
  .pista-ebau__concepto {
    font-family: var(--font-serif);
    font-size: 1.1rem;
    margin: 0 0 0.5rem;
    color: var(--color-ink);
    font-weight: 500;
    font-variation-settings: "SOFT" 80, "WONK" 0;
  }
  .pista-ebau__body {
    font-size: 0.95rem;
    line-height: 1.5;
    color: var(--color-ink-soft);
  }
  .pista-ebau__body :global(p) { margin: 0 0 0.6em; }
  .pista-ebau__body :global(p:last-child) { margin-bottom: 0; }
  .pista-ebau__body :global(p::first-letter) {
    font-family: inherit; font-weight: inherit; font-size: inherit;
    line-height: inherit; float: none; padding: 0; color: inherit;
  }
  .pista-ebau__ref {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    color: var(--color-terra-deep);
    margin: 0.6rem 0 0;
  }
  @media print {
    .pista-ebau { break-inside: avoid; page-break-inside: avoid; }
  }
</style>
```

- [ ] **Step 2: Provar al dev server amb un MDX de prova**

Modificar temporalment una unitat (per exemple, el primer paràgraf
d'U6) per importar i renderitzar `PistaEbau`:

```mdx
import PistaEbau from '@components/PistaEbau.astro';

<PistaEbau tipo="teorica" concepto="Productividad ≠ rentabilidad" apendice="Apèndix D.1">
La productividad mide unidades de output por unidad de input (técnica).
La rentabilidad mide beneficio por unidad de capital invertido
(financiera). El corrector lo identifica al instante.
</PistaEbau>
```

Executar:

```bash
npm run dev
```

Obrir `http://localhost:4321/edmn-2bach/libro/06-funcion-comercial-marketing`
i verificar que la pista apareix amb l'estètica esperada.

- [ ] **Step 3: Revertir la modificació temporal de l'MDX**

```bash
git checkout src/content/asignaturas/edmn-2bach/libro/06-funcion-comercial-marketing.mdx
```

- [ ] **Step 4: Commit del component**

```bash
git add src/components/PistaEbau.astro
git commit -m "feat(libro): component PistaEbau (sidebar de trucs d'EBAU)"
```

---

### Task 1.2: Component `VocesDesacuerdo`

**Files:**
- Create: `src/components/VocesDesacuerdo.astro`

- [ ] **Step 1: Crear el component**

```astro
---
type Postura = {
  /** Nom de la postura / escola / autor. */
  etiqueta: string;
  /** Postura en una frase curta. */
  tesis: string;
};
type Props = {
  /** Concepte sobre el qual hi ha desacord. */
  tema: string;
  postura_a: Postura;
  postura_b: Postura;
};
const { tema, postura_a, postura_b } = Astro.props;
---

<aside class="voces">
  <span class="voces__kicker">Voces en desacuerdo</span>
  <h4 class="voces__tema">{tema}</h4>
  <div class="voces__grid">
    <div class="voces__postura">
      <span class="voces__et">{postura_a.etiqueta}</span>
      <p>{postura_a.tesis}</p>
    </div>
    <div class="voces__vs">vs</div>
    <div class="voces__postura">
      <span class="voces__et">{postura_b.etiqueta}</span>
      <p>{postura_b.tesis}</p>
    </div>
  </div>
  <div class="voces__body"><slot /></div>
</aside>

<style>
  .voces {
    margin: 2.4rem 0;
    padding: 1.6rem 1.8rem;
    background: var(--color-bg-cream);
    border: 1px solid var(--color-line);
    border-radius: 6px;
  }
  .voces__kicker {
    font-family: var(--font-sans);
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--color-mustard-deep);
    font-weight: 700;
    display: block;
    margin-bottom: 0.4rem;
  }
  .voces__tema {
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 1.2rem;
    margin: 0 0 1.2rem;
    color: var(--color-ink);
    font-weight: 500;
    font-variation-settings: "SOFT" 100, "WONK" 1;
  }
  .voces__grid {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 1.2rem;
    align-items: center;
    margin-bottom: 1rem;
  }
  .voces__postura p {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.45;
    color: var(--color-ink-soft);
  }
  .voces__et {
    font-family: var(--font-sans);
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--color-terra-deep);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    display: block;
    margin-bottom: 0.3rem;
  }
  .voces__vs {
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 1.4rem;
    color: var(--color-mustard);
    font-variation-settings: "SOFT" 100, "WONK" 1;
  }
  .voces__body {
    font-size: 0.95rem;
    line-height: 1.55;
    color: var(--color-ink-soft);
    border-top: 1px dashed var(--color-line);
    padding-top: 0.9rem;
  }
  .voces__body :global(p) { margin: 0 0 0.7em; }
  .voces__body :global(p:last-child) { margin-bottom: 0; }
  .voces__body :global(p::first-letter) {
    font-family: inherit; font-weight: inherit; font-size: inherit;
    line-height: inherit; float: none; padding: 0; color: inherit;
  }
  @media print {
    .voces { break-inside: avoid; page-break-inside: avoid; }
  }
</style>
```

- [ ] **Step 2: Test al dev server**

Mateixa idea que Task 1.1: inserir temporalment a U6.mdx:

```mdx
import VocesDesacuerdo from '@components/VocesDesacuerdo.astro';

<VocesDesacuerdo
  tema="¿La publicidad crea necesidades o las descubre?"
  postura_a={{
    etiqueta: 'Galbraith (1958)',
    tesis: 'La publicidad fabrica deseos que no existían y atrapa al consumidor.',
  }}
  postura_b={{
    etiqueta: 'Kotler (escuela del marketing)',
    tesis: 'La publicidad revela necesidades latentes y conecta oferta con demanda.',
  }}
>
La verdad probablemente está en medio: hay productos donde la
publicidad sobre todo descubre (medicamentos, seguros) y otros donde
crea con fuerza (moda, gadgets de consumo).
</VocesDesacuerdo>
```

`npm run dev` i verificar visualment.

- [ ] **Step 3: Revertir l'MDX temporal**

- [ ] **Step 4: Commit**

```bash
git add src/components/VocesDesacuerdo.astro
git commit -m "feat(libro): component VocesDesacuerdo (sidebar de debats no resolts)"
```

---

### Task 1.3: Component `TldrUnidad`

**Files:**
- Create: `src/components/TldrUnidad.astro`

- [ ] **Step 1: Crear el component**

```astro
---
type Props = {
  /** Etiqueta opcional ("90 segundos" per defecte). */
  duracion?: string;
};
const { duracion = '90 segundos' } = Astro.props;
---

<aside class="tldr">
  <header class="tldr__head">
    <span class="tldr__kicker">TL;DR</span>
    <span class="tldr__dur">{duracion}</span>
  </header>
  <div class="tldr__body"><slot /></div>
</aside>

<style>
  .tldr {
    margin: 0 0 2.4rem;
    padding: 1.4rem 1.6rem;
    background: var(--color-bg-soft);
    border-left: 4px solid var(--color-mustard);
    border-radius: 0 4px 4px 0;
  }
  .tldr__head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 0.7rem;
  }
  .tldr__kicker {
    font-family: var(--font-sans);
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--color-mustard-deep);
    font-weight: 700;
  }
  .tldr__dur {
    font-family: var(--font-mono);
    font-size: 0.74rem;
    color: var(--color-ink-mute);
  }
  .tldr__body {
    font-family: var(--font-serif);
    font-size: 1.02rem;
    line-height: 1.55;
    color: var(--color-ink);
  }
  .tldr__body :global(p) { margin: 0 0 0.7em; }
  .tldr__body :global(p:last-child) { margin-bottom: 0; }
  .tldr__body :global(p::first-letter) {
    font-family: inherit; font-weight: inherit; font-size: inherit;
    line-height: inherit; float: none; padding: 0; color: inherit;
  }
  @media print {
    .tldr { break-inside: avoid; page-break-inside: avoid; }
  }
</style>
```

- [ ] **Step 2: Test al dev server**

Inserir temporalment al començament d'U6.mdx (just després del
frontmatter i imports):

```mdx
import TldrUnidad from '@components/TldrUnidad.astro';

<TldrUnidad>
La función comercial decide quién recibe el producto, a qué precio y
por qué canal. Aprenderás a segmentar un mercado, construir una
propuesta de valor coherente con el segmento, diseñar el marketing
mix (4P) y elegir las fuentes de ingresos.

Si una empresa hace todo lo demás bien pero falla aquí, no existe
económicamente.
</TldrUnidad>
```

- [ ] **Step 3: Revertir l'MDX temporal**

- [ ] **Step 4: Commit**

```bash
git add src/components/TldrUnidad.astro
git commit -m "feat(libro): component TldrUnidad (caixa de TL;DR al començament d'unitat)"
```

---

### Task 1.4: Component `CasoDilema`

**Files:**
- Create: `src/components/CasoDilema.astro`

- [ ] **Step 1: Crear el component**

```astro
---
type Props = {
  /** Titular del cas. */
  titular: string;
  /** Font del cas (mitjà + data). */
  fuente: string;
  /** Pregunta o dilema a la fi. */
  pregunta: string;
};
const { titular, fuente, pregunta } = Astro.props;
---

<aside class="caso">
  <span class="caso__kicker">Caso real · Dilema</span>
  <h3 class="caso__titular">{titular}</h3>
  <p class="caso__fuente">{fuente}</p>
  <div class="caso__body"><slot /></div>
  <p class="caso__pregunta">{pregunta}</p>
</aside>

<style>
  .caso {
    margin: 0 0 2.4rem;
    padding: 1.6rem 1.8rem;
    background: var(--color-paper);
    border: 1px solid var(--color-line);
    border-top: 4px solid var(--color-terra);
    border-radius: 4px;
  }
  .caso__kicker {
    font-family: var(--font-sans);
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--color-terra-deep);
    font-weight: 700;
    display: block;
    margin-bottom: 0.4rem;
  }
  .caso__titular {
    font-family: var(--font-serif);
    font-size: 1.45rem;
    line-height: 1.2;
    margin: 0 0 0.4rem;
    color: var(--color-ink);
    font-weight: 500;
    font-variation-settings: "SOFT" 80, "WONK" 0;
    letter-spacing: -0.005em;
  }
  .caso__fuente {
    font-family: var(--font-mono);
    font-size: 0.76rem;
    color: var(--color-ink-mute);
    margin: 0 0 1rem;
  }
  .caso__body {
    font-family: var(--font-serif);
    font-size: 1rem;
    line-height: 1.55;
    color: var(--color-ink-soft);
  }
  .caso__body :global(p) { margin: 0 0 0.8em; }
  .caso__body :global(p::first-letter) {
    font-family: inherit; font-weight: inherit; font-size: inherit;
    line-height: inherit; float: none; padding: 0; color: inherit;
  }
  .caso__pregunta {
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 1.05rem;
    line-height: 1.4;
    color: var(--color-terra-deep);
    margin: 1.2rem 0 0;
    padding-top: 1rem;
    border-top: 1px dashed var(--color-line);
    font-variation-settings: "SOFT" 100, "WONK" 1;
  }
  @media print {
    .caso { break-inside: avoid; page-break-inside: avoid; }
  }
</style>
```

- [ ] **Step 2: Test al dev server**

Inserir temporalment a U6.mdx:

```mdx
import CasoDilema from '@components/CasoDilema.astro';

<CasoDilema
  titular="Nespresso bajó el precio de sus cápsulas y la facturación cayó"
  fuente="El País · 14 octubre 2024"
  pregunta="¿Por qué un descenso de precio puede reducir los ingresos en vez de aumentarlos?"
>
En 2024, Nespresso experimentó con una rebaja del 15% en sus cápsulas
clásicas para frenar la competencia de marcas blancas. Esperaban
ampliar el segmento atrayendo nuevos consumidores. El resultado fue
el contrario: los ingresos cayeron un 8% el primer trimestre, y la
percepción de marca premium se deterioró en los estudios de mercado.
</CasoDilema>
```

- [ ] **Step 3: Revertir l'MDX temporal**

- [ ] **Step 4: Commit**

```bash
git add src/components/CasoDilema.astro
git commit -m "feat(libro): component CasoDilema (opener de unitat amb cas real + dilema)"
```

---

### Task 1.5: Component `VuelveAlCaso`

**Files:**
- Create: `src/components/VuelveAlCaso.astro`

- [ ] **Step 1: Crear el component**

```astro
---
type Props = {
  /** Referència curta al cas obert al començament. */
  referencia: string;
};
const { referencia } = Astro.props;
---

<aside class="vuelve">
  <span class="vuelve__kicker">Vuelve al caso</span>
  <p class="vuelve__ref">{referencia}</p>
  <div class="vuelve__body"><slot /></div>
</aside>

<style>
  .vuelve {
    margin: 2.4rem 0;
    padding: 1.4rem 1.6rem;
    background: var(--color-terra-soft);
    border-radius: 4px;
    position: relative;
  }
  .vuelve::before {
    content: "↶";
    position: absolute;
    top: 1rem;
    right: 1.2rem;
    color: var(--color-terra);
    font-size: 1.6rem;
    line-height: 1;
  }
  .vuelve__kicker {
    font-family: var(--font-sans);
    font-size: 0.74rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--color-terra-deep);
    font-weight: 700;
    display: block;
    margin-bottom: 0.3rem;
  }
  .vuelve__ref {
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 0.95rem;
    color: var(--color-ink-mute);
    margin: 0 0 0.9rem;
  }
  .vuelve__body {
    font-family: var(--font-serif);
    font-size: 1rem;
    line-height: 1.55;
    color: var(--color-ink);
  }
  .vuelve__body :global(p) { margin: 0 0 0.7em; }
  .vuelve__body :global(p:last-child) { margin-bottom: 0; }
  .vuelve__body :global(p::first-letter) {
    font-family: inherit; font-weight: inherit; font-size: inherit;
    line-height: inherit; float: none; padding: 0; color: inherit;
  }
  @media print {
    .vuelve { break-inside: avoid; page-break-inside: avoid; }
  }
</style>
```

- [ ] **Step 2: Test al dev server**

Inserir temporalment a U6.mdx (al final, abans dels takeaways):

```mdx
import VuelveAlCaso from '@components/VuelveAlCaso.astro';

<VuelveAlCaso referencia="Nespresso y la rebaja del 15%">
La rebaja desestabilizó el **posicionamiento premium** que justificaba
el sobrecoste sobre las marcas blancas. El precio no era solo un coste
para el consumidor: era una **señal** de calidad y exclusividad. Al
romper esa señal, Nespresso perdió clientes premium sin atraer
suficientes clientes nuevos del segmento sensible al precio (que en
realidad ya compraban marca blanca y no iban a pagar 4× por el envase
aunque fuera más barato que antes).
</VuelveAlCaso>
```

- [ ] **Step 3: Revertir l'MDX temporal**

- [ ] **Step 4: Commit**

```bash
git add src/components/VuelveAlCaso.astro
git commit -m "feat(libro): component VuelveAlCaso (tancament del dilema al final d'unitat)"
```

---

### Task 1.6: Component `RetoEtapa`

**Files:**
- Create: `src/components/RetoEtapa.astro`

- [ ] **Step 1: Crear el component**

```astro
---
type Props = {
  /** Número de l'etapa (1-12). */
  etapa: number;
  /** Títol de l'etapa ("Idea + per qué tu", "DAFO+PESTEL", …). */
  titulo: string;
  /** Entregable concret en una frase. */
  entregable: string;
};
const { etapa, titulo, entregable } = Astro.props;
---

<aside class="reto">
  <header class="reto__head">
    <span class="reto__kicker">Reto del curso</span>
    <span class="reto__etapa">Etapa {etapa} / 12</span>
  </header>
  <h4 class="reto__titulo">{titulo}</h4>
  <p class="reto__entregable"><strong>Entregable:</strong> {entregable}</p>
  <div class="reto__body"><slot /></div>
</aside>

<style>
  .reto {
    margin: 2.4rem 0;
    padding: 1.4rem 1.6rem;
    background: var(--color-paper);
    border: 1px solid var(--color-terra);
    border-radius: 6px;
    position: relative;
  }
  .reto__head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 0.7rem;
  }
  .reto__kicker {
    font-family: var(--font-sans);
    font-size: 0.74rem;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--color-terra-deep);
    font-weight: 700;
  }
  .reto__etapa {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    color: var(--color-terra-deep);
  }
  .reto__titulo {
    font-family: var(--font-serif);
    font-size: 1.2rem;
    margin: 0 0 0.4rem;
    color: var(--color-ink);
    font-weight: 500;
    font-variation-settings: "SOFT" 80, "WONK" 0;
  }
  .reto__entregable {
    font-size: 0.95rem;
    color: var(--color-ink-soft);
    margin: 0 0 1rem;
    padding-bottom: 0.9rem;
    border-bottom: 1px dashed var(--color-line);
  }
  .reto__body {
    font-size: 0.96rem;
    line-height: 1.55;
    color: var(--color-ink-soft);
  }
  .reto__body :global(p) { margin: 0 0 0.7em; }
  .reto__body :global(p:last-child) { margin-bottom: 0; }
  .reto__body :global(p::first-letter) {
    font-family: inherit; font-weight: inherit; font-size: inherit;
    line-height: inherit; float: none; padding: 0; color: inherit;
  }
  @media print {
    .reto { break-inside: avoid; page-break-inside: avoid; }
  }
</style>
```

- [ ] **Step 2: Test al dev server**

```mdx
import RetoEtapa from '@components/RetoEtapa.astro';

<RetoEtapa
  etapa={6}
  titulo="Estrategia comercial del proyecto"
  entregable="Un documento con segmentos elegidos, propuesta de valor, marketing mix (4P) y un briefing de campaña."
>
Toma tu proyecto de la etapa 5 (Value Proposition Canvas + prototipo).
Define ahora **a quién** se lo vendes, **a qué precio**, **por qué
canal** y **cómo lo comunicas**. Cierra con un briefing de campaña
de una página: público, mensaje principal, soporte (vídeo / imagen /
texto) y métrica con la que medirás si funciona.
</RetoEtapa>
```

- [ ] **Step 3: Revertir l'MDX temporal**

- [ ] **Step 4: Commit**

```bash
git add src/components/RetoEtapa.astro
git commit -m "feat(libro): component RetoEtapa (fitxa del projecte continu per unitat)"
```

---

### Task 1.7: Component `MirarFora`

**Files:**
- Create: `src/components/MirarFora.astro`

- [ ] **Step 1: Crear el component**

```astro
---
type Recurso = {
  /** Títol del recurs (llibre, vídeo, compte…). */
  titulo: string;
  /** Subtítol: autor / canal / @handle. */
  meta: string;
  /** Justificació de la connexió (2-3 frases per llibre, 1 per altres). */
  porque: string;
  /** URL on l'estudiant pot accedir-hi. */
  url?: string;
  /** Pàgines o capítols suggerits (només per a llibres). */
  paginas?: string;
  /** Duració (només per a vídeos). */
  duracion?: string;
};
type Props = {
  /** Número de la unitat (per al kicker). */
  unidad: number;
  libro: Recurso;
  video: Recurso;
  cuenta: Recurso;
  /** Títol curt de l'activitat. */
  actividad_titulo: string;
  /** Durada self-study ("20-30 min"). */
  actividad_duracion: string;
};
const { unidad, libro, video, cuenta, actividad_titulo, actividad_duracion } = Astro.props;
---

<section class="mirar-fora">
  <header class="mirar-fora__head">
    <span class="mirar-fora__kicker">Mirar fora · U{unidad}</span>
  </header>

  <div class="mirar-fora__recursos">
    <article class="mirar-fora__recurso">
      <span class="mirar-fora__et">Libro</span>
      <h4>{libro.titulo}</h4>
      <p class="mirar-fora__meta">{libro.meta}</p>
      <p class="mirar-fora__porque">{libro.porque}</p>
      {libro.paginas && <p class="mirar-fora__detalle">{libro.paginas}</p>}
    </article>

    <article class="mirar-fora__recurso">
      <span class="mirar-fora__et">Vídeo {video.duracion && `· ${video.duracion}`}</span>
      <h4>{video.titulo}</h4>
      <p class="mirar-fora__meta">{video.meta}</p>
      <p class="mirar-fora__porque">{video.porque}</p>
      {video.url && <p class="mirar-fora__detalle"><a href={video.url}>{video.url}</a></p>}
    </article>

    <article class="mirar-fora__recurso">
      <span class="mirar-fora__et">Cuenta · Podcast · Web</span>
      <h4>{cuenta.titulo}</h4>
      <p class="mirar-fora__meta">{cuenta.meta}</p>
      <p class="mirar-fora__porque">{cuenta.porque}</p>
    </article>
  </div>

  <div class="mirar-fora__actividad">
    <header class="mirar-fora__act-head">
      <span class="mirar-fora__et">Actividad · {actividad_duracion}</span>
      <h4>{actividad_titulo}</h4>
    </header>
    <div class="mirar-fora__act-body"><slot name="actividad" /></div>
    <aside class="mirar-fora__para-clase">
      <span class="mirar-fora__et">Para clase</span>
      <slot name="para-clase" />
    </aside>
  </div>
</section>

<style>
  .mirar-fora {
    margin: 3rem 0 0;
    padding: 2rem 0 0;
    border-top: 4px solid var(--color-mustard);
  }
  .mirar-fora__kicker {
    font-family: var(--font-sans);
    font-size: 0.84rem;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--color-mustard-deep);
    font-weight: 700;
    display: block;
    margin-bottom: 2rem;
  }
  .mirar-fora__recursos {
    display: grid;
    gap: 1.6rem;
    margin-bottom: 2rem;
  }
  .mirar-fora__recurso {
    padding-left: 1.2rem;
    border-left: 2px solid var(--color-line);
  }
  .mirar-fora__et {
    font-family: var(--font-sans);
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--color-ink-mute);
    font-weight: 700;
    display: block;
    margin-bottom: 0.4rem;
  }
  .mirar-fora__recurso h4 {
    font-family: var(--font-serif);
    font-size: 1.15rem;
    margin: 0 0 0.2rem;
    color: var(--color-ink);
    font-weight: 500;
    font-variation-settings: "SOFT" 80, "WONK" 0;
  }
  .mirar-fora__meta {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    color: var(--color-ink-mute);
    margin: 0 0 0.6rem;
  }
  .mirar-fora__porque {
    font-family: var(--font-serif);
    font-size: 0.96rem;
    line-height: 1.5;
    color: var(--color-ink-soft);
    margin: 0;
  }
  .mirar-fora__detalle {
    font-family: var(--font-mono);
    font-size: 0.76rem;
    color: var(--color-terra-deep);
    margin: 0.5rem 0 0;
  }
  .mirar-fora__actividad {
    border-top: 1px solid var(--color-line);
    padding-top: 1.8rem;
  }
  .mirar-fora__actividad h4 {
    font-family: var(--font-serif);
    font-size: 1.2rem;
    margin: 0 0 0.9rem;
    color: var(--color-ink);
    font-weight: 500;
  }
  .mirar-fora__act-body {
    font-size: 1rem;
    line-height: 1.6;
    color: var(--color-ink);
    margin-bottom: 1.5rem;
  }
  .mirar-fora__act-body :global(p) { margin: 0 0 0.8em; }
  .mirar-fora__act-body :global(p::first-letter) {
    font-family: inherit; font-weight: inherit; font-size: inherit;
    line-height: inherit; float: none; padding: 0; color: inherit;
  }
  .mirar-fora__para-clase {
    background: var(--color-bg-cream);
    padding: 1rem 1.2rem;
    border-radius: 4px;
    font-size: 0.92rem;
    line-height: 1.5;
    color: var(--color-ink-soft);
  }
  .mirar-fora__para-clase :global(p) { margin: 0 0 0.5em; }
  .mirar-fora__para-clase :global(p:last-child) { margin-bottom: 0; }
  @media print {
    .mirar-fora { break-before: page; padding-top: 0; margin-top: 0; }
    .mirar-fora__recurso { break-inside: avoid; }
    .mirar-fora__actividad { break-inside: avoid; }
  }
</style>
```

- [ ] **Step 2: Test al dev server**

Inserir temporalment a U6.mdx (al final del fitxer, després de tot):

```mdx
import MirarFora from '@components/MirarFora.astro';

<MirarFora
  unidad={6}
  libro={{
    titulo: 'Las trampas del deseo',
    meta: 'Dan Ariely · Ariel, 2008',
    porque: 'Los sesgos cognitivos que explican por qué cobramos por gratis, por qué un descuento nos atrapa, por qué decidimos lo que decidimos.',
    paginas: 'Capítulos 1, 3 y 9',
  }}
  video={{
    titulo: 'los precios no existen ¿cómo funciona la economía?',
    meta: 'econoTube · YouTube',
    duracion: '12 min',
    porque: 'El punto donde el precio deja de ser un número y empieza a ser una señal.',
    url: 'https://youtube.com/...',
  }}
  cuenta={{
    titulo: '@The_AdProfessor',
    meta: 'X / Twitter',
    porque: 'Casos reales de marketing diseccionados en hilos cortos cada semana.',
  }}
  actividad_titulo="Tres productos, tres señales"
  actividad_duracion="20-30 min"
>
  <Fragment slot="actividad">
    Mira el vídeo y elige tres productos de tu vida diaria. Para cada
    uno, identifica el sesgo o señal de precio que te ha hecho comprarlo
    (no el ingrediente, no la marca: la señal). Comparte un ejemplo en
    clase la próxima sesión.
  </Fragment>
  <Fragment slot="para-clase">
    Variante en grupos de 4: cada grupo analiza una campaña real
    reciente (búsqueda en X) y presenta en 90 segundos qué señal usa y
    a qué segmento la dirige. Duración: 45 min. Materiales: móvil,
    proyector.
  </Fragment>
</MirarFora>
```

- [ ] **Step 3: Revertir l'MDX temporal**

- [ ] **Step 4: Commit**

```bash
git add src/components/MirarFora.astro
git commit -m "feat(libro): component MirarFora (pàgina final amb llibre + vídeo + compte + activitat)"
```

---

## Fase 2 · Print CSS integrat a `imprimir.astro`

### Task 2.1: Afegir overrides globals per als 7 components nous

**Files:**
- Modify: `src/pages/[asignatura]/libro/imprimir.astro:600-625`

- [ ] **Step 1: Identificar el bloc actual d'overrides**

Localitzar (línia ~600) el bloc que comença amb el comentari:

```css
/* Callout, solved-exercise, curiosity, real-example, takeaways, steps:
   in print, compact padding/margins (the web versions are airy) so the
   many pedagogical boxes don't inflate the page count. */
.chapter__content .callout,
.chapter__content .solved-exercise,
.chapter__content .curiosity,
.chapter__content .real-example,
.chapter__content .takeaways,
.chapter__content .steps {
  margin: 0.8em 0 !important;
  padding: 0.7rem 0.95rem !important;
  page-break-inside: avoid;
  break-inside: avoid;
}
```

- [ ] **Step 2: Estendre el selector amb els components nous**

Reemplaçar el bloc anterior per:

```css
/* Callout-like blocks: pedagogical boxes that should not be inflated
   by their airy web margins when paginated, and must not fragment
   across pages. Adds the 7 new pilot components to the existing set. */
.chapter__content .callout,
.chapter__content .solved-exercise,
.chapter__content .curiosity,
.chapter__content .real-example,
.chapter__content .takeaways,
.chapter__content .steps,
.chapter__content .tldr,
.chapter__content .caso,
.chapter__content .vuelve,
.chapter__content .pista-ebau,
.chapter__content .voces,
.chapter__content .reto {
  margin: 0.8em 0 !important;
  padding: 0.7rem 0.95rem !important;
  page-break-inside: avoid;
  break-inside: avoid;
}
.chapter__content .takeaways { padding-left: 1.8rem !important; }
.chapter__content .callout > :first-child,
.chapter__content .curiosity > :first-child,
.chapter__content .real-example > :first-child,
.chapter__content .solved-exercise > :first-child,
.chapter__content .takeaways > :first-child,
.chapter__content .steps > :first-child,
.chapter__content .tldr > :first-child,
.chapter__content .caso > :first-child,
.chapter__content .vuelve > :first-child,
.chapter__content .pista-ebau > :first-child,
.chapter__content .voces > :first-child,
.chapter__content .reto > :first-child { margin-top: 0 !important; }
.chapter__content .callout > :last-child,
.chapter__content .curiosity > :last-child,
.chapter__content .real-example > :last-child,
.chapter__content .solved-exercise > :last-child,
.chapter__content .takeaways > :last-child,
.chapter__content .steps > :last-child,
.chapter__content .tldr > :last-child,
.chapter__content .caso > :last-child,
.chapter__content .vuelve > :last-child,
.chapter__content .pista-ebau > :last-child,
.chapter__content .voces > :last-child,
.chapter__content .reto > :last-child { margin-bottom: 0 !important; }

/* MirarFora: a full final page per unit. */
.chapter__content .mirar-fora {
  break-before: page;
  margin-top: 0 !important;
  padding-top: 0 !important;
  border-top: none !important;
}
.chapter__content .mirar-fora__recurso,
.chapter__content .mirar-fora__actividad {
  break-inside: avoid;
  page-break-inside: avoid;
}
```

- [ ] **Step 3: Suprimir el drop cap després dels components nous**

Localitzar (línia ~628) el bloc:

```css
/* Suppress drop cap on the first paragraph that follows a heading */
.chapter__content h2 + p::first-letter,
.chapter__content h3 + p::first-letter {
```

Estendre per a també suprimir el drop cap quan ve després d'un TL;DR
o d'un CasoDilema (que estan al començament del capítol i no han de
generar drop cap al text que segueix):

```css
/* Suppress drop cap on the first paragraph that follows any of the
   pedagogical blocks or headings. */
.chapter__content h2 + p::first-letter,
.chapter__content h3 + p::first-letter,
.chapter__content .tldr + p::first-letter,
.chapter__content .caso + p::first-letter {
  font-family: inherit;
  font-weight: inherit;
  font-size: inherit;
  line-height: inherit;
  float: none;
  padding: 0;
  color: inherit;
}
```

- [ ] **Step 4: Regenerar PDF i validar**

```bash
npm run build:pdf
```

Obrir el PDF. Si U6 ja té algun dels components nous afegit (després
de Fase 6), comprovar que paginen bé. Si encara no n'hi ha cap, deixar
la verificació visual per a Task 6.4.

- [ ] **Step 5: Commit**

```bash
git add src/pages/[asignatura]/libro/imprimir.astro
git commit -m "feat(print): overrides paged.js per als 7 components nous del pilot"
```

---

## Fase 3 · Estructura del llibre (Reto intro + EBAU appendix)

### Task 3.1: Afegir col·lecció `retoCurso` al schema

**Files:**
- Modify: `src/content.config.ts:241` (end of file, before `collections` export)

- [ ] **Step 1: Afegir la definició**

Just abans de `export const collections = {…}` afegir:

```ts
/* =========================================================
   reto — pàgines d'obertura i rúbrica del Reto del curso.
   Mateix patró que `ebau` i `proyecto`.
   ========================================================= */
const retoCurso = defineCollection({
  loader: glob({
    pattern: 'asignaturas/*/reto/**/*.{md,mdx}',
    base: './src/content',
  }),
  schema: z.object({
    asignatura: z.enum(ASIGNATURA_SLUGS),
    orden: z.number().int().min(0),
    title: z.string(),
    lang: z.enum(LANGS).default('es'),
    estado: z.enum(ESTADOS).default('borrador'),
  }),
});
```

I afegir-la a l'export:

```ts
export const collections = {
  libro,
  actividades,
  tests,
  recursos,
  programacion,
  ebau,
  proyecto,
  juegos,
  jocsEconomicsPreguntas,
  retoCurso,
};
```

- [ ] **Step 2: Verificar amb `astro check`**

```bash
npm run check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/content.config.ts
git commit -m "feat(content): col·lecció retoCurso per al projecte continu del llibre"
```

---

### Task 3.2: Renderitzar pàgines del Reto + apèndix EBAU al PDF

**Files:**
- Modify: `src/pages/[asignatura]/libro/imprimir.astro`

- [ ] **Step 1: Carregar col·leccions `retoCurso` i `ebau` al `getStaticPaths`**

Reemplaçar el bloc actual (línies 15-31) per:

```ts
export const getStaticPaths = (async () => {
  const all = await getCollection('libro');
  const allReto = await getCollection('retoCurso');
  const allEbau = await getCollection('ebau');

  const bySlug = new Map<string, typeof all>();
  for (const u of all) {
    if (u.data.estado !== 'publicado') continue;
    const arr = bySlug.get(u.data.asignatura) ?? [];
    arr.push(u);
    bySlug.set(u.data.asignatura, arr);
  }

  const retoBySlug = new Map<string, typeof allReto>();
  for (const r of allReto) {
    if (r.data.estado !== 'publicado') continue;
    const arr = retoBySlug.get(r.data.asignatura) ?? [];
    arr.push(r);
    retoBySlug.set(r.data.asignatura, arr);
  }

  const ebauBySlug = new Map<string, typeof allEbau>();
  for (const e of allEbau) {
    if (e.data.estado !== 'publicado') continue;
    const arr = ebauBySlug.get(e.data.asignatura) ?? [];
    arr.push(e);
    ebauBySlug.set(e.data.asignatura, arr);
  }

  return ASIGNATURA_SLUGS.flatMap((slug) => {
    const units = bySlug.get(slug);
    if (!units || units.length === 0) return [];
    units.sort((a, b) => a.data.unidad - b.data.unidad);
    const reto = (retoBySlug.get(slug) ?? []).slice().sort((a, b) => a.data.orden - b.data.orden);
    const ebau = (ebauBySlug.get(slug) ?? []).slice().sort((a, b) => a.data.orden - b.data.orden);
    return [{ params: { asignatura: slug }, props: { units, reto, ebau, asignatura: ASIGNATURAS[slug] } }];
  });
}) satisfies GetStaticPaths;
```

I el `Astro.props` (línia 33):

```ts
const { units, reto, ebau, asignatura: a } = Astro.props;
```

I el pre-render (línies 36-41):

```ts
const rendered = await Promise.all(
  units.map(async (u) => {
    const { Content } = await render(u);
    return { unit: u, Content };
  })
);
const renderedReto = await Promise.all(
  reto.map(async (r) => {
    const { Content } = await render(r);
    return { entry: r, Content };
  })
);
const renderedEbau = await Promise.all(
  ebau.map(async (e) => {
    const { Content } = await render(e);
    return { entry: e, Content };
  })
);
```

- [ ] **Step 2: Inserir el bloc del Reto del curso després dels crèdits i abans del TOC**

Localitzar el bloc `{/* ---- TOC */}` (línia ~756). Just abans, inserir:

```astro
{/* --------------------------------------------------- RETO DEL CURSO INTRO */}
{renderedReto.length > 0 && (
  <section class="reto-intro">
    {renderedReto.map(({ entry, Content }) => (
      <div class="reto-intro__page" data-orden={entry.data.orden}>
        <Content />
      </div>
    ))}
  </section>
)}
```

I afegir estils al bloc `<style is:global>` (al final de l'altre CSS,
abans del tancament `</style>`):

```css
/* =========================================================
   Reto del curso — pàgines d'introducció abans del TOC
   ========================================================= */
.reto-intro { break-before: page; }
.reto-intro__page {
  break-after: page;
  padding-top: 8mm;
}
.reto-intro__page :global(h1) {
  font-family: var(--font-serif);
  font-size: 30pt;
  margin: 0 0 6mm;
  color: var(--color-ink);
  font-weight: 400;
  font-variation-settings: "SOFT" 80;
}
.reto-intro__page :global(h2) {
  font-family: var(--font-sans);
  font-size: 10pt;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--book-accent);
  margin: 4mm 0 2mm;
}
```

- [ ] **Step 3: Inserir l'apèndix EBAU després del darrer capítol**

Localitzar el bloc final de mapeo de capítols (línies ~775-818). Just
després del `</section>` tancador del map, afegir:

```astro
{/* --------------------------------------------------- APÈNDIX EBAU */}
{renderedEbau.length > 0 && (
  <section class="ebau-apendix">
    <div class="ebau-apendix__cover">
      <span class="ebau-apendix__kicker">Apéndice</span>
      <h2 class="ebau-apendix__title">Guía EBAU</h2>
      <p class="ebau-apendix__lede">Para llegar al examen con la cabeza en su sitio.</p>
    </div>
    {renderedEbau.map(({ entry, Content }) => (
      <article class="ebau-apendix__section" data-orden={entry.data.orden}>
        <h2 class="ebau-apendix__section-title">{entry.data.title}</h2>
        <Content />
      </article>
    ))}
  </section>
)}
```

I els estils corresponents (al mateix bloc `<style is:global>`):

```css
/* =========================================================
   Apèndix EBAU — secció final del PDF
   ========================================================= */
.ebau-apendix { break-before: page; }
.ebau-apendix__cover {
  page: no-header;
  break-after: page;
  height: 191mm;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.ebau-apendix__kicker {
  font-family: var(--font-sans);
  font-size: 10pt;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--book-accent);
  font-weight: 700;
  margin-bottom: 4mm;
}
.ebau-apendix__title {
  font-family: var(--font-serif);
  font-size: 48pt;
  line-height: 1;
  margin: 0 0 6mm;
  color: var(--color-ink);
  font-weight: 400;
  font-variation-settings: "SOFT" 80;
}
.ebau-apendix__lede {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 14pt;
  color: var(--color-ink-soft);
  margin: 0;
}
.ebau-apendix__section {
  break-before: page;
  padding-top: 8mm;
}
.ebau-apendix__section-title {
  font-family: var(--font-serif);
  font-size: 24pt;
  line-height: 1.1;
  margin: 0 0 6mm;
  color: var(--color-ink);
  font-weight: 400;
  font-variation-settings: "SOFT" 80;
  position: relative;
  padding-top: 4mm;
}
.ebau-apendix__section-title::before {
  content: "";
  position: absolute;
  top: 0; left: 0;
  width: 26mm; height: 3pt;
  background: var(--book-accent);
  border-radius: 999px;
}
```

- [ ] **Step 4: Verificar amb `astro check`**

```bash
npm run check
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/pages/[asignatura]/libro/imprimir.astro
git commit -m "feat(print): render Reto del curso (intro) + apèndix EBAU al PDF del llibre"
```

---

## Fase 4 · Contingut de l'apèndix EBAU

> Aquesta fase adapta el contingut del PDF `EBAU_Empresa_Consejos.pdf`
> al format MDX integrat al llibre. Cada secció és un fitxer.

### Task 4.1: Crear `01-teoria-como-responder.mdx`

**Files:**
- Create: `src/content/asignaturas/edmn-2bach/ebau/01-teoria-como-responder.mdx`

- [ ] **Step 1: Crear el fitxer amb el contingut adaptat**

```mdx
---
asignatura: edmn-2bach
orden: 1
title: Teoría — cómo responder
comunidad: Comunitat Valenciana
lang: es
estado: publicado
---

Las preguntas de teoría no se valoran por longitud, sino por
precisión. El corrector quiere ver que entiendes el concepto, no que
has memorizado el manual.

## Antes de escribir

- **Subraya lo que se pregunta exactamente**: ¿definir, comparar,
  clasificar, enumerar, justificar?
- Si el concepto tiene **fórmula asociada** (beneficio, umbral,
  productividad, eficiencia, rentabilidad…), escríbela. Es la mejor
  prueba de que lo has entendido.
- Si admite **gráfico** (umbral, ciclo de vida del producto,
  oferta–demanda, organigrama, DAFO), inclúyelo. Ahorra palabras y
  suma puntos.

## Estructura recomendada de cada respuesta

1. **Definición** o idea principal en una frase clara.
2. **Desarrollo**: tipos, causas, características, ventajas /
   inconvenientes — lo que pida el enunciado.
3. **Ejemplo** o aplicación concreta cuando aporte valor (no rellenar
   por rellenar).

## Vocabulario que suma

Sustituye expresiones coloquiales por términos económicos:

- «ganar dinero» → **obtener un beneficio neto**
- «deber dinero» → **asumir un pasivo**
- «aprovechar mejor» → **incrementar la eficiencia / productividad**

El corrector identifica al instante quién domina la materia.

## Errores frecuentes

- Definir con rodeos sin mencionar el término técnico clave.
- Confundir **productividad** (técnica) con **rentabilidad**
  (financiera).
- Mezclar **autofinanciación** con **financiación propia**: la primera
  es un subconjunto de la segunda.
- Rellenar con repeticiones: cuanto más rodeo, más dudas das al
  corrector.
```

- [ ] **Step 2: Verificar amb `astro check`**

```bash
npm run check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/content/asignaturas/edmn-2bach/ebau/01-teoria-como-responder.mdx
git commit -m "feat(ebau): apèndix D.1 — teoría, cómo responder"
```

---

### Task 4.2: Crear `02-umbral-rentabilidad.mdx`

**Files:**
- Create: `src/content/asignaturas/edmn-2bach/ebau/02-umbral-rentabilidad.mdx`

- [ ] **Step 1: Crear el fitxer**

```mdx
---
asignatura: edmn-2bach
orden: 2
title: Umbral de rentabilidad
comunidad: Comunitat Valenciana
lang: es
estado: publicado
---

También llamado **punto muerto**. Marca la cantidad mínima a vender
para que la empresa cubra todos sus costes.

> **Q\* = CF / (P − Cv_u)**

## Pasos clave

1. Identifica **CF** (costes fijos), **Cv_u** (coste variable
   unitario) y **P** (precio).
2. Aplica la fórmula y obtén Q*.
3. **Redondea siempre hacia arriba** a la unidad inmediatamente
   superior.
4. **Dibuja el gráfico**: ejes Q y €, rectas IT y CT, marca Q* en el
   cruce.
5. **Interpreta con una frase**: «se necesita vender 1.235 uds. para
   no tener pérdidas; a partir de ahí, beneficio».

## Producir o subcontratar (comprar)

- Plantea las dos funciones de coste: CT_producir y CT_comprar.
- **Iguálalas** para hallar el punto de indiferencia.
- Decide según el intervalo: por debajo del punto conviene la opción
  con menor coste fijo; por encima, la de menor coste variable.

## Redondeo y unidades

Si Q* = 1.234,34 unidades, no puedes vender 0,34 unidades. La
respuesta correcta es **1.235**. Y siempre con la frase explicativa:
nunca dejes solo el número.

## Errores frecuentes

- No redondear hacia arriba.
- Olvidar marcar **Q*** en el gráfico.
- Saltarse la interpretación final.
- Confundir **CF** (costes fijos) con **CT** (costes totales).
```

- [ ] **Step 2: Verificar amb `astro check`**

```bash
npm run check
```

- [ ] **Step 3: Commit**

```bash
git add src/content/asignaturas/edmn-2bach/ebau/02-umbral-rentabilidad.mdx
git commit -m "feat(ebau): apèndix D.2 — umbral de rentabilidad"
```

---

### Task 4.3: Crear `03-balance-pyg.mdx`

**Files:**
- Create: `src/content/asignaturas/edmn-2bach/ebau/03-balance-pyg.mdx`

- [ ] **Step 1: Crear el fitxer**

```mdx
---
asignatura: edmn-2bach
orden: 3
title: Balance y Cuenta de PyG
comunidad: Comunitat Valenciana
lang: es
estado: publicado
---

Dos documentos que se calculan juntos. El resultado del PyG entra en
el Patrimonio Neto del Balance — si no cuadran, el fallo casi siempre
está ahí.

## Cuenta de Pérdidas y Ganancias

- **Compras e ingresos van completos al PyG**, sin importar cuánto se
  haya pagado o cobrado.
- El % no pagado de compras → se traslada a **Pasivo Corriente**
  (proveedores).
- El % no cobrado de ventas → se traslada a **Realizable** (clientes).
- Si te piden el **cálculo de amortizaciones** en un apartado aparte,
  hazlo separado y con explicación breve.

## Balance — Convenciones formales

- **Números negativos entre paréntesis**: (12.500), no −12.500. Esto
  incluye amortización acumulada y pérdidas.
- Suma siempre los **totales por masa patrimonial** (AnC, AC, PN, PnC,
  PC). Te ayuda a detectar errores y mejora la presentación.
- Comprueba la igualdad final: **AnC + AC = PN + PnC + PC**.

## Si no cuadra — que no cunda el pánico

El 90 % de los descuadres están en dos sitios. Revísalos en este
orden:

1. **Resultado del ejercicio** mal calculado en el PyG (afecta al PN).
2. **Amortización acumulada** mal restada del Activo No Corriente.

Repasa con calma. Cuidado con la calculadora al sumar y restar — la
mayoría de errores son de pulsación, no de concepto.

## Errores frecuentes

- Contabilizar solo lo cobrado / pagado en lugar del total facturado.
- Olvidar el IVA cuando el enunciado lo separa.
- Restar mal la amortización acumulada del valor del inmovilizado.
- Usar el signo «−» en vez de paréntesis para los negativos.
```

- [ ] **Step 2: Verificar i commit**

```bash
npm run check
git add src/content/asignaturas/edmn-2bach/ebau/03-balance-pyg.mdx
git commit -m "feat(ebau): apèndix D.3 — balance y cuenta de PyG"
```

---

### Task 4.4: Crear `04-ratios.mdx`

**Files:**
- Create: `src/content/asignaturas/edmn-2bach/ebau/04-ratios.mdx`

- [ ] **Step 1: Crear el fitxer**

```mdx
---
asignatura: edmn-2bach
orden: 4
title: Ratios — calcular e interpretar
comunidad: Comunitat Valenciana
lang: es
estado: publicado
---

Calcular el ratio es solo la mitad del trabajo. Lo que sube nota es
**interpretar el resultado y proponer mejoras**.

## Recomendaciones según el ratio

### Liquidez = AC / PC (óptimo ≈ 1,5–2)

- Por **encima** del óptimo → AC ocioso. Para reducir el ratio:
  aumentar PC endeudándose un poco más a corto.
- Por **debajo** del óptimo → riesgo de impago. Aumentar AC vendiendo
  AnC ocioso (mobiliario, etc.) o renegociar deuda PC → PnC.

### Solvencia (garantía) = AT / PT (óptimo ≈ 1,5–2)

- Por **debajo** de 1,5 → riesgo de quiebra técnica. Ampliar capital,
  vender activos no estratégicos, no asumir más deuda.

### Endeudamiento = PT / (PN + PT) (óptimo ≈ 0,4–0,6)

- Por **encima** → demasiada deuda. Ampliar capital o reinvertir
  beneficios para reforzar el PN.
- Por **debajo** → infrautiliza el apalancamiento; podría endeudarse
  para crecer más rápido.

## Interpretación de las rentabilidades

- **Rentabilidad económica (RE)** = BAII / Activo Total → «por cada
  100 € invertidos en activo, la empresa genera X € de beneficio
  bruto (resultado de explotación, BAII)».
- **Rentabilidad financiera (RF)** = BN / Patrimonio Neto → «por
  cada 100 € aportados por los socios, la empresa genera X € de
  beneficio neto».

## Apalancamiento financiero

Si **RF > RE**, la deuda está aumentando la rentabilidad de los
socios — apalancamiento **positivo**.

Si **RF < RE**, la deuda les está costando más de lo que aporta —
apalancamiento **negativo**.

Mencionarlo en la interpretación da puntos extra.

## Errores frecuentes

- Calcular el ratio y no interpretar ni recomendar nada.
- Invertir numerador y denominador (clásico en endeudamiento).
- Comparar con el «óptimo» sin justificar la recomendación con la
  fórmula.
- Confundir **RE** (BAII / AT) con **RF** (BN / PN).
```

- [ ] **Step 2: Verificar i commit**

```bash
npm run check
git add src/content/asignaturas/edmn-2bach/ebau/04-ratios.mdx
git commit -m "feat(ebau): apèndix D.4 — ratios"
```

---

### Task 4.5: Crear `05-van-tir-payback.mdx`

**Files:**
- Create: `src/content/asignaturas/edmn-2bach/ebau/05-van-tir-payback.mdx`

- [ ] **Step 1: Crear el fitxer**

```mdx
---
asignatura: edmn-2bach
orden: 5
title: Inversiones — VAN, TIR y Payback
comunidad: Comunitat Valenciana
lang: es
estado: publicado
---

Tres criterios complementarios para decidir si un proyecto es
rentable y compararlo con alternativas.

## VAN — Valor Actual Neto

> **VAN = −D₀ + Σ FNC_t / (1 + k)ᵗ**

- Suma los flujos de caja **actualizados** a hoy y resta el desembolso
  inicial.
- **Rentable si VAN > 0**: los ingresos futuros descontados superan el
  desembolso.
- Entre dos proyectos rentables, elige el de **mayor VAN**.

## TIR — Tasa Interna de Rendimiento

- Es la tasa de descuento que iguala el VAN a cero: indica la
  rentabilidad real del proyecto.
- **Rentable si TIR > k** (la inversión rinde más de lo que cuesta
  financiarla).
- No tiene un óptimo absoluto: siempre se compara con la **k** del
  enunciado.

## Payback — Plazo de recuperación

- Tiempo que tarda el proyecto en recuperar el desembolso inicial
  sumando los flujos (sin descontar).
- Cuanto **menor**, mejor.
- **No dejes el resultado en decimal.** Tradúcelo a tiempo real: 9,14
  meses → entre 9 y 10 meses, o 9 meses y 4 días.

## Convertir decimal a tiempo

Multiplica la parte decimal por la unidad inferior:

- **2,75 años** = 2 años + (0,75 × 12) = **2 años y 9 meses**.
- **9,14 meses** = 9 meses + (0,14 × 30) ≈ **9 meses y 4 días**.

## Errores frecuentes

- Sumar los flujos **sin descontar** al calcular el VAN.
- Olvidar comparar la **TIR con la k** del enunciado.
- Dejar el payback con decimales sin traducir.
- Recomendar el proyecto de mayor TIR ignorando que tenga **VAN
  negativo** o payback excesivo.
```

- [ ] **Step 2: Verificar i commit**

```bash
npm run check
git add src/content/asignaturas/edmn-2bach/ebau/05-van-tir-payback.mdx
git commit -m "feat(ebau): apèndix D.5 — VAN, TIR, Payback"
```

---

### Task 4.6: Crear `06-gestion-tiempo.mdx`

**Files:**
- Create: `src/content/asignaturas/edmn-2bach/ebau/06-gestion-tiempo.mdx`

- [ ] **Step 1: Crear el fitxer**

```mdx
---
asignatura: edmn-2bach
orden: 6
title: Gestión del tiempo en el examen
comunidad: Comunitat Valenciana
lang: es
estado: publicado
---

El examen dura **1 h 30 min** y se reparte en **6 preguntas de teoría**
(6 puntos) y **2 ejercicios prácticos** (4 puntos). La diferencia
entre un 7 y un 9 muchas veces no está en saber más, sino en
repartir mejor el tiempo.

| Tiempo | Bloque | Cómo |
|--------|--------|------|
| 5 min | Lectura inicial | Lee el examen entero. Marca qué preguntas dominas y decide el orden — no tienes que ir por orden cronológico, empieza por lo seguro. |
| ~40 min | Teoría · 6 preguntas (6 pts) | **6-7 min por pregunta.** Definición clara, fórmula si la admite, gráfico cuando ayude. Si te bloqueas en una, sáltala y vuelve al final. |
| 40 min | Práctica · 2 ejercicios (4 pts) | **20 min por ejercicio.** Cálculos limpios y ordenados, gráfico cuando lo pidan, y siempre frase interpretativa al final. |
| 5–10 min | Revisión final | Comprueba sumas, redondeos, frases interpretativas. Verifica que no has dejado nada en blanco — un apartado en blanco es 0 seguro. |

**Total ≈ 90 minutos.** Si te sobra tiempo en revisión, mejor: úsalo
para mejorar las interpretaciones, no para añadir relleno.

## No empieces por orden

Si la primera pregunta te bloquea, sáltala y vuelve al final. Cinco
minutos atascado son cinco preguntas que no estás contestando. El
examen no se corrige por orden cronológico de tu cabeza.

## Antes de entregar

- ¿He **interpretado** todos los resultados con frase explicativa?
- ¿He **redondeado hacia arriba** en los umbrales?
- ¿He puesto los **negativos entre paréntesis** en el balance?
- ¿He convertido los **decimales del payback** a tiempo real?
- ¿He **recomendado mejoras** en los ratios fuera del óptimo?
- ¿He **marcado Q*** en el gráfico del umbral?
```

- [ ] **Step 2: Verificar i commit**

```bash
npm run check
git add src/content/asignaturas/edmn-2bach/ebau/06-gestion-tiempo.mdx
git commit -m "feat(ebau): apèndix D.6 — gestión del tiempo en el examen"
```

---

### Task 4.7: Crear `07-cheatsheet.mdx`

**Files:**
- Create: `src/content/asignaturas/edmn-2bach/ebau/07-cheatsheet.mdx`

- [ ] **Step 1: Crear el fitxer**

```mdx
---
asignatura: edmn-2bach
orden: 7
title: Errores típicos — cheatsheet final
comunidad: Comunitat Valenciana
lang: es
estado: publicado
---

Imprímela y léela el día antes. Si evitas estos errores, ya tienes
medio examen ganado.

| Bloque | Error a evitar |
|--------|---------------|
| Teoría | Responder con rodeos sin definir el concepto técnico. |
| Teoría | No usar fórmula cuando la pregunta la exige. |
| Teoría | Omitir el gráfico cuando la teoría lo admite. |
| Umbral | No redondear hacia arriba a la unidad superior. |
| Umbral | Dejar Q* = 1.234,34 sin interpretar con frase. |
| Umbral | No marcar Q* en el gráfico. |
| Balance | Olvidar restar la amortización acumulada del AnC. |
| Balance | Negativos con signo «−» en lugar de paréntesis. |
| PyG | Contabilizar solo lo cobrado / pagado en lugar del total. |
| Ratios | Calcular y no interpretar ni recomendar mejoras. |
| Ratios | No distinguir RE (BAII / AT) de RF (BN / PN). |
| VAN / TIR | Sumar flujos sin descontar al calcular el VAN. |
| Payback | Dejar el resultado en decimal sin traducir a tiempo. |
| General | Dejar respuestas en blanco por mala gestión del tiempo. |
| General | No revisar al final: la mitad de los errores son de calculadora. |

> Lee, respira, organiza el tiempo y confía en lo que has trabajado
> todo el curso. Cualquier duda, en clase. Mucha suerte. — **Pau**
```

- [ ] **Step 2: Verificar i commit**

```bash
npm run check
git add src/content/asignaturas/edmn-2bach/ebau/07-cheatsheet.mdx
git commit -m "feat(ebau): apèndix D.7 — cheatsheet final"
```

---

## Fase 5 · Reto del curso — pàgines d'obertura

### Task 5.1: Crear `intro.mdx` (pàgina 1 del Reto)

**Files:**
- Create: `src/content/asignaturas/edmn-2bach/reto/intro.mdx`

- [ ] **Step 1: Crear el fitxer**

```mdx
---
asignatura: edmn-2bach
orden: 1
title: Reto del curso — el plan de empresa que vas a construir
lang: es
estado: publicado
---

# Reto del curso

## Vas a montar una empresa de mentira

A lo largo de las 12 unidades de este libro vas a construir, **paso
a paso**, un plan de empresa real para una idea de negocio que tú
elegirás en la unidad 1. No es un trabajo final al que llegas
agotado en junio: es un hilo que crece cada semana, donde cada unidad
añade una pieza al puzle.

La razón es sencilla. Si en junio te piden «haz un plan de empresa»,
el resultado es siempre el mismo: cuatro páginas escritas a la
desesperada con ideas de manual. Si en cambio en septiembre eliges
una idea propia y la trabajas durante 9 meses, llegas a junio con
algo que se parece a una empresa de verdad y, de paso, con todas las
herramientas de la asignatura **aplicadas** — que es lo que el examen
acaba evaluando.

## Las 12 etapas

| Etapa | Unidad | Entregable |
|-------|--------|------------|
| 1 | U1 — Persona emprendedora | Idea + por qué tú |
| 2 | U2 — Tipos de empresa | Forma jurídica justificada |
| 3 | U3 — Entorno y estrategia | DAFO + PESTEL del proyecto |
| 4 | U4 — Modelos de negocio | BMC v1 con hipótesis a validar |
| 5 | U5 — Diseño creativo | VPC + prototipo mínimo |
| 6 | U6 — Función comercial | Marketing mix + briefing de campaña |
| 7 | U7 — Función productiva | Proceso + costes + umbral de rentabilidad |
| 8 | U8 — Recursos humanos | Organigrama + coste salarial año 1 |
| 9 | U9 — Función financiera | Plan de inversión + VAN/TIR del proyecto |
| 10 | U10 — Información contable | Balance + tesorería previsional año 1 |
| 11 | U11 — Análisis de EEFF | Ratios + plan de mitigación de riesgos |
| 12 | U12 — Comunicación · pitch | Pitch 3 min + dossier 5 pp. |

## Cómo se trabaja

Al final de cada unidad encontrarás una **fitxa marcada "Reto · Etapa
N"** con el entregable de esa semana. Vas guardándolos todos en una
carpeta digital (Drive, Notion, Word). En la unidad 12 los compones
en el dossier final.

**No es opcional, pero no es de examen.** El profesor / la profesora
puede pedirte ver el avance al final de cada bloque (después de la
unidad 4, después de la 8 y después de la 12). El Reto se evalúa con
la rúbrica que está dos páginas más adelante.

## Si no se te ocurre ninguna idea

No pasa nada. La unidad 1 te da herramientas para encontrar ideas y
descartar las que no encajan contigo. Puedes incluso cambiar de idea
hasta la unidad 4 (después de eso, ya tienes demasiado invertido).
Lo que **no** está permitido es no tener ninguna idea: cualquier idea
es mejor que ninguna, y todo el aprendizaje funciona aunque la idea
final no sea buena.
```

- [ ] **Step 2: Verificar i commit**

```bash
npm run check
git add src/content/asignaturas/edmn-2bach/reto/intro.mdx
git commit -m "feat(reto): obertura del Reto del curso d'EDMN 2BACH"
```

---

### Task 5.2: Crear `rubrica.mdx`

**Files:**
- Create: `src/content/asignaturas/edmn-2bach/reto/rubrica.mdx`

- [ ] **Step 1: Crear el fitxer**

```mdx
---
asignatura: edmn-2bach
orden: 2
title: Reto del curso — rúbrica de evaluación
lang: es
estado: publicado
---

# Rúbrica del Reto

Tu Reto se evalúa al **final del curso** sobre el dossier completo
(las 12 etapas + el pitch). La nota se compone de cinco criterios.

## Los cinco criterios

### 1 · Coherencia interna del plan (25 %)

¿Encaja todo? ¿La forma jurídica elegida (etapa 2) es coherente con
el modelo de negocio (etapa 4)? ¿El umbral (etapa 7) se corresponde
con el plan de inversión (etapa 9)? Un plan donde cada etapa va por
su lado vale menos que uno modesto pero alineado.

### 2 · Aplicación correcta de las herramientas (25 %)

¿El BMC está bien hecho? ¿El DAFO no es genérico? ¿El cálculo del
VAN es matemáticamente correcto? Aquí se evalúa que las herramientas
del libro estén bien aplicadas, no las opiniones.

### 3 · Realismo y aterrizaje (20 %)

¿La idea, los costes y los precios son creíbles? Una empresa que va
a vender 1.000.000 de uds. el primer año pierde puntos. Una que
asume costes salariales por debajo del SMI también.

### 4 · Calidad del análisis crítico (15 %)

¿Identificas riesgos reales? ¿Reconoces hipótesis no validadas?
¿Sabes decir qué fallaría primero?

### 5 · Pitch + comunicación (15 %)

¿Defiendes el plan en 3 minutos sin leer? ¿El dossier es legible y
visualmente claro? ¿Respondes preguntas con calma?

## La conversión a nota

Cada criterio se puntúa de 0 a 4:

- **4** — Excelente, sin debilidades visibles.
- **3** — Sólido, con algún punto mejorable.
- **2** — Aceptable, varios puntos por pulir.
- **1** — Flojo, errores conceptuales o ejecutivos.
- **0** — Ausente o muy deficiente.

La nota final del Reto = (suma ponderada) × 2,5. Sobre 10.

## Lo que NO se evalúa

- **Si la idea funcionaría en la vida real.** Una idea modesta bien
  trabajada vale más que una idea brillante mal ejecutada.
- **El sector elegido.** Cualquier sector vale (no se valora que sea
  «innovador» ni «tecnológico»).
- **El número de páginas del dossier.** 5 páginas bien hechas valen
  más que 30 de relleno.
```

- [ ] **Step 2: Verificar i commit**

```bash
npm run check
git add src/content/asignaturas/edmn-2bach/reto/rubrica.mdx
git commit -m "feat(reto): rúbrica d'evaluació del Reto del curs"
```

---

## Fase 6 · Pilot sobre U6 (Función comercial · marketing)

> Aquesta fase aplica el patró nou complet a la unitat U6. El
> contingut del cas real i les recomanacions concretes està obert a
> revisió per Pau abans del commit final.

### Task 6.1: Afegir `TldrUnidad` + `CasoDilema` al començament d'U6

**Files:**
- Modify: `src/content/asignaturas/edmn-2bach/libro/06-funcion-comercial-marketing.mdx`

- [ ] **Step 1: Afegir els imports al bloc d'imports existent**

Localitzar el bloc d'imports (línies 32-46 aprox.) i afegir:

```mdx
import TldrUnidad from '@components/TldrUnidad.astro';
import CasoDilema from '@components/CasoDilema.astro';
import VuelveAlCaso from '@components/VuelveAlCaso.astro';
import PistaEbau from '@components/PistaEbau.astro';
import VocesDesacuerdo from '@components/VocesDesacuerdo.astro';
import RetoEtapa from '@components/RetoEtapa.astro';
import MirarFora from '@components/MirarFora.astro';
```

- [ ] **Step 2: Inserir `TldrUnidad` i `CasoDilema` al començament del cos**

Just després del blockquote inicial "> **Tiempo estimado…**" i abans del primer `## Segmentación de mercado`, afegir:

```mdx
<TldrUnidad>
La función comercial decide quién recibe el producto, a qué precio y
por qué canal. En esta unidad vas a segmentar un mercado con criterios
útiles, formular una propuesta de valor coherente con el segmento,
diseñar las 4P del marketing mix y elegir las fuentes de ingresos.

Una empresa puede producir un buen producto, gestionar un equipo
competente y financiarse sin estrés, pero si falla aquí, no existe
económicamente.
</TldrUnidad>

<CasoDilema
  titular="Nespresso bajó el precio de sus cápsulas y la facturación cayó un 8 %"
  fuente="El País · 14 octubre 2024"
  pregunta="¿Por qué una rebaja del 15 % puede reducir los ingresos en vez de aumentarlos?"
>
A principios de 2024, Nespresso experimentó con una rebaja del 15 % en
sus cápsulas clásicas para frenar la competencia de las marcas blancas
de Lidl, Carrefour y Mercadona. La hipótesis era ampliar el segmento
atrayendo a consumidores sensibles al precio. El resultado fue el
contrario: los ingresos cayeron un 8 % el primer trimestre y la
percepción de marca premium se deterioró en los estudios de mercado.
</CasoDilema>
```

- [ ] **Step 3: Provar al dev server**

```bash
npm run dev
```

Obrir `http://localhost:4321/edmn-2bach/libro/06-funcion-comercial-marketing`
i verificar que el TL;DR i el cas real apareixen abans del contingut
original i que el drop cap del primer paràgraf de "Segmentación de
mercado" no s'aplica al text original.

- [ ] **Step 4: Commit**

```bash
git add src/content/asignaturas/edmn-2bach/libro/06-funcion-comercial-marketing.mdx
git commit -m "feat(edmn-u6): afegir TL;DR + Caso real al començament de la unitat 6"
```

---

### Task 6.2: Afegir `VocesDesacuerdo` i `PistaEbau` al contingut d'U6

**Files:**
- Modify: `src/content/asignaturas/edmn-2bach/libro/06-funcion-comercial-marketing.mdx`

- [ ] **Step 1: Afegir `VocesDesacuerdo` a la secció de Posicionamiento o Comunicació**

Buscar la secció pertinent (probablement una subsecció de marketing
mix sobre publicitat o posicionament) i afegir-hi just al final de la
subsecció:

```mdx
<VocesDesacuerdo
  tema="¿La publicidad crea necesidades o las descubre?"
  postura_a={{
    etiqueta: 'Galbraith (1958)',
    tesis: 'La publicidad fabrica deseos que no existían y atrapa al consumidor en una rueda de consumo sin fin.',
  }}
  postura_b={{
    etiqueta: 'Kotler (escuela del marketing)',
    tesis: 'La publicidad revela necesidades latentes y conecta oferta con demanda; sin ella el mercado no funciona.',
  }}
>
La verdad probablemente está en medio. Hay productos donde la
publicidad sobre todo descubre (un seguro contra un riesgo que el
cliente desconocía) y otros donde crea con fuerza (moda y gadgets de
consumo no estrictamente necesarios). El criterio analítico útil para
ti: ¿el producto resuelve un problema que existe sin la publicidad,
o el problema lo construye la propia publicidad?
</VocesDesacuerdo>
```

- [ ] **Step 2: Afegir `PistaEbau` a la secció de precio o marketing mix**

Buscar la secció on s'explica el preu i afegir-hi:

```mdx
<PistaEbau tipo="teorica" concepto="Precio ≠ coste" apendice="Apèndix D.1">
El precio es lo que el cliente paga; el coste es lo que la empresa
gasta. Confundirlos en una respuesta abierta sobre marketing mix es
un error clásico que cuesta puntos. En definiciones, evita decir
«precio = coste + margen»: es una fórmula de fijación de precios
**posible** (cost-plus), no una definición conceptual.
</PistaEbau>
```

- [ ] **Step 3: Provar al dev server i revisar**

```bash
npm run dev
```

- [ ] **Step 4: Commit**

```bash
git add src/content/asignaturas/edmn-2bach/libro/06-funcion-comercial-marketing.mdx
git commit -m "feat(edmn-u6): sidebars VocesDesacuerdo + PistaEbau a la unitat 6"
```

---

### Task 6.3: Afegir `VuelveAlCaso`, `RetoEtapa` i `MirarFora` al final d'U6

**Files:**
- Modify: `src/content/asignaturas/edmn-2bach/libro/06-funcion-comercial-marketing.mdx`

- [ ] **Step 1: Inserir `VuelveAlCaso` just abans dels takeaways finals**

Buscar el bloc `<KeyTakeaways>` (existeix a la majoria d'unitats al
final). Just abans, afegir:

```mdx
<VuelveAlCaso referencia="Nespresso y la rebaja del 15 %">
La rebaja desestabilizó el **posicionamiento premium** que justificaba
el sobrecoste sobre las marcas blancas. El precio no era solo un coste
para el consumidor: era una **señal** —de calidad, exclusividad y
pertenencia— alineada con el segmento al que Nespresso se dirigía.

Al romper esa señal, Nespresso perdió a sus clientes premium sin
atraer suficientes clientes nuevos del segmento sensible al precio,
que en realidad ya compraban marca blanca y no estaban dispuestos a
pagar 4 × por una cápsula aunque fuera más barata que antes. La
lección operativa: una bajada de precio no es un movimiento neutro,
es un cambio de **segmentación** disfrazado de promoción.
</VuelveAlCaso>
```

- [ ] **Step 2: Inserir `RetoEtapa` dins (o just després de) el bloc d'Actividades**

Si la unitat ja té un bloc d'activitats, afegir-hi:

```mdx
<RetoEtapa
  etapa={6}
  titulo="Estrategia comercial del proyecto"
  entregable="Documento de 2 páginas: segmentos elegidos, propuesta de valor por segmento, marketing mix (4P) y briefing de una campaña."
>
Toma tu proyecto de la **etapa 5** (Value Proposition Canvas +
prototipo). Define ahora **a quién** se lo vendes, **a qué precio**,
**por qué canal** y **cómo lo comunicas**. Para cada segmento que
identifiques, justifica por qué cumple las cuatro condiciones
(tamaño, identificable, accesible, diferente).

Cierra con un briefing de campaña de **una página**: público,
mensaje principal, soporte (vídeo / imagen / texto), canal y métrica
con la que medirás si funciona. Si no se te ocurre la métrica, no
tienes briefing.
</RetoEtapa>
```

- [ ] **Step 3: Inserir `MirarFora` al final del fitxer**

Al final del fitxer MDX, després de tot:

```mdx
<MirarFora
  unidad={6}
  libro={{
    titulo: 'Las trampas del deseo',
    meta: 'Dan Ariely · Ariel, 2008',
    porque: 'Los sesgos cognitivos que explican por qué cobramos por gratis, por qué un descuento nos atrapa y por qué decidimos lo que decidimos como consumidores.',
    paginas: 'Capítulos 1, 3 y 9',
  }}
  video={{
    titulo: 'los precios no existen ¿cómo funciona la economía?',
    meta: 'econoTube · YouTube',
    duracion: '12 min',
    porque: 'El punto exacto donde el precio deja de ser un número para convertirse en una señal de segmentación.',
    url: 'https://www.youtube.com/results?search_query=los+precios+no+existen+como+funciona+la+economia',
  }}
  cuenta={{
    titulo: '@The_AdProfessor',
    meta: 'X / Twitter',
    porque: 'Casos reales de marketing diseccionados en hilos cortos cada semana — el contenido perfecto para entrenar el ojo crítico.',
  }}
  actividad_titulo="Tres productos, tres señales"
  actividad_duracion="20-30 min"
>
  <Fragment slot="actividad">
    Mira el vídeo y elige **tres productos** de tu vida diaria: uno
    que compres por hábito, uno que compres en oferta y uno premium.
    Para cada uno, identifica cuál es la **señal** que te ha hecho
    comprarlo (no el ingrediente, no la marca: la señal de precio o
    posicionamiento). Trae un ejemplo a clase la próxima sesión.
  </Fragment>
  <Fragment slot="para-clase">
    Variante en grupos de 4: cada grupo elige una campaña real
    reciente (búsqueda en X / Instagram) y presenta en 90 segundos
    qué **señal** envía la campaña y a qué **segmento** la dirige.
    El resto de la clase puntúa si el match señal–segmento es
    coherente. Duración: 45 min. Materiales: móvil, proyector.
  </Fragment>
</MirarFora>
```

- [ ] **Step 4: Provar al dev server**

```bash
npm run dev
```

Verificar a la pàgina web que tots els nous blocs apareixen amb
l'estètica esperada i sense ruptures.

- [ ] **Step 5: Commit**

```bash
git add src/content/asignaturas/edmn-2bach/libro/06-funcion-comercial-marketing.mdx
git commit -m "feat(edmn-u6): VuelveAlCaso + RetoEtapa + MirarFora a la unitat 6"
```

---

## Fase 7 · Validació final al PDF

### Task 7.1: Generar PDF d'EDMN 2BACH amb tot el pilot

**Files:** —

- [ ] **Step 1: Build complet**

```bash
npm run build
npm run build:pdf
```

Expected: build OK, PDF generat sense errors.

- [ ] **Step 2: Comprovar el PDF pàgina a pàgina**

Obrir el PDF d'EDMN 2BACH i comprovar visualment:

- TOC: sense overflow (Task 0.3 verificat).
- Pàgines del Reto del curso: apareixen abans del TOC, ben maquetades.
- Unitats 1-5 i 7-12: idèntiques a abans (no s'han tocat).
- Unitat 6: **mostra tots els components nous** —
  - TL;DR al començament
  - CasoDilema obrint
  - VocesDesacuerdo i PistaEbau intercalats al contingut
  - VuelveAlCaso abans dels takeaways
  - RetoEtapa al bloc d'actividades
  - MirarFora com a pàgina dedicada al final
- Apèndix EBAU: portada + 7 seccions, cadascuna amb el seu page-break.

Anotar qualsevol issue visual nou a `docs/issues-pilot-edmn.md`.

- [ ] **Step 3: Si tot OK, marcar el pilot com a complet**

Afegir al final de `docs/issues-pilot-edmn.md`:

```markdown
## Pilot completat

Data: <date>
- Tots els components nous renderitzen correctament al web i al PDF.
- L'apèndix EBAU substitueix el PDF independent.
- El Reto del curso obri el llibre amb la rúbrica.
- U6 és la unitat pilot completa amb els 7 patrons aplicats.

Pendent: aplicar el patró a U1-U5 i U7-U12 (nou pla).
```

- [ ] **Step 4: Commit final**

```bash
git add docs/issues-pilot-edmn.md
git commit -m "docs: pilot d'innovació editorial EDMN 2BACH completat — U6 maquetada"
```

---

## Resum del pla

| Fase | Tasques | Output |
|------|---------|--------|
| 0 — Auditoria | 4 tasks | TOC bug fix + llista d'issues |
| 1 — Components | 7 tasks | 7 components Astro reusables |
| 2 — Print CSS | 1 task | overrides paged.js per als 7 components |
| 3 — Estructura llibre | 2 tasks | col·lecció `retoCurso` + render al PDF |
| 4 — Contingut EBAU | 7 tasks | 7 seccions de l'apèndix |
| 5 — Contingut Reto | 2 tasks | intro + rúbrica |
| 6 — Pilot U6 | 3 tasks | unitat 6 amb tots els patrons aplicats |
| 7 — Validació | 1 task | PDF final verificat |
| **Total** | **27 tasks** | Pilot complet |

Compromisos de commit: ~22 commits al llarg del pla.

## Fora d'abast (un nou pla cobrirà)

- Aplicar el patró a U1-U5 i U7-U12 d'EDMN 2BACH (11 unitats).
- Replicar el sistema als 10 llibres restants.
- Fixar issues de contingut a altres llibres detectats a Fase 0.
- Errata pública amb noms.
- Mapa del libro no lineal al principi.

---

> **Pròxim pas:** triar mode d'execució (subagent-driven o inline)
> i començar per Fase 0.
