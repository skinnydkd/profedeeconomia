# CA Fase 2E batch 1 — Illes de jocs d'1 jugador en valencià · Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deixar els 4 jocs d'1 jugador (stonks, econopoly, econrisk, seguros) del tot en valencià sota `/ca/juegos/<joc>/`, i en castellà sota `/juegos/<joc>/`, sense tocar la lògica de joc.

**Architecture:** El locale arriba de la pàgina Astro (`Astro.currentLocale`) al root del joc com a prop; el root el publica per un context de Preact (`GameLocaleContext`). El **chrome** (text estàtic dels `.tsx`) es tradueix amb `COPY={es,ca}` + `useGameLocale()`. El **contingut** (text als fitxers de dades `src/lib/games/**`) es tradueix amb overlays CA per id a `src/i18n/games/<joc>-ca.ts` + resolvers, deixant `data.ts` i el motor intactes.

**Tech Stack:** Astro 5 (i18n `fallbackType:'rewrite'`), Preact, TypeScript estricte, Vitest.

## Global Constraints

- **Idioma:** valencià, norma AVL. Vocabulari coherent amb fases prèvies (`src/i18n/ui.ts`): "ferramentes" no "eines". Accents/dièresis SEMPRE. Cap emoji pictogràfic (símbols → × — sí).
- **Locale SEMPRE d'`Astro.currentLocale`, MAI de la URL** (sota `fallbackType:'rewrite'` la URL no s'actualitza).
- **Àlies d'import:** `@/*`→`src/*`, `@components/*`→`src/components/*`. NO existeix `@i18n`; usa `@/i18n/locale`.
- **No es toca:** lògica, màquines d'estat, matemàtiques, `id`/`key`, claus de `localStorage`, `src/lib/games/**/engine.ts`/`ai.ts`/`types.ts`, notació econòmica, xifres, símbols de moneda. Els fitxers de dades (`data.ts`, `board.ts`, `events.ts`, `factions.ts`, `map.ts`) es queden en ES cru (el motor els llig); la traducció va als overlays.
- **Default `'es'`:** cada root i resolver cau a castellà si no rep locale (SEO/no-JS intacte).
- **Branca:** `feat/ca-fase2e-jocs-1jugador`. Conventional Commits. Mai push directe a main.
- **Cada canvi verificat amb `npm run check` (typecheck; vitest NO el fa) + `npm run test`.**

## File Structure

**Nou:**
- `src/components/games/locale-context.ts` — `GameLocaleContext` + `useGameLocale()`.
- `src/components/games/copy-parity.test.ts` — guarda de paritat del chrome (imports explícits de `COPY`).
- `src/i18n/games/stonks-ca.ts`, `seguros-ca.ts`, `econopoly-ca.ts`, `econrisk-ca.ts` — overlays de contingut + resolvers.
- `src/i18n/games/content-parity.test.ts` — guarda de completesa dels overlays.

**Modificat:**
- 4 roots: `StonksGame.tsx`, `EconopolyGame.tsx`, `EconriskGame.tsx`, `SegurosGame.tsx` (wrapper prim + provider).
- 4 pàgines: `src/pages/juegos/{stonks,econopoly,econrisk,seguros}/index.astro` (prop `locale`).
- ~21 illes filles amb text (COPY + `useGameLocale()`).

---

## Task 1: Fonament — context de locale + cablejat de roots i pàgines

Cablejat que fa jo (main), no subagents, per evitar curses. Deixa tots els jocs funcionant en ES (default) amb el provider al seu lloc.

**Files:**
- Create: `src/components/games/locale-context.ts`
- Modify: `src/components/games/{stonks/StonksGame,econopoly/EconopolyGame,econrisk/EconriskGame,seguros/SegurosGame}.tsx`
- Modify: `src/pages/juegos/{stonks,econopoly,econrisk,seguros}/index.astro`

**Interfaces:**
- Produces: `GameLocaleContext` (Preact `Context<Locale>`), `useGameLocale(): Locale`. Cada root accepta `{ locale?: Locale }`.

- [ ] **Step 1: Crear el mòdul de context**

`src/components/games/locale-context.ts`:

