# Spec — Sección «Olimpiada de Economía» (preparación)

- **Fecha**: 2026-06-03
- **Autor**: Pau Monterde (profedeeconomia.es)
- **Estado del spec**: en revisión
- **Tipo**: nueva sección (mini-suite de preparación) posicionada en Bachillerato

## 1. Objetivo

Una sección **`/olimpiada/`** para **preparar la Olimpiada de Economía** (la competición real
para 2º de Bachillerato, no el juego «Jocs Econòmics»). Basada en exámenes oficiales de la
Fase Local de la Comunitat Valenciana y en el material de práctica del profesor. **Nivel:
2º Bach «plus» / 1.º de carrera** (exigente, por encima del bachillerato estándar).

Formato oficial CV (de los exámenes): 3 partes, 8 puntos, 2h30, **sin test**:
Parte I (desarrollo, elegir 3 de 6), Parte II (ejercicio numérico, elegir 1 de 2; punto muerto
casi siempre), Parte III (comentario de texto de prensa). Temario = Economía 1BACH + EDMN 2BACH.

## 2. Decisiones de alcance (acordadas en brainstorming)

- **Nombre**: «Olimpiada de Economía», slug **`/olimpiada/`**. Distinta de «Jocs Econòmics».
- **Posicionamiento = dentro de Bachillerato** (NO en «Otros», NO en la franja transversal de
  la home). Para respetar la regla de estructura interna idéntica entre asignaturas, NO se
  cuelga como subsección de una sola asignatura: es una **sección propia** con rutas `/olimpiada/`,
  pero **se enlaza desde el desplegable BACH del menú** y desde los hubs de EDMN 2BACH y Eco 1BACH.
- **5 sub-áreas**: guía/hub, simulacros, fichas-resumen, banco de preguntas, taller de texto +
  lecturas.
- **Entrega = marco + núcleo de cada parte** y, tras el merge, **fases de expansión** hasta
  desarrollar las secciones por completo (no quedarse en el núcleo).

## 3. Arquitectura

### 3.1 Rutas (sección standalone `/olimpiada/`)
- `/olimpiada/` — **hub + guía «Cómo es el examen»** (las 3 partes, duración, puntuación, qué se
  elige, consejos) + tarjetas a las sub-áreas.
- `/olimpiada/simulacros/` — los **3 exámenes oficiales** (PDF en `public/olimpiada/`, ver y
  descargar) + cómo usarlos. (El MEGAEXAMEN como práctica extra.)
- `/olimpiada/fichas/` + `/olimpiada/fichas/[slug]/` — **fichas-resumen** por bloque (colección MDX).
- `/olimpiada/banco/` — **banco de preguntas** interactivo por bloque (isla reusando `QuizPlayer`).
- `/olimpiada/textos/` + `/olimpiada/textos/[slug]/` — **taller de comentario de texto** (colección MDX).
- `/olimpiada/lecturas/` — **lecturas y recursos** recomendados (de RECOMENDACIONES).

### 3.2 Librería (`src/lib/olimpiada.ts`)
- `BLOQUES`: los bloques temáticos `{slug, label, intro, colorVar}` (reusa `familia-grouping`
  para agrupar fichas/preguntas por bloque). Colores reutilizados de la paleta.
- `SIMULACROS`: lista `{slug, title, anio, convocatoria, pdf}` (los 3 exámenes + megaexamen).
- `LECTURAS`: la lista curada `{categoria, titulo, autor, comentario, enlace?}`.
- `SUBAREAS`: tarjetas del hub.
- `GUIA`: estructura de la guía (partes, tiempos, puntos) para renderizar la landing.

### 3.3 Banco de preguntas (`src/lib/olimpiada/banco.ts` o JSON)
Array de preguntas `{ id, bloque, nivel, enunciado, opciones[], correcta, explicacion }`
(extraídas del MEGAEXAMEN). La página `/olimpiada/banco/` deja elegir bloque y lanza
`QuizPlayer` con esas preguntas. (Verificar la interfaz de `QuizPlayer.tsx` al implementar y
adaptar los datos a su forma; si no encaja, una isla `BancoQuiz.tsx` mínima propia.)

### 3.4 Colecciones (`src/content.config.ts`)
- `olimpiadaFichas` (glob `olimpiada/fichas/**/*.{md,mdx}`): schema `{ title, bloque (enum
  BLOQUE_SLUGS), orden, resumen, conceptos_clave[], herramienta? (componente de calculadora a
  embeber), preguntas_tipicas[], competencias_clave[], lang, estado }`. Cuerpo MDX = el resumen
  rigueroso + gráfico canónico + relaciones.
