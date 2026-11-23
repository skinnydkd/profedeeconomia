import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { CAMPOS_GRAFICO, type GraficoRefuerzo } from '@/lib/refuerzo';

/**
 * The charts of the refuerzo notebooks live in frontmatter as loose `props`,
 * so the schema cannot tell a chart that will render from one that will throw
 * at build time. This guard checks the fields each chart type needs, that ids
 * are unique within a subject (its six notebooks share one page) and that the
 * Valencian twin carries the same charts.
 */
const ROOT = 'src/content/asignaturas';
type Item = { grafico?: GraficoRefuerzo };

function graficos(file: string): GraficoRefuerzo[] {
  const d = matter(readFileSync(file, 'utf8')).data as { repaso_teorico?: Item[]; ejemplos_resueltos?: Item[] };
  return [...(d.repaso_teorico ?? []), ...(d.ejemplos_resueltos ?? [])].flatMap((i) => (i.grafico ? [i.grafico] : []));
}

const subjects = readdirSync(ROOT).filter((s) => existsSync(join(ROOT, s, 'refuerzo')));

describe('refuerzo charts', () => {
  it.each(subjects)('%s: every chart has what its component needs', (s) => {
    const dir = join(ROOT, s, 'refuerzo');
    const problemas: string[] = [];
    for (const lang of ['es', 'ca'] as const) {
      const ids: string[] = [];
      for (const f of readdirSync(dir).filter((n) => n.endsWith('.mdx') && n.endsWith('.ca.mdx') === (lang === 'ca'))) {
        for (const g of graficos(join(dir, f))) {
          for (const campo of CAMPOS_GRAFICO[g.tipo] ?? ['tipo']) {
            if (g.props?.[campo] === undefined) problemas.push(`${f}: ${String(g.props?.id)} lacks ${campo}`);
          }
          if (!g.caption) problemas.push(`${f}: ${String(g.props?.id)} lacks caption`);
          ids.push(String(g.props?.id));
        }
      }
      const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
      if (dup.length) problemas.push(`${lang}: duplicate ids ${dup.join(', ')}`);
    }
    expect(problemas).toEqual([]);
  });

  it.each(subjects)('%s: the Valencian twin carries the same charts', (s) => {
    const dir = join(ROOT, s, 'refuerzo');
    for (const f of readdirSync(dir).filter((n) => n.endsWith('.mdx') && !n.endsWith('.ca.mdx'))) {
      const twin = join(dir, f.replace(/\.mdx$/, '.ca.mdx'));
      if (!existsSync(twin)) continue;
      const ids = (file: string) => graficos(file).map((g) => g.props.id);
      expect(ids(twin), f).toEqual(ids(join(dir, f)));
    }
  });
});
