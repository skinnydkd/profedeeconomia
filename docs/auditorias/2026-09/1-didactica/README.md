# Auditoria didàctica docent — setembre de 2026

> Part de l'[auditoria de setembre de 2026](../README.md). Revisió de només lectura, per mostreig, del contingut de `main` (`876e002`), feta el 28-09-2026. Abast: les 10 assignatures i les seccions transversals. Focus triats: **rigor i dades**, **alineació LOMLOE**, **disseny didàctic** i **coherència entre peces**. No s'ha modificat cap fitxer de contingut.

## Resum

**El cos dels llibres és, en general, rigorós i està ben construït**:

- L'estructura és homogènia i les unitats tenen exercicis resolts graduats (a Eco 1BACH, 21 dels 26 són nets).
- Les activitats porten rúbrica ponderada i variants reals per a la diversitat («Con apoyo / Para quien va sobrado»).
- Les controvèrsies (`VocesDesacuerdo`) són equilibrades i el to és el que demana CLAUDE.md.
- La paritat castellà–valencià és completa: les 1.093 preguntes de test tenen les mateixes claus en les dues llengües.

**Els problemes es concentren en les peces derivades**: tests, dinàmiques, activitats, reptes, fitxes de reforç, jocs, calculadores i components compartits.

- Quan s'ha corregit o actualitzat el llibre, eixes peces no l'han seguit. Per exemple, Eco 4ESO manté el SMI de 2025, IPE I cotitza encara al 6,35 %, l'arbre de forma jurídica demana 3.000 € de capital i les claus d'algunes dinàmiques estan mal calculades.
- Com que els alumnes s'autocorregeixen justament amb eixes peces, el dany és més gran del que sembla.
- Hi ha a més tres problemes estructurals, que es repeteixen a totes les assignatures:
  - els tests es poden aprovar sense llegir;
  - la numeració de les competències específiques no quadra entre la programació, l'avaluació i les activitats;
  - la base normativa que es declara no sempre és la real.

