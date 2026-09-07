import { describe, it, expect } from 'vitest';
import { mirrorSitemapLocale, isIndexableHtml } from './sitemap-i18n.mjs';

const SITE = 'https://www.profedeeconomia.es';
const wrap = (...urls: string[]) =>
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`;
const url = (path: string, extra = '') => `<url><loc>${SITE}${path}</loc>${extra}</url>`;
const run = (xml: string, exists: (p: string) => boolean = () => true) =>
  mirrorSitemapLocale(xml, { site: SITE, localePrefix: 'ca', exists });

describe('mirrorSitemapLocale (§5.8)', () => {
  it('adds the /ca/ twin for every default-locale URL that was built', () => {
    const { xml, mirrored } = run(wrap(url('/fopp-4eso/'), url('/juegos/')));
    expect(mirrored).toBe(2);
    expect(xml).toContain(`<loc>${SITE}/ca/fopp-4eso/</loc>`);
    expect(xml).toContain(`<loc>${SITE}/ca/juegos/</loc>`);
    expect(xml.match(/<url>/g)).toHaveLength(4);
  });

  it('skips a URL whose twin was never built, rather than inventing it', () => {
    const { xml, mirrored } = run(wrap(url('/solo-es/')), () => false);
    expect(mirrored).toBe(0);
    expect(xml).not.toContain('/ca/solo-es/');
    expect(xml).not.toContain('xhtml:link');
  });

  it('gives both members of a pair the full hreflang set, itself included', () => {
    const { xml } = run(wrap(url('/fopp-4eso/')));
    const blocks = xml.match(/<url>[\s\S]*?<\/url>/g)!;
    for (const b of blocks) {
      expect(b).toContain(`hreflang="es" href="${SITE}/fopp-4eso/"`);
      expect(b).toContain(`hreflang="ca" href="${SITE}/ca/fopp-4eso/"`);
      expect(b).toContain(`hreflang="x-default" href="${SITE}/fopp-4eso/"`);
    }
  });

  it('preserves whatever else the entry carried, such as lastmod', () => {
    const { xml } = run(wrap(url('/a/', '<lastmod>2026-05-20T00:00:00.000Z</lastmod>')));
    expect(xml.match(/<lastmod>2026-05-20T00:00:00\.000Z<\/lastmod>/g)).toHaveLength(2);
  });

  it('declares the xhtml namespace once', () => {
    const { xml } = run(wrap(url('/a/')));
    expect(xml.match(/xmlns:xhtml=/g)).toHaveLength(1);
  });

  it('is idempotent — a second pass does not double the /ca/ entries', () => {
    const once = run(wrap(url('/a/'), url('/b/')));
    const twice = run(once.xml);
    expect(twice.mirrored).toBe(0);
    expect(twice.xml.match(/<url>/g)).toHaveLength(4);
  });

  it('leaves an already-localized URL alone', () => {
    const { mirrored } = run(wrap(url('/ca/fopp-4eso/'), url('/ca/')));
    expect(mirrored).toBe(0);
  });

  it('returns an empty urlset unchanged', () => {
    const { xml, mirrored } = run(wrap());
    expect(mirrored).toBe(0);
    expect(xml).toContain('</urlset>');
  });
});

describe('mirrorSitemapLocale — only pages we may ask Google to index (§5.9)', () => {
  const run2 = (xml: string, indexable: (p: string) => boolean) =>
    mirrorSitemapLocale(xml, { site: SITE, localePrefix: 'ca', exists: () => true, indexable });

  it('drops an entry whose page canonicalises elsewhere, and never mirrors it', () => {
    const consolidated = '/herramientas/mercados-macro/elasticidad/';
    const { xml, mirrored, dropped } = run2(
      wrap(url(consolidated), url('/eco-1bach/')),
      (p) => !p.endsWith(consolidated)
    );
    expect(dropped).toBe(1);
    expect(mirrored).toBe(1);
    expect(xml).not.toContain(consolidated);
    expect(xml).toContain(`<loc>${SITE}/ca/eco-1bach/</loc>`);
  });

  it('drops a noindex entry the integration filter let through', () => {
    const { xml, dropped } = run2(wrap(url('/edmn-2bach/tests/')), (p) => !p.includes('/tests/'));
    expect(dropped).toBe(1);
    expect(xml.match(/<url>/g)).toBeNull();
  });

  it('keeps the Spanish entry unpaired when its /ca/ twin canonicalises back to it', () => {
    const { xml, mirrored, dropped } = run2(wrap(url('/juegos/stonks/')), (p) => !p.startsWith('/ca/'));
    expect(mirrored).toBe(0);
    expect(dropped).toBe(0);
    expect(xml).toContain(`<loc>${SITE}/juegos/stonks/</loc>`);
    expect(xml).not.toContain('/ca/juegos/stonks/');
    // No twin means no hreflang set to declare.
    expect(xml).not.toContain('xhtml:link');
  });

  it('reaches the same verdict on a second pass over a written sitemap', () => {
    const indexable = (p: string) => !p.includes('/elasticidad/');
    const once = run2(wrap(url('/a/'), url('/herramientas/x/elasticidad/')), indexable);
    const twice = run2(once.xml, indexable);
    expect(twice.dropped).toBe(0);
    expect(twice.mirrored).toBe(0);
    expect(twice.xml.match(/<url>/g)).toHaveLength(2);
  });

  it('submits everything when no predicate is supplied', () => {
    const { mirrored, dropped } = run(wrap(url('/a/')));
    expect(mirrored).toBe(1);
    expect(dropped).toBe(0);
  });
});

describe('isIndexableHtml (§5.9)', () => {
  const page = (head: string) => `<!doctype html><html><head>${head}</head><body>x</body></html>`;
  const SELF = `${SITE}/eco-1bach/`;

  it('accepts a self-canonical page', () => {
    expect(isIndexableHtml(page(`<link rel="canonical" href="${SELF}">`), SELF)).toBe(true);
  });

  it('rejects a page whose canonical points at another URL', () => {
    const other = `${SITE}/eco-1bach/recursos/calculadora-elasticidad/`;
    expect(isIndexableHtml(page(`<link rel="canonical" href="${other}">`), SELF)).toBe(false);
  });

  it('rejects a noindex page even when it is self-canonical', () => {
    const head = `<meta name="robots" content="noindex,nofollow"><link rel="canonical" href="${SELF}">`;
    expect(isIndexableHtml(page(head), SELF)).toBe(false);
  });

  it('accepts a page that declares no canonical at all', () => {
    expect(isIndexableHtml(page('<title>x</title>'), SELF)).toBe(true);
  });

  it('reads the attributes in either order', () => {
    expect(isIndexableHtml(page(`<link href="${SELF}" rel="canonical"/>`), SELF)).toBe(true);
    expect(isIndexableHtml(page(`<link href="${SITE}/otra/" rel="canonical"/>`), SELF)).toBe(false);
  });

  it('ignores a canonical-looking string in the body', () => {
    const html = `${page(`<link rel="canonical" href="${SELF}">`)}<p>rel="canonical" href="${SITE}/otra/"</p>`;
    expect(isIndexableHtml(html, SELF)).toBe(true);
  });
});
