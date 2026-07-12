import { describe, it, expect } from 'vitest';
import { COPY as StonksStart } from './stonks/StartScreen';
import { COPY as StonksNews } from './stonks/NewsScreen';
import { COPY as StonksAllocate } from './stonks/AllocateScreen';
import { COPY as StonksResult } from './stonks/ResultScreen';
import { COPY as StonksFinal } from './stonks/FinalScreen';
import { COPY as StonksChart } from './stonks/EvolucionChart';

/**
 * Every localized game-chrome island exports a `COPY = { es, ca }`. This guard
 * fails when a key is added to one language and forgotten in the other. Add
 * each island here as it is translated. Mirrors the generadores/calculadoras
 * guards. Functions (interpolated strings) count as leaf keys; array values
 * (e.g. lesson lists) count as a single leaf.
 */
const ISLANDS: [string, { es: Record<string, unknown>; ca: Record<string, unknown> }][] = [
  ['stonks/StartScreen', StonksStart],
  ['stonks/NewsScreen', StonksNews],
  ['stonks/AllocateScreen', StonksAllocate],
  ['stonks/ResultScreen', StonksResult],
  ['stonks/FinalScreen', StonksFinal],
  ['stonks/EvolucionChart', StonksChart],
];

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

/** Recurse into nested label maps keyed by a structural id. */
function keyPaths(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) =>
    isRecord(value) ? keyPaths(value, `${prefix}${key}.`) : [`${prefix}${key}`],
  );
}

describe('game chrome COPY parity', () => {
  for (const [name, copy] of ISLANDS) {
    it(`${name}: es and ca have identical key sets`, () => {
      expect(keyPaths(copy.ca).sort()).toEqual(keyPaths(copy.es).sort());
    });

    it(`${name}: no ca value is empty`, () => {
      const walk = (obj: Record<string, unknown>, prefix = '') => {
        for (const [key, value] of Object.entries(obj)) {
          if (typeof value === 'function') continue;
          if (isRecord(value)) walk(value, `${prefix}${key}.`);
          else expect(value, `${name}.ca.${prefix}${key}`).toBeTruthy();
        }
      };
      walk(copy.ca);
    });
  }
});
