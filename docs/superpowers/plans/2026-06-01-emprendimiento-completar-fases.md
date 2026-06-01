# Completar «De cero a empresa» — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Completar el proyecto transversal «De cero a empresa» escribiendo las 8 fases del tronco que faltan (2, 3, 5, 6, 7, 9, 10, 11) y la fase ★ «Lanza (venta real)», dejando el proyecto completo.

**Architecture:** Cada fase es una MDX en `src/content/emprendimiento/proyecto/` que sigue la plantilla ya establecida por las 3 fases piloto (1, 4, 8). La ★ se modela como `fase: 99` con un flag nuevo `valiente` en el schema; `FaseMeta` y el índice la tratan como tier aparte sin tocar los itinerarios numerados. El bloque "Esto se trabaja en…" lo renderiza la ruta `[fase].astro` desde `unidades_relacionadas`.

**Tech Stack:** Astro 5 content collections (glob + zod), MDX con componentes `Callout`/`Steps`, vitest, pagedjs-cli para el PDF.

**Spec:** `docs/superpowers/specs/2026-06-01-emprendimiento-completar-fases-design.md`

---

## File Structure

**Create (9 MDX):**
- `src/content/emprendimiento/proyecto/02-idea-equipo.mdx`
- `src/content/emprendimiento/proyecto/03-modelo-negocio.mdx`
- `src/content/emprendimiento/proyecto/05-marketing.mdx`
- `src/content/emprendimiento/proyecto/06-operaciones.mdx`
- `src/content/emprendimiento/proyecto/07-personas-equipo.mdx`
- `src/content/emprendimiento/proyecto/09-numeros-viabilidad.mdx`
- `src/content/emprendimiento/proyecto/10-estres-test.mdx`
- `src/content/emprendimiento/proyecto/11-pitch-dossier.mdx`
- `src/content/emprendimiento/proyecto/99-lanza-valiente.mdx`

**Modify:**
- `src/content.config.ts` — add `valiente: z.boolean().default(false)` to the `proyectoTransversal` schema.
- `src/components/emprendimiento/FaseMeta.astro` — render a "valiente" badge when `valiente` is true.
- `src/pages/emprendimiento/proyecto/index.astro` — render the ★ phase as a standout card outside the numbered grid.

**Reference (do NOT modify) — the style template:** the 3 piloto MDX
`01-detecta.mdx`, `04-valida.mdx`, `08-financiacion.mdx`. Every new trunk phase
matches their structure exactly: frontmatter → intro "por qué" → `## Qué vais a
hacer` (`<Steps>`) → one/two `<Callout>` → `## El entregable` → `## Para evaluar
esta fase` (tabla Insuficiente/Adecuado/Excelente).

**Verified unit bridges (against the real catalogue, 2026-06-01):**
- EDMN 2BACH: U4 `04-modelos-negocio-concepto-evolucion`, U5 `05-diseno-creativo-modelos`, U6 `06-funcion-comercial-marketing`, U7 `07-funcion-productiva`, U8 `08-recursos-humanos`, U10 `10-informacion-contable`, U11 `11-analisis-estados-financieros`, U12 `12-comunicacion-prototipado-plan-empresa`.
- Eco 1BACH: U8 `08-modelo-ad-as-ciclos`, U11 `11-politicas-economicas`.
- GPE BACH: U1 `01-emprender-e-innovar`.
- `unidades_relacionadas` guarda el NÚMERO; el componente `PuenteUnidades` lo traduce al slug real vía `unidadSlug()`. Solo citar unidades `publicado`.

---

## Task 1: Add `valiente` flag to the schema

**Files:**
- Modify: `src/content.config.ts` (the `proyectoTransversal` schema block)

- [ ] **Step 1: Add the field**

In the `proyectoTransversal` schema, after the `nivel` line, add:

```ts
    /** Brave optional tier (the ★ "venta real" phase). Excluded from numbered itineraries. */
    valiente: z.boolean().default(false),
```

- [ ] **Step 2: Verify the build still compiles with the 3 existing phases**

