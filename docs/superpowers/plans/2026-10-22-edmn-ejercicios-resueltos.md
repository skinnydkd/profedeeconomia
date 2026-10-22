# Ejercicios resueltos de EDMN por familia — plan de implementación

> **Para agentes:** SUB-SKILL OBLIGATORIA: usar superpowers:subagent-driven-development (recomendada) o superpowers:executing-plans para ejecutar este plan tarea a tarea. Los pasos llevan casillas (`- [ ]`) para el seguimiento.

**Objetivo:** convertir los 15 problemas resueltos del cuaderno EBAU de EDMN en cinco páginas indexables, una por familia de ejercicio (`/edmn-2bach/ebau/<slug>/` y `/ca/...`), sin que el cuaderno web ni el impreso pierdan contenido.

**Arquitectura:**
- Una colección de contenido nueva, `ebauProblemas`, con un fichero MDX por familia e idioma. Es la única fuente de cada problema.
- Un helper puro, `src/lib/ebau.ts`, que intercala las familias después de la sección del cuaderno marcada con `incluye_problemas`. Lo usan los tres consumidores actuales del cuaderno:
  - en `/ebau/` muestra las familias como enlaces;
  - en las dos páginas `imprimir` las muestra con el contenido completo.
- Una ruta nueva, `src/pages/[asignatura]/ebau/[slug].astro`, para la página de cada familia.

**Stack:** Astro 5 (content collections con `glob` loader), MDX, Preact (calculadoras existentes), Vitest.

**Spec:** `docs/superpowers/specs/2026-10-22-edmn-ejercicios-resueltos-design.md`

## Restricciones globales

- **Una sola fuente:** cada problema vive en un único fichero. Los problemas de `03-problemas-resueltos.mdx` se **mueven**, no se copian.
- **Cuaderno impreso intacto:** `/edmn-2bach/ebau/imprimir/` y el apéndice EBAU de `/edmn-2bach/libro/imprimir/` conservan los 15 problemas en el mismo orden.
- **Paridad ES/CA:** cada `.mdx` de familia tiene su gemelo `.ca.mdx`.
- **Publicación:** solo se renderiza `estado: 'publicado'`. Todo contenido nuevo pasa el agente `content-reviewer` y la revisión de Pau antes de publicarse.
- **Sin copiar** enunciados de exámenes oficiales: los problemas nuevos son originales.
- **Estructura:** no se crea ninguna sección nueva. La única ruta nueva es `/[asignatura]/ebau/[slug]/`, que Pau aprobó el 2026-10-22.
- **Diseño:** se usan los estilos editoriales existentes. Las cajas llevan un borde simétrico de 1px, sin una franja lateral de color (CLAUDE.md, `docs/design-system.md`).
- **Código:** TypeScript estricto, sin `any`, comentarios en inglés, ficheros en kebab-case, Conventional Commits en inglés.
- **Fecha límite:** tareas 1–8 publicadas **antes de que acabe febrero de 2027** (temporada de búsqueda: abril–junio).
- **Git:** rama `feat/edmn-ejercicios-resueltos` desde `main` y PR contra `main`, sin push directo. Las tareas 6 a 10 van en PR propios.

## Foco de revisión

1. **Slug reservado:** una familia con slug `imprimir` o `examenes` taparía una ruta existente. Debe fallar un test (tarea 1).
2. **Familia en `borrador`:** no tiene ruta, no sale en la lista de `/ebau/`, ni en `imprimir` ni en los enlaces del libro o de las calculadoras (tareas 1 y 5).
3. **Asignaturas con cuaderno y sin familias (EEAE, GPE):** su `/ebau/` y su `imprimir` salen idénticos a como estaban (tareas 1 y 4).
4. **Familia sin gemelo `.ca.mdx` publicado:** `/ca/.../<slug>/` muestra el castellano con `contentLang="es"` y `translated={false}`, igual que el resto del sitio, sin dar un 404 (tarea 3).
5. **Número de problemas:** el total de cabeceras `### Problema` entre las familias de EDMN coincide en ES y en CA y no baja de 15 (tarea 2).

