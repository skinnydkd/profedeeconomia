# Spec — Cuadernos de ejercicios: doble edición, soluciones y encaje curricular

- **Fecha**: 2026-06-04
- **Autor**: Pau Monterde (profedeeconomia.es)
- **Estado**: en revisión
- **Tipo**: mejora del sistema de cuadernos de actividades (`actividades` + ruta de impresión + build PDF)

## 1. Objetivo

El cuaderno de actividades ya existe (1 PDF/asignatura, edición profesor con solucionario de tests).
Mejorarlo para que sea un verdadero **cuaderno de ejercicios**:
1. **Soluciones** paso a paso en los ejercicios numéricos (hoy las actividades son abiertas; solo los
   tests llevan solución).
2. **Doble edición**: una para el **alumno** (enunciados, sin respuestas) y otra para el **profesor**
   (con soluciones), del mismo contenido.
3. **Encaje curricular** visible en cada actividad: **sabers** (LOMLOE), **competencias específicas**
   (CE) y **competencias clave** (CC).

## 2. Decisiones (acordadas en brainstorming)

- (2) Doble edición alumno/profesor + (3) más ejercicios cuantitativos, **a la vez**.
- Ejercicios nuevos solo en **unidades cuantitativas** (donde hay cálculo).
- Mostrar la relación curricular completa: **sabers + CE + CC** en cada actividad.

## 3. Arquitectura

### 3.1 Contenido — soluciones y currículo (`src/content.config.ts`, colección `actividades`)
- Nuevo campo opcional **`solucion: z.array(z.string()).default([])`** — pasos de resolución de un
  ejercicio. Solo lo rellenan los `tipo: ejercicio` nuevos; el resto de actividades quedan igual.
- Nuevo campo opcional **`sabers: z.array(z.string()).default([])`** — saberes LOMLOE de la actividad.
  Si está vacío, se **deriva de la unidad del libro** correspondiente (`unidad_relacionada` →
  `getCollection('libro')` → `data.sabers`). Así no hay que reescribir sabers a mano: se aprovecha la
  relación curricular que el libro ya tiene.
- `competencias_especificas` y `competencias_clave` ya existen; los ejercicios nuevos los declaran.

### 3.2 Encaje curricular en el render (`src/pages/[asignatura]/actividades/imprimir.astro`)
- Para cada actividad, una línea/cinta **«Encaje curricular»**: `Sabers <…> · Competencias específicas
  <CE…> · Competencias clave <CC…>`. Los sabers salen del campo propio o, si está vacío, de la unidad
  del libro (lookup por `unidad_relacionada`). Aplica a TODAS las actividades (todas tienen CE/CC).

### 3.3 Doble edición (misma ruta, dos modos)
- `imprimir.astro` lee `Astro.url.searchParams.get('solucionario')`. Modo:
  - **Profesor** (por defecto, o `solucionario=1`): muestra todo — soluciones de ejercicios (`solucion`),
    respuestas correctas + explicaciones de los tests, y la sección final «Solucionario».
  - **Alumno** (`solucionario=0`): oculta los `solucion`, las respuestas/explicaciones de los tests y la
    sección «Solucionario». Se mantienen enunciados, pasos de las actividades y el encaje curricular.
- Un encabezado del PDF indica la edición («Edición del profesor» / «Edición del alumno»).

### 3.4 Generación de 2 PDFs (`scripts/build-workbook-pdf.mjs`)
- Por cada asignatura, generar **dos** PDFs con pagedjs-cli desde la misma ruta:
  - `public/downloads/<slug>-cuaderno.pdf` — profesor (URL sin params; comportamiento actual, retro-compat).
  - `public/downloads/<slug>-cuaderno-alumno.pdf` — alumno (URL con `?solucionario=0`).

### 3.5 Hub de actividades (`src/pages/[asignatura]/actividades/index.astro`)
- Dos botones de descarga: **«Cuaderno del alumno»** (sin soluciones) y **«Cuaderno del profesor»**
  (con solucionario). El de preview ya existe; añadir el del alumno.

### 3.6 Contenido nuevo — ejercicios cuantitativos
- Añadir **1-2 ejercicios** (`tipo: ejercicio`, con `solucion` paso a paso, `competencias_especificas`,
  `competencias_clave`) a cada **unidad cuantitativa**, usando el mapa cálculo↔unidad ya conocido
  (recursos + registro de herramientas): punto muerto, ratios, elasticidad, equilibrio de mercado,
  multiplicador/AD-AS, VAN/TIR, interés compuesto, nómina/IRPF, productividad, etc. ~25-35 ejercicios.
- Datos realistas, solución numérica verificada, sin estadísticas inventadas. Archivos en
  `src/content/asignaturas/<asig>/actividades/<nn>-<slug>.md`, `estado: publicado`.

## 4. Fases

1. **Marco**: campos `solucion`/`sabers` en el schema; render del encaje curricular + soporte de los dos
   modos en `imprimir.astro`; build de 2 PDFs; segundo botón en el hub. Validar con una asignatura.
2. **Contenido**: los ejercicios cuantitativos (subagentes por asignatura, con verificación numérica).
3. **Regenerar** los 18 PDFs (9 profe + 9 alumno) y verificar.

## 5. Testing
- Test del helper de derivación de sabers (dada una actividad sin `sabers`, devuelve los de su unidad del
  libro; si los tiene, los respeta).
- `astro build` verde; la ruta `imprimir` con y sin `?solucionario=0` renderiza correctamente (modo
  alumno NO contiene textos de solución).
- Verificación de que los 18 PDFs se generan; el del alumno no contiene «Solucionario» ni pasos `solucion`.

## 6. Riesgos
- **Fugas de solución en modo alumno**: cubrir con una comprobación (el PDF/HTML del alumno no contiene
  marcadores de solución). Riesgo principal.
- **Exactitud numérica** de los ejercicios: cada `solucion` se recomputa en revisión.
- **Paginación** del PDF con el bloque curricular extra: mantener la densificación; verificar que no
  dispara el número de páginas.

## 7. Fuera de alcance
- Soluciones a casos/dinámicas/debates (abiertos por diseño).
- Ejercicios en unidades no cuantitativas.
- Reescribir `sabers` en todas las actividades existentes (se derivan de la unidad).
