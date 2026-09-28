# Auditoria didàctica — Grup C: ESO

> Annex de l'[auditoria didàctica](./README.md) · setembre de 2026 · revisió de només lectura sobre `main` (`876e002`).

**Abast**: Economía y Emprendimiento 4.º ESO (`eco-4eso`), Formación y Orientación Personal y Profesional 4.º ESO (`fopp-4eso`) i Taller de Economía 3.º ESO (`taller-eco-3eso`), en l'estat del repositori a 28-09-2026. Auditoria de només lectura i per mostreig (2-3 unitats a fons per assignatura, passada ràpida de la resta, programació, avaluació, refuerzo i ampliació, i totes les peces vinculades a les unitats de diners i drets laborals).

**Mètode i límits**: sense accés a la xarxa (BOE, INE, AEAT i BdE no consultables). Les afirmacions normatives es basen en coneixement propi i porten la confiança indicada. Tots els càlculs marcats s'han refet amb Python/Node, i en el cas de les calculadores amb el mateix codi de `src/lib/calc/`. Les rutes són relatives a l'arrel del repositori (`/home/user/profedeeconomia`). Les cites es mantenen en la llengua original.

**Valors de referència 2026 usats per a refer càlculs**: SMI de 1.221 €/mes en 14 pagues, és a dir, 17.094 €/any (és la xifra que el mateix repositori atribueix al RD 126/2026 a `fopp-4eso/libro/08-derechos-laborales.mdx:105`). Cotització del treballador del 6,50 % en indefinit i del 6,55 % en temporal (4,70 contingències comunes + 1,55/1,60 atur + 0,10 FP + 0,15 MEI), que és el que ja aplica `src/lib/calc/nomina.ts:29-35`. Base de cotització = brut anual / 12 quan hi ha 14 pagues. IRPF: brut − SS − 2.000 € (art. 19.2.f LIRPF) − reducció per rendiments del treball (art. 20: 7.302 € fins a 14.852 €, després dos trams decreixents fins a 19.747,50 €) − mínim personal de 5.550 €, amb l'escala general 19/24/30/37/45/47 % (estatal + autonòmica de referència).

**Recompte**: Eco 4ESO, 18 troballes (1 Crític, 4 Alt, 11 Mitjà, 2 Baix). FOPP 4ESO, 16 (1 Crític, 5 Alt, 8 Mitjà, 2 Baix). Taller 3ESO, 9 (1 Crític, 2 Alt, 4 Mitjà, 2 Baix).

---

## Economía y Emprendimiento 4.º ESO (`eco-4eso`)

**Resum.** El llibre de 12 unitats (9 d'economia i 3 d'empresa) és el més ambiciós del grup. En el cos del text és rigorós: els exercicis resolts de la U5, la U6 i la U8 quadren, els «Ejemplo real» porten font verificable i el tractament del consum i del crèdit és acurat. Els problemes es concentren en les peces derivades (activitats de nòmina, dinàmiques, calculadora, refuerzo, retos i bessons CA), que no han seguit la reestructuració de setembre de 2026 ni l'actualització a 2026, i en les dues numeracions de competències que hi conviuen. La càrrega lectora (unes 9.500 paraules per unitat) supera clarament l'objectiu que fixa el mateix projecte i el temps de lectura declarat.

**Punts forts**
- Els càlculs del llibre són correctes i estan ben explicats. Exemple de la Marina (U5:355-367, amb base = brut anual/12 i SS en 12 mensualitats), Lucía (U6:241-252, amb una matisació honesta al punt 8), revolving i préstecs (U8).
- Consum i drets, exacte i actual: garantia de 3 anys, 14 dies de desistiment, i compres entre particulars sense garantia legal de consum (U7:269).
- La jornada de 37,5 h apareix correctament com a projecte rebutjat pel Congrés el setembre de 2025 (U5:400).
- Casos reals espanyols amb font i enllaç: ERTE 2020, Ley Rider, Banco Popular, DANA i Consorcio, Algeciras, Consum, Mercado Central. El component `RealExample` s'hi fa servir bé.
- Varietat: 65 activitats de 10 tipus, unes 5 per unitat, amb rúbriques. Els 12 decks inclouen diapositiva d'encaix curricular.
- La nota de concreció per CCAA és al hub, al PDF del llibre i a la FAQ. La programació avisa que la seua numeració de CE és pròpia (`programacion/programacion.mdx:68`).

**Unitats revisades a fons**
- `src/content/asignaturas/eco-4eso/libro/05-mercado-trabajo-contratos-nomina-desempleo.mdx` (diners i legal)
- `src/content/asignaturas/eco-4eso/libro/08-economia-personal-banco-credito-inversion-seguros.mdx` (aplicada i sensible: fraus i crèdit)
- `src/content/asignaturas/eco-4eso/libro/03-mercados-oferta-demanda-competencia.mdx` (conceptual)
- Punts concrets de `libro/06` (IRPF) i `libro/07` (consum). Totes les peces vinculades a la U5: test, activitats, dinàmica 08, reto 06, refuerzo eval2, calculadora i simulador.

### Troballes

#### ECO4-D01 · Crític · Rigor i dades — La dinàmica del contracte d'estiu ensenya a un menor que no pot negar-se a fer hores extra
- **On**: `src/content/asignaturas/eco-4eso/actividades-dinamicas/08-primer-contrato-verano.mdx:20, 26-31, 50, 74, 91` (i el bessó `.ca.mdx`).
- **Evidència**:
  - Context (:20): «Tienes 16 años … cuatro horas al día, seis días a la semana … 600 € brutos al mes».
  - Branca «Firmo ya» (:31): «Tú no puedes negarte porque el contrato dice que las extras van incluidas … Firmarlo sin leerlo te hace responsable de lo que dice».
  - Nòmina (:50): «600 € brutos … el ingreso en tu cuenta es 534 € … IRPF (5 %) y … Seguridad Social (6,35 %)».
  - Finiquito (:74): «te corresponden dos días por cada mes trabajado, es decir cuatro días». I a :91: «El SEPE … te puede ayudar … Pierdes los cuatro días de vacaciones».
- **Per què importa**: és l'única peça gamificada sobre treball de l'assignatura, i contradiu el llibre de dalt a baix (U5:264: els menors no poden fer «horas extraordinarias»). Hi ha sis errors:
  1. Les hores extra estan prohibides als menors de 18 anys (ET art. 6.3). Una clàusula d'«extras incluidas» és nul·la (art. 9.1 i 35), i signar-la no et fa «responsable» de complir-la.
  2. Els menors tenen dret a dos dies de descans setmanal ininterromput (art. 37.1): treballar sis dies a la setmana no és legal.
  3. 600 € per 24 h setmanals queda per sota del SMI proporcional. Amb el de 2026: 1.221 × 24/40 = 732,60 € en 14 pagues (854,70 € prorratejat). Fins i tot amb el SMI de 2025 serien 710,40 €.
  4. Vacances: 30 dies naturals a l'any són 2,5 dies per mes treballat, així que en dos mesos en corresponen 5, no 4.
  5. Aritmètica: 600 − 5 % − 6,35 % = 531,90 €, no 534 €. A més, la cotització de 2026 és del 6,50 %. En un contracte de dos mesos sense altres ingressos, la retenció d'IRPF normalment seria del 0 % (art. 81 RIRPF).
  6. El SEPE no reclama finiquitos. La via és la papeleta de conciliació (SMAC) i el Jutjat Social, o bé una denúncia a la ITSS. Per reclamar quantitats hi ha un any de termini (art. 59 ET), així que els dies de vacances no «es perden».

  Una alumna de 16 anys que jugue la dinàmica aprèn exactament el contrari del que diu la llei.
- **Proposta**: reescriure els tres nodes.
  - Node 1: la clàusula d'hores extra és il·legal per a un menor. L'opció correcta és no signar-la i consultar-ho. Com a ganxo, recordar que el pare o la mare també han d'autoritzar el contracte (art. 7.b ET).
  - Context: 4 h × 5 dies i un salari igual o superior al SMI proporcional (p. ex. 740 € bruts en 14 pagues o 860 € prorratejats).
  - Node 2: líquid = brut − 6,50 % de SS, amb un IRPF del 0 % i l'explicació del perquè.
  - Node 3: 5 dies de vacances. Si l'empresa no paga, SMAC o ITSS, amb un any de termini.
  - Actualitzar també el bessó CA, que hui té `unidad_relacionada: 8` i `[CE3]`.
- **Confiança**: Alta (en la retenció del 0 %, Mitjana).

#### ECO4-D02 · Alt · Rigor i dades — SMI de 2025 (i un de 2024) a tot el curs, mentre FOPP i Taller ja fan servir el de 2026
- **On**:
  - `eco-4eso/libro/01-economia-escasez-eleccion.mdx:133, :571`; `libro/03-…:669`
  - `libro/05-…:133, :447, :458, :564-567`
  - `libro/06-…:225`; `libro/08-…:543`
  - `tests/05-…:20`; `actividades/05-dinamica-negociacion-convenio-colectivo.md:49`
  - `refuerzo/eval1-ampliacion.mdx:56-57`; `refuerzo/eval2-refuerzo.mdx:10`
- **Evidència**:
  - U5:133: «En 2025 el SMI es de 1.184 € brutos al mes en 14 pagas, es decir, 16.576 € al año (Real Decreto 87/2025)».
  - Deck de la U5 (:567): «En 2018 era de 735,90 €: ha subido alrededor de un 61 % en siete años».
  - U6:225: «unos 15.876 € al año (el salario mínimo de 2025, 1.134 € en 14 pagas, según el Real Decreto 87/2025)». Però 1.134 € era el SMI de 2024, no el del RD 87/2025.
  - En canvi, `fopp-4eso/libro/08-derechos-laborales.mdx:105` ja diu «1.221 € brutos mensuales en 14 pagas (17.094 €) … Real Decreto 126/2026».
- **Per què importa**:
  - El curs 2026/27 és el primer en què s'usarà el material. Un docent que compare amb FOPP (mateix curs, sovint el mateix professor) hi trobarà dues xifres «vigents».
  - La U1 fa servir precisament el SMI com a exemple de «hecho» verificable enfront d'una opinió, així que la xifra ha de ser la bona.
  - La U6 barreja el SMI de 2024 amb el RD de 2025.
- **Proposta**:
  - Posar-hi 1.221 € × 14 = 17.094 € (RD 126/2026, la mateixa referència que usa FOPP) i «ha subido alrededor de un 66 % en ocho años» (1.221/735,90 = 1,659).
  - U8:543: 17.094/12 = 1.424,50 € bruts al mes, que són uns 1.332 € nets abans d'IRPF (−6,50 %).
  - U6:225: reformular sense xifra de SMI o amb la de 2026.
  - Idealment, centralitzar el SMI, els tipus de cotització i l'any de referència en un fitxer de dades únic (p. ex. `src/data/cifras-2026.ts`) que alimente el llibre, els tests i les activitats.
- **Confiança**: Alta. La xifra de 2026 s'ha pres del mateix repositori i no s'ha pogut contrastar amb el BOE.

#### ECO4-D03 · Alt · Coherència entre peces — Les activitats de nòmina contradiuen el mètode de la U5 i tenen claus errònies
- **On**:
  - `eco-4eso/actividades/05-ejercicio-nomina-bruto-neto.md:12-17, :23-39`
  - `eco-4eso/actividades/05-analisis-nominas-reales.md:5, :21, :100, :102, :124-129, :157, :160, :167, :170`
  - `eco-4eso/libro/05-…:284, :335, :355`
