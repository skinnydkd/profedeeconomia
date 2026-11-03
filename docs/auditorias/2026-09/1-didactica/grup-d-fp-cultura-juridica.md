# Auditoria didàctica — Grup D: FP i Cultura Jurídica

> Annex de l'[auditoria didàctica](./README.md) · setembre de 2026 · revisió de només lectura sobre `main` (`876e002`).

> Auditoria de només lectura feta el 2026-09-28 sobre `ipe1-fp` i `ipe2-fp` (Itinerario Personal para la Empleabilidad I i II, mòduls d'FP de la LO 3/2022 i el RD 659/2023, annex V) i `cjd-bach` (Cultura Jurídica y Democrática, optativa valenciana de Batxillerat, Decret 108/2022). No hem tingut accés a la xarxa (BOE, INE, MITES). Les dades externes les avaluem amb coneixement propi i indiquem la confiança. No afirmem cap xifra que no hàgem pogut contrastar. La referència «mod. Decret 103/2026» no s'avalua.
>
> **Mètode**. Hem llegit sencer el llibre (amb el bloc ```deck```), el test, almenys tres activitats de tipus diferent, la dinàmica, el recurs amb la seua lògica de càlcul i el repte de 3 unitats d'IPE I (U6, U7, U8), 2 d'IPE II (U1, U9) i 3 de CJD (U3, U5, U6). De la resta hem fet una passada ràpida: frontmatter, títols `^## `, decks i claus. Amb scripts de només lectura hem comparat les claus de test ES↔CA (idèntiques en les tres matèries) i les xifres del llibre i de les peces ES↔CA. La paritat és completa: els errors del castellà també són al valencià. També hem calculat la distribució de claus i la longitud de les opcions, i hem refet a mà i amb Python totes les xifres que assenyalem (nòmines, indemnitzacions, vacances, punt mort). Els diagnòstics de maig s'han contrastat amb evidència. Si no es diu una altra cosa, les rutes són relatives a `src/content/asignaturas/<slug>/`.

---

## Itinerario Personal para la Empleabilidad I (`ipe1-fp`)

**Resum.** És un mòdul complet i ben travat. Té 9 unitats amb deck i test, 21 activitats de cinc tipus, 9 dinàmiques, 9 reptes, fitxes de reforç i ampliació per avaluació, programació i avaluació per RA. El llibre ha absorbit bé el diagnòstic de maig: tipus de 2026, MEI, cost d'empresa i exercicis resolts correctes.

El problema és que la capa derivada no ha rebut la mateixa passada. Són els tests, les fitxes, les activitats, les dinàmiques i el diagrama compartit. Hi trobem una clau de test que contradiu el llibre per al mateix cas i una nòmina «correcta» cotitzada sobre una base errònia. També hi ha indemnitzacions mal calculades i un exercici de PRL que ensenya a retardar els protectors auditius a 92 dB(A).

En currículum falten el temps de treball, les vacances i el registre de jornada, i part dels criteris del RA1. El model de RA barreja els RA oficials amb un RA6 propi. A més, els tests es poden encertar sense llegir: la bona és la B en el 81 % dels casos.

**Punts forts**
- Aparell didàctic complet i variat: 21 activitats (5 casos, 6 exercicis, 4 dinàmiques, 3 projectes, 3 debats) amb rúbrica ponderada i durades pensades per a blocs d'FP (50-110 min), 9 dinàmiques, 9 reptes i 6 fitxes de reforç i ampliació.
- El nucli jurídic del llibre és sòlid:
  - notes de laboralitat (art. 1.1 ET);
  - contractes posteriors a l'RDL 32/2021 amb causes taxades;
  - 20/33 dies amb topalls, i règim anterior a 2012 esmentat (U7:238);
  - qui paga la IT;
  - acomiadament nul;
  - finiquito ≠ indemnització;
  - «durante el periodo de prueba se trabaja con todos los derechos» (U6:144).
- L'exercici resolt 7.1 calcula bé el salari diari sobre el salari anual amb pagues («24.000 / 365 = 65,75 €/día», U7:257). El d'Aitana usa el 6,50 % i dona 1.521,00 € (U6:219-232). Els reptes `03` (1.521,00 €) i `08` (Alba: 21.900 / 365 = 60 €/dia; 132 dies; 7.920 €) són correctes.
- La lògica de càlcul està testada i és coherent amb 2026: `src/lib/calc/nomina.ts` (MEI 0,15 %, total 6,50 %) i `src/lib/calc/coste-contratacion.ts` (30,65 % + AT/EP).
- Activitats de PRL ben construïdes: la matriu de probabilitat × conseqüència de l'INSST (activitat 08), la cadena causal i el PAS (activitat 18) i la responsabilitat compartida (debat 19).
- To de col·lega en les notes docents, DUA real en reforç i ampliació, i paritat ES/CA exacta.

**Unitats revisades a fons**
- U6 `libro/06-contrato-derechos.mdx` (+ deck).
  - Test: `tests/06-contrato-derechos.md`.
  - Activitats: `06-descifra-tu-nomina-real` (exercici), `16-caso-detecta-contrato-fraudulento` (cas), `ejercicio-u6-nomina-bruto-neto-coste-empresa` (exercici).
  - Dinàmica: `06-primer-contrato-lee-antes-de-firmar`.
  - Recurs: `calculadora-nomina`, amb `src/lib/calc/nomina.ts`, `irpf.ts` i `src/components/calculadoras/CalculadoraNominaESO.tsx`.
  - Repte: `03-primer-contrato-nomina`. Fitxes: `refuerzo/eval2-*`.
  - Diff ES↔CA de llibre i test.
- U7 `libro/07-seguridad-social-vicisitudes.mdx` (+ deck).
  - Test: `tests/07-…`.
  - Activitats: `07-vicisitudes-contrato-prestaciones-finiquito` (cas), `17-ejercicio-prestaciones-requisitos-cuantia` (exercici).
  - Dinàmica: `07-baja-medica-y-finiquito`.
  - Recurs: `nomina-cotizaciones`, amb `src/lib/calc/coste-contratacion.ts`.
  - Repte: `08-seguridad-social-despido-indemnizacion`. Fitxes: `refuerzo/eval3-*`.
  - Diff ES↔CA.
- U8 `libro/08-prevencion-riesgos-laborales.mdx` (+ deck).
  - Test: `tests/08-…`.
  - Activitats: `08-evaluacion-riesgos-puesto-simulada` (dinàmica), `18-caso-accidente-investigacion-pas` (cas), `19-debate-derecho-prevencion-responsabilidad` (debat).
  - Dinàmica: `08-incidente-prl-taller`.
  - Repte: `01-prevencion-riesgos-aula-taller`.
  - Diff ES↔CA.

### Troballes

#### IPE1-D01 · Crític · Rigor i dades + Coherència — La cotització del treballador continua al 6,35 % (sense MEI) en tests, fitxes, exercici i diagrama, i el test U6 dona un net diferent del llibre per al mateix cas
- **On**:
  - `tests/06-contrato-derechos.md:76, 80, 81-88`
  - `tests/07-seguridad-social-vicisitudes.md:32`
  - `refuerzo/eval3-refuerzo.mdx:57`
  - `refuerzo/eval3-ampliacion.mdx:29-30`
  - `actividades/ejercicio-u6-nomina-bruto-neto-coste-empresa.md:12-16, 24-31`
  - `src/components/diagrams/NominaAnotada.astro:25, 132, 139, 151`, inserit a `libro/06-contrato-derechos.mdx:192` i al deck (:458)
  - Ruta: `/ipe1-fp/tests/06-contrato-derechos/`
- **Evidència**:
  - El llibre és correcte: «El tipo general que paga el trabajador ronda el **6,50 %** … + 0,15 % MEI» (U6:208). L'exercici resolt diu: «Salario neto … 1.800 − 279,00 = **1.521,00 €**» (U6:232).
  - Test U6, Q10: «Aitana cobra 1.800 € brutos, con un 6,35 % de Seguridad Social y un 9 % de IRPF». La clau és «1.523,70 € (1.800 − 114,30 € de Seguridad Social − 162,00 € de IRPF)» (l. 81-88).
  - Test U6, Q9: «(en torno al 6,35 %)» (l. 76, 80).
  - Test U7, Q3: «En la nómina solo aparece la parte a tu cargo (≈ 6,35 %)» (l. 32).
  - Reforç: «4,70 % + 1,55 % + 0,10 % = 6,35 % … 101,60 €» (l. 57). Ampliació: «ve descontado en torno al 6,35 %» → «114,30 €» (l. 29-30).
  - Exercici U6: «se aplican los **tipos vigentes en 2026**», amb una taula sense MEI → «95,25 €», «1.284,75 €», «448,50 €», «1.948,50 €».
  - Diagrama: «SS trabajador (6,35 %)», «− 95,25 €», «1.254,75 €».
- **Per què importa**:
  - L'alumne que ha estudiat el llibre calcula 1.521,00 € per al cas d'Aitana, i el test li dona per bona una altra xifra.
  - Les fitxes que l'alumnat fa pel seu compte i un exercici etiquetat «tipos vigentes en 2026» ensenyen un tipus que no és el de 2026.
  - És l'error que el diagnòstic de maig va qualificar de crític. S'ha corregit en el llibre però no en la capa d'avaluació.
- **Proposta**: 6,50 % a tot arreu (4,70 + 1,55 + 0,10 + 0,15 MEI).
  - Test U6, Q10: enunciat amb 6,50 % i clau «1.521,00 € (1.800 − 117,00 € − 162,00 €)». L'explicació ha de dir «deducciones 279,00 €; brecha 15,5 %».
  - Test U6, Q9, i test U7, Q3: «≈ 6,50 %».
  - Reforç: 1.600 × 0,065 = **104,00 €**.
  - Ampliació: 1.800 × 0,065 = **117,00 €**, i «551,70 frente a 117,00: unas 4,7 veces».
  - Exercici U6: afegir el MEI (0,15 % treballador, 0,75 % empresa).
    - Treballador: **97,50 €**. Net: **1.282,50 €**.
    - Empresa (30,65 %): **459,75 €**. Cost total: **1.959,75 €** més l'AT/EP del CNAE, que ara falta a la taula. La diferència amb el net és de 677,25 € + AT/EP.
  - Diagrama: «SS trabajador (6,50 %)» − 97,50 €; total − 247,50 €; líquid **1.252,50 €**. El component també s'usa a `eco-4eso` U5 i a `cjd-bach` U5: una sola correcció ho arregla a les tres matèries.
- **Confiança**: Alta.

#### IPE1-D02 · Crític · Rigor i dades — La «Nómina A (correcta)» de l'activitat 06 cotitza sobre una base sense prorrata de pagues extra i sense MEI
- **On**: `actividades/06-descifra-tu-nomina-real.md:50, 53-69` (i la «Nómina B», l. 71-87)
- **Evidència**:
  - «Salario bruto anual: 18.200 € en 14 pagas (1.300 €/mes × 14)» (l. 50).
  - «### Nómina A (correcta, mes de octubre)» (l. 53), amb «DEDUCCIONES (base de cotización 1.300,00 €)», «Contingencias comunes (4,70 %) … 61,10 €», «Desempleo (1,55 %) … 20,15 €», «Formación profesional (0,10 %) … 1,30 €» i «LÍQUIDO A PERCIBIR … 1.139,45 €».
  - La rúbrica puntua «Verifica que los tipos aplicados son los vigentes» (20 %).
- **Per què importa**:
  - Amb 14 pagues no prorratejades, la base de cotització mensual inclou la prorrata de les extres: 1.300 + 2 × 1.300 / 12 = **1.516,67 €**. I el 2026 hi ha MEI.
  - Un model presentat com a correcte ensenya a cotitzar sobre el salari del mes, que és l'error conceptual més habitual en nòmines.
  - L'alumne que aplica el 6,50 % de la unitat «detecta» un error en la nòmina bona.
- **Proposta**:
  - Nòmina A:
    - Base de cotització: 1.516,67 €.
    - Contingències comunes: 71,28 €. Desocupació: 23,51 €. FP: 1,52 €. MEI: 2,28 €. Total SS: **98,59 €**.
    - IRPF (6 % sobre 1.300): 78,00 €.
    - Líquid: **1.123,41 €**.
  - Nòmina B (juny, amb paga extra):
    - Meritació: 2.600 €. Base: la mateixa, 1.516,67 €.
    - SS: 98,59 €. IRPF: 6 % × 2.600 = 156,00 €.
    - Líquid: **2.345,41 €**.
    - Cal mantindre l'error provocat (desocupació al 6,55 %) i afegir a les pistes que la paga extra no cotitza el mes que es cobra, perquè ja està prorratejada en la base.
- **Confiança**: Alta.

#### IPE1-D03 · Crític · Rigor i dades — Indemnitzacions: salari diari sense extres, antiguitat anterior a 2012 ignorada i «Despido procedente: 0 días»
- **On**:
  - `actividades/07-vicisitudes-contrato-prestaciones-finiquito.md:54`
  - `refuerzo/eval2-ampliacion.mdx:44-45`
  - `actividades/17-ejercicio-prestaciones-requisitos-cuantia.md:62-66`
- **Evidència**:
  - Cas de Yusuf: «Salario bruto: 1.500 €/mes en 14 pagas (salario diario ≈ 49,32 €)» (l. 54).
  - Ampliació: «salario mensual de 1.500 € (salario diario 50 €) y 20 años de antigüedad … 660 × 50 = **33.000 €** … no se supera el tope» (l. 44-45).
  - Taula de l'activitat 17: «Despido procedente .................... 0 días», al costat de «Despido objetivo (causas) ............. 20 días/año».
- **Per què importa**:
  - **Yusuf**. 49,32 € = 1.500 × 12 / 365: deixa fora les dues pagues extra. El salari que compta per a la indemnització és l'anual amb extres: 1.500 × 14 / 365 = **57,53 €/dia**. Amb 20 dies × 3,5 anys = 70 dies, la indemnització és **4.027,10 €**, no 3.452,40 €: 575 € menys per a Yusuf. El mateix llibre ho fa bé (exercici 7.1).
  - **Ampliació**. Tindre 20 anys d'antiguitat el 2026 vol dir haver entrat cap al 2006. El tram anterior al 12-02-2012 va a 45 dies (DT 11a ET), com diu el mateix llibre a U7:238.
    - ≈ 6 anys × 45 + 14 × 33 = 732 dies.
    - Els dies anteriors a 2012 no arriben a 720, així que s'aplica el topall de 720 dies: **720 × 50 = 36.000 €**, no 33.000 €.
  - **Activitat 17**. «Procedente = 0» només val per a l'acomiadament disciplinari. Un objectiu procedent paga 20 dies per any.
- **Proposta**:
  - Yusuf: «salario diario ≈ 57,53 € (21.000 € / 365)». Afegir solucionari: 4.027,10 €, i el topall de 12 mensualitats (21.000 €) no s'assoleix.
  - Ampliació: o antiguitat ≤ 14 anys (tot posterior a 2012), o ensenyar el càlcul mixt amb el topall de 720 dies.
  - Activitat 17: «Despido disciplinario procedente: 0 días; objetivo procedente: 20 días/año (máx. 12 mensualidades)».
  - Nota: l'ampliació d'eval3 (`eval3-ampliacion.mdx:25`: 25 anys, «Supón que todo el periodo computa a 33 días») arriba per casualitat al mateix import que el règim real (720 × 45 = 32.400 €). Convé dir-ho i aprofitar-ho per a ensenyar el règim mixt.
- **Confiança**: Alta.

#### IPE1-D04 · Crític · Rigor i dades (PRL) — Soroll a 92 dB(A): llibre, deck i repte ensenyen que els protectors auditius arriben «solo ahora», després d'estudiar la resta de mesures
- **On**:
  - `libro/08-prevencion-riesgos-laborales.mdx:253, 263, 265`
  - Deck: l. 566-572
  - `retos/01-prevencion-riesgos-aula-taller.mdx:86, 97`
- **Evidència**:
  - «una máquina de corte produce un **ruido de 92 dB(A)** durante toda la jornada (el límite de exposición diaria que obliga a actuar es de 80 dB(A), según el RD 286/2006) … ordena las medidas que deberían estudiarse **antes** de llegar a los tapones» (l. 253).
  - «5. **Protección individual (EPI)**: solo **ahora**, y como complemento, se entregan los **protectores auditivos**» (l. 263).
  - «**Conclusión**: dar tapones directamente, saltándose toda la jerarquía, sería un error técnico y legal» (l. 265).
  - Repte: «Dar tapones directamente se salta toda la jerarquía» (l. 97).
- **Per què importa**:
  - A 92 dB(A) se superen el valor superior d'acció (85 dB(A)) i el valor límit (87 dB(A)) del RD 286/2006. L'ús de protectors és **obligatori des del primer dia** (art. 7). La zona s'ha de senyalitzar i restringir, i l'empresa ha d'executar un programa de mesures tècniques i organitzatives (art. 4.2) mentre els treballadors van protegits.
  - El principi «col·lectiva abans que individual» no permet deixar la plantilla exposada mentre s'estudia l'encapsulament.
  - A més, 80 dB(A) és el valor *inferior* d'acció, no «el límite».
  - És informació de seguretat que un futur tècnic bàsic en PRL aplicaria malament.
- **Proposta**:
  - Reescriure la conclusió: «Dar tapones *y listo* es insuficiente, pero *no* darlos sería ilegal. A 92 dB(A) los protectores son obligatorios desde ya (art. 7 RD 286/2006), mientras se aplica la jerarquía del art. 15 para bajar el ruido en origen y con protección colectiva, hasta que el EPI vuelva a ser solo el complemento».
  - Afegir la taula 80/85/87 dB(A) i les audiometries (cada 3 anys per damunt de 85 dB(A), cada 5 per damunt de 80).
  - Aplicar el mateix canvi al deck i al pas 3 del repte 01. L'ítem d'ordenar pot quedar si l'enunciat parla de «medidas definitivas» i s'afig un ítem sobre la protecció immediata.
- **Confiança**: Alta.

#### IPE1-D05 · Alt · Rigor + Coherència — Dinàmica 07: el càlcul de vacances no quadra, i el final «Has cobrado lo que te correspondía» oblida la indemnització per fi de contracte temporal
- **On**: `actividades-dinamicas/07-baja-medica-y-finiquito.mdx:20, 50, 61, 99-106`
- **Evidència**:
  - Context: «contrato temporal de 6 meses … 1.200 € brutos al mes … te dicen que el contrato no se renueva y te dan el finiquito» (l. 20).
  - Situació: «tienes derecho a 30 días anuales × (5/12 meses) = 12,5 días, proporcional a los 5 meses y 10 días trabajados… La diferencia son unos 180 €» (l. 50).
  - Feedback: «30 días anuales × 5,33 meses / 12 = 13,3 días» (l. 61).
  - Final: «Has cobrado lo que te correspondía y conoces tu situación real» (l. 99), sense cap menció a la indemnització.
- **Per què importa**:
  - La mateixa pantalla usa 5 mesos i 5,33 mesos. Amb 5 mesos i 10 dies són 13,33 dies. Com que el finiquito en paga 8, falten 5,33 dies × 40 €/dia = **213 €**, no 180 €.
  - La fi d'un contracte temporal dona dret a **12 dies de salari per any** (art. 49.1.c ET). Per 6 mesos són 6 dies ≈ **276 €** (1.200 × 14 / 365 = 46,03 €/dia), o ≈ 237 € si els 1.200 € ja porten la prorrata.
  - L'alumnat d'FP, que sol començar amb contractes temporals, aprendria que el finiquito d'un temporal no inclou res més.
  - No la classifiquem com a crítica perquè el llibre (U7) i l'activitat 07 (cas C) sí que ensenyen els 12 dies. Però la dinàmica els contradiu en el final «d'èxit».
- **Proposta**:
  - Unificar: «5 meses y 10 días → 13,3 días; faltan 5,3 días ≈ 213 €». També es pot fer que el contracte acabe als 6 mesos (15 dies).
  - Afegir al finiquito una línia o una decisió: «Indemnización por fin de contrato: 12 días por año (6 días, unos 276 €)».
  - Reescriure la lliçó final perquè la incloga.
- **Confiança**: Alta.

#### IPE1-D06 · Alt · Rigor + Coherència — «La empresa paga aproximadamente el triple»: en realitat és quasi el quíntuple, i una fitxa diu «casi cinco veces»
- **On**:
  - `libro/07-seguridad-social-vicisitudes.mdx:148, 284`, deck :458, :573
  - `tests/07-seguridad-social-vicisitudes.md:28, 32`
  - `refuerzo/eval3-refuerzo.mdx:19`
  - En contrast: `refuerzo/eval3-ampliacion.mdx:30`
- **Evidència**:
  - «La idea que debes retener no son los decimales —cambian cada año— sino el reparto: **la empresa paga aproximadamente el triple que tú**» (U7:148).
  - Deck: «Lo que hay que retener es el reparto, la empresa paga aproximadamente el triple» (:458).
  - Clau del test Q3: «La empresa paga aproximadamente el triple que el trabajador».
  - Ampliació: «la empresa paga por ti casi cinco veces más en cotizaciones que lo que tú ves descontado».
- **Per què importa**:
  - 30,65 / 6,50 = **4,7**, o 4,9 amb un AT/EP de l'1,5 %. Ni amb els tipus antics (29,9 / 6,35) s'arribava al triple.
  - El llibre demana retindre precisament aquesta proporció, i el test l'avalua.
- **Proposta**:
  - Escriure «la empresa aporta casi cinco veces lo que ves descontado (≈ 30,65 % + AT/EP frente a 6,50 %)» al llibre, al deck (l. 458 i 573), al test Q3 i al reforç d'eval3.
  - Alinear el «30-32 %» de l'opció del test amb el «30,65 % + AT/EP» del llibre.
- **Confiança**: Alta.

#### IPE1-D07 · Alt · Rigor i dades — Seguretat Social amb normativa anterior a 2024-2025: permís per naixement, subsidis i cotització de les pràctiques
- **On**:
  - `libro/07-seguridad-social-vicisitudes.mdx:168, 204, 286`
  - `actividades/07-vicisitudes-contrato-prestaciones-finiquito.md:62`
  - Tot el mòdul: no hi ha cap menció a la cotització de les pràctiques.
- **Evidència**:
  - «**Nacimiento y cuidado de menor** (el antiguo permiso de maternidad/paternidad, hoy equiparado en 16 semanas para ambos progenitores)» (l. 204).
  - «Quien no llega a los 12 meses cotizados, o agota la contributiva, puede acceder a **subsidios** asistenciales de menor cuantía» (l. 168).
  - Cas C: «¿Tiene derecho a prestación por desempleo con seis meses cotizados, o a otra prestación si no llega al mínimo?», sense solucionari.
- **Per què importa**:
  - **Permís per naixement**. Es va ampliar el 2025 (RDL 9/2025) a 19 setmanes per progenitor: 17, més 2 que es poden gaudir fins als 8 anys del menor. Les famílies monoparentals en tenen més.
  - **Subsidis**. No apareix la reforma de l'RDL 2/2024, vigent des de l'1-11-2024. Obri l'accés a menors de 45 anys sense responsabilitats familiars, fixa la quantia en el 95/90/80 % de l'IPREM i fa el subsidi compatible amb un treball (complement de suport a l'ocupació). És justament la resposta del cas C i de la dinàmica 07.
  - **Pràctiques**. Des de 2024 les pràctiques formatives, inclosa la formació en empresa d'FP, cotitzen a la Seguretat Social (DA 52a LGSS, introduïda per l'RDL 2/2023). És el primer contacte de l'alumnat amb el sistema i el material no ho diu.
- **Proposta**:
  - U7:204: «19 semanas por progenitor desde 2025 (17 + 2 hasta que el menor cumple 8 años)».
  - Afegir un quadre «Subsidios tras la reforma de 2024» amb requisits i quanties en percentatge d'IPREM, sense xifres en euros que caduquen.
  - Afegir a U7, o a U1/U4 on es parla de la formació en empresa: «Durante la formación en empresa estás dado de alta en la Seguridad Social (DA 52.ª LGSS), aunque no cobres».
  - Verificar les tres dades al BOE abans de publicar.
- **Confiança**: Mitjana. Coneixem les tres reformes però no les hem pogut contrastar amb el BOE. L'absència als materials és segura.

#### IPE1-D08 · Alt · Alineació curricular — Temps de treball, vacances, permisos i registre de jornada no s'expliquen enlloc
- **On**:
  - `libro/06-contrato-derechos.mdx:79` (la promesa)
  - `libro/07-seguridad-social-vicisitudes.mdx:193`
  - `programacion/programacion.mdx:103`
  - `evaluacion/evaluacion.mdx:42-48` (RA3, criteris a, c i e)
- **Evidència**:
  - U6 promet «tus **derechos básicos**: jornada, salario de convenio, periodo de prueba y lectura de la nómina» (l. 79), però no té cap apartat de jornada.
  - Hem cercat «40 horas», «horas extraordinarias», «registro de jornada», «art. 34», «art. 38», «vacaciones anuales» i «permisos retribuidos» en llibre, tests i fitxes. No hi ha cap explicació, només mencions soltes en activitats (p. ex. `actividades/16-…:59`).
  - U7: «la **modificación** de condiciones … la **suspensión** … y la **extinción** … Nos centramos en las dos últimas» (l. 193).
  - La programació sí que llista «Tiempo de trabajo, salario y nómina» (l. 103).
- **Per què importa**:
  - Són drets bàsics de la relació laboral. El criteri a) del RA3 parla de «derechos y obligaciones derivados de la relación laboral … condiciones de trabajo pactadas en un convenio», i el criteri e) de «recursos laborales ante las diferentes vicisitudes».
  - Són també l'origen de bona part dels conflictes reals de l'alumnat d'FP: hores extra que no es paguen, vacances, registre.
  - La modificació substancial (art. 41 ET) és l'única vicissitud que permet rescindir amb indemnització de 20 dies per any, i no apareix.
