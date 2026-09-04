import { describe, it, expect } from 'vitest';
import { evaluar, PROMPTS, MINIMO_DIVERGENCIA, MINIMO_PROMPTS, type Idea } from './scamper';

const hacer = (n: number, prompts = PROMPTS): Idea[] =>
  Array.from({ length: n }, (_, i) => ({ prompt: prompts[i % prompts.length], texto: `idea ${i}` }));

describe('evaluar', () => {
  it('counts nothing on an empty session', () => {
    const r = evaluar([]);
    expect(r.valido).toBe(true);
    expect(r.total).toBe(0);
    expect(r.promptsUsados).toBe(0);
    expect(r.promptsSinUsar).toEqual(PROMPTS);
  });

  it('ignores ideas with no text', () => {
    const r = evaluar([{ prompt: 'sustituir', texto: '  ' }, { prompt: 'sustituir', texto: 'algo' }]);
    expect(r.total).toBe(1);
  });

  it('ignores an unknown prompt', () => {
    const r = evaluar([{ prompt: 'inventado' as never, texto: 'algo' }]);
    expect(r.total).toBe(0);
  });

  it('counts ideas per prompt', () => {
    const r = evaluar([
      { prompt: 'sustituir', texto: 'a' },
      { prompt: 'sustituir', texto: 'b' },
      { prompt: 'combinar', texto: 'c' },
    ]);
    expect(r.porPrompt.sustituir).toBe(2);
    expect(r.porPrompt.combinar).toBe(1);
    expect(r.porPrompt.eliminar).toBe(0);
    expect(r.promptsUsados).toBe(2);
  });

  it('lists the prompts nobody has touched', () => {
    const r = evaluar([{ prompt: 'sustituir', texto: 'a' }]);
    expect(r.promptsSinUsar).toEqual(PROMPTS.filter((p) => p !== 'sustituir'));
  });

  it('refuses to converge before there are enough ideas', () => {
    const r = evaluar(hacer(MINIMO_DIVERGENCIA - 1));
    expect(r.listoParaConverger).toBe(false);
    expect(r.ranking).toEqual([]);
  });

  it('refuses to converge when the ideas all come from too few angles', () => {
    const r = evaluar(hacer(20, ['sustituir', 'combinar']));
    expect(r.total).toBe(20);
    expect(r.promptsUsados).toBeLessThan(MINIMO_PROMPTS);
    expect(r.listoParaConverger).toBe(false);
  });

  it('allows convergence once there are enough ideas from enough angles', () => {
    const r = evaluar(hacer(MINIMO_DIVERGENCIA));
    expect(r.listoParaConverger).toBe(true);
    expect(r.ranking).toHaveLength(MINIMO_DIVERGENCIA);
  });

  it('ranks by potential over effort', () => {
    const ideas: Idea[] = [
      ...hacer(MINIMO_DIVERGENCIA - 2),
      { prompt: 'eliminar', texto: 'fácil y potente', potencial: 5, esfuerzo: 1 },
      { prompt: 'reordenar', texto: 'potente pero caro', potencial: 5, esfuerzo: 5 },
    ];
    const r = evaluar(ideas);
    expect(r.listoParaConverger).toBe(true);
    expect(r.ranking[0].texto).toBe('fácil y potente');
    expect(r.ranking[0].indice).toBe(5);
  });

  it('does not divide by zero when effort is left at zero', () => {
    const ideas: Idea[] = [
      ...hacer(MINIMO_DIVERGENCIA - 1),
      { prompt: 'eliminar', texto: 'sin esfuerzo', potencial: 4, esfuerzo: 0 },
    ];
    const r = evaluar(ideas);
    expect(Number.isFinite(r.ranking[0].indice)).toBe(true);
    expect(r.ranking.find((i) => i.texto === 'sin esfuerzo')!.indice).toBe(4);
  });

  it('treats unscored ideas as zero potential rather than dropping them', () => {
    const r = evaluar(hacer(MINIMO_DIVERGENCIA));
    expect(r.ranking).toHaveLength(MINIMO_DIVERGENCIA);
    expect(r.ranking.every((i) => i.indice === 0)).toBe(true);
  });

  it('rejects a non-array', () => {
    expect(evaluar(undefined as unknown as Idea[]).valido).toBe(false);
  });
});
