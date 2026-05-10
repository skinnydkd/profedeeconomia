# PRD — profedeeconomia.es (Rebranding)

> Plataforma educativa estructurada per **assignatures**. Cada assignatura conté tot el que necessita un professor per a impartir la classe: llibre, diapositives, activitats, tests, recursos. A banda, seccions específiques per a contingut transversal: jocs, eines docents, emprenedoria. Oposicions: redirect 301 a oposicioneseconomia.es.

## 1. Visió

**Convertir profedeeconomia.es en la plataforma de referència per a professors d'economia d'institut a Espanya, organitzada de la manera més útil per a ells: per assignatura.**

L'usuari (un professor que prepara les seues classes) no pensa per "tipus de contingut". Pensa **"vull material per a EDMN 2BACH"** o **"necessite preparar la unitat 3 d'Eco 1BACH"**. La plataforma s'organitza així: cada assignatura és un producte vertical complet.

Els llibres es basen en el currículum bàsic estatal LOMLOE (no en concrecions autonòmiques específiques), per a servir a professors de tot Espanya.

**Per què aquest enfocament guanya enfront d'Econosublime:**
- Econosublime té els llibres com a producte central però el contingut transversal queda dispers
- La nostra estructura per assignatura permet al professor entrar i tindre tot al mateix lloc
- Cada assignatura es pot recomanar com a unitat: "el material d'EDMN 2BACH de profedeeconomia.es"
- L'estètica editorial sòbria amb to proper diferencia el nostre producte d'una editorial corporativa
- L'honestedat sobre la cobertura curricular (genèric estatal, complementa amb la teua CCAA) és més respectuosa amb el professor que prometre cobertura completa

## 2. Audiència

### 2.1 Públic primari — Professors d'institut d'economia

Docents que imparteixen alguna de les 4 assignatures: FOPP 4ESO, Economia 4ESO, Economia 1BACH, EDMN 2BACH. 30-55 anys, busquen materials de qualitat per a impartir classe sense haver de redactar-ho tot ells.

### 2.2 Públic secundari — Alumnes d'institut

Estudiants 14-18 anys que estudien aquestes assignatures, accedint via recomanació del professor.

### 2.3 Públic terciari — Opositors

Opositors a Secundària Economia que ja coneixen oposicioneseconomia.es. Quan superin l'oposició i comencen a impartir, profedeeconomia.es serà el seu primer recurs natural.

## 3. Estructura del producte

### 3.1 Sitemap complet

```
/                              Home (4 assignatures destacades + accés a seccions específiques)

/edmn-2bach/                   Hub de l'assignatura (EDMN 2BACH)
/edmn-2bach/libro/             Llibre
/edmn-2bach/libro/[unidad]/    Unitat individual del llibre
/edmn-2bach/diapositivas/      Diapositives per unitat (PDF + futur PPTX)
/edmn-2bach/actividades/       Activitats pràctiques
/edmn-2bach/tests/             Tests d'autoavaluació
/edmn-2bach/recursos/          HTMLs interactius i altres recursos

/eco-1bach/                    (mateixa estructura que EDMN)
/eco-4eso/                     (mateixa estructura)
/fopp-4eso/                    (mateixa estructura)

/juegos/                       Jocs i concursos
/juegos/stonks/                Simulador de borsa
/juegos/insider/               Among Us econòmic
/juegos/communist-party/       Sistemes econòmics
/juegos/econopoly/             Monopoly d'economia
/juegos/econrisk/              Risk d'economia
/juegos/playground/            10 jocs 2-jugadors
/juegos/concurso/              Quiz competitiu

/herramientas/                 Eines docents
/herramientas/sa-creator/      Creador Situacions Aprenentatge LOMLOE
/herramientas/test-creator/    Creador de proves

/emprendimiento/               Material d'emprenedoria
                              (es decideix contingut concret a fase d'execució)

/oposiciones                   Redirect 301 directe → oposicioneseconomia.es
                              (sense pàgina d'aterratge intermèdia)

/sobre/                        Sobre el projecte (no personal de Pau)
/contacto/

/legal/aviso-legal/
/legal/privacidad/
/legal/cookies/
```

