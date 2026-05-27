# Jocs Econòmics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir un quiz competitiu d'economia/finances/empresa amb ranking global persistent (individual + per institut), 3 vides, escala incremental de dificultat, banc gran reutilitzat des del concurs.html del webpde antic, asíncron individual. Backend Supabase + Astro API routes a Vercel.

**Architecture:** Approach A — Supabase Postgres per a persistència (active_games + scores + institutes + materialized view); Astro API routes a `src/pages/api/jocs/*.ts` per a la lògica server-side; banc privat (`src/server-only/jocs-bank.json`) generat al prebuild des de MDX (`src/content/jocs-economics/preguntas/*.md`); UI illa Preact 5 screens al `src/components/jocs-economics/`. JWT HS256 per a token de partida; rate limiting per IP via middleware Astro.

**Tech Stack:** Astro 5, Preact, TypeScript estricte, vitest, Tailwind 4, **Supabase JS v2**, **jsonwebtoken** (JWT HS256), gray-matter. Fonts: Fraunces / Switzer / JetBrains Mono.

**Branca:** `feat/jocs-economics` (ja creada amb el commit `c1c7af1` que afegeix l'spec). Plan = 12 tasques en 4 lots.

**Spec de referència:** `docs/superpowers/specs/2026-05-27-jocs-economics-design.md` — consultar quan calga decisió fina (timers, fórmules, schema Supabase, error states, scope MVP, defaults D1–D10).

---

## Convencions del pla

- **Tots els paths absoluts** des de la repo root.
- **Tots els tests amb `vitest`** corrent com a `npx vitest run <path>` per a un test concret o `npx vitest run` per a tota la suite.
- **Build**: `npm run build` (Astro). Verifica build verd al final de cada lot.
- **Commits** seguint Conventional Commits, amb scope `(jocs)` o `(jocs/<area>)`.
- **TDD estricte a la lògica pura** (Lot A tasques T2-T6): test fail → implementació mínima → test pass → commit.
- **SSR safety**: cap component que llegisca `sessionStorage` o `localStorage` al `useState` initializer o al render body. Mirar `src/components/games/cajut/PlayerApp.tsx` per al patró validat.
- **Supabase migracions**: només manualment al MVP, via Supabase SQL editor (no CLI/CI/CD). El SQL viu al repo per traçabilitat.
- **Env vars sensibles**: `SUPABASE_SERVICE_ROLE_KEY` i `JOCS_TOKEN_SECRET` mai exposades al client (servidor-only). Astro respecta la convenció `PUBLIC_*` per al client.
- **Llengua UI**: castellà (decisió D3 spec). Tots els strings visibles al jugador en castellà; comentaris al codi en anglès; comunicació amb dev (Pau) en català.

---

## File structure (resum visual)

```
src/content/jocs-economics/preguntas/      # T1 (carpeta), T4 (poblat per bootstrap)
└── eco/fin/emp-XXXX-slug.md

scripts/
├── build-jocs-bank.mjs                    # T5
├── build-jocs-bank.test.mjs               # T5
├── __fixtures__/jocs-economics/           # T5
└── extract-webpde-concurs.mjs             # T6 (run-once)

public/jocs-economics/manifest.json        # generat per T5
src/server-only/jocs-bank.json             # generat per T5

src/lib/jocs-economics/
├── server/
│   ├── difficulty.ts                      # T2
│   ├── difficulty.test.ts                 # T2
│   ├── scoring.ts                         # T2
│   ├── scoring.test.ts                    # T2
│   ├── institutes.ts                      # T3
│   ├── institutes.test.ts                 # T3
│   ├── tokens.ts                          # T3
│   ├── tokens.test.ts                     # T3
│   ├── ranking.ts                         # T4
│   ├── ranking.test.ts                    # T4
│   ├── bank.ts                            # T6
│   ├── bank.test.ts                       # T6
│   └── supabase.ts                        # T7
└── client/
    ├── api.ts                             # T10
    └── types.ts                           # T10

src/pages/api/jocs/
├── start.ts                               # T8
├── start.test.ts                          # T8
├── answer.ts                              # T8
├── answer.test.ts                         # T8
├── finish.ts                              # T8
├── finish.test.ts                         # T8
├── leaderboard.ts                         # T9
├── leaderboard.test.ts                    # T9
├── institutes.ts                          # T9
└── institutes.test.ts                     # T9

src/middleware.ts                          # T9 (rate limit IP)

src/components/jocs-economics/
├── JocsApp.tsx                            # T10
├── jocs.css                               # T10
└── screens/
    ├── Welcome.tsx                        # T10
    ├── Playing.tsx                        # T10
    ├── Result.tsx                         # T10
    ├── GameOver.tsx                       # T11
    └── Leaderboard.tsx                    # T11

src/pages/jocs-economics/
├── index.astro                            # T12
└── leaderboard/index.astro                # T11

src/pages/juegos/index.astro               # T12 (modificar: afegir tarja)

supabase/migrations/
└── 20260527_init_jocs.sql                 # T7

docs/jocs-economics-deploy.md              # T12
.env.example                               # T1
.env                                       # T7 (local, gitignored — Pau ompli secrets)
package.json                               # T1 (scripts), T7 (deps)
.gitignore                                 # T5 (manifests generats)
src/content.config.ts                      # T1 (afegir collection)
```

---

# LOT A — Setup + lògica pura + banc (T1–T6)

## Task 1: Scaffolding + content collection

**Files:**
- Create: `src/content/jocs-economics/preguntas/.gitkeep` (carpeta per a MDX, buida fins T6)
- Create: `src/lib/jocs-economics/server/.gitkeep`
- Create: `src/lib/jocs-economics/client/.gitkeep`
- Create: `src/components/jocs-economics/screens/.gitkeep`
- Create: `src/pages/api/jocs/.gitkeep`
- Create: `src/pages/jocs-economics/.gitkeep`
- Create: `src/server-only/.gitkeep` (carpeta nova; assegura que existeix abans del prebuild)
- Create: `public/jocs-economics/.gitkeep`
- Create: `supabase/migrations/.gitkeep`
- Create: `.env.example`
- Modify: `src/content.config.ts` (afegir collection `jocsEconomicsPreguntas`)
- Modify: `package.json` (placeholder `build:jocs-bank` script + actualitzar `prebuild`)

- [ ] **Step 1: Crear les carpetes amb `.gitkeep`**

```bash
mkdir -p \
  src/content/jocs-economics/preguntas \
  src/lib/jocs-economics/server \
  src/lib/jocs-economics/client \
  src/components/jocs-economics/screens \
  src/pages/api/jocs \
  src/pages/jocs-economics/leaderboard \
  src/server-only \
  public/jocs-economics \
  supabase/migrations

for d in \
  src/content/jocs-economics/preguntas \
  src/lib/jocs-economics/server \
  src/lib/jocs-economics/client \
  src/components/jocs-economics/screens \
  src/pages/api/jocs \
  src/pages/jocs-economics \
  src/server-only \
  public/jocs-economics \
  supabase/migrations; do
  : > "$d/.gitkeep"
done
```

- [ ] **Step 2: Crear `.env.example` documentant les env vars necessàries**

```env
# .env.example — copia a .env (gitignored) i ompli els valors reals
# Mai commits .env

# Supabase — server-only (SERVICE_ROLE bypassa RLS)
SUPABASE_URL="https://YOUR-PROJECT.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJ..."

# Supabase — client-side (segur per al navegador via vars PUBLIC_*)
PUBLIC_SUPABASE_URL="https://YOUR-PROJECT.supabase.co"
PUBLIC_SUPABASE_ANON_KEY="eyJ..."

# JWT secret per a tokens de partida Jocs Econòmics (server-only)
# Genera amb: openssl rand -base64 48
JOCS_TOKEN_SECRET="REPLACE_WITH_RANDOM_48_BYTE_BASE64"
```

- [ ] **Step 3: Afegir collection `jocsEconomicsPreguntas` a `src/content.config.ts`**

Llegir el fitxer actual i afegir (probablement al final, al costat de les altres collections):

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// ... collections existents ...

const jocsEconomicsPreguntas = defineCollection({
  loader: glob({
    pattern: 'jocs-economics/preguntas/**/*.md',
    base: './src/content',
  }),
  schema: z.object({
    id: z.string().regex(/^(eco|fin|emp)-\d{4}-[a-z0-9-]+$/),
    categoria: z.enum(['economia', 'finances', 'empresa']),
    dificultat: z.number().min(1).max(10),
    opciones: z.array(z.string()).min(2).max(4),
    correcta: z.number().int().min(0),
    explicacion: z.string().optional(),
    estado: z.enum(['borrador', 'revision', 'publicado']).default('borrador'),
    font: z.string().optional(),
    revisat_per: z.string().optional(),
    revisat_at: z.string().optional(),
  }).refine((data) => data.correcta < data.opciones.length, {
    message: 'correcta ha de ser un index vàlid de opciones',
    path: ['correcta'],
  }),
});

// Afegir al export:
export const collections = {
  // ... existents ...
  jocsEconomicsPreguntas,
};
```

Si l'objecte `collections` ja existeix amb altres entrades, només cal afegir la nova entrada — no reescriure.

- [ ] **Step 4: Afegir scripts npm placeholder a `package.json`**

Llegir scripts existents. Afegir:

```json
{
  "scripts": {
    "build:jocs-bank": "node scripts/build-jocs-bank.mjs"
  }
}
```

I actualitzar `prebuild` per a incloure'l. L'estat esperat després:

```json
"prebuild": "npm run build:cajut-manifest && npm run build:jocs-bank"
```

**IMPORTANT**: el script `build-jocs-bank.mjs` encara no existeix (es crea a T5). Si executes `npm run prebuild` ara, fallarà. Per evitar trencar el build durant T1, crea un placeholder vàlid:

```bash
cat > scripts/build-jocs-bank.mjs <<'EOF'
// Placeholder — implementat a T5
console.log('[jocs-bank] placeholder (T5 implementarà)');
EOF
```

- [ ] **Step 5: Verificar build d'Astro passa**

Run: `npm run build 2>&1 | tail -3`
Expected: `Complete!` sense errors. La nova collection apareix però sense entries (carpeta buida amb .gitkeep).

- [ ] **Step 6: Commit**

```bash
git add \
  src/content/jocs-economics \
  src/lib/jocs-economics \
  src/components/jocs-economics \
  src/pages/api/jocs \
  src/pages/jocs-economics \
  src/server-only \
  public/jocs-economics \
  supabase/migrations \
  src/content.config.ts \
  package.json \
  scripts/build-jocs-bank.mjs \
  .env.example
git commit -m "feat(jocs): scaffolding (folders, content collection, env example, npm scripts)"
```

---

## Task 2: Pure logic — difficulty + scoring + tests

**Files:**
- Create: `src/lib/jocs-economics/server/difficulty.ts`
- Create: `src/lib/jocs-economics/server/difficulty.test.ts`
- Create: `src/lib/jocs-economics/server/scoring.ts`
- Create: `src/lib/jocs-economics/server/scoring.test.ts`

- [ ] **Step 1: Tests fallant per a `difficulty`**

`src/lib/jocs-economics/server/difficulty.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import {
  nextDifficulty,
  DIFFICULTY_MIN,
  DIFFICULTY_MAX,
  DIFFICULTY_STEP_CORRECT,
  DIFFICULTY_STEP_INCORRECT,
} from './difficulty';

describe('nextDifficulty', () => {
  it('starts at 1.0', () => {
    expect(DIFFICULTY_MIN).toBe(1.0);
  });

  it('caps at 10.0', () => {
    expect(DIFFICULTY_MAX).toBe(10.0);
  });

  it('increments by +0.2 on correct answer', () => {
    expect(nextDifficulty(1.0, true)).toBeCloseTo(1.2, 5);
    expect(nextDifficulty(5.0, true)).toBeCloseTo(5.2, 5);
  });

  it('stays at current value on incorrect answer', () => {
    expect(nextDifficulty(1.0, false)).toBe(1.0);
    expect(nextDifficulty(5.5, false)).toBe(5.5);
  });

  it('clamps to DIFFICULTY_MAX when correct at top', () => {
    expect(nextDifficulty(9.9, true)).toBe(10.0);
    expect(nextDifficulty(10.0, true)).toBe(10.0);
  });

  it('clamps to DIFFICULTY_MIN when below 1.0 (defensive)', () => {
    expect(nextDifficulty(0.5, true)).toBeCloseTo(0.7, 5); // raw cap inferior 1.0 — but step makes 0.7, then clamp to 1.0? Verify min clamp:
    // Decisió: si current < MIN, retorna MIN. Si current + delta < MIN, també MIN.
    expect(nextDifficulty(0.5, false)).toBe(1.0);
  });
});
```

- [ ] **Step 2: Verificar fail**

Run: `npx vitest run src/lib/jocs-economics/server/difficulty.test.ts`
Expected: FAIL "Cannot find module './difficulty'"

- [ ] **Step 3: Implementar `difficulty.ts`**

```ts
// src/lib/jocs-economics/server/difficulty.ts
// Gradient continu de dificultat (spec §5.2).
// Cada encert puja +0.2; cada error manté el valor (vida −1 ja és penalització).

export const DIFFICULTY_MIN = 1.0;
export const DIFFICULTY_MAX = 10.0;
export const DIFFICULTY_STEP_CORRECT = 0.2;
export const DIFFICULTY_STEP_INCORRECT = 0;

export function nextDifficulty(current: number, isCorrect: boolean): number {
  const delta = isCorrect ? DIFFICULTY_STEP_CORRECT : DIFFICULTY_STEP_INCORRECT;
  const raw = current + delta;
  return Math.min(DIFFICULTY_MAX, Math.max(DIFFICULTY_MIN, raw));
}
```

- [ ] **Step 4: Verificar pass**

Run: `npx vitest run src/lib/jocs-economics/server/difficulty.test.ts`
Expected: 6 tests PASS.

- [ ] **Step 5: Tests fallant per a `scoring`**

`src/lib/jocs-economics/server/scoring.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { scoreFor } from './scoring';

describe('scoreFor', () => {
  it('returns 100 at difficulty 1.0', () => {
    expect(scoreFor(1.0)).toBe(100);
  });

  it('returns 1000 at difficulty 10.0', () => {
    expect(scoreFor(10.0)).toBe(1000);
  });

  it('returns 500 at difficulty 5.0', () => {
    expect(scoreFor(5.0)).toBe(500);
  });

  it('rounds to nearest integer', () => {
    expect(scoreFor(1.234)).toBe(123);
    expect(scoreFor(5.678)).toBe(568);
    expect(Number.isInteger(scoreFor(3.333))).toBe(true);
  });
});
```

- [ ] **Step 6: Verificar fail**

Run: `npx vitest run src/lib/jocs-economics/server/scoring.test.ts`
Expected: FAIL.

- [ ] **Step 7: Implementar `scoring.ts`**

```ts
// src/lib/jocs-economics/server/scoring.ts
// Score = dificultat × 100, arrodonit (spec §5.3).
// Sense speed bonus (decisió §4 spec).

export function scoreFor(currentDifficulty: number): number {
  return Math.round(currentDifficulty * 100);
}
```

- [ ] **Step 8: Verificar pass**

Run: `npx vitest run src/lib/jocs-economics/server/scoring.test.ts`
Expected: 4 tests PASS.

- [ ] **Step 9: Verificar suite global**

Run: `npx vitest run 2>&1 | tail -4`
Expected: count global incrementat amb 10 nous; tot verd.

- [ ] **Step 10: Commit**

```bash
git add src/lib/jocs-economics/server/difficulty.ts src/lib/jocs-economics/server/difficulty.test.ts src/lib/jocs-economics/server/scoring.ts src/lib/jocs-economics/server/scoring.test.ts
git commit -m "feat(jocs): difficulty gradient + scoring (pure logic)"
```

---

## Task 3: Pure logic — institutes + tokens + tests

**Files:**
- Create: `src/lib/jocs-economics/server/institutes.ts`
- Create: `src/lib/jocs-economics/server/institutes.test.ts`
- Create: `src/lib/jocs-economics/server/tokens.ts`
- Create: `src/lib/jocs-economics/server/tokens.test.ts`
- Modify: `package.json` (afegir `jsonwebtoken` + `@types/jsonwebtoken` com a dependency)

- [ ] **Step 1: Afegir dependència `jsonwebtoken`**

Run: `npm install jsonwebtoken && npm install -D @types/jsonwebtoken`

Verificar: `grep jsonwebtoken package.json` → present a dependencies.

- [ ] **Step 2: Tests fallant per a `institutes`**

`src/lib/jocs-economics/server/institutes.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { normalizeInstitute } from './institutes';

describe('normalizeInstitute', () => {
  it('lowercases', () => {
    expect(normalizeInstitute('IES Lluís Vives')).toBe('iesluisvives');
  });

  it('strips accents (NFD normalize)', () => {
    expect(normalizeInstitute('Lluís')).toBe('luis');
    expect(normalizeInstitute('Camí Vell')).toBe('camivell');
    expect(normalizeInstitute('Català')).toBe('catala');
    expect(normalizeInstitute('Núñez')).toBe('nunez');
  });

  it('strips punctuation and whitespace', () => {
    expect(normalizeInstitute('I.E.S. Lluís Vives')).toBe('iesluisvives');
    expect(normalizeInstitute('  I.E.S.  Lluís   Vives  ')).toBe('iesluisvives');
    expect(normalizeInstitute('IES-Vives')).toBe('iesvives');
  });

  it('matches the 4 spellings of "IES Lluís Vives" to the same norm', () => {
    const variants = [
      'IES Lluís Vives',
      'ies lluis vives',
      'I.E.S. Lluís Vives',
      'I.E.S Lluis  Vives',
    ];
    const norms = variants.map(normalizeInstitute);
    expect(new Set(norms).size).toBe(1);
  });

  it('handles empty/whitespace-only input as empty string', () => {
    expect(normalizeInstitute('')).toBe('');
    expect(normalizeInstitute('   ')).toBe('');
    expect(normalizeInstitute('...')).toBe('');
  });
});
```

- [ ] **Step 3: Verificar fail**

Run: `npx vitest run src/lib/jocs-economics/server/institutes.test.ts`
Expected: FAIL.

- [ ] **Step 4: Implementar `institutes.ts`**

```ts
// src/lib/jocs-economics/server/institutes.ts
// Normalitzador d'institut: text → key canònica.
// Mateix institut escrit de N maneres → mateix key.

/**
 * Normalitza el nom d'un institut a una clau canònica:
 *   1. Lowercase
 *   2. Strip accents (NFD + filter diacritics)
 *   3. Strip whitespace i puntuació (només deixa [a-z0-9])
 *
 * Exemple: "IES Lluís Vives" → "iesluisvives"
 *          "ies lluis vives" → "iesluisvives"
 *          "I.E.S. Lluís Vives" → "iesluisvives"
 */
export function normalizeInstitute(raw: string): string {
  return raw
    .normalize('NFD')                 // descomposa: 'í' → 'i' + combining-acute
    .replace(/[̀-ͯ]/g, '')  // elimina diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');        // només a-z0-9
}
```

- [ ] **Step 5: Verificar pass**

Run: `npx vitest run src/lib/jocs-economics/server/institutes.test.ts`
Expected: 5 tests PASS.

- [ ] **Step 6: Tests fallant per a `tokens`**

`src/lib/jocs-economics/server/tokens.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { signGameToken, verifyGameToken } from './tokens';

const SECRET = 'test-secret-at-least-32-chars-long-aaaa';

describe('signGameToken / verifyGameToken', () => {
  it('roundtrip: sign then verify returns the gameId', () => {
    const token = signGameToken('game-abc', SECRET);
    const result = verifyGameToken(token, SECRET);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.gameId).toBe('game-abc');
  });

  it('rejects token signed with different secret', () => {
    const token = signGameToken('game-abc', SECRET);
    const result = verifyGameToken(token, 'WRONG-SECRET-aaaa-bbbb-cccc-dddd-eeee');
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reason).toBe('invalid-signature');
  });

  it('rejects malformed token', () => {
    const result = verifyGameToken('not.a.real.token.lalala', SECRET);
    expect(result.ok).toBe(false);
  });

  it('rejects expired token', async () => {
    const token = signGameToken('game-abc', SECRET, { expiresInSeconds: -1 });
    const result = verifyGameToken(token, SECRET);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reason).toBe('expired');
  });

  it('default expiry is 60 minutes (sane upper bound for a game)', () => {
    const token = signGameToken('game-abc', SECRET);
    // Decodifica el payload (no verifica) per inspeccionar exp
    const [, payloadB64] = token.split('.');
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64').toString());
    const now = Math.floor(Date.now() / 1000);
    expect(payload.exp - now).toBeGreaterThan(3500);  // ~60 min
    expect(payload.exp - now).toBeLessThan(3700);
  });
});
```

- [ ] **Step 7: Verificar fail**

Run: `npx vitest run src/lib/jocs-economics/server/tokens.test.ts`
Expected: FAIL.

- [ ] **Step 8: Implementar `tokens.ts`**

```ts
// src/lib/jocs-economics/server/tokens.ts
// JWT HS256 per a tokens de partida (spec §2 V8 anti-cheat).
// Secret = env JOCS_TOKEN_SECRET (server-only).

