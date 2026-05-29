import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseMdx, findComponents, getText } from './ast.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const fixture = resolve(here, '../__fixtures__/slides/sample-unit.mdx');

describe('ast helpers', () => {
  it('parseMdx returns frontmatter + ast', () => {
    const { frontmatter, ast } = parseMdx(readFileSync(fixture, 'utf8'));
    expect(frontmatter.title).toBe('Unidad de prueba');
    expect(frontmatter.unidad).toBe(99);
    expect(ast.type).toBe('root');
  });

  it('findComponents locates JSX elements by name', () => {
    const { ast } = parseMdx(readFileSync(fixture, 'utf8'));
    const tldrs = findComponents(ast, 'TldrUnidad');
    expect(tldrs).toHaveLength(1);
    const figures = findComponents(ast, 'Figure');
    expect(figures).toHaveLength(1);
  });

  it('getText collects plain text from a subtree', () => {
    const { ast } = parseMdx(readFileSync(fixture, 'utf8'));
    const [tldr] = findComponents(ast, 'TldrUnidad');
    expect(getText(tldr)).toContain('Resumen breve');
  });
});
