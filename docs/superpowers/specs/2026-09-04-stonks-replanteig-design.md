# Spec de disseny — Stonks, replanteig (finestra aleatòria 1971-2025, semestres, actius a cegues)

> Estat: **validat amb Pau** (brainstorming 2026-09-04), pendent de pla d'implementació.
> Primer dels tres replantejos de jocs decidits eixe dia. Els altres dos —
> Econrisk («La batalla de les idees») i Econopoly («les dues taules de Magie») —
> tenen spec propi i es fan després, en eixe ordre.
> Idioma del doc: valencià (planificació). Codi/paths en anglès; contingut del joc en castellà.

## 1. Resum i objectiu

Stonks funciona però està curt de mires: 25 anys **fixos** (2000-2024), 8 actius, una decisió
a l'any, i cap tractament de la inflació ni dels costos d'operar. Aquest replanteig el
converteix en un simulador de **50 semestres dins d'una finestra de 25 anys sortejada entre
1971 i 2025**, amb un catàleg d'actius més ample (incloses **empreses individuals a cegues**),
**fricció real** en moure la cartera, i el **poder adquisitiu sempre a la vista.**

Objectiu pedagògic, en una frase: que l'alumne descobrisca que **guanyar diners i guanyar poder
de compra no són el mateix**, que **moure la cartera costa**, i que **decidir amb informació
parcial** és la feina real de l'inversor — no encertar amb el diari de demà a la mà.

## 2. Context — què falla ara

Lectura de `src/lib/games/stonks/{engine,data,types,ai}.ts` i de les 5 pantalles:

- **Finestra fixa 2000-2024.** Es rejuga sempre el mateix segle. Qui l'ha jugat una vegada ja
  sap que el 2008 cau i que el bitcoin del 2013 fa ×55.
- **`unlockRound` és per ronda, no per data** (`data.ts`). El bitcoin es desbloqueja «a la ronda
  8» encara que la ronda 8 siga el 2008, i l'IBEX «a la ronda 3». La disponibilitat d'un actiu
  no té res a veure amb la seua història real.
- **Rebalanceig gratuït i total.** `advanceYear()` reassigna el 100 % del patrimoni cada ronda
  sense comissions ni impostos. Amb 25 rondes ja era generós; amb 50 semestres seria un
  exercici d'optimització amb visió retrospectiva.
- **Zero inflació.** El joc premia els depòsits d'un període d'IPC alt sense dir mai que s'hi
  perd poder de compra. Si estenem fins al 1971 — dos xocs del petroli i IPC espanyol de dos
  dígits fins al 1986 — sense inflació el joc **ensenya el contrari** del que ha d'ensenyar.
- **Ingressos i imprevistos nominals fixos** (3.000 €/ronda). Amb finestra variable, 3.000 € el
  1971 i 3.000 € el 2024 no són la mateixa quantitat ni de lluny.
- **Lliçons finals genèriques**: sis frases fixes idèntiques per a tothom, sense relació amb el
  que ha fet el jugador.

## 3. Decisions validades (2026-09-04)

| Decisió | Tria |
|---|---|
| Empreses individuals | **A cegues**, revelades a la pantalla final |
| Freqüència i fricció | **Semestral amb cost de moure** (comissió + plusvàlues) |
| Repartiment semestral | **Geomètric + forma real als anys documentats** |
| Inflació | **Visible sempre**, nominal i real en paral·lel |
| Fidelitat de les dades | **Sèries anuals reals** (no auditades), repartiment documentat |
| Sorteig d'empreses | **5 de 9 per partida**, garantint una estrella i un desastre |
| Ingressos | **Indexats a l'IPC**, ancorats a l'any inicial de la finestra |

Les dues últimes són afegits proposats en el brainstorming i aprovats per Pau.

## 4. Abast

### Dins d'abast

