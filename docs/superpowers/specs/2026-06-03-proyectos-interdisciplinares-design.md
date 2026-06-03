# Spec — Sección «Proyectos interdisciplinares»

- **Fecha**: 2026-06-03
- **Autor**: Pau Monterde (profedeeconomia.es)
- **Estado del spec**: en revisión
- **Tipo**: nueva sección transversal (8ª de «Otros») + content collection + 1 pilot

## 1. Objetivo

Añadir una 8ª sección transversal **`/proyectos/`** con un catálogo de **proyectos
interdisciplinares (ABP)** que cruzan la economía con **otra materia** del instituto
(Historia, Matemáticas, Geografía, Ética y valores, Lengua, Tecnología). Es distinta del
*proyecto* de Emprendimiento (que es el capstone de emprendimiento por fases): aquí cada
entrada es un proyecto autocontenido economía × materia.

Entrega = **marco + 1 pilot publicado** (Economía × Matemáticas: una investigación con
datos sobre la inflación).

## 2. Decisiones de alcance (acordadas en brainstorming)

- **Sección nueva «Proyectos interdisciplinares»**, slug `/proyectos/`, label de menú
  «Proyectos interdisciplinares». 8ª entrada de «Otros» (tras Emprendimiento) y 8ª tarjeta
  en la franja «Material transversal» de la home.
- **Organizada por materia conectada** (la otra materia = «familia»).
- **4 bloques por proyecto**: reto + producto final, secuencia de sesiones, conexión con la
  otra materia, rúbrica de evaluación.
- **Marco + 1 pilot publicado** (con revisión de calidad), patrón espejo de Debates.

## 3. Arquitectura (espejo de Debates/Dinámicas)

### 3.1 Librería (`src/lib/proyectos.ts`)
- `MATERIAS` (6 familias): cada una `{slug, label, intro, colorVar}` reusando tokens de
  global.css (sin colores nuevos). Reutiliza los helpers genéricos de `src/lib/familia-grouping.ts`
  (`groupByFamilia`, `Familia`).
- `MATERIA_SLUGS`, `materiaMeta(slug)`.

| Materia | slug | colorVar |
|---|---|---|
| Historia | `historia` | `--color-gpe` |
| Matemáticas | `matematicas` | `--color-ipe2` |
| Geografía | `geografia` | `--color-taller3` |
| Ética y valores | `etica-valores` | `--color-fopp` |
| Lengua | `lengua` | `--color-terra` |
| Tecnología | `tecnologia` | `--color-eco1` |

### 3.2 Content collection (`src/content.config.ts`)
Colección `proyectos`, glob `proyectos/**/*.{md,mdx}`, base `./src/content`. Ruta de
fichero: `src/content/proyectos/{materia}/{nn}-{slug}.mdx`.

```ts
{
  title: string,
  materia: z.enum(MATERIA_SLUGS),
  orden: int >= 0,
  descripcion: string,           // one-liner para card y header
  reto: string,                  // la pregunta/desafío que guía el proyecto
  producto_final: string,        // el entregable que crea el alumnado
  nivel: array(enum('eso','bach','fp')).min(1),
  duracion: string,              // p. ej. "5-6 sesiones"
  agrupacion: string,
  objetivos: array(string).min(1),
  conceptos_clave: array(string).default([]),
  unidades_relacionadas: array({ asignatura: z.enum(ASIGNATURA_SLUGS), unidad: int>=1, nota?: string, competencias_especificas: array(string).default([]) }).default([]),
  competencias_clave: array(string).default([]),
  competencias_especificas: array(string).default([]),
  rubrica: array({ criterio: string, descripcion: string, competencia?: string }).default([]),
  lang: enum(LANGS).default('es'),
  estado: enum(ESTADOS).default('borrador'),
}
```
Añadir `proyectos` al `export const collections`.

### 3.3 Componentes (`src/components/proyectos/`)
- `ProyectoMeta.astro` — fila de metadatos (materia, nivel, duración, agrupación).
- **Reutiliza** `@components/debates/Fases.astro` (secuencia de sesiones), `@components/debates/Rubrica.astro`
  (rúbrica) y `@components/emprendimiento/PuenteUnidades.astro` (mapa curricular). No se duplican.

### 3.4 Páginas
- `src/pages/proyectos/index.astro` — **hub**: materias en orden (`groupByFamilia`), cards por
  proyecto (title, descripcion, materia, nivel), color por materia, filtro cliente. Mismo patrón
  que el hub de Debates.