- **Evidència**:
  - **(a) Exercici de brut a net.** «Carlos … 1.500 € (14 pagas) … nómina de mayo de 2026 … Cotización … 6,35 % sobre el salario bruto», i la taula de cotitzacions de l'empresa no inclou el MEI (:23-39). La U5 (:355) ensenya el contrari: la cotització va «sobre la base de cotización mensual (el bruto anual dividido entre doce)».
  - **(b) Anàlisi de nòmines.**
    - «Retención IRPF (7 %): −98,05 €» (:129). Però el 7 % de 1.415 € són 99,05 €, i el líquid és 1.215,51 €, no 1.216,51 €.
    - «Base de cotización: 1.581,67 € (sin incluir plus transporte)» (:127). La U5:335 hi afegeix que el plus de transport no cotitza ni tributa «dentro de ciertos límites». Des del RDL 16/2013, el plus de transport cotitza íntegrament i també tributa a l'IRPF.
    - «Neto anual (× 14)» (:167) resta la SS 14 vegades, quan només es descompta en 12.
    - «Indemnización despido improcedente: No aplica (contrato formativo)» (:170). Un acomiadament improcedent també dona 33 dies per any en un contracte formatiu. El que no hi ha és la indemnització de 12 dies per fi de contracte (art. 49.1.c).
    - «su retención de IRPF es menor (es su primer año trabajando, sin renta acumulada)» (:160). La retenció depén de la retribució prevista dins de l'any i de la situació personal, no de cap «renda acumulada». Amb uns 19.400-19.800 €/any, el càlcul de retencions donaria un 9-10 % en un any complet, no el 3 % i el 7 % que :100 atribueix al «simulador de la AEAT».
    - Es parla de «tres nóminas reales anonimizadas» (:21), però :100 diu que són «realistas».
    - L'Adrián és un «becario en prácticas» (:5, :102) amb contracte per a la pràctica professional. Precisament la U5:284 avisa de no confondre les dues coses.
- **Per què importa**: són les dues activitats que el professorat imprimirà per treballar la nòmina. Les claus donen per bones xifres que el llibre i la calculadora desmenteixen, i introdueixen tres idees errònies: el plus de transport no cotitza, els contractes formatius no tenen indemnització per acomiadament i la retenció depén de la «renda acumulada».
- **Proposta**:
  - **(a) Carlos**: base = 1.500 × 14/12 = 1.750 €; SS del 6,50 % = 113,75 €; IRPF del 12 % sobre 1.500 € = 180 €; líquid = 1.206,25 €. Cotització de l'empresa: 23,60 + 5,50 + 0,20 + 0,60 + 0,75 (MEI) = 30,65 % × 1.750 = 536,38 €, més la d'AT/EP, que convé esmentar. Cost mensual per a l'empresa: uns 2.036,38 €.
  - **(b) Nòmines**:
    - IRPF de 99,05 € i líquid de 1.215,51 €.
    - Plus de transport dins de la base: 1.580,83 + 60 = 1.640,83 € si es cobra en 12 mesos.
    - Net anual = brut anual − 12 × SS − 14 × IRPF, que dona 17.551,62 €, 17.218,02 € i 28.437,16 €.
    - Taula C: «33 días/año si es improcedente; sin indemnización por fin de contrato».
    - Explicar la retenció baixa per un contracte començat a mitjan any.
    - Parlar de «nóminas ficticias pero verosímiles» i de «trabajador en prácticas (contrato laboral)», no de «becario».
- **Confiança**: Alta.

#### ECO4-D04 · Alt · Rigor i dades — La calculadora de nòmina i el simulador de renda inflen l'IRPF dels sous baixos i s'etiqueten com a «escala estatal»
- **On**:
  - Codi: `src/lib/calc/nomina.ts:88-111`; `src/lib/calc/irpf.ts:10-18, :88-116`; `src/lib/calc/declaracion-irpf.ts:98-121`; `src/components/calculadoras/CalculadoraNominaESO.tsx:84`
  - Llibre: `eco-4eso/libro/05-…:372`; `libro/06-…:260`
  - Recursos: `eco-4eso/recursos/calculadora-nomina.md:13, :21-25`; `recursos/simulador-declaracion-renta.md:13`
- **Evidència**: el codi té quatre problemes.
  - `baseIRPF = bruto - totalCotizaciones` no resta els 2.000 € d'«otros gastos» (art. 19.2.f LIRPF).
  - La reducció per rendiments del treball només té un tram (`7302 - 1.75 × (net − 14852)` fins a 19.747,5). La llei en té dos, i el segon és 2.364,34 − 1,14 × (RN − 17.673,52).
  - L'escala aplicada (19-47 %) és la general de retencions, és a dir, la suma d'estatal i autonòmica. En canvi, la UI diu «Usamos la escala estatal del IRPF» (:84) i el comentari d'`irpf.ts:88-93` afirma que només s'aplica la part estatal.
  - `mensual: totalCotizaciones / pagas` reparteix la SS entre 14 pagues.

  Resultats refets amb el mateix codi (cotització del 6,50 %):

