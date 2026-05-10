# Prompt Claude Code — Sessió 1: Mockups visuals (NO setup tècnic)

> Aquesta és la **primera sessió de Claude Code** per al projecte profedeeconomia.es. **NO és una sessió de setup tècnic**. És una sessió de **disseny visual** per validar la direcció estètica abans de fer cap codi de producció.

## Per què mockups primers

L'estètica és el factor diferenciador #1 del projecte (la nostra avantatge enfront d'Econosublime és el disseny). Comprometre's amb una direcció estètica només llegint adjectius és un error. Cal veure-ho amb contingut real.

Al final d'aquesta sessió Pau hauria de tenir **mockups en HTML/CSS funcionals** de 4-5 pàgines clau que mostrin com ha de ser visualment el web complet. Amb açò pot decidir amb dades.

## Pre-requisits manuals (5 minuts)

### 1. Crear el repo a GitHub

Vés a https://github.com/new i crea un repo nou:
- Nom: `profedeeconomia` (o el que preferisques)
- Privat al principi
- Sense README, sense .gitignore (els crearem nosaltres)

### 2. Clonar el repo localment

```cmd
cd C:\Users\paumo\Desktop\projects
git clone https://github.com/skinnydkd/profedeeconomia.git
cd profedeeconomia
```

### 3. Posar els documents

```cmd
mkdir docs-pendientes
```

Mou des de Downloads (drag&drop):
- `profedeeconomia-PRD.md` → `docs-pendientes\`
- `profedeeconomia-CLAUDE.md` → `docs-pendientes\`
- `profedeeconomia-migration-map.md` → `docs-pendientes\`

### 4. Engegar Claude Code

```cmd
claude
```

## El prompt (copia-pega a Claude Code)

```
# Tasca: Mockups visuals del nou profedeeconomia.es (NO setup tècnic)

## Context i intent

Aquesta és la primera sessió per al projecte profedeeconomia.es. NO has de fer
setup tècnic ni inicialitzar Astro encara. La teua única tasca és crear MOCKUPS
VISUALS d'unes 4-5 pàgines clau perquè Pau pugui validar la direcció estètica
abans de comprometre's amb codi de producció.

L'estètica és el factor diferenciador principal d'aquest projecte. Cal veure-ho
amb contingut real i en interacció abans de decidir.

## Llig primer

Hi ha 3 documents pendents al directori `docs-pendientes/` que has de col·locar
al seu lloc correcte:

- `profedeeconomia-PRD.md` → mou a `docs/PRD.md`
- `profedeeconomia-migration-map.md` → mou a `docs/migration-map.md`
- `profedeeconomia-CLAUDE.md` → mou a `CLAUDE.md` (arrel del repo)

Llig aquests documents sencers — contenen totes les decisions estratègiques.
ATENCIÓ ESPECIAL a:
- PRD §3 (Estructura del producte: per assignatures)
- PRD §5 (Direcció estètica: editorial sòbria amb to proper)
- CLAUDE.md (Direcció estètica: editorial sòbria amb to proper)

## Objectiu de la sessió

Generar mockups visuals en HTML/CSS de 5 pàgines clau, en 2 variants estètiques,
perquè Pau pugui validar quina prefereix.

NO has de:
- Inicialitzar Astro
- Configurar Tailwind, MDX, Preact
- Crear Content Collections
- Escriure scripts de build
- Refer cap joc

SÍ has de:
- Crear HTML+CSS purs en una carpeta `mockups/`
- Fer servir contingut real (no Lorem Ipsum)
- Mostrar 2 variants estètiques diferents per a comparar

## Les 5 pàgines a mocketar

### Pàgina 1: Home

Estructura:
- Header lleuger (nom del projecte + nav cap a les 4 assignatures + accés a Jocs / Eines docents / Emprenedoria / Oposicions). **NOTA**: l'enllaç "Oposicions" del header és un link extern que apunta a oposicioneseconomia.es (redirect 301). NO hi ha pàgina d'aterratge intermèdia. Visualment al menú apareix com qualsevol altra entrada.
- Hero amb missatge tipus "Material per a impartir economia, empresa i finances a l'institut"
- Secció destacant les 4 ASSIGNATURES com a cards principals (EDMN 2BACH, Eco 1BACH, Eco 4ESO, FOPP 4ESO). Cadascuna ha de tindre un disseny de "coberta editorial" o similar visualment atractiu.
- Secció amb les 3 SECCIONS específiques visibles a la home (Jocs, Eines docents, Emprenedoria). Aquestes amb pes secundari, no central. **NO incloure Oposicions com a secció pròpia a la home** — només viu al menú principal com a link extern.
- Footer simple