### 3.2 Estructura interna d'una assignatura

Cada una de les 4 assignatures té exactament la mateixa estructura interna. Açò és **important** per a la coherència de l'experiència:

**`/edmn-2bach/` (Hub)**: pàgina d'aterratge de l'assignatura. Mostra:
- Títol i subtítol de l'assignatura
- Breu descripció (què és, a qui va dirigida, currículum LOMLOE)
- Accés visual als 5 sub-apartats: Llibre, Diapositives, Activitats, Tests, Recursos
- Possible secció amb la unitat actual recomanada o destacada

**`/edmn-2bach/libro/`**: índex del llibre amb totes les unitats. Cada unitat enllaça a la seua pàgina.

**`/edmn-2bach/libro/[unidad]/`**: pàgina d'una unitat concreta del llibre. Contingut llarg, navegació anterior/següent, enllaços a activitats/tests/diapositives relacionades.

**`/edmn-2bach/diapositivas/`**: índex de diapositives per unitat. Descàrrega PDF al MVP. Versió editable PPTX a fase Premium futura.

**`/edmn-2bach/actividades/`**: activitats pràctiques organitzades per unitat. Pot incloure exercicis, casos pràctics, dinàmiques d'aula.

**`/edmn-2bach/tests/`**: tests d'autoavaluació per unitat. Format quiz o exam de pràctica.

**`/edmn-2bach/recursos/`**: HTMLs interactius i altres materials que recolzen l'assignatura. Aquí van els simuladors específics d'aquesta assignatura (per exemple, BMC interactiu per a EDMN 2BACH).

### 3.3 Distribució del contingut antic del webpde

Els 8 índexs antics del webpde (economia, empresa, finances, vida pràctica, ferramentes, recerca, playground, concurs) **es distribueixen dins de les assignatures** segons el seu nivell curricular i temàtica:

**Eco 4ESO**:
- Contingut bàsic d'economia.html (introducció a microeconomia)
- Continguts de vidapractica.html relevants (nòmina, IRPF bàsic, contractes)

**Eco 1BACH**:
- Continguts avançats d'economia.html (microeconomia, macroeconomia, IS-LM, teoria de jocs)
- Sistemes econòmics
- Continguts de finances.html relevants (introducció a inversió)
- Continguts de ferramentes.html (teoria de la decisió, biaixos cognitius)
- Continguts de recerca.html (mètode científic, papers)

**EDMN 2BACH**:
- Tot empresa.html (BMC, DAFO, Porter, finançament empresarial)
- Continguts d'emprenedoria de finances.html

**FOPP 4ESO**:
- vidapractica.html en gran part (orientació personal i professional)
- Continguts laborals de finances.html (nòmina, contractes)
- Materials de drets i deures

**Contingut transversal que NO encaixa a assignatura**:
- Jocs específics (stonks, insider, communist, econopoly, econrisk) → `/juegos/`
- Playground → `/juegos/playground/`
- Concurs → `/juegos/concurso/`
- Generadors (SA LOMLOE, Test) → `/herramientas/`
- Material genèric d'emprenedoria → `/emprendimiento/`

## 4. Cobertura curricular

### 4.1 Filosofia

Els llibres es basen en el **currículum bàsic estatal LOMLOE**, no en concrecions autonòmiques específiques. Aquesta és una decisió de posicionament: volem un producte que servesca a tots els professors d'Espanya, no un producte percebut com a "el llibre del profe valencià".

A Espanya, el currículum bàsic estatal estableix entre el 40-50% del total. Cada CCAA completa el 50-60% restant amb les seues especificitats. Açò vol dir que un mateix llibre no és exactament aplicable a totes les CCAA sense adaptació, però el cor del contingut sí que és comú.

### 4.2 Marcs normatius de referència

