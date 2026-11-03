import { describe, expect, it } from 'vitest';
import { agruparPorUnidad, anclaActividades, materialPorUnidad } from './material-unidad';

const unidades = [
  { unidad: 2, slug: '02-mercado', title: 'El mercado' },
  { unidad: 1, slug: '01-economia', title: 'La economía' },
];

describe('materialPorUnidad', () => {
  it('lists the units in order with their chapter and slides', () => {
    const m = materialPorUnidad('eco-4eso', unidades, [], [], []);
    expect(m.map((u) => u.unidad)).toEqual([1, 2]);
    expect(m[0]).toMatchObject({
      title: 'La economía',
      libro: '/eco-4eso/libro/01-economia/',
      diapositivas: '/eco-4eso/diapositivas/01-economia/',
    });
  });

  it('links the test, counts the activities and lists the challenges of each unit', () => {
    const m = materialPorUnidad(
      'eco-4eso',
      unidades,
      [{ unidad: 2, slug: '02-mercado' }],
      [{ unidad: 2, slug: 'a' }, { unidad: 2, slug: 'b' }, { unidad: 1, slug: 'c' }],
      [{ unidad: 2, slug: '03-reto' }],
    );
    expect(m[1]).toMatchObject({
      test: '/eco-4eso/tests/02-mercado/',
      actividades: 2,
      actividadesHref: '/eco-4eso/actividades/#unidad-2',
      retos: ['/eco-4eso/retos/03-reto/'],
    });
    expect(m[0].test).toBeUndefined();
    expect(m[0].actividades).toBe(1);
    expect(m[0].retos).toEqual([]);
  });

  it('gives no activities link to a unit without activities', () => {
    const m = materialPorUnidad('eco-4eso', unidades, [], [], []);
    expect(m[0].actividadesHref).toBeUndefined();
  });

  it('uses the same anchor as the activities index', () => {
    expect(anclaActividades(7)).toBe('unidad-7');
  });
});

describe('agruparPorUnidad', () => {
  const act = (unidad_relacionada: number, id: string) => ({ id, data: { unidad_relacionada } });

  it('groups the activities by unit, in unit order, keeping their order inside each unit', () => {
    const grupos = agruparPorUnidad([act(2, 'b1'), act(1, 'a1'), act(2, 'b2'), act(1, 'a2')], new Map());
    expect(grupos.map((g) => g.unidad)).toEqual([1, 2]);
    expect(grupos.map((g) => g.items.map((x) => x.id))).toEqual([['a1', 'a2'], ['b1', 'b2']]);
  });

  it('names each group after its book unit, when there is one', () => {
    const grupos = agruparPorUnidad([act(1, 'a'), act(3, 'c')], new Map([[1, 'La economía']]));
    expect(grupos[0].titulo).toBe('La economía');
    expect(grupos[1].titulo).toBeUndefined();
  });

  it('gives no groups for no activities', () => {
    expect(agruparPorUnidad([], new Map())).toEqual([]);
  });
});
