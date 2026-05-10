# CLAUDE.md — profedeeconomia.es (Rebranding)

## Identitat del projecte

- **Nom**: profedeeconomia.es
- **URL**: https://profedeeconomia.es
- **Producte**: Plataforma educativa per a professors d'institut d'economia. **Estructurada per assignatura**, no per tipus de contingut. Cada assignatura té llibre, diapositives, activitats, tests i recursos. Seccions específiques per a contingut transversal: jocs, eines docents, emprenedoria, oposicions (redirect).
- **Audiència primària**: professors d'economia d'ESO i Batxillerat a Espanya
- **Audiència secundària**: alumnes d'institut, opositors-futurs-professors
- **Idioma principal**: Castellà (`es`) — únic publicat al MVP
- **Idiomes preparats al codi des del dia 1**: Castellà (`es`), Català/Valencià (`ca`)
- **Idioma de comunicació amb dev (Pau)**: Català/Valencià
- **Idioma del codi**: Anglès
- **Autor**: Pau Mompó (Valencia/Torrevieja, Spain)

## Visió en una frase

Convertir profedeeconomia.es en la plataforma de referència per a professors d'economia d'institut a Espanya, organitzada de la manera més útil per a ells: **per assignatura**.

## Documents de referència obligatoris

Llig sempre aquests documents abans de proposar canvis estructurals:
- `docs/PRD.md` — visió, audiència, abast del MVP, sitemap, distribució de contingut
- `docs/migration-map.md` — mapa de migració peça per peça del webpde
- `docs/design-system.md` (futur, post-mockups) — paleta validada, tipografia, components

## Estructura per assignatures (DECISIÓ VINCULANT)

L'organització principal del web és per assignatura. **NO per tipus de contingut**. Si Claude Code proposa canviar açò, es rebutja.

Les 4 assignatures tenen exactament la mateixa estructura interna:

```
/[assignatura]/                Hub de l'assignatura
/[assignatura]/libro/          Llibre
/[assignatura]/libro/[unidad]  Unitat individual
/[assignatura]/diapositivas/   Diapositives
/[assignatura]/actividades/    Activitats pràctiques
/[assignatura]/tests/          Tests d'autoavaluació
/[assignatura]/recursos/       HTMLs interactius i altres recursos
```

Slugs de les 4 assignatures: `edmn-2bach`, `eco-1bach`, `eco-4eso`, `fopp-4eso`.

A banda de les assignatures, hi ha 3 seccions específiques amb noms propis (no agrupades sota "Otros"):
- `/juegos/` — jocs i concursos
- `/herramientas/` — eines docents
- `/emprendimiento/` — material d'emprenedoria

I una entrada al menú de navegació, sense pàgina d'aterratge pròpia:
- `/oposiciones` — redirect 301 directe a oposicioneseconomia.es (sense pàgina intermèdia)

## Cobertura curricular dels llibres

Els 4 llibres es basen en el **currículum bàsic estatal LOMLOE**, no en concrecions autonòmiques específiques:

- **Batxillerat (Eco 1BACH, EDMN 2BACH)**: Reial Decret 243/2022
- **ESO (Eco 4ESO, FOPP 4ESO)**: Reial Decret 217/2022

A la introducció de cada llibre apareix una nota explícita:

> "Aquest llibre es basa en el currículum bàsic estatal LOMLOE per a [assignatura] (Reial Decret [X]/2022). Cada comunitat autònoma estableix concrecions específiques al seu currículum propi. Cal consultar la concreció de la teua CCAA per ajustar la programació al teu centre."

**Adaptacions per CCAA específiques NO al MVP**. Es valorarà fase 2+ si hi ha tracció significativa a una CCAA concreta.

## Direcció estètica: editorial sòbria amb to proper

**Açò és el factor diferenciador #1 del projecte.** Vull repetir-ho perquè és bàsic.

Econosublime és el referent a superar. La seua debilitat no és el contingut sinó l'estètica anodina. La nostra avantatge és **fer un producte que destaque visualment des del primer scroll**.

