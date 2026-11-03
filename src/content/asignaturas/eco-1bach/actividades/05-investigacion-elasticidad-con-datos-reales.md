---
asignatura: eco-1bach
unidad_relacionada: 5
title: "Medir una elasticidad de verdad: precio y consumo en los datos oficiales"
descripcion: "Investigación con series del INE y de organismos oficiales para estimar la elasticidad-precio de un producto real a partir de su variación de precio y de consumo, y descubrir por qué el número que sale nunca es tan limpio como el del libro."
tipo: investigacion
duracion: "55 min · 1 sesión en el aula de informática"
agrupacion: "parejas"
competencias_clave: [STEM, CD, CPSAA, CCL]
competencias_especificas: [CE3]
materiales:
  - "Un ordenador o tableta por pareja con acceso a ine.es"
  - "Calculadora o hoja de cálculo"
  - "Ficha de recogida impresa"
estado: publicado
---

## Planteamiento

En el libro las elasticidades salen redondas porque los datos están puestos a propósito. Fuera del libro hay que ir a buscarlos, y ahí empieza lo interesante: el precio y la cantidad se mueven a la vez por **muchas razones al mismo tiempo**, y separar la parte que corresponde al precio es el trabajo de verdad de un economista.

Hoy vais a estimar una elasticidad con datos oficiales y, sobre todo, a entender por qué vuestro número hay que leerlo con pinzas.

## Productos disponibles

Cada pareja elige uno. Están ordenados de más fácil a más difícil de defender:

| Producto | Dónde están los datos | Por qué es interesante |
| --- | --- | --- |
| Carburantes | Precios: Ministerio para la Transición Ecológica. Consumo: CORES | Demanda muy rígida a corto plazo |
| Tabaco | Precios: IPC del INE. Consumo: Comisionado para el Mercado de Tabacos | Impuestos altos y efecto sustitución hacia el contrabando |
| Electricidad doméstica | Precios e índices: INE, CNMC. Consumo: Red Eléctrica | El shock de 2021-2022 es un experimento natural |
| Transporte público | Tarifas y viajeros: INE, estadística de transporte de viajeros | Las bonificaciones estatales de 2022-2023 movieron mucho el precio |

## Objetivos didácticos

- Localizar dos series oficiales compatibles en el tiempo y citarlas correctamente.
- Calcular una elasticidad-precio por el método del arco y clasificar el resultado.
- Reconocer la diferencia entre correlación y relación causal en datos reales.
- Identificar al menos dos factores distintos del precio que hayan podido mover el consumo.

## La fórmula que vais a usar

Elasticidad por el método del arco, que evita que el resultado dependa de cuál de los dos años se tome como base:

```
             (Q2 − Q1) / [(Q1 + Q2)/2]
    Ep  =   ───────────────────────────
             (P2 − P1) / [(P1 + P2)/2]
```

El signo saldrá normalmente negativo. Lo que se clasifica es su **valor absoluto**: por encima de 1, elástica; por debajo, rígida.

## Pasos (sesión de 55 min)

1. **Elección y apuesta (5 min).** Elegid producto y escribid, antes de mirar nada, si esperáis una demanda elástica o rígida y por qué.
2. **Búsqueda de series (20 min).** Localizad precio y cantidad para **dos años** separados por un cambio de precio importante. Anotad organismo, nombre exacto de la serie y unidades. Cuidado con mezclar precios corrientes y precios constantes.
3. **Cálculo (10 min).** Aplicad la fórmula del arco. Clasificad el resultado.
4. **La parte difícil (15 min).** Listad **al menos tres cosas distintas del precio** que cambiaron entre esos dos años y que también pudieron mover el consumo: la renta, el tiempo meteorológico, una pandemia, una moda, un cambio de ley. Para cada una, decid en qué dirección empujó.
5. **Veredicto (5 min).** Con todo eso delante, escribid una frase honesta: qué podéis afirmar y qué no con vuestro dato.

## Ficha de recogida

```
Producto: ______________________   Fecha de consulta: ___/___/______

Año 1: ______   P1: __________   Q1: __________
Año 2: ______   P2: __________   Q2: __________
Fuente del precio:   ______________________________________
Fuente de la cantidad: ____________________________________

Elasticidad (arco): __________     Clasificación: ____________

Tres factores distintos del precio que también cambiaron:
  1. ______________________________  empujó el consumo hacia ____
  2. ______________________________  empujó el consumo hacia ____
  3. ______________________________  empujó el consumo hacia ____

Frase honesta: ____________________________________________
```

## Preguntas de análisis

- ¿Vuestro resultado es elástico o rígido? ¿Coincide con la apuesta que hicisteis al empezar?
- ¿Qué factor de vuestra lista os parece que **más contamina** el cálculo? ¿Cómo lo aislaríais si tuvierais todos los datos del mundo?
- Repetid mentalmente el ejercicio con **diez años** de diferencia en lugar de dos. ¿La elasticidad saldría mayor o menor? ¿Por qué el plazo cambia la respuesta?
- Un gobierno quiere subir un impuesto y espera recaudar más. ¿Qué tendría que valer la elasticidad para que le salga bien la jugada? ¿Y para que le salga mal?

## Criterios de evaluación

| Criterio | Descripción | Peso |
| --- | --- | --- |
| Rigor de la fuente | Series oficiales compatibles, citadas con organismo y unidades | 30 % |
| Cálculo | Fórmula del arco bien aplicada y resultado bien clasificado | 25 % |
| Honestidad analítica | Identifica factores de confusión y matiza la conclusión | 30 % |
| Comunicación | Ficha completa y frase final precisa | 15 % |

## Variantes y extensiones

- **Con apoyo:** dar las cuatro cifras ya localizadas y trabajar solo el cálculo y el paso 4.
- **Para quien va sobrado:** calcular también la **elasticidad-renta** con la serie de renta disponible de los hogares y clasificar el bien como normal, de lujo o inferior.
- **Puesta en común de clase:** ordenar en la pizarra todos los productos investigados de más rígido a más elástico y buscar qué tienen en común los de cada extremo.
- **Conexión con la Unidad 11:** guardad el dato. Cuando estudiéis la política fiscal, la elasticidad decide quién acaba pagando de verdad cada impuesto.
