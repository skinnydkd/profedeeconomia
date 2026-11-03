import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseTreeFromMdxBody } from './parse-tree.ts';
import { kpiSinNombre, nombreKpi, nombresKpi } from './kpi-labels.ts';

/**
 * The KPI bar of the decision trees printed the ids the trees key their KPIs
 * by: «CLARIDAD_FUTURO 20 · CONFIANZA 35 · AUTONOMIA 40» on a Valencian page.
 * Every id a tree uses must have a name in its language, either shared
 * (kpi-labels.ts) or the tree's own `intro.kpi_labels`.
 */
const ROOT = 'src/content/asignaturas';

const arboles = readdirSync(ROOT).flatMap((asig) => {
  const dir = join(ROOT, asig, 'actividades-dinamicas');
  let files: string[];
  try {
    files = readdirSync(dir).filter((f) => f.endsWith('.mdx'));
  } catch {
    return [];
  }
  return files.map((f) => {
    const path = join(dir, f);
    const locale: 'es' | 'ca' = f.endsWith('.ca.mdx') ? 'ca' : 'es';
    return { path, locale, tree: parseTreeFromMdxBody(readFileSync(path, 'utf8')) };
  });
});

describe('decision-tree KPI names', () => {
  it('finds the trees in both languages', () => {
    expect(arboles.filter((a) => a.locale === 'es').length).toBeGreaterThan(50);
    expect(arboles.filter((a) => a.locale === 'ca').length).toBeGreaterThan(50);
  });

  it('names every KPI of every tree in its own language', () => {
    const sinNombre = arboles.flatMap(({ path, locale, tree }) =>
      Object.keys(tree.intro.kpi_inicial)
        .filter((id) => !tree.intro.kpi_labels?.[id] && !nombreKpi(id, locale))
        .map((id) => `${path}: ${id}`),
    );
    expect(sinNombre).toEqual([]);
  });

  // The bar only lists the ids in `kpi_inicial`, so a decision that moves any
  // other id changes nothing on screen (the GPE vivero tree did this with
  // `costes_mes` and `reputacion`).
  it('only moves KPIs that the bar shows', () => {
    const invisibles = arboles.flatMap(({ path, tree }) =>
      Object.entries(tree.nodes).flatMap(([nodo, { opciones }]) =>
        opciones.flatMap((o) =>
          Object.keys(o.kpi_delta)
            .filter((id) => !(id in tree.intro.kpi_inicial))
            .map((id) => `${path} ${nodo}: ${id}`),
        ),
      ),
    );
    expect(invisibles).toEqual([]);
  });

  it('gives the Valencian edition Valencian names', () => {
    expect(nombreKpi('claridad_futuro', 'ca')).toBe('Claredat sobre el futur');
    expect(nombreKpi('claridad_futuro', 'es')).toBe('Claridad sobre el futuro');
    expect(nombreKpi('seguretat_juridica', 'ca')).toBe('Seguretat jurídica');
    expect(nombreKpi('seguretat_juridica', 'es')).toBeUndefined();
  });

  it("lets a tree's own names win and never prints an id with underscores", () => {
    expect(nombresKpi(['caja', 'nueva_metrica'], 'es', { caja: 'Tesorería' })).toEqual({
      caja: 'Tesorería',
      nueva_metrica: 'nueva metrica',
    });
    expect(kpiSinNombre('cohesion_equipo')).toBe('cohesion equipo');
  });
});