- Reescriptura de la lògica pura (`types`, `engine`, `ai`, nou `money`) i del catàleg de dades.
- Finestra aleatòria de 25 anys / 50 semestres; disponibilitat d'actius **per data real**.
- 18 actius al catàleg; ~10-14 en pantalla segons època.
- 9 empreses individuals amb perfil anònim durant la partida i revelació final.
- Comissions esglaonades per època + plusvàlues per trams de la base de l'estalvi.
- IPC espanyol 1971-2025; patrimoni nominal i real a totes les pantalles.
- Fitxes profundes per actiu (modal en desbloquejar + botó de rellegir).
- 110 titulars semestrals 1971-2025.
- Pantalla final amb revelació de noms, doble corba i **lliçons generades de la partida**.
- Castellà; overlay valencià complet i cobert pel test de paritat existent.
- Persistència local (reprendre partida) — inclou la finestra i les empreses sortejades.

### Fora d'abast

- Multijugador, rànquings globals, comptes.
- Dades intradiàries o mensuals; el gra mínim és el semestre.
- Divises, apalancament, derivats, curt.
- Fiscalitat autonòmica, mínims exempts, compensació de pèrdues entre exercicis.
- Rediseny visual del joc: es manté la carcassa `sk-phone` i l'estètica Variant C.

## 5. Model temporal

```
startYear ~ Uniform{1971 … 2001}        // 31 finestres possibles, final sempre ≤ 2025
round r ∈ [0, 49]
year(r)  = startYear + floor(r / 2)
half(r)  = r % 2                        // 0 = 1r semestre, 1 = 2n semestre
```

La finestra es sorteja en començar i es mostra en una pantalla d'introducció abans de la
primera notícia («Te ha tocado 1978-2002») amb dues línies de context històric del període.
Forma part de l'estat persistit: reprendre una partida reprén la mateixa finestra.

## 6. Catàleg d'actius

### 6.1 Base — 9 actius, disponibilitat per data real

| id | Etiqueta ES | Risc | Disponible des de |
|---|---|---|---|
| `efectivo` | Efectivo | baja | 1971 H1 |
| `deposito` | Depósito a plazo | baja | 1971 H1 |
| `deuda` | Deuda pública española | baja | 1971 H1 |
| `oro` | Oro | media | 1971 H1 |
| `vivienda` | Vivienda en España | media | 1971 H1 |
| `bolsa_es` | Bolsa española | alta | 1971 H1 |
| `sp500` | Bolsa de EE. UU. | alta | 1971 H1 |
| `mundial` | Bolsa mundial | alta | 1971 H1 |
| `bitcoin` | Criptomoneda | extrema | 2011 H1 |

`bolsa_es` és l'Índex General de la Borsa de Madrid fins al 1991 i l'IBEX 35 des del 1992; la
fitxa de l'actiu ho diu explícitament perquè el canvi de referència no siga una trampa amagada.

### 6.2 Empreses — 9 al catàleg, 5 sortejades per partida

Durant la partida es veu **només el perfil**. El nom apareix a la revelació final.

| id | Perfil visible ES | Des de | Fins a | Nom revelat |
|---|---|---|---|---|
| `e_apple` | Electrónica de consumo · EE. UU. · sale a bolsa en 1980 | 1981 H1 | — | Apple |
| `e_msft` | Software · EE. UU. · sale a bolsa en 1986 | 1986 H2 | — | Microsoft |
| `e_amzn` | Comercio electrónico · EE. UU. · sale a bolsa en 1997 | 1997 H2 | — | Amazon |
| `e_nvda` | Semiconductores · EE. UU. · sale a bolsa en 1999 | 1999 H1 | — | Nvidia |
| `e_itx` | Textil · España · sale a bolsa en 2001 | 2001 H2 | — | Inditex |
| `e_nokia` | Telefonía móvil · Finlandia · cotiza desde 1994 | 1994 H1 | — | Nokia |
| `e_terra` | Portal de internet · España · sale a bolsa en 1999 | 1999 H2 | 2005 H2 | Terra |
| `e_enron` | Energía · EE. UU. · cotiza desde 1986 | 1986 H1 | 2001 H2 | Enron |
| `e_popular` | Banca · España · cotiza desde 1971 | 1971 H1 | 2017 H1 | Banco Popular |

