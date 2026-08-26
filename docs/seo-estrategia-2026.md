# Estratègia SEO 2026 — diagnòstic GSC i pla per a disputar-li el terreny a Econosublime

> Anàlisi de l'export de Google Search Console del **25/05/2026 – 24/08/2026** (92 dies, tipus de cerca: Web) i pla d'acció prioritzat. Data: 2026-08-26.
>
> Fonts: `Gráfico.csv` (560 clics / 13.467 impressions), `Consultas.csv` (542 consultes), `Páginas.csv` (520 URLs), `Aparición en búsquedas.csv` (buit), `Filtros.csv`.

---

## 1. Resum executiu

**Com va: bé, i millor del que sembla.** El lloc porta ~3 mesos de dades i la corba és de creixement net, no de rebot: de 128 impressions els primers 14 dies a 6.706 els últims 28. Els últims 28 dies contra els 28 anteriors: **clics +36%, impressions +19%, posició mitjana de 10,85 → 9,26**. Les tres mètriques milloren alhora, que és el patró d'un lloc que Google està acabant d'avaluar i col·locant.

**El coll d'ampolla no és el contingut.** Hi ha 1.572 fitxers de contingut i 520 URLs ja generant impressions: la indexació funciona i la cobertura és àmplia. El coll d'ampolla són dues coses molt concretes:

1. **Posició 8-10 en compte de 1-3.** El 57% de les impressions visibles estan en pàgina 1, però a la meitat baixa, on el CTR real és de l'1-3%.
2. **Els títols no contenen el que la gent escriu.** Cap `<title>` porta els acrònims (`FOPP`, `EEAE`, `EDMN`, `IPE`, `GPE`) i cap promet el que hi ha darrere (llibre, diapositives, PDF gratis). Això és, de llarg, la palanca més barata que tenim.

**Sobre atacar Econosublime:** la intuïció és bona però la tàctica que proposes té un sostre baix. Anar a per "economia 4eso econosublime" val poc (2 impressions en 3 mesos). El que sí que val molt és el **que hi ha darrere d'eixa intuïció**: eixa gent escriu una marca perquè no coneix cap consulta genèrica que li torne material decent. La resposta no és competir pel seu nom — és ocupar les consultes on ells no hi són i guanyar-los en format. Detall a §4.

**Temps:** setembre és el pic anual d'este nínxol. Les accions de §5.1–5.3 s'han de fer **abans de la primera setmana de setembre** o es perd la finestra sencera fins al gener.

---

## 2. Diagnòstic quantitatiu

### 2.1 Volum i tendència

| Període | Clics | Impressions | CTR | Posició mitjana |
|---|---:|---:|---:|---:|
| Maig (25-31) | 6 | 71 | 8,45% | 8,03 |
| Juny | 99 | 1.204 | 8,22% | 7,85 |
| Juliol | 210 | 6.238 | 3,37% | 10,77 |
| Agost (1-24) | 245 | 5.954 | 4,11% | 9,20 |
| **Total 92 dies** | **560** | **13.467** | **4,16%** | **~9,3** |

| Comparativa | Clics | Impressions | CTR | Posició |
|---|---:|---:|---:|---:|
| Últims 28 dies | 267 | 6.706 | 3,98% | 9,26 |
| 28 dies anteriors | 196 | 5.628 | 3,48% | 10,85 |
| **Variació** | **+36%** | **+19%** | **+0,5 pp** | **−1,6 llocs** |

La caiguda del CTR de juny (8,22%) a juliol (3,37%) **no és un problema**: és el que passa quan multipliques per 5 les impressions entrant en consultes noves on encara estàs a la posició 10-11. El CTR baixa perquè el denominador creix. El senyal bo és que a l'agost el CTR remunta (4,11%) alhora que la posició millora.

### 2.2 On està la tracció, per secció

