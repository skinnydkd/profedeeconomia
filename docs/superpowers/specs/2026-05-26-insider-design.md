# Spec de disseny — Insider (multi en xarxa) + framework real-time sobre PartyKit

> Estat: **validat amb Pau** (brainstorming 2026-05-26), pendent de pla d'implementació.
> Primer joc del **Bucket B** (multijugador real). Estableix el **real-time games framework** sobre PartyKit (Cloudflare Durable Objects), reaprofitable per a tots els multi futurs (communist, i els modes multi de stonks/econrisk/econopoly).
> Idioma del doc: valencià. Codi/paths anglès; contingut del joc en castellà.

## 1. Resum i objectiu

Refer **Insider** (Among Us econòmic) com a joc multijugador real **host + alumnes al mòbil**, 4-30 jugadors, sobre **PartyKit**. Objectiu pedagògic: els alumnes descriuen termes econòmics (inflació, monopoli, externalitat, bitcoin…) en una frase per a fer-los endevinar a la resta, mentre un "impostor" — que no veu la paraula — escolta i mira de passar desapercebut. Combina vocabulari econòmic, deducció social i divertiment d'aula.

L'insider antic (`webpde/insider.html`, ~76 KB) era multijugador via Firebase Realtime Database. Es **refà des de zero** (extreure idees, no codi).

### Doble objectiu

1. **El joc Insider**: jugable a `/juegos/insider/` (alumnes) i `/juegos/insider/host/` (professor).
2. **El real-time games framework sobre PartyKit**: rooms + presence + phase machine + private/broadcast pattern + reconnexió, reaprofitable per al següent multi (communist) i per als modes multi futurs de stonks/econrisk/econopoly.

## 2. Context

- **Decisió de backend** (validada 2026-05-26): **PartyKit** (adquirida per Cloudflare 2024; és la via oficial sobre Cloudflare Durable Objects, DX TS-first, CLI de local dev, free tier de Cloudflare Workers cobreix folgadament l'ús d'aula). Alternatives considerades i descartades: Supabase Realtime (consolida amb Fase 2 però més boilerplate per a state de joc), WebSocket al VPS Hetzner (zero nou proveïdor però ops self-managed).
- **El joc original** té com a repte clau d'arquitectura la **informació asimètrica amagada**: la paraula es veu només per als "ciutadans"; el impostor no la veu; els vots són privats fins a la revelació; l'intent d'endevinar del impostor és privat fins a submetre. Açò és exactament el que el patró PartyKit (private message + public broadcast) resol bé.
- **Framework existent** (jocs Bucket A solo: stonks/econrisk/econopoly): NO és reaprofitable directament; el Bucket B necessita una infraestructura nova (servidor + sync) — però el codi *del joc en si* pot reusar components UI compatibles (Variant C, GameShell *no* perquè ací són dues entrades distintes).

## 3. Abast

### Dins d'abast
- Joc Insider complet **multijugador en xarxa**, jugable a `/juegos/insider/host/` (professor projector) i `/juegos/insider/` (alumnes mòbil), connectats per PartyKit.
- 4-30 jugadors per sala, 1-3 impostors (segons grup).
- 5 fases per ronda: `show_word` (10s) → `discussion` (30s/jugador, ordre aleatori) → `voting` → `reveal` → `guess` (30s si impostor caçat).
- N rondes configurables (per defecte 5); puntuació final amb classificació.
- **Bank de paraules** (~50-100 termes econòmics) portat de l'original; afegir-ne més és fàcil (taula).
- **Codis de sala** alfanumèrics de 4 caràcters generats al servidor; entrada al lobby per codi.
- **Reconnexió**: si un alumne perd connexió i torna, el servidor el reposa al seu estat (rol/paraula/puntuació intactes).
- **Real-time games framework reusable**: vegeu §4.
- Estètica Variant C (validada al mockup): codi de sala en mono terracota gros; fase com a protagonista editorial; rols visualment distingits (ciutadà teal, impostor terracota deep); sense gradients ni emojis pictogràfics.
- Només **castellà** (i18n preparat per a CA/VA/EN a fase futura).

