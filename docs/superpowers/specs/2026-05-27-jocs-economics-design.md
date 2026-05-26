# Jocs Econòmics — Disseny

> **Jocs Econòmics** és un quiz competitiu d'economia, finances i empresa amb ranking global persistent (individual + per institut), 3 vides, escala incremental de dificultat (gradient continu), banc gran reutilitzat des del concurs.html del webpde antic. Asíncron individual: el jugador entra en qualsevol moment, juga ~5-10 minuts, i compara amb la resta. Nom inspirat als Jocs Olímpics; institut = país; jugador = atleta.

- **Estat**: spec validat amb Pau el 2026-05-27. Pendent d'implementació.
- **Bucket**: substitueix l'antic "Concurso" (Bucket C de migration-map) i avança la Fase 2 de Supabase.
- **Backend**: Supabase (Postgres) + Astro API routes a Vercel. Primera funcionalitat amb persistència real del web.
- **Slug**: `jocs-economics` · **Display**: "Jocs Econòmics"

---

## 1. Visió en una frase

Crear el primer quiz competitiu en castellà d'economia/finances/empresa per a alumnes Batx ambiciosos, profes que repassen i opositors, amb ranking públic individual i per institut que generi competició interinstitut i tracció orgànica al web.

## 2. Decisions consolidades

| # | Aspecte | Decisió |
|---|---|---|
| 1 | Audiència | Mixta graduada Batx → universitari → oposició |
| 2 | Format partida | 3 vides; score acumulat fins eliminació; ranking max-score històric |
| 3 | Dificultat | Escala gradient continu (1.0–10.0); puja +0.2 per encert, es manté per error |
| 4 | Scoring | `Math.round(currentDifficulty × 100)` per encert; 0 per error; sense speed bonus |
| 5 | Categories | Barrejades (economia/finances/empresa); ranking únic |
| 6 | Nom del joc | **Jocs Econòmics** (slug `jocs-economics`) — referència Jocs Olímpics |
| 7 | Identitat jugador | Nom + Institut (text lliure, normalitzat al servidor) |
| 8 | Rankings | Individual all-time + Per institut (suma top-5 jugadors) |
| 9 | Auth | Anònim. Nom + Institut a localStorage. Cap email, cap OAuth. |
| 10 | Backend stack | Supabase (Postgres) + Astro API routes |
| 11 | Format pregunta | Multiple choice only (2-4 opcions) |
| 12 | Banc | Bootstrap des de `concurs.html` del webpde antic; ampliar amb LLM curat per Pau fins ≥100 publicades al MVP |
| 13 | Ranking display | Score + nº preguntes encertades + temps total |
| 14 | Desempats | Score (desc) → preguntes (desc) → temps (asc) |
| 15 | Timer per pregunta | 45 segons (sense afectar score; només per a `time_total_ms`) |
| 16 | Mode estudi | NO al MVP |

## 3. Arquitectura general

Approach A validat: **Supabase + Astro API routes**, banc al repo com a MDX, tot deployat a Vercel.

```
src/content/jocs-economics/preguntas/*.md    (font de veritat MDX, ~500 fitxers)
                  ↓ npm run prebuild
       scripts/build-jocs-bank.mjs
                ↙        ↘
public/jocs-economics/              src/server-only/
manifest.json                       jocs-bank.json
(comptadors agregats,               (banc complet amb correcta+explicacion,
servit per Vercel)                  importat per API routes Node)

                                              ↑
                                              │ import (server-only)
                                              │
                  ┌───────────────────────────┴──────────────┐
                  │   src/pages/api/jocs/                    │
                  │   start · answer · finish ·              │
                  │   leaderboard · institutes               │
                  └────────────────┬─────────────────────────┘
                                   │ @supabase/supabase-js
                                   │ (service-role key, server-only)
                                   ▼
                  ┌───────────────────────────────────────────┐
                  │   Supabase Postgres                       │
                  │   active_games · scores · institutes      │
                  │   + institute_leaderboard (MV)            │
                  │   + 2 pg_cron jobs (cleanup + refresh)    │
                  └───────────────────────────────────────────┘

src/components/jocs-economics/JocsApp.tsx (illa Preact)
   └─ fetch /api/jocs/* via src/lib/jocs-economics/client/api.ts
```

