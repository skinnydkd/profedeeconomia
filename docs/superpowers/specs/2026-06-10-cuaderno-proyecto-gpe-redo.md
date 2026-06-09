# Cuaderno de proyecto de GPE — rediseño editorial y paridad técnica con «De cero a empresa»

**Fecha:** 2026-06-10
**Asignatura:** GPE 2 BACH (Gestión de Proyectos de Emprendimiento, `gpe-bach`)
**Estado:** spec aprobado — pendiente de plan de implementación

## Contexto y problema

El cuaderno de proyecto de GPE (`src/content/asignaturas/gpe-bach/proyecto/*.mdx`, colección `proyecto`)
fue el **único contenido que quedó fuera del pilot de innovación editorial** porque es
estructuralmente distinto: una colección propia organizada por **fases** (no por unidades),
renderizada como una sola página larga en cascada (`src/pages/[asignatura]/proyecto/index.astro`).

Mientras tanto, el proyecto transversal **«De cero a empresa»** (`/emprendimiento/proyecto/`,
colección `proyectoTransversal`) sí recibió tratamiento de primera: página por fase, doble edición
de cuaderno alumno/profesor descargable, plantillas visuales (Business Model Canvas, punto muerto…),
y componentes editoriales propios.

Los dos recorridos son **hermanos**: GPE es el itinerario anclado al currículum de GPE
(Decret 108/2022, competencias específicas, sello de economía local); DCaE es la versión
transversal y modular para cualquier asignatura. Hoy se referencian mutuamente pero GPE está
muy por detrás en tratamiento.

## Objetivo

Llevar el cuaderno de GPE a **paridad técnica con DCaE reutilizando su maquinaria**, y
enriquecerlo con un **patrón editorial propio** adaptado a fases, manteniendo su ADN curricular
y su sello de proximidad. Contenido propio, código compartido.

## Decisiones vinculantes (de la sesión de brainstorming)

1. **Redo completo**, no parche. Estructura nueva + patrón editorial + contenido conectado con
   el resto del web (calculadoras inline, retos, dinámicas, «Para el aula»).
2. **Hermanos con ADN común**: GPE independiente y anclado a su currículum, pero reutiliza la
   maquinaria técnica de DCaE (rutas por fase, cuaderno `[modo]`, plantillas visuales). NO se
   fusionan las colecciones. NO se toca DCaE.
3. **YAGNI estricto**: no se fusionan colecciones, no se añaden fases nuevas (siguen siendo 6:
   0–5), no se reescribe el contenido pedagógico de fondo de las fases — se enriquece.

## Arquitectura de rutas

Se pasa de página única larga a **portada + 1 página por fase**, replicando la estructura de DCaE
bajo el espacio de la asignatura:

```
/gpe-bach/proyecto/                          → portada (recorrido de 6 fases + descargas)
/gpe-bach/proyecto/[fase]/                   → cada fase (00…05), con nav anterior/siguiente
/gpe-bach/proyecto/cuaderno/imprimir/[modo]  → cuaderno alumno|profesor (origen de los PDFs duales)
/gpe-bach/proyecto/imprimir/                 → guía completa del profe (ya existe, se mantiene)
```

- El `index.astro` actual (que renderiza las 6 fases en cascada) se convierte en **portada con
  tarjetas** de las 6 fases + bloque de descargas, siguiendo el patrón de
  `src/pages/emprendimiento/proyecto/index.astro`.
- La página de fase reutiliza casi tal cual `src/pages/emprendimiento/proyecto/[fase].astro`
  (FaseMeta, BloqueCuaderno, navegación prev/next), adaptada al espacio `/[asignatura]/proyecto/`.

## Schema — extender la colección `proyecto`

Se añaden campos **opcionales** a `src/content.config.ts` (colección `proyecto`, líneas ~257-271).
Ningún fichero existente se rompe (todos los campos nuevos tienen default o son opcionales).

```ts
// Campos nuevos (todos opcionales / con default):
duracion: z.string().optional(),               // "2-3 sesiones"
entregable: z.string().optional(),             // descripción de una línea del entregable
competencia_especifica: z.string().optional(), // "CE1"
saberes: z.array(z.string()).default([]),      // bloques de saberes del Decret 108/2022
unidades_relacionadas: z.array(z.object({
  asignatura: z.enum(ASIGNATURA_SLUGS),
  unidad: z.number().int().min(1),
  nota: z.string().optional(),
})).default([]),                               // → unidades del libro de GPE, alimenta "Para el aula"
cuaderno: z.object({
  tarea: z.string(),
  reflexion: z.string(),
  orientacion_docente: z.string().optional(),  // solo se muestra en modo profesor
  plantilla: z.object({
    tipo: z.enum(['canvas-bm', '4p', 'punto-muerto', 'procesos', 'pitch', 'tabla']),
    columnas: z.array(z.string()).optional(),
    filas: z.number().int().optional(),
  }),
}).optional(),
```