### Filosofia visual

- **Editorial sòbria, no infantil**: pensa Princeton University Press, MIT Press, Stripe Press
- **Espai blanc generós**: layouts respiratoris, mai amuntonem
- **Tipografia gran i llegible**: 1.125rem mínim al cos
- **Una sola columna per al contingut llarg**
- **Cap mascot ni emoji com a icona**
- **Cap gradient cridaner**
- **Microinteraccions polides**

### To de veu — IMPORTANT

**No personal de Pau.** El web no diu "Hola, soc Pau". Diu coses com "Material per a impartir economia, empresa i finances a l'institut".

**Però proper, no corporatiu.** Diferenciem-nos d'una editorial corporativa amb:
- Plural ("hem fet", "us proposem")
- Reconeixement de realitat d'aula ("provat a classe", "ja sabeu com va")
- Connexió com a col·legues ("per si us serveix", "ho fem servir nosaltres així")
- Mai vendre, mai prometre, mai promocionar

### Paleta proposada (validació en curs)

Sessió de mockups iniciada el 2026-05-10. Es van presentar dues variants editorials sòbries (A — Source Serif + vermell barroc; B — Newsreader + verd musc) i totes dues van quedar massa formals. S'està explorant una **Variant C** més càlida i amb més color, que recupere l'energia del webpde actual sense reincidir en el rosa Tailwind ni en la mascota porc. La paleta i la tipografia es congelen quan Pau valide la direcció final.

- Fons clar base: `#FAFAF7` (off-white càlid) — confirmat
- Fons fosc opcional: `#1A1A1A` — confirmat
- Accent primari: pendent (validació final amb mockups)
- Accent secundari (terra càlid): `#C19A6B` — confirmat com a candidat
- Mockups vius a `mockups/` (variant A, B i C)

**NO usar el rosa Tailwind del webpde antic.** Aquell era per a un producte més juganer; aquest és editorial — però el càlid i el color sí són benvinguts.

### Tipografia (validació en curs)

- Títols: serif editorial amb caràcter (candidats actius: Fraunces, Newsreader)
- Cos: sans humanística amb bona altura-x (candidat actiu: Switzer)
- Mono: IBM Plex Mono o JetBrains Mono

### Què NO fer mai

- ❌ Gradients hexagonals cridaners
- ❌ Il·lustracions stock genèriques
- ❌ Mascot porc
- ❌ Emojis com a icones (icones tipogràfiques o SVG personalitzats)
- ❌ Plus Jakarta Sans (estètica del webpde antic, ja no)
- ❌ Inter genèric a tot arreu
- ❌ Capçaleres amb logo gegant
- ❌ Banners amb CTAs en majúscules

## Stack tècnic

### Vinculant al MVP
- **Framework**: Astro 5 (mateix que oposicioneseconomia.es per coherència)
- **UI interactiva**: Preact (illes per a recursos interactius)
- **Estils**: Tailwind 4
- **Hosting**: Vercel
- **Generació PDF llibres**: paged.js o Puppeteer (script Node)
- **Generació diapositives**: Marp CLI
- **Analytics**: Plausible
- **Errors**: Sentry free tier

### Fase 2 (NO al MVP)
- **Backend**: Supabase (Postgres + Auth) per a premium professor
- **Email**: Resend (newsletter)
- **Pagaments**: Stripe + Patreon

### Fase 3 (futur 2027) — Jocs multijugador
- **Backend tipus PartyKit / Cloudflare Durable Objects**: decisió a revisar al moment d'execució (gener 2027), pot haver canviat el panorama

### Fora d'abast (mai sense decisió explícita)
- App mòbil (és un projecte separat)
- Live streaming
- Comunitat interna

## Sistema "single source of truth"

**La regla d'or del projecte**: cada unitat dels llibres viu en **un sol fitxer MDX**. D'aquest fitxer es genera tot:
- Pàgina HTML del web
- PDF del llibre
- Diapositives PDF
- Diapositives editables (futur premium)