**Decisions claus**:
- Banc privat (`jocs-bank.json`) viu a `src/server-only/` per convenció — Astro respecta server-only en bundling.
- JWT HS256 amb secret `JOCS_TOKEN_SECRET` per a validar partides actives sense round-trip extra a la BD per a cada request.
- Stats agregades (counts del banc) a `manifest.json` són públics — útils per a UI ("287 preguntes esperant-te").
- Cap PartyKit (no és real-time multijugador).

## 4. Estructura de fitxers

```
src/content/jocs-economics/preguntas/
├── eco-0001-pib-definicio.md
├── eco-0002-...
├── fin-0001-...
└── emp-0001-...                              # ~500 fitxers eventualment

scripts/
├── build-jocs-bank.mjs                       # MDX → 2 JSONs (prebuild)
├── build-jocs-bank.test.mjs                  # vitest tests
├── __fixtures__/jocs-economics/preguntas/    # 3 preguntes test
└── extract-webpde-concurs.mjs                # bootstrap inicial des del webpde (run-once)

public/jocs-economics/manifest.json           # GITIGNORED (autogenerated)
src/server-only/jocs-bank.json                # GITIGNORED (autogenerated)

src/lib/jocs-economics/
├── server/
│   ├── bank.ts            # carrega jocs-bank.json, exposa nextQuestion()
│   ├── bank.test.ts
│   ├── difficulty.ts      # gradient evolution
│   ├── difficulty.test.ts
│   ├── scoring.ts         # scoreFor(currentDifficulty)
│   ├── scoring.test.ts
│   ├── ranking.ts         # compareScores + rankOf + tie-breakers
│   ├── ranking.test.ts
│   ├── institutes.ts      # normalitzar text → key
│   ├── institutes.test.ts
│   ├── tokens.ts          # JWT HS256 sign + verify
│   ├── tokens.test.ts
│   └── supabase.ts        # client server-only (service-role)
└── client/
    ├── api.ts             # wrapper tipat fetch (start/answer/finish/leaderboard/institutes)
    └── types.ts           # ApiContract: requests + responses + PublicQuestion

src/pages/api/jocs/
├── start.ts               # POST  → { gameId, token, firstQuestion }
├── start.test.ts
├── answer.ts              # POST  → { result, nextQuestion | finished }
├── answer.test.ts
├── finish.ts              # POST  → { final }
├── finish.test.ts
├── leaderboard.ts         # GET   ?type=individual|institute
├── leaderboard.test.ts
└── institutes.ts          # GET   ?q=lluis (autocompletat)

src/components/jocs-economics/
├── JocsApp.tsx            # illa Preact root + router per fase
├── jocs.css               # estils dedicats (Variant C + 4 colors d'opcions)
└── screens/
    ├── Welcome.tsx        # Nom + Institut + Comença
    ├── Playing.tsx        # pregunta + 4 botons + vides + timer + multiplicador
    ├── Result.tsx         # encert/error + scoreGain + explicació + Següent
    ├── GameOver.tsx       # final + posició + share + Jugar de nou
    └── Leaderboard.tsx    # tabs Individual | Instituts + paginació

src/pages/jocs-economics/
├── index.astro            # ruta principal (carrega JocsApp)
└── leaderboard/index.astro # ruta directa al leaderboard (URL compartible)

src/pages/juegos/index.astro    # afegir tarja "Jocs Econòmics" (#1F4E6E blau profund)
docs/jocs-economics-deploy.md   # secrets Supabase, env vars, migracions SQL
supabase/migrations/20260527_init_jocs.sql  # creació de taules + indexs + view + crons
.env.example                    # documentar SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, JOCS_TOKEN_SECRET, PUBLIC_SUPABASE_URL
package.json                    # afegir build:jocs-bank al prebuild
.gitignore                      # ignorar els 2 fitxers generats
```

## 5. State machine + scoring + dificultat

### 5.1 Phase machine

```
client                                server (Supabase active_games)
──────                                ─────────────────────────────
welcome (just client-side)
  │ POST /api/jocs/start
  ▼                                   create row { game_id, lives=3, score=0,
                                                   current_difficulty=1.0 }
                                      pick first question (bank.ts)
                                      return { gameId, token, firstQuestion }
playing  ◀──────────┐
  │                 │
  │ POST            │                 verify token + load row
  │ /api/jocs/      │                 validate questionId, optionIdx, time
  │ answer          │                 compute isCorrect, scoreGain
  │                 │                 update row + pick nextQuestion
  ▼                 │                 OR if lives==0: copy → scores, delete row
result              │                 return { result, nextQuestion | finished }
  │ next click      │
  └─────────────────┘
  │
  │ (lives==0 OR voluntary /finish)
  ▼
gameover
  │ optional view leaderboard
  ▼
leaderboard
```

