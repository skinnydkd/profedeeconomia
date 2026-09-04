import { describe, it, expect } from 'vitest';
import { analizar, ROLES, UMBRAL_COBERTURA, type Persona } from './roles-equipo';

const equipo: Persona[] = [
  { nombre: 'Ada', puntuaciones: { cerebro: 4, evaluador: 3, implementador: 1 } },
  { nombre: 'Bruno', puntuaciones: { implementador: 4, finalizador: 3, cerebro: 1 } },
  { nombre: 'Carla', puntuaciones: { coordinador: 4, cohesionador: 3 } },
];

const rol = (r: ReturnType<typeof analizar>, name: string) => r.cobertura.find((c) => c.rol === name)!;

describe('analizar', () => {
  it('reads each person’s dominant role', () => {
    const r = analizar(equipo);
    expect(r.valido).toBe(true);
    expect(r.personas[0].dominantes).toEqual(['cerebro']);
    expect(r.personas[1].dominantes).toEqual(['implementador']);
    expect(r.personas[2].dominantes).toEqual(['coordinador']);
  });

  it('reports every tied role rather than picking one', () => {
    const r = analizar([{ nombre: 'X', puntuaciones: { cerebro: 3, coordinador: 3 } }]);
    expect(r.personas[0].dominantes).toEqual(['cerebro', 'coordinador']);
  });

  it('gives no dominant role to a person who scored nothing', () => {
    const r = analizar([{ nombre: 'X', puntuaciones: {} }]);
    expect(r.personas[0].dominantes).toEqual([]);
    expect(r.personas[0].total).toBe(0);
  });

  it('counts a role as covered from the threshold up', () => {
    const r = analizar(equipo);
    expect(rol(r, 'cerebro').cubiertoPor).toEqual(['Ada']);
    expect(rol(r, 'evaluador').cubiertoPor).toEqual(['Ada']);
    expect(rol(r, 'implementador').cubiertoPor).toEqual(['Bruno']);
  });

  it('does not count a score just below the threshold', () => {
    const r = analizar([{ nombre: 'X', puntuaciones: { cerebro: UMBRAL_COBERTURA - 1 } }]);
    expect(rol(r, 'cerebro').cubiertoPor).toEqual([]);
    expect(rol(r, 'cerebro').estado).toBe('hueco');
  });

  it('lists the roles nobody covers', () => {
    const r = analizar(equipo);
    expect(r.huecos).toEqual([]);
    const flojo = analizar([{ nombre: 'X', puntuaciones: { cerebro: 4 } }]);
    expect(flojo.huecos).toEqual(ROLES.filter((x) => x !== 'cerebro'));
  });

  it('flags a role three or more people cover as crowded, not strong', () => {
    const todos = analizar([
      { nombre: 'A', puntuaciones: { cerebro: 4 } },
      { nombre: 'B', puntuaciones: { cerebro: 4 } },
      { nombre: 'C', puntuaciones: { cerebro: 3 } },
    ]);
    expect(rol(todos, 'cerebro').estado).toBe('saturado');
    expect(todos.saturados).toEqual(['cerebro']);
  });

  it('adds up the team’s strength in each role', () => {
    const r = analizar(equipo);
    expect(rol(r, 'cerebro').suma).toBe(5);
    expect(rol(r, 'coordinador').suma).toBe(4);
  });

  it('treats a missing role as zero, not as an error', () => {
    const r = analizar([{ nombre: 'X', puntuaciones: { cerebro: 2 } }]);
    expect(r.valido).toBe(true);
    expect(rol(r, 'finalizador').suma).toBe(0);
  });

  it('rejects an empty team', () => {
    expect(analizar([]).valido).toBe(false);
  });

  it('rejects scores outside 0–4', () => {
    expect(analizar([{ nombre: 'X', puntuaciones: { cerebro: 5 } }]).valido).toBe(false);
    expect(analizar([{ nombre: 'X', puntuaciones: { cerebro: -1 } }]).valido).toBe(false);
    expect(analizar([{ nombre: 'X', puntuaciones: { cerebro: NaN } }]).valido).toBe(false);
  });

  it('covers every role exactly once in the coverage report', () => {
    const r = analizar(equipo);
    expect(r.cobertura.map((c) => c.rol)).toEqual(ROLES);
  });
});
