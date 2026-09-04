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

### 5.2 "PDF" i "gratis" a `/[asignatura]/libro/` — ✅ **fet**

Les consultes amb `pdf gratis` explícit converteixen al 20-25%; les mateixes sense, a zero. Cal:

- `<title>`: `Libro de FOPP 4.º ESO en PDF gratis — 10 unidades LOMLOE` (i equivalents).
- `meta description` que diga literalment que es pot descarregar sencer i per unitats, i que és gratuït.
- Botó de descàrrega del PDF complet **visible al primer scroll**, no al final.

Això toca `/[asignatura]/libro/index.astro` × 9 i és el punt on Econosublime guanya avui per pura claredat de promesa.

**Implementat així:** títol `Libro de {seoName} en PDF gratis` (`Llibre de…` en valencià) i descripció que obri amb «Descarga gratis en PDF el libro completo de…» i tanca amb el recompte real d'unitats. El botó de descàrrega ja estava dins del `hero`, damunt de la llista d'unitats, així que no ha calgut moure'l.

### 5.3 Reescriure els títols de pàgines amb volum i CTR <1,5% — ✅ **fet**

Prioritat per impressions: `taller-eco-3eso/libro/02-agentes-flujo-circular` (941), `ipe1-fp/libro/08-prevencion-riesgos-laborales` (388), `eco-4eso/libro/08-economia-personal-nomina-contratos` (280), `eco-4eso/recursos/calculadora-nomina` (260), `olimpiada/fichas/01-fpp` (233), `dinamicas/teoria-juegos/02-tipos-subasta` (220).

Regla: el títol ha d'oferir **el que una AI Overview no dona** — l'exercici, la calculadora, la fitxa imprimible, l'activitat d'aula. `Agentes económicos y flujo circular: esquema y actividad` bat `Los agentes económicos y el flujo circular` quan dalt hi ha un resum generat.

**Implementat així:** camp opcional `seoTitle` al frontmatter de `libro`, `actividades`, `recursos`, `dinamicas` i `olimpiadaFichas`; quan hi és, la plantilla el fa servir i renderitza sense sufix de marca. Escrit a mà per a 9 pàgines en castellà i valencià (18 fitxers):

| Pàgina | Impr. | Títol nou |
|---|---:|---|
| `taller-eco-3eso/libro/02-agentes-flujo-circular` | 941 | Agentes económicos y flujo circular: esquema y actividad |
| `ipe1-fp/libro/08-prevencion-riesgos-laborales` | 388 | Prevención de riesgos laborales: Ley 31/1995 explicada (FP) |
| `eco-4eso/libro/08-economia-personal-nomina-contratos` | 280 | Nómina y contratos: bruto, neto e IRPF con ejemplos |
| `eco-4eso/recursos/calculadora-nomina` | 260 | Calculadora de nómina: de bruto a neto con IRPF y SS |
| `olimpiada/fichas/01-fpp` | 233 | Frontera de posibilidades de producción (FPP): ejercicios |
| `dinamicas/teoria-juegos/02-tipos-subasta` | 220 | Tipos de subasta: inglesa, holandesa y a sobre cerrado |
| `fopp-4eso/actividades/06-simula-solicitud-beca-mefp` | 153 | Beca MEFP: simula la solicitud y calcula la renta familiar |
| `eco-1bach/recursos/calculadora-interes-compuesto` | 101 | Calculadora de interés compuesto: simula tu ahorro año a año |
| `taller-eco-3eso/recursos/calculadora-ahorro` | 91 | Calculadora de ahorro: cuánto puedes ahorrar cada mes |

A més, s'ha arreglat el **patró per defecte** de les unitats del llibre, que gastava els dos primers mots en `Unidad N.` — text mort que no casa amb cap consulta i que empenyia el tema fora del tall. Ara les ~200 unitats fan `{títol} — {seoName}`, amb l'acrònim de l'assignatura dins.

**No inclou** `/herramientas/costes-resultados/ratios-benchmark/` (271 impr, pos 40,7), `/herramientas/mercados-macro/elasticidad/` (105, pos 37,5) ni `/emprendimiento/` (141, pos 22,7). A posició 22-40 el títol no canvia res perquè quasi ningú les veu. Eixes pàgines es tracten a §5.6 — i el motiu real de per què estan allà no era el que semblava.

### 5.4 Empènyer IPE I / IPE II — ✅ **la part pendent, feta**

1.489 impressions ja, sense cap competidor gratuït i amb el sistema de FP sencer d'Espanya com a públic.

**Revisat l'inventari, dues de les tres accions ja estaven fetes**: IPE I i IPE II tenen les 9 unitats publicades cada un (RD 659/2023, Annex V), 21 i 20 activitats, 9 tests, 5 recursos, 5 reptes, avaluació, reforç i la programació d'aula publicada. No faltava contingut curricular.

