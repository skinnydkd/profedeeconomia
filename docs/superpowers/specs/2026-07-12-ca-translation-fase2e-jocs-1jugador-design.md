# CA Translation · Fase 2E (batch 1) — Illes de jocs d'1 jugador en valencià

**Data:** 2026-07-12
**Branca:** `feat/ca-fase2e-jocs-1jugador`
**Fase precedent:** 2D (illes de `/generadores/`, PR #196, merged `87dda1c`)
**Programa:** traducció de tot el web al valencià (norma AVL). Veure memòria `project-ca-translation`.

## Objectiu

Traduir al valencià les **27 illes Preact dels 4 jocs d'1 jugador** (stonks, econopoly, econrisk, seguros), de manera que sota `/ca/juegos/<joc>/` tota la UI i el contingut curt de joc apareguen en valencià, mentre que sota `/` (arrel) es queden en castellà via el prop `locale` amb default `'es'`.

Els **2 jocs multijugador** (cajut 16 illes + insider 12 illes = 28) es tradueixen en un **PR-2 posterior** (Fase 2E batch 2). Aquest spec cobreix **només batch 1**.

## Abast

### Dins d'abast (27 illes, 4 famílies)

| Joc | Root | Illes filles |
|-----|------|--------------|
| **stonks** (7) | `StonksGame` | StartScreen, NewsScreen, AllocateScreen, ResultScreen, FinalScreen, EvolucionChart |
| **econopoly** (7) | `EconopolyGame` | SetupScreen, PassDeviceScreen, BoardView, SidePanel, AuctionModal, EndScreen |
| **econrisk** (7) | `EconriskGame` | SetupScreen, PassDeviceScreen, MapView, PhaseBar, SidePanel, EndScreen |
| **seguros** (6) | `SegurosGame` | SetupScreen, CoverageScreen, EventScreen, DebriefScreen, Scoreboard |

### Fora d'abast

- **Jocs multijugador** cajut i insider → PR-2 (batch 2).
- **`business-game`** (simulador de curs, projecte separat amb Supabase).
- **Pàgines `imprimir.astro`** dels jocs (versions d'impressió; fase de contingut/print).
- **Lògica de servidor** `src/lib/jocs-economics/**` — són funcions pures (bank, ranking, scoring, difficulty, institutes, tokens); les úniques cadenes són comentaris de dev (ja en català). No user-facing.
- Qualsevol canvi a lògica, màquines d'estat, matemàtiques, ids, claus de `localStorage`, notació econòmica.

## Arquitectura

### Diferència respecte a 2C/2D

A 2C/2D les illes eren **planes** i una pàgina de detall passava `locale` a **una** illa. Ací cada joc és un **arbre** (root → pantalles → subcomponents), muntat amb `client:load` a la seua `index.astro`. Passar `locale` com a prop per cada nivell dels 27 fitxers seria costós i propens a error d'oblidar-ne un.

### Decisió: context de Preact per al locale (patró nou, justificat per l'estructura d'arbre)

Nou mòdul `src/components/games/locale-context.ts`:

```ts
import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
import { type Locale, DEFAULT_LOCALE } from '@i18n/locale';

export const GameLocaleContext = createContext<Locale>(DEFAULT_LOCALE);
export const useGameLocale = (): Locale => useContext(GameLocaleContext);
```

- Cada **root** de joc rep prop `locale?: Locale` (default `DEFAULT_LOCALE`) i embolica el seu render en `<GameLocaleContext.Provider value={locale}>`.
- Cada component amb text fa `const c = COPY[useGameLocale()]`. Zero threading manual de props.

### `COPY = { es, ca }` per component (idèntic a 2C/2D)

Cada `.tsx` amb text de cara a l'usuari exporta:

```ts
export const COPY = {
  es: { /* strings castellà (els actuals, mou-los ací) */ },
  ca: { /* traducció valenciana AVL */ },
};
```

i dins del component `const c = COPY[useGameLocale()]`, substituint els literals per `c.<clau>`.

Els components purament visuals (p.ex. `MapView`, `BoardView`, `EvolucionChart` si no tenen text llegible) no exporten `COPY`. Si només tenen etiquetes d'eixos o poques cadenes, sí que en porten (minimal).

### Detecció del locale a la pàgina

Cada `src/pages/juegos/<joc>/index.astro`:

```astro
---
import type { Locale } from '@i18n/locale';
const locale = Astro.currentLocale as Locale;   // GOTCHA vinculant: de currentLocale, MAI de la URL
---
<GameRoot client:load locale={locale} />
```

Sense JS o sota `/` (arrel), el default `'es'` mana → castellà. SEO intacte (servidor emet ES net).

## Guarda de paritat

`src/components/games/copy-parity.test.ts`, mirall exacte de `src/components/generadores/copy-parity.test.ts`: **llista explícita d'imports** de `COPY` de cada illa traduïda de batch-1, amb dos tests per illa:

1. `es` i `ca` tenen conjunts de claus idèntics (recursiu, `keyPaths`).
2. Cap valor `ca` és buit.

A PR-2 s'amplia la llista amb les illes de cajut/insider (o es crea un segon fitxer). El test és un import estàtic, no un escaneig de disc.

## Regles de traducció (valencià AVL)

- Norma AVL. Coherència amb el vocabulari ja fixat a fases anteriors (veure `src/i18n/ui.ts` i memòria): "ferramentes" (no "eines"), preferències pendents de revisió de Pau al ledger.
- **Accents i dièresis sempre** (feedback vinculant).
- **Cap emoji pictogràfic** com a icona; símbols tipogràfics sí (→ × —).
- Notació econòmica, xifres, símbols de moneda: intactes.
- Contingut curt de joc (notícies stonks, cartes d'esdeveniment, noms de casella/territori, esdeveniments de seguros): **sí que es tradueix** — és UI inline curta, no prosa llarga com els cossos MDX.

## Execució (operativa provada 3 cops)

1. Jo (main) cablege primer: mòdul `locale-context.ts` + provider a cada root + `locale` a cada `index.astro` + esquelet del test de paritat. Això evita curses entre subagents.
2. **1 subagent per fitxer `.tsx`** amb text. Prompt: apunta a un germà JA fet com a referència + regles dures (strings only, no tocar maths/ids/storage keys/notació). L'agent afig `export const COPY = {es,ca}`, `const c = COPY[useGameLocale()]`, substituix literals.
3. **Verificar l'estat REAL del fitxer, no l'informe de l'agent** (els subagents completen l'edició encara que caiguen escrivint l'informe per límit de sessió): `grep -c "export const COPY"`, `npm run check`, grep de castellà sobrant.
4. Commit per lots (per família). **No `git checkout -- <file>`** sobre feina d'agent sense commitejar.
5. Afegir cada illa traduïda a `copy-parity.test.ts` a mesura que es confirma.

## Verificació (abans de merge)

- `npm run check` — typecheck estricte (vitest NO fa typecheck).
- `npm run test` — inclou la nova guarda de paritat.
- Grep de castellà sobrant a les 4 carpetes.
- Carregar `/ca/juegos/stonks/` (i un altre) i comprovar VAL; carregar `/juegos/stonks/` i comprovar que segueix ES.
- Build de Vercel verd al PR abans de merge.

## Criteris d'èxit

- Les 27 illes rendereixen en valencià sota `/ca/juegos/<joc>/` i en castellà sota `/juegos/<joc>/`.
- `npm run check` i `npm run test` verds; guarda de paritat cobrix totes les illes traduïdes.
- Cap canvi de comportament del joc (lògica/estat/matemàtiques idèntics).
- Cap regressió SEO (canonical/hreflang intactes; servidor emet ES).
