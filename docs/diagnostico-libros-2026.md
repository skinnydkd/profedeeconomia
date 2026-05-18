# Diagnóstico de los 4 libros — Fase 0 (2026-05-18)

> Documento mestre que recull les findings dels 4 diagnòstics individuals realitzats per sub-agents en paral·lel el 2026-05-18, com a Fase 0 del [plan de mejora 2026](./plan-mejora-libros-2026.md).

## Documentos individuals associats

- [`diagnostico-edmn-2bach.md`](./diagnostico-edmn-2bach.md) — 12 units EDMN 2BACH
- [`diagnostico-eco-1bach.md`](./diagnostico-eco-1bach.md) — 12 units Eco 1BACH
- [`diagnostico-eco-4eso.md`](./diagnostico-eco-4eso.md) — 10 units Eco 4ESO
- [`diagnostico-fopp-4eso.md`](./diagnostico-fopp-4eso.md) — 10 units FOPP 4ESO

## Resum executiu

Després de revisar les **44 units** dels 4 llibres (~12.700 línies MDX), el balanç és **positiu però necessita el pla de millora aprovat**:

### Punts forts globals

- **Estructura editorial consistent**: tots els llibres segueixen el mateix patró (frontmatter + lema + H2/H3 + Callout/Curiosity/RealExample/Bibliography + KeyTakeaways). La identitat visual i editorial Variant C funciona.
- **Diferenciadors editorials complerts**: tots els llibres tenen 2-3 diferenciadors documentats al curriculum doc i els compleixen *de veritat*, no es queden a mitges:
  - EDMN: profundització doctrinal Bloque A, calculadores VAN/TIR/Ratios/PuntoMuerto
  - Eco 1BACH: economia del comportament Unit 2, simulador AD-AS Unit 8
  - Eco 4ESO: consum digital responsable Unit 5, economia personal pràctica Unit 8 amb calculadora de nòmina
  - FOPP 4ESO: cartografia sistema educatiu Unit 5, drets laborals concrets Unit 8, kit cerca empleo Unit 9 amb BuscadorItinerarios + GeneradorCV
- **To davant temes sensibles** (suïcidi, dismòrfia digital, relacions tòxiques, bullying en FOPP) és **adequat i honest**, amb recursos públics (024 / ANAR / 016) ben col·locats.
- **SolvedExercises ben construïts** als units quantitatius (especialment FOPP Unit 8 vacances proporcional contracte 3 mesos — el millor de tot el rebranding).

### Tres problemes crítics transversals

Aquests apareixen a múltiples llibres i necessiten resolució urgent a **Fase 1**:

#### 1. Cifras desactualizadas (2023-2024) que necessiten passar a 2025-2026

Volum estimat: **80-100 cifres** distribuides per tots 4 llibres. Especialment crític a Eco 1BACH (~30-40 cifres macro: PIB, IPC, paro EPA, déficit, deuda, tipus BCE, Euribor, SMI). Cifres econòmiques de 2023-2024 perceptibles com a "antigues" a setembre 2026 quan llancem.

**Acció Fase 1**: sweep complet amb fonts oficials (INE, Eurostat, BdE, AIReF, BCE, AEAT) data actualitzada a abril-maig 2026.

#### 2. Inconsistències internes entre units del mateix llibre

Casos detectats:

- **Eco 4ESO**: Wallapop apareix amb 17M usuaris a Unit 4 i 19M a Unit 6. Airbnb amb 80MM$ a Unit 4 i 90MM$ a Unit 9. Glovo barri inicial Eixample a Unit 9 i Sant Cugat a Unit 6.
- **FOPP 4ESO**: SMI Unit 7 diu 2024-2025=1.184€, Unit 8 diu 2026=1.184€ (mateix valor, dates contradictòries). Harvard Grant Study amb xifres inconsistents (Unit 1 = 268 persones / Unit 10 = 724).
- **Eco 1BACH**: cas Bankia preferentes citat complet a U3 i U10 (comprimir un); Card-Krueger SMI repetit a U1/U2/U5/U9 (mantenir complet només a U9).

**Acció Fase 1**: reconciliar tots els cassos i datasets per crear coherència interna verificable.

#### 3. Repeticions / solapaments cross-llibres a decidir

Casos més importants:

