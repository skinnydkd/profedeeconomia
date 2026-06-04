---
asignatura: edmn-2bach
unidad_relacionada: 9
title: "Renovar la línea de producción: VAN, TIR y PayBack de un proyecto de inversión"
tipo: ejercicio
descripcion: "Evaluar la viabilidad de un proyecto de renovación de maquinaria calculando el PayBack, el VAN y la TIR, e interpretando conjuntamente los tres criterios."
duracion: "25-35 min · individual"
agrupacion: "individual"
competencias_clave: [STEM, CD, CE]
competencias_especificas: [CE4]
ebau: true
solucion:
  - "1. PayBack: año 1 → acumulado 15.000 €; año 2 → 35.000 €; año 3 → 60.000 € (se supera la inversión de 50.000 €). Fracción del año 3: (50.000 − 35.000) / 25.000 = 0,6. **PayBack = 2 años y 7 meses (≈ 2,6 años)**."
  - "2. Factores de descuento (k = 10 %): 1/1,10¹ = 0,9091; 1/1,10² = 0,8264; 1/1,10³ = 0,7513; 1/1,10⁴ = 0,6830."
  - "   VA₁ = 15.000 × 0,9091 = 13.636 €"
  - "   VA₂ = 20.000 × 0,8264 = 16.529 €"
  - "   VA₃ = 25.000 × 0,7513 = 18.783 €"
  - "   VA₄ = 18.000 × 0,6830 = 12.294 €"
  - "   **VAN = −50.000 + 13.636 + 16.529 + 18.783 + 12.294 = +11.242 €**. El proyecto crea valor."
  - "3a. Prueba r = 20 %: factores 0,8333 / 0,6944 / 0,5787 / 0,4823. VAN(20 %) = −50.000 + 12.500 + 13.889 + 14.468 + 8.681 = **−462 €** (≈ 0)."
  - "3b. Prueba r = 19 %: factores 0,8403 / 0,7062 / 0,5934 / 0,4987. VAN(19 %) = −50.000 + 12.605 + 14.124 + 14.835 + 8.977 = **+541 €** (≈ 0)."
  - "   **TIR ≈ 19–20 %** (entre los dos valores que hacen VAN ≈ 0). Como TIR > k (10 %), el proyecto es **aceptable**."
  - "4. El proyecto es viable: VAN > 0, TIR > k. La recuperación en 2,6 años indica riesgo moderado. Se recomienda **ejecutar la inversión**."
estado: publicado
---

## Planteamiento

*Envases del Levante S.A.* fabrica envases de plástico reciclado. La dirección estudia renovar la línea de extrusión principal con una inversión de **50.000 €** al inicio del proyecto (año 0).

La rentabilidad mínima exigida por la empresa es del **10 %** (coste del capital, `k`).

Los flujos de caja netos previstos son:

| Año | Flujo de caja |
| --- | --- |
| 0 (inversión inicial) | −50.000 € |
| 1 | +15.000 € |
| 2 | +20.000 € |
| 3 | +25.000 € |
| 4 | +18.000 € |

Los flujos crecen los tres primeros años gracias al ahorro de costes que genera la nueva maquinaria y decrecen en el cuarto por los gastos de mantenimiento al final de la vida útil.

## Se pide

1. Calcula el **PayBack** (plazo de recuperación) de la inversión. Expresa el resultado en años y meses.

2. Calcula el **VAN** del proyecto con `k = 10 %`. ¿El proyecto crea o destruye valor? Justifica la respuesta.

3. Estima la **TIR** del proyecto probando con tasas del **19 %** y del **20 %**. ¿Es aceptable el proyecto según el criterio de la TIR? ¿Por qué?

4. Integrando los tres criterios, ¿recomendarías ejecutar esta inversión? Razona la respuesta en dos o tres frases.
