# Spec de disseny — Stonks (versió solo) + framework de jocs

> Estat: **validat amb Pau** (brainstorming 2026-05-25), pendent de pla d'implementació.
> Autor: Pau + Claude. Idioma del doc: valencià (planificació). Codi/paths en anglès; contingut del joc en castellà.

## 1. Resum i objectiu

Primer joc del rebranding: refer **stonks** (simulador de borsa educatiu) com a **pilot** de la migració del webpde. Doble objectiu:

1. **El joc**: un simulador de cartera d'inversió, **per a un sol jugador, sense backend**, que ensenya diversificació, interès compost, temps al mercat, volatilitat i gestió passiva (DCA).
2. **El framework de jocs**: establir el patró reutilitzable de com viu un joc dins de l'stack actual (Astro + Preact + TS + vitest), perquè la resta de jocs del Bucket A (playground, econopoly, econrisk) el reaprofiten.

L'stonks antic (repo `webpde`, `stonks.html`) era **multijugador via Firebase** (profe amfitrió + alumnes al mòbil). Es **refà des de zero** (s'extreuen les idees, no el codi). El multijugador queda explícitament per a **Fase 2**.

## 2. Context

- **Origen**: `webpde/stonks.html`. Mecànica original: 20 rondes (anys 2000-2024), repartir el 100% del patrimoni entre actius amb desbloqueig progressiu, rendiments històrics reals, esdeveniments vitals aleatoris, renda per ronda, IA "El Mercat" (DCA en indexats) a guanyar, pantalla final de profe amb rànquing i gràfic. Trilingüe CA/ES/EN.
- **Principi del projecte** (`docs/migration-map.md`): refer des de zero amb stack nou; els jocs antics tenien bugs.
- **Decisió de pilot**: stonks solo, sense backend (validat 2026-05-25). El multijugador es resoldrà amb backend compartit quan es facen insider/communist.

## 3. Abast

