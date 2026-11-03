---
asignatura: eco-1bach
unidad_relacionada: 7
title: "Construye tu índice de bienestar y ordena las comunidades autónomas"
descripcion: "Investigación con los indicadores de calidad de vida del INE: elegir cuatro dimensiones, normalizarlas, ponderarlas y publicar un ranking propio de comunidades autónomas, para descubrir de primera mano cuánto depende un índice compuesto de quien lo construye."
tipo: investigacion
duracion: "55 min · 1 sesión en el aula de informática"
agrupacion: "grupos pequeños (3-4)"
competencias_clave: [CD, STEM, CC, CPSAA]
competencias_especificas: [CE4]
materiales:
  - "Un ordenador por grupo con acceso a ine.es (Indicadores de Calidad de Vida)"
  - "Hoja de cálculo"
  - "Ficha de diseño del índice impresa"
estado: publicado
---

## Planteamiento

Todo el mundo repite que el PIB no mide el bienestar. Menos gente se pregunta qué mediría mejor, y casi nadie ha intentado construirlo. Eso es lo que vais a hacer hoy.

Vuestro grupo va a diseñar un **índice de bienestar propio** y a usarlo para ordenar las comunidades autónomas españolas. Al final compararéis vuestro ranking con el del PIB per cápita y, sobre todo, con el de los demás grupos de la clase. El resultado de esa comparación es la lección de la sesión: los índices compuestos **no son neutrales**, y quien elige las dimensiones y los pesos está decidiendo el resultado mucho antes de ver un solo dato.

## Dónde están los datos

El INE publica los **Indicadores de Calidad de Vida**, organizados en nueve dimensiones, con desglose por comunidad autónoma: condiciones materiales, trabajo, salud, educación, ocio y relaciones sociales, seguridad, gobernanza, entorno y experiencia general de la vida. Es vuestra cantera.

## Objetivos didácticos

- Seleccionar indicadores pertinentes y justificar la elección.
- Normalizar variables con unidades distintas para poder combinarlas.
- Construir un indicador compuesto ponderado y explicar el efecto de los pesos.
- Valorar críticamente la subjetividad inherente a cualquier índice sintético.

## El método, paso a paso

Para cada indicador, se normaliza a una escala de 0 a 100 con la fórmula del mínimo-máximo:

```
                    valor − mínimo
    normalizado = ───────────────────── × 100
                   máximo − mínimo
```

Si el indicador es **mejor cuanto más bajo** (paro, pobreza, criminalidad), se resta el resultado de 100 para darle la vuelta. Después, el índice final es la media ponderada de los cuatro indicadores normalizados.

## Pasos (sesión de 55 min)

1. **Diseño (10 min).** Elegid **cuatro indicadores** de cuatro dimensiones distintas y asignad a cada uno un peso, que deben sumar 100 %. Escribid una línea justificando cada elección **antes** de ver los datos.
2. **Recogida (15 min).** Volcad en la hoja de cálculo el valor de cada indicador para las 17 comunidades autónomas. Anotad el año.
3. **Normalización (10 min).** Aplicad la fórmula. Recordad invertir los indicadores en los que menos es mejor.
4. **Ranking (10 min).** Calculad el índice ponderado y ordenad las comunidades de 1 a 17.
5. **Contraste (10 min).** Poned al lado el ranking por PIB per cápita. ¿Qué comunidad sube más al cambiar de vara de medir? ¿Cuál baja más? Después, comparad con el ranking de otro grupo de la clase.

## Ficha de diseño del índice

```
Grupo: ______________________   Fecha de consulta: ___/___/______

Indicador 1: ________________________  Dimensión: ____________
   Peso: ____ %   ¿Más es mejor? SÍ / NO   Justificación: ______
Indicador 2: ________________________  Dimensión: ____________
   Peso: ____ %   ¿Más es mejor? SÍ / NO   Justificación: ______
Indicador 3: ________________________  Dimensión: ____________
   Peso: ____ %   ¿Más es mejor? SÍ / NO   Justificación: ______
Indicador 4: ________________________  Dimensión: ____________
   Peso: ____ %   ¿Más es mejor? SÍ / NO   Justificación: ______

                                          TOTAL: 100 %

Primera del ranking: ____________  Última: ____________
La que más sube respecto al PIB per cápita: ____________
La que más baja: ____________
```

## Preguntas de análisis

- ¿Qué comunidad cambia más de posición al pasar del PIB per cápita a vuestro índice? ¿Qué indicador concreto provoca ese salto?
- Cambiad mentalmente los pesos: dad un 70 % a un solo indicador. ¿Se mueve mucho el ranking? Si se mueve mucho, ¿qué dice eso sobre la solidez de vuestro índice?
- Comparad vuestro ranking con el de otro grupo. ¿Dónde está la discrepancia: en los indicadores elegidos o en los pesos?
- ¿Qué dimensión del bienestar os ha resultado **imposible de medir** con los datos disponibles? Que no haya dato, ¿significa que no importa?
- Los índices internacionales famosos (IDH, Better Life Index) hacen exactamente esto que habéis hecho vosotros. ¿Os fiais más o menos de ellos ahora que habéis construido uno?

## Criterios de evaluación

| Criterio | Descripción | Peso |
| --- | --- | --- |
| Diseño del índice | Cuatro dimensiones distintas, pesos justificados antes de ver datos | 25 % |
| Método | Normalización correcta, incluida la inversión donde toca | 30 % |
| Ranking | Cálculo correcto y contraste con el PIB per cápita | 25 % |
| Crítica | Reconoce la sensibilidad a los pesos y los límites de los datos | 20 % |

## Variantes y extensiones

- **Con apoyo:** dar los cuatro indicadores ya elegidos y los datos volcados; trabajar solo normalización, ranking y contraste.
- **Para quien va sobrado:** hacer un análisis de sensibilidad en condiciones: recalcular el ranking con tres juegos de pesos distintos y presentar el rango de posiciones de cada comunidad en lugar de una posición única. Es lo que hacen los índices serios.
- **Versión europea:** repetir con países de la UE usando Eurostat.
- **Conexión con la Unidad 12:** guardad el índice. Cuando lleguéis a los retos contemporáneos, la desigualdad territorial vuelve a aparecer y tendréis vuestro propio dato para discutirla.
