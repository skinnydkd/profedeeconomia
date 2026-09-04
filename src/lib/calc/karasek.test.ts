import { describe, it, expect } from 'vitest';
import { evaluar, UMBRAL, type Puesto } from './karasek';

const p = (demanda: number, control: number, apoyo = 8): Puesto => ({ demanda, control, apoyo });

describe('evaluar', () => {
  it('places high demand with low control in high strain', () => {
    const r = evaluar(p(9, 2));
    expect(r.valido).toBe(true);
    expect(r.cuadrante).toBe('alta-tension');
    expect(r.esAltaTension).toBe(true);
  });

  it('places high demand with high control in the active quadrant', () => {
    expect(evaluar(p(9, 8)).cuadrante).toBe('activo');
  });

  it('places low demand with low control in the passive quadrant', () => {
    expect(evaluar(p(2, 2)).cuadrante).toBe('pasivo');
  });

  it('places low demand with high control in low strain', () => {
    expect(evaluar(p(2, 8)).cuadrante).toBe('baja-tension');
  });

  it('treats the midpoint itself as low, not high', () => {
    expect(evaluar(p(UMBRAL, UMBRAL)).cuadrante).toBe('pasivo');
    expect(evaluar(p(UMBRAL + 1, UMBRAL)).cuadrante).toBe('alta-tension');
  });

  it('flags low support separately from the quadrant', () => {
    expect(evaluar({ demanda: 9, control: 8, apoyo: 2 }).apoyoBajo).toBe(true);
    expect(evaluar({ demanda: 9, control: 8, apoyo: 9 }).apoyoBajo).toBe(false);
    // Support does not change which quadrant the job is in.
    expect(evaluar({ demanda: 9, control: 8, apoyo: 2 }).cuadrante).toBe('activo');
  });

  it('says how much control would move the job out of high strain', () => {
    const r = evaluar(p(9, 2));
    expect(r.controlNecesario).toBeCloseTo(3.5, 5);
    const movido = evaluar(p(9, 2 + r.controlNecesario));
    expect(movido.cuadrante).toBe('activo');
  });

  it('says how much less demand would do the same', () => {
    const r = evaluar(p(9, 2));
    expect(r.reduccionDemandaNecesaria).toBeCloseTo(4, 5);
    const movido = evaluar(p(9 - r.reduccionDemandaNecesaria, 2));
    expect(movido.cuadrante).toBe('pasivo');
  });

  it('asks for no change when the job is not in high strain', () => {
    const r = evaluar(p(9, 8));
    expect(r.controlNecesario).toBe(0);
    expect(r.reduccionDemandaNecesaria).toBe(0);
  });

  it('rejects values outside 0–10', () => {
    expect(evaluar(p(11, 5)).valido).toBe(false);
    expect(evaluar(p(-1, 5)).valido).toBe(false);
    expect(evaluar({ demanda: 5, control: 5, apoyo: 20 }).valido).toBe(false);
  });

  it('rejects a missing job', () => {
    expect(evaluar(undefined as unknown as Puesto).valido).toBe(false);
  });
});