| Brut anual | Quota de la calculadora | Quota segons la normativa |
| --- | --- | --- |
| 15.000 € | 223 € (1,5 %) | 0 € |
| 17.094 € (SMI 2026) | 971 € (5,7 %) | ≈ 591 € (3,5 %) |
| 18.200 € (exemple de la U5) | 1.564 € (8,6 %) | ≈ 1.131 € (6,2 %) |
| 20.000 € (Lucía, U6) | 2.675 € (13,4 %) | ≈ 2.044 € (10,2 %) |

  - La SS mensual per a 18.200 € ix a 84,50 € a la calculadora, mentre que l'exemple correcte de la U5 (:367) dona 98,58 €.
  - Amb 16.576 € i una retenció del 2 % (331,52 €), el simulador de renda dona uns 386 € «a pagar». Segons la normativa, el resultat és pràcticament neutre (quota d'uns 338 €).
  - La U5:372 anuncia que la calculadora demana un «salario bruto anual» i «el tipo de retención». En realitat demana el brut mensual i no té cap camp de retenció.
- **Per què importa**:
  - La U6 (punt 8 del SolvedExercise) reconeix honestament que la quota real és més baixa. La calculadora, que el llibre presenta amb un «Pruébalo tú mismo», mostra el contrari, i ho fa justament en la franja salarial d'una primera feina de l'alumnat.
  - Etiquetar com a «estatal» una escala que ja és la total pot fer que un docent la «duplique» per afegir-hi l'autonòmica.
- **Proposta**:
  - Restar els 2.000 € i implementar els dos trams de l'art. 20 (les constants ja són als comentaris del codi).
  - Rebatejar l'escala com a «escala general (estatal + autonómica de referencia)».
  - Calcular la SS mensual com a (brut anual / 12) × tipus.
  - Al simulador, tractar l'estalvi amb la seua escala pròpia o bé treure'l.
  - Afegir tests amb els quatre casos de la taula.
  - Corregir la U5:372 i les dues pàgines de recurs, que parlen d'«escala estatal 2024», del 6,35 %, de la «Unidad 8» i de «PADRE/Renta Web». Aquests dos programes són per a la declaració; l'AEAT té un servei diferent per calcular retencions.
- **Confiança**: Alta en el mètode. Mitjana en els euros exactes, que depenen de com s'interprete el rendiment net previ per a la reducció.

#### ECO4-D05 · Alt · Alineació LOMLOE — Dues numeracions de CE amb els mateixos codis i sentit oposat
- **On**:
  - `eco-4eso/programacion/programacion.mdx:61-68`
  - `eco-4eso/evaluacion/evaluacion.mdx:7-98`
  - El camp `competencias_especificas` de les activitats, que s'imprimeix a `src/pages/[asignatura]/actividades/imprimir/[modo].astro:633-637`
  - El camp `competencia` de `retos/*.mdx`, que es resol contra l'avaluació a `src/pages/[asignatura]/retos/[slug].astro:46`
- **Evidència**:
  - A la programació, «CE4 — Desenvolverse en el mundo del trabajo … (U5)» i «CE6 — Diseñar, validar y comunicar un proyecto emprendedor … (U12)».
  - A l'avaluació (CE oficials del RD 217/2022), la CE4 és «Seleccionar y reunir los recursos … fuentes financieras» i la CE6, «Comprender aspectos básicos de la economía y las finanzas».
  - Les activitats de nòmina imprimeixen «Comp. específicas CE4» (numeració pròpia) sense cap llegenda.
  - Els retos usen la numeració oficial. El reto 10 (consum i reclamacions, U7) porta «CE4», i la seua pàgina mostra la competència oficial de recursos i finançament.
  - La nota de `programacion.mdx:68` explica la numeració pròpia, però cap PDF d'activitats no la reprodueix.
- **Per què importa**: el professorat copia codis de CE al quadern i a la programació d'aula. Ací «CE4» vol dir coses diferents segons la pàgina, i una inspecció llegiria els codis com si foren els oficials. És exactament el risc de «copiar competències no oficials» que calia vigilar.
- **Proposta**:
  - Usar a totes les peces els codis oficials del RD 217/2022 (7 CE). Si es vol mantenir l'agrupació per blocs, donar-li un altre nom (p. ex. «Eje A-F»).
  - Mapa suggerit: pròpies CE1-CE4 (U1-U9) → CE6 oficial; CE5 (empresa i esperit emprenedor) → CE1, CE2 i CE3; CE6 (projecte) → CE4, CE5 i CE7. El reto 10 passaria a CE6.
  - Si es manté la numeració pròpia, imprimir-la amb un prefix diferent (p. ex. «EC4») i amb la llegenda al peu.
- **Confiança**: Alta.

#### ECO4-D06 · Mitjà · Rigor i dades — Tres tipus de cotització del treballador (6,35 %, 6,48 % i 6,5 %) en peces que es fan servir juntes
- **On**:
  - 6,35 %: `actividades/05-ejercicio-nomina-bruto-neto.md:12, :27`; `actividades/05-analisis-nominas-reales.md:112, :128, :144`; `actividades/06-ejercicio-irpf-tramos-iva-ticket.md:23`; `retos/06-economia-finanzas-proyecto.mdx:58, :70-74`; `recursos/calculadora-nomina.md:22`; `actividades-dinamicas/08-primer-contrato-verano.mdx:50`.
  - 6,48 %: `libro/05-…:329, :341`; `refuerzo/eval2-ampliacion.mdx:33, :50`.
  - 6,5 %: `libro/05-…:347-367`; `tests/05-…:73`; `refuerzo/eval2-refuerzo.mdx:33, :48`.
  - 6,50 % (2026): `src/lib/calc/nomina.ts:29-35`.
- **Evidència**:
  - U5:329: «El ejemplo usa un 6,35 % de cotización; en 2025, con el Mecanismo de Equidad Intergeneracional, el porcentaje real de un contrato indefinido es del 6,48 %».
  - Reto 06 (:70): «Un salario bruto de 1.000 € cotiza un 6,35 %».
  - La pàgina de la calculadora (`recursos/calculadora-nomina.md:22`) diu que el tipus «se fija al 6,35 % (4,7 % + 1,55 % + 0,1 %)», mentre que el codi aplica el 6,50 % amb el MEI.
- **Per què importa**: un alumne que fa l'exercici amb el 6,35 % i el comprova amb la calculadora (6,50 %) obté un resultat diferent. El 6,35 % és un tipus anterior al MEI (2022) presentat en una «nómina de mayo de 2026». Els càlculs són coherents amb el tipus que es dona, però el concepte central del diferenciador editorial del llibre queda desactualitzat.
- **Proposta**: fixar un únic valor didàctic, «6,50 % (contrato indefinido, 2026; 6,55 % temporal)», i citar-lo així a totes les peces. Eliminar la frase de la U5:329 (vegeu també ECO4-D04 per a la pàgina de la calculadora).
- **Confiança**: Alta.

#### ECO4-D07 · Mitjà · Coherència entre peces — Referències òrfenes després de la reestructuració a 12 unitats i bessons CA desfasats
- **On**:
  - `eco-4eso/actividades/`: `11-caso-oportunidad-de-un-cambio.md:59`, `11-debate-emprender-o-funcionario.md:54`, `11-diario-molestias-oportunidades.md:81`, `11-scamper-objeto-cotidiano.md:23`, `11-mitos-emprendedor.md:57`, `12-proyecto-diseno-proyecto-emprendedor.md:69`
  - `eco-4eso/recursos/`: `roles-de-equipo.md:13`, `afirmacion-sostenible.md:13`, `calculadora-nomina.md:13`, `simulador-declaracion-renta.md:13`
  - `retos/06-economia-finanzas-proyecto.mdx:19`
  - Els 10 `retos/*.ca.mdx` i 9 dels 10 `actividades-dinamicas/*.ca.mdx`
- **Evidència**:
  - «Conexión con la Unidad 4 (diario de molestias)»: ara el diari és una activitat de la U11.
  - «Conexión con la Unidad 8: … una nómina real»: la nòmina és a la U5.
  - «Conexión con Unidad 5: … la próxima unidad sobre generación de ideas»: seria la U11 o la U12.
  - «La Unidad 2 explica que la creatividad…»: és la U11.
  - «En la Unidad 6, al formar los equipos»: és la U10.
  - «En la Unidad 3, al llegar al greenwashing»: és la U2 o la U7.
  - «Al estudiar … la nómina en la Unidad 8»: és la U5. El reto 06 també diu «Como dice la Unidad 8».
  - Bessons CA que no coincideixen amb l'ES: el reto 01 va a la U11 en ES i a la U2 en CA; el reto 06, a la U5 en ES i a la U8 en CA; la dinàmica 08 porta u5 i [CE4] en ES però u8 i [CE3] en CA; la dinàmica 09, u12 i [CE6] en ES però u9 i [CE2] en CA; i així la resta.
- **Per què importa**: el docent que segueix una «Conexión con la Unidad X» obri una unitat que no hi té res a veure. A la versió CA, retos i dinàmiques pengen d'unitats equivocades, i quan s'active el català a la fase 2 hi entraran amb l'error.
- **Proposta**:
  - Fer una passada sistemàtica amb l'equivalència vella → nova: nòmina i contractes 8→5; consum 5→7; entorn i oportunitats 4→11; habilitats i creativitat 2→11; equips 6→10; ètica i greenwashing 3→2/7; projecte 9-10→12.
  - Copiar `unidad_relacionada` i `competencia(s)` de l'ES als `.ca`.
  - Afegir una comprovació automàtica que exigisca un frontmatter ES/CA idèntic excepte `lang` i `slug`.
- **Confiança**: Alta.

#### ECO4-D08 · Mitjà · Coherència entre peces — Refuerzo i test calculen l'IRPF «sobre el brut», contra la matisació de la U6
- **On**: `eco-4eso/refuerzo/eval2-refuerzo.mdx:37`; `tests/06-estado-impuestos-gasto-publico-desigualdad.md:35`; `libro/06-…:241-252`.
- **Evidència**:
  - Refuerzo: «Dani ha ganado 15.000 € brutos … cuota 1.923,00 € … Tipo medio 12,8 %».
  - Test: «Con la escala estatal simplificada (19 % hasta 12.450 € y 24 %…)».
  - La U6 (:241) avisa que és «una aproximación» i dona el valor real al punt 8. El refuerzo no ho diu.
  - Segons la normativa, 15.000 € de brut donen una quota de 0 €: 15.000 − 975 de SS − 2.000 − 7.302 = 4.723 €, per sota dels 5.550 € de mínim.
  - La retenció de la Lucía (3.400 €, un 17 % sobre 20.000 €) tampoc és realista: rondaria el 10 %.
- **Per què importa**: l'alumnat de refuerzo, que és el més vulnerable, aprèn que un sou de 15.000 € paga 1.923 € d'IRPF. És just la idea que la U6 vol desmuntar («quien gana poco paga muy poco IRPF», U6:225). A més, l'escala 19/24 no és l'estatal (l'estatal seria del 9,5 % i el 12 %).
- **Proposta**:
  - Afegir al refuerzo la mateixa nota del punt 8, o bé plantejar l'exercici sobre la «base liquidable» i no sobre el brut.
  - Canviar «escala estatal» per «escala general orientativa».
  - Posar a la Lucía una retenció d'uns 2.000 € i ajustar-ne el resultat.
- **Confiança**: Alta.

#### ECO4-D09 · Mitjà · Rigor i dades — Les dades de l'EPA de la U5 no quadren entre si ni amb FOPP
- **On**: `eco-4eso/libro/05-…:206, :208, :448`; `fopp-4eso/libro/07-mundo-trabajo-mercado-laboral.mdx:114`.
- **Evidència**:
  - «unos 22,3 millones de personas ocupadas … alrededor de 2,4 millones de parados, con una tasa de paro del 10,3 % (INE, EPA, segundo trimestre de 2025)».
  - Amb aquestes dades, 2,4/(22,3 + 2,4) = 9,7 %. Per a un 10,3 %, els aturats haurien de ser uns 2,56 milions (0,103 × 22,3 / 0,897).
  - Els 2,4 milions coincideixen amb l'atur registrat del SEPE (:208), no amb l'EPA.
  - FOPP, en el mateix curs, ja fa servir l'EPA de l'1T de 2026 (10,83 %).
- **Per què importa**: la unitat ensenya precisament a calcular la taxa d'atur a partir d'ocupats i aturats (exemple de Villaseca). Una xifra real que no quadra desautoritza el mètode.
- **Proposta**: posar-hi uns 2,55 milions d'aturats per a l'EPA del 2T de 2025, o millor actualitzar a la mateixa EPA que FOPP. Mantenir la dada del SEPE separada.
- **Confiança**: Alta en la incoherència. Mitjana en la xifra exacta de l'EPA.

#### ECO4-D10 · Mitjà · Rigor i dades — Indemnització de 12 dies i proteccions dels menors incompletes a la U5
- **On**: `eco-4eso/libro/05-…:264, :282, :388-390`.
- **Evidència**:
  - :282: «Temporal, solo con causa. Dos causas … sustituir … o … circunstancias de la producción … Al terminar, la persona cobra una indemnización de 12 días por año trabajado».
  - :264 enumera, per als menors, el treball nocturn, les hores extra i les tasques perilloses.
  - :388-390 diu «un día y medio seguido de descanso a la semana» per a tothom, «sea cual sea su edad».
- **Per què importa**:
  - L'art. 49.1.c ET exclou de la indemnització de 12 dies el contracte de substitució i els formatius.
  - Als menors hi falten tres regles, i són precisament les que afecten una feina d'estiu: màxim de 8 h diàries de treball efectiu (art. 34.3), descans de 30 minuts si la jornada supera les 4,5 h (art. 34.4) i dos dies de descans setmanal (art. 37.1).
  - :390 presenta el dia i mig com una regla general.
- **Proposta**:
  - A :282: «… 12 días por año trabajado (salvo en el de sustitución)».
  - A :264, afegir: «máximo 8 horas al día, 30 minutos de pausa si se superan 4 horas y media, y dos días seguidos de descanso a la semana».
  - A :390: «(dos días si tienes menos de 18)».
- **Confiança**: Alta.

#### ECO4-D11 · Mitjà · Disseny didàctic — Càrrega de lectura i d'activitats per damunt del temps declarat
- **On**: tots els `eco-4eso/libro/*.mdx` (camp «Tiempo de lectura»); `docs/curriculum-eco-4eso.md:151`; activitats de la U11 (9) i la U12 (7).
- **Evidència**:
  - Paraules de cos per unitat (sense frontmatter, deck ni imports): U1, 8.265; U5, 9.508; U6, 10.757; U8, 9.910; U9, 12.366. La mitjana és de 9.469, i el màxim objectiu del projecte és de 7.000 (doc:151).
  - A 200 paraules per minut són 41-62 minuts de lectura, davant dels «~22-30 min» declarats.
  - La frase mitjana té entre 21,6 i 26,6 paraules. Entre un 12 % i un 25 % de les frases passen de 35 paraules (U5: 25,3 %).
  - Per comparar: a FOPP, 4.886-6.240 paraules i frases de 15,7-23,5; al Taller, 2.669-3.293 paraules i frases de 18,7-21,2.
- **Per què importa**:
  - Amb 15-16 anys i 3 sessions setmanals, cada unitat necessita gairebé una sessió sencera només de lectura.
  - Les frases llargues penalitzen l'alumnat amb dificultats de lectura (DUA).
  - Les activitats (5-9 per unitat, moltes de 45-60 min) no hi caben, juntament amb la lectura, en 7-10 sessions.
- **Proposta**: marcar a cada unitat un «itinerari essencial» (lectura nuclear de 5.000 paraules com a màxim i 2 activitats) i deixar la resta com a ampliació. Retallar les frases de més de 35 paraules de la U5 a la U7. Corregir el temps de lectura declarat o calcular-lo automàticament.
- **Confiança**: Alta (la mètrica és aproximada).

#### ECO4-D12 · Mitjà · Coherència entre peces — La dinàmica del mòbil de segona mà atribueix drets de consum a una compra entre particulars
- **On**: `eco-4eso/actividades-dinamicas/05-compra-movil-usado.mdx:26, :37, :85`; `libro/07-…:269`.
- **Evidència**:
  - :26: «La ley te da derechos como consumidor incluso en comercio entre particulares».
  - :37: l'opció B és un Samsung Galaxy S22, però el text diu «Verificas el IMEI en la web de Apple».
  - :85: davant d'un venedor particular, «la hoja de reclamaciones y el contacto directo son los primeros pasos».
  - «quedarte con un terminal … por 195 € en total» no quadra amb cap preu (el més baix donaria 190 − 20 + 15 = 185 €).
  - El llibre (U7:269) diu el correcte: «si compras a un particular, no hay garantía legal de consumo, solo la protección general del Código Civil».
- **Per què importa**: la dinàmica es presenta com a pràctica de la U7 però ensenya el contrari del llibre, i en un tema que l'alumnat viu de primera mà (Wallapop, Vinted).
- **Proposta**:
  - Reescriure :26: «entre particulares no rige la ley de consumo: te protege el Código Civil por vicios ocultos y, si pagas a través de la plataforma, su sistema de protección».
  - IMEI: «en la web del fabricante o de la operadora».
  - :85: reclamar al venedor i a la plataforma (la fulla de reclamacions és per a empreses).
  - Quadrar l'import.
- **Confiança**: Alta.

#### ECO4-D13 · Mitjà · Rigor i dades — Termini de resposta del banc en un cas de frau
- **On**: `eco-4eso/libro/08-…:168, :176`; `actividades/08-caso-estafa-phishing-derechos.md:18, :59`.
- **Evidència**: «Tienes hasta 13 meses desde el cargo para reclamar, y si el banco no responde en dos meses, puedes acudir al servicio de reclamaciones del Banco de España» (:168).
- **Per què importa**: en els serveis de pagament (càrrecs no autoritzats, phishing), el banc ha de respondre en 15 dies hàbils, ampliables fins a un mes en casos excepcionals (RDL 19/2018, art. 69). El termini de dos mesos és el general d'altres reclamacions. En un cas de frau, dir que cal esperar dos mesos és un mal consell pràctic.
- **Proposta**: «el banco tiene 15 días hábiles para responder (hasta un mes en casos excepcionales); si no contesta o no te da la razón, reclama ante el Banco de España». Els 13 mesos són correctes.
- **Confiança**: Mitjana.

#### ECO4-D14 · Mitjà · Alineació LOMLOE — Sis de les set CE oficials es concentren en les tres últimes unitats
- **On**: `eco-4eso/programacion/programacion.mdx` (temporalització); camp `unidad_relacionada` de `retos/*.mdx`; `evaluacion/evaluacion.mdx`.
- **Evidència**:
  - Les CE oficials 1-5 i 7 (autoconeixement, equips, ideació, recursos, comunicació i prototip) es treballen a U10-U12, que són 26 de les 96 sessions (27 %).
  - 8 dels 10 retos pengen de U10-U12.
  - La CE6 (economia i finances) sosté sola les unitats U1-U9 (70 sessions).
- **Per què importa**: el RD 217/2022 formula l'EyE com una matèria emprenedora. Amb aquesta distribució, sis competències s'avaluen en 8-9 setmanes del tercer trimestre, amb poc marge per a la progressió i la recuperació. Un departament que avalue per CE ho detectarà.
- **Proposta**:
  - Crear fils transversals des del primer trimestre: la CE2 (treball en equip) en les activitats cooperatives de U1-U9; la CE5 (comunicació) en debats i exposicions; la CE3 (ideació) en les activitats de sostenibilitat de la U2.
  - Fer-ho visible a la programació amb una matriu unitat × CE oficial.
- **Confiança**: Alta.

#### ECO4-D15 · Mitjà · Alineació LOMLOE — `docs/curriculum-eco-4eso.md` té tres llistes de CE i una «CE6 editorial»
- **On**: `docs/curriculum-eco-4eso.md:20-40, :64, :74, :93, :125`.
- **Evidència**:
  - La §3 porta el títol «Adaptades de l'Annex II del RD 217/2022» i té 6 CE, entre elles una «CE6. Cultura econòmica i financera bàsica (editorial profedeeconomia)» (:39).
  - La §5 cita «la CE6 del RD 217/2022 (comprendre aspectes bàsics de l'economia i les finances…)» i «les CE1-CE5 i CE7» (:93).
  - La línia :125 descriu una tercera numeració, la de `programacion.mdx`.
  - Els sabers «B.4 … (editorial)» i «C.3 … (editorial)» també es presenten com a propis.
- **Per què importa**: aquest document és una referència obligatòria per generar contingut (CLAUDE.md). Una sessió futura podria reproduir la llista de la §3 com si fora l'oficial. S'ha comprovat que l'etiqueta «CE6 editorial» no ha arribat a cap pàgina publicada (grep sense resultats a `src/`).
- **Proposta**: substituir la §3 per les 7 CE oficials literals i afegir-hi a part una taula «agrupació pròpia ↔ CE oficial». El que és ampliació editorial s'ha de marcar com a «contingut propi que desenvolupa la CE6», no com una competència.
- **Confiança**: Alta.

#### ECO4-D16 · Mitjà · Coherència entre peces — La U3 i la U5 presenten amb signe contrari l'evidència sobre SMI i ocupació
- **On**: `eco-4eso/libro/03-…:335`; `libro/05-…:141, :495, :575`.
- **Evidència**:
  - U3: «el Banco de España estimó que la gran subida del SMI de 2019 (un 22 %) tuvo efectos moderados sobre el empleo … (Documento Ocasional 2210, 2022), y otros estudios encuentran efectos aún menores. Lo veréis con calma en la Unidad 5».
  - U5: «El Banco de España estimó en 2021 que la subida del 22 % de 2019 frenó la creación de empleo … entre 94.000 y 180.000 puestos» (Documento Ocasional 2113).
- **Per què importa**: la U3 promet que la U5 aprofundirà el tema, i la U5 diu una cosa aparentment oposada citant un altre document del mateix emissor. És un tema polèmic, i la U1 demana precisament separar fets d'opinions. Cal presentar el rang d'estimacions (BdE 2021, AIReF i altres estudis) i el debat que hi ha al voltant.
- **Proposta**: unificar-ho en un sol paràgraf a la U5 amb les dues lectures i les fonts. A la U3, remetre a la U5 sense avançar conclusions. Cal verificar la referència «Documento Ocasional 2210», que no he pogut confirmar sense xarxa.
- **Confiança**: Mitjana.

#### ECO4-D17 · Baix · Rigor i dades — L'interès mensual d'una TAE es calcula com a TAE/12
- **On**: `eco-4eso/libro/08-…:565`.
- **Evidència**: «Con un tipo del 27,24 % TAE, una deuda de unos 6.000 € genera alrededor de 135 € de intereses al mes». És el resultat de 6.000 × 27,24 %/12 = 136,20 €.
- **Per què importa**: la TAE ja és un tipus efectiu. El tipus mensual equivalent és (1,2724)^(1/12) − 1 = 2,03 %, que dona uns 122 € al mes. La idea didàctica (la quota amb prou feines amortitza) es manté, però és justament la unitat on s'ensenya què és la TAE.
- **Proposta**: «unos 120 € al mes … solo unos 28 € van a reducir la deuda», o bé parlar de «un tipo nominal de ~27 %».
- **Confiança**: Alta.

#### ECO4-D18 · Baix · Rigor i dades — La idea que cotitzar dona dret a la sanitat
- **On**: `src/components/calculadoras/CalculadoraNominaESO.tsx:88`; `fopp-4eso/recursos/nomina.md:19`; `taller-eco-3eso/libro/07-mundo-del-trabajo.mdx:87`; `taller-eco-3eso/refuerzo/eval3-ampliacion.mdx:16, :25`; `taller-eco-3eso/actividades/21-la-nomina-de-laura.md:21`.
- **Evidència**: la calculadora (:88) diu que la cotització és el «dinero que pagas cada mes para tener derecho a sanidad, paro, baja por enfermedad y … pensión».
- **Per què importa**: des de la Llei 16/2003 i el RDL 7/2018, l'assistència sanitària pública és universal i es finança amb impostos. Cotitzar dona dret a prestacions (atur, incapacitat temporal, jubilació), no a la sanitat. És una idea errònia molt estesa, i el material la reforça en tres assignatures.
- **Proposta**: «… derecho a prestaciones: paro, baja por enfermedad o accidente y pensión. La sanidad pública es universal y se paga con impuestos».
- **Confiança**: Alta.

### Patrons de la passada ràpida
- **Dades de 2025 presentades com a actuals**, i no només el SMI: la quota d'autònoms «En 2025» (`libro/10:271`), «vigente en 2025» (`libro/12:416`) i l'IPC de 2025 a la dinàmica de negociació (`actividades/05-dinamica-negociacion-convenio-colectivo.md:49`).
- **Dinàmiques gamificades desiguals**: només n'hi ha per a les unitats 5, 7, 10, 11 i 12. Cap per a U1-U4, U6, U8 ni U9, que són el bloc d'economia pura.
- **Retos concentrats**: 8 dels 10 són a U10-U12 (vegeu ECO4-D14). No n'hi ha cap per a U3, U4, U6, U8 ni U9.
- **Català**: el llibre CA està al dia, però els retos i les dinàmiques CA no (ECO4-D07).
- **Microdades a revisar**:
  - El preu màxim de les mascaretes «en noviembre de 2020 … 0,62 €» (U3:280): recorde que era de 0,72 € (confiança mitjana).
  - Bizum té «más de 25 millones de usuarios (Bizum, 2024)» a Eco4 (U8:151), però 30,6 milions (2025) al Taller.
- **Activitat del mileurista** (`actividades/05-debate-mileurista-falso-autonomo.md`): les ofertes no porten xifres de brut ni de net, però el criteri d'avaluació puntua un càlcul. Cal donar-ne les dades.
- **To**: correcte en conjunt (plural, proper, «os pongo delante»), sense promoció ni emojis.

### Estat del diagnòstic anterior
Font: `docs/diagnostico-eco-4eso.md`, que encara té l'estructura antiga de 10 unitats.

| Punt del diagnòstic | Estat | Detall |
| --- | --- | --- |
| Cas Bitwise/Pol Tarsa | resolt | ja no apareix |
| Multa de l'AEPD a Renfe | resolt | |
| Xifres de Wallapop, Airbnb i Glovo | resolt | coherents dins del llibre |
| Actualitzar el SMI a 2026 | pendent | ECO4-D02 |
| Totes les xifres de l'antiga U8 (ara U5/U6) a 2026 | parcial | el codi ja té IRPF 2026 i MEI; queden el SMI, el 6,35 % i la quota d'autònoms de 2025 |
| Diari de molèsties com a plantilla | resolt | és l'activitat `11-diario-molestias-oportunidades`, però amb una referència creuada obsoleta (ECO4-D07) |
| Calculadora NominaESO | parcial | la peça existeix; té errors de mètode (ECO4-D04) |
| Imatge de Yolanda Díaz | parcial | el peu s'ha reformulat en clau de diàleg social (U5:273), però es manté el retrat |
| Solapaments amb EDMN (DIRCE, PESTEL, BMC) | no verificat | fora de la mostra d'aquesta auditoria |

---

## Formación y Orientación Personal y Profesional 4.º ESO (`fopp-4eso`)

**Resum.** El llibre de FOPP és el més actualitzat del grup (SMI 2026, EPA de l'1T de 2026). Tracta els temes sensibles (salut mental, assetjament, drets laborals dels menors) amb un to proper i prudent, amb avisos de contingut i recursos d'ajuda. Els riscos són de precisió en dades que l'alumnat farà servir per decidir: una clau de test errònia sobre les modalitats de Batxillerat, les ponderacions de la PAU mal descrites, terminis de reclamació laboral incorrectes i una dinàmica que torna a normalitzar les hores extra d'una menor. A més, les competències tenen una numeració pròpia (CE1-CE8) que es presenta com si seguira l'estatal, i la temporització no cap en 2 sessions setmanals.

**Punts forts**
- Dades actualitzades i citades: SMI 2026 amb el RD 126/2026 (U8:105) i EPA de l'1T de 2026 (U7:114).
- Temes sensibles tractats amb cura: senyals d'alerta en salut mental sense dramatisme (U2:300-306), línia 024, paper de l'observador en l'assetjament i cas de ciberassetjament anonimitzat (U3:204, que resol el cas Kamila del diagnòstic).
- La U8 és molt sòlida en drets dels menors (jornada, treball nocturn, hores extra), i el SolvedExercise 8.1 té els càlculs correctes.
- 51 activitats de 10 tipus i un fil de «proyecto de vida» que travessa tot el curs, amb un reto integrador alineat amb la CE5 oficial (reto 05).
- Els bessons ES/CA estan sincronitzats en frontmatter i xifres.
- Els 83 ítems dels tests porten explicacions útils. Tots els decks tenen diapositiva d'encaix curricular.

**Unitats revisades a fons**
- `src/content/asignaturas/fopp-4eso/libro/02-emociones-autoestima-salud-mental.mdx` (conceptual i sensible)
- `src/content/asignaturas/fopp-4eso/libro/08-derechos-laborales.mdx` (diners i legal)
- `src/content/asignaturas/fopp-4eso/libro/05-sistema-educativo-itinerarios.mdx` i `libro/06-fp-universidad-becas.mdx` (aplicada: itineraris i PAU)
- Punts concrets de `libro/03` (assetjament) i `libro/07`. Tests 02, 05 i 07, dinàmiques 07 i 08, retos, refuerzo eval3, programació i avaluació.

### Troballes

#### FOPP-D01 · Crític · Rigor i dades — La clau del test de la U5 dona per correctes «cinco modalidades» de Batxillerat
- **On**: `fopp-4eso/tests/05-sistema-educativo-itinerarios.md:8-15` (i el `.ca.md`); `libro/05-sistema-educativo-itinerarios.mdx:34, :75, :133, :144, :346, :467, :486, :495`.
- **Evidència**:
  - Pregunta: «¿Cuántas modalidades de Bachillerato establece la LOMLOE (Real Decreto 243/2022)?».
  - Opcions: «Cuatro: Ciencias y Tecnología, Humanidades y Ciencias Sociales, Artes y General» i «Cinco: …».
  - La clau és `correcta: 2` («Cinco»), amb l'explicació: «La LOMLOE reconoce cinco modalidades porque Artes se divide en dos vías…».
  - El llibre alterna «las cuatro modalidades (más la General)» (:133) i «cinco modalidades» (:144, :346).
- **Per què importa**: el RD 243/2022 (art. 6) estableix quatre modalitats: Arts (amb dues vies), Ciències i Tecnologia, General, i Humanitats i Ciències Socials. El test penalitza qui respon bé, i és exactament la informació que l'alumnat de 4t necessita per triar itinerari (i que l'orientador del centre comprovarà).
- **Proposta**: posar `correcta: 1` i l'explicació «Cuatro modalidades; Artes tiene dos vías (Artes Plásticas, Imagen y Diseño; Música y Artes Escénicas)». Unificar el llibre, el deck i el bessó CA amb la fórmula «cuatro modalidades, una de ellas (Artes) con dos vías».
- **Confiança**: Alta.

#### FOPP-D02 · Alt · Rigor i dades — Ponderacions de la prova d'accés descrites al revés
- **On**: `fopp-4eso/libro/06-fp-universidad-becas.mdx:182-183, :187` (i `.ca.mdx:183-184`).
- **Evidència**:
  - :182: «Fase de Acceso (obligatoria) … Su nota media pondera el 60 % del cálculo de acceso».
  - :183: «Fase de Admisión (voluntaria) … Pondera el 40 % restante del cálculo de admisión».
  - La fórmula de :187 és correcta: «Nota de acceso = (0,6 × media de Bachillerato) + (0,4 × media fase de acceso EBAU)».
- **Per què importa**: el text contradiu la fórmula que té just davall.
  - El 60 % correspon a la mitjana de Batxillerat, i la fase d'accés pesa el 40 %.
  - La fase d'admissió no pondera cap «40 % restant»: suma fins a 4 punts (0,1 o 0,2 × la nota de cada matèria aprovada, comptant les dues millors).

  Qui planifique la PAU amb el text calcularà malament la nota d'admissió.
- **Proposta**: «La fase de acceso pesa un 40 % de la nota de acceso (el 60 % restante es la media de Bachillerato). La fase de admisión suma hasta 4 puntos: cada materia aprobada se multiplica por 0,1 o 0,2 según el grado». Fer el mateix canvi al CA.
- **Confiança**: Alta.

#### FOPP-D03 · Alt · Disseny didàctic — Recursos d'ajuda en salut mental i assetjament: un servei que no he pogut identificar i buits importants
- **On**: `fopp-4eso/libro/02-…:308-318`; `libro/03-mi-entorno-familiar-social-digital.mdx:176, :194-202, :204`.
- **Evidència**:
  - U2:311: «ColeKonsulta de la Fundación ANAR — Atención psicológica gratuita para menores de 18 años, presencial y telefónica. Teléfono ANAR 900 20 20 10». El requadre no inclou el 112.
  - Al requadre sobre ciberassetjament (U3:194-202) només hi ha ANAR i «denuncia ante la Policía Nacional (grupo @policia en X responde con orientación)».
  - La línia 017 d'INCIBE només apareix com a font d'un RealExample (:204).
- **Per què importa**: és l'únic lloc on un alumne en risc buscarà a qui trucar.
  - No reconec cap servei «ColeKonsulta» d'ANAR (sí el Telèfon ANAR 900 20 20 10, el xat d'ANAR i el 116 111). Descriure'l com a «presencial» pot generar expectatives falses.
  - Davant d'una ideació suïcida, la indicació estàndard és el 024 i, si hi ha risc immediat, el 112.
  - Per al ciberassetjament, el recurs específic és el 017 (Tu Ayuda en Ciberseguridad), no un compte en una xarxa social.
- **Proposta**: crear el component `<RecursosAyuda>` reutilitzable que ja proposava el diagnòstic, amb:
  - 112 (emergència) i 024
  - ANAR: 900 20 20 10, xat i 116 111
  - 016 (violència de gènere, no deixa rastre a la factura)
  - 017 (ciberseguretat)
  - orientador o orientadora del centre i metge de capçalera

  Revisar-lo cada curs. Eliminar «ColeKonsulta» si no es pot verificar.
- **Confiança**: Mitjana pel que fa a «ColeKonsulta». Alta pel que fa als buits.

#### FOPP-D04 · Alt · Rigor i dades — Terminis i vies de reclamació laboral incorrectes
- **On**: `fopp-4eso/libro/08-derechos-laborales.mdx:306, :308, :314`; `actividades/08-detective-laboral-3-casos.md` («20 días hábiles»); `actividades-dinamicas/08-mi-primer-contrato.mdx:61, :65-67`.
- **Evidència**:
  - :306: la denúncia davant la ITSS «puede ser anónima (la empresa no sabrá quién la presentó)».
  - :308: «no se necesita procurador ni abogado para reclamaciones de cantidad inferiores a 6.000 € … Los plazos son breves: 20 días hábiles desde el despido o desde la última nómina impagada».
  - :314: «La sanción media por infracción grave en materia laboral supera los 7.500 €».
  - Dinàmica (:61): «las horas de los primeros 12 días ya se han perdido sin registro».
- **Per què importa**:
  1. Els 20 dies hàbils són el termini de caducitat per impugnar un acomiadament (art. 59.3 ET). Per reclamar salaris impagats hi ha un any (art. 59.1-2). Amb el text, un jove creurà que ha perdut el dret passades quatre setmanes.
  2. A la jurisdicció social, l'advocat és opcional en primera instància sense cap límit de quantia. El llindar de 6.000 € no hi existeix.
  3. La denúncia formal a la ITSS exigeix identificar-se, tot i que és confidencial. L'anonimat real el dona la Bústia de la ITSS, que és una comunicació, no una denúncia.
  4. Les infraccions laborals greus es multen amb entre 751 i 7.500 € (LISOS art. 40), així que la mitjana no pot superar el màxim.
  5. Les hores treballades es poden reclamar durant un any amb altres proves, encara que no hi haja registre.
- **Proposta**:
  - :308: «Para despidos, 20 días hábiles; para salarios u horas no pagadas, un año. En el Juzgado de lo Social no es obligatorio ir con abogado, aunque es recomendable (los sindicatos asesoran)».
  - :306: «La denuncia exige identificarte, pero la Inspección no revela quién la presentó; si prefieres el anonimato, usa el Buzón de la ITSS».
  - :314: «las graves, entre 751 y 7.500 €; las muy graves, hasta 225.018 €».
  - Corregir en el mateix sentit l'activitat del detectiu i la dinàmica 08.
- **Confiança**: Alta (en les sancions i la Bústia, Mitjana).

#### FOPP-D05 · Alt · Rigor i dades — La dinàmica «Mi primer verano trabajando» tracta les hores extra d'una menor com a compensables
- **On**: `fopp-4eso/actividades-dinamicas/07-primer-verano-trabajando.mdx:37, :50, :74-91`.
- **Evidència**:
  - El node 1 diu bé que «Los menores de 18 años … no pueden … hacer horas extras» (:37).
  - El node 3, amb la Sara de 16 anys, premia amb un «Perfecto» preguntar «si las horas extra se compensarán o si quedan registradas» (:83-85).
  - També afirma que «Las horas extra deben registrarse y compensarse (en tiempo o dinero) según el convenio colectivo» (:79).
  - A :50: «jornada parcial de 20 horas semanales, al SMI proporcional (unos 580 €)».
- **Per què importa**:
  - Per a una menor, la resposta correcta és «no puc fer hores extra» (ET art. 6.3).
  - El SMI proporcional per a 20 h és 1.221 × 20/40 = 610,50 € en 14 pagues (712,25 € prorratejat). Per tant, la feina legal paga més que els 600 € en negre. Aquest argument didàctic és molt més potent que dir que «los 20 € de diferencia son la prima del seguro».
- **Proposta**:
  - Node 3: l'opció òptima ha de ser «Le digo que soy menor y no puedo hacer horas extra; si necesitan más horas, que me amplíen la jornada ordinaria (hasta 8 h al día)».
  - Corregir els 580 € per 610 € (o 712 € amb les pagues prorratejades) i reescriure el feedback de la comparació.
- **Confiança**: Alta.

#### FOPP-D06 · Alt · Alineació LOMLOE — Unes CE1-CE8 pròpies presentades com si seguiren l'ordre estatal, i retos amb codis inexistents
- **On**:
  - `fopp-4eso/programacion/programacion.mdx:57-66`
  - `evaluacion/evaluacion.mdx` (les 5 CE oficials)
  - `retos/06` (CE2), `retos/08` i `09` (CE6), `retos/10` (CE7)
  - `libro/02-…:58` i equivalents («Saberes LOMLOE: A.3, A.4, A.5»)
  - Les 10 dinàmiques, totes amb `[CE2]`
- **Evidència**:
  - Programació (:66): «Los códigos CE1-CE8 son la numeración de este material y siguen el orden en que el currículo básico estatal enuncia estas capacidades».
  - L'avaluació, en canvi, reprodueix les 5 CE oficials del RD 217/2022.
  - Els retos 08-10 porten CE6 i CE7, que no existeixen a l'avaluació. La pàgina del reto cau en els descriptors genèrics, sense text de competència (`src/pages/[asignatura]/retos/[slug].astro:46-54`).
  - El reto 06 (emocions) porta la CE2, que en la llista oficial és «factores personales y socioculturales». La regulació emocional correspon a la CE1 oficial.
  - Els codis «A.3, A.4, A.5» provenen de `docs/curriculum-fopp-4eso.md`, no del RD.
- **Per què importa**: l'afirmació és falsa (el RD té 5 CE, no 8) i convida a copiar CE inexistents a la programació de centre. A més, les rúbriques dels retos 08-10 queden buides.
- **Proposta**:
  - Eliminar la frase i mapar les CE pròpies a les oficials: CE1-CE2 → CE1; CE3 → CE2 (i 4.1); CE4 → CE4; CE5-CE7 → CE3; CE8 → CE5.
  - Retos: 06 → CE1; 08 → CE3; 09 → CE3; 10 → CE5 (o CE3).
  - Sabers: indicar «Saberes (numeración propia)» o fer servir els blocs oficials.
  - Revisar l'etiqueta `[CE2]`, que s'ha posat automàticament a les 10 dinàmiques.
- **Confiança**: Alta.

#### FOPP-D07 · Mitjà · Rigor i dades — La prova d'accés es descriu amb el nom i les matèries d'abans de 2025
- **On**: `fopp-4eso/libro/05-…:165-172, :522`; `libro/06-…:178-196`; test de la U5, pregunta 2 («La fórmula oficial de la nota de acceso a la universidad en la EBAU…»).
- **Evidència**: «La Evaluación de Bachillerato para el Acceso a la Universidad (EBAU) … Fase obligatoria (cuatro ejercicios): Lengua Castellana y Literatura, Historia de España, Lengua Extranjera, y una materia específica» (U5:167-169).
- **Per què importa**: des de la convocatòria de 2025, la prova es diu PAU (RD 534/2024), i a la fase d'accés es pot triar entre Història d'Espanya i Història de la Filosofia. L'alumnat de 4t del curs 2026/27 farà la PAU el 2029.
- **Proposta**: «Prueba de Acceso a la Universidad (PAU, antes EBAU/EvAU)» i «Historia de España o Historia de la Filosofía (a elegir)», més la llengua cooficial on n'hi haja. La fórmula es pot mantenir.
- **Confiança**: Alta pel que fa al nom. Mitjana pel que fa al detall de l'opció.

#### FOPP-D08 · Mitjà · Disseny didàctic — La temporització no és viable amb 2 sessions setmanals
- **On**: `fopp-4eso/programacion/programacion.mdx:5, :22, :82-107`; camp `duracion` de `libro/01` a `libro/10`.
- **Evidència**: la programació diu `horas_semanales: 2` i «2 sesiones semanales», però la taula suma 80 sessions (8+8+8+8, 8+8+7 i 8+10+7). Les unitats declaren «7-8 sesiones · 2,5 semanas», que equival a unes 3 sessions per setmana.
- **Per què importa**: amb 2 sessions setmanals i unes 32-34 setmanes lectives reals, hi ha 64-68 sessions, abans de descomptar avaluacions, eixides i tutories. En falten entre 12 i 16. El docent descobrirà al tercer trimestre que no arriba a U9-U10 (CV, entrevista, projecte de vida), que són el nucli de la matèria.
- **Proposta**: reduir el total a unes 64 sessions (p. ex. 6-7 per unitat i 8 per a la U9), marcar les activitats opcionals i alinear la `duracion` de cada unitat (p. ex. «6 sesiones · 3 semanas»).
- **Confiança**: Alta.

#### FOPP-D09 · Mitjà · Coherència entre peces — Remet a la «Unidad 8 de Eco 4ESO» per a la nòmina
- **On**: `fopp-4eso/libro/08-derechos-laborales.mdx:105, :334`.
- **Evidència**: «El desglose del cálculo del salario bruto a neto … se desarrolla en detalle en la Unidad 8 de Eco 4ESO» (:105).
- **Per què importa**: després de la reestructuració, la nòmina és a la U5 d'Eco 4ESO, i la U8 tracta banca i crèdit. A més, una part de l'alumnat de FOPP no cursa EyE, així que la remissió no pot substituir un mínim de càlcul.
- **Proposta**: «Unidad 5 de Economía y Emprendimiento (si la cursas)», amb un enllaç a la calculadora de nòmina. Mantenir el SolvedExercise 8.1 com a mínim autosuficient.
- **Confiança**: Alta.

#### FOPP-D10 · Mitjà · Rigor i dades — Fonts de salut mental i assetjament mal citades o que no es poden verificar
- **On**: `fopp-4eso/libro/02-…:207, :218, :250, :254, :381`; `tests/02-emociones-autoestima-salud-mental.md:40`; `libro/03-…:162-163, :184, :204, :308-309, :356, :362, :454, :485`.
- **Evidència**:
  - **Twenge**: «Twenge y colaboradores publicado en Lancet Public Health (2023): siguiendo a más de un millón de adolescentes» (:250). La bibliografia diu «Twenge, Haidt, Lozano y Cummins (2023) … The Lancet Public Health, 8(2)» (:381), i el test 02 (:40) ho repeteix. Aquest article és de 2022, es va publicar a *Acta Psychologica* i és una anàlisi de corba d'especificació sobre enquestes, no un seguiment longitudinal.
  - **Save the Children**: «El informe "Yo a eso no juego" de Save the Children España (2024)» (:184). L'informe amb el 9,3 % i el 6,9 % és de 2016 i no és anual.
  - **Mòbil**: «España aprobó en 2024 la prohibición del móvil en horario escolar» (:218). Va ser un acord o recomanació amb les CCAA; la regulació és autonòmica.
  - **INTECO**: es cita com a font de dades de 2022-2024 (:204), però es diu INCIBE des de 2014.
  - **Sense referència comprovable**: Karolinska 2023 (3.300 adolescents, 1,7× / 2,2×), ENS 2023 (un 25 % d'adolescents de 15-24 anys amb ansietat clínica) i OCU 2024 (80 %).
- **Per què importa**: són xifres impactants sobre temes sensibles, i es repeteixen al test i al deck. Si l'alumnat o una família les contrasta i no les troba, el material perd credibilitat. El diagnòstic anterior ja les assenyalava.
- **Proposta**:
  - Corregir la referència de Twenge (*Acta Psychologica*, 2022, vol. 224) i descriure l'estudi com un «reanálisis de grandes encuestas».
  - Datar l'informe de Save the Children el 2016.
  - Mòbil: «En enero de 2024 el Ministerio y las CCAA acordaron restringir el móvil…».
  - Eliminar les xifres no verificables o substituir-les per fonts oficials amb l'any exacte (ENSE, HBSC, ESTUDES).
  - Ajustar la pregunta del test 02.
- **Confiança**: Mitjana.

#### FOPP-D11 · Mitjà · Rigor i dades — Casos inventats amb l'etiqueta «Ejemplo real»
- **On**:
  - `fopp-4eso/libro/05-…:278, :284`; `libro/06-…:335, :341`; `libro/07-…:273`; `libro/09-…:325`; `libro/10-…:284`
  - `libro/04-toma-decisiones.mdx:286` (Andrea Solà, «Reportaje El País, mayo 2024»)
  - `libro/08-…:318` (Mercadona, «Sentencia del Tribunal Supremo … 2023», sense número)
  - `libro/03-…:204` («Un caso real … Tomemos un caso típico»)
  - L'etiqueta del component és a `src/i18n/ui.ts:102`
- **Evidència**:
  - Hi ha set `RealExample` sense camp `source`: Aida, Mario, dues Lucía, Diego, Pablo i Luis.
  - El de ciberassetjament es titula «Un caso real», però el text diu «Tomemos un caso típico que se ha repetido en variantes».
  - `libro/01:230` analitza les «inteligencias dominantes» de Messi i Greta Thunberg a partir de «biografías oficiales», una atribució especulativa a persones reals.
- **Per què importa**: el component imprimeix «Ejemplo real». Si els casos són composicions, s'està enganyant el lector, i CLAUDE.md demana citar fonts. Eco 4ESO fa servir el mateix component sempre amb font i URL, de manera que la diferència de criteri és visible.
- **Proposta**:
  - Crear una variant `<CasoIlustrativo>` (o un prop `ilustrativo`) amb l'etiqueta «Caso ilustrativo» per als casos compostos.
  - Per a Andrea Solà i Mercadona, citar data, mitjà i número de resolució, o bé convertir-los en casos il·lustratius.
- **Confiança**: Mitjana.

#### FOPP-D12 · Mitjà · Rigor i dades — Permís per naixement i pla d'igualtat desactualitzats
- **On**: `fopp-4eso/libro/08-derechos-laborales.mdx:110-111`.
- **Evidència**:
  - :110: «Las empresas de más de 50 personas están obligadas a tener un plan de igualdad y registro retributivo».
  - :111: «nacimiento (16 semanas equiparadas para ambos progenitores)», dins de la llista de «Permisos retribuidos».
- **Per què importa**:
  - El pla d'igualtat és obligatori a partir de 50 persones treballadores («50 o más»). El registre retributiu és obligatori per a totes les empreses (art. 28.2 ET).
  - El naixement és una suspensió del contracte amb prestació de la Seguretat Social, no un permís retribuït de l'art. 37.
  - El RDL 9/2025 el va ampliar fins a 19 setmanes.
- **Proposta**:
  - «A partir de 50 personas trabajadoras, plan de igualdad; todas las empresas deben llevar un registro retributivo».
  - «Nacimiento y cuidado de menor: 19 semanas por progenitor (RDL 9/2025), pagadas por la Seguridad Social». Cal verificar la xifra de 19 setmanes al BOE abans de publicar.
- **Confiança**: Alta pel que fa al pla d'igualtat. Mitjana pel que fa a les 19 setmanes.

#### FOPP-D13 · Mitjà · Rigor i dades — Protocol d'assetjament atribuït al RD 732/1995, i assetjament presentat sempre com a «delito tipificado»
- **On**: `fopp-4eso/libro/03-mi-entorno-familiar-social-digital.mdx:197`.
- **Evidència**: «No es "chivarse": es interrumpir un delito tipificado. Todos los institutos de España tienen protocolo obligatorio frente al acoso desde el RD 732/1995».
- **Per què importa**: el RD 732/1995 (drets i deures de l'alumnat) va quedar substituït per normativa autonòmica. L'obligació de tenir protocols ve de la LO 8/2021 (LOPIVI, arts. 34-35) i de les ordres de cada CCAA. A més, no tot assetjament és delicte, encara que algunes conductes sí que ho són (art. 173 CP, amenaces, difusió d'imatges).
- **Proposta**: «… es proteger a alguien. Todos los centros deben tener un protocolo contra el acoso (Ley Orgánica 8/2021, de protección de la infancia, y la normativa de tu comunidad); algunas conductas de acoso son además delito».
- **Confiança**: Mitjana.

#### FOPP-D14 · Mitjà · Coherència entre peces — El refuerzo de la tercera avaluació combina el 6,35 % amb una cotització sobre el brut mensual
- **On**: `fopp-4eso/refuerzo/eval3-refuerzo.mdx:11, :19, :27-28, :39-41, :54`; `refuerzo/eval3-ampliacion.mdx:48`.
- **Evidència**: «Marcos cobra un salario bruto de 1.221 € al mes (el SMI 2026). Le descuentan un 6,35 % de Seguridad Social y un 2 % de IRPF» (:40).
- **Per què importa**:
  - Combina el SMI de 2026 amb un tipus de cotització de 2022 i aplica la SS sobre el brut mensual, quan el SMI es cobra en 14 pagues i la base és de 1.424,50 €.
  - Amb el 6,50 % sobre la base, la SS és de 92,59 € (no de 77,53 €), i el líquid, 1.221 − 92,59 − 24,42 = 1.103,99 €.
  - A més, amb 17.094 € a l'any, la retenció real seria d'entre el 0 i el 2 %.
- **Proposta**: unificar-ho amb Eco 4ESO (vegeu ECO4-D06): cotització del 6,50 %. Per al refuerzo, o bé plantejar un «bruto mensual en 12 pagas» (i aplicar-hi la SS directament), o bé fer servir la base = anual/12.
- **Confiança**: Alta.

#### FOPP-D15 · Baix · Coherència entre peces — Xifres de salaris i articles que no quadren entre peces
- **On**: `fopp-4eso/tests/07-mundo-trabajo-mercado-laboral.md:51, :55`, davant de `libro/07-…:238-242`; `libro/08-…:113`.
- **Evidència**:
  - El test dona salaris mitjans de «ESO … ~16.000 € … FP Medio ~22.000 € … FP Superior ~25.000 € … grado ~28.000 € … máster ~33.000 €».
  - El llibre dona 17.500, 23.000, 26.500, 30.000 i 34.500 €.
  - «Libertad sindical, negociación colectiva y huelga (Constitución art. 28)»: la negociació col·lectiva és a l'art. 37 de la Constitució.
- **Per què importa**: l'ordre dels salaris, que és el que avalua el test, es manté, però un alumne atent hi veurà dues xifres per a la mateixa font.
- **Proposta**: copiar les xifres del llibre al test i citar «(arts. 28 y 37 de la Constitución)».
- **Confiança**: Alta.

#### FOPP-D16 · Baix · Coherència entre peces — Un lema promocional i desqualificador
- **On**: `src/lib/asignaturas.ts:127`, que es reutilitza a `src/lib/faq.ts:104`.
- **Evidència**: «Itinerarios, derechos laborales y orientación. La asignatura nueva de la LOMLOE, sin material decente disponible. Hasta ahora.»
- **Per què importa**: CLAUDE.md diu «Mai vendre, mai prometre, mai promocionar». La frase desqualifica la feina d'altres (editorials i col·legues) i té un to de campanya publicitària. Es mostra al hub i a la FAQ.
- **Proposta**: «Itinerarios, derechos laborales y orientación para la materia nueva de la LOMLOE: libro, actividades y un proyecto de vida que se construye durante el curso.»
- **Confiança**: Alta.

### Patrons de la passada ràpida
- **CE de les dinàmiques**: les 10 porten `competencias_especificas: [CE2]`, sigui quin sigui el contingut (autoconeixement, beques, CV…).
- **Refuerzo**: la programació remet als apartats «Para profundizar» (:142) i no enllaça les pàgines de `refuerzo/` que ja existeixen.
- **Xifres que circulen sense font clara**, fixades en tests: «el 60-70 % de los puestos nunca se publican» (U9:321, :343) i un «90 % de empleabilidad» en famílies de FP (U5:249, :350; test 05:75-79). El diagnòstic ja demanava un rang i una font.
- **Bessons ES/CA**: coherents, fins al punt que també reprodueixen els errors de FOPP-D01 i FOPP-D02.
- **To**: plural i proper, sense promoció dins del llibre. L'única excepció és el lema del hub (FOPP-D16). Hi ha un «⚠» dins d'un anunci simulat (activitat de notícia de la U4), que és acceptable perquè forma part de l'imitació.

### Estat del diagnòstic anterior
Font: `docs/diagnostico-fopp-4eso.md`.

| Punt del diagnòstic | Estat | Detall |
| --- | --- | --- |
| Cas Kamila Tarriño | resolt | anonimitzat a U3:204 |
| SMI a U7 i U8 | resolt | 2026 |
| Harvard Grant Study | resolt | |
| Dades de la U7 | resolt | EPA de l'1T de 2026 |
| Component `<RecursosAyuda>` | pendent | FOPP-D03 |
| Twenge/Lancet, OCU 80 % i Karolinska | pendent | FOPP-D10 |
| Mòbil «aprovat en 2024» | pendent | FOPP-D10 |
| Aida, Mario, Lucía, Diego i Pablo com a casos il·lustratius; Andrea Solà | pendent | FOPP-D11 |
| Sentència de Mercadona (TS 2023) | pendent | sense número |
| «90 %» d'ocupabilitat i «60-70 %» de mercat ocult | pendent | |
| Haidt i Kahneman repartits entre U2, U3 i U4 | parcial | |
| Repartiment de la nòmina amb Eco4 | parcial | la remissió apunta a una unitat equivocada (FOPP-D09) |

---

## Taller de Economía 3.º ESO (`taller-eco-3eso`)

**Resum.** És el material millor calibrat per a l'edat (14-15 anys): unitats curtes (unes 3.000 paraules), frases de 19-21 paraules, exemples quotidians (la paga, el mercadet, Bizum) i continguts bàsics correctes sobre drets laborals, consum i mitjans de pagament. Els problemes són de fonament curricular i d'una peça concreta. D'una banda, l'optativa no existeix al RD 217/2022, però el hub, la FAQ, el PDF i l'avaluació la presenten com a «currículo básico estatal», i fins i tot atribueixen les seues CE a una matèria que el RD no conté. De l'altra, una dinàmica dona per bo un contracte laboral als 15 anys.

**Punts forts**
- Calibratge d'edat i de lectura: entre 2.669 i 3.293 paraules per unitat (13-16 minuts de lectura) i frases curtes.
- Continguts bàsics correctes i actualitzats: edat mínima de 16 anys i proteccions dels menors (U7:151), garantia i desistiment (U3), SMI 2026 i Bizum 2025 (U4:167).
- La programació és honesta sobre el marc normatiu: «el Taller es una optativa sin currículo básico estatal» (`programacion/programacion.mdx:64`).
- No s'ha detectat cap clau errònia als 9 tests (109 ítems).
- Els punts del diagnòstic de maig estan resolts: Bizum, SMI, Azoulay, ONU-Agua, DIRCE i la Directiva 2024/1799.
- Bona espiral cap a 4t: consum (U3) i pressupost (U5) → Eco4 U7; treball (U7) → Eco4 U5 i FOPP U8.

**Unitats revisades a fons**
- `src/content/asignaturas/taller-eco-3eso/libro/07-mundo-del-trabajo.mdx` (diners i legal)
- `src/content/asignaturas/taller-eco-3eso/libro/05-presupuesto-ahorro.mdx` (aplicada)
- `src/content/asignaturas/taller-eco-3eso/libro/01-que-es-la-economia.mdx` (conceptual)
- Punts concrets de `libro/08` i `libro/06`. Programació, avaluació, retos, dinàmica 07, refuerzo eval2 i eval3, i tots els tests.

### Troballes

#### TALLER-D01 · Crític · Rigor i dades — La dinàmica del primer treball dona per correcte un contracte laboral als 15 anys
- **On**: `taller-eco-3eso/actividades-dinamicas/07-primer-trabajo-verano.mdx:20, :35-37, :50-67`.
- **Evidència**:
  - Context (:20): «Tienes 15 años y has conseguido tu primer trabajo: monitor … del ayuntamiento. Dos semanas de julio, ocho horas al día … contrato de trabajo con 480 € brutos».
  - L'opció «Con contrato: 450 € y todo en regla» rep un «Correcto» (:35-37).
  - Hores extra (:61): «El coordinador puede compensártelas con tiempo libre, que también es válido según la ley».
  - Si es nega (:67): «Negarse sin flexibilidad … puede generar tensión innecesaria».
- **Per què importa**:
  - L'ET prohibeix admetre a treballar menors de 16 anys (art. 6.1; l'única excepció són els espectacles públics amb autorització). També prohibeix les hores extra als menors de 18 (art. 6.3).
  - La dinàmica, pensada per a alumnat de 14-15 anys, ensenya tres coses falses: que als 15 anys es pot signar un contracte (i que te l'ofereix un ajuntament), que les hores extra d'un menor són «vàlides» i que exigir el límit legal és ser poc flexible.
  - Contradiu la U7:151: «la edad mínima para trabajar es de 16 años … no se pueden hacer horas extra».
  - A més, 480 € per 80 hores (6 €/h) queden per sota de qualsevol càlcul del SMI proporcional: entre 570 i 665 € per a 14 dies naturals, segons s'hi incloga o no la prorrata de pagues.
- **Proposta**: hi ha dues opcions.
  - (a) Protagonista de 16 anys, amb autorització familiar, jornada de 8 h com a màxim i salari igual o superior al SMI.
  - (b) Mantenir els 15 anys però com a voluntariat o pràctiques no laborals («premonitor voluntario»), i fer que la decisió correcta siga adonar-se que un contracte laboral als 15 anys no és legal.
  - En tots dos casos, al node 2 l'opció òptima ha de ser «Soy menor: no puedo hacer horas extra; si hacen falta más horas, que lo organicen con adultos», i cal eliminar el feedback de la «tensión innecesaria».
- **Confiança**: Alta.

#### TALLER-D02 · Alt · Alineació LOMLOE — Es presenta com a «currículo básico estatal» una optativa que el RD 217/2022 no regula
- **On**:
  - `src/lib/asignaturas.ts:146`
  - `src/pages/[asignatura]/index.astro:55` (nota del hub); `src/lib/faq.ts:107`
  - `src/pages/[asignatura]/libro/imprimir.astro:109` (apartat «Sobre este libro» del PDF)
  - `taller-eco-3eso/programacion/programacion.mdx:21, :45`; `evaluacion/evaluacion.mdx:5, :98`; `libro/01-que-es-la-economia.mdx:251` (bibliografia)
- **Evidència**:
  - `marcoNormativo: 'Real Decreto 217/2022 (optativa de iniciación económica y emprendedora)'` genera frases com «Este libro se basa en el currículo básico estatal LOMLOE para Taller de Economía, establecido en el Real Decreto 217/2022…».
  - L'avaluació diu «Real Decreto 217/2022 — competencias específicas de la materia optativa «Iniciación a la actividad emprendedora y empresarial» (3.º ESO)» (:5) i que les competències estan «tomadas del Real Decreto 217/2022» (:98).
  - En canvi, la programació reconeix que «el Taller es una optativa sin currículo básico estatal» (:64).
- **Per què importa**:
  - El RD 217/2022 no inclou cap «Taller de Economía» ni cap «Iniciación a la Actividad Emprendedora y Empresarial». Aquesta darrera era una matèria de la LOMCE (RD 1105/2014).
  - Les optatives de 1r a 3r d'ESO les regula cada CCAA (art. 9).
  - Les sis CE de l'avaluació són, reformulades, les CE1, CE2, CE3, CE6, CE4 i CE7 d'Economía y Emprendimiento de 4t.
  - Un departament que presente la programació amb aquesta base normativa estarà citant una matèria que no existeix.
- **Proposta**:
  - `marcoNormativo: 'Optativa de configuración autonómica (marco general: RD 217/2022, art. 9)'`.
  - Una nota específica per al Taller: «No hay currículo estatal para esta optativa: cada comunidad autónoma la regula (o no la oferta). Este material toma como referencia las competencias de Economía y Emprendimiento de 4.º (RD 217/2022) adaptadas a 3.º; consulta la normativa de tu comunidad».
  - A l'avaluació: «Competencias de referencia adaptadas de Economía y Emprendimiento (4.º ESO, RD 217/2022); no son competencias oficiales de esta optativa».
  - Si se'n coneix la font concreta (p. ex. un decret autonòmic), citar-la.
  - Caldrà un camp nou (p. ex. `notaCurricular`) perquè el hub no genere la frase genèrica.
- **Confiança**: Alta.

#### TALLER-D03 · Alt · Alineació LOMLOE — Dues llistes de CE amb els mateixos codis, i quatre retos apunten a la competència equivocada
- **On**: `taller-eco-3eso/programacion/programacion.mdx:57-64`; `evaluacion/evaluacion.mdx:7-86`; `retos/07`, `08`, `11` i `12`; les 9 dinàmiques amb `[CE2]`.
- **Evidència**:
  - A la programació, la CE2 és «agentes económicos y flujo circular», la CE3, «consumidor responsable», i la CE5, «empresas, trabajo y sector público».
  - A l'avaluació, la CE2 és «estrategias de conformación de equipos», la CE3, «ideas y soluciones innovadoras y sostenibles», i la CE5, «Seleccionar y reunir los recursos».
  - El reto 07 (flux circular) porta CE2; el 08 (consum), CE3; l'11 (treball i CV) i el 12 (pressupost públic), CE5. Per tant, les seues pàgines mostren el text i la rúbrica d'«equips», d'«idees sostenibles» i de «recursos».
  - Els retos 01-06, en canvi, sí que fan servir la llista de l'avaluació.
- **Per què importa**: la rúbrica que el docent té davant no avalua el que el reto treballa. A més, l'avaluació (només d'emprenedoria) deixa sense criteris els blocs de consum, diners, treball i sector públic, que són dos terços del curs.
- **Proposta**: mantenir una sola llista, la de la programació (que descriu el curs real), com a «competencias de referencia del material», amb criteris i rúbrica propis. Afegir-hi una taula de correspondència amb les CE d'EyE per a qui la necessite. Recodificar els retos 07-12 i les dinàmiques.
- **Confiança**: Alta.

#### TALLER-D04 · Mitjà · Rigor i dades — El cas d'interès compost d'Ana i Bea té les xifres errònies
- **On**: `taller-eco-3eso/libro/05-presupuesto-ahorro.mdx:69-74`.
- **Evidència**:
  - Titular: «5 € a la semana desde los 15 hasta los 65: unos 60.000 €».
  - Text: «Ana acumula del orden de 60.000 €. Bea … llega solo a unos 25.000 €», i la diferència «multipliquen por más de dos».
  - Pregunta: «¿Por qué 20 años antes triplican el resultado final?».
- **Per què importa**: refent el càlcul (260 € a l'any al 5 %):
  - Ana arriba a uns 54.400 € amb aportacions anuals o a uns 58.100 € amb capitalització setmanal.
  - Bea arriba a uns 17.300-18.100 €, menys de la meitat del que diu el llibre.
  - La ràtio és d'aproximadament 3,2: la pregunta encerta i el text no.
  - Les aportacions són de 13.000 € (Ana) i 7.800 € (Bea).

  És el cas-ganxo de la unitat i un càlcul que el professorat de matemàtiques pot comprovar.
- **Proposta**: «Ana, unos 55.000 € (ha puesto 13.000 €); Bea, unos 17.500 € (ha puesto 7.800 €): empezar 20 años antes multiplica el resultado por más de tres». Indicar-hi «rentabilidad supuesta del 5 % anual, sin inflación ni comisiones».
- **Confiança**: Alta.

#### TALLER-D05 · Mitjà · Rigor i dades — «El 40 % del salario bruto» se'n va en impostos i cotitzacions
- **On**: `taller-eco-3eso/libro/08-sector-publico-impuestos.mdx:74-79, :235, :333, :478`.
- **Evidència**:
  - Titular: «De cada 100 € de sueldo, unos 40 € van a Hacienda y a la Seguridad Social», amb la font «Distribución típica del gasto público español · Ministerio de Hacienda 2024».
  - :79: «Una persona asalariada en España, con un sueldo medio, paga alrededor del 40 % de su salario bruto en impuestos y cotizaciones sociales (IRPF, Seguridad Social, IVA al consumir, otros)».
- **Per què importa**:
  - El 40 % aproximat és la «cunya fiscal» de l'OCDE, que es calcula sobre el cost laboral total: inclou la cotització de l'empresa i no inclou l'IVA.
  - Sobre el brut d'un salari mitjà (uns 28.000 €), el treballador paga al voltant del 6,5 % de SS i d'un 15-16 % d'IRPF, és a dir, un 22 %. Amb l'IVA, un 28-30 %.
  - La font citada (distribució de la despesa pública) no sosté la xifra.
  - Tot el fil de la unitat s'hi construeix a sobre («El 40 % del sueldo: ¿adónde se va?»).
- **Proposta**: «Si sumamos lo que pagan la empresa y el trabajador, alrededor del 40 % del coste de un sueldo medio va a impuestos y cotizaciones (OCDE, Taxing Wages). De lo que ve en su nómina, el trabajador aporta algo más del 20 %, y luego paga IVA al consumir». Citar-hi la font adequada.
- **Confiança**: Mitjana. Les xifres de l'OCDE no s'han pogut verificar sense xarxa, però l'error conceptual és segur.

#### TALLER-D06 · Mitjà · Coherència entre peces — Tres o quatre «ingredients» per emprendre, segons la peça
- **On**: `taller-eco-3eso/libro/06-empresas-emprendimiento.mdx:33, :155, :196, :228, :359`; `tests/06-empresas-emprendimiento.md:57-64`; `refuerzo/eval2-refuerzo.mdx:25, :70-71`.
- **Evidència**:
  - Objectiu de la unitat (:33): «los ingredientes de un proyecto (idea, cliente, recursos, riesgo)».
  - Llibre i test: «tres ingredientes: iniciativa, organización de recursos y riesgo» (llibre :196; test :64).
  - Refuerzo: «Nombra los cuatro ingredientes … idea, cliente, recursos, riesgo» (:70-71).
- **Per què importa**: l'alumnat de refuerzo estudia una llista que el test no reconeix, en una definició que l'avaluació pregunta literalment.
- **Proposta**: triar una sola formulació (la del llibre i el test) i ajustar-hi l'objectiu de la unitat i el refuerzo.
- **Confiança**: Alta.

#### TALLER-D07 · Mitjà · Disseny didàctic — Els tests són gairebé només de memòria
- **On**: `taller-eco-3eso/tests/*.md` (9 fitxers, 109 ítems).
- **Evidència**: només uns 7 ítems plantegen una situació o un càlcul (el cost d'oportunitat del cine, la rebaixa d'una dessuadora, l'estalvi per a uns cascos, la regla 50-30-20 amb 40 €, l'IVA de la compra de la Marina…). La resta pregunten definicions, com «¿Cómo se calcula el ahorro?» o «¿Cuáles son los tres ingredientes…?».
- **Per què importa**: en una optativa que la programació defineix com a «marcadamente competencial y práctica» (:116), l'autoavaluació mesura la memòria. El DUA recomana diversificar formats: situacions, ordenació, lectura de documents.
- **Proposta**: afegir 2-3 ítems situacionals per unitat reaprofitant els casos del llibre (el tiquet del súper, la nòmina de la Laura, el pressupost de Villalba).
- **Confiança**: Alta.

#### TALLER-D08 · Baix · Disseny didàctic — La durada de les unitats no quadra amb la programació
- **On**: camp `duracion` de `taller-eco-3eso/libro/01` a `09`; `programacion/programacion.mdx:83-101`.
- **Evidència**: les unitats declaren «4-5 sesiones · 2 semanas», «5-6 …» o «6-7 …». La programació n'assigna 7 a cadascuna de les unitats U1-U8 i 8-10 a la U9, unes 64 en total, que sí que quadren amb 2 sessions setmanals.
- **Per què importa**: el docent no sap si té 54 o 64 sessions planificades.
- **Proposta**: alinear la `duracion` amb la programació (p. ex. «7 sesiones · 3,5 semanas»).
- **Confiança**: Alta.

#### TALLER-D09 · Baix · Rigor i dades — Petites imprecisions en exemples i fonts
- **On**: `taller-eco-3eso/libro/05-…:184-185`; `refuerzo/eval3-ampliacion.mdx:26-27`; `actividades/21-la-nomina-de-laura.md:21`; `libro/09-economia-sostenible-proyecto.mdx:197`; `libro/02-agentes-flujo-circular.mdx:162`; `libro/07-…:87`.
- **Evidència**:
  - «una idea sencilla y bien probada», sobre l'educació financera i la paga (U5:185), ja assenyalat al diagnòstic.
  - «Ana gana 12.000 € al año y paga el 10 % de IRPF». Amb 12.000 € la quota real és de 0 €.
  - La Laura, de 18 anys, cobra «1.000 € al mes … 880 €» sense que s'especifique la jornada. A temps complet seria menys que el SMI, i en una feina d'estiu la retenció seria pràcticament del 0 %.
  - El RealExample de Junior Achievement cita el «programa 'La empresa joven europea'». L'EJE és un programa de Valnalón; el de JA és «Miniempresas».
  - El RealExample «El mercadillo del pueblo» té com a font «Observación directa de cualquier mercado ambulante».
  - «Atención médica» com a dret que dona cotitzar (vegeu ECO4-D18).
- **Per què importa**: són exemples il·lustratius, però fixen magnituds errònies (qui guanya 12.000 € no paga IRPF) i usen l'etiqueta «Ejemplo real» sense cap font real.
- **Proposta**:
  - «Ana gana 20.000 € y paga un 10 %; Luis, 40.000 € y un 20 %».
  - Indicar que la Laura té una jornada parcial (p. ex. 30 h) o pujar-li el brut.
  - Marcar el del mercadet com a «caso ilustrativo» i corregir la font de l'EJE.
  - Matisar «bien probada» → «la evidencia apunta a que…».
- **Confiança**: Mitjana.

### Patrons de la passada ràpida
- **Activitats**: n'hi ha 26 de només 5 tipus (cas, debat, dinàmica, exercici i projecte), a raó de 2-4 per unitat. Hi falten gràfics, notícies, investigacions i jocs, que sí que tenen Eco4 i FOPP.
- **CE de les dinàmiques**: les 9 porten `[CE2]`, una etiqueta automàtica.
- **Decks**: cap dels 9 té diapositiva d'encaix curricular. Eco4 (12/12) i FOPP (10/10) sí que en tenen.
- **Refuerzo**: la programació no enllaça les pàgines de refuerzo i ampliació.
- **Espiral amb 4t**: funciona bé, però la dinàmica 07 i la nòmina de la Laura introdueixen xifres que Eco4 després contradiu.
- **To**: molt adequat per a 3r, sense infantilitzar i sense emojis.

### Estat del diagnòstic anterior
Font: `docs/diagnostico-taller-eco-3eso-2026.md`.

| Punt del diagnòstic | Estat | Detall |
| --- | --- | --- |
| Bizum | resolt | 30,6 M d'usuaris (2025) |
| SMI | resolt | la U7 ja porta el de 2026 |
| Azoulay (edat mitjana de qui funda) | resolt | citat |
| ONU-Agua | resolt | any de l'informe |
| DIRCE | resolt | |
| Dret a reparar | resolt | Directiva 2024/1799 |
| «bien probada» | pendent | TALLER-D09 |
| Solapaments amb Eco4 i FOPP (CV, drets laborals, consum) | resolt en l'estructura | owners definits; vegeu la secció següent per a les incoherències de xifres |

---

## Encavalcaments entre les tres assignatures

- **Nòmina**: el recorregut és Taller U7 (concepte) → Eco4 U5 (càlcul) → FOPP U8 (drets). L'espiral està ben pensada, però hi circulen tres tipus de cotització i dos SMI, i FOPP remet a una unitat equivocada. Proposta: centralitzar les dades en un fitxer únic i que la U5 d'Eco4 siga la propietària del càlcul.
- **Drets laborals dels menors**: FOPP U8 és la versió completa i correcta, Eco4 U5 és parcial i Taller U7 és bàsica però correcta. Tanmateix, les tres dinàmiques d'estiu (totes creades el 30-05-2026) fallen en el mateix punt: hores extra i edat mínima. Convé revisar-les juntes prenent com a font la llista de FOPP U8.
- **Consum**: de Taller U3 a Eco4 U7 el discurs és coherent (garantia de 3 anys, 14 dies de desistiment). L'excepció és la dinàmica 05 d'Eco4 (ECO4-D12).
- **IRPF**: Taller U8 el tracta de manera conceptual (amb l'error del «40 %»). Eco4 U6 és correcta en el text, però les calculadores inflen l'impost de les rendes baixes.
- **EPA**: l'exercici de càlcul de taxes es repeteix a Eco4 U5 i a FOPP U7, amb dades de dates diferents. Proposta: que FOPP se centre a llegir dades per decidir (atur per nivell formatiu) i remeta a Eco4 per al càlcul.
- **Itineraris i PAU**: en són propietàries les unitats U5 i U6 de FOPP. Per això els errors FOPP-D01 i FOPP-D02 són els més visibles del grup.

## Top 5 del grup
1. **ECO4-D01 · FOPP-D05 · TALLER-D01** — Les tres dinàmiques de feina d'estiu ensenyen a menors a acceptar hores extra, i la del Taller, a més, un contracte laboral als 15 anys. Cal revisar-les juntes prenent FOPP U8 com a referència.
2. **FOPP-D01 · FOPP-D02** — La clau del test dona per bones cinc modalitats de Batxillerat, i les ponderacions de la PAU estan descrites al revés. És informació que l'alumnat fa servir per triar itinerari.
3. **ECO4-D02 · ECO4-D03 · ECO4-D04 · ECO4-D06** — Dades de 2026 i càlcul de nòmina i IRPF coherents en totes les peces: SMI de 1.221 €, cotització del 6,50 %, base = anual/12, i calculadores amb els 2.000 € i la reducció en dos trams.
4. **ECO4-D05 · FOPP-D06 · TALLER-D02 · TALLER-D03** — Una sola numeració de CE, l'oficial, a la programació, les activitats, els retos i els PDF, i una base normativa honesta per al Taller.
5. **FOPP-D03 · FOPP-D04** — Recursos d'ajuda verificats (112, 024, ANAR, 016 i 017) en un component únic, i terminis de reclamació laboral correctes (un any per reclamar salaris).
