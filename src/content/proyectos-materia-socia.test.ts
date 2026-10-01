import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';

/**
 * `materia_socia` states what an interdisciplinary project works from the
 * partner subject's state curriculum. In September 2026 no project said it,
 * so a Mathematics or History teacher could not tell what the project was
 * worth in their own programme. Published projects must declare it, and the
 * `.ca` twin must match: the statements are translated, but the number of
 * entries, the competence numbers ("CE6") and the saberes blocks ("A.6") are
 * not, so those are compared.
 */
const ROOT = join('src', 'content', 'proyectos');

interface Socia {
  materia: string;
  curso: string;
  competencias_especificas: string[];
  saberes: string[];
}

function read(path: string): { estado?: string; materia_socia?: Socia[] } {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(readFileSync(path, 'utf8'));
  if (!m) throw new Error(`${path}: no frontmatter`);
  return parseYaml(m[1]) as { estado?: string; materia_socia?: Socia[] };
}

const codes = (list: Socia[]) =>
  list.map((m) => ({
    ce: m.competencias_especificas.map((c) => /^CE\d+\./.exec(c)?.[0] ?? c),
    saberes: m.saberes.map((s) => /^([A-F](?:\.\d+)?)[ .]/.exec(s)?.[1] ?? s),
  }));

const PARES = readdirSync(ROOT, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .flatMap((m) =>
    readdirSync(join(ROOT, m.name))
      .filter((f) => f.endsWith('.mdx') && !f.endsWith('.ca.mdx'))
      .map((f) => join(ROOT, m.name, f)),
  )
  .map((es) => ({ es, ca: es.replace(/\.mdx$/, '.ca.mdx') }));

describe('projects state what they work from the partner subject', () => {
  it('finds the projects', () => {
    expect(PARES.length).toBeGreaterThanOrEqual(18);
  });

  for (const { es, ca } of PARES) {
    it(es, () => {
      const fmEs = read(es);
      if (fmEs.estado !== 'publicado') return;
      expect(fmEs.materia_socia?.length, 'published project without materia_socia').toBeGreaterThan(0);
      expect(existsSync(ca), 'missing .ca twin').toBe(true);
      const fmCa = read(ca);
      expect(codes(fmCa.materia_socia ?? [])).toEqual(codes(fmEs.materia_socia ?? []));
      for (const m of [...(fmEs.materia_socia ?? []), ...(fmCa.materia_socia ?? [])]) {
        for (const c of m.competencias_especificas) expect(c).toMatch(/^CE\d+\. \S/);
        for (const s of m.saberes) expect(s).toMatch(/^[A-F](\.\d+)?[ .]/);
      }
    });
  }
});
