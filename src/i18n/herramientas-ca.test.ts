import { describe, it, expect } from 'vitest';
import { HERRAMIENTAS } from '@/lib/herramientas';
import { localizeHerramienta, HERRAMIENTAS_CA } from './herramientas-ca';

describe('localizeHerramienta', () => {
  it('es returns the tool unchanged', () => {
    expect(localizeHerramienta(HERRAMIENTAS[0], 'es')).toEqual(HERRAMIENTAS[0]);
  });
  it('ca overlays title and preserves structural fields', () => {
    const h = localizeHerramienta(HERRAMIENTAS[0], 'ca');
    expect(h.slug).toBe(HERRAMIENTAS[0].slug);
    expect(h.familia).toBe(HERRAMIENTAS[0].familia);
    expect(h.componente).toBe(HERRAMIENTAS[0].componente);
    expect(h.title).not.toBe(HERRAMIENTAS[0].title);
  });
  it('every overlay key is a real tool slug', () => {
    const slugs = new Set(HERRAMIENTAS.map((h) => h.slug));
    for (const key of Object.keys(HERRAMIENTAS_CA)) expect(slugs.has(key)).toBe(true);
  });
  it('every tool has a CA overlay', () => {
    for (const h of HERRAMIENTAS) expect(HERRAMIENTAS_CA[h.slug]).toBeDefined();
  });
});
