import { describe, it, expect } from 'vitest';
import { COPY as PuntoMuerto } from './PuntoMuertoCalc';

/**
 * Every localized island exports a `COPY = { es, ca }`. This guard fails when a
 * string is added to one language and forgotten in the other — without it the
 * missing key would silently render as `undefined` rather than fall back.
 *
 * Add each island here as it is translated.
 */
const ISLANDS: [string, { es: Record<string, unknown>; ca: Record<string, unknown> }][] = [
  ['PuntoMuertoCalc', PuntoMuerto],
];

describe('island COPY parity', () => {
  for (const [name, copy] of ISLANDS) {
    it(`${name}: es and ca have identical key sets`, () => {
      expect(Object.keys(copy.ca).sort()).toEqual(Object.keys(copy.es).sort());
    });

    it(`${name}: no ca value is empty`, () => {
      for (const [key, value] of Object.entries(copy.ca)) {
        if (typeof value === 'function') continue;
        expect(value, `${name}.ca.${key}`).toBeTruthy();
      }
    });
  }
});