### 5.2 Difficulty (gradient continu)

```ts
// src/lib/jocs-economics/server/difficulty.ts
export const DIFFICULTY_MIN = 1.0;
export const DIFFICULTY_MAX = 10.0;
export const DIFFICULTY_STEP_CORRECT = 0.2;
export const DIFFICULTY_STEP_INCORRECT = 0;

export function nextDifficulty(current: number, isCorrect: boolean): number {
  const delta = isCorrect ? DIFFICULTY_STEP_CORRECT : DIFFICULTY_STEP_INCORRECT;
  return Math.min(DIFFICULTY_MAX, Math.max(DIFFICULTY_MIN, current + delta));
}
```

### 5.3 Scoring

```ts
// src/lib/jocs-economics/server/scoring.ts
export function scoreFor(currentDifficulty: number): number {
  return Math.round(currentDifficulty * 100);
}
// → a difficultat 1.0 = 100 punts per encert
// → a 5.0 = 500
// → a 10.0 = 1000
// Error: scoreGain = 0
```

### 5.4 Bank selection

```ts
// src/lib/jocs-economics/server/bank.ts
export function nextQuestion(
  targetDifficulty: number,
  seen: string[],
  rng: () => number
): Question {
  // Finestra inicial ±0.5; eixampla a ±1.0, ±2.0, infinit si cal
  // Filtra preguntes no vistes
  // Tria aleatòriament entre candidates (rng seeded per gameId per al servidor)
  // Si banc esgotat: throw (gestionar a /answer com a 'bank-exhausted' → finalitza partida)
}
```

RNG seeded amb `gameId` (UUID) → seqüència determinística però imprevisible per al client. El client mai sap la propera pregunta.

### 5.5 Ranking + tie-breakers

```ts
// src/lib/jocs-economics/server/ranking.ts
export interface ScoreEntry {
  score: number;
  questionsAnswered: number;
  timeTotalMs: number;
}

export function compareScores(a: ScoreEntry, b: ScoreEntry): number {
  if (a.score !== b.score) return b.score - a.score;             // desc
  if (a.questionsAnswered !== b.questionsAnswered) {
    return b.questionsAnswered - a.questionsAnswered;             // desc
  }
  return a.timeTotalMs - b.timeTotalMs;                          // asc (menys = millor)
}
```

## 6. Schema Supabase

### 6.1 `active_games` (efímer)

```sql
create table active_games (
  game_id uuid primary key default gen_random_uuid(),
  player_name text not null,
  institute_norm text not null,
  institute_display text not null,
  created_at timestamptz not null default now(),
  last_action_at timestamptz not null default now(),
  current_difficulty real not null default 1.0,
  lives smallint not null default 3 check (lives >= 0 and lives <= 3),
  score integer not null default 0,
  questions_answered integer not null default 0,
  time_total_ms integer not null default 0,
  seen_question_ids text[] not null default '{}',
  current_question_id text,
  current_question_started_at timestamptz,
  finished boolean not null default false
);
create index active_games_cleanup_idx
  on active_games (last_action_at) where finished = false;
alter table active_games enable row level security;
-- No policy → només service-role escriu/llig
```

### 6.2 `scores` (persistent — el leaderboard)

```sql
create table scores (
  id bigserial primary key,
  game_id uuid not null unique,
  player_name text not null,
  institute_norm text not null,
  institute_display text not null,
  score integer not null,
  questions_answered integer not null,
  time_total_ms integer not null,
  max_difficulty_reached real not null,
  finished_at timestamptz not null default now()
);
create index scores_individual_rank_idx
  on scores (score desc, questions_answered desc, time_total_ms asc);
create index scores_by_institute_idx
  on scores (institute_norm, score desc);
create index scores_finished_at_idx on scores (finished_at desc);
alter table scores enable row level security;
```

### 6.3 `institutes` (catàleg per a autocompletat)

