import { describe, it, expect } from 'vitest';
import { assignRoles } from './roles';
import { WORDS } from './words';

describe('assignRoles', () => {
  it('picks impostorCount distinct impostors and a word from WORDS', () => {
    const ids = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    let i = 0;
    const r = assignRoles(ids, 2, () => [0.1, 0.5, 0.3, 0.7][i++ % 4]);
    expect(r.impostors.size).toBe(2);
    for (const id of r.impostors) expect(ids).toContain(id);
    expect(WORDS).toContain(r.word);
  });

  it('picks exactly 1 impostor when count is 1', () => {
    const ids = ['p1', 'p2', 'p3', 'p4'];
    const r = assignRoles(ids, 1, Math.random);
    expect(r.impostors.size).toBe(1);
  });

  it('picked impostors are always from the provided ids', () => {
    const ids = ['alice', 'bob', 'carol', 'dave', 'eve', 'frank'];
    for (let trial = 0; trial < 20; trial++) {
      const r = assignRoles(ids, 2, Math.random);
      for (const id of r.impostors) {
        expect(ids).toContain(id);
      }
    }
  });

  it('selected word is always in WORDS', () => {
    const ids = ['x1', 'x2', 'x3', 'x4'];
    for (let trial = 0; trial < 20; trial++) {
      const r = assignRoles(ids, 1, Math.random);
      expect(WORDS).toContain(r.word);
    }
  });

  it('is deterministic given a fixed rng sequence', () => {
    const ids = ['a', 'b', 'c', 'd'];
    const makeRng = () => {
      const seq = [0.0, 0.99, 0.5, 0.25, 0.75];
      let i = 0;
      return () => seq[i++ % seq.length];
    };
    const r1 = assignRoles(ids, 1, makeRng());
    const r2 = assignRoles(ids, 1, makeRng());
    expect(r1.word).toBe(r2.word);
    expect([...r1.impostors].sort()).toEqual([...r2.impostors].sort());
  });
});
