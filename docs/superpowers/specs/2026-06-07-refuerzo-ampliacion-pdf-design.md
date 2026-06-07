# Cuadernos de refuerzo y ampliación: contenido ampliado + PDF descargable — Design Spec

**Date:** 2026-06-07
**Status:** Approved (design), pending implementation plan
**Branch:** `feat/refuerzo-ampliacion-pdf`

## Objetivo

Convertir los cuadernos de **refuerzo** y **ampliación** (atención a la diversidad,
sección `/[asignatura]/refuerzo/`) en cuadernos **más extensos** y generar un **PDF
real** por bloque, descargable. La petición original de Pau: «que foren en PDF i foren
més extensos».

«Más extensos» se concreta (decisión de Pau) en tres añadidos por bloque:
1. **Más ejercicios** (graduados y variados).
2. **Repaso teórico previo** (síntesis por unidad antes de practicar).
3. **Ejemplos resueltos** paso a paso, como modelo, antes de la batería de ejercicios.

## Alcance

- **Pilot:** una sola asignatura, **EDMN 2BACH** (`edmn-2bach`), especialidad de Pau.
  3 evaluaciones × 2 tipos = **6 bloques → 6 PDFs**. Si el formato convence, se escala
  al resto de asignaturas en una fase posterior.
- **Empaquetado:** **1 PDF por evaluación y tipo** (granularidad máxima). Nombre de
  fichero `{asignatura}-{tipo}-eval{n}.pdf`, p.ej. `edmn-2bach-refuerzo-eval1.pdf`.
- **Soluciones:** **una sola edición** (no alumno/profesor). Los ejemplos resueltos
  siempre visibles; la batería de ejercicios va con sus enunciados y un **solucionario
  al final** del PDF.
- **Tamaño objetivo por bloque:** «amplio», ~7-10 páginas: repaso teórico completo +
  3-5 ejemplos resueltos + ~18-25 ejercicios graduados + solucionario.

### Fuera de alcance (de este pilot)

- Las otras 8 asignaturas (escalado posterior).
- Ediciones alumno/profesor separadas.
- Traducción ca/valencià.
- Cambios en otras secciones (libro, actividades, tests, etc.).

## Arquitectura

Mirror del patrón ya probado en este repo: **frontmatter estructurado → componente
compartido → ruta de impresión standalone → `pagedjs-cli` build script → `public/downloads`**.
Single source of truth: el mismo frontmatter alimenta web y PDF.

### 1. Esquema de la colección `refuerzo` (`src/content.config.ts`)

Añadir tres campos, **todos `.default([])`** para mantener retrocompatibilidad con los
8 sujetos no migrados (sus ficheros siguen validando sin tocar nada):

```ts
repaso_teorico: z.array(z.object({
  titulo: z.string(),
  unidad: z.number().int().min(1).optional(),
  contenido: z.string(), // HTML inline, como el resto de la sección
})).default([]),

ejemplos_resueltos: z.array(z.object({
  enunciado: z.string(),  // HTML inline
  desarrollo: z.string(), // HTML inline, paso a paso
})).default([]),
```

`ejercicios[]` ya existe (`{ enunciado, solucion? }`). Para el formato nuevo la
`solucion` estará **siempre presente** (alimenta el solucionario), pero el campo sigue
`optional()` por compatibilidad.

### 2. Componente compartido `src/components/refuerzo/BloqueRefuerzo.astro`

Renderiza un bloque completo. Prop `mode: 'web' | 'print'` controla la presentación de
soluciones. Recibe los datos del bloque (`data`) y, en print, calcula el solucionario.

Orden de secciones (mismo orden en ambos modos; solo cambia el tratamiento de la solución):
- **web:** Repaso teórico → Lo esencial → Vocabulario → Ejemplos resueltos → Ejercicios
  (con solución **plegable inline** `<details>`, comportamiento actual).
- **print:** Repaso teórico → Lo esencial → Vocabulario → Ejemplos resueltos → Ejercicios
  (solo enunciados, numerados) → **Solucionario** (lista numerada con las `solucion` de
  cada ejercicio).

Esto elimina el render inline actual de `index.astro` (se extrae al componente) →
single source para web + PDF.

### 3. Página web `/[asignatura]/refuerzo/` (`src/pages/[asignatura]/refuerzo/index.astro`)

- Sustituye el render inline de cada bloque por `<BloqueRefuerzo mode="web" .../>`.
- Añade, por bloque, un **link de descarga** al PDF correspondiente
  (`/downloads/{asignatura}-{tipo}-eval{n}.pdf`) usando el helper `refuerzoPdfName`.
- El resto de la página (hero, agrupación por evaluación, estilos de tarjeta) se mantiene.

### 4. Ruta de impresión `src/pages/[asignatura]/refuerzo/imprimir/[bloque].astro`

- `[bloque]` = `eval{n}-{tipo}` (p.ej. `eval1-refuerzo`).
- `getStaticPaths`: por cada entrada `refuerzo` con `estado: 'publicado'`, emite
  `{ params: { asignatura, bloque: 'eval{evaluacion}-{tipo}' }, props: { entry } }`.
- Documento HTML standalone con shell A4 (fuentes Fraunces/Switzer/JetBrains Mono,
  tokens `:root`, `@page { size: A4 }`, CSS de impresión), espejo de
  `src/pages/debates/[familia]/[slug]/imprimir.astro`.