**Per a Batxillerat (Eco 1BACH i EDMN 2BACH)**:
- Reial Decret 243/2022, de 5 d'abril, pel qual s'estableixen l'ordenació i els ensenyaments mínims del Batxillerat
- Modificacions posteriors aplicables (a verificar al moment de redactar cada llibre)

**Per a ESO (Eco 4ESO i FOPP 4ESO)**:
- Reial Decret 217/2022, de 29 de març, pel qual s'estableixen l'ordenació i els ensenyaments mínims de l'Educació Secundària Obligatòria
- Modificacions posteriors aplicables

### 4.3 Tractament de les concrecions autonòmiques

**A la introducció de cada llibre** apareixerà una nota explícita tipus:

> "Aquest llibre es basa en el currículum bàsic estatal LOMLOE per a [assignatura] (Reial Decret [X]/2022). Cada comunitat autònoma estableix concrecions específiques al seu currículum propi. Cal consultar la concreció de la teua CCAA per ajustar la programació al teu centre."

Aquesta honestedat és part del posicionament: no prometem cobertura completa de cap CCAA específica, però oferim una base sòlida i adaptable.

### 4.4 Possible adaptació futura (fase 2+)

Si en algun moment hi ha tracció significativa a una CCAA específica i els usuaris d'aquella CCAA demanen adaptació, es valorarà:
- Versió específica per CCAA (cost: feina massiva)
- Apèndix específic per CCAA dins del llibre principal (cost: mig)
- Pàgina web amb concrecions per CCAA (cost: més baix)

La decisió de format depèn de la magnitud de la demanda i la disponibilitat real de Pau. **No es planteja al MVP**.

## 5. Abast del MVP

### 5.1 Versió 0.1 — MVP funcional (juny-juliol 2026)

