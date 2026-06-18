# Carátulas de los juegos — diseño

- **Fecha**: 2026-06-18
- **Sección**: `/juegos/` (hub transversal)
- **Estado**: validado, pendiente de plan de implementación
- **Mockup de referencia**: `mockups/juegos-caratulas/index.html` (dirección A elegida)

## Problema

El hub `/juegos/` muestra cada juego como una tarjeta de **solo texto** (epígrafe,
título, descripción, nota, meta, CTA). No hay identidad visual: los seis juegos se
parecen y el hub se ve plano. El factor diferenciador del proyecto es la estética, y
esta página no la aprovecha.

## Objetivo

Dar a cada juego una **identidad visual reconocible de un vistazo** mediante una
carátula propia, manteniendo el marco editorial sobrio del proyecto (Variant C).
La carátula **identifica** el juego; no pretende explicar de qué va.

No-objetivos:

- No tocar las páginas internas de cada juego en esta tanda (el componente queda listo
  para reutilizarse allí más adelante).
- No añadir ilustración de stock, mascotas, emojis ni gradientes (prohibidos por CLAUDE.md).
- No introducir imágenes raster: todo es SVG/CSS, cero peso de descarga extra.

## Dirección visual elegida — «Plancha geométrica» (A)

Cada tarjeta gana una **banda superior de color macizo** (el color de identidad del
juego) con un **motivo geométrico abstracto único**, trazado en crema (`#FBF6EC`).
Lenguaje Bauhaus / Swiss editorial (Pelican, MUBI Notebook, Magma). El cuerpo de texto
actual de la tarjeta se conserva debajo, sin cambios de contenido.

Se descartaron:

- **B (cubierta tipográfica)**: el título se duplicaría (grande en la portada y otra vez
  en el cuerpo de la tarjeta).
- **C (híbrida con índice)**: válida pero más contenida; menos energía visual de la que
  pide la dirección «editorial con energía».

### Motivos por juego

Abstractos pero asociables a cada juego. Trazados en crema sobre el color de identidad:

| Juego       | Color de identidad        | Motivo                                                |
|-------------|---------------------------|-------------------------------------------------------|
| Stonks      | teal `#1F6E6E`            | línea de mercado ascendente escalonada + vértices     |
| Econrisk    | terracota `#C44E2C`       | teselado de triángulos (territorios), alguno relleno  |
| Econopoly   | mostaza `#D4A24C`         | espiral cuadrada (tablero) con un nodo marcado        |
| Cajút       | berenjena `#5B3A4E`       | arcos concéntricos de señal (buzz del quiz)           |
| Asegurados  | verde pino `#2E5E3A`      | cúpula/arco que cobija unos puntos (cobertura)        |
| Insider     | granate `#8C2F39`         | retícula de puntos con uno señalado (el oculto)       |

Todos los colores pertenecen a la paleta validada (Variant C / per-asignatura). Cada
juego mantiene su color de identidad estable; es su «sello de colección».

## Decisión de color: la identidad vive en la plancha

El color de identidad se usa **solo en la plancha** (elemento decorativo). El cuerpo de
la tarjeta conserva los colores **funcionales** del design system: la terracota para el
epígrafe y el CTA (`Jugar →`), porque CLAUDE.md fija *terracota = color funcional de
links y CTAs*.

Motivos:

1. **Marca**: respeta la regla del design system.
2. **Accesibilidad**: evita texto pequeño en colores que no cumplen AA sobre blanco (la
   mostaza `#D4A24C` falla AA como texto). La distinción entre juegos la hace la plancha,
   no el texto.

Queda descartado teñir epígrafe/CTA con el color de cada juego.

## Arquitectura

### Datos — `src/lib/juegos.ts`

Añadir un campo a la interfaz `Juego`:

```ts
/** Identity colour of the game, used for its cover plate on the hub. Hex from the
 *  validated palette. Single source of truth for the carátula. */
color: string;
```

Rellenar `color` en los 6 juegos según la tabla anterior. Es la SSOT: el hub y, más
adelante, la página individual leen de aquí.

### Registro de motivos — `src/components/juegos/caratula-motifs.ts`

Módulo TypeScript (importable desde el componente **y** desde el test):

- `MOTIFS: Record<string, string>` — mapa `slug → markup SVG interno` (los `<path>`,
  `<polyline>`, etc., sin el `<svg>` envolvente). Crema `#FBF6EC` como trazo.