| Secció | URLs | Clics | Impressions | CTR |
|---|---:|---:|---:|---:|
| `/fopp-4eso` | 47 | 158 | 2.929 | 5,39% |
| `/eco-4eso` | 36 | 72 | 2.209 | 3,26% |
| `/taller-eco-3eso` | 31 | 53 | 1.656 | 3,20% |
| `/ipe1-fp` | 42 | 45 | 1.152 | 3,91% |
| `/eeae-bach` | 31 | 32 | 856 | 3,74% |
| `/dinamicas` | 18 | 11 | 532 | 2,07% |
| `/herramientas` | 16 | 6 | 496 | 1,21% |
| `/olimpiada` | 19 | 3 | 474 | 0,63% |
| **(home)** | 2 | 82 | 455 | **18,02%** |
| `/gpe-bach` | 22 | 12 | 444 | 2,70% |
| `/edmn-2bach` | 47 | 14 | 406 | 3,45% |
| `/eco-1bach` | 41 | 5 | 405 | 1,23% |
| `/ipe2-fp` | 30 | 20 | 337 | 5,93% |
| **Total `/ca/`** | 80 | 37 | 745 | 4,97% |

Tres lectures que importen:

- **FOPP és el motor**: 22% de totes les impressions del lloc. La consulta `fopp` sola en fa 393.
- **Inversió d'expectatives amb EDMN 2BACH.** És l'assignatura on més s'ha invertit (47 URLs, la primera del pla) i està l'11a per impressions, amb 14 clics. No és culpa del material: és el terreny **més disputat** de tots (Econosublime, McGraw-Hill, SM). En canvi, IPE II amb 30 URLs fa més clics (20) que EDMN amb 47.
- **La home converteix molt bé** (18% de CTR): quan algú busca la marca, entra. Això vol dir que el problema de CTR és de les pàgines internes, no de com es presenta el projecte.

### 2.3 Els diagnòstics que canvien decisions

**a) 94% de les consultes tenen zero clics** (511 de 542). Combinat amb el fet que les consultes exportades només cobreixen el 26% de les impressions i el 13% dels clics, això vol dir que la major part del tràfic real ve de *long tail* anonimitzada. És sa, però amaga on estem perdent.

**b) Hi ha un forat de CTR mesurable.** Aplicant una corba de CTR-per-posició estàndard només a les consultes visibles amb pos ≤10 i ≥15 impressions, ixen **~37 clics/trimestre que no s'estan capturant**, sobre una base de 73 clics visibles. És a dir: **~50% més de clics sense moure ni una posició**. Cal llegir-ho com un ordre de magnitud, no com una promesa — les AI Overviews han rebaixat el CTR real de tot el sector, així que la captura efectiva serà menor. Però la direcció és inequívoca.

**c) Els acrònims són el forat més gran i més barat de tapar.** Les consultes que comencen per acrònim sumen **805 impressions amb només 23 clics (2,86% de CTR)**:

| Consulta | Impressions | Posició | CTR |
|---|---:|---:|---:|
| `fopp` | 393 | 9,07 | **1,27%** |
| `fopp 4 eso` | 146 | 6,76 | 4,79% |
| `fopp asignatura` | 65 | 9,75 | 10,77% |
| `eeae` | 42 | 5,02 | **0,00%** |
| `fop asignatura` | 31 | 9,87 | **0,00%** |
| `edmn` | 21 | 3,90 | **0,00%** |

`eeae` a la posició 5 amb **zero clics** i `edmn` a la posició 3,9 amb **zero clics** no és mala sort. És que el `<title>` que veu eixa persona és:

> `Economía, Emprendimiento y Actividad Empresarial — 1.º Bachillerato — profedeeconomia`

Ningú que escriu `eeae` reconeix això com el que buscava. Econosublime titula `LIBRO FORMACIÓN Y ORIENTACIÓN PERSONAL Y PROFESIONAL (FOPP) - ECONOSUBLIME`: horrible tipogràficament, però hi posa l'acrònim i el tipus de material. Guanya el clic.

**d) La intenció "libro … pdf" és la que millor converteix i la que pitjor estem servint.**

| Consulta | Impressions | Posició | CTR |
|---|---:|---:|---:|
| `libro economía y emprendimiento 4 eso pdf gratis` | 12 | 4,67 | **25,00%** |
| `libro fopp 4 eso pdf` | 25 | 4,52 | **20,00%** |
| `libro economía 4 eso pdf gratis` | 15 | 6,80 | 13,33% |
| `libro fopp 4 eso` | 22 | 5,86 | **0,00%** |
| `economía y emprendimiento 4 eso pdf` | 22 | 5,55 | **0,00%** |
| `libro economia 4 eso` | 28 | 11,00 | **0,00%** |

