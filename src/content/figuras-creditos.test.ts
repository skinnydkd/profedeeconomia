import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Every photograph in the books says who made it and under which terms.
 *
 * A credit with an author but no licence cannot be checked by a teacher who
 * wants to reuse the page, and an `alt` that repeats the caption reads twice
 * on a screen reader.
 */
const ASIGNATURAS = 'src/content/asignaturas';
const LICENCIA =
  /CC[ -]?(BY|0)|dominio público|domini públic|sin restricciones de copyright|sense restriccions de copyright|elaboración propia|elaboració pròpia|GFDL|OGL|licencia|llicència/i;

const prop = (attrs: string, k: string) => attrs.match(new RegExp(`${k}="([^"]*)"`))?.[1];

describe('figure credits', () => {
  for (const asig of readdirSync(ASIGNATURAS)) {
    const dir = join(ASIGNATURAS, asig, 'libro');
    if (!existsSync(dir)) continue;
    it(`${asig}: every figure has a credit with its licence and an alt of its own`, () => {
      const fallos: string[] = [];
      for (const f of readdirSync(dir).filter((x) => x.endsWith('.mdx'))) {
        const texto = readFileSync(join(dir, f), 'utf8');
        for (const m of texto.matchAll(/<Figure\b([\s\S]*?)\/>/g)) {
          const src = m[1].match(/src=\{(\w+)\}/)?.[1] ?? '?';
          const credit = prop(m[1], 'credit');
          const alt = prop(m[1], 'alt');
          if (!credit) fallos.push(`${f} ${src}: no credit`);
          else if (!LICENCIA.test(credit)) fallos.push(`${f} ${src}: credit without licence`);
          else if (credit.includes('&amp;')) fallos.push(`${f} ${src}: &amp; in credit`);
          if (alt && alt.trim() === prop(m[1], 'caption')?.trim()) fallos.push(`${f} ${src}: alt repeats the caption`);
        }
      }
      expect(fallos).toEqual([]);
    });
  }
});
