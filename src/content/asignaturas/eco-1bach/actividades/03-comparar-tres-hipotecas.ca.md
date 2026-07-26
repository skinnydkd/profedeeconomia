---
asignatura: eco-1bach
unidad_relacionada: 3
title: "Comparar tres hipoteques i triar la millor"
descripcion: "Analitzar tres ofertes hipotecàries realistes (fixa, variable i mixta) sobre un mateix pis, calcular quota, cost total i impacte de l'Euríbor, i defendre una elecció raonada davant de la classe."
tipo: caso
duracion: "90 min · 2 sessions de 45 min"
agrupacion: "parelles"
materiales:
  - "Fitxa amb els tres escenaris hipotecaris i les dades de la parella compradora"
  - "Calculadora científica o calculadora d'hipoteques del Banc d'Espanya (bde.es)"
  - "Full de càlcul opcional (LibreOffice Calc, Google Sheets, Excel)"
  - "Accés a l'històric de l'Euríbor a 12 mesos (bde.es, Indicadors Estadístics)"
competencias_clave: [STEM, CD, CPSAA, CCL]
competencias_especificas: [CE2]
lang: ca
estado: publicado
slug: "asignaturas/eco-1bach/actividades/03-comparar-tres-hipotecas.ca"
---

## Plantejament

Una parella jove —ella, infermera, 1.700 € nets/mes; ell, tècnic informàtic, 2.000 € nets/mes— vol comprar un pis de **200.000 €** a València. Disposen de **45.000 € estalviats**: aportaran **40.000 € d'entrada (20 %)** i reservaran **5.000 €** per a notaria, registre, ITP i taxació. Necessiten finançar **160.000 € a 25 anys**.

Tres bancs els oferixen condicions distintes. L'activitat consistix a analitzar les tres ofertes amb criteri financer i recomanar-ne una, justificant l'elecció per escrit i defenent-la oralment.

### Les tres ofertes

| Oferta | Modalitat | Tipus aplicat | Productes vinculats | TAE estimada |
| --- | --- | --- | --- | --- |
| **Banc A** | Fixa a 25 anys | 3,2 % TIN | Assegurança de llar i de vida del banc | 3,6 % |
| **Banc B** | Variable a 25 anys | Euríbor + 0,75 % (revisió anual) | Assegurança de llar del banc | Variable |
| **Banc C** | Mixta (5 anys fix + 20 anys variable) | 2,4 % els primers 5 anys; després Euríbor + 0,90 % | Assegurança de llar, vida i compte nòmina | 3,1 % els primers 5 anys |

Dades auxiliars per als càlculs:
- Euríbor a 12 mesos actual (suposar): **3,5 %**.
- Històric Euríbor a 12 mesos: mínim de **−0,5 %** (2021), màxim recent de **+4,2 %** (2023).
- Fórmula de la quota (sistema francés): `Cuota = C · i / (1 − (1 + i)^(−n))`, amb `i` el tipus mensual i `n` el nombre total de quotes.

## Objectius didàctics

- Aplicar la fórmula de la quota hipotecària al sistema francés amb tres escenaris distints.
- Distingir amb un cas pràctic **TIN** i **TAE**, i entendre per què la TAE és l'indicador legal obligatori per comparar préstecs.
- Estimar l'impacte sobre la quota mensual de variacions de l'**Euríbor** al llarg de 25 anys.
- Argumentar una decisió financera personal contrastant seguretat (tipus fix), risc (variable) i posició intermèdia (mixta).

## Passos

1. **Lectura individual del cas (10 min).** Cada alumne llig la fitxa amb les dades de la parella i les tres ofertes. Identifica quina dada falta o sobra per prendre la decisió.
2. **Càlculs en parella, Banc A (15 min).** Calcular la quota mensual al 3,2 % TIN, el cost total del préstec i els interessos pagats al llarg dels 25 anys. Comprovar que la quota cap dins del 30-35 % dels ingressos nets de la llar.
3. **Càlculs en parella, Banc B (15 min).** Calcular la quota inicial amb un Euríbor del 3,5 % (tipus aplicat: 4,25 %). Repetir el càlcul en dos escenaris contrafactuals: Euríbor al 0 % (tipus: 0,75 %) i Euríbor al 4 % (tipus: 4,75 %). Anotar la diferència mensual entre l'escenari favorable i l'advers.
4. **Càlculs en parella, Banc C (15 min).** Calcular la quota durant els primers 5 anys al 2,4 % fix. Estimar la quota a partir de l'any 6 amb un Euríbor del 3,5 % (tipus: 4,4 %) sobre el capital pendent després de 5 anys d'amortització.
5. **Decisió raonada (15 min).** Cada parella escriu un informe breu (màxim 1 cara) recomanant una de les tres ofertes. Ha d'incloure: quotes calculades, cost total estimat, principal risc associat i justificació final.
6. **Posada en comú (20 min).** Tres parelles presenten la seua recomanació (una per cada oferta si és possible). Es contrasten arguments. El professor introduïx els conceptes d'aversió al risc i horitzó temporal en la decisió hipotecària.

## Resultats esperats (orientatius)

Per situar el professor, les quotes mensuals aproximades que haurien d'obtindre:

- **Banc A (fix 3,2 %)**: quota ≈ **777 €/mes**. Cost total ≈ **233.100 €**. Interessos ≈ **73.100 €**.
- **Banc B (variable, Euríbor 3,5 %, tipus aplicat 4,25 %)**: quota ≈ **866 €/mes**. En escenari favorable (Euríbor 0 %, tipus 0,75 %), quota ≈ **585 €/mes**. En escenari advers (Euríbor 4 %, tipus 4,75 %), quota ≈ **912 €/mes**.
- **Banc C (mixta, 2,4 % els 5 primers anys)**: quota inicial ≈ **710 €/mes**. A partir de l'any 6, amb Euríbor 3,5 % (tipus 4,4 %) sobre el capital pendent, quota ≈ **870 €/mes**.

## Criteris d'avaluació

| Criteri | Descripció | Pes |
| --- | --- | --- |
| Correcció dels càlculs | Quotes, cost total i interessos calculats sense errors greus | 35 % |
| Comprensió TIN / TAE / Euríbor | Distingix els tres conceptes i els usa correctament | 20 % |
| Anàlisi de risc | Identifica l'escenari advers del tipus variable i dimensiona l'impacte | 20 % |
| Justificació final | La recomanació està alineada amb les dades calculades i amb el perfil de la parella | 15 % |
| Defensa oral | Respon amb arguments a les preguntes dels companys | 10 % |

## Variants i extensions

- **Variant curta (45 min):** treballar només les ofertes A (fixa) i B (variable), sense la mixta.
- **Variant amb full de càlcul:** construir el quadre d'amortització mes a mes en LibreOffice/Excel i representar gràficament l'evolució del capital pendent i dels interessos.
- **Variant amb dades reals:** substituir les ofertes inventades per captures reals de tres comparadors hipotecaris (idealista, fotocasa, bankimia) en la setmana de l'activitat.
- **Connexió amb el bloc macro:** discutir per què l'Euríbor va passar del −0,5 % al +4 % entre 2021 i 2023 a partir de la política monetària del BCE enfront de la inflació.