Quan la consulta porta "pdf gratis" explícit i el nostre resultat hi encaixa, el CTR es dispara al 20-25%. Quan no, cau a zero a la mateixa posició. **La paraula "gratis" i el format "PDF" han d'estar al títol i a la descripció de `/[asignatura]/libro/`.** És el moment de veritat del lloc: el professor que busca material vol saber, sense clicar, si el pot descarregar.

**e) Pàgines amb molt volum i CTR quasi nul** — cada una és un títol per reescriure:

| URL | Impressions | Posició | CTR |
|---|---:|---:|---:|
| `/taller-eco-3eso/libro/02-agentes-flujo-circular/` | 941 | 5,52 | 0,96% |
| `/ipe1-fp/libro/08-prevencion-riesgos-laborales/` | 388 | 9,66 | 0,77% |
| `/eco-4eso/libro/08-economia-personal-nomina-contratos/` | 280 | 8,64 | 0,71% |
| `/eco-4eso/recursos/calculadora-nomina/` | 260 | 8,25 | 0,38% |
| `/olimpiada/fichas/01-fpp/` | 233 | 9,38 | **0,00%** |
| `/dinamicas/teoria-juegos/02-tipos-subasta/` | 220 | 7,97 | 0,91% |

941 impressions a la posició 5,5 amb 9 clics és el cas més sagnant del lloc sencer. Eixa pàgina competeix per `agentes economicos` i derivats — consultes definicionals que avui resol una AI Overview.

**f) Hi ha senyals clars de superfícies d'IA.** Consultes com `dame las respuestas`, `alguna más ?`, `lo necesito en español`, `si`, `por ejemplo`, `中文` apareixen a **posició 1 amb 0 clics**, igual que `agentes economicos` (28 impressions, posició 1,04, zero clics). Eixe patró — fragments conversacionals, posició 1, CTR nul — és el que deixa AI Mode a GSC. Vol dir que **el contingut ja s'està citant en respostes d'IA sense generar visita**. No és dolent (construeix autoritat d'entitat i el `llms.txt` que ja hi ha ajuda), però explica per què el CTR global sembla baix i per què les consultes definicionals ja no són un objectiu rendible.

**g) `Aparición en búsquedas.csv` està buit: zero resultats enriquits.** Tot i tindre JSON-LD (`Course`, `Article`/`LearningResource`, `BreadcrumbList`, `FAQPage`, `ItemList`), el lloc no guanya cap *rich result*. És esperable — Google va retirar els *snippets* de FAQ per a llocs no institucionals el 2023, i les *practice problems* es van deprecar el gener de 2026. Però queda una porta oberta i sense competència: §5.5.

---

## 3. Qui és Econosublime i on és feble

Blog de **Javier Martínez**, professor d'economia a Andalusia des de 2010, sobre **Blogger**. Cobreix Economia i Emprenedoria 4t ESO, Economia 1r Bat, EDMN 2n Bat, FOPP i Cultura Emprenedora, amb llibres complets en PDF gratuïts, activitats, diapositives i programacions. Té canal de YouTube i quinze anys d'autoritat de domini acumulada.

**Això últim és el fossat i no es pot assaltar frontalment a curt termini.** Però la posició té esquerdes concretes:

| Debilitat | Per què ens serveix |
|---|---|
| **Blogger** | Rendiment i Core Web Vitals dolents, disseny datat, control tècnic mínim. Astro + Vercel guanya en tot això. |
| **Entrega PDF-first** | El PDF posiciona pitjor que l'HTML en la majoria de consultes, no s'actualitza in situ i no es pot enriquir amb dades estructurades. Nosaltres tenim el llibre com a HTML **i** com a PDF: podem competir a les dues graelles. |
| **URLs duplicades** | Conviuen `/p/libro-gratuito-4-eso-economia.html` i `/libro-gratuito-4-eso-economia/` per al mateix contingut. Canibalització pròpia. |
| **Cobertura buida a FP** | **No té res d'IPE I ni IPE II.** El terreny està en mans d'editorials de pagament (Macmillan, BusinessADN) i de plataformes d'apunts (Wuolah, Studocu). |
| **Cobertura buida al currículum valencià** | Res de Taller d'Economia 3r ESO, EEAE ni GPE. |
| **Enfocament Andalusia** | El material s'orienta a la PAU d'Andalusia. Fora d'allà, la concreció no encaixa. |
| **Quasi res en valencià/català** | Dos PDFs heretats d'EDMN de 2021. |
| **Zero interactivitat** | Ni calculadores, ni tests autocorregibles, ni jocs. Sobre Blogger, no els pot fer. |

