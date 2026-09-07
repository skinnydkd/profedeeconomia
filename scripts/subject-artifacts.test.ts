import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Guard for the per-subject build artefacts the site links to unconditionally.
 *
 * `/[asignatura]/libro/` always renders the "descargar libro completo" CTA and
 * `/[asignatura]/programacion/` its own PDF link, so a subject missing from a
 * generator's subject list ships a 404 that nothing else notices — which is
 * exactly what happened when cjd-bach was added: four separate scripts carried
 * the same hardcoded nine-slug array and none of them grew the tenth.
 *
 * The generators are `build-book-pdf`, `build-workbook-pdf`,
 * `build-programacion-pdf` and `build-og-images`. This asserts their output,
 * not their source, so it stays true however they decide which subjects to
 * render.
 */
const ROOT = 'src/content/asignaturas';
const DOWNLOADS = 'public/downloads';

function isPublished(path: string): boolean {
  return /^estado:\s*['"]?publicado['"]?\s*$/m.test(readFileSync(path, 'utf8'));
}

/** Subjects with at least one published unit, and whether a CA edition exists. */
const subjects = readdirSync(ROOT, { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(join(ROOT, d.name, 'libro')))
  .map((d) => {
    const libro = join(ROOT, d.name, 'libro');
    const files = readdirSync(libro).filter((f) => /\.mdx?$/.test(f));
    const published = files.filter((f) => isPublished(join(libro, f)));
    return {
      slug: d.name,
      published: published.some((f) => !/\.ca\.mdx?$/.test(f)),
      ca: published.some((f) => /\.ca\.mdx?$/.test(f)),
    };
  })
  .filter((s) => s.published);

describe('per-subject build artefacts', () => {
  it('finds the subjects to check', () => {
    expect(subjects.length).toBeGreaterThan(0);
  });

  for (const { slug, ca } of subjects) {
    const both = (name: string) => [`${name}.pdf`, ...(ca ? [`${name}.ca.pdf`] : [])];

    it(`${slug}: the libro PDF the download CTA links to exists`, () => {
      for (const f of both(`${slug}-libro`)) {
        expect(existsSync(join(DOWNLOADS, f)), f).toBe(true);
      }
    });

    // The cuaderno prints /<slug>/actividades/imprimir/, so it only exists for
    // a subject that has activities to print.
    if (existsSync(join(ROOT, slug, 'actividades'))) {
      it(`${slug}: both cuaderno PDFs exist`, () => {
        for (const f of [...both(`${slug}-cuaderno`), ...both(`${slug}-cuaderno-alumno`)]) {
          expect(existsSync(join(DOWNLOADS, f)), f).toBe(true);
        }
      });
    }

    it(`${slug}: has an OG image`, () => {
      expect(existsSync(join('public/og', `${slug}.png`)), `${slug}.png`).toBe(true);
    });

    // The programación is authored content, not a derived artefact: a subject
    // without one has nothing to render. Where it exists, its PDF must too.
    const prog = join(ROOT, slug, 'programacion');
    if (existsSync(join(prog, 'programacion.mdx'))) {
      it(`${slug}: the programación PDF exists`, () => {
        const files = [`${slug}-programacion.pdf`];
        if (existsSync(join(prog, 'programacion.ca.mdx'))) files.push(`${slug}-programacion.ca.pdf`);
        for (const f of files) expect(existsSync(join(DOWNLOADS, f)), f).toBe(true);
      });
    }
  }
});
