import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { ASIGNATURAS_LIST, leyCurricular } from './asignaturas';

/**
 * FP modules (IPE I/II) hang from the LOFP, not the LOMLOE. The print and
 * evaluación templates are shared by every subject, so the law must come from
 * leyCurricular(a), never from a hardcoded string.
 */
const TEMPLATES = [
  'src/pages/[asignatura]/libro/imprimir.astro',
  'src/pages/[asignatura]/actividades/imprimir/[modo].astro',
  'src/pages/[asignatura]/actividades/[slug]/imprimir.astro',
  'src/pages/[asignatura]/evaluacion/index.astro',
];

describe('leyCurricular', () => {
  it('FP subjects are LOFP, the rest LOMLOE', () => {
    for (const a of ASIGNATURAS_LIST) {
      expect(leyCurricular(a)).toBe(a.etapa === 'fp' ? 'LOFP' : 'LOMLOE');
    }
    expect(ASIGNATURAS_LIST.filter((a) => leyCurricular(a) === 'LOFP').map((a) => a.slug).sort()).toEqual([
      'ipe1-fp',
      'ipe2-fp',
    ]);
  });

  it.each(TEMPLATES)('%s never hardcodes LOMLOE', (path) => {
    const src = readFileSync(path, 'utf8');
    expect(src).not.toMatch(/LOMLOE/);
    expect(src).toContain('leyCurricular(a)');
  });
});

/**
 * FP modules are assessed by resultados de aprendizaje (RA), not by the
 * competencias específicas of ESO/Bachillerato: the evaluación copy has to
 * say so for IPE I/II, as their own content does.
 */
describe('evaluación copy for FP', () => {
  const src = readFileSync('src/pages/[asignatura]/evaluacion/index.astro', 'utf8');
  it('names the resultados de aprendizaje in both languages', () => {
    expect(src).toContain('Resultados de aprendizaje');
    expect(src).toContain("Resultats d'aprenentatge");
  });
});