---

## 4. Sobre "atacar-los per la marca": el que funciona i el que no

Val la pena ser explícit perquè la decisió d'on posar les hores canvia molt segons com es llija.

**El que no funciona: perseguir el seu nom.** No es pot superar `econosublime.com` per a `econosublime`. Eixes consultes són navegacionals: qui les escriu ja sap on va. I el volum és irrisori — en 3 mesos, totes les consultes de marca de la competència juntes (`econosublime`, `al loro con la economia`, `economia en cuarentena`, McGraw, SM) sumen **34 impressions i 2 clics**. Encara que en captarem el 100%, no mou l'agulla. Aparèixer per a `econosublime fopp` (ja hi som, posició 12) és una anècdota, no una estratègia.

**El que sí que funciona: llegir per què escriuen la marca.** Un professor que escriu `economia 4eso econosublime` no està buscant Econosublime — està buscant *material fiable de 4t d'ESO* i usa l'única marca que coneix com a filtre de qualitat. La consulta genèrica equivalent, `economia y emprendimiento 4 eso`, ja ens dona **162 impressions a la posició 8,8**. Eixa és la mateixa persona, tres vegades més barata de capturar i amb deu vegades més volum.

Traduït a tres jugades, per ordre de rendiment:

**Jugada A — Guanyar-los on no hi són.** IPE I i IPE II (FP), Taller d'Economia 3r ESO, EEAE, GPE, i tot el `/ca/`. Ja són **4.100 impressions/trimestre** amb competència nul·la o de pagament. Ací no es disputa autoritat: es reclama terreny buit. **És la partida amb més retorn per hora invertida i on han d'anar les hores de setembre.**

**Jugada B — Guanyar-los en format.** Ells donen un PDF; nosaltres donem HTML navegable + PDF + calculadora + test autocorregible + diapositives. Google i les superfícies d'IA premien l'HTML estructurat; el professor prem la calculadora. Ací el `llms.txt` i les dades estructurades fan feina (§5.5) i Blogger els impedeix seguir-nos.

**Jugada C — Disputar el cap de cartell, però després.** `economia y emprendimiento 4 eso`, `libro economia 4 eso`, `economía 1 bachillerato`. Ací sí que hi ha guerra directa i quinze anys d'enllaços en contra. Es guanya amb els punts d'autoritat que aporten A i B, no abans. La feina d'ara és pujar de la posició 8-11 a la 4-6, que és on el CTR es multiplica per tres.

Una quarta opció, opcional i de sostre baix: una pàgina honesta de comparativa de materials (`/materiales/`) que reculla què cobreix cada lloc del sector, Econosublime inclòs, enllaçant-hi de veritat. Sol posicionar per a consultes de marca + modificador i atreu enllaços. Té cost reputacional zero si es fa amb honestedat i no en té gens de trampa. Però el resultat és incert i no és prioritari davant de A i B.

---

## 5. Pla d'acció prioritzat

Ordenat per (impacte ÷ esforç). Les tres primeres són la finestra de setembre.

### 5.1 Acrònims i intenció als `<title>` — ✅ **fet** (en este mateix PR)

El `BaseLayout` afig `— profedeeconomia` a tot títol que no acabe amb la marca, i els *hubs* fan servir `${a.title} — ${a.level}`. Resultat: 67+ caràcters, sense acrònim i sense promesa. Proposta: afegir un camp `seoTitle` opcional a `ASIGNATURAS` i deixar que el sufix de marca siga opcional per pàgina.

