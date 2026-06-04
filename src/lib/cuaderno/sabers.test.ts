import { describe, it, expect } from 'vitest';
import { sabersDeActividad } from './sabers.ts';

const libroByUnit = new Map<string, string[]>([['eco-1bach#1', ['A.1', 'A.3']]]);

describe('sabersDeActividad', () => {
  it('uses the activity own sabers when present', () => {
    expect(sabersDeActividad({ asignatura: 'eco-1bach', unidad_relacionada: 1, sabers: ['B.2'] }, libroByUnit)).toEqual(['B.2']);
  });
  it('derives from the libro unit when the activity has none', () => {
    expect(sabersDeActividad({ asignatura: 'eco-1bach', unidad_relacionada: 1, sabers: [] }, libroByUnit)).toEqual(['A.1', 'A.3']);
  });
  it('returns [] when neither exists', () => {
    expect(sabersDeActividad({ asignatura: 'x', unidad_relacionada: 9, sabers: [] }, libroByUnit)).toEqual([]);
  });
});
