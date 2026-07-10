import { describe, it, expect } from 'vitest';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import {
  localizeFicha,
  DEBATES_CA,
  DINAMICAS_CA,
  PROYECTOS_CA,
  type FichaOverlay,
} from './fichas-ca';

/**
 * The entries live in `src/content/<coleccion>/<familia>/<nn-slug>.mdx` and the
 * hubs key them by `familia/nn-slug`. `astro:content` is not importable from
 * Vitest, so the slugs are read straight off the filesystem.
 */
function slugsOf(coleccion: string): string[] {
  const root = join('src', 'content', coleccion);
  return readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .flatMap((familia) =>
      readdirSync(join(root, familia.name))
        .filter((f) => f.endsWith('.mdx'))
        .map((f) => `${familia.name}/${f.replace(/\.mdx$/, '')}`),
    );
}

const cases: [string, FichaOverlay][] = [
  ['debates', DEBATES_CA],
  ['dinamicas', DINAMICAS_CA],
  ['proyectos', PROYECTOS_CA],
];

const SAMPLE = { title: 'El salario mínimo', descripcion: 'Un debate', duracion: '50-55 min' };
const SAMPLE_SLUG = 'mercado-estado/01-salario-minimo';

describe('localizeFicha', () => {
  it('es returns the frontmatter unchanged', () => {
    expect(localizeFicha(SAMPLE, SAMPLE_SLUG, DEBATES_CA, 'es')).toEqual(SAMPLE);
  });

  it('ca overlays the title and preserves untranslated fields', () => {
    const data = localizeFicha({ ...SAMPLE, formato: 'parlamentario' }, SAMPLE_SLUG, DEBATES_CA, 'ca');
    expect(data.title).not.toBe(SAMPLE.title);
    expect(data.formato).toBe('parlamentario');
  });

  it('ca leaves an unknown slug untouched (clean ES fallback)', () => {
    expect(localizeFicha(SAMPLE, 'no/existe', DEBATES_CA, 'ca')).toEqual(SAMPLE);
  });

  for (const [coleccion, overlay] of cases) {
    it(`${coleccion}: every overlay key is a real entry slug`, () => {
      const slugs = new Set(slugsOf(coleccion));
      for (const key of Object.keys(overlay)) expect(slugs.has(key)).toBe(true);
    });

    it(`${coleccion}: every entry has a CA overlay`, () => {
      for (const slug of slugsOf(coleccion)) expect(overlay[slug]).toBeDefined();
    });

    it(`${coleccion}: every overlay translates title and descripcion`, () => {
      for (const [slug, ficha] of Object.entries(overlay)) {
        expect(ficha?.title, slug).toBeTruthy();
        expect(ficha?.descripcion, slug).toBeTruthy();
      }
    });
  }
});