```sql
create extension if not exists pg_trgm;

create table institutes (
  institute_norm text primary key,
  institute_display text not null,
  players_count integer not null default 1,
  last_seen_at timestamptz not null default now()
);
create index institutes_search_idx
  on institutes using gin (institute_display gin_trgm_ops);
alter table institutes enable row level security;
```

### 6.4 `institute_leaderboard` (vista materialitzada)

Vista materialitzada amb la suma top-5 per institut (vegeu §4 del brainstorm). Refrescada cada 5 min via pg_cron. Schema complet implementat al fitxer `supabase/migrations/20260527_init_jocs.sql`.

### 6.5 Cron jobs (pg_cron)

```sql
-- Neteja partides abandonades cada 5 min
select cron.schedule(
  'jocs-cleanup-active-games', '*/5 * * * *',
  $$ delete from active_games
     where finished = true
        or last_action_at < now() - interval '30 minutes'; $$
);

-- Refresca institute_leaderboard cada 5 min
select cron.schedule(
  'jocs-refresh-institute-leaderboard', '*/5 * * * *',
  $$ refresh materialized view concurrently institute_leaderboard; $$
);
```

## 7. API endpoints + contractes

Tots a `src/pages/api/jocs/`. JSON request/response. Token JWT al body.

### 7.1 `POST /api/jocs/start`

```ts
// Request
{ playerName: string; institute: string }

// Response 200
{
  gameId: string;
  token: string;
  question: PublicQuestion;   // { id, enunciado, opciones[] } SENSE correcta
  lives: 3;
  score: 0;
}

// Response 4xx
{ error: 'invalid-name' | 'invalid-institute' | 'rate-limited' }
```

Validacions: `playerName` 1-40 chars trimmed; `institute` 2-80 chars trimmed. Rate limit IP: 1 partida activa, 20/hora.

Side effects: insereix `active_games` + upsert `institutes` (incrementa `players_count` si nou usuari).

### 7.2 `POST /api/jocs/answer`

```ts
// Request
{
  gameId: string;
  token: string;
  questionId: string;
  optionIdx: number;
  clientElapsedMs: number;
}

// Response 200 — continuant
{
  result: {
    isCorrect: boolean;
    correctIdx: number;
    scoreGain: number;
    livesLeft: number;
    elapsedMsRecorded: number;
    explicacion?: string;
  };
  nextQuestion: PublicQuestion;
  totals: { score, questionsAnswered, timeTotalMs };
}

// Response 200 — finalitzat (lives=0 o timeout fatal o banc-exhausted)
{
  result: { /* mateix shape però livesLeft: 0 */ };
  finished: true;
  final: {
    score, questionsAnswered, timeTotalMs, maxDifficultyReached,
    finalRank: number | null;       // null si no top 1000
    instituteRank: number | null;   // null si no top 100
  };
}

// Response 4xx
{ error: 'invalid-token' | 'invalid-game' | 'wrong-question' | 'already-finished' | 'invalid-option' }
```

Lògica interna (resumida; spec completa a la implementació):

1. Verifica JWT signature + expiry.
2. SELECT `active_games[gameId]`; verifica `finished=false` i `questionId === current_question_id`.
3. `serverElapsedMs = now - current_question_started_at`.
4. Si `serverElapsedMs > 50000` → forçat `isCorrect=false` (timeout); `elapsedMsRecorded=45000`.
5. Sinó: `isCorrect = (optionIdx === bank[questionId].correcta)`; `elapsedMsRecorded = min(serverElapsedMs, clientElapsedMs + 2000)`.
6. `scoreGain = isCorrect ? scoreFor(current_difficulty) : 0`.
7. UPDATE: score, questions_answered, time_total_ms, seen_question_ids, lives (decr si error), current_difficulty.
8. Si `lives === 0`:
   - INSERT INTO `scores` (copia stats finals + `max_difficulty_reached`).
   - DELETE FROM `active_games` (o marca `finished=true`; el cron netejarà).
   - Calcula `finalRank` (per `compareScores`) i `instituteRank` (per `institute_leaderboard` view).
   - Retorna `finished: true`.
9. Sinó: `nextQ = nextQuestion(current_difficulty, seen)`, UPDATE `current_question_id` + `current_question_started_at = now`, retorna.

### 7.3 `POST /api/jocs/finish`

