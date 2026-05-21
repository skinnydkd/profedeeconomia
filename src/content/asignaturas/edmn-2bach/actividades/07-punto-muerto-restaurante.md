---
asignatura: edmn-2bach
unidad_relacionada: 7
title: "Dos planes de cocina: punto muerto y apalancamiento operativo"
descripcion: "Calcular el punto muerto de un restaurante en dos escenarios (cocina manual vs. cocina automatizada) y discutir las implicaciones del apalancamiento operativo."
tipo: ejercicio
duracion: "55 min · 1 sesión"
agrupacion: "individual + puesta en común en grupos pequeños"
materiales:
  - "Calculadora"
  - "Hoja de cálculo (opcional, para hacer un gráfico de los dos planes)"
  - "Plantilla con la tabla de datos del caso"
competencias_clave: [STEM, CD, CPSAA]
competencias_especificas: [CE4]
ebau: true
estado: publicado
---

## Planteamiento

*La Cocinera del Mercado* es un restaurante que abrirá en seis meses. Su capacidad máxima diaria son **80 menús**. Los promotores dudan entre dos planes industriales para arrancar:

| Variable | Plan A — Manual | Plan B — Automatizado |
| --- | --- | --- |
| Inversión inicial | 25.000 € | 70.000 € |
| Coste fijo mensual (alquiler, sueldos, amortización) | 8.000 € | 14.000 € |
| Coste variable por menú (materia prima, energía) | 6,50 € | 4,20 € |
| Precio medio por menú | 15 € | 15 € |

Operan 26 días al mes. Os han pedido que calculéis qué plan conviene en distintos escenarios de demanda.

## Objetivos didácticos

- Aplicar la fórmula del punto muerto en dos escenarios.
- Calcular el punto de indiferencia entre dos planes con estructuras de coste distintas.
- Interpretar el concepto de apalancamiento operativo y su impacto en el riesgo del negocio.

## Pasos

1. **Cálculo individual (20 min).** Cada alumno responde por escrito:
   - a) Punto muerto mensual y diario de cada plan.
   - b) Beneficio mensual de cada plan si vendieran 1.500 menús/mes (≈ 58 menús/día).
   - c) Beneficio mensual si vendieran 2.080 menús/mes (capacidad máxima al 100 %).
   - d) Punto de indiferencia: ¿a partir de qué volumen mensual conviene cambiar del Plan A al Plan B?
2. **Puesta en común en grupo (15 min).** En grupos de 4, comparan resultados y resuelven discrepancias. Si todos coinciden en cifras pero discrepan en la decisión final, identifican qué supuestos cambian.
3. **Discusión guiada (15 min).** El profesor pregunta:
   - ¿Cuál es el riesgo principal del Plan B?
   - Si la previsión más realista es 1.300 menús/mes, ¿qué plan es más prudente?
   - ¿Qué implicaciones tiene el apalancamiento operativo en una crisis económica que reduzca la demanda un 30 %?
4. **Cierre (5 min).** Cada alumno escribe en su cuaderno: *si fuera mi dinero, elegiría el plan ___ porque ___ .* (un párrafo).

## Solución (para corrección)

a) **Punto muerto mensual y diario:**
- Plan A: Q* = 8.000 / (15 − 6,50) = **942 menús/mes ≈ 36 menús/día**
- Plan B: Q* = 14.000 / (15 − 4,20) = **1.296 menús/mes ≈ 50 menús/día**

b) **Beneficio con 1.500 menús/mes:**
- Plan A: (15 − 6,50) × 1.500 − 8.000 = 12.750 − 8.000 = **+4.750 €/mes**
- Plan B: (15 − 4,20) × 1.500 − 14.000 = 16.200 − 14.000 = **+2.200 €/mes**
- A 1.500 menús, **Plan A es más rentable** (+2.550 € de diferencia).

c) **Beneficio al 100 % de capacidad (2.080 menús/mes):**
- Plan A: 8,50 × 2.080 − 8.000 = 17.680 − 8.000 = **+9.680 €/mes**
- Plan B: 10,80 × 2.080 − 14.000 = 22.464 − 14.000 = **+8.464 €/mes**
- Sorprendentemente, incluso a capacidad máxima Plan A sigue ganando (+1.216 €), porque los CF adicionales del Plan B son tan altos que el mayor margen unitario no llega a compensarlos en este rango. Esto es excepcional: requiere recalcular el punto de indiferencia.

d) **Punto de indiferencia:** 8,50·Q − 8.000 = 10,80·Q − 14.000 → 6.000 = 2,30·Q → Q ≈ **2.609 menús/mes**.
- Pero la capacidad máxima es 2.080 menús/mes < 2.609.
- **Conclusión clave:** dentro del rango operativo del restaurante, **Plan A siempre es más rentable**. El Plan B solo tendría sentido si planearan ampliar capacidad o subir precios.

## Discusión final

El ejercicio enseña dos lecciones contraintuitivas:

> 1. Más automatización no equivale a más rentabilidad. Hay que confrontar siempre con el volumen previsible.
> 2. El apalancamiento operativo amplifica beneficios y pérdidas. Plan B podría ser desastroso si la demanda real fuera de 1.000 menús/mes (pérdida de 3.200 €/mes) mientras Plan A aún sería rentable a ese nivel (+500 €/mes).

## Criterios de evaluación

| Criterio | Descripción | Peso |
| --- | --- | --- |
| Cálculo correcto | Las cuatro respuestas numéricas sin errores | 50 % |
| Interpretación | Identifica que Plan A gana en todo el rango operativo y por qué | 25 % |
| Análisis del riesgo | Comprende el papel del apalancamiento operativo en escenarios de caída de demanda | 15 % |
| Decisión personal argumentada | El cierre escrito está bien razonado | 10 % |

## Variantes y extensiones

- **Variante con hoja de cálculo:** dibujar las curvas de coste e ingresos de ambos planes en un mismo gráfico y marcar el punto muerto de cada uno y el punto de indiferencia.
- **Conexión con Unidad 9:** calcular el VAN de cada plan a 5 años con flujos previstos, comparando rentabilidad financiera, no solo operativa.
