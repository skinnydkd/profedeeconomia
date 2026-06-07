import { describe, it, expect } from 'vitest';
import { CCAA_LIST, ANIOS, CONVOCATORIAS, ebauPdfRelPath, ebauPdfHref } from './ebau-examenes';

describe('ebau-examenes registry', () => {
  it('lists the 17 comunidades with Comunitat Valenciana first', () => {
    expect(CCAA_LIST).toHaveLength(17);
    expect(CCAA_LIST[0].slug).toBe('comunidad-valenciana');
    // slugs are unique
    expect(new Set(CCAA_LIST.map((c) => c.slug)).size).toBe(17);
  });

  it('exposes the available años (2025, 2024) and two convocatorias', () => {
    expect([...ANIOS]).toEqual([2025, 2024]);
    expect(CONVOCATORIAS.map((c) => c.slug)).toEqual(['junio', 'julio']);
  });

  it('builds the canonical PDF rel path and public href', () => {
    expect(ebauPdfRelPath('madrid', 2025, 'junio', 'examen'))
      .toBe('ebau-examenes/madrid/empresa-2025-junio-examen.pdf');
    expect(ebauPdfHref('madrid', 2025, 'junio', 'solucion'))
      .toBe('/ebau-examenes/madrid/empresa-2025-junio-solucion.pdf');
  });
});
