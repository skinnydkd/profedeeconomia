import { describe, it, expect } from 'vitest';
import {
  GENERADOR_KEYS, GENERADORES_NATIVOS, GENERADORES_EXTERNOS,
  generadorPorSlug, gruposNativos,
} from './generadores.ts';

describe('GENERADORES_NATIVOS', () => {
  it('has 6 tools, each with a valid componente, unique slug, valid grupo/tipo', () => {
    expect(GENERADORES_NATIVOS).toHaveLength(6);
    const slugs = new Set<string>();
    for (const g of GENERADORES_NATIVOS) {
      expect(GENERADOR_KEYS).toContain(g.componente);
      expect(['evaluacion', 'aula']).toContain(g.grupo);
      expect(['rubrica', 'calculadora', 'plantilla']).toContain(g.tipo);
      slugs.add(g.slug);
    }
    expect(slugs.size).toBe(6);
  });
});

describe('GENERADORES_EXTERNOS', () => {
  it('lists the 2 external generators with an href', () => {
    expect(GENERADORES_EXTERNOS.length).toBe(2);
    for (const e of GENERADORES_EXTERNOS) expect(e.href).toMatch(/^https?:\/\//);
  });
});

describe('generadorPorSlug', () => {
  it('resolves a known tool and is undefined otherwise', () => {
    expect(generadorPorSlug('rubricas')?.componente).toBe('Rubrica');
    expect(generadorPorSlug('nope')).toBeUndefined();
  });
});

describe('gruposNativos', () => {
  it('groups by grupo (evaluacion then aula)', () => {
    const g = gruposNativos();
    expect(g.map((x) => x.grupo)).toEqual(['evaluacion', 'aula']);
    expect(g[0].items.every((it) => it.grupo === 'evaluacion')).toBe(true);
  });
});