---

### Tarea 1: colección `ebauProblemas` y helper de intercalado

**Ficheros:**
- Modificar: `src/content.config.ts`. Añadir el campo `incluye_problemas` al esquema `ebau` y crear la colección `ebauProblemas`, exportada en `collections`.
- Crear: `src/lib/ebau.ts`
- Test: `src/lib/ebau.test.ts`
- Modificar: `src/content/frontmatter-bessons.test.ts`. Añadir `'ebau-problemas'` a la lista de carpetas comprobadas (la constante cerca de la línea 22).

**Interfaces:**
- Esquema `ebau`: campo nuevo `incluye_problemas: z.boolean().default(false)`.
- Colección `ebauProblemas`:
  - `loader: glob({ pattern: 'asignaturas/*/ebau-problemas/*.{md,mdx}', base: './src/content' })`.
  - Esquema:

```ts
{
  asignatura: z.enum(ASIGNATURA_SLUGS),
  orden: z.number().int().min(0),
  title: z.string(),
  seoTitle: z.string().optional(),
  descripcion: z.string(),
  unidad_relacionada: z.number().int().min(1),
  /** Slug of the recurso holding this family's calculator, e.g. 'calculadora-punto-muerto'. */
  calculadora: z.string().optional(),
  lang: z.enum(LANGS).default('es'),
  estado: z.enum(ESTADOS),
}
```

- Produce, en `src/lib/ebau.ts`:
  - `export const RUTAS_RESERVADAS_EBAU = ['imprimir', 'examenes'] as const;`
  - `export function slugFamilia(id: string): string`: quita el prefijo de asignatura y carpeta, el prefijo numérico `NN-` y el sufijo `.ca`. Por ejemplo, `edmn-2bach/ebau-problemas/01-punto-muerto-ejercicios-resueltos` da `punto-muerto-ejercicios-resueltos`.
  - El tipo:

```ts
export type BloqueEbau<S, F> =
  | { kind: 'seccion'; entry: S }
  | { kind: 'familias'; entries: F[] };
```

  - `export function intercalarFamilias<S extends { data: { orden: number; incluye_problemas: boolean } }, F extends { data: { orden: number } }>(secciones: S[], familias: F[]): BloqueEbau<S, F>[]`:
    - ordena las secciones por `orden`;
    - después de la primera sección con `incluye_problemas`, mete un único bloque `familias` con las familias ordenadas por `orden`;
    - si no hay familias, no mete ningún bloque;
    - si ninguna sección tiene la marca y sí hay familias, pone el bloque al final.

  Quien llama filtra por `estado` y por asignatura antes de llamar: el helper no conoce ni el estado ni el idioma.

- [ ] **Paso 1: escribir los tests que fallan**, en `src/lib/ebau.test.ts`:
  - `slugFamilia('edmn-2bach/ebau-problemas/01-punto-muerto-ejercicios-resueltos')` devuelve `'punto-muerto-ejercicios-resueltos'`; la variante con `.ca` al final devuelve lo mismo.
  - `intercalarFamilias`:
    - con secciones de orden `[0,1,2,3,4]`, la de orden 3 marcada y familias de orden `[2,1]`, los `kind` salen como `['seccion','seccion','seccion','seccion','familias','seccion']` y las familias en orden `[1,2]`;
    - con familias `[]`, sale una lista de solo bloques `seccion`, igual que las secciones ordenadas (foco 3);
    - con familias y ninguna sección marcada, el último bloque es `familias`.
  - Guarda de slugs: carga con `import.meta.glob('/src/content/asignaturas/*/ebau-problemas/*.{md,mdx}')` y comprueba que ningún `slugFamilia` está en `RUTAS_RESERVADAS_EBAU` (foco 1). Con cero ficheros pasa: la guarda vale para las tareas siguientes.

