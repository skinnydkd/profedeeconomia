import { describe, it, expect } from 'vitest';
import { FAMILIAS, familiaMeta, groupByFamilia, findBrokenUnidadRefs } from './dinamicas.ts';

type D = { slug: string; data: { familia: string; orden: number; title: string;
  unidades_relacionadas: { asignatura: string; unidad: number }[] } };

const make = (slug: string, familia: string, orden: number, refs: D['data']['unidades_relacionadas'] = []): D =>
  ({ slug, data: { familia, orden, title: slug, unidades_relacionadas: refs } });

describe('FAMILIAS', () => {
  it('declares the 7 families in display order with a color token each', () => {
    expect(FAMILIAS.map((f) => f.slug)).toEqual([
      'mercat-treball', 'mercats-preus', 'distribucion-produccion',
      'decisiones-comunes', 'sistemas-debates', 'empresa-organizacion', 'teoria-juegos',
    ]);
    for (const f of FAMILIAS) expect(f.colorVar).toMatch(/^--color-[a-z0-9]+$/);
  });
});

describe('familiaMeta', () => {
  it('returns the metadata for a known family', () => {
    expect(familiaMeta('teoria-juegos').label).toBe('Teoría de juegos');
  });
  it('throws on an unknown family', () => {
    expect(() => familiaMeta('nope')).toThrow(/unknown familia/i);
  });
});

describe('groupByFamilia', () => {
  it('groups dinámicas by family in FAMILIAS order, sorted by orden within each', () => {
    const items = [
      make('b1', 'mercats-preus', 2), make('a2', 'mercat-treball', 2),
      make('a1', 'mercat-treball', 1), make('b0', 'mercats-preus', 1),
    ];
    const groups = groupByFamilia(items);
    expect(groups.map((g) => g.familia.slug)).toEqual(['mercat-treball', 'mercats-preus']);
    expect(groups[0].dinamicas.map((d) => d.slug)).toEqual(['a1', 'a2']);
    expect(groups[1].dinamicas.map((d) => d.slug)).toEqual(['b0', 'b1']);
  });
  it('omits families that have no dinámicas', () => {
    const groups = groupByFamilia([make('x', 'teoria-juegos', 1)]);
    expect(groups).toHaveLength(1);
    expect(groups[0].familia.slug).toBe('teoria-juegos');
  });
});

describe('findBrokenUnidadRefs', () => {
  const libroUnits = new Set(['fopp-4eso#3', 'eeae-bach#5']);
  it('returns nothing when every ref points to an existing unit', () => {
    const items = [make('a1', 'mercat-treball', 1, [{ asignatura: 'fopp-4eso', unidad: 3 }])];
    expect(findBrokenUnidadRefs(items, libroUnits)).toEqual([]);
  });
  it('flags a ref whose unit does not exist', () => {
    const items = [make('a1', 'mercat-treball', 1, [
      { asignatura: 'fopp-4eso', unidad: 3 }, { asignatura: 'eeae-bach', unidad: 99 },
    ])];
    expect(findBrokenUnidadRefs(items, libroUnits)).toEqual([
      { slug: 'a1', asignatura: 'eeae-bach', unidad: 99 },
    ]);
  });
});
