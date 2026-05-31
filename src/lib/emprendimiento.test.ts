import { describe, it, expect } from 'vitest';
import { ITINERARIOS, fasesForItinerario, type FaseLike } from './emprendimiento';

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
