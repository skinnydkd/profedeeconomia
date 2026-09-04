import { describe, it, expect } from 'vitest';
import { evaluar, type Objetivo } from './objetivos-smart';

const bueno: Objetivo = {
  accion: 'Terminar el módulo de administración de sistemas',
  indicador: 'temas aprobados',
  valorInicial: 2,
  valorObjetivo: 10,
  semanas: 16,
  ritmoActual: 0.4,
  motivo: 'Es el requisito para presentarme a las prácticas que quiero',
};

const letra = (r: ReturnType<typeof evaluar>, l: string) => r.chequeos.find((c) => c.letra === l)!;

describe('evaluar', () => {
  it('passes all five letters on a well-formed goal', () => {
    const r = evaluar(bueno);
    expect(r.valido).toBe(true);
    expect(r.puntuacion).toBe(5);
    expect(r.chequeos.every((c) => c.cumple)).toBe(true);
  });

  it('fails the S on a vague verb', () => {
    const r = evaluar({ ...bueno, accion: 'Mejorar en clase' });
    expect(letra(r, 'especifico').cumple).toBe(false);
    expect(letra(r, 'especifico').motivo).toBe('verbo-vago');
  });

  it('fails the S on an empty action', () => {
    expect(letra(evaluar({ ...bueno, accion: '  ' }), 'especifico').motivo).toBe('vacio');
  });

  it('fails the M without an indicator', () => {
    expect(letra(evaluar({ ...bueno, indicador: '' }), 'medible').motivo).toBe('vacio');
  });

  it('fails the M when the target equals the starting point', () => {
    const r = evaluar({ ...bueno, valorObjetivo: bueno.valorInicial });
    expect(letra(r, 'medible').motivo).toBe('sin-avance');
    expect(r.avance).toBe(0);
  });

  it('fails the T without a deadline, and then reports no pace', () => {
    const r = evaluar({ ...bueno, semanas: 0 });
    expect(letra(r, 'temporal').motivo).toBe('sin-plazo');
    expect(r.ritmoNecesario).toBeNaN();
  });

  it('fails the R without a reason', () => {
    expect(letra(evaluar({ ...bueno, motivo: '' }), 'relevante').motivo).toBe('vacio');
  });

  it('computes the pace the goal requires', () => {
    const r = evaluar(bueno);
    expect(r.avance).toBe(8);
    expect(r.ritmoNecesario).toBeCloseTo(0.5, 10);
  });

  it('reads the required pace against the one already sustained', () => {
    const r = evaluar(bueno);
    expect(r.exigencia).toBeCloseTo(1.25, 10);
    expect(letra(r, 'alcanzable').cumple).toBe(true);
  });

  it('flags the A only when the pace is more than triple the current one', () => {
    const justo = evaluar({ ...bueno, ritmoActual: 0.17 }); // ~2,9x
    expect(letra(justo, 'alcanzable').cumple).toBe(true);
    const imposible = evaluar({ ...bueno, ritmoActual: 0.1 }); // 5x
    expect(letra(imposible, 'alcanzable').cumple).toBe(false);
    expect(letra(imposible, 'alcanzable').motivo).toBe('ritmo-imposible');
  });

  it('does not flag the A when the current pace is unknown', () => {
    const r = evaluar({ ...bueno, ritmoActual: 0 });
    expect(r.exigencia).toBeNaN();
    expect(letra(r, 'alcanzable').cumple).toBe(true);
  });

  it('handles a goal that asks the indicator to go down', () => {
    const r = evaluar({ ...bueno, indicador: 'faltas de asistencia', valorInicial: 12, valorObjetivo: 2, ritmoActual: 0 });
    expect(r.avance).toBe(-10);
    expect(letra(r, 'medible').cumple).toBe(true);
    expect(r.ritmoNecesario).toBeCloseTo(-0.625, 6);
  });

  it('rejects non-finite numbers', () => {
    expect(evaluar({ ...bueno, semanas: NaN }).valido).toBe(false);
  });

  it('counts partial goals honestly', () => {
    const r = evaluar({ ...bueno, motivo: '', semanas: 0 });
    expect(r.puntuacion).toBe(3);
  });
});
