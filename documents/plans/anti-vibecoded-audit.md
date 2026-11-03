# Auditoria anti-"vibecoded" — profedeeconomia.es

*2026-10-25 · Fase 1 (sense canvis al codi) · pendent d'aprovació*

Referència: els 20 punts de «Web Design — Avoid the vibecoded look» del CLAUDE.md global.
Prioritat: la identitat validada del projecte (CLAUDE.md «Direcció estètica», `docs/design-system.md`,
Variant C) mana sobre la llista. El projecte ja va fer una passada de-slop el juliol de 2026,
així que el punt de partida és bo.

## Abast i com s'ha revisat

- Codi: grep a `src/` (`.astro`, `.tsx`, `.ts`, `.css`) de cada punt. Jocs (`components/games/`)
  i fulls d'impressió (`*/imprimir*`) fora d'abast, igual que a la passada de juliol.
- Navegador: producció (profedeeconomia.es = `main`), home a 1280 px i 800 px, i índex del llibre
  EDMN. El dev server local tarda molt a sincronitzar el contingut i el panell del navegador
  estava ocult, així que la pàgina d'unitat només s'ha revisat al codi, i no hi ha captura mòbil a 375 px.
  A la fase 2 verificaré en local a 375 px i a 1280 px abans de cada push.
- **No hi ha mode fosc** al projecte (cap `prefers-color-scheme`). El punt 7 no s'aplica, i
  afegir-ne un seria un canvi de sistema visual: no el propose.
- **No hi ha pricing/checkout.**
- Nota: la plantilla de l'encàrrec parla d'«opositors i estudiants»; l'audiència d'aquest web
  és **professorat d'institut**. El copy es revisa amb eixe públic al cap.

## Troballes, ordenades per impacte visual

### 1. Taques de color difuminades darrere del hero (punts 1/20, variant «mesh blob»)

