# Spec de disseny — Econopoly (hot-seat 1-6 + IA)

> Estat: **validat amb Pau** (brainstorming 2026-05-26), pendent de pla d'implementació.
> Tercer joc de la migració del webpde. Reaprofita el **framework de jocs** establert per Stonks i Econrisk (ja a main).
> Idioma del doc: valencià (planificació). Codi/paths anglès; contingut del joc en castellà.

## 1. Resum i objectiu

Refer **Econopoly** (Monopoly econòmic) com a joc **hot-seat de 1-6 jugadors humans + IA**, **sense backend**, reaprofitant el framework. Objectiu pedagògic: ensenyar **poder de mercat** (monopoli sectorial), **fiscalitat progressiva**, **cicles econòmics** (expansió/recessió), **política monetària** (Banc Central + tipus), **inversió i R+D**, i **desigualtat** (Gini en directe). És el joc més ric pedagògicament del Bucket A.

L'Econopoly antic (`webpde/econopoly.html`, ~148 KB) era **multijugador via Firebase** (host/projector + alumnes al mòbil amb code de sala, subhastes en temps real). Es **refà des de zero** (extreure idees, no codi). El multijugador en xarxa queda **fora d'abast**.

## 2. Context

- **Origen**: `webpde/econopoly.html`. Mecànica: 28 caselles en anell (16 propietats = 8 sectors × 2 + tax/news/banc central/R+D/free market/start); torn = tirar 2d6, moure, resoldre casella, fase d'acció (R+D, fi torn); rendes = base × R+D × cicle × sector × monopoli; subhastes en temps real per a propietats lliures; R+D 4 nivells; cicles (expansió/recessió); Banc Central canvia tipus (2-12%); impost progressiu (5/10/15%); ~20 cartes de notícies; victòria a la ronda N (per defecte 20) pel major patrimoni net. Trilingüe CA/ES/EN.
- **Framework existent** (de stonks/econrisk, a main): ruta `src/pages/juegos/<game>/index.astro` → illa Preact; lògica pura testejada a `src/lib/games/<game>/` (patró `src/lib/calc/*` + `src/lib/games/stonks/*`); `GameShell.astro` amb prop `wide` (per a jocs de pantalla ampla); `src/lib/games/storage.ts` (localStorage namespaced); gràfics i taulers amb SVG/HTML propi. **Econopoly reaprofita tot això.**
- **Decisions d'arquitectura** (validades 2026-05-26): hot-seat 1-6 humans + IA per a la resta, sense backend; **port fidel** amb **subhasta simplificada per a hot-seat**.

## 3. Abast