- `FALLBACK_MOTIF: string` — motivo neutro para slugs sin entrada propia.
- `MOTIF_SLUGS: Set<string>` — claves de `MOTIFS`, para el test de integridad.
- `getMotif(slug): string` — devuelve `MOTIFS[slug] ?? FALLBACK_MOTIF`.

Los motivos SVG se portan tal cual desde el mockup validado (función `motif()` de
`mockups/juegos-caratulas/index.html`).

### Componente — `src/components/juegos/JuegoCaratula.astro`

- **Props**: `slug: string`, `color: string`.
- **Responsabilidad única**: renderizar `<div class="caratula">` con fondo `color` y, dentro,
  un `<svg viewBox="0 0 320 132">` cuyo interior es `getMotif(slug)` inyectado con
  `set:html` (contenido propio y estático: sin riesgo de XSS).
- El SVG es **decorativo**: `aria-hidden="true"` y `role="presentation"`. No lleva `alt`
  ni texto; el título accesible ya está en el cuerpo de la tarjeta.
- `aspect-ratio: 320 / 132`; el SVG ocupa el 100 % del contenedor.

### Hub — `src/pages/juegos/index.astro`

- Incrustar `<JuegoCaratula slug={j.slug} color={j.color} />` como primer hijo de cada
  `.game-card`, antes del cuerpo de texto.
- Reestructurar la tarjeta en dos zonas: **plancha** (la carátula) + **cuerpo** (el texto
  actual, envuelto en `.gc-body`).
- Eliminar el truco de `border-top` de color (terracota / berenjena para party): ahora la
  plancha porta el color. El epígrafe y el CTA vuelven a la terracota funcional para todos.
- Mantener `gc-eyebrow`, `gc-title`, `gc-desc`, `gc-note`, `gc-meta`, `gc-cta` y la lista
  de imprimibles sin cambios de contenido.
- Hover: elevación sutil (sombra + `translateY(-2px)`), coherente con el resto del sitio.

## Accesibilidad

- Plancha y SVG decorativos (`aria-hidden`, `role="presentation"`): los lectores de
  pantalla los ignoran y solo anuncian el contenido textual de la tarjeta.
- Ningún texto se apoya sobre el color de la plancha → sin riesgo de contraste sobre el
  fondo de color.
- El contraste de texto del cuerpo no cambia respecto al estado actual (terracota / ink
  sobre blanco, ya en producción).

## Test

Guarda de integridad de datos (al estilo de `findBrokenJuegoRefs`), en
`src/components/juegos/caratula-motifs.test.ts` (importa `JUEGOS` de `src/lib/juegos.ts`
y `MOTIF_SLUGS`/`getMotif` del registro):

1. Todo juego de `JUEGOS` tiene `color` definido (string no vacío).
2. Los 6 juegos actuales de `JUEGOS` están todos en `MOTIF_SLUGS` (tienen motivo propio,
   no caen en el fallback).
3. `getMotif(slug)` devuelve markup no vacío para cada juego.

No se testea el render visual; el mockup ya validó la dirección.

## Alcance

- Los **6 juegos actuales** reciben color + motivo propio.
- Fallback listo para juegos futuros (`proximamente`: Playground, Communist), aún no en
  `JUEGOS`.
- Sin cambios en páginas internas de juegos ni en `/jocs-economics/`.

## Archivos afectados

| Archivo                                          | Cambio                                   |
|--------------------------------------------------|------------------------------------------|
| `src/lib/juegos.ts`                              | + campo `color` en interfaz y 6 juegos   |
| `src/components/juegos/caratula-motifs.ts`       | nuevo registro de motivos SVG + helpers  |
| `src/components/juegos/JuegoCaratula.astro`      | nuevo componente (plancha + `set:html`)  |
| `src/pages/juegos/index.astro`                   | integrar carátula + ajustar CSS tarjeta  |
| `src/components/juegos/caratula-motifs.test.ts`  | nuevo test de integridad                 |

## Criterios de éxito

- Los 6 juegos del hub muestran una carátula con su color y motivo propios.
- `npm run build` pasa; el test de integridad pasa.
- Sin emojis, mascotas, stock ni gradientes. Sin imágenes raster nuevas.
- Lectores de pantalla anuncian solo el texto de cada tarjeta, no la plancha.
