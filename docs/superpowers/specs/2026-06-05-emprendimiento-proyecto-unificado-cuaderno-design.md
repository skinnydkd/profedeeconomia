# «De cero a empresa» — proyecto unificado + cuaderno visual del alumno — Diseño

**Data:** 2026-06-05
**Estat:** disseny aprovat (pendent revisió de l'spec per Pau)

## Context i objectiu

La secció Emprendimiento (transversal, a «Otros») té avui peces valuoses però **disperses**: el projecte «De cero a empresa» (12 fases, orientat al professor), els «ejemplos con chispa» (9 empreses), el «kit de actitud» (7 activitats) i l'«entrevista a emprendedores» (amb plantilla). Falten dues coses:

1. **Cohesió**: que tot es visca com **un sol gran projecte**, no com a targetes soltes.
2. **Un quadern de l'alumne** per anar **omplint** a mesura que avancen — i, sobretot, amb **plantilles visuals/gràfiques** (el Business Model Canvas com a llenç real, el punt mort com a gràfica…), perquè **l'objectiu del projecte és pedagògic**.

Aquest disseny resol les dues coses reutilitzant patrons que el projecte ja domina (cuaderno de proyecto de GPE, doble edició `[modo]` alumno/profesor, components de diagrama).

## Principi rector: plantilles VISUALS, no taules de text

El cor d'aquest treball. Cada fase treballa una eina d'emprenedoria que **ja tenim com a component de diagrama**, i la fa servir en dues versions:

- **Versió plena (exemple)** — l'eina amb contingut real (els «ejemplos con chispa»), per ensenyar com és.
- **Versió buida (plantilla)** — la mateixa graella/gràfica **en blanc, amb espai per escriure**, que va al quadern de l'alumne.

Components de diagrama existents a reutilitzar/adaptar: `CanvasBM` (BMC), `MarketingMix4P` (4P), `PuntoMuerto`/`BreakEvenChart` (punt mort), `EmpathyMap`, `DoubleDiamond` (design thinking), `DAFO`, `PitchDeck10Slides`. Per a les plantilles buides es crea, per a cada eina, una variant **«plantilla»** (mateix llenguatge visual, cel·les buides retolades amb prou espai per omplir a mà). Aquestes plantilles es renderitzen **igual al web i al PDF del quadern**.

## 1. Un sol projecte (reorganització del hub)

- El hub `/emprendimiento/` lidera amb **«De cero a empresa»** com l'experiència central, amb la descàrrega del **quadern** ben visible.
- Les eines es **teixeixen dins les fases** (no targetes soltes):
  - **Ejemplos con chispa** → Fase 3 (Modelo de negocio): espills per omplir el BMC/4P propi.
  - **Entrevista a emprendedores** → Fase 4 (Valida): l'activitat d'eixir al carrer.
  - **Kit de actitud** → repartit a les primeres fases (Detecta, Idea/equip, Valida) com a escalfament.
- Les galeries d'ejemplos/kit/entrevista **es conserven com a pàgines de referència** (no s'esborra contingut), però el hub ja no les presenta com a peces independents.

## 2. El quadern de l'alumne (la peça que falta)

- **PDF descarregable, doble edició** (`alumno` en blanc / `profesor` amb orientació i criteris), seguint el patró `[modo]` dels cuadernos d'exercicis.
- **Una full de treball per fase**, amb estructura uniforme:
  1. **El repte** de la fase (1-2 frases) i la tasca «manos a la obra».
  2. La **plantilla visual per omplir** (la peça clau — vegeu la taula).
  3. Una **mini-reflexió d'equip** (2-3 línies).
