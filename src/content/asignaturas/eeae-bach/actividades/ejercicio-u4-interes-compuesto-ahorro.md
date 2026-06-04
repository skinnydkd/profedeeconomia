---
asignatura: eeae-bach
unidad_relacionada: 4
title: "Ejercicio: interés compuesto y ahorro con aportaciones periódicas"
tipo: ejercicio
descripcion: "Cálculo numérico del capital acumulado cuando se realizan aportaciones anuales constantes durante varios años, con reinversión de los intereses generados en cada periodo. Se trabaja la diferencia entre capital aportado y capital final."
duracion: "25-35 min · individual"
agrupacion: "individual"
competencias_clave: [STEM, CD, CE]
competencias_especificas: [CE2]
solucion:
  - "Datos: aportación anual = 600 €, tipo de interés anual = 4 %, plazo = 5 años. Primer depósito al inicio del año 1."
  - "Paso 1 (año 1): capital al final del año 1 = 600 × (1 + 0,04)^1 = 600 × 1,04 = **624,00 €**"
  - "Paso 2 (año 2): capital = capital anterior + nueva aportación, todo capitalizado 1 año = (624,00 + 600) × 1,04 = 1 224,00 × 1,04 = **1 272,96 €**"
  - "Paso 3 (año 3): (1 272,96 + 600) × 1,04 = 1 872,96 × 1,04 = **1 947,88 €**"
  - "Paso 4 (año 4): (1 947,88 + 600) × 1,04 = 2 547,88 × 1,04 = **2 649,80 €**"
  - "Paso 5 (año 5): (2 649,80 + 600) × 1,04 = 3 249,80 × 1,04 = **3 379,79 €**"
  - "Capital total aportado = 600 × 5 = **3 000,00 €**"
  - "Capital final acumulado = **3 379,79 €**"
  - "Intereses generados = 3 379,79 − 3 000,00 = **379,79 €**"
  - "Conclusión: el efecto del interés compuesto genera 379,79 € adicionales sobre las aportaciones propias. Cuanto más largo sea el plazo, mayor es la diferencia entre lo aportado y lo acumulado."
estado: publicado
---

## Planteamiento

Laura tiene 17 años y acaba de abrir una cuenta de ahorro remunerada en una entidad financiera. Cada 1 de enero depositará **600 €** de los ingresos que obtiene trabajando en verano. La cuenta ofrece un tipo de interés anual del **4 %**, capitalizable anualmente, y los intereses se acumulan automáticamente sin retirarlos.

Laura quiere saber cuánto dinero tendrá exactamente al cabo de 5 años, compararlo con lo que habrá aportado de su propio bolsillo y entender de dónde viene la diferencia.

> Nota: considera que cada aportación se realiza al inicio del año correspondiente, de modo que la aportación del año 1 genera intereses durante 1 año completo, la del año 2 durante 1 año completo desde que se deposita, y así sucesivamente.

## Se pide

1. Construye una **tabla de capitalización año a año** que muestre, para cada año del 1 al 5: el capital acumulado al inicio (después de la nueva aportación) y el capital al final (después de aplicar el interés del 4 %). Desarrolla todos los cálculos.
2. ¿Cuánto dinero habrá acumulado Laura al final del año 5? ¿Cuánto ha aportado en total de su propio bolsillo?
3. Calcula los **intereses totales generados** (diferencia entre el capital final y el total aportado). ¿Qué proporción representan respecto al total aportado? ¿Qué te dice esto sobre la utilidad de empezar a ahorrar pronto?
