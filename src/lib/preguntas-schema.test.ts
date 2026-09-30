import { describe, it, expect } from 'vitest';
import { preguntaSchema } from './preguntas-schema';

/**
 * CODE-WEB-09: the schema accepted a multiple-choice answer past the last
 * option and a matching whose lists disagreed, both unanswerable questions
 * that the player renders without complaint.
 */
const mc = { enunciado: '¿?', opciones: ['a', 'b', 'c'], explicacion: 'x' };
const rel = {
  tipo: 'relacionar',
  enunciado: 'Relaciona',
  izquierda: ['uno', 'dos'],
  derecha: ['1', '2'],
  correctas: [1, 0],
};

describe('preguntaSchema', () => {
  it('accepts a multiple-choice answer inside the options, with or without tipo', () => {
    expect(preguntaSchema.safeParse({ ...mc, correcta: 2 }).success).toBe(true);
    expect(preguntaSchema.safeParse({ ...mc, tipo: 'opcion-multiple', correcta: 0 }).success).toBe(true);
  });

  it('rejects a multiple-choice answer past the last option', () => {
    const r = preguntaSchema.safeParse({ ...mc, correcta: 3 });
    expect(r.success).toBe(false);
    expect(r.error?.issues[0].path).toEqual(['correcta']);
  });

  it('accepts a matching whose three lists agree', () => {
    expect(preguntaSchema.safeParse(rel).success).toBe(true);
  });

  it('rejects a matching whose lists have different lengths', () => {
    expect(preguntaSchema.safeParse({ ...rel, derecha: ['1', '2', '3'] }).success).toBe(false);
    expect(preguntaSchema.safeParse({ ...rel, correctas: [1] }).success).toBe(false);
  });

  it('rejects a matching that points past the right-hand list', () => {
    expect(preguntaSchema.safeParse({ ...rel, correctas: [2, 0] }).success).toBe(false);
  });

  it('leaves the other question types as they were', () => {
    expect(preguntaSchema.safeParse({ tipo: 'verdadero-falso', enunciado: 'x', correcta: true }).success).toBe(true);
    expect(preguntaSchema.safeParse({ tipo: 'numerico', enunciado: 'x', respuesta: 2 }).success).toBe(true);
  });
});