**Mort d'una empresa.** Cada empresa amb `fins a` porta un camp `finalReturn` que s'aplica en
eixe semestre; després la posició queda a zero i l'actiu desapareix del taulell. No totes moren
igual: Enron i Banco Popular valen **−100 %** (accions a zero), mentre que Terra va ser
**absorbida** el 2005 a un preu ridícul enfront del seu màxim del 2000 — el seu `finalReturn` és
molt negatiu però no −1. La pèrdua és **realitzada**: compensa plusvàlues del mateix semestre.
És el moment més memorable del joc i ha d'anar acompanyat d'una nota a la pantalla de resultat.

**Sorteig.** Candidates = empreses amb `desde` ≤ final de la finestra. Se'n trien 5 amb dues
garanties, per ordre de prioritat:

1. Com a mínim **una empresa que muira dins de la finestra** (`fins a` dins del rang jugat). Si
   no n'hi ha cap de possible — p. ex. una finestra 1971-1995, on ningú no mor —, la garantia
   decau i no es força res.
2. Com a mínim **una estrella** (`apple, msft, amzn, nvda, itx`) disponible dins la finestra.

Si hi ha menys de 5 candidates, s'agafen totes. El sorteig es fa en començar i es persisteix amb
l'estat.

## 7. Dades: fidelitat i honestedat

**Açò és el risc principal del projecte i s'assumeix per escrit.** Les sèries les redacte jo del
meu propi coneixement: seran coherents i properes a la realitat, però **no auditades contra una
font primària**.

Compromisos que ho fan acceptable:

1. **Capçalera de fonts** a `data/market.ts` i `data/inflation.ts`: per a cada sèrie, quina és la
   referència de mercat (índex concret, base, divisa, si inclou dividends) i el fet que les
   xifres estan arredonides.
2. **Tot en euros i amb dividends reinvertits** on l'actiu en pague; declarat sèrie a sèrie. Les
   sèries estrangeres van **sense cobertura de divisa** (és el que li passa a un inversor
   espanyol de veres) i la capçalera ho diu.
3. **Nota visible al joc**, a la pantalla final i a la fitxa de qualsevol actiu: «Rendimientos
   anuales históricos redondeados; el reparto semestral sigue el método documentado».
4. **Invariant testejat**: per a cada any i actiu, el producte dels dos semestres ha de
   reproduir el rendiment anual publicat. Cap forma intraanual pot alterar el total de l'any.

