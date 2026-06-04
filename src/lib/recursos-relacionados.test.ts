import { describe, it, expect } from 'vitest';
import { buildIndiceRecursos, recursosDeUnidad, type RecursoEntrada } from './recursos-relacionados.ts';

const entradas: RecursoEntrada[] = [
  { tipo: 'juego', slug: 'econrisk', title: 'Econrisk', href: '/juegos/econrisk/', familiaColorVar: '--color-terra',
    unidades: [{ asignatura: 'eco-1bach', unidad: 1, nota: 'Escuelas de pensamiento.' }] },
  { tipo: 'dinamica', slug: '01-tragedia-comunes', title: 'La tragedia de los comunes', href: '/dinamicas/decisiones-comunes/01-tragedia-comunes/', familiaColorVar: '--color-taller3',
    unidades: [{ asignatura: 'eco-1bach', unidad: 6 }, { asignatura: 'eeae-bach', unidad: 3 }] },
];

describe('buildIndiceRecursos / recursosDeUnidad', () => {
  const idx = buildIndiceRecursos(entradas);

  it('agrupa por asignatura#unidad y por tipo, conservando la nota de cada vínculo', () => {
    const r = recursosDeUnidad(idx, 'eco-1bach', 1);
    expect(r.juego).toHaveLength(1);
    expect(r.juego[0].title).toBe('Econrisk');
    expect(r.juego[0].nota).toBe('Escuelas de pensamiento.');
    expect(r.dinamica).toHaveLength(0);
  });

  it('un mismo recurso aparece en cada unidad que referencia', () => {
    expect(recursosDeUnidad(idx, 'eco-1bach', 6).dinamica).toHaveLength(1);
    expect(recursosDeUnidad(idx, 'eeae-bach', 3).dinamica[0].slug).toBe('01-tragedia-comunes');
  });

  it('una unidad sin recursos devuelve todos los grupos vacíos, sin excepción', () => {
    const r = recursosDeUnidad(idx, 'fopp-4eso', 99);
    expect(r.dinamica).toEqual([]);
    expect(r.juego).toEqual([]);
    expect(r.herramienta).toEqual([]);
  });
});