Run: `npx astro build 2>&1 | grep -iE "error|proyectoTransversal|Completed in" | tail -5`
Expected: build succeeds; no schema error (existing phases default `valiente` to false).

- [ ] **Step 3: Commit**

```bash
git add src/content.config.ts
git commit -m "feat(emprendimiento): add 'valiente' flag to proyectoTransversal schema"
```

---

## Tasks 2-9: Trunk phases (one per task)

> Each trunk-phase task creates ONE MDX following the piloto template EXACTLY
> (read `04-valida.mdx` first as the exemplar). Content rules: castellano,
> acentos correctos, **sin emojis** (sí → × —), tono cercano en plural, nunca
> vender. Rúbrica = tabla de 3 criterios × (Insuficiente/Adecuado/Excelente).
> All `estado: publicado`, `lang: es`. After writing each, build to verify it
> compiles and (if it has bridges) the links resolve, then commit.

> **Per-task verification (same for tasks 2-9), run after writing the MDX:**
> Run: `npx astro build 2>&1 | grep -E "emprendimiento/proyecto/<NN>|error|Completed in" ; echo "EXIT:${PIPESTATUS[0]}"`
> Expected: route `/emprendimiento/proyecto/<NN>/` built, exit 0.
> Then, if the phase cites bridges:
> Run: `grep -oE 'href="/[a-z0-9-]+/libro/[^"]*"' dist/client/emprendimiento/proyecto/<NN>/index.html | sort -u`
> Expected: each bridge link points to an existing unit page (cross-check the slug exists under `dist/client/<asignatura>/libro/<slug>/`).
> Commit: `git add src/content/emprendimiento/proyecto/<file>.mdx && git commit -m "feat(emprendimiento): phase <NN> — <name>"`

### Task 2: Fase 2 — Idea y equipo

**Files:** Create `src/content/emprendimiento/proyecto/02-idea-equipo.mdx`

- [ ] **Step 1: Write the MDX**

Frontmatter:
```yaml
fase: 2
title: "De la idea al equipo que la sostiene"
fase_label: "Fase 2 — Idea y equipo"
nucleo: true
nivel: todos
duracion: "2-3 sesiones"
entregable: "Una idea formulada como solución a vuestro problema (Fase 1) + reparto de roles del equipo con compromisos."
unidades_relacionadas:
  - { asignatura: "gpe-bach", unidad: 1, nota: "Persona emprendedora, motivación y trabajo en equipo." }
competencias_clave: [CPSAA, CE, CCL]
competencias_especificas: []
estado: publicado
lang: es
```
Body (prose en castellano siguiendo la plantilla): ahora SÍ se formula la idea
—pero como respuesta al problema elegido en la Fase 1, no al revés—. Enseña: (1)
una idea es una hipótesis de solución, no una certeza; (2) el equipo importa
tanto como la idea: roles, fortalezas, compromisos y cómo se decidirá cuando haya
desacuerdo. `<Steps>`: reformular el problema en una frase → generar 3-5 ideas de
solución → elegir una con criterio → repartir roles según fortalezas →
acordar reglas de equipo. `<Callout tipo="idea">`: "la mejor idea con mal equipo
fracasa; idea decente con buen equipo, sale adelante". Entregable como arriba.
Rúbrica: Idea (¿resuelve el problema real?), Equipo (¿roles claros y justos?),
Compromiso (¿reglas y reparto reales?).

### Task 3: Fase 3 — Modelo de negocio (BMC)

**Files:** Create `src/content/emprendimiento/proyecto/03-modelo-negocio.mdx`

- [ ] **Step 1: Write the MDX**

