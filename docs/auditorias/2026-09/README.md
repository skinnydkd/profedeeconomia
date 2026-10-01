# Auditories de setembre de 2026

Tres auditories de només lectura sobre `main` (`876e002`), fetes el 28-09-2026 a petició de Pau:

1. **[Auditoria didàctica docent](./1-didactica/README.md)**: les 10 assignatures i les seccions transversals, per mostreig. Focus: rigor i dades, alineació LOMLOE, disseny didàctic i coherència entre peces.
2. **[Auditoria de programació i bugs](./2-codi/README.md)**: servidor i dades, lògica interactiva i framework del lloc, amb comprovacions automàtiques sobre tot el build.
3. **[Auditoria visual, estètica i UX/UI](./3-visual-ux/README.md)**: contrastada amb la direcció validada (Variant C i regles de-slop), sobre 47 pàgines en tres mides de pantalla.

No s'ha modificat cap fitxer de codi ni de contingut: aquests informes són el punt de partida perquè Pau decidisca què s'arregla i en quin ordre.

Les correccions que han eixit d'estes auditories, assignatura per assignatura i amb el PR de cada una, són a la **[guia de revisió](./guia-revisio.md)** (1-10-2026).

## En xifres

| Auditoria | Crític | Alt | Mitjà | Baix | Total |
| --- | ---: | ---: | ---: | ---: | ---: |
| Didàctica | 22 | 65 | 103 | 28 | 218 |
| Programació i bugs | 3 | 17 | 26 | 14 | 60 |
| Visual i UX/UI | 0 | 21 | 22 | 7 | 50 |
| **Total** | **25** | **103** | **151** | **49** | **328** |

Hi ha algunes troballes que apareixen en més d'una auditoria perquè toquen dues capes: per exemple, l'IRPF de les calculadores, el biaix de les claus dels tests o la nota curricular dels hubs. Cada informe les enllaça amb «Veg. també».

**Escala de gravetat** (la mateixa a les tres):

- **Crític**: pot fer mal o ensenyar una cosa falsa; es trenca un flux essencial; exposició legal.
- **Alt**: error clar o incoherència que confon; incompliment de la direcció validada en una pàgina important; falla per a una classe d'usuaris.
- **Mitjà**: millora de disseny, robustesa o consistència.
- **Baix**: detall.

## Resum executiu

**El que funciona, i no és poc.**

- **Fonaments tècnics**:
  - 3.896 tests verds i 0 errors de tipus.
  - Cap dels 110.876 enllaços interns està trencat.
  - Els secrets només viuen al servidor, i el consentiment de GA4 és exemplar.
  - Les pàgines estàtiques pesen poc.
- **Direcció visual**: la Variant C està ben implementada a la home, als hubs i a les landings.
- **Contingut**:
  - El cos dels llibres és, en general, rigorós, amb exercicis resolts graduats.
  - Les activitats porten rúbrica i variants per a la diversitat.
  - La paritat castellà–valencià és completa.

**On es concentren els problemes.**

1. **Privacitat de l'alumnat**. Jocs Econòmics publica i guarda sense límit noms i centres de menors, i la política de privacitat diu que no hi ha dades personals ([CODE-SRV-01](./2-codi/servidor-dades-seguretat.md)). És l'únic punt amb exposició legal.
2. **Contingut que pot fer mal** ([T6 didàctica](./1-didactica/README.md)):
   - Dinàmiques que ensenyen a menors que han d'acceptar hores extra, i un contracte laboral als 15 anys.
   - Un exercici de soroll a 92 dB(A) que retarda els protectors auditius.
   - Indemnitzacions i terminis laborals mal calculats.
3. **Autoavaluació poc fiable**:
   - Les claus dels tests tenen biaix: la correcta és la B en el 70 % dels casos, i les opcions no es barregen.
   - Les preguntes numèriques no deixen escriure decimals ni negatius (CODE-INT-01).
   - Hi ha claus i solucions errònies en dinàmiques, en el simulacre de PAU i en el banc de l'Olimpíada.
4. **Peces derivades desfasades**. Tests, dinàmiques, reforç, calculadores i components compartits no han seguit les correccions del llibre:
   - SMI de 2025 a Eco 4ESO;
   - cotització del 6,35 %;
   - capital de la SL a 3.000 € en 5 assignatures;
   - IRPF sobreestimat a les calculadores.
5. **Lectura del llibre**. El reset de Tailwind s'ha menjat la separació entre paràgrafs i els marcadors de llista a les 98 unitats ([VIS-LEC-01](./3-visual-ux/lectura-estudi-eines.md)).
6. **Arquitectura i coherència del catàleg**. El web ha passat de 4 a 10 assignatures i de 3 a 8 seccions sense repensar els noms ni les notes:
   - «Otros» agrupa el que CLAUDE.md diu que no hi ha d'anar, i hi ha dues «Herramientas».
   - Les competències específiques tenen tres numeracions que no quadren.
   - La base normativa que es declara és incorrecta per a l'FP, les optatives valencianes i el Taller.
   - CJD no té l'estructura comuna.