```ts
/** @jsxImportSource preact */
import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
import { type Locale, DEFAULT_LOCALE } from '@/i18n/locale';

// Shared across every game island tree. The game root sets it from the
// Astro page's `Astro.currentLocale`; children read it via useGameLocale().
export const GameLocaleContext = createContext<Locale>(DEFAULT_LOCALE);

export const useGameLocale = (): Locale => useContext(GameLocaleContext);
```

- [ ] **Step 2: Embolicar cada root amb el provider (patró wrapper prim)**

Per a cada root, afig els imports i converteix el cos actual en `XGameInner`, exposant un default nou que injecta el provider. Exemple complet per stonks (`src/components/games/stonks/StonksGame.tsx`):

Afegir imports a dalt:
```tsx
import { GameLocaleContext } from '../locale-context';
import { DEFAULT_LOCALE, type Locale } from '@/i18n/locale';
```

Canviar la línia `export default function StonksGame() {` per `function StonksGameInner() {` i afegir damunt:
```tsx
export default function StonksGame({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  return (
    <GameLocaleContext.Provider value={locale}>
      <StonksGameInner />
    </GameLocaleContext.Provider>
  );
}
```

(Les declaracions de funció es hissen, així que la referència a `StonksGameInner` damunt de la seua declaració és vàlida.)

Repeteix EXACTAMENT el mateix per als altres 3 roots, canviant només el nom:
| Fitxer | `export default function X() {` → | Wrapper afegit damunt |
|--------|-----------------------------------|-----------------------|
| `econopoly/EconopolyGame.tsx` | `function EconopolyGameInner() {` | `export default function EconopolyGame({ locale = DEFAULT_LOCALE }: { locale?: Locale }) { return (<GameLocaleContext.Provider value={locale}><EconopolyGameInner /></GameLocaleContext.Provider>); }` |
| `econrisk/EconriskGame.tsx` | `function EconriskGameInner() {` | idem amb `EconriskGame`/`EconriskGameInner` |
| `seguros/SegurosGame.tsx` | `function SegurosGameInner() {` | idem amb `SegurosGame`/`SegurosGameInner` |

- [ ] **Step 3: Passar el locale des de cada pàgina**

Per a cada `src/pages/juegos/<joc>/index.astro`, afig al frontmatter i al muntatge. Exemple stonks:

```astro
---
import type { Locale } from '@/i18n/locale';
import GameShell from '@components/games/GameShell.astro';
import StonksGame from '@components/games/stonks/StonksGame.tsx';
const locale = Astro.currentLocale as Locale;
---
<GameShell title="Stonks" slug="stonks">
  <StonksGame client:load locale={locale} />
</GameShell>
```

Igual per econopoly/econrisk/seguros: afig `import type { Locale }`, `const locale = Astro.currentLocale as Locale;`, i `locale={locale}` al `client:load`. (Conserva els atributs actuals: `wide`, `title`, `slug`.)

- [ ] **Step 4: Verificar typecheck**

Run: `npm run check`
Expected: PASS (0 errors). Els roots reben `locale` opcional; cap fill el consumeix encara → tot renderitza en ES.

- [ ] **Step 5: Commit**

```bash
git add src/components/games/locale-context.ts src/components/games/*/StonksGame.tsx src/components/games/*/EconopolyGame.tsx src/components/games/*/EconriskGame.tsx src/components/games/*/SegurosGame.tsx src/pages/juegos/{stonks,econopoly,econrisk,seguros}/index.astro
git commit -m "feat(i18n): thread locale into single-player game roots via context"
```

---

## Task 2: Pilot stonks — chrome + overlay de contingut (end-to-end)

Valida la combinació chrome + contingut abans de fanejar. Revisió humana després d'aquesta tasca.

**Files:**
- Modify (chrome): `src/components/games/stonks/{StartScreen,NewsScreen,AllocateScreen,ResultScreen,FinalScreen}.tsx` (i `EvolucionChart.tsx` si té text llegible).
- Create (contingut): `src/i18n/games/stonks-ca.ts`
- Create (guardes): `src/components/games/copy-parity.test.ts`, `src/i18n/games/content-parity.test.ts`

