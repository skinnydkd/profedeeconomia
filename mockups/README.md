# Mockups visuales · profedeeconomia.es

Cinco páginas en **tres variantes estéticas**, en HTML+CSS puros. Sirven para
validar la dirección visual antes de comprometernos con código de producción
(Astro, Tailwind, etc.).

> Variant C añadida en una segunda iteración, después de que A y B se
> percibieran como demasiado serias. C recupera la energía cromática del
> webpde actual sin reincidir en el rosa Tailwind ni en la mascota cerdo.

## Cómo abrir

Abrir `compare.html` directamente en el navegador (doble clic). Carga las dos
variantes lado a lado y permite cambiar entre las cinco páginas con la barra de
herramientas superior.

> Las tipografías se cargan vía Google Fonts (Source Serif 4, JetBrains Mono,
> Newsreader, IBM Plex Mono) y Fontshare (General Sans, Switzer). Hace falta
> conexión a Internet la primera vez para verlas correctamente; sin conexión
> cae a los fallbacks del sistema.

## Estructura

```
mockups/
├── README.md                 — este fichero
├── compare.html              — comparativa con iframes, selector de página y selector de variante por panel
├── variant-a/                — Editorial puro (Princeton Press / Stripe Press)
│   ├── style.css
│   └── 5 páginas
├── variant-b/                — Editorial cálido (Stratechery / Increment / A Book Apart)
│   ├── style.css
│   └── 5 páginas
└── variant-c/                — Editorial con energía (Apartamento / MUBI Notebook / Magma Books)
    ├── style.css
    └── 5 páginas
```

`compare.html` permite elegir qué variante se muestra en cada panel (izquierda
y derecha), por lo que se puede comparar A vs B, A vs C, o B vs C según
convenga.

## Las cinco páginas

| Página         | Por qué está | Qué demuestra |
|---|---|---|
| **Home**          | Es la cara del sitio. | Cómo se presentan las 4 asignaturas como producto vertical y cómo viven las secciones transversales sin competir con ellas. |
| **Hub asignatura** | Cada asignatura es un producto en sí. | Estructura interna idéntica para las 4 asignaturas: 5 sub‑apartados (libro, diapos, actividades, tests, recursos). Aquí: EDMN 2BACH. |
| **Unidad 1**      | Es la pieza más leída. | Composición editorial larga: índice lateral, tipografía de lectura, callouts, tablas, bibliografía, navegación entre unidades. Contenido real del bloque A.1 + A.2 del RD 243/2022. |
| **Listado de juegos** | Material transversal. | Cómo se trata `/juegos/` sin caer en estética de videojuego. |
| **Stonks**         | Página de un juego. | Cómo se presenta una pieza interactiva con su CTA, su contexto pedagógico y su recomendación curricular. |

## Las dos variantes

### Variant A — Editorial puro

- **Paleta**: off‑white `#FAFAF7` / negro `#1A1A1A` / vermell barroc `#722F37`.
- **Tipografía**: Source Serif 4 (títulos) + General Sans (cuerpo) + JetBrains Mono.
- **Textura**: bordes finos, retícula visible, sin sombras, sin tarjetas con elevación. Capital letter al inicio de la unidad. Botón CTA negro sobre off‑white.
- **Tono**: ligeramente más formal. Inspiración: Princeton University Press, Stripe Press.

### Variant B — Editorial cálido

- **Paleta**: off‑white `#FAFAF7` / negro `#1F1D1A` / verde musgo `#5B6C44` + tierra cálido `#C19A6B`.
- **Tipografía**: Newsreader (títulos, más carácter) + Switzer (cuerpo) + IBM Plex Mono.
- **Textura**: tarjetas con borde y sombra muy sutil, bullets como puntos terra, callouts con fondo de color, dashes en bordes secundarios. Capital letter en verde, drop shadow ligero en la barra de meta.
- **Tono**: más conversacional. Inspiración: Stratechery, Increment Magazine, A Book Apart.

### Variant C — Editorial con energía

- **Paleta**: cream cálido `#FBF6EC` / marrón profundo `#2A1F18` / **terracota** `#C44E2C` (acento principal) + **mostaza** `#D4A24C` (acento decorativo) + **teal** `#1F6E6E` y **berenjena** `#5B3A4E` (color‑coding por asignatura).
- **Tipografía**: Fraunces (títulos, *variable* con eje SOFT/WONK que da personalidad sin perder seriedad) + Switzer (cuerpo) + JetBrains Mono.
- **Textura**: cada asignatura tiene un color distintivo en la home (tira superior de la card, pill del nivel, número italian-style, color del acento). Hero con gradientes radiales muy suaves de acentos, asterisco decorativo. Drop cap terracota, callouts de fondo terracota o mostaza según tipo, listas con bullets mostaza. Botón CTA terracota redondeado tipo pill. Algunas reglas dashed en mostaza.
- **Tono**: el más cálido, recupera la energía del webpde actual con paleta otoñal en lugar del rosa Tailwind. Inspiración: Apartamento Magazine, MUBI Notebook, Magma Books.

Las tres comparten: serif en títulos, sans humanística en cuerpo, espacio
blanco generoso, una sola columna para contenido largo, **sin emojis como
icono, sin gradientes chillones, sin mascota**. La dirección editorial es la
misma; lo que cambia es el **carácter** y la **temperatura cromática**.

## Cómo decidir

1. Abrir `compare.html`.
2. Empezar por la página **Unidad 1**: es la pieza con más texto y donde más se
   nota el sistema tipográfico. Si una de las dos no funciona aquí, no
   funciona.
3. Continuar con la **Home**: jerarquía y primer impacto.
4. Comprobar los **juegos**: la única página donde la estética puede tropezar
   si no se trabaja con cuidado.

## Constraints técnicos

- HTML+CSS puros. Cero JavaScript fuera del selector de página de
  `compare.html`.
- Una sola hoja de estilos compartida por variante (`variant-?/style.css`).
- Responsive móvil‑first. Probado en anchos 360, 768, 1100, 1440.
- Sin Astro, Tailwind, Vite, ni build de ningún tipo. Esto no es producción —
  es una validación visual.

## Lo que aún no está

- Versión oscura (la decisión de si tenerla o no se toma después).
- Estados de hover ricos / animaciones (este nivel de detalle se trabaja en la
  fase de implementación).
- Iconografía SVG personalizada (Variant B usa solo dots y blocks — los iconos
  reales se diseñan en fase de producción).

## Siguiente sesión

Una vez Pau haya elegido (o pedido una variante C), se procede al setup
técnico: Astro 5 + Preact + Tailwind + i18n + Content Collections + estructura
de las 4 asignaturas. Esa es otra sesión.
