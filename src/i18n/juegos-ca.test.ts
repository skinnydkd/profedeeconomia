import { describe, it, expect } from 'vitest';
import { JUEGOS } from '@/lib/juegos';
import { localizeJuego, JUEGOS_CA } from './juegos-ca';

describe('localizeJuego', () => {
  it('es returns the game unchanged', () => {
    expect(localizeJuego(JUEGOS[0], 'es')).toEqual(JUEGOS[0]);
  });
  it('ca overlays title and preserves slug', () => {
    const j = localizeJuego(JUEGOS[0], 'ca');
    expect(j.slug).toBe(JUEGOS[0].slug);
    expect(typeof j.title).toBe('string');
  });
  it('every overlay key is a real game slug', () => {
    const slugs = new Set(JUEGOS.map((j) => j.slug));
    for (const key of Object.keys(JUEGOS_CA)) expect(slugs.has(key)).toBe(true);
  });
  it('every game has a CA overlay', () => {
    for (const j of JUEGOS) expect(JUEGOS_CA[j.slug]).toBeDefined();
  });
});