- **Proposta**:
  - Un apartat nou a U6, «Tiempo de trabajo y descansos»:
    - 40 h setmanals de mitjana anual i 9 h diàries ordinàries (art. 34 ET);
    - 12 h entre jornades i dia i mig de descans setmanal (arts. 34.3 i 37.1);
    - hores extra: màxim 80 l'any i prohibides a menors (arts. 35 i 6 ET);
    - **registre diari de jornada** obligatori (art. 34.9);
    - 30 dies naturals de vacances, que no es poden substituir per diners (art. 38);
    - permisos retribuïts de l'art. 37.3 (redacció de 2023) i permís parental (art. 48 bis).
  - A U7, dos paràgrafs sobre la modificació substancial (art. 41: rescissió amb 20 dies per any, màxim 9 mensualitats) i la mobilitat.
  - Un ítem de test i un del repte 03 sobre registre de jornada i hores extra.
- **Confiança**: Alta.

#### IPE1-D09 · Alt · Rigor i dades — Contractes formatius i període de prova: tres regles mal formulades
- **On**:
  - `libro/06-contrato-derechos.mdx:139, 140, 144` i deck :413
  - `refuerzo/eval2-ampliacion.mdx:68-69`
  - `actividades-dinamicas/06-primer-contrato-lee-antes-de-firmar.mdx:74-85`
