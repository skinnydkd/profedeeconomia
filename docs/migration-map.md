# Mapa de migració — webpde → profedeeconomia.es

> Document operatiu que detalla **cada peça del webpde antic i el seu destí concret** a la nova estructura per assignatures. Aquest document és la referència vinculant per a totes les sessions de migració de Claude Code.

## Filosofia general

**Anem a refer profedeeconomia.es des de zero amb Astro 5.** El webpde antic es deprecia gradualment. La migració del contingut educatiu és selectiva i orientada a integrar-se a l'estructura nova **per assignatures**.

Tres principis guia:

1. **Migrem contingut, no codi**. El JSX antic dins de Babel CDN no es reaprofita. Es reescriu en MDX nou amb components Astro.
2. **Distribuir per assignatura**. Cada peça antiga troba la seua assignatura natural. Si pertany a múltiples assignatures, es divideix.
3. **Refer els jocs des de zero**. Els 5 jocs (stonks, insider, communist, econopoly, econrisk) tenen bugs i s'han de refer amb stack nou. La migració extreu idees, no implementació.

## Llegenda d'estats

- 🟢 **Migrar directe**: el contingut va a la seua nova ubicació amb adaptació mínima.
- 🟡 **Distribuir**: el contingut es trenca i es reparteix entre múltiples assignatures.
- 🔵 **Refer**: el codi es reescriu sencer; les idees es preserven.
- ⚫ **Llegat**: queda al webpde antic com a referència històrica però no s'integra al nou.
- 🔴 **No migra**: ja viu en un altre projecte (oposicioneseconomia.es) o no és aplicable.

## Mapa peça per peça

### Index i navegació

| Origen | Estat | Destí nou | Notes |
|---|---|---|---|
| `index.html` | 🔵 Refer | `/` (home) | La home antiga és en pestanyes (General/Alumnat/Professorat/Opositor). La nova és per assignatures. Estructura visual completament nova. |
| `404.html` | 🔵 Refer | `/404.astro` (Astro 404) | Estètica nova. |
| `sitemap.xml` | 🟢 Auto-generat | Astro genera automàticament | No cal preocupar-se. |
| `robots.txt` | 🟢 Migrar | `public/robots.txt` | Adaptat per al nou domini. |

### 4 cursos LOMLOE → 4 llibres

| Origen | Estat | Destí nou | Notes |
|---|---|---|---|
| `edmn-2bach.html` | 🟡 Distribuir | `/edmn-2bach/` (esquelet del Llibre 1) | Aquest fitxer és el punt de partida del **Llibre 1** (PRIMER a fer). El contingut serveix com a base; s'amplia amb material d'`empresa.html` i secció emprenedoria de `finances.html`. |
| `economia-1bach.html` | 🟡 Distribuir | `/eco-1bach/` (esquelet del Llibre 2) | Punt de partida del Llibre 2. S'amplia amb tot `economia.html`, `ferramentes.html`, `recerca.html` i secció inversió de `finances.html`. |
| `economia-4eso.html` | 🟡 Distribuir | `/eco-4eso/` (esquelet del Llibre 3) | Punt de partida del Llibre 3. S'amplia amb continguts bàsics d'`economia.html` i parts de `vidapractica.html`. |
| `fopp-4eso.html` | 🟡 Distribuir | `/fopp-4eso/` (esquelet del Llibre 4) | Punt de partida del Llibre 4. S'amplia amb gran part de `vidapractica.html` i continguts laborals de `finances.html`. |

### 8 índexs temàtics — distribució a les assignatures

#### `economia.html` (microeconomia + macroeconomia, 18 mòduls)

