import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

/**
 * Guard for the `CEn` codes activities, debates and dinámicas carry.
 *
 * The codes are positional: CE*n* is the n-th competencia específica in that
 * subject's own programación, which is what makes them resolvable at all —
 * `programacion.mdx` numbers the list with exactly these codes. A card tagged
 * CE7 in a subject whose programación stops at CE6 renders a code that points
 * at nothing, and nothing else would notice.
 *
 * Two list shapes are in use and both count: `- **CE1** — capacidad` where the
 * programación states the capacities as prose, and `- **CE1. Título**: …` where
 * it quotes a legal text that titles them.
 *
 * Where the numbering comes from differs by subject — a legal text for EEAE and
 * GPE, this material's own ordering of the state capacities elsewhere — and
 * each programación says which next to its list. So this guard checks that the
 * codes resolve within their subject, never that they match some particular
 * autonomic concretion.
 */
const ROOT = 'src/content/asignaturas';

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = join(dir, d.name);
    if (d.isDirectory()) return walk(p);
    return /\.mdx?$/.test(d.name) ? [p] : [];
  });
}

function frontmatter(text: string): string {
  const m = /^---\n([\s\S]*?)\n---\n/.exec(text);
  return m ? m[1] : '';
}

/** How many competencias each subject's programación enumerates. */
const declared = new Map<string, number>(
  readdirSync(ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .flatMap((d) => {
      const path = join(ROOT, d.name, 'programacion', 'programacion.mdx');
      let text: string;
      try {
        text = readFileSync(path, 'utf8');
      } catch {
        return [];
      }
      const codes = [...text.matchAll(/^- \*\*CE(\d+)(?:\*\* —|\.)/gm)].map((m) => Number(m[1]));
      return codes.length ? ([[d.name, Math.max(...codes)]] as [string, number][]) : [];
    }),
);

interface Use {
  rel: string;
  asignatura: string;
  codes: number[];
}

const uses: Use[] = walk(ROOT).flatMap((path) => {
  const fm = frontmatter(readFileSync(path, 'utf8'));
  const line = /^competencias_especificas:\s*(.+)$/m.exec(fm);
  if (!line) return [];
  const codes = [...line[1].matchAll(/CE(\d+)/g)].map((m) => Number(m[1]));
  if (!codes.length) return [];
  const rel = relative(ROOT, path).split(sep).join('/');
  return [{ rel, asignatura: rel.split('/')[0], codes }];
});

describe('competencia específica codes', () => {
  it('every subject with activities numbers its programación', () => {
    const subjects = [...new Set(uses.map((u) => u.asignatura))].sort();
    expect(subjects.filter((s) => !declared.has(s))).toEqual([]);
  });

  it('never cites a code the subject does not declare', () => {
    const broken = uses.flatMap((u) => {
      const max = declared.get(u.asignatura);
      if (max === undefined) return [];
      const bad = u.codes.filter((c) => c < 1 || c > max);
      return bad.length ? [`${u.rel}: CE${bad.join(', CE')} (declares CE1-CE${max})`] : [];
    });
    expect(broken).toEqual([]);
  });

  it('declares a contiguous CE1..CEn range in every programación', () => {
    const gaps = [...declared].flatMap(([subject, max]) => {
      const text = readFileSync(join(ROOT, subject, 'programacion', 'programacion.mdx'), 'utf8');
      const codes = [...text.matchAll(/^- \*\*CE(\d+)(?:\*\* —|\.)/gm)].map((m) => Number(m[1]));
      const expected = Array.from({ length: max }, (_, i) => i + 1);
      return codes.join(',') === expected.join(',') ? [] : [`${subject}: ${codes.join(',')}`];
    });
    expect(gaps).toEqual([]);
  });
});