- [ ] **Paso 2:** ejecutar `npx vitest run src/lib/ebau.test.ts`. Debe fallar porque el módulo `./ebau` no existe.
- [ ] **Paso 3:** implementar `src/lib/ebau.ts` y los cambios de esquema en `src/content.config.ts`.
- [ ] **Paso 4:** ejecutar `npx vitest run src/lib/ebau.test.ts src/content/frontmatter-bessons.test.ts` y `npx astro check`. Deben pasar los tests y no salir errores de tipos.
- [ ] **Paso 5: commit** con `feat(ebau): ebauProblemas collection and family interleaving helper`.

### Tarea 2: mover los problemas a cinco familias

**Ficheros:**
- Crear: `src/content/asignaturas/edmn-2bach/ebau-problemas/`, con estos cinco pares `.mdx` + `.ca.mdx`:

| Fichero | `title` (ES) | Problemas que se mueven | `unidad_relacionada` | `calculadora` |
|---|---|---|---|---|
| `01-punto-muerto-ejercicios-resueltos` | Costes y punto muerto | 1.1, 1.2, 1.3, más el apartado «Representación gráfica del punto muerto» | 7 | `calculadora-punto-muerto` |
| `02-productividad-ejercicios-resueltos` | Productividad y eficiencia | 2.1, 2.2, 2.3 | 7 | `calculadora-productividad` |
| `03-van-tir-payback-ejercicios-resueltos` | Selección de inversiones: VAN, TIR y payback | 3.1, 3.2, 3.3 | 9 | `calculadora-van-tir` |
| `04-balance-cuenta-resultados-ejercicios-resueltos` | Balance y cuenta de pérdidas y ganancias | 4.1, 4.2 | 10 | `cuenta-resultados` |
| `05-ratios-fondo-maniobra-ejercicios-resueltos` | Ratios, fondo de maniobra y rentabilidades | 5.1, 5.2, 5.3 | 11 | `calculadora-ratios` |

- Modificar: `src/content/asignaturas/edmn-2bach/ebau/03-problemas-resueltos.mdx` y `.ca.mdx`. Se quedan solo con la introducción (el texto antes del primer `## Costes y punto muerto`) y llevan `incluye_problemas: true` en el frontmatter.
- Test: `src/content/ebau-problemas.test.ts`

Reglas del movimiento:
- Cada familia es `orden` 1–5 y `estado: publicado`, igual que la sección de origen.
- El recordatorio de conceptos de cada sección (`> **CT = …**`) pasa a ser el inicio del fichero de la familia.
- Las cabeceras pasan de `### Problema 1.2 — …` a `### Problema 2 — …`: se numeran dentro de cada familia.
- El resto del texto no cambia.
- `descripcion` y `seoTitle` se dejan provisionales; las tareas 6–10 los afinan.

- [ ] **Paso 1: escribir el test que falla**, en `src/content/ebau-problemas.test.ts`. Lee los ficheros de `edmn-2bach/ebau-problemas/` con `fs` y comprueba:
  - hay 5 ficheros ES y 5 CA;
  - el número de líneas que empiezan por `### Problema` es igual en ES y en CA y es ≥ 15 (foco 5);
  - `03-problemas-resueltos.mdx` ya no contiene ninguna línea `### Problema`.
- [ ] **Paso 2:** ejecutar `npx vitest run src/content/ebau-problemas.test.ts`. Debe fallar con 0 ficheros.
- [ ] **Paso 3:** antes de mover nada, ejecutar `npm run build` y guardar el número de `<h3` que contienen «Problema» en `dist/edmn-2bach/ebau/imprimir/index.html` como valor de referencia (hoy deberían ser 15).
- [ ] **Paso 4:** mover el contenido según la tabla, en ES y en CA.
- [ ] **Paso 5:** ejecutar `npx vitest run src/content/` y confirmar que pasa.
- [ ] **Paso 6: commit** con `refactor(ebau): split EDMN solved problems into five families`.