Frontmatter:
```yaml
fase: 3
title: "¿Cómo crea, entrega y captura valor vuestra empresa?"
fase_label: "Fase 3 — Modelo de negocio"
nucleo: true
nivel: todos
duracion: "3-4 sesiones"
entregable: "El Business Model Canvas (9 bloques) de vuestro proyecto, en mural o documento."
unidades_relacionadas:
  - { asignatura: "edmn-2bach", unidad: 4, nota: "Modelo de negocio y Business Model Canvas." }
  - { asignatura: "edmn-2bach", unidad: 5, nota: "Diseño creativo de modelos de negocio." }
competencias_clave: [CE, STEM, CPSAA, CD]
competencias_especificas: []
estado: publicado
lang: es
```
Body: introduce el BMC como el "plano" del negocio: crear / entregar / capturar
valor. Explica los 9 bloques con lenguaje llano (segmentos, propuesta de valor,
canales, relación, ingresos, recursos, actividades, socios, costes).
`<Steps>`: empezar por propuesta de valor y segmento → rellenar los 9 bloques con
post-its → marcar los bloques más inciertos. `<Callout tipo="aviso">`: el bloque
de ingresos es el que más se infla con ilusión; sed conservadores. Rúbrica:
Propuesta de valor (¿clara y ligada al problema?), Coherencia del canvas (¿encajan
los 9 bloques?), Realismo (¿ingresos y costes creíbles?).

### Task 4: Fase 5 — Marketing

**Files:** Create `src/content/emprendimiento/proyecto/05-marketing.mdx`

- [ ] **Step 1: Write the MDX**

Frontmatter:
```yaml
fase: 5
title: "Que os conozcan: marketing con poco presupuesto"
fase_label: "Fase 5 — Marketing"
nucleo: true
nivel: todos
duracion: "2-3 sesiones"
entregable: "Un plan de marketing mínimo: público objetivo, mensaje, canales y una acción concreta de captación."
unidades_relacionadas:
  - { asignatura: "edmn-2bach", unidad: 6, nota: "Función comercial y marketing (las 4 P)." }
competencias_clave: [CCL, CD, CE, CPSAA]
competencias_especificas: []
estado: publicado
lang: es
```
Body: marketing no es "hacer publicidad cara", es hacer que la gente adecuada os
conozca y os entienda. Las 4 P en versión de aula (producto, precio, punto de
venta, promoción). `<Steps>`: definir a quién os dirigís → un mensaje claro de una
frase → elegir 1-2 canales realistas (redes, boca a boca, cartel, evento) →
diseñar una acción concreta y medible. `<Callout tipo="idea">`: mejor dominar un
canal barato que dispersarse en cinco. Rúbrica: Público (¿bien definido?),
Mensaje (¿claro y honesto?), Acción (¿concreta y ejecutable con vuestros medios?).

### Task 5: Fase 6 — Operaciones y producción

**Files:** Create `src/content/emprendimiento/proyecto/06-operaciones.mdx`

- [ ] **Step 1: Write the MDX**

Frontmatter:
```yaml
fase: 6
title: "Cómo se hace de verdad: operaciones y producción"
fase_label: "Fase 6 — Operaciones y producción"
nucleo: false
nivel: bach-fp
duracion: "3-4 sesiones"
entregable: "El proceso productivo de vuestro producto/servicio paso a paso + identificación de cuellos de botella y costes de producción."
unidades_relacionadas:
  - { asignatura: "edmn-2bach", unidad: 7, nota: "La función productiva: procesos, costes y eficiencia." }
competencias_clave: [STEM, CE, CD, CPSAA]
competencias_especificas: []
estado: publicado
lang: es
```
Body (profundización Batx/FP): una buena idea con mala ejecución no llega. Cómo se
produce el producto o se presta el servicio: proceso, recursos, tiempos, calidad.
Introduce cuello de botella y coste de producción de forma intuitiva. `<Steps>`:
dibujar el proceso de principio a fin → identificar el paso más lento (cuello de
botella) → estimar el coste de producir una unidad → proponer una mejora.
`<Callout tipo="aviso">`: el cuello de botella manda; optimizar otro paso no sirve
de nada. Rúbrica: Proceso (¿completo y realista?), Cuello de botella (¿identificado
y justificado?), Costes (¿estimación razonable por unidad?).

### Task 6: Fase 7 — Personas y equipo (RRHH)

