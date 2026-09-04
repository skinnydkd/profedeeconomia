import { describe, it, expect } from 'vitest';
import { evaluar, exposicionTarea, UMBRAL_ALTA, type Tarea } from './automatizacion';

const t = (over: Partial<Tarea> = {}): Tarea => ({
  nombre: 'x', horas: 10, rutinaria: false,
  requiereCriterio: false, requiereTrato: false, requiereManos: false, ...over,
});

describe('exposicionTarea', () => {
  it('rates a purely routine task as highly exposed', () => {
    expect(exposicionTarea(t({ rutinaria: true }))).toBeCloseTo(0.9, 4);
  });
  it('rates a non-routine task lower to begin with', () => {
    expect(exposicionTarea(t())).toBeCloseTo(0.35, 4);
  });
  it('lowers exposure for judgement, human contact and unpredictable physical work', () => {
    expect(exposicionTarea(t({ rutinaria: true, requiereCriterio: true }))).toBeCloseTo(0.6, 4);
    expect(exposicionTarea(t({ rutinaria: true, requiereTrato: true }))).toBeCloseTo(0.65, 4);
    expect(exposicionTarea(t({ rutinaria: true, requiereManos: true }))).toBeCloseTo(0.75, 4);
  });
  it('stacks the protective factors', () => {
    expect(exposicionTarea(t({ rutinaria: true, requiereCriterio: true, requiereTrato: true })))
      .toBeCloseTo(0.35, 4);
  });
  it('never leaves the 0–1 range', () => {
    const e = exposicionTarea(t({ requiereCriterio: true, requiereTrato: true, requiereManos: true }));
    expect(e).toBeGreaterThanOrEqual(0);
    expect(e).toBeLessThanOrEqual(1);
  });
});

describe('evaluar', () => {
  const tareas: Tarea[] = [
    t({ nombre: 'Pasar albaranes a la hoja', horas: 8, rutinaria: true }),
    t({ nombre: 'Atender a clientes con incidencias', horas: 12, requiereTrato: true, requiereCriterio: true }),
    t({ nombre: 'Reparar averías imprevistas', horas: 15, requiereCriterio: true, requiereManos: true }),
    t({ nombre: 'Archivar documentación', horas: 5, rutinaria: true }),
  ];
  const r = evaluar(tareas);

  it('weights exposure by hours, not by number of tasks', () => {
    expect(r.valido).toBe(true);
    expect(r.horasTotales).toBe(40);
    const manual = tareas.reduce((s, x) => s + exposicionTarea(x) * x.horas, 0) / 40;
    expect(r.exposicionMedia).toBeCloseTo(manual, 6);
  });

  it('adds up the hours in highly exposed tasks', () => {
    expect(r.horasAltaExposicion).toBe(13);
  });

  it('describes the core of the job, most protected first', () => {
    expect(r.horasNucleo).toBe(27);
    expect(r.nucleo.every((x) => x.exposicion < UMBRAL_ALTA)).toBe(true);
    // Sorted ascending by exposure; ties keep their input order.
    const exps = r.nucleo.map((x) => x.exposicion);
    expect(exps).toEqual([...exps].sort((a, b) => a - b));
    expect(r.nucleo[0].exposicion).toBe(Math.min(...exps));
  });

  it('saturates the protective factors at zero rather than going negative', () => {
    // Both of these subtract more than the 0.35 base, so they tie at 0 exposure
    // instead of ranking against each other on a meaningless negative score.
    const atender = r.tareas.find((x) => x.nombre === 'Atender a clientes con incidencias')!;
    const reparar = r.tareas.find((x) => x.nombre === 'Reparar averías imprevistas')!;
    expect(atender.exposicion).toBe(0);
    expect(reparar.exposicion).toBe(0);
  });

  it('sorts the full list most exposed first', () => {
    expect(r.tareas[0].exposicion).toBeGreaterThanOrEqual(r.tareas[1].exposicion);
    expect(r.tareas[0].rutinaria).toBe(true);
  });

  it('accounts for every hour: exposed plus core equals the total', () => {
    expect(r.horasAltaExposicion + r.horasNucleo).toBe(r.horasTotales);
  });

  it('handles a job that is entirely routine', () => {
    const todo = evaluar([t({ horas: 40, rutinaria: true })]);
    expect(todo.exposicionMedia).toBeCloseTo(0.9, 4);
    expect(todo.nucleo).toEqual([]);
    expect(todo.horasNucleo).toBe(0);
  });

  it('handles a job with nothing routine in it', () => {
    const nada = evaluar([t({ horas: 40, requiereCriterio: true, requiereTrato: true })]);
    expect(nada.horasAltaExposicion).toBe(0);
    expect(nada.horasNucleo).toBe(40);
  });

  it('rejects an empty list or zero total hours', () => {
    expect(evaluar([]).valido).toBe(false);
    expect(evaluar([t({ horas: 0 })]).valido).toBe(false);
  });

  it('rejects negative hours', () => {
    expect(evaluar([t({ horas: -5 })]).valido).toBe(false);
  });
});
