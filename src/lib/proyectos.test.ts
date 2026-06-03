import { describe, it, expect } from 'vitest';
import { MATERIAS, MATERIA_SLUGS, materiaMeta } from './proyectos.ts';

describe('MATERIAS', () => {
  it('declares the 6 subjects in display order with a color token each', () => {
    expect(MATERIAS.map((m) => m.slug)).toEqual([
      'historia', 'matematicas', 'geografia', 'etica-valores', 'lengua', 'tecnologia',
    ]);
    for (const m of MATERIAS) expect(m.colorVar).toMatch(/^--color-[a-z0-9-]+$/);
  });
  it('exposes the slugs as a non-empty tuple', () => {
    expect(MATERIA_SLUGS.length).toBe(MATERIAS.length);
  });
});

describe('materiaMeta', () => {
  it('returns metadata for a known subject', () => {
    expect(materiaMeta('matematicas').label).toBe('Matemáticas');
  });
  it('throws on an unknown subject', () => {
    expect(() => materiaMeta('nope')).toThrow(/unknown materia/i);
  });
});
