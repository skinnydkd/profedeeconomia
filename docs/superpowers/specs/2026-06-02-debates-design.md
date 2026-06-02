# Spec — Secció «Debates» (catálogo transversal de debates de aula)

- **Fecha**: 2026-06-02
- **Autor**: Pau Monterde (profedeeconomia.es)
- **Estado del spec**: en revisión
- **Tipo**: nueva sección transversal + content collection + pilot

## 1. Objetivo

Añadir una nueva sección transversal `/debates/` (dentro del menú «Otros», junto a
Juegos, Herramientas, Emprendimiento, Dinámicas y Jocs Econòmics) con un catálogo de
**debates de aula** estructurados, pensados para trabajar la argumentación y el
pensamiento crítico sobre las grandes controversias económicas.

Es una sección **propia e independiente** de Dinámicas (no una vista filtrada del
`tipo: 'debate'` que ya existe allí): el formato debate tiene una estructura propia
—moción, posturas enfrentadas, argumentario, mecánica de turnos y rúbrica— que
merece su propio modelo de contenido y sus propias páginas.

Cada debate trae:

- **Moción** (la afirmación/pregunta central) y **posturas** enfrentadas.
- **Argumentario por bando**: argumentos clave preparados, con evidencia/datos.
- **Mecánica y turnos**: formato, fases, tiempos y roles (moderador, portavoces, público).
- **Rúbrica de evaluación**: criterios ligados a competencias.
- Mapa de **encaje curricular**: en qué unidades de qué asignaturas encaja.
- **Competencias** (clave y específicas) que se trabajan.
- **Ficha de alumno imprimible** (moción, su postura, espacio para argumentos propios, rúbrica).

Es contenido **transversal y reutilizable**: el mismo debate sobre el salario mínimo
sirve para Eco 1BACH, FOPP, EEAE, IPE… No se duplica por asignatura.

## 2. Decisiones de alcance (acordadas en brainstorming)

- **Sección nueva e independiente** (colección, schema y páginas propias). NO se
  deriva del `tipo: 'debate'` de Dinámicas ni de la familia `sistemas-debates`.
- **Hub organizado por familia temática** (mismo patrón visual que Dinámicas).
- **Cuatro bloques de contenido por debate**: moción+posturas, argumentario por
  bando, mecánica/turnos, rúbrica.
- **Entrega = marco + 1 pilot completo y `publicado`**. El resto de contenido, después.
- **Versión imprimible** estilo «ficha de alumno» con aislamiento `@media print`,
  igual que Dinámicas.
- **Reparto frontmatter / cuerpo MDX (enfoque híbrido A)**: el frontmatter lleva lo
  consultable e imprimible (moción, posturas, rúbrica, unidades, competencias); el
  cuerpo MDX lleva el contenido rico (argumentario, guía de mecánica).

## 3. Arquitectura

Espejo de la sección Dinámicas, con un modelo de contenido propio del formato debate.

### 3.1 Modelo de contenido (frontmatter)

Colección `debates`, glob `debates/**/*.{md,mdx}` (base `./src/content`).
Ruta del fichero: `src/content/debates/{familia}/{nn}-{slug}.mdx`.

```ts
{
  title: string,
  mocion: string,                 // afirmación/pregunta central a debatir
  familia: enum(FAMILIA_DEBATE_SLUGS),
  orden: int >= 0,                // orden dentro de la familia (= prefijo del fichero)
  descripcion: string,            // one-liner para la card del hub
  formato: enum(['parlamentario', 'mesa-redonda', 'juicio-simulado',
                 'dilema-etico', 'fishbowl']),
  duracion: string,
  agrupacion: string,
  nivel: array(enum('eso','bach','fp')).min(1),
  objetivos: array(string).min(1),
  conceptos_clave: array(string).default([]),
  posturas: array({                // bandos enfrentados (>= 2)
    id: string,                    // 'a-favor' | 'en-contra' | ...
    label: string,
    sintesis: string,              // resumen de una línea de la postura
  }).min(2),
  unidades_relacionadas: array({   // mapa curricular transversal
    asignatura: enum(ASIGNATURA_SLUGS),
    unidad: int >= 1,
    nota: string?,
    competencias_especificas: array(string).default([]),
  }).default([]),
  competencias_clave: array(string).default([]),
  competencias_especificas: array(string).default([]),
  rubrica: array({                 // estructurada → ficha imprimible + competencias
    criterio: string,
    descripcion: string,
    competencia: string?,
  }).default([]),
  lang: enum(LANGS).default('es'),
  estado: enum(ESTADOS).default('borrador'),
}
```