| Cas/concepte | Llibres | Decisió necessària |
|---|---|---|
| **Mercadona** | EDMN U1, U6, U11 + Eco 1BACH U4 | EDMN U6 owner, retallar a U1/U11 |
| **Inditex** | EDMN U1, U2, U6, U7 | EDMN U7 owner (just-in-time) |
| **Glovo / Ley Rider** | EDMN U1, U2, U4 + FOPP U8 | EDMN U1 pivote + FOPP U8 enfocament drets |
| **Schumpeter / destrucció creativa** | EDMN U1 + verificar Eco 1BACH | EDMN únic |
| **DAFO** | EDMN U3 + FOPP U1 | Mantenir tots dos (empresarial vs personal — complementaris) |
| **PESTEL** | EDMN U6 + Eco 4ESO U4 | Mantenir tots dos (curricular vs simplificat per ESO) |
| **Business Model Canvas** | EDMN U10 + Eco 4ESO U9 | Mantenir tots dos (Bach vs ESO simplificat) |
| **Nómina/contratos/IRPF** | Eco 4ESO U8 + FOPP U8 | **DECISIÓ CRÍTICA**: Eco 4ESO manté detall cotitzacions + càlcul; FOPP es queda amb drets exigibles + PRL + sindicats + treballador menor 18 |
| **Bizum** | EDMN + Eco 1BACH U10 + Eco 4ESO + FOPP | Distribuit acceptable |
| **Kahneman** | Eco 1BACH U2 (econ. comportament) + FOPP U4 (decisions vitals) | Mantenir tots dos (perspectives distintes) |
| **Card-Krueger SMI** | Eco 1BACH U1/U2/U5/U9 + Eco 4ESO U5 | Eco 1BACH U9 únic complet, retallar resta |
| **DIRCE tejido empresarial** | EDMN U1 + Eco 4ESO U1 | Mantenir tots dos |

**Acció Fase 1**: aplicar les decisions de la taula, retallant on toca i deixant cross-references explícites.

### Quatre problemes específics que requereixen atenció Fase 1

#### 1. Error factual confirmat: cronologia Borden/McCarthy a EDMN U6

L'unit 6 EDMN té un Curiosity sobre l'origen del màrqueting mix que inverteix la cronologia entre McCarthy (1960) i Borden (1964). **Cal corregir immediatament**.

#### 2. Possibles cites apòcrifes/dubtoses

- "El cervell processa visual 30x més ràpid" (Eco 4ESO U5)
- Frase atribuïda a Pacioli (EDMN U10)
- Atribució de l'elevator pitch a Rosenzweig (EDMN U12)
- Caso Bitwise (Eco 4ESO U1 — possiblement inventat pel sub-agent)
- Multa AEPD Renfe 30.000€ (Eco 4ESO U5)

**Acció**: verificar cadascun amb font primària. Si no es pot, eliminar.

#### 3. Nom de menor d'edat sense anonimitzar (FOPP U3)

El cas de ciberbullying menciona "Kamila Tarriño" — menor de 12 anys condemnada per ciberbullying. **Risc legal**. Anonimitzar abans del setembre 2026.

#### 4. Recursos Preact com a diferenciadors: necessiten auditoria tècnica

- **ADASSimulator** (Eco 1BACH U8): model lineal simplificat — per Bachillerato podria ser massa simple.
- **BuscadorItinerarios** (FOPP U5): 8 itineraris hardcodejats — l'oferta real és més rica.
- **GeneradorCVEuropass** (FOPP U9): no genera PDF descarregable real (només window.print()).
- **CalculadoraNominaESO** (Eco 4ESO U8): IRPF tramos simplificats sense reducción per hijos/discapacidad.

**Acció Fase 4**: auditar els 4 simuladors/calculadores i robustir abans de promocionar-los públicament com a diferenciadors editorials.

## Backlog priorizado per a les Fases 1-4

### Fase 1 — Quick wins editorial (eje A) — sessions 2-3

**Sessió 2 (2026-05-25): EDMN + Eco 1BACH**

EDMN:
- [ ] Corregir error Borden/McCarthy U6
- [ ] Sweep cifras 2023-2024 → 2026 (Mercadona, Inditex, Carrefour, Mondragón, Cabify, Filmin, Wallapop, Holaluz, BCE, teletrabajo, productividad)
- [ ] Actualitzar edicions bibliografia (Brealey 13→14, Kotler 15→16, Berk-DeMarzo 5→6, Amat 10→11, Higgins 12→13, Wild 24→26, Mullins 4→5)
- [ ] Verificar/eliminar cites apòcrifes (visual 30x, Pacioli, Rosenzweig)
- [ ] Retallar repeticions cross-libros: Mercadona/Inditex/Glovo segons taula

