import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

/**
 * Regression guard for the "actividades dinámicas" quiz that rendered
 * unstyled and unclickable: the QuizPlayer styles must ship WITH the
 * component (so every page that uses it gets them), and the actividades
 * page must mount it interactively with a storageKey.
 */
describe('QuizPlayer wiring', () => {
  it('co-locates its CSS so styles ship wherever the island is used', () => {
    const src = readFileSync('src/components/QuizPlayer.tsx', 'utf8');
    expect(src).toMatch(/import\s+['"]\.\/QuizPlayer\.css['"]/);
  });

  it('the QuizPlayer.css defines the option button styles', () => {
    const css = readFileSync('src/components/QuizPlayer.css', 'utf8');
    expect(css).toContain('.qp__opt');
    expect(css).toContain('.qp__btn');
  });

  it('the actividades page mounts the quiz interactively with a storageKey', () => {
    const page = readFileSync('src/pages/[asignatura]/actividades-dinamicas/[slug].astro', 'utf8');
    const quizLine = page.split('\n').find((l) => l.includes('<QuizPlayer'));
    expect(quizLine, 'QuizPlayer usage found').toBeTruthy();
    expect(quizLine).toMatch(/storageKey=/);
    expect(quizLine).toMatch(/client:load/);
  });
});