### Dins d'abast
- Joc Econopoly complet **hot-seat 1-6 humans + IA**, jugable a `/juegos/econopoly/`.
- Port fidel: 28 caselles en anell (graf real portat de l'original), 8 sectors × 2 propietats; R+D 4 nivells; cicles (expansió/recessió); Banc Central amb tipus 2-12%; impost progressiu (5/10/15%); ~20 cartes de notícies; bonus monopoli; fons públic; **Gini en directe**.
- **Subhasta simplificada** per a hot-seat (vegeu §6).
- **IA** simple i raonable per a les faccions no humanes.
- Pantalles: configuració inicial (nº d'humans, assignació de noms/colors) → bucle de torns → pantalla final amb classificació + lliçons econòmiques.
- Tauler validat al mockup v2 (`.superpowers/brainstorm/.../econopoly-board-v2.html`).
- Persistència local (desar/reprendre la partida).
- Només **castellà** (i18n preparat per a fase 2). Pantalla **ampla/projector-first**, responsiva.
- Estètica Variant C: **paleta reduïda** a 4 acents (teal, mostassa, terracota, pi) amb **xips A-H per als 8 sectors** (parelles compartint color, identificades pel xip tipogràfic). Sense gradients ni emojis.

### Fora d'abast
- **Multijugador en xarxa** (host + mòbils) → fase futura amb backend compartit.
- Editor de taulers; sectors personalitzats.
- CA/VA/EN publicat.

## 4. Reús del framework

- **Ruta**: `src/pages/juegos/econopoly/index.astro` → `<EconopolyGame client:load />` dins de `GameShell` amb `wide`.
- **Lògica pura** a `src/lib/games/econopoly/` (testejada amb vitest).
- **Persistència** amb `makeGameStorage('econopoly')` (ja existent).
- **Shell** `GameShell.astro` (existent, prop `wide`).

## 5. Mecànica (port fidel)

- **Tauler**: 28 caselles en anell — 4 cantonades (SALIDA, IMPUESTO, MERCADO LIBRE, NOTICIA), 16 propietats (8 sectors × 2) i 8 caselles especials (Banco Central, R+D, Noticia ×3, Impuesto ×1, etc.) portades de l'original.
- **Inici**: cada jugador rep un capital inicial (a confirmar al pla, p.ex. 1.500 €) i una fitxa de color.
- **Torn = 3 fases**:
  1. **Tirar**: 2d6 → avança N caselles.
  2. **Resolver**: efecte de la casella (propietat lliure → comprar / subhasta; propietat aliena → pagar renda; tax → impost progressiu; news → carta; BC → canvi de tipus; R+D → millora possible; corners → efecte específic; passar per SORTIDA → +200 € + bonus del fons públic).
  3. **Acción**: el jugador pot millorar R+D de propietats que té; fi torn.
- **Rendes**: `renta_base × multiplicador_R+D × modificador_cicle × modificador_sector × bonus_monopoli`. Monopoli sectorial (controlar les 2 propietats d'un sector) **dobla** la renda d'eixe sector.
- **R+D**: 4 nivells (×1.0 / 1.5 / 2.0 / 3.0); cost = % del preu de la propietat (p.ex. 50% per nivell).
- **Cicles**: alternen expansió (rentes ×1.3, valor ×1.2) i recessió (rentes ×0.7, valor ×0.8); transició conduïda per esdeveniments o cada N rondes (a fixar al pla).
- **Banc Central**: tipus 2-12% (a confirmar). Afecta el cost de millores de R+D (encareix/abarateix). Esdeveniments l'ajusten.
- **Impost progressiu**: en caure a la casella d'impost, paga segons patrimoni net: 5% si <500 €, 10% si 500-1.000 €, 15% si >1.000 €. Va al **fons públic**.
- **Fons públic**: cada cop que un jugador passa per SORTIDA, rep 200 € + una part del fons (a fixar al pla).
- **Cartes de notícies** (~20, portades): boom sectorial, subvenció, inflació, tax holiday, etc. — efecte únic per ronda/jugador.
- **Gini en directe**: es calcula i es mostra cada ronda (indicador pedagògic).
- **Victòria**: en acabar **20 rondes** (per defecte), guanya el **major patrimoni net** (cash + valor actual de les propietats amb el seu R+D).

## 6. Subhasta simplificada (hot-seat)

Quan un jugador cau en una propietat **lliure**:
1. **Pot comprar al preu base** (decisió immediata, ràpid).
2. Si decideix **no comprar**, s'obre una **subhasta de ronda única** en sentit antihorari (començant pel jugador a la seua dreta):
   - Cada jugador, per torn, pot **oferir** una xifra superior a la millor oferta actual (multiples de 10 €, mínim = preu base) o **passar**.
   - Quan tots han passat o el torn dona la volta sense més ofertes, **la millor oferta guanya la propietat**.
   - Si ningú ofereix, **la propietat queda lliure** (es pot subhastar de nou si algú cau més tard).
3. Per al jugador humà, la UI presenta els botons "Oferir +10 €" / "Passar". Per a IA, una decisió simple (oferir fins a un percentatge del seu cash i sense superar X% del valor estimat).

Aquesta versió manté el valor pedagògic (descobrir el preu via subhasta, opportunitat) sense ralentir el ritme d'aula amb subhastes en temps real.

## 7. Hot-seat + IA

- **Configuració**: triar quants jugadors són humans (1-6); assignar nom i color per a cada jugador (4 colors principals + 2 secundaris si calen 5-6); la resta de seients són IA.
- **Traspàs**: en acabar un torn humà, pantalla **"Passa el dispositiu a [següent jugador]"** abans de mostrar el seu torn.
- **Torns d'IA**: s'executen automàticament amb un breu retard (~700ms) i log perquè la classe veja l'acció.
- **IA** (simple i raonable):
  - Sempre tira; resol caselles segons regles.
  - Compra propietats si té cash > 2× preu base i si el sector encara està obert.
  - A subhasta: ofereix fins a un percentatge del seu cash, sense superar el valor estimat (renda esperada × N rondes).
  - Millora R+D quan té efectiu i és rendible (heurístic).
  - Determinista amb RNG injectable.

## 8. Pantalles i UI

Mockup validat: `.superpowers/brainstorm/.../econopoly-board-v2.html`.

1. **Configuració**: nº d'humans (1-6), nom + color per a cada jugador, botó "Empezar".
2. **Joc** (pantalla ampla, projector/desktop-first): capçalera (ronda, jugador en torn, fase 1-3); **tauler** central 28 caselles en anell 8×8 amb àrea central mostrant la **fase del cicle** (gran tipografia editorial *italic*); **panell dret** amb barra de fases (Tirar→Resolver→Acción), carnet del jugador (efectivo + patrimoni), hand de propietats, tira d'economia (BC tipo, Gini, fons), acció + botons; **tira d'esdeveniment** sota el tauler. Estètica Variant C; paleta reduïda a 4 acents amb xip A-H per sector.
3. **Subhasta** (modal/overlay quan s'activa): mostra propietat, ofertes per jugador, qui té el torn d'oferir, botons "Oferir +10 €" / "Passar".
4. **Traspàs** entre torns humans.
5. **Final** (ronda 20): classificació per patrimoni net, gràfic d'evolució (opcional, a confirmar al pla), Gini final, lliçons econòmiques.

## 9. Estat i model de dades (esbós)

```ts
type SectorId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';
type PlayerId = number; // 0..5
type CellKind = 'start' | 'tax' | 'news' | 'cb' | 'rd' | 'freemarket' | 'property';
interface Cell {
  id: number; // 0..27, position on the ring
  kind: CellKind;
  // for property cells:
  property?: { sector: SectorId; label: string; basePrice: number; baseRent: number; };
}
interface PlayerState {
  id: PlayerId; name: string; color: string; isHuman: boolean; alive: boolean;
  cash: number;
  position: number; // 0..27
}
interface PropertyState {
  cellId: number;
  owner: PlayerId | null;
  rdLevel: 0 | 1 | 2 | 3;
}
interface GameState {
  cells: Cell[];
  players: PlayerState[];
  properties: Record<number, PropertyState>; // by cellId
  current: number;        // index into players
  round: number;          // 1..20
  phase: 'roll' | 'resolve' | 'action';
  cycle: 'expansion' | 'recession';
  cbRate: number;         // 2..12
  publicFund: number;
  lastEvent: NewsCard | null;
  activeAuction: AuctionState | null;
  log: string[];
  winner: PlayerId | null;
}
```

La lògica pura (`engine.ts`) cobreix moviment, resolució de casella, aplicació de cartes, cicles, subhasta, R+D, càlcul de renda, càlcul de patrimoni i Gini, victòria. La IA (`ai.ts`) decideix accions. El tauler (`board.ts`) conté les 28 caselles portades.

## 10. Persistència

`makeGameStorage('econopoly')`: desa l'estat en avançar de fase (reprendre partida hot-seat); neteja en acabar. Clau `pde:game:econopoly:state`. Sense backend → sense GDPR.

## 11. i18n, estètica, dispositiu

- **Castellà** només; strings centralitzats per a CA/VA/EN futur.
- **Variant C**; paleta 4 acents (teal/mostassa/terracota/pi) + sectors emparellats amb xips A-H tipogràfics; sense gradients ni emojis.
- **Pantalla ampla projector/desktop-first**, responsiva avall (el tauler de 28 caselles necessita espai).

## 12. Testing (TDD)

Tests vitest per a la lògica pura: moviment (2d6, wrap a la posició 0 amb bonus), càlcul de renda (R+D × cicle × monopoli), subhasta (ronda única, ofertes mínimes, victòria), R+D upgrade, transició de cicle, aplicació d'esdeveniments, càlcul de patrimoni net i Gini, condicions de victòria, transicions de fase i torn, IA bàsica (decisions de compra, ofertes a subhasta, millores R+D).

## 13. Estructura de fitxers (prevista)

```
src/pages/juegos/econopoly/index.astro            # ruta + illa amb GameShell wide
src/components/games/econopoly/EconopolyGame.tsx   # illa arrel (màquina d'estats UI + driver IA)
src/components/games/econopoly/SetupScreen.tsx
src/components/games/econopoly/BoardView.tsx       # anell 28 caselles + centre cicle
src/components/games/econopoly/SidePanel.tsx       # barra fases + carnet + hand + economia + acció
src/components/games/econopoly/AuctionModal.tsx    # overlay subhasta
src/components/games/econopoly/PassDeviceScreen.tsx
src/components/games/econopoly/EndScreen.tsx
src/components/games/econopoly/econopoly.css
src/lib/games/econopoly/types.ts
src/lib/games/econopoly/board.ts                   # 28 caselles, 8 sectors × 2, especials (port)
src/lib/games/econopoly/events.ts                  # ~20 cartes (port)
src/lib/games/econopoly/engine.ts                  # lògica pura
src/lib/games/econopoly/ai.ts
src/lib/games/econopoly/*.test.ts
src/pages/juegos/index.astro                       # actualitzar: econopoly disponible
```

## 14. Riscos i decisions obertes (per al pla)

- **Port del tauler**: les 28 caselles (sector de cada propietat, preus base, rendes base, posicions de specials) s'han de **portar de `webpde/econopoly.html`**. Verificar amb tests estructurals.
- **Cartes d'esdeveniment**: les ~20 cartes portades; els efectes complexos s'han de mapejar a un sistema de `kind` a `events.ts`.
- **Constants exactes**: capital inicial, valor de SORTIDA, escala de l'impost progressiu (5/10/15% i els llindars 500/1.000), tipus inicial BC, transicions de cicle.
- **Subhasta amb 1-2 humans**: cal que funcioni bé quan només hi ha 1 humà i la resta són IA (IA ofereix per ella mateixa).
- **Patrimoni i Gini**: el càlcul de Gini en partida ha d'incloure totes les faccions vives; cal definir la fórmula concreta (clàssic Lorenz/Gini sobre patrimonis nets).
- **IA equilibrada**: que no faci moviments absurds (sobreoferta, no millorar mai, etc.).
- **Tauler clicable**: les caselles del SVG/HTML han de ser identificables per posició; el jugador pot inspeccionar una casella (info amb hover/tap).

## 15. Fase futura (fora d'abast)

Multijugador en xarxa (host + mòbils en temps real) reaprofitant la lògica pura de l'`engine`. Requereix decisió de backend compartida amb insider/communist/stonks-multi/econrisk-multi. El disseny hot-seat no ha de bloquejar-ho (lògica separada de UI i persistència).