**Interfaces:**
- Consumes: `useGameLocale()` (Task 1).
- Produces: cada illa chrome exporta `COPY: { es: Record<string,unknown>; ca: Record<string,unknown> }`. `stonks-ca.ts` exporta resolvers `localizeAssets(locale)` (+ un per cada altra col·lecció de contingut de `stonks/data.ts`, p.ex. esdeveniments de vida) i les seues maps CA.

- [ ] **Step 1: Traduir el chrome de stonks (subagents, 1 per fitxer)**

Per cada `.tsx` de chrome amb text, dispatch un subagent amb aquest patró (referència: cap encara → usa aquest exemple literal com a guia):

Patró que ha d'aplicar a `StartScreen.tsx` (exemple real):
```tsx
/** @jsxImportSource preact */
import { useGameLocale } from '../locale-context';

interface Props { hasSave: boolean; onStart: () => void; onContinue: () => void; }

export const COPY = {
  es: {
    title: 'Stonks',
    intro: 'Invierte durante 25 años (2000–2024) repartiendo tu patrimonio entre distintos activos. Tu objetivo: terminar con más que «El Mercat», una IA que invierte siempre en un índice. ¿Lo conseguirás?',
    continue: 'Continuar partida',
    start: 'Empezar',
  },
  ca: {
    title: 'Stonks',
    intro: 'Invertix durant 25 anys (2000–2024) repartint el teu patrimoni entre distints actius. El teu objectiu: acabar amb més que «El Mercat», una IA que invertix sempre en un índex. Ho aconseguiràs?',
    continue: 'Continua la partida',
    start: 'Comença',
  },
};

export function StartScreen({ hasSave, onStart, onContinue }: Props) {
  const c = COPY[useGameLocale()];
  return (
    <div class="sk-phone sk-start">
      <h1 class="sk-year serif">{c.title}</h1>
      <p class="sk-intro">{c.intro}</p>
      {hasSave && <button class="sk-cta ghost" onClick={onContinue}>{c.continue}</button>}
      <button class="sk-cta" onClick={onStart}>{c.start}</button>
    </div>
  );
}
```

Regles dures al prompt del subagent: només strings de cara a l'usuari; no toques props, lògica, classes CSS, `id`/keys, ni matemàtiques; valencià AVL amb accents; conserva la notació econòmica i els símbols. Si el fitxer no té text llegible (p.ex. `EvolucionChart` només pinta), no l'edites i informa'n.

- [ ] **Step 2: Crear l'overlay de contingut de stonks**

Subagent que llig `src/lib/games/stonks/data.ts` i `types.ts` i crea `src/i18n/games/stonks-ca.ts`. Patró:

```ts
import type { Locale } from '@/i18n/locale';
import type { AssetId, AssetMeta } from '@/lib/games/stonks/types';
import { ASSETS } from '@/lib/games/stonks/data';

// CA translation of the display fields (label, blurb) of every asset, keyed by id.
const ASSETS_CA: Record<AssetId, { label: string; blurb: string }> = {
  ahorro:       { label: 'Estalvi',   blurb: 'Diners disponibles a l\'instant; quasi no dona rendiment i perd poder amb la inflació.' },
  // … una entrada per CADA id d'ASSETS (deposito, bonos, oro, ibex, sp500, bitcoin, inmobiliario)
};

export function localizeAssets(locale: Locale): AssetMeta[] {
  return locale === 'ca' ? ASSETS.map((a) => ({ ...a, ...ASSETS_CA[a.id] })) : ASSETS;
}

// Repeat the same pattern (CA map keyed by id + resolver) for every OTHER
// text-bearing collection in stonks/data.ts (e.g. life events). Numeric-only
// data (returns, etc.) needs no overlay.
```

El subagent inventaria totes les col·leccions amb text de `data.ts` i crea una map CA + resolver per cadascuna.

- [ ] **Step 3: Endollar els resolvers als components de stonks**

