import { describe, it, expect } from 'vitest';
import {
  COMPONENTE_KEYS, FAMILIAS_HERRAMIENTA, HERRAMIENTAS,
  herramientaPorSlug, gruposHerramientas, unidadesPorComponente,
  recursoCanonicoPorComponente,
} from './herramientas.ts';

describe('HERRAMIENTAS registry', () => {
  it('has 22 tools, all with a valid componente and an existing familia', () => {
    expect(HERRAMIENTAS).toHaveLength(22);
    const fams = new Set(FAMILIAS_HERRAMIENTA.map((f) => f.slug));
    for (const h of HERRAMIENTAS) {
      expect(COMPONENTE_KEYS).toContain(h.componente);
      expect(fams.has(h.familia)).toBe(true);
    }
  });
  it('every componente is used exactly once and slugs are unique', () => {
    const comps = HERRAMIENTAS.map((h) => h.componente);
    expect(new Set(comps).size).toBe(22);
    const slugs = HERRAMIENTAS.map((h) => `${h.familia}/${h.slug}`);
    expect(new Set(slugs).size).toBe(22);
  });
});

describe('FAMILIAS_HERRAMIENTA', () => {
  it('declares 6 families with a color token each', () => {
    expect(FAMILIAS_HERRAMIENTA.map((f) => f.slug)).toEqual([
      'costes-resultados', 'mercados-macro', 'inversion-finanzas',
      'finanzas-personales', 'orientacion-fp', 'estrategia-planificacion',
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

describe('herramientas nuevas (plantillas + calc)', () => {
  it('the 3 templates are tipo plantilla in estrategia-planificacion with a manual unidades override', () => {
    for (const c of ['DAFO', 'CanvasBM', 'BCG']) {
      const h = HERRAMIENTAS.find((x) => x.componente === c)!;
      expect(h.tipo).toBe('plantilla');
      expect(h.familia).toBe('estrategia-planificacion');
      expect((h.unidades_relacionadas ?? []).length).toBeGreaterThan(0);
    }
  });
  it('productividad and equilibrio are calculadoras with a manual override', () => {
    for (const c of ['Productividad', 'EquilibrioMercado']) {
      const h = HERRAMIENTAS.find((x) => x.componente === c)!;
      expect(h.tipo).toBe('calculadora');
      expect((h.unidades_relacionadas ?? []).length).toBeGreaterThan(0);
    }
  });
});

describe('recursoCanonicoPorComponente (§5.6)', () => {
  const r = (id: string, componente: string, asignatura: string) => ({
    id,
    data: { componente, asignatura },
  });

  it('maps a componente with exactly one subject resource to that path', () => {
    const m = recursoCanonicoPorComponente([
      r('asignaturas/eco-1bach/recursos/calculadora-elasticidad.md', 'Elasticidad', 'eco-1bach'),
    ]);
    expect(m.get('Elasticidad')).toBe('/eco-1bach/recursos/calculadora-elasticidad/');
  });

  it('refuses to pick a target when several subjects embed the same tool', () => {
    const m = recursoCanonicoPorComponente([
      r('asignaturas/eco-4eso/recursos/calculadora-nomina.md', 'NominaESO', 'eco-4eso'),
      r('asignaturas/ipe1-fp/recursos/calculadora-nomina.md', 'NominaESO', 'ipe1-fp'),
    ]);
    expect(m.has('NominaESO')).toBe(false);
  });

  it('counts a repeated path once, so a duplicate entry still consolidates', () => {
    const m = recursoCanonicoPorComponente([
      r('asignaturas/eco-1bach/recursos/x.md', 'Elasticidad', 'eco-1bach'),
      r('asignaturas/eco-1bach/recursos/x.md', 'Elasticidad', 'eco-1bach'),
    ]);
    expect(m.get('Elasticidad')).toBe('/eco-1bach/recursos/x/');
  });

  it('ignores resources that embed no componente', () => {
    const m = recursoCanonicoPorComponente([
      { id: 'asignaturas/eco-1bach/recursos/ficha.md', data: { asignatura: 'eco-1bach' } },
    ]);
    expect(m.size).toBe(0);
  });
});
