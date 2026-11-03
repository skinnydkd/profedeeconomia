# Auditoria de codi — Framework del lloc (rutes, contingut, i18n, SEO, components)

> Annex de l'[auditoria de programació i bugs](./README.md) · setembre de 2026 · revisió de només lectura sobre `main` (`876e002`).

**Resum.** El nucli és sòlid: totes les rutes de detall i els índexs filtren `estado === 'publicado' && lang === 'es'`, els 1.036 germans valencians tenen un id coherent, el sitemap construït està net i l'HTML servit a `/ca/` no té cap enllaç intern que torne al castellà. Els problemes es concentren en la meitat valenciana. Hi ha dos tipus de pàgina que porten l'usuari, o el contingut, al castellà (Alt). A més, els senyals SEO de `/ca/` són incoherents (títols, breadcrumbs, hreflang), i el mecanisme de fallback `contentLang` existeix però cap plantilla de contingut el fa servir. En accessibilitat, el CTA de descàrrega de 798 pàgines té el rètol en tinta sobre terracota (3,42:1) per culpa d'una regla global. L'esquema accepta `estado` absent, i per això 2 activitats de GPE han desaparegut en silenci. Recompte: **0 Crítiques · 2 Altes · 10 Mitjanes · 7 Baixes.**

Mètode: lectura del codi de cada ruta i dels seus consumidors, i comprovació sobre el build de producció ja generat (`dist/client`, `.vercel/output/config.json`). He fet servir scripts de només lectura: crawler de `<head>`, validació del sitemap, JSON-LD i enllaços, i un escaneig dels 94 diagrames. També he passat axe-core 4.10 i proves de teclat amb Chromium headless sobre l'HTML construït. Tot s'ha fet fora del repositori, sense escriure-hi res.

**Punts forts**
- Filtres de publicació coherents: totes les `getStaticPaths` i tots els llistats (també les rutes `imprimir`) filtren per `estado` i per `lang: 'es'`. Els germans CA no generen rutes pròpies. Les assignatures `proximamente` queden fora de les rutes filles.
- Ids CA robustos: els 1.036 fitxers `.ca.md(x)` tenen `slug:` igual a `${esId}.ca` (verificat amb el mateix `github-slugger` del loader). Hi ha tests de paritat CA→ES per col·lecció.
- Sitemap: 2.197 URL, cap que no existisca, cap `noindex` i cap no canònica. Les 1.096 URL `/ca/` porten `hreflang` recíproc. `isIndexableHtml` llig el `<head>` ja escrit i, si falla, deixa la pàgina dins.
- `localize-links.mjs`: cap `<a href>` intern en castellà dins de `dist/client/ca/**` (s'exclouen el selector d'idioma, els fitxers i `/api/`). El hook s'executa abans que l'adaptador copie a `.vercel/output/static` (fitxers idèntics).
- JSON-LD: 2.170 blocs, tots JSON vàlid, amb el caràcter `<` escapat. `quizLd` només marca preguntes que es poden respondre a la pàgina. `canonicalPath` consolida correctament les 46 fitxes duplicades d'`/herramientas/` (23 eines × 2 idiomes): totes apunten a una pàgina que existeix, és canònica i no emet `hreflang`.
- `vercel.json`: les 143 redireccions resolen totes i totes tenen germà `/ca/`.
- Accessibilitat de base: skip link, anell `:focus-visible` global i `prefers-reduced-motion`. Les 600 `<Figure>` tenen `alt` i peu. Els 94 diagrames tenen `role="img"`, nom accessible, `viewBox` i textos localitzats. `ConsentBanner` té els dos botons amb el mateix pes.
- Rendiment: un sol mòdul JS a les pàgines estàtiques, `UnitNotes` amb `client:idle`, fonts auto-allotjades amb `preload` i `font-display: swap`, i GA4 que no fa cap petició fins que hi ha consentiment. Les imatges del llibre passen per `astro:assets` (webp, 4 amplades).

## Troballes

#### CODE-WEB-01 · Alt · i18n — «Activitats interactives» per unitat serveix el test i els recursos en castellà a `/ca/`
- **On**: `src/pages/[asignatura]/actividades-dinamicas/[slug].astro:43`, `:45`, `:96`, `:125`, `:140`
- **Problema**: la pàgina tria `test` i `recursos` amb `lang === 'es'` i mai els passa per `pickLocalizedEntry`, a diferència de la unitat i els simuladors, que sí que hi passen. A més, `<QuizPlayer>` no rep `locale`, de manera que, a banda de les preguntes, el xrome del test («← Anterior», «Confirmar respuesta») també ix en castellà. El missatge d'estat buit també és un literal castellà.
- **Escenari de fallada**: `/ca/fopp-4eso/actividades-dinamicas/05-sistema-educativo-itinerarios/` és `lang="ca"`, canonical a si mateixa i és al sitemap amb `hreflang="ca"`. Mostra «Test d'autoavaluació · 12 preguntes» i tot seguit «¿Cuántas modalidades de Bachillerato establece la LOMLOE…?». La llista de recursos diu «Buscador de itinerarios post-ESO — Responde 6 preguntas…». Els fitxers `.ca.md` traduïts existeixen. Afecta 90 de les 98 pàgines `/ca/` (test en castellà) i 89 (llista de recursos en castellà).
- **Evidència**:
  ```astro
  const test = testsAll.find((t) => … && t.data.lang === 'es');           // :43, mai localitzat
  const recursos = recAll.filter((r) => … && r.data.lang === 'es');       // :45
  <QuizPlayer preguntas={test.data.preguntas} storageKey={`test-${a.slug}-u${unidad}`} client:load />  // :96, sense locale
  ```
