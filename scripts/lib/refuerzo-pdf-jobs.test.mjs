import { describe, it, expect } from 'vitest';
import { parseRefuerzoPrintPath } from './refuerzo-pdf-jobs.mjs';

describe('parseRefuerzoPrintPath', () => {
  it('extracts asignatura/evaluacion/tipo and builds route + out name', () => {
    const rel = 'edmn-2bach/refuerzo/imprimir/eval1-refuerzo/index.html';
    expect(parseRefuerzoPrintPath(rel)).toEqual({
      asignatura: 'edmn-2bach',
      evaluacion: 1,
      tipo: 'refuerzo',
      route: 'edmn-2bach/refuerzo/imprimir/eval1-refuerzo',
      out: 'edmn-2bach-refuerzo-eval1.pdf',
    });
  });

  it('handles ampliacion', () => {
    const rel = 'eco-1bach/refuerzo/imprimir/eval3-ampliacion/index.html';
    expect(parseRefuerzoPrintPath(rel)?.out).toBe('eco-1bach-ampliacion-eval3.pdf');
  });

  it('returns null for non-matching paths', () => {
    expect(parseRefuerzoPrintPath('edmn-2bach/refuerzo/index.html')).toBeNull();
    expect(parseRefuerzoPrintPath('edmn-2bach/actividades/imprimir/alumno/index.html')).toBeNull();
    expect(parseRefuerzoPrintPath('edmn-2bach/refuerzo/imprimir/eval9-x/index.html')).toBeNull();
  });

  it('normalizes Windows backslashes', () => {
    const rel = 'fopp-4eso\\refuerzo\\imprimir\\eval2-refuerzo\\index.html';
    expect(parseRefuerzoPrintPath(rel)?.evaluacion).toBe(2);
  });
});
