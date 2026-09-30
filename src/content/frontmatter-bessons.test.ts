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
 * differ.
 *
 * `estado` is compared on its own: a Spanish piece left in draft next to a
 * published translation is published in neither language (the pages are built
 * from the Spanish entries), which is how two GPE activities vanished.
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

/**
 * Pairs whose Spanish file is deliberately still a draft while the translation
 * is ready. Both were published in neither language because their Spanish file
 * had no `estado`; whether to publish them is pending the author's decision.
 * Remove a pair from here when its Spanish file is published.
 */
const ESTADO_PENDIENTE = new Set([
  'src/content/asignaturas/gpe-bach/actividades/04-caso-publicidad-responsable.md',
  'src/content/asignaturas/gpe-bach/actividades/06-debate-economia-sumergida.md',
]);

const sinComillas = (v: string | undefined) => v?.replace(/^['"]|['"]$/g, '');

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

  it('has the same estado in both languages (CODE-WEB-09)', () => {
    const diferencias = PARES.filter(({ es }) => !ESTADO_PENDIENTE.has(es.split('\\').join('/')))
      .map(({ es, ca }) => ({ es, vEs: sinComillas(campo(frontmatter(es), 'estado')), vCa: sinComillas(campo(frontmatter(ca), 'estado')) }))
      .filter(({ vEs, vCa }) => vEs !== vCa)
      .map(({ es, vEs, vCa }) => `${es}: ES=${vEs ?? '—'} CA=${vCa ?? '—'}`);
    expect(diferencias).toEqual([]);
  });

  it('keeps the pending pairs listed only while they differ', () => {
    for (const es of ESTADO_PENDIENTE) {
      const ca = es.replace(/\.(mdx?)$/, '.ca.$1');
      expect(campo(frontmatter(es), 'estado'), es).not.toBe(campo(frontmatter(ca), 'estado'));
    }
  });
});
