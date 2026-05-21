---
asignatura: eco-1bach
unidad_relacionada: 10
title: "El multiplicador del dinero en acción"
descripcion: "Calcular cómo un único depósito inicial genera múltiples depósitos derivados en la cadena bancaria, comparando escenarios con distintos coeficientes de reservas y simulando ciclos de creación de dinero."
tipo: ejercicio
duracion: "55 min · 1 sesión"
agrupacion: "parejas"
materiales:
  - "Calculadora (o app de móvil)"
  - "Hoja de cálculo (LibreOffice Calc, Google Sheets o Excel) — opcional pero recomendado para la extensión"
  - "Ficha de trabajo con la tabla de rondas (se entrega impresa o en PDF)"
  - "Pizarra para puesta en común final"
competencias_clave: [STEM, CPSAA, CD]
competencias_especificas: [CE5]
estado: publicado
---

## Planteamiento

Uno de los hechos más contraintuitivos de la economía moderna es que la mayor parte del dinero que circula **no la crea el banco central**, sino los bancos comerciales cuando conceden préstamos. Esta actividad pretende que el alumnado lo vea con sus propios cálculos: a partir de un depósito inicial concreto, vamos a simular cómo se expande a lo largo de la cadena bancaria y cómo el resultado cambia drásticamente según el coeficiente de reservas que apliquen los bancos.

Trabajaréis con tres escenarios paralelos: coeficientes del **20 %**, del **10 %** y del **5 %**. Veréis que pequeñas diferencias en el coeficiente generan diferencias enormes en la cantidad total de dinero creado.

## Objetivos didácticos

- Calcular el multiplicador del dinero `k = 1/c` a partir del coeficiente de reservas.
- Simular manualmente las primeras rondas de creación de dinero bancario y observar la convergencia geométrica.
- Comparar el efecto de tres coeficientes distintos sobre el dinero total creado por el sistema.
- Razonar por qué el multiplicador efectivo en la realidad es menor que el teórico.
- Conectar el cálculo con decisiones reales de política monetaria del BCE.

## Pasos

1. **Repaso teórico guiado (5 min).** El profesor recuerda en pizarra la fórmula `k = 1/c`, la mecánica de las rondas y los supuestos del ejercicio resuelto 10.1 del libro (los bancos retienen solo el mínimo legal y todo el dinero prestado vuelve al sistema como depósito).
2. **Escenario A — c = 20 % (15 min).** En parejas, partiendo de un depósito inicial de **10.000 €**, calculan las **8 primeras rondas** de la cadena bancaria rellenando esta tabla:

   | Ronda | Depósito | Reserva (20 %) | Préstamo |
   | --- | --- | --- | --- |
   | 1 | 10.000 € | … | … |
   | 2 | … | … | … |
   | … | … | … | … |
   | 8 | … | … | … |

   Después calculan: multiplicador teórico `k`, depósitos totales del sistema (`D_total = D_inicial / c`), préstamos totales, reservas totales y dinero nuevo creado.

3. **Escenarios B y C (15 min).** Repiten el cálculo con **c = 10 %** y **c = 5 %**, partiendo siempre del mismo depósito inicial de 10.000 €. Comparan los tres resultados finales.
4. **Discusión en parejas (10 min).** Responden por escrito a tres preguntas:
   - a) ¿Cuántas veces más dinero se crea en el escenario C respecto al A? ¿Te parece proporcional o desproporcionado al cambio en el coeficiente?
   - b) Si un banco central quiere **frenar la inflación**, ¿le interesa subir o bajar el coeficiente de reservas? Razónalo.
   - c) En la zona euro, el coeficiente legal es del **1 %** desde 2012. ¿Por qué el multiplicador efectivo de M3 sobre M0 no llega a 100, sino que ronda 6-8?
5. **Puesta en común (10 min).** Dos o tres parejas presentan sus tablas y sus respuestas. El profesor conecta los hallazgos con el funcionamiento real del BCE: por qué hoy la política monetaria europea trabaja sobre todo con **tipos de interés** y no con el coeficiente de reservas (que se mantiene fijo y bajo desde hace más de una década).

## Resultados de referencia para el profesor

Con depósito inicial de 10.000 €:

| Coeficiente | Multiplicador `k` | Depósitos totales | Préstamos totales | Dinero nuevo creado |
| --- | --- | --- | --- | --- |
| 20 % | 5 | 50.000 € | 40.000 € | 40.000 € |
| 10 % | 10 | 100.000 € | 90.000 € | 90.000 € |
| 5 % | 20 | 200.000 € | 190.000 € | 190.000 € |

**Lectura clave**: pasar del 20 % al 5 % no triplica el dinero creado, lo **multiplica casi por cinco**. La relación es inversa y no lineal: pequeñas reducciones del coeficiente generan grandes expansiones de la oferta monetaria. Por eso bajar el coeficiente es una herramienta tan potente —y tan poco habitual— de política monetaria.

## Criterios de evaluación

| Criterio | Descripción | Peso |
| --- | --- | --- |
| Corrección de los cálculos | Tablas de rondas y totales bien calculados en los tres escenarios | 40 % |
| Comprensión del multiplicador | Identifica la relación inversa entre `c` y `k` y la convergencia geométrica | 20 % |
| Razonamiento económico | Conecta el coeficiente con política monetaria y control de la inflación | 25 % |
| Reflexión sobre la realidad | Explica con sus palabras por qué el multiplicador efectivo es menor que el teórico | 15 % |

## Variantes y extensiones

- **Variante corta (30 min):** trabajar solo un escenario (c = 10 %) con 5 rondas y omitir la comparación.
- **Variante con hoja de cálculo (90 min):** las parejas montan en LibreOffice Calc / Google Sheets una hoja con celda variable para `c` y gráfico de la progresión geométrica de depósitos. Permiten ver instantáneamente qué pasa al cambiar el coeficiente.
- **Extensión cualitativa:** debate breve sobre la propuesta de **banca con reserva del 100 %** (*full-reserve banking*) defendida por economistas como Irving Fisher en los años 30 o por Milton Friedman: ¿qué pasaría con la creación de dinero? ¿Y con el crédito a empresas y familias?
- **Conexión con la Unidad 11:** continuar la actividad analizando cómo el BCE, en lugar de mover el coeficiente, actúa sobre los tipos de interés oficiales para influir en la velocidad de creación de dinero.
