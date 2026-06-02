# Spec — Secció «Dinámicas» (catálogo transversal de dinámicas de aula)

- **Fecha**: 2026-06-02
- **Autor**: Pau Monterde (profedeeconomia.es)
- **Estado del spec**: en revisión
- **Tipo**: nueva sección transversal + content collection + catálogo de contenido

## 1. Objetivo

Añadir una nueva sección transversal `/dinamicas/` (dentro del menú «Otros», junto a
Juegos, Herramientas y Emprendimiento) con un catálogo de **dinámicas de aula
presenciales** —role-plays, simulaciones de mercado, juegos experimentales,
debates y negociaciones— pensadas para hacer en clase.

Cada dinámica trae:

- Explicación y desarrollo paso a paso.
- **Materiales repartibles** (tarjetas de rol, fichas de posición, hojas de
  observación) listos para imprimir.
- **Guía del profesor**, con foco en la **preparación** y el **debrief/cierre**.
- Mapa de **encaje curricular**: en qué unidades de qué asignaturas encaja cada una.
- **Competencias** (clave y específicas) y **saberes** que se trabajan.

Es contenido **transversal y reutilizable**: la misma entrevista de trabajo sirve
para FOPP, EEAE, GPE, IPE y Taller. No se duplica por asignatura.

## 2. Decisiones de alcance (acordadas en brainstorming)

- **Catálogo completo** desde el inicio (~24 dinámicas, 7 familias). Se entregará
  en bloques (PRs) revisables, no en un solo PR.
- **Materiales «todo en la página + imprimible»**: cada dinámica es una página web
  completa con todo el material, más un botón «Imprimir materiales» con estilos
  `@media print` limpios. Sin pipeline de PDF dedicado.
- Familias añadidas por petición de Pau: **Sistemas económicos / debates**,
  **Empresa / organización** y **Teoría de juegos** (con un laboratorio de varios
  juegos y una dinámica de tipos de subasta).

## 3. Por qué una sección transversal (y no `actividades` por asignatura)

La alternativa de modelar cada dinámica como `actividades` con `tipo:'dinamica'`
dentro de cada asignatura se **descarta**: duplicaría la misma entrevista en 5
asignaturas y rompería la reutilización. Las `actividades` con `tipo:'dinamica'`
existentes siguen siendo legítimas (dinámicas ligadas a una unidad concreta); las
nuevas viven en una colección propia, transversal, con mapa multi-asignatura.
Sigue el patrón ya validado de «De cero a empresa» (`proyectoTransversal`).

No altera la estructura por asignaturas (decisión vinculante de CLAUDE.md): se
añade una sección transversal con nombre propio, exactamente como Juegos,
Herramientas y Emprendimiento.

## 4. Arquitectura

```
src/content/dinamicas/{familia}/{nn}-{slug}.mdx   ← fuente única de cada dinámica
src/pages/dinamicas/index.astro                   ← hub (filtro por familia / asignatura)
src/pages/dinamicas/[slug].astro                  ← página de cada dinámica (+ modo imprimir)
src/components/dinamicas/RoleCard.astro           ← tarjeta de rol imprimible
src/components/dinamicas/FichaAlumno.astro        ← ficha / hoja de trabajo o de observación
src/components/dinamicas/PrintButton.astro        ← botón «imprimir materiales»
src/lib/dinamicas.ts                              ← metadatos de familias (slug, label, color, orden)
```

Más:

- 1 entrada nueva en `SECCIONES_TRANSVERSALES` (`src/lib/asignaturas.ts`):
  `{ slug: 'dinamicas', label: 'Dinámicas', description: 'Role-plays y simulaciones para hacer en clase.' }`.
- 1 colección nueva `dinamicas` en `src/content.config.ts`.

### 4.1 Modelo de contenido (frontmatter)

```ts
const dinamicas = defineCollection({
  loader: glob({ pattern: 'dinamicas/**/*.{md,mdx}', base: './src/content' }),
  schema: z.object({
    title: z.string(),
    familia: z.enum([
      'mercat-treball', 'mercats-preus', 'distribucion-produccion',
      'decisiones-comunes', 'sistemas-debates', 'empresa-organizacion',
      'teoria-juegos',
    ]),
    /** Orden dentro de la familia (también prefijo del fichero). */
    orden: z.number().int().min(0),
    descripcion: z.string(),                  // una línea para la card
    tipo: z.enum(['role-play', 'simulacion-mercado', 'juego-experimental', 'debate', 'negociacion']),
    duracion: z.string(),                     // "1-2 sesiones"
    agrupacion: z.string(),                   // "grupos de 4", "grupo clase"
    participantes: z.string().optional(),     // "20-30", rango orientativo
    nivel: z.array(z.enum(['eso', 'bach', 'fp'])).min(1),
    objetivos: z.array(z.string()).min(1),
    conceptos_clave: z.array(z.string()).default([]),  // saberes
    materiales_necesarios: z.array(z.string()).default([]),
    /** EL MAPA curricular cross-asignatura. */
    unidades_relacionadas: z.array(z.object({
      asignatura: z.enum(ASIGNATURA_SLUGS),
      unidad: z.number().int().min(1),
      nota: z.string().optional(),
    })).default([]),
    competencias_clave: z.array(z.string()).default([]),       // CCL, CP, STEM, CD, CPSAA, CC, CE, CCEC
    competencias_especificas: z.array(z.string()).default([]),
    lang: z.enum(LANGS).default('es'),
    estado: z.enum(ESTADOS).default('borrador'),
  }),
});
```