Eco 1BACH:
- [ ] **SWEEP MASIU CIFRAS MACRO 2026** (PIB, IPC, paro EPA, déficit/deuda, BCE tipus, Euribor, SMI — ~30 cifres distribuides per U3, U7, U10, U11)
- [ ] Acortar Units 10/11/12 que superen 38KB del CLAUDE.md
- [ ] Reconciliar Bankia preferentes (eliminar duplicat U3 o U10)
- [ ] Reconciliar Card-Krueger (mantenir només U9)
- [ ] Reconciliar cuota hipoteca (diferenciar perspectiva U3 vs U11)

**Sessió 3 (2026-06-01): Eco 4ESO + FOPP 4ESO**

Eco 4ESO:
- [ ] Reconciliar Wallapop 17M ↔ 19M, Airbnb 80MM ↔ 90MM, Glovo Eixample ↔ Sant Cugat
- [ ] Verificar caso Bitwise (eliminar si inventat)
- [ ] Verificar multa AEPD Renfe 30.000€
- [ ] Limitar Airbnb a UNA aparició principal, Wallapop a UNA
- [ ] Actualitzar SMI, MEI 2026, tramos IRPF, mínimo personal, cuota autónomos
- [ ] Crear plantilla descarregable "diario de molestias"

FOPP 4ESO:
- [ ] **ANONIMITZAR Kamila Tarriño** (Unit 3) — risc legal urgent
- [ ] Reconciliar SMI Unit 7 vs Unit 8 (data correcta 2026)
- [ ] Reconciliar Harvard Grant Study 268 vs 724 persones
- [ ] **APLICAR SPLIT NÒMINA/CONTRACTES amb Eco 4ESO Unit 8** (vegeu decisió taula): FOPP es queda amb drets exigibles + PRL + sindicats + treballador menor 18; Eco 4ESO manté detall cotitzacions + càlcul nòmina
- [ ] Reconciliar Haidt (Unit 2 + 3) i Kahneman (Unit 2 + 4) — un owner cada concept
- [ ] Verificar 25-30 cifras macro flagged (Units 6, 7, 8)

### Fase 2 — Profundització pedagògica (eje B) — sessions 4-7

Aplicar a TOTS els units dels 4 llibres:

- [ ] Header amb reading time + pre-requisits + objectius checklist visual
- [ ] Glossari de 8-12 termes clau per unit
- [ ] Secció "Para profundizar" amb 3-5 lectures opcionals
- [ ] 2-3 preguntes de reflexió obertes al final
- [ ] SolvedExercises addicionals on falta: EDMN U1, U2, U8, U12; Eco 1BACH U5, U7, U8; Eco 4ESO U7; FOPP U8
- [ ] Reforç dels capstones integradors (Units 12 EDMN/Eco1B, Units 9-10 Eco4ESO/FOPP)

### Fase 3 — Visualidad editorial (eje C) — sessions 8-10

**Sessió 8: auditoria i substitució d'imatges febles + varietat visual** (afegit per Pau 2026-05-18)

Top imatges flagged a substituir per cada llibre (~15 totals):
- EDMN: detectades 2-3 per agent (vegeu diagnòstic EDMN)
- Eco 1BACH: 3-5 imatges (vegeu diagnòstic Eco 1BACH)
- Eco 4ESO: 5 imatges genèriques (vegeu diagnòstic Eco 4ESO)
- FOPP: 10-12 imatges, especialment stock genèric a Units 1, 3, 4, 9, 10

**Variants noves del component `<Figure>` per a evitar monotonia visual** (actualment tot és `default` + `aspectHint` similar):
- `variant="left"` / `variant="right"` — flotants amb text wraparound
- `variant="half"` — 50% amplada
- `variant="full"` — bleed-style, trenca el marge
- `variant="inline-small"` — portraits xicotets inline

Distribució objectiu per llibre: 40% default + 20% wide/full + 15% flotants + 15% tight + 10% inline-small. Verificar comportament print (paged.js).

**Sessió 9: 18-22 nous diagrames SVG**

EDMN (6-8 nous):
- Balance en masas patrimonials (U10)
- Waterfall P&G (U10)
- Fondo de maniobra (U11)
- Piràmide DuPont (U11)
- TAM/SAM/SOM (U12)
- Cascada finançament FFF→VC (U9)
- Taula 4 processos productius (U7)
- Value Proposition Canvas (U5)

Eco 1BACH (5 nous):
- Teoría Prospectiva Kahneman (U2)
- Interés compuesto visualizat (U3)
- Excedents/peso muerto (U5)
- Matriu rivalitat×exclusió bens públics (U6)
- Descomposició Solow (U8)

Eco 4ESO (6 nous):
- (Per detallar a Fase 0 sub-diagnostic)