- **Home** amb les 4 assignatures + accés a /juegos, /herramientas, /emprendimiento (la entrada a /oposiciones és un link al menú, no una secció destacada)
- **Estructura completa de les 4 assignatures** amb les pàgines hub + sub-apartats buits o amb placeholder
- **Llibre 1 (EDMN 2BACH) complet**: totes les unitats publicades, basades en el currículum estatal LOMLOE
- **Diapositives EDMN 2BACH** generades automàticament del llibre
- **Activitats EDMN 2BACH**: les pendents al backlog antic + les nous derivades del llibre
- **Tests EDMN 2BACH**: bàsics, almenys 2-3 per unitat
- **Recursos EDMN 2BACH**: BMC interactiu i altres simuladors d'empresa migrats
- **Migració parcial dels 8 índexs antics**: contingut distribuït a les seues assignatures, però les altres tres assignatures (Eco 1BACH, Eco 4ESO, FOPP 4ESO) tenen llibre **buit/placeholder** mentre treballem
- **/juegos/, /herramientas/, /emprendimiento/**: estructura present però contingut mínim (a futur)
- **Redirect 301 d'oposicions** a oposicioneseconomia.es (sense pàgina intermèdia)
- **Avís legal + privacitat + cookies**
- **SEO bàsic** (meta tags, sitemap, OG)
- **i18n preparada** (es+ca, només es publicat)
- **Deploy a Vercel**

### 5.2 Versió 0.2 — Setembre 2026, llançament suau

- **Llibre 2 (Eco 1BACH) publicat** amb totes les seues seccions, basat en el currículum estatal LOMLOE
- Polit final del Llibre 1 amb feedback rebut
- Tot el SEO optimitzat per a captura del pic estacional

### 5.3 Versió 0.3 — Octubre-Desembre 2026

- **Llibre 3 (Eco 4ESO) publicat**
- Migració completa dels 8 índexs antics distribuits a les assignatures
- Activació de Patreon/donatius

### 5.4 Versió 0.4 — Gener-Febrer 2027

- **Llibre 4 (FOPP 4ESO) publicat**
- **Primer joc refet (stonks)** publicat a /juegos/
- Possible activació de premium professor

### 5.5 Versió 0.5+ — Abril 2027 endavant

- Resta de jocs refets (insider, communist party, econopoly, econrisk)
- Migració completa del Playground
- Eines docents migrades (SA Creator, Test Creator)
- Material d'emprenedoria
- Versió català/valencià activada

### 5.6 Out of scope explícit

- ❌ App mòbil (és un altre projecte, l'app Duolingo-style en standby)
- ❌ Vídeos llargs estil YouTube
- ❌ Live streaming
- ❌ Comunitat / xat / fòrum interns
- ❌ Pagaments al MVP
- ❌ Auth obligatori al MVP
- ❌ Mascotes infantilitzades
- ❌ Anuncis de Google AdSense en cap fase
- ❌ Estructura per "tipus de contingut" en lloc de per assignatura
- ❌ **Pàgina d'aterratge a /oposiciones/** (redirect 301 directe)
- ❌ **Adaptacions per CCAA específiques al MVP** (currículum estatal genèric)

## 6. Direcció estètica

**Direcció 1: Editorial sòbria amb to proper.**

Producte editorial seriós però que parla com un companys de feina, no com una editorial corporativa. La inspiració principal són editorials acadèmiques modernes (Princeton Press, Stripe Press), però amb una veu lleugerament més propera al hero i als textos d'introducció.

### 6.1 Filosofia visual

- Tipografia editorial seriosa: serif als títols, sans humanística al cos
- Espai blanc generós, layouts que respiren
- Una sola columna per al contingut llarg
- Cap emoji com a icona — icones tipogràfiques o SVG personalitzats
- Cap gradient cridaner
- Cap mascot ni il·lustració genèrica
- Microinteraccions polides però discretes

### 6.2 To de veu

**No personal de Pau.** El web no diu "Hola, soc Pau". Diu coses com "Material per a impartir economia, empresa i finances a l'institut".

**Però proper, no corporatiu.** Diferència clau respecte d'una editorial tradicional: parlem en plural ("hem fet"), reconeixem que és material d'aula real ("provat a classe"), reconnectem amb el lector com a col·lega de profession ("ja ho saps, però per si de cas..."). Tons acceptats: didàctic, reflexiu, lleugerament autocrític, mai venedor.

### 6.3 Paleta proposada (validar amb mockups)

- Fons clar: `#FAFAF7` (off-white càlid)
- Fons fosc opcional: `#1A1A1A`
- Accent primari (validar amb mockup):
  - Opció 1: Vermell barroc `#722F37` (impactant, refinat)
  - Opció 2: Verd musc `#5B6C44` (acadèmic, sobri)
  - Opció 3: Blau pissarra `#2E4057` (formal, neutre)
- Accent secundari (terra càlid): `#C19A6B`
- Text primari: `#1A1A1A` clar / `#EDEDED` fosc

### 6.4 Tipografia (validar)

- Títols: Source Serif 4, Newsreader, o Tiempos Headline
- Cos: General Sans, Switzer, Outfit, o Söhne
- Mono: JetBrains Mono o IBM Plex Mono

## 7. Sistema "single source of truth"

Cada unitat dels llibres és **un sol fitxer MDX** del qual es generen totes les versions:

- Pàgina HTML del web (Astro)
- PDF del llibre (paged.js o Puppeteer)
- Diapositives PDF (Marp)
- Diapositives editables PPTX (Pandoc, futur premium)

Convenció `:::slide` dins del MDX defineix què entra a les diapositives:

```mdx
### Concepto: Modelo de Negocio

<!-- :::slide -->
Un modelo de negocio describe cómo una empresa crea, entrega y captura valor.
<!-- ::: -->

[Contenido extenso del libro que no va a slides...]

<!-- :::slide title="Las 9 áreas del Business Model Canvas" -->
- Segmentos de clientes
- Propuesta de valor
- Canales
[...]
<!-- ::: -->
```

## 8. Stack tècnic

- **Framework**: Astro 5
- **UI interactiva**: Preact
- **Estilat**: Tailwind 4
- **Hosting**: Vercel
- **Generació PDF llibres**: paged.js o Puppeteer
- **Generació diapositives**: Marp CLI
- **Backend**: cap al MVP. Fase 2 si activem newsletter o premium.
- **Backend per a jocs multijugador (futur)**: PartyKit / Cloudflare Durable Objects (revisat al moment d'execució)
- **Analytics**: Plausible
- **Errors**: Sentry
- **i18n**: nativa Astro (es default, ca preparada)

## 9. Migració del webpde

### 9.1 Què migra i a on

| Origen webpde | Destí nou | Quan |
|---|---|---|
| `index.html` | `/` (home, refet des de zero) | Setmana 1-2 |
| `economia.html` | Distribuit entre Eco 1BACH i Eco 4ESO | A mesura que es fan els llibres |
| `empresa.html` | Tot a EDMN 2BACH (llibre 1) | Llibre 1 (juny 2026) |
| `finances.html` | Distribuit entre EDMN 2BACH (emprenedoria), FOPP 4ESO (laboral) i Eco 1BACH (inversió) | A mesura que es fan els llibres |
| `vidapractica.html` | Distribuit entre FOPP 4ESO (gran part) i Eco 4ESO (bàsics) | Llibres 3 i 4 |
| `ferramentes.html` | Tot a Eco 1BACH (teoria de la decisió, biaixos) | Llibre 2 (setembre 2026) |
| `recerca.html` | Tot a Eco 1BACH (apartat de mètode científic) | Llibre 2 |
| `playground.html` | A `/juegos/playground/` | Fase 0.5 (abril 2027+) |
| `concurs.html` | A `/juegos/concurso/` | Fase 0.5 |
| `econopoly.html` | A `/juegos/econopoly/` (refet) | Fase 0.5 |
| `econrisk.html` | A `/juegos/econrisk/` (refet) | Fase 0.5 |
| `stonks.html` | A `/juegos/stonks/` (refet, primer joc en arribar) | Fase 0.4 (gener 2027) |
| `insider.html` | A `/juegos/insider/` (refet) | Fase 0.5 |
| `communist.html` | A `/juegos/communist-party/` (refet) | Fase 0.5 |
| `professorat.html` | A `/herramientas/` (SA Creator + Test Creator) | Fase 0.5 |
| `economia-1bach.html` | Esquelet inicial del Llibre 2 (Eco 1BACH) | Setembre 2026 |
| `economia-4eso.html` | Esquelet inicial del Llibre 3 (Eco 4ESO) | Octubre-Desembre 2026 |
| `edmn-2bach.html` | Esquelet inicial del Llibre 1 (EDMN 2BACH) | Juny 2026 (PRIMER) |
| `fopp-4eso.html` | Esquelet inicial del Llibre 4 (FOPP 4ESO) | Gener-Febrer 2027 |
| `oposicions*.html` | NO migra (ja viu a oposicioneseconomia.es). Redirect 301 al domini extern. | — |

### 9.2 Què passa amb el webpde durant la transició

El repo `webpde` queda viu fins que tot estigui migrat. profedeeconomia.es es repunta al nou (Vercel auto-deploy del repo nou) **quan el Llibre 1 estigui complet i amb la home funcional**. Mentrestant, el webpde antic queda accessible via subdomini `legacy.profedeeconomia.es` per al SEO acumulat.

Quan tots els jocs i eines estan migrats (esperem mes 9-10), `legacy.profedeeconomia.es` es deprecia.

### 9.3 Branques pendents al webpde

13 branques remotes amb feina sense merge. Amb l'estratègia de "refer des de zero amb Astro":

- Branques d'oposicions (D-H + micro-translation): **abandonades**, contingut ja viu a oposicioneseconomia.es
- Branques de jocs (board-games, insider-trading, playground-overhaul): **es revisen al moment de refer cada joc** per extreure idees, no codi
- Branques de fix (stonks-rendering): **es revisen al refer stonks** per veure quins bugs tenia
- Branques d'infraestructura (seo, shared-infrastructure, translation): **abandonades**, anem a stack nou

## 10. Backlog antic recuperat

Idees del roadmap antic que s'integren al nou plantejament:

**A Eco 1BACH (Llibre 2)**:
- Simulador AD-AS (Agregat Demanda - Oferta Agregada)
- Visualització IS-LM amb animació
- Casos pràctics amb dades reals (Espanya/UE)
- Simulador de Bayes interactiu (al capítol de teoria de la decisió)

**A EDMN 2BACH (Llibre 1)**:
- BMC exportable com a imatge
- Calculadora de rendibilitat amb gràfic
- Cas pràctic: crear empresa des de zero (com a unitat de capstone)

**A FOPP 4ESO (Llibre 4)**:
- Simulador IRPF complet
- Calculadora pensió jubilació estimada
- Drets laborals bàsics

**A `/juegos/concurso/`**:
- Banc de preguntes ampliat (mín. 200)
- Categories seleccionables
- Mode estudi

**A `/juegos/playground/`**:
- Mode 1 jugador vs CPU
- 2-3 jocs nous (Banc Central, Mercat Laboral)

**A `/herramientas/`**:
- SA Creator millorat
- Test Creator millorat

**Transversal**:
- PWA (Astro suporta nativament)
- Mode Professor → es converteix en Premium professor

**Out**:
- Blog/Notícies (no al MVP, decisió a futur)

## 11. Mètriques d'èxit

**Setembre 2026 — post-llançament Llibres 1+2**:
- 500-1000 visitants/setmana orgànics
- 50+ professors d'institut amb compte registrat
- 5+ professors amb adopció confirmada
- Lighthouse ≥ 95 totes les pàgines

**Març 2027 — 4 llibres complets + 1 joc**:
- 2.000-5.000 visitants/setmana
- 200+ professors amb compte
- 20+ centres educatius amb adopció
- Top 3 a Google per a "libro economia 4eso", "libro empresa 2 bachillerato", etc.

**Setembre 2027 — un curs complet en marxa**:
- 5.000+ visitants/setmana
- 100+ subscriptors Premium professor
- Reconeixement com a referent del nínxol

## 12. Risc i mitigació

### 12.1 Burnout
**Mitigació**: setmanes de descans obligatori al calendari, prioritat clara: docència + oposicioneseconomia.es + profedeeconomia.es + (en standby) app + (no tocar) vida personal. Si dues setmanes seguides perds ritme, **una setmana sencera de descans**.

### 12.2 Estètica no a l'altura del posicionament
**Mitigació**: la primera sessió de Claude Code en aquest projecte és **exclusivament de mockups visuals**. Sense codi de producció. Validem direcció abans d'invertir.

### 12.3 El webpde no es migra mai
**Mitigació**: estratègia "deixar enrere" — no obsessionar-nos amb migrar tot el codi. Migra el contingut educatiu valuós; el codi tècnic es refà.

### 12.4 Estructura per assignatures es percep com a feixuga al SEO
**Mitigació**: cada pàgina d'unitat dels llibres és una entrada SEO independent. La cerca "tema 4 economia 1 bachillerato" porta directament a `/eco-1bach/libro/tema-4/`. SEO no perd profunditat, només organitza diferent.

### 12.5 Professors d'una CCAA específica perceben el llibre com a "no adaptat a nosaltres"
**Mitigació**: nota explícita a la introducció de cada llibre sobre el currículum estatal i la necessitat de complementar amb la concreció autonòmica. Aquest avís preventiu evita decepcions. Si en algun moment hi ha tracció significativa a una CCAA, es valora adaptació específica (fase 2+).

## 13. Versions

- **v1.0** — abril 2026 — primera versió post-decisions estratègiques globals.
- **v2.0** — abril 2026 — reestructuració completa: organització per assignatures (4 + seccions específiques), estètica editorial sòbria amb to proper, estratègia de migració selectiva del webpde.
- **v2.1** — abril 2026 — afegit cobertura curricular (basada en currículum estatal LOMLOE, amb nota explicativa per a la concreció autonòmica). Oposicions: redirect 301 directe sense pàgina intermèdia. Risc 12.5 afegit.