- `src/pages/proyectos/[materia]/[slug].astro` — **detalle**: ruta de dos params. Header
  (materia + title + descripcion), **el reto** destacado, el **producto final**, el cuerpo MDX
  (sesiones con `<Fases>`, conexión con la otra materia), la **rúbrica** (`<Rubrica>`),
  `<PuenteUnidades>` (unidades de economía) y las competencias. `getStaticPaths` itera la colección,
  split del id `proyectos/materia/nn-slug` → `{materia, slug}`.
- Test `src/pages/proyectos/_print-isolation.test.ts` solo si hay ficha imprimible (en el pilot no es
  imprescindible; si se añade, con prefijo `_`).

### 3.5 Cuerpo MDX de cada proyecto
Imports `Fases` (de `@components/debates/`). Secciones:
- `## El reto` — contexto y por qué importa.
- `## Cómo se desarrolla` — `<Fases fases={[...]}>` con las sesiones (qué se hace, tiempo).
- `## Qué aporta cada materia` — qué pone la economía (saberes/criterios) y qué pone la otra materia.
- `## El producto final` — descripción del entregable y cómo se presenta/evalúa.

### 3.6 Menú + home
- `SECCIONES_TRANSVERSALES` (`src/lib/asignaturas.ts`): insertar `{ slug: 'proyectos', label: 'Proyectos interdisciplinares', description: 'Proyectos que cruzan la economía con otra materia.' }` **tras `emprendimiento`**. Orden final (8): dinamicas, herramientas, emprendimiento, **proyectos**, debates, juegos, jocs-economics, generadores. Actualizar `asignaturas.test.ts` (assert del orden y de la entrada).
- Home (`src/pages/index.astro`): añadir la 8ª tarjeta al array `TRANSVERSAL` en la misma posición (tras Emprendimiento), con su letra/color/desc y enlace `/proyectos/`. Letra `P`, color libre y distinto de las otras 7 (que usan terra/eco1/mustard/gpe/fopp/taller3/ipe2) → usar `--color-eeae` (verde bosque, libre).

## 4. Pilot

Un proyecto completo y `publicado`:
- **Materia**: `matematicas`. **Título**: «El precio de la cesta: una investigación sobre la inflación».
- **Reto**: «¿Cuánto ha subido de verdad el precio de lo que compra tu familia, y cómo lo demuestras con datos?»
- **Producto final**: «Un informe con datos recogidos, una cesta-índice propia, gráficos de evolución y conclusiones.»
- **Qué aporta economía**: inflación, IPC, poder adquisitivo, números índice; **qué aporta matemáticas**:
  recogida y tratamiento de datos, porcentajes, números índice, representación gráfica, media.
- **Sesiones** (`<Fases>`): definir la cesta → recoger precios (hoy y referencia) → calcular el índice y la
  variación → representar gráficamente → interpretar y redactar el informe → presentación.
- **Rúbrica**: rigor de los datos, corrección matemática (índice/%), interpretación económica, comunicación.
- **Nivel**: `[eso, bach]`. **unidades_relacionadas**: unidades reales de inflación/IPC/dinero (eco-1bach
  macro-indicadores, eco-4eso, taller-eco-3eso…), validadas contra los libros publicados al redactar.

## 5. Testing
- `src/lib/proyectos.test.ts` — 6 materias en orden con colorVar válido; `materiaMeta`; slugs.
- `src/lib/asignaturas.test.ts` — orden de 8 entradas con `proyectos` tras emprendimiento.
- `astro build` completo verde: hub + detalle del pilot prerenderizan.

## 6. Fuera de alcance
- Catálogo completo de proyectos (esta tarea es marco + 1 pilot).
- Alojar el currículo de las otras materias (solo se describe su aportación; las unidades enlazadas son de economía).
- Traducción ca/val.

## 7. Riesgos
- **Solape con el proyecto de Emprendimiento**: mitigado — esta sección es economía × otra materia
  (interdisciplinar), no el capstone de emprendimiento; viven en colecciones y rutas distintas.
- **Unidades rotas**: el redactor valida `unidades_relacionadas` contra libros publicados.
- **Reuso de Fases/Rubrica de debates**: son presentacionales y genéricos; importarlos es DRY y no acopla lógica.
