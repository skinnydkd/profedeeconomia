import { describe, expect, it } from 'vitest';
import { localizeHref, localizeHtmlLinks, shouldLocalize } from './localize-links.mjs';

const a = (href: string, extra = '') => `<a${extra} href="${href}">x</a>`;
const hrefIn = (html: string) => html.match(/<a[^>]*\shref="([^"]*)"/)?.[1];

describe('shouldLocalize', () => {
  it('takes same-origin page paths', () => {
    expect(shouldLocalize('/', 'ca')).toBe(true);
    expect(shouldLocalize('/eco-1bach/', 'ca')).toBe(true);
    expect(shouldLocalize('/eco-1bach/libro/01-la-empresa/', 'ca')).toBe(true);
  });

  it('leaves anything that is not a same-origin path', () => {
    for (const href of [
      'https://econosublime.com/',
      '//cdn.example.com/x/',
      '#conceptos-clave',
      '?page=2',
      'mailto:hola@profedeeconomia.es',
      'tel:+34600000000',
      'relativo/',
    ]) {
      expect(shouldLocalize(href, 'ca'), href).toBe(false);
    }
  });

  it('leaves paths already under the prefix, which makes the pass idempotent', () => {
    expect(shouldLocalize('/ca/', 'ca')).toBe(false);
    expect(shouldLocalize('/ca', 'ca')).toBe(false);
    expect(shouldLocalize('/ca/eco-1bach/', 'ca')).toBe(false);
  });

  // A prefix match alone would also swallow a real page whose slug merely
  // starts with the locale segment.
  it('does not mistake a page whose slug starts with the prefix', () => {
    expect(shouldLocalize('/cajut/', 'ca')).toBe(true);
    expect(shouldLocalize('/calculadoras/', 'ca')).toBe(true);
  });

  it('leaves files, which exist once and are not localized by path', () => {
    for (const href of [
      '/downloads/emprendimiento-cuaderno-alumno.pdf',
      '/downloads/emprendimiento-cuaderno-alumno.ca.pdf',
      '/fonts/fraunces-latin-normal.woff2',
      '/sitemap-index.xml',
      '/llms-full.txt',
    ]) {
      expect(shouldLocalize(href, 'ca'), href).toBe(false);
    }
  });

  it('leaves routes with no localized twin', () => {
    expect(shouldLocalize('/api/jocs/start', 'ca')).toBe(false);
    expect(shouldLocalize('/oposiciones', 'ca')).toBe(false);
    expect(shouldLocalize('/oposiciones/', 'ca')).toBe(false);
    expect(shouldLocalize('/_astro/client.js', 'ca')).toBe(false);
  });
});

describe('localizeHref', () => {
  it('prefixes the path and keeps query and fragment', () => {
    expect(localizeHref('/eco-1bach/', 'ca')).toBe('/ca/eco-1bach/');
    expect(localizeHref('/eco-1bach/libro/#unidad-3', 'ca')).toBe('/ca/eco-1bach/libro/#unidad-3');
    expect(localizeHref('/juegos/?nivel=2', 'ca')).toBe('/ca/juegos/?nivel=2');
    expect(localizeHref('/juegos/?nivel=2#reglas', 'ca')).toBe('/ca/juegos/?nivel=2#reglas');
  });

  it('maps the site root onto the localized root', () => {
    expect(localizeHref('/', 'ca')).toBe('/ca/');
  });

  it('returns untouched what it will not localize', () => {
    expect(localizeHref('/downloads/x.pdf', 'ca')).toBe('/downloads/x.pdf');
    expect(localizeHref('https://example.com/', 'ca')).toBe('https://example.com/');
  });
});

describe('localizeHtmlLinks', () => {
  it('rewrites internal anchors and reports how many', () => {
    const { html, changed } = localizeHtmlLinks(
      `<nav>${a('/eco-1bach/')}${a('/juegos/')}${a('https://example.com/')}</nav>`,
    );
    expect(changed).toBe(2);
    expect(html).toContain('href="/ca/eco-1bach/"');
    expect(html).toContain('href="/ca/juegos/"');
    expect(html).toContain('href="https://example.com/"');
  });

  // The switcher's whole job is to leave the current language, so prefixing it
  // would make "ver en español" point back at Valencian.
  it('leaves an anchor that declares its target language', () => {
    const html = `<a class="lang-opt" href="/eco-1bach/" hreflang="es">Castellano</a>`;
    expect(localizeHtmlLinks(html).changed).toBe(0);
    expect(hrefIn(localizeHtmlLinks(html).html)).toBe('/eco-1bach/');
  });

  it('only touches <a>, never head links or other tags', () => {
    const html = [
      '<link rel="canonical" href="/eco-1bach/" />',
      '<link rel="alternate" hreflang="ca" href="/ca/eco-1bach/" />',
      '<img src="/img/x.png" />',
      '<form action="/api/jocs/start"></form>',
    ].join('');
    expect(localizeHtmlLinks(html)).toEqual({ html, changed: 0 });
  });

  it('is idempotent — a second pass changes nothing', () => {
    const once = localizeHtmlLinks(`<nav>${a('/eco-1bach/')}${a('/')}</nav>`);
    const twice = localizeHtmlLinks(once.html);
    expect(twice.changed).toBe(0);
    expect(twice.html).toBe(once.html);
  });

  it('handles href that is not the first attribute, and single quotes', () => {
    expect(hrefIn(localizeHtmlLinks(a('/juegos/', ' class="btn" data-x="1"')).html)).toBe(
      '/ca/juegos/',
    );
    expect(localizeHtmlLinks(`<a href='/juegos/'>x</a>`).html).toBe(`<a href='/ca/juegos/'>x</a>`);
  });

  // `data-href` is a different attribute and must not be rewritten.
  it('does not match a suffixed attribute name', () => {
    const html = `<a data-href="/eco-1bach/" href="/juegos/">x</a>`;
    const out = localizeHtmlLinks(html);
    expect(out.changed).toBe(1);
    expect(out.html).toContain('data-href="/eco-1bach/"');
    expect(out.html).toContain('href="/ca/juegos/"');
  });

  // A tolerant tag matcher is needed because `>` is legal inside an attribute.
  // Asserted on the whole string rather than through `hrefIn`, whose own naive
  // `[^>]*` cannot read these back — the point is that the rewrite does not
  // depend on where in the tag the href sits.
  it('survives a > inside an attribute value', () => {
    expect(localizeHtmlLinks(`<a title="A > B" href="/juegos/">x</a>`).html).toBe(
      `<a title="A > B" href="/ca/juegos/">x</a>`,
    );
    expect(localizeHtmlLinks(`<a href="/juegos/" title="A > B">x</a>`).html).toBe(
      `<a href="/ca/juegos/" title="A > B">x</a>`,
    );
  });

  it('rewrites links written in the book prose, not just in templates', () => {
    const prose = `<p>Ho tens a <a href="/eco-1bach/recursos/frontera-posibilidades/">la ferramenta</a>.</p>`;
    expect(hrefIn(localizeHtmlLinks(prose).html)).toBe(
      '/ca/eco-1bach/recursos/frontera-posibilidades/',
    );
  });
});