### Pàgina 2: Hub d'una assignatura

Mostra l'assignatura EDMN 2BACH (Empresa i Disseny de Models de Negoci, 2n Batxillerat).

Estructura:
- Breadcrumb: Inici > EDMN 2BACH
- Títol gran i descripció breu (què és, currículum LOMLOE)
- 5 sub-apartats amb accés visual: Llibre, Diapositives, Activitats, Tests, Recursos
- Possible secció "destacats" (unitat actual recomanada o similar)

### Pàgina 3: Pàgina d'una unitat dins d'un llibre

Una unitat real del Llibre 1 EDMN 2BACH. Per exemple "Unidad 1: Introducción al modelo de negocio".

Estructura:
- Breadcrumb: Inici > EDMN 2BACH > Llibre > Unidad 1
- Títol gran de la unitat + subtítol
- Metadades: durada estimada, conceptes clau, objectius
- Cos llarg de la unitat amb:
  - Paràgrafs llargs de text
  - Subtítols
  - Llistes
  - Algun callout o quote destacat
  - Una secció amb "fórmula" (proba amb la del punt de mort: Q = CF / (PVU - CVU))
  - Una secció "exemple pràctic" (callout)
  - Bibliografia al final
- Navegació anterior/següent
- Sidebar opcional amb índex de la unitat

Genera contingut real per al llibre — no Lorem Ipsum. Si necessites, basa't en
l'estructura del fitxer `import/edmn-2bach.html` del webpde (que copiaràs des del
repo webpde local: ../webpde/edmn-2bach.html).

### Pàgina 4: Llistat de jocs

La pàgina `/juegos/` amb els 5 jocs principals (stonks, insider, communist party,
econopoly, econrisk) + accés a Playground (10 jocs 2P) + Concurs.

Estructura:
- Header
- Breadcrumb: Inici > Jocs
- Hero amb explicació breu ("Recursos per a fer la classe activa")
- Grid de cards amb cada joc, indicant per quina assignatura és més útil
- Footer

### Pàgina 5: Pàgina d'un joc

Per exemple `/juegos/stonks/`.

Estructura:
- Breadcrumb
- Títol i descripció del joc
- Nivell educatiu recomanat
- Quina assignatura el fa servir més
- Secció "Com funciona" (instruccions per al professor)
- Secció "Què aprenen els alumnes"
- CTA per obrir el joc (botó gran)
- Possible secció "Recomanat per a les unitats: [...]"

## Variants estètiques (NO ÉS PER VALIDAR ENTRE A i B)

Pau ja ha decidit la direcció: **editorial sòbria amb to proper, NO rosa Tailwind
del webpde antic**. Però vol veure dues variants diferents que ambdues compleixen
amb aquesta direcció, per validar matisos:

### Variant A — Editorial pur