- **Evidència**:
  - «**Contrato de formación en alternancia**: para personas de 16 a 30 años» (l. 139).
  - Contracte per a la pràctica professional: «Salario íntegro de convenio, sin recortes por ser "prácticas"» (l. 140). L'ampliació ho repeteix: «debe pagar el salario íntegro de convenio».
  - Període de prova: «Su duración máxima la fija el convenio (con topes legales: hasta 6 meses para técnicos titulados y 2 meses para el resto…)» (l. 144).
  - La dinàmica 06 planteja un temporal de 6 mesos amb 3 mesos de prova i només el compara amb el màxim del conveni (2 mesos).
- **Per què importa**:
  - **Edat**. L'art. 11.2.b ET no posa límit d'edat quan el contracte en alternança es vincula a FP o a la universitat. El límit de 30 anys és només per a certificats de professionalitat de nivell 1 i 2 i per a programes d'ocupació-formació. El mòdul té alumnat adult.
  - **Salari**. L'art. 11.3.i permet que el conveni fixe una retribució específica per a aquest contracte. El mínim legal és la del contracte en alternança i l'SMI proporcional.
  - **Període de prova**. Els 6 i 2 mesos s'apliquen «en defecto de pacto en convenio» (art. 14.1): no són un topall sobre el conveni. Falta, a més, la regla que més afecta l'alumnat: com a màxim **1 mes** en temporals de fins a 6 mesos i en el contracte per a la pràctica professional (art. 11.3.d), llevat que el conveni diga una altra cosa.
- **Proposta**:
  - Edat: «sin límite de edad si se vincula a FP o universidad; hasta 30 años si se vincula a certificados de nivel 1-2 o a programas de empleo-formación».
  - Salari: «La retribución es la que fije el convenio para este contrato o, en su defecto, la del grupo y nivel de las funciones; nunca inferior a la del contrato en alternancia ni al SMI proporcional».
  - Període de prova: «Si el convenio no dice nada: 6 meses (técnicos titulados), 2 meses (resto), 3 meses en empresas de < 25 trabajadores; 1 mes en temporales de hasta 6 meses y en el contrato de práctica profesional». Portar aquesta regla a la dinàmica 06.
  - Fix-discontinu: afegir 3-4 línies (crida, antiguitat, prestació en els períodes d'inactivitat). La unitat l'anuncia com a modalitat (l. 79), però només el debat.
- **Confiança**: Alta.

#### IPE1-D10 · Alt · Rigor i dades (PRL) — La dinàmica 08 diu que l'accident es comunica «al SEPE» i cita la norma equivocada
- **On**: `actividades-dinamicas/08-incidente-prl-taller.mdx:74, 79`
- **Evidència**:
  - «No llames al SEPE ni a Inspección de Trabajo» (l. 74).
  - «No notificar un accidente de trabajo con baja es una infracción grave según la Ley 31/1995 de PRL y el RD 1299/2006. La empresa tiene obligación legal de comunicarlo al SEPE en 5 días hábiles» (l. 79).
- **Per què importa**:
  - El comunicat d'accident de treball no va al SEPE, que és el servei d'ocupació.
  - Es fa pel sistema Delt@ i arriba a l'entitat gestora o mútua i a l'autoritat laboral (Ordre TAS/2926/2002). El termini és de 5 dies hàbils si hi ha baixa. Si l'accident és greu, molt greu o mortal, cal avisar l'autoritat laboral en 24 h.
  - El RD 1299/2006 és el quadre de malalties professionals, no la norma de notificació.
  - No notificar és una infracció lleu o greu segons la gravetat de l'accident (LISOS, arts. 11.6 i 12.3).
  - El llibre no tracta la notificació en cap lloc: la dinàmica és l'única font de l'alumnat.
- **Proposta**:
  - Canviar la frase de l'encarregat per «No lo comuniquemos a la mutua ni a Inspección».
  - Feedback: «La empresa debe emitir el parte de accidente por Delt@ en 5 días hábiles, y avisar en 24 h a la autoridad laboral si es grave. No hacerlo es una infracción de la LISOS…».
  - Afegir dues línies sobre el comunicat a l'apartat d'emergències d'U8.
- **Confiança**: Alta.

#### IPE1-D11 · Alt · Alineació curricular — PRL: el llibre no cobreix criteris oficials del RA1 que publica la mateixa pàgina d'avaluació
- **On**:
  - `evaluacion/evaluacion.mdx:17-18`
  - `libro/08-prevencion-riesgos-laborales.mdx`: frontmatter `sabers: RA1.a-f`, l. 215 i 265
- **Evidència**:
  - Criteris publicats: «h) Se han determinado los requisitos y condiciones para la vigilancia de la salud…» i «i) … la composición y uso del botiquín».
  - Al llibre, «botiquín» només apareix com a exemple de senyal verd (l. 215). La vigilància de la salut ocupa una línia de l'exercici del soroll (l. 265).
  - Tampoc no hi ha:
    - col·lectius especialment sensibles (menors, embaràs i lactància, arts. 25-27 LPRL);
    - mútues;
    - responsabilitats de l'empresa.
  - U8 s'etiqueta RA1.a-f: els criteris g, h i i queden sense unitat.
- **Per què importa**:
  - El RA1 és el que dona al mòdul l'equivalència amb el nivell bàsic en PRL.
  - Si l'avaluació demana els criteris h) i i) i el material no els ensenya, el professorat ho ha de completar pel seu compte.
  - Menors i embarassades són casos freqüents en la formació en empresa.
- **Proposta**:
  - Afegir a U8 aquests apartats:
    - «Vigilancia de la salud»: art. 22 LPRL; voluntària amb excepcions, confidencial, periòdica i a càrrec de l'empresa.
    - «El botiquín»: contingut mínim de l'annex VI del RD 486/1997 i revisió.
    - «Trabajadores especialmente sensibles»: arts. 25-27 LPRL i art. 6 ET per als menors.
    - Un quadre de responsabilitats: administrativa, civil, penal i recàrrec de prestacions.
  - Reetiquetar U8 com a RA1.a-i i afegir 2-3 ítems de test.
- **Confiança**: Alta sobre l'absència. Els criteris citats són els que publica el mateix lloc.

#### IPE1-D12 · Alt · Alineació curricular — Model de RA: un RA6 sense criteris, codis que no existeixen i una afirmació incorrecta sobre les CCAA
- **On**:
  - `programacion/programacion.mdx:29-36, 67, 175`
  - `evaluacion/evaluacion.mdx:96-104`
  - `libro/04-sector-productivo-perfil.mdx:19`
  - `libro/09-salud-psicosocial-bienestar.mdx:16`
  - `actividades/09-debate-desconexion-digital-bienestar.md` i `actividades/20-dinamica-termometro-estres-afrontamiento.md` (etiqueta `[RA6]`)
- **Evidència**:
  - Programació: «| RA6 | Aplica estrategias de **salud psicosocial y bienestar** en el entorno laboral. | U9 |».
  - Programació: «cada comunidad autónoma fija su propia concreción curricular (la numeración y redacción de los resultados de aprendizaje, sus criterios de evaluación y sus contenidos pueden variar)» (l. 67).
  - A la pàgina d'avaluació, el RA6 és l'únic sense `criterios`. RA1 a RA5 en tenen 9, 3, 7, 11 i 9.
  - U4 s'etiqueta `RA2.d`, però RA2 només té els criteris a-c. U9 s'etiqueta `RA6.a`-`RA6.e`.
- **Per què importa**:
  - La programació diu que «la superación del módulo exige alcanzar todos los resultados de aprendizaje» (l. 175), però el RA6 no té criteris que es puguen acreditar.
  - Segons el que coneixem del RD 659/2023, IPE I té cinc RA: el sisè sembla creat pel material.
  - En FP, els RA i els criteris del mòdul són normativa bàsica estatal. Les CCAA poden ampliar continguts i hores, però no reescriure'ls.
  - Un docent que presente aquesta programació tindria un RA no oficial i codis que no existeixen.
