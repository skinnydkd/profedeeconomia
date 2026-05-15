---
asignatura: edmn-2bach
unidad_relacionada: 9
title: "Tres inversiones, una sola decisión: VAN, TIR y PayBack"
descripcion: "Comparar tres alternativas de inversión con perfiles de flujos distintos y decidir cuál ejecutar aplicando los tres criterios financieros estándar."
tipo: ejercicio
duracion: "55 min · 1 sesión"
agrupacion: "individual + corrección en parejas"
materiales:
  - "Calculadora financiera o calculadora con potencias"
  - "Plantilla con los flujos de las tres inversiones"
  - "Hoja de cálculo (opcional, para automatizar la actualización de flujos)"
estado: publicado
---

## Planteamiento

*Hortícola del Levante S.L.*, una pyme dedicada al cultivo intensivo de hortalizas, dispone de **120.000 €** y debe elegir UNA de tres inversiones. La rentabilidad mínima exigida (`k`) es **8 %**.

| Año | Inversión A | Inversión B | Inversión C |
| --- | --- | --- | --- |
| 0 | −120.000 € | −120.000 € | −120.000 € |
| 1 | +50.000 € | +20.000 € | +10.000 € |
| 2 | +50.000 € | +30.000 € | +20.000 € |
| 3 | +40.000 € | +50.000 € | +35.000 € |
| 4 | +20.000 € | +60.000 € | +60.000 € |
| 5 | 0 | +50.000 € | +90.000 € |

**Inversión A:** modernizar dos invernaderos existentes. Recuperación rápida pero los rendimientos decrecen al envejecer la modernización.

**Inversión B:** ampliar la superficie cultivada con un nuevo invernadero más grande. Madura más lento pero mantiene rendimientos.

**Inversión C:** entrar en un cultivo nuevo (frutos rojos) con curva de aprendizaje más larga pero potencial alto.

## Objetivos didácticos

- Calcular VAN, TIR y PayBack para tres inversiones con perfiles temporales distintos.
- Comprender por qué los tres criterios pueden dar conclusiones diferentes y cuándo cada uno es más útil.
- Argumentar una decisión final integrando los tres criterios.

## Pasos

1. **Cálculo individual (30 min).** Cada alumno calcula:
   - a) **PayBack** de las tres (años para recuperar la inversión inicial).
   - b) **VAN** de las tres con `k = 8 %`.
   - c) **TIR aproximada** de las tres (por aproximación: probar tasas hasta encontrar la que hace VAN ≈ 0).
2. **Corrección por parejas (10 min).** Comparan resultados y resuelven discrepancias.
3. **Decisión razonada (10 min).** En el cuaderno, cada alumno responde:
   - ¿Cuál tiene mejor PayBack?
   - ¿Cuál tiene mejor VAN?
   - ¿Cuál tiene mejor TIR?
   - ¿Cuál ejecutarías y por qué? Si no coinciden los tres criterios, ¿cuál pesa más en tu decisión?
4. **Puesta en común (5 min).** Encuesta rápida en clase: cuántos eligen A, B, C. Se discuten las razones.

## Solución de referencia

### a) PayBack

- **Inversión A:** año 1: 50.000 / año 2: 100.000 (faltan 20.000) / año 3: se cubre. Falta 20.000 / 40.000 = 0,5 año. **PayBack ≈ 2,5 años**.
- **Inversión B:** año 1: 20.000 / año 2: 50.000 / año 3: 100.000 (faltan 20.000) / año 4: se cubre. Falta 20.000 / 60.000 = 0,33. **PayBack ≈ 3,33 años**.
- **Inversión C:** año 1: 10.000 / año 2: 30.000 / año 3: 65.000 / año 4: 125.000 (se cubre justo). Falta 55.000 / 60.000 = 0,92. **PayBack ≈ 3,92 años**.

### b) VAN con k = 8 %

Factores de descuento: 1/1,08¹ = 0,9259 · 1/1,08² = 0,8573 · 1/1,08³ = 0,7938 · 1/1,08⁴ = 0,7350 · 1/1,08⁵ = 0,6806.

- **VAN_A** = −120.000 + 50.000·0,9259 + 50.000·0,8573 + 40.000·0,7938 + 20.000·0,7350
  = −120.000 + 46.296 + 42.867 + 31.753 + 14.701 = **+15.617 €**
- **VAN_B** = −120.000 + 20.000·0,9259 + 30.000·0,8573 + 50.000·0,7938 + 60.000·0,7350 + 50.000·0,6806
  = −120.000 + 18.519 + 25.720 + 39.692 + 44.101 + 34.029 = **+42.061 €**
- **VAN_C** = −120.000 + 10.000·0,9259 + 20.000·0,8573 + 35.000·0,7938 + 60.000·0,7350 + 90.000·0,6806
  = −120.000 + 9.259 + 17.147 + 27.784 + 44.101 + 61.252 = **+39.543 €**

### c) TIR aproximada

- **TIR_A ≈ 14-15 %** (por aproximación, VAN cero alrededor de esa tasa)
- **TIR_B ≈ 18-19 %**
- **TIR_C ≈ 16-17 %**

### Decisión integrada

| Criterio | Mejor opción |
| --- | --- |
| PayBack (riesgo) | **A** (recupera en 2,5 años) |
| VAN (creación de valor) | **B** (+42.061 €) |
| TIR (rentabilidad relativa) | **B** (≈ 18 %) |

**Conclusión:** la inversión más recomendable es **B**. Tiene la mejor TIR y el mejor VAN. La única ventaja de A es el PayBack más corto, pero el riesgo absoluto se compensa por la mayor robustez de B en años 4-5. C es una buena alternativa pero ligeramente inferior a B en VAN y con PayBack peor.

Ahora bien, **si la empresa estuviera en una situación financiera frágil** y necesitara recuperar capital pronto para otros proyectos, el PayBack pesaría más y A podría ser la elección defensiva.

## Criterios de evaluación

| Criterio | Descripción | Peso |
| --- | --- | --- |
| Cálculo correcto | Las tres respuestas numéricas con tolerancia ± 2 % | 50 % |
| Comprensión de cada criterio | Sabe qué pregunta responde cada uno | 20 % |
| Decisión integrada | El razonamiento final no se basa en un solo criterio | 20 % |
| Contextualización | Considera la situación financiera de la empresa | 10 % |

## Variantes y extensiones

- **Variante con hoja de cálculo:** automatizar el cálculo del VAN con la función `VNA()` y la TIR con `TIR()`. Comparar con el cálculo manual.
- **Variante con sensibilidad:** rehacer el VAN con `k = 12 %` (escenario de tipos altos) y ver cómo cambia la decisión. La inversión con flujos lejanos en el tiempo (B y C) sufren más al subir la tasa de descuento.
- **Conexión con Unidad 11:** calcular el ROA proyectado a 3 años de cada inversión.