**Files:** Create `src/content/emprendimiento/proyecto/07-personas-equipo.mdx`

- [ ] **Step 1: Write the MDX**

Frontmatter:
```yaml
fase: 7
title: "Las personas: organizar el trabajo y el equipo"
fase_label: "Fase 7 — Personas y equipo"
nucleo: false
nivel: bach-fp
duracion: "2-3 sesiones"
entregable: "Organigrama del proyecto + descripción de funciones y un acuerdo de cómo se toman las decisiones y se resuelven conflictos."
unidades_relacionadas:
  - { asignatura: "edmn-2bach", unidad: 8, nota: "La función de recursos humanos: organización, motivación y liderazgo." }
competencias_clave: [CPSAA, CCL, CE, CC]
competencias_especificas: []
estado: publicado
lang: es
```
Body (profundización): ahonda en lo que la Fase 2 abrió. Organización del trabajo,
funciones, motivación, liderazgo y gestión de conflictos en un equipo real (el
vuestro). `<Steps>`: dibujar el organigrama → describir qué hace cada función →
acordar cómo se decide (consenso, mayoría, responsable de área) → pactar cómo se
gestionan los conflictos. `<Callout tipo="idea">`: en un proyecto de aula el mayor
riesgo no es el mercado, es que el equipo se rompa; cuidadlo. Rúbrica:
Organización (¿funciones claras?), Decisiones (¿regla acordada y usada?), Clima
(¿plan realista para conflictos?).

### Task 7: Fase 9 — Números y viabilidad

**Files:** Create `src/content/emprendimiento/proyecto/09-numeros-viabilidad.mdx`

- [ ] **Step 1: Write the MDX**

Frontmatter:
```yaml
fase: 9
title: "¿Sale a cuenta? Números y punto muerto"
fase_label: "Fase 9 — Números y viabilidad"
nucleo: true
nivel: todos
duracion: "3-4 sesiones"
entregable: "Una cuenta sencilla: ingresos previstos, costes fijos y variables, y el punto muerto (cuántas unidades hay que vender para no perder)."
unidades_relacionadas:
  - { asignatura: "edmn-2bach", unidad: 10, nota: "Información contable: ingresos, gastos y resultado." }
  - { asignatura: "edmn-2bach", unidad: 11, nota: "Análisis de estados financieros y umbral de rentabilidad." }
competencias_clave: [STEM, CE, CD, CPSAA]
competencias_especificas: []
estado: publicado
lang: es
```
Body: la prueba del algodón. Distingue coste fijo vs variable, precio, margen, y el
**punto muerto** (umbral de rentabilidad) con un ejemplo numérico sencillo.
`<Steps>`: listar costes fijos → coste variable por unidad → fijar precio →
calcular el punto muerto → juzgar si es alcanzable. `<Callout tipo="idea">`: el
punto muerto convierte "creo que va bien" en "necesito vender N para no perder".
Incluir una tabla de ejemplo con números. Rúbrica: Costes (¿bien clasificados?),
Punto muerto (¿calculado correctamente?), Juicio (¿es alcanzable y lo justifican?).

### Task 8: Fase 10 — Estrés-test (datos reales)

**Files:** Create `src/content/emprendimiento/proyecto/10-estres-test.mdx`

- [ ] **Step 1: Write the MDX**

