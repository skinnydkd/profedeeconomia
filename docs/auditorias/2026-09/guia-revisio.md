# Guia de revisió · correccions de l'auditoria de setembre de 2026

1 d'octubre de 2026, posada al dia el 4 d'octubre · per a Pau

## Com usar esta guia

- Cobrix els 51 PR fusionats entre el 28 i el 30 de setembre de 2026 que corregixen l'auditoria de setembre (#267): del #268 al #312, el #315 i els cinc de tests (#323 a #327).
- Els PR que corregixen la segona passada i les troballes que quedaven (#328 a #339 i els següents) són a «Segona passada» i a «Troballes transversals d'última hora», al final.
- Cada assignatura porta les troballes corregides, amb el seu PR, i una taula de les unitats tocades. Després ve què mirar primer i què queda obert.
- ★ marca les unitats (i algunes peces) on els canvis toquen contingut laboral, fiscal, de seguretat o de benestar: el que l'alumnat pot aplicar demà (nòmina, contractes, acomiadament, cotitzacions, IRPF, seguretat en el treball, assetjament, telèfons d'ajuda).
- Ordre que et propose: primer les unitats ★; després les claus dels tests i els solucionaris de les activitats; al final, les dades (xifres, dates i fonts).
- Quasi tots els PR canvien castellà i valencià alhora. Quan revises una pàgina, obri també la /ca/.
- Pots revisar a la web o als PDF: es van regenerar l'1 d'octubre, amb el contingut (#345) i amb el format dels PR visuals (#346). Els PR posteriors no toquen cap pàgina d'on ixen PDF.
- Tots els PR que cita esta guia estan fusionats a `main`.
- Al final tens el codi, la segona passada (R1–R6), els PR visuals i dels jocs, els últims PR, el que et queda per fer a tu i les decisions que et toquen.

## EDMN 2BACH

### Troballes corregides

- **EDMN-D01** · Crític · La clau del simulacre 1 calcula el marge de seguretat sobre el punt mort (25 % en lloc de 20 %) · https://github.com/skinnydkd/profedeeconomia/pull/270
- **EDMN-D02** · Crític · La clau del simulacre 1 posa les amortitzacions acumulades com a finançament «interna-ajena» · https://github.com/skinnydkd/profedeeconomia/pull/270
- **EDMN-D03** · Crític · «Nueve principios contables»: el PGC 2007 en fixa sis · https://github.com/skinnydkd/profedeeconomia/pull/270
- **EDMN-D04** · Crític · Capital de l'SL: el llindar de 3.000 € i la SLFS a l'arbre, al deck, a una clau i al quadern PAU · https://github.com/skinnydkd/profedeeconomia/pull/275
- **EDMN-D05** · Alt · Palanquejament: la regla «RF > RE» compara una rendibilitat després d'impostos amb una d'abans · https://github.com/skinnydkd/profedeeconomia/pull/280
- **EDMN-D08** · Alt · Activitats d'U11: el balanç d'Inditex no quadra i l'endeutament té dues definicions (en part: només la calculadora de ràtios) · https://github.com/skinnydkd/profedeeconomia/pull/280
- **EDMN-D09** · Alt · Test d'U2: la clau contradiu el llibre i dona per bona una afirmació falsa sobre la nòmina · https://github.com/skinnydkd/profedeeconomia/pull/280
- **EDMN-D10** · Alt · El «Reto del curso» promet fitxes per unitat que no existixen i es declara obligatori · https://github.com/skinnydkd/profedeeconomia/pull/283
- **EDMN-D11** · Mitjà · U9: xifres de l'exercici 9.1, una «TAE» que no es calcula i la TIR a dos anys · https://github.com/skinnydkd/profedeeconomia/pull/286
- **EDMN-D12** · Mitjà · Fiscalitat d'U2: tipus d'IS desfasats, un 15 % de nova creació que no s'aplica i xifres d'estalvi que no casen · https://github.com/skinnydkd/profedeeconomia/pull/288
- **EDMN-D13** · Mitjà · Detalls normatius: formulació de comptes, compte 626, «quiebra», morositat, cooperatives, SA, CIF, ITP i pla d'igualtat · https://github.com/skinnydkd/profedeeconomia/pull/294
- **EDMN-D15** · Mitjà · Casos reals amb dades contradictòries o no verificables (Pescanova, DIA, Abengoa, Dalio) · https://github.com/skinnydkd/profedeeconomia/pull/303
- **EDMN-D17** · Mitjà · Tests: la clau és la segona opció en el 59 % dels ítems i la més llarga en el 68 % · https://github.com/skinnydkd/profedeeconomia/pull/325

### Unitats tocades

| Unitat | Què | PR |
|---|---|---|
| U1 · Persona emprenedora | test | #325 |
| U2 · Tipus d'empresa i organització | llibre, test, activitats, repte, recurs | #271 #275 #280 #282 #288 #294 #301 #310 #325 |
| U3 · Entorn i estratègies | llibre, test, repte | #282 #325 |
| U4 · Models de negoci | test | #325 |
| U5 · Disseny creatiu de models | test | #325 |
| U6 · Funció comercial i màrqueting | test | #325 |
| U7 · Funció productiva | llibre, test | #270 #325 |
| ★ U8 · Recursos humans | llibre, test, repte | #280 #282 #294 #304 #308 #325 |
| U9 · Funció financera | llibre, test | #280 #286 #303 #325 |
| U10 · Informació comptable | llibre, test, repte | #270 #288 #294 #303 #325 |
| U11 · Anàlisi d'estats financers | llibre, test | #280 #294 #303 #325 |
| U12 · Comunicació i pla d'empresa | llibre, test | #288 #325 |

Fora de les unitats: EBAU (#270 simulacres, #275 pauta 02), reforç i ampliació (#270, #275, #280), dinàmica 02 (#275), quadern de projecte (#275), programació (#302) i introducció del Repte del curs (#283).

### Mira sobretot

- EBAU: el marge de seguretat es calcula sobre les vendes previstes, (1.000 − 800) / 1.000 = **20 %**; la rúbrica també accepta el 25 % sobre el punt mort si s'interpreta bé. U7: un marge del 30 % vol dir que les vendes poden caure un 30 %, o que superen el punt mort en un 43 %. PGC 2007: **sis** principis (#270).
- SL des d'**1 €** (Llei 18/2022): mentre el capital no arriba a 3.000 €, el 20 % del benefici va a reserva legal, i si es liquida sense poder pagar, els socis responen solidàriament de la diferència fins a 3.000 € (art. 4 LSC). L'arbre pregunta ara «¿Poco riesgo de deudas?» (#275). R2 A5 hi posa un matís: la garantia dura mentre el capital no arriba a 3.000 €, sense comptar la reserva.
- IS de 2026 (Llei 7/2024): 23 % per a les de reduïda dimensió; microempreses, 19 % els primers 50.000 € i 21 % la resta; nova creació, 15 % el primer exercici amb beneficis i el següent (art. 29.1 LIS). Exercici 10.2: impost de 4.094,50 € i resultat de 17.455,50 €. Exercici 12.1: VAN de −29.606 €. Dividends, del 19 % al 30 % (#288).
- Palanquejament: és positiu si la RE supera el cost del deute, i es comprova amb la RF abans d'impostos (BAI / PN). Exercici 11.2: 22,5 % davant del 12 %, 10,5 punts, i l'impost en resta 5,6 (#280).
- ★ U8: pla d'igualtat amb «50 o más» persones (#282); R2 A9 diu que el cos i el glossari encara diuen «superior a 50». La quota patronal figura al peu de la nòmina com a aportació de l'empresa, però no es descompta del sou (#280, #308). Test d'U8: líquid de **1.630 €** amb el 6,50 % i un IRPF del 12 % (#325).
- U10: comptes formulats en 3 mesos (art. 253 LSC), 6 per a aprovar-los i 1 més per a dipositar-los; comissions bancàries al compte 626, amb un resultat d'explotació de 25.350 € i un financer de −3.800 € (#294). U9: VAN de 5.733,91 € i TIR del 20,75 %; TAE de l'exercici 9.2, 6,8 % i 11,5 % (#286).

### Queda obert

- EDMN-D08: el balanç d'Inditex de l'activitat d'U11 i les dues definicions d'endeutament. Cal triar si es refà amb comptes reals o es declara fictici (#280).
- EDMN-D10: hi ha tres fils de projecte en paral·lel (el repte del llibre, el quadern de projecte de 6 fases i «De cero a empresa»). L'auditoria proposa triar-ne un (#283).
- EDMN-D11: l'exercici 9.4 de TIR amb dos fluxos i la clau del joc de la cartera amb la mitjana geomètrica són contingut nou i no s'han fet (#286).
- Un sol «propietari» per cas: la Marina a EDMN i un cas valencià nou a GPE U3 (#288).
- La pregunta nova de l'arbre de forma jurídica és una decisió de contingut: si vols una altra formulació, són dues cadenes de `FormaJuridicaTree.astro` (#275).
- Errors del llibre que van eixir en fer els tests, per al PR de contingut: el glossari d'U8 diu 6,47 %; U12 atribuïx el punt mort a la «Unidad 6»; U12 definix la «cuota de mercado» de dues maneres (#325).
- DIA: la cotització mínima de 0,06 € (2019) i les ràtios (endeutament del 60 al 85 %, ROA del 6 a l'1 %) no s'han pogut comprovar (#303).
- Cajút només agafarà les preguntes noves dels tests quan s'execute `npm run deploy:cajut` (#325), que fa el mateix que `npm run party:deploy`: vegeu «Et queda a tu».

## Eco 1BACH

### Troballes corregides

- **ECO1-D01** · Crític · L'exercici resolt 12.1 «demostra» els guanys del comerç amb xifres que diuen el contrari · https://github.com/skinnydkd/profedeeconomia/pull/270
- **ECO1-D03** · Alt · Cicle econòmic: fases atribuïdes al NBER i «depresión» definida de tres maneres · https://github.com/skinnydkd/profedeeconomia/pull/279
- **ECO1-D04** · Alt · Política monetària: tres «tipus actuals del BCE» i dos Euríbors segons la unitat · https://github.com/skinnydkd/profedeeconomia/pull/279
- **ECO1-D05** · Alt · Els tests i la U8 no havien rebut la passada de dades: xifres contradictòries entre peces · https://github.com/skinnydkd/profedeeconomia/pull/284
- **ECO1-D06** · Alt · Donació d'òrgans: el llibre i el deck repetixen el mite que desmentix l'activitat · https://github.com/skinnydkd/profedeeconomia/pull/279
- **ECO1-D07** · Alt · El simulador AD-AS diu «Y*» a la producció d'equilibri a curt termini · https://github.com/skinnydkd/profedeeconomia/pull/279
- **ECO1-D08** · Alt · L'exercici 5.2 del tabac té demanda elàstica i càrrega sobre el productor · https://github.com/skinnydkd/profedeeconomia/pull/279
- **ECO1-D09** · Alt · Bretxa salarial: «ajustada» i «sense ajustar» intercanviades · https://github.com/skinnydkd/profedeeconomia/pull/279
- **ECO1-D10** · Alt · Dinàmica de la gasolinera: la 95 i la 98 «complementàries» i indicadors que contradiuen el feedback · https://github.com/skinnydkd/profedeeconomia/pull/279
- **ECO1-D12** · Mitjà · Economia conductual: l'aversió a la pèrdua «explica» l'assegurança · https://github.com/skinnydkd/profedeeconomia/pull/292
- **ECO1-D13** · Mitjà · No avisa de la crisi de replicació i té exemples sense base · https://github.com/skinnydkd/profedeeconomia/pull/292
- **ECO1-D14** · Mitjà · U8: cita de Solow fora de context i xifres de desenvolupament desfasades · https://github.com/skinnydkd/profedeeconomia/pull/293
- **ECO1-D15** · Mitjà · Claus i exercicis resolts amb errades de càlcul o de lectura · https://github.com/skinnydkd/profedeeconomia/pull/286
- **ECO1-D16** · Mitjà · Rendiments d'inversió sobrevalorats i un ítem de test sense la dada que decidix · https://github.com/skinnydkd/profedeeconomia/pull/293
- **ECO1-D17** · Mitjà · Tres activitats amb un disseny que contradiu o supera el model de la unitat · https://github.com/skinnydkd/profedeeconomia/pull/302
- **ECO1-D18** · Mitjà · Cost d'oportunitat definit de dues maneres · https://github.com/skinnydkd/profedeeconomia/pull/293
- **ECO1-D20** · Mitjà · Fonts poc fiables: títols inexistents, comptes no verificats i crèdits d'imatge contradictoris · https://github.com/skinnydkd/profedeeconomia/pull/297, https://github.com/skinnydkd/profedeeconomia/pull/300 i https://github.com/skinnydkd/profedeeconomia/pull/302
- **ECO1-D21** · Baix · Detalls diversos (en part: queda el «Nivel EBAU» dels decks) · https://github.com/skinnydkd/profedeeconomia/pull/302 i https://github.com/skinnydkd/profedeeconomia/pull/306

### Unitats tocades

| Unitat | Què | PR |
|---|---|---|
| U1 · Economia com a ciència social | llibre, test | #293 #297 |
| U2 · Presa de decisions | llibre, test | #279 #292 #297 #300 #302 |
| U3 · Planificació financera personal | llibre, test | #279 #286 #293 |
| U4 · Oferta, demanda i mercat | llibre | #300 #302 #306 |
| U5 · Elasticitat | llibre, test, activitats, repte | #279 #286 #297 #300 #302 |
| U7 · Macroeconomia i indicadors | llibre, test | #284 |
| U8 · Model OA-DA i cicles | llibre, test, activitats | #279 #284 #293 #302 |
| ★ U9 · Mercat de treball i atur | llibre, test | #279 #281 #286 #300 |
| U10 · Sistema financer i diners | llibre, test | #279 #284 |
| U11 · Polítiques econòmiques | llibre, test | #279 #284 #286 #297 #300 #302 |
| U12 · Globalització i UE | llibre, test, activitats | #270 #284 #300 |

Fora de les unitats: la dinàmica de la gasolinera (#279) i la programació, que ara enllaça les fitxes de reforç (#302).

### Mira sobretot

- U12: Surpaís s'especialitza en tela, manté la mateixa tela que en autarquia i els dos països guanyen 3,33 t de blat, amb un intercanvi a 1,6 t per metre. Activitat 12: amb 300 de tela no canvia res; amb 90, sí (#270). R1 A8: el diagrama de davall encara compara 35 t amb 50 t.
- Tipus del BCE des del 16-09-2026: **2,90 %, 2,65 % i 2,50 %** (U10). Euríbor d'agost, 2,95 %; màxim del 4,16 % a l'octubre de 2023; pujades des de juliol de 2022. U11 diu «14 meses» (#279).
- Exercici 5.2: P = 22 − 0,07·Q; amb l'impost, Q = 190, Pc = 8,70 € i Pp = 7,70 €, i el consumidor en paga el **70 %**; comprovació, 1.263,5 + 541,5 + 190 + 5 = 2.000 (#279). Test U5, pregunta 2: 8,33 / 9,52 = **0,875**; repte 09: **0,34** (#286).
- ★ U9: el 9 % d'Eurostat és la bretxa sense ajustar per hora; el 15,7 % de l'INE (2023) és la bretxa en guany anual; l'ajustada no té xifra oficial (#279). Permís per naixement de 19 setmanes i pla d'igualtat amb «50 o más» (#281). R3 A6: l'INE ja dona el 16,1 % per a 2024.
- Dades de l'INE (setembre de 2026): PIB 2020, −10,9 %; +6,7 % el 2021, +6,2 % el 2022, +2,4 % el 2023, +3,7 % el 2024 i +2,6 % el 2025. El 2025, deute del 100,7 % i dèficit del 2,4 % (2,2 % sense la DANA). EPA 2T 2026: 9,87 %. Euro digital: pilot el 2027 i primera emissió possible el 2029 (#284). R3 A13: no és la primera vegada per davall del 10 %.
- U8: residu de Solow, set octaus (87,5 %) entre 1909 i 1949; I+D, 1,50 % del PIB (2024); IDH, Espanya 28a amb 0,918; Gini de 0,31 el 2024 (#293). U3: MSCI World, 7-8 % nominal i 4-6 % real; test de les germanes al 7 %: Ana, uns 295.000 €, i Berta, uns 276.500 € (#293).

### Queda obert

- El bloc únic de dades de referència per a tot el curs no s'ha fet: cada dada és a la seua unitat, però ara quadren (#279, #284).
- U3 i U7 donen l'EPA del 1T 2026 (10,83 %). És correcta i datada, però es pot passar al 2T (#284).
- Les xifres de l'INE es van contrastar amb mitjans, perquè ine.es no s'obria des de l'entorn. Fes una ullada a les notes enllaçades al PR (#284).
- Altres comptes recomanats que no s'han pogut verificar: @FMinimalistas, @ecoinometrics, @jfjimenoserrano, @joantubau, @businessbarista i @auara (#297).
- El «Nivel EBAU» dels decks d'U2 a U5 depén de la decisió EBAU/PAU (#302, #306).
- La variant de debat de l'activitat d'elasticitat i fiscalitat cita Card i Krueger en un debat sobre l'impost als refrescos (#302).

## Eco 4ESO

### Troballes corregides

- **ECO4-D01** · Crític · La dinàmica del contracte d'estiu ensenya a un menor que no pot negar-se a fer hores extra · https://github.com/skinnydkd/profedeeconomia/pull/268
- **ECO4-D02** · Alt · SMI de 2025 (i un de 2024) a tot el curs · https://github.com/skinnydkd/profedeeconomia/pull/276
- **ECO4-D03** · Alt · Les activitats de nòmina contradiuen el mètode de la U5 i tenen claus errònies · https://github.com/skinnydkd/profedeeconomia/pull/282
- **ECO4-D04** · Alt · La calculadora de nòmina i el simulador de renda inflen l'IRPF dels sous baixos i s'etiqueten com a «escala estatal» · https://github.com/skinnydkd/profedeeconomia/pull/271 (càlcul) i https://github.com/skinnydkd/profedeeconomia/pull/311 (textos)
- **ECO4-D07** · Mitjà · Referències òrfenes després de passar a 12 unitats i bessons CA desfasats · https://github.com/skinnydkd/profedeeconomia/pull/299
- **ECO4-D08** · Mitjà · El reforç i el test calculen l'IRPF «sobre el brut» · https://github.com/skinnydkd/profedeeconomia/pull/282
- **ECO4-D09** · Mitjà · Les dades de l'EPA de la U5 no quadren entre si ni amb FOPP · https://github.com/skinnydkd/profedeeconomia/pull/299
- **ECO4-D10** · Mitjà · Indemnització de 12 dies i proteccions dels menors incompletes a la U5 · https://github.com/skinnydkd/profedeeconomia/pull/268
- **ECO4-D11** · Mitjà · Càrrega de lectura i d'activitats per damunt del temps declarat (la part mesurable) · https://github.com/skinnydkd/profedeeconomia/pull/311
- **ECO4-D12** · Mitjà · La dinàmica del mòbil de segona mà atribuïx drets de consum a una compra entre particulars · https://github.com/skinnydkd/profedeeconomia/pull/289
- **ECO4-D13** · Mitjà · Termini de resposta del banc en un cas de frau · https://github.com/skinnydkd/profedeeconomia/pull/289
- **ECO4-D16** · Mitjà · La U3 i la U5 presenten amb signe contrari l'evidència sobre SMI i ocupació · https://github.com/skinnydkd/profedeeconomia/pull/291
- **ECO4-D17** · Baix · L'interès mensual d'una TAE es calcula com a TAE/12 · https://github.com/skinnydkd/profedeeconomia/pull/311
- **ECO4-D18** · Baix · La idea que cotitzar dona dret a la sanitat · https://github.com/skinnydkd/profedeeconomia/pull/308

### Unitats tocades

| Unitat | Què | PR |
|---|---|---|
| U1 · Escassetat i elecció | llibre | #276 #311 |
| U2 · Producció i sostenibilitat | llibre, recurs | #299 #311 |
| U3 · Mercats | llibre | #276 #291 #311 |
| U4 · Diners, bancs i inflació | llibre | #276 #311 |
| ★ U5 · Treball, contractes, nòmina i atur | llibre, test, activitats, repte, recurs | #268 #270 #271 #276 #280 #282 #291 #299 #308 #310 #311 |
| ★ U6 · Estat, impostos i desigualtat | llibre, test, activitats, recurs | #270 #271 #276 #287 #299 #311 |
| U7 · Pressupost, estalvi i consum | llibre | #311 |
| ★ U8 · Banc, crèdit, inversió i assegurances | llibre, activitats | #276 #289 #311 |
| U9 · Comerç internacional i UE | llibre | #311 |
| U10 · Empresa i formes jurídiques | llibre, recurs | #299 #310 #311 |
| U11 · Emprendre | llibre, activitats | #276 #282 #299 #311 |
| U12 · Projecte emprenedor | llibre, activitats | #299 #310 #311 |

Fora de les unitats: dinàmica ★ del contracte d'estiu (#268, i el Tribunal d'Instància al #310), dinàmica del mòbil de segona mà (#289), reforç i ampliació (#270, #276, #282).

### Mira sobretot

- SMI de 2026: **1.221 € al mes en 14 pagues, 17.094 € a l'any** (RD 126/2026, BOE del 19-02-2026). En 12 pagues, 1.424,50 €; net aproximat a la U8, uns 1.330 €; +66 % des de 2018 (735,90 €) (#276).
- ★ Menors (U5 i dinàmica 08): cap treball abans dels 16 anys; amb 16 o 17, autorització dels pares; ni treball nocturn (art. 6.2 ET) ni hores extra (art. 6.3); màxim 8 h al dia, pausa de 30 min si la jornada passa de 4,5 h. En un temporal, 6,55 % de cotització, sense retenció d'IRPF, 12 dies per fi de contracte i un any per a reclamar (#268).
- ★ Nòmines: el treballador cotitza un **6,50 %** (4,70 + 1,55 + 0,10 + 0,15 de MEI) sobre la base amb les extres prorratejades (#270). Carlos: base 1.500 × 14 / 12 = 1.750 €, SS 113,75 €, IRPF 180 €, líquid **1.206,25 €** i cost d'empresa al maig **2.036,38 €**. Adrián: retenció mínima del 2 % (contracte de menys d'un any). El plus de transport cotitza i tributa des de 2013 (#282).
- ★ U6: l'escala del 19 al 47 % és «la estatal más una autonómica tipo». Lucía, 20.000 € → quota d'uns **2.044 €** (10 %), no 2.200 € (#271); R2 A2 demana nomenar les cotitzacions, sense les quals no ix. Reforç de Dani: els 15.000 € són base liquidable, un sou d'uns 19.750 € bruts (#282).
- ★ U8: el banc té **15 dies hàbils** per a respondre, i un mes en casos excepcionals (RDL 19/2018, art. 69) (#289); R4, punt 16: un altre paràgraf de la pàgina encara diu «dos meses». Revolving: una TAE del 27,24 % és un 2,03 % al mes; amb 6.000 €, uns 120 € d'interessos al mes, i d'una quota de 150 € només uns 30 € reduïxen el deute (#311).
- SMI i ocupació: Document Ocasional 2113 (2021) del Banc d'Espanya i AIReF (2020), entre 19.000 i 33.000 afiliats menys (#291). EPA 2T 2025: uns 2,55 milions d'aturats per a una taxa del 10,3 % (#299). Temps de lectura: de 40 a 60 minuts per unitat (#311).

### Queda obert

- U12 diu que la tarifa reduïda d'autònoms és «vigente en 2025», i U10 dona els trams de quota de 2025. Cal confirmar què diu la normativa de 2026 (#276).
- La Lucía de l'exercici 6.1 continua amb una retenció de 3.400 € (17 %), més alta que la real. Canviar-la obliga a refer la declaració. La retenció de Marc (17 %) queda un poc per davall del càlcul (18-19 %) (#282).
- La deducció perquè l'SMI no tribute no està a les calculadores, i cal verificar-ne l'import de 2026 (#271). La segona passada l'ha trobada (R2 A1).
- Passar la U5 a l'EPA de 2026 (2T: 9,9 %) obliga a canviar alhora la taxa d'activitat, l'atur juvenil i la temporalitat (#299).
- ECO4-D11: l'«itinerari essencial» i el retall de frases llargues són decisions editorials (#311). ECO4-D14 i ECO4-D15 depenen de la numeració de les CE (vegeu «Decisions»).

## FOPP 4ESO

### Troballes corregides

- **FOPP-D01** · Crític · La clau del test de la U5 dona per correctes «cinco modalidades» de Batxillerat · https://github.com/skinnydkd/profedeeconomia/pull/270
- **FOPP-D03** · Alt · Recursos d'ajuda en salut mental i assetjament: un servei no identificat i buits importants · https://github.com/skinnydkd/profedeeconomia/pull/268
- **FOPP-D04** · Alt · Terminis i vies de reclamació laboral incorrectes · https://github.com/skinnydkd/profedeeconomia/pull/268
- **FOPP-D05** · Alt · «Mi primer verano trabajando» tracta les hores extra d'una menor com a compensables · https://github.com/skinnydkd/profedeeconomia/pull/268
- **FOPP-D07** · Mitjà · La prova d'accés es descriu amb el nom i les matèries d'abans de 2025 · https://github.com/skinnydkd/profedeeconomia/pull/289
- **FOPP-D08** · Mitjà · La temporització no és viable amb 2 sessions setmanals · https://github.com/skinnydkd/profedeeconomia/pull/311
- **FOPP-D09** · Mitjà · Remet a la «Unidad 8 de Eco 4ESO» per a la nòmina · https://github.com/skinnydkd/profedeeconomia/pull/281
- **FOPP-D10** · Mitjà · Fonts de salut mental i assetjament mal citades o que no es poden verificar · https://github.com/skinnydkd/profedeeconomia/pull/296
- **FOPP-D11** · Mitjà · Casos inventats amb l'etiqueta «Ejemplo real» · https://github.com/skinnydkd/profedeeconomia/pull/291
- **FOPP-D12** · Mitjà · Permís per naixement i pla d'igualtat desactualitzats · https://github.com/skinnydkd/profedeeconomia/pull/281
- **FOPP-D13** · Mitjà · Protocol d'assetjament atribuït al RD 732/1995, i assetjament sempre com a «delito tipificado» · https://github.com/skinnydkd/profedeeconomia/pull/268
- **FOPP-D15** · Baix · Xifres de salaris i articles que no quadren entre peces · https://github.com/skinnydkd/profedeeconomia/pull/311
- **FOPP-D16** · Baix · Un lema promocional i desqualificador · https://github.com/skinnydkd/profedeeconomia/pull/311
- FOPP-D02 (Alt, ponderacions de la prova d'accés) ja estava corregida abans d'estos PR; ho diu el #281.

### Unitats tocades

| Unitat | Què | PR |
|---|---|---|
| U1 · Autoconeixement | llibre | #311 |
| ★ U2 · Emocions i salut mental | llibre, test | #268 #296 #311 |
| ★ U3 · Entorn familiar, social i digital | llibre, repte | #268 #289 #291 #296 #311 |
| U4 · Presa de decisions | llibre, test | #281 #302 #311 |
| U5 · Sistema educatiu i itineraris | llibre, test, activitats, repte | #270 #289 #291 #311 |
| U6 · FP, universitat i beques | llibre, test, repte | #270 #289 #291 #311 |
| U7 · Món del treball | llibre, test | #291 #311 |
| ★ U8 · Drets laborals | llibre, test, activitats, repte, recurs | #268 #281 #308 #310 #311 |
| U9 · Buscar feina i CV | llibre | #291 #311 |
| U10 · Projecte de vida | llibre, test, repte | #270 #289 #291 #296 #311 |

Fora de les unitats: dinàmiques ★ del primer estiu i de la reclamació (#268), dinàmica «Bachillerato o FP» (#289), programació (#302, i les 64 sessions del #311) i reforç i ampliació de la 3a avaluació (#270).

### Mira sobretot

- ★ U2: el requadre d'ajuda porta el 112, el 024, ANAR (900 20 20 10 i 116 111), el 016, el 017, el Teléfono de la Esperanza, l'orientació del centre i el metge de capçalera; ja no cita «ColeKonsulta» (#268). Dada de l'OMS: un de cada set adolescents de 10 a 19 anys té un trastorn mental (#296).
- ★ U3: el protocol d'assetjament ve de la LO 8/2021 i de la norma de cada comunitat, no del RD 732/1995; no tot assetjament és delicte; el 017 per al ciberassetjament; el cas passa a una alumna de 14 anys (#268). Xarxes: Riehm i altres (JAMA Psychiatry, 2019), una associació i no una causa (#296).
- ★ U8: la denúncia a la Inspecció és confidencial, no anònima (la Bústia no és una denúncia formal); l'advocat és opcional; **20 dies hàbils** només per a l'acomiadament i **un any** per a salaris o hores; multes greus de 751 a 7.500 € (#268). Ara és el Tribunal d'Instància (#310).
- ★ U8: permís per naixement de **19 setmanes** per progenitor (17 + 2 fins que el menor fa 8 anys), que suspén el contracte (art. 48 ET) i paga la Seguretat Social; pla d'igualtat amb «50 o más»; registre retributiu a totes les empreses (#281).
- U5 i U6: el Batxillerat té **quatre** modalitats, i Arts és una modalitat amb dues vies (#270). La prova és la PAU (RD 534/2024), amb «Historia de España o Historia de la Filosofía (a elegir)» a la fase d'accés (#289).
- Programació de 64 sessions: U1-U4, 6 cadascuna; U5 i U6, 7; U7 i U8, 6; U9, 8; U10, 6. Test 07: 17.500, 23.000, 26.500, 30.000 i 34.500 € (#311).

### Queda obert

- Dos casos amb font no verificada: Andrea Solà (U4, «Reportaje El País, mayo 2024») i la sentència de Mercadona (U8, sense número). Cal citar-los bé o fer-los il·lustratius (#291).
- Si vols tornar a posar una dada espanyola d'ansietat adolescent, ha de ser d'una font oficial amb l'any (ENSE, HBSC o ESTUDES) (#296).
- FOPP declara 15-20 minuts de lectura per a unitats de més de 5.000 paraules (#311; vegeu «Decisions»).

## Taller Eco 3ESO

### Troballes corregides

- **TALLER-D01** · Crític · La dinàmica del primer treball dona per correcte un contracte laboral als 15 anys · https://github.com/skinnydkd/profedeeconomia/pull/268
- **TALLER-D04** · Mitjà · El cas d'interès compost d'Ana i Bea té les xifres errònies · https://github.com/skinnydkd/profedeeconomia/pull/286
- **TALLER-D05** · Mitjà · «El 40 % del salario bruto» se'n va en impostos i cotitzacions · https://github.com/skinnydkd/profedeeconomia/pull/282
- **TALLER-D06** · Mitjà · Tres o quatre «ingredients» per a emprendre, segons la peça · https://github.com/skinnydkd/profedeeconomia/pull/290
- **TALLER-D07** · Mitjà · Els tests són gairebé només de memòria · https://github.com/skinnydkd/profedeeconomia/pull/326
- **TALLER-D08** · Baix · La durada de les unitats no quadra amb la programació · https://github.com/skinnydkd/profedeeconomia/pull/311
- **TALLER-D09** · Baix · Petites imprecisions en exemples i fonts · https://github.com/skinnydkd/profedeeconomia/pull/311

### Unitats tocades

| Unitat | Què | PR |
|---|---|---|
| U1 · Què és l'economia | llibre, test | #311 #326 |
| U2 · Agents i flux circular | llibre, test | #311 #326 |
| U3 · Consum responsable | llibre, test | #311 #326 |
| U4 · Diners i mitjans de pagament | llibre, test | #311 #326 |
| U5 · Pressupost i estalvi | llibre, test | #286 #311 #326 |
| U6 · Empreses i emprenedoria | llibre, test | #290 #311 #326 |
| ★ U7 · Món del treball | llibre, test, activitats, recurs | #282 #308 #311 #326 |
| ★ U8 · Sector públic i impostos | llibre, test | #282 #311 #326 |
| U9 · Economia sostenible | llibre, test | #311 #326 |

Fora de les unitats: dinàmica ★ del primer treball d'estiu (#268), programació (#302) i reforç i ampliació (#282, #290, #308, #311).

### Mira sobretot

- ★ Dinàmica del primer treball: cap contracte abans dels 16 anys; amb 16 o 17, autorització dels pares, sense hores extra ni treball nocturn (#268).
- ★ U7, nòmina de Laura (activitat 21): treball d'estiu a mitja jornada, 1.000 €, per damunt de l'SMI, sense retenció d'IRPF i amb un net de **935 €** (#311). Cotitzar dona dret a atur, baixes i pensió, i «la sanidad pública, en cambio, es para todo el mundo y se paga con impuestos» (#282, #308).
- ★ U8: de cada 100 € que costa un sou mitjà, uns 41 van a impostos i cotitzacions (OCDE, Taxing Wages 2026: 41,4 % sobre el cost laboral total); del que es veu a la nòmina, el treballador aporta una mica més del 20 % (#282).
- U5, Ana i Bea (5 € a la setmana al 5 %): Ana arriba a uns **55.000 €** i n'ha posat 13.000; Bea, a uns **17.500 €** i n'ha posat 7.800. Començar 20 anys abans multiplica per més de tres (#286).
- U6: tres ingredients per a emprendre (iniciativa, organització de recursos i risc) (#290). Sessions: 7 per unitat i 8-10 la U9. Ampliació de la 3a avaluació: Ana guanya 20.000 € i paga un 10 %; Luis, 40.000 € i un 20 %; amb 12.000 € no es paga IRPF (#311).
- Tests nous (#326): U3, 46,80 € a l'any (Coca-Cola davant d'Hacendado); U5, 71,88 € (5,99 € al mes); U7, 935 €; U8, 1.230 € (el 41 % de 3.000 €); U9, 1.200 t.

### Queda obert

- Errors fora dels tests, per al PR de la segona passada: la dinàmica del tiquet del súper calcula l'IVA com a preu × tipus i posa els refrescos al 10 % (les begudes amb sucres afegits paguen el 21 % des de 2021); la font del cas de Bizum d'U4 diu «2024» amb xifres de 2025 (#326).
- Dades que posa el test i no el llibre: el forn del barri d'U6 és inventat; U8 diu «si se cumple esa proporción»; U7 «con permiso de sus padres» (art. 7 ET) (#326).
- La durada dels tests passa de 10 a 15 minuts; es pot desfer (#326).

## IPE I

### Troballes corregides

- **IPE1-D01** · Crític · La cotització del treballador continua al 6,35 % (sense MEI) en tests, fitxes, exercici i diagrama · https://github.com/skinnydkd/profedeeconomia/pull/270
- **IPE1-D02** · Crític · La «Nómina A (correcta)» de l'activitat 06 cotitza sense prorrata de pagues extra i sense MEI · https://github.com/skinnydkd/profedeeconomia/pull/270
- **IPE1-D03** · Crític · Indemnitzacions: salari diari sense extres, antiguitat anterior a 2012 ignorada i «Despido procedente: 0 días» · https://github.com/skinnydkd/profedeeconomia/pull/268
- **IPE1-D04** · Crític · Soroll a 92 dB(A): els protectors auditius arriben «solo ahora», després de la resta de mesures · https://github.com/skinnydkd/profedeeconomia/pull/268
- **IPE1-D05** · Alt · Dinàmica 07: les vacances no quadren i s'oblida la indemnització per fi de contracte temporal · https://github.com/skinnydkd/profedeeconomia/pull/268
- **IPE1-D06** · Alt · «La empresa paga aproximadamente el triple»: és quasi el quíntuple (el PR no cita l'ID) · https://github.com/skinnydkd/profedeeconomia/pull/270
- **IPE1-D07** · Alt · Seguretat Social amb normativa anterior a 2024-2025: permís per naixement, subsidis i pràctiques · https://github.com/skinnydkd/profedeeconomia/pull/281
- **IPE1-D08** · Alt · Temps de treball, vacances, permisos i registre de jornada no s'expliquen enlloc · https://github.com/skinnydkd/profedeeconomia/pull/309
- **IPE1-D09** · Alt · Contractes formatius i període de prova: tres regles mal formulades · https://github.com/skinnydkd/profedeeconomia/pull/268
- **IPE1-D10** · Alt · La dinàmica 08 diu que l'accident es comunica «al SEPE» i cita la norma equivocada · https://github.com/skinnydkd/profedeeconomia/pull/268
- **IPE1-D11** · Alt · PRL: el llibre no cobrix criteris oficials del RA1 · https://github.com/skinnydkd/profedeeconomia/pull/309
- **IPE1-D14** · Alt · «El IRPF que pagas se pierde en el presupuesto general del Estado sin darte nada concreto a cambio» · https://github.com/skinnydkd/profedeeconomia/pull/281
- **IPE1-D15** · Mitjà · PRL: simplificacions que un tècnic bàsic hauria de matisar · https://github.com/skinnydkd/profedeeconomia/pull/309
- **IPE1-D16** · Mitjà · Tests endevinables: la bona és la B en el 81 % i la més llarga en el 98 % · https://github.com/skinnydkd/profedeeconomia/pull/324
- **IPE1-D17** · Mitjà · Xifres sense font sòlida o sobredimensionades · https://github.com/skinnydkd/profedeeconomia/pull/295
- **IPE1-D18** · Mitjà · Activitats de càlcul sense solucionari, i contingències mal etiquetades · https://github.com/skinnydkd/profedeeconomia/pull/310
- **IPE1-D19** · Baix · La calculadora no fa el que el llibre i les fitxes prometen · https://github.com/skinnydkd/profedeeconomia/pull/310
- **IPE1-D20** · Baix · Detalls diversos · https://github.com/skinnydkd/profedeeconomia/pull/310

### Unitats tocades

| Unitat | Què | PR |
|---|---|---|
| U1 · Repte de l'ocupabilitat | llibre, test | #310 #324 |
| U2 · Competències | test | #324 |
| U3 · DAFO i projecte professional | llibre, test, activitats | #295 #310 #324 |
| U4 · Sector productiu i perfil | llibre, test, activitats, repte | #310 #324 |
| U5 · Aprenentatge i identitat digital | llibre, test, activitats | #295 #310 #324 |
| ★ U6 · Contracte i drets | llibre, test, activitats | #268 #270 #309 #310 #324 |
| ★ U7 · Seguretat Social i vicissituds | llibre, test, activitats, repte, recurs | #268 #270 #281 #308 #309 #310 #324 |
| ★ U8 · Prevenció de riscos laborals | llibre, test, activitats, repte | #268 #295 #309 #310 #324 |
| ★ U9 · Salut psicosocial i benestar | llibre, test | #310 #324 |

Fora de les unitats: dinàmiques ★ 06, 07 i 08 (#268; la 06 també al #310), programació (#302, #310) i reforç i ampliació (#268, #270, #304, #309, #310).

### Mira sobretot

- ★ U8: a 92 dB(A), els protectors auditius són obligatoris **des del primer dia** (RD 286/2006: 80, 85 i 87 dB(A)). L'accident es comunica per Delt@ en 5 dies hàbils, i en 24 h a l'autoritat laboral si és greu (#268). Morts en accidents de treball el 2024: **796**, comptant les in itinere (INSST) (#295); R5 A5 i A6: queden dues mencions de «500» i la frase «la mayoría son evitables».
- ★ Indemnitzacions: salari diari de Yusuf amb les extres, **57,53 €**; solucionari de l'activitat 07, 4.027,10 €, 420 dies d'atur i 287,70 €; acomiadament objectiu procedent, 20 dies per any amb un màxim de 12 mensualitats; règim mixt de 45 i 33 dies, amb el topall de 720 dies (#268). R1 A3: el reforç, l'activitat 17 i les ampliacions encara fan 1.500 ÷ 30 = 50 €.
- ★ Cotització del treballador: **6,50 %** (4,70 + 1,55 + 0,10 + 0,15 de MEI) sobre la base amb la prorrata; 1.800 € × 6,50 % = 117,00 € i un líquid de 1.521,00 €; l'empresa paga quasi cinc vegades el que paga el treballador (#270). MEI fins a l'1,2 % el 2029 (#310).
- ★ U6, temps de treball: 40 h de mitjana anual, 9 ordinàries al dia i 12 h entre jornades (art. 34 ET); registre diari (art. 34.9); permís parental de 8 setmanes no retribuït (art. 48 bis) (#309). Període de prova: 1 mes en temporals de fins a 6 mesos, si el conveni no diu res (#268).
- ★ U7: permís per naixement de 19 setmanes (RDL 9/2025); subsidi reformat (RDL 2/2024), del 95 % al 80 % de l'IPREM; en les pràctiques del cicle, d'alta a la Seguretat Social encara que no cobres (DA 52a LGSS) (#281); R4, punt 9: estos dies no generen atur. Trasllat, 20 dies per any (màx. 12 mensualitats); modificació substancial, preavís de 15 dies i 20 dies per any (màx. 9 mensualitats) (#309).
- Tests nous (#324): U6, 1.600 € bruts amb el 6,50 % i un 10 % d'IRPF → **1.336 €**; vacances, 30 × 8/12 − 5 → **15 dies**; U7, 1.080 dies cotitzats → **360 dies** d'atur; acomiadament objectiu, 20.000 € que el topall de 12 mensualitats deixa en **18.250 €**.

### Queda obert

- El #309 deixa per a després del reequilibri dels tests (#324) uns ítems sobre registre de jornada, hores extra, vigilància de la salut i farmaciola; el #324 no els cita.
- La llista de permisos de l'art. 37.3 és incompleta a propòsit. L'art. 15 es presenta com a lògica preventiva i no com un orde legal estricte; si vols una altra formulació, és un canvi de text (#309).
- El recurs «nomina-cotizaciones» d'U7 carrega ara la calculadora de cost d'empresa. Per a tornar a la de brut a net, `componente: NominaESO` i el títol antic (#310).
- La regla d'U7 «120 dies d'atur per cada 360 cotitzats» simplifica la taula del SEPE, que va per trams de 180 dies. Va al PR de la segona passada (#324).
- El 60 % a partir del dia 181 de l'atur, que ja deia U7, s'ha mantingut al solucionari (#268).

## IPE II

### Troballes corregides

- **IPE2-D02** · Alt · El capstone qualifica de «muy sólida» una viabilitat que incomplix la regla dels 6 mesos · https://github.com/skinnydkd/profedeeconomia/pull/281
- **IPE2-D03** · Alt · Exercici U9 (CycloFix): una «tarifa plana» de 1.200 €/mes i una gestoria de 750 €/mes · https://github.com/skinnydkd/profedeeconomia/pull/281
- **IPE2-D04** · Alt · El test U2 continua atribuint a Jeff Bezos una frase que el llibre ja no li atribuïx · https://github.com/skinnydkd/profedeeconomia/pull/281
- **IPE2-D05** · Alt · L'ampliació d'eval1 usa un tipus de cotització del 6,35 % (el PR no cita l'ID) · https://github.com/skinnydkd/profedeeconomia/pull/270
- **IPE2-D07** · Mitjà · Tests: la bona és la B en el 93 % de les preguntes · https://github.com/skinnydkd/profedeeconomia/pull/327
- **IPE2-D08** · Mitjà · L'arbre de forma jurídica pregunta «¿Capital < 3.000 €?» en la unitat que explica l'SL d'1 € · https://github.com/skinnydkd/profedeeconomia/pull/275 i https://github.com/skinnydkd/profedeeconomia/pull/301
- **IPE2-D09** · Mitjà · Manual d'Oslo: quatre tipus d'innovació atribuïts a l'edició de 2018 · https://github.com/skinnydkd/profedeeconomia/pull/289
- **IPE2-D10** · Mitjà · Goleman i Belbin «demostraron»: afirmacions més fortes que l'evidència · https://github.com/skinnydkd/profedeeconomia/pull/289
- **IPE2-D11** · Mitjà · Els processos de selecció s'expliquen sense els drets de la persona candidata · https://github.com/skinnydkd/profedeeconomia/pull/291
- **IPE2-D12** · Mitjà · Xifres de mercat laboral i de mortalitat empresarial sense font verificable · https://github.com/skinnydkd/profedeeconomia/pull/295
- **IPE2-D13** · Baix · Pendents menors · https://github.com/skinnydkd/profedeeconomia/pull/310

### Unitats tocades

| Unitat | Què | PR |
|---|---|---|
| ★ U1 · Mercat laboral i selecció | llibre, test, repte | #291 #295 #310 #327 |
| U2 · Marca personal | test, recurs | #281 #310 #327 |
| U3 · Competències per a l'ocupació | llibre, test | #289 #327 |
| U4 · Mentalitat emprenedora | llibre, test | #289 #327 |
| U5 · Idea i oportunitat | test | #327 |
| U6 · Entorn i model de negoci | test | #327 |
| U7 · Màrqueting i validació | test | #327 |
| U8 · Emprenedoria social i design thinking | test | #327 |
| ★ U9 · Viabilitat i posada en marxa | llibre, test, activitats | #275 #281 #295 #301 #310 #327 |

Fora de les unitats: dinàmica 09 (#310), programació (#302) i reforç i ampliació (#270, #295, #310).

### Mira sobretot

- ★ U9, ReUña: coixí de 6 mesos de costos fixos, **1.440 €**; inversió total de 3.340 €; microcrèdit d'1.840 €. Els 1.320 € al mes són tota la renda de la titular, per davall de l'SMI prorratejat (1.424,50 €). Quan acaba la tarifa reduïda, quota d'uns 300 €, punt mort de **36 serveis** i uns 1.100 € al mes (#281). El test d'U9 pregunta estes tres xifres (#327).
- ★ U9, CycloFix: quotes dels 3 socis amb tarifa reduïda, 240 €; gestoria, 150 €; «Retribución mínima de los socios», 1.560 €; total, 3.200 € (#281). Només el model 036: el 037 es va suprimir el 3-02-2025 (Orde HAC/1526/2024) (#310).
- ★ U1: requadre «Lo que no te pueden preguntar (y qué hacer)»: embaràs, estat civil, religió, afiliació, orientació sexual, origen i salut; arts. 4.2.c i 17 ET i Llei 15/2022; art. 22 del RGPD; Reglament d'IA (annex III) (#291).
- U4: els quatre tipus d'innovació són de la 3a edició del Manual d'Oslo (2005); la de 2018 en fa dos, producte i procés de negoci (#289). U3: Goleman la va «popularitzar» i Belbin ho va «observar» (#289).
- U1 i U9: el mercat ocult és «la mayoría», sense percentatge; una part important de les empreses noves no arriba als cinc anys (INE) (#295). Dinàmica 09: amb 7 clients es perden 154 € al mes, 308 € en dos mesos (#310).

### Queda obert

- U9 diu que la inversió inicial habitual d'una pime és de 10.000-30.000 €, sense font. El mercat ocult no tindrà percentatge fins que hi haja una font que es puga consultar (#295).
- «Glovo» continua a U5, U6 i U9; la troballa no proposa cap canvi concret (#310).
- La quota d'uns 300 € després de la tarifa reduïda és aproximada (#281). Si la canvies al llibre, canvia també la tercera numèrica d'U9 (#327).
- U9 posa les subvencions i el crowdfunding entre els recursos aliens que «hay que devolver». Va al PR de la segona passada (#327).

## EEAE

### Troballes corregides

- **EEAE-D02** · Alt · Cost d'oportunitat: el repte 01 nega que la matrícula en forme part; el reforç d'EEAE i ECO1 diuen que sí · https://github.com/skinnydkd/profedeeconomia/pull/280
- **EEAE-D03** · Alt · Una dinàmica proposa un dècim de loteria de Nadal com a incentiu entre alumnes menors · https://github.com/skinnydkd/profedeeconomia/pull/280
- **EEAE-D04** · Mitjà · Economia conductual: afirmacions exagerades o sense l'avís de replicació · https://github.com/skinnydkd/profedeeconomia/pull/292
- **EEAE-D05** · Mitjà · La mateixa situació rep noms diferents a EEAE i ECO1, i hi ha definicions divergents · https://github.com/skinnydkd/profedeeconomia/pull/292
- **EEAE-D10** · Mitjà · Comptes i podcasts recomanats a menors que no s'han pogut verificar · https://github.com/skinnydkd/profedeeconomia/pull/297

### Unitats tocades

| Unitat | Què | PR |
|---|---|---|
| U1 · Economia i escassetat | llibre, repte | #280 #297 |
| U2 · Decisions i comportament | llibre, test, activitats, repte | #292 #297 |
| U4 · Entorn econòmic i financer | llibre, test | #292 #297 |
| U5 · Perfil emprenedor | llibre, test | #292 |
| U9 · Estratègia i models de negoci | llibre | #292 #297 |

Cap unitat ★. Fora de les unitats: dinàmiques (#280 la de la loteria, #292 la de l'app dels apunts), programació (#302) i ampliació de la 2a avaluació (#292).

### Mira sobretot

- U1 i repte 01: el cost d'oportunitat suma costos explícits i implícits; part implícita, **36.000 €**; total, **39.600 €** (#280). R4, punt 3: el deck i el glossari d'U1 encara diuen que no és un cost que isca en una factura.
- Dinàmica: una entrada de cine en lloc del dècim de loteria, i «efecto desplazamiento» (crowding out) en lloc d'«efecto multitarea» (#280).
- U2: The Economist va ser una elecció hipotètica d'un centenar d'estudiants del MIT; sense l'opció que ningú tria, la combinada passa de 84 a 32 de cada 100. Easterlin és una tesi discutida (Stevenson i Wolfers, 2008; Deaton, 2008) (#292).
- U4, U5 i U9: oferta agregada, el que les empreses estan disposades a produir; el BCE, «su herramienta principal es el tipo de interés»; Dweck, «sugieren» (Sisk i altres, 2018); Porter, dos tipus d'avantatge i tres estratègies genèriques (#292).
- «Mirar fora»: Our World in Data (U1), Behavioural Insights Team (U2), Finanzas para Todos (U4) i Strategyzer (U9); alguns són en anglés (#297).

### Queda obert

- EEAE-D06, l'abast de la capa de recursos importada d'Eco 1BACH i EDMN, és una decisió de programació (#292).
- La lectura d'Ariely es manté amb un avís de replicació; llevar-la, com a Eco 1BACH, és una línia (#292).

## GPE

### Troballes corregides

- **GPE-D03** · Alt · Capital de l'SL: la taula d'U3 diu 1 € i l'arbre de la mateixa pàgina diu 3.000 € · https://github.com/skinnydkd/profedeeconomia/pull/275
- **GPE-D04** · Alt · Dinàmiques 03 i 05: tarifa plana de 291 €, ingressos inflats, falsa alternativa notari/PAE i un sou per davall de l'SMI · https://github.com/skinnydkd/profedeeconomia/pull/280
- **GPE-D06** · Mitjà · Dinàmica 06 (viver): dades que no quadren i punt mort arredonit a la baixa · https://github.com/skinnydkd/profedeeconomia/pull/289
- **GPE-D07** · Mitjà · «Las cotizaciones financian la sanidad» (U5, deck i test) · https://github.com/skinnydkd/profedeeconomia/pull/282
- **GPE-D08** · Mitjà · Ancoratge del lienzo: la fase 2 es contradiu i l'activitat 03 encara parla de la SLNE · https://github.com/skinnydkd/profedeeconomia/pull/296
- **GPE-D10** · Mitjà · VAN i TIR a la fase 4 quan el llibre els exclou, i recursos amb afirmacions errònies · https://github.com/skinnydkd/profedeeconomia/pull/304
- **GPE-D12** · Mitjà · Tests: la clau és la segona opció en el 76 % i la més llarga en el 87 % · https://github.com/skinnydkd/profedeeconomia/pull/323
- **GPE-D14** · Mitjà · Seguretat alimentària i legalitat absents en projectes d'alimentació, i un missatge erroni sobre la PESTEL · https://github.com/skinnydkd/profedeeconomia/pull/304

### Unitats tocades

| Unitat | Què | PR |
|---|---|---|
| U1 · Emprendre i innovar | llibre, test | #289 #323 |
| U2 · De la idea a l'oportunitat | test | #323 |
| U3 · Decisions per a arrancar | llibre, test, activitats, recurs | #271 #275 #288 #296 #304 #310 #323 |
| U4 · Aprovisionament, producció i comercial | test | #323 |
| ★ U5 · Recursos humans | llibre, test, recurs | #270 #282 #304 #308 #323 |
| U6 · Comptabilitat, fiscalitat i finançament | test, activitats | #280 #323 |
| U7 · Impacte social i ambiental | test | #323 |

Fora de les unitats: dinàmica 03 (#275, #280), dinàmica ★ 05 de la primera contractació (#280), dinàmica 06 del viver (#289), dinàmica de l'orxata (#304), quadern de projecte (#296 fase 2, #304 fase 4) i programació (#302).

### Mira sobretot

- ★ U5: les cotitzacions paguen pensions, atur i altres prestacions, no la sanitat; l'opció correcta del test és «pensiones, desempleo y bajas por enfermedad» (#282). La quota de l'empresa figura en la nòmina com a aportació, però no es descompta del sou (#304, #308). Test U5: 1.600 € bruts, 104 € de Seguretat Social (6,50 %) i 144 € d'IRPF → **1.352 €** (#323).
- ★ Dinàmica 05: sou a temps complet de 1.221 € en 14 pagues, amb un cost d'empresa d'uns 1.880 €; el contracte per a la pràctica professional cobra el del seu grup, mai menys de l'SMI proporcional (art. 11.3 ET); els falsos autònoms els detecta la Inspecció de Treball (#280). R4, punt 4: el conveni pot fixar una retribució pròpia per a este contracte.
- Dinàmica 03: tarifa plana de **80 €/mes**, també el 2026 (RDL 3/2026); ingressos amb el 40 % de premium, 204 €; «estatuts a mida» o «estatuts tipus per CIRCE», amb escriptura notarial en els dos casos (#280).
- U3: SL des d'1 € (Llei 18/2022) (#275); la Marina estalvia 4.500 € a l'any, no 6.000 € (#288). Dinàmica 06: costos variables d'1.408 €, resultat d'1.752 € i punt mort de **110 plantes** (#289).
- Projecte i orxata: el VAN i la TIR són una extensió opcional a la fase 4; per a vendre menjar cal registre o comunicació sanitària, formació en manipulació d'aliments, cadena de fred i permís municipal, i una cuina particular no servix com a obrador (#304).

### Queda obert

- Les activitats 04 («¿toda publicidad vale para vender?») i 06 (economia submergida) estan publicades en valencià però no en castellà: el fitxer castellà no té `estado`. Publicar-les és decisió teua (#299).
- L'etiqueta del saber «El modelo de negocio: lienzo Canvas (B1)» no s'ha comprovat amb el decret (#296).
- Error del llibre d'U4: la regla pràctica del control d'estocs diu que es llance la comanda en arribar al mínim de seguretat. Va al PR de contingut de GPE (#323).
- Un cas valencià nou per a GPE U3, perquè la Marina siga només d'EDMN (#288).
- El cost d'empresa de la dinàmica 05 és aproximat: depén del tipus d'AT/EP (#280).

## CJD

### Troballes corregides

- **CJD-D01** · Crític · El debat vinculat a U3 diu que suprimir el Senat exigiria la reforma agreujada de l'art. 168 · https://github.com/skinnydkd/profedeeconomia/pull/278
- **CJD-D05** · Mitjà · «Elusión fiscal … Es legal»: el que és legal és l'economia d'opció · https://github.com/skinnydkd/profedeeconomia/pull/287
- **CJD-D06** · Mitjà · No hi ha cap apartat sobre els drets fonamentals i les seues garanties · https://github.com/skinnydkd/profedeeconomia/pull/310
- **CJD-D07** · Mitjà · «El Impuesto sobre Sociedades … no es progresivo» · https://github.com/skinnydkd/profedeeconomia/pull/287
- **CJD-D08** · Baix · Dret d'accés a la informació pública: no cal ser major d'edat · https://github.com/skinnydkd/profedeeconomia/pull/310
- **CJD-D09** · Baix · Referències creuades i detalls · https://github.com/skinnydkd/profedeeconomia/pull/310
- **CJD-D10** · Baix · Dinàmica 05 (gelateria): dues ocasions perdudes amb una treballadora de 17 anys · https://github.com/skinnydkd/profedeeconomia/pull/310

### Unitats tocades

| Unitat | Què | PR |
|---|---|---|
| U2 · Ciutadania global i UE | llibre | #310 |
| U3 · Constitució i poders de l'Estat | llibre | #310 |
| ★ U5 · Dret laboral i Seguretat Social | llibre | #308 #310 |
| ★ U6 · Dret tributari i sistema fiscal | llibre | #287 |

El diagrama de la ruta de reclamació laboral que es veu a U5 va canviar al #268. Fora de les unitats: dinàmica 05 de la gelateria (#310).

### Mira sobretot

- ★ U5: cotitzar dona dret a prestacions (atur, incapacitat temporal i jubilació), no a la sanitat, que és universal i es paga amb impostos (Llei 16/2003 i RDL 7/2018); la quota patronal figura en la nòmina (#308). «Tribunal de Instancia» en lloc de «Juzgado de lo Social» (#310). R1 A1: el text encara diu que a la Inspecció se la pot denunciar de forma anònima.
- ★ U6: economia d'opció (legal), elusió (Hisenda la pot requalificar, arts. 15 i 16 LGT) i evasió; delicte fiscal a partir de 120.000 € defraudats per impost i any. IS de 2026: 25 % general, 23 % reduïda dimensió, 19 % i 21 % microempreses, 15 % nova creació (#287). R4, punt 13: la simulació (art. 16) ja és ocultar, és a dir, evasió.
- U3, apartat nou «Tus derechos y cómo se protegen»: els tres nivells de protecció de l'art. 53, un cas d'empara, el Defensor del Poble i el Síndic de Greuges, i limitar i suspendre drets (arts. 55 i 116, LO 4/1981; STC 148/2021); la unitat passa de 30 a 33 diapositives. L'accés a la informació pública no té edat mínima (art. 12, Llei 19/2013) (#310).
- Debat del Senat: via ordinària de l'art. 167, tres cinquens de cada cambra, i referèndum només si ho demana una desena part de diputats o senadors (#278).
- Dinàmica de la gelateria: decisió nova sobre l'SMI i el consentiment dels pares amb 17 anys (art. 7.b ET); quatre decisions i 20-25 minuts (#310).

### Queda obert

- Llig sencer l'apartat nou d'U3. Els articles de la Constitució, la LO 4/1981, l'ET, la LOPDGDD i el RDL 2/2023 s'han citat sense consultar-los ara al BOE (#310).
- CJD-D02, CJD-D03 i CJD-D04: vegeu «Decisions».

## Seccions transversals

### Debats

Troballes corregides:
- **DEB-D01** · Crític · El procediment per a suprimir el Senat és el de l'art. 167, no l'agreujat · https://github.com/skinnydkd/profedeeconomia/pull/278
- **DEB-D02** · Alt · El debrief i el criteri «Uso de evidencia» no tenen evidència darrere · https://github.com/skinnydkd/profedeeconomia/pull/338, https://github.com/skinnydkd/profedeeconomia/pull/339 i https://github.com/skinnydkd/profedeeconomia/pull/340
- **DEB-D03** · Alt · L'argument sobre la CSRD i els fons ESG està desfasat a setembre de 2026 · https://github.com/skinnydkd/profedeeconomia/pull/278
- **DEB-D04** · Mitjà · Jornada de 4 dies: l'exemple d'Islàndia és imprecís i falta el context espanyol · https://github.com/skinnydkd/profedeeconomia/pull/290
- **DEB-D05** · Mitjà · Successions: l'argument de l'empresa familiar ignora la reducció del 95 % · https://github.com/skinnydkd/profedeeconomia/pull/287
- **DEB-D06** · Mitjà · Grans fortunes: el context no diu que Espanya ja té dos impostos sobre la riquesa · https://github.com/skinnydkd/profedeeconomia/pull/287
- **DEB-D07** · Mitjà · Fases clau que depenen de materials que no es donen · https://github.com/skinnydkd/profedeeconomia/pull/312
- **DEB-D08** · Mitjà · Rúbrica genèrica sense descriptors de nivell · https://github.com/skinnydkd/profedeeconomia/pull/322
- **DEB-D09** · Mitjà · Competències buides i «nivel» incoherent amb els ponts (la part del nivell) · https://github.com/skinnydkd/profedeeconomia/pull/312
- **DEB-D11** · Baix · IA i ocupació: premissa discutible presentada com a fet · https://github.com/skinnydkd/profedeeconomia/pull/312

Peces tocades: Senat (#278, #312), RSC o greenwashing (#278), elusió fiscal, grans fortunes i successions (#287), jornada de 4 dies (#290), llei injusta, criptomonedes, IA i ocupació, publicitat a menors, salari mínim i renda bàsica (#312).

Mira sobretot:
- Senat: art. 167, tres cinquens de cada cambra, i el Senat hauria de votar la seua supressió. CSRD: Òmnibus (Directiva (UE) 2026/470), només empreses de més de 1.000 treballadors i 450 M€ de facturació (#278).
- Successions: reducció del 95 % (Llei 29/1987, art. 20.2.c); una herència de 800.000 € pot pagar a Astúries fins a 100.000 € més que a Andalusia o Galícia. Grans fortunes: 623 M€ d'unes 12.000 persones el primer any, quasi el 90 % a Madrid (#287).
- Jornada: 40 h de mitjana anual (art. 34 ET) i rebuig de les 37,5 h al setembre de 2025 (#290). Llei injusta: Rosa Parks (Montgomery, 1955), multa i recurs (#312).

Queda obert:
- DEB-D10 (enllaços entre debats duplicats) queda per a una altra tanda (#312).
- Nou debats tenen `fp` al nivell sense cap pont a FP; pot ser intencionat (#312).
- Els arts. 90, 155 i 167 de la Constitució, l'SMI de 2018 a 2026, el MEEF i el SURE s'han citat sense consultar-los ara (#312). Les bonificacions autonòmiques canvien sovint (#287).

### Dinàmiques

Troballes corregides:
- **DIN-D01** · Crític · Doble subhasta: l'excedent total màxim és 32 €, no 24 € · https://github.com/skinnydkd/profedeeconomia/pull/270
- **DIN-D02** · Crític · Monopolista: la taula marca malament els màxims · https://github.com/skinnydkd/profedeeconomia/pull/270
- **DIN-D03** · Crític · Cadena de valor: tres totals diferents i un debrief amb xifres que no són les de la fitxa · https://github.com/skinnydkd/profedeeconomia/pull/270
- **DIN-D04** · Crític · Avantatge comparatiu: el País A sí que pot cobrir l'objectiu en autarquia · https://github.com/skinnydkd/profedeeconomia/pull/270
- **DIN-D06** · Mitjà · «Plusvalía» sense definir i una «Idea clave» normativa · https://github.com/skinnydkd/profedeeconomia/pull/290
- **DIN-D07** · Mitjà · Mercat contra planificació: el disseny decidix el guanyador abans de jugar · https://github.com/skinnydkd/profedeeconomia/pull/312
- **DIN-D08** · Mitjà · Repartiment fiscal: un municipi no pot tocar l'IRPF, l'IVA ni crear un impost de patrimoni · https://github.com/skinnydkd/profedeeconomia/pull/287
- **DIN-D09** · Mitjà · Renda bàsica: una font que no es pot verificar i una comparació de cost enganyosa · https://github.com/skinnydkd/profedeeconomia/pull/290
- **DIN-D12** · Mitjà · Dinàmiques de selecció de personal sense el marc legal de no discriminació · https://github.com/skinnydkd/profedeeconomia/pull/291
- **DIN-D13** · Baix · Petites incoherències de càlcul i redacció · https://github.com/skinnydkd/profedeeconomia/pull/312

Mira sobretot:
- Doble subhasta, 32 €; monopolista, maximitza el benefici i la taula és de 12 compradors; cadena, els valors afegits sumen 25 €; avantatge comparatiu, el país B necessitaria 11,25 h, amb solucionari nou (#270).
- Pastís fiscal: Econovilla és un xicotet país imaginari; un ajuntament cobra IBI, vehicles, plusvàlua municipal i taxes; la demanda (120 M€) passa el pressupost (100 M€) en un 20 % (#287). Renda bàsica: uns 500.000 M€ bruts a l'any, quasi el 30 % del PIB (#290).
- Mercat contra planificació: fitxes desiguals (10, 25 o 40) i un sol «Medicament» (#312). Entrevista i procés de selecció: les preguntes que no es poden fer (#291).

Queda obert: DIN-D10 (instruments d'avaluació i pautes DUA) i DIN-D11 (versions duplicades) queden per a una altra tanda (#312).

### Emprenedoria

Troballes corregides:
- **EMP-D01** · Alt · Eixides al carrer amb menors sense cap pauta de seguretat ni d'autorització · https://github.com/skinnydkd/profedeeconomia/pull/283
- **EMP-D02** · Mitjà · L'Sprint ESO acaba en un dossier que demana números que no ha calculat · https://github.com/skinnydkd/profedeeconomia/pull/312
- **EMP-D03** · Mitjà · La venda real no parla de seguretat alimentària, al·lèrgens ni venda en línia · https://github.com/skinnydkd/profedeeconomia/pull/304
- **EMP-D04** · Mitjà · Ponts curriculars escassos i esbiaixats cap a EDMN i GPE · https://github.com/skinnydkd/profedeeconomia/pull/315
- **EMP-D05** · Mitjà · Exemples d'empreses reals amb afirmacions errònies o sense font · https://github.com/skinnydkd/profedeeconomia/pull/298
- **EMP-D06** · Mitjà · «Dirige la empresa»: invertir en eficiència mai compensa amb tres rondes, i ningú ho diu · https://github.com/skinnydkd/profedeeconomia/pull/312
- **EMP-D07** · Baix · Primera persona del singular, xifres de fases i itineraris sense traduir · https://github.com/skinnydkd/profedeeconomia/pull/312
- **EMP-D08** · Baix · ExcusasPro: un model de negoci d'engany · https://github.com/skinnydkd/profedeeconomia/pull/312

Mira sobretot:
- ★ «Antes de salir» (fase 4, entrevista i repte del café): en parelles o en grup, en llocs públics i de dia, amb autorització del centre i de les famílies en horari lectiu, i sense dades personals; a l'entrevista, mai a un domicili particular (#283).
- ★ «Lanza, valiente»: els 14 al·lèrgens de declaració obligatòria (Reglament (UE) 1169/2011); per internet, ho gestiona una persona adulta i hi ha 14 dies de desistiment (#304).
- Exemples: Spotify inverteix molt en màrqueting; Netflix té pla amb anuncis des de 2022; Hawkers va començar el 2013 a Elx amb 27 ulleres comprades amb 300 € (#298). «Dirige la empresa»: la màquina tarda 1,9 rondes a pagar-se (#312). Hi ha 27 ponts nous entre les fases i les unitats (#315).

Queda obert: el full d'autorització no s'ha creat, perquè cada centre té el seu (#283); els camps `fuente` i `consultado` per als exemples són un canvi d'esquema (#298); les competències dels ponts estan buides, la fase 6 només enllaça Eco 4ESO U10 i «Lanza valiente» no té ponts (#315).

### Olimpíada

Troballes corregides:
- **OLI-D01** · Crític · EPA i atur registrat: el banc i la fitxa es contradiuen, i la clau del banc és falsa · https://github.com/skinnydkd/profedeeconomia/pull/270
- **OLI-D02** · Crític · Altres ítems del banc amb clau o explicació errònia · https://github.com/skinnydkd/profedeeconomia/pull/270
- **OLI-D03** · Alt · L'objectiu del BCE és el d'abans de 2021 i la política monetària s'atura el 2023 · https://github.com/skinnydkd/profedeeconomia/pull/278
- **OLI-D04** · Alt · La resposta correcta no és mai la «d»: ho resol el QuizPlayer, segons el #285 · https://github.com/skinnydkd/profedeeconomia/pull/269 i https://github.com/skinnydkd/profedeeconomia/pull/285
- **OLI-D05** · Alt · El format d'una fase local es presenta com «l'examen» · https://github.com/skinnydkd/profedeeconomia/pull/283
- **OLI-D06** · Mitjà · Card i Krueger: la pauta diu 1994 i el monopsoni queda imprecís · https://github.com/skinnydkd/profedeeconomia/pull/286
- **OLI-D08** · Mitjà · Lectures: un recurs no verificable, comentaris inexactes i cap manual tècnic · https://github.com/skinnydkd/profedeeconomia/pull/305
- **OLI-D09** · Mitjà · Textos de la Part III poc actuals per al curs 2026-27 · https://github.com/skinnydkd/profedeeconomia/pull/312

Mira sobretot:
- Fitxa 04: objectiu del 2 % simètric des de 2021; tipus de dipòsit negatiu entre 2016 i 2022 (fins al −0,5 %); pujades fins al 4 %, baixades fins al 2 % i pujades de 2026 (2,25 % al juny i 2,50 % al setembre) (#278).
- Card i Krueger: Nova Jersey va apujar el salari mínim l'1 d'abril de 1992, de 4,25 a 5,05 $ l'hora; l'estudi és de 1994 (#286). Banc: l'EPA sol donar més aturats que l'atur registrat (#270).
- «Cómo es el examen» és la fase local valenciana; «12 bloques»; nivell de 2n de Batxillerat (#283). Textos: aranzels de 2025 (50 % a l'acer i l'alumini, sostre del 15 % en l'acord UE-EUA) i SMI de 735,90 € (2018) a 1.221 € (2026) (#312).

Queda obert: OLI-D05, el bloc nou d'inversió i productivitat (VAN, TIR, productivitat, període mitjà de maduració), no s'ha fet (#283); els tipus del BCE s'han de revisar abans de cada convocatòria (#278).

### Projectes

Troballes corregides:
- **PRO-D01** · Alt · Cap projecte diu què treballa de l'altra matèria segons el seu currículum · https://github.com/skinnydkd/profedeeconomia/pull/341 i https://github.com/skinnydkd/profedeeconomia/pull/342
- **PRO-D02** · Mitjà · Guions de 5-6 sessions sense materials per a l'alumnat · https://github.com/skinnydkd/profedeeconomia/pull/341
- **PRO-D03** · Mitjà · «Del trueque a las criptomonedas» presenta la seqüència bescanvi → diner com a fet històric · https://github.com/skinnydkd/profedeeconomia/pull/290
- **PRO-D04** · Mitjà · Interés compost sense inflació, risc ni comissions · https://github.com/skinnydkd/profedeeconomia/pull/290
- **PRO-D05** · Baix · Una frase normativa presentada com a veritat econòmica · https://github.com/skinnydkd/profedeeconomia/pull/312

Mira sobretot: 50 € al mes al 5 % durant 30 anys fan **41.613 €**; amb una comissió de l'1 %, uns 34.700 €; amb una inflació del 2 %, compren el que hui uns 23.000 € (#290). Bescanvi: Humphrey (1985) i Graeber (2011) (#290). Filosofia 02: Rawls i Nozick (#312).

Queda obert: res d'esta secció.

### Jocs

Troballes corregides:
- **JOC-D01** · Crític · Econopoly aplica el tipus del tram a tot el patrimoni: el mite del «salt de tram» · https://github.com/skinnydkd/profedeeconomia/pull/273
- **JOC-D02** · Alt · Stonks: dades errònies i «lliçons» d'inversió sense matisos (en part) · https://github.com/skinnydkd/profedeeconomia/pull/285
- **JOC-D03** · Alt · Econrisk: avantatge comparatiu mal definit i Keynes «demostra» (en part) · https://github.com/skinnydkd/profedeeconomia/pull/285
- **JOC-D04** · Alt · El concurs propi s'anomena «Olimpiadas de Economía» (en part: ja no promet premis i diu que no és l'oficial) · https://github.com/skinnydkd/profedeeconomia/pull/312
- **JOC-D05** · Alt · Nom i institut de menors en un rànquing públic (en part: el formulari demana un àlies) · https://github.com/skinnydkd/profedeeconomia/pull/312
- **JOC-D07** · Mitjà · Banc de Juegos Económicos: biaix de posició, fonts desquadrades i tres imprecisions · https://github.com/skinnydkd/profedeeconomia/pull/312
- **JOC-D09** · Mitjà · Assegurats: les primes són més baixes que la pèrdua esperada · https://github.com/skinnydkd/profedeeconomia/pull/293
- **JOC-D10** · Baix · Errates i eslògans imprecisos · https://github.com/skinnydkd/profedeeconomia/pull/312
- **JOC-D11** · Baix · Jocs amb mòbil sense avís de la normativa de cada centre · https://github.com/skinnydkd/profedeeconomia/pull/312

Mira sobretot:
- Econopoly: 5 % dels primers 500 €, 10 % fins a 1.000 € i 15 % de la resta; 1.000 € paguen 75 € i 800 €, 55 € (#273).
- Assegurats: primes de 40, 85, 75, 100 i 115 €, la pèrdua esperada més un 20 % (#293). Stonks: Bitcoin −57,5 % el 2014 i +34,5 % el 2015; el BCE posa per primera vegada un tipus negatiu al juny de 2014 (#285).
- Banc de preguntes: la revolving duplica el deute en uns tres anys si no es paga res; 17 preguntes citen ara les unitats noves d'Eco 4ESO (#312); dues preguntes passen al 6,50 % (#270).

Queda obert: JOC-D02, sèries noves (bons amb rendibilitat total i el 2022 negatiu; IBEX amb dividends o S&P en euros) (#285); JOC-D03, una targeta per facció amb tres idees i una pregunta de debrief (#285); JOC-D08, la guia docent (#312); a Assegurats, una ronda amb franquícia és una regla nova que no s'ha fet (#293). JOC-D04, JOC-D05 i JOC-D06: vegeu «Decisions».

### Eines docents

Troballes corregides:
- **EIN-D02** · Mitjà · La calculadora de qualificacions proposa per defecte «Examen 50 / Trabajo 30 / Actitud 20» · https://github.com/skinnydkd/profedeeconomia/pull/312
- **EIN-D03** · Mitjà · Les plantilles guarden dades d'alumnat sense cap avís · https://github.com/skinnydkd/profedeeconomia/pull/305
- L'IRPF de la calculadora de nòmina i del simulador de la renda el corregix el #271 (CODE-INT-02); el #271 no cita EIN-D01.

Mira sobretot: el registre d'aula, les mesures DUA i el pla de reforç diuen que les dades es queden al navegador, demanen «Iniciales o código» i recomanen «Vaciar» en acabar (#305). La calculadora de qualificacions proposa una fila per competència, amb 40/35/25 per defecte (#312).

Queda obert: el botó «Borrar datos» a part no s'ha fet, perquè «Vaciar» ja ho fa (#305). EIN-D04: vegeu «Decisions».

## Codi

Un PR per línia, amb què provar a mà.

- **#269 · QuizPlayer** (CODE-INT-01, CODE-INT-03, VIS-LEC-08, VIS-LEC-09). En una numèrica escriu «12,5», «-3» i «1.500»: el camp no canvia el que escrius i «Confirmar» només s'activa amb un número complet. Fes el test dues vegades: després de tornar a intentar-ho, l'ordre de les opcions canvia. A 390 px, sense scroll lateral. Al banc de l'Olimpíada, canvia de bloc a mitja partida: torna a «Pregunta 1 de 13».
- **#271 · Calculadores fiscals** (CODE-INT-02, CODE-INT-08, CODE-INT-11, CODE-INT-12). Nòmina amb 6.000 €/mes: files de solidaritat i d'altres despeses, i l'avís de base màxima (5.101,20 €/mes). Declaració: el preset «Sueldo medio, retuvo de más» ix a tornar 357 €.
- **#272 · i18n** (CODE-WEB-01, CODE-WEB-02, CODE-WEB-05, CODE-WEB-06, CODE-WEB-10). /ca/fopp-4eso/actividades-dinamicas/05-…/ ha d'obrir amb «Quantes modalitats de Batxillerat…» i botons en valencià; /ca/edmn-2bach/tests/ és el hub, no un salt al castellà; el títol de /ca/eco-1bach/libro/01-…/ acaba en «— Economia 1r Batxillerat».
- **#273 · Jocs Econòmics i Econopoly** (CODE-SRV-05, CODE-SRV-06, JOC-D01). A /jocs-economics/, deixa passar el temps: ix «Fallaste» i no es marca cap opció; en dues partides, l'ordre de les opcions canvia. A /juegos/econopoly/, IMPUESTO amb uns 800 €: pagues 55 €.
- **#274 · Business Game** (CODE-INT-07, CODE-SRV-07, CODE-SRV-08, CODE-SRV-09). Fes una partida al preview de Vercel: amb un preu d'1 € ha d'eixir «El precio no puede bajar de 4,5 € por unidad»; un nom de més de 60 caràcters es rebutja; «Cerrar la ronda» dues vegades de pressa dona una 409.
- **#275 · Diagrames** (VIS-LEC-06). Gràfic de punt mort (EDMN U7 o Eco 4ESO U10): el «4.000» ja no cau a l'altura dels costos fixos, i mira on queda «PÉRDIDA» (R2 A7). L'arbre de forma jurídica pregunta «¿Poco riesgo de deudas?».
- **#277 · Disseny** (VIS-NAV-01, VIS-NAV-06, VIS-NAV-07, VIS-LEC-12, VIS-LEC-13, CODE-WEB-03, CODE-WEB-04). A 1024 i 880 px, obri «Otros» i baixa en diagonal fins a un enllaç: no es tanca. Els botons de descàrrega porten text blanc; /herramientas/, /proyectos/ i /olimpiada/ ja no tenen franja de color; «Lo esencial» no porta ✱.
- **#285 · Stonks i Econrisk**. Juga Stonks fins al final: davall de les lliçons ix la nota sobre les dades (també a /ca/). Econrisk amb els neoclàssics: la lliçó cita Ricardo i el cost d'oportunitat.
- **#293 · Assegurats**. A /juegos/seguros/, primes de 40, 85, 75, 100 i 115 €; amb 350 € d'ingressos per ronda, qui ho assegura tot (415 €) perd 65 € per ronda.
- **#305 · Plantilles**. /generadores/registro-aula/, /generadores/medidas-dua/ i /generadores/plan-refuerzo/: l'avís de privacitat i el camp «Iniciales o código».
- **#307 · PDF**. L'script de quaderns ja no s'atura per CJD, que no té activitats. Obri el llibre d'Eco 4ESO (U5) i el quadern d'Eco 1BACH, que passa de 102 a 179 pàgines. Els llibres es van tornar a generar al #345.
- **#310 · Calculadora de nòmina d'ESO**. El preset del cambrer és a mitja jornada, perquè 900 € a jornada completa queden per davall de l'SMI.
- **#312 · Eines i jocs** (EIN-D02, JOC-D04, JOC-D05, JOC-D10). La calculadora de qualificacions porta una fila per competència i 40/35/25; Jocs Econòmics demana un àlies i ja no parla de premis; Stonks diu «Has ganado al Mercado».
- **Guardes noves**, sense res a provar a mà: `datos-obsoletos.test.ts` (#276, #280, #301, #304, #308, #310), `frontmatter-bessons.test.ts` (#299), `deck-creditos.test.ts` (#300) i `debates-nivel.test.ts` (#312). Avisen si torna una dada substituïda o si els bessons ES/CA divergixen.

## Segona passada

R1–R6 són sis revisions independents dels PR #268 a #306, fetes sobre `main` a 49682927 (ja amb #307–#312 i #315). No revisen #307–#327.

- R1 (#268, #270): 12 problemes. R2 (#271, #275, #276, #282, #286, #288, #294): 14. R3 (#278, #279, #284, #292, #293, #297, #300, #302, #306): 27. R4 (#280, #281, #283, #287, #289, #290): 23. R5 (#291, #295, #296, #298, #299, #301, #303, #304, #305): 23. R6 (#269, #272, #273, #274, #277, #285): 13.
- En total, 112 entrades i 111 problemes diferents: el peu de l'arbre d'EDMN U2 surt a R2 i a R5. Sis toquen dues matèries i compten a les dues.
- Quasi tots són restes: una frase que el PR va corregir en una peça i no en una altra, una xifra que ja té una dada més nova o un error de valencià.

| Matèria | Problemes | Alts |
|---|---:|---:|
| EDMN 2BACH | 19 | 0 |
| Eco 1BACH | 26 | 2 |
| Eco 4ESO | 12 | 0 |
| FOPP 4ESO | 10 | 2 |
| Taller Eco 3ESO | 2 | 0 |
| IPE I | 7 | 0 |
| IPE II | 4 | 0 |
| EEAE | 4 | 0 |
| GPE | 7 | 0 |
| CJD | 2 | 0 |
| Transversals (debats 1, dinàmiques 1, emprenedoria 1, Olimpíada 2, jocs 3, eines 1) | 9 | 0 |
| Codi (calculadores, QuizPlayer, jocs, Business Game, menú) | 15 | 1 |

Els de gravetat alta:
- Eco 1BACH U7: tres creixements per a 2024 (2,7 %, 3,2 % i 3,7 %) entre el cas, el text i el deck; la sèrie de l'INE del #284 diu 3,7 % (R3 A12).
- Eco 1BACH U2: el deck i la dinàmica 02 encara diuen que el Concorde va volar «27 años perdiendo dinero», el mite que el #292 corregix al llibre (R3 A20).
- FOPP U1: Buenafuente com a «Ejemplo real», amb un ofici d'electricista i una entrevista de La Vanguardia que no s'han trobat; U4, Andrea Solà sense una font que existisca (R5 A4, col·lateral del #291).
- FOPP U9: el 70 % de LinkedIn i el 60-70 % del mercat ocult, atribuïts a InfoJobs–ESADE i Adecco, al llibre, al test i al repte (R5 A10, col·lateral del #295).
- Jocs Econòmics: la pantalla de resultat mostra l'enunciat i les opcions de la pregunta següent, amb la verda de l'anterior (R6 A6; ja passava abans del #273).

Les mitjanes que toquen unitats ★ ja les tens assenyalades a «Mira sobretot» de cada assignatura (R1 A1, R1 A3, R2 A2, R2 A9, R4 punts 4, 9, 13 i 16, R5 A5 i A6).

Els problemes de R1–R6 s'han corregit en PR nous, un per assignatura o àmbit. Cada PR diu, entre parèntesis, quin punt de R1–R6 corregix.

| PR | Àmbit | Estat |
|---|---|---|
| #328 | Eco 1BACH, amb Eco 4ESO U2 i U9 | fusionat |
| #329 | EDMN, amb la frase del PMV al glossari de GPE U3 | fusionat |
| #331 | GPE, amb targetes de recursos d'EDMN U1, U9 i U10 i d'IPE II U9 | fusionat |
| #332 | ESO, FP, CJD i seccions transversals | fusionat |
| #333 | EEAE | fusionat |
| #334 | Calculadores | fusionat |
| #335 | Plantilles, SEO, esquema del contingut, QuizPlayer i RetoPlayer | fusionat |
| #337 | GPE U3: la definició del PMV, la que vas aprovar | fusionat |
| #343 | Coherència de dades entre assignatures | fusionat |
| #330 | Jocs, Jocs Econòmics i Business Game (R6 A6–A10) | fusionat |
| #336 | Detalls visuals de R6 (A11–A13) | fusionat |

### Què tanquen d'esta guia

- **EDMN**: el balanç d'Inditex quadra (amb el dataset simplificat) i l'endeutament té una sola definició. Els errors del llibre que van eixir en fer els tests (el 6,47 %, la «Unidad 6» i les dues «cuota de mercado») estan corregits (#329).
- **Eco 4ESO**: la deducció de la DA 61a ja és a la calculadora de nòmina i al simulador de la renda (#334).
- **FOPP**: Andrea Solà (U4) i Buenafuente (U1) són ara casos il·lustratius (#332). La sentència de Mercadona d'U8 continua sense número.
- **Taller**: l'IVA del tiquet del súper i la font de Bizum (#332).
- **IPE I**: la durada de l'atur va per trams de 180 dies (#332).
- **IPE II**: les subvencions i el crowdfunding de recompensa ja no estan entre els recursos que «hay que devolver», i el mercat ocult ja no porta percentatge (#332).
- **EEAE**: l'abast d'EEAE-D06, amb l'opció conservadora (#333).
- **GPE**: la regla del punt de comanda d'U4 (#331). La Marina de GPE U3 quadra ara amb EDMN U2 (#331); el cas valencià nou queda com a decisió teua.

## Troballes transversals d'última hora

PR de l'1 d'octubre. Tots són contingut nou o corregit i han de passar la teua revisió manual.

- **Debats, evidència i dossier de dades (DEB-D02)**: #338, #339 i #340. Els 26 debats acaben amb un bloc per al professorat, «Para el debrief: qué dice la evidencia», amb 4-5 punts, cadascun amb font i any, i amb un «Dossier de datos» per a l'alumnat amb 4-5 xifres oficials. Mira sobretot les línies «Para cerrar» (els debats 01-03 de Dret no en porten), el veto de la llei d'amnistia com a exemple del Senat, les dades que caduquen (MASC, directiva de plataformes, publicitat a menors, preu del bitcoin) i les tres fonts no oficials del dossier de comerç (Morningstar, B Lab Spain i FEPEX).
- **Projectes interdisciplinaris (PRO-D01 i PRO-D02)**: el #341 (contingut) afig a cada projecte una fitxa d'equip, fonts de dades, referències exactes dels textos i descriptors de quatre nivells per a la rúbrica, i quadra el `nivel` amb els ponts: sis projectes guanyen ponts a Eco 4ESO i filosofia/02 queda només a Batxillerat. El #342 (visual) afig el camp `materia_socia` i el bloc «Qué se trabaja de…» amb les competències i els sabers de la matèria sòcia (RD 217/2022 i 243/2022).
- **Coherència de dades entre assignatures**: el #343 posa Mercadona (41.858 M€, 115.000 persones, 780 M€ en primes, 1.672 supermercats), Carrefour, Inditex i Consum en la sèrie de 2025 a totes les assignatures; corregix l'SDDR, Verkami (Joan Sala i els seus dos fills), el preu de l'oli («al voltant de 9 €/kg»), Filmin (sense subscriptors), «Tengo un plan» (sense episodi), @businessbarista (recursos d'À Punt) i l'impost de societats de tres ampliacions (15 % de nova creació i 19 % de microempresa). Mira la família Gómez a EEAE U8 i els càlculs nous de les ampliacions.

## PR visuals i dels jocs

Tots es van fusionar l'1 d'octubre, i els PDF que calia regenerar es van regenerar al #346. Les notes diuen què mirar. Els cinc de tests (#323 a #327) són a les seues assignatures.

- **#313** (VIS-NAV-16, 17, 18, 21, 23; VIS-LEC-16, 18, 23): menú amb teclat, un sol `<main>` i un sol `h1`, filtres que diuen quin està actiu, i «Saberes» a les 98 unitats en castellà. Mira: el menú ja no s'obri només amb el focus, cal prémer Intro; en triar al bàner de galetes, el focus va al logotip.
- **#314** (VIS-LEC-01, 03, 04, 05; VIS-LEC-02): paràgrafs i vinyetes al llibre, numeració igual al cos i a l'índex, figures amples a tota la columna, diagrames que es desplacen al mòbil i la regla damunt dels `h2`. Mira: si les figures amples es queden a la columna. Si la regla la vas llevar a posta, és el bloc `h2::before` que el #314 afig a `libro/[unidad].astro`, `ebau/index.astro` i `proyecto/[fase].astro`; anava en un commit a part (c8375840), però el PR es va fusionar en un de sol i ja no es pot revertir a soles.
- **#316** (VIS-LEC-14, VIS-NAV-12, VIS-LEC-20, VIS-LEC-11, VIS-LEC-24, VIS-LEC-25): taules que es desplacen dins de la seua caixa al mòbil, línia del curs al hub, reforç en una columna i activitats interactives amb marge. Mira: la línia del curs és informació nova.
- **#317** (VIS-NAV-05, 08, 09, 19): secció «Unidad a unidad» al hub i línia «En esta unidad: …» a cada unitat, títols de targetes sense espaiat, noms dels jocs en `h2` i precàrrega de fonts (uns 165 kB més la primera visita). Mira: on va la secció; a CJD només hi ha diapositives.
- **#318** (VIS-NAV-13, 24, 25 i part de VIS-LEC-15): terracota fosca (#9C3A1C) en text petit, paleta dels Jocs Econòmics, avís de l'àlies a 14 px, entradetes en Fraunces cursiva a nou landings i «Oposiciones ↗». Mira: sis landings passen de Switzer a Fraunces cursiva, i es nota.
- **#319** (VIS-LEC-07): les diapositives ja no tallen text (902 blocs en 196 decks) i la CI ho detecta. Mira: algunes diapositives de concepte fan 8-9 línies.
- **#320** (VIS-NAV-20): la home agrupa les assignatures per ESO, Bachillerato i FP, com el menú, amb targetes compactes al mòbil. Mira: la descripció de la targeta s'amaga al mòbil.
- **#321** (VIS-LEC-21): barra al visor de diapositives amb tornar a la unitat, comptador, «Ocultar soluciones» (tecla S) i pantalla completa (tecla F). Mira: la posició i l'aspecte de la barra, i si les solucions s'han d'amagar d'entrada.
- **#322** (DEB-D08): descriptors de quatre nivells per a quatre criteris en 16 debats, full d'avaluació analític, i buscar fonts compta com a CCL i CD. Mira: llig els descriptors (`src/lib/debates-niveles.ts`).
- **#330** (jocs, Jocs Econòmics i Business Game; R6 A6–A10): els dos errors que el PR descrivia, el bonus de l'Insider i la ronda reoberta del Business Game, els arregla el #347. La migració de Supabase i el deploy de PartyKit encara són teus: vegeu «Et queda a tu».
- **#336** (R6 A11–A13): el menú obert passa per damunt del que es tanca, la lletra de la resposta errònia es llig i les fitxes van sense franja. Mira les captures del PR.
- **#342** (PRO-D01): camp `materia_socia` a l'esquema de projectes i bloc «Qué se trabaja de…» a la pàgina, amb captures. Mira les matèries i cursos triats (Matemàtiques A o B, Tecnologia de 4t, EVCE sense curs fix).

## Últims PR

PR del 2 i del 4 d'octubre, després d'escriure esta guia.

- **#347** (jocs): a l'Insider, l'impostor que endevina la paraula es queda els 150 punts del bonus; al Business Game, no s'accepten decisions d'una ronda que ja té resultats, i el panell del profe avisa que cal tornar a prémer «Cerrar la ronda». Mira: l'arreglament de l'Insider és del servidor i no arriba a les aules fins al deploy.
- **#348** (VIS-NAV-22, VIS-LEC-22): totes les pàgines fan les molles de pa amb el mateix component, amb una llista i la pàgina actual marcada, i les capçaleres de secció tenen la mateixa forma: etiqueta, títol al mateix marge i entradeta en Fraunces cursiva. Mira: les seccions d'una assignatura (llibre, activitats, reforç, avaluació) i un debat. En imprimir un debat o una dinàmica només ha d'eixir el títol petit i les fitxes.
- **#349** (VIS-LEC-19): l'índex d'activitats s'agrupa per unitat, amb el títol de la unitat del llibre i salts U1…U12 a dalt; l'enllaç «N actividades» del hub porta al títol de la unitat. Mira: /eco-1bach/actividades/ i el salt des del hub.
- **#350**: al quadre «Cómo usar los simulacros» de /olimpiada/simulacros/, les negretes ja no trenquen la línia, i els quadres de simulacres i de textos tornen a portar vinyetes i números. Porta també esta actualització de la guia.

## Et queda a tu

Des d'ací no es pot comprovar si ja ho has fet.

- **Deploy de PartyKit.** Un sol `npm run party:deploy` des de `main` porta al servidor els arreglaments del #330 i del #347, i les preguntes noves dels tests al Cajút (`npm run deploy:cajut` fa el mateix):

  ```
  cd %USERPROFILE%\profedeeconomia
  git checkout main
  git pull
  npm install
  npm run party:deploy
  ```

  En un Windows ARM64, la CLI de PartyKit no arrenca: carrega `workerd`, que no té versió per a ARM64, i `npm install` també falla per culpa seua. Cal fer-ho amb el Node x64, que Windows executa per emulació: desinstal·la el Node actual, instal·la el `.msi` x64 de la mateixa versió des de nodejs.org i comprova-ho amb `node -p "process.arch"`, que ha de dir `x64`. Després, sense cap `npm run dev` obert, esborra `node_modules` (`rmdir /s /q node_modules`), fes `npm ci` i torna a llançar `npm run party:deploy`.

- **Migració de Supabase del #330.** Executa `supabase/migrations/20260930_institute_leaderboard_best_per_player.sql` a l'editor SQL de Supabase Studio. Sense ella no es trenca res, però el rànquing per instituts continua amb el càlcul antic: un alumne amb cinc bones partides pot fer tot el top 5 del seu institut.

## Decisions que et toquen

### Les que no s'han tocat a propòsit

- **Numeració de les CE (T3).** Hi ha dues o tres numeracions de competències específiques incompatibles: ECO1-D02 (activitats, reptes i avaluació), ECO4-D05 (mateixos codis amb sentit oposat), EDMN-D06 (la programació n'inventa sis), FOPP-D06 (CE1-CE8 pròpies), TALLER-D03 (dues llistes i quatre reptes a la CE equivocada), IPE1-D12 (model de RA amb un RA6 sense criteris), IPE2-D01 (RA de FOL i EIE) i DIN-D05 (codis d'Eco 1BACH desplaçats). També ECO4-D14 (sis de les set CE a les tres últimes unitats) i ECO4-D15 (tres llistes de CE a `docs/curriculum-eco-4eso.md`). En depenen les competències dels 27 ponts d'emprenedoria (#315).
- **«Currículo básico estatal» on no toca (T4).** TALLER-D02 (una optativa que el RD 217/2022 no regula), IPE1-D13 i IPE2-D06 (mòduls d'FP), CJD-D03 (hub, meta i FAQ, que a més diuen que té tests) i GPE-D05 (nota de plantilla al hub i al PDF). Relacionada: VIS-NAV-02, la frase de la home.
- **Estructura de CJD (T9).** CJD-D02 (no té l'estructura interna obligatòria i el hub enllaça pàgines buides) i CJD-D04 (la programació pondera un 20 % de tests que no existixen i no publica els criteris d'avaluació).
- **EBAU o PAU (EDMN-D07).** FOPP ja diu PAU (#289). EDMN manté la secció «EBAU», amb rutes, components i PDF d'exàmens, i els decks d'Eco 1BACH U2-U5 porten «Nivel EBAU» (#302, #306). Canviar-ho a tot el lloc toca també PistaEbau (R4).
- **Veu del web (EIN-D04 i VIS-NAV-14).** La portada dels generadors parla en primera persona del singular, i altres pàgines passen de «nosaltres» a «jo» i de «tú» a «vosotros». El #312 ja va llevar la primera persona de la portada d'emprenedoria.
- **JOC-D04, el nom.** La portada del concurs es titula «Las Olimpiadas de Economía» i el hub de jocs hi enllaça amb eixe nom; l'auditoria proposa dir-ne sempre «Juegos Económicos».
- **JOC-D05, l'àlies obligatori.** Ara el formulari demana un àlies, però ni és obligatori ni es valida. Fer-lo obligatori, el termini de conservació i la supressió de dades són la decisió 5 de l'informe.
- **JOC-D06, la traducció del joc.** El banc de Juegos Económicos està 100 % en valencià a la pàgina en castellà.
- **ECO4-D06 i FOPP-D14 no s'han revisat.** Són els tipus de cotització del treballador. Cap PR les cita. El #270 diu que ja no queda cap «6,35 %» ni «6,48 %» al contingut, però ningú ha comprovat si el reforç de la 3a avaluació de FOPP continua cotitzant sobre el brut mensual.

### Les que planteja la segona passada (R1–R6, secció B)

EDMN 2BACH:
- Rúbrica de l'EBAU: acceptar també el 25 % «sobre el punt mort» i la nota de les provisions com a font «interna-aliena» (R1).
- Simulacres de l'EBAU i dinàmica «hotelito»: encara conclouen «ROE > ROA → palanquejament positiu»; passar-los a la regla nova o no (R4).
- Calculadora de ràtios: el cost del deute es calcula sobre tot el passiu, proveïdors inclosos; confirmar que és la simplificació que expliques (R4).
- Calculadora de forma jurídica (EDMN i GPE): proposa per defecte un IS del 25 %, i el 2026 una SL xicoteta tributaria al 19 % (R2).
- Cas Pescanova: la font diu «2013-2024» i el text acaba el 2023 (R5).

Eco 1BACH:
- Un sol bloc de «dades de referència» datat (el d'U3) al qual remeten U8, U10 i U11 (R3).
- Esquema del cicle amb o sense «auge/pico» (R3).
- EPA: U3, U7 i U9 porten el 1T 2026 (10,83 %) i U8 el 2T (9,87 %); triar-ne una (R3).
- Dades de 2025 sempre amb «(INE, set. 2026)» o no (R3).
- Dinàmica del PIB i l'IPC de 2024: escenari històric de gener de 2025 o actualitzar-la (R3).
- Activitat de les tres recessions: el títol «Tres años perdidos», ara que el 2022 ja supera el 2019 (R3).
- «Resisten bien… la aversión a la pérdida»: afegir o no el matís del debat de Gal i Rucker (R3).
- Subhasta dels tres béns: com donar valor a les fitxes i quin desempat aplicar amb diverses pujes de 20 (R3).
- Elasticitat i fiscalitat: la «Variante larga» torna a demanar dades reals de dos anys (R3).

Eco 4ESO:
- Simulador de la renda: implementar la deducció de la DA 61a (590,89 € el 2026) o explicar-ho a la nota (R2).
- «Voces en desacuerdo» d'U5: mantindre el 61 % (2018-2025) o passar al 66 % canviant les dates (R2).
- U5: acceptar o no «algunos programas de empleo y formación» per al límit de 30 anys de l'alternança; IPE I U6 afig els certificats de nivell 1 i 2 (R1).
- Dinàmica del mòbil de segona mà: protagonista menor o un familiar (R4).

FOPP 4ESO:
- Reforç de la 3a avaluació: aplica un 2 % d'IRPF a qui cobra l'SMI; vols que hi haja retenció? (R1).
- Buenafuente (U1) i Andrea Solà (U4): cas il·lustratiu o una font que existisca (R5).

Taller Eco 3ESO:
- Dinàmica del primer treball: si una gelateria amb un menor de 16 anys és un bon exemple per a 3r d'ESO, on l'alumnat en té 14 o 15 (R1).

IPE I:
- Mètode del salari diari per a les indemnitzacions: amb les extres (anual ÷ 365) o mensual ÷ 30 (R1).
- Si els solucionaris nous de les activitats s'han de veure només com a material del professorat (R1).
- To del titular de les morts laborals: 796 el 2024, amb 150 in itinere i 266 per infarts, ictus i altres patologies no traumàtiques (R5).

IPE II:
- Quota d'autònom «d'uns 300 €» després de la tarifa reduïda: la taula dona prop de 270 € amb un rendiment d'uns 1.000 € al mes; afecta també la tercera numèrica d'U9 (#327) (R4).
- CycloFix: posar la «retribució mínima dels socis» (1.560 €) dins dels costos fixos; és el criteri que vols ensenyar? (R4).

EEAE:
- U5: atribuir a Mayo la lectura de l'experiment d'il·luminació és una simplificació habitual (Mayo hi va arribar el 1928); mantindre-la o no (R3).

Transversals:
- Debats: precisar que l'art. 168 també s'aplica a la «revisión total» (R3).
- Dinàmiques: a la cadena de plusvàlues, la variant «grupos de 4, elimina el transportista» porta el fabricant a 2,80 € i deixa desfasada la taula d'escenaris (R1).
- Dinàmiques: al pastís fiscal, un país amb un pressupost de 100 M€ és molt xicotet; és una qüestió d'estil (R4).
- Emprenedoria: el repte del café diu «mejor, con un amigo» i la fase 4 i l'entrevista diuen «nunca solos»; unificar-ho (R4).
- Emprenedoria: dir que els 14 dies de desistiment no valen per als aliments peribles (R5).
- Olimpíada: a les lectures, els llibres del mateix web van primer (que no sone a autopromoció), i «Principios» de Dalio continua dins de «Finanzas e inversión» (R5).
- Jocs: a Assegurats, qui ho assegura tot perd 65 € per ronda; és el missatge que vols? (R3).
- Projectes: a l'interés compost, dir la convenció (capitalització mensual del 5 % nominal i aportació a final de mes) (R4).

### Les que obrin els PR de correccions

- **EDMN (#329)**: la dinàmica de la gelateria té ara 7 nodes (les altres en tenen 3); el balanç d'Inditex és un dataset simplificat i no les xifres reals del FY2023; `ebau/04-simulacros.mdx` encara puntua el palanquejament com a «ROE > ROA»; el temps de lectura d'U5–U8 (proposta: ~22, ~21, ~23 i ~22 min; ara diu ~11, ~10, ~12 i ~9) esperava el #313, que ja està fusionat, però encara no s'ha canviat.
- **Eco 1BACH (#328)**: l'itinerari mínim no retalla U10–U12; si vols, una caixa per unitat o un retall. El cicle diu ara «Depresión · fondo».
- **GPE (#331)**: mantindre la Marina a U3 o fer un cas valencià nou; un final propi per a l'opció indefinida de la dinàmica 05 (R4 5); les anotacions en T i les línies d'impostos i amortitzacions a la plantilla de la fase 4 (GPE-D02); l'activitat d'EDMN «oferta sin sesgos» (GPE-D01); comprovar que el nou apartat d'igualtat d'U5 cap en 2 sessions.
- **EEAE (#333)**: no hi ha activitat de notícia ni quadern de projecte separat; falta dir a la pàgina de l'eina EquilibrioMercado que és opcional per a EEAE; les capçaleres de sabers usen la numeració del material; la plantilla del hub; U6 queda al límit del temps de lectura; el cas del SDDR s'ha de revisar després del 22-11-2026.
- **Calculadores (#334)**: el recurs del cotxe diu el contrari del que calcula el model; ROA i ROE només donen el veredicte pel color; l'OA-DA pot portar la SRAS més enllà de ±50; la deducció de la DA 61a es limita amb tota la quota.
- **Framework (#335)**: publicar les dues activitats de GPE que tenen la traducció llesta; revisar els 257 noms dels KPI dels arbres de decisió (`src/components/actividades/kpi-labels.ts`); després de desplegar, comprovar que la segona crida seguida a `/api/business-game/estado` porta `x-vercel-cache: HIT`; decidir si `/[asignatura]/tests/` s'indexa; el 404 valencià per a `/ca/*` necessita un hook de build.
- **Debats (#338, #339)**: els debats 01-03 de Dret no porten la línia «Para cerrar» i els altres sí; el veto de la llei d'amnistia com a exemple del Senat; dades que caduquen (la qüestió d'inconstitucionalitat dels MASC, la directiva de plataformes, el preu del bitcoin); al PDF, el bloc del professorat pot eixir sense fons de color.

### Altres que obrin els PR

- Hub de tests: s'ha mantingut. Si el vols retirar, cal llevar la targeta i la ruta, esborrar `tests/index.astro` i posar les redireccions a `vercel.json` (#272).
- Dades de referència: un mòdul únic (`src/data/referencia-2026.ts`) canviaria com s'escriu el contingut, perquè moltes xifres viuen al frontmatter dels tests i els reforços (#276).
- Temps de lectura: aplicar a totes les matèries el criteri de 200 paraules per minut, amb un test que ho vigile (#311).
- Terracota com a text: passar els més de 100 usos que queden a `--color-terra-ink`, o enfosquir la terracota a tot el web, que ja seria canviar el sistema visual (#277; el #318 en va fer una part).
- Business Game: la decisió per defecte (preu 20, producció 5.000) perd diners en la primera ronda, i un equip que no fa res en perd menys; potser cal calibrar els paràmetres (#274).