- **Proposta**: crear els mapes `testCaById` i `recCaById` filtrats per `estado === 'publicado' && lang === 'ca'` i fer `pickLocalizedEntry` sobre el test i sobre cada recurs (l'href continua amb l'slug ES). Passar `locale={locale}` a `QuizPlayer` i moure «Pronto aquí…» al `copy`. Unificar el `storageKey` amb el de `tests/[slug].astro` (`test-${slug}-${n}`) i passar `locale` al `breadcrumbLd` de `:65`.
- **Confiança**: Alta (props de l'illa i text verificats a l'HTML construït).

#### CODE-WEB-02 · Alt · correcció/i18n — Hub «Tests»: la redirecció d'Astro xoca amb la pàgina real i, a `/ca/`, porta al castellà
- **On**: `astro.config.mjs:215-226`; `src/pages/[asignatura]/tests/index.astro` (genera el mateix camí); enllaços a `src/pages/[asignatura]/index.astro:140,247` i `src/pages/[asignatura]/tests/[slug].astro:71`
- **Problema**: `redirects` declara `/<asig>/tests` → `/<asig>/actividades-dinamicas/`, però `[asignatura]/tests/index.astro` genera el mateix camí i les dues rutes escriuen el mateix `index.html`. Qui guanya depén de la meitat del lloc:
  - `dist/client/edmn-2bach/tests/index.html` és la pàgina de tests (`noindex`).
  - `dist/client/ca/edmn-2bach/tests/index.html` és el stub d'Astro: `meta refresh` a la URL castellana i canonical castellana.
  - L'adaptador de Vercel només emet `^/edmn-2bach/tests$`, sense barra final. Tots els enllaços interns porten barra, així que el 301 no s'aplica a cap d'ells.
- **Escenari de fallada**: a `/ca/eco-1bach/`, la targeta «Tests» porta a `/ca/eco-1bach/tests/`, i el mateix fa el breadcrumb «Tests» de qualsevol test valencià. D'allí hi ha una redirecció immediata a `/eco-1bach/actividades-dinamicas/`: la pàgina és en castellà i no és la mateixa que veu l'usuari castellà (el llistat de tests). 99 pàgines `/ca/` hi enllacen (9 hubs + 90 tests).
- **Evidència** (`dist/client/ca/edmn-2bach/tests/index.html`):
  ```html
  <meta http-equiv="refresh" content="0;url=/edmn-2bach/actividades-dinamicas/">
  <link rel="canonical" href="https://www.profedeeconomia.es/edmn-2bach/actividades-dinamicas/">
  ```
