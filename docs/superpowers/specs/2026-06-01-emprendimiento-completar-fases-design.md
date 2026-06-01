# Completar «De cero a empresa» — 8 fases del tronco + ★ valiente

> **Estado:** diseño aprobado (2026-06-01). Extiende el spec base
> `2026-05-31-emprendimiento-proyecto-transversal-design.md`, del que hereda
> arquitectura, itinerarios y patrón web+PDF. Aquí solo se especifica lo NUEVO:
> el contenido de las 8 fases restantes del tronco y la fase ★ «venta real».

## Objetivo

El proyecto se publicó con arquitectura completa + 3 fases piloto (1 Detecta,
4 Valida, 8 Financiación). Esta tanda completa el tronco de 11 fases escribiendo
las **8 fases que faltan** (2, 3, 5, 6, 7, 9, 10, 11) y añade la fase **★ Lanza
(venta real)**, dejando «De cero a empresa» como proyecto completo.

No cambia la arquitectura ni los itinerarios. No añade componentes interactivos
(eso es una tanda futura distinta). El eje de esta tanda es **amplitud**: cubrir
todas las fases con la misma calidad que las 3 piloto.

## Las 9 fases a escribir

Una MDX por fase en `src/content/emprendimiento/proyecto/`, misma plantilla que
las piloto. Niveles y puentes según el spec base; los números de unidad se
**verifican contra el catálogo real** durante la implementación (no se inventan).

| # | Fichero | Fase | Núcleo/Profundo | Nivel | Puente (a verificar) |
|---|---------|------|:---:|:---:|---|
| 2 | `02-idea-equipo.mdx` | Idea y equipo | núcleo | todos | — |
| 3 | `03-modelo-negocio.mdx` | Modelo de negocio (BMC) | núcleo | todos | EDMN U4-5 |
| 5 | `05-marketing.mdx` | Marketing | núcleo | todos | EDMN U6 |
| 6 | `06-operaciones.mdx` | Operaciones y producción | profundo | bach-fp | EDMN U7 |
| 7 | `07-personas-equipo.mdx` | Personas y equipo (RRHH) | profundo | bach-fp | EDMN U8 |
| 9 | `09-numeros-viabilidad.mdx` | Números y viabilidad | núcleo | todos | EDMN U10-11 |
| 10 | `10-estres-test.mdx` | Estrés-test (datos reales) | profundo | bach-fp | Eco 1.º Bach (macro) |
| 11 | `11-pitch-dossier.mdx` | Pitch + dossier | núcleo | todos | GPE |
| ★ | `99-lanza-valiente.mdx` | Lanza (venta real) | valiente | opcional | — |

Los nombres de fichero definitivos pueden ajustarse al verificar, pero el
**número de fase del frontmatter es la fuente de verdad** para la ruta
(zero-padded: "02", "03"… "99").

## Plantilla por fase (idéntica a las piloto)

