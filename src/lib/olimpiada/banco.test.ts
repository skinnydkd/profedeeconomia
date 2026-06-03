import { describe, it, expect } from 'vitest';
import { BANCO, preguntasDeBloque } from './banco.ts';
import { BLOQUE_SLUGS } from '../olimpiada.ts';

describe('BANCO', () => {
  it('every question is well-formed', () => {
    for (const p of BANCO) {
      expect(BLOQUE_SLUGS).toContain(p.bloque);
      expect(p.opciones.length).toBeGreaterThanOrEqual(2);
      expect(p.correcta).toBeGreaterThanOrEqual(0);
      expect(p.correcta).toBeLessThan(p.opciones.length);
    }
  });
  it('preguntasDeBloque filters by block', () => {
    if (BANCO.length) expect(preguntasDeBloque(BANCO[0].bloque).length).toBeGreaterThan(0);
  });
});
