import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

/**
 * The exam guide (GUIA) only holds Spanish text; its Valencian copy comes from
 * localizeGuia(). /ca/olimpiada/simulacros/ showed «2 horas y media» because the
 * page read GUIA directly. Every page that imports GUIA has to localize it.
 */
const pagesDir = join(process.cwd(), 'src', 'pages');

function astroFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return astroFiles(path);
    return name.endsWith('.astro') ? [path] : [];
  });
}

const usesGuia = astroFiles(pagesDir).filter((f) => /import\s*\{[^}]*\bGUIA\b[^}]*\}\s*from\s*'@\/lib\/olimpiada'/.test(readFileSync(f, 'utf8')));

describe('exam guide pages', () => {
  it('there is at least one page with the exam guide', () => {
    expect(usesGuia.length).toBeGreaterThan(0);
  });

  it.each(usesGuia.map((f) => [relative(pagesDir, f), f]))('%s shows the guide in the page language', (_name, file) => {
    const src = readFileSync(file, 'utf8');
    expect(src).toMatch(/localizeGuia\(GUIA, locale\)/);
    // No field read straight from the Spanish-only object.
    expect(src).not.toMatch(/\bGUIA\.(duracion|total|partes)/);
  });
});
