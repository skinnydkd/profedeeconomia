# Slides Overhaul · EDMN 2BACH pilot

**Estat**: aprovat per Pau el 2026-05-28
**Autor**: Pau Monterde
**Pilot**: EDMN 2BACH (12 unitats)
**Següent salt**: replicar als 8 llibres restants si Pau valida el resultat

## Context

Els llibres de profedeeconomia tenen ara el patró d'innovació editorial aplicat
a les 9 assignatures (88 unitats — vegeu `2026-05-27-edmn-pilot-innovacion.md`).
Cada unitat conté components rics: `TldrUnidad`, `CasoDilema`, `VuelveAlCaso`,
`Figure`, `RealExample`, `Curiosity`, `SolvedExercise`, `Steps`, `KeyTakeaways`,
`VocesDesacuerdo`, `PistaEbau`, `RetoEtapa`, `MirarFora`, diagrames Astro
(`MarketingMix4P`, `AnsoffMatrix`, etc.).

La generació de diapositives actual (`scripts/extract-slides.mjs` →
`scripts/build-slides.mjs`) és deliberadament esquelet: extreu títol, lema,
objectius, conceptes clau, 1 slide per `## H2` (només títol + 1r bullet o
excerpt curt), `KeyTakeaways` com a "Lo esencial", i un close. **Tots els
components rics s'eliminen** explícitament a `stripMdxNoise()`. Resultat: PDFs
sobris sense imatges, sense diagrames, sense els elements editorials nous.

Pau ha demanat **diapositives realment xules amb imatges, gràfics i text ben
fet, suficientment completes perquè els alumnes puguen estudiar amb elles
encara que tinguen el llibre**.

## Objectius

