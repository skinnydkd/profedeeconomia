# Disseny — Traducció VAL/CA · Fase 2A: targetes dels hubs (contingut en codi)

- **Data**: 2026-07-08
- **Autor**: Pau Monterde (+ Claude Code)
- **Estat**: aprovat (disseny), pendent de pla d'implementació
- **Varietat lingüística**: valencià (norma AVL)
- **Fase prèvia**: Fase 1 (esquelet bilingüe) — spec `2026-07-06-ca-translation-fase1-skeleton-design.md`, en producció (PR #190/#191/#192)

## Context

La Fase 1 va deixar el web navegable en valencià: marc, navegació, pàgines d'UI, intros
de hubs i persistència d'idioma en navegar (sticky). Però **les targetes dels hubs
segueixen en castellà sota `/ca`** perquè el seu text no viu a les pàgines traduïdes sinó
en registres `.ts`, en arrays inline dins dels `.astro`, o en frontmatter d'MDX.

Aquesta fase tradueix **les targetes el text de les quals viu en codi** (registres +
inline + strings d'UI reutilitzables). Les targetes que són fitxes de contingut
(frontmatter MDX de debats/dinàmiques/projectes) es queden en ES i s'ataquen a la fase de
contingut.

## Objectiu

Que sota `/ca/*` totes les targetes de hub el text de les quals viu en codi es mostren en
valencià, reutilitzant els patrons ja establerts a la Fase 1 (overlay estil
`asignaturas-ca.ts`, copy `{es,ca}[locale]`, claus `t()`), amb fallback net a ES per a la
resta.

## Abast

### Dins
1. **Overlays de registre** (mirall d'`asignaturas-ca.ts`):
   - `JUEGOS` (`src/lib/juegos.ts`, 6): `title`, `descripcion`, `nota_aula`, `modo`.
   - `HERRAMIENTAS` (`src/lib/herramientas.ts`, 22): `title`, `descripcion`.
   - `GENERADORES_EXTERNOS` (2) + `GENERADORES_NATIVOS` (6) (`src/lib/generadores.ts`):
     `eyebrow`, `title`, `descripcion`, `comoUsar`.
   - Capçaleres de família (tipus compartit `Familia = {slug,label,intro,colorVar}`,
     `src/lib/familia-grouping.ts`) — camps `label`, `intro` — dels registres:
     `FAMILIAS_DEBATE` (6), `FAMILIAS` dinàmiques (7), `MATERIAS` projectes (7),
     `FAMILIAS_HERRAMIENTA` (6), `BLOQUES` olimpiada (12), `AMBITOS` olimpiada (11).
   - `ITINERARIOS` (`src/lib/emprendimiento.ts`, 3): `label`, `descripcion`.
   - `GUIA` (`src/lib/olimpiada.ts`, 3 parts): `nombre`, `puntos`, `descripcion`, `duracion`, `total`.
2. **Copy inline `{es,ca}[locale]`** (patró Fase 1) a les pàgines amb targetes inline:
   - `src/pages/emprendimiento/index.astro` (no té copy encara): feature card «De cero a
     empresa», targeta EDMN + descripcions, 3 targetes de recursos, encapçalaments.
   - `src/pages/olimpiada/index.astro`: array inline `subAreas` (5) + títols de secció.
   - `src/pages/[asignatura]/index.astro`: arrays `material`/`interactivo`/`profe` (~12
     items `{title,desc}`) + labels/descs de grup + targeta cross-link a Olimpiada.
3. **Strings d'UI reutilitzables → claus `t()`** (`src/i18n/ui.ts`):
   - Eyebrows/estats: «Disponible», «Próximamente», «· Multijugador», «Olimpiada».
   - CTAs: «Jugar →», «Abrir sala (proyector) →», «Abrir →», «Abrir en
     oposicioneseconomia.es →».
   - Títols/labels: «Generadores LOMLOE», grups natius («Evaluación», «Atención y aula»),
     mapes `NIVEL_LABEL` i `TIPO_LABEL` (juegos/herramientas/generadores/proyectos).
4. **Fix d'un buit de la Fase 1**: `src/pages/[asignatura]/index.astro` importa
   `ASIGNATURAS` directament i **no** crida `localizeAsignatura`, així que el hero (títol +
   tagline) surt en ES sota `/ca`. Embolcallar amb `localizeAsignatura(a, locale)`.

### Fora (fallback a ES; fase de contingut)
- Targetes individuals de debats (~18), dinàmiques (~25), projectes (~18): el `title` i la
  `descripcion` viuen al frontmatter MDX i **són** la fitxa de contingut. Les seues
  **capçaleres de família sí** que van a VAL (punt 1). Els cossos i les targetes queden ES.
- Simulacres d'olimpiada com a documents (PDF/oficials): no es tradueixen.
- Tot el que ja quedava fora a la Fase 1 (unitats de llibre, PDFs, illes de jocs Preact).

## Arquitectura

### Overlays de registre
Mirall exacte d'`asignaturas-ca.ts`:
```ts
// e.g. src/i18n/juegos-ca.ts
type JuegoCA = Partial<Pick<Juego, 'title' | 'descripcion' | 'nota_aula' | 'modo'>>;
export const JUEGOS_CA: Partial<Record<string, JuegoCA>> = { /* keyed by slug */ };
export function localizeJuego(j: Juego, locale: Locale): Juego {
  return locale === 'es' ? j : { ...j, ...JUEGOS_CA[j.slug] };
}
```
Un fitxer d'overlay per domini (`juegos-ca.ts`, `herramientas-ca.ts`, `generadores-ca.ts`,
`familias-ca.ts`, `olimpiada-ca.ts`, `emprendimiento-ca.ts`) perquè Pau revise per seccions.

**Famílies — evitar col·lisió de slugs**: els slugs de `Familia` es repeteixen entre
registres (p.ex. una família d'un registre i d'un altre poden compartir slug amb sentit
distint). Per tant **un overlay per registre de família** (`FAMILIAS_DEBATE_CA`,
`FAMILIAS_DINAMICAS_CA`, …) i un únic helper genèric:
```ts
export function localizeFamilias(list: Familia[], overlay: Partial<Record<string, Pick<Familia,'label'|'intro'>>>, locale: Locale): Familia[] {
  return locale === 'es' ? list : list.map((f) => ({ ...f, ...overlay[f.slug] }));
}
```

### Copy inline
Idèntic a la Fase 1: `const locale = getLocale(Astro.currentLocale);` +
`const copy = { es: {...}, ca: {...} }[locale];`. `copy.es` i `copy.ca` han de tindre el
mateix conjunt de claus (test de paritat). Les pàgines amb targetes inline passen a
`contentLang={locale}` si tot el seu cos passa a VAL; les que barregen (hub d'assignatura,
que enllaça a sub-índexs ES) mantenen la lògica de `contentLang` de la Fase 1.

### Claus `t()`
S'afegeixen a `ui.ts` sota `ui = { es:{...}, ca:{...} }`, amb el test de paritat de claus
existent cobrint-les. Els mapes `NIVEL_LABEL`/`TIPO_LABEL` inline passen a derivar-se de
`t()` (o a un overlay si són servits fora d'un context amb locale).

## Inventari (Fase 2A)

| Peça | Font | Fitxers | Camps VAL |
|---|---|---|---|
| Jocs | registre | `src/lib/juegos.ts` → `src/i18n/juegos-ca.ts` | title, descripcion, nota_aula, modo |
| Ferramentes | registre | `src/lib/herramientas.ts` → `herramientas-ca.ts` | title, descripcion |
| Generadors | registre | `src/lib/generadores.ts` → `generadores-ca.ts` | eyebrow, title, descripcion, comoUsar |
| Famílies (×5 registres) | registre | debates/dinamicas/proyectos/herramientas/olimpiada → `familias-ca.ts` | label, intro |
| Itineraris | registre | `src/lib/emprendimiento.ts` → `emprendimiento-ca.ts` | label, descripcion |
| Guia olimpiada | registre | `src/lib/olimpiada.ts` → `olimpiada-ca.ts` | nombre, puntos, descripcion, duracion, total |
| Sub-àrees olimpiada | inline | `olimpiada/index.astro` | title, desc, títols secció |
| Hub emprendiment | inline | `emprendimiento/index.astro` | feature/EDMN/recursos cards + headings |
| Targetes hub assignatura | inline | `[asignatura]/index.astro` | material/interactivo/profe + grups + cross-link |
| Eyebrows/CTAs/labels | `t()` | `ui.ts` + hubs | vore punt 3 |
| Fix hero assignatura | codi | `[asignatura]/index.astro` | localizeAsignatura |

Volum estimat de revisió: ~100 strings curts.

## Mètode de traducció i revisió
Claude tradueix a valencià AVL; **Pau revisa** (per domini/fitxer). Res d'auto-publish.
Coherència de glossari amb la Fase 1 (p.ex. «ferramentes», no «eines»).

## Riscos
1. **Col·lisió de slugs entre registres de família** — mitigat amb un overlay per registre
   (no un de global). El pla ho fa explícit.
2. **Deriva de claus** — copy inline i `t()` poden divergir es/ca; els tests de paritat
   (un per overlay + el de `ui.ts`) ho detecten, com a la Fase 1.
3. **Targetes VAL que enllacen a pàgines ES** — acceptable i coherent amb el fallback de la
   Fase 1 (marc VAL, contingut ES). No és un risc nou.
4. **Build de producció local** — l'entorn mata els builds llargs en background; el gate
   autoritatiu és la preview de Vercel del PR (com a la sessió de la Fase 1).

## Verificació (checklist)
- `astro check` sense errors nous.
- Test de paritat de claus per cada overlay nou (`*-ca.test.ts`) i per les claus noves de
  `ui.ts`.
- Test de guarda: cada registre té overlay per a tots els seus slugs publicats (mirall del
  guard d'`asignaturas-ca.test.ts`).
- Sota `/ca`: jocs, ferramentes, generadors, capçaleres de família, sub-àrees d'olimpiada,
  hub d'emprendiment i targetes de secció dels hubs d'assignatura en VAL; hero d'assignatura
  en VAL.
- `/[asignatura]/` en ES intacte.
- Preview de Vercel construeix sense errors.

## Fora d'abast d'aquesta fase (fases futures)
- Frontmatter MDX de debats/dinàmiques/projectes (fase de contingut).
- Cos de les unitats de llibre, PDFs/diapositives en VAL, illes de jocs Preact,
  `inLanguage` dels JSON-LD.
