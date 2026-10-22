# Ejercicios resueltos de EDMN por familia — diseño

*2026-10-22 · estado: aprobado por Pau (decisiones 1 y 2 incluidas)*

## Por qué

Search Console (20 jul – 19 oct 2026) muestra que EDMN 2BACH no aparece para las búsquedas de concepto que hace un alumno antes del examen. En tres meses, la suma de todas las consultas visibles de EDMN es de 458 impresiones, y ninguna es de `punto muerto`, `VAN TIR` o `ratios`. Las que aparecen están muy abajo: `funcion comercial` en la posición 65,8 y `modelos de negocio` en la 41. La calculadora de punto muerto está en la posición 14,5.

El material ya existe. `src/content/asignaturas/edmn-2bach/ebau/03-problemas-resueltos.mdx` tiene 15 problemas resueltos paso a paso, con interpretación, repartidos en cinco familias. Pero `src/pages/[asignatura]/ebau/index.astro` muestra **las cinco entradas del cuaderno, unas 2.900 líneas, en una sola URL** (`/edmn-2bach/ebau/`). Una página no puede posicionar a la vez para seis intenciones distintas. Por eso el problema es cómo está empaquetado el contenido, no la falta de contenido.

Los exámenes de EDMN cambian de formato según la comunidad: Extremadura pide elegir 2 de 3 problemas, Aragón tiene un bloque práctico de 7 puntos, Valencia pide 2 ejercicios de 2 puntos. Las familias de ejercicio, en cambio, son las mismas en todas. Fuentes: [UEx 2025-26](https://vrestudiantes.unex.es/wp-content/uploads/sites/23/2025/10/2025_26_Empresa_Orientaciones.pdf), [ULPGC 2025](https://feet.ulpgc.es/wp-content/uploads/CONTENIDOS-Y-ESTRUCTURA-PAU-2025-EMPRESA-Y-DISENO-DE-MODELO-DE-NEGOCIO_FINAL.pdf), [modelo Aragón 2026](https://academico.unizar.es/sites/academico/files/archivos/acceso/accespau/exame/26mod/edmn.pdf), [criterios UV 2024](https://www.uv.es/econdocs/cooperacio_secundaria/pau_25/Criterios%20EMDI%20Julio%202024.pdf).

La búsqueda es estacional: alumnos de 2.º de Bachillerato entre abril y junio. Google tarda semanas en colocar una página nueva, así que hay que publicar **antes de que acabe febrero de 2027**.

## Qué es

Hay que añadir **una página por familia de ejercicio**. Cada una debe ser la mejor respuesta de la web en castellano a la búsqueda «[concepto] ejercicios resueltos». Las familias son estas (el slug es orientativo):

Las familias son las **cinco secciones que ya tiene `03-problemas-resueltos.mdx`**, para que cada problema actual vaya a una sola familia sin partirlo:

| Familia | Slug | Problemas actuales | Problemas nuevos (mínimo) | Unidad | Calculadora |
|---|---|---|---|---|---|
| Costes y punto muerto (incluye producir o comprar) | `punto-muerto-ejercicios-resueltos` | 1.1, 1.2, 1.3 | 1 | U7 | `calculadora-punto-muerto` |
| Productividad y eficiencia | `productividad-ejercicios-resueltos` | 2.1, 2.2, 2.3 | 1 | U7 | `ProductividadCalc` (*decisión mía:* crear el recurso EDMN ES/CA, que es solo un frontmatter) |
| Selección de inversiones: VAN, TIR y plazo de recuperación | `van-tir-payback-ejercicios-resueltos` | 3.1, 3.2, 3.3 | 1 | U9 | `calculadora-van-tir` |
| Balance y cuenta de pérdidas y ganancias | `balance-cuenta-resultados-ejercicios-resueltos` | 4.1, 4.2 | 2 (uno de amortización) | U10 | `cuenta-resultados` |
| Ratios, fondo de maniobra y rentabilidades | `ratios-fondo-maniobra-ejercicios-resueltos` | 5.1, 5.2, 5.3 | 1 (periodo medio de maduración) | U11 | `calculadora-ratios` |

*Decisión mía:* la rentabilidad económica y financiera no tiene página propia. El problema 5.2 ya la mezcla con el endeudamiento, y separarla obligaría a duplicarlo o partirlo. Si en GSC aparece demanda propia para «rentabilidad económica ejercicios», se separará.

**Numeración** (*decisión mía*): dentro de cada página, los problemas son «Problema 1, 2, 3…». El índice del cuaderno los cita como «Punto muerto · Problema 2». No hace falta conservar los anclajes antiguos (`#problema-1-1`).

**Autoría** (*decisión mía*, siguiendo el CLAUDE.md): Claude redacta los problemas nuevos y sus versiones en valenciano; los revisan el agente `content-reviewer` y luego Pau, antes de `estado: publicado`.

**URLs en valenciano** (*decisión mía*): el mismo slug bajo `/ca/`, como el resto del sitio.

Cada página tiene, en este orden:

1. **Formulario de la familia**: las fórmulas que se usan, con las siglas que usan los correctores.
2. **De 4 a 6 problemas, de fácil a tipo examen.** Cada uno tiene enunciado, planteamiento (la fórmula), cálculo, **resultado con unidades** y **una frase de interpretación**, que es lo que valoran los correctores. Los 3 problemas actuales de cada familia son la base; hay que añadir de 1 a 3 problemas nuevos por familia para llegar a 4-6.
3. **Errores típicos** que hacen perder puntos.
4. **Enlace a la calculadora** de la familia, para comprobar resultados, y a la unidad del libro.
5. Enlace a los **exámenes oficiales** que ya tenemos (`/[asignatura]/ebau/examenes/`) para practicar con el formato real.

Las soluciones son **visibles para todo el mundo**. Es lo que busca el alumno, y el cuaderno EBAU ya las publica.

## Objetivos

- EDMN empieza a tener impresiones para búsquedas de concepto como `punto muerto ejercicios resueltos` o `van y tir ejercicios resueltos`, que hoy no tiene.
- Antes de abril de 2027, cada página de familia está en el top 10 de su consulta principal.
- En mayo de 2027, las visitas de EDMN desde buscadores superan el máximo mensual de octubre de 2026 (unas 120 a la semana), sumando castellano y valenciano.

## No objetivos

- Versiones por comunidad autónoma. Los ejercicios son «tipo PAU» sobre el currículo estatal (RD 243/2022), igual que el resto del sitio. El campo `comunidad` del cuaderno no cambia.
- Calculadoras nuevas en esta fase. Las que faltan (rentabilidad, amortización, periodo medio de maduración) se valorarán cuando haya datos de las páginas.
- Precargar los datos de cada problema en la calculadora.
- Hacerlo para EEAE o GPE, que también tienen cuaderno EBAU. Si funciona con EDMN, será un proyecto aparte.

## Antiobjetivos (aunque funcione, sería un fracaso si…)

- **El mismo problema vive en dos ficheros.** Esto rompe la regla de una sola fuente de verdad del CLAUDE.md. Los problemas se mueven, no se copian: el cuaderno y la página de familia leen el mismo contenido.
- **El cuaderno impreso (`/edmn-2bach/ebau/imprimir/`) y la página `/edmn-2bach/ebau/` pierden problemas o cambian de orden.** Para quien ya los usa, deben quedar igual.
- **Se copian enunciados de exámenes oficiales literalmente.** Los problemas son originales; se puede inspirar en el tipo de ejercicio, pero no copiar el texto.
- Una página delgada con 2 ejercicios y mucho texto de relleno SEO.
- Falta la versión `/ca/` de alguna página. La paridad ES/CA es obligatoria en todo el sitio.

## Restricciones

- Hay que respetar la estructura por asignatura. Ninguna asignatura gana una **sección** nueva. Las páginas cuelgan de la sección `ebau`, que ya existe (ver decisión 1).
- Todos los problemas nuevos pasan el agente `content-reviewer` (cálculos, interpretación, paridad ES/CA) y la revisión manual de Pau antes de `estado: publicado`.
- El diseño editorial es el actual (`docs/design-system.md`). No se crean componentes visuales nuevos si los existentes sirven.
- La lógica nueva lleva test (TDD), como pide el CLAUDE.md.

## Decisiones de Pau (aprobadas el 2026-10-22)

1. **Ruta nueva dentro de `ebau`: `/[asignatura]/ebau/[slug]/`.** Hoy la sección `ebau` es una sola página. Añadir subpáginas no crea ninguna sección, pero cambia la forma de una sección existente, y el CLAUDE.md pide la aprobación explícita de Pau para cualquier cambio de estructura. La ruta valdría también para EEAE y GPE aunque ahora no tengan subpáginas. *Alternativa sin cambio de estructura:* poner las páginas como `actividades` con `tipo: ejercicio`. Se descarta porque allí las soluciones son solo para el profesorado y porque la URL `/actividades/` no transmite «ejercicios resueltos de examen».
2. **Partir `03-problemas-resueltos.mdx`.** Los problemas pasan a cinco ficheros por familia (ES + CA), que son la única fuente. Propuesta:
   - **`/edmn-2bach/ebau/` (web)**: la sección «Problemas resueltos» se queda con la introducción y **enlaza** a las cinco familias en lugar de mostrarlas enteras. La página pasa de unas 2.900 líneas a unas 2.500 y deja de competir con las páginas de familia.
   - **`/edmn-2bach/ebau/imprimir/` (PDF/impresión)**: **incrusta** las cinco familias completas, en el orden actual, para que el cuaderno impreso no pierda nada.

## Lo que decide el constructor

- Cómo modelar las páginas de familia en `src/content.config.ts`: una colección nueva o la colección `ebau` con un campo nuevo. Hay que mantener la regla de no duplicar.
- El JSON-LD: `articleLd` (`Article` + `LearningResource`) como el resto del libro. El marcado de *practice problems* se retiró en enero de 2026 (`docs/seo-estrategia-2026.md` §2.3 g), así que no hay que perseguirlo.
- El `seoTitle` y la descripción de cada familia, con la palabra «ejercicios resueltos», el acrónimo `EDMN`/`EBAU` cuando quepa y sin pasar de unos 60 caracteres.
- Los enlaces internos de entrada a cada página: desde la unidad del libro correspondiente, desde la calculadora, desde el índice del cuaderno y desde el hub de EDMN.
- Extraer la lógica de `PuntoMuertoCalc` y `RatiosCalc` a `src/lib/calc/` con tests, si hace falta tocarlos (hoy la tienen en línea y sin test).
- El orden de entrega. La sugerencia es empezar por punto muerto y VAN/TIR, que tienen más volumen probable, publicar y dejar las otras cuatro en PR separados.

## Cómo medirlo

- Search Console, filtrado por la página de cada familia: impresiones y posición de la consulta principal, a los 30 días de publicar y en abril de 2027.
- Vercel Web Analytics: visitantes con referrer de buscador hacia `/edmn-2bach/ebau/*`, comparando mayo de 2027 con octubre de 2026.
- Añadir el resultado a `docs/seo-estrategia-2026.md` como sección nueva.