Si en algun moment Pau aporta CSV verificats (Yahoo Finance, Investing, INE per a l'IPC), el
canvi és substituir els fitxers de `data/` sense tocar l'engine — motiu suficient per mantindre
les dades separades de la lògica.

### 7.1 Repartiment semestral

Per defecte, repartiment **geomètric**: cada semestre val `√(1+r) − 1`. No inventa volatilitat i
és trivial de verificar.

Per a una **llista tancada i documentada** d'anys en què la forma intraanual *és* la lliçó,
s'usen semestres reals a `data/market.ts` (camp `halves`). Llista inicial, ampliable amb
justificació al codi:

| Any | Per què | Actius afectats |
|---|---|---|
| 1973-1974 | Xoc del petroli i crac borsari | borses, or |
| 1987 | Dilluns Negre (octubre → 2n semestre) | borses |
| 2000 | La punta de les puntcom és al març | borses, tecnològiques |
| 2008 | Bear Stearns (H1) vs Lehman (H2) | tot |
| 2020 | Crac de març i recuperació en V | tot |
| 2022 | La pujada de tipus colpeja abans els bons | bons, borses, cripto |

## 8. Model econòmic

### 8.1 Fricció en moure la cartera

**La fricció es cobra sobre el moviment, no sobre la cartera.** L'engine actual reassigna el
100 % del patrimoni cada ronda; a partir d'ara ha de calcular el **delta** entre la posició
actual i la que demana l'assignació, i cobrar només sobre eixe delta. Sense això, mantindre una
cartera quieta pagaria comissions cada semestre i la lliçó s'invertiria.

**Comissió** sobre l'import comprat i sobre l'import venut, esglaonada per època — la caiguda
del cost d'operar és història econòmica real i mereix veure's:

| Període | Comissió |
|---|---|
| ≤ 1990 | 1,0 % |
| 1991-2010 | 0,5 % |
| ≥ 2011 | 0,2 % |

**Plusvàlues.** En vendre amb guany es tributa per trams de la base de l'estalvi: 19 % fins a
6.000 €, 21 % fins a 50.000 €, 23 % per damunt. Les pèrdues realitzades del **mateix semestre**
compensen els guanys; el que sobra **es perd** (simplificació documentada: la llei real permet
compensar durant quatre exercicis).

**Cost d'adquisició.** Cada posició guarda `{ value, cost }`. En vendre parcialment, el cost es
redueix proporcionalment — **cost mitjà**, no FIFO. És una simplificació documentada: la norma
espanyola per a accions és FIFO, però FIFO obligaria a portar lots i no canvia la lliçó.

**El que no toques no paga res.** Eixa és la regla que fa que comprar i mantindre guanye sol,
sense haver-ho de predicar a la pantalla final.

### 8.2 Inflació i termes reals

IPC espanyol anual 1971-2025 a `data/inflation.ts`, repartit en semestres geomètricament.

- **Deflactor ancorat a `startYear`**: `real(t) = nominal(t) / índex(t)`, amb `índex(startYear) = 1`.
- Cada pantalla amb patrimoni mostra les dues xifres: euros corrents i «en poder adquisitiu de
  {startYear}».
- La corba final pinta **dues línies del jugador** (nominal i real) i la de la IA.

### 8.3 Ingressos, capital inicial i imprevistos

Tots definits en **euros de l'any inicial** i convertits a euros corrents amb l'IPC:

- `INITIAL_CASH = 5.000 €` (de `startYear`)
- `INCOME_PER_SEMESTER = 3.000 €` (de `startYear`)
- Imprevistos: mateixa taula d'ara, imports en euros de `startYear`, probabilitat **20 %** per
  semestre (abans 30 % anual; amb 50 rondes, 30 % en dispararia 15 per partida).

Així la partida comença sempre amb 5.000 € visibles, isca la finestra que isca, i el creixement
nominal dels ingressos al llarg dels 25 anys és **part del que s'aprén**.

**No hi ha camp `cash` separat.** `efectivo` és un actiu més del taulell: hi entren els ingressos
i d'ací ixen els imprevistos. El que entra per ingressos entra amb `cost = value` (no és cap
plusvàlua latent). Això elimina la duplicitat actual entre `state.cash` i `holdings.efectivo`.

**Si un imprevist no cap a `efectivo`**, es liquida la resta **proporcionalment** entre les
posicions, amb les seues comissions i els seus impostos. És dur i és exactament el que passa a la
vida real quan no tens coixí de liquiditat: acabes venent en el pitjor moment. La pantalla de
resultat ho ha de dir amb eixes paraules.

### 8.4 «El Mercat» (la IA)

Canvia de l'S&P 500 a l'**índex mundial** — és el que de veres significa «el mercat», i evita
premiar l'excepcionalitat nord-americana com si fora una llei natural.

Regles: cada semestre inverteix tots els seus ingressos a `mundial`, **paga la mateixa comissió**
que el jugador i **no ven mai**. Al final de la partida, **jugador i IA liquiden i tributen per
les plusvàlues latents**, perquè la comparació siga homogènia. Que la IA haja diferit l'impost
25 anys i el jugador no, si ha estat movent-se, és exactament la diferència que s'ha de veure.

## 9. Fitxes profundes

Modal en desbloquejar cada actiu per primera vegada, i botó ⓘ a cada fila per rellegir-la.
Estructura fixa de cada fitxa (≈150-200 paraules):

1. **Què és** — el mecanisme, no la definició de diccionari.
2. **D'on ix el rendiment** — interés, dividends, lloguers, revaloració, escassetat.
3. **Quin risc concret té** — què l'ha fet caure històricament.
4. **Un fet del període** — ancorat a la finestra que s'està jugant quan siga possible.
5. **Per a què no serveix** — l'apartat que cap fullet comercial escriu.