| Mòdul | Destí | Notes |
|---|---|---|
| Fonaments (escassetat, agents, factors, mètode científic) | Eco 4ESO + Eco 1BACH | Dividir per profunditat |
| FPP i Models | Eco 1BACH | |
| El Consumidor (utilitat, comportament) | Eco 1BACH | |
| Oferta i Demanda + simulador | Eco 4ESO + Eco 1BACH | Simulador a recursos d'Eco 1BACH |
| Costos empresarials | Eco 1BACH | |
| Estructures de Mercat | Eco 1BACH | |
| Fallades de Mercat | Eco 1BACH | |
| PIB i mesura econòmica | Eco 1BACH | |
| Cicles Econòmics | Eco 1BACH | |
| Mercat de Treball | Eco 1BACH (avançat) + FOPP 4ESO (laboral bàsic) | |
| Inflació | Eco 1BACH | |
| Política Fiscal | Eco 1BACH | |
| Model IS-LM + simulador | Eco 1BACH | Simulador a recursos |
| Política Monetària | Eco 1BACH | |
| Comerç Internacional | Eco 1BACH | |
| Teoria de Jocs (Nash) + simulador | Eco 1BACH | Simulador a recursos |
| Història Econòmica | Eco 1BACH | |
| Mètode Científic | Eco 1BACH (junt amb `recerca.html`) | |

#### `empresa.html` (gestió empresarial, 20+ mòduls)

| Mòdul | Destí | Notes |
|---|---|---|
| Finances Empresarials (balanç, compte resultats) | EDMN 2BACH | |
| Anàlisi Financera (ràtios) | EDMN 2BACH | |
| Costos (punt de mort) + calculadora | EDMN 2BACH | Calculadora a recursos |
| Inversió (VAN, TIR) + calculadora | EDMN 2BACH | Calculadora a recursos |
| Comptabilitat bàsica | EDMN 2BACH | |
| Fiscalitat (impost de societats) | EDMN 2BACH | |
| Producció (lean, sistemes) | EDMN 2BACH | |
| RRHH + calculadora nòmina | EDMN 2BACH (gestió RRHH) + FOPP 4ESO (nòmina personal) | Dividir |
| Màrqueting | EDMN 2BACH | |
| Formes Jurídiques | EDMN 2BACH | |
| Finançament empresarial | EDMN 2BACH | |
| Emprenedoria i Lean Startup | EDMN 2BACH (centre del llibre) | |
| DAFO interactiu | EDMN 2BACH (a recursos) | |
| Business Model Canvas + generador | EDMN 2BACH (a recursos, peça destacada) | |
| 5 Forces de Porter | EDMN 2BACH | |
| Estratègia empresarial | EDMN 2BACH | |

#### `finances.html` (finances personals i inversió, 23+ mòduls)

| Mòdul | Destí | Notes |
|---|---|---|
| Tipus d'actius (accions, ETFs, fons, bons) | Eco 1BACH (introducció a inversió) | |
| Or, Immobiliari, Cripto | Eco 1BACH | |
| Pressupost personal | FOPP 4ESO | |
| Fons d'Emergència | FOPP 4ESO | |
| Gestió de Deutes | FOPP 4ESO + Eco 4ESO (bàsic) | |
| Perfil de Risc + test | Eco 1BACH (a recursos) | |
| Horitzó Temporal, Psicologia inversora | Eco 1BACH | |
| Rebalanceig de cartera | Eco 1BACH | |
| Bitcoin Deep Dive (Satoshi, tècnic, riscos) | Eco 1BACH (apartat opcional) | |
| Simuladors (interès compost, portfolio, test inversor, Bitcoin) | Eco 1BACH (a recursos) | |
| Calculadora impostos | FOPP 4ESO | |

#### `vidapractica.html` (12 mòduls)

| Mòdul | Destí | Notes |
|---|---|---|
| La Nòmina + calculadora | FOPP 4ESO (centre) + Eco 4ESO (bàsics) | |
| La Hipoteca + simulador | FOPP 4ESO + Eco 1BACH (avançat) | |
| Estalvi | FOPP 4ESO + Eco 4ESO | |
| Préstecs personals + calculadora | FOPP 4ESO | |
| Pressupost Personal + planner | FOPP 4ESO | |
| Renda (ingressos/despeses) | FOPP 4ESO + Eco 4ESO | |
| IRPF + simulador declaració | FOPP 4ESO | |
| Factures domèstiques | FOPP 4ESO | |
| Contracte de Lloguer | FOPP 4ESO | |
| Contractes Laborals | FOPP 4ESO | |
| Currículum i cerca de feina | FOPP 4ESO (centre) | |
| Glossari financer | Transversal (footer/recursos genèrics) | |