Per a "Acabar" voluntari. Iguala el flow del lives=0. Resposta: `{ final }`.

**Restricció**: si `questionsAnswered < 5` quan es crida `/finish`, la partida es descarta sense insertar a `scores` (D7).

### 7.4 `GET /api/jocs/leaderboard`

```ts
// Query
?type=individual | institute
&limit=50  (default 50, max 200)
&offset=0  (default 0, per a paginació)

// Response 200 — individual
{ type: 'individual', rows: Array<{
  rank, playerName, institute, score, questionsAnswered, timeTotalMs, finishedAt
}> }

// Response 200 — institute (de la vista materialitzada)
{ type: 'institute', rows: Array<{
  rank, institute, totalScore, playersCount, topPlayer: { playerName, score }
}> }
```

Cacheable amb `Cache-Control: public, max-age=30, s-maxage=30`.

### 7.5 `GET /api/jocs/institutes`

```ts
// Query
?q=lluis  (mínim 2 chars)

// Response 200
{ suggestions: string[] }   // top-10 noms canònics que matchen
```

Cacheable 5 min.

## 8. Pipeline del banc

### 8.1 MDX frontmatter (font de veritat)

```md
---
id: eco-0001-pib-definicio
categoria: economia                  # economia | finances | empresa
dificultat: 2.5                      # float 1.0–10.0
opciones:
  - "La suma del valor de mercat de tots els béns i serveis finals..."
  - "..."
  - "..."
  - "..."
correcta: 0
explicacion: "El PIB compta béns FINALS per evitar doble computació..."
estado: publicado                    # borrador | revision | publicado
font: "webpde-concurs.html"          # traçabilitat
revisat_per: pau
revisat_at: 2026-05-27
---
```

### 8.2 Zod schema (content collection)

Definit a `src/content.config.ts` — afegir `jocsEconomicsPreguntas` collection amb glob `jocs-economics/preguntas/**/*.md` i validació `correcta < opciones.length`.

### 8.3 Build pipeline

```
src/content/jocs-economics/preguntas/*.md
                  ↓ scripts/build-jocs-bank.mjs (prebuild)
                ↙        ↘
public/jocs-economics/             src/server-only/
manifest.json                      jocs-bank.json
{ totals, byCategoria,             { preguntas: [
  byDificultatBand }                  { id, categoria, dificultat,
SENSE preguntes                       opciones, correcta, explicacion? }
                                    ] }
```

Filtre `estado === 'publicado'` aplicat. Idempotent.

### 8.4 npm scripts

```jsonc
{
  "build:jocs-bank": "node scripts/build-jocs-bank.mjs",
  // Prebuild composat (cada game multi té el seu manifest):
  "prebuild": "npm run build:cajut-manifest && npm run build:jocs-bank"
}
```

(Si calen més passos al `prebuild` en el futur — e.g. tercer game multi — s'afegeixen amb `&&` mantenint l'ordre cronològic.)

### 8.5 Bootstrap des de webpde (tasca pre-MVP)

`scripts/extract-webpde-concurs.mjs` (run-once):
- WebFetch `https://raw.githubusercontent.com/skinnydkd/webpde/main/concurs.html`
- Parse JS array de preguntes (o HTML segons formato)
- Map a MDX amb `estado: 'revision'` (no `publicado` — Pau revisa)
- Escriu fitxers a `src/content/jocs-economics/preguntas/`
- Pau revisa, calibra dificultat 1-10, canvia `estado` a `publicado`

### 8.6 Ampliació amb LLM (post-MVP, eina opcional)

`scripts/llm-augment-bank.mjs` per a generar preguntes noves. Estado inicial: `borrador`. Pau revisa manualment.

## 9. UI screens

### 9.1 Welcome

Logo "Jocs Econòmics" (Fraunces italic), descripció breu, comptadors del manifest ("287 preguntes · 3 categories"), input Nom + input Institut (amb autocompletat via `/api/jocs/institutes`), botó "Comença", link discret "Veure rànquing →". Si ja vam jugar, pre-omple amb localStorage `jocs:player`.

### 9.2 Playing

Top bar: `●●●` vides (cercles tipogràfics) + score actual + multiplicador (`1.8x`) — es mostra el multiplicador-de-score, no la dificultat numèrica exacta del banc, per evitar metagaming. Timer bar 45s (terracota; passa a profund a 10s).

