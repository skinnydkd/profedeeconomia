# Materiales descargables de los debates — diseño

**Fecha:** 2026-06-06
**Estado:** aprobado (brainstorm con Pau)
**Ámbito de este piloto:** los 18 debates transversales (`src/content/debates/`)

## Problema

Las descargas de varias secciones transversales son pobres: o están en blanco, o
son la propia página web exportada a PDF. En los **debates**, lo único imprimible
hoy es una *Ficha "Preparo mi postura"* de una página (vía `window.print()` con CSS
`@media print`). Todo lo demás —argumentario, fases, rúbrica— se queda en la página.

Existen ya **dos patrones de oro** en el repo que sí funcionan y que reutilizamos:

- **Emprendimiento** (`/emprendimiento/proyecto/cuaderno/imprimir/[modo]` + `scripts/build-cuaderno-pdf.mjs`): plantillas visuales, PDF real generado con `pagedjs-cli`.
- **Juegos print-and-play** (`/juegos/{econopoly,…}/imprimir.astro`): material completo y jugable derivado de los datos del juego.

## Objetivo / criterio de éxito

Para cualquiera de los 18 debates, poder **descargar un único PDF real** —*«{título} —
Materiales para el aula»*— completo y suficiente para dar el debate en clase sin
preparar nada más. Ninguna descarga debe ser la página web tal cual ni un folio en blanco.

## Principio rector

**Single source of truth.** Todo el material se deriva de lo que ya existe en cada
debate: el *frontmatter* (moción, posturas, rúbrica, encaje curricular, metadatos) y
el *cuerpo MDX* (de qué va, argumentario, fases). No se duplica contenido.

## El pack (un PDF por debate)

Cada material es un bloque imprimible autónomo con salto de página.

1. **Guía del profesor.** Cabecera derivada del frontmatter (moción, `objetivos`,
   `formato`, `duracion`, `agrupacion`, `unidades_relacionadas`, `competencias_clave`)
   seguida del cuerpo MDX del debate renderizado para impresión: *de qué va*,
   `<Argumentario>` (pro/contra) y `<Fases>` (cronograma con tiempos, incluido el
   debrief). Es la "chuleta" para conducir el debate.

2. **Hoja de evaluación.** La `rubrica[]` convertida en tabla de puntuación:
   - Filas = `criterio` (con su `descripcion` como "qué se observa") y etiqueta de `competencia`.
   - Columnas = 4 niveles fijos: **1 Inicio · 2 En proceso · 3 Bien · 4 Excelente** (casillas).
   - Campos de cabecera: nombre del grupo/alumno, fecha; pie con total y observaciones.
   - Los niveles son genéricos porque el esquema de `rubrica` no almacena descriptores por nivel.

3. **Tarjetas de postura/rol.** Un recortable por cada `postura` (su `label` + `sintesis`)
   con líneas de corte. Para los formatos `mesa-redonda`, `fishbowl` y `juicio-simulado`
   se añade además una tarjeta de **moderador/observador**. (Para `parlamentario` y
   `dilema-etico` solo posturas.)

4. **Ficha de preparación del alumno.** Versión ampliada y uniforme, derivada de la
   `mocion`: postura asignada, 3 argumentos con un hueco de evidencia cada uno, una
   pregunta cruzada al rival, un contraargumento a refutar y notas durante el debate.
   Para fotocopiar (uno por alumno).

## Arquitectura técnica

### Componentes nuevos — `src/components/debates/materiales/`

Cada uno es un `.print-block` autónomo; recibe los datos del debate por props.

- `GuiaProfesor.astro` — props: `data` (frontmatter) + `Content` (el componente
  renderizado del cuerpo MDX). Pinta la cabecera + `<Content />`.
- `HojaEvaluacion.astro` — props: `rubrica`, `title`. Tabla de puntuación.
- `TarjetasPostura.astro` — props: `posturas`, `formato`, `mocion`. Recortables.
- `FichaPreparacion.astro` — props: `mocion`. Ficha del alumno uniforme.

### Ruta de impresión

`src/pages/debates/[familia]/[slug]/imprimir.astro`

- `getStaticPaths` sobre los debates con `estado: 'publicado'` (mismo filtro que la
  página de detalle existente).
- Renderiza, en orden, los cuatro materiales dentro de un layout mínimo de impresión
  (sin header/footer del sitio), con CSS de salto de página entre bloques
  (`.print-block + .print-block { break-before: page; }`) y `print-color-adjust: exact`.
- Reutiliza `render(entry)` de `astro:content` para obtener `<Content />` y pasárselo a `GuiaProfesor`.

### Script de build — `scripts/build-debates-pdf.mjs`

Clon de `scripts/build-cuaderno-pdf.mjs`:

1. Levanta el server de preview en un puerto dedicado.
2. Para cada debate publicado, lanza `pagedjs-cli` sobre
   `/debates/{familia}/{slug}/imprimir/` con timeout de ~120 s.
3. Escribe `debate-{familia}-{slug}.pdf` en `public/downloads/` y `dist/downloads/`.

Se añade el script a `package.json` siguiendo la convención de los demás `build-*-pdf`.

### Enlace de descarga

En la página de detalle del debate (`src/pages/debates/[familia]/[slug].astro`) el
botón **«Imprimir materiales»** pasa a **«Descargar materiales (PDF)»** apuntando al
fichero pre-generado `/downloads/debate-{familia}-{slug}.pdf`. (Se conserva la opción
de imprimir desde la ruta `/imprimir` para vista previa.)

### Limpieza single-source

La *Ficha "Preparo mi postura"* hoy vive como contenido autorizado en el cuerpo de los
18 MDX (`<FichaAlumno>`). Se sustituye por el componente `FichaPreparacion`, que se
muestra **tanto en la web como en el PDF**, para que no haya dos versiones divergentes:

- Quitar el bloque `<FichaAlumno>` (y su import si queda sin uso) de los 18 ficheros.
- Añadir `<FichaPreparacion mocion={…} />` al final del render de la página de detalle.

Si algún debate tuviera una ficha con contenido específico (no genérico), se respeta y
no se toca; el resto se uniformiza.

## Aislamiento y testabilidad

- Los cuatro componentes son puros respecto a sus props: se pueden razonar y revisar por
  separado, y no dependen del resto de la página.
- La lógica con valor de prueba es el **script de build** (descubrir debates, construir
  rutas y nombres de fichero). Se extrae la construcción de la lista de
  `{ familia, slug, outfile }` a una función pura testeable, igual que el resto de scripts.

## Fuera de alcance (ahora)

- Los 40 debates por asignatura (`asignaturas/*/actividades`, `tipo: debate`): se
  entregan vía cuaderno de la asignatura. No se tocan en este piloto.
- Extender el sistema a **proyectos** y **dinámicas** transversales: siguiente piloto,
  reutilizando estos componentes y el patrón de ruta+script.
- Descriptores de rúbrica por nivel: el esquema no los guarda; niveles genéricos.

## Riesgos / notas

- `pagedjs-cli` añade ~unos segundos por PDF: 18 PDFs ≈ 1–2 min al build. Aceptable y
  consistente con los scripts existentes.
- El cuerpo MDX renderizado en la guía no debe incluir ya la ficha del alumno (se quita
  en la limpieza) para evitar duplicarla con el material 4.