#### `ferramentes.html` (eines de decisió, 30 mòduls)

| Mòdul | Destí | Notes |
|---|---|---|
| Probabilitats, Valor Esperat + calculadora | Eco 1BACH (teoria de la decisió) | |
| Cost d'Oportunitat | Eco 1BACH | |
| Sunk Costs, Anàlisi Marginal | Eco 1BACH | |
| Biaixos cognitius (tots els 8) | Eco 1BACH (apartat sencer) | |
| Frameworks decisió (Pros/Contres, Eisenhower, Pre-Mortem, BATNA, etc.) | Eco 1BACH (a recursos: tots els interactius) | |
| Bayes (actualització) | Eco 1BACH (avançat) | |
| Detector de biaixos quiz | Eco 1BACH (a tests) | |

#### `recerca.html` (papers i mètode científic)

| Mòdul | Destí | Notes |
|---|---|---|
| Papers Acadèmics | Eco 1BACH (apartat de recerca) | |
| Mètode Científic en Economia | Eco 1BACH (junt amb `economia.html`) | |
| Articles i Experiments Curiosos | Eco 1BACH | |
| Llibres Recomanats per nivell | Distribuir per assignatura | Cada llibre porta la seua bibliografia |
| Recursos externs | Eco 1BACH | |

#### `playground.html` (10 jocs 2-jugadors)

| Joc | Destí | Estat |
|---|---|---|
| Compartir o Robar (Teoria de Jocs) | `/juegos/playground/compartir-robar/` | 🔵 Refer |
| Ous i Cistells (Diversificació) | `/juegos/playground/ous-cistells/` | 🔵 Refer |
| Arbre de Monedes (Interès Compost) | `/juegos/playground/arbre-monedes/` | 🔵 Refer |
| La Subhasta (Valoració) | `/juegos/playground/subhasta/` | 🔵 Refer |
| El Mercat (Oferta i Demanda) | `/juegos/playground/mercat/` | 🔵 Refer |
| La Inflació (Pèrdua de Valor) | `/juegos/playground/inflacio/` | 🔵 Refer |
| Or i Bitcoin (Escassetat) | `/juegos/playground/or-bitcoin/` | 🔵 Refer |
| El Banquer (Estalvi i Deute) | `/juegos/playground/banquer/` | 🔵 Refer |
| Risc i Recompensa (Probabilitats) | `/juegos/playground/risc-recompensa/` | 🔵 Refer |
| El Trader (Borsa) | `/juegos/playground/trader/` | 🔵 Refer |

