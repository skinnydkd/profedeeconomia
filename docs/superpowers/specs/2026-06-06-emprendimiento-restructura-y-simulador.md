# Emprendimiento — reestructura (GPE) y simulador digital

> Estado: **decisiones críticas reservadas para Pau**. Lo aditivo y seguro (5
> dinámicas nuevas, incluidas dos de simulación) ya se hizo en este PR. Esto
> documenta la decisión estructural y la propuesta de simulador digital.

## Estado actual de `/emprendimiento/`
- **Proyecto «De cero a empresa»**: capstone de 12 fases (`proyecto/00..99`), con
  cuaderno del alumno, plantillas visuales, ejemplos y actividades tejidos.
- **Ejemplos**: 9 empresas (4P/BMC) con «chispa».
- **Actividades**: kit de «perder la vergüenza» — eran 7, **ahora 12** (este PR
  añade mercado en vivo, dirige la empresa, descubre al cliente, SCAMPER y
  fracasa rápido).
- **Entrevista a emprendedores** (proyecto con plantilla PDF).
- La página enlaza además la asignatura **GPE** (Gestión de Proyectos de
  Emprendimiento) como «la materia que lo trabaja a fondo».

## La decisión estructural (tuya)
Pau planteó: basar el libro y las actividades de Emprendimiento en GPE (y quizá
el capstone de EDMN 2.º BACH), y eligió entre:

- **Opción A — Emprendimiento como hub transversal, GPE sigue siendo asignatura.**
  Emprendimiento «toma prestado» el libro/actividades de GPE (y el capstone de
  EDMN) y los presenta agregados, sin duplicar contenido (single source of
  truth: el contenido vive en la asignatura, el hub lo enlaza/encaja). Cruzaría
  con casi todas las asignaturas menos Eco 1.º BACH.
  - *Pros*: no rompe URLs ni estructura; GPE mantiene su ficha; el hub gana
    profundidad sin reescribir. *Contras*: hay que definir bien el «encaje» para
    que no parezca que se repite.

- **Opción B — Quitar GPE como asignatura** y mover su libro/proyecto bajo
  `/emprendimiento/`.
  - *Pros*: un único sitio para «emprender». *Contras*: cambio estructural
    grande (las 9 asignaturas son vinculantes en CLAUDE.md), rompe la ficha y
    enlaces de GPE, y va contra «cada asignatura, misma estructura». **No
    recomendado sin tu OK explícito; es destructivo.**

**Recomendación**: Opción A. Es la que respeta la regla de «single source of
truth» y la estructura por asignaturas, y aun así cumple lo que buscas (un hub
de emprendimiento que se nutre de GPE + EDMN + otras). Si quieres B, lo hago,
pero como cambio estructural explícito y reversible por pasos.

### Si eliges A, plan concreto
1. En el hub, sección «El recorrido completo»: enlazar el **libro de GPE** y el
   **capstone de EDMN 2.º BACH** como las dos rutas largas, con su encaje.
2. «Inversa» de actividades: listar qué actividades de cada asignatura
   (EDMN, Eco 4.º, EEAE, FOPP, IPE…) son de emprendimiento y mostrarlas
   agrupadas, derivado del índice (como ya hace el cajón «Para el aula»).
3. Nada se duplica: el contenido sigue en su asignatura.

## Simulador digital de mercado y empresa
Hoy existe la versión **dinámica de aula** (este PR: «Un mercado en vivo» y
«Dirige la empresa»). La versión **digital interactiva** sería un desarrollo
mayor (isla Preact, como las calculadoras / el ADAS Simulator):
- **Simulador de mercado**: deslizadores de oferta/demanda (o rondas con
  compradores/vendedores) que muestran cómo se forma el precio de equilibrio y
  qué pasa con impuestos, precios máximos/mínimos. Reutilizaría `EquilibrioCalc`
  como base.
- **Simulador de empresa**: el alumno fija precio, producción e inversión por
  rondas y ve beneficio, punto muerto y tesorería. Reutilizaría `PuntoMuertoCalc`
  y `DCFCalc`.
- Esfuerzo: medio-alto (1-2 componentes nuevos + estado por rondas). Encaja como
  herramienta en `/herramientas/` y empotrable en el libro. **Pendiente de tu
  visto bueno** sobre alcance (¿solo mercado, solo empresa, o ambos?).

## Hecho ya en este PR (sin esperar)
- 5 dinámicas nuevas en `emprendimiento/actividades/` (orden 8-12), con las dos
  simulaciones de aula con números verificados.
