# Spec — Sección «Herramientas» (caja de herramientas transversal: calculadoras)

- **Fecha**: 2026-06-03
- **Autor**: Pau Monterde (profedeeconomia.es)
- **Estado del spec**: en revisión
- **Tipo**: nueva sección transversal (registro TS) + reaprovechamiento de las islas existentes + renombrado de la sección actual

## 1. Objetivo

Crear una sección transversal **`/herramientas/`** que reúna en un solo sitio la
**caja de herramientas de aula**: las calculadoras y simuladores interactivos del web,
organizados por familia temática y ligados a las unidades y competencias en las que
encajan. Hoy esas 17 islas viven dispersas dentro de `recursos` por asignatura; esta
sección las agrega y las hace descubribles de forma transversal.

Primera entrega = **marco + reaprovechamiento de las 17 islas existentes** (sin
calculadoras nuevas ni plantillas todavía — ver §7).

## 2. Decisiones de alcance (acordadas en brainstorming)

- **Sección nueva y dedicada**, organizada **por familia temática** (como Dinámicas y
  Debates) con un **tag de tipo** por herramienta (calculadora / simulador / test / …).
- **Reaprovechar las 17 islas** ya existentes (`src/components/calculadoras/*`). No se
  crean calculadoras nuevas en esta entrega.
- **Renombrado**: la sección actual `/herramientas/` (que solo enlaza 2 generadores
  docentes externos, orientados a programación) pasa a llamarse **«Generadores»** en
  `/generadores/`. El nombre «Herramientas» y la URL `/herramientas/` quedan para la
  caja de herramientas nueva (más general y útil).
- **Modelo de contenido = registro TS + mapa curricular derivado** (enfoque A): un
  registro `HERRAMIENTAS` con los metadatos por herramienta; el mapa de unidades se
  **deriva** de los `recursos` que ya embeben cada componente (single source of truth).

## 3. Arquitectura

### 3.1 Renombrado de la sección actual → «Generadores»

- Mover el contenido de `src/pages/herramientas/index.astro` (los 2 generadores de
  oposicioneseconomia.es) a **`src/pages/generadores/index.astro`**, con título
  «Generadores», breadcrumb `Inicio › Generadores`, y la misma copia (ajustando la
  palabra «Herramientas» → «Generadores» donde aparezca).
- En `SECCIONES_TRANSVERSALES` (`src/lib/asignaturas.ts`): la entrada existente
  `herramientas` se **reescribe** para apuntar a la caja de herramientas nueva
  (label «Herramientas», nueva descripción), y se **añade** una entrada `generadores`
  (label «Generadores», descripción de los generadores docentes).
- No hace falta redirect: `/herramientas/` sigue existiendo (ahora sirve la caja de
  herramientas); los generadores nunca tuvieron URL propia (eran enlaces salientes).

### 3.2 Registro de herramientas (`src/lib/herramientas.ts`)

La clave de cada herramienta es su `componente`, que **ya existe** como enum en el
schema de `recursos` (`src/content.config.ts`). Esos 17 valores son la lista canónica:

`PuntoMuerto, VANTIR, Ratios, ADASSimulator, InteresCompuesto, NominaESO,
Presupuesto503020, BuscadorItinerarios, GeneradorCVEuropass, DCF, RatiosBenchmark,
Elasticidad, MultiplicadorGasto, IRPFDeclaracion, CocheVsAlternativa, RIASEC,
PresupuestoUni`.

```ts
export type ComponenteKey = /* la unión de los 17 valores del enum de recursos */;
export type TipoHerramienta = 'calculadora' | 'simulador' | 'test' | 'generador' | 'buscador' | 'plantilla';

export interface Herramienta {
  componente: ComponenteKey;   // clave del island (coincide con recursos.componente)
  slug: string;                // slug de URL, p. ej. 'punto-muerto'
  title: string;
  familia: string;             // slug de FAMILIAS_HERRAMIENTA
  orden: number;               // orden dentro de la familia
  tipo: TipoHerramienta;
  descripcion: string;         // one-liner para card y detalle
  competencias_clave: string[];
  competencias_especificas: string[];   // [] en esta entrega
}

export const FAMILIAS_HERRAMIENTA: Familia[];  // de familia-grouping
export const HERRAMIENTAS: Herramienta[];
export function herramientaPorSlug(familia: string, slug: string): Herramienta | undefined;
```

Reutiliza los helpers genéricos de `src/lib/familia-grouping.ts` (`groupByFamilia`,
`Familia`) — el registro se adapta a la forma `HasFamilia` para agrupar en el hub.

### 3.3 Las 5 familias y el reparto de las 17 herramientas

| Familia | slug | colorVar | Herramientas (componente) |
|---|---|---|---|
| Costes y resultados | `costes-resultados` | `--color-edmn` | PuntoMuerto, Ratios, RatiosBenchmark |
| Mercados y macroeconomía | `mercados-macro` | `--color-eco1` | Elasticidad, ADASSimulator, MultiplicadorGasto |
| Inversión y finanzas | `inversion-finanzas` | `--color-mustard` | VANTIR, DCF, InteresCompuesto |
| Finanzas personales | `finanzas-personales` | `--color-fopp` | NominaESO, IRPFDeclaracion, PresupuestoUni, Presupuesto503020, CocheVsAlternativa |
| Orientación y FP | `orientacion-fp` | `--color-ipe2` | RIASEC, GeneradorCVEuropass, BuscadorItinerarios |

`tipo` por herramienta: casi todas `calculadora`; `ADASSimulator` → `simulador`;
`RIASEC` → `test`; `GeneradorCVEuropass` → `generador`; `BuscadorItinerarios` → `buscador`.
(Colores: todos tokens existentes en global.css, sin colores nuevos.)

