# Retos competenciales: actividad interactiva por competencia específica — Design Spec

**Date:** 2026-06-07
**Status:** Approved (design), pending implementation plan
**Branch:** `feat/retos-competenciales`

## Objetivo

Crear un **tercer tipo de actividad interactiva** para el alumnado, al mismo nivel que
los tests autocorregibles y los simuladores: el **reto competencial**. Cada reto es un
**escenario multipaso** centrado en **una competencia específica** (CE…), que el alumno
resuelve en pantalla con feedback inmediato y termina situándolo en un **nivel de logro**
(En desarrollo / Adecuado / Avanzado) con el descriptor real del currículo.

La sección de profesorado existente **`/[asignatura]/evaluacion/`** (marco de competencias
con rúbricas) **NO se toca**; es la referencia docente. Los retos son la práctica del
alumnado y reutilizan ese marco solo como fuente de los descriptores de nivel.

## Decisiones del usuario (brainstorming)

- Forma: **reto competencial = escenario multipaso** (no quiz plano, no performance-task).
- Cierre: **nivel de logro según puntuación**, mostrando el **descriptor real de
  `evaluacion.mdx`** de esa competencia.
- Ítems por paso: los 4 de los tests (opción múltiple, V/F, numérico, relacionar) **+**
  `ordenar/secuenciar` (nuevo) **+** `abierta con modelo` (nuevo, autoevaluación) **+**
  bloque de **escenario por paso**.
- Nombre/ubicación: **"Retos competenciales"**, sección nueva `/[asignatura]/retos/`. El
  hub de la asignatura presenta la práctica interactiva como **3 tipos: Tests ·
  Simuladores · Retos competenciales**.
- Alcance pilot: **1 asignatura, 2-3 retos** (Eco 1BACH).

## Alcance

- **Pilot:** Eco 1BACH (`eco-1bach`), **3 retos** sobre 3 competencias específicas
  distintas (p.ej. CE1 escasez/sistemas, CE2 agentes/mercados, CE4 sistema financiero).
  Eco 1BACH tiene CE1-CE6 en su `evaluacion.mdx`, cada una con 3 niveles → encaja.
- Sistema completo reutilizable: colección + motor Preact + rutas + presentación en el hub.

### Fuera de alcance (de este pilot)

- Las otras 8 asignaturas (escalado posterior, igual que refuerzo).
- Reestructurar la colección `recursos`: los simuladores se quedan donde están; solo se
  **presentan** agrupados en el hub.
- Persistencia en backend (solo localStorage), i18n ca/valencià.
- Modificar la sección `/evaluacion/` o el motor `QuizPlayer` de los tests.

## Arquitectura

Patrón espejo de `actividades-dinamicas` (estructura JSON en el cuerpo MDX, parseada en
build) + `tests` (motor Preact con feedback y scoring). El frontmatter enlaza la
competencia; los descriptores de nivel se resuelven en build desde `evaluacion.mdx`.

### 1. Colección `retos` (`src/content.config.ts`)

```ts
const retos = defineCollection({
  loader: glob({ pattern: 'asignaturas/*/retos/**/*.{md,mdx}', base: './src/content' }),
  schema: z.object({
    asignatura: z.enum(ASIGNATURA_SLUGS),
    competencia: z.string(),            // código CE de la competencia específica, p.ej. "CE1"
    unidad_relacionada: z.number().int().min(1).optional(),
    title: z.string(),
    descripcion: z.string(),
    duracion: z.string().optional(),
    competencias_clave: z.array(z.string()).default([]),
    lang: z.enum(LANGS).default('es'),
    estado: z.enum(ESTADOS).default('borrador'),
  }),
});
```

La estructura del reto (escenario + pasos + ítems) vive en un bloque ```json``` en el
cuerpo MDX (como `actividades-dinamicas`), por ser anidada y con HTML — más ergonómico
que YAML profundo.

### 2. Estructura JSON del reto (validada por Zod en build)

```jsonc
{
  "intro": { "kicker": "string", "titulo": "string", "contexto": "HTML string" },
  "pasos": [
    {
      "titulo": "string",
      "escenario": "HTML string (opcional): datos/situación del paso",
      "items": [ /* uno o varios ítems, tipos abajo */ ]
    }
  ]
}
```

**Tipos de ítem** (campo discriminador `tipo`):
- `opcion-multiple`: `{ enunciado, opciones[], correcta:int, explicacion? }`
- `verdadero-falso`: `{ enunciado, correcta:bool, explicacion? }`
- `numerico`: `{ enunciado, respuesta:number, tolerancia?:number, unidad?, explicacion? }`
- `relacionar`: `{ enunciado, izquierda[], derecha[], correctas:int[], explicacion? }`
- `ordenar` (nuevo): `{ enunciado, elementos[] (en el orden CORRECTO; se barajan al mostrar), explicacion? }`
- `abierta` (nuevo): `{ enunciado, modelo: HTML }` — el alumno escribe y despliega la
  respuesta modelo; **autoevaluación, NO cuenta en la puntuación**.

Los 4 primeros replican la semántica de los tests; sus reglas de acierto se reimplementan
en el motor de retos (no se importa `QuizPlayer` para no acoplar).

### 3. Cierre → nivel de logro

- **Puntuación** = aciertos / total de ítems **auto-corregibles** (todos menos `abierta`).
- **Umbrales → nivel** (índice 0/1/2): `< 50%` → nivel 0 (En desarrollo); `50%–<80%` →
  nivel 1 (Adecuado); `≥ 80%` → nivel 2 (Avanzado). Fijos en esta versión.
