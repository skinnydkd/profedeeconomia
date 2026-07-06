# Disseny — Traducció VAL/CA · Fase 1: esquelet bilingüe

- **Data**: 2026-07-06
- **Autor**: Pau Monterde (+ Claude Code)
- **Estat**: aprovat (disseny), pendent de pla d'implementació
- **Varietat lingüística**: valencià (norma AVL)

## Context

`profedeeconomia.es` publica només castellà (`es`) al MVP. El model de dades i18n ja
existeix —les 22 col·leccions de contingut declaren `lang: z.enum(['es','ca'])— però
**tota la fontaneria d'i18n està per fer** i el routing `ca` està desactivat a
`astro.config.mjs` (`locales: ['es']`).

Pau vol començar la traducció al valencià de tot el web i tots els materials. És un
**programa multi-fase**, no una tasca: només els llibres són ~503.800 paraules (88
unitats), més 428 MDX de contingut, 79 pàgines `.astro`, 179 registres `.ts` i 1.079
PDFs. Tot el que es publica passa revisió manual de Pau, cosa que fa inviable traduir
i revisar mig milió de paraules d'una tacada.

**Decisió estratègica**: atacar-ho per capes, començant per un **esquelet bilingüe**.
Aquest document especifica NOMÉS la fase 1. Cada fase posterior (contingut transversal,
llibres, PDFs/diapositives) tindrà el seu propi spec.

## Objectiu de la fase 1

Que el web siga **navegable en valencià** —marc, navegació, pàgines d'UI i landings en
VAL— mentre el contingut educatiu (llibres, hubs, MDX, PDFs) es queda en castellà via
fallback fins que es traduïsca en fases posteriors.

## Abast

### Dins
- Infra i18n: reactivar routing `ca` amb fallback a `es`.
- Xrome traduït: `SiteHeader`, `SiteFooter`, `BaseLayout` (skip-link, `og:locale`).
- Diccionari d'strings d'UI + helper `t()`.
- Strings *facing* de `src/lib/asignaturas.ts` i `src/lib/seo.ts` (i `faq.ts` en deriva).
- ~10 pàgines pures d'UI + els intros de 7 hubs.
- Switcher d'idioma ES/VAL.
- `hreflang` + `canonical` correctes.

### Fora (fallback a ES; fases posteriors)
- 88 unitats de llibre i tot el MDX de contingut.
- 50 hubs de contingut per assignatura/secció (targetes i detalls).
- 1.079 PDFs (llibres, quaderns, diapositives) i EBAU oficials (aquests **mai** es tradueixen: són documents font).
- Strings interns de les illes de jocs (Preact).

## Arquitectura

### Routing
`astro.config.mjs`:
```js
i18n: {
  defaultLocale: 'es',
  locales: ['es', 'ca'],
  routing: { prefixDefaultLocale: false, redirectToDefaultLocale: false },
  fallback: { ca: 'es' },
  fallbackType: 'rewrite',
}
```
Resultat: ES a l'arrel (`/sobre`), VAL sota `/ca/*` (`/ca/sobre`). El contingut sense
versió `ca` es reescriu (no redirigeix) servint el cos ES sota la URL `/ca/*`.

### Diccionari i detecció de locale
- `src/i18n/ui.ts`: `export const ui = { es: {...}, ca: {...} }` amb les claus de xrome,
  i `export function t(key, locale)`.
- `src/i18n/locale.ts`: `export function getLocale(url): 'es' | 'ca'` que llig el prefix
  `/ca/` del pathname. **Font de veritat del locale**, per no dependre del comportament
  d'`Astro.currentLocale` sota fallback rewrite (vegeu Riscos).
- Les pàgines i components de xrome resolen strings amb `t(key, getLocale(Astro.url))`.
- **Single-source**: cap pàgina es duplica a `/ca/`; la mateixa `.astro` serveix els dos
  idiomes triant strings del diccionari segons el locale.

### Contingut no traduït sota `/ca/`
Xrome en valencià, cos en castellà, correcte per a SEO:
- `<html lang="ca">` (marc valencià) — `BaseLayout` fixa `lang` amb `getLocale(Astro.url)` (no amb `Astro.currentLocale`, per coherència amb la resta del xrome i el risc del fallback rewrite).
- Contenidor del cos amb `lang="es"` quan el contingut és fallback ES. Controlat per un
  prop `contentLang` als layouts de contingut (per defecte `'es'` a la fase 1).
- `canonical` de `/ca/[no-traduït]` → versió ES (`/[...]`). Sense duplicats per a Google.
- `hreflang`: `BaseLayout` emet `alternate` per a `es`, `ca` i `x-default` (→ ES). A les
  pàgines de xrome traduïdes, `canonical` és self.

### Switcher d'idioma
Toggle **ES / VAL** al `SiteHeader` (espill al `SiteFooter`). Conserva la ruta: de
`/sobre` a `/ca/sobre` i viceversa, construint la URL amb `getLocale` + prefix. En
pàgines de contingut fallback porta al mateix path a l'altre idioma (existeix pel
fallback).

## Inventari de traducció (fase 1)

| Peça | Fitxers |
|---|---|
| Xrome | `src/components/SiteHeader.astro`, `src/components/SiteFooter.astro`, `src/layouts/BaseLayout.astro` (skip-link, `og:locale`) |
| Registre nav/home | strings *facing* de `src/lib/asignaturas.ts` (label/title/description/tagline/level/marcoNormativo) + `src/lib/seo.ts` (`locale`, meta per defecte); `src/lib/faq.ts` en deriva |
| Pàgines pures UI (~10) | `index.astro`, `sobre.astro`, `contacto.astro`, `404.astro`, `legal/aviso-legal.astro`, `legal/privacidad.astro`, `juegos/business-game/index.astro`, `jocs-economics/index.astro`, `emprendimiento/entrevista-emprendedores/index.astro` (+ `imprimir.astro`) |
| Intros de 7 hubs | `olimpiada/index`, `olimpiada/simulacros/index`, `olimpiada/lecturas/index`, `olimpiada/banco/index`, `juegos/index`, `generadores/index`, `herramientas/index` (només l'intro editorial; les targetes queden ES) |

Volum estimat: ~4-6k paraules.

## Mètode de traducció i revisió
Claude tradueix a valencià AVL; **Pau revisa abans del merge**. Res d'auto-publish.

## Riscos

1. **Astro `fallbackType: 'rewrite'`** — incert si genera `/ca/*` per a TOTES les pàgines
   de contingut i quin valor pren `currentLocale`. **Mitigació**: primera tasca del pla
   és un *spike* que activa la infra amb una pàgina i verifica generació + render de
   `/ca/sobre` (traduïda) i `/ca/edmn-2bach/libro/[u]` (fallback). Pla B si el fallback
   no cobreix tot: middleware que fixa el locale des del prefix d'URL. La detecció via
   `getLocale(Astro.url)` ja fa el codi robust enfront del comportament de `currentLocale`.
2. **SEO de pàgines fallback** — mitigat amb `canonical`→ES i `hreflang` correctes.
3. **Deriva d'strings** — pàgines de contingut noves poden afegir strings de xrome sense
   clau al diccionari; la revisió i el build ho han de detectar.

## Verificació (checklist executable en local)
- `astro build` sense errors.
- `/sobre` intacte en castellà.
- `/ca/sobre` en valencià complet (xrome + cos).
- `/ca/edmn-2bach/libro/[u]`: xrome VAL + `<article lang="es">` + `canonical`→ES.
- Switcher round-trip `/sobre` ↔ `/ca/sobre` i en una pàgina de contingut.
- `hreflang` (`es`/`ca`/`x-default`) presents i coherents a les dues versions.

## Fora d'abast d'aquesta fase (fases futures)
- Traducció del contingut MDX (transversals → llibres).
- Regeneració de PDFs i diapositives en valencià.
- Traducció de les illes de jocs.
