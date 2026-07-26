---
asignatura: eco-1bach
unidad_relacionada: 10
title: "El multiplicador del diner en acció"
descripcion: "Calcular com un únic depòsit inicial genera múltiples depòsits derivats en la cadena bancària, comparant escenaris amb distints coeficients de reserves i simulant cicles de creació de diner."
tipo: ejercicio
duracion: "55 min · 1 sessió"
agrupacion: "parelles"
materiales:
  - "Calculadora (o app de mòbil)"
  - "Full de càlcul (LibreOffice Calc, Google Sheets o Excel) — opcional però recomanat per a l'extensió"
  - "Fitxa de treball amb la taula de rondes (s'entrega impresa o en PDF)"
  - "Pissarra per a la posada en comú final"
competencias_clave: [STEM, CPSAA, CD]
competencias_especificas: [CE5]
lang: ca
estado: publicado
slug: "asignaturas/eco-1bach/actividades/10-multiplicador-dinero.ca"
---

## Plantejament

Un dels fets més contraintuïtius de l'economia moderna és que la major part del diner que circula **no la crea el banc central**, sinó els bancs comercials quan concedixen préstecs. Esta activitat pretén que l'alumnat ho veja amb els seus propis càlculs: a partir d'un depòsit inicial concret, anem a simular com s'expandix al llarg de la cadena bancària i com el resultat canvia dràsticament segons el coeficient de reserves que apliquen els bancs.

Treballareu amb tres escenaris paral·lels: coeficients del **20 %**, del **10 %** i del **5 %**. Veureu que xicotetes diferències en el coeficient generen diferències enormes en la quantitat total de diner creat.

## Objectius didàctics

- Calcular el multiplicador del diner `k = 1/c` a partir del coeficient de reserves.
- Simular manualment les primeres rondes de creació de diner bancari i observar la convergència geomètrica.
- Comparar l'efecte de tres coeficients distints sobre el diner total creat pel sistema.
- Raonar per què el multiplicador efectiu en la realitat és menor que el teòric.
- Connectar el càlcul amb decisions reals de política monetària del BCE.

## Passos

1. **Repàs teòric guiat (5 min).** El professor recorda a la pissarra la fórmula `k = 1/c`, la mecànica de les rondes i els supòsits de l'exercici resolt 10.1 del llibre (els bancs retenen només el mínim legal i tot el diner prestat torna al sistema com a depòsit).
2. **Escenari A — c = 20 % (15 min).** En parelles, partint d'un depòsit inicial de **10.000 €**, calculen les **8 primeres rondes** de la cadena bancària emplenant esta taula:

   | Ronda | Depòsit | Reserva (20 %) | Préstec |
   | --- | --- | --- | --- |
   | 1 | 10.000 € | … | … |
   | 2 | … | … | … |
   | … | … | … | … |
   | 8 | … | … | … |

   Després calculen: multiplicador teòric `k`, depòsits totals del sistema (`D_total = D_inicial / c`), préstecs totals, reserves totals i diner nou creat.

3. **Escenaris B i C (15 min).** Repetixen el càlcul amb **c = 10 %** i **c = 5 %**, partint sempre del mateix depòsit inicial de 10.000 €. Comparen els tres resultats finals.
4. **Discussió en parelles (10 min).** Responen per escrit a tres preguntes:
   - a) Quantes vegades més diner es crea en l'escenari C respecte a l'A? Et pareix proporcional o desproporcionat al canvi en el coeficient?
   - b) Si un banc central vol **frenar la inflació**, li interessa pujar o baixar el coeficient de reserves? Raona-ho.
   - c) A la zona euro, el coeficient legal és de l'**1 %** des de 2012. Per què el multiplicador efectiu de M3 sobre M0 no arriba a 100, sinó que ronda 6-8?
5. **Posada en comú (10 min).** Dues o tres parelles presenten les seues taules i les seues respostes. El professor connecta les troballes amb el funcionament real del BCE: per què hui la política monetària europea treballa sobretot amb **tipus d'interés** i no amb el coeficient de reserves (que es manté fix i baix des de fa més d'una dècada).

## Resultats de referència per al professor

Amb depòsit inicial de 10.000 €:

| Coeficient | Multiplicador `k` | Depòsits totals | Préstecs totals | Diner nou creat |
| --- | --- | --- | --- | --- |
| 20 % | 5 | 50.000 € | 40.000 € | 40.000 € |
| 10 % | 10 | 100.000 € | 90.000 € | 90.000 € |
| 5 % | 20 | 200.000 € | 190.000 € | 190.000 € |

**Lectura clau**: passar del 20 % al 5 % no triplica el diner creat, el **multiplica quasi per cinc**. La relació és inversa i no lineal: xicotetes reduccions del coeficient generen grans expansions de l'oferta monetària. Per això baixar el coeficient és una eina tan potent —i tan poc habitual— de política monetària.

## Criteris d'avaluació

| Criteri | Descripció | Pes |
| --- | --- | --- |
| Correcció dels càlculs | Taules de rondes i totals ben calculats en els tres escenaris | 40 % |
| Comprensió del multiplicador | Identifica la relació inversa entre `c` i `k` i la convergència geomètrica | 20 % |
| Raonament econòmic | Connecta el coeficient amb política monetària i control de la inflació | 25 % |
| Reflexió sobre la realitat | Explica amb les seues paraules per què el multiplicador efectiu és menor que el teòric | 15 % |

## Variants i extensions

- **Variant curta (30 min):** treballar només un escenari (c = 10 %) amb 5 rondes i ometre la comparació.
- **Variant amb full de càlcul (90 min):** les parelles munten en LibreOffice Calc / Google Sheets un full amb cel·la variable per a `c` i gràfic de la progressió geomètrica de depòsits. Permeten veure instantàniament què passa en canviar el coeficient.
- **Extensió qualitativa:** debat breu sobre la proposta de **banca amb reserva del 100 %** (*full-reserve banking*) defesa per economistes com Irving Fisher als anys 30 o per Milton Friedman: què passaria amb la creació de diner? I amb el crèdit a empreses i famílies?
- **Connexió amb la Unitat 11:** continuar l'activitat analitzant com el BCE, en lloc de moure el coeficient, actua sobre els tipus d'interés oficials per influir en la velocitat de creació de diner.
