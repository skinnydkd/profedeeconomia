import { describe, it, expect } from 'vitest';
import { GENERADORES_NATIVOS, GENERADORES_EXTERNOS } from '@/lib/generadores';
import {
  localizeGeneradorNativo,
  GENERADORES_NATIVOS_CA,
  localizeGeneradorExterno,
  GENERADORES_EXTERNOS_CA,
} from './generadores-ca';

describe('generadores overlays', () => {
  it('es returns unchanged', () => {
    expect(localizeGeneradorNativo(GENERADORES_NATIVOS[0], 'es')).toEqual(GENERADORES_NATIVOS[0]);
    expect(localizeGeneradorExterno(GENERADORES_EXTERNOS[0], 'es')).toEqual(GENERADORES_EXTERNOS[0]);
  });
  it('ca overlays the native title and preserves structural fields', () => {
    const g = localizeGeneradorNativo(GENERADORES_NATIVOS[0], 'ca');
    expect(g.slug).toBe(GENERADORES_NATIVOS[0].slug);
    expect(g.grupo).toBe(GENERADORES_NATIVOS[0].grupo);
    expect(g.title).not.toBe(GENERADORES_NATIVOS[0].title);
  });
  it('ca overlays the external title and preserves the href', () => {
    const g = localizeGeneradorExterno(GENERADORES_EXTERNOS[0], 'ca');
    expect(g.href).toBe(GENERADORES_EXTERNOS[0].href);
    expect(g.title).not.toBe(GENERADORES_EXTERNOS[0].title);
  });
  it('every native overlay key is a real slug + every native has an overlay', () => {
    const slugs = new Set(GENERADORES_NATIVOS.map((g) => g.slug));
    for (const key of Object.keys(GENERADORES_NATIVOS_CA)) expect(slugs.has(key)).toBe(true);
    for (const g of GENERADORES_NATIVOS) expect(GENERADORES_NATIVOS_CA[g.slug]).toBeDefined();
  });
  // Externals have no slug and BOTH share the same href, so the overlay is
  // keyed by their (unique) ES title.
  it('external titles are unique, so they are a safe overlay key', () => {
    const titles = new Set(GENERADORES_EXTERNOS.map((g) => g.title));
    expect(titles.size).toBe(GENERADORES_EXTERNOS.length);
  });
  it('every external overlay key is a real title + every external has an overlay', () => {
    const titles = new Set(GENERADORES_EXTERNOS.map((g) => g.title));
    for (const key of Object.keys(GENERADORES_EXTERNOS_CA)) expect(titles.has(key)).toBe(true);
    for (const g of GENERADORES_EXTERNOS) expect(GENERADORES_EXTERNOS_CA[g.title]).toBeDefined();
  });
});