### Fora d'abast
- **Rànquings persistents entre sessions**, comptes d'usuari, login.
- Premium professorat (Fase 2 backend Supabase, separat).
- Mode multi dels altres jocs (stonks/econrisk/econopoly) — reaprofitaran el framework, però són esforços separats posteriors.
- Comunicació de veu/xat dins del joc (l'alumnat parla a l'aula, és l'esperit del joc).
- Variant CA/VA/EN publicada (arquitectura sí).

## 4. Real-time games framework (sobre PartyKit)

L'spec extreu i nomena el patró reaprofitable. **Cada joc multi** instancia el seu propi "party" amb la lògica específica, però comparteix les peces transversals.

### Components del framework

- **Server "party"** (PartyKit): un `Party` per sala (Durable Object). Manté l'estat autoritatiu (`PartyState`), rep missatges dels clients, broadcast l'estat públic, envia missatges privats per jugador.
- **Codis de sala**: generador determinista al servidor (alfanumèric 4 chars; col·lisió gestionada amb retry — l'espai 36^4 ≈ 1,68M permet milers de sales concurrents sense problema).
- **Rols de connexió**: `host` (crea/conduix la sala) vs `player` (entra amb codi). Establits al `onConnect` segons el primer connectat com a host i la query string per a la resta.
- **Phase machine**: lifecycle típic `lobby` → `playing` (amb sub-fases del joc) → `finished`. Transicions disparades pel servidor (timers) o per l'host.
- **Patró private + broadcast**: `room.broadcast(publicMsg)` per a estat compartit; `connection.send(privateMsg)` per a info per-jugador (rols, paraula, vot pendent…).
- **Presence**: el servidor manté la llista de connexions actives; comunica entrades/eixides via broadcast. Si un jugador es desconnecta i torna, es reidentifica amb el seu `playerId` (persistit al `localStorage` del client) i recupera l'estat sense duplicar-se.
- **Reconnexió**: client manté `playerId` a localStorage; en reconnectar, l'envia al servidor que el reasocia (si la sala segueix viva).
- **Cleanup**: PartyKit/Cloudflare DO entren en hibernació amb inactivitat; estat efímer per sessió, no persistim entre sessions. Açò ja és el comportament desitjat per a Insider (no rànquings persistents).
- **Tests del servidor**: la lògica pura del state machine es testeja amb vitest com els jocs solo (separant la funció pura de l'orquestració amb missatges).

### Estructura del codi reusable

- `party/_shared/`: helpers genèrics (generador codis, presence, patró private/broadcast amb tipus).
- `party/insider/server.ts`: servidor específic d'Insider.
- `src/lib/games-multi/types.ts`: tipus compartits client ↔ servidor (msg shapes, public state shape, private state shape).
- `src/components/games-multi/`: components UI compartits (lobby, codi de sala destacat, "esperant connexió", error reconnexió…).

### Desplegament i operació

- El codi del servidor PartyKit es desplega a **Cloudflare** amb `npx partykit deploy` (separat del site Astro que va a Vercel). Compte de Cloudflare necessari (free tier).
- Variable d'entorn `PUBLIC_PARTYKIT_HOST` al site Astro apuntant al subdomini de PartyKit (p.ex. `pde-games.<user>.partykit.dev` al principi, custom domain més avant).
- `partykit dev` per a desenvolupament local (servidor a `localhost:1999`).

## 5. Mecànica d'Insider (port fidel)

- **Jugadors**: 4-30 (recomanat ≥6 per a tindre tensió real).
- **Impostors**: 1 si <8 jugadors; 2 si 8-15; 3 si >15 (configurable per l'host).
- **Rondes per partida**: configurable (per defecte 5).
- **Bank de paraules**: ~50-100 termes econòmics portats de l'original.
- **Per ronda — 5 fases**:
  1. **`show_word`** (10 s): l'host mostra el timer; els ciutadans veuen la paraula al mòbil; l'impostor veu "Eres el impostor — escucha y disimula".
  2. **`discussion`** (30 s/jugador): ordre aleatori; cada jugador descriu la paraula amb UNA frase quan li toca. L'host destaca qui parla i el timer; els altres veuen "Habla [nom]".
  3. **`voting`**: tots voten al jugador que creuen impostor (vot privat). L'host mostra el progrés de vots (X/Y) sense revelar qui ha votat què.
  4. **`reveal`**: l'host mostra el resultat (el més votat s'elimina, rol revelat). Si era impostor → fase guess.
  5. **`guess`** (30 s, només si impostor caçat): l'impostor intenta endevinar la paraula al seu mòbil (text input). Privat fins a submetre.
- **Puntuació**:
  - Vot correcte per a impostor: **+100** punts (al votant).
  - Supervivència del impostor per ronda: **+200** punts (al impostor).
  - Encert de paraula del impostor: **+150** punts.
  - Ciutadans eliminen impostor sense que encerte: **+50** punts cadascú.
- **Final**: després de N rondes o quan tots els impostors estan caçats i no n'hi ha més per a girar, mostra classificació final.

## 6. Pantalles i UI (validades al mockup)

Mockup validat: `.superpowers/brainstorm/208993-1779796749/content/insider-host-player.html`.

- **Lobby (host)**: codi de sala 4 chars en mono terracota gros; llista de jugadors connectats actualitzada en temps real; configuració (nº rondes, nº impostors); botó "Empezar".
- **Lobby (player)**: input de codi + nom; "Entrar". Mentre la sala no comence, mostra "Esperando a que el profesor empiece…" + ordre d'entrada.
- **Joc (host)**: fase actual com a protagonista editorial (Fraunces italic), speaker spotlight amb timer mono gros, graella de torns (✓ / actiu / pendent), mini-classificació top 3.
- **Joc (player ciutadà)**: rol "Eres ciudadano/a" + paraula gran serif; status (qui parla ara, ordre del meu torn); pantalla de votació quan toca.
- **Joc (player impostor)**: rol "Eres el impostor" + "*No conoces la palabra*" (italic); estratègia recordatori; pantalla de votació; pantalla de guess (text input) si és caçat.
- **Eliminat (player)**: mode espectador, veu fases i resultats sense participar.
- **Final**: classificació general, medalles tipogràfiques (1r/2n/3r en mono, no emojis).

Estètica: codi de sala SEMPRE visible al header del host (és el handle que els alumnes lligen). Fase com a protagonista. Paleta: teal #1F6E6E per a ciutadans, terracota deep #9C3A1C per a impostors, mostassa per a pista del timer.

## 7. Estat i model de dades (esbós)

### Server-side (autoritatiu, dins del DO)

```ts
interface PublicState { // broadcast a tots
  phase: 'lobby' | 'show_word' | 'discussion' | 'voting' | 'reveal' | 'guess' | 'finished';
  round: number; totalRounds: number;
  players: { id: string; name: string; alive: boolean; hasVoted?: boolean; turnDone?: boolean }[];
  currentSpeaker: string | null;
  timerEndsAt: number | null; // unix ms
  votesCast: number;
  lastEliminated: { id: string; wasImpostor: boolean } | null;
  scoreboard: { id: string; name: string; score: number }[];
}

interface PrivateState { // per jugador
  role: 'citizen' | 'impostor';
  word: string | null;       // null si impostor
  myScore: number;
  canVote: boolean; canGuess: boolean;
}

// Missatges (típicament unió discriminada)
type ClientMsg =
  | { type: 'join'; name: string; playerId?: string } // playerId per reconnexió
  | { type: 'startGame'; rounds: number; impostors: number }
  | { type: 'vote'; targetId: string }
  | { type: 'guess'; word: string };
type ServerMsg =
  | { type: 'public'; state: PublicState }
  | { type: 'private'; state: PrivateState }
  | { type: 'error'; reason: string };
```

### Client-side (renderitza de missatges)

L'estat al client = última `PublicState` + última `PrivateState` rebudes. No es calcula res del joc al client; només UI.

## 8. Bank de paraules

Portar de l'original (`webpde/insider.html`) un llistat de ~50-100 termes econòmics en castellà (l'original era trilingüe, MVP només castellà). Format: array de strings + categoria opcional (per a balancejar dificultat: bàsic/intermedi/avançat).

## 9. Persistència

- **Per sessió**: l'estat viu al DO (in-memory + Durable storage opcional per a hibernació). Una vegada la sala s'inactiva, el DO entra en hibernació; les sales no es persisteixen entre dies.
- **Al client**: només el `playerId` (UUID generat al primer join) a localStorage per a reconnectar a la mateixa sala si refresques.
- **Sense base de dades**, sense rànquings persistents.

## 10. i18n, estètica, dispositiu

- **Castellà** només; strings centralitzats.
- **Variant C** (validat al mockup): codi de sala mono terracota, fase serif italic protagonista, paleta rol-teal/impostor-terracota deep, sense gradients ni emojis. Tipografia 1r/2n/3r en monoespai.
- **Host = pantalla ampla (projector/desktop)-first**; **player = mòbil-first** (els alumnes hi van des del telèfon). Disseny responsiu adequat per a cada entrada.

## 11. Testing

- **Lògica pura del servidor** (assignació de rols, càlcul de puntuació, recompte de vots, win/lose, transició de fase per timer): funcions pures testejades amb vitest, igual que els jocs solo.
- **UI client**: tests bàsics amb vitest per a components Preact si val la pena (no obligatori; el valor està al servidor).
- **Sense e2e** (Playwright no configurat al projecte) — la integració s'haurà de provar manualment amb el `partykit dev` + dues pestanyes del navegador.

## 12. Estructura de fitxers (prevista)

```
party/
  insider/
    server.ts                  # PartyServer (Durable Object) amb la màquina d'estats
    words.ts                   # bank de paraules (portat)
    scoring.ts                 # funcions pures de puntuació
    *.test.ts                  # vitest sobre les funcions pures
  _shared/
    types.ts                   # ClientMsg/ServerMsg base
    room-code.ts               # generador 4-char + retry
    presence.ts                # helpers de presence

partykit.json                  # config PartyKit

src/lib/games-multi/insider/
  types.ts                     # tipus de l'estat client (PublicState/PrivateState)
  client.ts                    # wrapper TypedSocket d'alt nivell (subscribe, send)

src/pages/juegos/insider/
  index.astro                  # entrada player (lobby+joc)
  host/index.astro             # entrada host (lobby+joc)

src/components/games/insider/
  insider.css                  # estètica Variant C (host + player)
  HostLobby.tsx, HostGame.tsx
  PlayerLobby.tsx, PlayerGame.tsx
  ShowWordScreen.tsx, DiscussionScreen.tsx, VotingScreen.tsx, RevealScreen.tsx, GuessScreen.tsx
  FinalScreen.tsx

src/pages/juegos/index.astro   # actualitzar: insider disponible
```

## 13. Riscos i decisions obertes (per al pla)

- **Pricing edge cases**: confirmar amb la docs actual de Cloudflare/PartyKit que el free tier cobreix l'ús esperat (centenars de sales × 30 jugadors × pocs missatges/segon). Documentar al pla els límits efectius.
- **Codi de sala col·lisions**: 36^4 = 1.68M, suficient per a milers de sales actives; en cas raríssim de col·lisió, retry amb un nou codi.
- **Reconnexió UX**: timeout per a expulsar jugadors desconnectats >Ns (configurable, p.ex. 2 min); avís visual al host.
- **Configuració de partida**: l'host decideix nº rondes i nº impostors al lobby (defaults sensats segons mida del grup).
- **Bank de paraules**: revisar i ampliar la llista; categoritzar per dificultat.
- **Variable d'entorn**: `PUBLIC_PARTYKIT_HOST` afegida al build d'Astro (Vercel env).
- **Tests del servidor**: assegurar que les funcions pures (scoring, vote tally, role assignment, phase transitions) viuen separades de la classe `PartyServer` perquè siguen testejables sense missatges reals.

## 14. Fase futura (fora d'abast d'aquest spec)

- **Communist** sobre el mateix framework (afegirà la complexitat de 5 categories de reptes amb UIs distintes).
- **Modes multi de stonks/econrisk/econopoly**: reusar PartyKit + el framework, però convertir la lògica solo en autoritativa al servidor.
- **i18n CA/VA/EN** publicat.
- **Rànquings persistents** (requeriria base de dades — Supabase Postgres ja al roadmap de Fase 2 per a auth premium; encaixaria allí).
