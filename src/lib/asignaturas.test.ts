import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { SECCIONES_TRANSVERSALES, ASIGNATURAS_LIST, ACCENTS } from './asignaturas.ts';

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

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const read = (p: string) => readFileSync(ROOT + p, 'utf8');

const PRINT_ROUTES = [
  'src/pages/[asignatura]/libro/imprimir.astro',
  'src/pages/[asignatura]/actividades/imprimir/[modo].astro',
  'src/pages/[asignatura]/ebau/imprimir.astro',
  'src/pages/[asignatura]/programacion/imprimir.astro',
  'src/pages/[asignatura]/proyecto/imprimir.astro',
  'src/pages/[asignatura]/proyecto/cuaderno/imprimir/[modo].astro',
];

describe('ACCENTS — the print palette lives in one place', () => {
  it('gives every asignatura an accent of its own, never the EDMN fallback', () => {
    const collapsedToEdmn = ASIGNATURAS_LIST
      .filter((a) => a.color !== 'edmn')
      .filter((a) => ACCENTS[a.color].base === ACCENTS.edmn.base)
      .map((a) => a.slug);
    expect(collapsedToEdmn).toEqual([]);
  });

  it('leaves no local ACCENTS copy behind in any print route', () => {
    for (const route of PRINT_ROUTES) {
      const src = read(route);
      expect(src, `${route} still declares its own ACCENTS`).not.toMatch(/const ACCENTS\s*[:=]/);
      expect(src, `${route} does not import ACCENTS`).toMatch(
        /import \{[^}]*\bACCENTS\b[^}]*\} from '@\/lib\/asignaturas'/
      );
    }
  });
});

const COLOR_MAP_FILES = [
  'src/components/SubjectCard.astro',
  'src/pages/[asignatura]/index.astro',
  'src/pages/[asignatura]/evaluacion/index.astro',
  'src/pages/[asignatura]/refuerzo/index.astro',
];

describe('subject colours reach the CSS layer', () => {
  const colors = [...new Set(ASIGNATURAS_LIST.map((a) => a.color))];

  it('defines a token and a soft token for every colour in global.css', () => {
    const css = read('src/styles/global.css');
    const missing = colors.flatMap((c) => [
      css.includes(`--color-${c}:`) ? [] : [`--color-${c}`],
      css.includes(`--color-${c}-soft:`) ? [] : [`--color-${c}-soft`],
      css.includes(`--color-${c}-ink:`) ? [] : [`--color-${c}-ink`],
    ].flat());
    expect(missing).toEqual([]);
  });

  it('maps every colour to a .c-{color} rule in each colour-map file', () => {
    const missing: string[] = [];
    for (const file of COLOR_MAP_FILES) {
      const src = read(file);
      for (const c of colors) {
        if (!src.includes(`.c-${c}`)) missing.push(`${file} → .c-${c}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it('gives every asignatura a slide accent rule', () => {
    const css = read('src/styles/slides.css');
    const missing = ASIGNATURAS_LIST
      .filter((a) => a.color !== 'edmn') // EDMN uses the sheet's default accent
      .filter((a) => !css.includes(`[data-asig="${a.slug}"]`))
      .map((a) => a.slug);
    expect(missing).toEqual([]);
  });
});