Frontmatter:
```yaml
fase: 10
title: "Y si las cosas se tuercen: estrés-test con datos reales"
fase_label: "Fase 10 — Estrés-test"
nucleo: false
nivel: bach-fp
duracion: "2-3 sesiones"
entregable: "Análisis de 3 escenarios (normal, malo, muy malo) ante shocks reales —inflación, subida de tipos, caída de demanda— y un plan de reacción."
unidades_relacionadas:
  - { asignatura: "eco-1bach", unidad: 8, nota: "Modelo AD-AS y ciclos económicos: shocks y recesiones." }
  - { asignatura: "eco-1bach", unidad: 11, nota: "Políticas económicas: cómo afectan tipos de interés e inflación." }
competencias_clave: [STEM, CE, CD, CPSAA]
competencias_especificas: []
estado: publicado
lang: es
```
Body (profundización, ángulo macro): conecta el proyecto con la economía real.
Qué pasa con vuestros números (Fase 9) si sube la inflación, suben los tipos o cae
la demanda. `<Steps>`: elegir 3 shocks reales plausibles → recalcular el punto
muerto en cada escenario → identificar el escenario que os hundiría → diseñar una
reacción (subir precio, bajar coste, pivotar). `<Callout tipo="aviso">`: ninguna
empresa controla el entorno; las que sobreviven son las que lo anticipan. Rúbrica:
Escenarios (¿realistas y bien elegidos?), Impacto (¿recalculan bien los números?),
Reacción (¿plan creíble ante el peor caso?).

### Task 9: Fase 11 — Pitch + dossier

**Files:** Create `src/content/emprendimiento/proyecto/11-pitch-dossier.mdx`

- [ ] **Step 1: Write the MDX**

Frontmatter:
```yaml
fase: 11
title: "Contadlo bien: pitch y dossier del proyecto"
fase_label: "Fase 11 — Pitch + dossier"
nucleo: true
nivel: todos
duracion: "3-4 sesiones"
entregable: "Un pitch de 3-5 minutos + un dossier breve que recoja el recorrido del proyecto (problema → solución → modelo → validación → números)."
unidades_relacionadas:
  - { asignatura: "edmn-2bach", unidad: 12, nota: "Comunicación, prototipado y plan de empresa: el pitch." }
competencias_clave: [CCL, CD, CE, CPSAA]
competencias_especificas: []
estado: publicado
lang: es
```
Body: cierre del proyecto. Un buen proyecto mal contado no convence; enseña a
estructurar un pitch (problema → solución → por qué vosotros → números → petición)
y a montar un dossier que sintetice todas las fases. `<Steps>`: elegir la historia
(empezar por el problema, no por vosotros) → guion del pitch en 5 partes →
ensayar con cronómetro → preparar respuestas a 3 preguntas difíciles → montar el
dossier. `<Callout tipo="idea">`: si solo recuerdan una frase, ¿cuál queréis que
sea? Empezad por ahí. Rúbrica: Estructura (¿historia clara?), Datos (¿apoyan el
relato sin saturar?), Comunicación (¿tiempo, claridad y respuesta a preguntas?).

---

## Task 10: Fase ★ — Lanza (venta real)

**Files:** Create `src/content/emprendimiento/proyecto/99-lanza-valiente.mdx`

- [ ] **Step 1: Write the MDX**

Frontmatter:
```yaml
fase: 99
title: "Lanza: vender de verdad"
fase_label: "★ Lanza — venta real"
nucleo: false
nivel: bach-fp
valiente: true
duracion: "Variable (1-4 semanas)"
entregable: "Una venta real ejecutada (controlada o abierta) + un balance honesto: qué vendisteis, cuánto, qué gestionasteis y qué aprendisteis."
unidades_relacionadas: []
competencias_clave: [CE, CPSAA, CC, STEM, CCL]
competencias_especificas: []
estado: publicado
lang: es
```

