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

  it('ca fallback page (es body): canonical -> es, main lang es, no hreflang (CODE-WEB-07)', () => {
    const r = resolveSeo({ pathname: '/ca/edmn-2bach/libro/1/', locale: 'ca', contentLang: 'es', site });
    expect(r.htmlLang).toBe('ca');
    expect(r.contentLangAttr).toBe('es');
    expect(r.canonical).toBe('https://www.profedeeconomia.es/edmn-2bach/libro/1/');
    // hreflang only on self-canonical pages: this one points its canonical away.
    expect(r.alternates).toEqual([]);
  });

  it('es page with no Valencian edition: no hreflang pointing at the /ca/ fallback', () => {
    const r = resolveSeo({ pathname: '/olimpiada/banco/', locale: 'es', contentLang: 'es', site, translated: false });
    expect(r.canonical).toBe('https://www.profedeeconomia.es/olimpiada/banco/');
    expect(r.alternates).toEqual([]);
  });

  it('translated pages keep the full set in both languages', () => {
    for (const [pathname, locale] of [['/sobre/', 'es'], ['/ca/sobre/', 'ca']] as const) {
      const r = resolveSeo({ pathname, locale, contentLang: locale, site });
      expect(r.alternates.map((a) => a.hreflang)).toEqual(['es', 'ca', 'x-default']);
    }
  });
});

describe('resolveSeo — canonicalPath (§5.6)', () => {
  const site = 'https://www.profedeeconomia.es';
  const opts = { pathname: '/herramientas/mercados-macro/elasticidad/', contentLang: 'es' as const, site };

  it('points the canonical at the duplicate target instead of self', () => {
    const seo = resolveSeo({ ...opts, locale: 'es', canonicalPath: '/eco-1bach/recursos/calculadora-elasticidad/' });
    expect(seo.canonical).toBe(`${site}/eco-1bach/recursos/calculadora-elasticidad/`);
  });

  it('localizes the target on a ca page', () => {
    const seo = resolveSeo({ ...opts, locale: 'ca', contentLang: 'ca', canonicalPath: '/eco-1bach/recursos/calculadora-elasticidad/' });
    expect(seo.canonical).toBe(`${site}/ca/eco-1bach/recursos/calculadora-elasticidad/`);
  });

  it('drops hreflang, which only self-canonical pages may declare', () => {
    const seo = resolveSeo({ ...opts, locale: 'es', canonicalPath: '/eco-1bach/recursos/calculadora-elasticidad/' });
    expect(seo.alternates).toEqual([]);
  });

  it('leaves canonical and hreflang untouched when no override is given', () => {
    const seo = resolveSeo({ ...opts, locale: 'es' });
    expect(seo.canonical).toBe(`${site}/herramientas/mercados-macro/elasticidad/`);
    expect(seo.alternates).toHaveLength(3);
  });
});

describe('resolveSeo — error page (CODE-WEB-18)', () => {
  it('asks not to index the 404 in both halves, and declares no alternates', () => {
    for (const [pathname, locale] of [['/404', 'es'], ['/404/', 'es'], ['/404.html', 'es'], ['/ca/404/', 'ca']] as const) {
      const r = resolveSeo({ pathname, locale, contentLang: locale, site });
      expect(r.noindex, pathname).toBe(true);
      expect(r.alternates, pathname).toEqual([]);
    }
  });

  it('leaves every other page indexable', () => {
    for (const pathname of ['/', '/sobre/', '/ca/eco-1bach/', '/eco-1bach/libro/04-mercado/']) {
      expect(resolveSeo({ pathname, locale: 'es', contentLang: 'es', site }).noindex, pathname).toBe(false);
    }
  });
});
