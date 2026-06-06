# Business Game — simulador de empresa de curso completo

> Estado: **propuesta de diseño, pendiente de validación de Pau**. Es un producto
> nuevo (multijugador, persistente, con motor de mercado), no una isla. El
> CLAUDE.md sitúa los juegos multijugador como fase futura y exige diseño antes
> de código. No se ha escrito nada de implementación.

## La visión (Pau)

Un **proyecto de aula de todo el curso (7-8 meses)**. Cada mes simula un año. El
alumnado, **en grupos, dirige una empresa** que compite con las demás en un
**mercado compartido**. Cada ronda toman decisiones en las **4 áreas** de la
empresa; según lo que deciden ellos **y los demás grupos**, venden más o menos,
facturan más o menos y obtienen distinto beneficio. Referente: **CEU Pearson
Business Game** (simulador «Kayak»: equipos dirigen una empresa ~5 años, deciden
precio, operaciones, producto, RRHH, comunicación y distribución; compiten por
mercados; gana quien más valor genera).

Requisito clave: **registro y ranking persistentes**, idealmente con el **mismo
sistema que «Juegos Económicos»** (nombre + instituto), y que quede el ranking.

## Lo que ya hay para reutilizar (clave)

«Juegos Económicos» ya tiene backend real:
- **Supabase** (Postgres) — `lib/jocs-economics/server/supabase`. Tablas como
  `institutes`, `games`. Tokens firmados (`JOCS_TOKEN_SECRET`).
- **Astro API routes** serverless en `src/pages/api/jocs/` (start, answer,
  finish, leaderboard, institutes).
- **Registro** = nombre + instituto (sin cuentas; identidad en localStorage).

→ El business game **reutiliza esa misma Supabase y ese registro**. Solo añade
tablas y endpoints nuevos. Cumple lo que pide Pau sin inventar infraestructura.

## Modelo de mercado (el corazón — a validar con Pau)

Cada ronda (= un año), cada equipo-empresa fija sus decisiones; el motor reparte
la demanda según el atractivo **relativo** de cada oferta y calcula ventas,
ingresos, costes y beneficio. Propuesta de modelo (sencillo pero económicamente
honesto, conectado al currículo de EDMN/Economía):

**Decisiones por área (4 áreas):**
- **Operaciones/Producción**: unidades a producir (capacidad) · inversión en
  calidad del producto.
- **Comercial/Marketing**: precio de venta · gasto en marketing/publicidad.
- **Finanzas**: financiación (préstamo con interés vs autofinanciación) ·
  reinversión vs reservas.
- **RRHH**: plantilla / inversión en formación y salarios (→ productividad, que
  baja el coste unitario, y/o calidad).

**Motor (cada ronda):**
1. Atractivo de cada empresa `A_i = f(calidad_i, marketing_i, 1/precio_i)`
   (ponderaciones configurables por el profe).
2. Demanda total del mercado `D` (fija o creciente por ronda) repartida por
   cuota: `demanda_i = D × A_i / Σ A_j`.
3. Ventas `ventas_i = min(demanda_i, producción_i)` (no se vende más de lo
   producido; lo no vendido es stock con coste).
4. Ingresos `= ventas_i × precio_i`.
5. Costes `= CF + CVu × producción + marketing + RRHH/formación + intereses +
   coste de stock`.
6. Beneficio `= ingresos − costes`; se acumulan caja, beneficio acumulado y
   cuota de mercado.
7. **Ranking** por beneficio acumulado / valor de la empresa.

Esto entrena de verdad: demanda y elasticidad, competencia, costes, punto
muerto, financiación, productividad — todo del currículo. **Pau debe validar las
variables, las fórmulas y las ponderaciones**, que es lo que hace el juego
educativo en vez de un Excel arbitrario.

## Arquitectura

- **Supabase** (la misma de jocs): tablas nuevas
  - `bg_ligas` (partida del profe: código de unión, ronda actual, parámetros de
    mercado, estado).
  - `bg_equipos` (equipo: liga, nombre, instituto, miembros, caja, estado).
  - `bg_decisiones` (equipo, ronda, decisiones de las 4 áreas).
  - `bg_resultados` (equipo, ronda, ventas/ingresos/beneficio/cuota).
- **Astro API routes** `src/pages/api/business-game/`: crear-liga (profe),
  unirse (equipo), enviar-decisiones, cerrar-ronda (profe → ejecuta el motor),
  resultados, ranking.
- **Registro**: igual que jocs (nombre + instituto). El **profe crea una liga**
  y obtiene un **código**; los equipos se unen con el código + nombre de equipo
  + instituto.
- **Frontend** (islas Preact): consola del equipo (decisiones por área, ver
  resultados y ranking) + panel del profe (crear liga, avanzar/cerrar rondas,
  ver todos los equipos).

## Plan por fases (es multi-sesión)

- **Fase 0** — este spec + tu validación del **modelo de mercado** (variables,
  fórmulas, ponderaciones, demanda). Sin tu OK aquí no se construye el motor.
- **Fase 1 (MVP)** — un solo mercado; las 4 áreas en versión simplificada; el
  motor; tablas Supabase + endpoints; consola del equipo + «cerrar ronda» del
  profe + ranking. Jugable en una clase de principio a fin.
- **Fase 2** — pulido: gráficos de evolución, histórico por ronda, varios
  mercados, exportar informe/presentación final, robustez y validaciones.

## Decisiones abiertas (para ti)

1. **Modelo de mercado**: ¿valen las 4 áreas y las variables propuestas?
   ¿Quieres más/menos (p. ej. distribución, I+D, RSC)? ¿La fórmula de atractivo
   te encaja? Esto es lo primero a cerrar.
2. **Cadencia**: ¿el profe cierra cada ronda manualmente (mensual) y entre medias
   los equipos envían decisiones cuando quieran? (recomendado).
3. **MVP**: ¿empezamos con **un mercado** y 4 áreas simplificadas, y crecemos? (recomendado).
4. **Persistencia/registro**: confirmar que reutilizamos la Supabase de jocs y el
   registro nombre+instituto (lo que pediste).

## Nota de encaje

El CLAUDE.md lista «Jocs multijugador» como **fase 3 (futuro 2027)** con backend
tipo PartyKit/Durable Objects «a revisar al momento». Como jocs-economics ya usa
Supabase + API routes con éxito, la recomendación es **reutilizar esa vía** (no
PartyKit) para este juego asíncrono por rondas, que encaja mejor con una partida
de meses que con tiempo real.