`estado: 'publicado'` es lo único que se renderiza (no auto-publish; revisión manual de Pau).

### 4.2 Estructura de la página de dinámica (`[slug].astro`)

1. **Hero** — título, descripción, badges de metadatos (duración · agrupación ·
   participantes · nivel) y tag de familia con su color.
2. **Objetivos y conceptos** — desde frontmatter.
3. **Cómo funciona** — desarrollo paso a paso (cuerpo MDX, usa `<Steps>`).
4. **Guía del profesor** — preparación, gestión en el aula, **debrief/cierre**
   (la parte pedagógica clave) y errores comunes. Cuerpo MDX.
5. **Materiales repartibles** — `<RoleCard>` por cada rol + `<FichaAlumno>`
   (hoja de trabajo / de observación). Marcados con `data-print`.
6. **Encaje curricular** — tabla auto-generada desde `unidades_relacionadas`:
   asignatura · unidad · nota. Enlaza a cada unidad.
7. **Competencias trabajadas** — clave + específicas.

**Botón «Imprimir materiales»** → `@media print` que oculta header, teoría y
navegación y deja solo los bloques `data-print` (tarjetas de rol y fichas), cada
uno con `break-after: page` para que salga una por A4.

### 4.3 Hub (`index.astro`)

- Hero editorial sobrio (sin gradientes, sin emojis pictográficos).
- Dinámicas agrupadas por familia; dentro, cards ordenadas por `orden`.
- Filtro ligero por familia y por asignatura (las que tienen esa asignatura en
  `unidades_relacionadas`). Filtro client-side simple, sin framework.
- Cada card: título, descripción, badges (tipo · duración · nivel), color de familia.

### 4.4 Color-coding de familias (sin colores nuevos)

Se reutilizan **tokens de color ya validados** en `global.css` (cero colores
nuevos, respeta «no cambios al sistema visual sin aprobación»):

| Familia | Token reutilizado | Hex |
|---|---|---|
| A · Mercat de treball | `--color-fopp` (berenjena) | #5B3A4E |
| B · Mercats i preus | `--color-eco1` (teal) | #1F6E6E |
| C · Distribució i producció | `--color-gpe` (granate) | #8C2F39 |
| D · Decisions i béns comuns | `--color-taller3` (oliva) | #6B8E23 |
| E · Sistemes econòmics i debats | `--color-ipe2` (azul profundo) | #2F4F7F |
| F · Empresa i organització | `--color-edmn` (terracota) | #C44E2C |
| G · Teoría de juegos | `--color-mustard` (mostaza) | #D4A24C |

## 5. Catálogo completo (~24 dinámicas, 7 familias)

### A · Mercat de treball
1. **La entrevista de trabajo (individual)** — role-play entrevistador / candidato / observador.
2. **La dinámica de grupo (selección grupal)** — caso a resolver mientras se observa.
3. **Negociación salarial** — candidato vs. RRHH con información asimétrica.
4. **El proceso de selección completo** — estaciones (CV, test, entrevista); meta-dinámica que enlaza 1–3.

### B · Mercats i preus
5. **La doble subasta (competencia perfecta)** — compradores/vendedores con valores y costes secretos; emerge el precio de equilibrio.
6. **El monopolista** — un único vendedor fija precio; poder de mercado y pérdida de eficiencia.
7. **El cártel (oligopolio)** — coludir vs. la tentación de traicionar.

### C · Distribució i producció
8. **La cadena de plusvalías** — una cadena de producción reparte el valor añadido: ¿quién se queda qué (trabajo, capital, intermediarios)?
9. **El juego del ultimátum** — reparto de riqueza: justicia vs. racionalidad.
10. **La cadena de montaje** — producción en serie vs. artesanal, división del trabajo y desigualdad de reparto.
11. **El reparto fiscal (asamblea de presupuesto)** — impuestos y redistribución.

### D · Decisions i béns comuns
12. **La tragedia de los comunes** — un recurso compartido se agota.
13. **El juego de los bienes públicos** — contribuir vs. aprovecharse (free-rider).
14. **El dilema del prisionero (repetido)** — cooperación vs. competencia.
15. **Ventaja comparativa (comercio)** — dos «países» producen e intercambian y ganan ambos.

### E · Sistemes econòmics i debats
16. **Mercado vs. planificación** — una mitad asigna recursos por mercado, la otra por comité central.
17. **Debate: ¿más Estado o más mercado?** — debate estructurado con roles, evidencia y turnos.
18. **Asamblea de presupuestos participativos** — decidir en qué gasta «el municipio».
19. **Renta básica (fishbowl)** — debate de pecera sobre la RBU.