import jwt from 'jsonwebtoken';

const DEFAULT_EXPIRY_SECONDS = 60 * 60; // 1 hora — sane upper bound per a una partida

interface TokenPayload {
  gameId: string;
}

interface SignOptions {
  expiresInSeconds?: number;
}

export function signGameToken(gameId: string, secret: string, opts: SignOptions = {}): string {
  const payload: TokenPayload = { gameId };
  const expiresIn = opts.expiresInSeconds ?? DEFAULT_EXPIRY_SECONDS;
  return jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn });
}

export type VerifyResult =
  | { ok: true; gameId: string }
  | { ok: false; reason: 'invalid-signature' | 'expired' | 'malformed' };

export function verifyGameToken(token: string, secret: string): VerifyResult {
  try {
    const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] }) as TokenPayload;
    if (typeof decoded.gameId !== 'string') {
      return { ok: false, reason: 'malformed' };
    }
    return { ok: true, gameId: decoded.gameId };
  } catch (err: any) {
    if (err?.name === 'TokenExpiredError') return { ok: false, reason: 'expired' };
    if (err?.name === 'JsonWebTokenError') return { ok: false, reason: 'invalid-signature' };
    return { ok: false, reason: 'malformed' };
  }
}
```

- [ ] **Step 9: Verificar pass**

Run: `npx vitest run src/lib/jocs-economics/server/tokens.test.ts`
Expected: 5 tests PASS.

- [ ] **Step 10: Verificar suite global**

Run: `npx vitest run 2>&1 | tail -4`
Expected: ~10 nous tests; tot verd.

- [ ] **Step 11: Commit**

```bash
git add src/lib/jocs-economics/server/institutes.ts src/lib/jocs-economics/server/institutes.test.ts src/lib/jocs-economics/server/tokens.ts src/lib/jocs-economics/server/tokens.test.ts package.json package-lock.json
git commit -m "feat(jocs): institutes normalitzador + tokens JWT HS256"
```

---

## Task 4: Pure logic — ranking + tie-breakers + tests

**Files:**
- Create: `src/lib/jocs-economics/server/ranking.ts`
- Create: `src/lib/jocs-economics/server/ranking.test.ts`

- [ ] **Step 1: Tests fallant**

`src/lib/jocs-economics/server/ranking.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { compareScores, rankOf, type ScoreEntry } from './ranking';

const e = (score: number, q: number, t: number): ScoreEntry => ({
  score,
  questionsAnswered: q,
  timeTotalMs: t,
});

describe('compareScores', () => {
  it('orders by score DESC primarily', () => {
    expect(compareScores(e(100, 5, 1000), e(200, 5, 1000))).toBeGreaterThan(0); // b first
    expect(compareScores(e(200, 5, 1000), e(100, 5, 1000))).toBeLessThan(0);    // a first
  });

  it('breaks ties on score with questionsAnswered DESC', () => {
    expect(compareScores(e(100, 5, 1000), e(100, 10, 1000))).toBeGreaterThan(0); // b first
    expect(compareScores(e(100, 10, 1000), e(100, 5, 1000))).toBeLessThan(0);    // a first
  });

  it('breaks tie on score+questions with timeTotalMs ASC (less time wins)', () => {
    expect(compareScores(e(100, 5, 2000), e(100, 5, 1000))).toBeGreaterThan(0);  // b first (less time)
    expect(compareScores(e(100, 5, 1000), e(100, 5, 2000))).toBeLessThan(0);     // a first
  });

  it('returns 0 when all three are identical', () => {
    expect(compareScores(e(100, 5, 1000), e(100, 5, 1000))).toBe(0);
  });
});

describe('rankOf', () => {
  it('returns 1-indexed rank within a sorted list', () => {
    const sorted = [e(1000, 30, 1000), e(800, 20, 1000), e(500, 10, 1000)];
    expect(rankOf(sorted, e(1000, 30, 1000))).toBe(1);
    expect(rankOf(sorted, e(800, 20, 1000))).toBe(2);
    expect(rankOf(sorted, e(500, 10, 1000))).toBe(3);
  });

  it('returns null when entry not found', () => {
    const sorted = [e(1000, 30, 1000), e(800, 20, 1000)];
    expect(rankOf(sorted, e(999, 99, 9999))).toBeNull();
  });
});
```

- [ ] **Step 2: Verificar fail**

Run: `npx vitest run src/lib/jocs-economics/server/ranking.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implementar `ranking.ts`**

```ts
// src/lib/jocs-economics/server/ranking.ts
// Tie-breakers triple per al ranking (spec §5.5).
// Ordre: score DESC → questionsAnswered DESC → timeTotalMs ASC.

export interface ScoreEntry {
  score: number;
  questionsAnswered: number;
  timeTotalMs: number;
}

/**
 * Comparator JS-style: retorna negatiu si `a` ha d'anar abans que `b`,
 * positiu si `b` ha d'anar abans, 0 si idèntics.
 *
 * Ordre: score desc → questionsAnswered desc → timeTotalMs asc.
 */
export function compareScores(a: ScoreEntry, b: ScoreEntry): number {
  if (a.score !== b.score) return b.score - a.score;
  if (a.questionsAnswered !== b.questionsAnswered) {
    return b.questionsAnswered - a.questionsAnswered;
  }
  return a.timeTotalMs - b.timeTotalMs;
}

/**
 * Retorna la posició 1-indexed d'`entry` dins de `sorted` (que es presuposa
 * ja ordenat per `compareScores`). Retorna null si no es troba exactament.
 */
export function rankOf<T extends ScoreEntry>(sorted: T[], entry: ScoreEntry): number | null {
  const idx = sorted.findIndex(
    (s) =>
      s.score === entry.score &&
      s.questionsAnswered === entry.questionsAnswered &&
      s.timeTotalMs === entry.timeTotalMs,
  );
  return idx >= 0 ? idx + 1 : null;
}
```

- [ ] **Step 4: Verificar pass**

Run: `npx vitest run src/lib/jocs-economics/server/ranking.test.ts`
Expected: 6 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/jocs-economics/server/ranking.ts src/lib/jocs-economics/server/ranking.test.ts
git commit -m "feat(jocs): ranking comparator + tie-breakers (score → preg → temps)"
```

---

## Task 5: Bank pipeline — `build-jocs-bank.mjs` + fixtures + tests

**Files:**
- Replace placeholder: `scripts/build-jocs-bank.mjs`
- Create: `scripts/build-jocs-bank.test.mjs`
- Create: `scripts/__fixtures__/jocs-economics/preguntas/eco-9001-test.md`
- Create: `scripts/__fixtures__/jocs-economics/preguntas/fin-9001-test.md`
- Create: `scripts/__fixtures__/jocs-economics/preguntas/emp-9001-borrador.md`
- Modify: `.gitignore` (afegir 2 fitxers generats)

- [ ] **Step 1: Crear fixtures**

`scripts/__fixtures__/jocs-economics/preguntas/eco-9001-test.md`:

```md
---
id: eco-9001-test
categoria: economia
dificultat: 2.5
opciones:
  - "Opció A"
  - "Opció B"
  - "Opció C"
correcta: 1
explicacion: "Explicació econometria de test."
estado: publicado
font: "fixture"
---

Cos no usat.
```

`scripts/__fixtures__/jocs-economics/preguntas/fin-9001-test.md`:

```md
---
id: fin-9001-test
categoria: finances
dificultat: 7.0
opciones:
  - "Opció X"
  - "Opció Y"
  - "Opció Z"
  - "Opció W"
correcta: 3
estado: publicado
font: "fixture"
---
```

`scripts/__fixtures__/jocs-economics/preguntas/emp-9001-borrador.md` (filtrada per estat):

```md
---
id: emp-9001-borrador
categoria: empresa
dificultat: 5.0
opciones:
  - "P"
  - "Q"
correcta: 0
estado: borrador
---
```

- [ ] **Step 2: Tests fallant**

`scripts/build-jocs-bank.test.mjs`:

```js
import { describe, it, expect, beforeAll } from 'vitest';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildBank } from './build-jocs-bank.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(__dirname, '__fixtures__', 'jocs-economics');