- Contenido: portada (asignatura, título del bloque, evaluación, unidades) +
  `<BloqueRefuerzo mode="print" .../>`. `<meta name="robots" content="noindex">`.

### 5. Build script `scripts/build-refuerzo-pdf.mjs` + helpers

Espejo de `scripts/build-debates-pdf.mjs`:
- `scripts/lib/refuerzo-pdf-jobs.mjs`:
  - `parseRefuerzoPrintPath(relPath)` — puro. De una ruta dist
    `{asignatura}/refuerzo/imprimir/{bloque}/index.html` extrae `{ asignatura, evaluacion,
    tipo, route, out }`; devuelve `null` para rutas que no encajen. Normaliza `\` de Windows.
  - `findRefuerzoPrintJobs(distDir)` — recorre el dist y devuelve un job por bloque,
    ordenado para determinismo.
- `build-refuerzo-pdf.mjs` — servidor estático + detección de Chrome + `pagedjs-cli`,
  copia a `public/downloads/`. Flag `--in-dist` como el resto.
- `package.json`: añadir `"build:refuerzo": "node scripts/build-refuerzo-pdf.mjs"` e
  incluirlo en `build:all`.

Nombre de salida (compartido entre app y build, debe coincidir):
`{asignatura}-{tipo}-eval{n}.pdf`.

### 6. Helper de nombre de fichero (TDD)

`src/lib/refuerzo.ts` → `refuerzoPdfName(asignatura, evaluacion, tipo)` que devuelve
`{asignatura}-{tipo}-eval{n}.pdf`. Test en `src/lib/refuerzo.test.ts`. Usado por la
página web (links de descarga) y reflejado por `parseRefuerzoPrintPath` (lado build).

### 7. Contenido del pilot (EDMN 2BACH)

Regenerar los 6 MDX al formato «amplio». Unidades por evaluación (ya en el frontmatter):
- **Eval 1 — Unidades 1-4:** persona emprendedora, tipos de empresa/forma jurídica,
  análisis del entorno, diseño de modelos de negocio.
- **Eval 2 — Unidades 5-8:** marketing, producción (costes y punto muerto), fijación de
  precios y productividad, recursos humanos.
- **Eval 3 — Unidades 9-12:** función financiera (VAN/payback), contabilidad, análisis
  de estados financieros (ratios), plan de empresa.

Cada bloque (refuerzo y ampliación) tendrá:
- `repaso_teorico[]`: una síntesis por unidad de la evaluación (4 entradas).
- `ejemplos_resueltos[]`: 3-5 ejemplos resueltos paso a paso (en refuerzo, muy guiados;
  en ampliación, de mayor nivel).
- `ejercicios[]`: ~18-25 ejercicios graduados con `solucion` completa. Variedad: definir,
  calcular (punto muerto, VAN, ratios, productividad…), interpretar, casos breves, V/F
  razonado.
- Se conservan `esencial`, `conceptos_clave`, `competencias_clave`, `unidades`.

Generación con subagentes (uno por bloque, 6 en total) + revisión de calidad por bloque.
**Contenido original y exacto**, basado en el currículo LOMLOE de EDMN 2BACH
(Real Decreto 243/2022). No copiar de terceros.

## Flujo de datos

```
src/content/asignaturas/edmn-2bach/refuerzo/eval{n}-{tipo}.mdx (frontmatter ampliado)
   │
   ├─► /[asignatura]/refuerzo/ (web)  ──► BloqueRefuerzo mode="web"  + link descarga PDF
   │
   └─► /[asignatura]/refuerzo/imprimir/eval{n}-{tipo}/ (print, noindex)
            └─► BloqueRefuerzo mode="print"
                  └─► build-refuerzo-pdf.mjs (pagedjs-cli)
                        └─► public/downloads/edmn-2bach-{tipo}-eval{n}.pdf
```

## Testing

- **Unit (TDD):** `refuerzoPdfName` y `parseRefuerzoPrintPath` con sus tests, antes de
  implementar.
- **Build:** `npm run build` debe generar las 6 rutas de impresión del pilot;
  `npm run build:refuerzo` debe emitir 6 PDFs en `public/downloads`.
- **Regresión:** la web `/edmn-2bach/refuerzo/` sigue renderizando (ahora con repaso y
  ejemplos) y los 8 sujetos no migrados siguen validando y renderizando sin cambios.
- **Visual:** revisar 2 PDFs (un refuerzo y una ampliación) — portada, repaso, ejemplos,
  ejercicios numerados, solucionario al final; sin chrome web ni páginas en blanco.

## Riesgos / notas

- **Windows/CRLF + `src/pages`:** la ruta de impresión es `.astro` (no `.ts` suelto), así
  que no aplica el build-break de ficheros `.ts` en `src/pages`. Cualquier test va
  `_`-prefijado o fuera de `src/pages` (ver lección [[project-windows-build-break]]).
- **Precisión de contenido:** crítico. Cada bloque pasa revisión antes de `publicado`.
- **`FichaAlumno`/otros:** no se tocan; este trabajo es autónomo de debates/dinámicas.
- **Retrocompatibilidad:** campos nuevos opcionales → cero cambios en las otras 8
  asignaturas en este pilot.
