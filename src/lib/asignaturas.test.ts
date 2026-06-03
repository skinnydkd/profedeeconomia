import { describe, it, expect } from 'vitest';
import { SECCIONES_TRANSVERSALES } from './asignaturas.ts';

describe('SECCIONES_TRANSVERSALES', () => {
  it('lista las secciones de «Otros» en el orden acordado', () => {
    expect(SECCIONES_TRANSVERSALES.map((s) => s.slug)).toEqual([
      'dinamicas', 'herramientas', 'emprendimiento', 'debates', 'juegos', 'jocs-economics', 'generadores',
    ]);
  });
  it('gives the dinamicas section a label and description', () => {
    const s = SECCIONES_TRANSVERSALES.find((x) => x.slug === 'dinamicas');
    expect(s?.label).toBe('Dinámicas');
    expect(s?.description.length).toBeGreaterThan(0);
  });
});

describe('SECCIONES_TRANSVERSALES — jocs-economics', () => {
  it('lo presenta como las Olimpiadas', () => {
    const s = SECCIONES_TRANSVERSALES.find((x) => x.slug === 'jocs-economics');
    expect(s?.label).toBe('Jocs Econòmics');
    expect(s?.description.toLowerCase()).toContain('olimpiada');
  });
});

describe('SECCIONES_TRANSVERSALES — debates', () => {
  it('le da label y descripción', () => {
    const s = SECCIONES_TRANSVERSALES.find((x) => x.slug === 'debates');
    expect(s?.label).toBe('Debates');
    expect((s?.description.length ?? 0)).toBeGreaterThan(0);
  });
});

describe('SECCIONES_TRANSVERSALES — herramientas (caja) y generadores', () => {
  it('mantiene herramientas apuntando a la caja de herramientas', () => {
    const s = SECCIONES_TRANSVERSALES.find((x) => x.slug === 'herramientas');
    expect(s?.label).toBe('Herramientas');
    expect(s?.description.toLowerCase()).toContain('calculadora');
  });
  it('añade la sección generadores', () => {
    const slugs = SECCIONES_TRANSVERSALES.map((s) => s.slug);
    expect(slugs).toContain('generadores');
    const s = SECCIONES_TRANSVERSALES.find((x) => x.slug === 'generadores');
    expect(s?.label).toBe('Generadores');
    expect(s?.description.length).toBeGreaterThan(0);
  });
});
