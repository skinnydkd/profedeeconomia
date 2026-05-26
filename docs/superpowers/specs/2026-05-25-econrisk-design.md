# Spec de disseny — Econrisk (hot-seat 1-4 + IA)

> Estat: **validat amb Pau** (brainstorming 2026-05-25), pendent de pla d'implementació.
> Segon joc de la migració del webpde. Reaprofita el **framework de jocs** establert per stonks (PR #62 `feat/stonks`).
> Idioma del doc: valencià (planificació). Codi/paths en anglès; contingut del joc en castellà.

## 1. Resum i objectiu

Refer **Econrisk** (joc d'estratègia de conquesta tipus Risk, amb temàtica d'escoles de pensament econòmic) com a joc **hot-seat de 1-4 jugadors humans + IA**, **sense backend**, reaprofitant el framework de jocs. Objectiu pedagògic: contrastar **escoles econòmiques** (keynesianisme, marxisme, escola austríaca, neoclàssica) a través de les seues "estratègies" i poders, dins d'una mecànica de conquesta que també toca conceptes macro (bonus per control, esdeveniments com crisis de deute, sancions, redistribució).

L'Econrisk antic (`webpde/econrisk.html`) era **multijugador via Firebase** (host + mòbils + IA per a faccions buides). Es **refà des de zero**; el multijugador en xarxa queda **fora d'abast** (fase futura).

## 2. Context

- **Origen**: `webpde/econrisk.html` (~142 KB). Mecànica: 24 territoris / 6 continents; torn de 4 fases (esdeveniment → reforçar → atacar → fortificar); combat amb daus; 4 faccions = escoles econòmiques amb poders únics; bonus continentals; ~15 cartes d'esdeveniment; victòria per 18+ territoris o eliminació abans de la ronda 15. Trilingüe CA/ES/EN.
- **Framework existent** (de stonks, `feat/stonks`): ruta `src/pages/juegos/<game>/index.astro` → illa Preact; lògica pura testejada a `src/lib/games/<game>/`; `src/components/games/GameShell.astro`; `src/lib/games/storage.ts` (localStorage namespaced); gràfics SVG propis. **Econrisk reaprofita tot això.**
- **Decisió d'arquitectura** (validada 2026-05-25): hot-seat 1-4 humans + IA per a la resta de faccions, sense backend.

## 3. Abast

### Dins d'abast
- Joc Econrisk complet **hot-seat 1-4 humans + IA**, jugable a `/juegos/econrisk/`.
- Port fidel: 24 territoris / 6 continents amb graf d'adjacències real; 4 fases per torn; combat amb daus; les 4 faccions-escoles amb els seus poders; bonus continentals; ~15 cartes d'esdeveniment; condicions de victòria (18+ territoris o eliminar rivals abans de la ronda 15).
- **IA** simple i raonable per a les faccions no humanes.
- Pantalles: configuració inicial (nº d'humans, assignació de faccions) → bucle de torns (per fases) amb pantalla de traspàs entre humans → pantalla final.
- Mapa = grafo esquemàtic editorial SVG (validat al mockup).
- Persistència local (desar/reprendre la partida hot-seat).
- Només **castellà** (i18n preparat per a fase 2). Pantalla **ampla (projector/desktop)-first**, responsiva.
- Estètica Variant C (sense gradients ni emojis). Colors de facció: Keynesians teal `#1F6E6E`, Marxistes granate `#8C2F39`, Austríacs or `#A87A2A`, Neoclàssics verd `#2E5E3A`.

### Fora d'abast
- **Multijugador en xarxa** (host + mòbils en temps real) → fase futura amb backend (compartit amb insider/communist i el multi de stonks).
- Rànquings globals / comptes.
- Editor de mapes; mapes alternatius.
- CA/VA/EN publicat (arquitectura sí, contingut no).

## 4. Reús del framework

- **Ruta**: `src/pages/juegos/econrisk/index.astro` → `<EconriskGame client:load />` dins de `GameShell` (`title="Econrisk"`).
- **Lògica pura** a `src/lib/games/econrisk/` (testejada amb vitest, patró `src/lib/calc/*` i `src/lib/games/stonks/*`).
- **Persistència** amb `makeGameStorage('econrisk')` (ja existent).
- **Shell** `GameShell.astro` (ja existent).
- **Gràfics**: mapa i icones amb SVG propi.

## 5. Mecànica (port fidel)

- **Mapa**: 24 territoris en 6 continents, amb graf d'adjacències (només es pot atacar/fortificar entre territoris connectats).
- **Inici**: repartiment de territoris entre les faccions (aleatori equilibrat) i unitats inicials.
- **Torn = 4 fases**:
  1. **Evento**: es treu una carta d'esdeveniment aleatòria que aplica una regla eixe torn/ronda.
  2. **Reforzar**: la facció rep `max(3, floor(territoris/3))` + bonus continental (per cada continent que controla sencer); col·loca eixes unitats als seus territoris.
  3. **Atacar**: combat amb daus — l'atacant tira fins a 3 daus, el defensor fins a 2; es comparen els daus més alts un a un; el perdedor de cada comparació perd 1 unitat (empat → guanya defensor). Es pot atacar diverses vegades per torn.
  4. **Fortificar**: moure unitats entre dos territoris adjacents propis (1 moviment).
- **Victòria**: controlar **18+ territoris** O eliminar tots els rivals **abans de la ronda 15** (si s'arriba a la ronda 15 sense això, guanya qui té més territoris).
- **Esdeveniments** (~15): crisi de deute (penalització d'unitats), acord comercial (bonus), sancions (bloqueig), avenç tecnològic, col·lapse financer, redistribució de riquesa (zones de pau), etc. — portats de l'original.

## 6. Faccions = escoles econòmiques (poders)

| Facció | Color | Poder |
|---|---|---|
| **Keynesians** | teal `#1F6E6E` | +2 unitats gratis cada 3 torns (estímul fiscal) |
| **Marxistes** | granate `#8C2F39` | auto-conquereixen territoris enemics defensats amb 1 sola unitat |
| **Austríacs** | or `#A87A2A` | +1 a la defensa de tots els seus territoris (moneda sòlida) |
| **Neoclàssics** | verd `#2E5E3A` | poden atacar 1 territori **no adjacent** per torn (avantatge comparatiu) |

Els poders són el nucli pedagògic (i el factor d'equilibri). Es mantenen tal qual de l'original; afinar valors al pla si cal.

## 7. Hot-seat + IA

- **Configuració**: triar quantes faccions són humanes (1-4); la resta, IA. Assignació de facció per jugador.
- **Traspàs**: en acabar el torn d'un humà, pantalla "Passa el dispositiu a [següent jugador]" abans de mostrar el seu torn (evita veure info de l'altre, encara que el Risk té poca info oculta).
- **Torns d'IA**: s'executen automàticament amb una breu animació/log perquè la classe veja què fa.
- **IA** (port de l'original, simple): a Reforzar, reforçar territoris frontera; a Atacar, atacar veïns més febles amb avantatge raonable; a Fortificar, moure cap a la frontera. Determinista amb RNG injectable per als tests.

## 8. Pantalles i UI

Mockup validat: `.superpowers/brainstorm/.../econrisk-layout.html`.

1. **Configuració**: nº d'humans, assignació de faccions, botó "Empezar".
2. **Joc** (pantalla ampla): capçalera (ronda X/15, facció en torn, fase); **mapa SVG** (nodes = territoris amb color de facció + nº d'unitats; línies = fronteres); **panell dret** (facció en torn, escola, poder, territoris, refuerzos, acció de la fase); **barra de fases** a baix (Evento → Reforzar → Atacar → Fortificar + "Siguiente fase"); àrea de **log/carta d'esdeveniment**.
3. **Traspàs** entre torns humans.
4. **Final**: guanyador, estadístiques per facció, i una nota pedagògica per escola.

## 9. Estat i model de dades (esbós, es detalla al pla)

```ts
type FactionId = 'keynes' | 'marx' | 'austrian' | 'neoclassic';
interface Territory { id: string; continent: ContinentId; adj: string[]; }
interface GameState {
  territories: Record<string, { owner: FactionId; units: number }>;
  factions: Record<FactionId, { isHuman: boolean; alive: boolean; turnsSinceBonus: number }>;
  order: FactionId[];          // turn order
  current: number;             // index into order
  round: number;               // 1..15
  phase: 'event' | 'reinforce' | 'attack' | 'fortify';
  reinforcementsLeft: number;
  activeEvent: EventCard | null;
  log: string[];
  winner: FactionId | null;
}
```

La lògica pura (`engine.ts`) calcula refuerzos, resol combats (amb RNG injectable), aplica esdeveniments i poders, gestiona transicions de fase/torn i comprova victòria. La IA (`ai.ts`) decideix accions a partir de l'estat. El mapa (`map.ts`) conté territoris/continents/adjacències.

## 10. Persistència

`makeGameStorage('econrisk')`: desar l'estat en avançar de fase/torn (reprendre partida hot-seat) i netejar en acabar. Clau `pde:game:econrisk:state`. Sense backend → sense GDPR.

## 11. i18n, estètica, dispositiu

- **Castellà** només; strings centralitzats per a CA/VA/EN futur.
- **Variant C**; colors de facció definits a §6; sense gradients ni emojis.
- **Pantalla ampla (projector/desktop)-first**, responsiva avall (el mapa de 24 territoris necessita espai).

## 12. Testing (TDD)

Tests vitest per a la lògica pura: càlcul de refuerzos (territoris/3 + bonus continental), resolució de combat (amb daus deterministes), adjacència (atac/fortificació només entre connectats), poders de cada facció, aplicació d'esdeveniments, condicions de victòria (18 territoris / eliminació / ronda 15), transicions de fase i torn, decisions bàsiques de la IA.

## 13. Estructura de fitxers (prevista)

```
src/pages/juegos/econrisk/index.astro          # ruta + illa
src/components/games/econrisk/EconriskGame.tsx  # illa arrel (màquina d'estats UI)
src/components/games/econrisk/SetupScreen.tsx   # configuració jugadors/faccions
src/components/games/econrisk/MapView.tsx        # mapa SVG (nodes + fronteres, clicable)
src/components/games/econrisk/SidePanel.tsx      # facció en torn + acció de fase
src/components/games/econrisk/PhaseBar.tsx
src/components/games/econrisk/PassDeviceScreen.tsx
src/components/games/econrisk/EndScreen.tsx
src/components/games/econrisk/econrisk.css
src/lib/games/econrisk/types.ts
src/lib/games/econrisk/map.ts                    # 24 territoris, 6 continents, adjacències (port)
src/lib/games/econrisk/events.ts                 # ~15 cartes (port)
src/lib/games/econrisk/factions.ts               # escoles + poders
src/lib/games/econrisk/engine.ts                 # lògica pura
src/lib/games/econrisk/ai.ts                     # IA
src/lib/games/econrisk/*.test.ts
src/pages/juegos/index.astro                     # actualitzar: econrisk disponible
```

## 14. Riscos i decisions obertes (per al pla)

- **Port de dades**: el graf de territoris/adjacències (24+6) i les cartes d'esdeveniment s'han de **portar de `webpde/econrisk.html`** (no inventar la topologia). Verificar amb tests estructurals (cada territori té continent + adjacències; adjacències simètriques; 6 continents amb bonus).
- **Equilibri**: els poders de facció i el repartiment inicial poden desequilibrar; mantenir fidels i afinar al pla només si cal.
- **Combat exacte**: confirmar la regla de daus (empat → defensor) i quantes unitats es mouen.
- **IA**: mantenir-la simple però que no faça moviments absurds; testejar decisions bàsiques.
- **Mapa SVG clicable**: posicions dels 24 nodes i fronteres — derivar un layout net (no cal geografia real). Decidir coordenades al pla.
- **Render del mapa en mòbil**: 24 territoris en pantalla menuda és difícil; assumim projector/desktop-first i un fallback responsiu acceptable (pa el pla).

## 15. Fase futura (fora d'abast)

Multijugador en xarxa (host + mòbils) reaprofitant la lògica pura de l'`engine`. Requereix decisió de backend compartida amb insider/communist. El disseny hot-seat no ha de bloquejar-ho (lògica separada de UI i persistència).