- **Proposta**: primer cal decidir si el hub de tests continua viu.
  - Si continua (el hub i els breadcrumbs l'enllacen): esborrar el bloc `redirects` d'`astro.config.mjs`.
  - Si està retirat: llevar la targeta i el breadcrumb, esborrar `tests/index.astro` i moure les redireccions a `vercel.json` amb les 4 variants (`/x/tests`, `/x/tests/`, `/ca/x/tests`, `/ca/x/tests/`), cada una cap al hub del mateix idioma.
  - En els dos casos, afegir un test que falle si una clau de `redirects` coincideix amb una ruta de pàgina.
- **Confiança**: Alta.

#### CODE-WEB-03 · Mitjà · accessibilitat — El rètol dels CTA de descàrrega ix en tinta sobre terracota (3,42:1)
- **On**: `src/styles/global.css:219` (regla `strong` dins de `@layer base`). El CSS del CTA està copiat en 8 plantilles, p. ex. `src/pages/[asignatura]/libro/index.astro:213-247`.
- **Problema**: `.download-cta` posa `color: #fff` a l'`<a>`, però el `<strong>` intern té regla pròpia (la global), que guanya a l'herència. El rètol es pinta #2A1F18 sobre #C44E2C, en lloc del blanc que volia el disseny.
- **Escenari de fallada**: `/eco-4eso/libro/` → «Descargar libro completo» en marró fosc sobre terracota (captura verificada). axe-core dona `color-contrast` *serious*: 3,42:1 per al rètol i 3,32:1 per a `.muted`. Passa en 798 pàgines ES+CA: índexs de llibre, activitats i cada fitxa, debats, EBAU, programació i projecte. És el CTA de conversió principal (docs/seo-estrategia-2026.md §5.2). La variant mostassa de `/ca/emprendimiento/proyecto/` es queda en 2,77:1.
- **Evidència**:
  ```css
  /* global.css:219 */  strong { color: var(--color-ink); }
  /* libro/index.astro */ .download-cta { background: var(--color-terra); color: #fff; }
                          .download-cta__text strong { font-family: …; font-weight: 600; }  /* sense color */
  ```
- **Proposta**: `.download-cta__text strong { color: inherit; }`, o restringir la regla global a la prosa (`.prose strong, .article-body strong`). Extraure el CTA a un component compartit, perquè hui són 8 còpies.
- **Confiança**: Alta.

#### CODE-WEB-04 · Mitjà · accessibilitat — Tokens d'accent usats com a color de text per davall d'AA
- **On**: més de 100 declaracions `color: var(--color-terra)` en plantilles (p. ex. `src/components/libro/RecursosRelacionados.astro:62`, `src/pages/[asignatura]/tests/[slug].astro:135`); `src/components/SubjectCard.astro:95,113`; `src/pages/[asignatura]/libro/[unidad].astro:592-595`
- **Problema**:
  - La terracota #C44E2C sobre el crema #FBF6EC dona 4,35:1, per davall del 4,5 que cal per a text normal.
  - `.num` i `.arrow` de SubjectCard usen `--card-color`: per a Eco 4ESO (mostassa) queda 2,31:1 sobre blanc.
  - El textarea de notes lleva l'`outline` i al focus només canvia la vora a mostassa (2,15:1, per davall del 3:1 de WCAG 1.4.11).
  - `global.css` ja defineix els `--color-*-ink` segurs per a AA, però estes regles no els usen.
- **Escenari de fallada**: axe a `/` marca «Entrar →» d'Eco 4ESO (2,31:1). A `/ca/eco-1bach/libro/01-economia-ciencia-social/` marca els enllaços de «Para el aula» (4,35:1), i a `/juegos/` els enllaços dels imprimibles. També el trigger del menú quan està obert.
- **Evidència**: `.subject-card .arrow { color: var(--card-color); }` · `.un__area:focus { outline: none; border-color: var(--color-mustard); }`
- **Proposta**:
  - Per a text i enllaços sobre crema, usar `--color-terra-ink` (#9C3A1C). La terracota es queda per a fons i regles.
  - A SubjectCard, afegir un `--card-ink` per a cada `c-*` a partir de `--color-<x>-ink`.
  - Restaurar l'anell de focus del textarea.
- **Confiança**: Alta (mesurat amb axe-core sobre l'HTML construït).

#### CODE-WEB-05 · Mitjà · SEO/i18n — El `<title>` de les unitats en valencià porta un sufix castellà
- **On**: `src/pages/[asignatura]/libro/[unidad].astro:28`, `:79`, `:93`; `src/pages/[asignatura]/index.astro:161-178`
- **Problema**: la pàgina fa `const a = ASIGNATURAS[…]` sense `localizeAsignatura`, així que `a.seoName` i `a.level` ixen en castellà a `/ca/`. Al hub, el `teaches` del `Course` es construeix amb els títols d'unitat en castellà.
- **Escenari de fallada**: `/ca/eco-1bach/libro/01-economia-ciencia-social/` té `<title>L'economia com a ciència social — Economía 1.º Bachillerato</title>` i `"educationalLevel":"1.º Bachillerato"`. Passa en 93 de les 98 unitats `/ca/` (les altres 5 tenen `seoTitle`). A `/ca/eco-1bach/` hi ha `inLanguage: "ca-ES"` amb `teaches: ["La economía como ciencia social", …]`.
- **Evidència**: `const a = ASIGNATURAS[unit.data.asignatura];` · `title={d.seoTitle ?? \`${d.title} — ${a.seoName}\`}`
- **Proposta**: `const a = localizeAsignatura(ASIGNATURAS[unit.data.asignatura], locale);` i, al hub, derivar `unitTitles` amb `pickLocalizedEntry`.
- **Confiança**: Alta.

#### CODE-WEB-06 · Mitjà · SEO — `BreadcrumbList` amb URLs castellanes a 742 pàgines `/ca/`
- **On**: `src/lib/seo.ts:114` (`locale = 'es'` per defecte). 18 de les 21 crides no el passen, p. ex. `src/pages/[asignatura]/actividades/[slug].astro:63`, `actividades-dinamicas/[slug].astro:65`, `dinamicas/[familia]/[slug].astro:52`.
- **Problema**: el PR #217 va localitzar `breadcrumbLd`, però només el passen 3 plantilles (hub, índex de llibre i unitat).
- **Escenari de fallada**: `/ca/eco-1bach/actividades/01-creativo-lamina-explicar-la-economia/` emet `{"name":"Activitats","item":"https://www.profedeeconomia.es/eco-1bach/actividades/"}`: noms en valencià, URLs en castellà, en contra de la canonical `/ca/`. Passa en 742 de les 860 pàgines `/ca/` que tenen BreadcrumbList.
- **Evidència**: `const breadcrumb = breadcrumbLd([ … ]);` (sense segon argument)
- **Proposta**: passar `locale` a totes les crides. Encara millor, llevar el valor per defecte perquè `tsc` obligue a passar-lo, i afegir un test que recórrega `dist/ca` i comprove que tots els `item` comencen per `/ca/`.
- **Confiança**: Alta.

#### CODE-WEB-07 · Mitjà · SEO — Les pàgines que canonicalitzen a una altra URL continuen declarant `hreflang`
- **On**: `src/i18n/seo-locale.ts:36-47`
- **Problema**: quan `contentLang !== locale` (pàgines castellanes a propòsit), la canonical apunta a l'ES però els `alternates` es mantenen. A més, el germà ES declara `hreflang="ca"` cap a una URL que no és canònica. El mateix fitxer ja aplica la regla correcta quan hi ha `canonicalPath` («hreflang must only be declared by self-canonical pages»).
- **Escenari de fallada**: `/ca/olimpiada/banco/` té canonical `/olimpiada/banco/` i a la vegada `hreflang` es/ca/x-default. `/olimpiada/banco/` declara `hreflang="ca"` → `/ca/olimpiada/banco/`, que no és canònica. Passa igual amb `lecturas`, `simulacros`, `jocs-economics/leaderboard` i `edmn-2bach/ebau/examenes`: 10 pàgines. El sitemap ja les separa (§5.9), però l'HTML diu el contrari.
- **Evidència**: `alternates: canonicalPath ? [] : [ {hreflang:'es'…}, {hreflang:'ca'…}, … ]`
- **Proposta**: fer `alternates: canonicalPath || contentLang !== locale ? [] : […]`, i afegir un prop explícit a BaseLayout (p. ex. `translated={false}`) perquè la versió ES d'estes pàgines no emeta el `hreflang="ca"`.
- **Confiança**: Alta.

#### CODE-WEB-08 · Mitjà · i18n/SEO — Totes les plantilles passen `contentLang={locale}`, i el fallback castellà a `/ca/` es declararia valencià
- **On**: `src/layouts/BaseLayout.astro:47`, `:139`; `src/pages/[asignatura]/libro/[unidad].astro:98`; el mateix patró es repetix en ~50 plantilles de `src/pages`
- **Problema**: BaseLayout i `resolveSeo` ja tenen previst el cas del fallback: canonical a l'ES, `<main lang="es">` i fora del sitemap. Però les pàgines passen l'idioma de la UI, no el de l'entrada que es renderitza (`view.data.lang`), i per tant este camí no s'activa mai per al contingut. Hui no falla perquè totes les entrades ES tenen germà CA (0 sense germà), però res no ho garanteix: els tests de paritat només comproven CA→ES.
- **Escenari de fallada**: es publica `eco-1bach/libro/13-x.mdx` abans que la traducció, que és el flux normal. `/ca/eco-1bach/libro/13-x/` ix amb el cos en castellà, `<html lang="ca">`, canonical a si mateixa i `hreflang="ca"`, i `mirrorSitemapLocale` l'emparella com a versió valenciana. `npm test` continua passant.
- **Evidència**: `const view = pickLocalizedEntry(unit, caById, locale);` … `<BaseLayout … contentLang={locale}>`
- **Proposta**: `contentLang={view.data.lang}` (l'entrada triada per `pickLocalizedEntry`) a totes les plantilles de contingut. Opcionalment, un test de paritat ES→CA o un avís de build quan hi haja fallback.
- **Confiança**: Alta en el mecanisme; l'escenari encara no s'ha produït.

#### CODE-WEB-09 · Mitjà · robustesa — L'esquema accepta `estado` absent: dues activitats de GPE han desaparegut en silenci
- **On**: `src/content.config.ts:91-92` (el mateix `default('borrador')` es repetix en totes les col·leccions); `src/content/asignaturas/gpe-bach/actividades/04-caso-publicidad-responsable.md` i `06-debate-economia-sumergida.md`
- **Problema**: CLAUDE.md fa obligatoris `lang` i `estado`, però l'esquema els dona un valor per defecte, així que oblidar-se `estado` converteix el fitxer en esborrany sense cap avís. Els tests de paritat exigeixen `estado: publicado` al fitxer CA però no miren l'ES.
- **Escenari de fallada**: les altres 14 activitats ES de GPE porten `estado: publicado`, però estes dues no porten `estado` i queden com a `borrador`. Resultat: ni `/gpe-bach/actividades/04-caso-publicidad-responsable/` ni `/06-debate-economia-sumergida/` existeixen en cap idioma, ni tenen PDF, tot i que els seus germans `.ca.md` estan traduïts i marcats `publicado` (inventari: 341 activitats ES publicades contra 343 CA). El mateix origen té una conseqüència latent: `pickByLocale` (`src/lib/recursos-relacionados.ts`) triaria el CA publicat d'una entrada ES en esborrany i enllaçaria una pàgina `/ca/` que no existeix.
- **Evidència**: `estado: z.enum(ESTADOS).default('borrador'),` · el frontmatter dels dos fitxers acaba en `ebau: false` i no té `estado`.
- **Proposta**:
  - Fer `estado` obligatori (sense `default`), o almenys afegir un test que comprove que l'ES i el CA germans tenen el mateix `estado`.
  - Afegir `estado: publicado` als dos fitxers.
  - De passada, afegir un `refine` de rang per a `correcta` a `preguntaMC` (com ja fa `jocsEconomicsPreguntas`) i un altre per a les longituds de `relacionar`.
- **Confiança**: Alta.

#### CODE-WEB-10 · Mitjà · i18n — Literals castellans en components compartits, i illes sense `locale`, en pàgines `/ca/`
- **On**:
  - `src/components/emprendimiento/PuenteUnidades.astro:30,36,40,45`
  - `src/components/dinamicas/RoleCard.astro:12,17`
  - `src/components/dinamicas/FichaAlumno.astro:11` i `src/components/debates/FichaAlumno.astro:12`
  - `src/components/emprendimiento/MapaTransversal.astro:17`
  - `src/pages/olimpiada/fichas/[slug].astro:76-79`
- **Problema**: estos components no resolen el locale, i el guard de `src/components/libro-i18n.test.ts` només cobreix 14 components del llibre. Les fitxes de l'Olimpíada munten les calculadores sense `locale`, tot i que l'admeten (`HerramientaIsland` ja ho fa bé).
- **Escenari de fallada**:
  - 141 pàgines `/ca/` (debats, dinàmiques, projectes, eines, fases, jocs) mostren «Esto se trabaja en… · Unidad 3 · Competencias específicas: CE2».
  - 25 pàgines `/ca/` porten «Tarjeta de rol», «✂ recorta por aquí» i «Ficha del alumno».
  - `/ca/emprendimiento/proyecto/` comença el mapa amb «El proyecto es la espina dorsal…».
  - `/ca/olimpiada/fichas/03-punto-muerto/` (i les fitxes 02 i 04) carrega la calculadora en castellà.
  - Fora del meu àmbit, però amb el mateix símptoma: `BusinessGameOnline` i `JocsApp` no tenen i18n, i les seues pàgines declaren `lang="ca"`.
- **Evidència**: `<h3 class="puente__title">Esto se trabaja en…</h3>` · `{d.herramienta === 'PuntoMuerto' && <PuntoMuertoCalc client:load />}`
- **Proposta**: afegir claus `t()` noves (`puente.*`, `ficha.*`, `rolecard.*`) i `getLocale(Astro.currentLocale)` als components. Passar `locale={locale}` a les 4 calculadores, o reutilitzar `HerramientaIsland`. Ampliar el guard de literals a `src/components/{emprendimiento,dinamicas,debates}`.
- **Confiança**: Alta.

#### CODE-WEB-11 · Mitjà · correcció — Visor de diapositives: després d'un scroll, «següent» torna a la diapositiva 2
- **On**: `src/components/slides/Deck.astro:19-26`
- **Problema**: només el teclat mou l'índex `i`; un scroll amb ratolí o trackpad no l'actualitza. A més, `behavior: 'smooth'` ignora `prefers-reduced-motion`, i el `keydown` global fa `preventDefault` d'Espai i de les fletxes encara que el focus estiga en un control.
- **Escenari de fallada** (reproduït amb Chromium): a `/eco-1bach/diapositivas/01-economia-ciencia-social/` fem scroll fins a la 12/33 i premem → (o PageDown amb un passador de diapositives): el visor centra la 2/33. A classe, un sol gest de roda fa perdre la posició.
- **Evidència**: `let i = 0; const go = (n) => { i = …; slides[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' }); };`
- **Proposta**:
  - Recalcular `i` en cada tecla (la diapositiva més pròxima al centre), o mantindre'l amb un `IntersectionObserver`.
  - Usar `behavior: 'auto'` quan `matchMedia('(prefers-reduced-motion: reduce)')`.
  - Ignorar l'event quan el focus és en un element interactiu.
- **Confiança**: Alta.

#### CODE-WEB-12 · Mitjà · accessibilitat — El menú principal usa `role="menu"` sense el model de teclat corresponent
- **On**: `src/components/SiteHeader.astro:34`, `:61`, `:100`, més els `role="menuitem"` dels enllaços
- **Problema**: el patró ARIA *menu* promet navegació amb fletxes i un sol element tabulable. Ací els ítems són enllaços normals i les fletxes no fan res. Dins del `menu` hi ha etiquetes de grup (`span.dropdown-label`) que queden fora de l'estructura del menú. Els lectors de pantalla anuncien «menú» i passen a mode focus.
- **Escenari de fallada**: amb el desplegable «ESO» obert i el focus en «Taller de Economía», ↓ no mou el focus (comprovat amb Chromium). Un usuari de NVDA o JAWS que segueix el rol no obté resposta i perd els agrupadors «3.º ESO / 4.º ESO».
- **Evidència**: `<div class="nav-dropdown" role="menu"> … <a href={…} role="menuitem">`; el script només gestiona `click` i `Escape`.
- **Proposta**: passar al patró *disclosure navigation*: llevar `role="menu"`, `menuitem` i `aria-haspopup`; mantindre `button[aria-expanded]` amb `aria-controls`; fer servir llistes `<ul>` amb encapçalament de grup (`aria-labelledby`).
- **Confiança**: Alta en els fets; l'impacte l'estime moderat.

#### CODE-WEB-13 · Baix · accessibilitat — Estructura semàntica: `<main>` niat i jerarquia d'encapçalaments
- **On**:
  - `<main>` interns: `src/pages/404.astro:36`, `contacto.astro:34`, `sobre.astro:57`, `legal/aviso-legal.astro:64`, `legal/privacidad.astro:129`, `jocs-economics/index.astro:53`, `emprendimiento/entrevista-emprendedores/index.astro:159`, tots dins del `<main id="main">` de `BaseLayout.astro:139`; també `src/components/calculadoras/GeneradorCVEuropass.tsx:495`.
  - Encapçalaments: `src/content/asignaturas/edmn-2bach/ebau/02-cuestiones-teoricas.mdx:10` i `04-simulacros.mdx:10`.
- **Problema / escenari**:
  - Hi ha 30 pàgines amb dos `main` (axe: `landmark-no-duplicate-main`, `landmark-main-is-top-level`), entre elles 3 unitats del llibre (×2 idiomes) que inclouen el generador de CV.
  - `/edmn-2bach/ebau/` (i `/ca/`) té 3 `<h1>` perquè dues seccions MDX comencen amb `#`.
  - Hi ha salts h1→h3 i h2→h4 en 29 tipus de pàgina (PuenteUnidades en `h3`, RoleCard en `h4`…).
- **Evidència**: `<BaseLayout …><main class="prose"><h1>…`
- **Proposta**: canviar els `<main>` interns per `<div>` o `<article>`; baixar un nivell els encapçalaments de les seccions EBAU; ajustar els nivells dels components compartits.
- **Confiança**: Alta.

#### CODE-WEB-14 · Baix · correcció — Numeració editorial incoherent a la pàgina d'unitat
- **On**: `src/components/libro/RecursosRelacionados.astro:26`; `src/pages/[asignatura]/libro/[unidad].astro:334-384` (comptadors `h2section`/`h3section`) i `:302-320` (comptador `toc`)
- **Problema**:
  - (a) El `<h2>` «Para el aula» és dins d'`.article-body`, i la regla de la pàgina (`.article-body[cid] h2`, especificitat 0,2,1) guanya a `.recursos__title` (0,2,0). Es pinta a 34 px, amb el número de la secció següent al marge, i els grups s'enumeren «12.1», «12.2»… Per a UnitNotes ja hi ha un reset, però no per a este component.
  - (b) L'índex lateral numera h2 i h3 seguits (01…N), mentre el cos numera les h2 com a 01, 02… i les h3 com a 1.1, 1.2…
- **Escenari de fallada**: a `/eco-1bach/libro/01-economia-ciencia-social/`, el cos numera «03» la secció «La frontera de posibilidades de producción» i l'índex la numera «09». Al final, «PARA EL AULA» ix com a secció «12», amb subseccions 12.1 i 12.2 (captura). Passa en les 196 unitats.
- **Evidència**: estil computat de `#recursos-title`: `font-size: 34px; margin-top: 102px; ::after = counter(h2section)`.
- **Proposta**:
  - Afegir `.article-body .recursos__title, .article-body .recursos__grupo-title { counter-increment: none; … }` amb `::before` i `::after` a `content: none`, o traure el component de l'`<article>`.
  - A l'índex, numerar només les h2 i sagnar les h3 amb el format `N.M`.
- **Confiança**: Alta.

#### CODE-WEB-15 · Baix · correcció — Diagrama del multiplicador fiscal: subtítol tallat i etiqueta invisible
- **On**: `src/components/diagrams/MultiplicadorFiscal.astro:76`, `:83-84`
- **Problema**:
  - La classe `.round-sub` fixa `text-anchor: middle` i guanya a l'atribut `text-anchor="start"`, perquè el CSS mana sobre els atributs de presentació. El subtítol, centrat en x=62, ix del `viewBox`.
  - «Gasto público / inicial» té classe `.round-name-light` (blanc), però està a y=140 i y=153, damunt del rectangle (y=158), sobre el fons crema.
- **Escenari de fallada**: a `/eco-1bach/libro/11-politicas-economicas/` (i a `/ca/`, al deck i al PDF) es llig «nsión marginal al consumo c = 0,75» i l'etiqueta de la primera barra no es veu (captura). He escanejat automàticament els 94 diagrames de les 196 unitats i este és l'únic cas.
- **Evidència**: `<text class="round-sub" x="62" y="116" text-anchor="start">` · `<text class="round-name-light" x="119" y="140">`
- **Proposta**: usar `style="text-anchor:start"` (o una classe modificadora) per al subtítol; per a l'etiqueta, usar `round-name` (tinta) o baixar-la dins del rectangle.
- **Confiança**: Alta.

#### CODE-WEB-16 · Baix · correcció — La nota curricular del hub genera text incorrecte per a IPE (i «en el Ley»)
- **On**: `src/pages/[asignatura]/index.astro:55`, `:94`, `:224` (i `src/lib/faq.ts`, «establecido en el ${a.marcoNormativo}»)
- **Problema**: `a.title.toLowerCase()` passa a minúscules els numerals romans. A més, «establecido en el ${marco}» dona per fet un marc en masculí.
- **Escenari de fallada**:
  - `/ipe1-fp/`: «…para itinerario personal para la empleabilidad i, establecido en el Ley Orgánica 3/2022…».
  - `/ca/ipe1-fp/`: «…per a l'ocupabilitat i, establit en el Llei Orgànica…», on la «i» es llig com a conjunció.
  - És la nota que CLAUDE.md fa obligatòria.
- **Evidència**: `copy.curriculumNote(a.title.toLowerCase(), a.marcoNormativo)`
- **Proposta**: no passar el títol a minúscules (usar `a.title` o un camp `titleEnFrase` explícit) i reformular el text de manera neutra («segons el ${marco}») o afegir un camp amb l'article.
- **Confiança**: Alta.

#### CODE-WEB-17 · Baix · i18n — Els KPI dels arbres de decisió mostren les claus JSON en cru
- **On**: `src/components/actividades/ArbolDecisionesIsland.tsx:128`
- **Problema**: l'etiqueta és directament `{k}`, la clau de `kpi_inicial`.
- **Escenari de fallada**: `/ca/fopp-4eso/actividades-dinamicas/05-sistema-educativo-itinerarios/` mostra «CLARIDAD_FUTURO 20 · CONFIANZA 35 · AUTONOMIA 40»: castellà, sense accents i amb guió baix, dins d'una pàgina valenciana (captura). En castellà ix «REPUTACION» o «COHESION_EQUIPO».
- **Evidència**: `<span class="kpi-pill__label">{k}</span>`
- **Proposta**: afegir `kpi_labels` opcional al JSON de l'arbre (traduït a cada MDX) i, si falta, usar `k.replace(/_/g, ' ')` com a alternativa.
- **Confiança**: Alta.

#### CODE-WEB-18 · Baix · SEO/i18n — Pàgines indexables que no ho haurien de ser: `/ca/404/` i seccions buides
- **On**: `src/pages/404.astro:35` (sense `noindex`); `src/pages/[asignatura]/{actividades,refuerzo,retos,evaluacion}/index.astro` (generen pàgina per a totes les assignatures publicades)
- **Problema / escenari**:
  - (a) Vercel serveix `/404.html`, en castellà, per a qualsevol `/ca/*` inexistent. En canvi, `/ca/404/` existeix com a pàgina 200 amb canonical pròpia i `hreflang`, i el selector d'idioma del 404 hi apunta.
  - (b) `/cjd-bach/{actividades,refuerzo,retos,evaluacion}/` (més `/ca/`) són pàgines de «se publicarán próximamente», indexables i al sitemap (8 URL). El hub de CJD, a més, enllaça «Actividades».
- **Evidència**: `<BaseLayout title={copy.pageTitle} contentLang={locale}>` (sense `noindex`); el sitemap conté `…/cjd-bach/refuerzo/`
- **Proposta**:
  - Posar `noindex` al 404 i afegir la ruta `^/ca/.*` → `/ca/404/index.html` amb status 404.
  - Posar `noindex` quan `items.length === 0`, i fer condicional la targeta «Actividades» del hub com ja ho són les altres.
- **Confiança**: Alta.

#### CODE-WEB-19 · Baix · mantenibilitat — Encara queda el patró vetat de ratlla d'accent en un sol costat
- **On**: `src/pages/[asignatura]/libro/[unidad].astro:512` (`.un`, UnitNotes, 196 pàgines); `src/pages/[asignatura]/proyecto/index.astro:184` (`.fase-card`)
- **Problema**: incompleix la regla 2 de docs/design-system.md, que és VINCULANT: les caixes han de tindre vora simètrica d'1px, i el color funcional va a la vora sencera o al text.
- **Escenari de fallada**: la caixa «Notas de esta unidad» de totes les unitats porta `border-left: 3px solid var(--color-mustard)`, i les targetes de fase porten `border-top: 3px solid var(--accent)`.
- **Evidència**: `.un { border: 1px solid var(--color-line); border-left: 3px solid var(--color-mustard); border-radius: 6px; }`
- **Proposta**: llevar el `border-left` i el `border-top`, mantenint el fons i l'etiqueta, com indica el patró de transformació del document.
- **Confiança**: Alta.

## Deute tècnic i millores
- **Deck**: `src/pages/[asignatura]/diapositivas/[unidad].astro:27-33` llig el `.ca.mdx` directament del disc, sense passar per la col·lecció (i amb `!`, així que falla si el fitxer no hi és). A més, el fallback de `src/lib/slides/build-deck.ts` té regex només castellanes (`DROP_SECTION`, `soluci[oó]n`). Hui és codi mort (les 98 unitats tenen bloc ```deck), però en valencià deixaria passar «Glossari» o «Per a aprofundir».
- **Mapes `libroCaById`/`dinCaById` sense filtre d'`estado`**: `actividades/[slug].astro:39`, `tests/[slug].astro:37`, `tests/index.astro:32`, `recursos/[slug].astro:37` i `actividades-dinamicas/[slug].astro:38,42`. L'única garantia que el CA estiga publicat és el test de paritat.
- **`src/i18n/sticky-locale.ts` i el seu script a `BaseLayout.astro:146`**: són redundants des del PR #266, i el comentari («server output keeps the clean ES hrefs») ja no és cert. A més, hi ha dues implementacions de `localizeHref` amb regles diferents.
- **Targetes del hub sense comprovació**: `src/pages/[asignatura]/index.astro:132-146` enllaça sempre `libro`, `diapositivas`, `actividades`, `actividades-dinamicas` i `programacion`. Com que les rutes de `programacion` vénen de la col·lecció, una assignatura sense programació donaria 404 des del hub.
- **Esquema**:
  - `url_interactivo` (`content.config.ts:187`) no s'usa enlloc.
  - La col·lecció `juegos` no té cap fitxer.
  - `unidadesPorComponente` (`src/lib/herramientas.ts:150`) no filtra per `estado`.
- **SEO**:
  - 1.340 de les 2.198 pàgines indexables tenen un `<title>` de més de 60 caràcters, i 1.325 una descripció de més de 160; `pageTitle` només gestiona el sufix de marca.
  - `public/robots.txt:4-5` bloqueja `/imprimir` i així Google no veu el `noindex` d'eixes pàgines, que estan enllaçades des de 682 fitxes d'activitat (ES+CA).
  - `public/llms.txt` no inclou CJD.
  - Les OG images només estan en castellà.
- **`scripts/build-og-images.mjs`**:
  - Duplica les dades d'assignatura, i els nivells d'IPE I/II, EEAE i GPE ja no coincideixen amb `src/lib/asignaturas.ts`.
  - Importa `puppeteer` sense declarar-lo com a dependència (arriba de manera transitiva via `pagedjs-cli`).
  - `BaseLayout.astro:75-79` dona per fet que existeix `/og/<slug>.png`.
- **Barra final**: `faseHref` no porta `/` en `src/pages/[asignatura]/proyecto/[fase].astro:57` ni en `emprendimiento/proyecto/[fase].astro:46`. Són 48 URL de destinació diferents, que existeixen alhora amb barra i sense (la canonical ho arregla).
- **Rendiment**:
  - `/fonts/*` no té un `Cache-Control` llarg (només `/_astro/` és immutable); convé afegir la capçalera a `vercel.json`.
  - La Fraunces italic (150 KB) no està precarregada, tot i que els `lede` en cursiva ixen a dalt de tot.
  - Switzer no té cara italic, així que la cursiva és sintètica.
  - `ArbolDecisiones` i les calculadores de les fitxes usen `client:load` encara que estan per davall del plec; `client:visible` seria suficient.
- **Tokens**:
  - Hi ha 1.946 hex fixos en els 94 diagrames.
  - Hi ha verds fora dels tokens a `KeyTakeaways.astro:46-107` i `actividades/ArbolDecisiones.astro:44-45`.
  - Les rutes d'impressió copien valors de token antics (`#806C5A`, `#A87A2A`).
- **`LanguageSwitcher.astro`**: «ES» i «VAL» no tenen `lang` ni nom accessible complet, l'enllaç perd el *query string*, i els dos grups (capçalera i peu) tenen el mateix `aria-label`.
- **`UnitNotes.tsx`**: `aria-live` està posat sobre un text fix («Guardado») que no canvia mai, així que el lector de pantalla no l'anuncia. A més, el botó «Borrar notas» no demana confirmació.
- **`QuizPlayer`**: el `storageKey` de `tests/[slug]` és diferent del d'`actividades-dinamicas`, així que la millor nota no es comparteix entre les dues pàgines.
- **Plurals**: `actividades-dinamicas/index.astro:50-59` mostra «1 simuladores» i «1 recursos».
- **Comentaris i textos desfasats**: el comentari del FAQ al hub; a `diapositivas/index.astro`, «Auto-generado», «PDF + HTML» i un `npm run build:slides` que no existeix; a `build-deck.ts`, la sintaxi `{/* deck */}`.
- **Estructura de navegació**: el desplegable «Otros» agrupa `juegos`, `herramientas` i `emprendimiento`, mentre que CLAUDE.md diu «no agrupades sota "Otros"». Cal confirmar si la decisió ha canviat.
- **Slugs**: dues famílies de dinàmiques tenen slugs valencians en URLs castellanes (`/dinamicas/mercat-treball/`, `/dinamicas/mercats-preus/`).
- **Deck**: cada diapositiva `cover` és un `<h1>`, i les figures es carreguen en `eager` a 1280 px.

## Top 5
1. **CODE-WEB-02**: el hub de tests en valencià redirigix al castellà en 99 pàgines. Amb el bloc `redirects` esborrat, o decidint la retirada, queda resolt.
2. **CODE-WEB-01**: tests i recursos en castellà a `/ca/…/actividades-dinamicas/` (90 pàgines). Es resol localitzant dues entrades i passant `locale`.
3. **CODE-WEB-03**: el CTA de descàrrega, el més important del lloc, té el rètol a 3,42:1 en 798 pàgines. Es resol amb una sola regla CSS.
4. **CODE-WEB-05, 06 i 07**: senyals SEO incoherents a `/ca/` (sufix castellà al títol de 93 unitats, 742 breadcrumbs amb URLs castellanes, `hreflang` en pàgines no canòniques). Són exactament l'actiu diferencial de §5.8.
5. **CODE-WEB-09 i 08**: fer obligatori `estado`, comprovar la paritat ES↔CA i passar l'idioma real de l'entrada a `contentLang`, perquè el contingut no desaparega en silenci ni es publique en castellà com si fóra valencià.
