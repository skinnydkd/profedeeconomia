# Spec — Mejora del proyecto de emprendimiento

- **Fecha**: 2026-06-05
- **Autor**: Pau Monterde (profedeeconomia.es)
- **Estado**: en revisión
- **Tipo**: enriquecimiento de la sección de emprendimiento («De cero a empresa»)

## 1. Objetivo

Enriquecer el proyecto «De cero a empresa» (12 fases) con tres cosas, manteniendo la estructura de
fases intacta:
1. **Ejemplos de empresas/marketing con chispa**: casos trabajados (4P / BMC) innovadores, divertidos y
   memorables — mezcla de empresas reales reconocibles, ficticias inventadas y algún negocio local.
2. **Actividades de actitud emprendedora**: micro-actividades dentro de las fases (perder la vergüenza,
   pitch, pedir, hablar en público) + un «kit» de actividades independientes reutilizables.
3. **Proyecto «Entrevista a emprendedores»** (integrando el material que el profesor ya usa en 4.º ESO):
   entrevistar a propietarios de negocios locales, con plantilla descargable.

## 2. Decisiones (acordadas en brainstorming)

- **Estructura híbrida**: ejemplos y micro-actividades EMBEBIDOS en la fase relevante; el proyecto de
  entrevista y la biblioteca de ejemplos como RECURSOS aparte, enlazados desde las fases.
- **Ejemplos = mezcla** (reales + ficticias divertidas + local), cada uno con su 4P o BMC y un toque de humor.
- **Actividades de actitud = micro en fases + kit independiente.**
- Las micro-actividades reutilizan los componentes existentes `Callout` y `Steps` (sin componente nuevo).

## 3. Arquitectura

### 3.1 Biblioteca de ejemplos (`emprendimientoEjemplos`)
- Colección MDX `emprendimiento/ejemplos/*.mdx`. Schema:
  `{ slug derivado del fichero, nombre, tipo ('real'|'ficticia'|'local'), sector, problema, segmento,
  modelo ('4p'|'bmc'), p_producto/p_precio/p_plaza/p_promocion (si 4p) o bmc: {…9 bloques…} (si bmc),
  chispa (one-liner con gracia), orden, lang, estado }`. Cuerpo MDX = la historia (con humor) del caso.
- Componente `src/components/emprendimiento/EjemploEmpresa.astro`: dada una entrada (o un `slug`), pinta
  una **tarjeta rica** con el nombre, una etiqueta de tipo, el problema/segmento, el 4P o el BMC
  rellenado y «la chispa». Embebible en una fase con `<EjemploEmpresa slug="…" />`.
- Galería `/emprendimiento/ejemplos/` (`src/pages/emprendimiento/ejemplos/index.astro`): rejilla de todas
  las tarjetas, filtrable visualmente por tipo (real/ficticia/local) y por modelo (4P/BMC).

### 3.2 Micro-actividades en las fases
- En las fases relevantes del proyecto se añade un bloque de actividad con `Callout` + `Steps`:
  - Fase 1 (Detecta) → icebreaker «la molestia de las 48 h».
  - Fase 2 (Idea-equipo) → pitch relámpago de 1 minuto (del problema, no de la solución).
  - Fase 4 (Valida) → role-play de entrevista de problema (perder la vergüenza a preguntar).
  - Fase 5 (Marketing) → message-test en el pasillo a 3 personas.
  - Fase 7 (Personas) → role-play de conflicto de equipo («no estoy de acuerdo porque…»).
  - Fase 11 (Pitch) → pitch + feedback entre pares (usa el componente `PitchDeck10Slides`).
- Cada fase enlaza al kit y, donde aplique, a un `EjemploEmpresa` (4P en fase 5, BMC en fase 3).

### 3.3 Kit de actividades de actitud (`emprendimientoActividades`)
- Colección MDX `emprendimiento/actividades/*.mdx`. Schema:
  `{ title, objetivo (qué actitud trabaja), duracion, agrupacion, materiales[], orden, lang, estado }`.
  Cuerpo = planteamiento + pasos + variantes. ~6-8 actividades (retos de «pide X a un desconocido»,
  juegos para perder la vergüenza, hablar en público, decir que no, negociar).
- Ruta `/emprendimiento/actividades/` (galería) — `src/pages/emprendimiento/actividades/index.astro`.
  (Detalle inline en la propia tarjeta o página por actividad; decisión menor en el plan.)
- Enlazada desde la página del proyecto y desde las fases.

### 3.4 Proyecto «Entrevista a emprendedores»
- Ruta `src/pages/emprendimiento/entrevista-emprendedores/index.astro`: instrucciones (objetivo,
  metodología, procedimiento), **ética y consentimiento** (grabación con permiso, respeto), el guion para
  pedir la entrevista, las **10 preguntas obligatorias + ~30 optativas (elige 5)**, y la entrega.
  El correo es **genérico** (`hola@profedeeconomia.es`), no el del centro del autor.
- **Plantilla descargable**: ruta de impresión `src/pages/emprendimiento/entrevista-emprendedores/imprimir.astro`
  (la plantilla para rellenar a mano: datos del negocio + 10 obligatorias con espacio + 5 optativas).
  Script `scripts/build-entrevista-pdf.mjs` (reusa el patrón pagedjs) → `public/downloads/entrevista-emprendedores-plantilla.pdf`.
- Enlazada desde: la página del proyecto, las fases relevantes (Detecta/Valida) y la unidad de
  emprendimiento de **eco-4eso** (u9, donde el profesor lo usa).

### 3.5 Integración
- `src/pages/emprendimiento/proyecto/index.astro` y/o `/emprendimiento/index.astro`: tarjetas/enlaces a
  «Ejemplos con chispa», «Kit de actividades» y «Entrevista a emprendedores».
- El PDF del proyecto transversal (`build-proyecto-transversal-pdf`) recoge automáticamente las
  micro-actividades embebidas en las fases (son contenido de las fases). Los `EjemploEmpresa` embebidos
  muestran su versión impresa (la tarjeta) en el PDF.

## 4. Fases de trabajo

1. **Marco**: colecciones (`emprendimientoEjemplos`, `emprendimientoActividades`) + schema; componente
   `EjemploEmpresa`; rutas de galería, kit y entrevista + plantilla PDF; enlaces de integración. Validar con
   1-2 ejemplos y 1 actividad de muestra.
2. **Contenido**: los ~8-10 ejemplos (con chispa, 4P/BMC verificados), las 6 micro-actividades en las fases,
   el kit de ~6-8 actividades, y el banco de preguntas de la entrevista. Subagentes de contenido.

## 5. Testing
- `astro build` verde: galería, kit, entrevista y plantilla renderizan; las fases con micro-actividades
  y `EjemploEmpresa` compilan (MDX-safe).
- La plantilla PDF de la entrevista se genera y es descargable; sin email personal del centro.
- Enlaces nuevos resuelven (sin 404).

## 6. Riesgos
- **MDX-safety** al embeber componentes en las fases (sin LaTeX/comentarios HTML; ya conocido).
- **Tono**: la chispa/humor debe ser pedagógica y apropiada para instituto; revisión de contenido.
- **Datos de ejemplos reales**: nada inventado como dato real; los casos reales, correctos; los ficticios,
  claramente ficticios.

## 7. Fuera de alcance
- Reescribir la estructura de las 12 fases (solo se embeben ejemplos/micro-actividades y se enlaza).
- Traducción ca/val.
- El correo personal del centro (se sustituye por el genérico).