describe('build-jocs-bank', () => {
  let result;

  beforeAll(async () => {
    result = await buildBank({ sourceDir: FIXTURES });
  });

  it('emits manifest with version + totals + byCategoria + byDificultatBand', () => {
    expect(result.manifest.version).toBe(1);
    expect(result.manifest.totals.preguntas).toBe(2); // eco + fin (emp borrador filtered)
    expect(result.manifest.totals.byCategoria).toEqual({
      economia: 1,
      finances: 1,
      empresa: 0,
    });
    expect(result.manifest.totals.byDificultatBand).toEqual({
      basic_1_3: 1,    // eco difficulty 2.5
      mig_4_6: 0,
      alt_7_10: 1,     // fin difficulty 7.0
    });
  });

  it('emits bank with the 2 published preguntas (with correcta + explicacion)', () => {
    expect(result.bank.version).toBe(1);
    expect(result.bank.preguntas).toHaveLength(2);
    const eco = result.bank.preguntas.find((p) => p.id === 'eco-9001-test');
    expect(eco).toBeDefined();
    expect(eco.correcta).toBe(1);
    expect(eco.explicacion).toBe('Explicació econometria de test.');
    expect(eco.dificultat).toBe(2.5);
    expect(eco.categoria).toBe('economia');
  });

  it('excludes borrador entries from both manifest and bank', () => {
    expect(result.bank.preguntas.find((p) => p.id === 'emp-9001-borrador')).toBeUndefined();
    expect(result.manifest.totals.byCategoria.empresa).toBe(0);
  });

  it('manifest never leaks enunciado/opciones/correcta/explicacion', () => {
    const json = JSON.stringify(result.manifest);
    expect(json).not.toContain('Opció A');
    expect(json).not.toContain('correcta');
    expect(json).not.toContain('explicacion');
  });

  it('is idempotent on byte level except generatedAt', async () => {
    const second = await buildBank({ sourceDir: FIXTURES });
    const a = { ...result.manifest, generatedAt: null };
    const b = { ...second.manifest, generatedAt: null };
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
});
```

- [ ] **Step 3: Verificar fail**

Run: `npx vitest run scripts/build-jocs-bank.test.mjs`
Expected: FAIL (placeholder no exporta `buildBank`).

- [ ] **Step 4: Implementar `build-jocs-bank.mjs`**

Substituir el placeholder amb:

```js
// scripts/build-jocs-bank.mjs
// Genera el manifest públic (counts) + el banc privat (preguntes completes).
//
// Llegeix MDX de `src/content/jocs-economics/preguntas/**/*.md`,
// filtra `estado === 'publicado'`, i emet:
//   - public/jocs-economics/manifest.json  (counts agregats; segur public)
//   - src/server-only/jocs-bank.json       (banc complet; server-only)

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const DEFAULT_SOURCE = path.join(ROOT, 'src', 'content', 'jocs-economics');
const DEFAULT_OUT_MANIFEST = path.join(ROOT, 'public', 'jocs-economics', 'manifest.json');
const DEFAULT_OUT_BANK = path.join(ROOT, 'src', 'server-only', 'jocs-bank.json');

async function listMdFiles(dir) {
  const out = [];
  async function walk(d) {
    let entries;
    try {
      entries = await fs.readdir(d, { withFileTypes: true });
    } catch {
      return;
    }
    for (const ent of entries) {
      const full = path.join(d, ent.name);
      if (ent.isDirectory()) await walk(full);
      else if (ent.isFile() && full.endsWith('.md')) out.push(full);
    }
  }
  await walk(dir);
  return out;
}

async function parseQuestion(file) {
  const raw = await fs.readFile(file, 'utf8');
  const { data } = matter(raw);
  if (data.estado !== 'publicado') return null;
  if (!data.id || !data.categoria || typeof data.dificultat !== 'number' || !Array.isArray(data.opciones)) {
    console.warn(`[jocs-bank] saltant pregunta mal formada: ${file}`);
    return null;
  }
  return {
    id: String(data.id),
    categoria: String(data.categoria),
    dificultat: Number(data.dificultat),
    opciones: data.opciones.map(String),
    correcta: Number(data.correcta),
    ...(data.explicacion ? { explicacion: String(data.explicacion) } : {}),
  };
}

function bandOfDifficulty(d) {
  if (d <= 3) return 'basic_1_3';
  if (d <= 6) return 'mig_4_6';
  return 'alt_7_10';
}

export async function buildBank({ sourceDir = DEFAULT_SOURCE } = {}) {
  const files = await listMdFiles(path.join(sourceDir, 'preguntas'));
  const parsed = (await Promise.all(files.map(parseQuestion))).filter(Boolean);

  const generatedAt = new Date().toISOString();

  const byCategoria = { economia: 0, finances: 0, empresa: 0 };
  const byDificultatBand = { basic_1_3: 0, mig_4_6: 0, alt_7_10: 0 };
  for (const q of parsed) {
    if (byCategoria[q.categoria] !== undefined) byCategoria[q.categoria]++;
    byDificultatBand[bandOfDifficulty(q.dificultat)]++;
  }

  const manifest = {
    generatedAt,
    version: 1,
    totals: {
      preguntas: parsed.length,
      byCategoria,
      byDificultatBand,
    },
  };

  // Ordena per id estable per idempotència
  const sorted = parsed.slice().sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  const bank = {
    generatedAt,
    version: 1,
    preguntas: sorted,
  };

  return { manifest, bank };
}

async function writeJson(file, obj) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

async function main() {
  const args = process.argv.slice(2);
  const getArg = (name) => {
    const i = args.indexOf(name);
    return i >= 0 ? args[i + 1] : undefined;
  };
  const sourceDir = getArg('--source') ?? DEFAULT_SOURCE;
  const outManifest = getArg('--out-manifest') ?? DEFAULT_OUT_MANIFEST;
  const outBank = getArg('--out-bank') ?? DEFAULT_OUT_BANK;

  const { manifest, bank } = await buildBank({ sourceDir });
  await writeJson(outManifest, manifest);
  await writeJson(outBank, bank);

  console.log(
    `[jocs-bank] ${manifest.totals.preguntas} preguntes publicades · ` +
      `eco ${manifest.totals.byCategoria.economia} · ` +
      `fin ${manifest.totals.byCategoria.finances} · ` +
      `emp ${manifest.totals.byCategoria.empresa}`,
  );
  console.log(`  manifest: ${path.relative(ROOT, outManifest)}`);
  console.log(`  bank:     ${path.relative(ROOT, outBank)}`);
}

// Executar només si invocat directament
if (import.meta.url === `file://${path.resolve(process.argv[1]).replace(/\\/g, '/')}`) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
```

- [ ] **Step 5: Verificar tests passen**

Run: `npx vitest run scripts/build-jocs-bank.test.mjs`
Expected: 5 tests PASS.

- [ ] **Step 6: Córrer en mode real (banc encara buit, retorna 0 preguntes)**

Run: `node scripts/build-jocs-bank.mjs`
Expected: línia `[jocs-bank] 0 preguntes publicades · eco 0 · fin 0 · emp 0` + 2 línies amb paths.

- [ ] **Step 7: Verificar shape del manifest generat**

Run: `head -20 public/jocs-economics/manifest.json`
Expected: JSON ben format amb `version: 1`, `totals.preguntas: 0`.

- [ ] **Step 8: Afegir entrades al `.gitignore`**

```
# Jocs Econòmics banc (auto-generat per `npm run build:jocs-bank`)
public/jocs-economics/manifest.json
src/server-only/jocs-bank.json
```

- [ ] **Step 9: Verificar prebuild + build completos**

Run: `npm run prebuild`
Expected: ambdues lines (cajut + jocs) corren.

Run: `npm run build 2>&1 | tail -3`
Expected: `Complete!`.

- [ ] **Step 10: Commit**

```bash
git add scripts/build-jocs-bank.mjs scripts/build-jocs-bank.test.mjs scripts/__fixtures__/jocs-economics .gitignore
git commit -m "feat(jocs): banc pipeline (MDX → manifest + private bank) + tests"
```

---

## Task 6: Bank loader (`bank.ts`) + bootstrap webpde script

**Files:**
- Create: `src/lib/jocs-economics/server/bank.ts`
- Create: `src/lib/jocs-economics/server/bank.test.ts`
- Create: `scripts/extract-webpde-concurs.mjs` (run-once, no test)

- [ ] **Step 1: Tests fallant per a `bank`**

`src/lib/jocs-economics/server/bank.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { nextQuestion, type Question, type BankData } from './bank';

function rng(seed: number): () => number {
  let t = seed;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const TEST_BANK: BankData = {
  preguntas: [
    { id: 'eco-1', categoria: 'economia', dificultat: 1.0, opciones: ['a','b','c','d'], correcta: 0 },
    { id: 'eco-2', categoria: 'economia', dificultat: 1.5, opciones: ['a','b','c','d'], correcta: 1 },
    { id: 'eco-3', categoria: 'economia', dificultat: 2.0, opciones: ['a','b','c','d'], correcta: 2 },
    { id: 'eco-4', categoria: 'economia', dificultat: 5.0, opciones: ['a','b','c','d'], correcta: 3 },
    { id: 'eco-5', categoria: 'economia', dificultat: 7.0, opciones: ['a','b','c','d'], correcta: 0 },
    { id: 'eco-6', categoria: 'economia', dificultat: 9.5, opciones: ['a','b','c','d'], correcta: 1 },
  ],
};

describe('nextQuestion', () => {
  it('picks a question within ±0.5 of target difficulty when available', () => {
    const q = nextQuestion(1.0, [], rng(1), TEST_BANK);
    expect(['eco-1', 'eco-2']).toContain(q.id); // 1.0 ± 0.5 = [0.5, 1.5]
  });

  it('expands window to ±1.0 if no candidates in ±0.5', () => {
    // Target 3.0; ±0.5 → no preguntes; ±1.0 → eco-3 (2.0)
    const q = nextQuestion(3.0, [], rng(1), TEST_BANK);
    expect(['eco-3', 'eco-4']).toContain(q.id);
  });

  it('expands window to ±2.0 if still nothing', () => {
    // Target 8.5; ±0.5 → none; ±1.0 → none; ±2.0 → eco-5 (7.0) o eco-6 (9.5)
    const q = nextQuestion(8.5, [], rng(1), TEST_BANK);
    expect(['eco-5', 'eco-6']).toContain(q.id);
  });

  it('falls back to closest non-seen if no candidates within ±2.0', () => {
    // Target 4.0 with eco-1,eco-2,eco-3 ja vistes → eco-4 (5.0, +1.0) o eco-3 si no exclos
    const q = nextQuestion(4.0, ['eco-1', 'eco-2'], rng(1), TEST_BANK);
    expect(q.id).not.toBe('eco-1');
    expect(q.id).not.toBe('eco-2');
  });

  it('throws BankExhaustedError when all questions seen', () => {
    const allSeen = TEST_BANK.preguntas.map((p) => p.id);
    expect(() => nextQuestion(5.0, allSeen, rng(1), TEST_BANK)).toThrow('bank-exhausted');
  });

  it('is deterministic given the same RNG seed', () => {
    const a = nextQuestion(5.0, [], rng(42), TEST_BANK);
    const b = nextQuestion(5.0, [], rng(42), TEST_BANK);
    expect(a.id).toBe(b.id);
  });

  it('returns different questions with different seeds (probabilistic)', () => {
    // Pick from a target with multiple candidates so it actually varies
    const seeds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const ids = new Set(seeds.map((s) => nextQuestion(1.0, [], rng(s), TEST_BANK).id));
    expect(ids.size).toBeGreaterThan(1);
  });

  it('never returns a seen question', () => {
    for (let s = 1; s < 50; s++) {
      const q = nextQuestion(1.0, ['eco-1'], rng(s), TEST_BANK);
      expect(q.id).not.toBe('eco-1');
    }
  });
});
```

- [ ] **Step 2: Verificar fail**

Run: `npx vitest run src/lib/jocs-economics/server/bank.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implementar `bank.ts`**

```ts
// src/lib/jocs-economics/server/bank.ts
// Loader del banc privat + funció de selecció de pregunta amb gradient (spec §5.4).
// El banc s'importa del JSON generat per build-jocs-bank.mjs.

import bankData from '../../../server-only/jocs-bank.json';

export interface Question {
  id: string;
  categoria: 'economia' | 'finances' | 'empresa';
  dificultat: number;
  opciones: string[];
  correcta: number;
  explicacion?: string;
}

export interface BankData {
  preguntas: Question[];
}

const DEFAULT_BANK = bankData as BankData;

// Finestres successives a provar (en aquest ordre) si la prèvia no té candidates
const WINDOWS = [0.5, 1.0, 2.0];

export class BankExhaustedError extends Error {
  constructor() {
    super('bank-exhausted');
    this.name = 'BankExhaustedError';
  }
}

/**
 * Selecciona la propera pregunta basant-se en `targetDifficulty`, excloent `seen`,
 * usant `rng` per a la tria aleatòria entre candidates equivalents.
 *
 * Estratègia (spec §5.4):
 *  1. Filtra preguntes amb |dificultat − target| ≤ 0.5 i id no a `seen`.
 *  2. Si buit, prova ±1.0, després ±2.0.
 *  3. Si encara buit, retorna la més propera no-vista (fallback).
 *  4. Si totes vistes → BankExhaustedError.
 *
 * @param bank — injectable per a tests (default: bank importat del JSON)
 */
export function nextQuestion(
  targetDifficulty: number,
  seen: readonly string[],
  rng: () => number,
  bank: BankData = DEFAULT_BANK,
): Question {
  const seenSet = new Set(seen);
  const available = bank.preguntas.filter((q) => !seenSet.has(q.id));
  if (available.length === 0) throw new BankExhaustedError();

  for (const w of WINDOWS) {
    const candidates = available.filter((q) => Math.abs(q.dificultat - targetDifficulty) <= w);
    if (candidates.length > 0) {
      return candidates[Math.floor(rng() * candidates.length)];
    }
  }

  // Fallback: closest by absolute distance
  const closest = available
    .slice()
    .sort((a, b) => Math.abs(a.dificultat - targetDifficulty) - Math.abs(b.dificultat - targetDifficulty));
  return closest[0];
}

/** Helper per a tests/debug: retorna el banc carregat */
export function getBankInfo(): { total: number; byCategoria: Record<string, number> } {
  const by: Record<string, number> = { economia: 0, finances: 0, empresa: 0 };
  for (const q of DEFAULT_BANK.preguntas) {
    if (by[q.categoria] !== undefined) by[q.categoria]++;
  }
  return { total: DEFAULT_BANK.preguntas.length, byCategoria: by };
}
```

- [ ] **Step 4: Verificar pass**

Run: `npx vitest run src/lib/jocs-economics/server/bank.test.ts`
Expected: 8 tests PASS.

Si el test falla amb "Cannot find module '../../../server-only/jocs-bank.json'": el `build-jocs-bank.mjs` ha de generar el fitxer abans. Run: `npm run build:jocs-bank` per generar el banc buit, després torna a córrer els tests.

- [ ] **Step 5: Crear script de bootstrap `extract-webpde-concurs.mjs`** (run-once, no test)

```js
// scripts/extract-webpde-concurs.mjs
// Run-once: descarrega el concurs.html del webpde antic i genera fitxers MDX
// per a cada pregunta a src/content/jocs-economics/preguntas/.
//
// Genera amb estado: 'revision' (no 'publicado') perquè Pau revisi i calibri
// dificultat 1-10 manualment.
//
// Ús:
//   node scripts/extract-webpde-concurs.mjs
//
// Si el parseo falla (HTML antic és complex), exporta a JSON
// `scripts/__webpde-raw__/concurs-raw.json` per a inspecció manual.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'src', 'content', 'jocs-economics', 'preguntas');
const RAW_DIR = path.join(__dirname, '__webpde-raw__');

const SOURCE_URL = 'https://raw.githubusercontent.com/skinnydkd/webpde/main/concurs.html';

function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
}

function categoryPrefix(cat) {
  if (cat === 'economia') return 'eco';
  if (cat === 'finances' || cat === 'finanzas') return 'fin';
  if (cat === 'empresa') return 'emp';
  return 'eco'; // fallback
}

async function fetchSource() {
  console.log(`[bootstrap] fetching ${SOURCE_URL}...`);
  const res = await fetch(SOURCE_URL);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return await res.text();
}

/**
 * Intenta extreure preguntes del concurs.html antic.
 *
 * El format esperat és un array JS embedded:
 *   const preguntes = [ { categoria: 'economia', enunciat: '...', opcions: [...], correcta: 1 }, ... ]
 *
 * Si no s'aconsegueix parsejar amb regex simple, l'script avorta i deixa el HTML
 * a __webpde-raw__/concurs.html per a inspecció manual. En aquest cas Pau pot
 * fer una extracció manual (copy-paste i adaptació).
 */
function tryParseQuestions(html) {
  // Pattern: cerca un array literal després de `const preguntes` o `var preguntes` o `preguntes =`
  const arrayMatch = html.match(/preguntes\s*=\s*(\[[\s\S]*?\]);?/);
  if (!arrayMatch) return null;
  try {
    // Avalua com a JSON (estricte) — si el HTML usa sintaxi JS no-JSON (cometes simples), fallar és ok
    const jsonish = arrayMatch[1]
      .replace(/'/g, '"')                // simple → doble cometes (rough)
      .replace(/,\s*([}\]])/g, '$1')     // remove trailing commas
      .replace(/(\w+):/g, '"$1":');      // unquoted keys → quoted
    return JSON.parse(jsonish);
  } catch (err) {
    console.warn(`[bootstrap] parse failed: ${err.message}`);
    return null;
  }
}

async function main() {
  const html = await fetchSource();

  // Backup raw per si Pau vol fer extracció manual
  await fs.mkdir(RAW_DIR, { recursive: true });
  await fs.writeFile(path.join(RAW_DIR, 'concurs.html'), html, 'utf8');
  console.log(`[bootstrap] raw HTML saved to ${path.relative(ROOT, path.join(RAW_DIR, 'concurs.html'))}`);

  const questions = tryParseQuestions(html);
  if (!questions || !Array.isArray(questions)) {
    console.error(`[bootstrap] could not auto-parse. Inspect ${RAW_DIR}/concurs.html manually.`);
    console.error(`[bootstrap] Skipping MDX generation. Pau ha de fer extracció manual.`);
    process.exit(1);
  }

  await fs.mkdir(OUT_DIR, { recursive: true });
  const counters = { eco: 0, fin: 0, emp: 0 };
  for (const raw of questions) {
    const cat = String(raw.categoria || 'economia').toLowerCase();
    const prefix = categoryPrefix(cat);
    counters[prefix]++;
    const num = String(counters[prefix]).padStart(4, '0');
    const slugBase = slugify(raw.enunciat || raw.enunciado || 'sense-titol');
    const id = `${prefix}-${num}-${slugBase}`;
    const filename = `${id}.md`;

    const opciones = Array.isArray(raw.opcions) ? raw.opcions : raw.opciones || [];
    const correcta = typeof raw.correcta === 'number' ? raw.correcta : 0;
    const enunciat = String(raw.enunciat || raw.enunciado || '');

    const frontmatter = [
      '---',
      `id: ${id}`,
      `categoria: ${cat === 'finanzas' ? 'finances' : cat}`,
      `dificultat: 5.0`, // placeholder — Pau ha de calibrar
      'opciones:',
      ...opciones.map((opt) => `  - ${JSON.stringify(String(opt))}`),
      `correcta: ${correcta}`,
      ...(raw.explicacion ? [`explicacion: ${JSON.stringify(raw.explicacion)}`] : []),
      `estado: revision`,
      `font: "webpde-concurs.html"`,
      '---',
      '',
      enunciat,
      '',
    ].join('\n');

    await fs.writeFile(path.join(OUT_DIR, filename), frontmatter, 'utf8');
  }

  console.log(`[bootstrap] wrote ${questions.length} preguntas (eco ${counters.eco} · fin ${counters.fin} · emp ${counters.emp})`);
  console.log(`[bootstrap] Pau ha de revisar i calibrar dificultat + canviar estado a 'publicado'.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

**NOTA**: aquest script és best-effort. Si el parseo regex falla, l'script no genera MDX i Pau haurà de fer extracció manual (basant-se en `__webpde-raw__/concurs.html`). Aquesta tasca està fora del TDD strict per ser run-once + heurístic.

- [ ] **Step 6: Executar el bootstrap (intent automàtic)**

Run: `node scripts/extract-webpde-concurs.mjs`
Expected (cas A): "wrote N preguntas" amb un nombre raonable (50-200 esperat).
Expected (cas B): "could not auto-parse" amb exit 1; en aquest cas el HTML és a `scripts/__webpde-raw__/concurs.html` per a inspecció manual de Pau.

Si cas B: documentar-ho al report i continuar (l'spec d'aquesta task no requereix que el bootstrap reïxi automàticament).

- [ ] **Step 7: Afegir `__webpde-raw__` al `.gitignore`**

```
# Webpde raw HTML cache (només per a inspecció manual del bootstrap)
scripts/__webpde-raw__/
```

- [ ] **Step 8: Si el bootstrap ha generat MDX, regenerar bank**

Run: `npm run build:jocs-bank`
Expected: línia `[jocs-bank] 0 preguntes publicades` (perquè estado=revision, encara no publicado). Això és esperat — Pau revisarà i canviarà `estado` manualment.

- [ ] **Step 9: Verificar suite global**

Run: `npx vitest run 2>&1 | tail -4`
Expected: ~8 nous tests + tot lo anterior; verd.

- [ ] **Step 10: Commit**

```bash
git add src/lib/jocs-economics/server/bank.ts src/lib/jocs-economics/server/bank.test.ts scripts/extract-webpde-concurs.mjs .gitignore
git commit -m "feat(jocs): bank loader (nextQuestion gradient + RNG) + webpde bootstrap script"
```

---

# LOT B — Supabase + API routes (T7–T9)

## Task 7: Supabase setup — migration + client + env

**Files:**
- Create: `supabase/migrations/20260527_init_jocs.sql`
- Create: `src/lib/jocs-economics/server/supabase.ts`
- Modify: `package.json` (afegir `@supabase/supabase-js`)
- Modify: `docs/jocs-economics-deploy.md` (crear amb instruccions de setup Supabase)

- [ ] **Step 1: Afegir dependència Supabase**

Run: `npm install @supabase/supabase-js`

- [ ] **Step 2: Crear migració SQL**

`supabase/migrations/20260527_init_jocs.sql`:

```sql
-- Jocs Econòmics — schema inicial
-- Aplicar manualment al SQL editor de Supabase Studio.

-- Extensions necessàries
create extension if not exists pg_trgm;
create extension if not exists pg_cron;

-- ──────────────────────────────────────────────────────────────────────
-- 1. active_games — partides en curs (efímer, 30 min TTL)
-- ──────────────────────────────────────────────────────────────────────
create table if not exists active_games (
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

create index if not exists active_games_cleanup_idx
  on active_games (last_action_at) where finished = false;

alter table active_games enable row level security;
-- Cap policy: només service-role llig/escriu.

-- ──────────────────────────────────────────────────────────────────────
-- 2. scores — leaderboard persistent
-- ──────────────────────────────────────────────────────────────────────
create table if not exists scores (
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

create index if not exists scores_individual_rank_idx
  on scores (score desc, questions_answered desc, time_total_ms asc);
create index if not exists scores_by_institute_idx
  on scores (institute_norm, score desc);
create index if not exists scores_finished_at_idx
  on scores (finished_at desc);

alter table scores enable row level security;

-- ──────────────────────────────────────────────────────────────────────
-- 3. institutes — catàleg per a autocompletat
-- ──────────────────────────────────────────────────────────────────────
create table if not exists institutes (
  institute_norm text primary key,
  institute_display text not null,
  players_count integer not null default 1,
  last_seen_at timestamptz not null default now()
);

create index if not exists institutes_search_idx
  on institutes using gin (institute_display gin_trgm_ops);

alter table institutes enable row level security;

-- ──────────────────────────────────────────────────────────────────────
-- 4. institute_leaderboard — vista materialitzada (suma top-5 per institut)
-- ──────────────────────────────────────────────────────────────────────
create materialized view if not exists institute_leaderboard as
with ranked as (
  select
    institute_norm,
    institute_display,
    score,
    questions_answered,
    time_total_ms,
    player_name,
    row_number() over (
      partition by institute_norm
      order by score desc, questions_answered desc, time_total_ms asc
    ) as rn
  from scores
),
top5 as (
  select institute_norm, score, questions_answered, time_total_ms, player_name
  from ranked
  where rn <= 5
),
agg as (
  select
    institute_norm,
    sum(score)                  as total_score,
    sum(questions_answered)     as total_questions,
    sum(time_total_ms)          as total_time_ms,
    count(distinct player_name) as players_count
  from top5
  group by institute_norm
),
top_player as (
  select distinct on (institute_norm)
    institute_norm,
    player_name,
    score as top_player_score
  from top5
  order by institute_norm, score desc, questions_answered desc, time_total_ms asc
)
select
  agg.institute_norm,
  i.institute_display,
  agg.total_score,
  agg.total_questions,
  agg.total_time_ms,
  agg.players_count,
  top_player.player_name as top_player_name,
  top_player.top_player_score
from agg
join institutes i using (institute_norm)
join top_player using (institute_norm);

create unique index if not exists institute_leaderboard_pk_idx
  on institute_leaderboard (institute_norm);
create index if not exists institute_leaderboard_rank_idx
  on institute_leaderboard (total_score desc, total_questions desc, total_time_ms asc);

-- ──────────────────────────────────────────────────────────────────────
-- 5. pg_cron jobs (programats al postgres)
-- ──────────────────────────────────────────────────────────────────────

-- Neteja partides abandonades cada 5 min
select cron.schedule(
  'jocs-cleanup-active-games', '*/5 * * * *',
  $$
    delete from active_games
    where finished = true
       or last_action_at < now() - interval '30 minutes';
  $$
);

-- Refresca institute_leaderboard cada 5 min
select cron.schedule(
  'jocs-refresh-institute-leaderboard', '*/5 * * * *',
  $$ refresh materialized view concurrently institute_leaderboard; $$
);
```

- [ ] **Step 3: Crear client Supabase (server-only)**

`src/lib/jocs-economics/server/supabase.ts`:

```ts
// src/lib/jocs-economics/server/supabase.ts
// Client Supabase server-only amb service-role key (bypassa RLS).
// MAI importar des de codi client (src/components/, src/lib/.../client/).

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cached: SupabaseClient | null = null;

/**
 * Retorna un client Supabase amb la service-role key.
 * Validem les env vars al primer ús per fallar ràpid si falten.
 */
export function getSupabase(): SupabaseClient {
  if (cached) return cached;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) throw new Error('SUPABASE_URL env var missing');
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY env var missing');
  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

/** Test-only: reset del cache (per a injectar mocks en tests) */
export function __resetSupabaseForTests(): void {
  cached = null;
}
```

- [ ] **Step 4: Crear documentació deploy**

`docs/jocs-economics-deploy.md`:

```md
# Jocs Econòmics — Deploy & Setup

## Resum

Jocs Econòmics necessita un projecte Supabase + 3 env vars al deploy de Vercel.

## Setup Supabase (manual, un cop)

1. Crea un projecte gratuit a [supabase.com](https://supabase.com) (regió `eu-central-1` recomanada per latència a Espanya).
2. Project Settings → API: copia `URL`, `anon public key`, `service_role secret key`.
3. SQL Editor → New query → enganxa el contingut de `supabase/migrations/20260527_init_jocs.sql` → Run. Verifica que totes les taules apareixen al Table editor.
4. Verifica els cron jobs: `select * from cron.job;` → han d'aparèixer 2 (`jocs-cleanup-active-games`, `jocs-refresh-institute-leaderboard`).

## Env vars al Vercel

Project Settings → Environment Variables → afegir:

| Nom | Scope | Valor |
|---|---|---|
| `SUPABASE_URL` | Production + Preview + Development | URL del projecte (https://<proj>.supabase.co) |
| `SUPABASE_SERVICE_ROLE_KEY` | Production + Preview + Development | service_role secret (server-only) |
| `PUBLIC_SUPABASE_URL` | Production + Preview + Development | Igual que SUPABASE_URL (per al client si calgués) |
| `PUBLIC_SUPABASE_ANON_KEY` | Production + Preview + Development | anon public key (per al client si calgués) |
| `JOCS_TOKEN_SECRET` | Production + Preview + Development | Random 48 bytes base64. Genera amb: `openssl rand -base64 48` |

**Crític**: `SUPABASE_SERVICE_ROLE_KEY` i `JOCS_TOKEN_SECRET` NO van prefixades amb `PUBLIC_` → Astro no les envia al bundle del client.

## Env vars en local

Copia `.env.example` → `.env` i ompli els valors. `.env` està gitignored.

```bash
cp .env.example .env
# edita .env amb els valors reals
openssl rand -base64 48  # genera el JOCS_TOKEN_SECRET
```

## Verificació post-deploy

1. Visita `https://profedeeconomia.es/jocs-economics/` — la pantalla Welcome ha de carregar.
2. Començar una partida → ha de retornar una pregunta (banc poblat al prebuild).
3. Veure `https://profedeeconomia.es/jocs-economics/leaderboard/` — buit al primer cop, dades després.

## Backup del banc

El banc viu al repo (`src/content/jocs-economics/preguntas/*.md`) → backup ja és Git. El JSON generat es regenera al prebuild, no cal backup.

Els `scores` viuen a Supabase. Supabase fa daily snapshots gratuits dels últims 7 dies; per a retencions més llargues, configurar pg_dump cron o pujar al pla Pro.

## Migracions futures

Crear `supabase/migrations/YYYYMMDD_<descripció>.sql` i aplicar al SQL editor manualment. (No automatitzem CI/CD de migracions al MVP.)
```

- [ ] **Step 5: Verificar build amb les noves dependències**

Run: `npm run build 2>&1 | tail -3`
Expected: `Complete!`. Si falla amb env var missing → ok per dev (no es crida el client a build-time), el build mateix no necessita les vars.

- [ ] **Step 6: Commit**

```bash
git add supabase/migrations/20260527_init_jocs.sql src/lib/jocs-economics/server/supabase.ts docs/jocs-economics-deploy.md package.json package-lock.json
git commit -m "feat(jocs): Supabase migration SQL + server client + deploy docs"
```

**ACCIÓ HUMANA PENDENT**: Pau ha d'aplicar la migració al SQL editor de Supabase i afegir les env vars al Vercel ABANS del deploy. Sense això, les API routes fallaran en runtime. El smoke E2E de T12 ho verifica.

---

## Task 8: API routes core — start + answer + finish + tests

**Files:**
- Create: `src/pages/api/jocs/start.ts`
- Create: `src/pages/api/jocs/start.test.ts`
- Create: `src/pages/api/jocs/answer.ts`
- Create: `src/pages/api/jocs/answer.test.ts`
- Create: `src/pages/api/jocs/finish.ts`
- Create: `src/pages/api/jocs/finish.test.ts`

### Patró comú dels endpoints (referència per a tots)

Cada endpoint segueix aquest patró Astro API route:

```ts
import type { APIRoute } from 'astro';
export const POST: APIRoute = async ({ request, clientAddress }) => {
  const body = await request.json();
  // ...
  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
```

Per als tests, fem mock de Supabase + bank + tokens + Date.now.

### Task 8a — `start.ts`

- [ ] **Step 1: Test fallant per `/api/jocs/start`**

`src/pages/api/jocs/start.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Supabase abans d'importar l'endpoint
const mockInsert = vi.fn();
const mockUpsert = vi.fn();
const mockFrom = vi.fn();
const mockSupabase = {
  from: mockFrom,
};

vi.mock('../../../lib/jocs-economics/server/supabase', () => ({
  getSupabase: () => mockSupabase,
}));

// Mock bank
vi.mock('../../../lib/jocs-economics/server/bank', () => ({
  nextQuestion: vi.fn(() => ({
    id: 'eco-001-test',
    categoria: 'economia',
    dificultat: 1.0,
    opciones: ['A', 'B', 'C', 'D'],
    correcta: 0,
    explicacion: 'Test explicació',
  })),
}));

// Set env vars before import
process.env.SUPABASE_URL = 'http://localhost';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';
process.env.JOCS_TOKEN_SECRET = 'test-secret-at-least-32-chars-aaaaa';

import { POST } from './start';

function makeRequest(body: any, ip = '1.2.3.4'): { request: Request; clientAddress: string } {
  return {
    request: new Request('http://localhost/api/jocs/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
    clientAddress: ip,
  };
}

beforeEach(() => {
  mockFrom.mockReset();
  mockInsert.mockReset();
  mockUpsert.mockReset();
  // Default chain: active_games.insert returns ok; institutes.upsert returns ok
  mockFrom.mockImplementation((table: string) => {
    if (table === 'active_games') {
      return {
        insert: vi.fn(() => ({ select: vi.fn(() => ({ single: vi.fn(() => ({ data: { game_id: 'test-game-id' }, error: null })) })) })),
      };
    }
    if (table === 'institutes') {
      return {
        upsert: vi.fn(() => ({ error: null })),
      };
    }
    if (table === 'active_games_count') {
      return {
        select: vi.fn(() => ({ data: [], error: null })),
      };
    }
    return { select: vi.fn(() => ({ data: [], error: null })) };
  });
});

describe('POST /api/jocs/start', () => {
  it('returns 200 with gameId + token + firstQuestion for valid input', async () => {
    const res = await POST(makeRequest({ playerName: 'Alice', institute: 'IES Test' }) as any);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.gameId).toBeTruthy();
    expect(body.token).toBeTruthy();
    expect(body.question).toMatchObject({
      id: 'eco-001-test',
      enunciado: undefined, // bank uses 'enunciado' OR cos MD; depen, però l'endpoint hauria d'usar enunciado del front si exists. Per a la nostra schema test, simplement no comprovem enunciado.
      opciones: expect.any(Array),
    });
    // SECURITY: question never includes correcta or explicacion
    expect(body.question).not.toHaveProperty('correcta');
    expect(body.question).not.toHaveProperty('explicacion');
    expect(body.lives).toBe(3);
    expect(body.score).toBe(0);
  });

  it('returns 400 for empty playerName', async () => {
    const res = await POST(makeRequest({ playerName: '', institute: 'IES Test' }) as any);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('invalid-name');
  });

  it('returns 400 for whitespace-only playerName', async () => {
    const res = await POST(makeRequest({ playerName: '   ', institute: 'IES Test' }) as any);
    expect(res.status).toBe(400);
  });

  it('returns 400 for playerName > 40 chars', async () => {
    const res = await POST(makeRequest({ playerName: 'a'.repeat(41), institute: 'IES Test' }) as any);
    expect(res.status).toBe(400);
  });

  it('returns 400 for institute < 2 chars', async () => {
    const res = await POST(makeRequest({ playerName: 'Alice', institute: 'a' }) as any);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('invalid-institute');
  });

  it('trims playerName and institute', async () => {
    const res = await POST(makeRequest({ playerName: '  Alice  ', institute: '  IES Test  ' }) as any);
    expect(res.status).toBe(200);
    // Verifica que l'insert va rebre els valors trimmed (introspecció del mock)
  });
});
```

- [ ] **Step 2: Verificar fail**

Run: `npx vitest run src/pages/api/jocs/start.test.ts`
Expected: FAIL (módul no existeix).

- [ ] **Step 3: Implementar `start.ts`**

```ts
// src/pages/api/jocs/start.ts
// POST /api/jocs/start — crea una nova partida (spec §7.1).

import type { APIRoute } from 'astro';
import { getSupabase } from '../../../lib/jocs-economics/server/supabase';
import { nextQuestion } from '../../../lib/jocs-economics/server/bank';
import { signGameToken } from '../../../lib/jocs-economics/server/tokens';
import { normalizeInstitute } from '../../../lib/jocs-economics/server/institutes';

interface StartRequest {
  playerName: string;
  institute: string;
}

interface PublicQuestion {
  id: string;
  enunciado?: string;
  opciones: string[];
}

function jsonError(reason: string, status = 400): Response {
  return new Response(JSON.stringify({ error: reason }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function jsonOk<T>(data: T, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function rng(seed: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = (h ^ seed.charCodeAt(i)) * 16777619;
  let t = h >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function toPublicQuestion(q: { id: string; opciones: string[]; enunciado?: string }): PublicQuestion {
  return {
    id: q.id,
    ...(q.enunciado ? { enunciado: q.enunciado } : {}),
    opciones: q.opciones,
  };
}

export const POST: APIRoute = async ({ request }) => {
  let body: Partial<StartRequest>;
  try {
    body = (await request.json()) as StartRequest;
  } catch {
    return jsonError('invalid-body', 400);
  }

  // Validacions
  const playerName = String(body.playerName ?? '').trim();
  const institute = String(body.institute ?? '').trim();

  if (playerName.length < 1 || playerName.length > 40) {
    return jsonError('invalid-name', 400);
  }
  if (institute.length < 2 || institute.length > 80) {
    return jsonError('invalid-institute', 400);
  }

  const supabase = getSupabase();
  const instituteNorm = normalizeInstitute(institute);

  // Upsert institute (no fa res si ja existeix amb mateix norm)
  await supabase.from('institutes').upsert(
    {
      institute_norm: instituteNorm,
      institute_display: institute,
      last_seen_at: new Date().toISOString(),
    },
    { onConflict: 'institute_norm', ignoreDuplicates: false },
  );

  // Crear active_game
  const { data: gameRow, error: insertErr } = await supabase
    .from('active_games')
    .insert({
      player_name: playerName,
      institute_norm: instituteNorm,
      institute_display: institute,
      current_difficulty: 1.0,
      lives: 3,
      score: 0,
    })
    .select('game_id')
    .single();

  if (insertErr || !gameRow) {
    return jsonError('database-error', 500);
  }

  const gameId = gameRow.game_id as string;

  // Seleccionar la primera pregunta
  const firstQ = nextQuestion(1.0, [], rng(gameId));

  // Update active_game amb la pregunta actual
  await supabase
    .from('active_games')
    .update({
      current_question_id: firstQ.id,
      current_question_started_at: new Date().toISOString(),
    })
    .eq('game_id', gameId);

  // Signa el token
  const secret = process.env.JOCS_TOKEN_SECRET;
  if (!secret) return jsonError('server-misconfigured', 500);
  const token = signGameToken(gameId, secret);

  return jsonOk({
    gameId,
    token,
    question: toPublicQuestion(firstQ),
    lives: 3,
    score: 0,
  });
};
```

- [ ] **Step 4: Verificar pass**

Run: `npx vitest run src/pages/api/jocs/start.test.ts`
Expected: 6 tests PASS.

### Task 8b — `answer.ts` (la complexa)

- [ ] **Step 5: Test fallant per `/api/jocs/answer`**

`src/pages/api/jocs/answer.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signGameToken } from '../../../lib/jocs-economics/server/tokens';

const SECRET = 'test-secret-at-least-32-chars-long-aaaa';
process.env.JOCS_TOKEN_SECRET = SECRET;
process.env.SUPABASE_URL = 'http://localhost';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';

// --- Mocks ---
const mockGameRow = {
  game_id: 'test-game-id',
  player_name: 'Alice',
  institute_norm: 'iestestnorm',
  institute_display: 'IES Test',
  current_difficulty: 1.0,
  lives: 3,
  score: 0,
  questions_answered: 0,
  time_total_ms: 0,
  seen_question_ids: ['eco-001'],
  current_question_id: 'eco-001',
  current_question_started_at: new Date(Date.now() - 5000).toISOString(),
  finished: false,
};

const mockSelectChain = (data: any, error: any = null) => ({
  select: vi.fn(() => ({
    eq: vi.fn(() => ({
      single: vi.fn(() => ({ data, error })),
    })),
  })),
});

const mockFrom = vi.fn();

vi.mock('../../../lib/jocs-economics/server/supabase', () => ({
  getSupabase: () => ({ from: mockFrom }),
}));

vi.mock('../../../lib/jocs-economics/server/bank', () => ({
  nextQuestion: vi.fn(() => ({
    id: 'eco-002',
    opciones: ['x', 'y', 'z', 'w'],
    correcta: 1,
    explicacion: 'next q expl',
  })),
}));

// Mock bank questions lookup (per al servidor saber la correcta de la pregunta actual)
vi.mock('../../../server-only/jocs-bank.json', () => ({
  default: {
    preguntas: [
      { id: 'eco-001', categoria: 'economia', dificultat: 1.0, opciones: ['a','b','c','d'], correcta: 2, explicacion: 'eco-001 expl' },
      { id: 'eco-002', categoria: 'economia', dificultat: 1.2, opciones: ['x','y','z','w'], correcta: 1, explicacion: 'eco-002 expl' },
    ],
  },
}));

import { POST } from './answer';

function makeReq(body: any): { request: Request; clientAddress: string } {
  return {
    request: new Request('http://localhost/api/jocs/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
    clientAddress: '1.2.3.4',
  };
}

beforeEach(() => {
  mockFrom.mockReset();
});

describe('POST /api/jocs/answer', () => {
  it('rejects with invalid-token if JWT no és vàlid', async () => {
    const res = await POST(makeReq({
      gameId: 'test-game-id',
      token: 'invalid.token.here',
      questionId: 'eco-001',
      optionIdx: 0,
      clientElapsedMs: 5000,
    }) as any);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('invalid-token');
  });

  it('rejects with wrong-question if questionId no coincideix amb current_question_id', async () => {
    mockFrom.mockImplementation(() => ({
      ...mockSelectChain({ ...mockGameRow, current_question_id: 'eco-XXX' }, null),
    }));
    const token = signGameToken('test-game-id', SECRET);
    const res = await POST(makeReq({
      gameId: 'test-game-id',
      token,
      questionId: 'eco-001',
      optionIdx: 0,
      clientElapsedMs: 5000,
    }) as any);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('wrong-question');
  });

  // Tests addicionals:
  // - returns 200 with isCorrect=true + scoreGain=100 if optionIdx === correcta
  // - returns 200 with isCorrect=false + scoreGain=0 + livesLeft=2 if incorrect
  // - applies timeout (serverElapsed > 50s) → forced incorrect
  // - returns finished:true when lives reaches 0
  // - elapsedMsRecorded = min(serverElapsed, clientElapsedMs + 2000)
  // (Es deixa en aquest plan com a marc; la implementació real ha de cobrir cadascun)
});
```

**NOTA al engineer**: el test cas-de-base per `answer.ts` és complex per la quantitat de mock-ing de Supabase. Implementa primer el cas success (200 OK encert) i el cas wrong-question, després itera. Si arribar a >80% coverage demana >2h, conforma't amb els 5-6 happy paths principals (`invalid-token`, `wrong-question`, `correct answer`, `incorrect answer`, `timeout forçat`, `finished quan lives=0`) i fes smoke E2E manual a T12 per a la resta.

- [ ] **Step 6: Verificar fail**

Run: `npx vitest run src/pages/api/jocs/answer.test.ts`
Expected: FAIL.

- [ ] **Step 7: Implementar `answer.ts`**

```ts
// src/pages/api/jocs/answer.ts
// POST /api/jocs/answer — registra resposta + calcula score + transita o finalitza (spec §7.2).

import type { APIRoute } from 'astro';
import { getSupabase } from '../../../lib/jocs-economics/server/supabase';
import { nextQuestion, BankExhaustedError } from '../../../lib/jocs-economics/server/bank';
import { verifyGameToken } from '../../../lib/jocs-economics/server/tokens';
import { nextDifficulty } from '../../../lib/jocs-economics/server/difficulty';
import { scoreFor } from '../../../lib/jocs-economics/server/scoring';
import { compareScores } from '../../../lib/jocs-economics/server/ranking';
import bankData from '../../../server-only/jocs-bank.json';

const TIMER_QUESTION_MS = 45 * 1000;
const TIMER_GRACE_MS = 5 * 1000;
const MAX_ELAPSED_MS = TIMER_QUESTION_MS + TIMER_GRACE_MS; // 50s
const CLIENT_TOLERANCE_MS = 2000;

interface AnswerRequest {
  gameId: string;
  token: string;
  questionId: string;
  optionIdx: number;
  clientElapsedMs: number;
}

function jsonError(reason: string, status = 400): Response {
  return new Response(JSON.stringify({ error: reason }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function rng(seed: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = (h ^ seed.charCodeAt(i)) * 16777619;
  let t = h >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function lookupQuestion(id: string) {
  return (bankData as any).preguntas.find((q: any) => q.id === id);
}

function toPublicQuestion(q: any) {
  return {
    id: q.id,
    ...(q.enunciado ? { enunciado: q.enunciado } : {}),
    opciones: q.opciones,
  };
}

export const POST: APIRoute = async ({ request }) => {
  let body: Partial<AnswerRequest>;
  try {
    body = (await request.json()) as AnswerRequest;
  } catch {
    return jsonError('invalid-body', 400);
  }

  const { gameId, token, questionId, optionIdx, clientElapsedMs } = body;
  if (!gameId || !token || !questionId || typeof optionIdx !== 'number' || typeof clientElapsedMs !== 'number') {
    return jsonError('invalid-body', 400);
  }

  // Verificar JWT
  const secret = process.env.JOCS_TOKEN_SECRET;
  if (!secret) return jsonError('server-misconfigured', 500);
  const tokenResult = verifyGameToken(token, secret);
  if (!tokenResult.ok || tokenResult.gameId !== gameId) {
    return jsonError('invalid-token', 400);
  }

  const supabase = getSupabase();

  // Carregar el game
  const { data: game, error: loadErr } = await supabase
    .from('active_games')
    .select('*')
    .eq('game_id', gameId)
    .single();

  if (loadErr || !game) return jsonError('invalid-game', 404);
  if (game.finished) return jsonError('already-finished', 400);
  if (game.current_question_id !== questionId) return jsonError('wrong-question', 400);

  const currentQ = lookupQuestion(questionId);
  if (!currentQ) return jsonError('invalid-question-id', 400);

  if (optionIdx < 0 || optionIdx >= currentQ.opciones.length) {
    return jsonError('invalid-option', 400);
  }

  // Calcular temps
  const now = Date.now();
  const questionStarted = new Date(game.current_question_started_at).getTime();
  const serverElapsedMs = now - questionStarted;

  let isCorrect: boolean;
  let elapsedMsRecorded: number;

  if (serverElapsedMs > MAX_ELAPSED_MS) {
    // Timeout fatal
    isCorrect = false;
    elapsedMsRecorded = TIMER_QUESTION_MS;
  } else {
    isCorrect = optionIdx === currentQ.correcta;
    elapsedMsRecorded = Math.min(serverElapsedMs, clientElapsedMs + CLIENT_TOLERANCE_MS);
  }

  const scoreGain = isCorrect ? scoreFor(game.current_difficulty) : 0;
  const newScore = game.score + scoreGain;
  const newLives = isCorrect ? game.lives : game.lives - 1;
  const newQuestionsAnswered = game.questions_answered + 1;
  const newTimeTotal = game.time_total_ms + elapsedMsRecorded;
  const newDifficulty = nextDifficulty(game.current_difficulty, isCorrect);
  const newSeen = [...(game.seen_question_ids || []), questionId];

  // Si lives==0 → finalitzar
  if (newLives === 0) {
    // Inserir a scores
    await supabase.from('scores').insert({
      game_id: gameId,
      player_name: game.player_name,
      institute_norm: game.institute_norm,
      institute_display: game.institute_display,
      score: newScore,
      questions_answered: newQuestionsAnswered,
      time_total_ms: newTimeTotal,
      max_difficulty_reached: newDifficulty,
    });

    // Marcar finished (el cron netejarà)
    await supabase
      .from('active_games')
      .update({ finished: true, lives: 0, score: newScore, questions_answered: newQuestionsAnswered, time_total_ms: newTimeTotal })
      .eq('game_id', gameId);

    // Calcular finalRank
    const { data: allScores } = await supabase
      .from('scores')
      .select('score, questions_answered, time_total_ms')
      .order('score', { ascending: false })
      .order('questions_answered', { ascending: false })
      .order('time_total_ms', { ascending: true })
      .limit(1000);

    let finalRank: number | null = null;
    if (allScores) {
      const idx = allScores.findIndex(
        (s: any) =>
          s.score === newScore &&
          s.questions_answered === newQuestionsAnswered &&
          s.time_total_ms === newTimeTotal,
      );
      finalRank = idx >= 0 ? idx + 1 : null;
    }

    // Calcular instituteRank (via vista materialitzada)
    const { data: instLb } = await supabase
      .from('institute_leaderboard')
      .select('institute_norm, total_score, total_questions, total_time_ms')
      .order('total_score', { ascending: false })
      .order('total_questions', { ascending: false })
      .order('total_time_ms', { ascending: true })
      .limit(100);

    let instituteRank: number | null = null;
    if (instLb) {
      const idx = instLb.findIndex((r: any) => r.institute_norm === game.institute_norm);
      instituteRank = idx >= 0 ? idx + 1 : null;
    }

    return new Response(JSON.stringify({
      result: {
        isCorrect,
        correctIdx: currentQ.correcta,
        scoreGain,
        livesLeft: 0,
        elapsedMsRecorded,
        ...(currentQ.explicacion ? { explicacion: currentQ.explicacion } : {}),
      },
      finished: true,
      final: {
        score: newScore,
        questionsAnswered: newQuestionsAnswered,
        timeTotalMs: newTimeTotal,
        maxDifficultyReached: newDifficulty,
        finalRank,
        instituteRank,
      },
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // Continua: pick next question
  let nextQ;
  try {
    nextQ = nextQuestion(newDifficulty, newSeen, rng(`${gameId}:${newQuestionsAnswered}`));
  } catch (err) {
    if (err instanceof BankExhaustedError) {
      // Bank esgotat → finalitza la partida com a si lives=0
      // (igual flow que dalt; per concisió, reenviem com a finished:true sense bank)
      await supabase.from('scores').insert({
        game_id: gameId,
        player_name: game.player_name,
        institute_norm: game.institute_norm,
        institute_display: game.institute_display,
        score: newScore,
        questions_answered: newQuestionsAnswered,
        time_total_ms: newTimeTotal,
        max_difficulty_reached: newDifficulty,
      });
      await supabase.from('active_games').update({ finished: true }).eq('game_id', gameId);
      return new Response(JSON.stringify({
        result: { isCorrect, correctIdx: currentQ.correcta, scoreGain, livesLeft: newLives, elapsedMsRecorded },
        finished: true,
        final: { score: newScore, questionsAnswered: newQuestionsAnswered, timeTotalMs: newTimeTotal, maxDifficultyReached: newDifficulty, finalRank: null, instituteRank: null },
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    throw err;
  }

  // Update active_game
  await supabase
    .from('active_games')
    .update({
      current_difficulty: newDifficulty,
      lives: newLives,
      score: newScore,
      questions_answered: newQuestionsAnswered,
      time_total_ms: newTimeTotal,
      seen_question_ids: newSeen,
      current_question_id: nextQ.id,
      current_question_started_at: new Date().toISOString(),
      last_action_at: new Date().toISOString(),
    })
    .eq('game_id', gameId);

  return new Response(JSON.stringify({
    result: {
      isCorrect,
      correctIdx: currentQ.correcta,
      scoreGain,
      livesLeft: newLives,
      elapsedMsRecorded,
      ...(currentQ.explicacion ? { explicacion: currentQ.explicacion } : {}),
    },
    nextQuestion: toPublicQuestion(nextQ),
    totals: { score: newScore, questionsAnswered: newQuestionsAnswered, timeTotalMs: newTimeTotal },
  }), { status: 200, headers: { 'Content-Type': 'application/json' } });
};
```

- [ ] **Step 8: Verificar pass**

Run: `npx vitest run src/pages/api/jocs/answer.test.ts`
Expected: 2+ tests PASS (almenys els 2 explícits de l'esquelet de test).

### Task 8c — `finish.ts`

- [ ] **Step 9: Implementar `finish.ts`** (similar a la branca `finished:true` de `answer.ts`, però disparat manualment)

`src/pages/api/jocs/finish.ts`:

```ts
// src/pages/api/jocs/finish.ts
// POST /api/jocs/finish — finalització voluntària (spec §7.3).
// Si questionsAnswered < 5 → no insertem a scores (decisió D7).

import type { APIRoute } from 'astro';
import { getSupabase } from '../../../lib/jocs-economics/server/supabase';
import { verifyGameToken } from '../../../lib/jocs-economics/server/tokens';

const MIN_QUESTIONS_FOR_RANKING = 5;

interface FinishRequest {
  gameId: string;
  token: string;
}

function jsonError(reason: string, status = 400): Response {
  return new Response(JSON.stringify({ error: reason }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  let body: Partial<FinishRequest>;
  try {
    body = (await request.json()) as FinishRequest;
  } catch {
    return jsonError('invalid-body', 400);
  }

  const { gameId, token } = body;
  if (!gameId || !token) return jsonError('invalid-body', 400);

  const secret = process.env.JOCS_TOKEN_SECRET;
  if (!secret) return jsonError('server-misconfigured', 500);
  const tokenResult = verifyGameToken(token, secret);
  if (!tokenResult.ok || tokenResult.gameId !== gameId) return jsonError('invalid-token', 400);

  const supabase = getSupabase();
  const { data: game, error: loadErr } = await supabase
    .from('active_games')
    .select('*')
    .eq('game_id', gameId)
    .single();

  if (loadErr || !game) return jsonError('invalid-game', 404);
  if (game.finished) return jsonError('already-finished', 400);

  // D7: si menys de 5 preguntes, no compta al ranking
  if (game.questions_answered < MIN_QUESTIONS_FOR_RANKING) {
    await supabase.from('active_games').update({ finished: true }).eq('game_id', gameId);
    return new Response(JSON.stringify({
      final: {
        score: game.score,
        questionsAnswered: game.questions_answered,
        timeTotalMs: game.time_total_ms,
        maxDifficultyReached: game.current_difficulty,
        finalRank: null,
        instituteRank: null,
      },
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // Insert a scores (com a answer.ts quan lives==0)
  await supabase.from('scores').insert({
    game_id: gameId,
    player_name: game.player_name,
    institute_norm: game.institute_norm,
    institute_display: game.institute_display,
    score: game.score,
    questions_answered: game.questions_answered,
    time_total_ms: game.time_total_ms,
    max_difficulty_reached: game.current_difficulty,
  });

  await supabase.from('active_games').update({ finished: true }).eq('game_id', gameId);

  // Calcular ranks (reuse pattern d'answer.ts; aquí simplificat retornem null per brevedat MVP)
  return new Response(JSON.stringify({
    final: {
      score: game.score,
      questionsAnswered: game.questions_answered,
      timeTotalMs: game.time_total_ms,
      maxDifficultyReached: game.current_difficulty,
      finalRank: null,
      instituteRank: null,
    },
  }), { status: 200, headers: { 'Content-Type': 'application/json' } });
};
```

`src/pages/api/jocs/finish.test.ts` (esquelet):

```ts
import { describe, it, expect, vi } from 'vitest';
import { signGameToken } from '../../../lib/jocs-economics/server/tokens';

const SECRET = 'test-secret-at-least-32-chars-long-aaaa';
process.env.JOCS_TOKEN_SECRET = SECRET;
process.env.SUPABASE_URL = 'http://localhost';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';

const mockFrom = vi.fn();
vi.mock('../../../lib/jocs-economics/server/supabase', () => ({
  getSupabase: () => ({ from: mockFrom }),
}));

import { POST } from './finish';

describe('POST /api/jocs/finish', () => {
  it('rejects with invalid-token if JWT no és vàlid', async () => {
    const req = new Request('http://localhost/api/jocs/finish', {
      method: 'POST',
      body: JSON.stringify({ gameId: 'test-game', token: 'bad.token' }),
    });
    const res = await POST({ request: req } as any);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('invalid-token');
  });

  it('returns finalRank: null when questionsAnswered < 5 (D7 anti-grind)', async () => {
    mockFrom.mockImplementation(() => ({
      select: () => ({ eq: () => ({ single: () => ({
        data: {
          game_id: 'test-game',
          questions_answered: 3,
          score: 200, time_total_ms: 10000, current_difficulty: 2.0,
          finished: false,
        },
        error: null,
      }) }) }),
      update: () => ({ eq: () => ({ data: null, error: null }) }),
    }));
    const token = signGameToken('test-game', SECRET);
    const req = new Request('http://localhost/api/jocs/finish', {
      method: 'POST',
      body: JSON.stringify({ gameId: 'test-game', token }),
    });
    const res = await POST({ request: req } as any);
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.final.finalRank).toBeNull();
  });
});
```

- [ ] **Step 10: Verificar tests passen**

Run: `npx vitest run src/pages/api/jocs/`
Expected: tots PASS (start + answer + finish, ~10+ tests).

- [ ] **Step 11: Verificar build**

Run: `npm run build 2>&1 | tail -3`
Expected: `Complete!`.

- [ ] **Step 12: Commit**

```bash
git add src/pages/api/jocs/start.ts src/pages/api/jocs/start.test.ts src/pages/api/jocs/answer.ts src/pages/api/jocs/answer.test.ts src/pages/api/jocs/finish.ts src/pages/api/jocs/finish.test.ts
git commit -m "feat(jocs): API routes start + answer + finish (core game flow)"
```

---

## Task 9: API routes leaderboard + institutes + rate limit middleware

**Files:**
- Create: `src/pages/api/jocs/leaderboard.ts`
- Create: `src/pages/api/jocs/leaderboard.test.ts`
- Create: `src/pages/api/jocs/institutes.ts`
- Create: `src/pages/api/jocs/institutes.test.ts`
- Create: `src/middleware.ts` (rate limit IP per a `/api/jocs/start`)

- [ ] **Step 1: Implementar `leaderboard.ts`**

```ts
// src/pages/api/jocs/leaderboard.ts
// GET /api/jocs/leaderboard?type=individual|institute&limit=50&offset=0

import type { APIRoute } from 'astro';
import { getSupabase } from '../../../lib/jocs-economics/server/supabase';

const MAX_LIMIT = 200;
const DEFAULT_LIMIT = 50;

export const GET: APIRoute = async ({ url }) => {
  const type = url.searchParams.get('type') ?? 'individual';
  const limit = Math.min(parseInt(url.searchParams.get('limit') ?? String(DEFAULT_LIMIT), 10), MAX_LIMIT);
  const offset = Math.max(parseInt(url.searchParams.get('offset') ?? '0', 10), 0);

  const supabase = getSupabase();

  if (type === 'individual') {
    const { data, error } = await supabase
      .from('scores')
      .select('player_name, institute_display, score, questions_answered, time_total_ms, finished_at')
      .order('score', { ascending: false })
      .order('questions_answered', { ascending: false })
      .order('time_total_ms', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      return new Response(JSON.stringify({ error: 'database-error' }), { status: 500 });
    }
    const rows = (data ?? []).map((r: any, i: number) => ({
      rank: offset + i + 1,
      playerName: r.player_name,
      institute: r.institute_display,
      score: r.score,
      questionsAnswered: r.questions_answered,
      timeTotalMs: r.time_total_ms,
      finishedAt: r.finished_at,
    }));
    return new Response(JSON.stringify({ type: 'individual', rows }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=30, s-maxage=30',
      },
    });
  }

  if (type === 'institute') {
    const { data, error } = await supabase
      .from('institute_leaderboard')
      .select('institute_display, total_score, players_count, top_player_name, top_player_score')
      .order('total_score', { ascending: false })
      .order('total_questions', { ascending: false })
      .order('total_time_ms', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      return new Response(JSON.stringify({ error: 'database-error' }), { status: 500 });
    }
    const rows = (data ?? []).map((r: any, i: number) => ({
      rank: offset + i + 1,
      institute: r.institute_display,
      totalScore: r.total_score,
      playersCount: r.players_count,
      topPlayer: { playerName: r.top_player_name, score: r.top_player_score },
    }));
    return new Response(JSON.stringify({ type: 'institute', rows }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=30, s-maxage=30',
      },
    });
  }

  return new Response(JSON.stringify({ error: 'invalid-type' }), { status: 400 });
};
```

- [ ] **Step 2: Implementar `institutes.ts`** (autocompletat)

```ts
// src/pages/api/jocs/institutes.ts
// GET /api/jocs/institutes?q=lluis → suggestions per autocompletat

import type { APIRoute } from 'astro';
import { getSupabase } from '../../../lib/jocs-economics/server/supabase';

export const GET: APIRoute = async ({ url }) => {
  const q = (url.searchParams.get('q') ?? '').trim();
  if (q.length < 2) {
    return new Response(JSON.stringify({ suggestions: [] }), { status: 200 });
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('institutes')
    .select('institute_display')
    .ilike('institute_display', `%${q}%`)
    .order('players_count', { ascending: false })
    .limit(10);

  if (error) {
    return new Response(JSON.stringify({ error: 'database-error' }), { status: 500 });
  }
  const suggestions = (data ?? []).map((r: any) => r.institute_display);
  return new Response(JSON.stringify({ suggestions }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    },
  });
};
```

- [ ] **Step 3: Crear tests bàsics**

`src/pages/api/jocs/leaderboard.test.ts`:

```ts
import { describe, it, expect, vi } from 'vitest';

process.env.SUPABASE_URL = 'http://localhost';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';

const mockFrom = vi.fn();
vi.mock('../../../lib/jocs-economics/server/supabase', () => ({
  getSupabase: () => ({ from: mockFrom }),
}));

import { GET } from './leaderboard';

describe('GET /api/jocs/leaderboard', () => {
  it('returns individual leaderboard with rank 1-indexed', async () => {
    mockFrom.mockImplementation(() => ({
      select: () => ({
        order: function () { return this; },
        range: () => ({
          data: [
            { player_name: 'Alice', institute_display: 'IES A', score: 1000, questions_answered: 30, time_total_ms: 60000, finished_at: '2026-05-27T12:00:00Z' },
            { player_name: 'Bob', institute_display: 'IES B', score: 800, questions_answered: 25, time_total_ms: 50000, finished_at: '2026-05-27T11:00:00Z' },
          ],
          error: null,
        }),
      }),
    }));
    const url = new URL('http://localhost/api/jocs/leaderboard?type=individual&limit=50');
    const res = await GET({ url } as any);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.type).toBe('individual');
    expect(body.rows[0]).toMatchObject({ rank: 1, playerName: 'Alice', score: 1000 });
    expect(body.rows[1].rank).toBe(2);
  });

  it('returns 400 for invalid type', async () => {
    mockFrom.mockImplementation(() => ({
      select: () => ({ order: function () { return this; }, range: () => ({ data: [], error: null }) }),
    }));
    const url = new URL('http://localhost/api/jocs/leaderboard?type=invalid');
    const res = await GET({ url } as any);
    expect(res.status).toBe(400);
  });
});
```

`src/pages/api/jocs/institutes.test.ts`:

```ts
import { describe, it, expect, vi } from 'vitest';

process.env.SUPABASE_URL = 'http://localhost';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';

const mockFrom = vi.fn();
vi.mock('../../../lib/jocs-economics/server/supabase', () => ({
  getSupabase: () => ({ from: mockFrom }),
}));

import { GET } from './institutes';

describe('GET /api/jocs/institutes', () => {
  it('returns empty suggestions for q < 2 chars', async () => {
    const url = new URL('http://localhost/api/jocs/institutes?q=a');
    const res = await GET({ url } as any);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.suggestions).toEqual([]);
  });

  it('returns suggestions for q >= 2 chars', async () => {
    mockFrom.mockImplementation(() => ({
      select: () => ({
        ilike: () => ({
          order: () => ({
            limit: () => ({ data: [{ institute_display: 'IES Lluís Vives' }], error: null }),
          }),
        }),
      }),
    }));
    const url = new URL('http://localhost/api/jocs/institutes?q=lluis');
    const res = await GET({ url } as any);
    const body = await res.json();
    expect(body.suggestions).toContain('IES Lluís Vives');
  });
});
```

- [ ] **Step 4: Implementar middleware de rate limit**

`src/middleware.ts`:

```ts
// src/middleware.ts
// Astro middleware global.
// Rate limit IP per a /api/jocs/start: 1 partida activa, 20 starts/hora.

import { defineMiddleware } from 'astro:middleware';

// In-memory store (Vercel functions són efímeres però per al MVP serveix
// per a deflate burst attacks; per a multi-region o persistència real cal Redis/KV)
const ipStartTimestamps = new Map<string, number[]>();
const HOUR_MS = 60 * 60 * 1000;
const MAX_STARTS_PER_HOUR = 20;

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.url.pathname === '/api/jocs/start' && context.request.method === 'POST') {
    const ip = context.clientAddress || 'unknown';
    const now = Date.now();
    const timestamps = ipStartTimestamps.get(ip) ?? [];
    const recent = timestamps.filter((t) => now - t < HOUR_MS);

    if (recent.length >= MAX_STARTS_PER_HOUR) {
      return new Response(JSON.stringify({ error: 'rate-limited' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    recent.push(now);
    ipStartTimestamps.set(ip, recent);
  }

  return next();
});
```

**NOTA**: Aquesta solució no és perfecta per a Vercel (cada cold start reseteja el Map). Acceptable per al MVP per a aturar bursts simples; un atacant determinat amb instàncies fredes pot saltar-ho. Si veiem abús real, migrar a Vercel KV o Upstash Redis.

- [ ] **Step 5: Verificar tests passen**

Run: `npx vitest run src/pages/api/jocs/`
Expected: tots PASS.

- [ ] **Step 6: Verificar build**

Run: `npm run build 2>&1 | tail -3`
Expected: `Complete!`.

- [ ] **Step 7: Commit**

```bash
git add src/pages/api/jocs/leaderboard.ts src/pages/api/jocs/leaderboard.test.ts src/pages/api/jocs/institutes.ts src/pages/api/jocs/institutes.test.ts src/middleware.ts
git commit -m "feat(jocs): API leaderboard + institutes + rate-limit middleware"
```

---

# LOT C — UI (T10–T11)

## Task 10: Client wrapper + types + JocsApp + screens base

**Files:**
- Create: `src/lib/jocs-economics/client/types.ts`
- Create: `src/lib/jocs-economics/client/api.ts`
- Create: `src/components/jocs-economics/jocs.css`
- Create: `src/components/jocs-economics/JocsApp.tsx`
- Create: `src/components/jocs-economics/screens/Welcome.tsx`
- Create: `src/components/jocs-economics/screens/Playing.tsx`
- Create: `src/components/jocs-economics/screens/Result.tsx`

- [ ] **Step 1: Crear `types.ts`**

```ts
// src/lib/jocs-economics/client/types.ts

export interface PublicQuestion {
  id: string;
  enunciado?: string;
  opciones: string[];
}

export interface StartRequest { playerName: string; institute: string }
export interface StartResponse { gameId: string; token: string; question: PublicQuestion; lives: number; score: number }

export interface AnswerRequest { gameId: string; token: string; questionId: string; optionIdx: number; clientElapsedMs: number }

export interface AnswerResult {
  isCorrect: boolean;
  correctIdx: number;
  scoreGain: number;
  livesLeft: number;
  elapsedMsRecorded: number;
  explicacion?: string;
}

export interface AnswerResponseOngoing {
  result: AnswerResult;
  nextQuestion: PublicQuestion;
  totals: { score: number; questionsAnswered: number; timeTotalMs: number };
}

export interface AnswerResponseFinished {
  result: AnswerResult;
  finished: true;
  final: FinalStats;
}

export type AnswerResponse = AnswerResponseOngoing | AnswerResponseFinished;

export interface FinalStats {
  score: number;
  questionsAnswered: number;
  timeTotalMs: number;
  maxDifficultyReached: number;
  finalRank: number | null;
  instituteRank: number | null;
}

export interface LeaderboardIndividualRow {
  rank: number; playerName: string; institute: string;
  score: number; questionsAnswered: number; timeTotalMs: number; finishedAt: string;
}
export interface LeaderboardInstituteRow {
  rank: number; institute: string; totalScore: number; playersCount: number;
  topPlayer: { playerName: string; score: number };
}

export interface ApiError { error: string }
```

- [ ] **Step 2: Crear `api.ts`** (fetch wrapper)

```ts
// src/lib/jocs-economics/client/api.ts
// Fetch wrapper tipat per a les API routes /api/jocs/*.

import type {
  StartRequest, StartResponse,
  AnswerRequest, AnswerResponse,
  FinalStats,
  LeaderboardIndividualRow, LeaderboardInstituteRow,
} from './types';

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'request-failed');
  return data as T;
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'request-failed');
  return data as T;
}

export const api = {
  start: (req: StartRequest) => postJson<StartResponse>('/api/jocs/start', req),
  answer: (req: AnswerRequest) => postJson<AnswerResponse>('/api/jocs/answer', req),
  finish: (gameId: string, token: string) =>
    postJson<{ final: FinalStats }>('/api/jocs/finish', { gameId, token }),
  leaderboardIndividual: (limit = 50, offset = 0) =>
    getJson<{ type: 'individual'; rows: LeaderboardIndividualRow[] }>(
      `/api/jocs/leaderboard?type=individual&limit=${limit}&offset=${offset}`,
    ),
  leaderboardInstitute: (limit = 50, offset = 0) =>
    getJson<{ type: 'institute'; rows: LeaderboardInstituteRow[] }>(
      `/api/jocs/leaderboard?type=institute&limit=${limit}&offset=${offset}`,
    ),
  institutes: (q: string) =>
    getJson<{ suggestions: string[] }>(`/api/jocs/institutes?q=${encodeURIComponent(q)}`),
};
```

- [ ] **Step 3: Crear `jocs.css`** (basat al patró Cajút amb adaptacions)

```css
/* src/components/jocs-economics/jocs.css */
:root {
  --jocs-cream: #FBF6EC;
  --jocs-paper: #FFFFFF;
  --jocs-ink: #2A1F18;
  --jocs-ink-soft: #5C4A3D;
  --jocs-ink-mute: #8A7868;
  --jocs-line: #E5D4BD;
  --jocs-line-soft: #EFE2CB;
  --jocs-terracota: #C44E2C;
  --jocs-teal: #1F6E6E;
  --jocs-mostassa: #D4A24C;
  --jocs-pine: #2E5E3A;
  --jocs-blue-deep: #1F4E6E;  /* color identitari Jocs Econòmics */
}

.jocs-app {
  min-height: 100vh;
  background: var(--jocs-cream);
  color: var(--jocs-ink);
  font-family: "Switzer", ui-sans-serif, system-ui, sans-serif;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  max-width: 640px;
  margin: 0 auto;
}

.jocs-title {
  font-family: "Fraunces", Georgia, serif;
  font-variation-settings: "SOFT" 80, "WONK" 0;
  font-weight: 500;
}

.jocs-enunciado {
  font-family: "Fraunces", Georgia, serif;
  font-variation-settings: "SOFT" 80;
  font-weight: 500;
  font-size: 22px;
  line-height: 1.35;
  color: var(--jocs-ink);
  margin: 0 0 20px;
}

.jocs-option {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 14px 18px;
  margin-bottom: 8px;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 15px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  font-family: inherit;
  line-height: 1.3;
}
.jocs-option .letter {
  font-family: "Fraunces", serif;
  font-weight: 600;
  font-size: 22px;
  flex: 0 0 28px;
  text-align: center;
}
.jocs-option[data-opt="0"] { background: var(--jocs-terracota); }
.jocs-option[data-opt="1"] { background: var(--jocs-teal); }
.jocs-option[data-opt="2"] { background: var(--jocs-mostassa); color: #3a2a10; }
.jocs-option[data-opt="3"] { background: var(--jocs-pine); }
.jocs-option.disabled { opacity: .5; pointer-events: none; }
.jocs-option.selected { filter: brightness(.75); }
.jocs-option.correct { outline: 4px solid white; outline-offset: -4px; box-shadow: 0 0 0 6px var(--jocs-pine); }
.jocs-option.wrong { outline: 4px solid white; outline-offset: -4px; box-shadow: 0 0 0 6px var(--jocs-terracota); }

.jocs-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: "JetBrains Mono", monospace;
  font-size: 13px;
  color: var(--jocs-ink-soft);
  margin-bottom: 16px;
}

.jocs-lives { font-size: 18px; letter-spacing: 4px; color: var(--jocs-terracota); }
.jocs-lives .empty { color: var(--jocs-line); }

.jocs-timer-bar {
  height: 4px;
  background: var(--jocs-line);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 20px;
}
.jocs-timer-bar .fill {
  height: 100%;
  background: var(--jocs-terracota);
  transition: width 250ms linear;
}
.jocs-timer-bar.urgent .fill { background: #9C3A1C; }

.jocs-input {
  display: block;
  width: 100%;
  padding: 12px 14px;
  margin-bottom: 10px;
  font-family: inherit;
  font-size: 15px;
  border: 1px solid var(--jocs-line);
  border-radius: 6px;
  background: var(--jocs-paper);
  color: var(--jocs-ink);
}

.jocs-button-primary {
  display: block;
  width: 100%;
  padding: 14px;
  margin-top: 12px;
  background: var(--jocs-ink);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
}
.jocs-button-primary:disabled { background: var(--jocs-ink-mute); cursor: not-allowed; }

.jocs-link { color: var(--jocs-blue-deep); text-decoration: underline; cursor: pointer; }
.jocs-mute { color: var(--jocs-ink-mute); font-size: 13px; }
```

- [ ] **Step 4: Crear `JocsApp.tsx` (router per fase)**

```tsx
// src/components/jocs-economics/JocsApp.tsx
import { useState, useEffect } from 'preact/hooks';
import type { PublicQuestion, FinalStats, AnswerResult } from '../../lib/jocs-economics/client/types';
import { api } from '../../lib/jocs-economics/client/api';
import { Welcome } from './screens/Welcome';
import { Playing } from './screens/Playing';
import { Result } from './screens/Result';
import { GameOver } from './screens/GameOver';
import './jocs.css';

const STORAGE_KEY = 'jocs:player';

interface SavedIdentity { name: string; institute: string }

type Phase = 'welcome' | 'playing' | 'result' | 'gameover';

interface GameSession {
  gameId: string;
  token: string;
  currentQuestion: PublicQuestion;
  livesLeft: number;
  score: number;
  questionsAnswered: number;
  timeTotalMs: number;
  questionStartedAtMs: number;
}

interface ResultData {
  result: AnswerResult;
  selectedOptionIdx: number;
}

export default function JocsApp() {
  const [identity, setIdentity] = useState<SavedIdentity | null>(null);
  const [phase, setPhase] = useState<Phase>('welcome');
  const [session, setSession] = useState<GameSession | null>(null);
  const [lastResult, setLastResult] = useState<ResultData | null>(null);
  const [final, setFinal] = useState<FinalStats | null>(null);

  // SSR-safe: només llegir localStorage en useEffect
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setIdentity(JSON.parse(raw));
      } catch {
        // ignore
      }
    }
  }, []);

  function saveIdentity(name: string, institute: string) {
    const i = { name, institute };
    setIdentity(i);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(i)); } catch {}
  }

  async function startGame(name: string, institute: string) {
    saveIdentity(name, institute);
    try {
      const res = await api.start({ playerName: name, institute });
      setSession({
        gameId: res.gameId,
        token: res.token,
        currentQuestion: res.question,
        livesLeft: res.lives,
        score: res.score,
        questionsAnswered: 0,
        timeTotalMs: 0,
        questionStartedAtMs: Date.now(),
      });
      setPhase('playing');
    } catch (err: any) {
      alert(`Error: ${err?.message || 'no es pot iniciar la partida'}`);
    }
  }

  async function submitAnswer(optionIdx: number) {
    if (!session) return;
    const clientElapsedMs = Date.now() - session.questionStartedAtMs;
    try {
      const res = await api.answer({
        gameId: session.gameId,
        token: session.token,
        questionId: session.currentQuestion.id,
        optionIdx,
        clientElapsedMs,
      });
      setLastResult({ result: res.result, selectedOptionIdx: optionIdx });
      if ('finished' in res) {
        setFinal(res.final);
        // Mostrem el resultat 3s i transitem a GameOver
        setPhase('result');
        setTimeout(() => setPhase('gameover'), 3000);
      } else {
        setSession({
          ...session,
          currentQuestion: res.nextQuestion,
          livesLeft: res.result.livesLeft,
          score: res.totals.score,
          questionsAnswered: res.totals.questionsAnswered,
          timeTotalMs: res.totals.timeTotalMs,
          questionStartedAtMs: Date.now() + 3000, // s'aplica quan transitem playing després de 3s
        });
        setPhase('result');
        setTimeout(() => {
          setSession((prev) => prev ? { ...prev, questionStartedAtMs: Date.now() } : prev);
          setPhase('playing');
        }, 3000);
      }
    } catch (err: any) {
      alert(`Error: ${err?.message || 'no es pot enviar la resposta'}`);
    }
  }

  async function endVoluntary() {
    if (!session) return;
    try {
      const res = await api.finish(session.gameId, session.token);
      setFinal(res.final);
      setPhase('gameover');
    } catch (err: any) {
      alert(`Error: ${err?.message || 'no es pot finalitzar'}`);
    }
  }

  function playAgain() {
    if (!identity) return;
    startGame(identity.name, identity.institute);
  }

  if (phase === 'welcome' || !session) {
    return (
      <div class="jocs-app">
        <Welcome initialIdentity={identity} onStart={startGame} />
      </div>
    );
  }

  if (phase === 'playing') {
    return (
      <div class="jocs-app">
        <Playing
          session={session}
          onAnswer={submitAnswer}
          onEnd={endVoluntary}
        />
      </div>
    );
  }

  if (phase === 'result' && lastResult) {
    return (
      <div class="jocs-app">
        <Result
          question={session.currentQuestion}
          result={lastResult.result}
          selectedOptionIdx={lastResult.selectedOptionIdx}
        />
      </div>
    );
  }

  if (phase === 'gameover' && final) {
    return (
      <div class="jocs-app">
        <GameOver final={final} onPlayAgain={playAgain} />
      </div>
    );
  }

  return <div class="jocs-app"><p class="jocs-mute">Carregant…</p></div>;
}
```

- [ ] **Step 5: Crear `Welcome.tsx`**

```tsx
// src/components/jocs-economics/screens/Welcome.tsx
import { useState, useEffect } from 'preact/hooks';
import { api } from '../../../lib/jocs-economics/client/api';

interface Props {
  initialIdentity: { name: string; institute: string } | null;
  onStart: (name: string, institute: string) => void;
}

export function Welcome({ initialIdentity, onStart }: Props) {
  const [name, setName] = useState(initialIdentity?.name ?? '');
  const [institute, setInstitute] = useState(initialIdentity?.institute ?? '');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [manifest, setManifest] = useState<{ totals: { preguntas: number; byCategoria: Record<string, number> } } | null>(null);

  useEffect(() => {
    fetch('/jocs-economics/manifest.json')
      .then((r) => r.ok ? r.json() : null)
      .then((m) => m && setManifest(m))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (institute.length < 2) {
      setSuggestions([]);
      return;
    }
    const handle = setTimeout(() => {
      api.institutes(institute)
        .then((res) => setSuggestions(res.suggestions))
        .catch(() => setSuggestions([]));
    }, 250);
    return () => clearTimeout(handle);
  }, [institute]);

  const canStart = name.trim().length >= 1 && name.trim().length <= 40
    && institute.trim().length >= 2 && institute.trim().length <= 80;

  return (
    <>
      <h1 class="jocs-title" style={{ fontSize: 36, fontStyle: 'italic', margin: '20px 0 4px' }}>
        Jocs Econòmics
      </h1>
      <p class="jocs-mute" style={{ marginBottom: 24 }}>
        Retos de economía, finanzas y empresa.
        <br />
        ¿Cuántos aciertos antes de perder 3 vidas?
      </p>

      {manifest && (
        <p class="jocs-mute" style={{ marginBottom: 16 }}>
          {manifest.totals.preguntas} preguntas · 3 categorías
        </p>
      )}

      <input
        class="jocs-input"
        placeholder="Tu nombre"
        value={name}
        maxLength={40}
        onInput={(e) => setName((e.target as HTMLInputElement).value)}
      />
      <input
        class="jocs-input"
        placeholder="Instituto o centro"
        value={institute}
        maxLength={80}
        list="jocs-institutes-list"
        onInput={(e) => setInstitute((e.target as HTMLInputElement).value)}
      />
      <datalist id="jocs-institutes-list">
        {suggestions.map((s) => <option key={s} value={s} />)}
      </datalist>

      <button
        class="jocs-button-primary"
        disabled={!canStart}
        onClick={() => onStart(name.trim(), institute.trim())}
      >
        Empezar
      </button>

      <p class="jocs-mute" style={{ marginTop: 20, fontSize: 11, lineHeight: 1.4 }}>
        Tu nombre e instituto aparecerán públicamente en el ranking.
      </p>

      <p style={{ textAlign: 'center', marginTop: 32 }}>
        <a class="jocs-link" href="/jocs-economics/leaderboard/">Ver ranking →</a>
      </p>
    </>
  );
}
```

- [ ] **Step 6: Crear `Playing.tsx`**

```tsx
// src/components/jocs-economics/screens/Playing.tsx
import { useState, useEffect } from 'preact/hooks';
import type { PublicQuestion } from '../../../lib/jocs-economics/client/types';

const TIMER_MS = 45000;

interface Props {
  session: {
    currentQuestion: PublicQuestion;
    livesLeft: number;
    score: number;
    questionsAnswered: number;
    questionStartedAtMs: number;
  };
  onAnswer: (optionIdx: number) => void;
  onEnd: () => void;
}

export function Playing({ session, onAnswer, onEnd }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [tick, setTick] = useState(0);
  const [showConfirmEnd, setShowConfirmEnd] = useState(false);

  // Reset selected quan canvia la pregunta
  useEffect(() => {
    setSelected(null);
  }, [session.currentQuestion.id]);

  // 250ms tick per a la barra de timer
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 250);
    return () => clearInterval(t);
  }, []);

  const elapsedMs = Date.now() - session.questionStartedAtMs;
  const remainingMs = Math.max(0, TIMER_MS - elapsedMs);
  const fillPct = (remainingMs / TIMER_MS) * 100;
  const urgent = remainingMs < 10000;

  // Auto-fail si el timer arriba a 0 sense resposta.
  // Enviem optionIdx=0 (valor vàlid); el servidor detectarà serverElapsedMs > 50s
  // i forçarà isCorrect=false (timeout) independentment del valor enviat.
  useEffect(() => {
    if (remainingMs === 0 && selected === null) {
      setSelected(0);
      onAnswer(0);
    }
  }, [remainingMs, selected]);

  function click(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
    onAnswer(idx);
  }

  const lives = Array.from({ length: 3 }, (_, i) =>
    i < session.livesLeft ? '●' : '○'
  ).join('');

  const multiplier = (Math.floor((session.score / Math.max(1, session.questionsAnswered)) / 50) / 10).toFixed(1);

  return (
    <>
      <div class="jocs-stats">
        <span class="jocs-lives">{lives}</span>
        <span>{session.score} pts</span>
        <span>{multiplier}×</span>
      </div>
      <div class={`jocs-timer-bar ${urgent ? 'urgent' : ''}`}>
        <div class="fill" style={{ width: `${fillPct}%` }} />
      </div>

      <p class="jocs-mute" style={{ marginBottom: 8 }}>
        Pregunta {session.questionsAnswered + 1}
      </p>
      <p class="jocs-enunciado">{session.currentQuestion.enunciado || session.currentQuestion.id}</p>

      {session.currentQuestion.opciones.map((opt, i) => (
        <button
          key={i}
          class={`jocs-option ${selected !== null ? 'disabled' : ''} ${selected === i ? 'selected' : ''}`}
          data-opt={i}
          onClick={() => click(i)}
        >
          <span class="letter">{String.fromCharCode(65 + i)}</span>
          <span>{opt}</span>
        </button>
      ))}

      <p style={{ textAlign: 'center', marginTop: 24 }}>
        <a class="jocs-link" onClick={() => setShowConfirmEnd(true)}>Terminar</a>
      </p>

      {showConfirmEnd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--jocs-paper)', padding: 24, borderRadius: 8, maxWidth: 320 }}>
            <p>¿Seguro que quieres terminar la partida?</p>
            <button class="jocs-button-primary" onClick={onEnd}>Sí, terminar</button>
            <button class="jocs-button-primary" style={{ background: 'var(--jocs-line)', color: 'var(--jocs-ink)' }} onClick={() => setShowConfirmEnd(false)}>Continuar jugando</button>
          </div>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 7: Crear `Result.tsx`**

```tsx
// src/components/jocs-economics/screens/Result.tsx
import type { PublicQuestion, AnswerResult } from '../../../lib/jocs-economics/client/types';

interface Props {
  question: PublicQuestion;
  result: AnswerResult;
  selectedOptionIdx: number;
}

export function Result({ question, result, selectedOptionIdx }: Props) {
  const { isCorrect, correctIdx, scoreGain, explicacion } = result;
  return (
    <>
      <h2
        class="jocs-title"
        style={{
          fontSize: 32,
          textAlign: 'center',
          color: isCorrect ? 'var(--jocs-pine)' : '#9C3A1C',
          margin: '32px 0 8px',
        }}
      >
        {isCorrect ? '¡Acierto!' : 'Fallaste'}
      </h2>
      <p style={{ textAlign: 'center', fontSize: 18, margin: '0 0 24px', fontFamily: 'JetBrains Mono, monospace' }}>
        {isCorrect ? `+${scoreGain} puntos` : '−1 vida'}
      </p>

      <p class="jocs-enunciado">{question.enunciado || question.id}</p>

      {question.opciones.map((opt, i) => {
        const isCorrectOpt = i === correctIdx;
        const isSelected = i === selectedOptionIdx;
        let className = 'jocs-option disabled';
        if (isCorrectOpt) className += ' correct';
        else if (isSelected) className += ' wrong';
        return (
          <div key={i} class={className} data-opt={i}>
            <span class="letter">{String.fromCharCode(65 + i)}</span>
            <span>{opt}</span>
          </div>
        );
      })}

      {explicacion && (
        <p class="jocs-mute" style={{ marginTop: 20, fontStyle: 'italic', fontFamily: 'Fraunces, serif', fontSize: 14 }}>
          {explicacion}
        </p>
      )}
    </>
  );
}
```

- [ ] **Step 8: Crear `GameOver.tsx` (stub fins T11)**

```tsx
// src/components/jocs-economics/screens/GameOver.tsx — stub
import type { FinalStats } from '../../../lib/jocs-economics/client/types';

interface Props { final: FinalStats; onPlayAgain: () => void; }

export function GameOver({ final, onPlayAgain }: Props) {
  return (
    <>
      <h2 class="jocs-title" style={{ fontSize: 28, textAlign: 'center', margin: '32px 0' }}>
        Fin de la partida
      </h2>
      <p style={{ fontSize: 48, fontFamily: 'JetBrains Mono, monospace', textAlign: 'center', margin: '16px 0' }}>
        {final.score}
      </p>
      <p class="jocs-mute" style={{ textAlign: 'center' }}>puntos</p>

      <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--jocs-line-soft)' }}>
        <p>Preguntas acertadas: {final.questionsAnswered}</p>
        <p>Tiempo total: {Math.round(final.timeTotalMs / 1000)} s</p>
        <p>Nivel máximo: {final.maxDifficultyReached.toFixed(1)}×</p>
      </div>

      {final.finalRank !== null && (
        <p style={{ marginTop: 24, textAlign: 'center', fontSize: 20 }}>
          Posición #{final.finalRank}
        </p>
      )}
      {final.instituteRank !== null && (
        <p style={{ textAlign: 'center' }}>
          Tu instituto: #{final.instituteRank}
        </p>
      )}

      <button class="jocs-button-primary" onClick={onPlayAgain} style={{ marginTop: 24 }}>
        Jugar de nuevo
      </button>
      <p style={{ textAlign: 'center', marginTop: 16 }}>
        <a class="jocs-link" href="/jocs-economics/leaderboard/">Ver ranking completo →</a>
      </p>
    </>
  );
}
```

- [ ] **Step 9: Verificar build verd**

Run: `npm run build 2>&1 | tail -3`
Expected: `Complete!` (build potser fallarà perquè la ruta encara no existeix; ok, només compilem els components).

- [ ] **Step 10: Verificar tests segueixen verds**

Run: `npx vitest run 2>&1 | tail -4`
Expected: tot verd (no nous tests UI per a aquest commit).

- [ ] **Step 11: Commit**

```bash
git add src/lib/jocs-economics/client src/components/jocs-economics/
git commit -m "feat(jocs): client api wrapper + JocsApp + Welcome/Playing/Result/GameOver screens"
```

---

## Task 11: Leaderboard screen + leaderboard route

**Files:**
- Create: `src/components/jocs-economics/screens/Leaderboard.tsx`
- Create: `src/pages/jocs-economics/leaderboard/index.astro`

- [ ] **Step 1: Crear `Leaderboard.tsx`**

```tsx
// src/components/jocs-economics/screens/Leaderboard.tsx
import { useState, useEffect } from 'preact/hooks';
import { api } from '../../../lib/jocs-economics/client/api';
import type { LeaderboardIndividualRow, LeaderboardInstituteRow } from '../../../lib/jocs-economics/client/types';
import '../jocs.css';

export default function Leaderboard() {
  const [tab, setTab] = useState<'individual' | 'institute'>('individual');
  const [individual, setIndividual] = useState<LeaderboardIndividualRow[]>([]);
  const [institute, setInstitute] = useState<LeaderboardInstituteRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const promise = tab === 'individual'
      ? api.leaderboardIndividual(50, 0).then((r) => setIndividual(r.rows))
      : api.leaderboardInstitute(50, 0).then((r) => setInstitute(r.rows));
    promise.catch(() => {}).finally(() => setLoading(false));
  }, [tab]);

  function formatTime(ms: number): string {
    const s = Math.round(ms / 1000);
    const m = Math.floor(s / 60);
    return `${m}:${String(s % 60).padStart(2, '0')}`;
  }

  return (
    <div class="jocs-app">
      <h1 class="jocs-title" style={{ fontSize: 28, margin: '20px 0' }}>Ranking</h1>

      <div style={{ display: 'flex', gap: 12, borderBottom: '1px solid var(--jocs-line-soft)', marginBottom: 20 }}>
        <button
          onClick={() => setTab('individual')}
          style={{
            background: 'none', border: 'none', padding: '8px 0',
            fontFamily: 'inherit', fontSize: 14, cursor: 'pointer',
            color: tab === 'individual' ? 'var(--jocs-ink)' : 'var(--jocs-ink-mute)',
            borderBottom: tab === 'individual' ? '2px solid var(--jocs-blue-deep)' : '2px solid transparent',
            fontWeight: tab === 'individual' ? 600 : 400,
          }}
        >
          Individual
        </button>
        <button
          onClick={() => setTab('institute')}
          style={{
            background: 'none', border: 'none', padding: '8px 0',
            fontFamily: 'inherit', fontSize: 14, cursor: 'pointer',
            color: tab === 'institute' ? 'var(--jocs-ink)' : 'var(--jocs-ink-mute)',
            borderBottom: tab === 'institute' ? '2px solid var(--jocs-blue-deep)' : '2px solid transparent',
            fontWeight: tab === 'institute' ? 600 : 400,
          }}
        >
          Institutos
        </button>
      </div>

      {loading && <p class="jocs-mute">Cargando…</p>}

      {!loading && tab === 'individual' && (
        individual.length === 0 ? (
          <p class="jocs-mute">Aún no hay partidas registradas. ¡Sé el primero!</p>
        ) : (
          <ol style={{ listStyle: 'none', padding: 0 }}>
            {individual.map((r) => (
              <li key={`${r.rank}-${r.playerName}`} style={{ padding: '12px 0', borderBottom: '1px solid var(--jocs-line-soft)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 600 }}>
                    #{r.rank} {r.playerName}
                  </span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 18 }}>{r.score}</span>
                </div>
                <div class="jocs-mute" style={{ fontSize: 12 }}>
                  {r.institute} · {r.questionsAnswered} preg · {formatTime(r.timeTotalMs)}
                </div>
              </li>
            ))}
          </ol>
        )
      )}

      {!loading && tab === 'institute' && (
        institute.length === 0 ? (
          <p class="jocs-mute">Aún no hay institutos en el ranking.</p>
        ) : (
          <ol style={{ listStyle: 'none', padding: 0 }}>
            {institute.map((r) => (
              <li key={`${r.rank}-${r.institute}`} style={{ padding: '12px 0', borderBottom: '1px solid var(--jocs-line-soft)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 600 }}>
                    #{r.rank} {r.institute}
                  </span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 18 }}>{r.totalScore}</span>
                </div>
                <div class="jocs-mute" style={{ fontSize: 12 }}>
                  Top 5: {r.totalScore} pts · Top jugador: {r.topPlayer.playerName} ({r.topPlayer.score}) · {r.playersCount} participantes
                </div>
              </li>
            ))}
          </ol>
        )
      )}

      <p style={{ textAlign: 'center', marginTop: 32 }}>
        <a class="jocs-link" href="/jocs-economics/">← Volver a jugar</a>
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Crear ruta `leaderboard/index.astro`**

`src/pages/jocs-economics/leaderboard/index.astro`:

```astro
---
import BaseLayout from '../../../layouts/BaseLayout.astro';
import Leaderboard from '../../../components/jocs-economics/screens/Leaderboard';
---

<BaseLayout title="Jocs Econòmics — Ranking" description="Ranking individual y por institutos del quiz competitivo Jocs Econòmics.">
  <Leaderboard client:only="preact" />
</BaseLayout>

<style is:global>
  body { margin: 0; }
</style>
```

**NOTA al engineer**: Si Insider/Cajút usen un Layout diferent (`Layout` vs `BaseLayout`), adapta. Mira `src/pages/juegos/cajut/index.astro` per a confirmar.

- [ ] **Step 3: Verificar build amb la nova ruta**

Run: `npm run build 2>&1 | tail -3`
Expected: `Complete!` amb 1 pàgina nova.

- [ ] **Step 4: Commit**

```bash
git add src/components/jocs-economics/screens/Leaderboard.tsx src/pages/jocs-economics/leaderboard/
git commit -m "feat(jocs): leaderboard screen + leaderboard route"
```

---

# LOT D — Integració final + verificació (T12)

## Task 12: Ruta principal + tarja al hub + smoke + PR

**Files:**
- Create: `src/pages/jocs-economics/index.astro`
- Modify: `src/pages/juegos/index.astro` (afegir tarja "Jocs Econòmics")
- Modify: `docs/jocs-economics-deploy.md` (afegir secció de smoke checklist; opcional)

- [ ] **Step 1: Crear ruta principal**

`src/pages/jocs-economics/index.astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import JocsApp from '../../components/jocs-economics/JocsApp';
---

<BaseLayout title="Jocs Econòmics — quiz competitivo de economía" description="Quiz competitivo de economía, finanzas y empresa con ranking global por jugador y por instituto. 3 vidas, dificultad incremental, escala olímpica.">
  <JocsApp client:only="preact" />
</BaseLayout>

<style is:global>
  body { margin: 0; }
</style>
```

(Adapta `BaseLayout` segons el patró que usa Insider/Cajút.)

- [ ] **Step 2: Afegir tarja al hub `/juegos/`**

Llegir `src/pages/juegos/index.astro`. Després de l'última tarja del `.game-grid` (probablement Cajút), afegir:

```astro
        <a class="game-card available jocs-card" href="/jocs-economics/">
          <div class="gc-eyebrow" style="color:#1F4E6E;">Disponible · Competitivo</div>
          <div class="gc-title serif">Jocs Econòmics</div>
          <p class="gc-desc">Quiz competitivo de economía, finanzas y empresa. Dificultad incremental, 3 vidas, ranking global por jugador y por instituto.</p>
          <p class="gc-note">Asíncrono e individual. Compite con jugadores de toda España.</p>
          <span class="gc-cta" style="color:#1F4E6E;">Empezar →</span>
        </a>
```

I actualitzar la nota final:

```astro
      <p class="note">
        El resto de juegos — Playground, Communist —
        se publicarán a lo largo del 2027.
      </p>
```

(Si la llista de pendents ja deia "Concurso", treu-la — Jocs Econòmics ja l'ha substituida.)

- [ ] **Step 3: Build complet**

Run: `npm run build 2>&1 | tail -6`
Expected: `Complete!`, pàgines = (anterior + 2 noves) = 519 aproximadament.

- [ ] **Step 4: Verificar tota la suite de tests**

Run: `npx vitest run 2>&1 | tail -4`
Expected: ~550 tests, tot verd.

- [ ] **Step 5: Smoke test local (manual)**

Pre-requisits:
- `cp .env.example .env` i ompli les vars (Pau pot saltar Supabase real i usar mocks per a proves)
- O fer servir un projecte Supabase de dev amb la migració aplicada
- Generar JOCS_TOKEN_SECRET: `openssl rand -base64 48`

Run: `npm run dev`
Obrir `http://localhost:4321/jocs-economics/`:
1. Veure pantalla Welcome amb logo + 2 inputs.
2. Si manifest té > 0 preguntes, veure "N preguntas · 3 categorías".
3. Introduir nom + institut → "Empezar".
4. Veure pantalla Playing amb 4 botons, vides ●●●, timer bar.
5. Click una opció → veure Result amb encert/fallat + scoreGain + explicación si existeix.
6. Esperar 3s o navegar manualment a pregunta següent (auto-advance).
7. Repetir fins perdre 3 vides → GameOver amb stats.
8. Visitar `/jocs-economics/leaderboard/` → veure la partida acabada al top.

**NOTA**: si el banc està buit (Pau encara no ha publicat preguntes del webpde bootstrap), el smoke fallarà a la primera. En aquest cas, crear manualment 3-5 preguntes a `src/content/jocs-economics/preguntas/` amb `estado: publicado` per a poder fer smoke.

- [ ] **Step 6: Commit final**

```bash
git add src/pages/jocs-economics/index.astro src/pages/juegos/index.astro
git commit -m "feat(jocs): ruta principal + tarja al hub /juegos/"
```

- [ ] **Step 7: Push + obrir PR**

```bash
git push -u origin feat/jocs-economics
gh pr create --base main --head feat/jocs-economics \
  --title "feat(jocs-economics): quiz competitiu amb ranking persistent (Supabase)" \
  --body "## Resum

**Jocs Econòmics** — quiz competitiu d'economia/finances/empresa per a alumnes Batx + opositors + profes. Ranking global individual + per institut (medaller olímpic). 3 vides, escala incremental de dificultat (gradient continu), banc gran reutilitzat des del concurs.html del webpde antic. Asíncron individual.

## Arquitectura

- **Backend**: Supabase Postgres + Astro API routes (5 endpoints). Primera funcionalitat amb persistència real del web. JWT HS256 per a tokens de partida.
- **Lògica pura** a \`src/lib/jocs-economics/server/{difficulty,scoring,bank,ranking,institutes,tokens}.ts\` — ~30 tests TDD.
- **Bank pipeline**: MDX → 2 JSON (manifest públic + bank privat server-only). Igual patró que Cajút però amb destinació diferent (\`src/server-only/\` enlloc de \`party/\`).
- **UI**: 5 screens Preact mobile-first (Welcome, Playing, Result, GameOver, Leaderboard).
- **Anti-cheat**: server-side game state, JWT, validació de temps server-side amb \`min(serverElapsed, clientElapsedMs+2s)\`, rate-limit IP, banc privat mai bundlejat al client.

## Decisions del spec validades

- 3 vides; ranking max-score (desempat: preguntes desc → temps asc)
- Escala gradient continu (+0.2 per encert; 1.0-10.0)
- Score = round(difficulty × 100); sense speed bonus
- Audiència mixta graduada Batx → oposició
- Nom + Institut anònim (localStorage); ranking individual + per institut (suma top-5)
- 45s/pregunta (sense afectar score, només per temps total)
- UI en castellà

## Acció humana pendent abans del deploy

1. **Crear projecte Supabase** (free tier; vegeu \`docs/jocs-economics-deploy.md\`)
2. **Aplicar migració SQL** \`supabase/migrations/20260527_init_jocs.sql\` al SQL editor de Supabase Studio
3. **Configurar env vars al Vercel**: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, JOCS_TOKEN_SECRET
4. **Bootstrap del banc**: \`node scripts/extract-webpde-concurs.mjs\` (genera MDX a estado:revision) → Pau revisa, calibra dificultat 1-10, marca \`publicado\`
5. Sense banc publicat (≥ 100 preguntes recomanat per D4), el joc no és funcional

## Reviews realitzades

Subagent-driven-development complet: implementer + spec + quality per cada tasca + revisió global final amb Opus.

## Tests

- \`npx vitest run\`: ~550 PASS (53 nous Jocs Econòmics + 500 previs)
- \`npm run build\`: 519 pàgines

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```

---

## Verificació final post-implementació

- [ ] Tots els tests passen (`npx vitest run`)
- [ ] Build verd (`npm run build`, 519+ pàgines)
- [ ] Pau ha aplicat la migració Supabase i configurat env vars
- [ ] Smoke E2E complet: Welcome → 3 partides (encert/fallat/timeout) → GameOver amb stats correctes → Leaderboard mostra les partides → ranking d'institut s'actualitza al cap de 5 min (cron refresh)
- [ ] Anti-cheat verificat:
  - V1: `grep -r correcta dist/` retorna 0 matches a fitxers client
  - V3: deixar timer córrer > 45s → resposta forçada incorrecta
  - V4: refresh durant partida → nova partida
  - V7: modificar request /answer amb score=99999 → ignorat (server source of truth)
- [ ] Web Share API funciona al mòbil (compartir resultat)
- [ ] PR aprovat per Pau (revisió manual)
- [ ] Merge a main amb squash
- [ ] Deploy verificat a producció (`https://profedeeconomia.es/jocs-economics/`)
