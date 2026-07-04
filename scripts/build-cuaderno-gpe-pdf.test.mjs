import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputsOf = (script) =>
  [...readFileSync(resolve(root, 'scripts', script), 'utf8').matchAll(/out:\s*'([^']+)'/g)].map(
    (m) => m[1],
  );

describe('project cuaderno PDF output names', () => {
  it('gpe project cuaderno names do not collide with the activity workbook names', () => {
    // build-workbook-pdf.mjs writes <slug>-cuaderno.pdf and <slug>-cuaderno-alumno.pdf
    // for every subject (incl. gpe-bach). The project cuaderno must use distinct names.
    const workbookNames = ['gpe-bach-cuaderno.pdf', 'gpe-bach-cuaderno-alumno.pdf'];
    const collisions = outputsOf('build-cuaderno-gpe-pdf.mjs').filter((o) =>
      workbookNames.includes(o),
    );
    expect(collisions).toEqual([]);
  });
});