**El que sí que faltava** era el posicionament IPE ↔ FOL, i s'ha fet dins de l'estructura existent, com a preguntes freqüents del hub (visibles i dins del `FAQPage` JSON-LD, que és exactament el que un extractor de respostes d'IA agafa):

- IPE I: «¿IPE es lo mismo que FOL?», «¿Qué se da en IPE I y en qué se diferencia de IPE II?», «¿IPE se imparte en Grado Medio y en Grado Superior?»
- IPE II: «¿IPE II es lo mismo que la antigua FOL de segundo?», «¿Hace falta haber dado IPE I para seguir IPE II?»
- FOPP: «¿Qué es FOPP y por qué mucha gente la busca como "FOL de 4.º ESO"?», «¿En qué se diferencia FOPP de Economía y Emprendimiento de 4.º ESO?»

El clúster que ataca: `asignatura fol 4 eso` (48 impr, pos 6,94), `fop asignatura` (31), `fol 4 eso` (20), `que es fopp` (22), `asignatura ipe fp` (12), `itinerario personal para la empleabilidad fol` (9), `ipe fol` (7), `itinerario personal para la empleabilidad es lo mismo que fol`.

**No inclou** escriure unitats noves de llibre: el contingut curricular passa revisió manual de Pau abans de publicar-se (CLAUDE.md), i no hi havia buits.

### 5.5 Dades estructurades `Quiz` / Education Q&A als tests — ✅ **fet**

L'única categoria de resultat enriquit encara viva i rellevant per a un lloc educatiu (les *practice problems* es van deprecar el gener de 2026; les FAQ, el 2023). Marcar `/[asignatura]/tests/[slug]` amb `Quiz` + `Question` obri la porta al carrusel d'Educació Q&A a Cerca, Assistant i Lens. **Econosublime no ho pot fer**: els seus tests són PDF sobre Blogger. És l'avantatge estructural més net que tenim.

**Implementat així:** `quizLd()` a `src/lib/seo.ts`, alimentat pel mateix frontmatter que el `QuizPlayer` renderitza — requisit de Google: les preguntes marcades han de ser les que el visitant pot respondre a la pàgina. Cobertura real al build: **176 de 176 pàgines de test, 1.958 preguntes marcades**.

- `opcion-multiple` i `verdadero-falso` → `eduQuestionType: "Multiple choice"`, amb `acceptedAnswer` i la resta com a `suggestedAnswer`.
- `numerico` → `eduQuestionType: "Flashcard"`, amb la unitat dins de la resposta.
- `relacionar` → **s'omet**: no té una resposta única en text i forçar-la falsejaria la pàgina.
- L'explicació de cada pregunta va com a `answerExplanation`, i el Markdown s'aplana a text pla.

### 5.6 Les pàgines encallades en posició 22-45 — ✅ **fet, però no com deia ací**

> **Correcció.** Este apartat deia que eixes pàgines «tenen demanda i no tenen enllaços» i que enllaçar-les des de les unitats del llibre mouria posicions. **La premissa era falsa.** En comptar els enllaços interns reals sobre el build:
>
> | Pàgina | Impr. | Posició | Enllaços entrants |
> |---|---:|---:|---:|
> | `/herramientas/costes-resultados/ratios-benchmark/` | 271 | 40,7 | 6 |
> | `/emprendimiento/` | 141 | 22,7 | **1.724** |
> | `/herramientas/mercados-macro/elasticidad/` | 105 | 37,5 | 6 |
> | `/eco-1bach/recursos/calculadora-elasticidad/` | — | **6,7** | 6 |
>
> `/emprendimiento/` està al menú global: 1.724 enllaços entrants. No és un problema d'enllaçat i cap enllaç més el va a moure. I l'eina i el seu bessó d'assignatura tenen **exactament els mateixos 6 enllaços** amb 30 llocs de diferència, o siga que l'enllaçat tampoc explica el buit. La mediana del lloc és de 2 enllaços entrants: eixes pàgines no estan poc enllaçades, estan **duplicades**.

**El diagnòstic real: canibalització.** Cada eina viu a dues URL — la fitxa transversal de `/herramientas/` i el recurs de l'assignatura — amb la mateixa illa interactiva i un text que coincideix entre el **81% i el 87%**:

| Eina | Similitud del text | `/herramientas/` | Bessó d'assignatura |
|---|---:|---:|---:|
| elasticidad | 81% | pos 37,5 | pos 6,7 |
| ratios-benchmark | 87% | pos 40,7 | pos 17,6 |
| multiplicador-gasto | 85% | pos 14,5 | pos 14,1 |

Totes dues eren *self-canonical*, o siga que competien entre elles i Google es quedava amb una.

**Implementat així:** quan una eina té **un sol** bessó d'assignatura, la fitxa de `/herramientas/` hi apunta amb `rel=canonical` i deixa d'emetre `hreflang` (només les pàgines *self-canonical* poden declarar-lo). La pàgina segueix navegable i l'illa funciona igual: només deixa de competir amb el seu propi duplicat. La correspondència es deriva de `recursos` en temps de build (`recursoCanonicoPorComponente`), no es manté a mà.

Resultat al build: **22 pàgines consolidades** (11 eines × 2 idiomes), 22 que segueixen *self-canonical*, 0 amb `hreflang` contradictori.

**El que queda obert i és decisió de Pau.** Les altres 11 eines tenen entre 2 i 5 bessons, així que no hi ha un destí únic i s'han deixat com estaven. El cas extrem és la calculadora de nòmina: **sis URL per a la mateixa eina** (`/herramientas/finanzas-personales/nomina/` i els recursos d'eco-4eso, taller-eco-3eso, gpe-bach, ipe1-fp i fopp-4eso), competint totes entre elles — eco-4eso a la posició 8,25 amb 260 impressions i taller-eco-3eso a la 13,8 amb 71. Consolidar-les vol dir triar qui ha de guanyar la consulta `calculadora de nómina`, i això és una decisió de producte, no de codi.

