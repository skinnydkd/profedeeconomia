# Cajút — Disseny

> **Cajút** és un joc d'aula multijugador tipus Kahoot per al web profedeeconomia.es. El profe tria asignatura + unitats, els alumnes uneixen amb codi de sala al mòbil, i juguen sincronitzadament amb timer, leaderboard i podi final. Reutilitza el banc de 88 tests que ja viuen al content collection `tests`.

- **Estat**: spec validat amb Pau el 2026-05-26. Pendent d'implementació.
- **Bucket**: Bucket B (multi en xarxa) — segon joc rere Insider.
- **Backend**: PartyKit (mateix projecte `pde-games` que Insider, nova party).
- **Slug**: `cajut` · **Display**: "Cajút"

---

## 1. Visió en una frase

Convertir el banc de 88 tests per assignatura/unitat ja existent en un joc d'aula sincronitzat que el profe pot llançar en 30 segons per a qualsevol combinació de unitats publicades.

## 2. Decisions consolidades

| # | Aspecte | Decisió |
|---|---|---|
| 1 | Selecció contingut | Asignatura + checkboxes d'unitats publicades |
| 2 | Scoring | Speed bonus Kahoot (1000 → 500 → 0, decay lineal sobre `elapsedMs / timerMs`) |
| 3 | Mida partida | Slider lobby: 10 / 15 / 20 / 25 / totes (default 15) |
| 4 | Identitat alumnes | Nickname lliure (max 20 chars, no buit) |
| 5 | Entre preguntes | Resposta correcta + barres per opció + leaderboard top 5 |
| 6 | Final | Podi top 3 + leaderboard sencer + revisió individual al mòbil (amb `explicacion`) |
| 7 | Temps per pregunta | Fix 20s |
| 8 | Límit jugadors | 1–40 |
| 9 | Controls profe en partida | Saltar pregunta · Expulsar jugador · Acabar partida |
| 10 | Llengua MVP | Castellà (estructura preparada per CA fase 2) |

## 3. Arquitectura

Approach **A** validat: nova `party` separada dins del mateix projecte PartyKit que Insider. Sense framework genèric prematur — es generalitzarà quan hi haja un tercer joc multi.

```
src/content/asignaturas/*/tests/*.md (88 tests, estado: publicado)
                  ↓
    scripts/build-cajut-manifest.mjs (Node + gray-matter)
              ↙          ↘
public/games-multi/        party/cajut/
cajut/manifest.json        questions.generated.json
(~5 KB, metadata)          (~500 KB, preguntas)
servit per Vercel          bundlejat a PartyKit
llegit per HostApp         importat pel servidor
per al selector            mai surt a la xarxa
```

**Decisió crítica de seguretat**: el bank amb `correcta` i `explicacion` **mai** viatja al navegador abans que l'alumne haja respost. El servidor és l'única font de veritat per a la correcció. La revisió post-partida envia respostes correctes a cada alumne via `PrivateState` només quan `phase === 'final'`.

## 4. Estructura de fitxers

```
party/cajut/
├── server.ts                      # PartyServer orquestrador
├── constants.ts                   # timers, scores, room codes, limits
├── state.ts                       # phase machine pura
├── scoring.ts                     # scoreFor() Kahoot decay
├── questions.ts                   # getPool(), samplePool()
├── questions.generated.json       # banc complet, GENERAT, importat per server
├── state.test.ts
├── scoring.test.ts
└── questions.test.ts

src/lib/games-multi/cajut/
├── client.ts                      # createCajutClient() — typed PartySocket
└── types.ts                       # ClientMsg | ServerMsg | PublicState | PrivateState

src/components/games/cajut/
├── HostApp.tsx                    # illa Preact host (projector)
├── PlayerApp.tsx                  # illa Preact alumne (mòbil)
├── cajut.css                      # estils dedicats (reusa Variant C)
└── screens/
    ├── HostLanding.tsx
    ├── HostLobby.tsx
    ├── HostQuestion.tsx
    ├── HostReveal.tsx
    ├── HostLeaderboardMini.tsx
    ├── HostFinal.tsx
    ├── PlayerJoin.tsx
    ├── PlayerName.tsx
    ├── PlayerWaiting.tsx
    ├── PlayerAnswer.tsx
    ├── PlayerWaitOthers.tsx
    ├── PlayerRevealLocal.tsx
    ├── PlayerLeaderboardMini.tsx
    └── PlayerFinal.tsx

src/pages/juegos/cajut/
├── index.astro                    # entrada alumne (PlayerApp)
└── host/index.astro               # entrada profe (HostApp)

scripts/build-cajut-manifest.mjs   # genera els 2 fitxers
public/games-multi/cajut/manifest.json   # metadades públiques

partykit.json                      # afegir "cajut" al parties map
docs/games-multi-deploy.md         # actualitzar amb instruccions Cajút
```