En el **cuerpo MDX**:
- **Argumentario por bando** (`<Argumentario>`): argumentos clave por postura, con
  evidencia/datos. Prosa rica con enlaces y ejemplos.
- **Guía de mecánica/turnos** (`<Fases>` o prosa): cómo se desarrolla en clase,
  preparación y debrief.

### 3.2 Librería (`src/lib/debates.ts`)

- `FAMILIAS_DEBATE`: familias temáticas con `slug`, `label`, `intro` y `colorVar`
  (reutilizando tokens de color ya validados en `global.css`, **sin colores nuevos**).
- `familiaMeta(slug)`, `FAMILIA_DEBATE_SLUGS`.
- Agrupación y validación de referencias: se **extraen los helpers genéricos**
  `groupByFamilia` / `findBrokenUnidadRefs` / `FamiliaGroup` / `HasFamilia` (hoy en
  `src/lib/dinamicas.ts`) a un módulo compartido `src/lib/familia-grouping.ts`, y
  tanto Dinámicas como Debates lo importan. Refactor pequeño y justificado: evita
  duplicar la lógica. Dinámicas mantiene su comportamiento (tests existentes verdes).

### 3.3 Páginas

- `src/pages/debates/index.astro` — **hub**: familias en orden, cards por debate
  (moción, descripción, formato, nivel), color-coded por familia. Mismo patrón que
  el hub de Dinámicas.
- `src/pages/debates/[familia]/[slug].astro` — **detalle**: ruta de dos params (NO
  catch-all). Renderiza metadatos, posturas, argumentario (MDX), mecánica, rúbrica,
  mapa curricular y competencias. Incluye modo `@media print` que aísla la ficha de
  alumno.

### 3.4 Componentes (`src/components/debates/`)

- `DebateMeta.astro` — fila de metadatos (formato, duración, agrupación, nivel).
- `PosturaCard.astro` — tarjeta de una postura (label + síntesis), color por bando.
- `Argumentario.astro` — argumentos por bando dentro del cuerpo MDX.
- `Fases.astro` — timeline de mecánica/turnos (opcional, si no va en prosa).
- `Rubrica.astro` — tabla de criterios ↔ competencias.
- `FichaAlumno.astro` — bloque imprimible (`.print-block`): moción, postura, espacio
  para argumentos propios y rúbrica.
- Se **reutiliza** `@components/dinamicas/PrintButton.astro` (es genérico).

### 3.5 Menú

Añadir a `SECCIONES_TRANSVERSALES` (`src/lib/asignaturas.ts`):

```ts
{ slug: 'debates', label: 'Debates', description: 'Controversias económicas para argumentar en clase.' }
```

Actualizar `src/lib/asignaturas.test.ts` para cubrir la nueva entrada.

### 3.6 Color-coding de familias (sin colores nuevos)

Reutiliza los tokens de la paleta de asignaturas, igual que Dinámicas:

| Familia | slug | colorVar |
|---|---|---|
| Mercado y Estado | `mercado-estado` | `--color-eco1` (teal) |
| Trabajo, salarios y desigualdad | `trabajo-desigualdad` | `--color-fopp` (berenjena) |
| Globalización y comercio | `globalizacion-comercio` | `--color-edmn` (terracota) |
| Sostenibilidad y crecimiento | `sostenibilidad-crecimiento` | `--color-mustard` (mostaza) |
| Ética, empresa y consumo | `etica-empresa-consumo` | `--color-gpe` |
| Dinero, tecnología y futuro | `dinero-tecnologia-futuro` | `--color-ipe2` |

