# Auditoria de programació i bugs — setembre de 2026

> Part de l'[auditoria de setembre de 2026](../README.md). Revisió de només lectura sobre `main` (`876e002`), feta el 28-09-2026. No s'ha modificat cap fitxer de codi ni de contingut.

## Resum

La base és sòlida. Passen els 3.896 tests i no hi ha cap error de tipus. Cap dels 110.876 enllaços interns està trencat. Els secrets només viuen al servidor, els JWT tenen l'algorisme fixat i Supabase denega per defecte. El consentiment de GA4 és exemplar, i les pàgines estàtiques pesen poc (~1 KB de JS).

Els problemes es concentren en quatre fronts:

1. **Privacitat de l'alumnat**. Jocs Econòmics publica i conserva sense límit noms i centres de menors, mentre la política de privacitat diu que no hi ha backend ni dades personals.
2. **Eines que l'alumnat fa servir per a traure nota o per a decidir coses reals**:
   - Les preguntes numèriques dels tests no deixen escriure decimals ni negatius.
   - L'IRPF de la nòmina i de la declaració ix massa alt.
   - Els tests es poden aprovar contestant sempre «B».
   - Els camps numèrics de les calculadores perden el «−» mentre s'escriu.
3. **Integritat dels jocs de classe**. Es pot suplantar un company a Insider i a Cajút. Cajút revela la resposta correcta mentre la pregunta està oberta. A Jocs Econòmics, deixar córrer el temps compta com contestar A.
4. **La meitat valenciana**. Les pàgines d'activitats interactives mostren el test en castellà. El hub de tests porta al castellà, i els títols i els breadcrumbs es barregen.

