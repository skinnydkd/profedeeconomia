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

A més de les 27 illes (chrome), **4 overlays de contingut** (un per joc) a `src/i18n/games/`: `stonks-ca.ts`, `seguros-ca.ts`, `econopoly-ca.ts`, `econrisk-ca.ts` — traducció dels camps de text dels fitxers de dades de `src/lib/games/**` (veure §Contingut de joc).

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
import { type Locale, DEFAULT_LOCALE } from '@/i18n/locale';

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

### Contingut de joc (fitxers de dades) — overlay CA per id (patró de Fase 2A)

**Discovery (2026-07-12):** el contingut de joc NO viu als `.tsx` sinó en fitxers de dades sota `src/lib/games/**`: `stonks/data.ts` (actius + blurbs + esdeveniments de vida), `seguros/data.ts` (assegurances + cartes d'esdeveniment + noms d'equip), `econopoly/board.ts` + `events.ts` (caselles + cartes de notícies), `econrisk/factions.ts` + `events.ts` + `map.ts` (faccions + esdeveniments + territoris). Cada ítem té un `id`/`key` estable; el **motor només llig els camps numèrics/estructurals** (`risk`, `prima`, `dano`, `peso`, `returns`, posicions), i els camps de text (`label`, `blurb`, `school`, `power`, `text`…) són **només display**.

Mecanisme (idèntic als overlays de Fase 2A `juegos-ca`/`herramientas-ca`, keyed per id):

- Nou fitxer per joc a `src/i18n/games/<joc>-ca.ts` amb un mapa CA per id per cada col·lecció de contingut, més un **resolver** que fusiona ES+CA:

```ts
// src/i18n/games/stonks-ca.ts
import type { Locale } from '@/i18n/locale';
import type { AssetId, AssetMeta } from '@/lib/games/stonks/types';
import { ASSETS } from '@/lib/games/stonks/data';

const ASSETS_CA: Record<AssetId, { label: string; blurb: string }> = {
  ahorro: { label: 'Estalvi', blurb: '…' },
  // … una entrada per cada id d'ASSETS
};

export function localizeAssets(locale: Locale): AssetMeta[] {
  return locale === 'ca'
    ? ASSETS.map((a) => ({ ...a, ...ASSETS_CA[a.id] }))
    : ASSETS;
}
```

- El component, en lloc d'`import { ASSETS }`, crida `localizeAssets(useGameLocale())`. El fitxer `data.ts` i el motor NO es toquen (mantenen ES cru; el motor ignora els camps de text).
- **Regla dura:** els components rendereixen contingut resolent `id → text localitzat`. Si el motor guardés text display a l'estat (denormalitzat), es refactoritza perquè guarde l'`id` i el component resolga; MAI es guarda text traduïble a l'estat/`localStorage`.

**Completesa:** un test per overlay exigix que **tot** `id` de la col·lecció ES tinga entrada al mapa CA (cap buit silenciós), com els overlays de Fase 2A.

### Detecció del locale a la pàgina

Cada `src/pages/juegos/<joc>/index.astro`:

```astro
---
import type { Locale } from '@/i18n/locale';
const locale = Astro.currentLocale as Locale;   // GOTCHA vinculant: de currentLocale, MAI de la URL
---
<GameRoot client:load locale={locale} />
```

Sense JS o sota `/` (arrel), el default `'es'` mana → castellà. SEO intacte (servidor emet ES net).

## Guardes (dues)

1. **Paritat de chrome** — `src/components/games/copy-parity.test.ts`, mirall exacte de `src/components/generadores/copy-parity.test.ts`: **llista explícita d'imports** de `COPY` de cada illa traduïda, amb dos tests per illa: (a) `es`/`ca` tenen conjunts de claus idèntics (recursiu, `keyPaths`); (b) cap valor `ca` és buit.
2. **Completesa de contingut** — `src/i18n/games/content-parity.test.ts`: per cada overlay, tot `id` de la col·lecció ES té entrada al mapa CA i cap valor CA és buit.

A PR-2 s'amplien les llistes amb cajut/insider. Tots dos són imports estàtics, no escanejos de disc.

## Regles de traducció (valencià AVL)

- Norma AVL. Coherència amb el vocabulari ja fixat a fases anteriors (veure `src/i18n/ui.ts` i memòria): "ferramentes" (no "eines"), preferències pendents de revisió de Pau al ledger.
- **Accents i dièresis sempre** (feedback vinculant).
- **Cap emoji pictogràfic** com a icona; símbols tipogràfics sí (→ × —).
- Notació econòmica, xifres, símbols de moneda: intactes.
- Contingut curt de joc (notícies stonks, cartes d'esdeveniment, noms de casella/territori, esdeveniments de seguros): **sí que es tradueix** — és UI inline curta, no prosa llarga com els cossos MDX.

## Execució (operativa provada 3 cops) — pilot stonks, després fan-out

**Pilot end-to-end amb stonks primer** (chrome + overlay de contingut + resolver + les dues guardes + cablejat de pàgina) per validar la combinació de patrons abans de fanejar als altres 3 jocs. Ordre dins del mateix PR-1: stonks → (revisió) → econopoly + econrisk + seguros en paral·lel.

1. Jo (main) cablege primer: mòdul `locale-context.ts` + provider (patró wrapper prim `XGame`→`XGameInner`) a cada root + `locale` a cada `index.astro` + esquelets dels dos tests de guarda. Això evita curses entre subagents.
2. **1 subagent per fitxer** (chrome `.tsx` amb text; overlay de contingut `<joc>-ca.ts`). Prompt: apunta a un germà JA fet com a referència + regles dures (strings only, no tocar maths/ids/storage keys/notació). Chrome: afig `export const COPY = {es,ca}` + `const c = COPY[useGameLocale()]`. Overlay: mapa CA per id + resolver.
3. **Verificar l'estat REAL del fitxer, no l'informe de l'agent** (els subagents completen l'edició encara que caiguen escrivint l'informe per límit de sessió): `grep -c "export const COPY"`, `npm run check`, grep de castellà sobrant.
4. Commit per lots (per família). **No `git checkout -- <file>`** sobre feina d'agent sense commitejar.
5. Afegir cada illa/overlay traduït a la guarda corresponent a mesura que es confirma.

## Verificació (abans de merge)

- `npm run check` — typecheck estricte (vitest NO fa typecheck).
- `npm run test` — inclou les dues guardes (paritat de chrome + completesa de contingut).
- Grep de castellà sobrant a les 4 carpetes de components i als 4 overlays.
- Carregar `/ca/juegos/stonks/` (i un altre) i comprovar VAL (chrome **i** contingut: actius, notícies, esdeveniments…); carregar `/juegos/stonks/` i comprovar que segueix ES.
- Build de Vercel verd al PR abans de merge.

## Criteris d'èxit

- Les 27 illes (chrome) **i** el contingut de joc rendereixen en valencià sota `/ca/juegos/<joc>/` i en castellà sota `/juegos/<joc>/`.
- `npm run check` i `npm run test` verds; les dues guardes cobrixen tot el traduït (chrome + tots els ids de contingut).
- Cap canvi de comportament del joc (lògica/estat/matemàtiques idèntics; `data.ts` i motor intactes).
- Cap regressió SEO (canonical/hreflang intactes; servidor emet ES).
