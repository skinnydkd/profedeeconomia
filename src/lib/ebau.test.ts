import { describe, it, expect } from 'vitest';
import { RUTAS_RESERVADAS_EBAU, slugFamilia, intercalarFamilias } from './ebau';

const sec = (orden: number, incluye_problemas = false) => ({ data: { orden, incluye_problemas } });
const fam = (orden: number) => ({ data: { orden } });

describe('slugFamilia', () => {
  it('strips subject, folder and numeric prefix', () => {
    expect(slugFamilia('edmn-2bach/ebau-problemas/01-punto-muerto-ejercicios-resueltos')).toBe(
      'punto-muerto-ejercicios-resueltos',
    );
  });
  it('strips the .ca suffix', () => {
    expect(slugFamilia('edmn-2bach/ebau-problemas/01-punto-muerto-ejercicios-resueltos.ca')).toBe(
      'punto-muerto-ejercicios-resueltos',
    );
  });
});

describe('intercalarFamilias', () => {
  it('inserts one families block after the marked section, sorted', () => {
    const out = intercalarFamilias([sec(4), sec(0), sec(3, true), sec(1), sec(2)], [fam(2), fam(1)]);
    expect(out.map((b) => b.kind)).toEqual(['seccion', 'seccion', 'seccion', 'seccion', 'familias', 'seccion']);
    const fb = out[4];
    expect(fb.kind === 'familias' && fb.entries.map((f) => f.data.orden)).toEqual([1, 2]);
  });
  it('adds no block without families', () => {
    const out = intercalarFamilias([sec(1), sec(0, true)], []);
    expect(out.every((b) => b.kind === 'seccion')).toBe(true);
    expect(out.map((b) => b.kind === 'seccion' && b.entry.data.orden)).toEqual([0, 1]);
  });
  it('appends the block when no section is marked', () => {
    const out = intercalarFamilias([sec(0), sec(1)], [fam(0)]);
    expect(out[out.length - 1].kind).toBe('familias');
  });
});

describe('family slug guard', () => {
  it('no family uses a reserved route', () => {
    const ids = Object.keys(import.meta.glob('/src/content/asignaturas/*/ebau-problemas/*.{md,mdx}'));
    for (const id of ids) {
      const rel = id.replace('/src/content/', '').replace(/\.mdx?$/, '');
      expect(RUTAS_RESERVADAS_EBAU as readonly string[]).not.toContain(slugFamilia(rel));
    }
  });
});
