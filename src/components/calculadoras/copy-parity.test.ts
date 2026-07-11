import { describe, it, expect } from 'vitest';
import { COPY as PuntoMuerto } from './PuntoMuertoCalc';
import { COPY as DCF } from './DCFCalc';
import { COPY as VANTIR } from './VANTIRCalc';
import { COPY as Benchmark } from './RatiosBenchmark';
import { COPY as DAFO } from './DAFOCanvas';
import { COPY as Productividad } from './ProductividadCalc';
import { COPY as Presupuesto503020 } from './CalculadoraPresupuesto503020';
import { COPY as MatrizBCG } from './MatrizBCG';

/**
 * Every localized island exports a `COPY = { es, ca }`. This guard fails when a
 * string is added to one language and forgotten in the other — without it the
 * missing key would silently render as `undefined` rather than fall back.
 *
 * Add each island here as it is translated.
 */
const ISLANDS: [string, { es: Record<string, unknown>; ca: Record<string, unknown> }][] = [
  ['PuntoMuertoCalc', PuntoMuerto],
  ['DCFCalc', DCF],
  ['VANTIRCalc', VANTIR],
  ['RatiosBenchmark', Benchmark],
  ['DAFOCanvas', DAFO],
  ['ProductividadCalc', Productividad],
  ['CalculadoraPresupuesto503020', Presupuesto503020],
  ['MatrizBCG', MatrizBCG],
];

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null;

/** Some islands nest label maps keyed by a structural id (sector, ratio, …). */
function keyPaths(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) =>
    isRecord(value) ? keyPaths(value, `${prefix}${key}.`) : [`${prefix}${key}`],
  );
}

describe('island COPY parity', () => {
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
