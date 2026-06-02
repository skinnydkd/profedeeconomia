import { describe, it, expect } from 'vitest';
import { JUEGOS, findBrokenJuegoRefs } from './juegos.ts';

describe('JUEGOS', () => {
  it('declares the 5 games with unique slugs', () => {
    const slugs = JUEGOS.map((j) => j.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs).toEqual(
      expect.arrayContaining(['stonks', 'econrisk', 'econopoly', 'cajut', 'insider']),
    );
  });

  it('marks exactly the four tablero/party games as imprimible', () => {
    const printables = JUEGOS.filter((j) => j.imprimible).map((j) => j.slug).sort();
    expect(printables).toEqual(['cajut', 'econopoly', 'econrisk', 'insider']);
  });

  it('gives every game at least one curriculum bridge', () => {
    for (const j of JUEGOS) expect(j.unidades_relacionadas.length).toBeGreaterThan(0);
  });

  it('gives every game an entry href under /juegos/', () => {
    for (const j of JUEGOS) expect(j.href).toMatch(/^\/juegos\/.+\/$/);
  });

  it('routes multiplayer (party) games to their host page', () => {
    for (const j of JUEGOS.filter((j) => j.tipo === 'party')) {
      expect(j.href).toBe(`/juegos/${j.slug}/host/`);
    }
  });

  it('routes single-player games to their own page', () => {
    for (const j of JUEGOS.filter((j) => j.tipo !== 'party')) {
      expect(j.href).toBe(`/juegos/${j.slug}/`);
    }
  });
});

describe('findBrokenJuegoRefs', () => {
  const libroUnits = new Set(['eco-1bach#4', 'eco-1bach#6']);

  it('returns nothing when refs exist', () => {
    const games = [{ slug: 'g', unidades_relacionadas: [{ asignatura: 'eco-1bach', unidad: 4 }] }];
    expect(findBrokenJuegoRefs(games as any, libroUnits)).toEqual([]);
  });

  it('flags a missing unit', () => {
    const games = [{ slug: 'g', unidades_relacionadas: [{ asignatura: 'eco-1bach', unidad: 9 }] }];
    expect(findBrokenJuegoRefs(games as any, libroUnits)).toEqual([
      { slug: 'g', asignatura: 'eco-1bach', unidad: 9 },
    ]);
  });
});
