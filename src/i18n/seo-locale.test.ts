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