Esta tarea y la 4 van en el mismo PR. Entre las dos, `imprimir` pierde los problemas temporalmente.

### Tarea 3: página de cada familia

**Ficheros:**
- Crear: `src/components/ebau/EbauProse.astro`. Es un envoltorio `<article class="prose"><slot /></article>` con las reglas `.prose` que ahora están en `src/pages/[asignatura]/ebau/index.astro` (las líneas de `<style>` que empiezan por `.prose`). Se mueven a este componente.
- Modificar: `src/pages/[asignatura]/ebau/index.astro`, para que use `EbauProse`.
- Crear: `src/pages/[asignatura]/ebau/[slug].astro`

**Interfaces:**
- Consume `slugFamilia` (tarea 1), `pickLocalizedEntry` (`src/i18n/content-locale.ts:9`), `articleLd` (`src/lib/seo.ts:157`), `breadcrumbLd`, `BaseLayout` y `SectionHeader`, con los mismos props que usa `ebau/index.astro`.
- `getStaticPaths`:
  - solo entradas `ebauProblemas` con `estado === 'publicado'` y `lang === 'es'`;
  - `params: { asignatura, slug: slugFamilia(e.id) }`;
  - las versiones CA se eligen al renderizar con `pickLocalizedEntry`, igual que en `ebau/index.astro`.
- Contenido de la página:
  - **título**: `seoTitle ?? title` para `<title>`, y `title` como `<h1>`;
  - **descripción**: `descripcion`;
  - **migas de pan**: Inicio › `a.shortLabel` › Preparación EBAU (`/${slug}/ebau/`) › `title`;
  - **cuerpo**: el MDX dentro de `EbauProse`;
  - **bloque final de enlaces**, en este orden:
    1. «Comprueba tus resultados con la calculadora» → `/${asignatura}/recursos/${calculadora}/`, solo si `calculadora` existe;
    2. «Teoría en el libro: Unidad N» → la URL de la unidad `unidad_relacionada`, construida como en `src/pages/[asignatura]/libro/index.astro`;
    3. «Exámenes oficiales para practicar» → `/${asignatura}/ebau/examenes/`.

    Los textos del bloque van en un objeto `copy` `es`/`ca`, como en las demás páginas.
  - **JSON-LD**: `[breadcrumb, articleLd({...})]`, con los mismos campos que pasan las unidades del libro.
  - **`contentLang` y `translated`**: igual que en `ebau/index.astro` (foco 4).

- [ ] **Paso 1:** implementar la página y el componente.
- [ ] **Paso 2:** ejecutar `npm run build` y comprobar:
  - existen `dist/edmn-2bach/ebau/punto-muerto-ejercicios-resueltos/index.html` y `dist/ca/edmn-2bach/ebau/punto-muerto-ejercicios-resueltos/index.html`;
  - el `<title>` del primero contiene «punto muerto»;
  - el sitemap generado (`dist/sitemap-0.xml`) contiene las 10 URLs nuevas;
  - `dist/edmn-2bach/ebau/imprimir/index.html` y `dist/edmn-2bach/ebau/examenes/index.html` siguen existiendo (foco 1).
- [ ] **Paso 3:** revisar visualmente una familia en ES y en CA con `npm run preview`, a 375px y en escritorio.
- [ ] **Paso 4: commit** con `feat(ebau): one indexable page per solved-problem family`.

### Tarea 4: el cuaderno web enlaza y el impreso incrusta

**Ficheros:**
- Modificar: `src/pages/[asignatura]/ebau/index.astro`
- Modificar: `src/pages/[asignatura]/ebau/imprimir.astro`, cerca de la línea 149 (`.ebau-sec`).
- Modificar: `src/pages/[asignatura]/libro/imprimir.astro`, en las líneas 22–56 (carga) y 94 (render).

