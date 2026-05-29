import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseMdx, findComponents } from './ast.mjs';
import { readImports } from './imports.mjs';
import { renderFigure } from './figure.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const fixture = resolve(here, '../__fixtures__/slides/sample-unit.mdx');

describe('figure parser', () => {
  it('emits an img with a file:// url resolved from the imports map', () => {
    const { ast } = parseMdx(readFileSync(fixture, 'utf8'));
    const imports = readImports(ast);
    const [fig] = findComponents(ast, 'Figure');
    const md = renderFigure(fig, imports);
    expect(md).toMatch(/<!-- _class: figure -->/);
    expect(md).toMatch(/data:image\/jpeg;base64,/);
    expect(md).toMatch(/caption de prueba/);
  });
});