## 5. Pipeline del manifest

Dos fitxers, diferents destinacions, mateixa font.

### 5.1 `public/games-multi/cajut/manifest.json` (públic, només metadades)

```json
{
  "generatedAt": "2026-05-26T...",
  "version": 1,
  "asignaturas": [
    {
      "slug": "edmn-2bach",
      "name": "Economía y Administración de Empresas (2º Bach)",
      "shortName": "EDMN 2BACH",
      "color": "#C44E2C",
      "unidades": [
        { "numero": 1, "title": "La empresa y el empresario", "preguntasCount": 12 }
      ]
    }
  ]
}
```

Carregat per `HostLobby` per renderitzar el selector asignatura → unitats. **Mai porta `enunciado`, `opciones`, `correcta`, `explicacion`.**

### 5.2 `party/cajut/questions.generated.json` (servidor only)

```json
{
  "generatedAt": "2026-05-26T...",
  "version": 1,
  "preguntas": {
    "edmn-2bach/1": [
      { "enunciado": "...", "opciones": [...], "correcta": 1, "explicacion": "..." }
    ]
  }
}
```

Clau `${asignaturaSlug}/${unidadNumero}`. Importat al top de `party/cajut/server.ts`. Bundlejat per PartyKit al deploy. **No viu a `public/`, mai servit per Vercel.**

### 5.3 Build hook

```jsonc
// package.json (scripts)
{
  "build:cajut-manifest": "node scripts/build-cajut-manifest.mjs",
  "prebuild": "npm run build:cajut-manifest && <prebuild existent>",
  "predeploy:cajut": "npm run build:cajut-manifest",
  "deploy:cajut": "npm run predeploy:cajut && partykit deploy"
}
```

Script idempotent: mateixa font MDX → mateixos dos fitxers. Quan Pau publica un test nou (`estado: publicado`), el següent `npm run build` el recull sense intervenció manual.

### 5.4 Color i shortName per asignatura

El script llig una taula hardcoded de 9 entrades (slug → name/shortName/color) que viurà a `scripts/cajut-asignaturas-meta.mjs`. Colors d'asignatura segons CLAUDE.md: EDMN 2BACH terracota, Eco 1BACH teal, Eco 4ESO mostassa, FOPP 4ESO berenjena, i la resta amb tintes editorials del sistema.

## 6. State machine

### 6.1 Diagrama

```
                ┌──────────────┐
                │   lobby      │  ← alumnes uneixen + host configura
                └──────┬───────┘
                       │ host: startMatch
                       ▼
        ┌──────────────────────────────┐
        │   question (20s timer)       │
        │   alumnes responen           │◀────┐
        └──────────┬───────────────────┘     │
                   │                         │
       allAnswered() OR timer OR host:skip   │
                   ▼                         │
        ┌──────────────────────────────┐     │
        │   reveal (5s timer)          │     │
        │   correcta + barres opcions  │     │ next q
        └──────────┬───────────────────┘     │
                   │ auto-advance            │
                   ▼                         │
        ┌──────────────────────────────┐     │
        │   leaderboard (5s timer)     │     │
        │   top 5                      │─────┘
        └──────────┬───────────────────┘
                   │ si última pregunta
                   ▼
        ┌──────────────────────────────┐
        │   final                      │
        │   podi top 3 + ranking +     │
        │   revisió individual         │
        └──────────────────────────────┘

Overrides:
- host: endMatch → final (en qualsevol moment)
- alumne: disconnect → marca disconnected, neteja a 2 min si no torna
```

### 6.2 Estat (immutable; `state.ts`)