- `olimpiadaTextos` (glob `olimpiada/textos/**/*.{md,mdx}`): schema `{ title, fuente, fecha,
  temas[], bloque?, descripcion, orden, lang, estado }`. Cuerpo = el texto + preguntas + (opcional)
  pauta de respuesta.

### 3.5 Componentes (`src/components/olimpiada/`)
- `GuiaExamen.astro` — render de la guía «Cómo es el examen».
- `FichaMeta.astro`, `SimulacroCard.astro`, `LecturaList.astro`, `BancoBloque` (isla con QuizPlayer).
- **Reutiliza**: las calculadoras `@components/calculadoras/{PuntoMuertoCalc, EquilibrioCalc,
  ElasticidadCalc, ADASSimulator}` embebidas en las fichas relevantes (vía `HerramientaIsland`
  o import directo); `familia-grouping`; `QuizPlayer`.
- **Gráficos canónicos**: usar la skill **econ-graphs** para generar los SVG de cada ficha
  (FPP, O&D, punto muerto IT/CT, AD-AS), o incrustar la calculadora interactiva ya existente.

### 3.6 Navegación (dentro de BACH)
- `src/components/SiteHeader.astro`: en el desplegable **BACH** (tras las asignaturas de 1.º/2.º),
  añadir un enlace destacado «Olimpiada de Economía» → `/olimpiada/`.
- En los hubs de EDMN 2BACH y Eco 1BACH (`/[asignatura]/index` o donde liste secciones), añadir
  una tarjeta/enlace a `/olimpiada/`.
- NO se añade a `SECCIONES_TRANSVERSALES` ni a la franja transversal de la home.

### 3.7 Bloques temáticos
Frontera de posibilidades (FPP) · Oferta, demanda, equilibrio y elasticidad · Estructuras de
mercado · Producción y costes: el punto muerto · Macroeconomía (PIB, inflación, ciclo) ·
Política monetaria y fiscal · Mercado de trabajo · Sistema financiero · Comercio internacional ·
Economía de la empresa (formas jurídicas, organización, crecimiento, marketing) · Contabilidad
y análisis financiero · Fallos de mercado e intervención del Estado.

## 4. Alcance v1 (marco + núcleo) vs expansión

**v1 (este primer deliverable + merge):**
- Guía «Cómo es el examen» completa (hub).
- Simulacros: los **3 PDFs oficiales** servidos + página.
- Fichas: los **6 bloques núcleo** (FPP, O&D+elasticidad, Punto muerto, Política monetaria/fiscal,
  Mercado de trabajo, Contabilidad/rentabilidad), cada una con gráfico canónico y la calculadora
  embebida cuando aplique.
- Banco: **~10-15 preguntas por bloque núcleo** (starter del MEGAEXAMEN), por bloque.
- Textos: **1-2 textos trabajados** (p. ej. el caso SVB y un texto de prensa) + la guía del taller.
- Lecturas: la **lista completa** de RECOMENDACIONES con comentario.

**Expansión (fases posteriores, tras el merge de v1 — Pau pidió desarrollar las secciones por
completo, no quedarse en el núcleo):**
- Fichas para **todos** los bloques restantes.
- Banco ampliado (más preguntas por bloque, todos los bloques).
- Más textos trabajados (varias convocatorias / temas de actualidad).
- (Opcional) simulacros nuevos generados.

## 5. Testing
- `src/lib/olimpiada.test.ts` — BLOQUES bien formados (slugs, colorVar), SIMULACROS, LECTURAS,
  helpers de agrupación.
- `src/lib/olimpiada/banco.test.ts` — cada pregunta tiene `correcta` válida dentro de `opciones`,
  `bloque` válido; conteo por bloque.
- `src/lib/asignaturas.test.ts` no cambia (no entra en «Otros»).
- `astro build` completo verde: hub, simulacros, fichas, banco, textos, lecturas prerenderizan;
  los PDFs se sirven desde `public/olimpiada/`.

## 6. Fuera de alcance
- Corrección automática / login / progreso del alumno (solo material estático + quiz cliente).
- Generar exámenes nuevos automáticamente (los simulacros v1 son los 3 oficiales).
- Traducción ca/val.

## 7. Riesgos
- **Volumen de contenido**: mitigado con v1 = núcleo y expansión por fases.
- **Precisión (nivel 2BACH+)**: cada ficha/pregunta/texto pasa revisión de calidad (economía
  correcta, sin estadísticas inventadas, gráficos canónicos correctos).
- **Reuso de QuizPlayer**: verificar su interfaz; si no encaja, isla mínima propia. Sin acoplar.
- **PDFs de simulacros**: se copian a `public/olimpiada/`; verificar que se sirven (200) tras build.
- **Build-break**: rutas `[slug]` de un nivel; sin `.ts` sueltos bajo `src/pages/olimpiada/`.