Frontmatter: `fase` (number), `title`, `fase_label` (p.ej. "Fase 2 — Idea y
equipo"), `nucleo` (bool), `nivel` (`todos|eso|bach-fp`), `duracion`,
`entregable`, `unidades_relacionadas` (array `{asignatura, unidad, nota}`
verificado), `competencias_clave`, `competencias_especificas`,
`estado: publicado`, `lang: es`.

Cuerpo: introducción "por qué importa" → `## Qué vais a hacer` con `<Steps>` →
uno o dos `<Callout>` (idea/aviso) → `## El entregable` → `## Para evaluar esta
fase` con tabla rúbrica (Insuficiente / Adecuado / Excelente). El bloque "Esto se
trabaja en…" lo renderiza la ruta `[fase].astro` desde `unidades_relacionadas`
(no va en el cuerpo).

## Fase ★ Lanza (venta real) — diseño específico

Tier **valiente**, **opcional**, nunca obligatorio. Tiene sentido después de
validar (Fase 4) y conocer los números (Fase 9). El cuerpo explica **las dos
vías** para que cada profe elija según su contexto:

- **Vía A — Venta controlada.** Mercadillo escolar, evento del centro o preventa,
  bajo tutela del centro. Real pero acotado: el dinero y el espacio están
  controlados por el centro.
- **Vía B — Venta real abierta.** Vender fuera del centro (mercado real, online,
  feria local). Máximo realismo y máximo aprendizaje, pero más exigencias.

Bloque transversal **serio y bien explicado** (lo que pidió Pau, "explícalo todo
bien"), contrastando qué cambia entre A y B:

- **Menores de edad:** autorización de las familias; un adulto responsable;
  qué pueden y qué no pueden hacer los menores con dinero y contratos.
- **Permisos:** autorización del centro (Vía A); permiso municipal / espacio
  (Vía B).
- **Manipulación de dinero:** caja, registro de ingresos/gastos, transparencia.
- **Fiscalidad básica:** qué es y qué no es actividad económica a efectos
  prácticos en un proyecto escolar; cuándo NO aplica y cuándo conviene consultar.
- **Responsabilidad del docente y del centro:** quién asume qué.

Tono "por si os atrevéis", con rúbrica propia centrada en ejecución real,
gestión del dinero y aprendizaje extraído (no en facturar mucho). Sin promesas,
sin vender la idea de hacerse rico.

## Encaje de la ★ en la arquitectura (toque mínimo)

La colección `proyectoTransversal` guarda `fase` numérico. La ★ se modela como:

- `fase: 99` (ordena la última).
- Valores de frontmatter de la ★: `nucleo: false`, `nivel: 'bach-fp'`,
  `valiente: true`. La etiqueta "valiente · opcional" de la tabla de arriba es
  presentación, no valores de campo: se deriva del flag `valiente`.
- Nuevo campo de frontmatter **`valiente: z.boolean().default(false)`** en el
  schema de `src/content.config.ts`. La ★ lo lleva `true`.
- `FaseMeta.astro`: cuando `valiente`, muestra un distintivo propio ("Tier
  valiente · opcional") en lugar del badge núcleo/profundo.
- Índice (`/emprendimiento/proyecto/index.astro`): la ★ se muestra como
  **tarjeta aparte destacada** ("¿Os atrevéis a vender de verdad?"), fuera de la
  rejilla numerada de fases.
- Itinerarios (`src/lib/emprendimiento.ts`): **sin cambios**. Sprint ESO
  `[1,2,3,4,11]` y Batx/FP `[1..11]` siguen igual; la ★ no entra en ninguno
  numerado. En "a la carta" (fases = null) aparece como una más.
- `MapaTransversal`: la ★ no aporta puentes (no tiene `unidades_relacionadas`),
  así que no añade ruido al mapa.

Esto es aditivo: no rompe las 3 fases piloto ni las rutas existentes.

## Contenido — reglas (CLAUDE.md)

- Castellano, acentuación correcta, **sin emojis pictográficos** (sí → × —).
- Tono cercano en plural ("os proponemos", "ya sabéis cómo va"), nunca vender.
- Currículo LOMLOE como referencia. Nada copiado de terceros.
- Cada `unidades_relacionadas` verificado contra el catálogo real
  (`src/content/asignaturas/<slug>/libro/`), traduciendo número → unidad real.
  Es el mismo cuidado que evitó el bug de puentes 404.

## Verificación (gate)

- `npx vitest run` verde (no debe romper los tests del módulo de itinerarios; si
  el flag `valiente` necesita test, añadirlo).
- `npx astro build` ✓ — las 9 nuevas rutas `/emprendimiento/proyecto/{02,03,05,
  06,07,09,10,11,99}/` se generan; el índice muestra las fases + la tarjeta ★.
- Regenerar el PDF (`npm run build:proyecto-transversal`) y comprobar que
  incluye las 11 fases + ★.
- Comprobar que **todos** los enlaces de puentes resuelven (contra `dist/`).

## Fuera de alcance (esta tanda)

- Componentes interactivos por fase (Lean Canvas editable, calculadoras…).
- Profundización extra de las 3 piloto ya publicadas.
- Rediseño del índice/mapa/itinerarios más allá del encaje de la ★.