(Las familias quedan definidas en la lib desde el inicio; el hub solo muestra las
que tienen al menos un debate publicado — `groupByFamilia` descarta las vacías.)

## 4. Pilot

Un único debate completo y `publicado`:

- **Título**: «¿Debe el Estado subir el salario mínimo?»
- **Moción**: «El salario mínimo interprofesional debería subir de forma significativa.»
- **Familia**: `mercado-estado`.
- **Formato**: `parlamentario`.
- **Posturas**:
  - `a-favor` — «Subirlo protege a los trabajadores y reduce la desigualdad.»
  - `en-contra` — «Subirlo destruye empleo y daña a los menos cualificados.»
- **Argumentario** (cuerpo MDX): 3-4 argumentos por bando con evidencia (efecto sobre
  empleo, pobreza laboral, comparativa internacional, mercado de trabajo competitivo
  vs monopsonio).
- **Mecánica**: formato parlamentario, fases (preparación en equipos → turnos de
  apertura → réplica → turno del público → cierre → debrief), tiempos y roles.
- **Rúbrica**: calidad de argumentos, uso de evidencia, capacidad de refutación,
  expresión oral y respeto de turnos — cada criterio ligado a una competencia.
- **Encaje curricular**: unidades reales de mercado de trabajo / intervención del
  Estado en Eco 1BACH, FOPP 4ESO, EEAE, IPE (validadas contra los libros publicados
  al redactar la ficha — ver §5).
- **Ficha de alumno imprimible**.

## 5. Encaje curricular y validación

El frontmatter `unidades_relacionadas` referencia unidades por `{asignatura, unidad}`.
Un test de build (espejo del de Dinámicas) usa `findBrokenUnidadRefs` para garantizar
que **toda referencia apunta a una unidad publicada existente**; si no, el build de
contenido falla. Por tanto las unidades del pilot se fijan contra los libros reales
al redactar la ficha, no de memoria.

## 6. Testing (TDD para la lógica de build)

- `src/lib/familia-grouping.test.ts` — agrupación, orden y descarte de familias vacías
  (cubre Dinámicas y Debates tras la extracción).
- `src/lib/debates.test.ts` — `familiaMeta`, slugs, `FAMILIAS_DEBATE` bien formadas.
- `src/lib/asignaturas.test.ts` — añadir cobertura de la sección `debates`.
- `src/pages/debates/_print-isolation.test.ts` — **prefijo `_` desde el inicio** (no
  es ruta) — verifica que la página de detalle aísla la ficha imprimible en `@media print`.
- Verificación final: `astro build` completo verde (local + Vercel).

## 7. Fuera de alcance

- Catálogo completo de debates (esta tarea es marco + 1 pilot).
- Versión imprimible de «tarjetas de moderador» o material extra más allá de la
  ficha de alumno.
- Traducción ca/val (estructura i18n preparada, contenido solo `es` en el MVP).
- Cualquier cambio en la sección Dinámicas más allá de la extracción de los helpers
  genéricos compartidos.

## 8. Riesgos y mitigaciones

- **Solapamiento conceptual con el `tipo: 'debate'` de Dinámicas**: se asume y se
  acepta; son secciones distintas con propósitos distintos (catálogo de aula vs
  controversias argumentativas). No se migra contenido entre ambas en esta tarea.
- **Referencias curriculares rotas**: cubiertas por el test `findBrokenUnidadRefs`.
- **Regresión del build por fichero suelto en `src/pages/`**: el test imprimible va
  con prefijo `_` desde el inicio (lección de la sección Dinámicas).
- **Extracción de helpers rompe Dinámicas**: mitigado por los tests existentes de
  Dinámicas, que deben seguir verdes tras el refactor.