### Dins d'abast
- Joc stonks complet **per a un sol jugador**, jugable a `/juegos/stonks/`.
- Port fidel del contingut: ~8 classes d'actius amb desbloqueig progressiu, 20 rondes amb dades històriques reals, esdeveniments vitals, renda per ronda, IA "El Mercat" com a referència a guanyar, puntuació per patrimoni final.
- Tres pantalles: inici, bucle de ronda (notícia → repartir → resultat), resum final (gràfic d'evolució SVG propi + 6 lliçons + comparació amb la IA).
- Persistència local (desar/reprendre + millor marca).
- **Framework de jocs reutilitzable** (shell, persistència, estructura de carpetes).
- Només **castellà** (i18n preparat per a CA/VA/EN a fase 2).
- Actualitzar la landing `/juegos` perquè stonks aparega com a disponible.

### Fora d'abast (NO en aquest spec)
- **Multijugador** (profe + alumnes en temps real) → Fase 2, requereix decisió de backend (PartyKit / Cloudflare Durable Objects / Supabase Realtime), compartida amb insider/communist.
- Rànquings globals / comptes d'usuari (backend).
- La resta de jocs (playground, concurso, econopoly, econrisk, insider, communist).
- Traducció publicada a CA/VA/EN (arquitectura sí, contingut no).

## 4. Framework de jocs reutilitzable

El pilot estableix aquest patró, reaprofitable per la resta del Bucket A:

- **Ruta**: `src/pages/juegos/stonks/index.astro` → renderitza una illa Preact a pantalla completa `<StonksGame client:load />`.
- **Lògica pura** a `src/lib/games/stonks/` — funcions pures i deterministes, sense dependència de DOM, **testejades amb vitest** (mateix patró que `src/lib/calc/*`).
- **UI Preact** a `src/components/games/stonks/`.
- **Shell compartit** `src/components/games/GameShell.astro` — contenidor a pantalla completa amb estètica Variant C i botó d'eixida (`← Volver a Juegos`). Reutilitzable per tots els jocs.
- **Persistència compartida** `src/lib/games/storage.ts` — wrapper de localStorage amb claus namespaced per joc (desar/reprendre estat, millor marca). Reutilitzable.
- **Gràfics**: components **SVG propis** (mateix estil que els 54 diagrames del projecte), sense llibreria externa.

## 5. Mecànica de joc (stonks solo)

- **Durada**: 20 rondes = 20 anys (2000-2024).
- **Capital inicial**: import a fixar al pla (l'antic: 5.000 € de cash; revisar per a solo). **Renda per ronda**: ~3.000 € afegits cada any (valor exacte al pla).
- **Acció del jugador**: cada ronda reparteix el **100%** del patrimoni entre els actius desbloquejats (controls −/+; ha de sumar 100% per a confirmar).
- **Actius i desbloqueig progressiu** (ordre de risc creixent):
  - Ronda 0: Ahorro, Depósito (risc baix)
  - Ronda 3: IBEX 35, S&P 500 (risc alt)
  - Ronda 5: Bonos, Oro (risc mitjà)
  - Ronda 8: Bitcoin, Inmobiliario
- **Rendiments**: taula històrica real per actiu i any (vegeu §6).
- **Esdeveniments vitals**: ~14 possibles, 30% de probabilitat per ronda (p. ex. "Avería del coche −1.500 €", "Paga extra +2.000 €").
- **IA "El Mercat"**: jugador no humà amb estratègia DCA en fons indexats; serveix de referència a guanyar.
- **Final**: després de 20 rondes, puntuació = patrimoni net final (cash + valor de la cartera). Es compara amb la IA i es mostren les 6 lliçons.

## 6. Dades

- **Dataset**: rendiments anuals històrics reals 2000-2024 per actiu (Ahorro, Depósito, IBEX 35, S&P 500, Bonos, Oro, Bitcoin —null fins 2012—, Inmobiliario). Origen: dades de l'antic stonks, **verificades/arrodonides** al pla; citar font general (índexs públics).
- **Format**: `src/lib/games/stonks/data.ts` com a estructura tipada (per any → per actiu → % rendiment; `null` si l'actiu encara no existeix).
- **Esdeveniments vitals**: array tipat a `data.ts`.
- **Extensió futura**: el dataset és fàcil d'allargar (afegir anys recents) sense tocar la lògica.

## 7. Pantalles i flux

Flux: **Inicio → (Noticia → Reparte → Resultado de l'any) ×20 → Resumen final**. Mockups validats: `.superpowers/brainstorm/.../stonks-allocate.html` i `stonks-final.html`.

1. **Inicio**: títol, explicació breu, botó "Empezar"; si hi ha partida desada, "Continuar".
2. **Ronda — Noticia**: any + context històric del any (p. ex. "2008 · Crisis financiera global").
3. **Ronda — Reparte** (pantalla central, mòbil-first): any/ronda, marcador "vs. IA", patrimoni actual, llista d'actius amb etiqueta de risc **tipogràfica** (sense emojis) i controls −/+ amb barra; actius bloquejats marcats; "Total 100%" + "Confirmar inversión".
4. **Ronda — Resultado**: rendiment de cada actiu eixe any, esdeveniment vital si n'hi ha, nou patrimoni; botó "Siguiente año".
5. **Resumen final**: veredicte (has guanyat/perdut la IA), patrimoni teu vs IA, **gràfic d'evolució SVG** (línia jugador en terracota + línia IA discontínua), 6 lliçons, botons "Jugar otra vez" i "Ver evolución año a año".

## 8. Estat i model de dades (esbós, es detalla al pla)

```ts
type AssetId = 'ahorro' | 'deposito' | 'ibex' | 'sp500' | 'bonos' | 'oro' | 'bitcoin' | 'inmobiliario';
interface GameState {
  round: number;            // 0..20
  cash: number;
  holdings: Record<AssetId, number>;   // valor en € per actiu
  allocation: Record<AssetId, number>; // % de la ronda en curs (suma 100)
  ai: { netWorth: number };
  history: { year: number; playerNet: number; aiNet: number }[];
  phase: 'news' | 'allocate' | 'results' | 'finished';
}
```

La lògica pura (`engine.ts`) aplica rendiments, esdeveniments i renda; recalcula cartera; avança fase; calcula la IA. Sense estat global ni efectes.

## 9. Persistència

- `src/lib/games/storage.ts`: `loadGame(slug)`, `saveGame(slug, state)`, `clearGame(slug)`, `getBestScore(slug)`, `setBestScore(slug, value)`.
- Clau namespaced: `pde:game:stonks:state` i `pde:game:stonks:best`.
- Es desa l'estat en confirmar cada ronda (reprendre si es tanca la pestanya). En acabar, s'actualitza la millor marca i es neteja l'estat de partida.
- Sense backend, sense dades personals → sense implicacions GDPR.

## 10. i18n

- **MVP: només castellà.** Tot el text del joc en `es`.
- Strings centralitzats (no hardcodejats dispersos) per facilitar CA/VA/EN a fase 2, alineat amb l'arquitectura i18n del web.

## 11. Estètica

- **Variant C** (crema `#FBF6EC`, tinta `#2A1F18`, terracota `#C44E2C`, mostassa `#D4A24C`, teal per a risc baix; Fraunces titulars, Switzer cos, JetBrains Mono xifres).
- **Prohibit**: gradients cridaners i emojis com a icones (l'antic en tenia). Etiquetes de risc **tipogràfiques** acolorides, no punts emoji.
- Mòbil-first; funcional també en portàtil/projector.

## 12. Testing (TDD)

- Tests vitest per a la lògica pura: aplicació de rendiments, recàlcul de cartera, lògica d'esdeveniments (amb seed determinista), estratègia de la IA, puntuació final, transicions de fase, validació del 100%.
- Objectiu: la mecànica completa verificable sense muntar la UI.

## 13. Estructura de fitxers (prevista)

```
src/pages/juegos/stonks/index.astro          # ruta + illa
src/components/games/GameShell.astro          # shell reutilitzable
src/components/games/stonks/StonksGame.tsx    # illa arrel (màquina d'estats UI)
src/components/games/stonks/AllocateScreen.tsx
src/components/games/stonks/ResultScreen.tsx
src/components/games/stonks/FinalScreen.tsx
src/components/games/stonks/EvolucionChart.tsx # SVG propi
src/lib/games/storage.ts                       # localStorage reutilitzable
src/lib/games/stonks/types.ts
src/lib/games/stonks/data.ts                   # rendiments + esdeveniments
src/lib/games/stonks/engine.ts                 # lògica pura
src/lib/games/stonks/ai.ts                     # estratègia DCA
src/lib/games/stonks/*.test.ts                 # tests vitest
src/pages/juegos/index.astro                   # actualitzar: stonks disponible
```

## 14. Riscos i decisions obertes (per al pla)

- **Valors exactes**: capital inicial, renda/ronda, llindars de desbloqueig i imports d'esdeveniments — fixar al pla a partir de l'antic.
- **Dataset**: revisar/arrodonir els rendiments històrics i decidir si s'estén més enllà de 2024.
- **Gràfic "any a any"**: el botó "Ver evolución" pot ser una vista ampliada del mateix SVG (decidir al pla).
- **Re-jugabilitat**: amb dades històriques fixes, la rejugada varia només pels esdeveniments aleatoris i les decisions; valorar si la IA o els esdeveniments aporten prou variació (acceptable per a un joc educatiu).

## 15. Fase 2 (referència, fora d'abast)

Multijugador en temps real (profe amfitrió + alumnes al mòbil, rànquing en directe) reaprofitant la lògica pura de l'`engine`. Requereix decisió de backend compartida amb insider/communist. El disseny solo no ha de bloquejar aquesta extensió (per això la lògica viu separada de la UI i de la persistència).
