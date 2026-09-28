import { describe, it, expect } from 'vitest';
import { DEFAULT_PARAMS } from './engine';
import { MAX_NOMBRE, sanearParams, textoValido } from './params-liga';

describe('sanearParams (CODE-SRV-08)', () => {
  it('keeps valid numbers and drops unknown keys', () => {
    const p = sanearParams({ demandaBase: 5000, hack: 'x'.repeat(10_000) });
    expect(p.demandaBase).toBe(5000);
    expect(Object.keys(p).sort()).toEqual(Object.keys(DEFAULT_PARAMS).sort());
  });

  it('falls back to the default for text, NaN or out-of-range values', () => {
    const p = sanearParams({ costeFijo: 'mucho', precioReferencia: 0, interesPrestamo: 5, pesoPrecio: NaN });
    expect(p.costeFijo).toBe(DEFAULT_PARAMS.costeFijo);
    expect(p.precioReferencia).toBe(DEFAULT_PARAMS.precioReferencia);
    expect(p.interesPrestamo).toBe(DEFAULT_PARAMS.interesPrestamo);
    expect(p.pesoPrecio).toBe(DEFAULT_PARAMS.pesoPrecio);
  });

  it('treats a missing or non-object value as the defaults', () => {
    expect(sanearParams(undefined)).toEqual(DEFAULT_PARAMS);
    expect(sanearParams('x')).toEqual(DEFAULT_PARAMS);
  });
});

describe('textoValido', () => {
  it('bounds free text on both sides', () => {
    expect(textoValido('  IES Test  ', 2, 80)).toBe('IES Test');
    expect(textoValido('x', 2, 80)).toBeNull();
    expect(textoValido('x'.repeat(MAX_NOMBRE + 1), 2, MAX_NOMBRE)).toBeNull();
  });
});
