import { describe, it, expect } from 'vitest';
import {
  COMPONENTE_KEYS, FAMILIAS_HERRAMIENTA, HERRAMIENTAS,
  herramientaPorSlug, gruposHerramientas, unidadesPorComponente,
  recursoCanonicoPorComponente, RECURSO_CANONICO,
} from './herramientas.ts';
import { readdirSync, readFileSync, existsSync } from 'node:fs';

describe('HERRAMIENTAS registry', () => {
  // The count is derived from COMPONENTE_KEYS rather than hard-coded: the
  // invariant worth guarding is that the registry covers every key exactly
  // once, not that there happen to be N tools today.
  it('registers one tool per componente key, each with an existing familia', () => {
    expect(HERRAMIENTAS).toHaveLength(COMPONENTE_KEYS.length);
    const fams = new Set(FAMILIAS_HERRAMIENTA.map((f) => f.slug));
    for (const h of HERRAMIENTAS) {
      expect(COMPONENTE_KEYS).toContain(h.componente);
      expect(fams.has(h.familia)).toBe(true);
    }
  });
  it('every componente is used exactly once and slugs are unique', () => {
    const comps = HERRAMIENTAS.map((h) => h.componente);
    expect(new Set(comps).size).toBe(COMPONENTE_KEYS.length);
    expect(new Set(comps)).toEqual(new Set(COMPONENTE_KEYS));
    const slugs = HERRAMIENTAS.map((h) => `${h.familia}/${h.slug}`);
    expect(new Set(slugs).size).toBe(COMPONENTE_KEYS.length);
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

  it('refuses to pick a target when several subjects embed the tool and none is chosen', () => {
    const m = recursoCanonicoPorComponente([
      r('asignaturas/eco-4eso/recursos/calculadora-nomina.md', 'NominaESO', 'eco-4eso'),
      r('asignaturas/ipe1-fp/recursos/calculadora-nomina.md', 'NominaESO', 'ipe1-fp'),
    ], {});
    expect(m.has('NominaESO')).toBe(false);
  });

  it('uses the chosen winner when several subjects embed the same tool (§5.11)', () => {
    const m = recursoCanonicoPorComponente([
      r('asignaturas/eco-4eso/recursos/calculadora-nomina.md', 'NominaESO', 'eco-4eso'),
      r('asignaturas/ipe1-fp/recursos/calculadora-nomina.md', 'NominaESO', 'ipe1-fp'),
    ], { NominaESO: '/eco-4eso/recursos/calculadora-nomina/' });
    expect(m.get('NominaESO')).toBe('/eco-4eso/recursos/calculadora-nomina/');
  });

  it('ignores a chosen winner that is not one of the twins', () => {
    const m = recursoCanonicoPorComponente([
      r('asignaturas/eco-4eso/recursos/calculadora-nomina.md', 'NominaESO', 'eco-4eso'),
      r('asignaturas/ipe1-fp/recursos/calculadora-nomina.md', 'NominaESO', 'ipe1-fp'),
    ], { NominaESO: '/gpe-bach/recursos/calculadora-nomina/' });
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

/**
 * Every tool embedded by several subjects needs a chosen winner, and every
 * winner must be one of its published twins: a new twin added without a
 * decision would otherwise leave N pages competing for the same query.
 */
describe('RECURSO_CANONICO matches the published content', () => {
  const ROOT = 'src/content/asignaturas';
  const twins = new Map<string, string[]>();
  for (const asig of readdirSync(ROOT)) {
    const dir = `${ROOT}/${asig}/recursos`;
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir)) {
      if (f.includes('.ca.') || !/\.mdx?$/.test(f)) continue;
      const fm = readFileSync(`${dir}/${f}`, 'utf8').split('---')[1] ?? '';
      const comp = fm.match(/^componente:\s*["']?(\w+)/m)?.[1];
      const estado = fm.match(/^estado:\s*["']?(\w+)/m)?.[1];
      if (!comp || estado !== 'publicado') continue;
      const path = `/${asig}/recursos/${f.replace(/\.mdx?$/, '')}/`;
      twins.set(comp, [...(twins.get(comp) ?? []), path]);
    }
  }

  it('chooses a winner for every tool with several subject twins', () => {
    const missing = [...twins].filter(([c, ps]) => ps.length > 1 && !(c in RECURSO_CANONICO)).map(([c]) => c);
    expect(missing).toEqual([]);
  });

  it('only chooses winners that are published twins of that tool', () => {
    const wrong = Object.entries(RECURSO_CANONICO).filter(([c, p]) => !(twins.get(c) ?? []).includes(p as string));
    expect(wrong).toEqual([]);
  });
});