- `src/pages/index.astro:252-256` — `.hero` amb dos `radial-gradient` (mostassa a dalt a la dreta,
  terracota a baix a l'esquerra). És el primer que es veu a la home.
- `src/pages/[asignatura]/libro/[unidad].astro:252-256` — `.unit-opener`, mateix recurs en terracota,
  a totes les unitats dels 10 llibres.
- Per què és un tic: la «taca de llum» suau darrere del títol és el fons per defecte de les landings
  generades. No és un gradient cridaner, però tampoc aporta res al to editorial (Stripe Press o MIT Press no en fan).
- **Proposta**: treure els `radial-gradient` i deixar `background: var(--color-bg)`. Si es vol
  separar el hero de la resta, fer-ho amb una regla horitzontal 1px `var(--color-line)` a la base
  (recurs ja canònic al design-system). Canvi de 2 blocs CSS.

### 2. «Material transversal»: graella de targetes icona-títol-text-enllaç (punt 8)

- `src/pages/index.astro:197-219` (marcatge) i `:340-372` (estils `.strip-item`, `.icon`).
- 8 targetes idèntiques en graella, cadascuna amb un cercle de color amb una lletra (D, H, E, P…)
  + h3 + paràgraf + «Ver …». És el patró de secció de «features» amb icones, multiplicat per 8.
- A més, el cercle d'Emprendimiento (blanc sobre mostassa `#D4A24C`) té un **contrast de 2,31:1**,
  que no arriba ni al 3:1 de text gran.
- **Proposta**: convertir-ho en una llista editorial a dues columnes (una a mòbil): títol en Fraunces,
  descripció i enllaç, separats per regles 1px `var(--color-line)` en compte de caixes. Treure el
  cercle de lletra. L'únic cas especial són els anells de Jocs Econòmics; o també s'eliminen, o es
  mantenen petits al costat del títol. Ho decideixes tu.
  El color de cada secció es pot conservar al títol (`color: var(--color-…-ink)`), com ja fa el
  design-system amb els eyebrows. Si no vols tocar l'estructura, l'alternativa mínima és només
  traure el cercle (i amb ell el problema de contrast).

### 3. Copy de la home en primera persona del singular (to, no tic de plantilla però sí regla del projecte)

- `src/pages/index.astro:72` — «El material que **uso** cada día en clase…»
- `src/pages/index.astro:98` — «Aquí no **finjo** cubrir las diecisiete: **cubro** la base común…»
- Equivalents CA a `:107` i `:133`.
- El CLAUDE.md del projecte diu explícitament: «No personal de Pau… Plural ("hem fet", "us proposem")».
- **Proposta** (mateix contingut, en plural, sense tocar cap dada):
  - ES `lede`: «El material que usamos cada día en clase, ahora ordenado por asignatura. Cada una con su libro, sus diapositivas, sus actividades, sus tests y sus recursos.»
  - ES `whyRest`: «…Cada comunidad autónoma añade su concreción, y conviene revisarla. Aquí no fingimos cubrir las diecisiete: cubrimos la base común, que ya es bastante.»
  - CA: «El material que fem servir cada dia a classe, ara ordenat per assignatura…» / «Ací no fingim cobrir les disset: cobrim la base comuna, que ja és prou.»
  - Cap paraula buzzword detectada («potencia», «desbloquea», «siguiente nivel», «sin fricciones»…: 0 casos de copy).

### 4. Terracota com a color de text petit, just per davall d'AA (punt 7, contrast)

- `--color-terra` `#C44E2C` sobre el fons `#FBF6EC` → **4,36:1** (AA normal demana 4,5). Sobre `--color-bg-soft` → 3,90.
- 93 declaracions `color: var(--color-terra)` fora de jocs/impressió; les problemàtiques són les
  d'etiquetes petites en majúscules, p. ex. `components/dinamicas/RoleCard.astro:25`,
  `components/debates/materiales/TarjetasPostura.astro:45`, `components/actividades/ArbolDecisiones.astro:74`,
  `components/business-game/BusinessGame.css:16`, `components/QuizPlayer.css:39,207`,
  `components/refuerzo/BloqueRefuerzo.astro:137`.
- La resta de tokens ja passen AA (`--color-ink-mute` #6E5A47 = 6,06; `--color-mustard-deep` #835F20 = 5,38),
  i `a.editorial-link` ja usa `--color-terra-deep`.
- **Proposta**: no tocar el token de marca. Per a text, usar el token que ja existeix per a això,
  `--color-terra-ink` (= terra-deep, 6,42:1), a les etiquetes i textos de menys de 18,66 px. Marcadors de
  llista, vores i fons es queden en `--color-terra`. Les substitucions són mecàniques, una per línia.

### 5. Etiquetes de curs en píndola a les targetes d'assignatura (punt 9, lleu)

- `src/components/SubjectCard.astro:98,156` — «3.º ESO», «BACHILLERATO (1.º/2.º)» en `border-radius: 999px` mono.
- No estan damunt del h1 (que és el tic real) i el design-system manté explícitament els «badges» de text.
- **Proposta**: **cap canvi**. Ho apunte només perquè és el més semblant al punt 9 que hi ha.

## Punts revisats sense troballes (o acceptats per la identitat)

| # | Punt | Resultat |
|---|------|----------|
| 1 | Gradient lila→blau | 0 casos. Només hi ha el sublinyat animat de `a.editorial-link` (`global.css:311`) i un ratllat de fons a `Semana168Calc.tsx:343`; cap dels dos és decoratiu-plantilla. Les taques del hero, a la troballa 1. |
| 2 | Text amb gradient | 0 (`bg-clip-text`, `background-clip:text`). |
| 3 | Emojis a títols | 0 pictogrames a `src/` fora del contingut. |
| 4 | Inter | 0. Fraunces + Switzer + JetBrains Mono (identitat validada). |
| 5 | Targetes amb vora de color | 0. La passada de juliol ja va passar els callouts a vora simètrica 1px neutra. Les `border-left` que queden són `blockquote`/pull-quotes (permeses pel design-system). |
| 6 | Glassmorphism | 0 (`backdrop-filter`/`blur`). |
| 7 | Mode fosc de baix contrast | No hi ha mode fosc. El contrast en clar està a la troballa 4. |
| 10 | Lucide | 0. Icones SVG pròpies. |
| 11 | shadcn sense personalitzar | No s'usa shadcn/radix. |
| 12 | Fade-in en scroll | 0 (`IntersectionObserver`, `whileInView`, `@keyframes` fora de jocs). |
| 13 | Glow que segueix el cursor | 0. L'únic `pointermove` (`slides/Deck.astro:99`) desperta la barra de controls de les diapositives: és funcional. |
| 14 | Hover que només canvia l'opacitat | 0. Els hovers fan elevació + ombra o sublinyat animat. |
| 15 | Espaiat inconsistent | Cap valor Tailwind arbitrari (`mt-[13px]`). La home usa una escala en `rem`/`clamp()` coherent. No he auditat l'escala de tot el lloc component per component (fora del que es veu). |
| 16 | Guions llargs | En castellà i català, la raya «—…—» per als incisos és puntuació normativa (RAE/IEC), no un tic. N'hi ha 2 a la home (`index.astro:85,120`), correctes. Els ~9.900 del contingut MDX són material acadèmic i no es toquen. **Cap canvi.** |
| 17 | Copy buzzword | 0 casos. |
| 18 | Paraula en cursiva serif als títols | **Present i volgut**: `serif-italic-wonk` al h1 i els h2 de la home. És la firma tipogràfica validada al CLAUDE.md («italic amb WONK 1» per a italics ornamentals). **Cap canvi**: la identitat mana. |
| 19 | Space Grotesk + Instrument Serif | 0. |
| 20 | Gra/soroll | 0 (`feTurbulence`, `noise`, `grain`). |

## Pla de commits (fase 2, si s'aprova)

Branca `style/anti-vibecoded` des de `main`, i PR contra `main` (el CLAUDE.md del projecte diu que mai es fa push directe a main).

1. `style: drop radial glow behind home hero and unit opener` (troballa 1)
2. `style: turn transversal strip into an editorial list` (troballa 2, versió que triïs)
3. `style: use terra-ink for small terra text to meet WCAG AA` (troballa 4)
4. `refactor(copy): home lede and LOMLOE note in first person plural` (troballa 3, ES + CA)

Com que no hi ha decisions noves de paleta ni tipografia (tot reutilitza tokens existents),
`docs/design-system.md` només rebria una línia a «Fora» («taques `radial-gradient` decoratives darrere de hero/opener»)
i una a «Rol dels accents» («text petit terracota → `--color-terra-ink`»). El projecte usa `docs/design-system.md`
com a guia d'estil, així que no cree un `documents/styleguide.md` duplicat.

## Decisions que necessite de tu

1. Troballa 2: llista editorial completa, o només traure el cercle de lletra?
2. Troballa 3: et va bé el plural, o la primera persona de la home és volguda?
3. Alguna troballa que vulgues descartar?
