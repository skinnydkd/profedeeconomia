# CA Translation · Fase 1 (esquelet bilingüe) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fer `profedeeconomia.es` navegable en valencià (marc, navegació, pàgines d'UI i landings) mentre tot el contingut educatiu (llibres, hubs, MDX, PDFs) cau a castellà via fallback.

**Architecture:** Reactivem el routing `ca` d'Astro amb `fallback: { ca: 'es' }` + `routing.fallbackType: 'rewrite'`. El locale actiu es deriva d'**`Astro.currentLocale`** amb un helper propi `getLocale(currentLocale)`. **[Resolt pel spike de la Task 1]** Sota `fallbackType: 'rewrite'` en build estàtic, Astro actualitza correctament `Astro.currentLocale` a `'ca'` a les pàgines `/ca/*` reescrites, però NO actualitza `Astro.url.pathname` (que es queda al path per defecte, sense prefix `/ca`). Per això la font de veritat del locale és `Astro.currentLocale`, no la URL. Els components de xrome i les pàgines d'UI trien strings d'un diccionari `t(key, locale)` segons el locale. **Single-source**: cap pàgina es duplica a `/ca/`; el fallback rewrite re-renderitza cada pàgina sota `/ca/...` amb `currentLocale='ca'` i el codi tria el text per eixe locale. Com que `Astro.url.pathname` ja ve sense prefix a totes les pàgines, serveix directament de path base per a canonical/hreflang. El contingut sense traduir es renderitza en castellà amb `<main lang="es">`, `canonical` cap a la versió ES i `hreflang` correctes. Sortida estàtica: el lloc es genera a `dist/client/` (adaptador Vercel).

**Tech Stack:** Astro 5, TypeScript estricte, Vitest 4 (`npm test`), Tailwind 4. Sense dependències noves.

## Global Constraints

- **Varietat lingüística: valencià, norma AVL.** Usar el glossari d'aquest pla per a consistència.
- **TypeScript estricte, sense `any`.**
- **Comentaris i noms de codi en anglès**; strings d'UI en castellà (ES) i valencià (CA).
- **Conventional Commits**; commits freqüents (un per tasca com a mínim).
- **Mai push directe a `main`.** Tot el treball a la branca `feat/ca-translation-fase1`.
- **Tot text VAL nou és contingut editorial i ha de passar la revisió de Pau abans del merge.** Res d'auto-publish.
- **Cap emoji pictogràfic** al contingut; sí símbols tipogràfics (→ × —). Accents/dièresis sempre correctes.
- **Single source of truth**: no duplicar fitxers de pàgina per idioma.
- **Contingut fora d'abast (fallback a ES):** 88 llibres, tot el MDX, 50 hubs de contingut, 1.079 PDFs, EBAU oficials, illes de jocs Preact.

## Glossari VAL (AVL) — usar sempre aquests equivalents

| ES | VAL (AVL) |
|---|---|
| profesorado / profesores | professorat |
| economía | economia |
| Comunidad Valenciana | Comunitat Valenciana |
| material editorial para profesores de instituto | material editorial per a professorat d'institut |
| Saltar al contenido principal | Salta al contingut principal |
| Navegación principal | Navegació principal |
| Sobre el proyecto | Sobre el projecte |
| Contacto | Contacte |
| Aviso legal | Avís legal |
| Privacidad | Privacitat |
| Próximamente | Pròximament |
| Preparación | Preparació |
| Olimpiada de Economía | Olimpíada d'Economia |
| Otros | Altres |
| Juegos | Jocs |
| Juegos Económicos | Jocs Econòmics |
| Herramientas | Ferramentes |
| Herramientas Docentes | Ferramentes Docents |
| Dinámicas | Dinàmiques |
| Emprendimiento | Emprenedoria |
| Proyectos interdisciplinares | Projectes interdisciplinaris |
| Debates | Debats |
| Oposiciones | Oposicions |
| Itinerario Personal para la Empleabilidad | Itinerari Personal per a l'Ocupabilitat |
| 3.º ESO / 4.º ESO | 3r ESO / 4t ESO |
| 1.º Bach / 2.º Bach | 1r Batx / 2n Batx |
| Optativas (1.º/2.º) | Optatives (1r/2n) |
| Grado Medio y Superior | Grau Mitjà i Superior |
| Modalidad Humanidades y CC. Sociales | Modalitat Humanitats i CC. Socials |
| Modalidad General | Modalitat General |
| Real Decreto | Reial Decret |

Títols oficials d'assignatura (VAL; Pau els contrasta amb el DOGV en la revisió):
- Empresa y Diseño de Modelos de Negocio → **Empresa i Disseny de Models de Negoci**
- Economía → **Economia**
- Economía y Emprendimiento → **Economia i Emprenedoria**
- Formación y Orientación Personal y Profesional → **Formació i Orientació Personal i Professional**
- Taller de Economía → **Taller d'Economia**
- Itinerario Personal para la Empleabilidad I / II → **Itinerari Personal per a l'Ocupabilitat I / II**
- Economía, Emprendimiento y Actividad Empresarial → **Economia, Emprenedoria i Activitat Empresarial**
- Gestión de Proyectos de Emprendimiento → **Gestió de Projectes d'Emprenedoria**

---

## PART A — Infraestructura i18n

Aquesta part produeix un web bilingüe navegable (xrome en VAL, contingut en fallback ES) encara **abans** de traduir les pàgines editorials. És mergejable per si sola.

### Task 1: Locale helper + activar routing `ca` + spike de verificació

**Files:**
- Create: `src/i18n/locale.ts`
- Create: `src/i18n/locale.test.ts`
- Modify: `astro.config.mjs:86-93` (bloc `i18n`)

**Interfaces:**
- Produces:
  - `LOCALES: readonly ['es','ca']`
  - `type Locale = 'es' | 'ca'`
  - `DEFAULT_LOCALE: 'es'`
  - `getLocale(currentLocale: string | undefined): Locale` — `'ca'` si `currentLocale === 'ca'`, si no `'es'`. **Font: `Astro.currentLocale`** (que el fallback rewrite SÍ actualitza), NO `Astro.url`.
  - `stripLocalePrefix(pathname: string): string` — lleva el prefix `/ca`, retornant sempre un path que comença per `/` (p.ex. `/ca/sobre/` → `/sobre/`, `/ca` → `/`). Defensiu: a la pràctica `Astro.url.pathname` ja ve sense prefix, però el mantenim per robustesa.
  - `localizePath(pathname: string, locale: Locale): string` — pren un path SENSE prefix i afig `/ca` si `locale==='ca'`.
  - `switchLocalePath(pathname: string, target: Locale): string` — donat el path actual (amb o sense prefix), retorna el mateix path en `target`.

