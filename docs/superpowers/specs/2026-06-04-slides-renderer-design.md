# Spec — Renderitzador de diapositives distintives (Astro natiu)

- **Data**: 2026-06-04
- **Autor**: Pau Monterde (profedeeconomia.es)
- **Estat**: en revisió
- **Tipus**: re-plataforma del sistema de diapositives (substitueix el pipeline Marp)

## 1. Objetivo

Que las diapositivas de cada unidad sean **realmente distintivas** —no genéricas ni mecánicas— mediante
un **renderizador Astro nativo** que lee el mismo MDX del libro (single source) y produce decks
art-directed con una identidad de casa reconocible. Sustituye el pipeline Marp actual, que es rígido
(markdown) y produce decks mecánicos y densos (1 componente MDX → 1 slide, 40–70 slides/unidad).

## 2. Decisiones (acordadas en brainstorming)

- **Motor**: **renderizador Astro nativo** (NO Marp, NO Slidev). Cada deck es una página Astro generada
  desde el MDX, que **reutiliza los 59 componentes de diagrama reales** (en vivo, sin capturas Puppeteer)
  y los tokens de `src/styles/global.css`.
- **Identidad = mezcla de 3 registros** unidos por un ADN común (house style):
  - *Editorial* — ideas, portadas, citas: Fraunces grande, mucho aire, frase-ancla en cursiva.
  - *Diagrama protagonista* — conceptos económicos: el diagrama real a gran tamaño, texto mínimo.
  - *Dato audaz* — números/fórmulas clave: panel de color, número gigante.
- **ADN de marca**: fondo crema `#FBF6EC`, Fraunces + Switzer + JetBrains Mono, acentos terracota
  `#C44E2C` / mostaza `#D4A24C`, **numeración §**, **motivo de esquina** (curva FPP), pie
  `profedeeconomia.es`. Color por asignatura en los acentos.
- **Densidad = deck de presentación ajustado**: **~18–28 slides/unidad**, una idea por slide. El
  detalle lo lleva el libro (ya autosuficiente con calculadoras y cajón de recursos).
- **Regla dura — robustez de maquetación**: cajas 16:9 fijas, contenido dimensionado para caber,
  **ninguna slide desborda ni se solapa** nunca. Guarda de overflow verificable.
- **Salidas**: deck web interactivo en ruta Astro + **PDF** (imprimiendo esa ruta con el Puppeteer
  que ya existe en el pipeline).
- **Despliegue por fases**: 1 unidad piloto → libro EDMN completo → 8 asignaturas restantes.

## 3. Arquitectura

### 3.1 Modelo de datos del deck
Un deck = lista ordenada de **slides tipados**. Cada slide:
```ts
type Slide =
  | { tipo: 'cover'; eyebrow; title; subtitle?; asignaturaColor }
  | { tipo: 'concept'; eyebrow?; title; body?; pull? }
  | { tipo: 'diagram'; eyebrow?; title?; componente: string; caption? }  // componente = nombre del diagrama Astro
  | { tipo: 'data'; numero; label; title?; detalle? }
  | { tipo: 'quote'; texto; fuente? }
  | { tipo: 'exercise'; title; enunciado; pasos?: string[] }
  | { tipo: 'close'; title; nota? };
type Deck = { asignatura; unidad; title; slides: Slide[] };
```

### 3.2 Deck builder (`src/lib/slides/`)
- Reutiliza la lógica de extracción AST ya existente en `scripts/` (unified + remark-mdx) para recorrer
  el MDX, pero en vez de emitir markdown Marp **mapea cada bloque a un `Slide` tipado** (§3.4).
- Pieza pura y testeable: `buildDeck(mdxAst, frontmatter): Deck`. Sin dependencias de Astro → unit-test.
- Aplica la filosofía ajustada: agrupa/condensa para mantener ~18–28 slides (no 1:1 por componente);
  p. ej. objetivos + conceptos_clave caben en pocas slides, no una por viñeta.

