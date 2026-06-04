import { describe, it, expect } from 'vitest';
import { parseMdx, findByName, getText, getAttr } from './ast.ts';

const SAMPLE = `---
asignatura: edmn-2bach
unidad: 7
title: La función productiva
conceptos_clave: [costes fijos, punto muerto]
---

## El punto muerto

Una idea breve sobre costes.

<Callout label="Concepto clave" title="Punto muerto">El umbral de rentabilidad.</Callout>
`;

describe('ast helpers', () => {
  it('splits frontmatter and parses the body to an AST', () => {
    const { frontmatter, ast } = parseMdx(SAMPLE);
    expect(frontmatter.unidad).toBe(7);
    expect(frontmatter.title).toBe('La función productiva');
    expect(ast.type).toBe('root');
  });
  it('finds components by name and reads attrs/text', () => {
    const { ast } = parseMdx(SAMPLE);
    const callouts = findByName(ast, 'Callout');
    expect(callouts).toHaveLength(1);
    expect(getAttr(callouts[0], 'title')).toBe('Punto muerto');
    expect(getText(callouts[0])).toContain('umbral de rentabilidad');
  });
});
