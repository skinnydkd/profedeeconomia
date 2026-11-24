---
asignatura: eco-1bach
unidad_relacionada: 3
title: "Ahorro mensual con interés compuesto: cuánto acumulas en 5 años"
tipo: ejercicio
descripcion: "Calcular el capital final de un plan de ahorro con aportación mensual constante y tipo de interés compuesto anual del 4 %."
duracion: "20-30 min · individual"
agrupacion: "individual"
competencias_clave: [STEM, CD, CE]
competencias_especificas: [CE2]
solucion:
  - "Paso 1: Convertir el tipo de interés anual a mensual. i_m = 4 % / 12 = 0,3333 % = 0,003333."
  - "Paso 2: Calcular el valor futuro del capital inicial. VF_C₀ = 2.000 × (1 + 0,003333)^60 = 2.000 × 1,220997 = **2.441,99 €**."
  - "Paso 3: Calcular el valor futuro de las aportaciones mensuales (renta pospagable). VF_renta = 100 × [(1,003333^60 − 1) / 0,003333] = 100 × [0,220997 / 0,003333] = 100 × 66,2990 = **6.629,90 €**."
  - "Paso 4: Sumar ambos componentes. Capital total = 2.441,99 + 6.629,90 = **9.071,89 €**."
  - "Paso 5: Calcular el total aportado. Aportaciones = 2.000 + (100 × 60) = 2.000 + 6.000 = **8.000 €**."
  - "Paso 6: Obtener los intereses generados. Intereses = 9.071,89 − 8.000 = **1.071,89 €** (el 13,40 % sobre lo aportado)."
  - "Paso 7 (pregunta 3): Con tipo del 2 % anual, i_m = 0,001667. VF_C₀ = 2.000 × 1,105079 = 2.210,16 €. VF_renta = 100 × (0,105079 / 0,001667) = 100 × 63,0474 = 6.304,74 €. Total = **8.514,90 €**, es decir, **556,99 € menos** que al 4 %. Los intereses caen a 514,90 €, frente a 1.071,89 € al 4 %; duplicar el tipo hace algo más que duplicar los intereses acumulados."
estado: publicado
---

## Planteamiento

Sara tiene 17 años y acaba de abrir una cuenta de ahorro con **2.000 € de depósito inicial**. Cada mes ingresa además **100 € adicionales**. La entidad le ofrece un tipo de interés nominal anual del **4 %**, capitalizado mensualmente. Sara mantiene este plan durante **5 años** sin retirar ningún importe.

## Se pide

1. ¿Cuánto dinero habrá acumulado Sara al cabo de los 5 años?
2. ¿Cuánto corresponde al dinero que ella misma ha aportado y cuánto a los intereses generados?
3. Si el tipo de interés fuese del 2 % anual en lugar del 4 %, ¿en cuánto se reduciría el capital final? ¿Qué conclusión puedes extraer sobre la importancia del tipo de interés en el ahorro a largo plazo?