FOPP (8-10 nous):
- Gardner 8 intel·ligències (U1)
- Sesgos 2×2 (U4)
- Fórmula EBAU visual (U6)
- Tarta sectors econòmics (U7)
- Mètode STAR (U9)
- Ruta reclamació laboral (U8)
- Top 4 itineraris post-ESO (U5)
- Ikigai 4 cercles (U1)

**Sessió 10: portades PDF + tipografia print**

- Disseny portades dignes (no només cubertes simples) per a cada PDF (4 portades)
- Tuneig paged.js: widows/orphans, hyphenation, floats
- Re-renderitzat dels 4 PDFs

### Fase 4 — Interactividad ampliada (eje D) — sessions 11-13

**Sessió 11: auditoria tècnica + millora dels 4 recursos existents**

- ADASSimulator: ampliar a model més realista per Bachillerato (afegir tipus interès, expectatives, brecha producción visualitzada)
- BuscadorItinerarios: expandir de 8 a 16-20 itineraris, afegir filtres per CCAA
- GeneradorCVEuropass: investigar afegir generació PDF real (jsPDF o pdfmake) per descàrrega
- CalculadoraNominaESO: afegir paràmetres per hijos, discapacidad, deduccions

**Sessions 12-13: 6-8 calculadoras/simuladors nous**

EDMN:
- Calc. DCF (Discounted Cash Flow) complet
- Calc. ratios financers amb benchmarks sectorials

Eco 1BACH:
- Calc. elasticitat amb gràfic
- Calc. multiplicador del gasto amb visualització AD-AS

Eco 4ESO:
- Calc. IRPF declaració real
- Calc. coste vehicle propi vs alquiler

FOPP:
- Quiz vocacional RIASEC Holland 30 preguntes
- Calc. presupost universitat 4 anys

**Sessió 13 (continuada): funcionalitats transversals**

- Persistència localStorage: scores tests, notes per unit, bookmarks
- Timelines interactives (Eco 1BACH U12 UE, FOPP U5 itineraris)
- Hover tooltips sobre elements de diagrames

## Mètriques que validarem al final de cada fase

### Fase 1 ✓
- [ ] Zero cifras anteriors a 2024 sense actualitzar
- [ ] Zero cites legals errònies o sense article exacte
- [ ] Cap repetició cross-libros (segons taula de decisions)
- [ ] Cap inconsistència interna detectada per relectura
- [ ] Kamila Tarriño anonimitzada
- [ ] Error Borden/McCarthy corregit

### Fase 2 ✓
- [ ] Cada unit té reading time + pre-requisits + objectius checklist
- [ ] Cada unit té glossari (8-12 termes)
- [ ] Cada unit té "Para profundizar" (3-5 lectures)
- [ ] Cada unit té preguntes de reflexió (2-3)
- [ ] Tots els capstones reforçats

### Fase 3 ✓
- [ ] 15+ imatges febles substituïdes
- [ ] 18-22 nous diagrames SVG integrats
- [ ] Portades de PDF de qualitat editorial
- [ ] Build verde, tots els 4 PDFs regenerats amb noves portades

### Fase 4 ✓
- [ ] 4 recursos existents auditats i millorats
- [ ] 6-8 calculadoras nous funcionant
- [ ] Persistència localStorage activada
- [ ] 2-3 timelines interactives
- [ ] Build verde

## Recomanació de pre-Fase 1

Abans d'iniciar la Fase 1 (sessió 2, prevista per al 2026-05-25), Pau hauria de validar i mergear els 4 PRs de llibres a main:

- **PR #24** (image rollout EDMN) → main
- **PR #25** (Eco 1BACH foundation) → main (requereix rebase mecànic després de #24)
- **PR #26** (Eco 4ESO foundation) → main (requereix rebase mecànic després de #25)
- **PR #27** (FOPP 4ESO foundation) → main (requereix rebase mecànic després de #26)

Aquesta PR (#28 — pla i diagnòstic) pot mergear-se en paral·lel sense conflictes. **Recomanat ordre final**: #24 → #25 → #26 → #27 → #28.

Sense aquest pre-pas, les fases 1-4 tindran conflictes amb les PRs encara obertes i caldria reaplicar canvis.

## Pròxim pas immediat

Pau revisa aquest diagnòstic + el plan de mejora. Si tot OK:

1. Mergea els 4 PRs de llibres en ordre (~30 min)
2. Mergea aquesta PR (pla + diagnòstic)
3. Comencem Fase 1 a la sessió 2 (prevista 2026-05-25)