1. Convertir els decks d'esquelet a material d'estudi autosuficient.
2. Incorporar totes les imatges (`<Figure>`) i diagrames Astro existents
   sense duplicar contingut (single-source-of-truth: el MDX continua sent
   l'única font).
3. Renderitzar cada component editorial nou amb un layout propi visualment
   coherent amb Variant C.
4. Mantenir el theme Marp Variant C (cream + terracota + mostassa, Fraunces
   + Switzer + JetBrains Mono) i estendre'l només amb classes utilitàries.
5. Pilot sobre EDMN 2BACH abans d'escalar.

## Decisions vinculants

- **Direcció visual**: editorial-keynote balancejat (Stripe Press, no Apple
  Keynote). Tipografia gran, espai blanc generós, però amb prou densitat
  perquè una slide sola explique un concepte sencer.
- **Densitat**: ~40-70 slides per unitat (vs ~10-15 actuals). Sense
  truncar text; definicions, exemples i exercicis complets.
- **Abast del pilot**: EDMN 2BACH, les 12 unitats. Si valida, replicar a
  les 8 assignatures restants en un PR separat.
- **Diagrames Astro**: screenshot automàtic via Playwright; PNG d'alta
  resolució (2400×1350 @2x) cachejat a `public/slides-assets/`.
- **Imatges del llibre**: import directe via `--allow-local-files` de
  Marp resolent els imports `@assets/libro/...` a paths absoluts.
- **Iteració ràpida**: `npm run build:slides edmn-2bach -- --html-only`
  per saltar el PDF; PDF només quan toca commit definitiu.
- **Watch mode**: descartat (overkill).
- **SolvedExercise**: 2 slides per exercici (enunciat → passar pàgina →
  solució). Permet que l'alumne pense abans de veure els passos.
- **Font-size del cos**: 26px → 28px per millor llegibilitat en mode estudi.

## Anatomia del deck (per unitat)

```
1. Title slide                  (terracota soft, h1 80px, italic-wonk a paraula clau)
2. TL;DR                        (pull-quote gran, regle terracota damunt)
3. Caso dilema                  (imatge a sang esquerra + titular + pregunta + font)
4. Objetivos                    (llistat clàssic)
5. Conceptos clave              (chips/pills amb fons cream)

Per a cada secció H2 del MDX:
  6.  H2 cover slide            (títol gran sense bullets — divisor)
  7.  Subsecció H3              (definició completa + bullets)
  8.  Figure slide              (si la subsecció té <Figure>)
  9.  Subsecció H3              …
  10. RealExample slide         (si la subsecció té <RealExample>)
  11. Curiosity slide           (si té <Curiosity>, fons mostassa-soft)
  12. SolvedExercise slide #1   (enunciat + dades)
  13. SolvedExercise slide #2   (solució amb passos numerats)
  14. Diagram slide             (PNG screenshot, si la secció el referencia)
  …

[Penúltims slides — segons el que tinga la unitat]
  N+1. Vuelve al caso
  N+2. Voces en desacuerdo      (2 columnes)
  N+3. Pista EBAU               (només EDMN)
  N+4. Reto etapa X/12          (només EDMN)
  N+5. Lo esencial              (KeyTakeaways)
  N+6. Mirar fora               (grid 2×2)

N+7. Close slide                (existent, "Hasta aquí la teoría")
```

## Arquitectura tècnica

### Fase A — Pre-build d'assets visuals

Script nou: `scripts/capture-diagrams.mjs`

- Arrenca Astro en mode preview (`npm run preview` en background).
- Per cada unitat publicada, descobreix elements amb
  `data-slide-diagram="<id>"` (cal afegir aquest atribut als components
  `<Diagram>` i als components-diagrama específics).
- Playwright headless: viewport 1920×1080, localitza l'element, fa
  `element.screenshot()` amb `omitBackground: true` per fons transparent
  si l'element no en porta.
- Output: `public/slides-assets/<asignatura>/<unitat>/<diagram-id>.png`
  a 2400×1350 efectius (deviceScaleFactor 2).
- Cache: hash del MDX font → si el hash no canvia, no es regenera el PNG.
  Manifest a `tmp/slides-assets-manifest.json`.

### Fase B — Generació del Markdown Marp

Refactoritzar `scripts/extract-slides.mjs`. La versió actual fa servir
regex i `stripMdxNoise()` per esborrar components. Cal canviar a:

1. **Parsing**: `unified` + `remark-parse` + `remark-mdx` (ja venen amb
   Astro indirectament; verificar abans). Construïm un AST MDX i recorrem
   els nodes per detectar components.
2. **Estructura modular**:
   ```
   scripts/
   ├── extract-slides.mjs              (orchestrator)
   ├── slide-parsers/
   │   ├── frontmatter.mjs             (title, objetivos, conceptos)
   │   ├── tldr.mjs                    (<TldrUnidad>)
   │   ├── caso.mjs                    (<CasoDilema>, <VuelveAlCaso>)
   │   ├── figure.mjs                  (<Figure> + resolució de imports)
   │   ├── real-example.mjs            (<RealExample>)
   │   ├── solved-exercise.mjs         (<SolvedExercise> → 2 slides)
   │   ├── curiosity.mjs               (<Curiosity>)
   │   ├── steps.mjs                   (<Steps>)
   │   ├── diagram.mjs                 (resol PNG cachejat)
   │   ├── voces.mjs                   (<VocesDesacuerdo>)
   │   ├── pista-ebau.mjs              (<PistaEbau>)
   │   ├── reto-etapa.mjs              (<RetoEtapa>)
   │   ├── mirar-fora.mjs              (<MirarFora>)
   │   ├── key-takeaways.mjs           (refactor de la lògica existent)
   │   └── h2-section.mjs              (text "neutre" entre components)
   └── slide-builders/
       ├── title-slide.mjs
       ├── section-cover.mjs           (H2 cover slide)
       └── deck-assembler.mjs          (ordena segons l'ordre original del MDX)
   ```
3. **Output**: `tmp/slides/<asignatura>/<unitat>.md` (sense canvis de path).

#### Resolució d'imports d'imatges

Els MDX importen amb alies: `import foto from '@assets/libro/edmn-2bach/06/boqueria-barcelona.jpg'`.
El parser ha de:
- Llegir les sentències `import` del MDX.
- Mapejar `@assets/...` → `src/assets/...` (path absolut amb el root).
- Quan trobe `<Figure src={foto} ...>`, substituir `foto` pel path absolut.
- Convertir-ho al markdown a `![alt](file:///C:/…/foto.jpg)` o similar
  que Marp accepte amb `--allow-local-files`.

### Fase C — Marp CLI

Sense canvis estructurals a `scripts/build-slides.mjs`. Només:
- Afegir flag `--html-only` que salta el `--pdf`.
- Continuar amb `--allow-local-files` per a les imatges físiques.

### Theme Marp estès

`marp-themes/profedeeconomia.css` — afegir classes utilitàries noves:

```css
section.tldr          /* Pull-quote 42px Fraunces italic, regle terracota */
section.caso          /* Grid 2 col: imatge full-bleed esquerra + text dreta */
section.caso-resuelto /* Variant amb imatge dimmed + resolució */
section.figure        /* Imatge 80% centrada + caption + crèdit */
section.diagram       /* PNG centrat + títol superior, fons cream */
section.example       /* Card border-left terracota + kicker + relat */
section.curiosity     /* Fons mustard-soft + símbol ✻ decoratiu */
section.exercise      /* Slide d'exercici (enunciat o solució) */
section.voces         /* 2 col 50/50 amb línia divisòria, etiquetes color */
section.ebau          /* Header EBAU mostassa + contingut formal */
section.reto          /* Número d'etapa Fraunces 200px outline + tasques */
section.mirar-fora    /* Grid 2×2 amb icones tipogràfiques */
section.toc           /* Llistat seccions amb número decoratiu */
```

També:
- Canvi global `section { font-size: 26px → 28px }`.
- `p { max-width: 36em → 42em }`.
- `h2 { font-size: 44px → 40px }`.

### Diagrames: instrumentació necessària al codi font

Per al screenshot automàtic, els components-diagrama del llibre necessiten
un atribut `data-slide-diagram` al wrapper. Exemple per `MarketingMix4P`:

```astro
<!-- MarketingMix4P.astro -->
<figure data-slide-diagram="marketing-mix-4p" class="diagram-marketing-mix">
  …
</figure>
```

Llista de components a instrumentar (revisar exhaustivament durant el plan):
- `MarketingMix4P`
- `AnsoffMatrix`
- `FuentesIngresos`
- (Els altres que descobrim durant la implementació)

A més, el component `Diagram` genèric (que també existeix) ha de propagar
el seu prop `id` a un `data-slide-diagram={id}`.

## Iteració i validació

1. **Pilot mínim per veure direcció**: regenerar només EDMN 2BACH U6
   (Función comercial · marketing). És la unitat amb més riquesa
   d'imatges reals i diagrames (boqueria, mercado central VLC, Corte
   Inglés, Mercadona, MarketingMix4P). Si valida → continuar.
