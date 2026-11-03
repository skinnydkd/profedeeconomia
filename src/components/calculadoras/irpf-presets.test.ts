import { describe, it, expect } from 'vitest';
import { simularDeclaracion } from '../../lib/calc/declaracion-irpf';
import { PRESETS } from './IRPFDeclaracion';

/**
 * The presets are named after their outcome («retuvo de más», «retuvo de
 * menos»…). When the tax figures change, a preset can silently land on the
 * other side of its own label, as «Sueldo medio, retuvo de más» once did.
 */
const ESPERADO: Record<string, 'pagar' | 'devolver'> = {
  'sueldo-medio': 'devolver',
  'dos-pagadores': 'pagar',
  'familia-2-hijos': 'devolver',
  'primer-empleo': 'devolver',
};

describe('IRPFDeclaracion presets', () => {
  it('covers every preset', () => {
    expect(PRESETS.map((p) => p.id).sort()).toEqual(Object.keys(ESPERADO).sort());
  });

  for (const p of PRESETS) {
    it(`${p.id} lands on the side its label promises`, () => {
      const d = simularDeclaracion({
        rendimientosTrabajo: p.rendimientosTrabajo,
        retencionesPracticadas: p.retencionesPracticadas,
        hijos: p.hijos,
      });
      if (ESPERADO[p.id] === 'pagar') expect(d.aPagar).toBe(true);
      else expect(d.aDevolver).toBe(true);
    });
  }
});
