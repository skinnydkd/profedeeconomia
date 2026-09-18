import { describe, it, expect } from 'vitest';
import { ACTIVIDAD_TIPOS, ACTIVIDAD_TIPO_LABEL, actividadPdfName } from './actividades';

describe('actividades vocabulary', () => {
  it('labels every tipo in both locales', () => {
    for (const tipo of ACTIVIDAD_TIPOS) {
      expect(ACTIVIDAD_TIPO_LABEL.es[tipo]).toBeTruthy();
      expect(ACTIVIDAD_TIPO_LABEL.ca[tipo]).toBeTruthy();
    }
  });

  it('keeps the classic five families first so existing content keeps its meaning', () => {
    expect(ACTIVIDAD_TIPOS.slice(0, 5)).toEqual(['caso', 'ejercicio', 'debate', 'dinamica', 'proyecto']);
  });
});

describe('actividadPdfName', () => {
  it('builds the Spanish and Valencian download names', () => {
    expect(actividadPdfName('eco-4eso', '07-presupuesto-personal-plan-ahorro')).toBe(
      'actividad-eco-4eso-07-presupuesto-personal-plan-ahorro.pdf',
    );
    expect(actividadPdfName('eco-4eso', '07-presupuesto-personal-plan-ahorro', 'ca')).toBe(
      'actividad-eco-4eso-07-presupuesto-personal-plan-ahorro.ca.pdf',
    );
  });
});
