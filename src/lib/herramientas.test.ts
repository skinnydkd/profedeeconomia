import { describe, it, expect } from 'vitest';
import {
  COMPONENTE_KEYS, FAMILIAS_HERRAMIENTA, HERRAMIENTAS,
  herramientaPorSlug, gruposHerramientas, unidadesPorComponente,
} from './herramientas.ts';

describe('HERRAMIENTAS registry', () => {
  it('has 17 tools, all with a valid componente and an existing familia', () => {
    expect(HERRAMIENTAS).toHaveLength(17);
    const fams = new Set(FAMILIAS_HERRAMIENTA.map((f) => f.slug));
    for (const h of HERRAMIENTAS) {
      expect(COMPONENTE_KEYS).toContain(h.componente);
      expect(fams.has(h.familia)).toBe(true);
    }
  });
  it('every componente is used exactly once and slugs are unique', () => {
    const comps = HERRAMIENTAS.map((h) => h.componente);
    expect(new Set(comps).size).toBe(17);
    const slugs = HERRAMIENTAS.map((h) => `${h.familia}/${h.slug}`);
    expect(new Set(slugs).size).toBe(17);
  });
});

describe('FAMILIAS_HERRAMIENTA', () => {
  it('declares 5 families with a color token each', () => {
    expect(FAMILIAS_HERRAMIENTA.map((f) => f.slug)).toEqual([
      'costes-resultados', 'mercados-macro', 'inversion-finanzas',
      'finanzas-personales', 'orientacion-fp',
    ]);
    for (const f of FAMILIAS_HERRAMIENTA) expect(f.colorVar).toMatch(/^--color-[a-z0-9-]+$/);
  });
});

describe('herramientaPorSlug', () => {
  it('resolves a known tool', () => {
    expect(herramientaPorSlug('costes-resultados', 'punto-muerto')?.componente).toBe('PuntoMuerto');
  });
  it('returns undefined for an unknown tool', () => {
    expect(herramientaPorSlug('costes-resultados', 'nope')).toBeUndefined();
  });
});

describe('gruposHerramientas', () => {
  it('groups in family order and exposes the herramienta on each item', () => {
    const groups = gruposHerramientas();
    expect(groups[0].familia.slug).toBe('costes-resultados');
    expect(groups[0].items[0].h.componente).toBe('PuntoMuerto');
  });
});

describe('unidadesPorComponente', () => {
  it('groups {asignatura, unidad} by componente and dedupes', () => {
    const recursos = [
      { data: { componente: 'PuntoMuerto', asignatura: 'edmn-2bach', unidad_relacionada: 4 } },
      { data: { componente: 'PuntoMuerto', asignatura: 'edmn-2bach', unidad_relacionada: 4 } },
      { data: { componente: 'Ratios', asignatura: 'eco-1bach', unidad_relacionada: 7 } },
      { data: { componente: 'PuntoMuerto', asignatura: 'gpe-bach' } },
    ];
    const map = unidadesPorComponente(recursos);
    expect(map.get('PuntoMuerto')).toEqual([{ asignatura: 'edmn-2bach', unidad: 4 }]);
    expect(map.get('Ratios')).toEqual([{ asignatura: 'eco-1bach', unidad: 7 }]);
  });
});
