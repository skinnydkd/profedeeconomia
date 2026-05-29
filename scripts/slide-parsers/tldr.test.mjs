import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseMdx, findComponents } from './ast.mjs';
import { renderTldr } from './tldr.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const fixture = resolve(here, '../__fixtures__/slides/sample-unit.mdx');

describe('tldr parser', () => {
  it('renders a tldr slide with the inner text', () => {
    const { ast } = parseMdx(readFileSync(fixture, 'utf8'));
    const [node] = findComponents(ast, 'TldrUnidad');
    const md = renderTldr(node);
    expect(md).toMatch(/<!-- _class: tldr -->/);
    expect(md).toMatch(/Resumen breve de la unidad/);
    expect(md).toMatch(/class="pullquote"/);
  });
});
