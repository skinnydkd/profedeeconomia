# Spec — Generadores: herramientas docentes nativas

- **Fecha**: 2026-06-03
- **Autor**: Pau Monterde (profedeeconomia.es)
- **Estado del spec**: en revisión
- **Tipo**: rework de la sección `/generadores/` + 6 herramientas docentes nativas

## 1. Objetivo

Convertir `/generadores/` (hoy: dos enlaces externos, uno de ellos muerto) en un hub de
**herramientas para el profesor**: mantiene los generadores externos vivos y añade
**6 herramientas nativas** de evaluación y aula, interactivas, que se autoguardan,
exportan a PNG/PDF e imprimen. Solo para profesorado (no van ligadas a unidades).

## 2. Decisiones de alcance (acordadas en brainstorming)

- **Limpieza de la landing**: quitar la tarjeta «Pruebas de evaluación» (el generador
  externo ya no existe), mantener «Situaciones de Aprendizaje» y **añadir** «Programación
  anual» (ambos enlazan a oposicioneseconomia.es/programacion, que ahora ofrece esos dos
  + una guía).
- **6 herramientas nativas**:
  - **Generador de rúbricas** (criterios × niveles **dinámicos**).
  - **Calculadora de calificaciones** (media ponderada + conversor rúbrica→nota).
  - **4 plantillas docentes**: Plan de refuerzo, Registro/seguimiento de aula,
    Medidas DUA / adaptación, Autoevaluación / coevaluación.
- **Estructura = hub con registro + detalle** (enfoque A), mismo patrón que `/herramientas/`,
  pero **sección propia** (Generadores), separada del toolbox de alumno.
- **Sin mapa curricular** (las herramientas docentes no se asocian a unidades).
- Reutiliza `src/lib/plantillas/` (`usePersistentState`, `exportarNodo`) y el patrón de
  calculadora (`src/lib/calc/*` puro + isla).

NO en este alcance: el generador de exámenes desde el banco de preguntas (lo más grande;
queda para una fase futura).

## 3. Arquitectura

### 3.1 Registro (`src/lib/generadores.ts`)

```ts
export type TipoGenerador = 'rubrica' | 'calculadora' | 'plantilla';
export type GrupoGenerador = 'evaluacion' | 'aula';
export const GENERADOR_KEYS = ['Rubrica', 'Calificaciones', 'Autoevaluacion', 'PlanRefuerzo', 'RegistroAula', 'MedidasDUA'] as const;
export type GeneradorKey = typeof GENERADOR_KEYS[number];

export interface GeneradorNativo {
  componente: GeneradorKey;
  slug: string;
  title: string;
  descripcion: string;
  comoUsar: string;          // one-liner shown on the detail page
  tipo: TipoGenerador;
  grupo: GrupoGenerador;
  orden: number;
}
export interface GeneradorExterno { title: string; descripcion: string; href: string; eyebrow: string; }

export const GENERADORES_NATIVOS: GeneradorNativo[];   // the 6 below
export const GENERADORES_EXTERNOS: GeneradorExterno[]; // SA + Programación anual
export function generadorPorSlug(slug: string): GeneradorNativo | undefined;
export function gruposNativos(): { grupo: GrupoGenerador; label: string; items: GeneradorNativo[] }[]; // for the landing
```

Native tools:

| componente | slug | tipo | grupo | título |
|---|---|---|---|---|
| `Rubrica` | `rubricas` | rubrica | evaluacion | Generador de rúbricas |
| `Calificaciones` | `calificaciones` | calculadora | evaluacion | Calculadora de calificaciones |
| `Autoevaluacion` | `autoevaluacion` | plantilla | evaluacion | Autoevaluación y coevaluación |
| `PlanRefuerzo` | `plan-refuerzo` | plantilla | aula | Plan de refuerzo |
| `RegistroAula` | `registro-aula` | plantilla | aula | Registro de aula |
| `MedidasDUA` | `medidas-dua` | plantilla | aula | Medidas DUA / adaptación |

External: «Situaciones de Aprendizaje» y «Programación anual», ambos `href` = `https://oposicioneseconomia.es/programacion`.

### 3.2 Dispatcher (`src/components/generadores/GeneradorIsland.astro`)

Imports the 6 islands and dispatches by `componente` with `client:load` (same pattern as `HerramientaIsland.astro`). Prop `componente?: string`.

### 3.3 Páginas

- `src/pages/generadores/index.astro` — **rework**. Hero + sección «Generadores externos» (2 tarjetas-enlace) + sección(es) de herramientas nativas agrupadas por `grupo` («Evaluación», «Atención y aula»), cada tarjeta enlaza a `/generadores/{slug}/`.
- `src/pages/generadores/[slug].astro` — **detalle**: un solo param. `getStaticPaths` sobre `GENERADORES_NATIVOS`. Renderiza la isla vía `GeneradorIsland` + el `comoUsar`. SIN PuenteUnidades.
- Menú: la entrada `generadores` ya existe; actualizar su `description` (ya no menciona «pruebas»).