```ts
type Phase = 'lobby' | 'question' | 'reveal' | 'leaderboard' | 'final';

interface Player {
  id: string;
  nick: string;
  score: number;
  isConnected: boolean;
  lastSeenAt: number;
}

interface Question {
  enunciado: string;
  opciones: string[];        // ordre = mateix per a tothom dins d'una partida
  correcta: number;          // index a opciones
  explicacion?: string;
}

interface AnswerRecord {
  questionIndex: number;
  optionIndex: number | null;  // null = sense resposta (timeout)
  elapsedMs: number;
  scoreGained: number;
  wasCorrect: boolean;
}

interface MatchConfig {
  asignaturaSlug: string;
  unidades: number[];
  totalQuestions: number | 'all';
}

interface MatchState {
  phase: Phase;
  roomCode: string;
  hostId: string | null;          // host NO entra a players (com a Insider fix)
  players: Map<string, Player>;
  config: MatchConfig | null;
  questions: Question[];          // resoltes al startMatch, sense sortir mai a public
  questionIndex: number;
  questionStartedAt: number;
  answers: Map<string, AnswerRecord[]>;
}
```

### 6.3 Funcions pures

Totes a `state.ts`, sense efectes secundaris, RNG injectable, totes testejades.

| Funció | Què fa |
|---|---|
| `createInitialState(roomCode)` | Sala buida, `phase: 'lobby'` |
| `registerHost(state, hostId)` | Estableix `hostId`, **NO** afegeix a `players` |
| `addPlayer(state, id, nick)` | Valida nick (longitud, no buit, no duplicat); afegeix |
| `removePlayer(state, id)` | Treu (per kick o disconnect persistent) |
| `setPlayerConnection(state, id, isConnected)` | Marca, no remou |
| `kickPlayer(state, id)` | Treure jugador i marcar `wasKicked`. (La verificació que el caller és el host la fa `server.ts` abans de cridar, no aquesta funció pura.) |
| `configureMatch(state, config, sampledQuestions)` | Guarda `config` i `questions`, mantenir `phase: 'lobby'` |
| `startMatch(state, now)` | `phase: 'question'`, `questionIndex: 0`, `questionStartedAt: now` |
| `recordAnswer(state, playerId, qIdx, optIdx, now)` | Valida (fase, qIdx, no double-answer); push a `answers`; calcula score |
| `allAnswered(state)` | True si tots els connectats han respost la `questionIndex` actual |
| `advanceToReveal(state, now)` | `phase: 'reveal'` |
| `advanceToLeaderboard(state, now)` | `phase: 'leaderboard'` |
| `advanceToNextQuestion(state, now)` | Si `questionIndex+1 < questions.length`: incrementa i `phase: 'question'`. Si no: `phase: 'final'` |
| `skipQuestion(state, now)` | Equival a `advanceToReveal` però marca els no-respondents amb optIdx=null |
| `endMatch(state)` | `phase: 'final'` immediat |
| `toPublicState(state, viewerId)` | Genera la projecció pública (mai inclou `correcta` ni `explicacion` de preguntes no acabades) |
| `toPrivateState(state, playerId)` | Genera la projecció privada per playerId; `myAnswerHistory` només si `phase: 'final'` |

### 6.4 Comportaments del servidor (`server.ts`)

1. **Host fora del roster** — aplicar el fix Insider d'entrada.
2. **Late joins permeses durant `lobby`**, blocades a `question/reveal/leaderboard/final` (resposta `error: 'match-already-started'`).
3. **Reconnect** durant qualsevol fase (sessionStorage playerId); score es manté; si tornen amb la pregunta encara oberta, poden respondre.
4. **All-answered short-circuit**: si tothom connectat ha respost, `advanceToReveal()` sense esperar timer.
5. **Skip** durant `question` → `advanceToReveal()` immediat.
6. **End match** en qualsevol moment → `final` amb scores actuals.
7. **Timers** auto-transicionen: `question (20s) → reveal (5s) → leaderboard (5s) → next question | final`.
8. **Si el host desconnecta**: la sala segueix viva durant els 2 min de reconnect; cap alumne pot reclamar host; si el host no torna en 2 min, `endMatch(state)` + broadcast final + close de la room.

### 6.5 Privadesa de dades