Centre: enunciat Fraunces 22-24px. Sota: 4 (o N) botons color-coded (terracota/teal/mostassa/pine) amb lletra Fraunces + text Switzer.

Bottom: link discret "Acabar" amb confirm.

Click opció → `POST /answer` → transita a Result.

Sense indicador de categoria (anti-metagaming).

### 9.3 Result (overlay 4s o click)

Si encert: "Encertat!" en pine + "+180 punts". Opció triada destacada. Explicación si existeix.

Si error: "Fallat" en terracota profund + "-1 vida". Mostra correcta (pine) i triada (terracota profund). Explicación si existeix.

Botó "Següent →" o auto-advance 4s.

### 9.4 GameOver

Score final gran. Stats: preguntes encertades, temps total, nivell màxim. Posició individual #N / total. Institut + posició institut. Botons "Jugar de nou" (reusa identitat, `POST /start`) i "Veure rànquing". "Comparteix →" via Web Share API.

### 9.5 Leaderboard

Ruta `/jocs-economics/leaderboard/` (compartible). Tabs Individual | Instituts.

**Individual**: rank · nom · institut · score · preguntes · temps. Paginació 50.

**Instituts**: rank · institut · total top-5 · top jugador · jugadors únics. Paginació 50.

Default sort: `compareScores` (score desc → preg desc → temps asc). El SSR del primer batch per a SEO + share-friendliness.

### 9.6 Estètica + patrons

- Cream `#FBF6EC` bg, ink `#2A1F18`, sense gradients
- Fraunces titulars (SOFT 80; WONK 1 a Encertat/Fallat italic), Switzer cos, JetBrains Mono stats numèrics
- Cap emoji pictogràfic (vides `●○` tipogràfic, podi implícit pel color)
- 4 colors d'opcions = mateixa paleta Cajút (reutilitzable jocs.css)
- SSR-safe: cap localStorage/fetch a useState initializer; tot a useEffect
- Mobile-first, max-width 640px centered

## 10. Anti-cheat

Defenses per vector (vegeu §7 del brainstorm per a la taula completa V1-V11):

- **V1-V2 (inspecció client)**: banc privat en `src/server-only/`, correcta no surt fins POST processat
- **V3 (background tab + Google)**: timer 45s server-validated; > 50s forçat incorrecte
- **V4 (refresh per repetir pregunta)**: token sessionStorage; refresh = nova partida = nova pregunta
- **V5 (bot)**: NO blocat al MVP; loggat per anàlisi
- **V6 (perfils falsos per inflar institut)**: aturat per disseny (suma top-5)
- **V7 (modificar request)**: score/lives no s'envien al body; server source of truth
- **V8 (JWT manipulació)**: HS256 + secret server-only
- **V9 (partides simultànies)**: rate limit 1 activa/IP
- **V10 (compartir respostes amistat)**: RNG seeded per gameId; mitigació parcial
- **V11 (inflar temps)**: server recalcula `min(serverElapsed, clientElapsedMs + 2000)`; només pots empitjorar, no millorar

Transversal: CORS estricte (`profedeeconomia.es` + `localhost` dev), no exposar dificultat exacta al client (només multiplicador), logging de `clientElapsedMs` vs `serverElapsedMs` per a anàlisi post-mortem.

## 11. Estratègia de tests

| Capa | Eina | # aprox |
|---|---|---|
| `difficulty.ts` | vitest | 5 |
| `scoring.ts` | vitest | 4 |
| `bank.ts` (loader + selector amb seed) | vitest + fixtures JSON | 8 |
| `ranking.ts` (tie-breakers triple) | vitest | 6 |
| `institutes.ts` (normalitzador) | vitest | 5 |
| `tokens.ts` (JWT) | vitest | 5 |
| `build-jocs-bank.mjs` (pipeline) | vitest + fs fixtures | 5 |
| 5 API routes (mock Supabase) | vitest | 15 |
| Components UI | NO al MVP (manual) | 0 |
| E2E Supabase real | smoke a T-final | smoke |

**Total estimat**: ~53 tests nous. Total projecte: 500 → ~553.

## 12. Scope MVP

### 12.1 Sí entra

