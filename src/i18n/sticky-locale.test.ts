import { describe, it, expect } from 'vitest';
import { localizeHref, applyStickyLocale } from './sticky-locale';

/** Minimal anchor/document doubles so the DOM glue can run under the node env. */
function fakeAnchor(href: string, opts: { inSwitch?: boolean; rel?: string } = {}) {
  let current = href;
  return {
    getAttribute: () => current,
    setAttribute: (_: string, v: string) => {
      current = v;
    },
    get value() {
      return current;
    },
    rel: opts.rel ?? '',
    closest: (sel: string) => (sel === '.lang-switch' && opts.inSwitch ? {} : null),
  };
}

function fakeDoc(lang: string, anchors: ReturnType<typeof fakeAnchor>[]) {
  return {
    documentElement: { lang },
    querySelectorAll: () => anchors,
  } as unknown as Document;
}

describe('localizeHref', () => {
  it('leaves everything untouched under the default (es) locale', () => {
    expect(localizeHref('/sobre/', 'es')).toBeNull();
    expect(localizeHref('/', 'es')).toBeNull();
  });

  it('prefixes /ca to locale-less internal page links', () => {
    expect(localizeHref('/', 'ca')).toBe('/ca/');
    expect(localizeHref('/sobre/', 'ca')).toBe('/ca/sobre/');
    expect(localizeHref('/edmn-2bach/', 'ca')).toBe('/ca/edmn-2bach/');
    expect(localizeHref('/juegos/cajut/imprimir', 'ca')).toBe('/ca/juegos/cajut/imprimir');
  });

  it('preserves query and hash', () => {
    expect(localizeHref('/olimpiada/?x=1#faq', 'ca')).toBe('/ca/olimpiada/?x=1#faq');
  });

  it('skips links already under /ca', () => {
    expect(localizeHref('/ca', 'ca')).toBeNull();
    expect(localizeHref('/ca/', 'ca')).toBeNull();
    expect(localizeHref('/ca/sobre/', 'ca')).toBeNull();
  });

  it('skips the /oposiciones external redirect', () => {
    expect(localizeHref('/oposiciones', 'ca')).toBeNull();
  });

  it('skips external and protocol-relative links', () => {
    expect(localizeHref('https://example.com', 'ca')).toBeNull();
    expect(localizeHref('//example.com/x', 'ca')).toBeNull();
    expect(localizeHref('mailto:x@y.z', 'ca')).toBeNull();
  });

  it('skips static assets (files with an extension, e.g. PDFs)', () => {
    expect(localizeHref('/downloads/edmn-2bach-ebau.pdf', 'ca')).toBeNull();
    expect(localizeHref('/fonts/switzer/switzer-400.woff2', 'ca')).toBeNull();
  });
});

describe('applyStickyLocale', () => {
  it('does nothing when the page is not in Valencian', () => {
    const a = fakeAnchor('/sobre/');
    applyStickyLocale(fakeDoc('es', [a]));
    expect(a.value).toBe('/sobre/');
  });

  it('rewrites page links but leaves switcher, external and asset links alone', () => {
    const page = fakeAnchor('/edmn-2bach/');
    const switcher = fakeAnchor('/sobre', { inSwitch: true });
    const external = fakeAnchor('/oposiciones', { rel: 'external' });
    const asset = fakeAnchor('/downloads/x.pdf');
    const already = fakeAnchor('/ca/juegos/');
    applyStickyLocale(fakeDoc('ca', [page, switcher, external, asset, already]));
    expect(page.value).toBe('/ca/edmn-2bach/');
    expect(switcher.value).toBe('/sobre');
    expect(external.value).toBe('/oposiciones');
    expect(asset.value).toBe('/downloads/x.pdf');
    expect(already.value).toBe('/ca/juegos/');
  });
});