- [ ] **Step 1: Write the failing test**

```ts
// src/i18n/locale.test.ts
import { describe, it, expect } from 'vitest';
import { getLocale, stripLocalePrefix, localizePath, switchLocalePath } from './locale';

describe('getLocale', () => {
  it('reads ca from Astro.currentLocale', () => {
    expect(getLocale('ca')).toBe('ca');
  });
  it('defaults to es for es / undefined / unknown', () => {
    expect(getLocale('es')).toBe('es');
    expect(getLocale(undefined)).toBe('es');
    expect(getLocale('en')).toBe('es');
  });
});

describe('stripLocalePrefix', () => {
  it('removes /ca and keeps leading slash', () => {
    expect(stripLocalePrefix('/ca/sobre/')).toBe('/sobre/');
    expect(stripLocalePrefix('/ca')).toBe('/');
    expect(stripLocalePrefix('/ca/')).toBe('/');
  });
  it('leaves es paths untouched', () => {
    expect(stripLocalePrefix('/sobre/')).toBe('/sobre/');
    expect(stripLocalePrefix('/')).toBe('/');
  });
});

describe('localizePath', () => {
  it('prefixes for ca, leaves es', () => {
    expect(localizePath('/sobre/', 'ca')).toBe('/ca/sobre/');
    expect(localizePath('/sobre/', 'es')).toBe('/sobre/');
    expect(localizePath('/', 'ca')).toBe('/ca/');
  });
});

describe('switchLocalePath', () => {
  it('round-trips es<->ca on the same page', () => {
    expect(switchLocalePath('/sobre/', 'ca')).toBe('/ca/sobre/');
    expect(switchLocalePath('/ca/sobre/', 'es')).toBe('/sobre/');
    expect(switchLocalePath('/ca/edmn-2bach/libro/1/', 'es')).toBe('/edmn-2bach/libro/1/');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/i18n/locale.test.ts`
Expected: FAIL — `Failed to resolve import "./locale"`.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/i18n/locale.ts
export const LOCALES = ['es', 'ca'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'es';

/**
 * Active locale from Astro.currentLocale. Under fallbackType 'rewrite' Astro
 * updates currentLocale to 'ca' on rewritten /ca/* pages (but NOT Astro.url),
 * so this is the reliable source. Anything not 'ca' resolves to the default.
 */
export function getLocale(currentLocale: string | undefined): Locale {
  return currentLocale === 'ca' ? 'ca' : 'es';
}

/** Remove the `/ca` prefix; always returns a path starting with `/`. */
export function stripLocalePrefix(pathname: string): string {
  if (pathname === '/ca' || pathname === '/ca/') return '/';
  if (pathname.startsWith('/ca/')) return pathname.slice(3);
  return pathname;
}

/** Add the locale prefix to a locale-less path. */
export function localizePath(pathname: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return pathname;
  return pathname === '/' ? '/ca/' : `/ca${pathname}`;
}

/** Same page in the target locale, regardless of the input's current prefix. */
export function switchLocalePath(pathname: string, target: Locale): string {
  return localizePath(stripLocalePrefix(pathname), target);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/i18n/locale.test.ts`
Expected: PASS (todos els casos).

- [ ] **Step 5: Enable `ca` routing in the Astro config**

A `astro.config.mjs`, reemplaça el bloc `i18n` (línies ~86-93) per:

```js
  // i18n: Spanish is the default (root URLs); Valencian lives under /ca/*.
  // fallbackType 'rewrite' re-renders each page at its /ca/* URL so the shared
  // .astro picks CA copy by URL locale, while untranslated content falls back
  // to Spanish in place. See src/i18n/locale.ts (getLocale) for the resolver.
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'ca'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
      fallbackType: 'rewrite',
    },
    fallback: { ca: 'es' },
  },
```

- [ ] **Step 6: SPIKE — confirm the currentLocale resolver works (GATE)**

> Context: una passada anterior d'aquesta tasca ja va provar `getLocale(Astro.url)` i va donar `SPIKE-ES` a `/ca/sobre` (el rewrite NO actualitza `Astro.url`). Aquesta passada confirma que amb `Astro.currentLocale` el resultat és `SPIKE-CA`.

Temporalment, fes `src/pages/sobre.astro` conscient del locale. Al frontmatter, després dels imports, afig:

```astro
import { getLocale } from '@/i18n/locale';
const spikeLocale = getLocale(Astro.currentLocale);
```

I al principi del `<main>` (o just davall del `<h2>Quién lo hace</h2>`), afig un marcador:

```astro
<p data-spike>{spikeLocale === 'ca' ? 'SPIKE-CA' : 'SPIKE-ES'}</p>
```

Run: `npm run build` (triga uns minuts; corre el prebuild automàticament)
Després inspecciona (**nota: sortida a `dist/client/`**, no `dist/`):

```bash
grep -o 'SPIKE-[A-Z]*' dist/client/sobre/index.html
grep -o 'SPIKE-[A-Z]*' dist/client/ca/sobre/index.html
ls dist/client/ca/edmn-2bach/ 2>/dev/null && echo "CA content route generated"
```

**Resultat esperat (GATE OK):** `dist/client/sobre/index.html` → `SPIKE-ES`; `dist/client/ca/sobre/index.html` → `SPIKE-CA`; existeix `dist/client/ca/edmn-2bach/`. Confirma que `getLocale(Astro.currentLocale)` distingeix el locale a les pàgines fallback i el single-source funciona. **Continua.**

**Si `dist/client/ca/sobre/index.html` encara mostra `SPIKE-ES`** amb `Astro.currentLocale`: para i escala al controlador (`BLOCKED`) — seria un comportament d'Astro diferent del documentat al report de la Task 1, i cal repensar el mecanisme abans de seguir. NO improvises embolcalls `/ca/`.

- [ ] **Step 7: Revert the spike marker**

Lleva les 3 línies del spike de `src/pages/sobre.astro` (l'import, `spikeLocale` i el `<p data-spike>`). `sobre.astro` es tradueix de veritat a la Task 9. Confirma `git diff src/pages/sobre.astro` buit.

- [ ] **Step 8: Commit**

```bash
git add src/i18n/locale.ts src/i18n/locale.test.ts astro.config.mjs
git commit -m "feat(i18n): add locale resolver and enable ca routing with es fallback"
```

---

### Task 2: SEO resolver (canonical, hreflang, og:locale)

**Files:**
- Create: `src/i18n/seo-locale.ts`
- Create: `src/i18n/seo-locale.test.ts`

**Interfaces:**
- Consumes: `Locale`, `stripLocalePrefix`, `localizePath` de `src/i18n/locale.ts`.
- Produces:
  - `type ContentLang = Locale`
  - `resolveSeo(opts: { pathname: string; locale: Locale; contentLang: ContentLang; site: string }): { htmlLang: Locale; contentLangAttr: ContentLang | null; ogLocale: 'es_ES' | 'ca_ES'; canonical: string; alternates: { hreflang: string; href: string }[] }`
  - Regla `canonical`: si `contentLang === locale` → self; si no (ruta `/ca` amb cos ES) → la URL ES.
  - `contentLangAttr`: `null` quan `contentLang === htmlLang` (no cal atribut extra); si no, el codi del cos (p.ex. `'es'`) per posar-lo a `<main lang="es">`.
  - `alternates`: sempre `es`, `ca` i `x-default` (→ ES).

- [ ] **Step 1: Write the failing test**

```ts
// src/i18n/seo-locale.test.ts
import { describe, it, expect } from 'vitest';
import { resolveSeo } from './seo-locale';