Per a les empreses, la fitxa és de **dues peces**:

- En desbloquejar: una fitxa **compartida** sobre què vol dir comprar accions d'una sola empresa
  (risc específic vs diversificat, per què un índex no és el mateix), més el **perfil anònim**.
- A la revelació final: la **història real** de l'empresa, amb el que va passar i per què.

Total de contingut: 9 fitxes base + 1 fitxa de classe + 9 perfils + 9 revelacions = **28 peces**
en castellà, més l'overlay valencià.

## 10. Pantalles

| Pantalla | Estat | Canvi |
|---|---|---|
| `StartScreen` | existent | Copy nou (finestra aleatòria, no «2000-2024») |
| `WindowIntro` | **nova** | Finestra sortejada + dues línies de context del període |
| `NewsScreen` | existent | Titular **semestral**, no anual |
| `AllocateScreen` | existent | Grups (Seguro / Bolsa / Empresas), ⓘ per fila, patrimoni nominal **i real**, i **previsualització del cost** del canvi abans de confirmar |
| `AssetCardModal` | **nova** | Fitxa profunda |
| `ResultScreen` | existent | + comissions i impostos pagats, + mort d'empresa, + real |
| `RevealScreen` | **nova** | Revelació dels noms i història de les 5 empreses |
| `FinalScreen` | existent | Doble corba, i **lliçons generades de la partida** |

La previsualització del cost a `AllocateScreen` no és un adorn: sense ella la fricció es percep
com una fuga inexplicable de diners i deixa d'ensenyar res.

**Lliçons generades.** Es substitueixen les sis frases fixes per regles que miren la partida:
percentatge mitjà en actius de risc baix durant trams d'IPC alt, nombre de moviments i cost
acumulat, concentració màxima en una sola empresa, i comparació nominal vs real. Les frases
genèriques que sobrevisquen han de ser certes per a *eixa* partida.

## 11. Tipus (esbós)

```ts
type Half = 0 | 1;
interface Position { value: number; cost: number; }   // cost mitjà

interface GameState {
  startYear: number;                  // 1971..2001
  round: number;                      // 0..49
  stocks: AssetId[];                  // les 5 empreses sortejades
  seenCards: AssetId[];               // fitxes ja mostrades
  holdings: Record<AssetId, Position>;// inclou `efectivo`; no hi ha camp `cash`
  allocation: Record<AssetId, number>;// % de la ronda en curs
  ai: { value: number; cost: number };
  lastEvent: LifeEvent | null;
  lastReturns: Record<AssetId, number | null> | null;
  lastCosts: { commission: number; tax: number } | null;
  lastDeath: AssetId | null;
  history: { year: number; half: Half; nominal: number; real: number; ai: number }[];
  phase: 'start' | 'intro' | 'news' | 'allocate' | 'results' | 'reveal' | 'finished';
}
```

## 12. Estructura de fitxers

```
src/lib/games/stonks/
  types.ts              # reescrit
  money.ts              # NOU: comissions, plusvàlues, deflactor
  engine.ts             # reescrit: sorteig de finestra i empreses, avanç semestral
  ai.ts                 # reescrit: DCA mundial amb comissió, tributa al final
  data/index.ts         # constants + reexports
  data/assets.ts        # catàleg, disponibilitat per data, perfils anònims, noms revelats
  data/market.ts        # rendiments anuals 1971-2025 + overrides semestrals
  data/inflation.ts     # IPC espanyol 1971-2025
  data/news.ts          # 110 titulars semestrals
  data/cards.ts         # 28 fitxes profundes
  data/life-events.ts
  *.test.ts

src/components/games/stonks/
  StonksGame.tsx        # màquina d'estats ampliada
  WindowIntro.tsx       # NOU
  AssetCardModal.tsx    # NOU
  RevealScreen.tsx      # NOU
  {Start,News,Allocate,Result,Final}Screen.tsx, EvolucionChart.tsx, stonks.css

src/i18n/games/stonks-ca.ts        # overlay VAL, creix molt
src/i18n/games/content-parity.test.ts  # ampliar als nous conjunts
src/lib/juegos.ts                  # descripció de la targeta del hub
```