**Interfaces:** consume `intercalarFamilias` y `BloqueEbau` (tarea 1). Cada página carga `getCollection('ebauProblemas')`, filtra por asignatura y por `estado === 'publicado'` (en `libro/imprimir.astro`, el mismo `caPub` que ya usa para `ebau`) y localiza con `pickLocalizedEntry`.

- **`/ebau/`:** el bloque `familias` se pinta como una lista de enlaces, uno por familia (`title` → `/${slug}/ebau/${slugFamilia(id)}/`), con el `descripcion` debajo, en una caja de borde simétrico de 1px.
- **Las dos páginas `imprimir`:** el bloque `familias` renderiza el `Content` de cada familia, cada uno en su propio `.ebau-sec`, con salto de página como el resto de secciones.

- [ ] **Paso 1:** implementar los tres cambios.
- [ ] **Paso 2:** ejecutar `npm run build` y comprobar:
  - el número de `<h3` con «Problema» en `dist/edmn-2bach/ebau/imprimir/index.html` es igual al valor de referencia de la tarea 2, paso 3;
  - lo mismo en `dist/ca/edmn-2bach/ebau/imprimir/index.html`;
  - `dist/edmn-2bach/ebau/index.html` no contiene ningún `### Problema` renderizado, pero sí 5 enlaces a `/edmn-2bach/ebau/*-ejercicios-resueltos/`;
  - `dist/eeae-bach/ebau/index.html` y `dist/gpe-bach/ebau/index.html` son idénticos (`diff`) a los generados antes de la tarea 1, en una copia hecha en `main` (foco 3).
