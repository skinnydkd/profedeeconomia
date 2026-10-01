import { describe, it, expect } from 'vitest';
import { clasificar } from '../../lib/calc/ratios-benchmark';
import { COPY, RANGOS_SANOS, diagnosticoSolvencia } from './RatiosCalc';

/**
 * CODE-INT-14: the verdict accepted values up to 20 % above the band it
 * printed («Sano: 1,5 – 2» in green for a liquidity of 2,3), and it was only
 * shown as a border colour.
 */
const fmt = (n: number) => String(n).replace('.', ',');

describe('RatiosCalc verdicts', () => {
  it('a liquidity of 2,3 is above the healthy band, not inside it', () => {
    expect(clasificar(2.3, RANGOS_SANOS.liquidez)).toBe('alto');
    expect(clasificar(1.8, RANGOS_SANOS.liquidez)).toBe('dentro');
  });

  it('a 70 % debt ratio (PN 78, PNC 122, PC 60) is above 40 – 60 %', () => {
    const endeudamiento = (122 + 60) / (78 + 122 + 60);
    expect(clasificar(endeudamiento, RANGOS_SANOS.endeudamiento)).toBe('alto');
  });

  it('solvency is healthy only above 1,5', () => {
    expect(diagnosticoSolvencia(1.6)).toBe('dentro');
    expect(diagnosticoSolvencia(1.5)).toBe('bajo');
    expect(diagnosticoSolvencia(null)).toBe('sinDato');
  });

  it('every «Sano: …» text states the band the verdict applies', () => {
    for (const locale of ['es', 'ca'] as const) {
      const c = COPY[locale];
      expect(c.comLiquidez).toContain(RANGOS_SANOS.liquidez.map(fmt).join(' – '));
      expect(c.comTesoreria).toContain(RANGOS_SANOS.tesoreria.map(fmt).join(' – '));
      expect(c.comDisponibilidad).toContain(RANGOS_SANOS.disponibilidad.map(fmt).join(' – '));
      expect(c.comEndeudamiento).toContain(RANGOS_SANOS.endeudamiento.map((n) => fmt(n * 100)).join(' – '));
      expect(c.comSolvencia).toContain('> 1,5');
    }
  });

  it('writes the verdict out in both languages', () => {
    expect(COPY.es.posiciones).toEqual({ bajo: 'Por debajo del rango', dentro: 'Dentro del rango', alto: 'Por encima del rango' });
    expect(COPY.ca.posiciones).toEqual({ bajo: 'Per davall del rang', dentro: 'Dins del rang', alto: 'Per damunt del rang' });
  });
});
