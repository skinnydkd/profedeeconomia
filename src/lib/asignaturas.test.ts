import { describe, it, expect } from 'vitest';
import { SECCIONES_TRANSVERSALES } from './asignaturas.ts';

describe('SECCIONES_TRANSVERSALES', () => {
  it('includes the dinamicas section after emprendimiento', () => {
    const slugs = SECCIONES_TRANSVERSALES.map((s) => s.slug);
    expect(slugs).toContain('dinamicas');
    expect(slugs.indexOf('dinamicas')).toBe(slugs.indexOf('emprendimiento') + 1);
  });
  it('gives the dinamicas section a label and description', () => {
    const s = SECCIONES_TRANSVERSALES.find((x) => x.slug === 'dinamicas');
    expect(s?.label).toBe('Dinámicas');
    expect(s?.description.length).toBeGreaterThan(0);
  });
});

describe('SECCIONES_TRANSVERSALES — jocs-economics', () => {
  it('incluye jocs-economics tras dinamicas', () => {
    const slugs = SECCIONES_TRANSVERSALES.map((s) => s.slug);
    expect(slugs).toContain('jocs-economics');
    expect(slugs.indexOf('jocs-economics')).toBe(slugs.indexOf('dinamicas') + 1);
  });
  it('lo presenta como las Olimpiadas', () => {
    const s = SECCIONES_TRANSVERSALES.find((x) => x.slug === 'jocs-economics');
    expect(s?.label).toBe('Jocs Econòmics');
    expect(s?.description.toLowerCase()).toContain('olimpiada');
  });
});