- **Proposta**:
  - Retirar el RA6 com a RA i vincular U9 al RA1 (a: factors de risc, també psicosocials; c: tècniques de prevenció) i al RA3 (c: nous entorns d'organització del treball i dret a la desconnexió).
  - Si es vol mantindre com a bloc, anomenar-lo «Bloque propio: salud psicosocial», sense codi de RA.
  - Corregir la l. 67: «Los RA y criterios de evaluación son los del RD 659/2023, comunes a todo el Estado; la comunidad autónoma concreta contenidos, horas y organización».
  - Reetiquetar `RA2.d` amb el criteri real, i les etiquetes RA6.* com a RA1 o RA3.
- **Confiança**: Alta en les incoherències internes. Mitjana en el nombre oficial de RA, que no hem pogut contrastar amb el BOE.

#### IPE1-D13 · Alt · Alineació curricular (base normativa) — El hub, la meta i les FAQ diuen que IPE és «currículo básico estatal LOMLOE»
- **On**:
  - `src/pages/[asignatura]/index.astro:52-55, 224`
  - `src/lib/faq.ts:107, 115`
  - `src/lib/asignaturas.ts:156, 162`
  - Rutes: `/ipe1-fp/`, `/ca/ipe1-fp/`
- **Evidència**:
  - Text del hub tal com es renderitza: «Este libro se basa en el currículo básico estatal LOMLOE para itinerario personal para la empleabilidad i, establecido en el Ley Orgánica 3/2022 (LOFP) · RD 659/2023, Anexo V.» Ve de la plantilla `curriculumNote` amb `a.title.toLowerCase()`.
  - Meta: «Currículo estatal LOMLOE (Ley Orgánica 3/2022 (LOFP) · RD 659/2023, Anexo V)».
  - FAQ: «Esta materia se basa en el currículo básico estatal LOMLOE…».
  - `seoTitle: 'IPE I (FP): libro, actividades y recursos LOMLOE'`.
- **Per què importa**:
  - Els mòduls d'IPE els crea la LOFP (LO 3/2022) i els desenvolupa el RD 659/2023. No són currículum LOMLOE ni treballen amb competències específiques.
  - És la primera frase normativa que llig el professorat, i també va al JSON-LD de les FAQ.
  - A més, el text té dos errors visibles: «en el Ley» i la «i» minúscula (el numeral romà passat per `toLowerCase()`).
- **Proposta**:
  - Fer que la nota depenga d'un camp nou d'`Asignatura`, per exemple `tipoCurriculo: 'lomloe' | 'fp' | 'autonomico'`.
  - Text per a FP: «Este material sigue los resultados de aprendizaje y criterios de evaluación del módulo, establecidos en el RD 659/2023 (anexo V), que desarrolla la Ley Orgánica 3/2022 de FP. La comunidad autónoma concreta la organización y las horas del módulo.»
  - Traure «LOMLOE» del `seoTitle` i de la meta.
  - No passar el títol per `toLowerCase()`.
- **Confiança**: Alta.

#### IPE1-D14 · Alt · Rigor + To — «El IRPF que pagas se pierde en el presupuesto general del Estado sin darte nada concreto a cambio»
- **On**:
  - `libro/07-seguridad-social-vicisitudes.mdx:131`, deck :433
  - Vegeu també `recursos/nomina-cotizaciones.md:20`
- **Evidència**:
  - «Mucha gente confunde la cotización con un impuesto más. No lo es. El IRPF que pagas se pierde en el presupuesto general del Estado sin darte nada concreto a cambio.» (l. 131)
  - Deck: «El IRPF se pierde en el presupuesto general sin darte nada concreto a cambio.» (:433)
- **Per què importa**:
  - La idea didàctica és bona: la cotització és contributiva i genera drets personals, i l'impost no està afectat a cap prestació concreta.
  - Però la frase és una valoració presentada com a fet, i és falsa: l'IRPF finança serveis que l'alumne usa (educació, sanitat, el mateix cicle d'FP).
  - Va en una diapositiva que es projecta a classe, i contradiu l'enfocament de CJD U6 («deber de contribuir», art. 31 CE).
  - No la classifiquem com a crítica perquè la intenció és contrastar contributivitat i no afectació.
- **Proposta**: «El IRPF no está vinculado a una prestación concreta para ti: va a la caja común y financia servicios de todos (educación, sanidad, carreteras). La cotización, en cambio, genera derechos personales: cada mes cotizado cuenta para tu paro, tu baja y tu pensión.» El mateix canvi al deck.
- **Confiança**: Alta.

#### IPE1-D15 · Mitjà · Rigor — PRL: simplificacions que un tècnic bàsic hauria de matisar
- **On**:
  - `libro/08-prevencion-riesgos-laborales.mdx:80, 137, 153, 234, 236, 330`
  - `refuerzo/eval3-ampliacion.mdx:20`
  - `retos/01-prevencion-riesgos-aula-taller.mdx:116`
- **Evidència**:
  - Resum inicial: «tus derechos básicos a **EPI**, formación, información y a negarte a tareas peligrosas sin formación previa» (l. 80).
  - Accident de treball: «Es **súbito y violento**» (l. 137, 330).
  - Art. 15: «nueve principios que el empresario debe aplicar **en este orden de prioridad**» (l. 153).
  - «solo en empresas de hasta 10-25 trabajadores» (l. 234).
  - Servei de prevenció propi: «obligatorio en empresas grandes o de actividades peligrosas» (l. 236).
- **Per què importa**:
  - El dret legal és interrompre l'activitat davant d'un **risc greu i imminent** (art. 21 LPRL), no un dret genèric a negar-se.
  - L'art. 156 LGSS també inclou malalties no llistades contretes pel treball i presumeix laborals les lesions en temps i lloc de treball, com els infarts. No són «súbites i violentes» en el sentit de la unitat.
  - L'art. 15 és una llista de principis. La jerarquia estricta val sobretot per a «protecció col·lectiva abans que individual».
  - «10-25» és ambigu.
  - El servei propi és obligatori a partir de 500 treballadors, o de 250 si l'activitat és de l'annex I.
- **Proposta**:
  - Resum inicial: «…y a interrumpir el trabajo ante un riesgo grave e inminente (art. 21)».
  - Accident de treball: «normalmente es un suceso súbito, pero la ley también incluye…», amb els apartats 156.2.e i 156.3.
  - Art. 15: «principios que orientan la acción; la ley exige anteponer la protección colectiva a la individual».
  - Assumpció per l'empresari: «hasta 10 trabajadores, o hasta 25 si hay un solo centro de trabajo (art. 11 RD 39/1997)».
  - Servei propi: «más de 500 trabajadores, o de 250 a 500 con actividades del anexo I, o si lo exige la autoridad laboral (art. 14)».
- **Confiança**: Alta.

#### IPE1-D16 · Mitjà · Disseny didàctic (avaluació) — Tests endevinables: la bona és la B en el 81 % i la més llarga en el 98 %
- **On**:
  - `tests/*.md` (9 tests)
  - `QuizPlayer.tsx`, que no barreja les opcions
  - Taula global: `audit/tests-biaix.md`
- **Evidència**:
  - De 89 preguntes d'opció múltiple, la correcta és A/B/C/D = 9/72/8/0.
  - En **87 de 89** la correcta és l'opció més llarga.
  - Les 15 preguntes de vertader/fals tenen resposta «fals».
  - Només hi ha 2 preguntes numèriques en tot el mòdul, tot i que U6-U7 són de càlcul.
- **Per què importa**:
  - Un alumne pot aprovar sense llegir, triant sempre l'opció més llarga.
  - Els tests no avaluen el que les unitats ensenyen a fer: calcular un net, una indemnització o unes vacances.
- **Proposta**:
  - Barrejar les opcions a `QuizPlayer` (mantenint `correcta` com a índex lògic) o reordenar les claus.
  - Igualar la longitud dels distractors i equilibrar vertader/fals.
  - Afegir 3-4 preguntes `numerico` a U6-U7: net d'una nòmina, indemnització objectiva, vacances proporcionals, durada de l'atur.
- **Confiança**: Alta.

#### IPE1-D17 · Mitjà · Rigor i dades — Xifres sense font sòlida o sobredimensionades
- **On**:
  - `libro/08-prevencion-riesgos-laborales.mdx:84, 432`
  - `libro/05-aprendizaje-identidad-digital.mdx:78-82, 209-211, 277`
  - `libro/03-dafo-proyecto-profesional.mdx:204-206, 209`
- **Evidència**:
  - «Casi 500 personas mueren cada año en accidente laboral en España» (U8:84, deck :432).
  - «El 70 % de las contrataciones empieza en LinkedIn», amb la font «InfoJobs · Estudio anual del mercado laboral 2024» (U5:78-82).
  - «El 70 % de las empresas mira los perfiles digitales» (U5:209), amb una referència genèrica: «Informes sobre reputación digital…» (U5:277).
  - Matthews: «Por qué escribir el plan multiplica las probabilidades de cumplirlo» (U3:204).
  - «pasar de A2 a B2 de inglés puede duplicar el sueldo inicial» (U3:209).
- **Per què importa**:
  - Les estadístiques d'accidents de treball del Ministeri de Treball donen, els darrers anys, uns 600-700 morts en jornada i més de 100 *in itinere*. Cal confirmar l'any exacte, però «casi 500» les infravalora.
  - Que un informe d'InfoJobs atribuïsca a LinkedIn el 70 % de les contractacions és poc versemblant, i no l'hem pogut verificar.
  - L'estudi de Matthews no està revisat per parells.
  - La dada de l'anglès no té cap font.
- **Proposta**:
  - Posar la dada del MITES amb l'any i dient si inclou els accidents *in itinere*.
  - Reformular el 70 % («una parte importante de las empresas revisa LinkedIn…») o citar l'estudi primari.
  - Substituir Matthews per la metaanàlisi de Gollwitzer i Sheeran (2006) sobre intencions d'implementació.
  - Traure «duplicar el sueldo».
- **Confiança**: Mitjana. Depén de dades externes que no hem pogut consultar.

#### IPE1-D18 · Mitjà · Disseny didàctic — Activitats de càlcul sense solucionari, i contingències mal etiquetades que un solucionari hauria detectat
- **On**:
  - `actividades/06-…`, `07-…`, `16-…`, `17-…`: només 1 de les 21 activitats porta camp `solucion` (`ejercicio-u6`).
  - `actividades/07-vicisitudes-contrato-prestaciones-finiquito.md:48-50`
  - `libro/07-seguridad-social-vicisitudes.mdx:83`
- **Evidència**:
  - Cas A: «Sufre un accidente no laboral (fractura) … ¿Cumple el requisito de cotización (180 días en los últimos 5 años para enfermedad común)?» (l. 48-50).
  - Cas del llibre: Carlos, «Esquiando en sus vacaciones se rompe la pierna y le dan **seis meses de baja por enfermedad común**» (U7:83).
- **Per què importa**:
  - Sense solucionari, els errors de D03 i D05 arriben al professorat que no refà els números.
  - L'accident no laboral no exigeix període de carència: només l'exigeix la malaltia comuna (180 dies en 5 anys).
  - Una fractura esquiant és un accident no laboral, no una malaltia comuna. Totes dues són contingències comunes i el percentatge és el mateix, però la carència no.
- **Proposta**:
  - Afegir `solucion` a les activitats 06, 07, 16 i 17 amb els càlculs de D02-D03 (Yusuf: 4.027,10 €; Marta: 6 dies × 47,95 € = 287,67 €).
  - Cas A: «¿Necesita periodo de carencia? (no: es accidente no laboral)».
  - Carlos: «baja por accidente no laboral (contingencia común)».
- **Confiança**: Alta.

#### IPE1-D19 · Baix · Coherència entre peces — La calculadora no fa el que el llibre i les fitxes de recurs prometen
- **On**:
  - `libro/06-contrato-derechos.mdx:239`
  - `recursos/nomina-cotizaciones.md:5, 19, 27` i `recursos/calculadora-nomina.md`
  - `src/components/calculadoras/CalculadoraNominaESO.tsx:33, 176, 190-195`
- **Evidència**:
  - El llibre diu: «**Pruébalo tú mismo:** introduce tu salario bruto, el tipo de cotización y la retención de IRPF» (U6:239). Però el component només demana brut, pagues, contracte, fills, discapacitat i deduccions: el tipus i la retenció els calcula ell.
  - `nomina-cotizaciones` promet «…y cuánto le cuesta realmente el puesto a la empresa» i «Después enseña el coste de empresa», però `NominaESO` no mostra el cost d'empresa.
  - Dos recursos (`calculadora-nomina` i `nomina-cotizaciones`) carreguen el mateix component.
  - El preset «Camarero temporal (900 €/mes)» en 14 pagues fa 12.600 € l'any. Si és a jornada completa, queda per davall de l'SMI 2026 (17.094 €).
- **Proposta**:
  - U6:239: «introduce tu salario bruto y tu situación…».
  - Per al cost d'empresa, enllaçar `CosteContratacionCalc` des de `nomina-cotizaciones` (ja existeix: `src/lib/calc/coste-contratacion.ts`, 30,65 % + AT/EP), o afegir aquest bloc al component.
  - Fusionar o diferenciar els dos recursos.
  - Preset: «Camarero a media jornada (900 €/mes)».
  - Vegeu també l'etiqueta «escala estatal» a CJD-D09.
- **Confiança**: Alta.

#### IPE1-D20 · Baix · Rigor i dades — Detalls diversos
- `libro/07-…:146`: el MEI «sube gradualmente hasta 2050». Proposta: «sube 0,1 puntos al año hasta el 1,2 % en 2029 y se mantiene hasta 2050» (RDL 2/2023).
- `libro/09-…:199`: la política de desconnexió és «negociada con la representación». Proposta: «elaborada previa audiencia de la representación legal» (art. 88.3 LOPDGDD).
- `libro/07-…:235` i exercici 7.1 (:251): «Juzgado de lo Social». Proposta: «Tribunal de Instancia, sección de lo Social» (LO 1/2025; CJD U8:148 ja ho explica).
- `actividades-dinamicas/06-…:26`: «Tu título te acredita como Técnico/a Superior en Farmacia y Parafarmacia». És un títol de grau mitjà (Técnico). A la l. 61 s'aconsella consultar una clàusula d'exclusivitat «con el SEPE o un sindicato»; el SEPE no assessora sobre contractes: millor sindicat, Inspecció o un advocat laboralista.
- Bibliografia: el RD 659/2023 es cita com a «BOE-A-2023-16889» (U1-U3 i IPE II) i com a «BOE-A-2023-17122» (U4-U6). Un dels dos és erroni.
- «FCT» (U1:158, 226; U3:173; programació:71…). Proposta: «formación en empresa», la terminologia de la LOFP, amb «(antigua FCT)» la primera vegada.
- **Confiança**: Alta. Excepció: quin dels dos identificadors del BOE és el correcte (Mitjana).

### Patrons de la passada ràpida
- Les 9 unitats tenen el frontmatter complet, deck, test (9-13 ítems), 2-3 activitats, dinàmica i repte. U1-U5 i U9 (autoconeixement, sector, identitat digital, salut psicosocial) són consistents i no tenen errors de càlcul. Els problemes es concentren en el bloc jurídic U6-U8.
- El patró principal: **les correccions de maig es van aplicar al llibre però no a les peces derivades** (tests, reforç i ampliació, activitats, dinàmiques, diagrama compartit). Les xifres jurídiques (tipus, SMI, topalls) haurien de viure en un sol lloc, idealment un mòdul de constants compartit amb `src/lib/calc/nomina.ts`, i propagar-se des d'allí.
- El model de contingut és l'adequat per a FP: RA i criteris a la programació i l'avaluació, codis de RA a `sabers` i `competencias_especificas`. El problema és la fidelitat dels textos i dels codis (D12, D13), no el model.
- Les activitats tenen rúbrica ponderada i durades realistes, però només 1 de 21 té solucionari.
- Tests: 115 ítems (89 d'opció múltiple, 15 V/F, 9 de relacionar, 2 numèrics). Totes les V/F són falses.
- ES/CA: claus idèntiques i xifres idèntiques, també les errònies.

### Estat del diagnòstic anterior
Referència: `docs/diagnostico-ipe1-fp-2026.md`.

| Troballa crítica o alta | Estat | Evidència |
| --- | --- | --- |
| 🔴1 Heimlich escrit «Heimdal» | **Resolt** | Cap ocurrència a `libro/` |
| 🔴2 MEI 2026 = 0,90 % | **Resolt** | U7:146; `src/lib/calc/nomina.ts` |
| 🔴3 Cotització del treballador al 6,50 % | **Parcial** | Correcte al llibre, al deck, a l'exercici 6.1, al repte 03 i a eval2-ampliació. Continua al 6,35 % en els tests d'U6 i U7, en eval3-reforç i ampliació, en l'exercici U6, en l'activitat 06 i en `NominaAnotada` (IPE1-D01, D02) |
| 🟠4 Cost d'empresa ≈ 30-31 % | **Parcial** | Correcte a U6:208/245 i U7:284. El test U7 Q3 manté «30-32 %» i «el triple» (IPE1-D06) |
| 🟠5 Subgrup B amb nota de cautela | **Resolt** | U4:180 |
| 🟠6 Estudi de Matthews | **Pendent** | U3:204-206; bibliografia U3:256 (IPE1-D17) |
| 🟠7 Adecco/Infojobs, 70 % | **Parcial** | El text està matisat («Distintos estudios…», U5:211), però el títol manté «El 70 %» (U5:209) i la referència és genèrica (U5:277) |
| 🟠8 WEF amb any | **Resolt** | U1:71, «Future of Jobs 2025» |
| Precisions: període de prova en empreses de < 25 treballadors; RETA; Leymann; RDL 13/2022; Reglament 2016/425 | **Resolt** | U6:144; U7:110; U9:175; U7:343; U8:191. La regla del període de prova, però, està mal formulada (IPE1-D09) |

---

## Itinerario Personal para la Empleabilidad II (`ipe2-fp`)

**Resum.** El fil de projecte que va d'U4 a U9 és el millor del grup: un sol cas que creix, referències explícites a EDMN i un repte final exemplar. La part d'ocupabilitat també està al dia: ATS, entrevista per competències amb STAR, mercat ocult i marca personal amb el dret a l'oblit.

Els problemes són de tres tipus:
- **Alineació**: les unitats citen RA de FOL i EIE que no coincideixen amb la pàgina d'avaluació.
- **Coherència numèrica**: el capstone contradiu la seua pròpia regla dels 6 mesos i qualifica de «muy sólida» una renda per davall de l'SMI; l'exercici CycloFix té costos desproporcionats.
- **Restes del diagnòstic de maig**: Bezos al test i el 6,35 % en una fitxa.

Els tests tenen el biaix més fort del lloc: la bona és la B en el 93 % de les preguntes.

**Punts forts**
- El resultat principal del diagnòstic de maig està resolt: el bloc emprenedor remet a EDMN amb requadres «Conexión con EDMN 2BACH» (U5:117, 171; U6:105, 209; U7:124). Els diagrames duplicats s'han retirat d'U8.
- Contingut de recerca de feina actual i útil per a FP: fases de selecció des del filtre ATS fins a l'*assessment*, entrevista per competències amb STAR, marca personal alineada entre CV, portfolio i LinkedIn, i dret a l'oblit (RGPD art. 17).
- SL d'1 € ben explicada, amb les seues conseqüències (reserva del 20 % i responsabilitat fins a 3.000 € en liquidació; U9:164, deck :474). Casos reals actualitzats: Mercadona 2024, WEF 2025.
- L'aritmètica dels exercicis és correcta:
  - repte 09 (Bocaviva);
  - exercici U9 (marge 16 €, Q* = 200, −320 € / +640 €);
  - exercici resolt ReUña (marge 13 €, punt mort 19, +1.320 €);
  - dinàmica 09 (595 / 63 = 9,44 → 10 clients).
- Varietat: 20 activitats (5 dinàmiques, 5 casos, 5 exercicis, 3 debats, 2 projectes), 9 dinàmiques i 9 reptes. ES/CA idèntics.

**Unitats revisades a fons**
- U1 `libro/01-mercado-laboral-seleccion.mdx` (+ deck).
  - Test: `tests/01-…`.
  - Activitats: `01-simulacro-proceso-seleccion` (dinàmica), `10-radiografia-ofertas-empleo-sector` (cas), `12-debate-titulo-vs-actitud` (debat).
  - Dinàmica: `01-oferta-vs-mercado-oculto`.
  - Recurs: `generador-cv` (`GeneradorCVEuropass`).
  - Reptes: `01` i `06`.
  - Diff ES↔CA.
- U9 `libro/09-viabilidad-puesta-marcha.mdx` (+ deck).
  - Test: `tests/09-…`.
  - Activitats: `09-plan-empresa-viabilidad-defensa` (projecte), `19-punto-muerto-y-tesoreria-proyecto` i `ejercicio-u9-punto-muerto-viabilidad` (exercicis).
  - Dinàmica: `09-viabilidad-o-cierre`.
  - Recurs: `calculadora-punto-muerto`.
  - Repte: `09-viabilidad-forma-juridica-tramites`.
  - Diagrama: `src/components/diagrams/FormaJuridicaTree.astro`.
  - Diff ES↔CA.
- Comprovacions dirigides a U2-U4 (llibre i tests 02-04), `refuerzo/eval1-*`, `evaluacion/evaluacion.mdx` i `programacion/programacion.mdx`.

### Troballes

#### IPE2-D01 · Alt · Alineació curricular — Els RA que citen les unitats no són els del mòdul: textos de FOL i EIE i criteris inexistents
- **On**:
  - `libro/01-mercado-laboral-seleccion.mdx:63`
  - `libro/02-marca-personal.mdx:15-19, 62`
  - `libro/07-marketing-validacion.mdx:52`
  - `libro/08-emprendimiento-social-design-thinking.mdx:52`
  - `libro/09-viabilidad-puesta-marcha.mdx:52`
  - En contrast: `evaluacion/evaluacion.mdx:7-13, 54-55, 73-74` i `programacion/programacion.mdx:29-35`
- **Evidència**:
  - U1: «**Resultado de aprendizaje**: RA1 (selecciona oportunidades de empleo identificando las diferentes posibilidades de inserción y las alternativas de aprendizaje a lo largo de la vida)». És el RA1 de l'antic mòdul de FOL.
  - U7: «**Resultado de aprendizaje (RD 659/2023, Anexo V)**: RA4 — Define la oportunidad de creación de una pequeña empresa, valorando el impacto sobre el entorno de actuación e incorporando valores éticos». És un RA de l'antic mòdul d'EIE.
  - U9: «RA5 — Realiza las actividades para la puesta en marcha de una empresa, seleccionando la forma jurídica e identificando las obligaciones legales asociadas». També és d'EIE.
  - La pàgina d'avaluació, en canvi, diu:
    - RA1: «Planifica y pone en marcha estrategias en los diferentes procesos selectivos de empleo…», amb 4 criteris (a-d);
    - RA4: «Identifica, define y valida ideas de emprendimiento…»;
    - RA5: «Desarrolla un proyecto emprendedor de innovación social y/o tecnológica…».
  - U2 s'etiqueta `RA1.e`-`RA1.h`, criteris que no existeixen: el RA1 només té a-d, i la marca personal és el d).
- **Per què importa**:
  - El mateix mòdul dona dues redaccions per a cada RA i atribueix al RD 659/2023 textos de mòduls LOE derogats.
  - El docent que copie la capçalera de la unitat a la seua programació citarà RA que no són d'IPE II.
  - Les etiquetes de sabers no casen amb l'avaluació.
- **Proposta**:
  - Substituir la línia «Resultado de aprendizaje» d'U1, U2, U7, U8 i U9 pel text de `evaluacion.mdx`, que és el que coincideix amb la programació.
  - Reetiquetar U1 com a `RA1.a-c` i U2 com a `RA1.d`.
  - Revisar U3-U6 amb el mateix criteri.
- **Confiança**: Alta en la incoherència interna. Mitjana en l'atribució dels textos a FOL i EIE, que fem de memòria.

#### IPE2-D02 · Alt · Coherència + Rigor — El capstone qualifica de «muy sólida» una viabilitat que incompleix la regla dels 6 mesos que la mateixa unitat presenta com a norma
- **On**:
  - `libro/09-viabilidad-puesta-marcha.mdx:243-244, 254-255, 259, 299, 301`
  - `actividades/19-punto-muerto-y-tesoreria-proyecto.md:15, 37, 41-47`
- **Evidència**:
  - Cas ReUña: «colchón de tesorería para 2 meses **600 €**» (l. 244).
  - «**Viabilidad económico-financiera**: muy sólida … inversión inicial cubierta al 100 % con colchón de tesorería incluido» (l. 259).
  - En la mateixa unitat: «**nunca arranques una empresa con menos de 6 meses de gastos fijos en reserva**» (l. 299) i «si los números del capstone no incluyen colchón para seis meses sin ventas, no son números realistas» (l. 301).
  - Resultat: «**+1.320 €/mes** de beneficio operativo (antes de impuestos y de la propia retribución de la emprendedora, que deberá decidir cuánto se asigna como sueldo)» (l. 254).
  - Quota d'autònoms: «a partir del segundo año, la cuota sube según el tramo de rendimientos netos» (l. 243).
- **Per què importa**:
  - **Regles contradictòries**. L'alumnat rep dues regles oposades en la mateixa unitat, i justament en la peça que ha d'imitar.
  - **Renda de la titular**. En un empresari individual no hi ha un «sueldo» separat del benefici. Els 1.320 €/mes abans d'IRPF són tota la renda de la titular per unes 120 visites a domicili al mes, i queden per davall de l'SMI 2026 prorratejat (17.094 € / 12 = 1.424,50 €). El projecte no deixa de ser viable per això, però «muy sólida» amaga la pregunta clau: el cost d'oportunitat.
  - **Quota**. Si els rendiments del primer any són inferiors a l'SMI, la tarifa reduïda es pot prorrogar 12 mesos (art. 38 ter LETA). Després, amb uns rendiments de 1.300-1.500 €/mes, la quota seria d'uns 300 €/mes (taules de 2025; cal confirmar les de 2026). Això puja el punt mort a ≈ 36 serveis.
  - **Activitat 19**. Promet un «Caso guiado resuelto paso a paso como ejemplo» (l. 15 i 37) que no inclou.
- **Proposta**:
  - Coixí: posar-lo a 6 mesos de costos fixos (240 × 6 = 1.440 €, amb una inversió total de 3.340 € i el finançament ajustat), o bé rebaixar la regla a «entre 3 y 6 meses según el riesgo».
  - Diagnòstic: canviar «muy sólida» per «viable en el primer año; la renta de la titular (≈ 1.320 €/mes antes de IRPF) queda por debajo del SMI y el margen se estrecha cuando termina la tarifa reducida».
  - Afegir la pròrroga de la tarifa reduïda i un escenari de tercer any: quota ≈ 300 €, costos fixos ≈ 460 €/mes, punt mort de 36 serveis i resultat ≈ 1.100 €/mes.
  - Incloure el cas guiat a l'activitat 19 (pot ser el mateix ReUña) i demanar que la retribució de la persona emprenedora entre en l'anàlisi.
- **Confiança**: Alta en les incoherències i els càlculs. Mitjana en l'import de la quota de 2026 i en les condicions exactes de la pròrroga.

#### IPE2-D03 · Alt · Coherència entre peces — Exercici U9 (CycloFix): una «tarifa plana» de 1.200 €/mes i una gestoria de 750 €/mes
- **On**: `actividades/ejercicio-u9-punto-muerto-viabilidad.md:29, 35`
- **Evidència**: costos fixos mensuals, amb un total de 3.200 €: «| Cuota de autónomo (tarifa plana) | 1 200 € |» i «| Contabilidad (gestoría) | 750 € |».
- **Per què importa**:
  - La unitat U9 ensenya que la tarifa reduïda és de 80 €/mes i posa la gestoria a 45 €/mes (U9:243).
  - Una «tarifa plana» de 1.200 € és 15 vegades la real, i 750 € mensuals de gestoria són impropis d'un microprojecte.
  - L'aritmètica de l'exercici és correcta, però les dades desmunten el que diu la unitat.
- **Proposta**:
  - Si són tres socis: «Cuotas de autónomo (3 socios, tarifa reducida) 240 €» i «Gestoría 150 €».
  - La diferència (1.560 €) es pot reassignar a una partida nova: «Retribución mínima de los socios 1.560 €». Així es mantenen els 3.200 € i el Q* = 200, i de pas s'ensenya el que falta a IPE2-D02.
- **Confiança**: Alta.

#### IPE2-D04 · Alt · Coherència + Rigor — El test U2 continua atribuint a Jeff Bezos una frase que el llibre ja no li atribueix
- **On**:
  - `tests/02-marca-personal.md:9, 16`
  - `libro/02-marca-personal.mdx:6, 72`
- **Evidència**:
  - Test, Q1: «Según la frase atribuida a Jeff Bezos que abre la unidad, ¿qué es la marca personal?». Explicació: «La frase del fundador de Amazon define la marca personal…».
  - La unitat obri ara amb «lo que dicen de ti cuando sales de la sala», sense atribució.
- **Per què importa**: la pregunta remet a un text que ja no existeix i escampa una atribució que el diagnòstic de maig va marcar com a molt probablement apòcrifa.
- **Proposta**: «Según la definición que abre la unidad, ¿qué es la marca personal?», i una explicació sense Bezos.
- **Confiança**: Alta.

#### IPE2-D05 · Alt · Rigor i dades — L'ampliació d'eval1 usa un tipus de cotització del 6,35 %
- **On**: `refuerzo/eval1-ampliacion.mdx:31-32, 70-71`
- **Evidència**:
  - «calcula la cotización del trabajador … si el tipo a su cargo es del 6,35 %» → «111,13 € al mes» (l. 31-32).
  - «…del **6,35 %** … 127 € al mes … 1.524 € al año» (l. 70-71).
- **Per què importa**:
  - És el mateix error que IPE1-D01, en el curs següent. L'alumnat que ve d'IPE I amb el 6,50 %, si s'ha corregit, hi troba una altra xifra.
  - L'enunciat dona el tipus, de manera que la clau és coherent: el problema és el tipus.
- **Proposta**: 6,50 %. 1.750 × 0,065 = **113,75 €/mes** (1.365 €/any). 2.000 × 0,065 = **130 €/mes** (1.560 €/any).
- **Confiança**: Alta.

#### IPE2-D06 · Alt · Alineació curricular (base normativa) — El hub i les FAQ diuen «currículo básico estatal LOMLOE» per a un mòdul d'FP
- **On**:
  - Els mateixos fitxers que a IPE1-D13
  - `src/lib/asignaturas.ts:178`
  - Rutes: `/ipe2-fp/`, `/ca/ipe2-fp/`
- **Evidència**: «Este libro se basa en el currículo básico estatal LOMLOE para itinerario personal para la empleabilidad ii, establecido en el Ley Orgánica 3/2022 (LOFP) · RD 659/2023, Anexo V.»
- **Per què importa i proposta**: vegeu IPE1-D13. Una sola correcció de la plantilla resol IPE I, IPE II i CJD.
- **Confiança**: Alta.

#### IPE2-D07 · Mitjà · Disseny didàctic (avaluació) — Tests: la bona és la B en el 93 % de les preguntes
- **On**:
  - `tests/*.md`
  - Taula global: `audit/tests-biaix.md`
- **Evidència**:
  - 90 preguntes d'opció múltiple: A/B/C/D = 1/84/5/0.
  - En 77 (86 %) la correcta és l'opció més llarga.
  - Les 15 V/F tenen resposta «fals».
  - Només hi ha 3 preguntes numèriques, en un mòdul que treballa punt mort, VAN i pressupostos.
- **Per què importa**: és el biaix més fort de tot el lloc. El test no distingeix qui ha estudiat de qui no.
- **Proposta**: la mateixa que a IPE1-D16, i afegir preguntes numèriques a U9 (punt mort, marge, coixí).
- **Confiança**: Alta.

#### IPE2-D08 · Mitjà · Rigor + Coherència — L'arbre de forma jurídica pregunta «¿Capital < 3.000 €?» en la unitat que explica l'SL d'1 €
- **On**:
  - `src/components/diagrams/FormaJuridicaTree.astro:29, 46`
  - `libro/09-viabilidad-puesta-marcha.mdx:148, 255`
  - En contrast: `libro/09-…:164, 474`
- **Evidència**:
  - Arbre: «¿Capital < 3.000 €?» i «El árbol cubre el 95 % de los casos. El 5 % restante requiere asesoría profesional.».
  - Solució: «Aplicando el árbol de decisión: «¿vas solo? → sí; ¿capital < 3.000 €? → sí» conduce a **autónomo**» (l. 255).
  - La mateixa unitat explica que la Llei 18/2022 va rebaixar el capital mínim a 1 € (l. 164).
- **Per què importa**:
  - El llindar de 3.000 € era el capital mínim anterior a 2022. Com a criteri de decisió, convida a pensar que amb menys capital no es pot fer una SL.
  - El «95 %» no té font.
  - El diagrama també s'usa a `gpe-bach` U3, `eco-4eso` U10, `taller-eco-3eso` U6 i `edmn-2bach` U2.
- **Proposta**:
  - Canviar la pregunta per «¿Hay riesgo o deudas relevantes y quieres limitar tu responsabilidad?». Si es vol mantindre el capital, dir-ho així: «Con menos de 3.000 €, reserva legal del 20 % y responsabilidad solidaria hasta 3.000 € en liquidación».
  - Traure el «95 %».
- **Confiança**: Alta.

#### IPE2-D09 · Mitjà · Rigor i dades — Manual d'Oslo: quatre tipus d'innovació atribuïts a l'edició de 2018
- **On**:
  - `libro/04-mentalidad-emprendedora.mdx:28, 162-171, 267, 280, 293`
  - `tests/04-mentalidad-emprendedora.md:41-48, 98`
- **Evidència**:
  - «El Manual de Oslo de la OCDE … distingue cuatro tipos» (l. 164), amb la bibliografia «OCDE / Eurostat (2018). *Oslo Manual…* (4.ª ed.)» (l. 293).
  - Test, Q5: «El Manual de Oslo (OCDE) distingue cuatro tipos de innovación. ¿Cuáles?».
- **Per què importa**:
  - La 4a edició (2018) redueix la tipologia a dos tipus: innovació de producte i innovació de procés de negoci. Aquest segon tipus inclou sis funcions, entre les quals l'organització i el màrqueting.
  - Els quatre tipus són de la 3a edició (2005).
  - El test avalua com a fet una atribució incorrecta.
- **Proposta**: «La 3.ª edición del Manual de Oslo (2005) distinguía cuatro tipos… La edición vigente (2018) los agrupa en dos: producto y proceso de negocio». Els quatre tipus es poden mantindre com a eina didàctica. Ajustar l'enunciat del test.
- **Confiança**: Alta.

#### IPE2-D10 · Mitjà · Rigor — Goleman i Belbin «demostraron»: afirmacions més fortes que l'evidència
- **On**:
  - `libro/03-competencias-empleo.mdx:189, 255, 411, 471`
  - `tests/03-competencias-empleo.md:65-72`
- **Evidència**:
  - «La investigación lo desmintió» (l. 189).
  - «predice el desempeño mejor que el cociente intelectual» (l. 255).
  - Deck: «Goleman demostró que predice el desempeño profesional mejor que el cociente intelectual» (l. 471).
  - Test, Q8: «La tesis de Goleman, demostrada en numerosos estudios…».
  - «Belbin demostró que los equipos formados solo por «cerebros» rendían peor» (l. 411).
- **Per què importa**:
  - Les metaanàlisis troben que la intel·ligència emocional aporta una validesa incremental modesta sobre la capacitat cognitiva i la personalitat. La capacitat cognitiva continua sent un dels millors predictors del rendiment.
  - El model de Belbin és útil a l'aula, però té un suport psicomètric feble.
  - El test avalua com a resposta correcta una afirmació exagerada.
- **Proposta**:
  - «Goleman popularizó la idea de que la inteligencia emocional importa tanto como el CI; la investigación posterior confirma que suma, aunque menos de lo que se dijo».
  - «Belbin observó en sus estudios…».
  - Reformular l'opció correcta del test.
- **Confiança**: Alta sobre l'estat general de l'evidència.

#### IPE2-D11 · Mitjà · Alineació + Disseny — Els processos de selecció s'expliquen sense els drets de la persona candidata
- **On**: `libro/01-mercado-laboral-seleccion.mdx:168-194`, de «Fase 1» a «Fase 4. La entrevista»
- **Evidència**:
  - La unitat explica ATS, entrevista per competències i *assessment*, però cap apartat diu què no et poden preguntar ni com es tracten les teues dades.
  - Hem cercat «discrimin», «Ley 15/2022», «embaraz» i «protección de datos» a U1 sense cap resultat. U2 només tracta el dret a l'oblit.
- **Per què importa**:
  - El criteri c) del RA1 parla de «superar procesos selectivos». En 2026 això inclou saber:
    - que les preguntes sobre embaràs, fills, religió o afiliació són discriminatòries (arts. 4.2.c i 17 ET; Llei 15/2022);
    - que tens drets sobre les dades del CV (RGPD) i sobre les decisions automatitzades (art. 22 RGPD);
    - que el Reglament d'IA (UE 2024/1689) classifica d'alt risc els sistemes d'IA de selecció.
  - És especialment rellevant amb alumnat adult.
- **Proposta**:
  - Un requadre «Lo que no te pueden preguntar (y qué hacer)» a la fase d'entrevista, i una línia sobre ATS, IA i dades.
  - Un ítem amb una pregunta improcedent al simulacre (activitat 01).
- **Confiança**: Alta.

#### IPE2-D12 · Mitjà · Rigor i dades — Xifres de mercat laboral i de mortalitat empresarial sense font verificable
- **On**:
  - `libro/01-mercado-laboral-seleccion.mdx:79, 120`
  - `tests/01-mercado-laboral-seleccion.md:21, 24, 92`
  - `libro/09-viabilidad-puesta-marcha.mdx:68-72`
- **Evidència**:
  - «El 70 % de las contrataciones en grandes empresas españolas empieza en LinkedIn; solo el 25 % de los jóvenes españoles tiene un perfil activo» (U1:79).
  - «como el de Lee Hecht Harrison / Adecco Group para el mercado español (2017)— estiman que este circuito supone entre el **60 y el 75 %**» (U1:120). El test diu «60-70 %».
  - U9: «El 60 % de las pymes españolas que cierran lo hacen en los primeros 3 años — y casi siempre por falta de tesorería», amb la font «INE DIRCE + INE Estadística de Mortalidad Empresarial · 2024».
- **Per què importa**:
  - L'estudi de LHH/Adecco no apareix a la bibliografia, i el test i el llibre donen rangs diferents.
  - El DIRCE compta altes i baixes d'empreses, no les causes del tancament. «Casi siempre por falta de tesorería» no pot vindre d'aquesta font.
- **Proposta**:
  - Unificar el rang o expressar-lo sense xifra: «la mayoría de los puestos se cubren sin oferta pública, según distintos estudios». Afegir la referència completa.
  - A U9, separar la dada de supervivència (INE) de l'explicació de les causes: citar un estudi de causes, o presentar-la com a hipòtesi docent.
- **Confiança**: Mitjana.

#### IPE2-D13 · Baix · Coherència + detalls — Pendents menors
- `libro/01-…:125, 232`: `<MetodoSTAR />` apareix dues vegades (pendent del diagnòstic de maig).
- Glovo continua a U5, U6 i U9 (4, 3 i 3 mencions).
- Dos recursos carreguen el mateix component `GeneradorCVEuropass`: `recursos/generador-cv.md` (U1) i `recursos/generador-cv-europass.md` (U2). Convé fusionar-los o diferenciar-ne l'ús.
- Bibliografia: «BOE-A-2023-16889» (U1:318, U2:288, U3:301) davant de «BOE-A-2023-17122» a IPE I U4-U6.
- `libro/09-…:177` i deck :483: «declaración censal (modelo 036/037)». Cal comprovar si el 037 continua vigent: pel que sabem, l'AEAT el va integrar en el 036 el 2025.
- `actividades-dinamicas/09-viabilidad-o-cierre.mdx:55`: «(10 - 7) × 63 = 189 €/mes × 2 = 378 €». Amb 7 clients la pèrdua és 595 − 7 × 63 = **154 €/mes** (308 € en dos mesos). La conclusió no canvia.
- **Confiança**: Alta. Excepció: el model 037 (Mitjana).

### Patrons de la passada ràpida
- Les 9 unitats tenen deck, test (10-14 ítems), 2-3 activitats, dinàmica i repte. U3-U8 no tenen errors de càlcul. Els problemes són d'atribució (D09, D10, D12) i d'alineació de RA (D01).
- Tests: 117 ítems (90 d'opció múltiple, 15 V/F, 9 de relacionar, 3 numèrics). Totes les V/F són falses.
- Només 1 de 20 activitats té solucionari (l'exercici U9). És la mateixa situació que a IPE I.
- El model de RA és el correcte per a FP (programació i avaluació per RA i criteris), però els textos que citen les unitats no coincideixen amb els de l'avaluació (D01).
- ES/CA: claus i xifres idèntiques.

### Estat del diagnòstic anterior
Referència: `docs/diagnostico-ipe2-fp-2026.md`.

| Troballa | Estat | Evidència |
| --- | --- | --- |
| Top 1: solapament amb EDMN sense referències creuades | **Resolt** | Requadres «Conexión con EDMN 2BACH» a U5:117 i 171, U6:105 i 209, U7:124 |
| Top 2a: frase atribuïda a Bezos | **Parcial** | Retirada del llibre (U2:6, 72); el test 02 Q1 la manté (IPE2-D04) |
| Top 2b: 60-70 % de mercat ocult sense font | **Parcial** | U1:120 cita LHH/Adecco (2017) i puja a «60-75 %», però no està a la bibliografia; el test diu «60-70 %» (IPE2-D12) |
| Top 2c: CareerBuilder / Harris Poll | **Resolt** | U2:221, reformulat amb matisos |
| Top 3: DoubleDiamond i EconomiaCircular duplicats a U8 | **Resolt** | Ara només són a U5 i U6 |
| `MetodoSTAR` duplicat a U1 | **Pendent** | U1:125 i 232 |
| Dropbox amb fonts inconsistents | **Resolt** | Ara només és a U5 |
| Glovo, massa freqüent | **Pendent** | U5, U6 i U9 |
| Mercadona 2024 | **Resolt** | U7:267-268 |
| WEF 2025 | **Resolt** | U3:80-101 |
| Quota de 80 € sense context | **Resolt** | U9:243 i 255. Falta, però, la pròrroga i el segon any (IPE2-D02) |

---

## Cultura Jurídica y Democrática (`cjd-bach`)

**Resum.** El llibre és el més rigorós i actual del grup. Incorpora la LO 1/2025 (Tribunals d'Instància i MASC), la desaparició de les faltes (LO 1/2015), l'STC 148/2021 amb els vots particulars, el cas KlimaSeniorinnen i la reforma de l'art. 49. Tracta els temes controvertits amb un equilibri real.

Com a paquet docent, però, està a mitges. Només té llibre, decks, 13 dinàmiques i 5 recursos: no hi ha tests, activitats, reptes, reforç ni avaluació. El hub enllaça seccions buides i afirma que la matèria segueix el «currículo básico estatal LOMLOE» i que té tests. La programació pondera un 20 % de tests inexistents i no publica els criteris d'avaluació.

En rigor, hi ha un error greu en el debat vinculat sobre el Senat (art. 168) i una definició d'elusió fiscal que contradiu la doctrina i les mateixes situacions d'aprenentatge del projecte.

**Punts forts**
- Rigor i actualitat jurídica:
  - l'STC 148/2021 i els vots particulars (U3:77, 358);
  - «Las faltas ya no existen» (U7:108-110);
  - la sentència KlimaSeniorinnen (U7:78);
  - el Tribunal d'Instància i els MASC (U8:148-150, 214, 305);
  - la reforma de l'art. 49 (deck d'U3, l. 455-456).
- Neutralitat: debats amb dues postures ben argumentades i sense noms de partits. La rúbrica del debat del Senat valora «argumenta sobre la institución y no sobre quién la ocupa».
- Ancoratge valencià (Tribunal de les Aigües a U1, Corts, Estatut, DOGV) i ponts explícits amb Economia i EDMN. La programació evita el solapament amb FOPP i IPE (l. 96: «allí se aprende a **usar** una nómina…; aquí se estudia **por qué la norma es como es**»).
- Dinàmiques de qualitat amb feedback jurídic correcte. Per exemple: les hores extra estan prohibides a menors (dinàmica 05:55); la retenció del 7 % per als nous professionals, les dades obligatòries d'una factura i el fet que no estar obligat a declarar no vol dir que no convinga fer-ho (dinàmica 06).
- Paritat ES/CA exacta en les 8 unitats: mateixos títols `##`, mateix nombre de diapositives, mateixes xifres.

**Unitats revisades a fons**
- U3 `libro/03-constitucion-y-poderes-del-estado.mdx` (+ deck), amb la dinàmica `03-quien-puede-prohibir-el-movil` i el debat `src/content/debates/derecho-democracia/03-suprimir-el-senado.mdx`. És la unitat d'institucions. CJD no té cap unitat centrada en drets fonamentals (vegeu CJD-D06).
- U5 `libro/05-derecho-laboral-y-seguridad-social.mdx` (+ deck), amb les dinàmiques `05-el-verano-en-la-heladeria` i `13-la-mesa-del-convenio` i el recurs `nomina`.
- U6 `libro/06-derecho-tributario-y-sistema-fiscal.mdx` (+ deck). És la unitat de tema controvertit. Hi hem revisat:
  - les dinàmiques `06-con-factura-o-en-sobre` i `11-el-iva-que-no-es-tuyo`;
  - el debat `derecho-democracia/06-elusion-fiscal-agresiva`;
  - els recursos `simulador-declaracion-renta` i `progresividad-fiscal`, amb `src/lib/calc/declaracion-irpf.ts` i `irpf.ts`.
- Passada ràpida d'U1, U2, U4, U7 i U8. També hem revisat la programació, `docs/curriculum-cjd-bach.md`, `docs/situaciones-aprendizaje-cjd-bach.md` i l'especificació `docs/superpowers/specs/2026-09-04-cjd-bach-design.md`. Diff ES↔CA de les 8 unitats.

### Troballes

#### CJD-D01 · Crític · Rigor i dades — El debat vinculat a U3 afirma que suprimir el Senat exigiria la reforma agravada de l'art. 168
- **On**:
  - `src/content/debates/derecho-democracia/03-suprimir-el-senado.mdx:62-64`, amb el bessó `.ca.mdx:65`. Afecta també l'objectiu (l. 14) i el criteri de rúbrica «Exactitud institucional».
  - El debat està vinculat a `cjd-bach` U3 per `unidades_relacionadas`.
  - En contrast: `libro/03-constitucion-y-poderes-del-estado.mdx:125`
- **Evidència**:
  - «El debate tiene además una trampa que conviene descubrir en clase: suprimirlo exigiría el procedimiento **agravado** de reforma constitucional, con disolución de las Cortes y referéndum.»
  - Llibre U3: «El procedimiento **agravado** se aplica cuando se toca el Título Preliminar, los derechos fundamentales o la Corona».
- **Per què importa**:
  - El Senat es regula al Títol III (arts. 66-96), que no apareix a l'art. 168. Aquest article només cobreix la revisió total, el Títol preliminar, la secció 1a del capítol II del Títol I i el Títol II.
  - La via és l'ordinària de l'art. 167: 3/5 de cada cambra, i referèndum si ho demana una desena part dels membres d'una de les cambres. Només aniria per l'art. 168 si formara part d'una revisió total.
  - L'error és precisament «la trampa» que el debat demana descobrir. A més, afecta un objectiu explícit («Manejar el procedimiento de reforma constitucional») i contradiu el llibre de la mateixa matèria.
- **Proposta**: «suprimirlo exigiría reformar la Constitución por el procedimiento del art. 167 (tres quintos de cada cámara y referéndum si lo pide una décima parte de diputados o senadores); solo iría por el art. 168 si formara parte de una revisión total». El mateix canvi al bessó valencià.
- **Confiança**: Alta.

#### CJD-D02 · Alt · Alineació + Coherència — CJD no té l'estructura interna obligatòria, i el hub enllaça pàgines buides
- **On**:
  - `src/content/asignaturas/cjd-bach/`: només `libro/`, `actividades-dinamicas/`, `programacion/` i `recursos/`
  - `src/pages/[asignatura]/index.astro:132-138`: `'actividades'` s'hi inclou sense condició
  - `src/pages/[asignatura]/actividades/index.astro:56, 105`
  - `src/pages/[asignatura]/tests/index.astro:11-13, 43`
  - `docs/superpowers/specs/2026-09-04-cjd-bach-design.md:29, 158`
  - `CLAUDE.md`, apartat «Estructura per assignatures (DECISIÓ VINCULANT)»
- **Evidència**:
  - CLAUDE.md: «Les 4 assignatures tenen exactament la mateixa estructura interna» (amb `/tests/` i `/actividades/`) i «Cada assignatura ha de tindre la mateixa estructura interna».
  - Hub: `const material = ['libro', 'diapositivas', 'actividades', …]`. La targeta «Actividades» porta a una pàgina que diu «Las actividades se publicarán a medida que se completen las unidades.».
  - `/cjd-bach/tests/` també es genera, amb «Los tests se publicarán…».
  - L'especificació de CJD ja ho advertia: «un `'publicado'` amb zero unitats deixaria una pàgina viva i buida» (l. 29). I deixava per a la «Fase C — la resta» les activitats, els tests, el reforç, els reptes i l'avaluació (l. 158).
- **Per què importa**:
  - El professorat que entra al hub troba una secció buida i no té eines per a avaluar l'alumnat (tests) ni fitxes per a atendre la diversitat.
  - És la matèria amb menys peces del grup. IPE I té 21 activitats, 115 ítems de test, 9 reptes i 6 fitxes; CJD no en té cap.
  - L'excepció a una regla vinculant no està documentada.
- **Proposta**:
  - A curt termini: condicionar `'actividades'` a un `hasActividades`, com ja es fa amb tests i recursos, i no generar `/tests/` per a matèries sense tests.
  - Completar la Fase C amb prioritat:
    - 8 tests, un per unitat, amb ítems de cas pràctic;
    - 2-3 activitats per unitat: dictamen, comentari de sentència, cerca al BOE o al DOGV;
    - fitxes de reforç i ampliació;
    - una pàgina `evaluacion`.
  - Si l'excepció és volguda, documentar-la a CLAUDE.md i al PRD.
- **Confiança**: Alta.

#### CJD-D03 · Alt · Alineació curricular (base normativa) — El hub, la meta i les FAQ diuen que CJD segueix el «currículo básico estatal LOMLOE» i que té tests
- **On**:
  - `src/pages/[asignatura]/index.astro:52-55, 224`
  - `src/lib/faq.ts:107, 115`
  - `src/lib/asignaturas.ts:228`
  - En contrast: `programacion/programacion.mdx:22, 49`
- **Evidència**:
  - Nota del hub: «Este libro se basa en el currículo básico estatal LOMLOE para cultura jurídica y democrática, establecido en el Decret 108/2022, mod. Decret 103/2026 (CV) — optativa. Cada comunidad autónoma establece concreciones específicas: conviene consultar la de tu comunidad…».
  - Meta: «libro, diapositivas, actividades, tests y recursos. Currículo estatal LOMLOE (…)».
  - FAQ: «Cada asignatura reúne el libro completo …, diapositivas, actividades, tests de autoevaluación y recursos interactivos».
  - La programació de la mateixa matèria diu: «**no tiene base estatal en el Real Decreto 243/2022**» (l. 49).
- **Per què importa**:
  - Són tres afirmacions falses per a CJD, al lloc més visible i al JSON-LD que llegeixen cercadors i assistents.
  - No hi ha currículum bàsic estatal: és una optativa pròpia de la Comunitat Valenciana. Per això no té sentit remetre a «la concreció de la teua comunitat».
  - No hi ha tests ni activitats.
- **Proposta**:
  - Amb el camp `tipoCurriculo` d'IPE1-D13: «Materia optativa propia de la Comunitat Valenciana, regulada por el Decret 108/2022 (anexo de optativas). No tiene currículo básico estatal.»
  - Generar la resposta «¿Qué incluye?» i la meta a partir de les seccions que existeixen (`hasTests`, `hasActividades`…).
- **Confiança**: Alta.

#### CJD-D04 · Alt · Alineació curricular + Disseny (avaluació) — La programació pondera un 20 % de tests que no existeixen i no publica els criteris d'avaluació
- **On**:
  - `programacion/programacion.mdx:40, 137, 141, 149, 167-178`
  - `actividades-dinamicas/*.mdx:10` (13 fitxers)
  - `src/content/debates/derecho-democracia/*.mdx` (`competencias_especificas: []`)
  - `libro/*.mdx` (`sabers: B1.1…B8.3`)
  - `docs/curriculum-cjd-bach.md`, §6
- **Evidència**:
  - «| Pruebas escritas y tests de comprensión | 20 % |» (l. 40 i 149).
  - «retroalimentación sobre los dictámenes y los tests de autoevaluación» (l. 137).
  - «**Criterios de evaluación**: los del anexo curricular vigente, asociados a las competencias específicas CE1-CE6» (l. 141), sense llistar-los.
  - Les «situaciones de aprendizaje» (l. 167-178) són les 8 dinàmiques d'arbre de decisió, de 15-20 minuts.
  - Les 13 dinàmiques i els 8 debats porten `competencias_especificas: []`.
  - Els codis de sabers (`B3.1`…) no es defineixen en cap pàgina publicada.
- **Per què importa**:
  - Una programació que es presenta com a llesta per a adaptar ha de permetre avaluar amb criteris i instruments reals. Ací el 20 % depén d'una peça inexistent, els criteris no són a l'abast del docent i cap activitat està vinculada a una CE.
  - Les situacions d'aprenentatge completes (9 + 5) sí que existeixen, però viuen a `docs/situaciones-aprendizaje-cjd-bach.md`, fora del lloc publicat.
- **Proposta**:
  - Publicar `evaluacion/evaluacion.mdx` amb els criteris que ja estan transcrits a `docs/curriculum-cjd-bach.md` §6, i una rúbrica per CE.
  - Etiquetar dinàmiques i debats amb les seues CE (per exemple: dinàmica 03 → CE1 i CE2; 05 → CE2 i CE4; 06 → CE2 i CE4).
  - Canviar «tests de comprensión» per «pruebas escritas» mentre no hi haja tests.
  - Portar a la programació les situacions d'aprenentatge del document de disseny, o publicar-lo com a pàgina.
  - Explicar la correspondència entre els codis `B3.1`… i els sabers de cada bloc.
- **Confiança**: Alta.

#### CJD-D05 · Mitjà · Rigor — «Elusión fiscal … Es legal»: el llibre i el debat anomenen elusió el que la doctrina tributària anomena economia d'opció
- **On**:
  - `libro/06-derecho-tributario-y-sistema-fiscal.mdx:238-242, 274, 306`, deck :565
  - `src/content/debates/derecho-democracia/06-elusion-fiscal-agresiva.mdx:6, 54-58`
  - En contrast: `docs/situaciones-aprendizaje-cjd-bach.md:306`
- **Evidència**:
  - «La **elusión fiscal** consiste en organizar los propios asuntos para pagar menos **dentro de la ley**: elegir la forma jurídica más ventajosa, aplicar una deducción a la que se tiene derecho, aportar a un plan de pensiones. Es legal.» (U6:240)
  - Glossari: «**Elusión fiscal**: reducción de la carga tributaria mediante conductas amparadas por la ley» (U6:306).
  - Debat: «Eludir es legal y evadir es delito» (descripció).
  - Document de situacions d'aprenentatge del mateix projecte: «economia d'opció (lícita), elusió (dubtosa) i frau (il·lícit)» (l. 306).
- **Per què importa**:
  - En dret tributari espanyol, triar la forma jurídica o aplicar una deducció és **economia d'opció**.
  - L'elusió és evitar el fet imposable amb formes artificioses (conflicte en l'aplicació de la norma, art. 15 LGT, o simulació, art. 16), i l'Administració la pot requalificar.
  - El llibre explica bé el matís en la frase següent. Però l'etiqueta que l'alumnat memoritza (glossari, deck) és la contrària de la que trobarà en un manual de Dret o en la situació d'aprenentatge del mateix projecte.
  - No la classifiquem com a Alta perquè l'ús «elusió = legal» és freqüent en premsa i en manuals d'economia.
- **Proposta**: tres termes a U6, al glossari, al deck i al debat.
  - **Economía de opción**: lícita (forma jurídica, deduccions, pla de pensions).
  - **Elusión**: formes artificioses per a evitar el fet imposable (art. 15 LGT). És la zona que el debat anomena «planificación agresiva».
  - **Evasión / fraude**: ocultació. És infracció i, per damunt de 120.000 € per concepte i any, delicte (art. 305 CP).
- **Confiança**: Alta.

#### CJD-D06 · Mitjà · Alineació + Disseny — No hi ha cap apartat sobre els drets fonamentals i les seues garanties
- **On**: `libro/03-constitucion-y-poderes-del-estado.mdx:113`, i l'estructura de títols d'U1-U8
- **Evidència**:
  - «Esta unidad va, casi entera, de la parte orgánica.» (U3:113)
  - La part dogmàtica apareix a trossos: principis rectors (U3:107), recurs d'empara dins de la taula del TC (U3:282), art. 24 (U8) i drets digitals (U7).
  - Cap unitat explica:
    - la classificació del Títol I (secció 1a, secció 2a i capítol III);
    - les garanties de l'art. 53 (reserva de llei orgànica, contingut essencial, empara ordinària preferent i sumària i empara constitucional);
    - el Defensor del Poble i el Síndic de Greuges;
    - la suspensió de drets (art. 55), tot i que U3 comença amb el cas de l'estat d'alarma.
- **Per què importa**:
  - CE1 i CE4 giren al voltant de valors i drets. Per a un alumne de Batxillerat, saber «quin dret tinc i com el defense» és el nucli de la cultura jurídica democràtica.
  - No és un error, ni un saber que el currículum transcrit a `docs/curriculum-cjd-bach.md` (Bloc 3) nomene explícitament. Per això la considerem de disseny.
- **Proposta**: una secció a U3, o una unitat nova, «Tus derechos y cómo se protegen», amb:
  - el mapa del Títol I i els tres nivells de protecció de l'art. 53;
  - l'empara ordinària i la constitucional;
  - el Defensor del Poble i el Síndic de Greuges (Estatut d'Autonomia);
  - els límits i la suspensió (art. 55 i LO 4/1981);
  - un cas pràctic d'empara.
- **Confiança**: Mitjana. Depén de com es llija el Decret 108/2022; l'absència és segura.

#### CJD-D07 · Mitjà · Rigor i dades — «El Impuesto sobre Sociedades … no es progresivo»: la reforma de 2024 introduïx tipus reduïts per a micro i petites empreses
- **On**: `libro/06-derecho-tributario-y-sistema-fiscal.mdx:177`, deck :487
- **Evidència**: «**no es progresivo**. Se aplica un tipo fijo —el general es del 25 %, con un tipo reducido para entidades de nueva creación…—, de modo que una empresa que gana diez millones y otra que gana cien mil tributan al mismo porcentaje.»
- **Per què importa**:
  - La Llei 7/2024 va establir tipus reduïts, que baixen any rere any, per a microempreses (amb dos trams: els primers 50.000 € de base tributen a un tipus inferior) i per a empreses de dimensió reduïda. El 2026 ja són inferiors al 25 %.
  - Per tant, l'exemple de «10 milions contra 100.000 €, mateix percentatge» ja no és cert en molts casos.
  - La idea de fons es pot mantindre: l'IS no té una escala per trams com la de l'IRPF.
- **Proposta**: «El IS no tiene una escala por tramos como el IRPF: el tipo general es del 25 %, pero la ley fija tipos reducidos para entidades de nueva creación, microempresas y empresas de reducida dimensión, que van bajando hasta 2029.» Confirmar els tipus de 2026 a la Llei 7/2024 abans de publicar-los.
- **Confiança**: Mitjana.

#### CJD-D08 · Baix · Rigor — Dret d'accés a la informació pública: no cal ser major d'edat
- **On**: `libro/03-constitucion-y-poderes-del-estado.mdx:209, 548`
- **Evidència**: «Cualquier persona mayor de edad puede pedir información a una Administración **sin motivar la solicitud**.»
- **Per què importa**:
  - L'art. 12 de la Llei 19/2013 reconeix el dret a «todas las personas», sense fixar edat.
  - L'alumnat de 16-17 anys pot fer de veritat l'activitat que proposa la mateixa unitat.
- **Proposta**: «Cualquier persona puede pedir…». A la Comunitat Valenciana, esmentar la llei autonòmica de transparència i el Consell de Transparència.
- **Confiança**: Alta.

#### CJD-D09 · Baix · Coherència entre peces — Referències creuades i detalls
- `libro/02-ciudadania-global-y-union-europea.mdx:198`: «el RGPD, que estudiarás a fondo en la unidad 8». Proposta: «unidad 7», on hi ha l'apartat «Derecho y tecnología».
- `libro/05-derecho-laboral-y-seguridad-social.mdx:213, 570`: «Demanda ante el Juzgado de lo Social». Proposta: «Tribunal de Instancia, sección de lo Social», com explica la mateixa matèria a U8:148 («Si abres un manual de hace unos años, encontrarás… «Juzgado de lo Social número 2»»).
- `libro/02-…:164, 450`: «ninguno de los dos puede aprobar una norma solo». Proposta: afegir «en el procedimiento legislativo ordinario». En els procediments legislatius especials (per exemple, la fiscalitat, art. 113 TFUE), el Consell adopta la norma després d'una simple consulta al Parlament.
- `libro/05-…:131, 279, 294`: parla de «cuatro notas de laboralidad», mentre que IPE I (U6:266, 378) en compta «cinco», amb el caràcter personalíssim. Cal unificar-ho o explicar que és una qüestió de com es compten.
- `libro/05-…:167` i deck :492: el diagrama `NominaAnotada` mostra «SS trabajador (6,35 %)». Es corregeix amb IPE1-D01.
- Recurs `simulador-declaracion-renta`, component `src/components/calculadoras/IRPFDeclaracion.tsx:67`:
  - La nota diu «Usamos la escala estatal del IRPF», però `src/lib/calc/irpf.ts:94-101` aplica 19/24/30/37/45/47 %. Aquesta és l'escala general sencera (estatal més autonòmica estàndard); l'estatal sola és la meitat.
  - Els resultats són realistes: el que falla és l'etiqueta, i justament en la unitat que explica les dues meitats de l'escala.
  - La lògica tampoc no resta els 2.000 € d'«otros gastos» (art. 19.2.f LIRPF).
  - La reducció per rendiments del treball s'hi aplica amb un sol pendent, i la norma de 2025 en té dos. A partir de ≈ 17.674 € de rendiment la lògica dona una reducció massa baixa, i entre ≈ 19.025 i 19.747,5 € la deixa a 0, quan la real encara és positiva.
- **Confiança**: Alta. Excepció: el detall dels trams de la reducció (Mitjana).

#### CJD-D10 · Baix · Disseny didàctic — Dinàmica 05 (gelateria): dues ocasions perdudes amb una treballadora de 17 anys
- **On**: `actividades-dinamicas/05-el-verano-en-la-heladeria.mdx:20`
- **Evidència**: «Tienes 17 años … El acuerdo es de palabra: 40 horas semanales, 1.100 € al mes «limpios», de junio a septiembre.»
- **Per què importa**:
  - La dinàmica fa bé la resta: alta a la Seguretat Social, registre d'hores, hores extra prohibides a menors, signar el finiquito «no conforme».
  - Però no aprofita dos punts centrals:
    - amb 17 anys cal l'autorització dels pares o tutors per a contractar (art. 7.b ET);
    - 1.100 € nets per 40 hores queden per davall de l'SMI 2026 (1.221 € bruts en 14 pagues ≈ 1.128 € nets al mes sense prorrata, ≈ 1.332 € amb prorrata).
- **Proposta**: afegir una decisió, o una línia de feedback, sobre l'autorització, i una pregunta «¿Cumple el SMI?» amb el càlcul.
- **Confiança**: Alta en l'autorització. Mitjana en el net exacte, que depén de la prorrata i de l'IRPF.

### Patrons de la passada ràpida
- Les 8 unitats (509-651 línies) tenen deck, glossari, «Para profundizar» i «Preguntas para reflexionar». El to és proper i sense emojis. La bibliografia és primària: BOE, DOGV i sentències del TC i del TEDH.
- Hi ha 13 dinàmiques: 8 d'unitat (15-20 min) i 5 de pont amb Economia i EDMN (20-25 min). Estan ben construïdes, però totes tenen `competencias_especificas: []`.
- Els 5 recursos (nòmina, simulador de la renda, progressivitat, empremta digital, matriu de decisió) es reaprofiten d'altres matèries amb fitxes pròpies ben contextualitzades. Hereten, però, les etiquetes i les xifres d'aquells components (CJD-D09).
- Els 8 debats de la família «Derecho y democracia» estan vinculats a unitats de CJD i són equilibrats. Cal revisar-los amb el mateix rigor que el llibre, perquè hi hem trobat el Crític (D01) i la terminologia d'elusió (D05).
- Paritat ES/CA exacta.

### Estat del diagnòstic anterior
No n'hi ha. La matèria es va dissenyar el 2026-09-04 i no apareix a `docs/diagnostico-asignaturas-nuevas-2026.md` ni en cap altre diagnòstic. Aquesta auditoria n'és la primera revisió. Del document de disseny només queda pendent la «Fase C», que és el que recull CJD-D02 i CJD-D04.

---

## Top 5 del grup
1. **IPE1-D01, IPE1-D02 i IPE2-D05**: aplicar un sol joc de valors de cotització de 2026 (6,50 % treballador; 30,65 % + AT/EP empresa; base amb prorrata) a tests, fitxes, exercicis, l'activitat 06 i el diagrama `NominaAnotada` (compartit amb Economia de 4t i CJD), i corregir la clau del test U6 (1.521,00 €).
2. **IPE1-D03 i IPE1-D05**: refer els càlculs d'indemnització i de finiquito, i afegir solucionaris. Cal usar el salari diari amb extres, el règim anterior a 2012 amb el topall de 720 dies i la diferència entre procedent disciplinari i objectiu, i incloure els 12 dies per fi de contracte a la dinàmica 07.
3. **IPE1-D04 i IPE1-D10**: corregir l'exercici del soroll a 92 dB(A) (protectors obligatoris des del primer dia) al llibre, al deck i al repte 01, i la notificació d'accidents (Delt@ i autoritat laboral, no el SEPE).
4. **CJD-D01 a CJD-D04**: corregir el debat del Senat (art. 167, no 168) i completar o documentar l'estructura de CJD. Això vol dir amagar les seccions buides, posar una nota curricular correcta (optativa valenciana, sense base estatal) i publicar una pàgina d'avaluació amb els criteris que ja hi ha a `docs/curriculum-cjd-bach.md`.
5. **IPE1-D12, IPE1-D13, IPE2-D01, IPE2-D06, IPE1-D08 i IPE1-D11**: alinear IPE amb el RD 659/2023 i traure «LOMLOE» del hub, la meta i les FAQ. Els RA i criteris han de ser idèntics a llibre, programació, avaluació i etiquetes, sense RA6 ni codis inexistents. Cal cobrir també el temps de treball, les vacances i el registre de jornada, i els criteris h-i del RA1.
