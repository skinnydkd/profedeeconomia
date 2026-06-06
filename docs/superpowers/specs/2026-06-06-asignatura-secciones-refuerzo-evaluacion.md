# Nuevas secciones por asignatura — Refuerzo, Expansión y Evaluación competencial

> Estado: **propuesta pendiente de validación de Pau**. La reordenación del hub
> y el renombrado «Actividades interactivas» ya se hicieron (PR de B1). Esto
> documenta las secciones de contenido nuevas, que implican decisiones
> pedagógicas y una generación de contenido grande, y por eso se dejan para
> aprobar a la vuelta.

## Contexto

Pau pidió, por asignatura:
1. **Cuadernos de refuerzo por evaluación** — para alumnado que suspende o quiere reforzar.
2. (Posible) **Cuaderno de expansión** — para alumnado aventajado.
3. **Evaluación competencial / basada en competencias** — añadirla como apartado.

El hub ya quedó reordenado en tres grupos: «El material del curso» (libro,
diapositivas, actividades, [cuaderno de proyecto]), «Práctica interactiva»
(actividades interactivas, [EBAU]) y «Para el profesorado» (programación, al
final). Las secciones nuevas encajarían así:
- Refuerzo y Expansión → grupo «El material del curso» (son imprimibles).
- Evaluación competencial → grupo «Para el profesorado».

## Propuesta de diseño

### 1. Cuaderno de refuerzo (por evaluación)
- Ruta: `/[asignatura]/refuerzo/` (índice) y, si se divide por evaluación,
  `/[asignatura]/refuerzo/[evaluacion]`. Edición imprimible vía paged.js como
  los cuadernos de actividades (`build-workbook-pdf.mjs`).
- Contenido por unidad/evaluación: **resumen de lo esencial** (3-5 ideas
  ancla), **vocabulario mínimo**, **ejercicios muy guiados y graduados** (de
  menos a más), todos **con solución**. Objetivo: el alumno que va justo
  recupera lo imprescindible.
- Reutiliza el patrón de `cuadernos de ejercicios` (campo `solucion`, doble
  edición alumno/profesor). Decisión abierta: ¿agrupar por **evaluación**
  (1.ª/2.ª/3.ª trimestre) o por **unidad**? La concreción de evaluaciones
  varía por centro/CCAA, así que quizá mejor por unidad con etiqueta de bloque.

### 2. Cuaderno de expansión (alumnado aventajado)
- Ruta `/[asignatura]/expansion/`. Mismo motor de impresión.
- Contenido: **retos de mayor profundidad**, conexiones con la actualidad,
  mini-investigaciones, problemas no rutinarios, lecturas. Sin solución cerrada
  en algunos (abiertos), con orientación para el profe.
- Decisión abierta: ¿sección propia o una pestaña «Expansión» dentro de
  Refuerzo? (un único «Cuaderno de atención a la diversidad» con dos caras).

### 3. Evaluación competencial
- Ruta `/[asignatura]/evaluacion/` (o integrarlo en Programación).
- Contenido derivable del currículo + del propio libro: **competencias
  específicas** de la materia, **criterios de evaluación** asociados, y
  **rúbricas** por competencia. Los tests y cuadernos ya guardan `CE`/`CC`, así
  que parte se puede agregar; el resto es autoría.
- Decisión abierta: ¿apartado propio o ampliar Programación con una pestaña de
  evaluación competencial? Pau habló de «añadir evaluación competencial», lo
  que encaja como apartado propio enlazado desde «Para el profesorado».

## Esfuerzo y plan sugerido
- Es contenido grande (9 libros). Patrón probado: framework + ruta + script PDF
  primero, luego generación por subagentes (uno por libro) con verificación,
  como se hizo con los tests y los cuadernos.
- Sugerencia de orden: (a) decidir las 3 «decisiones abiertas» de arriba; (b)
  pilotar en **Eco 1BACH** una evaluación completa de refuerzo + expansión +
  evaluación competencial; (c) validar y desplegar al resto.

## Lo ya hecho (B1, sin esperar)
- Hub reordenado en 3 grupos, programación al final.
- «Actividades dinámicas» → «Actividades interactivas» (etiqueta; la URL/slug
  `actividades-dinamicas` se mantiene para no romper enlaces).
- «Evaluación competencial» mencionada ya en la descripción de Programación.