### 3.4 Componentes (`src/components/generadores/`)

Reutilizan `usePersistentState` (`@/lib/plantillas/persistence`) y `exportarNodo`
(`@/lib/plantillas/export`). Patrón común de las plantillas: `ref` en `.lienzo`, barra de
acciones `no-print` (Exportar PNG · Exportar PDF · Imprimir · Vaciar) con `try/catch` en el
export, y `@media print` que aísla el lienzo. Clave de persistencia `pde:generador:<slug>`.
Solo tokens existentes; sin emojis pictográficos; acentos correctos.

- **`RubricaGenerator.tsx`** — rúbrica **dinámica**: filas = criterios (añadir/eliminar; nombre +
  competencia opcional), columnas = niveles de logro (número configurable, por defecto 4 con
  etiquetas editables «Insuficiente/Suficiente/Notable/Sobresaliente»). Cada celda es un
  descriptor editable. Estado en `usePersistentState`. Export/print del lienzo de la tabla.
- **`CalificacionesCalc.tsx`** — calculadora (sin persistencia obligatoria; puede usar estado
  simple). Dos bloques: (1) **media ponderada** de instrumentos/competencias `{nombre, peso, nota}`
  → nota final, avisando si los pesos no suman 100; (2) **rúbrica→nota**: niveles obtenidos /
  niveles máximos × escala (10) → nota. Lógica pura en `src/lib/calc/calificaciones.ts` (testeada).
- **`PlanRefuerzo.tsx`** — ficha: alumno/grupo, áreas/criterios a reforzar, medidas, actividades,
  temporización, seguimiento. Campos `<textarea>`/inputs, persist + export + print.
- **`RegistroAula.tsx`** — tabla de seguimiento: filas = alumnos (añadir/eliminar), columnas fijas
  (asistencia, actitud, entregas, observaciones) o una rejilla de sesiones. Persist + export + print.
- **`MedidasDUA.tsx`** — plantilla de medidas de atención a la diversidad (DUA / adaptación no
  significativa): contexto, barreras detectadas, ajustes (representación/acción/implicación),
  recursos, seguimiento. Persist + export + print.
- **`Autoevaluacion.tsx`** — hoja de autoevaluación/coevaluación: criterios (editables) × escala
  (p. ej. 1–4 o emojis NO — usar escala textual), para que el alumnado se valore o valore al
  equipo. Persist + export + print.

### 3.5 Lógica pura (`src/lib/calc/calificaciones.ts`)

```ts
export function mediaPonderada(items: { peso: number; nota: number }[]): number | null; // sum(peso*nota)/sum(peso); null if sum(peso)<=0
export function sumaPesos(items: { peso: number }[]): number;
export function rubricaANota(obtenidos: number, maximos: number, escala?: number): number | null; // (obtenidos/maximos)*escala (default 10); null if maximos<=0
```

## 4. Testing

- `src/lib/generadores.test.ts` — 6 nativos con `componente` ∈ GENERADOR_KEYS, slugs únicos,
  cada uno con grupo/tipo válidos; 2 externos con href; `generadorPorSlug` resuelve y devuelve
  undefined en slug inexistente; `gruposNativos` agrupa por grupo en orden.
- `src/lib/calc/calificaciones.test.ts` — media ponderada (incl. pesos que no suman 100 y suma 0),
  sumaPesos, rubricaANota (caso normal y maximos 0).
- Verificación final: `astro build` completo verde; las 6 detail pages prerenderizan; islas
  hidratan; smoke en dev de persistencia + export + print.

## 5. Fuera de alcance

- Generador de exámenes desde el banco de preguntas (fase futura).
- Guardar/compartir online (solo localStorage local).
- Mapa curricular en las herramientas docentes.
- Traducción ca/val.

## 6. Riesgos y mitigaciones

- **Tablas dinámicas (rúbrica, registro) + export**: html2canvas captura el DOM tal cual; mantener
  el lienzo a ancho fijo razonable y degradar a «Imprimir» si el export falla (try/catch).
- **Rework de la landing**: es una página que ya existe (`generadores/index.astro`); se reescribe
  conservando estilo editorial y tokens. Los enlaces externos siguen apuntando a la URL viva.
- **Separación de secciones**: las herramientas docentes NO entran en el registro `HERRAMIENTAS`
  ni en `HerramientaIsland` (toolbox de alumno); viven en su propio `generadores.ts` / `GeneradorIsland`.
- **Build-break**: ruta `[slug].astro` de un solo nivel; sin `.ts` sueltos bajo `src/pages/generadores/`.