- Paleta: off-white (#FAFAF7) + negre profund (#1A1A1A) + accent vermell barroc (#722F37)
- Tipografia: títols Source Serif 4 (serif), cos General Sans (sans humanística)
- Sense gradients, sense ombres pesades, sense emojis
- Inspiració: Princeton University Press, Stripe Press
- To: més formal però amb missatges propers ("Per a la teua aula", "Material que utilitzem")

### Variant B — Editorial càlid

- Paleta: off-white (#FAFAF7) + negre profund (#1A1A1A) + accent verd musc (#5B6C44) + secundari terra càlid (#C19A6B)
- Tipografia: títols Newsreader (serif amb més caràcter), cos Switzer (sans humanística amb personalitat)
- Algun ombrejat subtil per a profunditat, mai gradients
- Sense emojis. Possibles icones SVG personalitzades simples.
- Inspiració: Stratechery, Increment Magazine, A Book Apart
- To: lleugerament més proper, amb subtítols informals ("Allò que ja sabeu")

## Constraints

### Tècnics
- HTML+CSS purs (sense Astro encara, sense framework)
- Una sola pàgina HTML per mockup, autocontinguda (CSS al `<style>` o fitxer extern)
- Carrega tipografies via Google Fonts
- Responsive (mobile-first)
- CSS custom amb variables (no Tailwind)

### Contingut
- Real, no Lorem Ipsum
- En CASTELLÀ
- Dades coherents amb el projecte (4 assignatures concretes, jocs concrets, etc.)
- Per a la pàgina d'unitat: contingut basat en la unitat 1 d'EDMN 2BACH (introducció a models de negoci)

### Estètica
- Cap mascot, cap emoji com a icona, cap gradient
- Espai blanc generós
- Tipografia gran (1.125rem mínim al cos)
- Una sola columna per al contingut llarg de la unitat del llibre
- Sense banners ni CTAs cridaners

## Estructura de fitxers a crear

```
mockups/
├── README.md                     (explicació breu del que hi ha)
├── variant-a/
│   ├── home.html
│   ├── edmn-2bach.html           (hub assignatura)
│   ├── unidad-1.html             (pàgina unitat)
│   ├── juegos.html               (llistat jocs)
│   └── stonks.html               (pàgina d'un joc)
├── variant-b/
│   ├── home.html
│   ├── edmn-2bach.html
│   ├── unidad-1.html
│   ├── juegos.html
│   └── stonks.html
└── compare.html                  (pàgina comparativa amb iframes de les dues variants costat a costat)
```

## Acceptance criteria

1. Existeixen 10 fitxers HTML (5 pàgines × 2 variants) + 1 pàgina compare + 1 README
2. Cadascun és visualment polit i autocontingut
3. Tots fan servir contingut real coherent amb el projecte
4. Variant A i Variant B són clarament diferenciables però ambdues respecten la direcció editorial sòbria
5. El compare.html permet veure les dues variants a la vegada
6. Funciona obrint els fitxers directament al navegador (file:// protocol)

## Out of scope

- Astro, Vite, build systems
- JavaScript interactiu (els mockups poden ser purament estàtics)
- Animacions complexes
- Components reutilitzables (cada mockup és autocontingut)
- Backend
- Anar més enllà de les 5 pàgines mockejades

## Workflow

1. Llig els 3 documents (PRD, CLAUDE.md, migration-map)
2. Mou els 3 documents als seus llocs definitius
3. Esborra `docs-pendientes/`
4. Crea l'estructura de carpetes `mockups/variant-a/` i `mockups/variant-b/`
5. Crea els 5 mockups de Variant A primer, validant visualment cadascun abans de continuar
6. Crea els 5 mockups de Variant B després
7. Crea el `compare.html`
8. Crea el `mockups/README.md` amb instruccions per Pau
9. Commit i push (sense merge a main encara, tot a `dev` o branca específica `feat/mockups`)

## Quan acabes

Reporta'm:
- Tot el que has fet
- Les decisions de disseny no òbvies que has pres a cada variant
- Què recomanes mirar primer al compare.html
- Si has trobat algun problema amb el contingut (per exemple, si el contingut d'`edmn-2bach.html` del webpde no era prou substancial per fer un mockup de la unitat 1)
```

---

## Què ve després d'aquesta sessió

**Pau revisa els mockups** (sessió interactiva amb tu, sense Claude Code):
1. Obre `mockups/compare.html` al navegador i veu les dues variants
2. Decideix quina prefereix, o demana ajustaments híbrids ("Variant A amb el verd de B")
3. Amb la direcció final clara, passem a la **Sessió 2: Setup tècnic**

**Sessió 2 — Setup tècnic complet** (similar al que vam fer amb oposicioneseconomia.es): Astro 5 + integracions + i18n + estructura de carpetes per assignatures + Content Collections + .env + .gitignore + primer commit. **Però amb la direcció estètica ja decidida**, el sistema de disseny es construeix correctament des del primer dia.

**Sessió 3 — Migració dels 8 índexs antics distribuïts a les assignatures** segons el migration-map.

**Sessió 4 — Llibre 1 EDMN 2BACH**: estructura LOMLOE + redacció unitat per unitat.

## Una nota final

Aquesta sessió és la més important del projecte tot i ser la més curta. **Si l'estètica que surt no t'agrada, no facis cap codi de producció encara**. Itera amb Claude Code fins a tindre quelcom que veritablement et representi i diferencï d'Econosublime.

L'objectiu de la sessió és **enamorar-te d'una direcció visual**. Si surts amb dubtes, no està feta. Si surts amb "açò és exactament el que volia", endavant.