| Slug | Títol actual | Títol proposat |
|---|---|---|
| `fopp-4eso` | Formación y Orientación Personal y Profesional — 4.º ESO — profedeeconomia | **FOPP 4.º ESO: libro, diapositivas y actividades gratis** |
| `eeae-bach` | Economía, Emprendimiento y Actividad Empresarial — 1.º Bachillerato — profedeeconomia | **EEAE Bachillerato: libro y actividades de emprendimiento** |
| `edmn-2bach` | Empresa y Diseño de Modelos de Negocio — 2.º Bachillerato — profedeeconomia | **EDMN 2.º Bachillerato: libro, diapositivas y EBAU** |
| `ipe1-fp` | Itinerario Personal para la Empleabilidad I — FP — Grado Medio y Superior — profedeeconomia | **IPE I (FP): libro, actividades y recursos LOMLOE** |
| `ipe2-fp` | Itinerario Personal para la Empleabilidad II — FP — Grado Medio y Superior — profedeeconomia | **IPE II (FP): libro, actividades y proyecto de empresa** |
| `gpe-bach` | Gestión de Proyectos de Emprendimiento — Bachillerato (1.º/2.º) — profedeeconomia | **GPE Bachillerato: libro y proyecto de emprendimiento** |
| `eco-4eso` | Economía y Emprendimiento — 4.º ESO — profedeeconomia | **Economía y Emprendimiento 4.º ESO: libro y actividades** |
| `taller-eco-3eso` | Taller de Economía — 3.º ESO — profedeeconomia | **Taller de Economía 3.º ESO: libro, actividades y tests** |
| `eco-1bach` | Economía — 1.º Bachillerato — profedeeconomia | **Economía 1.º Bachillerato: libro, actividades y tests** |

Els d'IPE arriben avui als 88 caràcters: Google en mostra ~60, així que la meitat del títol ni s'arriba a veure. El nom complet no es perd: va a l'`<h1>`, a la `meta description` i al cos. Google indexa igual les consultes llargues (`formación y orientación personal y profesional 4 eso`, 72 impressions) i mostra l'acrònim a qui busca l'acrònim.

**Implementat així:** camp `seoTitle` requerit a `ASIGNATURAS` (`src/lib/asignaturas.ts`) amb l'equivalent valencià a `ASIGNATURAS_CA`, i prop `brandSuffix` al `BaseLayout` perquè el hub renderitze sense el sufix de marca — Google ja afig el nom del lloc pel seu compte i el sufix només robava caràcters. El nom complet de l'assignatura es manté a l'`<h1>` i a la `meta description`, així que les consultes llargues no es toquen.

**Retorn esperat:** només `fopp` (393 impressions, 1,27%) portada a un CTR realista del 4-5% són ~+12-15 clics/mes d'una sola consulta. Sumant `eeae`, `edmn`, `fop asignatura` i companyia, l'ordre de magnitud és **+40-60 clics/mes sense moure cap posició**.

### 5.2 "PDF" i "gratis" a `/[asignatura]/libro/` — **1 sessió**

Les consultes amb `pdf gratis` explícit converteixen al 20-25%; les mateixes sense, a zero. Cal:

- `<title>`: `Libro de FOPP 4.º ESO en PDF gratis — 10 unidades LOMLOE` (i equivalents).
- `meta description` que diga literalment que es pot descarregar sencer i per unitats, i que és gratuït.
- Botó de descàrrega del PDF complet **visible al primer scroll**, no al final.

Això toca `/[asignatura]/libro/index.astro` × 9 i és el punt on Econosublime guanya avui per pura claredat de promesa.

### 5.3 Reescriure els 10 títols de pàgines amb volum i CTR <1,5% — **1 sessió**

Prioritat per impressions: `taller-eco-3eso/libro/02-agentes-flujo-circular` (941), `ipe1-fp/libro/08-prevencion-riesgos-laborales` (388), `eco-4eso/libro/08-economia-personal-nomina-contratos` (280), `eco-4eso/recursos/calculadora-nomina` (260), `olimpiada/fichas/01-fpp` (233), `dinamicas/teoria-juegos/02-tipos-subasta` (220).