Convenció `:::slide` dins del MDX defineix què entra a les diapositives.

**Què NO fer**:
- ❌ Mantenir múltiples versions del mateix contingut a fitxers diferents
- ❌ Copiar-pegar text entre el llibre i les diapositives manualment
- ❌ Crear PowerPoints des de zero — sempre derivats del MDX

## Arquitectura i18n

Idèntica a oposicioneseconomia.es. Castellà al MVP, català/valencià a fase 2.

```js
// astro.config.mjs
i18n: {
  defaultLocale: 'es',
  locales: ['es', 'ca'],
  routing: {
    prefixDefaultLocale: false,
  },
}
```

## Convencions

### Codi
- TypeScript estricte. No `any`.
- Conventional Commits.
- Prettier + ESLint configurats.
- Components Astro per defecte; Preact només quan calgui interactivitat.
- Fitxers: kebab-case (`unit-card.astro`)
- Components: PascalCase (`<UnitCard />`)

### Contingut dels llibres
- Cada unitat en MDX dins de `src/content/asignaturas/{asignatura}/libro/{numero}-{slug}.mdx`
- Frontmatter obligatori amb: `asignatura`, `unidad`, `title`, `lang`, `estado`, `objetivos`, `conceptos_clave`
- Tot contingut publicat ha passat revisió manual de Pau (no auto-publish)
- `estado: 'publicado'` és l'únic que es renderitza al lloc

### Activitats, Tests, Recursos
- Mateixa carpeta per assignatura: `src/content/asignaturas/{asignatura}/{actividades|tests|recursos}/{slug}.mdx`
- Frontmatter amb relació a la unitat correspondent: `unidad_relacionada`

### Workflow Git
- Branca `main` és producció (autodeploy a Vercel)
- Branca `dev` per a integració
- Feature branches des de `dev`
- PRs requereixen revisió pròpia (al ser solo dev, almenys deixar 1h entre obrir i fer merge)
- **Mai push directe a main**

## Workflow Claude Code

1. **Tota tasca no trivial comença amb `/brainstorm`** del plugin superpowers
2. **Pla amb `/plan`** abans de codi
3. **TDD obligatori per a lògica complexa** (scripts de build, generadors)
4. **`/review` abans de merge** a main
5. **Mai `--dangerously-skip-permissions`**

## Prioritat: mockups abans de codi de producció

**LA PRIMERA SESSIÓ DE CLAUDE CODE** en aquest projecte ha de ser **exclusivament de mockups visuals**, no de setup tècnic. L'estètica és tan important que mereix una sessió sencera per validar direcció abans de tocar codi de producció.

Sessions previstes:
1. **Mockups visuals** (5 pàgines clau, 2-3 variants estètiques)
2. **Setup tècnic** (Astro + integracions + i18n + estructura)
3. **Migració dels 8 índexs antics** distribuits a les assignatures
4. **Llibre 1 EDMN 2BACH** (sessions múltiples)
5. **Llibres 2, 3, 4** (sessions múltiples cada un)

## Migració del webpde

El repo `webpde` actual conté el contingut antic. La migració es fa per fases:

### Fase 0 (post-mockups, setup) - Maig 2026
- Setup tècnic
- Estructura completa de les 4 assignatures (placeholders)

### Fase 1 (Juny 2026) - Llibre 1
- Migració de `empresa.html` distribuit dins d'EDMN 2BACH
- Llibre 1 (EDMN 2BACH) complet
- Diapositives derivades del Llibre 1

### Fase 2 (Setembre 2026) - Llibre 2 + llançament
- Migració d'`economia.html`, `ferramentes.html`, `recerca.html` distribuit dins d'Eco 1BACH
- Llibre 2 (Eco 1BACH) complet
- Llançament suau

### Fase 3 (Octubre-Desembre 2026) - Llibre 3
- Migració parcial de `vidapractica.html` per a Eco 4ESO
- Llibre 3 (Eco 4ESO) complet