Als components que importaven dades ES directament (p.ex. `AllocateScreen` que llista actius), substituir `import { ASSETS }` per la crida al resolver:
```tsx
import { localizeAssets } from '@/i18n/games/stonks-ca';
// dins del component:
const assets = localizeAssets(useGameLocale());
```
(Fer-ho al subagent del fitxer corresponent o en un pas de cablejat propi. No canviar la forma de les dades, només l'origen localitzat.)

- [ ] **Step 4: Crear la guarda de paritat del chrome**

`src/components/games/copy-parity.test.ts` (mirall de `src/components/generadores/copy-parity.test.ts`):

```ts
import { describe, it, expect } from 'vitest';
import { COPY as StartScreen } from './stonks/StartScreen';
import { COPY as NewsScreen } from './stonks/NewsScreen';
import { COPY as AllocateScreen } from './stonks/AllocateScreen';
import { COPY as ResultScreen } from './stonks/ResultScreen';
import { COPY as FinalScreen } from './stonks/FinalScreen';

// Every localized game chrome island exports COPY = { es, ca }. This guard
// fails when a key is added to one language and forgotten in the other.
// Add each island here as it is translated.
const ISLANDS: [string, { es: Record<string, unknown>; ca: Record<string, unknown> }][] = [
  ['stonks/StartScreen', StartScreen],
  ['stonks/NewsScreen', NewsScreen],
  ['stonks/AllocateScreen', AllocateScreen],
  ['stonks/ResultScreen', ResultScreen],
  ['stonks/FinalScreen', FinalScreen],
];

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

function keyPaths(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) =>
    isRecord(value) ? keyPaths(value, `${prefix}${key}.`) : [`${prefix}${key}`],
  );
}

describe('game chrome COPY parity', () => {
  for (const [name, copy] of ISLANDS) {
    it(`${name}: es and ca have identical key sets`, () => {
      expect(keyPaths(copy.ca).sort()).toEqual(keyPaths(copy.es).sort());
    });
    it(`${name}: no ca value is empty`, () => {
      const walk = (obj: Record<string, unknown>, prefix = '') => {
        for (const [key, value] of Object.entries(obj)) {
          if (typeof value === 'function') continue;
          if (isRecord(value)) walk(value, `${prefix}${key}.`);
          else expect(value, `${name}.ca.${prefix}${key}`).toBeTruthy();
        }
      };
      walk(copy.ca);
    });
  }
});
```

(Inclou només les illes de stonks que realment exporten `COPY`; ajusta la llista a les que tenen text.)

- [ ] **Step 5: Crear la guarda de completesa del contingut**

`src/i18n/games/content-parity.test.ts`: per cada col·lecció, comprova que `localizeX('ca')` cobrix tots els ids amb valors no buits i que difereix de l'ES. Patró per stonks:

```ts
import { describe, it, expect } from 'vitest';
import { ASSETS } from '@/lib/games/stonks/data';
import { localizeAssets } from './stonks-ca';

describe('stonks content overlay completeness', () => {
  it('every asset id is translated and non-empty in ca', () => {
    const ca = localizeAssets('ca');
    expect(ca.map((a) => a.id).sort()).toEqual(ASSETS.map((a) => a.id).sort());
    for (const a of ca) {
      expect(a.label, `label ${a.id}`).toBeTruthy();
      expect(a.blurb, `blurb ${a.id}`).toBeTruthy();
    }
  });
  it('ca labels differ from es (actually translated)', () => {
    const es = localizeAssets('es');
    const ca = localizeAssets('ca');
    // At least some label changed; identical means the overlay was not applied.
    expect(ca.some((a, i) => a.label !== es[i].label || a.blurb !== es[i].blurb)).toBe(true);
  });
});
```

(Afig un bloc anàleg per cada altra col·lecció de contingut traduïda de stonks.)

- [ ] **Step 6: Verificar (estat REAL, no informes d'agents)**

```bash
grep -rc "export const COPY" src/components/games/stonks   # nombre d'illes chrome traduïdes
npm run check                                               # typecheck estricte
npm run test -- copy-parity content-parity                 # les dues guardes
grep -rnE "[¿¡]|ñ|ió\b" src/components/games/stonks src/i18n/games/stonks-ca.ts  # castellà sobrant (revisió manual)
```
Expected: `check` i `test` PASS; el grep no mostra castellà de cara a l'usuari sense traduir.

- [ ] **Step 7: Commit**

```bash
git add src/components/games/stonks src/i18n/games/stonks-ca.ts src/components/games/copy-parity.test.ts src/i18n/games/content-parity.test.ts
git commit -m "feat(i18n): translate the stonks game to Valencian (chrome + content)"
```

**CHECKPOINT: revisió humana del pilot stonks abans de fanejar.**

---

## Task 3: econopoly — chrome + overlay de contingut

Mateix patró que el pilot stonks (Task 2), aplicat a econopoly. Referència per als subagents: els fitxers de stonks JA fets.

**Files:**
- Modify (chrome): `src/components/games/econopoly/{SetupScreen,PassDeviceScreen,BoardView,SidePanel,AuctionModal,EndScreen}.tsx` (els que tinguen text).
- Create (contingut): `src/i18n/games/econopoly-ca.ts` — overlays de `src/lib/games/econopoly/board.ts` (caselles/sectors) i `events.ts` (cartes de notícies), keyed per id, + resolvers.
- Modify (guardes): afegir les illes d'econopoly a `copy-parity.test.ts` i els blocs d'econopoly a `content-parity.test.ts`.

**Interfaces:**
- Consumes: `useGameLocale()`, patró `COPY` i patró resolver de Task 2.
- Produces: `COPY` per illa; `localizeBoard(locale)`, `localizeEvents(locale)` (o noms equivalents segons les col·leccions reals) a `econopoly-ca.ts`.

- [ ] **Step 1:** Dispatch 1 subagent per `.tsx` de chrome amb text, apuntant a `src/components/games/stonks/StartScreen.tsx` com a referència del patró. Regles dures idèntiques a Task 2 Step 1.
- [ ] **Step 2:** Dispatch 1 subagent per crear `src/i18n/games/econopoly-ca.ts`, llegint `board.ts`, `events.ts`, `types.ts`; una map CA per id + resolver per cada col·lecció de contingut amb text. Referència: `src/i18n/games/stonks-ca.ts`.
- [ ] **Step 3:** Endollar els resolvers als components d'econopoly que rendereixen contingut (BoardView, SidePanel, AuctionModal, EndScreen segons corresponga).
- [ ] **Step 4:** Afegir les illes d'econopoly a `copy-parity.test.ts` (imports + entrades a `ISLANDS`) i els blocs de completesa a `content-parity.test.ts`.
- [ ] **Step 5: Verificar**
```bash
npm run check
npm run test -- copy-parity content-parity
grep -rnE "[¿¡]|ñ" src/components/games/econopoly src/i18n/games/econopoly-ca.ts
```
Expected: PASS; sense castellà sobrant.
- [ ] **Step 6: Commit**
```bash
git add src/components/games/econopoly src/i18n/games/econopoly-ca.ts src/components/games/copy-parity.test.ts src/i18n/games/content-parity.test.ts
git commit -m "feat(i18n): translate the econopoly game to Valencian (chrome + content)"
```

---

## Task 4: econrisk — chrome + overlay de contingut

Mateix patró. econrisk té més contingut (faccions + esdeveniments + mapa).

**Files:**
- Modify (chrome): `src/components/games/econrisk/{SetupScreen,PassDeviceScreen,MapView,PhaseBar,SidePanel,EndScreen}.tsx` (els que tinguen text).
- Create (contingut): `src/i18n/games/econrisk-ca.ts` — overlays de `factions.ts` (label/school/power), `events.ts` (text), `map.ts` (noms de territori), keyed per id, + resolvers.
- Modify (guardes): afegir econrisk a `copy-parity.test.ts` i `content-parity.test.ts`.

**Interfaces:**
- Produces: `COPY` per illa; `localizeFactions(locale)`, `localizeEvents(locale)`, `localizeTerritories(locale)` (o noms equivalents) a `econrisk-ca.ts`.

- [ ] **Step 1:** 1 subagent per `.tsx` de chrome amb text (referència: stonks/econopoly ja fets).
- [ ] **Step 2:** 1 subagent per `src/i18n/games/econrisk-ca.ts` llegint `factions.ts`, `events.ts`, `map.ts`, `types.ts`; map CA + resolver per col·lecció.
- [ ] **Step 3:** Endollar resolvers a MapView/SidePanel/SetupScreen/EndScreen segons rendereixen faccions/territoris/esdeveniments.
- [ ] **Step 4:** Afegir econrisk a les dues guardes.
- [ ] **Step 5: Verificar**
```bash
npm run check
npm run test -- copy-parity content-parity
grep -rnE "[¿¡]|ñ" src/components/games/econrisk src/i18n/games/econrisk-ca.ts
```
- [ ] **Step 6: Commit**
```bash
git add src/components/games/econrisk src/i18n/games/econrisk-ca.ts src/components/games/copy-parity.test.ts src/i18n/games/content-parity.test.ts
git commit -m "feat(i18n): translate the econrisk game to Valencian (chrome + content)"
```

---

## Task 5: seguros — chrome + overlay de contingut

Mateix patró.

**Files:**
- Modify (chrome): `src/components/games/seguros/{SetupScreen,CoverageScreen,EventScreen,DebriefScreen,Scoreboard}.tsx` (els que tinguen text).
- Create (contingut): `src/i18n/games/seguros-ca.ts` — overlays de `data.ts`: `INSURANCES` (label per key), `EVENT_DECK` (label per key), i `DEFAULT_CONFIG.teamNames` si es mostren; + resolvers.
- Modify (guardes): afegir seguros a `copy-parity.test.ts` i `content-parity.test.ts`.

**Interfaces:**
- Produces: `COPY` per illa; `localizeInsurances(locale)`, `localizeEventDeck(locale)` (i noms d'equip si cal) a `seguros-ca.ts`.

- [ ] **Step 1:** 1 subagent per `.tsx` de chrome amb text (referència: germans ja fets).
- [ ] **Step 2:** 1 subagent per `src/i18n/games/seguros-ca.ts` llegint `data.ts`, `types.ts`; map CA + resolver per `INSURANCES` i `EVENT_DECK` (keyed per `key`).
- [ ] **Step 3:** Endollar resolvers a CoverageScreen/EventScreen/Scoreboard segons rendereixen assegurances/cartes.
- [ ] **Step 4:** Afegir seguros a les dues guardes.
- [ ] **Step 5: Verificar**
```bash
npm run check
npm run test -- copy-parity content-parity
grep -rnE "[¿¡]|ñ" src/components/games/seguros src/i18n/games/seguros-ca.ts
```
- [ ] **Step 6: Commit**
```bash
git add src/components/games/seguros src/i18n/games/seguros-ca.ts src/components/games/copy-parity.test.ts src/i18n/games/content-parity.test.ts
git commit -m "feat(i18n): translate the seguros game to Valencian (chrome + content)"
```

---

## Task 6: Verificació final + PR

**Files:** cap canvi de codi (només comprovació). Possible ajust de bocins.

- [ ] **Step 1: Suite completa**
```bash
npm run check
npm run test
```
Expected: tot PASS.

- [ ] **Step 2: Build de producció local**
```bash
npm run build
```
Expected: build OK (mateix output que Vercel).

- [ ] **Step 3: Comprovació visual VAL vs ES**

Arrancar el preview (`npm run preview` o dev) i obrir:
- `/ca/juegos/stonks/`, `/ca/juegos/econopoly/`, `/ca/juegos/econrisk/`, `/ca/juegos/seguros/` → chrome I contingut en valencià (actius, notícies, faccions, assegurances).
- `/juegos/stonks/` (i un altre) → segueix en castellà.

- [ ] **Step 4: Grep final de castellà sobrant**
```bash
grep -rnE "\b(Empezar|Continuar|Siguiente|Jugar|Equipo|Ahorro|Móvil|Coche)\b" src/components/games/{stonks,econopoly,econrisk,seguros} src/i18n/games
```
Expected: només aparicions dins de blocs `es:` dels `COPY`/overlays; res al render directe.

- [ ] **Step 5: Push + PR**
```bash
git push -u origin feat/ca-fase2e-jocs-1jugador
gh pr create --base main --title "feat(i18n): translate single-player games to Valencian (Fase 2E batch 1)" --body "..."
```
Esperar Vercel verd abans de merge.

---

## Notes d'execució (operativa provada)

- Els subagents COMPLETEN l'edició del fitxer encara que caiguen escrivint l'informe (límit de sessió) → **verificar sempre l'estat real** (`grep`, `npm run check`), no l'informe.
- El dispatch + les guardes de test els cablege JO (main), no els agents, per evitar curses.
- **NO `git checkout -- <file>`** sobre feina d'agent sense commitejar. Commit per lots.
- Un subagent per fitxer. Prompt sempre amb un germà JA fet com a referència + regles dures.
