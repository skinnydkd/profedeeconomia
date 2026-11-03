import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  CCAA_LIST, ANIOS, CONVOCATORIAS, ebauPdfRelPath, ebauPdfHref, ccaaSeoTitle, filasCcaa, esIndexable,
} from './ebau-examenes';

describe('ebau-examenes registry', () => {
  it('lists the 17 comunidades with Comunitat Valenciana first', () => {
    expect(CCAA_LIST).toHaveLength(17);
    expect(CCAA_LIST[0].slug).toBe('comunidad-valenciana');
    // slugs are unique
    expect(new Set(CCAA_LIST.map((c) => c.slug)).size).toBe(17);
  });

  it('exposes the available años (2026, 2025, 2024) and two convocatorias', () => {
    expect([...ANIOS]).toEqual([2026, 2025, 2024]);
    expect(CONVOCATORIAS.map((c) => c.slug)).toEqual(['junio', 'julio']);
  });

  it('builds the canonical PDF rel path and public href', () => {
    expect(ebauPdfRelPath('madrid', 2025, 'junio', 'examen'))
      .toBe('ebau-examenes/madrid/empresa-2025-junio-examen.pdf');
    expect(ebauPdfHref('madrid', 2025, 'junio', 'solucion'))
      .toBe('/ebau-examenes/madrid/empresa-2025-junio-solucion.pdf');
  });
});

describe('per-comunidad pages', () => {
  it('every comunidad carries verified local data with an official source', () => {
    for (const c of CCAA_LIST) {
      expect(c.prueba, c.slug).toBeTruthy();
      expect(c.materia, c.slug).toBeTruthy();
      // null only when no official source states it; then the page says so
      expect(c.estructura === null || c.estructura.length > 20, c.slug).toBe(true);
      expect(c.fuente.url, c.slug).toMatch(/^https:\/\//);
      expect(c.fuente.consultado, c.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('every comunidad has its PDF folder', () => {
    for (const c of CCAA_LIST) {
      expect(existsSync(resolve('public/ebau-examenes', c.slug)), c.slug).toBe(true);
    }
  });

  it('keeps every page title inside the 60-character display budget and names the comunidad', () => {
    for (const c of CCAA_LIST) {
      const t = ccaaSeoTitle(c);
      expect(t.length, t).toBeLessThanOrEqual(60);
      expect(t).toContain(c.label);
      expect(t).toContain('PAU');
    }
  });

  it('builds one row per año and convocatoria, newest first', () => {
    const filas = filasCcaa('madrid', () => false);
    expect(filas).toHaveLength(ANIOS.length * CONVOCATORIAS.length);
    expect(filas[0]).toMatchObject({ anio: 2026, examen: null, solucion: null });
  });

  it('links only the PDFs that exist', () => {
    const filas = filasCcaa('madrid', (rel) => rel.endsWith('2025-junio-examen.pdf'));
    const junio25 = filas.find((f) => f.anio === 2025 && f.convLabel.startsWith('Junio'));
    expect(junio25?.examen).toBe('/ebau-examenes/madrid/empresa-2025-junio-examen.pdf');
    expect(junio25?.solucion).toBeNull();
  });

  it('indexes a comunidad page only from two exams up', () => {
    const fila = (examen: string | null) => ({ anio: 2025, convLabel: 'x', examen, solucion: null });
    expect(esIndexable([fila('/a.pdf')])).toBe(false);
    expect(esIndexable([fila('/a.pdf'), fila(null), fila('/b.pdf')])).toBe(true);
  });
});