### Fase 4 (Gener-Febrer 2027) - Llibre 4 + primer joc
- Migració de la resta de `vidapractica.html` per a FOPP 4ESO
- Llibre 4 (FOPP 4ESO) complet
- Primer joc refet: `stonks` a `/juegos/stonks/`

### Fase 5 (Abril-Setembre 2027)
- Resta de jocs refets (insider, communist, econopoly, econrisk)
- Migració de Playground i Concurs
- Eines docents migrades
- Català/valencià activat

### Fase 6 (Setembre 2027+)
- webpde antic deprecat
- Tots els enllaços externs ja redirigits

## Salvaguardes i fronteres

### Sobre contingut educatiu
- **Cap material copiat literalment d'altres editorials o blogs**. Tot original o derivat de fonts oficials (BOE, DOGV).
- **Citar fonts** quan basem-nos en bibliografia.
- **Currículum LOMLOE** com a referència oficial per a estructurar els llibres.

### Sobre l'estructura per assignatures
- **Cap canvi a l'estructura sense aprovació explícita**. Si Claude Code proposa "afegir una secció genèrica de blog", es rebutja al MVP.
- **Cada assignatura ha de tindre la mateixa estructura interna**. La consistència entre les 4 assignatures és vinculant.

### Sobre estètica
- **Cap canvi al sistema visual sense aprovació explícita**. Mockups validats abans de codi de producció.
- **Si Claude Code proposa "afegir un gradient" o "fer la home més juganera", es rebutja.**

### Sobre dades d'usuaris (per a fase 2)
- **GDPR-friendly des del primer dia**.
- **Cap email comercial sense consentiment explícit**.

## Out of scope explícit (no facis)

- ❌ Estructura per "tipus de contingut" (la web s'organitza per assignatura)
- ❌ Mascotes infantilitzades
- ❌ Anuncis (Google AdSense, etc.). Mai.
- ❌ Paywall sobre el contingut educatiu principal. El llibre sempre gratuït.
- ❌ App mòbil dedicada
- ❌ Funcionalitats socials internes
- ❌ Live streaming
- ❌ Publicar català/valencià al MVP (estructura sí, contingut no)
- ❌ Blog/notícies al MVP
- ❌ **Pàgina d'aterratge a /oposiciones/** (redirect 301 directe)
- ❌ **Adaptacions del llibre per CCAA específiques al MVP** (currículum estatal genèric)

## Comunicació amb dev

- Pau parla en valencià/català.
- Respostes meues en valencià/català tret que demane explícitament una altra cosa.
- UI strings i contingut educatiu en castellà al MVP, en català/valencià a fase 2.
- Comentaris al codi en anglès.
- Commit messages en anglès, Conventional Commits.

## Estat actual

- **Domini**: profedeeconomia.es (existent, apunta al webpde antic)
- **Repo nou**: pendent de crear
- **Repo antic webpde**: viu, mode manteniment durant la transició
- **Stack confirmat**: Astro 5 + Preact + Tailwind + Vercel
- **Sense backend al MVP**
- **i18n**: arquitectura preparada des del dia 1, només castellà publicat al MVP
- **Primer llibre**: EDMN 2BACH (especialitat de Pau)
- **Estructura confirmada**: per assignatures, no per tipus de contingut

## Pròxims passos immediats

1. Crear repo nou (`profedeeconomia` o similar) a GitHub
2. **Sessió 1 de Claude Code: MOCKUPS VISUALS** (veure `profedeeconomia-claude-code-mockups-prompt.md`)
3. Validació de la direcció estètica amb Pau
4. Sessió 2: setup tècnic complet
5. Sessions 3+: migració, llibres, etc.

## Recursos

- **Astro docs**: https://docs.astro.build
- **Marp CLI**: https://marp.app/
- **paged.js**: https://pagedjs.org/
- **Currículum LOMLOE**: BOE per assignatura
- **Repo origen del contingut**: https://github.com/skinnydkd/webpde
- **Repo germà** (oposicioneseconomia): https://github.com/skinnydkd/oposicioneseconomia