### 3.3 Renderizado (componentes + ruta)
- Componentes-arquetipo en `src/components/slides/`: `SlideCover.astro`, `SlideConcept.astro`,
  `SlideDiagram.astro` (monta el diagrama real por nombre, como `HerramientaIsland` despacha calculadoras),
  `SlideData.astro`, `SlideQuote.astro`, `SlideExercise.astro`, `SlideClose.astro`. Cada uno = una caja
  16:9 con el house style y guardas de overflow.
- Ruta de deck: `src/pages/[asignatura]/diapositivas/[unidad].astro` — construye el `Deck` y renderiza
  las slides en secuencia (navegable en web: teclado/scroll). El índice `/[asignatura]/diapositivas/`
  ya existe y enlazará aquí + al PDF.
- **House style**: hoja `src/styles/slides.css` que extiende los tokens de `global.css` con la rejilla de
  slide, tipografía a escala de proyección, footer/§/motivo, y los acentos por asignatura.

### 3.4 Mapeo MDX → arquetipo (automático + overrides)
| Bloque MDX | Arquetipo por defecto |
|---|---|
| frontmatter (título, lema) | `cover` |
| `TldrUnidad` | `quote` / `concept` |
| `CasoDilema` | `concept` (con pregunta-ancla) |
| `## H2` | `cover` de sección |
| párrafos + `### H3` | `concept` (condensado) |
| `Diagram` / `Figure` / componente de diagrama | `diagram` |
| `SolvedExercise` | `exercise` |
| `Curiosity` / `RealExample` | `concept` |
| dato/fórmula destacable | `data` (heurística o override) |
| cierre de unidad | `close` |
- **Overrides opcionales**: un atributo ligero en el MDX (p. ej. `<Diagram slide="hero">` o un comentario
  de directiva) para forzar registro o saltar un bloque. Sin ensuciar el contenido; el MDX sigue siendo
  el single source y se renderiza igual en el libro.

### 3.5 PDF
- Script `scripts/build-slides.mjs` (reescrito): levanta Astro preview, y con Puppeteer (ya usado en
  `capture-diagrams.mjs`) imprime cada ruta de deck a `public/slides/<asignatura>/<unidad>.pdf` con
  `@media print` (una slide por página A-landscape). Sustituye la invocación a marp-cli.

### 3.6 Migración del pipeline Marp
- El pipeline Marp (`scripts/extract-slides.mjs`, `build-slides.mjs`, `slide-parsers/`, `marp-themes/`)
  se mantiene operativo hasta que el nuevo motor alcance paridad en el libro EDMN. Tras validar EDMN,
  se deprecia y elimina en la fase final. Los PDFs en `public/slides/` se regeneran con el nuevo motor.

## 4. Fases

1. **Motor + house style + 1 unidad piloto**: deck builder, arquetipos, `slides.css`, ruta de deck y
   export PDF, regenerando la unidad del **punto muerto de EDMN 2BACH**. Validación visual con Pau.
2. **Libro EDMN completo** (12 unidades) con el nuevo motor.
3. **8 asignaturas restantes**. Deprecación del pipeline Marp.

## 5. Testing / verificación

- `src/lib/slides/build-deck.test.ts`: dado un MDX de muestra, `buildDeck` produce los arquetipos
  esperados, respeta overrides, y mantiene el conteo en el rango ~18–28.
- **Guarda de overflow**: comprobación automática (Puppeteer mide `scrollHeight`/`scrollWidth` de cada
  slide vs la caja 16:9; falla si algo desborda). Corre en el build de slides.
- `astro build` verde con la ruta de deck. Revisión visual por fase antes de consolidar.

## 6. Riesgos

- **Overflow con contenido variable**: mitigado por densidad ajustada (1 idea/slide) + guarda automática
  + texto con `clamp()`/ajuste; si una slide no cabe, el builder la divide o se marca para revisión.
- **Paridad PDF**: validar que el PDF Astro iguala o supera al de Marp (fuentes embebidas, vectores nítidos).
- **Cambio de motor grande**: mitigado con piloto → 1 libro → resto.
- **Diagramas en vivo**: algunos diagramas Astro pueden necesitar ajuste de escala para proyección.

## 7. Fuera de alcance

- Tocar el contenido de los libros (el MDX no se reescribe; solo overrides ligeros opcionales).
- PPTX editable (futuro premium).
- Traducción ca/val de las slides.
