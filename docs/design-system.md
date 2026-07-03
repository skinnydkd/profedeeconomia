# Design system — profedeeconomia.es

Convencions de components i regles visuals. La **paleta i la tipografia validades** viuen a `CLAUDE.md` (secció «Direcció estètica»); ací no es dupliquen, només s'hi remet.

Direcció: **editorial sòbria amb to proper** (Princeton/MIT/Stripe Press, Apartamento, MUBI Notebook). Variant C «editorial amb energia», validada 2026-05-10.

## Referència ràpida de tokens

Definits a `src/styles/global.css` (`:root`). No hardcodejar hex; usar sempre les variables.

- Fons: `--color-bg` (cream), `--color-paper`, `--color-bg-soft`, `--color-bg-cream`
- Tinta: `--color-ink` · `--color-ink-soft` · `--color-ink-mute`
- Línia: `--color-line` · `--color-line-soft`
- Accents: `--color-terra` (+`-deep`/`-soft`) · `--color-mustard`/`--color-mostassa` (+`-deep`/`-soft`)
- Color-coding per assignatura: `--color-{edmn|eco1|eco4|fopp|…}` i, dins d'un context de família, `--fam-ink` / `--card-color`
- Fonts: `--font-serif` (Fraunces, títols) · `--font-sans` (Switzer, cos) · `--font-mono` (JetBrains Mono, meta)

> **Gotcha Tailwind 4**: fa tree-shaking de les variables `@theme` no referenciades → les `--color-*-ink` de color-coding s'han de redeclarar al `:root` de `global.css` o eixen buides al runtime. No revertir això.

## Rol dels accents

- **Terracota** = accent **funcional**: links, CTAs, drop cap, i **regles editorials horitzontals** (`<hr>` i la ratlla superior alternant sobre `<h2>`).
- **Mostassa** = **decoratiu**: bullets, dashes, *italics* ornamentals, regla superior sobre `<h2>` alternant amb terracota.
- El color mai és l'únic portador d'informació funcional: sempre acompanyat de text/etiqueta.

## Regla de de-slop (VINCULANT)

Arran d'una crítica pública (juliol 2026), s'elimina tot el que llegia com a «AI slop». Aquestes regles són canòniques fins que Pau diga el contrari.

### Fora

1. **Eyebrow/kicker decoratiu amb `✱` damunt d'un `<h1>`.** La personalitat del títol la posa Fraunces. Si l'eyebrow portava color de secció/família, es mou al **títol** (o al `<h2>` de família), no es perd el color-coding.
2. **Ratlla d'accent en un sol costat de caixes/callouts** — `border-left`/`border-top` de color amb radi asimètric (`0 N N 0`). Aquest era el *tell* de la crítica.
   - Es manté la caixa: **vora simètrica 1px `var(--color-line)`** i **radi simètric** (`N`, no `0 N N 0`).
   - En callouts es manté el **fons tint + etiqueta de color** (diferencien el tipus); només se'n va la ratlla.
3. **Chips en píndola decoratius** → línia de text sòbria amb `·` (middot) mostassa.
4. **Estels/símbols decoratius** `✱ ★ §` com a ornament (la numeració `§` real de seccions del llibre sí que es manté).

### Es manté (NO és slop)

- **`blockquote` / pull-quotes** amb regla esquerra — convenció editorial clàssica.
- **Regles horitzontals** `<hr>`-style en accent (divisors, ratlla sobre `<h2>`, separador de secció).
- **Vores neutres** `var(--color-line)` / `--color-line-soft` (divisors, separadors de graella, rails de timeline).
- **Micro-etiquetes de categoria de targeta** `card__eyebrow` (uppercase, `var(--fam-ink)`) — house style consistent a tots els hubs.
- **Color-coding funcional multi-valor**: quan 2-3 colors distints codifiquen categories/estats reals (p. ex. nivells de logro, principis DUA). Si venia com a ratlla lateral, es passa a **vora sencera** (`border-color`), no d'un sol costat.
- **Badges** de text («Próximamente», «Práctica»/«Oficial»), filtres interactius, divisors `dashed`/1px.
- **Fulls d'estil d'impressió** (`*/imprimir*`, plantilles PDF): fora d'abast d'aquesta passada.

### Patró de transformació

```css
/* Abans (slop) */
.callout { background: var(--color-terra-soft); border-left: 4px solid var(--color-terra); border-radius: 0 6px 6px 0; }
/* Després */
.callout { background: var(--color-terra-soft); border-radius: 6px; }

/* Estat funcional: color a la vora SENCERA, no lateral */
.metric      { border: 1px solid var(--color-line); }
.metric--ok  { border-color: #4F8C3F; }   /* no border-left-color */
.metric--fail{ border-color: #B83A3A; }
```

## Convencions generals de components

- Astro per defecte; Preact només quan cal interactivitat (illes).
- Espai blanc generós; una sola columna per al contingut llarg; cos ≥ 1.125rem, interlineat 1.7.
- Cap emoji pictogràfic al contingut; sí símbols tipogràfics (`→ × — ·`).
- Microinteraccions polides (hover: elevació suau + `box-shadow`), no efectes cridaners.
