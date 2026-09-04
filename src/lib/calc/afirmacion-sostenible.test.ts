import { describe, it, expect } from 'vitest';
import { analizar, TOTAL_CHEQUEOS, type Afirmacion } from './afirmacion-sostenible';

const solida: Afirmacion = {
  tieneDato: true, defineAlcance: true, tieneReferencia: true,
  certificacionIndependiente: true, parteRelevante: true,
  masAllaDeLaLey: true, terminosVagos: false,
};
const hueca: Afirmacion = {
  tieneDato: false, defineAlcance: false, tieneReferencia: false,
  certificacionIndependiente: false, parteRelevante: false,
  masAllaDeLaLey: false, terminosVagos: true,
};

describe('analizar', () => {
  it('passes a claim that can be checked in every respect', () => {
    const r = analizar(solida);
    expect(r.valido).toBe(true);
    expect(r.senales).toEqual([]);
    expect(r.puntuacion).toBe(TOTAL_CHEQUEOS);
    expect(r.lectura).toBe('verificable');
  });

  it('raises every flag on an empty claim', () => {
    const r = analizar(hueca);
    expect(r.senales).toHaveLength(TOTAL_CHEQUEOS);
    expect(r.puntuacion).toBe(0);
    expect(r.lectura).toBe('no-verificable');
  });

  it('flags a claim with no figure', () => {
    expect(analizar({ ...solida, tieneDato: false }).senales).toEqual(['sin-dato']);
  });

  it('flags a claim with no baseline to compare against', () => {
    expect(analizar({ ...solida, tieneReferencia: false }).senales).toEqual(['sin-referencia']);
  });

  it('flags a self-declared claim', () => {
    expect(analizar({ ...solida, certificacionIndependiente: false }).senales).toEqual(['sin-certificacion']);
  });

  it('flags a claim about a detail while the main impact is untouched', () => {
    expect(analizar({ ...solida, parteRelevante: false }).senales).toEqual(['parte-por-el-todo']);
  });

  it('flags legal compliance presented as an achievement', () => {
    expect(analizar({ ...solida, masAllaDeLaLey: false }).senales).toEqual(['cumplir-la-ley']);
  });

  it('flags undefined terms', () => {
    expect(analizar({ ...solida, terminosVagos: true }).senales).toEqual(['termino-vago']);
  });

  it('reads one or two gaps as incomplete, not unverifiable', () => {
    expect(analizar({ ...solida, tieneDato: false }).lectura).toBe('incompleta');
    expect(analizar({ ...solida, tieneDato: false, defineAlcance: false }).lectura).toBe('incompleta');
    expect(analizar({ ...solida, tieneDato: false, defineAlcance: false, tieneReferencia: false }).lectura)
      .toBe('no-verificable');
  });

  it('never returns a verdict on truth, only on verifiability', () => {
    const lecturas = [solida, hueca, { ...solida, tieneDato: false }].map((a) => analizar(a).lectura);
    expect(lecturas.every((l) => ['verificable', 'incompleta', 'no-verificable'].includes(l))).toBe(true);
  });

  it('keeps the flags in the order they are worth raising', () => {
    const r = analizar({ ...hueca, tieneDato: true });
    expect(r.senales[0]).toBe('sin-alcance');
  });

  it('rejects a missing claim', () => {
    expect(analizar(undefined as unknown as Afirmacion).valido).toBe(false);
  });
});