const site = 'https://www.profedeeconomia.es';

describe('resolveSeo', () => {
  it('es page: canonical self, no content-lang attr', () => {
    const r = resolveSeo({ pathname: '/sobre/', locale: 'es', contentLang: 'es', site });
    expect(r.htmlLang).toBe('es');
    expect(r.contentLangAttr).toBeNull();
    expect(r.ogLocale).toBe('es_ES');
    expect(r.canonical).toBe('https://www.profedeeconomia.es/sobre/');
    expect(r.alternates).toEqual([
      { hreflang: 'es', href: 'https://www.profedeeconomia.es/sobre/' },
      { hreflang: 'ca', href: 'https://www.profedeeconomia.es/ca/sobre/' },
      { hreflang: 'x-default', href: 'https://www.profedeeconomia.es/sobre/' },
    ]);
  });

  it('ca translated page: canonical self (ca), og ca', () => {
    const r = resolveSeo({ pathname: '/ca/sobre/', locale: 'ca', contentLang: 'ca', site });
    expect(r.htmlLang).toBe('ca');
    expect(r.contentLangAttr).toBeNull();
    expect(r.ogLocale).toBe('ca_ES');
    expect(r.canonical).toBe('https://www.profedeeconomia.es/ca/sobre/');
  });

  it('ca fallback page (es body): canonical -> es, main lang es', () => {
    const r = resolveSeo({ pathname: '/ca/edmn-2bach/libro/1/', locale: 'ca', contentLang: 'es', site });
    expect(r.htmlLang).toBe('ca');
    expect(r.contentLangAttr).toBe('es');
    expect(r.canonical).toBe('https://www.profedeeconomia.es/edmn-2bach/libro/1/');
    expect(r.alternates).toContainEqual({ hreflang: 'x-default', href: 'https://www.profedeeconomia.es/edmn-2bach/libro/1/' });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/i18n/seo-locale.test.ts`
Expected: FAIL — no existeix `./seo-locale`.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/i18n/seo-locale.ts
import { type Locale, stripLocalePrefix, localizePath } from './locale';

type ContentLang = Locale;

export function resolveSeo(opts: {
  pathname: string;
  locale: Locale;
  contentLang: ContentLang;
  site: string;
}): {
  htmlLang: Locale;
  contentLangAttr: ContentLang | null;
  ogLocale: 'es_ES' | 'ca_ES';
  canonical: string;
  alternates: { hreflang: string; href: string }[];
} {
  const { pathname, locale, contentLang, site } = opts;
  const base = stripLocalePrefix(pathname); // locale-less path
  const abs = (p: string) => new URL(p, site).toString();
  const esUrl = abs(localizePath(base, 'es'));
  const caUrl = abs(localizePath(base, 'ca'));
  const selfUrl = locale === 'ca' ? caUrl : esUrl;

  return {
    htmlLang: locale,
    contentLangAttr: contentLang === locale ? null : contentLang,
    ogLocale: locale === 'ca' ? 'ca_ES' : 'es_ES',
    canonical: contentLang === locale ? selfUrl : esUrl,
    alternates: [
      { hreflang: 'es', href: esUrl },
      { hreflang: 'ca', href: caUrl },
      { hreflang: 'x-default', href: esUrl },
    ],
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/i18n/seo-locale.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/i18n/seo-locale.ts src/i18n/seo-locale.test.ts
git commit -m "feat(i18n): add SEO resolver for canonical, hreflang and og:locale"
```

---

### Task 3: UI strings dictionary + `t()`

**Files:**
- Create: `src/i18n/ui.ts`
- Create: `src/i18n/ui.test.ts`

**Interfaces:**
- Consumes: `Locale`, `LOCALES` de `src/i18n/locale.ts`.
- Produces:
  - `ui: Record<Locale, Record<UIKey, string>>`
  - `type UIKey` (unió de claus)
  - `t(key: UIKey, locale: Locale): string` — retorna `ui[locale][key]`, amb fallback a `ui.es[key]`.

- [ ] **Step 1: Write the failing test**

```ts
// src/i18n/ui.test.ts
import { describe, it, expect } from 'vitest';
import { ui, t } from './ui';
import { LOCALES } from './locale';

describe('ui dictionary', () => {
  it('every es key exists in every locale (parity)', () => {
    const esKeys = Object.keys(ui.es);
    for (const loc of LOCALES) {
      expect(Object.keys(ui[loc]).sort()).toEqual(esKeys.sort());
    }
  });
  it('t returns the localized string', () => {
    expect(t('footer.tagline', 'ca')).toContain('professorat');
    expect(t('footer.tagline', 'es')).toContain('profesores');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/i18n/ui.test.ts`
Expected: FAIL — no existeix `./ui`.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/i18n/ui.ts
import { type Locale } from './locale';

// Chrome + shared UI strings. Keys are dot-namespaced by area.
export const ui = {
  es: {
    'skip.main': 'Saltar al contenido principal',
    'nav.aria': 'Navegación principal',
    'nav.eso': 'ESO',
    'nav.bach': 'BACH',
    'nav.fp': 'FP',
    'nav.otros': 'Otros',
    'nav.preparacion': 'Preparación',
    'nav.olimpiada': 'Olimpiada de Economía',
    'nav.proximamente': 'Próximamente',
    'nav.ipe.group': 'Itinerario Personal para la Empleabilidad',
    'nav.ipe1.desc': 'Primer curso · sustituye a la FOL',
    'nav.ipe2.desc': 'Segundo curso · búsqueda de empleo y proyecto',
    'nav.oposiciones': 'Oposiciones',
    'curso.3eso': '3.º ESO',
    'curso.4eso': '4.º ESO',
    'curso.1bach': '1.º Bach',
    'curso.2bach': '2.º Bach',
    'curso.optativas': 'Optativas (1.º/2.º)',
    'curso.fp': 'Grado Medio y Superior',
    'footer.tagline': 'material editorial para profesores de instituto',
    'footer.sobre': 'Sobre el proyecto',
    'footer.contacto': 'Contacto',
    'footer.avisoLegal': 'Aviso legal',
    'footer.privacidad': 'Privacidad',
    'lang.switch.aria': 'Cambiar idioma',
    'lang.es': 'ES',
    'lang.ca': 'VAL',
  },
  ca: {
    'skip.main': 'Salta al contingut principal',
    'nav.aria': 'Navegació principal',
    'nav.eso': 'ESO',
    'nav.bach': 'BATX',
    'nav.fp': 'FP',
    'nav.otros': 'Altres',
    'nav.preparacion': 'Preparació',
    'nav.olimpiada': "Olimpíada d'Economia",
    'nav.proximamente': 'Pròximament',
    'nav.ipe.group': "Itinerari Personal per a l'Ocupabilitat",
    'nav.ipe1.desc': 'Primer curs · substitueix la FOL',
    'nav.ipe2.desc': "Segon curs · busca d'ocupació i projecte",
    'nav.oposiciones': 'Oposicions',
    'curso.3eso': '3r ESO',
    'curso.4eso': '4t ESO',
    'curso.1bach': '1r Batx',
    'curso.2bach': '2n Batx',
    'curso.optativas': 'Optatives (1r/2n)',
    'curso.fp': 'Grau Mitjà i Superior',
    'footer.tagline': "material editorial per a professorat d'institut",
    'footer.sobre': 'Sobre el projecte',
    'footer.contacto': 'Contacte',
    'footer.avisoLegal': 'Avís legal',
    'footer.privacidad': 'Privacitat',
    'lang.switch.aria': "Canvia d'idioma",
    'lang.es': 'ES',
    'lang.ca': 'VAL',
  },
} as const;

export type UIKey = keyof (typeof ui)['es'];

export function t(key: UIKey, locale: Locale): string {
  return ui[locale][key] ?? ui.es[key];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/i18n/ui.test.ts`
Expected: PASS (paritat de claus + strings correctes).

- [ ] **Step 5: Commit**

```bash
git add src/i18n/ui.ts src/i18n/ui.test.ts
git commit -m "feat(i18n): add UI strings dictionary and t() helper"
```

---

### Task 4: Localitzar `BaseLayout` (html lang, og:locale, skip-link, hreflang, canonical)

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

**Interfaces:**
- Consumes: `getLocale` (locale.ts), `resolveSeo` (seo-locale.ts), `t` (ui.ts).
- Produces: nova prop `contentLang?: Locale` (per defecte `'es'`) que les pàgines de contingut passen per marcar el cos com a ES sota `/ca`.

- [ ] **Step 1: Add imports + resolve locale/SEO in the frontmatter**

A `src/layouts/BaseLayout.astro`, afig als imports (després de la línia 5):

```astro
import { getLocale, type Locale } from '@/i18n/locale';
import { resolveSeo } from '@/i18n/seo-locale';
import { t } from '@/i18n/ui';
```

Afig `contentLang` al type `Props` (dins de l'objecte, després de `noindex?`):

```astro
  /** Language of the page body when it differs from the UI locale (fallback ES under /ca). */
  contentLang?: Locale;
```

Al destructuring (línia 22), afig `contentLang = 'es'`:

```astro
const { title, description, ogImage, ogType = 'website', jsonLd, noindex = false, contentLang = 'es' } = Astro.props;
```

Reemplaça el càlcul de `canonical` (línia 27) per la resolució completa:

```astro
const locale = getLocale(Astro.currentLocale);
const seo = resolveSeo({
  pathname: Astro.url.pathname, // already locale-less under fallback rewrite
  locale,
  contentLang,
  site: Astro.site!.toString(),
});
const canonical = seo.canonical;
```

- [ ] **Step 2: Make `<html>`, skip-link, og:locale and `<main>` locale-aware; emit hreflang**

Reemplaça `<html lang={Astro.currentLocale ?? 'es'}>` (línia 48) per:

```astro
<html lang={seo.htmlLang}>
```

Després de `<link rel="canonical" href={canonical} />` (línia 57), afig els alternates:

```astro
    {seo.alternates.map((alt) => (
      <link rel="alternate" hreflang={alt.hreflang} href={alt.href} />
    ))}
```

Reemplaça `<meta property="og:locale" content="es_ES" />` (línia 79) per:

```astro
    <meta property="og:locale" content={seo.ogLocale} />
```

Reemplaça la skip-link (línia 96) per:

```astro
    <a href="#main" class="skip-link">{t('skip.main', locale)}</a>
```

Reemplaça `<main id="main">` (línia 98) per una versió que marca l'idioma del cos quan cal:

```astro
    <main id="main" lang={seo.contentLangAttr ?? undefined}>
```

- [ ] **Step 3: Verify the build renders both locales correctly**

Run: `npm run build`
Després:

```bash
grep -c 'hreflang="ca"' dist/client/sobre/index.html          # espera: >=1
grep -o 'lang="[a-z]*"' dist/client/ca/sobre/index.html | head -1   # espera: lang="ca"
grep -o '<main[^>]*>' dist/client/ca/edmn-2bach/libro/*/index.html | head -1  # espera: conté lang="es"
grep -o 'og:locale" content="[a-z_]*"' dist/client/ca/sobre/index.html       # espera: ca_ES
```

Expected: `<html lang="ca">` a `/ca/*`, `hreflang` presents, `<main lang="es">` a les rutes de contingut sota `/ca`, `og:locale=ca_ES` a `/ca`.

- [ ] **Step 4: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat(i18n): make BaseLayout locale-aware (lang, hreflang, canonical, og:locale, skip-link)"
```

---

### Task 5: Overlay VAL de les assignatures + `localizeAsignatura`

**Files:**
- Create: `src/i18n/asignaturas-ca.ts`
- Create: `src/i18n/asignaturas-ca.test.ts`

**Interfaces:**
- Consumes: `Asignatura`, `AsignaturaSlug`, `ASIGNATURAS` de `@/lib/asignaturas`; `Locale` de `@/i18n/locale`.
- Produces:
  - `ASIGNATURAS_CA: Partial<Record<AsignaturaSlug, Partial<Pick<Asignatura, 'level'|'title'|'tagline'|'modalidad'|'marcoNormativo'>>>>`
  - `localizeAsignatura(a: Asignatura, locale: Locale): Asignatura` — fusiona l'overlay VAL quan `locale==='ca'`; identitat quan `'es'`.

- [ ] **Step 1: Write the failing test**

```ts
// src/i18n/asignaturas-ca.test.ts
import { describe, it, expect } from 'vitest';
import { ASIGNATURAS } from '@/lib/asignaturas';
import { localizeAsignatura, ASIGNATURAS_CA } from './asignaturas-ca';

describe('localizeAsignatura', () => {
  it('es returns the original object unchanged', () => {
    const a = ASIGNATURAS['edmn-2bach'];
    expect(localizeAsignatura(a, 'es')).toEqual(a);
  });
  it('ca overlays the Valencian title', () => {
    const a = localizeAsignatura(ASIGNATURAS['edmn-2bach'], 'ca');
    expect(a.title).toBe('Empresa i Disseny de Models de Negoci');
    expect(a.slug).toBe('edmn-2bach'); // structural fields preserved
  });
  it('every CA overlay key is a real asignatura slug', () => {
    for (const slug of Object.keys(ASIGNATURAS_CA)) {
      expect(ASIGNATURAS[slug as keyof typeof ASIGNATURAS]).toBeDefined();
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/i18n/asignaturas-ca.test.ts`
Expected: FAIL — no existeix `./asignaturas-ca`.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/i18n/asignaturas-ca.ts
import { type Asignatura, type AsignaturaSlug } from '@/lib/asignaturas';
import { type Locale } from './locale';

type CAOverlay = Partial<Pick<Asignatura, 'level' | 'title' | 'tagline' | 'modalidad' | 'marcoNormativo'>>;

// Valencian (AVL) overlay for the user-facing asignatura strings. Structural
// fields (slug, color, etapa, curso, num, estado, shortLabel) stay in the ES
// source of truth. Taglines authored for Pau's review (glossary-consistent).
export const ASIGNATURAS_CA: Partial<Record<AsignaturaSlug, CAOverlay>> = {
  'edmn-2bach': {
    level: '2n Batxillerat',
    title: 'Empresa i Disseny de Models de Negoci',
    tagline:
      'Dotze unitats al voltant del Business Model Canvas, les àrees funcionals i un projecte capstone de pla d\'empresa que recorre tot el curs.',
    modalidad: 'Modalitat Humanitats i CC. Socials',
    marcoNormativo: 'Reial Decret 243/2022',
  },
  'eco-1bach': {
    level: '1r Batxillerat',
    title: 'Economia',
    tagline:
      'Microeconomia, macroeconomia, sistemes i introducció a les finances. Amb simulador AD-AS i la teoria de la decisió, que quasi sempre se\'ns queda fora del temari.',
    modalidad: 'Modalitat Humanitats i CC. Socials',
    marcoNormativo: 'Reial Decret 243/2022',
  },
  'eco-4eso': {
    level: '4t ESO',
    title: 'Economia i Emprenedoria',
    tagline:
      'Economia bàsica amb la mirada posada en el que l\'alumnat es trobarà fora: nòmina, IRPF, contractes, decisions de consum.',
    marcoNormativo: 'Reial Decret 217/2022',
  },
  'fopp-4eso': {
    level: '4t ESO',
    title: 'Formació i Orientació Personal i Professional',
    tagline:
      'Itineraris, drets laborals i orientació. L\'assignatura nova de la LOMLOE, sense material decent disponible. Fins ara.',
    marcoNormativo: 'Reial Decret 217/2022',
  },
  'taller-eco-3eso': {
    level: '3r ESO',
    title: "Taller d'Economia",
    tagline:
      'Primer contacte amb l\'economia: consum responsable, diners i estalvi, empreses i emprenedoria, treball i impostos. L\'optativa que obri el camí cap a 4t ESO.',
    marcoNormativo: 'Reial Decret 217/2022 (optativa d\'iniciació econòmica i emprenedora)',
  },
  'ipe1-fp': {
    level: 'FP — Grau Mitjà i Superior',
    title: "Itinerari Personal per a l'Ocupabilitat I",
    tagline:
      'El mòdul que substitueix la FOL en primer curs: autoconeixement professional, prevenció de riscos laborals, contracte i drets, i salut psicosocial.',
    marcoNormativo: 'Llei Orgànica 3/2022 (LOFP) · RD 659/2023, Annex V',
  },
  'ipe2-fp': {
    level: 'FP — Grau Mitjà i Superior',
    title: "Itinerari Personal per a l'Ocupabilitat II",
    tagline:
      'Continuació d\'IPE I en segon curs: busca activa d\'ocupació, marca personal, competències per a l\'ocupació i un projecte emprenedor d\'innovació social.',
    marcoNormativo: 'Llei Orgànica 3/2022 (LOFP) · RD 659/2023, Annex V',
  },
  'eeae-bach': {
    level: '1r Batxillerat',
    title: 'Economia, Emprenedoria i Activitat Empresarial',
    tagline:
      'La matèria de modalitat General que ajunta economia, iniciativa emprenedora i activitat empresarial. Per a entendre com es crea valor abans de triar itinerari.',
    modalidad: 'Modalitat General',
    marcoNormativo: 'Reial Decret 243/2022 · Decret 108/2022 (CV)',
  },
  'gpe-bach': {
    level: 'Batxillerat (1r/2n)',
    title: 'Gestió de Projectes d\'Emprenedoria',
    tagline:
      'Una matèria de projecte: l\'alumnat monta la seua pròpia iniciativa emprenedora lligada al territori. Porta llibre teòric i quadern de projecte guiat per fases.',
    modalidad: 'Optativa d\'oferta obligatòria',
    marcoNormativo: 'Decret 108/2022 (CV) — optativa d\'oferta obligatòria',
  },
};

/** Overlay the Valencian strings onto an asignatura when locale is 'ca'. */
export function localizeAsignatura(a: Asignatura, locale: Locale): Asignatura {
  if (locale === 'es') return a;
  return { ...a, ...ASIGNATURAS_CA[a.slug] };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/i18n/asignaturas-ca.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/i18n/asignaturas-ca.ts src/i18n/asignaturas-ca.test.ts
git commit -m "feat(i18n): add Valencian overlay for asignatura facing strings"
```

---

### Task 6: `LanguageSwitcher` + localitzar `SiteHeader`

**Files:**
- Create: `src/components/LanguageSwitcher.astro`
- Modify: `src/components/SiteHeader.astro`

**Interfaces:**
- Consumes: `getLocale`, `switchLocalePath`, `LOCALES` (locale.ts); `t` (ui.ts); `localizeAsignatura` (asignaturas-ca.ts).

- [ ] **Step 1: Create the LanguageSwitcher component**

```astro
---
// src/components/LanguageSwitcher.astro
import { getLocale, switchLocalePath, type Locale } from '@/i18n/locale';
import { t } from '@/i18n/ui';

const locale = getLocale(Astro.currentLocale);
const pathname = Astro.url.pathname; // locale-less under fallback rewrite; switchLocalePath adds the prefix
const options: { code: Locale; label: string }[] = [
  { code: 'es', label: t('lang.es', locale) },
  { code: 'ca', label: t('lang.ca', locale) },
];
---
<div class="lang-switch" role="group" aria-label={t('lang.switch.aria', locale)}>
  {options.map((o) => (
    o.code === locale
      ? <span class="lang-opt is-active" aria-current="true">{o.label}</span>
      : <a class="lang-opt" href={switchLocalePath(pathname, o.code)} hreflang={o.code}>{o.label}</a>
  ))}
</div>

<style>
  .lang-switch { display: inline-flex; align-items: center; gap: 0.15rem; margin-left: 0.4rem; }
  .lang-opt {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    letter-spacing: 0.06em;
    color: var(--color-ink-mute);
    text-decoration: none;
    padding: 0.25rem 0.4rem;
    border-radius: 4px;
    transition: color .15s ease, background .15s ease;
  }
  a.lang-opt:hover, a.lang-opt:focus-visible { color: var(--color-terra); background: var(--color-bg-cream); }
  .lang-opt.is-active { color: var(--color-ink); font-weight: 700; }
</style>
```

- [ ] **Step 2: Localize SiteHeader strings and dropdown data**

A `src/components/SiteHeader.astro`, reemplaça el frontmatter (línies 1-3) per:

```astro
---
import { ASIGNATURAS_POR_ETAPA, SECCIONES_TRANSVERSALES } from '@/lib/asignaturas';
import { getLocale } from '@/i18n/locale';
import { t } from '@/i18n/ui';
import { localizeAsignatura } from '@/i18n/asignaturas-ca';
import LanguageSwitcher from '@components/LanguageSwitcher.astro';

const locale = getLocale(Astro.currentLocale);
---
```

Aplica aquests reemplaçaments de text literal (respectant el marcatge existent al voltant):
- `aria-label="Navegación principal"` → `aria-label={t('nav.aria', locale)}`
- Text del trigger `ESO` → `{t('nav.eso', locale)}` (deixa el `<span class="caret">`)
- `BACH` → `{t('nav.bach', locale)}`
- `FP` → `{t('nav.fp', locale)}`
- `Otros` → `{t('nav.otros', locale)}`
- Etiqueta `Preparación` (línia 72) → `{t('nav.preparacion', locale)}`
- `<a href="/olimpiada/" role="menuitem">Olimpiada de Economía</a>` → `>{t('nav.olimpiada', locale)}</a>`
- Etiqueta `Itinerario Personal para la Empleabilidad` (línia 86) → `{t('nav.ipe.group', locale)}`
- Els dos textos de descripció IPE (línia 90) → `{a.slug === 'ipe1-fp' ? t('nav.ipe1.desc', locale) : t('nav.ipe2.desc', locale)}`
- Cada `<span class="badge">Próximamente</span>` (línies 24, 67, 91) → `<span class="badge">{t('nav.proximamente', locale)}</span>`
- `<a href="/oposiciones" ... >Oposiciones</a>` (línia 128) → `>{t('nav.oposiciones', locale)}</a>`

Localitza les etiquetes de curs (dropdown-label que venen de `ASIGNATURAS_POR_ETAPA...label`). Reemplaça cada `{ASIGNATURAS_POR_ETAPA.<etapa>.cursos.<curso>.label}` pel seu key de `t()`:
- `eso.cursos['3eso'].label` → `{t('curso.3eso', locale)}`
- `eso.cursos['4eso'].label` → `{t('curso.4eso', locale)}`
- `bach.cursos['1bach'].label` → `{t('curso.1bach', locale)}`
- `bach.cursos['2bach'].label` → `{t('curso.2bach', locale)}`
- `bach.cursos.bach.label` → `{t('curso.optativas', locale)}`
- `fp.cursos.fp.label` → `{t('curso.fp', locale)}`

Localitza els títols d'assignatura: cada bloc `.asignaturas.map((a) => ( ... {a.title} ... ))` passa a `.asignaturas.map((a0) => { const a = localizeAsignatura(a0, locale); return ( ... {a.title} ... ); })`. Per a l'`shortLabel` d'FP (línia 89) deixa `a.shortLabel` (és un codi, no es tradueix).

Localitza les seccions transversals. Reemplaça `{SECCIONES_TRANSVERSALES.map((s) => (` i, dins, `{s.label}` i `{s.description}`. Com que aquestes strings viuen a `asignaturas.ts` (dades), afig-les al diccionari `ui.ts` en una passada mínima: crea claus `sec.<slug>.label` i `sec.<slug>.desc` per als 8 slugs i usa `t()`. (Alternativament, si es prefereix no inflar el diccionari, mou-les a un overlay com el d'assignatures; per a la fase 1, el diccionari és suficient.)

> NOTA per a l'implementador: afig al `ui.ts` (Task 3) les 16 claus de seccions transversals abans d'aquest pas, amb el text ES actual de `SECCIONES_TRANSVERSALES` i la traducció VAL segons glossari. Actualitza el test de paritat (ja cobreix automàticament claus noves).

Afig el switcher dins de `<nav>`, just després del link d'Oposicions (línia 128):

```astro
      <LanguageSwitcher />
```

- [ ] **Step 3: Verify the build**

Run: `npm run build`
Després:

```bash
grep -o 'Altres\|Pròximament\|Empresa i Disseny' dist/client/ca/index.html | sort -u   # espera VAL a /ca
grep -c 'lang-switch' dist/client/index.html dist/client/ca/index.html                  # espera >=1 als dos
grep -o 'Otros\|Próximamente' dist/client/index.html | sort -u                          # espera ES a l'arrel
```

Expected: el header a `/ca/*` mostra VAL (Altres, Pròximament, títols VAL) i el switcher; a l'arrel, ES intacte.

- [ ] **Step 4: Commit**

```bash
git add src/components/LanguageSwitcher.astro src/components/SiteHeader.astro src/i18n/ui.ts src/i18n/ui.test.ts
git commit -m "feat(i18n): localize SiteHeader and add language switcher"
```

---

### Task 7: Localitzar `SiteFooter`

**Files:**
- Modify: `src/components/SiteFooter.astro`

- [ ] **Step 1: Localize the footer strings + add the switcher**

Reemplaça el frontmatter (línies 1-3) per:

```astro
---
import { getLocale } from '@/i18n/locale';
import { t } from '@/i18n/ui';
import LanguageSwitcher from '@components/LanguageSwitcher.astro';

const year = new Date().getFullYear();
const locale = getLocale(Astro.currentLocale);
---
```

Reemplaça el bloc `.container` (línies 6-13) per:

```astro
  <div class="container">
    <div>profedeeconomia.es — {t('footer.tagline', locale)} · {year}</div>
    <div class="footer-links">
      <a href="/sobre/">{t('footer.sobre', locale)}</a> ·
      <a href="/contacto/">{t('footer.contacto', locale)}</a> ·
      <a href="/legal/aviso-legal/">{t('footer.avisoLegal', locale)}</a> ·
      <a href="/legal/privacidad/">{t('footer.privacidad', locale)}</a>
      <LanguageSwitcher />
    </div>
  </div>
```

> NOTA: els `href` del footer apunten a rutes ES arrel. Sota `/ca`, el `LanguageSwitcher` ja porta a la versió `/ca`; els enllaços del footer poden quedar-se apuntant a l'arrel ES en la fase 1 (són pàgines traduïdes que existeixen també en ES). No cal prefixar-los ara.

- [ ] **Step 2: Verify the build**

Run: `npm run build`
```bash
grep -o "Sobre el projecte\|Avís legal\|professorat d'institut" dist/client/ca/index.html | sort -u  # VAL a /ca
grep -o 'Sobre el proyecto\|Aviso legal' dist/client/index.html | sort -u                             # ES a l'arrel
```

Expected: footer VAL a `/ca`, ES a l'arrel.

- [ ] **Step 3: Commit**

```bash
git add src/components/SiteFooter.astro
git commit -m "feat(i18n): localize SiteFooter"
```

---

## PART B — Traducció de les pàgines d'UI

Cada tasca aplica el mateix patró a una pàgina. **Patró estàndard per pàgina** (referència; els passos de cada tasca només diuen quina pàgina i quines strings):

1. Al frontmatter: `import { getLocale } from '@/i18n/locale';` i `const locale = getLocale(Astro.currentLocale);`.
2. Definir un objecte de còpia local al principi del frontmatter:
   ```astro
   const copy = {
     es: { /* strings ES existents, mogudes ací */ },
     ca: { /* traducció VAL AVL segons glossari */ },
   }[locale];
   ```
3. Al marcatge, reemplaçar cada literal ES per `{copy.<clau>}`.
4. Si la pàgina és de **contingut editorial curt** (no llista MDX), NO cal passar `contentLang` (el cos SÍ que es tradueix). Si fora una pàgina que barreja UI traduïda amb blocs de contingut ES, es passaria `contentLang="es"` al `BaseLayout`; a la fase 1 les pàgines d'UI d'aquesta part es tradueixen senceres, així que `contentLang` es queda per defecte.
5. **La còpia VAL la redacta el traductor (Claude) i la revisa Pau abans del merge.**

Verificació comuna al final de cada tasca:
```bash
npm run build && npm run check
```
`astro check` ha de passar sense errors de tipus.

### Task 8: Home (`index.astro`)

**Files:** Modify: `src/pages/index.astro`

- [ ] **Step 1:** Llig `src/pages/index.astro` sencer i inventaria tots els literals ES (hero, targetes de dades, CTAs, textos de secció).
- [ ] **Step 2:** Aplica el patró estàndard: mou tots els literals a `copy.es`, redacta `copy.ca` en VAL AVL (glossari), i substitueix per `{copy.*}`. Les targetes d'assignatura que rendien `a.title`/`a.tagline` s'han de passar per `localizeAsignatura(a, locale)` (importa'l). Les strings de JSON-LD (`SITE.locale`, descripcions) es queden en ES a la fase 1 (el JSON-LD de la home descriu l'entitat de marca, no depèn de l'idioma d'UI).
- [ ] **Step 3:** `npm run build && npm run check` → sense errors. Inspecciona `dist/client/ca/index.html`: hero i targetes en VAL.
- [ ] **Step 4:** Commit: `git commit -m "feat(i18n): translate home page to Valencian"`

### Task 9: `sobre` + `contacto` + `404`

**Files:** Modify: `src/pages/sobre.astro`, `src/pages/contacto.astro`, `src/pages/404.astro`

- [ ] **Step 1:** Per a `sobre.astro`, aplica el patró. La còpia VAL de la secció "Quién lo hace" ja està decidida:
  > Soc **Pau Monterde, professor d'economia a la Comunitat Valenciana.** Aquest és un projecte fet per i per a professorat d'economia: l'use a classe i el vaig polint amb el que funciona i el que no. Si et serveix, és teu: el material és obert. Si trobes una errada o tens una proposta, escriu-me.

  Tradueix també la resta de seccions de `sobre.astro` ("En qué se basa", "Quién lo hace", enllaços) segons glossari.
- [ ] **Step 2:** `contacto.astro` i `404.astro`: mateix patró, redacta VAL.
- [ ] **Step 3:** `npm run build && npm run check`. Inspecciona `dist/client/ca/sobre/index.html`, `dist/client/ca/contacto/index.html`, `dist/client/ca/404.html` en VAL; verifica que `dist/client/sobre/index.html` (ES) segueix intacte.
- [ ] **Step 4:** Commit: `git commit -m "feat(i18n): translate sobre, contacto and 404 pages to Valencian"`

### Task 10: Pàgines legals

**Files:** Modify: `src/pages/legal/aviso-legal.astro`, `src/pages/legal/privacidad.astro`

- [ ] **Step 1:** Aplica el patró a les dues. **Atenció**: text legal — la traducció VAL ha de mantindre el mateix significat jurídic; Pau la revisa amb cura. No inventar clàusules; traduir literalment l'existent.
- [ ] **Step 2:** `npm run build && npm run check`.
- [ ] **Step 3:** Commit: `git commit -m "feat(i18n): translate legal pages to Valencian"`

### Task 11: Landings

**Files:** Modify: `src/pages/juegos/business-game/index.astro`, `src/pages/jocs-economics/index.astro`, `src/pages/emprendimiento/entrevista-emprendedores/index.astro`, `src/pages/emprendimiento/entrevista-emprendedores/imprimir.astro`

- [ ] **Step 1:** Aplica el patró a cada landing (només la còpia editorial de la pàgina; les targetes/dades que vénen de registres es queden ES). La `imprimir.astro` és versió imprimible; tradueix-ne els literals d'UI.
- [ ] **Step 2:** `npm run build && npm run check`.
- [ ] **Step 3:** Commit: `git commit -m "feat(i18n): translate landing pages to Valencian"`

### Task 12: Intros dels hubs

**Files:** Modify: `src/pages/olimpiada/index.astro`, `src/pages/olimpiada/simulacros/index.astro`, `src/pages/olimpiada/lecturas/index.astro`, `src/pages/olimpiada/banco/index.astro`, `src/pages/juegos/index.astro`, `src/pages/generadores/index.astro`, `src/pages/herramientas/index.astro`

- [ ] **Step 1:** A cada hub, tradueix NOMÉS la còpia editorial d'intro (títol, subtítol, paràgrafs introductoris). Les **targetes** de la graella vénen de registres `.ts`/MDX i **es queden en ES** (fallback). Per marcar honestament que la graella és ES, passa `contentLang="es"` al `BaseLayout` d'aquestes pàgines (perquè barregen intro VAL amb targetes ES sota `/ca`).
- [ ] **Step 2:** `npm run build && npm run check`. Verifica a `dist/client/ca/olimpiada/index.html`: intro en VAL, targetes en ES, `<main lang="es">` present.
- [ ] **Step 3:** Commit: `git commit -m "feat(i18n): translate hub intros to Valencian"`

---

## Task 13: Verificació final + PR

**Files:** cap (verificació).

- [ ] **Step 1:** Full test + build:

```bash
npm test
npm run build
npm run check
```
Expected: tests PASS, build OK, `astro check` sense errors.

- [ ] **Step 2:** Checklist manual (de l'spec §Verificació):

```bash
# ES intacte
grep -q 'Saltar al contenido principal' dist/client/sobre/index.html && echo "ES skip OK"
# CA shell complet
grep -q 'Salta al contingut principal' dist/client/ca/sobre/index.html && echo "CA skip OK"
# contingut fallback: chrome VAL + body ES + canonical -> ES
grep -o '<html lang="ca">' dist/client/ca/edmn-2bach/libro/*/index.html | head -1
grep -o 'rel="canonical" href="[^"]*"' dist/client/ca/edmn-2bach/libro/*/index.html | head -1   # ha d'apuntar a URL SENSE /ca
# hreflang a les dues versions
grep -c 'hreflang=' dist/client/sobre/index.html dist/client/ca/sobre/index.html
```
Expected: tots els echoes surten; canonical de contingut `/ca` apunta a la URL ES; hreflang presents.

- [ ] **Step 3:** Sitemap sanity — comprova que el sitemap no s'ha inflat amb `/ca/*` de manera no volguda (revisa `dist/client/sitemap-*.xml`); si cal excloure rutes `/ca` de contingut fallback del sitemap, anota-ho com a seguiment (fora d'aquesta tasca).

- [ ] **Step 4:** Push + PR (revisió de Pau abans del merge):

```bash
git push -u origin feat/ca-translation-fase1
gh pr create --base main --title "feat(i18n): Fase 1 — esquelet bilingüe VAL/ES" --body "Implementa l'esquelet bilingüe (veure docs/superpowers/plans/2026-07-06-ca-translation-fase1-skeleton.md). Xrome + pàgines d'UI en valencià; contingut en fallback ES. Pendent revisió VAL de Pau."
```

- [ ] **Step 5:** **NO fer merge automàtic.** Pau revisa tota la còpia VAL i el comportament del web abans d'aprovar.

---

## Notes d'execució

- **Ordre**: Part A (tasks 1-7) primer i mergeable per si sola. El spike de la Task 1 és un GATE ja resolt en una passada prèvia: la font del locale és `Astro.currentLocale` (no `Astro.url`), i el single-source es manté sense duplicar pàgines. La Task 1 el reconfirma; si tornara a fallar, escalar al controlador (no improvisar).
- **Fora d'abast d'aquest pla** (fases futures, spec propi cadascuna): traducció del MDX de contingut, regeneració de PDFs/diapositives en VAL, illes de jocs Preact, i localització del `inLanguage` dels JSON-LD per pàgina de contingut.
