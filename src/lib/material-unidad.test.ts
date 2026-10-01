import { describe, expect, it } from 'vitest';
import { anclaActividades, materialPorUnidad } from './material-unidad';

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
