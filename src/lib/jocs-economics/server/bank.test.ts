import { describe, it, expect } from 'vitest';
import { nextQuestion, BankExhaustedError, type Question, type BankData } from './bank';

function rng(seed: number): () => number {
  let t = seed;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const TEST_BANK: BankData = {
  preguntas: [
    { id: 'eco-1', categoria: 'economia', dificultat: 1.0, opciones: ['a','b','c','d'], correcta: 0 },
    { id: 'eco-2', categoria: 'economia', dificultat: 1.5, opciones: ['a','b','c','d'], correcta: 1 },
    { id: 'eco-3', categoria: 'economia', dificultat: 2.0, opciones: ['a','b','c','d'], correcta: 2 },
    { id: 'eco-4', categoria: 'economia', dificultat: 5.0, opciones: ['a','b','c','d'], correcta: 3 },
    { id: 'eco-5', categoria: 'economia', dificultat: 7.0, opciones: ['a','b','c','d'], correcta: 0 },
    { id: 'eco-6', categoria: 'economia', dificultat: 9.5, opciones: ['a','b','c','d'], correcta: 1 },
  ],
};

describe('nextQuestion', () => {
  it('picks a question within ±0.5 of target difficulty when available', () => {
    const q = nextQuestion(1.0, [], rng(1), TEST_BANK);
    expect(['eco-1', 'eco-2']).toContain(q.id);
  });

  it('expands window to ±1.0 if no candidates in ±0.5', () => {
    const q = nextQuestion(3.0, [], rng(1), TEST_BANK);
    expect(['eco-3', 'eco-4']).toContain(q.id);
  });

  it('expands window to ±2.0 if still nothing', () => {
    const q = nextQuestion(8.5, [], rng(1), TEST_BANK);
    expect(['eco-5', 'eco-6']).toContain(q.id);
  });

  it('falls back to closest non-seen if no candidates within ±2.0', () => {
    const q = nextQuestion(4.0, ['eco-1', 'eco-2'], rng(1), TEST_BANK);
    expect(q.id).not.toBe('eco-1');
    expect(q.id).not.toBe('eco-2');
  });

  it('throws BankExhaustedError when all questions seen', () => {
    const allSeen = TEST_BANK.preguntas.map((p) => p.id);
    expect(() => nextQuestion(5.0, allSeen, rng(1), TEST_BANK)).toThrow('bank-exhausted');
  });

  it('is deterministic given the same RNG seed', () => {
    const a = nextQuestion(5.0, [], rng(42), TEST_BANK);
    const b = nextQuestion(5.0, [], rng(42), TEST_BANK);
    expect(a.id).toBe(b.id);
  });

  it('returns different questions with different seeds (probabilistic)', () => {
    const seeds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const ids = new Set(seeds.map((s) => nextQuestion(1.0, [], rng(s), TEST_BANK).id));
    expect(ids.size).toBeGreaterThan(1);
  });

  it('never returns a seen question', () => {
    for (let s = 1; s < 50; s++) {
      const q = nextQuestion(1.0, ['eco-1'], rng(s), TEST_BANK);
      expect(q.id).not.toBe('eco-1');
    }
  });
});