- `currentQuestion` al `PublicState` **mai inclou `correcta` ni `explicacion`**.
- `myAnswerHistory[]` (amb correcta + explicacion) al `PrivateState` **només es genera a `phase === 'final'`** i s'envia individualment a cada `playerId`.

## 7. Scoring

```ts
// scoring.ts
export const SCORE_MAX = 1000;
export const SCORE_MIN_ON_CORRECT = 500;

export function scoreFor(isCorrect: boolean, elapsedMs: number, timerS: number): number {
  if (!isCorrect) return 0;
  const elapsedRatio = Math.min(1, elapsedMs / (timerS * 1000));
  return Math.round(SCORE_MAX - (SCORE_MAX - SCORE_MIN_ON_CORRECT) * elapsedRatio);
}
```

Cas | Punts
:--|--:
Correcta instant (t=0) | 1000
Correcta a meitat (t=10s amb timer 20s) | 750
Correcta al límit (t=20s) | 500
Incorrecta | 0
Timeout sense resposta | 0

## 8. Constants

```ts
// party/cajut/constants.ts
export const TIMER_QUESTION_S = 20;
export const TIMER_REVEAL_S = 5;
export const TIMER_LEADERBOARD_S = 5;

export const MIN_PLAYERS = 1;
export const MAX_PLAYERS = 40;

export const SCORE_MAX = 1000;
export const SCORE_MIN_ON_CORRECT = 500;

export const ROOM_CODE_LENGTH = 4;
export const ROOM_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export const RECONNECT_WINDOW_MS = 2 * 60 * 1000;

export const NICK_MAX_LENGTH = 20;

export const TOTAL_QUESTIONS_OPTIONS = [10, 15, 20, 25, 'all'] as const;
export const DEFAULT_TOTAL_QUESTIONS = 15;
```

## 9. UI — Host (projector, wide layout)

| Pantalla | Quan | Contingut |
|---|---|---|
| **HostLanding** | Sense sala creada | Logo "Cajút" + botó "Crear sala" |
| **HostLobby** | `phase: lobby` | Codi BIG (`A7K2`) + URL + QR · Selector asignatura (9 chips color-coded) · Checkboxes d'unitats publicades + counts · Slider preguntes (10/15/20/25/totes) · Llista alumnes connectats real-time · Botó "Començar" |
| **HostQuestion** | `phase: question` | Top: `Pregunta N/T` + chip asignatura · **Timer countdown gran** (M:SS) · Enunciat big (Fraunces SOFT 80) · 4 (o N) opcions color-coded en grid amb text · Indicador "X/Y respostes" · Botó discret "Saltar" |
| **HostReveal** | `phase: reveal` (5s) | Mateix layout, opció correcta destacada (border + glow), incorrectes difuminades, barres horizontals amb counts per opció |
| **HostLeaderboardMini** | `phase: leaderboard` (5s) | Top 5: nick + score total + delta (`+850`), animació re-ordenació |
| **HostFinal** | `phase: final` | Podi top 3 (caixes que pugen, primer al centre) · Leaderboard sencer scrolleable · Nota "Els alumnes poden revisar al mòbil" · Botons "Nova partida" + "Inici" |
| **Modal expulsar** | Overlay a Lobby/Question/etc. | Click sobre nick → confirm "Expulsar?" |

## 10. UI — Alumne (mòbil, vertical full-screen)

| Pantalla | Quan | Contingut |
|---|---|---|
| **PlayerJoin** | Sense codi a URL | Input codi 4 chars (autofocus, mayúscules) |
| **PlayerName** | Codi vàlid, sense nick | Input nick (max 20 chars) + "Entrar" |
| **PlayerWaiting** | `phase: lobby` | "Esperant que comence..." + codi petit + nick + llista nicks altres alumnes |
| **PlayerAnswer** | `phase: question` | **4 (o N) botons GRANS només color**, lletra A/B/C/D en Fraunces gegant · Top petit: `N/T` + timer · Subtext "Mira la pregunta a la pissarra" |
| **PlayerWaitOthers** | Resposta enviada, `phase: question` | "Resposta enviada! Esperant…" + comptador X/Y |
| **PlayerRevealLocal** | `phase: reveal` | Si encertat: pantalla fons verd "Encertat! +N" · Si fallat: fons vermell "Fallat. Era B" · Sota: "Vas Nº" |
| **PlayerLeaderboardMini** | `phase: leaderboard` | Top 5 amb el teu nick destacat si hi ets; si no, "Vas Nº amb X punts" |
| **PlayerFinal** | `phase: final` | Posició final gran + score · Botó "Revisa les teues respostes" → scroll pregunta a pregunta amb la teua resposta (verd/vermell), la correcta, i `explicacion` (única vegada que apareix) |

