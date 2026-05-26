import { describe, it, expect } from 'vitest';
import { getPool, samplePool, shuffleOptions, type Question } from './questions';

function rng(seed: number): () => number {
  let t = seed;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const SAMPLE_POOL: Question[] = Array.from({ length: 20 }, (_, i) => ({
  enunciado: `Q${i}`,
  opciones: ['A', 'B', 'C', 'D'],
  correcta: i % 4,
}));

describe('getPool', () => {
  it('returns an empty array if no unidades selected', () => {
    expect(getPool('edmn-2bach', [])).toEqual([]);
  });

  it('returns questions for a known asignatura+unidad', () => {
    const pool = getPool('edmn-2bach', [1]);
    expect(pool.length).toBeGreaterThan(0);
    expect(pool[0]).toMatchObject({
      enunciado: expect.any(String),
      opciones: expect.any(Array),
      correcta: expect.any(Number),
    });
  });

  it('concatenates questions from multiple unidades', () => {
    const onlyU1 = getPool('edmn-2bach', [1]);
    const onlyU2 = getPool('edmn-2bach', [2]);
    const combined = getPool('edmn-2bach', [1, 2]);
    expect(combined.length).toBe(onlyU1.length + onlyU2.length);
  });

  it('ignores unknown asignatura silently', () => {
    expect(getPool('does-not-exist', [1, 2, 3])).toEqual([]);
  });

  it('ignores unknown unidad silently within known asignatura', () => {
    const pool = getPool('edmn-2bach', [9999]);
    expect(pool).toEqual([]);
  });
});

describe('samplePool', () => {
  it('returns up to n items', () => {
    const sample = samplePool(SAMPLE_POOL, 5, rng(1));
    expect(sample).toHaveLength(5);
  });

  it('returns the full pool if n >= pool.length', () => {
    const sample = samplePool(SAMPLE_POOL, 100, rng(1));
    expect(sample).toHaveLength(SAMPLE_POOL.length);
  });

  it('is deterministic given the same RNG seed', () => {
    const a = samplePool(SAMPLE_POOL, 5, rng(42));
    const b = samplePool(SAMPLE_POOL, 5, rng(42));
    expect(a).toEqual(b);
  });

  it('returns different samples with different seeds (probabilistic)', () => {
    const a = samplePool(SAMPLE_POOL, 5, rng(1));
    const b = samplePool(SAMPLE_POOL, 5, rng(2));
    expect(a).not.toEqual(b);
  });

  it('never returns duplicates', () => {
    const sample = samplePool(SAMPLE_POOL, 20, rng(1));
    const enunciados = sample.map((q) => q.enunciado);
    expect(new Set(enunciados).size).toBe(enunciados.length);
  });
});

describe('shuffleOptions', () => {
  it('preserves enunciado and explicacion, shuffles opciones, updates correcta index', () => {
    const q: Question = {
      enunciado: 'Capital',
      opciones: ['Madrid', 'Barcelona', 'Valencia'],
      correcta: 0,
      explicacion: 'És Madrid.',
    };
    const shuffled = shuffleOptions(q, rng(7));
    expect(shuffled.enunciado).toBe('Capital');
    expect(shuffled.explicacion).toBe('És Madrid.');
    expect(new Set(shuffled.opciones)).toEqual(new Set(['Madrid', 'Barcelona', 'Valencia']));
    expect(shuffled.opciones[shuffled.correcta]).toBe('Madrid');
  });

  it('is deterministic for a given RNG seed', () => {
    const q: Question = { enunciado: 'X', opciones: ['a', 'b', 'c', 'd'], correcta: 1 };
    const a = shuffleOptions(q, rng(99));
    const b = shuffleOptions(q, rng(99));
    expect(a).toEqual(b);
  });
});