### 3.4 Renderizador de islas compartido (`src/components/calculadoras/HerramientaIsland.astro`)

Hoy el bloque «importar las 17 islas + render condicional por `componente` con
`client:load`» vive en `src/pages/[asignatura]/recursos/[slug].astro`. Se **extrae** a
`HerramientaIsland.astro` (prop `componente: ComponenteKey`) y se **reutiliza** en:
- `src/pages/[asignatura]/recursos/[slug].astro` (refactor: sustituye el bloque inline).
- la página de detalle nueva de la caja de herramientas.

Refactor pequeño y justificado (DRY): evita mantener el dispatch duplicado en dos
sitios. El comportamiento de recursos no cambia (sus tests y páginas siguen igual).

### 3.5 Páginas

- `src/pages/herramientas/index.astro` — **hub**: familias en orden (`groupByFamilia`),
  cards por herramienta (title, descripcion, tag de tipo), color por familia, filtro
  cliente por familia. Mismo patrón que los hubs de Dinámicas/Debates.
- `src/pages/herramientas/[familia]/[slug].astro` — **detalle**: ruta de dos params (NO
  catch-all). Renderiza la isla vía `<HerramientaIsland componente={h.componente} />`,
  el mapa curricular (`PuenteUnidades` con las unidades **derivadas**, §3.6) y las
  competencias. `getStaticPaths` itera `HERRAMIENTAS`.

### 3.6 Mapa curricular derivado de `recursos`

Cada `recurso` publicado ya declara `{ asignatura, unidad_relacionada, componente }`.
Un helper puro agrega, por `componente`, el conjunto de `{ asignatura, unidad }` de los
recursos que lo usan:

```ts
// en herramientas.ts (o un módulo aparte), testeable
export function unidadesPorComponente(
  recursos: { data: { componente?: string; asignatura: string; unidad_relacionada?: number } }[]
): Map<string, { asignatura: string; unidad: number }[]>;
```

La página de detalle llama a `getCollection('recursos')`, construye el mapa una vez, y
pasa `mapa.get(h.componente) ?? []` a `PuenteUnidades`. Así la ubicación curricular es
**single source of truth** (vive en recursos) y nunca se desincroniza. Si una
herramienta no está en ningún recurso, su mapa queda vacío (PuenteUnidades no pinta nada).

### 3.7 Menú

`SECCIONES_TRANSVERSALES` (`src/lib/asignaturas.ts`) tras los cambios:
`juegos, herramientas (caja de herramientas), generadores, emprendimiento, dinamicas,
debates, jocs-economics`. (Orden exacto a fijar en el plan; los tests se ajustan.)

## 4. Competencias

`competencias_clave` se rellena por herramienta de forma breve y razonada (p. ej. STEM/
CD en las calculadoras numéricas; CPSAA/CE en orientación). `competencias_especificas`
queda `[]` en esta entrega (se afinará por unidad cuando se cablee a nivel de saberes).

## 5. Testing (TDD para la lógica)

- `src/lib/herramientas.test.ts` — el registro tiene 17 entradas; todo `componente`
  pertenece al enum canónico; todo `familia` existe en `FAMILIAS_HERRAMIENTA`; slugs
  únicos; familias bien formadas (colorVar válido); `herramientaPorSlug` resuelve y
  devuelve undefined en un slug inexistente.
- `src/lib/herramientas.test.ts` (o módulo aparte) — `unidadesPorComponente` agrupa
  correctamente y deduplica `{asignatura, unidad}`.
- `src/lib/asignaturas.test.ts` — cubre la entrada `herramientas` (caja) y la nueva
  `generadores`.
- Verificación final: `astro build` completo verde (local + Vercel). El hub y los 17
  detalles prerenderizan; las islas hidratan con `client:load`.

(No se añade test de print-isolation: las calculadoras no tienen ficha imprimible en
esta entrega. Cualquier `.ts`/`.test.ts` bajo `src/pages/herramientas/` iría con
prefijo `_` por la lección del build-break, pero aquí no hace falta ninguno.)

## 6. Coherencia visual

Hub y detalle reusan los patrones de Dinámicas/Debates (mismas clases, tipografía,
tokens). El detalle envuelve la isla en `.container--narrow`. Sin colores nuevos. Sin
emojis pictográficos. El tag de tipo es una etiqueta tipográfica pequeña.

## 7. Fuera de alcance (fases futuras)

- **Plantillas interactivas** DAFO, Business Model Canvas, BCG Matrix (rellenables +
  imprimibles). Son el tipo `plantilla`, reservado en el enum pero **no** construido aquí.
- **Calculadoras nuevas**: productividad, equilibrio de mercado (precio/cantidad). Futuro.
- Reordenar o tocar las calculadoras existentes por dentro (su lógica en `src/lib/calc`
  no se modifica; solo se reaprovechan las islas).
- Traducción ca/val (estructura preparada; contenido solo `es`).

## 8. Riesgos y mitigaciones

- **El refactor de `HerramientaIsland` rompe recursos**: mitigado porque el dispatch es
  idéntico (mismo `componente` → misma isla, `client:load`); las páginas de recursos
  existentes deben seguir construyendo y mostrando las calculadoras igual. Verificar con
  build + revisión de una página de recurso.
- **Mapa curricular vacío** para alguna herramienta sin recurso asociado: aceptable
  (PuenteUnidades no pinta nada); se puede enriquecer luego añadiendo recursos o un
  override manual en el registro. No bloquea.
- **Colisión de nombres con la sección renombrada**: mitigado moviendo los generadores a
  `/generadores/` y actualizando el menú en el mismo cambio.
- **Build-break por fichero suelto en `src/pages/`**: no se crean `.ts` bajo
  `src/pages/herramientas/`; si hiciera falta, prefijo `_`.