El bloque `cuaderno` es **idéntico** al de `proyectoTransversal`, lo que permite reutilizar
`BloqueCuaderno.astro` y todas las plantillas (`Plantilla.astro` + las 6 variantes) sin tocar nada.

## Anatomía de cada fase

Orden de los elementos dentro de cada MDX de fase:

1. **`<EnEstaFase>`** (componente nuevo) — TL;DR de fase: qué haréis · qué entregaréis · sesiones
   estimadas · qué repasar del libro. Equivalente de `TldrUnidad` adaptado a fase de proyecto.
2. **`<CasoReal>`** (componente nuevo) — mini-caso de emprendimiento de proximidad que ilustra la
   fase. Variante local de `CasoDilema`: titular + fuente + cuerpo + (opcional) pregunta-gancho.
3. **Cuerpo actual de la fase** — se conserva entero, solo refinado. Pasos con sus plantillas de
   trabajo en tablas para rellenar.
4. **`<HerramientaIsland>`** inline donde aporte (Fase 4: `componente="PuntoMuerto"` y
   `componente="VANTIR"`). Mecanismo idéntico al de las unidades de libro de GPE
   (`libro/06-…mdx` ya usa `<HerramientaIsland componente="PuntoMuerto" />`).
5. **`<ErroresQueCuestan>`** (componente nuevo) — caja con 2-3 errores típicos que cometen los
   equipos en esa fase y cómo detectarlos a tiempo. Tono de colega, no de manual.
6. **`<BloqueCuaderno>`** (reutilizado) — la tarea-entregable con plantilla visual en blanco.
7. **Entregable + rúbrica + reflexión/coevaluación** — se conservan (ya existen en cada fase).
8. **`<RecursosRelacionados>`** "Para el aula" — derivado de `unidades_relacionadas` vía el índice
   inverso (`src/lib/recursos-relacionados.ts`), más enlaces a retos/dinámicas/actividades de GPE.

### Componentes nuevos: solo 3

`EnEstaFase`, `CasoReal`, `ErroresQueCuestan`. Se diseñan **genéricos** (sin acoplarse a GPE) para
que DCaE pueda heredarlos en una iteración futura. Todos con estilos scoped y `@media print`
(`break-inside: avoid`) para que entren bien en el PDF.

**Props provisionales (a confirmar en el plan):**

- `<EnEstaFase>`: `haras: string`, `entregable: string`, `sesiones: string`, `repasoLibro?: string`.
  Probablemente leídos del frontmatter (`duracion`, `entregable`) + slot, para no duplicar datos.
- `<CasoReal>`: `titular: string`, `fuente: string`, `pregunta?: string`. Cuerpo en slot default.
  Mismo contrato que `CasoDilema` salvo que `pregunta` es opcional (no toda fase necesita dilema).
- `<ErroresQueCuestan>`: contenido en slot (lista de errores). Sin props o con `titulo?` opcional.

### Reutilización (sin componentes nuevos)

`BloqueCuaderno`, `Plantilla` + 6 plantillas visuales, `FaseMeta` (adaptado o envuelto),
`HerramientaIsland`, `EjemploEmpresa` (para enganchar ejemplos de la sección Emprendimiento donde
encaje), `RecursosRelacionados` + `recursos-relacionados.ts`.

## Casos reales locales (propuesta — a validar por Pau antes del commit)

Uno por fase, economía de proximidad, honestos con la fuente. Cada caso irá marcado
"Adaptado de fuentes públicas" y Pau lo valida/intercambia antes del commit final.

| Fase | Caso propuesto | Por qué encaja |
|---|---|---|
| 0 · Equipo y reto | **La Fageda** (cooperativa, yogures, Girona) | un equipo se forma en torno a un reto social local |
| 1 · Idea y oportunidad | **Internxt** (València, nube privada) | de una necesidad (privacidad) a oportunidad detectada |
| 2 · Modelo y arranque | **Som Energia** (cooperativa energética) | por qué cooperativa y no SL — forma jurídica + canvas |
| 3 · Marketing y prototipo | **Sheedo** (papel plantable, València) | prototipo + marketing mix (las 4P) |
| 4 · Viabilidad | **La Fageda / Auara** | rentable Y con impacto triple — punto muerto + impacto |
| 5 · Puesta en marcha y pitch | **Internxt** u otra startup local que logró financiación | pitch + puesta en marcha |

Restricción de contenido (CLAUDE.md): nada copiado literalmente; casos reales con fuente real
citada o marcados "Adaptado de…"; casos compuestos con nombres ficticios si no hay fuente verificable.

## PDFs

