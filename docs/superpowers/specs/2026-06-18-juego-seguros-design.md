# Diseño — Juego de seguros ("Asegurados")

- **Fecha:** 2026-06-18
- **Estado:** aprobado (brainstorming)
- **Ruta:** `/juegos/seguros/`
- **Tipo:** juego de clase guiado por el profe (proyector), por equipos.

## Objetivo pedagógico

Que el alumnado entienda **cómo funciona un seguro**: pagas una prima pequeña y recurrente
a cambio de no asumir un daño grande e incierto. La idea clave a interiorizar es que
**el seguro no sirve para ganar dinero, sino para no arruinarte** (reduce la varianza, no el
coste medio). El azar del juego hace que a veces quien no se asegura gane —y eso es,
precisamente, el momento de aprendizaje sobre riesgo.

Encaje curricular: Eco 1BACH (planificación financiera personal, sistema financiero),
Eco 4ESO (vida práctica / finanzas personales). Reutilizable en FOPP.

## Modo de juego

- **Una sola pantalla proyectada**, conducida por el profe.
- La clase se divide en **equipos** (2–8, por defecto 4). La pantalla **lleva el estado**
  de cada equipo (saldo, coberturas) y muestra un **ranking en vivo**.
- El profe avanza las rondas e introduce las decisiones de cobertura de cada equipo.

## Bucle de juego

Configuración inicial → **N rondas** (por defecto 10) → debrief final.

Cada ronda, en fases:

1. **Ingreso**: todos los equipos cobran un ingreso fijo.
2. **Cobertura**: el profe marca en una rejilla `equipos × seguros` qué asegura cada
   equipo esta ronda. La cobertura de la ronda anterior se mantiene por defecto
   (renovación automática); el profe solo togglea los cambios → rápido.
3. **Primas**: se descuentan automáticamente las primas de lo asegurado.
4. **Evento**: el profe pulsa "Revelar evento" → sale **un único evento** para toda la
   clase (o "todo tranquilo"). Los equipos **cubiertos** no pagan; los **no cubiertos**
   pagan el daño.
5. Saldos y ranking se actualizan en vivo.

> **Decisión de diseño: evento compartido por ronda.** Un solo evento por ronda afecta a
> toda la clase; la única diferencia entre equipos es su decisión de cobertura → comparación
> limpia y dramática en la pantalla. (Alternativa descartada: cada equipo tira sus propios
> dados — más realista pero menos claro proyectado.)

`saldo = saldo + ingreso − primas − daños`

## Contenido (valores de ejemplo, ajustables en `data.ts`)

Calibrado para que **prima ≈ probabilidad × daño** (juego "justo"): de media cuesta lo mismo
asegurarse que no, pero asegurarse elimina el riesgo de ruina.

| Seguro | Prima/ronda | Evento | Prob./ronda | Daño |
|---|---|---|---|---|
| Móvil | 30 € | Pantalla rota / robo | 16 % | 200 € |
| Coche/Moto | 70 € | Accidente | 16 % | 450 € |
| Hogar | 80 € | Incendio / inundación | 14 % | 600 € |
| Salud | 60 € | Gasto médico (dentista, privada…) | 16 % | 400 € |
| Resp. civil | 90 € | Te reclaman judicialmente | 8 % | 1.200 € |
| — | — | **Todo tranquilo (no pasa nada)** | 30 % | — |

- **Ingreso**: 350 €/ronda. **Saldo inicial**: 1.000 €. **Rondas**: 10.
- Asegurarlo **todo** cuesta 330 €/ronda (< ingreso 350, deja solo 20 € de margen): **obliga a
  priorizar**. La resp. civil (cara y rara) es la trampa clásica de cobertura de cola:
  la mayoría la quita y se sale con la suya… hasta que alguien se come los 1.200 €.
- Las probabilidades son **pesos de una baraja**: cada ronda se extrae exactamente un
  resultado (un evento de una categoría, o "todo tranquilo"). Suma de pesos = 100 %.
