# Millora del contingut no gràfic (auditoria 2026-11-24)

Quatre auditories de només lectura sobre una mostra: prosa de 12 unitats, material de pràctica de 5 assignatures, les 300 fotografies dels llibres i la maquetació en web (1440 i 375 px) i en el PDF d'Eco 1r Batx. Les troballes són dels revisors; les que diuen «per verificar» no s'han contrastat amb cap font externa.

Estat: **lot A aplicat (PR de 2026-11-24).** La resta, pendent. Del lot A queden fora: els PDF individuals d'activitats no s'han regenerat, i els peus de figura i les etiquetes dels SVG no reben l'espai indivisible. Les fotos antigues `taller-eco-3eso/04/datafono-contactless.jpg` i `ipe1-fp/06/firma-contrato.png` han quedat sense ús (esborrar-les al lot G).

## Lot A. Errors visibles i fuites (mecànic, sense decisions de disseny)

1. **Solucions del professor al PDF i a l'edició d'alumne.** `src/pages/[asignatura]/actividades/imprimir/[modo].astro` pinta el cos sencer; només el camp `solucion` del frontmatter es reserva al professorat. Uns 70 fitxers porten la solució al cos («Solución orientativa para el profesor», «Resultados de referencia»…). Cal test que ho reproduïsca, filtre de seccions docents en mode alumne i un nom únic de secció.
2. **Text trencat en web i PDF:** `**…**` literals (15 pàgines del PDF d'Eco 1r Batx), asteriscs als peus de figura (`Figure.astro` pinta el `caption` com a text pla), `Q_d`/`Q_o` amb guió baix, xifres partides entre línies (`42` / `000`, `7` / `%`), `&amp;` literal en dos crèdits.
3. **Càlculs erronis en activitats** (recalculats pel revisor): interés compost d'Eco 1r Batx U3 (9.071,89 € i no 9.078,40), hipoteca del banc A (775,49 € i no 777) i del banc C a partir de l'any 6 (847,94 € i no ≈870), punt mort del pla B del restaurant (1.297 i no 1.296), VAN/TIR de l'exercici U9 d'EDMN (TIR 19,54 %).
4. **Imatges que no són el que diu el peu:** «Borsa de Nova York» (és un mural LED), «datàfon» (taula de text en anglés), «oficina d'ocupació» (casa amb plaques solars), «coworking» (carrer en blanc i negre), «contracte signat» (carta d'una universitat dels EUA), «cooperativa» (botiga de Taiwan).
5. **Bug del PDF:** el retrat xicotet ocupa el 80 % de la pàgina per un problema d'especificitat CSS; objectius duplicats a l'obertura de cada capítol.