### F · Empresa i organització
20. **La junta directiva (crisis)** — toma de decisiones ante una crisis (CEO, CFO, marketing, RRHH).
21. **Fundar una cooperativa** — reparto de roles, decisiones democráticas vs. jerárquicas.
22. **El beer game (cadena de suministro)** — efecto látigo, stock e información.
23. **Negociación con proveedores / clientes** — win-win vs. win-lose.

### G · Teoría de juegos
24. **Laboratorio de teoría de juegos** — circuito por estaciones con varios juegos clásicos:
    *gallina/chicken*, *halcón-paloma*, *batalla de los sexos*, *ciempiés* y uno de
    coordinación (puntos focales de Schelling). Cada estación: matriz de pagos real
    y debrief. La intro enlaza, como columna vertebral, el dilema del prisionero (D),
    el ultimátum (C) y los bienes públicos (D), sin duplicarlos.
25. **Tipos de subasta** — los 4 formatos comparados en el aula: *inglesa* (ascendente),
    *holandesa* (descendente), *sobre cerrado a primer precio* y *Vickrey (segundo precio)*.
    Se observa cómo cambia la estrategia de puja y la revelación del valor real, y
    aparece la *maldición del ganador*.

> Nota: la numeración llega a 25 pero «La subasta» genérica que estaba en la
> familia B se ha fundido en la #25 de teoría de juegos, así que el conteo real de
> fichas es ~24.

## 6. Encaje curricular (orientativo, se afina al redactar cada ficha)

- **Mercat de treball** → FOPP 4ESO, EEAE/GPE Bach, IPE I/II FP, Taller 3ESO.
- **Mercats i preus**, **Teoría de juegos** → Eco 1BACH, Eco 4ESO.
- **Distribució i producció** → Eco 1BACH, EDMN 2BACH, FOPP 4ESO.
- **Decisions i béns comuns** → Eco 1BACH, Eco 4ESO.
- **Sistemes econòmics i debats** → Eco 1BACH, Eco 4ESO, EEAE/GPE.
- **Empresa i organització** → EDMN 2BACH, EEAE/GPE, IPE I/II.

Cada ficha declara su `unidades_relacionadas` real (verificado contra las unidades
publicadas de cada asignatura).

## 7. Testing (TDD para la lógica de build)

1. **Schema/loader**: el collection `dinamicas` carga sin errores y valida el
   frontmatter (campos requeridos, enums de `familia`/`tipo`/`nivel`).
2. **Integridad de referencias**: cada `unidades_relacionadas[].asignatura` es un
   slug de asignatura existente; cada `unidad` referida está dentro del rango de
   unidades publicadas de esa asignatura.
3. **Agrupación del hub**: dado un set de dinámicas, el hub las agrupa por familia
   en el orden definido en `src/lib/dinamicas.ts` y respeta `orden` dentro de cada una.
4. **Solo `publicado` se renderiza**: las dinámicas en `borrador`/`revision` no
   generan ruta ni aparecen en el hub.

El contenido educativo de cada ficha pasa **revisión manual de Pau** antes de
`estado: 'publicado'` (no auto-publish).

## 8. Plan de entrega por bloques (PRs)

1. **PR 1 — Marco**: `SECCIONES_TRANSVERSALES`, colección + schema, `src/lib/dinamicas.ts`,
   componentes (`RoleCard`, `FichaAlumno`, `PrintButton`), `[slug].astro`, `index.astro`,
   estilos de impresión, tests de build. + **1 ficha piloto** completa por familia que
   más lo necesita (entrevista de trabajo) para validar el patrón de extremo a extremo.
2. **PR 2** — Familia A completa (mercat de treball) + Familia G (teoría de juegos).
3. **PR 3** — Familias B y D (mercados, precios, bienes comunes, decisiones).
4. **PR 4** — Familias C y E (distribución/producción, sistemas/debates).
5. **PR 5** — Familia F (empresa/organización) + repaso de encaje curricular y
   (opcional) cross-references desde las unidades hacia las dinámicas.

Cada PR: rama desde `dev`, revisión propia, merge a `dev`, luego a `main`.

## 9. Fuera de alcance

- Pipeline de generación de PDF dedicado (los materiales se imprimen desde la web).
- Versiones interactivas en pantalla de las simulaciones (son dinámicas
  **presenciales**; no se construyen simuladores Preact aquí — eso vive en `recursos`).
- Catalán/valenciano publicado (estructura i18n sí, contenido no, según MVP).
- Cross-references automáticas obligatorias desde cada unidad (se valora en PR 5).
- Colores nuevos en el sistema visual.

## 10. Riesgos y mitigaciones

- **Volumen de contenido alto** (~24 fichas densas) → entrega por bloques; el marco
  (PR 1) desbloquea y valida el patrón antes de escribir en masa.
- **Solape con simuladores existentes** (`recursos`, `actividades-dinamicas`) → estas
  son presenciales y multi-asignatura; se referencian, no se reimplementan.
- **Rigor pedagógico de juegos de teoría de juegos** (matrices de pagos, equilibrios)
  → revisión manual de Pau; matrices verificadas; sin material copiado de terceros.
