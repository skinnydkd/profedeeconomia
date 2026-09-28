# Auditoria didàctica — Grup B: Economia (Batxillerat)

> Annex de l'[auditoria didàctica](./README.md) · setembre de 2026 · revisió de només lectura sobre `main` (`876e002`).

> Auditoria de només lectura feta el 2026-09-28 sobre `eco-1bach` (Economía, 1.º Bach, RD 243/2022) i `eeae-bach` (Economía, Emprendimiento y Actividad Empresarial, RD 243/2022 · modalitat General). Sense accés a la xarxa: les dades externes s'avaluen amb el coneixement propi i s'indica la confiança. No es corregeix cap xifra de la qual no tinguem seguretat: en aquest cas es recomana la font (INE, BdE, BCE, Eurostat, AIReF).
>
> **Mètode**. Lectura sencera (llibre + bloc ```deck```, test, ≥3 activitats, dinàmica, recurs i lògica de càlcul, repte) de 3 unitats per matèria. Passada ràpida de la resta. A més, amb scripts de lectura: (1) bolcat de les **161 claus de test d'ECO1 i les 121 d'EEAE** amb el text de l'opció correcta; (2) **els 26 exercicis resolts d'ECO1** refets a mà i amb Python; (3) tots els ítems numèrics dels **13 + 10 reptes**; (4) comparació ES↔CA de **totes** les claus i de totes les xifres de llibre, activitats, reptes, reforç i dinàmiques (paritat completa: les errades del castellà també són al valencià); (5) comparació dels crèdits d'imatge llibre↔deck; (6) solapament literal EEAE↔ECO1/EDMN (fragments de 10 paraules).

---

## Economía 1.º Bachillerato (`eco-1bach`)

**Resum.** És el paquet més complet del grup: 12 unitats amb deck (29-32 diapositives), test (13-14 ítems de 4 tipus), 5 activitats de tipologies diferents, recurs interactiu, dinàmica, repte i fitxes de reforç/ampliació per avaluació. El disseny d'activitats és molt bo i els càlculs són majoritàriament correctes (21 dels 26 exercicis resolts, nets). Els problemes greus són de rigor puntual i de coherència: un exercici resolt de comerç internacional que "demostra" el contrari del que afirma, tres numeracions de CE incompatibles, tres definicions del cicle econòmic dins de la mateixa unitat i el mateix test, i una passada de dades 2026 feta en unes unitats (U3, U5, U7, U9, U11) però no en U8, U10 ni als tests. La unitat diferenciadora (U2) necessita una revisió de rigor: repeteix el mite de la donació d'òrgans i no avisa de la crisi de replicació.

**Punts forts**
- Estructura homogènia i completa a les 12 unitats; cada activitat porta rúbrica ponderada i variants "Con apoyo / Para quien va sobrado" (DUA real, no declarat).
- Activitats de lectura crítica de dades molt ben pensades: `05-investigacion-elasticidad-con-datos-reales.md` (factors de confusió, preus corrents vs constants), `08-grafico-tres-recesiones-espanolas.md` (taxa vs nivell), `02-noticia-consentimiento-presunto-nudge.md` (causa vs correlació), `04-noticia-seis-titulares-una-curva.md` (moviment vs desplaçament).
- Exercicis resolts ben graduats i amb comprovació: 6.1 (externalitat amb verificació del preu net), 7.3 i 9.1 (efecte desànim), 4.3 (desplaçament simultani), 8.3 (comptabilitat del creixement), 5.3 (preu màxim i pes mort).
- Lògica de càlcul correcta a `src/lib/calc/elasticidad.ts`, `ad-as.ts`, `multiplicador.ts` (inclou impostos i importacions) i `ventaja-comparativa.ts`.
- `VocesDesacuerdo` presenta controvèrsies de manera equilibrada (incidència fiscal, creixement i desacoblament); to plural i proper, cap emoji.
- Part de la passada de dades ja feta i coherent: SMI 2026 (1.221 €) idèntic a U3, U5 i U9; EPA T1-2026 a U3 i U7; taula d'IPC fins a 2025; OMC 166 membres al llibre; matís Arntz sobre Frey-Osborne.

**Unitats revisades a fons**
- U2 `src/content/asignaturas/eco-1bach/libro/02-toma-decisiones-economicas.mdx` (+ `tests/02-…`, activitats `02-noticia-consentimiento-presunto-nudge`, `02-experimento-anclaje-aula`, `02-juego-ultimatum-homo-economicus`, `02-coste-oportunidad-decisiones`; dinàmica `02-decision-carrera-sesgo`; repte `07-decisiones-sesgos`; recurs `matriz-decision`)
- U5 `libro/05-elasticidad-aplicaciones.mdx` (+ test, activitats `05-elasticidad-y-fiscalidad`, `05-juego-subasta-tres-bienes-elasticidad`, `05-investigacion-elasticidad-con-datos-reales`, `05-debate-control-alquileres`; dinàmica `05-elasticidad-gasolinera`; repte `09-elasticidad-intervencion`; recurs `calculadora-elasticidad` + `src/lib/calc/elasticidad.ts`; diff ES↔CA de llibre i test)
- U8 `libro/08-modelo-ad-as-ciclos.mdx` (+ test, activitats `08-ejercicio-shocks-ad-as`, `08-grafico-tres-recesiones-espanolas`, `08-espana-2020-covid-shock`; recurs `simulador-ad-as` + `src/lib/calc/ad-as.ts` + `src/components/calculadoras/ADASSimulator.tsx`; diagrames `ADAS.astro`, `CicloEconomico.astro`; repte `11-ad-as-ciclos`; fitxes `refuerzo/eval2-*`; diff ES↔CA)

### Troballes