No és error (el revisor s'equivocava): la prestació d'atur al 60 % a partir del dia 181 és correcta des del 2023.

## Lot B. Mòbil (dins del sistema visual aprovat)

- Diagrames: l'SVG té `min-width: 560px` i al mòbil se n'amaga quasi la mitat; etiquetes d'eix de 8 px.
- Caixes amb massa farciment: columna de 247 a 270 px, exercicis resolts de 3.000 a 3.800 px d'alt.
- Targetes dins de targetes (diagrama dins d'exercici resolt).
- Taules amb desplaçament intern sense indici; molla de pa de 19 px d'alt.

## Lot C. Obertura i final d'unitat (canvia l'estructura de la pàgina: cal aprovació)

- Obertura: la primera línia de text arriba després de 3.000 px (fitxa, índex, resum, cas). Els objectius queden en una cita apagada.
- Final: 6.000 px i nou blocs; el test, que és l'acció principal, és l'enllaç més menut. Proposta: essencial → preguntes → test + anterior/següent, i la resta plegada en «Para ir más allá».

## Lot D. Llibre en PDF (cal aprovació per al cos de lletra)

- Forats de pàgina de fins al 80 % per blocs que no es partixen; bibliografia solta.
- Cos de 9 pt amb 88 caràcters per línia i sense marge de relligat. Passar a 10 pt afig un 15 % de pàgines.
- «Abrir el recurso →» mort en paper, data «Generado…» i «borrador» a la coberta.

## Lot E. Explicacions i exemples (editorial, llibre a llibre)

- **Exercicis resolts on no n'hi ha:** CJD 0 de 8 unitats, EEAE 1 de 10, GPE 1 de 7, Taller 1 de 9, FOPP 3 de 10, IPE II 3 de 9. Els objectius prometen càlcul que el text no fa.
- **«Vuelve al caso» sense aplicar l'eina de la unitat** (es tanca en prosa, sense xifres).
- **Errors de model per revisar:** monopsoni d'Eco 1r Batx U9 (no ix de les corbes donades), externalitat a GPE U2, B-Corp com a «marc jurídic» a EDMN U3, béns públics definits sense exclusió.
- **Xifres i cites sense font**, i una cita textual inventada (FOPP U4).
- **Conceptes usats abans de definir-los** (TAE, fons de maniobra, EBITDA).
- **Unitats sobrecarregades:** Eco 1r Batx U5 i U9, Eco 4t U8, CJD U4.
- **Veu:** frases de professor dins del text d'alumne, primera persona, superlatius.
- Mecànic: «EBAU» en 18 fitxers quan la prova ja és PAU; secció-pont amb tres noms diferents; bibliografia absent en 4 unitats.

## Lot F. Pràctica

**Fet (2026-11-25):** ordre barrejat de les opcions al quadern imprés, biaix de longitud (Eco 1r Batx, EEAE, FOPP) i de vertader/fals (Eco 4t, EEAE) amb guarda de CI, i clau de correcció en 13 activitats de resposta tancada. **Pendent:** la resta de punts d'aquesta llista, i tres dubtes de contingut per a Pau (descompte del 5-10 % contra el 5 % legal a EDMN activitat 3; costos fixos que no sumen a EDMN activitat 6; pistes dins dels «Pasos» que el quadern de l'alumne encara ensenya a FOPP 17, 19, 21, 24, 27 i GPE forma jurídica).

- Uns 30 exercicis sense solució i fitxes citades que no existeixen.
- Rúbriques sense nivells d'assoliment en quasi totes les activitats (el model ja existix a les situacions i als projectes).
- Tests: a Eco 1r Batx l'opció correcta és la més llarga en el 76 % de les preguntes; a la versió impresa la correcta és quasi sempre la B a IPE I; vertader/fals quasi sempre fals a Eco 4t.
- Situacions d'aprenentatge: cap pas diu quantes sessions ocupa i els materials enllaçats no cobrixen les sessions declarades. Ací sí que val una figura: línia de temps de la seqüència generada des del frontmatter, una vegada cada pas tinga sessions.
- Cobertura fluixa: IPE I (2,3 activitats per unitat), set unitats d'Eco 4t sense repte ni arbre de decisió.
- Duplicats: doble subhasta (3 versions), debat del salari mínim (4), nòmina de brut a net (2).

## Lot G. Imatges

- Substituir el bloc d'IPE I (estoc genèric i fotos d'altres països) per documents reals: model de contracte i de nòmina, senyals del RD 485/1997.
- CJD: 16 figures, quasi totes façanes; un document (pàgina del BOE, nota simple) ensenya més.
- Privacitat: menors i persones identificables en 8 fotos; dues amb marca d'aigua.
- Drets per verificar: bitllets d'euro (disseny del BCE) en 6 unitats, retrats marcats «domini públic», Lagarde sense llicència explícita.
- Neteja: 8 fitxers orfes, 10 duplicats, 38 de més de 500 KB.

## Lot H. Sistema de caixes (canvia el sistema visual: cal aprovació)

Hi ha 15 tipus de caixa i 7 tints, amb el mateix color per a significats diferents. Proposta: quatre famílies (definició, digressió, pràctica, avís) i una sola mida de cos. A més, `RealExample` usa el color de FOPP a totes les assignatures.

## Guardes de CI que eixirien d'ací

Solució obligatòria en tot exercici; cap secció docent al mode alumne; crèdit d'imatge amb llicència i sense `&amp;`; `alt` diferent del peu; fonts citades presents a la bibliografia; suma de sessions de les situacions; biaix de longitud i de vertader/fals als tests.

## Ordre recomanat

A (errors i fuites) → B (mòbil) → F solucions i tests → E llibre a llibre → G → C, D i H quan Pau aprove els canvis de disseny.