**60 troballes: 3 crítiques, 17 altes, 26 mitjanes i 14 baixes.** Les 3 crítiques i una mostra de les altes s'han tornat a verificar contra el codi font (vegeu «[Com s'ha fet](#com-sha-fet)»).

| Annex | Àrea | Crític | Alt | Mitjà | Baix |
| --- | --- | ---: | ---: | ---: | ---: |
| [Servidor, dades, seguretat i pipeline](./servidor-dades-seguretat.md) | API, Supabase, PartyKit, privacitat, `vercel.json`, scripts, CI | 1 | 7 | 9 | 4 |
| [Lògica interactiva](./logica-interactiva.md) | Calculadores, simuladors, jocs, generadors, QuizPlayer | 2 | 8 | 7 | 3 |
| [Framework del lloc](./framework-web.md) | Rutes, esquemes, i18n, SEO, components, accessibilitat de plantilla | 0 | 2 | 10 | 7 |
| **Total** | | **3** | **17** | **26** | **14** |

## Comprovacions automàtiques

Executades el 28-09-2026 sobre `main` (`876e002`), en un contenidor net (`npm ci`, Node 22).

| Comprovació | Resultat |
| --- | --- |
| `npm test` (Vitest) | 162 fitxers, **3.896 tests, tots verds** (25 s) |
| `npx astro check` | **0 errors, 0 avisos**, 31 suggeriments (imports i variables sense ús, quasi tots en fitxers de test) |
| `npm run build` | **OK** en 7 min 18 s. 3.410 pàgines HTML (2.250 indexables). Un sol avís: la col·lecció `juegos` no té cap fitxer (`[glob-loader] No files found matching "juegos/*.{md,mdx}"`) |
| Enllaços interns | **110.876 enllaços** revisats en les 3.410 pàgines: **0 trencats, 0 àncores mortes**. Només dos destins passen per redirecció: `/oposiciones` (volgut) i `/404/` |
| i18n | Les 1.158 pàgines `/ca/` porten `lang="ca"`; el build reescriu 34.043 enllaços interns cap a `/ca/` |
| SEO | Totes les pàgines indexables tenen `canonical` i totes tenen `description` excepte la 404. Ara bé, **1.159 títols passen de 65 caràcters** (mediana 66, p90 93) i **1.267 descriptions passen de 165** |
| Estructura HTML | 10 pàgines indexables amb un nombre d'`<h1>` diferent d'1 (`/edmn-2bach/ebau/` en té 3; `/juegos/cajut/`, `/juegos/cajut/host/`, `/juegos/insider/host/` i `/jocs-economics/leaderboard/` no en tenen cap, i el mateix passa a `/ca/`) |
| Imatges | Totes porten `alt`. Les miniatures decoratives de `/herramientas/`, `/proyectos/` i `/generadores/` el porten buit, i és correcte |
| Pes de pàgina | Pàgines estàtiques amb ~1 KB de JS; una unitat del llibre, ~48-54 KB de JS (3 illes, 2 amb `client:load`) i ~56 KB de CSS |
| Consentiment | Abans d'acceptar el bàner no es fa cap petició a tercers (comprovat amb el trànsit de xarxa en 47 pàgines × 3 mides). Vercel Web Analytics sí que es carrega sense consentiment: vegeu CODE-SRV-02 |
| `npm audit` | 41 avisos (2 crítics, 23 alts), entre els quals `astro@5.18.1` i `@astrojs/vercel@9.0.5`. Exposició pràctica baixa, però cal planificar l'actualització (vegeu el deute tècnic a l'[annex de servidor](./servidor-dades-seguretat.md)) |
| Contingut: paritat ES/CA | Totes les peces de les assignatures tenen la seua bessona `.ca`, i les 1.093 preguntes de test tenen **les mateixes claus de resposta** en ES i CA. Les 180 preguntes de Jocs Econòmics només existeixen en valencià (és volgut) |
| Contingut: metadades | Les 98 unitats tenen el frontmatter obligatori complet i el bloc ```` ```deck ````. A 25 unitats (CJD i una part d'EEAE) els falta `publicado_en`/`actualizado_en`, i per això no tenen `<lastmod>` al sitemap |

## Per on començar

L'ordre combina gravetat, abast (quanta gent ho pateix) i cost d'arreglar-ho.

1. **Privacitat**: [CODE-SRV-01](./servidor-dades-seguretat.md), CODE-SRV-02 i CODE-SRV-14.
   - Reescriure `/legal/privacidad/` (responsable, finalitat, encarregats, conservació i drets).
   - Demanar un àlies en lloc del nom.
   - Programar l'esborrat de `scores`, `institutes` i `bg_*`.
   - Decidir si Vercel Web Analytics va darrere del consentiment o es declara a la política.
   - Traure el nom de la URL d'Insider.

   És l'únic punt amb exposició legal, i afecta menors.
2. **Preguntes numèriques** (CODE-INT-01). Les respostes decimals i negatives no es poden escriure. Afecta 30 preguntes de test i 58 ítems de repte. L'arreglada es limita a `QuizPlayer.tsx` i `RetoPlayer.tsx`.
3. **IRPF** (CODE-INT-02, amb INT-08, INT-11 i INT-12):
   - Restar els 2.000 € d'altres despeses i posar el segon tram de la reducció.
   - Corregir l'etiqueta «escala estatal».
   - Revisar els presets i la base màxima.
   - Afegir tests amb valors de referència, que ara no n'hi ha.
4. **Tests que es poden aprovar sense llegir**: CODE-INT-03, CODE-SRV-05 i el [biaix de claus de l'auditoria didàctica](../1-didactica/README.md) (troballa transversal T1).
   - Barrejar les opcions al QuizPlayer.
   - A Jocs Econòmics, marcar el temps esgotat com a no resposta.
   - Reequilibrar el contingut.
   - Afegir un test que ho vigile.
5. **La meitat valenciana**: CODE-WEB-01, CODE-WEB-02, CODE-WEB-05, CODE-WEB-06 i CODE-WEB-10. El test en castellà a `/ca/…/actividades-dinamicas/` afecta 90 pàgines, i el hub de tests porta al castellà des de 99 pàgines.
6. **Camps numèrics** (CODE-INT-04). Un component `NumberField` compartit evitaria que un flux de VAN/TIR «-5000» es convertisca en +5.000 sense avís.
7. **Plantilles desades** (CODE-INT-05). Carregar-les després del muntatge evita que el docent crega que ha perdut la feina i la sobreescriga.
8. **Jocs de classe**: CODE-SRV-06 (rate limit per IP que bloqueja classes darrere d'una NAT; l'arreglada és d'una línia), CODE-SRV-03 i CODE-SRV-04 (identitat emesa pel servidor; no revelar puntuacions durant la pregunta).
9. **Robustesa de l'esquema** (CODE-WEB-09 i CODE-WEB-08). Fer `estado` obligatori, recuperar les 2 activitats de GPE desaparegudes i comprovar la paritat ES→CA.
10. **Business Game**: CODE-SRV-07, CODE-SRV-08, CODE-SRV-09 i CODE-INT-07. Cal fer-ho abans que cap docent monte una lliga de curs complet.

## Totes les troballes

«Veg. també» assenyala troballes que comparteixen causa o que es poden arreglar juntes, també entre auditories.

### Crítiques

| ID | Àrea | Troballa | Veg. també |
| --- | --- | --- | --- |
| CODE-SRV-01 | privacitat | Noms i centres d'alumnat menor es publiquen i es guarden per sempre; la política diu que no hi ha backend ni dades personals | SRV-02, SRV-14 |
| CODE-INT-01 | correcció | Les preguntes numèriques dels tests i dels reptes no admeten decimals ni negatius escrits a mà | INT-04 |
| CODE-INT-02 | correcció | L'IRPF ix massa alt en la nòmina, la declaració i el cost de contractació (falten els 2.000 € i el segon tram de la reducció) | INT-08, INT-11, INT-12 |

### Altes

| ID | Àrea | Troballa | Veg. també |
| --- | --- | --- | --- |
| CODE-SRV-02 | privacitat | Vercel Web Analytics es carrega abans del consentiment i la política no el menciona | SRV-01 |
| CODE-SRV-03 | seguretat | PartyKit es creu l'identitat que envia el client: es pot suplantar un company (Insider, Cajút) | SRV-12 |
| CODE-SRV-04 | seguretat | Cajút mostra qui encerta mentre la pregunta està oberta, i això revela la resposta | |
| CODE-SRV-05 | correcció | Jocs Econòmics: el temps esgotat s'envia com a opció A i el 43 % del banc té `correcta: 0` | INT-03 |
| CODE-SRV-06 | robustesa | 20 partides/hora per IP bloquegen classes senceres darrere de la NAT del centre | |
| CODE-SRV-07 | correcció | Business Game: tokens de 30 dies sense renovació en lligues de curs complet | SRV-09 |
| CODE-SRV-08 | seguretat | Business Game: camps sense mida màxima i crides sense límit | SRV-09 |
| CODE-INT-03 | correcció | Els tests es poden aprovar sense llegir: opcions sense barrejar i correcta quasi sempre la B | SRV-05, didàctica T1 |
| CODE-INT-04 | robustesa | Els camps numèrics perden el «−» i el punt decimal mentre s'escriu (58 llocs, 21 illes) | INT-01 |
| CODE-INT-05 | correcció | Les plantilles desades semblen buides en recarregar i escriure les sobreescriu | |
| CODE-INT-06 | correcció | Cotxe o alternativa: el missatge del quilometratge d'equilibri diu el contrari del model | |
| CODE-INT-07 | correcció | Business Game: preu quasi zero i producció zero guanya la ronda | SRV-08 |
| CODE-INT-08 | correcció | L'escala del 19–47 % s'anomena «estatal», i Forma jurídica diu que «no incluye la mitad autonómica» | INT-02 |
| CODE-INT-09 | accessibilitat | EconRisk no es pot jugar amb teclat ni amb lector de pantalla | |
| CODE-INT-10 | accessibilitat | Simulador OA-DA: sliders sense nom accessible | INT-17 |
| CODE-WEB-01 | i18n | `/ca/…/actividades-dinamicas/…` mostra el test i els recursos en castellà (90 pàgines) | WEB-10 |
| CODE-WEB-02 | correcció/i18n | Hub «Tests»: la redirecció d'Astro xoca amb la pàgina real i, a `/ca/`, porta al castellà | SRV-19 |

### Mitjanes

| ID | Àrea | Troballa | Veg. també |
| --- | --- | --- | --- |
| CODE-SRV-09 | robustesa | `cerrar` pot deixar una lliga bloquejada per sempre en `resultados` | SRV-07 |
| CODE-SRV-10 | seguretat | Jocs: un `clientElapsedMs` negatiu registra 0 ms i guanya els desempats | |
| CODE-SRV-11 | seguretat | Rànquing sense moderació: es pot reescriure el nom visible d'un altre institut | SRV-01 |
| CODE-SRV-12 | correcció | Cajút: expulsar al lobby no funciona (el client es reconnecta) | SRV-03 |
| CODE-SRV-13 | robustesa | Insider no valida missatges: es pot congelar la partida i registrar jugadors sense límit | |
| CODE-SRV-14 | privacitat | Insider posa el nom de l'alumne a la URL, i arriba a GA4 si s'ha acceptat l'analítica | SRV-01 |
| CODE-SRV-15 | rendiment | Business Game consulta cada 4 s per sempre, també amb la pestanya amagada | |
| CODE-SRV-16 | seguretat | `unpkg.com/pagedjs` sense versió fixada ni SRI en pàgines públiques | |
| CODE-SRV-17 | build/CI | El manifest de Cajút i el banc del servidor es despleguen per camins diferents | SRV-21 |
| CODE-INT-11 | correcció | Declaració de la renda: el preset «retuvo de más» ix «A PAGAR» | INT-02 |
| CODE-INT-12 | correcció | La nòmina no aplica la base màxima de cotització ni ho avisa | INT-02 |
| CODE-INT-13 | correcció | Equilibri de mercat: quantitats negatives amb preus intervinguts | |
| CODE-INT-14 | accessibilitat | Ràtios: veredicte només per color i llindar diferent del que es mostra | |
| CODE-INT-15 | correcció | VAN/TIR: «No converge» quan no hi ha TIR, n'hi ha dues o passa del 500 % | |
| CODE-INT-16 | robustesa | Els jocs no arrenquen si el navegador bloqueja l'emmagatzematge | |
| CODE-INT-17 | accessibilitat | Cap regió `aria-live`: ni resultats de calculadora ni correccions de test s'anuncien | INT-10 |
| CODE-WEB-03 | accessibilitat | El rètol dels CTA de descàrrega ix en tinta sobre terracota (3,42:1) en 798 pàgines | WEB-04 |
| CODE-WEB-04 | accessibilitat | Tokens d'accent com a color de text per davall d'AA (terracota 4,35:1, mostassa 2,31:1) | VIS-NAV-06, VIS-NAV-13 |
| CODE-WEB-05 | SEO/i18n | El `<title>` de 93 unitats en valencià porta un sufix castellà | |
| CODE-WEB-06 | SEO | `BreadcrumbList` amb URLs castellanes a 742 pàgines `/ca/` | VIS-NAV-22 |
| CODE-WEB-07 | SEO | 10 pàgines que canonicalitzen a una altra URL declaren `hreflang` | |
| CODE-WEB-08 | i18n/SEO | Totes les plantilles passen `contentLang={locale}`; un fallback castellà es declararia valencià | WEB-09 |
| CODE-WEB-09 | robustesa | `estado` té `borrador` per defecte: dues activitats de GPE han desaparegut en silenci | WEB-08 |
| CODE-WEB-10 | i18n | Literals castellans en components compartits i illes sense `locale` a `/ca/` | WEB-01 |
| CODE-WEB-11 | correcció | Visor de diapositives: després d'un scroll, «següent» torna a la diapositiva 2 | |
| CODE-WEB-12 | accessibilitat | Menú amb `role="menu"` sense el model de teclat corresponent | VIS-NAV-16 |

### Baixes

| ID | Àrea | Troballa | Veg. també |
| --- | --- | --- | --- |
| CODE-SRV-18 | correcció | El rànquing de centres diu «participantes» però en compta com a màxim 5 | |
| CODE-SRV-19 | SEO | Les redireccions de `/[asignatura]/tests` només funcionen sense barra final | WEB-02 |
| CODE-SRV-20 | build/CI | El filtre de CI de les diapositives ignora `global.css`, la ruta del deck i els diagrames | |
| CODE-SRV-21 | correcció | Cajút no fa servir mai les traduccions `.ca.md`: `/ca/juegos/cajut/` juga en castellà | SRV-17 |
| CODE-INT-18 | correcció | Calificaciones: «Los pesos suman 100.00000000000001 %» | |
| CODE-INT-19 | correcció | Econopoly: l'últim postor puja contra si mateix | |
| CODE-INT-20 | correcció | Stonks: es pot comprar Bitcoin el 2008–2011 i els diners desapareixen del resum | |
| CODE-WEB-13 | accessibilitat | `<main>` niat (30 pàgines) i 3 `<h1>` a la pàgina EBAU | VIS-NAV-17 |
| CODE-WEB-14 | correcció | Numeració editorial incoherent a la pàgina d'unitat | |
| CODE-WEB-15 | correcció | Diagrama del multiplicador fiscal: subtítol tallat i etiqueta invisible | |
| CODE-WEB-16 | correcció | La nota curricular del hub genera text incorrecte per a IPE («en el Ley», «empleabilidad i») | VIS-NAV-02 |
| CODE-WEB-17 | i18n | Els KPI dels arbres de decisió mostren les claus JSON en cru | |
| CODE-WEB-18 | SEO/i18n | `/ca/404/` indexable i seccions buides de CJD al sitemap | VIS-NAV-10 |
| CODE-WEB-19 | mantenibilitat | Encara queda el patró vetat de ratlla d'accent en un sol costat | VIS-NAV-07 |

## Deute tècnic destacat

No són bugs, però condicionen el manteniment. El detall és a cada annex.

- **Dependències**: `npm audit` dona 41 avisos (2 crítics i 23 alts). `astro@5.18.1` i `@astrojs/vercel@9.0.5` en tenen de coneguts. `puppeteer` i `yaml` s'importen sense estar declarats (arriben de rebot per `pagedjs-cli`).
- **Observabilitat**: CLAUDE.md preveu Sentry, però no està connectat. Les rutes `/api/**` descarten quasi tots els errors de Supabase sense registrar-los.
- **Capçaleres de seguretat**: no hi ha CSP ni `Permissions-Policy`. `X-Frame-Options: SAMEORIGIN` impedeix incrustar recursos a Aules, Moodle o Google Sites: cal decidir si es vol permetre.
- **Tests que no protegeixen**: els de les calculadores fiscals comproven direccions («menor que…»), no valors de referència, i per això no han detectat CODE-INT-02. `stonks/engine.test.ts` consolida el comportament erroni de CODE-INT-20.
- **Hidratació**: les 56 illes de calculadores i generadors usen `client:load`. En les que queden lluny de l'inici de la pàgina convé `client:visible`.
- **Incident del 5-09-2026** (`docs/incident-2026-09-05-vercel-content-cache.md`): no té causa arrel ni cap guarda automàtica. Es proposa un hook `astro:build:done` que falle si una entrada publicada no té la seua pàgina.
- **Builds que haurien de fallar**:
  - Si falta `PUBLIC_PARTYKIT_HOST`, les pàgines apunten a `127.0.0.1:1999`.
  - `build-og-images.mjs` manté la llista d'assignatures a mà.
  - Els scripts de PDF no fallen quan falta una imatge o una font.

## Com s'ha fet

- **Tres revisions paral·leles de codi**, cadascuna d'una àrea: servidor i dades, lògica interactiva, i framework. Totes han seguit la mateixa norma: cada troballa crítica o alta necessita un escenari de fallada concret, traçat de punta a punta. Moltes s'han reproduït executant els mòduls reals (Vitest amb una configuració fora del repositori) o el component en Chromium headless.
- **Comprovacions automàtiques pròpies** sobre tot el build: enllaços, metadades, pes, contingut i consentiment. Hi ha, a més, captures i axe-core en 47 pàgines × 3 mides (vegeu l'[auditoria visual](../3-visual-ux/README.md)).
- **Segona verificació** directa contra el codi font de les tres troballes crítiques (CODE-SRV-01, CODE-INT-01 i CODE-INT-02) i d'una mostra de les altes: CODE-SRV-06 (`src/middleware.ts:12`), CODE-INT-06 (`src/lib/calc/coche.ts:190`), CODE-WEB-01 (HTML de `/ca/edmn-2bach/actividades-dinamicas/07-funcion-productiva/` amb el test en castellà), CODE-WEB-02 (`/ca/edmn-2bach/tests/` és un `meta refresh` cap al castellà) i CODE-WEB-09 (`src/content.config.ts:39`, `default('borrador')`).
- **Límits**:
  - El contenidor no té accés al web de producció, al BOE ni a l'AEAT. Els paràmetres fiscals de 2026 s'han contrastat amb el coneixement dels auditors, i cada troballa indica la confiança.
  - Tampoc s'han pogut provar Supabase ni PartyKit reals: les proves s'han fet contra el codi i els mòduls purs.
