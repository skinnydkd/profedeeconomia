---
asignatura: ipe2-fp
unidad_relacionada: 9
title: "Ejercicio: punto muerto y viabilidad de un proyecto emprendedor"
tipo: ejercicio
descripcion: "Cálculo numérico del punto muerto (Q*), el margen de contribución unitario y el diagnóstico de viabilidad de un proyecto de FP a partir de una estructura de costes real. Incluye análisis del resultado con dos escenarios de demanda."
duracion: "25-35 min · individual"
agrupacion: "individual"
competencias_clave: [STEM, CD, CE]
competencias_especificas: [RA5]
solucion:
  - "Paso 1: margen de contribución unitario (MCu) = precio − coste variable unitario = 25 − 9 = **16 € por unidad**"
  - "Paso 2: punto muerto Q* = costes fijos / MCu = 3 200 / 16 = **200 unidades al mes**"
  - "Paso 3: comprobación — ingresos a Q* = 200 × 25 = 5 000 €; costes totales = 3 200 + 200 × 9 = 3 200 + 1 800 = 5 000 €. Resultado = 0 €. **Verificado.**"
  - "Paso 4 (escenario A — 180 unidades): resultado = 180 × 16 − 3 200 = 2 880 − 3 200 = **−320 € (pérdida)**. El proyecto no alcanza el umbral: faltan 20 unidades."
  - "Paso 5 (escenario B — 240 unidades): resultado = 240 × 16 − 3 200 = 3 840 − 3 200 = **+640 € (beneficio)**. El proyecto supera el umbral en 40 unidades."
  - "Conclusión: el proyecto es viable si se consiguen vender al menos 200 unidades al mes. Con 180 unidades genera pérdidas de 320 €/mes; con 240 unidades genera un beneficio de 640 €/mes. El equipo debe evaluar si la demanda validada durante el test de venta (U7) apoya un volumen de 200 o más unidades."
estado: publicado
---

## Planteamiento

El equipo **CycloFix** ha desarrollado durante el módulo un servicio de reparación y mantenimiento de bicicletas a domicilio en su ciudad. Tras el test de venta de la Unidad 7 y el análisis del entorno de la Unidad 6, han cerrado la siguiente estructura de costes para el primer mes de actividad real:

**Costes fijos mensuales:**

| Concepto | Importe |
| --- | --- |
| Cuota de autónomo (tarifa plana) | 1 200 € |
| Seguro de responsabilidad civil | 80 € |
| Alquiler de taller compartido | 350 € |
| Amortización de herramientas y furgoneta | 570 € |
| Web, dominio y publicidad online | 200 € |
| Teléfono y datos | 50 € |
| Contabilidad (gestoría) | 750 € |
| **Total costes fijos** | **3 200 €** |

**Costes variables por servicio:**

- Recambios y materiales consumibles: 7 €
- Combustible desplazamiento: 2 €
- **Total coste variable unitario: 9 €**

**Precio de venta por servicio completo:** 25 €

El equipo maneja dos escenarios de demanda para el primer mes: **Escenario A** — 180 servicios; **Escenario B** — 240 servicios.

## Se pide

1. Calcula el **margen de contribución unitario** (MCu). Explica qué representa: ¿para qué sirve cada euro de margen de contribución?
2. Calcula el **punto muerto Q*** (umbral de rentabilidad) en número de servicios al mes. Muestra la fórmula y el cálculo completo. Verifica el resultado comprobando que ingresos y costes totales se igualan.
3. Analiza los dos escenarios de demanda: calcula el **resultado económico** (beneficio o pérdida) para cada uno e indica cuántos servicios separan cada escenario del punto muerto. ¿Cuál de los dos escenarios hace viable el proyecto? ¿Qué debería hacer el equipo si la demanda real se sitúa en el Escenario A?
