import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { nivelesDe } from '../lib/debates-niveles';

/**
 * A rubric says what each level looks like.
 *
 * A criterion with a description but no levels is a rating scale: two teachers
 * score the same work differently and the student cannot tell what a «3» asks
 * for. And an activity that lists «rúbrica impresa» among its materials has to
 * carry the rubric it asks the teacher to print.
 */
type Criterio = { criterio: string; niveles?: string[] };

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  );
}
const datos = (f: string) => matter(readFileSync(f, 'utf8')).data;
const rubrica = (f: string) => (datos(f).rubrica ?? []) as Criterio[];
const esCa = (f: string) => /\.ca\.mdx?$/.test(f);
const bessona = (f: string) => f.replace(/\.(mdx?)$/, '.ca.$1');

describe('rubric levels', () => {
  for (const coleccion of ['debates']) {
    const archivos = walk(join('src/content', coleccion)).filter((f) => /\.mdx?$/.test(f));

    it(`${coleccion}: every criterion has four level descriptors`, () => {
      const sin: string[] = [];
      for (const f of archivos) {
        const locale = esCa(f) ? 'ca' : 'es';
        for (const r of rubrica(f)) {
          const niveles = r.niveles ?? nivelesDe(r.criterio, locale);
          if (!niveles || niveles.length !== 4 || niveles.some((n) => !n.trim())) sin.push(`${f}: ${r.criterio}`);
        }
      }
      expect(sin).toEqual([]);
    });

    it(`${coleccion}: the Valencian twin has as many criteria`, () => {
      const distintos = archivos
        .filter((f) => !esCa(f) && existsSync(bessona(f)))
        .filter((f) => rubrica(f).length !== rubrica(bessona(f)).length);
      expect(distintos).toEqual([]);
    });
  }

  it('proyectos: the body spells out the levels of every criterion', () => {
    // Projects write their levels in the body («Niveles de logro»), under each criterion name.
    const sin: string[] = [];
    for (const f of walk('src/content/proyectos').filter((x) => /\.mdx?$/.test(x))) {
      const { data, content } = matter(readFileSync(f, 'utf8'));
      for (const r of (data.rubrica ?? []) as Criterio[]) {
        if (!content.includes('**' + r.criterio + '**')) sin.push(f + ': ' + r.criterio);
      }
    }
    expect(sin).toEqual([]);
  });

  it('activities that list a rubric among their materials carry it, in both languages', () => {
    const fallos: string[] = [];
    for (const asig of readdirSync('src/content/asignaturas')) {
      const dir = join('src/content/asignaturas', asig, 'actividades');
      if (!existsSync(dir)) continue;
      for (const f of readdirSync(dir).filter((x) => /\.mdx?$/.test(x)).map((x) => join(dir, x))) {
        const { data, content } = matter(readFileSync(f, 'utf8'));
        const enMateriales = /r[úu]brica/i.test(JSON.stringify(data.materiales ?? []));
        const enCuerpo = /^##.*r[úu]brica/im.test(content);
        const propia = ((data.rubrica ?? []) as Criterio[]).length;
        if (enMateriales && !enCuerpo && propia === 0) fallos.push(`${f}: asks for a rubric and has none`);
        if (!esCa(f) && existsSync(bessona(f)) && propia !== rubrica(bessona(f)).length) fallos.push(`${f}: twin differs`);
      }
    }
    expect(fallos).toEqual([]);
  }, 20_000);
});