**218 troballes: 22 crítiques, 65 altes, 103 mitjanes i 28 baixes.** Cada troballa crítica s'ha comprovat dues vegades: el sub-agent auditor refà cada càlcul que marca, i la mostra de la secció «[Com s'ha fet](#com-sha-fet)» s'ha tornat a verificar contra el fitxer font.

| Annex | Assignatures o seccions | Crític | Alt | Mitjà | Baix | Total |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| [Grup A — Empresa (Batxillerat)](./grup-a-empresa-batxillerat.md) | EDMN 2BACH · GPE BACH | 4 | 10 | 19 | 3 | 36 |
| [Grup B — Economia (Batxillerat)](./grup-b-economia-batxillerat.md) | Eco 1BACH · EEAE BACH | 1 | 12 | 17 | 4 | 34 |
| [Grup C — ESO](./grup-c-eso.md) | Eco 4ESO · FOPP 4ESO · Taller 3ESO | 3 | 11 | 23 | 6 | 43 |
| [Grup D — FP i Cultura Jurídica](./grup-d-fp-cultura-juridica.md) | IPE I · IPE II · CJD BACH | 5 | 19 | 13 | 6 | 43 |
| [Grup E — Seccions transversals](./grup-e-seccions-transversals.md) | Debats · Dinàmiques · Emprenedoria · Olimpíada · Projectes · Jocs · Eines docents | 9 | 13 | 31 | 9 | 62 |
| **Total** | | **22** | **65** | **103** | **28** | **218** |

Per assignatura o secció (Crític / Alt / Mitjà / Baix):

- EDMN 4/6/9/1
- GPE 0/4/10/2
- Eco 1BACH 1/9/10/1
- EEAE 0/3/7/3
- Eco 4ESO 1/4/11/2
- FOPP 1/5/8/2
- Taller 1/2/4/2
- IPE I 4/10/4/2
- IPE II 0/6/6/1
- CJD 1/3/3/3
- Debats 1/2/7/2
- Dinàmiques 4/1/7/1
- Emprenedoria 0/1/5/2
- Olimpíada 2/3/4/0
- Projectes 0/1/3/1
- Jocs 1/5/3/2
- Eines docents 1/0/2/1

## Troballes transversals

Són patrons que es repeteixen en diverses assignatures. Arreglar-los a la font resol moltes troballes individuals d'una vegada.

### T1 · Les claus de resposta dels tests tenen un biaix de posició molt fort

En les 791 preguntes d'opció múltiple dels tests d'unitat, la resposta correcta és la B en el **70 %** dels casos, i la D només en el 2,4 %. En les de vertader/fals, el 79 % de les respostes correctes són «fals». A més, la correcta sol ser l'opció més llarga (83 % en conjunt; 98 % a IPE I).

`QuizPlayer.tsx` mostra les opcions en l'ordre en què estan escrites. En canvi, Cajút sí que les barreja (`party/cajut/questions.ts:45`). Contestant sempre «B» i «Falso» s'aprova el 70 % dels tests. El banc de l'Olimpíada (la correcta no és mai la «d») i Jocs Econòmics (el 43 % de les correctes són la «a») tenen el mateix problema.

| Assignatura | Preguntes d'opció múltiple | A / B / C / D | % B | V/F (V / F) |
| --- | ---: | --- | ---: | --- |
| eco-1bach | 109 | 7 / 64 / 36 / 2 | 59 % | 7 / 12 |
| eco-4eso | 74 | 10 / 46 / 18 / 0 | 62 % | 1 / 11 |
| edmn-2bach | 104 | 10 / 61 / 26 / 7 | 59 % | 6 / 8 |
| eeae-bach | 91 | 5 / 56 / 28 / 2 | 62 % | 3 / 13 |
| fopp-4eso | 83 | 5 / 43 / 27 / 8 | 52 % | 6 / 10 |
| gpe-bach | 63 | 1 / 48 / 14 / 0 | 76 % | 2 / 8 |
| ipe1-fp | 89 | 9 / 72 / 8 / 0 | 81 % | 0 / 15 |
| ipe2-fp | 90 | 1 / 84 / 5 / 0 | 93 % | 0 / 15 |
| taller-eco-3eso | 88 | 1 / 80 / 7 / 0 | 91 % | 1 / 8 |
| **Total** | **791** | **49 / 554 / 169 / 19** | **70 %** | **26 / 100** |

- **Proposta**:
  - Barrejar les opcions en cada intent dins del QuizPlayer, guardant la permutació en l'estat. Així s'arregla tot d'una vegada: tests, dinàmiques i reptes.
  - Reequilibrar a poc a poc la llargària dels distractors.
  - Afegir un test de contingut que falle si una posició supera el 40 %.
- **Relacionades**: [CODE-INT-03](../2-codi/logica-interactiva.md), CODE-SRV-05, EDMN-D17, GPE-D12, IPE1-D16, IPE2-D07, TALLER-D07 i OLI-D04.

### T2 · Les peces derivades no segueixen les actualitzacions del llibre

Quan el llibre s'actualitza, les dades i les regles no arriben als tests, les activitats, les dinàmiques, el reforç, els diagrames compartits ni les calculadores:

- **Eco 4ESO** encara usa el SMI de 2025 (1.184 €) en 11 fitxers, 22 amb les bessones valencianes. Hi ha sis capítols del llibre, el test U5, el reforç i una activitat. FOPP, el Taller i IPE ja usen el de 2026 (1.221 €) (ECO4-D02).
- **Cotització del 6,35 %** (sense MEI) en tests, fitxes i en el diagrama compartit `NominaAnotada`, i barrejada amb el 6,48 % i el 6,50 % (IPE1-D01, IPE2-D05, ECO4-D06, FOPP-D14).
- **Tipus del BCE, Euríbor i EPA** diferents entre unitats i tests d'Eco 1BACH (ECO1-D04, ECO1-D05).
- **Referències òrfenes** després de reestructurar Eco 4ESO a 12 unitats (ECO4-D07), i una cita de Bezos que el llibre ja no fa però el test sí (IPE2-D04).

**Proposta**: un sol mòdul de dades datat, per exemple `src/data/referencia-2026.ts`, amb el SMI, les cotitzacions, l'IPREM, els tipus del BCE, l'EPA i el PIB, amb font i data. Totes les peces el farien servir, per MDX o per component, en lloc de copiar les xifres. A més, un test de contingut que busque els valors obsolets coneguts («1.184 €», «6,35 %», «3.000 €» com a capital de la SL…).

### T3 · Tres numeracions de competències específiques que no quadren

En diverses assignatures conviuen tres numeracions:

- la de la programació, sovint pròpia i presentada com si fos l'estatal;
- la de la pàgina d'avaluació, que segueix el RD;
- la de les etiquetes `[CEn]` d'activitats, dinàmiques i reptes.

A més, hi ha codis que no existeixen i dinàmiques que porten totes la mateixa etiqueta: totes les d'Eco 1BACH van amb [CE2] i totes les de GPE amb [CE3]. Un docent que copie la programació al seu centre hi pot posar competències que no són les oficials.

- **Relacionades**: ECO1-D02, EEAE-D09, EDMN-D06, ECO4-D05, ECO4-D15, FOPP-D06, TALLER-D03, GPE-D13, IPE1-D12, IPE2-D01, i les dinàmiques i els jocs del grup E.
- **Proposta**:
  - Una sola numeració per assignatura, la del RD (o la dels RA en el cas de l'FP), a la programació, l'avaluació, les etiquetes i els PDF.
  - Ampliar `src/content/competencias-especificas.test.ts` perquè compare les etiquetes amb la llista oficial i no només amb la programació.

### T4 · La base normativa declarada no és sempre la real

La nota «Este libro se basa en el currículo básico estatal LOMLOE…» del hub, les FAQ i els PDF es genera amb una plantilla comuna, i per això falla en cinc assignatures:

- **IPE I i II** són mòduls d'FP (LO 3/2022 i RD 659/2023, no LOMLOE). A més, la frase queda trencada: «en el Ley Orgánica», «empleabilidad i».
- **GPE i CJD** són optatives del currículum valencià, no del bàsic estatal.
- **El Taller de 3r d'ESO** no existeix al RD 217/2022, i les seues CE s'atribueixen a una matèria de la LOMCE.

- **Relacionades**: TALLER-D02, IPE1-D13, IPE2-D06, CJD-D03, GPE-D05, VIS-NAV-02 i CODE-WEB-16.
- **Proposta**: un camp `marcoTipo: 'estatal' | 'fp' | 'autonomico'` a `src/lib/asignaturas.ts` i una nota diferent per a cada cas. Com les presenta el web és una decisió de Pau (vegeu l'[auditoria visual](../3-visual-ux/README.md)).

### T5 · Claus i solucions numèriques errònies en peces que l'alumnat fa servir per autocorregir-se

Hi ha errors de càlcul o de clau sobretot fora del cos del llibre:

- **Dinàmiques insígnia** (DIN-D01 a D04):
  - l'excedent màxim de la doble subhasta és 32 €, no 24 €;
  - el màxim del monopolista està mal marcat;
  - hi ha tres totals diferents per a la cadena de valor;
  - en l'exercici d'autarquia, el País A sí que pot cobrir l'objectiu.
- **Simulacre de PAU d'EDMN**: marge de seguretat del 25 % en lloc del 20 %, i les amortitzacions posades com a finançament aliè (EDMN-D01, EDMN-D02).
- **Exercici resolt 12.1 d'Eco 1BACH**: «demostra» els guanys del comerç amb xifres que diuen el contrari (ECO1-D01).
- **Nòmines i indemnitzacions d'IPE I** (IPE1-D02, IPE1-D03).
- **Banc de l'Olimpíada**: 2,8 % d'errors de clau (OLI-D01, OLI-D02).
- **Econopoly**: aplica el tipus del tram a tot el patrimoni, que és el mite del «salt de tram» que el llibre d'Eco 4ESO desmunta (JOC-D01).
- **Calculadores de nòmina i IRPF**: sobreestimen l'impost (EIN-D01 = [CODE-INT-02](../2-codi/logica-interactiva.md)).

**Proposta**: cap clau numèrica sense un solucionari pas a pas i una segona comprovació. En els jocs, a més, tests d'invariants econòmics (per exemple, que el patrimoni després d'impostos siga creixent).

### T6 · Contingut jurídic i de seguretat que pot fer mal

- **Treball de menors**. Tres dinàmiques de «feina d'estiu» (Eco 4ESO, FOPP i Taller) presenten les hores extra d'un menor com a acceptables o inevitables, quan l'ET, art. 6.3, les prohibeix. La del Taller, a més, dona per correcte un contracte laboral als 15 anys, i l'art. 6.1 fixa l'edat mínima en 16 (ECO4-D01, FOPP-D05, TALLER-D01).
- **Prevenció de riscos**. L'exercici del soroll a 92 dB(A) deixa els protectors auditius per al final. Segons el RD 286/2006, però, són obligatoris des del primer dia per damunt de 85 dB(A) (IPE1-D04). A més, la dinàmica d'accidents diu que es comuniquen «al SEPE» (IPE1-D10).
- **Drets laborals**:
  - Indemnitzacions mal calculades (IPE1-D03).
  - Terminis de reclamació incorrectes: 20 dies hàbils per als salaris, quan són un any (FOPP-D04).
  - Període de prova i contractes formatius mal formulats (IPE1-D09).
- **Forma jurídica**. L'arbre compartit `FormaJuridicaTree.astro` encara demana «¿Capital < 3.000 €?» per a la SL, en 5 assignatures, quan des de la Llei 18/2022 n'hi ha prou amb 1 €. També manté la SLFS, que ja no existeix (EDMN-D04, GPE-D03, IPE2-D08).
- **Recursos d'ajuda de FOPP**: hi ha un servei que no s'ha pogut identificar i hi falten el 112 i el 017 (FOPP-D03).

**Proposta**: una passada jurídica específica, feta per algú amb formació laboral, sobre les unitats de treball de FOPP, IPE I, Eco 4ESO i el Taller i les seues dinàmiques. A més, un component únic de recursos d'ajuda verificats.

### T7 · Rigor en les afirmacions «científiques» i en les fonts

- **Economia conductual i psicologia**:
  - Eco 1BACH repeteix el mite de la donació d'òrgans (ECO1-D06) i no avisa de la crisi de replicació (ECO1-D13). EEAE té el mateix problema d'avís (EEAE-D04).
  - A IPE II, Goleman i Belbin «demostraren» coses que l'evidència no sosté (IPE2-D10).
- **«Ejemplo real»** posat a casos inventats (FOPP-D11).
- **Fonts, atribucions i comptes recomanats a menors** que no s'han pogut verificar: ECO1-D20, EEAE-D10, FOPP-D10, EDMN-D15 i IPE2-D12.

**Proposta**: una etiqueta diferent per als casos il·lustratius; l'avís de replicació allà on es cita psicologia social; i, per a les xifres, preferir fonts oficials datades.

### T8 · Càrrega de lectura i temps poc realistes

- **Eco 4ESO** té entre 9.000 i 9.500 paraules per unitat, entre 41 i 62 minuts de lectura, mentre que el temps declarat és de «~22-30 min». Entre un 12 % i un 25 % de les frases passen de 35 paraules. Per comparar, FOPP té unes 5.100 paraules per unitat, el Taller 3.000 i EDMN 4.800 (ECO4-D11).
- Les unitats U10, U11 i U12 d'Eco 1BACH han crescut, i el diagnòstic de maig ja en demanava la reducció (ECO1-D19).
- La temporització no quadra entre el llibre, la programació i el quadern (FOPP-D08, GPE-D11, TALLER-D08).

**Proposta**: marcar en cada unitat un «itinerari essencial» (lectura nuclear i dues activitats) i deixar la resta com a ampliació, i calcular el temps de lectura automàticament.

### T9 · Estructura desigual entre assignatures

CLAUDE.md fa vinculant que totes les assignatures tinguen la mateixa estructura interna. Ara no és així:

- **CJD** no té tests, activitats, reptes, reforç ni pàgina d'avaluació. A més, el hub enllaça seccions buides i la programació pondera amb un 20 % uns tests que no existeixen (CJD-D02, CJD-D04, VIS-NAV-10).
- **Dinàmiques d'Eco 4ESO**: 7 de les 12 unitats no en tenen, i les que hi ha es concentren en emprenedoria i economia personal.
- **Recursos de CJD**: les unitats 1 a 4 no en tenen.

**Proposta**: completar o amagar les seccions buides i documentar a CLAUDE.md les excepcions que es vulguen mantenir.

## Les 22 troballes crítiques

| ID | Assignatura | Troballa |
| --- | --- | --- |
| EDMN-D01 | EDMN 2BACH | Simulacre 1: el marge de seguretat es calcula sobre el punt mort i diu 25 % (és 20 %) |
| EDMN-D02 | EDMN 2BACH | Simulacre 1: les amortitzacions acumulades, com a finançament «interna-ajena» |
| EDMN-D03 | EDMN 2BACH | «Nueve principios contables»: el PGC 2007 en té sis |
| EDMN-D04 | EDMN 2BACH (+5 assignatures) | Capital de la SL: 3.000 € i SLFS a l'arbre compartit, al deck, a una clau i al quadern PAU |
| ECO1-D01 | Eco 1BACH | L'exercici resolt 12.1 «demostra» els guanys del comerç amb xifres que diuen el contrari |
| ECO4-D01 | Eco 4ESO | La dinàmica del contracte d'estiu diu a un menor que no pot negar-se a fer hores extra |
| FOPP-D01 | FOPP 4ESO | La clau del test U5 dona per bones «cinco modalidades» de Batxillerat (són quatre) |
| TALLER-D01 | Taller 3ESO | La dinàmica del primer treball dona per correcte un contracte laboral als 15 anys |
| IPE1-D01 | IPE I | Cotització al 6,35 % (sense MEI) en tests, fitxes, exercici i diagrama; el test dona un net diferent del llibre |
| IPE1-D02 | IPE I | La «Nómina A (correcta)» cotitza sobre una base sense prorrata de pagues ni MEI |
| IPE1-D03 | IPE I | Indemnitzacions: salari diari sense extres, antiguitat anterior a 2012 ignorada, «procedente: 0 días» |
| IPE1-D04 | IPE I | Soroll a 92 dB(A): els protectors auditius «solo ahora», després de la resta de mesures |
| CJD-D01 | CJD | El debat del Senat diu que la supressió necessita la reforma agreujada de l'art. 168 (és l'art. 167) |
| DEB-D01 | Debats | El mateix error de l'art. 168 al debat «Suprimir el Senado» (vegeu CJD-D01) |
| DIN-D01 | Dinàmiques | Doble subhasta: l'excedent total màxim és 32 €, no 24 € |
| DIN-D02 | Dinàmiques | Monopolista: màxims mal marcats i una comparació amb la subhasta que no s'aguanta |
| DIN-D03 | Dinàmiques | Cadena de valor: tres totals diferents i un debrief amb xifres que no són les de la fitxa |
| DIN-D04 | Dinàmiques | Avantatge comparatiu: el País A sí que pot cobrir l'objectiu en autarquia |
| OLI-D01 | Olimpíada | EPA i atur registrat: el banc i la fitxa es contradiuen, i la clau del banc és falsa |
| OLI-D02 | Olimpíada | Altres ítems del banc amb clau o explicació errònia (2,8 % d'errors) |
| JOC-D01 | Jocs | Econopoly aplica el tipus del tram a tot el patrimoni i ensenya el mite del «salt de tram» |
| EIN-D01 | Eines docents | Les calculadores de nòmina i IRPF sobreestimen l'impost (fins a 4-5 vegades per al SMI); és CODE-INT-02 |

## Per on començar

1. **El que pot fer mal** (T6): les tres dinàmiques de feina d'estiu, el soroll a 92 dB(A), les indemnitzacions i els terminis de reclamació, i els recursos d'ajuda de FOPP. Són poques peces i totes es poden corregir en una sola passada.
2. **Les claus amb què l'alumnat s'autocorregeix** (T5): el simulacre de PAU d'EDMN, l'exercici 12.1 d'Eco 1BACH, el test U5 de FOPP, les quatre dinàmiques de mercat, les nòmines d'IPE I i el banc de l'Olimpíada.
3. **Els components compartits que escampen un error per diverses assignatures**:
   - `FormaJuridicaTree.astro` (5 assignatures);
   - el diagrama `NominaAnotada` (6,35 %);
   - les calculadores de nòmina i IRPF (vegeu CODE-INT-02);
   - `BreakEvenChart.astro`, amb l'eix mal etiquetat (VIS-LEC-06).

   Cadascun s'arregla una sola vegada.
4. **Barrejar les opcions al QuizPlayer** (T1). És un canvi de codi xicotet que desactiva el biaix de 1.000 preguntes d'una vegada. El reequilibri del contingut pot venir després.
5. **Un mòdul de dades 2026, una numeració de CE per assignatura i una nota normativa honesta** (T2, T3 i T4).
6. **Després**, les troballes altes de cada annex, per assignatura. Cada annex acaba amb el seu «Top 5».

## Estat del diagnòstic de maig

Cada annex té la taula detallada. En resum:

- **EDMN**: quasi tot el diagnòstic està resolt (cronologia, diagrames, exercicis resolts, bibliografia). Ara bé, dues recomanacions eren errònies i s'han aplicat: «listar los 9 principios» ha produït EDMN-D03, i actualitzar l'arbre «con la SLFS» ha deixat EDMN-D04 pendent. La lliçó és que convé verificar les recomanacions abans d'aplicar-les.
- **Eco 1BACH**: la passada de xifres macro està feta a les unitats 3, 5, 7, 9, 11 i 12, però no a la 8, la 10 ni als tests. La reducció d'U10–U12 està pendent, i ha empitjorat.
- **Eco 4ESO**: resolt en bona part. Queden pendents el SMI de 2026, el 6,35 % i la quota d'autònoms de 2025.
- **FOPP**: les dades estan actualitzades. Continuen pendents el component de recursos d'ajuda, algunes fonts de salut mental i els casos inventats etiquetats com a reals.
- **GPE, EEAE, IPE I i IPE II**: majoritàriament resolts o parcials. IPE I té tres punts parcials (el 6,50 %, el cost d'empresa i una dada del 70 %).
- **CJD**: no tenia diagnòstic previ.

## Com s'ha fet

- **Cinc revisions paral·leles**, una per grup d'assignatures. Totes han aplicat el mateix mètode i la mateixa escala de gravetat.
- **Per assignatura**, 2 o 3 unitats revisades a fons: el llibre sencer amb el seu bloc de diapositives, el test, almenys tres activitats de tipus diferents, la dinàmica, el recurs amb la seua lògica de càlcul, el repte i la comparació amb la bessona valenciana. La resta d'unitats s'han revisat amb una passada ràpida (frontmatter, estructura, claus dels tests) i també s'han mirat la programació, l'avaluació i les fitxes de reforç.
- **Comprovacions exhaustives amb script** sobre tot el contingut:
  - paritat ES/CA de totes les claus (1.093 preguntes);
  - distribució de les respostes correctes (T1);
  - frontmatter obligatori;
  - cobertura per unitat;
  - emojis;
  - mencions d'anys.
- **Segona verificació, feta directament contra el fitxer font**, d'aquestes troballes crítiques:
  - ECO1-D01: s'ha refet l'exercici; el món passa de 20,83 m a 12,5 m de tela.
  - DIN-D01: 60 − 28 = 32 €.
  - JOC-D01: `Math.floor(nw * rate)`.
  - ECO4-D01 i TALLER-D01: text literal de les dinàmiques.
  - FOPP-D01: `correcta: 2` = «Cinco…».
  - EDMN-D01: amb una caiguda del 25 %, −750 €.
  - EDMN-D03: «nueve principios».
  - EDMN-D04: `FormaJuridicaTree.astro:29`.
  - IPE1-D04: «solo ahora, y como complemento».
- **Límits**:
  - Sense accés a la xarxa (BOE, INE, BdE…), les dades externes s'han contrastat amb el coneixement dels auditors, i cada troballa indica la confiança.
  - Com que és un mostreig, cal esperar troballes semblants en les unitats no revisades a fons. Per això les propostes transversals (T1–T9) són la manera més eficient d'avançar.