- **Nuevo target dual** para los cuadernos de GPE: añadir 2 jobs (alumno + profesor) a un script de
  build (extender `build-cuaderno-pdf.mjs` con jobs parametrizables, o script hermano
  `build-cuaderno-gpe-pdf.mjs` siguiendo el mismo patrón servidor HTTP + pagedjs-cli). Salidas:
  `gpe-cuaderno-alumno.pdf` y `gpe-cuaderno-profesor.pdf` en `public/downloads/`.
- **Se mantiene** la guía completa del profe actual (`gpe-bach-proyecto.pdf` vía
  `build:proyecto` / `scripts/build-proyecto-pdf.mjs` + `src/pages/[asignatura]/proyecto/imprimir.astro`).
- La **portada** ofrece los 3 PDFs (alumno para rellenar, profesor con orientación, guía completa),
  mismo patrón de descargas que la portada de DCaE.
- Añadir el/los script(s) nuevo(s) a `package.json` y a la cadena `build:all` si procede.

## Color y sello

- Todos los acentos de portada y fase con el **color de asignatura de GPE: granate `#8C2F39`**
  (token `--color-gpe`, soft `#F1DADD` = `--color-gpe-soft`), no terracota. (Nota: la berenjena
  `#5B3A4E` es el color de FOPP, no de GPE; el CLAUDE.md solo lista los 4 colores del MVP.) Las
  páginas de DCaE usan terracota; GPE debe verse distinta y coherente con su tag de asignatura en
  home/hub. El print de proyecto (`imprimir.astro`) ya usa `gpe → #8C2F39` en su mapa `ACCENTS`.
- El **sello "anclado en lo local"** (reto de proximidad como hilo conductor de todo el proyecto)
  se mantiene como diferenciador de GPE frente a DCaE.

## Fuera de alcance (explícito)

- ❌ Fusionar las colecciones `proyecto` y `proyectoTransversal`.
- ❌ Tocar «De cero a empresa» (DCaE) — los componentes nuevos se diseñan genéricos pero su
  aplicación a DCaE queda para otra iteración.
- ❌ Añadir o quitar fases (siguen siendo 0–5).
- ❌ Reescribir el contenido pedagógico de fondo de las fases (se enriquece, no se rehace).
- ❌ Replicar este patrón a otras asignaturas (solo GPE tiene cuaderno de proyecto por ahora).

## Criterios de éxito

1. `/gpe-bach/proyecto/` muestra una portada con las 6 fases como tarjetas + 3 descargas.
2. `/gpe-bach/proyecto/00/`…`/05/` renderizan cada fase con la anatomía completa (TL;DR, caso real,
   cuerpo, plantillas, calculadoras donde toque, errores, cuaderno, rúbrica, "Para el aula"), con
   navegación anterior/siguiente.
3. Los PDFs `gpe-cuaderno-alumno.pdf` y `gpe-cuaderno-profesor.pdf` se generan correctamente; el
   profesor incluye `orientacion_docente` y el alumno no.
4. `npm run build` pasa en verde (verificación real; `astro check` no es fiable con el aluvión MDX).
5. Acentos en berenjena; sello local presente; nada de terracota en GPE.
6. Sin contenido copiado; casos con fuente citada o marcados como adaptados/compuestos.

## Referencias de código (maquinaria a reutilizar)

- Schema actual: `src/content.config.ts:257-271` (`proyecto`), `:279-327` (`proyectoTransversal`).
- Página de fase modelo: `src/pages/emprendimiento/proyecto/[fase].astro`.
- Cuaderno dual modelo: `src/pages/emprendimiento/proyecto/cuaderno/imprimir/[modo].astro`.
- Portada modelo: `src/pages/emprendimiento/proyecto/index.astro`.
- Cuaderno componente: `src/components/emprendimiento/BloqueCuaderno.astro`
  (+ `plantillas/Plantilla.astro` y 6 variantes).
- Meta de fase: `src/components/emprendimiento/FaseMeta.astro`.
- Pilot editorial a imitar: `src/components/{TldrUnidad,CasoDilema,MirarFora}.astro`.
- "Para el aula": `src/components/libro/RecursosRelacionados.astro` + `src/lib/recursos-relacionados.ts`.
- Calculadoras inline: `src/components/calculadoras/HerramientaIsland.astro`
  (ej. de uso en `src/content/asignaturas/gpe-bach/libro/06-…mdx:262`).
- Build cuaderno dual: `scripts/build-cuaderno-pdf.mjs` (jobs en líneas 22-25).
- Build guía proyecto: `scripts/build-proyecto-pdf.mjs` + `src/pages/[asignatura]/proyecto/imprimir.astro`.
- Color de asignatura GPE: berenjena `#5B3A4E` / soft `#ECDCE5` (CLAUDE.md, color-coding vinculante).
