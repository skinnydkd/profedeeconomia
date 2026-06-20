# Eyebrow/kicker contrast — AA-safe accent text (`-ink`)

- **Date**: 2026-06-20
- **Status**: design approved (brainstorm), pre-implementation
- **Author**: Pau + Claude
- **Relates to**: PR #167 (a11y pass), `project_a11y_pass` memory — this resolves the deferred "colored eyebrow contrast" item.

## Problem

Colored eyebrow / kicker / label text (small, uppercase, in an accent color) fails
WCAG AA contrast (4.5:1 for small text). Measured ~3–4:1 on cream `#FBF6EC` and on
the accent soft tints. The pattern is **site-wide**, not just libro/deck: slides,
libro asides, and the transversal hubs all render accent-colored eyebrows.

Constraint: the Variant C palette is validated. We must reach AA **without flattening
the brand color pop**.

## Decisions (from brainstorm, 2026-06-20)

1. **Lever**: darken the *text* (not the backgrounds, not enlarge to "large text").
2. **Mustard**: accept a dark goldenrod for mustard *text*; the vivid yellow stays for
   decorative use (bullets, dashes, rules, `::before` marks).
3. **Scope**: site-wide, all 9 subject colors.

## Design

### 1. New text tokens — `--color-{X}-ink` (global.css)

For each subject color, `-ink` = the darkest value that clears AA (target ≥4.6:1) on
the color's own soft tint (the hardest background — it auto-passes on the lighter
cream). Computed via HSL lightness reduction (hue/saturation preserved):

| Subject | base | base/soft | `-ink` | ink/soft | ink/cream | new? |
|---|---|---|---|---|---|---|
| edmn (terracota) | `#C44E2C` | 3.81 ✗ | `#9C3A1C` (= existing `terra-deep`) | 5.8 | 6.4 | reuse |
| eco1 (teal) | `#1F6E6E` | 4.94 ✓ | `#1F6E6E` (base) | 4.94 | 5.55 | no |
| eco4 (mostassa) | `#D4A24C` | 1.85 ✗ | **`#835F20`** | 4.64 | 5.38 | NEW |
| fopp (berenjena) | `#5B3A4E` | 7.38 ✓ | `#5B3A4E` (base) | 7.38 | 9.03 | no |
| taller3 (oliva) | `#6B8E23` | 3.12 ✗ | **`#546F1B`** | 4.68 | 5.30 | NEW |
| ipe1 (blau pissarra) | `#4A6FA5` | 4.02 ✗ | **`#446697`** | 4.62 | 5.46 | NEW |
| ipe2 (blau profund) | `#2F4F7F` | 6.08 ✓ | `#2F4F7F` (base) | 6.08 | 7.66 | no |
| eeae (verd pi) | `#2E5E3A` | 5.87 ✓ | `#2E5E3A` (base) | 5.87 | 7.02 | no |
| gpe (granate) | `#8C2F39` | 6.13 ✓ | `#8C2F39` (base) | 6.13 | 7.55 | no |

Only **3 genuinely new hues** (mostassa, oliva, blau-pissarra). terracota reuses its
existing `-deep`; the other 5 already pass as base. Define `--color-{X}-ink` for **all 9**
(5 alias base, 1 aliases deep, 3 new) so threading is uniform.

### 2. Threading — `--accent-ink`

Wherever `--accent` is set, also set `--accent-ink: var(--color-{X}-ink)`:
- `src/styles/slides.css` — the default `.slide` rule + each `[data-asig] .slide` block.
- `src/pages/[asignatura]/proyecto/*.astro` — the inline `style="--accent: …"` (add `--accent-ink`).

### 3. Swap — TEXT color only

Change the `color:` of eyebrow/kicker/label text rules to the matching `-ink` token.
**Leave decorative accent usage untouched** (rules, borders, fills, drop cap, s-data
panel background, `::before` "✱", link underlines).

Known change sites (implementation greps exhaustively for `*__kicker / *__label /
*__eyebrow / .kicker / .pull / slide__eyebrow / unit-num` colored-text rules):

- **slides.css**: `.slide__eyebrow`, `.s-concept .pull` → `var(--accent-ink)`.
- **libro asides**:
  - `.recursos__cajut-kicker` — uses `--color-terra` (base) → `--color-terra-ink`.
  - `.tldr__kicker`, `.callout--example .label` — use `--color-mustard-deep` (fails) → `--color-mustard-ink`.
  - `.curiosity__label`, `.mirar-fora__kicker`, `.unit-num` — to their matching `-ink` (confirm per-component color during impl).
  - `.takeaways--warning .takeaways__label` (terra-deep = terra-ink, OK); `.takeaways--checklist` uses hardcoded `#2A5A1F` — verify ≥4.5:1, adjust only if it fails.
  - Already-AA kickers (`pista-ebau__kicker`, `vuelve__kicker`, `caso__kicker` on `terra-deep`) need no value change.
- **hubs** (debates / dinámicas / herramientas / emprendimiento): `.kicker` and
  `.card__eyebrow` — inline `color: var(--color-${family})` → `var(--color-${family}-ink)`.
- **proyecto**: kickers under `--accent` → `var(--accent-ink)`.

## Non-goals

- No background changes, no font-size changes, no change to decorative accent usage.
- Not touching the print stylesheets' palette (PDF generation is separate; revisit only if PDFs regress).

## Verification

- Lighthouse mobile on home, a libro unit, the deck, and one hub (e.g. `/debates`):
  the `color-contrast` audit clears for these elements.
- Computed-contrast spot check (chrome-devtools `evaluate_script`) on the light-hue
  eyebrows (mostassa / oliva / blau-pissarra) ≥4.5:1.

## Risk

The `-ink` for mostassa / oliva / blau-pissarra is visibly darker than base — intended
and approved. Decorative usages keep the vivid hue, so the palette's energy is preserved.
