# Plan — Cuadernos de actividades imprimibles (PENDIENTE, futuro)

> Decidido con Pau el 2026-05-20. Queda **planificado pero sin ejecutar**; se retomará tras la Fase 4 (interactividad) o cuando Pau lo priorice. Surge de revisar los PDF de Fase 3: el PDF del libro contiene solo el `libro/` (con ejercicios resueltos y proyectos integrados), pero las **actividades y tests** viven en secciones web separadas y no hay versión imprimible.

## Objetivo

Generar, para cada asignatura, un **cuaderno de actividades en PDF** descargable, paralelo al PDF del libro. Mismo sistema editorial (Variant C, color identificador por asignatura, paged.js), derivado de la **misma fuente única**: los `.md` de `actividades/` y `tests/`. Sin copiar ni mantener contenido duplicado.

## Qué existe ya (no hay que crearlo)

| Asignatura | Actividades | Tests |
|---|---|---|
| EDMN 2BACH | 12 | 12 |
| Eco 1BACH | 12 | 12 |
| Eco 4ESO | 10 | 10 |
| FOPP 4ESO | 10 | 10 |

- **Actividades** (`.md`): frontmatter con `unidad_relacionada`, `title`, `tipo` (caso · ejercicio · debate · dinamica · proyecto), `descripcion`, `duracion`, `agrupacion`, `materiales` + cuerpo (Planteamiento, Objetivos, Pasos…).
- **Tests** (`.md`): frontmatter con `preguntas[]` estructuradas (`enunciado`, `opciones`, `correcta`, `explicacion`). Esto permite generar **enunciado + clave de respuestas** automáticamente.

## Alcance recomendado

Un PDF por asignatura: **`{slug}-cuaderno.pdf`**, con dos posibles ediciones desde la misma fuente:

1. **Edición alumnado** — actividades agrupadas por unidad, con espacio para responder; tests sin soluciones.
2. **Edición profesorado** — igual + **clave de respuestas** de los tests (`correcta` + `explicacion`) y, si procede, soluciones de los ejercicios.

Recomendación: empezar con **una sola edición profesorado** (la más útil para el público objetivo) y valorar la del alumnado después.

Estructura interna del cuaderno:
- Portada con color de la asignatura + rótulo "Cuaderno de actividades".
- Índice por unidades.
- Por cada unidad: sus actividades (cabecera con `tipo`, `duración`, `agrupación`, `materiales`) y, al final, su test.
- Proyectos (`tipo: proyecto`) y capstones destacados visualmente.
- Anexo opcional: clave de respuestas de todos los tests (solo edición profesorado).

## Enfoque técnico

Reutilizar el patrón ya probado en Fase 3:

1. **Ruta nueva** `src/pages/[asignatura]/actividades/imprimir.astro`, espejo de `libro/imprimir.astro`:
   - Reutiliza el sistema de portada, índice, tipografía print y `--book-accent` por asignatura.
   - `getCollection('actividades')` + `getCollection('tests')`, filtrados por `estado: 'publicado'`, ordenados por `unidad_relacionada`.
   - Renderiza cada actividad (`render()`), y los tests desde su array `preguntas`.
   - Un flag (`?solucionario=1` o ruta `/profesorado/`) decide si se imprimen las respuestas correctas.
2. **Script** `scripts/build-workbook-pdf.mjs` (clon de `build-book-pdf.mjs`, que ya acepta filtro por slug): genera `public/downloads/{slug}-cuaderno.pdf` con pagedjs-cli + Chrome del sistema.
3. **Enlace de descarga** en `/[asignatura]/actividades/` junto a la lista de actividades.

Respeta la regla de oro del proyecto: el cuaderno es un **derivado** de los `.md`, no una copia.

## Decisiones abiertas (resolver al ejecutar)

1. ¿Edición profesorado, alumnado, o ambas? (recomendado: profesorado primero).
2. ¿Incluir los tests en el mismo cuaderno o un PDF de tests aparte?
3. ¿Espacio para escribir respuestas (líneas/recuadros) en la edición alumnado?
4. ¿Soluciones de los ejercicios cuantitativos, además de la clave de los tests?

## Esfuerzo estimado

~1 sesión: ruta print + script + enlace de descarga + 1 PDF de prueba. Regeneración de los 4 cuadernos como paso final.

## Fuera de alcance

- Versiones autocorregibles / interactivas (eso es Fase 4 web, no el cuaderno PDF).
- Adaptaciones por CCAA.
- Catalán/valenciano (i18n, fase futura).
