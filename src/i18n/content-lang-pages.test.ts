import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * CODE-WEB-08 / CODE-WEB-07: BaseLayout already knows what to do with a /ca/
 * page that shows Spanish text (canonical to the Spanish page, `<main lang>`,
 * no hreflang, out of the sitemap), but the content pages passed the UI locale
 * as `contentLang`, so a unit published before its translation would have gone
 * out declared Valencian. They pass the language of the entry they render, and
 * whether it has a Valencian edition; pages that never have one say so.
 */
const CONTENIDO = [
  'src/pages/[asignatura]/libro/[unidad].astro',
  'src/pages/[asignatura]/actividades/[slug].astro',
  'src/pages/[asignatura]/recursos/[slug].astro',
  'src/pages/[asignatura]/retos/[slug].astro',
  'src/pages/[asignatura]/tests/[slug].astro',
  'src/pages/[asignatura]/proyecto/[fase].astro',
  'src/pages/[asignatura]/programacion/index.astro',
  'src/pages/[asignatura]/evaluacion/index.astro',
  'src/pages/[asignatura]/ebau/index.astro',
  'src/pages/debates/[familia]/[slug].astro',
  'src/pages/dinamicas/[familia]/[slug].astro',
  'src/pages/emprendimiento/proyecto/[fase].astro',
  'src/pages/olimpiada/fichas/[slug].astro',
  'src/pages/olimpiada/textos/[slug].astro',
  'src/pages/proyectos/[materia]/[slug].astro',
];

/** Spanish in both halves of the site on purpose. */
const SOLO_CASTELLANO = [
  'src/pages/olimpiada/banco/index.astro',
  'src/pages/olimpiada/lecturas/index.astro',
  'src/pages/olimpiada/simulacros/index.astro',
  'src/pages/jocs-economics/leaderboard/index.astro',
  'src/pages/[asignatura]/ebau/examenes/index.astro',
];

/** Detail routes that gather several entries of different kinds: hubs, not one text. */
const HUBS = ['src/pages/[asignatura]/actividades-dinamicas/[slug].astro'];

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return walk(path);
    return name.endsWith('.astro') ? [path] : [];
  });
}

describe('content pages declare the language of what they show', () => {
  it.each(CONTENIDO)('%s passes the entry language and its Valencian edition', (path) => {
    const src = readFileSync(path, 'utf8');
    expect(src).not.toContain('contentLang={locale}');
    expect(src).toMatch(/contentLang=\{[^\n]*\.data\.lang/);
    expect(src).toMatch(/translated=\{[^\n]*\.ca`\)/);
  });

  it.each(SOLO_CASTELLANO)('%s says it has no Valencian edition', (path) => {
    expect(readFileSync(path, 'utf8')).toContain('translated={false}');
  });

  it('leaves no localized detail route on the UI locale', () => {
    const rutas = walk('src/pages').filter(
      (p) => /\[[^\]]+\]\.astro$/.test(p) && !HUBS.includes(p) && readFileSync(p, 'utf8').includes('pickLocalizedEntry('),
    );
    expect(rutas.length).toBeGreaterThan(10);
    expect(rutas.filter((p) => readFileSync(p, 'utf8').includes('contentLang={locale}'))).toEqual([]);
  });
});
