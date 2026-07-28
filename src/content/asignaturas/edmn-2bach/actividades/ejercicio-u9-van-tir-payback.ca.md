---
asignatura: edmn-2bach
unidad_relacionada: 9
title: "Renovar la línia de producció: VAN, TIR i PayBack d'un projecte d'inversió"
tipo: ejercicio
descripcion: "Avaluar la viabilitat d'un projecte de renovació de maquinària calculant el PayBack, el VAN i la TIR, i interpretant conjuntament els tres criteris."
duracion: "25-35 min · individual"
agrupacion: "individual"
competencias_clave: [STEM, CD, CE]
competencias_especificas: [CE4]
ebau: true
solucion:
  - "1. PayBack: any 1 → acumulat 15.000 €; any 2 → 35.000 €; any 3 → 60.000 € (se supera la inversió de 50.000 €). Fracció de l'any 3: (50.000 − 35.000) / 25.000 = 0,6. **PayBack = 2 anys i 7 mesos (≈ 2,6 anys)**."
  - "2. Factors de descompte (k = 10 %): 1/1,10¹ = 0,9091; 1/1,10² = 0,8264; 1/1,10³ = 0,7513; 1/1,10⁴ = 0,6830."
  - "   VA₁ = 15.000 × 0,9091 = 13.636 €"
  - "   VA₂ = 20.000 × 0,8264 = 16.529 €"
  - "   VA₃ = 25.000 × 0,7513 = 18.783 €"
  - "   VA₄ = 18.000 × 0,6830 = 12.294 €"
  - "   **VAN = −50.000 + 13.636 + 16.529 + 18.783 + 12.294 = +11.242 €**. El projecte crea valor."
  - "3a. Prova r = 20 %: factors 0,8333 / 0,6944 / 0,5787 / 0,4823. VAN(20 %) = −50.000 + 12.500 + 13.889 + 14.468 + 8.681 = **−462 €** (≈ 0)."
  - "3b. Prova r = 19 %: factors 0,8403 / 0,7062 / 0,5934 / 0,4987. VAN(19 %) = −50.000 + 12.605 + 14.124 + 14.835 + 8.977 = **+541 €** (≈ 0)."
  - "   **TIR ≈ 19–20 %** (entre els dos valors que fan VAN ≈ 0). Com que TIR > k (10 %), el projecte és **acceptable**."
  - "4. El projecte és viable: VAN > 0, TIR > k. La recuperació en 2,6 anys indica un risc moderat. Es recomana **executar la inversió**."
lang: ca
estado: publicado
slug: "asignaturas/edmn-2bach/actividades/ejercicio-u9-van-tir-payback.ca"
---

## Plantejament

*Envases del Levante S.A.* fabrica envasos de plàstic reciclat. La direcció estudia renovar la línia d'extrusió principal amb una inversió de **50.000 €** a l'inici del projecte (any 0).

La rendibilitat mínima exigida per l'empresa és del **10 %** (cost del capital, `k`).

Els fluxos de caixa nets previstos són:

| Any | Flux de caixa |
| --- | --- |
| 0 (inversió inicial) | −50.000 € |
| 1 | +15.000 € |
| 2 | +20.000 € |
| 3 | +25.000 € |
| 4 | +18.000 € |

Els fluxos creixen els tres primers anys gràcies a l'estalvi de costos que genera la nova maquinària i decreixen en el quart pels costos de manteniment al final de la vida útil.

## Es demana

1. Calcula el **PayBack** (termini de recuperació) de la inversió. Expressa el resultat en anys i mesos.

2. Calcula el **VAN** del projecte amb `k = 10 %`. El projecte crea o destruïx valor? Justifica la resposta.

3. Estima la **TIR** del projecte provant amb taxes del **19 %** i del **20 %**. És acceptable el projecte segons el criteri de la TIR? Per què?

4. Integrant els tres criteris, recomanaries executar esta inversió? Raona la resposta en dues o tres frases.
