---
asignatura: edmn-2bach
unidad_relacionada: 9
title: "Tres inversions, una sola decisió: VAN, TIR i PayBack"
descripcion: "Comparar tres alternatives d'inversió amb perfils de fluxos distints i decidir quina executar aplicant els tres criteris financers estàndard."
tipo: ejercicio
duracion: "55 min · 1 sessió"
agrupacion: "individual + correcció en parelles"
materiales:
  - "Calculadora financera o calculadora amb potències"
  - "Plantilla amb els fluxos de les tres inversions"
  - "Full de càlcul (opcional, per a automatitzar l'actualització de fluxos)"
competencias_clave: [STEM, CD, CPSAA]
competencias_especificas: [CE4]
ebau: true
lang: ca
estado: publicado
slug: "asignaturas/edmn-2bach/actividades/09-tres-inversiones-van-tir.ca"
---

## Plantejament

*Hortícola del Levante S.L.*, una pime dedicada al cultiu intensiu d'hortalisses, disposa de **120.000 €** i ha de triar UNA de tres inversions. La rendibilitat mínima exigida (`k`) és el **8 %**.

| Any | Inversió A | Inversió B | Inversió C |
| --- | --- | --- | --- |
| 0 | −120.000 € | −120.000 € | −120.000 € |
| 1 | +50.000 € | +20.000 € | +10.000 € |
| 2 | +50.000 € | +30.000 € | +20.000 € |
| 3 | +40.000 € | +50.000 € | +35.000 € |
| 4 | +20.000 € | +60.000 € | +60.000 € |
| 5 | 0 | +50.000 € | +90.000 € |

**Inversió A:** modernitzar dos hivernacles existents. Recuperació ràpida però els rendiments decreixen en envellir la modernització.

**Inversió B:** ampliar la superfície cultivada amb un nou hivernacle més gran. Madura més lent però manté els rendiments.

**Inversió C:** entrar en un cultiu nou (fruits rojos) amb corba d'aprenentatge més llarga però potencial alt.

## Objectius didàctics

- Calcular VAN, TIR i PayBack per a tres inversions amb perfils temporals distints.
- Comprendre per què els tres criteris poden donar conclusions diferents i quan cada u és més útil.
- Argumentar una decisió final integrant els tres criteris.

## Passos

1. **Càlcul individual (30 min).** Cada alumne calcula:
   - a) **PayBack** de les tres (anys per a recuperar la inversió inicial).
   - b) **VAN** de les tres amb `k = 8 %`.
   - c) **TIR aproximada** de les tres (per aproximació: provar taxes fins a trobar la que fa VAN ≈ 0).
2. **Correcció per parelles (10 min).** Comparen resultats i resolen discrepàncies.
3. **Decisió raonada (10 min).** Al quadern, cada alumne respon:
   - Quina té millor PayBack?
   - Quina té millor VAN?
   - Quina té millor TIR?
   - Quina executaries i per què? Si no coincidixen els tres criteris, quin pesa més en la teua decisió?
4. **Posada en comú (5 min).** Enquesta ràpida a classe: quants trien A, B, C. Es discutixen les raons.

## Solució de referència

### a) PayBack

- **Inversió A:** any 1: 50.000 / any 2: 100.000 (falten 20.000) / any 3: es cobrix. Falta 20.000 / 40.000 = 0,5 any. **PayBack ≈ 2,5 anys**.
- **Inversió B:** any 1: 20.000 / any 2: 50.000 / any 3: 100.000 (falten 20.000) / any 4: es cobrix. Falta 20.000 / 60.000 = 0,33. **PayBack ≈ 3,33 anys**.
- **Inversió C:** any 1: 10.000 / any 2: 30.000 / any 3: 65.000 / any 4: 125.000 (es cobrix just). Falta 55.000 / 60.000 = 0,92. **PayBack ≈ 3,92 anys**.

### b) VAN amb k = 8 %

Factors de descompte: 1/1,08¹ = 0,9259 · 1/1,08² = 0,8573 · 1/1,08³ = 0,7938 · 1/1,08⁴ = 0,7350 · 1/1,08⁵ = 0,6806.

- **VAN_A** = −120.000 + 50.000·0,9259 + 50.000·0,8573 + 40.000·0,7938 + 20.000·0,7350
  = −120.000 + 46.296 + 42.867 + 31.753 + 14.701 = **+15.617 €**
- **VAN_B** = −120.000 + 20.000·0,9259 + 30.000·0,8573 + 50.000·0,7938 + 60.000·0,7350 + 50.000·0,6806
  = −120.000 + 18.519 + 25.720 + 39.692 + 44.101 + 34.029 = **+42.061 €**
- **VAN_C** = −120.000 + 10.000·0,9259 + 20.000·0,8573 + 35.000·0,7938 + 60.000·0,7350 + 90.000·0,6806
  = −120.000 + 9.259 + 17.147 + 27.784 + 44.101 + 61.252 = **+39.543 €**

### c) TIR aproximada

- **TIR_A ≈ 14-15 %** (per aproximació, VAN zero al voltant d'eixa taxa)
- **TIR_B ≈ 18-19 %**
- **TIR_C ≈ 16-17 %**

### Decisió integrada

| Criteri | Millor opció |
| --- | --- |
| PayBack (risc) | **A** (recupera en 2,5 anys) |
| VAN (creació de valor) | **B** (+42.061 €) |
| TIR (rendibilitat relativa) | **B** (≈ 18 %) |

**Conclusió:** la inversió més recomanable és **B**. Té la millor TIR i el millor VAN. L'única avantatge d'A és el PayBack més curt, però el risc absolut es compensa per la major robustesa de B en els anys 4-5. C és una bona alternativa però lleugerament inferior a B en VAN i amb PayBack pitjor.

Ara bé, **si l'empresa estiguera en una situació financera fràgil** i necessitara recuperar capital prompte per a altres projectes, el PayBack pesaria més i A podria ser l'elecció defensiva.

## Criteris d'avaluació

| Criteri | Descripció | Pes |
| --- | --- | --- |
| Càlcul correcte | Les tres respostes numèriques amb tolerància ± 2 % | 50 % |
| Comprensió de cada criteri | Sap quina pregunta respon cada u | 20 % |
| Decisió integrada | El raonament final no es basa en un sol criteri | 20 % |
| Contextualització | Considera la situació financera de l'empresa | 10 % |

## Variants i extensions

- **Variant amb full de càlcul:** automatitzar el càlcul del VAN amb la funció `VNA()` i la TIR amb `TIR()`. Comparar amb el càlcul manual.
- **Variant amb sensibilitat:** refer el VAN amb `k = 12 %` (escenari de tipus alts) i veure com canvia la decisió. Les inversions amb fluxos llunyans en el temps (B i C) patixen més en pujar la taxa de descompte.
- **Connexió amb la Unitat 11:** calcular el ROA projectat a 3 anys de cada inversió.