- Los números se **validan con una simulación Monte Carlo** en los tests del motor para
  comprobar el balance (insured ≈ estable; uninsured = alta varianza).

## Final: debrief pedagógico (pieza clave)

Además del ranking por saldo, pantalla de cierre que muestra **por equipo**:

- total pagado en primas,
- total de daños sufridos (lo que NO estaba cubierto),
- daños evitados gracias a estar cubierto,
- un veredicto en lenguaje natural ("El Equipo C ahorró 800 € en primas pero un incendio
  se llevó 600").

Y una conclusión de clase: comparar equipos muy asegurados vs poco asegurados para razonar
que el seguro cambia el **riesgo**, no necesariamente el resultado medio.

## Configuración (pantalla inicial del profe)

- Número de equipos (2–8, por defecto 4).
- Nombres de equipo (opcional; por defecto "Equipo A", "Equipo B"…).
- Número de rondas (por defecto 10).
- Ingreso por ronda y saldo inicial (editables).
- La partida se guarda en `localStorage` (`makeGameStorage('seguros')`) para poder
  reanudar si se recarga la página a mitad de clase.

## Arquitectura (sigue el patrón de juegos existente)

- **Ruta**: `src/pages/juegos/seguros/index.astro` → `GameShell` + isla
  `<SegurosGame client:load />`.
- **Isla Preact**: `src/components/games/seguros/SegurosGame.tsx` — máquina de estados
  (`setup → ronda[cobertura → evento → resolución] → debrief`) + subcomponentes por fase +
  `seguros.css` (tokens Variant C: terracota/mostaza/cream, Fraunces/Switzer).
  - Subcomponentes previstos: `SetupScreen`, `CoverageScreen` (rejilla equipos×seguros),
    `EventScreen` (revelar + resolver), `Scoreboard` (ranking en vivo, reutilizado),
    `DebriefScreen`.
- **Motor** (lógica pura, sin efectos): `src/lib/games/seguros/`
  - `types.ts` — `GameState`, `Team`, `InsuranceKey`, `EventOutcome`, fases.
  - `data.ts` — seguros (prima) y baraja de eventos (peso, categoría, daño) + config por defecto.
  - `engine.ts` — `createInitialState(config)`, `setCoverage`, `chargePremiums`,
    `drawEvent(rng)`, `resolveEvent`, `advanceRound`, `ranking`, `debriefStats`. RNG inyectable.
  - `engine.test.ts` — vitest: transiciones, validación, y simulación Monte Carlo de balance.
- **Persistencia**: `makeGameStorage<GameState>('seguros')` (mismo helper que stonks).
- **Registro**: alta en `src/lib/juegos.ts` con `tipo: 'tablero'`, `modo: 'clase por equipos · proyector'`,
  `nivel: ['eso','bach']`, `imprimible: false`, `unidades_relacionadas` (Eco 1BACH planificación
  financiera, Eco 4ESO vida práctica) y `competencias_clave`.

### Diseño visual

Reutiliza `GameShell.astro` y los tokens Variant C. Sin emojis pictográficos (símbolos
tipográficos o SVG). Saldo/daños en sans (Switzer), colores funcionales: cubierto = teal,
daño/no cubierto = terracota. El evento se revela con una tarjeta destacada.

## Fuera de alcance (v1)

- Versión imprimible (cartas/fichas) — fácil de añadir luego (deriva de `data.ts`).
- Modo individual (cada alumno en su dispositivo) — el framework lo soporta; se valora aparte.

## Criterios de éxito

- El profe puede montar y jugar una partida completa de 10 rondas con 4 equipos proyectada,
  sin instalar nada, en ~10–15 min de clase.
- El motor es determinista con RNG inyectable y pasa tests (incluida la simulación de balance).
- El debrief deja claro el mensaje: el seguro reduce el riesgo, no garantiza ganar.
- Encaja con la estética y el registro del resto del sitio (Variant C, castellano, sin emojis).
