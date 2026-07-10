import { describe, it, expect } from 'vitest';
import { FAMILIAS_DEBATE } from '@/lib/debates';
import { FAMILIAS as FAMILIAS_DINAMICAS } from '@/lib/dinamicas';
import { MATERIAS } from '@/lib/proyectos';
import { FAMILIAS_HERRAMIENTA } from '@/lib/herramientas';
import { BLOQUES, AMBITOS } from '@/lib/olimpiada';
import {
  localizeFamilias,
  FAMILIAS_DEBATE_CA,
  FAMILIAS_DINAMICAS_CA,
  MATERIAS_PROYECTOS_CA,
  FAMILIAS_HERRAMIENTA_CA,
  BLOQUES_OLIMPIADA_CA,
  AMBITOS_OLIMPIADA_CA,
} from './familias-ca';

const cases = [
  ['debates', FAMILIAS_DEBATE, FAMILIAS_DEBATE_CA],
  ['dinamicas', FAMILIAS_DINAMICAS, FAMILIAS_DINAMICAS_CA],
  ['proyectos', MATERIAS, MATERIAS_PROYECTOS_CA],
  ['herramientas', FAMILIAS_HERRAMIENTA, FAMILIAS_HERRAMIENTA_CA],
  ['bloques', BLOQUES, BLOQUES_OLIMPIADA_CA],
  ['ambitos', AMBITOS, AMBITOS_OLIMPIADA_CA],
] as const;

describe('localizeFamilias', () => {
  it('es returns the list unchanged', () => {
    expect(localizeFamilias(FAMILIAS_DEBATE, FAMILIAS_DEBATE_CA, 'es')).toEqual(FAMILIAS_DEBATE);
  });
  it('ca overlays label/intro and preserves structural fields', () => {
    const [first] = localizeFamilias(FAMILIAS_DEBATE, FAMILIAS_DEBATE_CA, 'ca');
    expect(first.slug).toBe(FAMILIAS_DEBATE[0].slug);
    expect(first.colorVar).toBe(FAMILIAS_DEBATE[0].colorVar);
    expect(first.label).not.toBe('');
  });
  for (const [name, list, overlay] of cases) {
    it(`${name}: every overlay key is a real family slug`, () => {
      const slugs = new Set(list.map((f) => f.slug));
      for (const key of Object.keys(overlay)) expect(slugs.has(key)).toBe(true);
    });
    it(`${name}: every family has a CA overlay`, () => {
      for (const f of list) expect(overlay[f.slug]).toBeDefined();
    });
  }
});