- **Portada d'equip** (nom del projecte, integrants, curs) + **índex de fases**.
- Accent **mostassa** `#D4A24C` (color d'emprenedoria) a portada i capçaleres.
- L'edició **profesor** afig, a cada fase, una caixa d'**orientación docente** (què mirar, errors típics, criteris) — no apareix a l'edició alumno.

### Plantilla visual per fase

| Fase | Plantilla visual (en blanc, per omplir) |
|---|---|
| F1 · Detecta | Mapa de problemas del entorno (graella/quadrants) + problema elegit i justificació |
| F2 · Idea y equipo | Roles del equipo (graella) + idees generades + idea triada |
| F3 · Modelo de negocio | **Lienzo Business Model Canvas (9 blocs) en blanc** (o 4P) — amb un «ejemplo con chispa» al costat com a espill |
| F4 · Valida | Guió d'entrevista + **registro de validación** (taula visual) + aprendizajes |
| F5 · Marketing | 4P o **embut de captació** + público/mensaje/canales + 1 acció |
| F6 · Operaciones | Diagrama de **procesos clave** (flux) a completar |
| F7 · Personas y equipo | Roles + normas de equipo (graella) |
| F8 · Financiación | Necesidades vs fuentes (graella) |
| F9 · Números y viabilidad | **Gráfica del punto muerto** (eixos, línies a traçar) + fórmula + costes fijos/variables/precio |
| F10 · Estrés-test | Riesgos i pla B (graella de probabilitat/impacte) |
| F11 · Pitch y dossier | **Estructura del pitch** (guió visual de 8-10 punts) + checklist |
| ★99 · Lanza valiente | Registro de ventas reales (taula) + aprendizajes |

## 3. Arquitectura tècnica

- **Single source per fase via frontmatter estructurat**: cada fitxer de fase (`src/content/emprendimiento/proyecto/*.mdx`) afig un objecte `cuaderno` al frontmatter amb camps renderitzables **tant al web com al PDF**:
  - `tarea` (string: la consigna «manos a la obra», admet èmfasi simple)
  - `plantilla` (clau del component de plantilla visual, p. ex. `'canvas-bm'`, `'punto-muerto'`, `'4p'`, `'procesos'`, `'pitch'`, `'tabla'`…)
  - `reflexion` (string: la consigna de la mini-reflexió d'equip)
  - `orientacion_docente` (string: només es renderitza a `modo === 'profesor'`)
  Així la **font és única** (el camp `cuaderno` de la fase) i la rendereixen igual: (a) la pàgina web de la fase (component `BloqueCuaderno`) i (b) la ruta del PDF del quadern. El cos MDX de la fase segueix sent la guia del professor; les eines teixides (ejemplo/entrevista/kit) s'insereixen al cos amb els seus components.
- **Components de plantilla**: per cada eina visual, una variant «plantilla» buida a `src/components/emprendimiento/plantillas/` (p. ex. `PlantillaCanvasBM.astro`, `PlantillaPuntoMuerto.astro`, `Plantilla4P.astro`, `PlantillaProcesos.astro`, `PlantillaPitch.astro`…), reutilitzant el llenguatge visual dels diagrames existents. Es renderitzen al web i al PDF.
- **Ruta nova** `/emprendimiento/proyecto/cuaderno/imprimir/[modo]` (paged.js, `noindex`, `@page` A4) que compila portada + índex + una full per fase amb la seua plantilla, condicionant el bloc d'orientació docent a `modo === 'profesor'`.
- **Script** `scripts/build-cuaderno-pdf.mjs` (calc de `build-proyecto-transversal-pdf.mjs`/`build-workbook-pdf.mjs`) → `public/downloads/emprendimiento-cuaderno-alumno.pdf` i `…-profesor.pdf`. Afegit a `build:all`.
- **Hub del projecte** (`/emprendimiento/proyecto/`): botó de descàrrega del quadern (alumno/profesor), a més del PDF de guia ja existent.

## Criteris d'èxit

1. El hub d'emprenedoria es llig com **un sol projecte**; ejemplos/kit/entrevista apareixen **dins** la fase que els fa servir.
2. Existeix un **quadern de l'alumne** descarregable (PDF) amb una full per fase, **plantilles visuals en blanc**, doble edició alumno/profesor.
3. Les eines clau (BMC, punt mort, 4P, pitch…) apareixen **gràficament** (com el llenç/gràfica real), tant plenes (exemple) com buides (plantilla).
4. `astro build` verd; els dos PDF es generen; les plantilles caben i s'imprimeixen bé (sense overflow).
5. Single-source: el contingut viu a les fases; el web i el PDF deriven de la mateixa font.

## Fora d'abast (explícit)

- **Versió web interactiva** del quadern (omplir online): NO (Pau va triar PDF imprimible). Es pot valorar fase 2+.
- No s'esborren les galeries d'ejemplos/kit/entrevista (es conserven com a referència).
- No es toquen altres seccions ni el GPE (que ja té el seu cuaderno de proyecto).

## Implementació per etapes

Feature gran; s'implementa en dues etapes perquè cada una done valor sola:

- **Etapa A — El quadern visual** (el que Pau troba a faltar): components de plantilla buida + tasca de l'alumne a cada fase + ruta `cuaderno/imprimir/[modo]` + build script + doble PDF + botó al hub.
- **Etapa B — El teixit fi**: integrar ejemplos (F3), entrevista (F4) i kit (primeres fases) dins les fases i reorganitzar el hub perquè es llija com un sol projecte.