7. **La meitat valenciana**. 90 pàgines `/ca/` d'activitats interactives mostren el test en castellà, i el hub de tests porta al castellà.

## Pla d'acció proposat

Es proposa agrupar els arreglaments en PRs temàtiques, perquè cada revisió siga còmoda. L'ordre segueix gravetat, abast i cost.

| # | Paquet | Troballes principals | Tipus |
| --- | --- | --- | --- |
| 1 | **Privacitat** | CODE-SRV-01, 02 i 14. Reescriure la política, àlies en lloc de nom, conservació i supressió, Vercel Analytics | Codi i legal |
| 2 | **Contingut que pot fer mal** | ECO4-D01, FOPP-D05, TALLER-D01, IPE1-D03, IPE1-D04, IPE1-D10, FOPP-D03 i FOPP-D04 | Contingut (ES i CA) |
| 3 | **Claus i solucions** | EDMN-D01/D02/D03, ECO1-D01, FOPP-D01, DIN-D01 a D04, OLI-D01/D02 i IPE1-D01/D02 | Contingut (ES i CA) |
| 4 | **QuizPlayer** | CODE-INT-01, CODE-INT-03, VIS-LEC-08/09 i T1: barrejar opcions, entrada numèrica, focus, `aria-live`, desbordament, Markdown | Codi |
| 5 | **Fiscalitat i components compartits** | CODE-INT-02/08/11/12, `FormaJuridicaTree`, `NominaAnotada`, `BreakEvenChart` i el mòdul de dades 2026 (T2) | Codi i contingut |
| 6 | **Prosa del llibre i figures** | VIS-LEC-01, 03, 04 i 05. Recupera el que ja validava el mockup | Visual: cal el vistiplau de Pau |
| 7 | **i18n `/ca/`** | CODE-WEB-01, 02, 05, 06 i 10 | Codi |
| 8 | **Menú i contrast** | VIS-NAV-01 (una línia), VIS-NAV-06, VIS-LEC-12, CODE-WEB-03/04 i la passada de-slop (VIS-NAV-07, VIS-LEC-13) | Visual, dins de les regles ja aprovades |
| 9 | **Jocs de classe** | CODE-SRV-03, 04, 05 i 06, CODE-INT-07, JOC-D01, Business Game (SRV-07/08/09) | Codi |
| 10 | **Coherència curricular** | T3 (numeració de CE), T4 (nota normativa), CJD (T9) | Contingut i decisions |

## Decisions que corresponen a Pau

Aquestes decisions no les pot prendre una auditoria. El context és a cada informe.

1. **Veu del web**: tornar al plural de CLAUDE.md o acceptar la primera persona que ara apareix a la home, a /generadores/ i a /sobre/ ([visual](./3-visual-ux/README.md)).
2. **Menú i noms**:
   - «Otros» amb 8 seccions, o Juegos, Herramientas i Emprendimiento al primer nivell.
   - Què vol dir «Herramientas».
   - Quin nom porta el concurs, per no confondre'l amb l'Olimpíada oficial.
3. **Abast normatiu**: com es presenten les optatives valencianes (GPE, CJD) i els mòduls d'FP (IPE), davant del «currículum estatal» i del «no adaptacions per CCAA al MVP» de CLAUDE.md. Probablement cal actualitzar CLAUDE.md.
4. **CJD**: completar-ne l'estructura (tests, activitats, reptes, reforç, avaluació) o documentar-la com a excepció.
5. **Dades de l'alumnat a Jocs Econòmics**: àlies obligatori, termini de conservació i procediment de supressió. Cal decidir també si Vercel Web Analytics va darrere del consentiment o es declara a la política.
6. **Sistema visual**:
   - Recuperar la regla dels `h2`.
   - Reutilització dels colors d'assignatura.
   - Insígnies en píndola.
   - Fraunces com a cos en alguns components.
   - Figures amples.

## Com s'ha fet

- **Deu revisions paral·leles** fetes per sub-agents de Claude Code: cinc de didàctica (una per grup d'assignatures), tres de codi i dues visuals. Totes van seguir el mateix format: ubicació, evidència literal, per què importa, proposta i confiança.
- **Comprovacions automàtiques pròpies** sobre tot el repositori i tot el build:
  - tests, type check i build;
  - enllaços i metadades de 3.410 pàgines;
  - paritat ES/CA i distribució de les claus de les 1.093 preguntes;
  - captures i axe-core en 47 pàgines × 3 mides;
  - trànsit de xarxa abans del consentiment.
- **Segona verificació** directa contra el codi i el contingut font de totes les troballes crítiques de codi i visuals i d'una mostra àmplia de les didàctiques. Cada informe diu quines. Un parell de pistes inicials resultaren falses (per exemple, les «imatges sense alt») i s'han descartat.
- **Límits**:
  - El contenidor no tenia accés al web de producció, al BOE, a l'INE ni a l'AEAT. S'ha auditat el build de `main` servit en local, i les dades normatives s'han contrastat amb el coneixement dels auditors; cada troballa indica la confiança.
  - La part didàctica és un mostreig: hi haurà troballes semblants en les unitats que no s'han revisat a fons.
  - Només s'ha provat Chromium.
