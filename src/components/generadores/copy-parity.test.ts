import { describe, it, expect } from 'vitest';
import { COPY as Rubrica } from './RubricaGenerator';

/**
 * Every localized generador island exports a `COPY = { es, ca }`. This guard
 * fails when a string is added to one language and forgotten in the other.
 * Add each island here as it is translated. Mirrors the calculadoras guard.
 */
const ISLANDS: [string, { es: Record<string, unknown>; ca: Record<string, unknown> }][] = [
  ['RubricaGenerator', Rubrica],
];

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

/** Recurse into nested label maps keyed by a structural id. */
function keyPaths(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) =>
    isRecord(value) ? keyPaths(value, `${prefix}${key}.`) : [`${prefix}${key}`],
  );
}

describe('generador island COPY parity', () => {
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
