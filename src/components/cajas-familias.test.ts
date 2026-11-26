import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/**
 * Book boxes come in four families, one meaning each (docs/design-system.md).
 * A box takes its surface from its family token, never from a colour of its own.
 */
const FAMILIAS: Record<string, string[]> = {
  definicion: ['Callout', 'TldrUnidad', 'KeyTakeaways'],
  digresion: ['Curiosity', 'RealExample', 'CasoReal', 'CasoDilema', 'VuelveAlCaso', 'VocesDesacuerdo', 'EnEstaFase'],
  practica: ['SolvedExercise', 'Steps', 'PistaEbau'],
  aviso: ['ErroresQueCuestan'],
};

describe('book box families', () => {
  for (const [familia, componentes] of Object.entries(FAMILIAS)) {
    for (const nombre of componentes) {
      it(`${nombre} uses the ${familia} surface`, () => {
        const css = readFileSync(`src/components/${nombre}.astro`, 'utf8');
        // The root rule is the first one in the component's <style>.
        const raiz = css.slice(css.indexOf('<style>')).match(/\{[^}]*\}/)?.[0] ?? '';
        expect(raiz).toContain(`background: var(--caja-${familia})`);
        // Practice is the only family with a border.
        expect(/border(-top|-bottom|-left|-right)?:/.test(raiz)).toBe(familia === 'practica');
      });
    }
  }

  it('Callout maps each variant to a family', () => {
    const css = readFileSync('src/components/Callout.astro', 'utf8');
    expect(css).toMatch(/\.callout--example \{ background: var\(--caja-practica\)/);
    expect(css).toMatch(/\.callout--warning \{ background: var\(--caja-aviso\)/);
    expect(css).toMatch(/\.callout--info \{ background: var\(--caja-digresion\)/);
  });
});

describe('print pages with their own palette', () => {
  // Print pages do not load global.css: they redefine the palette, so they must define the box tokens too.
  const pages = execSync('git grep -l -- "--color-bg-cream:" -- src/pages src/styles', { encoding: 'utf8' }).trim().split('\n');
  for (const file of pages) {
    it(`${file} defines the four box tokens`, () => {
      const css = readFileSync(file, 'utf8');
      for (const token of ['definicion', 'digresion', 'practica', 'practica-borde', 'aviso']) expect(css).toContain(`--caja-${token}:`);
    });
  }
});