1. Engine: difficulty + scoring + bank selection + game state machine
2. 5 API routes: start, answer, finish, leaderboard, institutes
3. JWT sign/verify
4. Banc pipeline MDX → 2 JSONs + prebuild hook
5. Bootstrap des de webpde concurs.html (extracció + revisió Pau)
6. Schema Supabase complet (3 taules + MV + 2 crons)
7. Rate limiting per IP
8. Anti-cheat V1-V4, V6-V8, V11
9. 5 screens UI: Welcome, Playing, Result, GameOver, Leaderboard
10. Tarja al hub `/juegos/` (color blau profund `#1F4E6E`)
11. 2 rutes Astro
12. Docs deploy (`docs/jocs-economics-deploy.md`)
13. UI en castellà (alineat amb la resta del web MVP)
14. ≥ 100 preguntes publicades abans d'obrir al públic (D4)

### 12.2 NO entra (fase 2+)

1. Mode estudi
2. Magic-link auth
3. Ranking setmanal / mensual
4. Badges / achievements
5. Perfil de jugador navegable
6. Filtres de leaderboard (categoria, dificultat...)
7. Multi-idioma (CA + ES)
8. Admin UI (Pau via Supabase dashboard)
9. reCAPTCHA / bot detection
10. Comentaris / xat / social
11. Ampliació LLM del banc automatitzada (eina separada)
12. Mode multiplayer real-time (no és Jocs Econòmics)

## 13. Defaults implícits

| # | Default | Per què |
|---|---|---|
| D1 | Tarja hub: blau profund `#1F4E6E` | Distintiu d'Insider pine i Cajút berenjena; evoca formalitat |
| D2 | Timer 45s/pregunta | Equilibri "alt nivell pensa" vs "no s'eternitza" |
| D3 | UI en castellà | Alineat amb la resta del web MVP (no com Cajút que va sortir CA per accident) |
| D4 | ≥ 100 preguntes publicades abans d'obrir | Sota el llindar, repeteix massa ràpid |
| D5 | Refresh = nova partida | Sense reconnexió cross-tab (simplicitat MVP) |
| D6 | Animacions mínimes (fade 200ms), sense so | Sobrietat editorial Variant C |
| D7 | "Acabar" voluntari amb `questionsAnswered < 5` no compta al ranking | Anti-grinding |
| D8 | Idempotència `/answer`: retry no compta doble | Detectat per `wrong-question` ja avançat |
| D9 | Avís privacitat discret a Welcome ("el teu nom i institut apareixeran al rànquing") | GDPR-friendly sense formulari opacitat |
| D10 | Cap blocklist de paraulotes (com Cajút) | Pau purga manualment si calgués |

## 14. Open questions / riscos

- **Tracció del leaderboard**: si menys de 50 jugadors actius la 1a setmana, el rànquing institut serà inert. Mitigació: difondre entre profes coneguts; activar abans entre alumnes de Pau com a beta tancada.
- **Bootstrap del webpde**: depèn de poder parsejar `concurs.html` (HTML antic). Si el format és inconvenient, fallback a re-autoria parcial amb LLM. Tasca primer al pla per a desblocar el banc.
- **Supabase free tier**: 500 MB Postgres + 2 GB egress/mes. ~2.5 M scores capacity → segur. Egress: 1 leaderboard query ≈ 5 KB; 100 K visites/mes ≈ 500 MB. Sobre. Upgrade a $25/mes si supera.
- **Difficulty calibration**: la dificultat de cada pregunta es marca per Pau manualment a `revisat_at`. Subjectiva. Si dos alumnes amb mateix knowledge tenen diferents partides molt diferents, és pq el sample va caure on els uns dominen i els altres no — natural i acceptable.
- **Cap timer client perfectament sincronitzat amb server**: les xarxes mòbil tenen latència variable. Tolerància 2s grace a `min(serverElapsed, clientElapsedMs+2000)` mitiga.

## 15. Out of scope explícit

- Cap pantalla d'admin UI per a moderació de scores. Pau via Supabase dashboard.
- Cap export CSV / API pública del leaderboard.
- Cap notification (email/push) quan algú et supera al ranking.
- Cap "amistat" / "seguir" altres jugadors.
- Cap historial de partides individual ("Les meves últimes 10 partides") — sols el millor score persisteix conceptualment al ranking; la resta no es mostra.
- Cap leaderboard per país, comunitat autònoma, o regió. Només individual + per institut.
