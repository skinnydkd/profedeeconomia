import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseMdx, findComponents } from './ast.mjs';
import { renderSolvedExercise } from './solved-exercise.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const fixture = resolve(here, '../__fixtures__/slides/sample-unit.mdx');

describe('solved exercise parser', () => {
  it('returns two slides (enunciado then solución)', () => {
    const { ast } = parseMdx(readFileSync(fixture, 'utf8'));
    const [node] = findComponents(ast, 'SolvedExercise');
    const slides = renderSolvedExercise(node);
    expect(slides).toHaveLength(2);
    expect(slides[0]).toMatch(/ENUNCIADO/);
    expect(slides[1]).toMatch(/SOLUCIÓN/);
    expect(slides[1]).toMatch(/1\.000 unidades/);
  });
});