## 11. Color-coding d'opcions

Reusa la paleta Variant C; cap color nou.

| Opció | Color | Hex | Text |
|---|---|---|---|
| A | Terracota | `#C44E2C` | blanc |
| B | Teal | `#1F6E6E` | blanc |
| C | Mostassa | `#D4A24C` | tinta fosca `#3a2a10` |
| D | Pine | `#2E5E3A` | blanc |
| E (si 5 opcions) | Berenjena | `#5B3A4E` | blanc |
| F (si 6 opcions) | Marró fosc | `#7A5840` | blanc |

Mapatge cíclic agafant els primers N segons `opciones.length` (2–6, segons el schema del bank). Per a 2 opcions usar A i D (vermell vs. verd, contrast natural correcte/error).

## 12. Anti-cheating per disseny

Els mòbils mostren **només colors + lletra**, **sense text d'opció**. Espiar el mòbil del company no serveix de res sense la pissarra projectada. Solució elegant sense necessitar shuffle d'opcions per jugador (que complicaria estat servidor i evaluació).

## 13. Estats d'error

| Cas | Missatge a alumne | Acció |
|---|---|---|
| Sala plena (>40) | "Aquesta sala ja té 40 jugadors" | Retorna a PlayerJoin |
| Nick duplicat | "Ja hi ha un alumne amb aquest nick" | Mantens PlayerName, reintenta |
| Codi no trobat | "El codi A7K2 no existeix. Comprova-ho amb el profe" | Mantens PlayerJoin |
| Reconnexió | (silenciós) | Re-join automàtic via sessionStorage playerId |
| Pèrdua connexió permanent | "S'ha perdut la connexió. Recarrega per reintentar" | Botó recarregar |
| Match ja començat | "La partida ja ha començat. Espera el següent" | Retorna a PlayerJoin |
| Host se'n va > 2 min | "El profe ha sortit de la sala" | Pantalla final amb scores actuals |

## 14. Aesthetic guardrails

- **Tipografia**: Fraunces (`SOFT 80, WONK 0`) als titulars grans (enunciat HostQuestion, podi HostFinal, lletres A/B/C/D dels botons player). Switzer al cos i botons. JetBrains Mono al codi de sala, timer, scores numèrics.
- **Fons**: cream `#FBF6EC`, mai negre pur ni blanc pur.
- **Tinta**: `#2A1F18` (marró profund), mai `#000`.
- **Animacions**: mínimes; fade 200ms entre fases; stagger 400ms al podi top-3. **Cap "confetti", cap emoji-animat, cap gradient cridaner.**
- **Icones**: SVG inline si calen (cronòmetre, persones); **cap emoji pictogràfic**.
- **Pattern SSR-safe**: mai `sessionStorage` a `useState` initializer ni a render body. Mirar QuizPlayer.tsx / Insider HostApp/PlayerApp.

## 15. Estratègia de tests

| Capa | Eina | Què testem | Aprox. # |
|---|---|---|---|
| Lògica pura (`state.ts`) | vitest | Tots els transitions + casos guard (0 alumnes, nick duplicat, late-join blocat, double-answer, host fora del roster, etc.) | ~30 |
| Scoring (`scoring.ts`) | vitest | Decay lineal, incorrecte=0, timeout=0, clamp d'elapsed | ~6 |
| Questions loader (`questions.ts`) | vitest | `getPool` concatena, `samplePool` reproducible amb RNG injectable | ~5 |
| Manifest builder | vitest amb fs fixtures | Llig MDX `estado: publicado`, ignora `borrador/revision`, shape correcta, idempotent. Snapshot sobre mini-fixture | ~4 |
| Client wrapper (`client.ts`) | vitest amb mock PartySocket | Send/receive tipat, auto-rejoin al `open`, unsubscribe net | ~3 |
| Server (`server.ts`) | manual + smoke | Sense unit tests (thin orchestrator); smoke manual: `partykit dev` + 2 finestres → full flow lobby → final | smoke |
| Components UI | NO al MVP | Verificació manual + build verd, com a la resta de jocs | 0 |