Tots els jocs es refan amb mode mòbil + projector. Backend: PartyKit/Cloudflare Durable Objects (decisió a revisar al moment d'execució). **Aquesta migració és Fase 5 del calendari (2027).**

#### `concurs.html` (quiz competitiu)

| Element | Destí | Estat |
|---|---|---|
| Sistema de quiz | `/juegos/concurso/` | 🔵 Refer |
| Banc de preguntes existent | Migra com a base | 🟡 Ampliar fins 200+ |
| Multidiomatic VAL/ES/EN | Substituit per i18n nadiu | 🟢 Migrar mecànica |
| Ranking TOP 10 LocalStorage | Reemplaçat per Supabase (premium) o LocalStorage simple | 🔵 Decidir al moment |

#### Jocs específics

| Origen | Destí | Estat | Quan |
|---|---|---|---|
| `stonks.html` (simulador borsa) | `/juegos/stonks/` | 🔵 Refer | **Primer joc**, gener 2027 |
| `insider.html` (Among Us econòmic) | `/juegos/insider/` | 🔵 Refer (multijugador real) | Febrer-Abril 2027 |
| `communist.html` (Party & Co sistemes) | `/juegos/communist-party/` | 🔵 Refer (multijugador real) | Febrer-Abril 2027 |
| `econopoly.html` (Monopoly economia) | `/juegos/econopoly/` | 🔵 Refer | Maig+ 2027 |
| `econrisk.html` (Risk economia) | `/juegos/econrisk/` | 🔵 Refer | Maig+ 2027 |

### Eines docents

| Origen | Destí | Estat |
|---|---|---|
| `professorat.html` — Generador SAs LOMLOE | `/herramientas/sa-creator/` | 🔵 Refer + millorar |
| `professorat.html` — Generador de proves | `/herramientas/test-creator/` | 🔵 Refer + millorar |

**Fase d'execució**: 2027 (post-llibres i post-stonks).

### Material d'emprenedoria

| Origen | Destí | Estat |
|---|---|---|
| Continguts d'emprenedoria de `finances.html` | `/emprendimiento/` (junt a EDMN 2BACH) | 🟡 Distribuir |
| BMC, Lean Startup d'`empresa.html` | `/emprendimiento/` (junt a EDMN 2BACH) | 🟡 Distribuir |

Aquesta secció és **transversal** i pot enllaçar a les unitats correspondents d'EDMN 2BACH. **Decisió pendent**: si pesa contingut substancial únic o si és bàsicament un agregador d'altres seccions.

### Oposicions

| Origen | Destí | Estat |
|---|---|---|
| `oposicions.html` | Redirect 301 directe a oposicioneseconomia.es | 🔴 No migra |
| `oposicions-bloc-a` fins `bloc-h.html` | Ja viuen a oposicioneseconomia.es | 🔴 No migra |
| `oposicions-estudiar.html` | Ja viu a oposicioneseconomia.es | 🔴 No migra |
| `oposicions-practica.html` | Ja viu a oposicioneseconomia.es | 🔴 No migra |

**A `/oposiciones` del nou web**: NO hi ha pàgina d'aterratge intermèdia. Quan algú clica al link "Oposiciones" del menú de navegació, es redirecciona directament al domini extern oposicioneseconomia.es. Açò es configura via `vercel.json` amb un redirect 301.

### Codi compartit (no migra)

| Origen | Estat | Notes |
|---|---|---|
| `pde-shared.js` | ⚫ Llegat | Sistema de translations antic, reemplaçat per i18n nadiu d'Astro |
| `pde-components.js` | ⚫ Llegat | Components antics React, reemplaçats per Astro/Preact components nous |
| `pde-game-engine.js` | ⚫ Llegat | Motor de jocs antic, reemplaçat al refer cada joc |

### Branques pendents (no migren com a codi)

| Branca | Decisió |
|---|---|
| `feat/oposicions-bloc-d` fins `h` | ⚫ Abandonada (contingut ja viu a oposicioneseconomia.es) |
| `feat/oposicions-micro-translation-graphics` | ⚫ Abandonada |
| `feat/board-games` | 🔵 Revisar al refer jocs (idees, no codi) |
| `feat/insider-trading` | 🔵 Revisar al refer insider (idees, no codi) |
| `feat/playground-games-overhaul` | 🔵 Revisar al refer playground (idees, no codi) |
| `fix/stonks-rendering-translations` | 🔵 Revisar al refer stonks (per saber quins bugs tenia) |
| `feat/seo-improvements` | ⚫ Abandonada (Astro fa SEO nadiu millor) |
| `feat/shared-infrastructure` | ⚫ Abandonada |
| `feat/translation-system` | ⚫ Abandonada (i18n nadiu d'Astro) |

## Calendari de migració (resum)

| Quan | Fase | Què migra |
|---|---|---|
| **Maig 2026** | Sessió mockups + setup | Cap (definim primer la direcció estètica) |
| **Juny 2026** | Llibre 1 EDMN 2BACH | `empresa.html` + parts d'emprenedoria de `finances.html` |
| **Juliol-Agost 2026** | Polit Llibre 1 + inici Llibre 2 | Inici `economia.html`, `ferramentes.html`, `recerca.html` |
| **Setembre 2026** | Llançament Llibre 2 Eco 1BACH | Resta d'`economia.html`, `ferramentes.html`, `recerca.html`, parts de `finances.html` |
| **Octubre-Desembre 2026** | Llibre 3 Eco 4ESO + Patreon | Bàsics d'`economia.html` + parts de `vidapractica.html` |
| **Gener-Febrer 2027** | Llibre 4 FOPP 4ESO + stonks | Resta de `vidapractica.html` + refet stonks.html |
| **Febrer-Abril 2027** | Insider + Communist refets | insider.html + communist.html |
| **Maig+ 2027** | Resta de jocs + eines | playground.html, concurs.html, econopoly.html, econrisk.html, professorat.html |
| **Setembre 2027** | webpde antic deprecat | — |

## Estratègia de redirects

Quan migrem cada peça, posem redirect 301 a la nova URL via `vercel.json`:

```json
{
  "redirects": [
    { "source": "/economia.html", "destination": "/eco-1bach/", "permanent": true },
    { "source": "/empresa.html", "destination": "/edmn-2bach/", "permanent": true },
    { "source": "/finances.html", "destination": "/", "permanent": true },
    { "source": "/vidapractica.html", "destination": "/fopp-4eso/", "permanent": true },
    { "source": "/edmn-2bach.html", "destination": "/edmn-2bach/", "permanent": true },
    { "source": "/economia-1bach.html", "destination": "/eco-1bach/", "permanent": true },
    { "source": "/economia-4eso.html", "destination": "/eco-4eso/", "permanent": true },
    { "source": "/fopp-4eso.html", "destination": "/fopp-4eso/", "permanent": true },
    { "source": "/oposicions.html", "destination": "https://oposicioneseconomia.es/", "permanent": true },
    { "source": "/oposiciones", "destination": "https://oposicioneseconomia.es/", "permanent": true },
    { "source": "/oposiciones/", "destination": "https://oposicioneseconomia.es/", "permanent": true },
    { "source": "/professorat.html", "destination": "/herramientas/", "permanent": true },
    { "source": "/playground.html", "destination": "/juegos/playground/", "permanent": true },
    { "source": "/concurs.html", "destination": "/juegos/concurso/", "permanent": true },
    { "source": "/stonks.html", "destination": "/juegos/stonks/", "permanent": true },
    { "source": "/insider.html", "destination": "/juegos/insider/", "permanent": true },
    { "source": "/communist.html", "destination": "/juegos/communist-party/", "permanent": true },
    { "source": "/econopoly.html", "destination": "/juegos/econopoly/", "permanent": true },
    { "source": "/econrisk.html", "destination": "/juegos/econrisk/", "permanent": true },
    { "source": "/recerca.html", "destination": "/eco-1bach/", "permanent": true },
    { "source": "/ferramentes.html", "destination": "/eco-1bach/", "permanent": true }
  ]
}
```

**Quan es fa el switch**: quan el Llibre 1 (EDMN 2BACH) està complet i la home funcional. La resta es migra gradualment, amb redirects activats progressivament.

## Què passa amb el contingut multidiomatic original

El webpde antic té contingut traduït val/es/en. La nova plataforma:
- **Castellà**: contingut publicat al MVP
- **Català/valencià**: estructura i18n preparada des del dia 1, contingut s'omple progressivament a fase 2 (mes 4-6)
- **Anglès**: NO al pla. Si en algun moment es vol, es decideix llavors.

La traducció de contingut existent es fa **a l'hora de migrar cada peça**: si l'original era només en valencià, es tradueix al castellà i es marca el valencià com a contingut futur. Si l'original ja tenia versió castellana, es fa servir directament.

## Versions

- **v1.0** — abril 2026 — primera versió del mapa de migració amb estructura per assignatures.
