import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

/**
 * Guards for three design fixes of the second review (R6 A11–A13), read from
 * the stylesheets as QuizPlayer.test.ts does.
 */

/** WCAG 2 contrast ratio of two #RRGGBB colours. */
function contraste(a: string, b: string): number {
  const lum = (hex: string) => {
    const [r, g, bl] = [1, 3, 5].map((i) => {
      const c = parseInt(hex.slice(i, i + 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

describe('R6 design fixes', () => {
  it('A11: an opening menu panel stacks above one still closing', () => {
    const src = readFileSync('src/components/SiteHeader.astro', 'utf8');
    const base = Number(/\.nav-dropdown \{[^}]*z-index: (\d+)/.exec(src)?.[1]);
    const abierto = Number(/\.nav-group\.is-open \.nav-dropdown \{ z-index: (\d+); \}/.exec(src)?.[1]);
    expect(abierto).toBeGreaterThan(base);
  });

  it('A12: the letter of a wrong option passes AA on its background', () => {
    const css = readFileSync('src/components/QuizPlayer.css', 'utf8');
    const fondo = /\.qp__opt\.is-incorrect \{[^}]*background: (#[0-9A-Fa-f]{6})/.exec(css)![1];
    const letra = /\.qp__opt\.is-incorrect \.qp__opt-letra \{ color: (#[0-9A-Fa-f]{6}); \}/.exec(css)![1];
    expect(contraste(letra, fondo)).toBeGreaterThanOrEqual(4.5);
  });

  it('A13: the fichas cards have no one-side accent stripe', () => {
    const src = readFileSync('src/pages/olimpiada/fichas/index.astro', 'utf8');
    const card = /\n {2}\.card \{([^}]*)\}/.exec(src)![1];
    expect(card).not.toMatch(/border-(top|left|right|bottom):/);
    expect(card).toContain('border: 1px solid var(--color-line)');
  });
});