**Una inconsistència menor coneguda:** les 22 URL consolidades continuen al `sitemap.xml`. Google segueix el `canonical` i les consolida igual, i filtrar-les exigiria duplicar la derivació dins d'`astro.config.mjs` (que no pot importar el `lib` de TypeScript). El senyal que compta ja és correcte; no compensa la fragilitat.

### 5.7 Sufix de marca sensible a la longitud — ✅ **fet**

Mesurat sobre el build sencer un cop fetes 5.1-5.3: **684 títols portaven el sufix ` — profedeeconomia` tot i passar ja dels 60 caràcters**. En eixes pàgines el sufix no es veu (Google talla per la dreta) però desplaça paraules que sí que es veurien.

**Implementat així:** funció `pageTitle()` a `src/lib/seo.ts`, que el `BaseLayout` fa servir: el sufix s'afig només quan `títol + 18 ≤ 60`. No pot empitjorar cap títol perquè només lleva text que ja era invisible, i Google ja afig el nom del lloc pel seu compte des de l'`og:site_name`.

Resultat al build: **de 684 a 0 pàgines indexables** amb marca sobrant (els 61 casos que queden són `/imprimir`, bloquejades a `robots.txt`). 623 títols han recuperat eixos 18 caràcters.

Queda un residu que **no** és cosa del sufix: el 59% dels títols indexables encara passa dels 60 caràcters pel títol mateix. Això ja és feina d'autoria, títol a títol, no de codi.

### 5.8 `/ca/` com a actiu diferencial — ✅ **fet, i tampoc era el que semblava**

80 URLs fan 745 impressions amb un CTR del 4,97%, per damunt de la mitjana del lloc. Econosublime hi té dos PDFs de 2021.

> **Correcció.** Este apartat parlava de «completar el `/ca/`» com a feina de fase 2. **El contingut ja està complet**: 786 fitxers ES i 786 germans CA, **100% de paritat, cap fitxer ES sense traduir**, a totes les col·leccions. El que fallava era una altra cosa.

**Defecte 1 — mig lloc fora del sitemap.** El `sitemap.xml` tenia 839 entrades per a 1.678 pàgines indexables: **totes les ES, cap de les 840 CA**. El *fallback rewrite* d'i18n d'Astro genera les rutes `/ca/` sense registrar-les com a rutes, així que `@astrojs/sitemap` no les veu mai. Declarar-li `i18n` no serveix de res — només pot anotar pàgines que ja ha descobert (provat: 0 canvis).

Arreglat amb un *hook* d'`astro:build:done` que replica cada URL a la seua bessona `/ca/` **només quan eixa pàgina existeix de veritat al disc** (res d'endevinar) i dona a tots dos membres les alternates `xhtml:link` que Google espera. El `<lastmod>` es preserva. La lògica viu a `scripts/sitemap-i18n.mjs`, com a funció pura sobre la cadena XML, per poder provar-la sense un build.

Resultat: **de 839 a 1.678 entrades, del 50% al 100% de cobertura**, 0 duplicats, 1.678 alternates per idioma. L'única pàgina que en queda fora és `/ca/404/`, que no hi ha d'estar.

**Defecte 2 — els hubs valencians parlaven castellà.** El bloc de preguntes freqüents d'un hub `lang="ca"` es renderitzava sencer en castellà, encapçalament inclòs («Preguntas frecuentes»), i emetia el `FAQPage` JSON-LD també en castellà. És la fuga de rellevància més directa que pot tindre una pàgina valenciana. `subjectFaqs()` ara rep la locale i l'assignatura ja localitzada; el `FaqHub` localitza l'encapçalament. Comprovat al build: **0 caràcters `¿` als blocs FAQ de `/ca/`**.

**El que queda de veritat.** Els *hubs* CA posicionen bé (`/ca/eco-4eso/` a la 6,45 amb un 18,37% de CTR; `/ca/taller-eco-3eso/` a la 5,29 amb un 42,86%). Les unitats de llibre CA que van mal ho fan sobre termes generals en català (`autoconeixement` 68 impr pos 43,7; `emprenedoria` 62 impr pos 33,9), on la competència és de llocs catalans consolidats. Això és autoritat i temps, no un defecte tècnic.

**Un candidat per a més avant:** els *slugs* de les URL `/ca/` són en castellà (`/ca/fopp-4eso/libro/01-autoconocimiento-identidad/` per a la consulta `autoconeixement`). Traduir-los és un canvi estructural amb redireccions i no s'ha tocat.

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
