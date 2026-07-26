---
asignatura: edmn-2bach
unidad_relacionada: 7
title: "Dos plans de cuina: punt mort i palanquejament operatiu"
descripcion: "Calcular el punt mort d''un restaurant en dos escenaris (cuina manual vs. cuina automatitzada) i discutir les implicacions del palanquejament operatiu."
tipo: ejercicio
duracion: "55 min · 1 sessió"
agrupacion: "individual + posada en comú en grups xicotets"
materiales:
  - "Calculadora"
  - "Full de càlcul (opcional, per a fer un gràfic dels dos plans)"
  - "Plantilla amb la taula de dades del cas"
competencias_clave: [STEM, CD, CPSAA]
competencias_especificas: [CE4]
ebau: true
lang: ca
estado: publicado
slug: "asignaturas/edmn-2bach/actividades/07-punto-muerto-restaurante.ca"
---

## Plantejament

*La Cocinera del Mercado* és un restaurant que obrirà en sis mesos. La seua capacitat màxima diària són **80 menús**. Els promotors dubten entre dos plans industrials per a arrancar:

| Variable | Pla A — Manual | Pla B — Automatitzat |
| --- | --- | --- |
| Inversió inicial | 25.000 € | 70.000 € |
| Cost fix mensual (lloguer, sous, amortització) | 8.000 € | 14.000 € |
| Cost variable per menú (matèria primera, energia) | 6,50 € | 4,20 € |
| Preu mitjà per menú | 15 € | 15 € |

Operen 26 dies al mes. Vos han demanat que calculeu quin pla convé en distints escenaris de demanda.

## Objectius didàctics

- Aplicar la fórmula del punt mort en dos escenaris.
- Calcular el punt d'indiferència entre dos plans amb estructures de cost distintes.
- Interpretar el concepte de palanquejament operatiu i el seu impacte en el risc del negoci.

## Passos

1. **Càlcul individual (20 min).** Cada alumne respon per escrit:
   - a) Punt mort mensual i diari de cada pla.
   - b) Benefici mensual de cada pla si vengueren 1.500 menús/mes (≈ 58 menús/dia).
   - c) Benefici mensual si vengueren 2.080 menús/mes (capacitat màxima al 100 %).
   - d) Punt d'indiferència: a partir de quin volum mensual convé canviar del Pla A al Pla B?
2. **Posada en comú en grup (15 min).** En grups de 4, comparen resultats i resolen discrepàncies. Si tots coincidixen en xifres però discrepen en la decisió final, identifiquen quins supòsits canvien.
3. **Discussió guiada (15 min).** El professor pregunta:
   - Quin és el risc principal del Pla B?
   - Si la previsió més realista és 1.300 menús/mes, quin pla és més prudent?
   - Quines implicacions té el palanquejament operatiu en una crisi econòmica que reduïsca la demanda un 30 %?
4. **Tancament (5 min).** Cada alumne escriu en el seu quadern: *si fora el meu diner, triaria el pla ___ perquè ___ .* (un paràgraf).

## Solució (per a la correcció)

a) **Punt mort mensual i diari:**
- Pla A: Q* = 8.000 / (15 − 6,50) = **942 menús/mes ≈ 36 menús/dia**
- Pla B: Q* = 14.000 / (15 − 4,20) = **1.296 menús/mes ≈ 50 menús/dia**

b) **Benefici amb 1.500 menús/mes:**
- Pla A: (15 − 6,50) × 1.500 − 8.000 = 12.750 − 8.000 = **+4.750 €/mes**
- Pla B: (15 − 4,20) × 1.500 − 14.000 = 16.200 − 14.000 = **+2.200 €/mes**
- A 1.500 menús, **el Pla A és més rendible** (+2.550 € de diferència).

c) **Benefici al 100 % de capacitat (2.080 menús/mes):**
- Pla A: 8,50 × 2.080 − 8.000 = 17.680 − 8.000 = **+9.680 €/mes**
- Pla B: 10,80 × 2.080 − 14.000 = 22.464 − 14.000 = **+8.464 €/mes**
- Sorprenentment, fins i tot a capacitat màxima el Pla A continua guanyant (+1.216 €), perquè els CF addicionals del Pla B són tan alts que el major marge unitari no arriba a compensar-los en este rang. Això és excepcional: requerix recalcular el punt d'indiferència.

d) **Punt d'indiferència:** 8,50·Q − 8.000 = 10,80·Q − 14.000 → 6.000 = 2,30·Q → Q ≈ **2.609 menús/mes**.
- Però la capacitat màxima és 2.080 menús/mes < 2.609.
- **Conclusió clau:** dins del rang operatiu del restaurant, **el Pla A sempre és més rendible**. El Pla B només tindria sentit si planejaren ampliar capacitat o pujar preus.

## Discussió final

L'exercici ensenya dues lliçons contraintuïtives:

> 1. Més automatització no equival a més rendibilitat. Cal confrontar sempre amb el volum previsible.
> 2. El palanquejament operatiu amplifica beneficis i pèrdues. El Pla B podria ser desastrós si la demanda real fora de 1.000 menús/mes (pèrdua de 3.200 €/mes) mentres que el Pla A encara seria rendible a eixe nivell (+500 €/mes).

## Criteris d'avaluació

| Criteri | Descripció | Pes |
| --- | --- | --- |
| Càlcul correcte | Les quatre respostes numèriques sense errors | 50 % |
| Interpretació | Identifica que el Pla A guanya en tot el rang operatiu i per què | 25 % |
| Anàlisi del risc | Comprén el paper del palanquejament operatiu en escenaris de caiguda de demanda | 15 % |
| Decisió personal argumentada | El tancament escrit està ben raonat | 10 % |

## Variants i extensions

- **Variant amb full de càlcul:** dibuixar les corbes de cost i ingressos dels dos plans en un mateix gràfic i marcar el punt mort de cada u i el punt d'indiferència.
- **Connexió amb la Unitat 9:** calcular el VAN de cada pla a 5 anys amb fluxos previstos, comparant rendibilitat financera, no sols operativa.
