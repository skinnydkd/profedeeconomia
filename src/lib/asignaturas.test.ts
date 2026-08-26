import { describe, it, expect } from 'vitest';
import { ASIGNATURAS, SECCIONES_TRANSVERSALES } from './asignaturas.ts';

describe('SECCIONES_TRANSVERSALES', () => {
  it('lista las secciones de «Otros» en el orden acordado', () => {
    expect(SECCIONES_TRANSVERSALES.map((s) => s.slug)).toEqual([
      'dinamicas', 'herramientas', 'emprendimiento', 'proyectos', 'debates', 'juegos', 'jocs-economics', 'generadores',
    ]);
  });
  it('da label y descripción a proyectos', () => {
    const s = SECCIONES_TRANSVERSALES.find((x) => x.slug === 'proyectos');
    expect(s?.label).toBe('Proyectos interdisciplinares');
    expect((s?.description.length ?? 0)).toBeGreaterThan(0);
  });
  it('gives the dinamicas section a label and description', () => {
    const s = SECCIONES_TRANSVERSALES.find((x) => x.slug === 'dinamicas');
    expect(s?.label).toBe('Dinámicas');
    expect(s?.description.length).toBeGreaterThan(0);
  });
});

describe('SECCIONES_TRANSVERSALES — jocs-economics', () => {
  it('lo presenta como Juegos Económicos', () => {
    const s = SECCIONES_TRANSVERSALES.find((x) => x.slug === 'jocs-economics');
    expect(s?.label).toBe('Juegos Económicos');
    expect(s?.description.length).toBeGreaterThan(0);
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
    expect(s?.label).toBe('Herramientas Docentes');
    expect(s?.description.length).toBeGreaterThan(0);
  });
});

/**
 * The hub `<title>` is the site's single biggest CTR lever: teachers search the
 * acronym (`fopp`, `eeae`, `edmn`, `ipe`, `gpe`), so it has to be in the title
 * and inside Google's display budget. See docs/seo-estrategia-2026.md §5.1.
 */
describe('ASIGNATURAS — seoTitle', () => {
  // Google renders ~600px of title; 60 characters is the usual safe proxy.
  const MAX_TITLE_CHARS = 60;

  it('every asignatura has a non-empty seoTitle', () => {
    for (const a of Object.values(ASIGNATURAS)) {
      expect(a.seoTitle.trim().length).toBeGreaterThan(0);
    }
  });

  it('keeps every seoTitle inside the display budget', () => {
    for (const a of Object.values(ASIGNATURAS)) {
      expect(a.seoTitle.length).toBeLessThanOrEqual(MAX_TITLE_CHARS);
    }
  });

  it('front-loads the acronym or short name teachers actually type', () => {
    // shortLabel is e.g. "FOPP 4ESO" / "Eco 1BACH"; the first token is the
    // acronym or name the query starts with, and it must open the title.
    for (const a of Object.values(ASIGNATURAS)) {
      const head = a.shortLabel.split(' ')[0];
      expect(a.seoTitle.startsWith(head)).toBe(true);
    }
  });

  it('names the material on offer, not just the subject', () => {
    for (const a of Object.values(ASIGNATURAS)) {
      expect(a.seoTitle.toLowerCase()).toMatch(/libro|actividades|diapositivas|proyecto|tests|recursos/);
    }
  });

  it('does not carry the brand suffix — the hub renders with brandSuffix={false}', () => {
    for (const a of Object.values(ASIGNATURAS)) {
      expect(a.seoTitle).not.toContain('profedeeconomia');
    }
  });
});
