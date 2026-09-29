import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Guard for Spanish/Catalan twins whose metadata drifted apart.
 *
 * Every piece has a Spanish file and a `.ca` twin. The text is translated,
 * but the metadata that places the piece in the course is not: in September
 * 2026 the Catalan challenges and dynamics of Eco 4ESO still hung from the
 * units and competences of the old 10-unit structure, so they would have been
 * listed under the wrong unit as soon as Catalan went live. Only the fields
 * below must match; titles, descriptions, `lang` and `slug` are expected to
 * differ. `estado` is left out on purpose: publishing a Spanish piece is an
 * editorial decision, and `asignaturas-ca-parity.test.ts` already requires
 * every Catalan twin to be published.
 */
const ROOT = 'src/content';

const CAMPOS = [
  'asignatura',
  'unidad',
  'unidad_relacionada',
  'competencia',
  'competencia_especifica',
  'competencias_especificas',
  'competencias_clave',
  'tipo',
  'ebau',
  'orden',
] as const;

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return walk(path);
    return /\.mdx?$/.test(name) && !/\.ca\.mdx?$/.test(name) ? [path] : [];
  });
}

function frontmatter(path: string): string {
  const match = /^---\n([\s\S]*?)\n---/.exec(readFileSync(path, 'utf8'));
  return match ? match[1] : '';
}

function campo(fm: string, key: string): string | undefined {
  const match = new RegExp(`^${key}: (.*)$`, 'm').exec(fm);
  return match ? match[1].trim() : undefined;
}

const PARES = walk(ROOT)
  .map((es) => ({ es, ca: es.replace(/\.(mdx?)$/, '.ca.$1') }))
  .filter(({ ca }) => existsSync(ca));

describe('ES/CA twins share their placement metadata', () => {
  it('finds twins to compare', () => {
    expect(PARES.length).toBeGreaterThan(100);
  });

  it('has the same unit and competences in both languages', () => {
    const diferencias: string[] = [];
    for (const { es, ca } of PARES) {
      const fmEs = frontmatter(es);
      const fmCa = frontmatter(ca);
      for (const key of CAMPOS) {
        const vEs = campo(fmEs, key);
        const vCa = campo(fmCa, key);
        if (vEs !== vCa) diferencias.push(`${es} · ${key}: ES=${vEs ?? '—'} CA=${vCa ?? '—'}`);
      }
    }
    expect(diferencias).toEqual([]);
  });
});