Body — estructura específica (más larga que una fase normal; explícalo todo bien,
tono "por si os atrevéis", nunca obligatorio, nunca vender la idea de "haceros
ricos"):

1. Intro: esta fase es **opcional y valiente**. Tiene sentido solo si ya validasteis
   (Fase 4) y conocéis vuestros números (Fase 9). Vender de verdad enseña lo que
   ninguna simulación enseña.
2. `## Dos maneras de lanzar` — explica las dos vías y para qué contexto sirve cada una:
   - **Vía A — Venta controlada:** mercadillo escolar, evento del centro o preventa,
     bajo tutela del centro. El dinero y el espacio están controlados. Recomendada
     para empezar y para ESO/grupos con menores.
   - **Vía B — Venta real abierta:** vender fuera del centro (feria local, online,
     puesto en un mercado). Máximo realismo y aprendizaje; más exigencias.
3. `## Qué vais a hacer` — `<Steps>`: fijar objetivo realista (no facturar mucho,
   sino ejecutar y aprender) → elegir vía A o B → preparar producto, precio y caja →
   vender → registrar ingresos/gastos → balance.
4. `## Antes de vender: lo que hay que tener claro` — bloque **serio**, contrastando
   A vs B, con `<Callout tipo="aviso">`:
   - **Menores de edad:** autorización de las familias; un adulto responsable
     siempre; los menores no firman contratos ni asumen obligaciones legales.
   - **Permisos:** Vía A → autorización del centro; Vía B → permiso del espacio
     (ayuntamiento/feria) y normas del lugar.
   - **Dinero:** caja única, registro de todo ingreso y gasto, transparencia total;
     decidir de antemano qué se hace con el excedente (donarlo, reinvertir, viaje).
   - **Fiscalidad:** un proyecto escolar puntual normalmente NO es actividad
     económica formal; si la venta se vuelve recurrente o de cierto volumen, hay que
     **consultar** (no es asesoramiento fiscal; ante la duda, preguntad).
   - **Responsabilidad:** el centro y el profe asumen la tutela; dejadlo claro por
     escrito antes de empezar.
5. `## El entregable` — como en el frontmatter.
6. `## Para evaluar esta fase` — rúbrica centrada en ejecución y aprendizaje, NO en
   cuánto se factura: Ejecución (¿se llevó a cabo una venta real?), Gestión (¿caja,
   permisos y registro en orden?), Aprendizaje (¿balance honesto de qué funcionó y
   qué no?).

- [ ] **Step 2: Build + verify the ★ route**

Run: `npx astro build 2>&1 | grep -E "emprendimiento/proyecto/99|error|Completed in" ; echo "EXIT:${PIPESTATUS[0]}"`
Expected: `/emprendimiento/proyecto/99/` built, exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/content/emprendimiento/proyecto/99-lanza-valiente.mdx
git commit -m "feat(emprendimiento): phase ★ Lanza (venta real)"
```

---

## Task 11: `FaseMeta` — valiente badge

**Files:** Modify `src/components/emprendimiento/FaseMeta.astro`

- [ ] **Step 1: Add the `valiente` prop and badge**

Add `valiente?: boolean` to `Props` and destructure it (default false). Replace
the núcleo/profundo badge logic so that when `valiente` is true it renders a single
distinct badge instead:

```astro
{valiente ? (
  <span class="badge badge--valiente">★ Tier valiente · opcional</span>
) : (
  <span class={`badge badge--${nucleo ? 'nucleo' : 'profundo'}`}>
    {nucleo ? 'Núcleo' : 'Profundización'}
  </span>
)}
```

Add a `.badge--valiente` style (reuse the terracota accent, e.g. `background: var(--color-terra); color: #fff;`).

Update the caller `src/pages/emprendimiento/proyecto/[fase].astro` to pass
`valiente={d.valiente}` to `<FaseMeta />`.

- [ ] **Step 2: Build + verify the ★ page shows the valiente badge**

Run: `npx astro build 2>&1 | grep -E "error|Completed in" | tail -3`
Then: `grep -o "Tier valiente" dist/client/emprendimiento/proyecto/99/index.html | head -1`
Expected: prints `Tier valiente`; build exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/emprendimiento/FaseMeta.astro "src/pages/emprendimiento/proyecto/[fase].astro"
git commit -m "feat(emprendimiento): valiente tier badge in FaseMeta"
```

---

## Task 12: Index — ★ standout card

**Files:** Modify `src/pages/emprendimiento/proyecto/index.astro`

- [ ] **Step 1: Separate the ★ phase from the numbered grid**

In the frontmatter, after computing `published`, split out the valiente phase:

```ts
const fasesNumeradas = published.filter((e) => !e.data.valiente);
const faseValiente = published.find((e) => e.data.valiente) ?? null;
```

Use `fasesNumeradas` for the existing `fasesForMap` and the "Las fases" card grid
(replace `published` in those two places). After the fases section, add a standout
block when `faseValiente` exists:

```astro
{faseValiente && (
  <section class="block block--valiente">
    <div class="container container--narrow">
      <h2>¿Os atrevéis a vender de verdad?</h2>
      <a class="valiente-card" href={`/emprendimiento/proyecto/${String(faseValiente.data.fase).padStart(2, '0')}`}>
        <span class="valiente-card__label">★ Tier valiente · opcional</span>
        <span class="valiente-card__title">{faseValiente.data.title}</span>
        <span class="valiente-card__desc">{faseValiente.data.entregable}</span>
      </a>
    </div>
  </section>
)}
```

Add minimal styles for `.block--valiente` / `.valiente-card` in the same editorial
style as the existing `.fase-card` (terracota accent border-top, hover lift).

- [ ] **Step 2: Build + verify**

Run: `npx astro build 2>&1 | grep -E "emprendimiento/proyecto/index|error|Completed in" ; echo "EXIT:${PIPESTATUS[0]}"`
Then: `grep -oE "atrev[eé]is a vender|Tier valiente" dist/client/emprendimiento/proyecto/index.html | sort -u`
Expected: the standout card text appears; the ★ is NOT in the numbered `.fase-cards` grid (fase 99 absent there); exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/pages/emprendimiento/proyecto/index.astro
git commit -m "feat(emprendimiento): ★ valiente standout card on project index"
```

---

## Task 13: Final gate — PDF + full build + links

**Files:** none (verification); regenerates `public/downloads/emprendimiento-proyecto.pdf`

- [ ] **Step 1: Full test suite**

Run: `npx vitest run 2>&1 | tail -8`
Expected: all green (the itinerary module tests unaffected; `valiente` phase 99 is not in any numbered itinerary).

- [ ] **Step 2: Full build + all routes present**

Run: `npx astro build 2>&1 | tail -6`
Then: `for n in 01 02 03 04 05 06 07 08 09 10 11 99; do test -f dist/client/emprendimiento/proyecto/$n/index.html && echo "OK $n" || echo "MISSING $n"; done`
Expected: all 12 (11 fases + ★) present.

- [ ] **Step 3: Verify every bridge link resolves**

Run: `for n in 02 03 05 06 07 09 10 11; do echo "== $n =="; grep -oE 'href="/[a-z0-9-]+/libro/[^"]*"' dist/client/emprendimiento/proyecto/$n/index.html | sort -u; done`
Then cross-check each printed slug exists: `test -f dist/client/<that-path>/index.html`.
Expected: no broken bridge links.

- [ ] **Step 4: Regenerate the workbook PDF**

Run: `npm run build:proyecto-transversal`
Then: `test -f public/downloads/emprendimiento-proyecto.pdf && echo "PDF OK"`
Expected: PDF regenerated including the 11 phases + ★.

- [ ] **Step 5: Commit the regenerated PDF**

```bash
git add public/downloads/emprendimiento-proyecto.pdf
git commit -m "chore(emprendimiento): regenerate project workbook PDF with all phases"
```

---

## Self-Review (completed during planning)

**Spec coverage:** 8 trunk phases (Tasks 2-9) + ★ (Task 10) + valiente data-model
encaje: schema (Task 1), FaseMeta badge (Task 11), index standout card (Task 12).
Itinerarios sin cambios (★ = fase 99, fuera de los sets numerados). PDF + gate
(Task 13). All spec sections map to a task. ✓

**Placeholder scan:** No TBD/TODO. Each phase task carries exact frontmatter
(verified bridges) + a concrete body brief (sections, steps, callout, rubric
axes). The prose is generated at execution following the piloto exemplar — the
brief is complete enough to remove ambiguity about WHAT each phase teaches. ✓

**Type/consistency:** `valiente` boolean used consistently across schema (Task 1),
frontmatter of ★ (Task 10), FaseMeta prop (Task 11), index split (Task 12). Route
param = zero-padded `fase` everywhere (incl. "99"). Bridges cite only verified
published units. ✓