2. **Iteració visual ràpida**: `--html-only` per cicles ràpids.
3. **PDF de validació**: només quan Pau aproba la direcció.
4. **Escalat a 12 unitats**: regenerar EDMN 2BACH sencer.
5. **Pas següent (fora d'aquest spec)**: 8 llibres restants, en un PR
   separat un cop el patró d'EDMN estiga estabilitzat.

## Criteris d'èxit

- Una alumna d'EDMN 2BACH que estudia només amb les diapositives té
  l'essencial del llibre (definicions, exemples, exercicis resolts,
  punts clau de cada secció).
- Cada deck té com a mínim 3 imatges del llibre i, quan toca, el diagrama
  corresponent.
- L'estètica és coherent amb el llibre PDF: mateix theme cromàtic i
  tipogràfic.
- L'extracció és **determinista** i reproduïble: regenerar dos cops el
  mateix MDX produeix el mateix Markdown.
- `npm run build:slides edmn-2bach -- --html-only` triga ≤ 5 min per a
  les 12 unitats (sense PDF, sense regenerar diagrames cachejats).

## Fora d'abast

- Replicar als 8 llibres restants (es farà en PR separat).
- Diapositives editables (Keynote/PPTX): fase 3+, no MVP.
- Watch mode amb hot reload.
- Localització a català/valencià: idioma castellà al MVP.
- Animacions o transicions (Marp les suporta limitadament; no les
  emprem).
- Generar 1 deck combinat del llibre sencer (decks per unitat, no
  per llibre).

## Riscos identificats

- **Playwright + Astro preview lent en arrencada**: ~10-20 s d'overhead
  per cada execució del capture-diagrams. Mitigat amb cache de hash MDX.
- **Marp + Chromium**: la lentitud reportada al PR #61 (>50 min/deck) va
  ser transitòria; cal vigilar. Fallback: només HTML i PDF a banda.
- **MDX components amb props complexos**: si trobem components amb expressions
  JSX que el parser no resol (p.ex. `<Figure src={fotosArray[2]}>`), cal
  fallback gracieux a "saltar aquest component al slide".
- **Imatges grans incrustades a Marp**: si una unitat té 8 imatges
  pesades, el PDF resultant pot pesar 30-50 MB. Acceptable (els PDFs de
  llibre actuals ja pesen 24-42 MB).

## Notes operatives

- **Single-source-of-truth**: cap contingut nou específic per a slides.
  Tot vé del MDX. Si una unitat necessita una imatge nova al slide, primer
  va al llibre.
- **Print CSS**: el theme Marp ja és print-friendly per defecte. No cal
  estensió addicional per al PDF.
- **Build script orchestration**: `npm run build:slides` ha de cridar
  `capture-diagrams` abans de l'`extract` per assegurar PNGs disponibles.

## Pendent abans d'implementar

- Plan d'implementació detallat (writing-plans skill).
- Validar disponibilitat de `unified`/`remark-parse`/`remark-mdx` al
  `package.json` actual o afegir-los com a dev dependencies.
- Verificar que Playwright ja està instal·lat (sembla que sí pel test
  setup; en cas contrari, `npm i -D playwright`).
- Inventariar exhaustivament tots els components-diagrama existents
  (no només els 3 que es citen aquí).
