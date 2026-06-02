import { describe, it, expect } from 'vitest';
import { groupByFamilia, findBrokenUnidadRefs, type Familia } from './familia-grouping.ts';

const FAMS: Familia[] = [
  { slug: 'a', label: 'A', intro: '', colorVar: '--color-eco1' },
  { slug: 'b', label: 'B', intro: '', colorVar: '--color-fopp' },
];
type Item = { slug: string; data: { familia: string; orden: number; title: string;
  unidades_relacionadas: { asignatura: string; unidad: number }[] } };
const make = (slug: string, familia: string, orden: number,
  refs: Item['data']['unidades_relacionadas'] = []): Item =>
  ({ slug, data: { familia, orden, title: slug, unidades_relacionadas: refs } });

describe('groupByFamilia (generic)', () => {
  it('groups by family in the provided order, sorted by orden, dropping empty', () => {
    const groups = groupByFamilia(FAMS, [
      make('b1', 'b', 2), make('a2', 'a', 2), make('a1', 'a', 1),
    ]);
    expect(groups.map((g) => g.familia.slug)).toEqual(['a', 'b']);
    expect(groups[0].items.map((d) => d.slug)).toEqual(['a1', 'a2']);
    expect(groups[1].items.map((d) => d.slug)).toEqual(['b1']);
  });
});

describe('findBrokenUnidadRefs (generic)', () => {
  it('flags refs whose unit is not in the published set', () => {
    const items = [make('a1', 'a', 1, [
      { asignatura: 'fopp-4eso', unidad: 3 }, { asignatura: 'eeae-bach', unidad: 99 },
    ])];
    expect(findBrokenUnidadRefs(items, new Set(['fopp-4eso#3']))).toEqual([
      { slug: 'a1', asignatura: 'eeae-bach', unidad: 99 },
    ]);
  });
});
