import { describe, it, expect } from 'vitest';
import {
  ITINERARIOS,
  fasesForItinerario,
  unidadSlug,
  type FaseLike,
  type UnidadLike,
} from './emprendimiento';

const FASES: FaseLike[] = [
  { fase: 3 }, { fase: 1 }, { fase: 11 }, { fase: 4 }, { fase: 8 }, { fase: 2 },
];

describe('ITINERARIOS', () => {
  it('defines exactly three itineraries with the expected ids', () => {
    expect(ITINERARIOS.map((i) => i.id)).toEqual(['sprint-eso', 'bach-fp', 'a-la-carta']);
  });

  it('sprint-eso includes only lean-core phases 1,2,3,4,11', () => {
    const sprint = ITINERARIOS.find((i) => i.id === 'sprint-eso')!;
    expect(sprint.fases).toEqual([1, 2, 3, 4, 11]);
  });

  it('a-la-carta has null fases (means all)', () => {
    const carta = ITINERARIOS.find((i) => i.id === 'a-la-carta')!;
    expect(carta.fases).toBeNull();
  });
});

describe('fasesForItinerario', () => {
  it('returns sprint phases sorted ascending', () => {
    const out = fasesForItinerario(FASES, 'sprint-eso').map((f) => f.fase);
    expect(out).toEqual([1, 2, 3, 4, 11]);
  });

  it('a-la-carta returns ALL phases sorted, none filtered out', () => {
    const out = fasesForItinerario(FASES, 'a-la-carta').map((f) => f.fase);
    expect(out).toEqual([1, 2, 3, 4, 8, 11]);
  });

  it('does not mutate the input array', () => {
    const input = [...FASES];
    fasesForItinerario(input, 'sprint-eso');
    expect(input.map((f) => f.fase)).toEqual([3, 1, 11, 4, 8, 2]);
  });

  it('skips phases not present in the data (e.g. fase 5 absent)', () => {
    const out = fasesForItinerario(FASES, 'bach-fp').map((f) => f.fase);
    expect(out).toEqual([1, 2, 3, 4, 8, 11]); // 5,6,7,9,10 absent in fixture
  });
});

describe('unidadSlug (bridge link resolution)', () => {
  const LIBRO: UnidadLike[] = [
    {
      id: 'edmn-2bach/libro/09-funcion-financiera.mdx',
      data: { asignatura: 'edmn-2bach', unidad: 9, estado: 'publicado' },
    },
    {
      id: 'eco-1bach/libro/10-sistema-financiero-dinero.mdx',
      data: { asignatura: 'eco-1bach', unidad: 10, estado: 'publicado' },
    },
    {
      id: 'eco-4eso/libro/04-mercado-trabajo.mdx',
      data: { asignatura: 'eco-4eso', unidad: 4, estado: 'borrador' },
    },
  ];

  it('resolves (asignatura, número) to the real filename slug, not the bare number', () => {
    // Bug: bridges linked to /edmn-2bach/libro/9 (404); the real route is the slug.
    expect(unidadSlug(LIBRO, 'edmn-2bach', 9)).toBe('09-funcion-financiera');
    expect(unidadSlug(LIBRO, 'eco-1bach', 10)).toBe('10-sistema-financiero-dinero');
  });

  it('returns null when no published unit matches (avoid a broken 404 link)', () => {
    expect(unidadSlug(LIBRO, 'eco-4eso', 4)).toBeNull(); // exists but borrador
    expect(unidadSlug(LIBRO, 'edmn-2bach', 99)).toBeNull(); // missing
    expect(unidadSlug(LIBRO, 'no-existe', 1)).toBeNull(); // unknown asignatura
  });
});
