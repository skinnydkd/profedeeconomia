import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import {
  guiaSlug,
  materialesDePaso,
  materialesSueltos,
  materialHtmlHref,
  materialPdfHref,
  selectGuias,
  situacionSlug,
} from './situaciones';

const sa = {
  materiales: [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
  secuencia: [{ materiales: ['b'] }, { materiales: ['a', 'zzz'] }],
};

describe('material hrefs', () => {
  it('builds the html href per locale', () => {
    expect(materialHtmlHref('eco-4eso', 'ud01-cas-concorde', 'ca')).toBe(
      '/situaciones/eco-4eso/ud01-cas-concorde.ca.html',
    );
    expect(materialHtmlHref('eco-4eso', 'ud01-cas-concorde', 'es')).toBe(
      '/situaciones/eco-4eso/ud01-cas-concorde.html',
    );
  });
  it('builds the pdf href per locale', () => {
    expect(materialPdfHref('eco-4eso', 'x', 'es')).toBe('/downloads/situaciones/eco-4eso/x.pdf');
    expect(materialPdfHref('eco-4eso', 'x', 'ca')).toBe('/downloads/situaciones/eco-4eso/x.ca.pdf');
  });
});

describe('materials by step', () => {
  it('keeps the step order and skips unknown ids', () => {
    expect(materialesDePaso(sa, sa.secuencia[1]).map((m) => m.id)).toEqual(['a']);
    expect(materialesDePaso(sa, { materiales: ['c', 'a'] }).map((m) => m.id)).toEqual(['c', 'a']);
  });
  it('returns only materials no step references', () => {
    expect(materialesSueltos(sa).map((m) => m.id)).toEqual(['c']);
  });
});

describe('slugs', () => {
  it('strips folder, extension and .ca', () => {
    expect(situacionSlug({ id: 'asignaturas/eco-4eso/situaciones/concorde.ca.md' })).toBe('concorde');
    expect(situacionSlug({ id: 'asignaturas/eco-4eso/situaciones/concorde.mdx' })).toBe('concorde');
    expect(guiaSlug({ id: 'asignaturas/eco-4eso/situaciones/guias/ud01-cas-concorde-guia.ca.md' })).toBe(
      'ud01-cas-concorde-guia',
    );
  });
});

describe('selectGuias', () => {
  const g = (id: string, tipo: 'guia' | 'solucionario', lang = 'es', estado = 'publicado', material = 'm1') => ({
    id,
    data: { asignatura: 'eco-4eso', material, tipo, lang, estado },
  });
  const all = [
    g('x/m1-solucionario', 'solucionario'),
    g('x/m1-guia', 'guia'),
    g('x/m1-guia.ca', 'guia', 'ca'),
    g('x/m2-guia', 'guia', 'es', 'publicado', 'm2'),
    g('x/m1-borrador', 'guia', 'es', 'borrador'),
  ];

  it('filters by material, drops drafts, sorts guia first and swaps to ca', () => {
    expect(selectGuias(all, 'eco-4eso', 'm1', 'es').map((e) => e.id)).toEqual([
      'x/m1-guia',
      'x/m1-solucionario',
    ]);
    expect(selectGuias(all, 'eco-4eso', 'm1', 'ca').map((e) => e.id)).toEqual([
      'x/m1-guia.ca',
      'x/m1-solucionario',
    ]);
  });
});

describe('published situaciones link only to content that exists', () => {
  const root = join(process.cwd(), 'src/content/asignaturas');
  const sas = readdirSync(root).flatMap((asig) => {
    const dir = join(root, asig, 'situaciones');
    if (!existsSync(dir)) return [];
    return readdirSync(dir)
      .filter((f) => /\.mdx?$/.test(f))
      .map((f) => ({ asig, f, data: matter(readFileSync(join(dir, f), 'utf8')).data }));
  });
  const pieza = (asig: string, href: string) => {
    const [, a, coleccion, id] = href.split('/');
    return { a, base: join(root, asig, coleccion ?? '', id ?? '') };
  };

  it('every piezas href is /<asignatura>/<collection>/<id>/ and the entry exists', () => {
    for (const { asig, f, data } of sas.filter((s) => s.data.estado === 'publicado')) {
      for (const p of data.piezas ?? []) {
        const { a, base } = pieza(asig, p.href);
        expect(a, `${f}: ${p.href}`).toBe(asig);
        const ext = data.lang === 'ca' ? '.ca' : '';
        const found = ['.md', '.mdx'].some((e) => existsSync(`${base}${ext}${e}`));
        expect(found, `${f}: ${p.href} has no content entry`).toBe(true);
      }
    }
  });

  it('every unidades_libro number has a book unit', () => {
    for (const { asig, f, data } of sas.filter((s) => s.data.estado === 'publicado')) {
      const libro = join(root, asig, 'libro');
      const units = readdirSync(libro).map((n) => Number(n.slice(0, 2)));
      for (const u of data.unidades_libro ?? []) {
        expect(units, `${f}: unit ${u}`).toContain(u);
      }
    }
  });
});