- [ ] **Paso 3:** regenerar el PDF del cuaderno con `node scripts/build-ebau-pdf.mjs edmn-2bach`. Antes, comprobar en el script cuál es la invocación exacta y cómo se sube a Vercel Blob (`scripts/upload-pdfs-to-blob.mjs`, PR #359). Revisar visualmente que el PDF contiene las cinco familias.
- [ ] **Paso 4: commit** con `feat(ebau): notebook links families on the web and embeds them in print`.
- [ ] **Paso 5:** ejecutar `npm test` completo. Pasa → abrir el PR de las tareas 1–4.

### Tarea 5: enlaces internos hacia las familias

**Ficheros:**
- Modificar: `src/lib/ebau.ts` y `src/lib/ebau.test.ts`
- Modificar: `src/pages/[asignatura]/libro/[unidad].astro`
- Modificar: `src/pages/[asignatura]/recursos/[slug].astro`
- Crear: `src/content/asignaturas/edmn-2bach/recursos/calculadora-productividad.md` y `.ca.md`. Se copian del par de `gpe-bach`, con `asignatura: edmn-2bach` y `unidad_relacionada: 7`.

**Interfaces** (producidas en `src/lib/ebau.ts`; quien llama pasa las entradas ya filtradas por `publicado`):
- `familiasDeUnidad<F extends { data: { asignatura: string; unidad_relacionada: number } }>(familias: F[], asignatura: string, unidad: number): F[]`
- `familiaDeCalculadora<F extends { data: { asignatura: string; calculadora?: string } }>(familias: F[], asignatura: string, recurso: string): F | undefined`

- [ ] **Paso 1: escribir los tests que fallan:**
  - `familiasDeUnidad(fams, 'edmn-2bach', 7)` devuelve las dos familias de la unidad 7 ordenadas por `orden`;
  - con la unidad 3 devuelve `[]`;
  - `familiaDeCalculadora(fams, 'edmn-2bach', 'calculadora-van-tir')` devuelve la familia 03;
  - con otra asignatura devuelve `undefined`;
  - una familia en `borrador` queda fuera porque quien llama la filtra. El test pasa la lista ya filtrada y verifica que no aparece (foco 2).
- [ ] **Paso 2:** ejecutar `npx vitest run src/lib/ebau.test.ts`. Debe fallar.
- [ ] **Paso 3:** implementar las funciones. En la unidad del libro, al final, añadir el enlace «Ejercicios resueltos tipo EBAU: {title}» si hay familias. En el recurso, el enlace «Practica con ejercicios resueltos: {title}» si hay familia. Los textos van en ES y CA.
- [ ] **Paso 4:** ejecutar `npx vitest run src/lib/ebau.test.ts` y `npm run build`, y comprobar:
  - `dist/edmn-2bach/libro/07-funcion-productiva/index.html` enlaza a las familias 01 y 02;
  - `dist/edmn-2bach/recursos/calculadora-van-tir/index.html` enlaza a la familia 03;
  - existe `dist/edmn-2bach/recursos/calculadora-productividad/index.html`.
- [ ] **Paso 5: commit** con `feat(ebau): link solved-problem families from book units and calculators`, en el mismo PR que las tareas 1–4.

### Tareas 6–10: completar cada familia (un PR por familia)

En este orden:
- **6**: balance y cuenta de resultados (le faltan problemas para no quedar delgada);
- **7**: punto muerto;
- **8**: VAN/TIR;
- **9**: ratios;
- **10**: productividad.

**Ficheros:** el par `.mdx`/`.ca.mdx` de la familia.

Mínimos de la spec por familia:

| Tarea | Familia | Problemas nuevos | Tema obligatorio |
|---|---|---|---|
| 6 | 04 balance y PyG | 2 | uno de amortización lineal |
| 7 | 01 punto muerto | 1 | — |
| 8 | 03 VAN/TIR | 1 | — |
| 9 | 05 ratios | 1 | periodo medio de maduración |
| 10 | 02 productividad | 1 | — |

Cada familia queda así, de arriba abajo:
1. `## Formulario`: fórmulas con las siglas que usan los correctores.
2. Los problemas, de fácil a tipo examen. Cada uno con enunciado, **Planteamiento**, **Cálculo**, **Resultado: … unidades** e **Interpretación: …**.
3. `## Errores típicos que restan puntos`: de 3 a 5 viñetas.

Además, cada familia recibe su `seoTitle` definitivo (≤ 60 caracteres, con «ejercicios resueltos» y, si cabe, «EBAU» o «EDMN») y su `descripcion` (≤ 155 caracteres).

- [ ] **Paso 1:** crear la rama `feat/edmn-ejercicios-<familia>` desde `main`.
- [ ] **Paso 2:** redactar el contenido en ES. Los problemas nuevos tienen datos originales, y cada cifra se comprueba con la calculadora de la familia o, si no la hay, a mano en el mismo paso.
- [ ] **Paso 3:** traducir a CA con el mismo número de problemas y las mismas cifras.
- [ ] **Paso 4:** pasar el agente `content-reviewer` sobre el par de ficheros y corregir lo que encuentre.
- [ ] **Paso 5:** ejecutar `npx vitest run src/content/` y `npm run build` y confirmar que pasan. El test de la tarea 2 sigue dando el mismo número de problemas en ES y en CA.
- [ ] **Paso 6:** commit `feat(edmn): <familia> solved problems — formulas, new problems, common mistakes` y abrir el PR. **Pau lo revisa antes del merge**, dejando al menos 1 h entre abrir y fusionar, como pide el CLAUDE.md.

### Tarea 11: medir (después de publicar la tarea 7)

- [ ] **Paso 1:** pedir en Search Console la indexación de las 5 URLs ES.
- [ ] **Paso 2:** añadir a `docs/seo-estrategia-2026.md` la sección `### 5.12 Ejercicios resueltos de EDMN por familia`, con:
  - la fecha de publicación;
  - las URLs;
  - los valores de partida, sacados de la revisión de GSC del 2026-10-22: 458 impresiones visibles de EDMN en 3 meses, la calculadora de punto muerto en la posición 14,5 y ninguna impresión para las consultas de concepto;
  - los puntos de control: 30 días después de publicar, y abril y mayo de 2027.
- [ ] **Paso 3:** commit con `docs(seo): track EDMN solved-problem family pages`.