`data.ts` es trenca en carpeta perquè el catàleg passa de ~120 línies a ~1.500 (110 titulars,
28 fitxes, matriu de 18 actius × 55 anys). Mantindre-ho en un fitxer faria impossible revisar
les dades sense obrir la lògica.

## 13. Persistència

`makeGameStorage('stonks')`, com ara. **L'estat guardat ha d'incloure `startYear` i `stocks`**:
sense això, reprendre una partida en sortejaria una de nova i el jugador es trobaria una altra
finestra. Les partides guardades amb el format antic no es poden migrar → en carregar, si falta
`startYear`, es descarta el desat i es comença de nou.

## 14. Testing (TDD)

Lògica pura, vitest, patró de `src/lib/games/*/**.test.ts`:

- **Finestra**: sempre 25 anys; `startYear ∈ [1971, 2001]`; final ≤ 2025.
- **Sorteig d'empreses**: exactament 5 (o totes les candidates si en són menys); ≥1 estrella;
  ≥1 morta; totes disponibles dins de la finestra.
- **Repartiment semestral**: `(1+h1)(1+h2) = 1+anual` per a **tots** els anys i actius, tant els
  geomètrics com els que porten forma real. És l'invariant que protegeix la fidelitat.
- **Comissions**: el tram correcte per any; s'aplica a compres i a vendes; **una cartera que no
  es mou paga zero** (el test que protegeix la lliçó central).
- **Liquidació forçada**: un imprevist més gran que `efectivo` ven la resta proporcionalment i
  cobra comissió i impost; si `efectivo` el cobreix, no es toca res més.
- **Plusvàlues**: trams 19/21/23; pèrdues del semestre compensen guanys; el sobrant es perd;
  cost mitjà reduït proporcionalment en vendes parcials.
- **Deflactor**: `índex(startYear) = 1`; real = nominal quan l'IPC és zero; ingressos i capital
  inicial escalats amb l'IPC.
- **Mort d'empresa**: −100 % al semestre marcat, posició a zero, actiu fora del taulell, pèrdua
  realitzada disponible per compensar.
- **IA**: mai ven; paga comissió; tributa només al final; amb assignació 100 % `mundial` i zero
  moviments, jugador i IA acaben iguals llevat dels imprevistos.
- **Paritat ES/CA**: ampliar `content-parity.test.ts` a `cards`, `news` semestrals i perfils.

## 15. Riscos i decisions obertes

1. **Fidelitat de les dades** (§7). Assumit i mitigat, no eliminat.
2. **Volum de contingut**: 110 titulars + 28 fitxes ≈ 6.000-7.000 paraules en castellà, i el
   doble amb el valencià. És la part més cara del projecte i cal comptar-la al pla com a passos
   propis, no com a «i de pas les dades».
3. **Densitat de la UI**: en finestres tardanes hi pot haver 14 files d'actiu en una carcassa
   pensada per a mòbil. Els grups i el plegat de categories han de resoldre-ho; si no, cal
   replantejar la disposició al pla.
4. **Equilibri**: la fricció pot fer el joc massa punitiu per a 1r de Batxillerat. Els valors de
   comissió i el 20 % d'imprevistos són **paràmetres a afinar jugant**, no dogma.
5. **Abast real**: això és una reescriptura, no un retoc. `engine.test.ts` i `data.test.ts`
   actuals es reemplacen.
6. **Branca de treball**: la sessió està a `feat/cjd-libro-u1` amb feina no relacionada. El pla
   ha de començar per obrir branca neta des de `main`.

## 16. Fases futures (fora d'abast)

- CSV verificats aportats per Pau substituint `data/market.ts` i `data/inflation.ts`.
- Mode aula: mateixa finestra per a tots els alumnes (llavor compartida) per poder comparar
  resultats a classe.
- Versió imprimible del joc.
