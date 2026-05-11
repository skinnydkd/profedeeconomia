---
title: Enhancement de contingut + portada + descàrrega PDF
date: 2026-05-11
status: in_progress
asignatura: edmn-2bach
---

# Plan: enhancement de contingut + portada + descàrrega PDF (EDMN 2BACH)

## Contexto

El llibre EDMN 2BACH té les 12 unitats publicades però és millorable:
- Falten ejercicios resueltos paso a paso a les unitats pràctiques (6, 7, 9, 10, 11)
- Falten curiosidades i ejemplos reales que facin el llibre més amè
- No hi ha portada ni índice en format llibre
- No es pot descargar com a PDF

Aquest pla cobreix les fases A i B en paral·lel del backlog acordat amb Pau el 2026-05-11. Les fases C (diapositives Marp), D (tests/actividades/recursos) i E (juegos) queden per a sessions posteriors.

## Principis vinculants

- **Single source of truth**: el contingut viu només a MDX. La web, el PDF i (futur) les diapos deriven del mateix MDX.
- **Estètica Variant C**: cream, terracota, mostassa. Components nous segueixen el mateix llenguatge visual.
- **No emojis com a icones**: SVG o glifs tipogràfics si cal marcar visualment les seccions noves.
- **Tons proper sense ser personal**: ejemplos i curiosidades en plural ("hem vist", "us proposem").

## Decisions tècniques

### Components nous (3)

| Component | Variant CSS | Ús |
|-----------|-------------|---|
| `<SolvedExercise>` | terracota fort, fons paper, número d'ejercicio en serif italic | Enunciat + dades + solució paso a paso amb fórmules |
| `<Curiosity>` | mostassa soft, marge esquerre punto, "Sabíeu que..." en eyebrow | Fets curiosos, anècdotes històriques, dades sorprenents |
| `<RealExample>` | berenjena soft, eyebrow "Ejemplo real", pot incloure cita de premsa | Casos d'empreses concretes verificables (Mercadona, Inditex, Glovo, etc.) |

Tots tres viuran a `src/components/` i s'importaran a cada MDX que els necessite.

### Sistema de portada + índice + descàrrega

**Ruta `/edmn-2bach/libro/imprimir/`** (no indexada): renderitza en una sola pàgina HTML, en seqüència:
1. Portada (`<BookCover>`): títol del llibre, autor, edició, paleta Variant C, una marca tipogràfica gran amb Fraunces
2. Pàgina de crèdits + nota sobre LOMLOE (la del CLAUDE.md)
3. Índice extens (auto-generat): títol unitat + lema + duració + bloque + número de pàgina (paged.js posa el num de pàgina amb `target-counter`)
4. Cada unitat seguida en ordre, amb capítol-opener (número gran + títol + lema) i el contingut MDX renderitzat
5. Bibliografia agregada (de moment, només la propia de cada unitat)

**Print CSS** (al mateix `imprimir.astro` o a `print.css`): regles `@page`, `@page :left/:right`, `running()` per al títol del llibre al header, `target-counter` per al ToC, salts `break-before: page` als capítols.

**Generació PDF**:
- Dependència nova: `pagedjs-cli` (devDep)
- Script: `scripts/build-book-pdf.mjs` que llança `pagedjs-cli` contra `dist/edmn-2bach/libro/imprimir/index.html` i genera `public/downloads/edmn-2bach-libro.pdf`
- Comanda npm: `npm run build:pdf` (no automàtica, manual quan el contingut estiga revisat)
- Recomanació de workflow: `npm run build && npm run build:pdf && npm run build` (segon build per copiar el PDF a dist/)
- Si el script falla per problemes de Chrome a Windows, fallback: `puppeteer` directe amb el polyfill `pagedjs-polyfill`

**Botó de descàrrega**: a `/edmn-2bach/libro/index.astro`, badge "Descargar libro completo (PDF)" amb l'icona tipográfica i una nota "Última actualización: {fecha}".

### Enhancement de contingut

Per a cada unitat afegim:
- **2-4 curiosidades** (`<Curiosity>`) repartides en moments oportuns del text. Anècdotes històriques, dades sorprenents, connexions amb la realitat actual.
- **2-3 ejemplos reales** (`<RealExample>`) amb empreses concretes i verificables. Cita la font (premsa, informe anual, web oficial).
- **Per a unitats pràctiques** (6, 7, 9, 10, 11): **2 `<SolvedExercise>` cadascuna** com a mínim, paso a paso, amb dades reals plausibles.

### Què NO fem en aquest pla

- Diapositives Marp (sessió pròpia)
- Tests/actividades/recursos (sessió pròpia)
- Portada amb il·lustració personalitzada (només tipografia editorial)
- Generació de PDF al CI (de moment manual)
- Adaptacions per CCAA (vetada al CLAUDE.md)

## Backlog seqüenciat

### Fase B (infraestructura) — primer

1. ✅ Pla escrit a `documents/plans/`
2. Crear `<SolvedExercise>`, `<Curiosity>`, `<RealExample>` (3 components Astro nous)
3. Crear `<BookCover>` i `<BookTOC>` (components específics per a impressió)
4. Crear ruta `src/pages/[asignatura]/libro/imprimir.astro` (només `edmn-2bach` per ara)
5. Crear `print.css` amb regles paged.js (@page, target-counter, running headers)
6. Instal·lar `pagedjs-cli` i crear `scripts/build-book-pdf.mjs`
7. Afegir scripts npm: `build:pdf`
8. Afegir botó "Descargar PDF" al libro index
9. Provar generació local d'un PDF complet, verificar paged.js render

### Fase A (enhancement de contingut) — després de B funcional

10. Definir 2-4 curiosidades + 2-3 exemples reals per a cada unitat (12 unitats)
11. Per a Units 6, 7, 9, 10, 11: redactar 2 ejercicios resueltos cadascuna amb dades plausibles
12. Aplicar al MDX, mantenir to editorial sòbria
13. Regenerar PDF amb el contingut nou
14. Build final, commit, PR

## Riscs i obertes

- **paged.js + Astro fonts**: les fonts venen de Google/Fontshare. paged.js renderitza al navegador, així que ha de funcionar; cal verificar que el Chromium de pagedjs-cli les carrega.
- **Mida del PDF**: 12 unitats poden ser 150-200 pàgines. Dimensions raonables.
- **Verificació tècnica del contingut nou**: els ejercicios resueltos els revise jo (Pau) com qualsevol altre contingut educatiu del llibre. Marquem `requiere_revision_tecnica: true` als blocs nous si cal.

## Convencions per als 3 components

```mdx
import SolvedExercise from '@components/SolvedExercise.astro';
import Curiosity from '@components/Curiosity.astro';
import RealExample from '@components/RealExample.astro';

<SolvedExercise number="7.1" title="Cálculo del punto muerto en una panadería">
**Enunciado**

Una panadería tiene unos costes fijos mensuales de 3.200 €...

**Solución**

1. Identificamos el margen de contribución unitario: P − CVu = 1,40 − 0,40 = 1,00 €.
2. Aplicamos la fórmula: Q* = CF / (P − CVu) = 3.200 / 1,00 = **3.200 barras al mes**.
3. ...
</SolvedExercise>

<Curiosity title="El primer punto muerto de la historia">
La fórmula del break-even fue formalizada por Walter Rautenstrauch en 1922 en la Columbia Business School...
</Curiosity>

<RealExample title="Mercadona y la productividad por trabajador" source="Informe anual Mercadona 2024">
Mercadona facturó en 2023 una media de 350.000 € por trabajador, casi el doble que la media del sector retail español...
</RealExample>
```