**Objectiu**: ~48 tests nous; total projecte 374 + 48 ≈ 422.

## 16. Scope MVP

### Sí entra

1. Engine complet: lobby → question → reveal → leaderboard → final
2. Manifest pipeline (2 fitxers + script idempotent + prebuild hook)
3. Host: 7 pantalles + modal expulsar
4. Alumne: 8 pantalles inclosa revisió post-partida
5. Speed-bonus scoring (1000 → 500 → 0)
6. Controls profe: saltar / expulsar / acabar
7. Reconnexió 2 min, sessionStorage playerId, host fora del roster
8. Color-coding asignatura al lobby + chip a question screen
9. Tarja del joc al hub `/juegos/`
10. Castellà, Variant C, Fraunces/Switzer/JetBrains Mono
11. Docs deploy actualitzades

### NO entra (deixat per fase 2)

1. Persistència de matches (sense historial, sense DB)
2. CSV export per al profe
3. Llista de classe pre-omplida
4. Configuració de temps per pregunta
5. Toggle speed-bonus on/off
6. Pausa / Repetir pregunta
7. Imatges/diagrames a les preguntes
8. Català/valencià (com tot el web)
9. Shuffle d'opcions per jugador
10. Stats agregades cross-match
11. Modes alternatius (eliminatori, equips, T/F-only)

## 17. Defaults implícits

| # | Default | Per què |
|---|---|---|
| D1 | Tarja Cajút al hub `/juegos/` amb berenjena `#5B3A4E` per diferenciar d'Insider (pine `#2E5E3A`) | Coherent amb catàleg en producció |
| D2 | Mateix subdomini partykit (`pde-games.<user>.partykit.dev`); afegir `cajut` a parties map | Un sol deploy |
| D3 | Cap so (ni timer tick ni "correcte") | Coherent amb sobrietat editorial |
| D4 | Animacions mínimes; fade 200ms; podi stagger 400ms; sense confetti | Editorial sòbria |
| D5 | Si host se'n va: sala viva 2 min; primer alumne no pot reclamar host; si no torna, sala s'acaba i alumnes veuen "El profe ha sortit" | Mateix patró Insider; profe sempre control |
| D6 | Sense límit de matches simultànies | Naturalesa room-based de PartyKit |
| D7 | Nick filter mínim: longitud (max 20) + no buit + no només espais. Cap blocklist | YAGNI; expulsar manual és més robust |

## 18. Open questions / riscos

- **Idempotència del manifest amb canvis a `correcta`**: si Pau corregeix una resposta a un test publicat, el manifest es regenera al `prebuild`; les sales **en curs** no recarreguen (tenen el bank en memòria del servidor). Si una partida està viva quan es fa deploy, conviu amb l'antic durant uns minuts. **Acceptable**: les partides duren 10-15 min, el risc és menyspreable.
- **`partykit dev` en local + Vercel dev**: el frontend en local apunta a `localhost:1999` per defecte (env `PUBLIC_PARTYKIT_HOST`). Documentar bé al `docs/games-multi-deploy.md`.
- **Capacitat PartyKit free tier**: una sala = 1 Durable Object. El free tier de Cloudflare Workers + DO és holgat per al volum d'aula esperat (un profe a la vegada). Si Cajút es viralitza i molts profes l'usen alhora, monitoritzar i upgradejar.
- **Renderització de l'enunciat**: el bank actual usa strings simples sense markdown; alguns tests d'EDMN 2BACH poden tindre fórmules o llistes. **Decisió MVP**: renderitzar com a string pla; si trobem casos amb markdown ho avaluem al test final i obrim un fix follow-up.

## 19. Out of scope explícit

- Mockups de Lobby, Reveal, Final ja al spec (es resolen a implementació).
- Implementació concreta del shuffle de preguntes (Fisher-Yates amb RNG injectable, ben conegut).
- Política d'audit dels logs PartyKit (no n'hi ha; només telemetria bàsica del free tier).