#### ECO1-D01 · Crític · Rigor i dades — L'exercici resolt 12.1 "demostra" els guanys del comerç amb xifres que diuen el contrari
- **On**: `libro/12-globalizacion-ue-retos.mdx:185-195` (i el bessó `12-globalizacion-ue-retos.ca.mdx:194`); `/eco-1bach/libro/12-globalizacion-ue-retos/`
- **Evidència**: autarquia: «**Mundo total**: 35 t de trigo + 20,83 m de tela» (l. 185). Proposta de l'exercici: «Si Surpaís dedica 60 h a tela (10 m) y 40 h a trigo (8 t), y Norpaís dedica 90 h a trigo (45 t) y 10 h a tela (2,5 m), tenemos un total mundial de **53 t de trigo y 12,5 m de tela**: más trigo y exactamente la misma tela que en autarquía. Con un intercambio voluntario —por ejemplo, Surpaís vende 4 m de tela a Norpaís a cambio de 6 t de trigo— ambos pueden terminar consumiendo más de los dos bienes».
- **Per què importa**: 12,5 m ≠ 20,83 m (hi ha **menys** tela que en autarquia). Amb l'intercanvi proposat, Norpaís consumeix 39 t + 6,5 m (autarquia: 25 t + 12,5 m) i Surpaís 14 t + 6 m (autarquia: 10 t + 8,33 m): **cap dels dos** consumeix més dels dos béns. A més, l'assignació fa que cada país produïsca el bé on **no** té avantatge comparatiu. És l'únic exercici resolt del saber C.4 i l'alumnat n'aprendria una demostració falsa.
- **Proposta**: (a) mostrar que el món produeix més: Surpaís 100 h a tela (16,67 m); Norpaís 16,67 h a tela (4,17 m) i 83,33 h a blat (41,67 t) → món 41,67 t + 20,83 m (més blat, la mateixa tela); o (b) especialització total (50 t; 16,67 m) + intercanvi a 1 m = 1,5 t dins del rang [1,2; 2]: Surpaís ven 8 m per 12 t → Norpaís consumeix 38 t + 8 m (amb la seua FPP, amb 8 m només arribaria a 34 t) i Surpaís 12 t + 8,67 m (amb la seua FPP, 9,6 t): tots dos consumeixen **fora** de la seua FPP. És el mètode que ja usa bé l'activitat `12-ventaja-comparativa-dos-paises.md` (passos 7-8). Corregir també la variant d'eixa activitat: «cambiando la producción máxima de tela de Portugal a 300 … la ventaja comparativa cambia de manos» és fals (300/60 = 5 tela per oli > 2 d'Espanya; només canvia si la tela màxima de Portugal és < 120).
- **Confiança**: Alta.

#### ECO1-D02 · Alt · Alineació LOMLOE — Tres numeracions de CE incompatibles: activitats, reptes i avaluació no parlen de la mateixa competència
- **On**: `programacion/programacion.mdx:58-66`; `evaluacion/evaluacion.mdx:7-80`; `actividades/*.md` (camp `competencias_especificas`); `retos/*.mdx` (camp `competencia`); `actividades-dinamicas/*.mdx:10`; `docs/curriculum-eco-1bach.md` §3
- **Evidència**: programació: «**CE2** — **Tomar decisiones económicas y financieras** razonadas… **CE3** — Analizar el funcionamiento de los **mercados**…» i «Los códigos CE1-CE6 … siguen el orden en que el currículo básico estatal enuncia estas capacidades». Pàgina d'avaluació (redacció del RD): «CE2 … Reconocer y comprender el funcionamiento y los criterios de actuación de los agentes económicos, así como del mercado, analizando sus fallos…»; «CE3 … Distinguir y valorar el papel de los distintos agentes económicos que intervienen en el flujo circular de la renta…». Les activitats segueixen la programació (U2-U3 → CE2; U4-U6 → CE3; U7-U8 → CE4; U9-U11 → CE5; U12 → CE6), els reptes segueixen el RD (U4/U5/U6 → CE2; U7/U8/U9/U11 → CE3; U3/U10 → CE4; U12 → CE5) i **les 12 dinàmiques porten `[CE2]`** (fins i tot `07-pib-ipc-espana-2024` i `08-recesion-empresa-ad-as`). El doc de currículum intern té una tercera numeració.
- **Per què importa**: qui avalua amb la pàgina d'avaluació (criteris oficials) atribuirà l'evidència a la competència equivocada: una activitat d'elasticitat etiquetada CE3 correspon, al RD, al flux circular. L'afirmació que la numeració segueix l'ordre estatal és falsa.
- **Proposta**: adoptar a tot arreu la numeració del RD (la de `evaluacion.mdx`) i reescriure la llista de la programació amb eixa numeració. Reetiquetar: U1 → CE1; U2 → CE1 (crit. 1.3); U3 → CE4 (4.2); U4-U6 → CE2; U7-U8 → CE3; U9 → CE3; U10 → CE4; U11 → CE3 + CE4 (monetària); U12 → CE5; activitats d'investigació/cas amb dades → + CE6. Dinàmiques: CE de la seua unitat. Alinear `docs/curriculum-eco-1bach.md`.
- **Confiança**: Alta (el text d'`evaluacion.mdx` reprodueix el RD 243/2022).

#### ECO1-D03 · Alt · Rigor i dades + Coherència — Cicle econòmic: fases atribuïdes al NBER i "depresión" definida de tres maneres, fins i tot dins del mateix test
- **On**: `libro/08-modelo-ad-as-ciclos.mdx:247-252, 467, 494` i deck (diapositiva «Las cuatro fases…»); `tests/08-modelo-ad-as-ciclos.md:48-55, 101-105`; `refuerzo/eval2-refuerzo.mdx:74`; `src/components/diagrams/CicloEconomico.astro:15-24`
- **Evidència**: llibre: «Ambos organismos [NBER, CEPR] identifican cuatro fases canónicas…» i «**Depresión**. Recesión prolongada y profunda… Es un fenómeno raro»; recessió: «(regla de oro, no es una definición oficial)». Test Q6: «Las cuatro fases canónicas del ciclo económico, según la datación del NBER y el CEPR» amb explicació «depresión (recesión prolongada y profunda)». Test Q14 (mateix test): «La definición técnica de recesión son dos trimestres consecutivos… La depresión es el punto más bajo del ciclo, no una recesión larga». Reforç: «Depresión: la producción está en su punto más bajo». Diagrama: «expansión, pico, recesión, valle y recuperación».
- **Per què importa**: dues claus del mateix test s'exclouen mútuament i contradiuen el llibre i el diagrama. El NBER i el CEPR daten **pics i valls** (dues fases: expansió i recessió); no identifiquen cap fase "depresión".
- **Proposta**: presentar la datació NBER/CEPR com a pics i valls; presentar l'esquema de 4 fases com l'esquema escolar tradicional (expansión/recuperación → auge o cima → recesión → depresión o fondo/sima), aclarint que "depresión" també designa recessions greus i llargues (1929). Unificar Q6, Q14 (i la seua explicació: la regla dels dos trimestres «no es una definición oficial»), glossari, reforç i etiquetes del diagrama. Canviar «regla de oro» per «regla práctica».
- **Confiança**: Alta.

#### ECO1-D04 · Alt · Rigor i dades + Coherència — Política monetària: tres "tipus actuals del BCE" i dos Euríbors diferents segons la unitat
- **On**: `libro/03-planificacion-financiera-personal.mdx:300, 423-424`; `libro/08-modelo-ad-as-ciclos.mdx:228`; `libro/10-sistema-financiero-dinero.mdx:279, 469-470`; `libro/11-politicas-economicas.mdx:90, 320, 369`
- **Evidència**: U3: «facilidad de depósito **2,00 %**, MRO **2,15 %**, facilidad marginal **2,40 %**» (maig 2026) i «Euribor … en torno al **2,8 %**». U8: «situándose en torno al 2,40 % [MRO] en el primer trimestre de 2026». U10: «(MRO)… En el primer trimestre de 2026: **2,40 %**», «Facilidad de depósito BCE: **2,25 %**», «Euribor a 12 meses: **2,30-2,55 %**». U11: «lleva la facilidad de depósito al **2,25 %** en el primer trimestre de 2026». U11:90: «del 0 % al 4,5 % en 18 meses (julio 2022 - septiembre 2023)» davant U11:320 «(catorce meses…)».
- **Per què importa**: l'alumnat veu tres tipus "vigents" diferents. La facilitat de dipòsit és del 2,00 % (MRO 2,15 %, marginal 2,40 %) des del juny de 2025; el 2,25 % era el tipus d'abril-juny de 2025 i el 2,40 % és la facilitat marginal, no el MRO. Juliol 2022 → setembre 2023 són 14 mesos.
- **Proposta**: un únic bloc de "dades de referència" datat (el de U3:418 serveix de model), reutilitzat per U8, U10 i U11 (coherent amb la regla de font única); comprovar l'última decisió del BCE abans del curs a ecb.europa.eu; triar un sol Euríbor (sèrie mensual del BdE, amb mes); «catorce meses».
- **Confiança**: Alta en la incoherència; Mitjana-Alta en els valors (no coneixem cap canvi del BCE posterior al juny de 2025).

#### ECO1-D05 · Alt · Coherència entre peces — Els tests i la U8 no han rebut la passada de dades: xifres contradictòries entre peces
- **On**: `tests/11-politicas-economicas.md:32` vs `libro/11:206`; `tests/12-globalizacion-ue-retos.md:27` vs `libro/12:232`; `tests/07-macroeconomia-agentes-indicadores.md:72` vs `libro/07:557`; `tests/10-sistema-financiero-dinero.md:72` i `libro/10:117, 434`; `libro/08:268` vs `libro/03:432` i `libro/07:584`; `libro/07:254` vs `libro/08:267, 274` i `actividades/08-espana-2020-covid-shock.md:21`; `libro/08:92` vs `libro/07:254`, `libro/08:268` i `actividades/08-grafico-tres-recesiones-espanolas.md:19`; `libro/08:227, 233`
- **Evidència**: test U11: «deuda pública cercana al 107 % del PIB» (2024) vs llibre «102-103 % … al cierre de 2025»; test U12: «tiene 164 países miembros» vs llibre «La OMC tiene **166 países miembros**»; test U7: «(≈ +2,6 % del PIB en 2023)» vs llibre «En 2024 … ≈ +3,0 %»; U8: «la EPA del primer trimestre de 2026 sitúa el paro en el 10,4 %, mínimo desde 2008» vs U3/U7 «**10,83 %**»; U7: «se hundió un **11,2 %** en 2020» vs U8 i l'activitat del COVID «**−10,8 %**»; recuperació del PIB prepandèmia: U8:92 «a finales de 2021 ya casi se había recuperado», activitat «El nivel de 2019 no se recupera hasta 2022», U7/U8 «segundo trimestre de 2024»; exercici 8.1: dades «2022: +5,8 %… 2023: +2,7 %» però solució «pasó del 5,5 % al 2,5 %», i «2025: en torno al +2,5-2,7 % (proyección Banco de España)»; euro digital «entre 2027 y 2028».
- **Per què importa**: el test contradiu el llibre (l'alumne que estudia bé falla). Cap al setembre de 2026 la dada de 2025 ja no és una projecció, i el deute de 2024 publicat pel BdE (PIB revisat) és ≈ 101,8 %: un 102-103 % a final de 2025 no seria "ha bajado".
- **Proposta**: tests: deute 2024 ≈ 101,8 % (BdE, PDE), OMC 166, compte corrent 2024 ≈ 3 %, euro digital segons la decisió del BCE d'octubre de 2025 (pilot 2027, possible primera emissió 2029 si el Reglament s'aprova el 2026). U8: EPA de l'últim trimestre publicat (T2-2026, finals de juliol) sense «mínimo desde 2008» si no es verifica; una sola xifra de PIB 2020 (última revisió de la CNA de l'INE, indicant que s'ha revisat); dada provisional de 2025 de l'INE; una sola data de recuperació prepandèmia (comprovar a la CNTR de l'INE; amb les sèries de l'activitat s'assoleix el 2022-2023, no el T2-2024). Tancament de 2025 de dèficit i deute: IGAE/INE i BdE.
- **Confiança**: Alta en les incoherències; Mitjana en els valors més recents (cal font).

#### ECO1-D06 · Alt · Rigor i dades + Coherència — Donació d'òrgans: el llibre i el deck repeteixen el mite que desmenteix l'activitat de la mateixa unitat
- **On**: `libro/02-toma-decisiones-economicas.mdx:433` i deck `:726`; `actividades/02-noticia-consentimiento-presunto-nudge.md:29-31`
- **Evidència**: llibre: «El secreto institucional es el *opt-out*… Países con sistema *opt-in* (Alemania, Estados Unidos) tienen tasas la mitad de bajas»; deck: «más de 50 donantes por millón (ONT, 2024), el doble que los países con opt-in». Activitat: «la propia ONT atribuye su liderazgo no tanto a la ley como al llamado *modelo español*» i «en España se consulta siempre a la familia».
- **Per què importa**: és l'exemple estrella de la unitat diferenciadora. La Llei 30/1979 existia una dècada abans del salt de 1989 (creació de l'ONT); l'ONT i la literatura atribueixen el lideratge al model organitzatiu. Els EUA (opt-in) tenen ≈ 48-50 donants p.m.p., prop d'Espanya: «la mitad» només val per a Alemanya.
- **Proposta**: reescriure llibre i deck com l'activitat: «España tiene consentimiento presunto desde 1979, pero su liderazgo (≈ 50 d.p.m.) se atribuye sobre todo al modelo organizativo de la ONT (1989): coordinadores hospitalarios y entrevista a la familia. Es un buen ejemplo de los límites del *nudge* como explicación única». Llevar «la mitad» als EUA.
- **Confiança**: Alta (posició de l'ONT); Mitjana-Alta (taxa dels EUA).

#### ECO1-D07 · Alt · Coherència entre peces — El simulador AD-AS diu "Y*" a la producció d'equilibri a curt termini; el llibre reserva Y* per al potencial
- **On**: `src/components/calculadoras/ADASSimulator.tsx:44, 373, 397` (i `:123` en valencià); `libro/08-modelo-ad-as-ciclos.mdx:160-162, 171`; `src/components/diagrams/ADAS.astro:14`
- **Evidència**: simulador: «produccionY: 'Producción Y*'» i «(AD = SRAS): Y* =» al costat de «Potencial (LRAS)». Llibre: «**producción potencial** (Y\*)… La curva LRAS es, por tanto, **vertical** en Y\*». El diagrama diu a la vegada «vertical en la producción potencial Y*» i «Determina … la producción real Y*».
- **Per què importa**: el llibre demana usar el simulador amb cada cas; amb un xoc de demanda la pantalla mostra «Producción Y* = 105» i «Potencial (LRAS) = 100», contradient la definició central de la unitat (el recurs és un diferenciador declarat).
- **Proposta**: al simulador, «Producción de equilibrio (Y₁)» o «Y (corto plazo)» i E₀/E₁; reservar Y* (o Yp) per al potencial al simulador, al text alternatiu del diagrama i al llibre.
- **Confiança**: Alta.

#### ECO1-D08 · Alt · Rigor + Coherència — L'exercici 5.2 "del tabac" té demanda elàstica i càrrega sobre el productor, al revés del que la unitat ensenya del tabac
- **On**: `libro/05-elasticidad-aplicaciones.mdx:368-393` (esp. 390), `:345, 348, 469`; deck `:748-760`; `tests/05-elasticidad-aplicaciones.md:71`; CasoDilema `:78-84`
- **Evidència**: exercici: «El productor soporta el 60 % del impuesto porque la oferta (pendiente 0,03) es más inelástica que la demanda». Text: «Si la demanda es **más inelástica** que la oferta, los consumidores soportan la mayor parte del impuesto (caso del tabaco)»; VocesDesacuerdo: «los impuestos sobre el tabaco se trasladan casi enteros al consumidor»; test Q8: «los consumidores soportan casi todo el impuesto al tabaco».
- **Per què importa**: refet: a l'equilibri (P = 8, Q = 200), |Ed| = (1/0,02)·(8/200) = **2,0** (elàstica) i Es = 1,33; el consumidor suporta Es/(Es+|Ed|) = 40 %. El càlcul és correcte, però l'exemple "tabac" il·lustra el contrari del missatge, i dues diapositives consecutives es contradiuen. A més, el CasoDilema («España subió el impuesto al tabaco un 15 % en 2021. La recaudación creció solo un 3 %», «Adaptado de informes de la AEAT») no l'hem pogut identificar com a fet real.
- **Proposta**: recalibrar (verificat): demanda P = 22 − 0,07·Q; oferta P = 2 + 0,03·Q; t = 1 € → equilibri (8 €; 200); amb impost Q = 190, Pc = 8,70 €, Pp = 7,70 € (consumidor 70 %); |Ed| = 0,57, Es = 1,33; recaptació 190; pes mort 5; EC 1.400 → 1.263,5; EP 600 → 541,5 (comprovació: 1.263,5 + 541,5 + 190 + 5 = 2.000). Si el cas de 2021 no és real, presentar-lo com a hipotètic.
- **Confiança**: Alta (càlcul); Mitjana (CasoDilema).

#### ECO1-D09 · Alt · Rigor i dades — Bretxa salarial: "ajustada" i "sense ajustar" intercanviades (llibre i test)
- **On**: `libro/09-mercado-trabajo-desempleo.mdx:349, 367, 466`; `tests/09-mercado-trabajo-desempleo.md:64`
- **Evidència**: «la brecha **ajustada** ronda el **9 %** según Eurostat (datos de 2023); la **sin ajustar** … se acerca al **15-18 %**»; «la brecha sin ajustar en España ha caído del 23 % en 2010 al 16 % en 2022, según Eurostat»; test: «La brecha salarial ajustada en España (en torno al 9 % según Eurostat)…».
- **Per què importa**: l'indicador oficial d'Eurostat és la bretxa **no ajustada** en guany brut per hora (Espanya ≈ 9 %); el 15-18 % correspon a la bretxa en guany **anual** de l'INE (inclou jornada parcial). Una bretxa ajustada (perfil igual) és una altra estimació, no cap d'eixes xifres. L'alumnat aprèn el concepte al revés i el test ho reforça.
- **Proposta**: «Brecha sin ajustar por hora (Eurostat, indicador oficial): ≈ 9 %. Brecha en ganancia anual (INE, EES): ≈ 17-18 %, mayor porque incluye la parcialidad. Brecha ajustada: la que queda al comparar perfiles iguales; la estiman estudios (BdE, Eurostat experimental)». Revisar la sèrie 2010-2022 (sembla la de l'INE) i l'enunciat del test.
- **Confiança**: Mitjana-Alta.

#### ECO1-D10 · Alt · Rigor — Dinàmica de la gasolinera: la 95 i la 98 "complementàries" i indicadors que contradiuen el feedback
- **On**: `actividades-dinamicas/05-elasticidad-gasolinera.mdx:30-31, 79`
- **Evidència**: «el 98 y el 95 son bienes complementarios para algunos conductores (los que solo usan el 98 por especificación del fabricante)»; opció «Subo el precio 5 céntimos» amb `"litros_mes": -12000, "margen_bruto_cts": 5` però feedback «reduce la cantidad solo un 0,9 %, unas 1.350 litros».
- **Per què importa**: contradiu l'elasticitat creuada de la mateixa unitat (95 i 98 són substitutius, o independents per a qui només pot usar 98; mai complementaris). El marcador mostra 138.000 l i un marge de 13 cèntims quan el feedback diu −1.350 l i el marge queda en 8 (cost +5, preu +5). També aplica l'elasticitat del mercat (−0,3) a una sola gasolinera amb competència a 12 km.
- **Proposta**: «sustitutivos para quien puede elegir; independientes para quien solo puede usar 98»; `litros_mes: -1350`, `margen_bruto_cts: 0`; una línia que distingisca elasticitat del mercat i de l'empresa.
- **Confiança**: Alta.

#### ECO1-D11 · Mitjà · Alineació LOMLOE — Dos continguts del bloc E sense tractament: l'economia col·laborativa (E.2) i la relació entre estat del benestar i democràcia (E.3)
- **On**: `libro/12-globalizacion-ue-retos.mdx` (frontmatter `sabers`: C.4, E.1-E.5; §«La revolución digital», l. 364-384; §«Demografía, pensiones y migraciones», l. 428-450); `libro/11-politicas-economicas.mdx:259`; `docs/curriculum-eco-1bach.md:93-94`
- **Evidència**: el currículum del projecte diu «E.2. La nova economia i la revolució digital. **L'economia col·laborativa**. …» i «E.3. **Democràcia i estat del benestar. El futur de l'estat del benestar i la seua relació amb la democràcia.** Sostenibilitat de les pensions. Els fluxos migratoris…». La resta d'E.2 i E.3 sí que hi és: revolució digital i economia ecològica i circular (U12), estat del benestar i finançament (U11:259), pensions i migracions (U12:428-450). En canvi, «economía colaborativa» no apareix enlloc (l'única coincidència de «colaborativ-» és «sindicatos colaborativos», `libro/09:427`, en un altre context); U12 només toca les plataformes de passada (Ley Rider, l. 384); i la relació amb la democràcia es limita a mitja frase de U11:128 («sostenibilidad democrática»).
- **Per què importa**: U12 declara E.2 i E.3 al frontmatter. Qui programe a partir de la unitat deixarà sense treballar dos continguts que el currículum anomena explícitament, i el segon és el que dona títol a E.3.
- **Proposta**: a U12 §«La revolución digital», un apartat breu «Economía colaborativa y de plataformas» (intercanvi P2P vs plataformes intermediàries; BlaBlaCar/Wallapop vs Airbnb/Glovo; regulació: Ley Rider, habitatge d'ús turístic), de 300-400 paraules, + 1 ítem de test. A U12 §«Demografía, pensiones y migraciones», un paràgraf d'obertura sobre el futur de l'estat del benestar i la democràcia (legitimitat fiscal, pacte intergeneracional, Pacte de Toledo) que remeta a U11:259, + 1 pregunta de reflexió.
- **Confiança**: Alta respecte al doc de currículum del projecte; Mitjana-Alta respecte al text del RD 243/2022 (de memòria hi coincideix; no consultat).

#### ECO1-D12 · Mitjà · Rigor — Economia conductual: l'aversió a la pèrdua "explica" l'assegurança i el test té una clau ambigua
- **On**: `libro/02-toma-decisiones-economicas.mdx:395, 413`; `tests/02-toma-decisiones-economicas.md:79, 88-92`
- **Evidència**: «Explica … por qué pagamos seguros que estadísticamente nos cuestan dinero» i, a la mateixa unitat, «preferimos … una pérdida incierta a una pérdida segura del mismo valor esperado». Test (relacionar): «Aversión a la pérdida → Pago un seguro caro…» i «Falacia del coste hundido → No vendo unas acciones en pérdidas», quan el llibre diu que l'aversió «Explica por qué nos cuesta tanto vender una acción a pérdidas».
- **Per què importa**: pagar una prima és acceptar una pèrdua segura; amb la convexitat en pèrdues que la unitat explica, la teoria prospectiva prediu rebutjar-la. Kahneman i Tversky (1979) expliquen l'assegurança per la **sobreponderació de probabilitats petites**. A l'ítem de relacionar, dues situacions encaixen amb l'aversió segons el llibre.
- **Proposta**: exemple d'aversió: «rechazo una apuesta 50 % ganar 120 € / 50 % perder 100 €»; explicar l'assegurança per la ponderació de probabilitats; treure l'assegurança de l'explicació de Q9 i de l'ítem de relacionar.
- **Confiança**: Alta (tensió interna); Mitjana-Alta (lectura de la literatura).

#### ECO1-D13 · Mitjà · Rigor — La unitat diferenciadora no avisa de la crisi de replicació i té exemples sense base
- **On**: `libro/02-toma-decisiones-economicas.mdx:73-77, 152, 159` (Concorde), `:375, 401, 435, 437, 439, 487`; deck `:556-569`
- **Evidència**: «Concorde voló 27 años perdiendo dinero» i «sin generar nunca beneficios»; Sistema 2 «Consume energía mental, fatiga»; «El 90 % de los emprendedores cree que su empresa estará entre el 10 % que sobrevive»; «**Renta agraria por suscripción automática**»; «Cancelación con un clic. Desde 2022 la normativa europea…»; «Críticos como Cass Sunstein»; es recomana «Predictably Irrational — Dan Ariely» sense cap avís.
- **Per què importa**: British Airways va declarar beneficis operatius del Concorde des de mitjan anys 80; el que no es va recuperar va ser el cost de desenvolupament. L'esgotament de l'ego (Hagger et al., 2016) i part del *priming* (reconegut pel mateix Kahneman el 2017) no s'han replicat; un article d'Ariely (PNAS 2012) es va retractar el 2021 per dades fabricades; els *nudges* a escala tenen efectes molt menors (DellaVigna i Linos, 2022). La xifra dels emprenedors deforma Cooper, Woo i Dunkelberg (1988); «renta agraria por suscripción automática» no s'entén; Sunstein és coautor de *Nudge*, no un crític.
- **Proposta**: un Callout «¿Qué resiste la replicación?» (robustos: ancoratge, framing, aversió a la pèrdua, excés de confiança; no replicats: esgotament de l'ego, priming social; nudges: efectes modestos); Concorde: «el desarrollo nunca se recuperó; seguir financiándolo en los setenta es el ejemplo de coste hundido»; reformular la dada dels emprenedors; eliminar «renta agraria»; citar la norma exacta de la baixa amb un clic o retirar-la; «El propio Sunstein»; substituir Ariely per Thaler (*Misbehaving*) o afegir-hi l'avís.
- **Confiança**: Mitjana (depèn de literatura externa).

#### ECO1-D14 · Mitjà · Rigor i dades — U8: cita de Solow fora de context i xifres de desenvolupament desfasades
- **On**: `libro/08-modelo-ad-as-ciclos.mdx:206, 327` (i deck `:751`), `:347, 381-393`
- **Evidència**: «La frase atribuida a Solow para resumir el hallazgo —"You can see the computer age everywhere but in the productivity statistics"— se convirtió en lema»; «frente al 2,2 % de la media UE y el 3,5 % de Alemania o Corea del Sur»; «puesto 27 en el Informe de Desarrollo Humano 2023-2024… Noruega (0,966) o Suiza (0,967)»; «España: 0,33»; «permanece por encima de los niveles pre-crisis»; «ni entre los más desiguales (Reino Unido, países bálticos)» [el Regne Unit no és a la UE].
- **Per què importa**: la frase de Solow (NYT Book Review, 1987) es refereix a la paradoxa de la productivitat de les TIC, no resumeix el residu de 1957. Corea inverteix ≈ 5 % del PIB en R+D i Alemanya ≈ 3,1 %. Hi ha un IDH posterior (2025). El Gini d'Espanya d'Eurostat per a 2024 és 31,2 (el llibre d'EEAE ja l'usa), per davall del de 2008 (≈ 32,4).
- **Proposta**: situar la cita en la paradoxa de la productivitat; «Alemania ≈ 3,1 %, Corea del Sur ≈ 5 %»; últim IDH (PNUD); Gini 31,2 (2024) i «por debajo del nivel de 2008»; treure el Regne Unit de la comparació UE.
- **Confiança**: Alta (cita, Corea); Mitjana (IDH).

#### ECO1-D15 · Mitjà · Rigor — Claus i exercicis resolts amb errades de càlcul o de lectura
- **On**: `tests/05-elasticidad-aplicaciones.md:19-23`; `retos/09-elasticidad-intervencion.mdx:29`; `libro/11-politicas-economicas.mdx:350-351`; `libro/03-planificacion-financiera-personal.mdx:332`; `libro/09-mercado-trabajo-desempleo.mdx:285, 300`
- **Evidència**: (a) U5 Q2, opció correcta «0,91 — demanda casi unitaria» i explicació «≈ 0,87-0,91»; (b) repte 09: `"respuesta": 0.32` amb explicació «= 0,34 aproximadamente»; (c) exercici 11.3: «Cuota 2024 ≈ … **906 €/mes**» i «376 €/mes … 4 512 €/año»; (d) 3.2: «un 50 % más del precio original del piso»; (e) 9.2(c): «un SMI moderado puede **no destruir empleo** —incluso aumentarlo—».
- **Per què importa**: refet: (a) 8,33/9,52 = **0,875** (inelàstica); (b) 0,0619/0,1818 = **0,340**; (c) 180.000·0,00375/(1 − 1,00375^−360) = **912,03 €**, sobrecost **381 €/mes (4.576 €/any)**; (d) 80.300 € és el 50 % del **préstec** (160.000), el 40 % del preu; (e) amb monopsoni a 8 €, l'ocupació és Ls(8) = 440; amb SMI = 12 € (> 10 € competitiu) és Ld(12) = 400: **es destrueixen 40 mil llocs** fins i tot amb monopsoni (l'SMI no redueix l'ocupació només fins a 11,20 €).
- **Proposta**: corregir els valors; a 9.2(c) calcular els dos escenaris i concloure «un SMI entre 8 y 11,20 € no reduce el empleo respecto al monopsonio; 12 € sí».
- **Confiança**: Alta.

#### ECO1-D16 · Mitjà · Rigor + Disseny — Rendiments d'inversió sobrevalorats i un ítem de test sense la dada que decideix la resposta
- **On**: `libro/03-planificacion-financiera-personal.mdx:246, 467`; `tests/03-planificacion-financiera-personal.md:24-28`
- **Evidència**: «La rentabilidad histórica del MSCI World a 30 años ronda el **7-8 % anual real**»; glossari «6-8 % real»; test: «Dos hermanas con el mismo capital y el mismo tipo de interés… ¿Quién acaba con más dinero?» → «Ana».
- **Per què importa**: el 7-8 % és aproximadament nominal; el rendiment real a llarg termini de la renda variable mundial ronda el 4-6 %. Ana guanya només si r > ≈ 6,6 %: al 5 %, Ana 138.760 € i Berta 180.641 €; al 7 %, Ana 295.025 € i Berta 276.474 € (l'exercici 3.1 usa el 7 %). Amb rendiments realistes, la clau del test és falsa.
- **Proposta**: «rentabilidad histórica nominal ≈ 7-8 %; real ≈ 4-6 %, según periodo y divisa»; afegir «a un 7 % anual» a l'enunciat del test i una pregunta de discussió: «¿y al 4 %?».
- **Confiança**: Alta (test); Mitjana (xifra del MSCI).

#### ECO1-D17 · Mitjà · Disseny didàctic — Tres activitats amb un disseny que contradiu o supera el model de la unitat
- **On**: `actividades/05-juego-subasta-tres-bienes-elasticidad.md:15, 25`; `actividades/08-ejercicio-shocks-ad-as.md:41, 55`; `actividades/05-elasticidad-y-fiscalidad.md:38-45`
- **Evidència**: subhasta: «Para que las pujas sean sinceras y no un juego de farolear, el último bien se subasta de verdad: quien puje más se lo lleva» (premi possible: «un punto de participación»). Xocs AD-AS: «si la economía está en el tramo horizontal de la AS (recursos ociosos)… tramo vertical» (15 % de la nota). Elasticitat i fiscalitat: tabac 2018 «4,90 €» → 2024 «5,50 €», 2.150 → 2.020 milions, calculat com un moviment sobre la corba.
- **Per què importa**: en una subhasta al primer preu el que convé és pujar per davall de la valoració (i A i C són hipotètics); els trams de l'OA keynesiana no s'ensenyen a U8 (SRAS lineal + LRAS); entre 2018 i 2024 l'IPC va pujar ≈ 19 %: el preu real del tabac **va baixar** i la demanda es va desplaçar, de manera que el "càlcul d'elasticitat" no identifica res (just el que la unitat ensenya a evitar).
- **Proposta**: regla del segon preu (paga la segona puja més alta), que fa dominant pujar el valor real, i premi no vinculat a la nota; reformular el pas 3 amb bretxa recessiva/inflacionista; presentar les dades de fiscalitat com a hipotètiques *ceteris paribus* o remetre a l'activitat d'investigació, que ja ho fa bé.
- **Confiança**: Alta (teoria de subhastes, contingut de U8); Mitjana (IPC acumulat).

#### ECO1-D18 · Mitjà · Coherència entre peces — Cost d'oportunitat definit de dues maneres
- **On**: `tests/01-economia-ciencia-social.md:95`; `libro/02-toma-decisiones-economicas.mdx:112, 116`; `tests/02-toma-decisiones-economicas.md:16-20` (vegeu també EEAE-D02)
- **Evidència**: U1: «¿Cuál es el coste total de la decisión, sumando coste explícito y coste de oportunidad…?» (el curs de 300 € queda fora del cost d'oportunitat). U2: «el coste de oportunidad incluye el salario que habría cobrado durante esos cuatro años, no solo el precio de las matrículas» i test «19.500 € aproximadamente (matrículas más salario sacrificado)».
- **Per què importa**: és el concepte més bàsic del curs; segons l'ítem, la resposta "correcta" canvia.
- **Proposta**: adoptar la definició estàndard (Mankiw, Krugman): el cost d'oportunitat inclou els costos explícits i implícits de la millor alternativa; a U1 Q13: «¿Cuál es el coste de oportunidad total (explícito + implícito)?» → 1.200 €.
- **Confiança**: Alta.

#### ECO1-D19 · Mitjà · Disseny didàctic — Temps de lectura poc realistes i materials per unitat que superen les sessions sense cap itinerari suggerit
- **On**: `libro/02:57` («~25 min», 7.231 paraules sense deck), `libro/01:56` («~25 min», 6.189), `libro/05:64` («35-40 min», 5.851), `libro/12:77` («45-50 min», 8.837); `programacion/programacion.mdx:78-104`
- **Evidència**: U5 (5-6 sessions): activitats 90 + 55 + 55 + 55 + 20-30 min, dinàmica 15-20, repte 20-25 i test 12-15 → ≈ 330-355 min (≈ 6 sessions de 55 min) abans de llegir i explicar la unitat i els 3 exercicis resolts.
- **Per què importa**: el docent no pot usar-ho tot i ningú li diu què prioritzar; el temps de lectura (≈ 200 paraules/min en text expositiu dens) condiciona la planificació: U2 són ≈ 35 min, no 25.
- **Proposta**: recalcular els temps de lectura amb un mateix criteri; afegir a cada unitat un «itinerario mínimo» (p. ex. U5: sessions 1-4 llibre + 5.1-5.3; sessió 5, una activitat —joc o investigació—; sessió 6, test/repte) i marcar la resta com a opcional; retallar U10-U12 (74-86 KB), com ja proposava el diagnòstic de maig.
- **Confiança**: Alta (recomptes); Mitjana (velocitat de lectura).

#### ECO1-D20 · Mitjà · Rigor — Fonts i atribucions poc fiables: títols inexistents, comptes no verificats i crèdits d'imatge contradictoris
- **On**: `libro/05-elasticidad-aplicaciones.mdx:501, 531-533`; `libro/08-modelo-ad-as-ciclos.mdx:542-545`; «cuenta» de MirarFora a `libro/01:466`, `02:529`, `03:523`, `05:544`, `08:555`, `09:546`, `11:542`; crèdits de deck a `libro/02:590` (+ Nash), `04:554, 649, 671`, `05:604, 722, 773`, `09`, `11`, `12`
- **Evidència**: «El coste de oportunidad y otras 24 ideas económicas — Tim Harford (*The Undercover Economist*, 2005, ed. española)», mentre la mateixa unitat cita el mateix llibre com «El economista camuflado · Temas de Hoy, 2007»; «Macroeconomics: A Very Short Introduction — Partha Dasgupta · OUP, 2007» (el de Dasgupta és *Economics: A Very Short Introduction* i no tracta l'AD-AS); comptes com «@vrosales74 — Vicente Rosales», «@ramonCastroPer2», «@GGBengoechea» o «@levikul09» (compte d'X a ECO1 U1 i «Instagram / TikTok» a EEAE U1). Crèdits: llibre «Foto: Eduard Marmet, CC BY-SA 3.0» vs deck «Foto: dominio público»; Nash «Peter Badge / Typos1» vs «Elke Wetzig»; estanc «CarlosVdeHabsburgo, CC BY-SA 4.0» vs «Foto de dominio público» (≈ 10 casos greus).
- **Per què importa**: un títol inventat desacredita el material davant del docent; recomanar a menors comptes no verificats comporta risc de suplantació. Les diapositives són la peça que més circula, i «dominio público» per a una obra CC BY-SA incompleix la llicència.
- **Proposta**: corregir els títols; deixar només comptes institucionals o verificats (BdE, INE, Funcas, AIReF, Nada es Gratis, CNMV) amb data de verificació; generar el crèdit del deck a partir de les mateixes metadades de la figura del llibre (font única) i revisar-ne els ≈ 10 casos.
- **Confiança**: Alta (títols i crèdits contradictoris); Mitjana (comptes).

#### ECO1-D21 · Baix · To i format — Detalls diversos
- **On**: decks de U2-U5 («Nivel EBAU»); `libro/02:176-180`; `libro/05:524`; `libro/02:212, 461`; `libro/04:132`; `libro/11:176`; `libro/04` RealExample del oli; `libro/05:304`; `libro/05:516`; `programacion/programacion.mdx:135-138`
- **Evidència**: «Nivel EBAU» i «examen de Economía de selectividad» en una matèria que no s'examina a la PAU (i l'EBAU ara és PAU); a la bibliografia en castellà, «Reial Decret 243/2022, de 5 d'abril…»; «En la Unidad 7 veremos que la decisión clásica de la empresa… (ingreso marginal = coste marginal)» i «(Unidades 4 y 7)», però cap unitat ho desenvolupa; «bienes de Veblen… las trataremos brevemente en la Unidad 5» (U5 no en parla), i a la mateixa línia «Los dos efectos [sustitución y renta] empujan en la misma dirección» (només és cert per a béns normals; en els inferiors l'efecte renda va en contra, que és justament el mecanisme Giffen de U5); exercici 11.1 «economía cerrada sin sector público» amb un pla de despesa pública; «Andalucía… aproximadamente la mitad del mundial» (és Espanya qui en fa ≈ la meitat); «Cataluña aprobó en 2024 una nueva ley de zonas tensionadas… desplazamiento hacia alquiler turístico» (va aplicar la Llei estatal 12/2023; el desplaçament documentat és cap al lloguer de temporada; evidència discutida); Mankiw 9a ed. (2021) a U5; la programació no esmenta les fitxes de reforç i ampliació que sí existeixen.
- **Per què importa**: detalls d'estil i precisió que resten credibilitat.
- **Proposta**: «Nivel avanzado»; bibliografia en castellà; eliminar o complir les remissions; «en los bienes normales, los dos efectos empujan en la misma dirección»; «sin impuestos ni sector exterior»; «España produce cerca de la mitad del aceite mundial»; matisar el cas català; edicions noves; citar `refuerzo/` a «Atención a la diversidad».
- **Confiança**: Alta.

### Patrons de la passada ràpida
- **Estructura**: 12/12 unitats amb deck (29-32 diapositives), test (161 ítems: MC, V/F, numèric, relacionar), 5 activitats + 4 exercicis curts, 1 recurs, 12 dinàmiques (arbre de decisions, 15-20 min), 13 reptes (15-25 min) i 6 fitxes de reforç/ampliació. Tipologia d'activitats molt variada (ejercicio, caso, debate, dinámica, juego, investigación, gráfico, noticia, creativo, proyecto).
- **Claus de test**: cap índex fora de rang. Les errades es concentren en dades i definicions (U3 Q3, U5 Q2, U7 Q9, U8 Q6/Q14, U9 Q8, U10 Q9, U11 Q4, U12 Q3). A U2 hi ha un ítem ambigu (D12).
- **Exercicis resolts**: 26 refets; 21 nets; 5 amb problemes (12.1 crític; 11.3, 9.2c, 3.2, 8.1). El 2.2 descriu "tit for tat" amb una lògica de càstig permanent (grim trigger): matís menor.
- **Frescor de dades**: text de U3, U5, U7, U9, U11 i U12 actualitzat a 2025-2026 (SMI 2026, EPA T1-2026, IPC 2025, compte corrent 2024, dèficit 2025, OMC 166). Sense actualitzar: U8 (BCE, EPA, PIB, Gini, IDH, R+D), U10 (BCE, Euríbor, euro digital) i els tests. Algunes dades del "present" (IPC d'abril de 2026 = 3,2 % a U3 vs «en torno al 2 %» en el T1-2026 a U7) conviuen sense explicar-ne la diferència.
- **Paritat ES↔CA**: claus i xifres idèntiques en els 12 tests i en tots els fitxers del llibre, activitats, reptes i fitxes (només difereix el `slug`). Qualsevol correcció s'ha de fer als dos idiomes.
- **Llargària**: 5.851-8.837 paraules per unitat sense el deck; U10-U12 són les més llargues i han crescut des de maig.
- **Codis de sabers**: «Saberes LOMLOE: B.2, B.3» usen una numeració pròpia del material (el BOE no numera els sabers així). Convé indicar-ho en una nota.
- **Nota CCAA**: present al hub (`src/pages/[asignatura]/index.astro:55`) i al llibre imprimible; no a la introducció de U1 (a EEAE sí). Convé homogeneïtzar.
- **To i estètica**: plural i proper, sense emojis (0 en tot el contingut), sense to comercial.

### Estat del diagnòstic anterior
| Troballa (maig 2026) | Estat | Evidència |
|---|---|---|
| Passada massiva de xifres macro 2026 (~30-40) | **Parcial** | Fet a U3, U5, U7, U9, U11 i U12; pendent a U8 i U10 i als tests (D04, D05, D14) |
| Escurçar U10/U11/U12 (> 38 KB) | **Pendent** (agreujat) | 74 / 73 / 86 KB; 7.996 / 7.706 / 8.837 paraules |
| Bankia duplicat U3/U10 | **Parcial** | 6 mencions a U3, 3 a U10 |
| Card-Krueger complet només a U9 | **Parcial** | Eliminat a U2; U1 (3 mencions) i U5 (5, amb remissió a U9) |
| Diferenciar quota hipotecària U3 vs U11 | **Resolt** | 3.2 hipoteca fixa nova; 11.3 revisió variable (però amb errada de càlcul, D15) |
| Exercicis resolts nous (U2, U4, U5, U6, U7, U8, U10, U11) | **Resolt** | 2.2, 4.3, 5.3, 6.1, 7.3, 8.3, 10.1, 11.2 |
| Diagrames prioritaris (prospectiva, pes mort, Solow) | **Resolt** | `TeoriaProspectiva`, `PesoMuerto`, `IncidenciaImpuesto`, `DescomposicionSolow` |
| Remissió U4 → U5 (preu màxim) | **Resolt** | 4.1: «(Veremos casos reales… en la Unidad 5.)» |
| Matisar Frey-Osborne | **Resolt** | U12 cita Arntz et al. (2016) |
| Edicions bibliogràfiques | **Parcial** | U8 actualitzada; U5 manté Mankiw 9a (2021) i Krugman (2018) |
| Simulador AD-AS amb presets | **Parcial** | 4 presets genèrics (no «España 2008-2024» ni «2022»); problema nou de notació (D07) |
| Reforçar el diferenciador U2 | **Parcial** | Diagrama i *nudges* espanyols afegits, però amb el mite de la donació i sense avís de replicació (D06, D13) |

---

## Economía, Emprendimiento y Actividad Empresarial (`eeae-bach`)

**Resum.** EEAE és un curs **realment distint**, no un remix: de 2.231 frases del llibre, menys de l'1 % comparteix fragments literals amb ECO1 o EDMN (quasi totes són definicions bàsiques compartides), i el text és interdisciplinari (individualisme metodològic vs sociologia, utilitarisme, Sen, intel·ligència emocional i executiva, propietat industrial) i delimita l'abast amb remissions explícites. Les dades s'han actualitzat i les 121 claus de test són correctes. Les febleses són de disseny i coherència: s'avaluen continguts que el llibre no ensenya (punt mort), el cost d'oportunitat es defineix de manera contradictòria, els estudis de cas —nucli metodològic— no porten el cas, i la capa de recursos i eines reaprofitada d'ECO1/EDMN desborda l'abast panoràmic declarat. Una dinàmica proposa un dècim de loteria com a incentiu entre menors.

**Punts forts**
- Delimitació explícita i útil amb les matèries veïnes (p. ex. U4: «Para el análisis formal del flujo circular —incluyendo el modelo AD-AS, el multiplicador del gasto…— véase Economía 1.º Bach»; U9 envia el Canvas a EDMN).
- Nota curricular estatal + concreció de la CCAA a la introducció de U1 (`libro/01:78`), com demana el CLAUDE.md.
- Programació i pàgina d'avaluació amb la mateixa llista de CE (la del RD), i les activitats hi estan etiquetades de manera coherent.
- Matisos de rigor ja presents: Mischel i les rèpliques recents, Hawthorne «muy discutidos», Gardner «discutida pero influyente».
- Passada de dades feta: GEM 2024-2025, DIRCE 2025, IA en empreses de la UE 20 %, Spotify 290 M (2025), FRONTUR 2025, WEF 2025.
- Tests: 121 ítems amb claus correctes; tots els ítems numèrics de tests i reptes són correctes (1.102,50 €; 150.000 €; 1.000 u.; 6.749 €; 36.000 €…). Paritat ES↔CA completa.

**Unitats revisades a fons**
- U2 `src/content/asignaturas/eeae-bach/libro/02-decisiones-racionalidad-comportamiento.mdx` (+ deck, test, activitats `02-experimento-sesgos-decision` i `02-debate-eficiencia-equidad`, dinàmica `02-la-app-de-los-apuntes`, repte `02-decidir-bien-sesgos-equidad`, recurs `matriz-decision`; diff ES↔CA de llibre i test)
- U4 `libro/04-entorno-economico-financiero.mdx` (+ test, activitats `04-proyecto-finanzas-personales`, `04-caso-flujo-circular-local`, `ejercicio-u4-interes-compuesto-ahorro`, dinàmica `04-herencia-de-la-abuela`, repte `07-entorno-economico-financiero`, recursos `calculadora-presupuesto` i `calculadora-interes-compuesto`)
- U9 `libro/09-estrategia-competitividad-modelos-negocio.mdx` (+ test, activitats `09-caso-modelo-negocio-disruptivo` i `09-dafo-empresa-real`, dinàmica `09-dos-marcas-una-ciudad`, repte `05-estrategia-modelos-negocio`, recursos `business-model-canvas` i `punto-muerto`; contrast amb `edmn-2bach/libro/03-entorno-empresarial-estrategias.mdx`)

### Troballes

#### EEAE-D01 · Alt · Coherència entre peces — S'avalua el punt mort (i altres conceptes) que el llibre no ensenya en cap unitat
- **On**: `tests/09-estrategia-competitividad-modelos-negocio.md:85-89`; `retos/04-perfil-emprendedor-destrezas.mdx:~140-160` (unitat 5); `refuerzo/eval3-ampliacion.mdx:46, 58`; `refuerzo/eval1-refuerzo.mdx:12, 56-57`; `recursos/punto-muerto.md:3, 13`
- **Evidència**: test U9: «¿Cuántas unidades debe vender al mes para alcanzar el punto muerto…?»; repte (U5): «Bruno aplica lo que vio en clase de Economía… ¿Cuántas pulseras deben vender para llegar al punto muerto…?»; ampliació: punt mort + «margen de seguridad» i «Cita las tres preguntas que distinguen un modelo de negocio innovador…»; reforç: «efecto rebaño». El recurs diu: «En la Unidad 8 … al estudiar la estructura de costes». Als 10 fitxers del llibre no apareix ni «punto muerto», ni «umbral de rentabilidad», ni «costes fijos», ni «efecto rebaño»; les «tres preguntas» del llibre (U9:130) són unes altres.
- **Per què importa**: el test i les fitxes pregunten el que la unitat no ensenya (i la fitxa de reforç, pensada per a qui va més just, n'introdueix de nous). El punt mort és teoria funcional d'EDMN, que el mateix `curriculum-eeae-bach.md` §6 vol fora d'EEAE.
- **Proposta**: o bé un Callout breu a U8 («Costes fijos, variables y punto muerto: la cuenta mínima de quien emprende») amb un exemple resolt, o bé retirar el punt mort del test U9, del repte 04 i de l'ampliació i desvincular el recurs de U8. Afegir l'«efecto rebaño» al llibre (U2) o treure'l del reforç; alinear les «tres preguntas» amb U9:130.
- **Confiança**: Alta.

#### EEAE-D02 · Alt · Rigor + Coherència — Cost d'oportunitat: el repte 01 nega que la matrícula en forme part; el reforç d'EEAE i ECO1 diuen que sí
- **On**: `retos/01-ciencia-economica-mirada-interdisciplinar.mdx:64, 68`; `refuerzo/eval1-refuerzo.mdx:28, 43`; `libro/01-economia-problema-escasez.mdx:129`; `eco-1bach/libro/02-toma-decisiones-economicas.mdx:112`
- **Evidència**: repte: «(no incluyas la matrícula)… La matrícula (3 × 1.200 = 3.600 €) es un coste contable explícito, **no un coste de oportunidad**». Reforç: «El coste de oportunidad incluye lo que *gasta* y lo que deja de ganar… 9 € + 14 € = 23 €» i «Coste de oportunidad total = 800 + 9.000 = 9.800 €». U1: «No es un coste que aparezca en una factura». ECO1 U2: «incluye el salario… no solo el precio de las matrículas».
- **Per què importa**: tres criteris per al concepte central del bloc A; la correcció d'un examen dependrà de quina peça haja estudiat l'alumne. Els manuals de referència inclouen la matrícula en el cost d'oportunitat d'estudiar.
- **Proposta**: definició única per a EEAE i ECO1: «el valor de la mejor alternativa a la que se renuncia, que incluye costes explícitos (lo que pagas) e implícitos (lo que dejas de ganar)»; corregir el repte 01 (39.600 € en tres anys, o preguntar només pel «coste implícito») i matisar U1:129.
- **Confiança**: Alta.

#### EEAE-D03 · Alt · Disseny didàctic (adequació a l'edat) — Una dinàmica proposa un dècim de loteria de Nadal com a incentiu entre alumnes menors
- **On**: `actividades-dinamicas/02-la-app-de-los-apuntes.mdx:50, 53-55`
- **Evidència**: «(a) ofrecer un pequeño incentivo (**décimo de lotería de Navidad**) al primer alumno de cada clase que suba cinco apuntes»; el feedback només critica que és una motivació extrínseca temporal.
- **Per què importa**: el públic té 16-17 anys; la normativa de joc (Llei 13/2011) prohibeix la participació de menors en jocs d'atzar, i la prevenció del joc en adolescents és una prioritat de salut pública. Un recurs educatiu no hauria de presentar-lo com una opció raonable sense cap advertiment. No el marquem com a crític perquè és una opció d'un arbre de decisió i regalar un dècim és una zona grisa, però cal canviar-lo.
- **Proposta**: substituir-lo per un incentiu no vinculat a l'atzar («entrada de cine», «punto en un ranking visible»), o mantenir-lo com a opció dolenta amb un feedback explícit: «Además de extrínseco, es ilegal y poco ético: los menores no pueden participar en juegos de azar».
- **Confiança**: Mitjana-Alta.

#### EEAE-D04 · Mitjà · Rigor — Economia conductual: afirmacions exagerades o sense l'avís de replicació que la mateixa matèria sí fa en altres llocs
- **On**: `libro/02-decisiones-racionalidad-comportamiento.mdx:71-76` (i deck `:383`), `:234, 239` (i deck `:491`), `:352`; `libro/05-perfil-persona-emprendedora.mdx:118, 257, 316`; `tests/05-perfil-persona-emprendedora.md:48-55`; `actividades-dinamicas/02-la-app-de-los-apuntes.mdx:37, 55`
- **Evidència**: «**The Economist duplicó sus ventas** añadiendo una opción que nadie iba a comprar»; «El caso confirma la paradoja de Easterlin» / «El World Happiness Report lo confirma año tras año»; es recomana Ariely (*Las trampas del deseo*) sense avís; Dweck: «muestran que las personas con mentalidad de crecimiento afrontan mejor los fracasos y persisten más»; test: «Los experimentos de Hawthorne… **demostraron** sobre todo que…» (el llibre diu que «han sido muy discutidos»); dinàmica: «La economía del comportamiento lo llama 'efecto multitarea'» i «El diseño es el sesgo del anclaje».
- **Per què importa**: l'experiment d'Ariely va ser una elecció hipotètica amb un centenar d'estudiants del MIT, no les vendes de la revista; Easterlin és discutit (Stevenson i Wolfers, 2008; Deaton, 2008; Killingsworth, Kahneman i Mellers, 2023) i el WHR mostra una correlació forta amb la renda; els metaanàlisis de *growth mindset* troben efectes petits (Sisk et al., 2018); la reanàlisi de Levitt i List (2011) no confirma l'efecte Hawthorne. L'«efecte multitasca» (Holmström-Milgrom) no és la substitució de la motivació intrínseca (*crowding out*); el cas de l'app és sesgo de confirmació o atenció selectiva, no ancoratge.
- **Proposta**: «En un experimento de Ariely con estudiantes del MIT…» (titular sense «duplicó sus ventas»); «La paradoja de Easterlin es discutida…»; avís de replicació breu a Dweck i Ariely; test Hawthorne: «se interpretaron como…»; etiquetes correctes a la dinàmica.
- **Confiança**: Mitjana-Alta.

#### EEAE-D05 · Mitjà · Coherència entre matèries — La mateixa situació rep noms diferents a EEAE i ECO1, i hi ha definicions divergents
- **On**: deck `libro/02-decisiones-racionalidad-comportamiento.mdx:447` i `actividades/02-experimento-sesgos-decision.md:41-47` vs `eco-1bach/tests/02-toma-decisiones-economicas.md:88-92`; `libro/04-entorno-economico-financiero.mdx:140, 144, 318` vs `eco-1bach/libro/08:144`; `libro/09:203, 513` vs `edmn-2bach/libro/03-entorno-empresarial-estrategias.mdx:462`; `libro/02:156`
- **Evidència**: EEAE: «el equipo insiste en aguantar "después de todo lo invertido". ¿Qué sesgo actúa?» → «Aversión a la pérdida»; ECO1 etiqueta «ya he aguantado tanto, sería tirar lo invertido» com a «Falacia del coste hundido» (EEAE no ensenya mai el cost enfonsat). Oferta agregada: EEAE «el total … que las empresas del país son **capaces de producir**» vs ECO1 «que las empresas… están **dispuestas a producir… a cada nivel de precios**»; demanda agregada: «lo que compran desde el exterior» vs «exportaciones netas» al Callout següent. Porter: EEAE «Las dos vías clásicas» vs EDMN «tres formas de construir ventaja competitiva». EEAE: el BCE «solo dispone del tipo de interés» (ECO1 U11 explica QE/QT). EEAE U2 remet a ECO1 U2 per a «la teoría del consumidor, las curvas de indiferencia», que ECO1 no conté.
- **Per què importa**: al departament conviuen les dues matèries (i EDMN a 2n); definicions diferents per al mateix concepte confonen l'alumnat i el professorat.
- **Proposta**: afegir el cost enfonsat a EEAE U2 o reformular l'estímul («renunciar se siente como perder» sense «lo invertido»); OA: «lo que las empresas están dispuestas a producir; su techo es la capacidad productiva»; Porter: «dos tipos de ventaja (costes, diferenciación) y tres estrategias genéricas (con el enfoque)», igual que EDMN; «el principal instrumento es el tipo de interés»; corregir la remissió a ECO1.
- **Confiança**: Alta.

#### EEAE-D06 · Mitjà · Alineació LOMLOE (abast) — La capa de recursos i eines importada d'ECO1/EDMN desborda l'abast panoràmic que la matèria declara
- **On**: `recursos/equilibrio-mercado.md:3-5` vs `libro/01-economia-problema-escasez.mdx:85`; `recursos/business-model-canvas.md`; `libro/09-estrategia-competitividad-modelos-negocio.mdx:70, 128-133, 203, 313-317`; `docs/curriculum-eeae-bach.md` §6
- **Evidència**: U1: «No vamos a dibujar gráficos ni a hacer cálculos complicados —eso pertenece a otras materias», però el recurs de U1 és una calculadora d'equilibri amb «topes de precio y ver el exceso de oferta o de demanda». U9: el TL;DR anuncia «las herramientas de Porter —cinco fuerzas, tres estrategias genéricas— y el Business Model Canvas de Osterwalder»; el cos diu que el Canvas «se estudia en profundidad en EDMN 2BACH» i presenta «dos vías»; el recurs de la unitat és el Canvas complet de 9 blocs; s'insereix la matriu BCG (`HerramientaIsland componente="BCG"`) sense explicar-ne els quadrants.
- **Per què importa**: el text és distint i ben delimitat, però les eines el converteixen en un remix d'ECO1/EDMN i contradiuen la regla pràctica del currículum («cap gràfic… si una unitat comença a semblar microeconomia formal, està envaint el terreny d'Eco 1BACH»; «el BMC … no es desplega bloc a bloc»).
- **Proposta**: a U1, substituir la calculadora per un recurs qualitatiu (mecanismes d'assignació) o presentar-la com a opcional; a U9, presentar el Canvas com a «vistazo» (propuesta de valor, clientes, ingresos) amb enllaç a EDMN; treure la BCG o explicar-la en 3 línies; alinear el TL;DR amb el cos.
- **Confiança**: Alta.

#### EEAE-D07 · Mitjà · Disseny didàctic — Els estudis de cas, nucli metodològic de la matèria, no porten el cas
- **On**: `actividades/01-caso-escasez-recurso-real.md`, `03-caso-economia-circular-empresa.md`, `05-caso-persona-emprendedora-real.md`, `07-caso-empresa-social.md`, `08-caso-cultura-empresarial.md`, `09-caso-modelo-negocio-disruptivo.md:10`, `09-dafo-empresa-real.md:10`
- **Evidència**: «Dosier de una empresa con un modelo de negocio reconocible y documentado…, **curado por el profesor**» (i equivalents a 7 de les 20 activitats).
- **Per què importa**: el currículum del projecte fa de l'«estudi de casos reals» el fil conductor; tal com està, cada sessió exigeix preparar diversos dossiers (un per grup). A ECO1 els casos porten les dades a la fitxa (p. ex. `11-espana-2008-2014-rescate.md`).
- **Proposta**: incloure 3-4 dossiers breus per activitat (1 pàgina amb fonts), o reaprofitar els `RealExample` del llibre (MUD Jeans, La Fageda, Buurtzorg, Airbnb, Spotify, Mercadona/Carrefour) com a dossiers imprimibles.
- **Confiança**: Alta.

#### EEAE-D08 · Mitjà · Disseny didàctic + Alineació — El projecte emprenedor del curs, promès a la programació, no està articulat; poca varietat d'activitats
- **On**: `programacion/programacion.mdx:116, 150-158`; `actividades/10-proyecto-empresa-futuro.md`; `actividades/07-proyecto-mision-vision-equipo.md`; carpeta `eeae-bach/` sense `proyecto/`
- **Evidència**: «El curso culmina en un **proyecto emprendedor propio** en el que el alumnado define una idea, un perfil de equipo, una misión y visión, y un primer modelo de negocio, presentado y defendido en público». El projecte de tancament real és «rediseña una empresa **real** para el futuro». No hi ha quadern de projecte (GPE sí que en té). Tipologia: 8 casos, 5 debats, 4 projectes, 3 dinàmiques, 1 exercici; cap investigació, gràfic, notícia, joc ni creatiu; 2 activitats per unitat (U9: dos «caso»).
- **Per què importa**: la situació d'aprenentatge central de la programació (ABP) no té suport; per a una matèria teoricopràctica, la varietat és menor que a ECO1.
- **Proposta**: un quadern de 5 fases (idea → perfil d'equip → missió/visió → proposta de valor i ingressos sense Canvas complet → pitch) repartit entre U5 i U10, o enllaç al quadern de GPE adaptat; afegir almenys una activitat d'investigació amb dades (GEM, DIRCE) i una de notícia.
- **Confiança**: Alta.

#### EEAE-D09 · Mitjà · Alineació LOMLOE — Etiquetes de CE incompletes i codis de sabers presentats com si foren del BOE
- **On**: `actividades-dinamicas/*.mdx:10`; `actividades/02-debate-eficiencia-equidad.md`, `actividades/08-debate-liderazgo-talento.md` (sense camp); `programacion/programacion.mdx` (taula CE × unitats); `libro/09-estrategia-competitividad-modelos-negocio.mdx:88`
- **Evidència**: les 10 dinàmiques porten `competencias_especificas: [CE2]` (p. ex. «Laura no quiere liderar» → hauria de ser CE4; «IA en el negocio familiar» → CE6); dues activitats sense CE; la programació assigna CE3 a U9 i U10, però cap activitat d'eixes unitats porta CE3; «El RD 243/2022 sitúa estos contenidos en los saberes C.2…, C.5… y C.6».
- **Per què importa**: les etiquetes són l'enllaç amb l'avaluació competencial; «C.5» és numeració del material, no del Reial Decret.
- **Proposta**: etiquetar cada dinàmica amb la CE de la seua unitat; completar les dues activitats; «En la numeración de este material (saberes C.2, C.5, C.6)…».
- **Confiança**: Alta (etiquetes); Mitjana (numeració del BOE, no consultat).

#### EEAE-D10 · Mitjà · Rigor — Comptes i podcasts recomanats a menors que no hem pogut verificar
- **On**: `libro/01-economia-problema-escasez.mdx:333-335`; `libro/02:365`; `libro/04:396-398`; `libro/09:405-407`
- **Evidència**: «@levikul09 — Instagram / TikTok» (a ECO1 U1 el mateix compte és «X / Twitter»); «@ArielRubinstein — X / Twitter»; «@GGBengoechea», descrit ací com a «economía monetaria y financiera» i a ECO1 com a «coyuntura macro»; «spicy4tuna — Podcast valenciano sobre fundadores tecnológicos del sur de Europa».
- **Per què importa**: les descripcions divergents del mateix compte fan pensar que no s'han verificat; recomanar comptes a menors exigeix comprovar que existeixen, que són de qui diuen i que el contingut és adequat (els *finfluencers* són un risc conegut).
- **Proposta**: com a ECO1-D20: només comptes verificats o institucionals (CNMV Educa, Finanzas para Todos, BdE, GEM España, ONU-ODS), amb data de verificació.
- **Confiança**: Mitjana.

#### EEAE-D11 · Baix · Rigor i dades — «18 meses» per a un període de 14 mesos
- **On**: `libro/04-entorno-economico-financiero.mdx:72-75`
- **Evidència**: «El BCE subió los tipos del 0 % al 4,5 % en 18 meses» i, al mateix bloc, «Entre julio de 2022 y septiembre de 2023»; «la inflación bajó al 2,5 % a finales de 2024».
- **Per què importa**: contradicció interna copiada d'ECO1 (U11:90). L'IPCA de la zona euro de desembre de 2024 va ser ≈ 2,4 %.
- **Proposta**: «en 14 meses»; «≈ 2,4 %».
- **Confiança**: Alta (14 mesos); Mitjana (2,4 %).

#### EEAE-D12 · Baix · Coherència entre peces — Casos repetits que el diagnòstic de maig demanava consolidar
- **On**: `libro/03` (Patagonia, 10 mencions), `libro/07` (7), `libro/08:223` (Callout «Liderazgo que da ejemplo: Patagonia»); `libro/08:138` i `libro/09` (Kodak); `tests/08-empresa-y-su-actividad.md:24`, `tests/09-estrategia-competitividad-modelos-negocio.md:56`
- **Evidència**: Patagonia a tres unitats; Kodak reduït a U8 però encara amb dos ítems de test («El caso de Kodak muestra sobre todo que…» i «El caso de Kodak, que inventó la cámara digital…»).
- **Per què importa**: repetició que resta espai a casos nous (i EDMN U3 també usa Patagonia).
- **Proposta**: Patagonia només a U7; a U8, un altre cas de lideratge (p. ex. Buurtzorg, que ja hi és); deixar un sol ítem sobre Kodak.
- **Confiança**: Alta.

#### EEAE-D13 · Baix · To i format — Detalls diversos
- **On**: `libro/09:144, 82`; `actividades/ejercicio-u4-interes-compuesto-ahorro.md` (nota de l'enunciat); capçaleres de lectura (`libro/07:56`, etc.); `src/lib/asignaturas.ts:194` + `src/pages/[asignatura]/index.astro:55`
- **Evidència**: «De vender DVD a la suscripción: el giro de Spotify» (Spotify no ha venut mai DVD; el text parla de discos); una línia solta «> - Aplicar un análisis interno y externo y un DAFO empresarial…» després del CasoDilema de U9; la nota de l'exercici diu que cada aportació «genera intereses durante 1 año completo», contradient la capitalització de la solució; «~25-28 min» de lectura per a unitats de 4.736 a 7.392 paraules (U7, 7.392 paraules: «~26 min»); el hub diu «currículo básico estatal … establecido en el Real Decreto 243/2022 · Decret 108/2022, mod. Decret 103/2026 (CV)».
- **Per què importa**: detalls de precisió i de planificació.
- **Proposta**: «De vender discos…»; esborrar la línia solta; «cada aportación capitaliza hasta el final del año 5»; recalcular els temps de lectura; al hub, separar «currículo estatal (RD 243/2022)» de la «concreción CV».
- **Confiança**: Alta.

### Patrons de la passada ràpida
- **Estructura**: 10/10 unitats amb deck (26-30 diapositives), test (121 ítems, 12-13 per unitat, només 4 de numèrics), 2 activitats per unitat (U4: 3 + 1 exercici), 1-2 recursos, 10 reptes (15-20 min), 10 dinàmiques i 6 fitxes de reforç/ampliació.
- **Tests**: claus correctes; predominen el record i la comprensió. Poca exigència d'aplicació, coherent amb la matèria, però els pocs ítems d'aplicació pregunten continguts no ensenyats (D01).
- **Solapament**: < 1 % de frases amb fragments literals compartits amb ECO1/EDMN (definicions d'escassetat, cost d'oportunitat, externalitat; una frase de Patagonia amb EDMN U3). Diagrames reaprofitats: `TeoriaProspectiva`, `FlujoCircular`, `PorterForces`, `DAFOGrid`.
- **Frescor de dades**: bona (GEM 2024-25, DIRCE 2025, Eurostat IA 2025, FRONTUR 2025, Spotify 2025).
- **Tipologia**: sense investigació, gràfic, notícia, joc ni creatiu; 7/20 activitats depenen de dossiers a preparar pel docent.
- **Paritat ES↔CA**: completa en claus i xifres.
- **To**: plural i proper, amb el «tú» dirigit a l'alumne; sense emojis; cap to comercial.
- **Temps de lectura**: el mateix «~25-28 min» per a qualsevol llargària.

### Estat del diagnòstic anterior
| Troballa (maig 2026) | Estat | Evidència |
|---|---|---|
| Nota LOMLOE / CCAA a la introducció | **Resolt** | `libro/01:78` |
| IA a la UE 13,5 % → 20 % (U10) | **Resolt** | titular de U10 «El 20 % de las empresas europeas…» |
| Spotify 200 M → 263/290 M (U9) | **Resolt** | «290 millones… (263 millones al cierre de 2024)» |
| DIRCE 2024 → 2025 (U8) | **Resolt** | «datos a 1 de enero de 2025» |
| WEF Future of Jobs 2025; GEM 2024-2025 | **Resolt** | U10:294; U5/U6 bibliografia |
| «esperit», títol «Glovo no, Wallapop», DAFO atribuït a Osterwalder (U6) | **Resolt** | ja no hi apareixen; bibliografia reformulada |
| Unificar la franja d'edat del GEM (U5/U6) | **Parcial** | «a partir de los 35» (U5) vs «35-54» i «edad media… supera holgadamente los cuarenta» (U6) |
| Patagonia ×3 | **Pendent** | U3, U7 i Callout a U8 (D12) |
| Kodak ×2 (U8/U9) | **Parcial** | U8 reduït a Callout amb remissió; dos ítems de test (D12) |
| Lideratge repetit U5/U8 | **Resolt** | U8:213 remet a U5 |
| RSC/stakeholders redefinits a U10 | **Resolt** | U10:233 «Definimos… en la Unidad 9» |
| Diagrames a U7 i U10 | **Resolt** | U7: 2 `<Diagram>`; U10: 1 |
| Remissions explícites a EDMN/ECO1 | **Resolt**, amb una remissió inexacta | U4, U9; però U2:156 (D05) |

---

## Top 5 del grup
1. **ECO1-D01** — Refer l'exercici resolt 12.1 (ES i CA): la demostració dels guanys del comerç és numèricament falsa; alinear-lo amb l'activitat `12-ventaja-comparativa-dos-paises`, que sí que ho fa bé.
2. **ECO1-D02** (+ EEAE-D09) — Una sola numeració de CE, la del RD que ja mostra `evaluacion.mdx`, a la programació, les activitats, les dinàmiques i els reptes.
3. **ECO1-D03** — Unificar les fases del cicle i "depresión" (llibre, diagrama, test Q6/Q14, reforç) i treure l'atribució de les quatre fases al NBER/CEPR.
4. **ECO1-D04 + ECO1-D05** — Un únic bloc de dades 2026 (BCE, Euríbor, EPA, PIB 2020, recuperació, deute, OMC, euro digital), reutilitzat a U3/U7/U8/U10/U11 i als tests.
5. **EEAE-D01 + EEAE-D02** — Deixar d'avaluar el punt mort (o ensenyar-lo a U8) i fixar una definició única de cost d'oportunitat (costos explícits + implícits), comuna a EEAE i ECO1.