Regla: el títol ha d'oferir **el que una AI Overview no dona** — l'exercici, la calculadora, la fitxa imprimible, l'activitat d'aula. `Agentes económicos y flujo circular: esquema, ejemplos y actividad de aula` bat `Los agentes económicos y el flujo circular` quan dalt hi ha un resum generat.

### 5.4 Empènyer IPE I / IPE II — **la Jugada A, diverses sessions**

1.489 impressions ja, sense cap competidor gratuït i amb el sistema de FP sencer d'Espanya com a públic. Accions: completar les unitats que falten, publicar la programació d'aula d'IPE I i IPE II (les programacions atrauen exactament el professor que decideix el material del curs), i crear una pàgina d'aterratge que explique la relació IPE ↔ FOL — la consulta `itinerario personal para la empleabilidad es lo mismo que fol` ja apareix, i `asignatura fol 4 eso` fa 48 impressions.

### 5.5 Dades estructurades `Quiz` / Education Q&A als tests — **1-2 sessions**

L'única categoria de resultat enriquit encara viva i rellevant per a un lloc educatiu (les *practice problems* es van deprecar el gener de 2026; les FAQ, el 2023). Marcar `/[asignatura]/tests/[slug]` amb `Quiz` + `Question` obri la porta al carrusel d'Educació Q&A a Cerca, Assistant i Lens. **Econosublime no ho pot fer**: els seus tests són PDF sobre Blogger. És l'avantatge estructural més net que tenim.

### 5.6 Enllaçat intern cap a les pàgines encallades en posició 35-45 — **continu**

`/herramientas/costes-resultados/ratios-benchmark/` (271 impressions, posició 40,7), `/emprendimiento/` (141, posició 22,7), `/herramientas/mercados-macro/elasticidad/` (105, posició 37,5). Tenen demanda i no tenen enllaços. Enllaçar-les des de les unitats del llibre que tracten el tema és gratis i mou posicions.

### 5.7 `/ca/` com a actiu diferencial — **fase 2**

80 URLs fan 745 impressions amb un CTR del 4,97%, per damunt de la mitjana del lloc. Econosublime hi té dos PDFs de 2021. Amb el currículum valencià (Taller 3r ESO, EEAE, GPE) ja cobert en castellà, completar el `/ca/` és terreny sense ningú.

---

## 6. Què mesurar i quan

Revisió a **1 d'octubre**, comparant 28 dies contra els 28 previs:

| Mètrica | Base (28d fins 24/08) | Objectiu octubre |
|---|---:|---:|
| Clics | 267 | 450-550 |
| Impressions | 6.706 | 9.000-11.000 |
| CTR | 3,98% | >5,5% |
| Posició mitjana | 9,26 | <8,0 |
| CTR de `fopp` | 1,27% | >4% |
| CTR de `eeae` / `edmn` | 0% | >3% |

L'indicador que de veritat diu si el pla funciona no és el volum de setembre — setembre puja sol per estacionalitat — sinó **el CTR a posició constant**. Si la posició mitjana es queda igual i el CTR puja, §5.1–5.3 han funcionat. Si puja el volum però el CTR es queda on està, hem confós estacionalitat amb progrés.

---

## 7. Advertiments

- **Els 37 clics de "forat de CTR" són una estimació d'ordre de magnitud**, calculada amb una corba CTR-per-posició estàndard sobre el 26% d'impressions amb consulta visible. Les AI Overviews han rebaixat el CTR real de tot el sector; la captura efectiva serà menor que el càlcul teòric.
- **No optimitzar per a consultes definicionals** (`qué es el mercado`, `agentes económicos`, `elasticidad de la demanda`). Ja les resol la IA a dalt de tot i el CTR és zero fins i tot en posició 1. El valor és en consultes de **material**: llibre, activitats, programació, test, calculadora, diapositives.
- **No posar "econosublime" en títols, descripcions ni text ocult.** Google filtra pàgines que parasiten marques alienes i el cost reputacional en un nínxol xicotet de professors que es coneixen entre ells és molt superior al benefici.
- Res d'este pla toca l'estructura per assignatures ni el sistema visual: són canvis de metadades, dades estructurades i contingut nou dins de l'estructura vigent.
