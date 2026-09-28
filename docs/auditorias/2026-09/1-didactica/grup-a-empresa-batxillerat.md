# Auditoria didàctica — Grup A: Empresa (Batxillerat)

> Annex de l'[auditoria didàctica](./README.md) · setembre de 2026 · revisió de només lectura sobre `main` (`876e002`).

> Annex de l'[auditoria didàctica](./README.md) · setembre de 2026 · revisió de només lectura sobre la branca de treball (`1e054d4`).

> Auditoria de només lectura feta el 2026-09-28 sobre `edmn-2bach` (Empresa y Diseño de Modelos de Negocio, 2.º Bach, RD 243/2022) i `gpe-bach` (Gestión de Proyectos de Emprendimiento, optativa pròpia de la Comunitat Valenciana, Decret 108/2022, mod. Decret 103/2026). Sense accés a la xarxa: la normativa i les dades externes s'avaluen amb coneixement propi i s'indica la confiança. Quan no n'hi ha prou, es recomana verificar-ho al BOE/DOGV abans de corregir. No s'ha modificat cap fitxer del repositori.
>
> **Mètode**. Lectura sencera de 3 unitats per matèria: llibre + bloc ```` ```deck ````, test, ≥3 activitats de tipus diferents, dinàmica, recurs i lògica de càlcul, i repte. Passada ràpida de la resta. A més, amb scripts de lectura:
> 1. **Tots els exercicis resolts** dels llibres i del quadern PAU, refets a mà i amb Python.
> 2. Bolcat de les **claus dels 19 tests** (104 ítems d'opció múltiple a EDMN i 63 a GPE), amb anàlisi de la posició i la llargària de la clau.
> 3. Contrast del quadern `ebau/` amb els PDF de la PAU valenciana de 2024 i 2025 de `public/ebau-examenes/comunidad-valenciana/`.
> 4. Paritat ES↔CA de **tots** els fitxers de les dues matèries (xifres i claus), i diff estructural complet d'EDMN U11 i GPE U3 (llibre + test). Estructura, xifres i claus són idèntiques, de manera que **qualsevol errada del castellà també és al valencià**.
> 5. Lectura de la lògica de `VANTIRCalc.tsx`, `RatiosCalc.tsx`, `FormaJuridicaCalc.tsx`, `src/lib/calc/forma-juridica.ts`, `src/lib/calc/irpf.ts` i `FormaJuridicaTree.astro`.
>
> Les rutes són relatives a `src/content/asignaturas/<slug>/` quan no comencen per `src/`, `public/` o `docs/`.

---

## Empresa y Diseño de Modelos de Negocio (`edmn-2bach`)

**Resum.** És el paquet més dens de la plataforma i el més orientat a la PAU. Té 12 unitats amb deck, test, 5 activitats i 1-2 exercicis curts per unitat, 12 dinàmiques, 12 reptes, 6 fitxes de reforç/ampliació i un quadern de projecte. El quadern PAU (guia, teoria, qüestions, 13 problemes resolts i 2 simulacres) reprodueix bé el model valencià de 2025. L'aritmètica dels exercicis resolts és majoritàriament neta. Els problemes greus són de **claus i de normativa**:
- Dues claus del simulacre 1 ensenyen coses falses: el marge de seguretat i la font «interna-ajena».
- El llibre diu que el PGC té «nueve principios», però en té sis.
- El llindar de 3.000 € i la SLFS encara són a l'arbre de decisió compartit, al deck i a una clau.

A més, hi ha dos problemes estructurals: una numeració de CE inventada que conviu amb la del RD, i el model valencià d'«EBAU» presentat com si fos el de tot l'Estat.

**Punts forts**
- **Quadern PAU alineat amb exàmens reals.** `ebau/00-guia-prueba.mdx` descriu exactament l'estructura dels exàmens valencians de juny i juliol de 2025: 6 qüestions, 2 d'elles competencials obligatòries, i 2 exercicis. Els 13 problemes d'`ebau/03-problemas-resueltos.mdx` són correctes, inclosa la TIR a dos anys per equació de segon grau (16,6 %). El simulacre 2 també és net.
- **Nucli quantitatiu sòlid.** Quadren els exercicis resolts 6.1, 6.2, 7.1, 7.2, 8.1, 9.3, 10.2, 11.1 i 12.1. També quadren `09-tres-inversiones-van-tir.md` (VAN 15.617 / 42.061 / 39.543; TIR 14,5 / 18,5 / 16,5 %) i `ejercicio-u9-van-tir-payback.md`. La bisecció de `VANTIRCalc.tsx` és correcta, i els reptes 05, 11 i 12 tenen les xifres netes.
- **Arquitectura didàctica rica i homogènia.**
  - Components: `CasoDilema`/`VuelveAlCaso`, `PistaEbau` amb criteris de puntuació, glossari, `MirarFora` i `VocesDesacuerdo`.
  - Activitats de tipologia variada i amb rúbrica.
  - Dissenys molt bons, com el debat `02-debate-cooperativa-vs-capitalista.md` (cada argument s'ha de lligar a una decisió, diners o risc) o `11-grafico-cinco-anos-de-ratios.md`.
- **La reforma de l'SL (Ley 18/2022) ja és al text principal** (U2 l. 210) i a la lògica de la calculadora (`src/lib/calc/forma-juridica.ts`, `capitalMinimo: 1`).
- **Bona part del diagnòstic de maig està resolta**: Borden/McCarthy, firma personal, «30x», diagrames d'U10/U11 i exercicis resolts nous a U2, U8, U9 i U12.
- **Paritat ES↔CA completa.** El to és plural i proper, sense emojis ni to comercial.

**Unitats revisades a fons**
- **U9** `libro/09-funcion-financiera.mdx`:
  - deck i `tests/09-funcion-financiera.md`;
  - activitats `09-tres-inversiones-van-tir`, `09-juego-la-cartera-de-inversiones-con-dado` i `ejercicio-u9-van-tir-payback`;
  - dinàmica `09-financiacion-heladeria`;
  - recurs `calculadora-van-tir` + `src/components/calculadoras/VANTIRCalc.tsx`;
  - repte `11-financiacion-van-tir`;
  - fitxes `refuerzo/eval3-*`, `ebau/03` i `ebau/04`.
- **U11** `libro/11-analisis-estados-financieros.mdx`:
  - deck i test;
  - activitats `11-radiografia-inditex`, `11-ejercicio-ratios-fondo-maniobra`, `11-grafico-cinco-anos-de-ratios` i `ejercicio-u11-rentabilidad-fondo-maniobra`;
  - dinàmica `11-analisis-financiero-hotelito`;
  - recurs `calculadora-ratios` + `RatiosCalc.tsx`;
  - repte `05-analisis-previsional-viabilidad`;
  - diff ES↔CA de llibre i test.
- **U2** `libro/02-tipos-empresas-organizacion.mdx`:
  - deck i test;
  - activitats `02-elegir-forma-juridica`, `02-caso-cambio-forma-juridica` i `02-debate-cooperativa-vs-capitalista`;
  - dinàmica `02-forma-juridica-mercadillo`;
  - recurs `forma-juridica` + `FormaJuridicaCalc.tsx`, `src/lib/calc/forma-juridica.ts`, `src/lib/calc/irpf.ts` i `src/components/diagrams/FormaJuridicaTree.astro`;
  - repte `06-dimension-forma-juridica`.
- **Revisió parcial**:
  - U10 i U7 (exercicis resolts i seccions citades);
  - el quadern `ebau/` sencer;
  - `programacion` i `evaluacion`;
  - `reto/intro.mdx` i `proyecto/00-equipo-y-empresa.mdx`.

### Troballes

#### EDMN-D01 · Crític · Rigor i dades — La clau del simulacre 1 calcula el marge de seguretat sobre el punt mort i diu que les vendes poden caure un 25 % (només poden caure un 20 %)
- **On**: `ebau/04-simulacros.mdx:150-155` (i el bessó CA); `libro/07-funcion-productiva.mdx:234-236` (i el deck).
- **Evidència**:
  - La clau diu: «Margen de seguridad = (Ventas − Q*) / Q* = (1.000 − 800) / 800 = 0,25 = 25 %» (l. 150). Continua: «Las ventas podrían caer hasta un 25 % antes de entrar en pérdidas» (l. 153). El repartiment dona «0,5 puntos por el margen de seguridad (25 %)» (l. 155).
  - Les dades de l'enunciat són P = 25 €, CVu = 10 € i CF = 12.000 €. Amb una caiguda del 25 % es venen 750 u: 750 × 15 − 12.000 = **−750 €**. La caiguda màxima possible és (1.000 − 800) / 1.000 = **20 %**.
  - El llibre defineix el marge sobre la demanda (l. 234: «(Demanda − Q*) / Demanda × 100»). Però la l. 236 afirma: «Un margen de seguridad del 30 % significa que la demanda real es un 30 % mayor que el punto muerto: la demanda podría caer hasta un 30 %». Amb la fórmula del mateix llibre, un 30 % vol dir que la demanda supera el punt mort en un 43 %.
- **Per què importa**: és la clau amb què l'alumnat s'autocorregeix un exercici de 2 punts. Ensenya una fórmula diferent de la del llibre i una interpretació falsa que un corrector de la PAU penalitzaria.
- **Proposta**:
  - Simulacre, l. 150: «(Ventas − Q*) / Ventas = 200 / 1.000 = 20 %».
  - Simulacre, l. 153: «podrían caer hasta un 20 %».
  - Simulacre, l. 155: «(20 %)».
  - U7, l. 236: «Un margen de seguridad del 30 % significa que las ventas pueden caer un 30 % antes de entrar en pérdidas (la demanda supera el punto muerto en un 43 %)».
  - Si es vol mantindre la variant «respecto al punto muerto» de l'enunciat (l. 87), cal llegir-la com «las ventas superan el punto muerto en un 25 %» i afegir la caiguda màxima (20 %).
  - Tot als dos idiomes.
- **Confiança**: Alta.

#### EDMN-D02 · Crític · Rigor i dades — La clau del simulacre 1 posa les amortitzacions acumulades com a exemple de finançament «interna-ajena»
- **On**: `ebau/04-simulacros.mdx:118`. Contrasta amb `libro/09-funcion-financiera.mdx:320, 325-330` i `ebau/02-cuestiones-teoricas.mdx:179`.
- **Evidència**:
  - La clau diu: «(interna-propia: reservas/autofinanciación; externa-propia: ampliación de capital; externa-ajena: préstamo bancario; interna-ajena: amortizaciones acumuladas)».
  - El llibre diu el contrari. A la l. 320: «| **Interna** | Beneficios reinvertidos (autofinanciación) | (no aplica habitualmente) |». A les l. 326-330: «La **autofinanciación** son los beneficios que la empresa retiene y reinvierte (reservas) y las amortizaciones … Es **interna**» i «toda autofinanciación es financiación propia».
  - El mateix quadern també ho contradiu: «la autofinanciación es siempre propia» (l. 179).
- **Per què importa**: la clau dona per correcta una classificació que el llibre i el mateix quadern consideren errònia. La PistaEbau d'U9 avisa que aquesta confusió «cuesta 0,5-1 punto».
- **Proposta**: dues opcions.
  - Substituir-ho per «interna-ajena: categoría prácticamente vacía; algunos manuales incluyen aquí las provisiones para riesgos y gastos. Las amortizaciones son autofinanciación de mantenimiento (interna-propia)».
  - O traure la quarta casella de la rúbrica i puntuar només les tres combinacions reals.
- **Confiança**: Alta per a la contradicció interna. Mitjana sobre com tracten les provisions els diferents manuals.

#### EDMN-D03 · Crític · Rigor i dades — «Nueve principios contables»: el PGC 2007 en fixa sis (regressió induïda pel diagnòstic de maig)
- **On**: `libro/10-informacion-contable.mdx:293, 295-299, 347`; deck, l. 564 i 582 (i els bessons CA).
- **Evidència**:
  - El llibre diu: «establece nueve **principios contables obligatorios**, de los cuales conviene reconocer al menos cinco» (l. 293) i «Los **nueve principios contables** dan validez a las cuentas» (l. 347).
  - El deck repeteix: «Para eso fija nueve principios» (l. 564) i «No es uno de los nueve principios…» (l. 582).
  - El marc conceptual del PGC 2007 (RD 1514/2007) en fixa **sis**: empresa en funcionament, meritació, uniformitat, prudència, no compensació i importància relativa.
  - Els nou eren els del PGC de 1990, que hi afegia registre, preu d'adquisició i correlació d'ingressos i despeses.
  - La unitat en llista cinc (l. 295-299) i omet la importància relativa.
  - `docs/diagnostico-edmn-2bach.md` (U10, rec. 3) demanava «Listar los 9».
- **Per què importa**: «enumera i explica els principis comptables» és una qüestió clàssica de la PAU. L'alumnat aprendria un nombre fals i buscaria quatre principis que ja no existeixen.
- **Proposta**:
  - Escriure «establece seis principios contables obligatorios».
  - Afegir «6. **Importancia relativa**: se admite no aplicar estrictamente algún principio cuando el efecto es escasamente significativo y no altera la imagen fiel».
  - Corregir la l. 347, el deck i el glossari.
  - Marcar com a errònia la recomanació del diagnòstic.
- **Confiança**: Alta.

#### EDMN-D04 · Crític · Rigor i dades — Capital de l'SL: el llindar de 3.000 € i la SLFS encara són a l'arbre de decisió compartit, al deck, a una clau i al quadern PAU
- **On**:
  - `libro/02-tipos-empresas-organizacion.mdx:210, 298, 312, 331, 386, 427`; deck, l. 640 i 666;
  - `src/components/diagrams/FormaJuridicaTree.astro:29` (CA l. 55), inserit a U2 (l. 322) i també a GPE U3, IPE2 U9, Eco 4ESO U10 i Taller 3ESO U6;
  - `actividades/02-elegir-forma-juridica.md:29, 50`;
  - `actividades-dinamicas/02-forma-juridica-mercadillo.mdx:50`;
  - `ebau/02-cuestiones-teoricas.mdx:53`.
- **Evidència**:
  - L. 298: «Si tienes menos de 3.000 € y no te puedes acoger a SLFS, autónomo».
  - L. 312: «¿Capital disponible < 3.000 €? ¿Sí? → autónomo». L'arbre diu el mateix: «¿Capital < 3.000 €?».
  - L. 331 i deck l. 666: «De SLFS a SL ordinaria — automática una vez la empresa alcanza los 3.000 €».
  - L. 386: «depósito del capital social (mínimo 3.000 €)».
  - Glossari (l. 427): «capital mínimo de 3.000 € (o 1 € en régimen Crea y Crece)».
  - Dinàmica: «Sociedad Limitada — capital mínimo 3.000 €». Quadern PAU: «(1 €/3.000 € según régimen)».
  - La clau de `02-elegir` diu «Marina (academia) | **Autónoma** | Capital insuficiente para SL» per a una persona amb **4.000 €** (l. 29, 50). Seria errònia fins i tot amb la norma anterior.
  - La l. 210 afirma «los socios pierden lo invertido pero no más», sense el matís que sí que fa el recurs de GPE.
- **Per què importa**: des de la Ley 18/2022 el capital mínim de l'SL és d'1 €, sense cap «règim» alternatiu, i la SLFS ja no existeix. L'arbre porta l'alumne amb menys de 3.000 € cap a l'autònom, que té responsabilitat il·limitada, per un motiu que ha desaparegut. Com que el SVG és compartit, l'error es propaga a cinc matèries.
- **Proposta**:
  - A l'arbre, substituir el node per «¿Vais a asumir deudas o riesgos relevantes?» (criteri de responsabilitat).
  - Als textos: «capital mínimo 1 €; mientras el capital sea inferior a 3.000 €, hay que destinar al menos el 20 % del beneficio a reserva legal hasta llegar a 3.000 € entre capital y reserva, y en caso de liquidación con patrimonio insuficiente los socios responden solidariamente hasta completar 3.000 € (art. 4 LSC)».
  - Treure totes les mencions de la SLFS.
  - Corregir la clau de Marina: l'SL és possible i la tria depèn del risc i dels costos.
  - A `ebau/02`, l. 53: «1 € (desde 2022)».
- **Confiança**: Alta, tant per a la norma i les incoherències com per al matís de la reserva i la responsabilitat solidària.

#### EDMN-D05 · Alt · Rigor i dades — Palanquejament: la regla «RF > RE» compara una rendibilitat després d'impostos amb una d'abans (llibre, deck, test, calculadora i ampliació)
- **On**:
  - `libro/11-analisis-estados-financieros.mdx:150` (PistaEbau) i 300; deck, l. 560 i 569;
  - `tests/11-analisis-estados-financieros.md:40-47, 80-83`;
  - `src/components/calculadoras/RatiosCalc.tsx:41, 202-203, 260`;
  - `refuerzo/eval3-ampliacion.mdx:53`;
  - `libro/09-funcion-financiera.mdx:431`.
- **Evidència**:
  - **Llibre i deck.** El llibre defineix ROA = BAII / Actiu i ROE = BN / PN (després d'impostos). Tot i això, conclou: «Si **RF > RE**, el palanquejament és **positiu** … Si **RF < RE**, és **negatiu**» (l. 150, escrit en valencià dins del fitxer castellà). El deck diu: «Si RF > RE, apalancamiento positivo» (l. 560).
  - **Test.** Donat «ROA = 12 % y coste medio de la deuda = 5 %», la clau és «el ROE será superior al ROA» (l. 43). L'ítem V/F «Cuando la rentabilidad económica (ROA) es superior al coste medio de la deuda, el endeudamiento eleva la rentabilidad financiera (ROE) por encima del ROA» es dona per cert (l. 81-83).
  - **Contraexemple amb les mateixes dades.** Actiu 250.000, PN 200.000, deute 50.000 al 5 %, BAII 30.000 (ROA 12 %) i t = 25 %. El BN és 20.625 i el **ROE queda en el 10,3 %, per davall del ROA del 12 %**. Tot i així, el deute és favorable: la RF abans d'impostos és del 13,75 %.
  - **Exercici 11.2.** Diu «El apalancamiento sumó 4,9 puntos» (l. 300, deck l. 569). Abans d'impostos, el deute suma **10,5 punts** (22,5 % − 12 %). Els 4,9 punts són eixos 10,5 menys 5,6 punts d'impost.
  - **Calculadora.** `RatiosCalc` etiqueta «Apalancamiento (ROE − ROA)» i el dona per bo si `roe > roa`. Per tant, una empresa **sense deute** hi apareix amb palanquejament negatiu.
  - **Ampliació.** La indicació «(Para el ROA usa el beneficio neto por simplicidad.)» fa que ROE / ROA = Actiu / PN, que sempre és > 1. Així, la comparació ja no pot detectar mai un palanquejament desfavorable.
  - **U9.** La l. 431 diu que per davall del 60-65 % de deute «se desaprovecha apalancamiento», sense condicionar-ho a RE > i.
  - En canvi, el glossari d'U11 ho diu bé (l. 407): «Positivo si ROA > coste deuda».
- **Per què importa**: el criteri de palanquejament cau sovint a la PAU. La regla del llibre, del test i de la calculadora dona conclusions errònies en empreses poc endeutades, que són justament les que coneix l'alumnat.
- **Proposta**: una sola regla a tot arreu: «el endeudamiento es favorable si RE (BAII/Activo) > coste de la deuda; se comprueba comparando RE con la RF **antes de impuestos** (BAI/PN)». Aplicar-la a:
  - la PistaEbau, que a més cal traduir al castellà;
  - el deck;
  - el text de l'exercici 11.2: «antes de impuestos el apalancamiento suma 10,5 puntos; el impuesto resta 5,6»;
  - l'ítem V/F i la clau, o reformular-los amb la RF abans d'impostos;
  - la mètrica de `RatiosCalc`: RF abans d'impostos − RE, o RE − cost del deute;
  - l'ampliació: ROA calculat amb el BAII.
- **Confiança**: Alta.

#### EDMN-D06 · Alt · Alineació LOMLOE — Dues numeracions de CE incompatibles: la programació n'inventa sis i l'avaluació mostra les cinc del RD
- **On**:
  - `programacion/programacion.mdx:57-66`;
  - `evaluacion/evaluacion.mdx:5-60, 84, 90`;
  - `actividades/*.md` (camp `competencias_especificas`);
  - `actividades-dinamicas/*.mdx:10`;
  - `retos/*.mdx` (camp `competencia`);
  - diapositives de competències dels decks (p. ex. U9, l. 529);
  - `proyecto/00-equipo-y-empresa.mdx:20`.
- **Evidència**:
  - **Programació.** Diu «**CE4** — Gestionar las **áreas funcionales**…» i «**CE6** — **Comunicar y defender** un proyecto empresarial». Afirma que «Los códigos CE1-CE6 … siguen el orden en que el currículo básico estatal enuncia estas capacidades» (l. 66).
  - **Avaluació.** Diu que reprodueix «las cinco **competencias específicas** … fijadas por el Real Decreto 243/2022» (l. 84). Hi té CE4 «Valorar y seleccionar estrategias comunicativas…» i CE5 «Realizar el análisis previsional del modelo de negocio…».
  - **Activitats.** Segueixen la programació: U6-U9 → CE4 («àrees funcionals»); U10-U11 → CE5. Les 5 activitats d'U12 porten **CE6**, una competència que no existeix al RD.
  - **Reptes.** Els 01-05 segueixen el RD (04 pitch → CE4; 05 anàlisi previsional → CE5). Els 06-12 barregen les dues numeracions (08-10 màrqueting, producció i RRHH → CE4; 11 VAN/TIR → CE5).
  - **Dinàmiques.** Les 12 porten `[CE3]`.
  - **Projecte.** `proyecto/00` en fa una tercera versió: «CE1 (iniciativa emprendedora y trabajo en equipo) y CE2 (la empresa y su forma jurídica…)».
  - El test `src/content/competencias-especificas.test.ts` només comprova que cada codi siga ≤ la CE màxima de la programació. Per això no detecta cap d'aquests casos.
- **Per què importa**: la LOMLOE avalua per competències. Qui presente la programació a inspecció citarà una CE6 que no existeix, i «CE4» significa dues coses diferents segons la peça. És el mateix patró que ECO1-D02 (grup B).
- **Proposta**:
  - Adoptar a tot arreu la numeració del RD (la d'`evaluacion.mdx`) i reescriure la llista de la programació amb els enunciats oficials abreujats.
  - Mapatge orientatiu:
    - U1 → CE1;
    - U2-U3 → CE2 (entorn, RSC, forma jurídica com a decisió estratègica);
    - U4-U5 → CE3;
    - U6 → CE3 + CE4 (comunicació comercial);
    - U7-U8 → CE3/CE5 (U8 també CE2, per igualtat);
    - U9-U11 → CE5;
    - U12 → CE4 (pitch) + CE5 (pla d'empresa).
  - Dinàmiques i reptes: la CE de la seua unitat.
  - Endurir el test perquè compare amb els codis d'`evaluacion.mdx`.
- **Confiança**: Alta. El text d'`evaluacion.mdx` coincideix amb el RD 243/2022 tal com el coneixem.

#### EDMN-D07 · Alt · Alineació LOMLOE — «EBAU» en lloc de PAU (RD 534/2024) i el model valencià presentat com si fos el de tot l'Estat
- **On**:
  - `ebau/00-guia-prueba.mdx:4, 12`; `ebau/01-teoria-esencial.mdx:10`;
  - `libro/01-persona-emprendedora.mdx:426`;
  - callouts «En la EBAU» a `libro/09-funcion-financiera.mdx:447` i `libro/11-analisis-estados-financieros.mdx:394`;
  - component `PistaEbau` a totes les unitats;
  - `src/lib/asignaturas.ts:74`; `src/pages/[asignatura]/ebau/examenes/index.astro:53-54, 69`; `src/lib/ebau-examenes.ts:25`;
  - `public/ebau-examenes/`.
- **Evidència**:
  - **Nom.** El títol diu «Guía de la prueba EBAU», però el text parla del «modelo oficial de la PAU valenciana» (l. 12). El SEO diu «EDMN 2.º Bachillerato: libro, diapositivas y EBAU». L'arxiu es diu «Exámenes EBAU por comunidad» i hi apareix «Economía de la Empresa», el nom LOMCE de la matèria.
  - **Recompte.** A `edmn-2bach` hi ha 136 «EBAU» i 24 «PAU». No hi ha cap menció del RD 534/2024 en tot `src`.
  - **Estructura.** Aquestes frases es presenten sense dir que descriuen el model de la Comunitat Valenciana: «Parte II (Bloque 3), con 2 puntos por ejercicio» i «normalmente con flujos a dos años» (U9 l. 447; U11 l. 394), i «El examen … tiene dos partes» (U1 l. 426). El quadern parla dels «cuatro bloques de la concreción curricular valenciana», mentre que la programació organitza els sabers en blocs A-D.
  - **Arxiu.** `ANIOS = [2026, 2025, 2024]`, però els 125 PDF (17 CCAA) són de 2024 i 2025. No hi ha cap examen de 2026, tot i que ja s'han fet. Tampoc no s'avisa que 2024 és el model anterior (12 qüestions curtes a la CV) i 2025 el nou.
  - **En positiu.** La nota de concreció CCAA sí que és al hub (`src/pages/[asignatura]/index.astro:55`) i a «Sobre este libro» del PDF, abans de l'índex (`src/pages/[asignatura]/libro/imprimir.astro:109`). Només falta a l'índex web `/edmn-2bach/libro/` i a la U1.
- **Per què importa**: des del curs 2024-2025 la prova es diu oficialment PAU a tot l'Estat (RD 534/2024), i a la Comunitat Valenciana sempre s'ha dit PAU. La major part del públic és de fora de la CV i llegirà «Bloque 3 / 2 puntos» com si fora universal.
- **Proposta**:
  - Usar «PAU» a tota la interfície i als components. «EBAU» es pot mantindre només com a sinònim per al SEO: «PAU (antes EBAU)».
  - Afegir una nota a la guia i a U1: «Desde 2025 la prueba se rige por el RD 534/2024. Este cuaderno sigue el modelo de la Comunitat Valenciana; en otras comunidades cambian la estructura y la puntuación: consulta el archivo por CCAA».
  - Als callouts: «En la PAU valenciana…».
  - A l'arxiu: «Empresa y Diseño de Modelos de Negocio».
  - Pujar els exàmens de 2026 o traure l'any d'`ANIOS`, i etiquetar 2024 com a «modelo anterior».
- **Confiança**: Alta en els fets interns. Mitjana-alta sobre el RD 534/2024 (coneixement propi, no verificat en línia).

#### EDMN-D08 · Alt · Coherència entre peces — Activitats d'U11: el balanç d'Inditex no quadra, la clau contradiu l'objectiu i l'endeutament té definicions divergents
- **On**:
  - `actividades/11-radiografia-inditex.md:28, 44, 46, 53-56, 80-81, 88`;
  - `actividades/11-ejercicio-ratios-fondo-maniobra.md:45, 55, 61`;
  - `libro/11-analisis-estados-financieros.mdx:141-142, 403`;
  - `recursos/calculadora-ratios.md:20` + `src/components/calculadoras/RatiosCalc.tsx:177`;
  - `actividades/ejercicio-u11-rentabilidad-fondo-maniobra.md:16`.
- **Evidència**:
  - **El balanç no quadra.** «**TOTAL ACTIVO** | **31.200** | **TOTAL PN + PASIVO** | **35.200**» (l. 44). Són 4.000 M€ de diferència, que la nota de la l. 46 atribueix a «partidas menores».
  - **El compte de resultats no suma.** 6.500 + 100 − 1.350 = 5.250, no els «5.380» de la l. 56.
  - **La clau usa dos totals diferents**: un per a la solvència («31.200 / 16.900», l. 80) i l'altre per a l'endeutament («16.900 / 35.200», l. 81).
  - **L'objectiu contradiu la clau.** L'objectiu diu «fondo de maniobra negativo» (l. 28), però la clau dona «FM = +11.200 M€».
  - **Confusió de conceptes.** «la "deuda" comercial con proveedores … actúa como apalancamiento operativo» (l. 88) confon el crèdit de proveïdors amb el palanquejament operatiu, que depén de l'estructura de costos fixos.
  - **Endeutament amb dues definicions.** Al llibre és «Pasivo total / (Patrimonio neto + Pasivo total)», sa entre 0,4 i 0,6 (l. 141). A l'activitat de ràtios és «Pasivo total / Patrimonio neto», amb resultats d'1,14 i 2,75 (l. 45, 55, 61).
  - **Autonomia.** El llibre diu «Patrimonio neto / Pasivo total. Mide el inverso» (l. 142) i «Inverso del endeudamiento» (l. 403). No és la inversa de Pasivo / (PN + Pasivo).
  - **Calculadora.** S'obri amb un balanç que no quadra (actiu 228; PN + passiu 340), mentre el recurs diu «un balance que no cuadra siempre es un error contable».
  - **Filtració de valencià**: «coste del deute (6 %)».
- **Per què importa**: una activitat d'anàlisi de balanços amb un balanç que no quadra, a la unitat que ensenya que ha de quadrar, desmunta l'exercici. I amb definicions d'endeutament que no coincideixen, comparar un 2,75 amb el rang «0,4-0,6» porta a conclusions absurdes.
- **Proposta**:
  - Refer el dataset d'Inditex amb els comptes reals d'un exercici citat, o declarar-lo fictici i fer que quadre. Recalcular la clau.
  - Objectiu: «necesidades operativas de fondos negativas / financiación espontánea de proveedores».
  - L. 88: «financiación espontánea de proveedores, sin coste explícito».
  - Una sola definició d'endeutament (la del llibre), amb la nota «algunos manuales usan Pasivo/PN».
  - Autonomia: «es la inversa del ratio Pasivo/PN».
  - `RatiosCalc`: posar 220 com a valor per defecte d'`anc`.
- **Confiança**: Alta.

#### EDMN-D09 · Alt · Coherència entre peces — Test d'U2: la clau contradiu el llibre, avalua continguts d'U8 i dona per bona una afirmació falsa sobre la nòmina
- **On**: `tests/02-tipos-empresas-organizacion.md:8-15, 72-79, 85`; `libro/02-tipos-empresas-organizacion.mdx:90-102`; `libro/08-recursos-humanos.mdx:233`; `tests/08-recursos-humanos.md:52`.
- **Evidència**:
  - **Q1.** Pregunta «¿Cuál de estos NO es uno de los seis factores principales de localización empresarial?». La clau és «Climatología media de la zona» i l'explicació enumera «cliente, proveedores/recursos, suelo, mano de obra, infraestructura y marco fiscal».
  - El llibre no parla de sis factors: els classifica en factors de cost, de mercat i externs. A més, hi inclou «*Calidad de vida* — … (clima, oferta cultural, vivienda asequible)» (l. 102).
  - **Q9.** Demana l'afirmació FALSA i la clau és «El coste empresa es lo que el trabajador realmente cobra cada mes». Però l'opció «Las cuotas patronales no aparecen en la nómina» també és falsa: el model oficial de nòmina (Orden ESS/2098/2014) inclou l'apartat d'«aportación de la empresa».
  - La mateixa afirmació falsa és al llibre d'U8 («que NO aparecen en la nómina», l. 233) i al test d'U8 (l. 52).
  - Q9 i l'ítem numèric (1.800 × 1,32 = 2.376, correcte) tracten del cost d'empresa, que és contingut d'U8.
- **Per què importa**: el test d'autoavaluació desautoritza el llibre i fixa un error que també repeteixen GPE (`recursos/calculadora-nomina.md:21`) i altres matèries.
- **Proposta**:
  - Q1: alinear-la amb la classificació del llibre i usar un distractor clarament aliè.
  - Q9: «Las cuotas patronales no se descuentan del salario, aunque la nómina las recoge como aportación de la empresa».
  - Corregir en el mateix sentit U8 (l. 233) i el test d'U8 (l. 52).
  - Moure Q9 i l'ítem numèric al test d'U8, i posar a U2 ítems sobre formes jurídiques i dimensió.
- **Confiança**: Alta.

#### EDMN-D10 · Alt · Disseny didàctic — El «Reto del curso» que obri el PDF promet fitxes per unitat que no existeixen i es declara obligatori
- **On**: `reto/intro.mdx:46-53` (s'imprimeix abans de l'índex: `src/pages/[asignatura]/libro/imprimir.astro:21, 1021`); `libro/12-comunicacion-prototipado-plan-empresa.mdx:379`; `programacion/programacion.mdx:108`; `proyecto/00-equipo-y-empresa.mdx:13`; `src/content/emprendimiento/proyecto/`.
- **Evidència**:
  - La introducció promet: «Al final de cada unidad encontrarás una **ficha marcada "Reto · Etapa N"** con el entregable de esa semana» (l. 46-47). Però l'únic `<RetoEtapa>` del llibre és a U12 (l. 379).
  - Diu «**No es opcional, pero no es de examen.**» (l. 51). En canvi, la programació diu que el pla d'empresa es treballa «de forma opcional, como proyecto de aula con el cuaderno «De cero a empresa»» (l. 108).
  - `proyecto/00` diu «Durante todo el curso vais a construir, en equipo, una empresa de principio a fin» (l. 13).
  - En total hi ha tres projectes anuals paral·lels: el repte del llibre, el quadern EDMN de 6 fases i «De cero a empresa». Els lliuraments no es corresponen i no s'indica quin triar.
- **Per què importa**: la primera pàgina del llibre promet una peça que no existeix. En una matèria de 4 h setmanals i amb la pressió de la PAU, tres projectes que no queda clar si són obligatoris o opcionals desorienten professorat i alumnat.
- **Proposta**:
  - Triar un sol fil:
    - (a) afegir els `<RetoEtapa>` d'U1-U11 amb els lliuraments de la taula; o
    - (b) reescriure la introducció perquè remeta a les fases del quadern EDMN i traure «No es opcional».
  - A la programació: «proyecto opcional: cuaderno EDMN (ligado a la PAU) o «De cero a empresa» (transversal)», amb una taula d'equivalències unitat → fase.
- **Confiança**: Alta.

#### EDMN-D11 · Mitjà · Rigor i dades — U9: xifres de l'exercici 9.1, una «TAE» que no es calcula i la TIR a dos anys que la PAU demana però la unitat no ensenya
- **On**: `libro/09-funcion-financiera.mdx:69, 210-213, 225-240, 447`; deck, l. 608; `ebau/04-simulacros.mdx:95`; `actividades/09-juego-la-cartera-de-inversiones-con-dado.md`; `refuerzo/eval3-refuerzo.mdx:37`.
- **Evidència**:
  - **Exercici 9.1.**
    - Diu «Año 4: 9.500 / 1,3605 = **6.982,06 €**». El valor correcte és 9.500 / 1,08⁴ = **6.982,78** (i amb 1,3605, 6.982,73).
    - Per tant, la suma és 23.733,91 i el VAN és **5.733,91**, no 5.733,21.
    - Diu «La TIR … aproximadamente un 19-20 %» (l. 213, deck l. 608). La TIR és del **20,75 %**.
  - **Exercici 9.2** («Coste real de un préstamo: TAE…»).
    - Diu «(≈ 7,3 % efectivo total a 4 años)» i «(≈ 11,7 % efectivo total a 4 años)».
    - El cost total és del **14 %** (1.680 / 12.000) i del **22 %** (2.640 / 12.000). La TAE és de ≈ **6,8 %** i ≈ **11,5 %**, però no es calcula enlloc.
  - **L. 69.** «son la única parte numérica que vale en torno a 2 puntos» oblida el punt mort (U7) i les ràtios (U11).
  - **L. 447.** Diu «normalmente con flujos a dos años».
    - L'exercici de juny de 2025 de la CV tenia fluxos a tres anys, i el de juliol demanava la TIR a dos anys.
    - U9 només ensenya la TIR per interpolació.
    - `ebau/03` sí que la resol per equació de segon grau, però el simulacre la demana «por interpolación lineal» (l. 95).
  - **Joc del dau.** Planteja què passa en 60 rondes, però no dona la clau. El projecte C té una esperança de +18,3 % per ronda, però una mitjana geomètrica del −7,3 %: qui ho aposta tot a C acaba amb ≈1 % del capital.
  - **Fitxa de reforç.** Calcula un payback de 3 anys sense el valor residual, que en canvi sí que suma al VAN. Amb el residual, el payback és de 2,75 anys.
- **Per què importa**: errades petites en un exercici resolt minen la confiança. La TIR a dos anys és justament el format de la PAU. I el joc amaga la lliçó que el justifica.
- **Proposta**:
  - Corregir les xifres.
  - Afegir un exercici 9.4: «TIR con dos flujos (ecuación de segundo grado)».
  - Etiquetar bé el 9.2: «coste total» i «TAE ≈».
  - Matisar les l. 69 i 447: «en la PAU valenciana…».
  - Al simulacre: «resolviendo la ecuación de segundo grado».
  - Donar la clau del joc amb la mitjana geomètrica.
  - Explicitar el criteri del valor residual al payback.
- **Confiança**: Alta per a l'aritmètica. Mitjana-alta per a les afirmacions sobre la PAU, basades en els dos PDF de 2025 del repositori.

#### EDMN-D12 · Mitjà · Rigor i dades — Fiscalitat d'U2: tipus d'IS desfasats, un 15 % de nova creació que no s'aplica al cas, «tramos estatales» que són conjunts i xifres d'estalvi que no casen
- **On**:
  - `libro/02-tipos-empresas-organizacion.mdx:62, 70, 212, 343-361` (i el deck);
  - `libro/10-informacion-contable.mdx:238, 267`;
  - `libro/12-…` (exercici 12.1);
  - `src/lib/calc/irpf.ts:89-101`; `src/components/calculadoras/FormaJuridicaCalc.tsx:46`;
  - `recursos/forma-juridica.md` (EDMN i GPE);
  - `actividades/02-caso-cambio-forma-juridica.md:20, 41`.
- **Evidència**:
  - **(a) Tipus reduït de l'IS.** El llibre diu «tipo reducido del **23 % para pymes**» (l. 212; també U10 i U12). El 23 % era per a empreses amb INCN < 1 M€. La Ley 7/2024 el va substituir per una escala per a microempreses, amb un calendari transitori des de 2025, i també va rebaixar el tipus de les entitats de reduïda dimensió.
  - **(b) Cas Marina (l. 70).** Marina és autònoma des de fa cinc anys i el llibre diu que «tributaría … al **15 %** … (tipo reducido los dos primeros años)». Però l'art. 29.1 LIS exclou del tipus de nova creació l'activitat que l'any anterior exercia una persona física amb més del 50 % de la nova societat. A més, un avantatge que dura dos anys es multiplica per «una década» (60.000 €).
  - **(c) Tres magnituds per a la mateixa decisió.** «30.000-50.000 € de más en una década» (l. 62), «en torno a 6.000 €/año» (l. 70) i «El ahorro neto real ronda los 1.500-2.000 €/año» (l. 360).
  - **(d) «Tramos estatales IRPF 2025 … 19 % … 37 %» (l. 351).** Són tipus conjunts (estatal + autonòmic); l'escala estatal va del 9,5 % al 24,5 %.
    - El codi diu el mateix: `irpf.ts` indica «State general scale … we apply only the state scale», però usa els valors 0,19 … 0,47.
    - La calculadora avisa «con la escala estatal del IRPF: no incluye la mitad autonómica». Per tant, l'avís diu el contrari del que calcula.
  - **(e) Dividends.** «entre 19 % y 28 %» (l. 361). Des de 2025, el tram màxim de la base de l'estalvi és el 30 %.
  - **(f) Exercici 2.1.** Aplica el 25 % a una SLU que factura 90.000 €, contra el que diu la mateixa unitat.
  - **(g) `02-caso-cambio`.** L'enunciat diu «factura **180.000 € al año**» (l. 20) i la pista, «A 180.000 € de beneficio» (l. 41).
- **Per què importa**: són les xifres més volàtils i les que l'alumnat trasllada a decisions pròpies. L'etiqueta «estatal» de la calculadora, a més, enganya el professorat.
- **Proposta**:
  - Datar les dades fiscals («datos 2026») i centralitzar-les en un fitxer de constants per a les calculadores.
  - Canviar l'etiqueta per «escala general conjunta (estatal + autonómica de referencia)» al llibre, a `irpf.ts` i a l'avís de la calculadora.
  - Posar els tipus d'IS vigents per a microempreses i entitats de reduïda dimensió.
  - Cas Marina: plantejar-lo com una activitat nova, o afegir l'avís de l'art. 29.1 LIS.
  - Alinear el Tldr i el `CasoDilema` amb l'exercici resolt (≈1.500-3.000 €/any).
  - Posar el 30 % a la base de l'estalvi.
  - A `02-caso`, unificar «beneficio» i «facturación».
- **Confiança**: Alta per a (b), (c), (d), (f) i (g). Mitjana per a les xifres exactes de (a) i (e): cal verificar al BOE l'art. 29 LIS i l'escala de l'estalvi vigents.

#### EDMN-D13 · Mitjà · Rigor i dades — Detalls normatius: terminis de formulació, compte 626, «quiebra», morositat, cooperatives, consell de l'SA, CIF, ITP i pla d'igualtat
- **On**:
  - `libro/10-informacion-contable.mdx:100, 111, 251, 265`;
  - `libro/02-tipos-empresas-organizacion.mdx:159, 222, 232, 390, 392, 396` (i deck, l. 683-684);
  - `libro/11-analisis-estados-financieros.mdx:339, 617`;
  - `tests/11-analisis-estados-financieros.md:75`; `tests/03-entorno-empresarial-estrategias.md:64, 71`; `tests/08-recursos-humanos.md:63`.
- **Evidència**:
  - **Formulació de comptes.** U10 diu «(4 meses para formularlas…)» (l. 100). L'art. 253 LSC dona 3 mesos des del tancament; la junta aprova dins dels 6 mesos i el depòsit es fa el mes següent.
  - **«Quiebra».** U10 parla de «quiebra fortuita y quiebra culpable» (l. 111). El terme vigent és concurs fortuït o culpable (Llei concursal, TRLC 2020). La qualificació del concurs és civil; la via penal és una altra.
  - **Comissions bancàries.** U10 posa les «Comisiones bancarias» (250 €) a les despeses financeres (l. 251, 265). Al PGC són despesa d'explotació, compte 626 «Servicios bancarios y similares». Amb la correcció, el resultat d'explotació és 25.350 i el financer −3.800; el resultat final no canvia.
  - **Morositat.** U2 diu «Las medianas y grandes están sujetas a la Ley 15/2010 de Morosidad» (l. 159). La Llei 3/2004, modificada per la 15/2010, s'aplica a totes les operacions entre empreses, amb un termini màxim de 60 dies. U11 (l. 339, 617) i el seu test (l. 75) diuen que Mercadona paga «a 30, 60 o 90 días»: 90 dies superen el màxim legal.
  - **Cooperatives.** U2 parla de «siete tipos de cooperativas» (l. 232). La Llei 27/1999 (art. 6) en distingeix tretze, i cada llei autonòmica fixa les seues.
  - **Consell de l'SA.** U2 exigeix un «consejo de administración … mínimo de tres consejeros» (l. 222). L'SA pot tindre administrador únic o administradors solidaris o mancomunats (art. 210 LSC); el mínim de tres només s'aplica si hi ha consell.
  - **CIF.** U2 (l. 390, 396) i el deck (l. 683-684) parlen de «CIF». Des de 2008 és NIF (RD 1065/2007).
  - **ITP.** U2 diu que l'ITP «en muchas CCAA está exento para constituciones» (l. 392). L'exempció de la constitució de societats és estatal des de 2010.
  - **Pla d'igualtat.** Els tests el situen en «más de 50» o «> 50» treballadors. La norma diu «50 o más» (LO 3/2007, art. 45, en la redacció del RDL 6/2019).
- **Per què importa**: cada detall és menor, però junts erosionen la fiabilitat normativa d'una matèria que l'alumnat estudia per a la PAU.
- **Proposta**: aplicar les correccions indicades, als dos idiomes (llibre, deck, glossari i tests).
- **Confiança**: Alta per a la LSC, el NIF, el compte 626 i el pla d'igualtat. Mitjana-alta per a les cooperatives, l'ITP i la morositat.

#### EDMN-D14 · Mitjà · Alineació LOMLOE — Societat laboral i comunitat de béns: absents del llibre, però preguntades a la PAU i citades pel quadern de projecte
- **On**: `libro/02-tipos-empresas-organizacion.mdx` (cap secció); `ebau/01-teoria-esencial.mdx:70`; `proyecto/00-equipo-y-empresa.mdx:24`; `tests/02-tipos-empresas-organizacion.md` (la CB hi apareix només com a distractor); `public/ebau-examenes/comunidad-valenciana/empresa-2025-junio-examen.pdf`.
- **Evidència**:
  - U2 no tracta ni la societat laboral ni la comunitat de béns.
  - El quadern PAU, en canvi, les inclou a la taula de teoria: «Sociedad Laboral (SLL/SAL) | Según SL/SA | Limitada | ≥ 2 (mayoría trabajadores)».
  - L'examen valencià de juny de 2025 (qüestió 3, opció B) preguntava per una societat laboral amb el 33 % del capital en mans de treballadors.
  - `proyecto/00` afirma que «la Unidad 2 [trabaja] … las formas jurídicas (autónomo, comunidad de bienes, SL, SA, cooperativa)».
- **Per què importa**: el llibre diu que prepara la PAU, i la PAU ho ha preguntat. A més, el quadern remet a un contingut que no hi és.
- **Proposta**:
  - Afegir un subapartat breu a U2:
    - «Sociedad laboral (Ley 44/2015): la mayoría del capital en manos de trabajadores con contrato indefinido; ningún socio con más de un tercio (salvo excepciones); reserva especial».
    - «Comunidad de bienes: sin personalidad jurídica, responsabilidad ilimitada, tributación por atribución de rentas».
  - Completar el glossari i afegir un ítem al test.
- **Confiança**: Alta per a l'absència. Alta-mitjana per als detalls de la Llei 44/2015.

#### EDMN-D15 · Mitjà · Rigor i dades — Casos reals amb dades contradictòries o no verificables (Pescanova, DIA, Abengoa, Dalio)
- **On**: `libro/10-informacion-contable.mdx:72, 76, 325-326` (deck, l. 601); `libro/11-analisis-estados-financieros.mdx:80, 315, 377-381, 415, 431, 440-446`; `libro/09-funcion-financiera.mdx:73, 77`.
- **Evidència**:
  - **Pescanova.**
    - La mateixa unitat diu «debía 3.281 M€» (l. 72, 76) i «deuda real de 3.600 M€» (l. 326, deck l. 601).
    - Diu «los auditores externos (KPMG)» i «la auditora KPMG fue sancionada por no detectarlo». Segons el nostre coneixement, l'auditora de comptes era BDO, i KPMG va fer l'informe forense posterior.
    - Diu «cotizada en el IBEX 35»; cotitzava al mercat continu, no a l'IBEX.
  - **DIA.** El llibre diu «En 2018 reconoció errores contables» (l. 80) i, més avall, «muchas decisiones de DIA eran legales pero forzaban los principios» (l. 381). Les «Tres razones documentadas» (l. 377) no porten cap font.
  - **Abengoa.**
    - U9 diu «Quebró en 2015» i «presente en 50 países»; U11 diu «más de 80 países» i «en 2022 acabó liquidada». El 2015 va ser el preconcurs.
    - U11 (l. 315) diu que «los tipos de interés empezaron a subir». El 2014-2015 el BCE els baixava; el que pujava era el diferencial d'Abengoa.
    - U9 (l. 77) diu «El balance presentaba beneficios»; els beneficis són al compte de resultats, no al balanç.
  - **Recursos de MirarFora i bibliografia.**
    - «Principios», de Dalio, es presenta com un llibre sobre com analitza ràtios, amb «Parte II: Principios de vida y trabajo». En realitat, el llibre té parts separades de vida i de treball i no tracta d'anàlisi de balanços.
    - No hem pogut verificar el vídeo «How Bridgewater's Ray Dalio Reads a Balance Sheet».
    - La majoria dels vídeos de les unitats enllacen cerques de YouTube, no vídeos concrets.
    - Penman apareix com a 2013 i com a 2017 per a la mateixa 5a edició (l. 415 i 431).
- **Per què importa**: els casos són el ganxo de cada unitat. Atribuir una sanció a una auditora concreta sense verificar-ho, a més, té risc reputacional.
- **Proposta**:
  - Una sola xifra per cas, amb font citada.
  - Verificar l'auditora de Pescanova abans de nomenar-la, o escriure «el auditor externo». Traure «IBEX 35».
  - Donar font per a les «razones» de DIA o presentar-les com a hipòtesis.
  - Abengoa: «solicitó preconcurso en noviembre de 2015», i una sola xifra de països.
  - Revisar la fitxa de Dalio i substituir les cerques per recursos concrets.
- **Confiança**: Mitjana (sense accés a la xarxa). Alta per a les contradiccions internes.

#### EDMN-D16 · Mitjà · Disseny didàctic — PMM: l'objectiu diu «calcular», però el llibre només suma dies i no ensenya a obtenir-los
- **On**: `libro/11-analisis-estados-financieros.mdx:31, 67, 318-335, 676`; `tests/11-analisis-estados-financieros.md:64-67`; `refuerzo/eval3-ampliacion.mdx:69-70`.
- **Evidència**:
  - L'objectiu diu «Calcular el período medio de maduración y entender su impacto en la tesorería» (l. 31), i l'autoavaluació pregunta «Sabrías calcular el período medio de maduración» (l. 676).
  - La secció (l. 318-335) només dona dues fórmules: «PMM económico = días de almacén … + días de cobro» i «PMM financiero = PMM económico − Período medio de pago». No hi ha rotacions ni cap exercici.
  - El test i l'ampliació només pregunten la fórmula.
- **Per què importa**: calcular el PMM a partir de les rotacions és un problema clàssic de la prova en diverses comunitats. Amb el material actual, l'objectiu declarat no es pot assolir.
- **Proposta**:
  - Afegir un exercici resolt 11.3 amb rotacions: rotació = consum anual / existències mitjanes (p. ex. 120.000 / 10.000 = 12 → 365 / 12 ≈ 30 dies). Fer el mateix per a fabricació, venda, cobrament i pagament, i calcular el PMM econòmic i el financer.
  - Afegir un ítem numèric al test.
- **Confiança**: Alta.

#### EDMN-D17 · Mitjà · Disseny didàctic — Tests: la clau és la segona opció en el 59 % dels ítems i la més llarga en el 68 %
- **On**: `tests/*.md` (12 fitxers); `src/components/QuizPlayer.tsx:304`, que mostra les opcions en l'ordre del fitxer.
- **Evidència**:
  - Dels 104 ítems d'opció múltiple, la clau és la segona opció (índex 1) en el 59 %, quan l'esperat és el 25 %. També és l'opció més llarga en el 68 %.
  - Per unitats: a U11, 8 de 9 claus són a l'índex 1; a U5, 7 de 8.
  - Hi ha ítems numèrics trivials: «Total = 8 + 12 + 5 = 25 personas» (`tests/05-diseno-creativo-modelos.md:85`).
  - Hi ha un ítem duplicat: el mateix payback (10.000 / 4.000 = 2,5) apareix com a opció múltiple (`tests/09-funcion-financiera.md:24`) i com a numèric (l. 97).
- **Per què importa**: l'alumnat aprén a endevinar sense llegir («la segona i la més llarga»), i l'autoavaluació perd valor diagnòstic.
- **Proposta**:
  - Barrejar les opcions en pantalla a `QuizPlayer.tsx`. Una sola correcció serveix per a totes les matèries.
  - Equilibrar la llargària dels distractors.
  - Substituir els numèrics trivials per càlculs aplicats i eliminar el duplicat.
- **Confiança**: Alta.

#### EDMN-D18 · Mitjà · Coherència entre peces — MVP definit de tres maneres (U5, U12 i «De cero a empresa») i Lean Canvas sense teoria
- **On**: `libro/12-comunicacion-prototipado-plan-empresa.mdx:105` (i el seu test); `libro/05-diseno-creativo-modelos.mdx:291, 345`; `src/content/emprendimiento/proyecto/04-valida.mdx:46-51`; GPE `libro/03-decisiones-para-arrancar.mdx:260`; `actividades/04-proyecto-lean-canvas-startup.md`.
- **Evidència**:
  - Cada peça defineix el MVP d'una manera diferent:
    - U12: «la versión más reducida del producto que aún resuelve el problema central del cliente».
    - U5: el vídeo de Dropbox és «el ejemplo canónico de **MVP no funcional**».
    - «De cero a empresa»: «la versión más pequeña posible que os permite aprender algo real. No es un producto a medias: es un experimento. Un cartel, una maqueta, una hoja de pedidos, un vídeo…».
    - GPE: «versión más sencilla … que ya resuelve la necesidad».
  - El Lean Canvas és un projecte de 3 sessions a U4, però el llibre només l'esmenta en una línia a U5 (l. 291), una unitat després.
- **Per què importa**: la clau del test d'U12 imposa una definició que contradiu l'exemple canònic d'U5 i el projecte transversal de la mateixa plataforma.
- **Proposta**:
  - Una definició compartida per a EDMN, GPE i «De cero a empresa»: la de Ries (la versió que permet obtindre el màxim d'aprenentatge validat amb el mínim esforç, i que pot no ser funcional).
  - Un requadre de Lean Canvas a U4, o moure l'activitat a U5.
- **Confiança**: Alta.

#### EDMN-D19 · Mitjà · Coherència entre peces — Dinàmiques: dades que no quadren i una gelateria que obri amb VAN negatiu com a final d'«èxit»
- **On**: `actividades-dinamicas/09-financiacion-heladeria.mdx` (nodes n2-n3 i finals); `actividades-dinamicas/11-analisis-financiero-hotelito.mdx:31, 50, 102`; `actividades-dinamicas/07-fabrica-pasalia.mdx:31, 100`.
- **Evidència**:
  - **Gelateria (dinàmica 09).**
    - L'opció «correcta» calcula «VAN … = −4.373 €. VAN negativo: el proyecto NO crea valor».
    - Tot i això, totes les opcions porten a n3: «Habéis decidido seguir adelante con el segundo local».
    - El final «éxito» celebra l'obertura amb la lliçó «El VAN negativo no siempre significa que el proyecto sea malo».
    - A més, n3 dona per fet un préstec de 580 €/mes encara que a n1 s'haja triat el business angel.
  - **Hotelito (dinàmica 11).** Diu «El patrimonio neto es 172.000 €» (l. 50), però el balanç de la mateixa dinàmica en dona 164.000. Amb aquest PN, el ROE és del 17,1 %, no del 16,3 %.
  - **Pasalia (dinàmica 07).** Diu «pasó de 6.000 kg de margen a 2.526 kg» (l. 31), però el marge previ correcte és de 4.174 kg. També diu «El punto muerto baja de 9.474 a 7.800 kg» (l. 100), una xifra que no es pot derivar de les dades (≈ 8.780).
- **Per què importa**: la dinàmica d'U9 premia el contrari de la regla de decisió que ensenya la unitat. I les xifres que no quadren fan perdre la confiança en l'eina.
- **Proposta**:
  - Gelateria: afegir a n2 una branca «renegociar la reforma o revisar previsiones» que porte a un VAN positiu abans d'obrir, o fer que obrir amb VAN < 0 porte al final parcial. Condicionar n3 a la tria feta a n1.
  - Corregir el PN de l'hotelito i les xifres de Pasalia.
  - L'etiqueta `[CE3]` de totes les dinàmiques es tracta a D06.
- **Confiança**: Alta.

#### EDMN-D20 · Baix · Coherència entre peces — Filtracions de valencià, errates i detalls de format
- **On**:
  - `libro/05`, `06` i `08` (l. 54); `libro/07` (l. 57); `libro/09:77`; `libro/11:150, 191` (i CA, l. 67);
  - `actividades/ejercicio-u11-rentabilidad-fondo-maniobra.md:16`; `actividades-dinamicas/02-forma-juridica-mercadillo.mdx:91`; `actividades-dinamicas/09-financiacion-heladeria.mdx:85`;
  - `libro/07-funcion-productiva.mdx:282` (deck, l. 662); `libro/01:160`; `libro/06:334`;
  - `ebau/02-cuestiones-teoricas.mdx:91`; `ebau/04-simulacros.mdx`;
  - `programacion/programacion.mdx:134-139`.
- **Evidència**:
  - **Valencià dins de fitxers castellans.** La PistaEbau d'U11; «coste del deute»; «perdes» a les dinàmiques 02 i 09; «**Sabers LOMLOE**» a U5-U8.
  - **Errates.** «termosalar» (U9); «está sobreliquidez» (U11); a CA U11, «de l'**palanquejament**» en lloc de «del palanquejament».
  - **Temps de lectura.** U5-U8 anuncien ~9-12 min per a unes 4.200-4.400 paraules de prosa, que són ≈ 17-22 min.
  - **Sessions.** La suma de `duracion` del llibre és 82 sessions, i la de la programació, 94.
  - **Dades de Mercadona.** Són de 2025 a U1 i de 2023 a U6; a GPE, de 2024.
  - **Punt mort d'U7.** «Señal de alarma: bajar de 100 cafés/día», amb un punt mort de 101,2: l'alarma hauria d'estar per damunt del punt mort.
  - **Quadern PAU.** La PESTEL duplica «Político-legal … Legal». El simulacre 2 parla d'un *elevator pitch* de 3 minuts, mentre que U12 el fa de 60 segons.
  - **Programació.** La secció d'atenció a la diversitat no cita les fitxes de reforç i ampliació, que ja existeixen.
- **Per què importa**: és soroll menor, però es veu al primer paràgraf de diverses unitats.
- **Proposta**:
  - Una passada de correcció als dos idiomes.
  - Recalcular els temps de lectura (≈ 200 paraules/min).
  - Quadrar les sessions del llibre i de la programació.
  - Usar una sola sèrie de dades de Mercadona.
  - Citar `refuerzo/` a la programació.
- **Confiança**: Alta.

### Patrons de la passada ràpida
- **Estructura**. Les 12 unitats tenen deck, test, 5 activitats i 1-2 exercicis curts, dinàmica i repte. Hi ha 6 fitxes de reforç/ampliació, el quadern PAU (5 documents) i el quadern de projecte (6 fases). La tipologia d'activitats és variada: cas, debat, dinàmica, joc, investigació, gràfic, notícia, creatiu i projecte.
- **Exercicis resolts**. S'han refet tots els del llibre i del quadern PAU.
  - L'aritmètica és neta en 6.1, 6.2, 7.1, 7.2, 8.1, 9.3, 10.1, 10.2, 11.1, 11.2 i 12.1.
  - Els problemes són de classificació o d'interpretació: el compte 626 a 10.1; els «4,9 puntos» a 11.2; el 12.1 usa el benefici comptable com a flux i no compensa pèrdues.
  - Hi ha errades petites a 9.1, 9.2 i 2.1.
- **Claus de test**. Cap índex està fora de rang. Les errades són de contingut (D05, D09, D13) i de biaix (D17). El biaix coincideix amb el recompte transversal de l'auditoria: 10 / 61 / 26 / 7 claus per a les opcions A-D.
- **Paritat ES↔CA**. No falta cap bessó, i les xifres i les claus són idèntiques. Per tant, les errades es repeteixen als dos idiomes.
- **Frescor de dades**.
  - U1 està a 2025.
  - U6 (Mercadona i Carrefour 2023) i U9 (Verkami, «Memoria 2023») no s'han actualitzat.
  - La fiscalitat diu «2025» al llibre i «2026» a `irpf.ts`.
- **Codis de sabers**. «Sabers/Saberes LOMLOE: C.2, C.3…» usen una numeració pròpia (el RD no numera els sabers així). A més, conviuen amb els «Bloques» 1-4 valencians del quadern PAU.
- **Recursos «Mirar fora»**. Molts vídeos són URL de cerca de YouTube, no vídeos concrets. Hi ha recursos repetits entre unitats i matèries: «Why Banks Fail» a U9, U10 i GPE U6; «Mi problema con Nespresso» a U7 i GPE U4.
- **To i estètica**. Plural i proper, cap emoji i cap to comercial.

### Estat del diagnòstic anterior
| Troballa (`docs/diagnostico-edmn-2bach.md`, maig de 2026; `docs/issues-pilot-edmn.md`) | Estat | Evidència |
|---|---|---|
| Cronologia Borden/McCarthy (U6) | **Resolt** | Corregida al text i a la `Curiosity` |
| Firma personal de Pau a U1 | **Resolt** | Ja no hi apareix |
| «30x más rápido» (U5) | **Resolt** | U5 l. 590 ho desmenteix citant Paivio |
| Diagrames d'U10/U11 (balanç, cascada del compte de resultats, fons de maniobra) | **Resolt** | Presents |
| `SolvedExercise` a U2, U8 i U12, i TIR explícita a U9 | **Resolt** | 2.1, 8.1, 12.1 i 9.3. Hi ha errades de detall a D11 i D12 |
| «Listar los 9» principis comptables (U10) | **Regressió** | La recomanació era errònia: el PGC 2007 en té sis. Ara el llibre diu «nueve» (D03) |
| Actualitzar l'arbre de decisió «con la SLFS y la SL Crea y Crece» (U2) | **Pendent i mal orientat** | L'arbre continua amb 3.000 €, i la SLFS ja no existeix (D04) |
| Frase apòcrifa de Pacioli (U10) | **Parcial** | Ara és «La frase atribuida a Pacioli» en una pregunta de reflexió (l. 380), però no s'aclareix que no consta a l'original |
| Atribució de l'*elevator pitch* a Rosenzweig (U12) | **Parcial** | Suavitzada a «se atribuye normalmente» (l. 146) |
| Dades 2023 → 2024 (Mercadona, Carrefour, Verkami, Mondragón) | **Parcial** | U1 a 2025; U6 i U9 continuen a 2023 |
| Un sol «propietari» per cas (Mercadona, Inditex) | **Parcial** | Mercadona apareix a U1, U6 i U11, i també a GPE U5 |
| Edicions bibliogràfiques | **Resolt** | Excepte Penman (2013 i 2017 per a la mateixa edició) |
| Pilot B-001 (TOC) i B-002 (ruta del PDF) | **Resolt** | Segons el document; no s'ha tornat a comprovar |
| Aplicar els 7 patrons del pilot a U1-U5 i U7-U12 | **Parcial** | `PistaEbau` i `CasoDilema` hi són; `RetoEtapa` només és a U12 (D10) |

---

## Gestión de Proyectos de Emprendimiento (`gpe-bach`)

**Resum.** GPE és una matèria de projecte ben pensada. Té 7 unitats de llibre breus amb deck i test, un quadern de projecte de 6 fases amb plantilles, 2 activitats i exercicis curts per unitat, 7 dinàmiques, 8 reptes i 6 fitxes de reforç/ampliació. L'ancoratge local és excel·lent (IVACE, PAE/CIRCE, LABORA, casos valencians). La nota curricular adaptada ja és a U1 i totes les claus dels tests són correctes. Els problemes greus són d'**alineació i de rigor puntual**:
- El criteri 3.3 (igualtat en la gestió de persones) no es treballa al llibre.
- Els criteris 4.1 i 4.3 (impostos del projecte i anotacions comptables) tampoc no hi són, però el repte 04 i el reforç avaluen l'IVA.
- L'arbre compartit diu 3.000 € a la mateixa pàgina on la taula diu 1 €.
- Dues dinàmiques tenen xifres i dades legals errònies.

A més, hi ha solapaments amb EDMN i «De cero a empresa» (els mateixos casos amb dades diferents), i la temporalització no quadra entre llibre, programació i quadern.

**Punts forts**
- **Disseny per projecte coherent.** Cada unitat del llibre alimenta explícitament una fase del quadern (F0-F5), amb plantilles omplibles i lliurables clars.
- **Ancoratge local i cívic.**
  - U3: PAE/CIRCE i IVACE.
  - U6: fiscalitat com a responsabilitat ciutadana i fiscalitat verda, amb dades actualitzades (GESTHA, 24 % del PIB).
  - U4: publicitat responsable amb l'Observatorio de la Imagen de las Mujeres.
  - El debat `06-debate-economia-sumergida` distingeix bé l'optimització legal del frau.
- **Nota curricular adaptada a U1** (l. 79): matèria pròpia de la CV, sense base estatal.
- **El millor enunciat del grup sobre l'SL d'1 €**: `recursos/forma-juridica.md:23` («por debajo de 3.000 € hay obligación de reserva y responsabilidad añadida de los socios»). La taula d'U3 ja no inclou la SLNE, i `03-tramites-puesta-en-marcha` usa correctament «NIF de la sociedad».
- **Càlculs nets on n'hi ha**:
  - l'exercici resolt 6.1;
  - `ejercicio-u6-punto-muerto` (PM 240; −440; 204);
  - el repte 04 (PN 1.200; resultat 480; PM 180) i el repte 07;
  - les fitxes `eval2-ampliacion` i `eval3-refuerzo`.
- **Paritat ES↔CA completa**, to plural i proper, cap emoji.

**Unitats revisades a fons**
- **U3** `libro/03-decisiones-para-arrancar.mdx`:
  - deck i `tests/03-decisiones-para-arrancar.md`;
  - activitats `03-caso-forma-juridica` i `03-tramites-puesta-en-marcha`;
  - dinàmica `03-mercadillo-forma-juridica`;
  - recurs `forma-juridica` + `FormaJuridicaCalc.tsx` + `FormaJuridicaTree.astro`;
  - repte `07-decisiones-arranque-forma-juridica`;
  - fase 2 del quadern;
  - diff ES↔CA de llibre i test.
- **U6** `libro/06-contabilidad-fiscalidad-financiacion.mdx`:
  - deck i test;
  - activitats `06-cuenta-resultados-proyecto`, `06-debate-economia-sumergida` i `ejercicio-u6-punto-muerto`;
  - dinàmica `06-punto-muerto-vivero-plantas`;
  - recursos `calculadora-punto-muerto` i `calculadora-van-tir`;
  - repte `04-contabilidad-fiscalidad-proyecto`;
  - fase 4;
  - fitxes `eval2-*` i `eval3-*`.
- **U5** `libro/05-areas-empresa-recursos-humanos.mdx`:
  - deck i test;
  - activitats `05-perfiles-equipo-proyecto` i `05-caso-comunicacion-empresa`;
  - dinàmica `05-equipo-primera-contratacion`;
  - recurs `calculadora-nomina`;
  - repte `08-recursos-humanos-equipo-comunicacion`;
  - fase 3.

### Troballes

#### GPE-D01 · Alt · Alineació LOMLOE — El criteri 3.3 (la gestió de persones com a instrument d'igualtat) no es treballa al llibre i el repte 08 l'avalua igualment
- **On**:
  - `evaluacion/evaluacion.mdx:39`;
  - `libro/05-areas-empresa-recursos-humanos.mdx`;
  - `actividades/05-perfiles-equipo-proyecto.md`, `actividades/05-caso-comunicacion-empresa.md`;
  - `actividades-dinamicas/05-equipo-primera-contratacion.mdx`;
  - `retos/08-recursos-humanos-equipo-comunicacion.mdx:137, 143`.
- **Evidència**:
  - El criteri 3.3 demana «Analizar la gestión de recursos humanos, valorando su papel como instrumento para hacer efectiva la igualdad en derechos y oportunidades de mujeres y hombres, así como las desigualdades existentes, poniendo el acento en la importancia de la inversión en capital humano».
  - A U5 hi ha 0 mencions d'igualtat, bretxa, discriminació, conciliació o capital humà. Tampoc no n'hi ha a les dues activitats ni a la dinàmica d'U5.
  - Només el repte 08 hi toca, amb dos ítems sobre dades i preguntes discriminatòries en el currículum i l'entrevista («constituyen discriminación, especialmente hacia las mujeres», l. 143). Per tant, avalua un contingut que el llibre no ensenya.
  - La igualtat sí que és al llibre, però en un altre àmbit: la publicitat (U4).
- **Per què importa**: és un criteri oficial d'avaluació. Qui programe amb aquest material no té amb què treballar-lo ni amb què avaluar-lo.
- **Proposta**:
  - Afegir a U5 un apartat breu que cobrisca:
    - selecció sense biaixos;
    - bretxa salarial i registre retributiu;
    - pla d'igualtat (obligatori des de 50 persones treballadores);
    - conciliació;
    - formació com a inversió en capital humà.
  - Afegir un ítem de test sobre aquest apartat.
  - Adaptar l'activitat d'EDMN `08-creativo-una-oferta-de-empleo-sin-sesgos.md` com a activitat d'U5.
- **Confiança**: Alta.

#### GPE-D02 · Alt · Alineació LOMLOE — Criteris 4.1 i 4.3: el llibre no identifica els impostos del projecte ni fa anotacions comptables, però el repte 04 i el reforç avaluen l'IVA
- **On**:
  - `evaluacion/evaluacion.mdx:51, 53`;
  - `libro/06-contabilidad-fiscalidad-financiacion.mdx:5-8, 83, 85-137, 141`;
  - `retos/04-contabilidad-fiscalidad-proyecto.mdx:55-66`;
  - `refuerzo/eval2-refuerzo.mdx:60`;
  - `proyecto/04-viabilidad.mdx:92-107`.
- **Evidència**:
  - **El que demanen els criteris.** El 4.1 diu «Identificar los impuestos que afectan al proyecto empresarial, valorando la equidad del sistema tributario». El 4.3 diu «Realizar anotaciones contables básicas y analizar las cuentas anuales para valorar la situación patrimonial, económica y financiera».
  - **El que fa U6.** Cobreix molt bé la meitat cívica: progressivitat, fiscalitat verda i economia submergida (l. 85-137). En canvi, no esmenta ni l'IVA, ni l'IRPF de l'autònom, ni l'IS (0 aparicions d'«IVA» en tot el llibre). Declara expressament: «En GPE no la estudiamos como técnica» (l. 141) i «No vamos a calcular ratios complejos, ni a aplicar el Plan General Contable» (l. 83).
  - **Promesa no complerta.** El lema de la unitat promet «qué impuestos te tocan» (l. 7).
  - **Avaluació d'un contingut no ensenyat.** El repte 04 fa relacionar IRPF, IVA i Impost de Societats, i la fitxa de reforç demana calcular l'IVA d'un preu (l. 60).
  - **Quadern.** La plantilla de compte de resultats de F4 no té línia d'impostos ni d'amortitzacions.
- **Per què importa**: hi ha dos criteris oficials sense cobertura, i l'alumnat és avaluat de continguts que no ha vist.
- **Proposta**:
  - Afegir a U6 un apartat «Los impuestos de tu proyecto»:
    - IVA (repercutit i suportat, sense declaracions);
    - IRPF de l'autònom o IS de la societat;
    - IAE (exempt per davall d'1 M€);
    - taxes municipals.
  - Afegir un mini-exercici de 4-5 anotacions en forma de T (aportació, compra, venda, cobrament, préstec).
  - Afegir les línies d'impostos i amortitzacions a la plantilla de F4.
- **Confiança**: Alta.

#### GPE-D03 · Alt · Rigor i dades — Capital de l'SL: la taula d'U3 diu 1 € i l'arbre de la mateixa pàgina diu 3.000 €
- **On**:
  - `libro/03-decisiones-para-arrancar.mdx:135, 140, 158-160`; deck, l. 398-405;
  - `src/components/diagrams/FormaJuridicaTree.astro:29`;
  - `actividades-dinamicas/03-mercadillo-forma-juridica.mdx:37`.
- **Evidència**:
  - La taula d'U3 diu «**1 € desde 2022** (antes 3.000 €)» (l. 135).
  - Uns paràgrafs més avall, el diagrama compartit pregunta «¿Capital < 3.000 €?» (l. 158-160, vegeu EDMN-D04).
  - Al deck, la diapositiva «La barrera que desapareció en 2022» va seguida de l'arbre que la recupera.
  - La responsabilitat es formula sense matís: «solo arriesgáis el capital que habéis puesto en la empresa» (l. 140) i «solo perdéis lo que pusisteis» (dinàmica 03).
  - El recurs `forma-juridica.md:23` sí que la formula bé.
- **Per què importa**: és una contradicció dins de la mateixa pàgina, i la tria de forma jurídica és el lliurable de la fase 2.
- **Proposta**:
  - Corregir l'arbre compartit, com a EDMN-D04.
  - Afegir a la l. 140 i a la dinàmica el matís de la reserva i de la responsabilitat solidària fins a 3.000 €.
- **Confiança**: Alta.

#### GPE-D04 · Alt · Rigor i dades — Dinàmiques 03 i 05: tarifa plana de 291 €, ingressos inflats, falsa alternativa notari/PAE i un sou a temps complet per davall del SMI
- **On**:
  - `actividades-dinamicas/03-mercadillo-forma-juridica.mdx:26, 31, 37, 61, 77-85`;
  - `actividades-dinamicas/05-equipo-primera-contratacion.mdx` (node n2);
  - `actividades/ejercicio-u6-punto-muerto.md:25`.
- **Evidència**:
  - **Dinàmica 03.**
    - **Ingressos.** Hi ha 340 usuaris i una quota de 1,50 €. La dinàmica diu «ingresos previstos de unos 400-600 €/mes si el 40 % de usuarios paga el premium» (l. 26), però 340 × 40 % × 1,50 € = **204 €**.
    - **Tarifa plana.** Diu «(~291 €/mes tarifa plana el primer año)» (l. 31). La tarifa plana d'autònoms és de **80 €/mes**.
    - **Autosuficiència.** Diu que 153 €/mes fan el projecte «autosuficiente» (l. 61), sense descomptar-ne les quotes.
    - **Notari o PAE.** L'opció «notario privado … 400-600 €» es contraposa a la del PAE, amb «Coste real: tasas de registro (~150-200 €)». Però l'SL sempre requereix escriptura notarial, també via CIRCE: el PAE demana la cita, i amb estatuts tipus l'aranzel és reduït. A més, l'opció SL (l. 37) diu «150-300 € (notaría + tasas)».
  - **Dinàmica 05.**
    - Proposa un «Contrato indefinido a tiempo completo: 1.000 €/mes bruto». És per davall del SMI (1.184 €/mes en 14 pagues el 2025; el llibre d'ECO1 usa 1.221 € per a 2026).
    - Justifica el contracte de pràctiques amb un sou «mínimo 60-75 % del convenio». Eixa és la regla anterior a la reforma laboral de 2021: ara el sou és el del grup professional i mai inferior al SMI proporcional a la jornada.
    - Atribueix a «Hacienda» la detecció de falsos autònoms, que correspon a la Inspecció de Treball.
  - **`ejercicio-u6-punto-muerto`.** Posa una «cuota de autónomo 1 200 €» mensual per a un projecte d'arrancada.
- **Per què importa**: les dinàmiques són el primer contacte de l'alumnat amb les xifres reals d'emprendre. Aquestes li transmeten que l'autònom costa 291 €, que la gestoria o el notari són opcionals i que es pot contractar legalment a temps complet per 1.000 €.
- **Proposta**:
  - Dinàmica 03:
    - canviar els ingressos per 204 €/mes;
    - posar la tarifa plana a 80 €/mes durant 12 mesos, amb l'avís de la quota posterior per trams;
    - replantejar la tria «notari» / PAE com una tria entre estatuts tipus (més barat i ràpid) i estatuts a mida.
  - Dinàmica 05: sou a temps complet ≥ SMI i contracte formatiu amb la regla vigent.
  - `ejercicio-u6-punto-muerto`: quota coherent amb la tarifa plana, o justificar els 1.200 € (p. ex. dos autònoms fora de la tarifa).
- **Confiança**: Alta per a l'aritmètica i el SMI de 2025. Alta-mitjana per a la tarifa plana: 80 € és l'import vigent des de 2023 (convé confirmar-lo per a 2026). Mitjana-alta per als imports d'aranzel.

#### GPE-D05 · Mitjà · Alineació LOMLOE — La nota curricular de plantilla presenta GPE com a «currículo básico estatal» al hub i al PDF, i contradiu U1
- **On**: `src/pages/[asignatura]/index.astro:52-55, 222-224`; `src/pages/[asignatura]/libro/imprimir.astro:105, 109, 985, 1012-1013`; `src/lib/asignaturas.ts:211`; contrasta amb `libro/01-emprender-e-innovar.mdx:79`.
- **Evidència**:
  - La plantilla combina el text genèric amb el camp `marcoNormativo` de GPE («Decret 108/2022, mod. Decret 103/2026 (CV) — optativa»).
  - **Hub.** El resultat és: «Este libro se basa en el currículo básico estatal LOMLOE para gestión de proyectos de emprendimiento, establecido en el Decret 108/2022… Cada comunidad autónoma establece concreciones específicas: conviene consultar la de tu comunidad».
  - **PDF.** La portada diu «Currículo estatal LOMLOE · Decret 108/2022…», i «Sobre este libro» repeteix el mateix text.
  - **Meta description.** Diu «Currículo estatal LOMLOE (Decret 108/2022…)».
  - **U1.** En canvi, diu correctament que la matèria «**no tiene base estatal en el Real Decreto 243/2022**» (l. 79).
- **Per què importa**: la primera frase del hub i del PDF és falsa per a aquesta matèria. A més, remet a la concreció d'altres comunitats, que no existeix.
- **Proposta**: afegir a `asignaturas.ts` un camp d'àmbit (estatal/autonòmic) i una variant del text per a les matèries autonòmiques: «Materia propia de la Comunitat Valenciana (Decret 108/2022…): no tiene base en el currículo estatal». Usar la variant al hub, a la meta description, a la portada i als crèdits del PDF.
- **Confiança**: Alta.

#### GPE-D06 · Mitjà · Rigor i dades — Dinàmica 06 (viver): dades que no quadren, punt mort arrodonit a la baixa i consignació mal explicada
- **On**: `actividades-dinamicas/06-punto-muerto-vivero-plantas.mdx:26, 31, 50, 59, 61, 79`.
- **Evidència**:
  - **Costos variables.** La dinàmica dona «costes variables … 1.680 €» per a 440 plantes, que són 3,82 €/planta (l. 26). Després diu «coste variable medio por planta … = 3,20 €» (l. 50), que dona 1.408 €.
  - **Punt mort.** «580 ÷ 5,30 = 109 plantas al mes» (l. 59). El resultat és 109,4 → **110**: amb 109 plantes el marge és de 577,70 €, per davall dels 580 € de costos fixos. L'exercici de la mateixa matèria sí que arrodoneix a l'alça.
  - **La dinàmica reconeix el problema en lloc de corregir-lo**: «La cifra no cuadra exactamente con el PyG (1.480 €)… Revisad» (l. 61).
  - **Consignació.** Diu «Si vendéis plantas en consignación … el ingreso ya está en el PyG» (l. 31). En consignació, l'ingrés es reconeix quan el consignatari ven, no quan es lliura.
  - **Terminologia.** Diu «margen bruto de 1.480 €/mes» (l. 79), però aquesta xifra és el resultat, no el marge brut.
- **Per què importa**: és la dinàmica del punt mort, el càlcul central de la unitat.
- **Proposta**:
  - Unificar el cost variable (3,20 € → 1.408 €, resultat 1.752 €, o bé 3,82 €).
  - PM = 110.
  - Canviar l'exemple de consignació per «venta a crédito a 30 días».
  - Canviar «margen bruto» per «resultado».
- **Confiança**: Alta.

#### GPE-D07 · Mitjà · Rigor i dades — «Las cotizaciones financian la sanidad» (U5, deck i test), contradit per U6
- **On**: `libro/05-areas-empresa-recursos-humanos.mdx:156`; deck, l. 388; `tests/05-areas-empresa-recursos-humanos.md:49-56`; contrasta amb `libro/06-contabilidad-fiscalidad-financiacion.mdx:91, 97`.
- **Evidència**:
  - U5 diu: «la parte que la persona aporta a la **Seguridad Social** (que financia pensiones, sanidad y desempleo)».
  - La clau del test és «Las pensiones, la sanidad y las prestaciones por desempleo.», amb distractors com «La publicidad de las empresas privadas».
  - La sanitat pública es finança amb impostos des de la separació de fonts dels anys noranta. Les cotitzacions financen les prestacions contributives, l'atur i la formació.
  - La mateixa matèria, a U6, atribueix correctament la sanitat als impostos.
- **Per què importa**: l'enfocament cívic de GPE (qui paga què) és un dels seus trets diferencials, i ací ensenya un fet erroni.
- **Proposta**: «financia pensiones, desempleo y otras prestaciones contributivas; la sanidad pública se paga con impuestos». Corregir el test i el deck.
- **Confiança**: Alta.

#### GPE-D08 · Mitjà · Coherència entre peces — Ancoratge del lienzo: la fase 2 es contradiu i l'activitat 03 encara parla de la SLNE
- **On**: `proyecto/02-modelo-negocio-arranque.mdx:10, 38, 62` (i CA, l. 39); `libro/03-decisiones-para-arrancar.mdx:253`; `actividades/03-caso-forma-juridica.md:11`.
- **Evidència**:
  - La fase 2 diu «el lienzo lo trabajasteis en la Unidad 2» (l. 38) i, 24 línies més avall, «El **lienzo de modelo de negocio** lo presentamos y lo rellenáis aquí mismo» (l. 62).
  - U2 no tracta el lienzo, però U3 remet a la fase 2 «junto con el lien[zo]» (l. 253).
  - La fase presenta «El modelo de negocio: lienzo Canvas (B1)» (l. 10) com a saber del bloc 1, però no hi ha cap unitat que el reculla. Convé comprovar l'etiqueta amb el Decret.
  - L'activitat 03 continua citant la «Tabla comparativa … (autónomo, SL, SLNE, cooperativa)» (l. 11).
- **Per què importa**: el diagnòstic de maig ja ho va detectar. L'arranjament es va quedar a mitges i ara la fase es contradiu a si mateixa.
- **Proposta**:
  - Esborrar la l. 38 (i la CA, l. 39), o afegir un requadre del lienzo a U2.
  - Revisar l'etiqueta del saber.
  - Traure «SLNE» de l'activitat.
- **Confiança**: Alta per a la contradicció. Mitjana per a l'etiqueta del saber.

#### GPE-D09 · Mitjà · Coherència entre peces — Solapaments amb EDMN i «De cero a empresa»: els mateixos casos amb dades diferents i tres quaderns de projecte
- **On**:
  - GPE `libro/03:69-75`, `libro/02:70-73`, `libro/06:71-77`, `libro/05:69`, `libro/03:260`;
  - EDMN `libro/02:70`, `libro/04:285-286`, `libro/10:331`, `libro/01:160`, `libro/12:105`;
  - `src/content/emprendimiento/proyecto/`.
- **Evidència**:
  - **Marina.** És l'autònoma de 60.000 € amb «6.000 € anuales» d'estalvi al `CasoDilema` de GPE U3 i al d'EDMN U2. Hereta així la magnitud inconsistent d'EDMN-D12.
  - **Filmin.** És el cas real de GPE U2 i també el d'EDMN U4.
  - **Pime amb 50.000 € de benefici.** Apareix a EDMN U10 i a GPE U6.
  - **Mercadona.** GPE U5 usa dades de 2024 (685 M€ de primes i 104.000 persones); EDMN U1 en usa de 2025 (115.000 persones).
  - **PMV/MVP.** Té una definició diferent en cada lloc (EDMN-D18).
  - **Projectes.** Hi ha tres quaderns de projecte (GPE, EDMN i «De cero a empresa») per a alumnat que pot cursar GPE a 1r i EDMN a 2n.
- **Per què importa**: qui cursa les dues matèries troba els mateixos casos dues vegades i amb dades diferents, i la plataforma perd credibilitat.
- **Proposta**:
  - Un «propietari» per cas: Filmin per a GPE U2 (és local), un cas valencià nou per a GPE U3 i Marina per a EDMN U2.
  - Un bloc únic de dades de Mercadona.
  - Una sola definició de MVP.
  - A la programació de GPE, una nota per a alumnat que després cursarà EDMN.
- **Confiança**: Alta.

#### GPE-D10 · Mitjà · Coherència entre peces — VAN/TIR a la fase 4 i al recurs d'U6 quan el llibre els exclou, i dos recursos amb afirmacions errònies
- **On**: `proyecto/04-viabilidad.mdx:159-161`; `recursos/calculadora-van-tir.md`; `libro/06-contabilidad-fiscalidad-financiacion.mdx:83, 266`; `recursos/forma-juridica.md:21`; `recursos/calculadora-nomina.md:21`.
- **Evidència**:
  - **VAN i TIR.** La fase 4 diu «comparad inversiones con el VAN y la TIR para decidir si una opción de financiación o inversión compensa» i hi insereix `<HerramientaIsland componente="VANTIR" />`. El recurs VAN/TIR està vinculat a U6. En canvi, U6 diu que no estudiarà la rendibilitat «con técnicas avanzadas. Eso pertenece a otras materias» (l. 83), i que el termini de recuperació «basta» (l. 266).
  - **`forma-juridica.md:21`.** Diu «escala estatal del IRPF … no incluye la mitad autonómica», però la calculadora usa tipus conjunts (EDMN-D12).
  - **`calculadora-nomina.md:21`.** Diu que la cotització patronal «no aparece en la nómina del trabajador», cosa que és falsa (EDMN-D09).
- **Per què importa**: el quadern demana una tècnica que el llibre exclou expressament, i els recursos contradiuen la normativa.
- **Proposta**:
  - Traure el VAN/TIR de la fase 4, o presentar-lo com a «Para ir más lejos (opcional; se estudia en EDMN)».
  - Corregir els dos textos dels recursos.
- **Confiança**: Alta.

#### GPE-D11 · Mitjà · Disseny didàctic — Temporalització: llibre, programació i quadern no sumen el mateix
- **On**: `programacion/programacion.mdx:5, 100-125`; frontmatter `duracion` de les 7 unitats; fitxers `proyecto/0*.mdx`.
- **Evidència**:
  - La programació fixa `horas_semanales: 2` i reparteix 19 sessions a les unitats, marcades com a «(apoyo)» (3+3+3+3+2+3+2), i 32 a les fases (4+6+5+6+6+5).
  - Els frontmatters del llibre sumen **36-43 sessions** només per a les unitats, amb durades com «5-6 sesiones · 1,5 semanas» o «6-7 sesiones · 2 semanas». Això implica 3-4 sessions setmanals: el patró d'EDMN, que té 4 h, no el de GPE, que en té 2.
  - El quadern declara 17-23 sessions per a les sis fases.
- **Per què importa**: el professorat no sap quant de temps dedicar al llibre i quant al projecte. Les xifres del llibre són impossibles amb 2 h setmanals.
- **Proposta**: recalcular la `duracion` de les unitats amb 2 h setmanals (≈ 2-3 sessions) i alinear les fases del quadern amb la programació.
- **Confiança**: Alta.

#### GPE-D12 · Mitjà · Disseny didàctic — Tests: la clau és la segona opció en el 76 % dels ítems i la més llarga en el 87 %, amb distractors absurds
- **On**: `tests/*.md`; `src/components/QuizPlayer.tsx:304`.
- **Evidència**:
  - Dels 63 ítems d'opció múltiple, la clau és a l'índex 1 en el 76 % i és l'opció més llarga en el 87 %. A U7, 9 de 9.
  - Alguns distractors són absurds:
    - «Porque la innovación de producto está prohibida en clase.» (`tests/01…:37`);
    - «La obligación de pintar de verde las fábricas.» (`tests/06…:20`);
    - «Elegir el ODS que tenga el color que mejor combine con la marca.» (`tests/07…:76`);
    - «Planificación central y mano invisible.» (`tests/07…:60`).
  - Hi ha una restança d'un altre format: «Ordena correctamente: ¿qué documento certifica la entrega…?» (`tests/04…:24`), on no hi ha res a ordenar.
- **Per què importa**: tal com estan, els tests es poden aprovar sense haver llegit la unitat.
- **Proposta**:
  - Barrejar les opcions a `QuizPlayer.tsx` (una sola correcció per a totes les matèries; vegeu EDMN-D17).
  - Reescriure els distractors amb errors plausibles (confusions típiques de l'alumnat).
  - Traure «Ordena correctamente:».
- **Confiança**: Alta.

#### GPE-D13 · Mitjà · Alineació LOMLOE — Les set dinàmiques porten `[CE3]`
- **On**: `actividades-dinamicas/*.mdx:10`.
- **Evidència**:
  - Totes les dinàmiques tenen `competencias_especificas: [CE3]`, també la de la innovació de Lladró (U1) i la de l'impacte local (U7).
  - En canvi, la programació associa U1 a CE1 i U7 a CE5.
- **Per què importa**: l'avaluació per competències s'alimenta d'aquestes etiquetes. És el mateix patró que a EDMN (D06) i ECO1 (grup B).
- **Proposta**: etiquetar cada dinàmica amb la CE de la seua unitat segons la mateixa programació.
- **Confiança**: Alta.

#### GPE-D14 · Mitjà · Disseny didàctic — Seguretat alimentària i legalitat absents en projectes d'alimentació, i un missatge erroni sobre la PESTEL
- **On**: `actividades-dinamicas/02-horchata-nueva-generacion.mdx:61, 74, 83`; `actividades/03-caso-forma-juridica.md:26`.
- **Evidència**:
  - **PESTEL.** El feedback diu que «el legal es un factor de umbral, no de diferenciación … El análisis PESTEL útil busca los factores que os diferencian». La PESTEL identifica oportunitats i amenaces de l'entorn; no serveix per a trobar trets diferencials.
  - **Orxata.**
    - El DAFO recull la debilitat «sin licencia de actividad alimentaria» (l. 74).
    - Tot i això, l'opció recomanada és un «Puesto de horchata fresca en el mercado de los jueves del pueblo» (l. 83).
    - No hi ha cap menció de registre sanitari, formació de manipulador d'aliments, cadena de fred ni autorització de venda ambulant, tot i que l'orxata fresca és un producte d'alt risc.
  - **Tartes.** El cas proposa «vender tartas por encargo desde la cocina de su casa» (l. 26), sense cap avís sanitari.
- **Per què importa**: GPE fa que l'alumnat munte projectes reals. Els d'alimentació són els més freqüents, i la legalitat sanitària hi és un requisit d'entrada, no un detall.
- **Proposta**:
  - Afegir als feedbacks un avís breu: registre sanitari o comunicació prèvia, manipulador d'aliments, cadena de fred i permís municipal de venda.
  - Corregir la definició d'ús de la PESTEL.
- **Confiança**: Alta per a la PESTEL i l'absència d'avisos. Mitjana per als requisits concrets, que varien segons el municipi i el producte.

#### GPE-D15 · Baix · Rigor i dades — Filmin i Netflix el 2007, «única plataforma», errates i detalls
- **On**:
  - `libro/02-de-la-idea-a-la-oportunidad.mdx:70, 73`; deck, l. 323;
  - `actividades-dinamicas/02-horchata-nueva-generacion.mdx`;
  - `actividades/06-cuenta-resultados-proyecto.md:15`;
  - `actividades/ejercicio-u6-punto-muerto.md:15`.
- **Evidència**:
  - **Anacronisme.** El llibre diu «En 2007, cuando Netflix ya empezaba a dominar el vídeo en streaming a escala global». El 2007 Netflix tot just començava el streaming als EUA i no va arribar a Espanya fins al 2015.
  - **Afirmació sense font.** Diu que Filmin «es la única plataforma local que ha sobrevivido».
  - **Font en valencià dins del fitxer castellà**: «Entrevistes als fundadors Jaume Ripoll i Juan Carlos Tous» (l. 70).
  - **Errates**: «horchatías» i «las horchatería».
  - **Competència clau de la LOMCE.** L'activitat usa `competencias_clave: [CE, CMCT, CPSAA, CD]`; CMCT és de la LOMCE, i a la LOMLOE és STEM.
  - **Solució sense enunciat.** La solució de l'exercici del punt mort respon un «Paso 4» (preu de 20 €) que l'enunciat no demana.
- **Per què importa**: són detalls, però visibles en el cas que obri U2.
- **Proposta**: «En 2007, cuando Netflix empezaba a ofrecer streaming en EE. UU.»; font o matís per a «única»; «Entrevistas a los fundadores»; STEM; afegir el pas 4 a l'enunciat o traure'l de la solució.
- **Confiança**: Alta.

#### GPE-D16 · Baix · Coherència entre peces — «Mirar fora»: recursos descrits de dues maneres, poc adequats o repetits
- **On**: `libro/01-emprender-e-innovar.mdx:312-313`; EDMN `libro/01-persona-emprendedora.mdx:487-488`; `libro/03-decisiones-para-arrancar.mdx:316`; `libro/06` i EDMN `libro/09` i `libro/10` («Why Banks Fail»).
- **Evidència**:
  - **«Tengo un plan».** GPE el descriu com a «emprendedores valencianos · À Punt · serie documental», i EDMN com a «episodio piloto con Sergi Mas · YouTube / Spotify».
  - **«@businessbarista».** És un compte nord-americà de notícies de negoci, poc connectat amb un projecte local de batxillerat.
  - **«Why Banks Fail».** Es recomana tres vegades entre GPE i EDMN.
- **Per què importa**: si una matèria remet a dos recursos diferents amb el mateix nom, el professorat no sap quin és el bo. A més, els recursos repetits resten valor al component.
- **Proposta**: verificar i unificar la fitxa de «Tengo un plan»; substituir @businessbarista per un recurs local (IVACE, À Punt, LABORA); no repetir el mateix vídeo en més d'una unitat.
- **Confiança**: Mitjana (no s'han pogut obrir els enllaços).

### Patrons de la passada ràpida
- **Estructura**. Les 7 unitats tenen deck, test, 2 activitats i exercicis curts, dinàmica i repte (8 en total). Hi ha 6 fitxes de reforç/ampliació i el quadern de 6 fases amb plantilles. Totes les unitats tenen diagrama propi.
- **Claus de test**. Totes són correctes. Els problemes són de contingut (D07) i de disseny (D12). Els 10 ítems de V/F i els de relacionar no tenen cap incidència de clau.
- **Paritat ES↔CA**. Completa, amb claus i xifres idèntiques.
- **Frescor de dades**. GESTHA 2024-2025 i WEF 2025 estan actualitzats. Mercadona és de 2024, mentre que EDMN la té a 2025.
- **Abast**. U6 delimita bé el que no fa, però el quadern (fase 4) i els recursos no respecten eixa delimitació (D10).
- **To i estètica**. Plural i proper, amb una mirada cívica (fiscalitat, impacte local) ben integrada. Cap emoji.

### Estat del diagnòstic anterior
| Troballa (`docs/diagnostico-gpe-bach-2026.md`) | Estat | Evidència |
|---|---|---|
| P0.1 Retirar la SLNE d'U3 | **Parcial** | La taula (l. 135) i la bibliografia (l. 292) són correctes; queda la SLNE a `actividades/03-caso-forma-juridica.md:11` |
| P0.2 Economia submergida | **Resolt** | U6 l. 136: 24 % del PIB (GESTHA 2024-2025) |
| P0.3 Edicions (Kotler 14a, WEF 2025) | **Resolt** | Actualitzades |
| P1.4 Llacuna del BMC | **Parcial** | La fase 2 el presenta, però continua dient que es va treballar a U2 (D08) |
| P1.5 Consolidar els rols d'equip | **Resolt** | Els rols són a F0 (`RolesEquipo`) i F3 no els repeteix |
| P1.6 Referència a U5 a F3 | **Pendent** | `proyecto/03` no remet a la Unitat 5 |
| P2.7 Glossari, «Para profundizar» i preguntes a U3-U6 | **Resolt** | Presents (p. ex. U6 l. 315, 340, 349) |
| P2.8 Segon exercici resolt a U6 | **Pendent** | Només hi ha el 6.1 |
| P2.9 Nota curricular adaptada a U1 | **Resolt** | U1 l. 79. La plantilla del hub i del PDF, però, la contradiu (D05) |
| P3 Imatges i diagrames | Fora d'abast | Correspon a l'auditoria visual |
| P-format Bibliografies | No verificat | — |
| «Cobertura curricular: completa» (l. 373) | **Contradit** | Els criteris 3.3, 4.1 i 4.3 no tenen cobertura (D01, D02) |

---

## Top 5 del grup
1. **EDMN-D04 + GPE-D03**: traure el llindar de 3.000 € i la SLFS de l'arbre compartit `FormaJuridicaTree.astro` (també a Eco 4ESO, Taller 3ESO i IPE2), d'U2, del deck, de la clau de `02-elegir` i del quadern PAU, i explicar bé l'SL amb menys de 3.000 € (reserva del 20 % i responsabilitat solidària).
2. **EDMN-D01 + EDMN-D02**: corregir les dues claus del simulacre 1 (el marge de seguretat és del 20 %; les amortitzacions són finançament interna-propia) i la frase contradictòria d'U7, l. 236.
3. **EDMN-D03**: escriure «seis principios» del PGC 2007 (afegint la importància relativa) al llibre, al deck i al glossari, i anotar que la recomanació del diagnòstic de maig era errònia.
4. **EDMN-D05 + EDMN-D08**: aplicar una sola regla de palanquejament (RE contra el cost del deute; RF abans d'impostos) al llibre, al deck, al test, a `RatiosCalc` i a l'ampliació, i refer el dataset d'Inditex.
5. **EDMN-D06 + EDMN-D07 + GPE-D01/D02**: usar a EDMN una sola numeració de CE (la d'`evaluacion.mdx`), cobrir a GPE els criteris 3.3, 4.1 i 4.3, i passar d'«EBAU» a PAU identificant el model valencià com a tal.
