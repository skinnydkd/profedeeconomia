# Proyecto de emprendimiento transversal — diseño

> Brainstorming con Pau, 2026-05-31. Spec de la **primera tanda**: arquitectura
> completa + 3 fases piloto. El resto de fases se completan en tandas posteriores
> (mismo patrón que los libros).

## Visión en una frase

Un proyecto de emprendimiento **transversal, modular y por niveles** que vive en
`/emprendimiento/proyecto/`: en equipo, el alumnado crea una empresa que **resuelve
un problema real de su entorno**, la valida con metodología lean, la somete a un
estrés-test con datos económicos reales y —opcionalmente— la lanza vendiendo de
verdad. Es **un solo proyecto** (un tronco narrativo); la modularidad y los niveles
son *vistas* del mismo proyecto, no proyectos distintos.

Es la pieza estrella de la sección `/emprendimiento/`, que además destaca la
asignatura de emprendimiento puro: **GPE Bach**.

## Por qué

- La sección `/emprendimiento/` era un placeholder ("contenido en preparación")
  mientras la home la anunciaba con material concreto (ver [PR #71](https://github.com/skinnydkd/profedeeconomia/pull/71), follow-up pendiente).
- Pau quiere: (1) destacar la asignatura de emprendimiento puro, y (2) un proyecto
  empresarial **transversal a todas las asignaturas**, con muchas partes, detallado,
  innovador.

## Decisiones vinculantes (tomadas en el brainstorm)

1. **Transversalidad = una sola arquitectura**, no cuatro cosas: tronco único +
   ramas de profundidad por nivel + fases/módulos combinables + mapeo explícito a
   las unidades de cada asignatura.
2. **El ángulo es una narrativa progresiva**, no features sueltas: problema real
   local (punto de partida) → lean startup (metodología) → simulación con datos
   (capa de rigor económico) → venta real (culminación opcional).
3. **Fase de venta real = tier "valiente" opcional.** El núcleo (validación incluida)
   es seguro y reutilizable por cualquier profe; vender de verdad es un nivel extra
   con su propia guía de seguridad (dinero, permisos, menores).
4. **Funciones de empresa (operaciones, RRHH, financiación) = fases de
   profundización para Batx/FP**, después de validar. Respeta el lean en niveles
   bajos/fases tempranas; gana transversalidad completa en niveles altos. Ninguna
   función básica queda fuera; aparecen en el momento pedagógicamente correcto.
5. **Asignatura de emprendimiento puro destacada: GPE Bach.** (EEAE, Eco 4ESO y
   EDMN se mencionan como relacionadas vía el mapa transversal, pero la estrella de
   la sección es GPE.)
6. **Formato: web por fases + PDF**, replicando el patrón `proyecto` de GPE (single
   source of truth en MDX → páginas web + cuaderno PDF imprimible).
7. **Escala: modular flexible.** Se definen las fases; cada profe decide cuántas
   hace (sprint de un mes o curso entero) mediante itinerarios predefinidos.

## Las fases (el tronco)

11 fases + ★ valiente. Cada fase es un módulo independiente con objetivo, duración
estimada, entregable y rúbrica.

| # | Fase | Núcleo/Profundo | Nivel | Ángulo | Puente con asignatura |
|---|------|:---:|:---:|--------|------|
| 1 | **Detecta** | núcleo | todos | Problema real local | — |
| 2 | **Idea y equipo** | núcleo | todos | — | — |
| 3 | **Modelo de negocio (BMC)** | núcleo | todos | — | EDMN U4-5 |
| 4 | **Valida (lean/MVP)** | núcleo | todos | Lean startup | GPE |
| 5 | **Marketing** | núcleo | todos | — | EDMN U6 |
| 6 | **Operaciones y producción** | profundo | bach-fp | — | EDMN U7 |
| 7 | **Personas y equipo (RRHH)** | profundo | bach-fp | — | EDMN U8 |
| 8 | **Financiación e inversión** | profundo | bach-fp | — | EDMN U9, Eco1B |
| 9 | **Números y viabilidad** | núcleo | todos | Simulación con datos | EDMN U10-11 |
| 10 | **Estrés-test (datos reales)** | profundo | bach-fp | Simulación con datos | Eco1B macro |
| 11 | **Pitch + dossier** | núcleo | todos | — | GPE |
| ★ | **Lanza (venta real)** | valiente | opcional | Mini-empresa real | — |

> Los puentes con unidades concretas se verifican contra el catálogo real durante
> la implementación de cada fase (no se inventan números de unidad).

## Itinerarios (ramas por nivel)

Una sola **rejilla de fases** con etiquetas de nivel, no tres copias del proyecto.
El profe elige itinerario en la página índice:

- **Sprint ESO** → fases 1, 2, 3, 4, 11 (lean puro, ~1 mes).
- **Proyecto Batx/FP** → las 11 fases.
- **A la carta** → ve las 11 y elige (banco de módulos).

Las fases "profundo (bach-fp)" llevan distintivo visual claro para que en ESO se
salten sin ruido.

## El mapa transversal (los puentes)

- Cada fase termina con un bloque **"Esto se trabaja en…"** que enlaza
  explícitamente a las unidades concretas de cada asignatura.
- La página índice incluye un **diagrama** que muestra cómo el proyecto cruza las
  asignaturas, visualmente.

## Estructura técnica

Calca el patrón `proyecto` de GPE (ya en producción).

- **Nueva colección** `proyectoTransversal` en `content.config.ts` (espejo de
  `proyecto`). Frontmatter por fase:
  - `fase` (number), `title` (string), `slug`
  - `nucleo` (boolean), `nivel` ('eso' | 'bach-fp' | 'todos')
  - `duracion` (string), `entregable` (string)
  - `unidades_relacionadas` (array de `{ asignatura, unidad }`)
  - `competencias_clave` (string[]), `competencias_especificas` (string[])
  - `estado` ('borrador' | 'publicado')
- **Contenido:** `src/content/emprendimiento/proyecto/{00-intro,01..11-*,99-lanza-valiente}.mdx`.
- **Rutas:**
  - `/emprendimiento/` → hub de sección (asignatura GPE destacada + entrada al proyecto).
  - `/emprendimiento/proyecto/` → índice (3 itinerarios + diagrama transversal).
  - `/emprendimiento/proyecto/[fase]` → cada fase.
- **PDF:** clon `scripts/build-proyecto-transversal-pdf.mjs` (basado en
  `build-proyecto-pdf.mjs`), genera el cuaderno descargable. Añadir a `build:all`.
- **Estética:** Variant C, color de emprendimiento (verificar el token usado por la
  tarjeta E de la home durante implementación).

## Rúbricas y evaluación

- **Rúbrica por fase** (patrón del cuaderno de GPE) + **rúbrica global** del proyecto.
- **Rejilla de competencias LOMLOE** (`competencias_clave` + `competencias_especificas`,
  ya en el schema del proyecto) para justificar la evaluación.
- **DUA contemplado** (como GPE).

## Alcance de la primera tanda

- Arquitectura completa: colección, rutas, hub `/emprendimiento/`, índice del
  proyecto con los 3 itinerarios, diagrama transversal, script PDF.
- **3 fases piloto completas**, una de cada tipo:
  - **Fase 1 — Detecta** (núcleo, todos, abre la narrativa "problema real").
  - **Fase 4 — Valida** (núcleo, todos, corazón lean).
  - **Fase 8 — Financiación** (profundo, bach-fp, demuestra la rama de profundidad).
- Resto de fases + ★ valiente: tandas posteriores.

## Fuera de alcance (esta tanda)

- Componentes interactivos (generador de BMC, calculadora de viabilidad,
  timeline rellenable). Se valoran en fase posterior; el formato elegido es web por
  fases + PDF, no web interactivo con herramientas.
- Las 8 fases restantes + ★.
- Suavizar la tarjeta Emprendimiento de la home (va en PR #71 o aparte).
- Catalán/valenciano (i18n): solo castellano en el MVP.

## Pendiente de decidir (no bloquea la implementación)

- **Nombre propio del proyecto.** Candidatos: "De cero a empresa", "El Proyecto",
  "Tu primera empresa", "Arranca". Se decide antes de redactar la intro.

## Aprendizajes a respetar (de tandas anteriores)

- Verificar siempre con build (`npm run build`); los MDX en `borrador` no compilan
  el cuerpo, usar flip temporal a `publicado` para verificar.
- Citar entre comillas cualquier valor de frontmatter con `': '` (si no, YAML peta).
- Sin emojis pictográficos (CLAUDE.md); sí símbolos tipográficos (→ × —).
- Acentuación correcta en todo el contenido castellano.
- `build-proyecto-pdf.mjs` apunta a `dist/client/` tras la migración al adaptador
  Vercel; el clon debe heredar ese detalle.
