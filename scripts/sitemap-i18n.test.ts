import { describe, it, expect } from 'vitest';
import { mirrorSitemapLocale } from './sitemap-i18n.mjs';

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
