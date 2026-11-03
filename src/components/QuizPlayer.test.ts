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

/**
 * R6 A1: the rule that puts the verdict («¡Correcto!») on its own line caught
 * every <strong> in the feedback, and the explanations now carry their own bold
 * words, so «son **26 familias profesionales** —desde…» broke into three lines
 * in some 430 explanations. RetoPlayer loads the same stylesheet.
 */
describe('feedback verdict label', () => {
  const css = readFileSync('src/components/QuizPlayer.css', 'utf8');

  it('only the direct-child label is a block', () => {
    expect(css).toMatch(/\.qp__feedback > strong\s*\{[^}]*display:\s*block/);
    expect(css).not.toMatch(/\.qp__feedback strong\s*\{/);
  });

  it.each(['src/components/QuizPlayer.tsx', 'src/components/retos/RetoPlayer.tsx'])(
    '%s renders the verdict as that direct child',
    (path) => {
      const src = readFileSync(path, 'utf8');
      expect(src).toMatch(/<div class=\{\['qp__feedback'[^\n]*\n\s*<strong>\{acerto \? t\.correcto : t\.incorrecto\}<\/strong>/);
    },
  );
});
