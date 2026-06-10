import { describe, it, expect } from 'vitest';
import { validarDecision, MAX_DECISION } from './decision-validacion';

const base = { precio: 50, marketing: 20000, produccion: 5000, calidad: 15000, rrhh: 15000, prestamo: 0 };

describe('validarDecision', () => {
  it('accepts a realistic decision', () => {
    const r = validarDecision(base);
    expect(r.ok).toBe(true);
  });
  it('rejects an absurd marketing value that would grief the shared market', () => {
    const r = validarDecision({ ...base, marketing: 1e300 });
    expect(r.ok).toBe(false);
  });
  it('rejects a value just above the per-field cap', () => {
    const r = validarDecision({ ...base, produccion: MAX_DECISION.produccion + 1 });
    expect(r.ok).toBe(false);
  });
  it('accepts a value exactly at the cap', () => {
    const r = validarDecision({ ...base, produccion: MAX_DECISION.produccion });
    expect(r.ok).toBe(true);
  });
  it('rejects negative and zero precio', () => {
    expect(validarDecision({ ...base, marketing: -1 }).ok).toBe(false);
    expect(validarDecision({ ...base, precio: 0 }).ok).toBe(false);
  });
  it('rejects a missing field', () => {
    const { precio, ...sinPrecio } = base;
    expect(validarDecision(sinPrecio).ok).toBe(false);
  });
});
