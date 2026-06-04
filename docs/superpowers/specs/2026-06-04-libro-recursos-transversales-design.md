# Spec — Referencias transversales en los libros

- **Fecha**: 2026-06-04
- **Autor**: Pau Monterde (profedeeconomia.es)
- **Estado**: en revisión
- **Tipo**: feature transversal (conecta los 9 libros con las secciones transversales)

## 1. Objetivo

Que cada unidad de los libros muestre los **recursos transversales relacionados** (dinámicas,
debates, proyectos, herramientas, emprendimiento, juegos) aprovechando la relación curricular
que **ya existe** en los datos, y que algunas unidades **incrusten un recurso inline** dentro de
la lección. Las diapositivas quedan para una fase posterior.

Dos capas:
- **Capa A (automática, todas las unidades)**: un cajón «Para el aula» al final de cada unidad,
  derivado del índice inverso de `unidades_relacionadas`. Cero redacción manual.
- **Capa B (editorial, las 9 asignaturas)**: pasada de incrustados inline en unidades clave
  (una calculadora donde la lección pide cálculo, o una dinámica/debate destacado como caja).

## 2. Decisiones de alcance (acordadas en brainstorming)

- **Capa A en las 88 unidades publicadas** de las 9 asignaturas, de golpe (es barata: datos ya existentes).
- **Capa B en las 9 asignaturas a la vez** (no piloto): «selección variada en unidades clave».
- **Secciones incluidas en el cajón**: dinámicas, debates, proyectos, herramientas, emprendimiento
  (proyecto) y **juegos**. Todas tienen ya `unidades_relacionadas` poblado → no hace falta crear
  vínculos nuevos.
- **Cajút** (quiz multijugador donde el profe elige asignatura+unidad) = **cierre universal**: una
  llamada «Repasa esta unidad con Cajút» al final de **todas** las unidades, independiente del
  índice inverso (porque sirve para cualquier unidad).
- **Excluidos**: olimpiada (temática, sin vínculo de unidad), generadores (herramientas de profe sin
  vínculo de unidad por diseño), y el banco `jocs-economics` (es el motor de Cajút, no se referencia aparte).
- **Fuera de alcance**: diapositivas (fase posterior).

## 3. Arquitectura

### 3.1 Índice inverso (`src/lib/recursos-relacionados.ts`) — único código de fondo nuevo
Función que, dadas las colecciones/registros ya existentes, agrupa por unidad:

```ts
type RecursoRef = { tipo: 'dinamica'|'debate'|'proyecto'|'herramienta'|'emprendimiento'|'juego';
  slug: string; title: string; href: string; nota?: string; familiaColorVar: string };
type RecursosDeUnidad = Record<RecursoRef['tipo'], RecursoRef[]>;

// Construye el índice una vez (Map<`${asignatura}#${unidad}`, RecursosDeUnidad>) y lo consulta.
export function buildIndiceRecursos(input): Map<string, RecursosDeUnidad>;
export function recursosDeUnidad(indice, asignatura, unidad): RecursosDeUnidad | null;
```

- **Fuentes** (todas ya tienen `unidades_relacionadas: [{asignatura, unidad, nota?}]`):
  - dinámicas (`getCollection('dinamicas')`), debates (`debates`), proyectos (`proyectos`),
    emprendimiento-proyecto (`emprendimiento`), filtrando `estado: 'publicado'`.
  - juegos: registro `src/lib/juegos.ts` `JUEGOS[].unidades_relacionadas` (filtrando `estado: 'disponible'`).
  - herramientas: combinar el `unidades_relacionadas` inline de `src/lib/herramientas.ts` con la
    derivación existente `unidadesPorComponente(recursos)` (de la colección `recursos`).
- **Color** por entrada: el `colorVar` de la familia/sección que ya existe (familia-grouping para
  dinámicas/debates/proyectos; token de sección para herramientas/emprendimiento/juegos).
- **Robustez**: ignora borradores; una unidad sin recursos devuelve grupos vacíos (no rompe).
- Reutiliza `findBrokenUnidadRefs` ya existente para no introducir enlaces rotos.

### 3.2 Componente del cajón (`src/components/libro/RecursosRelacionados.astro`)
- Props: `asignatura`, `unidad` (+ recibe el índice o lo construye el page y le pasa el resultado).
- Render: secciones por tipo de recurso (solo las no vacías), con el color-coding existente; cada
  entrada = título + `nota` curricular + enlace. Estilo derivado de las tarjetas/`PuenteUnidades` ya existentes.
- **Cierre Cajút**: siempre, una CTA «Repasa esta unidad con Cajút» → `/juegos/cajut/host/`, con
  nota que nombra la asignatura+unidad actual. Aparece aunque no haya otros recursos.

### 3.3 Inserción en la página de unidad (`src/pages/[asignatura]/libro/[unidad].astro`)
- Tras `<Content />` (≈ línea 107) y la navegación: montar `<RecursosRelacionados asignatura={…} unidad={…} />`.
- El page construye el índice una vez (a nivel de módulo / en `getStaticPaths` o arriba del frontmatter)
  y lo pasa, para no reconstruirlo por página.

### 3.4 Componente inline destacado (`src/components/libro/RecursoDestacado.astro`)
- Props: `tipo`, `slug` (resuelve title/href/nota/color desde el índice o la colección).
- Render: tarjeta rica «destacada» para incrustar en el CUERPO de una unidad (una dinámica o debate
  potente). Para calculadoras se usa el `HerramientaIsland` ya existente (no hace falta componente nuevo).

### 3.5 Capa B — pasada editorial (las 9 asignaturas, unidades clave)
- Criterio de «unidad clave»: existe un recurso de alto valor que encaja limpio en el hilo de la
  lección. No incrustar por incrustar.
- Mecanismos: `import HerramientaIsland` / `import RecursoDestacado` al inicio del MDX y usarlo en el cuerpo.
- Se hace tras consolidar A (para que el patrón visual del cajón ya exista).

## 4. Entregables y fases

**Fase A (backbone, merge 1):** índice inverso + `RecursosRelacionados` + inserción en la página +
cierre Cajút. Cubre las 88 unidades. Tests + build verde.

**Fase B (editorial, merge 2):** `RecursoDestacado` + pasada de incrustados inline en unidades clave
de las 9 asignaturas.

## 5. Testing
- `src/lib/recursos-relacionados.test.ts`: dada una unidad conocida (p. ej. `eco-1bach` u.1 con
  `econrisk`), devuelve el recurso; ignora borradores; unidad sin recursos → grupos vacíos sin
  excepción; los `href` apuntan a rutas válidas.
- `astro build` completo verde: las 88 unidades renderizan el cajón; sin enlaces rotos.

## 6. Riesgos
- **Coste de cómputo**: el índice se construye UNA vez y se consulta; no por página.
- **Enlaces rotos**: validados con `findBrokenUnidadRefs`; build falla si hay refs a unidades no publicadas.
- **Ruido visual**: el cajón solo muestra grupos no vacíos; Cajút es el único elemento universal.
- **Capa B subjetiva**: criterio explícito (encaje limpio) + revisión de calidad antes del merge.

## 7. Fuera de alcance
- Olimpiada y generadores en el cajón.
- Crear vínculos de unidad nuevos (los juegos ya los tienen).
- Diapositivas (fase posterior).
- Traducción ca/val.