- **Descriptores reales:** en build, la página de detalle lee la colección `evaluacion`
  de la asignatura del reto, busca la competencia por `codigo === reto.competencia`, toma
  su `descripcion` y sus `niveles[]` (3 descriptores) y los pasa al motor.
- **Fallback:** si no se encuentra la competencia o no tiene 3 niveles, se usan etiquetas
  genéricas (En desarrollo/Adecuado/Avanzado) sin descriptor y se emite un `console.warn`
  en build. El reto sigue funcionando.

### 4. Motor `RetoPlayer.tsx` (isla Preact, `client:load`)

- Props: `{ reto: RetoData, niveles: NivelInfo[], competenciaTexto: string, storageKey }`.
- UX espejo de `QuizPlayer`: avanza por ítems con **feedback inmediato** tras confirmar,
  barra de progreso, muestra el escenario del paso al entrar en él.
- Implementa los 6 tipos de ítem (incluye render/scoring de `ordenar` y `abierta`).
- Pantalla final: puntuación + **nivel alcanzado con su descriptor** + texto de la
  competencia; botón de reintentar. Persistencia de mejor resultado en localStorage
  (`storageKey = reto-{asignatura}-{slug}`).
- Subcomponente `RetoItem.tsx` si el archivo crece (un render por tipo de ítem), para
  mantener archivos enfocados.

### 5. Parsing + validación (build)

- `src/components/retos/parse-reto.ts` — extrae el bloque ```json``` del cuerpo MDX
  (como `actividades/parse-tree.ts`) y lo valida con un Zod schema del reto; lanza error
  claro si el JSON no cumple. Exporta tipos `RetoData`, `Item`, `Paso`.

### 6. Rutas (espejo de `tests`)

- `src/pages/[asignatura]/retos/index.astro` — grid de cards de los retos publicados de
  la asignatura (título, competencia, descripción, duración).
- `src/pages/[asignatura]/retos/[slug].astro` — detalle: parsea el reto, resuelve niveles
  desde `evaluacion`, monta `<RetoPlayer client:load .../>`.

### 7. Hub de la asignatura (`src/pages/[asignatura]/index.astro`)

El grupo "Práctica interactiva" pasa a presentar **tres tarjetas diferenciadas** para los
tres tipos interactivos, en lugar de la única tarjeta conflada actual:
- **Tests** → `/[asignatura]/tests/`
- **Simuladores** → `/[asignatura]/recursos/`
- **Retos competenciales** → `/[asignatura]/retos/` — **solo si** la asignatura tiene
  retos publicados (gate `hasRetos`, como `hasRefuerzo`/`hasEvaluacion`).

Se conservan las tarjetas existentes del grupo que no son de estos tres tipos
(actividades-dinámicas, EBAU). `/evaluacion/` permanece en el grupo "Para el profesorado",
intacta.

### 8. Helpers puros (TDD)

- `src/lib/retos.ts`:
  - `nivelForScore(aciertos: number, total: number): 0 | 1 | 2` — umbrales fijos; `total
    === 0` → 0.
  - `resolveNiveles(evaluacionData, codigo): { competenciaTexto, niveles } | null` — busca
    la competencia y devuelve descriptor + 3 niveles, o `null` para fallback.
- `parse-reto.ts` — parsing + validación (probado con un JSON de ejemplo).

## Flujo de datos

```
src/content/asignaturas/eco-1bach/retos/01-...mdx
  (frontmatter: competencia CE1 …) + bloque ```json``` (intro + pasos)
   │  parse-reto.ts (build) → RetoData (validado)
   │  evaluacion.mdx (eco-1bach) → resolveNiveles(CE1) → descriptores
   └─► /[asignatura]/retos/[slug] → <RetoPlayer client:load reto niveles competenciaTexto/>
            └─ alumno resuelve → puntuación → nivelForScore → nivel + descriptor
```

## Testing

- **Unit (TDD):** `nivelForScore` (umbrales y borde 0/total), `resolveNiveles` (encuentra,
  no-encuentra, <3 niveles), `parseReto` (JSON válido / inválido / tipos de ítem).
- **Build:** `npm run build` genera `/eco-1bach/retos/` y los 3 detalles sin error.
- **Regresión:** tests (`QuizPlayer`) y recursos siguen igual; las otras 8 asignaturas no
  muestran la tarjeta Retos (gate) y su hub no cambia de comportamiento.
- **Manual:** resolver un reto en dev, comprobar feedback por ítem (incl. `ordenar` y
  `abierta`), la pantalla final con el nivel correcto según puntuación y el descriptor
  real de `evaluacion.mdx`.

## Riesgos / notas

- **Acoplamiento con `evaluacion.mdx`:** el reto referencia un `codigo` que debe existir en
  el `evaluacion.mdx` de la asignatura. El fallback evita que un código mal escrito rompa
  el build, pero el contenido del pilot usará códigos verificados (CE1/CE2/CE4 de Eco 1BACH).
- **`src/pages` + Windows build-break:** las rutas son `.astro`; los tests de helpers van en
  `src/lib` / junto al parser, NUNCA como `.ts` suelto en `src/pages` (ver
  [[project-windows-build-break]]).
- **No tocar `QuizPlayer`:** los tipos de ítem nuevos viven solo en `RetoPlayer` → cero
  riesgo para los tests existentes.
- **Precisión de contenido:** crítica; cada reto pasa revisión antes de `publicado`.
