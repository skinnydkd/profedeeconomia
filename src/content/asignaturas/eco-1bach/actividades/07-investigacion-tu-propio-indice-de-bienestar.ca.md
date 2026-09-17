---
asignatura: eco-1bach
unidad_relacionada: 7
title: "Construïx el teu índex de benestar i ordena les comunitats autònomes"
descripcion: "Investigació amb els indicadors de qualitat de vida de l'INE: triar quatre dimensions, normalitzar-les, ponderar-les i publicar un rànquing propi de comunitats autònomes, per a descobrir de primera mà quant depén un índex compost de qui el construïx."
tipo: investigacion
duracion: "55 min · 1 sessió a l'aula d'informàtica"
agrupacion: "grups xicotets (3-4)"
competencias_clave: [CD, STEM, CC, CPSAA]
competencias_especificas: [CE4]
materiales:
  - "Un ordinador per grup amb accés a ine.es (Indicadors de Qualitat de Vida)"
  - "Full de càlcul"
  - "Fitxa de disseny de l'índex impresa"
lang: ca
estado: publicado
slug: "asignaturas/eco-1bach/actividades/07-investigacion-tu-propio-indice-de-bienestar.ca"
---

## Plantejament

Tot el món repetix que el PIB no mesura el benestar. Menys gent es pregunta què ho mesuraria millor, i quasi ningú ha intentat construir-ho. Això és el que fareu hui.

El vostre grup dissenyarà un **índex de benestar propi** i l'usarà per a ordenar les comunitats autònomes espanyoles. Al final compareu el vostre rànquing amb el del PIB per capita i, sobretot, amb el dels altres grups de la classe. El resultat d'eixa comparació és la lliçó de la sessió: els índexs compostos **no són neutrals**, i qui tria les dimensions i els pesos està decidint el resultat molt abans de vore una sola dada.

## On són les dades

L'INE publica els **Indicadors de Qualitat de Vida**, organitzats en nou dimensions, amb desglossament per comunitat autònoma: condicions materials, treball, salut, educació, oci i relacions socials, seguretat, governança, entorn i experiència general de la vida. És la vostra pedrera.

## Objectius didàctics

- Seleccionar indicadors pertinents i justificar-ne l'elecció.
- Normalitzar variables amb unitats distintes per a poder combinar-les.
- Construir un indicador compost ponderat i explicar l'efecte dels pesos.
- Valorar críticament la subjectivitat inherent a qualsevol índex sintètic.

## El mètode, pas a pas

Per a cada indicador, es normalitza a una escala de 0 a 100 amb la fórmula del mínim-màxim:

```
                    valor − mínim
    normalitzat = ───────────────────── × 100
                   màxim − mínim
```

Si l'indicador és **millor com més baix** (atur, pobresa, criminalitat), es resta el resultat de 100 per a girar-lo. Després, l'índex final és la mitjana ponderada dels quatre indicadors normalitzats.

## Passos (sessió de 55 min)

1. **Disseny (10 min).** Trieu **quatre indicadors** de quatre dimensions distintes i assigneu a cada un un pes, que han de sumar 100 %. Escriviu una línia justificant cada elecció **abans** de vore les dades.
2. **Recollida (15 min).** Bolqueu al full de càlcul el valor de cada indicador per a les 17 comunitats autònomes. Anoteu l'any.
3. **Normalització (10 min).** Apliqueu la fórmula. Recordeu invertir els indicadors en els quals menys és millor.
4. **Rànquing (10 min).** Calculeu l'índex ponderat i ordeneu les comunitats de l'1 al 17.
5. **Contrast (10 min).** Poseu al costat el rànquing per PIB per capita. Quina comunitat puja més en canviar de vara de mesurar? Quina baixa més? Després, compareu amb el rànquing d'un altre grup de la classe.

## Fitxa de disseny de l'índex

```
Grup: ______________________   Data de consulta: ___/___/______

Indicador 1: ________________________  Dimensió: ____________
   Pes: ____ %   Més és millor? SÍ / NO   Justificació: ______
Indicador 2: ________________________  Dimensió: ____________
   Pes: ____ %   Més és millor? SÍ / NO   Justificació: ______
Indicador 3: ________________________  Dimensió: ____________
   Pes: ____ %   Més és millor? SÍ / NO   Justificació: ______
Indicador 4: ________________________  Dimensió: ____________
   Pes: ____ %   Més és millor? SÍ / NO   Justificació: ______

                                          TOTAL: 100 %

Primera del rànquing: ____________  Última: ____________
La que més puja respecte al PIB per capita: ____________
La que més baixa: ____________
```

## Preguntes d'anàlisi

- Quina comunitat canvia més de posició en passar del PIB per capita al vostre índex? Quin indicador concret provoca eixe salt?
- Canvieu mentalment els pesos: doneu un 70 % a un sol indicador. Es mou molt el rànquing? Si es mou molt, què diu això sobre la solidesa del vostre índex?
- Compareu el vostre rànquing amb el d'un altre grup. On està la discrepància: en els indicadors triats o en els pesos?
- Quina dimensió del benestar vos ha resultat **impossible de mesurar** amb les dades disponibles? Que no hi haja dada, significa que no importa?
- Els índexs internacionals famosos (IDH, Better Life Index) fan exactament això que heu fet vosaltres. Vos en fieu més o menys ara que n'heu construït un?

## Criteris d'avaluació

| Criteri | Descripció | Pes |
| --- | --- | --- |
| Disseny de l'índex | Quatre dimensions distintes, pesos justificats abans de vore dades | 25 % |
| Mètode | Normalització correcta, inclosa la inversió on toca | 30 % |
| Rànquing | Càlcul correcte i contrast amb el PIB per capita | 25 % |
| Crítica | Reconeix la sensibilitat als pesos i els límits de les dades | 20 % |

## Variants i extensions

- **Amb suport:** donar els quatre indicadors ja triats i les dades bolcades; treballar només normalització, rànquing i contrast.
- **Per a qui va sobrat:** fer una anàlisi de sensibilitat en condicions: recalcular el rànquing amb tres jocs de pesos distints i presentar el rang de posicions de cada comunitat en compte d'una posició única. És el que fan els índexs seriosos.
- **Versió europea:** repetir amb països de la UE usant Eurostat.
- **Connexió amb la Unitat 12:** guardeu l'índex. Quan arribeu als reptes contemporanis, la desigualtat territorial torna a aparéixer i tindreu la vostra pròpia dada per a discutir-la.
