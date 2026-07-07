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
